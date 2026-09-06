import {
  AdminRole,
  AdminPermission,
  ROLE_PERMISSIONS,
  AuditLogEntry,
  PlatformReport,
  DiscussionRulesRevision,
  PlatformSettings,
  AdminDashboardMetrics,
  UserAccountStatus,
  ProblemLifecycleState
} from '../src/types/admin.ts';
import { SAMPLE_USERS } from '../src/data/users.ts';
import { ALL_PROBLEMS } from '../src/data/problems.ts';
import { INITIAL_FORUM_POSTS } from '../src/data/forumData.ts';

// Canonical Server Users Store with Administrator (user-10), Moderator (user-1), and promoted account @sparke
export let usersStore = [
  ...SAMPLE_USERS.map(u => ({
    ...u,
    role: (u.id === 'user-1' ? 'moderator' : (u.role || 'user')) as AdminRole,
    status: 'active' as UserAccountStatus
  })),
  {
    id: 'user-sparke',
    name: 'Sparke Lead',
    username: 'sparke',
    email: 'sparke@example.com',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=sparke',
    bio: 'CodeSpark Administrator & Platform Engineer',
    role: 'admin' as AdminRole,
    status: 'active' as UserAccountStatus,
    preferredLanguage: 'python',
    experienceLevel: 'Advanced',
    goal: 'Platform Operations',
    xp: 25000,
    level: 50,
    levelTitle: 'Master',
    streak: 45,
    longestStreak: 45,
    globalRank: 1,
    followersCount: 120,
    followingCount: 5,
    followingIds: [],
    solvedProblemIds: ['p-1', 'p-2', 'p-3', 'p-4', 'p-5'],
    attemptedProblemIds: [],
    savedProblemIds: [],
    badges: ['admin', 'streak-30'],
    activityCalendar: {},
    joinedDate: 'January 2026'
  }
];

// Initial Discussion Rules Revisions Store
const INITIAL_RULES_CONTENT = `# CodeSpark Community & Discussion Rules

Welcome to CodeSpark Discussions. This community is built for thoughtful algorithmic learning, problem-solving discourse, and respectful peer collaboration.

### 1. Be Respectful and Constructive
Treat all developers with kindness. Personal attacks, harassment, bigotry, elitism, or trolling are strictly forbidden. Constructive critique is always welcome when delivered politely.

### 2. No Direct Answer Leaks or Cheating
Do not post raw, unformatted solutions without explanation. Provide intuition, recurrence relations, complexity trade-offs, and algorithmic hints first. During live contests, discussing problems or sharing code is prohibited until the contest timer expires.

### 3. Clear Code Formatting & Spoilers
Always wrap code snippets in Markdown backticks with the language identifier (e.g. \`\`\`python). Mask solution spoilers using spoiler tags so other developers can deliberate freely.

### 4. Zero Tolerance for Spam, Plagiarism, or Self-Promotion
Do not create repetitive posts, unsolicited affiliate links, or plagiarism of other users' work or editorials. Always cite your references.

### 5. Follow Moderator Guidance
Moderators ensure fair play and healthy discussions. Decisions regarding thread moderation, pins, or locking are made to maintain quality.
`;

let discussionRulesRevisions: DiscussionRulesRevision[] = [
  {
    id: 'rev-1',
    version: 1,
    title: 'CodeSpark Discussion Rules (Official)',
    contentMarkdown: INITIAL_RULES_CONTENT,
    status: 'published',
    authorId: 'user-admin',
    authorUsername: 'codespark_admin',
    createdAt: '2026-01-15T00:00:00.000Z',
    publishedAt: '2026-01-15T00:00:00.000Z',
    changeSummary: 'Initial established platform discussion and community conduct rules.'
  }
];

// Seed Reports Queue
let reportsStore: PlatformReport[] = [
  {
    id: 'rep-1',
    reportedBy: 'user-current',
    reportedByUsername: 'ada_codes',
    targetType: 'discussion',
    targetId: 'disc-2',
    targetTitle: 'Dynamic Programming memoization trade-offs',
    targetSnippet: 'Check out my external paywalled blog at spam-link.xyz for the answer...',
    reason: 'spam',
    details: 'User posted an unsolicited external affiliate link instead of participating in discussion.',
    status: 'pending',
    priority: 'medium',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    id: 'rep-2',
    reportedBy: 'user-1',
    reportedByUsername: 'elena_algo',
    targetType: 'comment',
    targetId: 'com-402',
    targetTitle: 'Re: Two Sum optimal one-pass',
    targetSnippet: 'This question is too easy only a toddler would fail to see O(n)',
    reason: 'harassment',
    details: 'Condescending behavior discouraging newer developers in the community.',
    status: 'pending',
    priority: 'high',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
  }
];

// Platform Settings Store
let platformSettings: PlatformSettings = {
  siteName: 'CodeSpark',
  maintenanceMode: false,
  maintenanceNotice: 'CodeSpark is undergoing scheduled core maintenance. We will return shortly.',
  registrationsOpen: true,
  guestSubmissionsAllowed: true,
  sparkAiEnabled: true,
  sparkAiRateLimitPerMin: 20,
  contestsEnabled: true,
  discussionsEnabled: true,
  publicLeaderboardEnabled: true,
  featureFlags: {
    'spark_ai': true,
    'spark_hints': true,
    'spark_debugging': true,
    'spark_complexity_audit': true,
    'interview_simulations': true,
    'discussion_rules_v2': true,
    'live_contest_registration': true
  }
};

// Immutable Append-Only Audit Logs Store
let auditLogsStore: AuditLogEntry[] = [
  {
    id: 'log-seed-1',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    actorId: 'user-admin',
    actorUsername: 'codespark_admin',
    actorRole: 'admin',
    action: 'SYSTEM_INITIALIZED',
    targetType: 'settings',
    details: 'CodeSpark Platform Control Center initialized with Zero-Trust RBAC.',
    metadata: { version: 'Phase 7' }
  },
  {
    id: 'log-seed-2',
    timestamp: new Date(Date.now() - 43200000).toISOString(),
    actorId: 'user-admin',
    actorUsername: 'codespark_admin',
    actorRole: 'admin',
    action: 'RULES_PUBLISHED',
    targetType: 'rule',
    targetId: 'rev-1',
    details: 'Published official Discussion Rules Version 1.',
    metadata: { version: 1 }
  }
];

// Problem Lifecycle Overrides (ProblemId -> LifecycleState)
let problemLifecycleOverrides: Record<string, ProblemLifecycleState> = {};

// Helper: Verify RBAC Permission
export function verifyPermission(actorRole?: string, permission?: AdminPermission): boolean {
  if (!actorRole || !permission) return false;
  const role = actorRole as AdminRole;
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(permission);
}

// Helper: Check if target user is the last remaining administrator (or primary platform administrator)
export function isLastAdmin(targetUserId: string): boolean {
  const activeAdmins = usersStore.filter(
    u => u.role === 'admin' && u.status === 'active'
  );
  return activeAdmins.length <= 1 || targetUserId === 'user-10';
}

// Helper: Append Immutable Audit Log
export function logAudit(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): AuditLogEntry {
  const newLog: AuditLogEntry = {
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    ...entry
  };
  auditLogsStore.unshift(newLog);
  // Cap at 1000 logs in memory
  if (auditLogsStore.length > 1000) {
    auditLogsStore = auditLogsStore.slice(0, 1000);
  }
  return newLog;
}

export interface AuthContext {
  actor: any;
  role: AdminRole;
  userId: string;
  username: string;
}

/**
 * Server-Side Zero-Trust Authentication & Authorization Gate.
 * Enforces deny-by-default:
 * 1. Authenticates session actor
 * 2. Resolves role strictly from authoritative server database (usersStore)
 * 3. Rejects banned/suspended users
 * 4. Validates granular permission required for the specific administrative action
 * Never trusts client-provided role fields or headers.
 */
export function authenticateAndAuthorize(
  arg1?: string,
  arg2?: string,
  arg3?: string,
  arg4?: AdminPermission
): { authorized: true; ctx: AuthContext } | { authorized: false; status: number; error: string } {
  let requiredPermission: AdminPermission | undefined;
  let actorId: string | undefined;
  let actorUsername: string | undefined;

  const possiblePermissions: AdminPermission[] = [
    'admin.access', 'users.view', 'users.manage', 'users.warn_suspend',
    'roles.assign', 'problems.view_all', 'problems.publish', 'learning.manage',
    'discussions.moderate', 'discussions.manage_rules', 'moderation.view',
    'moderation.resolve', 'contests.manage', 'spark.manage', 'settings.manage',
    'audit.view', 'analytics.view'
  ];

  if (possiblePermissions.includes(arg4 as AdminPermission)) {
    actorId = arg2;
    actorUsername = arg3;
    requiredPermission = arg4;
  } else if (possiblePermissions.includes(arg3 as AdminPermission)) {
    actorId = arg1;
    actorUsername = arg2;
    requiredPermission = arg3 as AdminPermission;
  } else if (possiblePermissions.includes(arg2 as AdminPermission)) {
    actorId = arg1;
    requiredPermission = arg2 as AdminPermission;
  } else {
    actorId = arg1;
    actorUsername = arg2;
    requiredPermission = undefined;
  }

  let user: any = null;
  if (actorId) {
    const cleanId = actorId.trim().toLowerCase();
    user = usersStore.find(u => u.id === actorId || u.username.toLowerCase() === cleanId);
  }
  if (!user && actorUsername) {
    const cleanUser = actorUsername.trim().toLowerCase();
    user = usersStore.find(u => u.id === actorUsername || u.username.toLowerCase() === cleanUser);
  }

  // 1. Strict authentication check
  if (!user) {
    return {
      authorized: false,
      status: 401,
      error: 'Authentication required: Missing or invalid authenticated session credentials.'
    };
  }

  // 2. Account status check
  if (user.status === 'banned' || user.status === 'suspended') {
    return {
      authorized: false,
      status: 403,
      error: `Access Denied: Account is currently ${user.status}.`
    };
  }

  // 3. ZERO-TRUST SERVER ROLE RESOLUTION:
  // Role is ALWAYS derived from the server's authoritative database (user.role).
  const role = (user.role || 'user') as AdminRole;

  // 4. Granular Permission verification (deny-by-default)
  if (requiredPermission && !verifyPermission(role, requiredPermission)) {
    return {
      authorized: false,
      status: 403,
      error: `Forbidden: Insufficient privileges. Role '${role}' lacks permission '${requiredPermission}'.`
    };
  }

  return {
    authorized: true,
    ctx: {
      actor: user,
      role,
      userId: user.id,
      username: user.username
    }
  };
}

/**
 * Administrative CLI promotion function to assign a role in the database.
 */
export function promoteUserInStore(
  username: string,
  newRole: AdminRole,
  actorUsername: string = 'cli_admin'
): { success: boolean; error?: string; user?: any } {
  const clean = username.trim().toLowerCase();
  let userIndex = usersStore.findIndex(u => u.username.toLowerCase() === clean);

  if (userIndex === -1) {
    const newUser = {
      id: `usr-${clean}`,
      name: username.charAt(0).toUpperCase() + username.slice(1),
      username: clean,
      email: `${clean}@example.com`,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(clean)}`,
      bio: 'CodeSpark Platform Account',
      role: newRole,
      status: 'active' as UserAccountStatus,
      preferredLanguage: 'python',
      experienceLevel: 'Advanced',
      goal: 'Platform Operations',
      xp: 1000,
      level: 10,
      levelTitle: 'Problem Solver',
      streak: 5,
      longestStreak: 5,
      globalRank: 100,
      followersCount: 10,
      followingCount: 2,
      followingIds: [],
      solvedProblemIds: [],
      attemptedProblemIds: [],
      savedProblemIds: [],
      badges: [newRole],
      activityCalendar: {},
      joinedDate: 'February 2026'
    };
    usersStore.push(newUser as any);
    userIndex = usersStore.length - 1;
  } else {
    usersStore[userIndex].role = newRole;
  }

  logAudit({
    actorId: actorUsername,
    actorUsername,
    actorRole: 'admin',
    action: 'USER_ROLE_PROMOTED',
    targetType: 'user',
    targetId: usersStore[userIndex].id,
    details: `Assigned role '${newRole}' to @${usersStore[userIndex].username} through database authorization system.`
  });

  return { success: true, user: usersStore[userIndex] };
}

/**
 * 1. GET /api/admin/metrics
 */
export async function handleGetMetrics(actorRoleOrId?: string, actorIdOrUsername?: string) {
  const auth = authenticateAndAuthorize(actorRoleOrId, actorIdOrUsername, undefined, 'admin.access');
  if (!auth.authorized) {
    return { status: auth.status, data: { success: false, error: auth.error } };
  }

  const activeUsersCount = usersStore.filter(u => u.status === 'active').length;
  const pendingReportsCount = reportsStore.filter(r => r.status === 'pending').length;
  const publishedProblemsCount = ALL_PROBLEMS.filter(p => problemLifecycleOverrides[p.id] !== 'draft').length;

  const metrics: AdminDashboardMetrics = {
    totalUsers: usersStore.length,
    activeUsersToday: Math.max(activeUsersCount, 1),
    totalProblems: ALL_PROBLEMS.length,
    publishedProblems: publishedProblemsCount,
    totalSubmissions: 1420,
    totalSolves: 890,
    pendingReports: pendingReportsCount,
    activeContests: 1,
    discussionsCount: INITIAL_FORUM_POSTS.length,
    sparkRequestsToday: 134
  };

  return { status: 200, data: { success: true, metrics } };
}

/**
 * 2. GET /api/admin/users
 */
export async function handleGetUsers(
  actorRoleOrId?: string,
  actorIdOrUsername?: string,
  queryOrArg?: any,
  query?: { search?: string; role?: string; status?: string }
) {
  const effectiveQuery = (query || (typeof queryOrArg === 'object' ? queryOrArg : undefined));
  const auth = authenticateAndAuthorize(actorRoleOrId, actorIdOrUsername, undefined, 'users.view');
  if (!auth.authorized) {
    return { status: auth.status, data: { success: false, error: auth.error } };
  }

  let filtered = [...usersStore];
  if (effectiveQuery?.search) {
    const s = effectiveQuery.search.toLowerCase();
    filtered = filtered.filter(u => u.name.toLowerCase().includes(s) || u.username.toLowerCase().includes(s) || u.email.toLowerCase().includes(s));
  }
  if (effectiveQuery?.role && effectiveQuery.role !== 'all') {
    filtered = filtered.filter(u => u.role === effectiveQuery.role);
  }
  if (effectiveQuery?.status && effectiveQuery.status !== 'all') {
    filtered = filtered.filter(u => u.status === effectiveQuery.status);
  }

  return { status: 200, data: { success: true, users: filtered } };
}

/**
 * 3. POST /api/admin/users/role
 */
export async function handleUpdateUserRole(
  actorRoleOrId?: string,
  actorIdOrUsername?: string,
  actorUsernameOrBody?: any,
  bodyArg?: { targetUserId: string; newRole: AdminRole }
) {
  const body = (bodyArg || (typeof actorUsernameOrBody === 'object' ? actorUsernameOrBody : undefined));
  const actorUsername = typeof actorUsernameOrBody === 'string' ? actorUsernameOrBody : undefined;
  const auth = authenticateAndAuthorize(actorRoleOrId, actorIdOrUsername, actorUsername, 'roles.assign');
  if (!auth.authorized) {
    return { status: auth.status, data: { success: false, error: auth.error } };
  }

  if (!body?.targetUserId || !body?.newRole) {
    return { status: 400, data: { success: false, error: 'targetUserId and newRole are required.' } };
  }

  const userIndex = usersStore.findIndex(u => u.id === body.targetUserId);
  if (userIndex === -1) {
    return { status: 404, data: { success: false, error: 'Target user not found.' } };
  }

  const targetUser = usersStore[userIndex];

  // LAST ADMIN LOCKOUT GUARD: Cannot demote the sole remaining administrator
  if (targetUser.role === 'admin' && body.newRole !== 'admin' && isLastAdmin(targetUser.id)) {
    return {
      status: 400,
      data: {
        success: false,
        error: 'Critical: Cannot demote the last remaining platform administrator. Assign another administrator first.'
      }
    };
  }

  const oldRole = targetUser.role;
  usersStore[userIndex].role = body.newRole;

  logAudit({
    actorId: auth.ctx.userId,
    actorUsername: auth.ctx.username,
    actorRole: auth.ctx.role,
    action: 'USER_ROLE_UPDATED',
    targetType: 'user',
    targetId: targetUser.id,
    details: `Updated role for @${targetUser.username} from '${oldRole}' to '${body.newRole}'.`,
    metadata: { oldRole, newRole: body.newRole, targetUsername: targetUser.username }
  });

  return { status: 200, data: { success: true, user: usersStore[userIndex] } };
}

/**
 * 4. POST /api/admin/users/status
 */
export async function handleUpdateUserStatus(
  actorRoleOrId?: string,
  actorIdOrUsername?: string,
  actorUsernameOrBody?: any,
  bodyArg?: { targetUserId: string; newStatus: UserAccountStatus; reason?: string }
) {
  const body = (bodyArg || (typeof actorUsernameOrBody === 'object' ? actorUsernameOrBody : undefined));
  const actorUsername = typeof actorUsernameOrBody === 'string' ? actorUsernameOrBody : undefined;
  const auth = authenticateAndAuthorize(actorRoleOrId, actorIdOrUsername, actorUsername, 'users.warn_suspend');
  if (!auth.authorized) {
    return { status: auth.status, data: { success: false, error: auth.error } };
  }

  if (!body?.targetUserId || !body?.newStatus) {
    return { status: 400, data: { success: false, error: 'targetUserId and newStatus are required.' } };
  }

  const userIndex = usersStore.findIndex(u => u.id === body.targetUserId);
  if (userIndex === -1) {
    return { status: 404, data: { success: false, error: 'Target user not found.' } };
  }

  const targetUser = usersStore[userIndex];

  // LAST ADMIN LOCKOUT GUARD: Cannot suspend or ban the sole remaining admin
  if (targetUser.role === 'admin' && (body.newStatus === 'suspended' || body.newStatus === 'banned') && isLastAdmin(targetUser.id)) {
    return {
      status: 400,
      data: {
        success: false,
        error: 'Critical: Cannot suspend or ban the last remaining platform administrator.'
      }
    };
  }

  const oldStatus = targetUser.status;
  usersStore[userIndex].status = body.newStatus;

  logAudit({
    actorId: auth.ctx.userId,
    actorUsername: auth.ctx.username,
    actorRole: auth.ctx.role,
    action: 'USER_STATUS_UPDATED',
    targetType: 'user',
    targetId: targetUser.id,
    details: `Updated status for @${targetUser.username} from '${oldStatus}' to '${body.newStatus}'. Reason: ${body.reason || 'None provided'}`,
    metadata: { oldStatus, newStatus: body.newStatus, reason: body.reason }
  });

  return { status: 200, data: { success: true, user: usersStore[userIndex] } };
}

/**
 * 5. GET /api/admin/reports
 */
export async function handleGetReports(
  actorRoleOrId?: string,
  actorIdOrUsername?: string,
  queryOrArg?: any,
  query?: { status?: string; priority?: string }
) {
  const effectiveQuery = (query || (typeof queryOrArg === 'object' ? queryOrArg : undefined));
  const auth = authenticateAndAuthorize(actorRoleOrId, actorIdOrUsername, undefined, 'moderation.view');
  if (!auth.authorized) {
    return { status: auth.status, data: { success: false, error: auth.error } };
  }

  let filtered = [...reportsStore];
  if (effectiveQuery?.status && effectiveQuery.status !== 'all') {
    filtered = filtered.filter(r => r.status === effectiveQuery.status);
  }
  if (effectiveQuery?.priority && effectiveQuery.priority !== 'all') {
    filtered = filtered.filter(r => r.priority === effectiveQuery.priority);
  }

  return { status: 200, data: { success: true, reports: filtered } };
}

/**
 * 6. POST /api/admin/reports/resolve
 */
export async function handleResolveReport(
  actorRoleOrId?: string,
  actorIdOrUsername?: string,
  actorUsernameOrBody?: any,
  bodyArg?: { reportId: string; actionTaken: any; modNotes?: string }
) {
  const body = (bodyArg || (typeof actorUsernameOrBody === 'object' ? actorUsernameOrBody : undefined));
  const actorUsername = typeof actorUsernameOrBody === 'string' ? actorUsernameOrBody : undefined;
  const auth = authenticateAndAuthorize(actorRoleOrId, actorIdOrUsername, actorUsername, 'moderation.resolve');
  if (!auth.authorized) {
    return { status: auth.status, data: { success: false, error: auth.error } };
  }

  if (!body?.reportId || !body?.actionTaken) {
    return { status: 400, data: { success: false, error: 'reportId and actionTaken are required.' } };
  }

  const reportIndex = reportsStore.findIndex(r => r.id === body.reportId);
  if (reportIndex === -1) {
    return { status: 404, data: { success: false, error: 'Report not found.' } };
  }

  reportsStore[reportIndex].status = 'resolved';
  reportsStore[reportIndex].resolvedAt = new Date().toISOString();
  reportsStore[reportIndex].resolvedBy = auth.ctx.username;
  reportsStore[reportIndex].actionTaken = body.actionTaken;
  reportsStore[reportIndex].modNotes = body.modNotes;

  logAudit({
    actorId: auth.ctx.userId,
    actorUsername: auth.ctx.username,
    actorRole: auth.ctx.role,
    action: 'REPORT_RESOLVED',
    targetType: 'report',
    targetId: body.reportId,
    details: `Resolved report ${body.reportId} with action '${body.actionTaken}'. Notes: ${body.modNotes || 'None'}`,
    metadata: { reportId: body.reportId, actionTaken: body.actionTaken, modNotes: body.modNotes }
  });

  return { status: 200, data: { success: true, report: reportsStore[reportIndex] } };
}

/**
 * 7. GET /api/admin/rules
 */
export async function handleGetDiscussionRules(actorRoleOrId?: string, actorIdOrUsername?: string) {
  const auth = authenticateAndAuthorize(actorRoleOrId, actorIdOrUsername, undefined, 'discussions.manage_rules');
  if (!auth.authorized) {
    return { status: auth.status, data: { success: false, error: auth.error } };
  }

  const published = discussionRulesRevisions.find(r => r.status === 'published') || discussionRulesRevisions[0];

  return {
    status: 200,
    data: {
      success: true,
      currentPublished: published,
      revisions: discussionRulesRevisions
    }
  };
}

/**
 * 8. POST /api/admin/rules/draft
 */
export async function handleSaveDiscussionRulesDraft(
  actorRoleOrId?: string,
  actorIdOrUsername?: string,
  actorUsernameOrBody?: any,
  bodyArg?: { title: string; contentMarkdown: string; changeSummary?: string }
) {
  const body = (bodyArg || (typeof actorUsernameOrBody === 'object' ? actorUsernameOrBody : undefined));
  const actorUsername = typeof actorUsernameOrBody === 'string' ? actorUsernameOrBody : undefined;
  const auth = authenticateAndAuthorize(actorRoleOrId, actorIdOrUsername, actorUsername, 'discussions.manage_rules');
  if (!auth.authorized) {
    return { status: auth.status, data: { success: false, error: auth.error } };
  }

  if (!body?.title || !body?.contentMarkdown) {
    return { status: 400, data: { success: false, error: 'title and contentMarkdown are required.' } };
  }

  const nextVersion = Math.max(...discussionRulesRevisions.map(r => r.version), 0) + 1;
  const newDraft: DiscussionRulesRevision = {
    id: `rev-${Date.now()}`,
    version: nextVersion,
    title: body.title.trim(),
    contentMarkdown: body.contentMarkdown,
    status: 'draft',
    authorId: auth.ctx.userId,
    authorUsername: auth.ctx.username,
    createdAt: new Date().toISOString(),
    changeSummary: body.changeSummary || `Draft created for version ${nextVersion}`
  };

  discussionRulesRevisions.unshift(newDraft);

  logAudit({
    actorId: auth.ctx.userId,
    actorUsername: auth.ctx.username,
    actorRole: auth.ctx.role,
    action: 'RULES_DRAFT_SAVED',
    targetType: 'rule',
    targetId: newDraft.id,
    details: `Created draft for Discussion Rules v${nextVersion}.`,
    metadata: { revisionId: newDraft.id, version: nextVersion }
  });

  return { status: 200, data: { success: true, draft: newDraft } };
}

/**
 * 9. POST /api/admin/rules/publish
 */
export async function handlePublishDiscussionRules(
  actorRoleOrId?: string,
  actorIdOrUsername?: string,
  actorUsernameOrBody?: any,
  bodyArg?: { revisionId: string }
) {
  const body = (bodyArg || (typeof actorUsernameOrBody === 'object' ? actorUsernameOrBody : undefined));
  const actorUsername = typeof actorUsernameOrBody === 'string' ? actorUsernameOrBody : undefined;
  const auth = authenticateAndAuthorize(actorRoleOrId, actorIdOrUsername, actorUsername, 'discussions.manage_rules');
  if (!auth.authorized) {
    return { status: auth.status, data: { success: false, error: auth.error } };
  }

  if (!body?.revisionId) {
    return { status: 400, data: { success: false, error: 'revisionId is required.' } };
  }

  const revIndex = discussionRulesRevisions.findIndex(r => r.id === body.revisionId);
  if (revIndex === -1) {
    return { status: 404, data: { success: false, error: 'Revision not found.' } };
  }

  // Archive currently published revisions
  discussionRulesRevisions = discussionRulesRevisions.map(r => ({
    ...r,
    status: r.id === body.revisionId ? 'published' : (r.status === 'published' ? 'archived' : r.status)
  }));

  const publishedRevision = discussionRulesRevisions.find(r => r.id === body.revisionId)!;
  publishedRevision.publishedAt = new Date().toISOString();

  // Sync with forum thread content so public users on /discussions/rules see the update immediately
  const rulesThread = INITIAL_FORUM_POSTS.find(t => t.system_type === 'discussion_rules' || t.id === 'discussion-rules');
  if (rulesThread) {
    rulesThread.content = publishedRevision.contentMarkdown;
    rulesThread.lastActivityAt = new Date().toISOString();
  }

  logAudit({
    actorId: auth.ctx.userId,
    actorUsername: auth.ctx.username,
    actorRole: auth.ctx.role,
    action: 'RULES_PUBLISHED',
    targetType: 'rule',
    targetId: publishedRevision.id,
    details: `Published Discussion Rules v${publishedRevision.version}: "${publishedRevision.title}".`,
    metadata: { revisionId: publishedRevision.id, version: publishedRevision.version }
  });

  return { status: 200, data: { success: true, published: publishedRevision } };
}

/**
 * 10. POST /api/admin/rules/rollback
 */
export async function handleRollbackDiscussionRules(
  actorRoleOrId?: string,
  actorIdOrUsername?: string,
  actorUsernameOrBody?: any,
  bodyArg?: { targetVersion: number }
) {
  const body = (bodyArg || (typeof actorUsernameOrBody === 'object' ? actorUsernameOrBody : undefined));
  const actorUsername = typeof actorUsernameOrBody === 'string' ? actorUsernameOrBody : undefined;
  const auth = authenticateAndAuthorize(actorRoleOrId, actorIdOrUsername, actorUsername, 'discussions.manage_rules');
  if (!auth.authorized) {
    return { status: auth.status, data: { success: false, error: auth.error } };
  }

  if (!body?.targetVersion) {
    return { status: 400, data: { success: false, error: 'targetVersion is required.' } };
  }

  const targetRev = discussionRulesRevisions.find(r => r.version === body.targetVersion);
  if (!targetRev) {
    return { status: 404, data: { success: false, error: `Revision v${body.targetVersion} not found.` } };
  }

  // Rollback creates a new published version matching the target revision's content
  const nextVersion = Math.max(...discussionRulesRevisions.map(r => r.version), 0) + 1;
  const rollbackRev: DiscussionRulesRevision = {
    id: `rev-${Date.now()}`,
    version: nextVersion,
    title: targetRev.title,
    contentMarkdown: targetRev.contentMarkdown,
    status: 'published',
    authorId: auth.ctx.userId,
    authorUsername: auth.ctx.username,
    createdAt: new Date().toISOString(),
    publishedAt: new Date().toISOString(),
    changeSummary: `Rollback to Version ${targetRev.version} content.`
  };

  discussionRulesRevisions = discussionRulesRevisions.map(r => ({
    ...r,
    status: r.status === 'published' ? 'archived' : r.status
  }));
  discussionRulesRevisions.unshift(rollbackRev);

  // Sync with forum thread content
  const rulesThread = INITIAL_FORUM_POSTS.find(t => t.system_type === 'discussion_rules' || t.id === 'discussion-rules');
  if (rulesThread) {
    rulesThread.content = rollbackRev.contentMarkdown;
    rulesThread.lastActivityAt = new Date().toISOString();
  }

  logAudit({
    actorId: auth.ctx.userId,
    actorUsername: auth.ctx.username,
    actorRole: auth.ctx.role,
    action: 'RULES_ROLLBACK',
    targetType: 'rule',
    targetId: rollbackRev.id,
    details: `Rolled back Discussion Rules to v${targetRev.version} as new v${nextVersion}.`,
    metadata: { rolledBackFromVersion: targetRev.version, newVersion: nextVersion }
  });

  return { status: 200, data: { success: true, published: rollbackRev } };
}

/**
 * 11. GET /api/admin/problems
 */
export async function handleGetProblems(
  actorRoleOrId?: string,
  actorIdOrUsername?: string,
  queryOrArg?: any,
  query?: { search?: string; lifecycle?: string }
) {
  const effectiveQuery = (query || (typeof queryOrArg === 'object' ? queryOrArg : undefined));
  const auth = authenticateAndAuthorize(actorRoleOrId, actorIdOrUsername, undefined, 'problems.view_all');
  if (!auth.authorized) {
    return { status: auth.status, data: { success: false, error: auth.error } };
  }

  let list = ALL_PROBLEMS.map(p => ({
    ...p,
    lifecycleState: problemLifecycleOverrides[p.id] || ('published' as ProblemLifecycleState)
  }));

  if (effectiveQuery?.search) {
    const s = effectiveQuery.search.toLowerCase();
    list = list.filter(p => p.title.toLowerCase().includes(s) || p.slug.toLowerCase().includes(s) || p.topic.toLowerCase().includes(s));
  }
  if (effectiveQuery?.lifecycle && effectiveQuery.lifecycle !== 'all') {
    list = list.filter(p => p.lifecycleState === effectiveQuery.lifecycle);
  }

  return { status: 200, data: { success: true, problems: list } };
}

/**
 * 12. POST /api/admin/problems/publish
 */
export async function handlePublishProblem(
  actorRoleOrId?: string,
  actorIdOrUsername?: string,
  actorUsernameOrBody?: any,
  bodyArg?: { problemId: string }
) {
  const body = (bodyArg || (typeof actorUsernameOrBody === 'object' ? actorUsernameOrBody : undefined));
  const actorUsername = typeof actorUsernameOrBody === 'string' ? actorUsernameOrBody : undefined;
  const auth = authenticateAndAuthorize(actorRoleOrId, actorIdOrUsername, actorUsername, 'problems.publish');
  if (!auth.authorized) {
    return { status: auth.status, data: { success: false, error: auth.error } };
  }

  if (!body?.problemId) {
    return { status: 400, data: { success: false, error: 'problemId is required.' } };
  }

  problemLifecycleOverrides[body.problemId] = 'published';

  logAudit({
    actorId: auth.ctx.userId,
    actorUsername: auth.ctx.username,
    actorRole: auth.ctx.role,
    action: 'PROBLEM_PUBLISHED',
    targetType: 'problem',
    targetId: body.problemId,
    details: `Published problem ${body.problemId} to live catalogue.`,
    metadata: { problemId: body.problemId, lifecycleState: 'published' }
  });

  return { status: 200, data: { success: true, problemId: body.problemId, lifecycleState: 'published' } };
}

/**
 * 13. POST /api/admin/problems/archive
 */
export async function handleArchiveProblem(
  actorRoleOrId?: string,
  actorIdOrUsername?: string,
  actorUsernameOrBody?: any,
  bodyArg?: { problemId: string }
) {
  const body = (bodyArg || (typeof actorUsernameOrBody === 'object' ? actorUsernameOrBody : undefined));
  const actorUsername = typeof actorUsernameOrBody === 'string' ? actorUsernameOrBody : undefined;
  const auth = authenticateAndAuthorize(actorRoleOrId, actorIdOrUsername, actorUsername, 'problems.publish');
  if (!auth.authorized) {
    return { status: auth.status, data: { success: false, error: auth.error } };
  }

  if (!body?.problemId) {
    return { status: 400, data: { success: false, error: 'problemId is required.' } };
  }

  problemLifecycleOverrides[body.problemId] = 'archived';

  logAudit({
    actorId: auth.ctx.userId,
    actorUsername: auth.ctx.username,
    actorRole: auth.ctx.role,
    action: 'PROBLEM_ARCHIVED',
    targetType: 'problem',
    targetId: body.problemId,
    details: `Archived problem ${body.problemId}.`,
    metadata: { problemId: body.problemId, lifecycleState: 'archived' }
  });

  return { status: 200, data: { success: true, problemId: body.problemId, lifecycleState: 'archived' } };
}

/**
 * 14. GET /api/admin/settings
 */
export async function handleGetPlatformSettings(actorRoleOrId?: string, actorIdOrUsername?: string) {
  const auth = authenticateAndAuthorize(actorRoleOrId, actorIdOrUsername, undefined, 'settings.manage');
  if (!auth.authorized) {
    return { status: auth.status, data: { success: false, error: auth.error } };
  }

  return { status: 200, data: { success: true, settings: platformSettings } };
}

/**
 * 15. POST /api/admin/settings
 */
export async function handleUpdatePlatformSettings(
  actorRoleOrId?: string,
  actorIdOrUsername?: string,
  actorUsernameOrBody?: any,
  bodyArg?: { updates: Partial<PlatformSettings> }
) {
  const body = (bodyArg || (typeof actorUsernameOrBody === 'object' ? actorUsernameOrBody : undefined));
  const actorUsername = typeof actorUsernameOrBody === 'string' ? actorUsernameOrBody : undefined;
  const auth = authenticateAndAuthorize(actorRoleOrId, actorIdOrUsername, actorUsername, 'settings.manage');
  if (!auth.authorized) {
    return { status: auth.status, data: { success: false, error: auth.error } };
  }

  if (!body?.updates) {
    return { status: 400, data: { success: false, error: 'updates object is required.' } };
  }

  platformSettings = {
    ...platformSettings,
    ...body.updates,
    featureFlags: {
      ...platformSettings.featureFlags,
      ...(body.updates.featureFlags || {})
    }
  };

  logAudit({
    actorId: auth.ctx.userId,
    actorUsername: auth.ctx.username,
    actorRole: auth.ctx.role,
    action: 'PLATFORM_SETTINGS_UPDATED',
    targetType: 'settings',
    details: `Updated platform configuration and feature flags.`,
    metadata: { updates: body.updates }
  });

  return { status: 200, data: { success: true, settings: platformSettings } };
}

/**
 * 16. GET /api/admin/audit-logs
 */
export async function handleGetAuditLogs(
  actorRoleOrId?: string,
  actorIdOrUsername?: string,
  queryOrArg?: any,
  query?: { targetType?: string; search?: string; limit?: number }
) {
  const effectiveQuery = (query || (typeof queryOrArg === 'object' ? queryOrArg : undefined));
  const auth = authenticateAndAuthorize(actorRoleOrId, actorIdOrUsername, undefined, 'audit.view');
  if (!auth.authorized) {
    return { status: auth.status, data: { success: false, error: auth.error } };
  }

  let list = [...auditLogsStore];
  if (effectiveQuery?.targetType && effectiveQuery.targetType !== 'all') {
    list = list.filter(l => l.targetType === effectiveQuery.targetType);
  }
  if (effectiveQuery?.search) {
    const s = effectiveQuery.search.toLowerCase();
    list = list.filter(l => l.action.toLowerCase().includes(s) || l.details.toLowerCase().includes(s) || l.actorUsername.toLowerCase().includes(s));
  }
  const limit = Math.min(effectiveQuery?.limit || 100, 500);
  list = list.slice(0, limit);

  return { status: 200, data: { success: true, logs: list } };
}
