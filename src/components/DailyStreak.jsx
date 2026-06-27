/**
 * DailyStreak.jsx
 * Shows: today's daily habit checkboxes, streak counter, and
 * last-7-days mini heatmap.
 *
 * Daily habits auto-reset at midnight — each day's completion
 * is logged separately in localStorage under 'goal_os_streak'.
 */
import React, { useEffect, useState } from 'react';
import { Flame, CheckCircle2, Circle } from 'lucide-react';

const STREAK_KEY = 'goal_os_streak';

// Returns "YYYY-MM-DD" for any Date
const toDateKey = (date) => date.toISOString().split('T')[0];

const loadStreak = () => {
  try {
    return JSON.parse(localStorage.getItem(STREAK_KEY)) || {};
  } catch {
    return {};
  }
};

const saveStreak = (data) =>
  localStorage.setItem(STREAK_KEY, JSON.stringify(data));

// Count consecutive days ending today that are fully completed
const calcStreak = (log) => {
  let streak = 0;
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  while (true) {
    const key = toDateKey(d);
    if (log[key]?.allDone) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
};

const DailyStreak = ({ dailyTasks = [], onToggleDailyTask }) => {
  const todayKey = toDateKey(new Date());
  const [streakLog, setStreakLog] = useState(loadStreak);

  // Whenever tasks change, update today's log entry
  useEffect(() => {
    if (!dailyTasks.length) return;
    const allDone = dailyTasks.every((t) => t.completed);
    const updated = {
      ...streakLog,
      [todayKey]: { allDone, completedCount: dailyTasks.filter((t) => t.completed).length, total: dailyTasks.length }
    };
    setStreakLog(updated);
    saveStreak(updated);
  }, [dailyTasks]);

  const streak = calcStreak(streakLog);

  // Last 7 days for mini heatmap
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    d.setHours(0, 0, 0, 0);
    const key  = toDateKey(d);
    const log  = streakLog[key];
    const isToday = key === todayKey;
    return {
      key,
      label: d.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0),
      allDone: log?.allDone || false,
      partial: log && !log.allDone && log.completedCount > 0,
      isToday
    };
  });

  const completedToday = dailyTasks.filter((t) => t.completed).length;
  const totalToday     = dailyTasks.length;
  const allDoneToday   = completedToday === totalToday && totalToday > 0;

  return (
    <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-5 shadow-lg">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
          <Flame className="w-3.5 h-3.5" />
          Daily Progress
        </h3>
        {/* Streak badge */}
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-black
          ${streak > 0
            ? 'bg-orange-500/10 border-orange-500/30 text-orange-400'
            : 'bg-slate-900/60 border-slate-800 text-slate-600'
          }`}>
          <Flame className={`w-3 h-3 ${streak > 0 ? 'text-orange-400' : 'text-slate-600'}`} />
          {streak} day streak
        </div>
      </div>

      {/* 7-day heatmap */}
      <div className="space-y-1.5">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Last 7 Days</p>
        <div className="flex gap-1.5">
          {last7.map((day) => (
            <div key={day.key} className="flex flex-col items-center gap-1 flex-1">
              <div
                className={`w-full aspect-square rounded-md border transition-all
                  ${day.allDone
                    ? 'bg-emerald-500/30 border-emerald-500/50'
                    : day.partial
                    ? 'bg-indigo-500/20 border-indigo-500/30'
                    : day.isToday
                    ? 'bg-slate-800 border-slate-700 ring-1 ring-indigo-500/40'
                    : 'bg-slate-900/60 border-slate-900'
                  }`}
              />
              <span className={`text-[9px] font-bold ${day.isToday ? 'text-indigo-400' : 'text-slate-700'}`}>
                {day.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Today's habits */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Today's Habits</p>
          <span className={`text-[10px] font-bold ${allDoneToday ? 'text-emerald-400' : 'text-slate-600'}`}>
            {completedToday}/{totalToday} done
          </span>
        </div>

        {dailyTasks.map((task) => (
          <button
            key={task.id}
            onClick={() => onToggleDailyTask(task.id)}
            className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-xl border text-left transition-all cursor-pointer group
              ${task.completed
                ? 'bg-emerald-500/8 border-emerald-500/20 hover:border-emerald-500/30'
                : 'bg-slate-900/30 border-slate-900/60 hover:border-slate-700'
              }`}
          >
            {task.completed
              ? <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              : <Circle className="w-4 h-4 text-slate-600 flex-shrink-0 mt-0.5 group-hover:text-slate-400 transition-colors" />
            }
            <span className={`text-xs leading-snug font-medium transition-colors
              ${task.completed ? 'text-slate-500 line-through' : 'text-slate-300'}`}>
              {task.title}
            </span>
          </button>
        ))}
      </div>

      {/* All done banner */}
      {allDoneToday && (
        <div className="flex items-center gap-2 px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
          <span className="text-lg">🔥</span>
          <span className="text-xs font-bold text-emerald-400">All habits done today! Keep the streak alive.</span>
        </div>
      )}
    </div>
  );
};

export default DailyStreak;