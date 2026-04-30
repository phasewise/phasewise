import { ArrowUpRight, FolderKanban, AlertTriangle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { PHASE_SHORT_LABELS, STATUS_COLORS } from "@/lib/constants";
import { getCurrentUser } from "@/lib/supabase/auth";
import { prisma } from "@/lib/prisma";
import { getBudgetAlertLevel, ALERT_LABELS } from "@/lib/budget-alerts";

// Display order for status sections — matches the Projects page so users
// see the same hierarchy in both places.
const SECTION_ORDER: Array<{
  value: string;
  label: string;
  description: string;
  defaultOpen: boolean;
}> = [
  { value: "ACTIVE", label: "Active", description: "Currently in progress.", defaultOpen: true },
  { value: "ON_HOLD", label: "On hold", description: "Paused or awaiting input.", defaultOpen: true },
  { value: "COMPLETED", label: "Completed", description: "Wrapped up; kept for reference.", defaultOpen: false },
  { value: "ARCHIVED", label: "Archived", description: "No longer active or relevant.", defaultOpen: false },
];

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

  // Onboarding checklist data
  const teamCount = await prisma.user.count({
    where: { organizationId: currentUser.organizationId, isActive: true },
  });
  const hasMultipleMembers = teamCount > 1;
  const hasProjects = projects.length > 0;
  const hasTimeEntries = timeTotals.length > 0;
  const onboardingComplete = hasProjects && hasMultipleMembers && hasTimeEntries;

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

      {/* Onboarding checklist — shown until setup is complete */}
      {!onboardingComplete && (
        <div className="mb-8 rounded-2xl border border-[#52B788]/30 bg-[#F0FAF4] p-6">
          <h2 className="font-serif text-lg text-[#1A2E22] mb-1">Get started with Phasewise</h2>
          <p className="text-sm text-[#6B8C74] mb-4">Complete these steps to get the most out of your firm&apos;s new project management platform.</p>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${hasProjects ? "bg-[#2D6A4F] text-white" : "bg-white border-2 border-[#E2EBE4] text-[#A3BEA9]"}`}>
                {hasProjects ? "✓" : "1"}
              </div>
              <div className="flex-1">
                <span className={`text-sm font-medium ${hasProjects ? "text-[#6B8C74] line-through" : "text-[#1A2E22]"}`}>
                  Create your first project
                </span>
              </div>
              {!hasProjects && (
                <Link href="/projects/new" className="text-xs font-medium text-[#2D6A4F] hover:underline">
                  Create project →
                </Link>
              )}
            </div>
            <div className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${hasMultipleMembers ? "bg-[#2D6A4F] text-white" : "bg-white border-2 border-[#E2EBE4] text-[#A3BEA9]"}`}>
                {hasMultipleMembers ? "✓" : "2"}
              </div>
              <div className="flex-1">
                <span className={`text-sm font-medium ${hasMultipleMembers ? "text-[#6B8C74] line-through" : "text-[#1A2E22]"}`}>
                  Add your team
                </span>
              </div>
              {!hasMultipleMembers && (
                <Link href="/settings/team" className="text-xs font-medium text-[#2D6A4F] hover:underline">
                  Add team →
                </Link>
              )}
            </div>
            <div className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${hasTimeEntries ? "bg-[#2D6A4F] text-white" : "bg-white border-2 border-[#E2EBE4] text-[#A3BEA9]"}`}>
                {hasTimeEntries ? "✓" : "3"}
              </div>
              <div className="flex-1">
                <span className={`text-sm font-medium ${hasTimeEntries ? "text-[#6B8C74] line-through" : "text-[#1A2E22]"}`}>
                  Log your first time entry
                </span>
              </div>
              {!hasTimeEntries && (
                <Link href="/time" className="text-xs font-medium text-[#2D6A4F] hover:underline">
                  Log time →
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

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

      {projects.length === 0 ? (
        <div className="rounded-2xl border border-[#E2EBE4] bg-white shadow-sm px-6 py-12 text-center">
          <FolderKanban className="w-10 h-10 text-[#A3BEA9] mx-auto mb-3" />
          <h3 className="font-semibold text-[#1A2E22] mb-1">No projects yet</h3>
          <p className="text-sm text-[#6B8C74] mb-3">
            Create your first project to start tracking work, budgets, and timelines.
          </p>
          <Link href="/projects/new" className="text-sm font-medium text-[#2D6A4F] hover:text-[#40916C]">
            Create a project &rarr;
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {/* One "View all projects" link sits above the sections so it
              doesn't have to live inside <summary> (which would conflict
              with the native click-to-toggle behavior). */}
          <div className="flex items-center justify-between px-1">
            <h2 className="text-base font-semibold text-[#1A2E22]">Projects</h2>
            <Link
              href="/projects"
              className="text-sm font-semibold text-[#2D6A4F] hover:text-[#40916C] inline-flex items-center gap-1"
            >
              View all <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          {SECTION_ORDER.map((section) => {
            const sectionProjects = projects.filter((p) => p.status === section.value);
            if (sectionProjects.length === 0) return null;

            return (
              // <details> gives native collapse without needing a client
              // component. open={section.defaultOpen} sets the initial state.
              <details
                key={section.value}
                open={section.defaultOpen}
                className="rounded-2xl border border-[#E2EBE4] bg-white shadow-sm overflow-hidden group"
              >
                <summary className="flex items-center justify-between border-b border-[#E2EBE4] px-6 py-5 cursor-pointer list-none hover:bg-[#F7F9F7] transition-colors">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-slate-400 group-open:rotate-90 transition-transform">▶</span>
                    <h3
                      className={`text-base font-semibold ${
                        section.value === "ACTIVE" || section.value === "ON_HOLD"
                          ? "text-[#1A2E22]"
                          : "text-[#3D5C48]"
                      }`}
                    >
                      {section.label}
                    </h3>
                    <span className="text-xs text-[#6B8C74] px-2 py-0.5 rounded-full bg-[#F0FAF4]">
                      {sectionProjects.length}
                    </span>
                    <span className="hidden sm:inline text-sm text-[#6B8C74] truncate">
                      · {section.description}
                    </span>
                  </div>
                  <span className="text-xs text-[#6B8C74]">
                    Click to {section.defaultOpen ? "hide" : "show"}
                  </span>
                </summary>

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
                      {sectionProjects.map((project) => {
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
                        const burnPercent =
                          budgetedHours > 0 ? (hoursUsed / budgetedHours) * 100 : 0;
                        const isHistorical =
                          section.value === "COMPLETED" || section.value === "ARCHIVED";

                        return (
                          <tr
                            key={project.id}
                            className={`border-b border-[#E8EDE9] last:border-0 hover:bg-[#F7F9F7]/50 transition-colors ${
                              isHistorical ? "opacity-75" : ""
                            }`}
                          >
                            <td className="px-6 py-4">
                              <Link
                                href={`/projects/${project.id}`}
                                className="font-semibold text-[#1A2E22] hover:text-[#2D6A4F]"
                              >
                                {project.name}
                              </Link>
                              <div className="text-xs text-[#A3BEA9] mt-1">
                                {project.projectNumber || "—"}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-[#6B8C74]">
                              {project.clientName || "—"}
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-xs font-medium rounded-full bg-[#F0FAF4] text-[#2D6A4F] px-2 py-1">
                                {PHASE_SHORT_LABELS[currentPhase.phaseType]}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              {section.value === "ACTIVE"
                                ? (() => {
                                    const alertLevel = getBudgetAlertLevel(hoursUsed, budgetedHours);
                                    if (alertLevel) {
                                      const alert = ALERT_LABELS[alertLevel];
                                      return (
                                        <span
                                          className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full border ${alert.bgColor}`}
                                        >
                                          <AlertTriangle className="w-3 h-3" />
                                          {alertLevel === "OVER_100"
                                            ? "Over budget"
                                            : alertLevel === "CRITICAL_90"
                                            ? "At risk"
                                            : "Watch"}
                                        </span>
                                      );
                                    }
                                    return (
                                      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-[#F0FAF4] text-[#2D6A4F] border border-[#52B788]/20">
                                        <CheckCircle2 className="w-3 h-3" />
                                        On track
                                      </span>
                                    );
                                  })()
                                : (
                                  // Health doesn't apply for non-active statuses;
                                  // show the project status instead so users still
                                  // see at-a-glance state.
                                  <span
                                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                                      STATUS_COLORS[project.status] ?? "bg-slate-100 text-slate-600"
                                    }`}
                                  >
                                    {project.status.replace("_", " ")}
                                  </span>
                                )}
                            </td>
                            <td className="px-6 py-4 text-[#1A2E22]">
                              ${budgetedFee.toLocaleString()}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-24 overflow-hidden rounded-full bg-[#E8EDE9] h-2">
                                  <div
                                    className={`h-2 rounded-full ${getBurnColor(burnPercent)}`}
                                    style={{ width: `${Math.min(burnPercent, 100)}%` }}
                                  />
                                </div>
                                <span className="text-xs font-semibold text-[#1A2E22]">
                                  {burnPercent.toFixed(0)}%
                                </span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </details>
            );
          })}
        </div>
      )}
    </div>
  );
}
