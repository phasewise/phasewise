# Phasewise

Phase-based project intelligence for design professionals. Tracks project phases, budgets, time entries, and profitability for landscape architecture firms.

See `POC_SCOPE.md` for the full product spec and roadmap. See `BUSINESS_PLAN.md` for market research, financials, and go-to-market strategy.

## Brand

- **Name:** Phasewise (formerly PowerKG)
- **Tagline:** Phase-based project intelligence for design professionals
- **Primary domain target:** phasewise.com (also .io and .app)
- **Naming rationale:** Documented in BUSINESS_PLAN.md under "Brand Identity: Why Phasewise"

### Multi-Industry Scaling (Future)

The name is intentionally industry-agnostic. Future verticals to develop:

| Product | Market | Notes |
|---------|--------|-------|
| **Phasewise** (core) | Landscape Architecture | Current focus. LA-specific phases, MWELO, plant schedules. |
| **Phasewise AE** | Architecture & Engineering | Programming → SD → DD → CD → CA phases |
| **Phasewise CM** | Construction Management | Pre-Con → Mobilization → Construction → Closeout |
| **Phasewise AG** | Agriculture | Planning → Planting → Growing → Harvest → Fallow |

Each vertical shares the core platform (time tracking, budgets, profitability, dashboards) but adds industry-specific phase types, terminology, compliance features, and integrations. Do not build multi-industry features yet — focus on LA until product-market fit is achieved.

## Tech Stack

- **Framework:** Next.js 16 (App Router) — see `app/AGENTS.md` for breaking-change rules
- **Language:** TypeScript (strict)
- **Database:** PostgreSQL via Supabase, ORM is Prisma (`app/prisma/schema.prisma`)
- **Auth:** Supabase Auth (server-side via `@supabase/ssr`)
- **UI:** Tailwind CSS 4, Lucide icons, Base UI components
- **Payments:** Stripe
- **Hosting target:** Vercel

## Project Structure

```
powerkg/                          # Repo directory (legacy name, may rename later)
├── app/                          # Next.js application root
│   ├── prisma/schema.prisma      # Database schema (source of truth)
│   ├── src/
│   │   ├── app/
│   │   │   ├── (app)/            # Authenticated app routes (shared sidebar layout)
│   │   │   │   ├── dashboard/
│   │   │   │   ├── projects/     # List, new, [id] detail
│   │   │   │   ├── time/         # Timesheet, approve
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
