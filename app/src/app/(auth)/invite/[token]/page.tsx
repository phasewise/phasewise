"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

function PhaseLogo() {
  return (
    <div className="flex flex-col gap-[3px] justify-center">
      <span className="block h-1 rounded-sm" style={{ width: 22, background: "#52B788" }} />
      <span className="block h-1 rounded-sm" style={{ width: 16, background: "#40916C" }} />
      <span className="block h-1 rounded-sm" style={{ width: 20, background: "#2D6A4F" }} />
    </div>
  );
}

const ROLE_LABELS: Record<string, string> = {
  OWNER: "Owner",
  ADMIN: "Admin",
  SUPERVISOR: "Supervisor",
  PM: "Project Manager",
  STAFF: "Staff",
};

type InviteInfo = {
  email: string;
  role: string;
  organizationName: string;
  expiresAt: string;
};

export default function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const router = useRouter();

  const [info, setInfo] = useState<InviteInfo | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "invalid" | "submitting" | "done">("loading");
  const [errorMsg, setErrorMsg] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    fetch(`/api/invitations/${token}`)
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json();
          setErrorMsg(body.error || "Invalid invitation.");
          setStatus("invalid");
          return;
        }
        const data: InviteInfo = await res.json();
        setInfo(data);
        setStatus("ready");
      })
      .catch(() => {
        setErrorMsg("Failed to load invitation.");
        setStatus("invalid");
      });
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");

    if (password.length < 8) {
      setErrorMsg("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setStatus("submitting");

    try {
      const res = await fetch(`/api/invitations/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const body = await res.json();
        setErrorMsg(body.error || "Failed to accept invitation.");
        setStatus("ready");
        return;
      }

      setStatus("done");
      router.push("/dashboard");
      router.refresh();
    } catch {
      setErrorMsg("Something went wrong. Please try again.");
      setStatus("ready");
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F9F7] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <PhaseLogo />
          <span className="text-lg tracking-tight text-[#1A2E22]">
            <span className="font-semibold">phase</span>
            <span className="text-[#52B788]">wise</span>
          </span>
        </div>

        {/* Loading */}
        {status === "loading" && (
          <div className="bg-white border border-[#E2EBE4] rounded-2xl shadow-sm p-8 text-center">
            <div className="animate-pulse space-y-3">
              <div className="h-6 w-48 bg-[#E2EBE4] rounded mx-auto" />
              <div className="h-4 w-32 bg-[#E2EBE4] rounded mx-auto" />
            </div>
          </div>
        )}

        {/* Invalid / expired */}
        {status === "invalid" && (
          <div className="bg-white border border-[#E2EBE4] rounded-2xl shadow-sm p-8 text-center">
            <h1 className="font-serif text-2xl text-[#1A2E22] mb-3">
              Invitation unavailable
            </h1>
            <p className="text-sm text-[#6B8C74] mb-6">{errorMsg}</p>
            <Link
              href="/login"
              className="inline-block bg-[#2D6A4F] hover:bg-[#40916C] text-white font-medium py-2.5 px-6 rounded-lg text-sm transition-all"
            >
              Go to login
            </Link>
          </div>
        )}

        {/* Acceptance form */}
        {(status === "ready" || status === "submitting") && info && (
          <div className="bg-white border border-[#E2EBE4] rounded-2xl shadow-sm p-8">
            <h1 className="font-serif text-2xl text-[#1A2E22] mb-1 text-center">
              Join {info.organizationName}
            </h1>
            <p className="text-sm text-[#6B8C74] text-center mb-6">
              You&apos;ve been invited as{" "}
              <span className="inline-block text-xs font-medium px-2 py-0.5 rounded-full bg-[#F0FAF4] text-[#2D6A4F]">
                {ROLE_LABELS[info.role] || info.role}
              </span>
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="invite-email" className="text-sm text-[#3D5C48] block mb-1.5 font-medium">Email</label>
                <input
                  id="invite-email"
                  type="email"
                  value={info.email}
                  disabled
                  autoComplete="email"
                  className="w-full bg-[#F0F2F0] border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-[#6B8C74] text-sm cursor-not-allowed"
                />
              </div>

              <div>
                <label htmlFor="invite-password" className="text-sm text-[#3D5C48] block mb-1.5 font-medium">
                  Create a password
                </label>
                <div className="relative">
                  <input
                    id="invite-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    autoComplete="new-password"
                    placeholder="Minimum 8 characters"
                    className="w-full bg-[#F7F9F7] border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-[#1A2E22] text-sm focus:outline-none focus:border-[#52B788] focus:bg-white transition-colors pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A3BEA9] hover:text-[#3D5C48] transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="invite-password-confirm" className="text-sm text-[#3D5C48] block mb-1.5 font-medium">
                  Confirm password
                </label>
                <input
                  id="invite-password-confirm"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  placeholder="Re-enter your password"
                  className="w-full bg-[#F7F9F7] border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-[#1A2E22] text-sm focus:outline-none focus:border-[#52B788] focus:bg-white transition-colors"
                />
              </div>

              {errorMsg && <p className="text-[#B04030] text-sm">{errorMsg}</p>}

              <button
                type="submit"
                disabled={status === "submitting"}
                className="w-full bg-[#2D6A4F] hover:bg-[#40916C] text-white font-medium py-2.5 rounded-lg text-sm transition-all disabled:opacity-60"
              >
                {status === "submitting" ? "Joining..." : "Join team"}
              </button>
            </form>

            <p className="text-center text-xs text-[#A3BEA9] mt-4">
              Already have an account?{" "}
              <Link href="/login" className="text-[#2D6A4F] font-medium hover:underline">
                Log in
              </Link>
            </p>
          </div>
        )}

        {/* Done */}
        {status === "done" && (
          <div className="bg-white border border-[#E2EBE4] rounded-2xl shadow-sm p-8 text-center">
            <h1 className="font-serif text-2xl text-[#1A2E22] mb-3">Welcome aboard!</h1>
            <p className="text-sm text-[#6B8C74]">Redirecting to your dashboard...</p>
          </div>
        )}
      </div>
    </div>
  );
}
