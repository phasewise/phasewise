import { getCurrentUser } from "@/lib/supabase/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const CATEGORY_COLORS: Record<string, string> = {
  MWELO: "bg-[#F0FAF4] text-[#2D6A4F] border-[#52B788]/30",
  LEED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  SITES: "bg-teal-50 text-teal-700 border-teal-200",
  ADA: "bg-blue-50 text-blue-700 border-blue-200",
  PERMIT: "bg-amber-50 text-amber-700 border-amber-200",
  OTHER: "bg-[#F7F9F7] text-[#6B8C74] border-[#E2EBE4]",
};

const STATUS_COLORS: Record<string, string> = {
  NOT_STARTED: "bg-[#F7F9F7] text-[#6B8C74] border-[#E2EBE4]",
  IN_PROGRESS: "bg-blue-50 text-blue-700 border-blue-200",
  COMPLETE: "bg-[#F0FAF4] text-[#2D6A4F] border-[#52B788]/30",
  N_A: "bg-gray-50 text-gray-400 border-gray-200",
};

const STATUS_LABELS: Record<string, string> = {
  NOT_STARTED: "Not Started",
  IN_PROGRESS: "In Progress",
  COMPLETE: "Complete",
  N_A: "N/A",
};

export default async function CompliancePage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return (
      <div className="p-6 sm:p-8">
        <div className="rounded-2xl border border-[#E2EBE4] bg-white p-8 text-[#1A2E22]">
          <h1 className="font-serif text-2xl">Compliance Tracker</h1>
          <p className="mt-3 text-sm text-[#6B8C74]">Please sign in to manage compliance items.</p>
        </div>
      </div>
    );
  }

  // Fetch compliance items
  const complianceItems = await prisma.complianceItem.findMany({
    where: { organizationId: currentUser.organizationId },
    include: {
      project: { select: { id: true, name: true } },
    },
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });

  // Fetch projects for filter
  const projects = await prisma.project.findMany({
    where: { organizationId: currentUser.organizationId, status: { not: "ARCHIVED" } },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  // Group by category
  const grouped = new Map<string, typeof complianceItems>();
  for (const item of complianceItems) {
    if (!grouped.has(item.category)) {
      grouped.set(item.category, []);
    }
    grouped.get(item.category)!.push(item);
  }

  // Summary stats
  const totalItems = complianceItems.length;
  const completeCount = complianceItems.filter((i) => i.status === "COMPLETE").length;
  const now = new Date();
  const overdueCount = complianceItems.filter((i) => {
    if (!i.dueDate) return false;
    if (i.status === "COMPLETE" || i.status === "N_A") return false;
    return i.dueDate < now;
  }).length;

  const formatDate = (date: Date | null) => {
    if (!date) return "—";
    return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(date);
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif text-3xl text-[#1A2E22]">Compliance Tracker</h1>
          <p className="mt-1 text-sm text-[#6B8C74]">
            {totalItems} item{totalItems !== 1 ? "s" : ""} · {completeCount} complete
            {overdueCount > 0 && (
              <> · <span className="text-rose-600">{overdueCount} overdue</span></>
            )}
          </p>
        </div>
        <button
          className="inline-flex items-center gap-2 rounded-xl bg-[#2D6A4F] px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-[#1A2E22] transition-colors cursor-not-allowed opacity-60"
          disabled
          title="Coming soon"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New Item
        </button>
      </div>

      {/* Empty state */}
      {complianceItems.length === 0 && (
        <div className="rounded-2xl border border-[#E2EBE4] bg-white p-12 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#F0FAF4]">
            <svg className="h-6 w-6 text-[#2D6A4F]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          </div>
          <h3 className="font-serif text-lg text-[#1A2E22]">No compliance items yet</h3>
          <p className="mt-1 text-sm text-[#6B8C74]">
            Track MWELO, LEED, SITES, ADA, and permit compliance across your projects.
          </p>
        </div>
      )}

      {/* Compliance tables grouped by category */}
      {Array.from(grouped.entries()).map(([category, items]) => {
        const categoryClass = CATEGORY_COLORS[category] ?? CATEGORY_COLORS.OTHER;

        return (
          <div key={category} className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <span className={`inline-block rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider ${categoryClass}`}>
                {category}
              </span>
              <span className="text-sm text-[#A3BEA9]">{items.length} item{items.length !== 1 ? "s" : ""}</span>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-[#E2EBE4] bg-white">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#E2EBE4] bg-[#F7F9F7] text-left text-xs font-medium uppercase tracking-wider text-[#6B8C74]">
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Project</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Due Date</th>
                    <th className="px-4 py-3">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2EBE4]">
                  {items.map((item) => {
                    const statusClass = STATUS_COLORS[item.status] ?? STATUS_COLORS.NOT_STARTED;
                    const isOverdue =
                      item.dueDate &&
                      item.dueDate < now &&
                      item.status !== "COMPLETE" &&
                      item.status !== "N_A";

                    return (
                      <tr key={item.id} className="hover:bg-[#F7F9F7]/50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="font-medium text-[#1A2E22]">{item.name}</div>
                          {item.description && (
                            <div className="mt-0.5 text-xs text-[#6B8C74] line-clamp-1">{item.description}</div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-[#6B8C74]">{item.project.name}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusClass}`}>
                            {STATUS_LABELS[item.status] ?? item.status}
                          </span>
                        </td>
                        <td className={`px-4 py-3 text-sm ${isOverdue ? "text-rose-600 font-medium" : "text-[#6B8C74]"}`}>
                          {formatDate(item.dueDate)}
                          {isOverdue && <span className="ml-1 text-xs">(overdue)</span>}
                        </td>
                        <td className="px-4 py-3 text-[#6B8C74] text-xs max-w-[200px] truncate">
                          {item.notes ?? "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
}
