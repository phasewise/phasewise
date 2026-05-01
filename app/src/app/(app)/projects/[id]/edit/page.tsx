"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { AlertCircle, ArrowLeft, Plus, Save, Trash2 } from "lucide-react";
import { PHASE_LABELS, PHASE_ORDER } from "@/lib/constants";
import WorkPlanEditor from "./WorkPlanEditor";

type PhaseRow = {
  id?: string; // undefined = new phase
  phaseType: string;
  customName: string;
  status: string;
  budgetedFee: string;
  budgetedHours: string;
  sortOrder: number;
};

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Project fields
  const [name, setName] = useState("");
  const [projectNumber, setProjectNumber] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [status, setStatus] = useState("ACTIVE");
  const [startDate, setStartDate] = useState("");
  const [targetCompletion, setTargetCompletion] = useState("");
  const [contractFee, setContractFee] = useState("");
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("");
  const [projectType, setProjectType] = useState("");

  // Phase fields
  const [phases, setPhases] = useState<PhaseRow[]>([]);

  // Team members for work plan
  const [teamMembers, setTeamMembers] = useState<Array<{ id: string; fullName: string; billingRate: number }>>([]);

  // Org-managed project type list (Settings → Project types).
  const [projectTypeOptions, setProjectTypeOptions] = useState<string[]>([]);
  useEffect(() => {
    fetch("/api/projects/types")
      .then((r) => r.json())
      .then((d) => setProjectTypeOptions(Array.isArray(d.types) ? d.types : []))
      .catch(() => {});
  }, []);

  // True when WorkPlanEditor has unsaved edits. We use this to warn the
  // user (and require an explicit confirm) on Save all changes — work
  // plan saves to its own endpoint, so a top-level submit silently drops
  // any in-flight work-plan edits if not committed first.
  const [workPlanDirty, setWorkPlanDirty] = useState(false);

  useEffect(() => {
    // Fetch team members for the work plan editor
    fetch("/api/team/members/list")
      .then((res) => res.json())
      .then((data) => {
        if (data.members) setTeamMembers(data.members);
      })
      .catch(() => {});

    fetch(`/api/projects/${projectId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load project");
        return res.json();
      })
      .then((data) => {
        const p = data.project;
        setName(p.name || "");
        setProjectNumber(p.projectNumber || "");
        setClientName(p.clientName || "");
        setClientEmail(p.clientEmail || "");
        setStatus(p.status || "ACTIVE");
        setStartDate(p.startDate ? p.startDate.split("T")[0] : "");
        setTargetCompletion(p.targetCompletion ? p.targetCompletion.split("T")[0] : "");
        setContractFee(p.contractFee ? String(p.contractFee) : "");
        setDescription(p.description || "");
        setCity(p.city || "");
        setProjectType(p.projectType || "");
        setPhases(
          (p.phases || []).map((phase: { id: string; phaseType: string; customName?: string | null; status: string; budgetedFee: string | number | null; budgetedHours: string | number | null; sortOrder: number }) => ({
            id: phase.id,
            phaseType: phase.phaseType,
            customName: phase.customName || "",
            status: phase.status,
            budgetedFee: phase.budgetedFee ? String(phase.budgetedFee) : "",
            budgetedHours: phase.budgetedHours ? String(phase.budgetedHours) : "",
            sortOrder: phase.sortOrder,
          }))
        );
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load project data.");
        setLoading(false);
      });
  }, [projectId]);

  // Called by WorkPlanEditor after a successful save so the read-only
  // fee/hours cells (and the Work Plan estimate totals bar) reflect
  // the newly-synced phase budgets without a full page refresh.
  async function refreshPhaseBudgets() {
    const res = await fetch(`/api/projects/${projectId}`);
    if (!res.ok) return;
    const data = await res.json();
    const fresh = data.project?.phases ?? [];
    setPhases((prev) =>
      prev.map((p) => {
        const match = fresh.find((fp: { id: string }) => fp.id === p.id);
        if (!match) return p;
        return {
          ...p,
          budgetedFee: match.budgetedFee ? String(match.budgetedFee) : "",
          budgetedHours: match.budgetedHours ? String(match.budgetedHours) : "",
        };
      })
    );
  }

  function updatePhase(index: number, update: Partial<PhaseRow>) {
    setPhases((prev) =>
      prev.map((p, i) => (i === index ? { ...p, ...update } : p))
    );
  }

  function addPhase() {
    // Find a phase type not already in use, default to OTHER for fully custom
    const usedTypes = new Set(phases.map((p) => p.phaseType));
    const availableType = PHASE_ORDER.find((t) => !usedTypes.has(t)) || "OTHER";
    setPhases((prev) => [
      ...prev,
      {
        phaseType: availableType,
        customName: availableType === "OTHER" ? "" : "",
        status: "NOT_STARTED",
        budgetedFee: "",
        budgetedHours: "",
        sortOrder: prev.length,
      },
    ]);
  }

  function removePhase(index: number) {
    setPhases((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Block top-level submit when the Work Plan has unsaved edits.
    // The work plan saves through its own endpoint; if the user clicks
    // "Save all changes" without saving the work plan first, those
    // edits are silently lost.
    if (workPlanDirty) {
      const proceed = confirm(
        "Your Work Plan has unsaved changes that will be LOST if you continue.\n\n" +
        "Click Cancel, then click 'Save Work Plan' first to keep those edits.\n\n" +
        "Continue anyway and discard Work Plan changes?"
      );
      if (!proceed) return;
    }

    setError("");
    setSaving(true);
    setSuccess(false);

    // Save project details
    const projectRes = await fetch(`/api/projects/${projectId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        projectNumber,
        clientName,
        clientEmail,
        status,
        startDate: startDate || null,
        targetCompletion: targetCompletion || null,
        contractFee: contractFee === "" ? null : contractFee,
        description,
        city,
        projectType,
      }),
    });

    if (!projectRes.ok) {
      const data = await projectRes.json();
      setError(data.error || "Failed to update project.");
      setSaving(false);
      return;
    }

    // Save phases
    const phasesRes = await fetch(`/api/projects/${projectId}/phases`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phases }),
    });

    if (!phasesRes.ok) {
      const data = await phasesRes.json();
      setError(data.error || "Failed to update phases.");
      setSaving(false);
      return;
    }

    setSaving(false);
    setSuccess(true);
    setTimeout(() => {
      router.push(`/projects/${projectId}`);
      router.refresh();
    }, 800);
  }

  if (loading) {
    return (
      <div className="p-6 sm:p-8">
        <p className="text-[#6B8C74] text-sm">Loading project...</p>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 max-w-3xl">
      <div className="flex items-center gap-3 mb-8">
        <Link
          href={`/projects/${projectId}`}
          className="inline-flex items-center gap-2 text-sm text-[#6B8C74] hover:text-[#1A2E22]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to project
        </Link>
      </div>

      <h1 className="font-serif text-3xl text-[#1A2E22] mb-6">Edit project</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Project details */}
        <div className="rounded-2xl border border-[#E2EBE4] bg-white p-6 sm:p-8 shadow-[0_4px_24px_rgba(26,46,34,0.04)]">
          <h2 className="text-lg font-semibold text-[#1A2E22] mb-4">Project details</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="pedit-name" className="text-sm font-medium text-[#3D5C48]">Project name</label>
              <input
                id="pedit-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-2 w-full rounded-lg border border-[#E2EBE4] bg-[#F7F9F7] px-4 py-3 text-sm text-[#1A2E22] outline-none focus:border-[#52B788] focus:bg-white"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="pedit-project-number" className="text-sm font-medium text-[#3D5C48]">Project number</label>
                <input
                  id="pedit-project-number"
                  value={projectNumber}
                  onChange={(e) => setProjectNumber(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-[#E2EBE4] bg-[#F7F9F7] px-4 py-3 text-sm text-[#1A2E22] outline-none focus:border-[#52B788] focus:bg-white"
                />
              </div>
              <div>
                <label htmlFor="pedit-status" className="text-sm font-medium text-[#3D5C48]">Status</label>
                <select
                  id="pedit-status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-[#E2EBE4] bg-[#F7F9F7] px-4 py-3 text-sm text-[#1A2E22] outline-none focus:border-[#52B788] focus:bg-white"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="ON_HOLD">On hold</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="pedit-client-name" className="text-sm font-medium text-[#3D5C48]">Client name</label>
                <input
                  id="pedit-client-name"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  autoComplete="organization"
                  className="mt-2 w-full rounded-lg border border-[#E2EBE4] bg-[#F7F9F7] px-4 py-3 text-sm text-[#1A2E22] outline-none focus:border-[#52B788] focus:bg-white"
                />
              </div>
              <div>
                <label htmlFor="pedit-client-email" className="text-sm font-medium text-[#3D5C48]">Client email</label>
                <input
                  id="pedit-client-email"
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  autoComplete="email"
                  className="mt-2 w-full rounded-lg border border-[#E2EBE4] bg-[#F7F9F7] px-4 py-3 text-sm text-[#1A2E22] outline-none focus:border-[#52B788] focus:bg-white"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="pedit-start-date" className="text-sm font-medium text-[#3D5C48]">Start date</label>
                <input
                  id="pedit-start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-[#E2EBE4] bg-[#F7F9F7] px-4 py-3 text-sm text-[#1A2E22] outline-none focus:border-[#52B788] focus:bg-white"
                />
              </div>
              <div>
                <label htmlFor="pedit-target-completion" className="text-sm font-medium text-[#3D5C48]">Target completion</label>
                <input
                  id="pedit-target-completion"
                  type="date"
                  value={targetCompletion}
                  onChange={(e) => setTargetCompletion(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-[#E2EBE4] bg-[#F7F9F7] px-4 py-3 text-sm text-[#1A2E22] outline-none focus:border-[#52B788] focus:bg-white"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="pedit-city" className="text-sm font-medium text-[#3D5C48]">City</label>
                <input
                  id="pedit-city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g., Fresno"
                  autoComplete="address-level2"
                  className="mt-2 w-full rounded-lg border border-[#E2EBE4] bg-[#F7F9F7] px-4 py-3 text-sm text-[#1A2E22] outline-none focus:border-[#52B788] focus:bg-white"
                />
              </div>
              <div>
                <label htmlFor="pedit-project-type" className="text-sm font-medium text-[#3D5C48]">Project type</label>
                <input
                  id="pedit-project-type"
                  list="pedit-project-type-suggestions"
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  placeholder="Residential / Commercial / Public / Entry monument / …"
                  className="mt-2 w-full rounded-lg border border-[#E2EBE4] bg-[#F7F9F7] px-4 py-3 text-sm text-[#1A2E22] outline-none focus:border-[#52B788] focus:bg-white"
                />
                {/* Datalist sourced from /settings/project-types so each
                    firm controls its own taxonomy. Free text still
                    allowed for one-off types. */}
                <datalist id="pedit-project-type-suggestions">
                  {projectTypeOptions.map((t) => (
                    <option key={t} value={t} />
                  ))}
                </datalist>
              </div>
            </div>
            <div>
              <label htmlFor="pedit-contract-fee" className="text-sm font-medium text-[#3D5C48]">Contract fee (optional)</label>
              <div className="relative mt-2">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A3BEA9] text-sm">$</span>
                <input
                  id="pedit-contract-fee"
                  type="number"
                  min="0"
                  step="0.01"
                  value={contractFee}
                  onChange={(e) => setContractFee(e.target.value)}
                  placeholder="Total fee agreed with the client"
                  className="w-full rounded-lg border border-[#E2EBE4] bg-[#F7F9F7] pl-8 pr-4 py-3 text-sm text-[#1A2E22] outline-none focus:border-[#52B788] focus:bg-white"
                />
              </div>
              <p className="mt-1 text-xs text-[#A3BEA9]">
                Ceiling to compare against your Work Plan estimate.
              </p>
            </div>
            <div>
              <label htmlFor="pedit-description" className="text-sm font-medium text-[#3D5C48]">Description</label>
              <textarea
                id="pedit-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="mt-2 w-full rounded-lg border border-[#E2EBE4] bg-[#F7F9F7] px-4 py-3 text-sm text-[#1A2E22] outline-none focus:border-[#52B788] focus:bg-white resize-y"
              />
            </div>
          </div>
        </div>

        {/* Phases */}
        <div className="rounded-2xl border border-[#E2EBE4] bg-white p-6 sm:p-8 shadow-[0_4px_24px_rgba(26,46,34,0.04)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-[#1A2E22]">Phases</h2>
              <p className="text-sm text-[#6B8C74]">
                Hours and fees roll up automatically from the Work Plan below.
              </p>
            </div>
            <button
              type="button"
              onClick={addPhase}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-[#F0FAF4] text-[#2D6A4F] border border-[#52B788]/30 hover:bg-[#2D6A4F] hover:text-white transition-all"
            >
              <Plus className="w-4 h-4" />
              Add phase
            </button>
          </div>

          <div className="space-y-3">
            {phases.map((phase, index) => {
              const rowKey = phase.id || `new-${index}`;
              return (
              <div
                key={rowKey}
                className="rounded-xl border border-[#E8EDE9] bg-[#F7F9F7] p-4"
              >
                <div className="grid gap-3 sm:grid-cols-[1fr_1fr_140px_100px_120px_40px] items-end">
                  <div>
                    <label htmlFor={`pedit-phase-type-${rowKey}`} className="text-xs font-medium text-[#6B8C74]">Phase type</label>
                    <select
                      id={`pedit-phase-type-${rowKey}`}
                      value={phase.phaseType}
                      onChange={(e) => updatePhase(index, {
                        phaseType: e.target.value,
                        customName: e.target.value === "OTHER" ? phase.customName : "",
                      })}
                      className="mt-1 w-full bg-white border border-[#E2EBE4] rounded-lg px-3 py-2 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788]"
                    >
                      {PHASE_ORDER.map((type) => (
                        <option key={type} value={type}>
                          {PHASE_LABELS[type]}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor={`pedit-phase-custom-name-${rowKey}`} className="text-xs font-medium text-[#6B8C74]">
                      {phase.phaseType === "OTHER" ? "Phase name *" : "Custom name (optional)"}
                    </label>
                    <input
                      id={`pedit-phase-custom-name-${rowKey}`}
                      value={phase.customName}
                      onChange={(e) => updatePhase(index, { customName: e.target.value })}
                      required={phase.phaseType === "OTHER"}
                      placeholder={phase.phaseType === "OTHER" ? "e.g., Site Analysis" : "Override name"}
                      className="mt-1 w-full bg-white border border-[#E2EBE4] rounded-lg px-3 py-2 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788]"
                    />
                  </div>
                  <div>
                    <label htmlFor={`pedit-phase-status-${rowKey}`} className="text-xs font-medium text-[#6B8C74]">Status</label>
                    <select
                      id={`pedit-phase-status-${rowKey}`}
                      value={phase.status}
                      onChange={(e) => updatePhase(index, { status: e.target.value })}
                      className="mt-1 w-full bg-white border border-[#E2EBE4] rounded-lg px-3 py-2 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788]"
                    >
                      <option value="NOT_STARTED">Not started</option>
                      <option value="IN_PROGRESS">In progress</option>
                      <option value="COMPLETE">Complete</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[#6B8C74]">Hours</label>
                    <div className="mt-1 w-full rounded-lg bg-white border border-dashed border-[#E2EBE4] px-3 py-2 text-sm text-[#3D5C48] text-right">
                      {Number(phase.budgetedHours || 0).toFixed(1)}h
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[#6B8C74]">Fee</label>
                    <div className="mt-1 w-full rounded-lg bg-white border border-dashed border-[#E2EBE4] px-3 py-2 text-sm text-[#3D5C48] text-right">
                      ${Number(phase.budgetedFee || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </div>
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => removePhase(index)}
                      aria-label="Remove phase"
                      className="mt-5 text-[#A3BEA9] hover:text-rose-500 transition-colors p-1"
                      title="Remove phase"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              );
            })}
            {phases.length === 0 && (
              <div className="text-center py-8 text-[#A3BEA9] text-sm">
                No phases. Click &quot;Add phase&quot; to get started.
              </div>
            )}
          </div>

          {phases.length > 0 && (
            <div className="mt-4 flex items-center justify-between rounded-xl bg-[#F0FAF4] border border-[#52B788]/20 px-4 py-3">
              <span className="text-xs uppercase tracking-[0.18em] text-[#2D6A4F] font-semibold">
                Work Plan estimate
              </span>
              <div className="text-sm font-semibold text-[#1A2E22]">
                {phases.reduce((sum, p) => sum + (Number(p.budgetedHours) || 0), 0).toFixed(1)}h
                <span className="mx-2 text-[#A3BEA9]">·</span>
                ${phases
                  .reduce((sum, p) => sum + (Number(p.budgetedFee) || 0), 0)
                  .toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
            </div>
          )}
        </div>

        {/* Work Plan */}
        <div id="work-plan" />
        {phases.length > 0 && phases.some((p) => p.id) && teamMembers.length > 0 && (
          <WorkPlanEditor
            projectId={projectId}
            phases={phases
              .filter((p) => p.id)
              .map((p) => ({
                id: p.id!,
                phaseName: PHASE_LABELS[p.phaseType] ?? p.phaseType,
                budgetedHours: Number(p.budgetedHours) || 0,
                budgetedFee: Number(p.budgetedFee) || 0,
              }))}
            teamMembers={teamMembers}
            onSaved={refreshPhaseBudgets}
            onDirtyChange={setWorkPlanDirty}
          />
        )}

        {error && <p className="text-sm text-[#B04030]">{error}</p>}

        {workPlanDirty && (
          <div className="rounded-xl bg-amber-50 border border-amber-300 p-3 text-sm text-amber-900 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>
              Work Plan has unsaved edits. Click <strong>Save Work Plan</strong> in the section
              above before <strong>Save all changes</strong>, or those edits will be lost.
            </span>
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all disabled:opacity-60 ${
              workPlanDirty
                ? "bg-[#A3BEA9] text-white cursor-help hover:bg-[#6B8C74]"
                : "bg-[#2D6A4F] text-white hover:bg-[#40916C] hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(45,106,79,0.3)]"
            }`}
            title={workPlanDirty ? "Save the Work Plan first to include those edits" : undefined}
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : success ? "Saved ✓" : "Save all changes"}
          </button>
          <Link
            href={`/projects/${projectId}`}
            className="px-6 py-3 rounded-lg text-sm text-[#6B8C74] hover:text-[#1A2E22] transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
