import React, { useState } from 'react';
import { 
  Check, ArrowRight, ArrowLeft, BookOpen, Sparkles, 
  HelpCircle, Code2, Play, CheckCircle2, XCircle, Clock, 
  Zap, Brain, ChevronRight, X 
} from 'lucide-react';
import { UserProfile, SupportedLanguage } from '../../types';

interface FirstLessonModalProps {
  isOpen: boolean;
  currentUser: UserProfile;
  onClose: () => void;
  onStartProblem: (problemId: string) => void;
}

export const FirstLessonModal: React.FC<FirstLessonModalProps> = ({
  isOpen,
  currentUser,
  onClose,
  onStartProblem
}) => {
  // Steps:
  // 1: Concept
  // 2: Explanation
  // 3: Example
  // 4: Interactive Visualizer
  // 5: Mini Quiz
  // 6: Practice (Ready for First Problem)
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const [visualizerStep, setVisualizerStep] = useState<number>(0);
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  if (!isOpen) return null;

  const userLang = currentUser.preferredLanguage || 'python';
  const level = currentUser.experienceLevel || 'Beginner';

  // Level-tailored lesson configurations
  const lessonConfig = {
    title: level === 'Advanced' 
      ? 'Invariant Design: Sliding Window & Two Pointers'
      : level === 'Intermediate'
      ? 'Hash Maps: Trading Space for Instant Lookups'
      : 'Arrays & Hash Maps: The Building Blocks of DSA',
    concept: level === 'Advanced'
      ? 'Algorithmic Invariants'
      : 'Hash Map Invariants',
    summary: level === 'Advanced'
      ? 'How to maintain a monotonic or frequency invariant over a dynamic subarray to guarantee O(N) linear time.'
      : 'Why brute force pair checks take quadratic O(N²) time, and how storing complements in a hash map slashes time to O(N).'
  };

  // Code snippets for the Example step
  const codeExamples: Record<SupportedLanguage, string> = {
    python: `def two_sum(nums, target):
    seen = {}  # val -> index
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
    javascript: `function twoSum(nums, target) {
    const seen = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (seen.has(complement)) {
            return [seen.get(complement), i];
        }
        seen.set(nums[i], i);
    }
    return [];
}`,
    cpp: `vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> seen;
    for (int i = 0; i < nums.size(); ++i) {
        int complement = target - nums[i];
        if (seen.count(complement)) {
            return {seen[complement], i};
        }
        seen[nums[i]] = i;
    }
    return {};
}`,
    java: `public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> seen = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (seen.containsKey(complement)) {
            return new int[]{seen.get(complement), i};
        }
        seen.put(nums[i], i);
    }
    return new int[]{};
}`,
    go: `func twoSum(nums []int, target int) []int {
    seen := make(map[int]int)
    for i, num := range nums {
        complement := target - num
        if idx, ok := seen[complement]; ok {
            return []int{idx, i}
        }
        seen[num] = i
    }
    return nil
}`,
    rust: `use std::collections::HashMap;

pub fn two_sum(nums: Vec<i32>, target: i32) -> Vec<i32> {
    let mut seen = HashMap::new();
    for (i, &num) in nums.iter().enumerate() {
        let complement = target - num;
        if let Some(&idx) = seen.get(&complement) {
            return vec![idx as i32, i as i32];
        }
        seen.insert(num, i);
    }
    vec![]
}`
  };

  // Interactive Visualizer State
  const visualizerData = [
    { i: 0, val: 2, comp: 7, seen: {}, note: 'Target is 9. Check 9 - 2 = 7. Not seen yet. Store { 2: 0 }.' },
    { i: 1, val: 7, comp: 2, seen: { 2: 0 }, note: 'Target is 9. Check 9 - 7 = 2. Found 2 in seen at index 0! Solved!' }
  ];

  // Recommended first problem based on level
  const firstProblem = level === 'Advanced'
    ? { id: 'p-4', title: 'Container With Most Water', difficulty: 'Medium', pattern: 'Two Pointers', time: '15 mins' }
    : level === 'Intermediate'
    ? { id: 'p-1', title: 'Pair Sum Target', difficulty: 'Easy', pattern: 'Arrays & Hashing', time: '10 mins' }
    : { id: 'p-1', title: 'Pair Sum Target', difficulty: 'Easy', pattern: 'Arrays & Hashing', time: '10 mins' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="glass-panel relative w-full max-w-xl overflow-hidden rounded-3xl border border-white/[0.12] bg-[#0c0c11] p-6 sm:p-8 shadow-[0_30px_90px_-20px_rgba(0,0,0,0.9)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Close */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-xs font-bold text-black">
              {step}
            </span>
            <span className="text-xs font-semibold text-white/80">Lesson Step {step} of 6</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5, 6].map(s => (
                <div 
                  key={s} 
                  className={`h-1.5 rounded-full transition-all ${
                    s === step ? 'w-5 bg-amber-400' : s < step ? 'w-2 bg-amber-400/50' : 'w-2 bg-white/10'
                  }`} 
                />
              ))}
            </div>
            <button 
              onClick={onClose}
              className="text-white/40 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* STEP 1: CONCEPT */}
        {/* ========================================================================= */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-150">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-300 mb-3">
              <BookOpen className="h-3 w-3" />
              <span>Core Concept</span>
            </div>

            <h3 className="font-display text-2xl font-bold tracking-tight text-white mb-2">
              {lessonConfig.title}
            </h3>
            <p className="text-xs text-white/60 leading-relaxed mb-6">
              {lessonConfig.summary}
            </p>

            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 space-y-3.5 text-xs text-white/80">
              <div className="flex items-start gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-500/10 text-rose-400 text-[11px] font-bold">1</span>
                <div>
                  <span className="font-bold text-white">The Naive Approach (Quadratic Time):</span>
                  <p className="text-white/50 text-[11px] mt-0.5">Checking every pair with nested loops requires comparing N elements with N elements → <span className="font-mono text-rose-300">O(N²)</span> operations.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-amber-400 text-[11px] font-bold">2</span>
                <div>
                  <span className="font-bold text-white">The Algorithmic Insight (Memory Trade-off):</span>
                  <p className="text-white/50 text-[11px] mt-0.5">Instead of re-scanning previous elements, store visited values in a hash table. When at number <span className="font-mono text-amber-300">X</span>, instantly query if <span className="font-mono text-amber-300">target - X</span> already exists.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 text-[11px] font-bold">3</span>
                <div>
                  <span className="font-bold text-white">Resulting Complexity:</span>
                  <p className="text-white/50 text-[11px] mt-0.5">Time drops from <span className="font-mono text-rose-300 line-through">O(N²)</span> to <span className="font-mono text-emerald-300 font-bold">O(N)</span> in exchange for <span className="font-mono text-emerald-300">O(N)</span> space.</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 py-3.5 text-xs font-bold text-black shadow-lg shadow-amber-500/20 hover:scale-[1.01] transition-transform"
            >
              <span>Explain How It Works →</span>
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: EXPLANATION */}
        {/* ========================================================================= */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-150">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-cyan-300 mb-3">
              <Brain className="h-3 w-3" />
              <span>Step-by-Step Explanation</span>
            </div>

            <h3 className="font-display text-2xl font-bold tracking-tight text-white mb-2">
              The Math of the Complement
            </h3>
            <p className="text-xs text-white/60 leading-relaxed mb-6">
              For any target equation <span className="font-mono text-amber-300 font-bold">A + B = Target</span>, if you know <span className="font-mono text-white">Target</span> and current value <span className="font-mono text-white">A</span>, there is only one possible value for <span className="font-mono text-white">B</span>:
            </p>

            <div className="rounded-2xl border border-amber-400/30 bg-amber-500/5 p-4 text-center">
              <span className="font-mono text-base font-bold text-amber-300">
                Complement = Target - Current_Num
              </span>
            </div>

            <div className="mt-5 space-y-2.5 text-xs text-white/70">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Hash map key: the number value.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Hash map value: the original array index.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Lookup cost: on average <strong className="text-white font-mono">O(1)</strong> constant time.</span>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="w-1/3 rounded-xl border border-white/[0.08] py-3 text-xs font-semibold text-white/60 hover:bg-white/5"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="w-2/3 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 py-3 text-xs font-semibold text-black shadow-lg shadow-amber-500/20"
              >
                <span>View Code Example</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: EXAMPLE CODE */}
        {/* ========================================================================= */}
        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-150">
            <div className="flex items-center justify-between mb-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-purple-400/30 bg-purple-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-purple-300">
                <Code2 className="h-3 w-3" />
                <span>Example Implementation</span>
              </div>
              <span className="text-xs font-mono text-amber-400 uppercase">{userLang}</span>
            </div>

            <h3 className="font-display text-2xl font-bold tracking-tight text-white mb-2">
              Clean, Optimal Pattern
            </h3>

            <div className="rounded-2xl border border-white/[0.08] bg-[#07070a] p-4 font-mono text-xs text-white/80 overflow-x-auto">
              <pre>
                <code>{codeExamples[userLang] || codeExamples.python}</code>
              </pre>
            </div>

            <p className="mt-3 text-[11px] text-white/50">
              Notice how we iterate once: checking the complement before inserting the current number ensures we never use the same index twice.
            </p>

            <div className="mt-8 flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="w-1/3 rounded-xl border border-white/[0.08] py-3 text-xs font-semibold text-white/60 hover:bg-white/5"
              >
                Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="w-2/3 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 py-3 text-xs font-semibold text-black shadow-lg shadow-amber-500/20"
              >
                <span>Try Interactive Visualizer</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 4: INTERACTIVE VISUALIZER */}
        {/* ========================================================================= */}
        {step === 4 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-150">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-300 mb-3">
              <Play className="h-3 w-3" />
              <span>Interactive Step-Through</span>
            </div>

            <h3 className="font-display text-2xl font-bold tracking-tight text-white mb-1">
              Visualizing the Invariant
            </h3>
            <p className="text-xs text-white/50 mb-4">
              Array: <span className="font-mono text-white">[2, 7, 11, 15]</span> · Target: <span className="font-mono text-amber-400 font-bold">9</span>
            </p>

            {/* Visualizer Frame */}
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 space-y-4">
              <div className="flex items-center gap-2">
                {[2, 7, 11, 15].map((val, idx) => (
                  <div
                    key={idx}
                    className={`flex-1 rounded-xl p-3 text-center border transition-all ${
                      idx === visualizerStep 
                        ? 'border-amber-400 bg-amber-500/20 text-white ring-2 ring-amber-400/40' 
                        : idx < visualizerStep 
                        ? 'border-white/10 bg-white/5 text-white/40' 
                        : 'border-white/10 bg-white/[0.02] text-white/60'
                    }`}
                  >
                    <span className="text-[10px] block text-white/40 font-mono">i={idx}</span>
                    <span className="font-mono text-base font-bold">{val}</span>
                  </div>
                ))}
              </div>

              {/* Hash Map Memory Preview */}
              <div className="rounded-xl border border-white/[0.08] bg-[#07070a] p-3 text-xs">
                <span className="text-[10px] uppercase font-bold text-white/40 tracking-wider block mb-1">
                  Hash Map (`seen`) State
                </span>
                <div className="font-mono text-amber-300">
                  {visualizerStep === 0 ? '{} (Empty)' : '{ 2: 0 }'}
                </div>
              </div>

              {/* Current Step Description */}
              <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 text-xs text-amber-200">
                {visualizerData[visualizerStep]?.note}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setVisualizerStep(prev => (prev === 0 ? 1 : 0))}
                  className="rounded-lg bg-white/10 hover:bg-white/15 px-3 py-1.5 text-xs font-semibold text-white transition-colors"
                >
                  {visualizerStep === 0 ? 'Next Iteration (i=1) →' : 'Restart Visualizer ↺'}
                </button>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button
                onClick={() => setStep(3)}
                className="w-1/3 rounded-xl border border-white/[0.08] py-3 text-xs font-semibold text-white/60 hover:bg-white/5"
              >
                Back
              </button>
              <button
                onClick={() => setStep(5)}
                className="w-2/3 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 py-3 text-xs font-semibold text-black shadow-lg shadow-amber-500/20"
              >
                <span>Take Mini-Quiz</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 5: MINI QUIZ */}
        {/* ========================================================================= */}
        {step === 5 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-150">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-300 mb-3">
              <HelpCircle className="h-3 w-3" />
              <span>Mini Quiz</span>
            </div>

            <h3 className="font-display text-xl font-bold tracking-tight text-white mb-2">
              Test your understanding
            </h3>
            <p className="text-xs text-white/70 mb-5">
              What is the average time complexity of querying if the complement exists inside a hash table?
            </p>

            <div className="space-y-2.5">
              {[
                { idx: 0, label: 'O(N) linear time', correct: false },
                { idx: 1, label: 'O(1) constant time', correct: true },
                { idx: 2, label: 'O(log N) logarithmic time', correct: false }
              ].map((opt) => {
                const isSelected = selectedQuizAnswer === opt.idx;
                return (
                  <button
                    key={opt.idx}
                    onClick={() => {
                      setSelectedQuizAnswer(opt.idx);
                      setQuizSubmitted(true);
                    }}
                    className={`flex w-full items-center justify-between rounded-xl border p-3.5 text-xs text-left transition-all ${
                      isSelected
                        ? opt.correct
                          ? 'border-emerald-400/80 bg-emerald-500/10 text-emerald-200'
                          : 'border-rose-400/80 bg-rose-500/10 text-rose-200'
                        : 'border-white/[0.08] bg-white/[0.03] text-white/80 hover:border-white/20'
                    }`}
                  >
                    <span className="font-mono font-medium">{opt.label}</span>
                    {isSelected && (
                      opt.correct 
                        ? <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                        : <XCircle className="h-4 w-4 text-rose-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {quizSubmitted && (
              <div className={`mt-4 rounded-xl p-3 text-xs ${
                selectedQuizAnswer === 1 
                  ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300' 
                  : 'bg-rose-500/10 border border-rose-500/20 text-rose-300'
              }`}>
                {selectedQuizAnswer === 1 
                  ? '🎯 Correct! Hash tables use key hashing for instantaneous O(1) average lookups.'
                  : 'Almost! Unlike an array linear scan O(N), a hash map directly hashes keys to bucket indices in O(1) average time.'}
              </div>
            )}

            <div className="mt-8 flex gap-3">
              <button
                onClick={() => setStep(4)}
                className="w-1/3 rounded-xl border border-white/[0.08] py-3 text-xs font-semibold text-white/60 hover:bg-white/5"
              >
                Back
              </button>
              <button
                disabled={selectedQuizAnswer !== 1}
                onClick={() => setStep(6)}
                className={`w-2/3 flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-semibold transition-all ${
                  selectedQuizAnswer === 1
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-lg shadow-amber-500/20'
                    : 'bg-white/10 text-white/40 cursor-not-allowed'
                }`}
              >
                <span>Continue to Problem</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 6: PRACTICE (Section 11) */}
        {/* ========================================================================= */}
        {step === 6 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-150 text-center py-2">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20 border border-amber-400/30 text-amber-400">
              <Sparkles className="h-6 w-6" />
            </div>

            <p className="text-[11px] font-bold uppercase tracking-widest text-amber-400 mb-1">
              LESSON COMPLETED
            </p>
            <h3 className="font-display text-2xl font-bold tracking-tight text-white mb-2">
              Ready for your first problem?
            </h3>
            <p className="text-xs text-white/60 max-w-sm mx-auto mb-6">
              Now put this pattern into practice in the live code editor with automated testcases and AI coaching.
            </p>

            {/* Problem Card (Section 11) */}
            <div className="rounded-2xl border border-white/[0.1] bg-white/[0.03] p-5 text-left mb-6 max-w-md mx-auto">
              <div className="flex items-center justify-between mb-2">
                <span className="font-display text-base font-bold text-white">
                  {firstProblem.title}
                </span>
                <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
                  {firstProblem.difficulty}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-white/50">
                <span className="flex items-center gap-1">
                  <BookOpen className="h-3.5 w-3.5 text-white/40" />
                  <span>{firstProblem.pattern}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-white/40" />
                  <span>Est. {firstProblem.time}</span>
                </span>
              </div>
            </div>

            <button
              onClick={() => onStartProblem(firstProblem.id)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 py-3.5 text-xs font-bold text-black shadow-lg shadow-amber-500/25 hover:scale-[1.01] transition-transform"
            >
              <span>Start Problem →</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
