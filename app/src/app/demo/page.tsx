import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { DEMO_CLIPS } from "@/lib/demo-clips";

const SITE_URL = "https://phasewise.io";
const PAGE_TITLE = "Phasewise demo — landscape architecture project management";
const PAGE_DESCRIPTION =
  "Pick the topic you want to see — short, focused walkthroughs of Phasewise: dashboard, work plan, MWELO calculator, timesheets, submittal log, profitability reports, and invoicing.";

export const metadata: Metadata = {
  title: "Demo",
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/demo" },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/demo`,
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    siteName: "Phasewise",
    images: [
      { url: `${SITE_URL}/demo-poster.jpg`, width: 1920, height: 1080, alt: "Phasewise dashboard preview" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@phasewise",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: [`${SITE_URL}/demo-poster.jpg`],
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

function PlayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
      <path d="M3 1.5v11l9-5.5z" />
    </svg>
  );
}

export default function DemoPage() {
  return (
    <div className="bg-white text-[#1A2E22] font-sans min-h-screen">
      <nav className="border-b border-[#E2EBE4] bg-white/95 backdrop-blur">
        <div className="max-w-[1100px] mx-auto px-6 sm:px-10 h-[56px] sm:h-[68px] flex items-center justify-between">
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

      <div className="max-w-[1100px] mx-auto px-6 sm:px-10 py-10 sm:py-14">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-[#6B8C74] hover:text-[#2D6A4F] mb-6 transition-colors"
        >
          ← Back to home
        </Link>

        <h1 className="font-serif text-[clamp(32px,5vw,52px)] font-normal leading-[1.1] text-[#1A2E22] mb-3">
          See what you want to see
        </h1>
        <p className="text-[#3D5C48] text-base sm:text-lg max-w-[760px] mb-10 leading-relaxed">
          Seven short clips, one topic each. Skip what you don&apos;t need, watch the ones that matter
          to your firm. Each is between twenty seconds and two minutes.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {DEMO_CLIPS.map((clip) => (
            <Link
              key={clip.slug}
              href={`/demo/${clip.slug}`}
              className="group block rounded-lg overflow-hidden border border-[#E2EBE4] bg-white hover:border-[#52B788] hover:shadow-[0_8px_28px_rgba(13,34,24,0.08)] transition-all"
            >
              <div className="relative aspect-video bg-black overflow-hidden">
                <Image
                  src={clip.poster}
                  alt={`${clip.shortTitle} preview`}
                  width={1920}
                  height={1080}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/15 transition-all">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/95 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <span className="text-[#2D6A4F]">
                      <PlayIcon />
                    </span>
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[11px] font-medium px-2 py-0.5 rounded">
                  {clip.duration}
                </div>
              </div>
              <div className="p-5">
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#40916C] mb-1.5">
                  {clip.shortTitle}
                </div>
                <h2 className="text-[15px] font-semibold text-[#1A2E22] mb-2 leading-snug">
                  {clip.title}
                </h2>
                <p className="text-[13px] text-[#6B8C74] leading-relaxed">{clip.description}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-14 flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center pt-10 border-t border-[#E2EBE4]">
          <Link
            href="/signup"
            className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-[#2D6A4F] text-white text-sm font-semibold hover:bg-[#40916C] transition-all"
          >
            Start 14-day free trial
          </Link>
          <Link
            href="/#pricing"
            className="inline-flex items-center justify-center px-6 py-3 rounded-md border border-[#E2EBE4] text-[#1A2E22] text-sm font-semibold hover:bg-[#F7F9F7] transition-all"
          >
            See pricing
          </Link>
          <span className="text-xs text-[#6B8C74] sm:ml-2">No credit card required.</span>
        </div>
      </div>
    </div>
  );
}
