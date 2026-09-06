import React, { useState, useEffect } from 'react';
import { 
  Sparkles, X, Lightbulb, Bug, Brain, Compass, 
  Zap, ThumbsUp, ThumbsDown, ArrowRight, Check, 
  Shield, Code2, AlertTriangle, Eye, EyeOff, RotateCcw
} from 'lucide-react';
import { Problem, SupportedLanguage } from '../../types';
import { SparkActionType, SparkHintLevel, SparkResponse, SparkDiffSuggestion } from '../../types/spark';
import { SparkAIService } from '../../services/sparkAIService';

interface SparkDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  problem: Problem;
  currentCode: string;
  selectedLanguage: SupportedLanguage;
  executionResult?: any;
  onApplyCodeDiff?: (suggestedCode: string) => void;
  onPreviewDiff?: (diff: SparkDiffSuggestion) => void;
  initialAction?: SparkActionType;
}

export const SparkDrawer: React.FC<SparkDrawerProps> = ({
  isOpen,
  onClose,
  problem,
  currentCode,
  selectedLanguage,
  executionResult,
  onApplyCodeDiff,
  onPreviewDiff,
  initialAction = 'hint'
}) => {
  const [activeAction, setActiveAction] = useState<SparkActionType>(initialAction);
  const [currentHintLevel, setCurrentHintLevel] = useState<SparkHintLevel>(1);
  const [learningMode, setLearningMode] = useState<boolean>(() => SparkAIService.isLearningMode());
  const [approachInput, setApproachInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<SparkResponse | null>(null);
  const [feedbackSent, setFeedbackSent] = useState<boolean>(false);
  const [hasSecrets, setHasSecrets] = useState<boolean>(false);

  // Check for potential secrets in code
  useEffect(() => {
    setHasSecrets(SparkAIService.detectPotentialSecrets(currentCode));
  }, [currentCode]);

  // Load initial response or update when drawer opens with initialAction
  useEffect(() => {
    if (isOpen) {
      handleExecuteAction(initialAction, { level: 1 });
    }
  }, [isOpen, initialAction, problem.id]);

  const handleToggleLearningMode = () => {
    const next = !learningMode;
    setLearningMode(next);
    SparkAIService.setLearningMode(next);
    if (activeAction === 'hint') {
      handleExecuteAction('hint', { level: currentHintLevel, learningMode: next });
    }
  };

  const handleExecuteAction = async (action: SparkActionType, opts: Record<string, any> = {}) => {
    setIsLoading(true);
    setActiveAction(action);
    setFeedbackSent(false);

    const level = opts.level || currentHintLevel;
    if (action === 'hint') {
      setCurrentHintLevel(level);
    }

    try {
      const res = await SparkAIService.executeAction(action, {
        problem: {
          id: problem.id,
          slug: problem.slug,
          title: problem.title,
          difficulty: problem.difficulty,
          pattern: problem.pattern,
          topic: problem.topic,
          description: problem.description,
          constraints: problem.constraints,
          starterCode: problem.starterCode,
          solutionCode: (problem as any).solutionCode || (problem.editorial?.optimal?.code ? { [selectedLanguage]: problem.editorial.optimal.code } : undefined),
          timeComplexity: (problem as any).timeComplexity || problem.editorial?.optimal?.complexity?.time || 'O(n)',
          spaceComplexity: (problem as any).spaceComplexity || problem.editorial?.optimal?.complexity?.space || 'O(n)'
        },
        code: currentCode,
        language: selectedLanguage,
        visibleError: executionResult?.errorMessage || (executionResult?.status !== 'Accepted' ? executionResult?.status : undefined),
        executionStatus: executionResult?.status,
        runtimeMs: executionResult?.runtimeMs,
        memoryKb: executionResult?.memoryMb ? Math.round(executionResult.memoryMb * 1024) : undefined,
        testCaseSummary: executionResult?.details ? {
          passed: executionResult.passedTestCases || 0,
          total: executionResult.totalTestCases || 0,
          failedInput: executionResult.details.find((d: any) => !d.passed)?.input ? JSON.stringify(executionResult.details.find((d: any) => !d.passed)?.input) : undefined,
          failedExpected: executionResult.details.find((d: any) => !d.passed)?.expected ? JSON.stringify(executionResult.details.find((d: any) => !d.passed)?.expected) : undefined,
          failedActual: executionResult.details.find((d: any) => !d.passed)?.actual ? JSON.stringify(executionResult.details.find((d: any) => !d.passed)?.actual) : undefined
        } : undefined,
        approachText: action === 'approach' ? approachInput : undefined
      }, { ...opts, learningMode });

      setResponse(res);
    } catch {
      setResponse({
        success: false,
        action,
        title: 'Spark AI Unreachable',
        summary: 'Unable to connect to mentor engine.',
        content: 'Please check your connection and try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendFeedback = (helpful: boolean) => {
    SparkAIService.recordFeedback({
      action: activeAction,
      problemId: problem.id,
      helpful
    });
    setFeedbackSent(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col border-l border-white/[0.08] bg-[#0c0c14] shadow-2xl backdrop-blur-xl animate-in slide-in-from-right duration-200">
      
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-white/[0.08] bg-[#0e0e18] px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-white">Spark AI Mentor</h3>
              <span className="rounded-full bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 text-[10px] font-semibold text-amber-300">
                Phase 6
              </span>
            </div>
            <p className="text-[11px] text-white/40">Socratic guidance · Anti-spoiler hints</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Learning Mode Toggle */}
          <button
            onClick={handleToggleLearningMode}
            title={learningMode ? 'Anti-Spoiler Learning Mode is ON' : 'Anti-Spoiler Learning Mode is OFF'}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-medium transition-colors cursor-pointer ${
              learningMode 
                ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300' 
                : 'bg-white/[0.04] border border-white/10 text-white/50'
            }`}
          >
            {learningMode ? <EyeOff className="h-3 w-3 text-emerald-400" /> : <Eye className="h-3 w-3" />}
            <span>{learningMode ? 'Learning Mode' : 'Direct Mode'}</span>
          </button>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-white/40 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Secret Warning Banner (if clear token detected in user code) */}
      {hasSecrets && (
        <div className="flex items-center gap-2 border-b border-amber-500/20 bg-amber-500/10 px-4 py-2 text-xs text-amber-200">
          <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
          <span>Notice: Potential API token detected in code. Spark redacts all sensitive strings before analysis.</span>
        </div>
      )}

      {/* Action Tabs Bar */}
      <div className="flex items-center gap-1 border-b border-white/[0.06] bg-[#0a0a10] px-4 py-2 overflow-x-auto text-xs no-scrollbar">
        <button
          onClick={() => handleExecuteAction('hint', { level: 1 })}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 whitespace-nowrap transition-colors cursor-pointer ${
            activeAction === 'hint' ? 'bg-amber-400 text-black font-semibold' : 'text-white/60 hover:bg-white/[0.04] hover:text-white'
          }`}
        >
          <Lightbulb className="h-3.5 w-3.5" />
          <span>Progressive Hint</span>
        </button>

        <button
          onClick={() => handleExecuteAction('debug')}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 whitespace-nowrap transition-colors cursor-pointer ${
            activeAction === 'debug' ? 'bg-amber-400 text-black font-semibold' : 'text-white/60 hover:bg-white/[0.04] hover:text-white'
          }`}
        >
          <Bug className="h-3.5 w-3.5" />
          <span>Debug Code</span>
        </button>

        <button
          onClick={() => handleExecuteAction('pattern')}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 whitespace-nowrap transition-colors cursor-pointer ${
            activeAction === 'pattern' ? 'bg-amber-400 text-black font-semibold' : 'text-white/60 hover:bg-white/[0.04] hover:text-white'
          }`}
        >
          <Brain className="h-3.5 w-3.5" />
          <span>Explain Pattern</span>
        </button>

        <button
          onClick={() => handleExecuteAction('complexity')}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 whitespace-nowrap transition-colors cursor-pointer ${
            activeAction === 'complexity' ? 'bg-amber-400 text-black font-semibold' : 'text-white/60 hover:bg-white/[0.04] hover:text-white'
          }`}
        >
          <Zap className="h-3.5 w-3.5" />
          <span>Complexity</span>
        </button>

        <button
          onClick={() => handleExecuteAction('approach')}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 whitespace-nowrap transition-colors cursor-pointer ${
            activeAction === 'approach' ? 'bg-amber-400 text-black font-semibold' : 'text-white/60 hover:bg-white/[0.04] hover:text-white'
          }`}
        >
          <Compass className="h-3.5 w-3.5" />
          <span>Review Approach</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs leading-relaxed text-white/80">
        
        {/* Approach Input if activeAction === 'approach' */}
        {activeAction === 'approach' && (
          <div className="space-y-2 rounded-xl border border-white/[0.08] bg-white/[0.02] p-3.5">
            <label className="text-[11px] font-semibold text-white/70">
              Describe your planned strategy:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={approachInput}
                onChange={(e) => setApproachInput(e.target.value)}
                placeholder="e.g., I plan to sort nums and use two pointers to find target sum..."
                className="flex-1 rounded-lg border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-white placeholder-white/30 focus:border-amber-400 focus:outline-none"
              />
              <button
                onClick={() => handleExecuteAction('approach')}
                className="rounded-lg bg-amber-400 px-3 py-1.5 text-xs font-semibold text-black hover:bg-amber-300 transition-colors cursor-pointer"
              >
                Validate
              </button>
            </div>
          </div>
        )}

        {/* Loading Spinner */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-3">
            <div className="h-7 w-7 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
            <p className="text-xs text-white/50 animate-pulse">Spark is analyzing your code and problem invariants...</p>
          </div>
        ) : response ? (
          <div className="space-y-4 animate-in fade-in duration-200">
            
            {/* Title & Summary */}
            <div className="space-y-1 border-b border-white/[0.06] pb-3">
              <div className="flex items-center justify-between gap-2">
                <h4 className="font-bold text-sm text-white">{response.title}</h4>
                {response.hintLevel && (
                  <span className="text-[11px] font-mono text-amber-400">
                    Step {response.hintLevel} / 5
                  </span>
                )}
              </div>
              <p className="text-xs text-white/60">{response.summary}</p>

              {/* Badges */}
              {response.badges && response.badges.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap pt-2">
                  {response.badges.map((b, idx) => (
                    <span 
                      key={idx}
                      className={`rounded px-2 py-0.5 text-[10px] font-semibold border ${
                        b.type === 'pattern' 
                          ? 'bg-amber-400/10 border-amber-400/20 text-amber-300'
                          : b.type === 'complexity'
                          ? 'bg-blue-400/10 border-blue-400/20 text-blue-300'
                          : b.type === 'warning'
                          ? 'bg-red-400/10 border-red-400/20 text-red-300'
                          : 'bg-emerald-400/10 border-emerald-400/20 text-emerald-300'
                      }`}
                    >
                      {b.label}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Structured Sections (if available) */}
            {response.sections && response.sections.length > 0 && (
              <div className="space-y-3">
                {response.sections.map((sec, idx) => (
                  <div key={idx} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5 space-y-1.5">
                    <h5 className="font-bold text-xs text-white flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                      {sec.title}
                    </h5>
                    <p className="text-xs text-white/70 whitespace-pre-line">{sec.content}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Main Content Markdown Card */}
            <div className="rounded-xl border border-white/[0.08] bg-[#0e0e18] p-4 text-xs text-white/80 whitespace-pre-line leading-relaxed">
              {response.content}
            </div>

            {/* Diff Preview & Apply Button (if diff available) */}
            {response.diff && (
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.03] p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-amber-300 flex items-center gap-1.5">
                    <Code2 className="h-4 w-4" />
                    Suggested Fix Available
                  </span>
                  <div className="flex items-center gap-2">
                    {onPreviewDiff && (
                      <button
                        onClick={() => onPreviewDiff(response.diff!)}
                        className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1.5 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 transition-colors cursor-pointer"
                      >
                        Compare Diff
                      </button>
                    )}
                    {onApplyCodeDiff && (
                      <button
                        onClick={() => onApplyCodeDiff(response.diff!.suggestedCode)}
                        className="rounded-lg bg-amber-400 px-3 py-1.5 text-xs font-semibold text-black hover:bg-amber-300 transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <Check className="h-3.5 w-3.5" />
                        Apply
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-[11px] text-white/60">{response.diff.explanation}</p>
              </div>
            )}

            {/* Next Progressive Hint Button */}
            {response.nextHintAvailable && response.nextHintLevel && (
              <div className="pt-2">
                <button
                  onClick={() => handleExecuteAction('hint', { level: response.nextHintLevel })}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-amber-400/40 bg-amber-400/10 py-2.5 text-xs font-semibold text-amber-300 hover:bg-amber-400/20 transition-all cursor-pointer"
                >
                  <span>Request Next Hint (Level {response.nextHintLevel})</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* Bottom Footer: Feedback Loop */}
      <div className="border-t border-white/[0.08] bg-[#0a0a12] px-5 py-3 flex items-center justify-between text-xs text-white/50">
        <span className="text-[11px]">Was this mentor insight helpful?</span>
        {feedbackSent ? (
          <span className="text-emerald-400 font-medium text-[11px] flex items-center gap-1">
            <Check className="h-3 w-3" />
            Thank you for your feedback!
          </span>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSendFeedback(true)}
              className="flex items-center gap-1 rounded-lg border border-white/10 px-2 py-1 text-white/60 hover:text-emerald-400 hover:border-emerald-500/30 transition-colors cursor-pointer"
            >
              <ThumbsUp className="h-3 w-3" />
              <span>Yes</span>
            </button>
            <button
              onClick={() => handleSendFeedback(false)}
              className="flex items-center gap-1 rounded-lg border border-white/10 px-2 py-1 text-white/60 hover:text-red-400 hover:border-red-500/30 transition-colors cursor-pointer"
            >
              <ThumbsDown className="h-3 w-3" />
              <span>No</span>
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
