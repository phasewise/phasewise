import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DEMO_CLIPS, getDemoClipBySlug } from "@/lib/demo-clips";

const SITE_URL = "https://phasewise.io";

export function generateStaticParams() {
  return DEMO_CLIPS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const clip = getDemoClipBySlug(slug);
  if (!clip) return {};
  const url = `${SITE_URL}/demo/${clip.slug}`;
  const videoUrl = `${SITE_URL}${clip.mp4}`;
  const posterUrl = `${SITE_URL}${clip.poster}`;
  const title = `${clip.title} — Phasewise demo`;
  return {
    title: `${clip.shortTitle} demo`,
    description: clip.description,
    alternates: { canonical: `/demo/${clip.slug}` },
    openGraph: {
      type: "video.other",
      url,
      title,
      description: clip.description,
      siteName: "Phasewise",
      images: [{ url: posterUrl, width: 1920, height: 1080, alt: `${clip.shortTitle} preview` }],
      videos: [
        {
          url: videoUrl,
          secureUrl: videoUrl,
          type: "video/mp4",
          width: 1920,
          height: 1080,
        },
      ],
    },
    twitter: {
      // summary_large_image is the most reliable card type that doesn't
      // require Twitter Player Card approval. Falls back gracefully on
      // LinkedIn, Slack, and email clients that respect Twitter Cards.
      card: "summary_large_image",
      site: "@phasewise",
      title,
      description: clip.description,
      images: [posterUrl],
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

export default async function DemoClipPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const clip = getDemoClipBySlug(slug);
  if (!clip) notFound();

  const idx = DEMO_CLIPS.findIndex((c) => c.slug === clip.slug);
  const prev = idx > 0 ? DEMO_CLIPS[idx - 1] : null;
  const next = idx < DEMO_CLIPS.length - 1 ? DEMO_CLIPS[idx + 1] : null;

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
          href="/demo"
          className="inline-flex items-center gap-1.5 text-sm text-[#6B8C74] hover:text-[#2D6A4F] mb-6 transition-colors"
        >
          ← All demo clips
        </Link>

        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#40916C] mb-2">
          {clip.shortTitle} · {clip.duration}
        </div>
        <h1 className="font-serif text-[clamp(28px,4.5vw,44px)] font-normal leading-[1.15] text-[#1A2E22] mb-3">
          {clip.title}
        </h1>
        <p className="text-[#3D5C48] text-base sm:text-lg max-w-[760px] mb-8 leading-relaxed">
          {clip.description}
        </p>

        <div className="rounded-xl overflow-hidden border border-[#E2EBE4] shadow-[0_8px_40px_rgba(13,34,24,0.10)] bg-black aspect-video">
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video
            controls
            autoPlay
            preload="metadata"
            playsInline
            poster={clip.poster}
            className="block w-full h-full"
          >
            <source src={clip.mp4} type="video/mp4" />
            Your browser does not support HTML5 video. Download:{" "}
            <a href={clip.mp4}>{clip.slug}.mp4</a>
          </video>
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10 max-w-[1000px]">
          <div>
            <h2 className="font-serif text-[22px] sm:text-[26px] font-normal text-[#1A2E22] mb-4">
              What&apos;s in this clip
            </h2>
            <ul className="space-y-2.5">
              {clip.bullets.map((b) => (
                <li key={b} className="flex gap-3 items-start text-[15px] text-[#3D5C48] leading-relaxed">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#40916C] flex-shrink-0" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border border-[#E8D5B7] rounded-lg p-5 bg-[#FAF6EF] h-fit">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7A5A2E] bg-[#E8D5B7] px-2 py-0.5 rounded-full mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7A5A2E]" />
              Founding member
            </div>
            <p className="text-sm text-[#3D5C48] leading-relaxed mb-3">
              <strong className="text-[#1A2E22]">$49/mo for 12 months</strong> (first 20 firms).
              We import your existing projects, clients, and staff for you. 14-day free trial, no
              card to start.
            </p>
            <div className="flex flex-col gap-2">
              <Link
                href="/signup?plan=founding"
                className="inline-flex items-center justify-center px-4 py-2.5 rounded-md bg-[#2D6A4F] text-white text-sm font-semibold hover:bg-[#40916C] transition-all"
              >
                Claim founding spot
              </Link>
              <Link
                href="/#pricing"
                className="inline-flex items-center justify-center px-4 py-2.5 rounded-md border border-[#E2EBE4] text-[#1A2E22] text-sm font-semibold hover:bg-white transition-all"
              >
                See standard pricing
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-[#E2EBE4] flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
          {prev ? (
            <Link
              href={`/demo/${prev.slug}`}
              className="text-sm text-[#6B8C74] hover:text-[#2D6A4F] transition-colors"
            >
              ← {prev.shortTitle}
            </Link>
          ) : (
            <span />
          )}
          <Link
            href="/demo"
            className="text-sm font-semibold text-[#2D6A4F] hover:text-[#40916C] transition-colors"
          >
            All demo clips
          </Link>
          {next ? (
            <Link
              href={`/demo/${next.slug}`}
              className="text-sm text-[#6B8C74] hover:text-[#2D6A4F] transition-colors"
            >
              {next.shortTitle} →
            </Link>
          ) : (
            <span />
          )}
        </div>
      </div>
    </div>
  );
}
