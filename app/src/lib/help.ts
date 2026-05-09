import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

/**
 * Markdown-driven help center, mirroring the /blog infrastructure.
 *
 * Articles live in content/help/*.md. Frontmatter format:
 *
 *     ---
 *     title: "Adding team members"
 *     description: "Invite staff, set roles, and grant permissions."
 *     category: "Getting started"
 *     order: 2
 *     ---
 *
 * `order` controls index-page sort within a category. Lower numbers
 * surface first. Tied orders fall back to alphabetical title.
 *
 * Help is a public route (no auth required) so prospects evaluating
 * Phasewise can browse the docs before signing up. The sidebar Help
 * link inside the authenticated app points at the same /help URLs.
 */

export type HelpFrontmatter = {
  title: string;
  description: string;
  category: string;
  order?: number;
};

export type HelpArticle = HelpFrontmatter & {
  slug: string;
  content: string;
  html: string;
};

export type HelpArticleSummary = HelpFrontmatter & {
  slug: string;
};

const HELP_DIR = path.join(process.cwd(), "content", "help");

function parseFile(filename: string): HelpArticle {
  const slug = filename.replace(/\.md$/, "");
  const raw = fs.readFileSync(path.join(HELP_DIR, filename), "utf8");
  const parsed = matter(raw);
  const data = parsed.data as HelpFrontmatter;
  const content = parsed.content;
  const html = marked.parse(content, { async: false }) as string;
  return {
    ...data,
    slug,
    content,
    html,
  };
}

export function getAllArticles(): HelpArticleSummary[] {
  if (!fs.existsSync(HELP_DIR)) return [];
  const files = fs.readdirSync(HELP_DIR).filter((f) => f.endsWith(".md"));
  const articles = files.map(parseFile);
  return articles
    .map(({ content: _c, html: _h, ...summary }) => summary)
    .sort((a, b) => {
      // Primary sort: category alphabetical
      const catCmp = a.category.localeCompare(b.category);
      if (catCmp !== 0) return catCmp;
      // Within category: order ascending (default 999 if missing)
      const orderCmp = (a.order ?? 999) - (b.order ?? 999);
      if (orderCmp !== 0) return orderCmp;
      // Tiebreaker: title
      return a.title.localeCompare(b.title);
    });
}

export function getArticleBySlug(slug: string): HelpArticle | null {
  const filename = `${slug}.md`;
  if (!fs.existsSync(path.join(HELP_DIR, filename))) return null;
  return parseFile(filename);
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(HELP_DIR)) return [];
  return fs
    .readdirSync(HELP_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

/**
 * Group articles by category for the index page. Categories stay in
 * alphabetical order; within each category, articles sort by order
 * then title (matches getAllArticles).
 */
export function getArticlesByCategory(): Map<string, HelpArticleSummary[]> {
  const articles = getAllArticles();
  const map = new Map<string, HelpArticleSummary[]>();
  for (const a of articles) {
    const list = map.get(a.category) ?? [];
    list.push(a);
    map.set(a.category, list);
  }
  return map;
}
