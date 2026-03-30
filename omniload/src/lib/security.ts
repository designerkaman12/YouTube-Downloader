/**
 * Simple in-memory rate limiter for API routes.
 * Prevents abuse, protects RapidAPI credits, and blocks SSRF attacks.
 */

// ─── RATE LIMITER ────────────────────────────────────────────

interface RateLimitEntry {
    count: number;
    resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

// Clean up old entries every 5 minutes to prevent memory leak
setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitMap) {
        if (now > entry.resetTime) {
            rateLimitMap.delete(key);
        }
    }
}, 5 * 60 * 1000);

/**
 * Check if a request should be rate limited.
 * @returns null if allowed, or an error message if rate limited.
 */
export function checkRateLimit(
    ip: string,
    endpoint: string,
    maxRequests: number = 30,
    windowMs: number = 60 * 1000 // 1 minute window
): string | null {
    const key = `${ip}:${endpoint}`;
    const now = Date.now();
    const entry = rateLimitMap.get(key);

    if (!entry || now > entry.resetTime) {
        rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
        return null;
    }

    entry.count++;

    if (entry.count > maxRequests) {
        return `Rate limit exceeded. Please wait ${Math.ceil((entry.resetTime - now) / 1000)} seconds.`;
    }

    return null;
}

/**
 * Get client IP from request headers.
 */
export function getClientIP(req: Request): string {
    const forwarded = req.headers.get('x-forwarded-for');
    if (forwarded) {
        return forwarded.split(',')[0].trim();
    }
    return req.headers.get('x-real-ip') || 'unknown';
}

// ─── URL VALIDATION (SSRF Protection) ───────────────────────

const ALLOWED_HOSTS_PATTERNS = [
    // Video platforms
    /youtube\.com$/i,
    /youtu\.be$/i,
    /googlevideo\.com$/i,
    /ytimg\.com$/i,
    /instagram\.com$/i,
    /cdninstagram\.com$/i,
    /fbcdn\.net$/i,
    /tiktok\.com$/i,
    /tiktokcdn\.com$/i,
    /musical\.ly$/i,
    /twitter\.com$/i,
    /x\.com$/i,
    /twimg\.com$/i,
    /facebook\.com$/i,
    /fb\.watch$/i,
    /fb\.com$/i,
    /pinterest\.com$/i,
    /pinimg\.com$/i,
    /vimeo\.com$/i,
    /vimeocdn\.com$/i,
    /dailymotion\.com$/i,
    /dmcdn\.net$/i,
    /reddit\.com$/i,
    /redd\.it$/i,
    /redditmedia\.com$/i,
    /redditstatic\.com$/i,
    /snapchat\.com$/i,
    /sc-cdn\.net$/i,
    /threads\.net$/i,
    /linkedin\.com$/i,
    /licdn\.com$/i,
    // CDN/media servers commonly used
    /akamaized\.net$/i,
    /cloudfront\.net$/i,
    /cobalt\.tools$/i,
];

/**
 * Validates a URL to prevent SSRF attacks.
 * Only allows URLs from known video/media platforms.
 */
export function isAllowedUrl(urlString: string): boolean {
    try {
        const url = new URL(urlString);

        // Only allow http/https
        if (url.protocol !== 'http:' && url.protocol !== 'https:') {
            return false;
        }

        // Block internal/private IPs
        const hostname = url.hostname.toLowerCase();
        if (
            hostname === 'localhost' ||
            hostname === '127.0.0.1' ||
            hostname === '0.0.0.0' ||
            hostname.startsWith('10.') ||
            hostname.startsWith('172.') ||
            hostname.startsWith('192.168.') ||
            hostname === '169.254.169.254' || // AWS metadata
            hostname.endsWith('.internal') ||
            hostname.endsWith('.local')
        ) {
            return false;
        }

        // Check against allowed host patterns
        return ALLOWED_HOSTS_PATTERNS.some(pattern => pattern.test(hostname));
    } catch {
        return false;
    }
}

/**
 * Validates URLs used in the /api/info endpoint (source URLs from users).
 * These are the main platform URLs that users paste.
 */
export function isAllowedSourceUrl(urlString: string): boolean {
    try {
        const url = new URL(urlString);
        if (url.protocol !== 'http:' && url.protocol !== 'https:') return false;

        const hostname = url.hostname.toLowerCase();
        const sourcePlatforms = [
            /youtube\.com$/i, /youtu\.be$/i,
            /instagram\.com$/i,
            /tiktok\.com$/i,
            /twitter\.com$/i, /x\.com$/i,
            /facebook\.com$/i, /fb\.watch$/i, /fb\.com$/i,
            /pinterest\.com$/i, /pin\.it$/i,
            /vimeo\.com$/i,
            /dailymotion\.com$/i, /dai\.ly$/i,
            /reddit\.com$/i, /redd\.it$/i,
            /snapchat\.com$/i,
            /threads\.net$/i,
            /linkedin\.com$/i,
        ];

        return sourcePlatforms.some(p => p.test(hostname));
    } catch {
        return false;
    }
}
