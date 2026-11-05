import React, { useState } from 'react';
import { X, Send, User } from 'lucide-react';

export default function ChatModal({ isOpen, onClose, messages, onSendMessage, activeUser }) {
  const [inputText, setInputText] = useState('');

  if (!isOpen) return null;

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage({
      sender_name: 'Angeline',
      message_text: inputText.trim()
    });
    setInputText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#181B25] border border-slate-200 dark:border-[#242A3B] shadow-2xl overflow-hidden flex flex-col h-[520px]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-[#222736]">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={activeUser?.sender_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                alt=""
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#181B25]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {activeUser?.sender_name || 'Team Direct Chat'}
              </h3>
              <p className="text-[11px] text-emerald-500 font-medium">Active now</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#202534]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {messages.map((m) => {
            const isMe = m.sender_name === 'Angeline';
            return (
              <div
                key={m.id}
                className={`flex items-start gap-2.5 ${isMe ? 'flex-row-reverse' : ''}`}
              >
                <img
                  src={m.sender_avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'}
                  alt=""
                  className="w-7 h-7 rounded-full object-cover mt-1 flex-shrink-0"
                />
                <div
                  className={`max-w-[75%] p-3 rounded-2xl text-xs ${
                    isMe
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-none shadow-md shadow-indigo-500/20'
                      : 'bg-slate-100 dark:bg-[#1E2332] text-slate-800 dark:text-slate-100 rounded-bl-none'
                  }`}
                >
                  <div className="text-[10px] font-semibold opacity-70 mb-0.5">
                    {m.sender_name} • {m.timestamp}
                  </div>
                  <p className="leading-relaxed">{m.message_text}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input Footer */}
        <form onSubmit={handleSend} className="p-3 border-t border-slate-100 dark:border-[#222736] flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 h-10 px-4 text-xs rounded-full bg-slate-100 dark:bg-[#12151E] text-slate-900 dark:text-white placeholder-slate-400 outline-none border border-transparent focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center disabled:opacity-40 shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
}

