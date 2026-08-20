const express = require('express');
const pool = require('../db/pool');
const asyncHandler = require('../utils/asyncHandler');

// mergeParams lets us read :businessId from the parent router (server.js mounts this at /api/businesses/:businessId/products)
const router = express.Router({ mergeParams: true });

// GET /api/businesses/:businessId/products?category=&stock_status=&is_active=&page=1&limit=10
router.get('/', asyncHandler(async (req, res) => {
  const { businessId } = req.params;
  const { category, stock_status, is_active, page = 1, limit = 10 } = req.query;

  const conditions = ['business_id = $1'];
  const values = [businessId];

  if (category) {
    values.push(category);
    conditions.push(`category = $${values.length}`);
  }
  if (stock_status) {
    values.push(stock_status);
    conditions.push(`stock_status = $${values.length}`);
  }
  if (is_active !== undefined) {
    values.push(is_active === 'true');
    conditions.push(`is_active = $${values.length}`);
  }

  const whereClause = conditions.join(' AND ');

  // Total count (used to calculate total pages)
  const countResult = await pool.query(
    `SELECT COUNT(*) FROM products WHERE ${whereClause}`,
    values
  );
  const total = parseInt(countResult.rows[0].count, 10);

  // Paginated data
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.max(1, parseInt(limit, 10) || 10);
  const offset = (pageNum - 1) * limitNum;

  const dataValues = [...values, limitNum, offset];
  const { rows } = await pool.query(
    `SELECT * FROM products WHERE ${whereClause}
     ORDER BY id
     LIMIT $${dataValues.length - 1} OFFSET $${dataValues.length}`,
    dataValues
  );

  res.json({
    data: rows,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
    },
  });
}));

// GET /api/businesses/:businessId/products/:id
router.get('/:id', asyncHandler(async (req, res) => {
  const { rows } = await pool.query(
    'SELECT * FROM products WHERE id = $1 AND business_id = $2',
    [req.params.id, req.params.businessId]
  );
  if (rows.length === 0) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(rows[0]);
}));

// POST /api/businesses/:businessId/products
router.post('/', asyncHandler(async (req, res) => {
  const { businessId } = req.params;
  const {
    sku, name, category, description, price, currency,
    attributes, stock_status, is_active,
  } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'name is required' });
  }

  const { rows } = await pool.query(
    `INSERT INTO products
       (business_id, sku, name, category, description, price, currency, attributes, stock_status, is_active)
     VALUES ($1,$2,$3,$4,$5,$6, COALESCE($7,'USD'), COALESCE($8,'{}'::jsonb), COALESCE($9,'available'), COALESCE($10, TRUE))
     RETURNING *`,
    [businessId, sku, name, category, description, price, currency,
     attributes ? JSON.stringify(attributes) : null, stock_status, is_active]
  );
  res.status(201).json(rows[0]);
}));

// PUT /api/businesses/:businessId/products/:id
router.put('/:id', asyncHandler(async (req, res) => {
  const {
    sku, name, category, description, price, currency,
    attributes, stock_status, is_active,
  } = req.body;

  const { rows } = await pool.query(
    `UPDATE products SET
       sku = COALESCE($1, sku),
       name = COALESCE($2, name),
       category = COALESCE($3, category),
       description = COALESCE($4, description),
       price = COALESCE($5, price),
       currency = COALESCE($6, currency),
       attributes = COALESCE($7, attributes),
       stock_status = COALESCE($8, stock_status),
       is_active = COALESCE($9, is_active),
       updated_at = CURRENT_TIMESTAMP
     WHERE id = $10 AND business_id = $11
     RETURNING *`,
    [sku, name, category, description, price, currency,
     attributes ? JSON.stringify(attributes) : null, stock_status, is_active,
     req.params.id, req.params.businessId]
  );

  if (rows.length === 0) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(rows[0]);
}));

// DELETE /api/businesses/:businessId/products/:id
router.delete('/:id', asyncHandler(async (req, res) => {
  const { rowCount } = await pool.query(
    'DELETE FROM products WHERE id = $1 AND business_id = $2',
    [req.params.id, req.params.businessId]
  );
  if (rowCount === 0) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.status(204).send();
}));

module.exports = router;