import Link from "next/link";

export default function SettingsPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="mt-2 text-sm text-slate-500">Manage your organization, team, and project permissions.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        <Link href="/settings/team" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:border-emerald-200 transition">
          <h2 className="text-lg font-semibold text-slate-900">Team management</h2>
          <p className="mt-3 text-sm text-slate-500">Add supervisors, staff, and change user roles.</p>
        </Link>
      </div>
    </div>
  );
}
