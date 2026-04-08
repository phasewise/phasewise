# PowerKG — Proof of Concept (POC) Scope
## MVP Technical Specification

---

## POC Objective

Build a working proof of concept that demonstrates the core value proposition: **"Know if your projects are profitable in real-time, not after it's too late."**

The POC should be deployable, demo-ready, and usable by 5-10 beta firms within 8-10 weeks.

---

## Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Framework | **Next.js 14+ (App Router)** | Full-stack React, SSR, API routes, Kevin's TS expertise |
| Language | **TypeScript** | Type safety, better DX, Kevin's primary language |
| UI | **Tailwind CSS + Shadcn/ui** | Rapid development, professional look, accessible components |
| Database | **PostgreSQL via Supabase** | Free tier, real-time subscriptions, auth built-in, row-level security |
| ORM | **Prisma** | Type-safe database access, easy migrations |
| Auth | **Supabase Auth** | Email/password + Google OAuth, team invitations |
| Payments | **Stripe** | Subscriptions, free trial, customer portal |
| Email | **Resend** | Transactional emails (invites, notifications, reports) |
| Hosting | **Vercel** | Zero-config deployment, preview environments, free tier |
| Storage | **Supabase Storage** | File uploads (logos, attachments) |

---

## Database Schema (MVP)

### Core Tables

```
organizations
├── id (uuid, PK)
├── name (text)
├── slug (text, unique)
├── plan (enum: trial, starter, professional, studio)
├── stripe_customer_id (text)
├── stripe_subscription_id (text)
├── trial_ends_at (timestamp)
├── created_at (timestamp)

users
├── id (uuid, PK, matches Supabase auth.users)
├── organization_id (uuid, FK → organizations)
├── full_name (text)
├── email (text)
├── role (enum: owner, admin, pm, staff)
├── billing_rate (decimal) — hourly rate for fee calculations
├── is_active (boolean)
├── created_at (timestamp)

projects
├── id (uuid, PK)
├── organization_id (uuid, FK → organizations)
├── name (text)
├── project_number (text) — firm's internal project number
├── client_name (text)
├── client_email (text)
├── status (enum: active, on_hold, completed, archived)
├── start_date (date)
├── target_completion (date)
├── description (text)
├── created_by (uuid, FK → users)
├── created_at (timestamp)

project_phases
├── id (uuid, PK)
├── project_id (uuid, FK → projects)
├── phase_type (enum: pre_design, schematic_design, design_development, construction_documents, bidding, construction_admin, closeout)
├── status (enum: not_started, in_progress, complete)
├── budgeted_fee (decimal) — contracted fee for this phase
├── budgeted_hours (decimal) — estimated hours for this phase
├── start_date (date)
├── end_date (date)
├── sort_order (integer)

time_entries
├── id (uuid, PK)
├── organization_id (uuid, FK → organizations)
├── user_id (uuid, FK → users)
├── project_id (uuid, FK → projects)
├── phase_id (uuid, FK → project_phases)
├── date (date)
├── hours (decimal)
├── description (text)
├── is_billable (boolean, default true)
├── created_at (timestamp)

weekly_timesheets
├── id (uuid, PK)
├── user_id (uuid, FK → users)
├── week_start (date) — Monday of the week
├── status (enum: draft, submitted, approved)
├── submitted_at (timestamp)
├── approved_by (uuid, FK → users)
├── approved_at (timestamp)
```

### Indexes

```
time_entries: (organization_id, date)
time_entries: (project_id, phase_id)
time_entries: (user_id, date)
projects: (organization_id, status)
project_phases: (project_id, sort_order)
```

---

## MVP Features Specification

### F1: Authentication & Organization Setup

**User stories:**
- As a firm owner, I can sign up with email or Google, creating my organization
- As an owner, I can invite team members via email
- As a team member, I can accept an invitation and join the organization
- As an owner, I can set roles (admin, PM, staff) for team members

**Screens:**
- `/signup` — Registration with organization name
- `/login` — Email/password + Google OAuth
- `/invite/[token]` — Accept invitation
- `/settings/team` — Manage team members, roles, billing rates

### F2: Project Dashboard

**User stories:**
- As a PM, I can see all active projects with their current phase and budget status
- As a PM, I can quickly identify projects that are at risk (over budget or behind schedule)
- As a principal, I can see firm-wide project health at a glance

**Screens:**
- `/dashboard` — Grid/list of all projects with:
  - Project name & number
  - Client name
  - Current phase (visual phase indicator)
  - Budget burn rate (progress bar: green/yellow/red)
  - Hours used vs. budgeted
  - Status badge (on track, at risk, over budget)
  - Next milestone / deadline

**Key metrics displayed:**
- Total active projects
- Firm-wide utilization rate
- Projects at risk (>90% budget burned before phase complete)
- Revenue this month vs. last month

### F3: Project Detail & Phase Management

**User stories:**
- As a PM, I can create a new project with phases and fee allocations
- As a PM, I can see real-time hours burned vs. budgeted per phase
- As a PM, I can update phase status as work progresses
- As a PM, I can see who has logged time on my project this week

**Screens:**
- `/projects/new` — Create project form:
  - Project name, number, client info
  - Select applicable phases (checkboxes for standard LA phases)
  - Set fee and estimated hours per phase
  - Set start date and target completion
- `/projects/[id]` — Project detail:
  - Phase timeline (visual, like a Gantt but simpler)
  - Per-phase budget tracker (fee / hours budgeted / hours used / % burned)
  - Alerts when approaching 75%, 90%, 100% of budget
  - Recent time entries on this project
  - Team members assigned

### F4: Time Tracking

**User stories:**
- As a staff member, I can log time against a project and phase
- As a staff member, I can view and edit my weekly timesheet
- As a PM, I can see who logged time on my projects
- As an admin, I can approve submitted timesheets

**Screens:**
- `/time` — Weekly timesheet grid:
  - Rows: project + phase combinations
  - Columns: Mon-Sun
  - Cell: hours input
  - Add row: select project → phase
  - Total hours per day, per project, grand total
  - Submit button
- `/time/approve` — (admin) List of submitted timesheets to approve

**Quick entry:**
- Timer option: start/stop timer that creates a time entry
- Quick add: project dropdown → phase → hours → description → save

### F5: Reports

**User stories:**
- As a principal, I can see project profitability across all projects
- As a PM, I can see a detailed budget report for a specific project
- As an admin, I can see team utilization (hours logged vs. available hours)

**Reports (MVP):**
- **Project Profitability** — All projects: fee, hours budgeted, hours used, burn %, effective hourly rate
- **Team Utilization** — Per person: hours logged this week/month, utilization % (vs. 40hr target)
- **Project Detail** — Single project: per-phase breakdown, team hours, burn rate chart

### F6: Subscription Billing (Stripe)

**User stories:**
- As a new user, I get a 14-day free trial
- As a trial user, I can enter payment info and subscribe
- As a subscriber, I can manage my subscription (upgrade, cancel)
- As a subscriber, I can view invoices

**Integration:**
- Stripe Checkout for initial subscription
- Stripe Customer Portal for self-service management
- Webhook handling for subscription lifecycle events
- Enforce plan limits (user count, project count)

---

## Page Architecture

```
/                           → Marketing landing page
/login                      → Login
/signup                     → Register + create organization
/invite/[token]             → Accept team invitation

/dashboard                  → Project dashboard (main view)
/projects/new               → Create new project
/projects/[id]              → Project detail + phases + budget
/projects/[id]/edit         → Edit project

/time                       → Weekly timesheet
/time/approve               → Approve team timesheets (admin)

/reports                    → Report selector
/reports/profitability      → Project profitability report
/reports/utilization        → Team utilization report
/reports/project/[id]       → Single project detail report

/settings                   → Organization settings
/settings/team              → Team management + invitations
/settings/billing           → Stripe subscription management
/settings/profile           → Personal profile
```

---

## UI Design Direction

- **Dark-optional, light-default** — Professional feel, not "startup playful"
- **Data-dense** — LA principals want information, not whitespace
- **Dashboard-first** — Most important screen, should feel like a command center
- **Color coding** — Green (on track), Yellow (at risk), Red (over budget) — universal
- **Typography** — Clean sans-serif (Inter or similar), monospace for numbers
- **Mobile-responsive** — Time entry must work on phone (field visits)

---

## MVP Non-Functional Requirements

| Requirement | Target |
|-------------|--------|
| Page load time | < 2 seconds |
| Time to first meaningful paint | < 1 second |
| Uptime | 99.5% (Vercel + Supabase SLA) |
| Data backup | Supabase daily backups (automatic) |
| Security | HTTPS, Supabase RLS, bcrypt passwords |
| Browser support | Chrome, Safari, Edge (latest 2 versions) |
| Mobile | Responsive design, time entry optimized for phone |

---

## Development Milestones

| Week | Deliverable | Definition of Done |
|------|------------|-------------------|
| 1 | Project scaffolding, DB schema, auth | Can sign up, log in, create org |
| 2 | Project CRUD, phase management | Can create projects with phases and fees |
| 3 | Dashboard view | Can see all projects with status/budget indicators |
| 4 | Time tracking - basic entry | Can log hours against project/phase |
| 5 | Time tracking - weekly view | Full timesheet grid, submit/approve workflow |
| 6 | Budget tracking + alerts | Real-time burn rate, alerts at thresholds |
| 7 | Reports | Profitability, utilization, project detail reports |
| 8 | Stripe integration | Trial, subscribe, manage, enforce limits |
| 9 | Landing page, onboarding flow | Marketing site, smooth first-run experience |
| 10 | Beta launch | Deploy, recruit 5-10 firms, collect feedback |

---

## Success Metrics (MVP)

| Metric | Target (3 months post-launch) |
|--------|-------------------------------|
| Beta signups | 50+ |
| Paid conversions (from trial) | 10-15 |
| Monthly active users (logging time weekly) | 30+ |
| Trial-to-paid conversion rate | 20-30% |
| Monthly churn rate | < 5% |
| NPS score | > 40 |
| Time to value (first "aha" moment) | < 30 minutes |

---

## What Makes This POC Compelling

1. **Solves the #1 pain point immediately** — Project profitability visibility
2. **Works with existing stack** — Doesn't require changing CAD, accounting, or email tools
3. **5-minute setup** — Create org, add a project, log first time entry
4. **Visible ROI** — First over-budget alert pays for a year of subscription
5. **LA-native language** — Phase names, terminology, and workflows match how LA firms actually work
6. **Beautiful but functional** — Not another boring enterprise tool

---

*Next step: Start building. Week 1 = database schema + auth + project CRUD.*
