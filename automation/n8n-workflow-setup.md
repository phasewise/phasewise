# n8n SEO Content Automation — Workflow Setup Guide

Step-by-step setup for the automated blog article pipeline. Follow in order. Expected setup time: 45-60 minutes (one-time). Once running, articles ship weekly with zero ongoing effort.

**Prerequisites:**
- Active n8n Cloud instance (Kevin has `dailymm.app.n8n.cloud`)
- Anthropic API account (or OpenAI if you prefer GPT)
- GitHub account with admin access to `phasewise/phasewise` repo

---

## Part 1 — API keys and tokens (10 min)

### 1.1 Anthropic API key

1. Go to [console.anthropic.com](https://console.anthropic.com/)
2. Sign in / sign up (use the same Google Workspace email: `kevin@phasewise.io`)
3. Add payment method (required for API access; expect < $5/month usage)
4. **API Keys** → **Create Key**
5. Name it: `n8n-phasewise-blog`
6. Copy the key (starts with `sk-ant-...`)
7. Save to password manager — you won't see it again

### 1.2 GitHub Personal Access Token (fine-grained)

1. Go to [github.com/settings/personal-access-tokens/new](https://github.com/settings/personal-access-tokens/new)
2. **Token name:** `n8n-phasewise-blog-automation`
3. **Expiration:** 1 year (reminder: rotate annually)
4. **Repository access:** **Only select repositories** → pick `phasewise/phasewise`
5. **Permissions:**
   - Repository permissions → **Contents**: **Read and write**
   - Repository permissions → **Metadata**: **Read-only** (auto-selected)
   - Leave everything else at "No access"
6. **Generate token** and copy (starts with `github_pat_...`)
7. Save to password manager

### 1.3 Store credentials in n8n

1. In n8n Cloud, go to **Credentials** (left sidebar)
2. **Add Credential** → **Header Auth** (for Anthropic)
   - Name: `Anthropic API`
   - Header name: `x-api-key`
   - Header value: (paste your Anthropic key)
3. **Add Credential** → **Header Auth** (for GitHub)
   - Name: `GitHub PAT (Phasewise blog)`
   - Header name: `Authorization`
   - Header value: `token ghp_YOUR_TOKEN_HERE` (prefix with `token `)

---

## Part 2 — Workflow structure (30 min)

The workflow has 6 nodes. Build in this order.

### Node 1 — Schedule Trigger

- **Node type:** Schedule Trigger
- **Mode:** Custom cron
- **Cron expression:** `0 14 * * 2,5`
  - Runs Tuesday + Friday at 14:00 UTC (about 7 AM Pacific, 10 AM Eastern)
  - Adjust to your preferred cadence

### Node 2 — Set: Select keyword + build slug

- **Node type:** Set (or Code if you prefer scripting)
- Purpose: rotate through the keyword list

**Simplest approach (recommended for start):**

Use a Set node with `keyword` as a static value, and manually update the keyword before each run until you've built your rotation logic:

```json
{
  "keyword": "landscape architect utilization rate"
}
```

**Production approach (build this after the pipeline is working):**

Store your keyword list in an Airtable or Google Sheet. Add a "published" column. The workflow reads the first unpublished keyword, uses it, then marks it published. This auto-rotates through your list.

**Slug generation** (add a Code node after the Set node):

```javascript
const keyword = $input.item.json.keyword;
const slug = keyword
  .toLowerCase()
  .replace(/[^a-z0-9\s-]/g, "")
  .replace(/\s+/g, "-")
  .replace(/-+/g, "-")
  .replace(/^-|-$/g, "");

return { keyword, slug };
```

Output: `{ keyword: "...", slug: "..." }`

### Node 3 — HTTP Request: Call Anthropic API

- **Node type:** HTTP Request
- **Method:** POST
- **URL:** `https://api.anthropic.com/v1/messages`
- **Authentication:** Header Auth → `Anthropic API` credential
- **Additional headers:**
  - `anthropic-version`: `2023-06-01`
  - `content-type`: `application/json`
- **Send Body:** Yes
- **Body content type:** JSON
- **Body:**

```json
{
  "model": "claude-sonnet-4-6",
  "max_tokens": 6000,
  "temperature": 0.7,
  "messages": [
    {
      "role": "user",
      "content": "=PASTE_THE_FULL_PROMPT_HERE_WITH_{{KEYWORD}}_REPLACED_VIA_n8n_EXPRESSION"
    }
  ]
}
```

**How to insert the keyword into the prompt:**

In n8n, use the expression `{{ $json.keyword }}` to pull the keyword from the previous node. The prompt content field will look like a very long string with `{{ $json.keyword }}` wherever `{{KEYWORD}}` appears in the prompt doc.

See `automation/article-generation-prompt.md` for the full prompt text to paste.

**Timeout:** Set to 120 seconds (article generation can take 30-60 seconds).

### Node 4 — Code: Extract + Base64 encode article

- **Node type:** Code
- **Language:** JavaScript

```javascript
// Pull article text from Anthropic response
const article = $input.item.json.content[0].text;

// Pull slug from Node 2 output (carried forward via Merge or via $('Select keyword').item.json.slug)
const slug = $('Select keyword').item.json.slug;

// Base64 encode the article content (required by GitHub API)
const base64Content = Buffer.from(article, 'utf8').toString('base64');

return {
  slug,
  article,
  base64Content,
  commitMessage: `Auto-generated pillar article: ${slug}`,
  filePath: `app/content/blog/${slug}.md`
};
```

### Node 5 — HTTP Request: Commit to GitHub

- **Node type:** HTTP Request
- **Method:** PUT
- **URL:** `=https://api.github.com/repos/phasewise/phasewise/contents/{{ $json.filePath }}`
- **Authentication:** Header Auth → `GitHub PAT (Phasewise blog)` credential
- **Additional headers:**
  - `Accept`: `application/vnd.github+json`
  - `X-GitHub-Api-Version`: `2022-11-28`
  - `User-Agent`: `n8n-phasewise-automation`
- **Send Body:** Yes
- **Body content type:** JSON
- **Body:**

```json
{
  "message": "={{ $json.commitMessage }}",
  "content": "={{ $json.base64Content }}",
  "branch": "main"
}
```

GitHub will respond with the commit SHA and file URL. Vercel detects the push to `main` and starts a rebuild within ~15 seconds.

### Node 6 — Slack / Email notification (optional but recommended)

Send yourself a confirmation when an article ships. Prevents silent failures.

- **Node type:** Send Email (or Slack if you prefer)
- **To:** `kevin@phasewise.io`
- **Subject:** `✅ Phasewise blog: new article shipped — {{ $json.slug }}`
- **Body:**

```
New blog article auto-generated and committed:

Slug: {{ $json.slug }}
Live URL: https://phasewise.io/blog/{{ $json.slug }}
Commit: {{ $node['Commit to GitHub'].json.commit.html_url }}

Review quality and flag if anything needs editing.
```

If the HTTP request in Node 5 returns an error, n8n will fire the error branch. Route that to a second email with subject `⚠️ Phasewise blog automation FAILED` so you know to investigate.

---

## Part 3 — First run (15 min)

### 3.1 Single-shot test (no schedule, manual fire)

1. Temporarily disable the Schedule Trigger node
2. Add a Manual Trigger node to the front of the workflow
3. Set Node 2's keyword to: `landscape architect utilization rate` (from the keyword list)
4. Click **Execute Workflow**
5. Watch each node execute:
   - Node 2: produces keyword + slug
   - Node 3: calls Anthropic, returns ~4-5k token response (takes 30-60 sec)
   - Node 4: base64-encodes successfully
   - Node 5: POSTs to GitHub, returns 201 Created
6. Check GitHub: new file at `app/content/blog/landscape-architect-utilization-rate.md` should appear on `main`
7. Check Vercel dashboard: a new deployment should start automatically
8. ~2-3 minutes later: visit `https://phasewise.io/blog/landscape-architect-utilization-rate` — the article should be live

### 3.2 Quality check

Read the generated article end-to-end. Ask yourself:

- [ ] Does it sound like a landscape architect wrote it?
- [ ] Are the specific numbers / formulas / examples plausible?
- [ ] Does it avoid AI tells (delve, embark, unlock, streamline)?
- [ ] Does the "How Phasewise handles this" section land naturally or feel forced?
- [ ] Are the internal links (Related reading) topically relevant?
- [ ] Does the frontmatter look right?

**If 5/6 or better: ship it.** Tune the prompt for the one issue and move on.

**If fewer than 5/6: tune the prompt before scheduling.** Common fixes listed at the bottom of `article-generation-prompt.md`.

### 3.3 Re-enable schedule

Once quality is verified:
1. Delete the Manual Trigger
2. Re-enable the Schedule Trigger
3. Set cron to `0 14 * * 5` for weekly Friday publishing (start here, ramp to 2x/week after 4 weeks)
4. Save and activate the workflow

---

## Part 4 — Quality safeguards

### 4.1 Duplicate protection

GitHub's `PUT /contents/` API returns a 422 error if the file already exists (unless you pass a `sha` to overwrite). This prevents accidentally overwriting articles if the keyword rotation loops back.

Your Node 5 error branch should check for status code 422 and treat it as "already published — skip" rather than a real failure.

### 4.2 Build failure detection

If an AI-generated article has malformed frontmatter, the Vercel build fails. Set up a Vercel webhook that notifies you on failed deploys:

1. Vercel project → Settings → Git → Deploy Hooks (for outbound)
2. Actually: use Integrations → Slack or GitHub Actions status for build failure alerts

Specifically watch for:
- Missing frontmatter fields → failing `gray-matter` parse
- Invalid date format → failing sitemap generation
- Special characters in the slug that weren't stripped

### 4.3 Content review cadence

Once a month, scan the last 4-8 articles:
- Are any producing noticeable traffic? (Check Vercel Analytics or Plausible once installed)
- Are any getting flagged by Google Search Console?
- Are the keyword topics still relevant?

Use this review to: (a) write better keyword targets, (b) tune the prompt further, (c) cut any keyword groups that aren't converting.

---

## Part 5 — Beyond the basics

Once the pipeline is stable for a month, consider:

### 5.1 Featured image auto-generation

Add a node after Node 3 that calls DALL-E or Stable Diffusion with a prompt based on the article title. Store the image, reference it in the frontmatter, display it on the blog index and article pages.

Adds ~$0.05 per article. Significantly improves social share CTR.

### 5.2 Internal linking improvements

After 20+ articles exist, update the prompt to pass the full list of existing articles + their descriptions. Instruct the LLM to pick 2-3 internal links based on actual topical relevance rather than a fixed list.

This increases internal link equity and helps Google understand your site's topic clusters.

### 5.3 Search Console + analytics integration

When Google Search Console is set up (after 30+ days of indexing), pipe query performance data back into the keyword rotation. Prioritize keywords that are ranking in position 10-20 (easy wins with fresh content) and deprioritize keywords that aren't gaining traction.

### 5.4 Competitor gap analysis

Build a periodic workflow (monthly) that:
1. Scrapes competitor blog sitemaps (Monograph, BQE, etc.)
2. Identifies topics they cover that Phasewise doesn't
3. Adds those topics to your keyword queue

---

## Cost summary

| Item | Monthly cost at 2/week cadence |
|------|-------------------------------|
| Anthropic API (article generation) | ~$2.50 |
| GitHub API | Free |
| Vercel rebuilds | Free (Hobby plan) |
| n8n Cloud | Already paid |
| **Total incremental cost** | **~$2.50/month** |

~$30/year to ship 100 articles. Compared to paying a content agency ($3-5k/mo), this is a 99%+ cost reduction for comparable output.

---

## Support files

- `automation/seo-keyword-targets.md` — keyword list to pull from
- `automation/article-generation-prompt.md` — the prompt body + quality control
- This file — workflow configuration
