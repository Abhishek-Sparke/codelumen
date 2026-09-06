export type AdminRole = 'user' | 'moderator' | 'admin';

export type AdminPermission =
  | 'admin.access'
  | 'users.view'
  | 'users.manage'
  | 'users.warn_suspend'
  | 'roles.assign'
  | 'moderation.view'
  | 'moderation.resolve'
  | 'discussions.moderate'
  | 'discussions.manage_rules'
  | 'problems.view_all'
  | 'problems.create_edit'
  | 'problems.publish'
  | 'problems.manage_tests'
  | 'learning.manage'
  | 'contests.manage'
  | 'gamification.manage'
  | 'spark.manage'
  | 'settings.manage'
  | 'audit.view'
  | 'analytics.view';

export const ROLE_PERMISSIONS: Record<AdminRole, AdminPermission[]> = {
  user: [],
  moderator: [
    'admin.access',
    'users.warn_suspend',
    'moderation.view',
    'moderation.resolve',
    'discussions.moderate',
    'discussions.manage_rules'
  ],
  admin: [
    'admin.access',
    'users.view',
    'users.manage',
    'users.warn_suspend',
    'roles.assign',
    'moderation.view',
    'moderation.resolve',
    'discussions.moderate',
    'discussions.manage_rules',
    'problems.view_all',
    'problems.create_edit',
    'problems.publish',
    'problems.manage_tests',
    'learning.manage',
    'contests.manage',
    'gamification.manage',
    'spark.manage',
    'settings.manage',
    'audit.view',
    'analytics.view'
  ]
};

export type UserAccountStatus = 'active' | 'warned' | 'suspended' | 'banned';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorId: string;
  actorUsername: string;
  actorRole: AdminRole;
  action: string;
  targetType: 'user' | 'problem' | 'discussion' | 'report' | 'rule' | 'contest' | 'settings' | 'spark' | 'auth';
  targetId?: string;
  details: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
}

export type ReportTargetType = 'discussion' | 'comment' | 'user' | 'solution';
export type ReportReason = 'spam' | 'harassment' | 'plagiarism' | 'inappropriate' | 'rules_violation' | 'other';
export type ReportStatus = 'pending' | 'in_review' | 'resolved' | 'dismissed';
export type ReportPriority = 'low' | 'medium' | 'high' | 'critical';
export type ReportActionTaken = 'none' | 'warning_sent' | 'content_hidden' | 'content_deleted' | 'user_suspended' | 'user_banned';

export interface PlatformReport {
  id: string;
  reportedBy: string;
  reportedByUsername: string;
  targetType: ReportTargetType;
  targetId: string;
  targetTitle?: string;
  targetSnippet?: string;
  reason: ReportReason;
  details: string;
  status: ReportStatus;
  priority: ReportPriority;
  createdAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
  actionTaken?: ReportActionTaken;
  modNotes?: string;
}

export interface DiscussionRulesRevision {
  id: string;
  version: number;
  title: string;
  contentMarkdown: string;
  status: 'draft' | 'published' | 'archived';
  authorId: string;
  authorUsername: string;
  createdAt: string;
  publishedAt?: string;
  changeSummary?: string;
}

export type ProblemLifecycleState = 'draft' | 'review' | 'published' | 'archived';

export interface AdminProblemTestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isHidden: boolean;
  explanation?: string;
}

export interface PlatformSettings {
  siteName: string;
  maintenanceMode: boolean;
  maintenanceNotice?: string;
  registrationsOpen: boolean;
  guestSubmissionsAllowed: boolean;
  sparkAiEnabled: boolean;
  sparkAiRateLimitPerMin: number;
  contestsEnabled: boolean;
  discussionsEnabled: boolean;
  publicLeaderboardEnabled: boolean;
  featureFlags: Record<string, boolean>;
}

export interface AdminDashboardMetrics {
  totalUsers: number;
  activeUsersToday: number;
  totalProblems: number;
  publishedProblems: number;
  totalSubmissions: number;
  totalSolves: number;
  pendingReports: number;
  activeContests: number;
  discussionsCount: number;
  sparkRequestsToday: number;
}
