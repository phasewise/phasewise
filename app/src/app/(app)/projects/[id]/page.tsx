import { notFound } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/supabase/auth";
import { prisma } from "@/lib/prisma";
import { STATUS_COLORS, getPhaseDisplayName } from "@/lib/constants";
import ProjectTasksClient from "./ProjectTasksClient";

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    notFound();
  }

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      phases: {
        orderBy: { sortOrder: "asc" },
        include: {
          workPlan: {
            include: {
              user: { select: { id: true, fullName: true, billingRate: true } },
            },
          },
        },
      },
    },
  });

  if (!project || project.organizationId !== currentUser.organizationId) {
    notFound();
  }

  const assignments = await prisma.projectAssignment.findMany({
    where: { projectId: project.id },
    include: { user: { select: { id: true, fullName: true, billingRate: true } } },
  });

  const tasks = await prisma.projectTask.findMany({
    where: { projectId: project.id },
    include: { assignedTo: true },
    orderBy: { createdAt: "desc" },
  });

  const users = await prisma.user.findMany({
    where: { organizationId: currentUser.organizationId },
    select: { id: true, fullName: true },
    orderBy: { fullName: "asc" },
  });

  // Work Plan estimate — phase budgetedFee/Hours are kept in sync with
  // the work plan on save, so summing them gives the current estimate.
  const workPlanFee = project.phases.reduce(
    (sum, phase) => sum + Number(phase.budgetedFee ?? 0),
    0
  );

  const workPlanHours = project.phases.reduce(
    (sum, phase) => sum + Number(phase.budgetedHours ?? 0),
    0
  );

  const contractFee = project.contractFee ? Number(project.contractFee) : null;
  const variance = contractFee !== null ? contractFee - workPlanFee : null;
  const pctOfContract =
    contractFee && contractFee > 0 ? (workPlanFee / contractFee) * 100 : null;

  // Auto-estimate: calculate estimated fee per phase based on assigned
  // staff billing rates. If N staff are assigned and a phase has H budgeted
  // hours, each staff member is assumed to work H/N hours at their billing
  // rate. Total estimated fee = sum(staff_rate × hours_per_staff).
  const assignedRates = assignments
    .map((a) => Number(a.user.billingRate ?? 0))
    .filter((r) => r > 0);
  const avgBillingRate =
    assignedRates.length > 0
      ? assignedRates.reduce((sum, r) => sum + r, 0) / assignedRates.length
      : 0;

  const estimatedFee = avgBillingRate > 0
    ? project.phases.reduce(
        (sum, phase) => sum + avgBillingRate * Number(phase.budgetedHours ?? 0),
        0
      )
    : 0;

  return (
    <div className="p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-8">
        <div>
          <p className="text-sm text-slate-500">Project detail</p>
          <h1 className="text-3xl font-semibold text-slate-900">{project.name}</h1>
          <p className="text-sm text-slate-500 mt-1">{project.projectNumber || "No project number"}</p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href={`/projects/${id}/edit`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-[#2D6A4F] text-white hover:bg-[#40916C] transition-colors"
          >
            Edit project
          </Link>
          <Link
            href="/projects"
            className="text-sm font-semibold text-[#2D6A4F] hover:text-[#40916C]"
          >
            Back to projects
          </Link>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_COLORS[project.status]}`}>
                {project.status.replace("_", " ")}
              </span>
              {project.clientName && <span className="text-sm text-slate-500">Client: {project.clientName}</span>}
              {project.clientEmail && <span className="text-sm text-slate-500">{project.clientEmail}</span>}
            </div>
            <div className="grid gap-4 sm:grid-cols-4">
              <div>
                <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Contract fee</div>
                <div className="mt-2 text-xl font-semibold text-slate-900">
                  {contractFee !== null ? `$${contractFee.toLocaleString()}` : <span className="text-slate-400 font-normal">Not set</span>}
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Work Plan estimate</div>
                <div className="mt-2 text-xl font-semibold text-[#2D6A4F]">
                  ${workPlanFee.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  {workPlanHours.toFixed(1)}h across {project.phases.length} phase{project.phases.length === 1 ? "" : "s"}
                </div>
              </div>
              {variance !== null && (
                <div>
                  <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Variance</div>
                  <div
                    className={`mt-2 text-xl font-semibold ${
                      variance < 0 ? "text-rose-600" : variance === 0 ? "text-slate-900" : "text-[#2D6A4F]"
                    }`}
                  >
                    {variance < 0 ? "−" : ""}${Math.abs(variance).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    {variance < 0 ? "Over contract" : variance === 0 ? "At ceiling" : "Headroom"}
                  </div>
                </div>
              )}
              {pctOfContract !== null && (
                <div>
                  <div className="text-xs uppercase tracking-[0.24em] text-slate-500">% of contract</div>
                  <div
                    className={`mt-2 text-xl font-semibold ${
                      pctOfContract > 100 ? "text-rose-600" : pctOfContract > 90 ? "text-amber-600" : "text-slate-900"
                    }`}
                  >
                    {pctOfContract.toFixed(0)}%
                  </div>
                  <div className="h-1.5 mt-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full ${
                        pctOfContract > 100 ? "bg-rose-500" : pctOfContract > 90 ? "bg-amber-500" : "bg-[#2D6A4F]"
                      }`}
                      style={{ width: `${Math.min(pctOfContract, 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
            {estimatedFee > 0 && contractFee === null && (
              <div className="mt-4 text-xs text-slate-400">
                Set a <Link href={`/projects/${id}/edit`} className="text-[#2D6A4F] hover:underline">contract fee</Link> to track whether your Work Plan estimate fits inside what the client is paying.
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-[#E2EBE4] bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#1A2E22] mb-4">Project Phases & Work Plan</h2>
            <div className="space-y-4">
              {project.phases.map((phase) => {
                const phaseHours = Number(phase.budgetedHours ?? 0);
                const phaseFee = Number(phase.budgetedFee ?? 0);
                const workPlanEntries = phase.workPlan ?? [];
                const workPlanCost = workPlanEntries.reduce(
                  (sum: number, wp: { plannedHours: unknown; user: { billingRate: unknown } }) =>
                    sum + Number(wp.plannedHours) * Number(wp.user.billingRate ?? 0),
                  0
                );
                const workPlanHours = workPlanEntries.reduce(
                  (sum: number, wp: { plannedHours: unknown }) => sum + Number(wp.plannedHours),
                  0
                );

                return (
                  <div key={phase.id} className="rounded-2xl border border-[#E8EDE9] bg-[#F7F9F7] p-4">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
                      <div>
                        <h3 className="text-sm font-semibold text-[#1A2E22]">{getPhaseDisplayName(phase.phaseType, phase.customName)}</h3>
                        <p className="text-xs uppercase tracking-[0.24em] text-[#6B8C74] mt-1">{phase.status.replace("_", " ")}</p>
                      </div>
                      <div className="text-right text-sm">
                        <div className="text-[#1A2E22] font-medium">{phaseHours.toFixed(1)}h · ${phaseFee.toLocaleString()}</div>
                        {workPlanCost > 0 && phaseFee > 0 && (
                          <div className={`text-xs mt-0.5 ${workPlanCost > phaseFee ? "text-rose-500" : "text-[#2D6A4F]"}`}>
                            Work plan: ${workPlanCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            {workPlanCost > phaseFee ? " (over budget)" : ""}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Work Plan — assigned staff for this phase */}
                    {workPlanEntries.length > 0 ? (
                      <div className="border-t border-[#E2EBE4] pt-3 mt-2">
                        <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6B8C74] mb-2">
                          Work Plan
                        </div>
                        <div className="space-y-1.5">
                          {workPlanEntries.map((wp: { user: { id: string; fullName: string; billingRate: unknown }; plannedHours: unknown }) => {
                            const hrs = Number(wp.plannedHours);
                            const rate = Number(wp.user.billingRate ?? 0);
                            const cost = hrs * rate;
                            return (
                              <div key={wp.user.id} className="flex items-center justify-between text-xs">
                                <span className="text-[#3D5C48]">{wp.user.fullName}</span>
                                <span className="text-[#6B8C74]">
                                  {hrs.toFixed(1)}h × ${rate.toFixed(0)}/hr = <span className="font-medium text-[#1A2E22]">${cost.toLocaleString()}</span>
                                </span>
                              </div>
                            );
                          })}
                          <div className="flex items-center justify-between text-xs font-semibold pt-1 border-t border-[#E8EDE9]">
                            <span className="text-[#3D5C48]">Total</span>
                            <span className="text-[#1A2E22]">{workPlanHours.toFixed(1)}h · ${workPlanCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="border-t border-[#E2EBE4] pt-3 mt-2">
                        <p className="text-[10px] text-[#A3BEA9] italic">No work plan assigned. Edit the project to add staff to this phase.</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <ProjectTasksClient
            projectId={project.id}
            currentUserRole={currentUser.role}
            users={users}
            assignments={assignments}
            tasks={tasks}
          />
        </div>

        <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Dates</p>
          <div className="mt-4 space-y-3 text-slate-700">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Start</p>
              <p>{project.startDate ? new Date(project.startDate).toLocaleDateString() : "Not set"}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Target completion</p>
              <p>{project.targetCompletion ? new Date(project.targetCompletion).toLocaleDateString() : "Not set"}</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
