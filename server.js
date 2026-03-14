const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// ─── API CONFIGURATION ────────────────────────────────────────
// Hybrid approach:
// - YouTube: Cobalt API (self-hosted, free, unlimited, up to 4K)
// - Other platforms: Auto Download All In One RapidAPI

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || '';
const API_HOST = 'auto-download-all-in-one.p.rapidapi.com';
const COBALT_API_URL = process.env.COBALT_API_URL || 'http://localhost:9000';

console.log(`🔑 RapidAPI Key loaded: ${RAPIDAPI_KEY ? 'Yes' : 'NOT SET'}`);
console.log(`🔗 Cobalt API URL: ${COBALT_API_URL}`);

// ─── HELPER: Detect platform from URL ─────────────────────────
function detectPlatform(url) {
    try {
        const host = new URL(url).hostname.toLowerCase();
        if (host.includes('youtube.com') || host.includes('youtu.be')) return 'YouTube';
        if (host.includes('instagram.com')) return 'Instagram';
        if (host.includes('tiktok.com')) return 'TikTok';
        if (host.includes('twitter.com') || host.includes('x.com')) return 'Twitter/X';
        if (host.includes('facebook.com') || host.includes('fb.watch')) return 'Facebook';
        if (host.includes('pinterest.com')) return 'Pinterest';
        if (host.includes('vimeo.com')) return 'Vimeo';
        if (host.includes('dailymotion.com')) return 'Dailymotion';
        if (host.includes('reddit.com')) return 'Reddit';
        if (host.includes('snapchat.com')) return 'Snapchat';
        if (host.includes('threads.net')) return 'Threads';
        if (host.includes('bilibili.com')) return 'Bilibili';
        return 'Other';
    } catch {
        return 'Unknown';
    }
}

// ─── HELPER: Check if URL is YouTube ──────────────────────────
function isYouTube(url) {
    return detectPlatform(url) === 'YouTube';
}

// ─── HELPER: Call RapidAPI (for non-YouTube) ──────────────────
async function callDownloadAPI(url) {
    if (!RAPIDAPI_KEY) {
        throw new Error('RAPIDAPI_KEY is not set. Add it as an environment variable on Render.');
    }

    const apiUrl = `https://${API_HOST}/v1/social/autolink`;
    console.log(`  📡 Calling RapidAPI: POST ${apiUrl}`);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60000);

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

        if (response.status === 403) {
            throw new Error('API subscription required.');
        }
        if (response.status === 429) {
            throw new Error('API rate limit reached. Try again later.');
        }
        if (!response.ok) {
            const text = await response.text();
            throw new Error(`API error (${response.status}): ${text.substring(0, 200)}`);
        }

        return await response.json();
    } catch (err) {
        clearTimeout(timeout);
        if (err.name === 'AbortError') throw new Error('API request timed out.');
        throw err;
    }
}

// ─── COBALT: Call Cobalt API ──────────────────────────────────
async function callCobaltAPI(url, options = {}) {
    const cobaltUrl = COBALT_API_URL.replace(/\/$/, '');
    console.log(`  🔷 Calling Cobalt API: POST ${cobaltUrl}/`);

    const body = {
        url,
        ...options
    };

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60000);

    try {
        const response = await fetch(`${cobaltUrl}/`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body),
            signal: controller.signal
        });

        clearTimeout(timeout);

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`Cobalt API error (${response.status}): ${text.substring(0, 200)}`);
        }

        return await response.json();
    } catch (err) {
        clearTimeout(timeout);
        if (err.name === 'AbortError') throw new Error('Cobalt API request timed out.');
        throw err;
    }
}

// ─── YOUTUBE: Get info using Cobalt API ────────────────────────
async function getYouTubeInfo(url) {
    console.log(`  🎬 Getting YouTube info via Cobalt API...`);

    // Define preset quality options for the user to choose from
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

    // Test one call to Cobalt to verify the URL works and get basic info
    // We use a quick low-quality request just to validate
    const testResult = await callCobaltAPI(url, {
        videoQuality: '360',
        youtubeVideoCodec: 'h264',
        alwaysProxy: true
    });

    // Extract title from the filename if available
    let title = 'YouTube Video';
    let thumbnail = '';

    if (testResult.filename) {
        // Cobalt filename format: "Title (Video ID)" — extract title
        title = testResult.filename.replace(/\.[^.]+$/, ''); // Remove extension
    }

    // Try to extract video ID for thumbnail
    let videoId = '';
    try {
        const urlObj = new URL(url);
        videoId = urlObj.searchParams.get('v') || urlObj.pathname.split('/').pop();
    } catch (e) {}

    if (videoId) {
        thumbnail = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
    }

    // Build format list — each format is a preset that will call Cobalt on download
    const formats = [];

    // Video formats
    videoPresets.forEach(preset => {
        formats.push({
            quality: preset.quality,
            url: '', // Will be resolved at download time via /api/stream
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

    // Audio formats
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
        title: title,
        author: 'YouTube',
        thumbnail: thumbnail,
        duration: 0,
        formats: formats,
        source: 'cobalt',
        url: url
    };
}

// ─── HELPER: Formats bytes to MB/GB ──────────────────────────
function formatBytes(bytes) {
    if (!bytes || isNaN(bytes)) return '';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

// ─── API ENDPOINT: /api/info ──────────────────────────────────
app.get('/api/info', async (req, res) => {
    const url = req.query.url;

    if (!url) {
        return res.status(400).json({ error: 'Missing "url" query parameter' });
    }

    const platform = detectPlatform(url);
    console.log(`\n🔍 INFO request: ${url.substring(0, 80)}... (${platform})`);

    try {
        // YOUTUBE: Use Cobalt API
        if (isYouTube(url)) {
            try {
                const result = await getYouTubeInfo(url);
                console.log(`  ✅ YouTube (Cobalt): ${result.formats.length} formats for "${result.title.substring(0, 50)}"`);
                return res.json(result);
            } catch (ytError) {
                console.warn(`  ⚠️ YouTube (Cobalt) failed: ${ytError.message}. Falling back to RapidAPI...`);
                // Fallthrough to RapidAPI below
            }
        }

        // OTHER PLATFORMS & YOUTUBE FALLBACK: Use RapidAPI
        const apiData = await callDownloadAPI(url);

        const title = apiData.title || 'Unknown Title';
        const author = apiData.author || apiData.source || platform;
        const thumbnail = apiData.thumbnail || '';
        const duration = apiData.duration || '';

        const formats = [];

        if (apiData.medias && Array.isArray(apiData.medias)) {
            apiData.medias.forEach((media, i) => {
                formats.push({
                    quality: media.quality || `Option ${i + 1}`,
                    url: media.url,
                    extension: media.extension || 'mp4',
                    type: media.type || 'video',
                    size: media.formattedSize || media.size || '',
                    audioAvailable: media.audioAvailable !== undefined ? media.audioAvailable : true
                });
            });
        } else if (apiData.url) {
            formats.push({
                quality: 'Default',
                url: apiData.url,
                extension: 'mp4',
                type: 'video',
                size: '',
                audioAvailable: true
            });
        }

        const result = {
            success: true,
            platform,
            title,
            author,
            thumbnail,
            duration,
            formats,
            source: apiData.source || platform,
            url
        };

        console.log(`  ✅ ${platform}: ${formats.length} formats for "${title.substring(0, 50)}"`);
        res.json(result);

    } catch (error) {
        console.error(`  ❌ Error: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
});

// ─── API ENDPOINT: /api/stream ────────────────────────────────
// Streams YouTube video/audio via Cobalt API (proxied through our server)
app.get('/api/stream', async (req, res) => {
    const url = req.query.url;
    const filename = req.query.filename || 'download.mp4';
    const cobaltOptionsRaw = req.query.cobaltOptions;

    if (!url) {
        return res.status(400).json({ error: 'Missing "url" parameter' });
    }

    console.log(`\n⬇️  STREAM request: ${url.substring(0, 80)}...`);

    try {
        if (!isYouTube(url)) {
            // For non-YouTube, redirect to the URL directly
            return res.redirect(req.query.directUrl || url);
        }

        // Parse Cobalt options from query
        let cobaltOptions = {};
        if (cobaltOptionsRaw) {
            try {
                cobaltOptions = JSON.parse(decodeURIComponent(cobaltOptionsRaw));
            } catch (e) {
                console.warn('  ⚠️ Could not parse cobaltOptions:', e.message);
            }
        }

        // Ensure alwaysProxy is set so Cobalt tunnels (avoids IP-locked redirects)
        cobaltOptions.alwaysProxy = true;

        // Call Cobalt API to get the download URL
        console.log(`  🔷 Requesting from Cobalt with options:`, cobaltOptions);
        const cobaltResult = await callCobaltAPI(url, cobaltOptions);

        let downloadUrl = null;

        if (cobaltResult.status === 'tunnel' || cobaltResult.status === 'redirect') {
            downloadUrl = cobaltResult.url;
        } else if (cobaltResult.status === 'picker' && cobaltResult.picker && cobaltResult.picker.length > 0) {
            downloadUrl = cobaltResult.picker[0].url;
        } else if (cobaltResult.status === 'error') {
            throw new Error(`Cobalt error: ${cobaltResult.error?.code || 'unknown'}`);
        }

        if (!downloadUrl) {
            throw new Error('Could not get download URL from Cobalt');
        }

        console.log(`  🔗 Got Cobalt tunnel URL, redirecting client...`);

        // Redirect client directly to Cobalt's tunnel URL
        // Cobalt tunnel handles the proxying, so no need to double-proxy
        res.redirect(downloadUrl);

    } catch (error) {
        console.error(`  ❌ Stream error: ${error.message}`);
        if (!res.headersSent) {
            res.status(500).json({ error: error.message });
        }
    }
});

// ─── API ENDPOINT: /api/proxy ─────────────────────────────────
// Proxies non-YouTube download URLs through our server
app.get('/api/proxy', async (req, res) => {
    const downloadUrl = req.query.url;
    const filename = req.query.filename || 'download';

    if (!downloadUrl) {
        return res.status(400).json({ error: 'Missing "url" parameter' });
    }

    console.log(`\n⬇️  PROXY download: ${downloadUrl.substring(0, 80)}...`);

    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 120000);

        let referer = '';
        try {
            const parsed = new URL(downloadUrl);
            referer = `${parsed.protocol}//${parsed.host}/`;
        } catch (e) {
            referer = downloadUrl;
        }

        const response = await fetch(downloadUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': '*/*',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive',
                'Referer': referer
            },
            signal: controller.signal
        });

        clearTimeout(timeout);

        if (!response.ok) {
            return res.status(response.status).json({ error: `Download failed: ${response.status}` });
        }

        const contentType = response.headers.get('content-type') || 'application/octet-stream';
        const contentLength = response.headers.get('content-length');

        res.setHeader('Content-Type', contentType);
        if (contentLength) res.setHeader('Content-Length', contentLength);
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

        const reader = response.body.getReader();
        const pump = async () => {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                res.write(Buffer.from(value));
            }
            res.end();
        };

        await pump();
        console.log(`  ✅ Proxy download complete: ${filename}`);

    } catch (err) {
        console.error(`  ❌ Proxy error: ${err.message}`);
        if (!res.headersSent) {
            res.status(500).json({ error: `Download failed: ${err.message}` });
        }
    }
});

// ─── API ENDPOINT: /api/thumbnail ─────────────────────────────
app.get('/api/thumbnail', async (req, res) => {
    const url = req.query.url;
    if (!url) return res.status(400).send('Missing url');

    try {
        const response = await fetch(url);
        if (!response.ok) return res.status(404).send('Thumbnail not found');

        const contentType = response.headers.get('content-type') || 'image/jpeg';
        res.setHeader('Content-Type', contentType);
        res.setHeader('Cache-Control', 'public, max-age=86400');

        const reader = response.body.getReader();
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            res.write(Buffer.from(value));
        }
        res.end();
    } catch {
        res.status(500).send('Failed to fetch thumbnail');
    }
});

// ─── STATUS & DEBUG ENDPOINTS ─────────────────────────────────
app.get('/api/status', (req, res) => {
    res.json({
        status: 'ok',
        engine: 'Hybrid: Cobalt API (YouTube) + RapidAPI (others)',
        apiKeyLoaded: !!RAPIDAPI_KEY,
        cobaltApiUrl: COBALT_API_URL,
        supportedPlatforms: [
            'YouTube', 'Instagram', 'TikTok', 'Twitter/X',
            'Facebook', 'Pinterest', 'Vimeo', 'Reddit', 'Snapchat',
            'Threads', 'Dailymotion', 'Bilibili', 'and more...'
        ],
        uptime: `${Math.floor(process.uptime())}s`
    });
});

app.get('/api/debug', (req, res) => {
    res.json({
        nodeVersion: process.version,
        uptime: `${Math.floor(process.uptime())}s`,
        env: process.env.NODE_ENV || 'development',
        apiKeySet: !!RAPIDAPI_KEY,
        apiHost: API_HOST,
        cobaltApiUrl: COBALT_API_URL
    });
});

// ─── CATCH-ALL: Serve frontend ────────────────────────────────
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ─── START SERVER ─────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`\n🚀 OmniLoad server started on port ${PORT}`);
    console.log(`🎬 YouTube: Cobalt API (${COBALT_API_URL})`);
    console.log(`📡 Other platforms: Auto Download All In One (RapidAPI)`);
    if (!RAPIDAPI_KEY) {
        console.log(`⚠️  WARNING: RAPIDAPI_KEY not set! Non-YouTube downloads won't work.`);
    }
});
