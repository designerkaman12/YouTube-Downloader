import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | OmniLoad',
  description:
    'Get in touch with the OmniLoad team — reach out for general inquiries, DMCA/legal requests, or bug reports.',
};

export default function ContactPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
      <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
        Get in Touch
      </h1>
      <p className="mb-10 max-w-2xl text-base leading-relaxed text-muted-foreground">
        Have questions, feedback, or concerns? We&apos;d love to hear from you.
        Choose the most relevant channel below and we&apos;ll get back to you as
        soon as possible.
      </p>

      {/* Contact Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* General Inquiries */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 transition-colors hover:bg-white/[0.07]">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-lg">
            ✉️
          </div>
          <h2 className="mb-2 text-base font-semibold text-foreground">
            General Inquiries
          </h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Questions about OmniLoad, feature requests, partnerships, or general
            feedback.
          </p>
          <a
            href="mailto:support@omniload.app"
            className="text-sm font-medium text-primary hover:underline"
          >
            support@omniload.app
          </a>
        </div>

        {/* DMCA / Legal */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 transition-colors hover:bg-white/[0.07]">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-lg">
            ⚖️
          </div>
          <h2 className="mb-2 text-base font-semibold text-foreground">
            DMCA / Legal
          </h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Copyright concerns, DMCA takedown notices, or legal inquiries.
            Please also review our{' '}
            <Link href="/dmca" className="text-primary hover:underline">
              DMCA Policy
            </Link>
            .
          </p>
          <a
            href="mailto:support@omniload.app"
            className="text-sm font-medium text-primary hover:underline"
          >
            support@omniload.app
          </a>
        </div>

        {/* Bug Reports */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 transition-colors hover:bg-white/[0.07]">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-lg">
            🐛
          </div>
          <h2 className="mb-2 text-base font-semibold text-foreground">
            Bug Reports
          </h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Found a broken link, error, or something not working as expected?
            Let us know so we can fix it.
          </p>
          <a
            href="mailto:support@omniload.app"
            className="text-sm font-medium text-primary hover:underline"
          >
            support@omniload.app
          </a>
        </div>
      </div>

      {/* Response Time */}
      <div className="mt-10 rounded-xl border border-white/10 bg-white/5 p-6">
        <p className="text-sm text-muted-foreground">
          <strong className="text-foreground">⏱ Response Time:</strong> We
          typically respond within{' '}
          <strong className="text-foreground">48 hours</strong>. For DMCA
          requests, we aim to acknowledge receipt within 24 hours.
        </p>
      </div>

      {/* Related Links */}
      <div className="mt-10">
        <h2 className="mb-4 text-base font-semibold text-foreground">
          Related Pages
        </h2>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/privacy"
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/[0.07] hover:text-foreground"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/[0.07] hover:text-foreground"
          >
            Terms of Service
          </Link>
          <Link
            href="/dmca"
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/[0.07] hover:text-foreground"
          >
            DMCA Policy
          </Link>
          <Link
            href="/disclaimer"
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/[0.07] hover:text-foreground"
          >
            Disclaimer
          </Link>
        </div>
      </div>

      <div className="mt-12">
        <Link
          href="/"
          className="text-sm font-medium text-primary hover:underline"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
