import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Phasewise privacy policy. How we collect, use, store, and protect your data when you use the platform.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    type: "website",
    url: "https://phasewise.io/privacy",
    title: "Privacy Policy — Phasewise",
    description:
      "How Phasewise collects, uses, stores, and protects your data.",
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

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white text-[#1A2E22] font-sans min-h-screen">
      <nav className="border-b border-[#E2EBE4] bg-white/95 backdrop-blur">
        <div className="max-w-[780px] mx-auto px-6 sm:px-10 h-[56px] sm:h-[68px] flex items-center justify-between">
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

      <div className="max-w-[780px] mx-auto px-6 sm:px-10 py-12 sm:py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-[#6B8C74] hover:text-[#2D6A4F] mb-8 transition-colors"
        >
          ← Back to home
        </Link>

        <h1 className="font-serif text-[clamp(32px,5vw,46px)] font-normal leading-[1.15] text-[#1A2E22] mb-2">
          Privacy Policy
        </h1>
        <p className="text-[#6B8C74] text-sm mb-10">Last updated: April 13, 2026</p>

        <div className="prose-phasewise">
          <h2>1. Information We Collect</h2>
          <p>
            When you create an account, we collect your name, email address, firm name, and billing information. When you use Phasewise, we collect data you enter including project details, time entries, staff information, and billing rates.
          </p>

          <h2>2. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul>
            <li>Provide and maintain the Phasewise service</li>
            <li>Process your subscription payments via Stripe</li>
            <li>Send you transactional emails (welcome, billing, alerts)</li>
            <li>Improve our product and user experience</li>
            <li>Respond to your support requests</li>
          </ul>

          <h2>3. Data Storage & Security</h2>
          <p>
            Your data is stored securely on Supabase (PostgreSQL) hosted in the United States. We use industry-standard encryption for data in transit (TLS/SSL) and at rest. Access to your data is restricted to your organization&apos;s authenticated users based on their assigned roles.
          </p>

          <h2>4. Third-Party Services</h2>
          <p>We use the following third-party services to operate Phasewise:</p>
          <ul>
            <li><strong>Supabase</strong> — Database and authentication</li>
            <li><strong>Stripe</strong> — Payment processing</li>
            <li><strong>Vercel</strong> — Application hosting</li>
            <li><strong>Loops</strong> — Transactional email delivery</li>
            <li><strong>Cloudflare</strong> — DNS and CDN</li>
          </ul>
          <p>Each of these services has their own privacy policy governing their handling of your data.</p>

          <h2>5. Data Sharing</h2>
          <p>
            We do not sell, trade, or rent your personal information to third parties. We only share data with the third-party service providers listed above as necessary to operate the service.
          </p>

          <h2>6. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Delete your account and associated data</li>
            <li>Export your data</li>
            <li>Opt out of marketing communications</li>
          </ul>
          <p>
            To exercise any of these rights, contact us at{" "}
            <a href="mailto:kevin@phasewise.io">kevin@phasewise.io</a>.
          </p>

          <h2>7. Cookies</h2>
          <p>
            We use essential cookies for authentication and session management. We do not use tracking cookies or third-party advertising cookies.
          </p>

          <h2>8. Changes to This Policy</h2>
          <p>
            We may update this privacy policy from time to time. We will notify you of any material changes by email or by posting a notice on our website.
          </p>

          <h2>9. Contact</h2>
          <p>If you have questions about this privacy policy, please contact us at:</p>
          <p>
            <strong>Phasewise</strong>
            <br />
            <a href="mailto:kevin@phasewise.io">kevin@phasewise.io</a>
            <br />
            phasewise.io
          </p>
        </div>
      </div>
    </div>
  );
}
