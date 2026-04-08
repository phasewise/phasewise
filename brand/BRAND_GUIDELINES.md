# Phasewise Brand Guidelines

## Brand Identity

**Name:** Phasewise (one word, capital P, lowercase w)
**Tagline:** Phase-based project intelligence for design professionals
**Short tagline:** Project management for landscape architects
**URL:** phasewise.io

---

## Logo

The Phasewise logo consists of two elements: the **phase mark** (ascending bars with a growth arc) and the **wordmark**.

### Logo Concept

The five ascending bars represent the phases of a landscape architecture project progressing from Pre-Design through Closeout. The connecting arc above them suggests upward trajectory — projects moving forward, budgets tracked, profitability visible. The increasing opacity represents growing clarity as data accumulates.

### Logo Files

| File | Use Case |
|------|----------|
| `logos/phasewise-logo-full.svg` | Primary logo — light backgrounds |
| `logos/phasewise-logo-full-dark.svg` | Primary logo — dark backgrounds |
| `logos/phasewise-icon.svg` | Icon mark — dark rounded square |
| `logos/phasewise-icon-light.svg` | Icon mark — emerald rounded square |

### Logo Usage Rules

- Always maintain clear space around the logo equal to the height of one phase bar
- Never stretch, rotate, or recolor the logo
- Minimum size: 120px wide for full logo, 32px for icon
- The wordmark always reads "Phase" in the primary text color + "wise" in emerald

---

## Color Palette

### Primary Colors

| Color | Hex | Use |
|-------|-----|-----|
| **Emerald 500** | `#10B981` | Primary brand color, CTAs, accent |
| **Emerald 400** | `#34D399` | Logo on dark backgrounds, hover states |
| **Slate 900** | `#0F172A` | Dark backgrounds, primary text on light |
| **Slate 50** | `#F8FAFC` | Light backgrounds, text on dark |

### Secondary Colors

| Color | Hex | Use |
|-------|-----|-----|
| **Slate 500** | `#64748B` | Secondary text |
| **Slate 400** | `#94A3B8` | Muted text, descriptions |
| **Slate 800** | `#1E293B` | Borders on dark, card backgrounds |
| **Slate 200** | `#E2E8F0` | Borders on light |

### Status Colors (In-App)

| Color | Hex | Use |
|-------|-----|-----|
| **Green** | `#10B981` | On track, active, healthy |
| **Yellow** | `#EAB308` | At risk, warning (80-95% burn) |
| **Red** | `#EF4444` | Over budget, critical (95%+) |
| **Sky** | `#0EA5E9` | Informational, neutral status |
| **Violet** | `#8B5CF6` | Metrics, averages |

---

## Typography

### Primary Font

**Inter** — Used across the entire product and brand materials.

- **Headlines:** Inter Bold (700), tracking -1 to -2
- **Body text:** Inter Regular (400)
- **Labels/captions:** Inter Medium (500), uppercase, tracking widened (0.24em)
- **Numbers/data:** Inter Semibold (600)

### Font Stack

```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

---

## Social Media Assets

### Profile Pictures

| File | Size | Platform |
|------|------|----------|
| `social/profile-picture.svg` | 400x400 | LinkedIn, GitHub |
| `social/profile-picture-icon-only.svg` | 400x400 | X/Twitter, Instagram |

Use the icon-only version for platforms where the name appears next to the profile picture. Use the full version with wordmark where the image stands alone.

### Banners

| File | Size | Platform |
|------|------|----------|
| `social/banner-linkedin.svg` | 1584x396 | LinkedIn Company Page |
| `social/banner-x-twitter.svg` | 1500x500 | X/Twitter header |

### Exporting for Upload

SVG files can be converted to PNG for upload using any of:
- Browser: open SVG, screenshot at correct resolution
- Figma: import SVG, export as PNG at 2x
- CLI: `npx svgexport file.svg file.png 2x`
- Online: svgtopng.com

**Recommended export sizes:**
- Profile pictures: 400x400 PNG
- LinkedIn banner: 1584x396 PNG
- Twitter banner: 1500x500 PNG
- Favicon: 32x32 PNG + 180x180 PNG (Apple touch icon)

---

## Tone of Voice

### Brand Personality

- **Professional but approachable** — We speak to firm principals, not IT departments
- **Direct and clear** — No jargon, no buzzwords, no "leverage synergies"
- **Confident but not arrogant** — We know this industry; we don't need to shout about it
- **Design-aware** — Our customers are designers; our brand should reflect that sensibility

### Writing Guidelines

| Do | Don't |
|----|-------|
| "Track project profitability in real time" | "Leverage AI-powered analytics for holistic project visibility" |
| "Know if you're over budget before it's too late" | "Optimize your firm's financial performance metrics" |
| "Built by a landscape architect" | "Founded by an industry thought leader" |
| "Your projects have phases — now your software does too" | "A revolutionary paradigm shift in project management" |

### Key Messages

1. **For firm principals:** "Know if your projects are profitable in real-time, not after it's too late."
2. **For PMs:** "Track budgets by phase. See burn rates instantly. Stop guessing."
3. **For staff:** "Log time in 30 seconds. On your phone, from the field."
4. **Differentiator:** "The only project management platform built specifically for landscape architecture firms."

---

## Favicon

| File | Use |
|------|-----|
| `favicons/favicon.svg` | Modern browsers (SVG favicon) |

For full favicon support, export the SVG to:
- `favicon.ico` — 32x32 (legacy browsers)
- `apple-touch-icon.png` — 180x180 (iOS)
- `favicon-192.png` — 192x192 (Android/PWA)
- `favicon-512.png` — 512x512 (PWA splash)

---

## Domain Strategy

| Domain | Role | Status |
|--------|------|--------|
| **phasewise.io** | Primary — app, website, email | Owned |
| **getphasewise.com** | Redirect to phasewise.io, marketing | Owned |
| **phasewise.com** | Future acquisition target | For sale ($4,888 listed, negotiate to ~$1,500) |
| **phasewise.app** | Future acquisition target | Registered by unknown party |
