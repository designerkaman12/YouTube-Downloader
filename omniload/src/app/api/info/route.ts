import { NextRequest, NextResponse } from 'next/server';
import { detectPlatform, isYouTube, callRapidAPI, processRapidAPIResult } from '@/lib/downloader';
import { checkRateLimit, getClientIP, isAllowedSourceUrl } from '@/lib/security';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get('url');

    if (!url) {
        return NextResponse.json({ error: 'Missing "url" parameter' }, { status: 400 });
    }

    // Rate limit: 20 requests per minute per IP
    const ip = getClientIP(req);
    const rateLimitError = checkRateLimit(ip, 'info', 20, 60000);
    if (rateLimitError) {
        return NextResponse.json({ error: rateLimitError }, { status: 429 });
    }

    // SSRF protection: only allow known platform URLs
    if (!isAllowedSourceUrl(url)) {
        return NextResponse.json({ error: 'Unsupported platform. Please use a link from YouTube, Instagram, TikTok, Twitter, or other supported platforms.' }, { status: 400 });
    }

    const platform = detectPlatform(url);
    console.log(`\n🔍 INFO request: ${url.substring(0, 80)}... (${platform})`);

    try {
        // YOUTUBE: Try Cobalt first (only if configured), then RapidAPI
        if (isYouTube(url) && process.env.COBALT_API_URL) {
            try {
                // Dynamic import to avoid build-time resolution issues
                const { getYouTubeInfoCobalt } = await import('@/lib/downloader');
                const result = await getYouTubeInfoCobalt(url);
                return NextResponse.json(result, {
                    headers: { 'Cache-Control': 'private, max-age=300' } // Cache 5 min
                });
            } catch (ytError: any) {
                console.warn(`  ⚠️ YouTube (Cobalt) failed: ${ytError.message}. Using RapidAPI...`);
            }
        }

        // ALL PLATFORMS (including YouTube fallback): Use RapidAPI
        console.log(`  📡 Using RapidAPI for ${platform}...`);
        const apiData = await callRapidAPI(url);
        const result = processRapidAPIResult(apiData, platform, url);
        return NextResponse.json(result, {
            headers: { 'Cache-Control': 'private, max-age=300' } // Cache 5 min
        });

    } catch (error: any) {
        console.error(`  ❌ Info Error: ${error.message}`);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
