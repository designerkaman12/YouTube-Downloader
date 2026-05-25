import type { Metadata } from "next";
import SEOPage from "@/components/SEOPage";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://omniload.onrender.com";

export const metadata: Metadata = {
  title: "Video to MP3 Converter | OmniLoad",
  description:
    "Extract MP3 audio from video links where you have permission. Quick, browser-based audio extraction tool powered by OmniLoad.",
  keywords: [
    "video to mp3",
    "video to mp3 converter",
    "extract mp3 from video",
    "youtube to mp3",
    "convert video to mp3 online",
    "mp3 extractor",
  ],
  openGraph: {
    title: "Video to MP3 Converter | OmniLoad",
    description:
      "Extract MP3 audio from video links where you have permission. Multiple bitrates, fast processing.",
    url: `${siteUrl}/video-to-mp3`,
    siteName: "OmniLoad",
    type: "website",
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "OmniLoad Video to MP3 Converter",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Video to MP3 Converter | OmniLoad",
    description:
      "Extract MP3 audio from video links. Quick, free, browser-based.",
    images: [`${siteUrl}/og-image.png`],
  },
  alternates: {
    canonical: `${siteUrl}/video-to-mp3`,
  },
};

const features = [
  {
    icon: "headphones",
    title: "Direct MP3 Extraction",
    description:
      "Strip the audio track directly from any supported video link and save it as an MP3 file. No video data is kept — just clean, portable audio.",
  },
  {
    icon: "layers",
    title: "Multiple Bitrate Options",
    description:
      "Choose from 128kbps for compact file sizes, 192kbps for a balanced option, or 320kbps for maximum fidelity. Select the bitrate that matches your listening needs.",
  },
  {
    icon: "monitor",
    title: "No Software to Install",
    description:
      "Skip the desktop converters and bloated apps. OmniLoad extracts MP3 audio entirely through your web browser — works on any device.",
  },
  {
    icon: "zap",
    title: "Speedy Extraction",
    description:
      "Audio extraction is faster than video processing since only the audio stream is fetched and converted. Most links produce a downloadable MP3 within seconds.",
  },
  {
    icon: "shield",
    title: "Public Content Only",
    description:
      "OmniLoad processes publicly accessible content where you have permission. We encourage responsible use and respect for creators' intellectual property.",
  },
  {
    icon: "star",
    title: "Simple & Intuitive",
    description:
      "No confusing settings or technical knowledge needed. Paste a link, pick MP3, choose your quality, and save. It's that straightforward.",
  },
];

const howToSteps = [
  {
    step: 1,
    title: "Copy the Video Link",
    description:
      "Find the public video containing the audio you have permission to extract. Copy the URL from your browser or the platform's share button.",
  },
  {
    step: 2,
    title: "Paste into OmniLoad",
    description:
      "Drop the video link into the input field. OmniLoad identifies the source and presents available audio options, including MP3 at various bitrates.",
  },
  {
    step: 3,
    title: "Save as MP3",
    description:
      "Select the MP3 option at your preferred bitrate and click to save. The audio file downloads directly to your device — ready to play anywhere.",
  },
];

const faqs = [
  {
    question: "What video sources can I extract MP3 from?",
    answer:
      "OmniLoad supports MP3 extraction from all platforms it supports: YouTube, Instagram, TikTok, Twitter/X, Facebook, Reddit, Pinterest, Vimeo, and more. The video must be publicly accessible and you should have permission to save the content.",
  },
  {
    question: "What bitrate should I choose for MP3?",
    answer:
      "For spoken content like podcasts and lectures, 128kbps is perfectly adequate. For general music listening, 192kbps offers a good balance. For audiophile-quality music where you want maximum detail, choose 320kbps. Higher bitrates produce larger files.",
  },
  {
    question: "Is there a limit on the length of video I can convert?",
    answer:
      "OmniLoad processes videos of typical lengths found on supported platforms. Very long content (multi-hour streams) may take longer to process. The processing time scales with the audio duration but is generally quick for standard content.",
  },
  {
    question: "Will the MP3 have the same quality as the original video's audio?",
    answer:
      "The MP3 output can be as good as the source audio, but never better. If the original video has 128kbps audio, saving at 320kbps won't add quality that wasn't there. OmniLoad extracts the best available audio stream from the source.",
  },
  {
    question: "Can I use the extracted MP3 in my own projects?",
    answer:
      "That depends on the content's copyright and licensing. If you're extracting audio from your own content, Creative Commons material, or content with explicit permission, you're typically fine. Always verify the licensing terms before using extracted audio in your projects.",
  },
];

const relatedPages = [
  { title: "Audio Converter", href: "/audio-converter" },
  { title: "YouTube Video Saver", href: "/youtube-video-downloader" },
  { title: "Instagram Video Saver", href: "/instagram-video-downloader" },
  { title: "TikTok Video Saver", href: "/tiktok-video-downloader" },
  { title: "Facebook Video Saver", href: "/facebook-video-downloader" },
  { title: "Creator Tools", href: "/creator-tools" },
];

export default function VideoToMp3Page() {
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
        platform="Video to MP3 Converter"
        title="Extract MP3 from Videos | Easily"
        subtitle="Convert any video link to a portable MP3 audio file."
        description="Extract MP3 audio from public video links where you have permission. Choose your bitrate, click save, and your audio file is ready — no software needed."
        features={features}
        howToSteps={howToSteps}
        faqs={faqs}
        relatedPages={relatedPages}
      />
    </>
  );
}
