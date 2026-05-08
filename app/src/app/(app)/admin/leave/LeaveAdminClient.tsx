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
import { useConfirm } from "@/components/confirm-provider";

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
      mode: p?.[t]?.mode ?? "FRONTLOAD",
      monthlyAccrual: p?.[t]?.monthlyAccrual ?? 0,
      cap: p?.[t]?.cap ?? 0,
    };
  }
  return out;
}

export default function LeaveAdminClient({ orgPolicy, users, balancesByUser }: Props) {
  const confirm = useConfirm();
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
    field: "annualHours" | "rolloverCap" | "monthlyAccrual" | "cap",
    value: string
  ) {
    const num = value === "" ? 0 : Number(value);
    const blank = { annualHours: 0, rolloverCap: 0, mode: "FRONTLOAD" as const, monthlyAccrual: 0, cap: 0 };

    // Auto-sync Annual ↔ Monthly so the user only types one and the
    // other updates. Annual rounds to whole numbers (people think in
    // whole annual hours); Monthly keeps 2 decimals (80/12 = 6.67).
    // The freshly-typed field stays exact; only the computed field
    // gets the linked update.
    const linked: Record<string, number> = {};
    if (field === "annualHours") {
      linked.monthlyAccrual = Math.round((num / 12) * 100) / 100;
    } else if (field === "monthlyAccrual") {
      linked.annualHours = Math.round(num * 12);
    }

    if (target === "org") {
      setPolicy((prev) => ({
        ...prev,
        [type]: { ...(prev[type] ?? blank), [field]: num, ...linked },
      }));
    } else {
      setEditOverride((prev) => ({
        ...prev,
        [type]: { ...(prev[type] ?? blank), [field]: num, ...linked },
      }));
    }
  }

  function updatePolicyMode(
    target: "org" | "override",
    type: LeaveType,
    mode: "FRONTLOAD" | "ACCRUED"
  ) {
    const blank = { annualHours: 0, rolloverCap: 0, mode: "FRONTLOAD" as const, monthlyAccrual: 0, cap: 0 };
    if (target === "org") {
      setPolicy((prev) => ({
        ...prev,
        [type]: { ...(prev[type] ?? blank), mode },
      }));
    } else {
      setEditOverride((prev) => ({
        ...prev,
        [type]: { ...(prev[type] ?? blank), mode },
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
    const ok = await confirm({
      title: "Remove this override?",
      message: "The employee will revert to the firm-wide policy.",
      confirmText: "Remove",
      destructive: true,
    });
    if (!ok) return;
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
          <strong>Front-load</strong>: full annual hours available on day one of the year.{" "}
          <strong>Accrued</strong>: hours added each completed month up to a cap — staff have to
          earn it instead of taking 80h of vacation in their first month. Rollover cap = max
          hours that carry across years (0 = use it or lose it).
        </p>

        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-[#E2EBE4] text-[#6B8C74]">
              <tr>
                <th className="px-3 py-2 font-medium">Leave type</th>
                <th className="px-3 py-2 font-medium">Mode</th>
                <th className="px-3 py-2 font-medium">Annual hours</th>
                <th className="px-3 py-2 font-medium">Monthly accrual</th>
                <th className="px-3 py-2 font-medium">Cap</th>
                <th className="px-3 py-2 font-medium">Rollover cap</th>
              </tr>
            </thead>
            <tbody>
              {LEAVE_TYPES.map((type) => {
                const isAccrued = policy[type]?.mode === "ACCRUED";
                return (
                  <tr key={type} className="border-b border-[#E8EDE9] last:border-0">
                    <td className="px-3 py-3 font-medium text-[#1A2E22]">{LEAVE_TYPE_LABELS[type]}</td>
                    <td className="px-3 py-3">
                      <select
                        value={policy[type]?.mode ?? "FRONTLOAD"}
                        onChange={(e) =>
                          updatePolicyMode("org", type, e.target.value as "FRONTLOAD" | "ACCRUED")
                        }
                        className="w-32 rounded-lg border border-[#E2EBE4] bg-[#F7F9F7] px-3 py-2 text-sm focus:outline-none focus:border-[#52B788] focus:bg-white"
                      >
                        <option value="FRONTLOAD">Front-load</option>
                        <option value="ACCRUED">Accrued</option>
                      </select>
                    </td>
                    <td className="px-3 py-3">
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={policy[type]?.annualHours ?? 0}
                        onChange={(e) => updatePolicyField("org", type, "annualHours", e.target.value)}
                        className="w-24 rounded-lg border border-[#E2EBE4] bg-[#F7F9F7] px-3 py-2 text-sm focus:outline-none focus:border-[#52B788] focus:bg-white"
                      />
                    </td>
                    <td className="px-3 py-3">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={policy[type]?.monthlyAccrual ?? 0}
                        disabled={!isAccrued}
                        onChange={(e) => updatePolicyField("org", type, "monthlyAccrual", e.target.value)}
                        className="w-24 rounded-lg border border-[#E2EBE4] bg-[#F7F9F7] px-3 py-2 text-sm focus:outline-none focus:border-[#52B788] focus:bg-white disabled:bg-[#F0F2F0] disabled:text-[#A3BEA9]"
                      />
                    </td>
                    <td className="px-3 py-3">
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={policy[type]?.cap ?? 0}
                        disabled={!isAccrued}
                        onChange={(e) => updatePolicyField("org", type, "cap", e.target.value)}
                        className="w-24 rounded-lg border border-[#E2EBE4] bg-[#F7F9F7] px-3 py-2 text-sm focus:outline-none focus:border-[#52B788] focus:bg-white disabled:bg-[#F0F2F0] disabled:text-[#A3BEA9]"
                      />
                    </td>
                    <td className="px-3 py-3">
                      <input
                        type="number"
                        min="-1"
                        step="1"
                        value={policy[type]?.rolloverCap ?? 0}
                        onChange={(e) => updatePolicyField("org", type, "rolloverCap", e.target.value)}
                        className="w-24 rounded-lg border border-[#E2EBE4] bg-[#F7F9F7] px-3 py-2 text-sm focus:outline-none focus:border-[#52B788] focus:bg-white"
                      />
                    </td>
                  </tr>
                );
              })}
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
                        {b.carryoverHours > 0 && (
                          <div className="mt-0.5 text-[10px] text-[#6B8C74]">
                            +{b.carryoverHours.toFixed(0)}h carried over
                          </div>
                        )}
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
            className="w-full max-w-3xl rounded-2xl bg-white shadow-xl"
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
              <p className="text-xs text-[#6B8C74] mb-3">
                Same shape as the firm default — Mode (Front-load /
                Accrued), Annual hours, Monthly accrual, Cap, Rollover
                cap. Anything left at 0 falls back to the firm value.
              </p>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="border-b border-[#E2EBE4] text-[#6B8C74]">
                    <tr>
                      <th className="px-2 py-2 font-medium">Type</th>
                      <th className="px-2 py-2 font-medium">Mode</th>
                      <th className="px-2 py-2 font-medium">Annual</th>
                      <th className="px-2 py-2 font-medium">Monthly</th>
                      <th className="px-2 py-2 font-medium">Cap</th>
                      <th className="px-2 py-2 font-medium">Rollover</th>
                    </tr>
                  </thead>
                  <tbody>
                    {LEAVE_TYPES.map((type) => {
                      const isAccrued = editOverride[type]?.mode === "ACCRUED";
                      return (
                        <tr key={type} className="border-b border-[#E8EDE9] last:border-0">
                          <td className="px-2 py-2 text-[#1A2E22]">{LEAVE_TYPE_LABELS[type]}</td>
                          <td className="px-2 py-2">
                            <select
                              value={editOverride[type]?.mode ?? "FRONTLOAD"}
                              onChange={(e) =>
                                updatePolicyMode("override", type, e.target.value as "FRONTLOAD" | "ACCRUED")
                              }
                              className="w-28 rounded-lg border border-[#E2EBE4] bg-[#F7F9F7] px-2 py-2 text-sm focus:outline-none focus:border-[#52B788] focus:bg-white"
                            >
                              <option value="FRONTLOAD">Front-load</option>
                              <option value="ACCRUED">Accrued</option>
                            </select>
                          </td>
                          <td className="px-2 py-2">
                            <input
                              type="number"
                              min="0"
                              step="1"
                              value={editOverride[type]?.annualHours ?? 0}
                              onChange={(e) => updatePolicyField("override", type, "annualHours", e.target.value)}
                              className="w-20 rounded-lg border border-[#E2EBE4] bg-[#F7F9F7] px-2 py-2 text-sm focus:outline-none focus:border-[#52B788] focus:bg-white"
                            />
                          </td>
                          <td className="px-2 py-2">
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={editOverride[type]?.monthlyAccrual ?? 0}
                              disabled={!isAccrued}
                              onChange={(e) => updatePolicyField("override", type, "monthlyAccrual", e.target.value)}
                              className="w-20 rounded-lg border border-[#E2EBE4] bg-[#F7F9F7] px-2 py-2 text-sm focus:outline-none focus:border-[#52B788] focus:bg-white disabled:bg-[#F0F2F0] disabled:text-[#A3BEA9]"
                            />
                          </td>
                          <td className="px-2 py-2">
                            <input
                              type="number"
                              min="0"
                              step="1"
                              value={editOverride[type]?.cap ?? 0}
                              disabled={!isAccrued}
                              onChange={(e) => updatePolicyField("override", type, "cap", e.target.value)}
                              className="w-20 rounded-lg border border-[#E2EBE4] bg-[#F7F9F7] px-2 py-2 text-sm focus:outline-none focus:border-[#52B788] focus:bg-white disabled:bg-[#F0F2F0] disabled:text-[#A3BEA9]"
                            />
                          </td>
                          <td className="px-2 py-2">
                            <input
                              type="number"
                              min="-1"
                              step="1"
                              value={editOverride[type]?.rolloverCap ?? 0}
                              onChange={(e) => updatePolicyField("override", type, "rolloverCap", e.target.value)}
                              className="w-20 rounded-lg border border-[#E2EBE4] bg-[#F7F9F7] px-2 py-2 text-sm focus:outline-none focus:border-[#52B788] focus:bg-white"
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
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
