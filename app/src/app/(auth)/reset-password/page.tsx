"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
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

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const router = useRouter();

  // The auth callback route (/api/auth/callback) exchanges the PKCE code
  // for a session before redirecting here. Check for that session.
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setReady(true);
      } else {
        // Fallback: listen for auth state change in case session isn't
        // immediately available (e.g. cookie propagation delay).
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
          if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
            setReady(true);
          }
        });
        // If still not ready after 3 seconds, show an error
        const timeout = setTimeout(() => {
          setReady(false);
          setError("Reset link expired or is invalid. Please request a new one.");
        }, 3000);
        return () => {
          subscription.unsubscribe();
          clearTimeout(timeout);
        };
      }
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#F7F9F7] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <Link href="/" className="flex items-center justify-center gap-2.5 mb-10 no-underline">
          <PhaseLogo />
          <span className="text-[19px] font-semibold tracking-[-0.4px] text-[#1A2E22]">
            phase<em className="not-italic font-light text-[#2D6A4F]">wise</em>
          </span>
        </Link>

        <div className="bg-white border border-[#E2EBE4] rounded-[14px] p-8 shadow-[0_4px_24px_rgba(26,46,34,0.06)]">
          <h1 className="font-serif text-2xl text-[#1A2E22] mb-1">Set a new password</h1>
          <p className="text-[#6B8C74] text-sm mb-6">
            Choose a password at least 8 characters long.
          </p>

          {!ready ? (
            <div className="text-center py-6">
              {error ? (
                <>
                  <p className="text-[#B04030] text-sm mb-4">{error}</p>
                  <Link
                    href="/forgot-password"
                    className="text-[#2D6A4F] text-sm font-medium hover:underline"
                  >
                    Request a new reset link
                  </Link>
                </>
              ) : (
                <p className="text-[#6B8C74] text-sm">Verifying your reset link...</p>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="reset-password" className="text-sm text-[#3D5C48] block mb-1.5 font-medium">New password</label>
                <div className="relative">
                  <input
                    id="reset-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    autoComplete="new-password"
                    className="w-full bg-[#F7F9F7] border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 pr-10 text-[#1A2E22] text-sm focus:outline-none focus:border-[#52B788] focus:bg-white transition-colors"
                    placeholder="Min 8 characters"
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
                <label htmlFor="reset-password-confirm" className="text-sm text-[#3D5C48] block mb-1.5 font-medium">Confirm new password</label>
                <div className="relative">
                  <input
                    id="reset-password-confirm"
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={8}
                    autoComplete="new-password"
                    className="w-full bg-[#F7F9F7] border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 pr-10 text-[#1A2E22] text-sm focus:outline-none focus:border-[#52B788] focus:bg-white transition-colors"
                    placeholder="Re-enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    aria-label={showConfirm ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A3BEA9] hover:text-[#3D5C48] transition-colors"
                    tabIndex={-1}
                  >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && <p className="text-[#B04030] text-sm">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#2D6A4F] hover:bg-[#40916C] text-white font-medium py-3 rounded-lg text-sm transition-all disabled:opacity-60 hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(45,106,79,0.3)]"
              >
                {loading ? "Updating password..." : "Update password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
