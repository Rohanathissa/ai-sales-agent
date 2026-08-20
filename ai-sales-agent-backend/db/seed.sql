-- ============================================================
-- SAMPLE SEED DATA — Ceylon Crown Gems
-- Run this after schema.sql
-- ============================================================

INSERT INTO businesses
(name, business_type, description, email, phone, whatsapp_number, country, currency)
VALUES
(
    'Ceylon Crown Gems',
    'Gem & Jewellery',
    'Premium Ceylon gemstones and jewellery business',
    'sales@ceyloncrowngems.com',
    '+94770000000',
    '+94770000000',
    'Sri Lanka',
    'USD'
);

INSERT INTO products
(business_id, sku, name, category, description, price, currency, attributes, stock_status)
VALUES
(1, 'GS-0001', 'Ceylon Blue Sapphire 4.12ct', 'Blue Sapphire',
 'Natural Ceylon blue sapphire with excellent colour.', 4800.00, 'USD',
 '{"gem_type":"Blue Sapphire","origin":"Ceylon","weight_ct":4.12,"treatment":"Unheated","color":"Blue","shape":"Oval","certificate":"GIA","clarity":"Eye Clean","availability":"Available"}',
 'available'),

(1, 'GS-0002', 'Ceylon Blue Sapphire 3.65ct', 'Blue Sapphire',
 'Natural Ceylon blue sapphire suitable for jewellery.', 3900.00, 'USD',
 '{"gem_type":"Blue Sapphire","origin":"Ceylon","weight_ct":3.65,"treatment":"Unheated","color":"Blue","shape":"Cushion","certificate":"GIA","clarity":"Very Good","availability":"Available"}',
 'available'),

(1, 'GS-0003', 'Ceylon Blue Sapphire 5.20ct', 'Blue Sapphire',
 'Natural Ceylon blue sapphire with strong blue colour.', 4500.00, 'USD',
 '{"gem_type":"Blue Sapphire","origin":"Ceylon","weight_ct":5.20,"treatment":"Heated","color":"Blue","shape":"Oval","certificate":"Available","clarity":"Good","availability":"Available"}',
 'available'),

(1, 'GS-0004', 'Ceylon Yellow Sapphire 3.10ct', 'Yellow Sapphire',
 'Natural Ceylon yellow sapphire.', 2800.00, 'USD',
 '{"gem_type":"Yellow Sapphire","origin":"Ceylon","weight_ct":3.10,"treatment":"Unheated","color":"Yellow","shape":"Oval","certificate":"Available","availability":"Available"}',
 'available'),

(1, 'GS-0005', 'Ceylon Padparadscha Sapphire 2.05ct', 'Padparadscha Sapphire',
 'Natural Ceylon Padparadscha sapphire.', 6500.00, 'USD',
 '{"gem_type":"Padparadscha Sapphire","origin":"Ceylon","weight_ct":2.05,"treatment":"Unheated","color":"Pink Orange","shape":"Oval","certificate":"GIA","availability":"Available"}',
 'available');

INSERT INTO customers
(business_id, name, phone, whatsapp_number, email, country, preferred_language, budget_min, budget_max, currency, interests, lead_status)
VALUES
(1, 'John Smith', '+15550000001', '+15550000001', 'john@example.com', 'USA', 'en',
 3000.00, 5000.00, 'USD',
 '{"gem_type":"Blue Sapphire","origin":"Ceylon","treatment":"Unheated","min_weight_ct":3,"max_weight_ct":5}',
 'warm');

INSERT INTO conversations
(business_id, customer_id, channel, status, ai_enabled, lead_score, summary, last_message_at)
VALUES
(1, 1, 'whatsapp', 'active', TRUE, 75,
 'Customer is looking for a 3-5ct unheated Ceylon blue sapphire under $5,000.',
 CURRENT_TIMESTAMP);

INSERT INTO messages
(conversation_id, sender_type, message_type, content, ai_generated)
VALUES
(1, 'customer', 'text', 'Do you have a 4ct unheated Ceylon blue sapphire under $5,000?', FALSE),
(1, 'ai', 'text', 'Yes. I found matching Ceylon blue sapphires. The closest match is a 4.12ct unheated stone priced at $4,800. Would you like to see the details?', TRUE),
(1, 'customer', 'text', 'Is it certified?', FALSE),
(1, 'ai', 'text', 'Yes. The 4.12ct stone has a GIA certificate recorded in our product information.', TRUE);

INSERT INTO business_rules
(business_id, rule_name, rule_type, rule_value)
VALUES
(1, 'Maximum Discount', 'discount_limit', '{"max_percentage": 5}'),
(1, 'Human Handover', 'handover', '{"enabled": true, "conditions": ["customer_requests_special_discount","customer_has_complaint","high_value_transaction","ai_uncertain"]}'),
(1, 'Certificate Policy', 'product_information', '{"rule": "Never claim a certificate exists unless it is recorded in product data."}');
