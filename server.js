const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// ─── COBALT API CONFIGURATION ──────────────────────────────────
// Uses cobalt.tools community API instances — FREE, no API key needed.
// Multiple instances for fallback reliability.
// Source: https://instances.cobalt.best

const COBALT_INSTANCES = [
    'https://cobalt-api.meowing.de',    // 92% score
    'https://cobalt-backend.canine.tools', // 76%
    'https://capi.3kh0.net',            // 72%
];

console.log(`📦 Configured ${COBALT_INSTANCES.length} cobalt instances for fallback.`);

// ─── HELPER: Extract video ID from YouTube URL ─────────────────
function extractVideoId(url) {
    try {
        const urlObj = new URL(url);
        if (urlObj.hostname === 'youtu.be') {
            return urlObj.pathname.slice(1);
        }
        if (urlObj.hostname.includes('youtube.com')) {
            if (urlObj.searchParams.has('v')) {
                return urlObj.searchParams.get('v');
            }
            const shortsMatch = urlObj.pathname.match(/\/shorts\/([a-zA-Z0-9_-]+)/);
            if (shortsMatch) return shortsMatch[1];
            const embedMatch = urlObj.pathname.match(/\/embed\/([a-zA-Z0-9_-]+)/);
            if (embedMatch) return embedMatch[1];
        }
    } catch (e) { /* invalid URL */ }
    return null;
}

// ─── HELPER: Validate YouTube URL ──────────────────────────────
function isValidYouTubeUrl(url) {
    return !!extractVideoId(url);
}

// ─── HELPER: Call cobalt API with instance fallback ────────────
async function callCobaltAPI(videoUrl, quality = '1080') {
    let lastError;

    for (let i = 0; i < COBALT_INSTANCES.length; i++) {
        const instance = COBALT_INSTANCES[i];
        try {
            console.log(`  ↳ Trying cobalt instance ${i + 1}/${COBALT_INSTANCES.length}: ${instance}`);

            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 30000); // 30s timeout

            const response = await fetch(instance + '/', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    url: videoUrl,
                    videoQuality: quality,
                    youtubeVideoCodec: 'h264',
                    filenameStyle: 'basic'
                }),
                signal: controller.signal
            });

            clearTimeout(timeout);

            if (!response.ok) {
                const errorText = await response.text();
                console.log(`  ❌ Instance returned ${response.status}: ${errorText.substring(0, 200)}`);

                // If it's a rate limit, try next instance
                if (response.status === 429) {
                    console.log(`  ⏳ Rate limited, trying next instance...`);
                    continue;
                }

                throw new Error(`Cobalt error (${response.status}): ${errorText.substring(0, 150)}`);
            }

            const data = await response.json();
            console.log(`  ✅ Cobalt success from ${instance}, status: ${data.status}`);
            return data;

        } catch (err) {
            lastError = err;
            const msg = err.name === 'AbortError' ? 'Request timed out' : err.message;
            console.log(`  ❌ Instance ${instance} failed: ${msg.substring(0, 150)}`);

            // Try next instance
            continue;
        }
    }

    throw lastError || new Error('All cobalt instances failed. Please try again later.');
}

// ─── HELPER: Get video metadata from YouTube oEmbed ────────────
async function getVideoMeta(videoUrl) {
    try {
        const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(videoUrl)}&format=json`;
        const resp = await fetch(oembedUrl, { 
            headers: { 'User-Agent': 'Mozilla/5.0' },
            signal: AbortSignal.timeout(10000)
        });
        if (resp.ok) {
            return await resp.json();
        }
    } catch (e) {
        console.log('  ⚠️ oEmbed fetch failed:', e.message);
    }
    return null;
}

// ─── Proxy endpoint to bypass 403 Forbidden on thumbnails ──────
app.get('/api/thumbnail', async (req, res) => {
    let imageUrl = req.query.url;
    if (!imageUrl) return res.status(400).send('URL is required');

    try {
        const fetchRes = await fetch(imageUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
                'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            },
            redirect: 'follow'
        });

        if (!fetchRes.ok) throw new Error(`HTTP Error: ${fetchRes.status}`);

        const arrayBuffer = await fetchRes.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        res.set('Content-Type', fetchRes.headers.get('content-type') || 'image/jpeg');
        res.set('Cache-Control', 'public, max-age=86400');
        res.send(buffer);
    } catch (e) {
        console.error('Thumbnail Proxy Error:', e.message);
        res.redirect('https://via.placeholder.com/320x180?text=No+Thumbnail');
    }
});

// ─── Main API: Get video info and download link ────────────────
app.get('/api/info', async (req, res) => {
    try {
        let videoUrl = req.query.url;
        if (!videoUrl) return res.status(400).json({ error: 'URL required' });

        if (!isValidYouTubeUrl(videoUrl)) {
            return res.status(400).json({ error: 'Invalid or unsupported URL. Currently supports YouTube links.' });
        }

        const videoId = extractVideoId(videoUrl);
        // Normalize the URL to standard format
        const normalizedUrl = `https://www.youtube.com/watch?v=${videoId}`;

        console.log(`\n📥 Fetching info for ${normalizedUrl} ...`);

        // Fetch metadata and download link in parallel
        const [meta, cobaltData] = await Promise.all([
            getVideoMeta(normalizedUrl),
            callCobaltAPI(normalizedUrl, '1080')
        ]);

        const title = meta?.title || 'YouTube Video';
        const author = meta?.author_name || '';
        const thumbnail = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;

        // Build formats from cobalt response
        const formats = [];

        if (cobaltData.status === 'tunnel' || cobaltData.status === 'redirect') {
            // Single download link — best quality
            formats.push({
                itag: 1,
                qualityLabel: '1080p (Best)',
                mimeType: 'video/mp4',
                hasVideo: true,
                hasAudio: true,
                contentLength: 0,
                height: 1080,
                width: 1920,
                url: cobaltData.url
            });
        } else if (cobaltData.status === 'picker') {
            // Multiple options
            if (cobaltData.picker && Array.isArray(cobaltData.picker)) {
                for (const item of cobaltData.picker) {
                    if (item.type === 'video' && item.url) {
                        formats.push({
                            itag: formats.length + 1,
                            qualityLabel: `Video ${formats.length + 1}`,
                            mimeType: 'video/mp4',
                            hasVideo: true,
                            hasAudio: true,
                            contentLength: 0,
                            height: 720,
                            width: 1280,
                            url: item.url
                        });
                    }
                }
            }
        } else if (cobaltData.status === 'error') {
            const errorCode = cobaltData.error?.code || cobaltData.error || 'unknown';
            console.log(`  ⚠️ Cobalt error code: ${errorCode}`);
            return res.status(500).json({ 
                error: `Video processing failed: ${errorCode}. The video may be restricted or unavailable.` 
            });
        }

        // If no formats found, try to get at least a lower quality
        if (formats.length === 0) {
            console.log('  ⚠️ No formats from 1080p, trying 720p...');
            try {
                const fallbackData = await callCobaltAPI(normalizedUrl, '720');
                if (fallbackData.status === 'tunnel' || fallbackData.status === 'redirect') {
                    formats.push({
                        itag: 1,
                        qualityLabel: '720p',
                        mimeType: 'video/mp4',
                        hasVideo: true,
                        hasAudio: true,
                        contentLength: 0,
                        height: 720,
                        width: 1280,
                        url: fallbackData.url
                    });
                }
            } catch (e) {
                console.log('  ❌ 720p fallback also failed:', e.message);
            }
        }

        if (formats.length === 0) {
            return res.status(500).json({ error: 'Could not get download link. The video may be age-restricted or unavailable.' });
        }

        console.log(`  🎬 Found ${formats.length} format(s)`);

        res.json({
            title,
            thumbnail,
            duration: 0,
            author,
            extractor: 'YouTube',
            formats
        });

    } catch (error) {
        console.error('Error fetching info:', error.message);
        res.status(500).json({ error: error.message?.substring(0, 250) || 'Failed to process this link.' });
    }
});

// ─── Download endpoint (kept for compatibility) ────────────────
app.get('/api/download', async (req, res) => {
    try {
        const videoUrl = req.query.url;
        if (!videoUrl) {
            return res.status(400).json({ error: 'URL required' });
        }

        const videoId = extractVideoId(videoUrl);
        if (!videoId) {
            return res.status(400).json({ error: 'Invalid YouTube URL.' });
        }

        const normalizedUrl = `https://www.youtube.com/watch?v=${videoId}`;
        console.log(`\n⬇️  Download request for ${normalizedUrl}`);

        const cobaltData = await callCobaltAPI(normalizedUrl, '1080');

        if (cobaltData.status === 'tunnel' || cobaltData.status === 'redirect') {
            return res.json({ downloadUrl: cobaltData.url });
        }

        if (cobaltData.status === 'picker' && cobaltData.picker?.[0]?.url) {
            return res.json({ downloadUrl: cobaltData.picker[0].url });
        }

        return res.status(404).json({ error: 'No download link found.' });

    } catch (error) {
        console.error('Error in /api/download:', error.message);
        res.status(500).json({ error: 'Download failed. Please try again.' });
    }
});

// ─── Health/Status endpoint ────────────────────────────────────
app.get('/api/status', (req, res) => {
    res.json({
        status: 'ok',
        engine: 'Cobalt (community instances — no API key needed)',
        instances: COBALT_INSTANCES.length,
        uptime: Math.floor(process.uptime()) + 's'
    });
});

// ─── Debug endpoint ────────────────────────────────────────────
app.get('/api/debug', async (req, res) => {
    let testResult = 'not tested';
    if (req.query.test) {
        try {
            const testUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
            const data = await callCobaltAPI(testUrl, '360');
            testResult = `SUCCESS: status=${data.status}, url=${(data.url || 'picker').substring(0, 80)}`;
        } catch (e) {
            testResult = 'FAIL: ' + (e.message || 'unknown error').substring(0, 300);
        }
    }
    res.json({
        engine: 'Cobalt (community instances)',
        instances: COBALT_INSTANCES,
        testResult
    });
});

app.listen(PORT, () => {
    console.log(`\n🚀 OmniLoad server running on http://localhost:${PORT}`);
    console.log(`   Engine: Cobalt API (NO API key needed!)`);
    console.log(`   Instances: ${COBALT_INSTANCES.length} configured`);
    console.log('');
});
