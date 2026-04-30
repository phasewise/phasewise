"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Calculator, Droplets, FileText, FileUp, Paperclip, Pencil, Plus, ShieldCheck, X } from "lucide-react";

type MweloSummary = {
  mawa: number;
  etwu: number;
  passes: boolean;
};

type ComplianceItem = {
  id: string;
  category: string;
  name: string;
  description: string | null;
  status: string;
  dueDate: string | null;
  // Signed URL (1-hour TTL) for clickable preview. Regenerated each render.
  documentUrl: string | null;
  // Storage path. The API persists this; the page server signs it for display.
  documentPath: string | null;
  notes: string | null;
  projectId: string;
  projectName: string;
  // Pre-extracted MAWA/ETWU/passes for MWELO rows. Null for everything else
  // and for MWELO items that pre-date the render-back feature (no JSON).
  mweloSummary: MweloSummary | null;
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

  const [editingItem, setEditingItem] = useState<ComplianceItem | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [formProjectId, setFormProjectId] = useState("");
  const [formCategory, setFormCategory] = useState("PERMIT");
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formDueDate, setFormDueDate] = useState("");
  const [formNotes, setFormNotes] = useState("");
  const [formDocUrl, setFormDocUrl] = useState("");
  const [formDocPath, setFormDocPath] = useState("");

  function openEdit(item: ComplianceItem) {
    setEditingItem(item);
    setFormProjectId(item.projectId);
    setFormCategory(item.category);
    setFormName(item.name);
    setFormDescription(item.description ?? "");
    setFormDueDate(item.dueDate ? item.dueDate.split("T")[0] : "");
    setFormNotes(item.notes ?? "");
    setFormDocUrl(item.documentUrl ?? "");
    setFormDocPath(item.documentPath ?? "");
    setError(null);
  }

  function closeEdit() {
    setEditingItem(null);
    setFormName("");
    setFormDescription("");
    setFormDueDate("");
    setFormNotes("");
    setFormDocUrl("");
    setFormDocPath("");
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>, complianceId?: string) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    if (complianceId) formData.append("complianceId", complianceId);

    try {
      const res = await fetch("/api/compliance/upload", { method: "POST", body: formData });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "Upload failed");
      }
      const { url, path } = await res.json();
      setFormDocUrl(url);
      setFormDocPath(path);

      // If editing, persist the storage path to the item. The API field
      // is named documentUrl for legacy compat but now holds a path.
      if (complianceId) {
        await fetch("/api/compliance", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: complianceId, documentUrl: path }),
        });
        setItems((prev) =>
          prev.map((i) =>
            i.id === complianceId ? { ...i, documentUrl: url, documentPath: path } : i
          )
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editingItem) return;
    setError(null);
    setSaving(true);

    const res = await fetch("/api/compliance", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editingItem.id,
        category: formCategory,
        name: formName,
        description: formDescription || null,
        dueDate: formDueDate || null,
        notes: formNotes || null,
        // The API stores the storage path as documentUrl (field name kept
        // for compat). null clears + deletes the file server-side.
        documentUrl: formDocPath || null,
      }),
    });

    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(data.error || "Failed to update.");
      return;
    }

    const updated = data.item;
    setItems((prev) =>
      prev.map((i) =>
        i.id === editingItem.id
          ? {
              ...i,
              category: updated.category,
              name: updated.name,
              description: updated.description,
              dueDate: updated.dueDate,
              // Server returns the storage path; preserve the signed URL
              // for display since the underlying file is unchanged.
              documentUrl: formDocUrl || null,
              documentPath: updated.documentUrl,
              notes: updated.notes,
              status: updated.status,
            }
          : i
      )
    );
    closeEdit();
  }

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
        // documentUrl carries the storage path, not a URL.
        documentUrl: formDocPath || undefined,
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
      // newItem.documentUrl is the storage path; the upload handler
      // already captured the signed URL into formDocUrl for preview.
      documentUrl: formDocUrl || null,
      documentPath: newItem.documentUrl,
      notes: newItem.notes,
      projectId: newItem.projectId,
      projectName: project?.name ?? "",
      // The inline create form doesn't capture a MWELO calc; calc-bearing
      // MWELO items are always created from the calculator page.
      mweloSummary: null,
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
              <label htmlFor="comp-project" className="text-sm text-[#3D5C48] block mb-1.5 font-medium">Project *</label>
              <select id="comp-project" value={formProjectId} onChange={(e) => setFormProjectId(e.target.value)} required className="w-full bg-white border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788]">
                <option value="">Select project</option>
                {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="comp-category" className="text-sm text-[#3D5C48] block mb-1.5 font-medium">Category *</label>
              <select id="comp-category" value={formCategory} onChange={(e) => setFormCategory(e.target.value)} className="w-full bg-white border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788]">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="comp-due-date" className="text-sm text-[#3D5C48] block mb-1.5 font-medium">Due date</label>
              <input id="comp-due-date" type="date" value={formDueDate} onChange={(e) => setFormDueDate(e.target.value)} className="w-full bg-white border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788]" />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="comp-name" className="text-sm text-[#3D5C48] block mb-1.5 font-medium">Name *</label>
            <input id="comp-name" value={formName} onChange={(e) => setFormName(e.target.value)} required placeholder="e.g., MWELO Water Budget Calculation" className="w-full bg-white border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788]" />
          </div>
          <div className="mb-4">
            <label htmlFor="comp-description" className="text-sm text-[#3D5C48] block mb-1.5 font-medium">Description</label>
            <input id="comp-description" value={formDescription} onChange={(e) => setFormDescription(e.target.value)} placeholder="Details about this requirement" className="w-full bg-white border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788]" />
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
                  <tr key={item.id} onClick={() => openEdit(item)} className="border-b border-[#E8EDE9] last:border-0 hover:bg-[#F7F9F7]/50 transition-colors cursor-pointer group">
                    <td className="px-4 sm:px-6 py-4">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[item.category] ?? ""}`}>
                        {item.category}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="min-w-0">
                          <div className="font-medium text-[#1A2E22] flex items-center gap-1.5">
                            {item.name}
                            {item.documentUrl && <Paperclip className="w-3 h-3 text-[#52B788]" />}
                          </div>
                          {item.mweloSummary ? (
                            <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-200/40 px-2 py-0.5 text-[10px] font-medium text-blue-700">
                                <Droplets className="w-2.5 h-2.5" />
                                MAWA {Math.round(item.mweloSummary.mawa).toLocaleString()}
                              </span>
                              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium border ${
                                item.mweloSummary.passes
                                  ? "bg-[#F0FAF4] border-[#52B788]/30 text-[#2D6A4F]"
                                  : "bg-rose-50 border-rose-200 text-rose-700"
                              }`}>
                                ETWU {Math.round(item.mweloSummary.etwu).toLocaleString()}
                              </span>
                              <span className={`text-[10px] font-semibold uppercase tracking-wide ${
                                item.mweloSummary.passes ? "text-[#2D6A4F]" : "text-rose-700"
                              }`}>
                                {item.mweloSummary.passes ? "Compliant" : "Exceeds MAWA"}
                              </span>
                              <Link
                                href={`/tools/mwelo-calculator?itemId=${item.id}`}
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center gap-1 text-[10px] font-medium text-[#2D6A4F] hover:text-[#40916C] hover:underline"
                              >
                                <Calculator className="w-2.5 h-2.5" />
                                View calc
                              </Link>
                              <a
                                href={`/api/compliance/${item.id}/mwelo-pdf`}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center gap-1 text-[10px] font-medium text-[#2D6A4F] hover:text-[#40916C] hover:underline"
                              >
                                <FileText className="w-2.5 h-2.5" />
                                PDF
                              </a>
                            </div>
                          ) : item.description ? (
                            <div className="text-xs text-[#A3BEA9] mt-0.5">{item.description}</div>
                          ) : null}
                        </div>
                        <Pencil className="w-3 h-3 text-[#A3BEA9] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                      </div>
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
                    <td className="px-4 sm:px-6 py-4" onClick={(e) => e.stopPropagation()}>
                      <select
                        id={`comp-row-status-${item.id}`}
                        aria-label="Compliance status"
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
      {/* Edit modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={closeEdit}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 pb-0">
              <h2 className="font-serif text-xl text-[#1A2E22]">Edit Compliance Item</h2>
              <button type="button" onClick={closeEdit} aria-label="Close edit modal" className="text-[#A3BEA9] hover:text-[#1A2E22] transition-colors"><X size={18} /></button>
            </div>
            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="comp-edit-category" className="text-sm text-[#3D5C48] block mb-1.5 font-medium">Category *</label>
                  <select id="comp-edit-category" value={formCategory} onChange={(e) => setFormCategory(e.target.value)} className="w-full bg-[#F7F9F7] border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788]">
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="comp-edit-due-date" className="text-sm text-[#3D5C48] block mb-1.5 font-medium">Due date</label>
                  <input id="comp-edit-due-date" type="date" value={formDueDate} onChange={(e) => setFormDueDate(e.target.value)} className="w-full bg-[#F7F9F7] border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788]" />
                </div>
              </div>
              <div>
                <label htmlFor="comp-edit-name" className="text-sm text-[#3D5C48] block mb-1.5 font-medium">Name *</label>
                <input id="comp-edit-name" value={formName} onChange={(e) => setFormName(e.target.value)} required className="w-full bg-[#F7F9F7] border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788]" />
              </div>
              <div>
                <label htmlFor="comp-edit-description" className="text-sm text-[#3D5C48] block mb-1.5 font-medium">Description</label>
                <textarea id="comp-edit-description" value={formDescription} onChange={(e) => setFormDescription(e.target.value)} rows={2} className="w-full bg-[#F7F9F7] border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788] resize-y" />
              </div>
              <div>
                <label htmlFor="comp-edit-notes" className="text-sm text-[#3D5C48] block mb-1.5 font-medium">Notes</label>
                <textarea id="comp-edit-notes" value={formNotes} onChange={(e) => setFormNotes(e.target.value)} rows={2} className="w-full bg-[#F7F9F7] border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788] resize-y" />
              </div>
              <div>
                <label className="text-sm text-[#3D5C48] block mb-1.5 font-medium">Document Attachment</label>
                {formDocUrl ? (
                  <div className="flex items-center gap-2 bg-[#F0FAF4] rounded-lg px-3.5 py-2.5 border border-[#52B788]/20">
                    <Paperclip className="w-4 h-4 text-[#2D6A4F] flex-shrink-0" />
                    <a href={formDocUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-[#2D6A4F] hover:underline truncate flex-1">
                      View attached document
                    </a>
                    <button type="button" onClick={() => { setFormDocUrl(""); setFormDocPath(""); }} aria-label="Remove attachment" className="text-[#A3BEA9] hover:text-rose-500 transition-colors">
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-[#E2EBE4] rounded-lg py-4 text-sm text-[#6B8C74] hover:border-[#52B788] hover:text-[#2D6A4F] transition-colors"
                  >
                    <FileUp className="w-4 h-4" />
                    {uploading ? "Uploading..." : "Upload PDF, Word, Excel, or image (max 10MB)"}
                  </button>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, editingItem?.id)}
                />
              </div>
              {error && <p className="text-[#B04030] text-sm">{error}</p>}
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium bg-[#2D6A4F] text-white hover:bg-[#40916C] transition-colors disabled:opacity-50">
                  {saving ? "Saving..." : "Save changes"}
                </button>
                <button type="button" onClick={closeEdit} className="px-4 py-2.5 rounded-lg text-sm text-[#6B8C74] hover:text-[#1A2E22]">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
