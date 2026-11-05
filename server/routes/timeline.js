import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// GET /api/timeline
router.get('/', async (req, res) => {
  try {
    const daysRange = [
      'S 04', 'S 05', 'S 06', 'S 07', 'S 08', 'S 09', 'S 10',
      'S 11', 'S 12', 'S 13', 'S 14', 'S 15', 'S 16', 'S 17',
      'S 18', 'S 19', 'S 20', 'S 21'
    ];

    let items = [];
    if (db.isMySQL()) {
      try {
        const rows = await db.query('SELECT * FROM timeline_items ORDER BY id ASC');
        items = rows.map(r => ({
          ...r,
          assignee_avatars: r.assignee_avatars ? JSON.parse(r.assignee_avatars) : []
        }));
      } catch (e) {
        items = db.store.timeline_items;
      }
    } else {
      items = db.store.timeline_items;
    }

    // Structure items by Phase
    const phases = [
      {
        id: 'ux-research',
        name: 'UX Research',
        avatars: [
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'
        ],
        milestones: items.filter(i => i.phase_name === 'UX Research')
      },
      {
        id: 'info-arch',
        name: 'Information Architecture',
        avatars: [
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
          'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100'
        ],
        milestones: items.filter(i => i.phase_name === 'Information Architecture')
      },
      {
        id: 'design-phase',
        name: 'Design Phase',
        avatars: [
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
          'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100'
        ],
        subPhases: [
          {
            name: 'Build Wireframe',
            milestones: items.filter(i => i.phase_name === 'Design Phase' && i.sub_phase === 'Build Wireframe')
          },
          {
            name: 'User Interface D...',
            milestones: items.filter(i => i.phase_name === 'Design Phase' && i.sub_phase === 'User Interface D...')
          }
        ]
      },
      {
        id: 'prototyping',
        name: 'Phototyping',
        avatars: [
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'
        ],
        milestones: items.filter(i => i.phase_name === 'Phototyping')
      },
      {
        id: 'development',
        name: 'Development',
        avatars: [
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'
        ],
        subPhases: [
          {
            name: 'Back-End Dev.',
            milestones: items.filter(i => i.phase_name === 'Development' && i.sub_phase === 'Back-End Dev.')
          },
          {
            name: 'Front-End Dev.',
            milestones: items.filter(i => i.phase_name === 'Development' && i.sub_phase === 'Front-End Dev.')
          }
        ]
      }
    ];

    res.json({
      success: true,
      data: {
        currentPeriod: 'June 20, 2022',
        days: daysRange,
        startDayOffset: 4, // Starts from day 4
        phases
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

