import React, { useMemo, useState } from 'react';
import {
  BookOpen, Target, Layers, Zap, Network, ChevronRight, CheckCircle2,
  Circle, Play, Pause, Clock, TrendingUp, ArrowRight, Sparkles, Award
} from 'lucide-react';
import { UserProfile, StudyPlan, UserStudyPlanProgress } from '../../types';
import { STUDY_PLANS_DATA } from '../../data/studyPlans';
import { StorageService } from '../../services/storage';

interface StudyPlansViewProps {
  currentUser: UserProfile;
  onNavigate: (view: string, param?: string) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  BookOpen: <BookOpen className="h-5 w-5" />,
  Target: <Target className="h-5 w-5" />,
  Network: <Network className="h-5 w-5" />,
  Layers: <Layers className="h-5 w-5" />,
  Zap: <Zap className="h-5 w-5" />,
};

const DIFFICULTY_COLORS: Record<string, string> = {
  Beginner: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  Intermediate: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  Advanced: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
  'All Levels': 'text-purple-400 bg-purple-500/10 border-purple-500/20',
};

export const StudyPlansView: React.FC<StudyPlansViewProps> = ({ currentUser, onNavigate }) => {
  const userPlans = useMemo(
    () => StorageService.getUserStudyPlans(currentUser.id),
    [currentUser.id]
  );

  const enrichedPlans = useMemo(() => {
    const solvedIds = new Set(currentUser.solvedProblemIds);
    return STUDY_PLANS_DATA.map(plan => {
      const enrollment = userPlans[plan.id];
      const allProblemIds = plan.sections.flatMap(s => s.problems.map(p => p.problemId));
      const completedCount = allProblemIds.filter(id => solvedIds.has(id)).length;
      const pct = allProblemIds.length > 0 ? Math.round((completedCount / allProblemIds.length) * 100) : 0;
      
      // Find current section and next problem
      let currentSectionTitle = '';
      let nextProblem = undefined;
      for (const section of plan.sections) {
        const unsolvedInSection = section.problems.find(p => !solvedIds.has(p.problemId));
        if (unsolvedInSection) {
          currentSectionTitle = section.title;
          nextProblem = unsolvedInSection;
          break;
        }
      }

      return {
        ...plan,
        isEnrolled: !!enrollment,
        status: enrollment?.status || (completedCount > 0 ? 'active' as const : 'not_started' as const),
        completedProblemsCount: completedCount,
        completionPercentage: pct,
        currentSectionTitle,
        nextProblem
      };
    });
  }, [currentUser.solvedProblemIds, userPlans]);

  const enrolledPlans = enrichedPlans.filter(p => p.isEnrolled && p.status !== 'completed');
  const availablePlans = enrichedPlans.filter(p => !p.isEnrolled || p.status === 'completed');

  const handleEnroll = (planId: string) => {
    const progress: UserStudyPlanProgress = {
      userId: currentUser.id,
      studyPlanId: planId,
      status: 'active',
      enrolledAt: new Date().toISOString(),
      lastPracticedAt: new Date().toISOString()
    };
    StorageService.saveUserStudyPlanProgress(progress);
    window.location.reload(); // Quick refresh to pick up new state
  };

  const handlePause = (planId: string) => {
    const existing = userPlans[planId];
    if (existing) {
      StorageService.saveUserStudyPlanProgress({ ...existing, status: 'paused' });
      window.location.reload();
    }
  };

  const handleResume = (planId: string) => {
    const existing = userPlans[planId];
    if (existing) {
      StorageService.saveUserStudyPlanProgress({ ...existing, status: 'active', lastPracticedAt: new Date().toISOString() });
      window.location.reload();
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="border-b border-white/[0.08] pb-6">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-[11px] font-semibold text-indigo-400">
          <BookOpen className="h-3 w-3" />
          <span>Structured Learning</span>
        </div>
        <h1 className="mt-2.5 font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Study Plans
        </h1>
        <p className="mt-1 text-sm text-white/50 max-w-2xl">
          Curated problem sequences designed to build mastery, from foundations to advanced interview preparation.
        </p>
      </div>

      {/* Active Plans */}
      {enrolledPlans.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Play className="h-4 w-4 text-emerald-400" />
            Active Plans
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {enrolledPlans.map(plan => (
              <div key={plan.id} className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-transparent p-6 hover:border-white/[0.12] transition-all group">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-400">
                      {ICON_MAP[plan.badgeIcon] || <BookOpen className="h-5 w-5" />}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{plan.title}</h3>
                      <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold mt-1 ${DIFFICULTY_COLORS[plan.difficulty]}`}>
                        {plan.difficulty}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => plan.status === 'paused' ? handleResume(plan.id) : handlePause(plan.id)}
                    className="text-white/30 hover:text-white/60 transition-colors"
                    title={plan.status === 'paused' ? 'Resume' : 'Pause'}
                  >
                    {plan.status === 'paused' ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="mt-4 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/50">{plan.completedProblemsCount}/{plan.totalProblems} solved</span>
                    <span className="text-indigo-400 font-bold">{plan.completionPercentage}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                      style={{ width: `${plan.completionPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Current Section + Next Problem */}
                {plan.nextProblem && (
                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-xs text-white/40">
                      <span className="text-white/60 font-medium">{plan.currentSectionTitle}</span>
                    </div>
                    <button
                      onClick={() => onNavigate('workspace', plan.nextProblem!.problemId)}
                      className="flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      Continue <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Plans */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-amber-400" />
          {enrolledPlans.length > 0 ? 'Explore More Plans' : 'Choose a Study Plan'}
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {availablePlans.map(plan => (
            <div key={plan.id} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 hover:border-white/[0.12] hover:bg-white/[0.04] transition-all group">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/15 transition-colors">
                  {ICON_MAP[plan.badgeIcon] || <BookOpen className="h-5 w-5" />}
                </div>
                <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold ${DIFFICULTY_COLORS[plan.difficulty]}`}>
                  {plan.difficulty}
                </span>
              </div>

              <h3 className="text-base font-bold text-white group-hover:text-amber-200 transition-colors">
                {plan.title}
              </h3>
              <p className="mt-1.5 text-xs text-white/40 leading-relaxed line-clamp-2">
                {plan.description}
              </p>

              <div className="mt-4 flex items-center gap-4 text-[11px] text-white/40">
                <span className="flex items-center gap-1">
                  <Layers className="h-3 w-3" />
                  {plan.totalProblems} problems
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {plan.estimatedDuration}
                </span>
                <span className="flex items-center gap-1">
                  {plan.sections.length} sections
                </span>
              </div>

              {/* Progress if already started (completed plans) */}
              {plan.completedProblemsCount! > 0 && (
                <div className="mt-3">
                  <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald-500/60"
                      style={{ width: `${plan.completionPercentage}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-emerald-400/70 mt-1 inline-block">
                    {plan.completedProblemsCount}/{plan.totalProblems} completed
                  </span>
                </div>
              )}

              <button
                onClick={() => handleEnroll(plan.id)}
                className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-2.5 text-xs font-semibold text-amber-300 hover:bg-amber-500/15 transition-colors"
              >
                <Play className="h-3.5 w-3.5" />
                Start Plan
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
