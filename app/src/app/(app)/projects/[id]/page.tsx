import { notFound } from "next/navigation";
import Link from "next/link";
import { FileText, MinusCircle, Receipt } from "lucide-react";
import { getCurrentUser } from "@/lib/supabase/auth";
import { prisma } from "@/lib/prisma";
import { STATUS_COLORS, getPhaseDisplayName } from "@/lib/constants";
import ProjectTasksClient from "./ProjectTasksClient";
import ProjectComplianceClient, { ProjectComplianceItem } from "./ProjectComplianceClient";

const INVOICE_STATUS_COLORS: Record<string, string> = {
  DRAFT: "bg-[#F7F9F7] text-[#6B8C74] border-[#E2EBE4]",
  SENT: "bg-blue-50 text-blue-700 border-blue-200",
  PAID: "bg-[#F0FAF4] text-[#2D6A4F] border-[#52B788]/30",
  PARTIALLY_PAID: "bg-amber-50 text-amber-700 border-amber-200",
  OVERDUE: "bg-rose-50 text-rose-700 border-rose-200",
  VOID: "bg-[#F7F9F7] text-[#A3BEA9] border-[#E2EBE4]",
};

function formatMonthYear(d: Date): string {
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long" });
}

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

  // Detail-page access mirrors the list-page filter: oversight roles see
  // every project; PM/STAFF only see ones they're assigned to (either via
  // ProjectAssignment or a PhaseStaffPlan on any phase). Without this, a
  // junior could deep-link to /projects/<id> and view senior billing
  // rates and budgets.
  const seesAllProjects =
    currentUser.role === "OWNER" ||
    currentUser.role === "ADMIN" ||
    currentUser.role === "SUPERVISOR";

  if (!seesAllProjects) {
    const isAssigned = assignments.some((a) => a.userId === currentUser.id);
    const hasWorkPlanRow = project.phases.some((ph) =>
      ph.workPlan.some((row) => row.userId === currentUser.id)
    );
    if (!isAssigned && !hasWorkPlanRow) {
      notFound();
    }
  }

  const tasks = await prisma.projectTask.findMany({
    where: { projectId: project.id },
    include: { assignedTo: true },
    orderBy: { createdAt: "desc" },
  });

  // Include archived rows here — the client toggle decides whether to
  // show them. Default is hidden, but keeping them in the payload means
  // the toggle works without a re-fetch.
  const complianceItems = await prisma.complianceItem.findMany({
    where: { projectId: project.id },
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });

  // Billing section — invoices + skipped months. Only fetched (and
  // rendered) for OWNER/ADMIN/PM since billing data shouldn't be
  // visible to staff/supervisor on a project page.
  const seesBilling =
    currentUser.role === "OWNER" ||
    currentUser.role === "ADMIN" ||
    currentUser.role === "PM";
  const projectInvoices = seesBilling
    ? await prisma.invoice.findMany({
        where: { projectId: project.id },
        orderBy: [{ periodStart: "desc" }, { issueDate: "desc" }],
      })
    : [];
  const projectSkips = seesBilling
    ? await prisma.billingEvent.findMany({
        where: { projectId: project.id, kind: "SKIPPED_NO_HOURS" },
        orderBy: { periodStart: "desc" },
      })
    : [];

  // Merge invoices + skip events into a single timeline keyed by period.
  // Each entry shows what happened that month: invoiced (with details)
  // or skipped (with reason).
  type BillingTimelineRow =
    | {
        kind: "INVOICE";
        sortKey: number;
        periodLabel: string | null;
        invoiceNumber: string;
        status: string;
        total: number;
        paidAmount: number;
        issueDate: Date;
        dueDate: Date;
        invoiceId: string;
      }
    | {
        kind: "SKIPPED";
        sortKey: number;
        periodLabel: string;
        note: string | null;
      };

  const billingTimeline: BillingTimelineRow[] = [];
  for (const inv of projectInvoices) {
    const sortKey = (inv.periodStart ?? inv.issueDate).getTime();
    billingTimeline.push({
      kind: "INVOICE",
      sortKey,
      periodLabel:
        inv.periodStart && inv.periodEnd
          ? `${formatMonthYear(inv.periodStart)}${
              formatMonthYear(inv.periodStart) === formatMonthYear(inv.periodEnd)
                ? ""
                : ` – ${formatMonthYear(inv.periodEnd)}`
            }`
          : null,
      invoiceNumber: inv.invoiceNumber,
      status: inv.status,
      total: Number(inv.total),
      paidAmount: Number(inv.paidAmount),
      issueDate: inv.issueDate,
      dueDate: inv.dueDate,
      invoiceId: inv.id,
    });
  }
  for (const skip of projectSkips) {
    billingTimeline.push({
      kind: "SKIPPED",
      sortKey: skip.periodStart.getTime(),
      periodLabel: formatMonthYear(skip.periodStart),
      note: skip.note,
    });
  }
  billingTimeline.sort((a, b) => b.sortKey - a.sortKey);

  // Pre-extract MWELO summary numbers so the client renders without
  // doing JSON gymnastics. Same shape as the compliance list page.
  const complianceForView: ProjectComplianceItem[] = complianceItems.map((item) => {
    let mweloSummary: { mawa: number; etwu: number; passes: boolean } | null = null;
    if (item.category === "MWELO" && item.mweloCalculation) {
      const calc = item.mweloCalculation as {
        outputs?: { mawa?: unknown; etwu?: unknown; passes?: unknown };
      };
      const mawa = Number(calc.outputs?.mawa ?? 0);
      const etwu = Number(calc.outputs?.etwu ?? 0);
      const passes = Boolean(calc.outputs?.passes);
      if (mawa > 0 || etwu > 0) {
        mweloSummary = { mawa, etwu, passes };
      }
    }
    return {
      id: item.id,
      category: item.category,
      name: item.name,
      description: item.description,
      status: item.status,
      dueDate: item.dueDate?.toISOString() ?? null,
      notes: item.notes,
      archivedAt: item.archivedAt?.toISOString() ?? null,
      mweloSummary,
    };
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

          <ProjectComplianceClient items={complianceForView} />

          {/* Billing — Owner / Admin / PM only. Shows invoice history
              for this project plus any cron-recorded skipped months so
              the user can see "Feb 2026 — skipped, no billable hours"
              and know it didn't fall through the cracks. */}
          {seesBilling && (
            <div className="rounded-3xl border border-[#E2EBE4] bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-[#2D6A4F]" />
                  <h2 className="text-lg font-semibold text-[#1A2E22]">Billing</h2>
                </div>
                <Link
                  href="/admin/billing"
                  className="text-xs font-medium text-[#2D6A4F] hover:text-[#40916C] hover:underline"
                >
                  Manage all invoices →
                </Link>
              </div>

              {billingTimeline.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[#E2EBE4] bg-[#F7F9F7] p-6 text-center">
                  <p className="text-sm text-[#6B8C74]">
                    No invoices or billing activity for this project yet.
                  </p>
                  <Link
                    href="/admin/billing"
                    className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#F0FAF4] text-[#2D6A4F] border border-[#52B788]/30 hover:bg-[#52B788] hover:text-white transition-colors"
                  >
                    <FileText className="w-3 h-3" />
                    Create invoice
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {billingTimeline.map((row, i) => {
                    if (row.kind === "INVOICE") {
                      const balance = row.total - row.paidAmount;
                      return (
                        <div
                          key={`inv-${row.invoiceId}`}
                          className="rounded-2xl border border-[#E8EDE9] bg-[#F7F9F7] px-4 py-3"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <FileText className="w-3.5 h-3.5 text-[#2D6A4F]" />
                                <span className="font-mono text-xs font-semibold text-[#2D6A4F]">
                                  {row.invoiceNumber}
                                </span>
                                <span
                                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                                    INVOICE_STATUS_COLORS[row.status] ?? ""
                                  }`}
                                >
                                  {row.status.replace("_", " ")}
                                </span>
                                {row.periodLabel && (
                                  <span className="text-[10px] text-[#6B8C74]">
                                    · Period: {row.periodLabel}
                                  </span>
                                )}
                              </div>
                              <div className="mt-1 text-xs text-[#6B8C74]">
                                Issued {row.issueDate.toLocaleDateString()} · Due{" "}
                                {row.dueDate.toLocaleDateString()}
                              </div>
                            </div>
                            <div className="flex items-center gap-3 flex-shrink-0">
                              <div className="text-right">
                                <div className="text-sm font-semibold text-[#1A2E22]">
                                  ${row.total.toLocaleString()}
                                </div>
                                <div
                                  className={`text-[11px] ${
                                    balance > 0 ? "text-amber-600" : "text-[#2D6A4F]"
                                  }`}
                                >
                                  {balance > 0
                                    ? `$${balance.toLocaleString()} balance`
                                    : "Paid"}
                                </div>
                              </div>
                              <a
                                href={`/api/invoices/${row.invoiceId}/pdf`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[11px] font-semibold text-[#2D6A4F] hover:text-[#40916C] hover:underline"
                              >
                                PDF
                              </a>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return (
                      <div
                        key={`skip-${i}`}
                        className="rounded-2xl border border-[#E8EDE9] bg-[#F7F9F7] px-4 py-3 flex items-center gap-3"
                      >
                        <MinusCircle className="w-4 h-4 text-[#A3BEA9] flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="text-sm text-[#3D5C48]">
                            <span className="font-medium">Skipped {row.periodLabel}</span>
                            <span className="text-[#A3BEA9]"> — no billable hours logged</span>
                          </div>
                          {row.note && (
                            <div className="text-[10px] text-[#A3BEA9] mt-0.5">
                              {row.note}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

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
