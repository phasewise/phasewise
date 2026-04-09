"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

type Props = {
  priceId: string;
  featured?: boolean;
  label?: string;
};

export default function PricingButton({ priceId, featured = false, label = "Start Free Trial" }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });

      if (res.status === 401) {
        // Not logged in — send to signup with the priceId so we can resume after
        router.push(`/signup?priceId=${encodeURIComponent(priceId)}`);
        return;
      }

      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "Could not start checkout.");
        setLoading(false);
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        setError("No checkout URL returned.");
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  const baseClasses =
    "w-full inline-flex items-center justify-center gap-2 px-3 py-3.5 rounded-[7px] text-sm font-medium transition-all disabled:opacity-60 disabled:cursor-not-allowed";

  const featuredClasses =
    "bg-[#52B788] text-[#1A2E22] hover:bg-[#B7E4C7] hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(82,183,136,0.3)]";

  const defaultClasses =
    "bg-[#F0FAF4] text-[#2D6A4F] border border-[#B7E4C7] hover:bg-[#2D6A4F] hover:text-white hover:border-transparent";

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className={`${baseClasses} ${featured ? featuredClasses : defaultClasses}`}
      >
        {loading ? "Loading..." : label}
        {featured && !loading && <ArrowRight className="w-4 h-4" />}
      </button>
      {error && <p className="text-xs text-[#B04030] mt-2 text-center">{error}</p>}
    </>
  );
}
