"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";

type Project = {
  id: string;
  name: string;
  phases: Array<{ id: string; name: string }>;
};

type Props = {
  projects: Project[];
  dates: string[];
  dateLabels: string[];
  initialEntries: Record<string, string>;
  initialRows: Array<{ projectId: string; phaseId: string }>;
  readOnly?: boolean;
};

const formatKey = (projectId: string, phaseId: string, date: string) =>
  `${projectId}:${phaseId}:${date}`;

export default function TimeSheetClient({
  projects,
  dates,
  dateLabels,
  initialEntries,
  initialRows,
  readOnly = false,
}: Props) {
  const [rows, setRows] = useState<Array<{ projectId: string; phaseId: string }>>(
    initialRows.length > 0 ? initialRows : []
  );
  const [entries, setEntries] = useState<Record<string, string>>(initialEntries);
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);

  // Get phases for a given project
  function getPhasesForProject(projectId: string) {
    return projects.find((p) => p.id === projectId)?.phases ?? [];
  }

  // Add a new empty row
  function addRow() {
    setRows((prev) => [...prev, { projectId: "", phaseId: "" }]);
  }

  // Remove a row
  function removeRow(index: number) {
    setRows((prev) => prev.filter((_, i) => i !== index));
  }

  // Update a row's project or phase selection
  function updateRow(index: number, field: "projectId" | "phaseId", value: string) {
    setRows((prev) =>
      prev.map((row, i) => {
        if (i !== index) return row;
        if (field === "projectId") {
          // When project changes, reset phase
          return { projectId: value, phaseId: "" };
        }
        return { ...row, [field]: value };
      })
    );
  }

  // Calculate totals
  const rowTotals = useMemo(
    () =>
      rows.map((row) =>
        row.projectId && row.phaseId
          ? dates.reduce(
              (sum, date) => sum + Number(entries[formatKey(row.projectId, row.phaseId, date)] || 0),
              0
            )
          : 0
      ),
    [rows, dates, entries]
  );

  const dayTotals = useMemo(
    () =>
      dates.map((date) =>
        rows.reduce(
          (sum, row) =>
            row.projectId && row.phaseId
              ? sum + Number(entries[formatKey(row.projectId, row.phaseId, date)] || 0)
              : sum,
          0
        )
      ),
    [rows, dates, entries]
  );

  const grandTotal = dayTotals.reduce((sum, v) => sum + v, 0);

  // Save a single cell to the API
  async function handleBlur(row: { projectId: string; phaseId: string }, date: string) {
    if (!row.projectId || !row.phaseId) return;

    const key = formatKey(row.projectId, row.phaseId, date);
    const value = (entries[key] ?? "").trim();
    const parsedHours = value === "" ? 0 : Number(value);

    if (Number.isNaN(parsedHours) || parsedHours < 0) {
      setError("Hours must be a positive number.");
      return;
    }

    setError(null);
    setSaving((prev) => ({ ...prev, [key]: true }));

    try {
      const res = await fetch("/api/time", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: row.projectId,
          phaseId: row.phaseId,
          date,
          hours: parsedHours,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Failed to save time entry.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving((prev) => ({ ...prev, [key]: false }));
    }
  }

  return (
    <div>
      {error && (
        <div className="mb-4 bg-rose-50 border border-rose-200 rounded-xl p-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div className="rounded-2xl border border-[#E2EBE4] bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-[#E2EBE4] bg-[#F7F9F7] text-[#6B8C74]">
              <tr>
                <th className="px-3 sm:px-4 py-3 font-medium min-w-[140px]">Project</th>
                <th className="px-3 sm:px-4 py-3 font-medium min-w-[120px]">Phase</th>
                {dateLabels.map((label, i) => (
                  <th key={dates[i]} className="px-2 py-3 font-medium text-center w-16">
                    <div className="text-[10px] uppercase tracking-wider">{label.split(" ")[0]}</div>
                    <div className="text-xs font-normal">{label.split(" ")[1]}</div>
                  </th>
                ))}
                <th className="px-3 py-3 font-medium text-center w-16">Total</th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => {
                const phases = getPhasesForProject(row.projectId);

                return (
                  <tr key={index} className="border-b border-[#E8EDE9] last:border-0">
                    {/* Project dropdown */}
                    <td className="px-3 sm:px-4 py-2">
                      <select
                        value={row.projectId}
                        onChange={(e) => updateRow(index, "projectId", e.target.value)}
                        disabled={readOnly}
                        className="w-full bg-[#F7F9F7] border border-[#E2EBE4] rounded-lg px-2 py-2 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788] disabled:opacity-60"
                      >
                        <option value="">Select project</option>
                        {projects.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Phase dropdown */}
                    <td className="px-3 sm:px-4 py-2">
                      <select
                        value={row.phaseId}
                        onChange={(e) => updateRow(index, "phaseId", e.target.value)}
                        disabled={!row.projectId || readOnly}
                        className="w-full bg-[#F7F9F7] border border-[#E2EBE4] rounded-lg px-2 py-2 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788] disabled:opacity-50"
                      >
                        <option value="">Select phase</option>
                        {phases.map((phase) => (
                          <option key={phase.id} value={phase.id}>
                            {phase.name}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Day cells */}
                    {dates.map((date) => {
                      const key = formatKey(row.projectId, row.phaseId, date);
                      const isSaving = saving[key];
                      const isDisabled = !row.projectId || !row.phaseId || readOnly;

                      return (
                        <td key={date} className="px-1 py-2">
                          <input
                            type="number"
                            step="0.25"
                            min="0"
                            max="24"
                            value={isDisabled ? "" : (entries[key] ?? "")}
                            onChange={(e) =>
                              setEntries((prev) => ({
                                ...prev,
                                [key]: e.target.value,
                              }))
                            }
                            onBlur={() => handleBlur(row, date)}
                            disabled={isDisabled}
                            className={`w-14 text-center bg-[#F7F9F7] border rounded-lg px-1 py-2 text-sm outline-none transition-colors
                              ${isSaving ? "border-[#52B788] bg-[#F0FAF4]" : "border-[#E2EBE4]"}
                              focus:border-[#52B788] disabled:opacity-30`}
                          />
                        </td>
                      );
                    })}

                    {/* Row total */}
                    <td className="px-3 py-2 text-center font-semibold text-[#1A2E22]">
                      {rowTotals[index] > 0 ? rowTotals[index].toFixed(1) : "—"}
                    </td>

                    {/* Remove button */}
                    <td className="px-2 py-2">
                      {!readOnly && (
                        <button
                          type="button"
                          onClick={() => removeRow(index)}
                          className="text-[#A3BEA9] hover:text-rose-500 transition-colors p-1"
                          title="Remove row"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}

              {/* Empty state */}
              {rows.length === 0 && (
                <tr>
                  <td
                    colSpan={dates.length + 4}
                    className="px-6 py-10 text-center text-[#A3BEA9] text-sm"
                  >
                    No time entries yet. Click the + button to add a project and start logging hours.
                  </td>
                </tr>
              )}

              {/* Day totals footer */}
              {rows.length > 0 && (
                <tr className="bg-[#F7F9F7] border-t border-[#E2EBE4]">
                  <td colSpan={2} className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#6B8C74]">
                    Daily totals
                  </td>
                  {dayTotals.map((total, i) => (
                    <td key={dates[i]} className="px-1 py-3 text-center text-sm font-semibold text-[#3D5C48]">
                      {total > 0 ? total.toFixed(1) : "—"}
                    </td>
                  ))}
                  <td className="px-3 py-3 text-center text-sm font-bold text-[#1A2E22]">
                    {grandTotal > 0 ? grandTotal.toFixed(1) : "—"}
                  </td>
                  <td />
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add row button */}
      {!readOnly && (
        <button
          type="button"
          onClick={addRow}
          className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-[#F0FAF4] text-[#2D6A4F] border border-[#52B788]/30 hover:bg-[#2D6A4F] hover:text-white transition-all"
        >
          <Plus className="w-4 h-4" />
          Add time entry row
        </button>
      )}
    </div>
  );
}
