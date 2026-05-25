import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'DMCA Policy | OmniLoad',
  description:
    'OmniLoad DMCA policy — learn about our position on copyrighted content, how to file a takedown notice, and our counter-notification process.',
};

export default function DMCAPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
      <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
        DMCA Policy
      </h1>
      <p className="mb-10 text-sm text-muted-foreground">
        Last updated: May 25, 2026
      </p>

      <div className="space-y-10 text-sm leading-relaxed text-muted-foreground">
        {/* Intro */}
        <p>
          OmniLoad respects the intellectual property rights of others and
          complies with the Digital Millennium Copyright Act (DMCA). This page
          explains our position, how to file a takedown notice, and the
          counter-notification process.
        </p>

        {/* 1 */}
        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">
            1. Our Position
          </h2>
          <p className="mb-3">
            OmniLoad does{' '}
            <strong className="text-foreground">
              not host, store, or distribute
            </strong>{' '}
            user-uploaded copyrighted content. Our service functions as a media
            link processing utility that works with publicly available content
            hosted on third-party platforms.
          </p>
          <p className="mb-3">
            When a user submits a URL, we process it in real-time to provide
            available download options. The content itself remains on its
            original hosting platform at all times. We do not maintain copies of
            any media files on our servers.
          </p>
          <p>
            Because we do not host content, we recommend that copyright holders
            also contact the original hosting platform directly to have
            infringing content removed at its source.
          </p>
        </section>

        {/* 2 */}
        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">
            2. Filing a DMCA Takedown Notice
          </h2>
          <p className="mb-3">
            If you believe your copyrighted work is being accessed
            inappropriately through our service, you may submit a DMCA takedown
            notice to{' '}
            <a
              href="mailto:support@omniload.app"
              className="text-primary hover:underline"
            >
              support@omniload.app
            </a>
            . Your notice must include the following information:
          </p>
          <ul className="ml-4 list-disc space-y-2">
            <li>
              <strong className="text-foreground">
                Description of the copyrighted work
              </strong>{' '}
              — A clear identification of the copyrighted work you claim has
              been infringed, including any registration numbers if available.
            </li>
            <li>
              <strong className="text-foreground">
                URL of the infringing content
              </strong>{' '}
              — The specific URL(s) on OmniLoad or the original platform URL(s)
              that you believe infringe upon your copyright.
            </li>
            <li>
              <strong className="text-foreground">
                Your contact information
              </strong>{' '}
              — Your full legal name, mailing address, phone number, and email
              address.
            </li>
            <li>
              <strong className="text-foreground">
                Good faith statement
              </strong>{' '}
              — A statement that you have a good faith belief that the use of
              the copyrighted material is not authorized by the copyright owner,
              its agent, or the law.
            </li>
            <li>
              <strong className="text-foreground">Accuracy statement</strong> —
              A statement, made under penalty of perjury, that the information
              in the notice is accurate and that you are the copyright owner or
              authorized to act on behalf of the owner.
            </li>
            <li>
              <strong className="text-foreground">Signature</strong> — Your
              physical or electronic signature (a typed full legal name is
              acceptable as an electronic signature).
            </li>
          </ul>
          <p className="mt-4 rounded-lg border border-white/10 bg-white/5 p-4">
            <strong className="text-foreground">⚠️ Important:</strong> Please
            note that under Section 512(f) of the DMCA, any person who
            knowingly materially misrepresents that material or activity is
            infringing may be subject to liability for damages.
          </p>
        </section>

        {/* 3 */}
        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">
            3. Counter-Notification Process
          </h2>
          <p className="mb-3">
            If you believe that content was wrongfully removed or blocked as a
            result of a DMCA takedown notice, you may file a counter-
            notification. Your counter-notification must include:
          </p>
          <ul className="ml-4 list-disc space-y-2">
            <li>Your full legal name, address, phone number, and email address.</li>
            <li>
              Identification of the material that was removed or disabled and
              the location at which the material appeared before it was removed.
            </li>
            <li>
              A statement under penalty of perjury that you have a good faith
              belief that the material was removed or disabled as a result of a
              mistake or misidentification.
            </li>
            <li>
              A statement that you consent to the jurisdiction of the federal
              court in your district and that you will accept service of process
              from the person who provided the original DMCA notification.
            </li>
            <li>Your physical or electronic signature.</li>
          </ul>
          <p className="mt-3">
            Send counter-notifications to{' '}
            <a
              href="mailto:support@omniload.app"
              className="text-primary hover:underline"
            >
              support@omniload.app
            </a>
            . Upon receiving a valid counter-notification, we may restore the
            removed material within 10–14 business days unless the original
            complainant files a court action.
          </p>
        </section>

        {/* 4 */}
        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">
            4. Repeat Infringer Policy
          </h2>
          <p>
            In accordance with the DMCA, OmniLoad maintains a policy to
            terminate or block access for users who are repeat infringers. If we
            receive multiple valid DMCA complaints regarding specific URLs or
            patterns of use, we will take appropriate action, which may include
            permanently blocking those URLs from being processed through our
            service.
          </p>
        </section>

        {/* 5 */}
        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">
            5. Contact for DMCA
          </h2>
          <p>
            For all DMCA-related inquiries, takedown notices, or counter-
            notifications, please contact our designated agent at:
          </p>
          <div className="mt-3 rounded-lg border border-white/10 bg-white/5 p-4">
            <p>
              <strong className="text-foreground">Email:</strong>{' '}
              <a
                href="mailto:support@omniload.app"
                className="text-primary hover:underline"
              >
                support@omniload.app
              </a>
            </p>
            <p className="mt-1">
              <strong className="text-foreground">Subject Line:</strong>{' '}
              DMCA Takedown Notice — [Your Name]
            </p>
          </div>
          <p className="mt-3">
            We aim to respond to all valid DMCA notices within 48 hours of
            receipt.
          </p>
        </section>
      </div>

      <div className="mt-12 flex items-center gap-6">
        <Link
          href="/"
          className="text-sm font-medium text-primary hover:underline"
        >
          ← Back to Home
        </Link>
        <Link
          href="/privacy"
          className="text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          Privacy Policy
        </Link>
        <Link
          href="/terms"
          className="text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          Terms of Service
        </Link>
      </div>
    </div>
  );
}
