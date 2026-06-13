import type { Metadata } from "next";
import Link from "next/link";

const SITE_URL = "https://phasewise.io";
const DEMO_URL = `${SITE_URL}/demo`;
const VIDEO_URL = `${SITE_URL}/demo.mp4`;
const POSTER_URL = `${SITE_URL}/demo-poster.jpg`;

const PAGE_TITLE = "Phasewise demo — landscape architecture project management";
const PAGE_DESCRIPTION =
  "A nine-minute walkthrough of Phasewise: phases, work plan, MWELO calculator, submittals, profitability reports, and invoicing — built specifically for landscape architecture firms.";

export const metadata: Metadata = {
  title: "Demo",
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/demo" },
  openGraph: {
    type: "video.other",
    url: DEMO_URL,
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    siteName: "Phasewise",
    images: [{ url: POSTER_URL, width: 1920, height: 1080, alt: "Phasewise dashboard preview" }],
    videos: [
      {
        url: VIDEO_URL,
        secureUrl: VIDEO_URL,
        type: "video/mp4",
        width: 1920,
        height: 1080,
      },
    ],
  },
  twitter: {
    card: "player",
    site: "@phasewise",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: [POSTER_URL],
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
          A quick tour of Phasewise
        </h1>
        <p className="text-[#3D5C48] text-base sm:text-lg max-w-[720px] mb-8 leading-relaxed">
          Roughly nine minutes through the app — dashboard, phase tracking, the work plan, timesheets,
          the MWELO water budget calculator, submittal log, profitability reports, and invoice generation.
          Built specifically for landscape architecture firms.
        </p>

        <div className="rounded-xl overflow-hidden border border-[#E2EBE4] shadow-[0_8px_40px_rgba(13,34,24,0.10)] bg-black aspect-video">
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video
            controls
            preload="metadata"
            playsInline
            poster="/demo-poster.jpg"
            className="block w-full h-full"
          >
            <source src="/demo.mp4" type="video/mp4" />
            Your browser does not support HTML5 video. Download the demo:{" "}
            <a href="/demo.mp4">demo.mp4</a>
          </video>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-[960px]">
          <div className="border border-[#E2EBE4] rounded-lg p-5 bg-[#F7F9F7]">
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#40916C] mb-2">
              What it replaces
            </div>
            <p className="text-sm text-[#3D5C48] leading-relaxed">
              The Monograph + Harvest + spreadsheets stack most LA firms run. Sits alongside your QuickBooks.
            </p>
          </div>
          <div className="border border-[#E2EBE4] rounded-lg p-5 bg-[#F7F9F7]">
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#40916C] mb-2">
              Built-in MWELO
            </div>
            <p className="text-sm text-[#3D5C48] leading-relaxed">
              MAWA and ETWU calculated automatically per hydrozone. Branded PDF export for submittals.
            </p>
          </div>
          <div className="border border-[#E2EBE4] rounded-lg p-5 bg-[#F7F9F7]">
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#40916C] mb-2">
              Real profitability
            </div>
            <p className="text-sm text-[#3D5C48] leading-relaxed">
              Per-project, per-phase, per-person. Labor cost uses each person&apos;s actual billing rate,
              not a firm-wide average.
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center">
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
