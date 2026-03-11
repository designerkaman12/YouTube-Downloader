const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// ─── API CONFIGURATION ────────────────────────────────────────
// Unified approach:
// - All platforms (including YouTube): Auto Download All In One RapidAPI

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || '';
const API_HOST = 'auto-download-all-in-one.p.rapidapi.com';

console.log(`🔑 API Key loaded: ${RAPIDAPI_KEY ? 'Yes' : 'NOT SET'}`);

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

// ─── HELPER: Formats bytes to MB/GB 등 ──────────────────────────
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
        // ALL PLATFORMS (including YouTube): Use Auto Download All In One RapidAPI
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
                    url: media.url, // Direct URL for non-YouTube (usually not IP-locked)
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

// ─── API ENDPOINT: /api/proxy ─────────────────────────────────
// Proxies ALL download URLs (including YouTube) through our server
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

        const response = await fetch(downloadUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
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
        engine: 'Unified: Auto Download All In One (RapidAPI)',
        apiKeyLoaded: !!RAPIDAPI_KEY,
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
        apiHost: API_HOST
    });
});

// ─── CATCH-ALL: Serve frontend ────────────────────────────────
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ─── START SERVER ─────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`\n🚀 OmniLoad server started on port ${PORT}`);
    console.log(`📡 All platforms handled universally via: Auto Download All In One (RapidAPI)`);
    if (!RAPIDAPI_KEY) {
        console.log(`⚠️  WARNING: RAPIDAPI_KEY not set! Downloads will fail.`);
    }
});
