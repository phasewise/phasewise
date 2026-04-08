"use client";

import { useMemo, useState } from "react";

type Row = {
  projectId: string;
  projectName: string;
  phaseId: string;
  phaseName: string;
};

type Props = {
  rows: Row[];
  dates: string[];
  initialEntries: Record<string, string>;
};

const formatKey = (projectId: string, phaseId: string, date: string) =>
  `${projectId}:${phaseId}:${date}`;

export default function TimeSheetClient({ rows, dates, initialEntries }: Props) {
  const [entries, setEntries] = useState<Record<string, string>>(initialEntries);
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);

  const rowTotals = useMemo(
    () =>
      rows.map((row) =>
        dates.reduce(
          (sum, date) => sum + Number(entries[formatKey(row.projectId, row.phaseId, date)] || 0),
          0
        )
      ),
    [rows, dates, entries]
  );

  const dayTotals = useMemo(
    () =>
      dates.map((date) =>
        rows.reduce(
          (sum, row) => sum + Number(entries[formatKey(row.projectId, row.phaseId, date)] || 0),
          0
        )
      ),
    [rows, dates, entries]
  );

  const grandTotal = dayTotals.reduce((sum, value) => sum + value, 0);

  const rowKey = (row: Row) => `${row.projectId}:${row.phaseId}`;

  async function handleBlur(row: Row, date: string) {
    const key = formatKey(row.projectId, row.phaseId, date);
    const value = entries[key].trim();
    const parsedHours = value === "" ? 0 : Number(value);

    if (Number.isNaN(parsedHours) || parsedHours < 0) {
      setError("Hours must be a positive number.");
      return;
    }

    setError(null);
    setSaving((current) => ({ ...current, [key]: true }));

    const response = await fetch("/api/time", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectId: row.projectId,
        phaseId: row.phaseId,
        date,
        hours: parsedHours,
      }),
    });

    const result = await response.json();
    setSaving((current) => ({ ...current, [key]: false }));

    if (!response.ok) {
      setError(result?.error || "Unable to save hours.");
      return;
    }

    if (parsedHours === 0) {
      setEntries((current) => ({ ...current, [key]: "" }));
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Weekly timesheet</h2>
            <p className="mt-1 text-sm text-slate-500">Log your time by project and phase for the current week.</p>
          </div>
          <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
            Total this week: <span className="font-semibold">{grandTotal.toFixed(2)}h</span>
          </div>
        </div>

        {error ? <p className="mt-4 text-sm text-rose-500">{error}</p> : null}

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full text-left text-sm text-slate-700">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3">Project / Phase</th>
                {dates.map((date) => (
                  <th key={date} className="px-3 py-3 text-center">{new Date(date).toLocaleDateString(undefined, { weekday: "short", day: "numeric" })}</th>
                ))}
                <th className="px-4 py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={rowKey(row)} className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3 align-top">
                    <div className="font-semibold text-slate-900">{row.projectName}</div>
                    <div className="text-xs text-slate-500">{row.phaseName}</div>
                  </td>
                  {dates.map((date) => {
                    const key = formatKey(row.projectId, row.phaseId, date);
                    return (
                      <td key={key} className="px-2 py-2 text-center">
                        <input
                          type="number"
                          min="0"
                          step="0.25"
                          value={entries[key] ?? ""}
                          onChange={(event) =>
                            setEntries((current) => ({ ...current, [key]: event.target.value }))
                          }
                          onBlur={() => handleBlur(row, date)}
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-2 py-2 text-center text-sm text-slate-900 outline-none focus:border-emerald-500"
                        />
                        {saving[key] ? <div className="mt-1 text-[11px] text-slate-400">Saving...</div> : null}
                      </td>
                    );
                  })}
                  <td className="px-4 py-3 text-right text-slate-900 font-semibold">{rowTotals[rowIndex].toFixed(2)}h</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 text-left">Daily total</th>
                {dayTotals.map((total, index) => (
                  <th key={index} className="px-3 py-3 text-center font-semibold text-slate-900">{total.toFixed(2)}h</th>
                ))}
                <th className="px-4 py-3 text-right font-semibold">{grandTotal.toFixed(2)}h</th>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
