# E-Skwela

Production-oriented Student Information System for Arellano University.

## Stack
- React + Vite frontend
- Node.js + Express API
- MySQL 8 relational database
- Password hashing with bcrypt
- Database-backed sessions, RBAC, CSRF protection, validation, audit logging

## Quick start

1. Copy `.env.example` to `.env` and set secure values.
2. Start MySQL: `docker compose up -d mysql`
3. Install dependencies: `npm install && npm --prefix server install && npm --prefix client install`
4. Apply schema and seed the first administrator: `npm run db:setup`
5. Start API and frontend: `npm run dev`
6. Open http://localhost:5173

The seeded development administrator is configured through `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD`; change both before using outside local development.

## Production notes

Set `NODE_ENV=production`, use a strong `SESSION_SECRET`, serve over HTTPS, place the API behind a reverse proxy, restrict CORS, rotate credentials, and configure backups and monitoring. The API uses parameterized queries and denies access by role and ownership.
