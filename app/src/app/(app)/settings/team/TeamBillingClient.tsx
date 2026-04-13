"use client";

import { useState } from "react";
import { DEFAULT_BILLING_RATES, suggestBillingRate } from "@/lib/billing-defaults";
import type { UserRole } from "@prisma/client";

type TeamUser = {
  id: string;
  fullName: string;
  email: string;
  role: string;
  billingRate: number | null;
  salary: number | null;
  costRate: number | null;
};

type Props = {
  users: TeamUser[];
  canManage: boolean;
  canSeeSalary: boolean;
  currentUserId: string;
};

export default function TeamBillingClient({
  users,
  canManage,
  canSeeSalary,
  currentUserId,
}: Props) {
  const [userStates, setUserStates] = useState<Record<string, { billingRate: string; salary: string }>>(
    () => {
      const states: Record<string, { billingRate: string; salary: string }> = {};
      for (const u of users) {
        const defaults = DEFAULT_BILLING_RATES[u.role as UserRole] ?? DEFAULT_BILLING_RATES.STAFF;
        states[u.id] = {
          billingRate: u.billingRate ? String(u.billingRate) : String(defaults.billingRate),
          salary: u.salary ? String(u.salary) : String(defaults.salary),
        };
      }
      return states;
    }
  );
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);

  async function saveUser(userId: string) {
    setError(null);
    setSavingId(userId);
    setSuccessId(null);

    const state = userStates[userId];
    if (!state) return;

    const res = await fetch("/api/team/billing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        billingRate: state.billingRate || null,
        salary: state.salary || null,
      }),
    });

    const data = await res.json();
    setSavingId(null);

    if (!res.ok) {
      setError(data.error || "Failed to save.");
      return;
    }

    setSuccessId(userId);
    setTimeout(() => setSuccessId(null), 2000);
  }

  function updateField(userId: string, field: "billingRate" | "salary", value: string) {
    setUserStates((prev) => ({
      ...prev,
      [userId]: { ...prev[userId], [field]: value },
    }));
  }

  function autoFillRate(userId: string) {
    const state = userStates[userId];
    if (!state?.salary) return;
    const suggested = suggestBillingRate(Number(state.salary));
    updateField(userId, "billingRate", String(suggested));
  }

  // STAFF can only see their own row
  const visibleUsers = canManage
    ? users
    : users.filter((u) => u.id === currentUserId);

  return (
    <div className="rounded-2xl border border-[#E2EBE4] bg-white overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-[#E2EBE4] bg-[#F7F9F7] text-[#6B8C74]">
            <tr>
              <th className="px-4 sm:px-6 py-3 font-medium">Name</th>
              <th className="px-4 sm:px-6 py-3 font-medium">Role</th>
              <th className="px-4 sm:px-6 py-3 font-medium">Billing Rate ($/hr)</th>
              {canSeeSalary && <th className="px-4 sm:px-6 py-3 font-medium">Annual Salary</th>}
              {canSeeSalary && <th className="px-4 sm:px-6 py-3 font-medium">Hourly Cost</th>}
              {canManage && <th className="px-4 sm:px-6 py-3 font-medium w-28"></th>}
            </tr>
          </thead>
          <tbody>
            {visibleUsers.map((user) => {
              const state = userStates[user.id] ?? { billingRate: "", salary: "" };
              const defaults = DEFAULT_BILLING_RATES[user.role as UserRole] ?? DEFAULT_BILLING_RATES.STAFF;

              return (
                <tr key={user.id} className="border-b border-[#E8EDE9] last:border-0">
                  <td className="px-4 sm:px-6 py-4">
                    <div className="font-medium text-[#1A2E22]">{user.fullName}</div>
                    <div className="text-xs text-[#A3BEA9]">{user.email}</div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-[#6B8C74]">
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-[#F0FAF4] text-[#2D6A4F]">
                      {defaults.label}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    {canManage ? (
                      <div className="flex items-center gap-1">
                        <span className="text-[#A3BEA9]">$</span>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={state.billingRate}
                          onChange={(e) => updateField(user.id, "billingRate", e.target.value)}
                          className="w-20 bg-[#F7F9F7] border border-[#E2EBE4] rounded-lg px-2 py-1.5 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788]"
                        />
                        <span className="text-xs text-[#A3BEA9]">/hr</span>
                      </div>
                    ) : (
                      <span className="text-[#1A2E22]">
                        ${Number(state.billingRate || 0).toFixed(2)}/hr
                      </span>
                    )}
                  </td>
                  {canSeeSalary && (
                    <td className="px-4 sm:px-6 py-4">
                      {canManage ? (
                        <div className="flex items-center gap-1">
                          <span className="text-[#A3BEA9]">$</span>
                          <input
                            type="number"
                            step="1000"
                            min="0"
                            value={state.salary}
                            onChange={(e) => updateField(user.id, "salary", e.target.value)}
                            onBlur={() => autoFillRate(user.id)}
                            className="w-28 bg-[#F7F9F7] border border-[#E2EBE4] rounded-lg px-2 py-1.5 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788]"
                          />
                          <span className="text-xs text-[#A3BEA9]">/yr</span>
                        </div>
                      ) : (
                        <span className="text-[#1A2E22]">
                          ${Number(state.salary || 0).toLocaleString()}
                        </span>
                      )}
                    </td>
                  )}
                  {canSeeSalary && (
                    <td className="px-4 sm:px-6 py-4 text-[#6B8C74]">
                      {state.salary && Number(state.salary) > 0 ? (
                        <span>${(Number(state.salary) / 2080).toFixed(2)}/hr</span>
                      ) : (
                        <span className="text-[#A3BEA9]">—</span>
                      )}
                    </td>
                  )}
                  {canManage && (
                    <td className="px-4 sm:px-6 py-4">
                      <button
                        type="button"
                        onClick={() => saveUser(user.id)}
                        disabled={savingId === user.id}
                        className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-[#2D6A4F] text-white hover:bg-[#40916C] transition-colors disabled:opacity-50"
                      >
                        {savingId === user.id
                          ? "Saving..."
                          : successId === user.id
                            ? "Saved ✓"
                            : "Save"}
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {error && (
        <div className="px-6 py-3 bg-rose-50 border-t border-rose-200 text-sm text-rose-700">
          {error}
        </div>
      )}
      {canManage && (
        <div className="px-6 py-3 bg-[#F7F9F7] border-t border-[#E2EBE4] text-xs text-[#A3BEA9]">
          Salary is visible only to owners and admins. When you update salary, the billing rate auto-suggests using a 3.0x multiplier (industry standard).
        </div>
      )}
    </div>
  );
}
