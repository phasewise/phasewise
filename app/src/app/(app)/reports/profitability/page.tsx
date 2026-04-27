import Link from "next/link";
import { getCurrentUser } from "@/lib/supabase/auth";
import { prisma } from "@/lib/prisma";
import { STATUS_COLORS } from "@/lib/constants";

export default async function ProfitabilityReportPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return (
      <div className="p-6 sm:p-8">
        <div className="rounded-2xl border border-[#E2EBE4] bg-white p-8 text-[#1A2E22]">
          <h1 className="font-serif text-2xl">Project Profitability</h1>
          <p className="mt-3 text-sm text-[#6B8C74]">Please sign in to view reports.</p>
        </div>
      </div>
    );
  }

  const projects = await prisma.project.findMany({
    where: { organizationId: currentUser.organizationId, status: { not: "ARCHIVED" } },
    include: {
      phases: {
        include: {
          workPlan: {
            include: {
              user: { select: { billingRate: true } },
            },
          },
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  // Time totals per project (overall)
  const timeTotals = await prisma.timeEntry.groupBy({
    by: ["projectId"],
    where: { organizationId: currentUser.organizationId },
    _sum: { hours: true },
  });
  const hoursByProject = new Map(
    timeTotals.map((entry) => [entry.projectId, Number(entry._sum.hours ?? 0)])
  );

  // Per-person hours per project — this is the data we need to compute
  // an accurate cost. Using an averaged work-plan rate hides "junior did
  // most of the work but we charged senior rate" — multiply each person's
  // actual hours by their actual billing rate instead.
  const perUserTotals = await prisma.timeEntry.groupBy({
    by: ["projectId", "userId"],
    where: { organizationId: currentUser.organizationId, projectId: { not: null } },
    _sum: { hours: true },
  });

  // Resolve user names + billing rates for the per-person rows.
  const userIds = Array.from(new Set(perUserTotals.map((r) => r.userId)));
  const usersForRates = userIds.length
    ? await prisma.user.findMany({
        where: { id: { in: userIds } },
        select: { id: true, fullName: true, billingRate: true },
      })
    : [];
  const userMap = new Map(
    usersForRates.map((u) => [u.id, { name: u.fullName, rate: Number(u.billingRate ?? 0) }])
  );

  // Build per-project { person → { hours, rate, cost } } breakdowns.
  type Breakdown = { userId: string; name: string; hours: number; rate: number; cost: number };
  const breakdownsByProject = new Map<string, Breakdown[]>();
  for (const row of perUserTotals) {
    if (!row.projectId) continue;
    const existing = breakdownsByProject.get(row.projectId) ?? [];
    const u = userMap.get(row.userId);
    const hours = Number(row._sum.hours ?? 0);
    const rate = u?.rate ?? 0;
    existing.push({
      userId: row.userId,
      name: u?.name ?? "Unknown",
      hours,
      rate,
      cost: hours * rate,
    });
    breakdownsByProject.set(row.projectId, existing);
  }

  // Build project rows with profitability calculations
  const projectRows = projects.map((project) => {
    const budgetedFee = project.phases.reduce(
      (sum, phase) => sum + Number(phase.budgetedFee ?? 0),
      0
    );
    const budgetedHours = project.phases.reduce(
      (sum, phase) => sum + Number(phase.budgetedHours ?? 0),
      0
    );
    const hoursUsed = hoursByProject.get(project.id) ?? 0;
    const burnRate = budgetedHours > 0 ? (hoursUsed / budgetedHours) * 100 : 0;
    const effectiveRate = hoursUsed > 0 ? budgetedFee / hoursUsed : 0;

    // True estimated cost: sum of (each person's hours × their billing rate).
    // Falls back to the work plan average only if no time has been logged yet
    // (so we can still show a forward-looking estimate).
    const breakdown = breakdownsByProject.get(project.id) ?? [];
    breakdown.sort((a, b) => b.hours - a.hours);
    let estimatedCost = breakdown.reduce((s, b) => s + b.cost, 0);
    let costSource: "actual" | "planned" | "none" = breakdown.length > 0 ? "actual" : "none";
    if (estimatedCost === 0) {
      const planRates: number[] = [];
      for (const phase of project.phases) {
        for (const wp of phase.workPlan) {
          const r = Number(wp.user.billingRate ?? 0);
          if (r > 0) planRates.push(r);
        }
      }
      if (planRates.length > 0) {
        const avg = planRates.reduce((s, r) => s + r, 0) / planRates.length;
        estimatedCost = avg * hoursUsed;
        costSource = "planned";
      }
    }
    const estimatedProfit = budgetedFee - estimatedCost;
    const profitMargin = budgetedFee > 0 ? (estimatedProfit / budgetedFee) * 100 : 0;

    return {
      id: project.id,
      name: project.name,
      projectNumber: project.projectNumber,
      status: project.status,
      budgetedFee,
      budgetedHours,
      hoursUsed,
      burnRate,
      effectiveRate,
      estimatedCost,
      estimatedProfit,
      profitMargin,
      breakdown,
      costSource,
      staffCount: breakdown.length,
    };
  });

  // Firm-wide summary
  const totalFee = projectRows.reduce((s, p) => s + p.budgetedFee, 0);
  const totalHoursUsed = projectRows.reduce((s, p) => s + p.hoursUsed, 0);
  const totalBudgetedHours = projectRows.reduce((s, p) => s + p.budgetedHours, 0);
  const totalCost = projectRows.reduce((s, p) => s + p.estimatedCost, 0);
  const totalProfit = totalFee - totalCost;
  const overallMargin = totalFee > 0 ? (totalProfit / totalFee) * 100 : 0;
  const overallBurn = totalBudgetedHours > 0 ? (totalHoursUsed / totalBudgetedHours) * 100 : 0;
  const atRiskCount = projectRows.filter((p) => p.burnRate >= 80 && p.burnRate < 100).length;
  const overBudgetCount = projectRows.filter((p) => p.burnRate >= 100).length;

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
        <Link href="/reports" className="text-sm text-[#6B8C74] hover:text-[#1A2E22] transition-colors">
          ← Back to Reports
        </Link>
        <h1 className="font-serif text-3xl text-[#1A2E22] mt-3">Project Profitability</h1>
        <p className="mt-1 text-sm text-[#6B8C74]">
          Fee, hours, burn rate, and profit margin across all active projects.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="rounded-2xl border border-[#E2EBE4] bg-white p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6B8C74] mb-2">Total Fee</div>
          <div className="text-2xl font-semibold text-[#1A2E22]">${(totalFee / 1000).toFixed(0)}K</div>
        </div>
        <div className="rounded-2xl border border-[#E2EBE4] bg-white p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6B8C74] mb-2">Profit Margin</div>
          <div className={`text-2xl font-semibold ${marginColor(overallMargin)}`}>
            {overallMargin.toFixed(0)}%
          </div>
        </div>
        <div className="rounded-2xl border border-[#E2EBE4] bg-white p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6B8C74] mb-2">Avg Burn</div>
          <div className={`text-2xl font-semibold ${burnColor(overallBurn).split(" ")[0]}`}>
            {overallBurn.toFixed(0)}%
          </div>
        </div>
        <div className="rounded-2xl border border-[#E2EBE4] bg-white p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6B8C74] mb-2">At Risk / Over</div>
          <div className="text-2xl font-semibold text-[#1A2E22]">
            <span className="text-amber-600">{atRiskCount}</span>
            {" / "}
            <span className="text-rose-600">{overBudgetCount}</span>
          </div>
        </div>
      </div>

      {/* Project table */}
      <div className="rounded-2xl border border-[#E2EBE4] bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-[#E2EBE4] bg-[#F7F9F7] text-[#6B8C74]">
              <tr>
                <th className="px-4 sm:px-6 py-4 font-medium">Project</th>
                <th className="px-4 sm:px-6 py-4 font-medium">Status</th>
                <th className="px-4 sm:px-6 py-4 font-medium text-right">Fee</th>
                <th className="px-4 sm:px-6 py-4 font-medium text-right">Hours</th>
                <th className="px-4 sm:px-6 py-4 font-medium text-right">Used</th>
                <th className="px-4 sm:px-6 py-4 font-medium text-right">Burn</th>
                <th className="px-4 sm:px-6 py-4 font-medium text-right">Eff. Rate</th>
                <th className="px-4 sm:px-6 py-4 font-medium text-right">Est. Profit</th>
                <th className="px-4 sm:px-6 py-4 font-medium text-right">Margin</th>
              </tr>
            </thead>
            <tbody>
              {projectRows.map((project) => (
                <tr key={project.id} className="border-b border-[#E8EDE9] last:border-0 hover:bg-[#F7F9F7]/50 transition-colors align-top">
                  <td className="px-4 sm:px-6 py-4">
                    <Link href={`/reports/project/${project.id}`} className="font-semibold text-[#1A2E22] hover:text-[#2D6A4F]">
                      {project.name}
                    </Link>
                    {project.projectNumber && (
                      <div className="text-xs text-[#A3BEA9] mt-0.5">{project.projectNumber}</div>
                    )}
                    {project.breakdown.length > 0 && (
                      <details className="mt-2 group">
                        <summary className="cursor-pointer text-[11px] font-medium text-[#6B8C74] hover:text-[#2D6A4F] select-none">
                          Per-person breakdown ({project.breakdown.length})
                        </summary>
                        <div className="mt-2 rounded-lg bg-[#F7F9F7] border border-[#E2EBE4] p-2 space-y-1">
                          {project.breakdown.map((b) => (
                            <div key={b.userId} className="flex items-center justify-between gap-3 text-[11px]">
                              <span className="text-[#1A2E22] truncate">{b.name}</span>
                              <span className="text-[#A3BEA9] tabular-nums whitespace-nowrap">
                                {b.hours.toFixed(1)}h × ${b.rate.toFixed(0)}/hr ={" "}
                                <span className="font-semibold text-[#1A2E22]">${b.cost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                              </span>
                            </div>
                          ))}
                        </div>
                      </details>
                    )}
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_COLORS[project.status]}`}>
                      {project.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-right text-[#1A2E22]">${project.budgetedFee.toLocaleString()}</td>
                  <td className="px-4 sm:px-6 py-4 text-right text-[#6B8C74]">{project.budgetedHours.toFixed(0)}h</td>
                  <td className="px-4 sm:px-6 py-4 text-right text-[#1A2E22]">{project.hoursUsed.toFixed(1)}h</td>
                  <td className="px-4 sm:px-6 py-4 text-right">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${burnColor(project.burnRate)}`}>
                      {project.burnRate.toFixed(0)}%
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-right text-[#6B8C74]">
                    {project.effectiveRate > 0 ? `$${project.effectiveRate.toFixed(0)}/hr` : "—"}
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-right">
                    {project.staffCount > 0 ? (
                      <span className={project.estimatedProfit >= 0 ? "text-[#2D6A4F]" : "text-rose-600"}>
                        ${project.estimatedProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </span>
                    ) : (
                      <span className="text-[#A3BEA9]">—</span>
                    )}
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-right">
                    {project.staffCount > 0 ? (
                      <span className={`font-semibold ${marginColor(project.profitMargin)}`}>
                        {project.profitMargin.toFixed(0)}%
                      </span>
                    ) : (
                      <span className="text-[#A3BEA9]">—</span>
                    )}
                  </td>
                </tr>
              ))}
              {projectRows.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-6 py-10 text-center text-[#A3BEA9] text-sm">
                    No active projects. Create a project to see profitability data.
                  </td>
                </tr>
              )}
            </tbody>
            {projectRows.length > 0 && (
              <tfoot className="border-t-2 border-[#E2EBE4] bg-[#F7F9F7]">
                <tr>
                  <td className="px-4 sm:px-6 py-4 font-semibold text-[#1A2E22]" colSpan={2}>
                    Totals ({projectRows.length} projects)
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-right font-semibold text-[#1A2E22]">
                    ${totalFee.toLocaleString()}
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-right font-semibold text-[#6B8C74]">
                    {totalBudgetedHours.toFixed(0)}h
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-right font-semibold text-[#1A2E22]">
                    {totalHoursUsed.toFixed(1)}h
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-right">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${burnColor(overallBurn)}`}>
                      {overallBurn.toFixed(0)}%
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-right text-[#6B8C74]">
                    {totalHoursUsed > 0 ? `$${(totalFee / totalHoursUsed).toFixed(0)}/hr` : "—"}
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-right font-semibold">
                    <span className={totalProfit >= 0 ? "text-[#2D6A4F]" : "text-rose-600"}>
                      ${totalProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-right">
                    <span className={`font-bold ${marginColor(overallMargin)}`}>
                      {overallMargin.toFixed(0)}%
                    </span>
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      <p className="mt-4 text-xs text-[#A3BEA9]">
        Effective rate = budgeted fee ÷ hours used. Cost = sum of each person&apos;s actual logged hours × their current billing rate. Per-person breakdown available for any project with logged time. Projects with no logged time fall back to the work plan&apos;s average rate; projects without a work plan show &quot;—&quot;.
      </p>
    </div>
  );
}
