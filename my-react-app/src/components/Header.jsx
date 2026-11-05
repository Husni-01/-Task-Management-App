import React from 'react';
import { Search, Bell, Sun, Moon, Menu } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Header({ onMenuClick, searchQuery, setSearchQuery }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 w-full bg-white/80 dark:bg-[#0E1118]/85 backdrop-blur-md border-b border-slate-200/80 dark:border-[#202534] transition-colors">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-18">

        {/* Left: Mobile Toggle & Mobile Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1B202E]"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="lg:hidden flex items-center gap-2">
            <span className="font-extrabold text-lg tracking-wider text-slate-900 dark:text-white">
              OCTOM
            </span>
          </div>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-md mx-4 lg:mx-12">
          <div className="relative group">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search anything..."
              className="w-full h-11 pl-5 pr-11 text-sm rounded-full 
                bg-slate-100/90 dark:bg-[#181C26] 
                text-slate-900 dark:text-slate-100 
                placeholder-slate-400 dark:placeholder-slate-500
                border border-transparent focus:border-indigo-500/50 dark:focus:border-indigo-500/50 
                focus:bg-white dark:focus:bg-[#1C2130] 
                outline-none transition-all shadow-inner"
            />
            <button className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Actions: Dark/Light Mode Switcher, Notifications & Profile */}
        <div className="flex items-center gap-3 sm:gap-4">

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center w-10 h-10 rounded-full 
              bg-slate-100 dark:bg-[#181C26] 
              text-slate-600 dark:text-amber-400 
              hover:bg-slate-200 dark:hover:bg-[#222838] 
              border border-slate-200/60 dark:border-[#272D3E] 
              transition-all shadow-sm"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle Dark/Light Mode"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 transition-transform hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600 transition-transform hover:-rotate-12" />
            )}
          </button>

          {/* Notification Bell */}
          <button
            className="relative flex items-center justify-center w-10 h-10 rounded-full 
              bg-slate-100 dark:bg-[#181C26] 
              text-slate-600 dark:text-slate-300 
              hover:bg-slate-200 dark:hover:bg-[#222838] 
              border border-slate-200/60 dark:border-[#272D3E] 
              transition-all"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-[#13161F]" />
          </button>

          {/* User Profile Avatar */}
          <div className="flex items-center gap-3 pl-2 sm:border-l border-slate-200 dark:border-[#252B3A] cursor-pointer group">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80"
                alt="Angeline Profile"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/40 group-hover:ring-indigo-500 transition-all shadow"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#13161F]" />
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                Angeline
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-400">
                Project Lead
              </span>
            </div>
          </div>

        </div>

      </div>
    </header>
  );
}

