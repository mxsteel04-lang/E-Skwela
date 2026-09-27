import 'dotenv/config';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import fs from 'node:fs/promises';
const config={host:process.env.DB_HOST,port:Number(process.env.DB_PORT||3306),user:process.env.DB_USER,password:process.env.DB_PASSWORD,database:process.env.DB_NAME,multipleStatements:true};
const db=await mysql.createConnection(config); await db.query(await fs.readFile(new URL('../../database/schema.sql',import.meta.url),'utf8'));
const email=process.env.SEED_ADMIN_EMAIL||'admin@arellano.edu.ph'; const password=process.env.SEED_ADMIN_PASSWORD||'ChangeThisImmediately!123'; const hash=await bcrypt.hash(password,12);
await db.query('INSERT INTO users(email,password_hash,role) VALUES(?,?,?) ON DUPLICATE KEY UPDATE password_hash=VALUES(password_hash),role="SUPER_ADMIN",status="ACTIVE"',[email,hash,'SUPER_ADMIN']); console.log(`Admin ready: ${email}`); await db.end();
