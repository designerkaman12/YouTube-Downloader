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
            platformBadge.textContent = (data.extractor || 'Unknown').toUpperCase();
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
            thumbBtn.style.textAlign = 'center';

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

        // Handle picker type (Instagram carousels, etc.)
        if (data.type === 'picker' && data.picker) {
            data.picker.forEach((item, i) => {
                const btn = createDownloadButton(
                    `${item.type === 'photo' ? '🖼️ Image' : '🎬 Video'} ${i + 1}`,
                    '',
                    item.url
                );
                videoFormatsContainer.appendChild(btn);
            });
            if (data.audio) {
                audioFormatsContainer.appendChild(
                    createDownloadButton('🎵 Audio Track', 'MP3', data.audio)
                );
            }
            showFormatGroups(true, data.audio ? true : false, data.thumbnail ? true : false);
            resultBox.classList.remove('hidden');
            return;
        }

        // Handle single video/audio with quality options
        if (data.formats) {
            let videos = data.formats.filter(f => f.hasVideo);
            let audios = data.formats.filter(f => !f.hasVideo && f.hasAudio);

            // Video quality buttons
            videos.forEach(format => {
                const btn = createQualityButton(format, originalUrl, 'video');
                videoFormatsContainer.appendChild(btn);
            });

            // Audio buttons
            audios.forEach(format => {
                const btn = format.directUrl
                    ? createDownloadButton('🎵 ' + format.quality, 'MP3', format.directUrl)
                    : createQualityButton(format, originalUrl, 'audio');
                audioFormatsContainer.appendChild(btn);
            });

            showFormatGroups(videos.length > 0, audios.length > 0, data.thumbnail ? true : false);
        }

        resultBox.classList.remove('hidden');
    };

    // Show/hide format sections based on available data
    const showFormatGroups = (showVideo, showAudio, showImage) => {
        const videoGroup = videoFormatsContainer.closest('.format-group');
        const audioGroup = audioFormatsContainer.closest('.format-group');
        const imageGroup = imageFormatsContainer.closest('.format-group');

        if (platform === 'audio') showVideo = false;

        if (videoGroup) videoGroup.style.display = showVideo ? 'block' : 'none';
        if (audioGroup) audioGroup.style.display = showAudio ? 'block' : 'none';
        if (imageGroup) imageGroup.style.display = showImage ? 'block' : 'none';
    };

    // Create a button that fetches download URL on click
    const createQualityButton = (format, originalUrl, type) => {
        const btn = document.createElement('button');
        btn.className = 'format-item';
        btn.style.width = '100%';
        btn.style.textAlign = 'left';
        btn.style.cursor = 'pointer';

        const label = type === 'audio' ? `🎵 ${format.quality}` : `🎬 ${format.quality} (Video + Audio)`;
        btn.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; width:100%;">
                <span class="quality">${label}</span>
                <span class="size" style="background:var(--primary); padding:4px 12px; border-radius:6px; font-size:0.85rem; font-weight:600;">Download</span>
            </div>
        `;

        btn.addEventListener('click', async () => {
            const qualitySpan = btn.querySelector('.quality');
            const sizeSpan = btn.querySelector('.size');
            const originalLabel = qualitySpan.textContent;
            const originalSize = sizeSpan.textContent;

            qualitySpan.textContent = '⏳ Preparing...';
            sizeSpan.textContent = '...';
            btn.disabled = true;

            try {
                const quality = format.qualityValue || 'max';
                const res = await fetch(`/api/download?url=${encodeURIComponent(originalUrl)}&quality=${quality}&type=${type}`);
                const data = await res.json();

                if (!res.ok || !data.downloadUrl) {
                    throw new Error(data.error || 'Download failed');
                }

                // Open download URL
                qualitySpan.textContent = '✅ Starting download...';
                window.open(data.downloadUrl, '_blank');

            } catch (err) {
                showError(err.message || 'Download failed. Try again.');
            } finally {
                setTimeout(() => {
                    qualitySpan.textContent = originalLabel;
                    sizeSpan.textContent = originalSize;
                    btn.disabled = false;
                }, 2000);
            }
        });

        return btn;
    };

    // Create a direct download button (for picker items and audio with direct URLs)
    const createDownloadButton = (label, sizeText, downloadUrl) => {
        const btn = document.createElement('a');
        btn.href = downloadUrl;
        btn.target = '_blank';
        btn.className = 'format-item';
        btn.style.textDecoration = 'none';
        btn.style.display = 'block';
        btn.style.cursor = 'pointer';

        btn.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; width:100%;">
                <span class="quality">${label}</span>
                <span class="size" style="background:var(--primary); padding:4px 12px; border-radius:6px; font-size:0.85rem; font-weight:600;">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle; margin-right:4px;"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                    ${sizeText || 'Download'}
                </span>
            </div>
        `;
        return btn;
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
