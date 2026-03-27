import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://omniload.onrender.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "OmniLoad — Free Online Video & Audio Downloader | 20+ Platforms",
    template: "%s | OmniLoad",
  },
  description:
    "Download videos and audio from YouTube, Instagram, TikTok, Twitter/X, Facebook, Pinterest, Reddit, Spotify, and 20+ platforms for free. No signup, no limits, up to 8K quality.",
  keywords: [
    "video downloader",
    "youtube downloader",
    "instagram downloader",
    "tiktok downloader",
    "twitter video download",
    "facebook video downloader",
    "mp3 converter",
    "online video downloader",
    "free video downloader",
    "social media downloader",
    "reddit video downloader",
    "pinterest downloader",
    "vimeo downloader",
    "spotify downloader",
    "soundcloud downloader",
    "download video online",
    "save instagram reels",
    "tiktok without watermark",
  ],
  authors: [{ name: "OmniLoad" }],
  creator: "OmniLoad",
  publisher: "OmniLoad",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "OmniLoad",
    title: "OmniLoad — Free Online Video & Audio Downloader",
    description:
      "Download high-quality video and audio from 20+ platforms. Free, fast, no registration.",
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "OmniLoad - Download videos from any platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OmniLoad — Free Video & Audio Downloader",
    description: "Download videos from YouTube, Instagram, TikTok & 20+ platforms for free.",
    images: [`${siteUrl}/og-image.png`],
  },
  alternates: {
    canonical: siteUrl,
  },
  icons: {
    icon: "/favicon.ico",
  },
};

// JSON-LD Structured Data
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "OmniLoad",
  url: siteUrl,
  description:
    "Free online video and audio downloader supporting 20+ platforms including YouTube, Instagram, TikTok, Twitter, Facebook, and more.",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Download videos from 20+ platforms",
    "Support up to 8K quality",
    "MP3 audio extraction",
    "No registration required",
    "Unlimited downloads",
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is OmniLoad completely free to use?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, OmniLoad is 100% free with no hidden costs or premium tiers. You can download unlimited videos and audio files without any registration or payment.",
      },
    },
    {
      "@type": "Question",
      name: "What platforms does OmniLoad support?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "OmniLoad supports 20+ platforms including YouTube, Instagram, TikTok, Twitter/X, Facebook, Pinterest, Reddit, Vimeo, Snapchat, Threads, Spotify, SoundCloud, LinkedIn, Twitch, Dailymotion, Bilibili, Tumblr, VK, Likee, and Bandcamp.",
      },
    },
    {
      "@type": "Question",
      name: "What quality options are available?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We support a wide range of qualities from 360p all the way up to 8K Ultra HD for video. For audio, we support MP3 (128kbps-320kbps), OGG, WAV, and OPUS formats.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need to install any software?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No, OmniLoad works entirely in your web browser. Just paste a link and download — no software, browser extensions, or apps needed.",
      },
    },
    {
      "@type": "Question",
      name: "Is it safe to use OmniLoad?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, OmniLoad is completely safe. We don't store any of your downloads or personal information. All processing happens in real-time and we use secure HTTPS connections.",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
