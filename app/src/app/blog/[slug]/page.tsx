import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllSlugs, getPostBySlug } from "@/lib/blog";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Post not found" };

  const url = `https://phasewise.io/blog/${slug}`;
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      authors: post.author ? [post.author] : undefined,
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

function PhaseLogo() {
  return (
    <div className="flex flex-col gap-[3px] justify-center">
      <span className="block h-1 rounded-sm" style={{ width: 22, background: "#2D6A4F" }} />
      <span className="block h-1 rounded-sm" style={{ width: 16, background: "#40916C" }} />
      <span className="block h-1 rounded-sm" style={{ width: 20, background: "#52B788" }} />
    </div>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  // JSON-LD structured data for the article
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.description,
    "datePublished": post.date,
    "author": { "@type": "Organization", "name": "Phasewise" },
    "publisher": {
      "@type": "Organization",
      "name": "Phasewise",
      "logo": {
        "@type": "ImageObject",
        "url": "https://phasewise.io/icon-512",
      },
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://phasewise.io/blog/${slug}`,
    },
    "keywords": post.tags?.join(", "),
  };

  return (
    <div className="bg-white text-[#1A2E22] font-sans min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      {/* Nav */}
      <nav className="border-b border-[#E2EBE4] bg-white/95 backdrop-blur">
        <div className="max-w-[760px] mx-auto px-6 sm:px-10 h-[56px] sm:h-[68px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 no-underline">
            <PhaseLogo />
            <span className="text-[18px] sm:text-[19px] font-semibold tracking-[-0.4px] text-[#1A2E22]">
              phase<em className="not-italic font-light text-[#2D6A4F]">wise</em>
            </span>
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 text-[13px] sm:text-sm font-medium px-4 sm:px-5 py-2 rounded-md bg-[#2D6A4F] text-white hover:bg-[#40916C] transition-all"
          >
            Start Free Trial
          </Link>
        </div>
      </nav>

      {/* Article */}
      <article className="py-12 sm:py-16 px-6 sm:px-10">
        <div className="max-w-[720px] mx-auto">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-[#6B8C74] hover:text-[#2D6A4F] mb-8 transition-colors"
          >
            ← Back to all articles
          </Link>

          {/* Header */}
          <header className="mb-10 pb-8 border-b border-[#E2EBE4]">
            <div className="flex items-center gap-3 text-xs text-[#A3BEA9] mb-4">
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <span>·</span>
              <span>{post.readingTimeMinutes} min read</span>
            </div>
            <h1 className="font-serif text-[clamp(32px,5vw,46px)] font-normal leading-[1.15] text-[#1A2E22] mb-4">
              {post.title}
            </h1>
            <p className="text-lg text-[#6B8C74] leading-[1.7]">
              {post.description}
            </p>
          </header>

          {/* Body */}
          <div
            className="prose-phasewise"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-10 pt-6 border-t border-[#E2EBE4] flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-medium px-3 py-1 rounded-full bg-[#F0FAF4] text-[#2D6A4F] border border-[#52B788]/20"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>

      {/* CTA */}
      <section className="bg-[#F7F9F7] border-t border-[#E2EBE4] py-14 px-6 sm:px-10">
        <div className="max-w-[640px] mx-auto text-center">
          <h2 className="font-serif text-2xl sm:text-3xl text-[#1A2E22] mb-3">
            Run a landscape architecture firm?
          </h2>
          <p className="text-[#6B8C74] mb-7 leading-[1.7]">
            Phasewise handles project phases, budgets, time tracking, submittals, and
            profitability — so your team can focus on design. Try it free for 14 days.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 text-base font-medium px-9 py-[15px] rounded-[7px] bg-[#2D6A4F] text-white hover:bg-[#40916C] hover:-translate-y-0.5 hover:shadow-[0_10px_32px_rgba(45,106,79,0.3)] transition-all"
          >
            Start 14-Day Free Trial
          </Link>
        </div>
      </section>
    </div>
  );
}
