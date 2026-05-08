"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2, X } from "lucide-react";

type Project = {
  id: string;
  name: string;
  phases: Array<{ id: string; name: string }>;
};

type DayKey = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

type TemplateRow = {
  projectId: string;
  phaseId: string;
  hoursPerDay: Record<DayKey, number>;
};

const DAY_KEYS: DayKey[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const DAY_LABELS: Record<DayKey, string> = {
  mon: "Mon",
  tue: "Tue",
  wed: "Wed",
  thu: "Thu",
  fri: "Fri",
  sat: "Sat",
  sun: "Sun",
};

const EMPTY_HOURS: Record<DayKey, number> = {
  mon: 0,
  tue: 0,
  wed: 0,
  thu: 0,
  fri: 0,
  sat: 0,
  sun: 0,
};

type Props = {
  open: boolean;
  onClose: () => void;
  projects: Project[];
  initialTemplate: TemplateRow[];
  onSaved: () => void;
};

/**
 * Standalone editor for the user's weekly schedule template — Phase 2 of
 * the Apply Schedule feature. Lets the user tune hours per day, swap
 * phases, add or remove project rows without having to re-save from a
 * real week.
 *
 * The template is the same shape as what saveWeekAsTemplate produces,
 * so apply-template (which just reads the template and stamps entries
 * onto a draft week) keeps working unchanged.
 */
export default function ScheduleTemplateEditor({
  open,
  onClose,
  projects,
  initialTemplate,
  onSaved,
}: Props) {
  // Local working copy. Only commits to the server on Save.
  const [rows, setRows] = useState<TemplateRow[]>(() =>
    initialTemplate.length > 0
      ? initialTemplate.map((r) => ({
          ...r,
          hoursPerDay: { ...EMPTY_HOURS, ...r.hoursPerDay },
        }))
      : []
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Per-day totals at the bottom of the grid — common UX pattern that
  // makes mis-entered hours obvious (e.g. "Mon = 12" jumps out).
  const dayTotals = useMemo(() => {
    const totals = { ...EMPTY_HOURS };
    for (const r of rows) {
      for (const day of DAY_KEYS) {
        totals[day] += r.hoursPerDay[day] || 0;
      }
    }
    return totals;
  }, [rows]);

  const weekTotal = useMemo(
    () => DAY_KEYS.reduce((sum, d) => sum + dayTotals[d], 0),
    [dayTotals]
  );

  function addRow() {
    setRows((prev) => [
      ...prev,
      { projectId: "", phaseId: "", hoursPerDay: { ...EMPTY_HOURS } },
    ]);
  }

  function removeRow(index: number) {
    setRows((prev) => prev.filter((_, i) => i !== index));
  }

  function updateRow(index: number, patch: Partial<TemplateRow>) {
    setRows((prev) =>
      prev.map((r, i) => (i === index ? { ...r, ...patch } : r))
    );
  }

  function updateHours(index: number, day: DayKey, value: string) {
    const num = value === "" ? 0 : Number(value);
    if (Number.isNaN(num) || num < 0 || num > 24) return;
    setRows((prev) =>
      prev.map((r, i) =>
        i === index
          ? { ...r, hoursPerDay: { ...r.hoursPerDay, [day]: num } }
          : r
      )
    );
  }

  async function handleSave() {
    setError(null);

    // Drop empty rows (no project or phase selected) before sending.
    // The API also drops zero-hour rows — fine for it to filter again.
    const ready = rows.filter((r) => r.projectId && r.phaseId);

    setSaving(true);
    try {
      const res = await fetch("/api/timesheets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update-template", template: ready }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to save template.");
        return;
      }
      onSaved();
      onClose();
    } catch {
      setError("Network error saving template.");
    } finally {
      setSaving(false);
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white rounded-2xl border border-[#E2EBE4] shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2EBE4]">
          <div>
            <h2 className="font-serif text-2xl text-[#1A2E22]">Edit schedule template</h2>
            <p className="mt-1 text-xs text-[#6B8C74]">
              The Mon-Sun grid that fills in when you click <strong>Apply schedule</strong> on a draft week. Doesn&apos;t include leave or overhead.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-[#6B8C74] hover:bg-[#F7F9F7] hover:text-[#1A2E22]"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto px-6 py-4">
          {rows.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#E2EBE4] bg-[#F7F9F7] px-6 py-10 text-center">
              <p className="text-sm text-[#6B8C74]">
                No rows yet. Add a project + phase row to start building your template.
              </p>
              <button
                type="button"
                onClick={addRow}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-[#2D6A4F] text-white hover:bg-[#40916C] transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add first row
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#E8EDE9]">
                    <th className="py-2 px-2 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6B8C74]">
                      Project
                    </th>
                    <th className="py-2 px-2 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6B8C74]">
                      Phase
                    </th>
                    {DAY_KEYS.map((d) => (
                      <th
                        key={d}
                        className="py-2 px-1 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6B8C74] w-16"
                      >
                        {DAY_LABELS[d]}
                      </th>
                    ))}
                    <th className="py-2 px-2 text-right text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6B8C74] w-16">
                      Total
                    </th>
                    <th className="w-10" />
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => {
                    const project = projects.find((p) => p.id === row.projectId);
                    const phasesForProject = project?.phases ?? [];
                    const rowTotal = DAY_KEYS.reduce(
                      (sum, d) => sum + row.hoursPerDay[d],
                      0
                    );
                    return (
                      <tr key={i} className="border-b border-[#F0F2F0]">
                        <td className="py-2 px-2">
                          <select
                            aria-label="Project"
                            value={row.projectId}
                            onChange={(e) =>
                              updateRow(i, {
                                projectId: e.target.value,
                                // Clear phaseId when project changes — old
                                // phase belongs to a different project.
                                phaseId: "",
                              })
                            }
                            className="w-full bg-[#F7F9F7] border border-[#E2EBE4] rounded-md px-2 py-1.5 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788]"
                          >
                            <option value="">— Select project —</option>
                            {projects.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.name}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-2 px-2">
                          <select
                            aria-label="Phase"
                            value={row.phaseId}
                            onChange={(e) => updateRow(i, { phaseId: e.target.value })}
                            disabled={!row.projectId}
                            className="w-full bg-[#F7F9F7] border border-[#E2EBE4] rounded-md px-2 py-1.5 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788] disabled:opacity-60"
                          >
                            <option value="">— Phase —</option>
                            {phasesForProject.map((ph) => (
                              <option key={ph.id} value={ph.id}>
                                {ph.name}
                              </option>
                            ))}
                          </select>
                        </td>
                        {DAY_KEYS.map((d) => (
                          <td key={d} className="py-2 px-1">
                            <input
                              aria-label={`${DAY_LABELS[d]} hours`}
                              type="number"
                              step="0.25"
                              min="0"
                              max="24"
                              value={row.hoursPerDay[d] || ""}
                              onChange={(e) => updateHours(i, d, e.target.value)}
                              placeholder="0"
                              className="w-full text-center bg-[#F7F9F7] border border-[#E2EBE4] rounded-md px-1 py-1.5 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788]"
                            />
                          </td>
                        ))}
                        <td className="py-2 px-2 text-right font-medium text-[#1A2E22]">
                          {rowTotal.toFixed(rowTotal % 1 === 0 ? 0 : 2)}
                        </td>
                        <td className="py-2 pl-1">
                          <button
                            type="button"
                            onClick={() => removeRow(i)}
                            className="p-1.5 rounded-md text-[#A3BEA9] hover:text-rose-600 hover:bg-rose-50"
                            aria-label="Delete row"
                            title="Remove this row"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                {/* Totals row */}
                <tfoot>
                  <tr className="border-t-2 border-[#E8EDE9] bg-[#F7F9F7]/50">
                    <td colSpan={2} className="py-2 px-2 text-right text-xs uppercase tracking-[0.12em] text-[#6B8C74]">
                      Day totals
                    </td>
                    {DAY_KEYS.map((d) => (
                      <td
                        key={d}
                        className="py-2 px-1 text-center text-sm font-semibold text-[#1A2E22]"
                      >
                        {dayTotals[d] > 0
                          ? dayTotals[d].toFixed(dayTotals[d] % 1 === 0 ? 0 : 2)
                          : "—"}
                      </td>
                    ))}
                    <td className="py-2 px-2 text-right text-sm font-semibold text-[#2D6A4F]">
                      {weekTotal.toFixed(weekTotal % 1 === 0 ? 0 : 2)}
                    </td>
                    <td />
                  </tr>
                </tfoot>
              </table>

              <button
                type="button"
                onClick={addRow}
                className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold text-[#2D6A4F] hover:bg-[#F0FAF4]"
              >
                <Plus className="w-3.5 h-3.5" />
                Add row
              </button>
            </div>
          )}

          {error && (
            <div className="mt-4 rounded-lg bg-rose-50 border border-rose-200 px-3 py-2 text-xs text-rose-700">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-[#E2EBE4] bg-[#F7F9F7]/50">
          <p className="text-xs text-[#6B8C74]">
            {rows.length === 0
              ? "Empty templates clear the saved schedule."
              : `${rows.length} row${rows.length === 1 ? "" : "s"} · ${weekTotal.toFixed(weekTotal % 1 === 0 ? 0 : 2)} hours / week`}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2 rounded-lg text-sm font-medium border border-[#E2EBE4] bg-white text-[#1A2E22] hover:bg-[#F7F9F7] transition-colors disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2 rounded-lg text-sm font-semibold bg-[#2D6A4F] text-white hover:bg-[#40916C] transition-colors disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save template"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
