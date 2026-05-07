import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/supabase/auth";
import { prisma } from "@/lib/prisma";

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

  // Account Links flow: there's no "deauthorize" call — the connected
  // account exists under our platform until we delete it or the firm
  // requests deletion. For our use case "disconnect" just means: this
  // firm no longer wants to use this account for Phasewise invoicing.
  // Clear the local fields and we're done. If they reconnect later we
  // can either reuse the account or create a new one (the old account
  // stays orphaned under the platform until a manual cleanup).
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
