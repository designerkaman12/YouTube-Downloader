import { NextRequest, NextResponse } from 'next/server';
import { isYouTube, callCobaltAPI } from '@/lib/downloader';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get('url');
    const filename = searchParams.get('filename') || 'download.mp4';
    const cobaltOptionsRaw = searchParams.get('cobaltOptions');
    const directUrl = searchParams.get('directUrl');

    if (!url) {
        return NextResponse.json({ error: 'Missing "url" parameter' }, { status: 400 });
    }

    try {
        if (!isYouTube(url)) {
            // For non-YouTube, redirect to the direct URL if available, else the original URL
            return NextResponse.redirect(directUrl || url);
        }

        // Parse Cobalt options
        let cobaltOptions: any = {};
        if (cobaltOptionsRaw) {
            try {
                cobaltOptions = JSON.parse(decodeURIComponent(cobaltOptionsRaw));
            } catch (e) {}
        }

        // Ensure alwaysProxy is set
        cobaltOptions.alwaysProxy = true;

        // Call Cobalt API to get the tunnel URL
        const cobaltResult = await callCobaltAPI(url, cobaltOptions);

        let downloadUrl = '';
        if (cobaltResult.status === 'tunnel' || cobaltResult.status === 'redirect') {
            downloadUrl = cobaltResult.url;
        } else if (cobaltResult.status === 'picker' && cobaltResult.picker?.[0]?.url) {
            downloadUrl = cobaltResult.picker[0].url;
        } else if (cobaltResult.status === 'error') {
            throw new Error(`Cobalt error: ${cobaltResult.error?.code || 'unknown'}`);
        }

        if (!downloadUrl) {
            throw new Error('Could not get download URL from Cobalt');
        }

        console.log(`  🔗 Proxied stream: ${filename}`);

        // PROXY THE STREAM
        const streamResponse = await fetch(downloadUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                'Origin': 'https://cobalt.tools',
                'Referer': 'https://cobalt.tools/'
            }
        });

        if (!streamResponse.ok) {
            throw new Error(`Tunnel rejected request: ${streamResponse.status}`);
        }

        // Forward headers
        const contentType = streamResponse.headers.get('content-type') || 'application/octet-stream';
        const contentLength = streamResponse.headers.get('content-length');

        const headers = new Headers();
        headers.set('Content-Type', contentType);
        if (contentLength) headers.set('Content-Length', contentLength);
        headers.set('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);

        // Return a response with the stream body
        return new NextResponse(streamResponse.body, { headers });

    } catch (error: any) {
        console.error(`  ❌ Stream Error: ${error.message}`);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
