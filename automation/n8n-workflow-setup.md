# n8n SEO Content Automation — Workflow Setup Guide

Step-by-step setup for the autonomous blog article pipeline. The current production workflow ships one pillar article per week with zero ongoing effort. Setup time for a fresh n8n instance: 30-45 min (one-time).

**Prerequisites:**
- Active n8n Cloud instance (Phasewise uses `dailymm.app.n8n.cloud`)
- Anthropic API account with billing
- GitHub account with admin access to `phasewise/phasewise` repo

---

## Architecture overview

The pipeline is **6 nodes**, runs every Friday at 14:00 UTC (~7 AM Pacific), and self-rotates through a 40-keyword priority list without ever publishing a duplicate:

```
Schedule Trigger
  → List existing articles  (GitHub: read app/content/blog/)
  → Build prompt            (Code: pick first unused keyword + assemble prompt)
  → Generate article        (HTTP: Anthropic Messages API, Sonnet 4.6)
  → Extract article         (Code: validate frontmatter + strip code fences)
  → Commit to GitHub        (n8n GitHub node: PUT to main)
```

Vercel detects the push to `main` and rebuilds within ~15 seconds. Article goes live at `https://phasewise.io/blog/<slug>` ~2 min later.

The fastest way to set up a copy is to **import [`n8n-workflow.json`](./n8n-workflow.json)** rather than rebuild from scratch. See `IMPORT-WORKFLOW.md`. The sections below explain what each node does — useful if you need to debug or modify.

---

## Part 1 — Credentials (10 min)

### 1.1 Anthropic API key

1. [console.anthropic.com](https://console.anthropic.com/) → sign in with your Workspace account
2. Add billing (~$2.50/month at 1 article/week)
3. **API Keys** → **Create Key**, name `n8n-phasewise-blog`, copy the `sk-ant-...` value
4. In n8n: **Credentials** → **Add Credential** → search "Anthropic" → name it `Anthropic API (Phasewise blog)`, paste the key

### 1.2 GitHub fine-grained PAT

1. [github.com/settings/personal-access-tokens/new](https://github.com/settings/personal-access-tokens/new)
2. Token name: `n8n-phasewise-blog-automation`, expiration **1 year**
3. **Repository access:** *Only select repositories* → `phasewise/phasewise`
4. **Permissions:**
   - Contents: **Read and write**
   - Metadata: **Read-only** (auto-selected)
5. Generate, copy `github_pat_...`
6. In n8n: **Credentials** → **Add Credential** → search "GitHub API" → name it `GitHub API (Phasewise blog)`, paste the PAT

The workflow uses n8n's predefined `githubApi` and `anthropicApi` credential types — no manual Header Auth setup needed.

---

## Part 2 — Node-by-node reference

### Node 1: Schedule Trigger

- **Mode:** Custom cron
- **Cron:** `0 14 * * 5` — Friday 14:00 UTC (= 7 AM Pacific)
- During testing: replace with a Manual Trigger so you can fire it on demand. Production swaps to Schedule.

### Node 2: List existing articles (HTTP Request)

- **Method:** GET
- **URL:** `https://api.github.com/repos/phasewise/phasewise/contents/app/content/blog`
- **Auth:** `GitHub API (Phasewise blog)` predefined credential
- **Headers:** `Accept: application/vnd.github+json`, `X-GitHub-Api-Version: 2022-11-28`, `User-Agent: n8n-phasewise-pipeline`

Returns an array of `{ name, path, sha, ... }` objects — one per file in the blog directory. The next node uses this to dedupe.

### Node 3: Build prompt (Code, JavaScript)

This is the heart of the autonomous-rotation logic. The node:

1. Reads the GitHub directory listing from Node 2 via `$input.first().json`
2. Builds a `Set` of existing slugs (`filename.replace(/\.md$/, "")`)
3. Iterates a hardcoded `keywordList` (40 entries, interleaved across 6 topical clusters)
4. Picks the **first keyword whose generated slug is not in the existing-slugs set**
5. Throws a clear error if all keywords have been used (`Add more keywords to the list...`)
6. Assembles the article-generation prompt with the keyword interpolated, plus today's date for the frontmatter

**Critical: this is what makes the pipeline truly autonomous.** Without it, the Build prompt would have to be edited weekly to swap keywords (the original pre-2026-05-09 approach), and a slug collision against an existing file would crash the GitHub commit with HTTP 422 "sha wasn't supplied."

The exact JS body lives in [`n8n-workflow.json`](./n8n-workflow.json) under the `Build prompt` node's `jsCode`. To edit the keyword list, modify that array. The 40-keyword list lasts ~9 months at 1/week cadence before exhausting.

### Node 4: Generate article (HTTP Request)

- **Method:** POST
- **URL:** `https://api.anthropic.com/v1/messages`
- **Auth:** `Anthropic API (Phasewise blog)` predefined credential
- **Header:** `anthropic-version: 2023-06-01`
- **Body (JSON):**
  ```json
  {
    "model": "claude-sonnet-4-6",
    "max_tokens": 6000,
    "temperature": 0.7,
    "messages": [
      { "role": "user", "content": {{ JSON.stringify($json.prompt) }} }
    ]
  }
  ```
- **Timeout:** 180000 ms (3 min — Sonnet 4.6 typically returns in 30-90 sec but cold starts can spike)

### Node 5: Extract article (Code, JavaScript)

Pulls the markdown out of the Anthropic response shape (`response.content[0].text`) and runs **defensive sanitizers** to handle two LLM output bugs we've seen in the wild:

1. **Whole-article code fence:** if the model wrapped the response in ` ```markdown ... ``` `, strip it.
2. **Frontmatter-only fence:** if the model wrapped JUST the frontmatter block in ` ``` `, strip those fences while preserving the frontmatter dashes.

Then validates the result starts with `---` (frontmatter delimiter). If not, throws with the first 200 chars so you can see what came back.

Carries `slug` forward from Node 3 via `$('Build prompt').first().json.slug` and computes `filePath` and `commitMessage`.

### Node 6: Commit to GitHub (n8n GitHub node)

- **Resource:** File
- **Operation:** Create
- **Owner / Repository:** `phasewise / phasewise`
- **File Path:** `={{ $json.filePath }}` (e.g. `app/content/blog/landscape-architect-utilization-rate.md`)
- **File Content:** `={{ $json.article }}` (n8n GitHub node base64-encodes for you)
- **Commit Message:** `={{ $json.commitMessage }}`
- **Branch:** `main`

Vercel auto-deploys on push.

---

## Part 3 — First-run testing

1. Replace Schedule Trigger with a Manual Trigger
2. Click **Execute Workflow**
3. Watch each node fire:
   - List existing articles: returns ~10-15 file objects
   - Build prompt: outputs `{ keyword, slug, today, prompt, existingCount }`. **`existingCount` should be > 0** — if it's 0, Node 2's auth or path is wrong.
   - Generate article: returns Anthropic response with `content[0].text`
   - Extract article: emits `{ slug, article, filePath, commitMessage }` and `article` should start with `---`
   - Commit to GitHub: returns 201 Created with the new file's SHA + URL
4. Verify on GitHub: new commit on `main`, file at `app/content/blog/<slug>.md`
5. ~2 min later, visit `https://phasewise.io/blog/<slug>` — article live

### Quality rubric

Read the article end-to-end. Does it pass:

- [ ] Sounds like a senior LA wrote it (not generic SaaS marketing)
- [ ] Specific numbers, formulas, or examples (not vague generalities)
- [ ] Avoids AI tells: *delve, embark, unleash, unlock, streamline, in conclusion, moreover, furthermore*
- [ ] "How Phasewise handles this" section feels natural, not bolted on
- [ ] Internal "Related reading" links are topically relevant
- [ ] Frontmatter parses cleanly (title, description, date, author, tags, primaryKeyword)

5/6 ships. <5/6, tune the prompt in `article-generation-prompt.md` before re-enabling the schedule.

---

## Part 4 — Quality safeguards already in place

### 4.1 Slug collision prevention

The Build prompt node guarantees no two articles share a slug — it picks the first **unused** keyword from the priority list. If you accidentally double-fire the workflow on the same day, the second run will pick a different keyword, not collide.

The earlier failure mode (May 2026) where GitHub returned 422 "sha wasn't supplied" on a slug collision is no longer reachable from the Build prompt path. See `n8n-blog-incident-2026-05-09.md` for the full incident.

### 4.2 Frontmatter fence-strip

LLMs occasionally wrap markdown frontmatter in code fences. Node 5 strips both whole-article and frontmatter-only fence patterns before committing.

### 4.3 Keyword exhaustion alarm

When the workflow runs out of unused keywords from the 40-entry list (~9 months at weekly cadence), Node 3 throws:

> All 40 keywords have been published. Add more keywords to the list in this Code node...

This appears in n8n's execution log as a hard failure, so you'll notice. Add more keywords to the array and resume.

### 4.4 Build failure detection

If frontmatter is malformed (missing field, invalid YAML), the next Vercel deploy fails. Watch Vercel's deploy notifications. Sentry will catch render-time errors on the blog page itself.

---

## Part 5 — Beyond the basics

Once stable, optional extensions:

- **Featured images** — add a node after Extract that calls DALL-E or a similar image API; reference the image in the frontmatter
- **Internal-link refresh** — after 20+ articles exist, dynamically pass the full list of titles + descriptions into the prompt instead of the static "Related reading" pool
- **Search Console feedback loop** — pipe query performance back into keyword priority (rank position 10-20 = easy win, deprioritize keywords not gaining traction)
- **Social auto-post** — see `n8n-social-posting-extension.md` for the pattern. The X auto-post pipeline is already live on a separate workflow (fires after each commit)

---

## Cost summary

| Item | Monthly cost (1 article/week) |
|------|------------------------------|
| Anthropic API | ~$2.50 |
| GitHub API | Free |
| Vercel rebuilds | Free (Hobby plan) |
| n8n Cloud | Already paid |
| **Total incremental** | **~$2.50/month** |

---

## Support files

- [`n8n-workflow.json`](./n8n-workflow.json) — current authoritative workflow export (import this to bootstrap a fresh n8n instance)
- [`IMPORT-WORKFLOW.md`](./IMPORT-WORKFLOW.md) — quick-start import instructions
- [`seo-keyword-targets.md`](./seo-keyword-targets.md) — the 40-keyword priority list this workflow rotates through (mirrors the array in the Build prompt node)
- [`article-generation-prompt.md`](./article-generation-prompt.md) — the article prompt body + voice/style requirements (mirrors the prompt assembled in the Build prompt node)
- [`n8n-social-posting-extension.md`](./n8n-social-posting-extension.md) — auto-tweet pattern for the X workflow
- [`n8n-blog-incident-2026-05-09.md`](./n8n-blog-incident-2026-05-09.md) — postmortem on the slug-collision incident that motivated the deterministic keyword selection
