import React, { useState, useRef, useEffect } from 'react';
import { Bot, Sparkles, HelpCircle, Terminal, Send, Lock, Unlock } from 'lucide-react';
import { Problem, AICoachMessage, ExperienceLevel } from '../../types';
import { AICoachService } from '../../services/aiCoachService';

interface AICoachPanelProps {
  problem: Problem;
  userCode: string;
  failedTestDetails?: any;
  onInsertCode?: (code: string) => void;
  experienceLevel?: ExperienceLevel;
}

export const AICoachPanel: React.FC<AICoachPanelProps> = ({
  problem,
  userCode,
  failedTestDetails,
  onInsertCode,
  experienceLevel = 'Beginner'
}) => {
  const [messages, setMessages] = useState<AICoachMessage[]>([
    AICoachService.getInitialGreeting(problem, experienceLevel)
  ]);
  const [hintLevel, setHintLevel] = useState<number>(0);
  const [inputText, setInputText] = useState('');
  const [showSolutionConfirm, setShowSolutionConfirm] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleAskHint = () => {
    const { message, nextLevel } = AICoachService.getNextHint(problem, hintLevel, experienceLevel);
    setHintLevel(nextLevel);
    setMessages(prev => [...prev, message]);
  };

  const handleExplainPattern = () => {
    const msg = AICoachService.explainPattern(problem, experienceLevel);
    setMessages(prev => [...prev, msg]);
  };

  const handleExplainFailure = () => {
    const msg = AICoachService.explainFailure(problem, userCode, failedTestDetails, experienceLevel);
    setMessages(prev => [...prev, msg]);
  };

  const handleReviewComplexity = () => {
    const msg = AICoachService.reviewComplexity(problem, userCode, experienceLevel);
    setMessages(prev => [...prev, msg]);
  };

  const handleUnlockSolution = () => {
    setShowSolutionConfirm(false);
    const msg = AICoachService.unlockSolution(problem);
    setMessages(prev => [...prev, msg]);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: AICoachMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: inputText,
      timestamp: 'Just now'
    };

    const coachReply = AICoachService.answerFreeform(problem, inputText, experienceLevel);

    setMessages(prev => [...prev, userMsg, coachReply]);
    setInputText('');
  };

  return (
    <div className="flex h-full flex-col justify-between bg-[#0a0a0e] text-xs">
      
      {/* Top Coach Header */}
      <div className="border-b border-white/[0.08] bg-[#0d0d12] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Bot className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display text-xs font-bold text-white">Socratic AI Coach</span>
              <span className="rounded bg-amber-400/15 text-[9px] font-bold text-amber-300 px-1.5 py-0.2">
                {experienceLevel}
              </span>
            </div>
            <span className="block text-[10px] text-white/40">Guiding deliberate discovery</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[10px] font-mono text-white/50">
          <span>Hints unlocked:</span>
          <span className="text-amber-400 font-bold">{hintLevel} / 3</span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[90%] rounded-2xl p-3.5 leading-relaxed text-xs ${
                m.sender === 'user'
                  ? 'bg-amber-400/15 border border-amber-400/30 text-white'
                  : 'bg-white/[0.03] border border-white/[0.08] text-white/85'
              }`}
            >
              <div className="whitespace-pre-wrap">{m.text}</div>

              {m.codeSnippet && onInsertCode && (
                <button
                  onClick={() => onInsertCode(m.codeSnippet!)}
                  className="mt-3 flex items-center gap-1 rounded-lg bg-white/10 px-2.5 py-1 text-[10px] font-semibold text-amber-300 hover:bg-white/20"
                >
                  Insert code into editor
                </button>
              )}
            </div>
            <span className="mt-1 px-1 text-[9px] text-white/30">{m.timestamp}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Action Pills */}
      <div className="border-t border-white/[0.08] bg-[#0d0d12] p-3 space-y-2">
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={handleAskHint}
            disabled={hintLevel >= 3}
            className={`rounded-lg border px-2.5 py-1 text-[11px] font-medium transition-colors ${
              hintLevel >= 3 
                ? 'border-white/5 text-white/20' 
                : 'border-amber-400/30 bg-amber-400/10 text-amber-300 hover:bg-amber-400/20'
            }`}
          >
            💡 {hintLevel === 0 ? 'Give me a hint' : `Next hint (${hintLevel + 1}/3)`}
          </button>

          <button
            onClick={handleExplainPattern}
            className="rounded-lg border border-cyan-400/30 bg-cyan-400/10 px-2.5 py-1 text-[11px] font-medium text-cyan-300 hover:bg-cyan-400/20 transition-colors"
          >
            🧩 Explain pattern
          </button>

          <button
            onClick={handleExplainFailure}
            className="rounded-lg border border-rose-400/30 bg-rose-400/10 px-2.5 py-1 text-[11px] font-medium text-rose-300 hover:bg-rose-400/20 transition-colors"
          >
            🔍 Why is it failing?
          </button>

          <button
            onClick={handleReviewComplexity}
            className="rounded-lg border border-purple-400/30 bg-purple-400/10 px-2.5 py-1 text-[11px] font-medium text-purple-300 hover:bg-purple-400/20 transition-colors"
          >
            ⚡ Review complexity
          </button>

          <button
            onClick={() => setShowSolutionConfirm(true)}
            className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-white/50 hover:bg-white/10 hover:text-white transition-colors"
          >
            🔓 Show solution
          </button>
        </div>

        {/* Show Solution Confirmation Dialog */}
        {showSolutionConfirm && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200">
            <p className="font-semibold">Unlock full solution?</p>
            <p className="mt-1 text-[11px] text-white/70">
              We recommend trying at least 2 hints first to maximize your long-term interview retention.
            </p>
            <div className="mt-2.5 flex items-center gap-2">
              <button
                onClick={handleUnlockSolution}
                className="rounded-lg bg-amber-400 px-3 py-1 text-[11px] font-bold text-black hover:bg-amber-300"
              >
                Yes, reveal solution
              </button>
              <button
                onClick={() => setShowSolutionConfirm(false)}
                className="rounded-lg border border-white/10 px-3 py-1 text-[11px] text-white/60 hover:text-white"
              >
                Keep trying myself
              </button>
            </div>
          </div>
        )}

        {/* Input form */}
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask AI Coach a question about this problem..."
            className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-xs text-white placeholder:text-white/30 focus:border-amber-400/50 focus:outline-none"
          />
          <button
            type="submit"
            className="flex items-center justify-center rounded-xl bg-amber-400 px-3 py-2 text-black hover:bg-amber-300 transition-colors"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </form>
      </div>

    </div>
  );
};
