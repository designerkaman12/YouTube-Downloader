const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Cobalt API endpoint (public instance)
const COBALT_API = 'https://api.cobalt.tools';

// Proxy endpoint to bypass 403 Forbidden on thumbnails (e.g. from Instagram)
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

// Main API: Get download links via Cobalt API
app.get('/api/info', async (req, res) => {
    try {
        let videoUrl = req.query.url;
        if (!videoUrl) return res.status(400).json({ error: 'URL required' });

        // Detect platform from URL
        const platform = detectPlatform(videoUrl);

        // Get multiple quality options by requesting different qualities
        const qualities = ['max', '1080', '720', '480', '360'];
        const results = [];

        // First, get the default (max quality) response to check status
        const mainResponse = await cobaltRequest(videoUrl, { quality: 'max' });

        if (mainResponse.status === 'error') {
            return res.status(500).json({ error: mainResponse.text || 'Failed to process this link.' });
        }

        if (mainResponse.status === 'rate-limit') {
            return res.status(429).json({ error: 'Too many requests. Please wait a moment.' });
        }

        // Handle picker (Instagram carousels, etc.)
        if (mainResponse.status === 'picker') {
            return res.json({
                title: 'Media Collection',
                thumbnail: mainResponse.picker?.[0]?.thumb || '',
                extractor: platform,
                type: 'picker',
                picker: mainResponse.picker,
                audio: mainResponse.audio || null
            });
        }

        // For redirect/stream: build format list
        const downloadUrl = mainResponse.url;

        // Get audio-only version
        let audioUrl = null;
        try {
            const audioResponse = await cobaltRequest(videoUrl, { quality: 'max', audioOnly: true });
            if (audioResponse.status === 'redirect' || audioResponse.status === 'stream') {
                audioUrl = audioResponse.url;
            }
        } catch (e) { /* audio not available for this platform */ }

        // Build format cards for different qualities
        const formats = [];

        for (const q of qualities) {
            formats.push({
                quality: q === 'max' ? 'Best' : q + 'p',
                qualityValue: q,
                type: 'video',
                hasVideo: true,
                hasAudio: true,
            });
        }

        if (audioUrl) {
            formats.push({
                quality: 'MP3 Audio',
                qualityValue: 'audio',
                type: 'audio',
                hasVideo: false,
                hasAudio: true,
                directUrl: audioUrl
            });
        }

        // Try to get video title from YouTube oEmbed or default
        let title = 'Download Ready';
        let thumbnail = '';
        try {
            if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
                const oembedRes = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(videoUrl)}&format=json`);
                if (oembedRes.ok) {
                    const oembed = await oembedRes.json();
                    title = oembed.title || title;
                    thumbnail = oembed.thumbnail_url || '';
                }
            } else if (videoUrl.includes('instagram.com')) {
                title = 'Instagram Media';
                thumbnail = '';
            } else if (videoUrl.includes('tiktok.com')) {
                title = 'TikTok Video';
            } else if (videoUrl.includes('twitter.com') || videoUrl.includes('x.com')) {
                title = 'Twitter/X Media';
            }
        } catch (e) { /* oembed failed, use defaults */ }

        res.json({
            title,
            thumbnail,
            extractor: platform,
            type: 'single',
            formats,
            directUrl: downloadUrl
        });

    } catch (error) {
        console.error('Error in /api/info:', error.message);
        let errorMsg = 'Failed to process this link.';

        if (error.message?.includes('fetch failed') || error.message?.includes('ECONNREFUSED')) {
            errorMsg = 'Download service is temporarily unavailable. Try again in a moment.';
        }

        res.status(500).json({ error: errorMsg });
    }
});

// Download endpoint: fetches from Cobalt with specific quality
app.get('/api/download', async (req, res) => {
    try {
        const videoUrl = req.query.url;
        const quality = req.query.quality || 'max';
        const type = req.query.type || 'video';

        if (!videoUrl) return res.status(400).json({ error: 'URL required' });

        const options = {
            quality: quality === 'Best' ? 'max' : quality.replace('p', ''),
        };

        if (type === 'audio') {
            options.audioOnly = true;
            options.aFormat = 'mp3';
        }

        const response = await cobaltRequest(videoUrl, options);

        if (response.status === 'error') {
            return res.status(500).json({ error: response.text || 'Download failed.' });
        }

        if (response.status === 'redirect' || response.status === 'stream') {
            return res.json({ downloadUrl: response.url });
        }

        res.status(500).json({ error: 'Unexpected response from download service.' });
    } catch (error) {
        console.error('Error in /api/download:', error.message);
        res.status(500).json({ error: 'Download failed. Please try again.' });
    }
});

// ----- Helper Functions -----

async function cobaltRequest(url, options = {}) {
    const body = {
        url: url,
        videoQuality: options.quality || 'max',
        filenameStyle: 'pretty',
        youtubeVideoCodec: 'h264',
    };

    if (options.audioOnly) {
        body.downloadMode = 'audio';
        body.audioFormat = options.aFormat || 'mp3';
    } else {
        body.downloadMode = 'auto';
    }

    const response = await fetch(`${COBALT_API}/`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Cobalt API error (${response.status}): ${text}`);
    }

    return await response.json();
}

function detectPlatform(url) {
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'YouTube';
    if (url.includes('instagram.com')) return 'Instagram';
    if (url.includes('tiktok.com')) return 'TikTok';
    if (url.includes('twitter.com') || url.includes('x.com')) return 'Twitter';
    if (url.includes('facebook.com') || url.includes('fb.watch')) return 'Facebook';
    if (url.includes('reddit.com')) return 'Reddit';
    if (url.includes('soundcloud.com')) return 'SoundCloud';
    if (url.includes('pinterest.com') || url.includes('pin.it')) return 'Pinterest';
    if (url.includes('twitch.tv')) return 'Twitch';
    if (url.includes('vimeo.com')) return 'Vimeo';
    return 'Media';
}

// Debug endpoint
app.get('/api/debug', async (req, res) => {
    let testResult = 'not tested';
    if (req.query.test) {
        try {
            const testUrl = req.query.url || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
            const result = await cobaltRequest(testUrl, { quality: '720' });
            testResult = `${result.status}: ${result.url || result.text || 'no url'}`;
        } catch (e) {
            testResult = 'FAIL: ' + e.message?.substring(0, 300);
        }
    }
    res.json({ api: COBALT_API, testResult });
});

app.listen(PORT, () => {
    console.log(`OmniLoad server running on http://localhost:${PORT}`);
});
