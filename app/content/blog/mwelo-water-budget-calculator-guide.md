---
title: "MWELO Water Budget Calculator: How It Works and How to Stay Compliant"
description: "A practical guide to California's Model Water Efficient Landscape Ordinance (MWELO). Learn how the MAWA and ETWU calculations work, when MWELO applies, and how to build a compliant water budget for your landscape plans."
date: "2026-04-23"
author: "Phasewise"
tags: ["MWELO", "compliance", "California", "irrigation"]
primaryKeyword: "MWELO water budget calculator"
---

If you're doing landscape architecture work in California, MWELO compliance isn't optional. The Model Water Efficient Landscape Ordinance sets mandatory water budgets for most new and rehabilitated landscapes. This guide explains how the math works, when it applies, and how to build a water budget that passes permit review on the first submission.

## What MWELO is (the short version)

MWELO is California's statewide regulation that limits how much water a new or renovated landscape can use annually. It was first adopted in 2009 and significantly tightened in 2015 after the drought. Local agencies enforce it, but the state sets the floor.

The core idea: calculate the landscape's **maximum allowable water budget** based on area, climate, and plant water needs. Your design must not exceed it.

## When MWELO applies

MWELO applies to landscape projects that meet these thresholds:

- **New landscapes:** 500 sq ft or greater (with permits, plan checks, or design review from a local agency)
- **Rehabilitated landscapes:** 2,500 sq ft or greater
- **Developer-installed residential:** 500 sq ft or greater
- **Homeowner-installed residential:** 5,000 sq ft or greater (many local agencies lower this)

**Important:** Local agencies can adopt stricter versions than state MWELO. Always check the local ordinance before assuming the state thresholds apply.

## The two key numbers: MAWA and ETWU

MWELO compliance comes down to two calculations:

- **MAWA** — Maximum Applied Water Allowance (the budget — how much water the landscape is *allowed* to use)
- **ETWU** — Estimated Total Water Use (the actual — how much water your design *will* use)

Your design passes if **ETWU ≤ MAWA**.

### Calculating MAWA (the allowance)

The formula is:

```
MAWA = (ETo) × (0.62) × [(ETAF × LA) + ((1 − ETAF) × SLA)]
```

Where:

- **ETo** — Reference evapotranspiration for your region (look up in the [DWR Reference ETo map](https://cimis.water.ca.gov/) or Appendix A of the MWELO text)
- **0.62** — Conversion factor from inches to gallons per square foot per year
- **ETAF** — Evapotranspiration Adjustment Factor = **0.55 for residential**, **0.45 for non-residential** landscapes
- **LA** — Total landscape area in square feet (excluding Special Landscape Areas)
- **SLA** — Special Landscape Area (edible gardens, recreational turf, areas using recycled water)

The SLA term uses 1.0 as the factor because these areas can use as much as ETo (a higher allowance).

### Calculating ETWU (the actual use)

The formula is:

```
ETWU = (ETo) × (0.62) × Σ [(PF × HA / IE) + SLA]
```

Where:

- **PF** — Plant Factor for each hydrozone (low = 0.1–0.3, moderate = 0.4–0.6, high = 0.7–1.0)
- **HA** — Hydrozone Area in square feet
- **IE** — Irrigation Efficiency (0.75 for spray, 0.81 for drip, higher for MP rotators)
- **SLA** — Special Landscape Area contribution (computed at PF = 1.0)

You sum the water use across all hydrozones in the design.

## Worked example

Let's say you're designing a 4,000 sq ft residential front yard in Sacramento. ETo = 51.9 inches/year.

**MAWA:**
- No SLA (no edible gardens or turf exceptions)
- ETAF = 0.55 (residential)
- LA = 4,000 sq ft
- MAWA = 51.9 × 0.62 × (0.55 × 4,000) = **70,792 gallons/year**

**ETWU (your design):**
- Hydrozone 1 (low water — natives): PF=0.2, HA=2,800 sq ft, IE=0.81 (drip)
- Hydrozone 2 (moderate — shrubs): PF=0.5, HA=1,200 sq ft, IE=0.81 (drip)
- HZ1: 51.9 × 0.62 × (0.2 × 2,800 / 0.81) = **22,283 gallons**
- HZ2: 51.9 × 0.62 × (0.5 × 1,200 / 0.81) = **23,855 gallons**
- ETWU total = **46,138 gallons/year**

Result: ETWU (46,138) < MAWA (70,792). The design complies with 35% margin to spare.

## Hydrozones — the key to passing MWELO

A hydrozone is a grouping of plants with similar water needs, irrigated as a unit. MWELO effectively forces the use of hydrozones because it requires you to declare plant factors per zone.

Typical hydrozone plant factors:

| Category | Plant Factor | Examples |
|----------|--------------|----------|
| Very Low | 0.0–0.1 | Cacti, succulents, unirrigated natives |
| Low | 0.1–0.3 | Most natives, Mediterranean plants, mature drought-tolerant |
| Moderate | 0.4–0.6 | Mixed ornamentals, mixed shrubs |
| High | 0.7–1.0 | Traditional lawn, tropicals, annuals |

Turf areas larger than modest patches in residential front yards essentially fail MWELO on their own — they burn too much of your MAWA budget.

## What reviewers look for

When a plan check reviewer evaluates your MWELO submittal, they're looking for:

1. **Landscape Documentation Package** with site plan, planting plan, irrigation plan, and water budget calculations.
2. **Clear hydrozone delineation** on the planting plan with plant factor assignments.
3. **Correct ETo value** for the project location (not just the nearest city).
4. **Irrigation efficiency values** matching the specified irrigation method (spray vs drip vs rotator).
5. **Recycled water notation** if SLA applies.
6. **Soil management report** for certain projects (usually non-residential over 1 acre).
7. **Certificate of Completion** signed by the landscape architect after installation.

Missing any of these sends the submittal back for revisions, adding weeks to the permit timeline.

## Common MWELO mistakes

- **Using a plant factor of 0.5 "as a default" for shrubs.** Reviewers will push back. Use actual published plant factors from WUCOLS IV.
- **Forgetting the irrigation efficiency term.** IE in the denominator means you need to *divide by it*, which *increases* water use. People who forget this under-report their ETWU.
- **Treating all turf as SLA.** Only *recreational* turf (playing fields, parks with programmed use) qualifies as SLA. Front-yard lawn does not.
- **Assuming local = state.** Many cities and counties have stricter ordinances. Check first.

## How Phasewise helps

Phasewise includes a built-in MWELO calculator that handles the math for you. Enter your hydrozones, plant factors, areas, and irrigation method — the system computes MAWA, ETWU, and generates a printable water budget report formatted for plan check submission.

It also tracks the calculation against your project so you can re-run it as the design changes, without rebuilding a spreadsheet each time.

---

*MWELO compliance doesn't have to eat a day of your week. Phasewise automates the calculation and formats the deliverable so you can focus on the actual design.*
