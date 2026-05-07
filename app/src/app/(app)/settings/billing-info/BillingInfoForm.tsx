"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Lock, Save, ShieldAlert } from "lucide-react";

type Props = {
  initial: {
    billingMailingAddress: string;
    billingFedId: string;
    billingAchRouting: string;
    billingAchAccount: string;
    billingWireRouting: string;
    billingWireAccount: string;
    // ISO string of when these fields were last touched, or null if
    // never set.
    billingInfoUpdatedAt: string | null;
    // Whether the Mail/ACH/Wire/Fed-ID block prints on invoices.
    // Default is true (industry-standard B2B); flip off when paired
    // with a hosted "Pay now" link so bank details stay private.
    printPaymentDetailsOnInvoice: boolean;
  };
};

function formatLastSaved(iso: string | null): string {
  if (!iso) return "Not yet saved";
  const d = new Date(iso);
  return `Last saved ${d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })}`;
}

export default function BillingInfoForm({ initial }: Props) {
  const [mailingAddress, setMailingAddress] = useState(initial.billingMailingAddress);
  const [fedId, setFedId] = useState(initial.billingFedId);
  const [achRouting, setAchRouting] = useState(initial.billingAchRouting);
  const [achAccount, setAchAccount] = useState(initial.billingAchAccount);
  const [wireRouting, setWireRouting] = useState(initial.billingWireRouting);
  const [wireAccount, setWireAccount] = useState(initial.billingWireAccount);
  const [printOnInvoice, setPrintOnInvoice] = useState(initial.printPaymentDetailsOnInvoice);
  const [lastSavedIso, setLastSavedIso] = useState(initial.billingInfoUpdatedAt);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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
        printPaymentDetailsOnInvoice: printOnInvoice,
      }),
    });

    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(data.error || "Failed to save settings.");
      return;
    }

    setLastSavedIso(data.org?.billingInfoUpdatedAt ?? new Date().toISOString());
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
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
          How clients pay you. These fields appear on every invoice PDF and the public invoice link so clients know how to remit payment.
        </p>
      </div>

      {/* Security disclosure — clients enter routing/account numbers
          here, so they need to know what protects this data. Honest
          about what's encrypted vs not, and who can see it. */}
      <div className="mb-6 rounded-2xl border border-[#52B788]/30 bg-[#F0FAF4] p-5">
        <div className="flex items-start gap-3">
          <Lock className="w-5 h-5 text-[#2D6A4F] mt-0.5 flex-shrink-0" strokeWidth={1.75} />
          <div className="text-sm text-[#1A2E22]">
            <p className="font-semibold mb-1">Your bank info is protected</p>
            <ul className="text-xs text-[#3D5C48] space-y-1 list-disc pl-4">
              <li>
                Encrypted in transit (TLS) and at rest (Supabase Postgres, US-West region) — same as the rest of your firm&apos;s data.
              </li>
              <li>
                Only your firm&apos;s <strong>OWNER and ADMIN</strong> roles can view or change these fields. Staff and PMs can&apos;t even read them via the API.
              </li>
              <li>
                Each firm&apos;s data is isolated — query scoping ensures other firms on Phasewise can&apos;t see your account numbers.
              </li>
              <li>
                These fields are blank by default. Phasewise never has access to your bank balance, statements, or transaction history — we only render what you type here onto the invoice you send.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Tradeoff note: printing routing/account on the invoice is
          industry standard for B2B (Caltrans / agencies / developers
          all expect it), but it does mean anyone who has a copy of the
          invoice has the bank info. */}
      <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <div className="flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-700 mt-0.5 flex-shrink-0" strokeWidth={1.75} />
          <div className="text-sm text-amber-900">
            <p className="font-semibold mb-1">A note on printing bank details</p>
            <p className="text-xs leading-relaxed">
              It&apos;s standard practice in B2B invoicing (especially for landscape architecture, AE, and CM firms) to print ACH and wire details on the invoice — public agencies like Caltrans and most enterprise APs expect them. But anyone with a copy of the invoice has the routing and account numbers.
            </p>
            <p className="text-xs leading-relaxed mt-2">
              The modern alternative is a hosted &quot;Pay online&quot; link (like Stripe / FreshBooks / QuickBooks Online) where the invoice just says &ldquo;Click here to pay&rdquo; and the bank details stay private. <strong>Stripe Payment Links integration is on the Phasewise roadmap</strong> — when it ships, you&apos;ll be able to send invoices without printing your bank info on them.
            </p>
            <p className="text-xs leading-relaxed mt-2">
              Until then, if you don&apos;t want a particular method on the invoice, leave that section blank. ACH-only is a reasonable middle ground (cheapest for clients, no card-fee skim).
            </p>
          </div>
        </div>
      </div>

      {/* Print-on-invoice toggle. Default ON keeps current behaviour;
          firms paired with a hosted Pay-now link (Stripe Payment Links,
          coming soon) can flip it off so the invoice doesn't carry
          their bank info. The toggle still saves; the rendering
          downstream (PDF + public viewer) reads the flag. */}
      <div className="mb-6 rounded-2xl border border-[#E2EBE4] bg-white p-5 flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm font-semibold text-[#1A2E22]">
            Print payment details on every invoice
          </p>
          <p className="text-xs text-[#6B8C74] mt-1 leading-relaxed">
            When ON (default), the Mail/ACH/Wire/Fed-ID block above renders on every invoice PDF and the public invoice page. When OFF, the invoice shows no bank info — pair with a hosted Pay-now link (Stripe Payment Links, coming soon) so clients still have a way to pay.
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={printOnInvoice}
          onClick={() => setPrintOnInvoice((v) => !v)}
          className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors flex-shrink-0 ${
            printOnInvoice ? "bg-[#2D6A4F]" : "bg-[#E2EBE4]"
          }`}
        >
          <span
            className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
              printOnInvoice ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
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
                placeholder={"McFly Studios\nPO Box 1985\nHill Valley, CA 95420"}
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
                placeholder="88-1985042"
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
            Most B2B clients prefer ACH — cheap, fast, no card-fee markup. Leave blank to omit from invoices.
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
                placeholder="000000000"
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
                placeholder="000000000000"
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
                placeholder="000000000"
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
                placeholder="000000000000"
              />
            </div>
          </div>
        </div>

        {error && <p className="text-sm text-[#B04030]">{error}</p>}

        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium bg-[#2D6A4F] text-white hover:bg-[#40916C] hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(45,106,79,0.3)] transition-all disabled:opacity-60 disabled:hover:translate-y-0"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : success ? "Saved ✓" : "Save billing info"}
          </button>
          <span className="text-xs text-[#A3BEA9]">{formatLastSaved(lastSavedIso)}</span>
        </div>
      </div>
    </div>
  );
}
