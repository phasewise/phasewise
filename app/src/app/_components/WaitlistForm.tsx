"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [firmName, setFirmName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, firmName }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "Could not save your spot.");
        setLoading(false);
        return;
      }
      setSuccess(true);
      setLoading(false);
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="bg-[#F0FAF4] border border-[#52B788]/30 rounded-2xl p-6 sm:p-8 text-center">
        <CheckCircle2 className="w-10 h-10 text-[#2D6A4F] mx-auto mb-3" strokeWidth={1.5} />
        <h3 className="font-serif text-xl sm:text-2xl text-[#1A2E22] mb-2">You&apos;re on the list</h3>
        <p className="text-sm sm:text-base text-[#6B8C74]">
          We&apos;ll email you when {firmName ? firmName : "your firm"} can join the beta.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-[#E2EBE4] rounded-2xl p-6 sm:p-8 shadow-[0_4px_24px_rgba(26,46,34,0.06)]"
    >
      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="waitlist-firm" className="text-sm text-[#3D5C48] block mb-1.5 font-medium">Firm name</label>
          <input
            id="waitlist-firm"
            type="text"
            value={firmName}
            onChange={(e) => setFirmName(e.target.value)}
            autoComplete="organization"
            className="w-full bg-[#F7F9F7] border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-[#1A2E22] text-sm focus:outline-none focus:border-[#52B788] focus:bg-white transition-colors"
            placeholder="Meridian Landscape Studio"
          />
        </div>
        <div>
          <label htmlFor="waitlist-email" className="text-sm text-[#3D5C48] block mb-1.5 font-medium">Work email</label>
          <input
            id="waitlist-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="w-full bg-[#F7F9F7] border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-[#1A2E22] text-sm focus:outline-none focus:border-[#52B788] focus:bg-white transition-colors"
            placeholder="ada@meridian.design"
          />
        </div>
      </div>

      {error && <p className="text-[#B04030] text-sm mb-3">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#2D6A4F] hover:bg-[#40916C] text-white font-medium py-3 rounded-lg text-sm transition-all disabled:opacity-60 hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(45,106,79,0.3)]"
      >
        {loading ? "Saving your spot..." : "Join the beta waitlist"}
      </button>

      <p className="text-[11px] text-[#A3BEA9] mt-3 text-center tracking-wide">
        We&apos;ll only email you about Phasewise. Unsubscribe anytime.
      </p>
    </form>
  );
}
