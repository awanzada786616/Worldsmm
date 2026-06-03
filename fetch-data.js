export default async function handler(req, res) {
    // Sirf GET request allow karen hamari apni site se
    if (req.method !== 'GET') {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { cnic } = req.query;

    if (!cnic) {
        return res.status(400).json({ error: "CNIC is required" });
    }

    try {
        const targetUrl = 'https://leakedhub.hasnaint.com/cnic_record.php';

        // POST request bhejne ke liye body prepare karna
        const details = {
            'cnic': cnic, // Ye field name wohi hona chahiye jo unki site par hai
        };

        // Form data format mein convert karna
        const formBody = Object.keys(details).map(key => 
            encodeURIComponent(key) + '=' + encodeURIComponent(details[key])
        ).join('&');

        const response = await fetch(targetUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Referer': 'https://leakedhub.hasnaint.com/cnic_record.php'
            },
            body: formBody
        });

        const htmlData = await response.text();
        
        // Response wapis bhejna
        res.status(200).send(htmlData);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server se data fetch karne mein masla hua" });
    }
}
