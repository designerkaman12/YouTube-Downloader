import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Disclaimer | OmniLoad',
  description:
    'OmniLoad disclaimer — important information about service availability, content responsibility, third-party services, and limitations.',
};

export default function DisclaimerPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
      <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
        Disclaimer
      </h1>
      <p className="mb-10 text-sm text-muted-foreground">
        Last updated: May 25, 2026
      </p>

      <div className="space-y-10 text-sm leading-relaxed text-muted-foreground">
        {/* Intro */}
        <p>
          Please read this disclaimer carefully before using OmniLoad. By
          accessing and using our service, you acknowledge and agree to the
          terms outlined below.
        </p>

        {/* 1 */}
        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">
            1. General Disclaimer
          </h2>
          <p>
            OmniLoad is a media link processing utility provided on an{' '}
            <strong className="text-foreground">
              &ldquo;as is&rdquo; and &ldquo;as available&rdquo;
            </strong>{' '}
            basis. We make no representations or warranties of any kind, express
            or implied, regarding the operation of the service, the accuracy or
            completeness of any information provided, or the results obtained
            from using the service. Your use of OmniLoad is entirely at your own
            risk.
          </p>
        </section>

        {/* 2 */}
        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">
            2. Service Availability
          </h2>
          <p>
            OmniLoad depends on third-party platforms and APIs to process media
            links. As such, we cannot guarantee that every link will be
            successfully processed or that the service will be available at all
            times. Third-party platforms may change their APIs, restrict access,
            or modify their terms of service at any time, which may affect the
            functionality of OmniLoad. We are not responsible for any downtime,
            errors, or failures caused by changes to external services.
          </p>
        </section>

        {/* 3 */}
        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">
            3. Content Responsibility
          </h2>
          <p className="mb-3">
            Users of OmniLoad are solely responsible for the content they
            choose to download or process through our service. You must:
          </p>
          <ul className="ml-4 list-disc space-y-2">
            <li>
              <strong className="text-foreground">Respect copyright</strong> —
              Only download content you have the right to access and use.
            </li>
            <li>
              <strong className="text-foreground">
                Follow platform terms
              </strong>{' '}
              — Comply with the terms of service of the original content
              platforms.
            </li>
            <li>
              <strong className="text-foreground">
                Respect content creators
              </strong>{' '}
              — Honor the rights and wishes of content creators. If a creator
              has expressed that their content should not be downloaded or
              redistributed, please respect that.
            </li>
          </ul>
          <p className="mt-3">
            OmniLoad is not liable for any misuse of downloaded content by its
            users. We encourage responsible and ethical use of our service.
          </p>
        </section>

        {/* 4 */}
        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">
            4. Third-Party Services
          </h2>
          <p>
            OmniLoad relies on external third-party APIs and services to process
            media links. We are not responsible for the availability, accuracy,
            policies, or practices of these third-party services. Links to
            third-party websites or services that may appear on OmniLoad are
            provided for convenience only and do not constitute an endorsement.
            We recommend reviewing the terms and privacy policies of any third-
            party service you interact with.
          </p>
        </section>

        {/* 5 */}
        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">
            5. No Legal Advice
          </h2>
          <p>
            Nothing on OmniLoad or in our policies constitutes legal advice
            regarding copyright, fair use, intellectual property, or any other
            legal matter. The information provided on this website is for
            general informational purposes only. If you have specific legal
            questions about downloading or using content, we strongly recommend
            consulting a qualified legal professional in your jurisdiction.
          </p>
        </section>

        {/* 6 */}
        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">
            6. Accuracy of Information
          </h2>
          <p>
            While we strive to provide accurate and up-to-date information on
            our website, we make no warranties or representations about the
            accuracy, reliability, completeness, or timeliness of any
            information displayed on OmniLoad. This includes, but is not limited
            to, media metadata, file sizes, quality options, format
            availability, and platform support information. Information may
            change without notice.
          </p>
        </section>

        {/* 7 */}
        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">
            7. Affiliate Disclosure
          </h2>
          <p>
            Some links on OmniLoad may be affiliate links, meaning we may earn a
            small commission if you make a purchase or sign up through those
            links. This comes at{' '}
            <strong className="text-foreground">no extra cost to you</strong>.
            Affiliate partnerships do not influence our editorial content or
            recommendations. We only recommend products and services that we
            believe may be useful to our users.
          </p>
        </section>

        {/* 8 */}
        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">
            8. Contact Us
          </h2>
          <p>
            If you have any questions or concerns about this disclaimer, please
            contact us at{' '}
            <a
              href="mailto:support@omniload.app"
              className="text-primary hover:underline"
            >
              support@omniload.app
            </a>
            .
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
        <Link
          href="/dmca"
          className="text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          DMCA Policy
        </Link>
      </div>
    </div>
  );
}
