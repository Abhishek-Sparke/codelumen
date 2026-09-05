import React, { useMemo } from 'react';
import { Bookmark, BookmarkCheck, ArrowRight, Clock, Trash2 } from 'lucide-react';
import { UserProfile } from '../../types';
import { ProblemDatabase } from '../../services/problemDatabase';

interface SavedProblemsViewProps {
  currentUser: UserProfile;
  onNavigate: (view: string, param?: string) => void;
  onToggleSave: (problemId: string) => void;
}

export const SavedProblemsView: React.FC<SavedProblemsViewProps> = ({
  currentUser,
  onNavigate,
  onToggleSave
}) => {
  const savedProblems = useMemo(() => {
    return currentUser.savedProblemIds
      .map(id => ProblemDatabase.getProblemById(id))
      .filter((p): p is NonNullable<typeof p> => p !== undefined);
  }, [currentUser.savedProblemIds]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-in fade-in duration-200">
      
      {/* Page Title & Counter */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-[11px] font-semibold text-amber-400">
            <Bookmark className="h-3 w-3" />
            <span>Bookmarks</span>
          </div>
          <h1 className="mt-2.5 font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Saved Problems
          </h1>
          <p className="mt-1 text-sm text-white/50">
            Your personal queue of algorithmic challenges marked for revision and deliberate mastery.
          </p>
        </div>

        <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-3.5 py-2 text-xs text-white/60">
          <span className="font-semibold text-amber-400">{savedProblems.length}</span> saved
        </div>
      </div>

      {/* Empty State or List */}
      {savedProblems.length === 0 ? (
        <div className="glass-panel rounded-3xl border border-white/[0.08] p-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mb-4">
            <Bookmark className="h-6 w-6" />
          </div>
          <h2 className="text-base font-bold text-white">Nothing saved yet.</h2>
          <p className="mt-1 text-xs text-white/50 max-w-sm mx-auto">
            Save problems you want to revisit later.
          </p>
          <div className="mt-6">
            <button
              onClick={() => onNavigate('problems')}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-4 py-2.5 text-xs font-semibold text-black shadow-lg shadow-amber-500/20 hover:opacity-95 transition-opacity"
            >
              <span>Explore Problems</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {savedProblems.map((problem) => {
            const isSolved = currentUser.solvedProblemIds.includes(problem.id);
            const isAttempted = currentUser.attemptedProblemIds.includes(problem.id);

            return (
              <div
                key={problem.id}
                onClick={() => onNavigate('workspace', problem.id)}
                className="glass-panel group relative flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-[#0c0c11] p-5 cursor-pointer transition-all hover:border-amber-400/30 hover:shadow-xl hover:bg-[#101017]"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold ${
                      problem.difficulty === 'Easy'
                        ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                        : problem.difficulty === 'Medium'
                        ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                        : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                    }`}>
                      {problem.difficulty}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleSave(problem.id);
                      }}
                      className="rounded-lg p-1 text-white/40 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Unsave problem"
                      aria-label="Unsave"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <h3 className="font-semibold text-white group-hover:text-amber-300 transition-colors text-sm">
                    {problem.title}
                  </h3>

                  <p className="mt-1 text-xs text-white/50 line-clamp-2 leading-relaxed">
                    {problem.description}
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-3 text-[11px] text-white/40">
                  <span className="font-medium text-white/70">{problem.pattern}</span>
                  <div className="flex items-center gap-1.5 font-mono">
                    <Clock className="h-3 w-3" />
                    <span>{problem.estimatedTime}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
