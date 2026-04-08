# Phasewise

Phase-based project intelligence for design professionals. Tracks project phases, budgets, time entries, and profitability for landscape architecture firms.

See `POC_SCOPE.md` for the full product spec and roadmap. See `BUSINESS_PLAN.md` for market research, financials, and go-to-market strategy.

## Brand

- **Name:** Phasewise (formerly PowerKG)
- **Tagline:** Phase-based project intelligence for design professionals
- **Primary domain:** phasewise.io (live, deployed)
- **Backup domain:** getphasewise.com (owned, redirect to .io)
- **phasewise.com:** For sale at ~$4,888 on Afternic — negotiate to ~$1,500 when revenue justifies it
- **Naming rationale:** Documented in BUSINESS_PLAN.md under "Brand Identity: Why Phasewise"
- **Brand assets:** `brand/` directory — logos, social banners, favicons, guidelines

### Social Accounts (Claimed)

| Platform | Handle/URL |
|----------|-----------|
| GitHub | github.com/phasewise |
| LinkedIn | linkedin.com/company/phasewise-io |
| X/Twitter | @phasewise |

### Multi-Industry Scaling (Future)

The name is intentionally industry-agnostic. Future verticals to develop:

| Product | Market | Notes |
|---------|--------|-------|
| **Phasewise** (core) | Landscape Architecture | Current focus. LA-specific phases, MWELO, plant schedules. |
| **Phasewise AE** | Architecture & Engineering | Programming → SD → DD → CD → CA phases |
| **Phasewise CM** | Construction Management | Pre-Con → Mobilization → Construction → Closeout |
| **Phasewise AG** | Agriculture | Planning → Planting → Growing → Harvest → Fallow |

Each vertical shares the core platform (time tracking, budgets, profitability, dashboards) but adds industry-specific phase types, terminology, compliance features, and integrations. Do not build multi-industry features yet — focus on LA until product-market fit is achieved.

## Deployment

- **Hosting:** Vercel (Hobby plan, Pro Trial active)
- **Live URL:** https://phasewise.io
- **Vercel URL:** phasewise.vercel.app
- **Database:** Supabase PostgreSQL — West US (North California), project "Phasewise" under org "Phasewise"
- **DNS:** Cloudflare — A record `@` → `216.198.79.1` (DNS only, no proxy)
- **Auto-deploy:** Pushing to `main` on GitHub triggers Vercel deployment automatically
- **Repo:** github.com/phasewise/phasewise (public)

### Environment Variables (Vercel + local `app/.env`)

| Variable | Source |
|----------|--------|
| `DATABASE_URL` | Supabase > Connect > ORM > Prisma (pooled, port 6543) |
| `DIRECT_URL` | Supabase > Connect > ORM > Prisma (direct, port 5432) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase > Project Settings > API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase > Project Settings > API (anon/public key) |

## Tech Stack

- **Framework:** Next.js 16 (App Router) — see `app/AGENTS.md` for breaking-change rules
- **Language:** TypeScript (strict)
- **Database:** PostgreSQL via Supabase, ORM is Prisma (`app/prisma/schema.prisma`)
- **Auth:** Supabase Auth (server-side via `@supabase/ssr`)
- **UI:** Tailwind CSS 4, Lucide icons, Base UI components
- **Payments:** Stripe (not yet integrated)
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
│   │   │   │   ├── dashboard/
│   │   │   │   ├── projects/     # List, new, [id] detail
│   │   │   │   ├── time/         # Timesheet grid, submit, approve
│   │   │   │   ├── reports/
│   │   │   │   └── settings/
│   │   │   ├── (auth)/           # Login and signup pages
│   │   │   └── api/              # Route handlers
│   │   │       ├── projects/     # CRUD + [projectId]/assign, tasks
│   │   │       ├── team/
│   │   │       ├── time/
│   │   │       └── timesheets/
│   │   └── lib/
│   │       ├── prisma.ts         # Prisma client singleton
│   │       ├── constants.ts      # Phase labels, status colors, plan limits
│   │       └── supabase/
│   │           ├── server.ts     # Supabase server client
│   │           ├── client.ts     # Supabase browser client
│   │           └── auth.ts       # getCurrentUser() helper
│   └── package.json
├── brand/                        # Brand assets (logos, social banners, guidelines)
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

## Commands

```bash
cd app
npm run dev          # Start dev server
npx tsc --noEmit     # Type check
npx prisma generate  # Regenerate Prisma client
npx prisma db push   # Push schema to database
npx prisma studio    # Visual database browser
```

## TODO (Next Session)

- [ ] Set up Google Workspace (kevin@phasewise.io)
- [ ] Upload PNG logos to LinkedIn, X/Twitter, GitHub profiles
- [ ] Claim @phasewise on Instagram
- [ ] File USPTO trademark for "Phasewise"
- [ ] Set up getphasewise.com redirect to phasewise.io in Cloudflare
- [ ] Add Stripe integration for subscription billing
- [ ] Project editing (update existing projects)
- [ ] Profitability reporting dashboard
