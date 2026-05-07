import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/supabase/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export const dynamic = "force-dynamic";

/**
 * GET /api/stripe/connect/callback
 *
 * Stripe redirects here after the firm completes OAuth onboarding.
 * Query params:
 *   - code: the authorization code we exchange for an access token
 *   - state: the organization ID we sent (verifies the response is
 *            for the firm that initiated the request)
 *   - error: present when the firm cancelled or onboarding failed
 *
 * On success:
 *   - Exchange code for `stripe_user_id` (the connected account ID)
 *   - Save it to Organization.stripeConnectedAccountId
 *   - Redirect to /settings/payments?status=connected
 *
 * On error:
 *   - Redirect to /settings/payments?status=error&reason=...
 */
export async function GET(request: Request) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    // Not authenticated — bounce to login. The OAuth-popup flow keeps
    // the user logged in throughout, so this should be rare.
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (currentUser.role !== "OWNER" && currentUser.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || "https://phasewise.io").replace(/\/$/, "");
  const settingsUrl = `${baseUrl}/settings/payments`;

  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");
  const errorDescription = url.searchParams.get("error_description");

  if (error) {
    const reason = encodeURIComponent(errorDescription || error);
    return NextResponse.redirect(`${settingsUrl}?status=error&reason=${reason}`);
  }

  if (!code) {
    return NextResponse.redirect(`${settingsUrl}?status=error&reason=missing_code`);
  }

  // Verify state matches the current user's org — prevents OAuth flows
  // initiated by one firm from being completed against another.
  if (state !== currentUser.organizationId) {
    return NextResponse.redirect(`${settingsUrl}?status=error&reason=state_mismatch`);
  }

  try {
    // Exchange the authorization code for a connected-account token.
    // Stripe returns `stripe_user_id` (the acct_* ID we store) and a
    // refresh token. We don't currently use the refresh token because
    // Stripe Connect Express accounts handle their own re-auth, but
    // it's worth saving for future Stripe API features that need it.
    const tokenResponse = await stripe.oauth.token({
      grant_type: "authorization_code",
      code,
    });

    const connectedAccountId = tokenResponse.stripe_user_id;
    if (!connectedAccountId) {
      return NextResponse.redirect(`${settingsUrl}?status=error&reason=no_account_id`);
    }

    // Look up the freshly-onboarded account to read whether charges
    // are enabled. Express accounts may need additional verification
    // before they can actually process payments — we surface that
    // status to the firm.
    let chargesEnabled = false;
    try {
      const account = await stripe.accounts.retrieve(connectedAccountId);
      chargesEnabled = !!account.charges_enabled;
    } catch {
      // Don't fail the connection if the lookup hiccups; we'll re-check
      // when the firm visits the page later. Default to false.
    }

    await prisma.organization.update({
      where: { id: currentUser.organizationId },
      data: {
        stripeConnectedAccountId: connectedAccountId,
        stripeConnectChargesEnabled: chargesEnabled,
        stripeConnectConnectedAt: new Date(),
      },
    });

    return NextResponse.redirect(`${settingsUrl}?status=connected`);
  } catch (err) {
    console.error("Stripe Connect callback failed:", err);
    const reason = encodeURIComponent(err instanceof Error ? err.message : "exchange_failed");
    return NextResponse.redirect(`${settingsUrl}?status=error&reason=${reason}`);
  }
}
