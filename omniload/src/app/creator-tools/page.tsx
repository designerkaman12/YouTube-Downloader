import type { Metadata } from "next";
import SEOPage from "@/components/SEOPage";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://omniload.onrender.com";

export const metadata: Metadata = {
  title: "Creator Tools & Resources | OmniLoad",
  description:
    "Explore tools and resources for content creators. Save, convert, and manage your own media content efficiently with OmniLoad.",
  keywords: [
    "creator tools",
    "content creator resources",
    "media processing tools",
    "video creator toolkit",
    "audio extraction tools",
    "creator workflow",
  ],
  openGraph: {
    title: "Creator Tools & Resources | OmniLoad",
    description:
      "Explore tools and resources for content creators. Save, convert, and manage your own media efficiently.",
    url: `${siteUrl}/creator-tools`,
    siteName: "OmniLoad",
    type: "website",
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "OmniLoad Creator Tools & Resources",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Creator Tools & Resources | OmniLoad",
    description:
      "Tools and resources for content creators. Media processing, format conversion, and more.",
    images: [`${siteUrl}/og-image.png`],
  },
  alternates: {
    canonical: `${siteUrl}/creator-tools`,
  },
};

const features = [
  {
    icon: "wrench",
    title: "Media Processing Suite",
    description:
      "Process your own uploaded content across platforms. Re-download your own videos from YouTube, Instagram, or TikTok in different formats for repurposing.",
  },
  {
    icon: "headphones",
    title: "Audio Extraction Engine",
    description:
      "Pull audio tracks from your own published videos. Create podcast clips, soundbites, or background audio from your existing video content.",
  },
  {
    icon: "layers",
    title: "Multi-Format Support",
    description:
      "Work with MP4, MP3, OGG, WAV, OPUS, and more. Convert between formats to match the requirements of different platforms and editing software.",
  },
  {
    icon: "sparkles",
    title: "Streamlined Creator Workflow",
    description:
      "Repurpose your content across platforms efficiently. Save your own Instagram Reel as an MP4, extract audio for a podcast, or grab a thumbnail — all from one tool.",
  },
  {
    icon: "users",
    title: "Community & Resources",
    description:
      "Join a growing community of creators who use OmniLoad as part of their content pipeline. Share tips, discover workflows, and optimize your creative process.",
  },
  {
    icon: "star",
    title: "Recommended Tools",
    description:
      "Discover complementary tools for editing, scheduling, analytics, and distribution. We curate recommendations that pair well with OmniLoad's media processing.",
  },
];

const howToSteps = [
  {
    step: 1,
    title: "Identify Your Content",
    description:
      "Start with content you've published on social platforms. Copy the link to your own video, reel, or post that you want to repurpose.",
  },
  {
    step: 2,
    title: "Process with OmniLoad",
    description:
      "Paste the link into OmniLoad to extract your content in different formats. Choose video for repurposing or audio for podcast/music use.",
  },
  {
    step: 3,
    title: "Repurpose & Distribute",
    description:
      "Use the processed files in your editing software, upload to new platforms, or archive for future use. One piece of content, multiple outputs.",
  },
];

const faqs = [
  {
    question: "How can OmniLoad help content creators?",
    answer:
      "OmniLoad helps creators repurpose their own content across platforms. If you've posted a video on YouTube, you can re-download it in different formats for Instagram, extract the audio for a podcast, or save it as a backup. It's a single tool for multi-platform content management.",
  },
  {
    question: "Can I use OmniLoad to save other creators' content?",
    answer:
      "You should only save content where you have explicit permission from the creator. This tool is intended for managing your own content, Creative Commons material, or content shared with you for collaboration. Always respect copyright and give proper attribution.",
  },
  {
    question: "What formats work best for repurposing content?",
    answer:
      "MP4 is the universal video format accepted by all platforms. For audio repurposing, MP3 offers maximum compatibility while OGG and OPUS provide better quality-to-size ratios for web use. WAV is ideal when you need lossless audio for professional editing.",
  },
  {
    question: "Will OmniLoad have more creator-focused features in the future?",
    answer:
      "Yes, we're actively developing additional creator tools including batch processing, format presets optimized for specific platforms, and integrations with popular editing and scheduling tools. Stay tuned for updates.",
  },
  {
    question: "Are there recommended tools that pair well with OmniLoad?",
    answer:
      "We're building a curated list of complementary tools for video editing (like DaVinci Resolve, CapCut), audio editing (Audacity, Adobe Podcast), scheduling (Buffer, Later), and analytics. This section will be expanded with detailed recommendations soon.",
  },
];

const relatedPages = [
  { title: "YouTube Video Saver", href: "/youtube-video-downloader" },
  { title: "Instagram Video Saver", href: "/instagram-video-downloader" },
  { title: "TikTok Video Saver", href: "/tiktok-video-downloader" },
  { title: "Audio Converter", href: "/audio-converter" },
  { title: "Video to MP3", href: "/video-to-mp3" },
  { title: "Facebook Video Saver", href: "/facebook-video-downloader" },
];

export default function CreatorToolsPage() {
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
        platform="Creator Tools & Resources"
        title="Creator Toolkit | Built for You"
        subtitle="Repurpose, convert, and manage your own media content."
        description="Tools and resources designed for content creators. Re-download your own uploads, extract audio for podcasts, convert formats for different platforms — all from one place."
        features={features}
        howToSteps={howToSteps}
        faqs={faqs}
        relatedPages={relatedPages}
      />

      {/* ── Recommended Tools Section (Affiliate Placeholder) ── */}
      <section className="border-t border-[var(--border)] py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mb-10 text-center">
            <h2 className="mb-4 text-2xl font-bold tracking-tight sm:text-3xl text-[var(--foreground)]">
              Recommended <span className="gradient-text">Tools</span>
            </h2>
            <p className="mx-auto max-w-xl text-[var(--muted-foreground)]">
              Complementary tools we recommend for content creators. More coming
              soon.
            </p>
          </div>

          <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "Video Editing",
                description:
                  "Professional-grade video editors like DaVinci Resolve and CapCut for polishing your content.",
                icon: "🎬",
              },
              {
                name: "Audio Editing",
                description:
                  "Tools like Audacity and Adobe Podcast for cleaning up extracted audio and creating professional podcasts.",
                icon: "🎙️",
              },
              {
                name: "Social Scheduling",
                description:
                  "Schedule and automate your posts across platforms with tools like Buffer and Later.",
                icon: "📅",
              },
              {
                name: "Thumbnail Design",
                description:
                  "Create eye-catching thumbnails and graphics with Canva, Figma, or Photoshop.",
                icon: "🎨",
              },
              {
                name: "Analytics",
                description:
                  "Track your content performance across platforms with comprehensive analytics dashboards.",
                icon: "📊",
              },
              {
                name: "SEO Tools",
                description:
                  "Optimize your content titles, descriptions, and tags for better discoverability on every platform.",
                icon: "🔍",
              },
            ].map((tool) => (
              <div
                key={tool.name}
                className="card-shine rounded-2xl border border-[var(--border)] bg-[var(--card)]/60 p-5 backdrop-blur-sm transition-all hover:border-[var(--primary)]/30 hover:bg-[var(--card-hover)]"
              >
                <div className="mb-3 text-2xl">{tool.icon}</div>
                <h3 className="mb-2 text-base font-bold text-[var(--foreground)]">
                  {tool.name}
                </h3>
                <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">
                  {tool.description}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-8 text-center text-xs text-[var(--muted)]">
            Specific tool recommendations and affiliate links will be added
            here. Check back for curated picks.
          </p>
        </div>
      </section>
    </>
  );
}
