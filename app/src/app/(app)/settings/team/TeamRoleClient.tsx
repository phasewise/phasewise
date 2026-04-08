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
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Role assignments</h2>
            <p className="mt-1 text-sm text-slate-500">Supervisors can approve timesheets and review project work.</p>
          </div>
          <div className="rounded-2xl bg-slate-50 px-4 py-2 text-sm text-slate-600">
            Your role: <span className="font-semibold">{currentUser.role}</span>
          </div>
        </div>

        {error ? <p className="mt-4 text-sm text-rose-500">{error}</p> : null}

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full text-left text-sm text-slate-700">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id} className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-900">{member.fullName}</td>
                  <td className="px-6 py-4 text-slate-600">{member.email}</td>
                  <td className="px-6 py-4 text-slate-600">{member.role}</td>
                  <td className="px-6 py-4">
                    {canManage ? (
                      <select
                        value={member.role}
                        onChange={(event) => updateRole(member.id, event.target.value)}
                        disabled={saving === member.id || currentUser.id === member.id}
                        className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-500"
                      >
                        {roles.map((roleOption) => (
                          <option key={roleOption} value={roleOption}>
                            {roleOption}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-slate-500">Read only</span>
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
