import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="p-6 sm:p-8 max-w-3xl">
      <Link href="/settings" className="text-sm text-[#6B8C74] hover:text-[#1A2E22] transition-colors">
        ← Back
      </Link>
      <h1 className="font-serif text-3xl text-[#1A2E22] mt-4 mb-8">Privacy Policy</h1>

      <div className="prose prose-sm max-w-none text-[#3D5C48]">
        <p className="text-[#6B8C74] text-sm mb-6">Last updated: April 13, 2026</p>

        <h2 className="font-serif text-xl text-[#1A2E22] mt-8 mb-3">1. Information We Collect</h2>
        <p>When you create an account, we collect your name, email address, firm name, and billing information. When you use Phasewise, we collect data you enter including project details, time entries, staff information, and billing rates.</p>

        <h2 className="font-serif text-xl text-[#1A2E22] mt-8 mb-3">2. How We Use Your Information</h2>
        <p>We use your information to:</p>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li>Provide and maintain the Phasewise service</li>
          <li>Process your subscription payments via Stripe</li>
          <li>Send you transactional emails (welcome, billing, alerts)</li>
          <li>Improve our product and user experience</li>
          <li>Respond to your support requests</li>
        </ul>

        <h2 className="font-serif text-xl text-[#1A2E22] mt-8 mb-3">3. Data Storage & Security</h2>
        <p>Your data is stored securely on Supabase (PostgreSQL) hosted in the United States. We use industry-standard encryption for data in transit (TLS/SSL) and at rest. Access to your data is restricted to your organization&apos;s authenticated users based on their assigned roles.</p>

        <h2 className="font-serif text-xl text-[#1A2E22] mt-8 mb-3">4. Third-Party Services</h2>
        <p>We use the following third-party services to operate Phasewise:</p>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li><strong>Supabase</strong> — Database and authentication</li>
          <li><strong>Stripe</strong> — Payment processing</li>
          <li><strong>Vercel</strong> — Application hosting</li>
          <li><strong>Loops</strong> — Transactional email delivery</li>
          <li><strong>Cloudflare</strong> — DNS and CDN</li>
        </ul>
        <p className="mt-2">Each of these services has their own privacy policy governing their handling of your data.</p>

        <h2 className="font-serif text-xl text-[#1A2E22] mt-8 mb-3">5. Data Sharing</h2>
        <p>We do not sell, trade, or rent your personal information to third parties. We only share data with the third-party service providers listed above as necessary to operate the service.</p>

        <h2 className="font-serif text-xl text-[#1A2E22] mt-8 mb-3">6. Your Rights</h2>
        <p>You have the right to:</p>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li>Access your personal data</li>
          <li>Correct inaccurate data</li>
          <li>Delete your account and associated data</li>
          <li>Export your data</li>
          <li>Opt out of marketing communications</li>
        </ul>
        <p className="mt-2">To exercise any of these rights, contact us at kevin@phasewise.io.</p>

        <h2 className="font-serif text-xl text-[#1A2E22] mt-8 mb-3">7. Cookies</h2>
        <p>We use essential cookies for authentication and session management. We do not use tracking cookies or third-party advertising cookies.</p>

        <h2 className="font-serif text-xl text-[#1A2E22] mt-8 mb-3">8. Changes to This Policy</h2>
        <p>We may update this privacy policy from time to time. We will notify you of any material changes by email or by posting a notice on our website.</p>

        <h2 className="font-serif text-xl text-[#1A2E22] mt-8 mb-3">9. Contact</h2>
        <p>If you have questions about this privacy policy, please contact us at:</p>
        <p className="mt-2">
          <strong>Phasewise</strong><br />
          kevin@phasewise.io<br />
          phasewise.io
        </p>
      </div>
    </div>
  );
}
