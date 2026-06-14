export type DemoClip = {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  duration: string;
  bullets: string[];
  mp4: string;
  poster: string;
};

export const DEMO_CLIPS: DemoClip[] = [
  {
    slug: "dashboard",
    shortTitle: "Dashboard",
    title: "Dashboard + project health at a glance",
    description:
      "How Phasewise surfaces firm-wide project health, budgets, and at-risk projects in a single view.",
    duration: "1m 11s",
    bullets: [
      "Active / On Hold / Completed / Archived project groups",
      "Health badges turn yellow at 75% budget, red at 90%",
      "Top stats: active count, at-risk count, total fee, average burn rate",
      "Sidebar badges show what needs your attention",
    ],
    mp4: "/demo-clips/dashboard.mp4",
    poster: "/demo-clips/dashboard.jpg",
  },
  {
    slug: "projects",
    shortTitle: "Projects",
    title: "Project detail + work plan + phase budgets",
    description:
      "The operating screen for each engagement — standard LA phases, staff assignments, phase budgets that recalculate from billing rates.",
    duration: "1m 21s",
    bullets: [
      "7 standard LA phases (Pre-Design → CA) plus custom",
      "Work plan: assign staff to phases, hours, budgets auto-update",
      "Tasks per phase with due dates and assignees",
      "Contract number field for public-agency invoicing",
      "Project-level billing history with auto-invoice skip records",
    ],
    mp4: "/demo-clips/projects.mp4",
    poster: "/demo-clips/projects.jpg",
  },
  {
    slug: "timesheets",
    shortTitle: "Timesheets",
    title: "Time tracking, leave + PTO, approvals",
    description:
      "Weekly grid timesheet wired directly to projects. Separate paths for overhead/admin time and leave. Configurable approval workflow.",
    duration: "1m 19s",
    bullets: [
      "Grid: one row per project-phase, one column per day",
      "Separate overhead/admin categories so utilization stays accurate",
      "Leave + PTO with accrued or front-loaded policy modes",
      "Past weeks lock when approved; future weeks editable",
      "Save-as-schedule + apply-schedule for stable weekly mixes",
    ],
    mp4: "/demo-clips/timesheets.mp4",
    poster: "/demo-clips/timesheets.jpg",
  },
  {
    slug: "mwelo",
    shortTitle: "MWELO",
    title: "MWELO water budget calculator",
    description:
      "Built-in MAWA and ETWU calculator. The compliance work that normally takes 2-4 hours per submission, done in five minutes with a branded PDF report ready to attach.",
    duration: "1m 30s",
    bullets: [
      "Per-hydrozone inputs — area, irrigation type, plant water factor",
      "MAWA and ETWU calculated automatically; pass/fail flag",
      "Saved to project as a compliance item, editable any time",
      "Branded PDF export for submittal packages",
      "Summary chip on compliance row — scan all projects at once",
    ],
    mp4: "/demo-clips/mwelo.mp4",
    poster: "/demo-clips/mwelo.jpg",
  },
  {
    slug: "submittals",
    shortTitle: "Submittals",
    title: "Submittal log + ball-in-court tracking",
    description:
      "Every submittal logged with ball-in-court ownership. Automatic email reminders when items go overdue.",
    duration: "24s",
    bullets: [
      "Number, project, description, status, ball-in-court, due date",
      "Overdue filter shows what's been sitting too long",
      "Daily cron emails the ball-in-court person on overdue items",
      "Full per-submittal history for client status questions",
    ],
    mp4: "/demo-clips/submittals.mp4",
    poster: "/demo-clips/submittals.jpg",
  },
  {
    slug: "reports",
    shortTitle: "Reports",
    title: "Profitability + utilization reports",
    description:
      "Per-project, per-phase, per-person profitability using each staff member's actual rate — not a firm-wide blended average.",
    duration: "1m 7s",
    bullets: [
      "Profitability: budgeted fee, actual hours, labor cost, margin",
      "Color-coded green/amber/rose by margin percentage",
      "Team utilization: billable mix, util %, revenue per person",
      "Project Detail: per-phase burn, profit per phase",
    ],
    mp4: "/demo-clips/reports.mp4",
    poster: "/demo-clips/reports.jpg",
  },
  {
    slug: "invoicing",
    shortTitle: "Invoicing",
    title: "Invoice generation + auto-pull from timesheets",
    description:
      "Auto-numbered invoices that pull billable hours from approved timesheets. Monthly auto-invoicing cron drafts invoices on the 5th of every month.",
    duration: "1m 20s",
    bullets: [
      "Pull from timesheets — aggregates hours by person and phase",
      "Amber warning if any timesheets in the period aren't approved",
      "Nudge-to-submit button emails staff to submit unfinished weeks",
      "Branded invoice PDF with remit-to block, Fed ID, contract number",
      "Monthly auto-invoicing cron drafts on the 5th of every month",
    ],
    mp4: "/demo-clips/invoicing.mp4",
    poster: "/demo-clips/invoicing.jpg",
  },
];

export function getDemoClipBySlug(slug: string): DemoClip | undefined {
  return DEMO_CLIPS.find((c) => c.slug === slug);
}
