import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// GET /api/schedule
router.get('/', async (req, res) => {
  try {
    if (db.isMySQL()) {
      const rows = await db.query('SELECT * FROM schedules WHERE is_active = 1 LIMIT 5');
      const schedules = rows.map(s => ({
        ...s,
        attendees: s.attendees ? JSON.parse(s.attendees) : []
      }));
      return res.json({ success: true, data: schedules });
    }

    res.json({ success: true, data: db.store.schedules });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

