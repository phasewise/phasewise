"use client";

import { useState, useEffect } from "react";
import { AlertCircle, Plus, Save, Trash2 } from "lucide-react";

type StaffMember = {
  id: string;
  fullName: string;
  billingRate: number;
};

type PlanEntry = {
  userId: string;
  plannedHours: string;
};

type PhaseWorkPlan = {
  phaseId: string;
  phaseName: string;
  budgetedHours: number;
  budgetedFee: number;
  staff: PlanEntry[];
};

type Props = {
  projectId: string;
  phases: Array<{
    id: string;
    phaseName: string;
    budgetedHours: number;
    budgetedFee: number;
  }>;
  teamMembers: StaffMember[];
  onSaved?: () => void;
  onDirtyChange?: (dirty: boolean) => void;
};

export default function WorkPlanEditor({ projectId, phases, teamMembers, onSaved, onDirtyChange }: Props) {
  const [plan, setPlan] = useState<PhaseWorkPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  // Tracks whether the user has made edits since the last save. The
  // outer edit form reads this via onDirtyChange to warn the user before
  // a top-level "Save all changes" if the work plan was never saved
  // (which would lose those edits — the work plan saves separately).
  const [dirty, setDirty] = useState(false);

  function markDirty() {
    if (!dirty) {
      setDirty(true);
      onDirtyChange?.(true);
    }
    if (success) setSuccess(false);
  }

  // Load existing work plan
  useEffect(() => {
    fetch(`/api/projects/${projectId}/work-plan`)
      .then((res) => res.json())
      .then((data) => {
        if (data.phases) {
          setPlan(
            phases.map((p) => {
              const existing = data.phases.find(
                (dp: { id: string; workPlan: Array<{ userId: string; plannedHours: unknown }> }) => dp.id === p.id
              );
              return {
                phaseId: p.id,
                phaseName: p.phaseName,
                budgetedHours: p.budgetedHours,
                budgetedFee: p.budgetedFee,
                staff: existing?.workPlan?.map(
                  (wp: { userId: string; plannedHours: unknown }) => ({
                    userId: wp.userId,
                    plannedHours: String(wp.plannedHours),
                  })
                ) ?? [],
              };
            })
          );
        }
        setLoading(false);
      })
      .catch(() => {
        // Initialize with empty plan
        setPlan(
          phases.map((p) => ({
            phaseId: p.id,
            phaseName: p.phaseName,
            budgetedHours: p.budgetedHours,
            budgetedFee: p.budgetedFee,
            staff: [],
          }))
        );
        setLoading(false);
      });
  }, [projectId, phases]);

  function addStaffToPhase(phaseIndex: number) {
    markDirty();
    setPlan((prev) =>
      prev.map((p, i) =>
        i === phaseIndex
          ? { ...p, staff: [...p.staff, { userId: "", plannedHours: "" }] }
          : p
      )
    );
  }

  function removeStaffFromPhase(phaseIndex: number, staffIndex: number) {
    markDirty();
    setPlan((prev) =>
      prev.map((p, i) =>
        i === phaseIndex
          ? { ...p, staff: p.staff.filter((_, si) => si !== staffIndex) }
          : p
      )
    );
  }

  function updateStaffEntry(
    phaseIndex: number,
    staffIndex: number,
    field: "userId" | "plannedHours",
    value: string
  ) {
    markDirty();
    setPlan((prev) =>
      prev.map((p, i) =>
        i === phaseIndex
          ? {
              ...p,
              staff: p.staff.map((s, si) =>
                si === staffIndex ? { ...s, [field]: value } : s
              ),
            }
          : p
      )
    );
  }

  function getStaffRate(userId: string): number {
    return teamMembers.find((m) => m.id === userId)?.billingRate ?? 0;
  }

  function getPhaseWorkPlanCost(phase: PhaseWorkPlan): number {
    return phase.staff.reduce((sum, s) => {
      const hours = Number(s.plannedHours) || 0;
      const rate = getStaffRate(s.userId);
      return sum + hours * rate;
    }, 0);
  }

  function getPhaseWorkPlanHours(phase: PhaseWorkPlan): number {
    return phase.staff.reduce((sum, s) => sum + (Number(s.plannedHours) || 0), 0);
  }

  async function saveWorkPlan() {
    setError(null);
    setSaving(true);
    setSuccess(false);

    const res = await fetch(`/api/projects/${projectId}/work-plan`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        plan: plan.map((p) => ({
          phaseId: p.phaseId,
          staff: p.staff
            .filter((s) => s.userId && Number(s.plannedHours) > 0)
            .map((s) => ({
              userId: s.userId,
              plannedHours: Number(s.plannedHours),
            })),
        })),
      }),
    });

    setSaving(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Failed to save work plan.");
      return;
    }

    setSuccess(true);
    setDirty(false);
    onDirtyChange?.(false);
    setTimeout(() => setSuccess(false), 2000);
    onSaved?.();
  }

  if (loading) {
    return <p className="text-sm text-[#6B8C74]">Loading work plan...</p>;
  }

  // Save button label/style logic — same in every spot we render one.
  const saveLabel = saving
    ? "Saving Work Plan..."
    : success
    ? "Work Plan saved ✓"
    : dirty
    ? "Save Work Plan *"
    : "Save Work Plan";
  const saveButtonClass = `inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
    dirty
      ? "bg-amber-500 text-white hover:bg-amber-600 ring-2 ring-amber-200"
      : "bg-[#2D6A4F] text-white hover:bg-[#40916C]"
  }`;

  return (
    <div className="rounded-2xl border border-[#E2EBE4] bg-white p-6 sm:p-8 shadow-[0_4px_24px_rgba(26,46,34,0.04)]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-[#1A2E22]">Work Plan</h2>
          <p className="text-sm text-[#6B8C74]">
            Assign staff to each phase with planned hours.
            <span className="block mt-1 text-xs text-amber-700">
              <AlertCircle className="inline w-3 h-3 mr-1 -mt-0.5" />
              Click <strong>Save Work Plan</strong> here before <strong>Save all changes</strong> — work-plan edits save separately from project details.
            </span>
          </p>
        </div>
        <button
          type="button"
          onClick={saveWorkPlan}
          disabled={saving}
          className={saveButtonClass}
        >
          <Save className="w-4 h-4" />
          {saveLabel}
        </button>
      </div>

      {dirty && (
        <div className="mb-4 bg-amber-50 border border-amber-300 rounded-xl p-3 text-sm text-amber-900 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>
            You have unsaved Work Plan changes. Click <strong>Save Work Plan</strong> to commit them
            — otherwise <strong>Save all changes</strong> won&apos;t include the work plan edits.
          </span>
        </div>
      )}

      {error && (
        <div className="mb-4 bg-rose-50 border border-rose-200 rounded-xl p-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {plan.map((phase, phaseIndex) => {
          const totalCost = getPhaseWorkPlanCost(phase);
          const totalHours = getPhaseWorkPlanHours(phase);
          const overBudget = phase.budgetedFee > 0 && totalCost > phase.budgetedFee;

          return (
            <div key={phase.phaseId} className="rounded-xl border border-[#E8EDE9] bg-[#F7F9F7] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <h3 className="text-sm font-semibold text-[#1A2E22]">{phase.phaseName}</h3>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-[#6B8C74]">
                    Budget: {phase.budgetedHours}h · ${phase.budgetedFee.toLocaleString()}
                  </span>
                  <button
                    type="button"
                    onClick={saveWorkPlan}
                    disabled={saving}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors disabled:opacity-50 ${
                      dirty
                        ? "bg-amber-500 text-white hover:bg-amber-600"
                        : "bg-white text-[#2D6A4F] border border-[#52B788]/30 hover:bg-[#F0FAF4]"
                    }`}
                    title="Save the entire Work Plan (all phases) to the database"
                  >
                    <Save className="w-3 h-3" />
                    {saving ? "Saving..." : "Save Work Plan"}
                  </button>
                </div>
              </div>

              {/* Staff entries */}
              {phase.staff.map((entry, staffIndex) => {
                const rate = getStaffRate(entry.userId);
                const hours = Number(entry.plannedHours) || 0;
                const cost = hours * rate;

                return (
                  <div key={staffIndex} className="grid grid-cols-[1fr_100px_100px_32px] gap-2 mb-2 items-end">
                    <div>
                      {staffIndex === 0 && (
                        <label htmlFor={`wp-staff-${phase.phaseId}-${staffIndex}`} className="text-[10px] font-medium text-[#6B8C74] uppercase tracking-wider">Staff</label>
                      )}
                      <select
                        id={`wp-staff-${phase.phaseId}-${staffIndex}`}
                        aria-label="Staff member"
                        value={entry.userId}
                        onChange={(e) => updateStaffEntry(phaseIndex, staffIndex, "userId", e.target.value)}
                        className="mt-1 w-full bg-white border border-[#E2EBE4] rounded-lg px-2 py-2 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788]"
                      >
                        <option value="">Select staff</option>
                        {teamMembers.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.fullName} (${m.billingRate}/hr)
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      {staffIndex === 0 && (
                        <label htmlFor={`wp-hours-${phase.phaseId}-${staffIndex}`} className="text-[10px] font-medium text-[#6B8C74] uppercase tracking-wider">Hours</label>
                      )}
                      <input
                        id={`wp-hours-${phase.phaseId}-${staffIndex}`}
                        aria-label="Planned hours"
                        type="number"
                        step="0.5"
                        min="0"
                        value={entry.plannedHours}
                        onChange={(e) => updateStaffEntry(phaseIndex, staffIndex, "plannedHours", e.target.value)}
                        className="mt-1 w-full bg-white border border-[#E2EBE4] rounded-lg px-2 py-2 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788]"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      {staffIndex === 0 && (
                        <label className="text-[10px] font-medium text-[#6B8C74] uppercase tracking-wider">Cost</label>
                      )}
                      <div className="mt-1 px-2 py-2 text-sm text-[#1A2E22] font-medium">
                        ${cost.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={() => removeStaffFromPhase(phaseIndex, staffIndex)}
                        aria-label="Remove staff from phase"
                        className={`${staffIndex === 0 ? "mt-5" : ""} text-[#A3BEA9] hover:text-rose-500 transition-colors p-1`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Add staff button */}
              <button
                type="button"
                onClick={() => addStaffToPhase(phaseIndex)}
                className="mt-2 inline-flex items-center gap-1.5 text-xs text-[#2D6A4F] hover:text-[#40916C] font-medium transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add staff to this phase
              </button>

              {/* Phase work plan totals */}
              {phase.staff.length > 0 && (
                <div className="mt-3 pt-3 border-t border-[#E2EBE4] flex items-center justify-between text-xs">
                  <span className="text-[#6B8C74] font-medium">Phase total</span>
                  <span className={`font-semibold ${overBudget ? "text-rose-500" : "text-[#1A2E22]"}`}>
                    {totalHours.toFixed(1)}h · ${totalCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    {overBudget && " (over budget)"}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom save — same action, but prominent so the user doesn't have
          to scroll back up after a long edit session. */}
      {plan.length > 0 && (
        <div className="mt-6 pt-5 border-t border-[#E2EBE4] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <p className="text-xs text-[#6B8C74]">
            {dirty
              ? "Unsaved changes. Click below to save the Work Plan before continuing."
              : "Work Plan is up to date."}
          </p>
          <button
            type="button"
            onClick={saveWorkPlan}
            disabled={saving}
            className={saveButtonClass}
          >
            <Save className="w-4 h-4" />
            {saveLabel}
          </button>
        </div>
      )}
    </div>
  );
}
