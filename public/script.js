document.addEventListener('DOMContentLoaded', () => {
    const urlInput = document.getElementById('urlInput');
    const fetchBtn = document.getElementById('fetchBtn');
    const btnText = fetchBtn ? fetchBtn.querySelector('.btn-text') : null;
    const spinner = fetchBtn ? fetchBtn.querySelector('.spinner') : null;

    const errorBox = document.getElementById('errorBox');
    const resultBox = document.getElementById('resultBox');
    const videoThumb = document.getElementById('videoThumb');
    const videoTitle = document.getElementById('videoTitle');
    const videoFormatsContainer = document.getElementById('videoFormats');
    const audioFormatsContainer = document.getElementById('audioFormats');
    const imageFormatsContainer = document.getElementById('imageFormats');

    // --- Dynamic Branding Logic ---
    const params = new URLSearchParams(window.location.search);
    const platform = params.get('p') || 'omniload';

    if (urlInput) {
        const titleEl = document.querySelector('h1 span');
        const descEl = document.querySelector('header p');

        const brandConfig = {
            'youtube': { name: 'YouTube', color: '#ef4444', desc: 'Download Videos, Shorts & MP3s from YouTube in 4K.', placeholder: 'Paste YouTube link here...' },
            'instagram': { name: 'Instagram', color: '#e1306c', desc: 'Save Reels, Posts, and IGTV directly to your device.', placeholder: 'Paste Instagram Reel or Post link...' },
            'tiktok': { name: 'TikTok', color: '#25F4EE', desc: 'Save viral TikTok videos without the annoying watermark.', placeholder: 'Paste TikTok video link here...' },
            'twitter': { name: 'Twitter (X)', color: '#1DA1F2', desc: 'Extract videos and GIFs from any X post instantly.', placeholder: 'Paste X (Twitter) post link here...' },
            'facebook': { name: 'Facebook', color: '#1877F2', desc: 'Download Facebook watch videos & public posts easily.', placeholder: 'Paste Facebook video link...' },
            'audio': { name: 'Audio', color: '#10b981', desc: 'Rip pure MP3 audio from any link on the internet.', placeholder: 'Paste any link to extract MP3...' },
            'omniload': { name: 'Downloader', color: '#6366f1', desc: 'Download video and audio from any platform universally in incredible quality.', placeholder: 'Paste any link you want audio/video/thumbnail/sound effects etc.' }
        };

        const config = brandConfig[platform] || brandConfig['omniload'];
        if (titleEl) {
            titleEl.textContent = config.name === 'Downloader' ? 'Downloader' : config.name;
            document.documentElement.style.setProperty('--primary', config.color);
        }
        if (descEl) descEl.textContent = config.desc;
        if (urlInput) urlInput.placeholder = config.placeholder;
    }

    const formatBytes = (bytes, decimals = 2) => {
        if (!+bytes) return '';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
    };

    const showError = (message) => {
        errorBox.textContent = message;
        errorBox.classList.remove('hidden');
        resultBox.classList.add('hidden');
    };

    const hideError = () => {
        errorBox.classList.add('hidden');
    };

    const toggleLoading = (isLoading) => {
        if (isLoading) {
            btnText.classList.add('hidden');
            spinner.classList.remove('hidden');
            fetchBtn.disabled = true;
            urlInput.disabled = true;
        } else {
            btnText.classList.remove('hidden');
            spinner.classList.add('hidden');
            fetchBtn.disabled = false;
            urlInput.disabled = false;
        }
    };

    const fetchVideoInfo = async () => {
        const url = urlInput.value.trim();
        if (!url || !url.startsWith('http')) {
            showError('Please enter a valid URL');
            return;
        }

        hideError();
        toggleLoading(true);

        try {
            const response = await fetch(`/api/info?url=${encodeURIComponent(url)}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch video information');
            }

            renderResults(data, url);

        } catch (error) {
            showError(error.message);
        } finally {
            toggleLoading(false);
        }
    };

    const renderResults = (data, originalUrl) => {
        // Set Preview
        if (data.thumbnail) {
            videoThumb.src = `/api/thumbnail?url=${encodeURIComponent(data.thumbnail)}`;
        } else {
            videoThumb.src = 'https://via.placeholder.com/320x180?text=No+Thumbnail';
        }
        videoTitle.textContent = data.title || 'Untitled Media';

        const platformBadge = document.getElementById('platformBadge');
        if (platformBadge) {
            platformBadge.textContent = (data.platform || 'Unknown').toUpperCase();
            platformBadge.style.display = 'inline-block';
        }

        // Clear previous formats
        videoFormatsContainer.innerHTML = '';
        audioFormatsContainer.innerHTML = '';
        imageFormatsContainer.innerHTML = '';

        // Add Thumbnail download to Extras
        if (data.thumbnail) {
            const thumbBtn = document.createElement('a');
            thumbBtn.href = `/api/thumbnail?url=${encodeURIComponent(data.thumbnail)}`;
            thumbBtn.target = '_blank';
            thumbBtn.download = 'thumbnail.jpg';
            thumbBtn.className = 'format-item';
            thumbBtn.style.textDecoration = 'none';
            thumbBtn.style.display = 'block';

            thumbBtn.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center; width:100%;">
                    <div style="text-align:left;">
                        <div style="font-weight:600; font-size:1.1rem; margin-bottom: 2px;">High-Res Poster</div>
                        <div style="font-size:0.85rem; color: var(--text-muted)">Save main thumbnail image</div>
                    </div>
                    <div style="background:var(--primary); padding:6px 14px; border-radius:8px; font-size:0.9rem; font-weight:600; display:flex; gap:6px; align-items:center;">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                        Download
                    </div>
                </div>
            `;
            imageFormatsContainer.appendChild(thumbBtn);
        }

        // Split formats based on 'type' field from our API
        let videos = data.formats.filter(f => f.type === 'video');
        let audios = data.formats.filter(f => f.type === 'audio');

        // If no explicit audio type found, check for formats that have audio but aren't video
        if (audios.length === 0) {
            audios = data.formats.filter(f => f.type !== 'video' && f.audioAvailable);
        }

        // Video format buttons
        videos.forEach(format => {
            const label = format.quality || 'Video';
            const audioTag = format.audioAvailable ? ' (Video + Audio)' : ' (Video Only)';
            const ext = format.extension ? ` • ${format.extension.toUpperCase()}` : '';
            const size = format.size || '';
            const safeTitle = (data.title || 'video').replace(/[^a-zA-Z0-9_\- ]/g, '').substring(0, 50);
            const filename = `${safeTitle}_${format.quality || 'video'}.${format.extension || 'mp4'}`;
            const proxyUrl = `/api/proxy?url=${encodeURIComponent(format.url)}&filename=${encodeURIComponent(filename)}`;

            const btn = document.createElement('a');
            btn.className = 'format-item';
            btn.style.width = '100%';
            btn.style.textAlign = 'left';
            btn.style.cursor = 'pointer';
            btn.style.textDecoration = 'none';
            btn.style.display = 'block';
            btn.href = proxyUrl;

            btn.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center; width:100%;">
                    <div style="text-align:left;">
                        <div style="font-weight:600; font-size:1.05rem; margin-bottom: 2px;">${label}${audioTag}</div>
                        <div style="font-size:0.82rem; color: var(--text-muted)">${ext} ${size ? '• ' + size : ''}</div>
                    </div>
                    <div style="background:var(--primary); padding:6px 14px; border-radius:8px; font-size:0.9rem; font-weight:600; display:flex; gap:6px; align-items:center; color:#fff; white-space:nowrap;">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                        Download
                    </div>
                </div>
            `;

            videoFormatsContainer.appendChild(btn);
        });

        // Audio format buttons
        audios.forEach(format => {
            const label = `🎵 Audio ${format.quality || '128kbps'}`;
            const ext = format.extension ? ` • ${format.extension.toUpperCase()}` : '';
            const size = format.size || '';
            const safeTitle = (data.title || 'audio').replace(/[^a-zA-Z0-9_\- ]/g, '').substring(0, 50);
            const filename = `${safeTitle}_audio.${format.extension || 'm4a'}`;
            const proxyUrl = `/api/proxy?url=${encodeURIComponent(format.url)}&filename=${encodeURIComponent(filename)}`;

            const btn = document.createElement('a');
            btn.className = 'format-item';
            btn.style.width = '100%';
            btn.style.textAlign = 'left';
            btn.style.cursor = 'pointer';
            btn.style.textDecoration = 'none';
            btn.style.display = 'block';
            btn.href = proxyUrl;

            btn.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center; width:100%;">
                    <div style="text-align:left;">
                        <div style="font-weight:600; font-size:1.05rem; margin-bottom: 2px;">${label}</div>
                        <div style="font-size:0.82rem; color: var(--text-muted)">${ext} ${size ? '• ' + size : ''}</div>
                    </div>
                    <div style="background:#10b981; padding:6px 14px; border-radius:8px; font-size:0.9rem; font-weight:600; display:flex; gap:6px; align-items:center; color:#fff; white-space:nowrap;">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                        Download
                    </div>
                </div>
            `;

            audioFormatsContainer.appendChild(btn);
        });

        // Show/hide format groups
        const videoGroup = videoFormatsContainer.closest('.format-group');
        const audioGroup = audioFormatsContainer.closest('.format-group');
        const imageGroup = imageFormatsContainer.closest('.format-group');

        if (platform === 'audio' || videos.length === 0) {
            if (videoGroup) videoGroup.style.display = 'none';
        } else {
            if (videoGroup) videoGroup.style.display = 'block';
        }

        if (audioGroup) audioGroup.style.display = audios.length > 0 ? 'block' : 'none';
        if (imageGroup) imageGroup.style.display = data.thumbnail ? 'block' : 'none';

        resultBox.classList.remove('hidden');
    };

    if (fetchBtn) {
        fetchBtn.addEventListener('click', fetchVideoInfo);
    }
    if (urlInput) {
        urlInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                fetchVideoInfo();
            }
        });
    }
});
