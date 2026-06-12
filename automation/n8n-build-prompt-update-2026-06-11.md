# n8n Build prompt update — fix related-reading broken links

**Why:** The LLM was inventing internal blog URLs that don't exist (e.g.
`/blog/how-to-write-a-landscape-architecture-scope-of-work`), causing
404s on the "Related reading" section of every auto-generated article.
The hardcoded list in the prompt was being ignored.

**Fix:** Build the related-reading list dynamically from the actual list
of existing blog slugs (which the workflow already fetches from GitHub
for keyword deduplication). The LLM can ONLY pick from real URLs because
we hand it the canonical list at runtime. Plus stricter constraint
language.

## Deployment — paste into your existing n8n Build prompt node

1. Open n8n → workflow `Phasewise SEO Content` → click the **Build prompt** node
2. Select all the JavaScript currently in the code field (Ctrl+A)
3. Replace it with the entire block below
4. Save → Activate workflow if not already active

The next Friday auto-article will use the new prompt and ship with verified internal links.

```javascript
// =====================================================================
// KEYWORD PRIORITY LIST: rotation order based on seo-keyword-targets.md
// Topical clusters interleaved (PM, Project, Compliance, Software,
// Team & Ops, Plants & Specs) so Google sees consistent breadth.
// =====================================================================
const keywordList = [
  // Cluster 4 — Software (highest commercial intent first)
  'best software for landscape architects',
  // Cluster 1 — Practice Management
  'how to price landscape design projects',
  // Cluster 2 — Project Management
  'landscape architecture RFI process',
  // Cluster 3 — Compliance
  'MWELO compliance checklist California',
  // Cluster 6 — Plants & Specs
  'plant schedule template landscape architecture',
  // Cluster 4
  'BQE Core alternatives landscape architecture',
  // Cluster 1
  'how to calculate landscape architect fees',
  // Cluster 2
  'construction documents checklist landscape',
  // Cluster 3
  'ADA accessibility checklist site design',
  // Cluster 5 — Team & Ops
  'landscape architect salary survey 2026',
  // Cluster 4
  'landscape design firm time tracking software',
  // Cluster 1
  'landscape architecture firm overhead rate',
  // Cluster 2
  'landscape design punch list template',
  // Cluster 3
  'SITES certification guide landscape architecture',
  // Cluster 6
  'how to write landscape architecture specifications',
  // Cluster 1
  'landscape architect hourly rate vs fixed fee',
  // Cluster 2
  'change order process landscape architecture',
  // Cluster 3
  'LEED credits for landscape architects',
  // Cluster 5
  'landscape designer vs landscape architect career',
  // Cluster 4
  'AEC project management software comparison',
  // Cluster 6
  'plant substitution request form template',
  // Cluster 1
  'starting a landscape architecture firm checklist',
  // Cluster 2
  'landscape architect site observation report template',
  // Cluster 3
  'stormwater BMP landscape architecture',
  // Cluster 5
  'landscape architecture billable vs non-billable hours',
  // Cluster 4
  'landscape architecture billing software',
  // Cluster 6
  'native plant palette California landscape design',
  // Cluster 1
  'landscape architect retainer agreement template',
  // Cluster 2
  'landscape architect schedule of values',
  // Cluster 3
  'hydrozone plant factor reference WUCOLS',
  // Cluster 5
  'how to hire a landscape architect employee',
  // Cluster 4
  'best CRM for landscape architecture firms',
  // Cluster 6
  'drought tolerant plant schedule example',
  // Cluster 2
  'landscape design schematic vs design development',
  // Cluster 3
  'irrigation efficiency calculation landscape',
  // Cluster 5
  'landscape architecture firm bonus structure',
  // Cluster 6
  'tree protection plan landscape architecture',
  // Cluster 2
  'how to manage landscape architecture project scope',
  // Cluster 3
  'landscape architecture permit checklist',
  // Cluster 5
  'landscape architect licensure requirements by state'
];

// =====================================================================
// SLUG GENERATOR
// =====================================================================
function toSlug(keyword) {
  return keyword
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// =====================================================================
// SLUG-TO-TITLE for related-reading display text.
// Title-cases the slug, then fixes common abbreviations.
// =====================================================================
function slugToTitle(slug) {
  let title = slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
  title = title
    .replace(/\bMwelo\b/g, 'MWELO')
    .replace(/\bRfi\b/g, 'RFI')
    .replace(/\bAda\b/g, 'ADA')
    .replace(/\bLeed\b/g, 'LEED')
    .replace(/\bSites\b/g, 'SITES')
    .replace(/\bBqe\b/g, 'BQE')
    .replace(/\bAec\b/g, 'AEC')
    .replace(/\bWucols\b/g, 'WUCOLS')
    .replace(/\bQc\b/g, 'QC')
    .replace(/\bCrm\b/g, 'CRM')
    .replace(/\bCa\b/g, 'CA')
    .replace(/\bUs\b/g, 'US');
  return title;
}

// =====================================================================
// FIND FIRST UNUSED KEYWORD
// GitHub returns an array of file objects; each has a .name field.
// We strip .md to compare against our generated slugs.
// =====================================================================
const githubFiles = $input.first().json;
const existingFiles = Array.isArray(githubFiles) ? githubFiles : [];
const existingSlugs = new Set(
  existingFiles
    .filter(f => f.name && f.name.endsWith('.md'))
    .map(f => f.name.replace(/\.md$/, ''))
);

let keyword = null;
let slug = null;
for (const kw of keywordList) {
  const s = toSlug(kw);
  if (!existingSlugs.has(s)) {
    keyword = kw;
    slug = s;
    break;
  }
}

if (!keyword) {
  throw new Error(`All ${keywordList.length} keywords have been published. Add more keywords to the list in this Code node, OR rotate this list out for a new one. Existing slugs count: ${existingSlugs.size}`);
}

// =====================================================================
// DYNAMIC RELATED-READING LIST
// Build markdown bullets from the verified existing slugs so the LLM
// physically cannot invent URLs. Sorted alphabetically for stable prompts.
// =====================================================================
const relatedReadingList = [...existingSlugs]
  .sort()
  .map(s => `- [${slugToTitle(s)}](/blog/${s})`)
  .join('\n');

// Today's date for frontmatter
const today = new Date().toISOString().split('T')[0];

// =====================================================================
// PROMPT: Article generation prompt with quality constraints.
// =====================================================================
const prompt = `You are a senior landscape architect who has run a landscape architecture firm for 15+ years. You're writing a blog article for Phasewise (phasewise.io), a project management platform built specifically for landscape architecture firms.

## Target keyword for this article

**Primary keyword:** ${keyword}

## Audience

The reader is a principal, project manager, or senior designer at a landscape architecture firm. They have 5+ years of experience, no patience for marketing fluff or SEO-padded filler, active problems they're trying to solve, and the ability to recognize generic AI-generated content instantly.

## Voice and style requirements

- Direct and practical — no hedging, no "in today's world" openers, no "in conclusion" closers.
- Specific over general — concrete numbers, real examples, specific tool names, actual dollar amounts, real workflow details.
- Honest about trade-offs — acknowledge when a practice has downsides.
- Writer's authority — write as someone who has done the work.
- Short sentences in long paragraphs (2-4 sentences each).
- DO NOT use: "delve", "landscape" as a verb, "it's important to note", "in conclusion", "moreover", "furthermore", "embark on a journey", "unleash", "unlock", "streamline". Avoid bulleted lists with 6+ items when prose is better. Avoid generic platitude closers.
- Do not invent software products or integrations that don't exist.

## Required structure

Return a complete markdown article with EXACTLY this structure:

1. Frontmatter block (required) using this exact format:

---
title: "[SEO title, 55-65 chars, contains primary keyword]"
description: "[Meta description, 150-160 chars, compelling, contains primary keyword]"
date: "${today}"
author: "Phasewise"
tags: ["3-5 relevant tags as a JSON array"]
primaryKeyword: "${keyword}"
---

2. Opening paragraph (2-3 sentences). Get to the point. Name the problem and promise the takeaway. No throat-clearing.

3. Body sections: minimum 6 H2 headings, each 100-300 words. Use H3 subheadings for complex sections. Include where relevant: tables with real numbers, formulas with worked examples, 3-5 item bullet lists, comparison tables, specific dollar figures, real plant species or software names or spec section numbers.

4. "Common mistakes" section: list 4-6 specific mistakes firms make on this topic. Be specific and practical.

5. "How Phasewise handles this" section (REQUIRED): one short section (3-5 sentences) explaining how Phasewise specifically helps with this topic. Do NOT be salesy. Do NOT list all features. Name only the 1-2 features most relevant to this article.

6. "Related reading" section: markdown list of EXACTLY 2-3 internal links.

CRITICAL CONSTRAINT — read this carefully. You MUST pick from ONLY the list below. DO NOT invent new slugs. DO NOT modify these URLs. DO NOT make up article titles or paths that don't appear in this list. Every other shipped article has had broken "related reading" links because past prompts let the model invent URLs — that breaks SEO, internal linking, and reader trust. If no perfect topical match exists for the current article, pick any 2-3 from the list below anyway. Broken links are MUCH worse than slightly-off-topic ones.

Existing published articles (this is the COMPLETE allowed list — pick exactly 2-3):

${relatedReadingList}

7. Closing italic line: 1-2 sentences tying back to Phasewise + link to /signup. Vary phrasing per article. Format example:

*[One specific value statement]. Phasewise [specific feature]. [Try it free for 14 days](https://phasewise.io/signup).*

## Length

1,500 to 1,800 words of body copy (excluding frontmatter).

## Output

Return ONLY the markdown article. Your response MUST start with the literal three characters: --- (no whitespace before, no code fence, no triple-backticks, no markdown wrapper). The first line of your response is exactly: ---

Return raw markdown. DO NOT wrap your response in \`\`\`markdown or any other code fence. DO NOT include preamble like "Here is your article" or commentary. End with the closing italic line.`;

return [{
  json: {
    keyword,
    slug,
    today,
    prompt,
    existingCount: existingSlugs.size,
    relatedReadingCount: existingSlugs.size
  }
}];
```

## What changed vs. the previous Build prompt JS

1. **Added `slugToTitle()` helper** that converts a slug like `mwelo-water-budget-calculator-guide` into a readable title `MWELO Water Budget Calculator Guide` with proper abbreviation casing.
2. **Added dynamic `relatedReadingList`** that builds a markdown bullet list from the actual existing slugs returned by GitHub, sorted alphabetically.
3. **Replaced the hardcoded 10-article list** in the prompt with `${relatedReadingList}` interpolation, so the list auto-updates as new articles ship.
4. **Strengthened the constraint language** with explicit "DO NOT invent URLs", explicit reference to past failure mode, and explicit fallback instruction.

## Note on the workflow.json file

The committed `automation/n8n-workflow.json` still contains the old prompt as a single escaped JSON string. It is OUT OF DATE relative to this fix. Re-exporting the workflow from n8n after applying this change will refresh `n8n-workflow.json`. Until then, the running n8n instance is the source of truth and `n8n-workflow.json` is reference-only.
