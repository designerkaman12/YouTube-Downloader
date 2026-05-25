import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | OmniLoad',
  description:
    'OmniLoad privacy policy — learn how we handle your data, protect your privacy, and what information is processed when you use our service.',
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
      <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
        Privacy Policy
      </h1>
      <p className="mb-10 text-sm text-muted-foreground">
        Last updated: May 25, 2026
      </p>

      <div className="space-y-10 text-sm leading-relaxed text-muted-foreground">
        {/* Intro */}
        <p>
          At OmniLoad, your privacy matters. This Privacy Policy explains what
          information we process, how we use it, and your rights regarding your
          data when you use our media link processing service.
        </p>

        {/* 1 */}
        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">
            1. Information We Process
          </h2>
          <p className="mb-3">
            OmniLoad is designed with privacy in mind. We do{' '}
            <strong className="text-foreground">not</strong> require
            registration, login, or any form of account creation. When you use
            our service, the only information we process is:
          </p>
          <ul className="ml-4 list-disc space-y-2">
            <li>
              <strong className="text-foreground">URLs you submit</strong> —
              Media links you paste into OmniLoad are sent to our processing
              servers to fetch available download options. These URLs are
              processed in real-time and are not intentionally stored after your
              request is completed.
            </li>
            <li>
              <strong className="text-foreground">
                Basic request metadata
              </strong>{' '}
              — Standard server logs may temporarily record IP addresses,
              browser user-agent strings, and timestamps for security and
              abuse-prevention purposes.
            </li>
          </ul>
          <p className="mt-3">
            We do <strong className="text-foreground">not</strong> intentionally
            store any downloaded files, media content, or personal information
            on our servers.
          </p>
        </section>

        {/* 2 */}
        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">
            2. Third-Party Services
          </h2>
          <p className="mb-3">
            OmniLoad relies on third-party APIs to process the media links you
            submit. These external services have their own privacy policies and
            data-handling practices. We only share the URL you provide — no
            personal data is transmitted to these services on your behalf.
          </p>
          <p>
            Additionally, we may use third-party analytics and advertising
            providers (such as Google Analytics or ad networks) to understand
            usage patterns and sustain the service. These providers may use
            cookies or similar technologies to collect anonymized usage data.
            Please refer to their respective privacy policies for details.
          </p>
        </section>

        {/* 3 */}
        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">
            3. Cookies and Tracking
          </h2>
          <p className="mb-3">OmniLoad may use cookies for the following purposes:</p>
          <ul className="ml-4 list-disc space-y-2">
            <li>
              <strong className="text-foreground">Essential cookies</strong> —
              For basic site functionality and user preferences (e.g., theme
              settings).
            </li>
            <li>
              <strong className="text-foreground">Analytics cookies</strong> —
              If analytics services are enabled, anonymized data such as page
              views, session duration, and general geographic region may be
              collected to help us improve the service.
            </li>
            <li>
              <strong className="text-foreground">Advertising cookies</strong> —
              If ad providers are enabled, they may set cookies to serve
              relevant advertisements. These cookies do not give us access to
              your personal information.
            </li>
          </ul>
          <p className="mt-3">
            You can control cookie behavior through your browser settings. Most
            browsers allow you to block or delete cookies at any time.
          </p>
        </section>

        {/* 4 */}
        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">
            4. Data Retention
          </h2>
          <p>
            OmniLoad does <strong className="text-foreground">not</strong> store
            downloaded files or media content. URL processing data is temporary
            and exists only for the duration of your request. Server logs
            containing basic request metadata may be retained for a limited
            period (typically no longer than 30 days) for security monitoring
            and abuse prevention, after which they are automatically purged.
          </p>
        </section>

        {/* 5 */}
        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">
            5. Your Rights
          </h2>
          <p className="mb-3">
            Depending on your jurisdiction, you may have the following rights
            regarding your data:
          </p>
          <ul className="ml-4 list-disc space-y-2">
            <li>
              <strong className="text-foreground">Request data deletion</strong>{' '}
              — You may request that any data associated with your usage be
              deleted by contacting us.
            </li>
            <li>
              <strong className="text-foreground">Opt out of tracking</strong> —
              You can disable analytics and advertising cookies through your
              browser settings or by using browser extensions designed for
              privacy.
            </li>
            <li>
              <strong className="text-foreground">Access your data</strong> —
              You may request information about what data, if any, we hold about
              you.
            </li>
          </ul>
          <p className="mt-3">
            To exercise any of these rights, please contact us at{' '}
            <a
              href="mailto:support@omniload.app"
              className="text-primary hover:underline"
            >
              support@omniload.app
            </a>
            .
          </p>
        </section>

        {/* 6 */}
        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">
            6. Children&apos;s Privacy
          </h2>
          <p>
            OmniLoad is not directed at children under the age of 13. We do not
            knowingly collect personal information from children. If we become
            aware that a child under 13 has provided us with personal data, we
            will take steps to delete such information promptly. If you are a
            parent or guardian and believe your child has provided us with
            personal information, please contact us at{' '}
            <a
              href="mailto:support@omniload.app"
              className="text-primary hover:underline"
            >
              support@omniload.app
            </a>
            .
          </p>
        </section>

        {/* 7 */}
        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">
            7. Changes to This Policy
          </h2>
          <p>
            We may update this Privacy Policy from time to time to reflect
            changes in our practices, technologies, or legal requirements. Any
            changes will be posted on this page with an updated &ldquo;Last
            updated&rdquo; date. We encourage you to review this policy
            periodically. Your continued use of OmniLoad after any changes
            constitutes acceptance of the updated policy.
          </p>
        </section>

        {/* 8 */}
        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">
            8. Contact Us
          </h2>
          <p>
            If you have any questions, concerns, or requests regarding this
            Privacy Policy or our data practices, please contact us at{' '}
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
