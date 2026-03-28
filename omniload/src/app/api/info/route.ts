import { NextRequest, NextResponse } from 'next/server';
import { detectPlatform, isYouTube, getYouTubeInfoCobalt, callRapidAPI, processRapidAPIResult } from '@/lib/downloader';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get('url');

    if (!url) {
        return NextResponse.json({ error: 'Missing "url" parameter' }, { status: 400 });
    }

    const platform = detectPlatform(url);
    console.log(`\n🔍 INFO request: ${url.substring(0, 80)}... (${platform})`);

    try {
        // YOUTUBE: Try Cobalt first (only if configured), then RapidAPI
        if (isYouTube(url) && process.env.COBALT_API_URL) {
            try {
                const result = await getYouTubeInfoCobalt(url);
                return NextResponse.json(result);
            } catch (ytError: any) {
                console.warn(`  ⚠️ YouTube (Cobalt) failed: ${ytError.message}. Using RapidAPI...`);
            }
        }

        // ALL PLATFORMS (including YouTube fallback): Use RapidAPI
        console.log(`  📡 Using RapidAPI for ${platform}...`);
        const apiData = await callRapidAPI(url);
        const result = processRapidAPIResult(apiData, platform, url);
        return NextResponse.json(result);

    } catch (error: any) {
        console.error(`  ❌ Info Error: ${error.message}`);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
