import React, { useState } from 'react';

export default function AnalyticsChart({ chartData, activePeriod, onPeriodChange }) {
  const [hoverIndex, setHoverIndex] = useState(null);

  const categories = chartData?.categories || ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const series1 = chartData?.series1 || [80, 180, 360, 240, 220, 370, 230, 260];
  const series2 = chartData?.series2 || [60, 120, 210, 170, 140, 250, 190, 220];
  const maxVal = chartData?.max || 400;

  // Chart dimensions
  const svgWidth = 700;
  const svgHeight = 260;
  const paddingLeft = 55;
  const paddingRight = 30;
  const paddingTop = 25;
  const paddingBottom = 45;

  const chartInnerWidth = svgWidth - paddingLeft - paddingRight;
  const chartInnerHeight = svgHeight - paddingTop - paddingBottom;

  const getCoordinates = (series) => {
    return series.map((val, idx) => {
      const x = paddingLeft + (idx / (series.length - 1)) * chartInnerWidth;
      const y = paddingTop + chartInnerHeight - (val / maxVal) * chartInnerHeight;
      return { x, y, val };
    });
  };

  const coords1 = getCoordinates(series1);
  const coords2 = getCoordinates(series2);

  // Helper to generate smooth cubic bezier curve
  const generateSmoothPath = (points) => {
    if (points.length === 0) return '';
    let d = `M ${points[0].x},${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cp1x = prev.x + (curr.x - prev.x) * 0.45;
      const cp1y = prev.y;
      const cp2x = curr.x - (curr.x - prev.x) * 0.45;
      const cp2y = curr.y;
      d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${curr.x},${curr.y}`;
    }
    return d;
  };

  const path1 = generateSmoothPath(coords1);
  const path2 = generateSmoothPath(coords2);

  // Area paths for gradient fills
  const areaPath1 = `${path1} L ${coords1[coords1.length - 1].x},${paddingTop + chartInnerHeight} L ${coords1[0].x},${paddingTop + chartInnerHeight} Z`;

  const yTicks = [400, 300, 200, 100, 0];

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-[#181B25] border border-slate-200/80 dark:border-[#222736] shadow-sm transition-colors">
      
      {/* Top Header & Period Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Task Done
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-400 mt-0.5">
            Workload delivery and project completion pace
          </p>
        </div>

        {/* Timeframe Toggles */}
        <div className="inline-flex items-center p-1 rounded-full bg-slate-100 dark:bg-[#13161F] border border-slate-200/60 dark:border-[#222736]">
          {['Daily', 'Weekly', 'Monthly'].map((period) => (
            <button
              key={period}
              onClick={() => onPeriodChange(period)}
              className={`px-3 py-1 text-xs font-semibold rounded-full transition-all duration-150 ${
                activePeriod === period
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Chart Container */}
      <div className="relative w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full min-w-[500px] h-auto overflow-visible select-none"
        >
          <defs>
            {/* Gradient Violet */}
            <linearGradient id="gradientViolet" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#818CF8" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#818CF8" stopOpacity="0.0" />
            </linearGradient>

            {/* Glowing drop shadow filter */}
            <filter id="lineGlow1" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#6366F1" floodOpacity="0.4" />
            </filter>
            <filter id="lineGlow2" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#06B6D4" floodOpacity="0.4" />
            </filter>
          </defs>

          {/* Horizontal Grid Lines & Y-Axis Labels */}
          {yTicks.map((tick) => {
            const y = paddingTop + chartInnerHeight - (tick / maxVal) * chartInnerHeight;
            return (
              <g key={tick} className="transition-opacity">
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={svgWidth - paddingRight}
                  y2={y}
                  stroke="currentColor"
                  strokeDasharray="4 4"
                  className="text-slate-100 dark:text-[#252B3C]"
                  strokeWidth="1"
                />
                <text
                  x={paddingLeft - 14}
                  y={y + 4}
                  textAnchor="end"
                  className="fill-slate-400 dark:fill-slate-400 text-[11px] font-medium"
                >
                  {tick}
                </text>
              </g>
            );
          })}

          {/* Area fill for primary violet series */}
          <path d={areaPath1} fill="url(#gradientViolet)" />

          {/* Line 1: Violet/Indigo Curve */}
          <path
            d={path1}
            fill="none"
            stroke="#6366F1"
            strokeWidth="3"
            strokeLinecap="round"
            filter="url(#lineGlow1)"
          />

          {/* Line 2: Cyan Curve */}
          <path
            d={path2}
            fill="none"
            stroke="#06B6D4"
            strokeWidth="2.5"
            strokeLinecap="round"
            filter="url(#lineGlow2)"
          />

          {/* Hover guideline and tooltips */}
          {hoverIndex !== null && (
            <g>
              <line
                x1={coords1[hoverIndex].x}
                y1={paddingTop}
                x2={coords1[hoverIndex].x}
                y2={paddingTop + chartInnerHeight}
                stroke="#6366F1"
                strokeWidth="1.5"
                strokeDasharray="3 3"
                opacity="0.7"
              />
              {/* Point 1 */}
              <circle
                cx={coords1[hoverIndex].x}
                cy={coords1[hoverIndex].y}
                r="6"
                fill="#6366F1"
                stroke="#fff"
                strokeWidth="2"
              />
              {/* Point 2 */}
              <circle
                cx={coords2[hoverIndex].x}
                cy={coords2[hoverIndex].y}
                r="5"
                fill="#06B6D4"
                stroke="#fff"
                strokeWidth="2"
              />
            </g>
          )}

          {/* X-Axis Labels & Hover Hitboxes */}
          {categories.map((cat, idx) => {
            const x = coords1[idx]?.x || 0;
            return (
              <g
                key={cat}
                onMouseEnter={() => setHoverIndex(idx)}
                onMouseLeave={() => setHoverIndex(null)}
                className="cursor-pointer"
              >
                {/* Invisible hover hitbox */}
                <rect
                  x={x - 25}
                  y={paddingTop}
                  width="50"
                  height={chartInnerHeight + paddingBottom}
                  fill="transparent"
                />
                <text
                  x={x}
                  y={paddingTop + chartInnerHeight + 24}
                  textAnchor="middle"
                  className={`text-[12px] font-medium transition-colors ${
                    hoverIndex === idx
                      ? 'fill-indigo-600 dark:fill-indigo-400 font-bold'
                      : 'fill-slate-400 dark:fill-slate-400'
                  }`}
                >
                  {cat}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Floating Tooltip Box */}
        {hoverIndex !== null && (
          <div
            className="absolute top-2 pointer-events-none transform -translate-x-1/2 px-3 py-1.5 rounded-xl bg-slate-900/90 text-white dark:bg-[#1E2333]/95 dark:text-white border border-slate-700 dark:border-[#32394E] shadow-xl text-xs flex items-center gap-3"
            style={{
              left: `${(coords1[hoverIndex].x / svgWidth) * 100}%`
            }}
          >
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              <span>Target: <strong>{series1[hoverIndex]}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>Done: <strong>{series2[hoverIndex]}</strong></span>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

