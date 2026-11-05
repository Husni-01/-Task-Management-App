import React from 'react';
import {
  LayoutGrid,
  Calendar,
  MessageSquare,
  BarChart2,
  Settings,
  LogOut,
  Users,
  Layers,
  X
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, isOpen, setIsOpen }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'timeline', label: 'Timeline', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'messages', label: 'Messages', icon: MessageSquare, badge: 2 },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Rail */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 flex flex-col items-center justify-between
        w-20 py-6 transition-all duration-300 ease-in-out
        bg-white dark:bg-[#13161F] border-r border-slate-200 dark:border-[#222736]
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Top Logo */}
        <div className="flex flex-col items-center gap-1">
          <div className="relative group cursor-pointer">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-500 to-cyan-400 p-[2px] shadow-lg shadow-indigo-500/25 flex items-center justify-center">
              <div className="w-full h-full bg-white dark:bg-[#13161F] rounded-2xl flex items-center justify-center">
                <Layers className="w-6 h-6 text-indigo-600 dark:text-cyan-400 transform group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <span className="block text-[9px] font-bold tracking-wider text-slate-800 dark:text-white uppercase mt-1 text-center">
              OCTOM
            </span>
          </div>

          {/* Close button for mobile */}
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden mt-2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col items-center gap-4 w-full px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsOpen(false);
                }}
                title={item.label}
                className={`
                  relative group flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-200
                  ${isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-indigo-500/35 scale-105'
                    : 'text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1C2130]'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                {item.badge && !isActive && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-indigo-500 ring-2 ring-white dark:ring-[#13161F]" />
                )}

                {/* Floating tooltip on hover */}
                <span className="absolute left-16 px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xl z-50">
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Bottom Exit / Settings */}
        <div className="flex flex-col items-center gap-3">
          <button
            className="flex items-center justify-center w-11 h-11 rounded-xl text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
            title="Log Out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </aside>
    </>
  );
}

