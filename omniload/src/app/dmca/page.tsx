import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'DMCA Policy',
  description: 'OmniLoad DMCA policy — how to report copyright infringement.',
};

export default function DMCAPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      <h1 className="mb-8 text-3xl font-bold tracking-tight sm:text-4xl">DMCA Policy</h1>
      <p className="mb-6 text-sm text-muted-foreground">Last updated: March 2026</p>

      <div className="prose-custom space-y-8 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">1. Overview</h2>
          <p>OmniLoad respects the intellectual property rights of others. We comply with the Digital Millennium Copyright Act (DMCA) and respond promptly to valid takedown notices.</p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">2. Important Clarification</h2>
          <p>OmniLoad does <strong className="text-foreground">not</strong> host, store, or distribute any media content. Our service only provides download links by connecting to publicly accessible content on third-party platforms. All content remains on its original hosting platform.</p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">3. Filing a DMCA Notice</h2>
          <p>If you believe your copyrighted work is being accessed inappropriately through our service, please send a DMCA takedown notice to <a href="mailto:support@omniload.com" className="text-primary hover:underline">support@omniload.com</a> with the following information:</p>
          <ul className="ml-4 mt-3 list-disc space-y-2">
            <li>Identification of the copyrighted work you claim is being infringed.</li>
            <li>The URL or specific content you want addressed.</li>
            <li>Your contact information (name, email, phone number).</li>
            <li>A statement that you have a good faith belief that the use is not authorized.</li>
            <li>A statement that the information is accurate and that you are the copyright owner or authorized to act on their behalf.</li>
            <li>Your physical or electronic signature.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">4. Response</h2>
          <p>Upon receiving a valid DMCA notice, we will take appropriate action, which may include blocking specific URLs from being processed through our service.</p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">5. Recommendation</h2>
          <p>Since OmniLoad does not host content, we recommend that copyright holders also contact the original hosting platform directly to have the infringing content removed at the source.</p>
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
