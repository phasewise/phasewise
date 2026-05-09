import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getAllSlugs, getArticleBySlug } from "@/lib/help";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: "Article not found" };

  const base = (process.env.NEXT_PUBLIC_APP_URL ?? "https://phasewise.io").replace(/\/$/, "");
  const url = `${base}/help/${slug}`;
  return {
    title: `${article.title} — Phasewise Help`,
    description: article.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: article.title,
      description: article.description,
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

export default async function HelpArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  return (
    <div className="bg-white text-[#1A2E22] font-sans min-h-screen">
      {/* Nav */}
      <nav className="border-b border-[#E2EBE4] bg-white/95 backdrop-blur">
        <div className="max-w-[780px] mx-auto px-6 sm:px-10 h-[56px] sm:h-[68px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 no-underline">
            <PhaseLogo />
            <span className="text-[18px] sm:text-[19px] font-semibold tracking-[-0.4px] text-[#1A2E22]">
              phase<em className="not-italic font-light text-[#2D6A4F]">wise</em>
            </span>
          </Link>
          <div className="flex items-center gap-3 sm:gap-5">
            <Link href="/help" className="text-sm text-[#3D5C48] hover:text-[#1A2E22]">
              All articles
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 text-[13px] sm:text-sm font-medium px-4 sm:px-5 py-2 rounded-md bg-[#2D6A4F] text-white hover:bg-[#40916C] transition-all"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </nav>

      {/* Article */}
      <article className="py-12 sm:py-16 px-6 sm:px-10">
        <div className="max-w-[780px] mx-auto">
          <Link
            href="/help"
            className="inline-flex items-center gap-1.5 text-sm text-[#6B8C74] hover:text-[#2D6A4F] mb-6 transition-colors"
          >
            <ArrowLeft size={14} /> Help center
          </Link>

          <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#40916C] mb-3">
            {article.category}
          </p>
          <h1 className="font-serif text-[clamp(28px,4vw,42px)] font-normal leading-[1.15] text-[#1A2E22] mb-3">
            {article.title}
          </h1>
          <p className="text-lg text-[#6B8C74] leading-[1.6] mb-10">
            {article.description}
          </p>

          {/* Article body — same prose styling as /blog */}
          <div
            className="prose-phasewise"
            dangerouslySetInnerHTML={{ __html: article.html }}
          />

          <hr className="mt-12 mb-8 border-[#E2EBE4]" />

          <div className="rounded-2xl bg-[#F7F9F7] border border-[#E2EBE4] p-6">
            <h3 className="font-semibold text-[#1A2E22] mb-1">Was this helpful?</h3>
            <p className="text-sm text-[#6B8C74]">
              If something is missing, unclear, or wrong, email{" "}
              <a
                href="mailto:hello@phasewise.io"
                className="underline text-[#2D6A4F] hover:text-[#40916C]"
              >
                hello@phasewise.io
              </a>{" "}
              and we&apos;ll fix it.
            </p>
          </div>
        </div>
      </article>
    </div>
  );
}
