import { ArrowUpRight, FolderKanban, AlertTriangle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { PHASE_SHORT_LABELS, STATUS_COLORS } from "@/lib/constants";
import { getCurrentUser } from "@/lib/supabase/auth";
import { prisma } from "@/lib/prisma";
import { getBudgetAlertLevel, ALERT_LABELS } from "@/lib/budget-alerts";

function getCurrentPhase(phases: Array<{ phaseType: string; status: string }>) {
  const activePhase = phases.find((phase) => phase.status !== "COMPLETE");
  return activePhase ?? phases[phases.length - 1] ?? { phaseType: "PRE_DESIGN", status: "NOT_STARTED" };
}

function getBurnColor(pct: number) {
  if (pct >= 100) return "bg-rose-500";
  if (pct >= 90) return "bg-rose-400";
  if (pct >= 75) return "bg-amber-400";
  return "bg-[#52B788]";
}

function getBurnBadge(pct: number) {
  if (pct >= 95) return "text-red-700 bg-red-50";
  if (pct >= 80) return "text-yellow-700 bg-yellow-50";
  return "text-emerald-700 bg-emerald-50";
}

export default async function DashboardPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return (
      <div className="p-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-slate-700">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="mt-3 text-sm text-slate-500">Unable to load your account. Please sign in again.</p>
        </div>
      </div>
    );
  }

  const projects = await prisma.project.findMany({
    where: { organizationId: currentUser.organizationId },
    include: {
      phases: { orderBy: { sortOrder: "asc" } },
    },
    orderBy: { updatedAt: "desc" },
  });

  const timeTotals = await prisma.timeEntry.groupBy({
    by: ["projectId"],
    where: { organizationId: currentUser.organizationId },
    _sum: { hours: true },
  });

  const projectTimeMap = new Map(
    timeTotals.map((entry) => [entry.projectId, Number(entry._sum.hours ?? 0)])
  );

  const activeProjects = projects.filter((project) => project.status === "ACTIVE");
  const atRiskProjects = activeProjects.filter((project) => {
    const budgetedHours = project.phases.reduce(
      (sum, phase) => sum + Number(phase.budgetedHours ?? 0),
      0
    );
    const usedHours = projectTimeMap.get(project.id) ?? 0;
    return budgetedHours > 0 && usedHours / budgetedHours >= 0.9;
  });

  const totalFee = projects.reduce(
    (sum, project) =>
      sum +
      project.phases.reduce(
        (phaseSum, phase) => phaseSum + Number(phase.budgetedFee ?? 0),
        0
      ),
    0
  );

  const avgBurn =
    activeProjects.length > 0
      ?
        activeProjects.reduce((sum, project) => {
          const budgetedHours = project.phases.reduce(
            (phaseSum, phase) => phaseSum + Number(phase.budgetedHours ?? 0),
            0
          );
          const hoursUsed = projectTimeMap.get(project.id) ?? 0;
          return sum + (budgetedHours > 0 ? (hoursUsed / budgetedHours) * 100 : 0);
        }, 0) / activeProjects.length
      : 0;

  return (
    <div className="p-6 sm:p-8 max-w-7xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-[#1A2E22]">Dashboard</h1>
          <p className="text-sm text-[#6B8C74] mt-1">Your firm at a glance</p>
        </div>
        <Link
          href="/projects/new"
          className="inline-flex items-center gap-2 rounded-lg bg-[#2D6A4F] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#40916C] transition-colors"
        >
          <FolderKanban className="h-4 w-4" />
          New Project
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4 mb-8">
        <div className="rounded-2xl border border-[#E2EBE4] bg-white p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6B8C74] mb-2">Active Projects</div>
          <div className="text-3xl font-semibold text-[#2D6A4F]">{activeProjects.length}</div>
        </div>
        <div className="rounded-2xl border border-[#E2EBE4] bg-white p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6B8C74] mb-2">At Risk</div>
          <div className="text-3xl font-semibold text-rose-600">{atRiskProjects.length}</div>
        </div>
        <div className="rounded-2xl border border-[#E2EBE4] bg-white p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6B8C74] mb-2">Total Fee</div>
          <div className="text-3xl font-semibold text-[#1A2E22]">${(totalFee / 1000).toFixed(0)}K</div>
        </div>
        <div className="rounded-2xl border border-[#E2EBE4] bg-white p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6B8C74] mb-2">Avg Burn Rate</div>
          <div className={`text-3xl font-semibold ${avgBurn >= 90 ? "text-rose-600" : avgBurn >= 75 ? "text-amber-600" : "text-[#2D6A4F]"}`}>
            {avgBurn.toFixed(0)}%
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-[#E2EBE4] bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between border-b border-[#E2EBE4] px-6 py-5">
          <div>
            <h2 className="text-base font-semibold text-[#1A2E22]">Projects</h2>
            <p className="text-sm text-[#6B8C74]">All active work for your organization.</p>
          </div>
          <Link href="/projects" className="text-sm font-semibold text-[#2D6A4F] hover:text-[#40916C] inline-flex items-center gap-1">
            View all <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm text-[#3D5C48]">
            <thead className="border-b border-[#E2EBE4] bg-[#F7F9F7] text-[#6B8C74]">
              <tr>
                <th className="px-6 py-4 font-medium">Project</th>
                <th className="px-6 py-4 font-medium">Client</th>
                <th className="px-6 py-4 font-medium">Phase</th>
                <th className="px-6 py-4 font-medium">Health</th>
                <th className="px-6 py-4 font-medium">Budget</th>
                <th className="px-6 py-4 font-medium">Burn</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => {
                const currentPhase = getCurrentPhase(project.phases || []);
                const budgetedFee = project.phases.reduce(
                  (sum, phase) => sum + Number(phase.budgetedFee ?? 0),
                  0
                );
                const budgetedHours = project.phases.reduce(
                  (sum, phase) => sum + Number(phase.budgetedHours ?? 0),
                  0
                );
                const hoursUsed = projectTimeMap.get(project.id) ?? 0;
                const burnPercent = budgetedHours > 0 ? (hoursUsed / budgetedHours) * 100 : 0;

                return (
                  <tr key={project.id} className="border-b border-[#E8EDE9] last:border-0 hover:bg-[#F7F9F7]/50 transition-colors">
                    <td className="px-6 py-4">
                      <Link href={`/projects/${project.id}`} className="font-semibold text-[#1A2E22] hover:text-[#2D6A4F]">
                        {project.name}
                      </Link>
                      <div className="text-xs text-[#A3BEA9] mt-1">{project.projectNumber || "—"}</div>
                    </td>
                    <td className="px-6 py-4 text-[#6B8C74]">{project.clientName || "—"}</td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium rounded-full bg-[#F0FAF4] text-[#2D6A4F] px-2 py-1">
                        {PHASE_SHORT_LABELS[currentPhase.phaseType]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {(() => {
                        const alertLevel = getBudgetAlertLevel(hoursUsed, budgetedHours);
                        if (alertLevel) {
                          const alert = ALERT_LABELS[alertLevel];
                          return (
                            <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full border ${alert.bgColor}`}>
                              <AlertTriangle className="w-3 h-3" />
                              {alertLevel === "OVER_100" ? "Over budget" : alertLevel === "CRITICAL_90" ? "At risk" : "Watch"}
                            </span>
                          );
                        }
                        return (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-[#F0FAF4] text-[#2D6A4F] border border-[#52B788]/20">
                            <CheckCircle2 className="w-3 h-3" />
                            On track
                          </span>
                        );
                      })()}
                    </td>
                    <td className="px-6 py-4 text-[#1A2E22]">${budgetedFee.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-24 overflow-hidden rounded-full bg-[#E8EDE9] h-2">
                          <div
                            className={`h-2 rounded-full ${getBurnColor(burnPercent)}`}
                            style={{ width: `${Math.min(burnPercent, 100)}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-[#1A2E22]">{burnPercent.toFixed(0)}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
