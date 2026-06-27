/**
 * CalendarPanel.jsx
 * Shows: start date picker, week-by-week date ranges, today highlight,
 * and completed week tick marks.
 */
import React, { useState } from 'react';
import { Calendar, CheckCircle2, Clock } from 'lucide-react';

const CalendarPanel = ({ weeks = [], startDate, onStartDateChange }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Build date range for each week given a start date
  const getWeekRange = (weekIndex) => {
    if (!startDate) return null;
    const start = new Date(startDate);
    start.setDate(start.getDate() + weekIndex * 7);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    return { start, end };
  };

  const formatDate = (date) =>
    date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const isCurrentWeek = (weekIndex) => {
    if (!startDate) return false;
    const range = getWeekRange(weekIndex);
    return today >= range.start && today <= range.end;
  };

  const isPastWeek = (weekIndex) => {
    if (!startDate) return false;
    const range = getWeekRange(weekIndex);
    return today > range.end;
  };

  const isWeekCompleted = (week) =>
    week.tasks?.length > 0 && week.tasks.every((t) => t.completed);

  // End date = start + (weeks * 7) - 1 day
  const endDate = startDate
    ? (() => {
        const d = new Date(startDate);
        d.setDate(d.getDate() + weeks.length * 7 - 1);
        return d;
      })()
    : null;

  return (
    <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-5 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5" />
          Goal Calendar
        </h3>
        {endDate && (
          <span className="text-[10px] text-slate-500 font-semibold">
            Ends {formatDate(endDate)}
          </span>
        )}
      </div>

      {/* Start Date Picker */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Start Date
        </label>
        <input
          type="date"
          value={startDate ? startDate.toISOString().split('T')[0] : ''}
          onChange={(e) => {
            if (e.target.value) {
              const d = new Date(e.target.value);
              d.setHours(0, 0, 0, 0);
              onStartDateChange(d);
            }
          }}
          className="w-full bg-slate-950/60 border border-slate-800 hover:border-indigo-500/40 focus:border-indigo-500/60 
                     text-slate-300 text-xs rounded-lg px-3 py-2 outline-none transition-colors cursor-pointer
                     [color-scheme:dark]"
        />
      </div>

      {/* Week list */}
      <div className="space-y-2 max-h-64 overflow-y-auto pr-1 scrollbar-thin">
        {weeks.map((week, i) => {
          const range      = getWeekRange(i);
          const current    = isCurrentWeek(i);
          const past       = isPastWeek(i);
          const completed  = isWeekCompleted(week);
          const tasksDone  = week.tasks?.filter((t) => t.completed).length || 0;
          const tasksTotal = week.tasks?.length || 0;

          return (
            <div
              key={week.id}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all
                ${current
                  ? 'bg-indigo-500/10 border-indigo-500/30 shadow-[0_0_12px_rgba(99,102,241,0.1)]'
                  : completed
                  ? 'bg-emerald-500/5 border-emerald-500/20'
                  : past
                  ? 'bg-slate-900/30 border-slate-900/60 opacity-60'
                  : 'bg-slate-900/20 border-slate-900/40'
                }`}
            >
              {/* Week number bubble */}
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0
                  ${completed
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : current
                    ? 'bg-indigo-500/20 text-indigo-400'
                    : 'bg-slate-800 text-slate-500'
                  }`}
              >
                {completed ? '✓' : i + 1}
              </div>

              {/* Week info */}
              <div className="flex-1 min-w-0">
                <p className={`text-[11px] font-bold truncate ${current ? 'text-indigo-300' : completed ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {week.title.replace(/^Week \d+:\s*/, '')}
                </p>
                {range && (
                  <p className="text-[10px] text-slate-600 font-medium">
                    {formatDate(range.start)} – {formatDate(range.end)}
                  </p>
                )}
              </div>

              {/* Task count / current badge */}
              <div className="flex-shrink-0 text-right">
                {current && (
                  <span className="text-[9px] font-black uppercase text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded-md block mb-0.5">
                    NOW
                  </span>
                )}
                <span className={`text-[10px] font-bold ${completed ? 'text-emerald-400' : 'text-slate-600'}`}>
                  {tasksDone}/{tasksTotal}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 pt-1 border-t border-slate-900/60">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-indigo-500" />
          <span className="text-[10px] text-slate-600">Current</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-[10px] text-slate-600">Done</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-slate-700" />
          <span className="text-[10px] text-slate-600">Upcoming</span>
        </div>
      </div>
    </div>
  );
};

export default CalendarPanel;