# E-Skwela

E-Skwela is a production-oriented Student Information System for Arellano University, built with a Node.js + Express backend, MySQL database, and a React frontend.

## Features
- Student login, faculty login, and admin login
- Role-based access control for Student, Faculty, Admin, and Super Admin
- Student dashboard with digital ID, quick actions, billing, announcements, and schedule
- Profile management with admin-restricted academic fields
- Enrollment workflow with subject selection and status tracking
- Academic records with grades and GPA/GWA
- Billing and payment tracking module
- Document request workflow and status tracking
- Clearance tracking by department
- Digital ID and QR-based ID services
- Announcement and notification management
- Admin dashboard for students, enrollments, grades, schedules, subjects, and reports
- Audit logging, input validation, password hashing, CSRF-ready session handling, and prepared SQL

## Stack
- Frontend: React + Vite
- Backend: Express.js
- Database: MySQL 8
- Auth: bcrypt hashing + session cookies
- Validation: Zod

## Repository structure
- `server/` — Express API and MySQL integration
- `client/` — React dashboard UI
- `database/` — migration/schema definitions
- `README.md` — setup instructions

## Prerequisites
- Node.js 18+
- MySQL 8+
- npm
- Optional: Docker Compose for local MySQL container

## Configuration
Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

Example values:

```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=eskewela
DB_USER=eskewela
DB_PASSWORD=change-me
SESSION_SECRET=replace-with-a-long-random-string
CLIENT_ORIGIN=http://localhost:5173
PORT=4000
SEED_ADMIN_EMAIL=admin@arellano.edu.ph
SEED_ADMIN_PASSWORD=ChangeThisImmediately!123
```

## Database setup

### Option 1: Local MySQL server
1. Create the database and user in MySQL.
2. Run the schema:

```bash
mysql -u root -p < database/schema.sql
```

### Option 2: Docker

```bash
docker compose up -d mysql
```

## Install dependencies

```bash
npm install
npm --prefix server install
npm --prefix client install
```

## Create database and seed admin

```bash
npm run db:setup
```

This script executes the schema and creates the super admin account from the environment variables.

## Run the app

### Development mode

```bash
npm run dev
```

This starts:
- API at http://localhost:4000
- Frontend at http://localhost:5173

### Production build

```bash
npm --prefix client run build
npm start
```

## Default admin account
Change the admin credentials before deployment.

- Email: `SEED_ADMIN_EMAIL`
- Password: `SEED_ADMIN_PASSWORD`

## Security notes
- Use HTTPS in production.
- Replace the default session secret.
- Restrict database access and CORS origin.
- Use strong admin credentials and configure backups.
- Keep secrets in your hosting environment or secret manager.

## Deployment guidance
- Serve the frontend via a reverse proxy or static hosting.
- Run the API behind Nginx/Apache or a container runtime.
- Configure MySQL in a managed cloud service or private network.
- Enable backups, monitoring, and log retention.

## Project status
This repository contains the working codebase for the E-Skwela Student Information System, including the database schema, secure API, and responsive student portal UI.
