import { stripe } from "@/lib/stripe";

/**
 * Create a Stripe Payment Link on a connected account so the firm's
 * client can pay an invoice with one click. Funds settle directly to
 * the firm's bank — Phasewise stays out of the money path.
 *
 * Called lazily on first send (or first time the public viewer is
 * loaded after Connect was wired up). The result is stored on
 * Invoice.stripePaymentLinkId / .stripePaymentLinkUrl so subsequent
 * sends reuse the same link.
 *
 * Why payment_intent_data with metadata: when the customer pays,
 * Stripe fires checkout.session.completed on our platform webhook.
 * The metadata.phasewiseInvoiceId lets us find the right invoice and
 * mark it PAID without having to look up a session-to-invoice map.
 *
 * Why { stripeAccount: connectedAccountId }: this is the Connect
 * idiom — the API call runs against the firm's account, not
 * Phasewise's. So the resulting link charges them, not us.
 */
export async function createPaymentLinkForInvoice(args: {
  invoiceId: string;
  invoiceNumber: string;
  projectName: string;
  amountDueCents: number;
  currency?: string;
  connectedAccountId: string;
  publicToken: string;
}): Promise<{ id: string; url: string }> {
  const {
    invoiceId,
    invoiceNumber,
    projectName,
    amountDueCents,
    currency = "usd",
    connectedAccountId,
    publicToken,
  } = args;

  if (amountDueCents <= 0) {
    throw new Error("Cannot create a Payment Link for a zero or negative amount.");
  }

  // Inline price_data avoids needing a Product/Price catalog on the
  // connected account — each invoice is a one-shot charge anyway.
  const link = await stripe.paymentLinks.create(
    {
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency,
            unit_amount: amountDueCents,
            product_data: {
              name: `Invoice ${invoiceNumber} — ${projectName}`,
            },
          },
        },
      ],
      // Phasewise-side metadata so the webhook can find the invoice.
      metadata: {
        phasewiseInvoiceId: invoiceId,
      },
      // Same metadata on the underlying PaymentIntent so it shows up
      // in the firm's Stripe dashboard against each charge.
      payment_intent_data: {
        metadata: {
          phasewiseInvoiceId: invoiceId,
        },
      },
      // After a successful pay, redirect the client back to the public
      // viewer so they see the PAID badge — better UX than the default
      // "Thanks!" screen on Stripe.
      after_completion: {
        type: "redirect",
        redirect: {
          url: `${(process.env.NEXT_PUBLIC_APP_URL || "https://phasewise.io").replace(/\/$/, "")}/invoice/${publicToken}?paid=1`,
        },
      },
    },
    { stripeAccount: connectedAccountId }
  );

  return { id: link.id, url: link.url };
}

/**
 * Deactivate a Payment Link on the connected account. Call when an
 * invoice is voided so the client can no longer pay against it.
 *
 * Best-effort — if the link doesn't exist (manually deleted, account
 * detached, etc.) we swallow the error so we don't block invoice
 * voiding.
 */
export async function deactivatePaymentLink(args: {
  paymentLinkId: string;
  connectedAccountId: string;
}): Promise<void> {
  try {
    await stripe.paymentLinks.update(
      args.paymentLinkId,
      { active: false },
      { stripeAccount: args.connectedAccountId }
    );
  } catch (err) {
    console.warn("Stripe Payment Link deactivate failed (continuing):", err);
  }
}
