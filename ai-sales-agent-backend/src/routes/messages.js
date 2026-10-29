const express = require('express');
const pool = require('../db/pool');
const asyncHandler = require('../utils/asyncHandler');
const { generateReply } = require('../services/aiAgent');

const router = express.Router({ mergeParams: true });

// GET /api/conversations/:conversationId/messages
router.get('/', asyncHandler(async (req, res) => {
  const { rows } = await pool.query(
    'SELECT * FROM messages WHERE conversation_id = $1 ORDER BY created_at ASC',
    [req.params.conversationId]
  );
  res.json(rows);
}));

// POST /api/conversations/:conversationId/messages
// Saves the incoming message, bumps the conversation's last_message_at,
// and — if the sender is a customer and AI is enabled for this conversation —
// generates and saves an AI reply too.
router.post('/', asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const { sender_type, message_type, content, external_message_id, ai_generated, metadata } = req.body;

  if (!sender_type || !content) {
    return res.status(400).json({ error: 'sender_type and content are required' });
  }

  const client = await pool.connect();
  let customerMessage;
  try {
    await client.query('BEGIN');

    const { rows } = await client.query(
      `INSERT INTO messages
         (conversation_id, sender_type, message_type, content, external_message_id, ai_generated, metadata)
       VALUES ($1,$2, COALESCE($3,'text'), $4, $5, COALESCE($6, FALSE), COALESCE($7,'{}'::jsonb))
       RETURNING *`,
      [conversationId, sender_type, message_type, content, external_message_id,
       ai_generated, metadata ? JSON.stringify(metadata) : null]
    );
    customerMessage = rows[0];

    await client.query(
      'UPDATE conversations SET last_message_at = CURRENT_TIMESTAMP WHERE id = $1',
      [conversationId]
    );

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }

  // If sender is a human agent, dispatch to the customer's WhatsApp!
  if (sender_type === 'human' || sender_type === 'agent') {
    try {
      const custRes = await pool.query(
        `SELECT c.whatsapp_number, conv.channel 
         FROM conversations conv 
         JOIN customers c ON conv.customer_id = c.id 
         WHERE conv.id = $1`,
        [conversationId]
      );
      const customer = custRes.rows[0];
      if (customer?.whatsapp_number) {
        const { sendWhatsAppMessage } = require('../services/whatsappService');
        const cleanPhone = String(customer.whatsapp_number).replace(/[^0-9]/g, '');
        console.log(`Dispatching human agent reply to customer WhatsApp (+${cleanPhone})...`);
        const waResult = await sendWhatsAppMessage(cleanPhone, content);
        if (waResult?.messages?.[0]?.id) {
          await pool.query(
            'UPDATE messages SET external_message_id = $1 WHERE id = $2',
            [waResult.messages[0].id, customerMessage.id]
          );
          console.log(`Human agent reply sent to WhatsApp: ${waResult.messages[0].id}`);
        }
      }
    } catch (err) {
      console.error('Error dispatching human agent message to WhatsApp:', err.message);
    }
    return res.status(201).json({ customerMessage, aiMessage: null, sentToWhatsApp: true });
  }

  // Only trigger AI reply for incoming customer messages
  if (sender_type !== 'customer') {
    return res.status(201).json({ customerMessage, aiMessage: null });
  }

  const convResult = await pool.query(
    'SELECT business_id, ai_enabled FROM conversations WHERE id = $1',
    [conversationId]
  );
  const conversation = convResult.rows[0];

  if (!conversation || !conversation.ai_enabled) {
    return res.status(201).json({ customerMessage, aiMessage: null });
  }

  // Load conversation history (excluding the message we just inserted, then include it as the new message)
  const historyResult = await pool.query(
    `SELECT sender_type, content FROM messages
     WHERE conversation_id = $1 AND id != $2
     ORDER BY created_at ASC`,
    [conversationId, customerMessage.id]
  );

  let aiMessage = null;
  try {
    const replyText = await generateReply(conversation.business_id, historyResult.rows, content);

    const aiInsert = await pool.query(
      `INSERT INTO messages (conversation_id, sender_type, message_type, content, ai_generated)
       VALUES ($1, 'ai', 'text', $2, TRUE)
       RETURNING *`,
      [conversationId, replyText]
    );
    aiMessage = aiInsert.rows[0];

    await pool.query(
      'UPDATE conversations SET last_message_at = CURRENT_TIMESTAMP WHERE id = $1',
      [conversationId]
    );
  } catch (err) {
    console.error('AI reply generation failed:', err.message);
    // Don't fail the whole request if AI generation breaks — customer message is already saved
  }

  res.status(201).json({ customerMessage, aiMessage });
}));

module.exports = router;