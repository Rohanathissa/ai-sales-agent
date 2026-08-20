-- ============================================================
-- AI SALES AGENT - MVP DATABASE
-- Version: 0.1
-- PostgreSQL
-- ============================================================


-- ============================================================
-- 0. RESET (makes this script safe to re-run)
-- Drops tables in dependency order before recreating them, so
-- running db:setup twice never fails with "already exists".
-- ============================================================
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS business_rules CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS conversations CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS businesses CASCADE;

-- ============================================================
-- 1. BUSINESSES
-- ============================================================

CREATE TABLE businesses (
    id              BIGSERIAL PRIMARY KEY,
    name            VARCHAR(150) NOT NULL,
    business_type   VARCHAR(100),
    description     TEXT,
    email           VARCHAR(150),
    phone           VARCHAR(50),
    whatsapp_number VARCHAR(50),
    country         VARCHAR(100) DEFAULT 'Sri Lanka',
    currency        VARCHAR(10) DEFAULT 'USD',
    timezone        VARCHAR(100) DEFAULT 'Asia/Colombo',

    ai_enabled      BOOLEAN NOT NULL DEFAULT TRUE,
    status          VARCHAR(30) NOT NULL DEFAULT 'active',

    created_at      TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================
-- 2. PRODUCTS
-- Generic product table
-- Gem-specific information goes into attributes JSONB
-- ============================================================

CREATE TABLE products (
    id              BIGSERIAL PRIMARY KEY,

    business_id     BIGINT NOT NULL
                    REFERENCES businesses(id)
                    ON DELETE CASCADE,

    sku             VARCHAR(100),
    name            VARCHAR(200) NOT NULL,
    category        VARCHAR(100),
    description     TEXT,

    price           NUMERIC(15,2),
    currency        VARCHAR(10) DEFAULT 'USD',

    attributes      JSONB NOT NULL DEFAULT '{}'::jsonb,

    stock_status    VARCHAR(30) NOT NULL DEFAULT 'available',
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,

    created_at      TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT unique_business_sku
        UNIQUE (business_id, sku)
);


-- ============================================================
-- 3. CUSTOMERS
-- ============================================================

CREATE TABLE customers (
    id                  BIGSERIAL PRIMARY KEY,

    business_id         BIGINT NOT NULL
                        REFERENCES businesses(id)
                        ON DELETE CASCADE,

    name                VARCHAR(150),
    phone               VARCHAR(50),
    whatsapp_number     VARCHAR(50),
    email               VARCHAR(150),

    country             VARCHAR(100),
    preferred_language  VARCHAR(30) DEFAULT 'en',

    budget_min          NUMERIC(15,2),
    budget_max          NUMERIC(15,2),
    currency            VARCHAR(10) DEFAULT 'USD',

    interests           JSONB NOT NULL DEFAULT '{}'::jsonb,

    lead_status         VARCHAR(30) NOT NULL DEFAULT 'new',

    notes               TEXT,

    created_at          TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================
-- 4. CONVERSATIONS
-- One customer can have multiple conversations
-- ============================================================

CREATE TABLE conversations (
    id                  BIGSERIAL PRIMARY KEY,

    business_id         BIGINT NOT NULL
                        REFERENCES businesses(id)
                        ON DELETE CASCADE,

    customer_id         BIGINT NOT NULL
                        REFERENCES customers(id)
                        ON DELETE CASCADE,

    channel             VARCHAR(30) NOT NULL DEFAULT 'whatsapp',

    external_id         VARCHAR(150),

    status              VARCHAR(30) NOT NULL DEFAULT 'active',

    ai_enabled          BOOLEAN NOT NULL DEFAULT TRUE,

    assigned_to         VARCHAR(150),

    lead_score          INTEGER DEFAULT 0,

    summary             TEXT,

    started_at          TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_message_at     TIMESTAMPTZ,
    closed_at           TIMESTAMPTZ
);


-- ============================================================
-- 5. MESSAGES
-- ============================================================

CREATE TABLE messages (
    id                  BIGSERIAL PRIMARY KEY,

    conversation_id     BIGINT NOT NULL
                        REFERENCES conversations(id)
                        ON DELETE CASCADE,

    sender_type         VARCHAR(30) NOT NULL,
    message_type        VARCHAR(30) NOT NULL DEFAULT 'text',

    content             TEXT NOT NULL,

    external_message_id VARCHAR(150),

    ai_generated        BOOLEAN NOT NULL DEFAULT FALSE,

    metadata            JSONB NOT NULL DEFAULT '{}'::jsonb,

    created_at          TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================
-- 6. BUSINESS RULES
-- Rules that control what the AI can / cannot do
-- ============================================================

CREATE TABLE business_rules (
    id                  BIGSERIAL PRIMARY KEY,

    business_id         BIGINT NOT NULL
                        REFERENCES businesses(id)
                        ON DELETE CASCADE,

    rule_name           VARCHAR(150) NOT NULL,
    rule_type           VARCHAR(50) NOT NULL,

    rule_value          JSONB NOT NULL DEFAULT '{}'::jsonb,

    is_active           BOOLEAN NOT NULL DEFAULT TRUE,

    created_at          TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_products_business
    ON products(business_id);

CREATE INDEX idx_products_category
    ON products(category);

CREATE INDEX idx_products_status
    ON products(stock_status);

CREATE INDEX idx_products_attributes
    ON products USING GIN(attributes);


CREATE INDEX idx_customers_business
    ON customers(business_id);

CREATE INDEX idx_customers_whatsapp
    ON customers(whatsapp_number);

CREATE INDEX idx_customers_lead_status
    ON customers(lead_status);


CREATE INDEX idx_conversations_business
    ON conversations(business_id);

CREATE INDEX idx_conversations_customer
    ON conversations(customer_id);

CREATE INDEX idx_conversations_status
    ON conversations(status);


CREATE INDEX idx_messages_conversation
    ON messages(conversation_id);

CREATE INDEX idx_messages_created
    ON messages(created_at);


CREATE INDEX idx_business_rules_business
    ON business_rules(business_id);

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  business_id INTEGER REFERENCES businesses(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'AGENT', -- OWNER, ADMIN, AGENT
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_business_id ON users(business_id);
CREATE INDEX idx_users_email ON users(email);