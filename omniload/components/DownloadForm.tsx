"use client";

import { useState, FormEvent } from "react";

interface DownloadFormProps {
  platformName?: string;
  compact?: boolean;
}

export default function DownloadForm({
  platformName,
  compact = false,
}: DownloadFormProps) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      // Simulate API call — replace with actual download API
      const res = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch download options");
      }

      const data = await res.json();
      setResult(data);
    } catch {
      setError(
        "Unable to process this URL. Please check the link and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const placeholder = platformName
    ? `Paste your ${platformName} link here...`
    : "Paste your link here...";

  return (
    <div className={compact ? "" : "mx-auto w-full max-w-3xl"}>
      <div className="relative mb-4">
        <form
          onSubmit={handleSubmit}
          className="group relative flex items-center"
        >
          <div className="absolute left-4 text-[hsl(var(--muted))] transition-colors group-focus-within:text-[hsl(var(--primary))]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m21 21-4.34-4.34" />
              <circle cx="11" cy="11" r="8" />
            </svg>
          </div>
          <input
            id="download-url-input"
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={placeholder}
            className="h-14 w-full rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] pl-12 pr-32 text-base text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted))] transition-all focus:border-[hsl(var(--primary))] focus:bg-[hsl(var(--card-hover))] focus:outline-none focus:ring-4 focus:ring-[hsl(var(--primary)/.2)] sm:h-16 sm:text-lg"
          />
          <button
            id="download-submit-btn"
            type="submit"
            disabled={!url.trim() || loading}
            className="absolute right-2 flex h-10 items-center justify-center gap-2 rounded-xl gradient-bg px-5 text-sm font-bold text-white shadow-lg shadow-[hsl(var(--primary)/.2)] transition-all hover:opacity-90 hover:shadow-xl active:scale-95 disabled:opacity-40 disabled:shadow-none sm:h-12 sm:px-6 sm:text-base"
          >
            {loading ? (
              <svg
                className="h-4 w-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 15V3" />
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <path d="m7 10 5 5 5-5" />
              </svg>
            )}
            <span className="hidden sm:inline">
              {loading ? "Processing..." : "Download"}
            </span>
          </button>
        </form>
        <p className="mt-3 text-center text-xs text-[hsl(var(--muted))]">
          {platformName
            ? `Paste any ${platformName} video or audio URL to download`
            : "Supports YouTube, Instagram, TikTok, Twitter/X, Facebook, Pinterest, Reddit & more"}
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
          <div className="mb-4 flex items-center gap-4">
            <div className="flex h-16 w-24 items-center justify-center rounded-xl bg-[hsl(var(--surface))]">
              <svg
                className="h-8 w-8 text-[hsl(var(--muted))]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"
                />
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[hsl(var(--primary))]">
                {result.platform || "Video"}
              </p>
              <h3 className="text-base font-bold text-[hsl(var(--foreground))]">
                {result.title || "Download Ready"}
              </h3>
            </div>
          </div>

          {result.formats && result.formats.length > 0 ? (
            <div className="space-y-2">
              {result.formats.map((f: any, i: number) => (
                <a
                  key={i}
                  href={f.url}
                  download
                  className="flex items-center justify-between rounded-xl border border-[hsl(var(--border))] p-3 transition-colors hover:bg-[hsl(var(--card-hover))]"
                >
                  <div>
                    <span className="text-sm font-medium text-[hsl(var(--foreground))]">
                      {f.quality || f.format}
                    </span>
                    {f.size && (
                      <span className="ml-2 text-xs text-[hsl(var(--muted-foreground))]">
                        ({f.size})
                      </span>
                    )}
                  </div>
                  <span className="rounded-lg gradient-bg px-3 py-1 text-xs font-bold text-white">
                    Download
                  </span>
                </a>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[hsl(var(--muted-foreground))]">
              No download formats available. Try a different URL.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
