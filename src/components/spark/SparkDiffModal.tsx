import React, { useState } from 'react';
import { X, Check, Copy, Code2, ArrowRight } from 'lucide-react';
import { SparkDiffSuggestion } from '../../types/spark';

interface SparkDiffModalProps {
  isOpen: boolean;
  onClose: () => void;
  diff: SparkDiffSuggestion;
  onApply: (newCode: string) => void;
}

export const SparkDiffModal: React.FC<SparkDiffModalProps> = ({
  isOpen,
  onClose,
  diff,
  onApply
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(diff.suggestedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApply = () => {
    onApply(diff.suggestedCode);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="max-w-3xl w-full rounded-2xl border border-white/10 bg-[#0d0d16] shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] px-6 py-4 bg-[#10101c]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400">
              <Code2 className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Spark Suggested Fix</h3>
              <p className="text-xs text-white/40">Review changes before applying to your editor</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-white/40 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Explanation Banner */}
        <div className="border-b border-white/[0.06] bg-amber-500/[0.03] px-6 py-3 text-xs text-amber-200/90 leading-relaxed">
          <span className="font-semibold text-amber-400 mr-1.5">Mentor Note:</span>
          {diff.explanation}
        </div>

        {/* Diff Comparison Body */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          {/* Current Code */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-white/50 text-[11px] font-sans">
              <span>Your Current Code</span>
            </div>
            <pre className="rounded-xl border border-red-500/20 bg-red-950/10 p-3.5 text-red-200/90 text-xs overflow-x-auto whitespace-pre max-h-[350px]">
              {diff.originalCode}
            </pre>
          </div>

          {/* Suggested Fix */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-white/50 text-[11px] font-sans">
              <span className="text-emerald-400 font-semibold">Suggested Fix</span>
            </div>
            <pre className="rounded-xl border border-emerald-500/20 bg-emerald-950/10 p-3.5 text-emerald-200/90 text-xs overflow-x-auto whitespace-pre max-h-[350px]">
              {diff.suggestedCode}
            </pre>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-white/[0.08] bg-[#10101c] px-6 py-3.5 flex items-center justify-between">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 px-3 py-1.5 text-xs text-white/70 hover:bg-white/5 transition-colors cursor-pointer"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Code'}</span>
          </button>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-white/60 hover:text-white transition-colors cursor-pointer"
            >
              Dismiss
            </button>
            <button
              onClick={handleApply}
              className="flex items-center gap-1.5 rounded-xl bg-amber-400 px-5 py-2 text-xs font-semibold text-black hover:bg-amber-300 transition-all cursor-pointer shadow-lg shadow-amber-400/10"
            >
              <Check className="h-4 w-4" />
              <span>Apply Fix to Editor</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
