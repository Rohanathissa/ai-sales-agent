-- ============================================================
-- RESET SCRIPT
-- Run this first if db:setup fails with "relation already exists".
-- Drops all AI Sales Agent tables so schema.sql can run clean.
-- ============================================================

DROP TABLE IF EXISTS business_rules CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS conversations CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS businesses CASCADE;
