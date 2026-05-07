import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, AlertCircle, Check, Lock } from "lucide-react";
import { getCurrentUser } from "@/lib/supabase/auth";
import { prisma } from "@/lib/prisma";
import PaymentsClient from "./PaymentsClient";

export const dynamic = "force-dynamic";

// /settings/payments — Stripe Connect onboarding entry point. The firm
// connects their own Stripe account (Express type) so future Payment
// Links route directly to their bank, not Phasewise's.
export default async function PaymentsSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; reason?: string }>;
}) {
  const params = await searchParams;
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/login");
  if (currentUser.role !== "OWNER" && currentUser.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const org = await prisma.organization.findUnique({
    where: { id: currentUser.organizationId },
    select: {
      stripeConnectedAccountId: true,
      stripeConnectChargesEnabled: true,
      stripeConnectConnectedAt: true,
    },
  });

  const isConfigured = Boolean(process.env.STRIPE_CONNECT_CLIENT_ID);
  const isConnected = Boolean(org?.stripeConnectedAccountId);
  const chargesEnabled = Boolean(org?.stripeConnectChargesEnabled);

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
        <h1 className="font-serif text-3xl text-[#1A2E22]">Payments</h1>
        <p className="mt-2 text-sm text-[#6B8C74]">
          Connect your firm&apos;s Stripe account so clients can pay invoices online with one click.
          Funds route directly to your bank — Phasewise stays out of the money path.
        </p>
      </div>

      {/* Status banner from OAuth callback */}
      {params.status === "connected" && (
        <div className="mb-6 rounded-2xl border border-[#52B788]/40 bg-[#F0FAF4] px-5 py-4 flex items-start gap-3">
          <Check className="w-5 h-5 text-[#2D6A4F] mt-0.5 flex-shrink-0" />
          <div className="text-sm text-[#1A2E22]">
            <p className="font-semibold">Stripe connected</p>
            <p className="text-xs text-[#3D5C48] mt-1">
              Your firm&apos;s Stripe account is now linked. Future invoices will include a Pay-now button.
            </p>
          </div>
        </div>
      )}

      {params.status === "error" && (
        <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-rose-900">
            <p className="font-semibold">Couldn&apos;t connect Stripe</p>
            <p className="text-xs text-rose-800 mt-1">
              Reason: <span className="font-mono">{params.reason ?? "unknown"}</span>. Try again, or
              contact us if the problem persists.
            </p>
          </div>
        </div>
      )}

      {/* Privacy / what-this-does block */}
      <div className="mb-6 rounded-2xl border border-[#52B788]/30 bg-[#F0FAF4] p-5">
        <div className="flex items-start gap-3">
          <Lock className="w-5 h-5 text-[#2D6A4F] mt-0.5 flex-shrink-0" strokeWidth={1.75} />
          <div className="text-sm text-[#1A2E22]">
            <p className="font-semibold mb-1">How this works</p>
            <ul className="text-xs text-[#3D5C48] space-y-1 list-disc pl-4">
              <li>
                You connect your own Stripe account via OAuth — Stripe handles KYC, bank
                verification, and tax forms. Phasewise never sees your bank credentials.
              </li>
              <li>
                When a client clicks <strong>Pay now</strong> on an invoice, Stripe processes the
                charge against your connected account. Funds settle directly to your bank.
              </li>
              <li>
                Stripe&apos;s standard fees apply (2.9% + 30¢ for cards, 0.8% capped at $5 for ACH).
                Phasewise charges nothing on top.
              </li>
              <li>
                You can disconnect any time — your Stripe account stays intact, you just lose the
                automated Pay-now button on Phasewise invoices.
              </li>
            </ul>
          </div>
        </div>
      </div>

      <PaymentsClient
        isConfigured={isConfigured}
        isConnected={isConnected}
        chargesEnabled={chargesEnabled}
        connectedAt={org?.stripeConnectConnectedAt?.toISOString() ?? null}
        accountIdMasked={org?.stripeConnectedAccountId
          ? `${org.stripeConnectedAccountId.slice(0, 8)}…${org.stripeConnectedAccountId.slice(-4)}`
          : null}
      />
    </div>
  );
}
