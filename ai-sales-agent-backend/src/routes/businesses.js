const express = require('express');
const pool = require('../db/pool');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

// GET /api/businesses
router.get('/', asyncHandler(async (req, res) => {
  const { rows } = await pool.query(
    'SELECT * FROM businesses ORDER BY id'
  );
  res.json(rows);
}));

// GET /api/businesses/:id
router.get('/:id', asyncHandler(async (req, res) => {
  const { rows } = await pool.query(
    'SELECT * FROM businesses WHERE id = $1',
    [req.params.id]
  );
  if (rows.length === 0) {
    return res.status(404).json({ error: 'Business not found' });
  }
  res.json(rows[0]);
}));

// POST /api/businesses
router.post('/', asyncHandler(async (req, res) => {
  const {
    name, business_type, description, email, phone,
    whatsapp_number, country, currency, timezone, ai_enabled, status,
  } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'name is required' });
  }

  const { rows } = await pool.query(
    `INSERT INTO businesses
      (name, business_type, description, email, phone, whatsapp_number,
       country, currency, timezone, ai_enabled, status)
     VALUES ($1,$2,$3,$4,$5,$6,
             COALESCE($7,'Sri Lanka'), COALESCE($8,'USD'), COALESCE($9,'Asia/Colombo'),
             COALESCE($10, TRUE), COALESCE($11,'active'))
     RETURNING *`,
    [name, business_type, description, email, phone, whatsapp_number,
     country, currency, timezone, ai_enabled, status]
  );
  res.status(201).json(rows[0]);
}));

// PUT /api/businesses/:id
router.put('/:id', asyncHandler(async (req, res) => {
  const {
    name, business_type, description, email, phone,
    whatsapp_number, country, currency, timezone, ai_enabled, status,
  } = req.body;

  const { rows } = await pool.query(
    `UPDATE businesses SET
       name = COALESCE($1, name),
       business_type = COALESCE($2, business_type),
       description = COALESCE($3, description),
       email = COALESCE($4, email),
       phone = COALESCE($5, phone),
       whatsapp_number = COALESCE($6, whatsapp_number),
       country = COALESCE($7, country),
       currency = COALESCE($8, currency),
       timezone = COALESCE($9, timezone),
       ai_enabled = COALESCE($10, ai_enabled),
       status = COALESCE($11, status),
       updated_at = CURRENT_TIMESTAMP
     WHERE id = $12
     RETURNING *`,
    [name, business_type, description, email, phone, whatsapp_number,
     country, currency, timezone, ai_enabled, status, req.params.id]
  );

  if (rows.length === 0) {
    return res.status(404).json({ error: 'Business not found' });
  }
  res.json(rows[0]);
}));

// DELETE /api/businesses/:id
router.delete('/:id', asyncHandler(async (req, res) => {
  const { rowCount } = await pool.query(
    'DELETE FROM businesses WHERE id = $1',
    [req.params.id]
  );
  if (rowCount === 0) {
    return res.status(404).json({ error: 'Business not found' });
  }
  res.status(204).send();
}));

module.exports = router;
