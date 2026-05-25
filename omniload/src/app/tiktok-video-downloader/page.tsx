import type { Metadata } from "next";
import SEOPage from "@/components/SEOPage";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://omniload.onrender.com";

export const metadata: Metadata = {
  title: "TikTok Video Saver | OmniLoad",
  description:
    "Save TikTok videos from public accounts where you have permission. Simple link processing for permitted content with OmniLoad.",
  keywords: [
    "tiktok video saver",
    "save tiktok video",
    "tiktok downloader",
    "tiktok without watermark",
    "tiktok to mp4",
    "save tiktok online",
  ],
  openGraph: {
    title: "TikTok Video Saver | OmniLoad",
    description:
      "Save TikTok videos from public accounts where you have permission. Simple, fast, browser-based.",
    url: `${siteUrl}/tiktok-video-downloader`,
    siteName: "OmniLoad",
    type: "website",
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "OmniLoad TikTok Video Saver",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TikTok Video Saver | OmniLoad",
    description:
      "Save TikTok videos from public accounts. No watermark where available, no app needed.",
    images: [`${siteUrl}/og-image.png`],
  },
  alternates: {
    canonical: `${siteUrl}/tiktok-video-downloader`,
  },
};

const features = [
  {
    icon: "video",
    title: "Public TikTok Videos",
    description:
      "Process videos from public TikTok accounts where you have permission. Works with standard TikTok video links and short share URLs.",
  },
  {
    icon: "sparkles",
    title: "Clean Output Where Available",
    description:
      "When the source allows it, save TikTok videos without added watermarks. The output quality matches the original upload.",
  },
  {
    icon: "zap",
    title: "Rapid Processing",
    description:
      "TikTok links are processed in just a few seconds. Our pipeline is optimized specifically for short-form video content.",
  },
  {
    icon: "shield",
    title: "No TikTok Login",
    description:
      "You don't need to sign into TikTok or share any credentials. OmniLoad accesses only publicly available content.",
  },
  {
    icon: "monitor",
    title: "Mobile-Friendly Interface",
    description:
      "Save TikTok videos straight from your phone's browser. The interface adapts perfectly to any screen size.",
  },
  {
    icon: "layers",
    title: "Multiple Quality Options",
    description:
      "Choose from available quality levels depending on the original video. Save in the resolution that works best for you.",
  },
];

const howToSteps = [
  {
    step: 1,
    title: "Copy the TikTok Link",
    description:
      "Open the TikTok app or website, find the public video you're permitted to save, tap the share button, and select 'Copy Link'.",
  },
  {
    step: 2,
    title: "Paste into OmniLoad",
    description:
      "Navigate to OmniLoad and paste the TikTok link into the input field. Our system instantly identifies TikTok content and fetches available options.",
  },
  {
    step: 3,
    title: "Select Quality & Save",
    description:
      "Pick your preferred quality from the available options and tap save. The video will be stored directly on your device.",
  },
];

const faqs = [
  {
    question: "Can I save TikTok videos without the watermark?",
    answer:
      "When available, OmniLoad can provide TikTok videos without the added platform watermark. However, this depends on the specific video and how it's hosted. Not all videos may be available in a clean format.",
  },
  {
    question: "Does this work with TikTok short share links?",
    answer:
      "Yes, OmniLoad handles both full TikTok URLs (vm.tiktok.com or tiktok.com/@user/video/...) and short share links. Just paste whatever link you copied from the TikTok app.",
  },
  {
    question: "Can I save TikTok audio separately?",
    answer:
      "Yes, OmniLoad can extract the audio track from public TikTok videos. This is especially useful for saving original sounds, music snippets, or spoken content you have permission to use.",
  },
  {
    question: "Why can't I save some TikTok videos?",
    answer:
      "Some TikTok videos may be set to private, have restricted sharing, or use region-locked content. OmniLoad can only process publicly accessible videos. If a link doesn't work, the content may not be publicly available.",
  },
  {
    question: "Is it respectful to save TikTok creators' content?",
    answer:
      "Always ask for permission or check the creator's guidelines before saving their content. Many creators appreciate being credited when their work is shared. Use saved content responsibly and never claim someone else's work as your own.",
  },
];

const relatedPages = [
  { title: "YouTube Video Saver", href: "/youtube-video-downloader" },
  { title: "Instagram Video Saver", href: "/instagram-video-downloader" },
  { title: "X (Twitter) Video Saver", href: "/twitter-video-downloader" },
  { title: "Facebook Video Saver", href: "/facebook-video-downloader" },
  { title: "Video to MP3", href: "/video-to-mp3" },
  { title: "Creator Tools", href: "/creator-tools" },
];

export default function TikTokVideoDownloaderPage() {
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
        platform="TikTok Video Saver"
        title="Save TikTok Videos | Clean & Fast"
        subtitle="Process public TikTok content you're permitted to save."
        description="Save TikTok videos from public accounts where you have permission. Clean output where available, rapid processing, no TikTok login needed."
        features={features}
        howToSteps={howToSteps}
        faqs={faqs}
        relatedPages={relatedPages}
      />
    </>
  );
}
