const express = require('express');
const pool = require('../db/pool');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router({ mergeParams: true });

// GET /api/businesses/:businessId/conversations?status=&customer_id=
router.get('/', asyncHandler(async (req, res) => {
  const { businessId } = req.params;
  const { status, customer_id } = req.query;

  const conditions = ['business_id = $1'];
  const values = [businessId];

  if (status) {
    values.push(status);
    conditions.push(`status = $${values.length}`);
  }
  if (customer_id) {
    values.push(customer_id);
    conditions.push(`customer_id = $${values.length}`);
  }

  const { rows } = await pool.query(
    `SELECT * FROM conversations WHERE ${conditions.join(' AND ')} ORDER BY started_at DESC`,
    values
  );
  res.json(rows);
}));

// POST /api/businesses/:businessId/conversations
router.post('/', asyncHandler(async (req, res) => {
  const { businessId } = req.params;
  const { customer_id, channel, external_id, status, ai_enabled, assigned_to, lead_score, summary } = req.body;

  if (!customer_id) {
    return res.status(400).json({ error: 'customer_id is required' });
  }

  const { rows } = await pool.query(
    `INSERT INTO conversations
       (business_id, customer_id, channel, external_id, status, ai_enabled, assigned_to, lead_score, summary, last_message_at)
     VALUES ($1,$2, COALESCE($3,'whatsapp'), $4, COALESCE($5,'active'), COALESCE($6, TRUE), $7, COALESCE($8,0), $9, CURRENT_TIMESTAMP)
     RETURNING *`,
    [businessId, customer_id, channel, external_id, status, ai_enabled, assigned_to, lead_score, summary]
  );
  res.status(201).json(rows[0]);
}));

module.exports = router;
