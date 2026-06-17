import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { z } from "zod";
import { stripe, planFromPriceId } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { sendTransactional, LOOPS_TEMPLATES } from "@/lib/loops";
import { Prisma, type SubscriptionStatus, type Plan } from "@prisma/client";

// Zod schemas for Stripe fields not exposed cleanly via the
// official type definitions. The cancel-detection logic
// (commit e700f19) reads `cancel_at`, `cancel_at_period_end`, and
// `current_period_end` off Stripe.Subscription + the event's
// `previous_attributes`. The previous code used `as unknown as`
// casts; if Stripe's API drifts the shape (likely on a future
// API-version upgrade), the cast is silent and the detection
// breaks without anyone noticing. These Zod schemas surface the
// drift loudly via console.warn instead.
const subCancelFieldsSchema = z.object({
  current_period_end: z.number().optional(),
  cancel_at_period_end: z.boolean().optional(),
  cancel_at: z.number().nullable().optional(),
});

const previousAttributesSchema = z.object({
  cancel_at: z.number().nullable().optional(),
  cancel_at_period_end: z.boolean().optional(),
});

type SubCancelFields = z.infer<typeof subCancelFieldsSchema>;
type PreviousAttrs = z.infer<typeof previousAttributesSchema>;

function readSubCancelFields(subscription: Stripe.Subscription): SubCancelFields {
  const result = subCancelFieldsSchema.safeParse(subscription);
  if (!result.success) {
    console.warn(
      "Stripe subscription cancel-fields shape drifted:",
      result.error.flatten()
    );
    return {};
  }
  return result.data;
}

function readPreviousAttributes(event: Stripe.Event): PreviousAttrs {
  const data = (event.data ?? {}) as { previous_attributes?: unknown };
  if (!data.previous_attributes) return {};
  const result = previousAttributesSchema.safeParse(data.previous_attributes);
  if (!result.success) {
    console.warn(
      "Stripe event previous_attributes shape drifted:",
      result.error.flatten()
    );
    return {};
  }
  return result.data;
}

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

  // Idempotency: Stripe retries on 5xx and timeouts. If we've seen this
  // event ID before, skip processing so we don't send duplicate emails or
  // re-apply state changes. The unique constraint on stripe_event_id is the
  // source of truth — try to insert first, return early on conflict.
  try {
    await prisma.processedStripeEvent.create({
      data: { stripeEventId: event.id, eventType: event.type },
    });
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      return NextResponse.json({ received: true, deduplicated: true });
    }
    throw err;
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
        // 1. API call with `cancel_at_period_end: true` → that boolean
        //    flips to true on the subscription.
        // 2. Customer Portal cancel → Stripe sets `cancel_at` to a unix
        //    timestamp (the period end time). The boolean may not flip.
        //
        // To detect a FRESH cancellation we use `previous_attributes` on
        // the event: if a cancel field was null/false before this update
        // and is non-null/true now, the user just clicked Cancel. This
        // also correctly skips the inverse case ("Don't cancel" undo)
        // because previous_attributes.cancel_at would be a timestamp
        // and the new value would be null.
        const subRaw = readSubCancelFields(subscription);
        const prev = readPreviousAttributes(event);

        const isCancelingNow =
          subRaw.cancel_at_period_end === true || (subRaw.cancel_at != null && subRaw.cancel_at > 0);

        const hadCancelAtBefore =
          "cancel_at" in prev && prev.cancel_at != null && prev.cancel_at > 0;
        const hadCancelFlagBefore =
          "cancel_at_period_end" in prev && prev.cancel_at_period_end === true;
        const wasNotCancelingBefore = !hadCancelAtBefore && !hadCancelFlagBefore;

        const cancelFieldChanged =
          "cancel_at" in prev || "cancel_at_period_end" in prev;
        const isFreshCancellation =
          isCancelingNow && cancelFieldChanged && wasNotCancelingBefore;

        await syncSubscriptionToOrg(subscription);

        if (isFreshCancellation) {
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
        // Stripe v22 types put `subscription` on the expanded line item
        // but the field is still present on the invoice object. Zod
        // schema validates the runtime shape and surfaces drift if
        // Stripe ever moves it.
        const invoiceSubSchema = z.object({
          subscription: z
            .union([z.string(), z.object({ id: z.string() })])
            .nullable()
            .optional(),
        });
        const invoiceParsed = invoiceSubSchema.safeParse(invoice);
        if (!invoiceParsed.success) {
          console.warn(
            "Stripe invoice.payment_failed shape drifted:",
            invoiceParsed.error.flatten()
          );
          break;
        }
        const subId = invoiceParsed.data.subscription;
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
  const subWithPeriod = readSubCancelFields(subscription);
  const itemSchema = z.object({ current_period_end: z.number().optional() });
  const itemParsed = itemSchema.safeParse(subscription.items.data[0]);
  const itemPeriodEnd = itemParsed.success ? itemParsed.data.current_period_end : undefined;
  const periodEndSeconds = subWithPeriod.current_period_end ?? itemPeriodEnd;
  const periodEnd = periodEndSeconds ? new Date(periodEndSeconds * 1000) : null;

  // Stripe sets cancel_at (unix timestamp) when cancellation happens via Customer Portal,
  // or cancel_at_period_end (boolean) when it's an API call. Treat both as "canceling at period end".
  const isScheduledToCancel =
    subWithPeriod.cancel_at_period_end === true ||
    (subWithPeriod.cancel_at != null && subWithPeriod.cancel_at > 0);

  // Founding Member promotion — checkout sets metadata.foundingMember
  // = "true" when the FOUNDING50 coupon was applied. Once we see a
  // trialing or active subscription with that flag, the org is
  // permanently flagged as a Founding Member. Never unset — even on
  // downgrade or cancel, they retain the historical status (used for
  // case studies, priority routing, etc.).
  const becomesFoundingMember =
    !org.isFoundingMember &&
    subscription.metadata?.foundingMember === "true" &&
    (subscription.status === "trialing" || subscription.status === "active");

  await prisma.organization.update({
    where: { id: org.id },
    data: {
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscription.id,
      stripePriceId: priceId ?? null,
      subscriptionStatus: mapStripeStatus(subscription.status),
      currentPeriodEnd: periodEnd,
      cancelAtPeriodEnd: isScheduledToCancel,
      plan: subscription.status === "active" || subscription.status === "trialing" ? plan : "TRIAL",
      trialEndsAt: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
      ...(becomesFoundingMember && { isFoundingMember: true }),
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
      recipientName: ctx.firstName,
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
      recipientName: ctx.firstName,
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
      recipientName: ctx.firstName,
      firmName: ctx.org.name,
    },
  });
}

