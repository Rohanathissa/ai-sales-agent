// routes/users.js
const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router({ mergeParams: true }); // mergeParams to access :businessId
const db = require('../db/pool');

const SALT_ROUNDS = 10;

// GET all managers for a business
router.get('/', async (req, res, next) => {
  try {
    const { businessId } = req.params;
    const result = await db.query(
      `SELECT id, business_id, name, email, role, is_active, created_at, updated_at
       FROM users WHERE business_id = $1 ORDER BY created_at DESC`,
      [businessId]
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// POST create a new manager
router.post('/', async (req, res, next) => {
  try {
    const { businessId } = req.params;
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'name, email, password are required' });
    }

    const existing = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

    const result = await db.query(
      `INSERT INTO users (business_id, name, email, password_hash, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, business_id, name, email, role, is_active, created_at, updated_at`,
      [businessId, name, email, password_hash, role || 'AGENT']
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// PATCH update manager details (name, role)
router.patch('/:userId', async (req, res, next) => {
  try {
    const { userId, businessId } = req.params;
    const { name, role } = req.body;

    const result = await db.query(
      `UPDATE users SET
         name = COALESCE($1, name),
         role = COALESCE($2, role),
         updated_at = NOW()
       WHERE id = $3 AND business_id = $4
       RETURNING id, business_id, name, email, role, is_active, created_at, updated_at`,
      [name, role, userId, businessId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// PATCH toggle enable/disable
router.patch('/:userId/status', async (req, res, next) => {
  try {
    const { userId, businessId } = req.params;
    const { is_active } = req.body;

    if (typeof is_active !== 'boolean') {
      return res.status(400).json({ error: 'is_active must be true or false' });
    }

    const result = await db.query(
      `UPDATE users SET is_active = $1, updated_at = NOW()
       WHERE id = $2 AND business_id = $3
       RETURNING id, business_id, name, email, role, is_active, created_at, updated_at`,
      [is_active, userId, businessId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// DELETE a manager
router.delete('/:userId', async (req, res, next) => {
  try {
    const { userId, businessId } = req.params;

    const result = await db.query(
      'DELETE FROM users WHERE id = $1 AND business_id = $2 RETURNING id',
      [userId, businessId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;