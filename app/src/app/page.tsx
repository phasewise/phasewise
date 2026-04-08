import Link from "next/link";
import {
  BarChart3,
  Clock,
  FolderKanban,
  Leaf,
  Shield,
  Zap,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-slate-950/90 backdrop-blur border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Leaf className="h-6 w-6 text-emerald-400" />
          <span className="font-semibold text-lg tracking-tight">Phasewise</span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm text-slate-400 hover:text-white transition"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="text-sm bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-medium px-4 py-2 rounded-lg transition"
          >
            Start free trial
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs tracking-wide px-3 py-1.5 rounded-full mb-8">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
          Built by a landscape architect
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-6">
          Stop managing
          <br />
          projects in{" "}
          <span className="text-emerald-400 italic">spreadsheets.</span>
        </h1>
        <p className="text-lg text-slate-400 max-w-xl mx-auto mb-10 leading-relaxed">
          Phasewise is the project management platform built specifically for
          landscape architecture firms. Track phases, budgets, time, and
          profitability — the way you actually work.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/signup"
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-medium px-6 py-3 rounded-lg text-sm transition"
          >
            Start 14-day free trial →
          </Link>
          <Link
            href="#features"
            className="border border-slate-700 hover:border-emerald-500/30 text-slate-400 hover:text-white px-6 py-3 rounded-lg text-sm transition"
          >
            See features
          </Link>
        </div>
        <div className="flex items-center justify-center gap-8 mt-12 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-400">0</div>
            <div className="text-slate-500">competitors</div>
          </div>
          <div className="w-px h-8 bg-slate-800" />
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-400">7</div>
            <div className="text-slate-500">LA project phases</div>
          </div>
          <div className="w-px h-8 bg-slate-800" />
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-400">5 min</div>
            <div className="text-slate-500">to set up</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs tracking-widest text-emerald-400 uppercase mb-4">
            Features
          </p>
          <h2 className="text-3xl md:text-4xl font-bold">
            Everything your firm needs. Nothing it doesn&apos;t.
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: FolderKanban,
              title: "Phase-Based Projects",
              desc: "PD → SD → DD → CD → Bid → CA → Closeout. Your projects already have phases — now your software does too.",
            },
            {
              icon: BarChart3,
              title: "Real-Time Budget Tracking",
              desc: "Know exactly how much fee is burned per phase, right now. Not after the project is over. Alerts at 75%, 90%, 100%.",
            },
            {
              icon: Clock,
              title: "Time Tracking That Fits",
              desc: "Weekly timesheet grid by project and phase. Mobile-friendly for field visits. Submit and approve workflows built in.",
            },
            {
              icon: Zap,
              title: "Submittal & RFI Manager",
              desc: "Track submittals, RFIs, and ball-in-court with automated reminders. Searchable history across all projects.",
            },
            {
              icon: Leaf,
              title: "Plant Schedule Manager",
              desc: "Built-in plant database with substitution tracking and client approval workflows. Export to CAD-compatible format.",
            },
            {
              icon: Shield,
              title: "Compliance Tracker",
              desc: "MWELO water budgets, LEED credits, SITES certification, permit tracking — all in one place with auto-reminders.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-emerald-500/30 transition"
            >
              <f.icon className="h-8 w-8 text-emerald-400 mb-4" />
              <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs tracking-widest text-emerald-400 uppercase mb-4">
            Pricing
          </p>
          <h2 className="text-3xl md:text-4xl font-bold">
            Less than your QuickBooks subscription.
          </h2>
          <p className="text-slate-400 mt-4">
            14-day free trial. No credit card required.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              name: "Starter",
              price: "$99",
              desc: "Solo practitioners & small teams",
              features: [
                "Up to 3 users",
                "10 active projects",
                "Time tracking & budgets",
                "Basic reports",
                "Email support",
              ],
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
                "Up to 50 users",
                "Unlimited everything",
                "Custom integrations",
                "QuickBooks sync",
                "Dedicated support",
              ],
            },
          ].map((tier) => (
            <div
              key={tier.name}
              className={`rounded-xl p-6 border ${
                "featured" in tier && tier.featured
                  ? "bg-emerald-500/5 border-emerald-500/30"
                  : "bg-slate-900 border-slate-800"
              }`}
            >
              {"featured" in tier && tier.featured && (
                <span className="text-[10px] tracking-wider uppercase bg-emerald-500 text-slate-950 font-medium px-2 py-0.5 rounded-full">
                  Most popular
                </span>
              )}
              <h3 className="text-xl font-semibold mt-3">{tier.name}</h3>
              <p className="text-sm text-slate-400 mb-4">{tier.desc}</p>
              <div className="text-4xl font-bold mb-1">
                {tier.price}
                <span className="text-sm font-normal text-slate-500">
                  /month
                </span>
              </div>
              <ul className="mt-6 space-y-3">
                {tier.features.map((f) => (
                  <li
                    key={f}
                    className="text-sm text-slate-300 flex items-start gap-2"
                  >
                    <span className="text-emerald-400 mt-0.5">→</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className={`block text-center mt-6 py-2.5 rounded-lg text-sm font-medium transition ${
                  "featured" in tier && tier.featured
                    ? "bg-emerald-500 hover:bg-emerald-400 text-slate-950"
                    : "border border-slate-700 hover:border-emerald-500/30 text-slate-300 hover:text-white"
                }`}
              >
                Start free trial
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center max-w-2xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Your projects deserve better than{" "}
          <span className="text-emerald-400 italic">Excel.</span>
        </h2>
        <p className="text-slate-400 mb-8">
          Join the firms replacing spreadsheets with a platform that understands
          landscape architecture.
        </p>
        <Link
          href="/signup"
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-medium px-8 py-3 rounded-lg text-sm transition inline-block"
        >
          Start your 14-day free trial →
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 px-6 flex items-center justify-between text-sm text-slate-500">
        <div className="flex items-center gap-2">
          <Leaf className="h-4 w-4 text-emerald-400" />
          Phasewise
        </div>
        <div>Built by a landscape architect, for landscape architects.</div>
      </footer>
    </div>
  );
}
