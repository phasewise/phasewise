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

        // Stripe stores "cancel scheduled at end of period" in two related
        // ways depending on how the cancellation was initiated:
        //
        // 1. API call setting `cancel_at_period_end: true` → that boolean
        //    flips to true on the subscription.
        // 2. Customer Portal cancel → Stripe sets `cancel_at` to a unix
        //    timestamp (the period end time). `cancel_at_period_end` may
        //    or may not flip in this case.
        //
        // We need to detect a FRESH transition into "canceling" state.
        // The reliable signal is `previous_attributes` on the event:
        // if cancel_at was null/undefined before and is non-null now, the
        // user just cancelled. Same for cancel_at_period_end.
        //
        // A "Don't cancel subscription" undo is the inverse — cancel_at
        // was set, now it's null — and we should NOT send the canceled
        // email for that.

        const subRaw = subscription as unknown as {
          cancel_at_period_end?: boolean;
          cancel_at?: number | null;
        };
        const eventWithPrev = event as unknown as {
          data: {
            previous_attributes?: {
              cancel_at?: number | null;
              cancel_at_period_end?: boolean;
            };
          };
        };
        const prev = eventWithPrev.data.previous_attributes ?? {};

        // Current state — is this subscription now scheduled to cancel?
        const isCancelingNow =
          subRaw.cancel_at_period_end === true || (subRaw.cancel_at != null && subRaw.cancel_at > 0);

        // Did previous_attributes contain a cancel field that was either
        // null or false? If so, this update just transitioned INTO the
        // canceling state. (If previous_attributes is missing the field
        // entirely, the field didn't change in this event — so it's not
        // a fresh cancel.)
        const hadCancelAtBefore =
          "cancel_at" in prev && prev.cancel_at != null && prev.cancel_at > 0;
        const hadCancelFlagBefore =
          "cancel_at_period_end" in prev && prev.cancel_at_period_end === true;
        const wasNotCancelingBefore = !hadCancelAtBefore && !hadCancelFlagBefore;

        // Detect transition: previous_attributes touched a cancel field
        // (so the field changed) AND the previous value was non-canceling
        // AND the current value IS canceling.
        const cancelFieldChanged =
          "cancel_at" in prev || "cancel_at_period_end" in prev;
        const isFreshCancellation =
          isCancelingNow && cancelFieldChanged && wasNotCancelingBefore;

        const customerId =
          typeof subscription.customer === "string"
            ? subscription.customer
            : subscription.customer.id;
        const existingOrg = await prisma.organization.findFirst({
          where: { stripeCustomerId: customerId },
          select: { cancelAtPeriodEnd: true },
        });

        console.log("[stripe webhook] customer.subscription.updated", {
          subscriptionId: subscription.id,
          customerId,
          eventId: event.id,
          orgFound: !!existingOrg,
          dbCancelAtPeriodEnd: existingOrg?.cancelAtPeriodEnd,
          rawCancelAtPeriodEnd: subRaw.cancel_at_period_end,
          rawCancelAt: subRaw.cancel_at,
          isCancelingNow,
          hadCancelAtBefore,
          hadCancelFlagBefore,
          wasNotCancelingBefore,
          cancelFieldChanged,
          isFreshCancellation,
          previousAttributes: prev,
        });

        await syncSubscriptionToOrg(subscription);

        if (isFreshCancellation) {
          console.log("[stripe webhook] sending canceled email");
          const result = await sendCanceledEmail(subscription);
          console.log("[stripe webhook] sendCanceledEmail returned", result);
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
  if (!ctx) {
    console.warn("[stripe webhook] sendCanceledEmail: no owner found for subscription", subscription.id);
    return { success: false, reason: "no owner" };
  }

  console.log("[stripe webhook] sendCanceledEmail attempting send", {
    to: ctx.owner.email,
    templateId: LOOPS_TEMPLATES.SUBSCRIPTION_CANCELED,
    templateIdSet: !!LOOPS_TEMPLATES.SUBSCRIPTION_CANCELED,
    firstName: ctx.firstName,
    firmName: ctx.org.name,
  });

  const result = await sendTransactional({
    email: ctx.owner.email,
    transactionalId: LOOPS_TEMPLATES.SUBSCRIPTION_CANCELED,
    dataVariables: {
      firstName: ctx.firstName,
      firmName: ctx.org.name,
    },
  });

  console.log("[stripe webhook] sendCanceledEmail result", result);
  return result;
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

