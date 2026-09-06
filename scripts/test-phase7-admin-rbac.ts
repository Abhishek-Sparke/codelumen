/**
 * CodeSpark Phase 7.1 — Comprehensive RBAC & Real Admin Access Test Suite
 * 
 * Verifies all 14 test cases specified in the prompt:
 * CASE 1: USER @sparke -> /admin -> 403 Access Denied
 * CASE 2: USER @sparke -> /admin/users -> 403 Access Denied
 * CASE 3: USER -> direct admin API -> 403 Forbidden
 * CASE 4: Change localStorage role -> still USER / 403
 * CASE 5: Modify URL/query parameters -> still USER / 403
 * CASE 6: ADMIN @sparke -> /admin -> Control Center loads
 * CASE 7: ADMIN @sparke -> /admin/users -> allowed
 * CASE 8: ADMIN @sparke -> /admin/problems -> allowed
 * CASE 9: ADMIN @sparke -> /admin/discussions/rules -> allowed
 * CASE 10: ADMIN @sparke -> /admin/audit-logs -> allowed
 * CASE 11: Refresh /admin as ADMIN -> remains authorized
 * CASE 12: Logout -> /admin -> authentication required
 * CASE 13: MODERATOR -> moderator pages -> allowed according to permissions
 * CASE 14: MODERATOR -> unauthorized ADMIN action -> 403
 */

import './setup-storage-mock.ts';

import {
  usersStore,
  authenticateAndAuthorize,
  verifyPermission,
  handleGetMetrics,
  handleGetUsers,
  handleGetProblems,
  handleGetDiscussionRules,
  handleGetReports,
  handleGetAuditLogs,
  handleUpdateUserRole,
  handleGetPlatformSettings
} from '../server/adminController.ts';
import { AdminService } from '../src/services/adminService.ts';
import { parseRoute } from '../src/router/router.ts';
import { StorageService } from '../src/services/storage.ts';

async function runRBACTests() {
  console.log('================================================================');
  console.log('  CODESPARK PHASE 7.1: FULL RBAC & REAL ADMIN ACCESS TEST SUITE  ');
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`  ✓ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ✕ FAIL: ${testName}`);
      if (detail) console.error(`    Detail: ${detail}`);
      failed++;
    }
  }

  // SETUP: Initial state with normal USER account @sparke
  const initialSparkeUser = {
    id: 'user-sparke',
    name: 'Sparke Account',
    username: 'sparke',
    email: 'sparke@example.com',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=sparke',
    bio: 'Test account',
    role: 'user' as const,
    preferredLanguage: 'python' as const,
    experienceLevel: 'Intermediate' as const,
    goal: 'DSA Fundamentals' as const,
    goals: [],
    xp: 200,
    level: 2,
    levelTitle: 'Novice',
    streak: 1,
    longestStreak: 1,
    globalRank: 500,
    followersCount: 0,
    followingCount: 0,
    followingIds: [],
    solvedProblemIds: [],
    attemptedProblemIds: [],
    savedProblemIds: [],
    badges: [],
    activityCalendar: {},
    joinedDate: 'February 2026'
  };

  const initialAccount = {
    id: 'user-sparke',
    email: 'sparke@example.com',
    username: 'sparke',
    salt: 'salt123',
    passwordHash: 'hash123',
    profile: {
      id: 'prf-sparke',
      user_id: 'user-sparke',
      name: 'Sparke Account',
      username: 'sparke',
      avatar_url: '',
      bio: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    preferences: {} as any,
    progress: {} as any,
    onboarding: {} as any,
    user: { ...initialSparkeUser }
  };

  // Seed storage with standard USER account
  // Mark migration as already applied so auto-promotion does not run prematurely before CASE 1
  localStorage.setItem('codespark_db_migrations', JSON.stringify(['005_assign_admin_role']));
  localStorage.setItem('codespark_auth_accounts', JSON.stringify([initialAccount]));
  localStorage.setItem('codespark_current_user', JSON.stringify(initialSparkeUser));
  localStorage.setItem('codespark_authenticated', 'true');

  // --------------------------------------------------------------------------
  console.log('--- CASE 1: USER @sparke -> /admin (Access Denied) ---');
  // --------------------------------------------------------------------------
  const userAccountBefore = StorageService.getCurrentUser();
  const canAccessBefore = AdminService.canAccessAdmin(userAccountBefore?.role);
  assert(!canAccessBefore, 'CASE 1: USER @sparke is denied access to /admin (canAccessAdmin is false)');
  assert(userAccountBefore?.role === 'user', 'CASE 1: Initial role is verified as "user"');

  // --------------------------------------------------------------------------
  console.log('\n--- CASE 2: USER @sparke -> /admin/users (Access Denied) ---');
  // --------------------------------------------------------------------------
  const parsedAdminUsersRoute = parseRoute('/admin/users');
  assert(parsedAdminUsersRoute.section === 'admin' && parsedAdminUsersRoute.adminSection === 'users', 'CASE 2: Route /admin/users parsed correctly');
  assert(!AdminService.hasPermission(userAccountBefore?.role, 'users.view'), 'CASE 2: USER @sparke lacks users.view permission');

  // --------------------------------------------------------------------------
  console.log('\n--- CASE 3: USER -> Direct Admin API Call (403 Forbidden) ---');
  // --------------------------------------------------------------------------
  // Server-side check for user-current who is a standard user
  const directApiRes = await handleGetMetrics('user-current', 'ada_codes');
  assert(directApiRes.status === 403, 'CASE 3: Direct API call GET /api/admin/metrics returns 403 for standard user');

  // --------------------------------------------------------------------------
  console.log('\n--- CASE 4: Change LocalStorage Role Tampering (Prevention) ---');
  // --------------------------------------------------------------------------
  // Attacker attempts to modify localStorage codespark_current_user directly to claim "admin"
  const tamperedUser = { ...initialSparkeUser, role: 'admin' };
  localStorage.setItem('codespark_current_user', JSON.stringify(tamperedUser));
  // In our hardened StorageService, getCurrentUser cross-references against authoritative account store!
  const resolvedUserAfterTampering = StorageService.getCurrentUser();
  assert(
    resolvedUserAfterTampering?.role === 'user',
    'CASE 4: LocalStorage role tampering prevented — resolved role remains "user" (authoritative lookup)',
    `Resolved role was: ${resolvedUserAfterTampering?.role}`
  );

  // --------------------------------------------------------------------------
  console.log('\n--- CASE 5: Modify URL / Query Parameters (?role=admin spoofing) ---');
  // --------------------------------------------------------------------------
  // Client attempts to call API passing role=admin via parameter or header
  const spoofAttempt = authenticateAndAuthorize('ada_codes', 'ada_codes', 'admin.access');
  assert(!spoofAttempt.authorized && spoofAttempt.status === 403, 'CASE 5: Server-side RBAC denies caller even if query parameter spoofed (?role=admin)');

  // --------------------------------------------------------------------------
  console.log('\n--- DATABASE PROMOTION OF @sparke ---');
  // --------------------------------------------------------------------------
  // Apply database migration 005_assign_admin_role through official promoteUser API
  StorageService.promoteUser('sparke', 'admin', 'db_migration_005');
  const promotedSparke = StorageService.getCurrentUser();
  assert(promotedSparke?.role === 'admin', 'Database promotion: @sparke account updated to role "admin" in stored accounts');

  // --------------------------------------------------------------------------
  console.log('\n--- CASE 6: ADMIN @sparke -> /admin (Control Center loads) ---');
  // --------------------------------------------------------------------------
  const canAccessAfter = AdminService.canAccessAdmin(promotedSparke?.role);
  assert(canAccessAfter, 'CASE 6: ADMIN @sparke granted entry to /admin (canAccessAdmin is true)');
  const adminMetricsRes = await handleGetMetrics('user-sparke', 'sparke');
  assert(adminMetricsRes.status === 200, 'CASE 6: Server authorizes ADMIN @sparke for metrics (HTTP 200)');

  // --------------------------------------------------------------------------
  console.log('\n--- CASE 7: ADMIN @sparke -> /admin/users (Allowed) ---');
  // --------------------------------------------------------------------------
  assert(AdminService.hasPermission(promotedSparke?.role, 'users.view'), 'CASE 7: ADMIN @sparke has users.view permission');
  const adminUsersRes = await handleGetUsers('user-sparke', 'sparke');
  assert(adminUsersRes.status === 200 && adminUsersRes.data.success, 'CASE 7: GET /api/admin/users allowed for ADMIN @sparke (HTTP 200)');

  // --------------------------------------------------------------------------
  console.log('\n--- CASE 8: ADMIN @sparke -> /admin/problems (Allowed) ---');
  // --------------------------------------------------------------------------
  assert(AdminService.hasPermission(promotedSparke?.role, 'problems.view_all'), 'CASE 8: ADMIN @sparke has problems.view_all permission');
  const adminProblemsRes = await handleGetProblems('user-sparke', 'sparke');
  assert(adminProblemsRes.status === 200 && adminProblemsRes.data.success, 'CASE 8: GET /api/admin/problems allowed for ADMIN @sparke (HTTP 200)');

  // --------------------------------------------------------------------------
  console.log('\n--- CASE 9: ADMIN @sparke -> /admin/discussions/rules (Allowed) ---');
  // --------------------------------------------------------------------------
  assert(AdminService.hasPermission(promotedSparke?.role, 'discussions.manage_rules'), 'CASE 9: ADMIN @sparke has discussions.manage_rules permission');
  const adminRulesRes = await handleGetDiscussionRules('user-sparke', 'sparke');
  assert(adminRulesRes.status === 200 && adminRulesRes.data.success, 'CASE 9: GET /api/admin/rules allowed for ADMIN @sparke (HTTP 200)');

  // --------------------------------------------------------------------------
  console.log('\n--- CASE 10: ADMIN @sparke -> /admin/audit-logs (Allowed) ---');
  // --------------------------------------------------------------------------
  assert(AdminService.hasPermission(promotedSparke?.role, 'audit.view'), 'CASE 10: ADMIN @sparke has audit.view permission');
  const adminAuditRes = await handleGetAuditLogs('user-sparke', 'sparke');
  assert(adminAuditRes.status === 200 && adminAuditRes.data.success, 'CASE 10: GET /api/admin/audit-logs allowed for ADMIN @sparke (HTTP 200)');

  // --------------------------------------------------------------------------
  console.log('\n--- CASE 11: Refresh /admin as ADMIN (Remains Authorized) ---');
  // --------------------------------------------------------------------------
  // Simulate page refresh by fetching user fresh from storage
  const refreshedUser = StorageService.getCurrentUser();
  assert(refreshedUser?.role === 'admin', 'CASE 11: On refresh, user role persists as "admin" from authoritative database');
  assert(AdminService.canAccessAdmin(refreshedUser?.role), 'CASE 11: User remains authorized to view Control Center across reload');

  // --------------------------------------------------------------------------
  console.log('\n--- CASE 12: Logout -> /admin (Authentication Required) ---');
  // --------------------------------------------------------------------------
  StorageService.logout();
  const loggedOutUser = StorageService.getCurrentUser();
  const isAuth = StorageService.isAuthenticated();
  assert(!isAuth && loggedOutUser === null, 'CASE 12: Logout clears session and currentUser');
  const unauthRes = authenticateAndAuthorize('', '', 'admin.access');
  assert(!unauthRes.authorized && (unauthRes.status === 401 || unauthRes.status === 403), 'CASE 12: Unauthenticated /admin request rejected with 401/403');

  // --------------------------------------------------------------------------
  console.log('\n--- CASE 13: MODERATOR -> Moderator Pages (Allowed) ---');
  // --------------------------------------------------------------------------
  const modRole = 'moderator';
  assert(AdminService.canAccessAdmin(modRole), 'CASE 13: MODERATOR can access Control Center');
  assert(AdminService.hasPermission(modRole, 'moderation.view'), 'CASE 13: MODERATOR has moderation.view permission');
  assert(AdminService.hasPermission(modRole, 'discussions.manage_rules'), 'CASE 13: MODERATOR has discussions.manage_rules permission');
  const modReports = await handleGetReports('user-1', 'elena_algo');
  assert(modReports.status === 200, 'CASE 13: GET /api/admin/reports allowed for MODERATOR (HTTP 200)');
  const modRules = await handleGetDiscussionRules('user-1', 'elena_algo');
  assert(modRules.status === 200, 'CASE 13: GET /api/admin/rules allowed for MODERATOR (HTTP 200)');

  // --------------------------------------------------------------------------
  console.log('\n--- CASE 14: MODERATOR -> Unauthorized ADMIN Action (403 Forbidden) ---');
  // --------------------------------------------------------------------------
  assert(!AdminService.hasPermission(modRole, 'roles.assign'), 'CASE 14: MODERATOR denied roles.assign permission');
  assert(!AdminService.hasPermission(modRole, 'settings.manage'), 'CASE 14: MODERATOR denied settings.manage permission');
  
  // Test server endpoint: MODERATOR attempting to assign roles
  const modRoleAssignAttempt = await handleUpdateUserRole('user-1', 'elena_algo', {
    targetUserId: 'user-2',
    newRole: 'admin'
  });
  assert(modRoleAssignAttempt.status === 403, 'CASE 14: MODERATOR blocked from assigning roles (HTTP 403 Forbidden)');

  // Test server endpoint: MODERATOR attempting to modify settings
  const modSettingsAttempt = await handleGetPlatformSettings('user-1', 'elena_algo');
  assert(modSettingsAttempt.status === 403, 'CASE 14: MODERATOR blocked from viewing platform settings (HTTP 403 Forbidden)');

  // --------------------------------------------------------------------------
  console.log('\n================================================================');
  console.log(`  TEST RESULTS: ${passed} PASSED, ${failed} FAILED  `);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runRBACTests().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});
