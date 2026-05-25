import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Analytics from "@/components/Analytics";
import CookieNotice from "@/components/CookieNotice";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://omniload.onrender.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "OmniLoad - Fast Media Link Utility for Public Content",
    template: "%s | OmniLoad",
  },
  description:
    "OmniLoad is a fast media utility that helps process publicly available media links for permitted personal use. Simple, clean, and creator-friendly.",
  keywords: [
    "media link utility",
    "video saver",
    "youtube video saver",
    "instagram saver",
    "tiktok saver",
    "twitter video saver",
    "facebook video saver",
    "mp3 converter",
    "online media tool",
    "social media saver",
    "video to mp3",
    "audio converter",
    "content creator tools",
    "media processing",
    "link processing tool",
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
    title: "OmniLoad - Fast Media Link Utility for Public Content",
    description:
      "Process publicly available media links from popular platforms. Fast, clean, and creator-friendly.",
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "OmniLoad - Fast Media Link Utility",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OmniLoad - Fast Media Link Utility",
    description: "Process media links from YouTube, Instagram, TikTok & popular platforms. Simple and creator-friendly.",
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
    "Fast media link utility for processing publicly available content from popular platforms. Simple, clean, and permission-first.",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Process media links from popular platforms",
    "Multiple quality and format options",
    "Audio extraction from video",
    "No registration required",
    "Clean, creator-friendly interface",
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is OmniLoad free to use?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "OmniLoad offers free access to core features. Some advanced features may be available through our Premium plan. No signup is required for basic use.",
      },
    },
    {
      "@type": "Question",
      name: "What platforms does OmniLoad support?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "OmniLoad supports processing links from popular platforms including YouTube, Instagram, TikTok, Twitter/X, Facebook, and others. Availability depends on each platform's policies.",
      },
    },
    {
      "@type": "Question",
      name: "What quality options are available?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Available quality options depend on the source content. We display all formats and resolutions that the platform makes available for publicly accessible media.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need to install any software?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No, OmniLoad works entirely in your web browser. Just paste a link and process — no software, browser extensions, or apps needed.",
      },
    },
    {
      "@type": "Question",
      name: "Is it safe to use OmniLoad?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, OmniLoad is designed with user safety in mind. We don't store your personal information. All processing happens in real-time and we use secure HTTPS connections.",
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
        <Analytics />
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
        <CookieNotice />
      </body>
    </html>
  );
}
