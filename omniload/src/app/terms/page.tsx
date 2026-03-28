import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'OmniLoad terms of service — rules and guidelines for using the platform.',
};

export default function TermsPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      <h1 className="mb-8 text-3xl font-bold tracking-tight sm:text-4xl">Terms of Service</h1>
      <p className="mb-6 text-sm text-muted-foreground">Last updated: March 2026</p>

      <div className="prose-custom space-y-8 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">1. Acceptance of Terms</h2>
          <p>By accessing or using OmniLoad, you agree to be bound by these Terms of Service. If you do not agree, please do not use the service.</p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">2. Service Description</h2>
          <p>OmniLoad is a free online tool that provides download links for publicly available media content from various platforms. We act as an intermediary and do not host, store, or distribute any media content.</p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">3. User Responsibilities</h2>
          <ul className="ml-4 list-disc space-y-2">
            <li>You may only download content that is publicly available and not protected by copyright restrictions.</li>
            <li>You are solely responsible for ensuring your use of downloaded content complies with applicable laws and the original platform&apos;s terms of service.</li>
            <li>You may not use OmniLoad for any illegal or unauthorized purpose.</li>
            <li>You may not attempt to reverse-engineer, modify, or disrupt the service.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">4. Intellectual Property</h2>
          <p>All media content accessed through OmniLoad belongs to its respective owners. OmniLoad does not claim ownership of any downloaded content. Users are responsible for respecting copyright laws.</p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">5. Limitation of Liability</h2>
          <p>OmniLoad is provided &ldquo;as is&rdquo; without warranty of any kind. We are not liable for any damages arising from use of the service, including but not limited to data loss, interruption of service, or copyright disputes.</p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">6. Service Modifications</h2>
          <p>We reserve the right to modify, suspend, or discontinue any part of the service at any time without prior notice.</p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">7. Contact</h2>
          <p>For questions about these terms, contact us at <a href="mailto:support@omniload.com" className="text-primary hover:underline">support@omniload.com</a>.</p>
        </section>
      </div>

      <div className="mt-12">
        <Link href="/" className="text-sm font-medium text-primary hover:underline">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
