const API_BASE = '/api';

export async function fetchDashboardStats() {
  try {
    const res = await fetch(`${API_BASE}/dashboard/stats`);
    if (!res.ok) throw new Error('Failed to fetch dashboard stats');
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.warn('API error, using client fallback:', error);
    return {
      taskCompleted: {
        title: 'Task Completed',
        value: '08',
        changeText: '+10% more',
        subtext: 'from last week',
        trendType: 'positive',
        color: 'purple',
        sparkline: [20, 45, 30, 60, 40, 75, 55, 80]
      },
      newTask: {
        title: 'New Task',
        value: '10',
        changeText: '10+ more',
        subtext: 'from last week',
        trendType: 'positive',
        color: 'cyan',
        sparkline: [30, 50, 40, 70, 60, 85, 70, 95]
      },
      projectDone: {
        title: 'Project Done',
        value: '10',
        changeText: '08+ more',
        subtext: 'from last week',
        trendType: 'positive',
        color: 'coral',
        sparkline: [15, 35, 25, 55, 45, 65, 75, 90]
      }
    };
  }
}

export async function fetchAnalytics(timeframe = 'Monthly') {
  try {
    const res = await fetch(`${API_BASE}/dashboard/analytics?timeframe=${timeframe}`);
    if (!res.ok) throw new Error('Failed to fetch analytics');
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.warn('API error, using analytics fallback:', error);
    const mock = {
      Monthly: {
        categories: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        series1: [80, 180, 360, 240, 220, 370, 230, 260],
        series2: [60, 120, 210, 170, 140, 250, 190, 220],
        max: 400
      },
      Weekly: {
        categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
        series1: [140, 210, 320, 280, 360, 390],
        series2: [90, 150, 210, 220, 260, 300],
        max: 400
      },
      Daily: {
        categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        series1: [45, 85, 120, 95, 150, 70, 40],
        series2: [30, 65, 90, 70, 110, 50, 25],
        max: 160
      }
    };
    return mock[timeframe] || mock.Monthly;
  }
}

export async function fetchTasks(filters = {}) {
  try {
    const params = new URLSearchParams(filters);
    const res = await fetch(`${API_BASE}/tasks?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch tasks');
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.warn('API error, using task fallback:', error);
    return [
      {
        id: 1,
        title: 'Search Inspiration for project',
        description: 'Review top design trends on dribbble for OCTOM dashboard UI',
        status: 'In Progress',
        progress_percentage: 24,
        start_time: '9.00 am',
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
        link_url: 'www.pinterest.org',
        comments_count: 12,
        has_reminder: false,
        collaborators: [
          { id: 2, name: 'Charmie', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100' },
          { id: 3, name: 'Jason Mandala', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' }
        ]
      }
    ];
  }
}

export async function createTask(taskData) {
  try {
    const res = await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData)
    });
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.warn('API error creating task, using local object:', error);
    return {
      id: Date.now(),
      ...taskData,
      status: 'New',
      comments_count: 0,
      has_reminder: false
    };
  }
}

export async function updateTask(id, updates) {
  try {
    const res = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return await res.json();
  } catch (error) {
    console.warn('API error updating task:', error);
    return { success: true };
  }
}

export async function fetchTimeline() {
  try {
    const res = await fetch(`${API_BASE}/timeline`);
    if (!res.ok) throw new Error('Failed to fetch timeline');
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.warn('API error fetching timeline, using fallback:', error);
    return null;
  }
}

export async function fetchMessages() {
  try {
    const res = await fetch(`${API_BASE}/messages`);
    if (!res.ok) throw new Error('Failed to fetch messages');
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.warn('API error fetching messages:', error);
    return [
      { id: 1, sender_name: 'Cris Morish', sender_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100', message_text: 'Hi Angeline! How are You?', timestamp: '10:42 am' },
      { id: 2, sender_name: 'Charmie', sender_avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100', message_text: 'Do you need that design?', timestamp: '11:15 am' },
      { id: 3, sender_name: 'Jason Mandala', sender_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', message_text: 'What is the price of hourly...', timestamp: '12:05 pm' },
      { id: 4, sender_name: 'Charlie Chu', sender_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100', message_text: 'Awesome design!', timestamp: '01:30 pm' }
    ];
  }
}

export async function sendMessage(msg) {
  try {
    const res = await fetch(`${API_BASE}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(msg)
    });
    const data = await res.json();
    return data.data;
  } catch (error) {
    return {
      id: Date.now(),
      sender_name: msg.sender_name || 'Angeline',
      sender_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      message_text: msg.message_text,
      timestamp: 'Just now'
    };
  }
}

export async function fetchSchedule() {
  try {
    const res = await fetch(`${API_BASE}/schedule`);
    if (!res.ok) throw new Error('Failed to fetch schedule');
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.warn('API error fetching schedule:', error);
    return [
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
        ]
      }
    ];
  }
}

