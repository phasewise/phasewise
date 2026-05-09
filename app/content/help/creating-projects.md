---
title: "Creating your first project"
description: "How to set up a project with phases, budgets, and staff assignments — and what each field actually drives."
category: "Projects"
order: 1
---

A project in Phasewise is the unit of work. Phases are the budget breakdown within a project. Staff get assigned to phases (not the project as a whole), which is how Work Plans, profitability reports, and time tracking all add up.

## Creating a project

Go to **Projects → New Project**. Fields:

- **Project name** — visible to the client on every invoice.
- **Project number** — auto-numbered using your firm's prefix (e.g. `PW-001`). Override only if you have a custom numbering convention.
- **Client name + email** — the email is used when you send invoices.
- **City, project type** — for filtering and grouping on the Projects list.
- **Contract fee** — the total agreed-upon fee. Drives profitability calculations.
- **Contract / Agreement number** — optional. Required by state and federal agencies and most enterprise APs. Renders on the invoice header.
- **Start date + target completion** — for dashboard timeline tracking.
- **Billing cadence** — `Monthly` (default; auto-invoicing cron runs on the 5th), `Milestone`, or `Manual`.

## Adding phases

Phasewise pre-loads the 7 standard LA phases:

- **PreD** — Pre-Design
- **SD** — Schematic Design
- **DD** — Design Development
- **CD** — Construction Documents
- **BID** — Bidding
- **CA** — Construction Administration
- **POC** — Post-Construction

You can add custom phases or rename phases per project. For each phase set:

- **Budgeted hours** — the cap before alerts trigger.
- **Budgeted fee** — the slice of contract fee allocated to this phase. Phasewise auto-suggests fee splits if you toggle on the auto-estimation, based on your team's billing rates × hours.

## Setting up the Work Plan

After saving the project, scroll down to the **Work Plan** section on the project edit page. For each phase, click **+ Add staff** and pick a team member. Enter their planned hours.

Two important things about Work Plans:

1. **Work Plans drive profitability reports.** When you assign a staff member with their billing rate to a phase, Phasewise can show you "if you stick to the plan, this phase will earn $X" before any time has been logged.
2. **Work Plans drive the staff-side "My Schedule" view.** Each staff member sees the phases they're assigned to and how their logged hours track against the plan.

Click **Save Work Plan** for each phase before clicking **Save all changes** at the bottom — work-plan edits save through a separate endpoint.

## What happens after creation

- The project shows up on **/projects** for everyone with visibility into it.
- Staff members assigned to phases see it on their **/time** Time Sheets dropdown so they can log hours.
- The auto-invoicing cron (runs on the 5th of every month) creates a draft invoice for it covering the prior month's approved billable hours, IF the billing cadence is `Monthly`.
- Budget alerts fire to the Owner when the project hits 75%, 90%, and 100% of total budgeted hours.

## Editing phases later

You can add, edit, or remove phases at any time on the project edit page. Note: removing a phase that already has logged time will fail with an error — Phasewise won't orphan time entries. To remove that phase, first re-assign or delete the time entries.
