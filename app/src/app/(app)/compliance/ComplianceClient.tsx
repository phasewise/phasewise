"use client";

import { useState } from "react";
import { Plus, ShieldCheck } from "lucide-react";

type ComplianceItem = {
  id: string;
  category: string;
  name: string;
  description: string | null;
  status: string;
  dueDate: string | null;
  documentUrl: string | null;
  notes: string | null;
  projectId: string;
  projectName: string;
};

type Props = {
  items: ComplianceItem[];
  projects: Array<{ id: string; name: string }>;
};

const CATEGORIES = ["MWELO", "LEED", "SITES", "ADA", "PERMIT", "OTHER"];

const CATEGORY_COLORS: Record<string, string> = {
  MWELO: "bg-blue-50 text-blue-700",
  LEED: "bg-[#F0FAF4] text-[#2D6A4F]",
  SITES: "bg-purple-50 text-purple-700",
  ADA: "bg-amber-50 text-amber-700",
  PERMIT: "bg-orange-50 text-orange-700",
  OTHER: "bg-[#F7F9F7] text-[#6B8C74]",
};

const STATUS_COLORS: Record<string, string> = {
  NOT_STARTED: "bg-[#F7F9F7] text-[#6B8C74] border-[#E2EBE4]",
  IN_PROGRESS: "bg-blue-50 text-blue-700 border-blue-200",
  COMPLETE: "bg-[#F0FAF4] text-[#2D6A4F] border-[#52B788]/30",
  N_A: "bg-[#F7F9F7] text-[#A3BEA9] border-[#E2EBE4]",
};

const STATUSES = [
  { value: "NOT_STARTED", label: "Not Started" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETE", label: "Complete" },
  { value: "N_A", label: "N/A" },
];

export default function ComplianceClient({ items: initialItems, projects }: Props) {
  const [items, setItems] = useState(initialItems);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formProjectId, setFormProjectId] = useState("");
  const [formCategory, setFormCategory] = useState("PERMIT");
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formDueDate, setFormDueDate] = useState("");
  const [formNotes, setFormNotes] = useState("");

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const res = await fetch("/api/compliance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectId: formProjectId,
        category: formCategory,
        name: formName,
        description: formDescription || undefined,
        dueDate: formDueDate || undefined,
        notes: formNotes || undefined,
      }),
    });

    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(data.error || "Failed to create item.");
      return;
    }

    const newItem = data.item;
    const project = projects.find((p) => p.id === formProjectId);
    setItems((prev) => [{
      id: newItem.id,
      category: newItem.category,
      name: newItem.name,
      description: newItem.description,
      status: newItem.status,
      dueDate: newItem.dueDate,
      documentUrl: newItem.documentUrl,
      notes: newItem.notes,
      projectId: newItem.projectId,
      projectName: project?.name ?? "",
    }, ...prev]);

    setFormName("");
    setFormDescription("");
    setFormDueDate("");
    setFormNotes("");
    setShowForm(false);
  }

  async function updateStatus(id: string, newStatus: string) {
    await fetch("/api/compliance", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: newStatus }),
    });
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
  }

  const completeCount = items.filter((i) => i.status === "COMPLETE").length;
  const overdueCount = items.filter((i) => {
    if (!i.dueDate || i.status === "COMPLETE" || i.status === "N_A") return false;
    return new Date(i.dueDate) < new Date();
  }).length;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif text-3xl text-[#1A2E22]">Compliance Tracker</h1>
          <p className="mt-1 text-sm text-[#6B8C74]">
            {items.length} items · {completeCount} complete
            {overdueCount > 0 && <> · <span className="text-rose-600">{overdueCount} overdue</span></>}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-[#2D6A4F] text-white hover:bg-[#40916C] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add item
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-rose-50 border border-rose-200 rounded-xl p-3 text-sm text-rose-700">{error}</div>
      )}

      {showForm && (
        <form onSubmit={handleCreate} className="mb-6 bg-[#F0FAF4] border border-[#52B788]/30 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4 text-[#2D6A4F]">
            <ShieldCheck className="w-5 h-5" />
            <h3 className="text-sm font-semibold">Add compliance item</h3>
          </div>
          <div className="grid sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="text-sm text-[#3D5C48] block mb-1.5 font-medium">Project *</label>
              <select value={formProjectId} onChange={(e) => setFormProjectId(e.target.value)} required className="w-full bg-white border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788]">
                <option value="">Select project</option>
                {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm text-[#3D5C48] block mb-1.5 font-medium">Category *</label>
              <select value={formCategory} onChange={(e) => setFormCategory(e.target.value)} className="w-full bg-white border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788]">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm text-[#3D5C48] block mb-1.5 font-medium">Due date</label>
              <input type="date" value={formDueDate} onChange={(e) => setFormDueDate(e.target.value)} className="w-full bg-white border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788]" />
            </div>
          </div>
          <div className="mb-4">
            <label className="text-sm text-[#3D5C48] block mb-1.5 font-medium">Name *</label>
            <input value={formName} onChange={(e) => setFormName(e.target.value)} required placeholder="e.g., MWELO Water Budget Calculation" className="w-full bg-white border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788]" />
          </div>
          <div className="mb-4">
            <label className="text-sm text-[#3D5C48] block mb-1.5 font-medium">Description</label>
            <input value={formDescription} onChange={(e) => setFormDescription(e.target.value)} placeholder="Details about this requirement" className="w-full bg-white border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788]" />
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-[#2D6A4F] text-white hover:bg-[#40916C] transition-colors disabled:opacity-50">
              {saving ? "Adding..." : "Add item"}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg text-sm text-[#6B8C74] hover:text-[#1A2E22]">Cancel</button>
          </div>
        </form>
      )}

      {/* Items table */}
      <div className="rounded-2xl border border-[#E2EBE4] bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-[#E2EBE4] bg-[#F7F9F7] text-[#6B8C74]">
              <tr>
                <th className="px-4 sm:px-6 py-3 font-medium">Category</th>
                <th className="px-4 sm:px-6 py-3 font-medium">Item</th>
                <th className="px-4 sm:px-6 py-3 font-medium">Project</th>
                <th className="px-4 sm:px-6 py-3 font-medium">Due</th>
                <th className="px-4 sm:px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const isOverdue = item.dueDate && item.status !== "COMPLETE" && item.status !== "N_A" && new Date(item.dueDate) < new Date();
                return (
                  <tr key={item.id} className="border-b border-[#E8EDE9] last:border-0 hover:bg-[#F7F9F7]/50 transition-colors">
                    <td className="px-4 sm:px-6 py-4">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[item.category] ?? ""}`}>
                        {item.category}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="font-medium text-[#1A2E22]">{item.name}</div>
                      {item.description && <div className="text-xs text-[#A3BEA9] mt-0.5">{item.description}</div>}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-[#6B8C74]">{item.projectName}</td>
                    <td className="px-4 sm:px-6 py-4">
                      {item.dueDate ? (
                        <span className={isOverdue ? "text-rose-600 font-semibold" : "text-[#6B8C74]"}>
                          {new Date(item.dueDate).toLocaleDateString()}
                          {isOverdue && " (overdue)"}
                        </span>
                      ) : "—"}
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <select
                        value={item.status}
                        onChange={(e) => updateStatus(item.id, e.target.value)}
                        className={`text-xs font-semibold px-2 py-1 rounded-full border ${STATUS_COLORS[item.status] ?? ""}`}
                      >
                        {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                      </select>
                    </td>
                  </tr>
                );
              })}
              {items.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-[#A3BEA9] text-sm">
                    No compliance items yet. Click &quot;Add item&quot; to start tracking requirements.
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
