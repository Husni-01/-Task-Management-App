import React from 'react';
import MetricsCards from './MetricsCards';
import AnalyticsChart from './AnalyticsChart';
import TaskList from './TaskList';
import ScheduleWidget from './ScheduleWidget';
import MessagesWidget from './MessagesWidget';
import NewTaskWidget from './NewTaskWidget';

export default function DashboardView({
  stats,
  chartData,
  chartPeriod,
  onChartPeriodChange,
  tasks,
  schedule,
  messages,
  onToggleReminder,
  onAddTask,
  onTaskClick,
  onSelectMessage,
  onOpenChatModal,
  onOpenNewTaskModal
}) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8">
      
      {/* Left 8 Cols (Main Feed) */}
      <div className="xl:col-span-8 space-y-6 lg:space-y-8">
        {/* Top 3 Stat Cards */}
        <MetricsCards stats={stats} />

        {/* Task Done Line Chart */}
        <AnalyticsChart
          chartData={chartData}
          activePeriod={chartPeriod}
          onPeriodChange={onChartPeriodChange}
        />

        {/* Task Section */}
        <TaskList
          tasks={tasks}
          onToggleReminder={onToggleReminder}
          onTaskClick={onTaskClick}
          onOpenNewTaskModal={onOpenNewTaskModal}
        />
      </div>

      {/* Right 4 Cols (Sidebar Widgets) */}
      <div className="xl:col-span-4 space-y-6">
        {/* Today's Schedule Card */}
        <ScheduleWidget schedule={schedule} />

        {/* Messages Preview */}
        <MessagesWidget
          messages={messages}
          onSelectMessage={onSelectMessage}
          onOpenChatModal={onOpenChatModal}
        />

        {/* New Task Creator Form */}
        <NewTaskWidget onAddTask={onAddTask} />
      </div>

    </div>
  );
}

