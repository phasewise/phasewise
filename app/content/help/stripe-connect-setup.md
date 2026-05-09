---
title: "Setting up Stripe Connect for online payments"
description: "Connect your firm's Stripe account so clients can pay invoices online with one click. Funds settle directly to your bank — Phasewise stays out of the money path."
category: "Billing & invoices"
order: 2
---

Stripe Connect is how Phasewise enables Pay-now buttons on the invoices you send to clients. You connect your firm's own Stripe account via OAuth. When a client clicks Pay-now, Stripe processes the charge against your account. Funds settle directly to your bank. Phasewise never touches the money.

## Why connect Stripe?

Without Stripe Connect, clients pay via the bank details printed on your invoice (mail, ACH, wire). With it, they get a one-click "Pay $X now →" button that opens Stripe Checkout. Faster collection, lower friction, automatic mark-as-paid in Phasewise via webhook.

Stripe's standard fees apply (2.9% + 30¢ for cards, 0.8% capped at $5 for ACH). Phasewise charges nothing on top.

## Connecting your account

You must be **Owner** or **Admin** to connect Stripe.

1. Go to **Settings → Payments**.
2. Click **Connect Stripe**.
3. You'll be redirected to Stripe's hosted onboarding (Express type — lighter than full Stripe Dashboard).
4. Walk through the prompts: business type, identity verification, bank account.
5. Stripe handles KYC, bank verification, and 1099 forms. Phasewise never sees your bank credentials.
6. When complete, Stripe redirects you back to **/settings/payments**. Status shows "Connected: Yes" and "Charges enabled: Yes" once Stripe has fully verified your account.

If verification is still pending after onboarding (common — Stripe may take a few minutes to a few hours to verify identity), the Pay-now buttons activate automatically as soon as Stripe flips your account to charges-enabled.

## What happens after you connect

- Every invoice you send via **Send to client** automatically gets a Stripe Payment Link attached. The link goes into the email body as a "Pay this invoice online →" button.
- The same Pay-now button shows up on the public invoice viewer (the link the client clicks in the email).
- When a client pays, Stripe fires a webhook to Phasewise. Phasewise auto-flips the invoice to PAID with the payment method, amount, and reference.
- You get a notification email at your Owner address with the payment details.
- Funds settle to your bank account on Stripe's normal payout schedule (typically 2 business days for cards, 3-5 for ACH).

## Disconnecting

If you ever want to stop using Stripe Connect through Phasewise:

1. Go to **Settings → Payments**.
2. Click **Disconnect Stripe**.
3. Confirm.

Your Stripe account stays intact at dashboard.stripe.com — disconnecting only severs the link with Phasewise. Future invoices won't have Pay-now buttons until you reconnect.

## Privacy / what Phasewise can and can't see

- **Phasewise sees**: your connected account ID, charges-enabled status, and webhook events for payments on invoices we created the Payment Link for.
- **Phasewise can NOT see**: your bank account, login credentials, transaction history outside our Payment Links, or any other Stripe data.

If you'd rather not print bank details on every invoice (since anyone with a copy of the invoice has them), there's a **Don't print on invoice** toggle in **Settings → Billing info** that hides the Remit-To block. Stripe Connect Pay-now buttons keep working either way.
