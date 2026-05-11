CREATE DATABASE IF NOT EXISTS limn_core;

USE limn_core;


CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    email VARCHAR(150) UNIQUE,
    password VARCHAR(255),
    role VARCHAR(50) DEFAULT 'viewer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE api_keys (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    api_key VARCHAR(255) UNIQUE,
    role VARCHAR(50) DEFAULT 'viewer',
    is_active BOOLEAN DEFAULT TRUE,
    hit_limit INT DEFAULT 1000,
    used_hits INT DEFAULT 0,
    never_expire BOOLEAN DEFAULT FALSE,
    expires_at DATETIME NULL,
    last_used_at DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE audit_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_type VARCHAR(50),
    user_identifier VARCHAR(255),
    action_type VARCHAR(50),
    database_name VARCHAR(100),
    table_name VARCHAR(100),
    row_id VARCHAR(100),
    action_data LONGTEXT,
    ip_address VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


INSERT INTO users (
    name,
    email,
    password,
    role
)
VALUES (
    'Admin User',
    'admin@limn.com',
    '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'admin'
);


INSERT INTO api_keys (
    name,
    api_key,
    role,
    is_active,
    hit_limit,
    used_hits,
    never_expire
)
VALUES (
    'Default Admin Key',
    'limn_sk_default_admin_key',
    'admin',
    TRUE,
    0,
    0,
    TRUE
);