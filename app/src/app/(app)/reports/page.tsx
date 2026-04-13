import Link from "next/link";
import { DollarSign, Users, BarChart3 } from "lucide-react";

export default function ReportsPage() {
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

        <div className="rounded-2xl border border-[#E2EBE4] bg-white p-6 opacity-50">
          <div className="w-10 h-10 rounded-lg bg-[#F0FAF4] border border-[#52B788]/20 flex items-center justify-center mb-4 text-[#2D6A4F]">
            <BarChart3 className="w-5 h-5" strokeWidth={1.75} />
          </div>
          <h2 className="font-semibold text-[#1A2E22]">Project Detail</h2>
          <p className="mt-2 text-sm text-[#6B8C74]">
            Coming soon: phase-level burn rate and per-person time breakdown for a single project.
          </p>
        </div>
      </div>
    </div>
  );
}
