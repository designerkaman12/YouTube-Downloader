import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get('url');

    if (!url) {
        return new NextResponse('Missing url', { status: 400 });
    }

    try {
        const response = await fetch(url);
        if (!response.ok) return new NextResponse('Thumbnail not found', { status: 404 });

        const contentType = response.headers.get('content-type') || 'image/jpeg';
        
        const headers = new Headers();
        headers.set('Content-Type', contentType);
        headers.set('Cache-Control', 'public, max-age=86400');

        return new NextResponse(response.body, { headers });
    } catch {
        return new NextResponse('Failed to fetch thumbnail', { status: 500 });
    }
}
