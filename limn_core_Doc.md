# LIMN CORE

Professional Dynamic Realtime Database Engine

Repository:
https://github.com/saikat19941/limn-core

---

# Overview

LIMN CORE is a professional dynamic database engine built using:

- Node.js
- Express.js
- MariaDB
- Socket.io
- JWT Authentication
- API Key Authentication
- Role Based Access Control
- Realtime Database Events
- Audit Logging
- Dynamic CRUD API
- Advanced Filtering
- Pagination
- Sorting

---

# Features

## Dynamic Database Access

Access any database dynamically.

Example:

```http
GET /api/databases
```

---

## Dynamic Table Access

Fetch all tables from any database.

Example:

```http
GET /api/databases/classicmodels/tables
```

---

## Dynamic CRUD System

Supports:

- INSERT
- UPDATE
- DELETE
- READ

---

## Advanced Filtering

Supported operators:

| Operator | Meaning |
|---|---|
| _gt | Greater Than |
| _lt | Less Than |
| _gte | Greater Than Equal |
| _lte | Less Than Equal |
| _ne | Not Equal |
| _like | Search |

Example:

```http
GET /api/databases/classicmodels/customers?creditLimit_gt=50000
```

---

## Pagination

Example:

```http
GET /api/databases/classicmodels/customers?page=1&limit=10
```

---

## Sorting

Example:

```http
GET /api/databases/classicmodels/customers?sortBy=customerName&order=ASC
```

---

## Realtime Socket Events

Events:

- row_inserted
- row_updated
- row_deleted

---

## JWT Authentication

Secure login system using JWT.

---

## API Key Authentication

Supports:

- unlimited keys
- expiring keys
- hit limits
- active/inactive keys

---

## Role Based Access

| Role | Access |
|---|---|
| viewer | read only |
| editor | insert + update |
| admin | full access |

---

## Audit Logging

Automatically stores:

- INSERT logs
- UPDATE logs
- DELETE logs
- user info
- IP address
- timestamps

---

# Default SQL Setup

Save the following as:

```txt
limn_core_setup.sql
```

Then import it into MariaDB.

---

```sql
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
```

---

# Default Login

## Admin Login

```txt
Email:
admin@limn.com
```

```txt
Password:
password
```

IMPORTANT:

Change the default password after first login.

---

# Environment File

Create:

```txt
.env
```

---

Example:

```env
PORT=5000

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=

JWT_SECRET=your_secret_key
```

---

# Installation

## Clone Repository

```bash
git clone https://github.com/saikat19941/limn-core.git
```

---

## Install Packages

```bash
npm install
```

---

## Start Server

```bash
npm start
```

---

# Authentication Examples

## JWT Login

```http
POST /api/auth/login
```

Body:

```json
{
  "email": "admin@limn.com",
  "password": "password"
}
```

---

## JWT Protected Request

Headers:

```txt
Authorization: Bearer YOUR_TOKEN
```

---

## API KEY Request

Headers:

```txt
x-api-key: limn_sk_default_admin_key
```

---

# CRUD Examples

## Fetch Databases

```http
GET /api/databases
```

---

## Fetch Tables

```http
GET /api/databases/classicmodels/tables
```

---

## Fetch Rows

```http
GET /api/databases/classicmodels/customers
```

---

## Insert Row

```http
POST /api/databases/classicmodels/test
```

Body:

```json
{
  "name": "Saikat"
}
```

---

## Update Row

```http
PUT /api/databases/classicmodels/test/1
```

Body:

```json
{
  "name": "Updated Name"
}
```

---

## Delete Row

```http
DELETE /api/databases/classicmodels/test/1
```

---

# Socket.io Realtime Examples

## Join Table Room

```javascript
socket.emit(
    "join_table",
    "classicmodels.test"
);
```

---

## Listen Insert Event

```javascript
socket.on("row_inserted", (data) => {
    console.log(data);
});
```

---

## Listen Update Event

```javascript
socket.on("row_updated", (data) => {
    console.log(data);
});
```

---

## Listen Delete Event

```javascript
socket.on("row_deleted", (data) => {
    console.log(data);
});
```

---

# Security Features

- Helmet
- JWT Verification
- API Key Verification
- Role Middleware
- Dynamic Column Validation
- SQL Injection Protection
- Request Validation
- Secure Socket Rooms
- Audit Logging

---

# Recommended Production Stack

| Purpose | Technology |
|---|---|
| Reverse Proxy | Nginx |
| Process Manager | PM2 |
| SSL | Let's Encrypt |
| Database | MariaDB |
| Cache | Redis |
| Queue | BullMQ |

---

# Future Planned Features

- Dynamic Admin Panel
- Webhook System
- Redis Cache
- Queue Jobs
- Docker Support
- Swagger API Docs
- Backup System
- Restore System
- Multi Tenant Support
- File Upload System

---

# Author

LIMN CREATION

Founder:

- Saikat Kumar Adak
- Sripita Adak Das

---

# License

MIT License

