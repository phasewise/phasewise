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
| `LOOPS_TEMPLATE_TIMESHEET_NUDGE` | ✅ | `cmovy41sk00uk0iykpd580404` (created 2026-05-07) |
| `LOOPS_TEMPLATE_PAYMENT_RECEIVED` | ✅ | `cmox8srpe009l0ixf1il6gfsg` (created 2026-05-08) |

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
- ✅ **Per-firm "Skip printing bank details on invoice" toggle** (shipped 2026-05-07) — `Organization.printPaymentDetailsOnInvoice Boolean @default(true)`. Toggle on `/settings/billing-info` between "Print on every invoice" (default) and "Don't print — Pay-now button only" (rendered with `<details>` collapse on the form sections). Server-side gate in `lib/invoice-pdf.tsx` and the public viewer's `hasRemit` check both honor the boolean, so the Remit-To block disappears from PDF + viewer when toggled off. Public viewer still falls back to the Pay-now button when Stripe Connect is wired.
- ✅ **🚨 P1: Stripe Connect Stages A+B+C** (shipped 2026-05-07) — full multi-tenant payment flow, three commits. **Stage A (`95c4f48`)**: `/settings/payments` + OAuth start/callback/disconnect (`/api/stripe/connect/{start,callback,disconnect}`). Schema: `Organization.stripeConnectedAccountId @unique` + `stripeConnectChargesEnabled` + `stripeConnectConnectedAt`. State param verified against `currentUser.organizationId` to prevent cross-firm OAuth. Disconnect best-effort deauth + always clears local fields. **Stage B (`cc1a05d`)**: `lib/stripe-payment-link.ts` calls `stripe.paymentLinks.create` with `{ stripeAccount: connectedAccountId }`. `/api/invoices/[id]/send` lazily creates a link on first send (when Connect is onboarded + charges_enabled + balance > 0) and stores it on `Invoice.stripePaymentLinkId`/`stripePaymentLinkUrl`. Public viewer at `/invoice/[token]` renders a Stripe-purple "Pay $X now →" button when a link exists. Loops `INVOICE_SEND` template gets `{{ payNowUrl }}`. Failures non-fatal — email still sends, viewer just falls back to remit-to block. **Stage C (`376139e`)**: new `/api/stripe/connect/webhook` endpoint with separate `STRIPE_CONNECT_WEBHOOK_SECRET`. Listens for `checkout.session.completed`, reads `metadata.phasewiseInvoiceId`, auto-flips invoice to PAID with paidDate, paidAmount, paymentMethod ("Stripe (card, ...)"), and paymentReference (PaymentIntent ID). Defense-in-depth: refuses to update if event's connected-account ID doesn't match the invoice's org. Shares `ProcessedStripeEvent` table with platform webhook for idempotency. Shipped without Loops "payment received" template (Stage 2 polish). **Required env vars** (NOT yet set on Vercel — code degrades gracefully): `STRIPE_CONNECT_CLIENT_ID` (ca_*) + `STRIPE_CONNECT_WEBHOOK_SECRET` (whsec_*). **Required Stripe dashboard config**: enable Connect with Express type, register `https://phasewise.io/api/stripe/connect/callback` as redirect URI, register `https://phasewise.io/api/stripe/connect/webhook` as a Connect webhook endpoint listening to `checkout.session.completed`.
- ✅ **Standardize confirmation/input modals across the app** (shipped 2026-05-08, commit `c4e5e5d`) — new `components/confirm-provider.tsx` mounts a single shared branded modal in the (app) layout. `useConfirm()` hook returns async function returning Promise<bool>. Options: title, message, confirmText, cancelText, destructive (rose-600), hideCancel (info-only). Keyboard support (Escape cancels, Enter confirms). 13 files changed, all 14 native `confirm()` / `alert()` call sites converted.
- **🐛 MWELO project picker dropdown unclickable in render-back mode only (smoke test 2026-05-04)** — On `/tools/mwelo-calculator?itemId=...` (View calc render-back), clicking the Project dropdown does nothing. On the standalone `/tools/mwelo-calculator` (no itemId), the dropdown opens correctly and selection works. Bug scope is confined to render-back mode. Suspects: (1) the "Editing saved calculation for X" banner overlay is intercepting clicks above the dropdown, (2) the select has a `disabled` attribute conditionally set when itemId is present, (3) the dropdown is being conditionally hidden behind the read-only project name text input. Fix path: open the calculator component, find the conditional render around the picker, ensure the dropdown stays interactive even when an itemId is present. The dropdown should also auto-select the saved `projectId` (related bug below).
- **MWELO render-back: project picker dropdown not auto-selected (smoke test 2026-05-04)** — when loading a saved MWELO calc via View calc, the project name text field pre-fills correctly but the project picker dropdown stays at "— Pick a project —". Likely because pre-2026-05-01 saved calcs have no `projectId` linkage (the dropdown was added on 2026-05-01 in commit `1a635b4`). Two fixes: (1) when saving from the dropdown, store both `projectId` and the project's name in the calculation JSON; (2) on render-back, if `projectId` exists, set the dropdown selection. Existing saved calcs will degrade gracefully (text-only) until re-saved.
- **Auto-clear stale error banners on next successful action (smoke test 2026-05-04)** — the "Failed to send invoice email" banner persisted after a successful Mark sent action. Error banners should fade out or clear when the user takes another action against the same row.
- **🚨 P0: Send-to-client fails — Loops free tier rejects attachments (smoke test 2026-05-04)** — clicking Send to client returns `400 - Your team is not allowed to send attachments. Need to upgrade? Contact us at help@loops.so`. Loops Pro is $49/mo to enable attachments. Recommend instead: switch to link-based delivery (matches Stripe Invoicing, QuickBooks Online, FreshBooks pattern). Implementation: add `Invoice.publicToken String @unique @default(cuid())`, new public route `/invoice/[token]` rendering the same React PDF component + "Download PDF" button, allowlist the route in `lib/supabase/middleware.ts` (similar to `/invite/[token]`), update `INVOICE_SEND` Loops template body to "Click to view and download: https://phasewise.io/invoice/{publicToken}" — no attachment needed. Benefits: works on Loops free tier, better deliverability (attachments hit spam filters), smaller emails, view-tracking via `Invoice.viewedAt`, always latest version, future-compatible with Stripe Payment Link integration. Removes the attachment code path in `lib/loops.ts` and the Render-PDF step in `/api/invoices/[id]/send/route.ts`. Until shipped, "Send to client" is broken on free tier.
- **🚨 P1: Invoice header industry-standard gaps (smoke test 2026-05-04, comparison vs Blankinship/Bowman LA invoice)** — current Phasewise invoice PDF is visually clean but missing 4 elements that real LA firm clients expect; without them, every send-to-client triggers a back-and-forth ("how do I pay you?", "what's your EIN?", "what contract is this against?"). Add to the invoice header:
  - **Remit-to / payment methods block** (top-right corner, MUST-HAVE for actually getting paid). Three methods: **Mail** (mailing address for check), **ACH** (routing + account), **Wire** (routing + account). Owner enters once in firm settings and it auto-populates every invoice.
  - **Fed ID / EIN** (firm-level setting). Required when clients issue 1099-NEC. Shown in the remit-to block.
  - **Agreement / Contract Number** (per-project field). Required by Caltrans, federal agencies, and most enterprise client APs. Many won't even process the invoice without it. Add `Project.contractNumber String?`.
  - **Attn: contact name** on BILL TO line (per-Client field already exists as `contactName` — verify it surfaces on the PDF). Adds polish + speeds up internal routing on the client's side.

  New settings page: `/settings/billing-info` with fields: Fed ID, mailing address, ACH routing/account, Wire routing/account, "Submit invoice in triplicate" toggle (optional, public-agency edge case). All fields optional except mailing address. PDF route reads firm record once and renders into the header. Without this work, Phasewise loses to Monograph + BQE Core where remit-to is table stakes.
- **🐛 P2: Invoice PDF cold-start timeout (smoke test 2026-05-04)** — first click on `/api/invoices/{id}/pdf` after a long idle period returns `ERR_SSL_PROTOCOL_ERROR` (TLS framing broken from a serverless function timing out mid-stream). Second click renders the PDF cleanly. Same render path is used by Send-to-client and the daily auto-invoicing cron, so this affects more than just the manual download. Mitigation options: (a) bump Vercel function `maxDuration` config for the PDF route, (b) precompute PDFs at invoice creation and store the binary on S3/Supabase Storage so the route just streams from storage, (c) add Vercel "Fluid compute" or warming. Option (b) also unblocks attaching the PDF in Loops emails without re-rendering on every send. Repro on Clovis Project #1 INV-003 (id `e0a8464f-ff2e-4659-83fc-32b3d0193e0b`). Sentry should have the trace if it caught it.
- **🚨 Auto-invoicing UX surfacing (smoke test 2026-05-04, brand-promise gap)** — the monthly auto-invoicing cron shipped 2026-04-30 (commit `b867a18`) already auto-creates draft invoices on the 5th of every month for every non-archived project covering the prior calendar month. But the UI doesn't surface this — owners still see the manual New Invoice form as the primary path, which contradicts the "Focus on the design, we'll handle everything else" landing-page promise. Four UX gaps to close:
  - **/admin/billing top panel**: "Auto-invoicing status — Last run: May 5, 2026 → created 3 draft invoices for April. Next run: June 5. [Review drafts →]"
  - **New Invoice form quick periods**: buttons for Last month / This month / Last week / Custom. Default to "Last month" for monthly cadence.
  - **Per-project billing schedule**: dropdown on project edit (`Monthly` / `Biweekly` / `Milestone` / `Manual`). Cron skips projects set to Manual or Milestone.
  - **Dashboard tile**: "X draft invoices ready to review" — appears after each auto-run, links to /admin/billing filtered to the new drafts.
  This is the highest-leverage UX improvement on the platform — the firm operator's monthly billing workflow goes from "20 minutes of manual work" to "review the auto-generated drafts and click Send to client." Real "we'll handle everything else" magic.
- **🐛 Invoice Detailed line-item mode doesn't show staff name + rate (smoke test 2026-05-04)** — toggle's label says "Detailed · one line per phase + person, shows hourly rates" but with a single person, the description renders identical to Summary (`Phase — Professional Services`). Should always include the person's name and rate in Detailed mode, even when there's one staff per phase. Fix: in `lib/invoice-builder.ts` (or wherever the line item description is composed), when `style === 'detailed'`, append `— {fullName} @ ${rate}/hr` to every row regardless of how many people. Also worth verifying with a second test staff that multi-person phases split into multiple lines as designed.
- **🚨 P1: Invoice un-approved-time warning (smoke test 2026-05-04, revenue risk)** — Was in the original 2026-04-30 invoice-overhaul spec but deferred. When user clicks "Pull from timesheets" on a period, also surface any DRAFT / SUBMITTED / SENT-BACK weekly timesheets within that period from team members assigned to the project. UI: amber warning banner under the existing "Pulled X hours" message listing unreviewed timesheets with status + a "Review pending timesheets" link. Confirmation gate on the Create invoice button if warnings exist ("Some timesheets are unreviewed. Are you sure you want to invoice now?"). Without this, firms will silently lose billable hours every month — a partner approves Tuesday, invoice goes out Wednesday, but Friday's late timesheet submission misses the cut. This is revenue protection, not polish.
- **City name display: normalize to title case (smoke test 2026-05-04)** — Projects list shows mixed casing for the same city (`FRESNO` and `Fresno` both for City of Fresno projects). Apply title-case normalization at display time so "FRESNO" → "Fresno", "san francisco" → "San Francisco", etc. Don't mutate the stored value, just normalize on render.
- **Phone number input mask (smoke test 2026-05-04)** — phone fields display raw digits (`15595555555`). Standard UX: format on display as `(559) 555-5555` (US 10-digit) or `+1 (559) 555-5555` (with country code), store digits-only in the DB. Apply to `User.phone` (team management), `Client.phone`, project contact phones. Use a small input mask library or roll a simple onChange handler that strips non-digits and reformats.
- **Rename "Billing & Subscription" → "Phasewise Subscription" (smoke test 2026-05-04)** — current label on the admin landing page card AND in the Settings sidebar is ambiguous; users confuse it with Project Billing (which IS for invoicing the firm's clients). Rename to "Phasewise Subscription" everywhere it surfaces. Description stays similar but tweak to emphasize SaaS plan ("Manage your Phasewise plan, payment method, and invoices.").
- **🐛 Reviewer comment banner persists after re-submit (smoke test 2026-05-04)** — The send-back modal copy explicitly states "The staff member will see your comment on their timesheet page until they re-submit." After the staff member edits and clicks Submit, the pink "Sent back by your reviewer" banner remains visible on the SUBMITTED-state timesheet. Either clear `reviewComment` on the SUBMITTED transition (matches modal copy) OR keep the banner and update modal copy to "until it's approved." Pick one. Probably the former is cleaner — once the user has acted on the feedback, the prompt should disappear.
- **🐛 Approver page column grid misaligned with period label (smoke test 2026-05-04)** — Approver row shows period "May 3 – May 9, 2026" (Sun-Sat) but the data grid headers render SAT 5/2 → FRI 5/8 (Sat-Fri). One-day shift between label and column grid. Same week's hours but visually misleading. Also inconsistent with the timesheet entry view which uses Mon-Sun. Pick one week-start convention (Mon-Sun is most common in US payroll) and apply it across BOTH the entry grid AND the approver detail grid AND the period label.
- **Approver page: history view (smoke test 2026-05-04)** — current `/time/approve` only shows pending submissions; once approved or sent-back, the row disappears. Managers need an audit trail. Add a tab toggle ("Pending / Approved / Sent back") or a separate `/time/approve/history` page listing past decisions with reviewer + timestamp + comment + a "Reopen" action on Approved rows.
- **Admin timesheet rollup dashboard (smoke test 2026-05-04)** — new section at `/admin/timesheets` with: monthly totals by staff (rows) × project (columns), billable vs non-billable split, leave / overhead / billable mix per person, utilization % per person, "this month vs last month" delta. Worth a small chart library (recharts already a candidate) for stacked bars. Owners want to see at a glance who's overbooked, who's slacking, and which projects are eating the most labor.
- **🐛 Timesheet Week status card stuck on wrong week (smoke test 2026-05-04)** — After submitting a week, navigating to a different week (Prev/Next) keeps the top-right Week status card showing SUBMITTED + Recall submission for the previously-submitted week, even though the grid below has switched to the new week. Each week has its own `WeeklyTimesheet` record so this is a frontend state bug — the status card needs to re-read the currently-displayed week's record on navigation. Confirmed in TimeSheetClient. Fix: replace the static prop-based `weekStatus` with a derived value keyed on the visible week, or refetch on `weekStart` change. Low-effort fix, high-value polish — submitting one week should not appear to lock other weeks.
- **Notifications panel / widget (smoke test 2026-05-04, Kevin shared PeopleSoft reference)** — universal "what needs my attention" surface. Header dropdown or persistent sidebar widget with badge count. Surfaces: pending timesheet approvals (for managers), overdue submittals (ball-in-court), draft invoices ready to send, budget alerts, sent-back timesheets (for staff). Each notification links to the action page. Without this, a manager logging in cold has to navigate to /time/approve to know if anything's pending. Critical for the brand promise — operators shouldn't have to hunt for what needs them.
- ✅ **Alternate / backup supervisor** (shipped 2026-05-04) — `User.alternateSupervisorId String?` (nullable, FK to User). When set, that user has the same approval privileges as the primary supervisor — covers vacation/leave/illness so approvals don't pile up. Wired into `/api/timesheets` approve + reject gates, the `/admin/timesheets` notifications scope, and the `/time/approve` page query (which now uses an OR between primary and alternate). Team edit modal exposes a "Backup supervisor" dropdown that filters out the user themselves AND the primary (can't be your own backup, can't be your own primary's backup). API rejects same-user assignment. (No "auto-route only when primary is on leave" logic; alternates always have permission, which is simpler and matches how firms actually delegate.)
- ✅ **"My Schedule" staff-side view** (shipped 2026-05-04) — new page at `/time/my-schedule` (no extra schema). Pulls all `PhaseStaffPlan` rows for the current user across non-archived projects + aggregates the user's hours logged per phase. Renders summary cards (Active Projects / Planned Hours / Logged So Far), then one card per project with a phase-by-phase progress bar showing logged vs planned (green / amber / rose by % consumed). "Log time on these phases →" CTA back to the timesheet. Linked from the timesheet page header alongside Approvals.
- ✅ **Role-based dashboard differentiation** (shipped 2026-05-04) — `/dashboard` now branches on `currentUser.role`. **STAFF** users get a personal-context dashboard: greeting, this week's hours card with target progress bar (defaults 40hr), phase-assignment count linked to My Schedule, current-week timesheet status (Draft / Submitted / Sent back / Approved), top 3 leave balances (Vacation / Sick / Holiday) with remaining hours, sent-back banner pinned at top if reviewComment is set, plus quick-action buttons (Log time / My schedule / Submittals). **OWNER / ADMIN / SUPERVISOR / PM** keep the existing firm-wide dashboard (active projects, at-risk count, drafts banner, total fee, avg burn). The staff variant runs only the personal queries — doesn't pay for org-wide aggregates the user can't see anyway.
- ✅ **Apply Schedule pre-fill** (Phase 1 shipped 2026-05-04) — `User.weeklyScheduleTemplate` JSON field stores `[{ projectId, phaseId, hoursPerDay: { mon..sun } }]`. **Capture flow**: "Save week as schedule" button on the timesheet reads the user's current week's project entries (skipping leave + overhead), groups them by project+phase, and stamps hours into the day-of-week buckets. **Apply flow**: "Apply schedule" button on a draft week deletes existing draft project entries (preserving leave + overhead) and re-creates from the template. Both gated by confirm dialogs. Only DRAFT weeks accept apply (server enforces). Templates are per-user and only available when viewing your own timesheet. Phase 2 — separate template editor UI for tweaking without re-saving from a real week — deferred to wishlist.
- ✅ **Monthly leave accrual with cap + rollover** (org-level shipped 2026-05-04, per-user override shipped 2026-05-07) — `LeavePolicyEntry` extended with `mode` ("FRONTLOAD" | "ACCRUED"), `monthlyAccrual`, and `cap` fields. New `computeAccruedHours(monthlyAccrual, cap, date)` helper counts COMPLETED months. `computeUserLeaveBalances` now returns the resolved mode + accrued amount alongside the existing fields. Admin form at `/admin/leave` exposes a Mode dropdown plus Monthly accrual + Cap inputs (disabled when mode=Front-load). Per-user override editor (commit `d414d14`) now exposes the same 6-field shape as the firm-wide table.
- ✅ **Automated year-end rollover** (shipped 2026-05-07, commit `d831e5e`) — `computeUserLeaveBalances` pulls leave entries for `[prevYearStart, yearEnd)` in one query, buckets by year on the JS side, and adds `min(remainingPrev, rolloverCap)` to this year's available pool. New `LeaveBalance.carryoverHours` field surfaces the amount; admin leave page + timesheet balance widget render "+Xh carried over" beneath the balance number. `rolloverCap=0` keeps use-it-or-lose-it (HOLIDAY default), `>0` clamps, `-1` is unlimited. ACCRUED policies use their own annualHours as the prior-year ceiling — by Dec 31 the full annual amount has been accrued (capped if a `cap` was set), so the formula works for both modes without re-running month-by-month accrual against a closed year. New Year's Day flips and the rollover computes itself off the prior year's actual usage.
- **Forensic audit** — top-to-bottom value review once the queue slows down. Rate each feature on value delivered vs maintenance cost. Cut or sharpen anything that doesn't earn its keep.

## Outreach automation

Higher-volume outreach uses the operational playbook at [`marketing/outreach/PLAYBOOK_for_other_projects.md`](marketing/outreach/PLAYBOOK_for_other_projects.md). Originally written for a project targeting solo operators (Typeform-using coaches/consultants); the principles transfer to Phasewise, but the ICP + lead sources + email patterns differ. Future sessions: **read the playbook for mechanics, but heed the adaptations below before executing.**

**Transferable principles (apply as-is):**

- **Anonymous brand voice.** Send from `Phasewise Team <hello@phasewise.io>`, sign "— The Phasewise team", no founder name anywhere.
- **Skip generic addresses** (`info@`, `hello@`, `contact@`). 2-5% open vs 30-50% for named addresses.
- **Vary subject lines across the daily batch** (bulk-filter signal otherwise).
- **Cadence: Day 0 / +3-5 / +10. Stop after FU#2.** Sending a third email is spammy and hurts sender reputation more than the marginal probability of conversion.
- **Cap ~5-15 emails/day** (mail.phasewise.io has been warming since April; can safely sustain 10-15/day at this point, but stay disciplined).
- **Conversion math:** 30-100 emails per first paying customer is the realistic range.
- **CSV tracker pattern** with status enum (pending / sent / followed_up_1 / followed_up_2 / replied / converted / not_interested / bounced / lost) is worth adopting once prospect count crosses ~30. Until then, `PROSPECTS.md` stays the source of truth.

**Phasewise-specific adaptations (do NOT apply the playbook literally):**

- **Target = LA firms (3-50 staff), not solo operators.** LA firms have public-sector portfolios, licensed principals, multi-person team pages. The playbook's "verify SOLO status via WebFetch" step is the wrong filter — we WANT firms with 3+ people because they have budgets. Use ICP filter "small to mid-size LA firm" instead.
- **Lead sources: registries + directories beat Google.** The CA Landscape Architects Technical Committee (LATC) publishes every licensed LA in the state. ASLA chapter directories (Sierra, Northern CA, Southern CA, San Diego) list firms publicly. Start there. WebSearch is the fallback, not the primary.
- **The playbook's Typeform/Calendly action-language queries don't fit LA firms.** Don't run `"apply to work with me" typeform [vertical]` — that returns coaches, not LA firms.
- **Pattern-guessing less reliable than for solo-brand domains.** Many LA firms publish only `info@firmname.com` or use `firstname.lastname@firm.com`. Hunter.io credits are MORE valuable here than for solo-operator targets. Spend them.
- **Email infrastructure already works.** We send via Gmail "Send mail as" on Workspace (hello@ alias on kevin@phasewise.io), with display name `Phasewise Team`. No Resend API needed at current volume. Revisit if we ever cross 50/day sustained.
- **Existing templates are calibrated.** `OUTREACH-DRAFTS.private.md` has 5 Tier-A cold drafts in the right register; `OUTREACH-REPLY-PLAYBOOK.private.md` has 6 reply templates. Use the **Mantle/attention2 "expert read" register** for senior firms (FASLA principals, 10+ year practices) — they're peers, not prospects to educate. Use the **Broussard/Atlas Lab value-first register** for growth-phase firms (newer practices, mid-career owners).
- **Anonymity discipline is stricter for Phasewise.** Some California LA firms have Caltrans-overlap risk (Kevin's day job) — never reference specific Caltrans projects, Cal Poly affiliations, or California district numbers in any draft. See `OUTREACH-DRAFTS.private.md` Email 2 (designlab 252) for the maximum-anonymity rework pattern.

**Files that future sessions should know about:**
- `marketing/outreach/PLAYBOOK_for_other_projects.md` — the imported operational playbook (read for mechanics)
- `OUTREACH-PLAYBOOK.md` — Phasewise's strategy doc (committed, public — strategic framing, tier targeting, register guide)
- `OUTREACH-DRAFTS.private.md` — the 5 active cold drafts + designlab 252 anonymity rework + Mantle draft (gitignored)
- `OUTREACH-REPLY-PLAYBOOK.private.md` — 6 reply templates for inbound responses + voice rules + triage table (gitignored)
- `PROSPECTS.md` — current source of truth for who's been contacted, when, and what status (gitignored)

**Active target vertical (chosen 2026-05-13): Option B + H — SoCal LA firms via LATC/ASLA, MWELO-strict overlay.** Kept Option D (San Diego), Option C (Sacramento/Central Valley), and other geographic verticals as backup. Kevin's strategic insight: firms working in MWELO-strict jurisdictions face MAWA/ETWU calculations on every public-sector + large-commercial submittal, so the built-in MWELO calculator is a "saves 2-4 hours per project" hook for them specifically. Residential-only firms in Tier-1 areas matter less (residential <2,500 sq ft is MWELO-exempt).

**Tier-1 MWELO-strict jurisdictions to over-index on:**
- **LA County:** City of LA, Santa Monica, Pasadena, Long Beach, Beverly Hills, Culver City (all have post-2015 ordinances stricter than statewide MWELO)
- **Orange County:** Irvine, Newport Beach, Costa Mesa, Anaheim (MWDOC enforcement)
- **Inland Empire:** Riverside, San Bernardino, Palm Springs (drought-zone strictness)
- **San Diego County:** county-wide drought-resistant landscape requirements

**Research-pass cadence (Path A):** target 5 outbound sends/day, Mon-Thu mornings (8-10am Pacific). Each off-day or weekend session: 1-2 hours of research to add 10-15 candidates to PROSPECTS.md Tier B section, draft personalized emails, queue via Gmail Schedule Send.

**Sending mechanic (current):** Claude drafts personalized emails in `OUTREACH-DRAFTS.private.md`; Kevin paste-and-sends via Gmail's "Send mail as" on `hello@phasewise.io` with Schedule Send for next morning. **No Resend API yet** — at 5/day the marginal time saved by API automation is small and human-in-the-loop catches name/email/anonymity mistakes before they hit sender reputation. Revisit Resend if we ever sustain 10+/day or want open/click tracking.

---

## Where We Left Off (2026-05-15 EOD)

**Status: 🟢🟢 Sales-pipeline build day.** Thu 5/14 was passive (Mantle fired automatically — Tier-A queue fully out). Fri 5/15 ran the first ASLA-FirmFinder-driven research pass: 4 verified Wave-3 candidates drafted + queued. The outreach pipeline is now **3 waves deep (~3 weeks of send cadence queued ahead of cadence)**. One housekeeping commit. No product code changed.

### Thu 5/14 (passive)

- **Mantle cold email fired automatically** at 8 AM Pacific. Tier-A queue (Broussard, Atlas Lab, attention2, designlab 252, Mantle) is now 100% out. No replies yet across any of the 5 first-touches + 2 follow-ups — normal; B2B reply windows are 3-10 days.

### Fri 5/15 — Wave 3 research pass

- **Sentry Business trial ended** → auto-moved to free Developer plan. Usage was 0% of even the free tier (10 errors / 1M, 96K spans / 100M). No action needed, no upgrade — Sentry keeps working.
- **#3/#4 checks (GDM Software Advice + GetApp approval, Capterra Knowledge Base propagation) could not be verified externally** — new directory listings aren't Google-indexed yet (2-4 week lag). Handed back to Kevin: check the GDM vendor portal (app.g2digitalmarkets.com → Product Listing → Channels) for publish status. Still pending as of EOD.
- **Research-method finding:** tested whether autonomous research is runnable end-to-end. ASLA FirmFinder (`connect.asla.org`) is **403-gated** against automated fetches; scattershot WebSearch by city is **low-yield** (SEO-skews residential). **The working split: Kevin does discovery** (pastes firm lists from the FirmFinder, which loads fine for a human), **Claude does verify + draft** (WebFetch each firm → size/portfolio/principal/email → personalized draft).
- **Wave 3 candidates verified.** Kevin pasted the ASLA FirmFinder SoCal list (~130 firms, 100-mi radius of LACMA). Claude triaged: excluded ~40 too-large/contractor/vendor (OLIN, RIOS, SWA, AECOM, BrightView, etc.), ~30 solo-residential, and **Tatsumi & Partners (transportation LA — anonymity risk, explicitly skipped)**. 4 verified Wave-3 candidates:
  1. **Community Works Design Group** (Riverside, 14 staff — caps at 14 by design, Certified Irrigation Auditor on staff, parks/schools/housing) — 🟢🟢
  2. **David Volz Design** (Costa Mesa, 6 staff, self-described "public landscape specialist" — parks/sports fields/streetscapes) — 🟢🟢
  3. **Architerra Design Group** (Rancho Cucamonga, 16 staff, 30+ yrs public-agency work) — 🟢
  4. **BMLA** (Corona, 18 staff, municipal/educational; pitched at VP of Operations Steve Shirrel rather than a design principal) — 🟢
- **Drafts written** — Emails 11-14 appended to `OUTREACH-DRAFTS.private.md` (Wave 3 section). All 4 need Hunter.io lookups (none publish a direct email). `PROSPECTS.md` Tier C updated with the 4 firms + a Wave 4 backlog of 10 triaged-but-unverified names (LRM, Agency Artifact, SQLA, MJS Design Group, FORMA Design, RHA, Withers & Sandgren, Sitescapes, Conceptual Design & Planning, Pacific Coast Land Design).

### Commit (1 today)

17. `1512f09` — **.gitignore: exclude .claude/ harness files.** A set of files had gotten accidentally staged (`.claude/settings.local.json`, `.claude/scheduled_tasks.lock`, a stray blank line in `BUSINESS_PLAN.md`, `brand_v2/exports/`, the playbook). Cleanup: unstaged everything, reverted the BUSINESS_PLAN.md blank line, added `.claude/` to `.gitignore`. `brand_v2/exports/` (brand assets + 5 directory screenshots) and `marketing/outreach/PLAYBOOK_for_other_projects.md` left **untracked pending Kevin's deliberate decision** — note that committing the playbook would put the outreach methodology in the public repo. (Rebased over the n8n pipeline's Friday auto-article `7a9925f`.)

### Pipeline state — 3 waves deep

- **Wave 2** (5 firms: Clark & Green, Mark Tessier, Studio PAD, Hermann Design Group, KDA) — fires Mon-Wed 5/18-5/20
- **Wave 3** (4 firms: Community Works, David Volz, Architerra, BMLA) — fires week of Mon 5/25
- **Wave 4 backlog** — 10 triaged names awaiting a verify pass

### Mon 5/18 — Wave 2 ignition (unchanged from 5/13 plan)

- **🚨 Hunter.io lookups (3 credits):** `clarkgreen.com`, `hdg-inc.com`, `kda-landscapearchitects.com`
- **🚨 attention2 follow-up #1** to Laura Burnett (5 business days past 5/11)
- **🚨 Schedule Send Wave 2:** Mon — Clark & Green + Mark Tessier; Tue — Studio PAD + Hermann; Wed — KDA
- Update `PROSPECTS.md` statuses after scheduling

### Week of Mon 5/25 — Wave 3 ignition

- **Hunter.io lookups (4 credits):** `cwdg.online`, `architerradesigngroup.com`, `dvolzdesign.com`, `bmla.net`
- **Schedule Send Wave 3** (Emails 11-14, 2/day): Community Works + David Volz, then Architerra + BMLA
- Wave 2 follow-up #1s also come due this week (Clark & Green + Mark Tessier ~5/25, Studio PAD + Hermann ~5/26, KDA ~5/27)

### Active waits (cron-style — won't ping you)

- **Mon 5/18 — Wave 2 sends + attention2 FU#1**
- **Mon 5/18 / Tue 5/19 — AlternativeTo submission unblocks** (7-day account-age gate)
- **Wed 5/20 — designlab 252 FU#1 due** if silent
- **Thu 5/21 — Mantle FU#1 due** if silent
- **Mon 5/25 — Broussard + Atlas Lab breakups due** if silent; Wave 3 sends begin
- **GDM Software Advice + GetApp approvals** — still pending; check the vendor portal

### Things still on the queue (not urgent)

- **GDM portal check** — verify Software Advice + GetApp publish status + Capterra Knowledge Base ✓ propagation
- **brand_v2/exports/ + playbook** — decide whether to commit (playbook → public repo)
- **Wave 4 verification pass** — 10 triaged names in PROSPECTS.md; also pull San Diego + Inland Empire core (still under-represented)
- **Resend API setup** — defer until 10+/day sustained or MWELO hook validates
- **Product video, custom category descriptions, Capterra vendor claim** — low-priority polish

---

## Where We Left Off (2026-05-13 EOD)

**Status: 🟢🟢🟢 Build day + sales pipeline build-out.** 5 commits shipped (invoice review UX + GA wiring + /pricing 404 fix + outreach automation playbook integration + active-vertical lock-in), Vercel Analytics confirmed firing, Google Analytics 4 confirmed firing, designlab 252 fired automatically at 8 AM Pacific, and the outreach automation workflow ran its first research pass — 5 verified Wave-2 candidates with personalized drafts queued for Mon-Wed sends. **The outreach machine is now operating ahead of the send cadence** instead of scrambling each Monday.

### Commits in order (5 today)

12. `27b665a` — **Wire Google Analytics 4 via NEXT_PUBLIC_GA_MEASUREMENT_ID env var.** Opt-in pattern matches existing Plausible setup. Script only loads when the env var is set, so previews + dev environments stay clean. Vercel env var (`G-DPVYJ6W5HS`) set on all 3 environments. Also added to local `app/.env` for dev testing. **Confirmed firing** — GA Realtime shows 1 active user with page_view + scroll + first_visit + session_start events.
13. `e2d7d12` — **Invoice review: read-only preview modal for draft invoices.** New `InvoiceReviewModal.tsx` surfaces line items, billing period, totals, and notes so operators can verify auto-pulled timesheet content before sending. DRAFT row clicks now open this modal; SENT/PAID/etc. rows keep the existing payment modal path. Plus an explicit "Review" action button in the row's actions cell (eye icon) for discoverability. Read-only — any correction stays in the New Invoice form's delete-and-recreate flow. Tested + confirmed working.
14. `a410573` — **Fix /pricing 404: server-side redirect to /#pricing + middleware allowlist.** Cold-email recipients who pasted `phasewise.io/pricing` were hitting a black 404. New server-component page at `app/src/app/pricing/page.tsx` calls `redirect("/#pricing")` from `next/navigation`, and `lib/supabase/middleware.ts` adds `/pricing` to the public-route allowlist.
15. `e38fb23` — **CLAUDE.md: point future sessions at outreach automation playbook with Phasewise adaptations.** Imported the operational playbook at `marketing/outreach/PLAYBOOK_for_other_projects.md` from another project (originally targeting solo Typeform-using operators). Added a 33-line "Outreach automation" section that says: transferable principles apply (anonymity, no generic addresses, varied subjects, Day 0/+3-5/+10 cadence, stop-after-FU#2), Phasewise-specific adaptations override (target = firms not solos, lead sources = LATC/ASLA not Google queries, pattern-guessing less reliable, existing Gmail Send-mail-as works, Mantle/attention2 register for senior firms, anonymity discipline is stricter due to Caltrans-overlap risk).
16. `f2d2633` — **CLAUDE.md: lock in active vertical (SoCal MWELO-strict) + research cadence.** Chose **Option B + H — SoCal LA firms via LATC/ASLA, MWELO-strict overlay** (LA County, OC w/ MWDOC, Inland Empire, San Diego County). Kevin's strategic insight: firms in MWELO-strict jurisdictions face MAWA/ETWU calcs on every public-sector + large-commercial submittal, so the built-in MWELO calculator becomes a "saves 2-4 hours per project" hook. Research-pass cadence: 5 sends/day Mon-Thu, weekend research blocks to keep 10-15 candidates ahead of send queue.

### Outreach machine: first automation-driven research pass

Ran the first research pass using WebSearch + WebFetch on SoCal LA firms. **5 verified Wave-2 candidates** (4 new + 1 promoted from existing Tier-A queue):

1. **Clark & Green Associates** (OC, 14 staff, Bob Clark + Michael Green ASLA) — 🟢🟢 strongest MWELO fit. Branded around water management + drought-tolerant planting. Email pattern uncertain → Hunter.io lookup needed.
2. **Mark Tessier Landscape Architecture** (Santa Monica, 4 staff, Mark Tessier ASLA) — Tier-1 MWELO city + affordable multifamily portfolio. Email verified: `mark@marktessier.com`.
3. **Studio PAD** (OC, 6-12 staff, Peter A. Duarte) — OC multifamily/on-podium/master planning. Email verified: `paduarte@studio-PAD.com`. (Important learning: the old email guess `peter@studio-pad.com` from 4/29 research was wrong — pattern is `firstlastinitial`. Documented for future research.)
4. **Hermann Design Group** (Coachella Valley + Riverside + SD, Chris Hermann, 40+ yrs experience) — Inland Empire drought zone + literal turf-removal portfolio. Multi-office (likely 15-25). Email: `info@hdg-inc.com` only; Hunter.io lookup for `chris@hdg-inc.com` recommended.
5. **KDA Landscape Architects** (SD, 4 staff, Kathryn Kanaan PLA ASLA, founded 2001) — San Diego public-agency contracts + irrigation specialist on staff + DBE/SBE certs. Email pattern uncertain due to long domain → Hunter.io lookup needed.

**Deprioritized from this pass:**
- KTUA (SD) — likely 25-50+ staff, founded 1970, multi-discipline. Outside ICP for $349/mo Studio plan.
- Studio AR&D Architects (Palm Springs + LA) — no named principals, no email, residential focus.
- June Scott Design (Pasadena) — "very small office" likely solo, may not fit firm-size ICP.

**Still TBD:** SALT Landscape Architects (LA boutique founded 2009) — HTTP 503 both fetch attempts. Retry next session.

### Operational confirmations today

- **Google Analytics confirmed firing** — Realtime shows 1 active user, page views tracking, events for scroll + first_visit + session_start. Production data starts accumulating now.
- **Invoice review modal tested** — DRAFT row click + Review button both open the modal correctly; non-DRAFT rows still open Payment modal. Anonymity audit clean.
- **designlab 252 first-touch fired automatically** at 8 AM Pacific. Maximum-anonymity rework held up. Reply window starts now; FU#1 due Wed 5/20 if silent.
- **Capterra promotional emails arriving** in inbox — signal that the listing is indexed + their algorithms are recommending Phasewise back at us. Normal vendor onboarding.

### File updates (private/gitignored)

- `OUTREACH-DRAFTS.private.md` — appended Wave 2 with 5 new personalized cold drafts (Emails 6-10). Each leads with a portfolio-specific MWELO hook tuned to the firm's sub-vertical.
- `PROSPECTS.md` — new Tier C section "MWELO-strict SoCal push (researched 2026-05-13, automation-driven)" with 3 new candidate entries + 2 promotions from existing tiers. Send queue documented.

### Sending mechanic decision

Kevin chose **Option C: Claude drafts + Kevin paste-and-sends via Gmail Schedule Send**. Reasoning: at 5/day the marginal time saved by API automation is small, sender reputation on hello@phasewise.io has been warming since April, human-in-the-loop catches dumb mistakes BEFORE they cost reputation. **Revisit Resend setup after first 20-30 emails OR after MWELO hook validates with 1-2 positive replies.**

### Tomorrow / Thursday 2026-05-14 — top of the list

**🚨 #1: Mantle cold email fires automatically at 8 AM Pacific.** Nothing to do but check for any reply landing during the day. If anything inbound, use `OUTREACH-REPLY-PLAYBOOK.private.md` templates.

**#2: Watch for GDM approval emails** on Software Advice + GetApp. Both still under review from yesterday's submissions — expected approval Thu through Fri.

**#3: Check Capterra public page for Knowledge Base ✓ propagation** (yesterday's vendor edit should be visible by Wed-Thu).

**#4: Optional research block** if you have an hour free — pull next batch (Inland Empire, Pasadena, Long Beach, Beverly Hills firms) into Tier C of PROSPECTS.md. Keeps the queue 1-2 weeks ahead of send cadence.

### Mon 5/18 — Wave 2 begins

**🚨 #1: Hunter.io lookups (3 credits, ~10 min)** before sending:
- `clarkgreen.com` → find Bob Clark / Michael Green email
- `hdg-inc.com` → confirm `chris@hdg-inc.com` or surface alternative
- `kda-landscapearchitects.com` → find Kathryn Kanaan email

**🚨 #2: attention2 follow-up #1 due** (Laura Burnett, 5 business days after 5/11 send). Use playbook FU#1 template.

**🚨 #3: Schedule Send Wave 2 batch via Gmail:**
- Mon 5/18 8 AM Pacific: Email 6 (Clark & Green) + Email 7 (Mark Tessier)
- Tue 5/19 8 AM Pacific: Email 8 (Studio PAD) + Email 9 (Hermann Design Group)
- Wed 5/20 8 AM Pacific: Email 10 (KDA Landscape Architects)

**#4: Update PROSPECTS.md** after scheduling — change Tier C statuses from `⏳ Not contacted` to `📧 Scheduled #1 — 2026-05-XX`.

### Active waits (cron-style — won't ping you)

- **Thu 5/14 — Mantle first-touch fires**
- **Thu-Fri 5/15-5/16 — Software Advice + GetApp public listings should go live** (GDM approval pending)
- **Mon 5/18 — Wave 2 sends + attention2 FU#1**
- **Mon 5/18 / Tue 5/19 — AlternativeTo submission unblocks** (7-day account-age gate)
- **Wed 5/20 — designlab 252 FU#1 due** if silent
- **Thu 5/21 — Mantle FU#1 due** if silent
- **Mon 5/25 — Broussard + Atlas Lab breakups due** if still silent after FU#1
- **Mon 5/25 — Clark & Green + Mark Tessier FU#1 due** if silent
- **Tue 5/26 — Studio PAD + Hermann FU#1 due** if silent
- **Wed 5/27 — KDA FU#1 due** if silent

### Things still on the queue (not urgent)

- **Next research pass** — Inland Empire (Riverside/San Bernardino), Pasadena, Long Beach, Beverly Hills, SALT retry, ASLA San Diego directory. Target +10 candidates for Wave 3.
- **Resend API setup** — defer until 10+/day sustained or after MWELO hook validates with 1-2 positive replies.
- **Custom per-category descriptions on Capterra + GetApp** — +8% completion, low effort, diminishing returns at 91%.
- **Product video for GetApp / Software Advice** — 60-90 second demo, real 2-4 hour project.
- **Capterra vendor profile claim** — still pending.
- **Stripe Connect production smoke test** — when first real client is lined up.

---

## Where We Left Off (2026-05-12 EOD)

**Status: 🟢🟢🟢 Massive customer-acquisition day.** One code commit, two more cold emails scheduled (designlab 252 + Mantle), two more directory channels activated (Software Advice + GetApp), Vercel Analytics enabled, anonymity hardened across two more surfaces (second LinkedIn account deleted + Workspace user renamed). Listing completion score went from 69% → 91%. The brand-anonymous customer-acquisition machine is essentially fully wired now — what's left is waiting for replies + iterating.

### Commits in order (1 today)

11. `a410573` — **Fix /pricing 404: server-side redirect to /#pricing + middleware allowlist.** Cold-email recipients who pasted `phasewise.io/pricing` were hitting a black 404 page — terrible first impression. Two-file change: new server-component page at `app/src/app/pricing/page.tsx` calls `redirect("/#pricing")` from `next/navigation`, and `lib/supabase/middleware.ts` adds `/pricing` to the public-route allowlist so unauthenticated visitors don't get bounced to `/login`. Browsers preserve the fragment on 307 redirects in most cases; if they don't, the landing page's pricing section is still visible without scrolling. Future cleanup: build a real `/pricing` route with structured data + faster paint, but the redirect closes the immediate UX hole.

### Outreach scoreboard (3 more actions out — total 5 since 5/11)

- **✅ designlab 252 — Scheduled Wed 5/13 8 AM Pacific via Gmail Schedule Send.** This was the maximum-anonymity case: Kevin has worked directly with all three partners (Patrick Boyd, Konni Jones, Scott Mears — all with Caltrans backgrounds; Scott is currently Co-Chair of Caltrans Central Region Calmentor Steering Committee). The 2026-04-28 draft was unsendable — it opened with "30 years of transportation work" and offered a "free MWELO guide," every phrase narrowing the field to people in Kevin's exact Caltrans orbit. Reworked end-to-end: removed all references to transportation, Caltrans, highway, public-sector, Cal Poly, Fresno, MWELO-as-hook, plant-science/irrigation. Subject changed to "An LA-specific PM tool — quick honest read from designlab 252?" — generic vendor framing, zero portfolio knowledge implied. Body uses the Mantle-style "expert read" register treating all three partners as senior peers. Reply protocol added with explicit "Scott Mears is highest-recognition risk" warning since he's actively on Calmentor today.
- **✅ Mantle — Scheduled Thu 5/14 8 AM Pacific.** To Ramsey Silberberg at `info@mantlela.com`. Standard "expert read" register treatment matching attention2 + the reworked designlab 252. Same brand-anonymous voice. Staggered one day after designlab 252 so reply windows don't bunch.

Tier-A queue **fully out of the gate**: Broussard + Atlas Lab + attention2 + designlab 252 + Mantle = 5 first-touch outreach emails, plus 2 follow-ups (Broussard + Atlas Lab FU#1 sent yesterday).

### Directory listings: all 3 GDM channels live (or under review)

Yesterday Capterra was the only one published. Today we activated the other two GDM properties + tuned Capterra.

- **🟢 Capterra: still Published.** Plus 5 accuracy fixes applied: Knowledge Base support → ✓ (now that `/help` shipped), Licensing Models → Proprietary, the 20-features list audited clean (no forbidden auto-merges — Client Portal, API, Native Mobile, AI Copilot all correctly unchecked), Starter tier limits verified matching the live landing page (Up to 5 users / 20 active projects), and Pricing URL set to `https://phasewise.io` (since `/pricing` is now a redirect).
- **🟠 Software Advice: NEWLY ACTIVATED → Under Review.** Long Description (~2,500 chars) tailored to Software Advice's research-oriented buyer profile — "ideal user / unique benefits / support details" structure per their content prompt. 5 screenshots uploaded with captions (Dashboard, Project Detail, MWELO Calculator, Profitability Report, Submittal Log — same set as Capterra at `brand_v2/exports/screenshots/`). Submit For Review clicked. Expected approval Wed-Thu (GDM's typical 24-72h moderation window; Capterra came through in ~30h yesterday).
- **🟠 GetApp: NEWLY ACTIVATED → Under Review.** Tailored 1,700-char Long Description (different framing than Software Advice — "operating system for landscape architecture firms" hook, vs SA's "if your firm runs on a stack of..." hook — meaningful structural differentiation to pass GDM's per-site tailoring rule). Tagline: "The operating system for landscape architecture firms" (53 chars). Benefits section: 6-bullet value-prop list. Same 5 screenshots with same captions. Submit For Review clicked. Same approval window.

Each new channel went through: tailored copy, all required fields filled, screenshots uploaded + captioned, page-level save, Submit For Review. Process took ~15 min per channel.

### Anonymity hardening (2 more surfaces locked down)

Yesterday's Postmaster + welcome template tightening were operational. Today closed two **structural** anonymity holes:

- **🗑️ Second Kevin Gallo LinkedIn account deleted.** Discovered during the Capterra sign-in verification — the account at `linkedin.com/in/kevin-gallo-a2bb59406` was a second LinkedIn profile Kevin had created around the Workspace setup (mid-April) specifically to be the "Phasewise founder" presence so he could later create a Phasewise Company Page. The account publicly listed "Owner at Phasewise" in the headline AND in an Experience entry — a complete anonymity break for anyone searching LinkedIn for "Phasewise" or `kevin@phasewise.io`. Strategic decision: skip the Phasewise LinkedIn presence entirely for now. Reasoning: LinkedIn Company Pages cannot exist without a real personal admin who lists the company as current employer; that's an unavoidable public link if Kevin wants a Company Page. **Cleaner play is no LinkedIn presence for Phasewise at all** until Kevin can either hire someone to be the visible admin, or until revenue replaces his Caltrans income and anonymity becomes less critical. Account closed via duplicate-account reason; 14-day soft delete period before permanent. His **long-term personal LinkedIn (Caltrans-anchored) is untouched** and is now his only LinkedIn surface.
- **✅ Workspace user renamed Kevin Gallo → Phasewise Team.** The underlying Google Workspace user at `kevin@phasewise.io` had display name "Kevin Gallo." That display propagates to Google Calendar invites, Drive shares, Gmail address-card auto-resolves (which was the bug surfaced 5/9 when Kevin saw "Kevin Gallo" appear in his own Gmail search for `hello@phasewise.io`), and any Workspace directory lookup. Renamed in Admin Console → Directory → Users. From now on every Google-surface interaction shows "Phasewise Team," matching the email From line. Both `hello@` and `demo@` aliases pull from the renamed user.

### GDM vendor portal access established

Yesterday's "permissions wall" cleared. GDM's `gdmcatalogteam@gartner.com` replied within ~24h confirming `hello@phasewise.io` was added as a vendor user with reactivation email. Kevin set the account up via app.g2digitalmarkets.com with anonymity-clean profile data (Phasewise / Team / Manager-Head-Lead / Product department / Pacific Time). The portal manages Capterra + Software Advice + GetApp content cross-channel — single edit interface for all three GDM properties.

### Listing completion score: 69% → 91%

The recommendations counter dropped from 13 → 4 across the session. Closed: Software Advice + GetApp descriptions, Software Advice + GetApp screenshots, Knowledge Base toggle, Licensing Models (Proprietary), Pricing URL, Pricing Details (5,000-char tailored copy with included-on-every-plan rundown, free trial details, volume guidance, refund policy).

**Remaining 4 recommendations triaged:**
- Custom descriptions on Capterra + GetApp (per-category tailoring) — could net +8% but the marginal returns aren't worth the effort tonight
- Supported integrations — **skipping**. Phasewise has zero integrations wired (no QuickBooks, Slack, Zapier, etc.). Accepting the -3% completion hit on honesty grounds; listing fake integrations triggers 1-star reviews from buyers who expect them.
- Product video — **deferred** to a focused 2-4 hour recording session later this week. Real boost to engagement once shipped (~+2% completion plus significant CTR lift), but it's a real project, not a quick recommendation.

91% is well above the GDM median (typical listing 60-80%) and the diminishing-returns curve is steep after this point. Higher-leverage moves now are: first review, first paying customer, more outbound volume.

### Vercel Analytics enabled

Discovered the `@vercel/analytics` package was already installed (v2.0.1) and `<Analytics />` was already mounted in `app/src/app/layout.tsx:115` from a prior session — the only missing piece was the dashboard toggle. Enabled on the free Hobby tier (50K events/month, 30-day viewable history). First data populates within ~24h. Goes live just as the outreach + n8n content pipeline are starting to drive real visitors.

### File updates (private/gitignored)

- `OUTREACH-DRAFTS.private.md` — Email 2 (designlab 252) reworked end-to-end with maximum-anonymity guards + explicit "what to do if Scott replies" reply protocol
- `OUTREACH-REPLY-PLAYBOOK.private.md` — pricing template #4 corrected from wrong "3 users / 5 projects" to canonical "5 users / 20 projects" (which matches the landing page + Stripe enforcement)
- `PROSPECTS.md` — designlab 252 status updated to "📧 Scheduled #1 — 2026-05-13 (was anonymity-maximum rewrite)"

### Tomorrow / Wednesday 2026-05-13 — top of the list

**🚨 #1: designlab 252 cold email fires at 8 AM Pacific.** Nothing to do but check for replies. If any reply lands during the day, use `OUTREACH-REPLY-PLAYBOOK.private.md` templates. **Maximum care** if Scott Mears replies — he's the highest-recognition risk (active Calmentor Steering Committee role). Voice-only call if pushed for identity disclosure beyond template #5.

**🚨 #2: Watch for Software Advice + GetApp approval emails.** Both submitted today, GDM's pattern is 24-72h. Expect approval Wed afternoon through Thu morning. If approved: confirm public listings render correctly (search the brand name on each site). If rejected with feedback: triage the reason and resubmit same-session.

**#3: Check Capterra public page for Knowledge Base ✓ propagation** (24-48h after today's vendor edits). The toggle is the most visible new fix.

**#4: First Vercel Analytics data should be visible** ~24h after enabling. Check the Analytics tab on the Vercel dashboard. Even at low volume, seeing the dashboard render real numbers is a useful sanity check.

**#5: Maintain outreach cadence.** No new outbound queued for Wed since designlab 252 fires automatically. Thu 5/14 Mantle fires automatically. If both go silent through their respective FU#1 windows (Wed 5/20 for designlab 252 follow-up; Thu 5/21 for Mantle follow-up), keep the existing playbook. If any inbound lands, prioritize replies over new outbound.

### Active waits (cron-style — won't ping you)

- **Wed 5/13 — designlab 252 first-touch fires**
- **Thu 5/14 — Mantle first-touch fires**
- **Wed-Thu 5/13–5/14 — Software Advice + GetApp public listings should go live** (GDM approval pending)
- **Mon 5/18 — attention2 follow-up #1 due** (5 business days after 5/11 send to Laura Burnett)
- **Mon 5/18 / Tue 5/19 — AlternativeTo submission unblocks** (7-day account-age gate)
- **Wed 5/20 — designlab 252 follow-up #1 due** if silent
- **Thu 5/21 — Mantle follow-up #1 due** if silent
- **Mon 5/25 — Broussard + Atlas Lab breakups due** if still silent after FU#1

### Things still on the queue (not urgent)

- **Product video for GetApp / Software Advice** — 60-90 second demo recording. Real 2-4 hour project. Defer to a focused session.
- **Custom per-category descriptions on Capterra + GetApp** — +8% completion if done, low effort, but diminishing returns at 91%
- **Plausible signup** — Vercel Analytics covers the basics; Plausible would be the open/privacy-friendly alternative or supplement
- **Capterra vendor profile claim** — still pending (skipped today since we got into the GDM unified portal which manages Capterra)
- **First review** — needs first customer. Bigger lever than completing 100% of the listing completion checklist.

---

## Where We Left Off (2026-05-11 EOD)

**Status: 🟢🟢 Pure sales-execution day. Zero code commits. Three outreach actions out the door, one directory placement went LIVE on Capterra, one secondary directory gated for 8 days.**

### Outreach scoreboard

- **✅ attention2 — Sent #1 to Laura Burnett (President, FASLA) at `laura@attention2.com`** — Hunter.io-verified address (2 sources, shield-verified). Original 2026-04-28 draft was reworked end-to-end based on the Hunter About-page context: founded 2011 (not 2019), husband-and-wife founders married 1986, both FASLA, public-sector specialization (parks/campuses/transit/open-space/civic). Subject changed to "Quick honest read from attention2 on an LA-specific PM tool?" (humility-hook, no `$`/caps/`!`, 59 chars). Body switched from "growth-pain" register to Mantle-style "expert read" register since two FASLAs running a 15-year practice are senior peers, not prospects to educate. Free-MWELO-guide hook removed. Public-agency invoicing pain (contract numbers, Attn lines, MWELO compliance docs) named specifically — the exact admin patterns the 2026-05-04 invoice-header work was built for. Sent from `Phasewise Team <hello@phasewise.io>`. Follow-up #1 due Mon 5/18.
- **✅ Broussard — Sent FU#1 to Terry** at `terry@broussardassoc.com`, threaded on the original 4/29 send. Kevin softened the standard playbook template for Terry's 1996-vintage Central Valley register: "provide more information if you'd like" instead of "20-min walkthrough" + traditional "Thank you for your consideration" close. Breakup due Mon 5/25.
- **✅ Atlas Lab — Sent FU#1 to Kimberly Garza** at `kimberly@atlaslab.com`, standard playbook template. Breakup due Mon 5/25.

### Directory placement wins + blockers

- **🟢 Capterra listing went LIVE today at 10:11 AM Pacific** — GDM (Gartner Digital Markets) approved the 5/4 resubmission. The earlier 5/7 rejection ("website was not accessible") turned out to be a transient crawl failure on their end. Listing URL is at https://www.capterra.com/p/[slug]/Phasewise/. Public page renders cleanly: Project Management Software category, $99 starting price, free trial flag, 3+ screenshots, accurate description. Pricing tab shows all three tiers ($99/$199/$349). Features tab shows 20 (you submitted 18 — 2 auto-added by Capterra, worth auditing). Deltek PIM correctly placed as a top alternative (real competitor). Software Advice + GetApp should mirror over the next 24-48h since they share GDM's backend.
- **⏳ Capterra vendor access blocked on GDM permissions.** Tried `vendor.capterra.com` / GDM unified portal — sign-in with `hello@phasewise.io` got past the login but hit "your account doesn't have the permissions needed to see this page." Likely the 5/4 submission was recorded under a different email (possibly `kgallo22@gmail.com` from the pre-brand-migration era, or no vendor-admin role was attached at all). Replied to the live `gdmcatalogteam@gartner.com` thread asking for vendor-access migration to `hello@phasewise.io`. They've been responding within 24 hours; expect resolution Tue 5/12 morning.
- **Pending vendor edits to apply once GDM unblocks access:**
  1. Toggle **Knowledge Base** support to ✓ (the `/help` center shipped 2026-05-08 — listing predates it)
  2. Verify the **Starter tier user/project limits** match the live `/pricing` page AND what Stripe actually enforces. Capterra currently shows "Up to 5 users, 20 active projects." The reply playbook draft from Saturday referenced "3 users / 5 projects." One of those is wrong — pick the authoritative source and unify across landing page + billing page + directories.
  3. Click through "See all 20 features →" and confirm none of the forbidden auto-merges slipped in (Client Portal, API, Native Mobile App, Live Online training).
- **⏳ AlternativeTo gated 7 days.** Created account as `phasewise-team` with `hello@phasewise.io`, email verified. Then hit AlternativeTo's hard "new app submissions require an account age of at least 7 days" anti-spam wall. **Submission unblocks Mon 5/18 evening Pacific / Tue 5/19 01:38 AM Stockholm.** All copy is already prepared in `directory-listings.md` — when the gate lifts, the submission is ~10 minutes.

### Hunter.io setup confirmed working

Kevin already had a free Hunter.io account from prior use. Six leads visible (2 Phasewise-relevant duplicates: Atlas Lab + Broussard; 4 Verifield-era leads to ignore). Today's net new use: searched `attention2.com`, found both decision-makers (Laura Burnett FASLA / President + Marty Poirier FASLA / Partner), revealed Laura's verified email at 1 search-credit cost. Free-tier limits: 50 searches/month, 10 verifications/month. Currently at 1 search used. Plenty of headroom.

### Files updated today

- `PROSPECTS.md` (gitignored) — attention2 entry rewritten with verified email + corrected founding year + new "expert read" hook + 📧 Sent #1 status. Broussard + Atlas Lab status flipped to 📧 Sent FU#1.
- `OUTREACH-DRAFTS.private.md` (gitignored) — Email 3 (attention2) reworked end-to-end. Old "growth-pain" register replaced with "expert read" frame. Subject hooked on humility + curiosity. Anonymity-note added pointing to reply playbook template #5.

### No code commits today

Today was pure customer-acquisition execution. No production code touched. Reviewed audit-fixed surfaces; no regressions.

---

## Where We Left Off (2026-05-09 EOD)

**Status: 🟢 Light, focused day after yesterday's marathon.** Two commits, real-bug-found-via-Zod-refactor, full audit punch-list cleared, Postmaster Tools live, welcome template tightened, outreach reply playbook drafted. Total LOC small; meaningful work concentrated in audit closure, ops hardening, and the offensive-side prep for first cold-outreach replies.

### Commits in order (2 today, on top of yesterday's 7)

8. `eef0d33` (or thereabouts — `eef…` not in scope today, see below) — N/A
9. **Today's commits**:
   - `c14c86e` — **Audit mop-up: dev-guard budget log + Sentry capture on checkout fail.** Two Low-tier audit items from yesterday's forensic audit. **(a)** `lib/budget-alerts.ts:121` — wrapped `console.log` in `process.env.NODE_ENV !== "production"` guard so the log doesn't flood Vercel function logs at scale (every time-entry write triggers a budget check). **(b)** `app/_components/PricingButton.tsx:49` — replaced `console.error(err)` with `Sentry.captureException(err)` so checkout-button network failures land in Sentry instead of the user's browser console.
   - `8c2e44d` — **n8n automation docs: refresh setup guide + add 5/9 incident postmortem.** Two doc updates. **(a)** `automation/n8n-workflow-setup.md` rewritten to match the actual deployed 6-node pipeline (`Schedule → List → Build → Generate → Extract → Commit`); old version described an older simpler pipeline. New version documents the deterministic keyword selection logic, the frontmatter fence-strip sanitizer, and points to the JSON as the import source of truth. **(b)** New `automation/n8n-blog-incident-2026-05-09.md` postmortem capturing what broke (GitHub 422 on slug collision), root cause (Build prompt didn't read upstream `List existing articles` output, so keyword was effectively static), fix detail (rewrote Build prompt to dedupe against existing slugs), and why it can't recur. The `n8n-workflow.json` was already current — the deterministic keyword selection + sanitizer were baked in earlier; only the prose docs were stale.

### Plus operational work (no commits)

- **Google Postmaster Tools setup** — both sending domains added and auto-verified (no TXT step needed; Postmaster reused phasewise.io's existing Search Console verification from 2026-04-26).
  - `phasewise.io` (Workspace Gmail apex)
  - `mail.phasewise.io` (Loops sending subdomain)
  - Data starts populating in 24-48 hours. At current send volume most charts will say "Not enough data" for a while; meaningful signals appear once volume crosses ~hundreds of recipients/day. Connects directly to the welcome-email-to-spam diagnosis from yesterday — gives reputation visibility going forward.
- **Welcome email template tightened in Loops** — three small wins applied to the Welcome template ahead of any further outreach:
  1. Preview text added: `Your account is ready — here's how to get rolling.` (was empty, wasted inbox real estate; Gmail was duplicating the subject line).
  2. New first paragraph: `You signed up at phasewise.io. Your account is ready!` — quiet "expected mail" reassurance signal that helps Gmail's spam engine treat the message as wanted. Demoted to body text after first version rendered as H1 above another H1.
  3. The "replaces the spreadsheets, time trackers, and billing tools" line was flagged as a minor Bayesian-filter risk but Kevin elected to keep it for now. Worth circling back during a future template pass.
- **Outreach reply playbook drafted** — new file at repo root: `OUTREACH-REPLY-PLAYBOOK.private.md` (gitignored via `*.private.md`). Six pre-written reply templates covering the most common cold-email response patterns:
  1. "Tell me more / interested" (most important — drop everything to respond)
  2. "How are you different from Monograph?" (with swap-in copy for BQE / Deltek / Harvest+QBO)
  3. "Not now / not a priority" (polite close, 6-month follow-up rule)
  4. "What does it cost?" (direct pricing)
  5. "Who's behind this?" (anonymity disclosure with allowed/forbidden phrases)
  6. "Wrong person — talk to X" (referral handoff with fresh first-touch template)
  Plus voice rules at top (anonymous brand, "we" not "I", short, no marketing fluff, reply within 4 business hours), a triage table at the bottom, and a "never reply with" list. Sister file to `OUTREACH-DRAFTS.private.md`. Replies from Broussard + Atlas Lab cold sends (2026-04-29) are due any day; this preempts the scramble.

### Strategic conversation: outreach automation

Kevin asked: can the prospect-list + outreach + reply loop be fully automated?

Honest map laid out. **Tier-1 automation worth doing now (Hunter.io for verified emails, Gmail filter for reply triage, n8n classification of incoming replies, sequencing tool for follow-ups only)**. Tier-2 (full Apollo + Smartlead stack) waits until first 3-5 paying customers. Tier-3 (multi-mailbox, AI-suggested reply drafts) waits until ~25 customers. **Never automate**: the first reply to a hot lead, anything that touches the anonymity disclosure (one AI hallucination there and the brand is done).

Recommendation accepted: don't try full automation yet. The LA firm market is too tight + connected (NAICS 541320 has ~1-2K active firms in CA), and the first 3-5 customers need founder-touch to become reference customers. **Hunter.io is the one cheap Tier-1 win to start now.** Deferred to Monday 2026-05-11 because today's a Saturday and it benefits from a clear-headed setup block.

### Tomorrow / Monday morning (2026-05-11) — top of the list

**🚨 #1: Hunter.io free tier signup** (~10 min). Goal: kill 80% of the prospect-research grunt work. Sign up at hunter.io with `kevin@phasewise.io`, claim the free 50 lookups/month, install the Chrome extension for one-click email-finding on firm websites. After Monday, every new prospect added to `PROSPECTS.md` should pull a verified email from Hunter rather than guessing `info@` / `studio@`.

**#2: First cold-outreach reply lane open.** Replies from Broussard (2026-04-29) and Atlas Lab (2026-04-29) are now 12 days out. If silence continues through Monday, fire follow-up #1 per `OUTREACH-PLAYBOOK.md` cadence. If anything lands, **use the reply playbook templates** at `OUTREACH-REPLY-PLAYBOOK.private.md` — don't compose from scratch.

**#3: Maintain 5/week cold-outreach cadence.** Three Tier-A drafts already prepared in `OUTREACH-DRAFTS.private.md` (attention2 in San Diego, designlab 252 in Fresno, Mantle in Berkeley) plus runway for more. Send Mon/Tue/Wed/Thu mornings, not Friday afternoons.

### Tomorrow's options (anything past the top three)

4. **AdminBillingClient further refactor.** Today's commit dropped it from 1,662 → 1,276 lines but more is possible (the New Invoice form is still ~400 lines and could come out as `<NewInvoiceForm>`).
5. **Help center expansion.** Yesterday shipped 6 starter articles. Add 4-6 more covering: timesheet approval workflow, leave & PTO setup, MWELO calculator end-to-end, work plan basics, project status workflow, Stripe Connect troubleshooting.
6. **Stripe Connect production smoke test.** Click Connect Stripe on `/settings/payments` against your real bank info to verify the live-mode flow end-to-end. Worth doing once you have a real client to invoice with the Pay-now flow.
7. **G2 Digital Markets resubmission.** Listing was rejected 2026-05-07 with boilerplate copy. Auto-reply promised feedback within 72 business hours; check inbox for specifics on which guideline failed, then resubmit.

---

## Where We Left Off (2026-05-08 EOD)

**Status: 🟢🟢 Massive day. 7 commits + Stripe live activation + ops fixes.** Today closed out the entire Stripe Connect arc (live mode + Stage D notification email), shipped a long-overdue UX cleanup (modal sweep + Apply Schedule Phase 2), ran a forensic audit and shipped its three Critical fixes, fixed an SEO duplicate-canonical issue (Cloudflare redirect on getphasewise.com), and diagnosed a real welcome-email-to-spam incident with a concrete remediation plan. G2 listing resubmission email sent (auto-reply: 72 business-hour SLA).

### Commits in order (7 today)

1. `eb2a736` — **CLAUDE.md: live mode Stripe Connect activated.** Walked through Stripe's Setup guide gauntlet (Branding, Recurring payments, Payments, Invoices, Identity verification, Integration choices). Identity verification cleared during the session, faster than the 1-3 day estimate. New live `ca_UToajG1MuupX5KEuOomDqIthflRaCNr8` + `whsec_***` set on Vercel Production-only. Live Connect webhook scoped to **Connected accounts** at `https://phasewise.io/api/stripe/connect/webhook` (took 2 tries — first attempt got Your-account scope wrong, deleted + recreated). Stripe profile + Tax registration deliberately skipped (residential address exposure, no actual seller's permits respectively). Database hygiene: disconnected leftover sandbox `acct_1TU...tiJc` from Gallo Designs org row.
2. `37a97e9` — **Stripe Connect Stage D: payment-received email to firm OWNERs.** When a client pays via Pay-now, the webhook now sends a notification email to every active OWNER on the org. Vars: `recipientName`, `firmName`, `clientName`, `projectName`, `invoiceNumber`, `amountPaid`, `paymentMethod`, `paidDate`. Fire-and-forget via `Promise.allSettled` — Loops failures NEVER make the webhook return non-200 (would cause Stripe to retry + dedup-swallow). Skips silently when `LOOPS_TEMPLATE_PAYMENT_RECEIVED` isn't set.
3. `c3b7e95` — **CLAUDE.md: payment-received Loops template ID.** Template `cmox8srpe009l0ixf1il6gfsg` published in Loops dashboard, set on Vercel All Environments + local `.env`. Stripe-receipt-style summary block (Amount / Method / Date), green CTA button to `/admin/billing`.
4. `c60c54b` — **Send-invoice modal copy fix.** Default placeholder said "invoice for last month is attached" — leftover from before the 2026-05-04 Path-B link migration. Updated to "your invoice is ready for review. Click the link in the email to view, download, or pay online."
5. `c4e5e5d` — **Modal sweep: replace native `confirm`/`alert` with branded React modal.** New `components/confirm-provider.tsx` mounts a single shared modal in the (app) layout. `useConfirm()` hook returns async function returning Promise<bool>. Options: title, message, confirmText, cancelText, destructive (rose-600), hideCancel (info-only). Keyboard support (Escape cancels, Enter confirms). 13 files changed, 14 call sites converted. All destructive actions get danger styling. Killed the visually-jarring "phasewise.io says" browser-native dialogs across the app.
6. `bf08dbb` — **Apply Schedule Phase 2: standalone editor UI for weekly template.** New `ScheduleTemplateEditor.tsx` modal — table with project + phase dropdowns, 7 hour inputs (Mon-Sun) per row, day totals + weekly total in footer, per-row totals, add/delete row. "Edit template" button on the timesheet header next to "Save week as schedule" / "Apply schedule". New `update-template` API action validates each row's projectId + phaseId belong to user's org (defense against cross-tenant pollution), validates per-day hours 0-24, drops zero-total rows. Empty templates clear the saved schedule entirely. Same template shape as Phase 1's saveWeekAsTemplate, so apply-template keeps working unchanged.
7. `e968112` — **Audit fixes: error boundary, work-plan load error, cron firmName.** Three Critical-tier items from today's forensic audit. **(a)** New `(app)/error.tsx` per-segment React error boundary — without it, any uncaught render error in `/admin/billing` etc. fell through to the top-level `global-error.tsx` and replaced the ENTIRE app shell with a bare error page. Now keeps sidebar visible + offers Try-again / Back-to-Dashboard. Sentry capture wired with `boundary: app-segment` tag. **(b)** WorkPlanEditor's silent swallow-and-render-empty pattern fixed — previous `.catch()` initialized empty staff arrays on fetch failure; user clicking Save would have overwritten real plan with all-zero rows. Now flips a `loadError` state that surfaces a rose banner ("Couldn't load existing Work Plan — refresh before editing") AND disables all three Save buttons. Also catches non-OK responses (previously only caught network errors). **(c)** Cron submittal-reminders had a brittle PAYMENT_FAILED fallback when `LOOPS_TEMPLATE_SUBMITTAL_REMINDER` was unset — stuffed the entire submittal prose into PAYMENT_FAILED's `firmName` merge variable, rendering garbled "Hi {recipient}, {prose}" emails. Now skips silently with a `console.warn` instead.

### Plus dashboard work (no commits)

- **Stripe live mode activation** — full Setup guide walkthrough (yesterday's gated work cleared today)
- **Branding upload** to Stripe — Phasewise green palette + wordmark logo + phase-bars icon. PNG generated via Sharp from `brand_v2/phasewise-logo-primary.svg` (Stripe rejected SVG for the Logo field but accepted it for the Icon field).
- **Cloudflare Single Redirect** for `getphasewise.com` → `https://phasewise.io` with path preservation, 301 status. Created proxied A record (192.0.2.1 documentation IP) + www CNAME, both with orange-cloud proxy ON. Verified all three URL variants redirect correctly. **Closes the "Duplicate without user-selected canonical" Search Console issue for phasewise.io.**
- **G2 Digital Markets resubmission email sent** to `listings@g2digitalmarkets.com` requesting specific feedback on yesterday's rejection. Auto-reply: response within 72 business hours.

### Operational diagnoses (issues surfaced + remediation plans)

**Welcome email going to spam.** Brian (Kevin's friend testing the signup flow) got "Welcome to Phasewise, Brian." in Gmail spam with the "similar to messages identified as spam in the past" warning. DNS setup is correct (SPF, DKIM, DMARC all in place from the original Loops setup). Issue is **domain reputation**, not config. Remediation:

1. **Brian marks "Not spam"** — strongest individual signal, worth weeks of organic warmup.
2. **Sign up for Google Postmaster Tools** (`postmaster.google.com`) to monitor reputation, spam rate, authentication results. Free, 5 min.
3. **Audit Welcome template** for spam-trigger patterns (excessive CTAs, ALL CAPS, "free"/"guaranteed"/"act now" phrasing).
4. **Tighten DMARC over time** — currently `p=none`, leave for 2-3 more weeks while monitoring Postmaster, then upgrade gradually to `p=quarantine` with `pct=10` → `pct=50` → `pct=100`.
5. **Don't switch sending providers** — Loops is fine. The issue is domain age + low send volume, not their infrastructure.

Realistic timeline: 1-2 weeks of consistent sending + recipient engagement to lift out of spam-by-default.

**Google Search Console indexing.** 11 indexed, 9 not indexed across 4 reasons. Today's work fixed the most actionable one ("Duplicate without user-selected canonical" — getphasewise.com redirect). Remaining issues:
- **Page with redirect (1 page)** — likely a sitemap entry that points to a redirect target. Click into the report on Search Console to identify, then fix the source.
- **Discovered - currently not indexed (6 pages)** — normal for new sites with low authority. Resolves over time as the n8n weekly content pipeline keeps shipping articles + internal linking improves.
- **Crawled - currently not indexed (1 page)** — quality/uniqueness signal. Click into the URL on Search Console; if it's a low-value page (privacy, terms) it's expected. If a blog post, the article needs more depth.

### Forensic audit findings — what's still on the punch list

Three Critical items shipped this evening (commit `e968112`). Remaining items, prioritized:

**Worth fixing this sprint:**
- **AdminBillingClient.tsx is 1,662 lines** — refactor into `<NewInvoiceForm>` + `<PaymentUpdateModal>` + `<SendInvoiceModal>` siblings. Will become unmaintainable if not done before next round of billing features. ~1-2 hr.
- **Stripe webhook untyped casts** at `lib/stripe.ts` and `webhook/route.ts` lines 102/106/168/218/223. Bypasses Stripe's typed event union to read `previous_attributes` and `current_period_end`. Breaks silently if Stripe API version drifts. Pin via Zod schema or typed event expander. ~30 min.
- **Leave policy `as unknown as Prisma.InputJsonValue` casts** at `api/leave/policy/route.ts:78,91,97`. Drifted request body silently persists garbage. Add Zod schema. ~20 min.
- **`console.log` in `lib/budget-alerts.ts:121`** — wrap in `process.env.NODE_ENV !== "production"` guard or remove. Will flood Vercel logs at scale.
- **`PricingButton.tsx:49` `console.error`** on public landing — replace with `Sentry.captureException` since Sentry is wired.

**Strategic gaps (won't break, but matter for first customers):**
- No customer-facing help / support surface. No `/help` route, no in-app support widget. `kevin@phasewise.io` is the only support channel and it's not advertised inside the app.
- No in-app onboarding tour for first-time users (the 3-step checklist exists but is shallow).
- No status page / uptime communication.
- Account deletion flow may not exist (GDPR/CCPA — verify).

### Tomorrow's options

1. **AdminBillingClient refactor** — preempts unmaintainability before more billing features land. Top of the audit's "worth fixing this sprint" list.
2. **`/help` index + sidebar Help link** — cheapest customer-facing trust signal you can ship. ~1 hr.
3. **Stripe webhook + Leave policy Zod schemas** — kills the typed-cast risks. ~50 min combined.
4. **First real Stripe Connect onboarding** — click Connect Stripe on production `/settings/payments`, complete real Express onboarding against your real personal/business info. Worth doing if you want to use Phasewise to invoice your own clients with Pay-now flows.
5. **Cold-email outreach** — n8n content is autonomous but cold email isn't. Wishlist flag: skip-2-weeks is the most common solo-founder failure mode. Make sure the 5/week cadence is going.
6. **Customer acquisition focus** — the audit's bottom line: Phasewise is technically ready, the build has outpaced demand. Time to focus today's free hours on customer acquisition, not more features.

---

## Where We Left Off (2026-05-07 EOD — manual session)

**Status: 🟢🟢 Marathon day — picked up where the morning's autonomous session left off. 7 more commits, full E2E test of Stripe Connect on local sandbox, Account Links rewrite (Stripe gates Express OAuth for new platforms), Nudge-to-submit feature shipped, and four bug fixes caught while clicking through the new flows.** Live mode Stripe Connect activation deferred — Stripe's wizard gates it behind unrelated platform setup (Tax registration, Recurring payments, Invoices wizard). No urgency since we have no current users.

### Commits in order (7 today, on top of morning's 6)

7. `dd97ab5` — **Stripe Connect: switch to Express OAuth endpoint.** Caught after the legacy `/oauth/authorize` URL returned "Cannot onboard via express oauth due to gated access." (Later replaced — see #8.)
8. `9f69454` — **Stripe Connect: rewrite OAuth → Account Links API.** Sandbox onboarding still failed with the gated-access error. Stripe deprecated Express OAuth for platforms created post-2024. Modern flow is `stripe.accounts.create({type: "express"})` + `stripe.accountLinks.create()`. Three route rewrites:
   - `/api/stripe/connect/start`: creates an Express account (storing `acct_*` on org so onboarding can resume), then mints a one-shot AccountLink and redirects to Stripe's hosted onboarding.
   - `/api/stripe/connect/callback`: no more code exchange. Refetches the stored account, updates `chargesEnabled`, stamps `connectedAt` first time charges go live.
   - `/api/stripe/connect/disconnect`: drops `stripe.oauth.deauthorize()` (only valid for OAuth). Just clears local fields.
   - The Stripe dashboard's OAuth redirect-URI whitelist is no longer load-bearing but harmless to leave in place.
9. `8523312` — **Billing + invoice viewer polish.** Three small but meaningful fixes:
   - `/admin/billing`: status badge now has a date chip beneath it. PAID → "on May 7, 2026" (paidDate). SENT → "sent May 7" (sentAt). DRAFT/OVERDUE/VOID stay clean.
   - `/invoice/[token]`: fix Balance Due showing the full total instead of $0 when paid in full. Math was `balanceDue > 0 ? balanceDue : total` which falls through to `total` when balance is exactly 0. Now uses `Math.max(0, balanceDue)`.
   - `/settings/payments`: "Continue verification" button when `chargesEnabled = false`. Sends user back through `/api/stripe/connect/start` which mints a fresh AccountLink for the existing `acct_*`. Closes the UX dead-end where incomplete onboarding had no recovery path.
10. `4672f76` — **Invoice timesheet warning: split DRAFT vs SUBMITTED.** Old copy said "X timesheets aren't approved yet" with a single "Review pending timesheets" link. Misleading — DRAFT rows can't be approved (the staff member hasn't submitted yet). New copy splits the count: "Y not yet submitted by their owner — ask them to submit..." vs "Z waiting for your review at /time/approve...".
11. `5b14152` — **Invoice timesheet preview: fix week-start anchor + UTC drift (attempt 1).** Discovered the warning was firing for already-approved timesheets. Root cause: `weekStartOf` used Monday-anchored + `setHours(0,0,0,0)` (local midnight). But `WeeklyTimesheet.weekStart` is `@db.Date` (UTC midnight). 7-8 hour drift in Pacific killed every join. First attempt mistakenly anchored Sunday.
12. `abaa911` — **Invoice timesheet warning: Monday anchor + UTC display (correct fix).** Approver History clearly shows Monday-Sunday weeks ("Mar 30 – Apr 5"). Fixed `weekStartOf` to compute Monday in UTC. Also fixed display TZ shift: `new Date("2026-04-06").toLocaleDateString()` in Pacific renders as "Apr 5" because JS parses bare ISO date strings as UTC midnight. Added `timeZone: "UTC"` to the formatter.
13. `79565b8` — **Nudge to submit: one-click reminder for unsubmitted timesheets.** Closes the operator workflow on New Invoice form. New `POST /api/timesheets/nudge` validates org + role (OWNER/ADMIN/SUPERVISOR), sends Loops email with `recipientName`, `senderName`, `firmName`, `weekLabel`, `timesheetUrl`. Email deep-links to `/time?week=YYYY-MM-DD`. UI: "Nudge to submit" button next to each DRAFT warning row. Inline state per row keyed on `userId|weekStart`. Sticky "✓ Nudge sent" after success. New `LOOPS_TEMPLATE_TIMESHEET_NUDGE` env var (`cmovy41sk00uk0iykpd580404`) — set on All Environments. No cooldown / dedup yet.

### Stripe Connect — what's live RIGHT NOW vs deferred

**Live in Production for ALL users (auto-deployed via main):**
- All Account Links code paths (`/api/stripe/connect/{start,callback,disconnect,webhook}`)
- `/settings/payments` page (renders gracefully without env vars — shows setup-required warning)
- Pay-now button on public invoice viewer (renders only when invoice has a `stripePaymentLinkUrl`)
- All today's bug fixes (date chip, balance fix, warning split, week-start anchor, Nudge feature)
- Loops Nudge template — fully working in Production (template ID set on All Environments)

**Sandbox-only (NOT live for real customers):**
- `STRIPE_CONNECT_CLIENT_ID` (`ca_UTQgVeNXhh4n9v7KYC659NttqsHufaZO`) — Pre-Production only
- `STRIPE_CONNECT_WEBHOOK_SECRET` (`whsec_GYSI...`) — Pre-Production only
- Production env vars for live mode are **NOT SET**. A real user visiting https://phasewise.io/settings/payments will see the setup-required warning.

**Why live activation was deferred:** Stripe's live-mode Connect setup wizard gates activation behind completing the entire Setup guide — Tax registration ($/per-transaction fees), Recurring payments wizard (irrelevant to our model), Invoices wizard, Stripe profile (would expose Kevin's residential address publicly), and "Go live" review. None of these are technically required for Connect to function, but Stripe blocks the OAuth client ID and webhook setup until they're done. Decided to defer rather than fill placeholder data dishonestly. No urgency since we have no current customers — can revisit when there's a real first user lined up.

### Today's full E2E test (sandbox, on localhost)

Verified working end-to-end:
1. ✅ `/settings/payments` → Connect Stripe button → Account Links onboarding (after rewrite)
2. ✅ Express account onboarding (filled with test data; needed `000000000` SSN test value to clear Stripe identity verification)
3. ✅ Charges enabled in sandbox
4. ✅ Send invoice → Stripe Payment Link auto-created on connected account
5. ✅ Loops email arrived with both Pay-now (Stripe purple) and View & Download (black) buttons
6. ✅ Test card `4242 4242 4242 4242` paid through Stripe Checkout
7. ✅ Webhook fired (`stripe listen --forward-connect-to localhost:3000/api/stripe/connect/webhook`)
8. ✅ Invoice auto-flipped to PAID with `paidAmount`, `paymentMethod`, `paymentReference` populated
9. ✅ Idempotency dedup confirmed (Stripe retried; `ProcessedStripeEvent` constraint caught it)

### Bonus catches worth remembering

- The **timesheet preview week-start bug** had been silently broken since day one. Any firm that ever used "Pull from timesheets" would have seen ghost warnings urging them to chase already-approved timesheets — eroding trust in the warning system specifically.
- **Stripe deprecated Express OAuth** for platforms created post-2024. The error message ("Cannot onboard via express oauth due to gated access") is the only surface signal. Worth documenting for any future Connect work.
- The **display TZ shift** affecting "Week of {date}" rendering was a JS Date-parsing gotcha — bare ISO date strings are parsed as UTC midnight, then `toLocaleDateString` shifts to local. Fix was `timeZone: "UTC"`.

### Operational reminders for tomorrow

**Stripe CLI session:** auth expires in 90 days from 2026-05-07. CLI alias is per-session — to use `stripe` again, run:

```powershell
Set-Alias -Name stripe -Value "C:\Users\Gallo Beelink 1\AppData\Local\Microsoft\WinGet\Packages\Stripe.StripeCli_Microsoft.Winget.Source_8wekyb3d8bbwe\stripe.exe"
```

To resume webhook forwarding for sandbox testing:

```powershell
stripe listen --events checkout.session.completed --forward-connect-to localhost:3000/api/stripe/connect/webhook
```

Webhook signing secret is deterministic per CLI auth — `whsec_b5db53101f3a183941196188fef3a4163837ca8a7086c014d7cc729cc5c7684c` (already in local `.env`). PATH still not permanently fixed.

**Stripe sandbox redirects:** OAuth redirect URI whitelist now includes BOTH `https://phasewise.io/api/stripe/connect/callback` AND `http://localhost:3000/api/stripe/connect/callback`. Account Links don't actually use the whitelist, but it's harmless to keep.

**G2 Digital Markets rejection:** listing was rejected today with the boilerplate "doesn't currently meet our Product Listing Guidelines" — no specific reason given. Action: click the "Contact Us" link in the rejection email and ask which guideline specifically failed. Fix and resubmit when known.

### Tomorrow's options

**1. Live mode Stripe Connect activation (continued).** If you want to push through Stripe's setup wizard, plan to:
- Register a CA tax registration with placeholder info (or skip if Stripe Tax has a "monitoring only" option)
- Walk through the recurring payments wizard with Phasewise's existing $99/$199/$349 tiers
- Skip the Stripe profile (would expose residential address — defer until PO Box / virtual mailbox in place)
- Hit "Go live" — may trigger 1-3 business day Stripe review of the Connect platform

**2. Loops "payment received" template (Stage D polish).** Mirror today's Nudge template work. Vars: `firmOwnerName`, `firmName`, `clientName`, `invoiceNumber`, `amountPaid`, `paymentMethod`, `paidDate`. Sent to firm OWNER when their connected account receives a payment. Add `LOOPS_TEMPLATE_PAYMENT_RECEIVED` env var, extend `/api/stripe/connect/webhook` to fire it after the PAID flip.

**3. Modal sweep.** Replace remaining `confirm()` / `prompt()` / `alert()` calls site-wide with branded React modals. ~9 files, ~1-2 hr.

**4. Apply Schedule Phase 2.** Standalone editor UI for the saved weekly template (vs. current "save current week as template" capture-only flow).

**5. Send-invoice default message copy fix.** Modal default still says "is attached" but the new flow sends a link. 1-line fix: `Hi — invoice for last month is ready for review.`

**6. Forensic audit.** Top-to-bottom feature review.

Recommended order: #2 (Loops payment-received) since it's the natural completion of Stripe Connect work and uses the same Loops template-creation muscle memory you exercised today with Nudge. Then any of the others as time permits.

---

## Where We Left Off (2026-05-07 — autonomous morning session)

**Status: 🟢 Autonomous solo session — 5 commits shipped covering the entire Stripe Connect arc + the last two leave-rollover follow-ups. Kevin was AFK; the queue was bounded to "things that don't need user input or external dashboard access."** Today closed out 4 of the 6 items on yesterday's "deferred / wishlist" list.

### Commits in order (5 total)

1. `0a61249` — **Per-firm "Skip printing bank details on invoice" toggle.** `Organization.printPaymentDetailsOnInvoice Boolean @default(true)`. Toggle on `/settings/billing-info` collapses the four bank-details `<details>` sections when off. Server-side gate in `lib/invoice-pdf.tsx` and the public viewer's `hasRemit` check both honor the boolean. Default keeps existing behavior (industry standard for B2B).
2. `d414d14` — **Per-user accrued-leave override.** Override modal extended from 2-field to 6-field (Type/Mode/Annual/Monthly/Cap/Rollover) matching the firm-wide table. Modal widened to `max-w-3xl`.
3. `95c4f48` — **Stripe Connect Stage A: OAuth onboarding.** `/settings/payments` page (3 states: setup-required / not-connected / connected). `/api/stripe/connect/{start,callback,disconnect}`. Schema: `Organization.stripeConnectedAccountId @unique` + `stripeConnectChargesEnabled` + `stripeConnectConnectedAt`. State param verified against `currentUser.organizationId` — prevents cross-firm OAuth completion. Disconnect best-effort deauth + always clears local fields so a detached Stripe account can't show as Connected.
4. `cc1a05d` — **Stripe Connect Stage B: Payment Links on send.** `lib/stripe-payment-link.ts` calls `stripe.paymentLinks.create` with `{ stripeAccount: connectedAccountId }`. `/api/invoices/[id]/send` lazily creates a link on first send when Connect is onboarded + charges_enabled + balance > 0. Stored on `Invoice.stripePaymentLinkId`/`stripePaymentLinkUrl`. Public viewer renders Stripe-purple "Pay $X now →" button. Loops `INVOICE_SEND` template gets `{{ payNowUrl }}` (blank-safe single space when Connect isn't wired). Failures non-fatal — email still sends.
5. `376139e` — **Stripe Connect Stage C: webhook auto-marks paid.** New `/api/stripe/connect/webhook` endpoint with separate `STRIPE_CONNECT_WEBHOOK_SECRET`. Listens for `checkout.session.completed`, reads `metadata.phasewiseInvoiceId`, flips invoice to PAID with paidDate + paidAmount + paymentMethod ("Stripe (card, ...)") + paymentReference (PaymentIntent ID). Defense-in-depth: rejects updates when event's `connected_account_id` doesn't match the invoice's org. Shares `ProcessedStripeEvent` table with platform webhook for idempotency. Skips when `payment_status != "paid"` (handles async ACH). `proxy.ts` matcher + CSRF_BYPASS updated.
6. `d831e5e` — **Year-end leave rollover.** `computeUserLeaveBalances` pulls `[prevYearStart, yearEnd)` in one query, buckets by year, adds `min(remainingPrev, rolloverCap)` to this year's available pool. New `LeaveBalance.carryoverHours` surfaced as "+Xh carried over" on admin leave + timesheet widget. `rolloverCap=0` use-it-or-lose-it, `>0` clamps, `-1` unlimited. New Year's Day flips and the rollover computes itself off prior-year actual usage.

### Schema changes pushed to Supabase

- `Organization.printPaymentDetailsOnInvoice Boolean @default(true)`
- `Organization.stripeConnectedAccountId String? @unique` + `stripeConnectChargesEnabled Boolean @default(false)` + `stripeConnectConnectedAt DateTime?`
- `Invoice.stripePaymentLinkId String?` + `stripePaymentLinkUrl String?` (additive nullable, safe)

### To activate Stripe Connect (manual steps Kevin needs to do)

The code is shipped + safe to deploy — without env vars it just shows setup instructions on `/settings/payments`. To turn it on:

1. **Stripe Dashboard → Connect → Settings**: enable Connect, choose **Express** as the account type. Copy the OAuth client ID (starts with `ca_`).
2. **Vercel env vars** (Production + Preview): set `STRIPE_CONNECT_CLIENT_ID=ca_...`.
3. **Stripe Dashboard → Connect → Settings → Integration**: add redirect URI `https://phasewise.io/api/stripe/connect/callback`.
4. **Stripe Dashboard → Workbench → Webhooks → Connect endpoints**: create new endpoint at `https://phasewise.io/api/stripe/connect/webhook` listening to `checkout.session.completed`. Copy its signing secret (`whsec_...`).
5. **Vercel env vars**: set `STRIPE_CONNECT_WEBHOOK_SECRET=whsec_...`.
6. **Loops `INVOICE_SEND` template**: add a "Pay this invoice online →" button bound to `{{ payNowUrl }}`. Render conditionally above the existing "View & Download" link.
7. Redeploy. Kevin (or any OWNER/ADMIN) visits `/settings/payments` and clicks Connect to onboard the firm's own Stripe account. From that point forward, every invoice send creates a Payment Link, every paid Payment Link auto-flips the invoice to PAID via webhook.

### Items NOT shipped today (the queue I ruled out as needing Kevin)

- **Loops "payment received" confirmation email** to the firm — needs a new template ID + dashboard work. Stage D polish; the webhook flips PAID either way.
- **Apply Schedule Phase 2** standalone editor UI — meaningful UX work; better with Kevin's input on form vs modal.
- **Modal sweep** for remaining `confirm()` / `prompt()` / `alert()` usage — visual decision; better with Kevin's review of which ones bother him most.

### Tomorrow's task

**End-to-end test the full Stripe Connect flow** once env vars are live:
1. Visit `/settings/payments` → Connect button now enabled. Click → Stripe Express onboarding → complete with bank details.
2. Verify status panel reads "Connected · Charges enabled · acct_..." after onboarding.
3. From `/admin/billing`, send a test invoice. Confirm Loops email arrives with both **View & Download** and **Pay now →** buttons.
4. Click Pay-now in the email, complete checkout in Stripe with a test card (`4242 4242 4242 4242`).
5. Stripe redirects back to `/invoice/[token]?paid=1` showing the "Payment received" banner.
6. Webhook should auto-flip the invoice to PAID within seconds. Verify on `/admin/billing` that paidAmount, paymentMethod, paymentReference all populated.
7. Click Disconnect in `/settings/payments` to verify the deauth flow.

After that's green, the only major outstanding work is the Loops "payment received" template + the Apply Schedule Phase 2 editor + the modal sweep — all polish, not blockers.

---

## Where We Left Off (2026-05-05)

**Status: 🟢 Verification day — all 10 checklist items from yesterday's EOD verified end-to-end. 9 commits, every one a real bug fix or polish improvement caught while clicking through the flows.** Push to production at start of session pushed yesterday's 22 commits live; this morning's 9 went up incrementally as caught.

### Verification checklist results (10 of 10 complete)

| Item | Verified | Issues found and fixed |
|---|---|---|
| 1. Billing info | ✅ | Page page now redirects non-OWNER/ADMIN; GET API gates billing fields by role; security disclosure block added; tradeoff note re: printing bank details on invoices; BTTF placeholders replacing personal info; new `Organization.billingInfoUpdatedAt` field stamped only when billing fields change; "Last saved" timestamp surfaced |
| 2. Send-to-client | ✅ | Loops template `{{#if}}` blocks were misparsed as merge variables — Kevin manually rebuilt the template with single-brace placeholders + the var picker; my API patched to send single-space fallback for empty optional vars (Loops 400s on empty strings). Public viewer's `viewedAt` update was a fire-and-forget — switched to awaited so it actually persists |
| 3. Auto-invoicing UX surfacing | ✅ | "Next run" date was off by one in Pacific — server-side `new Date(year, month, 5)` on UTC Vercel rendered as previous day in Pacific. Pre-formatted the date as a string server-side. |
| 4. Approver History | ✅ | Timesheet grid showed empty cells (or wrong rows from a different week) when navigating to past weeks. Same useState-from-prop bug class as yesterday's TimesheetSubmitClient fix. Added `useEffect` keyed on `weekStart` to re-sync `rows` + `entries` |
| 5. Sidebar badges | ✅ | Empty state confirmed; populated state confirmed organically when Kevin's submitted week put a "1" badge on Time Sheets |
| 6. Admin timesheet rollup | ✅ | — |
| 7. Backup supervisor | ✅ | — |
| 8. My Schedule | ✅ | Added collapsible `<details>` blocks per Kevin's request — projects collapse to header-only when there are many to scan |
| 9. Apply Schedule | ✅ | Save + apply both verified via DB. Future-week submit-gate (shipped 2026-04-30) caught Kevin during the test — working as designed |
| 10. Accrued leave | ✅ | Added auto-sync between Annual hours and Monthly accrual (type one, the other updates) per Kevin's request |

### Bonus fixes / polish landed today

- Phone inputs across team / client / profile now format as you type (`5591234567` → `(559) 123-4567`)
- All 6 schema fields persisted to Supabase (no migrations needed beyond `Organization.billingInfoUpdatedAt`)

### Commits in order (9 total)

1. `923b381` — Billing info: role-gated GET, security disclosure, last-saved timestamp
2. `8391c0e` — Send invoice: blank-safe Loops merge variables
3. `e634cd0` — Public invoice viewer: await viewedAt update so it persists
4. `ecbc8c6` — Auto-invoicing panel: pre-format next-run date server-side
5. `22bdc0c` — Timesheet: sync rows + entries when navigating between weeks
6. `58da69b` — Phone inputs: progressive formatting on every keystroke
7. `3a429b1` — My Schedule: project cards collapsible
8. `f89ba4e` — Leave admin: auto-sync Annual ↔ Monthly accrual

### Schema changes pushed to Supabase

- `Organization.billingInfoUpdatedAt` (DateTime?, nullable) — stamped only when billing fields change

### Manual change Kevin did

Loops Invoice Send template body — replaced the `{{#if}}` conditionals with bare `{{ variableName }}` references using the variable picker. Saved + republished. Verified working with a real send test.

### Next session

**Tomorrow's first task: Stripe Connect / Payment Links integration.** Last big remaining feature from the 28-item triage list. Three natural stages:

- **Stage A** (~2h): Stripe Connect onboarding (`/settings/payments`, OAuth, store account ID on `Organization`)
- **Stage B** (~2h): Payment Link creation at invoice creation + "Pay now" button on `/invoice/[token]`
- **Stage C** (~1h): Stripe webhook handler for `checkout.session.completed` → auto-mark invoice PAID + record `paymentReference` from session ID

Each stage is meaningful alone. Stage A unblocks B unblocks C.

Decisions to confirm at Stage A:
- Connect type: **Express** (lightest, 5-10 min onboarding for the firm if they have bank info handy)
- Fee model v1: **firm absorbs** (2.9% + 30¢ card / 0.8% capped at $5 ACH). Surcharge optional later.
- Card vs ACH: **ACH-default, cards optional** if Stripe Payment Links supports the toggle
- Live mode from day one (each firm onboards their own real bank account)

Other items still on the deferred / wishlist list (none blocking):
- Per-firm "Skip printing bank details on invoice" toggle (Kevin asked) — natural fit alongside Stripe Payment Links since the Pay-now button is the privacy-preserving alternative
- Per-user override editor for accrued-leave fields (org-default works; per-user shape still uses legacy 2-field UI)
- Apply Schedule Phase 2 — separate template editor UI for tweaking without re-saving from a real week
- Year-end leave rollover automation

---

## Where We Left Off (2026-05-04 — final EOD)

**Status: 🟢🟢🟢🟢 Historic day — 21 commits, 25 items shipped from the 28-item smoke-test triage list.** Morning was discovery (smoke test of 4 major flows, 28 items found). Afternoon + evening were execution. **Every wishlist item is now shipped except Stripe Payment Links** — deferred to a fresh session because it requires Stripe Connect (multi-tenant payment routing), which is real 1-2 day scope. The platform is now genuinely cohesive end-to-end across every workflow we tested.

### Commits in order (21 total)

1. `bad981a` — Invoice timesheet preview: warn on non-approved hours (P0 #2)
2. `bd8a3a9` — Timesheet UX bugs: refresh on submit + week-state sync + TZ-safe day grid (P2 #9, #10, #11)
3. `e707e06` — Smoke test polish: invoice toggle re-pull, MWELO re-link, casing, naming (P2 #12, #13, P3 #16, #18, #19, #20)
4. `cbea6ae` — Send-to-client Path B: public invoice link replaces PDF attachment (P0 #1 partial)
5. `7bfa968` — Auto-invoicing UX: status panel + quick-period presets (P0 #3 partial)
6. `8544ff9` — PDF maxDuration + phone format helper (P2 #14, P3 #17)
7. `852821b` — Approver page: add Pending/History tab with audit trail (P1 #6)
8. `e919d96` — Dashboard: drafts-ready-to-review banner for owners/admins (P0 #3 follow-up)
9. `f21b76e` — Invoice header: Remit-to + Fed ID block (Stage 1) (P1 #4 stage 1)
10. `c8fb0b1` — Per-project billing cadence + contract number on invoice (P0 #3 follow-up + P1 #4 stage 2)
11. `d5d46f9` — Sidebar nav badges: surface what needs attention without leaving (P1 #8)
12. `578948c` — Admin: timesheet rollup dashboard (P1 #7)
13. `d366048` — Invoice header: Attn line from linked Client.contactPerson (P1 #4 stage 2 finish)
14. `6dee87f` — Send invoice: replace browser prompts with proper modal (P3 #15)
15. `a6d1969` — CLAUDE.md: 2026-05-04 EOD — 15 commits, 20 items closed (docs)
16. `6bec9bb` — Backup supervisor: vacation cover for timesheet approvals (P3 #23)
17. `bea53d9` — My Schedule: staff-side read-only view of phase assignments (P3 #24)
18. `f572e7b` — Dashboard: separate STAFF view from firm-wide view (P3 #25)
19. `641e24c` — Apply Schedule: save week as template, one-click apply to draft week (P3 #21)
20. `65dc445` — Leave: accrued mode (earn it, don't lump-sum it) (P3 #22)

### Schema changes pushed to Supabase

- `Invoice.publicToken` (String?, unique) + `Invoice.viewedAt` (DateTime?) — for the public link viewer
- `Organization.billingMailingAddress`, `billingFedId`, `billingAchRouting`, `billingAchAccount`, `billingWireRouting`, `billingWireAccount` — Remit-to block
- `Project.contractNumber` (String?) — agreement / contract number rendered on invoice
- `Project.billingCadence` (enum MONTHLY/MILESTONE/MANUAL, default MONTHLY) — controls auto-invoicing cron eligibility
- `User.alternateSupervisorId` (Uuid?, FK) — backup approver for vacation cover
- `User.weeklyScheduleTemplate` (Json?) — saved Apply-Schedule template

### Manual steps still pending

- **Loops INVOICE_SEND template** needs body update in the dashboard: replace any attachment reference with a `{{ invoiceUrl }}` button/link. Until done, the email sends but the body has no link.
- **Verify on Vercel** — `db push` was applied to Supabase but Vercel will redeploy on next push to GitHub. The `.next` cache is in sync locally.

### Still on the punch list (one fresh-session item, plus minor follow-ups)

- **P1 #5: Stripe Payment Links integration** — only big item remaining. Requires Stripe Connect (each firm has its own connected account, not Phasewise's). Multi-tenant payments + webhook + auto-mark-paid. Real 1-2 day scope. Cleanest as a fresh-session block of focused work.

**Minor follow-ups carried into the wishlist** (none blocking):
- Per-user override editor for the new accrued-leave fields (org-default works; per-user shape still uses the legacy 2-field UI)
- "Submit invoice in triplicate" public-agency toggle (rare, low priority)
- Apply Schedule Phase 2 — separate template editor UI for tweaking without re-saving from a real week
- Year-end leave rollover automation (currently manual)

### Loops template — manually updated by Kevin during the session ✅

Kevin updated the `INVOICE_SEND` template in the Loops dashboard to use the new `{{ invoiceUrl }}` variable (button + link, no attachment). Preview text updated from "PDF attached" to "Invoice ready for review. Click to view." Republished. Pending: a real Send-to-client test against the new public viewer.

### Tomorrow's first task

**End-to-end test the new flows** that shipped today. Suggested order:

1. **Settings → Phasewise Subscription & Billing info**: visit `/settings/billing-info` and populate Remit-to mailing address + Fed ID + ACH details.
2. **Send-to-client flow**: from `/admin/billing`, click **Send to client** on any invoice. New modal (not prompts). Confirm email arrives with the `View & Download Invoice` button. Open the link → verify the public viewer page renders with Remit-to + Attn + Agreement No. Download PDF and verify the same.
3. **Auto-invoicing surfacing**: visit `/dashboard` (as owner) and `/admin/billing`; see the drafts banner and the auto-invoicing status panel. Set a project's billing cadence to MILESTONE on edit and verify the cron will skip it.
4. **Approver History**: submit a timesheet, approve it, then visit `/time/approve` → click the **History** tab → see the audit row → click Reopen.
5. **Sidebar badges**: confirm the rose badges on Time Sheets / Submittals + the green Admin badge match what's pending.
6. **Admin → Timesheet Rollup**: visit `/admin/timesheets`, see per-staff and per-project breakdown for this and last month.
7. **Backup supervisor**: assign a backup on a team member, verify the alternate can approve their reports.
8. **My Schedule**: visit `/time/my-schedule` (or click the link from the timesheet header) and see your phase assignments with progress bars.
9. **Apply Schedule**: log a typical week, click **Save week as schedule**, then go to a future week and click **Apply schedule** to see it pre-fill.
10. **Accrued leave**: switch a leave type to Accrued mode in `/admin/leave`, set monthlyAccrual + cap, verify staff balances update.

When that's all green, the only remaining major work is **Stripe Payment Links** (Stripe Connect onboarding + Pay-now button + auto-mark-paid webhook). 1-2 day fresh-session block.

---

## Where We Left Off (2026-05-04 — morning)

**Status: 🟢 Big discovery session. Two GitHub admin items closed (2FA + Copilot opt-out). Smoke test verified 4 major flows end-to-end and surfaced 28 bugs/features for triage. Zero commits — entirely a testing + product-discovery day.**

### Closed today

1. **GitHub 2FA enabled** — authenticator app + recovery codes + GitHub Mobile push (3 layers). Beat the 2026-05-23 mandatory deadline by 19 days.
2. **GitHub Copilot AI model training opt-out** — `Settings → Copilot → Privacy → Allow GitHub to use my data for AI model training: Disabled`.

### Smoke test coverage — 4 flows verified end-to-end

- **✅ Timesheet** — entry, auto-save, submit, recall, approve, reopen, send-back-with-comment, edit + re-submit
- **✅ Invoice** — auto-numbered creation, period-based pull from approved timesheets, mark sent, mark paid (proper modal with method + reference), status group transitions (DRAFT → SENT → PAID), stat card math, PDF rendering with PAID badge after marking paid
- **✅ MWELO** — view calc render-back, recompute, branded print PDF, project detail surfacing
- **✅ Projects list** — search, type filter, status filter, inline status dropdown with reactive stat card recomputation, 4-section status grouping (Active / On Hold / Completed / Archived)

### NOT covered (lower priority — visual sweeps for next time)

Submittals, Plants, Reports (Profitability / Team Utilization / Project Detail), Compliance Add-Item-via-MWELO routing, Compliance Show Archived toggle, mobile responsive sweep.

### Triage of 28 items found today

All entries are captured in the **Product Wishlist** section above with full detail. Ordered here by priority:

#### 🚨 P0 — fix this week (revenue + brand-promise)

1. ✅ **Send-to-client: Path B public link** (shipped 2026-05-04, **Stripe Payment Link integration still pending**) — public viewer page at `/invoice/[token]`, public PDF endpoint at `/api/public/invoices/[token]/pdf`, both allowlisted in middleware. Schema additions: `Invoice.publicToken` (nullable cuid; lazy-fills on first send for legacy invoices) + `Invoice.viewedAt` (stamped first time the public page is opened). The send route no longer base64-attaches the PDF — instead passes `{{ invoiceUrl }}` to the Loops `INVOICE_SEND` template. **One manual step remaining:** update the INVOICE_SEND template in the Loops dashboard to use `{{ invoiceUrl }}` (button or link) and remove any attachment reference. Stripe Payment Links integration (Pay-now button on the public page + webhook for auto-mark-paid) deferred — schema fields not added yet.
2. ✅ **Invoice un-approved-time warning** (shipped 2026-05-04) — `/api/invoices/timesheet-preview` now returns a `warnings[]` array with `{userId, userName, weekStart, status, hours}` for every billable entry whose week isn't APPROVED. AdminBillingClient renders an amber banner with each unreviewed timesheet (DRAFT, SUBMITTED, or SENT BACK) plus a "Review pending timesheets →" link. Confirmation gate on Create Invoice when warnings exist.
3. ✅ **Auto-invoicing UX surfacing** (fully shipped 2026-05-04) — Status panel on `/admin/billing` showing next run date and DRAFT count. Quick-period preset buttons (Last month / This month / Last week / Clear) on the New Invoice form. Dashboard tile for drafts-to-review for OWNER/ADMIN linking to `/admin/billing#draft-section`. **Per-project billing cadence**: new `Project.billingCadence` enum (`MONTHLY` / `MILESTONE` / `MANUAL`, default `MONTHLY`). Dropdown on project create + edit forms with explanatory copy. Cron now filters to `billingCadence: "MONTHLY"` so milestone- and manual-billed projects skip auto-drafting.

#### 🟠 P1 — fix next sprint

4. ✅ **Invoice header industry-standard gaps** (Stages 1 + 2 shipped 2026-05-04) — **Stage 1**: Schema additions to `Organization` (billingMailingAddress, billingFedId, billingAchRouting/Account, billingWireRouting/Account). `/settings/billing-info` page. PDF + public viewer render a "Please Remit Payment Via" block. **Stage 2**: `Project.contractNumber` on project forms, renders as "Agreement No." under the project block. `Attn: {Client.contactPerson}` line under BILL TO when the linked Client record has a contactPerson. **Still deferred** (low priority): "Submit invoice in triplicate" public-agency toggle.
5. **Stripe Payment Links integration** (Stage 1 of the broader payments work) — bundles with #1 above.
6. ✅ **Approver page history view** (shipped 2026-05-04) — added a Pending / History tab toggle on `/time/approve`. History tab lists the most recent 50 past decisions (APPROVED rows + DRAFT rows with `reviewComment` set, i.e. sent-back). Each row shows user, week, hours, decision badge (Approved / Sent back), reviewer name + date. APPROVED rows have a Reopen action (with confirm dialog) that calls `/api/timesheets` with `action: "reopen"` + the timesheet owner's `userId`. Sent-back rows display the reviewer's comment inline.
7. ✅ **Admin timesheet rollup dashboard** (shipped 2026-05-04) — new page at `/admin/timesheets` (owner/admin only). Period toggle: This month / Last month. Top stat cards: total hours, billable hours, utilization %, billable revenue. Per-staff table sorted by hours desc with columns Name / Hours / Billable / Leave / Overhead / Util % / Revenue (color-coded green/amber/red by utilization). Per-project table sorted by billable hours desc with columns Project / Hours / Billable / Revenue, project names link to detail. Utilization = billable hours ÷ working hours in month (Mon-Fri × 8). Card on `/admin` landing links into it.
8. ✅ **Notifications widget** (shipped 2026-05-04 — sidebar badge variant) — instead of a separate dropdown, badges live directly on the existing nav items where the user can already act. **Time Sheets** badge counts pending approvals in the user's approver scope (role-approvers see all-of-org, supervisors see direct reports only). **Submittals** badge counts overdue items where the user is `assignedToId`. **Admin** badge (OWNER/ADMIN only) counts DRAFT invoices ready to review. Mobile hamburger button gets a small rose dot when any badge is non-zero so users know there's something inside the drawer. Counts computed server-side in `app/(app)/layout.tsx` and passed through to the sidebar — re-runs on every navigation so they stay fresh.

#### 🟡 P2 — clean up bugs

9. ✅ **Reviewer comment banner persists after re-submit** (shipped 2026-05-04) — submit handler now calls `router.refresh()` so the page re-fetches the WeeklyTimesheet record and the banner clears (the API was already nulling `reviewComment` on re-submit).
10. ✅ **Week status card stuck on wrong week** (shipped 2026-05-04) — TimesheetSubmitClient now syncs the optimistic `currentStatus` state when the `status`/`weekStart` props change via `useEffect`. Prev/Next navigation now updates the card correctly.
11. ✅ **Approver column grid misaligned with period label** (shipped 2026-05-04) — root cause was JS Date timezone parsing. `weekStart` is stored as `@db.Date` but `new Date(isoString)` parsed UTC midnight as the previous day in west-of-UTC zones. Fixed via a `parseLocalDate` helper that extracts only the YYYY-MM-DD portion. Applied to `weekDays`, `dayHeaderLabel`, and `weekRange`.
12. ✅ **Invoice Detailed line-item mode doesn't show staff name + rate** (shipped 2026-05-04) — root cause was the radio toggle didn't trigger a re-fetch. Now toggling Summary↔Detailed after the initial pull auto-re-pulls with the new mode, and `pullFromTimesheets` accepts an explicit `modeOverride` parameter to avoid React's async-state quirk on the same render.
13. ✅ **MWELO project picker dropdown unclickable in render-back mode** (shipped 2026-05-04) — calculator's `<select>` had `disabled={projectsLoading || Boolean(loadedItemId)}` which forcibly locked the dropdown when an itemId was present. Removed the `loadedItemId` half — operators can now re-link saved calcs to a different project if needed.
14. ✅ **Invoice PDF cold-start timeout** (mitigated 2026-05-04) — added `export const maxDuration = 30` to all three React-PDF routes (`/api/invoices/[id]/pdf`, `/api/public/invoices/[token]/pdf`, `/api/compliance/[id]/mwelo-pdf`). Vercel default is 10s, which can be too tight for `@react-pdf/renderer` cold starts (font loading + first compile). 30s gives slack without changing serverless cost meaningfully. Pre-rendering + caching to Storage is still on the table as a deeper optimization later.

#### 🟢 P3 — UX polish

15. ✅ **Modal standardization (Send Invoice)** (partial — shipped 2026-05-04) — replaced the back-to-back browser `prompt()` calls in the Send-to-client flow with a proper React modal mirroring the existing payment-update modal. Recipient email field (pre-filled from `project.clientEmail`), optional multiline message, brand-styled Send/Cancel buttons, inline error + success feedback (auto-closes 1.8s after success). Other `confirm()` usages across the codebase (~9 files) are less visually offensive and remain — the prompt-heavy Send flow was the worst offender.
16. ✅ **Auto-clear stale error banners on next successful action** (shipped 2026-05-04) — `quickMarkAsSent` was missing `setError(null)` at the top, leaving the prior "Failed to send invoice email" banner visible after a successful Mark Sent. Added it. (Other actions in AdminBillingClient already cleared error on entry; just this one was missed.)
17. ✅ **Phone number input mask** (display-only, shipped 2026-05-04) — `formatPhone(value)` helper added to `lib/utils.ts`. Renders `15595555555` → `+1 (559) 555-5555` and `5595555555` → `(559) 555-5555`. Anything that doesn't fit (international, extensions, partial numbers) passes through unchanged. Applied to the Client card display. Inputs remain free-text — operators can type however they want and the database stores raw input.
18. ✅ **City name display: normalize to title case** (shipped 2026-05-04) — added `toTitleCase` helper to `lib/utils.ts`. Applied at display time on Projects list rows and Client cards. Also normalized state to uppercase (state abbreviations are uppercase by convention). Stored values aren't mutated — operators can type however they want.
19. ✅ **Rename "Billing & Subscription" → "Phasewise Subscription"** (shipped 2026-05-04) — three surfaces updated: `/admin` landing card, `/settings` landing card, and `/settings/billing` page heading. Description text now explicitly says "your Phasewise plan" to disambiguate from project billing.
20. ✅ **MWELO render-back: project picker auto-select saved projectId** (shipped 2026-05-04) — when loading a saved compliance item, the calc fetch returns `item.project = { id, name }` but only the name was being applied. Now also calls `setSaveProjectId(item.project.id)` so the dropdown reflects the linkage. Older saved calcs without a project id degrade gracefully (text-only).

#### 💡 P3 — feature ideas (not blocking, captured for later)

21. Apply Schedule pre-fill (saved per-employee weekly template — PeopleSoft pattern)
22. Monthly leave accrual with cap + rollover (replace "lump-sum on day one" model with earn-as-you-go)
23. Alternate / backup supervisor (for vacation coverage)
24. "My Schedule" staff-side view (read-only PhaseStaffPlan view per staff)
25. Role-based dashboard differentiation (Employee Self Service vs Manager Self Service split)

### Tomorrow's first task

**Start P0 #1: Path B + Stripe Payment Links combined work.** Plan:

1. Schema: add `Invoice.publicToken String @unique @default(cuid())` and `Invoice.stripePaymentLinkUrl String?` and `Invoice.viewedAt DateTime?`.
2. Public route `/invoice/[token]` that renders the existing invoice React PDF view + "Download PDF" button + "Pay now →" button.
3. Allowlist `/invoice/[token]` in `lib/supabase/middleware.ts`.
4. At invoice creation in `lib/invoice-builder.ts`, call Stripe Payment Links API to create a unique link, store on the Invoice.
5. Update `LOOPS_TEMPLATE_INVOICE_SEND` template body in Loops dashboard: replace attachment reference with the public URL.
6. Remove the base64 PDF attachment code path in `/api/invoices/[id]/send/route.ts` and `lib/loops.ts`.
7. Stripe webhook handler: listen for `checkout.session.completed` from Payment Links → auto-flip Invoice to PAID + set paidAmount, paymentMethod, paidAt.
8. Test end-to-end with the same INV-003 send flow that broke today.

Estimated 1-2 days. After that ships: tackle P0 #2 (un-approved-time warning) and P0 #3 (auto-invoicing UX surfacing) in parallel.

---

## Where We Left Off (2026-05-03)

**Status: 🟢 X AUTO-POSTING LIVE.** The n8n SEO content pipeline now auto-tweets every new pillar article to @phasewise on Friday morning when it ships. First test tweet posted successfully (tweet ID `2051026738046488746`, "Best Software for Landscape Architects (2026 Guide)" link card auto-rendered from phasewise.io OG metadata).

### What unblocked

The 2026-05-01 OAuth blocker (popup kept authorizing @VfieldInc instead of @phasewise) was a **default-browser hijack**. n8n's OAuth popup was opening in **Avast Secure Browser** (Windows default), which had its own cookie store still logged in as @VfieldInc — separate from Chrome where @phasewise was active.

**Fix:**
1. Moved to Chrome incognito with NO X session
2. Signed in fresh as @phasewise only
3. Opened n8n in same incognito window → reconnected the X OAuth2 credential
4. Popup correctly identified @phasewise → authorized
5. Account connected ✅

### Workflow wiring (final)

`Schedule Trigger → List existing articles → Build prompt → Generate article → Extract article → Commit to GitHub → Wait (3 min) → Code in JavaScript → Create Tweet`

**Wait node** — 3 min after GitHub commit so Vercel has time to deploy the article (otherwise the tweet's URL would 404 briefly).

**Code in JavaScript** — parses the markdown frontmatter from `$('Extract article').first().json.article` to extract `title` and `description`, builds a tweet of the form:

```
{title}

{description}

https://phasewise.io/blog/{slug}
```

with body trimming if needed to stay under X's 280-char limit (URL auto-shortens to 23 chars on t.co).

**Create Tweet** — credential `X OAuth2 (Phasewise blog poster)`, Text field bound to `{{ $json.text }}` from the Code node.

### Notes for next session

- **GitHub commit "sha wasn't supplied" error** during testing was a stale-test-artifact issue: re-firing the workflow with the same slug rejected the commit because the file already existed. Not a production concern — the Build prompt node feeds existing slugs to the LLM as a blocklist, so re-runs in production won't pick a duplicate slug for ~6 months (40-keyword priority list at 1/week cadence).
- **First test tweet** is real and live (about a real, deployed article) — leaving it up. It serves its purpose as a real announcement.
- **X API tier**: paid minimum funded ($5 in API credits). Should last months at 1 tweet/week.
- **Ownership**: X Developer Console is owned by @phasewise (verified by green logomark in `/Account/Settings`). App is `phasewise-blog-poster`. Default browser remains Avast Secure — n8n testing was done in Chrome incognito to bypass the cookie hijack. Long-term should switch default browser to Chrome to prevent recurrence.

### Tomorrow's first task

**Continue Tier 0 #2 smoke test from step 7** (timesheet flow steps 7-17). Then:
- Tier 0 #3: in-app "report a problem" widget
- Tier 0 #4: manual `curl` cron verification (`/api/cron/monthly-invoicing` + `/api/cron/submittal-reminders` with `CRON_SECRET`)
- Tier 0 #5: mobile timesheet entry test on iOS

Lower priority: monitor Friday's auto-tweet land for the first 4 weeks; confirm tweet quality holds and X hasn't throttled the account.

---

## Where We Left Off (2026-05-01)

**Status: 🟢 13 commits shipped — Round 1 + Round 2 smoke-test fixes, brand-sender anonymity migration, two new Loops templates live, automated invoice-send-via-email working. 🟡 X auto-posting setup BLOCKED on OAuth account confusion; deferred.**

### What shipped today (commits in order)

1. `0104088` — **Fix: approved timesheet entries vanish + reject/send-back flow.** Smoke-test bug — `value={isDisabled ? "" : ...}` was forcing empty string when disabled, hiding approved values. Fix: `value={rowIsComplete(row) ? (entries[key] ?? "") : ""}`. Also added Reject action with `reviewComment` (sends timesheet back to DRAFT with reason visible).
2. `692f7ad` — **Approver page: inline expansion + Send-back with comment.** Clicking a pending row expands inline (no nav). Approve / Send back with comment buttons. Schema: `WeeklyTimesheet.reviewComment/reviewedById/reviewedAt`.
3. `ae019ba` — **Fix: invoice PDF DRAFT suppression + invoice delete with un-tag.** Drafts no longer render watermark. Deleting an invoice un-tags the linked TimeEntry rows so hours go back into the un-invoiced pool.
4. `9ee56e2` — **Fix: Work Plan staff-add row vanishes after clicking +.** Render-loop bug: useEffect depended on `phases` array reference which parent recreated every render. Stable dep: `phaseIdsKey = phases.map((p) => p.id).join(",")`.
5. `ade631c` — **Invoice line items: Summary mode default + Detailed toggle.** Summary collapses per-phase rollups (1 row per phase). Detailed shows per-person-per-phase. Default Summary; toggle persists.
6. `2707a32` — **Invoice number format: customizable template with year/counter tokens.** New `Organization.invoiceNumberFormat` (e.g. `INV-{YY}-{####}` → `INV-26-0042`). Settings page at `/settings/invoice-numbering`. Shared renderer in `lib/invoice-numbering.ts`.
7. `46595d7` — **Supervisor delegation: direct supervisors can approve their reports.** New `User.supervisorId`. Approval gate now allows OWNER/ADMIN OR direct supervisor of timesheet owner. Team page edit modal exposes supervisor picker.
8. `4fd17fb` — **Send Invoice via Loops — automated PDF email to client.** New `POST /api/invoices/[id]/send`. Renders branded PDF, attaches base64 to Loops `INVOICE_SEND` template (recipient = client's email on the project's linked Client). Sets `Invoice.sentAt`. "Send to client" button on `/admin/billing` rows. Anonymous brand voice — sender is `hello@mail.phasewise.io`, Reply-To `hello@phasewise.io`.
9. `b726e04` — **Invite emails: add recipientFullName + title to Loops variables.** Existing INVITE template merge fields now populated.
10. `1a635b4` — **MWELO calculator: project picker dropdown.** Standalone calculator gets a project select at the top so users can route MWELO calcs into the right project from one place.
11. `3493f43` — **Project types: org-managed taxonomy.** New `Organization.projectTypes JSON` + `/settings/project-types` page. Defaults pulled into a shared `lib/project-types.ts`. Replaces hard-coded list on project create/edit forms.
12. `a8b344d` — **Team page: clear link to /admin/leave for setting PTO/vacation standards.** Added a top-level "Manage leave & PTO standards" button + helper text on the team settings page so OWNERs can find the firm-wide leave policy without hunting in admin.
13. `71e7f18` — **CLAUDE.md: Loops Invite + Invoice Send templates live + brand sender swap.** Documented today's Loops work.

### Loops — anonymity-of-brand sender migration

All 8 transactional templates were previously sending from `kgallo22@mail.phasewise.io` (founder's name visible in inbox preview). Migrated to:

- **From:** `Phasewise Team <hello@mail.phasewise.io>`
- **Reply-To:** `hello@phasewise.io`

Templates updated individually (Loops has no global default sender): Welcome, Trial Started (branded), Subscription Canceled (branded), Payment Failed (branded), Submittal Reminder (branded), Budget Alert (branded), Invite, Invoice Send.

**Two new Loops templates created today:**
- **Invite** — `cmonelbq000qv0izk52er5uom` (env: `LOOPS_TEMPLATE_INVITE`)
- **Invoice Send** — `cmond6ahz02pu0i107sqfg8cz` (env: `LOOPS_TEMPLATE_INVOICE_SEND`)

Both wired into Vercel + local `.env`. Invoice Send template accepts a base64 PDF attachment via Loops API. Code in `lib/loops.ts` extends `sendTransactional()` with optional `attachments` parameter; falls through gracefully if template ID is missing.

### Outstanding anonymity TODO

Loops **Settings → Domain → Company Address** still shows founder's residential address. CAN-SPAM injects this into the footer of every transactional email. **Action:** before scaling outreach, swap for a PO Box (~$60-100/yr USPS) or virtual mailbox (iPostal1, Earth Class Mail, ~$15-30/mo). Not blocking — only ~3 outreach replies expected this week — but should be in place before broader cold-email sends.

### X (Twitter) auto-posting setup — BLOCKED, deferred

Goal: extend n8n SEO content workflow with a "Post to X" node so each new pillar article auto-shares to @phasewise on Friday morning when it ships.

**Done today:**
- Subscribed to X API paid tier — minimum $5 in API credits funded
- Created X Developer App `phasewise-blog-poster` under @phasewise developer account (verified by green logomark in `/Account/Settings`)
- Generated all OAuth credentials: Consumer Key, Consumer Secret, Bearer Token, Client ID, Client Secret, Access Token + Secret
- Added 3 callback URIs to the X app: `https://oauth.n8n.cloud/oauth2/callback`, `https://app.n8n.cloud/rest/oauth2-credential/callback`, `https://dailymm.app.n8n.cloud/rest/oauth2-credential/callback`
- Set up n8n **X OAuth2 API** credential with Client ID + Client Secret

**Blocker:** Clicking "Connect my account" in n8n opens an OAuth popup that says **"phasewise-blog-poster wants to access @VfieldInc"** instead of @phasewise. Tried:

1. Signed out of @VfieldInc on x.com in Chrome → confirmed only @phasewise active
2. Realized OAuth popup was opening in **Avast Secure Browser** (Windows default browser), which had its own separate session still logged in as @VfieldInc
3. Signed into Avast Secure Browser as @phasewise only (confirmed via screenshot — only "Log out @phasewise" option in account switcher)
4. Retried OAuth flow → popup STILL shows @VfieldInc as the authorizing account

**Theory:** something deeper is binding the OAuth context to @VfieldInc — possibly a residual cookie/cache state in Avast Secure, OR the X app has internal account-binding metadata that doesn't follow the user's current x.com session. Worth trying next session:

- **Hard browser reset:** Use a totally fresh browser (Chrome incognito, or Firefox if Chrome's @VfieldInc cache persists) with NO X session at all → sign in fresh as @phasewise → only then click Reconnect in n8n
- **Verify in X Developer Console:** check `Apps → phasewise-blog-poster → Settings` for any "owner account" metadata that may need to be re-bound
- **Last resort:** delete the X app and recreate it from a clean Avast Secure session signed in only as @phasewise

Until X auto-posting is wired, the n8n content workflow continues to ship articles to GitHub (and via Vercel auto-deploy, to `/blog`) every Friday — the social amplification step is the only piece missing.

### Tomorrow's first task

**Troubleshoot X OAuth account binding** with the steps above (fresh browser session OR app recreation). When unblocked: add Compose-social-posts Code node + Post to X node to the n8n workflow, then manual-fire test to confirm a tweet lands at x.com/phasewise.

After that's working, the next priorities (in order):
1. Continue Tier 0 #2 smoke test from step 7 (timesheet flow steps 7-17)
2. Tier 0 #3: in-app "report a problem" widget
3. Tier 0 #4: manual `curl` cron verification (`/api/cron/monthly-invoicing` + `/api/cron/submittal-reminders` with `CRON_SECRET`)
4. Tier 0 #5: mobile timesheet entry test on iOS

---

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
- [x] **Forensic audit punch-list closed** ✅ 2026-05-09 — yesterday's 3 Critical items (`(app)/error.tsx` boundary, WorkPlan load-error UX, cron firmName fallback bug) plus today's 2 Low items (budget-alerts dev-guard, PricingButton Sentry capture). All audit findings actioned.
- [x] **Google Postmaster Tools setup** ✅ 2026-05-09 — `phasewise.io` + `mail.phasewise.io` both verified (auto-reused Search Console proof). Reputation data populates 24-48h. Pairs with the welcome-email-to-spam diagnosis from 2026-05-08.
- [x] **Welcome email template tightened** ✅ 2026-05-09 — preview text added (was empty), "expected mail" reassurance line at top, demoted from H1 to body text. Minor improvements; the spam-classification root cause is domain reputation, not template content.
- [x] **n8n SEO automation docs refreshed** ✅ 2026-05-09 — `automation/n8n-workflow-setup.md` rewritten to match deployed 6-node pipeline; new `automation/n8n-blog-incident-2026-05-09.md` postmortem captures the GitHub-422 slug-collision incident + fix.
- [x] **Capterra listing LIVE** ✅ 2026-05-11 — GDM approved the 5/4 resubmission. Listing at https://www.capterra.com/p/[slug]/Phasewise/. Three pending vendor edits documented (Knowledge Base toggle, Starter tier verify, features audit) — blocked on GDM vendor-access migration thread.
- [x] **attention2 cold-email sent** ✅ 2026-05-11 — to Laura Burnett FASLA, President. Hunter-verified email. Draft reworked end-to-end (subject + body) to match 15-year FASLA practice context.
- [x] **Broussard + Atlas Lab FU#1 sent** ✅ 2026-05-11 — both follow-ups out, threaded on original 4/29 conversations.
- [x] **Hunter.io confirmed working on free tier** ✅ 2026-05-11 — 1 search credit consumed (attention2 lookup), 49 remaining for the month. Chrome extension pending.
- [x] **/pricing 404 fix** ✅ 2026-05-12 — server-side redirect to /#pricing + middleware allowlist (commit `a410573`). Closes the broken-link UX hole for cold-email recipients pasting the URL.
- [x] **Software Advice channel newly activated** ✅ 2026-05-12 — submitted for review; live in 24-72h.
- [x] **GetApp channel newly activated** ✅ 2026-05-12 — submitted for review; live in 24-72h.
- [x] **Listing completion score 69% → 91%** ✅ 2026-05-12 — 9 of 13 GDM recommendations resolved in one session.
- [x] **Invoice review modal shipped** ✅ 2026-05-13 — `InvoiceReviewModal.tsx` for read-only draft preview before sending. DRAFT row clicks now open it; non-DRAFT rows keep payment modal path. Plus explicit Review button in actions cell. Tested working. (commit `e2d7d12`)
- [x] **Google Analytics 4 wired + firing** ✅ 2026-05-13 — opt-in via `NEXT_PUBLIC_GA_MEASUREMENT_ID` env var (matches Plausible pattern), Vercel env var set, local `.env` updated, GA Realtime confirms tracking (page_view + scroll + first_visit + session_start events). (commit `27b665a`)
- [x] **/pricing 404 fixed** ✅ 2026-05-13 — server-side redirect to `/#pricing` + middleware allowlist. Cold-email recipients pasting the URL no longer hit a black 404. (commit `a410573`)
- [x] **Outreach automation playbook integrated** ✅ 2026-05-13 — imported from another project, adapted for Phasewise (LA firms not solos, LATC/ASLA not Google queries, anonymity discipline stricter). CLAUDE.md "Outreach automation" section guides future sessions. (commit `e38fb23`)
- [x] **Active vertical locked in: SoCal MWELO-strict** ✅ 2026-05-13 — Option B + H (LA County + OC + Inland Empire + SD via LATC/ASLA, MWELO-strict overlay). 5 Wave-2 cold drafts queued in `OUTREACH-DRAFTS.private.md`. Hunter credits earmarked. Send schedule: Mon-Wed 5/18-5/20. (commit `f2d2633`)
- [x] **First automation-driven research pass complete** ✅ 2026-05-13 — 5 verified Wave-2 candidates via WebSearch + WebFetch (Clark & Green, Mark Tessier, Studio PAD, Hermann Design Group, KDA). Important learning captured: Studio PAD's old email guess `peter@studio-pad.com` was wrong — actual is `paduarte@studio-PAD.com` (firstlastinitial pattern, not firstname). Pattern documented for future research.
- [x] **Second LinkedIn account deleted (anonymity)** ✅ 2026-05-12 — public link from Kevin Gallo → "Owner at Phasewise" severed.
- [x] **Workspace user renamed Phasewise Team** ✅ 2026-05-12 — display name propagates across Google services.
- [x] **Vercel Analytics enabled** ✅ 2026-05-12 — Hobby tier free; data populates within 24h.
- [x] **designlab 252 + Mantle outreach scheduled** ✅ 2026-05-12 — Wed 5/13 + Thu 5/14 8 AM Pacific. Tier-A queue fully out.
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
- [x] **Loops anonymity sender migration** ✅ 2026-05-01 — All 8 transactional templates now send from `Phasewise Team <hello@mail.phasewise.io>`, Reply-To `hello@phasewise.io`
- [x] **Loops INVITE template created** ✅ 2026-05-01 — `cmonelbq000qv0izk52er5uom`
- [x] **Loops INVOICE_SEND template created + Send Invoice via email** ✅ 2026-05-01 — `cmond6ahz02pu0i107sqfg8cz`, branded PDF attached to client email
- [ ] **Loops Company Address: swap residential for PO Box / virtual mailbox** — CAN-SPAM injects into transactional email footers. Do before scaling outreach
- [ ] **Tier 0 #2: End-to-end smoke test** — in progress as of 2026-04-30 EOD (steps 1-6/17 done). Round 1 + Round 2 fixes shipped 2026-05-01. Pickup at step 7 (timesheet flow) next session
- [ ] **Tier 0 #3: In-app "report a problem" widget** — small button on every page; one-click feedback to founder
- [ ] **Tier 0 #4: Manual cron verification** — `curl` test `/api/cron/monthly-invoicing` + `/api/cron/submittal-reminders` with `CRON_SECRET` to verify no crash on first real fire
- [ ] **Tier 0 #5: Mobile timesheet entry test** — POC_SCOPE explicitly says "time entry must work on phone"; need to actually verify iOS + Android render
- [x] **X auto-posting via n8n LIVE** ✅ 2026-05-03 — OAuth blocker (Avast Secure Browser cookie hijack) resolved by using Chrome incognito with fresh @phasewise session. Workflow now auto-tweets every Friday at 7am UTC. First test tweet posted (ID `2051026738046488746`)
- [ ] **Monitor indexing progress** in Search Console over next 1-2 weeks (Performance + Indexing reports)

### Sales / outreach (highest revenue ROI) — Mon 5/18 + week of 5/25 priority order

**Mon 5/18 — Wave 2 ignition (~30 min):**
- [ ] **🚨 #1: Hunter.io lookups (3 credits, ~10 min)** — `clarkgreen.com`, `hdg-inc.com`, `kda-landscapearchitects.com`
- [ ] **🚨 #2: attention2 follow-up #1** to Laura Burnett (5 business days past 5/11 send)
- [ ] **🚨 #3: Schedule Send Wave 2 batch** in Gmail (Emails 6-10 in `OUTREACH-DRAFTS.private.md`):
  - Mon 5/18 8 AM Pacific: Clark & Green + Mark Tessier
  - Tue 5/19 8 AM Pacific: Studio PAD + Hermann Design Group
  - Wed 5/20 8 AM Pacific: KDA Landscape Architects
- [ ] **#4: Update PROSPECTS.md** Tier C statuses from `⏳ Not contacted` to `📧 Scheduled #1 — 2026-05-XX`

**Week of Mon 5/25 — Wave 3 ignition + Wave 2 follow-ups:**
- [ ] **Hunter.io lookups (4 credits)** — `cwdg.online`, `architerradesigngroup.com`, `dvolzdesign.com`, `bmla.net`
- [ ] **Schedule Send Wave 3** (Emails 11-14, 2/day): Community Works + David Volz, then Architerra + BMLA
- [ ] **Wave 2 FU#1s come due** — Clark & Green + Mark Tessier ~5/25, Studio PAD + Hermann ~5/26, KDA ~5/27
- [ ] **Broussard + Atlas Lab breakup emails** if still silent

**Anytime — passive checks:**
- [ ] **GDM vendor portal** — verify Software Advice + GetApp publish status + Capterra Knowledge Base ✓ propagation
- [ ] **Wave 4 verification pass** — 10 triaged names in PROSPECTS.md Wave 4 backlog; pull more San Diego + Inland Empire core firms
- [x] **🚨 Hunter.io setup confirmed working** ✅ 2026-05-11 — free tier active, 6 leads already saved, attention2 search consumed 1 credit. Chrome extension still pending.
- [x] **Outreach reply playbook** ✅ 2026-05-09 — drafted at `OUTREACH-REPLY-PLAYBOOK.private.md`. Six templates covering interested / objection / not-now / pricing / anonymity-disclosure / referral, plus voice rules + triage table + "never reply with" list. Template #4 pricing corrected 2026-05-12 to match canonical "5 users / 20 projects".
- [x] **attention2 sent + Broussard FU#1 + Atlas Lab FU#1** ✅ 2026-05-11 — three outreach actions out. Follow-up #1 windows for attention2 due Mon 5/18; Broussard + Atlas Lab breakups due Mon 5/25.
- [x] **designlab 252 scheduled (anonymity-maximum rewrite)** ✅ 2026-05-12 — scheduled Wed 5/13 8 AM Pacific via Gmail Schedule Send. Original 4/28 draft was unsendable due to Caltrans-overlap tells; reworked end-to-end with portfolio-agnostic framing.
- [x] **Mantle scheduled** ✅ 2026-05-12 — Thu 5/14 8 AM Pacific via Gmail Schedule Send. Standard "expert read" register.
- [x] **GDM vendor portal access established** ✅ 2026-05-12 — `hello@phasewise.io` added as vendor user; profile set up with anonymity-clean values (Phasewise / Team / Pacific Time).
- [x] **Capterra accuracy fixes applied** ✅ 2026-05-12 — Knowledge Base ✓, Licensing → Proprietary, Features audit clean, Starter tier verified, Pricing URL set.
- [x] **Software Advice channel activated** ✅ 2026-05-12 — Long Description (2,500 chars tailored), 5 captioned screenshots, Submit For Review clicked → Under Review.
- [x] **GetApp channel activated** ✅ 2026-05-12 — Long Description (1,700 chars, different framing), Tagline, Benefits, 5 captioned screenshots, Submit For Review clicked → Under Review.
- [x] **Vercel Analytics enabled** ✅ 2026-05-12 — Hobby tier (50K events/mo free). Code was already installed; only dashboard toggle was missing.
- [x] **Second Kevin Gallo LinkedIn account deleted** ✅ 2026-05-12 — anonymity surface closed (account previously listed "Owner at Phasewise" publicly).
- [x] **Workspace user renamed Kevin Gallo → Phasewise Team** ✅ 2026-05-12 — display name propagates to all Google surfaces.
- [x] **Listing Completion 69% → 91%** ✅ 2026-05-12 — 9 of 13 recommendations resolved.

### Active waits (cron-style — won't ping you, you have to come back)

- [ ] **Mon 5/18 — attention2 follow-up #1** (5 business days after Mon 5/11 send to Laura Burnett). Use the standard playbook template; if a creative angle is wanted, the reserve contact `marty@attention2.com` (Marty Poirier FASLA, Partner) is held for FU#2 if Laura goes silent through FU#1.
- [ ] **Mon 5/18 / Tue 5/19 — AlternativeTo submission unblocks** (7-day spam gate from account creation 5/11). All copy ready in `directory-listings.md`; ~10 min when the gate lifts. Highest-ROI directory for "Monograph alternatives" search intent.
- [ ] **Mon 5/25 — Broussard + Atlas Lab breakup emails** if still silent after FU#1. Use OUTREACH-PLAYBOOK breakup template. After breakup, move to "warm-but-paused" list — leave alone for 6 months minimum.

### Lower priority / continue cadence

- [ ] **Maintain 5/week cold-outreach cadence beyond the original 5** — Tier-B firms research + send. Skip-2-weeks is the most common solo-founder failure mode.
- [ ] **Capterra vendor edits** (blocked on GDM access; unblocks when they reply to Mon 5/11 thread) — see #2 above.
- [ ] **Submit to G2 (g2.com)** — this is a separate company from GDM, requires its own submission. Larger directory, more SEO authority, but gated by 3+ reviews to surface in search.
- [ ] Later: more directories (SaaSHub, Slant.co)
- [ ] Product Hunt launch (one-time, needs prep + launch window)
- [ ] **Tier-2 outreach automation (after first 3-5 paying customers)** — adopt sequencing tool (Smartlead $39/mo) for touches 2 + 3 only; first touch + first reply stays manual. n8n classification node for incoming-reply triage with template suggestion (human still hits Send)
- [ ] **Tier-3 outreach automation (after ~25 customers)** — full Apollo + Smartlead + Hunter stack, AI-suggested reply drafts (still human-approved), multiple sending mailboxes

### Product polish that supports sales

- [ ] **Audit log on timesheet reopen + post-approval edits** — required for any firm billing T&M. Add `TimesheetAuditLog` table; record actor, timestamp, prior status
- [ ] **Reject-with-comment timesheet workflow** — approver rejects with a note, status flips back to DRAFT with rejection visible. Standard in Monograph / BQE / Deltek / Replicon
- [ ] **Friday email reminder cron for unsubmitted timesheets** — extends the existing submittal-reminders cron pattern
- [ ] **Weekly hour-target hint widget** — top of timesheet page: "32 / 40 hours logged this week" with soft amber warning under target on Friday. Used by Harvest / Toggl / Clockify

### Brand + ops

- [ ] **File USPTO trademark for "Phasewise"** — protect the name before significant marketing push (~$350)
- [ ] Upload v2 PNG logos to LinkedIn, X/Twitter, GitHub profiles
- [ ] Claim @phasewise on Instagram (was blocked by SMS verification — try again)
- [x] **Set up getphasewise.com redirect to phasewise.io in Cloudflare** ✅ 2026-05-08 — Cloudflare Single Redirect Rule on `getphasewise.com` zone, dynamic 301 with path preservation to `https://phasewise.io`, matches both apex + www. Created proxied A record + www CNAME (192.0.2.1 docs IP, orange cloud ON). Verified all three URL variants redirect. Closes the "Duplicate without user-selected canonical" Search Console issue.
- [ ] Remove duplicate `google-site-verification` TXT record from Cloudflare
- [ ] **Auto-post blog articles to socials** — extend n8n pipeline. Blocked on social accounts being claimed + API credentials in n8n
- [ ] Create Loops INVITE template (optional — link sharing works without it)
- [ ] Optional: n8n error notification workflow (alerts on silent failures)
- [ ] Quality monitoring: read each Friday's auto-article for 4 weeks; if quality holds, ramp to 2/week cadence
