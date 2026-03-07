const express = require('express');
const cors = require('cors');
const youtubedl = require('youtube-dl-exec');
const ffmpeg = require('ffmpeg-static');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const DOWNLOAD_DIR = path.join(__dirname, 'downloads');
if (!fs.existsSync(DOWNLOAD_DIR)) {
    fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });
}

// Store download progress and state internally
const activeDownloads = {};

app.get('/api/info', async (req, res) => {
    try {
        let videoUrl = req.query.url;
        if (!videoUrl) return res.status(400).json({ error: 'URL required' });

        try {
            const parsed = new URL(videoUrl);
            if (parsed.hostname.includes('youtube.com') && parsed.pathname === '/watch') {
                const v = parsed.searchParams.get('v');
                if (v) videoUrl = `https://www.youtube.com/watch?v=${v}`;
            } else if (parsed.hostname.includes('youtu.be')) {
                videoUrl = `https://youtu.be${parsed.pathname}`;
            }
        } catch (e) { }

        console.log(`Fetching info for ${videoUrl} ...`);
        const info = await youtubedl(videoUrl, {
            dumpSingleJson: true,
            noCheckCertificates: true,
            noWarnings: true,
            addHeader: ['referer:youtube.com'],
            extractorArgs: 'youtube:player_client=android'
        });

        const title = info.title;
        const thumbnail = info.thumbnail;

        let formats = info.formats.map(f => ({
            itag: f.format_id,
            qualityLabel: f.format_note || f.resolution || 'Audio',
            mimeType: f.ext,
            hasVideo: f.vcodec !== 'none',
            hasAudio: f.acodec !== 'none',
            contentLength: f.filesize || f.filesize_approx || 0,
            vcodec: f.vcodec,
            acodec: f.acodec
        }));

        res.json({ title, thumbnail, formats });
    } catch (error) {
        console.error('Error fetching info:', error);
        res.status(500).json({ error: 'YT-DLP Error: ' + (error.message || 'Failed to retrieve info') });
    }
});

// Endpoint to initiate download and get a Task ID
app.get('/api/prepare', async (req, res) => {
    try {
        let videoUrl = req.query.url;
        const itag = req.query.itag;
        const type = req.query.type;

        try {
            const parsed = new URL(videoUrl);
            if (parsed.hostname.includes('youtube.com') && parsed.pathname === '/watch') {
                const v = parsed.searchParams.get('v');
                if (v) videoUrl = `https://www.youtube.com/watch?v=${v}`;
            } else if (parsed.hostname.includes('youtu.be')) {
                videoUrl = `https://youtu.be${parsed.pathname}`;
            }
        } catch (e) { }

        console.log(`User requested PREPARE (Type: ${type}, Format: ${itag}) on ${videoUrl}`);

        const info = await youtubedl(videoUrl, { dumpSingleJson: true });
        let targetFormat = info.formats.find(f => f.format_id === itag);
        if (!targetFormat && itag !== 'best') {
            return res.status(400).send('Format not found.');
        }

        const cleanTitle = info.title.replace(/[^\w\s-]/g, '').trim();
        const taskId = Date.now().toString() + Math.floor(Math.random() * 1000).toString();

        let filename = type === 'audio' ? `${cleanTitle}.mp3` : `${cleanTitle}.mp4`;
        const outputPath = path.join(DOWNLOAD_DIR, `${taskId}_${filename}`);

        let dlOptions = {
            output: outputPath,
            ffmpegLocation: ffmpeg,
            noWarnings: true,
            newline: true,
            extractorArgs: 'youtube:player_client=android'
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

        // Spin up background yt-dlp to download to disk safely
        const subprocess = youtubedl.exec(videoUrl, dlOptions, { shell: true });

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
            console.error('yt-dlp exec error:', err.message);
            activeDownloads[taskId].status = 'error';
        });

    } catch (error) {
        console.error('Error in /api/prepare:', error);
        res.status(500).json({ error: 'Failed to prepare download.' });
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
