import express from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import { z } from 'zod';
import pool from '../db.js';
import { hashToken, auditLog } from '../utils.js';

const router = express.Router();

router.post('/login', async (req, res, next) => {
  try {
    const schema = z.object({
      email: z.string().email(),
      password: z.string().min(8)
    });

    const payload = schema.parse(req.body);
    const email = payload.email.toLowerCase();

    const [rows] = await pool.query(
      'SELECT id, email, password_hash, role, status FROM users WHERE email = ?',
      [email]
    );

    const user = rows[0];
    if (!user || user.status !== 'ACTIVE') {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const passwordValid = await bcrypt.compare(payload.password, user.password_hash);
    if (!passwordValid) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = hashToken(token);
    const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000);

    await pool.query(
      'INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE token_hash = VALUES(token_hash), expires_at = VALUES(expires_at)',
      [tokenHash, user.id, expiresAt]
    );

    res.cookie('esk_session', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 8 * 60 * 60 * 1000
    });

    await auditLog(user, 'LOGIN', 'users', user.id, req);
    res.json({ user: { id: user.id, email: user.email, role: user.role } });
  } catch (error) {
    next(error);
  }
});

router.post('/logout', async (req, res) => {
  const token = req.cookies?.esk_session;
  if (token) {
    const tokenHash = hashToken(token);
    await pool.query('DELETE FROM sessions WHERE token_hash = ?', [tokenHash]);
  }
  res.clearCookie('esk_session');
  res.json({ ok: true });
});

router.get('/me', async (req, res, next) => {
  try {
    const token = req.cookies?.esk_session;
    if (!token) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    const [rows] = await pool.query(
      `SELECT u.id, u.email, u.role, u.status
       FROM sessions s
       JOIN users u ON u.id = s.user_id
       WHERE s.token_hash = ? AND s.expires_at > NOW()`,
      [hashToken(token)]
    );

    if (!rows[0]) return res.status(401).json({ error: 'Session invalid.' });
    res.json({ user: rows[0] });
  } catch (error) {
    next(error);
  }
});

export default router;
