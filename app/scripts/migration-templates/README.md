# Migration CSV templates

These are reference templates for the white-glove migration script
(`scripts/import-org-data.ts`). When a Founding Member customer signs
up, the team collects their existing data (any format — spreadsheet,
Excel, QuickBooks export, hand-written notes), normalizes it into
these four CSVs, then runs the import script against their org.

## Files

| File | Purpose | Required? |
|---|---|---|
| `clients.csv` | Customer's client roster | Optional |
| `staff.csv` | Customer's team members (created as PENDING invitations) | Optional |
| `projects.csv` | Customer's projects | Optional |
| `phases.csv` | Standard LA phases per project (skip and let the in-app default-7 template populate later) | Optional |

Each CSV is optional — import whatever the customer has. Run order is
fixed: clients → staff → projects → phases. Linkages:

- Projects reference clients by `clientName` (case-insensitive match against `clients.csv`)
- Phases reference projects by `projectNumber` (string match against `projects.csv`)

## Running the importer

```bash
cd app

# Dry run first — validates parsing + linkages, writes nothing
npx tsx scripts/import-org-data.ts \
  --org-id=<UUID> \
  --clients=path/to/clients.csv \
  --staff=path/to/staff.csv \
  --projects=path/to/projects.csv \
  --phases=path/to/phases.csv \
  --dry-run

# Real run — drop --dry-run when the dry run looks clean
npx tsx scripts/import-org-data.ts \
  --org-id=<UUID> \
  --clients=path/to/clients.csv \
  --staff=path/to/staff.csv \
  --projects=path/to/projects.csv \
  --phases=path/to/phases.csv
```

## Finding the org-id for a customer

In Supabase dashboard → Table Editor → `organizations` table → search by
the customer's firm name → copy the `id` field.

Or via Prisma Studio (`npx prisma studio`) → Organization → filter.

## Format notes

### clients.csv

- `name` (required) — company or individual name. Used for project linkage.
- `contactPerson` — primary contact at the client
- `email`, `phone`, `address`, `city`, `state`, `zip` — all optional

### staff.csv

- `fullName` (required) — display name for the team member
- `email` (required) — invitation will be sent here
- `role` — one of OWNER, ADMIN, SUPERVISOR, PM, STAFF, READ_ONLY. Defaults to STAFF.
- `title`, `billingRate`, `salary` — optional. NOTE: these are not persisted on the Invitation row (Phasewise stores them on the User row after the invitee accepts the invite). The team-management UI lets the OWNER fill them in after invitation acceptance.

### projects.csv

- `name` (required) — project name
- `projectNumber` — required if you also import `phases.csv` (used for linkage). Otherwise optional but recommended.
- `clientName` — case-insensitive match against `clients.csv`. Logs a warning if no match. Project still created.
- `city`, `projectType` — free text
- `status` — one of ACTIVE, ON_HOLD, COMPLETED, ARCHIVED. Defaults to ACTIVE.
- `contractFee` — numeric. Strips `$` and `,` automatically.
- `startDate`, `targetCompletion` — accept `YYYY-MM-DD` or `M/D/YYYY`
- `contractNumber` — for public-agency invoicing (prints on invoice header)
- `billingCadence` — one of MONTHLY, MILESTONE, MANUAL. Defaults to MONTHLY.

### phases.csv

- `projectNumber` (required) — must match a project in `projects.csv` from the same run
- `phaseType` (required) — one of PRE_DESIGN, SCHEMATIC_DESIGN, DESIGN_DEVELOPMENT, CONSTRUCTION_DOCUMENTS, BIDDING, CONSTRUCTION_ADMIN, CLOSEOUT, OTHER
- `customName` — for OTHER phase types, the display name. For standard types, an override label.
- `budgetedFee`, `budgetedHours` — numeric
- `sortOrder` — explicit phase ordering. Omit and the script auto-numbers in CSV row order.

## Idempotency

- Clients: skipped if a client with the same name (case-insensitive) already exists in the org
- Staff: skipped if a User with the same email already exists, or if a pending Invitation is on file
- Projects: always created (no dedup) — if rerunning, delete prior imports first or risk duplicates
- Phases: always created — same caveat as projects

## After the import

1. Email the customer: "Your data has been loaded — sign in at phasewise.io to see your projects."
2. The customer's team-management UI shows pending invitations — they can resend any that haven't been claimed yet, or fill in title / billing rate / salary defaults on each invitation before sending.
3. The customer's project list shows all imported projects with the right client linkage. Phases (if imported) show on each project's detail page.
