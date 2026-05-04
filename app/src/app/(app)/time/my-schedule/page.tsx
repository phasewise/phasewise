import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase/auth";
import { prisma } from "@/lib/prisma";
import { PHASE_LABELS } from "@/lib/constants";

export const dynamic = "force-dynamic";

// Staff-facing read-only view of "what am I supposed to be working on"
// — pulled from PhaseStaffPlan rows the manager set up in Work Plan.
// Pairs each plan with the actual hours the user has logged on that
// phase so they see progress against the plan at a glance.

function formatHours(n: number): string {
  return n.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

export default async function MySchedulePage() {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/login");

  // Pull this user's phase assignments + the parent project + the phase
  // type/custom name. Filter out archived projects so the page stays
  // forward-looking.
  const plans = await prisma.phaseStaffPlan.findMany({
    where: {
      userId: currentUser.id,
      phase: {
        project: {
          status: { not: "ARCHIVED" },
          organizationId: currentUser.organizationId,
        },
      },
    },
    include: {
      phase: {
        select: {
          id: true,
          phaseType: true,
          customName: true,
          status: true,
          sortOrder: true,
          project: {
            select: {
              id: true,
              name: true,
              projectNumber: true,
              status: true,
            },
          },
        },
      },
    },
  });

  // Aggregate hours logged per phase by this user. One query keyed by
  // phaseId; we look up each plan against this map below.
  const phaseIds = plans.map((p) => p.phaseId);
  const loggedPerPhase = phaseIds.length
    ? await prisma.timeEntry.groupBy({
        by: ["phaseId"],
        where: {
          userId: currentUser.id,
          phaseId: { in: phaseIds },
        },
        _sum: { hours: true },
      })
    : [];
  const loggedMap = new Map<string, number>(
    loggedPerPhase
      .filter((g): g is typeof g & { phaseId: string } => g.phaseId !== null)
      .map((g) => [g.phaseId, Number(g._sum.hours ?? 0)])
  );

  // Group plans by project, sort projects by name and phases by
  // sortOrder so the layout matches the Work Plan editor view.
  type PlanRow = {
    planId: string;
    phaseId: string;
    phaseLabel: string;
    phaseStatus: string;
    sortOrder: number;
    plannedHours: number;
    loggedHours: number;
  };
  type ProjectGroup = {
    projectId: string;
    projectName: string;
    projectNumber: string | null;
    projectStatus: string;
    rows: PlanRow[];
    plannedTotal: number;
    loggedTotal: number;
  };
  const groups = new Map<string, ProjectGroup>();
  for (const p of plans) {
    const proj = p.phase.project;
    const phaseLabel = p.phase.customName
      || PHASE_LABELS[p.phase.phaseType as keyof typeof PHASE_LABELS]
      || p.phase.phaseType;
    const planned = Number(p.plannedHours);
    const logged = loggedMap.get(p.phaseId) ?? 0;
    const existing = groups.get(proj.id);
    if (existing) {
      existing.rows.push({
        planId: p.id,
        phaseId: p.phaseId,
        phaseLabel,
        phaseStatus: p.phase.status,
        sortOrder: p.phase.sortOrder,
        plannedHours: planned,
        loggedHours: logged,
      });
      existing.plannedTotal += planned;
      existing.loggedTotal += logged;
    } else {
      groups.set(proj.id, {
        projectId: proj.id,
        projectName: proj.name,
        projectNumber: proj.projectNumber,
        projectStatus: proj.status,
        rows: [
          {
            planId: p.id,
            phaseId: p.phaseId,
            phaseLabel,
            phaseStatus: p.phase.status,
            sortOrder: p.phase.sortOrder,
            plannedHours: planned,
            loggedHours: logged,
          },
        ],
        plannedTotal: planned,
        loggedTotal: logged,
      });
    }
  }
  const projectGroups = Array.from(groups.values())
    .map((g) => ({ ...g, rows: g.rows.sort((a, b) => a.sortOrder - b.sortOrder) }))
    .sort((a, b) => a.projectName.localeCompare(b.projectName));

  const totalPlanned = projectGroups.reduce((s, g) => s + g.plannedTotal, 0);
  const totalLogged = projectGroups.reduce((s, g) => s + g.loggedTotal, 0);

  return (
    <div className="p-6 lg:p-10 max-w-5xl">
      <Link
        href="/time"
        className="inline-flex items-center gap-1.5 text-sm text-[#6B8C74] hover:text-[#2D6A4F] mb-6 transition-colors"
      >
        <ArrowLeft size={14} /> Time Sheets
      </Link>

      <div className="mb-8">
        <h1 className="font-serif text-3xl text-[#1A2E22]">My Schedule</h1>
        <p className="mt-1 text-sm text-[#6B8C74]">
          What you&apos;re assigned to work on, and how much you&apos;ve logged toward each phase.
        </p>
      </div>

      {projectGroups.length === 0 ? (
        <div className="rounded-2xl border border-[#E2EBE4] bg-white shadow-sm px-6 py-12 text-center">
          <p className="text-sm text-[#6B8C74]">
            You aren&apos;t assigned to any active project phases yet. Ask your project manager to add you on the Work Plan.
          </p>
        </div>
      ) : (
        <>
          {/* Summary card */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
            <div className="rounded-2xl border border-[#E2EBE4] bg-white p-5 shadow-sm">
              <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6B8C74] mb-2">
                Active Projects
              </div>
              <div className="text-2xl font-semibold text-[#1A2E22]">{projectGroups.length}</div>
            </div>
            <div className="rounded-2xl border border-[#E2EBE4] bg-white p-5 shadow-sm">
              <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6B8C74] mb-2">
                Planned Hours
              </div>
              <div className="text-2xl font-semibold text-[#1A2E22]">{formatHours(totalPlanned)}</div>
            </div>
            <div className="rounded-2xl border border-[#E2EBE4] bg-white p-5 shadow-sm">
              <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6B8C74] mb-2">
                Logged So Far
              </div>
              <div className="text-2xl font-semibold text-[#2D6A4F]">{formatHours(totalLogged)}</div>
            </div>
          </div>

          <div className="space-y-4">
            {projectGroups.map((g) => {
              const projPct = g.plannedTotal > 0 ? (g.loggedTotal / g.plannedTotal) * 100 : 0;
              return (
                <div
                  key={g.projectId}
                  className="rounded-2xl border border-[#E2EBE4] bg-white shadow-sm overflow-hidden"
                >
                  <div className="px-6 py-4 border-b border-[#E2EBE4] flex flex-wrap items-center justify-between gap-3">
                    <div className="min-w-0">
                      <Link
                        href={`/projects/${g.projectId}`}
                        className="font-semibold text-[#1A2E22] hover:text-[#2D6A4F] transition-colors"
                      >
                        {g.projectName}
                      </Link>
                      {g.projectNumber && (
                        <span className="ml-2 text-xs text-[#6B8C74] font-mono">
                          {g.projectNumber}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-[#3D5C48]">
                      <span className="font-medium text-[#1A2E22]">{formatHours(g.loggedTotal)}</span>
                      <span className="text-[#6B8C74]"> of {formatHours(g.plannedTotal)} hrs</span>
                      {g.plannedTotal > 0 && (
                        <span
                          className={`ml-2 font-semibold ${
                            projPct >= 100 ? "text-rose-600" : projPct >= 90 ? "text-amber-600" : "text-[#2D6A4F]"
                          }`}
                        >
                          ({projPct.toFixed(0)}%)
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="divide-y divide-[#F0F2F0]">
                    {g.rows.map((r) => {
                      const remaining = r.plannedHours - r.loggedHours;
                      const pct = r.plannedHours > 0 ? (r.loggedHours / r.plannedHours) * 100 : 0;
                      const isOver = pct > 100;
                      return (
                        <div key={r.planId} className="px-6 py-4 flex flex-wrap items-center gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-[#1A2E22]">{r.phaseLabel}</div>
                            <div className="text-xs text-[#6B8C74] mt-0.5">
                              Phase status: {r.phaseStatus.replace(/_/g, " ").toLowerCase()}
                            </div>
                          </div>
                          <div className="flex-1 max-w-[280px]">
                            <div className="h-2 rounded-full bg-[#F0F2F0] overflow-hidden">
                              <div
                                className={`h-full ${
                                  isOver
                                    ? "bg-rose-500"
                                    : pct >= 90
                                    ? "bg-amber-400"
                                    : "bg-[#52B788]"
                                }`}
                                style={{ width: `${Math.min(100, pct)}%` }}
                              />
                            </div>
                            <div className="mt-1 text-xs text-[#6B8C74] flex justify-between">
                              <span>
                                <span className="font-medium text-[#1A2E22]">{formatHours(r.loggedHours)}</span>
                                <span> logged</span>
                              </span>
                              <span>
                                {remaining >= 0 ? (
                                  <>
                                    <span className="font-medium text-[#2D6A4F]">{formatHours(remaining)}</span>
                                    <span> remaining</span>
                                  </>
                                ) : (
                                  <>
                                    <span className="font-medium text-rose-600">{formatHours(-remaining)}</span>
                                    <span> over</span>
                                  </>
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA back to timesheet */}
          <div className="mt-8 text-center">
            <Link
              href="/time"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium bg-[#2D6A4F] text-white hover:bg-[#40916C] transition-colors"
            >
              Log time on these phases →
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
