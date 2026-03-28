import { NextRequest, NextResponse } from 'next/server';
import { callCobaltAPI } from '@/lib/downloader';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get('url');
    const filename = searchParams.get('filename') || 'download.mp4';
    const cobaltOptionsRaw = searchParams.get('cobaltOptions');

    if (!url) {
        return NextResponse.json({ error: 'Missing "url" parameter' }, { status: 400 });
    }

    try {
        let downloadUrl = '';

        // If cobalt options are provided, use Cobalt API to get the download URL
        if (cobaltOptionsRaw && process.env.COBALT_API_URL) {
            let cobaltOptions: any = {};
            try {
                cobaltOptions = JSON.parse(decodeURIComponent(cobaltOptionsRaw));
            } catch {}

            cobaltOptions.alwaysProxy = true;

            const cobaltResult = await callCobaltAPI(url, cobaltOptions);

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
        } else {
            // For RapidAPI results, the URL itself is the direct download link
            downloadUrl = url;
        }

        console.log(`  🔗 Proxied stream: ${filename}`);

        // PROXY THE STREAM
        const streamResponse = await fetch(downloadUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': '*/*',
            }
        });

        if (!streamResponse.ok) {
            throw new Error(`Download source rejected request: ${streamResponse.status}`);
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
