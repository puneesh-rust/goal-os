import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Trophy, Clock, Brain, RefreshCw, Sparkles, CheckCircle2, ChevronLeft, AlertCircle, Calendar } from 'lucide-react';
import confetti from 'canvas-confetti';
import RoadmapCard from '../components/RoadmapCard';
import ProgressBar from '../components/ProgressBar';

export default function Dashboard() {
  const [roadmap, setRoadmap] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const navigate = useNavigate();

  // Simulated fetching from localStorage to showcase loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      const savedData = localStorage.getItem('goal_os_roadmap');
      if (savedData) {
        try {
          setRoadmap(JSON.parse(savedData));
        } catch (err) {
          console.error("Failed to parse saved roadmap data", err);
          localStorage.removeItem('goal_os_roadmap');
        }
      }
      setInitialLoading(false);
    }, 1200); // 1.2s realistic loading transition

    return () => clearTimeout(timer);
  }, []);

  // 1. Loading state if data is being fetched / checked
  if (initialLoading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-8 animate-pulse">
        <div className="flex justify-between items-center border-b border-slate-900 pb-6">
          <div className="space-y-3">
            <div className="h-4 w-24 bg-slate-900 rounded" />
            <div className="h-8 w-64 bg-slate-900 rounded" />
          </div>
          <div className="h-10 w-28 bg-slate-900 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-6 lg:col-span-1">
            <div className="h-64 bg-slate-900 rounded-2xl border border-slate-900" />
            <div className="h-44 bg-slate-900 rounded-xl border border-slate-900" />
          </div>
          <div className="lg:col-span-2 space-y-6">
            <div className="h-8 w-32 bg-slate-900 rounded" />
            <div className="space-y-5">
              <div className="h-44 bg-slate-900 rounded-2xl border border-slate-900" />
              <div className="h-44 bg-slate-900 rounded-2xl border border-slate-900" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. Fallback UI if data is still not available after checking
  if (!roadmap) {
    return (
      <div className="min-h-[calc(100vh-69px)] flex flex-col items-center justify-center px-6 text-center space-y-6">
        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-full text-slate-400">
          <AlertCircle className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-slate-200">No Active Goal Found</h3>
          <p className="text-slate-400 max-w-sm">
            You haven't generated a plan yet. Let's define your first target!
          </p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center space-x-2"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Create a Goal</span>
        </button>
      </div>
    );
  }

  // Calculate overall weekly stats
  const allWeeklyTasks = roadmap.weekly.flatMap(w => w.tasks);
  const totalWeeklyTasks = allWeeklyTasks.length;
  const completedWeeklyTasks = allWeeklyTasks.filter(t => t.completed).length;
  const weeklyProgress = totalWeeklyTasks > 0 ? (completedWeeklyTasks / totalWeeklyTasks) * 100 : 0;

  // Calculate daily stats
  const totalDailyTasks = roadmap.daily?.length || 0;
  const completedDailyTasks = roadmap.daily?.filter(t => t.completed).length || 0;
  const dailyProgress = totalDailyTasks > 0 ? (completedDailyTasks / totalDailyTasks) * 100 : 0;

  // Total tasks (weekly + daily)
  const totalTasksCombined = totalWeeklyTasks + totalDailyTasks;
  const completedTasksCombined = completedWeeklyTasks + completedDailyTasks;
  const overallProgress = totalTasksCombined > 0 ? (completedTasksCombined / totalTasksCombined) * 100 : 0;
  const isGoalCompleted = overallProgress === 100;

  // Toggle Weekly checklist item
  const handleToggleWeeklyTask = (weekId, taskId) => {
    const updatedWeekly = roadmap.weekly.map((week) => {
      if (week.id === weekId) {
        const weekTasks = week.tasks.map((task) => {
          if (task.id === taskId) {
            const nextCompleted = !task.completed;
            
            // Trigger check confetti
            if (nextCompleted) {
              confetti({ particleCount: 20, angle: 60, spread: 55, origin: { x: 0 } });
              confetti({ particleCount: 20, angle: 120, spread: 55, origin: { x: 1 } });
            }

            return { ...task, completed: nextCompleted };
          }
          return task;
        });

        // Check if this action completed the current week
        const wasCompletedBefore = week.tasks.every(t => t.completed);
        const isCompletedNow = weekTasks.every(t => t.completed);

        if (!wasCompletedBefore && isCompletedNow) {
          setTimeout(() => {
            confetti({
              particleCount: 80,
              spread: 60,
              origin: { y: 0.6 }
            });
          }, 200);
        }

        return { ...week, tasks: weekTasks };
      }
      return week;
    });

    const updatedRoadmap = { ...roadmap, weekly: updatedWeekly };
    saveAndCheckCelebration(updatedRoadmap);
  };

  // Toggle Daily habit checklist item
  const handleToggleDailyTask = (taskId) => {
    const updatedDaily = roadmap.daily.map((task) => {
      if (task.id === taskId) {
        const nextCompleted = !task.completed;
        
        if (nextCompleted) {
          confetti({
            particleCount: 15,
            spread: 40,
            origin: { y: 0.8 }
          });
        }
        return { ...task, completed: nextCompleted };
      }
      return task;
    });

    const updatedRoadmap = { ...roadmap, daily: updatedDaily };
    saveAndCheckCelebration(updatedRoadmap);
  };

  const saveAndCheckCelebration = (updatedRoadmap) => {
    setRoadmap(updatedRoadmap);
    localStorage.setItem('goal_os_roadmap', JSON.stringify(updatedRoadmap));

    // Calculate next state stats
    const nextWeeks = updatedRoadmap.weekly.flatMap(w => w.tasks).filter(t => t.completed).length;
    const nextDaily = updatedRoadmap.daily.filter(t => t.completed).length;
    const totalGoalTasks = updatedRoadmap.weekly.flatMap(w => w.tasks).length + updatedRoadmap.daily.length;

    // Trigger full fireworks if 100% complete
    if (nextWeeks + nextDaily === totalGoalTasks && (completedWeeklyTasks + completedDailyTasks !== totalGoalTasks)) {
      setTimeout(() => {
        const duration = 3 * 1000;
        const end = Date.now() + duration;

        (function frame() {
          confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 } });
          confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 } });
          
          if (Date.now() < end) {
            requestAnimationFrame(frame);
          }
        }());
      }, 300);
    }
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset your active goal? All progress will be deleted.")) {
      localStorage.removeItem('goal_os_roadmap');
      navigate('/');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-8 animate-fadeIn relative">
      <div className="absolute top-10 left-1/3 w-72 h-72 bg-indigo-500/5 rounded-full blur-[85px] pointer-events-none" />

      {/* Back button actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-indigo-400 transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Edit Goal</span>
        </button>

        {roadmap.isMock && (
          <span className="px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 rounded-full text-xs font-semibold animate-pulse">
            Local Simulation Mode
          </span>
        )}
      </div>

      {/* Goal Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-900/80">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 uppercase tracking-wide flex items-center gap-1">
              <Target className="w-3.5 h-3.5" />
              {roadmap.category || "General Goal"}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 leading-tight">
            {roadmap.goal}
          </h2>
        </div>

        <button
          onClick={handleReset}
          className="px-4 py-2.5 bg-slate-950/80 hover:bg-rose-950/10 border border-slate-900 hover:border-rose-500/30 text-slate-400 hover:text-rose-400 rounded-xl transition-all text-sm font-semibold flex items-center gap-2 cursor-pointer self-start md:self-auto"
        >
          <RefreshCw className="w-4 h-4" />
          <span>New Goal OS</span>
        </button>
      </div>

      {/* Grid Layout containing sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Progress summary card & stats */}
        <div className="space-y-6 lg:col-span-1">
          
          {/* Section A: Overall Progress Circular gauge */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col items-center text-center space-y-6 relative overflow-hidden shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent pointer-events-none" />
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Overall Completion</h3>
            
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" strokeWidth="8" stroke="rgba(15, 23, 42, 0.8)" fill="transparent" className="stroke-slate-950" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  strokeWidth="8"
                  stroke={isGoalCompleted ? '#10b981' : '#6366f1'}
                  strokeDasharray={2 * Math.PI * 40}
                  strokeDashoffset={2 * Math.PI * 40 * (1 - overallProgress / 100)}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-700 ease-out"
                  style={{ filter: isGoalCompleted ? 'drop-shadow(0 0 8px rgba(16,185,129,0.4))' : 'drop-shadow(0 0 8px rgba(99,102,241,0.4))' }}
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className={`text-3xl font-black ${isGoalCompleted ? 'text-emerald-400' : 'text-slate-100'}`}>
                  {Math.round(overallProgress)}%
                </span>
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                  {completedTasksCombined}/{totalTasksCombined} Active items
                </span>
              </div>
            </div>
          </div>

          {/* Quick stats details card */}
          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4 shadow-lg">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400">OS Metrics</h3>
            <div className="space-y-3.5 text-xs text-slate-300">
              <div className="flex justify-between items-center pb-2 border-b border-slate-900/60">
                <span className="text-slate-400">Total Duration:</span>
                <span className="font-bold text-slate-200">{roadmap.estimatedTime}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-900/60">
                <span className="text-slate-400">Difficulty Grade:</span>
                <span className="font-bold text-slate-200">{roadmap.difficulty}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Category Tag:</span>
                <span className="font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">{roadmap.category || "General"}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Unified RoadmapCard showing all 3 sections */}
        <div className="lg:col-span-2 space-y-6">
          <RoadmapCard 
            monthlyPlan={roadmap.monthly?.[0]}
            weeks={roadmap.weekly}
            dailyTasks={roadmap.daily}
            estimatedTime={roadmap.estimatedTime}
            difficulty={roadmap.difficulty}
            onToggleWeeklyTask={handleToggleWeeklyTask}
            onToggleDailyTask={handleToggleDailyTask}
          />
        </div>

      </div>
    </div>
  );
}
