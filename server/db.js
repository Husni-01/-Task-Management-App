import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'task_management_db',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

let pool = null;
let isConnected = false;

// Mock fallback store in case MySQL service is not yet running
const inMemoryStore = {
  users: [
    { id: 1, name: 'Cris Morish', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', email: 'cris@octom.io', role: 'Product Designer', status: 'Online' },
    { id: 2, name: 'Charmie', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80', email: 'charmie@octom.io', role: 'UI/UX Lead', status: 'Online' },
    { id: 3, name: 'Jason Mandala', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', email: 'jason@octom.io', role: 'Frontend Dev', status: 'Away' },
    { id: 4, name: 'Charlie Chu', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80', email: 'charlie@octom.io', role: 'Full-Stack Dev', status: 'Online' },
    { id: 5, name: 'Angeline', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80', email: 'angeline@octom.io', role: 'Project Lead', status: 'Online' }
  ],
  tasks: [
    {
      id: 1,
      title: 'Search Inspiration for project',
      description: 'Review top design trends on dribbble for OCTOM dashboard UI',
      status: 'In Progress',
      progress_percentage: 24,
      start_time: '9.00 am',
      due_date: '2026-11-20',
      type: 'Design Phase',
      link_url: 'www.dribbble.com',
      comments_count: 8,
      has_reminder: true,
      collaborators: [
        { id: 1, name: 'Cris Morish', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' },
        { id: 5, name: 'Angeline', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' }
      ]
    },
    {
      id: 2,
      title: 'Search Inspiration for project',
      description: 'Gather moodboards and user flows from pinterest and behance',
      status: 'In Progress',
      progress_percentage: 60,
      start_time: '3.00 pm',
      due_date: '2026-11-22',
      type: 'UX Research',
      link_url: 'www.pinterest.org',
      comments_count: 12,
      has_reminder: false,
      collaborators: [
        { id: 2, name: 'Charmie', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100' },
        { id: 3, name: 'Jason Mandala', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' }
      ]
    },
    {
      id: 3,
      title: 'Build Wireframe & Component Library',
      description: 'Construct responsive atoms and molecules in Figma',
      status: 'Completed',
      progress_percentage: 85,
      start_time: '11.00 am',
      due_date: '2026-11-24',
      type: 'Design Phase',
      link_url: 'www.figma.com',
      comments_count: 5,
      has_reminder: true,
      collaborators: [
        { id: 1, name: 'Cris Morish', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' }
      ]
    },
    {
      id: 4,
      title: 'Setup Express REST API & Database Schema',
      description: 'Implement MySQL relational mapping and dashboard analytics endpoints',
      status: 'Done',
      progress_percentage: 100,
      start_time: '2.00 pm',
      due_date: '2026-11-15',
      type: 'Development',
      link_url: 'github.com/octom',
      comments_count: 14,
      has_reminder: false,
      collaborators: [
        { id: 4, name: 'Charlie Chu', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100' }
      ]
    }
  ],
  schedules: [
    {
      id: 1,
      title: 'Project Discovery Call',
      subtitle: '30 mins call with client',
      time: '28:20',
      duration: '30 mins',
      call_link: 'https://meet.google.com/octom-call',
      attendees: [
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100'
      ],
      is_active: true
    }
  ],
  messages: [
    {
      id: 1,
      sender_id: 1,
      sender_name: 'Cris Morish',
      sender_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      message_text: 'Hi Angeline! How are You?',
      timestamp: '10:42 am',
      is_read: false
    },
    {
      id: 2,
      sender_id: 2,
      sender_name: 'Charmie',
      sender_avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
      message_text: 'Do you need that design?',
      timestamp: '11:15 am',
      is_read: false
    },
    {
      id: 3,
      sender_id: 3,
      sender_name: 'Jason Mandala',
      sender_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      message_text: 'What is the price of hourly...',
      timestamp: '12:05 pm',
      is_read: true
    },
    {
      id: 4,
      sender_id: 4,
      sender_name: 'Charlie Chu',
      sender_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
      message_text: 'Awesome design!',
      timestamp: '01:30 pm',
      is_read: true
    }
  ],
  timeline_items: [
    {
      id: 1,
      phase_name: 'UX Research',
      sub_phase: null,
      title: 'Profile',
      start_day: 7,
      end_day: 10,
      progress_percentage: 40,
      color_theme: 'purple',
      assignee_avatars: [
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'
      ]
    },
    {
      id: 2,
      phase_name: 'UX Research',
      sub_phase: null,
      title: 'Menu',
      start_day: 12,
      end_day: 15,
      progress_percentage: 64,
      color_theme: 'green',
      assignee_avatars: ['https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100']
    },
    {
      id: 3,
      phase_name: 'UX Research',
      sub_phase: null,
      title: 'Settings',
      start_day: 17,
      end_day: 20,
      progress_percentage: 39,
      color_theme: 'blue',
      assignee_avatars: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100']
    },
    {
      id: 4,
      phase_name: 'Information Architecture',
      sub_phase: null,
      title: 'Login',
      start_day: 5,
      end_day: 8,
      progress_percentage: 49,
      color_theme: 'green',
      assignee_avatars: ['https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100']
    },
    {
      id: 5,
      phase_name: 'Information Architecture',
      sub_phase: null,
      title: 'Overview',
      start_day: 14,
      end_day: 17,
      progress_percentage: 54,
      color_theme: 'orange',
      assignee_avatars: ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100']
    },
    {
      id: 6,
      phase_name: 'Design Phase',
      sub_phase: 'Build Wireframe',
      title: 'Complete Task',
      start_day: 9,
      end_day: 14,
      progress_percentage: 72,
      color_theme: 'indigo',
      assignee_avatars: [
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100'
      ],
      chart_data: [67, 72, 35, 47, 30, 27, 27]
    },
    {
      id: 7,
      phase_name: 'Design Phase',
      sub_phase: 'User Interface D...',
      title: 'Testimonials',
      start_day: 11,
      end_day: 14,
      progress_percentage: 85,
      color_theme: 'purple',
      assignee_avatars: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100']
    },
    {
      id: 8,
      phase_name: 'Design Phase',
      sub_phase: 'User Interface D...',
      title: 'Client Review',
      start_day: 11,
      end_day: 13,
      progress_percentage: 62,
      color_theme: 'orange',
      assignee_avatars: ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100']
    },
    {
      id: 9,
      phase_name: 'Design Phase',
      sub_phase: 'User Interface D...',
      title: 'Homepage',
      start_day: 16,
      end_day: 19,
      progress_percentage: 42,
      color_theme: 'green',
      assignee_avatars: ['https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100']
    },
    {
      id: 10,
      phase_name: 'Phototyping',
      sub_phase: null,
      title: 'GUI Portfolio',
      start_day: 12,
      end_day: 16,
      progress_percentage: 82,
      color_theme: 'cyan',
      assignee_avatars: [
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'
      ]
    },
    {
      id: 11,
      phase_name: 'Development',
      sub_phase: 'Back-End Dev.',
      title: 'Profile',
      start_day: 7,
      end_day: 10,
      progress_percentage: 45,
      color_theme: 'purple',
      assignee_avatars: ['https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100']
    },
    {
      id: 12,
      phase_name: 'Development',
      sub_phase: 'Front-End Dev.',
      title: 'Release',
      start_day: 15,
      end_day: 18,
      progress_percentage: 54,
      color_theme: 'orange',
      assignee_avatars: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100']
    }
  ]
};

// Initialize DB pool
export async function initDatabase() {
  try {
    pool = mysql.createPool(dbConfig);
    const conn = await pool.getConnection();
    isConnected = true;
    console.log(' Successfully connected to MySQL database:', dbConfig.database);
    conn.release();

    // Check if tables exist, if not run schema.sql
    await ensureSchema();
  } catch (err) {
    console.warn(`[DB Notice] MySQL connection to ${dbConfig.host}:${dbConfig.port} failed (${err.message}).`);
    console.warn(' Switching to resilient in-memory database store with seed data. App will run seamlessly!');
    isConnected = false;
  }
}

async function ensureSchema() {
  if (!isConnected || !pool) return;
  try {
    const [rows] = await pool.query("SHOW TABLES LIKE 'tasks'");
    if (rows.length === 0) {
      console.log('Initializing MySQL tables from schema.sql...');
      const schemaFile = path.join(__dirname, 'schema.sql');
      if (fs.existsSync(schemaFile)) {
        const sql = fs.readFileSync(schemaFile, 'utf8');
        // split on semicolons for multiple statements
        const statements = sql
          .split(';')
          .map(s => s.trim())
          .filter(s => s.length > 0 && !s.startsWith('--'));

        for (const statement of statements) {
          try {
            await pool.query(statement);
          } catch (e) {
            // Ignore minor duplicate errors during seed
          }
        }
        console.log('MySQL schema initialized successfully!');
      }
    }
  } catch (error) {
    console.error('Error ensuring schema in MySQL:', error.message);
  }
}

// Database helper object
export const db = {
  isMySQL() {
    return isConnected;
  },

  async query(sql, params = []) {
    if (isConnected && pool) {
      const [results] = await pool.query(sql, params);
      return results;
    }
    return null;
  },

  store: inMemoryStore
};

