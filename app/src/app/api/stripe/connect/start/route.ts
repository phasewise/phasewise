import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/supabase/auth";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * GET /api/stripe/connect/start
 *
 * Initiates the modern Account Links onboarding flow for Stripe Connect
 * Express. Replaces the legacy OAuth flow which Stripe gates for new
 * platforms ("Cannot onboard via express oauth due to gated access").
 *
 * Flow:
 *   1. If we don't already have an account ID for this org, create a new
 *      Express account via stripe.accounts.create. Store the acct_* ID on
 *      the Organization immediately so we can reuse it if onboarding is
 *      interrupted.
 *   2. Mint a one-shot AccountLink (account_onboarding type) — this is
 *      a Stripe-hosted URL that walks the firm through KYC, bank, and
 *      identity. Links expire after a few minutes.
 *   3. Redirect the firm to that URL.
 *
 * Note on redirect URI whitelisting: Account Links don't use the OAuth
 * redirect URI whitelist in Stripe Dashboard. The return_url passed to
 * accountLinks.create is what Stripe redirects to. Whitelist entries
 * for the legacy OAuth flow are harmless — they just don't apply here.
 *
 * Permissions: OWNER and ADMIN only.
 */
export async function GET() {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }
  if (currentUser.role !== "OWNER" && currentUser.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Only owners and admins can connect Stripe." },
      { status: 403 }
    );
  }

  const org = await prisma.organization.findUnique({
    where: { id: currentUser.organizationId },
    select: { id: true, name: true, stripeConnectedAccountId: true },
  });
  if (!org) {
    return NextResponse.json({ error: "Organization not found." }, { status: 404 });
  }

  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || "https://phasewise.io").replace(/\/$/, "");

  // Reuse an existing pending account if this isn't the first attempt —
  // lets the firm pick up where they left off if they bailed mid-flow.
  let accountId = org.stripeConnectedAccountId;
  if (!accountId) {
    try {
      const account = await stripe.accounts.create({
        type: "express",
        country: "US",
        email: currentUser.email ?? undefined,
        business_profile: {
          name: org.name,
        },
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        metadata: {
          phasewiseOrgId: org.id,
        },
      });
      accountId = account.id;
      await prisma.organization.update({
        where: { id: org.id },
        data: { stripeConnectedAccountId: accountId },
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "account_create_failed";
      return NextResponse.redirect(
        `${baseUrl}/settings/payments?status=error&reason=${encodeURIComponent(message)}`
      );
    }
  }

  try {
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      // refresh_url is hit when a link expires before the firm finishes —
      // we just bounce them back through /start to mint a fresh link.
      refresh_url: `${baseUrl}/api/stripe/connect/start`,
      // return_url is hit when the firm clicks "Done" (or "Save and exit")
      // on Stripe's hosted onboarding. Our /callback verifies status.
      return_url: `${baseUrl}/api/stripe/connect/callback`,
      type: "account_onboarding",
    });
    return NextResponse.redirect(accountLink.url);
  } catch (err) {
    const message = err instanceof Error ? err.message : "account_link_failed";
    return NextResponse.redirect(
      `${baseUrl}/settings/payments?status=error&reason=${encodeURIComponent(message)}`
    );
  }
}
