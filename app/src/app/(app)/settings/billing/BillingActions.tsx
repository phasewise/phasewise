"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";

export default function BillingActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function openPortal() {
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "Could not open billing portal.");
        setLoading(false);
        return;
      }
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={openPortal}
        disabled={loading}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-[#2D6A4F] text-white hover:bg-[#40916C] hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(45,106,79,0.3)] transition-all disabled:opacity-60"
      >
        {loading ? "Opening..." : "Manage subscription"}
        <ExternalLink className="w-3.5 h-3.5" />
      </button>
      {error && <p className="text-xs text-[#B04030]">{error}</p>}
    </div>
  );
}
