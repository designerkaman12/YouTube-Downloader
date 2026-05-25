"use client";

import Hero from "@/components/Hero";
import ToolGrid from "@/components/ToolGrid";
import AffiliateTools from "@/components/AffiliateTools";
import NewsletterSignup from "@/components/NewsletterSignup";
import AdSlot from "@/components/AdSlot";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ChevronDown,
  UserX,
  Zap,
  Layout,
  Shield,
  Upload,
  FolderDown,
  Headphones,
  Clapperboard,
  ArrowRight,
  Check,
} from "lucide-react";

// ─── TRUST SECTION ──────────────────────────────────────────
const trustCards = [
  {
    icon: <UserX size={24} />,
    title: "No Signup Needed",
    desc: "Use OmniLoad instantly without creating an account or signing in.",
  },
  {
    icon: <Zap size={24} />,
    title: "Fast Processing",
    desc: "Links are processed quickly so you spend less time waiting.",
  },
  {
    icon: <Layout size={24} />,
    title: "Clean Interface",
    desc: "A minimal, intuitive UI designed for ease of use on any device.",
  },
  {
    icon: <Shield size={24} />,
    title: "Permission-First",
    desc: "Built with respect for content permissions and platform policies.",
  },
];

function TrustSection() {
  return (
    <section className="py-16 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {trustCards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="trust-card"
            >
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                {card.icon}
              </div>
              <h3 className="mb-1 text-sm font-bold text-foreground">{card.title}</h3>
              <p className="text-xs leading-relaxed text-muted-foreground">{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── HOW IT WORKS SECTION ───────────────────────────────────
const steps = [
  {
    num: "01",
    title: "Paste Your Link",
    desc: "Copy the URL of any publicly available media from supported platforms.",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.915-3.071a4.5 4.5 0 00-1.242-7.244l-4.5-4.5a4.5 4.5 0 00-6.364 6.364L4.343 8.07" />
      </svg>
    ),
  },
  {
    num: "02",
    title: "Choose Your Format",
    desc: "Select from available quality and format options.",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
      </svg>
    ),
  },
  {
    num: "03",
    title: "Save Your File",
    desc: "Process and save the media to your device instantly.",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
      </svg>
    ),
  },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 sm:py-28">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="mx-auto max-w-lg text-base text-muted-foreground">
            Process any supported media link in three simple steps.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.15 }}
              className="group relative rounded-2xl border border-border bg-card p-8 transition-all hover:border-primary/30 hover:bg-card-hover"
            >
              <span className="mb-5 block text-[40px] font-black leading-none text-border">
                {step.num}
              </span>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                {step.icon}
              </div>
              <h3 className="mb-2 text-lg font-bold">{step.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── POPULAR USE CASES ──────────────────────────────────────
const useCases = [
  {
    icon: <Upload size={22} />,
    title: "Save Your Own Content",
    desc: "Backup videos you've uploaded to platforms for personal archiving and safekeeping.",
  },
  {
    icon: <FolderDown size={22} />,
    title: "Backup Permitted Assets",
    desc: "Save publicly shared media you have rights to access and store locally.",
  },
  {
    icon: <Headphones size={22} />,
    title: "Extract Audio",
    desc: "Convert video to audio from your own content or permitted public media.",
  },
  {
    icon: <Clapperboard size={22} />,
    title: "Creator Workflow",
    desc: "Streamline your content creation process with quick link processing.",
  },
];

function PopularUseCases() {
  return (
    <section className="py-16 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <h2 className="mb-3 text-2xl font-bold tracking-tight sm:text-3xl">
            Popular <span className="gradient-text">Use Cases</span>
          </h2>
          <p className="mx-auto max-w-lg text-sm text-muted-foreground">
            OmniLoad is designed for legitimate, permission-first media processing.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {useCases.map((uc, i) => (
            <motion.div
              key={uc.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="use-case-card"
            >
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                {uc.icon}
              </div>
              <h3 className="mb-1 text-sm font-bold text-foreground">{uc.title}</h3>
              <p className="text-xs leading-relaxed text-muted-foreground">{uc.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── WHY OMNILOAD ───────────────────────────────────────────
const whyPoints = [
  "No account or signup required",
  "Fast and reliable processing",
  "Clean, ad-transparent interface",
  "Supports popular platforms",
  "Permission-first approach",
  "Regular updates and improvements",
];

function WhyOmniLoad() {
  return (
    <section className="py-16 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="mb-8 text-2xl font-bold tracking-tight sm:text-3xl">
            Why Choose <span className="gradient-text">OmniLoad</span>?
          </h2>
          <div className="grid grid-cols-1 gap-3 text-left sm:grid-cols-2">
            {whyPoints.map((point, i) => (
              <motion.div
                key={point}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.08 }}
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 transition-colors hover:bg-card-hover"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-success/10 text-success">
                  <Check size={14} />
                </div>
                <span className="text-sm font-medium text-foreground">{point}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── INTERNAL SEO LINKS ─────────────────────────────────────
const seoLinks = [
  { name: "YouTube Video Saver", href: "/youtube-video-downloader" },
  { name: "Instagram Video Saver", href: "/instagram-video-downloader" },
  { name: "TikTok Video Saver", href: "/tiktok-video-downloader" },
  { name: "Twitter Video Saver", href: "/twitter-video-downloader" },
  { name: "Facebook Video Saver", href: "/facebook-video-downloader" },
  { name: "Audio Converter", href: "/audio-converter" },
  { name: "Video to MP3", href: "/video-to-mp3" },
  { name: "Creator Tools", href: "/creator-tools" },
];

function InternalLinks() {
  return (
    <section className="py-16 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <h2 className="mb-3 text-2xl font-bold tracking-tight sm:text-3xl">
            Popular <span className="gradient-text">Tools</span>
          </h2>
        </motion.div>

        <div className="mx-auto grid max-w-3xl grid-cols-1 gap-2 sm:grid-cols-2">
          {seoLinks.map((link, i) => (
            <motion.div
              key={link.href}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <Link href={link.href} className="seo-link-card">
                <span className="text-sm font-medium">{link.name}</span>
                <ArrowRight size={14} className="text-muted-foreground" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ SECTION ────────────────────────────────────────────
const faqItems = [
  {
    q: "Is OmniLoad free to use?",
    a: "OmniLoad offers free access to core features. Some advanced features may be available through our Premium plan. No signup is required for basic use.",
  },
  {
    q: "What platforms does OmniLoad support?",
    a: "OmniLoad supports processing links from popular platforms including YouTube, Instagram, TikTok, Twitter/X, Facebook, and others. Availability depends on each platform's policies and the content's public accessibility.",
  },
  {
    q: "What quality options are available?",
    a: "Available quality options depend on the source content. We display all formats and resolutions that the platform makes available for publicly accessible media.",
  },
  {
    q: "Do I need to install any software?",
    a: "No, OmniLoad works entirely in your web browser. Just paste a link and process — no software, browser extensions, or apps needed.",
  },
  {
    q: "Is it safe to use OmniLoad?",
    a: "Yes, OmniLoad is designed with user safety in mind. We don't store your personal information. All processing happens in real-time and we use secure HTTPS connections.",
  },
  {
    q: "Can I use OmniLoad to save any content?",
    a: "OmniLoad processes publicly available media links. Users are responsible for ensuring they have the right to save content and comply with the platform's terms of service and applicable copyright laws.",
  },
];

function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 sm:py-28">
      <div className="container mx-auto max-w-3xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
          <p className="mx-auto max-w-lg text-base text-muted-foreground">
            Everything you need to know about using OmniLoad.
          </p>
        </motion.div>

        <div className="space-y-3">
          {faqItems.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="overflow-hidden rounded-xl border border-border bg-card transition-colors hover:bg-card-hover"
            >
              <button
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="flex w-full items-center justify-between px-6 py-5 text-left"
                aria-expanded={openIdx === idx}
              >
                <span className="pr-4 text-sm font-semibold text-foreground sm:text-base">
                  {item.q}
                </span>
                <ChevronDown
                  size={18}
                  className={`shrink-0 text-muted-foreground transition-transform duration-200 ${
                    openIdx === idx ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-200 ${
                  openIdx === idx ? "max-h-60 pb-5" : "max-h-0"
                }`}
              >
                <p className="px-6 text-sm leading-relaxed text-muted-foreground">
                  {item.a}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── MAIN PAGE ──────────────────────────────────────────────
export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <TrustSection />
      <AdSlot slot="home-after-hero" format="banner" />
      <ToolGrid />
      <HowItWorks />
      <AdSlot slot="home-after-howto" format="inline" />
      <PopularUseCases />
      <AffiliateTools />
      <WhyOmniLoad />
      <InternalLinks />
      <NewsletterSignup />
      <FAQ />
    </div>
  );
}
