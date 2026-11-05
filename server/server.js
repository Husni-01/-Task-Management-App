import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { initDatabase, db } from './db.js';

import dashboardRoutes from './routes/dashboard.js';
import taskRoutes from './routes/tasks.js';
import timelineRoutes from './routes/timeline.js';
import messageRoutes from './routes/messages.js';
import scheduleRoutes from './routes/schedule.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// API Routes
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/timeline', timelineRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/schedule', scheduleRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    database: db.isMySQL() ? 'MySQL Connected' : 'In-Memory Store (MySQL Fallback)',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 OCTOM Backend server is listening on http://localhost:${PORT}`);
  await initDatabase();
});

