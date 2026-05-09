# n8n Blog Pipeline — Slug Collision Incident (2026-05-09)

## Summary

The autonomous SEO content pipeline failed two consecutive weekly runs after the workflow's "Build prompt" node was using a hardcoded keyword instead of dynamically picking the next unused one. When the slug it generated collided with an existing blog file, GitHub's `PUT /contents/{path}` returned **HTTP 422 — `"sha" wasn't supplied`** (the GitHub Contents API requires a `sha` to overwrite an existing file). The pipeline crashed on the GitHub commit step and shipped no article.

Resolved same-day by rewriting the Build prompt node to deterministically pick the first unused keyword from a priority list. After the fix, a real article (`how-to-price-landscape-design-projects.md`) committed cleanly on the next test run.

## Timeline

- **2026-05-08 morning** — diagnosis began after Kevin noticed Friday 5/8's run had not produced a new article. n8n execution log showed a 422 from GitHub on the Commit node.
- **Diagnosis** — inspected Build prompt node output. Field `existingCount: 0` was the smoking gun: the node was not actually reading the GitHub directory listing from the upstream `List existing articles` node. The keyword + slug it picked were therefore static, and a previous run with the same keyword had already committed a file at the same path.
- **Fix** — rewrote the Build prompt node's JS body to:
  1. Read `$input.first().json` (the GitHub directory listing array)
  2. Build a `Set<string>` of existing slugs by stripping `.md` from each filename
  3. Iterate a hardcoded `keywordList` of 40 priority keywords
  4. Pick the **first** keyword whose generated slug is **not** in the existing-slugs set
  5. Throw a clear `Error("All N keywords have been published...")` if all are exhausted
- **Verification** — manual workflow execution after the fix selected `how-to-price-landscape-design-projects` (next unused keyword in the priority list), generated the article, committed to `main`, and Vercel auto-deployed. Live at `/blog/how-to-price-landscape-design-projects`.

## Root cause

The original Build prompt node was a residue from the early prototype phase, before the `List existing articles` node existed. It treated the keyword as effectively static — there was no path for it to learn what had already been published. The `existingCount: 0` output proved the GitHub listing data wasn't being read at all; n8n's reactive node-graph passed the upstream output along but the Code node ignored it.

This bug had been masked for the first ~10 weeks of the pipeline's life because each weekly run happened to pick a different keyword (the array order matched the publish order naturally for the first batch). The bug surfaced the moment a re-fire or skipped week caused the pointer to land on an already-published slug.

## Why GitHub returned 422 specifically

The pipeline's commit step uses GitHub's `PUT /repos/{owner}/{repo}/contents/{path}` endpoint. For a **new** file the body needs only `{ message, content, branch }`. To **update** an existing file you must additionally pass `sha` (the blob SHA of the current file content) so GitHub knows you've seen the current version and aren't blindly overwriting someone else's change. When the path already existed and we sent no `sha`, GitHub treated it as "you're trying to update without checking the current state" and refused with 422. That refusal was the right behavior — without it we'd silently overwrite a published article.

## Fix detail (current Build prompt logic)

```javascript
const githubFiles = $input.first().json;
const existingFiles = Array.isArray(githubFiles) ? githubFiles : [];
const existingSlugs = new Set(
  existingFiles
    .filter(f => f.name && f.name.endsWith('.md'))
    .map(f => f.name.replace(/\.md$/, ''))
);

let keyword = null, slug = null;
for (const kw of keywordList) {
  const s = toSlug(kw);
  if (!existingSlugs.has(s)) {
    keyword = kw;
    slug = s;
    break;
  }
}

if (!keyword) {
  throw new Error(`All ${keywordList.length} keywords have been published. Add more keywords to the list...`);
}
```

Full source lives in [`n8n-workflow.json`](./n8n-workflow.json) under the `Build prompt` node's `jsCode` field. The 40-keyword list is interleaved across 6 topical clusters (Practice Management, Project Management, Compliance, Software, Team & Ops, Plants & Specs) so Google sees consistent topic breadth as articles ship over time.

## Why this won't recur

- **Slug collision is structurally impossible** from the Build prompt path now. The node guarantees the chosen slug is not already in the GitHub blog directory.
- **Keyword exhaustion is loud, not silent.** When the array is fully consumed, the workflow throws and n8n surfaces the error in its execution log. There's no scenario where the pipeline silently picks a dupe.
- **Frontmatter sanitizer in Extract article** handles the related "LLM wraps output in code fences" failure mode (a different bug class but same general category — defensive coding against LLM output drift).

## Lessons

1. **Trust upstream node outputs only when you wire them in.** n8n's graph passes data downstream automatically, but a Code node that doesn't reference `$input` produces output independent of upstream state. Always confirm a debug field (here, `existingCount`) reflects what you expect.
2. **Diagnostic fields are cheap.** Adding `existingCount: existingSlugs.size` to the Build prompt's output is a one-line addition that made the bug obvious at a glance. Worth doing on every dynamic-selection node.
3. **GitHub's 422 on the Contents API is helpful, not noise.** It prevented data loss. A naive workaround ("just send `sha` so it overwrites") would have been worse than the bug.

## Related

- Setup guide: [`n8n-workflow-setup.md`](./n8n-workflow-setup.md) — Part 4.1 references this incident
- Authoritative workflow: [`n8n-workflow.json`](./n8n-workflow.json)
- Keyword list: [`seo-keyword-targets.md`](./seo-keyword-targets.md)
