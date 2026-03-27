/**
 * DOWNLOADER UTILITY LIBRARY
 * Handles platform detection, API calls (Cobalt & RapidAPI), and format processing.
 */

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || '';
const API_HOST = 'auto-download-all-in-one.p.rapidapi.com';
const COBALT_API_URL = process.env.COBALT_API_URL || '';

// ─── COBALT API FAILOVER INSTANCES ────────────────────────────
const COBALT_INSTANCES = [
    COBALT_API_URL,
    'https://api.cobalt.tools',
    'https://cobalt.duckery.co',
    'https://cobalt-api.kwiatekm.com'
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
        if (host.includes('bilibili.com') || host.includes('b23.tv')) return 'Bilibili';
        if (host.includes('spotify.com')) return 'Spotify';
        if (host.includes('soundcloud.com')) return 'SoundCloud';
        if (host.includes('linkedin.com')) return 'LinkedIn';
        if (host.includes('twitch.tv')) return 'Twitch';
        if (host.includes('tumblr.com')) return 'Tumblr';
        if (host.includes('vk.com') || host.includes('vk.ru')) return 'VK';
        if (host.includes('likee.video') || host.includes('likee.com')) return 'Likee';
        if (host.includes('bandcamp.com')) return 'Bandcamp';
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
 * Call Cobalt API with automatic failover to public instances if necessary
 */
export async function callCobaltAPI(url: string, options: any = {}): Promise<any> {
    const body = { url, ...options };
    let lastError: any = null;

    for (const cobaltUrl of COBALT_INSTANCES) {
        console.log(`  🔷 Trying Cobalt API: POST ${cobaltUrl}/`);
        
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 12000); // Slightly faster timeout

        try {
            const response = await fetch(`${cobaltUrl}/`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Origin': 'https://cobalt.tools',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
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
            
            if (data.status === 'error' && (data.error?.code === 'error.youtube.ip_ban' || data.text?.toLowerCase().includes('blocked'))) {
                throw new Error(`Blocked by YouTube on this instance: ${data.error?.code || data.text}`);
            }

            console.log(`  ✅ Success with ${cobaltUrl}`);
            return data;

        } catch (err: any) {
            clearTimeout(timeout);
            console.warn(`  ⚠️ Failed (${cobaltUrl}): ${err.name === 'AbortError' ? 'Timeout' : err.message}`);
            lastError = err;
        }
    }

    throw new Error(`All Cobalt API instances failed. Last error: ${lastError?.message}`);
}

/**
 * Call RapidAPI for non-YouTube platforms
 */
export async function callRapidAPI(url: string): Promise<any> {
    if (!RAPIDAPI_KEY) {
        throw new Error('RAPIDAPI_KEY is not set.');
    }

    const apiUrl = `https://${API_HOST}/v1/social/autolink`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 45000); // Faster than 60s

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

        if (response.status === 403) throw new Error('API subscription required.');
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

export async function getYouTubeInfo(url: string): Promise<DownloaderResult> {
    const videoPresets = [
        { quality: '4320p (8K)', videoQuality: '4320', label: '8K Ultra' },
        { quality: '2160p (4K)', videoQuality: '2160', label: '4K' },
        { quality: '1440p (2K)', videoQuality: '1440', label: '2K' },
        { quality: '1080p (Full HD)', videoQuality: '1080', label: '1080p' },
        { quality: '720p (HD)', videoQuality: '720', label: '720p' },
        { quality: '480p', videoQuality: '480', label: '480p' },
        { quality: '360p', videoQuality: '360', label: '360p' },
    ];

    const audioPresets = [
        { quality: 'MP3 320kbps', audioFormat: 'mp3', audioBitrate: '320', ext: 'mp3' },
        { quality: 'MP3 128kbps', audioFormat: 'mp3', audioBitrate: '128', ext: 'mp3' },
        { quality: 'OGG (Best)', audioFormat: 'ogg', audioBitrate: '320', ext: 'ogg' },
        { quality: 'WAV (Lossless)', audioFormat: 'wav', audioBitrate: '320', ext: 'wav' },
        { quality: 'OPUS (Best)', audioFormat: 'opus', audioBitrate: '320', ext: 'opus' },
    ];

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
    } catch (e) {}

    if (videoId) {
        thumbnail = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
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
