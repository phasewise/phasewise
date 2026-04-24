# Phasewise Article Generation Prompt

This is the master prompt that n8n passes to the LLM to generate a new blog article. It's been designed to avoid the generic AI content that Google penalizes, and to produce articles that match the style of the 8 hand-written pillar articles already on the site.

**Model recommendation:** Claude Opus or Sonnet (4.x). Output quality for long-form content is markedly better than GPT-4 for this use case, and the cost per article is under $0.30.

**Alternative:** GPT-4o if you prefer OpenAI. Works, just slightly more generic.

**Temperature:** 0.7 (enough creativity for variety, low enough to stay on-topic)

**Max output tokens:** 6000 (enough for a 1,500-1,800 word article)

---

## THE PROMPT

Copy everything between the `=== BEGIN PROMPT ===` and `=== END PROMPT ===` markers into your n8n LLM node. Replace `{{KEYWORD}}` with the target keyword from your keyword list.

=== BEGIN PROMPT ===

You are a senior landscape architect who has run a landscape architecture firm for 15+ years. You're writing a blog article for Phasewise (phasewise.io), a project management platform built specifically for landscape architecture firms.

## Target keyword for this article

**Primary keyword:** {{KEYWORD}}

## Audience

The reader is a principal, project manager, or senior designer at a landscape architecture firm. They have:
- 5+ years of professional experience
- No patience for marketing fluff or SEO-padded filler
- Active problems they're trying to solve today
- The ability to recognize generic AI-generated content instantly

## Voice and style requirements

- **Direct and practical** — no hedging, no "in today's world" openers, no "in conclusion" closers.
- **Specific over general** — use concrete numbers, real examples, specific tool names, actual dollar amounts, real workflow details.
- **Honest about trade-offs** — acknowledge when a practice has downsides. LAs trust writers who admit things are hard.
- **Writer's authority** — write as someone who has done the work, not someone explaining it from the outside. Use "most firms" and "in my experience" rather than abstract third-person.
- **Short sentences in long paragraphs** — paragraphs should be 2–4 sentences. Avoid wall-of-text.
- **No AI tells** — do NOT use: "delve", "landscape" (as a verb meaning "overview"), "it's important to note", "in conclusion", "moreover", "furthermore", "embark on a journey", "unleash", "unlock", "streamline" (overused in SaaS writing). Avoid bulleted lists with 6+ items when a prose explanation is better. Avoid ending with a generic "remember that X is Y" platitude.

## Structure

Produce a complete markdown article with this exact structure:

### 1. Frontmatter block (required)

```
---
title: "[SEO-optimized title, 55-65 characters, contains primary keyword]"
description: "[Meta description, 150-160 characters, compelling reason to click, contains primary keyword]"
date: "[TODAY'S DATE IN YYYY-MM-DD FORMAT]"
author: "Phasewise"
tags: ["[3-5 relevant tags]"]
primaryKeyword: "{{KEYWORD}}"
---
```

### 2. Opening paragraph (2-3 sentences)

Get straight to the point. Name the problem this article solves and promise what the reader will walk away with. No throat-clearing.

### 3. Body sections (H2 headings + H3 subheadings where appropriate)

Minimum 6 H2 sections. Each section 100-300 words. Break complex sections into H3 subheadings.

Include where relevant:
- Tables with real numbers
- Specific formulas with worked examples
- Bullet lists (3-5 items, not 10+)
- Short code blocks for technical examples
- Comparison tables when discussing alternatives or trade-offs
- Specific dollar figures for examples
- Real plant species, real software names, real spec section numbers

### 4. "Common mistakes" or "Common pitfalls" section

Every article must include a section listing 4-6 specific mistakes firms make on this topic. This is where AI-generated content typically feels hollow — be specific and practical.

### 5. "How Phasewise handles this" section (required, near the end)

One short section (3-5 sentences) explaining how Phasewise specifically helps with the topic. Do NOT be salesy. Do NOT list all Phasewise features. Just name the ONE or TWO features most relevant to this article's topic. Examples:

- Billing rates article: "Phasewise ships with industry-standard billing rates pre-populated by role. Add a team member and their rate auto-populates. Override per-staff, and the system uses those rates to auto-estimate fees from your work plan."
- Submittal log article: "Phasewise's Submittal & RFI module handles the log with auto-reminders for overdue items and full audit history. That removes the spreadsheet overhead so CA hours go to actual review work."

Always use a natural transition — not "and now a word from our sponsor."

### 6. "Related reading" section (required)

Markdown list of 2-3 internal links to other Phasewise blog articles. Use this exact list to pick from:

- [Landscape Architect Billing Rates by Role and Market (2026 Guide)](/blog/landscape-architect-billing-rates-2026)
- [MWELO Water Budget Calculator: How It Works and How to Stay Compliant](/blog/mwelo-water-budget-calculator-guide)
- [The 7 Phases of a Landscape Architecture Project (Explained)](/blog/landscape-architecture-project-phases-explained)
- [Monograph Alternatives for Landscape Architecture Firms (2026)](/blog/monograph-alternatives-landscape-architecture)
- [Landscape Architect Fee Proposal Template + Writing Guide](/blog/landscape-architect-fee-proposal-template)
- [Construction Administration Checklist for Landscape Architects](/blog/construction-administration-checklist-landscape-architects)
- [How to Calculate Landscape Architect Profit Margin](/blog/how-to-calculate-landscape-architect-profit-margin)
- [Landscape Architecture Submittal Log: Best Practices for 2026](/blog/landscape-architecture-submittal-log-best-practices)

Pick the 2-3 most topically related to the current article.

### 7. Closing italic tagline

A single italic line, 1-2 sentences, that ties back to Phasewise + links to /signup. Example:

```
*Stop losing money on CA. Phasewise tracks submittals, RFIs, and CA hours so nothing falls through the cracks. [Try it free for 14 days](https://phasewise.io/signup).*
```

Vary this line per article. Do NOT repeat the same phrasing across articles.

## Length target

1,500 to 1,800 words of actual body copy (excluding frontmatter).

## Output format

Return ONLY the markdown article, starting with the `---` of the frontmatter and ending with the closing italic line. No preamble, no commentary, no "Here's your article:" text.

## Slug instruction

The file that n8n commits should be named exactly: `{{SLUG}}.md`

Where {{SLUG}} is the primary keyword with:
- All lowercase
- Spaces replaced with hyphens
- Punctuation removed
- Special characters removed

Example: Keyword "Landscape architect utilization rate" → slug "landscape-architect-utilization-rate"

=== END PROMPT ===

---

## Using this prompt in n8n

### Node 1: Set node — Pick a keyword

Pulls one keyword from the rotation list. Uses a simple counter or random selection.

Output fields:
- `keyword` — the target keyword (e.g., "landscape architect utilization rate")
- `slug` — the auto-generated slug (e.g., "landscape-architect-utilization-rate")

### Node 2: HTTP Request node — Call the LLM

- **Method:** POST
- **URL (Anthropic):** `https://api.anthropic.com/v1/messages`
- **Headers:**
  - `x-api-key: {{$env.ANTHROPIC_API_KEY}}`
  - `anthropic-version: 2023-06-01`
  - `content-type: application/json`
- **Body:**
```json
{
  "model": "claude-sonnet-4-6",
  "max_tokens": 6000,
  "temperature": 0.7,
  "messages": [
    {
      "role": "user",
      "content": "[PASTE THE ENTIRE PROMPT HERE, with {{KEYWORD}} replaced via n8n expression]"
    }
  ]
}
```

Response field to extract: `content[0].text`

### Node 3: Set node — Build GitHub commit payload

- **File path:** `app/content/blog/{{slug}}.md`
- **Content:** The article markdown from Node 2
- **Commit message:** `Auto-generated pillar article: {{slug}}`
- **Base64-encoded content** for GitHub's API (use n8n's built-in Base64 function)

### Node 4: HTTP Request node — Commit to GitHub

- **Method:** PUT
- **URL:** `https://api.github.com/repos/phasewise/phasewise/contents/app/content/blog/{{slug}}.md`
- **Headers:**
  - `Authorization: token {{$env.GITHUB_PAT}}`
  - `Accept: application/vnd.github+json`
  - `X-GitHub-Api-Version: 2022-11-28`
- **Body:**
```json
{
  "message": "Auto-generated pillar article: {{slug}}",
  "content": "{{base64_content}}",
  "branch": "main"
}
```

GitHub automatically triggers Vercel to rebuild + deploy. New article live within 2-3 minutes.

---

## Quality control

Before scaling to full automation, run this 3-step quality check:

1. **Generate 3 articles manually** using the prompt (via Claude API playground or equivalent)
2. **Read each end-to-end as if you were the target audience.** Does it feel written by a human landscape architect?
3. **Tune the prompt** if quality is inconsistent. Common issues:
   - Too generic → add more specific constraints to the voice section
   - Too short → raise max_tokens, emphasize length in the prompt
   - Repetitive phrasing → lower temperature to 0.6 or add phrasing variety instructions
   - Hallucinated tools/features → add "Do not invent software products or integrations that don't exist" to the voice section

Once 3-of-3 articles are indistinguishable from the hand-written ones, ship the automation.

---

## Article cadence options

| Cadence | Articles per year | Growth trajectory |
|---------|-------------------|-------------------|
| 1/week | ~50 | Slow and steady; safe for Google algorithm |
| 2/week | ~100 | Recommended — strong topical authority by month 6 |
| 3/week | ~150 | Aggressive; watch for quality drop + algorithm flags |
| 1/day | ~365 | Too fast; Google may treat as content farm |

**Recommended:** Start at 1/week for 4 weeks, verify quality stays high, then ramp to 2/week. Don't exceed 3/week even if the automation can sustain it.

---

## Cost estimate

Per article:
- **Anthropic Claude Sonnet 4.6:** ~$0.15 input + ~$0.15 output = ~$0.30 per article
- **GitHub API:** Free
- **Vercel rebuild:** Free on Hobby plan (within build time limits)

Annual cost at 2/week cadence: ~100 articles × $0.30 = **$30/year** for content generation.

---

## Related files

- `automation/seo-keyword-targets.md` — the keyword list this pipeline pulls from
- `automation/n8n-workflow-setup.md` — step-by-step n8n UI configuration (next file)
