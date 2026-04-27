"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Calculator, Download, Droplets, Plus, Trash2 } from "lucide-react";

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

      <div className="mt-1 mb-8 bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
        This calculator generates MAWA and ETWU values per the California MWELO (Title 23, CCR). Results should be reviewed by a licensed professional before filing.
      </div>

      {/* Input form */}
      <div className="space-y-6">
        {/* Project + region */}
        <div className="rounded-2xl border border-[#E2EBE4] bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-[#1A2E22] mb-4">Project Information</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="mwelo-project-name" className="text-sm text-[#3D5C48] block mb-1.5 font-medium">Project Name</label>
              <input id="mwelo-project-name" value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="Meridian Park Renovation" className="w-full bg-[#F7F9F7] border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788]" />
            </div>
            <div>
              <label htmlFor="mwelo-region" className="text-sm text-[#3D5C48] block mb-1.5 font-medium">Climate Region *</label>
              <select id="mwelo-region" value={region} onChange={(e) => setRegion(e.target.value)} className="w-full bg-[#F7F9F7] border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788]">
                {Object.keys(ETO_REGIONS).map((r) => <option key={r} value={r}>{r} (ETo: {ETO_REGIONS[r]}"/yr)</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="mwelo-sla" className="text-sm text-[#3D5C48] block mb-1.5 font-medium">Special Landscape Area (sq ft)</label>
              <input id="mwelo-sla" type="number" min="0" value={specialLandscapeArea} onChange={(e) => setSpecialLandscapeArea(e.target.value)} placeholder="0" className="w-full bg-[#F7F9F7] border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788]" />
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
                  <input id={`mwelo-zone-area-${i}`} aria-label="Zone area in square feet" type="number" min="0" value={zone.areaSqFt} onChange={(e) => updateZone(i, "areaSqFt", e.target.value)} placeholder="0" className="mt-1 w-full bg-[#F7F9F7] border border-[#E2EBE4] rounded-lg px-3 py-2 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788]" />
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
        <div ref={reportRef} className="mt-8 print:mt-0">
          <div className="rounded-2xl border-2 border-[#E2EBE4] bg-white p-6 sm:p-8 shadow-sm print:border print:shadow-none">
            <div className="flex items-center justify-between mb-6 print:mb-4">
              <div>
                <h2 className="font-serif text-xl text-[#1A2E22]">MWELO Water Budget Report</h2>
                {projectName && <p className="text-sm text-[#6B8C74] mt-0.5">{projectName}</p>}
              </div>
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-[#F0FAF4] text-[#2D6A4F] border border-[#52B788]/30 hover:bg-[#2D6A4F] hover:text-white transition-all print:hidden"
              >
                <Download size={14} /> Print / Save PDF
              </button>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="rounded-xl bg-[#F7F9F7] p-4 border border-[#E2EBE4]">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-[#6B8C74] mb-1">ETo</div>
                <div className="text-lg font-semibold text-[#1A2E22]">{eto} in/yr</div>
                <div className="text-[10px] text-[#A3BEA9]">{region}</div>
              </div>
              <div className="rounded-xl bg-[#F7F9F7] p-4 border border-[#E2EBE4]">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-[#6B8C74] mb-1">Total Area</div>
                <div className="text-lg font-semibold text-[#1A2E22]">{totalLandscapeArea.toLocaleString()} sf</div>
              </div>
              <div className="rounded-xl bg-blue-50 p-4 border border-blue-200/30">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-blue-600 mb-1">MAWA</div>
                <div className="text-lg font-semibold text-blue-800">{Math.round(mawa).toLocaleString()} gal/yr</div>
                <div className="text-[10px] text-blue-500">Maximum allowable</div>
              </div>
              <div className={`rounded-xl p-4 border ${passes ? "bg-[#F0FAF4] border-[#52B788]/30" : "bg-rose-50 border-rose-200/30"}`}>
                <div className={`text-[10px] font-semibold uppercase tracking-wider ${passes ? "text-[#2D6A4F]" : "text-rose-600"} mb-1`}>ETWU</div>
                <div className={`text-lg font-semibold ${passes ? "text-[#2D6A4F]" : "text-rose-700"}`}>{Math.round(totalETWU).toLocaleString()} gal/yr</div>
                <div className={`text-[10px] ${passes ? "text-[#52B788]" : "text-rose-500"}`}>{passes ? "PASSES" : "EXCEEDS MAWA"}</div>
              </div>
            </div>

            {/* Compliance result */}
            <div className={`rounded-xl p-4 mb-6 ${passes ? "bg-[#F0FAF4] border border-[#52B788]/30" : "bg-rose-50 border border-rose-200"}`}>
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
            <h3 className="text-sm font-semibold text-[#1A2E22] mb-3">Hydrozone Breakdown</h3>
            <div className="rounded-xl border border-[#E2EBE4] overflow-hidden mb-6">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-[#F7F9F7] border-b border-[#E2EBE4] text-[#6B8C74]">
                  <tr>
                    <th className="px-4 py-2.5 font-medium">Zone</th>
                    <th className="px-4 py-2.5 font-medium text-right">Area (sf)</th>
                    <th className="px-4 py-2.5 font-medium text-right">PF</th>
                    <th className="px-4 py-2.5 font-medium text-right">IE</th>
                    <th className="px-4 py-2.5 font-medium text-right">ETWU (gal/yr)</th>
                    <th className="px-4 py-2.5 font-medium text-right">% of Total</th>
                  </tr>
                </thead>
                <tbody>
                  {hydrozoneResults.map((z, i) => (
                    <tr key={i} className="border-b border-[#E8EDE9] last:border-0">
                      <td className="px-4 py-2.5 font-medium text-[#1A2E22]">{z.name}</td>
                      <td className="px-4 py-2.5 text-right text-[#6B8C74]">{z.area.toLocaleString()}</td>
                      <td className="px-4 py-2.5 text-right text-[#6B8C74]">{z.pf}</td>
                      <td className="px-4 py-2.5 text-right text-[#6B8C74]">{z.ie}</td>
                      <td className="px-4 py-2.5 text-right font-medium text-[#1A2E22]">{Math.round(z.etwu).toLocaleString()}</td>
                      <td className="px-4 py-2.5 text-right text-[#6B8C74]">{totalETWU > 0 ? ((z.etwu / totalETWU) * 100).toFixed(0) : 0}%</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-[#F7F9F7] border-t border-[#E2EBE4]">
                  <tr>
                    <td className="px-4 py-2.5 font-semibold text-[#1A2E22]">Total</td>
                    <td className="px-4 py-2.5 text-right font-semibold text-[#1A2E22]">{totalLandscapeArea.toLocaleString()}</td>
                    <td className="px-4 py-2.5" colSpan={2} />
                    <td className="px-4 py-2.5 text-right font-semibold text-[#1A2E22]">{Math.round(totalETWU).toLocaleString()}</td>
                    <td className="px-4 py-2.5 text-right font-semibold text-[#1A2E22]">100%</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Formula reference */}
            <div className="rounded-xl bg-[#F7F9F7] border border-[#E2EBE4] p-4 text-xs text-[#6B8C74] space-y-1">
              <div className="font-semibold text-[#3D5C48] mb-1">Formulas (per MWELO, Title 23 CCR)</div>
              <div>MAWA = (ETo x ETAF x LA x 0.62) + (ETo x SLA x 0.62)</div>
              <div>ETWU = sum of [(ETo x PF x HA x 0.62) / IE] for each hydrozone</div>
              <div className="mt-2 text-[#A3BEA9]">
                ETo = Reference Evapotranspiration ({eto} in/yr for {region}) | ETAF = {ETAF} |
                PF = Plant Factor (WUCOLS) | IE = Irrigation Efficiency | HA = Hydrozone Area |
                SLA = Special Landscape Area | 0.62 = in/sf to gal/sf conversion
              </div>
            </div>

            <p className="mt-4 text-[10px] text-[#A3BEA9]">
              Generated by Phasewise MWELO Calculator on {new Date().toLocaleDateString()}. This report is for reference only and should be reviewed by a licensed landscape architect before submission.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
