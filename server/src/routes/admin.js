import express from 'express';
import { z } from 'zod';
import pool from '../db.js';
import { auditLog } from '../utils.js';

const router = express.Router();

router.get('/dashboard', async (req, res, next) => {
  try {
    const [studentRows] = await pool.query('SELECT * FROM students WHERE user_id = ?', [req.user.id]);
    const student = studentRows[0];

    if (!student) {
      return res.status(404).json({ error: 'Student record not found.' });
    }

    const [billingRows] = await pool.query(
      `SELECT b.*, COALESCE(SUM(CASE WHEN p.status = 'PAID' THEN p.amount ELSE 0 END), 0) AS paid
       FROM billing b
       LEFT JOIN payments p ON p.billing_id = b.id
       WHERE b.student_id = ?
       GROUP BY b.id
       ORDER BY b.id DESC
       LIMIT 1`,
      [student.id]
    );

    const [gradeRows] = await pool.query(
      `SELECT g.id, s.code, s.title, g.grade, g.remarks, t.name AS term
       FROM grades g
       JOIN subjects s ON s.id = g.subject_id
       JOIN terms t ON t.id = g.term_id
       WHERE g.student_id = ?
       ORDER BY g.id DESC
       LIMIT 8`,
      [student.id]
    );

    const [scheduleRows] = await pool.query(
      `SELECT s.code, s.title, s.units, sc.day_of_week, sc.start_time, sc.end_time, sc.room
       FROM enrollment_subjects es
       JOIN enrollments e ON e.id = es.enrollment_id
       JOIN schedules sc ON sc.id = es.schedule_id
       JOIN subjects s ON s.id = sc.subject_id
       WHERE e.student_id = ? AND e.status IN ('APPROVED', 'ENROLLED')
       ORDER BY sc.day_of_week, sc.start_time`,
      [student.id]
    );

    const [docsRows] = await pool.query(
      'SELECT request_no, document_type, status, requested_at FROM document_requests WHERE student_id = ? ORDER BY requested_at DESC LIMIT 5',
      [student.id]
    );

    const [announcementRows] = await pool.query(
      'SELECT id, title, description, category, published_at FROM announcements ORDER BY published_at DESC LIMIT 5'
    );

    const [clearanceRows] = await pool.query(
      'SELECT department, status, checked_at, remarks FROM clearance WHERE student_id = ? ORDER BY checked_at DESC LIMIT 10',
      [student.id]
    );

    res.json({
      student,
      billing: billingRows[0] || null,
      grades: gradeRows,
      schedule: scheduleRows,
      documents: docsRows,
      announcements: announcementRows,
      clearance: clearanceRows
    });
  } catch (error) {
    next(error);
  }
});

router.get('/profile', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT s.*, u.email
       FROM students s
       JOIN users u ON u.id = s.user_id
       WHERE s.user_id = ?`,
      [req.user.id]
    );
    res.json(rows[0] || null);
  } catch (error) {
    next(error);
  }
});

router.patch('/profile', async (req, res, next) => {
  try {
    const schema = z.object({
      phone: z.string().max(40).optional(),
      address: z.string().max(1000).optional(),
      photo_url: z.string().url().max(500).optional()
    });

    const payload = schema.parse(req.body);
    const [studentRows] = await pool.query('SELECT id FROM students WHERE user_id = ?', [req.user.id]);
    const student = studentRows[0];

    if (!student) {
      return res.status(404).json({ error: 'Student profile not found.' });
    }

    await pool.query(
      `UPDATE students
       SET phone = COALESCE(?, phone),
           address = COALESCE(?, address),
           photo_url = COALESCE(?, photo_url)
       WHERE id = ?`,
      [payload.phone ?? null, payload.address ?? null, payload.photo_url ?? null, student.id]
    );

    await auditLog(req.user, 'UPDATE_PROFILE', 'students', student.id, req);
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

router.get('/enrollment-options', async (_req, res, next) => {
  try {
    const [terms] = await pool.query('SELECT * FROM terms ORDER BY start_date DESC');
    const [subjects] = await pool.query(
      `SELECT sc.id AS schedule_id, s.code, s.title, s.units,
              sc.day_of_week, sc.start_time, sc.end_time, sc.room
       FROM schedules sc
       JOIN subjects s ON s.id = sc.subject_id`
    );
    res.json({ terms, subjects });
  } catch (error) {
    next(error);
  }
});

router.post('/enrollment', async (req, res, next) => {
  try {
    const schema = z.object({
      term_id: z.coerce.number(),
      schedule_ids: z.array(z.coerce.number()).min(1)
    });

    const payload = schema.parse(req.body);
    const [studentRows] = await pool.query('SELECT id FROM students WHERE user_id = ?', [req.user.id]);
    const student = studentRows[0];

    if (!student) {
      return res.status(404).json({ error: 'Student profile not found.' });
    }

    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const [existing] = await connection.query(
        'SELECT id FROM enrollments WHERE student_id = ? AND term_id = ? AND status IN ("PENDING", "APPROVED", "ENROLLED")',
        [student.id, payload.term_id]
      );

      if (existing[0]) {
        throw Object.assign(new Error('An active enrollment already exists for this term.'), { status: 409 });
      }

      const [result] = await connection.query(
        'INSERT INTO enrollments (student_id, term_id, status, submitted_at) VALUES (?, ?, "PENDING", NOW())',
        [student.id, payload.term_id]
      );

      for (const scheduleId of payload.schedule_ids) {
        await connection.query(
          'INSERT INTO enrollment_subjects (enrollment_id, schedule_id) VALUES (?, ?)',
          [result.insertId, scheduleId]
        );
      }

      await connection.commit();
      await auditLog(req.user, 'ENROLLMENT_SUBMITTED', 'enrollments', result.insertId, req);
      res.status(201).json({ id: result.insertId, status: 'PENDING' });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    next(error);
  }
});

router.get('/enrollment', async (req, res, next) => {
  try {
    const [studentRows] = await pool.query('SELECT id FROM students WHERE user_id = ?', [req.user.id]);
    const student = studentRows[0];
    const [rows] = await pool.query(
      `SELECT e.id, e.status, e.submitted_at, t.name AS term,
              GROUP_CONCAT(CONCAT(s.code, ' - ', s.title) ORDER BY s.code SEPARATOR ', ') AS subjects
       FROM enrollments e
       JOIN terms t ON t.id = e.term_id
       LEFT JOIN enrollment_subjects es ON es.enrollment_id = e.id
       LEFT JOIN schedules sc ON sc.id = es.schedule_id
       LEFT JOIN subjects s ON s.id = sc.subject_id
       WHERE e.student_id = ?
       GROUP BY e.id, e.status, e.submitted_at, t.name
       ORDER BY e.submitted_at DESC`,
      [student.id]
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

router.get('/records', async (req, res, next) => {
  try {
    const [studentRows] = await pool.query('SELECT id FROM students WHERE user_id = ?', [req.user.id]);
    const student = studentRows[0];
    const [rows] = await pool.query(
      `SELECT g.id, s.code, s.title, s.units, g.grade, g.remarks, t.name AS term
       FROM grades g
       JOIN subjects s ON s.id = g.subject_id
       JOIN terms t ON t.id = g.term_id
       WHERE g.student_id = ?
       ORDER BY t.start_date DESC, s.code`,
      [student.id]
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

router.get('/financials', async (req, res, next) => {
  try {
    const [studentRows] = await pool.query('SELECT id FROM students WHERE user_id = ?', [req.user.id]);
    const student = studentRows[0];
    const [rows] = await pool.query(
      `SELECT b.*, COALESCE(SUM(CASE WHEN p.status = 'PAID' THEN p.amount ELSE 0 END), 0) AS paid,
              COALESCE(SUM(CASE WHEN p.status = 'PENDING' THEN p.amount ELSE 0 END), 0) AS pending
       FROM billing b
       LEFT JOIN payments p ON p.billing_id = b.id
       WHERE b.student_id = ?
       GROUP BY b.id
       ORDER BY b.id DESC`,
      [student.id]
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

router.get('/documents', async (req, res, next) => {
  try {
    const [studentRows] = await pool.query('SELECT id FROM students WHERE user_id = ?', [req.user.id]);
    const student = studentRows[0];
    const [rows] = await pool.query(
      'SELECT * FROM document_requests WHERE student_id = ? ORDER BY requested_at DESC',
      [student.id]
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

router.post('/documents', async (req, res, next) => {
  try {
    const schema = z.object({ document_type: z.string().min(3).max(120) });
    const payload = schema.parse(req.body);

    const [studentRows] = await pool.query('SELECT id FROM students WHERE user_id = ?', [req.user.id]);
    const student = studentRows[0];
    const requestNo = `DOC-${Date.now()}-${Math.floor(Math.random() * 900 + 100)}`;

    const [result] = await pool.query(
      'INSERT INTO document_requests (student_id, request_no, document_type, status) VALUES (?, ?, ?, "PENDING")',
      [student.id, requestNo, payload.document_type]
    );

    await auditLog(req.user, 'REQUEST_DOCUMENT', 'document_requests', result.insertId, req);
    res.status(201).json({ id: result.insertId, request_no: requestNo, status: 'PENDING' });
  } catch (error) {
    next(error);
  }
});

router.get('/clearance', async (req, res, next) => {
  try {
    const [studentRows] = await pool.query('SELECT id FROM students WHERE user_id = ?', [req.user.id]);
    const student = studentRows[0];
    const [rows] = await pool.query(
      'SELECT department, status, checked_at, remarks FROM clearance WHERE student_id = ? ORDER BY department',
      [student.id]
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

router.get('/id-card', async (req, res, next) => {
  try {
    const [studentRows] = await pool.query('SELECT * FROM students WHERE user_id = ?', [req.user.id]);
    const student = studentRows[0];
    const [rows] = await pool.query(
      'SELECT * FROM digital_ids WHERE student_id = ? ORDER BY issued_at DESC LIMIT 1',
      [student.id]
    );
    res.json({ student, digital_id: rows[0] || null });
  } catch (error) {
    next(error);
  }
});

router.get('/announcements', async (_req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, title, description, category, published_at FROM announcements ORDER BY published_at DESC'
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

export default router;
