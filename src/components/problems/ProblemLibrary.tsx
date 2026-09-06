import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { 
  Search, CheckCircle2, Bookmark, BookmarkCheck, 
  X, Sparkles, Clock, RefreshCw, Layers, Compass,
  Shuffle, ArrowUpDown, ChevronDown, Circle, Minus,
  RotateCcw, Filter, Eye
} from 'lucide-react';
import { Problem, UserProfile } from '../../types';
import { ProblemDatabase } from '../../services/problemDatabase';
import { Link } from '../../router/Link';

interface ProblemLibraryProps {
  currentUser: UserProfile;
  initialFilter?: string;
  onNavigate: (view: string, param?: string) => void;
  onToggleSave: (problemId: string) => void;
}

type StatusTab = 'all' | 'unsolved' | 'solved' | 'attempted' | 'saved' | 'revisit';
type SortOption = 'default' | 'difficulty-asc' | 'difficulty-desc' | 'acceptance' | 'newest' | 'title-asc' | 'progress';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'default', label: 'Default Order' },
  { value: 'difficulty-asc', label: 'Difficulty ↑' },
  { value: 'difficulty-desc', label: 'Difficulty ↓' },
  { value: 'acceptance', label: 'Acceptance Rate' },
  { value: 'newest', label: 'Newest First' },
  { value: 'title-asc', label: 'Title A–Z' },
  { value: 'progress', label: 'My Progress' },
];

export const ProblemLibrary: React.FC<ProblemLibraryProps> = ({
  currentUser,
  initialFilter = 'all',
  onNavigate,
  onToggleSave
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [activeTab, setActiveTab] = useState<StatusTab>(
    initialFilter === 'saved' ? 'saved' : 'all'
  );
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [topicFilter, setTopicFilter] = useState<string>('all');
  const [patternFilter, setPatternFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 25;

  const searchRef = useRef<HTMLInputElement>(null);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPage(1);
    }, 200);
    return () => clearTimeout(handler);
  }, [searchInput]);

  // Keyboard shortcut: '/' to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
        const target = e.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return;
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const topics = useMemo(() => ProblemDatabase.getUniqueTopics(), []);
  const patterns = useMemo(() => ProblemDatabase.getUniquePatterns(), []);
  const problemCounts = useMemo(() => ProblemDatabase.getProblemCounts(), []);
  const userSolveCounts = useMemo(
    () => ProblemDatabase.getUserSolveCounts(currentUser.id), 
    [currentUser.id, currentUser.solvedProblemIds.length]
  );

  // Fetch and filter problems
  const { filteredProblems, totalCount } = useMemo(() => {
    const result = ProblemDatabase.getProblems({
      search: debouncedSearch,
      difficulty: difficultyFilter,
      topic: topicFilter,
      pattern: patternFilter,
      status: activeTab === 'revisit' ? 'all' : activeTab,
      userId: currentUser.id
    });

    let problems = result.problems;

    // Handle revisit tab
    if (activeTab === 'revisit') {
      const revisitIds = new Set(currentUser.revisitProblemIds || []);
      problems = problems.filter(p => revisitIds.has(p.id));
    }

    // Apply sorting
    if (sortBy !== 'default') {
      problems = ProblemDatabase.sortProblems(problems, sortBy);
    }

    return { filteredProblems: problems, totalCount: problems.length };
  }, [debouncedSearch, difficultyFilter, topicFilter, patternFilter, activeTab, sortBy, currentUser.id, currentUser.solvedProblemIds.length, currentUser.revisitProblemIds]);

  // Paginate
  const displayedProblems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredProblems.slice(start, start + pageSize);
  }, [filteredProblems, page]);

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const hasActiveFilters = 
    difficultyFilter !== 'all' || 
    topicFilter !== 'all' || 
    patternFilter !== 'all' || 
    debouncedSearch.length > 0;

  const resetFilters = () => {
    setDifficultyFilter('all');
    setTopicFilter('all');
    setPatternFilter('all');
    setSearchInput('');
    setDebouncedSearch('');
    setActiveTab('all');
    setSortBy('default');
    setPage(1);
  };

  const handleRandomProblem = useCallback(() => {
    const problem = ProblemDatabase.getRandomProblem({
      userId: currentUser.id,
      difficulty: difficultyFilter !== 'all' ? difficultyFilter : undefined,
      topic: topicFilter !== 'all' ? topicFilter : undefined,
      pattern: patternFilter !== 'all' ? patternFilter : undefined,
    });
    if (problem) onNavigate('workspace', problem.id);
  }, [currentUser.id, difficultyFilter, topicFilter, patternFilter, onNavigate]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'solved': return <CheckCircle2 className="h-4 w-4 text-emerald-400" />;
      case 'attempted': return <Minus className="h-4 w-4 text-amber-400" />;
      default: return <Circle className="h-4 w-4 text-white/20" />;
    }
  };

  const getDifficultyStyle = (diff: string) => {
    switch (diff) {
      case 'Easy': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'Medium': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'Hard': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      default: return 'text-white/50 bg-white/5 border-white/10';
    }
  };

  const statusTabs: { id: StatusTab; label: string; count?: number }[] = [
    { id: 'all', label: 'All' },
    { id: 'unsolved', label: 'Unsolved' },
    { id: 'solved', label: 'Solved', count: currentUser.solvedProblemIds.length },
    { id: 'attempted', label: 'Attempted', count: currentUser.attemptedProblemIds.length },
    { id: 'saved', label: 'Saved', count: currentUser.savedProblemIds.length },
    { id: 'revisit', label: 'Review', count: (currentUser.revisitProblemIds || []).length },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-[11px] font-semibold text-amber-400">
            <Sparkles className="h-3 w-3" />
            <span>CodeSpark Curriculum</span>
          </div>
          <h1 className="mt-2.5 font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Practice Problems
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-white/50 max-w-2xl leading-relaxed">
            Master algorithms and data structures through structured practice. {problemCounts.total} problems across {topics.length} topics.
          </p>
        </div>

        {/* Solve Stats */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] px-5 py-3">
            <div className="text-center">
              <span className="block text-lg font-bold text-emerald-400">{userSolveCounts.easy}</span>
              <span className="text-[10px] text-white/40 uppercase tracking-wider">Easy</span>
            </div>
            <div className="h-6 w-px bg-white/[0.08]" />
            <div className="text-center">
              <span className="block text-lg font-bold text-amber-400">{userSolveCounts.medium}</span>
              <span className="text-[10px] text-white/40 uppercase tracking-wider">Med</span>
            </div>
            <div className="h-6 w-px bg-white/[0.08]" />
            <div className="text-center">
              <span className="block text-lg font-bold text-rose-400">{userSolveCounts.hard}</span>
              <span className="text-[10px] text-white/40 uppercase tracking-wider">Hard</span>
            </div>
            <div className="h-6 w-px bg-white/[0.08]" />
            <div className="text-center">
              <span className="block text-lg font-bold text-white">{userSolveCounts.total}</span>
              <span className="text-[10px] text-white/40 uppercase tracking-wider">Total</span>
            </div>
          </div>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
        {statusTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setPage(1); }}
            className={`whitespace-nowrap rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
              activeTab === tab.id
                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                : 'text-white/50 hover:text-white/80 hover:bg-white/[0.04] border border-transparent'
            }`}
          >
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span className="ml-1.5 text-[10px] opacity-70">({tab.count})</span>
            )}
          </button>
        ))}
      </div>

      {/* Search + Sort + Filter + Random */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
          <input
            ref={searchRef}
            type="text"
            placeholder="Search problems by title, topic, or pattern... ( / )"
            className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] pl-10 pr-10 py-2.5 text-sm text-white placeholder-white/30 focus:border-amber-500/40 focus:outline-none focus:ring-1 focus:ring-amber-500/20 transition-colors"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
          />
          {searchInput && (
            <button
              onClick={() => { setSearchInput(''); setDebouncedSearch(''); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowSortDropdown(!showSortDropdown)}
            className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-xs font-medium text-white/70 hover:bg-white/[0.06] transition-colors"
          >
            <ArrowUpDown className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{SORT_OPTIONS.find(o => o.value === sortBy)?.label || 'Sort'}</span>
            <ChevronDown className="h-3 w-3" />
          </button>
          {showSortDropdown && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setShowSortDropdown(false)} />
              <div className="absolute right-0 top-full mt-1 z-40 w-48 rounded-xl border border-white/[0.1] bg-[#12121a] shadow-2xl py-1">
                {SORT_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => { setSortBy(opt.value); setShowSortDropdown(false); }}
                    className={`w-full text-left px-4 py-2 text-xs transition-colors ${
                      sortBy === opt.value ? 'text-amber-400 bg-amber-500/10' : 'text-white/70 hover:bg-white/[0.05]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Filter Toggle */}
        <button
          onClick={() => setShowFiltersPanel(!showFiltersPanel)}
          className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-medium transition-colors ${
            showFiltersPanel || hasActiveFilters
              ? 'border-amber-500/30 bg-amber-500/10 text-amber-300'
              : 'border-white/[0.08] bg-white/[0.03] text-white/70 hover:bg-white/[0.06]'
          }`}
        >
          <Filter className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Filters</span>
          {hasActiveFilters && <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />}
        </button>

        {/* Random Problem */}
        <button
          onClick={handleRandomProblem}
          className="flex items-center gap-2 rounded-xl border border-purple-500/20 bg-purple-500/10 px-4 py-2.5 text-xs font-semibold text-purple-300 hover:bg-purple-500/15 transition-colors"
        >
          <Shuffle className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Random</span>
        </button>
      </div>

      {/* Expandable Filters Panel */}
      {showFiltersPanel && (
        <div className="flex flex-wrap gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 animate-in slide-in-from-top-2 duration-150">
          {/* Difficulty */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold text-white/40 uppercase tracking-wider">Difficulty</label>
            <select
              value={difficultyFilter}
              onChange={e => { setDifficultyFilter(e.target.value); setPage(1); }}
              className="rounded-lg border border-white/[0.1] bg-[#0e0e14] px-3 py-1.5 text-xs text-white/80 focus:outline-none focus:border-amber-500/40"
            >
              <option value="all">All</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          {/* Topic */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold text-white/40 uppercase tracking-wider">Topic</label>
            <select
              value={topicFilter}
              onChange={e => { setTopicFilter(e.target.value); setPage(1); }}
              className="rounded-lg border border-white/[0.1] bg-[#0e0e14] px-3 py-1.5 text-xs text-white/80 focus:outline-none focus:border-amber-500/40"
            >
              <option value="all">All Topics</option>
              {topics.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {/* Pattern */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold text-white/40 uppercase tracking-wider">Pattern</label>
            <select
              value={patternFilter}
              onChange={e => { setPatternFilter(e.target.value); setPage(1); }}
              className="rounded-lg border border-white/[0.1] bg-[#0e0e14] px-3 py-1.5 text-xs text-white/80 focus:outline-none focus:border-amber-500/40"
            >
              <option value="all">All Patterns</option>
              {patterns.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          {hasActiveFilters && (
            <div className="flex items-end">
              <button
                onClick={resetFilters}
                className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[10px] font-semibold text-white/50 hover:text-white/80 transition-colors"
              >
                <RotateCcw className="h-3 w-3" />
                Clear All
              </button>
            </div>
          )}
        </div>
      )}

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-white/40">
        <span>
          Showing {displayedProblems.length} of {totalCount} problem{totalCount !== 1 ? 's' : ''}
          {hasActiveFilters && (
            <button onClick={resetFilters} className="ml-2 text-amber-400 hover:text-amber-300">
              Clear filters
            </button>
          )}
        </span>
        {totalPages > 1 && (
          <span>Page {page} of {totalPages}</span>
        )}
      </div>

      {/* Problem Table */}
      <div className="rounded-2xl border border-white/[0.06] overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-[40px_1fr_auto_auto_auto_40px] sm:grid-cols-[40px_1fr_100px_100px_90px_80px_40px] items-center gap-2 px-4 py-3 bg-white/[0.02] border-b border-white/[0.06] text-[10px] font-semibold text-white/40 uppercase tracking-wider">
          <span className="text-center">#</span>
          <span>Title</span>
          <span className="hidden sm:block">Topic</span>
          <span className="hidden sm:block">Pattern</span>
          <span className="text-center">Difficulty</span>
          <span className="hidden sm:block text-center">Accept</span>
          <span className="text-center">
            <Bookmark className="h-3 w-3 mx-auto" />
          </span>
        </div>

        {/* Problem Rows */}
        {displayedProblems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-white/30 space-y-3">
            <Compass className="h-10 w-10 text-white/15" />
            <p className="text-sm">No problems match your filters</p>
            <button onClick={resetFilters} className="text-xs text-amber-400 hover:text-amber-300">Reset filters</button>
          </div>
        ) : (
          displayedProblems.map((problem, idx) => {
            const isSaved = currentUser.savedProblemIds.includes(problem.id);
            const globalIdx = (page - 1) * pageSize + idx + 1;
            return (
              <Link
                key={problem.id}
                href={`/problems/${problem.slug || problem.id}`}
                className="grid grid-cols-[40px_1fr_auto_auto_auto_40px] sm:grid-cols-[40px_1fr_100px_100px_90px_80px_40px] items-center gap-2 px-4 py-3 border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors cursor-pointer group no-underline text-inherit block"
              >
                {/* Status Icon */}
                <div className="flex items-center justify-center">
                  {getStatusIcon(problem.userStatus)}
                </div>

                {/* Title */}
                <div className="min-w-0">
                  <span className="text-sm font-medium text-white group-hover:text-amber-300 transition-colors truncate block">
                    {problem.title}
                  </span>
                </div>

                {/* Topic */}
                <span className="hidden sm:block text-[11px] text-white/40 truncate">
                  {problem.topic}
                </span>

                {/* Pattern */}
                <span className="hidden sm:block text-[11px] text-white/30 truncate">
                  {problem.pattern}
                </span>

                {/* Difficulty Badge */}
                <div className="flex justify-center">
                  <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${getDifficultyStyle(problem.difficulty)}`}>
                    {problem.difficulty}
                  </span>
                </div>

                {/* Acceptance */}
                <span className="hidden sm:block text-center text-[11px] text-white/40 font-mono">
                  {problem.acceptance}
                </span>

                {/* Bookmark */}
                <button
                  type="button"
                  onClick={e => { e.preventDefault(); e.stopPropagation(); onToggleSave(problem.id); }}
                  className="flex items-center justify-center text-white/20 hover:text-amber-400 transition-colors cursor-pointer"
                  aria-label={isSaved ? 'Remove bookmark' : 'Bookmark problem'}
                >
                  {isSaved ? (
                    <BookmarkCheck className="h-4 w-4 text-amber-400" />
                  ) : (
                    <Bookmark className="h-4 w-4" />
                  )}
                </button>
              </Link>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
            className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs text-white/60 hover:bg-white/[0.06] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pageNum = page <= 3 ? i + 1 : page + i - 2;
            if (pageNum < 1 || pageNum > totalPages) return null;
            return (
              <button
                key={pageNum}
                onClick={() => setPage(pageNum)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  page === pageNum
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'border border-white/[0.08] bg-white/[0.03] text-white/60 hover:bg-white/[0.06]'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
          <button
            disabled={page >= totalPages}
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs text-white/60 hover:bg-white/[0.06] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};
