'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  X,
  Zap,
  Shield,
  Star,
  Crown,
  Sparkles,
  ChevronDown,
  Mail,
} from 'lucide-react';

/* ─── TYPES ────────────────────────────────────────────────── */
interface PlanFeature {
  text: string;
  included: boolean;
}

interface Plan {
  name: string;
  icon: React.ReactNode;
  monthlyPrice: number | null;
  yearlyPrice: number | null;
  yearlyOnly?: boolean;
  features: PlanFeature[];
  cta: string;
  highlighted?: boolean;
  badge?: string;
  disabled?: boolean;
}

/* ─── DATA ─────────────────────────────────────────────────── */
const plans: Plan[] = [
  {
    name: 'Free',
    icon: <Zap className="h-6 w-6" />,
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      { text: 'Basic media link processing', included: true },
      { text: 'Standard quality options', included: true },
      { text: 'Popular platform support', included: true },
      { text: 'No signup required', included: true },
      { text: 'Display ads shown', included: false },
      { text: 'Standard processing queue', included: false },
    ],
    cta: 'Current Plan',
    disabled: true,
  },
  {
    name: 'Pro',
    icon: <Star className="h-6 w-6" />,
    monthlyPrice: 5,
    yearlyPrice: 39,
    features: [
      { text: 'Everything in Free', included: true },
      { text: 'Faster queue priority', included: true },
      { text: 'No display ads', included: true },
      { text: 'Saved history (local)', included: true },
      { text: 'Bulk link processing', included: true },
      { text: 'Priority support', included: true },
    ],
    cta: 'Coming Soon',
    highlighted: true,
    badge: 'Most Popular',
    disabled: false,
  },
  {
    name: 'Creator',
    icon: <Crown className="h-6 w-6" />,
    monthlyPrice: null,
    yearlyPrice: 39,
    yearlyOnly: true,
    features: [
      { text: 'Everything in Pro', included: true },
      { text: 'Advanced format preferences', included: true },
      { text: 'Early access to new features', included: true },
      { text: 'Creator workflow tools', included: true },
      { text: 'Exclusive updates', included: true },
      { text: 'Community access', included: true },
    ],
    cta: 'Coming Soon',
    disabled: false,
  },
];

const comparisonFeatures = [
  { feature: 'Media link processing', free: true, pro: true, creator: true },
  { feature: 'Standard quality options', free: true, pro: true, creator: true },
  { feature: 'Popular platform support', free: true, pro: true, creator: true },
  { feature: 'No signup required', free: true, pro: true, creator: true },
  { feature: 'Ad-free experience', free: false, pro: true, creator: true },
  { feature: 'Faster queue priority', free: false, pro: true, creator: true },
  { feature: 'Saved history (local)', free: false, pro: true, creator: true },
  { feature: 'Bulk link processing', free: false, pro: true, creator: true },
  { feature: 'Priority support', free: false, pro: true, creator: true },
  { feature: 'Advanced format preferences', free: false, pro: false, creator: true },
  { feature: 'Early access to new features', free: false, pro: false, creator: true },
  { feature: 'Creator workflow tools', free: false, pro: false, creator: true },
  { feature: 'Exclusive updates', free: false, pro: false, creator: true },
  { feature: 'Community access', free: false, pro: false, creator: true },
];

const faqs = [
  {
    q: 'When will Premium launch?',
    a: "We're working on it! Join our newsletter to be the first to know.",
  },
  {
    q: 'Will my history be stored on your servers?',
    a: 'No, saved history is stored locally in your browser for privacy.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes, you can cancel your subscription at any time.',
  },
  {
    q: 'What payment methods will be accepted?',
    a: 'We plan to support major credit cards and PayPal via Stripe.',
  },
];

/* ─── ANIMATION VARIANTS ──────────────────────────────────── */
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

/* ─── COMPONENT ────────────────────────────────────────────── */
export default function PremiumContent() {
  const [yearly, setYearly] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* ── Ambient blurs ─────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/4 rounded-full bg-primary/8 blur-[180px]" />
        <div className="absolute right-0 top-1/4 h-[400px] w-[400px] rounded-full bg-violet-500/6 blur-[140px]" />
        <div className="absolute left-0 bottom-1/4 h-[350px] w-[350px] rounded-full bg-indigo-500/5 blur-[120px]" />
      </div>

      {/* ══════════════════════════════════════════════════════
          HERO
         ══════════════════════════════════════════════════════ */}
      <section className="pb-4 pt-24 md:pt-32 lg:pt-36">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Premium Plans
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl"
          >
            Unlock the Full Power of{' '}
            <span className="gradient-text">OmniLoad</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mb-12 max-w-2xl text-base text-muted-foreground md:text-lg"
          >
            Choose the plan that fits your workflow. All plans include core
            media processing features.
          </motion.p>

          {/* ── Billing toggle ────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mb-14 flex items-center justify-center gap-4"
          >
            <span
              className={`text-sm font-medium transition-colors ${
                !yearly ? 'text-foreground' : 'text-muted-foreground'
              }`}
            >
              Monthly
            </span>

            <button
              onClick={() => setYearly(!yearly)}
              className={`relative inline-flex h-7 w-[52px] shrink-0 cursor-pointer items-center rounded-full border border-border transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                yearly ? 'bg-primary' : 'bg-card'
              }`}
              aria-label="Toggle billing period"
            >
              <span
                className={`pointer-events-none block h-5 w-5 rounded-full bg-foreground shadow-lg transition-transform duration-300 ${
                  yearly ? 'translate-x-[27px]' : 'translate-x-[3px]'
                }`}
              />
            </button>

            <span
              className={`text-sm font-medium transition-colors ${
                yearly ? 'text-foreground' : 'text-muted-foreground'
              }`}
            >
              Yearly
            </span>

            <AnimatePresence>
              {yearly && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8, x: -8 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.8, x: -8 }}
                  className="rounded-full bg-success/15 px-3 py-0.5 text-xs font-semibold text-success"
                >
                  Save 35%
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          PRICING CARDS
         ══════════════════════════════════════════════════════ */}
      <section className="pb-20">
        <motion.div
          className="container mx-auto grid max-w-5xl gap-6 px-4 sm:px-6 md:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {plans.map((plan) => {
            const isHighlighted = plan.highlighted;
            const price =
              plan.yearlyOnly
                ? plan.yearlyPrice
                : yearly
                  ? plan.yearlyPrice
                  : plan.monthlyPrice;
            const period =
              plan.yearlyOnly ? '/year' : yearly ? '/year' : '/month';

            return (
              <motion.div
                key={plan.name}
                variants={cardVariants}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className={`card-shine relative flex flex-col rounded-2xl border p-6 sm:p-8 transition-shadow duration-300 ${
                  isHighlighted
                    ? 'border-primary/60 bg-card shadow-[0_0_40px_-10px_rgba(99,102,241,0.25)]'
                    : 'border-border bg-card/80'
                }`}
              >
                {/* Badge */}
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-white shadow-lg shadow-primary/25">
                      <Star className="h-3 w-3 fill-current" />
                      {plan.badge}
                    </span>
                  </div>
                )}

                {/* Header */}
                <div className="mb-6">
                  <div
                    className={`mb-4 inline-flex items-center justify-center rounded-xl p-2.5 ${
                      isHighlighted
                        ? 'bg-primary/15 text-primary'
                        : 'bg-surface text-muted-foreground'
                    }`}
                  >
                    {plan.icon}
                  </div>
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-extrabold tracking-tight">
                      {price !== null ? `$${price}` : '—'}
                    </span>
                    {price !== null && price > 0 && (
                      <span className="mb-1 text-sm text-muted-foreground">
                        {period}
                      </span>
                    )}
                  </div>
                  {plan.yearlyOnly && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Billed annually only
                    </p>
                  )}
                  {!plan.yearlyOnly &&
                    yearly &&
                    plan.monthlyPrice !== null &&
                    plan.monthlyPrice > 0 && (
                      <p className="mt-1 text-xs text-muted-foreground line-through">
                        ${plan.monthlyPrice * 12}/year at monthly price
                      </p>
                    )}
                </div>

                {/* Features */}
                <ul className="mb-8 flex-grow space-y-3">
                  {plan.features.map((f) => (
                    <li key={f.text} className="flex items-start gap-3 text-sm">
                      {f.included ? (
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                      ) : (
                        <X className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/50" />
                      )}
                      <span
                        className={
                          f.included
                            ? 'text-foreground'
                            : 'text-muted-foreground/60'
                        }
                      >
                        {f.text}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                {/* TODO: Wire up Stripe checkout session for Pro and Creator plans */}
                <button
                  disabled={plan.disabled}
                  className={`w-full rounded-xl py-3 text-sm font-semibold transition-all duration-300 ${
                    isHighlighted
                      ? 'bg-gradient-to-r from-primary to-violet-500 text-white shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:brightness-110 disabled:opacity-70 disabled:hover:brightness-100'
                      : plan.disabled
                        ? 'cursor-default border border-border bg-surface text-muted-foreground'
                        : 'border border-border bg-card text-foreground hover:bg-card-hover hover:border-primary/40'
                  }`}
                >
                  {plan.cta}
                </button>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FEATURE COMPARISON TABLE
         ══════════════════════════════════════════════════════ */}
      <section className="pb-20">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mb-10 text-center text-3xl font-bold tracking-tight sm:text-4xl"
          >
            Compare <span className="gradient-text">Features</span>
          </motion.h2>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={fadeUp}
            className="overflow-x-auto rounded-2xl border border-border bg-card/60"
          >
            <table className="w-full min-w-[540px] text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="px-6 py-4 font-semibold text-foreground">
                    Feature
                  </th>
                  <th className="px-4 py-4 text-center font-semibold text-foreground">
                    Free
                  </th>
                  <th className="px-4 py-4 text-center font-semibold text-primary">
                    Pro
                  </th>
                  <th className="px-4 py-4 text-center font-semibold text-foreground">
                    Creator
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((row, i) => (
                  <tr
                    key={row.feature}
                    className={`border-b border-border/50 transition-colors hover:bg-card-hover/40 ${
                      i % 2 === 0 ? 'bg-transparent' : 'bg-surface/30'
                    }`}
                  >
                    <td className="px-6 py-3.5 text-foreground">
                      {row.feature}
                    </td>
                    {(['free', 'pro', 'creator'] as const).map((tier) => (
                      <td key={tier} className="px-4 py-3.5 text-center">
                        {row[tier] ? (
                          <Check className="mx-auto h-4 w-4 text-success" />
                        ) : (
                          <X className="mx-auto h-4 w-4 text-muted-foreground/40" />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FAQ
         ══════════════════════════════════════════════════════ */}
      <section className="pb-20">
        <div className="container mx-auto max-w-2xl px-4 sm:px-6">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mb-10 text-center text-3xl font-bold tracking-tight sm:text-4xl"
          >
            Frequently Asked{' '}
            <span className="gradient-text">Questions</span>
          </motion.h2>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
            className="space-y-3"
          >
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <motion.div
                  key={idx}
                  variants={cardVariants}
                  className="rounded-xl border border-border bg-card/70 overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left text-sm font-medium text-foreground transition-colors hover:bg-card-hover/50"
                  >
                    {faq.q}
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <p className="px-6 pb-4 text-sm leading-relaxed text-muted-foreground">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          BOTTOM CTA
         ══════════════════════════════════════════════════════ */}
      <section className="pb-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="container mx-auto max-w-2xl px-4 sm:px-6"
        >
          <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-violet-500/10 p-8 text-center sm:p-12">
            {/* Decorative glow */}
            <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary/15 blur-[80px]" />
            <div className="pointer-events-none absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-violet-500/10 blur-[80px]" />

            <Shield className="mx-auto mb-4 h-10 w-10 text-primary" />

            <h2 className="mb-3 text-2xl font-bold tracking-tight sm:text-3xl">
              Get Notified When Premium Launches
            </h2>
            <p className="mx-auto mb-8 max-w-md text-sm text-muted-foreground">
              Join our newsletter to be the first to know about Premium and
              unlock exclusive early-bird pricing.
            </p>

            {/* TODO: Connect to newsletter service (e.g. Mailchimp, Resend, ConvertKit) */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                // TODO: Implement newsletter signup
              }}
              className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row"
            >
              <div className="relative flex-grow">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-violet-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30 hover:brightness-110"
              >
                <Sparkles className="h-4 w-4" />
                Notify Me
              </button>
            </form>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
