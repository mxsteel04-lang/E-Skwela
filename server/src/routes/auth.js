import fs from 'node:fs/promises';
import path from 'node:path';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const config = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'eskewela',
  password: process.env.DB_PASSWORD || 'change-me',
  database: process.env.DB_NAME || 'eskewela'
};

const main = async () => {
  const connection = await mysql.createConnection(config);
  const schema = await fs.readFile(new URL('../../database/schema.sql', import.meta.url), 'utf8');
  await connection.query(schema);

  const email = process.env.SEED_ADMIN_EMAIL || 'admin@arellano.edu.ph';
  const password = process.env.SEED_ADMIN_PASSWORD || 'ChangeThisImmediately!123';
  const passwordHash = await bcrypt.hash(password, 12);

  await connection.query(
    `INSERT INTO users (email, password_hash, role, status)
     VALUES (?, ?, 'SUPER_ADMIN', 'ACTIVE')
     ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), role = 'SUPER_ADMIN', status = 'ACTIVE'`,
    [email, passwordHash]
  );

  console.log(`Admin account ready: ${email}`);
  await connection.end();
};

main().catch((error) => {
  console.error('Setup failed:', error);
  process.exit(1);
});
