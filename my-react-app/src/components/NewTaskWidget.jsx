import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, X, MoreHorizontal, Check } from 'lucide-react';

export default function NewTaskWidget({ onAddTask }) {
  const [taskTitle, setTaskTitle] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('🤩');
  const [collaborators, setCollaborators] = useState([
    { id: 5, name: 'Angela', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
    { id: 1, name: 'Chris', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const availableEmojis = ['😮', '😴', '🤩', '🥳', '🧐', '🤯', '🤠', '🔥', '🚀', '💡'];
  const [emojiOffset, setEmojiOffset] = useState(0);

  const visibleEmojis = availableEmojis.slice(emojiOffset, emojiOffset + 6);

  const nextEmojis = () => {
    if (emojiOffset + 6 < availableEmojis.length) {
      setEmojiOffset(prev => prev + 1);
    }
  };

  const prevEmojis = () => {
    if (emojiOffset > 0) {
      setEmojiOffset(prev => prev - 1);
    }
  };

  const removeCollaborator = (id) => {
    setCollaborators(prev => prev.filter(c => c.id !== id));
  };

  const addSampleCollaborator = () => {
    const pool = [
      { id: 2, name: 'Charmie', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100' },
      { id: 3, name: 'Jason', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
      { id: 4, name: 'Charlie', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100' }
    ];
    const unused = pool.find(p => !collaborators.some(c => c.id === p.id));
    if (unused) {
      setCollaborators(prev => [...prev, unused]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    setIsSubmitting(true);
    try {
      await onAddTask({
        title: `${selectedEmoji} ${taskTitle.trim()}`,
        description: `Created via Quick Task Creator`,
        type: 'Design Phase',
        start_time: '10.00 am',
        progress_percentage: 0,
        collaborators
      });
      setTaskTitle('');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-[#181B25] border border-slate-200/80 dark:border-[#222736] shadow-sm transition-colors">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white">
          New Task
        </h2>
        <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Task Title Field */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 dark:text-slate-400 mb-1.5">
            Task Title
          </label>
          <input
            type="text"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            placeholder="Create new..."
            className="w-full h-10 px-4 text-xs rounded-xl 
              bg-slate-100/80 dark:bg-[#12151E] 
              text-slate-900 dark:text-slate-100 
              placeholder-slate-400 dark:placeholder-slate-500 
              border border-transparent focus:border-indigo-500/50 
              outline-none transition-all"
          />
        </div>

        {/* Emoji Selector Carousel */}
        <div className="flex items-center justify-between py-1 px-2 rounded-xl bg-slate-50 dark:bg-[#12151E] border border-slate-200/50 dark:border-[#222736]">
          <button
            type="button"
            onClick={prevEmojis}
            disabled={emojiOffset === 0}
            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white disabled:opacity-30"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-2 overflow-hidden">
            {visibleEmojis.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => setSelectedEmoji(emoji)}
                className={`text-base p-1 rounded-lg transition-transform hover:scale-125 ${
                  selectedEmoji === emoji ? 'bg-indigo-100 dark:bg-indigo-900/50 ring-1 ring-indigo-500 scale-110' : ''
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={nextEmojis}
            disabled={emojiOffset + 6 >= availableEmojis.length}
            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white disabled:opacity-30"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Add Collaborators & Submit Button */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 dark:text-slate-400 mb-2">
            Add Collaborators
          </label>

          <div className="flex items-center justify-between gap-2">
            
            {/* Collaborator Badges */}
            <div className="flex flex-wrap items-center gap-1.5">
              {collaborators.map((c) => (
                <span
                  key={c.id}
                  className="inline-flex items-center gap-1.5 pl-1 pr-2 py-1 rounded-full bg-slate-100 dark:bg-[#1C2130] text-[11px] font-medium text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-[#2B3245]"
                >
                  <img
                    src={c.avatar}
                    alt={c.name}
                    className="w-4 h-4 rounded-full object-cover"
                  />
                  <span>{c.name}</span>
                  <button
                    type="button"
                    onClick={() => removeCollaborator(c.id)}
                    className="text-slate-400 hover:text-rose-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              {collaborators.length < 5 && (
                <button
                  type="button"
                  onClick={addSampleCollaborator}
                  className="w-6 h-6 rounded-full border border-dashed border-slate-300 dark:border-[#32394E] flex items-center justify-center text-slate-400 hover:text-indigo-500 hover:border-indigo-500 transition-colors"
                  title="Add teammate"
                >
                  <Plus className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Circular Blue Action Button (Matches Screenshot) */}
            <button
              type="submit"
              disabled={isSubmitting || !taskTitle.trim()}
              className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 transition-all"
              title="Create Task"
            >
              <Plus className="w-5 h-5" />
            </button>

          </div>
        </div>
      </form>

      {/* Quick success toast feedback */}
      {showToast && (
        <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-500 font-medium">
          <Check className="w-3.5 h-3.5" />
          <span>Task created successfully!</span>
        </div>
      )}

    </div>
  );
}

