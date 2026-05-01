import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/supabase/auth";
import { PHASE_LABELS } from "@/lib/constants";

export const dynamic = "force-dynamic";

/**
 * GET /api/invoices/timesheet-preview?projectId=&from=&to=
 *
 * Returns proposed invoice line items derived from billable, approved time
 * entries for the project in the given period. Entries that have already
 * been invoiced (invoicedAt set) are excluded so they don't get billed
 * twice. The client takes the response, lets the user edit, then sends
 * the final list (with the source entry IDs) back to POST /api/invoices.
 *
 * Why "approved" only: half-finished drafts shouldn't sneak into bills.
 * If the firm wants to invoice DRAFT/SUBMITTED time, they need to walk
 * through the timesheet approval flow first.
 */
export async function GET(request: Request) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  if (currentUser.role !== "OWNER" && currentUser.role !== "ADMIN") {
    return NextResponse.json({ error: "Only owners and admins can preview invoices." }, { status: 403 });
  }

  const url = new URL(request.url);
  const projectId = url.searchParams.get("projectId");
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");
  // mode = "summary" (default) returns one line per phase with weighted
  // average rate — used for fixed-fee billing where firms don't want
  // to expose individual staff rates to clients.
  // mode = "detailed" returns one line per (phase, person) — used for
  // T&M billing where transparency is expected.
  const mode = url.searchParams.get("mode") === "detailed" ? "detailed" : "summary";

  if (!projectId || !from || !to) {
    return NextResponse.json(
      { error: "projectId, from, and to are required." },
      { status: 400 }
    );
  }

  const fromDate = new Date(from);
  const toDate = new Date(to);
  if (Number.isNaN(fromDate.getTime()) || Number.isNaN(toDate.getTime())) {
    return NextResponse.json({ error: "Invalid date range." }, { status: 400 });
  }

  // Verify project belongs to the org.
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { organizationId: true },
  });
  if (!project || project.organizationId !== currentUser.organizationId) {
    return NextResponse.json({ error: "Project not found." }, { status: 404 });
  }

  // Pull approved-week, billable, not-yet-invoiced time entries on this
  // project in the given range. Approval status lives on WeeklyTimesheet
  // (per-user × week), not on TimeEntry, so we filter by joining through
  // the user × week.
  const entries = await prisma.timeEntry.findMany({
    where: {
      organizationId: currentUser.organizationId,
      projectId,
      isBillable: true,
      invoiceId: null,
      date: { gte: fromDate, lte: toDate },
    },
    include: {
      user: {
        select: { id: true, fullName: true, billingRate: true },
      },
      phase: {
        select: { id: true, phaseType: true, customName: true },
      },
    },
    orderBy: [{ phaseId: "asc" }, { userId: "asc" }, { date: "asc" }],
  });

  // Filter to entries whose week is APPROVED. We do this in memory to
  // avoid a complex SQL — the typical period is ~4 weeks × team size,
  // so the row count is small.
  const weekStartCache = new Map<string, Date>();
  const approvedWeekKeys = new Set<string>();
  function weekStartOf(d: Date): Date {
    const key = d.toISOString().slice(0, 10);
    const cached = weekStartCache.get(key);
    if (cached) return cached;
    const monday = new Date(d);
    const day = monday.getDay();
    const diff = (day + 6) % 7;
    monday.setDate(monday.getDate() - diff);
    monday.setHours(0, 0, 0, 0);
    weekStartCache.set(key, monday);
    return monday;
  }

  const weekKeysNeeded = new Set<string>();
  for (const e of entries) {
    weekKeysNeeded.add(`${e.userId}|${weekStartOf(e.date).toISOString()}`);
  }
  const sheets = await prisma.weeklyTimesheet.findMany({
    where: {
      OR: Array.from(weekKeysNeeded).map((k) => {
        const [userId, weekStartStr] = k.split("|");
        return { userId, weekStart: new Date(weekStartStr) };
      }),
    },
  });
  for (const s of sheets) {
    if (s.status === "APPROVED") {
      approvedWeekKeys.add(`${s.userId}|${s.weekStart.toISOString()}`);
    }
  }

  const billableEntries = entries.filter((e) =>
    approvedWeekKeys.has(`${e.userId}|${weekStartOf(e.date).toISOString()}`)
  );

  // First pass: always group by (phase, user, rate) — this is the
  // detailed-mode shape AND the source for summary-mode aggregation.
  type DetailGroup = {
    phaseLabel: string;
    userName: string;
    hours: number;
    rate: number;
    sourceEntryIds: string[];
  };
  const detailGroups = new Map<string, DetailGroup>();

  for (const e of billableEntries) {
    const phaseLabel = e.phase
      ? e.phase.customName || PHASE_LABELS[e.phase.phaseType] || e.phase.phaseType
      : "Other";
    const userName = e.user.fullName;
    const rate = Number(e.user.billingRate ?? 0);
    const key = `${e.phaseId ?? "none"}|${e.userId}|${rate}`;

    const existing = detailGroups.get(key);
    if (existing) {
      existing.hours += Number(e.hours);
      existing.sourceEntryIds.push(e.id);
    } else {
      detailGroups.set(key, {
        phaseLabel,
        userName,
        hours: Number(e.hours),
        rate,
        sourceEntryIds: [e.id],
      });
    }
  }

  let lineItems: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number;
    sourceEntryIds: string[];
  }>;

  if (mode === "detailed") {
    // One line per (phase, person) — staff name + rate visible.
    lineItems = Array.from(detailGroups.values()).map((g) => ({
      description: `${g.phaseLabel} — ${g.userName}`,
      quantity: Number(g.hours.toFixed(2)),
      unitPrice: g.rate,
      amount: Number((g.hours * g.rate).toFixed(2)),
      sourceEntryIds: g.sourceEntryIds,
    }));
  } else {
    // Summary mode: collapse to one line per phase. Description hides
    // staff names. Rate is weighted-average across the people who
    // worked on the phase, which gives a consistent display value
    // even though firms billing summary often don't show per-hour
    // rate at all (the total is what matters).
    type SummaryGroup = {
      phaseLabel: string;
      hours: number;
      amount: number;
      sourceEntryIds: string[];
    };
    const phaseGroups = new Map<string, SummaryGroup>();
    for (const dg of detailGroups.values()) {
      const existing = phaseGroups.get(dg.phaseLabel);
      const subAmount = dg.hours * dg.rate;
      if (existing) {
        existing.hours += dg.hours;
        existing.amount += subAmount;
        existing.sourceEntryIds.push(...dg.sourceEntryIds);
      } else {
        phaseGroups.set(dg.phaseLabel, {
          phaseLabel: dg.phaseLabel,
          hours: dg.hours,
          amount: subAmount,
          sourceEntryIds: [...dg.sourceEntryIds],
        });
      }
    }
    lineItems = Array.from(phaseGroups.values()).map((g) => ({
      description: `${g.phaseLabel} — Professional Services`,
      quantity: Number(g.hours.toFixed(2)),
      // Weighted-average rate so quantity × unitPrice = amount.
      unitPrice: g.hours > 0 ? Number((g.amount / g.hours).toFixed(2)) : 0,
      amount: Number(g.amount.toFixed(2)),
      sourceEntryIds: g.sourceEntryIds,
    }));
  }

  // Distinct phase labels for the PDF "Services include..." sentence.
  const phases = Array.from(
    new Set(Array.from(detailGroups.values()).map((g) => g.phaseLabel))
  );

  // Counts surface in the UI: "12 entries from 3 weeks (approved)" gives
  // the user confidence in what's being pulled before they save.
  return NextResponse.json({
    lineItems,
    phases,
    summary: {
      totalEntries: billableEntries.length,
      totalHours: Number(
        billableEntries
          .reduce((sum, e) => sum + Number(e.hours), 0)
          .toFixed(2)
      ),
      skippedNotApproved: entries.length - billableEntries.length,
    },
  });
}
