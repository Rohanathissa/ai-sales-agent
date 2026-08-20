const express = require('express');
const pool = require('../db/pool');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router({ mergeParams: true });

// GET /api/businesses/:businessId/customers?lead_status=
router.get('/', asyncHandler(async (req, res) => {
  const { businessId } = req.params;
  const { lead_status } = req.query;

  const conditions = ['business_id = $1'];
  const values = [businessId];

  if (lead_status) {
    values.push(lead_status);
    conditions.push(`lead_status = $${values.length}`);
  }

  const { rows } = await pool.query(
    `SELECT * FROM customers WHERE ${conditions.join(' AND ')} ORDER BY id`,
    values
  );
  res.json(rows);
}));

// GET /api/businesses/:businessId/customers/:id
router.get('/:id', asyncHandler(async (req, res) => {
  const { rows } = await pool.query(
    'SELECT * FROM customers WHERE id = $1 AND business_id = $2',
    [req.params.id, req.params.businessId]
  );
  if (rows.length === 0) {
    return res.status(404).json({ error: 'Customer not found' });
  }
  res.json(rows[0]);
}));

// POST /api/businesses/:businessId/customers
router.post('/', asyncHandler(async (req, res) => {
  const { businessId } = req.params;
  const {
    name, phone, whatsapp_number, email, country, preferred_language,
    budget_min, budget_max, currency, interests, lead_status, notes,
  } = req.body;

  const { rows } = await pool.query(
    `INSERT INTO customers
       (business_id, name, phone, whatsapp_number, email, country, preferred_language,
        budget_min, budget_max, currency, interests, lead_status, notes)
     VALUES ($1,$2,$3,$4,$5,$6, COALESCE($7,'en'), $8,$9, COALESCE($10,'USD'),
             COALESCE($11,'{}'::jsonb), COALESCE($12,'new'), $13)
     RETURNING *`,
    [businessId, name, phone, whatsapp_number, email, country, preferred_language,
     budget_min, budget_max, currency,
     interests ? JSON.stringify(interests) : null, lead_status, notes]
  );
  res.status(201).json(rows[0]);
}));

// PUT /api/businesses/:businessId/customers/:id
router.put('/:id', asyncHandler(async (req, res) => {
  const {
    name, phone, whatsapp_number, email, country, preferred_language,
    budget_min, budget_max, currency, interests, lead_status, notes,
  } = req.body;

  const { rows } = await pool.query(
    `UPDATE customers SET
       name = COALESCE($1, name),
       phone = COALESCE($2, phone),
       whatsapp_number = COALESCE($3, whatsapp_number),
       email = COALESCE($4, email),
       country = COALESCE($5, country),
       preferred_language = COALESCE($6, preferred_language),
       budget_min = COALESCE($7, budget_min),
       budget_max = COALESCE($8, budget_max),
       currency = COALESCE($9, currency),
       interests = COALESCE($10, interests),
       lead_status = COALESCE($11, lead_status),
       notes = COALESCE($12, notes),
       updated_at = CURRENT_TIMESTAMP
     WHERE id = $13 AND business_id = $14
     RETURNING *`,
    [name, phone, whatsapp_number, email, country, preferred_language,
     budget_min, budget_max, currency,
     interests ? JSON.stringify(interests) : null, lead_status, notes,
     req.params.id, req.params.businessId]
  );

  if (rows.length === 0) {
    return res.status(404).json({ error: 'Customer not found' });
  }
  res.json(rows[0]);
}));

// DELETE /api/businesses/:businessId/customers/:id
router.delete('/:id', asyncHandler(async (req, res) => {
  const { rowCount } = await pool.query(
    'DELETE FROM customers WHERE id = $1 AND business_id = $2',
    [req.params.id, req.params.businessId]
  );
  if (rowCount === 0) {
    return res.status(404).json({ error: 'Customer not found' });
  }
  res.status(204).send();
}));

module.exports = router;
