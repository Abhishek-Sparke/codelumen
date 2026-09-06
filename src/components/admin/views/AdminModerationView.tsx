import React, { useEffect, useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Eye,
  MessageSquare,
  User,
  Clock,
  Check,
  X,
  Filter,
  RefreshCw,
  FileText
} from 'lucide-react';
import { UserProfile, PlatformReport, ReportActionTaken } from '../../../types';
import { AdminService } from '../../../services/adminService';

interface AdminModerationViewProps {
  currentUser: UserProfile;
}

export const AdminModerationView: React.FC<AdminModerationViewProps> = ({ currentUser }) => {
  const [reports, setReports] = useState<PlatformReport[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  // Selected report for review modal
  const [activeReport, setActiveReport] = useState<PlatformReport | null>(null);
  const [actionTaken, setActionTaken] = useState<ReportActionTaken>('warning_sent');
  const [modNotes, setModNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const fetchReports = async () => {
    setLoading(true);
    const res = await AdminService.getReports(currentUser, {
      status: statusFilter,
      priority: priorityFilter
    });
    if (res.success && res.reports) {
      setReports(res.reports);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReports();
  }, [statusFilter, priorityFilter]);

  const handleOpenReview = (report: PlatformReport) => {
    setActiveReport(report);
    setActionTaken('warning_sent');
    setModNotes('');
  };

  const handleResolve = async () => {
    if (!activeReport) return;
    setIsSubmitting(true);

    const res = await AdminService.resolveReport(currentUser, activeReport.id, actionTaken, modNotes);
    if (!res.success) {
      showToast(res.error || 'Failed to resolve report');
      setIsSubmitting(false);
      return;
    }

    showToast(`Report ${activeReport.id} resolved with action '${actionTaken}'.`);
    setActiveReport(null);
    setIsSubmitting(false);
    fetchReports();
  };

  const handleDismiss = async (reportId: string) => {
    const res = await AdminService.resolveReport(currentUser, reportId, 'none', 'Report dismissed by moderator as non-violating.');
    if (res.success) {
      showToast('Report dismissed.');
      fetchReports();
    }
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
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <ShieldAlert className="h-6 w-6 text-red-400" />
            Moderation & Safety Queue
          </h1>
          <p className="text-sm text-white/60 mt-1">
            Review user-reported violations, enforce community conduct standards, and log moderation outcomes.
          </p>
        </div>

        <button
          onClick={fetchReports}
          className="self-start sm:self-auto px-3.5 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white text-xs font-medium flex items-center gap-2 transition-colors"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Queue
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-white/[0.08] bg-[#0c0c14] text-white text-xs focus:outline-none focus:border-amber-400/50"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="resolved">Resolved</option>
          <option value="dismissed">Dismissed</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-white/[0.08] bg-[#0c0c14] text-white text-xs focus:outline-none focus:border-amber-400/50"
        >
          <option value="all">All Priorities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <div className="ml-auto text-xs text-white/40">
          Showing {reports.length} reports
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="rounded-2xl border border-white/[0.08] bg-[#0c0c14] p-12 text-center text-white/40 text-xs">
            Loading reports queue...
          </div>
        ) : reports.length === 0 ? (
          <div className="rounded-2xl border border-white/[0.08] bg-[#0c0c14] p-12 text-center text-white/40 text-xs">
            <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-400 mb-2 opacity-80" />
            No active reports in queue. The platform is clean.
          </div>
        ) : (
          reports.map((report) => (
            <div
              key={report.id}
              className="rounded-2xl border border-white/[0.08] bg-[#0c0c14] p-5 shadow-lg hover:border-white/20 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    report.priority === 'critical'
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : report.priority === 'high'
                      ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    {report.priority} Priority
                  </span>

                  <span className="px-2 py-0.5 rounded bg-white/[0.06] text-white/70 text-[10px] uppercase tracking-wider font-semibold">
                    {report.targetType}
                  </span>

                  <span className="text-xs text-white/40">
                    Report #{report.id}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                    report.status === 'pending'
                      ? 'bg-amber-400/10 text-amber-400'
                      : 'bg-emerald-400/10 text-emerald-400'
                  }`}>
                    {report.status}
                  </span>
                  <span className="text-[11px] text-white/40 flex items-center gap-1 font-mono">
                    <Clock className="h-3 w-3" />
                    {new Date(report.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Target info & details */}
              <div className="space-y-2 mb-4">
                <div className="text-sm font-semibold text-white">
                  Target: {report.targetTitle || report.targetId}
                </div>

                {report.targetSnippet && (
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-white/70 font-mono italic">
                    "{report.targetSnippet}"
                  </div>
                )}

                <div className="flex items-center gap-4 text-xs text-white/50">
                  <span>Reported by: <strong className="text-white/80 font-medium">@{report.reportedByUsername}</strong></span>
                  <span>Reason: <strong className="text-amber-400/90 font-medium capitalize">{report.reason.replace('_', ' ')}</strong></span>
                </div>

                <p className="text-xs text-white/70">
                  {report.details}
                </p>

                {report.status === 'resolved' && (
                  <div className="mt-2 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400">
                    Resolved by @{report.resolvedBy}: action taken <strong className="uppercase font-mono">{report.actionTaken}</strong>.
                    {report.modNotes && ` Notes: ${report.modNotes}`}
                  </div>
                )}
              </div>

              {/* Actions */}
              {report.status === 'pending' && (
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/5">
                  <button
                    onClick={() => handleDismiss(report.id)}
                    className="px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-xs font-medium transition-colors"
                  >
                    Dismiss Report
                  </button>
                  <button
                    onClick={() => handleOpenReview(report)}
                    className="px-3 py-1.5 rounded-xl bg-red-500/90 hover:bg-red-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-md"
                  >
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Review & Enforce
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Review & Resolution Modal */}
      {activeReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="max-w-md w-full rounded-2xl border border-white/10 bg-[#0d0d14] p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-red-400" />
                Enforce Moderation on #{activeReport.id}
              </h3>
              <button
                onClick={() => setActiveReport(null)}
                className="p-1 rounded-lg text-white/40 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-medium text-white/70 mb-1.5">
                  Action to Execute
                </label>
                <select
                  value={actionTaken}
                  onChange={(e) => setActionTaken(e.target.value as ReportActionTaken)}
                  className="w-full px-3 py-2 rounded-xl border border-white/10 bg-[#14141f] text-white text-xs focus:outline-none focus:border-amber-400"
                >
                  <option value="warning_sent">Send Official Warning to User</option>
                  <option value="content_hidden">Hide Reported Content</option>
                  <option value="content_deleted">Permanently Delete Content</option>
                  <option value="user_suspended">Suspend User Account</option>
                  <option value="user_banned">Permanently Ban User Account</option>
                  <option value="none">Take No Action (Dismiss)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-white/70 mb-1.5">
                  Moderator Notes (Audit Trail)
                </label>
                <textarea
                  rows={3}
                  value={modNotes}
                  onChange={(e) => setModNotes(e.target.value)}
                  placeholder="Record policy justification or communication notes..."
                  className="w-full px-3 py-2 rounded-xl border border-white/10 bg-[#14141f] text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setActiveReport(null)}
                className="px-4 py-2 rounded-xl text-xs text-white/60 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleResolve}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md"
              >
                {isSubmitting ? 'Executing...' : 'Confirm Moderation Action'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
