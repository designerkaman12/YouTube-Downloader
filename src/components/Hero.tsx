import DownloaderBox from "@/components/DownloaderBox";

const trustBadges = [
  "100% Free",
  "No Registration",
  "Unlimited Downloads",
  "All Platforms",
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden pb-12 pt-20 md:pb-20 md:pt-28 lg:pt-36">
      {/* Ambient Background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/4 rounded-full bg-primary/8 blur-[150px]" />
        <div className="absolute right-0 top-1/3 h-[300px] w-[300px] rounded-full bg-violet-500/5 blur-[120px]" />
        <div className="absolute left-0 bottom-0 h-[200px] w-[200px] rounded-full bg-indigo-500/5 blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6">
        <div className="mb-12 text-center">
          {/* Pill Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
            20+ Platforms Supported
          </div>

          <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Download Anything{" "}
            <br className="hidden sm:block" />
            from <span className="gradient-text">Anywhere.</span>
          </h1>

          <p className="mx-auto mb-8 max-w-2xl text-base text-muted-foreground md:text-lg">
            The fastest free tool to download videos, audio, and media from
            YouTube, Instagram, TikTok, Twitter, and 20+ platforms. No limits, no signup.
          </p>

          {/* Trust Badges */}
          <div className="mb-10 flex flex-wrap items-center justify-center gap-3">
            {trustBadges.map((badge) => (
              <span
                key={badge}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card/50 px-3 py-1.5 text-xs font-medium text-muted-foreground"
              >
                <svg className="h-3.5 w-3.5 text-success" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {badge}
              </span>
            ))}
          </div>
        </div>

        <DownloaderBox />
      </div>
    </section>
  );
}
