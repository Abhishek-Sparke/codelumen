import React, { useState } from 'react';
import { Layers, ArrowRight, CheckCircle2, Sparkles, Copy, Check } from 'lucide-react';
import { Problem } from '../../types';
import { ALL_PROBLEMS } from '../../data/problems';

interface EditorialTabProps {
  problem: Problem;
  onNavigateProblem: (problemId: string) => void;
}

export const EditorialTab: React.FC<EditorialTabProps> = ({
  problem,
  onNavigateProblem
}) => {
  const [activeApproach, setActiveApproach] = useState<'bruteForce' | 'better' | 'optimal'>('optimal');
  const [copied, setCopied] = useState(false);

  const editorial = problem.editorial;
  const currentApproach = activeApproach === 'bruteForce' 
    ? editorial.bruteForce 
    : activeApproach === 'better' && editorial.better 
    ? editorial.better 
    : editorial.optimal;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentApproach.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const similarProblems = (problem.similarProblemIds || [])
    .map(id => ALL_PROBLEMS.find(p => p.id === id))
    .filter(Boolean) as Problem[];

  return (
    <div className="h-full overflow-y-auto p-5 sm:p-6 space-y-6 text-xs leading-relaxed bg-[#0a0a0e] text-white/80">
      
      {/* Editorial Overview Header */}
      <div className="border-b border-white/[0.08] pb-4">
        <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider text-[10px]">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Official Editorial &amp; Analysis</span>
        </div>
        <h2 className="mt-2 font-display text-xl font-bold text-white">
          Understand the Solution
        </h2>
        <p className="mt-1 text-white/60 text-xs">
          {editorial.summary}
        </p>
      </div>

      {/* Approach selector pills */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setActiveApproach('optimal')}
          className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-semibold text-xs transition-colors ${
            activeApproach === 'optimal'
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
              : 'border border-white/10 text-white/60 hover:text-white'
          }`}
        >
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span>Optimal Approach ({editorial.optimal.complexity.time})</span>
        </button>

        {editorial.better && (
          <button
            onClick={() => setActiveApproach('better')}
            className={`rounded-xl px-3 py-1.5 font-semibold text-xs transition-colors ${
              activeApproach === 'better'
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                : 'border border-white/10 text-white/60 hover:text-white'
            }`}
          >
            Better Approach
          </button>
        )}

        <button
          onClick={() => setActiveApproach('bruteForce')}
          className={`rounded-xl px-3 py-1.5 font-semibold text-xs transition-colors ${
            activeApproach === 'bruteForce'
              ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
              : 'border border-white/10 text-white/60 hover:text-white'
          }`}
        >
          Brute Force ({editorial.bruteForce.complexity.time})
        </button>
      </div>

      {/* Selected Approach Breakdown */}
      <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-white/[0.08] space-y-4">
        
        {/* Title & Complexities */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] pb-3">
          <span className="font-display text-sm font-bold text-white">
            {currentApproach.name}
          </span>
          <div className="flex items-center gap-4 font-mono text-[11px]">
            <span className="text-white/60">
              Time: <strong className="text-emerald-400">{currentApproach.complexity.time}</strong>
            </span>
            <span className="text-white/60">
              Space: <strong className="text-cyan-400">{currentApproach.complexity.space}</strong>
            </span>
          </div>
        </div>

        {/* Explanation */}
        <p className="text-white/70 leading-relaxed text-xs">
          {currentApproach.explanation}
        </p>

        {/* Code Snippet Box */}
        <div className="relative rounded-xl border border-white/[0.08] bg-[#07070a] p-4 font-mono text-xs overflow-x-auto">
          <button
            onClick={handleCopy}
            className="absolute right-3 top-3 flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[10px] text-white/60 hover:text-white"
          >
            {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
          <pre className="text-white/90 leading-relaxed pt-2">
            <code>{currentApproach.code}</code>
          </pre>
        </div>

      </div>

      {/* Similar Problems Section */}
      {similarProblems.length > 0 && (
        <div className="border-t border-white/[0.08] pt-5">
          <h3 className="font-display text-sm font-bold text-white mb-3 flex items-center gap-1.5">
            <Layers className="h-4 w-4 text-amber-400" />
            <span>Try a similar problem</span>
          </h3>

          <div className="space-y-2">
            {similarProblems.map((sim) => (
              <button
                key={sim.id}
                onClick={() => onNavigateProblem(sim.id)}
                className="flex w-full items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-left hover:bg-white/[0.05] transition-colors"
              >
                <div>
                  <span className="font-semibold text-white/90">{sim.title}</span>
                  <span className="block text-[11px] text-white/40">{sim.pattern} · {sim.topic}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    sim.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                  }`}>
                    {sim.difficulty}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-white/40" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
