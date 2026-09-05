import React, { useState } from 'react';
import { Play, Sparkles, CheckCircle2, ArrowRight, Terminal } from 'lucide-react';

interface LandingHeroProps {
  onStartCoding: () => void;
  onExploreRoadmap: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onStartCoding,
  onExploreRoadmap
}) => {
  const [activeLang, setActiveLang] = useState<'python' | 'javascript'>('python');
  const [isRunning, setIsRunning] = useState(false);
  const [runResult, setRunResult] = useState<{
    status: string;
    runtime: string;
    memory: string;
    passed: string;
  } | null>({
    status: 'Accepted',
    runtime: '72 ms',
    memory: '14.2 MB',
    passed: '3 / 3 test cases passed'
  });

  const samplePythonCode = `def two_sum(nums: list[int], target: int) -> list[int]:
    # Single-pass Hash Map pattern
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`;

  const sampleJsCode = `function twoSum(nums, target) {
  // Single-pass Hash Map pattern
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (seen.has(complement)) {
      return [seen.get(complement), i];
    }
    seen.set(nums[i], i);
  }
  return [];
}`;

  const handleRunDemo = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setRunResult({
        status: 'Accepted',
        runtime: '72 ms',
        memory: '14.2 MB',
        passed: '3 / 3 test cases passed'
      });
    }, 450);
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
      
      {/* Background ambient auras */}
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[500px] w-[850px] -z-10 rounded-full bg-gradient-to-b from-amber-500/10 via-cyan-500/5 to-transparent blur-3xl opacity-75" />
      <div className="pointer-events-none absolute right-1/4 top-1/3 h-64 w-64 -z-10 rounded-full bg-amber-500/10 blur-[100px]" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
        
        {/* CodeSpark badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3.5 py-1.5 text-xs text-amber-300 backdrop-blur-md shadow-sm">
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          <span className="font-semibold uppercase tracking-[0.2em] text-[11px]">
            THE MODERN WAY TO MASTER DSA
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="mt-7 font-display text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl leading-[1.08]">
          Master coding.<br />
          <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 bg-clip-text text-transparent">
            One problem at a time.
          </span>
        </h1>

        {/* Supporting text */}
        <p className="mx-auto mt-6 max-w-2xl text-sm sm:text-base leading-relaxed text-white/60">
          Build problem-solving skills through structured roadmaps, deliberate practice, and an AI coach that helps you learn without giving away the answer.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
          <button
            onClick={onStartCoding}
            className="group flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-400 to-amber-500 px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-black shadow-lg shadow-amber-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Start Coding</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
          
          <button
            onClick={onExploreRoadmap}
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-8 py-3.5 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-md transition-all hover:border-white/30 hover:bg-white/[0.08]"
          >
            Explore Roadmap
          </button>
        </div>

        {/* Hero Visual: Interactive Coding Workspace Preview */}
        <div className="relative mt-14 sm:mt-18">
          
          {/* Subtle glowing border aura */}
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-amber-500/20 via-cyan-500/10 to-amber-500/20 opacity-70 blur-xl transition-all duration-700 -z-10" />

          <div className="glass-panel overflow-hidden rounded-3xl border border-white/[0.14] bg-[#0c0c11] text-left shadow-[0_30px_90px_-20px_rgba(0,0,0,0.9)]">
            
            {/* Top Workspace Header Bar */}
            <div className="flex flex-wrap items-center justify-between border-b border-white/[0.08] bg-[#0f0f15] px-4 py-3 sm:px-6">
              
              {/* Problem info */}
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-rose-500/40 border border-rose-500/60" />
                  <div className="h-3 w-3 rounded-full bg-amber-500/40 border border-amber-500/60" />
                  <div className="h-3 w-3 rounded-full bg-emerald-500/40 border border-emerald-500/60" />
                </div>
                <div className="h-4 w-[1px] bg-white/10 mx-1" />
                <span className="text-xs font-bold text-white">01. Two Sum</span>
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
                  Easy
                </span>
                <span className="hidden sm:inline text-[11px] text-white/40">
                  Array · Hash Map
                </span>
              </div>

              {/* Language Switcher & Run Button */}
              <div className="flex items-center gap-2.5">
                <div className="flex rounded-lg bg-white/5 p-0.5 border border-white/10 text-[11px]">
                  <button
                    onClick={() => setActiveLang('python')}
                    className={`rounded-md px-2.5 py-1 transition-colors ${
                      activeLang === 'python' ? 'bg-white/10 text-white font-medium' : 'text-white/50 hover:text-white'
                    }`}
                  >
                    Python 3
                  </button>
                  <button
                    onClick={() => setActiveLang('javascript')}
                    className={`rounded-md px-2.5 py-1 transition-colors ${
                      activeLang === 'javascript' ? 'bg-white/10 text-white font-medium' : 'text-white/50 hover:text-white'
                    }`}
                  >
                    JavaScript
                  </button>
                </div>

                <button
                  onClick={handleRunDemo}
                  disabled={isRunning}
                  className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 px-3.5 py-1.5 text-xs font-semibold text-black shadow-md shadow-emerald-500/20 transition-transform active:scale-95"
                >
                  <Play className="h-3 w-3 fill-black" />
                  <span>{isRunning ? 'Executing...' : 'Run Code'}</span>
                </button>
              </div>
            </div>

            {/* Split Grid: Problem Statement (Left) & Editor (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-white/[0.08]">
              
              {/* Problem Description Column */}
              <div className="lg:col-span-5 p-5 sm:p-6 bg-[#09090d]/50 text-xs leading-relaxed space-y-3.5">
                <div className="flex items-center gap-2 text-white/50 text-[11px]">
                  <Terminal className="h-3.5 w-3.5 text-amber-400" />
                  <span>Problem Statement</span>
                </div>
                <p className="text-white/80">
                  Given an array of integers <code className="rounded bg-white/10 px-1 py-0.5 text-amber-300 font-mono text-[11px]">nums</code> and an integer <code className="rounded bg-white/10 px-1 py-0.5 text-amber-300 font-mono text-[11px]">target</code>, return indices of the two numbers such that they add up to target.
                </p>
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 space-y-1.5 font-mono text-[11px]">
                  <p className="text-white/40">// Example 1</p>
                  <p className="text-white/90"><span className="text-amber-400">Input:</span> nums = [2, 7, 11, 15], target = 9</p>
                  <p className="text-white/90"><span className="text-emerald-400">Output:</span> [0, 1]</p>
                  <p className="text-white/50 text-[10px]">Explanation: nums[0] + nums[1] == 9, we return [0, 1].</p>
                </div>
                <div className="pt-2">
                  <span className="text-[11px] font-semibold text-white/60">Constraints:</span>
                  <ul className="mt-1 space-y-1 text-white/50 text-[11px] list-disc list-inside">
                    <li>2 &le; nums.length &le; 10⁴</li>
                    <li>Only one valid answer exists</li>
                  </ul>
                </div>
              </div>

              {/* Code Editor Column */}
              <div className="lg:col-span-7 bg-[#0b0b10] flex flex-col justify-between">
                
                {/* Editor Surface */}
                <div className="p-4 sm:p-5 font-mono text-xs overflow-x-auto">
                  <pre className="text-white/90 leading-relaxed">
                    <code>
                      {activeLang === 'python' ? samplePythonCode : sampleJsCode}
                    </code>
                  </pre>
                </div>

                {/* Test Result Panel Underneath */}
                {runResult && (
                  <div className="border-t border-white/[0.08] bg-[#08080c] p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        <span className="text-xs font-bold text-emerald-400">
                          {runResult.status}
                        </span>
                        <span className="text-[11px] text-white/40">
                          · {runResult.passed}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs font-mono text-white/70">
                        <span>
                          Runtime: <strong className="text-white">{runResult.runtime}</strong>
                        </span>
                        <span>
                          Memory: <strong className="text-white">{runResult.memory}</strong>
                        </span>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
