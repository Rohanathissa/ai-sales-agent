const express = require('express');
const pool = require('../db/pool');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

// GET /api/conversations/:id  -> conversation + its messages, for a full thread view
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  const convResult = await pool.query(
    'SELECT * FROM conversations WHERE id = $1',
    [id]
  );
  if (convResult.rows.length === 0) {
    return res.status(404).json({ error: 'Conversation not found' });
  }

  const msgResult = await pool.query(
    'SELECT * FROM messages WHERE conversation_id = $1 ORDER BY created_at ASC',
    [id]
  );

  res.json({ ...convResult.rows[0], messages: msgResult.rows });
}));

// PUT /api/conversations/:id  -> update status, assignment, AI toggle, lead score, summary
router.put('/:id', asyncHandler(async (req, res) => {
  const { status, ai_enabled, assigned_to, lead_score, summary, closed_at } = req.body;

  const { rows } = await pool.query(
    `UPDATE conversations SET
       status = COALESCE($1, status),
       ai_enabled = COALESCE($2, ai_enabled),
       assigned_to = COALESCE($3, assigned_to),
       lead_score = COALESCE($4, lead_score),
       summary = COALESCE($5, summary),
       closed_at = COALESCE($6, closed_at)
     WHERE id = $7
     RETURNING *`,
    [status, ai_enabled, assigned_to, lead_score, summary, closed_at, req.params.id]
  );

  if (rows.length === 0) {
    return res.status(404).json({ error: 'Conversation not found' });
  }
  res.json(rows[0]);
}));

// DELETE /api/conversations/:id
router.delete('/:id', asyncHandler(async (req, res) => {
  const { rowCount } = await pool.query(
    'DELETE FROM conversations WHERE id = $1',
    [req.params.id]
  );
  if (rowCount === 0) {
    return res.status(404).json({ error: 'Conversation not found' });
  }
  res.status(204).send();
}));

module.exports = router;
