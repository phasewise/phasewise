---
title: "Invoicing your clients"
description: "Create invoices from approved time, send them as branded PDFs with Pay-now links, and track payment status."
category: "Billing & invoices"
order: 1
---

Phasewise creates invoices in three ways: auto-drafted by the monthly cron, pulled from approved timesheets, or manually composed. All three end up at **Admin → Project Billing** where you review, send, and track them.

## Auto-invoicing (set-and-forget)

If your project's billing cadence is set to **Monthly**, the auto-invoicing cron runs on the 5th of every month and creates a draft invoice for each non-archived project. The draft covers the prior calendar month's approved billable hours, line-itemized by phase + person.

You'll see a banner on **/admin/billing** when drafts are ready: *"Auto-invoicing — Last run: May 5, 2026 → created 3 draft invoices for April. Next run: June 5. [Review drafts →]"*

The cron skips projects that have zero approved billable hours for the period (records a `SKIPPED_NO_HOURS` event in the project's billing history for visibility).

To change a project's billing cadence, edit the project and pick `Monthly`, `Milestone`, or `Manual`.

## Manual invoice creation (Pull from timesheets)

For ad-hoc invoicing or non-monthly cadences:

1. Go to **Admin → Project Billing → + New Invoice**.
2. Pick the project. Invoice number auto-fills (configurable format like `INV-26-0042`).
3. Set **Period start / Period end**. Quick-period buttons: Last month, This month, Last week.
4. Click **Pull from timesheets**. Phasewise reads approved billable time entries on the project in the period and groups them into line items by phase + person.
5. If there are unreviewed timesheets in the period, you'll see an amber warning listing them. You can either approve them first OR proceed and create the invoice without those hours.
6. Edit line items if needed (description, quantity, rate).
7. Click **Create invoice**.

## Sending an invoice

On any DRAFT invoice row, click **Send to client**. A modal opens:

- **To email** — defaults to the client's email on the project. Override for one-off sends.
- **Optional message** — adds a personal note to the email body.

Click **Send invoice**. Phasewise:

- Generates a branded PDF with your firm's logo, remit-to block, and contract / agreement number.
- Creates a public invoice viewer URL (token-protected — only people with the link can access).
- If Stripe Connect is set up, lazily creates a Stripe Payment Link for the balance due.
- Sends the email via Loops with View & Download + Pay-now buttons.
- Flips the invoice to SENT with a timestamp.

The client gets a clean email with two buttons. Clicking **View & Download Invoice** opens the public viewer where they can review and download the PDF. Clicking **Pay this invoice online →** opens Stripe Checkout (if Connect is wired). Both options stay live for the lifetime of the invoice.

## Tracking payment

After Stripe processes a payment via the Pay-now button:

- A webhook fires from Stripe to Phasewise.
- The invoice auto-flips to **PAID** with paid date, amount, payment method ("Stripe (card)"), and PaymentIntent reference number.
- You get a notification email with the payment details.
- The funds settle to your bank on Stripe's payout schedule (~2 business days for cards, 3-5 for ACH).

For invoices paid by check, ACH outside Stripe, or wire, click **Mark paid** on the invoice row. A modal lets you record:

- Paid date
- Paid amount (full or partial)
- Payment method (Check / ACH / Wire / Other)
- Payment reference (check number, wire confirmation, etc.)

Partial payments flip the status to **PARTIALLY PAID** until the balance reaches zero.

## Status flow

```
DRAFT → SENT → PAID  (or PARTIALLY PAID → PAID)
   ↘ VOIDED        ↘ OVERDUE (if past due date and unpaid)
```

The /admin/billing page groups invoices by status: Overdue → Sent → Partially paid → Draft → Paid → Voided. Each row shows the most relevant date for that status (sent date, paid date).

## Common questions

**Q: I marked an invoice paid by mistake. Can I undo?**
Click into the invoice row → Update payment → set status back to SENT. Or email **hello@phasewise.io** if the row is locked.

**Q: A client says they paid via Stripe but the invoice still shows SENT.**
Stripe webhooks usually deliver within seconds. If the invoice hasn't auto-flipped after 5 minutes, check **Stripe Dashboard → Payments** for the charge. If you see it there but Phasewise didn't catch it, email us with the PaymentIntent ID.

**Q: How do I issue a refund?**
Issue the refund from Stripe Dashboard directly. Phasewise doesn't trigger refunds — Stripe is the source of truth. After refunding, manually update the invoice's paid amount in Phasewise to reflect the new balance.
