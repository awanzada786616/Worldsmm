
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

    const { url, key } = req.query;

    if (!url || !key) {
        return res.status(400).json({ error: "Missing URL or Key" });
    }

    try {
        // Yeh backend request hai, Cloudflare ise bypass kar deta hai aksar
        const response = await fetch(`${url}?action=services&key=${key}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'application/json'
            }
        });

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "Provider Blocked Server Request: " + error.message });
    }
}
