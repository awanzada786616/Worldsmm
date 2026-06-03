export default async function handler(req, res) {
    const { cnic } = req.query;
    if (!cnic) return res.status(400).send("CNIC missing");

    const targetUrl = 'https://leakedhub.hasnaint.com/cnic_record.php';

    try {
        // STEP 1: Login karna aur Cookie lena
        const loginData = new URLSearchParams();
        loginData.append('username', 'Shah001'); 
        loginData.append('password', 'Shah001@');
        loginData.append('login', 'login'); // Button name aksar 'login' hota hai

        const loginRes = await fetch(targetUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
            },
            body: loginData
        });

        // Sari cookies akathi karna
        const cookies = loginRes.headers.getSetCookie().map(c => c.split(';')[0]).join('; ');

        // STEP 2: Ab usi cookie ke sath CNIC search karna
        const searchData = new URLSearchParams();
        searchData.append('cnic', cnic);

        const finalRes = await fetch(targetUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cookie': cookies,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                'Referer': targetUrl
            },
            body: searchData
        });

        const finalHtml = await finalRes.text();

        // Seedha HTML bhej dena (Bina kisi error check ke)
        res.setHeader('Content-Type', 'text/html');
        res.status(200).send(finalHtml);

    } catch (error) {
        res.status(500).send("System Error: " + error.message);
    }
}
