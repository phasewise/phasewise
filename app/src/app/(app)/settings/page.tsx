import Link from "next/link";
import { CreditCard, Users } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-[#1A2E22]">Settings</h1>
        <p className="mt-2 text-sm text-[#6B8C74]">Manage your organization, team, and billing.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 max-w-5xl">
        <Link
          href="/settings/team"
          className="rounded-2xl border border-[#E2EBE4] bg-white p-6 hover:border-[#52B788] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(45,106,79,0.08)] transition-all"
        >
          <div className="w-10 h-10 rounded-lg bg-[#F0FAF4] border border-[#52B788]/20 flex items-center justify-center mb-4 text-[#2D6A4F]">
            <Users className="w-5 h-5" strokeWidth={1.75} />
          </div>
          <h2 className="font-semibold text-[#1A2E22]">Team management</h2>
          <p className="mt-2 text-sm text-[#6B8C74]">Add supervisors, staff, and change user roles.</p>
        </Link>

        <Link
          href="/settings/billing"
          className="rounded-2xl border border-[#E2EBE4] bg-white p-6 hover:border-[#52B788] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(45,106,79,0.08)] transition-all"
        >
          <div className="w-10 h-10 rounded-lg bg-[#F0FAF4] border border-[#52B788]/20 flex items-center justify-center mb-4 text-[#2D6A4F]">
            <CreditCard className="w-5 h-5" strokeWidth={1.75} />
          </div>
          <h2 className="font-semibold text-[#1A2E22]">Billing & subscription</h2>
          <p className="mt-2 text-sm text-[#6B8C74]">Manage your plan, payment method, and invoices.</p>
        </Link>
      </div>
    </div>
  );
}
