import Link from "next/link";
import { getCurrentUser } from "@/lib/supabase/auth";
import { prisma } from "@/lib/prisma";
import ProjectsClient, { ProjectListItem } from "./ProjectsClient";

export default async function ProjectsPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return (
      <div className="p-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-slate-700">
          <h1 className="text-2xl font-semibold mb-4">Projects</h1>
          <p className="text-sm text-slate-500">
            Unable to load your account. Please <Link href="/login" className="text-emerald-600 hover:underline">sign in</Link> again.
          </p>
        </div>
      </div>
    );
  }

  // Project visibility:
  //  - OWNER/ADMIN/SUPERVISOR see every project in the org (oversight roles)
  //  - PM/STAFF only see projects where they have a ProjectAssignment OR
  //    a PhaseStaffPlan on at least one phase. This prevents a junior
  //    designer from browsing billing rates and fees on senior projects.
  const seesAllProjects =
    currentUser.role === "OWNER" ||
    currentUser.role === "ADMIN" ||
    currentUser.role === "SUPERVISOR";

  // Fetch ALL projects (including ARCHIVED) — the client renders archived
  // ones in a separate collapsible section so users can still find old work
  // without polluting the main view.
  const projects = await prisma.project.findMany({
    where: {
      organizationId: currentUser.organizationId,
      ...(seesAllProjects
        ? {}
        : {
            OR: [
              { assignments: { some: { userId: currentUser.id } } },
              {
                phases: {
                  some: { workPlan: { some: { userId: currentUser.id } } },
                },
              },
            ],
          }),
    },
    include: {
      phases: { orderBy: { sortOrder: "asc" } },
    },
    orderBy: { updatedAt: "desc" },
    take: 1000,
  });

  const timeTotals = await prisma.timeEntry.groupBy({
    by: ["projectId"],
    where: { organizationId: currentUser.organizationId },
    _sum: { hours: true },
  });

  const projectTimeMap = new Map(
    timeTotals.map((entry) => [entry.projectId, Number(entry._sum.hours ?? 0)])
  );

  const items: ProjectListItem[] = projects.map((project) => ({
    id: project.id,
    name: project.name,
    projectNumber: project.projectNumber,
    clientName: project.clientName,
    city: project.city,
    projectType: project.projectType,
    status: project.status,
    hoursUsed: projectTimeMap.get(project.id) ?? 0,
    phases: project.phases.map((phase) => ({
      phaseType: phase.phaseType,
      status: phase.status,
      budgetedFee: Number(phase.budgetedFee ?? 0),
      budgetedHours: Number(phase.budgetedHours ?? 0),
    })),
  }));

  return <ProjectsClient projects={items} />;
}
