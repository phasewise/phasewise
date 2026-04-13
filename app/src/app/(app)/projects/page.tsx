import Link from "next/link";
import { ArrowUpRight, FolderPlus } from "lucide-react";
import { getCurrentUser } from "@/lib/supabase/auth";
import { prisma } from "@/lib/prisma";
import { PHASE_SHORT_LABELS, STATUS_COLORS } from "@/lib/constants";

function getCurrentPhase(phases: Array<{ phaseType: string; status: string }>) {
  const activePhase = phases.find((phase) => phase.status !== "COMPLETE");
  return activePhase ?? phases[phases.length - 1] ?? { phaseType: "PRE_DESIGN", status: "NOT_STARTED" };
}

export default async function ProjectsPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return (
      <div className="p-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-slate-700">
          <h1 className="text-2xl font-semibold mb-4">Projects</h1>
          <p className="text-sm text-slate-500">Unable to load your account. Please sign in again.</p>
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
    const budgetedHours = Number(
      project.phases.reduce(
        (sum, phase) => sum + Number(phase.budgetedHours ?? 0),
        0
      )
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
          const budgetedHours = Number(
            project.phases.reduce(
              (phaseSum, phase) => phaseSum + Number(phase.budgetedHours ?? 0),
              0
            )
          );
          const hoursUsed = projectTimeMap.get(project.id) ?? 0;
          return sum + (budgetedHours > 0 ? (hoursUsed / budgetedHours) * 100 : 0);
        }, 0) / activeProjects.length
      : 0;

  return (
    <div className="p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Projects</h1>
          <p className="text-sm text-slate-500 mt-1">All projects for your organization</p>
        </div>
        <Link
          href="/projects/new"
          className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500"
        >
          <FolderPlus className="h-4 w-4" />
          New Project
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-4 mb-8">
        {[
          {
            label: "Active Projects",
            value: activeProjects.length,
            color: "text-sky-600 bg-sky-50",
          },
          {
            label: "At Risk",
            value: atRiskProjects.length,
            color: "text-rose-600 bg-rose-50",
          },
          {
            label: "Total Fee",
            value: `$${(totalFee / 1000).toFixed(0)}K`,
            color: "text-emerald-600 bg-emerald-50",
          },
          {
            label: "Avg Burn Rate",
            value: `${avgBurn.toFixed(0)}%`,
            color: "text-violet-600 bg-violet-50",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 mb-3">
              {stat.label}
            </div>
            <div className={`text-3xl font-semibold ${stat.color}`}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Projects</h2>
            <p className="text-sm text-slate-500">All active work for your organization.</p>
          </div>
          <Link href="/projects" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1">
            View all <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm text-slate-700">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
              <tr>
                <th className="px-6 py-4 font-medium">Project</th>
                <th className="px-6 py-4 font-medium">Client</th>
                <th className="px-6 py-4 font-medium">Phase</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Budget</th>
                <th className="px-6 py-4 font-medium">Burn</th>
              </tr>
            </thead>
            <tbody>
              {projects.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <FolderPlus className="w-10 h-10 text-[#A3BEA9] mx-auto mb-3" />
                    <h3 className="font-semibold text-slate-900 mb-1">No projects yet</h3>
                    <p className="text-sm text-slate-500 mb-3">Get started by creating your first project.</p>
                    <Link href="/projects/new" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700">
                      Create a project &rarr;
                    </Link>
                  </td>
                </tr>
              )}
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
                  <tr key={project.id} className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <Link href={`/projects/${project.id}`} className="font-semibold text-slate-900 hover:text-emerald-600">
                        {project.name}
                      </Link>
                      <div className="text-xs text-slate-500 mt-1">{project.projectNumber || "—"}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{project.clientName || "—"}</td>
                    <td className="px-6 py-4 text-slate-600">
                      <span className="text-xs font-medium rounded-full bg-slate-100 px-2 py-1">
                        {PHASE_SHORT_LABELS[currentPhase?.phaseType ?? "PRE_DESIGN"]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${STATUS_COLORS[project.status]}`}> 
                        {project.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">${budgetedFee.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-24 overflow-hidden rounded-full bg-slate-100 h-2">
                          <div
                            className={`h-2 rounded-full ${burnPercent >= 95 ? "bg-red-500" : burnPercent >= 80 ? "bg-yellow-500" : "bg-emerald-500"}`}
                            style={{ width: `${Math.min(burnPercent, 100)}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-slate-700">{burnPercent.toFixed(0)}%</span>
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
