import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getClientIP, isAllowedUrl, fetchWithTimeout, checkContentLength, MAX_DOWNLOAD_SIZE } from '@/lib/security';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const downloadUrl = searchParams.get('url');
    const filename = searchParams.get('filename') || 'download';

    if (!downloadUrl) {
        return NextResponse.json({ error: 'Missing "url" parameter' }, { status: 400 });
    }

    // Rate limit: 30 requests per minute per IP
    const ip = getClientIP(req);
    const rateLimitResult = checkRateLimit(ip, 'proxy', 30, 60000);
    if (!rateLimitResult.allowed) {
        return NextResponse.json({ error: rateLimitResult.error }, { status: 429 });
    }

    // SSRF protection: only allow known media platform URLs
    if (!isAllowedUrl(downloadUrl)) {
        return NextResponse.json({ error: 'Download URL not allowed. Only supported platform CDNs are accepted.' }, { status: 403 });
    }

    try {
        let referer = '';
        try {
            const parsed = new URL(downloadUrl);
            referer = `${parsed.protocol}//${parsed.host}/`;
        } catch {
            referer = downloadUrl;
        }

        // Security: Only log platform + hostname, never full URLs
        const streamResponse = await fetchWithTimeout(downloadUrl, {
            timeout: 60000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': '*/*',
                'Referer': referer
            }
        });

        if (!streamResponse.ok) {
            return NextResponse.json({ error: 'Download failed. Please try again.' }, { status: streamResponse.status });
        }

        // Check content length against max download size
        if (!checkContentLength(streamResponse, MAX_DOWNLOAD_SIZE)) {
            return NextResponse.json({ error: 'File too large. Maximum download size is 500MB.' }, { status: 413 });
        }

        const contentType = streamResponse.headers.get('content-type') || 'application/octet-stream';
        const contentLength = streamResponse.headers.get('content-length');

        const headers = new Headers();
        headers.set('Content-Type', contentType);
        if (contentLength) headers.set('Content-Length', contentLength);
        headers.set('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);

        return new NextResponse(streamResponse.body, { headers });

    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error(`  ❌ Proxy Error: ${message}`);
        return NextResponse.json({ error: 'Download failed. Please try again.' }, { status: 500 });
    }
}
