import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { 
  Play, Send, RotateCcw, CheckCircle2, XCircle, Clock, 
  Terminal, Sparkles, BookOpen, Bot, History, ChevronDown, 
  ChevronUp, Check, Layers, AlertTriangle, Bookmark, BookmarkCheck,
  Share2, Settings, ArrowRight, Lightbulb, Code2, ExternalLink
} from 'lucide-react';
import { Problem, SupportedLanguage, Submission, UserProfile } from '../../types';
import { executeCode, ExecutionResult } from '../../services/codeRunner';
import { StorageService } from '../../services/storage';
import { ProblemDatabase } from '../../services/problemDatabase';
import { AICoachPanel } from './AICoachPanel';
import { EditorialTab } from './EditorialTab';
import { FirstSolveModal } from './FirstSolveModal';

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
  
  // Initialize code from saved draft or problem starter code
  const [code, setCode] = useState<string>(() => {
    const draft = StorageService.getDraft(currentUser.id, problem.id, selectedLanguage);
    if (draft) return draft;
    return problem.starterCode[selectedLanguage] || problem.starterCode.python || '';
  });

  const [activeLeftTab, setActiveLeftTab] = useState<'description' | 'editorial' | 'aicoach' | 'submissions'>('description');
  const [mobileTab, setMobileTab] = useState<'problem' | 'editor' | 'aicoach'>('problem');
  const [activeTestCaseIndex, setActiveTestCaseIndex] = useState<number>(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isFirstSolveModalOpen, setIsFirstSolveModalOpen] = useState(false);
  const [revealedHintCount, setRevealedHintCount] = useState<number>(0);
  const [expandedHints, setExpandedHints] = useState<number[]>([]);
  const [copiedShare, setCopiedShare] = useState(false);
  const [fontSize, setFontSize] = useState<number>(13);
  const [showSettingsPopover, setShowSettingsPopover] = useState(false);
  const [recentSubmissions, setRecentSubmissions] = useState<Submission[]>(() => 
    StorageService.getSubmissionsForProblem(problem.id)
  );

  // Restore draft when problem or language changes
  useEffect(() => {
    const draft = StorageService.getDraft(currentUser.id, problem.id, selectedLanguage);
    if (draft) {
      setCode(draft);
    } else {
      setCode(problem.starterCode[selectedLanguage] || problem.starterCode.python || '');
    }
    setRevealedHintCount(0);
    setExpandedHints([]);
    setExecutionResult(null);
    setRecentSubmissions(StorageService.getSubmissionsForProblem(problem.id));
  }, [problem.id, selectedLanguage, currentUser.id]);

  // Real-time autosave in submission_drafts (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      StorageService.saveDraft(currentUser.id, problem.id, selectedLanguage, code);
    }, 400);
    return () => clearTimeout(timer);
  }, [code, currentUser.id, problem.id, selectedLanguage]);

  // Related problems for recommendation upon solve
  const relatedProblems = useMemo(() => {
    return ProblemDatabase.getRelatedProblems(problem.id, 3);
  }, [problem.id]);

  // Pattern details for learning mode (Section 11)
  const patternRecord = useMemo(() => {
    return ProblemDatabase.getPatternBySlug(problem.pattern);
  }, [problem.pattern]);

  const handleLanguageChange = (newLang: SupportedLanguage) => {
    setSelectedLanguage(newLang);
    const draft = StorageService.getDraft(currentUser.id, problem.id, newLang);
    if (draft) {
      setCode(draft);
    } else if (problem.starterCode[newLang]) {
      setCode(problem.starterCode[newLang]);
    }
  };

  const handleResetCode = () => {
    if (window.confirm('Reset code to original starter template? Current draft edits will be discarded.')) {
      const template = problem.starterCode[selectedLanguage] || '';
      setCode(template);
      StorageService.saveDraft(currentUser.id, problem.id, selectedLanguage, template);
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
    setRecentSubmissions(StorageService.getSubmissionsForProblem(problem.id));

    // Record user activity
    StorageService.recordActivity(currentUser.id, 'submitted_solution', problem.id);

    if (result.status === 'Accepted') {
      const wasFirstSolve = currentUser.solvedProblemIds.length === 0;
      const xpEarned = problem.difficulty === 'Hard' ? 100 : problem.difficulty === 'Medium' ? 70 : 50;
      onSolveProblem(problem.id, xpEarned);
      
      if (wasFirstSolve) {
        setIsFirstSolveModalOpen(true);
      } else {
        setShowCelebration(true);
        try {
          confetti({
            particleCount: 90,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch (e) {}
      }
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  const handleRevealNextHint = () => {
    if (revealedHintCount < problem.hints.length) {
      const nextCount = revealedHintCount + 1;
      setRevealedHintCount(nextCount);
      setExpandedHints(prev => [...prev, nextCount]);
    }
  };

  const isSaved = currentUser.savedProblemIds.includes(problem.id);
  const isSolved = currentUser.solvedProblemIds.includes(problem.id);
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
        
        {/* LEFT PANEL: Description / Editorial / AI Coach / Submissions */}
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

              <button
                onClick={() => setActiveLeftTab('submissions')}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  activeLeftTab === 'submissions' ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white'
                }`}
              >
                <History className="h-3.5 w-3.5" />
                <span>Submissions</span>
              </button>
            </div>

            <div className="flex items-center gap-1">
              {/* Share Button */}
              <button
                onClick={handleShare}
                className="relative p-1.5 text-white/50 hover:text-white transition-colors"
                title="Share problem"
              >
                <Share2 className="h-4 w-4" />
                {copiedShare && (
                  <span className="absolute -bottom-6 right-0 rounded bg-black/80 px-1.5 py-0.5 text-[10px] text-amber-300 border border-white/10 whitespace-nowrap">
                    Copied!
                  </span>
                )}
              </button>

              {/* Bookmark Save Button */}
              <button
                onClick={() => onToggleSave(problem.id)}
                className="p-1.5 text-white/50 hover:text-amber-400 transition-colors"
                title={isSaved ? 'Saved problem' : 'Save problem'}
              >
                {isSaved ? <BookmarkCheck className="h-4 w-4 text-amber-400" /> : <Bookmark className="h-4 w-4" />}
              </button>
            </div>
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
                experienceLevel={currentUser.experienceLevel}
              />
            )}

            {/* Submissions Tab */}
            {activeLeftTab === 'submissions' && (
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                  <div>
                    <h3 className="font-display text-sm font-bold text-white">Your Submissions</h3>
                    <p className="text-[11px] text-white/50">History of attempts for this problem</p>
                  </div>
                  <span className="text-xs font-mono text-white/40">{recentSubmissions.length} recorded</span>
                </div>

                {recentSubmissions.length === 0 ? (
                  <div className="py-12 text-center text-white/40 text-xs">
                    <History className="mx-auto h-8 w-8 mb-2 opacity-30" />
                    <p>No submissions recorded for this problem yet.</p>
                    <p className="text-[11px] mt-1 text-white/30">Submit your code to see results logged here.</p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {recentSubmissions.map((sub) => (
                      <div key={sub.id} className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3.5 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-bold ${
                              sub.status === 'Accepted'
                                ? 'text-emerald-400'
                                : sub.status === 'Pending'
                                ? 'text-amber-400'
                                : 'text-rose-400'
                            }`}>
                              {sub.status}
                            </span>
                            <span className="rounded bg-white/5 px-2 py-0.5 text-[10px] uppercase font-mono text-white/60">
                              {sub.language}
                            </span>
                          </div>
                          <span className="text-[10px] text-white/40 font-mono">{sub.timestamp}</span>
                        </div>

                        {sub.errorMessage && (
                          <p className="text-[11px] text-white/60 font-mono">
                            {sub.errorMessage}
                          </p>
                        )}

                        <div className="flex items-center justify-between border-t border-white/[0.04] pt-2">
                          <span className="text-[10px] text-white/40 font-mono">
                            Runtime: {sub.runtimeMs} ms
                          </span>
                          <button
                            onClick={() => {
                              if (sub.code) {
                                setCode(sub.code);
                                setSelectedLanguage(sub.language);
                              }
                            }}
                            className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 transition-colors"
                          >
                            Load code in editor →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeLeftTab === 'description' && (
              <div className="p-6 space-y-6 text-xs leading-relaxed text-white/80">
                
                {/* Section 11: Learning Mode Section */}
                <div className="rounded-2xl border border-cyan-500/20 bg-[#0c121e]/80 p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-cyan-500/10 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-300 font-bold text-xs">⚡</span>
                      <span className="text-xs font-bold text-cyan-300">Pattern: {problem.pattern}</span>
                    </div>
                    <span className="text-[10px] font-mono text-cyan-400/80">Learn → Practice</span>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-2.5 text-[11px]">
                    <div className="space-y-1">
                      <p className="font-semibold text-white/90">What is it?</p>
                      <p className="text-white/60 leading-relaxed">{patternRecord?.description || `Structured algorithmic pattern utilizing ${problem.pattern} invariants.`}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="font-semibold text-white/90">When should you use it?</p>
                      <p className="text-white/60 leading-relaxed">{patternRecord?.when_to_use?.[0] || 'When optimal linear scanning or state reduction eliminates redundant checks.'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="font-semibold text-white/90">How do you recognize it?</p>
                      <p className="text-white/60 leading-relaxed">{patternRecord?.common_signals?.[0] || 'Sorted inputs, contiguous segments, or frequency mappings.'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="font-semibold text-white/90">Common complexity</p>
                      <p className="text-cyan-300 font-mono">Time: O(N) or O(N log N) · Space: O(1) to O(N)</p>
                    </div>
                  </div>

                  <div className="pt-1.5 border-t border-cyan-500/10 flex items-center justify-between">
                    <span className="text-[10px] text-cyan-400/90 font-medium">Try the problem ↓</span>
                  </div>
                </div>

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
                      Est. Time: {problem.difficulty === 'Hard' ? '45 mins' : problem.difficulty === 'Medium' ? '30 mins' : '15 mins'}
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

                {/* Section 9: Input Format, Output Format, and Notes */}
                {problem.inputFormat && (
                  <div className="space-y-1.5 border-t border-white/[0.06] pt-3">
                    <h3 className="font-display text-xs font-bold text-white">Input Format</h3>
                    <p className="text-white/70 font-mono text-xs leading-relaxed">{problem.inputFormat}</p>
                  </div>
                )}

                {problem.outputFormat && (
                  <div className="space-y-1.5 border-t border-white/[0.06] pt-3">
                    <h3 className="font-display text-xs font-bold text-white">Output Format</h3>
                    <p className="text-white/70 font-mono text-xs leading-relaxed">{problem.outputFormat}</p>
                  </div>
                )}

                {problem.notes && (
                  <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3 text-xs text-white/70 space-y-1">
                    <p className="font-bold text-white/90">Notes</p>
                    <p className="leading-relaxed">{problem.notes}</p>
                  </div>
                )}

                {/* Progressive Hint System (Section 10) */}
                {problem.hints.length > 0 && (
                  <div className="border-t border-white/[0.08] pt-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-sm font-bold text-white">Need a hint?</h3>
                      <span className="text-[11px] text-white/40">
                        {revealedHintCount} of {problem.hints.length} revealed
                      </span>
                    </div>

                    {/* Revealed hints */}
                    <div className="space-y-2">
                      {problem.hints.slice(0, revealedHintCount).map((hint, idx) => {
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
                              <span className="flex items-center gap-1.5">
                                <Lightbulb className="h-3.5 w-3.5 text-amber-400" />
                                <span>Hint {hint.level}: {hint.title}</span>
                              </span>
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

                    {/* Button to reveal next hint */}
                    {revealedHintCount < problem.hints.length && (
                      <button
                        onClick={handleRevealNextHint}
                        className="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3.5 py-2 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 transition-all"
                      >
                        <Lightbulb className="h-3.5 w-3.5 text-amber-400" />
                        <span>Reveal Hint {revealedHintCount + 1}</span>
                      </button>
                    )}
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
          <div className="flex flex-wrap items-center justify-between border-b border-white/[0.08] bg-[#0f0f15] px-4 py-2 gap-2">
            
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
              {/* Settings button */}
              <div className="relative">
                <button
                  onClick={() => setShowSettingsPopover(!showSettingsPopover)}
                  title="Editor Settings"
                  className="p-1.5 rounded-lg text-white/50 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <Settings className="h-3.5 w-3.5" />
                </button>
                {showSettingsPopover && (
                  <div 
                    className="absolute right-0 mt-2 w-48 rounded-xl border border-white/10 bg-[#12121a] p-3 shadow-xl z-30 text-xs space-y-2.5"
                    onMouseLeave={() => setShowSettingsPopover(false)}
                  >
                    <p className="font-bold text-white/80 border-b border-white/10 pb-1">Editor Settings</p>
                    <div className="flex items-center justify-between">
                      <span className="text-white/60">Font Size</span>
                      <div className="flex gap-1">
                        {[12, 13, 14, 16].map((sz) => (
                          <button
                            key={sz}
                            onClick={() => setFontSize(sz)}
                            className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                              fontSize === sz ? 'bg-amber-400 text-black font-bold' : 'bg-white/5 text-white/70'
                            }`}
                          >
                            {sz}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Reset code button */}
              <button
                onClick={handleResetCode}
                title="Reset to starter code"
                className="p-1.5 rounded-lg text-white/50 hover:bg-white/10 hover:text-white transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>

              {/* Run button */}
              <button
                onClick={handleRunCode}
                disabled={isRunning || isSubmitting}
                className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-white/10 active:scale-95 transition-all"
              >
                <Play className="h-3 w-3 fill-white" />
                <span>{isRunning ? 'Running...' : 'Run'}</span>
              </button>

              {/* Submit button */}
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
                <div key={i} className="leading-6" style={{ fontSize: `${fontSize}px` }}>{i + 1}</div>
              ))}
            </div>

            {/* Code Textarea with Tab Support */}
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              style={{ fontSize: `${fontSize}px` }}
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
              className="flex-1 resize-none bg-transparent p-4 font-mono leading-6 text-white/95 focus:outline-none overflow-y-auto selection:bg-amber-500/25"
            />
          </div>

          {/* BOTTOM PANEL: Test Cases & Execution Result */}
          <div className="border-t border-white/[0.08] bg-[#0c0c11] p-4 max-h-60 overflow-y-auto">
            
            {/* If Execution Result exists */}
            {executionResult ? (
              <div className="space-y-3">
                {/* Clear Phase 2 Development State Notice */}
                {executionResult.isPhase3Pending || executionResult.status === 'Pending' ? (
                  <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 space-y-1.5">
                    <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                      <Clock className="h-4 w-4 text-amber-400 animate-pulse" />
                      <span>Code execution will be available soon.</span>
                    </div>
                    <p className="text-[11px] text-white/70 leading-relaxed">
                      Your solution draft in <span className="uppercase font-semibold text-white">{selectedLanguage}</span> has been saved securely to your session. Phase 3 isolated sandbox runners are currently being wired.
                    </p>
                  </div>
                ) : (
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
                )}

                {/* Default Test Cases preview */}
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-2 pt-1">
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
            ) : (
              /* Default Test Cases Preview before run */
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

      {/* First Solve Dedicated Modal */}
      <FirstSolveModal
        isOpen={isFirstSolveModalOpen}
        currentUser={currentUser}
        onContinue={() => {
          setIsFirstSolveModalOpen(false);
          StorageService.dismissFirstSolveCelebration();
          onNavigate('dashboard');
        }}
      />

      {/* Standard Celebration Modal for Solves */}
      {showCelebration && !isFirstSolveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in zoom-in-95 duration-200">
          <div className="glass-panel max-w-md w-full rounded-3xl p-6 border border-amber-500/30 bg-[#0c0c11] shadow-[0_25px_80px_-15px_rgba(245,158,11,0.3)] space-y-5">
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 mb-3">
                <Sparkles className="h-7 w-7" />
              </div>
              <h3 className="font-display text-2xl font-bold text-white">Problem Solved ⚡</h3>
              <p className="mt-1.5 text-sm font-bold text-amber-400">
                +{problem.difficulty === 'Hard' ? 100 : problem.difficulty === 'Medium' ? 70 : 50} XP
              </p>
              <p className="mt-1 text-xs text-white/60 leading-relaxed">
                Great job solving <strong>{problem.title}</strong>!
              </p>
            </div>

            {/* Section 24: Pattern, Difficulty, Complexity breakdown */}
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 text-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-white/50">Pattern:</span>
                <span className="font-bold text-cyan-300">{problem.pattern}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/50">Difficulty:</span>
                <span className={`font-semibold ${
                  problem.difficulty === 'Easy' ? 'text-emerald-400' : problem.difficulty === 'Medium' ? 'text-amber-400' : 'text-rose-400'
                }`}>{problem.difficulty}</span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-white/[0.06]">
                <span className="text-white/50">Complexity:</span>
                <span className="text-[11px] font-mono text-white/40">Pending until execution system is connected.</span>
              </div>
            </div>

            {/* Recommended Related Problems */}
            {relatedProblems.length > 0 && (
              <div className="space-y-2">
                <p className="text-[11px] font-semibold text-white/50 uppercase tracking-wider">Try these next</p>
                <div className="space-y-1.5">
                  {relatedProblems.map((rel) => (
                    <div
                      key={rel.id}
                      onClick={() => {
                        setShowCelebration(false);
                        onNavigate('workspace', rel.id);
                      }}
                      className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.02] p-2.5 hover:bg-white/[0.06] cursor-pointer transition-colors"
                    >
                      <span className="text-xs text-white font-medium">{rel.title}</span>
                      <span className="text-[10px] text-amber-400 font-semibold">{rel.difficulty}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={() => {
                  setShowCelebration(false);
                  onNavigate('roadmaps');
                }}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 py-2.5 text-xs font-bold text-black shadow-lg shadow-amber-500/20"
              >
                <span>Continue Roadmap →</span>
              </button>
              <button
                onClick={() => setShowCelebration(false)}
                className="w-full rounded-xl border border-white/10 py-2 text-xs text-white/60 hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
