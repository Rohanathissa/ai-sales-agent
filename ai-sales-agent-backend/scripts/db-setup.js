// Runs db/schema.sql then db/seed.sql against the database configured in .env.
// Usage: npm run db:setup
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

async function run() {
  const client = new Client({
    host: process.env.PGHOST || 'localhost',
    port: Number(process.env.PGPORT) || 5432,
    user: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD || 'postgres',
    database: process.env.PGDATABASE || 'ai_sales_agent',
  });

  await client.connect();
  console.log(`Connected to database "${process.env.PGDATABASE || 'ai_sales_agent'}"`);

  const schema = fs.readFileSync(path.join(__dirname, '..', 'db', 'schema.sql'), 'utf8');
  console.log('Running schema.sql ...');
  await client.query(schema);
  console.log('Schema created.');

  const seedPath = path.join(__dirname, '..', 'db', 'seed.sql');
  if (fs.existsSync(seedPath)) {
    const seed = fs.readFileSync(seedPath, 'utf8');
    console.log('Running seed.sql ...');
    await client.query(seed);
    console.log('Seed data inserted.');
  }

  await client.end();
  console.log('Done.');
}

run().catch((err) => {
  console.error('db:setup failed:', err.message);
  process.exit(1);
});
