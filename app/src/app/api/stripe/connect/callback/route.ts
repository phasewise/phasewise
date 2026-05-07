import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/supabase/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export const dynamic = "force-dynamic";

/**
 * GET /api/stripe/connect/callback
 *
 * Stripe redirects here after the firm completes (or exits) the Account
 * Links onboarding flow. Unlike the legacy OAuth callback, there's no
 * `code` to exchange — we already have the account ID stored from the
 * /start route. We just need to refetch the account and update the
 * charges_enabled flag.
 *
 * Behavior:
 *   - charges_enabled = true → firm is fully onboarded, mark connected
 *   - charges_enabled = false → firm exited before completing identity
 *     verification or bank link. Keep account ID stored (so resume works
 *     via /start), redirect with status=incomplete.
 */
export async function GET(request: Request) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (currentUser.role !== "OWNER" && currentUser.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || "https://phasewise.io").replace(/\/$/, "");
  const settingsUrl = `${baseUrl}/settings/payments`;

  const org = await prisma.organization.findUnique({
    where: { id: currentUser.organizationId },
    select: {
      stripeConnectedAccountId: true,
      stripeConnectConnectedAt: true,
    },
  });

  if (!org?.stripeConnectedAccountId) {
    // Edge case: callback hit without a /start having run first. Send
    // back to settings with a clear error.
    return NextResponse.redirect(`${settingsUrl}?status=error&reason=no_account_in_progress`);
  }

  try {
    const account = await stripe.accounts.retrieve(org.stripeConnectedAccountId);
    const chargesEnabled = !!account.charges_enabled;

    // Stamp connectedAt the first time charges go live. Don't bump it
    // on subsequent re-checks (preserves the original timestamp).
    const shouldStampConnectedAt = chargesEnabled && !org.stripeConnectConnectedAt;

    await prisma.organization.update({
      where: { id: currentUser.organizationId },
      data: {
        stripeConnectChargesEnabled: chargesEnabled,
        ...(shouldStampConnectedAt ? { stripeConnectConnectedAt: new Date() } : {}),
      },
    });

    return NextResponse.redirect(
      `${settingsUrl}?status=${chargesEnabled ? "connected" : "incomplete"}`
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "retrieve_failed";
    return NextResponse.redirect(
      `${settingsUrl}?status=error&reason=${encodeURIComponent(message)}`
    );
  }
}
