import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, CheckCircle2, Bookmark, BookmarkCheck, 
  X, Sparkles, Clock, RefreshCw, Layers, Compass
} from 'lucide-react';
import { Problem, UserProfile } from '../../types';
import { ProblemDatabase } from '../../services/problemDatabase';

interface ProblemLibraryProps {
  currentUser: UserProfile;
  initialFilter?: string;
  onNavigate: (view: string, param?: string) => void;
  onToggleSave: (problemId: string) => void;
}

export const ProblemLibrary: React.FC<ProblemLibraryProps> = ({
  currentUser,
  initialFilter = 'all',
  onNavigate,
  onToggleSave
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'unsolved' | 'solved' | 'attempted' | 'saved'>(
    initialFilter === 'saved' ? 'saved' : 'all'
  );
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [topicFilter, setTopicFilter] = useState<string>('all');
  const [patternFilter, setPatternFilter] = useState<string>('all');
  const [estimatedTimeFilter, setEstimatedTimeFilter] = useState<string>('all');

  // Debounce search input (Section 7)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 200);
    return () => clearTimeout(handler);
  }, [searchInput]);

  const topics = useMemo(() => ProblemDatabase.getTopics(), []);
  const patterns = useMemo(() => ProblemDatabase.getPatterns(), []);

  // Fetch problems via ProblemDatabase query engine (Section 2, 4, 7)
  const { problems: allFilteredProblems } = useMemo(() => {
    return ProblemDatabase.getProblems({
      search: debouncedSearch,
      difficulty: difficultyFilter,
      topic: topicFilter,
      pattern: patternFilter,
      status: activeTab,
      userId: currentUser.id
    });
  }, [debouncedSearch, difficultyFilter, topicFilter, patternFilter, activeTab, currentUser.id]);

  // Apply estimated time filter if selected
  const displayedProblems = useMemo(() => {
    if (estimatedTimeFilter === 'all') return allFilteredProblems;
    return allFilteredProblems.filter(p => {
      const minutes = parseInt(p.estimatedTime || '15', 10);
      if (estimatedTimeFilter === 'quick') return minutes <= 15;
      if (estimatedTimeFilter === 'standard') return minutes > 15 && minutes <= 25;
      if (estimatedTimeFilter === 'deep') return minutes > 25;
      return true;
    });
  }, [allFilteredProblems, estimatedTimeFilter]);

  const hasActiveFilters = 
    difficultyFilter !== 'all' || 
    topicFilter !== 'all' || 
    patternFilter !== 'all' || 
    estimatedTimeFilter !== 'all' || 
    debouncedSearch.length > 0;

  const resetFilters = () => {
    setDifficultyFilter('all');
    setTopicFilter('all');
    setPatternFilter('all');
    setEstimatedTimeFilter('all');
    setSearchInput('');
    setDebouncedSearch('');
    setActiveTab('all');
  };

  // Counts from authenticated user records
  const totalSolved = currentUser.solvedProblemIds.length;
  const totalAttempted = currentUser.attemptedProblemIds.length;
  const totalSaved = currentUser.savedProblemIds.length;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-in fade-in duration-200">
      
      {/* SECTION 4: PAGE HEADING & SUPPORTING TEXT */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-[11px] font-semibold text-amber-400">
            <Sparkles className="h-3 w-3" />
            <span>CodeSpark Curriculum</span>
          </div>
          <h1 className="mt-2.5 font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Practice Problems
          </h1>
          <p className="mt-1 text-sm text-white/50">
            Build your problem-solving skills one challenge at a time.
          </p>
        </div>

        {/* Quick Stats Pill */}
        <div className="flex items-center gap-3 text-xs text-white/60">
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-3.5 py-2">
            <span className="font-semibold text-emerald-400">{totalSolved}</span> Solved
          </div>
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-3.5 py-2">
            <span className="font-semibold text-amber-400">{totalAttempted}</span> Attempted
          </div>
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-3.5 py-2">
            <span className="font-semibold text-cyan-400">{totalSaved}</span> Saved
          </div>
        </div>
      </div>

      {/* SEARCH AND MULTI-AXIS FILTERS BAR */}
      <div className="glass-panel rounded-3xl p-5 border border-white/[0.08] space-y-4 shadow-xl">
        
        {/* Section 4 & 7: Top Search Input */}
        <div className="relative">
          <Search className="absolute left-4 top-3.5 h-4 w-4 text-white/40" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search problems, patterns, topics..."
            className="w-full rounded-2xl border border-white/[0.08] bg-white/[0.03] pl-11 pr-10 py-3 text-xs text-white placeholder:text-white/30 focus:border-amber-400/50 focus:outline-none focus:ring-1 focus:ring-amber-400/30"
          />
          {searchInput && (
            <button
              onClick={() => { setSearchInput(''); setDebouncedSearch(''); }}
              className="absolute right-3.5 top-3.5 text-white/40 hover:text-white"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-2.5 pt-1">
          
          {/* Difficulty Filter (Section 6) */}
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="rounded-xl border border-white/[0.08] bg-[#14141b] px-3 py-2 text-xs text-white/80 focus:outline-none focus:border-amber-400/50"
            aria-label="Filter by Difficulty"
          >
            <option value="all">Difficulty: All</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          {/* Topic Filter */}
          <select
            value={topicFilter}
            onChange={(e) => setTopicFilter(e.target.value)}
            className="rounded-xl border border-white/[0.08] bg-[#14141b] px-3 py-2 text-xs text-white/80 focus:outline-none focus:border-amber-400/50"
            aria-label="Filter by Topic"
          >
            <option value="all">Topic: All</option>
            {topics.map(t => (
              <option key={t.id} value={t.name}>{t.name}</option>
            ))}
          </select>

          {/* Pattern Filter */}
          <select
            value={patternFilter}
            onChange={(e) => setPatternFilter(e.target.value)}
            className="rounded-xl border border-white/[0.08] bg-[#14141b] px-3 py-2 text-xs text-white/80 focus:outline-none focus:border-amber-400/50"
            aria-label="Filter by Pattern"
          >
            <option value="all">Pattern: All</option>
            {patterns.map(p => (
              <option key={p.id} value={p.name}>{p.name}</option>
            ))}
          </select>

          {/* Estimated Time Filter */}
          <select
            value={estimatedTimeFilter}
            onChange={(e) => setEstimatedTimeFilter(e.target.value)}
            className="rounded-xl border border-white/[0.08] bg-[#14141b] px-3 py-2 text-xs text-white/80 focus:outline-none focus:border-amber-400/50"
            aria-label="Filter by Estimated Time"
          >
            <option value="all">Time: All</option>
            <option value="quick">Quick (≤ 15 min)</option>
            <option value="standard">Standard (15–25 min)</option>
            <option value="deep">Deep (&gt; 25 min)</option>
          </select>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs text-amber-400 font-medium hover:bg-amber-400/10 transition-colors"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Reset filters</span>
            </button>
          )}

        </div>

      </div>

      {/* SECTION 4: TABS (All, Unsolved, Solved, Attempted, Saved) */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-3">
        <div className="flex items-center gap-1.5">
          {[
            { id: 'all', label: 'All' },
            { id: 'unsolved', label: 'Unsolved' },
            { id: 'solved', label: `Solved (${totalSolved})` },
            { id: 'attempted', label: `Attempted (${totalAttempted})` },
            { id: 'saved', label: `Saved (${totalSaved})` },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`rounded-full px-4 py-1.5 text-xs font-medium tracking-wide transition-all ${
                  isActive
                    ? 'bg-white/10 text-white font-semibold shadow-sm ring-1 ring-white/10'
                    : 'text-white/50 hover:bg-white/[0.04] hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <span className="text-xs text-white/40 font-mono">
          Showing {displayedProblems.length} challenges
        </span>
      </div>

      {/* SECTION 5: PROBLEM LIST UI */}
      <div className="glass-panel overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0b0b10]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            
            {/* Table Header */}
            <thead className="border-b border-white/[0.08] bg-[#0e0e14] text-[11px] font-semibold text-white/50 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 pl-6 pr-2 w-14 text-center">Status</th>
                <th className="py-3.5 px-4">Problem</th>
                <th className="py-3.5 px-4">Difficulty</th>
                <th className="py-3.5 px-4">Topics</th>
                <th className="py-3.5 px-4">Pattern</th>
                <th className="py-3.5 px-4">Est. Time</th>
                <th className="py-3.5 pr-6 pl-2 w-16 text-center">Save</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-white/[0.04]">
              {displayedProblems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <div className="mx-auto max-w-sm space-y-3">
                      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-white/[0.04] text-white/40">
                        <Search className="h-5 w-5" />
                      </div>
                      <p className="text-sm font-semibold text-white/80">No problems match your search.</p>
                      <p className="text-xs text-white/40">Try a different search or clear your current filters.</p>
                      {hasActiveFilters && (
                        <button
                          onClick={resetFilters}
                          className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white/[0.06] border border-white/10 px-4 py-1.5 text-xs text-white hover:bg-white/[0.1] transition-colors"
                        >
                          <RefreshCw className="h-3 w-3" />
                          <span>Reset all filters</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                displayedProblems.map((problem) => {
                  const isSolved = problem.userStatus === 'solved';
                  const isAttempted = problem.userStatus === 'attempted';
                  const isSaved = problem.isSaved;

                  return (
                    <tr
                      key={problem.id}
                      onClick={() => onNavigate('workspace', problem.id)}
                      className="group cursor-pointer transition-colors hover:bg-white/[0.04]"
                    >
                      {/* Section 5: Status indicators (✓ Solved, ◐ Attempted, ○ Unsolved) */}
                      <td className="py-4 pl-6 pr-2 text-center" onClick={(e) => e.stopPropagation()}>
                        {isSolved ? (
                          <span className="inline-flex items-center justify-center text-emerald-400 font-bold" title="Solved">
                            ✓
                          </span>
                        ) : isAttempted ? (
                          <span className="inline-flex items-center justify-center text-amber-400 font-bold text-sm" title="Attempted">
                            ◐
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center text-white/20" title="Unsolved">
                            ○
                          </span>
                        )}
                      </td>

                      {/* Problem Title */}
                      <td className="py-4 px-4">
                        <span className="font-semibold text-white group-hover:text-amber-300 transition-colors">
                          {problem.title}
                        </span>
                        {problem.slug && (
                          <span className="block text-[11px] font-mono text-white/30 mt-0.5">
                            {problem.slug}
                          </span>
                        )}
                      </td>

                      {/* Section 6: Difficulty System (Subtle, dark, not overpowering) */}
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium tracking-wide ${
                          problem.difficulty === 'Easy'
                            ? 'bg-emerald-500/10 text-emerald-300/90 border border-emerald-500/20'
                            : problem.difficulty === 'Medium'
                            ? 'bg-amber-500/10 text-amber-300/90 border border-amber-500/20'
                            : 'bg-rose-500/10 text-rose-300/90 border border-rose-500/20'
                        }`}>
                          {problem.difficulty}
                        </span>
                      </td>

                      {/* Topics */}
                      <td className="py-4 px-4 text-white/70">
                        {problem.topic}
                      </td>

                      {/* Pattern */}
                      <td className="py-4 px-4">
                        <span className="rounded-lg bg-white/[0.03] border border-white/[0.06] px-2 py-1 text-[11px] text-white/80 font-medium">
                          {problem.pattern}
                        </span>
                      </td>

                      {/* Estimated Time */}
                      <td className="py-4 px-4 text-white/50 font-mono text-[11px]">
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3 w-3 text-white/30" />
                          <span>{problem.estimatedTime}</span>
                        </div>
                      </td>

                      {/* Bookmark / Saved Action */}
                      <td 
                        className="py-4 pr-6 pl-2 text-center" 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          onToggleSave(problem.id); 
                        }}
                      >
                        <button 
                          className="p-1.5 rounded-lg text-white/30 hover:text-amber-400 hover:bg-white/[0.04] transition-colors"
                          title={isSaved ? "Remove from saved" : "Save problem"}
                          aria-label={isSaved ? "Saved" : "Save"}
                        >
                          {isSaved ? (
                            <BookmarkCheck className="h-4 w-4 text-amber-400" />
                          ) : (
                            <Bookmark className="h-4 w-4" />
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>

          </table>
        </div>
      </div>

    </div>
  );
};
