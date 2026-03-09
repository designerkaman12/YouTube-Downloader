const youtubedl = require('youtube-dl-exec');
const ffmpeg = require('ffmpeg-static');
const path = require('path');

const videoUrl = 'https://www.youtube.com/watch?v=NHk7scrb_9I';
const outputPath = path.join(__dirname, 'downloads', 'test_from_node.mp3');

let dlOptions = {
    output: outputPath,
    ffmpegLocation: ffmpeg,
    noWarnings: true,
    newline: true,
    concurrentFragments: 8,
    bufferSize: '1024K',
    httpChunkSize: '10M',
    extractAudio: true,
    audioFormat: 'mp3'
};

console.log('Spawning yt-dlp from inside Node.js...');
const subprocess = youtubedl.exec(videoUrl, dlOptions);

subprocess.stdout.on('data', (data) => console.log('OUT:', data.toString()));
subprocess.stderr.on('data', (data) => console.log('ERR:', data.toString()));

subprocess.on('close', (code) => {
    console.log('yt-dlp exited with code:', code);
});

subprocess.catch(err => {
    console.error('yt-dlp execution crashed:', err.message);
});
