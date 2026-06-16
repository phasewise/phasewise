/**
 * White-glove migration script.
 *
 * Bulk-imports clients, staff invitations, projects, and project phases
 * into a customer's org. Used by the team to populate a new customer's
 * Phasewise account from their existing spreadsheet/CSV data within
 * minutes instead of having them manually re-enter everything.
 *
 * USAGE:
 *
 *   npx tsx scripts/import-org-data.ts \
 *     --org-id=<organizationId> \
 *     [--clients=path/to/clients.csv] \
 *     [--staff=path/to/staff.csv] \
 *     [--projects=path/to/projects.csv] \
 *     [--phases=path/to/phases.csv] \
 *     [--dry-run]
 *
 * Each CSV is optional. Imports run in dependency order: clients first
 * (no deps) → staff invitations → projects (linked to clients by name)
 * → phases (linked to projects by projectNumber).
 *
 * --dry-run parses the CSVs and validates linkage but writes nothing.
 *
 * CSV FORMATS — see scripts/migration-templates/ for reference templates.
 *
 *   clients.csv columns:
 *     name, contactPerson, email, phone, address, city, state, zip
 *
 *   staff.csv columns:
 *     fullName, email, role, title, billingRate, salary
 *     - role must be one of: OWNER, ADMIN, SUPERVISOR, PM, STAFF, READ_ONLY
 *     - staff are imported as PENDING INVITATIONS — the customer's
 *       team-management UI sends the invitations from there
 *
 *   projects.csv columns:
 *     name, projectNumber, clientName, city, projectType, status,
 *     contractFee, startDate, targetCompletion, contractNumber,
 *     billingCadence
 *     - clientName is matched (case-insensitive) against clients.csv
 *     - status defaults to ACTIVE
 *     - billingCadence defaults to MONTHLY
 *     - dates accept YYYY-MM-DD or MM/DD/YYYY
 *
 *   phases.csv columns:
 *     projectNumber, phaseType, customName, budgetedFee, budgetedHours, sortOrder
 *     - phaseType must be one of: PRE_DESIGN, SCHEMATIC_DESIGN,
 *       DESIGN_DEVELOPMENT, CONSTRUCTION_DOCUMENTS, BIDDING,
 *       CONSTRUCTION_ADMIN, CLOSEOUT, OTHER
 *     - if no phases.csv is provided, projects are created with no phases
 *       (the standard new-project flow adds the default 7-phase template)
 */

import { parse } from "csv-parse/sync";
import fs from "node:fs";
import path from "node:path";
import { PrismaClient, type Prisma, PhaseType, PhaseStatus, ProjectStatus, UserRole, BillingCadence } from "@prisma/client";

const prisma = new PrismaClient();

type Args = {
  orgId?: string;
  clients?: string;
  staff?: string;
  projects?: string;
  phases?: string;
  dryRun: boolean;
};

function parseArgs(argv: string[]): Args {
  const out: Args = { dryRun: false };
  for (const arg of argv.slice(2)) {
    if (arg === "--dry-run") {
      out.dryRun = true;
      continue;
    }
    const m = arg.match(/^--([a-z-]+)=(.+)$/);
    if (!m) continue;
    const [, key, value] = m;
    switch (key) {
      case "org-id":
        out.orgId = value;
        break;
      case "clients":
      case "staff":
      case "projects":
      case "phases":
        out[key] = value;
        break;
    }
  }
  return out;
}

function readCsv<T extends Record<string, string>>(filePath: string): T[] {
  const raw = fs.readFileSync(filePath, "utf-8");
  return parse(raw, {
    columns: (header: string[]) => header.map((h) => h.trim()),
    skip_empty_lines: true,
    trim: true,
    relax_quotes: true,
    relax_column_count: true,
  }) as T[];
}

function decimalOrUndefined(v: string | undefined): Prisma.Decimal.Value | undefined {
  if (!v || v.trim() === "") return undefined;
  // Strip $, commas, whitespace
  const clean = v.replace(/[$,\s]/g, "");
  const n = Number(clean);
  if (!Number.isFinite(n)) return undefined;
  return n;
}

function dateOrUndefined(v: string | undefined): Date | undefined {
  if (!v || v.trim() === "") return undefined;
  // Accept YYYY-MM-DD or M/D/YYYY etc.
  const t = v.trim();
  let m = t.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (m) return new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  m = t.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (m) return new Date(Date.UTC(+m[3], +m[1] - 1, +m[2]));
  const d = new Date(t);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

async function importClients(orgId: string, csvPath: string, dryRun: boolean) {
  type Row = {
    name: string;
    contactPerson?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
  const rows = readCsv<Row>(csvPath);
  console.log(`\n→ Clients: ${rows.length} rows in ${path.basename(csvPath)}`);
  const created: Record<string, string> = {}; // name (lowercase) → id
  let skipped = 0;

  for (const row of rows) {
    const name = row.name?.trim();
    if (!name) {
      console.warn(`  skip: row missing name — ${JSON.stringify(row)}`);
      skipped++;
      continue;
    }
    if (dryRun) {
      created[name.toLowerCase()] = "DRY_RUN_ID";
      console.log(`  [dry-run] would create client: ${name}`);
      continue;
    }
    // Upsert by (orgId, name) case-insensitive
    const existing = await prisma.client.findFirst({
      where: { organizationId: orgId, name: { equals: name, mode: "insensitive" } },
    });
    if (existing) {
      created[name.toLowerCase()] = existing.id;
      console.log(`  exists: ${name} (skip)`);
      continue;
    }
    const c = await prisma.client.create({
      data: {
        organizationId: orgId,
        name,
        contactPerson: row.contactPerson || undefined,
        email: row.email || undefined,
        phone: row.phone || undefined,
        address: row.address || undefined,
        city: row.city || undefined,
        state: row.state || undefined,
        zip: row.zip || undefined,
      },
    });
    created[name.toLowerCase()] = c.id;
    console.log(`  created: ${name}`);
  }
  console.log(`  done: ${rows.length - skipped} processed, ${skipped} skipped`);
  return created;
}

async function importStaff(orgId: string, csvPath: string, dryRun: boolean) {
  type Row = {
    fullName: string;
    email: string;
    role?: string;
    title?: string;
    billingRate?: string;
    salary?: string;
  };
  const rows = readCsv<Row>(csvPath);
  console.log(`\n→ Staff: ${rows.length} rows in ${path.basename(csvPath)} — created as PENDING INVITATIONS`);
  let created = 0;
  let skipped = 0;

  for (const row of rows) {
    const email = row.email?.trim().toLowerCase();
    if (!email) {
      console.warn(`  skip: row missing email — ${row.fullName}`);
      skipped++;
      continue;
    }
    let role: UserRole = UserRole.STAFF;
    if (row.role) {
      const r = row.role.trim().toUpperCase();
      if (r in UserRole) role = UserRole[r as keyof typeof UserRole];
      else {
        console.warn(`  warn: invalid role "${row.role}" for ${email} — defaulting to STAFF`);
      }
    }
    if (dryRun) {
      console.log(`  [dry-run] would invite ${email} as ${role}`);
      created++;
      continue;
    }
    // Skip if user already exists or invitation pending
    const existingUser = await prisma.user.findFirst({
      where: { organizationId: orgId, email: { equals: email, mode: "insensitive" } },
    });
    if (existingUser) {
      console.log(`  exists: ${email} is already a user (skip)`);
      skipped++;
      continue;
    }
    const existingInvite = await prisma.invitation.findFirst({
      where: { organizationId: orgId, email: { equals: email, mode: "insensitive" }, acceptedAt: null },
    });
    if (existingInvite) {
      console.log(`  exists: ${email} has pending invite (skip)`);
      skipped++;
      continue;
    }
    await prisma.invitation.create({
      data: {
        organizationId: orgId,
        email,
        role,
        // 30-day invitation window — long enough for migration onboarding
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });
    // billingRate / salary / title are set when the user accepts the
    // invite and completes the onboarding — we attach a metadata note
    // so the customer's team-management UI can pre-fill those defaults
    // (handled in a follow-up phase; for now we just create the invite).
    console.log(`  invited: ${email} (${role}${row.title ? ` — ${row.title}` : ""})`);
    created++;
  }
  console.log(`  done: ${created} invitations created, ${skipped} skipped`);
}

async function importProjects(
  orgId: string,
  csvPath: string,
  clientNameToId: Record<string, string>,
  createdById: string,
  dryRun: boolean,
) {
  type Row = {
    name: string;
    projectNumber?: string;
    clientName?: string;
    city?: string;
    projectType?: string;
    status?: string;
    contractFee?: string;
    startDate?: string;
    targetCompletion?: string;
    contractNumber?: string;
    billingCadence?: string;
  };
  const rows = readCsv<Row>(csvPath);
  console.log(`\n→ Projects: ${rows.length} rows in ${path.basename(csvPath)}`);
  const created: Record<string, string> = {}; // projectNumber → id
  let skipped = 0;

  for (const row of rows) {
    const name = row.name?.trim();
    if (!name) {
      console.warn(`  skip: row missing name`);
      skipped++;
      continue;
    }
    const clientLookup = row.clientName?.trim().toLowerCase();
    const clientId = clientLookup ? clientNameToId[clientLookup] : undefined;
    if (clientLookup && !clientId) {
      console.warn(`  warn: client "${row.clientName}" not found — project "${name}" created without client linkage`);
    }
    let status: ProjectStatus = ProjectStatus.ACTIVE;
    if (row.status) {
      const s = row.status.trim().toUpperCase().replace(/[\s-]/g, "_");
      if (s in ProjectStatus) status = ProjectStatus[s as keyof typeof ProjectStatus];
    }
    let cadence: BillingCadence = BillingCadence.MONTHLY;
    if (row.billingCadence) {
      const c = row.billingCadence.trim().toUpperCase();
      if (c in BillingCadence) cadence = BillingCadence[c as keyof typeof BillingCadence];
    }
    if (dryRun) {
      console.log(`  [dry-run] would create project: ${name} (client=${row.clientName || "—"})`);
      if (row.projectNumber) created[row.projectNumber] = "DRY_RUN_ID";
      continue;
    }
    const p = await prisma.project.create({
      data: {
        organizationId: orgId,
        name,
        projectNumber: row.projectNumber || undefined,
        clientId,
        clientName: row.clientName || undefined,
        city: row.city || undefined,
        projectType: row.projectType || undefined,
        status,
        contractFee: decimalOrUndefined(row.contractFee),
        startDate: dateOrUndefined(row.startDate),
        targetCompletion: dateOrUndefined(row.targetCompletion),
        contractNumber: row.contractNumber || undefined,
        billingCadence: cadence,
        createdById,
      },
    });
    if (row.projectNumber) created[row.projectNumber] = p.id;
    console.log(`  created: ${name}${row.projectNumber ? ` (${row.projectNumber})` : ""}`);
  }
  console.log(`  done: ${rows.length - skipped} processed, ${skipped} skipped`);
  return created;
}

async function importPhases(csvPath: string, projectNumberToId: Record<string, string>, dryRun: boolean) {
  type Row = {
    projectNumber: string;
    phaseType: string;
    customName?: string;
    budgetedFee?: string;
    budgetedHours?: string;
    sortOrder?: string;
  };
  const rows = readCsv<Row>(csvPath);
  console.log(`\n→ Phases: ${rows.length} rows in ${path.basename(csvPath)}`);
  // Track sort order per project so we don't duplicate
  const sortByProject: Record<string, number> = {};
  let created = 0;
  let skipped = 0;

  for (const row of rows) {
    const projectId = projectNumberToId[row.projectNumber?.trim() ?? ""];
    if (!projectId) {
      console.warn(`  skip: phase row references unknown projectNumber "${row.projectNumber}"`);
      skipped++;
      continue;
    }
    const ptKey = row.phaseType?.trim().toUpperCase().replace(/[\s-]/g, "_") ?? "";
    if (!(ptKey in PhaseType)) {
      console.warn(`  skip: invalid phaseType "${row.phaseType}" for ${row.projectNumber}`);
      skipped++;
      continue;
    }
    const phaseType = PhaseType[ptKey as keyof typeof PhaseType];
    const sortOrder = row.sortOrder ? Number(row.sortOrder) : (sortByProject[projectId] = (sortByProject[projectId] ?? 0) + 1);
    if (dryRun) {
      console.log(`  [dry-run] would create phase: ${row.projectNumber}/${phaseType}`);
      created++;
      continue;
    }
    await prisma.projectPhase.create({
      data: {
        projectId,
        phaseType,
        customName: row.customName || undefined,
        status: PhaseStatus.NOT_STARTED,
        budgetedFee: decimalOrUndefined(row.budgetedFee),
        budgetedHours: decimalOrUndefined(row.budgetedHours),
        sortOrder,
      },
    });
    console.log(`  created: ${row.projectNumber}/${phaseType}`);
    created++;
  }
  console.log(`  done: ${created} phases created, ${skipped} skipped`);
}

async function main() {
  const args = parseArgs(process.argv);
  if (!args.orgId) {
    console.error("ERROR: --org-id=<uuid> is required");
    process.exit(1);
  }
  if (!args.clients && !args.staff && !args.projects && !args.phases) {
    console.error("ERROR: at least one CSV must be provided (--clients, --staff, --projects, --phases)");
    process.exit(1);
  }

  // Sanity check the org exists + grab the OWNER's user id (used as
  // createdBy for imported projects)
  const org = await prisma.organization.findUnique({
    where: { id: args.orgId },
    include: { users: { where: { role: UserRole.OWNER, isActive: true }, take: 1 } },
  });
  if (!org) {
    console.error(`ERROR: organization ${args.orgId} not found`);
    process.exit(1);
  }
  const owner = org.users[0];
  if (!owner) {
    console.error(`ERROR: organization ${args.orgId} has no active OWNER — cannot set createdBy for projects`);
    process.exit(1);
  }
  console.log(`Target org: ${org.name} (${org.id})`);
  console.log(`Imports attributed to: ${owner.fullName} <${owner.email}>`);
  if (args.dryRun) console.log(`MODE: DRY RUN — nothing will be written`);

  let clientNameToId: Record<string, string> = {};
  if (args.clients) {
    clientNameToId = await importClients(args.orgId, args.clients, args.dryRun);
  }
  if (args.staff) {
    await importStaff(args.orgId, args.staff, args.dryRun);
  }
  let projectNumberToId: Record<string, string> = {};
  if (args.projects) {
    projectNumberToId = await importProjects(args.orgId, args.projects, clientNameToId, owner.id, args.dryRun);
  }
  if (args.phases) {
    if (Object.keys(projectNumberToId).length === 0) {
      console.warn("\nWARN: --phases provided but no projects were imported — phases need matching projectNumbers from this run");
    }
    await importPhases(args.phases, projectNumberToId, args.dryRun);
  }

  console.log(`\n✓ Import complete for ${org.name}`);
  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error("\n✗ Import failed:", err);
  await prisma.$disconnect();
  process.exit(1);
});
