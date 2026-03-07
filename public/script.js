document.addEventListener('DOMContentLoaded', () => {
    const urlInput = document.getElementById('urlInput');
    const fetchBtn = document.getElementById('fetchBtn');
    const btnText = fetchBtn.querySelector('.btn-text');
    const spinner = fetchBtn.querySelector('.spinner');

    const errorBox = document.getElementById('errorBox');
    const resultBox = document.getElementById('resultBox');
    const videoThumb = document.getElementById('videoThumb');
    const videoTitle = document.getElementById('videoTitle');
    const videoFormatsContainer = document.getElementById('videoFormats');
    const audioFormatsContainer = document.getElementById('audioFormats');

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
        if (!url) {
            showError('Please enter a valid YouTube URL');
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
        videoThumb.src = data.thumbnail;
        videoTitle.textContent = data.title;

        // Clear previous formats
        videoFormatsContainer.innerHTML = '';
        audioFormatsContainer.innerHTML = '';

        // Separate formats into strict Video (with audio preferred, or without) vs Audio-only
        // To keep it clean, we'll try to find formats that have BOTH video and audio. 
        // If not enough, we list video-only ones (but emphasize they might lack audio).
        // For simplicity, let's filter formats that are widely used.

        let videos = data.formats.filter(f => f.hasVideo);
        let audios = data.formats.filter(f => !f.hasVideo && f.hasAudio);

        // Remove duplicates by quality label for videos
        videos = videos.reduce((acc, current) => {
            const x = acc.find(item => item.qualityLabel === current.qualityLabel);
            if (!x) {
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
            videos.forEach(format => {
                const label = format.hasAudio ? '' : 'Merged + ';
                videoFormatsContainer.appendChild(createFormatElement(format, 'video', label));
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

    fetchBtn.addEventListener('click', fetchVideoInfo);
    urlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            fetchVideoInfo();
        }
    });
});
