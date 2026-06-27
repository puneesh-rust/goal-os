import React from 'react';

/**
 * ProgressBar Component
 * Renders a customizable progress bar with gradient and glow effects.
 * 
 * @param {object} props
 * @param {number} props.value - Percentage of progress (0-100).
 * @param {string} [props.label] - Left-aligned text label.
 * @param {boolean} [props.showPercentage=true] - Whether to show the numeric percentage text.
 * @param {string} [props.className=""] - Additional class styling.
 * @param {'indigo'|'cyan'|'emerald'|'rose'} [props.color="indigo"] - Theme color variation.
 */
export default function ProgressBar({
  value = 0,
  label = '',
  showPercentage = true,
  className = '',
  color = 'indigo'
}) {
  const percentage = Math.min(100, Math.max(0, Math.round(value)));
  
  const colorMap = {
    indigo: 'bg-gradient-to-r from-indigo-500 to-purple-600 shadow-[0_0_12px_rgba(99,102,241,0.4)]',
    cyan: 'bg-gradient-to-r from-cyan-500 to-blue-600 shadow-[0_0_12px_rgba(6,182,212,0.4)]',
    emerald: 'bg-gradient-to-r from-emerald-400 to-teal-600 shadow-[0_0_12px_rgba(16,185,129,0.4)]',
    rose: 'bg-gradient-to-r from-rose-500 to-pink-600 shadow-[0_0_12px_rgba(244,63,94,0.4)]',
  };

  const selectedColor = colorMap[color] || colorMap.indigo;

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-1.5 text-sm font-medium">
          {label && <span className="text-slate-400">{label}</span>}
          {showPercentage && (
            <span className={`font-semibold ${color === 'indigo' ? 'text-indigo-400 text-glow-indigo' : color === 'cyan' ? 'text-cyan-400 text-glow-cyan' : 'text-slate-200'}`}>
              {percentage}%
            </span>
          )}
        </div>
      )}
      <div className="w-full h-2.5 bg-slate-950/80 rounded-full overflow-hidden p-[1px] border border-slate-800/80">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${selectedColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
