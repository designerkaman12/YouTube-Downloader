import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'OmniLoad privacy policy — how we handle your data and protect your privacy.',
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      <h1 className="mb-8 text-3xl font-bold tracking-tight sm:text-4xl">Privacy Policy</h1>
      <p className="mb-6 text-sm text-muted-foreground">Last updated: March 2026</p>

      <div className="prose-custom space-y-8 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">1. Information We Collect</h2>
          <p>OmniLoad does <strong className="text-foreground">not</strong> collect, store, or share any personal information. We do not require registration, login, or any form of account creation.</p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">2. Usage Data</h2>
          <p>We may collect anonymous usage analytics (page views, feature usage) to improve the service. No personally identifiable information is included in these analytics.</p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">3. Download Processing</h2>
          <p>When you use OmniLoad to download media, the URL you provide is processed in real-time to fetch download links. We do <strong className="text-foreground">not</strong> store your URLs, downloaded content, or any associated metadata after the request is completed.</p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">4. Cookies</h2>
          <p>OmniLoad uses minimal cookies solely for theme preference (light/dark mode). No tracking cookies or third-party advertising cookies are used.</p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">5. Third-Party Services</h2>
          <p>We use third-party APIs to process download requests. These services have their own privacy policies. We do not share any personal data with these services — only the URL you provide for download.</p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">6. Contact</h2>
          <p>If you have questions about this privacy policy, please contact us at <a href="mailto:support@omniload.com" className="text-primary hover:underline">support@omniload.com</a>.</p>
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
