import React, { useMemo } from 'react';
import { 
  Flame, CheckCircle2, Award, Trophy, ArrowRight, Play, 
  Clock, Compass, Sparkles, TrendingUp, ChevronRight, BookOpen, 
  CheckCircle, Circle, Layers, Activity 
} from 'lucide-react';
import { UserProfile, Problem } from '../../types';
import { ALL_PROBLEMS } from '../../data/problems';
import { ROADMAP_STAGES } from '../../data/roadmaps';
import { StorageService } from '../../services/storage';
import { 
  ROADMAP_SECTIONS_DATA, 
  ROADMAP_PROBLEMS_MAPPING, 
  ProblemDatabase 
} from '../../services/problemDatabase';

interface UserDashboardProps {
  currentUser: UserProfile;
  onNavigate: (view: string, param?: string) => void;
  onStartFirstLesson?: () => void;
  onOpenAssessment?: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  currentUser,
  onNavigate,
  onStartFirstLesson,
  onOpenAssessment
}) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const isZeroProgress = currentUser.solvedProblemIds.length === 0;
  const firstName = currentUser.name ? currentUser.name.split(' ')[0] : 'Developer';

  // Real Stats calculation
  const totalSolved = currentUser.solvedProblemIds.length;
  const easySolved = currentUser.solvedProblemIds.filter(id => {
    const p = ALL_PROBLEMS.find(prob => prob.id === id);
    return p?.difficulty === 'Easy';
  }).length;
  const mediumSolved = currentUser.solvedProblemIds.filter(id => {
    const p = ALL_PROBLEMS.find(prob => prob.id === id);
    return p?.difficulty === 'Medium';
  }).length;
  const hardSolved = currentUser.solvedProblemIds.filter(id => {
    const p = ALL_PROBLEMS.find(prob => prob.id === id);
    return p?.difficulty === 'Hard';
  }).length;

  // Active roadmap section calculation
  const currentStage = ROADMAP_STAGES[0]; // Arrays & Hashing
  const stageSolvedCount = currentStage.problemIds.filter(id => 
    currentUser.solvedProblemIds.includes(id)
  ).length;
  const stageProgressPercent = Math.round((stageSolvedCount / currentStage.problemIds.length) * 100);

  // Recommended first problem based on experience level
  const firstProblemId = currentUser.experienceLevel === 'Advanced' ? 'p-4' : 'p-1';
  const firstProblem = ALL_PROBLEMS.find(p => p.id === firstProblemId) || ALL_PROBLEMS[0];

  // Daily challenge problem
  const dailyChallengeProblem = ALL_PROBLEMS.find(p => p.id === 'p-5') || ALL_PROBLEMS[4];

  // Recommended problems tailored to level
  const recommendedProblems = ALL_PROBLEMS.filter(p => 
    !currentUser.solvedProblemIds.includes(p.id) &&
    (currentUser.experienceLevel === 'Beginner' ? p.difficulty === 'Easy' : p.difficulty === 'Medium')
  ).slice(0, 4);

  // Real Submissions Activity (no fake items)
  const realSubmissions = StorageService.getSubmissions().slice(0, 5);

  // =========================================================================
  // 1. ZERO-PROGRESS FIRST-TIME DASHBOARD (Sections 9, 27, 31)
  // =========================================================================
  if (isZeroProgress) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 animate-in fade-in duration-300">
        
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/[0.08] pb-6">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                Welcome, {firstName} 👋
              </h1>
              <span className="rounded-full bg-amber-400/10 border border-amber-400/20 px-2.5 py-0.5 text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                {currentUser.experienceLevel || 'Beginner'}
              </span>
            </div>
            <p className="mt-1 text-sm sm:text-base text-amber-400/90 font-medium">
              Your first spark is waiting. ⚡
            </p>
          </div>

          <div className="flex items-center gap-3">
            {onOpenAssessment && (currentUser.experienceLevel === 'Intermediate' || currentUser.experienceLevel === 'Advanced') && (
              <button
                onClick={onOpenAssessment}
                className="flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 text-xs font-semibold text-indigo-300 hover:bg-indigo-500/20 transition-colors"
              >
                <Activity className="h-3.5 w-3.5" />
                <span>Skill Assessment</span>
              </button>
            )}
            <button
              onClick={() => onStartFirstLesson ? onStartFirstLesson() : onNavigate('workspace', firstProblemId)}
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-black shadow-md shadow-amber-500/20 hover:scale-105 active:scale-95 transition-transform"
            >
              <Play className="h-3.5 w-3.5 fill-black" />
              <span>{currentUser.firstLessonCompleted ? 'Solve First Problem →' : 'Start Learning →'}</span>
            </button>
          </div>
        </div>

        {/* TOP STATS CARDS: Meaningful Zero-State Messages (Section 27) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          
          {/* Current Streak */}
          <div className="glass-panel rounded-2xl p-5 border border-white/[0.08]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-white/50">Current Streak</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                <Flame className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-2 font-display text-3xl font-extrabold text-white">
              0 <span className="text-xs font-normal text-white/40">days</span>
            </p>
            <span className="text-[11px] text-amber-400/80 font-medium">Start your first streak today</span>
          </div>

          {/* Problems Solved */}
          <div className="glass-panel rounded-2xl p-5 border border-white/[0.08]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-white/50">Problems Solved</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-2 font-display text-3xl font-extrabold text-white">
              0 <span className="text-xs font-normal text-white/40">/ 50</span>
            </p>
            <span className="text-[11px] text-emerald-400/80 font-medium">Your first solve is waiting</span>
          </div>

          {/* Total XP & Level */}
          <div className="glass-panel rounded-2xl p-5 border border-white/[0.08]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-white/50">Experience XP</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                <Sparkles className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-2 font-display text-3xl font-extrabold text-white">
              0 <span className="text-xs font-normal text-white/40">XP</span>
            </p>
            <span className="text-[11px] text-cyan-400/80 font-medium">Earn your first 100 XP</span>
          </div>

          {/* Badges / Rating */}
          <div className="glass-panel rounded-2xl p-5 border border-white/[0.08]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-white/50">Badges & Rating</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                <Trophy className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-2 font-display text-3xl font-extrabold text-white">
              0 <span className="text-xs font-normal text-white/40">Badges</span>
            </p>
            <span className="text-[11px] text-purple-400/80 font-medium">No badges yet · Unrated</span>
          </div>

        </div>

        {/* PRIMARY ACTION CARD: YOUR FIRST STEP (Section 9) */}
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Main Hero Card: Your First Step */}
          <div className="lg:col-span-8 glass-panel rounded-3xl p-6 sm:p-8 border border-amber-500/20 bg-gradient-to-br from-[#121118] via-[#0e0d14] to-[#09090c] flex flex-col justify-between relative overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)]">
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-amber-500/10 blur-3xl" />

            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-amber-400 flex items-center gap-1.5">
                  <Compass className="h-3.5 w-3.5" />
                  <span>YOUR FIRST STEP</span>
                </span>
                <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-[11px] font-mono text-white/60">
                  Topic 01
                </span>
              </div>

              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-2">
                {currentUser.recommendedStartingTopic || 'Arrays & Hashing'}
              </h2>
              <p className="text-sm text-white/60 leading-relaxed max-w-xl">
                Learn the fundamentals of arrays, hash maps and common problem-solving patterns. Master how to trade space for optimal linear time complexity.
              </p>

              {/* Progress 0 / 5 */}
              <div className="mt-6 space-y-2 max-w-md">
                <div className="flex justify-between text-xs">
                  <span className="text-white/70 font-medium">Topic Progress</span>
                  <span className="font-mono font-bold text-white/50">0 / 5 Completed</span>
                </div>
                <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-amber-400 w-0 transition-all duration-500" />
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-6 border-t border-white/[0.08]">
              <span className="text-xs text-white/50 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                <span>Estimated completion: 30 minutes</span>
              </span>

              <button
                onClick={() => onStartFirstLesson ? onStartFirstLesson() : onNavigate('workspace', firstProblemId)}
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-6 py-3 text-xs font-bold uppercase tracking-wider text-black shadow-lg shadow-amber-500/25 hover:scale-[1.02] active:scale-[0.98] transition-transform"
              >
                <span>{currentUser.firstLessonCompleted ? 'Solve First Problem →' : 'Start Learning →'}</span>
                <ArrowRight className="h-4 w-4 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* Today's Goal Checklist (Section 9) */}
          <div className="lg:col-span-4 glass-panel rounded-3xl p-6 sm:p-7 border border-white/[0.08] flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-white/50 block mb-4">
                TODAY&apos;S GOAL
              </span>

              <div className="space-y-4">
                {/* Goal 1: First Lesson */}
                <div 
                  onClick={() => onStartFirstLesson && onStartFirstLesson()}
                  className="flex items-start gap-3 p-3 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] cursor-pointer transition-colors"
                >
                  {currentUser.firstLessonCompleted ? (
                    <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <Circle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="text-xs font-bold text-white block">Complete your first lesson</span>
                    <span className="text-[11px] text-white/50">
                      {currentUser.firstLessonCompleted ? 'Completed ✓' : '5-minute interactive concept walkthrough'}
                    </span>
                  </div>
                </div>

                {/* Goal 2: First Problem */}
                <div 
                  onClick={() => onNavigate('workspace', firstProblemId)}
                  className="flex items-start gap-3 p-3 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] cursor-pointer transition-colors"
                >
                  <Circle className="h-5 w-5 text-white/30 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-white block">Solve your first problem</span>
                    <span className="text-[11px] text-white/50">
                      Submit and pass automated test cases
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/[0.06] text-[11px] text-amber-300/80 bg-amber-500/5 p-3 rounded-xl border border-amber-500/10">
              💡 Completing your first solve unlocks your daily streak, +100 XP, and active roadmap tracking.
            </div>
          </div>

        </div>

        {/* RECOMMENDED FIRST PROBLEM CARD (Section 11) */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-bold text-white">
              Recommended Problem For You
            </h2>
            <button
              onClick={() => onNavigate('problems')}
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
            >
              Browse all 75 problems →
            </button>
          </div>

          <div className="glass-panel rounded-2xl p-5 sm:p-6 border border-white/[0.08] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="font-display text-base sm:text-lg font-bold text-white">
                  {firstProblem.title}
                </span>
                <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                  {firstProblem.difficulty}
                </span>
                <span className="text-xs text-white/40">· {firstProblem.pattern}</span>
              </div>
              <p className="text-xs text-white/60 line-clamp-1 max-w-2xl">
                {firstProblem.description}
              </p>
            </div>

            <button
              onClick={() => onNavigate('workspace', firstProblem.id)}
              className="rounded-xl bg-white/10 hover:bg-white/15 px-4 py-2.5 text-xs font-bold text-white shrink-0 transition-colors"
            >
              Start Problem →
            </button>
          </div>
        </div>

        {/* CLEAN EMPTY STATE FOR ACTIVITY (Section 27) */}
        <div className="glass-panel rounded-3xl p-8 border border-white/[0.08] text-center max-w-2xl mx-auto">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-white/40">
            <Sparkles className="h-5 w-5" />
          </div>
          <h3 className="font-display text-sm font-bold text-white">
            Your coding journey starts here.
          </h3>
          <p className="mt-1 text-xs text-white/45 max-w-md mx-auto">
            Once you submit your first solution, your code execution stats, streak calendar, and algorithmic analytics will appear here.
          </p>
        </div>

      </div>
    );
  }

  // =========================================================================
  // 2. ACTIVE LEARNER DASHBOARD (Section 16)
  // =========================================================================
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 animate-in fade-in duration-300">
      
      {/* Personalized Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            {getGreeting()}, {firstName}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-white/50">
            Keep building your problem-solving skills with deliberate practice.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('workspace', dailyChallengeProblem.id)}
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-black shadow-md shadow-amber-500/20 hover:scale-105 active:scale-95 transition-transform"
          >
            <Play className="h-3.5 w-3.5 fill-black" />
            <span>Today&apos;s Challenge</span>
          </button>
        </div>
      </div>

      {/* TOP STATS CARDS (Real stats only) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Current Streak */}
        <div className="glass-panel rounded-2xl p-5 border border-white/[0.08] relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-white/50">Current Streak</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
              <Flame className="h-4 w-4 fill-amber-400" />
            </div>
          </div>
          <p className="mt-2 font-display text-3xl font-extrabold text-amber-400">
            {currentUser.streak} <span className="text-xs font-normal text-white/40">days</span>
          </p>
          <span className="text-[11px] text-white/40">Personal best: {currentUser.longestStreak} days</span>
        </div>

        {/* Problems Solved */}
        <div className="glass-panel rounded-2xl p-5 border border-white/[0.08]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-white/50">Problems Solved</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 font-display text-3xl font-extrabold text-white">
            {totalSolved} <span className="text-xs font-normal text-white/40">/ 50</span>
          </p>
          <span className="text-[11px] text-emerald-400 font-semibold">{easySolved}E · {mediumSolved}M · {hardSolved}H</span>
        </div>

        {/* Total XP & Level */}
        <div className="glass-panel rounded-2xl p-5 border border-white/[0.08]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-white/50">Experience XP</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 font-display text-3xl font-extrabold text-white">
            {currentUser.xp} <span className="text-xs font-normal text-white/40">XP</span>
          </p>
          <span className="text-[11px] text-cyan-400 font-semibold">Lvl {currentUser.level} · {currentUser.levelTitle}</span>
        </div>

        {/* Global Rank / Badges */}
        <div className="glass-panel rounded-2xl p-5 border border-white/[0.08]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-white/50">Badges Unlocked</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
              <Trophy className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 font-display text-3xl font-extrabold text-white">
            {currentUser.badges.length} <span className="text-xs font-normal text-white/40">earned</span>
          </p>
          <span className="text-[11px] text-purple-400 font-semibold">Rank #{currentUser.globalRank || 'Unrated'}</span>
        </div>

      </div>

      {/* TWO COLUMN GRID: Continue Learning & Today's Challenge */}
      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Continue Learning Roadmap Card */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-6 sm:p-7 border border-white/[0.08] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
                <Compass className="h-4 w-4" />
                <span>Continue where you left off</span>
              </div>
              <span className="text-xs text-white/40 font-mono">Stage 01</span>
            </div>

            <h3 className="mt-4 font-display text-2xl font-bold text-white">
              {currentStage.title}
            </h3>
            <p className="mt-2 text-xs text-white/60 leading-relaxed">
              {currentStage.description}
            </p>

            {/* Progress Bar */}
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-xs text-white/70">
                <span>Progress: {stageProgressPercent}%</span>
                <span className="font-mono text-white/50">{stageSolvedCount} / {currentStage.problemIds.length} completed</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-white/10 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(5, stageProgressPercent)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between pt-4 border-t border-white/[0.06]">
            <span className="text-[11px] text-white/40">Next: Two Pointers</span>
            <button
              onClick={() => onNavigate('roadmaps')}
              className="flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-white hover:bg-white/20 transition-colors"
            >
              <span>Continue Roadmap</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Today's Challenge Problem Card */}
        <div className="lg:col-span-5 glass-panel rounded-3xl p-6 sm:p-7 border border-amber-500/20 bg-amber-500/[0.03] flex flex-col justify-between relative overflow-hidden">
          <div className="pointer-events-none absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-amber-500/10 blur-2xl" />

          <div>
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-amber-500/20 border border-amber-500/30 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-300">
                TODAY&apos;S CHALLENGE
              </span>
              <span className="flex items-center gap-1 text-[11px] text-white/50 font-mono">
                <Clock className="h-3 w-3" />
                <span>25 min</span>
              </span>
            </div>

            <h3 className="mt-4 font-display text-xl font-bold text-white">
              {dailyChallengeProblem.title}
            </h3>
            <p className="mt-2 line-clamp-2 text-xs text-white/60 leading-relaxed">
              {dailyChallengeProblem.description}
            </p>

            <div className="mt-4 flex items-center gap-2">
              <span className="rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 text-[10px] font-semibold text-amber-400">
                {dailyChallengeProblem.difficulty}
              </span>
              <span className="text-[11px] text-white/40">
                {dailyChallengeProblem.pattern}
              </span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400">+100 XP Reward</span>
            <button
              onClick={() => onNavigate('workspace', dailyChallengeProblem.id)}
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-4 py-2 text-xs font-bold text-black shadow-md shadow-amber-500/20 hover:scale-105 active:scale-95 transition-transform"
            >
              <span>Start Challenge</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* RECOMMENDED FOR YOU */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-display text-xl font-bold text-white">
              Recommended for you
            </h2>
            <p className="text-xs text-white/50">
              Personalized based on your {currentUser.experienceLevel} level and recent solves
            </p>
          </div>
          <button
            onClick={() => onNavigate('problems')}
            className="flex items-center gap-1 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
          >
            <span>View all problems</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {recommendedProblems.map((prob) => (
            <div
              key={prob.id}
              onClick={() => onNavigate('workspace', prob.id)}
              className="glass-panel group rounded-2xl p-5 border border-white/[0.08] hover:border-amber-400/40 hover:bg-white/[0.04] transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    prob.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                    prob.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                    'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}>
                    {prob.difficulty}
                  </span>
                  <span className="text-[10px] text-white/40 font-mono">
                    {prob.acceptance}
                  </span>
                </div>

                <h3 className="font-display text-sm font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1">
                  {prob.title}
                </h3>
                <p className="mt-1 text-[11px] text-white/50 line-clamp-2">
                  {prob.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-white/40">
                <span>{prob.pattern}</span>
                <span className="text-amber-400 group-hover:translate-x-1 transition-transform">Solve →</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RECENT ACTIVITY: Real submissions from storage (Section 17) */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/[0.08]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-amber-400" />
            <h2 className="font-display text-lg font-bold text-white">
              Recent Submissions
            </h2>
          </div>
          <button
            onClick={() => onNavigate('submissions')}
            className="text-xs text-white/50 hover:text-white transition-colors"
          >
            View all submissions →
          </button>
        </div>

        {realSubmissions.length > 0 ? (
          <div className="divide-y divide-white/[0.06]">
            {realSubmissions.map((sub) => (
              <div 
                key={sub.id} 
                onClick={() => onNavigate('workspace', sub.problemId)}
                className="py-3.5 flex items-center justify-between hover:bg-white/[0.02] px-2 rounded-xl cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${
                    sub.status === 'Accepted' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                  }`}>
                    {sub.status === 'Accepted' ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <Clock className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">{sub.problemTitle}</span>
                    <span className="text-[11px] text-white/40">{sub.timestamp} · {sub.language}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    sub.status === 'Accepted' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                  }`}>
                    {sub.status}
                  </span>
                  {sub.status === 'Accepted' && (
                    <span className="text-xs font-mono font-bold text-amber-400">+50 XP</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-white/40">
            No submissions recorded yet. Your latest runs and submissions will appear here.
          </div>
        )}
      </div>

    </div>
  );
};
