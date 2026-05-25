import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getClientIP, fetchWithTimeout, checkContentLength, MAX_IMAGE_SIZE } from '@/lib/security';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get('url');

    if (!url) {
        return new NextResponse('Missing url', { status: 400 });
    }

    // Rate limit: 60 per minute (thumbnails are lightweight)
    const ip = getClientIP(req);
    const rateLimitResult = checkRateLimit(ip, 'thumbnail', 60, 60000);
    if (!rateLimitResult.allowed) {
        return new NextResponse(rateLimitResult.error, { status: 429 });
    }

    // Only allow image URLs from known CDNs
    try {
        const parsed = new URL(url);
        const hostname = parsed.hostname.toLowerCase();
        const allowedImageHosts = [
            /ytimg\.com$/i,
            /instagram\.com$/i,
            /cdninstagram\.com$/i,
            /fbcdn\.net$/i,
            /tiktokcdn\.com$/i,
            /twimg\.com$/i,
            /pinimg\.com$/i,
            /vimeocdn\.com$/i,
            /dmcdn\.net$/i,
            /redditmedia\.com$/i,
            /sc-cdn\.net$/i,
            /licdn\.com$/i,
            /akamaized\.net$/i,
            /cloudfront\.net$/i,
        ];

        if (!allowedImageHosts.some(p => p.test(hostname))) {
            return new NextResponse('Thumbnail source not allowed', { status: 403 });
        }
    } catch {
        return new NextResponse('Invalid URL', { status: 400 });
    }

    try {
        const response = await fetchWithTimeout(url, { timeout: 30000 });
        if (!response.ok) return new NextResponse('Thumbnail not found', { status: 404 });

        // Check image size limit
        if (!checkContentLength(response, MAX_IMAGE_SIZE)) {
            return new NextResponse('Image too large', { status: 413 });
        }

        const contentType = response.headers.get('content-type') || 'image/jpeg';
        
        const headers = new Headers();
        headers.set('Content-Type', contentType);
        headers.set('Cache-Control', 'public, max-age=86400'); // Cache 24h

        return new NextResponse(response.body, { headers });
    } catch {
        return new NextResponse('Failed to fetch thumbnail. Please try again.', { status: 500 });
    }
}
