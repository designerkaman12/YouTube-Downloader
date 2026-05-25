import type { Metadata } from "next";
import SEOPage from "@/components/SEOPage";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://omniload.onrender.com";

export const metadata: Metadata = {
  title: "X (Twitter) Video Saver | OmniLoad",
  description:
    "Save videos from public X/Twitter posts where you have permission. Quick and easy media link processing with OmniLoad.",
  keywords: [
    "twitter video saver",
    "save twitter video",
    "x video downloader",
    "twitter to mp4",
    "download x video",
    "twitter gif saver",
  ],
  openGraph: {
    title: "X (Twitter) Video Saver | OmniLoad",
    description:
      "Save videos from public X/Twitter posts where you have permission. Fast, free, no account needed.",
    url: `${siteUrl}/twitter-video-downloader`,
    siteName: "OmniLoad",
    type: "website",
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "OmniLoad X Twitter Video Saver",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "X (Twitter) Video Saver | OmniLoad",
    description:
      "Save videos and GIFs from public X/Twitter posts. Quick processing, multiple qualities.",
    images: [`${siteUrl}/og-image.png`],
  },
  alternates: {
    canonical: `${siteUrl}/twitter-video-downloader`,
  },
};

const features = [
  {
    icon: "video",
    title: "Public Tweet Videos",
    description:
      "Process videos attached to public tweets and posts on X. Works with both twitter.com and x.com links.",
  },
  {
    icon: "sparkles",
    title: "GIF Support",
    description:
      "X/Twitter GIFs are actually short video files. OmniLoad can save them as proper MP4 videos, preserving their full quality and smooth playback.",
  },
  {
    icon: "layers",
    title: "Multiple Quality Levels",
    description:
      "X hosts videos at several quality tiers. OmniLoad presents all available options so you can pick the resolution that suits your needs.",
  },
  {
    icon: "shield",
    title: "No Account Needed",
    description:
      "Process X/Twitter video links without logging into X or creating an OmniLoad account. Zero friction, zero data collection.",
  },
  {
    icon: "zap",
    title: "Speedy Processing",
    description:
      "Tweet links are resolved and processed quickly. Most X/Twitter videos are ready to save within seconds of pasting the link.",
  },
  {
    icon: "download",
    title: "Direct Save",
    description:
      "Files save directly to your device's default download folder. No intermediate steps, pop-ups, or redirect chains.",
  },
];

const howToSteps = [
  {
    step: 1,
    title: "Copy the Tweet Link",
    description:
      "Find the public tweet containing the video or GIF on X/Twitter. Click the share icon and select 'Copy Link', or copy the URL from your browser.",
  },
  {
    step: 2,
    title: "Paste & Process",
    description:
      "Paste the X/Twitter link into the OmniLoad input field above. The tool recognizes both x.com and twitter.com URLs automatically.",
  },
  {
    step: 3,
    title: "Pick Quality & Save",
    description:
      "Select from the available quality options and click to save. The video file lands directly in your device's downloads.",
  },
];

const faqs = [
  {
    question: "Does this work with both x.com and twitter.com links?",
    answer:
      "Yes, OmniLoad seamlessly handles both x.com and twitter.com URLs. Whether you copied a link before or after the rebrand, it will work the same way.",
  },
  {
    question: "Can I save GIFs from X/Twitter?",
    answer:
      "Absolutely. On X/Twitter, GIFs are technically short looping video files. OmniLoad saves them as MP4 videos, which preserves their quality far better than actual GIF format and keeps file sizes manageable.",
  },
  {
    question: "What about videos in quoted tweets or replies?",
    answer:
      "OmniLoad processes the video attached to the specific tweet you link to. If the video is in a quoted tweet, copy that quoted tweet's link directly for best results.",
  },
  {
    question: "Can I save videos from protected/private X accounts?",
    answer:
      "No. OmniLoad only accesses publicly available content. Tweets from protected (locked) accounts are not accessible through our tool, and we respect those privacy settings.",
  },
  {
    question: "What quality options are available for X/Twitter videos?",
    answer:
      "X typically hosts videos at multiple bitrates — commonly ranging from 480p to 1080p or higher, depending on what the uploader posted. OmniLoad displays all available quality tiers so you can choose the best option.",
  },
];

const relatedPages = [
  { title: "YouTube Video Saver", href: "/youtube-video-downloader" },
  { title: "Instagram Video Saver", href: "/instagram-video-downloader" },
  { title: "TikTok Video Saver", href: "/tiktok-video-downloader" },
  { title: "Facebook Video Saver", href: "/facebook-video-downloader" },
  { title: "Audio Converter", href: "/audio-converter" },
  { title: "Creator Tools", href: "/creator-tools" },
];

export default function TwitterVideoDownloaderPage() {
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
        platform="X (Twitter) Video Saver"
        title="Save X/Twitter Videos & GIFs | Instantly"
        subtitle="Process public tweet media you're permitted to keep."
        description="Save videos and GIFs from public X/Twitter posts where you have permission. Works with both x.com and twitter.com links — no account required."
        features={features}
        howToSteps={howToSteps}
        faqs={faqs}
        relatedPages={relatedPages}
      />
    </>
  );
}
