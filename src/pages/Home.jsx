import React from 'react';
import GoalForm from '../components/GoalForm';
import { Shield, Sparkles, CheckCircle2, TrendingUp } from 'lucide-react';

export default function Home() {
  return (
    <div className="relative min-h-[calc(100vh-69px)] flex flex-col items-center justify-center px-6 py-12 overflow-hidden">
      {/* Dynamic Background Glowing Blobs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl w-full text-center space-y-12 relative z-10">
        {/* Hero Section */}
        <div className="space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider animate-fadeIn">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin" style={{ animationDuration: '3s' }} />
            <span>Next-Gen Roadmap Orchestrator</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
            Architect Your Aspirations with{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent text-glow-indigo">
              Goal OS
            </span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-slate-400 text-base sm:text-lg leading-relaxed font-medium">
            Transform high-level ambitions into a granular, step-by-step master plan. 
            Define your goal, track dynamic milestone metrics, and execute with absolute clarity.
          </p>
        </div>

        {/* GoalForm input block */}
        <div className="animate-fadeIn" style={{ animationDelay: '100ms' }}>
          <GoalForm />
        </div>

        {/* Mini Features Checklist */}
        <div className="pt-8 border-t border-slate-900/60 max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 text-left animate-fadeIn" style={{ animationDelay: '200ms' }}>
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-lg mt-0.5">
              <Shield className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-200">Local Privacy First</h4>
              <p className="text-xs text-slate-400 mt-1">All roadmaps and achievements are saved securely in your browser storage.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-cyan-500/10 border border-cyan-500/20 rounded-lg mt-0.5">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-200">Interactive Checklist</h4>
              <p className="text-xs text-slate-400 mt-1">Break down milestones into manageable tasks and check them off in real-time.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg mt-0.5">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-200">Progress Integration</h4>
              <p className="text-xs text-slate-400 mt-1">Circular dynamic charts aggregate checklist results for immediate visual feedback.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
