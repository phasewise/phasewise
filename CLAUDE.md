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
| `LOOPS_TEMPLATE_SUBSCRIPTION_CANCELED` | ⏳ pending | Loops > Transactional > Subscription canceled template ID |
| `LOOPS_TEMPLATE_PAYMENT_FAILED` | ⏳ pending | Loops > Transactional > Payment failed template ID |

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
8. **Loops transactional templates + env vars** ⏳ NEXT — pickup point for tomorrow
9. **End-to-end test of signup → checkout → webhooks → emails** ⏳ Right after #8
10. **Waitlist + contact capture on landing page** — Loops contacts API (one form, no auth required)
11. **Replace `/brand` v1 assets with v2 versions** — single source of truth
12. **Project editing** — currently only create + view
13. **Profitability reporting dashboard** — the core value prop demands a real report
14. **Client management module** — contacts, communications, automations
15. **Onboarding flow** — first-run experience after signup
16. **Empty states + loading states** — production polish
17. **Privacy Policy + Terms** — legal pages before launch
18. **Switch Stripe to live mode** — env var swap only
19. **Social media automation (n8n)** — scheduled posts to LinkedIn/X/Instagram
20. **Google Workspace setup** — kevin@phasewise.io for business email
21. **USPTO trademark filing** — protect the name

## Where We Left Off (2026-04-09 EOD)

**Last action:** Pushed commit `e0cde99` adding Loops integration. Vercel is auto-deploying.

**To resume tomorrow:**

1. **Start in Loops dashboard** → Transactional → create 4 templates:
   - Welcome (vars: `firstName`, `firmName`)
   - Trial started (vars: `firstName`, `firmName`, `planName`, `trialEndDate`)
   - Subscription canceled (vars: `firstName`, `firmName`)
   - Payment failed (vars: `firstName`, `firmName`)
2. **Copy each template ID** from the Loops dashboard
3. **Add to Vercel env vars** (and local `app/.env`):
   - `LOOPS_API_KEY` (already in local `.env`, need to add to Vercel)
   - `LOOPS_TEMPLATE_WELCOME`
   - `LOOPS_TEMPLATE_TRIAL_STARTED`
   - `LOOPS_TEMPLATE_SUBSCRIPTION_CANCELED`
   - `LOOPS_TEMPLATE_PAYMENT_FAILED`
4. **Redeploy** from Vercel
5. **Run end-to-end test:**
   - Open phasewise.io in incognito → click Pricing → Professional → "Start Free Trial"
   - Sign up as a new test user (e.g. `test+phasewise1@…`)
   - Should redirect to Stripe Checkout
   - Use test card: `4242 4242 4242 4242`, exp `12/30`, CVC `123`, any zip
   - Should land on `/settings/billing?status=success`
   - Verify welcome email arrives at signup time, trial-started email arrives after checkout
   - Check `/settings/billing` shows "Trial active" badge with end date
   - Click "Manage subscription" → confirm Customer Portal opens
   - Test cancellation → confirm "Subscription canceled" email arrives

**Test card reference:**
| Scenario | Card number |
|----------|------------|
| Successful payment | `4242 4242 4242 4242` |
| Decline | `4000 0000 0000 0002` |
| Requires 3D Secure | `4000 0025 0000 3155` |

**Known good state at end of day:**
- Production URL: https://phasewise.io
- Latest commit: `e0cde99` (Loops integration)
- All Stripe sandbox products live, webhook listening, billing page renders
- Code compiles clean (`npx tsc --noEmit` returns 0 errors)

## TODO (Operational, non-code)

- [ ] Create 4 Loops transactional templates (next session priority)
- [ ] Add Loops env vars to Vercel (next session priority)
- [ ] Set up Google Workspace (kevin@phasewise.io) — defer until first paying customer
- [ ] Upload v2 PNG logos to LinkedIn, X/Twitter, GitHub profiles
- [ ] Claim @phasewise on Instagram
- [ ] File USPTO trademark for "Phasewise"
- [ ] Set up getphasewise.com redirect to phasewise.io in Cloudflare
