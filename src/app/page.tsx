"use client";

import Hero from "@/components/Hero";
import ToolGrid from "@/components/ToolGrid";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

// ─── HOW IT WORKS SECTION ───────────────────────────────────
const steps = [
  {
    num: "01",
    title: "Paste Your Link",
    desc: "Copy the URL of any video or audio from any supported platform and paste it into the input box.",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.915-3.071a4.5 4.5 0 00-1.242-7.244l-4.5-4.5a4.5 4.5 0 00-6.364 6.364L4.343 8.07" />
      </svg>
    ),
  },
  {
    num: "02",
    title: "Choose Quality",
    desc: "Select your preferred format and quality — from 360p to 8K for video, or MP3/WAV for audio.",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
      </svg>
    ),
  },
  {
    num: "03",
    title: "Download Instantly",
    desc: "Click download and the file is saved directly to your device. No signup or installation needed.",
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
        <div className="mb-14 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="mx-auto max-w-lg text-base text-muted-foreground">
            Download any media in three simple steps. No technical knowledge required.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.num}
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── STATS SECTION ──────────────────────────────────────────
function Stats() {
  const stats = [
    { value: "12+", label: "Platforms Supported" },
    { value: "∞", label: "Unlimited Downloads" },
    { value: "8K", label: "Max Quality" },
    { value: "100%", label: "Free Forever" },
  ];

  return (
    <section className="border-y border-border bg-surface/50 py-14">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="mb-1 text-3xl font-black tracking-tight text-foreground sm:text-4xl">
                {stat.value}
              </div>
              <div className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ SECTION ────────────────────────────────────────────
const faqItems = [
  {
    q: "Is OmniLoad completely free to use?",
    a: "Yes, OmniLoad is 100% free with no hidden costs or premium tiers. You can download unlimited videos and audio files without any registration or payment.",
  },
  {
    q: "What platforms does OmniLoad support?",
    a: "OmniLoad supports 20+ platforms including YouTube, Instagram, TikTok, Twitter/X, Facebook, Pinterest, Reddit, Vimeo, Snapchat, Threads, Spotify, SoundCloud, LinkedIn, Twitch, Dailymotion, Bilibili, Tumblr, VK, Likee, and Bandcamp.",
  },
  {
    q: "What quality options are available?",
    a: "We support a wide range of qualities from 360p all the way up to 8K Ultra HD for video. For audio, we support MP3 (128kbps-320kbps), OGG, WAV, and OPUS formats.",
  },
  {
    q: "Do I need to install any software?",
    a: "No, OmniLoad works entirely in your web browser. Just paste a link and download — no software, browser extensions, or apps needed.",
  },
  {
    q: "Is it safe to use OmniLoad?",
    a: "Yes, OmniLoad is completely safe. We don't store any of your downloads or personal information. All processing happens in real-time and we use secure HTTPS connections.",
  },
  {
    q: "Can I download private or restricted videos?",
    a: "No, OmniLoad can only download publicly available content. We respect creators' privacy settings and copyright protections.",
  },
];

function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 sm:py-28">
      <div className="container mx-auto max-w-3xl px-4 sm:px-6">
        <div className="mb-14 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
          <p className="mx-auto max-w-lg text-base text-muted-foreground">
            Everything you need to know about using OmniLoad.
          </p>
        </div>

        <div className="space-y-3">
          {faqItems.map((item, idx) => (
            <div
              key={idx}
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
            </div>
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
      <Stats />
      <ToolGrid />
      <HowItWorks />
      <FAQ />
    </div>
  );
}
