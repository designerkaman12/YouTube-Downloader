import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { platforms, getPlatformBySlug } from "@/lib/platforms";
import DownloadForm from "@/components/DownloadForm";
import AdBanner from "@/components/ads/AdBanner";
import AdInArticle from "@/components/ads/AdInArticle";
import { AD_SLOTS, SITE_CONFIG } from "@/lib/constants";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return platforms.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const platform = getPlatformBySlug(slug);
  if (!platform) return {};
  
  return {
    title: platform.metaTitle,
    description: platform.metaDescription,
    alternates: { canonical: `${SITE_CONFIG.url}/tools/${slug}` },
    openGraph: {
      title: platform.metaTitle,
      description: platform.metaDescription,
      url: `${SITE_CONFIG.url}/tools/${slug}`,
    },
  };
}

export default async function ToolPage({ params }: PageProps) {
  const { slug } = await params;
  const platform = getPlatformBySlug(slug);
  if (!platform) notFound();

  const relatedPlatforms = platforms
    .filter((p) => p.slug !== slug)
    .slice(0, 8);

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden pb-12 pt-16 md:pb-16 md:pt-24">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div
            className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/4 rounded-full blur-[150px]"
            style={{ backgroundColor: `${platform.color}08` }}
          />
        </div>
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mb-8 text-center">
            <div
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl"
              style={{
                backgroundColor: `${platform.color}15`,
                color: platform.color,
              }}
              dangerouslySetInnerHTML={{ __html: platform.iconSvg }}
            />
            <h1 className="mb-4 text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
              <span style={{ color: platform.color }}>{platform.name}</span>{" "}
              Downloader
            </h1>
            <p className="mx-auto max-w-2xl text-base text-[hsl(var(--muted-foreground))] md:text-lg">
              {platform.description}
            </p>
          </div>

          <DownloadForm platformName={platform.name} />

          {/* Features */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {platform.features.map((f) => (
              <span
                key={f}
                className="rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card)/.5)] px-3 py-1 text-xs font-medium text-[hsl(var(--muted-foreground))]"
              >
                {f}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Top Ad */}
      <div className="container mx-auto px-4 sm:px-6">
        <AdBanner slot={AD_SLOTS.banner_top} />
      </div>

      {/* How to Download */}
      <section className="py-16">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="mb-8 text-center text-2xl font-bold sm:text-3xl">
            How to Download{" "}
            <span className="gradient-text">{platform.name}</span> Videos
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {platform.howTo.map((step, i) => (
              <div
                key={i}
                className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl gradient-bg text-white text-sm font-bold">
                  {i + 1}
                </div>
                <h3 className="mb-2 text-base font-bold">{step.step}</h3>
                <p className="text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* In-Article Ad */}
      <div className="container mx-auto max-w-4xl px-4 sm:px-6">
        <AdInArticle />
      </div>

      {/* Supported Formats */}
      <section className="py-16">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="mb-8 text-center text-2xl font-bold sm:text-3xl">
            Supported Formats
          </h2>
          <div className="overflow-hidden rounded-2xl border border-[hsl(var(--border))]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[hsl(var(--border))] bg-[hsl(var(--surface))]">
                  <th className="px-6 py-4 text-left font-semibold">Format</th>
                  <th className="px-6 py-4 text-left font-semibold">Type</th>
                  <th className="px-6 py-4 text-left font-semibold">Quality</th>
                </tr>
              </thead>
              <tbody>
                {platform.formats.map((f) => (
                  <tr
                    key={f}
                    className="border-b border-[hsl(var(--border))] last:border-0"
                  >
                    <td className="px-6 py-3 font-medium">{f}</td>
                    <td className="px-6 py-3 text-[hsl(var(--muted-foreground))]">
                      {["MP3", "M4A", "OGG", "WAV", "OPUS", "FLAC"].includes(f)
                        ? "Audio"
                        : ["JPG", "PNG", "GIF"].includes(f)
                        ? "Image"
                        : "Video"}
                    </td>
                    <td className="px-6 py-3 text-[hsl(var(--muted-foreground))]">
                      {["MP3", "M4A", "OGG", "WAV", "OPUS", "FLAC"].includes(f)
                        ? "Up to 320kbps"
                        : ["JPG", "PNG"].includes(f)
                        ? "Original resolution"
                        : "Up to 8K"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="mb-8 text-center text-2xl font-bold sm:text-3xl">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {platform.faqs.map(({ question, answer }) => (
              <details
                key={question}
                className="group overflow-hidden rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]"
              >
                <summary className="flex w-full cursor-pointer items-center justify-between px-6 py-5 text-left list-none">
                  <span className="pr-4 text-sm font-semibold sm:text-base">
                    {question}
                  </span>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="shrink-0 text-[hsl(var(--muted-foreground))] transition-transform group-open:rotate-180"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </summary>
                <div className="px-6 pb-5">
                  <p className="text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
                    {answer}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Ad */}
      <div className="container mx-auto px-4 sm:px-6">
        <AdBanner slot={AD_SLOTS.banner_bottom} />
      </div>

      {/* Related Tools */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="mb-8 text-center text-2xl font-bold sm:text-3xl">
            More <span className="gradient-text">Downloaders</span>
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {relatedPlatforms.map((p) => (
              <Link
                key={p.slug}
                href={`/tools/${p.slug}`}
                className="card-shine group rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 transition-all hover:-translate-y-0.5 hover:bg-[hsl(var(--card-hover))] hover:shadow-lg"
              >
                <div
                  className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg transition-transform group-hover:scale-110"
                  style={{
                    backgroundColor: `${p.color}10`,
                    color: p.color,
                  }}
                  dangerouslySetInnerHTML={{ __html: p.iconSvg }}
                />
                <h3 className="text-xs font-bold">{p.name}</h3>
                <p className="text-[10px] text-[hsl(var(--muted-foreground))]">
                  {p.tagline}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: platform.faqs.map((f) => ({
              "@type": "Question",
              name: f.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: f.answer,
              },
            })),
          }),
        }}
      />
    </div>
  );
}
