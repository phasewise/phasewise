# Phasewise Outreach Playbook

The product is feature-complete. Customers are now the only thing standing between you and revenue. This is the cold-outreach play to land the first 3 paying firms.

**Goal for next 30 days:** 3 firms in 14-day trial, 1 converted to paying.

---

## The math

Cold-email response rates for B2B SaaS targeting niche verticals: **5–15% reply rate**, **1–3% trial conversion** when the message is specific and the targeting is right.

To net 3 trials → send ~150 well-targeted emails over 30 days = ~5/day.

---

## Who to target

Outreach is **anonymous brand-led** — we don't use personal warm-intro hooks. So targeting is purely about firm fit, not founder network. Three tiers, work from top to bottom:

### Tier A — Strongest fit (~20-30 firms)

California LA firms that match all of:

- **3-15 staff** (large enough to need a tool, small enough to not have entrenched workflows)
- **Founded 2015+** (newer firms are more software-curious)
- **Active website with portfolio** (signal of an active practice)
- **No public mention of being deeply tied to Monograph / BQE / Deltek** (those firms convert harder)

Send Template 1 (value-first). Conversion: 5-15%.

### Tier B — Good fit (~30-50 firms)

Same profile but founded earlier (2008-2014) OR slightly larger (15-25 staff). Established but not entrenched. Send Template 1 or Template 3 if a current PM tool is publicly mentioned. Conversion: 3-8%.

### Tier C — Outside CA (200+)

Any firm in a major metro (NYC, Boston, Seattle, Portland, Denver, Austin, Chicago) matching the Tier A size profile. Lower priority because **MWELO is CA-specific** — the value-first email loses its strongest hook. Conversion: 2-5%.

**Order of operations: Tier A first, Tier B second, Tier C only when first two are exhausted.** California firms convert at 3-5x other states because the MWELO calculator solves a state-specific compliance pain.

The current `PROSPECTS.md` file (gitignored) is the source of truth for who's been contacted. Update it after every send.

---

## The 5 cold-email templates (anonymous, brand-led)

**Sender identity:** every email is from `Phasewise Team <hello@phasewise.io>`. Never sign with a personal name. Never say "I" — use "we" / "the team behind Phasewise." If a reply asks who's behind it, that's a 1-on-1 disclosure decision; the cold email never exposes the founder.

**Lead with value, not pitch.** The free MWELO compliance article (`/blog/mwelo-water-budget-calculator-guide`) is the standard "gift" — already public, genuinely useful, no extra work to attach. For firms with a different specialty (residential, design-build, profitability-focused), substitute the matching pillar article from `/blog/`.

Vary subject lines aggressively — same body with 5 different subjects performs better than 5 different bodies with the same subject.

### Template 1: Value-first (default — use for ~80% of prospects)

**Subject lines (rotate):**
- {{Specific project}} is impressive — built something we thought you'd find useful
- A free MWELO compliance guide for {{firm}}
- For a firm doing {{their specialty}} work — a free guide
- Built for {{firm-type}} firms — wanted to share something useful first

**Body:**

> Hi {{firstName or firmName-team}},
>
> {{1-2 sentences referencing one specific public detail — a flagship project, a portfolio specialty, a recent recognition. Stay above-the-fold and observable; never claim insider knowledge.}}
>
> We built Phasewise (https://phasewise.io) specifically for landscape architecture firms: project management with phases native to LA work (PreD → SD → DD → CD → CA → PostC), budgets, time tracking, submittal/RFI logs, plant schedules, and a built-in MWELO water budget calculator citing Title 23, CCR §§ 490–495.
>
> Sending this without any pitch attached — we wrote a guide on MWELO water budget calculations (MAWA + ETWU formulas with worked examples, hydrozone planning, the most common compliance mistakes) that might save {{firm}} time on the next project:
>
> https://phasewise.io/blog/mwelo-water-budget-calculator-guide
>
> If you'd ever want to see how Phasewise replaces the QuickBooks + spreadsheet stack for $99–349/mo, the trial is 14 days and doesn't require a card: phasewise.io/signup.
>
> If not, no follow-up — just felt like sharing.
>
> — The Phasewise team

### Template 2: Direct (use sparingly — when there's no obvious personalization hook)

**Subject:**
- Project management built specifically for landscape architecture firms
- A new tool for LA firms — would value your feedback

**Body:**

> Hi {{firstName or firmName-team}},
>
> Phasewise (https://phasewise.io) is project management software designed specifically for landscape architecture firms. It replaces the QuickBooks + Monday + Harvest stack with one tool — phases native to LA work, MWELO calculator, per-person profitability, submittal logs, plant schedules.
>
> We're cold-emailing ~40 California firms in your size range to ask: would you try it free for 14 days and tell us what's broken?
>
> No card to start. If it's not a fit, just say so — we won't follow up. If it is, $99–349/mo Starter to Studio.
>
> phasewise.io/signup or reply with one question.
>
> — The Phasewise team

### Template 3: Comparison (use when firm publicly mentions a specific PM tool)

Reserve for firms whose site or job listings name a current PM stack (Monograph, BQE, Deltek, Asana, etc.).

**Subject:**
- {{Their tool}} → Phasewise: 15-minute comparison
- An LA-specific alternative to {{their tool}}

**Body:**

> Hi {{firstName or firmName-team}},
>
> Saw on {{firm}}'s {{site / careers page / About}} that you're using {{Monograph / BQE / Harvest+Asana}}. We built Phasewise as the LA-specific alternative.
>
> Where we differ:
>
> • Native LA phases (PreD → SD → DD → CD → CA → PostC), not generic tasks
> • Built-in MWELO calculator (Title 23, CCR §§ 490–495)
> • Per-person profitability that surfaces "junior staff at senior rate"
> • Submittal/RFI log with overdue email reminders
> • $99/mo starts (vs ~$70/seat at most competitors = $350+ for a 5-person firm)
>
> 14-day free trial, no card: phasewise.io/signup. Or reply with what's actually working at {{firm}} and what isn't — we genuinely want to know what we're competing against.
>
> — The Phasewise team

### Template 4: Follow-up (5 business days after Template 1/2/3, no response)

Reply to the original thread (preserves email-client threading and lands in primary inbox).

**Subject:** leave blank or `Re: [original]`

**Body:**

> Hi {{firstName or firmName-team}},
>
> Following up on the Phasewise note from last week — figured we'd ping once in case it landed in spam.
>
> Two-line version: project management built specifically for landscape architecture firms. 14-day trial, $99–349/mo, no card to start.
>
> If now's not the right time, no follow-up after this. Trial whenever it makes sense: phasewise.io/signup.
>
> — The Phasewise team

### Template 5: Breakup (10 business days after follow-up #1, no response)

Counterintuitively, this gets more replies than any other template — people respond when they feel they're losing the chance.

**Subject:**
- Closing the loop on Phasewise
- Last note — closing the loop

**Body:**

> Hi {{firstName or firmName-team}},
>
> Last note — closing the loop.
>
> If Phasewise might be useful in the next quarter, the 14-day trial is at phasewise.io/signup whenever you're ready.
>
> If not, would honestly appreciate a one-line "not for us, here's why" — that feedback shapes what we build next.
>
> Either way, thanks for reading.
>
> — The Phasewise team

---

## Personalization rules (non-negotiable)

Cold emails without personalization land in spam folders or auto-trash piles. **Three minutes of personalization per email** beats the volume of unpersonalized blasts.

- Read the firm's "About" page. Note founding year, principal name, geographic focus.
- Pick **one specific public detail** — a flagship project from their portfolio, a recent award, a portfolio specialty. Reference it in the opener.
- **Never claim insider knowledge.** Anonymous brand-led outreach means staying above-the-fold and observable. "We came across [project]" beats "I know you worked on [project]."
- Use the principal's first name in the opener when possible. Fall back to `{{firmName}} team` if you can't find one. **Never** "Dear Sir/Madam" or "Hi there".

If you don't know the firm well enough to personalize, don't email yet. Move them to a "research more" list.

---

## Sending hygiene

- **From identity:** `Phasewise Team <hello@phasewise.io>` — never a personal name. Set this in Gmail's "Send mail as" settings (Settings → Accounts and Import) so the from-line displays cleanly.
- **Reply-to:** Same — `hello@phasewise.io`. Replies thread back to the brand, not to a person.
- **Send 5/day, M-Th, 8-10am Pacific.** Friday afternoons get ignored.
- **Track replies.** Even "not interested" is a tag — don't re-email them.
- **No tracking pixels.** Most LA firms run Apple Mail / Outlook with image-blocking; pixels break trust without giving you data.
- **Plain text > HTML.** Looks like a real human email, lands in primary inbox more often.
- **Never use mail-merge syntax in the actual sent email.** Manual personalization or use a tool like Apollo / Hunter that does merge cleanly.
- **Verify guess-emails before high-volume sending.** A bouncing email tells the recipient you scraped them — kills conversion. Hunter.io's free 50-search/mo tier is enough for the inner circle.

---

## The prospect-list spreadsheet

Build this in Google Sheets or Notion — same fields work either way:

| Column | Notes |
|---|---|
| Firm name | |
| Principal name | First name in body |
| Principal email | Use Hunter.io / Apollo.io / firm contact page |
| LinkedIn URL | For personalization research |
| Website | |
| City / State | CA prioritized |
| Headcount estimate | Want 3-15 |
| Founded year | Want 2015+ |
| Existing tool (if known) | "Monograph" / "QuickBooks + spreadsheets" / "unknown" |
| Connection / hook | The specific personalized opener |
| Template used | 1, 2, 3 |
| Sent date | |
| Follow-up #1 date | +5 business days |
| Breakup date | +10 business days from follow-up |
| Reply | Yes / No / Booked call / Trial signup |
| Outcome | Trial / Paid / Lost / No response |

---

## Day-1 / Week-1 plan

**Today:**
1. Confirm `PROSPECTS.md` has at least 15-20 Tier-A firms researched (firm name, principal, email guess, hook). 2026-04-28 already has the first 22 — keep adding as you find more.
2. Verify the top-5 emails via Hunter.io (free tier) before first send. A bouncing email kills the conversion before they even read.
3. Send 5 Template-1 emails to the top 5 Tier-A firms.
4. (Optional) Add Phasewise to ASLA California chapter as a corporate sponsor — $200-500/yr depending on chapter — pays for itself with one trial signup *and* gives the brand legitimacy when prospects google "is Phasewise real."

**This week:**
5. Send 5 Template-1 emails per day, M-Th = 20 total. All Tier-A.
6. Add 15-30 more Tier-A prospects to `PROSPECTS.md` as you find them.
7. Friday: review reply rate. If <10%, the personalization is too generic — review the openers and re-tune. If 10-15%, on track.

**Week 2:**
8. Follow-up #1 (Template 4) sweep on non-responders from Week 1.
9. Continue 5 new Tier-A emails per day.
10. Start moving Tier-B firms in if Tier-A pool is thinning.

**Week 3-4:**
11. Breakup emails (Template 5) to the persistent non-responders.
12. Continue 5/day from a mix of remaining Tier-A and fresh Tier-B.
13. Goal: 3 trial signups by end of week 4.

---

## What "winning" looks like in 30 days

- 100-150 emails sent across all three waves
- 10-25 replies (10-15% reply rate is healthy for a niche-vertical cold email)
- 3-5 booked walkthroughs (15-min screen shares)
- 3 trial signups
- 1 paid conversion (starting MRR: $99-$199)

If you're at 50-emails sent / 0 replies on day 14, the targeting or personalization is off — pause and diagnose, don't push more volume.

---

## Tools

- **Hunter.io** — find principal email addresses ($0-49/mo, 50 free searches/mo)
- **Apollo.io** — alternative; better LinkedIn integration ($0-99/mo)
- **Google Workspace** — already set up; gives you kevin@phasewise.io
- **Gmail "Send Later"** — schedule emails for 9am Pacific
- **Mixmax / Streak** (optional) — Gmail extension for follow-up tracking; only if the spreadsheet feels too manual
