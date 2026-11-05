import React from 'react';
import { Play, Globe, MessageSquare, Bell, Check, Clock, Plus } from 'lucide-react';

export default function TaskList({ tasks, onToggleReminder, onTaskClick, onOpenNewTaskModal }) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          Task
        </h2>
        <button
          onClick={onOpenNewTaskModal}
          className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Custom Task</span>
        </button>
      </div>

      {/* Task List Items */}
      <div className="space-y-3">
        {tasks && tasks.length > 0 ? (
          tasks.map((task) => {
            const hasReminder = task.has_reminder;
            const progress = task.progress_percentage || 0;

            return (
              <div
                key={task.id}
                className="group p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#181B25] border border-slate-200/80 dark:border-[#222736] shadow-sm hover:shadow-md dark:shadow-none transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  
                  {/* Left: Play button & Start from */}
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => onTaskClick && onTaskClick(task)}
                      className="w-10 h-10 rounded-full flex-shrink-0 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform"
                      title="Play / View Task Details"
                    >
                      <Play className="w-4 h-4 fill-white ml-0.5" />
                    </button>

                    <div>
                      <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400 dark:text-slate-400">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>Start from</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-200">
                          {task.start_time || '9.00 am'}
                        </span>
                      </div>
                      <h3 
                        onClick={() => onTaskClick && onTaskClick(task)}
                        className="text-sm font-bold text-slate-900 dark:text-white cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mt-0.5"
                      >
                        {task.title}
                      </h3>
                      
                      {/* Meta Links & Comments */}
                      <div className="flex items-center gap-4 mt-1 text-xs text-slate-400 dark:text-slate-400">
                        {task.link_url && (
                          <a
                            href={task.link_url.startsWith('http') ? task.link_url : `https://${task.link_url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                          >
                            <Globe className="w-3.5 h-3.5" />
                            <span className="truncate max-w-[140px]">{task.link_url}</span>
                          </a>
                        )}
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>{task.comments_count || 0} comments</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Progress bar & Reminder button */}
                  <div className="flex items-center gap-4 sm:gap-6 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-[#222736]">
                    
                    {/* Progress Percentage & Bar */}
                    <div className="flex-1 sm:w-44">
                      <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                        <span className="text-slate-700 dark:text-slate-200">
                          {progress}% complete
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-[#12151E] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Reminder Button */}
                    <button
                      onClick={() => onToggleReminder && onToggleReminder(task.id, !hasReminder)}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                        hasReminder
                          ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                          : 'bg-slate-100 dark:bg-[#13161F] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#202534] border border-slate-200/60 dark:border-[#242938]'
                      }`}
                    >
                      <Bell className={`w-3.5 h-3.5 ${hasReminder ? 'fill-current' : ''}`} />
                      <span>{hasReminder ? 'Reminder Set' : '+ Reminder'}</span>
                    </button>

                  </div>

                </div>
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center rounded-3xl bg-white dark:bg-[#181B25] border border-slate-200/80 dark:border-[#222736]">
            <p className="text-sm text-slate-400">No tasks currently found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

