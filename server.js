const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// ─── RAPIDAPI CONFIGURATION ────────────────────────────────────
// Permanent solution: uses a third-party API to download YouTube
// videos. No cookies needed, no YouTube bot detection issues.
// Set RAPIDAPI_KEY env var on Render (or locally).

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || '';
const RAPIDAPI_HOST = 'youtube-downloader-api-best-resolution.p.rapidapi.com';

if (!RAPIDAPI_KEY) {
    console.warn('⚠️  RAPIDAPI_KEY not set! YouTube downloads will fail.');
    console.warn('   Get a free key at: https://rapidapi.com/ytjar/api/youtube-downloader-api-best-resolution');
}

// ─── HELPER: Extract video ID from YouTube URL ─────────────────
function extractVideoId(url) {
    try {
        const urlObj = new URL(url);
        // Handle youtu.be/VIDEO_ID
        if (urlObj.hostname === 'youtu.be') {
            return urlObj.pathname.slice(1);
        }
        // Handle youtube.com/watch?v=VIDEO_ID
        if (urlObj.hostname.includes('youtube.com')) {
            // Regular watch URL
            if (urlObj.searchParams.has('v')) {
                return urlObj.searchParams.get('v');
            }
            // Shorts URL: youtube.com/shorts/VIDEO_ID
            const shortsMatch = urlObj.pathname.match(/\/shorts\/([a-zA-Z0-9_-]+)/);
            if (shortsMatch) return shortsMatch[1];
            // Embed URL: youtube.com/embed/VIDEO_ID
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

// ─── HELPER: Call RapidAPI with retry ──────────────────────────
async function callRapidAPI(videoUrl, maxRetries = 3) {
    if (!RAPIDAPI_KEY) {
        throw new Error('Server API key not configured. Contact the admin.');
    }

    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`  ↳ RapidAPI attempt ${attempt}/${maxRetries}...`);

            const apiUrl = `https://${RAPIDAPI_HOST}/convert?url=${encodeURIComponent(videoUrl)}`;
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'x-rapidapi-host': RAPIDAPI_HOST,
                    'x-rapidapi-key': RAPIDAPI_KEY
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.log(`  ❌ API returned ${response.status}: ${errorText.substring(0, 200)}`);

                // Don't retry on auth errors
                if (response.status === 401 || response.status === 403) {
                    throw new Error('API key is invalid or the free plan is not subscribed. Go to rapidapi.com and subscribe to the Basic (free) plan.');
                }
                // 429 = rate limit OR unsubscribed free plan
                if (response.status === 429) {
                    throw new Error('API quota exceeded or free plan not subscribed. Go to rapidapi.com, subscribe to the Basic (free) plan, and try again.');
                }

                throw new Error(`API error (${response.status}): ${errorText.substring(0, 100)}`);
            }

            const data = await response.json();
            console.log(`  ✅ RapidAPI success on attempt ${attempt}`);
            return data;

        } catch (err) {
            lastError = err;
            console.log(`  ❌ Attempt ${attempt} failed: ${(err.message || '').substring(0, 150)}`);

            // Don't retry on permanent errors
            if (err.message.includes('API key') || err.message.includes('rate limit')) {
                throw err;
            }

            // Wait before retry (exponential backoff)
            if (attempt < maxRetries) {
                const delay = attempt * 2000;
                console.log(`  ⏳ Waiting ${delay}ms before retry...`);
                await new Promise(r => setTimeout(r, delay));
            }
        }
    }

    throw lastError;
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

        // Validate URL looks like YouTube
        if (!isValidYouTubeUrl(videoUrl)) {
            return res.status(400).json({ error: 'Invalid or unsupported URL. Currently supports YouTube links.' });
        }

        console.log(`\n📥 Fetching info via RapidAPI for ${videoUrl} ...`);
        const apiData = await callRapidAPI(videoUrl);

        // Extract video ID for thumbnail
        const videoId = extractVideoId(videoUrl);
        const thumbnail = videoId
            ? `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`
            : '';

        // Build the response in the format the frontend expects
        const title = apiData.title || apiData.Title || 'YouTube Video';
        const downloadUrl = apiData.link || apiData.Link || apiData.url || apiData.downloadUrl || '';

        if (!downloadUrl) {
            console.error('  ⚠️ API returned no download link:', JSON.stringify(apiData).substring(0, 500));
            return res.status(500).json({ error: 'API returned no download link. The video may be restricted.' });
        }

        // Build formats array matching frontend expectations
        const formats = [];

        // Primary: best quality video
        formats.push({
            itag: 1,
            qualityLabel: 'Best Quality',
            mimeType: 'video/mp4',
            hasVideo: true,
            hasAudio: true,
            contentLength: 0,
            height: 1080,
            width: 1920,
            url: downloadUrl
        });

        res.json({
            title,
            thumbnail,
            duration: apiData.duration || 0,
            author: apiData.author || '',
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

        console.log(`\n⬇️  Download request for ${videoUrl}`);
        const apiData = await callRapidAPI(videoUrl);
        const downloadUrl = apiData.link || apiData.Link || apiData.url || apiData.downloadUrl || '';

        if (!downloadUrl) {
            return res.status(404).json({ error: 'No download link found.' });
        }

        res.json({ downloadUrl });

    } catch (error) {
        console.error('Error in /api/download:', error.message);
        res.status(500).json({ error: 'Download failed. Please try again.' });
    }
});

// ─── Health/Status endpoint ────────────────────────────────────
app.get('/api/status', (req, res) => {
    res.json({
        status: 'ok',
        engine: 'RapidAPI (youtube-downloader-api-best-resolution)',
        apiKeyLoaded: !!RAPIDAPI_KEY,
        uptime: Math.floor(process.uptime()) + 's'
    });
});

// ─── Debug endpoint ────────────────────────────────────────────
app.get('/api/debug', async (req, res) => {
    let testResult = 'not tested';
    if (req.query.test) {
        try {
            const testUrl = req.query.url || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
            const data = await callRapidAPI(testUrl, 2);
            const link = data.link || data.Link || data.url || 'no link';
            testResult = `SUCCESS: ${data.title || 'got response'} — link: ${link.substring(0, 80)}...`;
        } catch (e) {
            testResult = 'FAIL: ' + (e.message || 'unknown error').substring(0, 300);
        }
    }
    res.json({
        engine: 'RapidAPI',
        apiKeyLoaded: !!RAPIDAPI_KEY,
        testResult
    });
});

app.listen(PORT, () => {
    console.log(`\n🚀 OmniLoad server running on http://localhost:${PORT}`);
    console.log(`   Engine: RapidAPI YouTube Downloader`);
    console.log(`   API Key: ${RAPIDAPI_KEY ? '✅ Loaded' : '❌ Not set (downloads will fail)'}`);
    console.log('');
});
