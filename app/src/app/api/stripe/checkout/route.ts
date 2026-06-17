import { NextResponse } from "next/server";
import { stripe, planFromPriceId } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/supabase/auth";

export const dynamic = "force-dynamic";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://phasewise.io";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { priceId, couponCode } = body as { priceId?: string; couponCode?: string };

    if (!priceId) {
      return NextResponse.json({ error: "priceId is required." }, { status: 400 });
    }

    // Validate the price ID maps to a known plan
    const targetPlan = planFromPriceId(priceId);
    if (!targetPlan) {
      return NextResponse.json({ error: "Invalid priceId." }, { status: 400 });
    }

    // Auth: must be logged in to start checkout
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    // Only OWNER and ADMIN can manage billing
    if (currentUser.role !== "OWNER" && currentUser.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only owners and admins can manage billing." },
        { status: 403 }
      );
    }

    const org = await prisma.organization.findUnique({
      where: { id: currentUser.organizationId },
    });

    if (!org) {
      return NextResponse.json({ error: "Organization not found." }, { status: 404 });
    }

    // Reuse existing Stripe customer if we have one, otherwise create one
    let customerId = org.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: currentUser.email,
        name: org.name,
        metadata: {
          organizationId: org.id,
          createdBy: currentUser.id,
        },
      });
      customerId = customer.id;
      await prisma.organization.update({
        where: { id: org.id },
        data: { stripeCustomerId: customerId },
      });
    }

    // Build the session params. Trial only applies on first paid signup.
    const isFirstSubscription = !org.stripeSubscriptionId;

    // Founding Member flag — set when checkout runs with the FOUNDING50
    // coupon so the webhook can promote the org to isFoundingMember=true
    // once Stripe confirms the subscription. (Reading the coupon ID off
    // the subscription afterwards requires expand+API-version juggling;
    // metadata is a stable, version-agnostic signal we control.)
    const FOUNDING_COUPON_ID = "FOUNDING50";
    const isFoundingMemberCheckout = couponCode === FOUNDING_COUPON_ID;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: {
        ...(isFirstSubscription && { trial_period_days: 14 }),
        metadata: {
          organizationId: org.id,
          ...(isFoundingMemberCheckout && { foundingMember: "true" }),
        },
      },
      // Stripe treats discounts + allow_promotion_codes as mutually exclusive
      // (even when allow_promotion_codes is false). Set exactly one.
      ...(couponCode
        ? { discounts: [{ coupon: couponCode }] }
        : { allow_promotion_codes: true }),
      automatic_tax: { enabled: true },
      tax_id_collection: { enabled: true },
      customer_update: {
        address: "auto",
        name: "auto",
      },
      billing_address_collection: "required",
      success_url: `${APP_URL}/settings/billing?session_id={CHECKOUT_SESSION_ID}&status=success`,
      cancel_url: `${APP_URL}/settings/billing?status=canceled`,
      metadata: {
        organizationId: org.id,
        targetPlan,
        ...(isFoundingMemberCheckout && { foundingMember: "true" }),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    const message = error instanceof Error ? error.message : "Failed to create checkout session.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
