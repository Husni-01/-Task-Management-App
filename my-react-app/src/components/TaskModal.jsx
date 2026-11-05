import React, { useState } from 'react';
import { X, Check, Calendar, Clock, Globe } from 'lucide-react';

export default function TaskModal({ isOpen, onClose, task, onSave }) {
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    type: task?.type || 'Design Phase',
    start_time: task?.start_time || '9.00 am',
    progress_percentage: task?.progress_percentage ?? 25,
    status: task?.status || 'In Progress',
    link_url: task?.link_url || 'www.dribbble.com'
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    onSave({
      id: task?.id,
      ...formData,
      progress_percentage: Number(formData.progress_percentage)
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#181B25] border border-slate-200 dark:border-[#242A3B] shadow-2xl p-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-[#222736]">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {task ? 'Edit Task Details' : 'Create New Project Task'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
              Task Title
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Search Inspiration for project"
              className="w-full h-10 px-3.5 text-xs rounded-xl bg-slate-50 dark:bg-[#12151E] text-slate-900 dark:text-white border border-slate-200 dark:border-[#282E40] outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                Phase / Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full h-10 px-3 text-xs rounded-xl bg-slate-50 dark:bg-[#12151E] text-slate-900 dark:text-white border border-slate-200 dark:border-[#282E40] outline-none"
              >
                <option value="UX Research">UX Research</option>
                <option value="Information Architecture">Information Architecture</option>
                <option value="Design Phase">Design Phase</option>
                <option value="Phototyping">Phototyping</option>
                <option value="Development">Development</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                Start Time
              </label>
              <input
                type="text"
                value={formData.start_time}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                placeholder="e.g. 9.00 am"
                className="w-full h-10 px-3 text-xs rounded-xl bg-slate-50 dark:bg-[#12151E] text-slate-900 dark:text-white border border-slate-200 dark:border-[#282E40] outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Progress Percentage
              </label>
              <span className="text-xs font-bold text-indigo-500">
                {formData.progress_percentage}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={formData.progress_percentage}
              onChange={(e) => setFormData({ ...formData, progress_percentage: e.target.value })}
              className="w-full accent-indigo-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
              Reference Link
            </label>
            <input
              type="text"
              value={formData.link_url}
              onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
              placeholder="e.g. www.dribbble.com"
              className="w-full h-10 px-3.5 text-xs rounded-xl bg-slate-50 dark:bg-[#12151E] text-slate-900 dark:text-white border border-slate-200 dark:border-[#282E40] outline-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-500/25 hover:opacity-95"
            >
              Save Task
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

