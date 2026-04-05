export default async function handler(req, res) {
    // Sirf GET requests allow karein
    const { url, key, action } = req.query;

    if (!url || !key) {
        return res.status(400).json({ error: "Missing URL or Key" });
    }

    try {
        const providerUrl = `${url}?action=${action || 'services'}&key=${key}`;
        const response = await fetch(providerUrl);
        const data = await response.json();

        // Allow CORS taake aapka frontend isse baat kar sake
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch from provider: " + error.message });
    }
}
