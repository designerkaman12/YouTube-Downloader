import type { Metadata } from "next";
import SEOPage from "@/components/SEOPage";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://omniload.onrender.com";

export const metadata: Metadata = {
  title: "YouTube Video Saver | OmniLoad",
  description:
    "Save YouTube videos you have permission to download. Process public YouTube links in multiple formats and qualities with OmniLoad's fast, browser-based tool.",
  keywords: [
    "youtube video saver",
    "save youtube video",
    "youtube to mp4",
    "youtube to mp3",
    "youtube video downloader online",
    "youtube hd video saver",
  ],
  openGraph: {
    title: "YouTube Video Saver | OmniLoad",
    description:
      "Save YouTube videos you have permission to download. Multiple formats, fast processing, no signup required.",
    url: `${siteUrl}/youtube-video-downloader`,
    siteName: "OmniLoad",
    type: "website",
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "OmniLoad YouTube Video Saver",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "YouTube Video Saver | OmniLoad",
    description:
      "Save YouTube videos you have permission to download. Fast, free, browser-based.",
    images: [`${siteUrl}/og-image.png`],
  },
  alternates: {
    canonical: `${siteUrl}/youtube-video-downloader`,
  },
};

const features = [
  {
    icon: "layers",
    title: "Multiple Quality Options",
    description:
      "Choose from a range of resolutions — from compact 360p to stunning 4K and even 8K where available — for public videos you have permission to save.",
  },
  {
    icon: "music",
    title: "Audio Extraction",
    description:
      "Extract audio tracks from public YouTube videos in MP3, OGG, or WAV format. Perfect for saving podcasts or lectures you're permitted to keep.",
  },
  {
    icon: "zap",
    title: "Lightning-Fast Processing",
    description:
      "Our optimized pipeline processes your YouTube links in seconds, not minutes. Paste a link and your file is ready almost instantly.",
  },
  {
    icon: "shield",
    title: "No Signup Needed",
    description:
      "Start saving immediately — no email, no account creation, no personal data required. Your privacy stays intact.",
  },
  {
    icon: "monitor",
    title: "Entirely Browser-Based",
    description:
      "No extensions, apps, or desktop software to install. OmniLoad works in any modern browser on any device.",
  },
  {
    icon: "video",
    title: "Multiple Output Formats",
    description:
      "Save as MP4 for video or extract audio as MP3, OGG, WAV, or OPUS. Pick the format that best suits your needs.",
  },
];

const howToSteps = [
  {
    step: 1,
    title: "Copy the YouTube Link",
    description:
      "Navigate to the public YouTube video you have permission to save. Copy the URL from your browser's address bar or the share button.",
  },
  {
    step: 2,
    title: "Paste into OmniLoad",
    description:
      "Drop the link into the input field above. OmniLoad will instantly detect the platform and begin analyzing available formats.",
  },
  {
    step: 3,
    title: "Choose Format & Save",
    description:
      "Browse available quality options, select your preferred format (MP4, MP3, etc.), and click to save the file directly to your device.",
  },
];

const faqs = [
  {
    question: "What types of YouTube content can I save with OmniLoad?",
    answer:
      "OmniLoad processes publicly available YouTube videos where you have permission to save them. This typically includes Creative Commons content, your own uploads, and videos where the creator has explicitly allowed saving. Always respect the content creator's rights and YouTube's terms of service.",
  },
  {
    question: "What formats and quality options are available for YouTube?",
    answer:
      "For video, OmniLoad offers MP4 in various resolutions from 360p up to 4K (2160p) and 8K where the source supports it. For audio-only, you can extract in MP3 (128kbps to 320kbps), OGG, WAV, and OPUS formats. The available options depend on the original video's quality.",
  },
  {
    question: "Is saving YouTube videos with OmniLoad legal?",
    answer:
      "The legality depends on the specific content and your jurisdiction. Saving content you own, Creative Commons material, or videos where you have explicit permission from the creator is generally acceptable. You are responsible for ensuring you have the right to save any content. Always respect copyright laws and platform terms.",
  },
  {
    question: "How fast does OmniLoad process YouTube links?",
    answer:
      "Most YouTube links are processed within a few seconds. After pasting a link, you'll see available formats almost instantly. The actual save time depends on the file size and your internet speed, but our servers are optimized for rapid throughput.",
  },
  {
    question: "Do I need to create an account to use the YouTube saver?",
    answer:
      "No, OmniLoad is completely free to use without any registration. You don't need to provide an email, create a password, or share any personal information. Simply paste a link and start saving.",
  },
];

const relatedPages = [
  { title: "Instagram Video Saver", href: "/instagram-video-downloader" },
  { title: "TikTok Video Saver", href: "/tiktok-video-downloader" },
  { title: "X (Twitter) Video Saver", href: "/twitter-video-downloader" },
  { title: "Video to MP3", href: "/video-to-mp3" },
  { title: "Audio Converter", href: "/audio-converter" },
  { title: "Creator Tools", href: "/creator-tools" },
];

export default function YouTubeVideoDownloaderPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
              },
            })),
          }),
        }}
      />
      <SEOPage
        platform="YouTube Video Saver"
        title="Save YouTube Videos | In Seconds"
        subtitle="Fast, free, and browser-based YouTube video processing."
        description="Process public YouTube links you have permission to save. Choose from multiple quality options and formats — no signup, no software installs."
        features={features}
        howToSteps={howToSteps}
        faqs={faqs}
        relatedPages={relatedPages}
      />
    </>
  );
}
