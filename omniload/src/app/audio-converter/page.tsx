import type { Metadata } from "next";
import SEOPage from "@/components/SEOPage";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://omniload.onrender.com";

export const metadata: Metadata = {
  title: "Online Audio Converter | OmniLoad",
  description:
    "Convert media links to audio formats like MP3, OGG, WAV, and OPUS. Extract audio from public media where you have permission using OmniLoad.",
  keywords: [
    "online audio converter",
    "convert to mp3",
    "audio extractor",
    "video to audio",
    "mp3 converter online",
    "ogg converter",
    "wav converter",
    "opus converter",
  ],
  openGraph: {
    title: "Online Audio Converter | OmniLoad",
    description:
      "Convert media links to MP3, OGG, WAV, and OPUS. Extract audio from public content where you have permission.",
    url: `${siteUrl}/audio-converter`,
    siteName: "OmniLoad",
    type: "website",
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "OmniLoad Online Audio Converter",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Online Audio Converter | OmniLoad",
    description:
      "Convert media links to MP3, OGG, WAV, and OPUS. Free, fast, browser-based.",
    images: [`${siteUrl}/og-image.png`],
  },
  alternates: {
    canonical: `${siteUrl}/audio-converter`,
  },
};

const features = [
  {
    icon: "music",
    title: "Multiple Audio Formats",
    description:
      "Convert to MP3 for universal compatibility, OGG for open-source workflows, WAV for lossless fidelity, or OPUS for efficient compression. Pick the format that fits your project.",
  },
  {
    icon: "layers",
    title: "Quality Settings",
    description:
      "Choose bitrate options from efficient 128kbps to studio-grade 320kbps for MP3 output. Higher bitrates preserve more audio detail for critical listening.",
  },
  {
    icon: "zap",
    title: "Fast Conversion Pipeline",
    description:
      "Our server-side conversion engine processes audio extraction quickly. Most links produce downloadable audio files within seconds.",
  },
  {
    icon: "monitor",
    title: "No Software Needed",
    description:
      "Forget installing Audacity, FFmpeg, or other desktop tools. OmniLoad handles audio conversion entirely in the cloud through your browser.",
  },
  {
    icon: "globe",
    title: "Multi-Platform Links",
    description:
      "Extract audio from YouTube, Instagram, TikTok, Twitter, Facebook, and other supported platforms — all from a single tool.",
  },
  {
    icon: "shield",
    title: "Free to Use",
    description:
      "No premium tiers, no credit card prompts. Audio conversion is available at no cost with no usage restrictions on the number of conversions.",
  },
];

const howToSteps = [
  {
    step: 1,
    title: "Copy the Media Link",
    description:
      "Find the public video or audio content you have permission to convert. Copy the URL from your browser or the platform's share feature.",
  },
  {
    step: 2,
    title: "Paste & Analyze",
    description:
      "Drop the link into OmniLoad's input field. The system analyzes the content and presents available audio formats and quality options.",
  },
  {
    step: 3,
    title: "Select Format & Convert",
    description:
      "Choose your desired audio format (MP3, OGG, WAV, or OPUS) and preferred quality level, then save the converted audio to your device.",
  },
];

const faqs = [
  {
    question: "What audio formats does OmniLoad support for conversion?",
    answer:
      "OmniLoad supports four primary audio output formats: MP3 (the universal standard), OGG Vorbis (open-source, great quality-to-size ratio), WAV (uncompressed lossless audio), and OPUS (modern codec with excellent compression). The available formats may vary depending on the source content.",
  },
  {
    question: "What's the difference between 128kbps and 320kbps?",
    answer:
      "Bitrate determines audio quality and file size. 128kbps produces smaller files suitable for casual listening and spoken content like podcasts. 320kbps is the highest standard MP3 bitrate, offering near-CD quality that's ideal for music. Higher bitrate means larger files but better sound reproduction.",
  },
  {
    question: "Can I extract audio from any platform's videos?",
    answer:
      "OmniLoad can extract audio from videos on all supported platforms, including YouTube, Instagram, TikTok, Twitter/X, Facebook, and more. The video must be publicly accessible, and you should have permission to save the content.",
  },
  {
    question: "Is the audio quality limited by the source video?",
    answer:
      "Yes, the output quality can never exceed the source. If a video contains 128kbps audio, selecting 320kbps won't improve the actual quality — it would just create a larger file. OmniLoad retrieves the best available audio from the source content.",
  },
  {
    question: "Do I need to install any browser extensions?",
    answer:
      "No. OmniLoad is a web application that runs entirely in your browser. No extensions, plugins, or desktop software are needed. Just visit the site, paste a link, and convert.",
  },
];

const relatedPages = [
  { title: "Video to MP3", href: "/video-to-mp3" },
  { title: "YouTube Video Saver", href: "/youtube-video-downloader" },
  { title: "Instagram Video Saver", href: "/instagram-video-downloader" },
  { title: "TikTok Video Saver", href: "/tiktok-video-downloader" },
  { title: "X (Twitter) Video Saver", href: "/twitter-video-downloader" },
  { title: "Creator Tools", href: "/creator-tools" },
];

export default function AudioConverterPage() {
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
        platform="Online Audio Converter"
        title="Convert Media to Audio | Any Format"
        subtitle="Extract audio from video links in MP3, OGG, WAV, and OPUS."
        description="Convert public media links to your preferred audio format where you have permission. From podcasts to music, choose the bitrate and format that suit your workflow."
        features={features}
        howToSteps={howToSteps}
        faqs={faqs}
        relatedPages={relatedPages}
      />
    </>
  );
}
