"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Calculator, Check, Download, Droplets, FileText, FolderPlus, Plus, Trash2, X } from "lucide-react";

type ProjectOption = { id: string; name: string; projectNumber: string | null };

type SavedHydrozone = {
  name: string;
  areaSqFt: number;
  plantFactor: string;
  irrigationEfficiency: string;
};

type SavedMweloCalculation = {
  version?: number;
  inputs?: {
    projectName?: string;
    region?: string;
    specialLandscapeArea?: number;
    hydrozones?: SavedHydrozone[];
  };
};

// MWELO Constants
// Reference evapotranspiration (ETo) by California region (inches/year)
const ETO_REGIONS: Record<string, number> = {
  "North Coast": 36.3,
  "North Central Valley": 51.1,
  "South Central Valley": 54.5,
  "South Coast — Northern": 42.0,
  "South Coast — Southern": 44.5,
  "South Coast — Inland": 51.5,
  "Central Coast": 40.7,
  "Inland Empire": 55.8,
  "High Desert": 63.6,
  "Low Desert": 74.7,
  "San Francisco Bay": 43.5,
  "Sacramento Valley": 54.3,
  "Sierra Foothills": 50.5,
};

// Plant factor ranges per WUCOLS
const PLANT_FACTORS: Record<string, number> = {
  "Very Low (0.1)": 0.1,
  "Low (0.2)": 0.2,
  "Moderate (0.5)": 0.5,
  "High (0.8)": 0.8,
};

const IRRIGATION_EFFICIENCIES: Record<string, number> = {
  "Drip (0.90)": 0.9,
  "Spray/Rotor (0.75)": 0.75,
  "Multi-stream Rotor (0.80)": 0.80,
  "Subsurface (0.95)": 0.95,
  "Hand Water (0.70)": 0.70,
};

type HydrozoneRow = {
  name: string;
  areaSqFt: string;
  plantFactor: string;
  irrigationEfficiency: string;
};

export default function MWELOCalculatorPage() {
  const [region, setRegion] = useState("South Central Valley");
  const [specialLandscapeArea, setSpecialLandscapeArea] = useState("");
  const [hydrozones, setHydrozones] = useState<HydrozoneRow[]>([
    { name: "Zone 1", areaSqFt: "", plantFactor: "Low (0.2)", irrigationEfficiency: "Drip (0.90)" },
  ]);
  const [projectName, setProjectName] = useState("");
  const [calculated, setCalculated] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  // "Save to project" flow state
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [saveProjectId, setSaveProjectId] = useState("");
  // Fetch the project list eagerly on mount so the "Project" picker at
  // the top of the form is populated without waiting for the save modal
  // open. Picking a project here pre-selects saveProjectId AND fills the
  // project name onto the report — single field, both wired.
  useEffect(() => {
    setProjectsLoading(true);
    fetch("/api/projects")
      .then((r) => r.json())
      .then((d) => setProjects(d.projects ?? []))
      .catch(() => {})
      .finally(() => setProjectsLoading(false));
  }, []);

  function handleSelectProject(projectId: string) {
    setSaveProjectId(projectId);
    if (!projectId) {
      // "Other / Manual entry" — keep whatever they had typed.
      return;
    }
    const proj = projects.find((p) => p.id === projectId);
    if (proj) {
      setProjectName(proj.name);
    }
  }
  const [saveItemName, setSaveItemName] = useState("");
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedItemId, setSavedItemId] = useState<string | null>(null);

  // Render-back: when arrived via /tools/mwelo-calculator?itemId=xxx the
  // calc was already saved to a project. We track the loaded item id so the
  // save button updates the existing ComplianceItem instead of creating a
  // duplicate.
  const [loadedItemId, setLoadedItemId] = useState<string | null>(null);
  const [loadedProjectName, setLoadedProjectName] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Load saved calc from URL ?itemId= on mount. Using window.location to
  // avoid Next.js useSearchParams + Suspense plumbing for what is a one-shot
  // client-side prefill.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const itemId = params.get("itemId");
    if (!itemId) return;

    setLoading(true);
    setLoadError(null);
    fetch(`/api/compliance?id=${encodeURIComponent(itemId)}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load saved calculation.");
        const item = data.item as {
          id: string;
          mweloCalculation: SavedMweloCalculation | null;
          project: { id: string; name: string };
        };
        if (!item.mweloCalculation?.inputs) {
          throw new Error("This compliance item has no saved MWELO calculation.");
        }
        const inputs = item.mweloCalculation.inputs;
        if (inputs.projectName) setProjectName(inputs.projectName);
        if (inputs.region && ETO_REGIONS[inputs.region]) setRegion(inputs.region);
        if (typeof inputs.specialLandscapeArea === "number") {
          setSpecialLandscapeArea(String(inputs.specialLandscapeArea));
        }
        if (Array.isArray(inputs.hydrozones) && inputs.hydrozones.length > 0) {
          setHydrozones(
            inputs.hydrozones.map((z) => ({
              name: z.name ?? "Zone",
              areaSqFt: String(z.areaSqFt ?? ""),
              plantFactor: z.plantFactor ?? "Low (0.2)",
              irrigationEfficiency: z.irrigationEfficiency ?? "Drip (0.90)",
            }))
          );
        }
        setLoadedItemId(item.id);
        setLoadedProjectName(item.project?.name ?? null);
        setCalculated(true);
      })
      .catch((err) => {
        setLoadError(err instanceof Error ? err.message : "Failed to load saved calculation.");
      })
      .finally(() => setLoading(false));
  }, []);

  const eto = ETO_REGIONS[region] ?? 54.5;

  function addZone() {
    setHydrozones((prev) => [
      ...prev,
      { name: `Zone ${prev.length + 1}`, areaSqFt: "", plantFactor: "Low (0.2)", irrigationEfficiency: "Drip (0.90)" },
    ]);
  }

  function removeZone(index: number) {
    setHydrozones((prev) => prev.filter((_, i) => i !== index));
  }

  function updateZone(index: number, field: keyof HydrozoneRow, value: string) {
    setHydrozones((prev) => prev.map((z, i) => (i === index ? { ...z, [field]: value } : z)));
  }

  // MWELO Calculations
  const totalLandscapeArea = hydrozones.reduce((sum, z) => sum + (Number(z.areaSqFt) || 0), 0);
  const sla = Number(specialLandscapeArea) || 0;

  // MAWA = (ETo)(0.55)(LA)(0.62) + (ETo)(SLA)(0.62)
  // 0.62 converts inches to gallons per sq ft
  // 0.55 is the ET adjustment factor (ETAF) for residential; 0.45 for non-residential
  const ETAF = 0.55; // Using residential default; non-residential is 0.45
  const CONVERSION = 0.62; // Convert inches/sqft to gallons/sqft
  const mawa = (eto * ETAF * totalLandscapeArea * CONVERSION) + (eto * sla * CONVERSION);

  // ETWU = sum of each hydrozone: (ETo × PF × area × 0.62) / IE
  const hydrozoneResults = hydrozones.map((z) => {
    const area = Number(z.areaSqFt) || 0;
    const pf = PLANT_FACTORS[z.plantFactor] ?? 0.2;
    const ie = IRRIGATION_EFFICIENCIES[z.irrigationEfficiency] ?? 0.75;
    const etwu = (eto * pf * area * CONVERSION) / ie;
    return { ...z, area, pf, ie, etwu };
  });

  const totalETWU = hydrozoneResults.reduce((sum, z) => sum + z.etwu, 0);
  const passes = totalETWU <= mawa;

  function handleCalculate() {
    setCalculated(true);
  }

  function handlePrint() {
    window.print();
  }

  async function openSaveModal() {
    setShowSaveModal(true);
    setSaveError(null);
    setSavedItemId(null);
    setSaveItemName(
      projectName ? `MWELO Water Budget — ${projectName}` : "MWELO Water Budget Calculation"
    );
    // When loaded from URL the project is already linked — skip the
    // project-list fetch and render the modal in update mode.
    if (loadedItemId) return;
    if (projects.length === 0) {
      setProjectsLoading(true);
      try {
        const res = await fetch("/api/projects");
        const data = await res.json();
        setProjects(data.projects ?? []);
        if (data.projects?.length === 1) setSaveProjectId(data.projects[0].id);
      } catch {
        setSaveError("Failed to load projects.");
      } finally {
        setProjectsLoading(false);
      }
    }
  }

  async function handleSaveToProject() {
    // Update path: previously-loaded item gets PATCH'd in place. We keep
    // the project linkage from the original item, so no project select.
    const isUpdate = Boolean(loadedItemId);
    if (!isUpdate && !saveProjectId) {
      setSaveError("Please select a project.");
      return;
    }
    if (!saveItemName.trim()) {
      setSaveError("Please name this compliance item.");
      return;
    }
    setSaving(true);
    setSaveError(null);

    const calculationPayload = {
      version: 1,
      savedAt: new Date().toISOString(),
      inputs: {
        projectName,
        region,
        eto,
        specialLandscapeArea: sla,
        hydrozones: hydrozones.map((z) => ({
          name: z.name,
          areaSqFt: Number(z.areaSqFt) || 0,
          plantFactor: z.plantFactor,
          irrigationEfficiency: z.irrigationEfficiency,
        })),
      },
      outputs: {
        totalLandscapeArea,
        mawa: Math.round(mawa),
        etwu: Math.round(totalETWU),
        passes,
        complianceRatio: mawa > 0 ? totalETWU / mawa : 0,
        hydrozoneResults: hydrozoneResults.map((z) => ({
          name: z.name,
          area: z.area,
          pf: z.pf,
          ie: z.ie,
          etwu: Math.round(z.etwu),
        })),
      },
    };

    const description = `MAWA: ${Math.round(mawa).toLocaleString()} gal/yr · ETWU: ${Math.round(totalETWU).toLocaleString()} gal/yr · ${passes ? "Compliant" : "Non-compliant"}`;
    const status = passes ? "COMPLETE" : "IN_PROGRESS";

    try {
      const res = await fetch("/api/compliance", {
        method: isUpdate ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isUpdate
            ? {
                id: loadedItemId,
                name: saveItemName.trim(),
                description,
                status,
                mweloCalculation: calculationPayload,
              }
            : {
                projectId: saveProjectId,
                category: "MWELO",
                name: saveItemName.trim(),
                description,
                status,
                mweloCalculation: calculationPayload,
              }
        ),
      });
      const data = await res.json();
      if (!res.ok) {
        setSaveError(data.error || "Failed to save calculation.");
        setSaving(false);
        return;
      }
      const itemId = data.item?.id ?? loadedItemId;
      setSavedItemId(itemId);
      // After a fresh save, treat the calc as "loaded" so further edits
      // continue to update the same item rather than creating duplicates.
      if (itemId && !loadedItemId) setLoadedItemId(itemId);
      setSaving(false);
    } catch {
      setSaveError("Network error. Please try again.");
      setSaving(false);
    }
  }

  function closeSaveModal() {
    setShowSaveModal(false);
    setSaveError(null);
    setSavedItemId(null);
    setSaveProjectId("");
  }

  // Auto-clear save state when inputs change so the "Saved" indicator
  // doesn't lie if the user re-runs the calculator with different numbers.
  useEffect(() => {
    if (savedItemId) setSavedItemId(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [region, specialLandscapeArea, hydrozones, projectName]);

  return (
    <div className="p-6 lg:p-10 max-w-4xl">
      <Link
        href="/compliance"
        className="inline-flex items-center gap-1.5 text-sm text-[#6B8C74] hover:text-[#2D6A4F] mb-6 transition-colors"
      >
        <ArrowLeft size={14} /> Compliance
      </Link>

      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200/30 flex items-center justify-center text-blue-700">
          <Droplets className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-serif text-2xl text-[#1A2E22]">MWELO Water Budget Calculator</h1>
          <p className="text-sm text-[#6B8C74]">Model Water Efficient Landscape Ordinance — California</p>
        </div>
      </div>

      {loading && (
        <div className="mt-1 mb-4 bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-800">
          Loading saved calculation…
        </div>
      )}

      {loadError && (
        <div className="mt-1 mb-4 bg-rose-50 border border-rose-200 rounded-xl p-3 text-sm text-rose-700">
          {loadError}
        </div>
      )}

      {loadedItemId && loadedProjectName && !loading && (
        <div className="mt-1 mb-4 bg-[#F0FAF4] border border-[#52B788]/30 rounded-xl p-3 flex flex-wrap items-center gap-2 justify-between text-sm">
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-[#2D6A4F]" />
            <span className="text-[#3D5C48]">
              Editing saved calculation for{" "}
              <span className="font-semibold text-[#1A2E22]">{loadedProjectName}</span>
            </span>
          </div>
          <Link
            href="/compliance"
            className="text-xs text-[#2D6A4F] hover:text-[#40916C] hover:underline"
          >
            Back to Compliance
          </Link>
        </div>
      )}

      <div className="mt-1 mb-8 bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 space-y-1">
        <p>
          MAWA and ETWU values per California Code of Regulations, Title 23, Division 2, Chapter 2.7
          (Model Water Efficient Landscape Ordinance, §§ 490 – 495). Computation last verified
          against the 2015 MWELO update.
        </p>
        <p>
          Results are advisory. Verify against the California Department of Water Resources
          guidance and have a licensed professional review before filing with your local agency.
        </p>
      </div>

      {/* Input form */}
      <div className="space-y-6">
        {/* Project + region */}
        <div className="rounded-2xl border border-[#E2EBE4] bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-[#1A2E22] mb-4">Project Information</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="mwelo-project-select" className="text-sm text-[#3D5C48] block mb-1.5 font-medium">Project</label>
              <select
                id="mwelo-project-select"
                value={saveProjectId}
                onChange={(e) => handleSelectProject(e.target.value)}
                className="w-full bg-[#F7F9F7] border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788]"
                disabled={projectsLoading || Boolean(loadedItemId)}
              >
                <option value="">
                  {projectsLoading
                    ? "Loading projects..."
                    : projects.length === 0
                    ? "No projects yet — type a name below"
                    : "— Pick a project —"}
                </option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.projectNumber ? `${p.projectNumber} · ${p.name}` : p.name}
                  </option>
                ))}
              </select>
              {/* Override / fallback name field — only relevant when no
                  project is picked (e.g. running a quick what-if on a
                  prospect that isn't in Phasewise yet). When linked to
                  a real project, the dropdown above is the source of
                  truth and this field reflects it read-only-ish. */}
              <input
                id="mwelo-project-name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Or type a name (for quick what-if)"
                className="mt-2 w-full bg-[#F7F9F7] border border-[#E2EBE4] rounded-lg px-3.5 py-2 text-xs text-[#1A2E22] focus:outline-none focus:border-[#52B788]"
              />
              {saveProjectId && (
                <p className="mt-1 text-[10px] text-[#52B788]">
                  Linked. Saving the calc will attach to this project.
                </p>
              )}
            </div>
            <div>
              <label htmlFor="mwelo-region" className="text-sm text-[#3D5C48] block mb-1.5 font-medium">Climate Region *</label>
              <select id="mwelo-region" value={region} onChange={(e) => setRegion(e.target.value)} className="w-full bg-[#F7F9F7] border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788]">
                {Object.keys(ETO_REGIONS).map((r) => <option key={r} value={r}>{r} (ETo: {ETO_REGIONS[r]}"/yr)</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="mwelo-sla" className="text-sm text-[#3D5C48] block mb-1.5 font-medium">Special Landscape Area (sq ft)</label>
              <input id="mwelo-sla" type="text" inputMode="numeric" pattern="[0-9]*" value={specialLandscapeArea} onChange={(e) => setSpecialLandscapeArea(e.target.value.replace(/[^0-9]/g, ""))} placeholder="0" className="w-full bg-[#F7F9F7] border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788]" />
              <p className="text-[10px] text-[#A3BEA9] mt-1">Edible gardens, areas using recycled water, etc.</p>
            </div>
          </div>
        </div>

        {/* Hydrozones */}
        <div className="rounded-2xl border border-[#E2EBE4] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-[#1A2E22]">Hydrozones</h2>
            <button type="button" onClick={addZone} className="inline-flex items-center gap-1.5 text-xs text-[#2D6A4F] hover:text-[#40916C] font-medium">
              <Plus size={14} /> Add zone
            </button>
          </div>

          <div className="space-y-3">
            {hydrozones.map((zone, i) => (
              <div key={i} className="grid grid-cols-[1fr_100px_1fr_1fr_32px] gap-2 items-end">
                <div>
                  {i === 0 && <label htmlFor={`mwelo-zone-name-${i}`} className="text-[10px] font-medium text-[#6B8C74] uppercase tracking-wider">Zone name</label>}
                  <input id={`mwelo-zone-name-${i}`} aria-label="Zone name" value={zone.name} onChange={(e) => updateZone(i, "name", e.target.value)} className="mt-1 w-full bg-[#F7F9F7] border border-[#E2EBE4] rounded-lg px-3 py-2 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788]" />
                </div>
                <div>
                  {i === 0 && <label htmlFor={`mwelo-zone-area-${i}`} className="text-[10px] font-medium text-[#6B8C74] uppercase tracking-wider">Area (sf)</label>}
                  <input id={`mwelo-zone-area-${i}`} aria-label="Zone area in square feet" type="text" inputMode="numeric" pattern="[0-9]*" value={zone.areaSqFt} onChange={(e) => updateZone(i, "areaSqFt", e.target.value.replace(/[^0-9]/g, ""))} placeholder="0" className="mt-1 w-full bg-[#F7F9F7] border border-[#E2EBE4] rounded-lg px-3 py-2 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788]" />
                </div>
                <div>
                  {i === 0 && <label htmlFor={`mwelo-zone-plant-factor-${i}`} className="text-[10px] font-medium text-[#6B8C74] uppercase tracking-wider">Plant Factor</label>}
                  <select id={`mwelo-zone-plant-factor-${i}`} aria-label="Plant factor" value={zone.plantFactor} onChange={(e) => updateZone(i, "plantFactor", e.target.value)} className="mt-1 w-full bg-[#F7F9F7] border border-[#E2EBE4] rounded-lg px-3 py-2 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788]">
                    {Object.keys(PLANT_FACTORS).map((pf) => <option key={pf} value={pf}>{pf}</option>)}
                  </select>
                </div>
                <div>
                  {i === 0 && <label htmlFor={`mwelo-zone-irrigation-${i}`} className="text-[10px] font-medium text-[#6B8C74] uppercase tracking-wider">Irrigation</label>}
                  <select id={`mwelo-zone-irrigation-${i}`} aria-label="Irrigation efficiency" value={zone.irrigationEfficiency} onChange={(e) => updateZone(i, "irrigationEfficiency", e.target.value)} className="mt-1 w-full bg-[#F7F9F7] border border-[#E2EBE4] rounded-lg px-3 py-2 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788]">
                    {Object.keys(IRRIGATION_EFFICIENCIES).map((ie) => <option key={ie} value={ie}>{ie}</option>)}
                  </select>
                </div>
                <div>
                  <button type="button" onClick={() => removeZone(i)} aria-label="Remove hydrozone" disabled={hydrozones.length === 1} className={`${i === 0 ? "mt-5" : ""} text-[#A3BEA9] hover:text-rose-500 transition-colors p-1 disabled:opacity-30`}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Calculate button */}
        <button
          type="button"
          onClick={handleCalculate}
          disabled={totalLandscapeArea === 0}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium bg-[#2D6A4F] text-white hover:bg-[#40916C] transition-all disabled:opacity-50"
        >
          <Calculator size={16} /> Calculate Water Budget
        </button>
      </div>

      {/* Results */}
      {calculated && totalLandscapeArea > 0 && (
        <div ref={reportRef} className="print-report mt-8 print:mt-0">
          <div className="rounded-2xl border-2 border-[#E2EBE4] bg-white p-6 sm:p-8 shadow-sm print:border-0 print:shadow-none print:p-0 print:rounded-none">
            {/* Branded print-only header (acts as letterhead) */}
            <div className="hidden print:flex items-center justify-between pb-3 mb-5 border-b-2" style={{ borderColor: "#2D6A4F" }}>
              <div className="flex items-center gap-2">
                <div className="flex flex-col gap-[2px] justify-center">
                  <span className="block rounded-sm" style={{ width: 18, height: 4, background: "#52B788" }} />
                  <span className="block rounded-sm" style={{ width: 14, height: 4, background: "#40916C" }} />
                  <span className="block rounded-sm" style={{ width: 16, height: 4, background: "#2D6A4F" }} />
                </div>
                <span className="text-[18pt] font-semibold tracking-tight" style={{ color: "#1A2E22" }}>
                  phase<span className="font-light" style={{ color: "#2D6A4F" }}>wise</span>
                </span>
              </div>
              <div className="text-right">
                <div className="text-[7pt] uppercase tracking-[0.18em] font-semibold" style={{ color: "#40916C" }}>MWELO Compliance Report</div>
                <div className="text-[8pt]" style={{ color: "#6B8C74" }}>phasewise.io</div>
              </div>
            </div>

            {/* Print-only project info row */}
            <div className="hidden print:grid grid-cols-3 gap-4 pb-3 mb-5 border-b text-[9pt]" style={{ borderColor: "#E2EBE4" }}>
              <div>
                <div className="text-[7pt] uppercase tracking-wider mb-0.5" style={{ color: "#6B8C74" }}>Project</div>
                <div className="font-semibold" style={{ color: "#1A2E22" }}>{projectName || "Untitled Project"}</div>
              </div>
              <div>
                <div className="text-[7pt] uppercase tracking-wider mb-0.5" style={{ color: "#6B8C74" }}>Climate Region</div>
                <div className="font-semibold" style={{ color: "#1A2E22" }}>{region}</div>
              </div>
              <div>
                <div className="text-[7pt] uppercase tracking-wider mb-0.5" style={{ color: "#6B8C74" }}>Report Date</div>
                <div className="font-semibold" style={{ color: "#1A2E22" }}>{new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</div>
              </div>
            </div>

            {/* On-screen header (hidden on print since the branded header above replaces it) */}
            <div className="flex items-center justify-between mb-6 print:hidden">
              <div>
                <h2 className="font-serif text-xl text-[#1A2E22]">MWELO Water Budget Report</h2>
                {projectName && <p className="text-sm text-[#6B8C74] mt-0.5">{projectName}</p>}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={openSaveModal}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-[#2D6A4F] text-white hover:bg-[#40916C] transition-all"
                >
                  {savedItemId ? (
                    <><Check size={14} /> {loadedItemId ? "Updated" : "Saved to compliance"}</>
                  ) : loadedItemId ? (
                    <><FolderPlus size={14} /> Update saved calc</>
                  ) : (
                    <><FolderPlus size={14} /> Save to project</>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-[#F0FAF4] text-[#2D6A4F] border border-[#52B788]/30 hover:bg-[#2D6A4F] hover:text-white transition-all"
                >
                  <Download size={14} /> Print / Save PDF
                </button>
              </div>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 print:gap-2 print:mb-3">
              <div className="rounded-xl bg-[#F7F9F7] p-4 border border-[#E2EBE4] print:p-2.5">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-[#6B8C74] mb-1">ETo</div>
                <div className="text-lg font-semibold text-[#1A2E22]">{eto} in/yr</div>
                <div className="text-[10px] text-[#A3BEA9]">{region}</div>
              </div>
              <div className="rounded-xl bg-[#F7F9F7] p-4 border border-[#E2EBE4] print:p-2.5">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-[#6B8C74] mb-1">Total Area</div>
                <div className="text-lg font-semibold text-[#1A2E22] print:text-base">{totalLandscapeArea.toLocaleString()} sf</div>
              </div>
              <div className="rounded-xl bg-blue-50 p-4 border border-blue-200/30 print:p-2.5">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-blue-600 mb-1">MAWA</div>
                <div className="text-lg font-semibold text-blue-800 print:text-base">{Math.round(mawa).toLocaleString()} gal/yr</div>
                <div className="text-[10px] text-blue-500">Maximum allowable</div>
              </div>
              <div className={`rounded-xl p-4 border print:p-2.5 ${passes ? "bg-[#F0FAF4] border-[#52B788]/30" : "bg-rose-50 border-rose-200/30"}`}>
                <div className={`text-[10px] font-semibold uppercase tracking-wider ${passes ? "text-[#2D6A4F]" : "text-rose-600"} mb-1`}>ETWU</div>
                <div className={`text-lg font-semibold print:text-base ${passes ? "text-[#2D6A4F]" : "text-rose-700"}`}>{Math.round(totalETWU).toLocaleString()} gal/yr</div>
                <div className={`text-[10px] ${passes ? "text-[#52B788]" : "text-rose-500"}`}>{passes ? "PASSES" : "EXCEEDS MAWA"}</div>
              </div>
            </div>

            {/* Compliance result */}
            <div className={`rounded-xl p-4 mb-6 print:p-3 print:mb-3 ${passes ? "bg-[#F0FAF4] border border-[#52B788]/30" : "bg-rose-50 border border-rose-200"}`}>
              <div className="flex items-center gap-2">
                <Droplets className={`w-5 h-5 ${passes ? "text-[#2D6A4F]" : "text-rose-600"}`} />
                <span className={`font-semibold ${passes ? "text-[#2D6A4F]" : "text-rose-700"}`}>
                  {passes ? "Compliant — ETWU is within MAWA" : "Non-compliant — ETWU exceeds MAWA"}
                </span>
              </div>
              <p className={`mt-1 text-sm ${passes ? "text-[#6B8C74]" : "text-rose-600"}`}>
                ETWU is {((totalETWU / mawa) * 100).toFixed(0)}% of MAWA.
                {!passes && " Reduce plant factors, increase irrigation efficiency, or reduce landscape area."}
              </p>
            </div>

            {/* Hydrozone breakdown */}
            <h3 className="text-sm font-semibold text-[#1A2E22] mb-3 print:mb-2 print:text-[10pt]">Hydrozone Breakdown</h3>
            <div className="rounded-xl border border-[#E2EBE4] overflow-hidden mb-6 print:mb-3 print-avoid-break">
              <table className="min-w-full text-left text-sm print:text-[8.5pt]">
                <thead className="bg-[#F7F9F7] border-b border-[#E2EBE4] text-[#6B8C74]">
                  <tr>
                    <th className="px-4 py-2.5 font-medium print:px-2 print:py-1.5">Zone</th>
                    <th className="px-4 py-2.5 font-medium text-right print:px-2 print:py-1.5">Area (sf)</th>
                    <th className="px-4 py-2.5 font-medium text-right print:px-2 print:py-1.5">PF</th>
                    <th className="px-4 py-2.5 font-medium text-right print:px-2 print:py-1.5">IE</th>
                    <th className="px-4 py-2.5 font-medium text-right print:px-2 print:py-1.5">ETWU (gal/yr)</th>
                    <th className="px-4 py-2.5 font-medium text-right print:px-2 print:py-1.5">% of Total</th>
                  </tr>
                </thead>
                <tbody>
                  {hydrozoneResults.map((z, i) => (
                    <tr key={i} className="border-b border-[#E8EDE9] last:border-0">
                      <td className="px-4 py-2.5 font-medium text-[#1A2E22] print:px-2 print:py-1.5">{z.name}</td>
                      <td className="px-4 py-2.5 text-right text-[#6B8C74] print:px-2 print:py-1.5">{z.area.toLocaleString()}</td>
                      <td className="px-4 py-2.5 text-right text-[#6B8C74] print:px-2 print:py-1.5">{z.pf}</td>
                      <td className="px-4 py-2.5 text-right text-[#6B8C74] print:px-2 print:py-1.5">{z.ie}</td>
                      <td className="px-4 py-2.5 text-right font-medium text-[#1A2E22] print:px-2 print:py-1.5">{Math.round(z.etwu).toLocaleString()}</td>
                      <td className="px-4 py-2.5 text-right text-[#6B8C74] print:px-2 print:py-1.5">{totalETWU > 0 ? ((z.etwu / totalETWU) * 100).toFixed(0) : 0}%</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-[#F7F9F7] border-t border-[#E2EBE4]">
                  <tr>
                    <td className="px-4 py-2.5 font-semibold text-[#1A2E22] print:px-2 print:py-1.5">Total</td>
                    <td className="px-4 py-2.5 text-right font-semibold text-[#1A2E22] print:px-2 print:py-1.5">{totalLandscapeArea.toLocaleString()}</td>
                    <td className="px-4 py-2.5 print:px-2 print:py-1.5" colSpan={2} />
                    <td className="px-4 py-2.5 text-right font-semibold text-[#1A2E22] print:px-2 print:py-1.5">{Math.round(totalETWU).toLocaleString()}</td>
                    <td className="px-4 py-2.5 text-right font-semibold text-[#1A2E22] print:px-2 print:py-1.5">100%</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Formula reference */}
            <div className="rounded-xl bg-[#F7F9F7] border border-[#E2EBE4] p-4 text-xs text-[#6B8C74] space-y-1 print:p-3 print:text-[8pt]">
              <div className="font-semibold text-[#3D5C48] mb-1">Formulas (per MWELO, Title 23 CCR)</div>
              <div>MAWA = (ETo x ETAF x LA x 0.62) + (ETo x SLA x 0.62)</div>
              <div>ETWU = sum of [(ETo x PF x HA x 0.62) / IE] for each hydrozone</div>
              <div className="mt-2 text-[#A3BEA9]">
                ETo = Reference Evapotranspiration ({eto} in/yr for {region}) | ETAF = {ETAF} |
                PF = Plant Factor (WUCOLS) | IE = Irrigation Efficiency | HA = Hydrozone Area |
                SLA = Special Landscape Area | 0.62 = in/sf to gal/sf conversion
              </div>
            </div>

            <p className="mt-4 text-[10px] text-[#A3BEA9] print:text-[8pt] print:mt-3">
              Generated by Phasewise MWELO Calculator on {new Date().toLocaleDateString()}. Computed per 23 CCR Div 2 Ch 2.7 §§ 490–495 (2015 MWELO update). For reference only — review by a licensed landscape architect required before submission.
            </p>

            {/* Print-only branded footer (sign-off line) */}
            <div className="hidden print:flex justify-between items-center mt-5 pt-3 border-t text-[8pt]" style={{ borderColor: "#E2EBE4", color: "#6B8C74" }}>
              <div className="flex items-center gap-1.5">
                <div className="flex flex-col gap-[1px] justify-center">
                  <span className="block rounded-sm" style={{ width: 10, height: 2, background: "#52B788" }} />
                  <span className="block rounded-sm" style={{ width: 8, height: 2, background: "#40916C" }} />
                  <span className="block rounded-sm" style={{ width: 9, height: 2, background: "#2D6A4F" }} />
                </div>
                <span>phasewise.io · Project management for landscape architecture firms</span>
              </div>
              <div>{new Date().toLocaleDateString()}</div>
            </div>
          </div>
        </div>
      )}

      {/* Save to project modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 print:hidden" onClick={closeSaveModal}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 pb-0">
              <h2 className="font-serif text-xl text-[#1A2E22]">Save to Compliance</h2>
              <button type="button" onClick={closeSaveModal} aria-label="Close save modal" className="text-[#A3BEA9] hover:text-[#1A2E22] transition-colors"><X size={18} /></button>
            </div>

            {savedItemId ? (
              <div className="p-6 space-y-4">
                <div className="rounded-xl bg-[#F0FAF4] border border-[#52B788]/30 p-4 flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#2D6A4F] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-[#1A2E22]">{loadedItemId ? "Updated successfully" : "Saved successfully"}</p>
                    <p className="text-xs text-[#6B8C74] mt-1">
                      This calculation is now a MWELO compliance item on the selected project. View it in the Compliance section.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Link
                    href="/compliance"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-[#2D6A4F] text-white hover:bg-[#40916C] transition-colors"
                  >
                    Open Compliance
                  </Link>
                  <a
                    href={`/api/compliance/${savedItemId}/mwelo-pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-[#F0FAF4] text-[#2D6A4F] border border-[#52B788]/30 hover:bg-[#52B788] hover:text-white transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    Download PDF
                  </a>
                  <button
                    type="button"
                    onClick={closeSaveModal}
                    className="text-sm text-[#6B8C74] hover:text-[#1A2E22] transition-colors"
                  >
                    Stay here
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                <p className="text-sm text-[#6B8C74]">
                  {loadedItemId
                    ? "Update this saved MWELO compliance calculation. The new numbers replace the previous ones on the linked project."
                    : "Save this calculation as a MWELO compliance item on a specific project. The full inputs and outputs will be stored, and the project's compliance tracker will reflect the pass/fail status."}
                </p>

                {loadedItemId ? (
                  <div className="rounded-lg bg-[#F0FAF4] border border-[#52B788]/30 px-3.5 py-2.5 text-sm">
                    <span className="text-[#6B8C74]">Linked project: </span>
                    <span className="font-semibold text-[#1A2E22]">{loadedProjectName ?? "—"}</span>
                  </div>
                ) : (
                  <div>
                    <label htmlFor="mwelo-save-project" className="text-sm text-[#3D5C48] block mb-1.5 font-medium">Project</label>
                    {projectsLoading ? (
                      <div className="text-sm text-[#A3BEA9] py-2">Loading projects...</div>
                    ) : projects.length === 0 ? (
                      <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800">
                        No active projects yet. <Link href="/projects/new" className="underline font-medium">Create one first</Link>, then come back to save this calculation.
                      </div>
                    ) : (
                      <select
                        id="mwelo-save-project"
                        value={saveProjectId}
                        onChange={(e) => setSaveProjectId(e.target.value)}
                        className="w-full bg-[#F7F9F7] border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788]"
                      >
                        <option value="">— Pick a project —</option>
                        {projects.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.projectNumber ? `${p.projectNumber} · ${p.name}` : p.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                )}

                <div>
                  <label htmlFor="mwelo-save-name" className="text-sm text-[#3D5C48] block mb-1.5 font-medium">Compliance item name</label>
                  <input
                    id="mwelo-save-name"
                    type="text"
                    value={saveItemName}
                    onChange={(e) => setSaveItemName(e.target.value)}
                    placeholder="MWELO Water Budget Calculation"
                    className="w-full bg-[#F7F9F7] border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788]"
                  />
                </div>

                <div className="rounded-xl bg-[#F7F9F7] border border-[#E2EBE4] p-3 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-[#6B8C74]">MAWA</span>
                    <span className="font-medium text-[#1A2E22]">{Math.round(mawa).toLocaleString()} gal/yr</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B8C74]">ETWU</span>
                    <span className={`font-medium ${passes ? "text-[#2D6A4F]" : "text-rose-700"}`}>{Math.round(totalETWU).toLocaleString()} gal/yr</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-[#E2EBE4]">
                    <span className="text-[#6B8C74]">Status</span>
                    <span className={`font-semibold ${passes ? "text-[#2D6A4F]" : "text-rose-700"}`}>{passes ? "Compliant" : "Non-compliant"}</span>
                  </div>
                </div>

                {saveError && (
                  <div className="rounded-lg bg-rose-50 border border-rose-200 p-3 text-sm text-rose-700">
                    {saveError}
                  </div>
                )}

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleSaveToProject}
                    disabled={saving || (!loadedItemId && (!saveProjectId || projects.length === 0))}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium bg-[#2D6A4F] text-white hover:bg-[#40916C] transition-colors disabled:opacity-60"
                  >
                    {saving
                      ? loadedItemId ? "Updating..." : "Saving..."
                      : loadedItemId ? "Update saved calculation" : "Save to project"}
                  </button>
                  <button
                    type="button"
                    onClick={closeSaveModal}
                    className="text-sm text-[#6B8C74] hover:text-[#1A2E22] transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
