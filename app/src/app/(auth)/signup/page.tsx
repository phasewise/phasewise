"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function PhaseLogo() {
  return (
    <div className="flex flex-col gap-[3px] justify-center">
      <span className="block h-1 rounded-sm" style={{ width: 22, background: "#52B788" }} />
      <span className="block h-1 rounded-sm" style={{ width: 16, background: "#40916C" }} />
      <span className="block h-1 rounded-sm" style={{ width: 20, background: "#2D6A4F" }} />
    </div>
  );
}

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [firmName, setFirmName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();

    // Sign up with Supabase Auth
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          firm_name: firmName,
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (!data.user) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
      return;
    }

    // Create organization and user via API
    const res = await fetch("/api/auth/setup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        authId: data.user.id,
        fullName,
        firmName,
        email,
      }),
    });

    if (!res.ok) {
      const body = await res.json();
      setError(body.error || "Failed to set up account.");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#F7F9F7] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <Link href="/" className="flex items-center justify-center gap-2.5 mb-10 no-underline">
          <PhaseLogo />
          <span className="text-[19px] font-semibold tracking-[-0.4px] text-[#1A2E22]">
            phase<em className="not-italic font-light text-[#2D6A4F]">wise</em>
          </span>
        </Link>

        <div className="bg-white border border-[#E2EBE4] rounded-[14px] p-8 shadow-[0_4px_24px_rgba(26,46,34,0.06)]">
          <h1 className="font-serif text-2xl text-[#1A2E22] mb-1">Start your free trial</h1>
          <p className="text-[#6B8C74] text-sm mb-6">14 days free. No credit card required.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-[#3D5C48] block mb-1.5 font-medium">Your name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full bg-[#F7F9F7] border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-[#1A2E22] text-sm focus:outline-none focus:border-[#52B788] focus:bg-white transition-colors"
                placeholder="Kevin Gallo"
              />
            </div>
            <div>
              <label className="text-sm text-[#3D5C48] block mb-1.5 font-medium">Firm name</label>
              <input
                type="text"
                value={firmName}
                onChange={(e) => setFirmName(e.target.value)}
                required
                className="w-full bg-[#F7F9F7] border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-[#1A2E22] text-sm focus:outline-none focus:border-[#52B788] focus:bg-white transition-colors"
                placeholder="Gallo Landscape Architecture"
              />
            </div>
            <div>
              <label className="text-sm text-[#3D5C48] block mb-1.5 font-medium">Work email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#F7F9F7] border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-[#1A2E22] text-sm focus:outline-none focus:border-[#52B788] focus:bg-white transition-colors"
                placeholder="kevin@firm.com"
              />
            </div>
            <div>
              <label className="text-sm text-[#3D5C48] block mb-1.5 font-medium">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full bg-[#F7F9F7] border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-[#1A2E22] text-sm focus:outline-none focus:border-[#52B788] focus:bg-white transition-colors"
                placeholder="Min 8 characters"
              />
            </div>

            {error && <p className="text-[#B04030] text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2D6A4F] hover:bg-[#40916C] text-white font-medium py-3 rounded-lg text-sm transition-all disabled:opacity-60 hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(45,106,79,0.3)]"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>
        </div>

        <p className="text-center text-[#6B8C74] text-sm mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-[#2D6A4F] font-medium hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
