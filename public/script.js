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
        const logoPath = document.querySelector('.logo path');
        const logoPoly = document.querySelector('.logo polygon');

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
    // ------------------------------

    // Utility: format bytes to readable size
    const formatBytes = (bytes, decimals = 2) => {
        if (!+bytes) return 'N/A';
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
        // Set Preview using Proxy to bypass 403 Forbidden (Instagram/YT blocks)
        videoThumb.src = data.thumbnail ? `/api/thumbnail?url=${encodeURIComponent(data.thumbnail)}` : 'https://via.placeholder.com/320x180?text=No+Thumbnail';
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

        // Add Thumbnail to Extras Strategy
        if (data.thumbnail && data.thumbnail !== 'https://via.placeholder.com/320x180?text=No+Thumbnail') {
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

        let videos = data.formats.filter(f => f.hasVideo);
        let audios = data.formats.filter(f => !f.hasVideo && f.hasAudio);

        // Tool-Specific UI Filtering
        const videoGroup = videoFormatsContainer.closest('.format-group');
        const imageGroup = imageFormatsContainer.closest('.format-group');
        const audioGroup = audioFormatsContainer.closest('.format-group');

        if (platform === 'audio' || videos.length === 0) {
            if (videoGroup) videoGroup.style.display = 'none';
        } else {
            if (videoGroup) videoGroup.style.display = 'block';
        }

        if (platform === 'audio' || !data.thumbnail) {
            if (imageGroup) imageGroup.style.display = 'none';
        } else {
            if (imageGroup) imageGroup.style.display = 'block';
        }

        if (platform !== 'audio' && audios.length === 0) {
            if (audioGroup) audioGroup.style.display = 'none';
        } else {
            if (audioGroup) audioGroup.style.display = 'block';
        }

        // Remove duplicates by quality label or exact height
        videos = videos.reduce((acc, current) => {
            const h = current.height;
            const key = h ? `${h}p` : current.qualityLabel;
            const existing = acc.find(item => {
                let existingKey = item.height ? `${item.height}p` : item.qualityLabel;
                return existingKey === key;
            });
            if (!existing) {
                return acc.concat([current]);
            } else {
                return acc;
            }
        }, []);

        // Sort videos highest quality first
        videos.sort((a, b) => parseInt(b.qualityLabel) - parseInt(a.qualityLabel));

        // Sort audios by bitrate or just take the highest
        // We'll just list a couple of audio streams.

        const createFormatElement = (format, type, labelPrefix = '') => {
            const btn = document.createElement('button');
            btn.className = 'format-item';
            btn.style.width = '100%';
            btn.style.textAlign = 'left';
            btn.style.cursor = 'pointer';
            btn.style.position = 'relative';
            btn.style.overflow = 'hidden';

            const contentDiv = document.createElement('div');
            contentDiv.style.position = 'relative';
            contentDiv.style.zIndex = '2';
            contentDiv.style.display = 'flex';
            contentDiv.style.justifyContent = 'space-between';
            contentDiv.style.width = '100%';

            const progressBg = document.createElement('div');
            progressBg.style.position = 'absolute';
            progressBg.style.top = '0';
            progressBg.style.left = '0';
            progressBg.style.height = '100%';
            progressBg.style.width = '0%';
            progressBg.style.backgroundColor = 'rgba(99, 102, 241, 0.4)';
            progressBg.style.zIndex = '1';
            progressBg.style.transition = 'width 0.2s';

            const qualitySpan = document.createElement('span');
            qualitySpan.className = 'quality';
            qualitySpan.textContent = labelPrefix + (format.qualityLabel || 'Audio');

            const sizeSpan = document.createElement('span');
            sizeSpan.className = 'size';
            sizeSpan.textContent = format.contentLength ? formatBytes(format.contentLength) : '';

            contentDiv.appendChild(qualitySpan);
            contentDiv.appendChild(sizeSpan);
            btn.appendChild(progressBg);
            btn.appendChild(contentDiv);

            btn.addEventListener('click', async () => {
                const originalText = qualitySpan.textContent;
                qualitySpan.innerHTML = `${originalText} <span class="spinner" style="display:inline-block; width:12px; height:12px; border-width:2px; margin-left: 10px; border-top-color:var(--primary)"></span>`;
                btn.disabled = true;

                try {
                    const prepareUrl = `/api/prepare?url=${encodeURIComponent(originalUrl)}&itag=${format.itag}&type=${type}`;
                    const res = await fetch(prepareUrl);
                    if (!res.ok) throw new Error('Failed to prepare download');

                    const { taskId } = await res.json();

                    // Start SSE Connection
                    const evtSource = new EventSource(`/api/progress?id=${taskId}`);

                    evtSource.onmessage = (event) => {
                        const data = JSON.parse(event.data);

                        if (data.progress > 0) {
                            progressBg.style.width = `${data.progress}%`;
                        }

                        if (data.status === 'done') {
                            evtSource.close();
                            progressBg.style.width = '100%';

                            // Trigger final browser file download
                            const a = document.createElement('a');
                            a.href = `/api/serve?id=${taskId}`;
                            a.setAttribute('download', '');
                            document.body.appendChild(a);
                            setTimeout(() => {
                                a.click();
                                document.body.removeChild(a);
                            }, 500);

                            // Reset UI
                            setTimeout(() => {
                                qualitySpan.textContent = originalText;
                                progressBg.style.width = '0%';
                                btn.disabled = false;
                            }, 3000);
                        } else if (data.status === 'error') {
                            evtSource.close();
                            throw new Error('Download failed on server');
                        }
                    };

                    evtSource.onerror = () => {
                        evtSource.close();
                        showError('Connection to server progress lost.');
                        qualitySpan.textContent = originalText;
                        progressBg.style.width = '0%';
                        btn.disabled = false;
                    }

                } catch (err) {
                    showError(err.message || 'Download failed to start.');
                    qualitySpan.textContent = originalText;
                    progressBg.style.width = '0%';
                    btn.disabled = false;
                }
            });

            return btn;
        };

        if (videos.length === 0) {
            videoFormatsContainer.innerHTML = '<p style="color:var(--text-muted); font-size:0.9rem;">No video formats available.</p>';
        } else {
            // The backend automatically merges bestaudio to any video itag that lacks it.
            // So we guarantee the user that every video button gives Video + Audio.
            videos.forEach(format => {
                let qLabel = format.qualityLabel || 'HD Video';

                // If it passes height (e.g., 1080), normalize to 1080p
                if (format.height) {
                    qLabel = `${format.height}p`;
                } else if (qLabel.includes('x')) {
                    // E.g., "750x1333" -> extract the height
                    const parts = qLabel.split('x');
                    qLabel = `${parts[1]}p`;
                } else if (qLabel.toLowerCase().includes('dash')) {
                    qLabel = 'HD Video';
                }

                format.qualityLabel = `${qLabel} (Video + Audio)`;
                videoFormatsContainer.appendChild(createFormatElement(format, 'video'));
            });
        }

        if (audios.length === 0) {
            audioFormatsContainer.innerHTML = '<p style="color:var(--text-muted); font-size:0.9rem;">No audio formats available.</p>';
        } else {
            // Keep the best audio
            audios.slice(0, 3).forEach(format => {
                audioFormatsContainer.appendChild(createFormatElement(format, 'audio', 'MP3 '));
            });
        }

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
