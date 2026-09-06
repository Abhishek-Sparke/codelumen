import React, { useEffect, useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Shield,
  ShieldAlert,
  ShieldCheck,
  UserX,
  AlertTriangle,
  Check,
  X,
  Edit2,
  RefreshCw,
  Lock
} from 'lucide-react';
import { UserProfile, AdminRole, UserAccountStatus } from '../../../types';
import { AdminService } from '../../../services/adminService';

interface AdminUsersViewProps {
  currentUser: UserProfile;
}

export const AdminUsersView: React.FC<AdminUsersViewProps> = ({ currentUser }) => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  // Selected user for role change modal
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [newRole, setNewRole] = useState<AdminRole>('user');
  const [roleModalError, setRoleModalError] = useState('');
  const [isSubmittingRole, setIsSubmittingRole] = useState(false);

  // Selected user for status change modal
  const [statusUser, setStatusUser] = useState<UserProfile | null>(null);
  const [targetStatus, setTargetStatus] = useState<UserAccountStatus>('active');
  const [statusReason, setStatusReason] = useState('');
  const [statusModalError, setStatusModalError] = useState('');
  const [isSubmittingStatus, setIsSubmittingStatus] = useState(false);

  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const fetchUsers = async () => {
    setLoading(true);
    const res = await AdminService.getUsers(currentUser, {
      search: searchQuery,
      role: roleFilter,
      status: statusFilter
    });
    if (res.success && res.users) {
      setUsers(res.users);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, [searchQuery, roleFilter, statusFilter]);

  const handleOpenRoleModal = (user: UserProfile) => {
    setEditingUser(user);
    setNewRole(user.role || 'user');
    setRoleModalError('');
  };

  const handleSaveRole = async () => {
    if (!editingUser) return;
    setIsSubmittingRole(true);
    setRoleModalError('');

    const res = await AdminService.updateUserRole(currentUser, editingUser.id, newRole);
    if (!res.success) {
      setRoleModalError(res.error || 'Failed to update user role');
      setIsSubmittingRole(false);
      return;
    }

    showToast(`Successfully updated @${editingUser.username}'s role to ${newRole}.`);
    setEditingUser(null);
    setIsSubmittingRole(false);
    fetchUsers();
  };

  const handleOpenStatusModal = (user: UserProfile) => {
    setStatusUser(user);
    setTargetStatus(((user as any).status as UserAccountStatus) || 'active');
    setStatusReason('');
    setStatusModalError('');
  };

  const handleSaveStatus = async () => {
    if (!statusUser) return;
    setIsSubmittingStatus(true);
    setStatusModalError('');

    const res = await AdminService.updateUserStatus(currentUser, statusUser.id, targetStatus, statusReason);
    if (!res.success) {
      setStatusModalError(res.error || 'Failed to update user account status');
      setIsSubmittingStatus(false);
      return;
    }

    showToast(`Account status for @${statusUser.username} set to ${targetStatus}.`);
    setStatusUser(null);
    setIsSubmittingStatus(false);
    fetchUsers();
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
            <Users className="h-6 w-6 text-amber-400" />
            User & Role Management
          </h1>
          <p className="text-sm text-white/60 mt-1">
            Platform accounts directory, role assignments, and account status enforcement.
          </p>
        </div>

        <button
          onClick={fetchUsers}
          className="self-start sm:self-auto px-3.5 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white text-xs font-medium flex items-center gap-2 transition-colors"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Directory
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <input
            type="text"
            placeholder="Search by username, full name, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/[0.08] bg-[#0c0c14] text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-amber-400/50"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-white/[0.08] bg-[#0c0c14] text-white text-xs focus:outline-none focus:border-amber-400/50"
          >
            <option value="all">All Roles</option>
            <option value="user">User</option>
            <option value="moderator">Moderator</option>
            <option value="admin">Administrator</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-white/[0.08] bg-[#0c0c14] text-white text-xs focus:outline-none focus:border-amber-400/50"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="warned">Warned</option>
            <option value="suspended">Suspended</option>
            <option value="banned">Banned</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#0c0c14] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/[0.06] bg-white/[0.02] text-white/40 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Experience</th>
                <th className="py-3 px-4">Solves</th>
                <th className="py-3 px-4">XP</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-white/40">
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-white/40">
                    No users matching criteria.
                  </td>
                </tr>
              ) : (
                users.map(u => {
                  const status = ((u as any).status as UserAccountStatus) || 'active';
                  return (
                    <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={u.avatar}
                            alt={u.username}
                            className="h-8 w-8 rounded-full object-cover border border-white/10"
                          />
                          <div>
                            <div className="font-semibold text-white">{u.name}</div>
                            <div className="text-white/40">@{u.username}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                          u.role === 'admin'
                            ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                            : u.role === 'moderator'
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            : 'bg-white/5 text-white/60 border border-white/10'
                        }`}>
                          {u.role === 'admin' && <ShieldAlert className="h-3 w-3" />}
                          {u.role === 'moderator' && <ShieldCheck className="h-3 w-3" />}
                          {u.role || 'user'}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                          status === 'active'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : status === 'warned'
                            ? 'bg-amber-500/10 text-amber-400'
                            : 'bg-red-500/10 text-red-400'
                        }`}>
                          {status}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-white/70">
                        {u.experienceLevel || 'Intermediate'}
                      </td>

                      <td className="py-3 px-4 font-mono text-white/80">
                        {u.solvedProblemIds?.length || 0}
                      </td>

                      <td className="py-3 px-4 font-mono text-amber-400">
                        {u.xp?.toLocaleString() || 0}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenRoleModal(u)}
                            className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-[11px] font-medium border border-white/10 transition-colors flex items-center gap-1"
                          >
                            <Shield className="h-3 w-3 text-amber-400" />
                            Role
                          </button>
                          <button
                            onClick={() => handleOpenStatusModal(u)}
                            className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-[11px] font-medium border border-white/10 transition-colors flex items-center gap-1"
                          >
                            <AlertTriangle className="h-3 w-3 text-red-400" />
                            Status
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Assignment Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="max-w-md w-full rounded-2xl border border-white/10 bg-[#0d0d14] p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Shield className="h-5 w-5 text-amber-400" />
                Assign Role for @{editingUser.username}
              </h3>
              <button
                onClick={() => setEditingUser(null)}
                className="p-1 rounded-lg text-white/40 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-white/60 mb-4">
              Changing permissions affects access to platform controls, moderation queues, and user administration.
            </p>

            {roleModalError && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{roleModalError}</span>
              </div>
            )}

            <div className="space-y-2 mb-6">
              {(['user', 'moderator', 'admin'] as AdminRole[]).map((role) => (
                <label
                  key={role}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                    newRole === role
                      ? 'border-amber-400 bg-amber-400/10 text-white'
                      : 'border-white/10 bg-white/[0.02] text-white/60 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="admin_role_select"
                      checked={newRole === role}
                      onChange={() => setNewRole(role)}
                      className="accent-amber-400"
                    />
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-white">
                        {role}
                      </div>
                      <div className="text-[11px] text-white/40">
                        {role === 'admin' && 'Full administrative authority and platform controls.'}
                        {role === 'moderator' && 'Access to moderation queues, reports, and forum rules.'}
                        {role === 'user' && 'Standard platform member without administrative privileges.'}
                      </div>
                    </div>
                  </div>
                </label>
              ))}
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 rounded-xl text-xs text-white/60 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveRole}
                disabled={isSubmittingRole}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-black text-xs font-semibold flex items-center gap-1.5 shadow-md"
              >
                {isSubmittingRole ? 'Updating...' : 'Confirm Role Assignment'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Account Status Modal */}
      {statusUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="max-w-md w-full rounded-2xl border border-white/10 bg-[#0d0d14] p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-400" />
                Account Status for @{statusUser.username}
              </h3>
              <button
                onClick={() => setStatusUser(null)}
                className="p-1 rounded-lg text-white/40 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {statusModalError && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{statusModalError}</span>
              </div>
            )}

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-medium text-white/70 mb-1.5">
                  Select Status
                </label>
                <select
                  value={targetStatus}
                  onChange={(e) => setTargetStatus(e.target.value as UserAccountStatus)}
                  className="w-full px-3 py-2 rounded-xl border border-white/10 bg-[#14141f] text-white text-xs focus:outline-none focus:border-amber-400"
                >
                  <option value="active">Active (Full access restored)</option>
                  <option value="warned">Warned (Community warning recorded)</option>
                  <option value="suspended">Suspended (Posting & submitting blocked)</option>
                  <option value="banned">Banned (Permanent access block)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-white/70 mb-1.5">
                  Reason for Audit Record
                </label>
                <textarea
                  rows={3}
                  value={statusReason}
                  onChange={(e) => setStatusReason(e.target.value)}
                  placeholder="Explain reason for status change (logged into immutable audit trail)..."
                  className="w-full px-3 py-2 rounded-xl border border-white/10 bg-[#14141f] text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setStatusUser(null)}
                className="px-4 py-2 rounded-xl text-xs text-white/60 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveStatus}
                disabled={isSubmittingStatus}
                className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md"
              >
                {isSubmittingStatus ? 'Updating...' : 'Apply Status Change'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
