"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save, RotateCcw } from "lucide-react";
import type { LeaveType } from "@prisma/client";
import {
  LEAVE_TYPES,
  LEAVE_TYPE_LABELS,
  type LeavePolicy,
  type LeaveBalance,
} from "@/lib/leave";

type UserRow = {
  id: string;
  fullName: string;
  role: string;
  override: LeavePolicy | null;
};

type Props = {
  orgPolicy: LeavePolicy;
  users: UserRow[];
  balancesByUser: Array<{ userId: string; balances: LeaveBalance[] }>;
};

function normalizePolicy(p: LeavePolicy | null | undefined): LeavePolicy {
  const out: LeavePolicy = {};
  for (const t of LEAVE_TYPES) {
    out[t] = {
      annualHours: p?.[t]?.annualHours ?? 0,
      rolloverCap: p?.[t]?.rolloverCap ?? 0,
    };
  }
  return out;
}

export default function LeaveAdminClient({ orgPolicy, users, balancesByUser }: Props) {
  const [policy, setPolicy] = useState<LeavePolicy>(normalizePolicy(orgPolicy));
  const [savingOrg, setSavingOrg] = useState(false);
  const [savingUser, setSavingUser] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  // User override editor state
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editOverride, setEditOverride] = useState<LeavePolicy>({});

  function updatePolicyField(
    target: "org" | "override",
    type: LeaveType,
    field: "annualHours" | "rolloverCap",
    value: string
  ) {
    const num = value === "" ? 0 : Number(value);
    if (target === "org") {
      setPolicy((prev) => ({
        ...prev,
        [type]: { ...(prev[type] ?? { annualHours: 0, rolloverCap: 0 }), [field]: num },
      }));
    } else {
      setEditOverride((prev) => ({
        ...prev,
        [type]: { ...(prev[type] ?? { annualHours: 0, rolloverCap: 0 }), [field]: num },
      }));
    }
  }

  async function saveOrgPolicy() {
    setSavingOrg(true);
    setError("");
    const res = await fetch("/api/leave/policy", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orgPolicy: policy }),
    });
    setSavingOrg(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Failed to save policy.");
      return;
    }
    setNotice("Firm-wide leave policy saved.");
    setTimeout(() => setNotice(""), 2500);
  }

  function openOverride(user: UserRow) {
    setEditingUserId(user.id);
    setEditOverride(normalizePolicy(user.override ?? policy));
    setError("");
  }

  function closeOverride() {
    setEditingUserId(null);
  }

  async function saveOverride() {
    if (!editingUserId) return;
    setSavingUser(editingUserId);
    setError("");
    const res = await fetch("/api/leave/policy", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: editingUserId, userOverride: editOverride }),
    });
    setSavingUser(null);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Failed to save override.");
      return;
    }
    setNotice("Employee override saved.");
    setTimeout(() => setNotice(""), 2500);
    closeOverride();
    // Reload so balances reflect the new allowance
    window.location.reload();
  }

  async function removeOverride(userId: string) {
    if (!confirm("Remove this override? The employee will revert to the firm-wide policy.")) return;
    setSavingUser(userId);
    setError("");
    const res = await fetch("/api/leave/policy", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, userOverride: null }),
    });
    setSavingUser(null);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Failed to remove override.");
      return;
    }
    setNotice("Override removed.");
    setTimeout(() => setNotice(""), 2500);
    window.location.reload();
  }

  const balanceMap = new Map(balancesByUser.map((b) => [b.userId, b.balances]));

  return (
    <div className="p-6 sm:p-8 max-w-5xl">
      <Link
        href="/admin"
        className="inline-flex items-center gap-2 text-sm text-[#6B8C74] hover:text-[#1A2E22] mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Admin
      </Link>

      <div className="mb-8">
        <h1 className="font-serif text-3xl text-[#1A2E22]">Leave & PTO</h1>
        <p className="mt-2 text-sm text-[#6B8C74]">
          Set firm-wide defaults, override per employee, and see current-year balances.
          Used hours are auto-computed from logged leave time entries.
        </p>
      </div>

      {notice && (
        <div className="mb-4 rounded-xl border border-[#52B788]/30 bg-[#F0FAF4] px-4 py-3 text-sm text-[#2D6A4F]">
          {notice}
        </div>
      )}
      {error && (
        <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      {/* Firm-wide policy */}
      <div className="rounded-2xl border border-[#E2EBE4] bg-white p-6 shadow-sm mb-8">
        <h2 className="text-lg font-semibold text-[#1A2E22]">Firm-wide default policy</h2>
        <p className="mt-1 text-sm text-[#6B8C74]">
          Annual hours granted at the start of each year. Rollover cap is the maximum unused
          hours that carry into the next year (0 = use it or lose it).
        </p>

        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-[#E2EBE4] text-[#6B8C74]">
              <tr>
                <th className="px-3 py-2 font-medium">Leave type</th>
                <th className="px-3 py-2 font-medium">Annual hours</th>
                <th className="px-3 py-2 font-medium">Rollover cap</th>
              </tr>
            </thead>
            <tbody>
              {LEAVE_TYPES.map((type) => (
                <tr key={type} className="border-b border-[#E8EDE9] last:border-0">
                  <td className="px-3 py-3 font-medium text-[#1A2E22]">{LEAVE_TYPE_LABELS[type]}</td>
                  <td className="px-3 py-3">
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={policy[type]?.annualHours ?? 0}
                      onChange={(e) => updatePolicyField("org", type, "annualHours", e.target.value)}
                      className="w-28 rounded-lg border border-[#E2EBE4] bg-[#F7F9F7] px-3 py-2 text-sm focus:outline-none focus:border-[#52B788] focus:bg-white"
                    />
                  </td>
                  <td className="px-3 py-3">
                    <input
                      type="number"
                      min="-1"
                      step="1"
                      value={policy[type]?.rolloverCap ?? 0}
                      onChange={(e) => updatePolicyField("org", type, "rolloverCap", e.target.value)}
                      className="w-28 rounded-lg border border-[#E2EBE4] bg-[#F7F9F7] px-3 py-2 text-sm focus:outline-none focus:border-[#52B788] focus:bg-white"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          type="button"
          onClick={saveOrgPolicy}
          disabled={savingOrg}
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#2D6A4F] text-white px-4 py-2 text-sm font-semibold hover:bg-[#40916C] disabled:opacity-60 transition-colors"
        >
          <Save className="w-4 h-4" />
          {savingOrg ? "Saving..." : "Save firm policy"}
        </button>
      </div>

      {/* Per-employee balances */}
      <div className="rounded-2xl border border-[#E2EBE4] bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[#1A2E22]">Employee balances</h2>
        <p className="mt-1 text-sm text-[#6B8C74]">
          Click an employee to set a per-person override if their hiring agreement differs from the firm default.
        </p>

        <div className="mt-5 space-y-3">
          {users.map((user) => {
            const userBalances = balanceMap.get(user.id) ?? [];
            const hasOverride = user.override !== null;
            return (
              <div
                key={user.id}
                className="rounded-xl border border-[#E8EDE9] bg-[#F7F9F7] p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="font-semibold text-[#1A2E22]">{user.fullName}</div>
                    <div className="text-xs uppercase tracking-[0.18em] text-[#6B8C74] mt-1">
                      {user.role}
                      {hasOverride && (
                        <span className="ml-2 text-[#C9A87C]">· Custom policy</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {hasOverride && (
                      <button
                        type="button"
                        onClick={() => removeOverride(user.id)}
                        disabled={savingUser === user.id}
                        className="inline-flex items-center gap-1 text-xs text-[#6B8C74] hover:text-rose-500 transition-colors"
                      >
                        <RotateCcw className="w-3 h-3" />
                        Reset to default
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => openOverride(user)}
                      className="rounded-lg bg-white border border-[#E2EBE4] px-3 py-1.5 text-xs font-medium text-[#2D6A4F] hover:border-[#52B788] transition-colors"
                    >
                      {hasOverride ? "Edit override" : "Add override"}
                    </button>
                  </div>
                </div>

                <div className="grid gap-2 sm:grid-cols-5">
                  {userBalances.map((b) => {
                    const pctUsed =
                      b.annualHours > 0 ? (b.usedHours / b.annualHours) * 100 : 0;
                    const color =
                      pctUsed > 100
                        ? "text-rose-600"
                        : pctUsed > 80
                          ? "text-amber-600"
                          : "text-[#2D6A4F]";
                    return (
                      <div key={b.type} className="rounded-lg bg-white border border-[#E2EBE4] px-3 py-2">
                        <div className="text-[10px] uppercase tracking-[0.18em] text-[#6B8C74]">
                          {LEAVE_TYPE_LABELS[b.type]}
                        </div>
                        <div className={`mt-1 text-sm font-semibold ${color}`}>
                          {b.remainingHours.toFixed(0)}h
                          <span className="text-[#A3BEA9] font-normal"> / {b.annualHours}h</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Override editor modal */}
      {editingUserId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={closeOverride}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-5 border-b border-[#E2EBE4]">
              <h3 className="text-lg font-semibold text-[#1A2E22]">
                Override leave policy — {users.find((u) => u.id === editingUserId)?.fullName}
              </h3>
              <p className="mt-1 text-xs text-[#6B8C74]">
                These values replace the firm default for this employee.
              </p>
            </div>
            <div className="px-6 py-5">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-[#E2EBE4] text-[#6B8C74]">
                  <tr>
                    <th className="px-2 py-2 font-medium">Type</th>
                    <th className="px-2 py-2 font-medium">Annual</th>
                    <th className="px-2 py-2 font-medium">Rollover cap</th>
                  </tr>
                </thead>
                <tbody>
                  {LEAVE_TYPES.map((type) => (
                    <tr key={type} className="border-b border-[#E8EDE9] last:border-0">
                      <td className="px-2 py-2 text-[#1A2E22]">{LEAVE_TYPE_LABELS[type]}</td>
                      <td className="px-2 py-2">
                        <input
                          type="number"
                          min="0"
                          step="1"
                          value={editOverride[type]?.annualHours ?? 0}
                          onChange={(e) => updatePolicyField("override", type, "annualHours", e.target.value)}
                          className="w-24 rounded-lg border border-[#E2EBE4] bg-[#F7F9F7] px-3 py-2 text-sm focus:outline-none focus:border-[#52B788] focus:bg-white"
                        />
                      </td>
                      <td className="px-2 py-2">
                        <input
                          type="number"
                          min="-1"
                          step="1"
                          value={editOverride[type]?.rolloverCap ?? 0}
                          onChange={(e) => updatePolicyField("override", type, "rolloverCap", e.target.value)}
                          className="w-24 rounded-lg border border-[#E2EBE4] bg-[#F7F9F7] px-3 py-2 text-sm focus:outline-none focus:border-[#52B788] focus:bg-white"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 border-t border-[#E2EBE4] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={closeOverride}
                disabled={savingUser === editingUserId}
                className="px-4 py-2 rounded-lg text-sm font-medium text-[#6B8C74] hover:text-[#1A2E22]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveOverride}
                disabled={savingUser === editingUserId}
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-[#2D6A4F] text-white hover:bg-[#40916C] disabled:opacity-60"
              >
                {savingUser === editingUserId ? "Saving..." : "Save override"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
