import React from 'react';
import { Sparkles, Trophy, Flame, CheckCircle2, ArrowRight, Layers } from 'lucide-react';
import { UserProfile } from '../../types';

interface FirstSolveModalProps {
  isOpen: boolean;
  currentUser: UserProfile;
  onContinue: () => void;
}

export const FirstSolveModal: React.FC<FirstSolveModalProps> = ({
  isOpen,
  currentUser,
  onContinue
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-in fade-in duration-300">
      <div 
        className="glass-panel relative w-full max-w-md overflow-hidden rounded-3xl border border-amber-400/30 bg-[#0c0c11] p-6 sm:p-8 text-center shadow-[0_30px_90px_-20px_rgba(245,158,11,0.25)] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle Ambient Radial Glow */}
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-48 w-48 rounded-full bg-amber-500/20 blur-3xl" />

        {/* Badge Icon */}
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500/20 to-amber-400/10 border border-amber-400/30 text-amber-400 shadow-lg shadow-amber-500/15">
          <Trophy className="h-8 w-8 stroke-[1.75]" />
        </div>

        {/* Section 15 Required Headers */}
        <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-amber-400 mb-1">
          FIRST SOLVE
        </p>

        <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
          Your coding journey has officially begun.
        </h2>

        <p className="text-xs text-white/60 mb-6">
          You earned your foundational milestones and unlocked the active CodeSpark roadmap.
        </p>

        {/* Reward Pill */}
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-4 py-1.5 text-xs font-bold text-amber-300 mb-6 shadow-sm">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Reward: +100 XP</span>
        </div>

        {/* Section 15 Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-8 text-left">
          {/* Problems Solved */}
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-3.5">
            <div className="flex items-center justify-between text-white/50 text-[11px] mb-1">
              <span>Problems Solved</span>
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            </div>
            <div className="font-display text-2xl font-bold text-white">
              {currentUser.solvedProblemIds.length || 1}
            </div>
          </div>

          {/* XP */}
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-3.5">
            <div className="flex items-center justify-between text-white/50 text-[11px] mb-1">
              <span>Total XP</span>
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            </div>
            <div className="font-display text-2xl font-bold text-amber-400">
              {currentUser.xp || 100}
            </div>
          </div>

          {/* Streak */}
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-3.5">
            <div className="flex items-center justify-between text-white/50 text-[11px] mb-1">
              <span>Streak</span>
              <Flame className="h-3.5 w-3.5 text-amber-400" />
            </div>
            <div className="font-display text-xl font-bold text-white">
              1 Day
            </div>
          </div>

          {/* Roadmap */}
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-3.5">
            <div className="flex items-center justify-between text-white/50 text-[11px] mb-1">
              <span>Roadmap</span>
              <Layers className="h-3.5 w-3.5 text-cyan-400" />
            </div>
            <div className="font-display text-sm font-bold text-cyan-300 mt-1">
              1 step completed
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <button
          onClick={onContinue}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 py-3.5 text-xs font-bold uppercase tracking-wider text-black shadow-lg shadow-amber-500/25 hover:scale-[1.01] active:scale-[0.99] transition-transform"
        >
          <span>Continue Journey →</span>
          <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
