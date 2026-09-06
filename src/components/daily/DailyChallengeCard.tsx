import React, { useMemo } from 'react';
import { Flame, CheckCircle2, Clock, ArrowRight, Sparkles, Calendar, Star } from 'lucide-react';
import { UserProfile, Problem } from '../../types';
import { DailyChallengeService } from '../../services/dailyChallengeService';
import { StorageService } from '../../services/storage';

interface DailyChallengeCardProps {
  currentUser: UserProfile;
  onNavigate: (view: string, param?: string) => void;
  compact?: boolean;
}

export const DailyChallengeCard: React.FC<DailyChallengeCardProps> = ({ currentUser, onNavigate, compact = false }) => {
  const today = DailyChallengeService.getToday();
  
  const { problem, isSolvedToday, streakCount } = useMemo(() => {
    const daily = DailyChallengeService.getDailyProblem();
    const records = StorageService.getDailyChallengeRecords(currentUser.id);
    const todayRecord = records[today];
    
    // Count consecutive days of daily challenge solves
    let streak = 0;
    const d = new Date();
    while (true) {
      const ds = d.toISOString().split('T')[0];
      if (records[ds]?.solved) {
        streak++;
        d.setDate(d.getDate() - 1);
      } else {
        break;
      }
    }

    return {
      problem: daily?.problem || null,
      isSolvedToday: !!todayRecord?.solved,
      streakCount: streak
    };
  }, [currentUser.id, today]);

  if (!problem) return null;

  const diffColor = problem.difficulty === 'Easy' ? 'text-emerald-400' : problem.difficulty === 'Medium' ? 'text-amber-400' : 'text-rose-400';

  if (compact) {
    return (
      <button
        onClick={() => onNavigate('workspace', problem.id)}
        className="w-full flex items-center gap-3 rounded-xl border border-amber-500/15 bg-gradient-to-r from-amber-500/[0.06] to-orange-500/[0.04] p-3 hover:border-amber-500/25 transition-all group"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/15 text-amber-400 shrink-0">
          {isSolvedToday ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <Sparkles className="h-4 w-4" />}
        </div>
        <div className="flex-1 text-left">
          <p className="text-xs font-semibold text-white truncate">{problem.title}</p>
          <p className="text-[10px] text-white/40">Daily Challenge · <span className={diffColor}>{problem.difficulty}</span></p>
        </div>
        {isSolvedToday ? (
          <span className="text-[10px] font-semibold text-emerald-400">✓ Done</span>
        ) : (
          <ArrowRight className="h-3.5 w-3.5 text-white/30 group-hover:text-amber-400 transition-colors" />
        )}
      </button>
    );
  }

  return (
    <div className="rounded-2xl border border-amber-500/15 bg-gradient-to-br from-amber-500/[0.06] via-orange-500/[0.04] to-transparent overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400">
              <Calendar className="h-4.5 w-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Daily Challenge</h3>
              <p className="text-[10px] text-white/40">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
            </div>
          </div>
          {streakCount > 0 && (
            <div className="flex items-center gap-1 rounded-full border border-orange-500/20 bg-orange-500/10 px-2.5 py-1">
              <Flame className="h-3 w-3 text-orange-400" />
              <span className="text-[10px] font-bold text-orange-400">{streakCount} day streak</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-base font-bold text-white">{problem.title}</h4>
            <div className="mt-1 flex items-center gap-3 text-[11px] text-white/40">
              <span className={`font-semibold ${diffColor}`}>{problem.difficulty}</span>
              <span>{problem.topic}</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {problem.estimatedTime || '15 min'}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4">
          {isSolvedToday ? (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span className="text-xs font-semibold text-emerald-400">Completed! +50 XP earned</span>
            </div>
          ) : (
            <button
              onClick={() => onNavigate('workspace', problem.id)}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/25 px-4 py-2.5 text-xs font-semibold text-amber-300 hover:from-amber-500/25 hover:to-orange-500/25 transition-all"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Solve Today's Challenge (+50 XP)
            </button>
          )}
        </div>

        {/* Mini Streak Calendar (last 7 days) */}
        <div className="mt-4 flex items-center justify-center gap-1.5">
          {Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            const ds = d.toISOString().split('T')[0];
            const records = StorageService.getDailyChallengeRecords(currentUser.id);
            const wasSolved = records[ds]?.solved;
            const isToday = ds === today;
            return (
              <div
                key={ds}
                className={`h-5 w-5 rounded-sm flex items-center justify-center text-[8px] font-bold transition-all ${
                  wasSolved
                    ? 'bg-emerald-500/30 text-emerald-400 border border-emerald-500/30'
                    : isToday
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-white/[0.04] text-white/20 border border-white/[0.06]'
                }`}
                title={`${d.toLocaleDateString('en-US', { weekday: 'short' })} ${wasSolved ? '✓' : ''}`}
              >
                {d.toLocaleDateString('en-US', { weekday: 'narrow' })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
