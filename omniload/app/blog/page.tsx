import { Metadata } from "next";
import Link from "next/link";
import { blogPosts } from "@/lib/blog-data";
import AdBanner from "@/components/ads/AdBanner";
import { AD_SLOTS, SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Blog — Video Download Guides & Tips",
  description:
    "Learn how to download videos from YouTube, Instagram, TikTok, and more. Free guides, tips, and comparisons.",
  alternates: { canonical: `${SITE_CONFIG.url}/blog` },
};

export default function BlogPage() {
  return (
    <div className="py-16 sm:py-24">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
            OmniLoad <span className="gradient-text">Blog</span>
          </h1>
          <p className="mx-auto max-w-xl text-base text-[hsl(var(--muted-foreground))]">
            Guides, tips, and how-to articles for downloading videos and audio
            from all major platforms.
          </p>
        </div>

        {/* Top Ad */}
        <AdBanner slot={AD_SLOTS.banner_top} />

        {/* Blog Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 transition-all hover:-translate-y-1 hover:bg-[hsl(var(--card-hover))] hover:shadow-xl hover:shadow-black/10"
            >
              <div className="mb-3 flex items-center gap-3 text-xs text-[hsl(var(--muted-foreground))]">
                <span className="rounded-full bg-[hsl(var(--primary)/.1)] px-2.5 py-0.5 font-semibold text-[hsl(var(--primary))]">
                  {post.category}
                </span>
                <span>{post.readTime}</span>
              </div>
              <h2 className="mb-2 text-lg font-bold leading-tight text-[hsl(var(--foreground))] group-hover:text-[hsl(var(--primary))] transition-colors">
                {post.title}
              </h2>
              <p className="text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
                {post.excerpt}
              </p>
              <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-[hsl(var(--primary))]">
                Read More
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-transform group-hover:translate-x-1"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom Ad */}
        <AdBanner slot={AD_SLOTS.banner_bottom} className="mt-12" />
      </div>
    </div>
  );
}
