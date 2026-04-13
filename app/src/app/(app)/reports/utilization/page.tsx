import Link from "next/link";
import { getCurrentUser } from "@/lib/supabase/auth";
import { prisma } from "@/lib/prisma";

export default async function UtilizationReportPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return (
      <div className="p-6 sm:p-8">
        <div className="rounded-2xl border border-[#E2EBE4] bg-white p-8 text-[#1A2E22]">
          <h1 className="font-serif text-2xl">Team Utilization</h1>
          <p className="mt-3 text-sm text-[#6B8C74]">Please sign in to view reports.</p>
        </div>
      </div>
    );
  }

  // Target hours: 40hrs/week × 4.33 weeks/month = ~173 hours/month
  const TARGET_MONTHLY_HOURS = 173;
  const TARGET_UTILIZATION = 85; // 85% target

  // Get all active team members with their billing rates
  const teamMembers = await prisma.user.findMany({
    where: { organizationId: currentUser.organizationId, isActive: true },
    select: {
      id: true,
      fullName: true,
      role: true,
      billingRate: true,
      salary: true,
    },
    orderBy: { fullName: "asc" },
  });

  // Get hours logged per person this month
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const monthlyHours = await prisma.timeEntry.groupBy({
    by: ["userId"],
    where: {
      organizationId: currentUser.organizationId,
      date: { gte: monthStart },
    },
    _sum: { hours: true },
  });
  const hoursByUser = new Map(
    monthlyHours.map((e) => [e.userId, Number(e._sum.hours ?? 0)])
  );

  // Get total hours logged per person (all time)
  const totalHours = await prisma.timeEntry.groupBy({
    by: ["userId"],
    where: { organizationId: currentUser.organizationId },
    _sum: { hours: true },
  });
  const totalHoursByUser = new Map(
    totalHours.map((e) => [e.userId, Number(e._sum.hours ?? 0)])
  );

  const rows = teamMembers.map((member) => {
    const monthHours = hoursByUser.get(member.id) ?? 0;
    const allTimeHours = totalHoursByUser.get(member.id) ?? 0;
    const billingRate = Number(member.billingRate ?? 0);
    const utilization = TARGET_MONTHLY_HOURS > 0
      ? (monthHours / TARGET_MONTHLY_HOURS) * 100
      : 0;
    const monthlyRevenue = monthHours * billingRate;
    const monthlyCost = member.salary ? (Number(member.salary) / 12) : 0;
    const monthlyProfit = monthlyRevenue - monthlyCost;

    return {
      id: member.id,
      fullName: member.fullName,
      role: member.role,
      billingRate,
      monthHours,
      allTimeHours,
      utilization,
      monthlyRevenue,
      monthlyCost,
      monthlyProfit,
    };
  });

  const totalMonthlyRevenue = rows.reduce((s, r) => s + r.monthlyRevenue, 0);
  const totalMonthlyCost = rows.reduce((s, r) => s + r.monthlyCost, 0);
  const totalMonthlyProfit = totalMonthlyRevenue - totalMonthlyCost;
  const avgUtilization = rows.length > 0
    ? rows.reduce((s, r) => s + r.utilization, 0) / rows.length
    : 0;

  function utilizationColor(pct: number) {
    if (pct >= TARGET_UTILIZATION) return "text-[#2D6A4F]";
    if (pct >= 60) return "text-amber-600";
    return "text-rose-600";
  }

  return (
    <div className="p-6 sm:p-8 max-w-6xl">
      <div className="mb-8">
        <Link href="/reports" className="text-sm text-[#6B8C74] hover:text-[#1A2E22] transition-colors">
          ← Back to Reports
        </Link>
        <h1 className="font-serif text-3xl text-[#1A2E22] mt-3">Team Utilization</h1>
        <p className="mt-1 text-sm text-[#6B8C74]">
          Hours logged, utilization rate, and revenue per team member this month.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="rounded-2xl border border-[#E2EBE4] bg-white p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6B8C74] mb-2">Avg Utilization</div>
          <div className={`text-2xl font-semibold ${utilizationColor(avgUtilization)}`}>
            {avgUtilization.toFixed(0)}%
          </div>
          <div className="text-xs text-[#A3BEA9] mt-1">Target: {TARGET_UTILIZATION}%</div>
        </div>
        <div className="rounded-2xl border border-[#E2EBE4] bg-white p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6B8C74] mb-2">Monthly Revenue</div>
          <div className="text-2xl font-semibold text-[#1A2E22]">${totalMonthlyRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
        </div>
        <div className="rounded-2xl border border-[#E2EBE4] bg-white p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6B8C74] mb-2">Monthly Cost</div>
          <div className="text-2xl font-semibold text-[#6B8C74]">${totalMonthlyCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
        </div>
        <div className="rounded-2xl border border-[#E2EBE4] bg-white p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6B8C74] mb-2">Monthly Profit</div>
          <div className={`text-2xl font-semibold ${totalMonthlyProfit >= 0 ? "text-[#2D6A4F]" : "text-rose-600"}`}>
            ${totalMonthlyProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
        </div>
      </div>

      {/* Team table */}
      <div className="rounded-2xl border border-[#E2EBE4] bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-[#E2EBE4] bg-[#F7F9F7] text-[#6B8C74]">
              <tr>
                <th className="px-4 sm:px-6 py-4 font-medium">Team Member</th>
                <th className="px-4 sm:px-6 py-4 font-medium text-right">Rate</th>
                <th className="px-4 sm:px-6 py-4 font-medium text-right">Hours (month)</th>
                <th className="px-4 sm:px-6 py-4 font-medium text-right">Hours (all time)</th>
                <th className="px-4 sm:px-6 py-4 font-medium text-right">Utilization</th>
                <th className="px-4 sm:px-6 py-4 font-medium text-right">Revenue</th>
                <th className="px-4 sm:px-6 py-4 font-medium text-right">Profit</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-[#E8EDE9] last:border-0 hover:bg-[#F7F9F7]/50 transition-colors">
                  <td className="px-4 sm:px-6 py-4">
                    <div className="font-medium text-[#1A2E22]">{row.fullName}</div>
                    <div className="text-xs text-[#A3BEA9]">{row.role}</div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-right text-[#6B8C74]">
                    {row.billingRate > 0 ? `$${row.billingRate.toFixed(0)}/hr` : "—"}
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-right text-[#1A2E22] font-medium">
                    {row.monthHours.toFixed(1)}h
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-right text-[#6B8C74]">
                    {row.allTimeHours.toFixed(0)}h
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-right">
                    <span className={`font-semibold ${utilizationColor(row.utilization)}`}>
                      {row.utilization.toFixed(0)}%
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-right text-[#1A2E22]">
                    ${row.monthlyRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-right">
                    <span className={row.monthlyProfit >= 0 ? "text-[#2D6A4F]" : "text-rose-600"}>
                      ${row.monthlyProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-4 text-xs text-[#A3BEA9]">
        Utilization = hours logged ÷ {TARGET_MONTHLY_HOURS}h (standard month). Revenue = hours × billing rate. Profit = revenue − (annual salary ÷ 12). Target utilization: {TARGET_UTILIZATION}%.
      </p>
    </div>
  );
}
