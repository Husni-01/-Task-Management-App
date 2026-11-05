import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// GET /api/messages
router.get('/', async (req, res) => {
  try {
    if (db.isMySQL()) {
      const rows = await db.query('SELECT * FROM messages ORDER BY id ASC');
      return res.json({ success: true, data: rows });
    }

    res.json({ success: true, data: db.store.messages });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/messages
router.post('/', async (req, res) => {
  try {
    const { sender_name = 'Angeline', message_text } = req.body;
    if (!message_text || message_text.trim() === '') {
      return res.status(400).json({ success: false, message: 'Message text is required' });
    }

    const newMessage = {
      sender_id: 5,
      sender_name,
      sender_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      message_text: message_text.trim(),
      timestamp: 'Just now',
      is_read: true
    };

    if (db.isMySQL()) {
      const result = await db.query(
        'INSERT INTO messages (sender_id, sender_name, sender_avatar, message_text, timestamp, is_read) VALUES (?, ?, ?, ?, ?, ?)',
        [newMessage.sender_id, newMessage.sender_name, newMessage.sender_avatar, newMessage.message_text, newMessage.timestamp, 1]
      );
      return res.status(201).json({ success: true, data: { id: result.insertId, ...newMessage } });
    }

    const id = db.store.messages.length > 0 ? Math.max(...db.store.messages.map(m => m.id)) + 1 : 1;
    const msgRecord = { id, ...newMessage };
    db.store.messages.push(msgRecord);

    res.status(201).json({ success: true, data: msgRecord });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

