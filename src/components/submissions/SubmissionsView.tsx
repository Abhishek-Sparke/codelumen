import React, { useState } from 'react';
import { CheckCircle2, XCircle, Clock, Code, X, Copy, Check } from 'lucide-react';
import { Submission } from '../../types';
import { StorageService } from '../../services/storage';

export const SubmissionsView: React.FC = () => {
  const [submissions, setSubmissions] = useState<Submission[]>(StorageService.getSubmissions());
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Header */}
      <div>
        <span className="lumen-tag text-emerald-400">Execution History</span>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Submissions
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-white/50">
          Complete log of your submitted algorithmic implementations, runtimes, and memory footprints.
        </p>
      </div>

      {/* Submissions Table */}
      <div className="glass-panel overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0b0b10]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/[0.08] bg-[#0e0e14] text-[11px] font-semibold text-white/50 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 pl-6 pr-4">Status</th>
                <th className="py-3.5 px-4">Problem</th>
                <th className="py-3.5 px-4">Language</th>
                <th className="py-3.5 px-4">Runtime</th>
                <th className="py-3.5 px-4">Memory</th>
                <th className="py-3.5 pr-6 pl-4 text-right">Submitted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {submissions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-xs text-white/40">
                    No submissions recorded yet. Your first solve is waiting!
                  </td>
                </tr>
              ) : (
                submissions.map((sub) => (
                  <tr
                    key={sub.id}
                    onClick={() => setSelectedSubmission(sub)}
                    className="cursor-pointer hover:bg-white/[0.04] transition-colors"
                  >
                    {/* Status */}
                    <td className="py-4 pl-6 pr-4">
                      {sub.status === 'Accepted' ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                          <CheckCircle2 className="h-4 w-4" />
                          Accepted
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-400">
                          <XCircle className="h-4 w-4" />
                          {sub.status}
                        </span>
                      )}
                    </td>

                    {/* Problem */}
                    <td className="py-4 px-4 font-semibold text-white">
                      {sub.problemTitle}
                    </td>

                    {/* Language */}
                    <td className="py-4 px-4 uppercase font-mono text-[11px] text-white/70">
                      {sub.language}
                    </td>

                    {/* Runtime */}
                    <td className="py-4 px-4 font-mono text-white/80">
                      {sub.runtimeMs} ms
                    </td>

                    {/* Memory */}
                    <td className="py-4 px-4 font-mono text-white/80">
                      {sub.memoryMb} MB
                    </td>

                    {/* Date */}
                    <td className="py-4 pr-6 pl-4 text-right text-white/40 text-[11px]">
                      {sub.timestamp}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Code Inspector Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in duration-150">
          <div 
            className="glass-panel relative w-full max-w-2xl overflow-hidden rounded-3xl border border-white/[0.12] bg-[#0c0c11] p-6 sm:p-8 shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${
                  selectedSubmission.status === 'Accepted' ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {selectedSubmission.status}
                </span>
                <h3 className="font-display text-xl font-bold text-white mt-0.5">
                  {selectedSubmission.problemTitle}
                </h3>
              </div>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="p-1 rounded text-white/40 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Metrics */}
            <div className="flex items-center gap-6 text-xs font-mono text-white/60 bg-white/[0.02] border border-white/[0.06] rounded-xl p-3">
              <span>Language: <strong className="text-white uppercase">{selectedSubmission.language}</strong></span>
              <span>Runtime: <strong className="text-white">{selectedSubmission.runtimeMs} ms</strong></span>
              <span>Memory: <strong className="text-white">{selectedSubmission.memoryMb} MB</strong></span>
            </div>

            {/* Code Box */}
            <div className="relative rounded-2xl border border-white/[0.08] bg-[#07070a] p-4 font-mono text-xs overflow-x-auto max-h-80">
              <button
                onClick={() => handleCopyCode(selectedSubmission.code)}
                className="absolute right-3 top-3 flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/60 hover:text-white"
              >
                {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                <span>{copied ? 'Copied' : 'Copy Code'}</span>
              </button>
              <pre className="text-white/90 leading-relaxed pt-3">
                <code>{selectedSubmission.code}</code>
              </pre>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedSubmission(null)}
                className="rounded-xl bg-white/10 px-5 py-2 text-xs font-semibold text-white hover:bg-white/20"
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
