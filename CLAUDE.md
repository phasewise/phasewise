# Phasewise

The operating system for landscape architecture firms. Phasewise handles project management, budgets, time tracking, billing, communications, and approvals — so landscape architects can focus on design.

See `POC_SCOPE.md` for the full product spec and roadmap. See `BUSINESS_PLAN.md` for market research, financials, and go-to-market strategy.

## Origin & Related Projects

Phasewise was split off from the **Verifield Inc.** repo (`Documents/verifield-1/`) on 2026-04-08 after a strategic pivot. Context on why, and how the two projects relate:

### Where this came from — Verifield Inc.

Verifield is an anonymous brand (@VfieldInc) selling **passive digital automation products** on Gumroad + Etsy:
- 10 products live at $29–$129 (n8n workflows, Power Automate blueprints, Google Apps Scripts, niche vertical packs)
- Gumroad affiliate program active at 30% commission
- Automated social posting via n8n (workflow 05) + monthly AI tweet refill (workflow 11)
- Landing page: https://verifield.netlify.app

Verifield's original 4-tier revenue strategy targeted ~$72K/month:

| Tier | Product | Price | Monthly Target |
|------|---------|-------|----------------|
| Entry | Template packs | $29–$49 | 200 sales |
| Mid | Bundles / kits | $59–$149 | 100 sales |
| High | Subscription membership | $29/mo | 500 members |
| Premium | Custom automation service | $500–$1,500 | 40 clients |

### The pivot (2026-04-08)

**Decision:** Recurring SaaS revenue beats one-time templates for the $83K/month goal. Phasewise (vertical SaaS for Landscape Architecture firms, tapping Kevin's Caltrans domain expertise) became the **primary revenue vehicle**. Verifield demoted to **side income stream**.

### Phased roadmap — how the two fit together

- **Phase 1 — Verifield validation (complete):** Prove the brand, storefront mechanics, and automation stack can run passively. 10 products live, affiliate program active.
- **Phase 2 — Phasewise build (current, ~80% complete):** Ship the SaaS. 92 feature items done, E2E tested on production. Remaining: error state testing + 3 beta firms + Stripe live mode swap.
- **Phase 3 — Phasewise revenue:** First paying customer → $5K MRR → $83K/month ARR target. Verifield continues generating passive side income in parallel.
- **Phase 4 — Phasewise multi-industry:** Scale to AE / CM / AG verticals (name is intentionally industry-agnostic; see "Multi-Industry Scaling" below).

### What to carry over from Verifield

- **Kevin's profile:** Caltrans Senior Landscape Architect, n8n + React/TypeScript + SharePoint/SPFx + Power Automate expertise, prefers working solutions deployed quickly over extended troubleshooting.
- **Anonymous brand approach:** Worked for Verifield; Phasewise uses the same pattern (no personal visibility, brand-first).
- **Automation muscle:** Kevin already runs n8n Cloud (dailymm.app.n8n.cloud) — reuse it for Phasewise social scheduling and ops automation.
- **Support email pattern:** Verifield uses support.verifield@gmail.com; Phasewise will use kevin@phasewise.io once Google Workspace is live.

## Vision

**Core promise:** "Focus on the design. We'll handle everything else."

Landscape architects didn't choose their career to be project managers, accountants, or coordinators. Every hour spent chasing approvals, reconciling timesheets, or billing clients is an hour not spent on design — the thing they're paid for and the thing they love. Phasewise replaces that admin burden with automation and intelligent defaults.

**The product covers everything around the design work:**
- Project management (phases, deliverables, timelines, milestones)
- Budgets and profitability (real-time burn rates, alerts before overruns)
- Time tracking (per project, per phase, mobile-friendly)
- Office work (staff utilization, capacity planning)
- Client management (contacts, portals, automated communications)
- Coordination with engineers, architects, contractors, utilities, city/county
- Billing and invoicing (Stripe + QuickBooks sync)
- Approvals (submittals, RFIs, change orders)
- Compliance (MWELO, LEED, SITES, ADA, permits)

**Marketing must reflect this positioning** — sell the *outcome* (more time designing, less time on admin), not the *mechanism* (phase tracking). Hero copy, graphics, social posts, and feature pages should all reinforce "we handle the rest."

## Brand

- **Name:** Phasewise (formerly PowerKG)
- **Primary tagline:** Focus on the design. We'll handle everything else.
- **Secondary tagline:** Project management built for landscape architects.
- **Primary domain:** phasewise.io (live, deployed)
- **Backup domain:** getphasewise.com (owned, redirect to .io)
- **phasewise.com:** For sale at ~$4,888 on Afternic — negotiate to ~$1,500 when revenue justifies it
- **Naming rationale:** Documented in BUSINESS_PLAN.md under "Brand Identity: Why Phasewise"

### Brand Style (v2 — current)

The v2 brand draws inspiration from professional AEC software like landfx.com — clean, premium, design-aware. Reference assets in `brand_v2/`. Apply this v2 style to all surfaces (landing page, app, social, marketing).

**Color palette (forest + stone):**

| Token | Hex | Use |
|-------|-----|-----|
| `--green-900` | `#0D2218` | Deepest backgrounds |
| `--green-800` | `#1A2E22` | Dark sections, hero mockup background |
| `--green-700` | `#2D6A4F` | Primary brand color, CTAs |
| `--green-500` | `#40916C` | Mid accent, hover states |
| `--green-300` | `#52B788` | Light accent, success indicators |
| `--green-100` | `#B7E4C7` | Soft backgrounds |
| `--green-50` | `#F0FAF4` | Subtle tints |
| `--stone-500` | `#C9A87C` | Warm accent (warnings, premium) |
| `--stone-300` | `#E8D5B7` | Soft warm |
| `--stone-50` | `#FAF6EF` | Cream sections |
| `--ink-900` | `#1A2E22` | Primary text on light |
| `--ink-700` | `#3D5C48` | Body text |
| `--ink-500` | `#6B8C74` | Secondary text |
| `--ink-300` | `#A3BEA9` | Muted text |
| `--ink-100` | `#E8EDE9` | Borders |
| `--surface` | `#F7F9F7` | Off-white sections |
| `--border` | `#E2EBE4` | Default borders |

**Typography:**
- **Headlines:** `DM Serif Display` (Google Fonts) — italic for emphasis. Premium, editorial feel.
- **Body:** `Outfit` (Google Fonts) — weights 300, 400, 500, 600, 700. Clean, modern sans-serif.
- **Overlines/labels:** Outfit 600, uppercase, letter-spacing 0.18em, color `--green-500`

**Logo concept:** Four stacked horizontal phase bars of varying widths (decreasing then increasing) representing project phases progressing. Suggests the "P" in Phasewise without being literal. Cleaner and more memorable than ascending bars.

**Brand assets:**
- `brand_v2/` — current source of truth (logos, social images, full landing page reference)
- `brand/` — v1 assets, **deprecated**, will be replaced

### Social Accounts (Claimed)

| Platform | Handle/URL |
|----------|-----------|
| GitHub | github.com/phasewise |
| LinkedIn | linkedin.com/company/phasewise-io |
| X/Twitter | @phasewise |
| Instagram | TODO — claim @phasewise |

### Multi-Industry Scaling (Future)

The name is intentionally industry-agnostic. Future verticals to develop:

| Product | Market | Notes |
|---------|--------|-------|
| **Phasewise** (core) | Landscape Architecture | Current focus. LA-specific phases, MWELO, plant schedules. |
| **Phasewise AE** | Architecture & Engineering | Programming → SD → DD → CD → CA phases |
| **Phasewise CM** | Construction Management | Pre-Con → Mobilization → Construction → Closeout |
| **Phasewise AG** | Agriculture | Planning → Planting → Growing → Harvest → Fallow |

Each vertical shares the core platform but adds industry-specific phase types, terminology, compliance features, and integrations. Do not build multi-industry features yet — focus on LA until product-market fit is achieved.

## Pre-Launch Readiness

**Do not officially launch or drive traffic until ALL of these are true:**

- [x] Landing page reflects v2 brand and "Focus on the design" positioning
- [x] Mobile responsive landing page (hero clipping fixed 2026-04-09)
- [x] Favicon + PWA icons (browser tab + iOS home screen)
- [x] Stripe billing wired up: checkout, customer portal, webhook handler
- [x] Loops email integration (welcome, trial-started, canceled, payment-failed)
- [x] Loops transactional templates created in dashboard + IDs added to env ✅ 2026-04-16
- [x] End-to-end test: signup → checkout (Stripe test card) → emails → DB sync ✅ 2026-04-17
- [x] All core features work seamlessly (project CRUD, time tracking, budgets, reports)
- [x] Project editing ✅ 2026-04-12
- [x] Profitability reporting dashboard ✅ 2026-04-13
- [x] Client management module ✅ 2026-04-13
- [x] Contact list capture from landing page (waitlist + signup) ✅ 2026-04-11
- [x] Onboarding flow (3-step checklist, auto-dismisses) ✅ 2026-04-13
- [x] Empty states designed for every page ✅ 2026-04-13
- [ ] Error states tested (failed payments, network errors, validation)
- [x] Privacy Policy + Terms of Service pages ✅ 2026-04-13
- [x] Loading states for slow operations ✅ 2026-04-13
- [ ] At least 3 beta firms using it daily (real validation)

## Infrastructure & Services

### Deployment

- **Hosting:** Vercel (Hobby plan, Pro Trial active until ~2026-04-22)
- **Live URL:** https://phasewise.io
- **Vercel URL:** phasewise.vercel.app
- **Database:** Supabase PostgreSQL — West US (North California), project "Phasewise" under org "Phasewise"
- **DNS:** Cloudflare — A record `@` → `216.198.79.1` (DNS only, no proxy)
- **Auto-deploy:** Pushing to `main` on GitHub triggers Vercel deployment automatically
- **Repo:** github.com/phasewise/phasewise (public)

### Service Architecture (Decided + Wired)

| Need | Service | Status |
|------|---------|--------|
| **Hosting** | Vercel | ✅ Deployed, auto-deploys from GitHub `main` |
| **Database + Auth** | Supabase | ✅ Live, schema synced via Prisma |
| **Payments** | Stripe | ✅ Code complete (sandbox/test mode) — checkout, customer portal, webhook, billing page. Live mode swap is env-var-only. |
| **Transactional + marketing email** | **Loops** (not Resend, not SendGrid) | ✅ SDK installed + lib/loops.ts wrapper. ⏳ Templates + Vercel env vars pending. |
| **Business email** | Google Workspace (planned) | ⏳ kevin@phasewise.io — set up after first paying customer |
| **Social media scheduling** | n8n (Kevin already knows it) | ⏳ Build after launch |
| **Analytics** | Vercel Analytics + Plausible | ⏳ Add before public launch |

### Why Loops over Resend / SendGrid

- **Resend free tier** locks to 1 domain — already used on `focus-track.app` for FocusTrack project. Adding Phasewise would require Pro ($20/mo).
- **SendGrid free tier** still works, but the existing kgallo22 SendGrid account had its 60-day trial expire and the dashboard is dated.
- **Loops free tier:** 1,000 emails/month, custom domain auth on free, modern UI, built specifically for SaaS founders. "Powered by Loops" footer on free tier (acceptable for beta — removable on Pro).
- **Trade-off:** Loops doesn't have separate transactional/marketing audiences. We use one tool for both, which is actually simpler at this stage.

### Stripe Setup

- **Account structure:** Flag Loma (organization) → Phasewise (account) — sibling to FocusTrack account
- **Mode:** LIVE ✅ (as of 2026-04-23). Production uses `pk_live_*`/`sk_live_*`. Preview + Development still use `pk_test_*`/`sk_test_*` to protect branch previews.
- **Products created:** Starter ($99/mo), Professional ($199/mo, featured), Studio ($349/mo)
- **Trial period:** 14 days, configured in code at `/api/stripe/checkout/route.ts` — applies on first subscription only (`isFirstSubscription` check prevents abuse)
- **Webhook endpoint:** `https://phasewise.io/api/stripe/webhook` listening to 6 events:
  - `checkout.session.completed`
  - `customer.subscription.{created,updated,deleted,trial_will_end}`
  - `invoice.payment_failed`
- **Tax + invoicing:** Stripe Tax enabled (auto-collect), invoicing enabled, customer tax IDs collected
- **Coupons/promos:** `allow_promotion_codes: true` in Checkout — customers can enter codes; we can also pass specific coupons via the API

### Loops Setup

- **Account:** kgallo22@gmail.com (will move to kevin@phasewise.io after Google Workspace)
- **Sending domain:** `mail.phasewise.io` (subdomain — protects root domain reputation)
- **DNS records added to Cloudflare:**
  - MX `envelope.mail` → `feedback-smtp.us-east-1.amazonses.com`
  - TXT `envelope.mail` → SPF (`v=spf1 include:amazonses.com ~all`)
  - TXT `_dmarc.mail` → DMARC (`v=DMARC1; p=none;`)
  - 3× CNAME DKIM records (`*._domainkey.mail` → `*.dkim.amazonses.com`)
- **API key:** Generated, stored in `LOOPS_API_KEY`
- **Templates:** ⏳ Need to create 4 transactional templates in dashboard:
  1. **Welcome** (signup) — vars: `firstName`, `firmName`
  2. **Trial started** (after Stripe checkout) — vars: `firstName`, `firmName`, `planName`, `trialEndDate`
  3. **Subscription canceled** — vars: `firstName`, `firmName`
  4. **Payment failed** — vars: `firstName`, `firmName`
  - Once created, copy template IDs into env vars `LOOPS_TEMPLATE_WELCOME`, `LOOPS_TEMPLATE_TRIAL_STARTED`, `LOOPS_TEMPLATE_SUBSCRIPTION_CANCELED`, `LOOPS_TEMPLATE_PAYMENT_FAILED`
- **Important:** All Loops sends are fire-and-forget — failures NEVER block signup or webhook processing. Code in `lib/loops.ts` handles missing key/template gracefully.

### Environment Variables

All variables are set in **Vercel project Settings → Environment Variables** AND in local `app/.env` (except `NEXT_PUBLIC_APP_URL` which differs: `http://localhost:3000` locally, `https://phasewise.io` in Vercel).

| Variable | Status | Source |
|----------|--------|--------|
| `DATABASE_URL` | ✅ | Supabase > Connect > ORM > Prisma (pooled, port 6543) |
| `DIRECT_URL` | ✅ | Supabase > Connect > ORM > Prisma (direct, port 5432) |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase > Project Settings > API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase > Project Settings > API |
| `NEXT_PUBLIC_APP_URL` | ✅ | `https://phasewise.io` (prod) / `http://localhost:3000` (local) |
| `STRIPE_SECRET_KEY` | ✅ test mode | Stripe Dashboard > Developers > API keys (`sk_test_*`) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | ✅ test mode | Stripe Dashboard > Developers > API keys (`pk_test_*`) |
| `STRIPE_WEBHOOK_SECRET` | ✅ test mode | Stripe Dashboard > Workbench > Webhooks > Phasewise app endpoint |
| `NEXT_PUBLIC_STRIPE_PRICE_STARTER` | ✅ | Stripe product Starter > Events log |
| `NEXT_PUBLIC_STRIPE_PRICE_PROFESSIONAL` | ✅ | Stripe product Professional > Events log |
| `NEXT_PUBLIC_STRIPE_PRICE_STUDIO` | ✅ | Stripe product Studio > Events log |
| `LOOPS_API_KEY` | ✅ | Loops > Settings > API |
| `LOOPS_TEMPLATE_WELCOME` | ✅ | `cmnsy2ivn01fx0iyrotfy4w2i` (branded 2026-04-16) |
| `LOOPS_TEMPLATE_TRIAL_STARTED` | ✅ | `cmo1yvph60i0g0izrztwksafl` (branded 2026-04-16) |
| `LOOPS_TEMPLATE_SUBSCRIPTION_CANCELED` | ✅ | `cmo1yw7mk0gru0h1uw8yzx5yb` (branded 2026-04-16) |
| `LOOPS_TEMPLATE_PAYMENT_FAILED` | ✅ | `cmo1ywidl0hbu0jxzj127ssvc` (branded 2026-04-16) |
| `LOOPS_TEMPLATE_SUBMITTAL_REMINDER` | ✅ | `cmo1ywq5505dy0izn74icj1zy` (branded 2026-04-16) |
| `LOOPS_TEMPLATE_BUDGET_ALERT` | ✅ | `cmo1ywy7r074g0iuqkp0yntnw` (branded 2026-04-16) |
| `LOOPS_TEMPLATE_INVITE` | ⏳ pending | Loops > Transactional > Invite template (optional — link sharing works without it) |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Supabase > Settings > API Keys > Legacy > service_role |

### Switching Stripe to Live Mode (when ready)

This is an env-var-only change. **Code requires zero modifications.**

1. In Stripe dashboard, switch to **live mode** (toggle off sandbox)
2. **Recreate the 3 products** in live mode (Stripe sandbox products are isolated from live mode)
3. Get the new live `price_*` IDs
4. Generate live `pk_live_*` and `sk_live_*` API keys
5. Create a new live webhook endpoint pointing to `/api/stripe/webhook` and copy its `whsec_*` signing secret
6. Update Vercel env vars (Production environment only):
   - `STRIPE_SECRET_KEY`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `NEXT_PUBLIC_STRIPE_PRICE_STARTER/PROFESSIONAL/STUDIO`
7. Redeploy

**Recommendation:** Keep Preview/Development environments on test keys so branch previews stay safe. Only Production gets live keys.

## Tech Stack

- **Framework:** Next.js 16 (App Router) — see `app/AGENTS.md` for breaking-change rules
- **Language:** TypeScript (strict)
- **Database:** PostgreSQL via Supabase, ORM is Prisma 6.19.3 (`app/prisma/schema.prisma`)
- **Auth:** Supabase Auth (server-side via `@supabase/ssr`)
- **UI:** Tailwind CSS 4, Lucide icons, Base UI components
- **Fonts:** DM Serif Display (headlines) + Outfit (body) via `next/font/google`
- **Payments:** Stripe v22 (`stripe` package, server-side only — no Stripe Elements yet)
- **Email:** Loops v6.3.0 (`loops` package, server-side only)
- **Hosting:** Vercel
- **Favicon/PWA:** App Router file conventions (`app/icon.svg`, `app/apple-icon.tsx`, `app/manifest.ts`)

## Project Structure

```
phasewise/                        # Repo: github.com/phasewise/phasewise
├── app/                          # Next.js application root (Vercel root directory)
│   ├── prisma/schema.prisma      # Database schema (source of truth)
│   ├── .env                      # Local environment variables (not committed)
│   ├── src/
│   │   ├── app/
│   │   │   ├── (app)/            # Authenticated app routes (shared sidebar layout)
│   │   │   ├── (auth)/           # Login and signup pages
│   │   │   └── api/              # Route handlers
│   │   └── lib/
│   │       ├── prisma.ts         # Prisma client singleton
│   │       ├── constants.ts      # Phase labels, status colors, plan limits
│   │       └── supabase/         # Server/client/auth helpers
│   └── package.json
├── brand/                        # v1 brand assets (deprecated)
├── brand_v2/                     # v2 brand assets (CURRENT — apply this)
├── BUSINESS_PLAN.md
├── POC_SCOPE.md
└── CLAUDE.md
```

## Key Conventions

### Next.js 16 Breaking Changes

- **`params` is a Promise** — always `await params` in pages, layouts, and route handlers:
  ```ts
  // Pages
  export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
  }
  // Route handlers
  export async function POST(request: Request, { params }: { params: Promise<{ projectId: string }> }) {
    const { projectId } = await params;
  }
  ```
- Read `node_modules/next/dist/docs/` before using any unfamiliar Next.js API.

### Auth Pattern

All authenticated pages/routes follow:
1. Call `getCurrentUser()` from `@/lib/supabase/auth`
2. Null-check the result (return 401 or redirect)
3. Use `currentUser.organizationId` to scope all DB queries (multi-tenant isolation)

### Database

- Run `npx prisma generate` after any schema change
- Run `npx prisma db push` to sync schema to Supabase
- Prisma schema uses `directUrl` for migrations (direct connection, port 5432)
- Prisma Decimal fields need `Number()` conversion for display
- Use enum types from `@prisma/client` (e.g., `PhaseType`, `PhaseStatus`) when casting user input

### API Routes

- Wrap handlers in try/catch, return `{ error: string }` with appropriate status codes
- Validate auth and org membership before any mutation
- Type request body fields — avoid `any`

### Components

- Server components by default; add `"use client"` only when needed (state, event handlers)
- Client component prop types must accept `Date | string` for Prisma date fields (serialization boundary)
- Use `DM Serif Display` for headlines, `Outfit` for body — both via `next/font/google`

## Commands

```bash
cd app
npm run dev          # Start dev server
npx tsc --noEmit     # Type check
npx prisma generate  # Regenerate Prisma client
npx prisma db push   # Push schema to database
npx prisma studio    # Visual database browser
```

## Build Order (Priority)

Most meaningful first. Strikethrough = done.

1. ~~Apply v2 brand to landing page~~ ✅ 2026-04-09
2. ~~Apply v2 brand to authenticated app~~ ✅ 2026-04-09
3. ~~Refresh positioning to "Focus on the design"~~ ✅ 2026-04-09
4. ~~Mobile responsive landing page (hero clipping fix)~~ ✅ 2026-04-09
5. ~~Favicon + PWA icons~~ ✅ 2026-04-09
6. ~~Stripe integration — checkout, customer portal, webhook handler, billing page~~ ✅ 2026-04-09 (test mode)
7. ~~Loops integration — SDK + lib wrapper + welcome/trial/canceled/payment-failed wired~~ ✅ 2026-04-09
8. ~~Loops transactional templates + env vars~~ ✅ 2026-04-10
9. ~~Stripe Tax (sandbox) head office address registered~~ ✅ 2026-04-10
10. ~~End-to-end test: signup → welcome email~~ ✅ 2026-04-10
11. ~~End-to-end test: checkout → trial active → trial started email~~ ✅ 2026-04-10
12. ~~End-to-end test: Customer Portal opens, cancellation flow~~ ✅ 2026-04-10
13. ~~End-to-end test: cancellation → "Sorry to see you go" email~~ ✅ 2026-04-11 (commit `979c65c`)
14. ~~Waitlist + contact capture on landing page~~ ✅ 2026-04-11 (commit `e96dc00`)
15. ~~Forgot password flow (Supabase resetPasswordForEmail + reset page)~~ ✅ 2026-04-11
16. ~~User identity widget (name + email + logout) in authenticated sidebar~~ ✅ 2026-04-11
17. ~~Mobile landing page clipping (round 2 fix)~~ ✅ 2026-04-11
18. ~~PWA icon improvements (icons metadata + redesigned apple-icon)~~ ✅ 2026-04-11
19. ~~PWA icons (round 2 — real PNG routes for Brave/Chrome)~~ ✅ 2026-04-11
20. ~~Mobile horizontal overflow fix (body overflow-x-hidden, mockup hidden, H1 text-wrap)~~ ✅ 2026-04-11

21. ~~Collapsible mobile sidebar (hamburger menu + slide-in drawer)~~ ✅ 2026-04-12
22. ~~Staff billing rates + salary management with privacy controls~~ ✅ 2026-04-12
23. ~~Auto-numbering projects (PW-001, PW-002... with org-level prefix + counter)~~ ✅ 2026-04-12
24. ~~Add/edit/deactivate team members~~ ✅ 2026-04-12
25. ~~Log in link visible on mobile nav~~ ✅ 2026-04-12
26. ~~$ prefix on fee inputs~~ ✅ 2026-04-12
27. ~~Time Sheets redesign (dropdowns, single-row entry, + button)~~ ✅ 2026-04-12
28. ~~LA firm title expansion (18 industry-specific titles with defaults)~~ ✅ 2026-04-12
29. ~~Admin time entry visibility (supervisors/admins view others' timesheets)~~ ✅ 2026-04-12
30. ~~Project editing (edit page + GET/PATCH/DELETE API + phase editing)~~ ✅ 2026-04-12
31. ~~Auto-estimate billing from staff assignments per phase~~ ✅ 2026-04-12
32. ~~Hourly cost display in billing rates section~~ ✅ 2026-04-12
33. ~~Customizable auto-numbering prefix (org-level settings + API)~~ ✅ 2026-04-12
34. ~~Phase editing (add/edit/remove phases with budget + hours on project edit page)~~ ✅ 2026-04-12
35. ~~Static SVG PWA icons in /public for Brave/Chrome compatibility~~ ✅ 2026-04-12
36. ~~Prisma generate in build script (prevents stale-client Vercel failures)~~ ✅ 2026-04-12

37. ~~Work Plan (per-phase staff assignments with hours + cost)~~ ✅ 2026-04-13
38. ~~Auto-numbering settings UI (prefix, starting number, toggle)~~ ✅ 2026-04-13
39. ~~Profitability reporting dashboard (summary cards, color-coded, totals footer)~~ ✅ 2026-04-13
40. ~~Fixed pricing tagline (replaced inaccurate QuickBooks claim with honest "One subscription instead of three")~~ ✅ 2026-04-13

41. ~~Budget alerts (dashboard health badges + email on 75%/90%/100% threshold)~~ ✅ 2026-04-13
42. ~~Admin section (owner-only sidebar + business ops dashboard)~~ ✅ 2026-04-13
43. ~~Submittal & RFI log (CRUD + status tracking + ball-in-court + overdue)~~ ✅ 2026-04-13
44. ~~Custom phase types (OTHER enum + customName override)~~ ✅ 2026-04-13
45. ~~Team Utilization report (per-person hours, utilization %, revenue, profit)~~ ✅ 2026-04-13
46. ~~Plant Schedule Manager (model + CRUD API + page with approval tracking)~~ ✅ 2026-04-13
47. ~~Compliance Tracker (MWELO/LEED/SITES/ADA/PERMIT + status + due dates)~~ ✅ 2026-04-13
48. ~~Fixed pricing tagline (honest "One subscription instead of three")~~ ✅ 2026-04-13

### Active Build Queue (updated 2026-04-13 — ALL landing page promises now built)

**All 6 core landing page feature promises are now implemented:**
1. ✅ One dashboard with project health at a glance (with budget alert badges)
2. ✅ Real-time budget alerts before you go over (75%/90%/100% + email)
3. ✅ Staff submit time from anywhere (timesheet grid, mobile sidebar)
4. ✅ Submittal log with automatic reminders (status tracking, ball-in-court, overdue)
5. ✅ Profitability reports per project, per phase, per person (two report pages)
6. ✅ Phases built in (7 standard + custom phase types)
7. ✅ Plant Schedule Manager (tracking, substitutions, approval)
8. ✅ Compliance Tracker (MWELO, LEED, SITES, ADA, permits)

**Remaining priorities (UX polish + operations):**

49. ~~Client management module (model + API + page with card grid)~~ ✅ 2026-04-13
50. ~~Dashboard v2 brand polish + color-coded health visualization~~ ✅ 2026-04-13
51. ~~Onboarding checklist (3-step, auto-dismisses when complete)~~ ✅ 2026-04-13
52. ~~Privacy Policy page~~ ✅ 2026-04-13
53. ~~Terms of Service page~~ ✅ 2026-04-13
54. ~~Plant Schedule: interactive create form + inline status updates~~ ✅ 2026-04-13
55. ~~Compliance Tracker: interactive create form + inline status updates~~ ✅ 2026-04-13

### Remaining items

56. ~~Submittal reminders — automated email reminders for overdue submittals via Loops~~ ✅ 2026-04-13
57. ~~Project detail report — per-phase burn breakdown for a single project~~ ✅ 2026-04-13
58. ~~Empty states + loading states — production polish across all pages~~ ✅ 2026-04-13
59. ~~Password visibility toggle — eye icon on login, signup, reset-password~~ ✅ 2026-04-14
60. ~~Forgot password fix — PKCE auth callback route for code exchange~~ ✅ 2026-04-14
61. ~~User profile page — click avatar to edit name, title, phone, photo~~ ✅ 2026-04-14
62. ~~Edit modals — click-to-edit for Clients, Plants, Compliance, Submittals~~ ✅ 2026-04-14
63. ~~Phase & Workplan auto-sync — work plan save updates phase budget/fee~~ ✅ 2026-04-14
64. ~~Profitability report — uses work plan rates instead of project assignments~~ ✅ 2026-04-14
65. ~~Invoice model + admin billing page — create invoices, track payments~~ ✅ 2026-04-14
66. ~~Compliance file attachments — PDF/Word/image upload via Supabase Storage~~ ✅ 2026-04-14
67. ~~MWELO Water Budget Calculator — hydrozone-based MAWA/ETWU with printable report~~ ✅ 2026-04-14

**Operations:**

68. ~~**Replace `/brand` v1 assets with v2 versions**~~ ✅ 2026-04-15 — `brand/` deleted, `brand_v2/` is sole source of truth.
69. **Stripe Tax: revisit before going live** — placeholder CA registration only
70. **Switch Stripe to live mode** — env var swap only
71. **Social media automation (n8n)** — scheduled posts to LinkedIn/X/Instagram
72. ~~**Google Workspace setup**~~ ✅ 2026-04-15 — Domain verified, Gmail active, DKIM active, test email received at kevin@phasewise.io.
73. **USPTO trademark filing** — protect the name
74. ~~**Supabase Storage buckets + RLS policies**~~ ✅ 2026-04-15 — `profile-photos` and `compliance-docs` buckets created; SELECT/INSERT/UPDATE/DELETE policies scoped to `authenticated` role.
75. ~~**Vercel Cron for submittal reminders**~~ ✅ 2026-04-15 — `vercel.json` registers `/api/cron/submittal-reminders` at 14:00 UTC daily. CRON_SECRET env var set in Vercel + local `.env`.
76. ~~**Password reset flow end-to-end fix**~~ ✅ 2026-04-15 — Root cause: Site URL pointed to localhost; Supabase template used `.ConfirmationURL` which link-scanners consumed; middleware blocked `/api/auth/*`. Fixed all three.
77. ~~**Profile photo auto-compression**~~ ✅ 2026-04-15 — Client-side canvas resize to 800px + JPEG q=0.85 so phone photos upload without hitting the 2MB limit.
78. ~~**Project task edit modal**~~ ✅ 2026-04-16 — Click task name to open edit modal (name, description, due date, assignee, status). Delete button. DELETE handler on API.
79. ~~**Work Plan → phase rollup fix**~~ ✅ 2026-04-16 — Phases PUT was clobbering synced budgets on Save-all-changes. Stripped budget writes from the phases endpoint; Work Plan endpoint is now the sole writer. Edit page refetches phase budgets after Work Plan save.
80. ~~**Timesheet UX: missing-phase hint + logging-as chip**~~ ✅ 2026-04-16 — Amber hint when a project has no phases; read-only name chip for STAFF/PM who can't switch users.
81. ~~**Leave & PTO tracking**~~ ✅ 2026-04-16 — LeaveType enum (VACATION/SICK/HOLIDAY/UNPAID/OTHER), nullable projectId/phaseId on TimeEntry, Organization.leavePolicy + User.leavePolicyOverride JSON. Admin page (`/admin/leave`) with firm-wide policy + per-employee override modal + live balances. Balance widget on timesheet. "Add leave / PTO" button. Auto-computed used hours.
82. ~~**Timesheet week navigation**~~ ✅ 2026-04-16 — Prev/Next + date picker + "This week" button. Past weeks editable unless approved (read-only) or submitted (chip shown). Future weeks editable only if current week has been submitted. Server-side enforcement matches UI.
83. ~~**Copy rows from last week**~~ ✅ 2026-04-16 — Timesheet button to add last week's distinct rows with 0 hours.
84. ~~**Invoice PDF generation**~~ ✅ 2026-04-16 — Branded server-side PDF via @react-pdf/renderer. Route `GET /api/invoices/:id/pdf`. PDF link on every row in `/admin/billing`.
85. ~~**Profile photo cache fix**~~ ✅ 2026-04-17 — Cache-busting timestamp on photo URLs so new uploads display immediately. Error handling on DB save.
86. ~~**LA job titles in team management**~~ ✅ 2026-04-17 — 20 LA-specific titles wired into team add/edit form with auto-set permission level + billing defaults. Inline title editing. "Permission Level" clarity rename. Custom title option.
87. ~~**PWA icon fix for Android**~~ ✅ 2026-04-17 — Manifest switched from SVG to PNG icon routes. Added maskable icon with safe-zone padding.
88. ~~**E2E test: full signup → checkout → cancel flow**~~ ✅ 2026-04-17 — All 6 steps passed on production: signup, welcome email, Stripe checkout, trial-started email, DB sync verified, customer portal + cancellation email.
89. ~~**Team invitation flow**~~ ✅ 2026-04-17 — Owner adds member → Invitation record created (7-day expiry) → invite link shareable via "Copy invite link" or "Send invite" button → staff clicks link → sets password → Supabase auth created via admin API → pending User linked → redirected to dashboard. Middleware allows `/invite/*` and `/api/invitations/*` public.
90. ~~**Overhead / admin time tracking**~~ ✅ 2026-04-17 — OverheadCategory enum (General Admin, Marketing, Training/PD, Meetings, Business Dev, IT/Equipment). "Add overhead / admin" button on timesheet. Non-billable. Category dropdown. Copy-from-previous-week support.
91. ~~**New job titles: Drafter/Technician + Irrigation Designer**~~ ✅ 2026-04-17 — Added to billing-defaults.ts and TeamMembersClient title dropdown.
92. ~~**Invite UX banner**~~ ✅ 2026-04-17 — Clear instruction banner after clicking "Send invite" with copyable link URL and dismiss button.

## Competitive Positioning

**What Phasewise replaces (honestly):**

| Tool | Monthly Cost | Phasewise Replaces? |
|------|-------------|---------------------|
| QuickBooks Plus (job costing) | $90/mo | Partially (billing, profitability tracking) |
| Monday.com / Asana (PM) | $40-80/mo team | Yes (project phases, tasks, deadlines) |
| Harvest / Toggl (time tracking) | $30-50/mo | Yes (timesheets, approval, per-phase) |
| Monograph (architecture PM) | $50-100/seat/mo | Yes (closest competitor — we're LA-specific) |
| Budget spreadsheets | $0 (but hours of work) | Yes (real-time burn rates, auto-estimation) |
| **Combined** | **$210-320+/mo** | **Phasewise at $99-199/mo is genuinely cheaper** |

**What Phasewise does NOT replace:** AutoCAD, Land F/X, Bluebeam, SketchUp, Lumion, Enscape, Adobe Acrobat, Microsoft 365. These are design/production tools; Phasewise is the operations layer.

**Honest value prop:** "One subscription instead of three — replaces your PM tool, time tracker, and budget spreadsheets with a platform that understands LA project phases."

## Billing Rates — Industry Reference Data

Standard billing rates for landscape architecture firms. Pre-populated as defaults in the staff management module. Owner can modify per-staff.

**Net multiplier:** 2.5x–3.5x base hourly salary (industry standard). The "Rule of Thirds" splits the billing rate into: 1/3 raw salary, 1/3 overhead (office, insurance, benefits ~20-25% on top of base), 1/3 profit & revenue.

| Staff Level | Default Annual Salary | Approx Hourly Pay | Default Billing Rate |
|-------------|----------------------|-------------------|---------------------|
| Principal / Owner | $120,000 | $58 | $200 |
| Senior Associate / PM | $100,000 | $48 | $175 |
| Landscape Architect | $85,000 | $41 | $150 |
| Designer (2-4 yrs) | $67,000 | $32 | $115 |
| Entry Level / Junior | $57,000 | $27 | $90 |

**Key factors:**
- Utilization target: 85-95% for production staff
- Location adjustments: +30-50% in SF/NY/LA markets
- Freelancers: typically $40-75/hour (lower multiplier, lower overhead)

**Privacy model:**
- OWNER and ADMIN can view/edit all staff salary + billing rates
- SUPERVISOR and PM can see billing rates only (not salary)
- STAFF can see only their own rate (not others')
- No salary information is ever exposed in client-facing features (reports, invoices, etc.)

**Auto-estimation logic:**
When staff are assigned to a phase:
1. `estimatedFee = sum(assignedStaff[i].billingRate × phase.budgetedHours / numberOfAssignedStaff)`
2. If hours are specified per-staff: `estimatedFee = sum(staff[i].billingRate × staff[i].assignedHours)`
3. Owner can override the auto-calculated estimate with a manual value
4. System always shows both "estimated" and "budgeted" so the owner can compare

## Product Wishlist (proposed, not committed)

Ordered by my estimated value-per-effort. Revisit during the forensic audit.

- **Dashboard v3** — add "This week's hours", "Pending approvals", "Upcoming deadlines", "Invoices outstanding" tiles.
- **Timesheet CSV export** — per-user or per-project, for accountants and invoicing backup.
- **Project search / filter** — flat list breaks at ~20 projects.
- **Client portal / shared read-only link** — send clients a URL that shows project health, current phase, outstanding submittals, invoice status. Big differentiator — no competitor does this well for LA firms.
- **Plant library redesign** — current flat list is low-value. Turn it into a reusable firm library that auto-populates MWELO hydrozones and links to submittals. Irrigation section a candidate companion.
- **Leave request/approval workflow** — employee requests → manager approves → auto-adds to timesheet. Currently leave is entered directly; this adds a real approval step like vacation requests in most HRIS systems.
- **Pro-rata leave accrual** — accrues per pay period instead of annual front-loading. For firms that prefer it.
- **Automated year-end rollover** — apply the `rolloverCap` automatically when the calendar year changes.
- **Forensic audit** — top-to-bottom value review once the queue slows down. Rate each feature on value delivered vs maintenance cost. Cut or sharpen anything that doesn't earn its keep.

## Where We Left Off (2026-04-24 mid-morning)

**Status: 8 PILLAR ARTICLES LIVE + DIRECTORY SUBMISSION PLAYBOOK READY.** Stripe live. Landing page clean and honest. Blog now has 8 pillar articles covering highest-intent LA firm searches. Directory listing copy prepared for AlternativeTo, Capterra, G2 submissions. SEO flywheel is spinning with real breadth now.

### What shipped today (2026-04-24)

Commit: `f85e3e2` (5 new pillar articles).

#### Blog: 5 more pillar SEO articles shipped (now 8 total)

Targeting high-intent LA firm searches to accelerate Google authority. Each ~1,500–1,800 words, cross-linked, with soft product CTAs:

4. **`/blog/monograph-alternatives-landscape-architecture`** — 🔥 **HIGHEST commercial intent.** Honest comparison of Monograph vs Phasewise, BQE Core, Deltek, Harvest+Asana+QBO stack, spreadsheets. Decision framework by firm size + migration guide.
5. **`/blog/landscape-architect-fee-proposal-template`** — High search volume, funnel-top. Full proposal walkthrough: project understanding, scope, exclusions, fee structures (fixed/hourly/percentage), payment schedules, change order process. Industry fee benchmarks included.
6. **`/blog/construction-administration-checklist-landscape-architects`** — Senior PM intent. Pre-construction, submittal review, RFI workflow, site observation, change orders, punch list, plant establishment period. CA efficiency metrics to track.
7. **`/blog/how-to-calculate-landscape-architect-profit-margin`** — Owner intent, commercial searches. Direct labor, overhead allocation, worked example. 6 common mistakes firms make + industry benchmarks by firm size.
8. **`/blog/landscape-architecture-submittal-log-best-practices`** — Direct match to Phasewise feature, deep funnel. Required fields, numbering systems, response time targets, ball-in-court protocol, substitution review.

All articles ship with:
- JSON-LD Article schema (Google rich snippets)
- Cross-links to other articles + related product features
- Branded `.prose-phasewise` typography
- Bottom CTA back to signup
- Static generation at build time (fastest possible page loads)

Blog now rendering 8 routes at build time. See `app/content/blog/` for all articles.

#### Directory submission playbook created

New file at project root: **`directory-listings.md`** — not deployed, just a reference document. Contains copy-paste ready content for submitting Phasewise to SaaS directories:

- Universal fields (company info, pricing, categories)
- 4 pre-written descriptions (25 / 50 / 100 / 200 words) — match whatever field length the directory requires
- Full feature list (20+ features)
- Pricing tier details
- Per-directory submission URLs and specific field requirements for:
  - **AlternativeTo** (highest priority — ranks for "Monograph alternatives" etc.)
  - **Capterra** (largest AEC SaaS directory)
  - **G2** (second-largest, huge SEO authority)
- Common mistakes to avoid (don't overpromise, don't skip screenshots, etc.)

**Kevin's next action (15-30 min per site):** Open `directory-listings.md` → submit to AlternativeTo first, then Capterra, then G2. Each submission = passive referral traffic for years.

### Earlier (2026-04-23 EOD)

Landing page honesty pass + blog infrastructure + first 3 pillar articles (commits `8cf9007`, `3bc20cc`). Details below.

### What shipped 2026-04-23 (evening session)

Commits: `8cf9007` (landing page honesty pass + SEO foundations), `3bc20cc` (blog + 3 articles).

#### 1. Test account cleanup
- ✅ Deleted `kgallo22+pwlive1@gmail.com` / "Live Test Studios" org from both Supabase Auth and Phasewise DB via admin API script. Stripe subscription left to auto-expire May 7.

#### 2. Landing page credibility + honesty pass
Three categories of fabricated content removed — all were FTC-risk and trust-killers:
- ✅ **3 fake testimonials** — "Principal, Landscape Architect" / "Studio Director" / "Senior Project Manager" quotes were invented. Replaced with honest value statements (Purpose-built for LA firms, See overruns before they happen, One subscription instead of three).
- ✅ **5 fake firm names** in proof bar ("Clearwater Studio, Mesa + Associates, Groundwork LA, Terrain Group, Grove Design") — replaced with market segment labels (Solo practices, Boutique studios, Growing firms, Multi-disciplinary teams).
- ✅ **3 fabricated stats** ("200+ Projects managed", "15% Avg budget savings", "5 hrs saved per PM weekly") — replaced with verifiable facts (7 standard LA phases, 14-day free trial, $99 starting price, $0 at signup).
- ✅ **Removed "QuickBooks sync" + "Custom integrations"** from Studio tier (both landing page AND in-app billing page) — features aren't built. Replaced with honest Studio differentiators (Unlimited users, Unlimited projects, All modules included, Client portal, Dedicated support).
- ✅ **Softened "Setup in 5 minutes"** → "Sign up in 2 minutes" (accurate).
- ✅ **Removed obsolete waitlist form** — Phasewise is fully live now.
- ✅ **Cleaned dead footer links** — Roadmap, Changelog, API, About, Careers, Documentation, Help Center, System Status all removed. Footer now has: Product (Features, Pricing, Signup, Login), Resources (Blog, FAQ, Contact), Legal (Privacy, Terms).
- ✅ **Fixed broken nav "About" link** → points to new FAQ anchor.

#### 3. FAQ section added
New section on landing page answering the top 6 pre-signup questions: Can I cancel? Setup time? Mobile? Data protection? What happens if I cancel? Who is Phasewise for? Accordion-style `<details>` tags, SEO-friendly markup.

#### 4. SEO foundations
- ✅ **Open Graph + Twitter Card tags** — social shares will now render with proper previews.
- ✅ **JSON-LD structured data** — SoftwareApplication schema (with pricing offers), Organization schema, FAQPage schema. Google can show rich snippets in search results.
- ✅ **Expanded keywords + canonical URL**.
- ✅ **robots.txt** — disallows authenticated routes (`/dashboard`, `/projects`, etc.), allows `/` and `/blog/*`.
- ✅ **sitemap.xml** — dynamic, auto-includes all published blog posts.

#### 5. Blog infrastructure at `/blog`
- ✅ **Markdown-based** — Articles live in `app/content/blog/*.md` with gray-matter frontmatter. Fastest possible page loads (static generation at build time), version-controlled, n8n-writeable via GitHub API for future automation.
- ✅ **Dependencies:** `gray-matter` (frontmatter parser), `marked` (markdown→HTML).
- ✅ **Blog index at `/blog`** — post list with date, reading time, description, hover affordances.
- ✅ **Article pages at `/blog/[slug]`** — JSON-LD Article schema, OG + Twitter Card per-article metadata, reading time, tag chips, bottom CTA back to signup.
- ✅ **`.prose-phasewise` CSS class** — branded article typography (serif headings, green accents, styled tables, code blocks, blockquotes).
- ✅ **Static params** — all articles pre-rendered at build time.

#### 6. First 3 pillar SEO articles shipped
Each ~1,000+ words, targeting high-intent LA firm searches:
1. **`/blog/landscape-architect-billing-rates-2026`** — Rule of Thirds, per-role rate tables, regional adjustments, utilization targets. Soft CTA references Phasewise billing defaults.
2. **`/blog/mwelo-water-budget-calculator-guide`** — California MWELO compliance, MAWA + ETWU formulas with worked example, hydrozone plant factors. Soft CTA references Phasewise MWELO calculator.
3. **`/blog/landscape-architecture-project-phases-explained`** — 7 standard phases from Pre-Design through Post-Construction with fee splits and common pitfalls. Soft CTA references Phasewise phase templates.

### Next highest-ROI items (ranked by sales impact)

1. **Submit directory listings** — Copy-paste playbook ready at `directory-listings.md`. Order: AlternativeTo → Capterra → G2. ~15–30 min each. Drives passive referral traffic for years.
2. **n8n SEO content automation** — Build the automated content pipeline. Now that 8 pillar articles prove the structure works, automate article generation + GitHub commit. Uses Kevin's existing n8n Cloud. Fits anonymity + automation + passive income values perfectly. Multi-hour build.
3. **Keep shipping blog articles** — Next wave of target keywords: "landscape architecture time tracking software", "how to price landscape design projects", "landscape architect utilization rate", "landscape architecture firm profit & loss", "punch list process for landscape architects", "irrigation design checklist".
4. **Product Hunt launch prep** — One-time event. Typically 1-5K visitors + 20-100 signups. Needs launch-day assets (gif demo, screenshots, first comment).
5. **Social profiles** — Upload v2 PNG logos to LinkedIn, X/Twitter, GitHub. Claim @phasewise on Instagram.
6. **USPTO trademark filing** — File before significant marketing push.
7. **Cloudflare ops** — getphasewise.com → phasewise.io 301 redirect + remove duplicate google-site-verification TXT.
8. **Vercel Analytics + Plausible** — Add before significant traffic arrives so you can see which articles/directories actually convert.

### Earlier today (2026-04-23 — morning session): Stripe live mode swap

Commits: `e700f19` (cancelAtPeriodEnd fix), prior commits through `883965a` + `a00fcd6`.

- Stripe KYC/activation complete + live mode toggled + products copied from sandbox
- 6 Vercel env vars swapped with Production/Preview-Dev split (live keys on Production, test keys on Preview+Dev)
- Live webhook endpoint created listening to 6 subscription events
- Full E2E test passed with real card: signup → welcome email → $0 trial checkout → trial-started email → DB sync → Customer Portal cancel → cancellation email
- Bug fix: `cancelAtPeriodEnd` now correctly tracks Stripe Customer Portal cancellations (was only reading boolean, missed the `cancel_at` timestamp path)

### Strategic pivot (2026-04-17 EOD)

**Status: All 92 feature items complete. E2E test passed on production. Team invitation flow live. Overhead time tracking live.** Two pre-launch blockers remain: error state testing + 3 beta firms.

### What shipped today (2026-04-17)

Commits: `49d92ce` (photo fix + titles + PWA), `7b15673` (invite flow), `9b9a708` (copy invite link), `085115f` (send invite button), `ad677ef` (invite UX + new titles), `67b3a22` (overhead time).

1. ✅ **Loops env vars confirmed in Vercel** — All 7 template IDs + API key verified present.
2. ✅ **Profile photo upload fix** — Cache-busting timestamp so new photos display immediately. Error handling on DB save PATCH request.
3. ✅ **LA job titles in team management** — 20 titles wired into add-member form with auto-set permission level + billing defaults. Inline title editing on team list. "Role" → "Permission Level" clarity. Custom title option. v2 brand on role assignment section.
4. ✅ **PWA icon fix for Android** — Manifest switched from SVG to PNG icon routes. Added maskable icon with safe-zone padding for adaptive icons.
5. ✅ **E2E test passed** — Full production test: signup → welcome email (1 min) → Stripe checkout ($0 trial) → trial-started email → DB sync verified (PROFESSIONAL/TRIALING/Stripe IDs linked) → Customer Portal → cancellation → cancellation email. All 6 steps green.
6. ✅ **Team invitation flow** — Complete invite system:
   - Owner adds member → Invitation record + `pending_` User created in transaction
   - "Send invite" button for pre-existing members (creates invitation retroactively)
   - "Invite link" / "Copied!" button to copy invite URL to clipboard
   - Instruction banner after sending with copyable URL + clear next-steps text
   - `/invite/[token]` acceptance page (email pre-filled, password + confirm, "Join team")
   - POST creates Supabase auth user via admin API, links `pending_` User, signs in, redirects to dashboard
   - 7-day token expiry, duplicate protection, expired/accepted handling
7. ✅ **Overhead / admin time tracking** — OverheadCategory enum (General Admin, Marketing, Training/PD, Meetings, Business Dev, IT/Equipment). "Add overhead / admin" button on timesheet with warm-toned styling. Non-billable. Copy-from-previous-week support.
8. ✅ **New job titles** — Drafter / Technician ($55k/$95hr) and Irrigation Designer ($72k/$130hr).

**Schema change:** Added `TimeEntry.overheadCategory OverheadCategory?` + `OverheadCategory` enum. Synced to Supabase.

### Known good state

- Production URL: https://phasewise.io
- Latest pushed commit: `67b3a22` (overhead time tracking)
- All env vars set in Vercel (including `SUPABASE_SERVICE_ROLE_KEY`)
- All Supabase Storage buckets + policies live
- Vercel Cron registered and enabled
- Invite flow tested and working on production

### Strategic pivot (2026-04-17 EOD)

After a strategy discussion this session, Kevin confirmed that his top priorities are: **maximum anonymity, maximum automation, maximum passive income**. This conflicts with early-stage SaaS (which requires founder-led sales). **Decision: Phasewise becomes a 2027+ play, not a 2026 revenue driver.** Verifield (already anonymous + automated + passive) becomes the primary 2026 focus. Kevin has moved to the Verifield project file to build out a scaling roadmap there.

**Phasewise disposition for remainder of 2026:**
- Keep production live + polished (it's 92 features done, E2E tested)
- Do **not** swap Stripe to live mode until a specific paying customer is lined up (avoid premature tax/compliance obligations)
- No active sales effort — let organic signups trickle in
- Revisit actively when Verifield has delivered its 2026 revenue goal OR when inbound interest materializes
- Keep hosting running (Vercel Pro trial ends ~2026-04-22 — may need to downgrade to Hobby)

### To resume next session (when Phasewise work resumes)

**Outstanding Phasewise items (low priority until Verifield goal is hit):**

1. **Stripe live mode swap** ✅ COMPLETE (2026-04-23)
2. **SEO content foundation** ✅ COMPLETE — 8 pillar articles live on `/blog` (2026-04-23 + 2026-04-24)
3. **Directory listings playbook** ✅ COMPLETE — ready for submission at `directory-listings.md`
4. **Submit to directories** — Kevin's next action. Open `directory-listings.md`, start with AlternativeTo.
5. **n8n SEO content automation** — Build the content pipeline so new articles ship weekly without manual work.
6. **Product Hunt launch** — One-time event. Needs launch-day assets (gif demo, screenshots, first comment).
7. **Social profiles** — Upload v2 PNG logos to LinkedIn, X/Twitter, GitHub. Claim @phasewise on Instagram.
8. **USPTO trademark filing** — Protect the "Phasewise" name.
9. **Cloudflare ops** — getphasewise.com → phasewise.io 301 redirect + remove duplicate `google-site-verification` TXT.
10. **Analytics** — Add Vercel Analytics + Plausible before significant traffic arrives.
11. **Optional: Loops INVITE template** — Automated invite emails (currently works via link sharing).
12. **Optional: Error state testing** — Failed payments, network errors, validation edge cases.

### Test cards for future testing

| Scenario | Card number |
|----------|------------|
| Successful payment | `4242 4242 4242 4242` |
| Decline | `4000 0000 0000 0002` |
| Requires 3D Secure | `4000 0025 0000 3155` |

### Test user accounts in DB

- `kgallo22+pwtest5@gmail.com` — **primary test account** ("Five Test" / FiveTest Studio, BTTF-themed projects)
- Other `pwtest1-4,6` accounts deleted from Supabase Auth 2026-04-17
- Emmett Brown (`kgallo22+ebrown@gmail.com`) — test invite acceptance, PM role in FiveTest Studio

## TODO (Operational, non-code)

- [x] Google Workspace — domain verified + Gmail active ✅ 2026-04-15
- [x] Create Supabase Storage buckets: `profile-photos` + `compliance-docs` ✅ 2026-04-15
- [x] Set CRON_SECRET in Vercel + configure Vercel Cron for submittal reminders ✅ 2026-04-15
- [x] All Loops env vars set in Vercel ✅ 2026-04-17
- [x] SUPABASE_SERVICE_ROLE_KEY set in Vercel + local ✅ 2026-04-17
- [x] E2E test: signup → checkout → emails → DB sync → cancel ✅ 2026-04-17
- [x] Stripe account activation (KYC + bank + tax category + descriptors) ✅ 2026-04-21
- [x] Stripe switched to live mode + products copied from sandbox ✅ 2026-04-21
- [x] Stripe live mode swap — API keys, webhook, 6 env vars split by env, redeploy ✅ 2026-04-23
- [x] Live-mode E2E test passed with real card ($0 trial) ✅ 2026-04-23
- [x] Landing page honesty pass (remove fake testimonials/firms/stats, false claims, dead links) ✅ 2026-04-23
- [x] FAQ section added to landing page ✅ 2026-04-23
- [x] SEO foundations (OG + Twitter Card + JSON-LD, robots.txt, sitemap.xml) ✅ 2026-04-23
- [x] Blog infrastructure at `/blog` (markdown + static generation) ✅ 2026-04-23
- [x] First 3 pillar SEO articles shipped (billing rates, MWELO, phases) ✅ 2026-04-23
- [x] 5 more pillar SEO articles shipped (Monograph alternatives, fee proposal, CA checklist, profit margin, submittal log) ✅ 2026-04-24
- [x] Directory listing playbook created at `directory-listings.md` ✅ 2026-04-24
- [ ] Submit directory listings (AlternativeTo, Capterra, G2) — playbook ready, just needs Kevin to fill forms
- [ ] Later: more directories (GetApp, Software Advice, SaaSHub)
- [ ] Keep shipping blog articles (next wave: LA time tracking software, pricing landscape design projects, utilization rate, P&L, punch list, irrigation design checklist)
- [ ] n8n SEO content automation (auto-commit new articles via GitHub API)
- [ ] Add Vercel Analytics + Plausible (before significant traffic arrives)
- [ ] Product Hunt launch
- [ ] Upload v2 PNG logos to LinkedIn, X/Twitter, GitHub profiles
- [ ] Claim @phasewise on Instagram
- [ ] File USPTO trademark for "Phasewise"
- [ ] Set up getphasewise.com redirect to phasewise.io in Cloudflare
- [ ] Remove duplicate `google-site-verification` TXT record from Cloudflare
- [ ] Create Loops INVITE template (optional — link sharing works without it)
