const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const youtubedl = require('youtube-dl-exec');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// ─── API CONFIGURATION ────────────────────────────────────────
// Hybrid approach:
// - YouTube: youtube-dl-exec (direct streaming from server, avoids ytdl-core 403s and IP Locks)
// - Other platforms: Auto Download All In One RapidAPI

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || '';
const API_HOST = 'auto-download-all-in-one.p.rapidapi.com';

const cookiesPath = path.join(__dirname, 'cookies.txt');
const hasCookiesFile = fs.existsSync(cookiesPath);
const YT_COOKIES_ENV = process.env.YT_COOKIES || '';

console.log(`🔑 API Key loaded: ${RAPIDAPI_KEY ? 'Yes' : 'NOT SET'}`);
if (hasCookiesFile) {
    console.log(`🍪 Found cookies.txt for YouTube Bot Bypass`);
} else if (YT_COOKIES_ENV) {
    console.log(`🍪 Found YT_COOKIES environment config for YouTube Bot Bypass`);
} else {
    console.log(`⚠️  No YouTube cookies provided. You may experience bot-detection issues.`);
}

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

// ─── YOUTUBE: Get info using youtube-dl-exec ────────────────────────
async function getYouTubeInfo(url) {
    console.log(`  🎬 Getting YouTube info via yt-dlp...`);
    
    const ytDlpOptions = {
        dumpJson: true,
        noWarnings: true,
        noCheckCertificate: true,
        noPlaylist: true, // Prevent processing entire playlists/mixes
    };

    if (hasCookiesFile) {
        ytDlpOptions.cookies = cookiesPath;
    }

    const info = await youtubedl(url, ytDlpOptions);

    const formats = [];

    info.formats.forEach(f => {
        // Skip storyboards/thumbnails
        if (f.protocol === 'mhtml' || f.format_id.startsWith('sb')) return;

        // Simplify format sizes and features
        const fileSize = f.filesize || f.filesize_approx || 0;
        
        formats.push({
            quality: f.format_note || f.resolution || `${f.height}p` || 'audio',
            url: '', // Don't expose URL, use stream endpoint
            itag: f.format_id,
            extension: f.ext || 'mp4',
            type: f.vcodec !== 'none' ? 'video' : 'audio',
            size: fileSize ? formatBytes(fileSize) : '',
            audioAvailable: f.acodec !== 'none',
            hasAudio: f.acodec !== 'none',
            codec: (f.vcodec !== 'none' ? f.vcodec : f.acodec) || ''
        });
    });

    const filteredFormats = formats.filter(f => f.type === 'video' || f.type === 'audio');
    
    return {
        success: true,
        platform: 'YouTube',
        title: info.title || 'Untitled',
        author: info.uploader || info.channel || 'Unknown',
        thumbnail: info.thumbnail || '',
        duration: info.duration || 0,
        formats: filteredFormats,
        source: 'youtube',
        url: url
    };
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
        // YOUTUBE: Use youtube-dl-exec
        if (isYouTube(url)) {
            try {
                const result = await getYouTubeInfo(url);
                console.log(`  ✅ YouTube: ${result.formats.length} formats for "${result.title.substring(0, 50)}"`);
                return res.json(result);
            } catch (ytError) {
                console.warn(`  ⚠️ YouTube (yt-dlp) failed: ${ytError.message}. Falling back to RapidAPI...`);
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

// ─── API ENDPOINT: /api/stream ────────────────────────────────
// Streams YouTube video/audio directly from server (bypasses IP-lock)
app.get('/api/stream', async (req, res) => {
    const url = req.query.url;
    const itag = req.query.itag;
    const filename = req.query.filename || 'download.mp4';

    if (!url) {
        return res.status(400).json({ error: 'Missing "url" parameter' });
    }

    console.log(`\n⬇️  STREAM request: ${url.substring(0, 80)}... itag=${itag}`);

    try {
        if (!isYouTube(url)) {
            // For non-YouTube, redirect to the URL directly
            return res.redirect(req.query.directUrl || url);
        }

        let formatQuery = 'bestvideo+bestaudio/best';
        if (itag) {
            formatQuery = itag;
        }

        // Set download headers
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Type', 'application/octet-stream');

        // Stream directly from YouTube through our server
        const ytDlpOptions = {
            format: formatQuery,
            noWarnings: true,
            noCheckCertificate: true,
            o: '-' // Write to stdout
        };

        if (hasCookiesFile) {
            ytDlpOptions.cookies = cookiesPath;
        }

        const subprocess = youtubedl.exec(url, ytDlpOptions);

        subprocess.stdout.pipe(res);

        subprocess.stderr.on('data', (err) => {
            const msg = err.toString();
            if (msg.toLowerCase().includes('error')) {
                console.error(`  ❌ Stream error: ${msg}`);
            }
        });

        subprocess.on('close', (code) => {
            if (code === 0) {
                 console.log(`  ✅ Stream complete: ${filename}`);
            } else {
                 console.log(`  ❌ Stream exited with code ${code}`);
                 if (!res.headersSent) res.status(500).end();
            }
        });

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

        // Extract a referer from the download URL if possible
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
        engine: 'Hybrid: youtube-dl-exec (YouTube) + RapidAPI (others)',
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
    console.log(`🎬 YouTube: Direct streaming via youtube-dl-exec`);
    console.log(`📡 Other platforms: Auto Download All In One (RapidAPI)`);
    if (!RAPIDAPI_KEY) {
        console.log(`⚠️  WARNING: RAPIDAPI_KEY not set! Non-YouTube downloads won't work.`);
    }
    if (!hasCookiesFile && !YT_COOKIES_ENV) {
        console.log(`⚠️  WARNING: No YouTube cookies provided. You may get blocked by YouTube.`);
    }
});
