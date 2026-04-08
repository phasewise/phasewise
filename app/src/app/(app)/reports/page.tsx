import Link from "next/link";

export default function ReportsPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Reports</h1>
        <p className="mt-2 text-sm text-slate-500">Review profitability, utilization, and project health.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        <Link href="/reports/profitability" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:border-emerald-200 transition">
          <div className="text-sm font-semibold text-slate-900">Project profitability</div>
          <p className="mt-3 text-sm text-slate-500">See fee, hours, burn rate, and effective hourly rate across every project.</p>
        </Link>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm opacity-70">
          <div className="text-sm font-semibold text-slate-900">Team utilization</div>
          <p className="mt-3 text-sm text-slate-500">Coming soon: per-person hours and utilization metrics.</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm opacity-70">
          <div className="text-sm font-semibold text-slate-900">Project detail</div>
          <p className="mt-3 text-sm text-slate-500">Coming soon: phase-level burn and team time breakdown.</p>
        </div>
      </div>
    </div>
  );
}
