import React, { useMemo, useState } from 'react';
import {
  Award, Sparkles, Flame, Trophy, CheckCircle, Calendar, Star,
  Sun, BookOpen, Compass, Brain, Crown, Leaf, Swords, Zap, Lock,
  Target, Layers
} from 'lucide-react';
import { UserProfile } from '../../types';
import { ACHIEVEMENTS_REGISTRY, AchievementDefinition } from '../../data/achievements';
import { StorageService } from '../../services/storage';
import { ProblemDatabase } from '../../services/problemDatabase';

interface AchievementsViewProps {
  currentUser: UserProfile;
  onNavigate: (view: string, param?: string) => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  all: 'All',
  solve: 'Problem Solving',
  streak: 'Streaks',
  contest: 'Contests',
  study: 'Study Plans',
  daily: 'Daily Challenges',
  pattern: 'Patterns',
  community: 'Community'
};

const ICON_MAP: Record<string, React.ReactNode> = {
  Sparkles: <Sparkles className="h-5 w-5" />,
  CheckCircle: <CheckCircle className="h-5 w-5" />,
  Award: <Award className="h-5 w-5" />,
  Crown: <Crown className="h-5 w-5" />,
  Leaf: <Leaf className="h-5 w-5" />,
  Sword: <Target className="h-5 w-5" />,
  Flame: <Flame className="h-5 w-5" />,
  Calendar: <Calendar className="h-5 w-5" />,
  Star: <Star className="h-5 w-5" />,
  Swords: <Swords className="h-5 w-5" />,
  Trophy: <Trophy className="h-5 w-5" />,
  BookOpen: <BookOpen className="h-5 w-5" />,
  Sun: <Sun className="h-5 w-5" />,
  Sunrise: <Zap className="h-5 w-5" />,
  Compass: <Compass className="h-5 w-5" />,
  Brain: <Brain className="h-5 w-5" />,
};

export const AchievementsView: React.FC<AchievementsViewProps> = ({ currentUser, onNavigate }) => {
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const { achievements, unlockedCount, totalPoints } = useMemo(() => {
    const userUnlocked = new Set(StorageService.getUserAchievements(currentUser.id));
    const solvedCount = currentUser.solvedProblemIds.length;
    const solveCounts = ProblemDatabase.getUserSolveCounts(currentUser.id);

    const enriched = ACHIEVEMENTS_REGISTRY.map(def => {
      const isUnlocked = userUnlocked.has(def.id);
      let progress = 0;
      let maxProgress = def.criteriaThreshold;

      switch (def.criteriaType) {
        case 'first_action':
        case 'problems_solved':
          progress = Math.min(solvedCount, maxProgress);
          break;
        case 'difficulty_solved':
          if (def.criteriaQualifier === 'Easy') progress = Math.min(solveCounts.easy, maxProgress);
          else if (def.criteriaQualifier === 'Medium') progress = Math.min(solveCounts.medium, maxProgress);
          else if (def.criteriaQualifier === 'Hard') progress = Math.min(solveCounts.hard, maxProgress);
          break;
        case 'streak_days':
          progress = Math.min(currentUser.streak || 0, maxProgress);
          break;
        case 'contests_completed':
          progress = Math.min(currentUser.contestCount || 0, maxProgress);
          break;
        default:
          progress = isUnlocked ? maxProgress : 0;
      }

      return { ...def, isUnlocked, progress, maxProgress };
    });

    const uc = enriched.filter(a => a.isUnlocked).length;
    const tp = enriched.filter(a => a.isUnlocked).reduce((sum, a) => sum + a.badgePoints, 0);

    return { achievements: enriched, unlockedCount: uc, totalPoints: tp };
  }, [currentUser]);

  const filtered = categoryFilter === 'all'
    ? achievements
    : achievements.filter(a => a.category === categoryFilter);

  const categories = ['all', ...new Set(ACHIEVEMENTS_REGISTRY.map(a => a.category))];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="border-b border-white/[0.08] pb-6">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 text-[11px] font-semibold text-purple-400">
          <Trophy className="h-3 w-3" />
          <span>Recognition</span>
        </div>
        <h1 className="mt-2.5 font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Achievements
        </h1>
        <p className="mt-1 text-sm text-white/50">
          {unlockedCount}/{ACHIEVEMENTS_REGISTRY.length} unlocked · {totalPoints.toLocaleString()} badge points earned
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
              categoryFilter === cat
                ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
                : 'text-white/50 hover:text-white/80 hover:bg-white/[0.04] border border-transparent'
            }`}
          >
            {CATEGORY_LABELS[cat] || cat}
          </button>
        ))}
      </div>

      {/* Achievement Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map(achievement => (
          <div
            key={achievement.id}
            className={`rounded-2xl border p-5 transition-all ${
              achievement.isUnlocked
                ? 'border-purple-500/20 bg-gradient-to-br from-purple-500/[0.06] to-amber-500/[0.04] shadow-lg shadow-purple-500/5'
                : 'border-white/[0.06] bg-white/[0.02] opacity-60'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl shrink-0 ${
                achievement.isUnlocked
                  ? 'bg-gradient-to-br from-amber-500/20 to-purple-500/20 text-amber-400'
                  : 'bg-white/[0.05] text-white/20'
              }`}>
                {achievement.isUnlocked
                  ? (ICON_MAP[achievement.icon] || <Award className="h-5 w-5" />)
                  : <Lock className="h-5 w-5" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={`text-sm font-bold ${achievement.isUnlocked ? 'text-white' : 'text-white/50'}`}>
                  {achievement.title}
                </h3>
                <p className="text-[11px] text-white/40 mt-0.5 leading-relaxed">
                  {achievement.description}
                </p>
              </div>
              <span className={`text-[10px] font-bold shrink-0 ${
                achievement.isUnlocked ? 'text-amber-400' : 'text-white/20'
              }`}>
                +{achievement.badgePoints}
              </span>
            </div>

            {/* Progress Bar */}
            {!achievement.isUnlocked && achievement.maxProgress > 1 && (
              <div className="mt-3 space-y-1">
                <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-purple-500/40 transition-all duration-500"
                    style={{ width: `${Math.min(100, (achievement.progress / achievement.maxProgress) * 100)}%` }}
                  />
                </div>
                <span className="text-[10px] text-white/30">
                  {achievement.progress}/{achievement.maxProgress}
                </span>
              </div>
            )}

            {achievement.isUnlocked && (
              <div className="mt-3 flex items-center gap-1 text-[10px] text-purple-400 font-semibold">
                <CheckCircle className="h-3 w-3" />
                Unlocked
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
