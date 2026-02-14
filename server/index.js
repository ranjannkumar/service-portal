const express = require('express');
const { Client, RemoteAuth } = require('whatsapp-web.js');
const qrcodeTerminal = require('qrcode-terminal'); // Renamed to avoid variable clash
const QRCode = require('qrcode'); // For generating image
const bodyParser = require('body-parser');
const cors = require('cors');
const SupabaseStore = require('./SupabaseStore');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Load env vars
require('dotenv').config();

// Initialize Store
const store = new SupabaseStore({
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY
});

// Store latest QR code
let latestQr = null;
let isReady = false;

// Initialize WhatsApp Client with RemoteAuth
const client = new Client({
    authStrategy: new RemoteAuth({
        store: store,
        backupSyncIntervalMs: 60000
    }),
    puppeteer: {
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process', // Critical for low memory
            '--disable-gpu',
            '--disable-extensions',
            '--disable-component-extensions-with-background-pages',
            '--disable-default-apps',
            '--mute-audio',
            '--no-default-browser-check',
            '--autoplay-policy=user-gesture-required',
            '--disable-background-timer-throttling',
            '--disable-backgrounding-occluded-windows',
            '--disable-notifications',
            '--disable-background-networking',
            '--disable-breakpad',
            '--disable-component-update',
            '--disable-domain-reliability',
            '--disable-sync'
        ],
        headless: true
    }
});

// Event: QR Code Generated
client.on('qr', (qr) => {
    console.log('QR RECEIVED', qr);
    qrcodeTerminal.generate(qr, { small: true });
    latestQr = qr;
    isReady = false;
});

// Event: Client Ready
client.on('ready', () => {
    console.log('WhatsApp Client is ready!');
    isReady = true;
    latestQr = null; // Clear QR when connected
});

// Event: Remote Session Saved
client.on('remote_session_saved', () => {
    console.log('Remote session saved to Supabase!');
});

// Event: Auth Failure
client.on('auth_failure', (msg) => {
    console.error('AUTHENTICATION FAILURE', msg);
    isReady = false;
});

// Initialize Client
client.initialize();

// Keep-Alive Route
app.get('/', (req, res) => {
    res.send(`WhatsApp Server is Running! Status: ${isReady ? 'Connected ✅' : 'Disconnected ❌'}`);
});

// Event: Disconnected (Logged out from phone)
client.on('disconnected', async (reason) => {
    console.log('Client was logged out', reason);
    isReady = false;
    // Destroy and re-initialize to get new QR
    await client.destroy();
    client.initialize();
});

// Logout Route
app.get('/logout', async (req, res) => {
    try {
        await client.logout();
        res.send(`
            <html>
                <body style="font-family: sans-serif; text-align: center; padding: 50px;">
                    <h1>👋 Logged Out</h1>
                    <p>Old number disconnected.</p>
                    <p><a href="/link-whatsapp">Click here to link a new number</a></p>
                </body>
            </html>
        `);
    } catch (error) {
        console.error('Error logging out:', error);
        res.status(500).send('Error logging out. You might already be logged out.');
    }
});

// QR Code Display Route
app.get('/link-whatsapp', async (req, res) => {
    if (isReady) {
        return res.send(`
            <html>
                <body style="font-family: sans-serif; text-align: center; padding: 50px;">
                    <h1>✅ WhatsApp Connected!</h1>
                    <p>Your server is linked and ready to send messages.</p>
                </body>
            </html>
        `);
    }

    if (!latestQr) {
        return res.send(`
            <html>
                <body style="font-family: sans-serif; text-align: center; padding: 50px;">
                    <h1>⏳ Waiting for QR Code...</h1>
                    <p>Please wait a moment and refresh this page.</p>
                    <script>setTimeout(() => window.location.reload(), 5000);</script>
                </body>
            </html>
        `);
    }

    try {
        const qrImage = await QRCode.toDataURL(latestQr);
        res.send(`
            <html>
                <body style="font-family: sans-serif; text-align: center; padding: 50px;">
                    <h1>🔗 Link WhatsApp</h1>
                    <p>Scan this QR code with the WhatsApp on your client's phone.</p>
                    <img src="${qrImage}" alt="QR Code" style="width: 300px; height: 300px; border: 1px solid #ddd; padding: 10px; border-radius: 10px;"/>
                    <p>This page will auto-refresh to keep the code active.</p>
                    <script>setTimeout(() => window.location.reload(), 15000);</script>
                </body>
            </html>
        `);
    } catch (err) {
        res.status(500).send('Error generating QR code');
    }
});

// Webhook Endpoint for Supabase
app.post('/api/notify', async (req, res) => {
    try {
        const { type, record, old_record } = req.body;

        // Check if this is an UPDATE to the 'status' column
        if (type === 'UPDATE' && record && old_record) {
            
            // Only send if status actually changed
            if (record.status === old_record.status) {
                return res.status(200).send({ message: 'Status did not change, no message sent.' });
            }

            const { name, service_type, status } = record;
            
            let phoneNumber = record.phone;

            if (!phoneNumber) {
                console.log(`No phone number found for applicant: ${name}`);
                return res.status(400).send({ error: 'No phone number found for applicant.' });
            }

            // Format Phone Number to 91XXXXXXXXXX
            phoneNumber = phoneNumber.toString().replace(/\D/g, '');

            if (phoneNumber.length === 10) {
                phoneNumber = '91' + phoneNumber;
            } else if (phoneNumber.length > 10 && !phoneNumber.startsWith('91')) {
                 console.warn(`Unusual phone number length: ${phoneNumber}`);
            }

            // Add WhatsApp suffix
            const chatId = `${phoneNumber}@c.us`;

            // Prepare Message in Hindi
            const message = `नमस्ते ${name}, आपके ${service_type} का फॉर्म अपडेट हो गया है। नया स्टेटस: ${status}।\n\nअधिक जानकारी के लिए वेबसाइट चेक करें।\nधन्यवाद, Online Cyber Center`;

            // Send Message
            await client.sendMessage(chatId, message);
            console.log(`Message sent to ${name} (${phoneNumber}): ${status}`);

            return res.status(200).send({ success: true, message: 'Notification sent.' });
        } else {
             return res.status(200).send({ message: 'Not an update event or missing data.' });
        }

    } catch (error) {
        console.error('Error handling webhook:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
