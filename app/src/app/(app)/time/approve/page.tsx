import { addDays } from "date-fns";
import { getCurrentUser } from "@/lib/supabase/auth";
import { prisma } from "@/lib/prisma";
import { PHASE_LABELS } from "@/lib/constants";
import TimeApprovalClient, { ApprovalRow } from "./TimeApprovalClient";

export const dynamic = "force-dynamic";

export default async function TimeApprovePage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return (
      <div className="p-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-slate-700">
          <h1 className="text-2xl font-semibold">Approve timesheets</h1>
          <p className="mt-3 text-sm text-slate-500">Please sign in to review submitted work.</p>
        </div>
      </div>
    );
  }

  // Approver eligibility: standard OWNER/ADMIN/SUPERVISOR roles see all
  // submitted timesheets in the org. Anyone else only sees their direct
  // reports' submissions (User.supervisorId === currentUser.id). A PM
  // with no direct reports lands here with an empty queue, which is
  // correct — nothing to approve.
  const isRoleApprover = ["OWNER", "ADMIN", "SUPERVISOR"].includes(currentUser.role);

  // Anyone can navigate to this page; we show whatever's in their queue
  // (or empty state). Hard-blocking non-approvers was wrong — a PM with
  // direct reports should land here without needing role escalation.

  // Same scope filter for both Pending and History — role-approvers see
  // the whole org, everyone else sees direct reports OR reports they're
  // covering as alternate supervisor (vacation backup).
  const userScope = {
    organizationId: currentUser.organizationId,
    ...(isRoleApprover
      ? {}
      : {
          OR: [
            { supervisorId: currentUser.id },
            { alternateSupervisorId: currentUser.id },
          ],
        }),
  };

  const [submittedTimesheets, historyTimesheets] = await Promise.all([
    prisma.weeklyTimesheet.findMany({
      where: {
        status: "SUBMITTED",
        user: userScope,
      },
      include: { user: true },
      orderBy: { submittedAt: "desc" },
    }),
    // History: most recent decisions. Approved rows are the bulk of it;
    // sent-back ones (status=DRAFT with reviewComment) are also included
    // so the audit trail captures both decisions an approver makes.
    prisma.weeklyTimesheet.findMany({
      where: {
        OR: [
          { status: "APPROVED" },
          { AND: [{ status: "DRAFT" }, { reviewComment: { not: null } }] },
        ],
        user: userScope,
      },
      include: {
        user: true,
        approvedBy: { select: { fullName: true } },
        reviewedBy: { select: { fullName: true } },
      },
      // Sort by whichever is most recent — approvedAt for APPROVED rows,
      // reviewedAt for sent-back rows. Both are populated when set.
      orderBy: [{ approvedAt: "desc" }, { reviewedAt: "desc" }],
      take: 50,
    }),
  ]);

  // Fetch time entries for each submitted timesheet so the approver can
  // expand a row and see exactly what they're approving — by phase, by
  // person, by day. No more approving blind.
  const rows: ApprovalRow[] = await Promise.all(
    submittedTimesheets.map(async (ts) => {
      const weekStart = ts.weekStart;
      const weekEnd = addDays(weekStart, 6);

      const entries = await prisma.timeEntry.findMany({
        where: {
          userId: ts.userId,
          date: { gte: weekStart, lte: weekEnd },
        },
        include: {
          project: { select: { name: true, projectNumber: true } },
          phase: { select: { phaseType: true, customName: true } },
        },
        orderBy: [{ projectId: "asc" }, { phaseId: "asc" }, { date: "asc" }],
      });

      const totalHours = entries.reduce((sum, e) => sum + Number(e.hours), 0);
      const billableHours = entries
        .filter((e) => e.isBillable && !e.leaveType && !e.overheadCategory)
        .reduce((sum, e) => sum + Number(e.hours), 0);

      // Build the day-by-day breakdown grouped by (project+phase OR leave
      // OR overhead). One "row" per category, with hours per weekday.
      const groupKey = (e: typeof entries[number]) =>
        e.leaveType
          ? `LEAVE:${e.leaveType}`
          : e.overheadCategory
          ? `OVERHEAD:${e.overheadCategory}`
          : `${e.projectId ?? ""}:${e.phaseId ?? ""}`;

      const groupLabel = (e: typeof entries[number]): string => {
        if (e.leaveType) {
          return `Leave: ${e.leaveType.replace("_", " ")}`;
        }
        if (e.overheadCategory) {
          return `Overhead: ${e.overheadCategory.replace("_", " ")}`;
        }
        const phaseName = e.phase
          ? e.phase.customName ||
            PHASE_LABELS[e.phase.phaseType as keyof typeof PHASE_LABELS] ||
            e.phase.phaseType
          : "—";
        const projectName = e.project?.name ?? "Unassigned project";
        return `${projectName} · ${phaseName}`;
      };

      const groups = new Map<
        string,
        {
          label: string;
          isBillable: boolean;
          totalHours: number;
          dayHours: Record<string, number>;
        }
      >();

      for (const e of entries) {
        const key = groupKey(e);
        const dateKey = e.date.toISOString().slice(0, 10);
        const hours = Number(e.hours);
        const existing = groups.get(key);
        if (existing) {
          existing.totalHours += hours;
          existing.dayHours[dateKey] = (existing.dayHours[dateKey] ?? 0) + hours;
        } else {
          groups.set(key, {
            label: groupLabel(e),
            isBillable: e.isBillable && !e.leaveType && !e.overheadCategory,
            totalHours: hours,
            dayHours: { [dateKey]: hours },
          });
        }
      }

      return {
        id: ts.id,
        weekStart: ts.weekStart.toISOString(),
        weekEnd: weekEnd.toISOString(),
        submittedAt: ts.submittedAt?.toISOString() ?? null,
        user: {
          id: ts.user.id,
          fullName: ts.user.fullName,
          email: ts.user.email,
        },
        totalHours,
        billableHours,
        entryGroups: Array.from(groups.values()).map((g) => ({
          label: g.label,
          isBillable: g.isBillable,
          totalHours: g.totalHours,
          dayHours: g.dayHours,
        })),
      };
    })
  );

  // History: lightweight list of past decisions. We don't fetch entries
  // for these (the day grid would be heavy and isn't actionable post-
  // decision); the row just summarises hours and offers Reopen for the
  // approved ones.
  const history = await Promise.all(
    historyTimesheets.map(async (ts) => {
      const weekStart = ts.weekStart;
      const weekEnd = addDays(weekStart, 6);
      const totals = await prisma.timeEntry.aggregate({
        where: {
          userId: ts.userId,
          date: { gte: weekStart, lte: weekEnd },
        },
        _sum: { hours: true },
      });
      const totalHours = Number(totals._sum.hours ?? 0);
      // Effective decision moment + label for the audit row.
      const decision =
        ts.status === "APPROVED"
          ? {
              kind: "APPROVED" as const,
              by: ts.approvedBy?.fullName ?? "—",
              at: ts.approvedAt?.toISOString() ?? null,
              comment: null as string | null,
            }
          : {
              kind: "SENT_BACK" as const,
              by: ts.reviewedBy?.fullName ?? "—",
              at: ts.reviewedAt?.toISOString() ?? null,
              comment: ts.reviewComment ?? null,
            };
      return {
        id: ts.id,
        weekStart: ts.weekStart.toISOString(),
        weekEnd: weekEnd.toISOString(),
        user: {
          id: ts.user.id,
          fullName: ts.user.fullName,
        },
        totalHours,
        decision,
      };
    })
  );

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Approve timesheets</h1>
        <p className="mt-2 text-sm text-slate-500">
          Review submitted weekly timesheets. Expand a row to see hours per phase, then Approve or Send back with a note.
        </p>
      </div>

      <TimeApprovalClient rows={rows} history={history} />
    </div>
  );
}
