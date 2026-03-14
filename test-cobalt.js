const COBALT_API_URL = "https://cobalt-api-ocwg.onrender.com";
const COBALT_INSTANCES = [
    COBALT_API_URL,                     // 1. User's self-hosted instance first
    'https://api.cobalt.tools',         // 2. Official instance
    'https://cobalt.duckery.co',        // 3. Fallback 1
    'https://cobalt-api.kwiatekm.com'   // 4. Fallback 2
].filter(Boolean).map(url => url.replace(/\/$/, ''));

async function callCobaltAPI(url, options = {}) {
    const body = { url, ...options };
    let lastError = null;

    for (const cobaltUrl of COBALT_INSTANCES) {
        console.log(`  🔷 Trying Cobalt API: POST ${cobaltUrl}/`);
        
        try {
            const response = await fetch(`${cobaltUrl}/`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Origin': 'https://cobalt.tools',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(`Instance returned ${response.status}: ${text.substring(0, 100)}`);
            }

            const data = await response.json();
            
            if (data.status === 'error' && (data.error?.code === 'error.youtube.ip_ban' || data.text?.toLowerCase().includes('blocked'))) {
                throw new Error(`Blocked by YouTube on this instance: ${data.error?.code || data.text}`);
            }

            console.log(`  ✅ Success with ${cobaltUrl}`);
            return data;

        } catch (err) {
            console.warn(`  ⚠️ Failed (${cobaltUrl}): ${err.message}`);
            lastError = err;
        }
    }

    throw new Error(`All Cobalt API instances failed. Last error: ${lastError?.message}`);
}

callCobaltAPI('https://www.youtube.com/watch?v=dQw4w9WgXcQ', {
    videoQuality: '360',
    youtubeVideoCodec: 'h264',
    downloadMode: 'auto',
    alwaysProxy: true
}).then(data => console.log('Final Result:', data)).catch(err => console.error('Final Error:', err));
