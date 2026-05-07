import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/supabase/auth";

export const dynamic = "force-dynamic";

/**
 * GET /api/stripe/connect/start
 *
 * Initiates the Stripe Connect OAuth flow for the current firm. Builds
 * the authorize URL with our connect client_id and the firm's id as
 * `state` (so we can verify on callback that the response belongs to
 * the same firm that initiated).
 *
 * Required env var:
 *   - STRIPE_CONNECT_CLIENT_ID — get from Stripe Dashboard → Connect →
 *     Settings → "OAuth integration" panel. Format: ca_XXX. Phasewise's
 *     existing STRIPE_SECRET_KEY doubles as the OAuth client_secret.
 *
 * Permissions: OWNER and ADMIN only — connecting a Stripe account is a
 * real financial integration, not a routine setting.
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

  const clientId = process.env.STRIPE_CONNECT_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json(
      {
        error:
          "Stripe Connect isn't configured yet. Set STRIPE_CONNECT_CLIENT_ID in Vercel env vars (find it in Stripe Dashboard → Connect → Settings).",
      },
      { status: 503 }
    );
  }

  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || "https://phasewise.io").replace(/\/$/, "");
  const redirectUri = `${baseUrl}/api/stripe/connect/callback`;

  // `state` carries the firm's id so we can verify on callback that the
  // OAuth response is for the same firm that initiated. Stripe forwards
  // it back unchanged.
  const state = currentUser.organizationId;

  const authorizeUrl = new URL("https://connect.stripe.com/oauth/authorize");
  authorizeUrl.searchParams.set("response_type", "code");
  authorizeUrl.searchParams.set("client_id", clientId);
  authorizeUrl.searchParams.set("scope", "read_write");
  authorizeUrl.searchParams.set("redirect_uri", redirectUri);
  authorizeUrl.searchParams.set("state", state);
  // Prefill what we know about the firm so the operator types less
  // during onboarding. All optional — Stripe ignores unknown fields.
  // (We could add more here later: business_type, country, etc.)
  // Use Express type for the lightest-weight onboarding flow.
  authorizeUrl.searchParams.set("stripe_user[business_type]", "company");

  // Browser-redirect — this isn't a JSON API for the client; clicking
  // the "Connect Stripe" button on /settings/payments hits this URL
  // and we send the user straight to Stripe.
  return NextResponse.redirect(authorizeUrl.toString());
}
