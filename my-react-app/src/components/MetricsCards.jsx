import React from 'react';
import { CheckCircle2, PlusCircle, Award } from 'lucide-react';

function MiniSparkline({ points, strokeColor }) {
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const width = 110;
  const height = 36;
  const padding = 4;

  const pathCoords = points.map((p, i) => {
    const x = padding + (i / (points.length - 1)) * (width - 2 * padding);
    const y = height - padding - ((p - min) / range) * (height - 2 * padding);
    return `${x},${y}`;
  });

  // Create smooth bezier curve string
  let d = `M ${pathCoords[0]}`;
  for (let i = 1; i < pathCoords.length; i++) {
    const [prevX, prevY] = pathCoords[i - 1].split(',').map(Number);
    const [currX, currY] = pathCoords[i].split(',').map(Number);
    const midX = (prevX + currX) / 2;
    d += ` C ${midX},${prevY} ${midX},${currY} ${currX},${currY}`;
  }

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <filter id={`glow-${strokeColor}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor={strokeColor} floodOpacity="0.4" />
        </filter>
      </defs>
      <path
        d={d}
        fill="none"
        stroke={strokeColor}
        strokeWidth="2.5"
        strokeLinecap="round"
        filter={`url(#glow-${strokeColor})`}
      />
    </svg>
  );
}

export default function MetricsCards({ stats }) {
  if (!stats) return null;

  const cards = [
    {
      key: 'taskCompleted',
      data: stats.taskCompleted || { value: '08', title: 'Task Completed', changeText: '+10% more', subtext: 'from last week' },
      icon: CheckCircle2,
      strokeColor: '#8B5CF6', // Purple
      badgeColor: 'text-violet-500 bg-violet-50 dark:bg-violet-950/40 dark:text-violet-400'
    },
    {
      key: 'newTask',
      data: stats.newTask || { value: '10', title: 'New Task', changeText: '10+ more', subtext: 'from last week' },
      icon: PlusCircle,
      strokeColor: '#06B6D4', // Cyan
      badgeColor: 'text-cyan-500 bg-cyan-50 dark:bg-cyan-950/40 dark:text-cyan-400'
    },
    {
      key: 'projectDone',
      data: stats.projectDone || { value: '10', title: 'Project Done', changeText: '08+ more', subtext: 'from last week' },
      icon: Award,
      strokeColor: '#F97316', // Coral/Orange
      badgeColor: 'text-orange-500 bg-orange-50 dark:bg-orange-950/40 dark:text-orange-400'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
      {cards.map((card) => {
        const Icon = card.icon;
        const { value, title, changeText, subtext, sparkline } = card.data;

        return (
          <div
            key={card.key}
            className="group relative p-5 rounded-3xl 
              bg-white dark:bg-[#181B25] 
              border border-slate-200/80 dark:border-[#222736] 
              shadow-sm hover:shadow-md dark:shadow-none 
              transition-all duration-200"
          >
            {/* Header: Title and Icon */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {title}
                </span>
              </div>
              <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                {value}
              </span>
            </div>

            {/* Sparkline & Trend indicators */}
            <div className="mt-4 flex items-end justify-between">
              <div className="pt-2">
                <MiniSparkline
                  points={sparkline || [20, 45, 30, 60, 40, 75, 55, 80]}
                  strokeColor={card.strokeColor}
                />
              </div>

              <div className="text-right">
                <span className="inline-block text-[11px] font-bold text-slate-700 dark:text-slate-200">
                  {changeText}
                </span>
                <span className="block text-[10px] text-slate-400 dark:text-slate-400">
                  {subtext}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

