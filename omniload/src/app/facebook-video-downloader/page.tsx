import type { Metadata } from "next";
import SEOPage from "@/components/SEOPage";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://omniload.onrender.com";

export const metadata: Metadata = {
  title: "Facebook Video Saver | OmniLoad",
  description:
    "Save Facebook videos from public posts where you have permission. Simple browser-based media link utility powered by OmniLoad.",
  keywords: [
    "facebook video saver",
    "save facebook video",
    "facebook video downloader online",
    "facebook to mp4",
    "download facebook video hd",
    "fb video saver",
  ],
  openGraph: {
    title: "Facebook Video Saver | OmniLoad",
    description:
      "Save Facebook videos from public posts where you have permission. Multiple qualities, no Facebook login needed.",
    url: `${siteUrl}/facebook-video-downloader`,
    siteName: "OmniLoad",
    type: "website",
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "OmniLoad Facebook Video Saver",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Facebook Video Saver | OmniLoad",
    description:
      "Save Facebook videos from public posts. HD quality available, no login needed.",
    images: [`${siteUrl}/og-image.png`],
  },
  alternates: {
    canonical: `${siteUrl}/facebook-video-downloader`,
  },
};

const features = [
  {
    icon: "globe",
    title: "Public Video Support",
    description:
      "Process videos from public Facebook posts, pages, and groups where you have permission. Private or friends-only posts are not accessible.",
  },
  {
    icon: "layers",
    title: "Multiple Quality Options",
    description:
      "Facebook often hosts videos in SD and HD. OmniLoad shows all available quality tiers so you can choose the resolution you prefer.",
  },
  {
    icon: "shield",
    title: "No Facebook Login",
    description:
      "You never need to sign into Facebook through OmniLoad. We don't ask for credentials or access tokens — your account stays secure.",
  },
  {
    icon: "zap",
    title: "Fast Processing",
    description:
      "Facebook video links are analyzed and processed rapidly. Most links resolve within a few seconds, regardless of the video length.",
  },
  {
    icon: "monitor",
    title: "Works in Any Browser",
    description:
      "Chrome, Firefox, Safari, Edge — OmniLoad works in any modern browser. No plugins, extensions, or desktop apps required.",
  },
  {
    icon: "video",
    title: "HD Available Where Permitted",
    description:
      "When a video was originally uploaded in high definition, OmniLoad can retrieve the HD version. Quality depends on the original upload.",
  },
];

const howToSteps = [
  {
    step: 1,
    title: "Get the Facebook Video Link",
    description:
      "Navigate to the public Facebook post containing the video. Right-click the video or use the share menu to copy the video's URL.",
  },
  {
    step: 2,
    title: "Paste into OmniLoad",
    description:
      "Drop the Facebook video link into the input field above. OmniLoad detects the Facebook platform automatically and fetches available formats.",
  },
  {
    step: 3,
    title: "Choose Quality & Save",
    description:
      "Select between SD and HD quality (where available), then click save. The video file is saved directly to your device.",
  },
];

const faqs = [
  {
    question: "Can I save videos from private Facebook posts?",
    answer:
      "No, OmniLoad only processes publicly accessible Facebook content. Videos from private profiles, friends-only posts, or closed groups cannot be accessed by our tool. This is intentional to respect user privacy.",
  },
  {
    question: "What types of Facebook videos can I save?",
    answer:
      "OmniLoad supports standard video posts, Facebook Watch videos, and videos shared on public pages and groups. Live streams and Facebook Stories may have limited availability depending on their current accessibility.",
  },
  {
    question: "Why does the Facebook video only show SD quality?",
    answer:
      "The available quality depends entirely on the original upload. If the creator uploaded in standard definition, HD won't be available. Some older videos may also only be hosted in lower resolutions by Facebook.",
  },
  {
    question: "Do I need to log into Facebook to use this tool?",
    answer:
      "No. OmniLoad processes Facebook links without requiring any login. You don't need to authenticate with Facebook or provide any credentials. However, the video must be publicly accessible for our tool to process it.",
  },
  {
    question: "Is saving Facebook videos respectful of creators?",
    answer:
      "Always ensure you have permission before saving someone else's content. If you're saving your own videos or content that's been shared with explicit permission, you're on solid ground. Respect intellectual property and give credit to original creators.",
  },
];

const relatedPages = [
  { title: "YouTube Video Saver", href: "/youtube-video-downloader" },
  { title: "Instagram Video Saver", href: "/instagram-video-downloader" },
  { title: "TikTok Video Saver", href: "/tiktok-video-downloader" },
  { title: "X (Twitter) Video Saver", href: "/twitter-video-downloader" },
  { title: "Video to MP3", href: "/video-to-mp3" },
  { title: "Audio Converter", href: "/audio-converter" },
];

export default function FacebookVideoDownloaderPage() {
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
        platform="Facebook Video Saver"
        title="Save Facebook Videos | In HD Quality"
        subtitle="Process public Facebook video links you're permitted to keep."
        description="Save videos from public Facebook posts and pages where you have permission. HD quality where available, no Facebook login required."
        features={features}
        howToSteps={howToSteps}
        faqs={faqs}
        relatedPages={relatedPages}
      />
    </>
  );
}
