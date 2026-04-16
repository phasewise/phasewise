import { notFound } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/supabase/auth";
import { prisma } from "@/lib/prisma";
import { STATUS_COLORS, getPhaseDisplayName } from "@/lib/constants";

export default async function ProjectDetailReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return (
      <div className="p-6 sm:p-8">
        <div className="rounded-2xl border border-[#E2EBE4] bg-white p-8 text-[#1A2E22]">
          <h1 className="font-serif text-2xl">Project Detail Report</h1>
          <p className="mt-3 text-sm text-[#6B8C74]">Please sign in to view reports.</p>
        </div>
      </div>
    );
  }

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      phases: {
        orderBy: { sortOrder: "asc" },
        include: {
          workPlan: {
            include: {
              user: {
                select: { id: true, fullName: true, billingRate: true, title: true },
              },
            },
          },
        },
      },
      assignments: {
        include: {
          user: { select: { id: true, fullName: true, billingRate: true, title: true } },
        },
      },
    },
  });

  if (!project || project.organizationId !== currentUser.organizationId) {
    notFound();
  }

  // Time entries grouped by phase
  const timeByPhase = await prisma.timeEntry.groupBy({
    by: ["phaseId"],
    where: { projectId: id, organizationId: currentUser.organizationId },
    _sum: { hours: true },
  });
  const hoursByPhase = new Map(
    timeByPhase.map((e) => [e.phaseId, Number(e._sum.hours ?? 0)])
  );

  // Time entries grouped by phase + user (for per-person breakdown)
  const timeByPhaseUser = await prisma.timeEntry.groupBy({
    by: ["phaseId", "userId"],
    where: { projectId: id, organizationId: currentUser.organizationId },
    _sum: { hours: true },
  });

  // Get user details for everyone who has logged time
  const userIdsWithTime = [...new Set(timeByPhaseUser.map((e) => e.userId))];
  const usersWithTime = await prisma.user.findMany({
    where: { id: { in: userIdsWithTime } },
    select: { id: true, fullName: true, billingRate: true, title: true },
  });
  const userMap = new Map(usersWithTime.map((u) => [u.id, u]));

  // Build per-person time map: phaseId -> { userId -> hours }
  const phaseUserHours = new Map<string, Map<string, number>>();
  for (const entry of timeByPhaseUser) {
    if (!entry.phaseId) continue;
    if (!phaseUserHours.has(entry.phaseId)) {
      phaseUserHours.set(entry.phaseId, new Map());
    }
    phaseUserHours.get(entry.phaseId)!.set(entry.userId, Number(entry._sum.hours ?? 0));
  }

  // Total time entries for the project
  const totalTimeResult = await prisma.timeEntry.aggregate({
    where: { projectId: id, organizationId: currentUser.organizationId },
    _sum: { hours: true },
  });
  const totalHoursUsed = Number(totalTimeResult._sum.hours ?? 0);

  // Project-level calculations
  const totalBudgetedFee = project.phases.reduce(
    (sum, phase) => sum + Number(phase.budgetedFee ?? 0),
    0
  );
  const totalBudgetedHours = project.phases.reduce(
    (sum, phase) => sum + Number(phase.budgetedHours ?? 0),
    0
  );
  const overallBurn =
    totalBudgetedHours > 0 ? (totalHoursUsed / totalBudgetedHours) * 100 : 0;
  const effectiveRate = totalHoursUsed > 0 ? totalBudgetedFee / totalHoursUsed : 0;

  // Estimated cost from assigned staff rates
  const assignedRates = project.assignments
    .map((a) => Number(a.user.billingRate ?? 0))
    .filter((r) => r > 0);
  const avgRate =
    assignedRates.length > 0
      ? assignedRates.reduce((s, r) => s + r, 0) / assignedRates.length
      : 0;
  const estimatedCost = avgRate * totalHoursUsed;
  const estimatedProfit = totalBudgetedFee - estimatedCost;
  const profitMargin =
    totalBudgetedFee > 0 ? (estimatedProfit / totalBudgetedFee) * 100 : 0;

  // Per-person summary across all phases
  const personSummary = new Map<
    string,
    { fullName: string; title: string | null; billingRate: number; totalHours: number; totalCost: number }
  >();
  for (const entry of timeByPhaseUser) {
    const user = userMap.get(entry.userId);
    if (!user) continue;
    const hours = Number(entry._sum.hours ?? 0);
    const rate = Number(user.billingRate ?? 0);
    const existing = personSummary.get(entry.userId);
    if (existing) {
      existing.totalHours += hours;
      existing.totalCost += hours * rate;
    } else {
      personSummary.set(entry.userId, {
        fullName: user.fullName,
        title: user.title,
        billingRate: rate,
        totalHours: hours,
        totalCost: hours * rate,
      });
    }
  }
  const personRows = [...personSummary.values()].sort(
    (a, b) => b.totalHours - a.totalHours
  );

  function burnColor(rate: number) {
    if (rate >= 100) return "text-rose-600 bg-rose-50";
    if (rate >= 80) return "text-amber-600 bg-amber-50";
    return "text-[#2D6A4F] bg-[#F0FAF4]";
  }

  function marginColor(margin: number) {
    if (margin < 0) return "text-rose-600";
    if (margin < 20) return "text-amber-600";
    return "text-[#2D6A4F]";
  }

  return (
    <div className="p-6 sm:p-8 max-w-7xl">
      <div className="mb-8">
        <Link
          href="/reports"
          className="text-sm text-[#6B8C74] hover:text-[#1A2E22] transition-colors"
        >
          &larr; Back to Reports
        </Link>
        <h1 className="font-serif text-3xl text-[#1A2E22] mt-3">
          {project.name}
        </h1>
        <div className="flex flex-wrap items-center gap-3 mt-2">
          {project.projectNumber && (
            <span className="text-sm text-[#6B8C74]">{project.projectNumber}</span>
          )}
          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_COLORS[project.status]}`}
          >
            {project.status.replace("_", " ")}
          </span>
          <Link
            href={`/projects/${id}`}
            className="text-sm text-[#2D6A4F] hover:text-[#40916C] transition-colors"
          >
            View project &rarr;
          </Link>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div className="rounded-2xl border border-[#E2EBE4] bg-white p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6B8C74] mb-2">
            Total Fee
          </div>
          <div className="text-2xl font-semibold text-[#1A2E22]">
            ${totalBudgetedFee.toLocaleString()}
          </div>
        </div>
        <div className="rounded-2xl border border-[#E2EBE4] bg-white p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6B8C74] mb-2">
            Budgeted Hrs
          </div>
          <div className="text-2xl font-semibold text-[#1A2E22]">
            {totalBudgetedHours.toFixed(0)}h
          </div>
        </div>
        <div className="rounded-2xl border border-[#E2EBE4] bg-white p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6B8C74] mb-2">
            Hours Used
          </div>
          <div className="text-2xl font-semibold text-[#1A2E22]">
            {totalHoursUsed.toFixed(1)}h
          </div>
        </div>
        <div className="rounded-2xl border border-[#E2EBE4] bg-white p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6B8C74] mb-2">
            Burn Rate
          </div>
          <div className={`text-2xl font-semibold ${burnColor(overallBurn).split(" ")[0]}`}>
            {overallBurn.toFixed(0)}%
          </div>
        </div>
        <div className="rounded-2xl border border-[#E2EBE4] bg-white p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6B8C74] mb-2">
            Eff. Rate
          </div>
          <div className="text-2xl font-semibold text-[#1A2E22]">
            {effectiveRate > 0 ? `$${effectiveRate.toFixed(0)}/hr` : "\u2014"}
          </div>
        </div>
        <div className="rounded-2xl border border-[#E2EBE4] bg-white p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6B8C74] mb-2">
            Margin
          </div>
          <div className={`text-2xl font-semibold ${marginColor(profitMargin)}`}>
            {assignedRates.length > 0 ? `${profitMargin.toFixed(0)}%` : "\u2014"}
          </div>
        </div>
      </div>

      {/* Phase breakdown table */}
      <div className="rounded-2xl border border-[#E2EBE4] bg-white shadow-sm overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-[#E2EBE4] bg-[#F7F9F7]">
          <h2 className="font-semibold text-[#1A2E22]">Phase Breakdown</h2>
          <p className="text-xs text-[#6B8C74] mt-1">
            Budget vs. actual hours per phase with burn rate
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-[#E2EBE4] text-[#6B8C74]">
              <tr>
                <th className="px-4 sm:px-6 py-3 font-medium">Phase</th>
                <th className="px-4 sm:px-6 py-3 font-medium">Status</th>
                <th className="px-4 sm:px-6 py-3 font-medium text-right">Fee</th>
                <th className="px-4 sm:px-6 py-3 font-medium text-right">Budget Hrs</th>
                <th className="px-4 sm:px-6 py-3 font-medium text-right">Used</th>
                <th className="px-4 sm:px-6 py-3 font-medium text-right">Remaining</th>
                <th className="px-4 sm:px-6 py-3 font-medium text-right">Burn</th>
              </tr>
            </thead>
            <tbody>
              {project.phases.map((phase) => {
                const budgetHrs = Number(phase.budgetedHours ?? 0);
                const budgetFee = Number(phase.budgetedFee ?? 0);
                const usedHrs = hoursByPhase.get(phase.id) ?? 0;
                const remaining = budgetHrs - usedHrs;
                const phaseBurn = budgetHrs > 0 ? (usedHrs / budgetHrs) * 100 : 0;

                return (
                  <tr
                    key={phase.id}
                    className="border-b border-[#E8EDE9] last:border-0 hover:bg-[#F7F9F7]/50 transition-colors"
                  >
                    <td className="px-4 sm:px-6 py-4">
                      <div className="font-semibold text-[#1A2E22]">
                        {getPhaseDisplayName(phase.phaseType, phase.customName)}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_COLORS[phase.status]}`}
                      >
                        {phase.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-right text-[#1A2E22]">
                      ${budgetFee.toLocaleString()}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-right text-[#6B8C74]">
                      {budgetHrs.toFixed(1)}h
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-right text-[#1A2E22]">
                      {usedHrs.toFixed(1)}h
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-right">
                      <span className={remaining < 0 ? "text-rose-600 font-semibold" : "text-[#6B8C74]"}>
                        {remaining.toFixed(1)}h
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-right">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${burnColor(phaseBurn)}`}
                      >
                        {phaseBurn.toFixed(0)}%
                      </span>
                    </td>
                  </tr>
                );
              })}
              {project.phases.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-[#A3BEA9] text-sm">
                    No phases defined. Add phases to the project to see the breakdown.
                  </td>
                </tr>
              )}
            </tbody>
            {project.phases.length > 0 && (
              <tfoot className="border-t-2 border-[#E2EBE4] bg-[#F7F9F7]">
                <tr>
                  <td className="px-4 sm:px-6 py-4 font-semibold text-[#1A2E22]" colSpan={2}>
                    Total ({project.phases.length} phases)
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-right font-semibold text-[#1A2E22]">
                    ${totalBudgetedFee.toLocaleString()}
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-right font-semibold text-[#6B8C74]">
                    {totalBudgetedHours.toFixed(1)}h
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-right font-semibold text-[#1A2E22]">
                    {totalHoursUsed.toFixed(1)}h
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-right font-semibold">
                    <span className={totalBudgetedHours - totalHoursUsed < 0 ? "text-rose-600" : "text-[#6B8C74]"}>
                      {(totalBudgetedHours - totalHoursUsed).toFixed(1)}h
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-right">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${burnColor(overallBurn)}`}
                    >
                      {overallBurn.toFixed(0)}%
                    </span>
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {/* Per-person time breakdown */}
      <div className="rounded-2xl border border-[#E2EBE4] bg-white shadow-sm overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-[#E2EBE4] bg-[#F7F9F7]">
          <h2 className="font-semibold text-[#1A2E22]">Time by Team Member</h2>
          <p className="text-xs text-[#6B8C74] mt-1">
            Hours logged and estimated cost per person across all phases
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-[#E2EBE4] text-[#6B8C74]">
              <tr>
                <th className="px-4 sm:px-6 py-3 font-medium">Team Member</th>
                <th className="px-4 sm:px-6 py-3 font-medium text-right">Rate</th>
                <th className="px-4 sm:px-6 py-3 font-medium text-right">Hours</th>
                <th className="px-4 sm:px-6 py-3 font-medium text-right">% of Total</th>
                <th className="px-4 sm:px-6 py-3 font-medium text-right">Est. Cost</th>
              </tr>
            </thead>
            <tbody>
              {personRows.map((person) => {
                const pctOfTotal =
                  totalHoursUsed > 0
                    ? (person.totalHours / totalHoursUsed) * 100
                    : 0;
                return (
                  <tr
                    key={person.fullName}
                    className="border-b border-[#E8EDE9] last:border-0 hover:bg-[#F7F9F7]/50 transition-colors"
                  >
                    <td className="px-4 sm:px-6 py-4">
                      <div className="font-semibold text-[#1A2E22]">{person.fullName}</div>
                      {person.title && (
                        <div className="text-xs text-[#A3BEA9] mt-0.5">{person.title}</div>
                      )}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-right text-[#6B8C74]">
                      {person.billingRate > 0 ? `$${person.billingRate.toFixed(0)}/hr` : "\u2014"}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-right text-[#1A2E22] font-medium">
                      {person.totalHours.toFixed(1)}h
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-right text-[#6B8C74]">
                      {pctOfTotal.toFixed(0)}%
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-right text-[#1A2E22]">
                      {person.billingRate > 0
                        ? `$${person.totalCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                        : "\u2014"}
                    </td>
                  </tr>
                );
              })}
              {personRows.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-[#A3BEA9] text-sm">
                    No time entries logged yet. Team members will appear here once they log time.
                  </td>
                </tr>
              )}
            </tbody>
            {personRows.length > 0 && (
              <tfoot className="border-t-2 border-[#E2EBE4] bg-[#F7F9F7]">
                <tr>
                  <td className="px-4 sm:px-6 py-4 font-semibold text-[#1A2E22]">
                    Total ({personRows.length} members)
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-right text-[#6B8C74]">
                    {avgRate > 0 ? `$${avgRate.toFixed(0)}/hr avg` : "\u2014"}
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-right font-semibold text-[#1A2E22]">
                    {totalHoursUsed.toFixed(1)}h
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-right font-semibold text-[#6B8C74]">
                    100%
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-right font-semibold text-[#1A2E22]">
                    ${estimatedCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {/* Phase × Person detail matrix */}
      {personRows.length > 0 && project.phases.length > 0 && (
        <div className="rounded-2xl border border-[#E2EBE4] bg-white shadow-sm overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-[#E2EBE4] bg-[#F7F9F7]">
            <h2 className="font-semibold text-[#1A2E22]">Phase &times; Person Matrix</h2>
            <p className="text-xs text-[#6B8C74] mt-1">
              Hours logged per team member in each phase
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-[#E2EBE4] text-[#6B8C74]">
                <tr>
                  <th className="px-4 sm:px-6 py-3 font-medium">Phase</th>
                  {personRows.map((p) => (
                    <th key={p.fullName} className="px-3 py-3 font-medium text-right whitespace-nowrap">
                      {p.fullName.split(/\s+/)[0]}
                    </th>
                  ))}
                  <th className="px-4 sm:px-6 py-3 font-medium text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {project.phases.map((phase) => {
                  const phaseUsers = phaseUserHours.get(phase.id);
                  const phaseTotal = hoursByPhase.get(phase.id) ?? 0;
                  return (
                    <tr
                      key={phase.id}
                      className="border-b border-[#E8EDE9] last:border-0 hover:bg-[#F7F9F7]/50 transition-colors"
                    >
                      <td className="px-4 sm:px-6 py-3 font-medium text-[#1A2E22] whitespace-nowrap">
                        {getPhaseDisplayName(phase.phaseType, phase.customName)}
                      </td>
                      {personRows.map((p) => {
                        const userId = [...personSummary.entries()].find(
                          ([, v]) => v.fullName === p.fullName
                        )?.[0];
                        const hrs = userId && phaseUsers ? (phaseUsers.get(userId) ?? 0) : 0;
                        return (
                          <td
                            key={p.fullName}
                            className={`px-3 py-3 text-right ${hrs > 0 ? "text-[#1A2E22]" : "text-[#E2EBE4]"}`}
                          >
                            {hrs > 0 ? `${hrs.toFixed(1)}` : "\u2014"}
                          </td>
                        );
                      })}
                      <td className="px-4 sm:px-6 py-3 text-right font-semibold text-[#1A2E22]">
                        {phaseTotal.toFixed(1)}h
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="border-t-2 border-[#E2EBE4] bg-[#F7F9F7]">
                <tr>
                  <td className="px-4 sm:px-6 py-3 font-semibold text-[#1A2E22]">Total</td>
                  {personRows.map((p) => (
                    <td key={p.fullName} className="px-3 py-3 text-right font-semibold text-[#1A2E22]">
                      {p.totalHours.toFixed(1)}
                    </td>
                  ))}
                  <td className="px-4 sm:px-6 py-3 text-right font-bold text-[#1A2E22]">
                    {totalHoursUsed.toFixed(1)}h
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      <p className="text-xs text-[#A3BEA9]">
        Effective rate = budgeted fee &divide; hours used. Estimated cost uses each team member&apos;s billing rate &times; their hours. Margin = (fee &minus; cost) &divide; fee.
      </p>
    </div>
  );
}
