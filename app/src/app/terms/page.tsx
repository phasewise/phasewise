import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Phasewise terms of service. The agreement governing your use of the Phasewise platform.",
  alternates: { canonical: "/terms" },
  openGraph: {
    type: "website",
    url: "https://phasewise.io/terms",
    title: "Terms of Service — Phasewise",
    description:
      "The agreement governing your use of the Phasewise platform.",
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

export default function TermsPage() {
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
          Terms of Service
        </h1>
        <p className="text-[#6B8C74] text-sm mb-10">Last updated: April 13, 2026</p>

        <div className="prose-phasewise">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using Phasewise (&quot;the Service&quot;), you agree to be bound by these Terms of Service. If you do not agree, do not use the Service.
          </p>

          <h2>2. Description of Service</h2>
          <p>
            Phasewise is a software-as-a-service (SaaS) platform that provides project management, time tracking, budgeting, and compliance tools for landscape architecture firms. The Service is provided &quot;as is&quot; and &quot;as available.&quot;
          </p>

          <h2>3. Accounts</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must immediately notify us of any unauthorized use of your account.
          </p>

          <h2>4. Subscription &amp; Billing</h2>
          <ul>
            <li>Phasewise offers paid subscription plans billed monthly.</li>
            <li>New accounts receive a 14-day free trial. No credit card is required to start the trial.</li>
            <li>After the trial, you must subscribe to a paid plan to continue using the Service.</li>
            <li>Payments are processed by Stripe. You agree to Stripe&apos;s terms of service for payment processing.</li>
            <li>You may cancel your subscription at any time. Access continues until the end of the current billing period.</li>
            <li>Refunds are not provided for partial months of service.</li>
          </ul>

          <h2>5. Your Data</h2>
          <p>
            You retain ownership of all data you enter into Phasewise. We do not claim any intellectual property rights over your content. You grant us a limited license to store, process, and display your data solely to provide the Service.
          </p>

          <h2>6. Acceptable Use</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Use the Service for any unlawful purpose</li>
            <li>Attempt to gain unauthorized access to any part of the Service</li>
            <li>Interfere with or disrupt the Service or its infrastructure</li>
            <li>Resell or sublicense the Service without our written consent</li>
            <li>Use the Service to store or transmit malware or malicious content</li>
          </ul>

          <h2>7. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, Phasewise and its founders, employees, and affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenue, whether incurred directly or indirectly.
          </p>

          <h2>8. Service Availability</h2>
          <p>
            We strive for high availability but do not guarantee uninterrupted service. We may perform maintenance that temporarily affects availability. We will provide reasonable notice for planned maintenance when possible.
          </p>

          <h2>9. Termination</h2>
          <p>
            We may suspend or terminate your access to the Service if you violate these terms. Upon termination, your right to use the Service ceases immediately. You may request a data export before termination.
          </p>

          <h2>10. Changes to Terms</h2>
          <p>
            We may update these terms from time to time. Material changes will be communicated via email. Continued use of the Service after changes constitutes acceptance of the updated terms.
          </p>

          <h2>11. Governing Law</h2>
          <p>
            These terms are governed by the laws of the State of California, United States, without regard to its conflict of law provisions.
          </p>

          <h2>12. Contact</h2>
          <p>For questions about these terms, contact us at:</p>
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
