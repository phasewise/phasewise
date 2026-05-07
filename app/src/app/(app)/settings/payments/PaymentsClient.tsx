"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Zap, Unplug, AlertTriangle } from "lucide-react";

type Props = {
  // True when STRIPE_CONNECT_CLIENT_ID env var is set on the server.
  // When false, the Connect button is disabled and we show a clear
  // message instead — admin needs to add the env var first.
  isConfigured: boolean;
  // True when this firm has completed OAuth and we have an acct_* ID.
  isConnected: boolean;
  // True when Stripe says this connected account can actually charge.
  // Express accounts may be Connected but not yet chargesEnabled if
  // they're still completing identity verification.
  chargesEnabled: boolean;
  connectedAt: string | null;
  // First few + last few chars of the account ID — full ID stays
  // hidden so a screenshare can't leak it.
  accountIdMasked: string | null;
};

export default function PaymentsClient({
  isConfigured,
  isConnected,
  chargesEnabled,
  connectedAt,
  accountIdMasked,
}: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleConnect() {
    setError(null);
    if (!isConfigured) {
      setError(
        "Stripe Connect isn't configured yet. Ask your admin to add STRIPE_CONNECT_CLIENT_ID to Vercel."
      );
      return;
    }
    // Hard navigation — the start endpoint returns a 307 redirect to
    // Stripe, which doesn't play nicely with fetch. Just send the
    // browser there.
    window.location.href = "/api/stripe/connect/start";
  }

  async function handleDisconnect() {
    if (
      !confirm(
        "Disconnect Stripe? Future invoices won't include a Pay-now button until you reconnect. Your Stripe account stays intact at dashboard.stripe.com."
      )
    ) {
      return;
    }
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/stripe/connect/disconnect", { method: "POST" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Failed to disconnect.");
        return;
      }
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  // Not configured — admin needs to set STRIPE_CONNECT_CLIENT_ID
  if (!isConfigured) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-700 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-amber-900">
            <p className="font-semibold mb-1">Stripe Connect setup required</p>
            <p className="text-xs leading-relaxed">
              The Phasewise admin needs to enable Stripe Connect on the platform side before any
              firm can connect their account.
            </p>
            <ul className="text-xs leading-relaxed mt-2 list-disc pl-4 space-y-1">
              <li>
                Visit{" "}
                <a
                  href="https://dashboard.stripe.com/settings/connect"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline font-medium"
                >
                  Stripe Dashboard → Connect → Settings
                </a>
                , enable Connect, choose <strong>Express</strong>, and copy the OAuth client ID
                (starts with <span className="font-mono">ca_</span>).
              </li>
              <li>
                Set <span className="font-mono">STRIPE_CONNECT_CLIENT_ID</span> in Vercel env vars
                (Production + Preview).
              </li>
              <li>
                In Stripe Connect Settings → Integration, add the redirect URL:{" "}
                <span className="font-mono">https://phasewise.io/api/stripe/connect/callback</span>
              </li>
              <li>Redeploy. Reload this page. Connect button will be live.</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Configured + not connected → show the Connect button
  if (!isConnected) {
    return (
      <div className="rounded-2xl border border-[#E2EBE4] bg-white p-6 shadow-[0_4px_24px_rgba(26,46,34,0.04)]">
        <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#6B8C74] mb-2">
          Status
        </h2>
        <p className="text-sm text-[#3D5C48] mb-5">Not connected.</p>

        {error && (
          <div className="mb-4 rounded-lg bg-rose-50 border border-rose-200 px-3 py-2 text-xs text-rose-700">
            {error}
          </div>
        )}

        <button
          type="button"
          onClick={handleConnect}
          disabled={busy}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold bg-[#635BFF] text-white hover:bg-[#5851DB] hover:-translate-y-px transition-all disabled:opacity-60"
        >
          <Zap className="w-4 h-4" />
          Connect Stripe
        </button>
        <p className="mt-3 text-xs text-[#A3BEA9]">
          Opens the Stripe onboarding flow. Have your bank routing/account details handy — usually
          5-10 minutes.
        </p>
      </div>
    );
  }

  // Connected. Show status + disconnect.
  return (
    <div className="rounded-2xl border border-[#E2EBE4] bg-white p-6 shadow-[0_4px_24px_rgba(26,46,34,0.04)]">
      <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#6B8C74] mb-4">
        Status
      </h2>

      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#6B8C74]">Connected</span>
          <span className="text-[#2D6A4F] font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#2D6A4F]" />
            Yes
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#6B8C74]">Charges enabled</span>
          {chargesEnabled ? (
            <span className="text-[#2D6A4F] font-semibold">Yes</span>
          ) : (
            <span className="text-amber-700 font-semibold">Pending verification</span>
          )}
        </div>
        {connectedAt && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#6B8C74]">Connected on</span>
            <span className="text-[#1A2E22]">
              {new Date(connectedAt).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        )}
        {accountIdMasked && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#6B8C74]">Account</span>
            <span className="text-[#1A2E22] font-mono text-xs">{accountIdMasked}</span>
          </div>
        )}
      </div>

      {!chargesEnabled && (
        <div className="mb-5 rounded-lg bg-amber-50 border border-amber-200 px-3 py-3 text-xs text-amber-900">
          <p>
            Stripe is still verifying your account. Pay-now buttons on invoices will activate once
            verification completes — usually a few minutes to a few hours after onboarding. You can
            check progress at{" "}
            <a
              href="https://dashboard.stripe.com/account"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-medium"
            >
              dashboard.stripe.com
            </a>
            .
          </p>
          <p className="mt-2">
            If Stripe is asking for additional information, click below to finish onboarding.
          </p>
          <button
            type="button"
            onClick={handleConnect}
            className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold bg-amber-600 text-white hover:bg-amber-700 transition-colors"
          >
            Continue verification
          </button>
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-lg bg-rose-50 border border-rose-200 px-3 py-2 text-xs text-rose-700">
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={handleDisconnect}
        disabled={busy}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border border-rose-200 bg-white text-rose-700 hover:bg-rose-50 transition-colors disabled:opacity-60"
      >
        <Unplug className="w-4 h-4" />
        {busy ? "Disconnecting…" : "Disconnect Stripe"}
      </button>
    </div>
  );
}
