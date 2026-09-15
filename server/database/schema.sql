-- ==========================================================
-- AGRICONNECT DATABASE SCHEMA (PostgreSQL / MySQL Compatible)
-- Smart India Hackathon (SIH) 2026 - Comprehensive Architecture
-- ==========================================================

-- 1. USERS TABLE (Farmers, Consumers, Taluka Hub Managers, Admins)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(120) NOT NULL,
    phone VARCHAR(15) UNIQUE NOT NULL,
    email VARCHAR(120) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('farmer', 'consumer', 'hub_manager', 'admin')),
    taluka VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    state VARCHAR(100) DEFAULT 'Maharashtra',
    preferred_language VARCHAR(10) DEFAULT 'en' CHECK (preferred_language IN ('en', 'hi', 'mr', 'gu')),
    
    -- Feature 6: Aadhaar KYC & Trust
    kyc_status VARCHAR(20) DEFAULT 'unverified' CHECK (kyc_status IN ('unverified', 'pending', 'verified', 'rejected')),
    aadhaar_masked VARCHAR(20),
    trust_score INT DEFAULT 50 CHECK (trust_score BETWEEN 0 AND 100),
    
    -- Feature 5: Subscription Status
    subscription_plan VARCHAR(30) DEFAULT 'free' CHECK (subscription_plan IN ('free', 'farmer_pro', 'consumer_pass')),
    subscription_valid_until TIMESTAMP,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_taluka ON users(taluka);
CREATE INDEX idx_users_role ON users(role);

-- 2. TALUKA DISTRIBUTION HUBS (Feature 3: Taluka Based Distribution)
CREATE TABLE IF NOT EXISTS distribution_hubs (
    id SERIAL PRIMARY KEY,
    hub_code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    taluka VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    state VARCHAR(100) DEFAULT 'Maharashtra',
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    capacity_kg INT DEFAULT 50000,
    current_load_kg INT DEFAULT 0,
    farmers_connected INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Maintenance', 'Inactive')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_hubs_taluka ON distribution_hubs(taluka);

-- 3. PRODUCTS (Produce listings by Farmers, Images viewable by consumers - Feature 7, 10)
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    farmer_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    hub_id INT REFERENCES distribution_hubs(id) ON DELETE SET NULL,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL, -- e.g. Vegetables, Fruits, Grains
    variety VARCHAR(100),
    price_per_unit DECIMAL(10, 2) NOT NULL,
    unit VARCHAR(20) NOT NULL, -- e.g. kg, dozen, quintal
    available_quantity DECIMAL(10, 2) NOT NULL,
    images JSONB, -- Array of image URLs viewable by consumer
    
    -- Feature 4: AI Price & Quality
    ai_crop_detected VARCHAR(100),
    ai_quality_grade VARCHAR(10) CHECK (ai_quality_grade IN ('Grade A', 'Grade B', 'Grade C')),
    ai_suggested_price_min DECIMAL(10, 2),
    ai_suggested_price_max DECIMAL(10, 2),
    is_verified BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_farmer ON products(farmer_id);

-- 4. FARM TRANSPARENCY & TRACEABILITY (Feature 7: Consumer Transparency)
CREATE TABLE IF NOT EXISTS transparency_records (
    id SERIAL PRIMARY KEY,
    product_id INT NOT NULL UNIQUE REFERENCES products(id) ON DELETE CASCADE,
    farmer_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    harvest_date DATE NOT NULL,
    soil_type VARCHAR(100),
    water_source VARCHAR(100),
    is_organic_certified BOOLEAN DEFAULT FALSE,
    fertilizer_used TEXT,
    pesticide_log TEXT,
    cold_chain_temp_celsius DECIMAL(4, 1),
    farm_gps_lat DECIMAL(10, 8),
    farm_gps_lng DECIMAL(11, 8),
    farm_photos JSONB,
    transparency_qr_code TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. ORDERS (Feature 2: UPI & Escrow, Feature 5: Founder 5% Commission, Feature 3: Pooled Logistics)
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(30) UNIQUE NOT NULL,
    buyer_id INT NOT NULL REFERENCES users(id),
    seller_id INT NOT NULL REFERENCES users(id),
    hub_id INT REFERENCES distribution_hubs(id),
    
    total_amount DECIMAL(10, 2) NOT NULL,
    delivery_fee DECIMAL(10, 2) DEFAULT 0.00,
    
    -- Feature 5: 5% Founder Commission
    founder_commission_rate DECIMAL(4, 2) DEFAULT 5.00, -- 5.00%
    founder_commission_amount DECIMAL(10, 2) NOT NULL,
    net_farmer_amount DECIMAL(10, 2) NOT NULL,
    
    -- Feature 2: Escrow protection
    escrow_status VARCHAR(30) DEFAULT 'pending_payment' 
        CHECK (escrow_status IN ('pending_payment', 'held_in_escrow', 'released_to_farmer', 'refunded')),
    order_status VARCHAR(30) DEFAULT 'placed'
        CHECK (order_status IN ('placed', 'pooled_in_taluka', 'transit_to_hub', 'ready_at_hub', 'delivered', 'cancelled')),
    
    -- Feature 3: Pooled Taluka Logistics
    pooled_batch_code VARCHAR(50),
    delivery_address TEXT NOT NULL,
    taluka VARCHAR(100) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_orders_buyer ON orders(buyer_id);
CREATE INDEX idx_orders_seller ON orders(seller_id);
CREATE INDEX idx_orders_hub ON orders(hub_id);

-- 6. ORDER ITEMS
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id INT NOT NULL REFERENCES products(id),
    quantity DECIMAL(10, 2) NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL
);

-- 7. PAYMENTS & UPI ESCROW (Feature 2: UPI Payment)
CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
    transaction_ref VARCHAR(100) UNIQUE,
    upi_id VARCHAR(100) NOT NULL,
    upi_intent_url TEXT NOT NULL,
    upi_qr_code_base64 TEXT,
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(30) DEFAULT 'initiated' CHECK (status IN ('initiated', 'success', 'failed', 'refunded')),
    escrow_held_at TIMESTAMP,
    released_to_farmer_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. SUBSCRIPTIONS (Feature 5: Monetization Plans)
CREATE TABLE IF NOT EXISTS subscriptions (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_id VARCHAR(30) NOT NULL CHECK (plan_id IN ('farmer_pro', 'consumer_pass')),
    plan_name VARCHAR(100) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expiry_date TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    payment_ref VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. FOUNDER COMMISSION LEDGER (Feature 5: Founder Revenue Tracking)
CREATE TABLE IF NOT EXISTS founder_commissions (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    buyer_id INT NOT NULL REFERENCES users(id),
    seller_id INT NOT NULL REFERENCES users(id),
    order_amount DECIMAL(10, 2) NOT NULL,
    commission_rate_percent DECIMAL(4, 2) DEFAULT 5.00,
    commission_amount DECIMAL(10, 2) NOT NULL,
    payout_status VARCHAR(20) DEFAULT 'accrued' CHECK (payout_status IN ('accrued', 'transferred_to_founders')),
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. KYC & AADHAAR VERIFICATION (Feature 6: ID Card Verified)
CREATE TABLE IF NOT EXISTS kyc_verifications (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    id_type VARCHAR(30) DEFAULT 'aadhaar',
    aadhaar_masked VARCHAR(20) NOT NULL,
    document_url TEXT,
    verhoeff_checksum_passed BOOLEAN DEFAULT TRUE,
    verification_status VARCHAR(20) DEFAULT 'verified' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
    trust_score_awarded INT DEFAULT 30,
    verified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    rejection_reason TEXT
);
