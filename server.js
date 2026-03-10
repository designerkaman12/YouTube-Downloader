const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const ytdl = require('@distube/ytdl-core');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// ─── COOKIE-BASED AGENT SETUP ──────────────────────────────────
// This is the KEY fix: YouTube blocks cloud server IPs unless
// requests come with valid browser cookies proving a real user.
// We parse cookies.txt and create a proper ytdl agent.

let ytdlAgent = null;

function setupCookieAgent() {
    // Priority 1: Read from YT_COOKIES env var (for Render deployment)
    let cookieData = process.env.YT_COOKIES || '';

    // Priority 2: Fall back to cookies.txt file
    const cookiesFilePath = path.join(__dirname, 'cookies.txt');
    if (!cookieData && fs.existsSync(cookiesFilePath)) {
        cookieData = fs.readFileSync(cookiesFilePath, 'utf-8');
    }

    if (!cookieData) {
        console.warn('⚠️  No cookies found. YouTube WILL block requests from cloud servers.');
        console.warn('   Fix: Add cookies.txt or set YT_COOKIES env var on Render.');
        return null;
    }

    try {
        // Parse Netscape cookie format into cookie objects
        const cookies = [];
        const lines = cookieData.split('\n');

        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('//')) continue;

            const parts = trimmed.split('\t');
            if (parts.length >= 7) {
                cookies.push({
                    domain: parts[0],
                    httpOnly: parts[1] === 'TRUE',
                    path: parts[2],
                    secure: parts[3] === 'TRUE',
                    expires: parseInt(parts[4]) || 0,
                    name: parts[5],
                    value: parts[6]
                });
            }
        }

        if (cookies.length === 0) {
            console.warn('⚠️  Cookies file found but no valid cookies parsed.');
            return null;
        }

        // Create the ytdl agent with cookies
        const agent = ytdl.createAgent(cookies);
        console.log(`✅ Cookie agent created with ${cookies.length} cookies.`);
        return agent;

    } catch (err) {
        console.error('❌ Failed to create cookie agent:', err.message);
        // Try alternative: create agent from cookies with different parsing
        try {
            // Direct approach: read cookies as simple key-value for header
            const cookieHeader = parseCookiesAsHeader(cookieData);
            if (cookieHeader) {
                console.log('✅ Fallback cookie header created.');
                return { cookieHeader };
            }
        } catch (e) {
            console.error('❌ Fallback cookie parsing also failed:', e.message);
        }
        return null;
    }
}

function parseCookiesAsHeader(cookieData) {
    const pairs = [];
    const lines = cookieData.split('\n');
    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const parts = trimmed.split('\t');
        if (parts.length >= 7) {
            pairs.push(`${parts[5]}=${parts[6]}`);
        }
    }
    return pairs.length > 0 ? pairs.join('; ') : null;
}

ytdlAgent = setupCookieAgent();

// ─── HELPER: Get ytdl options with cookies ─────────────────────
function getYtdlOptions() {
    const opts = {
        requestOptions: {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
                'Accept-Language': 'en-US,en;q=0.9',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            }
        }
    };

    if (ytdlAgent) {
        if (ytdlAgent.cookieHeader) {
            // Fallback mode: add cookie as header
            opts.requestOptions.headers['Cookie'] = ytdlAgent.cookieHeader;
        } else {
            // Proper agent mode
            opts.agent = ytdlAgent;
        }
    }

    return opts;
}

// ─── HELPER: Fetch info with retry ─────────────────────────────
async function getInfoWithRetry(videoUrl, maxRetries = 3) {
    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`  ↳ Attempt ${attempt}/${maxRetries}...`);
            const options = getYtdlOptions();
            const info = await ytdl.getInfo(videoUrl, options);
            console.log(`  ✅ Success on attempt ${attempt}`);
            return info;
        } catch (err) {
            lastError = err;
            const msg = err.message || '';
            console.log(`  ❌ Attempt ${attempt} failed: ${msg.substring(0, 150)}`);

            // Don't retry if video genuinely doesn't exist
            if (msg.includes('Video unavailable') || msg.includes('Private video') ||
                msg.includes('removed') || msg.includes('not exist') ||
                msg.includes('not a valid YouTube')) {
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

// Proxy endpoint to bypass 403 Forbidden on thumbnails
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

// Main API: Get video info and formats
app.get('/api/info', async (req, res) => {
    try {
        let videoUrl = req.query.url;
        if (!videoUrl) return res.status(400).json({ error: 'URL required' });

        // Validate URL looks like YouTube
        if (!ytdl.validateURL(videoUrl)) {
            return res.status(400).json({ error: 'Invalid or unsupported URL. Currently supports YouTube links.' });
        }

        console.log(`\n📥 Fetching info for ${videoUrl} ...`);
        const info = await getInfoWithRetry(videoUrl);
        const details = info.videoDetails;

        const title = details.title || 'Unknown Title';
        const thumbnail = details.thumbnails?.length
            ? details.thumbnails[details.thumbnails.length - 1].url
            : '';
        const duration = details.lengthSeconds || 0;
        const author = details.author?.name || '';

        // Get downloadable formats
        const allFormats = info.formats;

        // Video + Audio combined formats
        let videoFormats = allFormats
            .filter(f => f.hasVideo && f.hasAudio && f.container === 'mp4')
            .map(f => ({
                itag: f.itag,
                qualityLabel: f.qualityLabel || `${f.height}p`,
                mimeType: f.mimeType,
                hasVideo: true,
                hasAudio: true,
                contentLength: parseInt(f.contentLength) || 0,
                height: f.height,
                width: f.width,
                url: f.url
            }));

        // Remove duplicates by height
        const seen = new Set();
        videoFormats = videoFormats.filter(f => {
            const key = f.height || f.qualityLabel;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });

        // Sort by height descending
        videoFormats.sort((a, b) => (b.height || 0) - (a.height || 0));

        // Audio-only formats
        let audioFormats = allFormats
            .filter(f => f.hasAudio && !f.hasVideo)
            .map(f => ({
                itag: f.itag,
                qualityLabel: `${f.audioBitrate || 128}kbps`,
                mimeType: f.mimeType,
                hasVideo: false,
                hasAudio: true,
                contentLength: parseInt(f.contentLength) || 0,
                audioBitrate: f.audioBitrate,
                url: f.url
            }));

        // Keep best audio only
        audioFormats.sort((a, b) => (b.audioBitrate || 0) - (a.audioBitrate || 0));
        audioFormats = audioFormats.slice(0, 2);

        // If no combined formats, get video-only + best audio
        if (videoFormats.length === 0) {
            const videoOnly = allFormats
                .filter(f => f.hasVideo && !f.hasAudio && f.container === 'mp4')
                .map(f => ({
                    itag: f.itag,
                    qualityLabel: f.qualityLabel || `${f.height}p`,
                    mimeType: f.mimeType,
                    hasVideo: true,
                    hasAudio: false,
                    contentLength: parseInt(f.contentLength) || 0,
                    height: f.height,
                    width: f.width,
                    url: f.url,
                    videoOnly: true
                }));

            const seenVO = new Set();
            videoFormats = videoOnly.filter(f => {
                const key = f.height;
                if (seenVO.has(key)) return false;
                seenVO.add(key);
                return true;
            });
            videoFormats.sort((a, b) => (b.height || 0) - (a.height || 0));
        }

        const formats = [...videoFormats, ...audioFormats];

        res.json({
            title,
            thumbnail,
            duration,
            author,
            extractor: 'YouTube',
            formats
        });

    } catch (error) {
        console.error('Error fetching info:', error.message);
        let errorMsg = 'Failed to process this link.';

        if (error.message?.includes('Sign in to confirm')) {
            errorMsg = 'YouTube requires sign-in verification. Server cookies may have expired — please refresh them.';
        } else if (error.message?.includes('not available') || error.message?.includes('unavailable') || error.message?.includes('private')) {
            errorMsg = 'This video is private, deleted, or unavailable.';
        } else if (error.message?.includes('get a client identity') || error.message?.includes('innertube')) {
            errorMsg = 'YouTube API temporarily blocked. Please try again in a few seconds.';
        } else if (error.message?.includes('bot')) {
            errorMsg = 'YouTube detected bot access. Server cookies may need to be refreshed.';
        } else {
            errorMsg = error.message?.substring(0, 150) || errorMsg;
        }

        res.status(500).json({ error: errorMsg });
    }
});

// Download endpoint: stream/proxy the video to the user
app.get('/api/download', async (req, res) => {
    try {
        const videoUrl = req.query.url;
        const itag = req.query.itag;

        if (!videoUrl || !itag) {
            return res.status(400).json({ error: 'URL and itag required' });
        }

        console.log(`\n⬇️  Download request: itag=${itag} for ${videoUrl}`);
        const info = await getInfoWithRetry(videoUrl);
        const format = info.formats.find(f => f.itag === parseInt(itag));

        if (!format || !format.url) {
            return res.status(404).json({ error: 'Format not found.' });
        }

        // Return the direct download URL
        res.json({ downloadUrl: format.url });

    } catch (error) {
        console.error('Error in /api/download:', error.message);
        res.status(500).json({ error: 'Download failed. Please try again.' });
    }
});

// Health/Status endpoint
app.get('/api/status', (req, res) => {
    res.json({
        status: 'ok',
        engine: '@distube/ytdl-core',
        cookiesLoaded: !!ytdlAgent,
        uptime: Math.floor(process.uptime()) + 's'
    });
});

// Debug endpoint
app.get('/api/debug', async (req, res) => {
    let testResult = 'not tested';
    if (req.query.test) {
        try {
            const testUrl = req.query.url || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
            const info = await getInfoWithRetry(testUrl, 2);
            testResult = 'SUCCESS: ' + info.videoDetails.title + ' (' + info.formats.length + ' formats)';
        } catch (e) {
            testResult = 'FAIL: ' + (e.message || 'unknown error').substring(0, 300);
        }
    }
    res.json({
        engine: '@distube/ytdl-core',
        cookiesLoaded: !!ytdlAgent,
        testResult
    });
});

// Endpoint to refresh cookies at runtime (POST with cookie text body)
app.post('/api/refresh-cookies', express.text({ limit: '50kb' }), (req, res) => {
    const secret = req.query.key;
    const expectedKey = process.env.ADMIN_KEY || 'omniload-admin';

    if (secret !== expectedKey) {
        return res.status(403).json({ error: 'Unauthorized' });
    }

    try {
        // Save to file
        const cookiesFilePath = path.join(__dirname, 'cookies.txt');
        fs.writeFileSync(cookiesFilePath, req.body, 'utf-8');

        // Reload agent
        ytdlAgent = setupCookieAgent();

        res.json({ success: true, cookiesLoaded: !!ytdlAgent });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`\n🚀 OmniLoad server running on http://localhost:${PORT}`);
    console.log(`   Cookies: ${ytdlAgent ? '✅ Loaded' : '❌ Not loaded (YouTube will likely block requests)'}`);
    console.log('');
});
