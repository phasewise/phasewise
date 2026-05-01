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
  sortOrder: index,
}));

type PhaseRow = (typeof defaultPhases)[number];

export default function NewProjectPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [projectNumber, setProjectNumber] = useState("");
  const [autoNumber, setAutoNumber] = useState("");
  const [isCustomNumber, setIsCustomNumber] = useState(false);

  useEffect(() => {
    fetch("/api/projects/next-number")
      .then((res) => res.json())
      .then((data) => {
        if (data.nextNumber) {
          setAutoNumber(data.nextNumber);
          setProjectNumber(data.nextNumber);
        }
      })
      .catch(() => {});
  }, []);
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [startDate, setStartDate] = useState("");
  const [targetCompletion, setTargetCompletion] = useState("");
  const [status, setStatus] = useState("ACTIVE");
  const [contractFee, setContractFee] = useState("");
  const [city, setCity] = useState("");
  const [projectType, setProjectType] = useState("");
  // Org-managed project type list — fetched on mount. The Settings page
  // at /settings/project-types lets owners curate this. Free-text input
  // still allowed for one-off types.
  const [projectTypeOptions, setProjectTypeOptions] = useState<string[]>([]);
  const [phases, setPhases] = useState<PhaseRow[]>(defaultPhases);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetch("/api/projects/types")
      .then((r) => r.json())
      .then((d) => setProjectTypeOptions(Array.isArray(d.types) ? d.types : []))
      .catch(() => {});
  }, []);

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
        contractFee,
        city,
        projectType,
        phases,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      setError(result?.error || "Failed to create project.");
      setIsSaving(false);
      return;
    }

    // Send the user straight to the Work Plan, which is the source of
    // truth for hours + fees. They assign staff there and budgets
    // flow back to the phases automatically.
    router.push(`/projects/${result.projectId}/edit#work-plan`);
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
                <label htmlFor="pnew-name" className="text-sm font-medium text-slate-700">Project name</label>
                <input
                  id="pnew-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="pnew-project-number" className="text-sm font-medium text-slate-700">Project number</label>
                  <div className="relative mt-2">
                    <input
                      id="pnew-project-number"
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
                        aria-label="Reset to auto-generated number"
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
                  <label htmlFor="pnew-status" className="text-sm font-medium text-slate-700">Status</label>
                  <select
                    id="pnew-status"
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
                  <label htmlFor="pnew-client-name" className="text-sm font-medium text-slate-700">Client name</label>
                  <input
                    id="pnew-client-name"
                    value={clientName}
                    onChange={(event) => setClientName(event.target.value)}
                    autoComplete="organization"
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label htmlFor="pnew-client-email" className="text-sm font-medium text-slate-700">Client email</label>
                  <input
                    id="pnew-client-email"
                    value={clientEmail}
                    type="email"
                    onChange={(event) => setClientEmail(event.target.value)}
                    autoComplete="email"
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="pnew-start-date" className="text-sm font-medium text-slate-700">Start date</label>
                  <input
                    id="pnew-start-date"
                    type="date"
                    value={startDate}
                    onChange={(event) => setStartDate(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label htmlFor="pnew-target-completion" className="text-sm font-medium text-slate-700">Target completion</label>
                  <input
                    id="pnew-target-completion"
                    type="date"
                    value={targetCompletion}
                    onChange={(event) => setTargetCompletion(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="pnew-contract-fee" className="text-sm font-medium text-slate-700">
                  Contract fee <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <div className="relative mt-2">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                  <input
                    id="pnew-contract-fee"
                    type="number"
                    min="0"
                    step="0.01"
                    value={contractFee}
                    onChange={(event) => setContractFee(event.target.value)}
                    placeholder="Total fee for the project"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-8 pr-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500"
                  />
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  The fee you&rsquo;ve agreed to bill the client. Your Work Plan estimate will be compared against this as a ceiling.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="pnew-city" className="text-sm font-medium text-slate-700">
                  City <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <input
                  id="pnew-city"
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                  placeholder="e.g., Fresno"
                  autoComplete="address-level2"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label htmlFor="pnew-project-type" className="text-sm font-medium text-slate-700">
                  Project type <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <input
                  id="pnew-project-type"
                  list="pnew-project-type-suggestions"
                  value={projectType}
                  onChange={(event) => setProjectType(event.target.value)}
                  placeholder="Residential / Commercial / Public / …"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500"
                />
                <datalist id="pnew-project-type-suggestions">
                  {projectTypeOptions.map((t) => (
                    <option key={t} value={t} />
                  ))}
                </datalist>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Phases</h2>
                  <p className="text-sm text-slate-500">
                    Choose the phases for this project. Hours and fees are set in the Work Plan based on who&rsquo;s assigned.
                  </p>
                </div>
                <span className="text-sm text-slate-500">{selectedPhaseCount} selected</span>
              </div>

              <div className="space-y-2 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                {phases.map((phase, index) => (
                  <label
                    key={phase.phaseType}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={phase.selected}
                      onChange={(event) =>
                        updatePhase(index, { selected: event.target.checked })
                      }
                      className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-sm text-slate-700">{phase.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {error && <p className="text-sm text-rose-500">{error}</p>}

            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? "Creating project..." : "Create & build Work Plan"}
            </button>
          </form>
        </div>

        <aside className="rounded-3xl border border-slate-200 bg-slate-950 p-6 text-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4 text-emerald-400">
            <FolderPlus className="h-4 w-4" />
            <h2 className="text-base font-semibold">How budgets work</h2>
          </div>
          <p className="text-sm leading-6 text-slate-300">
            Create the project with its phases, then assign staff in the Work Plan. Hours and fees per phase are calculated from staff assignments &times; billing rates &mdash; no more double-entering estimates.
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            Set an optional contract fee to compare your Work Plan estimate against what the client is paying.
          </p>
        </aside>
      </div>
    </div>
  );
}
