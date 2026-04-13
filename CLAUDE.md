# Phasewise

The operating system for landscape architecture firms. Phasewise handles project management, budgets, time tracking, billing, communications, and approvals — so landscape architects can focus on design.

See `POC_SCOPE.md` for the full product spec and roadmap. See `BUSINESS_PLAN.md` for market research, financials, and go-to-market strategy.

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
- [ ] **Loops transactional templates created in dashboard + IDs added to env**
- [ ] **End-to-end test: signup → checkout (Stripe test card) → emails → DB sync**
- [ ] All core features work seamlessly (project CRUD, time tracking, budgets, reports)
- [ ] Project editing (currently only create + view)
- [ ] Profitability reporting dashboard
- [ ] Client management module (contacts, communications)
- [ ] Contact list capture from landing page (waitlist + signup)
- [ ] Onboarding flow (signup → org setup → first project → first time entry)
- [ ] Empty states designed for every page (no users? no projects? handle it gracefully)
- [ ] Error states tested (failed payments, network errors, validation)
- [ ] Privacy Policy + Terms of Service pages
- [ ] Loading states for slow operations
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
- **Mode:** Test mode (sandbox) — all current Vercel env vars are `pk_test_*`/`sk_test_*`
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
| `LOOPS_API_KEY` | ✅ local, ⏳ Vercel | Loops > Settings > API |
| `LOOPS_TEMPLATE_WELCOME` | ⏳ pending | Loops > Transactional > Welcome template ID |
| `LOOPS_TEMPLATE_TRIAL_STARTED` | ⏳ pending | Loops > Transactional > Trial started template ID |
| `LOOPS_TEMPLATE_WELCOME` | ✅ Vercel + local | `cmnsy2ivn01fx0iyrotfy4w2i` |
| `LOOPS_TEMPLATE_TRIAL_STARTED` | ✅ Vercel + local | `cmnt111lb00a20i0d70r302q1` |
| `LOOPS_TEMPLATE_SUBSCRIPTION_CANCELED` | ✅ Vercel + local | `cmnt17tyg00m20iyvwcuxod0r` |
| `LOOPS_TEMPLATE_PAYMENT_FAILED` | ✅ Vercel + local | `cmnt1c1fm0cg60i0dsl64dtfv` |

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

**Operations:**

59. **Replace `/brand` v1 assets with v2 versions** — single source of truth
60. **Stripe Tax: revisit before going live** — placeholder CA registration only
61. **Switch Stripe to live mode** — env var swap only
62. **Social media automation (n8n)** — scheduled posts to LinkedIn/X/Instagram
63. **Google Workspace setup** — kevin@phasewise.io for business email
64. **USPTO trademark filing** — protect the name

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

## Where We Left Off (2026-04-13 EOD)

**Status: All 58 build queue items complete.** The entire feature build queue is done. Only operational items remain (brand asset cleanup, Stripe live mode, social media, Google Workspace, trademark).

### What shipped today (2026-04-13)

**Earlier in the session (before context compaction):**
1. ✅ **Work Plan** — per-phase staff assignments with hours + cost (PhaseStaffPlan model + WorkPlanEditor component)
2. ✅ **Auto-numbering settings UI** — prefix, starting number, toggle in Settings
3. ✅ **Profitability reporting dashboard** — summary cards, color-coded burn/margin, totals footer
4. ✅ **Fixed pricing tagline** — honest "One subscription instead of three"
5. ✅ **Budget alerts** — dashboard health badges + email on 75%/90%/100% threshold
6. ✅ **Admin section** — owner-only sidebar + business ops dashboard
7. ✅ **Submittal & RFI log** — CRUD + status tracking + ball-in-court + overdue
8. ✅ **Custom phase types** — OTHER enum + customName override
9. ✅ **Team Utilization report** — per-person hours, utilization %, revenue, profit
10. ✅ **Plant Schedule Manager** — model + CRUD API + page with approval tracking
11. ✅ **Compliance Tracker** — MWELO/LEED/SITES/ADA/PERMIT + status + due dates
12. ✅ **Client management module** — model + API + card grid page
13. ✅ **Dashboard v2 brand polish** — color-coded health visualization
14. ✅ **Onboarding checklist** — 3-step, auto-dismisses when complete
15. ✅ **Privacy Policy page** + **Terms of Service page**
16. ✅ **Plant Schedule: interactive create form + inline status updates**
17. ✅ **Compliance Tracker: interactive create form + inline status updates**

**Later in the session (after context compaction):**
18. ✅ **Submittal reminders cron** — `/api/cron/submittal-reminders` scans overdue items (last 7 days), sends Loops emails, bearer token auth via CRON_SECRET
19. ✅ **Project detail report** — `/reports/project/[id]` with 6 summary cards, phase breakdown table (budget vs actual + remaining), time by team member table, phase × person matrix. Reports hub updated with project selector. Profitability table rows link to detail reports.
20. ✅ **Empty states** — dashboard projects table + projects list table (icon + CTA)
21. ✅ **Loading skeletons** — 11 `loading.tsx` files: dashboard, projects, reports, reports/profitability, reports/utilization, time, clients, submittals, plants, compliance, settings/team

### Known good state

- Production URL: https://phasewise.io
- Code compiles clean (`npx tsc --noEmit` returns 0 errors)
- Vercel build includes `prisma generate` — no stale-client failures
- **Note:** Changes from this session are NOT yet committed or pushed. Run `git status` to see all new/modified files.

### To resume next session

**All feature work is done.** The build queue (items 1-58) is complete. Next priorities are operational:

1. **Commit and push** all today's work to `main` for Vercel deployment
2. **Set CRON_SECRET env var** in Vercel for the submittal reminders endpoint
3. **Set up Vercel Cron** (or external scheduler) to call `/api/cron/submittal-reminders` daily
4. **Review and test** — Kevin is reviewing all features; address any feedback
5. **Operations:** Replace `/brand` v1 assets, Stripe Tax revisit, Stripe live mode, social media (n8n), Google Workspace, USPTO trademark

### Test cards for future testing

| Scenario | Card number |
|----------|------------|
| Successful payment | `4242 4242 4242 4242` |
| Decline | `4000 0000 0000 0002` |
| Requires 3D Secure | `4000 0025 0000 3155` |

### Test user accounts in DB

- `kgallo22+pwtest1@gmail.com` through `kgallo22+pwtest5@gmail.com` (Gmail aliases routing to your inbox)
- All exist in Supabase Auth + app database
- Can be deleted via Supabase Authentication > Users when no longer needed

## TODO (Operational, non-code)

- [ ] Set up Google Workspace (kevin@phasewise.io) — defer until first paying customer
- [ ] Upload v2 PNG logos to LinkedIn, X/Twitter, GitHub profiles
- [ ] Claim @phasewise on Instagram
- [ ] File USPTO trademark for "Phasewise"
- [ ] Set up getphasewise.com redirect to phasewise.io in Cloudflare
- [ ] Revisit Stripe Tax setup before going live (currently a placeholder CA registration)
