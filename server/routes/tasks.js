import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// GET /api/tasks
router.get('/', async (req, res) => {
  try {
    const { status, timeframe, search } = req.query;

    if (db.isMySQL()) {
      let query = `
        SELECT t.*, 
          GROUP_CONCAT(CONCAT(u.id, '::', u.name, '::', u.avatar) SEPARATOR ';;;') as collaborators_raw
        FROM tasks t
        LEFT JOIN collaborators c ON t.id = c.task_id
        LEFT JOIN users u ON c.user_id = u.id
      `;
      const conditions = [];
      const params = [];

      if (status && status !== 'All') {
        conditions.push('t.status = ?');
        params.push(status);
      }
      if (search) {
        conditions.push('(t.title LIKE ? OR t.description LIKE ?)');
        params.push(`%${search}%`, `%${search}%`);
      }

      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }
      query += ' GROUP BY t.id ORDER BY t.id ASC';

      const rows = await db.query(query, params);
      const tasks = rows.map(row => {
        let collaborators = [];
        if (row.collaborators_raw) {
          collaborators = row.collaborators_raw.split(';;;').map(item => {
            const [id, name, avatar] = item.split('::');
            return { id: parseInt(id), name, avatar };
          });
        }
        return {
          id: row.id,
          title: row.title,
          description: row.description,
          status: row.status,
          progress_percentage: row.progress_percentage,
          start_time: row.start_time,
          due_date: row.due_date,
          type: row.type,
          link_url: row.link_url,
          comments_count: row.comments_count,
          has_reminder: Boolean(row.has_reminder),
          collaborators
        };
      });
      return res.json({ success: true, data: tasks });
    }

    // In-memory fallback
    let tasks = [...db.store.tasks];
    if (status && status !== 'All') {
      tasks = tasks.filter(t => t.status.toLowerCase() === status.toLowerCase());
    }
    if (search) {
      tasks = tasks.filter(t => 
        t.title.toLowerCase().includes(search.toLowerCase()) || 
        (t.description && t.description.toLowerCase().includes(search.toLowerCase()))
      );
    }

    res.json({ success: true, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/tasks
router.post('/', async (req, res) => {
  try {
    const {
      title,
      description = '',
      type = 'General',
      start_time = '9.00 am',
      progress_percentage = 0,
      link_url = 'www.dribbble.com',
      collaborators = []
    } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({ success: false, message: 'Task title is required' });
    }

    const newTask = {
      title: title.trim(),
      description,
      status: 'New',
      progress_percentage: Number(progress_percentage) || 0,
      start_time,
      due_date: new Date().toISOString().split('T')[0],
      type,
      link_url,
      comments_count: 0,
      has_reminder: false
    };

    if (db.isMySQL()) {
      const result = await db.query(
        `INSERT INTO tasks (title, description, status, progress_percentage, start_time, due_date, type, link_url, comments_count, has_reminder)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          newTask.title,
          newTask.description,
          newTask.status,
          newTask.progress_percentage,
          newTask.start_time,
          newTask.due_date,
          newTask.type,
          newTask.link_url,
          0,
          0
        ]
      );
      const insertedId = result.insertId;

      // Map collaborators
      if (Array.isArray(collaborators) && collaborators.length > 0) {
        for (const collab of collaborators) {
          const userId = typeof collab === 'object' ? collab.id : collab;
          if (userId) {
            await db.query(
              'INSERT INTO collaborators (task_id, user_id, role) VALUES (?, ?, ?)',
              [insertedId, userId, 'Collaborator']
            );
          }
        }
      }

      return res.status(201).json({
        success: true,
        data: { id: insertedId, ...newTask, collaborators }
      });
    }

    // In-memory fallback
    const id = db.store.tasks.length > 0 ? Math.max(...db.store.tasks.map(t => t.id)) + 1 : 1;
    const taskRecord = {
      id,
      ...newTask,
      collaborators: collaborators.map(c => typeof c === 'object' ? c : { id: c, name: 'Contributor', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' })
    };
    db.store.tasks.unshift(taskRecord);

    res.status(201).json({ success: true, data: taskRecord });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PATCH /api/tasks/:id
router.patch('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const updates = req.body;

    if (db.isMySQL()) {
      const allowedFields = ['title', 'description', 'status', 'progress_percentage', 'has_reminder', 'start_time'];
      const setClauses = [];
      const values = [];

      for (const [key, val] of Object.entries(updates)) {
        if (allowedFields.includes(key)) {
          setClauses.push(`\`${key}\` = ?`);
          values.push(key === 'has_reminder' ? (val ? 1 : 0) : val);
        }
      }

      if (setClauses.length > 0) {
        values.push(id);
        await db.query(`UPDATE tasks SET ${setClauses.join(', ')} WHERE id = ?`, values);
      }
      return res.json({ success: true, message: 'Task updated successfully' });
    }

    // In-memory fallback
    const taskIndex = db.store.tasks.findIndex(t => t.id === id);
    if (taskIndex === -1) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    db.store.tasks[taskIndex] = {
      ...db.store.tasks[taskIndex],
      ...updates
    };

    res.json({ success: true, data: db.store.tasks[taskIndex] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

