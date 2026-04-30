"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Archive,
  ArchiveRestore,
  Calculator,
  Droplets,
  FileText,
  Pencil,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";

type MweloSummary = {
  mawa: number;
  etwu: number;
  passes: boolean;
};

export type ProjectComplianceItem = {
  id: string;
  category: string;
  name: string;
  description: string | null;
  status: string;
  dueDate: string | null;
  notes: string | null;
  archivedAt: string | null;
  mweloSummary: MweloSummary | null;
};

type Props = {
  items: ProjectComplianceItem[];
  showArchived?: boolean;
};

const COMPLIANCE_CATEGORY_COLORS: Record<string, string> = {
  MWELO: "bg-blue-50 text-blue-700",
  LEED: "bg-[#F0FAF4] text-[#2D6A4F]",
  SITES: "bg-purple-50 text-purple-700",
  ADA: "bg-amber-50 text-amber-700",
  PERMIT: "bg-orange-50 text-orange-700",
  OTHER: "bg-[#F7F9F7] text-[#6B8C74]",
};

const COMPLIANCE_STATUS_LABELS: Record<string, string> = {
  NOT_STARTED: "Not started",
  IN_PROGRESS: "In progress",
  COMPLETE: "Complete",
  N_A: "N/A",
};

const STATUSES = [
  { value: "NOT_STARTED", label: "Not Started" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETE", label: "Complete" },
  { value: "N_A", label: "N/A" },
];

const CATEGORIES = ["MWELO", "LEED", "SITES", "ADA", "PERMIT", "OTHER"];

export default function ProjectComplianceClient({
  items: initialItems,
  showArchived = false,
}: Props) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [error, setError] = useState<string | null>(null);
  const [showArchivedLocal, setShowArchivedLocal] = useState(showArchived);

  // Inline edit modal — only used for non-MWELO items. MWELO items route
  // to the calculator instead, where they edit the calc directly.
  const [editingItem, setEditingItem] = useState<ProjectComplianceItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [formCategory, setFormCategory] = useState("PERMIT");
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formDueDate, setFormDueDate] = useState("");
  const [formStatus, setFormStatus] = useState("NOT_STARTED");
  const [formNotes, setFormNotes] = useState("");

  const visible = items.filter((i) => (showArchivedLocal ? true : !i.archivedAt));

  function openEdit(item: ProjectComplianceItem) {
    setEditingItem(item);
    setFormCategory(item.category);
    setFormName(item.name);
    setFormDescription(item.description ?? "");
    setFormDueDate(item.dueDate ? item.dueDate.split("T")[0] : "");
    setFormStatus(item.status);
    setFormNotes(item.notes ?? "");
    setError(null);
  }

  function closeEdit() {
    setEditingItem(null);
  }

  async function handleEditSave(e: React.FormEvent) {
    e.preventDefault();
    if (!editingItem) return;
    setSaving(true);
    setError(null);

    const res = await fetch("/api/compliance", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editingItem.id,
        category: formCategory,
        name: formName,
        description: formDescription || null,
        dueDate: formDueDate || null,
        status: formStatus,
        notes: formNotes || null,
      }),
    });
    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(data.error || "Failed to update item.");
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.id === editingItem.id
          ? {
              ...i,
              category: formCategory,
              name: formName,
              description: formDescription || null,
              dueDate: formDueDate ? new Date(formDueDate).toISOString() : null,
              status: formStatus,
              notes: formNotes || null,
            }
          : i
      )
    );
    closeEdit();
  }

  async function handleArchiveToggle(item: ProjectComplianceItem) {
    const archive = !item.archivedAt;
    const res = await fetch("/api/compliance", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: item.id, archive }),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to update archive state.");
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.id === item.id
          ? { ...i, archivedAt: archive ? new Date().toISOString() : null }
          : i
      )
    );
    // Keep server-rendered chips/data consistent on next nav.
    router.refresh();
  }

  async function handleDelete(item: ProjectComplianceItem) {
    if (
      !confirm(
        `Delete "${item.name}"? This permanently removes the compliance item${
          item.category === "MWELO" ? " and its MWELO calculation" : ""
        }.`
      )
    ) {
      return;
    }
    const res = await fetch(`/api/compliance?id=${item.id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to delete item.");
      return;
    }
    setItems((prev) => prev.filter((i) => i.id !== item.id));
    router.refresh();
  }

  const archivedCount = items.filter((i) => i.archivedAt).length;

  return (
    <div className="rounded-3xl border border-[#E2EBE4] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#2D6A4F]" />
          <h2 className="text-lg font-semibold text-[#1A2E22]">Compliance</h2>
        </div>
        <div className="flex items-center gap-3">
          {archivedCount > 0 && (
            <button
              type="button"
              onClick={() => setShowArchivedLocal((v) => !v)}
              className="text-xs font-medium text-[#6B8C74] hover:text-[#2D6A4F]"
            >
              {showArchivedLocal
                ? "Hide archived"
                : `Show archived (${archivedCount})`}
            </button>
          )}
          <Link
            href="/compliance"
            className="text-xs font-medium text-[#2D6A4F] hover:text-[#40916C] hover:underline"
          >
            Manage all →
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-3 rounded-lg bg-rose-50 border border-rose-200 p-2.5 text-xs text-rose-700">
          {error}
        </div>
      )}

      {visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#E2EBE4] bg-[#F7F9F7] p-6 text-center">
          <p className="text-sm text-[#6B8C74]">No compliance items tracked yet.</p>
          <div className="mt-3 flex items-center justify-center gap-3">
            <Link
              href="/compliance"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#F0FAF4] text-[#2D6A4F] border border-[#52B788]/30 hover:bg-[#52B788] hover:text-white transition-colors"
            >
              <ShieldCheck className="w-3 h-3" />
              Add item
            </Link>
            <Link
              href="/tools/mwelo-calculator"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200/40 hover:bg-blue-100 transition-colors"
            >
              <Droplets className="w-3 h-3" />
              MWELO Calculator
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {visible.map((item) => {
            const isOverdue =
              item.dueDate &&
              item.status !== "COMPLETE" &&
              item.status !== "N_A" &&
              new Date(item.dueDate) < new Date();
            return (
              <div
                key={item.id}
                className={`rounded-2xl border bg-[#F7F9F7] px-4 py-3 ${
                  item.archivedAt
                    ? "border-[#E8EDE9] opacity-60"
                    : "border-[#E8EDE9]"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          COMPLIANCE_CATEGORY_COLORS[item.category] ?? ""
                        }`}
                      >
                        {item.category}
                      </span>
                      <span className="text-sm font-medium text-[#1A2E22]">
                        {item.name}
                      </span>
                      <span className="text-[10px] uppercase tracking-wide text-[#6B8C74]">
                        {COMPLIANCE_STATUS_LABELS[item.status] ?? item.status}
                      </span>
                      {item.archivedAt && (
                        <span className="text-[10px] uppercase tracking-wide font-semibold text-[#A3BEA9]">
                          Archived
                        </span>
                      )}
                      {isOverdue && item.dueDate && !item.archivedAt && (
                        <span className="text-[10px] font-semibold text-rose-600">
                          Overdue · due{" "}
                          {new Date(item.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    {item.mweloSummary ? (
                      <div className="mt-1.5 flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-200/40 px-2 py-0.5 text-[10px] font-medium text-blue-700">
                          <Droplets className="w-2.5 h-2.5" />
                          MAWA{" "}
                          {Math.round(item.mweloSummary.mawa).toLocaleString()}
                        </span>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium border ${
                            item.mweloSummary.passes
                              ? "bg-[#F0FAF4] border-[#52B788]/30 text-[#2D6A4F]"
                              : "bg-rose-50 border-rose-200 text-rose-700"
                          }`}
                        >
                          ETWU{" "}
                          {Math.round(item.mweloSummary.etwu).toLocaleString()}
                        </span>
                        <span
                          className={`text-[10px] font-semibold uppercase tracking-wide ${
                            item.mweloSummary.passes
                              ? "text-[#2D6A4F]"
                              : "text-rose-700"
                          }`}
                        >
                          {item.mweloSummary.passes ? "Compliant" : "Exceeds MAWA"}
                        </span>
                      </div>
                    ) : item.description ? (
                      <p className="mt-1 text-xs text-[#6B8C74]">
                        {item.description}
                      </p>
                    ) : null}
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {item.mweloSummary ? (
                      <>
                        <Link
                          href={`/tools/mwelo-calculator?itemId=${item.id}`}
                          className="inline-flex items-center gap-1 text-[11px] font-medium text-[#2D6A4F] hover:text-[#40916C] hover:underline"
                        >
                          <Calculator className="w-3 h-3" />
                          View calc
                        </Link>
                        <a
                          href={`/api/compliance/${item.id}/mwelo-pdf`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-medium text-[#2D6A4F] hover:text-[#40916C] hover:underline"
                        >
                          <FileText className="w-3 h-3" />
                          PDF
                        </a>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => openEdit(item)}
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-[#2D6A4F] hover:text-[#40916C] hover:underline"
                      >
                        <Pencil className="w-3 h-3" />
                        Edit
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleArchiveToggle(item)}
                      aria-label={item.archivedAt ? "Restore item" : "Archive item"}
                      title={item.archivedAt ? "Restore" : "Archive"}
                      className="p-1 rounded-md text-[#6B8C74] hover:text-[#2D6A4F] hover:bg-[#F0FAF4] transition-colors"
                    >
                      {item.archivedAt ? (
                        <ArchiveRestore className="w-3 h-3" />
                      ) : (
                        <Archive className="w-3 h-3" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item)}
                      aria-label="Delete item"
                      title="Delete"
                      className="p-1 rounded-md text-[#A3BEA9] hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Inline edit modal — non-MWELO items only. MWELO clicks go to the
          calculator where the calc itself is the editor. */}
      {editingItem && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={closeEdit}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 pb-0">
              <h3 className="font-serif text-xl text-[#1A2E22]">
                Edit Compliance Item
              </h3>
              <button
                type="button"
                onClick={closeEdit}
                aria-label="Close edit modal"
                className="text-[#A3BEA9] hover:text-[#1A2E22] transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleEditSave} className="p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="proj-comp-edit-category"
                    className="text-sm text-[#3D5C48] block mb-1.5 font-medium"
                  >
                    Category *
                  </label>
                  <select
                    id="proj-comp-edit-category"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full bg-[#F7F9F7] border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788]"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="proj-comp-edit-due"
                    className="text-sm text-[#3D5C48] block mb-1.5 font-medium"
                  >
                    Due date
                  </label>
                  <input
                    id="proj-comp-edit-due"
                    type="date"
                    value={formDueDate}
                    onChange={(e) => setFormDueDate(e.target.value)}
                    className="w-full bg-[#F7F9F7] border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788]"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="proj-comp-edit-name"
                  className="text-sm text-[#3D5C48] block mb-1.5 font-medium"
                >
                  Name *
                </label>
                <input
                  id="proj-comp-edit-name"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  required
                  className="w-full bg-[#F7F9F7] border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788]"
                />
              </div>
              <div>
                <label
                  htmlFor="proj-comp-edit-status"
                  className="text-sm text-[#3D5C48] block mb-1.5 font-medium"
                >
                  Status
                </label>
                <select
                  id="proj-comp-edit-status"
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value)}
                  className="w-full bg-[#F7F9F7] border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788]"
                >
                  {STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="proj-comp-edit-description"
                  className="text-sm text-[#3D5C48] block mb-1.5 font-medium"
                >
                  Description
                </label>
                <textarea
                  id="proj-comp-edit-description"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  rows={2}
                  className="w-full bg-[#F7F9F7] border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788] resize-y"
                />
              </div>
              <div>
                <label
                  htmlFor="proj-comp-edit-notes"
                  className="text-sm text-[#3D5C48] block mb-1.5 font-medium"
                >
                  Notes
                </label>
                <textarea
                  id="proj-comp-edit-notes"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  rows={2}
                  className="w-full bg-[#F7F9F7] border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788] resize-y"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium bg-[#2D6A4F] text-white hover:bg-[#40916C] transition-colors disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save changes"}
                </button>
                <button
                  type="button"
                  onClick={closeEdit}
                  className="px-4 py-2.5 rounded-lg text-sm text-[#6B8C74] hover:text-[#1A2E22]"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
