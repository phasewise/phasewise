import { redirect } from "next/navigation";
import Link from "next/link";
import {
  CreditCard,
  DollarSign,
  FileText,
  Hash,
  Shield,
  Users,
  FileBarChart,
  CalendarDays,
} from "lucide-react";
import { getCurrentUser } from "@/lib/supabase/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  if (currentUser.role !== "OWNER" && currentUser.role !== "ADMIN") {
    redirect("/dashboard");
  }

  // Fetch org-level stats for the admin overview
  const org = await prisma.organization.findUnique({
    where: { id: currentUser.organizationId },
    include: {
      _count: {
        select: {
          users: true,
          projects: true,
        },
      },
    },
  });

  const activeProjects = await prisma.project.count({
    where: { organizationId: currentUser.organizationId, status: "ACTIVE" },
  });

  const activeUsers = await prisma.user.count({
    where: { organizationId: currentUser.organizationId, isActive: true },
  });

  // Total hours logged this month
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const monthlyHours = await prisma.timeEntry.aggregate({
    where: {
      organizationId: currentUser.organizationId,
      date: { gte: monthStart },
    },
    _sum: { hours: true },
  });
  const totalMonthlyHours = Number(monthlyHours._sum.hours ?? 0);

  return (
    <div className="p-6 sm:p-8 max-w-5xl">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-[#2D6A4F] mb-2">
          <Shield className="w-5 h-5" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em]">Admin</span>
        </div>
        <h1 className="font-serif text-3xl text-[#1A2E22]">Business Operations</h1>
        <p className="mt-1 text-sm text-[#6B8C74]">
          Manage billing, staff, and organization settings. Only visible to owners and admins.
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="rounded-2xl border border-[#E2EBE4] bg-white p-4 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6B8C74] mb-1">Active Projects</div>
          <div className="text-2xl font-semibold text-[#1A2E22]">{activeProjects}</div>
        </div>
        <div className="rounded-2xl border border-[#E2EBE4] bg-white p-4 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6B8C74] mb-1">Team Members</div>
          <div className="text-2xl font-semibold text-[#1A2E22]">{activeUsers}</div>
        </div>
        <div className="rounded-2xl border border-[#E2EBE4] bg-white p-4 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6B8C74] mb-1">Hours This Month</div>
          <div className="text-2xl font-semibold text-[#1A2E22]">{totalMonthlyHours.toFixed(0)}h</div>
        </div>
        <div className="rounded-2xl border border-[#E2EBE4] bg-white p-4 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6B8C74] mb-1">Plan</div>
          <div className="text-2xl font-semibold text-[#2D6A4F]">{org?.plan ?? "Trial"}</div>
        </div>
      </div>

      {/* Admin sections */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Link
          href="/settings/billing"
          className="rounded-2xl border border-[#E2EBE4] bg-white p-6 hover:border-[#52B788] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(45,106,79,0.08)] transition-all"
        >
          <div className="w-10 h-10 rounded-lg bg-[#F0FAF4] border border-[#52B788]/20 flex items-center justify-center mb-4 text-[#2D6A4F]">
            <CreditCard className="w-5 h-5" strokeWidth={1.75} />
          </div>
          <h2 className="font-semibold text-[#1A2E22]">Billing & Subscription</h2>
          <p className="mt-2 text-sm text-[#6B8C74]">Manage your plan, payment method, and invoices.</p>
        </Link>

        <Link
          href="/settings/team"
          className="rounded-2xl border border-[#E2EBE4] bg-white p-6 hover:border-[#52B788] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(45,106,79,0.08)] transition-all"
        >
          <div className="w-10 h-10 rounded-lg bg-[#F0FAF4] border border-[#52B788]/20 flex items-center justify-center mb-4 text-[#2D6A4F]">
            <Users className="w-5 h-5" strokeWidth={1.75} />
          </div>
          <h2 className="font-semibold text-[#1A2E22]">Staff & Billing Rates</h2>
          <p className="mt-2 text-sm text-[#6B8C74]">Team management, salary, billing rates, and roles.</p>
        </Link>

        <Link
          href="/admin/billing"
          className="rounded-2xl border border-[#E2EBE4] bg-white p-6 hover:border-[#52B788] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(45,106,79,0.08)] transition-all"
        >
          <div className="w-10 h-10 rounded-lg bg-[#F0FAF4] border border-[#52B788]/20 flex items-center justify-center mb-4 text-[#2D6A4F]">
            <FileText className="w-5 h-5" strokeWidth={1.75} />
          </div>
          <h2 className="font-semibold text-[#1A2E22]">Project Billing</h2>
          <p className="mt-2 text-sm text-[#6B8C74]">Create invoices, track payments, and view outstanding balances.</p>
        </Link>

        <Link
          href="/reports/profitability"
          className="rounded-2xl border border-[#E2EBE4] bg-white p-6 hover:border-[#52B788] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(45,106,79,0.08)] transition-all"
        >
          <div className="w-10 h-10 rounded-lg bg-[#F0FAF4] border border-[#52B788]/20 flex items-center justify-center mb-4 text-[#2D6A4F]">
            <DollarSign className="w-5 h-5" strokeWidth={1.75} />
          </div>
          <h2 className="font-semibold text-[#1A2E22]">Profitability</h2>
          <p className="mt-2 text-sm text-[#6B8C74]">Project profitability, burn rates, and effective rates.</p>
        </Link>

        <Link
          href="/time/approve"
          className="rounded-2xl border border-[#E2EBE4] bg-white p-6 hover:border-[#52B788] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(45,106,79,0.08)] transition-all"
        >
          <div className="w-10 h-10 rounded-lg bg-[#F0FAF4] border border-[#52B788]/20 flex items-center justify-center mb-4 text-[#2D6A4F]">
            <FileBarChart className="w-5 h-5" strokeWidth={1.75} />
          </div>
          <h2 className="font-semibold text-[#1A2E22]">Timesheet Approval</h2>
          <p className="mt-2 text-sm text-[#6B8C74]">Review and approve submitted timesheets.</p>
        </Link>

        <Link
          href="/admin/leave"
          className="rounded-2xl border border-[#E2EBE4] bg-white p-6 hover:border-[#52B788] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(45,106,79,0.08)] transition-all"
        >
          <div className="w-10 h-10 rounded-lg bg-[#F0FAF4] border border-[#52B788]/20 flex items-center justify-center mb-4 text-[#2D6A4F]">
            <CalendarDays className="w-5 h-5" strokeWidth={1.75} />
          </div>
          <h2 className="font-semibold text-[#1A2E22]">Leave & PTO</h2>
          <p className="mt-2 text-sm text-[#6B8C74]">Set firm-wide leave policy, override per employee, and view balances.</p>
        </Link>

        <Link
          href="/settings/project-numbering"
          className="rounded-2xl border border-[#E2EBE4] bg-white p-6 hover:border-[#52B788] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(45,106,79,0.08)] transition-all"
        >
          <div className="w-10 h-10 rounded-lg bg-[#F0FAF4] border border-[#52B788]/20 flex items-center justify-center mb-4 text-[#2D6A4F]">
            <Hash className="w-5 h-5" strokeWidth={1.75} />
          </div>
          <h2 className="font-semibold text-[#1A2E22]">Project Numbering</h2>
          <p className="mt-2 text-sm text-[#6B8C74]">Configure auto-numbering prefix and sequence.</p>
        </Link>

        <Link
          href="/settings"
          className="rounded-2xl border border-[#E2EBE4] bg-white p-6 hover:border-[#52B788] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(45,106,79,0.08)] transition-all"
        >
          <div className="w-10 h-10 rounded-lg bg-[#F0FAF4] border border-[#52B788]/20 flex items-center justify-center mb-4 text-[#2D6A4F]">
            <Shield className="w-5 h-5" strokeWidth={1.75} />
          </div>
          <h2 className="font-semibold text-[#1A2E22]">Organization Settings</h2>
          <p className="mt-2 text-sm text-[#6B8C74]">General settings, billing, and team management.</p>
        </Link>
      </div>
    </div>
  );
}
