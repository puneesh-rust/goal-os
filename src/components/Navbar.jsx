import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Target, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const hasActiveGoal = !!localStorage.getItem('goal_os_roadmap');

  return (
    <nav className="glass-panel sticky top-0 z-50 border-b border-slate-900/80 px-6 py-3.5 backdrop-blur-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2.5 group">
          <div className="p-2 bg-indigo-600/10 rounded-xl border border-indigo-500/20 group-hover:border-indigo-500/50 transition-colors shadow-[0_0_15px_rgba(99,102,241,0.05)]">
            <Target className="w-5 h-5 text-indigo-400 group-hover:rotate-12 transition-transform duration-300" />
          </div>
          <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-slate-100 via-indigo-100 to-indigo-300 bg-clip-text text-transparent">
            Goal <span className="text-indigo-400">OS</span>
          </span>
        </Link>

        <div className="flex items-center space-x-4">
          {hasActiveGoal && location.pathname !== '/dashboard' && (
            <Link
              to="/dashboard"
              className="px-4 py-2 text-xs font-semibold tracking-wide uppercase bg-slate-900 hover:bg-indigo-950/20 text-indigo-400 border border-indigo-500/20 hover:border-indigo-500/40 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm hover:shadow-[0_0_12px_rgba(99,102,241,0.05)]"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Go to Dashboard</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
