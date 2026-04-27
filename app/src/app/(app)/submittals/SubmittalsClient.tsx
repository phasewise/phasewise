"use client";

import { useState } from "react";
import { Pencil, Plus, Send, X } from "lucide-react";

type Submittal = {
  id: string;
  type: string;
  number: string;
  subject: string;
  description: string | null;
  status: string;
  ballInCourt: string | null;
  dueDate: string | null;
  projectId: string;
  projectName: string;
  createdBy: string;
  assignedTo: string | null;
  assignedToId: string | null;
  createdAt: string;
};

type Props = {
  submittals: Submittal[];
  projects: Array<{ id: string; name: string }>;
  teamMembers: Array<{ id: string; fullName: string }>;
  statusColors: Record<string, string>;
};

const STATUSES = [
  { value: "PENDING", label: "Pending" },
  { value: "UNDER_REVIEW", label: "Under Review" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
  { value: "RESUBMIT", label: "Resubmit" },
  { value: "CLOSED", label: "Closed" },
];

export default function SubmittalsClient({
  submittals: initialSubmittals,
  projects,
  teamMembers,
  statusColors,
}: Props) {
  const [submittals, setSubmittals] = useState(initialSubmittals);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [editingItem, setEditingItem] = useState<Submittal | null>(null);

  // Form state
  const [formType, setFormType] = useState<"SUBMITTAL" | "RFI">("SUBMITTAL");
  const [formProjectId, setFormProjectId] = useState("");
  const [formSubject, setFormSubject] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formBallInCourt, setFormBallInCourt] = useState("");
  const [formDueDate, setFormDueDate] = useState("");
  const [formAssignedTo, setFormAssignedTo] = useState("");

  function openEdit(item: Submittal) {
    setEditingItem(item);
    setFormSubject(item.subject);
    setFormDescription(item.description ?? "");
    setFormBallInCourt(item.ballInCourt ?? "");
    setFormDueDate(item.dueDate ? item.dueDate.split("T")[0] : "");
    setFormAssignedTo(item.assignedToId ?? "");
    setError(null);
  }

  function closeEdit() {
    setEditingItem(null);
    setFormSubject("");
    setFormDescription("");
    setFormBallInCourt("");
    setFormDueDate("");
    setFormAssignedTo("");
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editingItem) return;
    setError(null);
    setSaving(true);

    const res = await fetch("/api/submittals", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editingItem.id,
        subject: formSubject,
        description: formDescription || null,
        ballInCourt: formBallInCourt || null,
        dueDate: formDueDate || null,
        assignedToId: formAssignedTo || null,
      }),
    });

    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(data.error || "Failed to update.");
      return;
    }

    const updated = data.submittal;
    setSubmittals((prev) =>
      prev.map((s) =>
        s.id === editingItem.id
          ? {
              ...s,
              subject: updated.subject,
              description: updated.description,
              ballInCourt: updated.ballInCourt,
              dueDate: updated.dueDate,
              assignedToId: updated.assignedToId,
              assignedTo: updated.assignedTo?.fullName ?? null,
            }
          : s
      )
    );
    closeEdit();
  }

  async function createSubmittal(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const res = await fetch("/api/submittals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectId: formProjectId,
        type: formType,
        subject: formSubject,
        description: formDescription || undefined,
        ballInCourt: formBallInCourt || undefined,
        dueDate: formDueDate || undefined,
        assignedToId: formAssignedTo || undefined,
      }),
    });

    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(data.error || "Failed to create.");
      return;
    }

    setSubmittals((prev) => [
      {
        id: data.submittal.id,
        type: data.submittal.type,
        number: data.submittal.number,
        subject: data.submittal.subject,
        description: data.submittal.description,
        status: data.submittal.status,
        ballInCourt: data.submittal.ballInCourt,
        dueDate: data.submittal.dueDate,
        projectId: data.submittal.projectId,
        projectName: data.submittal.project.name,
        createdBy: data.submittal.createdBy.fullName,
        assignedTo: data.submittal.assignedTo?.fullName ?? null,
        assignedToId: data.submittal.assignedToId,
        createdAt: data.submittal.createdAt,
      },
      ...prev,
    ]);

    // Reset form
    setFormSubject("");
    setFormDescription("");
    setFormBallInCourt("");
    setFormDueDate("");
    setFormAssignedTo("");
    setShowForm(false);
  }

  async function updateStatus(id: string, newStatus: string) {
    setUpdatingId(id);
    const res = await fetch("/api/submittals", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: newStatus }),
    });

    if (res.ok) {
      setSubmittals((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
      );
    }
    setUpdatingId(null);
  }

  return (
    <div>
      {error && (
        <div className="mb-4 bg-rose-50 border border-rose-200 rounded-xl p-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      {/* Create button */}
      <div className="mb-6">
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-[#2D6A4F] text-white hover:bg-[#40916C] transition-colors"
        >
          <Plus className="w-4 h-4" />
          New submittal or RFI
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <form onSubmit={createSubmittal} className="mb-8 bg-[#F0FAF4] border border-[#52B788]/30 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4 text-[#2D6A4F]">
            <Send className="w-5 h-5" />
            <h3 className="text-sm font-semibold">Create new item</h3>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="sub-type" className="text-sm text-[#3D5C48] block mb-1.5 font-medium">Type</label>
              <select
                id="sub-type"
                value={formType}
                onChange={(e) => setFormType(e.target.value as "SUBMITTAL" | "RFI")}
                className="w-full bg-white border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788]"
              >
                <option value="SUBMITTAL">Submittal</option>
                <option value="RFI">RFI</option>
              </select>
            </div>
            <div>
              <label htmlFor="sub-project" className="text-sm text-[#3D5C48] block mb-1.5 font-medium">Project</label>
              <select
                id="sub-project"
                value={formProjectId}
                onChange={(e) => setFormProjectId(e.target.value)}
                required
                className="w-full bg-white border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788]"
              >
                <option value="">Select project</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="sub-subject" className="text-sm text-[#3D5C48] block mb-1.5 font-medium">Subject</label>
            <input
              id="sub-subject"
              value={formSubject}
              onChange={(e) => setFormSubject(e.target.value)}
              required
              className="w-full bg-white border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788]"
              placeholder="e.g., Planting plan revision per client feedback"
            />
          </div>
          <div className="grid sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label htmlFor="sub-ball-in-court" className="text-sm text-[#3D5C48] block mb-1.5 font-medium">Ball in court</label>
              <input
                id="sub-ball-in-court"
                value={formBallInCourt}
                onChange={(e) => setFormBallInCourt(e.target.value)}
                className="w-full bg-white border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788]"
                placeholder="e.g., Contractor"
              />
            </div>
            <div>
              <label htmlFor="sub-due-date" className="text-sm text-[#3D5C48] block mb-1.5 font-medium">Due date</label>
              <input
                id="sub-due-date"
                type="date"
                value={formDueDate}
                onChange={(e) => setFormDueDate(e.target.value)}
                className="w-full bg-white border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788]"
              />
            </div>
            <div>
              <label htmlFor="sub-assigned-to" className="text-sm text-[#3D5C48] block mb-1.5 font-medium">Assigned to</label>
              <select
                id="sub-assigned-to"
                value={formAssignedTo}
                onChange={(e) => setFormAssignedTo(e.target.value)}
                className="w-full bg-white border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788]"
              >
                <option value="">Unassigned</option>
                {teamMembers.map((m) => (
                  <option key={m.id} value={m.id}>{m.fullName}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-[#2D6A4F] text-white hover:bg-[#40916C] transition-colors disabled:opacity-50"
            >
              {saving ? "Creating..." : "Create"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 rounded-lg text-sm text-[#6B8C74] hover:text-[#1A2E22]"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Submittals table */}
      <div className="rounded-2xl border border-[#E2EBE4] bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-[#E2EBE4] bg-[#F7F9F7] text-[#6B8C74]">
              <tr>
                <th className="px-4 sm:px-6 py-3 font-medium">Number</th>
                <th className="px-4 sm:px-6 py-3 font-medium">Subject</th>
                <th className="px-4 sm:px-6 py-3 font-medium">Project</th>
                <th className="px-4 sm:px-6 py-3 font-medium">Ball in Court</th>
                <th className="px-4 sm:px-6 py-3 font-medium">Due</th>
                <th className="px-4 sm:px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {submittals.map((item) => {
                const isOverdue =
                  item.dueDate &&
                  !["APPROVED", "CLOSED", "REJECTED"].includes(item.status) &&
                  new Date(item.dueDate) < new Date();

                return (
                  <tr key={item.id} onClick={() => openEdit(item)} className="border-b border-[#E8EDE9] last:border-0 hover:bg-[#F7F9F7]/50 transition-colors cursor-pointer group">
                    <td className="px-4 sm:px-6 py-4">
                      <span className={`font-mono text-xs font-semibold px-2 py-1 rounded ${
                        item.type === "RFI" ? "bg-blue-50 text-blue-700" : "bg-[#F0FAF4] text-[#2D6A4F]"
                      }`}>
                        {item.number}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div>
                          <div className="font-medium text-[#1A2E22]">{item.subject}</div>
                          <div className="text-xs text-[#A3BEA9] mt-0.5">by {item.createdBy}</div>
                        </div>
                        <Pencil className="w-3 h-3 text-[#A3BEA9] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-[#6B8C74]">{item.projectName}</td>
                    <td className="px-4 sm:px-6 py-4 text-[#1A2E22] font-medium">{item.ballInCourt || "—"}</td>
                    <td className="px-4 sm:px-6 py-4">
                      {item.dueDate ? (
                        <span className={isOverdue ? "text-rose-600 font-semibold" : "text-[#6B8C74]"}>
                          {new Date(item.dueDate).toLocaleDateString()}
                          {isOverdue && " (overdue)"}
                        </span>
                      ) : (
                        <span className="text-[#A3BEA9]">—</span>
                      )}
                    </td>
                    <td className="px-4 sm:px-6 py-4" onClick={(e) => e.stopPropagation()}>
                      <select
                        id={`sub-row-status-${item.id}`}
                        aria-label="Submittal status"
                        value={item.status}
                        onChange={(e) => updateStatus(item.id, e.target.value)}
                        disabled={updatingId === item.id}
                        className={`text-xs font-semibold px-2 py-1 rounded-full border ${
                          statusColors[item.status] ?? "bg-[#F7F9F7] text-[#6B8C74] border-[#E2EBE4]"
                        } disabled:opacity-50`}
                      >
                        {STATUSES.map((s) => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                );
              })}
              {submittals.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-[#A3BEA9] text-sm">
                    No submittals or RFIs yet. Click &quot;New submittal or RFI&quot; to create one.
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
              <h2 className="font-serif text-xl text-[#1A2E22]">Edit {editingItem.type === "RFI" ? "RFI" : "Submittal"}</h2>
              <button type="button" onClick={closeEdit} aria-label="Close edit modal" className="text-[#A3BEA9] hover:text-[#1A2E22] transition-colors"><X size={18} /></button>
            </div>
            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div>
                <label htmlFor="sub-edit-subject" className="text-sm text-[#3D5C48] block mb-1.5 font-medium">Subject *</label>
                <input id="sub-edit-subject" value={formSubject} onChange={(e) => setFormSubject(e.target.value)} required className="w-full bg-[#F7F9F7] border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788]" />
              </div>
              <div>
                <label htmlFor="sub-edit-description" className="text-sm text-[#3D5C48] block mb-1.5 font-medium">Description</label>
                <textarea id="sub-edit-description" value={formDescription} onChange={(e) => setFormDescription(e.target.value)} rows={3} className="w-full bg-[#F7F9F7] border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788] resize-y" />
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="sub-edit-ball-in-court" className="text-sm text-[#3D5C48] block mb-1.5 font-medium">Ball in court</label>
                  <input id="sub-edit-ball-in-court" value={formBallInCourt} onChange={(e) => setFormBallInCourt(e.target.value)} className="w-full bg-[#F7F9F7] border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788]" />
                </div>
                <div>
                  <label htmlFor="sub-edit-due-date" className="text-sm text-[#3D5C48] block mb-1.5 font-medium">Due date</label>
                  <input id="sub-edit-due-date" type="date" value={formDueDate} onChange={(e) => setFormDueDate(e.target.value)} className="w-full bg-[#F7F9F7] border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788]" />
                </div>
                <div>
                  <label htmlFor="sub-edit-assigned-to" className="text-sm text-[#3D5C48] block mb-1.5 font-medium">Assigned to</label>
                  <select id="sub-edit-assigned-to" value={formAssignedTo} onChange={(e) => setFormAssignedTo(e.target.value)} className="w-full bg-[#F7F9F7] border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788]">
                    <option value="">Unassigned</option>
                    {teamMembers.map((m) => <option key={m.id} value={m.id}>{m.fullName}</option>)}
                  </select>
                </div>
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
