import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  buildInvoiceFromTimesheet,
  previousCalendarMonth,
} from "@/lib/invoice-builder";

export const dynamic = "force-dynamic";

/**
 * GET /api/cron/monthly-invoicing
 *
 * Runs early in the first week of each month. For every non-archived
 * project across every organization, attempts to create a DRAFT invoice
 * for last calendar month's approved + billable + un-invoiced hours.
 *
 * Per Kevin's spec (2026-04-30):
 *  - All non-archived projects with any approved + billable + un-invoiced
 *    time in the period
 *  - Strict calendar month: 1st – last day of last month
 *  - Skip projects with zero billable hours, but record a BillingEvent
 *    so the project's billing section can show "Skipped Feb 2026" and
 *    the user knows nothing fell through the cracks.
 *
 * Auth: Vercel Cron sets Authorization: Bearer ${CRON_SECRET}. Local /
 * manual triggers can pass the same header. No fall-through — missing
 * or wrong secret returns 401.
 *
 * Idempotency: each (project, periodStart) combination is touched at
 * most once per cron run. If an invoice already exists for that exact
 * period, the builder returns ALREADY_INVOICED and we don't create a
 * second one. If a SKIPPED BillingEvent already exists, we skip again
 * silently. Vercel can re-fire on transient failure with no harm.
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const expected = `Bearer ${process.env.CRON_SECRET ?? ""}`;
  if (!process.env.CRON_SECRET || authHeader !== expected) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { start: periodStart, end: periodEnd } = previousCalendarMonth();

  // Find every non-archived project. We page by org for tidy logging,
  // but a single big findMany would also work — there's no scale
  // pressure here yet.
  const projects = await prisma.project.findMany({
    where: { status: { not: "ARCHIVED" } },
    select: { id: true, organizationId: true, name: true },
  });

  type Outcome =
    | { projectId: string; projectName: string; status: "INVOICED"; invoiceNumber: string; total: number }
    | { projectId: string; projectName: string; status: "SKIPPED_NO_HOURS" }
    | { projectId: string; projectName: string; status: "ALREADY_INVOICED" }
    | { projectId: string; projectName: string; status: "ALREADY_SKIPPED" }
    | { projectId: string; projectName: string; status: "ERROR"; error: string };

  const outcomes: Outcome[] = [];

  for (const project of projects) {
    try {
      // Idempotency for SKIPPED: if we've already recorded a SKIPPED event
      // for this project + period, don't try again. (INVOICED idempotency
      // lives inside buildInvoiceFromTimesheet.)
      const existingSkip = await prisma.billingEvent.findUnique({
        where: {
          projectId_periodStart_kind: {
            projectId: project.id,
            periodStart,
            kind: "SKIPPED_NO_HOURS",
          },
        },
      });
      if (existingSkip) {
        outcomes.push({
          projectId: project.id,
          projectName: project.name,
          status: "ALREADY_SKIPPED",
        });
        continue;
      }

      // Wrap the build + skip-record in a single transaction so a
      // partial failure doesn't leave us with tagged entries but no
      // invoice (or an invoice with no time-entry tags).
      const result = await prisma.$transaction(async (tx) => {
        return buildInvoiceFromTimesheet({
          tx,
          organizationId: project.organizationId,
          projectId: project.id,
          periodStart,
          periodEnd,
        });
      });

      if (result.kind === "INVOICED") {
        outcomes.push({
          projectId: project.id,
          projectName: project.name,
          status: "INVOICED",
          invoiceNumber: result.invoiceNumber,
          total: result.total,
        });
      } else if (result.kind === "ALREADY_INVOICED") {
        outcomes.push({
          projectId: project.id,
          projectName: project.name,
          status: "ALREADY_INVOICED",
        });
      } else {
        // SKIPPED_NO_HOURS — record an event so the project page can
        // show "Skipped <month> — no billable hours".
        await prisma.billingEvent.create({
          data: {
            organizationId: project.organizationId,
            projectId: project.id,
            periodStart,
            periodEnd,
            kind: "SKIPPED_NO_HOURS",
            note: result.reason,
          },
        });
        outcomes.push({
          projectId: project.id,
          projectName: project.name,
          status: "SKIPPED_NO_HOURS",
        });
      }
    } catch (err) {
      // Don't let one project's failure stop the rest.
      const message = err instanceof Error ? err.message : "unknown error";
      console.error(`[monthly-invoicing] project ${project.id} failed:`, err);
      outcomes.push({
        projectId: project.id,
        projectName: project.name,
        status: "ERROR",
        error: message,
      });
    }
  }

  const summary = {
    periodStart: periodStart.toISOString().slice(0, 10),
    periodEnd: periodEnd.toISOString().slice(0, 10),
    total: outcomes.length,
    invoiced: outcomes.filter((o) => o.status === "INVOICED").length,
    skipped: outcomes.filter((o) => o.status === "SKIPPED_NO_HOURS").length,
    alreadyInvoiced: outcomes.filter((o) => o.status === "ALREADY_INVOICED").length,
    alreadySkipped: outcomes.filter((o) => o.status === "ALREADY_SKIPPED").length,
    errors: outcomes.filter((o) => o.status === "ERROR").length,
  };

  console.log(`[monthly-invoicing] ${JSON.stringify(summary)}`);

  return NextResponse.json({ summary, outcomes });
}
