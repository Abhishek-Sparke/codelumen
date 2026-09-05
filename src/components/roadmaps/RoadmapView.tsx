import React, { useState } from 'react';
import { 
  Map, CheckCircle2, Circle, ArrowRight, Clock, 
  Layers, Compass, ChevronRight 
} from 'lucide-react';
import { UserProfile, RoadmapStage } from '../../types';
import { ROADMAP_STAGES } from '../../data/roadmaps';
import { ALL_PROBLEMS } from '../../data/problems';

interface RoadmapViewProps {
  currentUser: UserProfile;
  onNavigateProblem: (problemId: string) => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  currentUser,
  onNavigateProblem
}) => {
  const [selectedStageId, setSelectedStageId] = useState<string>(ROADMAP_STAGES[0].id);

  const selectedStage = ROADMAP_STAGES.find(s => s.id === selectedStageId) || ROADMAP_STAGES[0];

  // Stage problems with user solved status
  const stageProblems = selectedStage.problemIds.map(id => {
    const p = ALL_PROBLEMS.find(prob => prob.id === id);
    const isSolved = currentUser.solvedProblemIds.includes(id);
    return { problem: p, isSolved };
  }).filter(item => item.problem !== undefined);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      
      {/* Header */}
      <div>
        <span className="lumen-tag text-amber-400">Curriculum Path</span>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          DSA Interview Roadmap
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-white/50 max-w-2xl leading-relaxed">
          17 pattern-based stages engineered to build algorithmic intuition systematically from fundamentals to advanced dynamic programming and graph theory.
        </p>
      </div>

      {/* Main Grid: Left Stage Navigator & Right Stage Detail */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Stages Timeline List */}
        <div className="lg:col-span-5 space-y-3">
          {ROADMAP_STAGES.map((stage) => {
            const isSelected = stage.id === selectedStageId;
            const solvedCount = stage.problemIds.filter(id => currentUser.solvedProblemIds.includes(id)).length;
            const percent = Math.round((solvedCount / stage.problemIds.length) * 100);

            return (
              <div
                key={stage.id}
                onClick={() => setSelectedStageId(stage.id)}
                className={`glass-panel cursor-pointer rounded-2xl p-4.5 border transition-all ${
                  isSelected
                    ? 'border-amber-400/50 bg-amber-500/10 shadow-lg shadow-amber-500/10'
                    : 'border-white/[0.08] hover:border-white/20 hover:bg-white/[0.03]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-bold text-amber-400">
                      {stage.order < 10 ? `0${stage.order}` : stage.order}
                    </span>
                    <h3 className="font-display text-sm font-bold text-white">
                      {stage.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-white/40">
                      {solvedCount} / {stage.problemIds.length}
                    </span>
                    <ChevronRight className={`h-4 w-4 transition-transform ${isSelected ? 'text-amber-400 translate-x-0.5' : 'text-white/20'}`} />
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-3">
                  <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-amber-300 rounded-full transition-all duration-300"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>

                <div className="mt-2.5 flex items-center justify-between text-[10px] text-white/40">
                  <span>{stage.difficultyRange}</span>
                  <span>~{stage.estimatedHours} hrs</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Stage Detail & Problems Card */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-6 sm:p-8 border border-white/[0.1] bg-[#0c0c11] sticky top-24 space-y-6">
          
          <div className="border-b border-white/[0.08] pb-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-amber-400">
                Stage {selectedStage.order < 10 ? `0${selectedStage.order}` : selectedStage.order}
              </span>
              <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-[11px] text-white/60">
                {selectedStage.difficultyRange}
              </span>
            </div>

            <h2 className="mt-2 font-display text-2xl font-bold text-white">
              {selectedStage.title}
            </h2>
            <p className="mt-2 text-xs text-white/60 leading-relaxed">
              {selectedStage.description}
            </p>
          </div>

          {/* Problems in this stage */}
          <div>
            <h3 className="font-display text-sm font-bold text-white mb-3">
              Stage Problems ({stageProblems.length})
            </h3>

            <div className="space-y-2">
              {stageProblems.map(({ problem, isSolved }) => {
                if (!problem) return null;
                return (
                  <div
                    key={problem.id}
                    onClick={() => onNavigateProblem(problem.id)}
                    className="flex items-center justify-between rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 cursor-pointer hover:bg-white/[0.05] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {isSolved ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                      ) : (
                        <Circle className="h-4 w-4 text-white/20 shrink-0" />
                      )}
                      <div>
                        <span className="font-semibold text-xs text-white">
                          {problem.title}
                        </span>
                        <span className="block text-[11px] text-white/40">
                          {problem.pattern}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        problem.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400' : problem.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400' : 'bg-rose-500/10 text-rose-400'
                      }`}>
                        {problem.difficulty}
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 text-white/40" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs text-white/40">
            <span>Estimated completion time: {selectedStage.estimatedHours} hours</span>
            <button
              onClick={() => stageProblems[0]?.problem && onNavigateProblem(stageProblems[0].problem.id)}
              className="rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-5 py-2 text-xs font-bold text-black shadow-md shadow-amber-500/20 hover:scale-105 active:scale-95 transition-transform"
            >
              Start Stage
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
