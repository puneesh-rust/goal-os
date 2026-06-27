import React from 'react';
import { Calendar, CheckCircle2, Clock, Brain, Trophy } from 'lucide-react';
import ProgressBar from './ProgressBar';
import { calculateDelay } from '../utils/delayCalculator';

/**
 * RoadmapCard Component
 * Encapsulates the 3 main sections: Monthly Plan, Weekly Tasks, and Daily Tasks.
 * Styled with responsive Tailwind card details and spacing.
 * 
 * @param {object} props
 * @param {object} props.monthlyPlan - Description and title of the month's goals.
 * @param {array} props.weeks - List of weekly items with subtasks.
 * @param {array} props.dailyTasks - List of daily checklist items.
 * @param {string} [props.estimatedTime] - Optional estimated duration text.
 * @param {string} [props.difficulty] - Optional difficulty string.
 * @param {function} props.onToggleWeeklyTask - Action triggered on toggling a weekly task.
 * @param {function} props.onToggleDailyTask - Action triggered on toggling a daily task.
 */
export default function RoadmapCard({
  monthlyPlan,
  weeks = [],
  dailyTasks = [],
  estimatedTime = "4 Weeks",
  difficulty = "Medium",
  onToggleWeeklyTask,
  onToggleDailyTask
}) {
  // Stats Calculations
  const allWeeklyTasks = weeks.flatMap(w => w.tasks);
  const totalWeekly = allWeeklyTasks.length;
  const completedWeekly = allWeeklyTasks.filter(t => t.completed).length;
  const weeklyProgress = totalWeekly > 0 ? (completedWeekly / totalWeekly) * 100 : 0;

  const totalDaily = dailyTasks.length;
  const completedDaily = dailyTasks.filter(t => t.completed).length;
  const dailyProgress = totalDaily > 0 ? (completedDaily / totalDaily) * 100 : 0;

  return (
    <div className="space-y-6">
      
      {/* SECTION 1: Monthly Plan Card */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden transition-all hover:border-indigo-500/25 duration-300">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Trophy className="w-20 h-20 text-slate-100" />
        </div>
        
        <div className="flex items-center space-x-2 text-indigo-400 mb-4">
          <Trophy className="w-5 h-5" />
          <h3 className="text-xs font-black uppercase tracking-wider">1. Monthly Plan</h3>
        </div>
        
        <div className="space-y-3">
          <h4 className="text-base sm:text-lg font-bold text-slate-200">
            {monthlyPlan?.title || "Goal Phase Focus"}
          </h4>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            {monthlyPlan?.description || "Establish core mechanics and outline target milestones."}
          </p>
          
          {/* List items detailing the plan guidelines */}
          <ul className="space-y-2 pt-3 border-t border-slate-900/60 text-xs text-slate-400">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
              <span>Maintain daily habits consistency for optimal progress retention.</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
              <span>Verify and resolve previous weeks checks before advancing phase items.</span>
            </li>
          </ul>
        </div>

        <div className="mt-4 pt-3 flex gap-4 text-[10px] sm:text-xs text-slate-400 border-t border-slate-900/60">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>Timeframe: <strong>{estimatedTime}</strong></span>
          </div>
          <div className="flex items-center gap-1">
            <Brain className="w-3.5 h-3.5 text-purple-400" />
            <span>Difficulty: <strong>{difficulty}</strong></span>
          </div>
        </div>
      </div>

      {/* SECTION 2: Weekly Tasks Cards */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex justify-between items-center border-b border-slate-900/60 pb-3">
          <div className="flex items-center space-x-2 text-indigo-400">
            <Calendar className="w-5 h-5" />
            <h3 className="text-xs font-black uppercase tracking-wider">2. Weekly Tasks</h3>
          </div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
            {completedWeekly}/{totalWeekly} Tasks Done
          </span>
        </div>

        <div className="space-y-4">
          {weeks.map((week) => {
            const weekTotal = week.tasks.length;
            const weekCompleted = week.tasks.filter(t => t.completed).length;
            const weekPercent = weekTotal > 0 ? (weekCompleted / weekTotal) * 100 : 0;

            return (
              <div 
                key={week.id} 
                className={`p-4 bg-slate-950/30 border rounded-xl space-y-3 transition-all ${
                  weekPercent === 100 
                    ? 'border-emerald-500/10' 
                    : weekPercent > 0 
                      ? 'border-indigo-500/10' 
                      : 'border-slate-900'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-semibold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded uppercase tracking-wide">
                      {week.duration || "Phase"}
                    </span>
                    <h4 className="text-sm font-bold text-slate-200 mt-1">
                      {week.title}
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {week.description}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500">
                    {weekCompleted}/{weekTotal}
                  </span>
                </div>

                <ProgressBar 
                  value={weekPercent} 
                  showPercentage={false} 
                  color={weekPercent === 100 ? 'emerald' : 'indigo'} 
                />

                {/* Checklist List Items */}
                <div className="space-y-1.5 pt-1">
                  {week.tasks.map((task) => (
                    <label
                      key={task.id}
                      className={`flex items-start p-2 bg-slate-900/20 hover:bg-slate-900/60 border rounded-lg cursor-pointer transition-colors ${
                        task.completed 
                          ? 'border-emerald-500/5 text-slate-500' 
                          : 'border-slate-900 hover:border-slate-800 text-slate-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => onToggleWeeklyTask(week.id, task.id)}
                        className="sr-only"
                      />
                      <div className={`w-3.5 h-3.5 rounded mt-0.5 mr-2 border flex items-center justify-center flex-shrink-0 transition-all ${
                        task.completed 
                          ? 'bg-emerald-500 border-emerald-500 text-slate-950 shadow-[0_0_8px_rgba(16,185,129,0.3)]' 
                          : 'border-slate-700 bg-slate-950'
                      }`}>
                        {task.completed && (
                          <svg className="w-2.5 h-2.5 stroke-2 stroke-current fill-none" viewBox="0 0 24 24">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </div>
                      <span className={`text-xs select-none font-medium leading-tight ${task.completed ? 'line-through decoration-slate-800' : ''}`}>
                        {task.title}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 3: Daily Tasks Card */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex justify-between items-center border-b border-slate-900/60 pb-3">
          <div className="flex items-center space-x-2 text-cyan-400">
            <CheckCircle2 className="w-5 h-5 text-glow-cyan" />
            <h3 className="text-xs font-black uppercase tracking-wider">3. Daily Tasks</h3>
          </div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
            {completedDaily}/{totalDaily} Check
          </span>
        </div>

        <ProgressBar value={dailyProgress} showPercentage={false} color="cyan" />

        {/* Daily Habits List Items */}
        <div className="space-y-2 pt-1 pb-1">
          {dailyTasks.map((task) => (
            <label
              key={task.id}
              className={`flex items-start p-2.5 bg-slate-900/20 hover:bg-slate-900/60 border rounded-xl cursor-pointer transition-colors ${
                task.completed 
                  ? 'border-emerald-500/5 text-slate-500' 
                  : 'border-slate-900 hover:border-slate-800 text-slate-300'
              }`}
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => onToggleDailyTask(task.id)}
                className="sr-only"
              />
              <div className={`w-3.5 h-3.5 rounded mt-0.5 mr-2.5 border flex items-center justify-center flex-shrink-0 transition-all ${
                task.completed 
                  ? 'bg-cyan-500 border-cyan-500 text-slate-950' 
                  : 'border-slate-700 bg-slate-950'
              }`}>
                {task.completed && (
                  <svg className="w-2.5 h-2.5 stroke-2 stroke-current fill-none" viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
              <span className={`text-xs select-none font-medium leading-tight ${task.completed ? 'line-through decoration-slate-800' : ''}`}>
                {task.title}
              </span>
            </label>
          ))}
        </div>

        {/* Daily Smart Progress Warning & Simple Progress Bar */}
        <div className="pt-3 border-t border-slate-900/60 space-y-2.5">
          <div className="flex justify-between items-center text-xs font-bold text-slate-400">
            <span>Daily Tasks Completion Gauge</span>
            <span className={completedDaily === totalDaily ? 'text-emerald-450 font-bold' : 'text-red-500 font-bold animate-pulse'}>
              {Math.round(dailyProgress)}%
            </span>
          </div>
          
          {/* Simple progress bar showing 0-100% */}
          <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-900">
            <div 
              className={`h-full rounded-full transition-all duration-500 ease-out ${
                completedDaily === totalDaily ? 'bg-emerald-500' : 'bg-red-500'
              }`}
              style={{ width: `${dailyProgress}%` }}
            />
          </div>

          {completedDaily < totalDaily && (
            <p className="text-red-500 text-[11px] font-bold tracking-wide mt-1 animate-pulse flex items-center gap-1">
              <span>⚠️</span>
              <span>{calculateDelay(totalDaily - completedDaily).delayMessage}</span>
            </p>
          )}
        </div>
      </div>

    </div>
  );
}
