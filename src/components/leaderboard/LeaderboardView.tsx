import React, { useState } from 'react';
import { Trophy, Flame, CheckCircle2, Award, Sparkles, Crown } from 'lucide-react';
import { UserProfile } from '../../types';
import { StorageService } from '../../services/storage';

interface LeaderboardViewProps {
  currentUser: UserProfile;
  onNavigateProfile: (userId: string) => void;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  currentUser,
  onNavigateProfile
}) => {
  const [scope, setScope] = useState<'global' | 'weekly' | 'monthly' | 'friends'>('global');

  // Filter or sort real registered accounts
  const allUsers = StorageService.getAllUsers();
  
  const filteredUsers = allUsers.filter(u => {
    if (scope === 'friends') {
      return (currentUser.followingIds || []).includes(u.id) || u.id === currentUser.id;
    }
    return true;
  }).sort((a, b) => (b.xp || 0) - (a.xp || 0));

  const topThree = filteredUsers.length >= 3 ? filteredUsers.slice(0, 3) : [];
  const displayTableUsers = topThree.length >= 3 ? filteredUsers.slice(3) : filteredUsers;
  const baseRank = topThree.length >= 3 ? 4 : 1;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      
      {/* Header */}
      <div>
        <span className="lumen-tag text-amber-400">Competitive Arena</span>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Leaderboard
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-white/50">
          Rankings updated in real-time based on problems solved, contest performance, and active practice streaks.
        </p>
      </div>

      {/* Scope Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-white/[0.08] pb-3 text-xs font-medium">
        {[
          { id: 'global', label: 'Global All-Time' },
          { id: 'weekly', label: 'Weekly Sprint' },
          { id: 'monthly', label: 'Monthly' },
          { id: 'friends', label: `Friends & Following (${currentUser.followingIds.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setScope(tab.id as any)}
            className={`rounded-full px-4 py-1.5 transition-colors ${
              scope === tab.id
                ? 'bg-white/10 text-white font-semibold shadow-sm'
                : 'text-white/50 hover:bg-white/[0.04] hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TOP 3 PODIUM CARDS */}
      {topThree.length >= 3 && (
        <div className="grid sm:grid-cols-3 gap-6 items-end pt-6">
          
          {/* Rank 2 (Silver) */}
          <div 
            onClick={() => onNavigateProfile(topThree[1].id)}
            className="glass-panel cursor-pointer rounded-3xl p-6 border border-white/15 text-center relative hover:-translate-y-1 transition-transform bg-gradient-to-b from-white/[0.05] to-transparent"
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-300/10 border border-slate-300/30 text-slate-300 font-display text-lg font-extrabold mb-3">
              2
            </div>
            <img 
              src={topThree[1].avatar} 
              alt={topThree[1].name} 
              className="mx-auto h-16 w-16 rounded-full object-cover ring-2 ring-slate-300/40"
            />
            <h3 className="font-display text-base font-bold text-white mt-3">{topThree[1].name}</h3>
            <p className="text-[11px] text-white/50 font-mono">@{topThree[1].username}</p>
            <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-center gap-4 text-xs font-mono">
              <span className="text-cyan-400 font-bold">{topThree[1].xp} XP</span>
              <span className="text-white/40">{topThree[1].solvedProblemIds.length} solved</span>
            </div>
          </div>

          {/* Rank 1 (Gold - Elevated) */}
          <div 
            onClick={() => onNavigateProfile(topThree[0].id)}
            className="glass-panel cursor-pointer rounded-3xl p-8 border border-amber-400/40 text-center relative hover:-translate-y-1.5 transition-transform bg-gradient-to-b from-amber-500/10 to-transparent shadow-[0_0_50px_-10px_rgba(245,158,11,0.25)] sm:-translate-y-4"
          >
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 p-1.5 shadow-lg shadow-amber-500/40">
              <Crown className="h-5 w-5 text-black fill-black" />
            </div>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 font-display text-xl font-extrabold mt-2 mb-3">
              1
            </div>
            <img 
              src={topThree[0].avatar} 
              alt={topThree[0].name} 
              className="mx-auto h-20 w-20 rounded-full object-cover ring-4 ring-amber-400/40 shadow-xl"
            />
            <h3 className="font-display text-lg font-bold text-white mt-3">{topThree[0].name}</h3>
            <p className="text-xs text-amber-300/80 font-mono">@{topThree[0].username}</p>
            <div className="mt-5 pt-4 border-t border-amber-500/20 flex items-center justify-center gap-5 text-xs font-mono">
              <span className="text-amber-400 font-bold text-sm">{topThree[0].xp} XP</span>
              <span className="text-white/60">{topThree[0].solvedProblemIds.length} solved</span>
              <span className="text-amber-400 flex items-center gap-0.5"><Flame className="h-3.5 w-3.5 fill-amber-400" />{topThree[0].streak}d</span>
            </div>
          </div>

          {/* Rank 3 (Bronze) */}
          <div 
            onClick={() => onNavigateProfile(topThree[2].id)}
            className="glass-panel cursor-pointer rounded-3xl p-6 border border-amber-700/30 text-center relative hover:-translate-y-1 transition-transform bg-gradient-to-b from-amber-700/5 to-transparent"
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-700/10 border border-amber-700/30 text-amber-600 font-display text-lg font-extrabold mb-3">
              3
            </div>
            <img 
              src={topThree[2].avatar} 
              alt={topThree[2].name} 
              className="mx-auto h-16 w-16 rounded-full object-cover ring-2 ring-amber-700/40"
            />
            <h3 className="font-display text-base font-bold text-white mt-3">{topThree[2].name}</h3>
            <p className="text-[11px] text-white/50 font-mono">@{topThree[2].username}</p>
            <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-center gap-4 text-xs font-mono">
              <span className="text-cyan-400 font-bold">{topThree[2].xp} XP</span>
              <span className="text-white/40">{topThree[2].solvedProblemIds.length} solved</span>
            </div>
          </div>

        </div>
      )}

      {/* USERS TABLE */}
      {filteredUsers.length === 0 ? (
        <div className="glass-panel rounded-3xl border border-white/[0.08] p-12 text-center space-y-3">
          <Trophy className="mx-auto h-12 w-12 text-amber-400/30" />
          <h3 className="text-base font-bold text-white">No ranked engineers yet</h3>
          <p className="text-xs text-white/50 max-w-sm mx-auto">
            Solve your first challenge to claim #1 on the CodeSpark leaderboard.
          </p>
        </div>
      ) : displayTableUsers.length > 0 ? (
        <div className="glass-panel overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0b0b10]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/[0.08] bg-[#0e0e14] text-[11px] font-semibold text-white/50 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 pl-6 pr-4 w-16 text-center">Rank</th>
                  <th className="py-3.5 px-4">User</th>
                  <th className="py-3.5 px-4">XP Score</th>
                  <th className="py-3.5 px-4">Solved</th>
                  <th className="py-3.5 pr-6 pl-4 text-right">Streak</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {displayTableUsers.map((user, idx) => {
                  const rank = baseRank + idx;
                  const isCurrent = user.id === currentUser.id;

                  return (
                    <tr
                      key={user.id}
                      onClick={() => onNavigateProfile(user.id)}
                      className={`cursor-pointer transition-colors ${
                        isCurrent ? 'bg-amber-500/10 hover:bg-amber-500/15' : 'hover:bg-white/[0.04]'
                      }`}
                    >
                      <td className="py-4 pl-6 pr-4 text-center font-mono font-bold text-white/50">
                        #{rank}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <img src={user.avatar} alt={user.name} className="h-7 w-7 rounded-full object-cover bg-amber-500/10" />
                          <div>
                            <span className="font-semibold text-white">{user.name}</span>
                            <span className="block text-[11px] text-white/40">@{user.username} · {user.levelTitle}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-mono font-bold text-cyan-400">
                        {user.xp} XP
                      </td>
                      <td className="py-4 px-4 font-mono text-white/70">
                        {user.solvedProblemIds.length} problems
                      </td>
                      <td className="py-4 pr-6 pl-4 text-right">
                        <span className="inline-flex items-center gap-1 font-mono text-amber-400">
                          <Flame className="h-3.5 w-3.5 fill-amber-400" />
                          {user.streak}d
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </div>
  );
};
