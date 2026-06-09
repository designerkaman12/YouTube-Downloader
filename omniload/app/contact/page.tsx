"use client";

import { useState, FormEvent } from "react";
import { SITE_CONFIG } from "@/lib/constants";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Open email client with pre-filled data
    const mailtoLink = `mailto:${SITE_CONFIG.email}?subject=${encodeURIComponent(
      subject || "Contact from OmniLoad"
    )}&body=${encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\n${message}`
    )}`;
    window.location.href = mailtoLink;
    setSent(true);
  };

  return (
    <div className="py-16 sm:py-24">
      <div className="container mx-auto max-w-2xl px-4 sm:px-6">
        <div className="mb-10 text-center">
          <h1 className="mb-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Contact <span className="gradient-text">Us</span>
          </h1>
          <p className="text-base text-[hsl(var(--muted-foreground))]">
            Have a question, feedback, or need help? We&apos;re here for you.
          </p>
        </div>

        {sent ? (
          <div className="rounded-2xl border border-[hsl(var(--success)/.3)] bg-[hsl(var(--success)/.1)] p-8 text-center">
            <div className="mb-4 text-4xl">✉️</div>
            <h2 className="mb-2 text-xl font-bold">Email Client Opened!</h2>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">
              Your email client should have opened with the message pre-filled.
              If not, you can email us directly at{" "}
              <a
                href={`mailto:${SITE_CONFIG.email}`}
                className="text-[hsl(var(--primary))] underline"
              >
                {SITE_CONFIG.email}
              </a>
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="space-y-5 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-8"
          >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="contact-name"
                  className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]"
                >
                  Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] px-4 py-3 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted))] focus:border-[hsl(var(--primary))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary)/.2)]"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label
                  htmlFor="contact-email"
                  className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]"
                >
                  Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] px-4 py-3 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted))] focus:border-[hsl(var(--primary))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary)/.2)]"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="contact-subject"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]"
              >
                Subject
              </label>
              <input
                id="contact-subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] px-4 py-3 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted))] focus:border-[hsl(var(--primary))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary)/.2)]"
                placeholder="How can we help?"
              />
            </div>
            <div>
              <label
                htmlFor="contact-message"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]"
              >
                Message
              </label>
              <textarea
                id="contact-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={5}
                className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] px-4 py-3 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted))] focus:border-[hsl(var(--primary))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary)/.2)] resize-none"
                placeholder="Tell us what's on your mind..."
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-xl gradient-bg py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:opacity-90 active:scale-[0.98]"
            >
              Send Message
            </button>
          </form>
        )}

        {/* Direct contact info */}
        <div className="mt-8 flex flex-col items-center gap-3 text-center text-sm text-[hsl(var(--muted-foreground))]">
          <p>Or email us directly at</p>
          <a
            href={`mailto:${SITE_CONFIG.email}`}
            className="inline-flex items-center gap-2 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-5 py-2.5 font-medium text-[hsl(var(--foreground))] transition-colors hover:bg-[hsl(var(--card-hover))]"
          >
            <svg
              className="h-4 w-4 text-[hsl(var(--primary))]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            {SITE_CONFIG.email}
          </a>
        </div>
      </div>
    </div>
  );
}
