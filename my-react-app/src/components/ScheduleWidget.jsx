import React, { useState, useEffect } from 'react';
import { Calendar, PhoneCall, Video, ExternalLink } from 'lucide-react';

export default function ScheduleWidget({ schedule }) {
  const currentSchedule = schedule?.[0] || {
    title: 'Project Discovery Call',
    subtitle: '30 mins call with client',
    time: '28:20',
    duration: '30 mins',
    call_link: 'https://meet.google.com/octom-call',
    attendees: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100'
    ]
  };

  // Optional countdown simulation for 28:20
  const [secondsLeft, setSecondsLeft] = useState(28 * 60 + 20);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-[#181B25] border border-slate-200/80 dark:border-[#222736] shadow-sm transition-colors">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white">
          Today's Schedule
        </h2>
        <div className="flex items-center gap-1.5 text-slate-400">
          <Calendar className="w-4 h-4" />
        </div>
      </div>

      <p className="text-xs text-slate-400 dark:text-slate-400 mb-4">
        {currentSchedule.subtitle || '30 mins call with client'}
      </p>

      {/* Blue / Violet Gradient Card */}
      <div className="relative p-5 rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-blue-700 text-white shadow-lg shadow-indigo-600/30 overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-cyan-400/20 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold tracking-wide">
              {currentSchedule.title}
            </h3>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm">
              Upcoming
            </span>
          </div>

          {/* Attendee Avatars & Countdown Pill */}
          <div className="mt-4 flex items-center justify-between">
            {/* Avatars Stack */}
            <div className="flex -space-x-2 overflow-hidden">
              {(currentSchedule.attendees || []).map((avatar, idx) => (
                <img
                  key={idx}
                  src={avatar}
                  alt={`Attendee ${idx + 1}`}
                  className="inline-block w-7 h-7 rounded-full ring-2 ring-indigo-700 object-cover"
                />
              ))}
            </div>

            {/* Countdown Badge & Quick Join Call */}
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-indigo-900/60 backdrop-blur-sm text-xs font-mono font-bold tracking-wider text-cyan-200 border border-indigo-400/30">
                {formatCountdown(secondsLeft)}
              </span>

              <a
                href={currentSchedule.call_link || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors shadow-sm"
                title="Join Call"
              >
                <PhoneCall className="w-3.5 h-3.5 text-white" />
              </a>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

