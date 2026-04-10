import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe, planFromPriceId } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { sendTransactional, LOOPS_TEMPLATES } from "@/lib/loops";
import type { SubscriptionStatus, Plan } from "@prisma/client";

const PLAN_DISPLAY_NAME: Record<Plan, string> = {
  TRIAL: "Trial",
  STARTER: "Starter",
  PROFESSIONAL: "Professional",
  STUDIO: "Studio",
  ENTERPRISE: "Enterprise",
};

export const dynamic = "force-dynamic";

// Stripe needs the raw request body to verify the signature.
// Next.js App Router gives us request.text() which is what we want.
export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header." }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not set");
    return NextResponse.json({ error: "Webhook not configured." }, { status: 500 });
  }

  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid signature";
    console.error("Webhook signature verification failed:", message);
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode === "subscription" && session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            typeof session.subscription === "string"
              ? session.subscription
              : session.subscription.id
          );
          await syncSubscriptionToOrg(subscription);
          // Welcome-to-paid email — fires once when trial begins
          await sendTrialStartedEmail(subscription);
        }
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.trial_will_end": {
        const subscription = event.data.object as Stripe.Subscription;
        await syncSubscriptionToOrg(subscription);
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;

        // Detect a fresh "cancel at period end" transition. We compare the
        // org's current state in the DB BEFORE the sync — if cancelAtPeriodEnd
        // was false and the new event has it true, the user just clicked
        // "Cancel subscription" in the Customer Portal. Send the canceled
        // email even though Stripe won't fire customer.subscription.deleted
        // until the period actually ends.
        const subWithCancel = subscription as unknown as { cancel_at_period_end?: boolean };
        const newCancelFlag = subWithCancel.cancel_at_period_end === true;

        const customerId =
          typeof subscription.customer === "string"
            ? subscription.customer
            : subscription.customer.id;
        const existingOrg = await prisma.organization.findFirst({
          where: { stripeCustomerId: customerId },
          select: { cancelAtPeriodEnd: true },
        });
        const wasNotCanceling = existingOrg?.cancelAtPeriodEnd === false;

        await syncSubscriptionToOrg(subscription);

        if (newCancelFlag && wasNotCanceling) {
          await sendCanceledEmail(subscription);
        }
        break;
      }

      case "customer.subscription.deleted": {
        // Fires when the subscription period actually ends after a
        // cancel-at-period-end, OR when "Cancel immediately" is used.
        // We always sync state. Only send the canceled email here if the
        // org wasn't already in a "canceling at period end" state — that
        // means we never sent the email via the updated branch above,
        // which happens with immediate cancellation.
        const subscription = event.data.object as Stripe.Subscription;
        const customerId =
          typeof subscription.customer === "string"
            ? subscription.customer
            : subscription.customer.id;
        const existingOrg = await prisma.organization.findFirst({
          where: { stripeCustomerId: customerId },
          select: { cancelAtPeriodEnd: true },
        });
        const alreadyEmailedForCancellation = existingOrg?.cancelAtPeriodEnd === true;

        await markSubscriptionCanceled(subscription);

        if (!alreadyEmailedForCancellation) {
          await sendCanceledEmail(subscription);
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        // Cast through unknown since Stripe v22 types put `subscription` on the
        // expanded line item but the field is still present on the invoice object.
        const invoiceWithSub = invoice as unknown as { subscription?: string | Stripe.Subscription | null };
        const subId = invoiceWithSub.subscription;
        if (subId) {
          const subscription = await stripe.subscriptions.retrieve(
            typeof subId === "string" ? subId : subId.id
          );
          await syncSubscriptionToOrg(subscription);
          await sendPaymentFailedEmail(subscription);
        }
        break;
      }

      default:
        // Ignore events we don't care about
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error(`Error handling webhook event ${event.type}:`, error);
    const message = error instanceof Error ? error.message : "Webhook handler failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * Sync a Stripe subscription to the matching Organization in our DB.
 * Looks up the org via stripeCustomerId or via subscription metadata.
 */
async function syncSubscriptionToOrg(subscription: Stripe.Subscription) {
  const customerId =
    typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id;

  // Find the org — try metadata first (most reliable), then fall back to customer ID
  const orgIdFromMetadata = subscription.metadata?.organizationId;

  const org = orgIdFromMetadata
    ? await prisma.organization.findUnique({ where: { id: orgIdFromMetadata } })
    : await prisma.organization.findFirst({ where: { stripeCustomerId: customerId } });

  if (!org) {
    console.warn(`No org found for subscription ${subscription.id} (customer ${customerId})`);
    return;
  }

  const priceId = subscription.items.data[0]?.price.id;
  const plan = planFromPriceId(priceId) ?? "STARTER";

  // Stripe v22 uses subscription items for period dates — get the first item's period_end
  // as the subscription period end. Fall back to subscription-level fields if available.
  const subWithPeriod = subscription as unknown as {
    current_period_end?: number;
    cancel_at_period_end?: boolean;
  };
  const item = subscription.items.data[0] as unknown as { current_period_end?: number };
  const periodEndSeconds = subWithPeriod.current_period_end ?? item?.current_period_end;
  const periodEnd = periodEndSeconds ? new Date(periodEndSeconds * 1000) : null;

  await prisma.organization.update({
    where: { id: org.id },
    data: {
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscription.id,
      stripePriceId: priceId ?? null,
      subscriptionStatus: mapStripeStatus(subscription.status),
      currentPeriodEnd: periodEnd,
      cancelAtPeriodEnd: subWithPeriod.cancel_at_period_end ?? false,
      plan: subscription.status === "active" || subscription.status === "trialing" ? plan : "TRIAL",
      trialEndsAt: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
    },
  });
}

/**
 * Mark a subscription as canceled — keeps the customer ID for potential reactivation
 * but resets the org back to TRIAL plan.
 */
async function markSubscriptionCanceled(subscription: Stripe.Subscription) {
  const customerId =
    typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id;

  const org = await prisma.organization.findFirst({
    where: { stripeCustomerId: customerId },
  });

  if (!org) {
    console.warn(`No org found for canceled subscription ${subscription.id}`);
    return;
  }

  await prisma.organization.update({
    where: { id: org.id },
    data: {
      subscriptionStatus: "CANCELED",
      cancelAtPeriodEnd: false,
      plan: "TRIAL",
      stripeSubscriptionId: null,
      stripePriceId: null,
    },
  });
}

function mapStripeStatus(status: Stripe.Subscription.Status): SubscriptionStatus {
  const map: Record<Stripe.Subscription.Status, SubscriptionStatus> = {
    trialing: "TRIALING",
    active: "ACTIVE",
    past_due: "PAST_DUE",
    canceled: "CANCELED",
    incomplete: "INCOMPLETE",
    incomplete_expired: "INCOMPLETE_EXPIRED",
    unpaid: "UNPAID",
    paused: "PAUSED",
  };
  return map[status];
}

/**
 * Look up the org owner's email + first name for a subscription.
 * Returns null if we can't find the org or there's no owner.
 */
async function getOwnerForSubscription(subscription: Stripe.Subscription) {
  const customerId =
    typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id;

  const org = await prisma.organization.findFirst({
    where: { stripeCustomerId: customerId },
    include: {
      users: {
        where: { role: "OWNER" },
        take: 1,
      },
    },
  });

  if (!org || !org.users[0]) return null;

  const owner = org.users[0];
  const firstName = owner.fullName.split(/\s+/)[0] || "there";

  return { org, owner, firstName };
}

async function sendTrialStartedEmail(subscription: Stripe.Subscription) {
  const ctx = await getOwnerForSubscription(subscription);
  if (!ctx) return;

  const priceId = subscription.items.data[0]?.price.id;
  const plan = planFromPriceId(priceId) ?? "STARTER";
  const planName = PLAN_DISPLAY_NAME[plan];

  const trialEnd = subscription.trial_end
    ? new Date(subscription.trial_end * 1000).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "in 14 days";

  await sendTransactional({
    email: ctx.owner.email,
    transactionalId: LOOPS_TEMPLATES.TRIAL_STARTED,
    dataVariables: {
      firstName: ctx.firstName,
      firmName: ctx.org.name,
      planName,
      trialEndDate: trialEnd,
    },
  });
}

async function sendCanceledEmail(subscription: Stripe.Subscription) {
  const ctx = await getOwnerForSubscription(subscription);
  if (!ctx) return;

  await sendTransactional({
    email: ctx.owner.email,
    transactionalId: LOOPS_TEMPLATES.SUBSCRIPTION_CANCELED,
    dataVariables: {
      firstName: ctx.firstName,
      firmName: ctx.org.name,
    },
  });
}

async function sendPaymentFailedEmail(subscription: Stripe.Subscription) {
  const ctx = await getOwnerForSubscription(subscription);
  if (!ctx) return;

  await sendTransactional({
    email: ctx.owner.email,
    transactionalId: LOOPS_TEMPLATES.PAYMENT_FAILED,
    dataVariables: {
      firstName: ctx.firstName,
      firmName: ctx.org.name,
    },
  });
}

