import React, { useEffect, useState } from 'react';
import {
  ShieldCheck,
  Search,
  Filter,
  Clock,
  User,
  FileCode,
  RefreshCw,
  Info
} from 'lucide-react';
import { UserProfile, AuditLogEntry } from '../../../types';
import { AdminService } from '../../../services/adminService';

interface AdminAuditLogsViewProps {
  currentUser: UserProfile;
}

export const AdminAuditLogsView: React.FC<AdminAuditLogsViewProps> = ({ currentUser }) => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [targetTypeFilter, setTargetTypeFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);

  const fetchLogs = async () => {
    setLoading(true);
    const res = await AdminService.getAuditLogs(currentUser, {
      targetType: targetTypeFilter,
      search: searchQuery,
      limit: 200
    });
    if (res.success && res.logs) {
      setLogs(res.logs);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();
  }, [searchQuery, targetTypeFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <ShieldCheck className="h-6 w-6 text-emerald-400" />
            Immutable Audit Trail
          </h1>
          <p className="text-sm text-white/60 mt-1">
            Tamper-evident, append-only chronological log of all administrative actions, role modifications, and policy changes.
          </p>
        </div>

        <button
          onClick={fetchLogs}
          className="self-start sm:self-auto px-3.5 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white text-xs font-medium flex items-center gap-2 transition-colors"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Logs
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <input
            type="text"
            placeholder="Search audit actions, operators, or target IDs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/[0.08] bg-[#0c0c14] text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-amber-400/50"
          />
        </div>

        <select
          value={targetTypeFilter}
          onChange={(e) => setTargetTypeFilter(e.target.value)}
          className="px-3 py-2.5 rounded-xl border border-white/[0.08] bg-[#0c0c14] text-white text-xs focus:outline-none focus:border-amber-400/50"
        >
          <option value="all">All Targets</option>
          <option value="user">Users</option>
          <option value="rule">Discussion Rules</option>
          <option value="report">Moderation Reports</option>
          <option value="problem">Problems</option>
          <option value="settings">Platform Settings</option>
          <option value="contest">Contests</option>
          <option value="spark">Spark AI</option>
        </select>
      </div>

      {/* Audit Log Table */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#0c0c14] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/[0.06] bg-white/[0.02] text-white/40 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Operator</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Target</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4 text-right">Inspection</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-white/40">
                    Loading audit stream...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-white/40">
                    No audit records matching query.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4 text-white/50 font-mono whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>

                    <td className="py-3 px-4 font-medium text-white whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span>@{log.actorUsername}</span>
                        <span className="text-[10px] text-white/40 uppercase">({log.actorRole})</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-white/[0.06] text-white/90 font-mono text-[11px] font-medium">
                        {log.action}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-white/60 capitalize whitespace-nowrap">
                      {log.targetType}
                    </td>

                    <td className="py-3 px-4 text-white/70 max-w-sm truncate">
                      {log.details}
                    </td>

                    <td className="py-3 px-4 text-right">
                      {log.metadata ? (
                        <button
                          onClick={() => setSelectedLog(log)}
                          className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-amber-400 text-[11px] font-medium"
                        >
                          Payload
                        </button>
                      ) : (
                        <span className="text-white/20">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Metadata Payload Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="max-w-lg w-full rounded-2xl border border-white/10 bg-[#0d0d14] p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Info className="h-4 w-4 text-amber-400" />
                Audit Record Payload: {selectedLog.action}
              </h3>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-white/40 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="mb-4 text-xs text-white/60 space-y-1">
              <div>Log ID: <span className="font-mono text-white/80">{selectedLog.id}</span></div>
              <div>Timestamp: <span className="font-mono text-white/80">{selectedLog.timestamp}</span></div>
              <div>Actor: <span className="text-white font-medium">@{selectedLog.actorUsername}</span></div>
            </div>

            <pre className="p-4 rounded-xl bg-[#050508] border border-white/[0.08] font-mono text-xs text-emerald-400 overflow-x-auto max-h-60">
              {JSON.stringify(selectedLog.metadata, null, 2)}
            </pre>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold"
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
