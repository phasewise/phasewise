"use client";

import { useState } from "react";

type User = {
  id: string;
  fullName: string;
  email: string;
  role: string;
};

type Props = {
  currentUser: { id: string; role: string };
  users: User[];
};

const roles = ["OWNER", "ADMIN", "SUPERVISOR", "PM", "STAFF"] as const;

const ROLE_LABELS: Record<string, string> = {
  OWNER: "Owner",
  ADMIN: "Admin",
  SUPERVISOR: "Supervisor",
  PM: "Project Manager",
  STAFF: "Staff",
};

export default function TeamRoleClient({ currentUser, users }: Props) {
  const [members, setMembers] = useState(users);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);

  async function updateRole(userId: string, role: string) {
    setError(null);
    setSaving(userId);

    const response = await fetch("/api/team/role", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, role }),
    });

    const result = await response.json();
    setSaving(null);

    if (!response.ok) {
      setError(result.error || "Unable to update role.");
      return;
    }

    setMembers((current) =>
      current.map((member) =>
        member.id === userId ? { ...member, role } : member
      )
    );
  }

  const canManage = ["OWNER", "ADMIN"].includes(currentUser.role);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[#E2EBE4] bg-white p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-[#1A2E22]">Permission levels</h3>
            <p className="mt-1 text-sm text-[#6B8C74]">Controls what each person can access. Supervisors can approve timesheets and review project work.</p>
          </div>
          <div className="rounded-lg bg-[#F0FAF4] px-3 py-1.5 text-sm text-[#2D6A4F]">
            You: <span className="font-semibold">{ROLE_LABELS[currentUser.role] || currentUser.role}</span>
          </div>
        </div>

        {error ? <p className="mt-4 text-sm text-rose-500">{error}</p> : null}

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-[#E2EBE4] bg-[#F7F9F7] text-[#6B8C74]">
              <tr>
                <th className="px-4 sm:px-6 py-3 font-medium">Name</th>
                <th className="px-4 sm:px-6 py-3 font-medium">Current Level</th>
                <th className="px-4 sm:px-6 py-3 font-medium">Change</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id} className="border-b border-[#E8EDE9] last:border-0 hover:bg-[#F7F9F7]/50 transition-colors">
                  <td className="px-4 sm:px-6 py-4 font-medium text-[#1A2E22]">{member.fullName}</td>
                  <td className="px-4 sm:px-6 py-4">
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-[#F0FAF4] text-[#2D6A4F]">
                      {ROLE_LABELS[member.role] || member.role}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    {canManage ? (
                      <select
                        value={member.role}
                        onChange={(event) => updateRole(member.id, event.target.value)}
                        disabled={saving === member.id || currentUser.id === member.id}
                        className="rounded-lg border border-[#E2EBE4] bg-[#F7F9F7] px-3 py-2 text-sm text-[#1A2E22] outline-none focus:border-[#52B788] disabled:opacity-50"
                      >
                        {roles.map((roleOption) => (
                          <option key={roleOption} value={roleOption}>
                            {ROLE_LABELS[roleOption]}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-[#A3BEA9] text-sm">Read only</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
