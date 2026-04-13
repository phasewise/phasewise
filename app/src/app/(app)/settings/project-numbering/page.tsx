"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

export default function ProjectNumberingPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [prefix, setPrefix] = useState("PW");
  const [nextNumber, setNextNumber] = useState(1);
  const [autoEnabled, setAutoEnabled] = useState(true);

  useEffect(() => {
    fetch("/api/settings/org")
      .then((res) => res.json())
      .then((data) => {
        if (data.org) {
          setPrefix(data.org.projectNumberPrefix || "PW");
          setNextNumber(data.org.projectNumberNext || 1);
          setAutoEnabled(data.org.autoNumberProjects ?? true);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  async function handleSave() {
    setError(null);
    setSaving(true);
    setSuccess(false);

    const res = await fetch("/api/settings/org", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectNumberPrefix: prefix,
        projectNumberNext: nextNumber,
        autoNumberProjects: autoEnabled,
      }),
    });

    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(data.error || "Failed to save settings.");
      return;
    }

    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  }

  const previewNumber = autoEnabled
    ? `${prefix}-${String(nextNumber).padStart(3, "0")}`
    : "Manual entry";

  if (loading) {
    return (
      <div className="p-6 sm:p-8">
        <p className="text-sm text-[#6B8C74]">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 max-w-2xl">
      <div className="mb-8">
        <Link
          href="/settings"
          className="inline-flex items-center gap-2 text-sm text-[#6B8C74] hover:text-[#1A2E22] mb-3"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Settings
        </Link>
        <h1 className="font-serif text-3xl text-[#1A2E22]">Project Numbering</h1>
        <p className="mt-2 text-sm text-[#6B8C74]">
          Configure how new project numbers are generated.
        </p>
      </div>

      <div className="rounded-2xl border border-[#E2EBE4] bg-white p-6 sm:p-8 shadow-[0_4px_24px_rgba(26,46,34,0.04)]">
        {/* Enable/disable toggle */}
        <div className="flex items-center justify-between mb-6 pb-6 border-b border-[#E8EDE9]">
          <div>
            <h2 className="text-sm font-semibold text-[#1A2E22]">Auto-number new projects</h2>
            <p className="text-xs text-[#6B8C74] mt-1">
              When enabled, new projects are assigned a sequential number automatically.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setAutoEnabled(!autoEnabled)}
            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
              autoEnabled ? "bg-[#2D6A4F]" : "bg-[#E2EBE4]"
            }`}
          >
            <span
              className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                autoEnabled ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {autoEnabled && (
          <div className="space-y-6">
            {/* Prefix */}
            <div>
              <label className="text-sm font-medium text-[#3D5C48]">Prefix</label>
              <p className="text-xs text-[#A3BEA9] mt-0.5 mb-2">
                The letters that appear before the number (e.g., &quot;PW&quot; for PW-001).
              </p>
              <input
                value={prefix}
                onChange={(e) => setPrefix(e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, ""))}
                maxLength={10}
                className="w-40 rounded-lg border border-[#E2EBE4] bg-[#F7F9F7] px-4 py-3 text-sm text-[#1A2E22] font-mono uppercase outline-none focus:border-[#52B788] focus:bg-white"
                placeholder="PW"
              />
            </div>

            {/* Next number */}
            <div>
              <label className="text-sm font-medium text-[#3D5C48]">Next project number</label>
              <p className="text-xs text-[#A3BEA9] mt-0.5 mb-2">
                The next number that will be assigned. Change this to start from a different point.
              </p>
              <input
                type="number"
                min={1}
                value={nextNumber}
                onChange={(e) => setNextNumber(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-32 rounded-lg border border-[#E2EBE4] bg-[#F7F9F7] px-4 py-3 text-sm text-[#1A2E22] font-mono outline-none focus:border-[#52B788] focus:bg-white"
              />
            </div>

            {/* Preview */}
            <div className="rounded-xl bg-[#F0FAF4] border border-[#52B788]/20 p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#40916C] mb-1">Preview</div>
              <div className="text-xl font-mono font-semibold text-[#1A2E22]">{previewNumber}</div>
              <p className="text-xs text-[#6B8C74] mt-1">
                This is what the next auto-generated project number will look like.
              </p>
            </div>
          </div>
        )}

        {!autoEnabled && (
          <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
            <p className="text-sm text-amber-800">
              Auto-numbering is disabled. When creating new projects, the project number field will be blank and you can enter any number you want.
            </p>
          </div>
        )}

        {error && <p className="mt-4 text-sm text-[#B04030]">{error}</p>}

        <div className="mt-6">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium bg-[#2D6A4F] text-white hover:bg-[#40916C] hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(45,106,79,0.3)] transition-all disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : success ? "Saved ✓" : "Save settings"}
          </button>
        </div>
      </div>
    </div>
  );
}
