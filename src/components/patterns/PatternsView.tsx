import React, { useState } from 'react';
import { Layers, Sparkles, CheckCircle2, ArrowRight, BookOpen, Clock, Code } from 'lucide-react';
import { UserProfile, PatternGuide } from '../../types';
import { PATTERNS_DATA } from '../../data/patterns';
import { ALL_PROBLEMS } from '../../data/problems';

interface PatternsViewProps {
  currentUser: UserProfile;
  initialPatternId?: string;
  onNavigateProblem: (problemId: string) => void;
}

export const PatternsView: React.FC<PatternsViewProps> = ({
  currentUser,
  initialPatternId,
  onNavigateProblem
}) => {
  const [selectedPatternId, setSelectedPatternId] = useState<string>(
    initialPatternId || PATTERNS_DATA[0].id
  );

  const selectedPattern = PATTERNS_DATA.find(p => p.id === selectedPatternId) || PATTERNS_DATA[0];

  // Calculate mastery level based on solved problems in this pattern
  const patternProblems = [...selectedPattern.beginnerProblemIds, ...selectedPattern.intermediateProblemIds, ...selectedPattern.advancedProblemIds];
  const solvedCount = patternProblems.filter(id => currentUser.solvedProblemIds.includes(id)).length;
  const masteryPercentage = patternProblems.length > 0 
    ? Math.round((solvedCount / patternProblems.length) * 100) 
    : 0;

  const getMasteryTier = (pct: number) => {
    if (pct >= 75) return { label: 'Mastered', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' };
    if (pct >= 50) return { label: 'Strong', color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' };
    if (pct >= 25) return { label: 'Familiar', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' };
    return { label: 'Beginner', color: 'text-white/60', bg: 'bg-white/5 border-white/10' };
  };

  const masteryTier = getMasteryTier(masteryPercentage);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      
      {/* Header */}
      <div>
        <span className="lumen-tag text-cyan-400">Algorithmic Archetypes</span>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          DSA Patterns Catalog
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-white/50 max-w-2xl leading-relaxed">
          The 10 reusable paradigms that power over 80% of technical interview questions. Understand invariants, recognition cues, and canonical solutions.
        </p>
      </div>

      {/* Pattern Grid / Detail Split */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Pattern selector pills */}
        <div className="lg:col-span-4 space-y-2.5">
          {PATTERNS_DATA.map((p) => {
            const isSelected = p.id === selectedPatternId;
            return (
              <div
                key={p.id}
                onClick={() => setSelectedPatternId(p.id)}
                className={`glass-panel cursor-pointer rounded-2xl p-4 border transition-all ${
                  isSelected
                    ? 'border-cyan-400/50 bg-cyan-500/10 shadow-lg shadow-cyan-500/10'
                    : 'border-white/[0.08] hover:border-white/20 hover:bg-white/[0.03]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-sm font-bold text-white">
                    {p.title}
                  </h3>
                  <span className="text-[10px] font-mono text-cyan-400">
                    {p.timeComplexity.split(' ')[0]}
                  </span>
                </div>
                <p className="mt-1 line-clamp-1 text-xs text-white/50">
                  {p.tagline}
                </p>
              </div>
            );
          })}
        </div>

        {/* Right: Comprehensive Pattern Detail Guide */}
        <div className="lg:col-span-8 glass-panel rounded-3xl p-6 sm:p-9 border border-white/[0.1] bg-[#0c0c11] space-y-8">
          
          {/* Header & Mastery Gauge */}
          <div className="border-b border-white/[0.08] pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <span className="lumen-tag text-cyan-400">Pattern Guide</span>
              <h2 className="mt-1 font-display text-2xl sm:text-3xl font-extrabold text-white">
                {selectedPattern.title}
              </h2>
              <p className="mt-1 text-xs text-white/60">
                {selectedPattern.tagline}
              </p>
            </div>

            {/* Mastery Meter */}
            <div className={`rounded-2xl border px-4 py-3 text-right ${masteryTier.bg}`}>
              <div className="flex items-center justify-end gap-2">
                <span className="text-[11px] text-white/50">Mastery:</span>
                <span className={`text-xs font-bold ${masteryTier.color}`}>
                  {masteryTier.label} ({masteryPercentage}%)
                </span>
              </div>
              <span className="text-[10px] text-white/40 block mt-0.5 font-mono">
                {solvedCount} / {patternProblems.length} problems solved
              </span>
            </div>
          </div>

          {/* ASCII Visual Diagram */}
          <div>
            <h3 className="font-display text-sm font-bold text-white mb-2 flex items-center gap-1.5">
              <Code className="h-4 w-4 text-amber-400" />
              <span>Visual Flow Diagram</span>
            </h3>
            <div className="rounded-2xl border border-white/[0.08] bg-[#07070a] p-4 font-mono text-[11px] text-white/85 leading-relaxed overflow-x-auto">
              <pre><code>{selectedPattern.diagramAscii.trim()}</code></pre>
            </div>
          </div>

          {/* When to use & Recognition cues */}
          <div className="grid sm:grid-cols-2 gap-6">
            
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 space-y-2">
              <h4 className="font-display text-xs font-bold text-white uppercase tracking-wider text-emerald-400">
                When to use
              </h4>
              <ul className="space-y-1.5 text-xs text-white/70 list-disc list-inside">
                {selectedPattern.whenToUse.map((item, idx) => (
                  <li key={idx} className="leading-relaxed">{item}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 space-y-2">
              <h4 className="font-display text-xs font-bold text-white uppercase tracking-wider text-amber-400">
                How to recognize
              </h4>
              <ul className="space-y-1.5 text-xs text-white/70 list-disc list-inside">
                {selectedPattern.howToRecognize.map((item, idx) => (
                  <li key={idx} className="leading-relaxed">{item}</li>
                ))}
              </ul>
            </div>

          </div>

          {/* Curated Problem Tiers */}
          <div className="space-y-4">
            <h3 className="font-display text-sm font-bold text-white">
              Curated Practice by Tier
            </h3>

            {/* Beginner problems */}
            <div>
              <span className="text-[11px] font-semibold text-emerald-400 block mb-2">
                Level 1 · Beginner Tier
              </span>
              <div className="space-y-1.5">
                {selectedPattern.beginnerProblemIds.map(id => {
                  const prob = ALL_PROBLEMS.find(p => p.id === id);
                  if (!prob) return null;
                  const isSolved = currentUser.solvedProblemIds.includes(id);
                  return (
                    <div
                      key={id}
                      onClick={() => onNavigateProblem(id)}
                      className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-xs cursor-pointer hover:bg-white/[0.05] transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        {isSolved ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <Layers className="h-4 w-4 text-white/30" />}
                        <span className="font-medium text-white">{prob.title}</span>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-white/40" />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Intermediate problems */}
            <div>
              <span className="text-[11px] font-semibold text-amber-400 block mb-2">
                Level 2 · Intermediate Tier
              </span>
              <div className="space-y-1.5">
                {selectedPattern.intermediateProblemIds.map(id => {
                  const prob = ALL_PROBLEMS.find(p => p.id === id);
                  if (!prob) return null;
                  const isSolved = currentUser.solvedProblemIds.includes(id);
                  return (
                    <div
                      key={id}
                      onClick={() => onNavigateProblem(id)}
                      className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-xs cursor-pointer hover:bg-white/[0.05] transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        {isSolved ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <Layers className="h-4 w-4 text-white/30" />}
                        <span className="font-medium text-white">{prob.title}</span>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-white/40" />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Advanced problems */}
            <div>
              <span className="text-[11px] font-semibold text-rose-400 block mb-2">
                Level 3 · Advanced Tier
              </span>
              <div className="space-y-1.5">
                {selectedPattern.advancedProblemIds.map(id => {
                  const prob = ALL_PROBLEMS.find(p => p.id === id);
                  if (!prob) return null;
                  const isSolved = currentUser.solvedProblemIds.includes(id);
                  return (
                    <div
                      key={id}
                      onClick={() => onNavigateProblem(id)}
                      className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-xs cursor-pointer hover:bg-white/[0.05] transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        {isSolved ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <Layers className="h-4 w-4 text-white/30" />}
                        <span className="font-medium text-white">{prob.title}</span>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-white/40" />
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
