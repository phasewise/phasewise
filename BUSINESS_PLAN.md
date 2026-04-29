# Phasewise — Business Plan
## Project Management & Operations Platform for Landscape Architecture Firms
### Prepared April 8, 2026

---

## Executive Summary

Phasewise is a vertical SaaS platform purpose-built for landscape architecture firms. It replaces the fragmented tool stack of spreadsheets, email, and generic project management software with a single platform designed around how landscape architects actually work — from project phases and fee tracking to submittal logs, plant schedules, and construction administration.

**The opportunity:** There are several thousand landscape architecture firms in the US (NAICS 541320), the vast majority with fewer than 50 employees. There is **zero** purpose-built SaaS for LA firm operations. The closest competitor, Monograph, targets architecture firms and lacks landscape-specific features (plant schedules, irrigation, water budgets, MWELO compliance, CA-phase tools). Verify the latest IBISWorld / BLS figures before any investor or external use of specific firm-count or industry-revenue numbers.

**Target:** Small-to-mid LA firms (5-50 employees) currently using QuickBooks + Excel + email + generic PM tools.

**Revenue model:** SaaS subscription, $99-$299/month depending on firm size.

**Goal:** $83,000/month ARR (~$1M/year) within 18-24 months of launch.

**Founder advantage:** Kevin Gallo is a Senior Landscape Architect at Caltrans with deep domain expertise in n8n automation, React/TypeScript, and the exact workflows this product serves. He IS the customer.

---

## Market Analysis

### Total Addressable Market (TAM)

| Segment | Firms | Avg Revenue | Notes |
|---------|-------|-------------|-------|
| US Landscape Architecture firms | ~8,500 | $1.3M avg | NAICS 541320 |
| US Architecture firms | ~23,000 | $2.4M avg | Adjacent market |
| US Civil Engineering firms | ~20,000 | $2.8M avg | Adjacent market |
| **Total addressable** | **~51,500** | | |

### Serviceable Addressable Market (SAM)

Targeting firms with 5-50 employees (the "software no-man's-land" — too big for spreadsheets, too small for Deltek):

| Segment | Firms | Notes |
|---------|-------|-------|
| LA firms, 5-50 employees | ~5,000 | Primary target |
| Architecture firms, 5-50 employees | ~12,000 | Expansion target |
| Civil engineering firms, 5-50 employees | ~8,000 | Expansion target |
| **Total SAM** | **~25,000** | |

### Serviceable Obtainable Market (SOM) — Year 1-3

| Year | Target Subscribers | Avg Monthly Revenue | Monthly ARR |
|------|-------------------|---------------------|-------------|
| Year 1 | 50-100 firms | $149/mo avg | $7,450-$14,900 |
| Year 2 | 250-500 firms | $149/mo avg | $37,250-$74,500 |
| Year 3 | 560-800 firms | $149/mo avg | **$83,440-$119,200** |

**560 subscribers at $149/month = $83,440/month = goal achieved.**

That's 6.6% of the 8,500 LA firms in the US — a realistic penetration rate for a category-defining product in a niche market.

### Market Revenue Potential

At full maturity (5+ years), capturing 15-20% of the LA market + 5% of adjacent AEC:

| Scenario | Subscribers | ARPU | Monthly ARR | Annual ARR |
|----------|------------|------|-------------|------------|
| Conservative | 1,000 | $149 | $149,000 | $1.79M |
| Moderate | 2,500 | $179 | $447,500 | $5.37M |
| Aggressive (AEC expansion) | 5,000 | $199 | $995,000 | $11.94M |

---

## Industry Overview

### Landscape Architecture Industry

- **Industry size:** $11B+ annual US revenue (IBISWorld)
- **Growth rate:** 3-5% annually, accelerated by federal infrastructure spending ($1.2T IIJA)
- **Licensed practitioners:** ~25,000 in the US (BLS)
- **Total industry employment:** ~90,000 including unlicensed staff
- **Key drivers:** Green infrastructure mandates, climate resilience, urban parks, sustainability (ESG/LEED/SITES), aging infrastructure rehabilitation
- **Regulatory environment:** State licensing via CLARB, MWELO (California), ADA, CEQA/NEPA, stormwater/NPDES

### Technology Landscape

**Current state:** LA firms lag behind general architecture and engineering in technology adoption. Most small firms operate with:
- AutoCAD / Land F/X for design (90%+)
- QuickBooks for accounting (dominant)
- Excel for project management, budgets, schedules, logs (~80% of firms under 20 people)
- Email for client communication, approvals, contractor coordination
- Paper/Bluebeam for field documentation

**Cloud adoption:** Accelerating post-COVID, driven by hybrid work and younger staff expectations. But no cloud-native tool exists for LA firm operations.

---

## Competitive Analysis

### Direct Competitors (LA-Specific Operations Software)

**None exist.** This is a white-space opportunity.

- **LMN** ($100-200/mo) — Targets landscape *contractors/maintenance companies*, not design firms. Different workflows entirely.
- **Aspire Software, SingleOps** — Also target landscape maintenance/contracting, not design.

### Adjacent Competitors

| Product | Target | LA-Fit | Price | Weakness for LA Firms |
|---------|--------|--------|-------|-----------------------|
| **Monograph** | Architecture firms | Partial | $15-30/user/mo | No plant schedules, irrigation, water budgets, CA-phase tools, MWELO |
| **Deltek Vantagepoint** | Large AE/C firms | Partial | $50-100/user/mo | Too expensive, too complex, 6+ week implementation |
| **BQE Core** | Professional services | Minimal | $15-30/user/mo | No AEC-specific features (submittals, RFIs, punch lists) |
| **Procore** | General contractors | Minimal | $375+/mo | Contractor-focused, not design professional workflows |
| **Monday/Asana** | Everyone | Minimal | $8-20/user/mo | No understanding of project phases, fee structures, AEC billing |
| **QuickBooks + Excel** | Default | Minimal | ~$80/mo | Fragmented, manual, no real-time project visibility |

### Competitive Advantages of Phasewise

1. **Only LA-specific platform** — First-mover in an empty category
2. **Built by a practicing landscape architect** — Authentic domain expertise
3. **LA-native features** — Plant schedules, water budget calculator, MWELO compliance, irrigation, CA-phase tools
4. **Modern UX** — Cloud-native React app vs. legacy desktop software
5. **Right-sized pricing** — $99-299/month vs. Deltek's $1,000+/month
6. **QuickBooks + AutoCAD integrations** — Fits existing stack rather than replacing everything

---

## Product Overview

### Core Platform Modules

**Module 1: Project Dashboard**
- All active projects with phase, status, budget burn rate, next milestone
- Ball-in-court tracker — who owes what, when
- Phase-based project structure (Pre-Design → SD → DD → CD → Bid → CA → Closeout)
- Project health indicators (on-time, at-risk, over-budget)

**Module 2: Fee & Budget Tracker**
- Real-time hours burned vs. budgeted per phase
- Automatic alerts at 75% / 90% / 100% budget thresholds
- Consultant fee tracking and budget reconciliation
- Change order impact on budget
- Phase-by-phase profitability analysis

**Module 3: Time Tracking**
- Per-project, per-phase time entry
- Mobile-friendly for field work
- Weekly timesheet views with approval workflow
- Billing rate calculations
- Integration with QuickBooks for invoicing

**Module 4: Submittal & RFI Manager**
- Submittal log with status tracking (received, under review, approved, rejected, resubmit)
- RFI log with ball-in-court tracking
- Automated reminders for overdue items
- Searchable history across all projects
- Linked to project phases and contractors

**Module 5: Plant Schedule Manager** (LA-Specific)
- Plant database with botanical/common names, sizes, spacing, water use
- Quantity tracking linked to planting plans
- Substitution management with client approval workflow
- Nursery availability notes
- Export to AutoCAD-compatible format

**Module 6: Construction Administration**
- Field report generator with photo integration
- Punch list manager (mobile app with photo capture, GPS, plan markup)
- Site visit scheduler and log
- Pay application review tracker
- Substantial completion and closeout checklist

**Module 7: Client Portal**
- Design review with markup/comment tools
- Formal approval workflow with timestamps
- Document sharing (plans, specs, reports)
- Project status visibility for clients
- Invoice history and payment status

**Module 8: Compliance Tracker**
- Permit tracking with renewal reminders
- MWELO water budget calculator (California)
- LEED credit documentation tracking
- SITES certification tracking
- ADA compliance checklist

### Future Modules (Year 2+)

- **Proposal Builder** — Template-based proposals with fee calculator
- **Resource Planner** — Staff utilization and capacity planning
- **Cost Estimator** — Unit-price database with RSMeans integration
- **Irrigation Calculator** — Hydraulic calcs, precipitation rates, pipe sizing
- **AI Assistant** — Natural language project queries, automated report generation
- **Contractor Coordination Portal** — Two-way communication with GCs/subs

---

## Pricing Strategy

### Tier Structure

| Tier | Target | Monthly Price | Includes |
|------|--------|--------------|----------|
| **Starter** | Solo / 1-3 person firms | $99/month | Up to 3 users, 10 active projects, core modules |
| **Professional** | 4-15 person firms | $199/month | Up to 15 users, unlimited projects, all modules, client portal |
| **Studio** | 16-50 person firms | $349/month | Up to 50 users, unlimited everything, priority support, custom integrations |
| **Enterprise** | 50+ person firms | Custom | Dedicated support, SSO, API access, custom workflows |

### Pricing Rationale

- **Below Deltek** ($50-100/user = $500-2,000+/month for small firms) — dramatically more affordable
- **Above generic tools** ($8-20/user) — justified by LA-specific features that generic tools can't provide
- **Aligned with Monograph** ($15-30/user) — similar per-user economics but flat-rate pricing is more attractive to small firms
- **Comparable to Clio/Jobber** — proven vertical SaaS pricing for professional services / trades

### Revenue Path to $83K/month

| Scenario | Starter | Professional | Studio | Total Subs | Monthly ARR |
|----------|---------|-------------|--------|-----------|-------------|
| Year 1 (Month 12) | 40 | 30 | 5 | 75 | $12,705 |
| Year 2 (Month 24) | 150 | 200 | 40 | 390 | $58,710 |
| Year 3 (Month 30) | 200 | 300 | 60 | 560 | **$85,340** |

---

## Technology Stack

### Frontend
- **React 18+** with TypeScript
- **Next.js** — Full-stack framework, server-side rendering, API routes
- **Tailwind CSS** — Rapid UI development
- **Shadcn/ui** — Component library
- **React Query** — Data fetching and caching

### Backend
- **Next.js API Routes** + **tRPC** — Type-safe API layer
- **PostgreSQL** — Primary database (via Supabase or Neon)
- **Prisma** — ORM and database migrations
- **Redis** — Caching, session management
- **Supabase Auth** — Authentication, row-level security

### Infrastructure
- **Vercel** — Hosting and deployment (free tier to start, scales with traffic)
- **Supabase** — Database, auth, storage (free tier includes 500MB DB, 1GB storage)
- **Resend** — Transactional email
- **Stripe** — Subscription billing
- **Cloudflare R2** — File/photo storage (free egress)

### Integrations (Post-MVP)
- **QuickBooks Online API** — Invoice sync, time entry export
- **Google Workspace** — Calendar, Drive, Gmail
- **Microsoft 365** — Outlook, OneDrive
- **Autodesk Platform Services** — DWG file viewing (AutoCAD integration)

### Estimated Monthly Infrastructure Cost

| Service | Free Tier | Paid Tier (at scale) |
|---------|-----------|---------------------|
| Vercel | Free (hobby) | $20/mo (Pro) |
| Supabase | Free (500MB) | $25/mo (Pro) |
| Resend | Free (100/day) | $20/mo |
| Stripe | 2.9% + $0.30/txn | Same |
| Cloudflare R2 | Free (10GB) | ~$5/mo |
| Domain | — | $12/year |
| **Total** | **$0/month** | **~$70-90/month** |

---

## MVP Plan

### MVP Scope (Months 1-3)

The MVP focuses on the #1 pain point: **"I don't know if my projects are profitable until it's too late."**

**MVP Features (Phase 1):**
1. **Project Dashboard** — Create projects with phases, status, basic info
2. **Fee/Budget Tracker** — Set fee per phase, track hours burned, real-time burn rate
3. **Time Tracking** — Per-project, per-phase time entry with weekly views
4. **Basic Reporting** — Project profitability summary, utilization report
5. **User Management** — Invite team members, roles (admin, PM, staff)
6. **Stripe Billing** — Subscription management, free trial

**MVP NOT included (deferred):**
- Submittal/RFI manager (Phase 2)
- Plant schedule manager (Phase 2)
- Construction administration tools (Phase 2)
- Client portal (Phase 3)
- Compliance tracker (Phase 3)
- Integrations (Phase 3)

### MVP Development Timeline

| Week | Milestone |
|------|-----------|
| 1-2 | Database schema, auth, project CRUD, basic dashboard UI |
| 3-4 | Fee/budget tracking, phase management, time entry |
| 5-6 | Reporting, user management, team invitations |
| 7-8 | Stripe integration, onboarding flow, landing page |
| 9-10 | Beta testing with 5-10 LA firms, bug fixes |
| 11-12 | Launch on Product Hunt, ASLA channels, direct outreach |

### Phase 2 Features (Months 4-8)
- Submittal & RFI Manager
- Plant Schedule Manager
- Change Order Tracking
- Field Reports (basic)
- Mobile-responsive improvements

### Phase 3 Features (Months 9-14)
- Client Portal
- Punch List Mobile App
- Compliance Tracker (MWELO, LEED, SITES)
- QuickBooks Integration
- AutoCAD DWG Viewer

### Phase 4 Features (Months 15-20)
- Resource Planner / Utilization Dashboard
- Proposal Builder
- Cost Estimator
- AI-Powered Features (report generation, project queries)
- Contractor Coordination Portal

---

## Go-to-Market Strategy

### Pre-Launch (Months 1-3)

1. **Landing page** at phasewise.com — waitlist signup with "Get early access" CTA
2. **ASLA community engagement** — Join forums, LinkedIn groups, attend local chapter events
3. **Content marketing** — Blog posts on LA firm operations, productivity, technology
4. **Beta recruitment** — 10 firms for free beta access in exchange for feedback
5. **Kevin's network** — Caltrans colleagues, ASLA connections, university contacts

### Launch (Month 3-4)

1. **Product Hunt launch** — "Monograph for Landscape Architecture"
2. **ASLA Newsletter / Magazine** — Paid placement or editorial pitch
3. **LinkedIn organic** — Kevin posts about building the product, LA industry insights
4. **Reddit** — r/LandscapeArchitecture, r/SaaS, r/SideProject
5. **Direct email outreach** — 500 LA firms from ASLA directory

### Growth (Months 4-12)

1. **ASLA Conference & Expo** — Booth or demo session (annual event, ~6,000 attendees)
2. **Free tools / lead magnets** — MWELO calculator, plant schedule template, project budget template
3. **Webinars** — "How top LA firms track project profitability" (educational, not salesy)
4. **Partnerships** — Land F/X, AutoCAD resellers, LA university programs
5. **Referral program** — 1 month free for each referred firm that subscribes
6. **SEO content** — Target "landscape architecture project management," "LA firm software," etc.

### Expansion (Year 2+)

1. **Architecture firms** — Expand feature set to serve general architecture
2. **Civil engineering firms** — Add engineering-specific modules
3. **International** — UK, Australia, Canada (English-speaking, similar industry structure)
4. **Marketplace** — Third-party integrations, templates, plant databases

---

## Financial Projections

### Revenue Projections

| Month | Subscribers | MRR | Cumulative Revenue |
|-------|-----------|-----|--------------------|
| 3 | 10 (beta) | $0 (free beta) | $0 |
| 6 | 30 | $4,470 | $13,410 |
| 9 | 60 | $8,940 | $40,230 |
| 12 | 100 | $14,900 | $89,400 |
| 18 | 250 | $37,250 | $246,150 |
| 24 | 450 | $67,050 | $603,600 |
| 30 | 560 | **$83,440** | $1,054,200 |

### Cost Projections (Months 1-12)

| Category | Monthly Cost | Notes |
|----------|-------------|-------|
| Infrastructure | $0-90 | Free tiers initially, scales with users |
| Domain + email | $15 | phasewise.com + Google Workspace |
| Stripe fees | 2.9% of MRR | ~$430/mo at 100 subs |
| Marketing | $200-500 | Content, small ad tests |
| Legal (one-time) | $2,000-3,000 | Terms of service, privacy policy |
| **Total Monthly (Year 1)** | **$300-1,000** | |

### Break-Even Analysis

| Metric | Value |
|--------|-------|
| Monthly operating cost (at scale) | ~$2,000 |
| Average revenue per subscriber | $149 |
| **Break-even subscribers** | **14** |
| Projected month to break-even | **Month 5-6** |

### Path to $83K/month

| Milestone | Subscribers | Monthly ARR | Target Month |
|-----------|-----------|-------------|-------------|
| Break-even | 14 | $2,086 | Month 5-6 |
| $10K MRR | 67 | $10,000 | Month 9-12 |
| $25K MRR | 168 | $25,000 | Month 14-16 |
| $50K MRR | 336 | $50,000 | Month 20-24 |
| **$83K MRR** | **560** | **$83,440** | **Month 28-32** |

---

## Risk Assessment

### High Risk

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Slow adoption** — LA firms are conservative, slow to adopt new tools | Delays revenue timeline | Free beta, white-glove onboarding, free data migration, educational content |
| **Monograph expands to LA** — Adds landscape-specific features | Direct competition | Move fast, build LA-specific moat (plant schedules, MWELO, irrigation), establish brand before they enter |
| **Churn** — Firms try it but don't stick | Revenue loss | Focus on onboarding, ensure time-to-value under 1 week, monthly check-ins |

### Medium Risk

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Small market ceiling** — 8,500 firms may limit growth | Revenue cap | Expand to architecture + civil engineering (51,500 firms total) |
| **Price sensitivity** — Small firms resist paying $99-199/month | Lower ARPU | Offer Starter at $99 as entry point, prove ROI in first month |
| **Feature creep** — Building too much too soon | Delayed launch | Strict MVP scope, launch with budget/time tracking first |
| **Solo founder bandwidth** — Building while working full-time at Caltrans | Slow development | Start with MVP, leverage existing React/TS skills, use AI tools to accelerate |

### Low Risk

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Technical risk** — Standard web app, no novel technology | Minimal | Proven stack (Next.js, Supabase, Stripe) |
| **Regulatory risk** — SaaS for professional services is well-established | Minimal | Standard terms of service, SOC 2 later |
| **Economic downturn** — LA firms cut software spend | Temporary | Tool saves money (replaces 3-4 subscriptions), ROI is clear |

---

## Opportunities for Scaling

### Stepped Approach to Growth

**Step 1: Dominate LA firm niche (Months 1-18)**
- Be THE project management tool for landscape architects
- Achieve 200+ subscribers, strong brand recognition in ASLA community
- Build case studies and testimonials

**Step 2: Expand to architecture firms (Months 12-24)**
- Add architecture-specific features (fee structures, programming, space planning)
- Position as "Monograph alternative" with better pricing and more features
- TAM expands from 8,500 to 31,500 firms

**Step 3: Expand to civil engineering (Months 18-30)**
- Add engineering-specific modules (RFI workflows, specification management)
- Target small civil firms with similar pain points
- TAM expands to 51,500 firms

**Step 4: Platform play (Months 24-36)**
- Third-party integrations marketplace
- Template marketplace (project templates, specification libraries, plant databases)
- AI-powered features (automated report generation, scope analysis, cost estimation)
- API access for custom workflows

**Step 5: Acquisition or Scale (Months 36+)**
- At $1M+ ARR with LA niche dominance, multiple paths:
  - Continue scaling to AEC breadth
  - Raise VC to accelerate (Monograph raised $20M+)
  - Acquisition target for Autodesk, Deltek, Trimble, or PE roll-up

### Unique Expansion Opportunities

1. **MWELO Calculator as lead magnet** — Free tool drives LA firms to the platform (California has 40M people, every new landscape needs MWELO compliance)
2. **ASLA partnership** — Official "recommended tool" status would unlock the entire member base
3. **University pipeline** — Partner with LA programs (Harvard GSD, UC Berkeley, Cal Poly) — students learn Phasewise, bring it to their first jobs
4. **Plant database network effect** — As firms add plants, the database becomes more valuable, creating switching costs
5. **Verifield templates as marketing** — Use existing n8n automation templates as free lead gen for Phasewise

---

## Founder Qualifications

**Kevin Gallo — Founder & CEO**
- Senior Landscape Architect at Caltrans (California Department of Transportation)
- Deep domain expertise in project management, construction administration, and regulatory compliance for landscape architecture
- Technical skills: React/TypeScript, n8n automation, SharePoint/SPFx, Power Automate, 3D modeling
- Built and launched 10 digital products on Gumroad/Etsy (Verifield Inc.)
- Understands both the problem space (as a practitioner) and the solution space (as a developer)

**Unfair advantage:** Most SaaS founders spend months doing customer discovery to understand their market. Kevin already has years of firsthand experience with every pain point this product addresses.

---

## Appendix: Key Data Sources

- ASLA (American Society of Landscape Architects) — asla.org
- IBISWorld Report 54132 — Landscape Architects in the US
- Bureau of Labor Statistics — Occupational Outlook Handbook, SOC 17-1012
- Deltek Clarity Report — Annual AEC industry benchmark study
- PSMJ Resources — AEC financial benchmarking
- Zweig Group — AEC firm management surveys
- CLARB — Council of Landscape Architectural Registration Boards

---

---

## Brand Identity: Why "Phasewise"

### Naming Process

The original working name was "PowerKG" (Power Kinetic Growth), using the founder's initials. A comprehensive naming analysis was conducted in April 2026 evaluating the name against:

- **Industry alignment** — How the name resonates with landscape architecture professionals
- **Competitive landscape** — Naming patterns of successful AEC software (Monograph, Deltek, Harvest, Factor AE)
- **Target customer identity** — LA firm principals and PMs are designers who value craft, nature, and clarity over corporate/industrial language
- **Trademark and domain availability** — Conflict checking against existing software products

### Why PowerKG Was Replaced

1. **"KG" was opaque** — Founder initials mean nothing to customers. In the metric system LA firms use daily, "kg" reads as kilogram. In tech, it reads as knowledge graph.
2. **"Power" was tonally wrong** — Connotes heavy industry and enterprise IT, not the design sensitivity and craft that landscape architects identify with. Compare to Monograph (intellectual, design-world) and Harvest (warm, natural).
3. **Poor googleability** — Searches returned noise about power software, kilogram measurements, and Microsoft Power Platform.

### Why Phasewise Won

Over 40 alternative names were researched, including Sightline, Canopy, Verdant, Ridgeline, Clearsite, Planform, Terrace, Gradia, Fieldmark, Datumline, Scopeline, and Swale. Most had significant trademark conflicts with existing software products:

- **Canopy** — $70M-funded SaaS company (getcanopy.com)
- **Ridgeline** — Major SaaS by Dave Duffield (PeopleSoft/Workday founder)
- **Sightline** — Multiple software companies (cybersecurity, BI, defense)
- **Planform** — Existing AEC PDF measurement tool (direct conflict)
- **Clearsite** — Active facility management app
- **Verdant** — Crowded namespace (5+ software companies)

**Phasewise** was selected because:

1. **No trademark conflicts** — No existing software product uses this name
2. **Domain availability** — phasewise.com, .io, and .app appear acquirable
3. **Communicates the differentiator** — Phase-based project management is what separates this product from generic PM tools. The name says it immediately.
4. **Professional tone** — Matches the intellectual, design-aware identity of LA professionals without being corporate or clinical
5. **Passes the "tell a friend" test** — "We use Phasewise to track our projects" sounds natural and self-explanatory
6. **Multi-industry scalability** — The name is not LA-specific, enabling expansion to other phase-based industries (architecture, construction, civil engineering, agriculture) without rebranding

### Multi-Industry Brand Architecture (Future)

The name "Phasewise" is industry-agnostic by design, enabling a platform strategy:

| Product | Market | Phase Structure |
|---------|--------|----------------|
| **Phasewise** (core) | Landscape Architecture | PD → SD → DD → CD → Bid → CA → Closeout |
| **Phasewise CM** | Construction Management | Pre-Con → Mobilization → Construction → Closeout |
| **Phasewise AE** | Architecture & Engineering | Programming → SD → DD → CD → CA |
| **Phasewise AG** | Agriculture | Planning → Planting → Growing → Harvest → Fallow |

Each vertical would share the core platform (time tracking, budgets, profitability, dashboards) but add industry-specific phase types, terminology, compliance features, and integrations. This architecture enables expansion from a $1B LA market to the $50B+ AEC market without a rebrand.

---

*Phasewise — Phase-based project intelligence for design professionals.*
*Built by a landscape architect, for landscape architects.*
