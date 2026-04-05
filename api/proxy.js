export default async function handler(req, res) {
    const { url, key, action } = req.query;

    // CORS Headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (!url || !key) {
        return res.status(400).json({ error: "Missing URL or Key" });
    }

    try {
        const target = `${url}?action=${action || 'services'}&key=${key}`;

        // Header add karna zaroori hai taake Cloudflare block na kare
        const response = await fetch(target, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        const contentType = response.headers.get("content-type");

        if (response.ok && contentType && contentType.includes("application/json")) {
            const data = await response.json();
            return res.status(200).json(data);
        } else {
            // Agar HTML mil raha hai toh wo yahan catch hoga
            const errorText = await response.text();
            console.error("Provider Response:", errorText.slice(0, 200));
            
            return res.status(500).json({ 
                error: "Provider blocked Vercel request (Cloudflare). Try using another provider or check if your API URL is exactly correct (with /api/v2)." 
            });
        }
    } catch (e) {
        return res.status(500).json({ error: "Proxy Server Error: " + e.message });
    }
}
