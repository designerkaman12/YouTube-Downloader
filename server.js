const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// ─── API CONFIGURATION ────────────────────────────────────────
// Uses "Auto Download All In One" RapidAPI by manh'g
// ⭐ 9.9 rating, 99% success rate, supports ALL platforms:
// YouTube, Instagram, TikTok, Twitter/X, Facebook, Pinterest, etc.
// Free plan: 300 requests/month, $0.00/mo
// Subscribe here: https://rapidapi.com/manhg/api/auto-download-all-in-one/pricing

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || '';
const API_HOST = 'auto-download-all-in-one.p.rapidapi.com';

console.log(`🔑 API Key loaded: ${RAPIDAPI_KEY ? 'Yes (' + RAPIDAPI_KEY.substring(0, 8) + '...)' : 'NOT SET — add RAPIDAPI_KEY env variable!'}`);

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

// ─── HELPER: Extract YouTube video ID ─────────────────────────
function extractVideoId(url) {
    try {
        const urlObj = new URL(url);
        if (urlObj.hostname === 'youtu.be') return urlObj.pathname.slice(1);
        if (urlObj.hostname.includes('youtube.com')) {
            if (urlObj.searchParams.has('v')) return urlObj.searchParams.get('v');
            const shortsMatch = urlObj.pathname.match(/\/shorts\/([a-zA-Z0-9_-]+)/);
            if (shortsMatch) return shortsMatch[1];
            const embedMatch = urlObj.pathname.match(/\/embed\/([a-zA-Z0-9_-]+)/);
            if (embedMatch) return embedMatch[1];
        }
    } catch { /* invalid URL */ }
    return null;
}

// ─── HELPER: Get video metadata from YouTube oEmbed ───────────
async function getYouTubeMeta(url) {
    try {
        const r = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`);
        if (!r.ok) return null;
        return await r.json();
    } catch {
        return null;
    }
}

// ─── HELPER: Call Download API ─────────────────────────────────
async function callDownloadAPI(url) {
    if (!RAPIDAPI_KEY) {
        throw new Error('RAPIDAPI_KEY is not set. Add it as an environment variable on Render.');
    }

    const apiUrl = `https://${API_HOST}/v1/social/autolink?url=${encodeURIComponent(url)}`;

    console.log(`  📡 Calling API: ${apiUrl.substring(0, 100)}...`);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60000); // 60s timeout

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'x-rapidapi-host': API_HOST,
                'x-rapidapi-key': RAPIDAPI_KEY
            },
            signal: controller.signal
        });

        clearTimeout(timeout);

        if (response.status === 403) {
            throw new Error('API subscription required. Go to: https://rapidapi.com/manhg/api/auto-download-all-in-one/pricing and click "Start Free Plan"');
        }

        if (response.status === 429) {
            throw new Error('API rate limit reached. Wait a moment and try again.');
        }

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`API error (${response.status}): ${text.substring(0, 200)}`);
        }

        const data = await response.json();
        console.log(`  ✅ API response received. Status: ${response.status}`);
        return data;
    } catch (err) {
        clearTimeout(timeout);
        if (err.name === 'AbortError') {
            throw new Error('API request timed out. Please try again.');
        }
        throw err;
    }
}

// ─── API ENDPOINT: /api/info ──────────────────────────────────
// Accepts a URL from any supported platform, returns video info + download links
app.get('/api/info', async (req, res) => {
    const url = req.query.url;

    if (!url) {
        return res.status(400).json({ error: 'Missing "url" query parameter' });
    }

    const platform = detectPlatform(url);
    console.log(`\n🔍 INFO request: ${url.substring(0, 80)}... (${platform})`);

    try {
        // Step 1: Call the download API
        const apiData = await callDownloadAPI(url);

        // Step 2: Get YouTube metadata if applicable
        let meta = null;
        if (platform === 'YouTube') {
            meta = await getYouTubeMeta(url);
        }

        // Step 3: Parse response
        const title = apiData.title || (meta ? meta.title : '') || 'Unknown Title';
        const author = apiData.author || apiData.source || (meta ? meta.author_name : '') || platform;
        const thumbnail = apiData.thumbnail || (meta ? meta.thumbnail_url : '') || '';
        const duration = apiData.duration || '';

        // Step 4: Build formats list from API medias array
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
            // Single download URL
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
            url: url
        };

        console.log(`  ✅ Returning ${formats.length} download option(s) for "${title.substring(0, 50)}..."`);
        res.json(result);

    } catch (error) {
        console.error(`  ❌ Error: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
});

// ─── API ENDPOINT: /api/download ──────────────────────────────
// Returns a direct download URL (redirects to the media file)
app.get('/api/download', async (req, res) => {
    const url = req.query.url;
    const quality = req.query.quality || '';

    if (!url) {
        return res.status(400).json({ error: 'Missing "url" query parameter' });
    }

    const platform = detectPlatform(url);
    console.log(`\n⬇️  DOWNLOAD request: ${url.substring(0, 80)}... (${platform})`);

    try {
        const apiData = await callDownloadAPI(url);

        let downloadUrl = null;

        if (apiData.medias && Array.isArray(apiData.medias) && apiData.medias.length > 0) {
            // Try to find matching quality
            if (quality) {
                const match = apiData.medias.find(m =>
                    (m.quality || '').toLowerCase().includes(quality.toLowerCase())
                );
                if (match) downloadUrl = match.url;
            }
            // Fallback to first video media, then first any media
            if (!downloadUrl) {
                const videoMedia = apiData.medias.find(m => (m.type || '').includes('video'));
                downloadUrl = videoMedia ? videoMedia.url : apiData.medias[0].url;
            }
        } else if (apiData.url) {
            downloadUrl = apiData.url;
        }

        if (!downloadUrl) {
            return res.status(404).json({ error: 'No download URL found in API response' });
        }

        console.log(`  ✅ Redirecting to download: ${downloadUrl.substring(0, 80)}...`);
        res.redirect(downloadUrl);

    } catch (error) {
        console.error(`  ❌ Download error: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
});

// ─── STATUS & DEBUG ENDPOINTS ─────────────────────────────────
app.get('/api/status', (req, res) => {
    res.json({
        status: 'ok',
        engine: 'Auto Download All In One (RapidAPI)',
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
        apiHost: API_HOST,
        subscriptionLink: 'https://rapidapi.com/manhg/api/auto-download-all-in-one/pricing'
    });
});

// ─── CATCH-ALL: Serve frontend ────────────────────────────────
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ─── START SERVER ─────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`\n🚀 OmniLoad server started on port ${PORT}`);
    console.log(`🌐 Supported: YouTube, Instagram, TikTok, Twitter/X, Facebook, Pinterest, Vimeo, Reddit, and more!`);
    console.log(`📡 API: Auto Download All In One (RapidAPI)`);
    if (!RAPIDAPI_KEY) {
        console.log(`⚠️  WARNING: RAPIDAPI_KEY not set! Add it as environment variable.`);
        console.log(`   Subscribe (FREE): https://rapidapi.com/manhg/api/auto-download-all-in-one/pricing`);
    }
});
