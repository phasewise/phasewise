"use client";

import { useState } from "react";
import { Plus, UserMinus, UserPlus, Pencil, Link2, Check, Send, X } from "lucide-react";

type TeamUser = {
  id: string;
  fullName: string;
  email: string;
  role: string;
  title?: string | null;
  phone?: string | null;
  billingRate?: number | null;
  salary?: number | null;
  costRate?: number | null;
  isActive?: boolean;
  photoUrl?: string | null;
  inviteToken?: string | null;
  // Direct supervisor — when set, that user can approve THIS user's
  // timesheets in addition to any OWNER/ADMIN/SUPERVISOR role-approver.
  supervisorId?: string | null;
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
  { value: "Drafter / Technician", role: "STAFF" },
  { value: "Irrigation Designer", role: "STAFF" },
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
  const [editingUser, setEditingUser] = useState<TeamUser | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editTitleCustom, setEditTitleCustom] = useState(false);
  const [editRole, setEditRole] = useState("STAFF");
  const [editPhone, setEditPhone] = useState("");
  const [editBillingRate, setEditBillingRate] = useState("");
  const [editSalary, setEditSalary] = useState("");
  // "" = no supervisor (will send null on save). Not blocking own self —
  // server rejects userId === supervisorId.
  const [editSupervisorId, setEditSupervisorId] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [inviteBanner, setInviteBanner] = useState<{ name: string; url: string } | null>(null);

  function copyInviteLink(userId: string, token: string) {
    const url = `${window.location.origin}/invite/${token}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(userId);
      setTimeout(() => setCopiedId(null), 2000);
    });
  }

  async function sendInvite(userId: string, email: string, role: string, fullName: string) {
    setError(null);
    setActionId(userId);
    const res = await fetch("/api/team/invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, role }),
    });
    const data = await res.json();
    setActionId(null);
    if (!res.ok) {
      setError(data.error || "Failed to send invite.");
      return;
    }
    const token = data.token;
    // Update the user's invite token so the copy button appears
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, inviteToken: token } : u))
    );
    // Show the banner with instructions
    const url = `${window.location.origin}/invite/${token}`;
    setInviteBanner({ name: fullName, url });
    // Also copy to clipboard
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(userId);
      setTimeout(() => setCopiedId(null), 2000);
    });
  }

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
        inviteToken: data.inviteToken || null,
      },
    ]);
    setNewName("");
    setNewEmail("");
    setNewRole("STAFF");
    setNewTitle("");
    setCustomTitle(false);
    setShowForm(false);
  }

  function openEdit(user: TeamUser) {
    setEditingUser(user);
    setEditName(user.fullName);
    setEditEmail(user.email);
    setEditTitle(user.title || "");
    setEditTitleCustom(user.title ? !LA_TITLES.some((t) => t.value === user.title) : false);
    setEditRole(user.role);
    setEditPhone(user.phone || "");
    setEditBillingRate(user.billingRate != null ? String(user.billingRate) : "");
    setEditSalary(user.salary != null ? String(user.salary) : "");
    setEditSupervisorId(user.supervisorId || "");
    setError(null);
  }

  function closeEdit() {
    setEditingUser(null);
    setEditName("");
    setEditEmail("");
    setEditTitle("");
    setEditTitleCustom(false);
    setEditRole("STAFF");
    setEditPhone("");
    setEditBillingRate("");
    setEditSalary("");
    setEditSupervisorId("");
  }

  function handleEditTitleSelect(value: string) {
    if (value === "__custom__") {
      setEditTitleCustom(true);
      setEditTitle("");
      return;
    }
    setEditTitleCustom(false);
    setEditTitle(value);
    // Auto-set role from title (mirrors the add-member flow)
    const match = LA_TITLES.find((t) => t.value === value);
    if (match) setEditRole(match.role);
  }

  async function saveEdit() {
    if (!editingUser) return;
    setError(null);
    setActionId(editingUser.id);

    const body: Record<string, unknown> = {
      userId: editingUser.id,
      fullName: editName,
      email: editEmail,
      title: editTitle,
      role: editRole,
      phone: editPhone,
      // Send null to clear; otherwise pass the selected user id.
      supervisorId: editSupervisorId || null,
    };
    if (editBillingRate !== "") body.billingRate = editBillingRate;
    if (editSalary !== "") body.salary = editSalary;

    const res = await fetch("/api/team/members", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    setActionId(null);

    if (!res.ok) {
      setError(data.error || "Failed to update member.");
      return;
    }

    const updated = data.user;
    setUsers((prev) =>
      prev.map((u) =>
        u.id === editingUser.id
          ? {
              ...u,
              fullName: updated.fullName,
              email: updated.email,
              title: updated.title,
              role: updated.role,
              phone: updated.phone,
              supervisorId: updated.supervisorId ?? null,
              billingRate: updated.billingRate != null ? Number(updated.billingRate) : null,
              salary: updated.salary != null ? Number(updated.salary) : null,
              costRate: updated.costRate != null ? Number(updated.costRate) : null,
            }
          : u
      )
    );
    closeEdit();
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

      {inviteBanner && (
        <div className="mb-4 bg-[#F0FAF4] border border-[#52B788]/30 rounded-xl p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-[#1A2E22]">
                Invite link created for {inviteBanner.name}
              </p>
              <p className="text-xs text-[#6B8C74] mt-1">
                The link has been copied to your clipboard. Send it to them via email or message so they can set up their account and join your firm.
              </p>
              <div className="mt-2 flex items-center gap-2">
                <code className="text-xs bg-white border border-[#E2EBE4] rounded px-2 py-1 text-[#3D5C48] break-all select-all">
                  {inviteBanner.url}
                </code>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(inviteBanner.url);
                  }}
                  className="text-xs text-[#2D6A4F] hover:text-[#40916C] font-medium whitespace-nowrap"
                >
                  Copy
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setInviteBanner(null)}
              aria-label="Dismiss invite banner"
              className="text-[#A3BEA9] hover:text-[#6B8C74] text-lg leading-none"
            >
              &times;
            </button>
          </div>
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
              <label htmlFor="team-full-name" className="text-sm text-[#3D5C48] block mb-1.5 font-medium">Full name</label>
              <input
                id="team-full-name"
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                required
                autoComplete="name"
                className="w-full bg-white border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-[#1A2E22] text-sm focus:outline-none focus:border-[#52B788] transition-colors"
                placeholder="Jordan Reyes"
              />
            </div>
            <div>
              <label htmlFor="team-email" className="text-sm text-[#3D5C48] block mb-1.5 font-medium">Email</label>
              <input
                id="team-email"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full bg-white border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-[#1A2E22] text-sm focus:outline-none focus:border-[#52B788] transition-colors"
                placeholder="jordan@firm.com"
              />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="team-title" className="text-sm text-[#3D5C48] block mb-1.5 font-medium">Job Title</label>
              {customTitle ? (
                <div className="flex gap-2">
                  <input
                    id="team-title"
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
                  id="team-title"
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
              <label htmlFor="team-role" className="text-sm text-[#3D5C48] block mb-1.5 font-medium">Permission Level</label>
              <select
                id="team-role"
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
                    <span className="text-sm">{user.title || <span className="text-[#A3BEA9] italic">No title</span>}</span>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-[#F0FAF4] text-[#2D6A4F]">
                      {ROLE_LABELS[user.role] || user.role}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => openEdit(user)}
                      className="inline-flex items-center gap-1 text-xs text-[#2D6A4F] hover:text-[#40916C] transition-colors"
                      title="Edit member"
                    >
                      <Pencil className="w-3.5 h-3.5" /> Edit
                    </button>
                    {user.inviteToken ? (
                      <button
                        type="button"
                        onClick={() => copyInviteLink(user.id, user.inviteToken!)}
                        className="inline-flex items-center gap-1 text-xs text-[#2D6A4F] hover:text-[#40916C] transition-colors"
                        title="Copy invite link"
                      >
                        {copiedId === user.id ? (
                          <><Check className="w-3.5 h-3.5" /> Copied!</>
                        ) : (
                          <><Link2 className="w-3.5 h-3.5" /> Invite link</>
                        )}
                      </button>
                    ) : user.role !== "OWNER" && (
                      <button
                        type="button"
                        onClick={() => sendInvite(user.id, user.email, user.role, user.fullName)}
                        disabled={actionId === user.id}
                        className="inline-flex items-center gap-1 text-xs text-[#2D6A4F] hover:text-[#40916C] transition-colors disabled:opacity-50"
                        title="Send invite to join"
                      >
                        <Send className="w-3.5 h-3.5" /> Send invite
                      </button>
                    )}
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
                    </div>
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

      {/* Edit member modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={closeEdit}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 pb-0">
              <h2 className="font-serif text-xl text-[#1A2E22]">Edit Team Member</h2>
              <button type="button" onClick={closeEdit} aria-label="Close edit modal" className="text-[#A3BEA9] hover:text-[#1A2E22] transition-colors"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="team-edit-name" className="text-sm text-[#3D5C48] block mb-1.5 font-medium">Full name</label>
                  <input
                    id="team-edit-name"
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    autoComplete="name"
                    className="w-full bg-[#F7F9F7] border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788] transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="team-edit-email" className="text-sm text-[#3D5C48] block mb-1.5 font-medium">Email</label>
                  <input
                    id="team-edit-email"
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    autoComplete="email"
                    className="w-full bg-[#F7F9F7] border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788] transition-colors"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="team-edit-title" className="text-sm text-[#3D5C48] block mb-1.5 font-medium">Job Title</label>
                  {editTitleCustom ? (
                    <div className="flex gap-2">
                      <input
                        id="team-edit-title"
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        placeholder="Custom title"
                        className="flex-1 bg-[#F7F9F7] border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788] transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => { setEditTitleCustom(false); setEditTitle(""); }}
                        className="text-xs text-[#A3BEA9] hover:text-[#6B8C74] px-2"
                      >
                        Pick from list
                      </button>
                    </div>
                  ) : (
                    <select
                      id="team-edit-title"
                      value={editTitle}
                      onChange={(e) => handleEditTitleSelect(e.target.value)}
                      className="w-full bg-[#F7F9F7] border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788] transition-colors"
                    >
                      <option value="">— No title —</option>
                      {LA_TITLES.map((t) => (
                        <option key={t.value} value={t.value}>{t.value}</option>
                      ))}
                      <option value="__custom__">Custom title...</option>
                    </select>
                  )}
                </div>
                <div>
                  <label htmlFor="team-edit-role" className="text-sm text-[#3D5C48] block mb-1.5 font-medium">Permission Level</label>
                  <select
                    id="team-edit-role"
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                    disabled={editingUser.role === "OWNER"}
                    className="w-full bg-[#F7F9F7] border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788] transition-colors disabled:opacity-60"
                  >
                    {editingUser.role === "OWNER" && <option value="OWNER">Owner</option>}
                    {ROLES.map((r) => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                  {editingUser.role === "OWNER" && (
                    <p className="text-[11px] text-[#A3BEA9] mt-1">Owner role cannot be changed via this form. Promote another user to Owner first.</p>
                  )}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="team-edit-phone" className="text-sm text-[#3D5C48] block mb-1.5 font-medium">Phone</label>
                  <input
                    id="team-edit-phone"
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    autoComplete="tel"
                    placeholder="(555) 123-4567"
                    className="w-full bg-[#F7F9F7] border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788] transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="team-edit-supervisor" className="text-sm text-[#3D5C48] block mb-1.5 font-medium">Supervisor</label>
                  <select
                    id="team-edit-supervisor"
                    value={editSupervisorId}
                    onChange={(e) => setEditSupervisorId(e.target.value)}
                    className="w-full bg-[#F7F9F7] border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788] transition-colors"
                  >
                    <option value="">— No direct supervisor —</option>
                    {users
                      .filter((u) => u.id !== editingUser.id && u.isActive !== false)
                      .map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.fullName}
                          {u.title ? ` · ${u.title}` : ""}
                        </option>
                      ))}
                  </select>
                  <p className="text-[11px] text-[#A3BEA9] mt-1">
                    The supervisor can approve this user&rsquo;s timesheets in addition to any Owner / Admin / Supervisor.
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t border-[#E8EDE9]">
                <div>
                  <label htmlFor="team-edit-billing" className="text-sm text-[#3D5C48] block mb-1.5 font-medium">Billing rate ($/hr)</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#A3BEA9]">$</span>
                    <input
                      id="team-edit-billing"
                      type="text"
                      inputMode="decimal"
                      value={editBillingRate}
                      onChange={(e) => setEditBillingRate(e.target.value.replace(/[^0-9.]/g, ""))}
                      placeholder="0"
                      className="w-full bg-[#F7F9F7] border border-[#E2EBE4] rounded-lg pl-7 pr-3.5 py-2.5 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788] transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="team-edit-salary" className="text-sm text-[#3D5C48] block mb-1.5 font-medium">Annual salary</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#A3BEA9]">$</span>
                    <input
                      id="team-edit-salary"
                      type="text"
                      inputMode="decimal"
                      value={editSalary}
                      onChange={(e) => setEditSalary(e.target.value.replace(/[^0-9.]/g, ""))}
                      placeholder="0"
                      className="w-full bg-[#F7F9F7] border border-[#E2EBE4] rounded-lg pl-7 pr-3.5 py-2.5 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788] transition-colors"
                    />
                  </div>
                  <p className="text-[11px] text-[#A3BEA9] mt-1">Hourly cost auto-calculates as salary ÷ 2080.</p>
                </div>
              </div>

              {error && (
                <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 text-sm text-rose-700">
                  {error}
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={saveEdit}
                  disabled={actionId === editingUser.id || !editName.trim() || !editEmail.trim()}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium bg-[#2D6A4F] text-white hover:bg-[#40916C] transition-colors disabled:opacity-60"
                >
                  {actionId === editingUser.id ? "Saving..." : "Save changes"}
                </button>
                <button
                  type="button"
                  onClick={closeEdit}
                  className="text-sm text-[#6B8C74] hover:text-[#1A2E22] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
