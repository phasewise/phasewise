import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

export type BlogPostFrontmatter = {
  title: string;
  description: string;
  date: string; // ISO date string
  author?: string;
  tags?: string[];
  // Optional: keyword the article targets for SEO
  primaryKeyword?: string;
};

export type BlogPost = BlogPostFrontmatter & {
  slug: string;
  content: string; // raw markdown
  html: string; // rendered HTML
  readingTimeMinutes: number;
};

export type BlogPostSummary = BlogPostFrontmatter & {
  slug: string;
  readingTimeMinutes: number;
};

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

function readingTimeMinutes(content: string): number {
  // ~200 words per minute
  const words = content.split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

function parseFile(filename: string): BlogPost {
  const slug = filename.replace(/\.md$/, "");
  const raw = fs.readFileSync(path.join(BLOG_DIR, filename), "utf8");
  const parsed = matter(raw);
  const data = parsed.data as BlogPostFrontmatter;
  const content = parsed.content;
  const html = marked.parse(content, { async: false }) as string;
  return {
    ...data,
    slug,
    content,
    html,
    readingTimeMinutes: readingTimeMinutes(content),
  };
}

export function getAllPosts(): BlogPostSummary[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"));
  const posts = files.map(parseFile);
  // Sort newest first
  return posts
    .map(({ content: _c, html: _h, ...summary }) => summary)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPostBySlug(slug: string): BlogPost | null {
  const filename = `${slug}.md`;
  if (!fs.existsSync(path.join(BLOG_DIR, filename))) return null;
  return parseFile(filename);
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs.readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}
