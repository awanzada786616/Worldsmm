export default async function handler(req, res) {
    const { url, key, action } = req.query;
    
    // CORS Headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

    if (!url || !key) {
        return res.status(400).json({ error: "Missing URL or Key. Make sure you use /api/v2 at the end of provider URL." });
    }

    try {
        const target = `${url}?action=${action || 'services'}&key=${key}`;
        const response = await fetch(target);
        
        // Check if response is actually JSON
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            const text = await response.text();
            console.error("Provider returned non-JSON:", text.slice(0, 100));
            return res.status(500).json({ 
                error: "Provider returned HTML instead of Data. Your API URL is likely wrong. Add /api/v2 at the end of the URL." 
            });
        }

        const data = await response.json();
        res.status(200).json(data);
    } catch (e) {
        res.status(500).json({ error: "Server Error: " + e.message });
    }
                }
