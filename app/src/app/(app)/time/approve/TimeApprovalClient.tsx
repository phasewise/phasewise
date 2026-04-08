"use client";

import { useState } from "react";

type Timesheet = {
  id: string;
  weekStart: Date | string;
  status: string;
  submittedAt: Date | string | null;
  user: {
    id: string;
    fullName: string;
    email: string;
  };
};

type Props = {
  timesheets: Timesheet[];
};

export default function TimeApprovalClient({ timesheets }: Props) {
  const [items, setItems] = useState(timesheets);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function approve(id: string) {
    setError(null);
    setSavingId(id);

    const response = await fetch("/api/timesheets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "approve", timesheetId: id }),
    });

    const result = await response.json();
    setSavingId(null);

    if (!response.ok) {
      setError(result.error || "Unable to approve timesheet.");
      return;
    }

    setItems((current) => current.filter((item) => item.id !== id));
  }

  return (
    <div className="space-y-6">
      {error ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm text-slate-700">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
              <tr>
                <th className="px-6 py-4">Team member</th>
                <th className="px-6 py-4">Week start</th>
                <th className="px-6 py-4">Submitted</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((timesheet) => (
                <tr key={timesheet.id} className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">{timesheet.user.fullName}</div>
                    <div className="text-xs text-slate-500">{timesheet.user.email}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{new Date(timesheet.weekStart).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-slate-600">{timesheet.submittedAt ? new Date(timesheet.submittedAt).toLocaleString() : "—"}</td>
                  <td className="px-6 py-4 text-slate-600">{timesheet.status}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => approve(timesheet.id)}
                      disabled={savingId === timesheet.id}
                      className="rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-60"
                    >
                      {savingId === timesheet.id ? "Approving..." : "Approve"}
                    </button>
                  </td>
                </tr>
              ))}
              {items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-sm text-slate-500">
                    No submitted timesheets to approve.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
