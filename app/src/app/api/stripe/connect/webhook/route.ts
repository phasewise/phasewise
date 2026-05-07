import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

/**
 * POST /api/stripe/connect/webhook
 *
 * Receives events from Stripe Connect (firm-side connected accounts),
 * separate from the platform-level subscription webhook. Each Connect
 * webhook endpoint registered in Stripe gets its own signing secret;
 * we use STRIPE_CONNECT_WEBHOOK_SECRET here so we don't risk verifying
 * a Connect event with the platform key.
 *
 * Currently handles `checkout.session.completed` from invoice Payment
 * Links. The session metadata carries `phasewiseInvoiceId` (set when
 * we created the link); we look up the invoice and mark it PAID.
 *
 * Idempotency: same ProcessedStripeEvent table the platform webhook
 * uses. Stripe will retry on 5xx; the unique-constraint check returns
 * early on a dupe.
 */
export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header." },
      { status: 400 }
    );
  }

  const webhookSecret = process.env.STRIPE_CONNECT_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("STRIPE_CONNECT_WEBHOOK_SECRET is not set");
    return NextResponse.json(
      { error: "Connect webhook not configured." },
      { status: 500 }
    );
  }

  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid signature";
    console.error("Connect webhook signature verification failed:", message);
    return NextResponse.json(
      { error: `Webhook Error: ${message}` },
      { status: 400 }
    );
  }

  // Idempotency: shared with the platform webhook so a duplicate
  // event-ID across either endpoint is caught.
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
        await handleInvoicePayment(session, event.account ?? null);
        break;
      }
      default:
        // Ignore other Connect events for now.
        break;
    }
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error(`Error handling Connect event ${event.type}:`, error);
    const message = error instanceof Error ? error.message : "Webhook handler failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * Mark a Phasewise invoice PAID when its Payment Link's checkout
 * completes on the firm's connected account.
 *
 * Verifies that the invoice's organization matches the connected
 * account that emitted the event so a malicious actor with a valid
 * Connect signing secret can't mark another firm's invoice as paid.
 */
async function handleInvoicePayment(
  session: Stripe.Checkout.Session,
  connectedAccountId: string | null
) {
  const invoiceId = session.metadata?.phasewiseInvoiceId;
  if (!invoiceId) {
    // Not an invoice Payment Link — could be a different Checkout flow
    // on the connected account. Ignore.
    return;
  }

  if (session.payment_status !== "paid") {
    // Stripe sometimes emits checkout.session.completed for sessions
    // that aren't fully paid (e.g. async ACH that's still pending).
    // Wait for the eventual paid state via a separate event.
    return;
  }

  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: {
      organization: { select: { stripeConnectedAccountId: true } },
    },
  });

  if (!invoice) {
    console.warn(`Connect webhook: invoice ${invoiceId} not found`);
    return;
  }

  // Defense in depth: refuse to update if the connected account on the
  // event doesn't match the invoice's org. Stripe's signature already
  // proves the event came from one of our connected accounts; this
  // ensures the right one.
  if (
    connectedAccountId &&
    invoice.organization.stripeConnectedAccountId &&
    connectedAccountId !== invoice.organization.stripeConnectedAccountId
  ) {
    console.warn(
      `Connect webhook: account mismatch for invoice ${invoiceId} ` +
        `(event=${connectedAccountId}, org=${invoice.organization.stripeConnectedAccountId})`
    );
    return;
  }

  // Stripe gives the amount in cents; convert to a decimal-friendly
  // string so Prisma's Decimal column accepts it cleanly.
  const amountTotalCents = session.amount_total ?? 0;
  const amountPaid = (amountTotalCents / 100).toFixed(2);

  // Read the payment method type from the session for the audit trail.
  // Falls back to "stripe" if Stripe doesn't surface it.
  const methodTypes = session.payment_method_types ?? [];
  const paymentMethod =
    methodTypes.length > 0 ? `Stripe (${methodTypes.join(", ")})` : "Stripe";

  // Use the Stripe payment_intent ID as our paymentReference — that's
  // what shows up in the firm's Stripe dashboard for this charge.
  const paymentRef =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id ?? session.id;

  await prisma.invoice.update({
    where: { id: invoiceId },
    data: {
      status: "PAID",
      paidDate: new Date(),
      paidAmount: amountPaid,
      paymentMethod,
      paymentReference: paymentRef,
    },
  });
}
