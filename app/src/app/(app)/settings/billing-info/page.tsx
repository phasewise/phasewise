"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

// Org-level billing info that prints on every invoice. All fields are
// optional — whatever's set, the PDF + public viewer renders. Without
// these, every Send-to-client triggers a back-and-forth ("how do I
// pay you?", "what's your EIN?"), which is the exact friction the
// brand promise is supposed to remove.

export default function BillingInfoPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [mailingAddress, setMailingAddress] = useState("");
  const [fedId, setFedId] = useState("");
  const [achRouting, setAchRouting] = useState("");
  const [achAccount, setAchAccount] = useState("");
  const [wireRouting, setWireRouting] = useState("");
  const [wireAccount, setWireAccount] = useState("");

  useEffect(() => {
    fetch("/api/settings/org")
      .then((res) => res.json())
      .then((data) => {
        if (data.org) {
          setMailingAddress(data.org.billingMailingAddress ?? "");
          setFedId(data.org.billingFedId ?? "");
          setAchRouting(data.org.billingAchRouting ?? "");
          setAchAccount(data.org.billingAchAccount ?? "");
          setWireRouting(data.org.billingWireRouting ?? "");
          setWireAccount(data.org.billingWireAccount ?? "");
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
        billingMailingAddress: mailingAddress,
        billingFedId: fedId,
        billingAchRouting: achRouting,
        billingAchAccount: achAccount,
        billingWireRouting: wireRouting,
        billingWireAccount: wireAccount,
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
        <h1 className="font-serif text-3xl text-[#1A2E22]">Billing Info</h1>
        <p className="mt-2 text-sm text-[#6B8C74]">
          How clients pay you. These fields appear on every invoice PDF and the public invoice page so clients have everything they need to remit payment.
        </p>
      </div>

      <div className="space-y-6">
        {/* Mailing address + Fed ID */}
        <div className="rounded-2xl border border-[#E2EBE4] bg-white p-6 sm:p-8 shadow-[0_4px_24px_rgba(26,46,34,0.04)]">
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#6B8C74] mb-4">
            Firm Identity
          </h2>

          <div className="space-y-5">
            <div>
              <label htmlFor="billing-mailing" className="text-sm font-medium text-[#3D5C48]">
                Mailing address
              </label>
              <p className="text-xs text-[#A3BEA9] mt-0.5 mb-2">
                Where clients should send paper checks. Multi-line, address format. Leave blank if you don&apos;t accept checks.
              </p>
              <textarea
                id="billing-mailing"
                value={mailingAddress}
                onChange={(e) => setMailingAddress(e.target.value)}
                rows={4}
                className="w-full rounded-lg border border-[#E2EBE4] bg-[#F7F9F7] px-4 py-3 text-sm text-[#1A2E22] outline-none focus:border-[#52B788] focus:bg-white"
                placeholder={"Gallo Designs\nPO Box 12345\nFresno, CA 93720"}
              />
            </div>

            <div>
              <label htmlFor="billing-fed" className="text-sm font-medium text-[#3D5C48]">
                Federal Tax ID (EIN)
              </label>
              <p className="text-xs text-[#A3BEA9] mt-0.5 mb-2">
                Required by US clients issuing 1099-NEC at year-end. Format: XX-XXXXXXX.
              </p>
              <input
                id="billing-fed"
                value={fedId}
                onChange={(e) => setFedId(e.target.value)}
                className="w-48 rounded-lg border border-[#E2EBE4] bg-[#F7F9F7] px-4 py-3 text-sm text-[#1A2E22] font-mono outline-none focus:border-[#52B788] focus:bg-white"
                placeholder="12-3456789"
              />
            </div>
          </div>
        </div>

        {/* ACH */}
        <div className="rounded-2xl border border-[#E2EBE4] bg-white p-6 sm:p-8 shadow-[0_4px_24px_rgba(26,46,34,0.04)]">
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#6B8C74] mb-1">
            ACH (Recommended)
          </h2>
          <p className="text-xs text-[#A3BEA9] mb-5">
            Most B2B clients prefer ACH — cheap, fast, no card-fee markup. Leave blank to omit.
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="ach-routing" className="text-sm font-medium text-[#3D5C48]">
                Routing number
              </label>
              <input
                id="ach-routing"
                value={achRouting}
                onChange={(e) => setAchRouting(e.target.value.replace(/[^0-9]/g, ""))}
                maxLength={9}
                className="mt-2 w-full rounded-lg border border-[#E2EBE4] bg-[#F7F9F7] px-4 py-3 text-sm text-[#1A2E22] font-mono outline-none focus:border-[#52B788] focus:bg-white"
                placeholder="123456789"
              />
            </div>
            <div>
              <label htmlFor="ach-account" className="text-sm font-medium text-[#3D5C48]">
                Account number
              </label>
              <input
                id="ach-account"
                value={achAccount}
                onChange={(e) => setAchAccount(e.target.value)}
                className="mt-2 w-full rounded-lg border border-[#E2EBE4] bg-[#F7F9F7] px-4 py-3 text-sm text-[#1A2E22] font-mono outline-none focus:border-[#52B788] focus:bg-white"
                placeholder="000123456789"
              />
            </div>
          </div>
        </div>

        {/* Wire */}
        <div className="rounded-2xl border border-[#E2EBE4] bg-white p-6 sm:p-8 shadow-[0_4px_24px_rgba(26,46,34,0.04)]">
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#6B8C74] mb-1">
            Wire Transfer
          </h2>
          <p className="text-xs text-[#A3BEA9] mb-5">
            For high-value or international payments. Often the same as ACH for domestic — fill in if your bank gave you separate wire instructions.
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="wire-routing" className="text-sm font-medium text-[#3D5C48]">
                Routing number
              </label>
              <input
                id="wire-routing"
                value={wireRouting}
                onChange={(e) => setWireRouting(e.target.value.replace(/[^0-9]/g, ""))}
                maxLength={9}
                className="mt-2 w-full rounded-lg border border-[#E2EBE4] bg-[#F7F9F7] px-4 py-3 text-sm text-[#1A2E22] font-mono outline-none focus:border-[#52B788] focus:bg-white"
                placeholder="123456789"
              />
            </div>
            <div>
              <label htmlFor="wire-account" className="text-sm font-medium text-[#3D5C48]">
                Account number
              </label>
              <input
                id="wire-account"
                value={wireAccount}
                onChange={(e) => setWireAccount(e.target.value)}
                className="mt-2 w-full rounded-lg border border-[#E2EBE4] bg-[#F7F9F7] px-4 py-3 text-sm text-[#1A2E22] font-mono outline-none focus:border-[#52B788] focus:bg-white"
                placeholder="000123456789"
              />
            </div>
          </div>
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
            {saving ? "Saving..." : success ? "Saved ✓" : "Save billing info"}
          </button>
        </div>
      </div>
    </div>
  );
}
