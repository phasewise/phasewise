"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Plus, Save, Trash2 } from "lucide-react";
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

  // Phase fields
  const [phases, setPhases] = useState<PhaseRow[]>([]);

  // Team members for work plan
  const [teamMembers, setTeamMembers] = useState<Array<{ id: string; fullName: string; billingRate: number }>>([]);

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
              <label className="text-sm font-medium text-[#3D5C48]">Project name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-2 w-full rounded-lg border border-[#E2EBE4] bg-[#F7F9F7] px-4 py-3 text-sm text-[#1A2E22] outline-none focus:border-[#52B788] focus:bg-white"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-[#3D5C48]">Project number</label>
                <input
                  value={projectNumber}
                  onChange={(e) => setProjectNumber(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-[#E2EBE4] bg-[#F7F9F7] px-4 py-3 text-sm text-[#1A2E22] outline-none focus:border-[#52B788] focus:bg-white"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[#3D5C48]">Status</label>
                <select
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
                <label className="text-sm font-medium text-[#3D5C48]">Client name</label>
                <input
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-[#E2EBE4] bg-[#F7F9F7] px-4 py-3 text-sm text-[#1A2E22] outline-none focus:border-[#52B788] focus:bg-white"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[#3D5C48]">Client email</label>
                <input
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-[#E2EBE4] bg-[#F7F9F7] px-4 py-3 text-sm text-[#1A2E22] outline-none focus:border-[#52B788] focus:bg-white"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-[#3D5C48]">Start date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-[#E2EBE4] bg-[#F7F9F7] px-4 py-3 text-sm text-[#1A2E22] outline-none focus:border-[#52B788] focus:bg-white"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[#3D5C48]">Target completion</label>
                <input
                  type="date"
                  value={targetCompletion}
                  onChange={(e) => setTargetCompletion(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-[#E2EBE4] bg-[#F7F9F7] px-4 py-3 text-sm text-[#1A2E22] outline-none focus:border-[#52B788] focus:bg-white"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-[#3D5C48]">Contract fee (optional)</label>
              <div className="relative mt-2">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A3BEA9] text-sm">$</span>
                <input
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
              <label className="text-sm font-medium text-[#3D5C48]">Description</label>
              <textarea
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
              <p className="text-sm text-[#6B8C74]">Manage project phases, budgets, and hours.</p>
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
            {phases.map((phase, index) => (
              <div
                key={phase.id || `new-${index}`}
                className="rounded-xl border border-[#E8EDE9] bg-[#F7F9F7] p-4"
              >
                <div className="grid gap-3 sm:grid-cols-[1fr_1fr_120px_120px_120px_40px] items-end">
                  <div>
                    <label className="text-xs font-medium text-[#6B8C74]">Phase type</label>
                    <select
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
                    <label className="text-xs font-medium text-[#6B8C74]">
                      {phase.phaseType === "OTHER" ? "Phase name *" : "Custom name (optional)"}
                    </label>
                    <input
                      value={phase.customName}
                      onChange={(e) => updatePhase(index, { customName: e.target.value })}
                      required={phase.phaseType === "OTHER"}
                      placeholder={phase.phaseType === "OTHER" ? "e.g., Site Analysis" : "Override name"}
                      className="mt-1 w-full bg-white border border-[#E2EBE4] rounded-lg px-3 py-2 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[#6B8C74]">Status</label>
                    <select
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
                    <label className="text-xs font-medium text-[#6B8C74]">Fee ($)</label>
                    <div className="relative mt-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A3BEA9] text-sm">$</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={phase.budgetedFee}
                        onChange={(e) => updatePhase(index, { budgetedFee: e.target.value })}
                        className="w-full bg-white border border-[#E2EBE4] rounded-lg pl-7 pr-3 py-2 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788]"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[#6B8C74]">Hours</label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      value={phase.budgetedHours}
                      onChange={(e) => updatePhase(index, { budgetedHours: e.target.value })}
                      className="mt-1 w-full bg-white border border-[#E2EBE4] rounded-lg px-3 py-2 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788]"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => removePhase(index)}
                      className="mt-5 text-[#A3BEA9] hover:text-rose-500 transition-colors p-1"
                      title="Remove phase"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {phases.length === 0 && (
              <div className="text-center py-8 text-[#A3BEA9] text-sm">
                No phases. Click &quot;Add phase&quot; to get started.
              </div>
            )}
          </div>
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
          />
        )}

        {error && <p className="text-sm text-[#B04030]">{error}</p>}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium bg-[#2D6A4F] text-white hover:bg-[#40916C] hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(45,106,79,0.3)] transition-all disabled:opacity-60"
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
