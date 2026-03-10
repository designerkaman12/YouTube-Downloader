const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// ─── RAPIDAPI CONFIGURATION ────────────────────────────────────
// Uses "YouTube Video and Shorts Downloader" API on RapidAPI.
// Subscribe (free plan): https://rapidapi.com/youtube86/api/youtube-video-and-shorts-downloader
// Set RAPIDAPI_KEY env var on Render (or locally).

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || '';
const RAPIDAPI_HOST = 'youtube-video-and-shorts-downloader.p.rapidapi.com';

if (!RAPIDAPI_KEY) {
    console.warn('⚠️  RAPIDAPI_KEY not set! YouTube downloads will fail.');
    console.warn('   Get a free key at: https://rapidapi.com/youtube86/api/youtube-video-and-shorts-downloader');
}

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

// ─── HELPER: Call RapidAPI with retry ──────────────────────────
async function callRapidAPI(videoId, maxRetries = 3) {
    if (!RAPIDAPI_KEY) {
        throw new Error('Server API key not configured. Contact the admin.');
    }

    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`  ↳ RapidAPI attempt ${attempt}/${maxRetries} for video ${videoId}...`);

            const apiUrl = `https://${RAPIDAPI_HOST}/download.php?id=${encodeURIComponent(videoId)}`;
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

                if (response.status === 401 || response.status === 403) {
                    throw new Error('API key is invalid or subscription expired. Go to rapidapi.com and subscribe to the free plan.');
                }
                if (response.status === 429) {
                    throw new Error('API quota exceeded. Try again later or upgrade your plan.');
                }

                throw new Error(`API error (${response.status}): ${errorText.substring(0, 100)}`);
            }

            const data = await response.json();
            console.log(`  ✅ RapidAPI success on attempt ${attempt}`);
            return data;

        } catch (err) {
            lastError = err;
            console.log(`  ❌ Attempt ${attempt} failed: ${(err.message || '').substring(0, 150)}`);

            if (err.message.includes('API key') || err.message.includes('quota')) {
                throw err;
            }

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

        if (!isValidYouTubeUrl(videoUrl)) {
            return res.status(400).json({ error: 'Invalid or unsupported URL. Currently supports YouTube links.' });
        }

        const videoId = extractVideoId(videoUrl);
        console.log(`\n📥 Fetching info via RapidAPI for videoId=${videoId} ...`);
        const apiData = await callRapidAPI(videoId);

        // Log raw response structure for debugging
        console.log(`  📦 API response keys: ${Object.keys(apiData).join(', ')}`);

        // ─── Parse the response ─────────────────────────────────
        // This API typically returns: { title, thumbnail, url: [...streams] }
        // Each stream has: url, mimeType, quality, qualityLabel, type, itag, etc.

        const title = apiData.title || apiData.Title || 'YouTube Video';
        const thumbnail = apiData.thumbnail || `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;

        // Build formats from the API response
        const formats = [];

        // The API returns streams in various places
        const streams = apiData.url || apiData.formats || apiData.links || apiData.adaptiveFormats || [];

        if (Array.isArray(streams) && streams.length > 0) {
            // Pick video+audio streams (muxed), sorted by quality
            for (const s of streams) {
                const mimeType = s.mimeType || s.type || 'video/mp4';
                const hasVideo = mimeType.startsWith('video/');
                const hasAudio = !s.audioQuality ? true : true; // muxed streams have both

                // Skip audio-only or non-mp4 for simplicity
                if (mimeType.includes('audio/') && !mimeType.includes('video/')) continue;

                formats.push({
                    itag: s.itag || formats.length + 1,
                    qualityLabel: s.qualityLabel || s.quality || 'Unknown',
                    mimeType: mimeType,
                    hasVideo: hasVideo,
                    hasAudio: hasAudio,
                    contentLength: s.contentLength || 0,
                    height: s.height || 0,
                    width: s.width || 0,
                    url: s.url || s.link || ''
                });
            }
        }

        // If API returned a single download link instead of array
        if (formats.length === 0) {
            const singleUrl = apiData.link || apiData.downloadUrl || apiData.download_url || '';
            if (singleUrl) {
                formats.push({
                    itag: 1,
                    qualityLabel: 'Best Quality',
                    mimeType: 'video/mp4',
                    hasVideo: true,
                    hasAudio: true,
                    contentLength: 0,
                    height: 1080,
                    width: 1920,
                    url: singleUrl
                });
            }
        }

        if (formats.length === 0) {
            console.error('  ⚠️ API returned no download links:', JSON.stringify(apiData).substring(0, 500));
            return res.status(500).json({ error: 'API returned no download link. The video may be restricted.' });
        }

        // Sort by height (quality) descending
        formats.sort((a, b) => (b.height || 0) - (a.height || 0));

        console.log(`  🎬 Found ${formats.length} format(s), best: ${formats[0].qualityLabel}`);

        res.json({
            title,
            thumbnail,
            duration: apiData.duration || apiData.lengthSeconds || 0,
            author: apiData.author || apiData.channelTitle || '',
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

        console.log(`\n⬇️  Download request for videoId=${videoId}`);
        const apiData = await callRapidAPI(videoId);

        let downloadUrl = '';

        // Try array of streams first
        const streams = apiData.url || apiData.formats || apiData.links || [];
        if (Array.isArray(streams) && streams.length > 0) {
            // Find best mp4 stream
            const mp4Stream = streams.find(s => (s.mimeType || s.type || '').includes('video/mp4') && s.url);
            if (mp4Stream) {
                downloadUrl = mp4Stream.url;
            } else if (streams[0] && streams[0].url) {
                downloadUrl = streams[0].url;
            }
        }

        // Fallback to single link
        if (!downloadUrl) {
            downloadUrl = apiData.link || apiData.downloadUrl || apiData.download_url || '';
        }

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
        engine: 'RapidAPI (YouTube Video and Shorts Downloader)',
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
            const testId = extractVideoId(testUrl) || 'dQw4w9WgXcQ';
            const data = await callRapidAPI(testId, 2);
            testResult = `SUCCESS: ${data.title || 'got response'} — keys: ${Object.keys(data).join(', ')}`;
        } catch (e) {
            testResult = 'FAIL: ' + (e.message || 'unknown error').substring(0, 300);
        }
    }
    res.json({
        engine: 'RapidAPI (YouTube Video and Shorts Downloader)',
        host: RAPIDAPI_HOST,
        apiKeyLoaded: !!RAPIDAPI_KEY,
        testResult
    });
});

app.listen(PORT, () => {
    console.log(`\n🚀 OmniLoad server running on http://localhost:${PORT}`);
    console.log(`   Engine: RapidAPI - YouTube Video and Shorts Downloader`);
    console.log(`   API Key: ${RAPIDAPI_KEY ? '✅ Loaded' : '❌ Not set (downloads will fail)'}`);
    console.log('');
});
