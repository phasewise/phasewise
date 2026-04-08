import { getCurrentUser } from "@/lib/supabase/auth";
import { prisma } from "@/lib/prisma";
import { PHASE_LABELS, STATUS_COLORS } from "@/lib/constants";

export default async function ProfitabilityReportPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return (
      <div className="p-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-slate-700">
          <h1 className="text-2xl font-semibold">Project profitability</h1>
          <p className="mt-3 text-sm text-slate-500">Please sign in to view reports.</p>
        </div>
      </div>
    );
  }

  const projects = await prisma.project.findMany({
    where: { organizationId: currentUser.organizationId, status: { not: "ARCHIVED" } },
    include: {
      phases: true,
    },
    orderBy: { updatedAt: "desc" },
  });

  const timeTotals = await prisma.timeEntry.groupBy({
    by: ["projectId"],
    where: { organizationId: currentUser.organizationId },
    _sum: { hours: true },
  });

  const hoursByProject = new Map(timeTotals.map((entry) => [entry.projectId, Number(entry._sum.hours ?? 0)]));

  const projectRows = projects.map((project) => {
    const budgetedFee = Number(project.phases.reduce((sum, phase) => sum + Number(phase.budgetedFee ?? 0), 0));
    const budgetedHours = Number(project.phases.reduce((sum, phase) => sum + Number(phase.budgetedHours ?? 0), 0));
    const hoursUsed = hoursByProject.get(project.id) ?? 0;
    const burnRate = budgetedHours > 0 ? (hoursUsed / budgetedHours) * 100 : 0;
    const effectiveRate = hoursUsed > 0 ? budgetedFee / hoursUsed : 0;

    return {
      id: project.id,
      name: project.name,
      status: project.status,
      budgetedFee,
      budgetedHours,
      hoursUsed,
      burnRate,
      effectiveRate,
    };
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Project profitability</h1>
        <p className="mt-2 text-sm text-slate-500">Review fee, hours, burn rate, and effective hourly rate across your projects.</p>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm text-slate-700">
          <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
            <tr>
              <th className="px-6 py-4 font-medium">Project</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Budgeted fee</th>
              <th className="px-6 py-4 font-medium">Budgeted hours</th>
              <th className="px-6 py-4 font-medium">Hours used</th>
              <th className="px-6 py-4 font-medium">Burn rate</th>
              <th className="px-6 py-4 font-medium">Effective rate</th>
            </tr>
          </thead>
          <tbody>
            {projectRows.map((project) => (
              <tr key={project.id} className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
                <td className="px-6 py-4 font-semibold text-slate-900">{project.name}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${STATUS_COLORS[project.status]}`}>
                    {project.status.replace("_", " ")}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-700">${project.budgetedFee.toLocaleString()}</td>
                <td className="px-6 py-4 text-slate-700">{project.budgetedHours.toFixed(1)}h</td>
                <td className="px-6 py-4 text-slate-700">{project.hoursUsed.toFixed(1)}h</td>
                <td className="px-6 py-4 text-slate-700">{project.burnRate.toFixed(0)}%</td>
                <td className="px-6 py-4 text-slate-700">${project.effectiveRate.toFixed(0)}/h</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
