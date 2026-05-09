import type { Metadata } from "next";
import Link from "next/link";
import { Mail } from "lucide-react";
import { getArticlesByCategory } from "@/lib/help";

export const metadata: Metadata = {
  title: "Help Center — Phasewise",
  description:
    "How to use Phasewise — getting started, team management, projects, time tracking, invoicing, and integrations. Practical guides for landscape architecture firms.",
  alternates: { canonical: "/help" },
  openGraph: {
    type: "website",
    url: "https://phasewise.io/help",
    title: "Phasewise Help Center",
    description:
      "How to use Phasewise — guides for firm owners and project managers.",
  },
};

function PhaseLogo() {
  return (
    <div className="flex flex-col gap-[3px] justify-center">
      <span className="block h-1 rounded-sm" style={{ width: 22, background: "#2D6A4F" }} />
      <span className="block h-1 rounded-sm" style={{ width: 16, background: "#40916C" }} />
      <span className="block h-1 rounded-sm" style={{ width: 20, background: "#52B788" }} />
    </div>
  );
}

export default function HelpIndexPage() {
  const byCategory = getArticlesByCategory();
  const categories = Array.from(byCategory.keys());

  return (
    <div className="bg-white text-[#1A2E22] font-sans min-h-screen">
      {/* Nav (same shape as /blog) */}
      <nav className="border-b border-[#E2EBE4] bg-white/95 backdrop-blur">
        <div className="max-w-[860px] mx-auto px-6 sm:px-10 h-[56px] sm:h-[68px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 no-underline">
            <PhaseLogo />
            <span className="text-[18px] sm:text-[19px] font-semibold tracking-[-0.4px] text-[#1A2E22]">
              phase<em className="not-italic font-light text-[#2D6A4F]">wise</em>
            </span>
          </Link>
          <div className="flex items-center gap-3 sm:gap-5">
            <Link href="/blog" className="text-sm text-[#3D5C48] hover:text-[#1A2E22]">
              Blog
            </Link>
            <Link href="/#pricing" className="text-sm text-[#3D5C48] hover:text-[#1A2E22]">
              Pricing
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

      {/* Header */}
      <header className="py-16 sm:py-20 px-6 sm:px-10 border-b border-[#E2EBE4]">
        <div className="max-w-[860px] mx-auto">
          <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#40916C] mb-4">
            Help Center
          </p>
          <h1 className="font-serif text-[clamp(34px,5vw,52px)] font-normal leading-[1.1] text-[#1A2E22] mb-4">
            How to use <em className="italic text-[#2D6A4F]">Phasewise</em>
          </h1>
          <p className="text-lg text-[#6B8C74] leading-[1.7] max-w-[600px]">
            Step-by-step guides for firm owners and team members. Pick a topic
            below, or email us at{" "}
            <a
              href="mailto:hello@phasewise.io"
              className="underline text-[#2D6A4F] hover:text-[#40916C]"
            >
              hello@phasewise.io
            </a>{" "}
            if you can&apos;t find what you need.
          </p>
        </div>
      </header>

      {/* Category sections */}
      <section className="py-12 sm:py-16 px-6 sm:px-10">
        <div className="max-w-[860px] mx-auto">
          {categories.length === 0 ? (
            <p className="text-[#6B8C74] text-center py-20">
              Help articles coming soon.
            </p>
          ) : (
            <div className="space-y-12">
              {categories.map((category) => {
                const articles = byCategory.get(category) ?? [];
                return (
                  <div key={category}>
                    <h2 className="font-serif text-2xl text-[#1A2E22] mb-6">
                      {category}
                    </h2>
                    <ul className="space-y-3 list-none p-0">
                      {articles.map((article) => (
                        <li
                          key={article.slug}
                          className="rounded-2xl border border-[#E2EBE4] bg-white hover:border-[#52B788] transition-colors"
                        >
                          <Link
                            href={`/help/${article.slug}`}
                            className="block px-5 py-4 group no-underline"
                          >
                            <h3 className="font-semibold text-[#1A2E22] group-hover:text-[#2D6A4F] transition-colors mb-1">
                              {article.title}
                            </h3>
                            <p className="text-sm text-[#6B8C74] leading-relaxed">
                              {article.description}
                            </p>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-[#F7F9F7] border-t border-[#E2EBE4] py-14 sm:py-16 px-6 sm:px-10">
        <div className="max-w-[640px] mx-auto text-center">
          <h2 className="font-serif text-3xl sm:text-4xl text-[#1A2E22] mb-4">
            Still stuck?
          </h2>
          <p className="text-[#6B8C74] mb-6 leading-[1.7]">
            Reply to any Phasewise email or write to{" "}
            <a
              href="mailto:hello@phasewise.io"
              className="underline text-[#2D6A4F] hover:text-[#40916C]"
            >
              hello@phasewise.io
            </a>
            . We respond within one business day.
          </p>
          <a
            href="mailto:hello@phasewise.io"
            className="inline-flex items-center gap-2 text-base font-medium px-7 py-[14px] rounded-[7px] bg-[#2D6A4F] text-white hover:bg-[#40916C] hover:-translate-y-0.5 transition-all"
          >
            <Mail className="w-4 h-4" />
            Contact us
          </a>
        </div>
      </section>
    </div>
  );
}
