import { redirect } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { getCurrentUser } from "@/lib/supabase/auth";
import { prisma } from "@/lib/prisma";
import BillingActions from "./BillingActions";
import BillingPlanButton from "./BillingPlanButton";

const PRICE_STARTER = process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER ?? "";
const PRICE_PROFESSIONAL = process.env.NEXT_PUBLIC_STRIPE_PRICE_PROFESSIONAL ?? "";
const PRICE_STUDIO = process.env.NEXT_PUBLIC_STRIPE_PRICE_STUDIO ?? "";

const tiers = [
  {
    name: "Starter",
    price: "$99",
    priceId: PRICE_STARTER,
    desc: "Solo practices & small firms",
    features: [
      "Up to 5 users",
      "20 active projects",
      "Time tracking & budgets",
      "Basic reports",
      "Email support",
    ],
    featured: false,
  },
  {
    name: "Professional",
    price: "$199",
    priceId: PRICE_PROFESSIONAL,
    desc: "Growing firms",
    features: [
      "Up to 15 users",
      "Unlimited projects",
      "All modules included",
      "Client portal",
      "Priority support",
    ],
    featured: true,
  },
  {
    name: "Studio",
    price: "$349",
    priceId: PRICE_STUDIO,
    desc: "Multi-disciplinary studios",
    features: [
      "Unlimited users",
      "Unlimited projects",
      "All modules included",
      "Client portal",
      "Dedicated support",
    ],
    featured: false,
  },
];

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  const org = await prisma.organization.findUnique({
    where: { id: currentUser.organizationId },
  });

  if (!org) {
    redirect("/dashboard");
  }

  const isOwnerOrAdmin = currentUser.role === "OWNER" || currentUser.role === "ADMIN";

  const planLabel: Record<string, string> = {
    TRIAL: "Trial",
    STARTER: "Starter",
    PROFESSIONAL: "Professional",
    STUDIO: "Studio",
    ENTERPRISE: "Enterprise",
  };

  const statusLabel: Record<string, { text: string; color: string }> = {
    TRIALING: { text: "Trial active", color: "bg-[#F0FAF4] text-[#2D6A4F] border-[#52B788]/30" },
    ACTIVE: { text: "Active", color: "bg-[#F0FAF4] text-[#2D6A4F] border-[#52B788]/30" },
    PAST_DUE: { text: "Payment past due", color: "bg-amber-50 text-amber-700 border-amber-200" },
    CANCELED: { text: "Canceled", color: "bg-stone-50 text-stone-700 border-stone-200" },
    INCOMPLETE: { text: "Incomplete", color: "bg-amber-50 text-amber-700 border-amber-200" },
    INCOMPLETE_EXPIRED: { text: "Expired", color: "bg-rose-50 text-rose-700 border-rose-200" },
    UNPAID: { text: "Unpaid", color: "bg-rose-50 text-rose-700 border-rose-200" },
    PAUSED: { text: "Paused", color: "bg-stone-50 text-stone-700 border-stone-200" },
  };

  const status = org.subscriptionStatus ? statusLabel[org.subscriptionStatus] : null;
  const hasActiveSubscription = !!org.stripeSubscriptionId && org.subscriptionStatus !== "CANCELED";

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <Link href="/settings" className="text-sm text-[#6B8C74] hover:text-[#1A2E22] transition-colors">
          ← Back to Settings
        </Link>
        <h1 className="font-serif text-3xl text-[#1A2E22] mt-3">Billing & Subscription</h1>
        <p className="text-[#6B8C74] text-sm mt-1">
          Manage your Phasewise plan, payment method, and invoices.
        </p>
      </div>

      {params.status === "success" && (
        <div className="mb-6 bg-[#F0FAF4] border border-[#52B788]/30 rounded-xl p-4 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-[#2D6A4F] mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-[#1A2E22]">Subscription confirmed</p>
            <p className="text-xs text-[#6B8C74] mt-1">
              Your trial is active. We&apos;ll email you a receipt and reminders before billing starts.
            </p>
          </div>
        </div>
      )}
      {params.status === "canceled" && (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-700 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-amber-900">Checkout canceled</p>
            <p className="text-xs text-amber-800 mt-1">No charge was made. You can try again any time.</p>
          </div>
        </div>
      )}

      {/* Payment-issue banners. Surface clear, actionable copy whenever a
          subscription is in a failure state so the customer can self-serve
          before access lapses. */}
      {org.subscriptionStatus === "PAST_DUE" && isOwnerOrAdmin && (
        <div className="mb-6 bg-rose-50 border border-rose-300 rounded-xl p-5 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-700 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-rose-900">Your last payment failed</p>
            <p className="text-xs text-rose-800 mt-1">
              Update your payment method to keep using Phasewise. Your subscription will be canceled if the payment isn&apos;t resolved.
            </p>
            <div className="mt-3"><BillingActions /></div>
          </div>
        </div>
      )}

      {(org.subscriptionStatus === "INCOMPLETE" || org.subscriptionStatus === "UNPAID") && isOwnerOrAdmin && (
        <div className="mb-6 bg-amber-50 border border-amber-300 rounded-xl p-5 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-700 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-amber-900">
              {org.subscriptionStatus === "INCOMPLETE" ? "Subscription not yet active" : "Subscription unpaid"}
            </p>
            <p className="text-xs text-amber-800 mt-1">
              {org.subscriptionStatus === "INCOMPLETE"
                ? "Complete the initial payment to activate your plan."
                : "An invoice is unpaid. Settle the balance to restore access."}
            </p>
            <div className="mt-3"><BillingActions /></div>
          </div>
        </div>
      )}

      {org.subscriptionStatus === "INCOMPLETE_EXPIRED" && isOwnerOrAdmin && (
        <div className="mb-6 bg-rose-50 border border-rose-300 rounded-xl p-5 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-700 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-rose-900">Subscription setup expired</p>
            <p className="text-xs text-rose-800 mt-1">
              The initial payment wasn&apos;t completed in time. Pick a plan below to start over — no charge until your trial ends.
            </p>
          </div>
        </div>
      )}

      {/* Current plan card */}
      <div className="bg-white border border-[#E2EBE4] rounded-2xl p-6 mb-8 shadow-[0_4px_24px_rgba(26,46,34,0.04)]">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#40916C] mb-2">
              Current Plan
            </p>
            <div className="flex items-center gap-3">
              <h2 className="font-serif text-2xl text-[#1A2E22]">{planLabel[org.plan] ?? org.plan}</h2>
              {status && (
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${status.color}`}>
                  {status.text}
                </span>
              )}
            </div>
            {org.currentPeriodEnd && (
              <p className="text-sm text-[#6B8C74] mt-2">
                {org.cancelAtPeriodEnd
                  ? `Cancels on ${org.currentPeriodEnd.toLocaleDateString()}`
                  : `Renews on ${org.currentPeriodEnd.toLocaleDateString()}`}
              </p>
            )}
            {org.trialEndsAt && org.subscriptionStatus === "TRIALING" && (
              <p className="text-sm text-[#6B8C74] mt-1">
                Trial ends on {org.trialEndsAt.toLocaleDateString()}
              </p>
            )}
          </div>
          {hasActiveSubscription && isOwnerOrAdmin && <BillingActions />}
        </div>
      </div>

      {!hasActiveSubscription && (
        <div>
          <h3 className="font-serif text-xl text-[#1A2E22] mb-1">Choose a plan</h3>
          <p className="text-sm text-[#6B8C74] mb-6">14-day free trial. No credit card required to start.</p>
          {!isOwnerOrAdmin && (
            <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-700 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-amber-900">Permission required</p>
                <p className="text-xs text-amber-800 mt-1">
                  Only owners and admins can manage billing. Ask your firm owner to upgrade.
                </p>
              </div>
            </div>
          )}
          <div className="grid md:grid-cols-3 gap-4">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`relative rounded-2xl p-6 ${
                  tier.featured
                    ? "border border-[#2D6A4F] bg-[#1A2E22]"
                    : "border border-[#E2EBE4] bg-white"
                }`}
              >
                {tier.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#2D6A4F] text-white text-[10px] font-semibold tracking-[0.12em] uppercase px-3 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <div
                  className={`text-[10px] font-semibold tracking-[0.18em] uppercase mb-2 ${
                    tier.featured ? "text-[#52B788]" : "text-[#40916C]"
                  }`}
                >
                  {tier.name}
                </div>
                <div className={`font-serif text-3xl ${tier.featured ? "text-white" : "text-[#1A2E22]"}`}>
                  {tier.price}
                  <span className={`text-xs ml-1 ${tier.featured ? "text-white/40" : "text-[#A3BEA9]"}`}>
                    /mo
                  </span>
                </div>
                <p className={`text-xs mt-1 mb-4 ${tier.featured ? "text-white/40" : "text-[#A3BEA9]"}`}>
                  {tier.desc}
                </p>
                <ul className="space-y-2 mb-6">
                  {tier.features.map((feat) => (
                    <li
                      key={feat}
                      className={`flex gap-2 items-center text-xs ${
                        tier.featured ? "text-white/65" : "text-[#3D5C48]"
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3 flex-shrink-0" strokeWidth={2.5} />
                      {feat}
                    </li>
                  ))}
                </ul>
                <BillingPlanButton priceId={tier.priceId} featured={tier.featured} disabled={!isOwnerOrAdmin} />
              </div>
            ))}
          </div>
          {isOwnerOrAdmin && (
            <p className="text-xs text-[#A3BEA9] mt-6 text-center">
              You won&apos;t be charged until your 14-day trial ends. Cancel any time from this page.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
