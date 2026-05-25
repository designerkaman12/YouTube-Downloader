import type { Metadata } from "next";
import SEOPage from "@/components/SEOPage";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://omniload.onrender.com";

export const metadata: Metadata = {
  title: "Instagram Video & Reel Saver | OmniLoad",
  description:
    "Save Instagram Reels and videos from public profiles where you have permission. Fast, simple, browser-based Instagram media processing.",
  keywords: [
    "instagram video saver",
    "save instagram reels",
    "instagram reel downloader",
    "instagram video downloader online",
    "save instagram video",
    "instagram to mp4",
  ],
  openGraph: {
    title: "Instagram Video & Reel Saver | OmniLoad",
    description:
      "Save Instagram Reels and videos from public profiles where you have permission. Fast, simple, no app needed.",
    url: `${siteUrl}/instagram-video-downloader`,
    siteName: "OmniLoad",
    type: "website",
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "OmniLoad Instagram Video Saver",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Instagram Video & Reel Saver | OmniLoad",
    description:
      "Save Instagram Reels and videos from public profiles. No login required.",
    images: [`${siteUrl}/og-image.png`],
  },
  alternates: {
    canonical: `${siteUrl}/instagram-video-downloader`,
  },
};

const features = [
  {
    icon: "sparkles",
    title: "Reels Support",
    description:
      "Process Instagram Reels from public accounts where you have permission. Save short-form vertical videos directly to your device in high quality.",
  },
  {
    icon: "globe",
    title: "Public Profile Content",
    description:
      "Works with videos and Reels posted on public Instagram profiles. Private account content is not accessible — only publicly shared media.",
  },
  {
    icon: "zap",
    title: "Instant Processing",
    description:
      "Paste an Instagram link and get results in seconds. Our servers handle the heavy lifting so you don't have to wait around.",
  },
  {
    icon: "monitor",
    title: "No App Needed",
    description:
      "Forget about installing third-party apps. OmniLoad runs entirely in your web browser — desktop, tablet, or mobile.",
  },
  {
    icon: "video",
    title: "Original Quality",
    description:
      "Save Instagram videos and Reels at their original uploaded quality. No re-encoding, no compression artifacts added by us.",
  },
  {
    icon: "shield",
    title: "No Login Required",
    description:
      "You don't need to log in to Instagram or OmniLoad. No credentials, no cookies — just paste a link and go.",
  },
];

const howToSteps = [
  {
    step: 1,
    title: "Find the Instagram Post",
    description:
      "Open the public Instagram Reel or video post you have permission to save. Tap the three dots (⋯) and select 'Copy Link', or copy the URL from your browser.",
  },
  {
    step: 2,
    title: "Paste the Link",
    description:
      "Come back to OmniLoad and paste the Instagram link into the input field above. The tool will automatically recognize the content type.",
  },
  {
    step: 3,
    title: "Save Your File",
    description:
      "Review the available options and tap the save button. Your Instagram video or Reel will be saved directly to your device.",
  },
];

const faqs = [
  {
    question: "Can I save videos from private Instagram accounts?",
    answer:
      "No. OmniLoad only works with publicly available Instagram content. Videos and Reels from private accounts cannot be accessed. This is by design to respect user privacy settings.",
  },
  {
    question: "Does OmniLoad support Instagram Reels?",
    answer:
      "Yes, OmniLoad fully supports Instagram Reels from public profiles. Simply copy the Reel's link and paste it into the input field. You'll be able to save the video at its original quality.",
  },
  {
    question: "Can I save Instagram Stories with this tool?",
    answer:
      "Instagram Stories are typically only available for 24 hours and are tied to user authentication. OmniLoad focuses on permanent, publicly accessible posts and Reels. Stories may not be available through our processing pipeline.",
  },
  {
    question: "What quality will the saved Instagram video be?",
    answer:
      "OmniLoad retrieves Instagram media at the highest quality available from the public post. The resolution depends on what was originally uploaded by the content creator — we don't add any compression or downscaling.",
  },
  {
    question: "Is it okay to save someone's Instagram content?",
    answer:
      "You should only save Instagram content where you have permission from the creator. This includes your own posts, content shared with explicit saving permissions, or Creative Commons material. Always credit creators appropriately and respect their intellectual property.",
  },
];

const relatedPages = [
  { title: "YouTube Video Saver", href: "/youtube-video-downloader" },
  { title: "TikTok Video Saver", href: "/tiktok-video-downloader" },
  { title: "Facebook Video Saver", href: "/facebook-video-downloader" },
  { title: "Video to MP3", href: "/video-to-mp3" },
  { title: "Audio Converter", href: "/audio-converter" },
  { title: "Creator Tools", href: "/creator-tools" },
];

export default function InstagramVideoDownloaderPage() {
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
        platform="Instagram Video & Reel Saver"
        title="Save Instagram Reels & Videos | Effortlessly"
        subtitle="Process public Instagram content you're permitted to keep."
        description="Save Reels and videos from public Instagram profiles where you have permission. No app installs, no Instagram login — just paste a link."
        features={features}
        howToSteps={howToSteps}
        faqs={faqs}
        relatedPages={relatedPages}
      />
    </>
  );
}
