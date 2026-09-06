import React, { useEffect, useState } from 'react';
import {
  FileText,
  Save,
  Send,
  History,
  RotateCcw,
  Check,
  Eye,
  Edit3,
  ExternalLink,
  Clock,
  Shield,
  AlertCircle
} from 'lucide-react';
import { UserProfile, DiscussionRulesRevision } from '../../../types';
import { AdminService } from '../../../services/adminService';
import { Link } from '../../../router/Link';

interface AdminDiscussionRulesViewProps {
  currentUser: UserProfile;
}

export const AdminDiscussionRulesView: React.FC<AdminDiscussionRulesViewProps> = ({ currentUser }) => {
  const [currentPublished, setCurrentPublished] = useState<DiscussionRulesRevision | null>(null);
  const [revisions, setRevisions] = useState<DiscussionRulesRevision[]>([]);
  const [title, setTitle] = useState('');
  const [contentMarkdown, setContentMarkdown] = useState('');
  const [changeSummary, setChangeSummary] = useState('');
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const loadRules = async () => {
    setLoading(true);
    const res = await AdminService.getDiscussionRules(currentUser);
    if (res.success) {
      if (res.currentPublished) {
        setCurrentPublished(res.currentPublished);
        setTitle(res.currentPublished.title);
        setContentMarkdown(res.currentPublished.contentMarkdown);
      }
      if (res.revisions) {
        setRevisions(res.revisions);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    loadRules();
  }, []);

  const handleSaveDraft = async () => {
    if (!title.trim() || !contentMarkdown.trim()) {
      showToast('Title and content cannot be empty.');
      return;
    }
    setIsSaving(true);
    const res = await AdminService.saveDiscussionRulesDraft(
      currentUser,
      title,
      contentMarkdown,
      changeSummary || 'Saved working draft'
    );
    if (res.success) {
      showToast('Draft saved successfully.');
      loadRules();
    } else {
      showToast(res.error || 'Failed to save draft');
    }
    setIsSaving(false);
  };

  const handlePublish = async (revisionId?: string) => {
    setIsSaving(true);
    let targetRevId = revisionId;

    // If publishing current editor changes without explicit revisionId, save draft first
    if (!targetRevId) {
      const draftRes = await AdminService.saveDiscussionRulesDraft(
        currentUser,
        title,
        contentMarkdown,
        changeSummary || 'Published update'
      );
      if (draftRes.success && draftRes.draft) {
        targetRevId = draftRes.draft.id;
      } else {
        showToast(draftRes.error || 'Failed to prepare revision for publishing.');
        setIsSaving(false);
        return;
      }
    }

    const pubRes = await AdminService.publishDiscussionRules(currentUser, targetRevId);
    if (pubRes.success && pubRes.published) {
      showToast(`Version ${pubRes.published.version} published to live platform!`);
      loadRules();
    } else {
      showToast(pubRes.error || 'Failed to publish rules revision.');
    }
    setIsSaving(false);
  };

  const handleRollback = async (targetVersion: number) => {
    if (!window.confirm(`Roll back Discussion Rules to Version ${targetVersion}?`)) return;
    setIsSaving(true);
    const res = await AdminService.rollbackDiscussionRules(currentUser, targetVersion);
    if (res.success && res.published) {
      showToast(`Successfully rolled back to Version ${targetVersion} as new Version ${res.published.version}.`);
      loadRules();
    } else {
      showToast(res.error || 'Failed to execute rollback');
    }
    setIsSaving(false);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-emerald-500/90 px-4 py-3 text-white text-xs font-semibold shadow-2xl backdrop-blur-md">
          <Check className="h-4 w-4" />
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-400/10 border border-blue-400/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Shield className="h-3 w-3" />
            Policy & Content Management
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <FileText className="h-6 w-6 text-blue-400" />
            Discussion Rules CMS
          </h1>
          <p className="text-sm text-white/60 mt-1">
            Manage, draft, publish, and rollback public community guidelines for <code className="text-amber-400">/discussions/rules</code>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/discussions/rules"
            target="_blank"
            className="px-3.5 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            View Live Public Rules
          </Link>
        </div>
      </div>

      {/* Main CMS Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Editor Column (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-white/[0.08] bg-[#0c0c14] p-5 shadow-xl">
            {/* Title & Mode Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Rules Title..."
                className="text-lg font-bold text-white bg-transparent border-b border-white/10 pb-1.5 focus:outline-none focus:border-amber-400/60 flex-1"
              />

              <div className="flex items-center gap-1 bg-white/[0.04] p-1 rounded-xl border border-white/10 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setViewMode('edit')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                    viewMode === 'edit'
                      ? 'bg-amber-400/20 text-amber-400 font-semibold'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  Markdown
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('preview')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                    viewMode === 'preview'
                      ? 'bg-amber-400/20 text-amber-400 font-semibold'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  <Eye className="h-3.5 w-3.5" />
                  Live Preview
                </button>
              </div>
            </div>

            {/* Editor Area */}
            {viewMode === 'edit' ? (
              <textarea
                rows={16}
                value={contentMarkdown}
                onChange={(e) => setContentMarkdown(e.target.value)}
                placeholder="Enter rules in Markdown..."
                className="w-full font-mono text-xs text-white bg-[#07070b] border border-white/[0.08] rounded-xl p-4 focus:outline-none focus:border-amber-400/50 resize-y"
              />
            ) : (
              <div className="min-h-[380px] p-5 rounded-xl border border-white/[0.08] bg-[#07070b] text-white text-xs prose prose-invert max-w-none whitespace-pre-wrap leading-relaxed">
                {contentMarkdown || (
                  <div className="text-white/30 italic">No content to preview.</div>
                )}
              </div>
            )}

            {/* Change Summary & Actions */}
            <div className="mt-4 pt-4 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3">
              <input
                type="text"
                placeholder="Change summary (e.g. Added section 3 on spoiler tags)..."
                value={changeSummary}
                onChange={(e) => setChangeSummary(e.target.value)}
                className="w-full sm:w-80 px-3 py-2 rounded-xl border border-white/10 bg-[#07070b] text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-amber-400"
              />

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  disabled={isSaving}
                  className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-50 text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Save className="h-3.5 w-3.5 text-white/60" />
                  Save Draft
                </button>

                <button
                  type="button"
                  onClick={() => handlePublish()}
                  disabled={isSaving}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-blue-500/20"
                >
                  <Send className="h-3.5 w-3.5" />
                  Publish Live
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Revisions & History Column (1 col) */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-white/[0.08] bg-[#0c0c14] p-5 shadow-xl">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <History className="h-4 w-4 text-blue-400" />
              Revision History & Rollback
            </h3>
            <p className="text-xs text-white/50 mb-4">
              All rules iterations are versioned. You can rollback to any prior release with one click.
            </p>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {revisions.map((rev) => {
                const isLive = rev.status === 'published';
                return (
                  <div
                    key={rev.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      isLive
                        ? 'border-emerald-500/40 bg-emerald-500/5'
                        : 'border-white/[0.06] bg-white/[0.02] hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-white">
                          v{rev.version}
                        </span>
                        <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider ${
                          isLive
                            ? 'bg-emerald-400/20 text-emerald-400 border border-emerald-400/30'
                            : 'bg-white/5 text-white/40 border border-white/10'
                        }`}>
                          {rev.status}
                        </span>
                      </div>

                      {!isLive && (
                        <button
                          type="button"
                          onClick={() => handleRollback(rev.version)}
                          className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-amber-400 hover:text-amber-300 text-[10px] font-semibold flex items-center gap-1 transition-colors"
                          title="Restore this version"
                        >
                          <RotateCcw className="h-3 w-3" />
                          Rollback
                        </button>
                      )}
                    </div>

                    <p className="text-[11px] text-white/70 truncate mb-1">
                      {rev.changeSummary || 'Published update'}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-white/40">
                      <span>@{rev.authorUsername}</span>
                      <span>{new Date(rev.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
