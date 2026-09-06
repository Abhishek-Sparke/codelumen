import {
  UserProfile,
  AdminRole,
  AdminPermission,
  ROLE_PERMISSIONS,
  AuditLogEntry,
  PlatformReport,
  DiscussionRulesRevision,
  PlatformSettings,
  AdminDashboardMetrics,
  UserAccountStatus,
  ProblemLifecycleState,
  Problem
} from '../types';
import { StorageService } from './storage';
import { ALL_PROBLEMS } from '../data/problems';

export class AdminService {
  /**
   * Evaluates if a given role has the requested permission.
   */
  public static hasPermission(role?: AdminRole | string, permission?: AdminPermission): boolean {
    if (!role || !permission) return false;
    const adminRole = role as AdminRole;
    const permissions = ROLE_PERMISSIONS[adminRole] || [];
    return permissions.includes(permission);
  }

  public static isAdmin(role?: string): boolean {
    return role === 'admin';
  }

  public static isModerator(role?: string): boolean {
    return role === 'moderator';
  }

  public static canAccessAdmin(role?: string): boolean {
    return role === 'admin' || role === 'moderator';
  }

  /**
   * Helper to execute API fetch with headers, falling back to local storage seamlessly.
   */
  private static async request<T>(
    endpoint: string,
    options: RequestInit,
    actor: UserProfile,
    fallbackFn: () => T | Promise<T>
  ): Promise<{ success: boolean; data?: T; error?: string }> {
    try {
      const res = await fetch(endpoint, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': actor.id,
          'x-user-role': actor.role || 'user',
          'x-user-username': actor.username,
          ...(options.headers || {})
        }
      });

      if (res.ok) {
        const json = await res.json();
        return { success: true, data: json };
      } else if (res.status === 403 || res.status === 401) {
        const json = await res.json().catch(() => ({}));
        return { success: false, error: json.error || 'Unauthorized: Insufficient privileges.' };
      } else if (res.status === 400 || res.status === 404) {
        const json = await res.json().catch(() => ({}));
        return { success: false, error: json.error || 'Operation failed.' };
      }
      // If endpoint returns 500 or 404 (e.g. serverless without node handler), use fallback
      const fallbackResult = await fallbackFn();
      return { success: true, data: fallbackResult };
    } catch {
      // Network error or local offline fallback
      try {
        const fallbackResult = await fallbackFn();
        return { success: true, data: fallbackResult };
      } catch (err: any) {
        return { success: false, error: err?.message || 'Action failed' };
      }
    }
  }

  /**
   * Fetch Dashboard Metrics
   */
  public static async getMetrics(actor: UserProfile): Promise<{ success: boolean; metrics?: AdminDashboardMetrics; error?: string }> {
    if (!this.hasPermission(actor.role, 'admin.access')) {
      return { success: false, error: 'Forbidden: Admin access required.' };
    }

    const res = await this.request<any>(
      '/api/admin/metrics',
      { method: 'GET' },
      actor,
      () => {
        const users = StorageService.getAllUsers();
        const reports = StorageService.getReports();
        const pendingReports = reports.filter(r => r.status === 'pending').length;
        const lifecycles = StorageService.getProblemLifecycles();
        const publishedProblems = ALL_PROBLEMS.filter(p => lifecycles[p.id] !== 'draft').length;

        return {
          metrics: {
            totalUsers: users.length,
            activeUsersToday: Math.max(users.length, 1),
            totalProblems: ALL_PROBLEMS.length,
            publishedProblems,
            totalSubmissions: 1420,
            totalSolves: 890,
            pendingReports,
            activeContests: 1,
            discussionsCount: StorageService.getDiscussions().length,
            sparkRequestsToday: 142
          }
        };
      }
    );

    return {
      success: res.success,
      metrics: res.data?.metrics || res.data,
      error: res.error
    };
  }

  /**
   * Get Users list with search and filters
   */
  public static async getUsers(
    actor: UserProfile,
    query?: { search?: string; role?: string; status?: string }
  ): Promise<{ success: boolean; users?: UserProfile[]; error?: string }> {
    if (!this.hasPermission(actor.role, 'users.view')) {
      return { success: false, error: 'Forbidden: View users permission required.' };
    }

    const params = new URLSearchParams();
    if (query?.search) params.set('search', query.search);
    if (query?.role) params.set('roleFilter', query.role);
    if (query?.status) params.set('statusFilter', query.status);

    const res = await this.request<any>(
      `/api/admin/users?${params.toString()}`,
      { method: 'GET' },
      actor,
      () => {
        let list = StorageService.getAllUsers();
        if (query?.search) {
          const s = query.search.toLowerCase();
          list = list.filter(u => u.name.toLowerCase().includes(s) || u.username.toLowerCase().includes(s) || u.email.toLowerCase().includes(s));
        }
        if (query?.role && query.role !== 'all') {
          list = list.filter(u => u.role === query.role);
        }
        return { users: list };
      }
    );

    return {
      success: res.success,
      users: res.data?.users || res.data,
      error: res.error
    };
  }

  /**
   * Update User Role (with Last Admin lockout protection)
   */
  public static async updateUserRole(
    actor: UserProfile,
    targetUserId: string,
    newRole: AdminRole
  ): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
    if (!this.hasPermission(actor.role, 'roles.assign')) {
      return { success: false, error: 'Forbidden: Only administrators can assign roles.' };
    }

    const res = await this.request<any>(
      '/api/admin/users/role',
      {
        method: 'POST',
        body: JSON.stringify({
          actorRole: actor.role,
          actorId: actor.id,
          actorUsername: actor.username,
          targetUserId,
          newRole
        })
      },
      actor,
      () => {
        const updateRes = StorageService.updateUserRole(targetUserId, newRole, actor.id);
        if (!updateRes.success) {
          throw new Error(updateRes.error || 'Failed to update role');
        }
        const user = StorageService.getUserById(targetUserId);
        return { user };
      }
    );

    return {
      success: res.success,
      user: res.data?.user,
      error: res.error
    };
  }

  /**
   * Update User Status (Warn, Suspend, Ban with Last Admin lockout protection)
   */
  public static async updateUserStatus(
    actor: UserProfile,
    targetUserId: string,
    newStatus: UserAccountStatus,
    reason?: string
  ): Promise<{ success: boolean; error?: string }> {
    if (!this.hasPermission(actor.role, 'users.warn_suspend')) {
      return { success: false, error: 'Forbidden: Insufficient moderation privileges.' };
    }

    const res = await this.request<any>(
      '/api/admin/users/status',
      {
        method: 'POST',
        body: JSON.stringify({
          actorRole: actor.role,
          actorId: actor.id,
          actorUsername: actor.username,
          targetUserId,
          newStatus,
          reason
        })
      },
      actor,
      () => {
        const updateRes = StorageService.updateUserStatus(targetUserId, newStatus, actor.id);
        if (!updateRes.success) {
          throw new Error(updateRes.error || 'Failed to update user status');
        }
        return { success: true };
      }
    );

    return {
      success: res.success,
      error: res.error
    };
  }

  /**
   * Get Moderation Reports Queue
   */
  public static async getReports(
    actor: UserProfile,
    query?: { status?: string; priority?: string }
  ): Promise<{ success: boolean; reports?: PlatformReport[]; error?: string }> {
    if (!this.hasPermission(actor.role, 'moderation.view')) {
      return { success: false, error: 'Forbidden: Moderation view permission required.' };
    }

    const params = new URLSearchParams();
    if (query?.status) params.set('status', query.status);
    if (query?.priority) params.set('priority', query.priority);

    const res = await this.request<any>(
      `/api/admin/reports?${params.toString()}`,
      { method: 'GET' },
      actor,
      () => {
        let list = StorageService.getReports();
        if (query?.status && query.status !== 'all') {
          list = list.filter(r => r.status === query.status);
        }
        if (query?.priority && query.priority !== 'all') {
          list = list.filter(r => r.priority === query.priority);
        }
        return { reports: list };
      }
    );

    return {
      success: res.success,
      reports: res.data?.reports || res.data,
      error: res.error
    };
  }

  /**
   * Resolve Moderation Report
   */
  public static async resolveReport(
    actor: UserProfile,
    reportId: string,
    actionTaken: any,
    modNotes?: string
  ): Promise<{ success: boolean; error?: string }> {
    if (!this.hasPermission(actor.role, 'moderation.resolve')) {
      return { success: false, error: 'Forbidden: Moderation resolve permission required.' };
    }

    const res = await this.request<any>(
      '/api/admin/reports/resolve',
      {
        method: 'POST',
        body: JSON.stringify({
          actorRole: actor.role,
          actorId: actor.id,
          actorUsername: actor.username,
          reportId,
          actionTaken,
          modNotes
        })
      },
      actor,
      () => {
        const ok = StorageService.resolveReport(reportId, actionTaken, modNotes, actor.username);
        if (!ok) throw new Error('Report not found');
        return { success: true };
      }
    );

    return {
      success: res.success,
      error: res.error
    };
  }

  /**
   * Get Discussion Rules & Revisions
   */
  public static async getDiscussionRules(
    actor: UserProfile
  ): Promise<{ success: boolean; currentPublished?: DiscussionRulesRevision; revisions?: DiscussionRulesRevision[]; error?: string }> {
    if (!this.hasPermission(actor.role, 'discussions.manage_rules')) {
      return { success: false, error: 'Forbidden: Discussion rules permission required.' };
    }

    const res = await this.request<any>(
      '/api/admin/rules',
      { method: 'GET' },
      actor,
      () => {
        const revs = StorageService.getDiscussionRulesRevisions();
        const currentPublished = revs.find(r => r.status === 'published') || revs[0];
        return { currentPublished, revisions: revs };
      }
    );

    return {
      success: res.success,
      currentPublished: res.data?.currentPublished,
      revisions: res.data?.revisions,
      error: res.error
    };
  }

  /**
   * Save Discussion Rules Draft
   */
  public static async saveDiscussionRulesDraft(
    actor: UserProfile,
    title: string,
    contentMarkdown: string,
    changeSummary?: string
  ): Promise<{ success: boolean; draft?: DiscussionRulesRevision; error?: string }> {
    if (!this.hasPermission(actor.role, 'discussions.manage_rules')) {
      return { success: false, error: 'Forbidden: Discussion rules permission required.' };
    }

    const res = await this.request<any>(
      '/api/admin/rules/draft',
      {
        method: 'POST',
        body: JSON.stringify({
          actorRole: actor.role,
          actorId: actor.id,
          actorUsername: actor.username,
          title,
          contentMarkdown,
          changeSummary
        })
      },
      actor,
      () => {
        const revs = StorageService.getDiscussionRulesRevisions();
        const nextVer = Math.max(...revs.map(r => r.version), 0) + 1;
        const newDraft: DiscussionRulesRevision = {
          id: `rev-${Date.now()}`,
          version: nextVer,
          title: title.trim(),
          contentMarkdown,
          status: 'draft',
          authorId: actor.id,
          authorUsername: actor.username,
          createdAt: new Date().toISOString(),
          changeSummary: changeSummary || `Draft for v${nextVer}`
        };
        revs.unshift(newDraft);
        StorageService.saveDiscussionRulesRevisions(revs);
        return { draft: newDraft };
      }
    );

    return {
      success: res.success,
      draft: res.data?.draft,
      error: res.error
    };
  }

  /**
   * Publish Discussion Rules Revision
   */
  public static async publishDiscussionRules(
    actor: UserProfile,
    revisionId: string
  ): Promise<{ success: boolean; published?: DiscussionRulesRevision; error?: string }> {
    if (!this.hasPermission(actor.role, 'discussions.manage_rules')) {
      return { success: false, error: 'Forbidden: Discussion rules permission required.' };
    }

    const res = await this.request<any>(
      '/api/admin/rules/publish',
      {
        method: 'POST',
        body: JSON.stringify({
          actorRole: actor.role,
          actorId: actor.id,
          actorUsername: actor.username,
          revisionId
        })
      },
      actor,
      () => {
        const published = StorageService.publishRulesRevision(revisionId, actor.username);
        if (!published) throw new Error('Revision not found');
        return { published };
      }
    );

    return {
      success: res.success,
      published: res.data?.published,
      error: res.error
    };
  }

  /**
   * Rollback Discussion Rules to an earlier version
   */
  public static async rollbackDiscussionRules(
    actor: UserProfile,
    targetVersion: number
  ): Promise<{ success: boolean; published?: DiscussionRulesRevision; error?: string }> {
    if (!this.hasPermission(actor.role, 'discussions.manage_rules')) {
      return { success: false, error: 'Forbidden: Discussion rules permission required.' };
    }

    const res = await this.request<any>(
      '/api/admin/rules/rollback',
      {
        method: 'POST',
        body: JSON.stringify({
          actorRole: actor.role,
          actorId: actor.id,
          actorUsername: actor.username,
          targetVersion
        })
      },
      actor,
      () => {
        const rolled = StorageService.rollbackRulesRevision(targetVersion, actor.username);
        if (!rolled) throw new Error(`Revision v${targetVersion} not found`);
        return { published: rolled };
      }
    );

    return {
      success: res.success,
      published: res.data?.published,
      error: res.error
    };
  }

  /**
   * Get Problems with lifecycle states
   */
  public static async getProblems(
    actor: UserProfile,
    query?: { search?: string; lifecycle?: string }
  ): Promise<{ success: boolean; problems?: (Problem & { lifecycleState: ProblemLifecycleState })[]; error?: string }> {
    if (!this.hasPermission(actor.role, 'problems.view_all')) {
      return { success: false, error: 'Forbidden: Problems view permission required.' };
    }

    const params = new URLSearchParams();
    if (query?.search) params.set('search', query.search);
    if (query?.lifecycle) params.set('lifecycle', query.lifecycle);

    const res = await this.request<any>(
      `/api/admin/problems?${params.toString()}`,
      { method: 'GET' },
      actor,
      () => {
        const lifecycles = StorageService.getProblemLifecycles();
        let list = ALL_PROBLEMS.map(p => ({
          ...p,
          lifecycleState: lifecycles[p.id] || ('published' as ProblemLifecycleState)
        }));
        if (query?.search) {
          const s = query.search.toLowerCase();
          list = list.filter(p => p.title.toLowerCase().includes(s) || p.slug.toLowerCase().includes(s) || p.topic.toLowerCase().includes(s));
        }
        if (query?.lifecycle && query.lifecycle !== 'all') {
          list = list.filter(p => p.lifecycleState === query.lifecycle);
        }
        return { problems: list };
      }
    );

    return {
      success: res.success,
      problems: res.data?.problems,
      error: res.error
    };
  }

  /**
   * Publish Problem
   */
  public static async publishProblem(actor: UserProfile, problemId: string): Promise<{ success: boolean; error?: string }> {
    if (!this.hasPermission(actor.role, 'problems.publish')) {
      return { success: false, error: 'Forbidden: Problem publish permission required.' };
    }

    const res = await this.request<any>(
      '/api/admin/problems/publish',
      {
        method: 'POST',
        body: JSON.stringify({
          actorRole: actor.role,
          actorId: actor.id,
          actorUsername: actor.username,
          problemId
        })
      },
      actor,
      () => {
        StorageService.setProblemLifecycle(problemId, 'published');
        StorageService.appendAuditLog({
          actorId: actor.id,
          actorUsername: actor.username,
          actorRole: actor.role as AdminRole,
          action: 'PROBLEM_PUBLISHED',
          targetType: 'problem',
          targetId: problemId,
          details: `Published problem ${problemId} to live catalogue.`
        });
        return { success: true };
      }
    );

    return { success: res.success, error: res.error };
  }

  /**
   * Archive Problem
   */
  public static async archiveProblem(actor: UserProfile, problemId: string): Promise<{ success: boolean; error?: string }> {
    if (!this.hasPermission(actor.role, 'problems.publish')) {
      return { success: false, error: 'Forbidden: Problem archive permission required.' };
    }

    const res = await this.request<any>(
      '/api/admin/problems/archive',
      {
        method: 'POST',
        body: JSON.stringify({
          actorRole: actor.role,
          actorId: actor.id,
          actorUsername: actor.username,
          problemId
        })
      },
      actor,
      () => {
        StorageService.setProblemLifecycle(problemId, 'archived');
        StorageService.appendAuditLog({
          actorId: actor.id,
          actorUsername: actor.username,
          actorRole: actor.role as AdminRole,
          action: 'PROBLEM_ARCHIVED',
          targetType: 'problem',
          targetId: problemId,
          details: `Archived problem ${problemId}.`
        });
        return { success: true };
      }
    );

    return { success: res.success, error: res.error };
  }

  /**
   * Get Platform Settings
   */
  public static async getSettings(actor: UserProfile): Promise<{ success: boolean; settings?: PlatformSettings; error?: string }> {
    if (!this.hasPermission(actor.role, 'settings.manage')) {
      return { success: false, error: 'Forbidden: Platform settings permission required.' };
    }

    const res = await this.request<any>(
      '/api/admin/settings',
      { method: 'GET' },
      actor,
      () => {
        return { settings: StorageService.getPlatformSettings() };
      }
    );

    return {
      success: res.success,
      settings: res.data?.settings,
      error: res.error
    };
  }

  /**
   * Update Platform Settings & Feature Flags
   */
  public static async updateSettings(
    actor: UserProfile,
    updates: Partial<PlatformSettings>
  ): Promise<{ success: boolean; settings?: PlatformSettings; error?: string }> {
    if (!this.hasPermission(actor.role, 'settings.manage')) {
      return { success: false, error: 'Forbidden: Platform settings permission required.' };
    }

    const res = await this.request<any>(
      '/api/admin/settings',
      {
        method: 'POST',
        body: JSON.stringify({
          actorRole: actor.role,
          actorId: actor.id,
          actorUsername: actor.username,
          updates
        })
      },
      actor,
      () => {
        const current = StorageService.getPlatformSettings();
        const merged: PlatformSettings = {
          ...current,
          ...updates,
          featureFlags: {
            ...current.featureFlags,
            ...(updates.featureFlags || {})
          }
        };
        StorageService.savePlatformSettings(merged);
        StorageService.appendAuditLog({
          actorId: actor.id,
          actorUsername: actor.username,
          actorRole: actor.role as AdminRole,
          action: 'PLATFORM_SETTINGS_UPDATED',
          targetType: 'settings',
          details: 'Updated platform settings and feature flags.'
        });
        return { settings: merged };
      }
    );

    return {
      success: res.success,
      settings: res.data?.settings,
      error: res.error
    };
  }

  /**
   * Get Immutable Audit Logs
   */
  public static async getAuditLogs(
    actor: UserProfile,
    query?: { targetType?: string; search?: string; limit?: number }
  ): Promise<{ success: boolean; logs?: AuditLogEntry[]; error?: string }> {
    if (!this.hasPermission(actor.role, 'audit.view')) {
      return { success: false, error: 'Forbidden: Audit log view permission required.' };
    }

    const params = new URLSearchParams();
    if (query?.targetType) params.set('targetType', query.targetType);
    if (query?.search) params.set('search', query.search);
    if (query?.limit) params.set('limit', String(query.limit));

    const res = await this.request<any>(
      `/api/admin/audit-logs?${params.toString()}`,
      { method: 'GET' },
      actor,
      () => {
        let list = StorageService.getAuditLogs();
        if (query?.targetType && query.targetType !== 'all') {
          list = list.filter(l => l.targetType === query.targetType);
        }
        if (query?.search) {
          const s = query.search.toLowerCase();
          list = list.filter(l => l.action.toLowerCase().includes(s) || l.details.toLowerCase().includes(s) || l.actorUsername.toLowerCase().includes(s));
        }
        return { logs: list.slice(0, query?.limit || 100) };
      }
    );

    return {
      success: res.success,
      logs: res.data?.logs,
      error: res.error
    };
  }
}
