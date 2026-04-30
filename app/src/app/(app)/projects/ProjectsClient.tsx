"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronRight, FolderPlus, Search, X } from "lucide-react";
import { PHASE_SHORT_LABELS, STATUS_COLORS } from "@/lib/constants";

type Phase = { phaseType: string; status: string; budgetedFee: number; budgetedHours: number };

export type ProjectListItem = {
  id: string;
  name: string;
  projectNumber: string | null;
  clientName: string | null;
  city: string | null;
  projectType: string | null;
  status: string;
  hoursUsed: number;
  phases: Phase[];
};

type Props = {
  projects: ProjectListItem[];
};

// Status options used both by the inline row dropdown and the top filter pill.
const STATUSES: Array<{ value: string; label: string }> = [
  { value: "ACTIVE", label: "Active" },
  { value: "ON_HOLD", label: "On hold" },
  { value: "COMPLETED", label: "Completed" },
  { value: "ARCHIVED", label: "Archived" },
];

function getCurrentPhase(phases: Phase[]) {
  const activePhase = phases.find((phase) => phase.status !== "COMPLETE");
  return activePhase ?? phases[phases.length - 1] ?? { phaseType: "PRE_DESIGN", status: "NOT_STARTED" };
}

// Display order for status sections — matches what Kevin wanted:
// Active first (current work), then On Hold, then Completed, then Archived.
const SECTION_ORDER: Array<{
  value: string;
  label: string;
  description: string;
  defaultCollapsed: boolean;
}> = [
  { value: "ACTIVE", label: "Active", description: "Currently in progress.", defaultCollapsed: false },
  { value: "ON_HOLD", label: "On hold", description: "Paused or awaiting input.", defaultCollapsed: false },
  { value: "COMPLETED", label: "Completed", description: "Wrapped up; kept for reference.", defaultCollapsed: true },
  { value: "ARCHIVED", label: "Archived", description: "No longer active or relevant.", defaultCollapsed: true },
];

export default function ProjectsClient({ projects: initialProjects }: Props) {
  const router = useRouter();
  const [projects, setProjects] = useState(initialProjects);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>(""); // "" = all
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [savingStatusId, setSavingStatusId] = useState<string | null>(null);

  // Per-section collapse state. Defaults follow SECTION_ORDER so historical
  // groups (Completed / Archived) are out of the way until you go look.
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>(() =>
    SECTION_ORDER.reduce(
      (acc, s) => ({ ...acc, [s.value]: s.defaultCollapsed }),
      {} as Record<string, boolean>
    )
  );

  function toggleSection(status: string) {
    setCollapsed((prev) => ({ ...prev, [status]: !prev[status] }));
  }

  // Distinct project types found across the org's projects, used to
  // populate the type filter dropdown without hard-coding a fixed enum.
  const knownTypes = useMemo(() => {
    const set = new Set<string>();
    for (const p of projects) if (p.projectType) set.add(p.projectType);
    return Array.from(set).sort();
  }, [projects]);

  // Suggested types — shown in the filter even before any project uses
  // them, so a fresh org sees the canonical taxonomy. Free text is still
  // allowed when editing a project.
  const SUGGESTED_TYPES = useMemo(
    () => [
      "Residential",
      "Commercial",
      "Public",
      "Entry Monument",
      "Mixed Use",
      "Park",
      "Streetscape",
    ],
    []
  );

  const allTypeOptions = useMemo(() => {
    const merged = new Set<string>([...knownTypes, ...SUGGESTED_TYPES]);
    return Array.from(merged).sort();
  }, [knownTypes, SUGGESTED_TYPES]);

  const filterMatches = (p: ProjectListItem) => {
    const q = search.trim().toLowerCase();
    if (q) {
      const haystack = [
        p.name,
        p.projectNumber ?? "",
        p.clientName ?? "",
        p.city ?? "",
        p.projectType ?? "",
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    if (statusFilter && p.status !== statusFilter) return false;
    if (typeFilter && p.projectType !== typeFilter) return false;
    return true;
  };

  // Build one bucket per known status, filtered by search + type. The
  // status filter is applied as a section-visibility gate (selecting
  // ACTIVE hides every other section) rather than per-row, which keeps
  // the section UX intact.
  const sections = SECTION_ORDER.map((section) => {
    const matches = projects.filter(
      (p) => p.status === section.value && filterMatches(p)
    );
    const visible = !statusFilter || statusFilter === section.value;
    return { ...section, projects: matches, visible };
  });

  const totalVisible = sections
    .filter((s) => s.visible)
    .reduce((sum, s) => sum + s.projects.length, 0);

  // Stats are computed off the *active* (non-archived) set only — archived
  // work shouldn't move the firm-wide health needle.
  const activeProjects = projects.filter((p) => p.status === "ACTIVE");
  const atRisk = activeProjects.filter((p) => {
    const budgetedHours = p.phases.reduce((sum, ph) => sum + ph.budgetedHours, 0);
    return budgetedHours > 0 && p.hoursUsed / budgetedHours >= 0.9;
  });
  const totalFee = projects
    .filter((p) => p.status !== "ARCHIVED")
    .reduce(
      (sum, p) => sum + p.phases.reduce((s, ph) => s + ph.budgetedFee, 0),
      0
    );
  const avgBurn =
    activeProjects.length > 0
      ? activeProjects.reduce((sum, p) => {
          const budgetedHours = p.phases.reduce((s, ph) => s + ph.budgetedHours, 0);
          return sum + (budgetedHours > 0 ? (p.hoursUsed / budgetedHours) * 100 : 0);
        }, 0) / activeProjects.length
      : 0;

  async function handleStatusChange(projectId: string, newStatus: string) {
    setSavingStatusId(projectId);
    const prevStatus = projects.find((p) => p.id === projectId)?.status;
    // Optimistic update so the dropdown reflects the change immediately.
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, status: newStatus } : p))
    );
    const res = await fetch(`/api/projects/${projectId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setSavingStatusId(null);
    if (!res.ok) {
      // Revert on failure.
      setProjects((prev) =>
        prev.map((p) => (p.id === projectId ? { ...p, status: prevStatus ?? p.status } : p))
      );
      const data = await res.json().catch(() => ({}));
      alert(data.error || "Failed to update project status.");
      return;
    }
    // Trigger a server refresh so dependent surfaces (e.g. dashboard) pick
    // up the new status without a full reload.
    router.refresh();
  }

  function clearFilters() {
    setSearch("");
    setStatusFilter("");
    setTypeFilter("");
  }

  const filtersActive = search || statusFilter || typeFilter;

  return (
    <div className="p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Projects</h1>
          <p className="text-sm text-slate-500 mt-1">All projects for your organization</p>
        </div>
        <Link
          href="/projects/new"
          className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500"
        >
          <FolderPlus className="h-4 w-4" />
          New Project
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-4 mb-8">
        {[
          { label: "Active Projects", value: activeProjects.length, color: "text-sky-600 bg-sky-50" },
          { label: "At Risk", value: atRisk.length, color: "text-rose-600 bg-rose-50" },
          { label: "Total Fee", value: `$${(totalFee / 1000).toFixed(0)}K`, color: "text-emerald-600 bg-emerald-50" },
          { label: "Avg Burn Rate", value: `${avgBurn.toFixed(0)}%`, color: "text-violet-600 bg-violet-50" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 mb-3">{stat.label}</div>
            <div className={`text-3xl font-semibold ${stat.color}`}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Search + filter bar */}
      <div className="rounded-3xl border border-slate-200 bg-white p-4 mb-4 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="projects-search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, project number, client, city, or type…"
              className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:border-emerald-500 focus:bg-white"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <label htmlFor="projects-status-filter" className="sr-only">Status filter</label>
            <select
              id="projects-status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:border-emerald-500 focus:bg-white"
            >
              <option value="">All statuses</option>
              {STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            <label htmlFor="projects-type-filter" className="sr-only">Project type filter</label>
            <select
              id="projects-type-filter"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2.5 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:border-emerald-500 focus:bg-white"
            >
              <option value="">All types</option>
              {allTypeOptions.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            {filtersActive && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-1 px-3 py-2.5 text-sm rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Empty-state when nothing matches filters or org has no projects. */}
      {totalVisible === 0 && (
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden mb-6">
          <div className="px-6 py-12 text-center">
            <FolderPlus className="w-10 h-10 text-[#A3BEA9] mx-auto mb-3" />
            <h3 className="font-semibold text-slate-900 mb-1">
              {filtersActive ? "No matches" : "No projects yet"}
            </h3>
            <p className="text-sm text-slate-500 mb-3">
              {filtersActive
                ? "Try clearing filters or adjusting the search."
                : "Get started by creating your first project."}
            </p>
            {filtersActive ? (
              <button
                type="button"
                onClick={clearFilters}
                className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
              >
                Clear filters
              </button>
            ) : (
              <Link
                href="/projects/new"
                className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
              >
                Create a project &rarr;
              </Link>
            )}
          </div>
        </div>
      )}

      {/* One collapsible section per status, in the order Kevin asked for:
          Active → On Hold → Completed → Archived. Sections with zero
          matches are hidden so the page stays compact. */}
      <div className="space-y-4">
        {sections.map((section) => {
          if (!section.visible) return null;
          if (section.projects.length === 0) return null;
          const isCollapsed = collapsed[section.value];
          return (
            <div
              key={section.value}
              className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden"
            >
              <button
                type="button"
                onClick={() => toggleSection(section.value)}
                className="w-full flex items-center justify-between border-b border-slate-100 px-6 py-4 text-left hover:bg-slate-50 transition-colors"
                aria-expanded={!isCollapsed}
                aria-controls={`projects-section-${section.value}`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  {isCollapsed ? (
                    <ChevronRight className="w-4 h-4 text-slate-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500 flex-shrink-0" />
                  )}
                  <h2
                    className={`text-base font-semibold ${
                      section.value === "ACTIVE" || section.value === "ON_HOLD"
                        ? "text-slate-900"
                        : "text-slate-700"
                    }`}
                  >
                    {section.label}
                  </h2>
                  <span className="text-xs text-slate-500 px-2 py-0.5 rounded-full bg-slate-100">
                    {section.projects.length}
                  </span>
                  <span className="hidden sm:inline text-xs text-slate-500 truncate">
                    · {section.description}
                  </span>
                </div>
                <span className="text-xs text-slate-500">
                  {isCollapsed ? "Show" : "Hide"}
                </span>
              </button>

              {!isCollapsed && (
                <div className="overflow-x-auto" id={`projects-section-${section.value}`}>
                  <table className="min-w-full text-left text-sm text-slate-700">
                    <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
                      <tr>
                        <th className="px-6 py-4 font-medium">Project</th>
                        <th className="px-6 py-4 font-medium">Client</th>
                        <th className="px-6 py-4 font-medium">Type</th>
                        <th className="px-6 py-4 font-medium">City</th>
                        <th className="px-6 py-4 font-medium">Phase</th>
                        <th className="px-6 py-4 font-medium">Status</th>
                        <th className="px-6 py-4 font-medium">Budget</th>
                        <th className="px-6 py-4 font-medium">Burn</th>
                      </tr>
                    </thead>
                    <tbody>
                      {section.projects.map((project) => (
                        <ProjectRow
                          key={project.id}
                          project={project}
                          saving={savingStatusId === project.id}
                          onStatusChange={handleStatusChange}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Row ────────────────────────────────────────────────────────────────────

function ProjectRow({
  project,
  saving,
  onStatusChange,
}: {
  project: ProjectListItem;
  saving: boolean;
  onStatusChange: (projectId: string, newStatus: string) => void;
}) {
  const currentPhase = getCurrentPhase(project.phases);
  const budgetedFee = project.phases.reduce((sum, ph) => sum + ph.budgetedFee, 0);
  const budgetedHours = project.phases.reduce((sum, ph) => sum + ph.budgetedHours, 0);
  const burnPercent = budgetedHours > 0 ? (project.hoursUsed / budgetedHours) * 100 : 0;
  const isArchived = project.status === "ARCHIVED";

  return (
    <tr className={`border-b border-slate-100 hover:bg-slate-50/80 transition-colors ${isArchived ? "opacity-70" : ""}`}>
      <td className="px-6 py-4">
        <Link href={`/projects/${project.id}`} className="font-semibold text-slate-900 hover:text-emerald-600">
          {project.name}
        </Link>
        <div className="text-xs text-slate-500 mt-1">{project.projectNumber || "—"}</div>
      </td>
      <td className="px-6 py-4 text-slate-600">{project.clientName || "—"}</td>
      <td className="px-6 py-4 text-slate-600">{project.projectType || "—"}</td>
      <td className="px-6 py-4 text-slate-600">{project.city || "—"}</td>
      <td className="px-6 py-4 text-slate-600">
        <span className="text-xs font-medium rounded-full bg-slate-100 px-2 py-1">
          {PHASE_SHORT_LABELS[currentPhase?.phaseType ?? "PRE_DESIGN"]}
        </span>
      </td>
      <td className="px-6 py-4">
        {/* Inline status select — same options as the project edit form. */}
        <select
          aria-label={`Change status for ${project.name}`}
          value={project.status}
          disabled={saving}
          onChange={(e) => onStatusChange(project.id, e.target.value)}
          className={`text-xs font-semibold px-2 py-1 rounded-full border cursor-pointer disabled:opacity-50 ${STATUS_COLORS[project.status] ?? ""}`}
        >
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </td>
      <td className="px-6 py-4 text-slate-600">${budgetedFee.toLocaleString()}</td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-24 overflow-hidden rounded-full bg-slate-100 h-2">
            <div
              className={`h-2 rounded-full ${burnPercent >= 95 ? "bg-red-500" : burnPercent >= 80 ? "bg-yellow-500" : "bg-emerald-500"}`}
              style={{ width: `${Math.min(burnPercent, 100)}%` }}
            />
          </div>
          <span className="text-xs font-semibold text-slate-700">{burnPercent.toFixed(0)}%</span>
        </div>
      </td>
    </tr>
  );
}
