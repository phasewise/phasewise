"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2, CalendarDays, Copy, Briefcase } from "lucide-react";
import { LEAVE_TYPE_LABELS, LEAVE_TYPES } from "@/lib/leave";

const OVERHEAD_CATEGORIES = [
  "GENERAL_ADMIN",
  "MARKETING",
  "PROFESSIONAL_DEVELOPMENT",
  "MEETINGS",
  "BUSINESS_DEVELOPMENT",
  "IT_EQUIPMENT",
] as const;

const OVERHEAD_LABELS: Record<string, string> = {
  GENERAL_ADMIN: "General Admin",
  MARKETING: "Marketing",
  PROFESSIONAL_DEVELOPMENT: "Training / PD",
  MEETINGS: "Meetings",
  BUSINESS_DEVELOPMENT: "Business Dev",
  IT_EQUIPMENT: "IT / Equipment",
};

type Project = {
  id: string;
  name: string;
  phases: Array<{ id: string; name: string }>;
};

type Row = { projectId: string; phaseId: string; leaveType?: string; overheadCategory?: string };

type Props = {
  projects: Project[];
  dates: string[];
  dateLabels: string[];
  initialEntries: Record<string, string>;
  initialRows: Row[];
  previousWeekRows?: Row[];
  readOnly?: boolean;
};

const isLeaveRow = (row: Row) => !!row.leaveType;
const isOverheadRow = (row: Row) => !!row.overheadCategory;

const formatKey = (row: Row, date: string) =>
  isLeaveRow(row)
    ? `LEAVE:${row.leaveType}:${date}`
    : isOverheadRow(row)
    ? `OVERHEAD:${row.overheadCategory}:${date}`
    : `${row.projectId}:${row.phaseId}:${date}`;

export default function TimeSheetClient({
  projects,
  dates,
  dateLabels,
  initialEntries,
  initialRows,
  previousWeekRows = [],
  readOnly = false,
}: Props) {
  const [rows, setRows] = useState<Row[]>(
    initialRows.length > 0 ? initialRows : []
  );
  const [entries, setEntries] = useState<Record<string, string>>(initialEntries);
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);

  function getPhasesForProject(projectId: string) {
    return projects.find((p) => p.id === projectId)?.phases ?? [];
  }

  function addRow() {
    setRows((prev) => [...prev, { projectId: "", phaseId: "" }]);
  }

  function addLeaveRow() {
    setRows((prev) => [...prev, { projectId: "", phaseId: "", leaveType: "VACATION" }]);
  }

  function addOverheadRow() {
    setRows((prev) => [...prev, { projectId: "", phaseId: "", overheadCategory: "GENERAL_ADMIN" }]);
  }

  function updateOverheadCategory(index: number, value: string) {
    setRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, overheadCategory: value } : row))
    );
  }

  function copyFromPreviousWeek() {
    const rowKey = (r: Row) =>
      r.leaveType ? `LEAVE:${r.leaveType}` : r.overheadCategory ? `OVERHEAD:${r.overheadCategory}` : `${r.projectId}:${r.phaseId}`;
    setRows((prev) => {
      const existing = new Set(prev.map(rowKey));
      const toAdd = previousWeekRows.filter((r) => !existing.has(rowKey(r)));
      return [...prev, ...toAdd];
    });
  }

  function removeRow(index: number) {
    setRows((prev) => prev.filter((_, i) => i !== index));
  }

  function updateLeaveType(index: number, value: string) {
    setRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, leaveType: value } : row))
    );
  }

  function updateRow(index: number, field: "projectId" | "phaseId", value: string) {
    setRows((prev) =>
      prev.map((row, i) => {
        if (i !== index) return row;
        if (field === "projectId") {
          return { projectId: value, phaseId: "" };
        }
        return { ...row, [field]: value };
      })
    );
  }

  const rowIsComplete = (row: Row) =>
    isLeaveRow(row) ? !!row.leaveType : isOverheadRow(row) ? !!row.overheadCategory : !!row.projectId && !!row.phaseId;

  // Calculate totals
  const rowTotals = useMemo(
    () =>
      rows.map((row) =>
        rowIsComplete(row)
          ? dates.reduce(
              (sum, date) => sum + Number(entries[formatKey(row, date)] || 0),
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
            rowIsComplete(row)
              ? sum + Number(entries[formatKey(row, date)] || 0)
              : sum,
          0
        )
      ),
    [rows, dates, entries]
  );

  const grandTotal = dayTotals.reduce((sum, v) => sum + v, 0);

  // Save a single cell to the API
  async function handleBlur(row: Row, date: string) {
    if (!rowIsComplete(row)) return;

    const key = formatKey(row, date);
    const value = (entries[key] ?? "").trim();
    const parsedHours = value === "" ? 0 : Number(value);

    if (Number.isNaN(parsedHours) || parsedHours < 0) {
      setError("Hours must be a positive number.");
      return;
    }

    setError(null);
    setSaving((prev) => ({ ...prev, [key]: true }));

    try {
      const body = isLeaveRow(row)
        ? { leaveType: row.leaveType, date, hours: parsedHours }
        : isOverheadRow(row)
        ? { overheadCategory: row.overheadCategory, date, hours: parsedHours }
        : {
            projectId: row.projectId,
            phaseId: row.phaseId,
            date,
            hours: parsedHours,
          };
      const res = await fetch("/api/time", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
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
                const leaveRow = isLeaveRow(row);

                return (
                  <tr key={index} className="border-b border-[#E8EDE9] last:border-0">
                    {/* Project / leave-type / overhead cell */}
                    <td className="px-3 sm:px-4 py-2">
                      {leaveRow ? (
                        <div className="inline-flex items-center gap-2 rounded-lg bg-[#F0FAF4] border border-[#52B788]/30 px-2 py-2 text-sm text-[#2D6A4F] font-medium">
                          <CalendarDays className="w-4 h-4" />
                          Leave
                        </div>
                      ) : isOverheadRow(row) ? (
                        <div className="inline-flex items-center gap-2 rounded-lg bg-[#FAF6EF] border border-[#C9A87C]/30 px-2 py-2 text-sm text-[#8B6914] font-medium">
                          <Briefcase className="w-4 h-4" />
                          Overhead
                        </div>
                      ) : (
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
                      )}
                    </td>

                    {/* Phase / leave-subtype / overhead-category cell */}
                    <td className="px-3 sm:px-4 py-2">
                      {leaveRow ? (
                        <select
                          value={row.leaveType ?? ""}
                          onChange={(e) => updateLeaveType(index, e.target.value)}
                          disabled={readOnly}
                          className="w-full bg-[#F7F9F7] border border-[#E2EBE4] rounded-lg px-2 py-2 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788] disabled:opacity-60"
                        >
                          {LEAVE_TYPES.map((t) => (
                            <option key={t} value={t}>
                              {LEAVE_TYPE_LABELS[t]}
                            </option>
                          ))}
                        </select>
                      ) : isOverheadRow(row) ? (
                        <select
                          value={row.overheadCategory ?? ""}
                          onChange={(e) => updateOverheadCategory(index, e.target.value)}
                          disabled={readOnly}
                          className="w-full bg-[#F7F9F7] border border-[#E2EBE4] rounded-lg px-2 py-2 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788] disabled:opacity-60"
                        >
                          {OVERHEAD_CATEGORIES.map((c) => (
                            <option key={c} value={c}>
                              {OVERHEAD_LABELS[c]}
                            </option>
                          ))}
                        </select>
                      ) : row.projectId && phases.length === 0 ? (
                        <div
                          className="w-full rounded-lg border border-amber-200 bg-amber-50 px-2 py-2 text-xs text-amber-700"
                          title="Edit this project to add phases before logging time"
                        >
                          No phases — add in project settings
                        </div>
                      ) : (
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
                      )}
                    </td>

                    {/* Day cells */}
                    {dates.map((date) => {
                      const key = formatKey(row, date);
                      const isSaving = saving[key];
                      const isDisabled = !rowIsComplete(row) || readOnly;

                      return (
                        <td key={date} className="px-1 py-2">
                          <input
                            type="number"
                            step="0.25"
                            min="0"
                            max="24"
                            // Always show the saved entry value — even on
                            // approved/future-blocked weeks. Previously this
                            // forced "" when disabled, making approved
                            // entries appear to vanish even though they
                            // were still in the database. Empty rows
                            // (incomplete project/phase) still render
                            // empty since rowIsComplete is false.
                            value={rowIsComplete(row) ? (entries[key] ?? "") : ""}
                            onChange={(e) =>
                              setEntries((prev) => ({
                                ...prev,
                                [key]: e.target.value,
                              }))
                            }
                            onBlur={() => handleBlur(row, date)}
                            disabled={isDisabled}
                            // disabled:opacity-60 (was 30) so read-only
                            // values stay legible. They're not editable
                            // but they still need to be readable for
                            // someone reviewing the week.
                            className={`w-14 text-center bg-[#F7F9F7] border rounded-lg px-1 py-2 text-sm outline-none transition-colors
                              ${isSaving ? "border-[#52B788] bg-[#F0FAF4]" : "border-[#E2EBE4]"}
                              focus:border-[#52B788] disabled:opacity-60 disabled:text-[#3D5C48]`}
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
                          aria-label="Remove row"
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

      {/* Add row buttons */}
      {!readOnly && (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={addRow}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-[#F0FAF4] text-[#2D6A4F] border border-[#52B788]/30 hover:bg-[#2D6A4F] hover:text-white transition-all"
          >
            <Plus className="w-4 h-4" />
            Add time entry row
          </button>
          <button
            type="button"
            onClick={addLeaveRow}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-white text-[#6B8C74] border border-[#E2EBE4] hover:border-[#52B788] hover:text-[#2D6A4F] transition-all"
          >
            <CalendarDays className="w-4 h-4" />
            Add leave / PTO
          </button>
          <button
            type="button"
            onClick={addOverheadRow}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-white text-[#6B8C74] border border-[#E2EBE4] hover:border-[#C9A87C] hover:text-[#8B6914] transition-all"
          >
            <Briefcase className="w-4 h-4" />
            Add overhead / admin
          </button>
          {previousWeekRows.length > 0 && (
            <button
              type="button"
              onClick={copyFromPreviousWeek}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-white text-[#6B8C74] border border-[#E2EBE4] hover:border-[#52B788] hover:text-[#2D6A4F] transition-all"
              title="Add the same projects and leave rows you used last week (hours start at 0)"
            >
              <Copy className="w-4 h-4" />
              Copy rows from last week
            </button>
          )}
        </div>
      )}
    </div>
  );
}
