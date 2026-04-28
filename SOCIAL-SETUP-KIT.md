# Phasewise Social Media Setup Kit

Everything you need to claim, brand, and launch the Phasewise socials. Hand-execute these steps — Claude can't (auth + ToS).

Status as of 2026-04-28:

| Platform | Handle | Status | Action |
|---|---|---|---|
| LinkedIn | linkedin.com/company/phasewise-io | ✓ claimed | Upload assets + first post |
| X (Twitter) | @phasewise | ✓ claimed | Upload assets + first post |
| GitHub | github.com/phasewise | ✓ claimed | Upload avatar + README |
| Instagram | @phasewise | ⏳ TODO | Claim, upload assets, first post |

Profile pic source: `brand_v2/phasewise-logomark.svg` (export to PNG at the platform's required size — see specs below).

---

## Universal one-liner (use everywhere ≤160 chars)

> Project management built for landscape architecture firms. Phases, budgets, time, submittals, MWELO — so your team can focus on the design.

## 280-char version (X bio max is 160 — but useful for LinkedIn About)

> The operating system for landscape architecture firms. Project management, budgets, time tracking, submittals, MWELO water budgets, and profitability — built for how landscape architects actually work. Focus on the design. We'll handle everything else. Free 14-day trial → phasewise.io

## Long-form (LinkedIn About / Instagram bio overflow)

Phasewise replaces the patchwork of QuickBooks + Monday + spreadsheets that most landscape architecture firms cobble together. Built by a Senior Landscape Architect at Caltrans for principals, project managers, and staff who'd rather be designing than chasing approvals.

What's inside:
• Project phases (PreD → SD → DD → CD → CA → PostC) with auto-billing-from-staff-rates
• Real-time budget alerts at 75% / 90% / 100% burn
• Submittal & RFI log with overdue email reminders
• MWELO water budget calculator (Title 23, CCR §§ 490–495)
• Plant schedules, compliance tracker, client portal
• Time tracking, timesheets, approvals, leave + PTO
• Stripe billing + branded PDF invoices

One subscription instead of three. $99/mo Starter • $199/mo Professional • $349/mo Studio. 14-day free trial, no card required.

---

## Per-platform specifics

### LinkedIn Company Page

- **URL:** linkedin.com/company/phasewise-io
- **Industry:** Computer Software (NOT Architecture & Planning — we're a SaaS to LA firms, not a firm)
- **Specialties:** Landscape Architecture Software, Project Management, Construction Management, MWELO Compliance, Time Tracking, Profitability Reporting, SaaS for AEC
- **Profile picture:** Export `brand_v2/phasewise-logomark.svg` → 400×400 PNG. Solid background `#1A2E22`.
- **Cover image:** Use `brand_v2/phasewise-linkedin-cover.svg` (already designed at 1584×396). Export to PNG.
- **Tagline:** Project management built for landscape architects.
- **About:** [paste long-form above]
- **Website:** https://phasewise.io
- **Industry tags:** Software Development, AEC, Construction
- **Pinned post:** [first-post template below]

### X (Twitter) @phasewise

- **Bio (160 char):** Project management built for landscape architecture firms. Phases, budgets, time, submittals, MWELO. Focus on the design. We'll handle the rest.
- **Location:** California, USA
- **Website:** https://phasewise.io
- **Profile picture:** 400×400 PNG, `#1A2E22` background, white logomark. Export from `brand_v2/phasewise-logomark.svg`.
- **Header image:** Use `brand_v2/phasewise-twitter-cover.svg` (1500×500). Export to PNG.
- **Pinned tweet:** [see X first-post below]

### Instagram @phasewise

- **Account type:** Business → Software & Apps
- **Profile picture:** 320×320 (Instagram crops to circle). Export logomark on `#1A2E22`.
- **Bio (150 char):**
  ```
  Built by a landscape architect, for landscape architects.
  Phases · budgets · MWELO · submittals · time · profit
  → phasewise.io
  ```
- **Linked email:** kevin@phasewise.io
- **Action button:** "Sign up" → https://phasewise.io/signup
- **Story highlights to create over week 1:**
  - **Phases** — what each LA project phase actually does
  - **MWELO** — the water budget calculator
  - **Profitability** — per-person breakdown screenshots
  - **Submittals** — overdue alerts in action
- **First post:** see Instagram first-post below; format as 1:1 (1080×1080) with `brand_v2/phasewise-instagram-post.svg` as base.

### GitHub github.com/phasewise

- **Avatar:** logomark on `#1A2E22`, 460×460 PNG.
- **Bio:** Project management built for landscape architecture firms. https://phasewise.io
- **Pinned repo:** Make `phasewise/phasewise` public (currently private — verify) so the README shows up. If keeping private, create a `phasewise/.github` repo with a community profile README.
- **README hook:** Lift the long-form bio + a 1-paragraph "for engineers" note ("TypeScript, Next.js 16, Prisma 6, Stripe, Supabase. Currently closed-source while we ramp.").

---

## First-post templates (use within 24h of claiming)

### LinkedIn first post (long-form, 1200–1500 char)

> After 18 months of building, Phasewise is live.
>
> I'm a Senior Landscape Architect at Caltrans, and I've watched principals at every firm I've worked at lose hours to the same admin grind: chasing submittals, reconciling timesheets, debugging budget spreadsheets, billing, MWELO calcs, plant schedules, change orders.
>
> So I built the tool I wish I'd had.
>
> Phasewise is project management designed for the way LA firms actually work — phases instead of generic "tasks", real billing rates and net multipliers instead of spreadsheets, MWELO calculators that cite the actual regulation, submittal logs with automatic reminders, and per-person profitability so you can see when junior staff are subsidizing senior fees.
>
> One subscription replaces QuickBooks Plus + Monday + Harvest. Starts at $99/mo. 14-day free trial. No credit card to start.
>
> If you run a firm and want a 15-minute walkthrough — DM me. Honestly more interested in your feedback than your money right now.
>
> phasewise.io
>
> #LandscapeArchitecture #AEC #SaaS #ProjectManagement #MWELO

### X first post (≤280 char)

> Built by a landscape architect, for landscape architects.
>
> Phasewise: phases · budgets · time · submittals · MWELO · profit. One subscription instead of three.
>
> 14-day free trial → phasewise.io

### Instagram first post (caption — image is the brand cover)

> Phasewise is live.
>
> One platform for the admin work landscape architecture firms actually do — project phases, budgets, time tracking, submittals, MWELO water budgets, plant schedules, compliance, profitability.
>
> Built by a Senior Landscape Architect at Caltrans (yes, really).
>
> Replaces the QuickBooks + Monday + spreadsheets stack. $99/mo Starter, 14-day free trial, no card to start.
>
> Tap the link in bio.
>
> #LandscapeArchitecture #LandscapeDesign #AEC #LASoftware #FirmOwner #DesignLife #MWELO #Sustainability

---

## Posting cadence (sustainable, not heroic)

The autonomous n8n SEO content pipeline ships ~1 article/week (Friday 7am Pacific). Once n8n is wired to your social accounts (next item in the queue), each article auto-posts to all four. Your only ongoing work:

- **LinkedIn:** 1 personal anecdote/insight every 2 weeks (manual — feels human)
- **X:** Reshare each new article + 1–2 spontaneous threads/month
- **Instagram:** Article reshare via story; 1 carousel/month showing UI screenshots
- **GitHub:** Update once a month with stars / contributor / release activity

If that feels like too much, drop Instagram and GitHub to "passive presence — claim and forget." LinkedIn + X with auto-posts will do the heavy lifting.

---

## Do these in order (15 min each, max)

1. Claim @phasewise on Instagram (Business account, link kevin@phasewise.io)
2. Upload profile pictures + cover images to all four platforms (assets in `brand_v2/`)
3. Post the four "first post" templates above
4. Verify the social links in the phasewise.io footer click through correctly
5. Send me (Claude) the message "social setup done" and I'll wire the n8n auto-post extension

---

## What's coming after this kit

I'll spec the n8n workflow extension so each new pillar article auto-posts to all four platforms with platform-specific formatting (X gets the headline + URL, LinkedIn gets the headline + 200-char excerpt + URL, Instagram gets a generated card image + caption). That ships next once these accounts have credentials I can wire into n8n.
