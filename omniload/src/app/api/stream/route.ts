import { NextRequest, NextResponse } from 'next/server';
import { callCobaltAPI } from '@/lib/downloader';
import { checkRateLimit, getClientIP, isAllowedSourceUrl, isAllowedUrl, fetchWithTimeout } from '@/lib/security';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get('url');
    const filename = searchParams.get('filename') || 'download.mp4';
    const cobaltOptionsRaw = searchParams.get('cobaltOptions');

    if (!url) {
        return NextResponse.json({ error: 'Missing "url" parameter' }, { status: 400 });
    }

    // Rate limit: 15 requests per minute per IP (streaming is expensive)
    const ip = getClientIP(req);
    const rateLimitResult = checkRateLimit(ip, 'stream', 15, 60000);
    if (!rateLimitResult.allowed) {
        return NextResponse.json({ error: rateLimitResult.error }, { status: 429 });
    }

    // SSRF protection
    if (!isAllowedSourceUrl(url)) {
        return NextResponse.json({ error: 'URL not allowed.' }, { status: 403 });
    }

    try {
        let downloadUrl = '';

        // If cobalt options are provided, use Cobalt API to get the download URL
        if (cobaltOptionsRaw && process.env.COBALT_API_URL) {
            let cobaltOptions: Record<string, unknown> = {};
            try {
                cobaltOptions = JSON.parse(decodeURIComponent(cobaltOptionsRaw));
            } catch {}

            cobaltOptions.alwaysProxy = true;

            const cobaltResult = await callCobaltAPI(url, cobaltOptions);

            if (cobaltResult.status === 'tunnel' || cobaltResult.status === 'redirect') {
                downloadUrl = cobaltResult.url as string;
            } else if (cobaltResult.status === 'picker' && Array.isArray(cobaltResult.picker) && (cobaltResult.picker[0] as Record<string, unknown>)?.url) {
                downloadUrl = (cobaltResult.picker[0] as Record<string, unknown>).url as string;
            } else if (cobaltResult.status === 'error') {
                const errObj = cobaltResult.error as Record<string, unknown> | undefined;
                throw new Error(`Cobalt error: ${errObj?.code || 'unknown'}`);
            }

            if (!downloadUrl) {
                throw new Error('Could not get download URL from Cobalt');
            }
        } else {
            // For RapidAPI results, the URL itself is the direct download link
            downloadUrl = url;
        }

        // Validate the resolved download URL before fetching
        if (!isAllowedUrl(downloadUrl)) {
            return NextResponse.json({ error: 'Download URL not allowed' }, { status: 403 });
        }

        console.log(`  🔗 Proxied stream: ${filename}`);

        // PROXY THE STREAM
        const streamResponse = await fetchWithTimeout(downloadUrl, {
            timeout: 60000,
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

    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error(`  ❌ Stream Error: ${message}`);
        return NextResponse.json({ error: 'Download failed. Please try again.' }, { status: 500 });
    }
}
