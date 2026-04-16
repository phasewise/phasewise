# Phasewise Transactional Email Templates

All templates use the v2 brand (green header bar with wordmark, brand greens,
Outfit-style system font stack). They share a single design so every email your
customers receive feels consistent and professional.

## Contents

| File | Purpose | Data variables |
|---|---|---|
| `_master.html` | Reference design only — don't install | `headline`, `bodyParagraph`, `ctaUrl`, `ctaLabel`, `closingNote`, `firstName` |
| `welcome.html` | Sent after signup | `firstName`, `firmName` |
| `trial-started.html` | Sent after Stripe checkout (trial begins) | `firstName`, `firmName`, `planName`, `trialEndDate` |
| `subscription-canceled.html` | Sent when subscription cancels | `firstName`, `firmName` |
| `payment-failed.html` | Sent when Stripe payment fails | `firstName`, `firmName` |
| `submittal-reminder.html` | Daily cron — overdue submittals | `firstName`, `submittalNumber`, `subject`, `projectName`, `daysOverdue`, `ballInCourt` |
| `budget-alert.html` | Sent when a project crosses 75 / 90 / 100% of budget | `firstName`, `projectName`, `alertLabel`, `burnRate`, `hoursUsed`, `budgetedHours`, `budgetedFee` |

## Installing in Loops

For each template file (skip `_master.html`):

1. Open **loops.so** → **Transactional** in the left sidebar
2. Either **edit an existing template** (Welcome, Trial Started, Subscription Canceled, Payment Failed — already exist and have IDs in `LOOPS_TEMPLATE_*` env vars) **or create a new one** (Submittal Reminder, Budget Alert)
3. Click the **"< >" (HTML)** toggle to switch the editor to source mode
4. Delete everything in the editor
5. Open the corresponding `.html` file in `brand_v2/email-templates/` and copy the **entire file contents**
6. Paste into the Loops HTML editor
7. In the right sidebar of the Loops editor, confirm the **Data Variables** listed above are declared (Loops auto-detects them from the `{{variable}}` placeholders, but double-check)
8. Set the **Subject line** to match (see "Subject lines" below)
9. Send a test to yourself
10. **Save** the template

### Subject lines (recommended)

| Template | Subject |
|---|---|
| welcome | `Welcome to Phasewise, {{firstName}}` |
| trial-started | `Your Phasewise trial is active — {{firmName}}` |
| subscription-canceled | `Your Phasewise subscription has been canceled` |
| payment-failed | `Action needed: we couldn't process your payment` |
| submittal-reminder | `{{submittalNumber}} is {{daysOverdue}} days overdue` |
| budget-alert | `Budget alert: {{projectName}} — {{alertLabel}}` |

## New templates to create (Submittal Reminder & Budget Alert)

These don't exist in Loops yet. After creating them:

1. Copy each new template's ID (top of the Loops template editor)
2. Set env vars in **Vercel → Settings → Environment Variables**:
   - `LOOPS_TEMPLATE_SUBMITTAL_REMINDER`
   - `LOOPS_TEMPLATE_BUDGET_ALERT`
3. Also add the same vars to local `app/.env` so local testing matches
4. Redeploy (the next deploy picks up the new env vars automatically)

Until these env vars are set, the system falls back to the existing
`LOOPS_TEMPLATE_PAYMENT_FAILED` template so reminders still send — just
with the less-branded copy.

## Why we build emails as standalone HTML

Email clients (Gmail web, iOS Mail, Outlook, etc.) strip `<style>` tags,
ignore flexbox, and have inconsistent support for modern CSS. These
templates use table-based layouts + inline styles so they render
consistently across every major client.

## Testing rendering

Before shipping changes to a template, test in at least:
- Gmail (web)
- iOS Mail
- Outlook (web — it's the strictest)

Loops' preview pane is a good first check but not authoritative.
