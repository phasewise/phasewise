"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, FolderPlus, RefreshCw } from "lucide-react";
import { PHASE_LABELS, PHASE_ORDER } from "@/lib/constants";

const defaultPhases = PHASE_ORDER.map((phase, index) => ({
  phaseType: phase,
  label: PHASE_LABELS[phase],
  selected: true,
  budgetedFee: "",
  budgetedHours: "",
  sortOrder: index,
}));

type PhaseRow = (typeof defaultPhases)[number];

export default function NewProjectPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [projectNumber, setProjectNumber] = useState("");
  const [autoNumber, setAutoNumber] = useState("");
  const [isCustomNumber, setIsCustomNumber] = useState(false);

  // Fetch the next sequential project number on page load
  useEffect(() => {
    fetch("/api/projects/next-number")
      .then((res) => res.json())
      .then((data) => {
        if (data.nextNumber) {
          setAutoNumber(data.nextNumber);
          setProjectNumber(data.nextNumber);
        }
      })
      .catch(() => {
        // Silently fail — user can still enter their own number
      });
  }, []);
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [startDate, setStartDate] = useState("");
  const [targetCompletion, setTargetCompletion] = useState("");
  const [status, setStatus] = useState("ACTIVE");
  const [phases, setPhases] = useState<PhaseRow[]>(defaultPhases);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const selectedPhaseCount = useMemo(
    () => phases.filter((phase) => phase.selected).length,
    [phases]
  );

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setIsSaving(true);

    const response = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        projectNumber,
        clientName,
        clientEmail,
        status,
        startDate,
        targetCompletion,
        phases,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      setError(result?.error || "Failed to create project.");
      setIsSaving(false);
      return;
    }

    router.push(`/projects/${result.projectId}`);
  }

  function updatePhase(index: number, update: Partial<PhaseRow>) {
    setPhases((current) =>
      current.map((phase, idx) =>
        idx === index ? { ...phase, ...update } : phase
      )
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-8 text-slate-800">
        <Link href="/projects" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900">
          <ArrowLeft className="h-4 w-4" />
          Back to projects
        </Link>
        <h1 className="text-3xl font-semibold">New project</h1>
      </div>

      <div className="grid gap-8 xl:grid-cols-[1fr_420px]">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700">Project name</label>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-slate-700">Project number</label>
                  <div className="relative mt-2">
                    <input
                      value={projectNumber}
                      onChange={(event) => {
                        setProjectNumber(event.target.value);
                        setIsCustomNumber(event.target.value !== autoNumber);
                      }}
                      placeholder={autoNumber || "PW-001"}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500 pr-10"
                    />
                    {isCustomNumber && autoNumber && (
                      <button
                        type="button"
                        onClick={() => {
                          setProjectNumber(autoNumber);
                          setIsCustomNumber(false);
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors"
                        title="Reset to auto-generated number"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  {!isCustomNumber && autoNumber && (
                    <p className="mt-1 text-xs text-slate-400">Auto-generated. Edit to use your own.</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Status</label>
                  <select
                    value={status}
                    onChange={(event) => setStatus(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500"
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
                  <label className="text-sm font-medium text-slate-700">Client name</label>
                  <input
                    value={clientName}
                    onChange={(event) => setClientName(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Client email</label>
                  <input
                    value={clientEmail}
                    type="email"
                    onChange={(event) => setClientEmail(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-slate-700">Start date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(event) => setStartDate(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Target completion</label>
                  <input
                    type="date"
                    value={targetCompletion}
                    onChange={(event) => setTargetCompletion(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Phase budgets</h2>
                  <p className="text-sm text-slate-500">Choose the phases for this project and assign fee/hours estimates.</p>
                </div>
                <span className="text-sm text-slate-500">{selectedPhaseCount} selected</span>
              </div>

              <div className="space-y-3 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                {phases.map((phase, index) => (
                  <div key={phase.phaseType} className="grid gap-3 sm:grid-cols-[auto_1fr_1fr] items-center">
                    <label className="flex items-center gap-2 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        checked={phase.selected}
                        onChange={(event) =>
                          updatePhase(index, { selected: event.target.checked })
                        }
                        className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      {phase.label}
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={phase.budgetedFee}
                      onChange={(event) =>
                        updatePhase(index, { budgetedFee: event.target.value })
                      }
                      placeholder="Budgeted fee"
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500"
                    />
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={phase.budgetedHours}
                      onChange={(event) =>
                        updatePhase(index, { budgetedHours: event.target.value })
                      }
                      placeholder="Budgeted hours"
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            {error && <p className="text-sm text-rose-500">{error}</p>}

            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? "Creating project..." : "Create project"}
            </button>
          </form>
        </div>

        <aside className="rounded-3xl border border-slate-200 bg-slate-950 p-6 text-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4 text-emerald-400">
            <FolderPlus className="h-4 w-4" />
            <h2 className="text-base font-semibold">Project setup</h2>
          </div>
          <p className="text-sm leading-6 text-slate-300">
            Create a new landscape architecture project and assign phases so your team can start tracking budget and time immediately.
          </p>
        </aside>
      </div>
    </div>
  );
}
