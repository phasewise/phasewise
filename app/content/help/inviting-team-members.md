---
title: "Inviting team members and setting permissions"
description: "Add staff, choose their role, set billing rates, and control who can create projects."
category: "Team & permissions"
order: 1
---

Phasewise has five permission levels: **Owner**, **Admin**, **Supervisor**, **PM**, and **Staff**. Owner is reserved for the firm principal and grants full access including billing. Lower roles narrow what each user can see and do.

## Adding a new team member

1. Go to **Settings → Team management**.
2. Click **Add member**.
3. Enter the person's full name, email, and pick a job title from the LA-specific list (Principal, Senior Associate, Landscape Architect, Designer 2-4 yrs, Junior, etc.). The title auto-sets a sensible permission level and billing rate default.
4. Override the billing rate or salary if your firm uses different numbers.
5. Click **Send invite**. A shareable invite link is generated and copied to your clipboard — paste it into Slack, email, or hand it to them in person.
6. The staff member clicks the link, sets their password, and lands in the dashboard.

Invite links expire after 7 days. If a link expires before the staff member uses it, click **Re-send invite** on their row to mint a new one.

## Permission levels at a glance

| Role | Sees | Can do |
| ---- | ---- | ------ |
| **Owner** | Everything | Manage billing, team, projects, all admin |
| **Admin** | Everything | Same as Owner except changing the Owner |
| **Supervisor** | All projects in firm | Approve timesheets, view reports |
| **PM** | Projects they're assigned to | Manage their projects' phases, work plans |
| **Staff** | Projects they're assigned to | Log time, view their schedule |

## Granting "Can create projects" to non-admins

By default, only Owners and Admins can create new projects. You can grant the permission to specific PMs, supervisors, or staff who run their own projects:

1. Click into the team member's row in **Settings → Team management**.
2. Scroll to the **Can create new projects** checkbox in the supervisor section.
3. Check it. Save.

That user now sees a **+ New Project** button on the Projects page. Owners and Admins can always create projects regardless of this setting.

## Backup supervisors

If your firm has approval gates (timesheets need supervisor sign-off before invoicing), set a **backup supervisor** on each team member. The backup gets the same approval privileges as the primary — useful when the primary is on vacation or out sick. Configure under each user's edit modal.

## Deactivating a team member

Click into a team member and toggle **Active** to off. Deactivated users:

- Lose dashboard access immediately
- Their assigned projects stay assigned (preserves project history)
- Their logged time stays in the database (preserves billing history)
- Their seat opens up if you're on a tier with seat limits

To fully delete a user, email **hello@phasewise.io** and we'll remove their data per your request.
