import Link from "next/link";
import { CreditCard, Hash, Settings2, Users } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="p-6 sm:p-8">
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
          <p className="mt-2 text-sm text-[#6B8C74]">Add staff, set roles, billing rates, and salary.</p>
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

        <Link
          href="/settings/project-numbering"
          className="rounded-2xl border border-[#E2EBE4] bg-white p-6 hover:border-[#52B788] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(45,106,79,0.08)] transition-all"
        >
          <div className="w-10 h-10 rounded-lg bg-[#F0FAF4] border border-[#52B788]/20 flex items-center justify-center mb-4 text-[#2D6A4F]">
            <Hash className="w-5 h-5" strokeWidth={1.75} />
          </div>
          <h2 className="font-semibold text-[#1A2E22]">Project numbering</h2>
          <p className="mt-2 text-sm text-[#6B8C74]">Configure auto-numbering prefix, starting number, and toggle.</p>
        </Link>

        <Link
          href="/settings/invoice-numbering"
          className="rounded-2xl border border-[#E2EBE4] bg-white p-6 hover:border-[#52B788] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(45,106,79,0.08)] transition-all"
        >
          <div className="w-10 h-10 rounded-lg bg-[#F0FAF4] border border-[#52B788]/20 flex items-center justify-center mb-4 text-[#2D6A4F]">
            <Hash className="w-5 h-5" strokeWidth={1.75} />
          </div>
          <h2 className="font-semibold text-[#1A2E22]">Invoice numbering</h2>
          <p className="mt-2 text-sm text-[#6B8C74]">Format template with year/counter tokens (e.g. <span className="font-mono">INV-26-0001</span>).</p>
        </Link>

        <Link
          href="/settings/project-types"
          className="rounded-2xl border border-[#E2EBE4] bg-white p-6 hover:border-[#52B788] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(45,106,79,0.08)] transition-all"
        >
          <div className="w-10 h-10 rounded-lg bg-[#F0FAF4] border border-[#52B788]/20 flex items-center justify-center mb-4 text-[#2D6A4F]">
            <Hash className="w-5 h-5" strokeWidth={1.75} />
          </div>
          <h2 className="font-semibold text-[#1A2E22]">Project types</h2>
          <p className="mt-2 text-sm text-[#6B8C74]">Customize the project type taxonomy your firm uses (Residential, Park, Streetscape, etc.).</p>
        </Link>

        <Link
          href="/settings"
          className="rounded-2xl border border-[#E2EBE4] bg-white p-6 hover:border-[#52B788] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(45,106,79,0.08)] transition-all opacity-50 pointer-events-none"
        >
          <div className="w-10 h-10 rounded-lg bg-[#F0FAF4] border border-[#52B788]/20 flex items-center justify-center mb-4 text-[#2D6A4F]">
            <Settings2 className="w-5 h-5" strokeWidth={1.75} />
          </div>
          <h2 className="font-semibold text-[#1A2E22]">Organization</h2>
          <p className="mt-2 text-sm text-[#6B8C74]">Firm name, logo, and general settings. Coming soon.</p>
        </Link>
      </div>
    </div>
  );
}
