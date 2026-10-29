const https = require('https');

/**
 * WhatsApp Cloud API Integration Service
 * Sends outbound WhatsApp messages via Meta Graph API v21.0
 */
async function sendWhatsAppMessage(toPhone, textBody) {
  const path = require('path');
  require('dotenv').config({ path: path.resolve(__dirname, '../../.env'), override: true });
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const token = process.env.WHATSAPP_TOKEN;

  if (!phoneNumberId || !token) {
    console.warn('WhatsApp credentials missing in .env (WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_TOKEN)');
    return null;
  }

  // Sanitize phone number (remove +, spaces, hyphens)
  const cleanPhone = String(toPhone).replace(/[^0-9]/g, '');

  const payload = JSON.stringify({
    messaging_product: 'whatsapp',
    to: cleanPhone,
    type: 'text',
    text: {
      body: textBody,
    },
  });

  const options = {
    hostname: 'graph.facebook.com',
    port: 443,
    path: `/v21.0/${phoneNumberId}/messages`,
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload),
    },
    family: 4, // Force IPv4 to prevent Windows Node fetch DNS/IPv6 timeouts
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let dataStr = '';
      res.on('data', (chunk) => { dataStr += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(dataStr);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            console.log(`WhatsApp message successfully sent to ${cleanPhone}:`, parsed);
            resolve(parsed);
          } else {
            console.error('Meta WhatsApp API Error Response:', parsed);
            resolve(parsed);
          }
        } catch (e) {
          resolve({ raw: dataStr });
        }
      });
    });

    req.on('error', (err) => {
      console.error('Failed to send WhatsApp message via Meta API:', err.message);
      reject(err);
    });

    req.write(payload);
    req.end();
  });
}

module.exports = { sendWhatsAppMessage };
