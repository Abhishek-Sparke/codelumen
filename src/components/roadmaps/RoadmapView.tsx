import React, { useState, useMemo } from 'react';
import { 
  CheckCircle2, Circle, ArrowRight, Clock, 
  Zap, Compass, ChevronRight, Sparkles, BookOpen, Layers, Bot, X
} from 'lucide-react';
import { UserProfile, Problem } from '../../types';
import { 
  ROADMAP_SECTIONS_DATA, 
  ROADMAP_PROBLEMS_MAPPING, 
  ProblemDatabase 
} from '../../services/problemDatabase';
import { FeatureFlagService } from '../../services/featureFlags';

interface RoadmapViewProps {
  currentUser: UserProfile;
  onNavigateProblem: (problemId: string) => void;
  onNavigatePattern?: (patternId: string) => void;
}

const SECTION_PATTERN_MAP: Record<string, string> = {
  'sec-01': 'two-pointers',
  'sec-02': 'two-pointers',
  'sec-03': 'two-pointers',
  'sec-04': 'sliding-window',
  'sec-05': 'monotonic-stack',
  'sec-06': 'binary-search',
  'sec-07': 'fast-slow-pointers',
  'sec-08': 'tree-dfs-bfs',
  'sec-09': 'top-k-elements',
  'sec-10': 'backtracking',
  'sec-11': 'graph-traversal',
  'sec-12': '0-1-knapsack',
  'sec-13': 'two-pointers',
  'sec-14': 'two-pointers',
  'sec-15': 'two-pointers',
};

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  currentUser,
  onNavigateProblem,
  onNavigatePattern
}) => {
  // Determine suggested starting stage based on authentic experience level (with 0 fake solves)
  const suggestedStartingSectionId = useMemo(() => {
    if (currentUser.experienceLevel === 'Advanced') return 'sec-04';
    if (currentUser.experienceLevel === 'Intermediate') return 'sec-02';
    return 'sec-01';
  }, [currentUser.experienceLevel]);

  const [selectedSectionId, setSelectedSectionId] = useState<string>(suggestedStartingSectionId);
  const [showExplainModal, setShowExplainModal] = useState(false);

  // Calculate status for each section
  const sectionsWithStatus = useMemo(() => {
    return ROADMAP_SECTIONS_DATA.map((section, idx) => {
      const problemIds = ROADMAP_PROBLEMS_MAPPING[section.id] || [];
      const solvedIds = problemIds.filter(id => currentUser.solvedProblemIds.includes(id));
      const totalProblems = problemIds.length;
      const solvedCount = solvedIds.length;
      const progressPercent = totalProblems > 0 ? Math.round((solvedCount / totalProblems) * 100) : 0;
      
      let status: 'completed' | 'current' | 'upcoming' = 'upcoming';
      if (solvedCount === totalProblems && totalProblems > 0) {
        status = 'completed';
      } else if (section.id === selectedSectionId || (solvedCount > 0 && solvedCount < totalProblems) || section.id === suggestedStartingSectionId) {
        status = 'current';
      }

      return {
        ...section,
        problemIds,
        totalProblems,
        solvedCount,
        progressPercent,
        status,
        isSuggestedStart: section.id === suggestedStartingSectionId
      };
    });
  }, [currentUser.solvedProblemIds, selectedSectionId, suggestedStartingSectionId]);

  const selectedSection = sectionsWithStatus.find(s => s.id === selectedSectionId) || sectionsWithStatus[0];

  // Retrieve actual problem objects for the selected section
  const sectionProblems = useMemo(() => {
    return selectedSection.problemIds.map(id => {
      const prob = ProblemDatabase.getProblemById(id);
      const isSolved = currentUser.solvedProblemIds.includes(id);
      const isAttempted = currentUser.attemptedProblemIds.includes(id);
      return { problem: prob, isSolved, isAttempted };
    }).filter((item): item is { problem: Problem; isSolved: boolean; isAttempted: boolean } => item.problem !== undefined);
  }, [selectedSection.problemIds, currentUser.solvedProblemIds, currentUser.attemptedProblemIds]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 animate-in fade-in duration-200">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-[11px] font-semibold text-amber-400">
            <Compass className="h-3 w-3" />
            <span>Structured Path</span>
          </div>
          <h1 className="mt-2.5 font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            DSA Interview Roadmap
          </h1>
          <p className="mt-1 text-sm text-white/50 max-w-2xl leading-relaxed">
            Your journey starts here. 15 pattern-based milestones engineered to build intuitive problem recognition from fundamental structures through dynamic programming and bit manipulation.
          </p>
        </div>

        {/* Level Starting Point Indicator */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#0c0c11] p-3.5 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400/10 text-amber-400">
            <Zap className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono text-white/40 block">Starting Focus</span>
            <span className="text-xs font-bold text-white">
              {currentUser.experienceLevel || 'Beginner'} Track
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Timeline (15 Sections) & Right Section Detail */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Sections List */}
        <div className="lg:col-span-5 space-y-2.5 max-h-[calc(100vh-14rem)] overflow-y-auto pr-1">
          {sectionsWithStatus.map((sec) => {
            const isSelected = sec.id === selectedSectionId;

            return (
              <div
                key={sec.id}
                onClick={() => setSelectedSectionId(sec.id)}
                className={`glass-panel cursor-pointer rounded-2xl p-4 border transition-all ${
                  isSelected
                    ? 'border-amber-400/50 bg-amber-500/10 shadow-lg shadow-amber-500/10'
                    : 'border-white/[0.08] hover:border-white/20 hover:bg-white/[0.03]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {/* Status icon: Completed ✓, Current ⚡, Upcoming ○ */}
                    {sec.status === 'completed' ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    ) : sec.isSuggestedStart ? (
                      <Zap className="h-4 w-4 text-amber-400 shrink-0" />
                    ) : (
                      <Circle className="h-4 w-4 text-white/30 shrink-0" />
                    )}

                    <h3 className="font-display text-xs sm:text-sm font-bold text-white">
                      {sec.name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-white/40">
                      {sec.solvedCount} / {sec.totalProblems}
                    </span>
                    <ChevronRight className={`h-4 w-4 transition-transform ${isSelected ? 'text-amber-400 translate-x-0.5' : 'text-white/20'}`} />
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-3">
                  <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        sec.status === 'completed'
                          ? 'bg-emerald-400'
                          : 'bg-gradient-to-r from-amber-400 to-amber-300'
                      }`}
                      style={{ width: `${sec.progressPercent}%` }}
                    />
                  </div>
                </div>

                <div className="mt-2 flex items-center justify-between text-[10px] text-white/40">
                  <span className="line-clamp-1">{sec.description}</span>
                  {sec.isSuggestedStart && (
                    <span className="rounded bg-amber-400/15 px-1.5 py-0.5 text-[9px] font-bold text-amber-300 uppercase tracking-wider shrink-0 ml-2">
                      Recommended
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Section Detail & Problem List */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-6 sm:p-8 border border-white/[0.1] bg-[#0c0c11] sticky top-24 space-y-6">
          
          <div className="border-b border-white/[0.08] pb-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-amber-400">
                Milestone Section {selectedSection.position < 10 ? `0${selectedSection.position}` : selectedSection.position}
              </span>
              <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-[11px] text-white/60">
                {selectedSection.solvedCount} of {selectedSection.totalProblems} Solved
              </span>
            </div>

            <h2 className="mt-2 font-display text-2xl font-bold text-white">
              {selectedSection.name}
            </h2>
            <p className="mt-2 text-xs text-white/60 leading-relaxed">
              {selectedSection.description}
            </p>

            {/* Starting track callout */}
            {selectedSection.isSuggestedStart && (
              <div className="mt-4 flex items-center gap-2.5 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-xs text-amber-300">
                <Sparkles className="h-4 w-4 shrink-0 text-amber-400" />
                <span>
                  This section is your curated starting point based on your {currentUser.experienceLevel || 'Beginner'} profile setting.
                </span>
              </div>
            )}

            {/* Quick Actions: Learn Pattern & Solve Next Problem */}
            <div className="mt-4 flex flex-wrap items-center gap-3 pt-2">
              {onNavigatePattern && (
                <button
                  onClick={() => onNavigatePattern(SECTION_PATTERN_MAP[selectedSection.id] || 'two-pointers')}
                  className="flex items-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/20 transition-colors"
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>Study Pattern Guide</span>
                </button>
              )}
              {FeatureFlagService.getFlag('SPARK_AI') && (
                <button
                  onClick={() => setShowExplainModal(true)}
                  className="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 transition-colors"
                >
                  <Bot className="h-3.5 w-3.5 text-amber-400" />
                  <span>Explain with Spark</span>
                </button>
              )}
              {sectionProblems.find(sp => !sp.isSolved) && (
                <button
                  onClick={() => onNavigateProblem(sectionProblems.find(sp => !sp.isSolved)!.problem.id)}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-4 py-2 text-xs font-bold text-black shadow-md shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-transform"
                >
                  <Zap className="h-3.5 w-3.5 fill-black" />
                  <span>Solve: {sectionProblems.find(sp => !sp.isSolved)!.problem.title} →</span>
                </button>
              )}
            </div>
          </div>

          {/* Problems in this stage */}
          <div>
            <h3 className="font-display text-sm font-bold text-white mb-3">
              Section Problems ({sectionProblems.length})
            </h3>

            <div className="space-y-2">
              {sectionProblems.map(({ problem, isSolved, isAttempted }) => (
                <div
                  key={problem.id}
                  onClick={() => onNavigateProblem(problem.id)}
                  className="flex items-center justify-between rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 cursor-pointer hover:bg-white/[0.05] hover:border-amber-400/20 transition-all"
                >
                  <div className="flex items-center gap-3">
                    {isSolved ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    ) : isAttempted ? (
                      <span className="h-4 w-4 rounded-full border-2 border-amber-400/80 border-t-transparent animate-spin shrink-0" />
                    ) : (
                      <Circle className="h-4 w-4 text-white/20 shrink-0" />
                    )}
                    <div>
                      <span className="font-semibold text-xs text-white">
                        {problem.title}
                      </span>
                      <span className="block text-[11px] text-white/40">
                        {problem.pattern} · Topic: {problem.topic}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                      problem.difficulty === 'Easy'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : problem.difficulty === 'Medium'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {problem.difficulty}
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 text-white/40" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer CTA */}
          <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs text-white/40">
            <span>{selectedSection.totalProblems} curated challenges</span>
            {sectionProblems[0] && (
              <button
                onClick={() => onNavigateProblem(sectionProblems[0].problem.id)}
                className="rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-5 py-2 text-xs font-bold text-black shadow-md shadow-amber-500/20 hover:scale-105 active:scale-95 transition-transform"
              >
                Practice Section
              </button>
            )}
          </div>

        </div>

      </div>

      {/* Phase 6: Topic Explanation Modal (Req 19) */}
      {showExplainModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in zoom-in-95 duration-150">
          <div className="max-w-xl w-full rounded-2xl border border-amber-500/30 bg-[#0d0d14] p-6 space-y-4 shadow-2xl shadow-amber-500/10 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2 text-amber-400">
                <Bot className="h-5 w-5" />
                <h3 className="font-bold text-sm text-white">Spark Topic Mentor: {selectedSection.name}</h3>
              </div>
              <button
                onClick={() => setShowExplainModal(false)}
                className="text-white/40 hover:text-white text-xs p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-white/70">
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 space-y-1">
                <span className="font-bold text-white block text-xs">📌 Prerequisites</span>
                <p className="text-[11px] text-white/60">
                  Solid understanding of zero-indexed arrays, pointer increments/decrements, and basic hash table lookup semantics.
                </p>
              </div>

              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 space-y-1">
                <span className="font-bold text-amber-300 block text-xs">⚡ Core Concepts</span>
                <p className="text-[11px] text-white/60">
                  {selectedSection.description}
                </p>
              </div>

              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 space-y-1">
                <span className="font-bold text-cyan-300 block text-xs">🔍 Recognition Clues</span>
                <ul className="text-[11px] text-white/60 list-disc pl-4 space-y-0.5">
                  <li>Input is sorted or ordered pairs are queried.</li>
                  <li>Requirement asks for continuous subarrays or optimization of sliding window criteria.</li>
                  <li>Targeting linear O(n) or logarithmic O(log n) time constraints where brute force is O(n²).</li>
                </ul>
              </div>

              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 space-y-1">
                <span className="font-bold text-rose-300 block text-xs">⚠️ Common Mistakes</span>
                <ul className="text-[11px] text-white/60 list-disc pl-4 space-y-0.5">
                  <li>Off-by-one errors on pointer bounds (e.g. left &lt; right vs left &lt;= right).</li>
                  <li>Premature termination before evaluating duplicate elements.</li>
                  <li>Failing to reset window state when sliding right boundary forward.</li>
                </ul>
              </div>

              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 space-y-2">
                <span className="font-bold text-emerald-300 block text-xs">🎯 Curated CodeSpark Problems</span>
                <div className="flex flex-wrap gap-1.5">
                  {sectionProblems.slice(0, 4).map(sp => (
                    <button
                      key={sp.problem.id}
                      onClick={() => {
                        setShowExplainModal(false);
                        onNavigateProblem(sp.problem.id);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-amber-400 hover:text-black border border-white/10 text-[11px] text-white/80 transition-all font-medium"
                    >
                      {sp.problem.title} ({sp.problem.difficulty})
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowExplainModal(false)}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs transition-colors"
              >
                Understood, Let&apos;s Practice
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
