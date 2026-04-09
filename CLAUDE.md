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

- [ ] Landing page reflects v2 brand and "Focus on the design" positioning
- [ ] All core features work seamlessly (project CRUD, time tracking, budgets, reports)
- [ ] Project editing (currently only create + view)
- [ ] Profitability reporting dashboard
- [ ] Client management module (contacts, communications)
- [ ] Stripe billing live with trial → paid flow
- [ ] Welcome email automation working
- [ ] Contact list capture from landing page (waitlist + signup)
- [ ] Onboarding flow (signup → org setup → first project → first time entry)
- [ ] Empty states designed for every page (no users? no projects? handle it gracefully)
- [ ] Mobile responsive across all pages
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

### Service Architecture (Decisions)

| Need | Service | Why |
|------|---------|-----|
| **Hosting** | Vercel | Already deployed; auto-deploy from GitHub |
| **Database + Auth** | Supabase | Already set up; Postgres + Auth in one |
| **Payments** | Stripe | Industry standard. Use Stripe Checkout for trials, Customer Portal for self-service. Coupons + promo codes are first-class. |
| **Transactional email** | Resend | Developer-friendly, generous free tier (3000/mo). Better than SendGrid for app-driven emails (welcomes, receipts, alerts). |
| **Marketing email + CRM** | Resend Audiences (or Loops.so) | Same provider as transactional. Capture signups → audience → newsletters. Avoid splitting tools early. |
| **Business email** | Google Workspace | kevin@phasewise.io for business correspondence (separate from app-driven emails) |
| **Social media scheduling** | n8n (Kevin already knows it) → Buffer fallback | Kevin has n8n expertise. Build a workflow that posts scheduled content to LinkedIn/X/Instagram. |
| **Analytics** | Vercel Analytics + Plausible | Vercel built-in, Plausible for privacy-friendly product analytics |

### Environment Variables (Vercel + local `app/.env`)

| Variable | Source |
|----------|--------|
| `DATABASE_URL` | Supabase > Connect > ORM > Prisma (pooled, port 6543) |
| `DIRECT_URL` | Supabase > Connect > ORM > Prisma (direct, port 5432) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase > Project Settings > API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase > Project Settings > API (anon/public key) |
| `STRIPE_SECRET_KEY` | TODO — Stripe Dashboard > Developers > API keys |
| `STRIPE_WEBHOOK_SECRET` | TODO — Stripe Dashboard > Developers > Webhooks |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | TODO — Stripe Dashboard > Developers > API keys |
| `RESEND_API_KEY` | TODO — Resend Dashboard > API Keys |

## Tech Stack

- **Framework:** Next.js 16 (App Router) — see `app/AGENTS.md` for breaking-change rules
- **Language:** TypeScript (strict)
- **Database:** PostgreSQL via Supabase, ORM is Prisma (`app/prisma/schema.prisma`)
- **Auth:** Supabase Auth (server-side via `@supabase/ssr`)
- **UI:** Tailwind CSS 4, Lucide icons, Base UI components
- **Fonts:** DM Serif Display (headlines) + Outfit (body) via `next/font/google`
- **Payments:** Stripe (planned)
- **Email:** Resend (planned)
- **Hosting:** Vercel

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

Most meaningful first:

1. **Apply v2 brand to landing page** — biggest visual impact, unlocks "professional" perception
2. **Apply v2 brand to authenticated app** — consistent experience after signup
3. **Refresh positioning** — "Focus on the design" hero copy
4. **Replace `/brand` assets with v2 versions** — single source of truth
5. **Stripe integration** — paywall, trial flow, webhooks, customer portal
6. **Resend integration** — welcome email + transactional (signup, password reset, billing)
7. **Waitlist + contact capture** — landing page form → Resend audience + Postgres
8. **Project editing** — currently only create + view
9. **Profitability reporting** — the core value prop demands a real report
10. **Client management module** — contacts, communications, automations
11. **Onboarding flow** — first-run experience after signup
12. **Empty states + loading states** — production polish
13. **Privacy Policy + Terms** — legal pages before launch
14. **Social media automation (n8n)** — scheduled posts to LinkedIn/X/Instagram
15. **Google Workspace setup** — kevin@phasewise.io for business email
16. **USPTO trademark filing** — protect the name

## TODO (Operational, non-code)

- [ ] Set up Google Workspace (kevin@phasewise.io)
- [ ] Upload v2 PNG logos to LinkedIn, X/Twitter, GitHub profiles
- [ ] Claim @phasewise on Instagram
- [ ] File USPTO trademark for "Phasewise"
- [ ] Set up getphasewise.com redirect to phasewise.io in Cloudflare
