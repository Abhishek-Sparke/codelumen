import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import {
  Clock, Play, Square, CheckCircle2, XCircle, Target, Zap,
  ArrowRight, RotateCcw, Settings, Star, Layers, Bot, Sparkles, Shield, AlertCircle
} from 'lucide-react';
import { UserProfile, InterviewSessionConfig } from '../../types';
import { ALL_PROBLEMS } from '../../data/problems';
import { StorageService } from '../../services/storage';
import { FeatureFlagService } from '../../services/featureFlags';

interface InterviewPracticeViewProps {
  currentUser: UserProfile;
  onNavigate: (view: string, param?: string) => void;
}

type SessionState = 'config' | 'active' | 'results';

export const InterviewPracticeView: React.FC<InterviewPracticeViewProps> = ({ currentUser, onNavigate }) => {
  const [state, setState] = useState<SessionState>('config');
  const [duration, setDuration] = useState<15 | 30 | 45 | 60>(30);
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard' | 'Mixed'>('Mixed');
  const [activeSession, setActiveSession] = useState<InterviewSessionConfig | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [selfEval, setSelfEval] = useState({ communication: 3, optimality: 3, codeQuality: 3, notes: '' });
  const [interviewMode, setInterviewMode] = useState<'practice' | 'interview' | 'strict'>('interview');
  const [showWarmupModal, setShowWarmupModal] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  const pastSessions = useMemo(
    () => StorageService.getInterviewSessions(currentUser.id),
    [currentUser.id]
  );

  // Timer countdown
  useEffect(() => {
    if (state === 'active' && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setState('results');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timerRef.current);
    }
  }, [state, timeRemaining]);

  const selectProblems = useCallback((dur: number, diff: string): string[] => {
    const count = dur <= 15 ? 1 : dur <= 30 ? 2 : dur <= 45 ? 3 : 4;
    let candidates = ALL_PROBLEMS.filter(p => {
      if (diff === 'Mixed') return true;
      return p.difficulty === diff;
    });
    // Shuffle
    candidates = candidates.sort(() => Math.random() - 0.5);
    return candidates.slice(0, count).map(p => p.id);
  }, []);

  const startSession = () => {
    const problemIds = selectProblems(duration, difficulty);
    const session: InterviewSessionConfig = {
      id: `interview_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      durationMinutes: duration,
      difficulty,
      problemIds,
      startedAt: new Date().toISOString(),
      solvedProblemIds: []
    };
    setActiveSession(session);
    setTimeRemaining(duration * 60);
    setState('active');
  };

  const endSession = () => {
    clearInterval(timerRef.current);
    setState('results');
  };

  const saveResults = () => {
    if (!activeSession) return;
    const completed: InterviewSessionConfig = {
      ...activeSession,
      endedAt: new Date().toISOString(),
      selfEvaluation: selfEval,
      scorePercentage: activeSession.problemIds.length > 0
        ? Math.round((activeSession.solvedProblemIds.length / activeSession.problemIds.length) * 100)
        : 0
    };
    StorageService.saveInterviewSession(completed, currentUser.id);
    setActiveSession(null);
    setState('config');
  };

  const toggleSolved = (problemId: string) => {
    if (!activeSession) return;
    const solved = activeSession.solvedProblemIds.includes(problemId)
      ? activeSession.solvedProblemIds.filter(id => id !== problemId)
      : [...activeSession.solvedProblemIds, problemId];
    setActiveSession({ ...activeSession, solvedProblemIds: solved });
  };

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const renderStarRating = (value: number, onChange: (v: number) => void) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          onClick={() => onChange(n)}
          className={`transition-colors ${n <= value ? 'text-amber-400' : 'text-white/15'}`}
        >
          <Star className="h-4 w-4" fill={n <= value ? 'currentColor' : 'none'} />
        </button>
      ))}
    </div>
  );

  // CONFIG VIEW
  if (state === 'config') {
    return (
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-in fade-in duration-200">
        <div className="border-b border-white/[0.08] pb-6">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-[11px] font-semibold text-cyan-400">
            <Target className="h-3 w-3" />
            <span>Mock Interview</span>
          </div>
          <h1 className="mt-2.5 font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Interview Practice
          </h1>
          <p className="mt-1 text-sm text-white/50">
            Simulate real interview conditions with timed problem solving and self-evaluation.
          </p>
        </div>

        {/* Session Config */}
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 space-y-6">
          <h2 className="text-lg font-bold text-white">Configure Session</h2>

          {/* Duration */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">Duration</label>
            <div className="flex gap-2">
              {([15, 30, 45, 60] as const).map(d => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                    duration === d
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                      : 'border border-white/[0.08] text-white/60 hover:bg-white/[0.04]'
                  }`}
                >
                  {d} min
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">Difficulty</label>
            <div className="flex gap-2">
              {(['Easy', 'Medium', 'Hard', 'Mixed'] as const).map(d => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                    difficulty === d
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                      : 'border border-white/[0.08] text-white/60 hover:bg-white/[0.04]'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Phase 6: Interview Mode Selector (Req 20) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">Interview Mode</label>
              <span className="text-[10px] text-amber-400 font-mono">Spark AI Guardrail</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'practice', label: 'Practice Mode', desc: 'Full hints allowed' },
                { id: 'interview', label: 'Interview Mode', desc: 'Minimal hints' },
                { id: 'strict', label: 'Strict Mode', desc: 'No AI hints (Timed)' },
              ].map(m => (
                <button
                  key={m.id}
                  onClick={() => setInterviewMode(m.id as any)}
                  className={`rounded-xl p-3 text-left transition-all border ${
                    interviewMode === m.id
                      ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40'
                      : 'border-white/[0.08] text-white/60 hover:bg-white/[0.04]'
                  }`}
                >
                  <span className="text-xs font-bold block">{m.label}</span>
                  <span className="text-[10px] text-white/40 block mt-0.5">{m.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Problem Count Info & Warm-up Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl bg-white/[0.03] border border-white/[0.06] p-3 text-xs text-white/40">
            <div>
              <span className="text-white/60 font-medium">{duration <= 15 ? 1 : duration <= 30 ? 2 : duration <= 45 ? 3 : 4} problems</span> will be randomly selected. You can solve them in any order.
            </div>
            {FeatureFlagService.getFlag('SPARK_INTERVIEW_COACH') && (
              <button
                type="button"
                onClick={() => setShowWarmupModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs font-semibold hover:bg-amber-500/20 transition-all shrink-0"
              >
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                <span>Start Interview Warm-up</span>
              </button>
            )}
          </div>

          <button
            onClick={startSession}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/25 px-6 py-3 text-sm font-bold text-cyan-300 hover:from-cyan-500/25 hover:to-blue-500/25 transition-all"
          >
            <Play className="h-4 w-4" />
            Start Interview ({interviewMode.toUpperCase()} MODE)
          </button>
        </div>

        {/* Warm-up Modal (Phase 6, Req 20) */}
        {showWarmupModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in zoom-in-95 duration-150">
            <div className="max-w-lg w-full rounded-2xl border border-amber-500/30 bg-[#0d0d14] p-6 space-y-4 shadow-2xl shadow-amber-500/10">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                <div className="flex items-center gap-2 text-amber-400">
                  <Bot className="h-5 w-5" />
                  <h3 className="font-bold text-sm text-white">Spark Interview Warm-up</h3>
                </div>
                <button
                  onClick={() => setShowWarmupModal(false)}
                  className="text-white/40 hover:text-white text-xs"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs text-white/70">
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 space-y-1">
                  <span className="font-bold text-white block">1. 30-Second Clarification Rule</span>
                  <p className="text-[11px] text-white/50">Always state constraints aloud, ask if negative numbers or duplicate inputs exist, and state expected edge cases.</p>
                </div>
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 space-y-1">
                  <span className="font-bold text-white block">2. State the Naive Solution First</span>
                  <p className="text-[11px] text-white/50">"The brute-force is O(n²)... Can we optimize with a hash map to O(n)?" Never write code without outlining your approach first.</p>
                </div>
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 space-y-1">
                  <span className="font-bold text-white block">3. Mode Notice ({interviewMode.toUpperCase()})</span>
                  <p className="text-[11px] text-white/50">
                    {interviewMode === 'strict' 
                      ? 'Strict mode is active. AI hints are disabled during this timed session.' 
                      : interviewMode === 'interview' 
                      ? 'Interview mode is active. Spark AI will provide concise nudge hints only if explicitly summoned.'
                      : 'Practice mode is active. Progressive hints and debug diffs are available.'}
                  </p>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setShowWarmupModal(false)}
                  className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs transition-colors"
                >
                  Ready to Start
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Past Sessions */}
        {pastSessions.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white">Session History</h2>
            <div className="space-y-2">
              {pastSessions.slice(0, 10).map(session => (
                <div key={session.id} className="flex items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 shrink-0">
                    <Target className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-white">
                      {session.durationMinutes}min · {session.difficulty}
                    </p>
                    <p className="text-[10px] text-white/40">
                      {new Date(session.startedAt).toLocaleDateString()} · {session.solvedProblemIds.length}/{session.problemIds.length} solved
                    </p>
                  </div>
                  <span className={`text-sm font-bold ${
                    (session.scorePercentage || 0) >= 70 ? 'text-emerald-400' :
                    (session.scorePercentage || 0) >= 40 ? 'text-amber-400' : 'text-rose-400'
                  }`}>
                    {session.scorePercentage || 0}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ACTIVE SESSION VIEW
  if (state === 'active' && activeSession) {
    const urgent = timeRemaining < 300; // < 5 min
    return (
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in duration-200">
        {/* Timer Header */}
        <div className="flex items-center justify-between rounded-2xl border border-cyan-500/20 bg-cyan-500/[0.06] p-4">
          <div className="flex items-center gap-3">
            <Clock className={`h-5 w-5 ${urgent ? 'text-rose-400 animate-pulse' : 'text-cyan-400'}`} />
            <span className={`font-mono text-2xl font-bold ${urgent ? 'text-rose-400' : 'text-cyan-300'}`}>
              {formatTime(timeRemaining)}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-white/40">
              {activeSession.solvedProblemIds.length}/{activeSession.problemIds.length} solved
            </span>
            <button
              onClick={endSession}
              className="flex items-center gap-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-400 hover:bg-rose-500/15 transition-colors"
            >
              <Square className="h-3 w-3" />
              End
            </button>
          </div>
        </div>

        {/* Problem Cards */}
        <div className="space-y-3">
          {activeSession.problemIds.map((pid, idx) => {
            const problem = ALL_PROBLEMS.find(p => p.id === pid);
            if (!problem) return null;
            const isSolved = activeSession.solvedProblemIds.includes(pid);
            const diffColor = problem.difficulty === 'Easy' ? 'text-emerald-400' : problem.difficulty === 'Medium' ? 'text-amber-400' : 'text-rose-400';
            return (
              <div
                key={pid}
                className={`rounded-xl border p-4 transition-all ${
                  isSolved ? 'border-emerald-500/20 bg-emerald-500/[0.04]' : 'border-white/[0.08] bg-white/[0.02]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-white/30">Q{idx + 1}</span>
                    <div>
                      <h3 className="text-sm font-bold text-white">{problem.title}</h3>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-white/40">
                        <span className={`font-semibold ${diffColor}`}>{problem.difficulty}</span>
                        <span>{problem.topic}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleSolved(pid)}
                      className={`flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                        isSolved
                          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                          : 'border-white/[0.1] text-white/50 hover:bg-white/[0.04]'
                      }`}
                    >
                      {isSolved ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                      {isSolved ? 'Solved' : 'Mark Solved'}
                    </button>
                    <button
                      onClick={() => onNavigate('workspace', pid)}
                      className="flex items-center gap-1 rounded-lg border border-cyan-500/20 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-400 hover:bg-cyan-500/15 transition-colors"
                    >
                      Open <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // RESULTS VIEW
  if (state === 'results' && activeSession) {
    const score = activeSession.problemIds.length > 0
      ? Math.round((activeSession.solvedProblemIds.length / activeSession.problemIds.length) * 100)
      : 0;
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6 animate-in fade-in duration-200">
        <div className="text-center space-y-3">
          <div className={`inline-flex h-16 w-16 items-center justify-center rounded-full mx-auto ${
            score >= 70 ? 'bg-emerald-500/15 text-emerald-400' : score >= 40 ? 'bg-amber-500/15 text-amber-400' : 'bg-rose-500/15 text-rose-400'
          }`}>
            <span className="text-2xl font-extrabold">{score}%</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">Session Complete</h2>
          <p className="text-sm text-white/50">
            Solved {activeSession.solvedProblemIds.length} of {activeSession.problemIds.length} problems
          </p>
        </div>

        {/* Phase 6: Spark Post-Interview Analysis (Req 21) */}
        {FeatureFlagService.getFlag('SPARK_INTERVIEW_COACH') && (
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/[0.04] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2 text-amber-400">
                <Bot className="h-5 w-5" />
                <h3 className="font-bold text-sm text-white">Spark Post-Interview Analysis</h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300">
                Mode: {interviewMode.toUpperCase()}
              </span>
            </div>

            <div className="grid sm:grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 space-y-1">
                <span className="font-bold text-emerald-400">Strengths Identified</span>
                <p className="text-white/70 text-[11px] leading-relaxed">
                  {score >= 70 
                    ? `Strong pacing across ${activeSession.problemIds.length} questions. You demonstrated solid pattern recognition under timed pressure.`
                    : score >= 40
                    ? `Good perseverance. Solved ${activeSession.solvedProblemIds.length} target question(s) within the ${activeSession.durationMinutes}-minute benchmark.`
                    : `Completed full interview loop. Time management and prompt approach framing will yield rapid gains.`}
                </p>
              </div>

              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 space-y-1">
                <span className="font-bold text-amber-400">Targeted Focus Area</span>
                <p className="text-white/70 text-[11px] leading-relaxed">
                  {score === 100
                    ? `Focus on edge-case verification and articulating time/space tradeoffs before writing code.`
                    : `Review unattempted questions from this set. Break down the core algorithmic invariant before coding.`}
                </p>
              </div>
            </div>

            <div className="text-[10px] text-white/40 flex items-center justify-between pt-1">
              <span>Grounding: Evaluation synthesized from actual session timing and solve ratios.</span>
              <button 
                onClick={() => onNavigate('roadmaps')} 
                className="text-amber-400 hover:underline font-semibold"
              >
                View Pattern Roadmap →
              </button>
            </div>
          </div>
        )}

        {/* Self Evaluation */}
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 space-y-5">
          <h3 className="text-sm font-bold text-white">Self Evaluation</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/60">Communication</span>
              {renderStarRating(selfEval.communication, v => setSelfEval(s => ({ ...s, communication: v })))}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/60">Optimality</span>
              {renderStarRating(selfEval.optimality, v => setSelfEval(s => ({ ...s, optimality: v })))}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/60">Code Quality</span>
              {renderStarRating(selfEval.codeQuality, v => setSelfEval(s => ({ ...s, codeQuality: v })))}
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-white/60">Notes</label>
              <textarea
                value={selfEval.notes}
                onChange={e => setSelfEval(s => ({ ...s, notes: e.target.value }))}
                className="w-full rounded-xl border border-white/[0.1] bg-[#0e0e14] px-3 py-2 text-xs text-white/80 resize-none h-20 focus:outline-none focus:border-cyan-500/40"
                placeholder="What went well? What to improve?"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={saveResults}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-cyan-500/15 border border-cyan-500/25 px-4 py-3 text-sm font-bold text-cyan-300 hover:bg-cyan-500/20 transition-colors"
          >
            Save & Return
          </button>
          <button
            onClick={() => { setActiveSession(null); setState('config'); }}
            className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm font-medium text-white/60 hover:bg-white/[0.06] transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            New Session
          </button>
        </div>
      </div>
    );
  }

  return null;
};
