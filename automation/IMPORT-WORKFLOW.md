# How to import the Phasewise SEO content pipeline

The complete 5-node workflow is pre-built at `automation/n8n-workflow.json`. Import it instead of building each node manually.

## Steps

### 1. Open n8n

Go to **https://dailymm.app.n8n.cloud**

### 2. Import the workflow

1. Click **Workflows** in the left sidebar
2. Click the **`...`** (3-dot menu) at the top right of the workflows list — OR click "+ Add workflow" → look for an Import option
3. Choose **Import from file** (or "Import from URL" if available)
4. Select the file:
   ```
   c:\Users\Gallo Beelink 1\OneDrive\Documents\powerkg\automation\n8n-workflow.json
   ```
5. Click **Open / Import**

You should now see "Phasewise SEO content pipeline" with 5 nodes connected on the canvas:

```
Manual Trigger → Build prompt → Generate article (Anthropic) → Extract article → Commit to GitHub
```

### 3. Re-link credentials (one-time)

n8n imports credentials by name, but you may need to confirm the linking:

1. Click on the **"Generate article (Anthropic)"** node
2. In the right panel, look at the **Credential** field
3. If it says "Anthropic API (Phasewise blog)" with a green check, you're good
4. If it shows a warning or empty, click the dropdown and pick **"Anthropic API (Phasewise blog)"**
5. Close the node panel

Repeat for the **"Commit to GitHub"** node:
1. Click on it
2. Verify the credential is **"GitHub API (Phasewise blog)"**
3. Pick it from the dropdown if not auto-linked

### 4. Save

Click **Save** in the top right (or `Ctrl+S`).

### 5. Test run

1. Click the **Manual Trigger** node
2. Click **Execute workflow** (or the play button)
3. Watch each node execute in sequence:
   - **Build prompt** — instant. Output: `keyword`, `slug`, `today`, `prompt`
   - **Generate article (Anthropic)** — 30-60 seconds. Output: a JSON response with `content[0].text` containing the article markdown
   - **Extract article** — instant. Output: `slug`, `article`, `filePath`, `commitMessage`
   - **Commit to GitHub** — 1-2 seconds. Output: GitHub API response with the new file SHA

### 6. Verify

After the workflow finishes:

1. Open: `https://github.com/phasewise/phasewise/tree/main/app/content/blog`
2. You should see a new file: `landscape-architect-utilization-rate.md`
3. Click it → verify the markdown looks well-formed (frontmatter + article body)
4. Check Vercel: a deployment should auto-trigger
5. ~2-3 minutes later, visit `https://phasewise.io/blog/landscape-architect-utilization-rate` — the article should be live

### 7. Quality check

Read the generated article end-to-end. Score against these 6 criteria:

- [ ] Sounds like a landscape architect wrote it (not generic AI tone)
- [ ] Specific numbers / formulas / examples are plausible
- [ ] No AI tells (delve, embark, unlock, streamline, "in conclusion")
- [ ] "How Phasewise handles this" section feels natural, not salesy
- [ ] Internal links (Related reading) are topically relevant
- [ ] Frontmatter is well-formed (title, description, date, tags)

**5/6 or better → ship it. Schedule the workflow for weekly auto-runs.**

**Less than 5/6 → tune the prompt before scheduling.** Edit the **Build prompt** Code node to add more specific constraints.

---

## Autonomous keyword rotation (no manual editing required)

The workflow now picks the next keyword automatically:

1. **List existing articles** node calls GitHub API to get all files in `/app/content/blog/`
2. **Build prompt** node has a baked-in priority list of 40 target keywords (interleaved across 6 topical clusters)
3. The Code node finds the first keyword whose slug isn't already published, and uses it for this run

**You never have to edit the workflow.** Just run it (manually or on schedule) and it picks the next unused keyword.

**When the 40-keyword list is exhausted** (in ~6 months at 2/week cadence), the workflow throws a clear error: "All 40 keywords have been published. Add more keywords to the list in this Code node." At that point, edit the `keywordList` array at the top of the **Build prompt** Code node and add 20-40 more keywords from `automation/seo-keyword-targets.md` or fresh research.

**Rotation order:** keywords are interleaved across the 6 topical clusters (Software, Practice Management, Project Management, Compliance, Team & Ops, Plants & Specs) so Google sees consistent topical breadth, not a content burst on one topic.

## Switching from Manual to Schedule

Once quality is verified for 2-3 articles:

1. **Delete** the Manual Trigger node
2. Add a **Schedule Trigger** node in its place
3. Configure cron: `0 14 * * 5` (Friday 7am Pacific weekly)
4. Connect Schedule Trigger → Build prompt
5. **Activate** the workflow (toggle in top right)

---

## Troubleshooting

### Anthropic node returns 401
- Re-paste the API key in the credential
- Verify there's $5+ credit balance at console.anthropic.com

### Anthropic node returns 400 "model not found"
- Edit the **Generate article (Anthropic)** node body
- Try `claude-sonnet-4-5` or `claude-3-5-sonnet-20241022` if `claude-sonnet-4-6` isn't available on your plan

### Anthropic node returns 200 but Extract article fails
- Click into the Anthropic node's output
- Check the response shape — should have `content[0].text`
- If the structure differs, update the **Extract article** Code node accordingly

### GitHub node returns 422 "Invalid request"
- File may already exist (slug collision). Either change the keyword, or use the GitHub UI to delete the existing file first.

### GitHub node returns 404
- Verify owner is `phasewise` and repository is `phasewise`
- Verify the PAT has Contents: Read & Write permission scoped to `phasewise/phasewise`

### Article shipped but Vercel doesn't rebuild
- Check Vercel project → Settings → Git: auto-deploy from `main` should be enabled
- If not, manually trigger a redeploy
