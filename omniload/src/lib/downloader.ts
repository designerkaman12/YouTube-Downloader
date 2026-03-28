/**
 * DOWNLOADER UTILITY LIBRARY
 * Handles platform detection, API calls (RapidAPI primary, Cobalt optional), and format processing.
 */

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || '';
const API_HOST = 'auto-download-all-in-one.p.rapidapi.com';
const COBALT_API_URL = process.env.COBALT_API_URL || '';

// ─── COBALT API INSTANCES (optional, only used if configured) ───
const COBALT_INSTANCES = [
    COBALT_API_URL,
].filter(Boolean).map(url => url.replace(/\/$/, ''));

// ─── TYPES ───────────────────────────────────────────────────

export interface DownloadFormat {
    quality: string;
    url: string;
    extension: string;
    type: 'video' | 'audio' | 'other';
    size: string;
    audioAvailable: boolean;
    hasAudio?: boolean;
    cobaltOptions?: any;
    itag?: string;
}

export interface DownloaderResult {
    success: boolean;
    platform: string;
    title: string;
    author: string;
    thumbnail: string;
    duration: number | string;
    formats: DownloadFormat[];
    source: string;
    url: string;
}

// ─── PLATFORM DETECTION ──────────────────────────────────────

export function detectPlatform(url: string): string {
    try {
        const host = new URL(url).hostname.toLowerCase();
        if (host.includes('youtube.com') || host.includes('youtu.be')) return 'YouTube';
        if (host.includes('instagram.com')) return 'Instagram';
        if (host.includes('tiktok.com')) return 'TikTok';
        if (host.includes('twitter.com') || host.includes('x.com')) return 'Twitter/X';
        if (host.includes('facebook.com') || host.includes('fb.watch') || host.includes('fb.com')) return 'Facebook';
        if (host.includes('pinterest.com') || host.includes('pin.it')) return 'Pinterest';
        if (host.includes('vimeo.com')) return 'Vimeo';
        if (host.includes('dailymotion.com') || host.includes('dai.ly')) return 'Dailymotion';
        if (host.includes('reddit.com') || host.includes('redd.it')) return 'Reddit';
        if (host.includes('snapchat.com')) return 'Snapchat';
        if (host.includes('threads.net')) return 'Threads';
        if (host.includes('linkedin.com')) return 'LinkedIn';
        return 'Other';
    } catch {
        return 'Unknown';
    }
}

export function isYouTube(url: string): boolean {
    return detectPlatform(url) === 'YouTube';
}

// ─── API CALLS ───────────────────────────────────────────────

/**
 * Call Cobalt API (only if a custom instance URL is configured via env)
 */
export async function callCobaltAPI(url: string, options: any = {}): Promise<any> {
    if (COBALT_INSTANCES.length === 0) {
        throw new Error('No Cobalt API instance configured.');
    }

    const body = { url, ...options };
    let lastError: any = null;

    for (const cobaltUrl of COBALT_INSTANCES) {
        console.log(`  🔷 Trying Cobalt API: POST ${cobaltUrl}/`);
        
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 12000);

        try {
            const response = await fetch(`${cobaltUrl}/`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
                signal: controller.signal
            });

            clearTimeout(timeout);

            if (!response.ok) {
                const text = await response.text();
                throw new Error(`Instance returned ${response.status}: ${text.substring(0, 100)}`);
            }

            const data = await response.json();
            
            if (data.status === 'error') {
                throw new Error(`Cobalt error: ${data.error?.code || 'unknown'}`);
            }

            console.log(`  ✅ Success with ${cobaltUrl}`);
            return data;

        } catch (err: any) {
            clearTimeout(timeout);
            console.warn(`  ⚠️ Failed (${cobaltUrl}): ${err.name === 'AbortError' ? 'Timeout' : err.message}`);
            lastError = err;
        }
    }

    throw new Error(`Cobalt API failed. ${lastError?.message}`);
}

/**
 * Call RapidAPI — primary download method for ALL platforms
 */
export async function callRapidAPI(url: string): Promise<any> {
    if (!RAPIDAPI_KEY) {
        throw new Error('RAPIDAPI_KEY is not configured. Please set it in environment variables.');
    }

    const apiUrl = `https://${API_HOST}/v1/social/autolink`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 45000);

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-rapidapi-host': API_HOST,
                'x-rapidapi-key': RAPIDAPI_KEY
            },
            body: JSON.stringify({ url }),
            signal: controller.signal
        });

        clearTimeout(timeout);

        if (response.status === 403) throw new Error('API subscription required. Check your RapidAPI key.');
        if (response.status === 429) throw new Error('API rate limit reached. Please try again later.');
        if (!response.ok) {
            const text = await response.text();
            throw new Error(`API error (${response.status}): ${text.substring(0, 200)}`);
        }

        return await response.json();
    } catch (err: any) {
        clearTimeout(timeout);
        if (err.name === 'AbortError') throw new Error('API request timed out. Please try again.');
        throw err;
    }
}

// ─── DATA PROCESSING ─────────────────────────────────────────

/**
 * Get info for ANY platform via RapidAPI (primary method)
 */
export function processRapidAPIResult(apiData: any, platform: string, originalUrl: string): DownloaderResult {
    const title = apiData.title || 'Unknown Title';
    const author = apiData.author || apiData.source || platform;
    const thumbnail = apiData.thumbnail || '';
    const duration = apiData.duration || '';

    const formats: DownloadFormat[] = [];

    if (apiData.medias && Array.isArray(apiData.medias)) {
        apiData.medias.forEach((media: any, i: number) => {
            const isAudio = (media.type === 'audio') || 
                           (media.extension === 'm4a') || 
                           (media.extension === 'opus') || 
                           (media.extension === 'mp3');
            
            formats.push({
                quality: media.quality || `Option ${i + 1}`,
                url: media.url,
                extension: media.extension || 'mp4',
                type: isAudio ? 'audio' : 'video',
                size: media.formattedSize || media.size || '',
                audioAvailable: media.audioAvailable !== undefined ? media.audioAvailable : true,
                hasAudio: media.audioAvailable !== undefined ? media.audioAvailable : !isAudio,
            });
        });
    } else if (apiData.url) {
        formats.push({
            quality: 'Default',
            url: apiData.url,
            extension: 'mp4',
            type: 'video',
            size: '',
            audioAvailable: true,
            hasAudio: true,
        });
    }

    return {
        success: true,
        platform,
        title,
        author,
        thumbnail,
        duration,
        formats,
        source: 'rapidapi',
        url: originalUrl
    };
}

/**
 * YouTube via Cobalt (only if custom Cobalt URL is configured)
 */
export async function getYouTubeInfoCobalt(url: string): Promise<DownloaderResult> {
    const videoPresets = [
        { quality: '2160p (4K)', videoQuality: '2160' },
        { quality: '1080p (Full HD)', videoQuality: '1080' },
        { quality: '720p (HD)', videoQuality: '720' },
        { quality: '480p', videoQuality: '480' },
        { quality: '360p', videoQuality: '360' },
    ];

    const audioPresets = [
        { quality: 'MP3 320kbps', audioFormat: 'mp3', audioBitrate: '320', ext: 'mp3' },
        { quality: 'MP3 128kbps', audioFormat: 'mp3', audioBitrate: '128', ext: 'mp3' },
        { quality: 'OPUS (Best)', audioFormat: 'opus', audioBitrate: '320', ext: 'opus' },
    ];

    // Test with a low quality request to get video metadata
    const testResult = await callCobaltAPI(url, {
        videoQuality: '360',
        youtubeVideoCodec: 'h264',
        alwaysProxy: true
    });

    let title = 'YouTube Video';
    let thumbnail = '';

    if (testResult.filename) {
        title = testResult.filename.replace(/\.[^.]+$/, ''); 
    }

    let videoId = '';
    try {
        const urlObj = new URL(url);
        videoId = urlObj.searchParams.get('v') || urlObj.pathname.split('/').pop() || '';
    } catch {}

    if (videoId) {
        thumbnail = `https://i.ytimg.com/vi/${videoId}/sddefault.jpg`;
    }

    const formats: DownloadFormat[] = [];

    videoPresets.forEach(preset => {
        formats.push({
            quality: preset.quality,
            url: '', 
            extension: 'mp4',
            type: 'video',
            size: '',
            audioAvailable: true,
            hasAudio: true,
            cobaltOptions: {
                videoQuality: preset.videoQuality,
                youtubeVideoCodec: 'h264',
                downloadMode: 'auto',
                alwaysProxy: true
            }
        });
    });

    audioPresets.forEach(preset => {
        formats.push({
            quality: preset.quality,
            url: '',
            extension: preset.ext,
            type: 'audio',
            size: '',
            audioAvailable: true,
            hasAudio: true,
            cobaltOptions: {
                downloadMode: 'audio',
                audioFormat: preset.audioFormat,
                audioBitrate: preset.audioBitrate,
                alwaysProxy: true
            }
        });
    });

    return {
        success: true,
        platform: 'YouTube',
        title,
        author: 'YouTube',
        thumbnail,
        duration: 0,
        formats,
        source: 'cobalt',
        url
    };
}
