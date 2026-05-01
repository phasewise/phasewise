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
| `LOOPS_TEMPLATE_INVITE` | ✅ | `cmonelbq000qv0izk52er5uom` (created 2026-05-01) |
| `LOOPS_TEMPLATE_INVOICE_SEND` | ✅ | `cmond6ahz02pu0i107sqfg8cz` (created 2026-05-01) |

**Brand sender update — 2026-05-01:** all transactional templates migrated from `kgallo22@mail.phasewise.io` (personal-feeling) to `hello@mail.phasewise.io` (brand-aligned, matches Workspace alias). Reply-To changed from `kgallo22@gmail.com` to `hello@phasewise.io`. Maintains anonymity-of-brand for invoice + invite recipients. Loops has no global default-sender setting; each template was edited individually. Templates updated: Welcome, Trial Started (branded), Subscription Canceled (branded), Payment Failed (branded), Submittal Reminder (branded), Budget Alert (branded), Invite, Invoice Send.

**Anonymity TODO flagged 2026-05-01:** Loops Settings → Domain → Company Address shows residential address. CAN-SPAM injects this into transactional email footers. Should swap for a PO Box (~$60-100/yr at USPS) or virtual mailbox (~$15-30/mo at iPostal1, Earth Class Mail, etc.) before scaling outreach.
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
93. ~~**Project relocation: OneDrive → C:\dev\phasewise**~~ ✅ 2026-04-30 — robocopy 52,552 files / 939MB / 0 failures, memory key migrated to `c--dev-phasewise`.
94. ~~**Pre-existing slug conflict fix**~~ ✅ 2026-04-30 — `/api/projects/[projectId]` consolidated under `[id]` so Next.js 16 Turbopack dev server starts cleanly.
95. ~~**MWELO render-back loop**~~ ✅ 2026-04-30 — Compliance row chips (MAWA/ETWU/pass-fail), `?itemId=` calc reload, branded `@react-pdf/renderer` PDF route `/api/compliance/:id/mwelo-pdf`, project detail Compliance section with summary chips.
96. ~~**Compliance UX overhaul**~~ ✅ 2026-04-30 — MWELO row click → calculator (skips upload modal), Add-Item with MWELO category routes to calculator, per-row Archive + Delete actions, "Show archived" toggle, project page edit-in-place modal for non-MWELO items.
97. ~~**Work Plan save UX clarity**~~ ✅ 2026-04-30 — Save Work Plan buttons per-phase + at bottom; amber dirty banner; gated "Save all changes" with confirm dialog if work-plan dirty.
98. ~~**Projects list: search + filter + status grouping + status dropdown**~~ ✅ 2026-04-30 — Search by name/number/client/city/type; status + type filters; inline status dropdown per row; 4 collapsible status sections (Active/On Hold/Completed/Archived) in hierarchy order; new schema fields `Project.city` + `Project.projectType`.
99. ~~**Dashboard projects grouped by status**~~ ✅ 2026-04-30 — Same 4-section hierarchy as Projects list using native `<details>`; Active/On Hold open by default.
100. ~~**Timesheet reopen flow**~~ ✅ 2026-04-30 — `/api/timesheets` action `reopen` resets SUBMITTED/APPROVED → DRAFT. Owners recall their own SUBMITTED; approvers (OWNER/ADMIN/SUPERVISOR) can reopen any APPROVED week. UI: "Recall submission" + "Reopen for editing" buttons.
101. ~~**Future-week timesheet editable, submit-gated**~~ ✅ 2026-04-30 — Future-week cells now editable so users can pre-fill upcoming PTO/travel. Submit button is gated until current week is submitted; server enforces same rule on `/api/timesheets` submit.
102. ~~**Invoice overhaul (auto-#, period, timesheet pull, paid flow, status grouping)**~~ ✅ 2026-04-30 — Org-level invoice numbering (counter + prefix). New `Invoice.periodStart/periodEnd/paymentReference/paymentMethod/sentAt`. New `TimeEntry.invoiceId/invoicedAt` to prevent double-billing. New endpoints: `/api/invoices/next-number`, `/api/invoices/timesheet-preview`. PDF: "For Professional Services completed from X to Y" + phase summary. UI: auto-fill invoice #, "Pull from timesheets" button, Mark sent / Mark paid quick actions, payment method/reference fields, 6-section status grouping (Overdue → Sent → Partially paid → Draft → Paid → Voided).
103. ~~**Monthly auto-invoicing cron + project billing visibility**~~ ✅ 2026-04-30 — `/api/cron/monthly-invoicing` fires `0 14 5 * *` on every non-archived project. Strict calendar month, skip-zero-hours, `BillingEvent.SKIPPED_NO_HOURS` recorded for visibility. New `lib/invoice-builder.ts` shared helper. Project detail Billing section (OWNER/ADMIN/PM only) shows chronological invoices + skipped months.

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

- **Invoice feature redesign** (proposed 2026-04-30) — current admin/billing invoice page is too thin. Spec from Kevin:
  - Auto-populate line items from **approved** timesheet entries on the invoiced project (per-person, per-phase rollups, billable only).
  - Surface a warning if the project has **un-approved** time entries in the invoice period — owner reviews + approves before invoicing so no billable hours are missed.
  - Invoice "database" view — sortable list of every invoice firm-wide.
  - Searchable + filterable by project, client, status (Draft / Sent / Paid / Overdue), date range.
  - Clear paid / unpaid + sent / unsent toggles. Track: date sent, date payment received, check or payment reference number.
  - Auto-numbered sequentially (PW-INV-0001 style — same pattern as project numbering, org-level prefix + counter, configurable in settings).
  - One-click branded PDF generation (already have `@react-pdf/renderer` for invoices — extend with full letterhead, line items, totals, payment terms).
  - Owner / admin verification step before any send action.
  - "Send Invoice to Client" button → either (a) automated send via Loops with PDF attached, or (b) opens user's default mail client (`mailto:` with PDF attachment, `to` from project's linked Client, subject pre-filled with project name + invoice number, body pre-filled with payment instructions). Decision pending — automated send is more polished but mailto: is faster to ship and lets users keep email replies in their own thread.
  - Significant work — schedule after current MWELO render-back ships and outreach reply playbook is in place.
- **Dashboard v3** — add "This week's hours", "Pending approvals", "Upcoming deadlines", "Invoices outstanding" tiles.
- **Timesheet CSV export** — per-user or per-project, for accountants and invoicing backup.
- **Project search / filter** — flat list breaks at ~20 projects.
- **Client portal / shared read-only link** — send clients a URL that shows project health, current phase, outstanding submittals, invoice status. Big differentiator — no competitor does this well for LA firms.
- **Plant library redesign** — current flat list is low-value. Turn it into a reusable firm library that auto-populates MWELO hydrozones and links to submittals. Irrigation section a candidate companion.
- **Leave request/approval workflow** — employee requests → manager approves → auto-adds to timesheet. Currently leave is entered directly; this adds a real approval step like vacation requests in most HRIS systems.
- **Pro-rata leave accrual** — accrues per pay period instead of annual front-loading. For firms that prefer it.
- **Automated year-end rollover** — apply the `rolloverCap` automatically when the calendar year changes.
- **Forensic audit** — top-to-bottom value review once the queue slows down. Rate each feature on value delivered vs maintenance cost. Cut or sharpen anything that doesn't earn its keep.

## Where We Left Off (2026-04-30)

**Status: 🟢 BIG PRODUCT DAY — 11 commits, ~5,500 LOC across compliance, projects, timesheets, and the entire invoicing stack.** Project relocated off OneDrive to `C:\dev\phasewise` to stop sync churn. Memory key migrated to `c--dev-phasewise`. Strategic-pivot memory updated to reflect that Phasewise is back in active build + sales mode (the 2026-04-17 pivot was reversed by 2026-04-23).

### What shipped today (commits in order)

1. `ee07dca` — **Feature 4: MWELO render-back + PDF + project surface.** Compliance row chips (MAWA/ETWU/pass-fail) + "View calc" + "PDF" links. Calculator reads `?itemId=` and pre-loads the saved JSON. Branded server-side PDF (`@react-pdf/renderer`, phase-bars logomark, formula reference). Project detail page now has a Compliance section with the same summary chips inline.
2. `20adb18` — **Pre-existing slug fix.** `/api/projects/[projectId]` consolidated under `[id]` so Next.js 16 Turbopack dev server starts. Production build had been tolerating the conflict silently.
3. `2a404fb` — **Feature 5: Compliance UX + Work Plan UX + Projects search/filter.** MWELO row → calculator routing, Add-Item MWELO callout, per-row Archive + Delete + show-archived toggle. Project compliance edit-in-place. Save Work Plan buttons per phase + bottom + amber dirty banner + gated Save-all-changes confirm dialog. Projects list search box (name/number/client/city/type), status + type filters, inline status dropdown per row. Schema: `Project.city` + `Project.projectType`. Compliance: `archivedAt`.
4. `252099b` — **Timesheet reopen flow.** SUBMITTED → "Recall submission". APPROVED → "Reopen for editing" (approver-only, with confirm). Server-side `reopen` action on `/api/timesheets`.
5. `1e4648a` — **Status-grouped projects.** 4 collapsible sections (Active → On Hold → Completed → Archived) on both the Projects list and the Dashboard. Hierarchy matches Kevin's preferred order. Sections with zero matches are hidden.
6. `680af53` — **Future-week timesheet: editable, submit-gated.** Cells stay editable so users can pre-fill upcoming PTO/travel; Submit button + server-side submit are gated until the current week is in.
7. `3732202` — **Feature 6: Invoice overhaul.** Org-level auto-numbering (`INV-001`-style, same pattern as projects). `Invoice.periodStart/periodEnd/paymentReference/paymentMethod/sentAt`. `TimeEntry.invoiceId/invoicedAt` (prevents double-billing). New endpoints `/api/invoices/next-number` and `/api/invoices/timesheet-preview` (groups approved billable un-invoiced hours by phase + person). PDF: "For Professional Services completed from X to Y" statement + "Services include: Schematic Design, Construction Documents." sentence derived from time-entry phases. UI: auto-fill invoice #, "Pull from timesheets" button, Mark sent / Mark paid quick actions, payment-method datalist + reference field, 6-section status grouping (Overdue → Sent → Partially paid → Draft → Paid → Voided).
8. `b867a18` — **Feature 7: Monthly auto-invoicing cron + project billing visibility.** `/api/cron/monthly-invoicing` fires `0 14 5 * *` on every non-archived project. Strict calendar month (1st – last day of last month). Skip-zero-hours recorded as `BillingEvent.SKIPPED_NO_HOURS` so the trail is visible. Idempotent (re-fires safe). `lib/invoice-builder.ts` shared helper. Project detail Billing section (OWNER/ADMIN/PM only) shows chronological invoices + "Skipped <Month>" entries.

### Schema deltas (`db push` already applied)

- `Project`: `city String?` + `projectType String?` (free text, datalist suggestions on forms)
- `ComplianceItem`: `archivedAt DateTime?` (soft archive)
- `Organization`: `invoiceNumberPrefix String @default("INV")` + `invoiceNumberNext Int` + `autoNumberInvoices Boolean`
- `Invoice`: `periodStart`, `periodEnd`, `paymentReference`, `paymentMethod`, `sentAt`
- `TimeEntry`: `invoiceId String?` + `invoicedAt DateTime?` (back-relation to Invoice)
- New `BillingEvent` table + `BillingEventKind` enum (currently just `SKIPPED_NO_HOURS`); `@@unique([projectId, periodStart, kind])` for cron idempotency

### Memory updated

- `strategic_pivot_2026_04_17.md` — now records both the 2026-04-17 pivot AND the 2026-04-23 reversal; current short-term goal (3 trial signups by 2026-05-27) and long-term goal ($83K MRR / 18-24 months) captured
- `project_status.md` — refreshed to current infra state (Stripe LIVE, Loops 7 templates, Search Console, n8n autonomous content, all post-pivot reality)

### EOD update — Tier 0 risk-mitigation kicked off

Strategy reframe after the dashboard crash: paused on scaling outreach until the product is hardened against real-user use. Started a "Tier 0" risk-mitigation pass to catch problems before paying customers do.

**Tier 0 #1 — Sentry error monitoring: ✅ DONE.** Two more commits:
- `7b1be37` — dashboard server-error fix (onClick on Link inside `<summary>` in a server component — exactly the failure mode Tier 0 is meant to catch)
- `3090aae` — Sentry Next.js SDK via official wizard. Server + edge + client configs, instrumentation.ts, global-error.tsx, /sentry-example-page test route, .mcp.json for AI-tool Sentry queries
- `170dfa9` — Sentry noise filters (denyUrls for browser extensions + ignoreErrors for ChunkLoadError + ResizeObserver loop quirks)

Sentry setup details:
- Account: kevin@phasewise.io / Phasewise org / project `javascript-nextjs`
- Vercel integration installed → auto-syncs `SENTRY_AUTH_TOKEN`, `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_ORG`, `SENTRY_PROJECT` + log-drain URLs to Vercel env vars
- GitHub source code integration linked to `phasewise/phasewise` repo (only-this-repo permissions, not all-org)
- Sentry inbound filters enabled in the dashboard: browser extensions, web crawlers, ChunkLoadError, hydration errors, health checks
- Tunnel route `/monitoring` added to middleware allowlist (otherwise public-page errors 307 to /login)
- `sendDefaultPii: false` on all configs — opt-in to user context per-event via `Sentry.setUser({id})` rather than vacuuming everything (B2B billing tool, lots of sensitive data on screens)
- Verified working end-to-end: backend + frontend test errors captured with readable stack traces + source maps + git release tracking

Day-one Sentry catch: 5 events of `SyntaxError: Unexpected token '<'` on /login from HeadlessChrome bots running browser extensions. Filtered as noise — not a real bug.

**Tier 0 #2 — End-to-end smoke test: in progress (steps 1-6/17 done as of EOD).** Fresh test account `kevin@gallodesigns.com` / "Gallo Designs" org. Verified working so far: signup, dashboard render with empty state + onboarding checklist, new project create with city + type fields, project detail page with empty Compliance + Billing sections, edit project flow, Work Plan save. Pickup at step 7 (timesheet entry → submit → recall → approve → reopen) tomorrow.

### Tomorrow's first task

**Continue smoke test from step 7** (the timesheet-flow steps): log time, submit, recall, approve, reopen. Then steps 8-17 covering invoicing + MWELO + projects search/filter.

After smoke test wraps and any bugs are fixed:
- **Tier 0 #3** — in-app "report a problem" widget
- **Tier 0 #4** — manual `curl` test of monthly-invoicing cron + submittal-reminder cron with `CRON_SECRET` to verify they don't crash on first real fire
- **Tier 0 #5** — mobile timesheet entry test on iOS

After Tier 0 is fully done, then back to the Sales tier (outreach replies, directory submissions, Vercel Analytics).

See **"Where We Left Off (2026-04-29)"** below for outreach context and the broader sales motion.

---

## Where We Left Off (2026-04-29)

**Status: 🟢 OUTREACH SENT + 3 PRODUCT FEATURES SHIPPED + G2 LISTING SUBMITTED.** Today was a heads-down execution day across three fronts: cold-email outreach actually went out, three meaningful product features shipped, and the G2 Digital Markets listing was submitted (will propagate to Capterra + Software Advice + GetApp on approval).

### Outreach — first cold emails sent

- **Deliverability test passed** — DMARC propagation confirmed. Test send from `Phasewise Team <hello@phasewise.io>` landed in Gmail Primary.
- **Broussard Associates** (Clovis) — sent.
- **Atlas Lab** (Sacramento) — sent to `kimberly@atlaslab.com` (Hunter.io lookup).
- Follow-up #1 due 2026-05-06 for both. Tracking in `OUTREACH-DRAFTS.private.md`.
- Remaining Tier-A drafts (attention2, designlab 252, Mantle) staggered for next week.

### Product features shipped today

Schema changes (db push'd to Supabase):
- `Project.clientId` FK → `Client` (with `onDelete: SetNull`)
- `Client.projects Project[]` back-relation
- `ComplianceItem.mweloCalculation Json?`

Feature 1 — **Team member edit modal**: Extended `PATCH /api/team/members` to accept phone, role, billingRate, salary. New full-feature edit modal in `TeamMembersClient.tsx` (replaces inline title-edit). Validates role transitions (can't demote sole OWNER). Auto-recomputes hourly cost from salary. Brand-styled to match Compliance/Plant edit modals.

Feature 2 — **Auto-link Client to projects**: Project create + edit now upsert a `Client` row (case-insensitive name match within org) and store `clientId`. Existing project clients backfill on next edit. Closes the data leak bug Kevin spotted in screenshots — deleting a Client row no longer leaves orphan denormalized strings on projects.

Feature 3 — **MWELO ↔ Compliance integration**: Standalone `/tools/mwelo-calculator` now has a "Save to project" button that picks an active project (via new `GET /api/projects` lightweight list endpoint) and creates a `ComplianceItem` (category=MWELO) with the full calculation stored as JSON. Inputs (project name, region, ETo, SLA, hydrozones) + outputs (totalLandscapeArea, MAWA, ETWU, pass/fail, complianceRatio, per-hydrozone results) all persisted under `mweloCalculation`.

Polish:
- **MWELO bug fix**: Number inputs (SLA + hydrozone area) weren't accepting keystrokes. Switched from `type="number"` to `type="text" inputMode="numeric" pattern="[0-9]*"` with onChange digit-filter. Cross-browser fix — `type=number` has known quirks in Safari/Firefox.
- **MWELO print/PDF**: Added branded letterhead (phase-bars logomark + wordmark) + project info row + footer. `@page letter portrait, 0.6in margins`. `body * { visibility: hidden }` + `.print-report * { visibility: visible }` to isolate just the report. Color-preserving via `print-color-adjust: exact`.

### G2 Digital Markets listing — submitted

Submitted Phasewise to the unified G2 vendor portal (covers **Capterra + Software Advice + GetApp** in one submission). Status: Under review, 1-2 business days for approval.

Listing details:
- Category: Project Management
- Industry: Architecture & Planning
- Target market: "Landscape architecture firms, from solo practices to multi-disciplinary studios."
- Company size: 1 / 2-10 / 11-50 / 51-200 (uncapped 200+ to avoid enterprise lead pollution)
- Pricing: $99 / $199 / $349 USD with 14-day free trial (credit card required — accurate to Stripe Checkout flow)
- Open API: No
- Integrations: None (honest — no Slack/Teams/Zapier/QuickBooks/etc. wired)
- Features (18 of 50, all defensible): Milestone Tracking, Time & Expense Tracking, Project Planning/Scheduling, Workflow Management, Task Management, Budget Management, Document Management, Reporting/Project Tracking, Multiple Projects, Resource Management, Alerts/Notifications, Access Controls/Permissions, Customizable Templates, User Management, Key Performance Indicators, Billing & Invoicing, Commenting/Notes, Traditional Methodologies
- 5 screenshots: dashboard, project detail, MWELO calculator, profitability report, submittals log (saved at `brand_v2/exports/screenshots/`)

Honesty pass applied throughout submission — explicitly **un**checked: Client Portal, Third-Party Integrations, API, Mobile App, Activity Dashboard, Gantt, Kanban, Risk Management, AI Copilot, Generative AI, Predictive Analytics, Remote Support. Better to be the obvious leader for 1-50 person LA firms than the worst option for enterprise.

### Tomorrow's task

**Compliance ↔ MWELO render-back**: Today's Feature 3 stores `ComplianceItem.mweloCalculation` as JSON, but the compliance list page doesn't surface it. Tomorrow:
- Compliance row with stored calculation should show a summary chip (MAWA/ETWU/pass-fail) inline
- Click "View calculation" → opens `/tools/mwelo-calculator?itemId=xxx` pre-loaded with stored inputs (read-only or re-editable)
- "Print this report" action on the loaded calc → triggers existing branded letterhead PDF
- File the PDF with the compliance item (Supabase Storage, `compliance-docs` bucket, signed URL on render)

This closes the loop Kevin identified: "When the calculation is finished and connected to a project it should file the pdf with the item created, and be accessable in the project section for that specific project."

### Outstanding follow-ups

- **Friday 2026-05-01**: AlternativeTo submission (account age unblocks — they have a 7-day rule)
- **2026-05-06**: Follow-up #1 due for Broussard + Atlas Lab cold emails
- **G2 listing approval check**: 2026-04-30 or 2026-05-01 (notification by email)
- **n8n auto-article check**: Friday 2026-05-01 morning — third autonomous article should ship at 7am UTC

---

## Where We Left Off (2026-04-28)

**Status: 🟢 GROWTH MACHINE READY TO TURN ON — pending one Monday-morning deliverability test.** Pivoted from product-hardening (yesterday's audit cleanup) to customer-acquisition infrastructure. Spent today wiring analytics, social presence, email infrastructure, prospect research, and outreach drafts. Caught two rounds of marketing-copy honesty problems and ran comprehensive audits to fix them. Anonymous brand voice is now the canonical position across all public copy.

### Major decisions made today

- **Anonymous brand voice** is the canonical position. All public marketing copy, social bios, social posts, and outreach disclosures reference "Phasewise" / "the Phasewise team" / "landscape architects" — never the founder name and never Caltrans. The disclosure script in OUTREACH-DRAFTS for "who's behind this" gives credibility without naming founder or employer.
- **LinkedIn deferred 1-2 weeks.** Personal account couldn't create the company page (Workspace's "not enough connections" anti-spam gate). Solution: add 5-10 LinkedIn connections naturally as outreach replies come in, then create the page.
- **Instagram skipped for v1.** SMS verification was failing. LinkedIn + X cover ~95% of B2B SaaS conversion anyway. Revisit after first paying customer.
- **Plausible is opt-in.** Set `NEXT_PUBLIC_PLAUSIBLE_DOMAIN=phasewise.io` in Vercel + sign up at plausible.io ($9/mo) to activate. Vercel Analytics ships unconditionally — gives page views, top pages, top referrers for free up to 2.5k events/mo.

### What shipped today

Commits in chronological order:

1. `70d13d2` — Vercel Analytics + opt-in Plausible wired into root layout
2. `18a4a8e` — Social links in landing footer + branded `opengraph-image.tsx` (1200×630 PNG generated at build time via next/og)
3. `5f16de4` — `SOCIAL-SETUP-KIT.md` (handoff doc: bios, post templates, profile specs for LinkedIn/X/Instagram/GitHub)
4. `0535b87` — `automation/n8n-social-posting-extension.md` (drop-in patch for n8n to auto-post each new article to LinkedIn + X + Instagram once social credentials are wired)
5. `fd25c9e` — `OUTREACH-PLAYBOOK.md` rewrite as anonymous brand-led (no warm-intro Caltrans templates) + Tier A/B/C targeting based on firm-fit only
6. `de70699` — `.gitignore` at repo root keeping `PROSPECTS.md`, `*.private.md`, and `private/` out of the public repo
7. `04c363e` — Middleware regression fix: `/opengraph-image` and `/twitter-image` routes were 307-redirecting to `/login` (same bug class as the 2026-04-26 manifest/blog regression)
8. `81aabf4` — QuickBooks honesty pass (round 1): Phasewise replaces the project-management slice but does NOT replace QuickBooks. Rewrote 11 lines across 4 files.
9. `9963fc5` — Comprehensive honesty pass (round 2 — the bigger one): 13 issues fixed across 10 files. Breakdown below.

### Email infrastructure (set up today)

- **`hello@phasewise.io` alias** created on Workspace (free; admin-only Profile photo edit policy worked around)
- **Gmail "Send mail as"** wired with display name `Phasewise Team`. Made `hello@` the default for new emails.
- **Gmail profile picture** uploaded (Phasewise logomark on `#1A2E22`) — recipients see brand mark next to "Phasewise Team" in their inbox preview.
- **DMARC record fixed** in Cloudflare DNS at `_dmarc.phasewise.io` → `v=DMARC1; p=none; rua=mailto:kevin@phasewise.io`. The 2026-04-15 Loops setup added DMARC for the `mail.phasewise.io` subdomain only; the apex was missing it. Without DMARC the test send hit spam in Gmail. After fix: DMARC propagation confirmed, ready to re-test.
- **Pre-flight checklist** in `OUTREACH-DRAFTS.private.md` now covers: Gmail Send-mail-as, Hunter.io account, signature stripping, plain-text mode.

### Outreach prep (state at EOD)

- **22 firms researched** in `PROSPECTS.md` (gitignored): 4 user-named + 18 new candidates from agent-driven research across SF Bay, Sacramento, Central Valley, San Diego, LA. Tiered A/B/C by firm-fit.
- **Top 5 picked**: Broussard Associates (Clovis), designlab 252 (Fresno), attention2 (San Diego), Atlas Lab (Sacramento), Mantle (Berkeley). 4 of 5 unblocked — verified `info@` or `studio@` addresses published on each firm's contact page; MX records all clean. Only attention2 needs Hunter.io.
- **5 personalized cold-email drafts** ready in `OUTREACH-DRAFTS.private.md`. Each draft has: pre-flight checklist, exact subject + body ready to paste, anonymity disclosure script for designlab 252 (highest-risk firm given Caltrans overlap), staggered Mon-Thu send order with reasoning.
- **Honest replacement framing** consistently applied: "Replaces Monograph + Harvest + spreadsheets — sits alongside your QuickBooks for accounting." NOT "replaces QuickBooks."

### X (Twitter) launch — fully branded

- @phasewise account fully branded: profile picture (Phasewise logomark), header (1500×500 brand cover), bio (160 char), location (California USA), website (phasewise.io)
- Switched to **Professional account** (Software & Apps category, Brand type)
- **Pinned tweet** posted: "Built by a landscape architect, for landscape architects. Phasewise: phases · budgets · time · submittals · MWELO · profit. One subscription instead of three. 14-day free trial → phasewise.io"
- Branded OG card now renders correctly in link previews (after middleware fix)
- X is on a "new account trust gate" — reach is throttled until Gmail-like algorithm builds confidence (typically 7-10 days of organic activity). Wait on n8n auto-posting until then to avoid tripping spam detection.

### Honesty pass round 2 — what was caught

The audit agent went through every public marketing surface against ground-truth (CLAUDE.md feature list, integration list, founder identity). Caught:

🔴 **Critical (un-built features being claimed):**
- "Client portal" listed as Pro/Studio feature in landing page, JSON-LD schema, in-app billing page, directory listings, AND social bio. **Not built.** Replaced with "Advanced reporting" (which IS built).
- Plant Schedule "Export directly to CAD-compatible format." **No CAD export wired.** Replaced with "Export plant lists for contractor submittals."
- "After two decades running an LA firm" pillar-article opener. **Founder is at Caltrans, has not run a firm.** Reframed.

🔴 **Auto-generation guard rail (highest leverage single change):**
The n8n weekly content prompt had no factual constraints. Could ship false customer counts, fake testimonials, made-up integrations, fabricated compliance every Friday. Added explicit non-negotiable section to `automation/article-generation-prompt.md` prohibiting:
- Fabricated customer counts or scale claims
- Integrations Phasewise doesn't have (QuickBooks, Xero, AutoCAD, Land F/X, SketchUp, Bluebeam, DocuSign, Slack, Teams)
- Features that don't exist (AI, real-time collaboration, client portal, native mobile app, SSO, SOC2/HIPAA/GDPR)
- Exact competitor pricing (use ranges)
- Founder-name attribution

🟠 **Anonymous brand voice (founder explicitly chose this):**
- LinkedIn first post: "I'm a Senior Landscape Architect at Caltrans" → brand-led rewrite
- Instagram first post: "Built by a Senior LA at Caltrans (yes, really)" → "Built by landscape architects, for landscape architects"
- Bio long-form: dropped Caltrans
- Disclosure script for "who's behind this": no founder name, no Caltrans

🟠 **Soft / accuracy fixes:**
- FAQ "cancel with one click" → "via Stripe customer portal" (multi-step actually)
- FAQ "daily backups + nothing leaks" → realistic statement (backups are Supabase tier-dependent; isolation is application-layer not RLS)
- Monograph "$45/user/mo" → "$50–200 per user per month range; verify"
- "$11B industry" → "Several thousand LA firms (NAICS 541320)" (IBISWorld actuals are closer to $5-7B; the $11B figure was unsourced)
- JSON-LD logo URL `/icon-512` (404) → `/icon1` (the actual 192px PNG)
- JSON-LD `sameAs` added X + Instagram URLs
- "Caltrans D-11 HQ" specific reference in attention2 cold email → "mix of public-sector and institutional work" (anonymity tell)

### Tomorrow's first task

**Run the deliverability re-test.** DMARC is now propagated. Send the Broussard draft from `Phasewise Team <hello@phasewise.io>` to `kgallo22@gmail.com` and confirm it lands in Primary (not Promotions, not Spam). If Primary → ship Broussard for real Monday morning. If Promotions → acceptable, ship anyway. If Spam → deeper deliverability investigation needed (sender warm-up sequence, possibly external sending service like Postmark).

After deliverability is confirmed, the actual outreach play is:
- Mon morning: Send Broussard cold email
- Tue morning: Send Atlas Lab
- Wed morning: Send attention2 (after Hunter.io lookup) OR substitute another Tier-A
- Thu morning: Send designlab 252 (highest-risk firm — handle anonymity disclosure carefully if reply asks "who's behind this")
- Next Mon: Send Mantle
- 5 business days after each: send follow-up #1
- 10 business days after follow-up #1: send breakup email

Goal: 3 trial signups by end of week 4.

### Outstanding from today (low-priority follow-ups)

- LinkedIn page creation (need 5-10 personal connections first)
- Instagram account claim (when SMS verification cooperates)
- Hunter.io account creation (free 50 lookups/mo) — needed for attention2 + future prospects
- Plausible signup (optional — Vercel Analytics is sufficient for now)
- Wait 7-10 days on X account warmup before wiring n8n social-posting extension

---

## Where We Left Off (2026-04-27)

**Status: 🟢 ALL 25 AUDIT ITEMS CLEARED — 3 Critical + 7 High + 15 Medium.** The full AUDIT-2026-04-26.md punch list is now in `git log`. Production build clean. TypeScript strict passes. Compliance bucket is now private. Every form input has an associated label. Stripe webhook is idempotent. Time entries can no longer be logged to projects the user isn't assigned to. STAFF/PM no longer see senior billing rates on projects they're not on. Profitability report uses actual per-person rates instead of averages.

Schema additions (prisma db push'd to Supabase):
- `ProcessedStripeEvent` — webhook idempotency
- `BudgetAlert` — replaces description-marker dedup hack
- `ComplianceStatus` + `PlantApprovalStatus` enums (replaced strings)

Infra changes:
- `compliance-docs` bucket flipped to private; signed URLs minted on render (1h TTL)
- New `/api/user/password-changed` route fires Loops email after password reset (needs `LOOPS_TEMPLATE_PASSWORD_CHANGED` env var to actually send)
- `/api/invitations/*` and `/api/waitlist` now rate-limited (5–20/min/IP, in-memory)
- proxy.ts now rejects cross-origin mutations on `/api/*` (CSRF defense-in-depth)
- `/privacy` and `/terms` moved out of `(app)/` route group → publicly accessible

Pending env vars (optional — code degrades gracefully when missing):
- `LOOPS_TEMPLATE_PASSWORD_CHANGED` — confirmation email after password reset
- `LOOPS_TEMPLATE_INVITE` — automated invite email (already optional pre-audit)

Skipped from audit (and why):
- Med #20 was already enforced server-side at `src/app/api/time/route.ts:100-122` before the audit; no code change needed.
- Audit recommendation to use ProjectAssignment as the sole signal for High #4/#9 was relaxed: we accept ProjectAssignment OR PhaseStaffPlan, and bypass for OWNER/ADMIN/SUPERVISOR (audit said only OWNER/ADMIN). PMs and SUPERVISORS need org-wide oversight in real LA firms.
- Med #11 rate limiter is in-memory per Vercel function instance, not global. Sufficient for beta; swap in `@upstash/ratelimit` if a determined attacker spreads load across instances.

Recommended next session focus:
1. Verify the Loops email templates render correctly for the new password-changed flow (create the template, set env var).
2. Watch Search Console — top 3 priority articles should be indexed by 2026-04-28 / 04-29.
3. Submit AlternativeTo / Capterra / G2 listings (copy-paste content ready in `directory-listings.md`).
4. Add Vercel Analytics + Plausible before traffic accumulates from the autonomous content pipeline.

---

## Earlier session (2026-04-26 EOD)

**Status: 🚨 CRITICAL MIDDLEWARE BUG FIXED + GOOGLE SEARCH CONSOLE LIVE + COMPREHENSIVE AUDIT COMPLETE.** Three big things:
1. Discovered + fixed a catastrophic middleware bug blocking Googlebot from indexing all 11 SEO articles AND blocking Android from fetching the PWA manifest (same root cause).
2. Set up Google Search Console for phasewise.io, submitted sitemap (15 URLs discovered), requested priority indexing for top 3 commercial-intent articles.
3. Ran a triple-agent comprehensive audit + hands-on verification. **25 verified findings** documented at [`AUDIT-2026-04-26.md`](AUDIT-2026-04-26.md).

The autonomous n8n SEO content pipeline is now fully connected to Google's crawler. The growth machine is working. Audit found hardening tasks but no data-loss bugs or P0 security holes.

### Comprehensive audit summary (2026-04-26)

Full report: [`AUDIT-2026-04-26.md`](AUDIT-2026-04-26.md)

**🚨 Critical (3) — fix this week:**
1. `/privacy` and `/terms` pages return 307 to unauthenticated users (same bug pattern as today's middleware fix — they live inside `(app)/` whose layout redirects to /login). GDPR/CCPA compliance issue + breaks landing page footer links. Fix: move out of `(app)/` to public route.
2. Deactivated users (`isActive: false`) still have full app access until session expires. `getCurrentUser()` doesn't check `isActive`. Fix: add the check, return null if deactivated.
3. Form inputs not associated with labels (`htmlFor` / `id` missing). WCAG 2.1 Level A fail across ~12-15 forms. ~2hr fix.

**🟠 High (7) — fix next sprint:**
4. Time entries can be logged to projects user isn't assigned to (no `ProjectAssignment` check)
5. Stripe webhook lacks idempotency (`event.id` dedup) — duplicate emails possible on Stripe retry
6. Budget alert state stored in `Project.description` field (code itself flags as MVP). Need `BudgetAlert` table.
7. Billing page doesn't handle PAST_DUE / INCOMPLETE / CANCELED Stripe states — silent revenue loss
8. No pagination on list endpoints (compliance, invoices, submittals) — will hurt past ~500 records
9. STAFF role can view all projects in their org (no project-level access control)
10. Compliance docs in public Supabase bucket — need private + signed URLs

**🟡 Medium (15) + 🟢 Low (8):** see audit doc — none urgent.

**❌ Two audit false alarms (verified, ignore):**
- ".env in repo" — actually properly gitignored, not in git
- "No middleware.ts" — Next.js 16 renamed to proxy.ts which exists at `app/src/proxy.ts`

**Overall assessment:** Codebase ~80% production-ready. TypeScript strict passes, build is clean, no TODO/FIXME debt. Recurring weakness is silent failures at boundaries (middleware vs layout, session vs DB state, webhook vs business logic, public vs private storage). Hardening these is the highest-leverage work.

### What shipped today (2026-04-26)

Commit: `fe0cefb` (middleware allowlist for public routes).

Both bugs traced to one root cause: `/lib/supabase/middleware.ts` had a sparse `publicPaths` allowlist that didn't include `/blog`, `/manifest.webmanifest`, `/robots.txt`, `/sitemap.xml`, `/icon`, `/icon1`, `/icon2`, `/icon3`, `/apple-icon`, `/favicon.ico`, `/privacy`, `/terms`. All requests to these routes from unauthenticated users were 307-redirected to `/login`.

**Fix:** explicit allowlist of all public marketing/PWA/SEO routes. Verified by:
- Visiting `https://phasewise.io/manifest.webmanifest` returned the login page HTML (broken)
- After fix: returns the JSON manifest
- `https://phasewise.io/blog` returned 307 redirect to `/login` (broken — Google couldn't index)
- After fix: returns the blog index page

**Implication:** all 11 pillar SEO articles shipped over the past 3 days were never indexable by Google. The autonomous n8n pipeline shipping new articles every Friday was running into the same wall. **Now unblocked** — Google should start indexing within a few days. Existing blog backlog may take 1-2 weeks to fully crawl.

### Verification — all complete ✅

- [x] `curl https://phasewise.io/manifest.webmanifest` returns JSON (200, application/manifest+json) ✅
- [x] `curl https://phasewise.io/blog` returns 200 (no longer 307 redirect) ✅
- [x] `curl https://phasewise.io/icon1` returns 200 + image/png content-type ✅
- [x] Android home-screen icon now shows branded green phase-bars logo ✅
- [x] Google Search Console property verified for phasewise.io (via Cloudflare DNS auto-auth) ✅
- [x] Sitemap submitted successfully — 15 URLs discovered ✅
- [x] Priority indexing requested for 3 highest commercial-intent articles ✅

### Google Search Console state

- **Property:** phasewise.io (Domain property — covers all subdomains/protocols)
- **Verification:** DNS TXT via Cloudflare auto-auth (no manual TXT record management needed)
- **Sitemap:** `https://phasewise.io/sitemap.xml` — Status: Success, 15 discovered pages
- **Priority indexing requests submitted:**
  - `/blog/monograph-alternatives-landscape-architecture` (highest commercial intent)
  - `/blog/landscape-architecture-project-management-software` (BOFU keyword)
  - `/blog/landscape-architect-billing-rates-2026` (high search volume)
- **Other 12 URLs:** queued naturally via sitemap; will index over 1-2 weeks

### Indexing timeline expectations

- **24-72 hours from 2026-04-26:** Top 3 priority articles likely crawled + indexed
- **1-2 weeks:** Remaining 8 blog articles indexed via sitemap
- **4-8 weeks:** Articles start ranking for target keywords (positions 30-100 initially)
- **3-6 months:** Compounding organic traffic becomes visible
- **6-12 months:** Site reaches topical authority threshold for landscape architecture practice management

### Note: Cleanup item for later

The `google-site-verification` TXT record(s) Google added during today's auto-verification may now coexist with the older duplicate(s) flagged in CLAUDE.md as a cleanup item. Lower priority — multiple google-site-verification TXT records don't cause problems, just clutter. Defer cleanup until next Cloudflare DNS session.

## Where We Left Off (2026-04-25)

**Status: 🟢 N8N SEO CONTENT PIPELINE IS LIVE AND AUTONOMOUS.** Stripe live. Landing page clean. Blog has 11 pillar articles. **The compound-interest play is now compounding** — n8n auto-generates a new pillar SEO article every Friday at 7am UTC, commits it to GitHub via API, Vercel auto-deploys it. Zero ongoing effort. Estimated cost: ~$2.50/month in API usage. Pipeline self-rotates through 40-keyword priority list and won't duplicate existing articles. Will run autonomously for ~6 months before exhausting the keyword list.

### What shipped today (2026-04-25)

Commits: `fe07e13` (workflow JSON v1), `35c3ffd` (first auto-generated article), `c2598b4` (frontmatter sanitizer + bug fix), `77c0029` (autonomous keyword rotation upgrade), `615f1cd` (second auto-generated article).

#### n8n SEO content pipeline — fully wired

1. ✅ **Anthropic API credential** in n8n — connected to `n8n-phasewise-blog` API key, $10/mo spending cap, $5 alert threshold, $4.99 starting credit balance.
2. ✅ **GitHub API credential** in n8n — connected to fine-grained PAT scoped to `phasewise/phasewise` repo (Contents R/W + Metadata RO, 1-year expiry).
3. ✅ **Workflow built and imported** — 6-node pipeline: `Schedule Trigger → List existing articles → Build prompt → Generate article (Anthropic) → Extract article → Commit to GitHub`.
4. ✅ **Schedule Trigger active** — fires every Friday at 7am UTC (= midnight Pacific). Workflow status toggle: **Active**.
5. ✅ **Autonomous keyword rotation** — Build prompt node has a baked-in 40-keyword priority list (interleaved across 6 topical clusters). Each run, the workflow asks GitHub which slugs already exist and picks the first keyword whose slug is unused. After ~6 months at 1/week cadence, the list is exhausted and the workflow throws a clear error so Kevin knows to refresh.
6. ✅ **Frontmatter sanitizer** in Extract article node — strips ` ``` ` code fences if the LLM wraps them (defensive coding after first run revealed this bug).

#### Two articles auto-generated and live

7. ✅ **`/blog/landscape-architect-utilization-rate`** — first auto-shipped article. Quality 8/10: real numbers, plausible benchmarks, no AI tells. (Frontmatter manually fixed after first run because of the code-fence bug — sanitizer prevents this going forward.)
8. ✅ **`/blog/best-software-for-landscape-architects`** — second auto-shipped article. Frontmatter clean (sanitizer worked). Picked automatically as next-unused-keyword from the priority list.

**Blog article count: 11 total** (9 hand-written + 2 auto-generated). At 1/week autonomous cadence, the blog will be at ~25 articles by mid-June, ~50 by end of Q3 — the threshold where Google typically treats a site as a topical authority.

#### Reference files in `/automation/`

- `seo-keyword-targets.md` — 48 keywords across 6 topical clusters (rotation order documented)
- `article-generation-prompt.md` — full prompt design + quality control rubric
- `n8n-workflow-setup.md` — original step-by-step setup guide
- `n8n-workflow.json` — **importable workflow file** (current authoritative version)
- `IMPORT-WORKFLOW.md` — quick import instructions

### Pending follow-ups (not blocking)

- ⏳ **AlternativeTo submission** — copy-paste content ready in `directory-listings.md`. Was blocked by their weekend submission pause; should be unblocked Monday 2026-04-27. Account already created (`kgallo22@gmail.com`).
- ⏳ **Capterra + G2 directory submissions** — copy-paste ready in `directory-listings.md`. Submit when convenient.
- ⏳ **Optional: n8n error notifications** — n8n suggested setting these up so Kevin gets alerted if a future run fails silently. Takes 2 min in the workflow Settings tab.
- ⏳ **Quality monitoring** — read each Friday's auto-generated article for the first 4 weeks. If quality holds, ramp cadence to 2/week (cron `0 14 * * 1,5` for Mon + Fri).
- ⏳ **Auto-post articles to social media** — extend the n8n pipeline with social posting nodes after "Commit to GitHub". Architecture: `Commit to GitHub → Compose post (title + description + URL) → LinkedIn / X / Instagram nodes`. Blocked on social account setup + n8n credentials for each platform. Add when LinkedIn/X profiles are claimed and configured.
- ✅ **`/icon-512` 404 route fix** — fixed 2026-04-25 (commit `e2824b0`). Renamed icon files to follow Next.js convention (icon1.tsx, icon2.tsx, icon3.tsx). Android home-screen icon now shows branded logo.
- ⏳ **Vercel Analytics + Plausible** — add before significant traffic arrives so Kevin can see which articles convert.

### Earlier sessions on 2026-04-24

Commits: `f85e3e2` (5 new pillar articles), `cebf3f1` (n8n automation blueprint + 9th article), `f37e53c` (directory listings playbook + CLAUDE.md update).

#### Blog: 6 more pillar SEO articles shipped (now 9 total)

Targeting high-intent LA firm searches to accelerate Google authority. Each ~1,500–1,800 words, cross-linked, with soft product CTAs:

4. **`/blog/monograph-alternatives-landscape-architecture`** — 🔥 **HIGHEST commercial intent.** Honest comparison of Monograph vs Phasewise, BQE Core, Deltek, Harvest+Asana+QBO stack, spreadsheets. Decision framework by firm size + migration guide.
5. **`/blog/landscape-architect-fee-proposal-template`** — High search volume, funnel-top. Full proposal walkthrough: project understanding, scope, exclusions, fee structures (fixed/hourly/percentage), payment schedules, change order process. Industry fee benchmarks included.
6. **`/blog/construction-administration-checklist-landscape-architects`** — Senior PM intent. Pre-construction, submittal review, RFI workflow, site observation, change orders, punch list, plant establishment period. CA efficiency metrics to track.
7. **`/blog/how-to-calculate-landscape-architect-profit-margin`** — Owner intent, commercial searches. Direct labor, overhead allocation, worked example. 6 common mistakes firms make + industry benchmarks by firm size.
8. **`/blog/landscape-architecture-submittal-log-best-practices`** — Direct match to Phasewise feature, deep funnel. Required fields, numbering systems, response time targets, ball-in-court protocol, substitution review.
9. **`/blog/landscape-architecture-project-management-software`** — BOFU, highest commercial-intent keyword in the set. Written as the quality benchmark for the n8n automation (what auto-generated articles should match). Covers phase understanding, budget tracking, time tracking, submittals, compliance, billing rates, firm-size decision table.

All articles ship with:
- JSON-LD Article schema (Google rich snippets)
- Cross-links to other articles + related product features
- Branded `.prose-phasewise` typography
- Bottom CTA back to signup
- Static generation at build time (fastest possible page loads)

Blog now rendering 9 routes at build time. See `app/content/blog/` for all articles.

#### n8n SEO content automation blueprint (not yet live)

Created `/automation/` directory with 3 reference documents:

- **`automation/seo-keyword-targets.md`** — 48 target keywords across 6 topical clusters (Practice Management, Project Management, Compliance, Software, Team & Ops, Plants & Specs). Each tagged TOFU/MOFU/BOFU with priority. First 12 weeks of rotation pre-planned.

- **`automation/article-generation-prompt.md`** — Battle-tested prompt for Claude Sonnet 4.6. Enforces practical voice (no AI tells — no "delve", "streamline", "embark on"), specific numbers, 1,500–1,800 word length, required structure (frontmatter → 6+ H2 → "common mistakes" section → "How Phasewise handles this" → related reading → italic CTA). Cost estimate: $0.30/article, $30/year for 100 articles.

- **`automation/n8n-workflow-setup.md`** — Full step-by-step setup guide. Credentials, 6-node workflow config, first-run test procedure, quality rubric, error handling, scheduling. Includes duplicate protection, build failure detection, and expansion ideas (featured image auto-gen, competitor gap analysis).

Pipeline compounds over time: at 2 articles/week cadence = ~100 articles/year. By month 6, site becomes a topical authority in LA firm practice management. Cost: ~$2.50/month in API usage.

**Status:** blueprint complete, partial execution — see Resume-here checklist above.

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

### Next session priorities (in order)

**Audit critical fixes (do these first — same urgency as today's middleware bug):**
1. **Move `/privacy` and `/terms` out of `(app)/`** — they currently 307-redirect to /login. Compliance issue, breaks landing page footer. Smallest fix is to move both `page.tsx` files directly under `app/src/app/privacy/page.tsx` and `app/src/app/terms/page.tsx` (no `(app)` group). ~30 min.
2. **Add `isActive` check to `getCurrentUser()`** — single-line change in `app/src/lib/supabase/auth.ts` to return null if user is deactivated. Closes the access control gap where deactivated users keep working until their session expires. ~5 min.
3. **Form label accessibility** — add `id` + `htmlFor` to all form inputs across ~12-15 client components. WCAG 2.1 Level A blocker. ~2 hrs.

**Then the SEO/growth work:**
4. **Check Search Console indexing progress** — visit https://search.google.com/search-console → "Pages" report. By tomorrow expect to see at least the 3 priority articles indexed.
5. **Add Vercel Analytics + Plausible** — quick setup (~15 min). Need analytics in place before traffic accumulates.
6. **Submit directory listings** — AlternativeTo unblocked from weekend pause now. Then Capterra → G2. Copy-paste ready in `directory-listings.md`.

**Then audit High-priority fixes (next sprint):**
7. Time entry assignment check (#4 in audit)
8. Stripe webhook idempotency — `ProcessedStripeEvent` table (#5)
9. `BudgetAlert` table to replace description-marker hack (#6)
10. Billing page PAST_DUE / INCOMPLETE / CANCELED states (#7)
11. Pagination on list endpoints (#8)
12. STAFF project access control (#9)
13. Private compliance bucket + signed URLs (#10)

**Then growth/marketing operations:**
14. Product Hunt launch prep — needs launch-day assets (gif demo, screenshots, first comment).
15. Social profile uploads + auto-posting pipeline — v2 PNG logos + claim @phasewise on Instagram + extend n8n with social posting nodes.
16. USPTO trademark filing — before significant marketing push.
17. Cloudflare ops — getphasewise.com → phasewise.io 301 redirect + remove duplicate google-site-verification TXT records.

**Then audit Medium items (15 items, gradual cleanup):** see `AUDIT-2026-04-26.md` items 11-25.

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
- [x] 9th pillar article shipped as automation quality benchmark (LA project management software) ✅ 2026-04-24
- [x] Directory listing playbook created at `directory-listings.md` ✅ 2026-04-24
- [x] n8n SEO automation blueprint created (`/automation/` — keywords + prompt + setup guide) ✅ 2026-04-24
- [x] Anthropic API key + GitHub PAT created for n8n pipeline ✅ 2026-04-24
- [x] **n8n SEO content pipeline LIVE and AUTONOMOUS** — fires every Friday 7am Pacific, picks unused keywords from priority list, ships pillar articles to `/blog` ✅ 2026-04-25
- [x] First 2 auto-generated articles shipped (utilization rate, best software for LAs) ✅ 2026-04-25
- [x] Fix Android home-screen icon (renamed icons to Next.js convention) ✅ 2026-04-25
- [x] **CRITICAL bug fix:** middleware was redirecting /blog, /manifest.webmanifest, /icon* to /login — Googlebot couldn't index 11 SEO articles + Android couldn't fetch PWA manifest. Fixed via explicit allowlist for public routes ✅ 2026-04-26
- [x] Verify Android home-screen icon now shows branded logo (confirmed by Kevin) ✅ 2026-04-26
- [x] Google Search Console — Domain property verified for phasewise.io via Cloudflare auto-auth ✅ 2026-04-26
- [x] Sitemap submitted to Search Console (15 URLs discovered, status: Success) ✅ 2026-04-26
- [x] Priority indexing requested for top 3 commercial-intent articles (Monograph alternatives, LA PM software, billing rates) ✅ 2026-04-26
- [x] Comprehensive audit completed — 25 verified findings documented at `AUDIT-2026-04-26.md` ✅ 2026-04-26
- [x] **All 25 audit items cleared** ✅ 2026-04-27 (privacy/terms public, isActive check, form labels, time-entry assignment check, Stripe webhook idempotency, BudgetAlert table, billing PAST_DUE handling, pagination, project access control, private compliance bucket — see AUDIT-2026-04-26.md)
- [x] **Project relocation off OneDrive** ✅ 2026-04-30 — robocopy to `C:\dev\phasewise`, memory key migrated
- [x] **Pre-existing slug conflict fix** ✅ 2026-04-30 — dev server now starts cleanly
- [x] **MWELO render-back loop + branded PDF route** ✅ 2026-04-30
- [x] **Compliance UX overhaul (archive, delete, in-place edit, MWELO routing)** ✅ 2026-04-30
- [x] **Work Plan save UX clarity (per-phase + bottom buttons + dirty banner)** ✅ 2026-04-30
- [x] **Projects: search, type/status filters, inline status dropdown, status grouping** ✅ 2026-04-30
- [x] **Dashboard projects grouped by status** ✅ 2026-04-30
- [x] **Timesheet reopen flow (SUBMITTED + APPROVED)** ✅ 2026-04-30
- [x] **Future-week timesheet editable, submit-gated** ✅ 2026-04-30
- [x] **Invoice overhaul: auto-#, period dates, timesheet pull, paid flow, status grouping** ✅ 2026-04-30
- [x] **Monthly auto-invoicing cron + project billing visibility** ✅ 2026-04-30
- [x] **Tier 0 #1: Sentry error monitoring** ✅ 2026-04-30 — SDK installed, Vercel integration, GitHub source-code integration, MCP config, inbound filters + SDK noise filters, tested end-to-end (frontend + backend + source maps). Day-one catch: SyntaxError noise from HeadlessChrome bots, filtered.
- [ ] **Tier 0 #2: End-to-end smoke test** — in progress as of 2026-04-30 EOD (steps 1-6/17 done). Fresh test account `kevin@gallodesigns.com`. Pickup at step 7 (timesheet flow) tomorrow.
- [ ] **Tier 0 #3: In-app "report a problem" widget** — small button on every page; one-click feedback to founder
- [ ] **Tier 0 #4: Manual cron verification** — `curl` test `/api/cron/monthly-invoicing` + `/api/cron/submittal-reminders` with `CRON_SECRET` to verify no crash on first real fire
- [ ] **Tier 0 #5: Mobile timesheet entry test** — POC_SCOPE explicitly says "time entry must work on phone"; need to actually verify iOS + Android render
- [ ] **Monitor indexing progress** in Search Console over next 1-2 weeks (Performance + Indexing reports)

### Sales / outreach (highest revenue ROI)

- [ ] **Outreach reply playbook** — write canned responses for "interested", "not now", "tell me more", "what makes you different from Monograph?" before first replies land. Replies from Broussard / Atlas Lab expected within the week
- [ ] **Maintain weekly cold-outreach cadence** — 5 emails/day Mon-Thu (per `OUTREACH-PLAYBOOK.md`). Skip-2-weeks is the most common solo-founder failure mode
- [ ] **Submit to AlternativeTo** (text fields ready in `directory-listings.md` — was blocked by weekend pause; should be unblocked now)
- [ ] **Submit to Capterra + G2 individual listings** (copy-paste in `directory-listings.md`)
- [ ] **Add Vercel Analytics + Plausible** before significant traffic accumulates from outreach + content
- [ ] Later: more directories (GetApp, Software Advice, SaaSHub)
- [ ] Product Hunt launch (one-time, needs prep + launch window)

### Product polish that supports sales

- [ ] **Audit log on timesheet reopen + post-approval edits** — required for any firm billing T&M. Add `TimesheetAuditLog` table; record actor, timestamp, prior status
- [ ] **Reject-with-comment timesheet workflow** — approver rejects with a note, status flips back to DRAFT with rejection visible. Standard in Monograph / BQE / Deltek / Replicon
- [ ] **Friday email reminder cron for unsubmitted timesheets** — extends the existing submittal-reminders cron pattern
- [ ] **Weekly hour-target hint widget** — top of timesheet page: "32 / 40 hours logged this week" with soft amber warning under target on Friday. Used by Harvest / Toggl / Clockify

### Brand + ops

- [ ] **File USPTO trademark for "Phasewise"** — protect the name before significant marketing push (~$350)
- [ ] Upload v2 PNG logos to LinkedIn, X/Twitter, GitHub profiles
- [ ] Claim @phasewise on Instagram (was blocked by SMS verification — try again)
- [ ] Set up getphasewise.com redirect to phasewise.io in Cloudflare
- [ ] Remove duplicate `google-site-verification` TXT record from Cloudflare
- [ ] **Auto-post blog articles to socials** — extend n8n pipeline. Blocked on social accounts being claimed + API credentials in n8n
- [ ] Create Loops INVITE template (optional — link sharing works without it)
- [ ] Optional: n8n error notification workflow (alerts on silent failures)
- [ ] Quality monitoring: read each Friday's auto-article for 4 weeks; if quality holds, ramp to 2/week cadence
