"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ArrowRight, Zap, Shield, Globe, Download, Music, Video, Sparkles, Clock, Monitor, Users, Headphones, FileAudio, Layers, Wrench, Star, CheckCircle2 } from "lucide-react";
import DownloaderBox from "@/components/DownloaderBox";
import Link from "next/link";

interface SEOPageProps {
  platform: string;
  title: string;
  subtitle: string;
  description: string;
  features: { icon: string; title: string; description: string }[];
  howToSteps: { step: number; title: string; description: string }[];
  faqs: { question: string; answer: string }[];
  relatedPages: { title: string; href: string }[];
}

const iconMap: Record<string, React.ReactNode> = {
  zap: <Zap size={22} />,
  shield: <Shield size={22} />,
  globe: <Globe size={22} />,
  download: <Download size={22} />,
  music: <Music size={22} />,
  video: <Video size={22} />,
  sparkles: <Sparkles size={22} />,
  clock: <Clock size={22} />,
  monitor: <Monitor size={22} />,
  users: <Users size={22} />,
  headphones: <Headphones size={22} />,
  fileaudio: <FileAudio size={22} />,
  layers: <Layers size={22} />,
  wrench: <Wrench size={22} />,
  star: <Star size={22} />,
  check: <CheckCircle2 size={22} />,
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" as const },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card/60 backdrop-blur-sm transition-colors hover:bg-card-hover">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
        aria-expanded={open}
      >
        <span className="text-base font-semibold text-foreground pr-4">
          {question}
        </span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="shrink-0 text-muted-foreground"
        >
          <ChevronDown size={20} />
        </motion.div>
      </button>
      <motion.div
        initial={false}
        animate={{
          height: open ? "auto" : 0,
          opacity: open ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <p className="px-6 pb-5 text-sm leading-relaxed text-muted-foreground">
          {answer}
        </p>
      </motion.div>
    </div>
  );
}

export default function SEOPage({
  platform,
  title,
  subtitle,
  description,
  features,
  howToSteps,
  faqs,
  relatedPages,
}: SEOPageProps) {
  return (
    <div className="relative overflow-hidden">
      {/* ── Ambient BG ─────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/4 rounded-full bg-primary/8 blur-[180px]" />
        <div className="absolute right-0 top-1/4 h-[350px] w-[350px] rounded-full bg-violet-500/5 blur-[140px]" />
        <div className="absolute left-0 bottom-1/4 h-[250px] w-[250px] rounded-full bg-indigo-500/5 blur-[120px]" />
      </div>

      {/* ── Hero Section ───────────────────────────────── */}
      <section className="pb-12 pt-20 md:pb-16 md:pt-28 lg:pt-36">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            {/* Platform Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
              {platform}
            </div>

            <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              {title.includes("|") ? (
                <>
                  {title.split("|")[0].trim()}{" "}
                  <br className="hidden sm:block" />
                  <span className="gradient-text">{title.split("|")[1]?.trim()}</span>
                </>
              ) : (
                <span className="gradient-text">{title}</span>
              )}
            </h1>

            <p className="mb-3 text-lg font-medium text-foreground/80 md:text-xl">
              {subtitle}
            </p>

            <p className="mx-auto mb-8 max-w-2xl text-base text-muted-foreground md:text-lg">
              {description}
            </p>
          </motion.div>

          {/* Downloader Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <DownloaderBox />
          </motion.div>
        </div>
      </section>

      {/* ── Features Grid ──────────────────────────────── */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Why Choose <span className="gradient-text">OmniLoad</span>
            </h2>
            <p className="mx-auto max-w-xl text-muted-foreground">
              Powerful features designed for a seamless experience.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                variants={fadeUp}
                custom={i}
                className="card-shine group rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-sm transition-all hover:border-primary/30 hover:bg-card-hover"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                  {iconMap[feature.icon] || <Sparkles size={22} />}
                </div>
                <h3 className="mb-2 text-base font-bold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── How to Use ─────────────────────────────────── */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="mx-auto max-w-xl text-muted-foreground">
              Three simple steps to get started.
            </p>
          </motion.div>

          <div className="mx-auto max-w-3xl space-y-6">
            {howToSteps.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="flex gap-5 rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-sm"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-lg font-extrabold text-primary">
                  {step.step}
                </div>
                <div>
                  <h3 className="mb-1 text-base font-bold text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ Accordion ──────────────────────────────── */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
            <p className="mx-auto max-w-xl text-muted-foreground">
              Find answers to common questions below.
            </p>
          </motion.div>

          <div className="mx-auto max-w-3xl space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <FAQItem question={faq.question} answer={faq.answer} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Related Pages ──────────────────────────────── */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="mb-10 text-center"
          >
            <h2 className="mb-4 text-2xl font-bold tracking-tight sm:text-3xl">
              Explore More <span className="gradient-text">Tools</span>
            </h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            className="mx-auto grid max-w-4xl gap-3 sm:grid-cols-2 lg:grid-cols-3"
          >
            {relatedPages.map((page, i) => (
              <motion.div key={page.href} variants={fadeUp} custom={i}>
                <Link
                  href={page.href}
                  className="group flex items-center justify-between rounded-xl border border-border bg-card/60 px-5 py-4 backdrop-blur-sm transition-all hover:border-primary/30 hover:bg-card-hover"
                >
                  <span className="text-sm font-semibold text-foreground">
                    {page.title}
                  </span>
                  <ArrowRight
                    size={16}
                    className="text-muted transition-transform group-hover:translate-x-1 group-hover:text-primary"
                  />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Disclaimer ─────────────────────────────────── */}
      <section className="border-t border-border py-10">
        <div className="container mx-auto px-4 sm:px-6">
          <p className="mx-auto max-w-2xl text-center text-xs leading-relaxed text-muted">
            This tool is for publicly available content where you have
            permission. Always respect copyright and platform terms of service.
            OmniLoad does not host or store any media content.
          </p>
        </div>
      </section>
    </div>
  );
}
