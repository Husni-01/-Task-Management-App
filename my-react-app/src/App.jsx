import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import TimelineView from './components/TimelineView';
import ChatModal from './components/ChatModal';
import TaskModal from './components/TaskModal';

import {
  fetchDashboardStats,
  fetchAnalytics,
  fetchTasks,
  fetchTimeline,
  fetchMessages,
  fetchSchedule,
  createTask,
  updateTask,
  sendMessage
} from './services/api';

export function MainApp() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Data states
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [chartPeriod, setChartPeriod] = useState('Monthly');
  const [tasks, setTasks] = useState([]);
  const [timelineData, setTimelineData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [selectedChatUser, setSelectedChatUser] = useState(null);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [activeTaskToEdit, setActiveTaskToEdit] = useState(null);

  // Initial Data Load
  useEffect(() => {
    async function loadAllData() {
      try {
        setIsLoading(true);
        const [statsRes, analyticsRes, tasksRes, timelineRes, messagesRes, scheduleRes] =
          await Promise.all([
            fetchDashboardStats(),
            fetchAnalytics('Monthly'),
            fetchTasks(),
            fetchTimeline(),
            fetchMessages(),
            fetchSchedule()
          ]);

        setStats(statsRes);
        setChartData(analyticsRes);
        setTasks(tasksRes);
        setTimelineData(timelineRes);
        setMessages(messagesRes);
        setSchedule(scheduleRes);
      } catch (err) {
        console.error('Error fetching initial dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadAllData();
  }, []);

  // Handle Chart Period Change
  const handleChartPeriodChange = async (newPeriod) => {
    setChartPeriod(newPeriod);
    const data = await fetchAnalytics(newPeriod);
    setChartData(data);
  };

  // Toggle Reminder
  const handleToggleReminder = async (taskId, newStatus) => {
    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, has_reminder: newStatus } : t))
    );
    await updateTask(taskId, { has_reminder: newStatus });
  };

  // Add Task
  const handleAddTask = async (newTaskData) => {
    const created = await createTask(newTaskData);
    setTasks(prev => [created, ...prev]);
    // update stats count
    setStats(prev => {
      if (!prev) return prev;
      const curCount = parseInt(prev.newTask?.value || '10', 10);
      return {
        ...prev,
        newTask: {
          ...prev.newTask,
          value: curCount + 1 < 10 ? `0${curCount + 1}` : `${curCount + 1}`
        }
      };
    });
  };

  // Save Task (from Modal)
  const handleSaveTaskModal = async (taskData) => {
    if (taskData.id) {
      // update
      setTasks(prev => prev.map(t => (t.id === taskData.id ? { ...t, ...taskData } : t)));
      await updateTask(taskData.id, taskData);
    } else {
      // create
      await handleAddTask(taskData);
    }
  };

  // Send message
  const handleSendMessage = async (msgData) => {
    const newMsg = await sendMessage(msgData);
    setMessages(prev => [...prev, newMsg]);
  };

  // Filter tasks based on search
  const filteredTasks = tasks.filter(t => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.title.toLowerCase().includes(q) ||
      (t.description && t.description.toLowerCase().includes(q)) ||
      (t.type && t.type.toLowerCase().includes(q))
    );
  });

  return (
    <div className="min-h-screen bg-[#F4F7FC] dark:bg-[#0E1118] text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="lg:pl-20 flex flex-col min-h-screen transition-all">
        
        {/* Top Header */}
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* View Router */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              stats={stats}
              chartData={chartData}
              chartPeriod={chartPeriod}
              onChartPeriodChange={handleChartPeriodChange}
              tasks={filteredTasks}
              schedule={schedule}
              messages={messages}
              onToggleReminder={handleToggleReminder}
              onAddTask={handleAddTask}
              onTaskClick={(task) => {
                setActiveTaskToEdit(task);
                setTaskModalOpen(true);
              }}
              onSelectMessage={(msg) => {
                setSelectedChatUser(msg);
                setChatModalOpen(true);
              }}
              onOpenChatModal={() => {
                setSelectedChatUser(null);
                setChatModalOpen(true);
              }}
              onOpenNewTaskModal={() => {
                setActiveTaskToEdit(null);
                setTaskModalOpen(true);
              }}
            />
          )}

          {activeTab === 'timeline' && (
            <TimelineView
              timelineData={timelineData}
              onMilestoneClick={(milestone) => {
                setActiveTaskToEdit({
                  title: milestone.title,
                  type: milestone.phase,
                  progress_percentage: milestone.progress,
                  status: 'In Progress'
                });
                setTaskModalOpen(true);
              }}
            />
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h1 className="text-xl font-bold">Analytics & Performance Overview</h1>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <DashboardView
                  stats={stats}
                  chartData={chartData}
                  chartPeriod={chartPeriod}
                  onChartPeriodChange={handleChartPeriodChange}
                  tasks={filteredTasks}
                  schedule={schedule}
                  messages={messages}
                  onToggleReminder={handleToggleReminder}
                  onAddTask={handleAddTask}
                />
              </div>
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="max-w-3xl mx-auto rounded-3xl bg-white dark:bg-[#181B25] border border-slate-200 dark:border-[#222736] p-6">
              <h2 className="text-base font-bold mb-4">Team Messages</h2>
              <div className="space-y-4">
                {messages.map(m => (
                  <div key={m.id} className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-[#1E2332]">
                    <img src={m.sender_avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
                    <div>
                      <span className="text-xs font-bold">{m.sender_name}</span>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{m.message_text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-2xl mx-auto rounded-3xl bg-white dark:bg-[#181B25] border border-slate-200 dark:border-[#222736] p-6 space-y-6">
              <h2 className="text-lg font-bold">Application & Database Settings</h2>
              <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/40 text-xs text-indigo-800 dark:text-indigo-300 space-y-2">
                <p className="font-bold">Database Connectivity Status:</p>
                <p>Express Backend: <code>http://localhost:5000/api</code></p>
                <p>MySQL Database: <code>task_management_db</code> (Auto schema + seeds ready)</p>
                <p>Status: Resilient Dual-Layer (MySQL with instant mock fallback)</p>
              </div>
            </div>
          )}
        </main>

        {/* Global Footer info */}
        <footer className="mt-auto py-4 px-6 text-center text-xs text-slate-400 dark:text-slate-400 border-t border-slate-200/60 dark:border-[#1F2433]">
          OCTOM Task Management Application • Inspired by Reference UI • Full-Stack React + Express + MySQL
        </footer>

      </div>

      {/* Chat Modal */}
      <ChatModal
        isOpen={chatModalOpen}
        onClose={() => setChatModalOpen(false)}
        messages={messages}
        onSendMessage={handleSendMessage}
        activeUser={selectedChatUser}
      />

      {/* Task Modal */}
      <TaskModal
        isOpen={taskModalOpen}
        onClose={() => {
          setTaskModalOpen(false);
          setActiveTaskToEdit(null);
        }}
        task={activeTaskToEdit}
        onSave={handleSaveTaskModal}
      />

    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}
