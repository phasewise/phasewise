import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="p-6 sm:p-8 max-w-3xl">
      <Link href="/settings" className="text-sm text-[#6B8C74] hover:text-[#1A2E22] transition-colors">
        ← Back
      </Link>
      <h1 className="font-serif text-3xl text-[#1A2E22] mt-4 mb-8">Terms of Service</h1>

      <div className="prose prose-sm max-w-none text-[#3D5C48]">
        <p className="text-[#6B8C74] text-sm mb-6">Last updated: April 13, 2026</p>

        <h2 className="font-serif text-xl text-[#1A2E22] mt-8 mb-3">1. Acceptance of Terms</h2>
        <p>By accessing or using Phasewise (&quot;the Service&quot;), you agree to be bound by these Terms of Service. If you do not agree, do not use the Service.</p>

        <h2 className="font-serif text-xl text-[#1A2E22] mt-8 mb-3">2. Description of Service</h2>
        <p>Phasewise is a software-as-a-service (SaaS) platform that provides project management, time tracking, budgeting, and compliance tools for landscape architecture firms. The Service is provided &quot;as is&quot; and &quot;as available.&quot;</p>

        <h2 className="font-serif text-xl text-[#1A2E22] mt-8 mb-3">3. Accounts</h2>
        <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must immediately notify us of any unauthorized use of your account.</p>

        <h2 className="font-serif text-xl text-[#1A2E22] mt-8 mb-3">4. Subscription & Billing</h2>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li>Phasewise offers paid subscription plans billed monthly.</li>
          <li>New accounts receive a 14-day free trial. No credit card is required to start the trial.</li>
          <li>After the trial, you must subscribe to a paid plan to continue using the Service.</li>
          <li>Payments are processed by Stripe. You agree to Stripe&apos;s terms of service for payment processing.</li>
          <li>You may cancel your subscription at any time. Access continues until the end of the current billing period.</li>
          <li>Refunds are not provided for partial months of service.</li>
        </ul>

        <h2 className="font-serif text-xl text-[#1A2E22] mt-8 mb-3">5. Your Data</h2>
        <p>You retain ownership of all data you enter into Phasewise. We do not claim any intellectual property rights over your content. You grant us a limited license to store, process, and display your data solely to provide the Service.</p>

        <h2 className="font-serif text-xl text-[#1A2E22] mt-8 mb-3">6. Acceptable Use</h2>
        <p>You agree not to:</p>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li>Use the Service for any unlawful purpose</li>
          <li>Attempt to gain unauthorized access to any part of the Service</li>
          <li>Interfere with or disrupt the Service or its infrastructure</li>
          <li>Resell or sublicense the Service without our written consent</li>
          <li>Use the Service to store or transmit malware or malicious content</li>
        </ul>

        <h2 className="font-serif text-xl text-[#1A2E22] mt-8 mb-3">7. Limitation of Liability</h2>
        <p>To the maximum extent permitted by law, Phasewise and its founders, employees, and affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenue, whether incurred directly or indirectly.</p>

        <h2 className="font-serif text-xl text-[#1A2E22] mt-8 mb-3">8. Service Availability</h2>
        <p>We strive for high availability but do not guarantee uninterrupted service. We may perform maintenance that temporarily affects availability. We will provide reasonable notice for planned maintenance when possible.</p>

        <h2 className="font-serif text-xl text-[#1A2E22] mt-8 mb-3">9. Termination</h2>
        <p>We may suspend or terminate your access to the Service if you violate these terms. Upon termination, your right to use the Service ceases immediately. You may request a data export before termination.</p>

        <h2 className="font-serif text-xl text-[#1A2E22] mt-8 mb-3">10. Changes to Terms</h2>
        <p>We may update these terms from time to time. Material changes will be communicated via email. Continued use of the Service after changes constitutes acceptance of the updated terms.</p>

        <h2 className="font-serif text-xl text-[#1A2E22] mt-8 mb-3">11. Governing Law</h2>
        <p>These terms are governed by the laws of the State of California, United States, without regard to its conflict of law provisions.</p>

        <h2 className="font-serif text-xl text-[#1A2E22] mt-8 mb-3">12. Contact</h2>
        <p>For questions about these terms, contact us at:</p>
        <p className="mt-2">
          <strong>Phasewise</strong><br />
          kevin@phasewise.io<br />
          phasewise.io
        </p>
      </div>
    </div>
  );
}
