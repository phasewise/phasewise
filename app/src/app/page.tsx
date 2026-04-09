import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  FileText,
  Layers,
  Leaf,
  ShieldCheck,
  Wallet,
  X,
} from "lucide-react";
import RevealOnScroll from "./_components/RevealOnScroll";
import NavScrollEffect from "./_components/NavScrollEffect";

const painPoints = [
  "Budget tracking across 12 separate spreadsheet tabs",
  "Finding out you're over budget after it's already happened",
  "Chasing timesheets via email every Friday afternoon",
  "Submittals tracked in a shared doc nobody updates",
  "No idea which projects are actually profitable",
  "Staff asking \"which phase should I log this to?\" daily",
];

const solutions = [
  "One dashboard shows every project's health at a glance",
  "Real-time budget alerts before you go over — not after",
  "Staff submit time from anywhere in under 2 minutes",
  "Submittal log with automatic reminders and full history",
  "Profitability reports per project, per phase, per person",
  "Your phases are already built in — SD, DD, CDs, CA, and more",
];

const features = [
  {
    icon: Layers,
    title: "Phase-Based Projects",
    desc: "SD → DD → CDs → CA → Closeout. Your phases are already here. New projects start in the right structure automatically.",
  },
  {
    icon: Wallet,
    title: "Real-Time Budget Tracking",
    desc: "Know exactly how much is spent per project and per phase the moment a timesheet is submitted. Alerts before you go over.",
  },
  {
    icon: Clock,
    title: "Time Tracking That Fits",
    desc: "Weekly timesheet grid by project and phase. Mobile-friendly for field and remote staff. Takes less than two minutes to complete.",
  },
  {
    icon: FileText,
    title: "Submittal & RFI Manager",
    desc: "Track submittals, RFIs, and ball-in-court with automated reminders and a searchable log. Full history, always current.",
  },
  {
    icon: Leaf,
    title: "Plant Schedule Manager",
    desc: "Live plant database with substitution tracking and client-approval workflows. Export directly to CAD-compatible format.",
  },
  {
    icon: ShieldCheck,
    title: "Compliance Tracker",
    desc: "MWELO water budgets, LEED credits, permit tracking — all in one place with zero redundancy across projects.",
  },
];

const tiers = [
  {
    name: "Starter",
    price: "$99",
    desc: "Small practices & solo firms",
    features: [
      "Up to 5 users",
      "20 active projects",
      "Time tracking & budgets",
      "Basic reports",
      "Email support",
    ],
    featured: false,
  },
  {
    name: "Professional",
    price: "$199",
    desc: "Growing firms",
    features: [
      "Up to 15 users",
      "Unlimited projects",
      "All modules included",
      "Client portal",
      "Priority support",
    ],
    featured: true,
  },
  {
    name: "Studio",
    price: "$349",
    desc: "Multi-disciplinary studios",
    features: [
      "Unlimited everything",
      "Custom integrations",
      "QuickBooks sync",
      "Client portal",
      "Dedicated support",
    ],
    featured: false,
  },
];

const testimonials = [
  {
    quote:
      "Phasewise replaced four separate tools we were using. Our project managers actually use it every single day now.",
    author: "Principal, Landscape Architect",
    firm: "Mid-size LA firm, California",
  },
  {
    quote:
      "We caught a budget overrun in week two instead of week twelve. That alone paid for an entire year of the subscription.",
    author: "Studio Director",
    firm: "Design-build practice, Pacific Northwest",
  },
  {
    quote:
      "Finally — project management software that understands what a phase actually means to a landscape architect.",
    author: "Senior Project Manager",
    firm: "Urban design firm, New York",
  },
];

function PhaseLogo({ dark = false }: { dark?: boolean }) {
  const colors = dark
    ? ["#52B788", "#40916C", "#2D6A4F"]
    : ["#2D6A4F", "#40916C", "#52B788"];
  return (
    <div className="flex flex-col gap-[3px] justify-center">
      <span className="block h-1 rounded-sm" style={{ width: 22, background: colors[0] }} />
      <span className="block h-1 rounded-sm" style={{ width: 16, background: colors[1] }} />
      <span className="block h-1 rounded-sm" style={{ width: 20, background: colors[2] }} />
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="bg-white text-[#1A2E22] font-sans">
      <NavScrollEffect />

      {/* ── Nav ─────────────────────────────────────── */}
      <nav
        id="pw-nav"
        className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-b border-[#E2EBE4] transition-shadow"
      >
        <div className="max-w-[1120px] mx-auto px-5 sm:px-10 h-[64px] sm:h-[68px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 no-underline">
            <PhaseLogo />
            <span className="text-[18px] sm:text-[19px] font-semibold tracking-[-0.4px] text-[#1A2E22]">
              phase<em className="not-italic font-light text-[#2D6A4F]">wise</em>
            </span>
          </Link>
          <ul className="hidden md:flex items-center gap-9 list-none">
            <li>
              <a href="#features" className="text-sm text-[#3D5C48] hover:text-[#1A2E22] transition-colors">
                Features
              </a>
            </li>
            <li>
              <a href="#pricing" className="text-sm text-[#3D5C48] hover:text-[#1A2E22] transition-colors">
                Pricing
              </a>
            </li>
            <li>
              <a href="#about" className="text-sm text-[#3D5C48] hover:text-[#1A2E22] transition-colors">
                About
              </a>
            </li>
          </ul>
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/login"
              className="hidden sm:inline text-sm text-[#3D5C48] hover:text-[#1A2E22] transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 text-[13px] sm:text-sm font-medium px-4 sm:px-6 py-2 sm:py-[11px] rounded-md bg-[#2D6A4F] text-white hover:bg-[#40916C] hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(45,106,79,0.3)] transition-all whitespace-nowrap"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────── */}
      <section className="pt-24 sm:pt-32 lg:pt-40 pb-16 sm:pb-20 px-6 sm:px-10 bg-white relative overflow-hidden">
        <div className="max-w-[1120px] mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#F0FAF4] border border-[#52B788]/30 rounded-full px-3.5 py-[5px] text-xs font-medium text-[#2D6A4F] mb-6 sm:mb-7">
              <span className="w-1.5 h-1.5 rounded-full bg-[#52B788]" />
              Built by a landscape architect
            </div>
            <h1 className="font-serif text-[clamp(34px,7vw,58px)] font-normal leading-[1.1] text-[#1A2E22] mb-5 sm:mb-6 tracking-[-0.5px]">
              Focus on the <em className="italic text-[#2D6A4F]">design.</em>
              <br />
              We&apos;ll handle everything else.
            </h1>
            <p className="text-base sm:text-lg leading-[1.7] sm:leading-[1.75] text-[#6B8C74] mb-8 sm:mb-10 max-w-[480px]">
              Phasewise is the operating system for landscape architecture firms.
              Project management, budgets, time tracking, billing, and client coordination — automated, so you can spend more time designing.
            </p>
            <div className="flex gap-3.5 items-center flex-wrap">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 text-base font-medium px-9 py-[15px] rounded-[7px] bg-[#2D6A4F] text-white hover:bg-[#40916C] hover:-translate-y-0.5 hover:shadow-[0_10px_32px_rgba(45,106,79,0.3)] transition-all"
              >
                Start 14-Day Free Trial
              </Link>
              <a
                href="#features"
                className="inline-flex items-center gap-2 text-base font-medium px-9 py-[14px] rounded-[7px] bg-transparent text-[#3D5C48] border border-[#E2EBE4] hover:border-[#52B788] hover:text-[#2D6A4F] hover:bg-[#F0FAF4] transition-all"
              >
                See Features
              </a>
            </div>
            <p className="text-xs text-[#A3BEA9] mt-4 tracking-wide">
              No credit card required · Cancel anytime
            </p>
          </div>

          {/* Hero mockup */}
          <RevealOnScroll>
            <div className="bg-[#1A2E22] rounded-[14px] overflow-hidden shadow-[0_32px_80px_rgba(26,46,34,0.25),0_8px_24px_rgba(26,46,34,0.12)] border border-white/[0.06]">
              <div className="bg-white/[0.04] border-b border-white/[0.06] py-3 px-4 flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#E76F51]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#E9C46A]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#52B788]" />
                <div className="flex-1 ml-2 bg-white/[0.06] rounded px-3 py-1 text-[11px] text-white/30 font-mono">
                  phasewise.io/projects/canyon-creek
                </div>
              </div>
              <div className="flex h-[380px]">
                <div className="w-[200px] py-5 border-r border-white/[0.06] bg-black/15">
                  <div className="text-[9px] font-semibold tracking-[0.15em] text-white/25 px-5 pb-3 uppercase">
                    Navigation
                  </div>
                  {[
                    { name: "Dashboard", active: true },
                    { name: "Projects", active: false },
                    { name: "Budget", active: false },
                    { name: "Timesheets", active: false },
                    { name: "Submittals", active: false },
                    { name: "Plants", active: false },
                    { name: "Reports", active: false },
                  ].map((item) => (
                    <div
                      key={item.name}
                      className={`py-2.5 px-5 text-xs flex items-center gap-2.5 ${
                        item.active
                          ? "bg-[#52B788]/[0.12] text-[#52B788] border-l-2 border-[#52B788]"
                          : "text-white/40"
                      }`}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-current flex-shrink-0" />
                      {item.name}
                    </div>
                  ))}
                </div>
                <div className="flex-1 p-6 overflow-hidden">
                  <div className="flex justify-between items-start mb-5">
                    <div>
                      <div className="font-serif text-base text-white/90">Canyon Creek Master Plan</div>
                      <div className="text-[10px] text-white/30 mt-0.5">Active · 4 phases · 8 team members</div>
                    </div>
                    <div className="text-[10px] font-semibold py-[3px] px-2.5 rounded-xl bg-[#52B788]/15 border border-[#52B788]/30 text-[#52B788]">
                      On Track
                    </div>
                  </div>
                  <div className="bg-white/[0.04] border border-white/[0.08] rounded-lg p-3.5 mb-3.5">
                    <div className="flex justify-between text-[10px] text-white/30 tracking-wider uppercase mb-2">
                      <span>Total Budget</span>
                      <span className="text-[#C9A87C]">72% used</span>
                    </div>
                    <div>
                      <span className="font-serif text-2xl text-white/90">$147,200</span>
                      <span className="text-[11px] text-white/30 ml-1.5">of $204,000</span>
                    </div>
                    <div className="h-[5px] bg-white/[0.06] rounded mt-2.5 overflow-hidden">
                      <div className="h-full rounded bg-gradient-to-r from-[#2D6A4F] to-[#52B788]" style={{ width: "72%" }} />
                    </div>
                  </div>
                  <div className="text-[9px] font-semibold tracking-[0.15em] text-white/25 uppercase mb-2.5">
                    Project Phases
                  </div>
                  {[
                    { name: "Schematic Design", pct: 100, color: "#52B788" },
                    { name: "Design Development", pct: 78, color: "#40916C" },
                    { name: "Construction Docs", pct: 42, color: "#2D6A4F" },
                    { name: "Bidding & Negotiation", pct: 0, color: "#1A3D2B" },
                  ].map((phase) => (
                    <div key={phase.name} className="flex items-center gap-2.5 mb-2">
                      <div className="text-[10px] text-white/45 w-[140px] flex-shrink-0">{phase.name}</div>
                      <div className="flex-1 h-1 bg-white/[0.05] rounded-sm overflow-hidden">
                        <div className="h-full rounded-sm" style={{ width: `${phase.pct}%`, background: phase.color }} />
                      </div>
                      <div
                        className="text-[10px] w-7 text-right"
                        style={{ color: phase.pct > 0 ? phase.color : "rgba(255,255,255,0.3)" }}
                      >
                        {phase.pct > 0 ? `${phase.pct}%` : "—"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* ── Proof Bar ─────────────────────────────── */}
      <div className="bg-[#F7F9F7] border-y border-[#E2EBE4] py-10 sm:py-11 px-6 sm:px-10">
        <div className="max-w-[1120px] mx-auto flex flex-col items-center gap-8 sm:gap-9">
          <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#40916C] text-center">
            Built for landscape architecture firms
          </p>
          <div className="flex gap-6 sm:gap-12 items-center flex-wrap justify-center">
            {["Clearwater Studio", "Mesa + Associates", "Groundwork LA", "Terrain Group", "Grove Design"].map((firm) => (
              <span key={firm} className="text-sm font-medium text-[#A3BEA9] tracking-wide font-serif">
                {firm}
              </span>
            ))}
          </div>
          <div className="flex gap-8 sm:gap-16 flex-wrap justify-center">
            {[
              { num: "200+", label: "Projects managed" },
              { num: "15%", label: "Avg. budget savings" },
              { num: "5 hrs", label: "Saved per PM weekly" },
              { num: "14 day", label: "Free trial" },
            ].map((stat) => (
              <RevealOnScroll key={stat.label}>
                <div className="text-center">
                  <div className="font-serif text-[38px] text-[#2D6A4F]">{stat.num}</div>
                  <div className="text-xs text-[#A3BEA9] tracking-wide mt-1">{stat.label}</div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </div>

      {/* ── Pain → Solution ─────────────────────── */}
      <section className="py-16 sm:py-24 px-6 sm:px-10 bg-white">
        <div className="max-w-[1120px] mx-auto">
          <div className="text-center mb-14">
            <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#40916C] mb-4">The Problem</p>
            <h2 className="font-serif text-[clamp(30px,3.5vw,46px)] font-normal leading-[1.15] text-[#1A2E22]">
              Your firm runs on Excel.
              <br />
              <em className="italic text-[#2D6A4F]">It shouldn&apos;t.</em>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-[2px] rounded-[14px] overflow-hidden shadow-[0_8px_32px_rgba(26,46,34,0.08)]">
            <div className="bg-[#F7F9F7] p-12 md:p-14">
              <div className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#B04030] mb-7">
                Before Phasewise
              </div>
              {painPoints.map((pain) => (
                <div key={pain} className="flex gap-3.5 items-start mb-[18px]">
                  <div className="w-5 h-5 rounded-full bg-[#B04030]/10 border border-[#B04030]/25 flex items-center justify-center flex-shrink-0 mt-px">
                    <X className="w-2.5 h-2.5 text-[#B04030]" strokeWidth={2.5} />
                  </div>
                  <div className="text-sm leading-[1.6] text-[#6B8C74]">{pain}</div>
                </div>
              ))}
            </div>
            <div className="bg-[#1A2E22] p-12 md:p-14">
              <div className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#52B788] mb-7">
                After Phasewise
              </div>
              {solutions.map((solution) => (
                <div key={solution} className="flex gap-3.5 items-start mb-[18px]">
                  <div className="w-5 h-5 rounded-full bg-[#52B788]/[0.12] border border-[#52B788]/30 flex items-center justify-center flex-shrink-0 mt-px">
                    <CheckCircle2 className="w-2.5 h-2.5 text-[#52B788]" strokeWidth={2.5} />
                  </div>
                  <div className="text-sm leading-[1.6] text-white/60">{solution}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ────────────────────────────── */}
      <section id="features" className="py-16 sm:py-24 px-6 sm:px-10 bg-[#F7F9F7]">
        <div className="max-w-[1120px] mx-auto">
          <div className="text-center mb-14">
            <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#40916C] mb-4">Features</p>
            <h2 className="font-serif text-[clamp(30px,3.5vw,46px)] font-normal leading-[1.15] text-[#1A2E22]">
              Everything your firm needs.
              <br />
              <em className="italic text-[#2D6A4F]">Nothing it doesn&apos;t.</em>
            </h2>
            <p className="text-lg text-[#6B8C74] leading-[1.65] max-w-[560px] mx-auto mt-5">
              Purpose-built for the way landscape architecture firms actually operate — from first client meeting to final punchlist.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-px bg-[#E2EBE4] border border-[#E2EBE4] rounded-[14px] overflow-hidden">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="bg-white p-10 hover:bg-[#F0FAF4] transition-colors"
                >
                  <div className="w-11 h-11 rounded-[10px] bg-[#F0FAF4] border border-[#52B788]/20 flex items-center justify-center mb-5 text-[#2D6A4F]">
                    <Icon className="w-5 h-5" strokeWidth={1.5} />
                  </div>
                  <div className="text-base font-semibold text-[#1A2E22] mb-2">{feature.title}</div>
                  <div className="text-sm leading-[1.65] text-[#6B8C74]">{feature.desc}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Pricing ─────────────────────────────── */}
      <section id="pricing" className="py-16 sm:py-24 px-6 sm:px-10 bg-white">
        <div className="max-w-[1120px] mx-auto">
          <div className="text-center mb-16">
            <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#40916C] mb-4">Pricing</p>
            <h2 className="font-serif text-[clamp(30px,3.5vw,46px)] font-normal leading-[1.15] text-[#1A2E22]">
              Less than your
              <br />
              <em className="italic text-[#2D6A4F]">QuickBooks subscription.</em>
            </h2>
            <p className="text-lg text-[#6B8C74] leading-[1.65] max-w-[560px] mx-auto mt-5">
              Simple, transparent pricing. No per-project fees, no hidden costs. Start free, upgrade when you&apos;re ready.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-5 items-start">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`relative rounded-[14px] p-10 transition-all ${
                  tier.featured
                    ? "border border-[#2D6A4F] bg-[#1A2E22] md:scale-[1.03] shadow-[0_20px_60px_rgba(26,46,34,0.25)]"
                    : "border border-[#E2EBE4] bg-white hover:border-[#52B788] hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(45,106,79,0.12)]"
                }`}
              >
                {tier.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#2D6A4F] text-white text-[10px] font-semibold tracking-[0.12em] uppercase px-4 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <div
                  className={`text-[11px] font-semibold tracking-[0.18em] uppercase mb-4 ${
                    tier.featured ? "text-[#52B788]" : "text-[#40916C]"
                  }`}
                >
                  {tier.name}
                </div>
                <div className={`font-serif text-5xl leading-none ${tier.featured ? "text-white" : "text-[#1A2E22]"}`}>
                  {tier.price}
                  <span className={`text-sm ml-1 ${tier.featured ? "text-white/40" : "text-[#A3BEA9]"}`}>/mo</span>
                </div>
                <div className={`text-[13px] mt-2 mb-6 ${tier.featured ? "text-white/40" : "text-[#A3BEA9]"}`}>
                  {tier.desc}
                </div>
                <div className={`h-px mb-6 ${tier.featured ? "bg-white/[0.08]" : "bg-[#E2EBE4]"}`} />
                <ul className="list-none mb-8 space-y-3">
                  {tier.features.map((feat) => (
                    <li
                      key={feat}
                      className={`flex gap-2.5 items-center text-sm ${
                        tier.featured ? "text-white/65" : "text-[#3D5C48]"
                      }`}
                    >
                      <CheckCircle2
                        className="w-3.5 h-3.5 flex-shrink-0"
                        strokeWidth={2.5}
                        style={{ color: tier.featured ? "#52B788" : "#40916C" }}
                      />
                      {feat}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className={`w-full inline-flex items-center justify-center gap-2 px-3 py-3.5 rounded-[7px] text-sm font-medium transition-all ${
                    tier.featured
                      ? "bg-[#52B788] text-[#1A2E22] hover:bg-[#B7E4C7] hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(82,183,136,0.3)]"
                      : "bg-[#F0FAF4] text-[#2D6A4F] border border-[#B7E4C7] hover:bg-[#2D6A4F] hover:text-white hover:border-transparent"
                  }`}
                >
                  Start Free Trial
                  {tier.featured && <ArrowRight className="w-4 h-4" />}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────── */}
      <section className="py-16 sm:py-24 px-6 sm:px-10 bg-[#F7F9F7]">
        <div className="max-w-[1120px] mx-auto">
          <div className="text-center mb-14">
            <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#40916C] mb-4">What firms say</p>
            <h2 className="font-serif text-[clamp(30px,3.5vw,46px)] font-normal leading-[1.15] text-[#1A2E22]">
              Built for how
              <br />
              <em className="italic text-[#2D6A4F]">you actually work.</em>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t) => (
              <div
                key={t.author}
                className="bg-white border border-[#E2EBE4] rounded-[14px] p-9 hover:border-[#B7E4C7] hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(26,46,34,0.07)] transition-all"
              >
                <div className="text-[#C9A87C] text-sm mb-4">★★★★★</div>
                <div className="text-[15px] leading-[1.7] text-[#3D5C48] mb-6 italic">&ldquo;{t.quote}&rdquo;</div>
                <div className="font-semibold text-sm text-[#1A2E22]">{t.author}</div>
                <div className="text-xs text-[#A3BEA9] mt-1">{t.firm}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────── */}
      <section className="bg-[#1A2E22] py-20 sm:py-32 px-6 sm:px-10 text-center relative overflow-hidden">
        <div
          className="absolute -top-48 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse, rgba(82,183,136,0.12) 0%, transparent 70%)",
          }}
        />
        <div className="relative z-10 max-w-[640px] mx-auto">
          <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#52B788]/70 mb-4">
            Your projects deserve better
          </p>
          <h2 className="font-serif text-[clamp(36px,5vw,60px)] font-normal leading-[1.1] text-white mb-6">
            Spend more time
            <br />
            <em className="italic text-[#52B788]">on the design.</em>
          </h2>
          <p className="text-lg text-white/50 leading-[1.7] max-w-[480px] mx-auto mb-12">
            Phasewise handles the project management, billing, and admin so your team can focus on what they do best.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 text-base font-medium px-9 py-[15px] rounded-[7px] bg-white text-[#1A2E22] hover:bg-[#F0FAF4] hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)] transition-all"
            >
              Start Your Free 14-Day Trial
            </Link>
            <a
              href="#features"
              className="inline-flex items-center gap-2 text-base font-medium px-9 py-[14px] rounded-[7px] bg-white/[0.08] text-white/70 border border-white/15 hover:bg-white/[0.12] transition-colors"
            >
              Explore Features
            </a>
          </div>
          <p className="text-xs text-white/25 mt-5 tracking-wide">
            No credit card required · Cancel anytime · Setup in 5 minutes
          </p>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────── */}
      <footer className="bg-[#0D2218] py-12 sm:py-16 px-6 sm:px-10 border-t border-white/[0.04]">
        <div className="max-w-[1120px] mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-14">
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <PhaseLogo dark />
                <span className="text-lg font-semibold tracking-[-0.3px] text-white">
                  phase<span className="font-light text-[#52B788]">wise</span>
                </span>
              </div>
              <p className="text-[13px] leading-[1.7] text-white/30 mt-4">
                Project management built for landscape architects. Track every phase, budget, and hour — the way your firm actually works.
              </p>
            </div>
            <div>
              <div className="text-[10px] font-semibold tracking-[0.18em] uppercase text-white/30 mb-5">Product</div>
              <ul className="list-none space-y-3">
                {["Features", "Pricing", "Roadmap", "Changelog", "API"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-[13px] text-white/35 hover:text-white/75 transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-[10px] font-semibold tracking-[0.18em] uppercase text-white/30 mb-5">Company</div>
              <ul className="list-none space-y-3">
                {["About", "Blog", "Careers", "Contact"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-[13px] text-white/35 hover:text-white/75 transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-[10px] font-semibold tracking-[0.18em] uppercase text-white/30 mb-5">Support</div>
              <ul className="list-none space-y-3">
                {["Documentation", "Help Center", "System Status", "Privacy Policy", "Terms of Service"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-[13px] text-white/35 hover:text-white/75 transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-white/[0.06] pt-6 flex justify-between items-center flex-wrap gap-3">
            <span className="text-xs text-white/20">
              © 2026 Phasewise. Built by a landscape architect, for landscape architects.
            </span>
            <span className="text-xs text-white/20">phasewise.io</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

