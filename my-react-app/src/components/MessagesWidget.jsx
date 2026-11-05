import React from 'react';
import { MessageSquarePlus } from 'lucide-react';

export default function MessagesWidget({ messages, onSelectMessage, onOpenChatModal }) {
  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-[#181B25] border border-slate-200/80 dark:border-[#222736] shadow-sm transition-colors">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white">
          Messages
        </h2>
        <button
          onClick={onOpenChatModal}
          className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-semibold"
        >
          <MessageSquarePlus className="w-3.5 h-3.5" />
          <span>New Chat</span>
        </button>
      </div>

      {/* Message Previews List */}
      <div className="space-y-3.5">
        {messages && messages.length > 0 ? (
          messages.slice(0, 4).map((msg) => (
            <div
              key={msg.id}
              onClick={() => onSelectMessage && onSelectMessage(msg)}
              className="flex items-center gap-3 p-2 -mx-2 rounded-2xl hover:bg-slate-50 dark:hover:bg-[#1E2332] cursor-pointer transition-colors"
            >
              <div className="relative flex-shrink-0">
                <img
                  src={msg.sender_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                  alt={msg.sender_name}
                  className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200 dark:ring-[#2C3345]"
                />
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#181B25]" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                    {msg.sender_name}
                  </h4>
                  <span className="text-[10px] text-slate-400">
                    {msg.timestamp || '10:42 am'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-400 truncate mt-0.5">
                  {msg.message_text}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-xs text-slate-400">No recent messages.</p>
        )}
      </div>

    </div>
  );
}

