import React from 'react';
import { 
  Flame, CheckCircle2, Award, Trophy, ArrowRight, Play, 
  Clock, Compass, Sparkles, TrendingUp, ChevronRight 
} from 'lucide-react';
import { UserProfile, Problem } from '../../types';
import { ALL_PROBLEMS } from '../../data/problems';
import { ROADMAP_STAGES } from '../../data/roadmaps';

interface UserDashboardProps {
  currentUser: UserProfile;
  onNavigate: (view: string, param?: string) => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  currentUser,
  onNavigate
}) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Stats calculation
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

  // Today's challenge problem
  const dailyChallengeProblem = ALL_PROBLEMS.find(p => p.id === 'p-5') || ALL_PROBLEMS[4];

  // Recommended problems (unsolved medium/easy tailored to user)
  const recommendedProblems = ALL_PROBLEMS.filter(p => 
    !currentUser.solvedProblemIds.includes(p.id) &&
    (currentUser.experienceLevel === 'Beginner' ? p.difficulty === 'Easy' : p.difficulty === 'Medium')
  ).slice(0, 4);

  // Recent activity log items
  const recentActivities = [
    { type: 'solve', title: 'Solved Pair Sum Target', time: 'Yesterday', difficulty: 'Easy', xp: '+50 XP' },
    { type: 'badge', title: 'Earned Speed Solver Badge', time: '2 days ago', difficulty: '', xp: '+100 XP' },
    { type: 'attempt', title: 'Attempted Group Anagram Clusters', time: '3 days ago', difficulty: 'Medium', xp: '' },
    { type: 'solve', title: 'Solved Valid Palindrome String', time: '4 days ago', difficulty: 'Easy', xp: '+50 XP' },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      
      {/* Personalized Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            {getGreeting()}, {currentUser.name.split(' ')[0]}
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

      {/* TOP STATS CARDS */}
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

        {/* Global Rank */}
        <div className="glass-panel rounded-2xl p-5 border border-white/[0.08]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-white/50">Global Rank</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
              <Trophy className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 font-display text-3xl font-extrabold text-white">
            #{currentUser.globalRank}
          </p>
          <span className="text-[11px] text-purple-400 font-semibold">Top 3% percentile</span>
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
                <span>Continue learning</span>
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
                  style={{ width: `${Math.max(15, stageProgressPercent)}%` }}
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
            <p className="text-xs text-white/40 mt-0.5">
              Based on your {currentUser.experienceLevel} level and active roadmap position
            </p>
          </div>
          <button
            onClick={() => onNavigate('problems')}
            className="flex items-center gap-1 text-xs text-amber-400 font-semibold hover:underline"
          >
            <span>View All</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {recommendedProblems.map((p) => (
            <div
              key={p.id}
              onClick={() => onNavigate('workspace', p.id)}
              className="glass-panel glass-panel-hover rounded-2xl p-5 border border-white/[0.08] cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    p.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {p.difficulty}
                  </span>
                  <span className="text-[10px] font-mono text-white/40">{p.acceptance}</span>
                </div>
                <h4 className="mt-3 font-display text-sm font-bold text-white group-hover:text-amber-300">
                  {p.title}
                </h4>
                <span className="mt-1 block text-[11px] text-white/40">{p.pattern}</span>
              </div>

              <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px]">
                <span className="text-white/40">{p.topic}</span>
                <span className="text-amber-400 font-semibold">Solve &rarr;</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* YOUR PROGRESS & RECENT ACTIVITY DUAL COLUMN */}
      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Your Progress Charts */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-6 sm:p-7 border border-white/[0.08] space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-white">Your Progress</h2>
            <span className="text-xs text-white/40 font-mono">Updated today</span>
          </div>

          {/* Difficulty breakdown */}
          <div className="space-y-3.5">
            <div>
              <div className="flex justify-between text-xs text-white/70 mb-1">
                <span className="text-emerald-400 font-semibold">Easy: {easySolved} / 15</span>
                <span>{Math.round((easySolved / 15) * 100)}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${(easySolved / 15) * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-white/70 mb-1">
                <span className="text-amber-400 font-semibold">Medium: {mediumSolved} / 25</span>
                <span>{Math.round((mediumSolved / 25) * 100)}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: `${(mediumSolved / 25) * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-white/70 mb-1">
                <span className="text-rose-400 font-semibold">Hard: {hardSolved} / 10</span>
                <span>{Math.round((hardSolved / 10) * 100)}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                <div className="h-full bg-rose-400 rounded-full" style={{ width: `${(hardSolved / 10) * 100}%` }} />
              </div>
            </div>
          </div>

          {/* Topic Mastery Mini-grid */}
          <div className="pt-2 border-t border-white/[0.08]">
            <span className="text-xs font-semibold text-white/60 mb-3 block">Topic Mastery</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { name: 'Arrays', level: '85%' },
                { name: 'Two Pointers', level: '70%' },
                { name: 'Sliding Window', level: '60%' },
                { name: 'Binary Tree', level: '45%' },
              ].map((t, idx) => (
                <div key={idx} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5 text-center">
                  <span className="text-[11px] text-white/60">{t.name}</span>
                  <p className="text-xs font-bold text-white mt-0.5">{t.level}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="lg:col-span-5 glass-panel rounded-3xl p-6 sm:p-7 border border-white/[0.08] flex flex-col justify-between">
          <div>
            <h2 className="font-display text-lg font-bold text-white mb-4">
              Recent Activity
            </h2>

            <div className="space-y-3.5">
              {recentActivities.map((act, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="h-2 w-2 rounded-full bg-amber-400" />
                    <div>
                      <p className="font-medium text-white/90">{act.title}</p>
                      <span className="text-[10px] text-white/40">{act.time}</span>
                    </div>
                  </div>
                  {act.xp && (
                    <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                      {act.xp}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigate('submissions')}
            className="mt-6 pt-4 border-t border-white/[0.08] w-full text-center text-xs text-amber-400/80 font-semibold hover:text-amber-300"
          >
            View Full Submissions History &rarr;
          </button>
        </div>

      </div>

    </div>
  );
};
