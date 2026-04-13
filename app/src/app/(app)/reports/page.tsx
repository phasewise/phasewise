import Link from "next/link";
import { DollarSign, Users, BarChart3 } from "lucide-react";
import { getCurrentUser } from "@/lib/supabase/auth";
import { prisma } from "@/lib/prisma";

export default async function ReportsPage() {
  const currentUser = await getCurrentUser();

  // Fetch active projects for the project detail selector
  const projects = currentUser
    ? await prisma.project.findMany({
        where: {
          organizationId: currentUser.organizationId,
          status: { not: "ARCHIVED" },
        },
        select: { id: true, name: true, projectNumber: true },
        orderBy: { name: "asc" },
      })
    : [];

  return (
    <div className="p-6 sm:p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-[#1A2E22]">Reports</h1>
        <p className="mt-2 text-sm text-[#6B8C74]">Review profitability, utilization, and project health.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Link
          href="/reports/profitability"
          className="rounded-2xl border border-[#E2EBE4] bg-white p-6 hover:border-[#52B788] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(45,106,79,0.08)] transition-all"
        >
          <div className="w-10 h-10 rounded-lg bg-[#F0FAF4] border border-[#52B788]/20 flex items-center justify-center mb-4 text-[#2D6A4F]">
            <DollarSign className="w-5 h-5" strokeWidth={1.75} />
          </div>
          <h2 className="font-semibold text-[#1A2E22]">Project Profitability</h2>
          <p className="mt-2 text-sm text-[#6B8C74]">
            Fee, hours, burn rate, profit margin, and effective hourly rate across all projects.
          </p>
        </Link>

        <Link
          href="/reports/utilization"
          className="rounded-2xl border border-[#E2EBE4] bg-white p-6 hover:border-[#52B788] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(45,106,79,0.08)] transition-all"
        >
          <div className="w-10 h-10 rounded-lg bg-[#F0FAF4] border border-[#52B788]/20 flex items-center justify-center mb-4 text-[#2D6A4F]">
            <Users className="w-5 h-5" strokeWidth={1.75} />
          </div>
          <h2 className="font-semibold text-[#1A2E22]">Team Utilization</h2>
          <p className="mt-2 text-sm text-[#6B8C74]">
            Per-person hours, utilization rate, monthly revenue, and profit contribution.
          </p>
        </Link>

        <div className="rounded-2xl border border-[#E2EBE4] bg-white p-6 hover:border-[#52B788] transition-all">
          <div className="w-10 h-10 rounded-lg bg-[#F0FAF4] border border-[#52B788]/20 flex items-center justify-center mb-4 text-[#2D6A4F]">
            <BarChart3 className="w-5 h-5" strokeWidth={1.75} />
          </div>
          <h2 className="font-semibold text-[#1A2E22] mb-2">Project Detail</h2>
          <p className="text-sm text-[#6B8C74] mb-3">
            Phase-level burn rate and per-person time breakdown for a single project.
          </p>
          {projects.length > 0 ? (
            <div className="space-y-1.5">
              {projects.slice(0, 6).map((p) => (
                <Link
                  key={p.id}
                  href={`/reports/project/${p.id}`}
                  className="block text-sm text-[#2D6A4F] hover:text-[#40916C] hover:underline transition-colors truncate"
                >
                  {p.projectNumber ? `${p.projectNumber} — ` : ""}{p.name}
                </Link>
              ))}
              {projects.length > 6 && (
                <p className="text-xs text-[#A3BEA9]">+ {projects.length - 6} more projects</p>
              )}
            </div>
          ) : (
            <p className="text-xs text-[#A3BEA9] italic">No active projects.</p>
          )}
        </div>
      </div>
    </div>
  );
}
