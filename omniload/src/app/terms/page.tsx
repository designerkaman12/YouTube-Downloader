import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | OmniLoad',
  description:
    'OmniLoad terms of service — rules, guidelines, and responsibilities for using our media link processing platform.',
};

export default function TermsPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
      <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
        Terms of Service
      </h1>
      <p className="mb-10 text-sm text-muted-foreground">
        Last updated: May 25, 2026
      </p>

      <div className="space-y-10 text-sm leading-relaxed text-muted-foreground">
        {/* Intro */}
        <p>
          Please read these Terms of Service (&ldquo;Terms&rdquo;) carefully
          before using OmniLoad. By accessing or using our service, you agree to
          be bound by these Terms. If you do not agree, please do not use the
          service.
        </p>

        {/* 1 */}
        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing, browsing, or using OmniLoad in any way, you
            acknowledge that you have read, understood, and agree to be bound by
            these Terms of Service and our{' '}
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
            . These Terms apply to all visitors, users, and anyone who accesses
            the service.
          </p>
        </section>

        {/* 2 */}
        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">
            2. Description of Service
          </h2>
          <p>
            OmniLoad is a media link processing utility that generates download
            links for publicly available content hosted on third-party
            platforms. We act as an intermediary tool — we do{' '}
            <strong className="text-foreground">not</strong> host, store, or
            distribute any media content. All content remains on its original
            hosting platform. OmniLoad processes URLs submitted by users in
            real-time to provide available download options.
          </p>
        </section>

        {/* 3 */}
        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">
            3. User Responsibilities
          </h2>
          <p className="mb-3">
            As a user of OmniLoad, you acknowledge and agree that:
          </p>
          <ul className="ml-4 list-disc space-y-2">
            <li>
              You must have the necessary rights, permissions, or authorization
              to download or process any content you submit through our service.
            </li>
            <li>
              You are solely responsible for ensuring your use of downloaded
              content complies with all applicable local, national, and
              international laws and regulations.
            </li>
            <li>
              You are responsible for complying with the terms of service of the
              original content platforms.
            </li>
            <li>
              You will not use OmniLoad for any illegal, unauthorized, or
              unethical purpose.
            </li>
            <li>
              You will not attempt to reverse-engineer, decompile, modify, or
              disrupt the service or its infrastructure.
            </li>
          </ul>
        </section>

        {/* 4 */}
        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">
            4. Prohibited Uses
          </h2>
          <p className="mb-3">
            You expressly agree <strong className="text-foreground">not</strong>{' '}
            to use OmniLoad for the following:
          </p>
          <ul className="ml-4 list-disc space-y-2">
            <li>
              <strong className="text-foreground">
                Copyright infringement
              </strong>{' '}
              — Downloading or redistributing copyrighted content without
              permission from the rights holder.
            </li>
            <li>
              <strong className="text-foreground">
                Unauthorized distribution
              </strong>{' '}
              — Sharing, selling, or distributing downloaded content without
              proper authorization.
            </li>
            <li>
              <strong className="text-foreground">DRM circumvention</strong> —
              Using the service to circumvent or bypass any digital rights
              management (DRM) protections.
            </li>
            <li>
              <strong className="text-foreground">
                Automated or bot access
              </strong>{' '}
              — Using scripts, bots, crawlers, or any automated means to access
              or interact with the service without prior written consent.
            </li>
            <li>
              <strong className="text-foreground">Service abuse</strong> —
              Overloading, spamming, or otherwise disrupting the availability or
              performance of OmniLoad for other users.
            </li>
          </ul>
        </section>

        {/* 5 */}
        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">
            5. Platform Non-Affiliation
          </h2>
          <p>
            OmniLoad is an independent service and is{' '}
            <strong className="text-foreground">not</strong> affiliated with,
            endorsed by, or sponsored by any third-party platforms, including
            but not limited to YouTube, Google, Instagram, Meta, Facebook,
            TikTok, ByteDance, X (formerly Twitter), Pinterest, Reddit,
            Snapchat, LinkedIn, Vimeo, Dailymotion, Spotify, SoundCloud, or any
            other content platform. All trademarks and brand names belong to
            their respective owners.
          </p>
        </section>

        {/* 6 */}
        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">
            6. Intellectual Property
          </h2>
          <p>
            All media content accessed through OmniLoad belongs to its
            respective copyright owners. OmniLoad does not claim ownership of
            any content processed through our service. The OmniLoad name, logo,
            and website design are the intellectual property of OmniLoad and may
            not be reproduced without permission. Users are responsible for
            respecting all intellectual property rights when using our service.
          </p>
        </section>

        {/* 7 */}
        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">
            7. Disclaimer of Warranties
          </h2>
          <p>
            OmniLoad is provided on an{' '}
            <strong className="text-foreground">
              &ldquo;as is&rdquo; and &ldquo;as available&rdquo;
            </strong>{' '}
            basis without warranties of any kind, whether express or implied,
            including but not limited to implied warranties of merchantability,
            fitness for a particular purpose, or non-infringement. We do not
            guarantee that the service will be uninterrupted, error-free,
            secure, or that all links will be successfully processed.
          </p>
        </section>

        {/* 8 */}
        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">
            8. Limitation of Liability
          </h2>
          <p>
            To the maximum extent permitted by applicable law, OmniLoad and its
            operators, developers, and affiliates shall not be held liable for
            any direct, indirect, incidental, special, consequential, or
            punitive damages arising out of or in connection with your use of
            the service. This includes, but is not limited to, damages for loss
            of data, profits, goodwill, or other intangible losses, even if we
            have been advised of the possibility of such damages.
          </p>
        </section>

        {/* 9 */}
        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">
            9. Abusive Usage
          </h2>
          <p>
            We reserve the right to block, throttle, or restrict access to
            OmniLoad for any user or IP address that we determine, in our sole
            discretion, to be engaging in abusive, fraudulent, or excessive
            usage of the service. This includes automated scraping, denial-of-
            service attempts, or any behavior that negatively impacts the
            service for other users.
          </p>
        </section>

        {/* 10 */}
        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">
            10. Termination
          </h2>
          <p>
            We reserve the right to suspend or terminate access to OmniLoad at
            any time, for any reason, without prior notice or liability. Upon
            termination, your right to use the service will immediately cease.
            All provisions of these Terms that by their nature should survive
            termination shall survive, including ownership provisions, warranty
            disclaimers, and limitations of liability.
          </p>
        </section>

        {/* 11 */}
        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">
            11. Changes to Terms
          </h2>
          <p>
            We reserve the right to modify or replace these Terms at any time.
            Changes will be posted on this page with an updated &ldquo;Last
            updated&rdquo; date. Your continued use of OmniLoad after any
            modifications constitutes acceptance of the revised Terms. We
            encourage you to review this page periodically.
          </p>
        </section>

        {/* 12 */}
        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">
            12. Contact Us
          </h2>
          <p>
            If you have any questions or concerns about these Terms of Service,
            please contact us at{' '}
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
          href="/dmca"
          className="text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          DMCA Policy
        </Link>
      </div>
    </div>
  );
}
