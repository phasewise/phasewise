"use client";

import { useState } from "react";
import { Leaf, Plus } from "lucide-react";

type Plant = {
  id: string;
  botanicalName: string;
  commonName: string;
  size: string | null;
  quantity: number;
  spacing: string | null;
  waterUse: string | null;
  unitCost: number | null;
  notes: string | null;
  substitution: string | null;
  approvalStatus: string | null;
  projectId: string;
  projectName: string;
};

type Props = {
  plants: Plant[];
  projects: Array<{ id: string; name: string }>;
};

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

export default function PlantsClient({ plants: initialPlants, projects }: Props) {
  const [plants, setPlants] = useState(initialPlants);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [projectId, setProjectId] = useState("");
  const [botanicalName, setBotanicalName] = useState("");
  const [commonName, setCommonName] = useState("");
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [spacing, setSpacing] = useState("");
  const [waterUse, setWaterUse] = useState("");
  const [unitCost, setUnitCost] = useState("");
  const [notes, setNotes] = useState("");

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const res = await fetch("/api/plants", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectId,
        botanicalName,
        commonName,
        size: size || undefined,
        quantity: Number(quantity) || 1,
        spacing: spacing || undefined,
        waterUse: waterUse || undefined,
        unitCost: unitCost || undefined,
        notes: notes || undefined,
      }),
    });

    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(data.error || "Failed to create plant entry.");
      return;
    }

    // Add to list
    const newPlant = data.plant;
    const project = projects.find((p) => p.id === projectId);
    setPlants((prev) => [{
      id: newPlant.id,
      botanicalName: newPlant.botanicalName,
      commonName: newPlant.commonName,
      size: newPlant.size,
      quantity: newPlant.quantity,
      spacing: newPlant.spacing,
      waterUse: newPlant.waterUse,
      unitCost: newPlant.unitCost ? Number(newPlant.unitCost) : null,
      notes: newPlant.notes,
      substitution: newPlant.substitution,
      approvalStatus: newPlant.approvalStatus,
      projectId: newPlant.projectId,
      projectName: project?.name ?? "",
    }, ...prev]);

    // Reset form
    setBotanicalName("");
    setCommonName("");
    setSize("");
    setQuantity("1");
    setSpacing("");
    setWaterUse("");
    setUnitCost("");
    setNotes("");
    setShowForm(false);
  }

  async function updateStatus(id: string, newStatus: string) {
    await fetch("/api/plants", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, approvalStatus: newStatus }),
    });
    setPlants((prev) =>
      prev.map((p) => (p.id === id ? { ...p, approvalStatus: newStatus } : p))
    );
  }

  const totalCost = plants.reduce(
    (sum, p) => sum + (p.unitCost ?? 0) * p.quantity,
    0
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif text-3xl text-[#1A2E22]">Plant Schedule</h1>
          <p className="mt-1 text-sm text-[#6B8C74]">
            {plants.length} plants · Est. total: ${totalCost.toLocaleString()}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-[#2D6A4F] text-white hover:bg-[#40916C] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add plant
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-rose-50 border border-rose-200 rounded-xl p-3 text-sm text-rose-700">{error}</div>
      )}

      {/* Create form */}
      {showForm && (
        <form onSubmit={handleCreate} className="mb-6 bg-[#F0FAF4] border border-[#52B788]/30 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4 text-[#2D6A4F]">
            <Leaf className="w-5 h-5" />
            <h3 className="text-sm font-semibold">Add plant entry</h3>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm text-[#3D5C48] block mb-1.5 font-medium">Project *</label>
              <select value={projectId} onChange={(e) => setProjectId(e.target.value)} required className="w-full bg-white border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788]">
                <option value="">Select project</option>
                {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm text-[#3D5C48] block mb-1.5 font-medium">Botanical name *</label>
              <input value={botanicalName} onChange={(e) => setBotanicalName(e.target.value)} required placeholder="Quercus agrifolia" className="w-full bg-white border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-sm text-[#1A2E22] italic focus:outline-none focus:border-[#52B788]" />
            </div>
          </div>
          <div className="grid sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="text-sm text-[#3D5C48] block mb-1.5 font-medium">Common name *</label>
              <input value={commonName} onChange={(e) => setCommonName(e.target.value)} required placeholder="Coast Live Oak" className="w-full bg-white border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788]" />
            </div>
            <div>
              <label className="text-sm text-[#3D5C48] block mb-1.5 font-medium">Size</label>
              <input value={size} onChange={(e) => setSize(e.target.value)} placeholder='24" box' className="w-full bg-white border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788]" />
            </div>
            <div>
              <label className="text-sm text-[#3D5C48] block mb-1.5 font-medium">Quantity</label>
              <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="w-full bg-white border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788]" />
            </div>
          </div>
          <div className="grid sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="text-sm text-[#3D5C48] block mb-1.5 font-medium">Spacing</label>
              <input value={spacing} onChange={(e) => setSpacing(e.target.value)} placeholder="6' O.C." className="w-full bg-white border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788]" />
            </div>
            <div>
              <label className="text-sm text-[#3D5C48] block mb-1.5 font-medium">Water use</label>
              <select value={waterUse} onChange={(e) => setWaterUse(e.target.value)} className="w-full bg-white border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788]">
                <option value="">—</option>
                <option value="LOW">Low</option>
                <option value="MODERATE">Moderate</option>
                <option value="HIGH">High</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-[#3D5C48] block mb-1.5 font-medium">Unit cost ($)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A3BEA9] text-sm">$</span>
                <input type="number" step="0.01" min="0" value={unitCost} onChange={(e) => setUnitCost(e.target.value)} placeholder="0.00" className="w-full bg-white border border-[#E2EBE4] rounded-lg pl-7 pr-3.5 py-2.5 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788]" />
              </div>
            </div>
          </div>
          <div className="mb-4">
            <label className="text-sm text-[#3D5C48] block mb-1.5 font-medium">Notes</label>
            <input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={'e.g., Container grown, 2" caliper min.'} className="w-full bg-white border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788]" />
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-[#2D6A4F] text-white hover:bg-[#40916C] transition-colors disabled:opacity-50">
              {saving ? "Adding..." : "Add plant"}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg text-sm text-[#6B8C74] hover:text-[#1A2E22]">Cancel</button>
          </div>
        </form>
      )}

      {/* Plants table */}
      <div className="rounded-2xl border border-[#E2EBE4] bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-[#E2EBE4] bg-[#F7F9F7] text-[#6B8C74]">
              <tr>
                <th className="px-4 sm:px-6 py-3 font-medium">Plant</th>
                <th className="px-4 sm:px-6 py-3 font-medium">Project</th>
                <th className="px-4 sm:px-6 py-3 font-medium text-center">Size</th>
                <th className="px-4 sm:px-6 py-3 font-medium text-center">Qty</th>
                <th className="px-4 sm:px-6 py-3 font-medium text-center">Water</th>
                <th className="px-4 sm:px-6 py-3 font-medium text-right">Cost</th>
                <th className="px-4 sm:px-6 py-3 font-medium text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {plants.map((plant) => (
                <tr key={plant.id} className="border-b border-[#E8EDE9] last:border-0 hover:bg-[#F7F9F7]/50 transition-colors">
                  <td className="px-4 sm:px-6 py-4">
                    <div className="italic text-[#1A2E22] font-medium">{plant.botanicalName}</div>
                    <div className="text-xs text-[#6B8C74]">{plant.commonName}</div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-[#6B8C74]">{plant.projectName}</td>
                  <td className="px-4 sm:px-6 py-4 text-center text-[#1A2E22]">{plant.size || "—"}</td>
                  <td className="px-4 sm:px-6 py-4 text-center text-[#1A2E22] font-medium">{plant.quantity}</td>
                  <td className="px-4 sm:px-6 py-4 text-center">
                    {plant.waterUse ? (
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${WATER_USE_COLORS[plant.waterUse] ?? ""}`}>
                        {plant.waterUse}
                      </span>
                    ) : "—"}
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-right text-[#1A2E22]">
                    {plant.unitCost ? `$${(plant.unitCost * plant.quantity).toLocaleString()}` : "—"}
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-center">
                    <select
                      value={plant.approvalStatus ?? "PENDING"}
                      onChange={(e) => updateStatus(plant.id, e.target.value)}
                      className={`text-xs font-semibold px-2 py-1 rounded-full border ${STATUS_COLORS[plant.approvalStatus ?? "PENDING"] ?? ""}`}
                    >
                      <option value="PENDING">Pending</option>
                      <option value="APPROVED">Approved</option>
                      <option value="REJECTED">Rejected</option>
                    </select>
                  </td>
                </tr>
              ))}
              {plants.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-[#A3BEA9] text-sm">
                    No plant entries yet. Click &quot;Add plant&quot; to start building your plant schedule.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
