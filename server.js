const express = require('express');
const cors = require('cors');
const path = require('path');
const ytdl = require('@distube/ytdl-core');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

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

        const info = await ytdl.getInfo(videoUrl);
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
        let errorMsg = 'Failed to retrieve video information.';

        if (error.message?.includes('Sign in to confirm')) {
            errorMsg = 'YouTube requires sign-in verification for this video.';
        } else if (error.message?.includes('not available') || error.message?.includes('unavailable') || error.message?.includes('private')) {
            errorMsg = 'This video is private, deleted, or unavailable.';
        } else if (error.message?.includes('get a client identity') || error.message?.includes('innertube')) {
            errorMsg = 'YouTube API temporarily blocked. Please try again in a few seconds.';
        } else {
            errorMsg = error.message?.substring(0, 100) || errorMsg;
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

        const info = await ytdl.getInfo(videoUrl);
        const format = info.formats.find(f => f.itag === parseInt(itag));

        if (!format || !format.url) {
            return res.status(404).json({ error: 'Format not found.' });
        }

        // Return the direct download URL — user's browser downloads directly from YouTube
        res.json({ downloadUrl: format.url });

    } catch (error) {
        console.error('Error in /api/download:', error.message);
        res.status(500).json({ error: 'Download failed. Please try again.' });
    }
});

// Debug endpoint
app.get('/api/debug', async (req, res) => {
    let testResult = 'not tested';
    if (req.query.test) {
        try {
            const testUrl = req.query.url || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
            const info = await ytdl.getInfo(testUrl);
            testResult = 'SUCCESS: ' + info.videoDetails.title + ' (' + info.formats.length + ' formats)';
        } catch (e) {
            testResult = 'FAIL: ' + (e.message || 'unknown error').substring(0, 300);
        }
    }
    res.json({ engine: '@distube/ytdl-core', testResult });
});

app.listen(PORT, () => {
    console.log(`OmniLoad server running on http://localhost:${PORT}`);
});
