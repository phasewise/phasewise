"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

// Token preview for the user — same renderer the API uses, mirrored here
// so the form gives instant feedback. Server is the source of truth at
// commit time, but the preview is purely cosmetic so this dupe is fine.
function preview(format: string, prefix: string, counter: number): string {
  const now = new Date();
  const year = now.getFullYear();
  return format
    .replace(/\{prefix\}/gi, prefix || "INV")
    .replace(/\{YYYY\}/g, String(year))
    .replace(/\{YY\}/g, String(year).slice(-2))
    .replace(/\{N(\d+)\}/gi, (_, digits) =>
      String(counter).padStart(parseInt(digits, 10), "0")
    )
    .replace(/\{N\}/gi, String(counter));
}

const PRESETS: Array<{ label: string; format: string; example: string }> = [
  { label: "INV-001 (default)", format: "{prefix}-{N3}", example: "INV-001" },
  { label: "INV-26-0001 (year + 4-digit)", format: "{prefix}-{YY}-{N4}", example: "INV-26-0001" },
  { label: "INV-2026-001 (4-digit year)", format: "{prefix}-{YYYY}-{N3}", example: "INV-2026-001" },
  { label: "2026-INV-0042 (year first)", format: "{YYYY}-{prefix}-{N4}", example: "2026-INV-0042" },
  { label: "INV2600001 (no separators)", format: "{prefix}{YY}{N5}", example: "INV2600001" },
];

export default function InvoiceNumberingPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [prefix, setPrefix] = useState("INV");
  const [nextNumber, setNextNumber] = useState(1);
  const [autoEnabled, setAutoEnabled] = useState(true);
  const [format, setFormat] = useState("{prefix}-{N3}");

  useEffect(() => {
    fetch("/api/settings/org")
      .then((res) => res.json())
      .then((data) => {
        if (data.org) {
          setPrefix(data.org.invoiceNumberPrefix || "INV");
          setNextNumber(data.org.invoiceNumberNext || 1);
          setAutoEnabled(data.org.autoNumberInvoices ?? true);
          setFormat(data.org.invoiceNumberFormat || "{prefix}-{N3}");
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function handleSave() {
    setError(null);
    setSaving(true);
    setSuccess(false);

    const res = await fetch("/api/settings/org", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        invoiceNumberPrefix: prefix,
        invoiceNumberNext: nextNumber,
        autoNumberInvoices: autoEnabled,
        invoiceNumberFormat: format,
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

  const previewNumber = autoEnabled ? preview(format, prefix, nextNumber) : "Manual entry";
  const formatHasCounter = /\{N\d*\}/i.test(format);

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
        <h1 className="font-serif text-3xl text-[#1A2E22]">Invoice Numbering</h1>
        <p className="mt-2 text-sm text-[#6B8C74]">
          Configure how new invoice numbers are generated.
        </p>
      </div>

      <div className="rounded-2xl border border-[#E2EBE4] bg-white p-6 sm:p-8 shadow-[0_4px_24px_rgba(26,46,34,0.04)]">
        {/* Auto-number toggle */}
        <div className="flex items-center justify-between mb-6 pb-6 border-b border-[#E8EDE9]">
          <div>
            <h2 className="text-sm font-semibold text-[#1A2E22]">Auto-number new invoices</h2>
            <p className="text-xs text-[#6B8C74] mt-1">
              When enabled, new invoices are assigned a sequential number automatically.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setAutoEnabled(!autoEnabled)}
            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
              autoEnabled ? "bg-[#2D6A4F]" : "bg-[#E2EBE4]"
            }`}
            aria-label="Toggle auto-numbering"
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
            <div>
              <label htmlFor="inv-num-prefix" className="text-sm font-medium text-[#3D5C48]">Prefix</label>
              <p className="text-xs text-[#A3BEA9] mt-0.5 mb-2">
                Letters used by the <code className="font-mono text-[10px] bg-[#F0FAF4] px-1 rounded">{"{prefix}"}</code> token (e.g., &quot;INV&quot;).
              </p>
              <input
                id="inv-num-prefix"
                value={prefix}
                onChange={(e) => setPrefix(e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, ""))}
                maxLength={10}
                className="w-40 rounded-lg border border-[#E2EBE4] bg-[#F7F9F7] px-4 py-3 text-sm text-[#1A2E22] font-mono uppercase outline-none focus:border-[#52B788] focus:bg-white"
                placeholder="INV"
              />
            </div>

            <div>
              <label htmlFor="inv-num-next" className="text-sm font-medium text-[#3D5C48]">Next invoice number</label>
              <p className="text-xs text-[#A3BEA9] mt-0.5 mb-2">
                The counter value that fills the <code className="font-mono text-[10px] bg-[#F0FAF4] px-1 rounded">{"{N}"}</code> tokens. Change to start from a different point.
              </p>
              <input
                id="inv-num-next"
                type="number"
                min={1}
                value={nextNumber}
                onChange={(e) => setNextNumber(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-32 rounded-lg border border-[#E2EBE4] bg-[#F7F9F7] px-4 py-3 text-sm text-[#1A2E22] font-mono outline-none focus:border-[#52B788] focus:bg-white"
              />
            </div>

            <div>
              <label htmlFor="inv-num-format" className="text-sm font-medium text-[#3D5C48]">Format template</label>
              <p className="text-xs text-[#A3BEA9] mt-0.5 mb-2">
                Combine these tokens to build your number:{" "}
                <code className="font-mono bg-[#F0FAF4] px-1 rounded">{"{prefix}"}</code>{" "}
                <code className="font-mono bg-[#F0FAF4] px-1 rounded">{"{YY}"}</code>{" "}
                <code className="font-mono bg-[#F0FAF4] px-1 rounded">{"{YYYY}"}</code>{" "}
                <code className="font-mono bg-[#F0FAF4] px-1 rounded">{"{N}"}</code>{" "}
                <code className="font-mono bg-[#F0FAF4] px-1 rounded">{"{N3}"}</code>{" "}
                <code className="font-mono bg-[#F0FAF4] px-1 rounded">{"{N4}"}</code>{" "}
                <code className="font-mono bg-[#F0FAF4] px-1 rounded">{"{N5}"}</code>
              </p>
              <input
                id="inv-num-format"
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full rounded-lg border border-[#E2EBE4] bg-[#F7F9F7] px-4 py-3 text-sm text-[#1A2E22] font-mono outline-none focus:border-[#52B788] focus:bg-white"
                placeholder="{prefix}-{N3}"
              />
              {!formatHasCounter && (
                <p className="mt-1 text-xs text-rose-600">
                  Format must include a counter token ({"{N}"}, {"{N3}"}, {"{N4}"}, etc.) so numbers stay unique.
                </p>
              )}
            </div>

            <div>
              <p className="text-xs font-medium text-[#6B8C74] uppercase tracking-wider mb-2">Quick presets</p>
              <div className="flex flex-col gap-1.5">
                {PRESETS.map((p) => (
                  <button
                    key={p.format}
                    type="button"
                    onClick={() => setFormat(p.format)}
                    className={`text-left text-xs px-3 py-2 rounded-lg border transition-colors ${
                      format === p.format
                        ? "bg-[#F0FAF4] border-[#52B788]/40 text-[#1A2E22]"
                        : "bg-[#F7F9F7] border-[#E2EBE4] text-[#3D5C48] hover:bg-[#F0FAF4]"
                    }`}
                  >
                    <span className="font-medium">{p.label}</span>
                    <span className="ml-2 font-mono text-[#A3BEA9]">{p.format}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-[#F0FAF4] border border-[#52B788]/20 p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#40916C] mb-1">Preview</div>
              <div className="text-xl font-mono font-semibold text-[#1A2E22]">{previewNumber}</div>
              <p className="text-xs text-[#6B8C74] mt-1">
                The next invoice you create will use this number.
              </p>
            </div>
          </div>
        )}

        {!autoEnabled && (
          <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
            <p className="text-sm text-amber-800">
              Auto-numbering is disabled. When creating new invoices, the invoice number field will be blank and you can enter any value.
            </p>
          </div>
        )}

        {error && <p className="mt-4 text-sm text-[#B04030]">{error}</p>}

        <div className="mt-6">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || (autoEnabled && !formatHasCounter)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium bg-[#2D6A4F] text-white hover:bg-[#40916C] hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(45,106,79,0.3)] transition-all disabled:opacity-60 disabled:hover:translate-y-0"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : success ? "Saved ✓" : "Save settings"}
          </button>
        </div>
      </div>
    </div>
  );
}
