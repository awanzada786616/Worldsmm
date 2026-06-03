export default async function handler(req, res) {
    const { cnic } = req.query;
    if (!cnic) return res.status(400).json({ error: "CNIC required" });

    const url = 'https://leakedhub.hasnaint.com/cnic_record.php';

    try {
        // 1. Pehle Login Request bhejna
        const loginParams = new URLSearchParams();
        loginParams.append('username', 'Shah001'); 
        loginParams.append('password', 'Shah001@');
        loginParams.append('login', ''); // Button click simulate karne ke liye

        const loginResponse = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
            },
            body: loginParams,
            redirect: 'manual' // Redirect handle karne ke liye
        });

        // Sari Cookies nikalna (Node.js 18+ method)
        const rawCookies = loginResponse.headers.getSetCookie();
        const cookieString = rawCookies.map(c => c.split(';')[0]).join('; ');

        if (!cookieString || cookieString === "") {
            return res.status(500).json({ error: "Cookie nahi mili. Login fail ho gaya." });
        }

        // 2. Ab Data Fetch karna unhi Cookies ke saath
        const searchParams = new URLSearchParams();
        searchParams.append('cnic', cnic);

        const dataResponse = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cookie': cookieString,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
                'Referer': url
            },
            body: searchParams
        });

        let htmlData = await dataResponse.text();

        // Cleaning: Hamari site par unka login box na nazar aaye agar data mil jaye
        if (htmlData.includes('Shah001')) {
            // Success: User logged in hai
            res.status(200).send(htmlData);
        } else {
            res.status(403).send("Data fetch nahi ho saka. Login session rejected.");
        }

    } catch (error) {
        res.status(500).json({ error: "Error: " + error.message });
    }
}
