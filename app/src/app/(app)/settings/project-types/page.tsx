"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Save, X } from "lucide-react";

export default function ProjectTypesPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [types, setTypes] = useState<string[]>([]);
  const [newType, setNewType] = useState("");

  useEffect(() => {
    fetch("/api/projects/types")
      .then((res) => res.json())
      .then((data) => {
        setTypes(Array.isArray(data.types) ? data.types : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  function addType() {
    const t = newType.trim();
    if (!t) return;
    if (types.some((x) => x.toLowerCase() === t.toLowerCase())) {
      setError(`"${t}" is already in the list.`);
      return;
    }
    setTypes((prev) => [...prev, t]);
    setNewType("");
    setError(null);
  }

  function removeType(value: string) {
    setTypes((prev) => prev.filter((t) => t !== value));
  }

  function moveType(value: string, dir: -1 | 1) {
    setTypes((prev) => {
      const idx = prev.indexOf(value);
      if (idx === -1) return prev;
      const next = [...prev];
      const swap = idx + dir;
      if (swap < 0 || swap >= next.length) return prev;
      [next[idx], next[swap]] = [next[swap], next[idx]];
      return next;
    });
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSuccess(false);

    const res = await fetch("/api/projects/types", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ types }),
    });
    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(data.error || "Failed to save.");
      return;
    }
    setTypes(Array.isArray(data.types) ? data.types : types);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  }

  if (loading) {
    return (
      <div className="p-6 sm:p-8">
        <p className="text-sm text-[#6B8C74]">Loading project types...</p>
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
        <h1 className="font-serif text-3xl text-[#1A2E22]">Project Types</h1>
        <p className="mt-2 text-sm text-[#6B8C74]">
          The taxonomy your firm uses to classify projects. Used by the project create / edit forms and the projects-list filter.
        </p>
      </div>

      <div className="rounded-2xl border border-[#E2EBE4] bg-white p-6 sm:p-8 shadow-[0_4px_24px_rgba(26,46,34,0.04)] space-y-6">
        {/* Add new */}
        <div>
          <label htmlFor="proj-types-new" className="text-sm font-medium text-[#3D5C48] block mb-1.5">
            Add a project type
          </label>
          <div className="flex gap-2">
            <input
              id="proj-types-new"
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addType();
                }
              }}
              placeholder="e.g., Healing Garden"
              className="flex-1 rounded-lg border border-[#E2EBE4] bg-[#F7F9F7] px-3.5 py-2.5 text-sm text-[#1A2E22] outline-none focus:border-[#52B788] focus:bg-white"
            />
            <button
              type="button"
              onClick={addType}
              disabled={!newType.trim()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#F0FAF4] text-[#2D6A4F] border border-[#52B788]/30 px-4 py-2.5 text-sm font-medium hover:bg-[#52B788] hover:text-white transition-colors disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>
        </div>

        {/* Current list */}
        <div>
          <p className="text-sm font-medium text-[#3D5C48] mb-2">Current types</p>
          {types.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#E2EBE4] bg-[#F7F9F7] p-6 text-center text-sm text-[#6B8C74]">
              No types yet. Save now to use the built-in defaults (Residential / Commercial / Public / etc.), or add your own above first.
            </div>
          ) : (
            <ul className="space-y-1.5">
              {types.map((t, i) => (
                <li
                  key={t}
                  className="flex items-center justify-between rounded-lg border border-[#E2EBE4] bg-[#F7F9F7] px-3 py-2"
                >
                  <span className="text-sm text-[#1A2E22]">{t}</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => moveType(t, -1)}
                      disabled={i === 0}
                      title="Move up"
                      className="p-1.5 text-[#6B8C74] hover:text-[#1A2E22] hover:bg-white rounded disabled:opacity-30"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => moveType(t, 1)}
                      disabled={i === types.length - 1}
                      title="Move down"
                      className="p-1.5 text-[#6B8C74] hover:text-[#1A2E22] hover:bg-white rounded disabled:opacity-30"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => removeType(t)}
                      title={`Remove ${t}`}
                      className="p-1.5 text-[#A3BEA9] hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Note about existing projects */}
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900">
          Removing a type does not change projects that already use it — those project records keep
          the value they were saved with. The type just won&rsquo;t appear in the dropdown for
          future projects.
        </div>

        {error && <p className="text-sm text-[#B04030]">{error}</p>}

        <div>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium bg-[#2D6A4F] text-white hover:bg-[#40916C] hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(45,106,79,0.3)] transition-all disabled:opacity-60 disabled:hover:translate-y-0"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : success ? "Saved ✓" : "Save list"}
          </button>
        </div>
      </div>
    </div>
  );
}
