// This file runs when the Next.js server starts.
// It sets up a keep-alive ping to prevent Render free tier from sleeping.

const PING_INTERVAL = 14 * 60 * 1000; // 14 minutes (Render sleeps after 15 min)

export async function register() {
    if (process.env.NODE_ENV === 'production' && typeof globalThis.setInterval !== 'undefined') {
        // Wait 30 seconds for the server to fully start
        setTimeout(() => {
            const appUrl = process.env.RENDER_EXTERNAL_URL || process.env.APP_URL;

            if (!appUrl) {
                console.log('⚠️  No RENDER_EXTERNAL_URL or APP_URL set. Keep-alive disabled.');
                return;
            }

            console.log(`🟢 Keep-alive started: pinging ${appUrl}/api/health every 14 minutes`);

            setInterval(async () => {
                try {
                    const res = await fetch(`${appUrl}/api/health`);
                    const data = await res.json();
                    console.log(`💓 Keep-alive ping OK | uptime: ${Math.round(data.uptime)}s`);
                } catch (err: any) {
                    console.log(`⚠️  Keep-alive ping failed: ${err.message}`);
                }
            }, PING_INTERVAL);
        }, 30000);
    }
}
