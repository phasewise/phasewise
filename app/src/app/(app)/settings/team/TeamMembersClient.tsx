"use client";

import { useState } from "react";
import { Plus, UserMinus, UserPlus, Pencil } from "lucide-react";

type TeamUser = {
  id: string;
  fullName: string;
  email: string;
  role: string;
  title?: string | null;
  isActive?: boolean;
  photoUrl?: string | null;
};

function MemberAvatar({ name, photoUrl }: { name: string; photoUrl?: string | null }) {
  if (photoUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={photoUrl} alt={name} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />;
  }
  const parts = name.trim().split(/\s+/);
  const initials =
    parts.length === 1
      ? parts[0].slice(0, 2).toUpperCase()
      : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return (
    <div className="w-8 h-8 rounded-full bg-[#2D6A4F] text-white flex items-center justify-center text-xs font-semibold flex-shrink-0">
      {initials}
    </div>
  );
}

type Props = {
  users: TeamUser[];
  canManage: boolean;
};

const ROLES = [
  { value: "ADMIN", label: "Admin" },
  { value: "SUPERVISOR", label: "Supervisor" },
  { value: "PM", label: "Project Manager" },
  { value: "STAFF", label: "Staff" },
];

const ROLE_LABELS: Record<string, string> = {
  OWNER: "Owner",
  ADMIN: "Admin",
  SUPERVISOR: "Supervisor",
  PM: "Project Manager",
  STAFF: "Staff",
};

const LA_TITLES = [
  { value: "Principal / Owner", role: "OWNER" },
  { value: "Associate Principal", role: "OWNER" },
  { value: "Senior Associate", role: "SUPERVISOR" },
  { value: "Associate", role: "SUPERVISOR" },
  { value: "Senior Project Manager", role: "PM" },
  { value: "Project Manager", role: "PM" },
  { value: "Senior Landscape Architect", role: "PM" },
  { value: "Landscape Architect", role: "STAFF" },
  { value: "Landscape Designer", role: "STAFF" },
  { value: "Designer", role: "STAFF" },
  { value: "Junior Designer", role: "STAFF" },
  { value: "Design Intern", role: "STAFF" },
  { value: "CAD / BIM Technician", role: "STAFF" },
  { value: "Construction Administrator", role: "PM" },
  { value: "Specifications Writer", role: "STAFF" },
  { value: "Office Manager", role: "ADMIN" },
  { value: "Marketing Coordinator", role: "ADMIN" },
  { value: "Accounting / Bookkeeper", role: "ADMIN" },
];

export default function TeamMembersClient({ users: initialUsers, canManage }: Props) {
  const [users, setUsers] = useState(initialUsers);
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState("STAFF");
  const [newTitle, setNewTitle] = useState("");
  const [customTitle, setCustomTitle] = useState(false);
  const [saving, setSaving] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState<string | null>(null);
  const [editTitleValue, setEditTitleValue] = useState("");

  function handleTitleSelect(titleValue: string) {
    if (titleValue === "__custom__") {
      setCustomTitle(true);
      setNewTitle("");
      return;
    }
    setCustomTitle(false);
    setNewTitle(titleValue);
    const match = LA_TITLES.find((t) => t.value === titleValue);
    if (match) {
      setNewRole(match.role);
    }
  }

  async function addMember(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const res = await fetch("/api/team/members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName: newName, email: newEmail, role: newRole, title: newTitle || undefined }),
    });

    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(data.error || "Failed to add team member.");
      return;
    }

    setUsers((prev) => [
      ...prev,
      {
        id: data.user.id,
        fullName: data.user.fullName,
        email: data.user.email,
        role: data.user.role,
        title: data.user.title,
        isActive: true,
      },
    ]);
    setNewName("");
    setNewEmail("");
    setNewRole("STAFF");
    setNewTitle("");
    setCustomTitle(false);
    setShowForm(false);
  }

  async function saveTitle(userId: string) {
    setError(null);
    setActionId(userId);
    const res = await fetch("/api/team/members", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, title: editTitleValue }),
    });
    const data = await res.json();
    setActionId(null);
    if (!res.ok) {
      setError(data.error || "Failed to update title.");
      return;
    }
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, title: editTitleValue } : u))
    );
    setEditingTitle(null);
  }

  async function toggleActive(userId: string, currentlyActive: boolean) {
    setError(null);
    setActionId(userId);

    const res = await fetch("/api/team/members", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, isActive: !currentlyActive }),
    });

    const data = await res.json();
    setActionId(null);

    if (!res.ok) {
      setError(data.error || "Failed to update.");
      return;
    }

    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isActive: !currentlyActive } : u))
    );
  }

  if (!canManage) return null;

  const activeUsers = users.filter((u) => u.isActive !== false);
  const inactiveUsers = users.filter((u) => u.isActive === false);

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-[#1A2E22]">Team Members</h2>
          <p className="text-sm text-[#6B8C74]">{activeUsers.length} active member{activeUsers.length !== 1 ? "s" : ""}</p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-[#2D6A4F] text-white hover:bg-[#40916C] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add member
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-rose-50 border border-rose-200 rounded-xl p-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      {/* Add member form */}
      {showForm && (
        <form
          onSubmit={addMember}
          className="mb-6 bg-[#F0FAF4] border border-[#52B788]/30 rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-4 text-[#2D6A4F]">
            <UserPlus className="w-5 h-5" />
            <h3 className="text-sm font-semibold">Add a new team member</h3>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm text-[#3D5C48] block mb-1.5 font-medium">Full name</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                required
                className="w-full bg-white border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-[#1A2E22] text-sm focus:outline-none focus:border-[#52B788] transition-colors"
                placeholder="Jordan Reyes"
              />
            </div>
            <div>
              <label className="text-sm text-[#3D5C48] block mb-1.5 font-medium">Email</label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                required
                className="w-full bg-white border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-[#1A2E22] text-sm focus:outline-none focus:border-[#52B788] transition-colors"
                placeholder="jordan@firm.com"
              />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm text-[#3D5C48] block mb-1.5 font-medium">Job Title</label>
              {customTitle ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Enter custom title"
                    className="flex-1 bg-white border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-[#1A2E22] text-sm focus:outline-none focus:border-[#52B788] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => { setCustomTitle(false); setNewTitle(""); }}
                    className="text-xs text-[#6B8C74] hover:text-[#2D6A4F] px-2"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <select
                  value={newTitle}
                  onChange={(e) => handleTitleSelect(e.target.value)}
                  className="w-full bg-white border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-[#1A2E22] text-sm focus:outline-none focus:border-[#52B788] transition-colors"
                >
                  <option value="">Select a title...</option>
                  {LA_TITLES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.value}
                    </option>
                  ))}
                  <option value="__custom__">+ Custom title...</option>
                </select>
              )}
            </div>
            <div>
              <label className="text-sm text-[#3D5C48] block mb-1.5 font-medium">Permission Level</label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full bg-white border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-[#1A2E22] text-sm focus:outline-none focus:border-[#52B788] transition-colors"
              >
                {ROLES.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-[#A3BEA9] mt-1">Controls what this person can access in the app.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-[#2D6A4F] text-white hover:bg-[#40916C] transition-colors disabled:opacity-50"
            >
              {saving ? "Adding..." : "Add to team"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 rounded-lg text-sm text-[#6B8C74] hover:text-[#1A2E22] transition-colors"
            >
              Cancel
            </button>
          </div>
          <p className="mt-3 text-xs text-[#A3BEA9]">
            Billing rate and salary are auto-populated based on the job title. You can edit them in the Billing Rates section below.
          </p>
        </form>
      )}

      {/* Active members list */}
      <div className="rounded-2xl border border-[#E2EBE4] bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-[#E2EBE4] bg-[#F7F9F7] text-[#6B8C74]">
              <tr>
                <th className="px-4 sm:px-6 py-3 font-medium">Name</th>
                <th className="px-4 sm:px-6 py-3 font-medium">Title</th>
                <th className="px-4 sm:px-6 py-3 font-medium">Permission</th>
                <th className="px-4 sm:px-6 py-3 font-medium w-24"></th>
              </tr>
            </thead>
            <tbody>
              {activeUsers.map((user) => (
                <tr key={user.id} className="border-b border-[#E8EDE9] last:border-0">
                  <td className="px-4 sm:px-6 py-4 font-medium text-[#1A2E22]">
                    <div className="flex items-center gap-3">
                      <MemberAvatar name={user.fullName} photoUrl={user.photoUrl} />
                      <div>
                        <span>{user.fullName}</span>
                        <div className="text-xs text-[#6B8C74] font-normal">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-[#3D5C48]">
                    {editingTitle === user.id ? (
                      <div className="flex items-center gap-2">
                        <select
                          value={LA_TITLES.some((t) => t.value === editTitleValue) ? editTitleValue : "__custom__"}
                          onChange={(e) => {
                            if (e.target.value === "__custom__") return;
                            setEditTitleValue(e.target.value);
                          }}
                          className="bg-white border border-[#E2EBE4] rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-[#52B788]"
                        >
                          {LA_TITLES.map((t) => (
                            <option key={t.value} value={t.value}>{t.value}</option>
                          ))}
                          <option value="__custom__">Custom...</option>
                        </select>
                        {!LA_TITLES.some((t) => t.value === editTitleValue) && (
                          <input
                            type="text"
                            value={editTitleValue}
                            onChange={(e) => setEditTitleValue(e.target.value)}
                            className="bg-white border border-[#E2EBE4] rounded-lg px-2 py-1.5 text-xs w-32 focus:outline-none focus:border-[#52B788]"
                            placeholder="Custom title"
                          />
                        )}
                        <button
                          type="button"
                          onClick={() => saveTitle(user.id)}
                          disabled={actionId === user.id}
                          className="text-xs text-[#2D6A4F] hover:text-[#40916C] font-medium disabled:opacity-50"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingTitle(null)}
                          className="text-xs text-[#A3BEA9] hover:text-[#6B8C74]"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 group/title">
                        <span className="text-sm">{user.title || <span className="text-[#A3BEA9] italic">No title</span>}</span>
                        {canManage && (
                          <button
                            type="button"
                            onClick={() => { setEditingTitle(user.id); setEditTitleValue(user.title || ""); }}
                            className="opacity-0 group-hover/title:opacity-100 text-[#A3BEA9] hover:text-[#2D6A4F] transition-opacity"
                            title="Edit title"
                          >
                            <Pencil className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-[#F0FAF4] text-[#2D6A4F]">
                      {ROLE_LABELS[user.role] || user.role}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    {user.role !== "OWNER" && (
                      <button
                        type="button"
                        onClick={() => toggleActive(user.id, true)}
                        disabled={actionId === user.id}
                        className="inline-flex items-center gap-1 text-xs text-rose-500 hover:text-rose-700 transition-colors disabled:opacity-50"
                        title="Deactivate team member"
                      >
                        <UserMinus className="w-3.5 h-3.5" />
                        Deactivate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inactive members */}
      {inactiveUsers.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-[#A3BEA9] mb-3">Deactivated ({inactiveUsers.length})</h3>
          <div className="rounded-2xl border border-[#E8EDE9] bg-[#F7F9F7] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <tbody>
                  {inactiveUsers.map((user) => (
                    <tr key={user.id} className="border-b border-[#E8EDE9] last:border-0">
                      <td className="px-4 sm:px-6 py-3 text-[#A3BEA9]">
                        <div className="flex items-center gap-3 opacity-60">
                          <MemberAvatar name={user.fullName} photoUrl={user.photoUrl} />
                          <span>{user.fullName}</span>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-3 text-[#A3BEA9]">{user.email}</td>
                      <td className="px-4 sm:px-6 py-3">
                        <button
                          type="button"
                          onClick={() => toggleActive(user.id, false)}
                          disabled={actionId === user.id}
                          className="inline-flex items-center gap-1 text-xs text-[#2D6A4F] hover:text-[#40916C] transition-colors disabled:opacity-50"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          Reactivate
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
