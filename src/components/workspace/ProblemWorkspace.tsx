import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Play, Send, RotateCcw, CheckCircle2, XCircle, Clock, 
  Terminal, Sparkles, BookOpen, Bot, History, ChevronDown, 
  ChevronUp, Check, Layers, AlertTriangle, Bookmark, BookmarkCheck 
} from 'lucide-react';
import { Problem, SupportedLanguage, Submission, UserProfile } from '../../types';
import { executeCode, ExecutionResult } from '../../services/codeRunner';
import { StorageService } from '../../services/storage';
import { AICoachPanel } from './AICoachPanel';
import { EditorialTab } from './EditorialTab';

interface ProblemWorkspaceProps {
  problem: Problem;
  currentUser: UserProfile;
  onSolveProblem: (problemId: string, xp: number) => void;
  onToggleSave: (problemId: string) => void;
  onNavigate: (view: string, param?: string) => void;
}

export const ProblemWorkspace: React.FC<ProblemWorkspaceProps> = ({
  problem,
  currentUser,
  onSolveProblem,
  onToggleSave,
  onNavigate
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>(
    currentUser.preferredLanguage || 'python'
  );
  const [code, setCode] = useState<string>(
    problem.starterCode[selectedLanguage] || problem.starterCode.python
  );
  const [activeLeftTab, setActiveLeftTab] = useState<'description' | 'editorial' | 'aicoach' | 'submissions'>('description');
  const [mobileTab, setMobileTab] = useState<'problem' | 'editor' | 'aicoach'>('problem');
  const [activeTestCaseIndex, setActiveTestCaseIndex] = useState<number>(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [expandedHints, setExpandedHints] = useState<number[]>([]);

  // Update starter code when language changes
  const handleLanguageChange = (newLang: SupportedLanguage) => {
    setSelectedLanguage(newLang);
    if (problem.starterCode[newLang]) {
      setCode(problem.starterCode[newLang]);
    }
  };

  const handleResetCode = () => {
    if (window.confirm('Reset code to original template? Any unsaved edits will be discarded.')) {
      setCode(problem.starterCode[selectedLanguage] || '');
      setExecutionResult(null);
    }
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setExecutionResult(null);
    const result = await executeCode(code, selectedLanguage, problem.testCases);
    setIsRunning(false);
    setExecutionResult(result);
  };

  const handleSubmitSolution = async () => {
    setIsSubmitting(true);
    const result = await executeCode(code, selectedLanguage, problem.testCases);
    setIsSubmitting(false);
    setExecutionResult(result);

    // Save submission record
    const sub: Submission = {
      id: `sub-${Date.now()}`,
      problemId: problem.id,
      problemTitle: problem.title,
      difficulty: problem.difficulty,
      language: selectedLanguage,
      status: result.status,
      runtimeMs: result.runtimeMs,
      memoryMb: result.memoryMb,
      timestamp: 'Just now',
      code,
      passedTestCases: result.passedTestCases,
      totalTestCases: result.totalTestCases,
      errorMessage: result.errorMessage
    };
    StorageService.saveSubmission(sub);

    if (result.status === 'Accepted') {
      onSolveProblem(problem.id, problem.difficulty === 'Hard' ? 100 : problem.difficulty === 'Medium' ? 70 : 50);
      setShowCelebration(true);
      try {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }
  };

  const isSaved = currentUser.savedProblemIds.includes(problem.id);
  const isSolved = currentUser.solvedProblemIds.includes(problem.id);

  // Line numbers count
  const lineCount = Math.max(1, code.split('\n').length);

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col bg-[#09090d] text-white">
      
      {/* Mobile Tab Switcher */}
      <div className="flex border-b border-white/[0.08] bg-[#0c0c11] px-4 py-2 lg:hidden justify-around text-xs">
        <button
          onClick={() => setMobileTab('problem')}
          className={`px-3 py-1.5 rounded-lg font-medium ${
            mobileTab === 'problem' ? 'bg-white/10 text-white' : 'text-white/50'
          }`}
        >
          Description
        </button>
        <button
          onClick={() => setMobileTab('editor')}
          className={`px-3 py-1.5 rounded-lg font-medium ${
            mobileTab === 'editor' ? 'bg-white/10 text-white' : 'text-white/50'
          }`}
        >
          Code Editor
        </button>
        <button
          onClick={() => setMobileTab('aicoach')}
          className={`px-3 py-1.5 rounded-lg font-medium ${
            mobileTab === 'aicoach' ? 'bg-amber-400/20 text-amber-300' : 'text-white/50'
          }`}
        >
          AI Coach
        </button>
      </div>

      {/* Main Split Grid (50% Left - 50% Right on desktop) */}
      <div className="grid flex-1 grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* LEFT PANEL: Description / Editorial / AI Coach */}
        <div className={`lg:col-span-6 flex flex-col border-r border-white/[0.08] bg-[#0c0c11] overflow-hidden ${
          mobileTab !== 'problem' && mobileTab !== 'aicoach' ? 'hidden lg:flex' : 'flex'
        }`}>
          
          {/* Left Panel Tabs Header */}
          <div className="flex items-center justify-between border-b border-white/[0.08] bg-[#0f0f15] px-4 py-2.5">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveLeftTab('description')}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  activeLeftTab === 'description' ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white'
                }`}
              >
                <BookOpen className="h-3.5 w-3.5" />
                <span>Description</span>
              </button>

              <button
                onClick={() => setActiveLeftTab('editorial')}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  activeLeftTab === 'editorial' ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white'
                }`}
              >
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                <span>Editorial</span>
              </button>

              <button
                onClick={() => setActiveLeftTab('aicoach')}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  activeLeftTab === 'aicoach' ? 'bg-amber-400/15 text-amber-300 font-semibold' : 'text-white/50 hover:text-white'
                }`}
              >
                <Bot className="h-3.5 w-3.5" />
                <span>AI Coach</span>
              </button>
            </div>

            <button
              onClick={() => onToggleSave(problem.id)}
              className="p-1.5 text-white/50 hover:text-amber-400 transition-colors"
              title={isSaved ? 'Saved problem' : 'Save problem'}
            >
              {isSaved ? <BookmarkCheck className="h-4 w-4 text-amber-400" /> : <Bookmark className="h-4 w-4" />}
            </button>
          </div>

          {/* Left Content Area */}
          <div className="flex-1 overflow-y-auto">
            
            {activeLeftTab === 'editorial' && (
              <EditorialTab
                problem={problem}
                onNavigateProblem={(id) => onNavigate('workspace', id)}
              />
            )}

            {activeLeftTab === 'aicoach' && (
              <AICoachPanel
                problem={problem}
                userCode={code}
                failedTestDetails={executionResult?.details?.find(d => !d.passed)}
                onInsertCode={(snippet) => setCode(snippet)}
              />
            )}

            {activeLeftTab === 'description' && (
              <div className="p-6 space-y-6 text-xs leading-relaxed text-white/80">
                
                {/* Problem Title & Meta Badges */}
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="font-display text-2xl font-bold text-white">
                      {problem.title}
                    </h1>
                    {isSolved && (
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Solved
                      </span>
                    )}
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                      problem.difficulty === 'Easy'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : problem.difficulty === 'Medium'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {problem.difficulty}
                    </span>

                    <span className="rounded-full bg-white/[0.04] border border-white/[0.08] px-2.5 py-0.5 text-[10px] text-white/60">
                      Topic: {problem.topic}
                    </span>

                    <span className="rounded-full bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-0.5 text-[10px] font-medium text-cyan-300">
                      Pattern: {problem.pattern}
                    </span>

                    <span className="text-[11px] font-mono text-white/40">
                      Acceptance: {problem.acceptance}
                    </span>
                  </div>

                  {/* Company Tags */}
                  <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-white/40">
                    <span>Companies:</span>
                    <div className="flex flex-wrap gap-1">
                      {problem.companies.map((c, idx) => (
                        <span key={idx} className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] text-white/60">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Problem Statement Body */}
                <div className="space-y-3 whitespace-pre-wrap text-white/90 leading-relaxed text-xs">
                  {problem.description}
                </div>

                {/* Examples */}
                <div className="space-y-3">
                  <h3 className="font-display text-sm font-bold text-white">Examples</h3>
                  {problem.examples.map((ex, idx) => (
                    <div 
                      key={idx}
                      className="rounded-2xl border border-white/[0.08] bg-[#07070a] p-4 space-y-1.5 font-mono text-[11px]"
                    >
                      <span className="text-white/40 text-[10px] uppercase tracking-wider block font-sans">
                        Example {idx + 1}
                      </span>
                      <p className="text-white/90">
                        <strong className="text-amber-400">Input:</strong> {ex.input}
                      </p>
                      <p className="text-white/90">
                        <strong className="text-emerald-400">Output:</strong> {ex.output}
                      </p>
                      {ex.explanation && (
                        <p className="text-white/50 text-[10px] font-sans pt-1">
                          <strong>Explanation:</strong> {ex.explanation}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Constraints */}
                <div className="space-y-2">
                  <h3 className="font-display text-sm font-bold text-white">Constraints</h3>
                  <ul className="space-y-1 text-white/60 text-xs list-disc list-inside font-mono">
                    {problem.constraints.map((c, idx) => (
                      <li key={idx}>{c}</li>
                    ))}
                  </ul>
                </div>

                {/* Hints Accordion */}
                {problem.hints.length > 0 && (
                  <div className="border-t border-white/[0.08] pt-4 space-y-2.5">
                    <h3 className="font-display text-sm font-bold text-white">Hints</h3>
                    {problem.hints.map((hint) => {
                      const isExpanded = expandedHints.includes(hint.level);
                      return (
                        <div 
                          key={hint.level}
                          className="rounded-xl border border-white/[0.08] bg-white/[0.02] overflow-hidden"
                        >
                          <button
                            onClick={() => {
                              setExpandedHints(prev => 
                                isExpanded ? prev.filter(l => l !== hint.level) : [...prev, hint.level]
                              );
                            }}
                            className="flex w-full items-center justify-between p-3 text-xs font-semibold text-white/80 hover:text-white"
                          >
                            <span>💡 Hint {hint.level}: {hint.title}</span>
                            {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                          </button>
                          {isExpanded && (
                            <div className="border-t border-white/[0.06] p-3 text-xs text-white/70 bg-white/[0.01]">
                              {hint.content}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

              </div>
            )}

          </div>
        </div>

        {/* RIGHT PANEL: Code Editor & Test Case Panel */}
        <div className={`lg:col-span-6 flex flex-col bg-[#08080c] overflow-hidden ${
          mobileTab !== 'editor' ? 'hidden lg:flex' : 'flex'
        }`}>
          
          {/* Top Editor Toolbar */}
          <div className="flex flex-wrap items-center justify-between border-b border-white/[0.08] bg-[#0f0f15] px-4 py-2">
            
            {/* Language Dropdown Selector */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-white/40 font-mono">Language:</span>
              <select
                value={selectedLanguage}
                onChange={(e) => handleLanguageChange(e.target.value as SupportedLanguage)}
                className="rounded-lg border border-white/[0.08] bg-[#14141b] px-2.5 py-1 text-xs text-white focus:outline-none focus:border-amber-400/50"
              >
                <option value="python">Python 3</option>
                <option value="javascript">JavaScript (ES2024)</option>
                <option value="cpp">C++ 20</option>
                <option value="java">Java 21</option>
                <option value="go">Go 1.22</option>
                <option value="rust">Rust 1.76</option>
              </select>
            </div>

            {/* Editor Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleResetCode}
                title="Reset to starter code"
                className="p-1.5 rounded-lg text-white/50 hover:bg-white/10 hover:text-white transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>

              <button
                onClick={handleRunCode}
                disabled={isRunning || isSubmitting}
                className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-white/10 active:scale-95 transition-all"
              >
                <Play className="h-3 w-3 fill-white" />
                <span>{isRunning ? 'Running...' : 'Run'}</span>
              </button>

              <button
                onClick={handleSubmitSolution}
                disabled={isRunning || isSubmitting}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-1.5 text-xs font-bold text-black shadow-md shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all"
              >
                <Send className="h-3 w-3 fill-black" />
                <span>{isSubmitting ? 'Testing...' : 'Submit'}</span>
              </button>
            </div>
          </div>

          {/* Monaco-style Code Editor Surface */}
          <div className="relative flex-1 overflow-hidden flex bg-[#09090d]">
            
            {/* Line numbers gutter */}
            <div className="select-none bg-[#0a0a0f] py-4 pl-3 pr-2 text-right font-mono text-xs text-white/20 border-r border-white/[0.06]">
              {Array.from({ length: lineCount }).map((_, i) => (
                <div key={i} className="leading-6">{i + 1}</div>
              ))}
            </div>

            {/* Code Textarea with Tab Support */}
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Tab') {
                  e.preventDefault();
                  const target = e.target as HTMLTextAreaElement;
                  const start = target.selectionStart;
                  const end = target.selectionEnd;
                  setCode(code.substring(0, start) + '  ' + code.substring(end));
                  setTimeout(() => {
                    target.selectionStart = target.selectionEnd = start + 2;
                  }, 0);
                } else if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                  e.preventDefault();
                  if (e.shiftKey) handleSubmitSolution();
                  else handleRunCode();
                }
              }}
              spellCheck={false}
              className="flex-1 resize-none bg-transparent p-4 font-mono text-xs leading-6 text-white/95 focus:outline-none overflow-y-auto selection:bg-amber-500/25"
            />
          </div>

          {/* BOTTOM RESIZABLE: Test Cases & Execution Result */}
          <div className="border-t border-white/[0.08] bg-[#0c0c11] p-4 max-h-60 overflow-y-auto">
            
            {/* If Execution Result exists */}
            {executionResult ? (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.08] pb-2.5">
                  <div className="flex items-center gap-2">
                    {executionResult.status === 'Accepted' ? (
                      <span className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-400">
                        <CheckCircle2 className="h-4 w-4" />
                        Accepted
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-xs font-extrabold text-rose-400">
                        <XCircle className="h-4 w-4" />
                        {executionResult.status}
                      </span>
                    )}
                    <span className="text-[11px] text-white/40">
                      ({executionResult.passedTestCases} / {executionResult.totalTestCases} test cases passed)
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono text-white/60">
                    <span>Runtime: <strong className="text-white">{executionResult.runtimeMs} ms</strong></span>
                    <span>Memory: <strong className="text-white">{executionResult.memoryMb} MB</strong></span>
                  </div>
                </div>

                {/* Error message if any */}
                {executionResult.errorMessage && (
                  <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-2.5 text-xs font-mono text-rose-300">
                    {executionResult.errorMessage}
                  </div>
                )}

                {/* Test case tabs & details */}
                {executionResult.details && executionResult.details.length > 0 && (
                  <div>
                    <div className="flex gap-2 mb-2">
                      {executionResult.details.map((d, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveTestCaseIndex(i)}
                          className={`rounded-lg px-2.5 py-1 text-xs font-mono transition-colors ${
                            activeTestCaseIndex === i
                              ? d.passed
                                ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40'
                                : 'bg-rose-500/20 text-rose-300 font-bold border border-rose-500/40'
                              : 'bg-white/5 text-white/50 hover:bg-white/10'
                          }`}
                        >
                          Case {d.testCaseIndex}
                        </button>
                      ))}
                    </div>

                    {executionResult.details[activeTestCaseIndex] && (
                      <div className="rounded-xl border border-white/[0.06] bg-[#07070a] p-3 text-[11px] font-mono space-y-1.5">
                        <p className="text-white/50">Input: <span className="text-white">{JSON.stringify(executionResult.details[activeTestCaseIndex].input)}</span></p>
                        <p className="text-white/50">Expected: <span className="text-emerald-400">{JSON.stringify(executionResult.details[activeTestCaseIndex].expected)}</span></p>
                        <p className="text-white/50">Actual Output: <span className={executionResult.details[activeTestCaseIndex].passed ? 'text-emerald-400' : 'text-rose-400'}>
                          {JSON.stringify(executionResult.details[activeTestCaseIndex].actual)}
                        </span></p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              /* Default Test Cases Preview */
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
                  <span className="text-xs font-bold text-white/70">Test Cases</span>
                  <div className="flex gap-1.5">
                    {problem.testCases.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveTestCaseIndex(idx)}
                        className={`rounded-lg px-2.5 py-0.5 text-xs font-mono transition-colors ${
                          activeTestCaseIndex === idx ? 'bg-white/10 text-white font-semibold' : 'text-white/40 hover:text-white'
                        }`}
                      >
                        Case {idx + 1}
                      </button>
                    ))}
                  </div>
                </div>

                {problem.testCases[activeTestCaseIndex] && (
                  <div className="rounded-xl border border-white/[0.06] bg-[#07070a] p-3 text-[11px] font-mono space-y-1 text-white/70">
                    <p><strong className="text-white/40">Input:</strong> {JSON.stringify(problem.testCases[activeTestCaseIndex].input)}</p>
                    <p><strong className="text-white/40">Expected:</strong> {JSON.stringify(problem.testCases[activeTestCaseIndex].expected)}</p>
                  </div>
                )}
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Celebration Modal on Solve */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in zoom-in-95 duration-200">
          <div className="glass-panel max-w-sm rounded-3xl p-6 text-center border border-amber-500/30 bg-[#0c0c11] shadow-[0_25px_80px_-15px_rgba(245,158,11,0.3)]">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mb-4">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="font-display text-2xl font-bold text-white">Accepted!</h3>
            <p className="mt-2 text-xs text-white/60 leading-relaxed">
              Congratulations! You successfully solved <strong>{problem.title}</strong> and earned{' '}
              <strong className="text-emerald-400">+{problem.difficulty === 'Hard' ? 100 : problem.difficulty === 'Medium' ? 70 : 50} XP</strong>!
            </p>
            <div className="mt-6 flex flex-col gap-2">
              <button
                onClick={() => setShowCelebration(false)}
                className="w-full rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 py-2.5 text-xs font-bold text-black"
              >
                Continue Practice
              </button>
              <button
                onClick={() => { setShowCelebration(false); onNavigate('problems'); }}
                className="w-full rounded-xl border border-white/10 py-2 text-xs text-white/60 hover:text-white"
              >
                Back to Problem Library
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
