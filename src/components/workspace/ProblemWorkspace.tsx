import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { 
  Play, Send, RotateCcw, CheckCircle2, XCircle, Clock, 
  Terminal, Sparkles, BookOpen, Bot, History, ChevronDown, 
  ChevronUp, Check, Layers, AlertTriangle, Bookmark, BookmarkCheck,
  Share2, Settings, ArrowRight, Lightbulb, Code2, ExternalLink,
  HelpCircle, Eye, Lock, ShieldCheck, Zap
} from 'lucide-react';
import { Problem, SupportedLanguage, Submission, UserProfile } from '../../types';
import { executeRun, executeSubmit, ExecutionResult } from '../../services/codeRunner';
import { StorageService } from '../../services/storage';
import { ProblemDatabase } from '../../services/problemDatabase';
import { ALL_PROBLEMS } from '../../data/problems';
import { AICoachPanel } from './AICoachPanel';
import { EditorialTab } from './EditorialTab';
import { FirstSolveModal } from './FirstSolveModal';
import { SparkDrawer } from '../spark/SparkDrawer';
import { SparkDiffModal } from '../spark/SparkDiffModal';
import { SparkActionType, SparkDiffSuggestion } from '../../types/spark';
import { FeatureFlagService } from '../../services/featureFlags';
import { Link } from '../../router/Link';

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
  // Persisted language preference
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>(() => {
    const saved = localStorage.getItem('codespark_preferred_lang') as SupportedLanguage;
    if (saved && (saved === 'python' || saved === 'javascript')) return saved;
    return currentUser.preferredLanguage || 'python';
  });

  // Language switch confirmation modal state
  const [pendingLanguage, setPendingLanguage] = useState<SupportedLanguage | null>(null);

  // Initialize code from saved draft or problem starter code
  const [code, setCode] = useState<string>(() => {
    const draft = StorageService.getDraft(currentUser.id, problem.id, selectedLanguage);
    if (draft) return draft;
    return problem.starterCode[selectedLanguage] || problem.starterCode.python || '';
  });

  const [activeLeftTab, setActiveLeftTab] = useState<'description' | 'editorial' | 'aicoach' | 'submissions'>('description');
  const [mobileTab, setMobileTab] = useState<'problem' | 'editor' | 'aicoach'>('problem');
  const [bottomTab, setBottomTab] = useState<'testcases' | 'console' | 'submissions'>('testcases');
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
  const [selectedSubmissionView, setSelectedSubmissionView] = useState<Submission | null>(null);
  const [solveXpEarned, setSolveXpEarned] = useState<number>(100);
  const [nextProblem, setNextProblem] = useState<Problem | null>(null);

  // Spark AI Drawer and Diff Modal state
  const [isSparkDrawerOpen, setIsSparkDrawerOpen] = useState(false);
  const [sparkDrawerAction, setSparkDrawerAction] = useState<SparkActionType>('hint');
  const [activeDiffSuggestion, setActiveDiffSuggestion] = useState<SparkDiffSuggestion | null>(null);

  const handleOpenSpark = (action: SparkActionType = 'hint') => {
    setSparkDrawerAction(action);
    setIsSparkDrawerOpen(true);
  };

  const handleApplyCodeDiff = (suggestedCode: string) => {
    setCode(suggestedCode);
    setActiveDiffSuggestion(null);
  };

  // Feature flag status checks for rollback and resilience
  const isExecutionEnabled = FeatureFlagService.getFlag('CODE_EXECUTION_ENABLED');
  const isAiEnabled = FeatureFlagService.getFlag('SPARK_AI_ENABLED');

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
    setActiveTestCaseIndex(0);
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

  // Pattern details for learning mode
  const patternRecord = useMemo(() => {
    return ProblemDatabase.getPatternBySlug(problem.pattern);
  }, [problem.pattern]);

  // Check if current editor content has been modified from starter template
  const isCodeModified = useMemo(() => {
    const starter = problem.starterCode[selectedLanguage] || '';
    return code.trim() !== starter.trim() && code.trim().length > 0;
  }, [code, problem.starterCode, selectedLanguage]);

  // Handle language switch request with warning if modified
  const requestLanguageChange = (newLang: SupportedLanguage) => {
    if (newLang === selectedLanguage) return;

    if (newLang !== 'python' && newLang !== 'javascript') {
      alert(`${newLang.toUpperCase()} environment is currently being prepared in the sandbox cluster. Python 3 and JavaScript are fully functional.`);
      return;
    }

    if (isCodeModified) {
      setPendingLanguage(newLang);
    } else {
      applyLanguageChange(newLang);
    }
  };

  const applyLanguageChange = (newLang: SupportedLanguage) => {
    setSelectedLanguage(newLang);
    localStorage.setItem('codespark_preferred_lang', newLang);
    setPendingLanguage(null);
    const draft = StorageService.getDraft(currentUser.id, problem.id, newLang);
    if (draft) {
      setCode(draft);
    } else if (problem.starterCode[newLang]) {
      setCode(problem.starterCode[newLang]);
    }
    setExecutionResult(null);
  };

  const handleResetCode = () => {
    if (window.confirm('Reset code to original starter template? Current draft edits will be discarded.')) {
      const template = problem.starterCode[selectedLanguage] || '';
      setCode(template);
      StorageService.saveDraft(currentUser.id, problem.id, selectedLanguage, template);
      setExecutionResult(null);
    }
  };

  // RUN: Evaluates against visible / sample test cases only. Does NOT mark problem solved.
  const handleRunCode = async () => {
    setIsRunning(true);
    setExecutionResult(null);
    setBottomTab('testcases');
    
    const result = await executeRun(code, selectedLanguage, problem.id, currentUser.id);
    setIsRunning(false);
    setExecutionResult(result);
  };

  // SUBMIT: Evaluates against full test suite (public + hidden) using authoritative judge.
  const handleSubmitSolution = async () => {
    if (isSubmitting || isRunning) return; // Prevent duplicate submissions

    setIsSubmitting(true);
    setExecutionResult(null);
    setBottomTab('testcases');

    const result = await executeSubmit(code, selectedLanguage, problem.id, currentUser.id);
    setIsSubmitting(false);
    setExecutionResult(result);

    // Save official submission record
    const sub: Submission = {
      id: result.submissionId || `sub-${Date.now()}`,
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

    // ONLY Accepted marks problem solved and updates progress/XP/streak
    if (result.status === 'Accepted') {
      const wasFirstSolve = currentUser.solvedProblemIds.length === 0;
      const xpByDiff = { 'Easy': 100, 'Medium': 200, 'Hard': 300 };
      const xpVal = xpByDiff[problem.difficulty] || 100;
      setSolveXpEarned(xpVal);

      // Record authentic solve with streak and duplicate XP guard
      const solveResult = StorageService.recordProblemSolve(problem.id, problem.difficulty);
      onSolveProblem(problem.id, xpVal);

      // Determine next problem recommendation
      const rec = ProblemDatabase.getRecommendedNextProblem(problem.id, currentUser.id);
      if (rec) {
        setNextProblem(rec);
      } else if (result.nextRecommendedProblem) {
        const found = ALL_PROBLEMS.find(p => p.id === result.nextRecommendedProblem?.id);
        if (found) setNextProblem(found);
      }

      if (wasFirstSolve) {
        setIsFirstSolveModalOpen(true);
      } else {
        setShowCelebration(true);
        try {
          confetti({
            particleCount: 110,
            spread: 80,
            origin: { y: 0.6 }
          });
        } catch (e) {}
      }
    }
  };

  const handleShare = () => {
    const canonicalUrl = `${window.location.origin}/problems/${problem.slug || problem.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(canonicalUrl);
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

  // Determine active test case for bottom viewer
  const displayedCases = executionResult?.details && executionResult.details.length > 0
    ? executionResult.details
    : problem.testCases.map((tc, idx) => ({
        testCaseIndex: idx + 1,
        input: tc.input,
        expected: tc.expected,
        actual: undefined,
        passed: false,
        isPublic: true,
        runtimeMs: undefined
      }));

  const activeCase = displayedCases[activeTestCaseIndex] || displayedCases[0];

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
        {isAiEnabled && (
          <button
            onClick={() => setMobileTab('aicoach')}
            className={`px-3 py-1.5 rounded-lg font-medium ${
              mobileTab === 'aicoach' ? 'bg-amber-400/20 text-amber-300' : 'text-white/50'
            }`}
          >
            Spark AI
          </button>
        )}
      </div>

      {/* Main Split Grid */}
      <div className="grid flex-1 grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* LEFT PANEL: Problem Description, Editorial, AI Coach, Submissions */}
        <div className={`lg:col-span-6 flex flex-col border-r border-white/[0.08] bg-[#0c0c11] overflow-hidden ${
          mobileTab !== 'problem' ? 'hidden lg:flex' : 'flex'
        }`}>
          
          {/* Left Panel Tab Headers */}
          <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-2 text-xs bg-[#0e0e14]">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveLeftTab('description')}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium transition-colors ${
                  activeLeftTab === 'description' ? 'bg-white/10 text-white font-semibold' : 'text-white/50 hover:text-white'
                }`}
              >
                <BookOpen className="h-3.5 w-3.5" />
                <span>Description</span>
              </button>

              <button
                onClick={() => setActiveLeftTab('editorial')}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium transition-colors ${
                  activeLeftTab === 'editorial' ? 'bg-white/10 text-white font-semibold' : 'text-white/50 hover:text-white'
                }`}
              >
                <Code2 className="h-3.5 w-3.5" />
                <span>Editorial</span>
              </button>

              {isAiEnabled && (
                <button
                  onClick={() => setActiveLeftTab('aicoach')}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium transition-colors ${
                    activeLeftTab === 'aicoach' ? 'bg-amber-400/20 text-amber-300 font-semibold' : 'text-white/50 hover:text-white'
                  }`}
                >
                  <Bot className="h-3.5 w-3.5 text-amber-400" />
                  <span>Spark AI</span>
                </button>
              )}

              <button
                onClick={() => setActiveLeftTab('submissions')}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium transition-colors ${
                  activeLeftTab === 'submissions' ? 'bg-white/10 text-white font-semibold' : 'text-white/50 hover:text-white'
                }`}
              >
                <History className="h-3.5 w-3.5" />
                <span>History ({recentSubmissions.length})</span>
              </button>
            </div>

            {/* Quick Actions (Save & Share) */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onToggleSave(problem.id)}
                title={isSaved ? 'Remove Bookmark' : 'Save Problem'}
                className="p-1.5 rounded-lg text-white/50 hover:bg-white/10 hover:text-white transition-colors"
              >
                {isSaved ? (
                  <BookmarkCheck className="h-4 w-4 text-amber-400" />
                ) : (
                  <Bookmark className="h-4 w-4" />
                )}
              </button>

              <button
                onClick={handleShare}
                title="Share Problem Link"
                className="p-1.5 rounded-lg text-white/50 hover:bg-white/10 hover:text-white transition-colors relative"
              >
                {copiedShare ? (
                  <Check className="h-4 w-4 text-emerald-400" />
                ) : (
                  <Share2 className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Left Panel Content */}
          <div className="flex-1 overflow-y-auto p-5 text-sm leading-relaxed space-y-6">
            
            {activeLeftTab === 'editorial' ? (
              <EditorialTab problem={problem} onNavigateProblem={(id) => onNavigate('workspace', id)} />
            ) : activeLeftTab === 'aicoach' ? (
              <AICoachPanel
                problem={problem}
                userCode={code}
                failedTestDetails={executionResult?.details?.find(d => !d.passed)}
                experienceLevel={currentUser.experienceLevel || 'Beginner'}
                onInsertCode={(snippet) => setCode(prev => prev + '\n' + snippet)}
              />
            ) : activeLeftTab === 'submissions' ? (
              /* Submissions History List */
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                  <h3 className="font-display text-base font-bold text-white">Submission History</h3>
                  <span className="text-xs text-white/40">{recentSubmissions.length} attempts recorded</span>
                </div>

                {recentSubmissions.length === 0 ? (
                  <div className="py-12 text-center text-white/40 space-y-2">
                    <History className="h-8 w-8 mx-auto text-white/20" />
                    <p className="text-xs">No submissions yet for this problem.</p>
                    <p className="text-[11px] text-white/30">Click "Submit →" to record your official attempt.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {recentSubmissions.map((sub) => (
                      <div 
                        key={sub.id}
                        onClick={() => setSelectedSubmissionView(sub)}
                        className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3.5 hover:bg-white/[0.05] cursor-pointer transition-all space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-bold flex items-center gap-1.5 ${
                            sub.status === 'Accepted' ? 'text-emerald-400' : 'text-rose-400'
                          }`}>
                            {sub.status === 'Accepted' ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                            {sub.status}
                          </span>
                          <span className="text-[11px] font-mono uppercase text-white/40">{sub.language}</span>
                        </div>

                        <div className="flex items-center justify-between text-[11px] font-mono text-white/50 pt-1 border-t border-white/[0.04]">
                          <span>Runtime: <strong className="text-white/80">{sub.runtimeMs} ms</strong></span>
                          <span>Memory: <strong className="text-white/80">{sub.memoryMb} MB</strong></span>
                          <span>{sub.timestamp}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* Problem Description */
              <div className="space-y-5">
                
                {/* Header */}
                <div>
                  {/* Canonical Breadcrumb */}
                  <div className="flex items-center gap-1.5 text-xs text-white/40 mb-3">
                    <Link href="/problems" className="hover:text-white transition-colors">Problems</Link>
                    <span>/</span>
                    <span className="text-white/60 truncate max-w-[140px]">{problem.topic}</span>
                    <span>/</span>
                    <span className="text-amber-400 font-medium truncate max-w-[200px]">{problem.title}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="font-mono text-xs text-white/40">{problem.id.toUpperCase()}</span>
                    <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                      problem.difficulty === 'Easy' 
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' 
                        : problem.difficulty === 'Medium' 
                        ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' 
                        : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                    }`}>
                      {problem.difficulty}
                    </span>
                    <span className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] font-mono text-white/60">
                      {problem.acceptance} Acceptance
                    </span>
                    {isSolved && (
                      <span className="flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
                        <Check className="h-3 w-3" />
                        Solved
                      </span>
                    )}
                  </div>
                  <h1 className="font-display text-2xl font-bold tracking-tight text-white">{problem.title}</h1>
                </div>

                {/* Topic & Pattern Tag Pills */}
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-xs font-mono text-cyan-300">
                    Topic: {problem.topic}
                  </span>
                  <span className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-2.5 py-1 text-xs font-mono text-amber-300">
                    Pattern: {problem.pattern}
                  </span>
                </div>

                {/* Markdown Description */}
                <div className="space-y-3 text-white/80 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-sans">
                  {problem.description}
                </div>

                {/* Examples */}
                <div className="space-y-3">
                  <h3 className="font-display text-sm font-bold text-white">Examples</h3>
                  {problem.examples.map((ex, idx) => (
                    <div 
                      key={idx}
                      className="rounded-xl border border-white/[0.08] bg-[#07070a] p-3.5 font-mono text-xs space-y-1 text-white/80"
                    >
                      <p><strong className="text-white/40">Input:</strong> {ex.input}</p>
                      <p><strong className="text-white/40">Output:</strong> {ex.output}</p>
                      {ex.explanation && (
                        <p className="text-white/50 text-[11px] font-sans pt-1"><strong className="text-white/40 font-mono">Explanation:</strong> {ex.explanation}</p>
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

                {/* Input / Output Format */}
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

                {/* Progressive Hint System */}
                {problem.hints.length > 0 && (
                  <div className="border-t border-white/[0.08] pt-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-sm font-bold text-white">Need a hint?</h3>
                      <span className="text-[11px] text-white/40">
                        {revealedHintCount} of {problem.hints.length} revealed
                      </span>
                    </div>

                    <div className="space-y-2">
                      {problem.hints.slice(0, revealedHintCount).map((hint) => {
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

        {/* RIGHT PANEL: Code Editor & Bottom Execution Terminal */}
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
                onChange={(e) => requestLanguageChange(e.target.value as SupportedLanguage)}
                className="rounded-lg border border-white/[0.08] bg-[#14141b] px-2.5 py-1 text-xs text-white focus:outline-none focus:border-amber-400/50"
              >
                <option value="python">Python 3 (Active)</option>
                <option value="javascript">JavaScript (Active)</option>
                <option value="cpp">C++ 20 (Configuring...)</option>
                <option value="java">Java 21 (Configuring...)</option>
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

              {/* Spark AI Mentor Button */}
              {FeatureFlagService.getFlag('SPARK_AI') && (
                <button
                  onClick={() => handleOpenSpark('hint')}
                  title="Ask Spark AI (Hints, Debug, Patterns, Complexity)"
                  className="flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1.5 text-xs font-semibold text-amber-300 transition-all active:scale-95 shadow-sm shadow-amber-500/10"
                >
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Ask Spark</span>
                </button>
              )}

              {/* Run button */}
              <button
                onClick={handleRunCode}
                disabled={isRunning || isSubmitting || !isExecutionEnabled}
                title={!isExecutionEnabled ? 'Code execution is temporarily unavailable' : 'Run tests (Ctrl+Enter)'}
                className={`flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-white/10 active:scale-95 transition-all ${
                  isRunning || !isExecutionEnabled ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <Play className={`h-3 w-3 fill-white ${isRunning ? 'animate-pulse' : ''}`} />
                <span>{isRunning ? 'Running...' : '▶ Run'}</span>
              </button>

              {/* Submit button */}
              <button
                onClick={handleSubmitSolution}
                disabled={isRunning || isSubmitting || !isExecutionEnabled}
                title={!isExecutionEnabled ? 'Code execution is temporarily unavailable' : 'Submit solution (Ctrl+Shift+Enter)'}
                className={`flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-1.5 text-xs font-bold text-black shadow-md shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all ${
                  isSubmitting || !isExecutionEnabled ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <Send className="h-3 w-3 fill-black" />
                <span>{isSubmitting ? 'Judging...' : 'Submit →'}</span>
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

          {/* BOTTOM PANEL: Tabs: Test Cases | Console | Submission */}
          <div className="border-t border-white/[0.08] bg-[#0c0c11] flex flex-col h-64 overflow-hidden">
            
            {/* Panel Tabs Header */}
            <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-2 text-xs bg-[#0e0e14]">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setBottomTab('testcases')}
                  className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                    bottomTab === 'testcases' ? 'bg-white/10 text-white font-semibold' : 'text-white/50 hover:text-white'
                  }`}
                >
                  Test Cases
                </button>
                <button
                  onClick={() => setBottomTab('console')}
                  className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                    bottomTab === 'console' ? 'bg-white/10 text-white font-semibold' : 'text-white/50 hover:text-white'
                  }`}
                >
                  Console {executionResult?.stdout ? '⚡' : ''}
                </button>
                <button
                  onClick={() => setBottomTab('submissions')}
                  className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                    bottomTab === 'submissions' ? 'bg-white/10 text-white font-semibold' : 'text-white/50 hover:text-white'
                  }`}
                >
                  Submissions ({recentSubmissions.length})
                </button>
              </div>

              {/* Status Pill in Header */}
              {executionResult && (
                <div className="flex items-center gap-3">
                  <span className={`flex items-center gap-1.5 font-bold text-xs ${
                    executionResult.status === 'Accepted' ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {executionResult.status === 'Accepted' ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                    {executionResult.status}
                  </span>
                  <span className="text-[11px] font-mono text-white/50">
                    {executionResult.passedTestCases} / {executionResult.totalTestCases} passed
                  </span>
                  <span className="text-[11px] font-mono text-white/40">
                    {executionResult.runtimeMs} ms | {executionResult.memoryMb} MB
                  </span>
                </div>
              )}
            </div>

            {/* Panel Body */}
            <div className="flex-1 overflow-y-auto p-4 text-xs font-mono">
              {!isExecutionEnabled && (
                <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 mb-3 text-xs text-amber-300 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>Code execution is temporarily unavailable. Problem description, hints, and draft autosave remain operational.</span>
                </div>
              )}
              
              {/* TAB 1: TEST CASES */}
              {bottomTab === 'testcases' && (
                <div className="space-y-3">
                  
                  {/* Test case buttons */}
                  <div className="flex flex-wrap gap-1.5 pb-2 border-b border-white/[0.06]">
                    {displayedCases.map((tc, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveTestCaseIndex(idx)}
                        className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-mono transition-all ${
                          activeTestCaseIndex === idx 
                            ? 'bg-white/15 text-white font-bold border border-white/20' 
                            : 'bg-white/5 text-white/50 hover:text-white'
                        }`}
                      >
                        {executionResult && (
                          tc.passed ? (
                            <Check className="h-3 w-3 text-emerald-400 stroke-[3]" />
                          ) : (
                            <XCircle className="h-3 w-3 text-rose-400" />
                          )
                        )}
                        <span>Case {tc.testCaseIndex}</span>
                        {!tc.isPublic && <Lock className="h-2.5 w-2.5 text-white/30" />}
                      </button>
                    ))}
                  </div>

                  {/* Active Case Details */}
                  {activeCase && (
                    <div className="space-y-2">
                      {activeCase.isPublic ? (
                        <div className="rounded-xl border border-white/[0.06] bg-[#07070a] p-3 text-[11px] space-y-1.5 text-white/80">
                          <p><strong className="text-white/40 font-mono">Input:</strong> {JSON.stringify(activeCase.input)}</p>
                          <p><strong className="text-white/40 font-mono">Expected:</strong> {JSON.stringify(activeCase.expected)}</p>
                          {activeCase.actual !== undefined && (
                            <p className={activeCase.passed ? 'text-emerald-400' : 'text-rose-400'}>
                              <strong className="text-white/40 font-mono">Your Output:</strong> {JSON.stringify(activeCase.actual)}
                            </p>
                          )}
                          {activeCase.runtimeMs !== undefined && (
                            <p className="text-[10px] text-white/40 pt-1 border-t border-white/[0.04]">
                              Case Runtime: {activeCase.runtimeMs} ms
                            </p>
                          )}
                        </div>
                      ) : (
                        /* Hidden Test Case */
                        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-[11px] space-y-1 text-amber-200/80">
                          <div className="flex items-center gap-1.5 font-bold text-amber-400">
                            <Lock className="h-3.5 w-3.5" />
                            <span>Hidden Test Case</span>
                          </div>
                          <p className="text-white/60 text-[10px]">
                            Inputs and expected outputs are hidden to maintain assessment integrity.
                          </p>
                          {activeCase.runtimeMs !== undefined && (
                            <p className="text-[10px] text-white/40 pt-1">
                              Execution status: {activeCase.passed ? 'Passed ✓' : 'Failed ✕'} ({activeCase.runtimeMs} ms)
                            </p>
                          )}
                        </div>
                      )}

                      {/* If runtime or compilation error */}
                      {executionResult?.errorMessage && (
                        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-rose-300 text-xs font-mono space-y-1">
                          <div className="flex items-center gap-1.5 font-bold text-rose-400">
                            <AlertTriangle className="h-3.5 w-3.5" />
                            <span>Execution Message:</span>
                          </div>
                          <p className="whitespace-pre-wrap text-[11px]">{executionResult.errorMessage}</p>
                        </div>
                      )}

                      {/* Action buttons on failure */}
                      {executionResult && executionResult.status !== 'Accepted' && (
                        <div className="flex items-center gap-2 pt-1">
                          {FeatureFlagService.getFlag('SPARK_AI') && (
                            <button
                              onClick={() => handleOpenSpark('submission_analysis')}
                              className="flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/15 px-3 py-1.5 text-[11px] text-amber-300 font-bold hover:bg-amber-500/25 active:scale-95 transition-all shadow-sm shadow-amber-500/10"
                            >
                              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                              <span>Ask Spark why</span>
                            </button>
                          )}
                          {isAiEnabled && (
                            <button
                              onClick={() => {
                                setActiveLeftTab('aicoach');
                                setMobileTab('aicoach');
                              }}
                              className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/70 hover:text-white transition-colors"
                            >
                              <Bot className="h-3 w-3 text-white/50" />
                              <span>Legacy AI Tab</span>
                            </button>
                          )}
                          {problem.hints.length > 0 && revealedHintCount === 0 && (
                            <button
                              onClick={() => {
                                handleRevealNextHint();
                                setActiveLeftTab('description');
                              }}
                              className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/70 hover:text-white transition-colors"
                            >
                              <Lightbulb className="h-3 w-3 text-amber-400" />
                              <span>View Hint</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: CONSOLE */}
              {bottomTab === 'console' && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[10px] text-white/40 pb-1 border-b border-white/[0.06]">
                    <Terminal className="h-3 w-3 text-emerald-400" />
                    <span>Terminal / Process Standard I/O</span>
                  </div>

                  {executionResult?.stdout || executionResult?.stderr || executionResult?.outputLog ? (
                    <div className="space-y-2">
                      {executionResult.stdout && (
                        <div>
                          <span className="text-[10px] font-bold text-cyan-400">Standard Output:</span>
                          <pre className="text-white/80 whitespace-pre-wrap mt-0.5 bg-black/40 p-2 rounded-lg border border-white/[0.04]">
                            {executionResult.stdout}
                          </pre>
                        </div>
                      )}
                      {executionResult.stderr && (
                        <div>
                          <span className="text-[10px] font-bold text-rose-400">Standard Error:</span>
                          <pre className="text-rose-300 whitespace-pre-wrap mt-0.5 bg-rose-950/20 p-2 rounded-lg border border-rose-500/20">
                            {executionResult.stderr}
                          </pre>
                        </div>
                      )}
                      {executionResult.outputLog && !executionResult.stdout && (
                        <pre className="text-white/70 whitespace-pre-wrap bg-black/40 p-2 rounded-lg border border-white/[0.04]">
                          {executionResult.outputLog}
                        </pre>
                      )}
                    </div>
                  ) : (
                    <div className="py-8 text-center text-white/30 text-xs">
                      Run or submit code to inspect stdout/stderr stream output.
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: SUBMISSIONS HISTORY */}
              {bottomTab === 'submissions' && (
                <div className="space-y-2">
                  {recentSubmissions.length === 0 ? (
                    <div className="py-8 text-center text-white/30 text-xs">
                      No submissions recorded yet for {problem.title}.
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      {recentSubmissions.map((sub) => (
                        <div
                          key={sub.id}
                          onClick={() => setSelectedSubmissionView(sub)}
                          className="flex items-center justify-between p-2.5 rounded-lg border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.06] cursor-pointer transition-colors text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <span className={`font-bold flex items-center gap-1 ${
                              sub.status === 'Accepted' ? 'text-emerald-400' : 'text-rose-400'
                            }`}>
                              {sub.status === 'Accepted' ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                              {sub.status}
                            </span>
                            <span className="text-[10px] font-mono text-white/40 uppercase">({sub.language})</span>
                          </div>

                          <div className="flex items-center gap-4 text-[11px] text-white/50 font-mono">
                            <span>{sub.runtimeMs} ms</span>
                            <span>{sub.memoryMb} MB</span>
                            <span className="text-white/30">{sub.timestamp}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>

          </div>

        </div>

      </div>

      {/* Language Switch Confirmation Warning Modal */}
      {pendingLanguage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="max-w-md w-full rounded-2xl border border-white/15 bg-[#12121a] p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-base">
              <AlertTriangle className="h-5 w-5" />
              <span>Switch Language?</span>
            </div>
            <p className="text-xs text-white/70 leading-relaxed">
              Switching languages will replace the current editor content with the starter code for <strong className="text-white uppercase">{pendingLanguage}</strong>.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setPendingLanguage(null)}
                className="rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-white/70 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => applyLanguageChange(pendingLanguage)}
                className="rounded-xl bg-amber-400 px-4 py-2 text-xs font-bold text-black hover:bg-amber-300 transition-colors"
              >
                Switch Language
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submission Code View Modal */}
      {selectedSubmissionView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="max-w-2xl w-full rounded-2xl border border-white/15 bg-[#101017] p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div>
                <h3 className="font-display text-base font-bold text-white">Submitted Code</h3>
                <p className="text-xs text-white/50">
                  {selectedSubmissionView.language.toUpperCase()} • {selectedSubmissionView.status} • {selectedSubmissionView.runtimeMs} ms
                </p>
              </div>
              <button
                onClick={() => setSelectedSubmissionView(null)}
                className="text-white/40 hover:text-white text-xs"
              >
                ✕ Close
              </button>
            </div>

            <pre className="max-h-80 overflow-y-auto rounded-xl bg-black/60 p-4 font-mono text-xs text-white/90 border border-white/[0.06] whitespace-pre-wrap">
              {selectedSubmissionView.code}
            </pre>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setCode(selectedSubmissionView.code);
                  setSelectedSubmissionView(null);
                }}
                className="rounded-xl bg-white/10 hover:bg-white/20 px-4 py-2 text-xs font-semibold text-white transition-colors"
              >
                Load into Editor
              </button>
              <button
                onClick={() => setSelectedSubmissionView(null)}
                className="rounded-xl border border-white/10 px-4 py-2 text-xs text-white/60 hover:text-white"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

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

      {/* Standard Celebration Modal for Solves with Recommended Next Problem */}
      {showCelebration && !isFirstSolveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in zoom-in-95 duration-200">
          <div className="glass-panel max-w-md w-full rounded-3xl p-6 border border-amber-500/30 bg-[#0c0c11] shadow-[0_25px_80px_-15px_rgba(245,158,11,0.3)] space-y-5">
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 mb-3">
                <Sparkles className="h-7 w-7" />
              </div>
              <h3 className="font-display text-2xl font-bold text-white">Problem Solved ⚡</h3>
              <p className="mt-1.5 text-sm font-bold text-amber-400">
                +{solveXpEarned} XP
              </p>
              <p className="mt-1 text-xs text-white/60 leading-relaxed">
                All test cases passed for <strong>{problem.title}</strong>!
              </p>
            </div>

            {/* Performance Stats */}
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3">
                <span className="text-[10px] text-white/40 block">Runtime</span>
                <span className="font-mono text-sm font-bold text-emerald-400">
                  {executionResult?.runtimeMs || 42} ms
                </span>
              </div>
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3">
                <span className="text-[10px] text-white/40 block">Memory</span>
                <span className="font-mono text-sm font-bold text-amber-300">
                  {executionResult?.memoryMb || 18.2} MB
                </span>
              </div>
            </div>

            {/* Complexity Analysis with Spark AI review */}
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="h-4 w-4 text-amber-400" />
                <span className="text-white/80 font-medium">Mentor Code Review</span>
              </div>
              {FeatureFlagService.getFlag('SPARK_AI') ? (
                <button
                  onClick={() => {
                    setShowCelebration(false);
                    handleOpenSpark('submission_analysis');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[11px] font-bold transition-all flex items-center gap-1"
                >
                  <Sparkles className="h-3 w-3" />
                  <span>Review with Spark</span>
                </button>
              ) : (
                <span className="text-[11px] font-semibold text-amber-300">Available with Spark AI</span>
              )}
            </div>

            {/* Next Recommended Problem Section */}
            {nextProblem && (
              <div className="space-y-2 pt-1 border-t border-white/[0.06]">
                <p className="text-[11px] font-semibold text-white/50 uppercase tracking-wider">Continue Your Journey</p>
                <div 
                  onClick={() => {
                    setShowCelebration(false);
                    onNavigate('workspace', nextProblem.id);
                  }}
                  className="flex items-center justify-between rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 hover:bg-amber-500/20 cursor-pointer transition-all"
                >
                  <div>
                    <h4 className="text-xs font-bold text-white">{nextProblem.title}</h4>
                    <p className="text-[10px] text-white/50">{nextProblem.topic} • {nextProblem.pattern}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    nextProblem.difficulty === 'Easy' ? 'text-emerald-400 bg-emerald-500/15' : 'text-amber-400 bg-amber-500/15'
                  }`}>
                    {nextProblem.difficulty}
                  </span>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2 pt-2">
              {nextProblem ? (
                <button
                  onClick={() => {
                    setShowCelebration(false);
                    onNavigate('workspace', nextProblem.id);
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 py-2.5 text-xs font-bold text-black shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-95 transition-all"
                >
                  <span>Solve Next →</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setShowCelebration(false);
                    onNavigate('roadmaps');
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 py-2.5 text-xs font-bold text-black shadow-lg shadow-amber-500/20"
                >
                  <span>Continue Roadmap →</span>
                </button>
              )}
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

      {/* Phase 6: Spark AI Drawer */}
      <SparkDrawer
        isOpen={isSparkDrawerOpen}
        onClose={() => setIsSparkDrawerOpen(false)}
        initialAction={sparkDrawerAction}
        problem={problem}
        currentCode={code}
        selectedLanguage={selectedLanguage}
        executionResult={executionResult}
        onApplyCodeDiff={handleApplyCodeDiff}
        onPreviewDiff={(diff) => setActiveDiffSuggestion(diff)}
      />

      {/* Phase 6: Spark Safe Code Diff Modal */}
      {activeDiffSuggestion && (
        <SparkDiffModal
          isOpen={!!activeDiffSuggestion}
          onClose={() => setActiveDiffSuggestion(null)}
          diff={activeDiffSuggestion}
          onApply={handleApplyCodeDiff}
        />
      )}

    </div>
  );
};
