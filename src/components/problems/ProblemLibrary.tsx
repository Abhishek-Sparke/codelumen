import React, { useState, useMemo } from 'react';
import { 
  Search, CheckCircle2, Circle, Bookmark, BookmarkCheck, 
  Filter, Sparkles, ArrowUpDown, ChevronRight, X 
} from 'lucide-react';
import { Problem, Difficulty, UserProfile } from '../../types';
import { ALL_PROBLEMS } from '../../data/problems';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'unsolved' | 'solved' | 'attempted' | 'saved'>(
    initialFilter === 'saved' ? 'saved' : 'all'
  );
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [topicFilter, setTopicFilter] = useState<string>('all');
  const [patternFilter, setPatternFilter] = useState<string>('all');
  const [companyFilter, setCompanyFilter] = useState<string>('all');

  // Extract unique topics, patterns, and companies
  const topics = useMemo(() => {
    return Array.from(new Set(ALL_PROBLEMS.map(p => p.topic))).sort();
  }, []);

  const patterns = useMemo(() => {
    return Array.from(new Set(ALL_PROBLEMS.map(p => p.pattern))).sort();
  }, []);

  const companies = ['Google', 'Meta', 'Amazon', 'Apple', 'Microsoft', 'Netflix', 'Bloomberg'];

  // Filtered problems list
  const filteredProblems = useMemo(() => {
    return ALL_PROBLEMS.filter(problem => {
      // Tab filter
      const isSolved = currentUser.solvedProblemIds.includes(problem.id);
      const isAttempted = currentUser.attemptedProblemIds.includes(problem.id);
      const isSaved = currentUser.savedProblemIds.includes(problem.id);

      if (activeTab === 'solved' && !isSolved) return false;
      if (activeTab === 'unsolved' && isSolved) return false;
      if (activeTab === 'attempted' && !isAttempted) return false;
      if (activeTab === 'saved' && !isSaved) return false;

      // Difficulty filter
      if (difficultyFilter !== 'all' && problem.difficulty !== difficultyFilter) return false;

      // Topic filter
      if (topicFilter !== 'all' && problem.topic !== topicFilter) return false;

      // Pattern filter
      if (patternFilter !== 'all' && problem.pattern !== patternFilter) return false;

      // Company filter
      if (companyFilter !== 'all' && !problem.companies.includes(companyFilter)) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = problem.title.toLowerCase().includes(q);
        const matchesTopic = problem.topic.toLowerCase().includes(q);
        const matchesPattern = problem.pattern.toLowerCase().includes(q);
        const matchesCompany = problem.companies.some(c => c.toLowerCase().includes(q));
        if (!matchesTitle && !matchesTopic && !matchesPattern && !matchesCompany) return false;
      }

      return true;
    });
  }, [searchQuery, activeTab, difficultyFilter, topicFilter, patternFilter, companyFilter, currentUser]);

  const hasActiveFilters = difficultyFilter !== 'all' || topicFilter !== 'all' || patternFilter !== 'all' || companyFilter !== 'all';

  const resetFilters = () => {
    setDifficultyFilter('all');
    setTopicFilter('all');
    setPatternFilter('all');
    setCompanyFilter('all');
    setSearchQuery('');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Page Header */}
      <div>
        <span className="lumen-tag text-amber-400">Library Catalog</span>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Problems
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-white/50">
          50+ original algorithmic challenges across all major interview patterns.
        </p>
      </div>

      {/* SEARCH AND FILTERS BAR */}
      <div className="glass-panel rounded-3xl p-5 border border-white/[0.08] space-y-4">
        
        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-4 top-3.5 h-4 w-4 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search problems, patterns, companies (e.g. 'Two Sum', 'Sliding Window', 'Google')..."
            className="w-full rounded-2xl border border-white/[0.08] bg-white/[0.03] pl-11 pr-4 py-3 text-xs text-white placeholder:text-white/30 focus:border-amber-400/50 focus:outline-none focus:ring-1 focus:ring-amber-400/30"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-3.5 text-white/40 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Dropdown Filters Row */}
        <div className="flex flex-wrap items-center gap-2.5">
          
          {/* Difficulty select */}
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="rounded-xl border border-white/[0.08] bg-[#14141b] px-3 py-2 text-xs text-white/80 focus:outline-none focus:border-amber-400/50"
          >
            <option value="all">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          {/* Topic select */}
          <select
            value={topicFilter}
            onChange={(e) => setTopicFilter(e.target.value)}
            className="rounded-xl border border-white/[0.08] bg-[#14141b] px-3 py-2 text-xs text-white/80 focus:outline-none focus:border-amber-400/50"
          >
            <option value="all">All Topics</option>
            {topics.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          {/* Pattern select */}
          <select
            value={patternFilter}
            onChange={(e) => setPatternFilter(e.target.value)}
            className="rounded-xl border border-white/[0.08] bg-[#14141b] px-3 py-2 text-xs text-white/80 focus:outline-none focus:border-amber-400/50"
          >
            <option value="all">All Patterns</option>
            {patterns.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>

          {/* Company select */}
          <select
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
            className="rounded-xl border border-white/[0.08] bg-[#14141b] px-3 py-2 text-xs text-white/80 focus:outline-none focus:border-amber-400/50"
          >
            <option value="all">All Companies</option>
            {companies.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="rounded-xl px-3 py-2 text-xs text-amber-400 font-semibold hover:bg-amber-400/10 transition-colors"
            >
              Reset Filters
            </button>
          )}

        </div>

      </div>

      {/* TABS (All, Unsolved, Solved, Attempted, Saved) */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-3">
        <div className="flex items-center gap-1">
          {[
            { id: 'all', label: `All (${ALL_PROBLEMS.length})` },
            { id: 'unsolved', label: 'Unsolved' },
            { id: 'solved', label: `Solved (${currentUser.solvedProblemIds.length})` },
            { id: 'attempted', label: 'Attempted' },
            { id: 'saved', label: `Saved (${currentUser.savedProblemIds.length})` },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`rounded-full px-4 py-1.5 text-xs font-medium tracking-wide transition-all ${
                  isActive
                    ? 'bg-white/10 text-white font-semibold shadow-sm'
                    : 'text-white/50 hover:bg-white/[0.04] hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <span className="text-xs text-white/40 font-mono">
          Showing {filteredProblems.length} problems
        </span>
      </div>

      {/* PROBLEMS TABLE */}
      <div className="glass-panel overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0b0b10]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            
            {/* Table Header */}
            <thead className="border-b border-white/[0.08] bg-[#0e0e14] text-[11px] font-semibold text-white/50 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 pl-6 pr-2 w-12 text-center">Status</th>
                <th className="py-3.5 px-4">Problem</th>
                <th className="py-3.5 px-4">Difficulty</th>
                <th className="py-3.5 px-4">Acceptance</th>
                <th className="py-3.5 px-4">Pattern</th>
                <th className="py-3.5 px-4">Companies</th>
                <th className="py-3.5 pr-6 pl-2 w-16 text-center">Save</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-white/[0.04]">
              {filteredProblems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-xs text-white/40">
                    No problems match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredProblems.map((problem) => {
                  const isSolved = currentUser.solvedProblemIds.includes(problem.id);
                  const isAttempted = currentUser.attemptedProblemIds.includes(problem.id);
                  const isSaved = currentUser.savedProblemIds.includes(problem.id);

                  return (
                    <tr
                      key={problem.id}
                      onClick={() => onNavigate('workspace', problem.id)}
                      className="group cursor-pointer transition-colors hover:bg-white/[0.04]"
                    >
                      {/* Status Icon */}
                      <td className="py-4 pl-6 pr-2 text-center" onClick={(e) => e.stopPropagation()}>
                        {isSolved ? (
                          <CheckCircle2 className="mx-auto h-4 w-4 text-emerald-400" />
                        ) : isAttempted ? (
                          <Circle className="mx-auto h-3.5 w-3.5 text-amber-400 fill-amber-400/20" />
                        ) : (
                          <Circle className="mx-auto h-3.5 w-3.5 text-white/20" />
                        )}
                      </td>

                      {/* Problem Title & Topic */}
                      <td className="py-4 px-4">
                        <span className="font-semibold text-white group-hover:text-amber-300 transition-colors">
                          {problem.title}
                        </span>
                        <span className="block text-[11px] text-white/40 mt-0.5">
                          {problem.topic}
                        </span>
                      </td>

                      {/* Difficulty */}
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                          problem.difficulty === 'Easy'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : problem.difficulty === 'Medium'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}>
                          {problem.difficulty}
                        </span>
                      </td>

                      {/* Acceptance Rate */}
                      <td className="py-4 px-4 font-mono text-white/60 text-[11px]">
                        {problem.acceptance}
                      </td>

                      {/* Pattern */}
                      <td className="py-4 px-4 text-white/70 font-medium">
                        {problem.pattern}
                      </td>

                      {/* Companies Chips */}
                      <td className="py-4 px-4">
                        <div className="flex flex-wrap gap-1">
                          {problem.companies.slice(0, 3).map((comp, cIdx) => (
                            <span
                              key={cIdx}
                              className="rounded-md border border-white/[0.06] bg-white/[0.02] px-1.5 py-0.5 text-[10px] text-white/50"
                            >
                              {comp}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Bookmark action */}
                      <td className="py-4 pr-6 pl-2 text-center" onClick={(e) => { e.stopPropagation(); onToggleSave(problem.id); }}>
                        <button className="p-1 rounded text-white/40 hover:text-amber-400 transition-colors">
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
