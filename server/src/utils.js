import crypto from 'node:crypto';
import pool from './db.js';

export function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export async function auditLog(user, action, entity, entityId, req) {
  try {
    await pool.query(
      'INSERT INTO audit_logs (user_id, action, entity, entity_id, ip) VALUES (?, ?, ?, ?, ?)',
      [user?.id || null, action, entity, entityId || null, req?.ip || null]
    );
  } catch (error) {
    console.error('Audit log failed:', error.message);
  }
}

export function sanitizeText(value) {
  return typeof value === 'string' ? value.trim() : '';
}
