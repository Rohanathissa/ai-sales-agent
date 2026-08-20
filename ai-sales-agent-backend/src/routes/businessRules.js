const express = require('express');
const pool = require('../db/pool');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router({ mergeParams: true });

// GET /api/businesses/:businessId/rules?is_active=true
router.get('/', asyncHandler(async (req, res) => {
  const { businessId } = req.params;
  const { is_active } = req.query;

  const conditions = ['business_id = $1'];
  const values = [businessId];

  if (is_active !== undefined) {
    values.push(is_active === 'true');
    conditions.push(`is_active = $${values.length}`);
  }

  const { rows } = await pool.query(
    `SELECT * FROM business_rules WHERE ${conditions.join(' AND ')} ORDER BY id`,
    values
  );
  res.json(rows);
}));

// POST /api/businesses/:businessId/rules
router.post('/', asyncHandler(async (req, res) => {
  const { businessId } = req.params;
  const { rule_name, rule_type, rule_value, is_active } = req.body;

  if (!rule_name || !rule_type) {
    return res.status(400).json({ error: 'rule_name and rule_type are required' });
  }

  const { rows } = await pool.query(
    `INSERT INTO business_rules (business_id, rule_name, rule_type, rule_value, is_active)
     VALUES ($1,$2,$3, COALESCE($4,'{}'::jsonb), COALESCE($5, TRUE))
     RETURNING *`,
    [businessId, rule_name, rule_type, rule_value ? JSON.stringify(rule_value) : null, is_active]
  );
  res.status(201).json(rows[0]);
}));

// PUT /api/businesses/:businessId/rules/:id
router.put('/:id', asyncHandler(async (req, res) => {
  const { rule_name, rule_type, rule_value, is_active } = req.body;

  const { rows } = await pool.query(
    `UPDATE business_rules SET
       rule_name = COALESCE($1, rule_name),
       rule_type = COALESCE($2, rule_type),
       rule_value = COALESCE($3, rule_value),
       is_active = COALESCE($4, is_active),
       updated_at = CURRENT_TIMESTAMP
     WHERE id = $5 AND business_id = $6
     RETURNING *`,
    [rule_name, rule_type, rule_value ? JSON.stringify(rule_value) : null, is_active,
     req.params.id, req.params.businessId]
  );

  if (rows.length === 0) {
    return res.status(404).json({ error: 'Business rule not found' });
  }
  res.json(rows[0]);
}));

// DELETE /api/businesses/:businessId/rules/:id
router.delete('/:id', asyncHandler(async (req, res) => {
  const { rowCount } = await pool.query(
    'DELETE FROM business_rules WHERE id = $1 AND business_id = $2',
    [req.params.id, req.params.businessId]
  );
  if (rowCount === 0) {
    return res.status(404).json({ error: 'Business rule not found' });
  }
  res.status(204).send();
}));

module.exports = router;
