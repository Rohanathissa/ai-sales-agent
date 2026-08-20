require('dotenv').config();
const { Pool } = require('pg');

// Single shared connection pool for the whole app.
// pg picks up PGHOST / PGPORT / PGUSER / PGPASSWORD / PGDATABASE from env automatically,
// but we pass them explicitly here so .env is the single source of truth.
const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  port: Number(process.env.PGPORT) || 5432,
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || 'postgres',
  database: process.env.PGDATABASE || 'ai_sales_agent',
});

pool.on('error', (err) => {
  // Unexpected errors on idle clients — log and keep the process alive.
  console.error('Unexpected PostgreSQL pool error:', err);
});

module.exports = pool;
