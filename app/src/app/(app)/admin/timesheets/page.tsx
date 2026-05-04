import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getCurrentUser } from "@/lib/supabase/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Admin rollup of timesheet activity. Owners + admins use this to see
// who's overbooked, who's slacking, and which projects are eating the
// most labor — all without poking into individual timesheets one at
// a time.

function formatHours(n: number): string {
  return n.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

function formatMoney(n: number): string {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

// Working hours in a month — count Mon-Fri × 8. Loose proxy for
// "available work time" used as the denominator of utilization.
// Doesn't subtract holidays since firm-specific holiday calendars
// vary; over-counts by ~1-2% which is fine for a directional metric.
function workingHoursInMonth(year: number, monthIndex: number): number {
  const days = new Date(year, monthIndex + 1, 0).getDate();
  let workdays = 0;
  for (let d = 1; d <= days; d++) {
    const dow = new Date(year, monthIndex, d).getDay();
    if (dow !== 0 && dow !== 6) workdays++;
  }
  return workdays * 8;
}

export default async function AdminTimesheetsPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>;
}) {
  const params = await searchParams;
  const currentUser = await getCurrentUser();

  if (!currentUser) redirect("/login");
  if (currentUser.role !== "OWNER" && currentUser.role !== "ADMIN") redirect("/dashboard");

  // Period selection — `this` (default) or `last`. Custom-range arrives
  // in a follow-up; this gets the firm 90% of what they'd ask for.
  const today = new Date();
  const isLast = params.period === "last";
  const monthDate = isLast
    ? new Date(today.getFullYear(), today.getMonth() - 1, 1)
    : new Date(today.getFullYear(), today.getMonth(), 1);
  const monthStart = monthDate;
  const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
  const monthLabel = monthDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  // Pull all time entries in the period, plus the user + project for
  // grouping. Prisma findMany without a hard pagination limit is fine
  // here — at 10 staff × 22 days × ~5 entries/day ~= 1100 rows/month,
  // well within bounds.
  const [entries, users] = await Promise.all([
    prisma.timeEntry.findMany({
      where: {
        organizationId: currentUser.organizationId,
        date: { gte: monthStart, lte: monthEnd },
      },
      include: {
        user: { select: { id: true, fullName: true, billingRate: true, isActive: true } },
        project: { select: { id: true, name: true, projectNumber: true } },
      },
    }),
    prisma.user.findMany({
      where: { organizationId: currentUser.organizationId, isActive: true },
      select: { id: true, fullName: true, billingRate: true },
      orderBy: { fullName: "asc" },
    }),
  ]);

  // Per-staff totals
  type StaffRow = {
    userId: string;
    name: string;
    rate: number;
    hours: number;
    billableHours: number;
    leaveHours: number;
    overheadHours: number;
    revenue: number;
  };
  const staffByUserId = new Map<string, StaffRow>();
  // Seed with all active users so people who logged 0 still show.
  for (const u of users) {
    staffByUserId.set(u.id, {
      userId: u.id,
      name: u.fullName,
      rate: Number(u.billingRate ?? 0),
      hours: 0,
      billableHours: 0,
      leaveHours: 0,
      overheadHours: 0,
      revenue: 0,
    });
  }
  for (const e of entries) {
    const row = staffByUserId.get(e.userId);
    if (!row) continue;
    const hours = Number(e.hours);
    row.hours += hours;
    if (e.leaveType) {
      row.leaveHours += hours;
    } else if (e.overheadCategory) {
      row.overheadHours += hours;
    } else if (e.isBillable) {
      row.billableHours += hours;
      row.revenue += hours * Number(e.user.billingRate ?? 0);
    }
  }
  const staffRows = Array.from(staffByUserId.values()).sort(
    (a, b) => b.hours - a.hours || a.name.localeCompare(b.name)
  );

  // Per-project totals (billable only — non-billable would muddy the
  // "where's the labor going?" question)
  type ProjectRow = {
    projectId: string;
    name: string;
    projectNumber: string | null;
    hours: number;
    billableHours: number;
    revenue: number;
  };
  const projectByPid = new Map<string, ProjectRow>();
  for (const e of entries) {
    if (!e.project) continue;
    const existing = projectByPid.get(e.project.id);
    const hours = Number(e.hours);
    const isBillable = e.isBillable && !e.leaveType && !e.overheadCategory;
    const revenue = isBillable ? hours * Number(e.user.billingRate ?? 0) : 0;
    if (existing) {
      existing.hours += hours;
      existing.billableHours += isBillable ? hours : 0;
      existing.revenue += revenue;
    } else {
      projectByPid.set(e.project.id, {
        projectId: e.project.id,
        name: e.project.name,
        projectNumber: e.project.projectNumber,
        hours,
        billableHours: isBillable ? hours : 0,
        revenue,
      });
    }
  }
  const projectRows = Array.from(projectByPid.values()).sort(
    (a, b) => b.billableHours - a.billableHours || a.name.localeCompare(b.name)
  );

  // Top-level totals + utilization
  const totalHours = staffRows.reduce((s, r) => s + r.hours, 0);
  const totalBillable = staffRows.reduce((s, r) => s + r.billableHours, 0);
  const totalRevenue = staffRows.reduce((s, r) => s + r.revenue, 0);
  const workCapacity = workingHoursInMonth(monthDate.getFullYear(), monthDate.getMonth()) * users.length;
  const utilization = workCapacity > 0 ? (totalBillable / workCapacity) * 100 : 0;

  return (
    <div className="p-6 lg:p-10 max-w-7xl">
      <Link
        href="/admin"
        className="inline-flex items-center gap-1.5 text-sm text-[#6B8C74] hover:text-[#2D6A4F] mb-6 transition-colors"
      >
        <ArrowLeft size={14} /> Admin
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl text-[#1A2E22]">Timesheet Rollup</h1>
          <p className="mt-1 text-sm text-[#6B8C74]">
            Where labor went this period — by staff and by project.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/timesheets"
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
              !isLast
                ? "bg-[#2D6A4F] text-white"
                : "bg-white border border-[#E2EBE4] text-[#3D5C48] hover:border-[#52B788]"
            }`}
          >
            This month
          </Link>
          <Link
            href="/admin/timesheets?period=last"
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
              isLast
                ? "bg-[#2D6A4F] text-white"
                : "bg-white border border-[#E2EBE4] text-[#3D5C48] hover:border-[#52B788]"
            }`}
          >
            Last month
          </Link>
        </div>
      </div>

      <p className="mb-6 text-sm text-[#6B8C74]">
        Showing data for <strong className="text-[#1A2E22]">{monthLabel}</strong>.
      </p>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="rounded-2xl border border-[#E2EBE4] bg-white p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6B8C74] mb-2">
            Total Hours
          </div>
          <div className="text-2xl font-semibold text-[#1A2E22]">{formatHours(totalHours)}</div>
        </div>
        <div className="rounded-2xl border border-[#E2EBE4] bg-white p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6B8C74] mb-2">
            Billable
          </div>
          <div className="text-2xl font-semibold text-[#2D6A4F]">{formatHours(totalBillable)}</div>
        </div>
        <div className="rounded-2xl border border-[#E2EBE4] bg-white p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6B8C74] mb-2">
            Utilization
          </div>
          <div
            className={`text-2xl font-semibold ${
              utilization >= 75 ? "text-[#2D6A4F]" : utilization >= 60 ? "text-amber-600" : "text-rose-600"
            }`}
          >
            {utilization.toFixed(0)}%
          </div>
        </div>
        <div className="rounded-2xl border border-[#E2EBE4] bg-white p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6B8C74] mb-2">
            Billable Revenue
          </div>
          <div className="text-2xl font-semibold text-[#1A2E22]">{formatMoney(totalRevenue)}</div>
        </div>
      </div>

      {/* Per Staff */}
      <div className="rounded-2xl border border-[#E2EBE4] bg-white shadow-sm overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-[#E2EBE4]">
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#6B8C74]">
            Per Staff
          </h2>
        </div>
        {staffRows.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-[#6B8C74]">
            No active team members.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#F7F9F7] text-xs uppercase tracking-wider text-[#6B8C74]">
                <tr>
                  <th className="text-left px-6 py-3 font-medium">Name</th>
                  <th className="text-right px-4 py-3 font-medium">Hours</th>
                  <th className="text-right px-4 py-3 font-medium">Billable</th>
                  <th className="text-right px-4 py-3 font-medium">Leave</th>
                  <th className="text-right px-4 py-3 font-medium">Overhead</th>
                  <th className="text-right px-4 py-3 font-medium">Util %</th>
                  <th className="text-right px-6 py-3 font-medium">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {staffRows.map((r) => {
                  const cap = workingHoursInMonth(monthDate.getFullYear(), monthDate.getMonth());
                  const util = cap > 0 ? (r.billableHours / cap) * 100 : 0;
                  return (
                    <tr key={r.userId} className="border-t border-[#F0F2F0]">
                      <td className="px-6 py-3 text-[#1A2E22] font-medium">{r.name}</td>
                      <td className="px-4 py-3 text-right text-[#1A2E22]">{formatHours(r.hours)}</td>
                      <td className="px-4 py-3 text-right text-[#2D6A4F] font-medium">
                        {formatHours(r.billableHours)}
                      </td>
                      <td className="px-4 py-3 text-right text-[#6B8C74]">
                        {r.leaveHours > 0 ? formatHours(r.leaveHours) : "—"}
                      </td>
                      <td className="px-4 py-3 text-right text-[#6B8C74]">
                        {r.overheadHours > 0 ? formatHours(r.overheadHours) : "—"}
                      </td>
                      <td
                        className={`px-4 py-3 text-right font-medium ${
                          util >= 75 ? "text-[#2D6A4F]" : util >= 60 ? "text-amber-600" : "text-rose-600"
                        }`}
                      >
                        {util.toFixed(0)}%
                      </td>
                      <td className="px-6 py-3 text-right text-[#1A2E22]">
                        {formatMoney(r.revenue)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Per Project */}
      <div className="rounded-2xl border border-[#E2EBE4] bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E2EBE4]">
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#6B8C74]">
            Per Project
          </h2>
        </div>
        {projectRows.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-[#6B8C74]">
            No project labor logged this period.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#F7F9F7] text-xs uppercase tracking-wider text-[#6B8C74]">
                <tr>
                  <th className="text-left px-6 py-3 font-medium">Project</th>
                  <th className="text-right px-4 py-3 font-medium">Hours</th>
                  <th className="text-right px-4 py-3 font-medium">Billable</th>
                  <th className="text-right px-6 py-3 font-medium">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {projectRows.map((r) => (
                  <tr key={r.projectId} className="border-t border-[#F0F2F0]">
                    <td className="px-6 py-3">
                      <Link
                        href={`/projects/${r.projectId}`}
                        className="text-[#1A2E22] font-medium hover:text-[#2D6A4F] transition-colors"
                      >
                        {r.name}
                      </Link>
                      {r.projectNumber && (
                        <div className="text-xs text-[#6B8C74] font-mono">{r.projectNumber}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right text-[#1A2E22]">{formatHours(r.hours)}</td>
                    <td className="px-4 py-3 text-right text-[#2D6A4F] font-medium">
                      {formatHours(r.billableHours)}
                    </td>
                    <td className="px-6 py-3 text-right text-[#1A2E22]">{formatMoney(r.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
