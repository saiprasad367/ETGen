-- ArthDrishti Audit Log Schema
-- PostgreSQL

CREATE TABLE IF NOT EXISTS signals (
    id SERIAL PRIMARY KEY,
    symbol VARCHAR(50) NOT NULL,
    event_type VARCHAR(50),
    pattern_name VARCHAR(100),
    confidence FLOAT,
    bias_rating VARCHAR(20),
    risk_score INT,
    alert_en TEXT,
    alert_hi TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    signal_id INT REFERENCES signals(id),
    agent_name VARCHAR(50),
    input_data TEXT,
    output_data TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_profiles (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100),
    risk_tolerance VARCHAR(20) DEFAULT 'MODERATE', -- CONSERVATIVE, MODERATE, AGGRESSIVE
    email VARCHAR(255)
);
