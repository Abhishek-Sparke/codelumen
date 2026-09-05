import React, { useState } from 'react';
import { 
  User, Award, Flame, CheckCircle2, Trophy, 
  Calendar, Layers, Sparkles, UserPlus, UserCheck 
} from 'lucide-react';
import { UserProfile } from '../../types';
import { ALL_BADGES } from '../../data/badges';
import { ALL_PROBLEMS } from '../../data/problems';
import { StorageService } from '../../services/storage';

interface UserProfileViewProps {
  userId: string;
  currentUser: UserProfile;
  onUpdateCurrentUser: (user: UserProfile) => void;
  onNavigateProblem: (problemId: string) => void;
}

export const UserProfileView: React.FC<UserProfileViewProps> = ({
  userId,
  currentUser,
  onUpdateCurrentUser,
  onNavigateProblem
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'problems' | 'badges'>('overview');

  const profileUser = StorageService.getUserById(userId);
  const isOwnProfile = profileUser.id === currentUser.id || userId === 'user-current';
  const isFollowing = currentUser.followingIds.includes(profileUser.id);

  const handleToggleFollow = () => {
    const { current } = StorageService.toggleFollowUser(profileUser.id);
    onUpdateCurrentUser(current);
  };

  // Solved problems detailed objects
  const solvedProblems = profileUser.solvedProblemIds.map(id => 
    ALL_PROBLEMS.find(p => p.id === id)
  ).filter(Boolean);

  // Difficulty counts
  const easyCount = solvedProblems.filter(p => p?.difficulty === 'Easy').length;
  const mediumCount = solvedProblems.filter(p => p?.difficulty === 'Medium').length;
  const hardCount = solvedProblems.filter(p => p?.difficulty === 'Hard').length;

  // Render a GitHub-style 52-week activity heatmap calendar
  const renderHeatmap = () => {
    const weeks = 28; // Display last ~7 months for clean layout
    const days = 7;
    const grid = [];
    
    for (let w = 0; w < weeks; w++) {
      const col = [];
      for (let d = 0; d < days; d++) {
        // Generate pseudo activity intensity based on user calendar and day seed
        const activityCount = (w * 3 + d) % 5 === 0 ? 3 : (w * 7 + d) % 3 === 0 ? 1 : (w * 2 + d) % 9 === 0 ? 4 : 0;
        col.push(activityCount);
      }
      grid.push(col);
    }

    return (
      <div className="overflow-x-auto pb-2">
        <div className="inline-flex gap-1.5 min-w-full">
          {grid.map((week, wIdx) => (
            <div key={wIdx} className="flex flex-col gap-1.5">
              {week.map((level, dIdx) => (
                <div
                  key={dIdx}
                  title={`${level} solves recorded`}
                  className={`h-3 w-3 rounded-[3px] transition-colors ${
                    level === 0 
                      ? 'bg-white/[0.04]' 
                      : level === 1 
                      ? 'bg-amber-500/30' 
                      : level === 3 
                      ? 'bg-amber-500/60' 
                      : 'bg-amber-400'
                  }`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      
      {/* Social Profile Header Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-9 border border-white/[0.08] relative overflow-hidden">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          
          {/* Avatar and Info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <img 
              src={profileUser.avatar} 
              alt={profileUser.name} 
              className="h-20 w-20 rounded-2xl object-cover ring-2 ring-white/10 shadow-xl"
            />
            <div>
              <div className="flex items-center gap-3">
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">
                  {profileUser.name}
                </h1>
                <span className="rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-0.5 text-xs font-semibold text-amber-400">
                  {profileUser.levelTitle}
                </span>
              </div>
              <p className="text-xs text-white/50 font-mono mt-0.5">
                @{profileUser.username} · Joined {profileUser.joinedDate}
              </p>
              <p className="mt-2 text-xs text-white/70 max-w-xl leading-relaxed">
                {profileUser.bio}
              </p>
            </div>
          </div>

          {/* Follow / Social Action */}
          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 border-t sm:border-t-0 border-white/[0.06] pt-4 sm:pt-0">
            {!isOwnProfile && (
              <button
                onClick={handleToggleFollow}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                  isFollowing
                    ? 'border border-white/20 bg-white/5 text-white/80 hover:bg-white/10'
                    : 'bg-amber-400 text-black shadow-md shadow-amber-500/20 hover:bg-amber-300'
                }`}
              >
                {isFollowing ? (
                  <>
                    <UserCheck className="h-4 w-4" />
                    <span>Following</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4" />
                    <span>Follow Developer</span>
                  </>
                )}
              </button>
            )}

            <div className="flex items-center gap-4 text-xs font-mono text-white/60">
              <span><strong className="text-white">{profileUser.followersCount}</strong> followers</span>
              <span><strong className="text-white">{profileUser.followingCount}</strong> following</span>
            </div>
          </div>

        </div>

        {/* Highlight Stats Row */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-white/[0.08] pt-6">
          <div>
            <span className="text-[11px] text-white/40">Problems Solved</span>
            <p className="font-display text-2xl font-bold text-white mt-0.5">
              {profileUser.solvedProblemIds.length}
            </p>
          </div>
          <div>
            <span className="text-[11px] text-white/40">Total Experience</span>
            <p className="font-display text-2xl font-bold text-cyan-400 mt-0.5">
              {profileUser.xp} <span className="text-xs text-white/40">XP</span>
            </p>
          </div>
          <div>
            <span className="text-[11px] text-white/40">Current Streak</span>
            <p className="font-display text-2xl font-bold text-amber-400 mt-0.5 flex items-center gap-1">
              <Flame className="h-5 w-5 fill-amber-400" />
              {profileUser.streak} days
            </p>
          </div>
          <div>
            <span className="text-[11px] text-white/40">Global Rank</span>
            <p className="font-display text-2xl font-bold text-purple-400 mt-0.5">
              #{profileUser.globalRank}
            </p>
          </div>
        </div>

      </div>

      {/* TABS (Overview, Problems Solved, Badges) */}
      <div className="flex items-center gap-2 border-b border-white/[0.08] pb-3 text-xs font-medium">
        <button
          onClick={() => setActiveTab('overview')}
          className={`rounded-full px-4 py-1.5 transition-colors ${
            activeTab === 'overview' ? 'bg-white/10 text-white font-semibold' : 'text-white/50 hover:text-white'
          }`}
        >
          Overview &amp; Heatmap
        </button>
        <button
          onClick={() => setActiveTab('problems')}
          className={`rounded-full px-4 py-1.5 transition-colors ${
            activeTab === 'problems' ? 'bg-white/10 text-white font-semibold' : 'text-white/50 hover:text-white'
          }`}
        >
          Problems Solved ({profileUser.solvedProblemIds.length})
        </button>
        <button
          onClick={() => setActiveTab('badges')}
          className={`rounded-full px-4 py-1.5 transition-colors ${
            activeTab === 'badges' ? 'bg-white/10 text-white font-semibold' : 'text-white/50 hover:text-white'
          }`}
        >
          Badges ({profileUser.badges.length})
        </button>
      </div>

      {/* TAB CONTENT: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          
          {/* GitHub-style Activity Calendar Heatmap */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/[0.08] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-amber-400" />
                <h3 className="font-display text-base font-bold text-white">
                  Practice Consistency Heatmap
                </h3>
              </div>
              <span className="text-[11px] text-white/40 font-mono">Past 7 months</span>
            </div>

            {renderHeatmap()}

            <div className="flex items-center justify-between text-[11px] text-white/40 pt-2">
              <span>Less</span>
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded-[3px] bg-white/[0.04]" />
                <div className="h-3 w-3 rounded-[3px] bg-amber-500/30" />
                <div className="h-3 w-3 rounded-[3px] bg-amber-500/60" />
                <div className="h-3 w-3 rounded-[3px] bg-amber-400" />
              </div>
              <span>More solves</span>
            </div>
          </div>

          {/* Difficulty and Mastery Grids */}
          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Difficulty Breakdown */}
            <div className="glass-panel rounded-3xl p-6 border border-white/[0.08] space-y-4">
              <h3 className="font-display text-sm font-bold text-white">
                Solved by Difficulty
              </h3>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs text-white/70 mb-1">
                    <span className="text-emerald-400 font-medium">Easy ({easyCount})</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${Math.min(100, easyCount * 6)}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-white/70 mb-1">
                    <span className="text-amber-400 font-medium">Medium ({mediumCount})</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: `${Math.min(100, mediumCount * 6)}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-white/70 mb-1">
                    <span className="text-rose-400 font-medium">Hard ({hardCount})</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full bg-rose-400 rounded-full" style={{ width: `${Math.min(100, hardCount * 12)}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Preferences */}
            <div className="glass-panel rounded-3xl p-6 border border-white/[0.08] space-y-4">
              <h3 className="font-display text-sm font-bold text-white">
                Coding Preferences
              </h3>

              <div className="space-y-2.5 text-xs text-white/70">
                <div className="flex justify-between py-1.5 border-b border-white/[0.06]">
                  <span>Preferred Language</span>
                  <span className="font-semibold text-white uppercase">{profileUser.preferredLanguage}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/[0.06]">
                  <span>Experience Tier</span>
                  <span className="font-semibold text-white">{profileUser.experienceLevel}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/[0.06]">
                  <span>Primary Focus</span>
                  <span className="font-semibold text-amber-400">{profileUser.goal}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span>Badges Unlocked</span>
                  <span className="font-semibold text-white">{profileUser.badges.length} badges</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB CONTENT: Problems Solved */}
      {activeTab === 'problems' && (
        <div className="glass-panel rounded-3xl p-6 border border-white/[0.08] space-y-2">
          {solvedProblems.map((prob) => {
            if (!prob) return null;
            return (
              <div
                key={prob.id}
                onClick={() => onNavigateProblem(prob.id)}
                className="flex items-center justify-between rounded-xl p-3.5 hover:bg-white/[0.04] transition-colors cursor-pointer text-xs"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-semibold text-white">{prob.title}</span>
                    <span className="block text-[11px] text-white/40">{prob.pattern} · {prob.topic}</span>
                  </div>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                  prob.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400' : prob.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400' : 'bg-rose-500/10 text-rose-400'
                }`}>
                  {prob.difficulty}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB CONTENT: Badges */}
      {activeTab === 'badges' && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ALL_BADGES.map((b) => {
            const isUnlocked = profileUser.badges.includes(b.id);
            return (
              <div
                key={b.id}
                className={`glass-panel rounded-2xl p-5 border transition-all ${
                  isUnlocked ? 'border-amber-400/40 bg-amber-500/5' : 'border-white/[0.06] opacity-45'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    isUnlocked ? 'bg-amber-500/20 text-amber-400' : 'bg-white/5 text-white/40'
                  }`}>
                    <Award className="h-5 w-5" />
                  </div>
                  {isUnlocked && (
                    <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                      Unlocked
                    </span>
                  )}
                </div>
                <h4 className="mt-4 font-display text-sm font-bold text-white">
                  {b.title}
                </h4>
                <p className="mt-1 text-xs text-white/60 leading-relaxed">
                  {b.description}
                </p>
                <span className="mt-3 block text-[10px] text-white/40 font-mono">
                  {b.requirement}
                </span>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
