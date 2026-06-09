import { Metadata } from "next";
import Link from "next/link";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about OmniLoad — the free online video and audio downloader supporting 20+ platforms.",
  alternates: { canonical: `${SITE_CONFIG.url}/about` },
};

export default function AboutPage() {
  return (
    <div className="py-16 sm:py-24">
      <div className="container mx-auto max-w-3xl px-4 sm:px-6">
        <h1 className="mb-6 text-3xl font-extrabold tracking-tight sm:text-4xl">
          About <span className="gradient-text">OmniLoad</span>
        </h1>

        <div className="prose max-w-none space-y-6">
          <p className="text-lg leading-relaxed">
            OmniLoad is a free, fast, and reliable online video and audio downloader that supports 20+ major platforms. Our mission is to provide everyone with easy access to their favorite media content for offline use — no registration, no software installation, and absolutely no cost.
          </p>

          <h2>Our Mission</h2>
          <p>
            We believe that accessing publicly available media content should be simple and hassle-free. Whether you want to watch a YouTube tutorial offline during a flight, save an Instagram Reel for later, or extract audio from a TikTok video, OmniLoad makes it possible in just a few clicks.
          </p>

          <h2>What We Offer</h2>
          <ul>
            <li><strong>20+ Platform Support:</strong> Download from YouTube, Instagram, TikTok, Twitter/X, Facebook, Pinterest, Reddit, Spotify, SoundCloud, and many more.</li>
            <li><strong>Multiple Formats:</strong> Save content as MP4, MP3, WEBM, M4A, and other popular formats.</li>
            <li><strong>Up to 8K Quality:</strong> Download videos in the highest available quality, from 360p to 8K Ultra HD.</li>
            <li><strong>100% Free:</strong> No hidden costs, no premium tiers, no subscription fees. OmniLoad is completely free to use.</li>
            <li><strong>No Registration:</strong> Start downloading immediately. No sign-up or account creation needed.</li>
            <li><strong>Privacy Focused:</strong> We don&apos;t store your downloads or personal information. All processing happens in real-time.</li>
          </ul>

          <h2>How It Works</h2>
          <p>OmniLoad works by fetching download information from publicly available sources. When you paste a URL:</p>
          <ol>
            <li>Our system identifies the platform and content type</li>
            <li>We fetch all available format and quality options</li>
            <li>You choose your preferred option and download directly to your device</li>
          </ol>
          <p>The entire process takes just seconds, and no content is stored on our servers.</p>

          <h2>Our Values</h2>
          <ul>
            <li><strong>Simplicity:</strong> Anyone should be able to use our tool, regardless of technical ability.</li>
            <li><strong>Transparency:</strong> We&apos;re upfront about what we do and how we handle your data.</li>
            <li><strong>Respect for Creators:</strong> We only facilitate downloading of publicly available content and encourage users to respect copyright and creator rights.</li>
            <li><strong>Privacy:</strong> We minimize data collection and never sell user information.</li>
          </ul>

          <h2>Contact Us</h2>
          <p>
            Have questions, feedback, or suggestions? We&apos;d love to hear from you. Visit our <Link href="/contact">Contact page</Link> or email us at <a href={`mailto:${SITE_CONFIG.email}`}>{SITE_CONFIG.email}</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
