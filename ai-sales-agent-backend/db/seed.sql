-- ============================================================
-- CLEAN SEED DATA — ADMIN ONLY
-- Cleans out sample data and initializes standard Admin user
-- ============================================================

TRUNCATE TABLE messages, conversations, customers, products, business_rules, users, businesses RESTART IDENTITY CASCADE;

-- Default Business
INSERT INTO businesses
(id, name, business_type, description, email, phone, whatsapp_number, country, currency, ai_enabled, status)
VALUES
(
    1,
    'GemConnect Business',
    'Gem & Jewellery',
    'GemConnect sales management platform business account',
    'admin@gemconnect.lk',
    '+94770000000',
    '+94770000000',
    'Sri Lanka',
    'USD',
    TRUE,
    'active'
);

SELECT setval('businesses_id_seq', (SELECT MAX(id) FROM businesses));

-- Default Admin User (Email: admin@gemconnect.lk | Password: admin123)
INSERT INTO users
(business_id, name, email, password_hash, role, is_active)
VALUES
(
    1,
    'System Admin',
    'admin@gemconnect.lk',
    '$2b$10$kPlmwZqXCOIFwGSdXSOef.ph8m0KZErEFNxfXbmSvF2y1FYLU2lMC',
    'ADMIN',
    TRUE
);

-- Sample Gem & Jewellery Products for Business 1
INSERT INTO products
(business_id, sku, name, category, description, price, currency, attributes, stock_status, is_active)
VALUES
(
    1,
    'GEM-SAP-001',
    'Royal Blue Ceylon Sapphire',
    'Sapphire',
    'Unheated natural Ceylon royal blue sapphire with exceptional clarity and rich color saturation. Ideal for custom luxury ring settings.',
    3500.00,
    'USD',
    '{"weight_carats": 2.45, "color": "Royal Blue", "cut": "Cushion", "clarity": "VVS", "origin": "Ratnapura, Sri Lanka", "treatment": "Unheated", "certification": "GIA Certified"}'::jsonb,
    'available',
    TRUE
),
(
    1,
    'GEM-PAD-002',
    'Natural Padparadscha Sapphire',
    'Sapphire',
    'Rare Sri Lankan Padparadscha sapphire exhibiting a perfect blend of delicate pink and orange tones.',
    5200.00,
    'USD',
    '{"weight_carats": 1.80, "color": "Pinkish-Orange", "cut": "Oval", "clarity": "VVS", "origin": "Balangoda, Sri Lanka", "treatment": "Natural / Unheated", "certification": "GRS Certified"}'::jsonb,
    'available',
    TRUE
),
(
    1,
    'GEM-RUB-003',
    'Pigeon Blood Ruby',
    'Ruby',
    'Vibrant natural pigeon blood red ruby with vivid fluorescence and outstanding luster.',
    4800.00,
    'USD',
    '{"weight_carats": 1.20, "color": "Pigeon Blood Red", "cut": "Oval Brilliant", "clarity": "VS", "origin": "Burma (Myanmar)", "treatment": "Standard Heat", "certification": "SSEF Certified"}'::jsonb,
    'available',
    TRUE
),
(
    1,
    'GEM-EME-004',
    'Colombian Emerald',
    'Emerald',
    'Classic Colombian emerald displaying a deep lush green hue with minor traditional oiling.',
    3200.00,
    'USD',
    '{"weight_carats": 1.55, "color": "Vivid Green", "cut": "Emerald Cut", "clarity": "VS", "origin": "Muzo, Colombia", "treatment": "Minor Clarity Enhancement (Oil)", "certification": "GIA Certified"}'::jsonb,
    'available',
    TRUE
),
(
    1,
    'GEM-ALX-005',
    'Color-Change Alexandrite',
    'Alexandrite',
    'Remarkable color-changing chrysoberyl transitioning from teal green in daylight to intense raspberry red under incandescent light.',
    6500.00,
    'USD',
    '{"weight_carats": 1.10, "color": "Teal Green to Raspberry Red", "cut": "Round Cut", "clarity": "VVS", "origin": "Sri Lanka", "treatment": "Unheated / Untreated", "certification": "GUBELIN Certified"}'::jsonb,
    'available',
    TRUE
),
(
    1,
    'GEM-SPN-006',
    'Cobalt Blue Spinel',
    'Spinel',
    'Ultra-rare electric cobalt blue spinel with vivid color intensity and excellent transparency.',
    2900.00,
    'USD',
    '{"weight_carats": 2.10, "color": "Electric Cobalt Blue", "cut": "Cushion", "clarity": "VVS", "origin": "Mahenge, Tanzania", "treatment": "Untreated", "certification": "ICA GemLab"}'::jsonb,
    'available',
    TRUE
),
(
    1,
    'GEM-TSV-007',
    'Tsavorite Garnet',
    'Garnet',
    'Brilliant forest green Tsavorite Garnet with high refractive index and sparkling optical fire.',
    1850.00,
    'USD',
    '{"weight_carats": 2.05, "color": "Forest Green", "cut": "Oval", "clarity": "VVS", "origin": "Kenya", "treatment": "Untreated", "certification": "GIA Certified"}'::jsonb,
    'available',
    TRUE
),
(
    1,
    'GEM-YSAP-008',
    'Canary Yellow Ceylon Sapphire',
    'Sapphire',
    'Bright golden-yellow Ceylon sapphire with radiant facets reflecting brilliant yellow flashes.',
    2400.00,
    'USD',
    '{"weight_carats": 3.10, "color": "Canary Yellow", "cut": "Radiant Cut", "clarity": "VVS", "origin": "Elahera, Sri Lanka", "treatment": "Unheated", "certification": "GIA Certified"}'::jsonb,
    'available',
    TRUE
),
(
    1,
    'JWL-RNG-009',
    'Diamond & Sapphire Solitaire Ring',
    'Rings',
    'Handcrafted 18K white gold engagement ring featuring a 2.0 ct Royal Blue Ceylon Sapphire surrounded by a pavé diamond halo.',
    4500.00,
    'USD',
    '{"center_gem": "Royal Blue Sapphire", "metal": "18K White Gold", "diamond_weight_carats": 0.45, "ring_size": "US 6.5 (Resizable)", "certification": "In-house Appraisal & GIA Gem Cert"}'::jsonb,
    'available',
    TRUE
),
(
    1,
    'JWL-PND-010',
    'Padparadscha Rose Gold Pendant',
    'Pendants',
    'Elegant 18K Rose Gold pendant featuring a natural Padparadscha gemstone set in a halo of brilliant round white diamonds.',
    3800.00,
    'USD',
    '{"center_gem": "Padparadscha Sapphire", "metal": "18K Rose Gold", "diamond_weight_carats": 0.30, "chain_length": "18 inches", "certification": "GRS Gem Cert"}'::jsonb,
    'available',
    TRUE
);

SELECT setval('products_id_seq', (SELECT MAX(id) FROM products));


