import type { Metadata } from "next";
import Link from "next/link";
import MigrationRequestForm from "./MigrationRequestForm";

const PAGE_TITLE = "Free white-glove migration — Phasewise";
const PAGE_DESCRIPTION =
  "We import your existing projects, clients, and staff from your current tools — Monograph, Harvest, QuickBooks, Excel, anything. No manual setup. Included free with Founding Member sign-up.";

export const metadata: Metadata = {
  title: "Free white-glove migration",
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/migrate" },
  openGraph: {
    type: "website",
    url: "https://phasewise.io/migrate",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    siteName: "Phasewise",
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

export default function MigratePage() {
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
            href="/signup?plan=founding"
            className="inline-flex items-center gap-2 text-[13px] sm:text-sm font-medium px-4 sm:px-5 py-2 rounded-md bg-[#2D6A4F] text-white hover:bg-[#40916C] transition-all"
          >
            Start Free Trial
          </Link>
        </div>
      </nav>

      <div className="max-w-[920px] mx-auto px-6 sm:px-10 py-10 sm:py-14">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-[#6B8C74] hover:text-[#2D6A4F] mb-6 transition-colors"
        >
          ← Back to home
        </Link>

        <div className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7A5A2E] bg-[#E8D5B7] px-2.5 py-1 rounded-full mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#7A5A2E]" />
          Founding member benefit · Free
        </div>
        <h1 className="font-serif text-[clamp(32px,5vw,52px)] font-normal leading-[1.1] text-[#1A2E22] mb-3">
          We&apos;ll set everything up for you
        </h1>
        <p className="text-[#3D5C48] text-base sm:text-lg max-w-[720px] mb-10 leading-relaxed">
          Send us your existing project list, clients, and staff roster in whatever format you have
          — Monograph export, QuickBooks report, Excel spreadsheet, Google Sheet, even hand-written
          notes scanned as photos. We&apos;ll normalize the data and load it directly into your
          Phasewise account, typically within 24 hours of signup.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-12">
          <div className="border border-[#E2EBE4] rounded-lg p-5 bg-[#F7F9F7]">
            <div className="font-serif text-3xl text-[#2D6A4F] mb-2">1</div>
            <h3 className="font-semibold text-[14px] text-[#1A2E22] mb-1.5">Sign up</h3>
            <p className="text-[13px] text-[#6B8C74] leading-relaxed">
              Start your 14-day trial at phasewise.io/signup. No card needed.
            </p>
          </div>
          <div className="border border-[#E2EBE4] rounded-lg p-5 bg-[#F7F9F7]">
            <div className="font-serif text-3xl text-[#2D6A4F] mb-2">2</div>
            <h3 className="font-semibold text-[14px] text-[#1A2E22] mb-1.5">Send us your data</h3>
            <p className="text-[13px] text-[#6B8C74] leading-relaxed">
              Fill out the form below. We&apos;ll reply with a secure upload link for your files.
            </p>
          </div>
          <div className="border border-[#E2EBE4] rounded-lg p-5 bg-[#F7F9F7]">
            <div className="font-serif text-3xl text-[#2D6A4F] mb-2">3</div>
            <h3 className="font-semibold text-[14px] text-[#1A2E22] mb-1.5">Sign in, ready to work</h3>
            <p className="text-[13px] text-[#6B8C74] leading-relaxed">
              Your projects, clients, and staff invitations are waiting. Within 24 hours of step 2.
            </p>
          </div>
        </div>

        <MigrationRequestForm />

        <div className="mt-12 rounded-lg border border-[#E2EBE4] bg-[#F7F9F7] p-6">
          <h3 className="font-semibold text-[15px] text-[#1A2E22] mb-3">What we can import</h3>
          <ul className="grid sm:grid-cols-2 gap-y-2 gap-x-6 text-[13px] text-[#3D5C48]">
            <li>• Projects (name, number, client, status, fees, dates)</li>
            <li>• Project phases (Pre-Design through CA, custom phases)</li>
            <li>• Per-phase budgets (fee, hours, sort order)</li>
            <li>• Clients (name, contact, email, phone, address)</li>
            <li>• Staff (created as pending invitations)</li>
            <li>• Staff roles, titles, billing rates, salaries</li>
            <li>• Project contract numbers (for public-agency AP)</li>
            <li>• Billing cadence (monthly / milestone / manual)</li>
          </ul>
        </div>

        <div className="mt-8 text-[12px] text-[#6B8C74] leading-relaxed">
          <strong className="text-[#3D5C48]">Privacy:</strong> Your data stays in your Phasewise
          account — we don&apos;t share, sell, or use it for anything other than completing the
          migration. Source files are deleted from our systems within 30 days of migration
          completion. See our{" "}
          <Link href="/privacy" className="text-[#2D6A4F] hover:text-[#40916C] underline">
            Privacy Policy
          </Link>{" "}
          for details.
        </div>
      </div>
    </div>
  );
}
