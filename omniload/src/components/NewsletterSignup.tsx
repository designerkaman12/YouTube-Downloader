"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowRight, CheckCircle } from "lucide-react";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    // TODO: Connect to email service (e.g. Mailchimp, ConvertKit)
    setSubmitted(true);
  };

  return (
    <section className="py-16 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="newsletter-section mx-auto max-w-2xl text-center"
        >
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Mail size={22} />
          </div>
          <h2 className="mb-2 text-2xl font-bold tracking-tight sm:text-3xl">
            Stay <span className="gradient-text">Updated</span>
          </h2>
          <p className="mb-6 text-sm text-muted-foreground">
            Get notified about new features, platform updates, and creator tips. No spam, unsubscribe anytime.
          </p>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center gap-2 text-success"
            >
              <CheckCircle size={18} />
              <span className="text-sm font-medium">Thanks! You&apos;re on the list.</span>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 flex-1 rounded-xl border border-border bg-card px-4 text-sm text-foreground placeholder:text-muted ring-primary/20 transition-all focus:border-primary focus:outline-none focus:ring-4"
              />
              <button
                type="submit"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-hover hover:shadow-xl hover:shadow-primary/30 active:scale-95"
              >
                Subscribe <ArrowRight size={14} />
              </button>
            </form>
          )}

          <p className="mt-4 text-[10px] text-muted">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
