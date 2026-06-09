import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { blogPosts, getBlogPostBySlug } from "@/lib/blog-data";
import AdBanner from "@/components/ads/AdBanner";
import AdInArticle from "@/components/ads/AdInArticle";
import { AD_SLOTS, SITE_CONFIG } from "@/lib/constants";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.metaTitle,
    description: post.metaDescription,
    alternates: { canonical: `${SITE_CONFIG.url}/blog/${slug}` },
    openGraph: {
      title: post.metaTitle,
      description: post.metaDescription,
      type: "article",
      publishedTime: post.date,
      url: `${SITE_CONFIG.url}/blog/${slug}`,
    },
  };
}

export default async function BlogArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  const relatedPosts = blogPosts.filter((p) => p.slug !== slug).slice(0, 3);

  // Split content for ad injection
  const paragraphs = post.content.split("\n\n");
  const midPoint = Math.floor(paragraphs.length / 2);
  const firstHalf = paragraphs.slice(0, midPoint).join("\n\n");
  const secondHalf = paragraphs.slice(midPoint).join("\n\n");

  return (
    <article className="py-12 sm:py-20">
      <div className="container mx-auto max-w-3xl px-4 sm:px-6">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-xs text-[hsl(var(--muted-foreground))]">
          <Link href="/" className="hover:text-[hsl(var(--foreground))]">
            Home
          </Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-[hsl(var(--foreground))]">
            Blog
          </Link>
          <span>/</span>
          <span className="text-[hsl(var(--foreground))]">{post.category}</span>
        </nav>

        {/* Header */}
        <header className="mb-10">
          <div className="mb-4 flex items-center gap-3 text-xs text-[hsl(var(--muted-foreground))]">
            <span className="rounded-full bg-[hsl(var(--primary)/.1)] px-2.5 py-0.5 font-semibold text-[hsl(var(--primary))]">
              {post.category}
            </span>
            <span>{post.readTime}</span>
            <span>•</span>
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-[2.5rem] leading-tight">
            {post.title}
          </h1>
        </header>

        {/* Top Ad */}
        <AdBanner slot={AD_SLOTS.banner_top} />

        {/* Article Content — First Half */}
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: markdownToHtml(firstHalf) }}
        />

        {/* In-Article Ad */}
        <AdInArticle />

        {/* Article Content — Second Half */}
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: markdownToHtml(secondHalf) }}
        />

        {/* FAQ Section */}
        {post.faqs.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-6 text-2xl font-bold">
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {post.faqs.map(({ question, answer }) => (
                <details
                  key={question}
                  className="group rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]"
                >
                  <summary className="flex cursor-pointer items-center justify-between px-5 py-4 list-none">
                    <span className="pr-4 text-sm font-semibold">
                      {question}
                    </span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="shrink-0 text-[hsl(var(--muted-foreground))] transition-transform group-open:rotate-180"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </summary>
                  <div className="px-5 pb-4">
                    <p className="text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
                      {answer}
                    </p>
                  </div>
                </details>
              ))}
            </div>

            {/* FAQ Structured Data */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  mainEntity: post.faqs.map((f) => ({
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
          </section>
        )}

        {/* Bottom Ad */}
        <AdBanner slot={AD_SLOTS.banner_bottom} className="mt-12" />

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-6 text-2xl font-bold">Related Articles</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {relatedPosts.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="group rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 transition-all hover:bg-[hsl(var(--card-hover))]"
                >
                  <span className="text-[10px] font-semibold text-[hsl(var(--primary))]">
                    {p.category}
                  </span>
                  <h3 className="mt-1 text-sm font-bold leading-tight group-hover:text-[hsl(var(--primary))]">
                    {p.title}
                  </h3>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}

/**
 * Simple markdown-to-HTML converter for blog content
 */
function markdownToHtml(md: string): string {
  let html = md
    // Headers
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    // Bold
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    // Italic
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    // Links
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
    // Unordered lists
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    // Ordered lists
    .replace(/^\d+\. (.+)$/gm, "<li>$1</li>")
    // Tables
    .replace(/\|(.+)\|/g, (match) => {
      const cells = match
        .split("|")
        .filter((c) => c.trim())
        .map((c) => c.trim());
      if (cells.every((c) => /^[-:]+$/.test(c))) return "";
      return `<tr>${cells.map((c) => `<td>${c}</td>`).join("")}</tr>`;
    })
    // Paragraphs
    .replace(/^(?!<[hluot])((?!<).+)$/gm, "<p>$1</p>")
    // Fix empty paragraphs
    .replace(/<p><\/p>/g, "")
    // Wrap list items
    .replace(/(<li>[\s\S]*?<\/li>)/g, "$1");

  // Wrap consecutive <li> in <ul>
  html = html.replace(
    /(<li>[\s\S]*?<\/li>(\s*<li>[\s\S]*?<\/li>)*)/g,
    "<ul>$1</ul>"
  );

  // Wrap consecutive <tr> in <table>
  html = html.replace(
    /(<tr>[\s\S]*?<\/tr>(\s*<tr>[\s\S]*?<\/tr>)*)/g,
    '<table class="w-full">$1</table>'
  );

  // Fix first row as header
  html = html.replace(
    /<table class="w-full"><tr>([\s\S]*?)<\/tr>/,
    (_, cells) => {
      const headerCells = cells.replace(/<td>/g, "<th>").replace(/<\/td>/g, "</th>");
      return `<table class="w-full"><thead><tr>${headerCells}</tr></thead><tbody>`;
    }
  );
  html = html.replace(/<\/table>/g, "</tbody></table>");

  return html;
}
