# n8n Social Posting Extension — Drop-in Patch

This extends the existing **Phasewise SEO content pipeline** (`n8n-workflow.json`) so that every newly-published blog article auto-posts to LinkedIn, X, and (optionally) Instagram. Plug-in patch — apply *after* the social accounts are claimed and credentials are configured in n8n.

## Where this fires in the pipeline

```
Schedule Trigger → List existing articles → Build prompt → Generate article (Anthropic)
  → Extract article → Commit to GitHub → [NEW: Compose social posts] → [NEW: branch x3]
                                                                        ├── Post to LinkedIn
                                                                        ├── Post to X
                                                                        └── Post to Instagram (optional)
```

The new nodes run in sequence after `Commit to GitHub`. If a platform credential is missing, only that branch errors — the others still complete.

---

## Step 1: configure platform credentials in n8n

Each platform needs its own n8n credential. Click *Credentials* in the n8n sidebar → *New*. Use these:

### LinkedIn

- **Credential type:** "LinkedIn OAuth2 API"
- **Required scopes:** `r_liteprofile`, `r_organization_social`, `w_member_social`, `w_organization_social`
- **Setup:** Create a LinkedIn app at https://www.linkedin.com/developers/. Verify ownership of the `phasewise-io` company page. Add `https://<your-n8n-host>/rest/oauth2-credential/callback` as the redirect URL. Paste Client ID + Secret into n8n.
- **Org URN:** look up via `https://api.linkedin.com/v2/organizations?q=vanityName&vanityName=phasewise-io` once authenticated. Save the `urn:li:organization:<id>` for the post node.

### X (Twitter)

- **Credential type:** "Twitter OAuth1 API" (n8n's built-in node uses v1.1 + v2 hybrid)
- **Setup:** Apply at https://developer.x.com — Free tier allows 1,500 posts/month, sufficient for our cadence. Create an app, generate API key + secret + access token + access secret.
- **Permissions:** `Read and Write`. The OAuth access token must be regenerated *after* you flip permissions to write or the token will be read-only.

### Instagram (optional — only if you want auto-image-posts)

- **Credential type:** "Facebook Graph API" — Instagram piggybacks on Meta's Graph API.
- **Required:** Instagram **Business** account linked to a Facebook Page you admin. (Personal IG accounts cannot post via API.)
- **Setup steps:**
  1. Convert @phasewise to a Business account in IG settings.
  2. Connect to a Facebook Page (create one if needed: "Phasewise").
  3. Create a Meta app at https://developers.facebook.com/.
  4. Add the *Instagram Graph API* product to the app.
  5. Generate a long-lived page access token via Graph API Explorer.
- **Caveat:** Instagram requires an image with every post. The "Generate card image" node in this extension produces one via a templated next/og-style endpoint at `https://phasewise.io/api/og-card?title=<title>` (which we'll build separately if you commit to Instagram automation).

**If Instagram is too much for v1, skip it.** The LinkedIn + X branch alone covers the highest-conversion channels for B2B SaaS.

---

## Step 2: insert the "Compose social posts" Code node

Position **right after** `Commit to GitHub` in the workflow editor. Copy this JS into a new *Code* node named `Compose social posts`:

```javascript
// =====================================================================
// COMPOSE SOCIAL POSTS
// Reads the article frontmatter (title, description, slug, tags) from
// the workflow context and produces three platform-specific posts.
// =====================================================================

// "Build prompt" earlier in the workflow set { keyword, slug } in the JSON.
// "Extract article" set { title, description, tags } parsed from frontmatter.
const ctx = $('Extract article').first().json;
const slug = $('Build prompt').first().json.slug;
const url = `https://phasewise.io/blog/${slug}`;
const tagSlugs = (ctx.tags || []).map(t => '#' + t.replace(/[^a-zA-Z0-9]/g, ''));

// X — 280 char hard limit. Headline + URL + 2 hashtags.
const xPost = `${ctx.title}\n\n${url}\n\n${tagSlugs.slice(0, 2).join(' ')}`.slice(0, 280);

// LinkedIn — 3000 char limit; aim for 600-1200 to optimize for the algorithm.
// First 200 chars are the "above-the-fold" preview; lead with the value.
const linkedInPost = [
  ctx.description,
  '',
  `Read the full article → ${url}`,
  '',
  tagSlugs.slice(0, 5).join(' ')
].join('\n');

// Instagram — caption only; image generated separately.
const instagramPost = [
  `New on the Phasewise blog: ${ctx.title}.`,
  '',
  ctx.description,
  '',
  'Tap the link in bio.',
  '',
  tagSlugs.slice(0, 8).join(' ') + ' #LandscapeArchitecture #AEC #SaaS'
].join('\n');

// Image URL for Instagram — uses a yet-to-be-built /api/og-card route on
// phasewise.io that renders a 1080x1080 branded card from query params.
const instagramImage = `https://phasewise.io/api/og-card?title=${encodeURIComponent(ctx.title)}&slug=${slug}`;

return [{
  json: {
    title: ctx.title,
    description: ctx.description,
    slug,
    url,
    tags: ctx.tags,
    xPost,
    linkedInPost,
    instagramPost,
    instagramImage,
    linkedInOrgUrn: 'urn:li:organization:REPLACE_WITH_YOUR_ORG_ID'
  }
}];
```

---

## Step 3: add the LinkedIn post node

Right after `Compose social posts`, add an *HTTP Request* node named `Post to LinkedIn`:

| Field | Value |
|---|---|
| Method | `POST` |
| URL | `https://api.linkedin.com/rest/posts` |
| Authentication | Predefined credential → LinkedIn OAuth2 |
| Headers | `LinkedIn-Version: 202404`, `X-Restli-Protocol-Version: 2.0.0`, `Content-Type: application/json` |
| Body content | JSON (see below) |

Body (Expression mode — bind to the previous node's output):

```json
{
  "author": "{{ $json.linkedInOrgUrn }}",
  "commentary": "{{ $json.linkedInPost }}",
  "visibility": "PUBLIC",
  "distribution": {
    "feedDistribution": "MAIN_FEED",
    "targetEntities": [],
    "thirdPartyDistributionChannels": []
  },
  "lifecycleState": "PUBLISHED",
  "isReshareDisabledByAuthor": false
}
```

---

## Step 4: add the X post node

Add an *X (Twitter)* node (n8n built-in) named `Post to X`:

| Field | Value |
|---|---|
| Resource | `Tweet` |
| Operation | `Create` |
| Text | `={{ $json.xPost }}` |
| Authentication | Predefined credential → Twitter OAuth1 |

That's it for X — the built-in node handles the v2 endpoint internally.

---

## Step 5 (optional): Instagram nodes

Two nodes needed:

1. *HTTP Request* — `IG: Create media container`
   - Method: `POST`
   - URL: `https://graph.facebook.com/v19.0/{{$credentials.instagramBusinessId}}/media`
   - Body: `image_url={{$json.instagramImage}}&caption={{$json.instagramPost}}&access_token={{$credentials.accessToken}}`

2. *HTTP Request* — `IG: Publish container`
   - Method: `POST`
   - URL: `https://graph.facebook.com/v19.0/{{$credentials.instagramBusinessId}}/media_publish`
   - Body: `creation_id={{$('IG: Create media container').first().json.id}}&access_token={{$credentials.accessToken}}`

The `instagramBusinessId` is the IG Business Account ID, which you fetch once via Graph API Explorer and store as a credential.

**Image generation prerequisite:** the `/api/og-card?title=...&slug=...` route on phasewise.io needs to exist. It's similar to the existing `/opengraph-image.tsx` but parameterized. If you want this, ping me and I'll add the route — about 30 min of work. Until then, comment out the Instagram branch.

---

## Step 6: error handling

In the workflow's main *Settings* (gear icon), set:

- **Error workflow:** create a tiny "n8n error notifications" workflow that sends you an email on any failure. Otherwise a silent platform outage means missed posts that never reach you.
- **Save data on error:** *Yes* — preserves the article context so you can retry that specific run.

Add `On error: continue regular output` to each platform's post node so a single failed branch doesn't block the others.

---

## Step 7: test path

1. Trigger the workflow manually with a test article (use the manual trigger).
2. Confirm the article commits to GitHub (existing behavior).
3. Confirm `Compose social posts` produces clean text in each field (use *Execution view* to inspect).
4. Confirm LinkedIn post appears on linkedin.com/company/phasewise-io within 30 seconds.
5. Confirm X tweet appears at x.com/phasewise.
6. (If enabled) confirm Instagram post appears at instagram.com/phasewise.

If everything works, switch the workflow back to the scheduled trigger (`0 7 * * 5` — Fridays 7am Pacific). Future articles auto-post.

---

## Cost / quota notes

| Platform | Posts/mo limit (free) | Our cadence | Headroom |
|---|---|---|---|
| LinkedIn | None for org pages | 1/wk | infinite |
| X | 1,500/mo (Free tier) | 1/wk = 4-5 | ~99% headroom |
| Instagram | 25 posts/24h via API | 1/wk | massive headroom |

Quotas reset rolling, not calendar-monthly. We're nowhere near any limit.

---

## What this doesn't do (out of scope, can add later)

- **Repost/retweet engagement** — not automated; do this manually if at all
- **Reply/comment moderation** — must be done in-platform
- **DM auto-responses** — out of scope (also against most platform ToS)
- **Cross-posting older articles** — the pipeline only posts NEW articles. To backfill the existing 11 articles, build a one-shot workflow that iterates the blog directory and posts each. Easy to add once this is working.

---

## Once you've confirmed the social accounts are claimed and credentialed in n8n

Send the message "social pipeline credentialed" and I'll either:
1. Build the `/api/og-card` route if you want Instagram in v1, or
2. Just confirm the patch above is ready to apply (LinkedIn + X only).
