import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, ServerCrash, Cpu, CheckCircle, RefreshCw } from 'lucide-react';
import { generateRoadmapAPI } from '../services/api';
import { generateRoadmap } from '../services/roadmapGenerator';
import ProgressBar from './ProgressBar';

export default function GoalForm() {
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [apiError, setApiError] = useState(null);
  const navigate = useNavigate();

  const suggestions = [
    "Learn React in 30 Days",
    "Prepare for a Marathon",
    "Launch a SaaS Startup",
    "Master Backend Development"
  ];

  const steps = [
    { title: "Connecting", text: "Connecting to API at http://localhost:5000/api/generate...", icon: Cpu },
    { title: "Analyzing", text: "Analyzing your goal and estimating milestones...", icon: Sparkles },
    { title: "Structuring", text: "Structuring weekly checklists and daily habits...", icon: ArrowRight },
    { title: "Finalizing", text: "Saving roadmap to localStorage and launching dashboard...", icon: CheckCircle }
  ];

  // Animate the loading steps for rich aesthetics
  useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        setLoadingStep((prev) => {
          if (prev < steps.length - 1) {
            return prev + 1;
          }
          return prev;
        });
      }, 700);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!goal.trim()) return;

    setLoading(true);
    setApiError(null);

    try {
      // Call the API service using Axios POST http://localhost:5000/api/generate
      const data = await generateRoadmapAPI(goal);
      
      // Save data returning from API (which is formatted as { monthly: [], weekly: [], daily: [] })
      data.isMock = false;
      localStorage.setItem('goal_os_roadmap', JSON.stringify(data));
      
      setLoadingStep(3);
      setTimeout(() => {
        setLoading(false);
        navigate('/dashboard');
      }, 800);

    } catch (err) {
      console.warn("Axios API call failed. Directing to error fallback UI.", err.message);
      setLoading(false);
      setApiError({
        message: err.message || "Network Error: Could not connect to API server.",
        goal: goal
      });
    }
  };

  const handleSuggestionClick = (suggestion) => {
    if (!loading) {
      setGoal(suggestion);
    }
  };

  // 1. Fallback UI if API fails
  if (apiError) {
    return (
      <div className="w-full max-w-xl mx-auto glass-panel p-8 rounded-2xl border border-red-500/25 shadow-2xl relative overflow-hidden animate-fadeIn">
        <div className="absolute inset-0 bg-gradient-to-tr from-red-500/5 via-transparent to-transparent pointer-events-none" />
        
        <div className="flex flex-col items-center text-center space-y-6 relative z-10">
          <div className="p-4 bg-red-500/10 rounded-full border border-red-500/30 text-red-400">
            <ServerCrash className="w-8 h-8" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-100">API Connection Failed</h3>
            <p className="text-slate-400 text-sm max-w-md">
              Could not connect to the local Goal OS backend at <code className="text-indigo-300 font-mono text-xs">http://localhost:5000/api/generate</code>.
            </p>
            <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-900 mt-2 text-left">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Error Details</span>
              <p className="text-xs text-red-400 font-mono break-all mt-1">{apiError.message}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full pt-2">
            <button
              onClick={() => {
                setApiError(null);
                handleSubmit({ preventDefault: () => {} });
              }}
              className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold rounded-xl border border-slate-800 transition-all cursor-pointer flex items-center justify-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry Connection</span>
            </button>
            <button
              onClick={() => {
                // Generate locally in offline mode using updated format
                const localData = generateRoadmap(apiError.goal);
                localData.isMock = true;
                localStorage.setItem('goal_os_roadmap', JSON.stringify(localData));
                navigate('/dashboard');
              }}
              className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold rounded-xl shadow-lg border border-indigo-500/20 transition-all cursor-pointer flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Demo Mode (Offline)</span>
            </button>
          </div>
          
          <button
            onClick={() => setApiError(null)}
            className="text-xs text-slate-500 hover:text-slate-350 transition-colors cursor-pointer underline"
          >
            Go Back to Input Form
          </button>
        </div>
      </div>
    );
  }

  // 2. Loading animation state during generation process
  if (loading) {
    const CurrentIcon = steps[loadingStep].icon;
    const progressVal = ((loadingStep + 1) / steps.length) * 100;

    return (
      <div className="w-full max-w-xl mx-auto glass-panel p-8 rounded-2xl border border-indigo-500/20 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 via-transparent to-cyan-500/5 pointer-events-none" />
        
        <div className="flex flex-col items-center text-center space-y-6 relative z-10">
          <div className="p-4 bg-indigo-500/10 rounded-full border border-indigo-500/30 animate-pulse">
            <CurrentIcon className="w-8 h-8 text-indigo-400" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-100">
              Generating plan: <span className="text-indigo-400 font-semibold">{steps[loadingStep].title}</span>
            </h3>
            <p className="text-slate-400 text-sm h-12 flex items-center justify-center max-w-md">
              {steps[loadingStep].text}
            </p>
          </div>

          <ProgressBar 
            value={progressVal} 
            showPercentage={true} 
            color="indigo" 
            className="w-full my-4" 
          />

          <div className="flex space-x-1 justify-center items-center text-xs text-slate-500">
            {steps.map((_, index) => (
              <div 
                key={index} 
                className={`h-1.5 w-8 rounded-full transition-all duration-300 ${
                  index <= loadingStep ? 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]' : 'bg-slate-800'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto space-y-6">
      <form onSubmit={handleSubmit} className="glass-panel p-8 rounded-2xl border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/2 via-transparent to-cyan-500/2 pointer-events-none" />
        
        <div className="space-y-6 relative z-10">
          <div className="space-y-2">
            <label htmlFor="goal-input" className="block text-sm font-semibold tracking-wide uppercase text-indigo-400">
              What is your destination?
            </label>
            <p className="text-xs text-slate-400">
              State your ambition clearly. Include timelines or difficulty for better results.
            </p>
          </div>

          <div className="relative">
            <input
              id="goal-input"
              type="text"
              required
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g., Learn React in 30 days to build software"
              className="w-full px-5 py-4 bg-slate-950/80 border border-slate-850 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all font-medium pr-12 shadow-inner"
            />
            <button
              type="submit"
              disabled={!goal.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white rounded-lg transition-all shadow-[0_0_10px_rgba(99,102,241,0.3)] disabled:shadow-none cursor-pointer flex items-center justify-center disabled:cursor-not-allowed group"
            >
              <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="pt-2 flex justify-between items-center">
            <button
              type="submit"
              disabled={!goal.trim()}
              className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:from-slate-800 disabled:to-slate-800/90 text-white font-bold rounded-xl shadow-lg hover:shadow-indigo-500/20 transition-all cursor-pointer flex items-center justify-center space-x-2 border border-indigo-500/10 disabled:cursor-not-allowed"
            >
              <Sparkles className="w-5 h-5" />
              <span>Generate Plan</span>
            </button>
          </div>
        </div>
      </form>

      {/* Suggested prompts cards */}
      <div className="space-y-3">
        <span className="text-xs font-semibold tracking-wide uppercase text-slate-500 block">
          Stuck? Try one of these:
        </span>
        <div className="grid grid-cols-2 gap-3">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSuggestionClick(suggestion)}
              className="px-4 py-3 bg-slate-900/60 hover:bg-indigo-950/30 border border-slate-800/80 hover:border-indigo-500/30 text-slate-300 hover:text-indigo-300 text-left text-sm rounded-xl transition-all duration-300 cursor-pointer shadow-sm hover:shadow-[0_0_12px_rgba(99,102,241,0.05)]"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
