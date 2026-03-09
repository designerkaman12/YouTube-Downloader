const express = require('express');
const cors = require('cors');
const youtubedl = require('youtube-dl-exec');
const ffmpeg = require('ffmpeg-static');
const path = require('path');
const fs = require('fs');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Proxy endpoint to bypass 403 Forbidden on thumbnails (e.g. from Instagram)
app.get('/api/thumbnail', async (req, res) => {
    let imageUrl = req.query.url;
    if (!imageUrl) return res.status(400).send('URL is required');

    try {
        const fetchRes = await fetch(imageUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9',
            },
            redirect: 'follow'
        });

        if (!fetchRes.ok) throw new Error(`HTTP Error: ${fetchRes.status}`);

        const arrayBuffer = await fetchRes.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        res.set('Content-Type', fetchRes.headers.get('content-type') || 'image/jpeg');
        res.set('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
        res.send(buffer);
    } catch (e) {
        console.error('Thumbnail Proxy Error:', e.message);
        res.redirect('https://via.placeholder.com/320x180?text=No+Thumbnail');
    }
});

const DOWNLOAD_DIR = path.join(__dirname, 'downloads');
if (!fs.existsSync(DOWNLOAD_DIR)) {
    fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });
}

// YouTube Cookies: write from env var to a file for yt-dlp
const COOKIES_PATH = path.join(__dirname, 'cookies.txt');
if (process.env.YT_COOKIES) {
    fs.writeFileSync(COOKIES_PATH, process.env.YT_COOKIES, 'utf8');
    console.log('YouTube cookies loaded from environment variable.');
} else if (fs.existsSync(COOKIES_PATH)) {
    console.log('YouTube cookies file found on disk.');
} else {
    console.log('No YouTube cookies found. Some videos may be blocked by bot verification.');
}

// Helper: return yt-dlp base options (with cookies if available)
const getYtDlpOptions = (extra = {}) => {
    const opts = {
        noCheckCertificates: true,
        noWarnings: true,
        noCacheDir: true,
        addHeader: ['referer:youtube.com', 'User-Agent:Mozilla/5.0 (ChromiumStylePlatform) Cobalt/Version'],
        ...extra
    };
    if (fs.existsSync(COOKIES_PATH)) {
        opts.cookies = COOKIES_PATH;
    } else {
        opts.extractorArgs = 'youtube:player_client=tv;player_skip=webpage,configs';
    }
    return opts;
};

// Auto-update yt-dlp binary on server startup for latest YouTube fixes
const { execSync } = require('child_process');
try {
    const ytdlpPath = require('youtube-dl-exec').constants?.YOUTUBE_DL_PATH;
    if (ytdlpPath) {
        console.log('Updating yt-dlp binary...');
        execSync(`${ytdlpPath} -U`, { timeout: 30000 });
        console.log('yt-dlp updated successfully.');
    }
} catch (e) {
    console.log('yt-dlp update skipped:', e.message?.substring(0, 80));
}

// Store download progress and state internally
const activeDownloads = {};

// Debug endpoint to check server state
app.get('/api/debug', (req, res) => {
    const cookiesExist = fs.existsSync(COOKIES_PATH);
    let cookiesSize = 0;
    if (cookiesExist) {
        cookiesSize = fs.statSync(COOKIES_PATH).size;
    }
    res.json({
        cookiesPath: COOKIES_PATH,
        cookiesExist,
        cookiesSize,
        dirname: __dirname,
        files: fs.readdirSync(__dirname).filter(f => !f.startsWith('node_modules') && !f.startsWith('.'))
    });
});

app.get('/api/info', async (req, res) => {
    try {
        let videoUrl = req.query.url;
        if (!videoUrl) return res.status(400).json({ error: 'URL required' });

        // Removed YouTube-specific URL parsing. Let yt-dlp handle it dynamically.

        const info = await youtubedl(videoUrl, getYtDlpOptions({
            dumpSingleJson: true,
            noPlaylist: true
        }));

        const title = info.title || 'Unknown Title';
        const thumbnail = info.thumbnail || '';
        const extractor = info.extractor_key || info.extractor || 'Unknown Platform';

        let formats = info.formats.map(f => ({
            itag: f.format_id,
            qualityLabel: f.format_note || f.resolution || 'Audio',
            mimeType: f.ext,
            hasVideo: f.vcodec !== 'none',
            hasAudio: f.acodec !== 'none',
            contentLength: f.filesize || f.filesize_approx || 0,
            vcodec: f.vcodec,
            acodec: f.acodec,
            width: f.width,
            height: f.height
        }));

        res.json({ title, thumbnail, extractor, formats });
    } catch (error) {
        console.error('Error fetching info:', error.message);
        let errorMsg = 'Failed to retrieve media properties.';
        const rawError = error.stderr || error.message || '';

        if (rawError.includes('Sign in to confirm')) {
            errorMsg = 'This platform requires sign-in or bot verification.';
        } else if (rawError.includes('video is not available') || rawError.includes('Video unavailable') || rawError.includes('Private video')) {
            errorMsg = 'This video is private, deleted, or unavailable.';
        } else if (rawError.includes('Unsupported URL')) {
            errorMsg = 'This link format or platform is not supported.';
        } else {
            const match = rawError.match(/ERROR:\s*([^\n]+)/);
            if (match && match[1]) {
                errorMsg = match[1].substring(0, 80) + (match[1].length > 80 ? '...' : '');
            } else {
                errorMsg = 'Server failed to parse link details.';
            }
        }
        res.status(500).json({ error: errorMsg });
    }
});

// Endpoint to initiate download and get a Task ID
app.get('/api/prepare', async (req, res) => {
    try {
        let videoUrl = req.query.url;
        const itag = req.query.itag;
        const type = req.query.type;

        // Removed YouTube-specific URL parsing in prepare as well.

        console.log(`User requested PREPARE (Type: ${type}, Format: ${itag}) on ${videoUrl}`);

        const info = await youtubedl(videoUrl, getYtDlpOptions({
            dumpSingleJson: true
        }));
        let targetFormat = info.formats.find(f => f.format_id === itag);
        if (!targetFormat && itag !== 'best') {
            return res.status(400).send('Format not found.');
        }

        const cleanTitle = (info.title || 'media').replace(/[^\w\s-]/g, '').trim() || 'media';
        const taskId = Date.now().toString() + Math.floor(Math.random() * 1000).toString();

        let filename = type === 'audio' ? `${cleanTitle}.mp3` : `${cleanTitle}.mp4`;
        const outputPath = path.join(DOWNLOAD_DIR, `${taskId}_${filename}`);

        let dlOptions = {
            output: outputPath,
            ffmpegLocation: ffmpeg,
            noWarnings: true,
            newline: true,
            concurrentFragments: 8,
            bufferSize: '1024K',
            httpChunkSize: '10M'
        };

        if (type === 'audio') {
            dlOptions.extractAudio = true;
            dlOptions.audioFormat = 'mp3';
        } else {
            let formatStr = itag ? `${itag}+bestaudio[ext=m4a]/best` : 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best';
            dlOptions.format = formatStr;
            dlOptions.mergeOutputFormat = 'mp4';
        }

        activeDownloads[taskId] = { progress: 0, status: 'downloading', file: filename, path: outputPath };
        res.json({ taskId });

        const subprocess = youtubedl.exec(videoUrl, dlOptions);

        subprocess.stdout.on('data', (data) => {
            const line = data.toString();
            // Regex to parse [download] 50.5% of...
            const progressMatch = line.match(/\[download\]\s+([\d.]+)%/);
            if (progressMatch) {
                activeDownloads[taskId].progress = parseFloat(progressMatch[1]);
            }
        });

        subprocess.on('close', (code) => {
            if (code === 0) {
                activeDownloads[taskId].progress = 100;
                activeDownloads[taskId].status = 'done';
            } else {
                activeDownloads[taskId].status = 'error';
            }
        });

        subprocess.catch(err => {
            console.error('yt-dlp exec error catch triggered:', err.message);
            if (err.stderr) {
                console.error('yt-dlp stderr:', err.stderr);
            }
            if (err.stdout) {
                console.error('yt-dlp stdout:', err.stdout);
            }
            activeDownloads[taskId].status = 'error';
        });

    } catch (error) {
        console.error('Error in /api/prepare:', error.message);
        let errorMsg = 'Failed to prepare download.';
        const rawError = error.stderr || error.message || '';

        if (rawError.includes('Sign in to confirm')) {
            errorMsg = 'This platform requires sign-in or bot verification.';
        } else {
            const match = rawError.match(/ERROR:\s*([^\n]+)/);
            if (match && match[1]) {
                errorMsg = match[1].substring(0, 80) + (match[1].length > 80 ? '...' : '');
            }
        }
        res.status(500).json({ error: errorMsg });
    }
});

// SSE endpoint to broadcast progress
app.get('/api/progress', (req, res) => {
    const taskId = req.query.id;
    if (!taskId || !activeDownloads[taskId]) {
        return res.status(404).json({ error: 'Task not found' });
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const interval = setInterval(() => {
        const task = activeDownloads[taskId];
        if (!task) {
            clearInterval(interval);
            return res.end();
        }

        res.write(`data: ${JSON.stringify({ progress: task.progress, status: task.status })}\n\n`);

        if (task.status === 'done' || task.status === 'error') {
            clearInterval(interval);
            res.end();
        }
    }, 500);

    req.on('close', () => {
        clearInterval(interval);
    });
});

// Final endpoint to serve the completed file to the user
app.get('/api/serve', (req, res) => {
    const taskId = req.query.id;
    const task = activeDownloads[taskId];

    if (!task || task.status !== 'done') {
        return res.status(400).send('File not ready or does not exist.');
    }

    res.download(task.path, task.file, (err) => {
        // Cleanup after download sent
        if (fs.existsSync(task.path)) {
            fs.unlinkSync(task.path);
        }
        delete activeDownloads[taskId];
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
