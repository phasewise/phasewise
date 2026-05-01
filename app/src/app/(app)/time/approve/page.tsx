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

  const canApprove = ["OWNER", "ADMIN", "SUPERVISOR"].includes(currentUser.role);

  if (!canApprove) {
    return (
      <div className="p-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-slate-700">
          <h1 className="text-2xl font-semibold">Approve timesheets</h1>
          <p className="mt-3 text-sm text-slate-500">You do not have permission to approve timesheets.</p>
        </div>
      </div>
    );
  }

  const submittedTimesheets = await prisma.weeklyTimesheet.findMany({
    where: {
      status: "SUBMITTED",
      user: { organizationId: currentUser.organizationId },
    },
    include: { user: true },
    orderBy: { submittedAt: "desc" },
  });

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

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Approve timesheets</h1>
        <p className="mt-2 text-sm text-slate-500">
          Review submitted weekly timesheets. Expand a row to see hours per phase, then Approve or Send back with a note.
        </p>
      </div>

      <TimeApprovalClient rows={rows} />
    </div>
  );
}
