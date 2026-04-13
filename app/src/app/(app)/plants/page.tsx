import { getCurrentUser } from "@/lib/supabase/auth";
import { prisma } from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";

export const dynamic = "force-dynamic";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  APPROVED: "bg-[#F0FAF4] text-[#2D6A4F] border-[#52B788]/30",
  REJECTED: "bg-rose-50 text-rose-700 border-rose-200",
};

const WATER_USE_COLORS: Record<string, string> = {
  LOW: "bg-[#F0FAF4] text-[#2D6A4F]",
  MODERATE: "bg-amber-50 text-amber-700",
  HIGH: "bg-rose-50 text-rose-700",
};

export default async function PlantsPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return (
      <div className="p-6 sm:p-8">
        <div className="rounded-2xl border border-[#E2EBE4] bg-white p-8 text-[#1A2E22]">
          <h1 className="font-serif text-2xl">Plant Schedule</h1>
          <p className="mt-3 text-sm text-[#6B8C74]">Please sign in to manage plant entries.</p>
        </div>
      </div>
    );
  }

  // Fetch plant entries
  const plantEntries = await prisma.plantEntry.findMany({
    where: { organizationId: currentUser.organizationId },
    include: {
      project: { select: { id: true, name: true } },
    },
    orderBy: [{ project: { name: "asc" } }, { botanicalName: "asc" }],
  });

  // Fetch projects for the filter dropdown
  const projects = await prisma.project.findMany({
    where: { organizationId: currentUser.organizationId, status: { not: "ARCHIVED" } },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  // Group by project
  const grouped = new Map<string, { projectName: string; entries: typeof plantEntries }>();
  for (const entry of plantEntries) {
    const key = entry.projectId;
    if (!grouped.has(key)) {
      grouped.set(key, { projectName: entry.project.name, entries: [] });
    }
    grouped.get(key)!.entries.push(entry);
  }

  // Summary stats
  const totalPlants = plantEntries.reduce((sum, e) => sum + e.quantity, 0);
  const totalCost = plantEntries.reduce((sum, e) => {
    if (!e.unitCost) return sum;
    return sum + Number(e.unitCost) * e.quantity;
  }, 0);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(val);

  return (
    <div className="p-6 sm:p-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif text-3xl text-[#1A2E22]">Plant Schedule</h1>
          <p className="mt-1 text-sm text-[#6B8C74]">
            {totalPlants} plant{totalPlants !== 1 ? "s" : ""} · {formatCurrency(totalCost)} estimated total
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
          New Plant
        </button>
      </div>

      {/* Empty state */}
      {plantEntries.length === 0 && (
        <div className="rounded-2xl border border-[#E2EBE4] bg-white p-12 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#F0FAF4]">
            <svg className="h-6 w-6 text-[#2D6A4F]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
          </div>
          <h3 className="font-serif text-lg text-[#1A2E22]">No plant entries yet</h3>
          <p className="mt-1 text-sm text-[#6B8C74]">
            Add plants to your project schedule to track species, quantities, and costs.
          </p>
        </div>
      )}

      {/* Plant tables grouped by project */}
      {Array.from(grouped.entries()).map(([projectId, { projectName, entries }]) => (
        <div key={projectId} className="mb-8">
          <h2 className="font-serif text-lg text-[#1A2E22] mb-3">{projectName}</h2>
          <div className="overflow-x-auto rounded-2xl border border-[#E2EBE4] bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E2EBE4] bg-[#F7F9F7] text-left text-xs font-medium uppercase tracking-wider text-[#6B8C74]">
                  <th className="px-4 py-3">Botanical Name</th>
                  <th className="px-4 py-3">Common Name</th>
                  <th className="px-4 py-3">Size</th>
                  <th className="px-4 py-3 text-right">Qty</th>
                  <th className="px-4 py-3">Spacing</th>
                  <th className="px-4 py-3">Water Use</th>
                  <th className="px-4 py-3 text-right">Unit Cost</th>
                  <th className="px-4 py-3 text-right">Total Cost</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2EBE4]">
                {entries.map((entry) => {
                  const unitCostNum = entry.unitCost ? Number(entry.unitCost) : null;
                  const totalCostNum = unitCostNum ? unitCostNum * entry.quantity : null;
                  const statusClass = STATUS_COLORS[entry.approvalStatus ?? ""] ?? "bg-[#F7F9F7] text-[#6B8C74] border-[#E2EBE4]";
                  const waterClass = WATER_USE_COLORS[entry.waterUse ?? ""] ?? "";

                  return (
                    <tr key={entry.id} className="hover:bg-[#F7F9F7]/50 transition-colors">
                      <td className="px-4 py-3 font-medium italic text-[#1A2E22]">{entry.botanicalName}</td>
                      <td className="px-4 py-3 text-[#1A2E22]">{entry.commonName}</td>
                      <td className="px-4 py-3 text-[#6B8C74]">{entry.size ?? "—"}</td>
                      <td className="px-4 py-3 text-right text-[#1A2E22]">{entry.quantity}</td>
                      <td className="px-4 py-3 text-[#6B8C74]">{entry.spacing ?? "—"}</td>
                      <td className="px-4 py-3">
                        {entry.waterUse ? (
                          <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${waterClass}`}>
                            {entry.waterUse}
                          </span>
                        ) : (
                          <span className="text-[#A3BEA9]">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right text-[#6B8C74]">
                        {unitCostNum !== null ? formatCurrency(unitCostNum) : "—"}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-[#1A2E22]">
                        {totalCostNum !== null ? formatCurrency(totalCostNum) : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusClass}`}>
                          {entry.approvalStatus ?? "—"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
