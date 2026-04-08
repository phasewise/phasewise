import { notFound } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/supabase/auth";
import { prisma } from "@/lib/prisma";
import { PHASE_LABELS, STATUS_COLORS } from "@/lib/constants";
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
      phases: { orderBy: { sortOrder: "asc" } },
    },
  });

  if (!project || project.organizationId !== currentUser.organizationId) {
    notFound();
  }

  const assignments = await prisma.projectAssignment.findMany({
    where: { projectId: project.id },
    include: { user: true },
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

  const budgetedFee = project.phases.reduce(
    (sum, phase) => sum + Number(phase.budgetedFee ?? 0),
    0
  );

  const budgetedHours = project.phases.reduce(
    (sum, phase) => sum + Number(phase.budgetedHours ?? 0),
    0
  );

  return (
    <div className="p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-8">
        <div>
          <p className="text-sm text-slate-500">Project detail</p>
          <h1 className="text-3xl font-semibold text-slate-900">{project.name}</h1>
          <p className="text-sm text-slate-500 mt-1">{project.projectNumber || "No project number"}</p>
        </div>
        <Link
          href="/projects"
          className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
        >
          Back to projects
        </Link>
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
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Budgeted fee</div>
                <div className="mt-2 text-xl font-semibold text-slate-900">${budgetedFee.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Budgeted hours</div>
                <div className="mt-2 text-xl font-semibold text-slate-900">{budgetedHours.toFixed(1)}h</div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Project phases</h2>
            <div className="space-y-4">
              {project.phases.map((phase) => (
                <div key={phase.id} className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">{PHASE_LABELS[phase.phaseType]}</h3>
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500 mt-1">{phase.status.replace("_", " ")}</p>
                    </div>
                    <div className="text-sm text-slate-600">
                      {Number(phase.budgetedHours ?? 0).toFixed(1)}h · ${Number(phase.budgetedFee ?? 0).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
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
