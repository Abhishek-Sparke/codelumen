import React, { useEffect, useState } from 'react';
import {
  Users,
  Code,
  CheckCircle2,
  AlertTriangle,
  Trophy,
  MessageSquare,
  Sparkles,
  Shield,
  Activity,
  ArrowUpRight,
  Clock,
  ExternalLink
} from 'lucide-react';
import { UserProfile, AdminDashboardMetrics, AuditLogEntry } from '../../../types';
import { AdminService } from '../../../services/adminService';
import { Link } from '../../../router/Link';

interface AdminDashboardViewProps {
  currentUser: UserProfile;
  onNavigate: (section: string) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  currentUser,
  onNavigate
}) => {
  const [metrics, setMetrics] = useState<AdminDashboardMetrics | null>(null);
  const [recentLogs, setRecentLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const metricsRes = await AdminService.getMetrics(currentUser);
      if (metricsRes.success && metricsRes.metrics) {
        setMetrics(metricsRes.metrics);
      }

      if (AdminService.hasPermission(currentUser.role, 'audit.view')) {
        const logsRes = await AdminService.getAuditLogs(currentUser, { limit: 6 });
        if (logsRes.success && logsRes.logs) {
          setRecentLogs(logsRes.logs);
        }
      }
      setLoading(false);
    }
    loadData();
  }, [currentUser]);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-r from-amber-500/10 via-purple-500/5 to-transparent p-6 sm:p-8 backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <Shield className="h-3.5 w-3.5" />
              Platform Command Center
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Platform Overview
            </h1>
            <p className="text-sm text-white/60 mt-1 max-w-xl">
              Real-time platform telemetry, user metrics, moderation queue, and system operational state.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs text-white/40">Authenticated Operator</div>
              <div className="text-sm font-semibold text-white">@{currentUser.username}</div>
            </div>
            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${
              currentUser.role === 'admin'
                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
            }`}>
              {currentUser.role}
            </span>
          </div>
        </div>
      </div>

      {/* Moderation Alert Banner */}
      {metrics && metrics.pendingReports > 0 && (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 sm:p-5 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">
                {metrics.pendingReports} Pending Moderation {metrics.pendingReports === 1 ? 'Report' : 'Reports'}
              </h3>
              <p className="text-xs text-white/60">
                Community members flagged content requiring review and policy enforcement.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('moderation')}
            className="shrink-0 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-black font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-md"
          >
            Review Queue
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-white/[0.08] bg-[#0c0c14] p-5 shadow-lg">
          <div className="flex items-center justify-between text-white/50 mb-3">
            <span className="text-xs font-medium uppercase tracking-wider">Total Users</span>
            <Users className="h-4 w-4 text-blue-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white">
            {loading ? '...' : (metrics?.totalUsers.toLocaleString() || '0')}
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-emerald-400">
            <span>● Active Today: {metrics?.activeUsersToday || 1}</span>
          </div>
        </div>

        <div className="rounded-xl border border-white/[0.08] bg-[#0c0c14] p-5 shadow-lg">
          <div className="flex items-center justify-between text-white/50 mb-3">
            <span className="text-xs font-medium uppercase tracking-wider">Problem Catalogue</span>
            <Code className="h-4 w-4 text-purple-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white">
            {loading ? '...' : (metrics?.publishedProblems.toLocaleString() || '0')}
          </div>
          <div className="mt-1 text-xs text-white/40">
            {metrics?.totalProblems || 0} total in database
          </div>
        </div>

        <div className="rounded-xl border border-white/[0.08] bg-[#0c0c14] p-5 shadow-lg">
          <div className="flex items-center justify-between text-white/50 mb-3">
            <span className="text-xs font-medium uppercase tracking-wider">Total Solves</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white">
            {loading ? '...' : (metrics?.totalSolves.toLocaleString() || '0')}
          </div>
          <div className="mt-1 text-xs text-white/40">
            from {metrics?.totalSubmissions || 0} submissions
          </div>
        </div>

        <div className="rounded-xl border border-white/[0.08] bg-[#0c0c14] p-5 shadow-lg">
          <div className="flex items-center justify-between text-white/50 mb-3">
            <span className="text-xs font-medium uppercase tracking-wider">Spark AI Usage</span>
            <Sparkles className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white">
            {loading ? '...' : (metrics?.sparkRequestsToday.toLocaleString() || '0')}
          </div>
          <div className="mt-1 text-xs text-amber-400/80">
            Mentoring queries today
          </div>
        </div>
      </div>

      {/* Quick Access Matrix */}
      <div>
        <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
          <Activity className="h-4 w-4 text-amber-400" />
          Administrative Portals
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => onNavigate('moderation')}
            className="p-4 rounded-xl border border-white/[0.08] bg-[#0c0c14] hover:border-amber-400/30 hover:bg-white/[0.02] text-left transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-lg bg-red-500/10 text-red-400">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <ArrowUpRight className="h-4 w-4 text-white/30 group-hover:text-amber-400 transition-colors" />
            </div>
            <h3 className="font-semibold text-white text-sm">Moderation Queue</h3>
            <p className="text-xs text-white/50 mt-1">Review flagged threads, reports, and conduct enforcement.</p>
          </button>

          <button
            onClick={() => onNavigate('rules')}
            className="p-4 rounded-xl border border-white/[0.08] bg-[#0c0c14] hover:border-amber-400/30 hover:bg-white/[0.02] text-left transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                <MessageSquare className="h-5 w-5" />
              </div>
              <ArrowUpRight className="h-4 w-4 text-white/30 group-hover:text-amber-400 transition-colors" />
            </div>
            <h3 className="font-semibold text-white text-sm">Discussion Rules CMS</h3>
            <p className="text-xs text-white/50 mt-1">Draft, preview, publish, and rollback forum rules.</p>
          </button>

          {currentUser.role === 'admin' && (
            <>
              <button
                onClick={() => onNavigate('users')}
                className="p-4 rounded-xl border border-white/[0.08] bg-[#0c0c14] hover:border-amber-400/30 hover:bg-white/[0.02] text-left transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                    <Users className="h-5 w-5" />
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-white/30 group-hover:text-amber-400 transition-colors" />
                </div>
                <h3 className="font-semibold text-white text-sm">Users & Role Control</h3>
                <p className="text-xs text-white/50 mt-1">Manage accounts, assign roles, and handle suspensions.</p>
              </button>

              <button
                onClick={() => onNavigate('problems')}
                className="p-4 rounded-xl border border-white/[0.08] bg-[#0c0c14] hover:border-amber-400/30 hover:bg-white/[0.02] text-left transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <Code className="h-5 w-5" />
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-white/30 group-hover:text-amber-400 transition-colors" />
                </div>
                <h3 className="font-semibold text-white text-sm">Problem Lifecycle</h3>
                <p className="text-xs text-white/50 mt-1">Manage draft, review, published states & hidden test cases.</p>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Recent Audit Stream (if permitted) */}
      {AdminService.hasPermission(currentUser.role, 'audit.view') && (
        <div className="rounded-2xl border border-white/[0.08] bg-[#0c0c14] p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-white/40" />
              <h3 className="text-sm font-semibold text-white">Recent Immutable Audit Activity</h3>
            </div>
            <button
              onClick={() => onNavigate('audit-logs')}
              className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 transition-colors"
            >
              View Full Audit Trail
              <ExternalLink className="h-3 w-3" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/[0.06] text-white/40 uppercase tracking-wider">
                <tr>
                  <th className="pb-2">Timestamp</th>
                  <th className="pb-2">Actor</th>
                  <th className="pb-2">Action</th>
                  <th className="pb-2">Target</th>
                  <th className="pb-2">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {recentLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-4 text-center text-white/40">
                      No audit events recorded yet.
                    </td>
                  </tr>
                ) : (
                  recentLogs.map(log => (
                    <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-2.5 text-white/50 whitespace-nowrap font-mono">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </td>
                      <td className="py-2.5 font-medium text-white whitespace-nowrap">
                        @{log.actorUsername}
                      </td>
                      <td className="py-2.5 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded bg-white/[0.06] text-white/80 font-mono text-[11px]">
                          {log.action}
                        </span>
                      </td>
                      <td className="py-2.5 text-white/60 capitalize whitespace-nowrap">
                        {log.targetType}
                      </td>
                      <td className="py-2.5 text-white/70 max-w-xs truncate">
                        {log.details}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
