---
title: "Plant Schedule Template for Landscape Architecture Firms"
description: "A practical guide to building plant schedule templates that hold up through CDs, contractor RFIs, and field changes. Written for working LA firms."
slug: "plant-schedule-template-landscape-architecture"
date: "2026-06-03"
author: "Phasewise"
tags: ["plant schedule", "landscape architecture", "construction documents", "project management", "planting design"]
primaryKeyword: "plant schedule template landscape architecture"
---

A plant schedule is one of the most referenced documents on any planting project, and it's also one of the most frequently botched. Contractors pull quantities from it, nurseries quote against it, and inspectors use it to verify installation. When the schedule is inconsistent, vague, or out of sync with the plan, you pay for it in RFIs, substitution requests, and punch list disputes.

## What a Plant Schedule Actually Needs to Do

A plant schedule template for landscape architecture isn't just a list of plants. It's a coordination document that has to serve at least four different audiences simultaneously: your drafting team, the contractor, the nursery or procurement agent, and the owner's representative. Each of those audiences needs something slightly different from the same table.

Your drafter needs symbol codes that match the plan exactly. The contractor needs clear callouts for container size, minimum caliper, and installation method. The nursery needs botanical names, common names, and enough specificity to source correctly. The owner's rep needs something readable enough to understand what they're getting without a botany degree.

A template that doesn't account for all four will generate friction somewhere. Usually it generates friction everywhere, just at different phases.

## The Core Fields Every Template Should Include

The minimum viable plant schedule for a commercial or institutional project includes: symbol, botanical name, common name, quantity, container or B&B size, minimum caliper or height at installation, spacing, and remarks. That's the floor.

Beyond that baseline, the fields you add depend on project type. On a public works project, you may need to include CalTrans or Caltrans-equivalent source documentation fields. On a water-sensitive design project in the Southwest, you'll want WUCOLS zone and water use category. On a project with a phased planting plan, you need a phase column or a separate schedule per phase.

One field that gets skipped constantly: a substitution column or a "pre-approved alternate" field. When a specified plant isn't available, contractors will substitute anyway. If your schedule has no mechanism for pre-approved alternates, you'll spend hours on RFIs that could have been resolved during the CD phase.

## How to Structure Your Template File

Most firms use AutoCAD or Revit for their base templates, with the plant schedule embedded as a table or block. That works, but it creates a synchronization problem: the quantities in the schedule have to match the plan, and any time the plan changes, someone has to manually update the table. That someone is usually a junior designer who may or may not catch every delta.

A better approach is to maintain the plant schedule as a linked or externally referenced file — a spreadsheet that feeds the table in the drawing, or at minimum a spreadsheet that runs parallel and gets reconciled before every submission. Excel or Google Sheets both work. The point is that the schedule lives in one place and gets updated in one place.

Some firms use Vectorworks, which has a built-in plant database and can auto-generate schedules from placed symbols. That's a genuine advantage if your team is already working in Vectorworks. If you're not, it's not a reason to switch — but it's worth knowing the capability exists.

## Quantity Takeoffs and Where They Go Wrong

The most common source of schedule errors isn't bad data — it's manual counting. Someone counts the symbols on the plan, enters a number, and then the plan gets revised. The count doesn't get updated because the revision was "minor." Three minor revisions later, the schedule is off by 15 shrubs and two trees.

Quantity takeoffs should be done programmatically wherever possible. In AutoCAD, that means using block attributes and COUNT functions or a script. In Vectorworks, it's the plant list report. In Revit with a landscape workflow, it's a schedule view. If you're working in a platform that doesn't support automated counting, build a manual reconciliation step into your QC checklist and assign it to a specific person at each submission milestone.

The reconciliation step should happen before the schedule goes out, not after a contractor calls with a discrepancy. Catching a quantity error at 60% CD costs you 20 minutes. Catching it after bid opening costs you a change order negotiation and a damaged relationship with the contractor.

## Formatting for Constructability

A plant schedule that's technically correct but hard to read in the field is still a problem. Contractors and inspectors are reading these documents on tablets in direct sunlight, or printing them at 11x17 on a job site printer. Font size, column width, and row height matter.

Minimum readable font size for a printed schedule is 8pt. Anything smaller gets misread. Botanical names should be in italics — that's a professional standard, and it also helps visually separate them from common names in a dense table. Use alternating row shading if your schedule has more than 15 species. It sounds like a small thing, but it reduces transcription errors when someone is cross-referencing between the plan and the schedule.

Keep remarks concise. "Install per detail 3/L-5, 3-stake per arborist standard" is useful. "Contractor shall verify all plant material meets the specified standards as outlined in the project specifications and as directed by the landscape architect of record" is a liability hedge that belongs in the specs, not the schedule.

## Keeping the Schedule Current Through Construction

The plant schedule doesn't stop being a live document at permit issuance. During construction, you'll deal with substitution requests, availability issues, and field changes that affect quantities. Every one of those changes needs to be reflected in an updated schedule, and that updated schedule needs to be issued as an ASI or RFI response with a revision number and date.

Firms that treat the plant schedule as a static CD deliverable end up with as-builts that don't match what was actually installed. That creates problems at project closeout, and it creates bigger problems if there's ever a warranty dispute or a plant failure claim.

Build a revision log into your template — a simple table at the bottom or on a separate tab that tracks what changed, when, and why. It takes two minutes to maintain and has saved us from disputes more than once.

## Common Mistakes Firms Make

**Mismatched symbols between plan and schedule.** The plan gets revised, a symbol gets swapped, and the schedule still references the old code. This is the single most common source of contractor confusion on planting plans.

**No botanical name verification.** Common names vary by region. "Privet" means different things in Georgia and California. Always lead with the botanical name, and verify it against a current reference — USDA PLANTS database is free and reliable.

**Container size specified as a range instead of a minimum.** "5-gallon or 15-gallon" gives a contractor permission to install the smaller size every time. Specify a minimum and hold to it.

**Forgetting to account for phasing in the quantities.** If a project is phased and you issue one combined schedule, contractors will sometimes order all material at once. Separate schedules per phase, or a clearly labeled phase column, prevents that.

**No pre-approved substitutes listed.** Availability changes between design and construction, especially for native species and specialty cultivars. A substitution list saves everyone time and keeps you in control of what gets installed.

**Issuing schedule updates without revision tracking.** When a revised schedule goes out without a clear revision number and delta cloud, contractors keep using the old one. They're not being careless — they just have no way to know what changed.

## How Phasewise Handles This

Phasewise is built around the reality that construction documents — including plant schedules — change constantly and need to stay synchronized with the rest of the project. The platform lets you attach schedule files directly to project phases and submission milestones, so the current version is always findable without digging through email threads. When a schedule gets revised, the revision is logged against the project timeline automatically. For firms managing multiple active projects, that traceability matters more than any individual feature.

## Related Reading

- [How to Manage Construction Document Phases in Landscape Architecture](/blog/construction-document-phases-landscape-architecture)
- [RFI Management for Landscape Architecture Firms](/blog/rfi-management-landscape-architecture)
- [Planting Plan QC Checklist Before Every Submission](/blog/planting-plan-qc-checklist)

---

*If your firm is still reconciling plant schedules manually across email and shared drives, [Phasewise](https://phasewise.io/signup) was built for exactly that problem.*