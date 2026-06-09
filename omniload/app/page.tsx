import Link from "next/link";
import { platforms } from "@/lib/platforms";
import DownloadForm from "@/components/DownloadForm";
import AdBanner from "@/components/ads/AdBanner";
import { AD_SLOTS } from "@/lib/constants";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pb-12 pt-20 md:pb-20 md:pt-28 lg:pt-36">
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/4 rounded-full bg-[hsl(var(--primary)/.08)] blur-[150px]" />
          <div className="absolute right-0 top-1/3 h-[300px] w-[300px] rounded-full bg-violet-500/5 blur-[120px]" />
          <div className="absolute left-0 bottom-0 h-[200px] w-[200px] rounded-full bg-indigo-500/5 blur-[100px]" />
        </div>

        <div className="container mx-auto px-4 sm:px-6">
          <div className="mb-12 text-center animate-fade-in-up">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 py-1.5 text-xs font-medium text-[hsl(var(--muted-foreground))]">
              <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--success))] animate-pulse" />
              20+ Platforms Supported
            </div>
            <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Download Anything
              <br className="hidden sm:block" /> from{" "}
              <span className="gradient-text">Anywhere.</span>
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-base text-[hsl(var(--muted-foreground))] md:text-lg">
              The fastest free tool to download videos, audio, and media from
              YouTube, Instagram, TikTok, Twitter, and all major platforms. No
              limits, no signup.
            </p>

            {/* Trust badges */}
            <div className="mb-10 flex flex-wrap items-center justify-center gap-3">
              {["100% Free", "No Registration", "Unlimited Downloads", "All Platforms"].map(
                (badge) => (
                  <span
                    key={badge}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card)/.5)] px-3 py-1.5 text-xs font-medium text-[hsl(var(--muted-foreground))]"
                  >
                    <svg
                      className="h-3.5 w-3.5 text-[hsl(var(--success))]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {badge}
                  </span>
                )
              )}
            </div>
          </div>

          <div className="animate-fade-in-up-delay-1">
            <DownloadForm />
          </div>
        </div>
      </section>

      {/* Ad Banner */}
      <AdBanner slot={AD_SLOTS.banner_top} />

      {/* Stats Section */}
      <section className="border-y border-[hsl(var(--border))] bg-[hsl(var(--surface)/.5)] py-14">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { value: "20+", label: "Platforms Supported" },
              { value: "∞", label: "Unlimited Downloads" },
              { value: "8K", label: "Max Quality" },
              { value: "100%", label: "Free Forever" },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="mb-1 text-3xl font-black tracking-tight text-[hsl(var(--foreground))] sm:text-4xl">
                  {value}
                </div>
                <div className="text-xs font-medium uppercase tracking-widest text-[hsl(var(--muted-foreground))]">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platforms Section */}
      <section id="tools" className="py-20 sm:py-28">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              All Your <span className="gradient-text">Platforms</span>, One
              Tool
            </h2>
            <p className="mx-auto max-w-xl text-base text-[hsl(var(--muted-foreground))]">
              Download videos, audio, and media from the most popular platforms.
              Paste any link and go.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {platforms.map((platform) => (
              <Link
                key={platform.slug}
                href={`/tools/${platform.slug}`}
                className="card-shine group relative rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[hsl(var(--card-hover))] hover:shadow-xl hover:shadow-black/10"
              >
                {platform.popular && (
                  <span className="absolute right-2.5 top-2.5 rounded-full bg-[hsl(var(--primary)/.1)] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[hsl(var(--primary))]">
                    Popular
                  </span>
                )}
                <div
                  className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl transition-transform group-hover:scale-110"
                  style={{
                    backgroundColor: `${platform.color}10`,
                    color: platform.color,
                  }}
                  dangerouslySetInnerHTML={{ __html: platform.iconSvg }}
                />
                <h3 className="text-sm font-bold text-[hsl(var(--foreground))]">
                  {platform.name}
                </h3>
                <p className="mt-0.5 text-[11px] leading-relaxed text-[hsl(var(--muted-foreground))]">
                  {platform.tagline}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 sm:py-28">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mb-14 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="mx-auto max-w-lg text-base text-[hsl(var(--muted-foreground))]">
              Download any media in three simple steps. No technical knowledge
              required.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                num: "01",
                title: "Paste Your Link",
                desc: "Copy the URL of any video or audio from any supported platform and paste it into the input box.",
                icon: "M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.915-3.071a4.5 4.5 0 00-1.242-7.244l-4.5-4.5a4.5 4.5 0 00-6.364 6.364L4.343 8.07",
              },
              {
                num: "02",
                title: "Choose Quality",
                desc: "Select your preferred format and quality — from 360p to 8K for video, or MP3/WAV for audio.",
                icon: "M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75",
              },
              {
                num: "03",
                title: "Download Instantly",
                desc: "Click download and the file is saved directly to your device. No signup or installation needed.",
                icon: "M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3",
              },
            ].map(({ num, title, desc, icon }) => (
              <div
                key={num}
                className="group relative rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-8 transition-all hover:border-[hsl(var(--primary)/.3)] hover:bg-[hsl(var(--card-hover))]"
              >
                <span className="mb-5 block text-[40px] font-black leading-none text-[hsl(var(--border))]">
                  {num}
                </span>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[hsl(var(--primary)/.1)] text-[hsl(var(--primary))] transition-transform group-hover:scale-110">
                  <svg
                    className="h-7 w-7"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d={icon}
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-bold">{title}</h3>
                <p className="text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ad Banner */}
      <div className="container mx-auto px-4 sm:px-6">
        <AdBanner slot={AD_SLOTS.banner_bottom} />
      </div>

      {/* FAQ Section */}
      <section id="faq" className="py-20 sm:py-28">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6">
          <div className="mb-14 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Frequently Asked{" "}
              <span className="gradient-text">Questions</span>
            </h2>
            <p className="mx-auto max-w-lg text-base text-[hsl(var(--muted-foreground))]">
              Everything you need to know about using OmniLoad.
            </p>
          </div>
          <div className="space-y-3">
            <FAQItems />
          </div>
        </div>
      </section>
    </div>
  );
}

function FAQItems() {
  const faqs = [
    {
      q: "Is OmniLoad completely free to use?",
      a: "Yes, OmniLoad is 100% free with no hidden costs or premium tiers. You can download unlimited videos and audio files without any registration or payment.",
    },
    {
      q: "What platforms does OmniLoad support?",
      a: "OmniLoad supports 20+ platforms including YouTube, Instagram, TikTok, Twitter/X, Facebook, Pinterest, Reddit, Vimeo, Snapchat, Threads, Spotify, SoundCloud, LinkedIn, Twitch, Dailymotion, Bilibili, Tumblr, VK, Likee, and Bandcamp.",
    },
    {
      q: "What quality options are available?",
      a: "We support a wide range of qualities from 360p all the way up to 8K Ultra HD for video. For audio, we support MP3 (128kbps-320kbps), OGG, WAV, and OPUS formats.",
    },
    {
      q: "Do I need to install any software?",
      a: "No, OmniLoad works entirely in your web browser. Just paste a link and download — no software, browser extensions, or apps needed.",
    },
    {
      q: "Is it safe to use OmniLoad?",
      a: "Yes, OmniLoad is completely safe. We don't store any of your downloads or personal information. All processing happens in real-time and we use secure HTTPS connections.",
    },
    {
      q: "Can I download private or restricted videos?",
      a: "No, OmniLoad can only download publicly available content. We respect creators' privacy settings and copyright protections.",
    },
  ];

  return (
    <>
      {faqs.map(({ q, a }) => (
        <details
          key={q}
          className="group overflow-hidden rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] transition-colors hover:bg-[hsl(var(--card-hover))]"
        >
          <summary className="flex w-full cursor-pointer items-center justify-between px-6 py-5 text-left list-none">
            <span className="pr-4 text-sm font-semibold text-[hsl(var(--foreground))] sm:text-base">
              {q}
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0 text-[hsl(var(--muted-foreground))] transition-transform duration-200 group-open:rotate-180"
              aria-hidden="true"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </summary>
          <div className="px-6 pb-5">
            <p className="text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
              {a}
            </p>
          </div>
        </details>
      ))}
    </>
  );
}
