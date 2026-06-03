export default async function handler(req, res) {
    const { cnic } = req.query;
    if (!cnic) return res.status(400).json({ error: "CNIC required" });

    const loginUrl = 'https://leakedhub.hasnaint.com/cnic_record.php'; // Login bhi isi page par ho raha hai
    const dataUrl = 'https://leakedhub.hasnaint.com/cnic_record.php';

    try {
        // --- STEP 1: LOGIN KARNA ---
        // Yahan hum login credentials bhej rahe hain
        const loginDetails = new URLSearchParams();
        loginDetails.append('username', 'Shah001'); // Agar field name 'user' hai to wo likhain
        loginDetails.append('password', 'Shah001@'); // Agar field name 'pass' hai to wo likhain
        loginDetails.append('login', ''); // Kuch sites ko login button ki value chahiye hoti hai

        const loginResponse = await fetch(loginUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: loginDetails
        });

        // Login ke baad server humein ek Cookie deta hai (PHPSESSID)
        const cookie = loginResponse.headers.get('set-cookie');

        if (!cookie) {
            // Agar cookie nahi mili, iska matlab login fail hua ya fields ke naam ghalat hain
            return res.status(401).send("Login failed. Check username/password field names.");
        }

        // --- STEP 2: DATA FETCH KARNA ---
        // Ab hum wohi Cookie use kar ke CNIC ka data mangwaen ge
        const searchDetails = new URLSearchParams();
        searchDetails.append('cnic', cnic);

        const dataResponse = await fetch(dataUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cookie': cookie, // Ye sab se zaroori hai
                'User-Agent': 'Mozilla/5.0'
            },
            body: searchDetails
        });

        let html = await dataResponse.text();

        // Agar result mein ab bhi login page aa raha hai, to iska matlab login session nahi bana
        if (html.includes('password') && html.includes('Username')) {
             return res.status(403).send("System login nahi ho saka. Cookie issue.");
        }

        res.status(200).send(html);

    } catch (error) {
        res.status(500).json({ error: "Connection error: " + error.message });
    }
}
