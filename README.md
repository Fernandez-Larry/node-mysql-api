# Node MySQL API - Backend

A Node.js + MySQL REST API with JWT authentication, refresh tokens, and email verification.

## Live API
🔗 https://node-mysql-api-production-fbdd.up.railway.app

## API Documentation
📄 https://node-mysql-api-production-fbdd.up.railway.app/api-docs

## Setup Instructions

### Prerequisites
- Node.js
- MySQL

### Installation
1. Clone the repository
   git clone https://github.com/Fernandez-Larry/node-mysql-api.git
2. Install dependencies
   npm install
3. Create config.json in root directory with your database and email settings
4. Run in development
   npm run start:dev

## Environment Variables
All sensitive data is handled via environment variables on Railway:
- DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME
- JWT_SECRET
- SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
- CORS_ORIGIN
