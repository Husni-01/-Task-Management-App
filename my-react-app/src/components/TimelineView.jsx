import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  MoreHorizontal, 
  CheckCircle,
  Calendar as CalendarIcon,
  Layers,
  Sparkles
} from 'lucide-react';

export default function TimelineView({ timelineData, onMilestoneClick }) {
  const [selectedPeriod, setSelectedPeriod] = useState('June 20, 2022');
  const [activeCard, setActiveCard] = useState('Complete Task');

  const days = timelineData?.days || [
    'S 04', 'S 05', 'S 06', 'S 07', 'S 08', 'S 09', 'S 10',
    'S 11', 'S 12', 'S 13', 'S 14', 'S 15', 'S 16', 'S 17',
    'S 18', 'S 19', 'S 20', 'S 21'
  ];

  const startDay = 4; // Day 4 corresponds to column 0

  // Colors mapping for pills matching reference
  const pillColorStyles = {
    purple: 'bg-indigo-600/90 hover:bg-indigo-600 text-white shadow-sm shadow-indigo-600/30',
    green: 'bg-emerald-500/90 hover:bg-emerald-500 text-white shadow-sm shadow-emerald-500/30',
    blue: 'bg-sky-500/90 hover:bg-sky-500 text-white shadow-sm shadow-sky-500/30',
    orange: 'bg-amber-500/90 hover:bg-amber-500 text-white shadow-sm shadow-amber-500/30',
    cyan: 'bg-cyan-500/90 hover:bg-cyan-500 text-white shadow-sm shadow-cyan-500/30',
    indigo: 'bg-indigo-600 text-white'
  };

  const getColSpanStyle = (start, end) => {
    // 18 columns total (indices 0 to 17)
    const colStart = Math.max(1, start - startDay + 1);
    const colEnd = Math.min(19, end - startDay + 2);
    return {
      gridColumnStart: colStart,
      gridColumnEnd: colEnd
    };
  };

  const phases = timelineData?.phases || [];

  return (
    <div className="p-4 sm:p-6 lg:p-8 rounded-3xl bg-white dark:bg-[#181B25] border border-slate-200/80 dark:border-[#222736] shadow-sm transition-colors">
      
      {/* Top Header Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-[#222736]">
        
        {/* Title & Today Pill */}
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            Timeline
          </h1>
          <button 
            onClick={() => setSelectedPeriod('June 20, 2022')}
            className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-[#1C2130] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#252B3C] border border-slate-200 dark:border-[#2E354A] transition-colors"
          >
            Today
          </button>
        </div>

        {/* Date Selector Navigation */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setSelectedPeriod('June 13, 2022')}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1E2332]"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200 px-2 flex items-center gap-1.5">
            <CalendarIcon className="w-3.5 h-3.5 text-indigo-500" />
            {selectedPeriod}
          </span>
          <button 
            onClick={() => setSelectedPeriod('June 27, 2022')}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1E2332]"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right Collaborators & Invite Button */}
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm shadow-indigo-500/25 hover:scale-105 active:scale-95 transition-all">
            <Plus className="w-3.5 h-3.5" />
            <span>+ Invite</span>
          </button>

          <div className="flex -space-x-2 overflow-hidden">
            {[
              'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
              'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100'
            ].map((avatar, idx) => (
              <img
                key={idx}
                src={avatar}
                alt="Teammate"
                className="w-7 h-7 rounded-full ring-2 ring-white dark:ring-[#181B25] object-cover"
              />
            ))}
          </div>
        </div>

      </div>

      {/* Timeline Gantt Grid Container */}
      <div className="mt-6 overflow-x-auto select-none">
        <div className="min-w-[1020px]">
          
          {/* Header Row: Phase Label Column + Date Day Columns */}
          <div className="grid grid-cols-[240px_repeat(18,_minmax(42px,_1fr))] gap-1 items-center pb-3 border-b border-slate-100 dark:border-[#222736]">
            <div className="text-xs font-semibold text-slate-400 dark:text-slate-400 pl-2">
              Phase / Module
            </div>
            {days.map((day, idx) => (
              <div 
                key={idx} 
                className={`text-center text-[11px] font-semibold ${
                  day === 'S 09' || day === 'S 10'
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-400 dark:text-slate-400'
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Phase Rows */}
          <div className="divide-y divide-slate-100 dark:divide-[#202535]">
            
            {/* ROW 1: UX Research */}
            <div className="grid grid-cols-[240px_repeat(18,_minmax(42px,_1fr))] gap-1 items-center py-4 relative group">
              {/* Phase Title & Avatars */}
              <div className="flex items-center justify-between pr-4">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    UX Research
                  </span>
                </div>
                <div className="flex -space-x-1.5">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100" className="w-5 h-5 rounded-full object-cover" alt="" />
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100" className="w-5 h-5 rounded-full object-cover" alt="" />
                </div>
              </div>

              {/* Day Grid Area */}
              <div className="col-span-18 grid grid-cols-18 gap-1 items-center relative h-10">
                {/* Background vertical guides */}
                <div className="absolute inset-0 grid grid-cols-18 pointer-events-none opacity-20 divide-x divide-slate-300 dark:divide-slate-700" />

                {/* Profile 40% (days 7 - 10) */}
                <div 
                  style={getColSpanStyle(7, 10)}
                  onClick={() => onMilestoneClick && onMilestoneClick({ title: 'Profile', progress: 40, phase: 'UX Research' })}
                  className={`h-7 px-3 rounded-full flex items-center justify-between text-[11px] font-bold cursor-pointer transition-transform hover:scale-[1.02] z-10 ${pillColorStyles.purple}`}
                >
                  <span className="truncate">Profile</span>
                  <span className="opacity-90 ml-1">40%</span>
                </div>

                {/* Menu 64% (days 12 - 15) */}
                <div 
                  style={getColSpanStyle(12, 15)}
                  onClick={() => onMilestoneClick && onMilestoneClick({ title: 'Menu', progress: 64, phase: 'UX Research' })}
                  className={`h-7 px-3 rounded-full flex items-center justify-between text-[11px] font-bold cursor-pointer transition-transform hover:scale-[1.02] z-10 ${pillColorStyles.green}`}
                >
                  <span className="truncate">Menu</span>
                  <span className="opacity-90 ml-1">64%</span>
                </div>

                {/* Settings 39% (days 17 - 20) */}
                <div 
                  style={getColSpanStyle(17, 20)}
                  onClick={() => onMilestoneClick && onMilestoneClick({ title: 'Settings', progress: 39, phase: 'UX Research' })}
                  className={`h-7 px-3 rounded-full flex items-center justify-between text-[11px] font-bold cursor-pointer transition-transform hover:scale-[1.02] z-10 ${pillColorStyles.blue}`}
                >
                  <span className="truncate">Settings</span>
                  <span className="opacity-90 ml-1">39%</span>
                </div>
              </div>
            </div>

            {/* ROW 2: Information Architecture */}
            <div className="grid grid-cols-[240px_repeat(18,_minmax(42px,_1fr))] gap-1 items-center py-4 relative group">
              <div className="flex items-center justify-between pr-4">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Information Arc...
                  </span>
                </div>
                <div className="flex -space-x-1.5">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" className="w-5 h-5 rounded-full object-cover" alt="" />
                  <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100" className="w-5 h-5 rounded-full object-cover" alt="" />
                </div>
              </div>

              <div className="col-span-18 grid grid-cols-18 gap-1 items-center relative h-10">
                <div className="absolute inset-0 grid grid-cols-18 pointer-events-none opacity-20 divide-x divide-slate-300 dark:divide-slate-700" />

                {/* Login 49% (days 5 - 8) */}
                <div 
                  style={getColSpanStyle(5, 8)}
                  onClick={() => onMilestoneClick && onMilestoneClick({ title: 'Login', progress: 49, phase: 'Information Architecture' })}
                  className={`h-7 px-3 rounded-full flex items-center justify-between text-[11px] font-bold cursor-pointer transition-transform hover:scale-[1.02] z-10 ${pillColorStyles.green}`}
                >
                  <span className="truncate">Login</span>
                  <span className="opacity-90 ml-1">49%</span>
                </div>

                {/* Overview 54% (days 14 - 17) */}
                <div 
                  style={getColSpanStyle(14, 17)}
                  onClick={() => onMilestoneClick && onMilestoneClick({ title: 'Overview', progress: 54, phase: 'Information Architecture' })}
                  className={`h-7 px-3 rounded-full flex items-center justify-between text-[11px] font-bold cursor-pointer transition-transform hover:scale-[1.02] z-10 ${pillColorStyles.orange}`}
                >
                  <span className="truncate">Overview</span>
                  <span className="opacity-90 ml-1">54%</span>
                </div>
              </div>
            </div>

            {/* ROW 3: Design Phase (Multi-row with floating Complete Task card) */}
            <div className="py-4 relative">
              <div className="grid grid-cols-[240px_repeat(18,_minmax(42px,_1fr))] gap-1 items-start">
                
                {/* Left Phase Headers */}
                <div className="pr-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Design Phase
                      </span>
                    </div>
                    <div className="flex -space-x-1.5">
                      <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100" className="w-5 h-5 rounded-full object-cover" alt="" />
                      <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100" className="w-5 h-5 rounded-full object-cover" alt="" />
                    </div>
                  </div>

                  <div className="pl-5 space-y-3">
                    <div className="text-[11px] font-medium text-slate-400">
                      Build Wireframe
                    </div>
                    <div className="text-[11px] font-medium text-slate-400">
                      User Interface D...
                    </div>
                  </div>
                </div>

                {/* Right Timeline Grid for Design Phase */}
                <div className="col-span-18 space-y-4 relative">
                  
                  {/* Sub-row 1: Build Wireframe with Floating "Complete Task" Modal Card */}
                  <div className="grid grid-cols-18 gap-1 items-center h-10 relative">
                    <div className="absolute inset-0 grid grid-cols-18 pointer-events-none opacity-20 divide-x divide-slate-300 dark:divide-slate-700" />

                    {/* Floating Card: "Complete Task" (Days 9 - 14) */}
                    <div 
                      style={getColSpanStyle(9, 14)} 
                      className="relative z-30"
                    >
                      <div className="p-4 rounded-2xl bg-white dark:bg-[#1C202C] text-slate-900 dark:text-white border border-slate-200 dark:border-[#2F3547] shadow-xl hover:shadow-2xl transition-all cursor-pointer">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold">Complete Task</span>
                          <span className="w-2 h-2 rounded-full bg-indigo-500" />
                        </div>

                        {/* Interactive Curve SVG */}
                        <svg viewBox="0 0 160 50" className="w-full h-12 overflow-visible">
                          <path
                            d="M 10,40 C 30,10 50,45 80,15 C 105,-5 130,30 150,20"
                            fill="none"
                            stroke="#6366F1"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                          />
                          <circle cx="80" cy="15" r="3.5" fill="#6366F1" stroke="#fff" strokeWidth="1.5" />
                        </svg>

                        {/* Numbers row matching design: 67 72 35 47 30 27 27 */}
                        <div className="flex items-center justify-between text-[9px] text-slate-400 dark:text-slate-400 font-mono mt-1">
                          <span>67</span>
                          <span>72</span>
                          <span>35</span>
                          <span>47</span>
                          <span>30</span>
                          <span>27</span>
                          <span>27</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sub-row 2: User Interface Design pills */}
                  <div className="grid grid-cols-18 gap-1 items-center h-10 relative">
                    <div className="absolute inset-0 grid grid-cols-18 pointer-events-none opacity-20 divide-x divide-slate-300 dark:divide-slate-700" />

                    {/* Testimonials 85% (days 11 - 14) */}
                    <div 
                      style={getColSpanStyle(11, 14)}
                      onClick={() => onMilestoneClick && onMilestoneClick({ title: 'Testimonials', progress: 85, phase: 'Design Phase' })}
                      className={`h-7 px-3 rounded-full flex items-center justify-between text-[11px] font-bold cursor-pointer transition-transform hover:scale-[1.02] z-10 ${pillColorStyles.purple}`}
                    >
                      <span className="truncate">Testimonials</span>
                      <span className="opacity-90 ml-1">85%</span>
                    </div>

                    {/* Homepage 42% (days 16 - 19) */}
                    <div 
                      style={getColSpanStyle(16, 19)}
                      onClick={() => onMilestoneClick && onMilestoneClick({ title: 'Homepage', progress: 42, phase: 'Design Phase' })}
                      className={`h-7 px-3 rounded-full flex items-center justify-between text-[11px] font-bold cursor-pointer transition-transform hover:scale-[1.02] z-10 ${pillColorStyles.green}`}
                    >
                      <span className="truncate">Homepage</span>
                      <span className="opacity-90 ml-1">42%</span>
                    </div>
                  </div>

                </div>

              </div>
            </div>

            {/* ROW 4: Phototyping (Prototyping) */}
            <div className="grid grid-cols-[240px_repeat(18,_minmax(42px,_1fr))] gap-1 items-center py-4 relative group">
              <div className="flex items-center justify-between pr-4">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Phototyping
                  </span>
                </div>
                <div className="flex -space-x-1.5">
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100" className="w-5 h-5 rounded-full object-cover" alt="" />
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" className="w-5 h-5 rounded-full object-cover" alt="" />
                </div>
              </div>

              <div className="col-span-18 grid grid-cols-18 gap-1 items-center relative h-10">
                <div className="absolute inset-0 grid grid-cols-18 pointer-events-none opacity-20 divide-x divide-slate-300 dark:divide-slate-700" />

                {/* GUI Portfolio 82% (days 12 - 16) */}
                <div 
                  style={getColSpanStyle(12, 16)}
                  onClick={() => onMilestoneClick && onMilestoneClick({ title: 'GUI Portfolio', progress: 82, phase: 'Phototyping' })}
                  className={`h-7 px-3 rounded-full flex items-center justify-between text-[11px] font-bold cursor-pointer transition-transform hover:scale-[1.02] z-10 ${pillColorStyles.cyan}`}
                >
                  <span className="truncate">GUI Portfolio</span>
                  <span className="opacity-90 ml-1">82%</span>
                </div>
              </div>
            </div>

            {/* ROW 5: Development */}
            <div className="py-4 relative">
              <div className="grid grid-cols-[240px_repeat(18,_minmax(42px,_1fr))] gap-1 items-start">
                
                <div className="pr-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Development
                      </span>
                    </div>
                    <div className="flex -space-x-1.5">
                      <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100" className="w-5 h-5 rounded-full object-cover" alt="" />
                      <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" className="w-5 h-5 rounded-full object-cover" alt="" />
                    </div>
                  </div>

                  <div className="pl-5 space-y-3">
                    <div className="text-[11px] font-medium text-slate-400">
                      Back-End Dev.
                    </div>
                    <div className="text-[11px] font-medium text-slate-400">
                      Front-End Dev.
                    </div>
                  </div>
                </div>

                <div className="col-span-18 space-y-4 relative">
                  
                  {/* Back-End Dev. */}
                  <div className="grid grid-cols-18 gap-1 items-center h-10 relative">
                    <div className="absolute inset-0 grid grid-cols-18 pointer-events-none opacity-20 divide-x divide-slate-300 dark:divide-slate-700" />

                    {/* Profile 45% (days 7 - 10) */}
                    <div 
                      style={getColSpanStyle(7, 10)}
                      onClick={() => onMilestoneClick && onMilestoneClick({ title: 'Profile (Backend)', progress: 45, phase: 'Development' })}
                      className={`h-7 px-3 rounded-full flex items-center justify-between text-[11px] font-bold cursor-pointer transition-transform hover:scale-[1.02] z-10 ${pillColorStyles.purple}`}
                    >
                      <span className="truncate">Profile</span>
                      <span className="opacity-90 ml-1">45%</span>
                    </div>
                  </div>

                  {/* Front-End Dev. */}
                  <div className="grid grid-cols-18 gap-1 items-center h-10 relative">
                    <div className="absolute inset-0 grid grid-cols-18 pointer-events-none opacity-20 divide-x divide-slate-300 dark:divide-slate-700" />

                    {/* Release 54% (days 15 - 18) */}
                    <div 
                      style={getColSpanStyle(15, 18)}
                      onClick={() => onMilestoneClick && onMilestoneClick({ title: 'Release', progress: 54, phase: 'Development' })}
                      className={`h-7 px-3 rounded-full flex items-center justify-between text-[11px] font-bold cursor-pointer transition-transform hover:scale-[1.02] z-10 ${pillColorStyles.orange}`}
                    >
                      <span className="truncate">Release</span>
                      <span className="opacity-90 ml-1">54%</span>
                    </div>
                  </div>

                </div>

              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}

