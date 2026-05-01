import { Prisma, PrismaClient } from "@prisma/client";
import { PHASE_LABELS } from "@/lib/constants";
import { renderInvoiceNumber } from "@/lib/invoice-numbering";

type Tx = Prisma.TransactionClient | PrismaClient;

export type BuildInvoiceFromTimesheetResult =
  | {
      kind: "INVOICED";
      invoiceId: string;
      invoiceNumber: string;
      total: number;
      sourceEntryCount: number;
      lineItemCount: number;
    }
  | {
      kind: "SKIPPED_NO_HOURS";
      reason: string;
    }
  | {
      kind: "ALREADY_INVOICED";
      reason: string;
    };

export type BuildInvoiceParams = {
  tx: Tx;
  organizationId: string;
  projectId: string;
  periodStart: Date;
  periodEnd: Date;
  // Defaults to today if omitted.
  issueDate?: Date;
  // Defaults to issueDate + 30 days if omitted.
  dueDate?: Date;
  notes?: string | null;
};

/**
 * Builds a DRAFT invoice from approved + billable + un-invoiced time entries
 * on the given project in the given calendar window. Used by both the
 * manual "Pull from timesheets" flow and the monthly auto-invoicing cron.
 *
 * Idempotency: if an invoice already exists covering the exact same period
 * for this project, returns ALREADY_INVOICED without creating a duplicate.
 *
 * NOTE: caller must run this inside a transaction OR pass the prisma client
 * directly. The function uses Prisma.TransactionClient so a parent
 * transaction's atomicity covers the auto-numbering + invoice insert +
 * time-entry tagging.
 */
export async function buildInvoiceFromTimesheet({
  tx,
  organizationId,
  projectId,
  periodStart,
  periodEnd,
  issueDate,
  dueDate,
  notes,
}: BuildInvoiceParams): Promise<BuildInvoiceFromTimesheetResult> {
  // Idempotency check first — cheaper than the timesheet query.
  const existingInvoice = await tx.invoice.findFirst({
    where: {
      projectId,
      periodStart,
      periodEnd,
    },
    select: { id: true, invoiceNumber: true, total: true },
  });
  if (existingInvoice) {
    return {
      kind: "ALREADY_INVOICED",
      reason: `Invoice ${existingInvoice.invoiceNumber} already covers ${periodStart.toISOString().slice(0, 10)} – ${periodEnd.toISOString().slice(0, 10)}.`,
    };
  }

  // Pull approved-week, billable, not-yet-invoiced entries on this project
  // in the given range.
  const candidateEntries = await tx.timeEntry.findMany({
    where: {
      organizationId,
      projectId,
      isBillable: true,
      invoiceId: null,
      date: { gte: periodStart, lte: periodEnd },
    },
    include: {
      user: { select: { id: true, fullName: true, billingRate: true } },
      phase: { select: { phaseType: true, customName: true } },
    },
    orderBy: [{ phaseId: "asc" }, { userId: "asc" }, { date: "asc" }],
  });

  if (candidateEntries.length === 0) {
    return { kind: "SKIPPED_NO_HOURS", reason: "No billable, un-invoiced hours in period." };
  }

  // Filter to entries whose week is APPROVED. Same in-memory join as the
  // timesheet-preview endpoint; keeps SQL simple.
  function weekStartOf(d: Date): Date {
    const monday = new Date(d);
    const day = monday.getDay();
    const diff = (day + 6) % 7;
    monday.setDate(monday.getDate() - diff);
    monday.setHours(0, 0, 0, 0);
    return monday;
  }
  const weekKeys = new Set<string>();
  for (const e of candidateEntries) {
    weekKeys.add(`${e.userId}|${weekStartOf(e.date).toISOString()}`);
  }
  const sheets = await tx.weeklyTimesheet.findMany({
    where: {
      OR: Array.from(weekKeys).map((k) => {
        const [userId, weekStartStr] = k.split("|");
        return { userId, weekStart: new Date(weekStartStr) };
      }),
    },
  });
  const approvedWeekKeys = new Set<string>();
  for (const s of sheets) {
    if (s.status === "APPROVED") {
      approvedWeekKeys.add(`${s.userId}|${s.weekStart.toISOString()}`);
    }
  }
  const billableEntries = candidateEntries.filter((e) =>
    approvedWeekKeys.has(`${e.userId}|${weekStartOf(e.date).toISOString()}`)
  );

  if (billableEntries.length === 0) {
    return { kind: "SKIPPED_NO_HOURS", reason: "No approved billable hours in period." };
  }

  // Group by phase + user → one line item per group.
  const groups = new Map<
    string,
    {
      phaseLabel: string;
      userName: string;
      hours: number;
      rate: number;
      sourceEntryIds: string[];
    }
  >();
  for (const e of billableEntries) {
    const phaseLabel = e.phase
      ? e.phase.customName || PHASE_LABELS[e.phase.phaseType] || e.phase.phaseType
      : "Other";
    const userName = e.user.fullName;
    const rate = Number(e.user.billingRate ?? 0);
    const key = `${e.phaseId ?? "none"}|${e.userId}|${rate}`;
    const existing = groups.get(key);
    if (existing) {
      existing.hours += Number(e.hours);
      existing.sourceEntryIds.push(e.id);
    } else {
      groups.set(key, {
        phaseLabel,
        userName,
        hours: Number(e.hours),
        rate,
        sourceEntryIds: [e.id],
      });
    }
  }

  const lineItemPayloads = Array.from(groups.values()).map((g) => ({
    description: `${g.phaseLabel} — ${g.userName}`,
    quantity: new Prisma.Decimal(g.hours.toFixed(2)),
    unitPrice: new Prisma.Decimal(g.rate),
    amount: new Prisma.Decimal((g.hours * g.rate).toFixed(2)),
    sourceEntryIds: g.sourceEntryIds,
  }));

  const subtotal = lineItemPayloads.reduce(
    (sum, li) => sum + Number(li.amount),
    0
  );

  // Resolve invoice number — same auto-numbering pattern as the manual
  // POST. Increments the org counter atomically inside the transaction.
  const org = await tx.organization.update({
    where: { id: organizationId },
    data: { invoiceNumberNext: { increment: 1 } },
    select: {
      invoiceNumberNext: true,
      invoiceNumberPrefix: true,
      invoiceNumberFormat: true,
      autoNumberInvoices: true,
    },
  });
  if (!org.autoNumberInvoices) {
    // Auto-numbering is off — caller (the manual POST flow) should handle
    // numbering itself. The cron only runs when auto-numbering is on
    // (firms can disable it per-org if they have an external scheme).
    // Roll back the counter we just claimed.
    await tx.organization.update({
      where: { id: organizationId },
      data: { invoiceNumberNext: { decrement: 1 } },
    });
    throw new Error("Auto-numbering is disabled for this organization.");
  }
  const used = org.invoiceNumberNext - 1;
  const invoiceNumber = renderInvoiceNumber(
    org.invoiceNumberFormat,
    org.invoiceNumberPrefix,
    used
  );

  const resolvedIssueDate = issueDate ?? new Date();
  const resolvedDueDate =
    dueDate ??
    (() => {
      const d = new Date(resolvedIssueDate);
      d.setDate(d.getDate() + 30);
      return d;
    })();

  const created = await tx.invoice.create({
    data: {
      organizationId,
      projectId,
      invoiceNumber,
      issueDate: resolvedIssueDate,
      dueDate: resolvedDueDate,
      periodStart,
      periodEnd,
      subtotal: new Prisma.Decimal(subtotal),
      total: new Prisma.Decimal(subtotal),
      notes: notes ?? null,
      lineItems: {
        create: lineItemPayloads.map((li) => ({
          description: li.description,
          quantity: li.quantity,
          unitPrice: li.unitPrice,
          amount: li.amount,
        })),
      },
    },
    select: { id: true, invoiceNumber: true, total: true },
  });

  // Tag every source TimeEntry so it can't be billed twice. updateMany
  // is fine here — concurrent cron runs are guarded by the BillingEvent
  // unique index in the caller.
  const allSourceIds = lineItemPayloads.flatMap((li) => li.sourceEntryIds);
  await tx.timeEntry.updateMany({
    where: {
      id: { in: allSourceIds },
      organizationId,
      invoiceId: null,
    },
    data: {
      invoiceId: created.id,
      invoicedAt: new Date(),
    },
  });

  return {
    kind: "INVOICED",
    invoiceId: created.id,
    invoiceNumber: created.invoiceNumber,
    total: Number(created.total),
    sourceEntryCount: allSourceIds.length,
    lineItemCount: lineItemPayloads.length,
  };
}

/**
 * Returns { start, end } for the previous calendar month relative to `now`.
 * Used by the monthly cron to determine which period to invoice.
 */
export function previousCalendarMonth(now: Date = new Date()): {
  start: Date;
  end: Date;
} {
  const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  start.setHours(0, 0, 0, 0);
  // Last day of previous month = day 0 of current month.
  const end = new Date(now.getFullYear(), now.getMonth(), 0);
  end.setHours(23, 59, 59, 999);
  return { start, end };
}
