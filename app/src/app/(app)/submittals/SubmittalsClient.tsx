"use client";

import { useState } from "react";
import { Plus, Send } from "lucide-react";

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

  // Form state
  const [formType, setFormType] = useState<"SUBMITTAL" | "RFI">("SUBMITTAL");
  const [formProjectId, setFormProjectId] = useState("");
  const [formSubject, setFormSubject] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formBallInCourt, setFormBallInCourt] = useState("");
  const [formDueDate, setFormDueDate] = useState("");
  const [formAssignedTo, setFormAssignedTo] = useState("");

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
              <label className="text-sm text-[#3D5C48] block mb-1.5 font-medium">Type</label>
              <select
                value={formType}
                onChange={(e) => setFormType(e.target.value as "SUBMITTAL" | "RFI")}
                className="w-full bg-white border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788]"
              >
                <option value="SUBMITTAL">Submittal</option>
                <option value="RFI">RFI</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-[#3D5C48] block mb-1.5 font-medium">Project</label>
              <select
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
            <label className="text-sm text-[#3D5C48] block mb-1.5 font-medium">Subject</label>
            <input
              value={formSubject}
              onChange={(e) => setFormSubject(e.target.value)}
              required
              className="w-full bg-white border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788]"
              placeholder="e.g., Planting plan revision per client feedback"
            />
          </div>
          <div className="grid sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="text-sm text-[#3D5C48] block mb-1.5 font-medium">Ball in court</label>
              <input
                value={formBallInCourt}
                onChange={(e) => setFormBallInCourt(e.target.value)}
                className="w-full bg-white border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788]"
                placeholder="e.g., Contractor"
              />
            </div>
            <div>
              <label className="text-sm text-[#3D5C48] block mb-1.5 font-medium">Due date</label>
              <input
                type="date"
                value={formDueDate}
                onChange={(e) => setFormDueDate(e.target.value)}
                className="w-full bg-white border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788]"
              />
            </div>
            <div>
              <label className="text-sm text-[#3D5C48] block mb-1.5 font-medium">Assigned to</label>
              <select
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
                  <tr key={item.id} className="border-b border-[#E8EDE9] last:border-0 hover:bg-[#F7F9F7]/50 transition-colors">
                    <td className="px-4 sm:px-6 py-4">
                      <span className={`font-mono text-xs font-semibold px-2 py-1 rounded ${
                        item.type === "RFI" ? "bg-blue-50 text-blue-700" : "bg-[#F0FAF4] text-[#2D6A4F]"
                      }`}>
                        {item.number}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="font-medium text-[#1A2E22]">{item.subject}</div>
                      <div className="text-xs text-[#A3BEA9] mt-0.5">by {item.createdBy}</div>
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
                    <td className="px-4 sm:px-6 py-4">
                      <select
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
    </div>
  );
}
