import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog — Landscape architecture practice management",
  description:
    "Practical guides on running a landscape architecture firm — budgets, billing rates, MWELO compliance, project phases, and more. Written for firm owners and project managers.",
  alternates: { canonical: "/blog" },
  openGraph: {
    type: "website",
    url: "https://phasewise.io/blog",
    title: "Phasewise Blog — Landscape architecture practice management",
    description:
      "Practical guides on running a landscape architecture firm — budgets, billing rates, MWELO compliance, project phases, and more.",
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

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <div className="bg-white text-[#1A2E22] font-sans min-h-screen">
      {/* Simple nav */}
      <nav className="border-b border-[#E2EBE4] bg-white/95 backdrop-blur">
        <div className="max-w-[780px] mx-auto px-6 sm:px-10 h-[56px] sm:h-[68px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 no-underline">
            <PhaseLogo />
            <span className="text-[18px] sm:text-[19px] font-semibold tracking-[-0.4px] text-[#1A2E22]">
              phase<em className="not-italic font-light text-[#2D6A4F]">wise</em>
            </span>
          </Link>
          <div className="flex items-center gap-3 sm:gap-5">
            <Link href="/#features" className="text-sm text-[#3D5C48] hover:text-[#1A2E22]">
              Features
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
        <div className="max-w-[780px] mx-auto">
          <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#40916C] mb-4">
            Phasewise Blog
          </p>
          <h1 className="font-serif text-[clamp(34px,5vw,52px)] font-normal leading-[1.1] text-[#1A2E22] mb-4">
            Running a landscape architecture firm,
            <br />
            <em className="italic text-[#2D6A4F]">practically.</em>
          </h1>
          <p className="text-lg text-[#6B8C74] leading-[1.7] max-w-[600px]">
            Guides on budgets, billing rates, MWELO compliance, project phases, and the
            operational side of LA practice. Written for firm owners and project managers.
          </p>
        </div>
      </header>

      {/* Post list */}
      <section className="py-12 sm:py-16 px-6 sm:px-10">
        <div className="max-w-[780px] mx-auto">
          {posts.length === 0 ? (
            <p className="text-[#6B8C74] text-center py-20">
              New articles coming soon.
            </p>
          ) : (
            <ul className="space-y-10 list-none p-0">
              {posts.map((post) => (
                <li key={post.slug} className="border-b border-[#E2EBE4] pb-10 last:border-b-0">
                  <Link href={`/blog/${post.slug}`} className="group block no-underline">
                    <div className="flex items-center gap-3 text-xs text-[#A3BEA9] mb-2">
                      <time dateTime={post.date}>{formatDate(post.date)}</time>
                      <span>·</span>
                      <span>{post.readingTimeMinutes} min read</span>
                    </div>
                    <h2 className="font-serif text-2xl sm:text-3xl text-[#1A2E22] group-hover:text-[#2D6A4F] transition-colors leading-tight mb-2">
                      {post.title}
                    </h2>
                    <p className="text-[15px] leading-[1.7] text-[#6B8C74]">
                      {post.description}
                    </p>
                    <span className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-[#2D6A4F] group-hover:gap-2 transition-all">
                      Read article →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#F7F9F7] border-t border-[#E2EBE4] py-14 sm:py-16 px-6 sm:px-10">
        <div className="max-w-[640px] mx-auto text-center">
          <h2 className="font-serif text-3xl sm:text-4xl text-[#1A2E22] mb-4">
            Put these ideas into practice
          </h2>
          <p className="text-[#6B8C74] mb-8 leading-[1.7]">
            Phasewise is built specifically for landscape architecture firms.
            Try it free for 14 days — no credit card required.
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
