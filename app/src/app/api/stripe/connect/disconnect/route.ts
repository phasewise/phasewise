import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/supabase/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export const dynamic = "force-dynamic";

/**
 * POST /api/stripe/connect/disconnect
 *
 * Disconnects the firm's Stripe Connect account from Phasewise.
 * Calls Stripe to deauthorize on their side, then clears the local
 * Organization fields.
 *
 * Important: this does NOT delete the firm's Stripe account itself
 * — the firm keeps full control via dashboard.stripe.com. It only
 * severs the link between Phasewise and that account, so we can no
 * longer create Payment Links on their behalf.
 */
export async function POST() {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }
  if (currentUser.role !== "OWNER" && currentUser.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Only owners and admins can disconnect Stripe." },
      { status: 403 }
    );
  }

  const org = await prisma.organization.findUnique({
    where: { id: currentUser.organizationId },
    select: { stripeConnectedAccountId: true },
  });

  if (!org?.stripeConnectedAccountId) {
    return NextResponse.json(
      { error: "No Stripe account is connected." },
      { status: 400 }
    );
  }

  const clientId = process.env.STRIPE_CONNECT_CLIENT_ID;

  // Best-effort deauth on Stripe's side. If the call fails (e.g. the
  // account was already removed manually), we still want to clear the
  // local fields — leaving them set would mean the firm sees "Connected"
  // but can't actually charge anything.
  if (clientId) {
    try {
      await stripe.oauth.deauthorize({
        client_id: clientId,
        stripe_user_id: org.stripeConnectedAccountId,
      });
    } catch (err) {
      console.warn("Stripe Connect deauthorize failed (continuing):", err);
    }
  }

  await prisma.organization.update({
    where: { id: currentUser.organizationId },
    data: {
      stripeConnectedAccountId: null,
      stripeConnectChargesEnabled: false,
      stripeConnectConnectedAt: null,
    },
  });

  return NextResponse.json({ success: true });
}
