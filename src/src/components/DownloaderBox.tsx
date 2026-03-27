"use client";

import { useState } from 'react';
import { Search, Loader2, Download, Play, Video, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DownloaderBox() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'video' | 'audio'>('all');

  const handleDownloadRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`/api/info?url=${encodeURIComponent(url.trim())}`);
      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to fetch media information. Please check your link and try again.');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getDownloadUrl = (format: any) => {
    const safeTitle = (result.title || 'download').replace(/[^a-zA-Z0-9 ]/g, '').substring(0, 60);
    const filename = `${safeTitle}_${format.quality}.${format.extension}`;
    if (result.source === 'cobalt' && format.cobaltOptions) {
      const opts = encodeURIComponent(JSON.stringify(format.cobaltOptions));
      return `/api/stream?url=${encodeURIComponent(url)}&cobaltOptions=${opts}&filename=${encodeURIComponent(filename)}`;
    }
    if (format.url) {
      return `/api/proxy?url=${encodeURIComponent(format.url)}&filename=${encodeURIComponent(filename)}`;
    }
    return `/api/stream?url=${encodeURIComponent(url)}&itag=${format.itag}&filename=${encodeURIComponent(filename)}`;
  };

  const filteredFormats = result?.formats?.filter((f: any) => {
    if (activeTab === 'video') return f.type === 'video';
    if (activeTab === 'audio') return f.type === 'audio';
    return true;
  }) || [];

  const formatDuration = (seconds: number) => {
    if (!seconds) return '';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="mx-auto w-full max-w-3xl">
      {/* Search Bar */}
      <div className="relative mb-8">
        <form onSubmit={handleDownloadRequest} className="group relative flex items-center">
          <div className="absolute left-4 text-muted transition-colors group-focus-within:text-primary">
            <Search size={20} />
          </div>
          <input
            id="download-url-input"
            type="text"
            placeholder="Paste your link here..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="h-14 w-full rounded-2xl border border-border bg-card pl-12 pr-32 text-base text-foreground placeholder:text-muted ring-primary/20 transition-all focus:border-primary focus:bg-card-hover focus:outline-none focus:ring-4 sm:h-16 sm:text-lg"
          />
          <button
            id="download-submit-btn"
            type="submit"
            disabled={isLoading || !url.trim()}
            className="absolute right-2 flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-hover hover:shadow-xl hover:shadow-primary/30 active:scale-95 disabled:opacity-40 disabled:shadow-none sm:h-12 sm:px-6 sm:text-base"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <>
                <Download size={16} />
                <span className="hidden sm:inline">Download</span>
              </>
            )}
          </button>
        </form>

        {/* Supported platforms hint */}
        <p className="mt-3 text-center text-xs text-muted">
          Supports YouTube, Instagram, TikTok, Twitter/X, Facebook, Pinterest, Reddit & more
        </p>
      </div>

      <AnimatePresence mode="wait">
        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-6 flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/5 p-4"
          >
            <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500/20 text-red-400">
              <span className="text-xs">!</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-red-400">{error}</p>
              <button
                onClick={handleDownloadRequest as any}
                className="mt-2 text-xs font-medium text-red-400/80 underline underline-offset-2 transition-colors hover:text-red-300"
              >
                Try again
              </button>
            </div>
          </motion.div>
        )}

        {/* Loading Skeleton */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="overflow-hidden rounded-2xl border border-border bg-card p-6"
          >
            <div className="flex flex-col gap-5 sm:flex-row">
              <div className="aspect-video w-full animate-pulse rounded-xl bg-surface sm:w-48" />
              <div className="flex-1 space-y-3">
                <div className="h-4 w-24 animate-pulse rounded bg-surface" />
                <div className="h-6 w-full animate-pulse rounded bg-surface" />
                <div className="h-4 w-40 animate-pulse rounded bg-surface" />
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-16 animate-pulse rounded-xl bg-surface" />
              ))}
            </div>
          </motion.div>
        )}

        {/* Results */}
        {result && !isLoading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-black/20"
          >
            {/* Media Info Header */}
            <div className="flex flex-col gap-5 p-5 sm:flex-row sm:p-6">
              {/* Thumbnail */}
              <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-xl bg-surface sm:w-52">
                {result.thumbnail && (
                  <img
                    src={`/api/thumbnail?url=${encodeURIComponent(result.thumbnail)}`}
                    alt={result.title}
                    className="h-full w-full object-cover"
                  />
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm">
                    <Play fill="currentColor" size={16} />
                  </div>
                </div>
                {result.duration ? (
                  <div className="absolute bottom-2 right-2 rounded-md bg-black/70 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
                    {typeof result.duration === 'number' ? formatDuration(result.duration) : result.duration}
                  </div>
                ) : null}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <span className="mb-2 inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                  {result.platform}
                </span>
                <h3 className="mb-1 text-base font-bold leading-snug text-foreground line-clamp-2 sm:text-lg">
                  {result.title}
                </h3>
                <p className="text-sm text-muted-foreground">{result.author}</p>
              </div>
            </div>

            {/* Tab Filter */}
            <div className="flex gap-1 border-t border-border px-5 pt-4 sm:px-6">
              {(['all', 'video', 'audio'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                    activeTab === tab
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-surface hover:text-foreground'
                  }`}
                >
                  {tab === 'video' && <Video size={12} />}
                  {tab === 'audio' && <Music size={12} />}
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
              <span className="ml-auto self-center text-[10px] text-muted">
                {filteredFormats.length} options
              </span>
            </div>

            {/* Format List */}
            <div className="grid grid-cols-1 gap-2 p-5 sm:grid-cols-2 sm:p-6">
              {filteredFormats.map((format: any, idx: number) => (
                <a
                  key={idx}
                  href={getDownloadUrl(format)}
                  id={`download-format-${idx}`}
                  className="group flex items-center justify-between rounded-xl border border-border bg-surface/50 p-3.5 transition-all hover:border-primary/40 hover:bg-surface active:scale-[0.98]"
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold ${
                      format.type === 'video'
                        ? 'bg-primary/10 text-primary'
                        : 'bg-emerald-500/10 text-emerald-400'
                    }`}>
                      {format.type === 'video' ? <Video size={15} /> : <Music size={15} />}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-foreground">{format.quality}</div>
                      <div className="text-[10px] text-muted-foreground">
                        {format.extension?.toUpperCase()}{format.size ? ` • ${format.size}` : ''}{format.hasAudio === false ? ' • No Audio' : ''}
                      </div>
                    </div>
                  </div>
                  <Download size={16} className="text-muted transition-colors group-hover:text-primary" />
                </a>
              ))}

              {filteredFormats.length === 0 && (
                <div className="col-span-full py-6 text-center text-sm text-muted">
                  No {activeTab} formats available. Try a different filter.
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
