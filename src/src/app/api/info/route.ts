import { NextRequest, NextResponse } from 'next/server';
import { detectPlatform, isYouTube, getYouTubeInfo, callRapidAPI } from '@/lib/downloader';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get('url');

    if (!url) {
        return NextResponse.json({ error: 'Missing "url" parameter' }, { status: 400 });
    }

    const platform = detectPlatform(url);
    console.log(`\n🔍 INFO request: ${url.substring(0, 80)}... (${platform})`);

    try {
        // YOUTUBE: Use Cobalt API
        if (isYouTube(url)) {
            try {
                const result = await getYouTubeInfo(url);
                return NextResponse.json(result);
            } catch (ytError: any) {
                console.warn(`  ⚠️ YouTube (Cobalt) failed: ${ytError.message}. Falling back to RapidAPI...`);
            }
        }

        // OTHER PLATFORMS & YOUTUBE FALLBACK: Use RapidAPI
        const apiData = await callRapidAPI(url);

        const title = apiData.title || 'Unknown Title';
        const author = apiData.author || apiData.source || platform;
        const thumbnail = apiData.thumbnail || '';
        const duration = apiData.duration || '';

        const formats: any[] = [];

        if (apiData.medias && Array.isArray(apiData.medias)) {
            apiData.medias.forEach((media: any, i: number) => {
                formats.push({
                    quality: media.quality || `Option ${i + 1}`,
                    url: media.url,
                    extension: media.extension || 'mp4',
                    type: media.type || 'video',
                    size: media.formattedSize || media.size || '',
                    audioAvailable: media.audioAvailable !== undefined ? media.audioAvailable : true
                });
            });
        } else if (apiData.url) {
            formats.push({
                quality: 'Default',
                url: apiData.url,
                extension: 'mp4',
                type: 'video',
                size: '',
                audioAvailable: true
            });
        }

        return NextResponse.json({
            success: true,
            platform,
            title,
            author,
            thumbnail,
            duration,
            formats,
            source: apiData.source || platform,
            url
        });

    } catch (error: any) {
        console.error(`  ❌ Info Error: ${error.message}`);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
