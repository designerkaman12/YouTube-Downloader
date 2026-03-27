import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const downloadUrl = searchParams.get('url');
    const filename = searchParams.get('filename') || 'download';

    if (!downloadUrl) {
        return NextResponse.json({ error: 'Missing "url" parameter' }, { status: 400 });
    }

    try {
        let referer = '';
        try {
            const parsed = new URL(downloadUrl);
            referer = `${parsed.protocol}//${parsed.host}/`;
        } catch (e) {
            referer = downloadUrl;
        }

        const streamResponse = await fetch(downloadUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': '*/*',
                'Referer': referer
            }
        });

        if (!streamResponse.ok) {
            return NextResponse.json({ error: `Download failed: ${streamResponse.status}` }, { status: streamResponse.status });
        }

        const contentType = streamResponse.headers.get('content-type') || 'application/octet-stream';
        const contentLength = streamResponse.headers.get('content-length');

        const headers = new Headers();
        headers.set('Content-Type', contentType);
        if (contentLength) headers.set('Content-Length', contentLength);
        headers.set('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);

        return new NextResponse(streamResponse.body, { headers });

    } catch (error: any) {
        console.error(`  ❌ Proxy Error: ${error.message}`);
        return NextResponse.json({ error: `Download failed: ${error.message}` }, { status: 500 });
    }
}
