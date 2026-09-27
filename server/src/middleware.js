import crypto from 'node:crypto';
import pool from './db.js';

export const authRequired = async (req, res, next) => {
  try {
    const token = req.cookies?.esk_session;
    if (!token) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const [rows] = await pool.query(
      `SELECT u.id, u.email, u.role, u.status
       FROM sessions s
       JOIN users u ON u.id = s.user_id
       WHERE s.token_hash = ? AND s.expires_at > NOW()`,
      [tokenHash]
    );

    if (!rows[0] || rows[0].status !== 'ACTIVE') {
      return res.status(401).json({ error: 'Session expired or invalid.' });
    }

    req.user = rows[0];
    next();
  } catch (error) {
    next(error);
  }
};

export const authorize = (...allowedRoles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: 'Authentication required.' });
  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Access denied.' });
  }
  next();
};
