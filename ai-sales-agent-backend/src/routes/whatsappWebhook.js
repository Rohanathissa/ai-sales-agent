const express = require('express');
const pool = require('../db/pool');
const asyncHandler = require('../utils/asyncHandler');
const { generateReply } = require('../services/aiAgent');
const { sendWhatsAppMessage } = require('../services/whatsappService');

const router = express.Router();

/**
 * GET /api/whatsapp/webhook
 * Meta Webhook Verification Endpoint
 * Meta sends a GET request to verify the webhook URL when setting up in Developer Portal.
 */
router.get('/', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  const expectedToken = process.env.WHATSAPP_VERIFY_TOKEN || 'my_secret_webhook_token_123';

  if (mode === 'subscribe' && token === expectedToken) {
    console.log('WhatsApp Webhook Verified Successfully!');
    return res.status(200).send(challenge);
  } else {
    console.warn('WhatsApp Webhook verification failed. Token mismatch.');
    return res.sendStatus(403);
  }
});

/**
 * POST /api/whatsapp/webhook
 * Meta Incoming Messages Webhook Endpoint
 * Receives incoming WhatsApp messages from customers, processes them with AI Agent, and sends back WhatsApp reply.
 */
router.post('/', async (req, res) => {
  console.log('Incoming Meta Webhook POST event received:', JSON.stringify(req.body));
  // Send 200 OK immediately to Meta so Meta doesn't timeout or retry
  res.status(200).send('EVENT_RECEIVED');

  const body = req.body;

  if (body?.object !== 'whatsapp_business_account') {
    return;
  }

  const entries = body.entry || [];
  for (const entry of entries) {
    const changes = entry.changes || [];
    for (const change of changes) {
      if (change.field !== 'messages') continue;
      const value = change.value || {};
      const messages = value.messages || [];

      for (const msg of messages) {
        // Only process text messages for now
        if (msg.type !== 'text' || !msg.text?.body) continue;

        const rawFromPhone = msg.from; // Customer WhatsApp number e.g. "94719759280"
        const cleanFromPhone = String(rawFromPhone).replace(/[^0-9]/g, '');
        const messageText = msg.text.body;

        console.log(`Processing WhatsApp message from +${cleanFromPhone}: "${messageText}"`);

        // Try to get contact name if provided
        const contacts = value.contacts || [];
        const contact = contacts.find((c) => c.wa_id === rawFromPhone || c.wa_id === cleanFromPhone);
        const contactName = contact?.profile?.name || `Customer +${cleanFromPhone}`;

        const businessId = 1; // Default business ID

        try {
          // 1. Find or create customer (match clean digits or with +)
          let customerResult = await pool.query(
            `SELECT * FROM customers 
             WHERE business_id = $1 AND (
               REGEXP_REPLACE(whatsapp_number, '[^0-9]', '', 'g') = $2
             )`,
            [businessId, cleanFromPhone]
          );

          let customer;
          if (customerResult.rows.length === 0) {
            const newCustomer = await pool.query(
              `INSERT INTO customers (business_id, name, whatsapp_number)
               VALUES ($1, $2, $3) RETURNING *`,
              [businessId, contactName, `+${cleanFromPhone}`]
            );
            customer = newCustomer.rows[0];
          } else {
            customer = customerResult.rows[0];
          }

          // 2. Find or create active conversation
          let convResult = await pool.query(
            `SELECT * FROM conversations 
             WHERE business_id = $1 AND customer_id = $2 AND status = 'active'
             ORDER BY started_at DESC LIMIT 1`,
            [businessId, customer.id]
          );

          let conversation;
          if (convResult.rows.length === 0) {
            const newConv = await pool.query(
              `INSERT INTO conversations (business_id, customer_id, channel, external_id, ai_enabled)
               VALUES ($1, $2, 'whatsapp', $3, TRUE) RETURNING *`,
              [businessId, customer.id, cleanFromPhone]
            );
            conversation = newConv.rows[0];
          } else {
            conversation = convResult.rows[0];
          }

          // 3. Save incoming customer message
          const msgResult = await pool.query(
            `INSERT INTO messages (conversation_id, sender_type, message_type, content, external_message_id)
             VALUES ($1, 'customer', 'text', $2, $3) RETURNING *`,
            [conversation.id, messageText, msg.id]
          );
          const customerMsg = msgResult.rows[0];

          await pool.query(
            'UPDATE conversations SET last_message_at = CURRENT_TIMESTAMP WHERE id = $1',
            [conversation.id]
          );

          // 4. If AI enabled, generate reply & send outbound WhatsApp message
          if (conversation.ai_enabled) {
            console.log(`Generating AI reply for conversation #${conversation.id}...`);
            const historyResult = await pool.query(
              `SELECT sender_type, content FROM messages
               WHERE conversation_id = $1 AND id != $2
               ORDER BY created_at ASC`,
              [conversation.id, customerMsg.id]
            );

            const replyText = await generateReply(businessId, historyResult.rows, messageText);
            console.log(`AI Reply Generated: "${replyText}"`);

            // Save AI message to DB
            const aiMsgResult = await pool.query(
              `INSERT INTO messages (conversation_id, sender_type, message_type, content, ai_generated)
               VALUES ($1, 'ai', 'text', $2, TRUE) RETURNING id`,
              [conversation.id, replyText]
            );
            const aiMsgId = aiMsgResult.rows[0]?.id;

            await pool.query(
              'UPDATE conversations SET last_message_at = CURRENT_TIMESTAMP WHERE id = $1',
              [conversation.id]
            );

            // Send Outbound WhatsApp reply via Meta Graph API
            console.log(`Sending outbound reply to +${cleanFromPhone}...`);
            const waSendResult = await sendWhatsAppMessage(cleanFromPhone, replyText);
            if (waSendResult?.messages?.[0]?.id && aiMsgId) {
              await pool.query(
                'UPDATE messages SET external_message_id = $1 WHERE id = $2',
                [waSendResult.messages[0].id, aiMsgId]
              );
              console.log(`Outbound message #${aiMsgId} updated with Meta ID: ${waSendResult.messages[0].id}`);
            }
          }
        } catch (err) {
          console.error(`Error processing incoming WhatsApp message from +${cleanFromPhone}:`, err);
        }
      }
    }
  }
});

module.exports = router;
