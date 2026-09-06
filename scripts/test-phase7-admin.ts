import {
  verifyPermission,
  isLastAdmin,
  handleGetMetrics,
  handleGetUsers,
  handleUpdateUserRole,
  handleUpdateUserStatus,
  handleGetReports,
  handleResolveReport,
  handleGetDiscussionRules,
  handleSaveDiscussionRulesDraft,
  handlePublishDiscussionRules,
  handleRollbackDiscussionRules,
  handleGetProblems,
  handlePublishProblem,
  handleArchiveProblem,
  handleGetPlatformSettings,
  handleUpdatePlatformSettings,
  handleGetAuditLogs
} from '../server/adminController.ts';
import { AdminRole, AdminPermission } from '../src/types/admin.ts';

async function runPhase7Tests() {
  console.log('====================================================');
  console.log('  CODESPARK PHASE 7: ADMIN & MODERATION TEST SUITE  ');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, errorMsg?: string) {
    if (condition) {
      console.log(`  ✓ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ✕ FAIL: ${testName}`);
      if (errorMsg) console.error(`    Details: ${errorMsg}`);
      failed++;
    }
  }

  // TEST 1: RBAC Permission Verification
  console.log('--- 1. RBAC PERMISSION MATRIX ---');
  assert(!verifyPermission('user', 'admin.access'), 'Standard user denied admin.access');
  assert(!verifyPermission('user', 'users.manage'), 'Standard user denied users.manage');
  assert(!verifyPermission('user', 'moderation.view'), 'Standard user denied moderation.view');

  assert(verifyPermission('moderator', 'admin.access'), 'Moderator granted admin.access');
  assert(verifyPermission('moderator', 'moderation.view'), 'Moderator granted moderation.view');
  assert(verifyPermission('moderator', 'moderation.resolve'), 'Moderator granted moderation.resolve');
  assert(verifyPermission('moderator', 'discussions.manage_rules'), 'Moderator granted discussions.manage_rules');
  assert(!verifyPermission('moderator', 'roles.assign'), 'Moderator strictly denied roles.assign');
  assert(!verifyPermission('moderator', 'settings.manage'), 'Moderator strictly denied settings.manage');

  assert(verifyPermission('admin', 'admin.access'), 'Admin granted admin.access');
  assert(verifyPermission('admin', 'roles.assign'), 'Admin granted roles.assign');
  assert(verifyPermission('admin', 'settings.manage'), 'Admin granted settings.manage');
  assert(verifyPermission('admin', 'audit.view'), 'Admin granted audit.view');

  // TEST 2: Endpoint Access Enforcement
  console.log('\n--- 2. ENDPOINT ROLE RESTRICTIONS (ZERO-TRUST) ---');
  const userMetrics = await handleGetMetrics('user', 'user-current');
  assert(userMetrics.status === 403, 'GET /api/admin/metrics returns 403 for role user');

  const modUsers = await handleGetUsers('moderator', 'user-1');
  assert(modUsers.status === 403, 'GET /api/admin/users returns 403 for role moderator');

  const adminMetrics = await handleGetMetrics('admin', 'user-10');
  assert(adminMetrics.status === 200 && adminMetrics.data.success, 'GET /api/admin/metrics returns 200 for role admin');

  // TEST 3: Last-Admin Lockout Guard
  console.log('\n--- 3. LAST-ADMIN LOCKOUT GUARD ---');
  // Attempt to demote the only admin
  const demoteAttempt = await handleUpdateUserRole(
    'admin',
    'user-10',
    'codespark_admin',
    { targetUserId: 'user-10', newRole: 'user' }
  );
  assert(
    demoteAttempt.status === 400 && demoteAttempt.data.error.includes('last remaining platform administrator'),
    'Demoting the sole platform administrator is strictly blocked with 400 error',
    demoteAttempt.data?.error
  );

  // Attempt to ban the only admin
  const banAttempt = await handleUpdateUserStatus(
    'admin',
    'user-10',
    'codespark_admin',
    { targetUserId: 'user-10', newStatus: 'banned', reason: 'Malicious test' }
  );
  assert(
    banAttempt.status === 400 && banAttempt.data.error.includes('last remaining platform administrator'),
    'Suspending/banning the sole platform administrator is strictly blocked with 400 error',
    banAttempt.data?.error
  );

  // Successfully change role of a non-admin
  const validRoleChange = await handleUpdateUserRole(
    'admin',
    'user-10',
    'codespark_admin',
    { targetUserId: 'user-2', newRole: 'moderator' }
  );
  assert(validRoleChange.status === 200 && validRoleChange.data.success, 'Valid role change for standard user succeeds');

  // TEST 4: Moderation Queue & Resolution
  console.log('\n--- 4. MODERATION QUEUE & RESOLUTION ---');
  const reportsRes = await handleGetReports('moderator', 'user-1');
  assert(reportsRes.status === 200 && reportsRes.data.reports.length >= 2, 'Moderator can inspect pending reports queue');

  const resolveRes = await handleResolveReport(
    'moderator',
    'user-1',
    'elena_algo',
    { reportId: 'rep-1', actionTaken: 'content_hidden', modNotes: 'Confirmed external affiliate spam link' }
  );
  assert(
    resolveRes.status === 200 && resolveRes.data.report.status === 'resolved',
    'Moderator can resolve report with action and notes'
  );

  // TEST 5: Discussion Rules CMS (Draft, Publish, Rollback)
  console.log('\n--- 5. DISCUSSION RULES CMS (DRAFT, PUBLISH, ROLLBACK) ---');
  const getRulesRes = await handleGetDiscussionRules('moderator', 'user-1');
  assert(getRulesRes.status === 200 && getRulesRes.data.currentPublished.version === 1, 'Can fetch published Discussion Rules v1');

  // Save draft v2
  const draftRes = await handleSaveDiscussionRulesDraft(
    'moderator',
    'user-1',
    'elena_algo',
    {
      title: 'CodeSpark Community Conduct Rules v2',
      contentMarkdown: '# Updated Rules\n\nRule 1: Always be helpful.\nRule 2: No answer dumping.',
      changeSummary: 'Clarified anti-cheating policy'
    }
  );
  assert(draftRes.status === 200 && draftRes.data.draft.status === 'draft', 'Saved draft for Discussion Rules v2');

  // Publish v2
  const pubRes = await handlePublishDiscussionRules(
    'moderator',
    'user-1',
    'elena_algo',
    { revisionId: draftRes.data.draft.id }
  );
  assert(pubRes.status === 200 && pubRes.data.published.status === 'published', 'Published Discussion Rules v2 live');

  // Rollback to v1
  const rollbackRes = await handleRollbackDiscussionRules(
    'moderator',
    'user-1',
    'elena_algo',
    { targetVersion: 1 }
  );
  assert(
    rollbackRes.status === 200 && rollbackRes.data.published.version === 3,
    'Rollback to v1 created new published revision v3'
  );

  // TEST 6: Problem Lifecycle (Draft -> Published -> Archived)
  console.log('\n--- 6. PROBLEM LIFECYCLE MANAGEMENT ---');
  const problemsRes = await handleGetProblems('admin', 'user-10');
  assert(problemsRes.status === 200 && problemsRes.data.problems.length > 0, 'Admin can view all problems with lifecycles');

  const archiveRes = await handleArchiveProblem('admin', 'user-10', 'codespark_admin', { problemId: 'p-1' });
  assert(archiveRes.status === 200 && archiveRes.data.lifecycleState === 'archived', 'Archived problem p-1');

  const republishRes = await handlePublishProblem('admin', 'user-10', 'codespark_admin', { problemId: 'p-1' });
  assert(republishRes.status === 200 && republishRes.data.lifecycleState === 'published', 'Republished problem p-1');

  // TEST 7: Platform Settings & Feature Flags
  console.log('\n--- 7. PLATFORM SETTINGS & FEATURE FLAGS ---');
  const getSettings = await handleGetPlatformSettings('admin', 'user-10');
  assert(getSettings.status === 200 && getSettings.data.settings.siteName === 'CodeSpark', 'Retrieved platform settings');

  const updateSettings = await handleUpdatePlatformSettings(
    'admin',
    'user-10',
    'codespark_admin',
    {
      updates: {
        sparkAiRateLimitPerMin: 25,
        featureFlags: { 'interview_simulations': false }
      }
    }
  );
  assert(
    updateSettings.status === 200 && updateSettings.data.settings.sparkAiRateLimitPerMin === 25,
    'Updated Spark AI rate limit and feature flag'
  );

  // TEST 8: Immutable Audit Trail Logging
  console.log('\n--- 8. IMMUTABLE AUDIT TRAIL ---');
  const auditLogsRes = await handleGetAuditLogs('admin', 'user-10', { limit: 50 });
  assert(auditLogsRes.status === 200 && auditLogsRes.data.logs.length >= 6, 'Audit logs recorded all privileged mutations');

  const actionsRecorded = auditLogsRes.data.logs.map((l: any) => l.action);
  assert(actionsRecorded.includes('RULES_PUBLISHED'), 'Audit log contains RULES_PUBLISHED');
  assert(actionsRecorded.includes('RULES_ROLLBACK'), 'Audit log contains RULES_ROLLBACK');
  assert(actionsRecorded.includes('REPORT_RESOLVED'), 'Audit log contains REPORT_RESOLVED');
  assert(actionsRecorded.includes('PROBLEM_ARCHIVED'), 'Audit log contains PROBLEM_ARCHIVED');
  assert(actionsRecorded.includes('PLATFORM_SETTINGS_UPDATED'), 'Audit log contains PLATFORM_SETTINGS_UPDATED');

  console.log('\n====================================================');
  console.log(`  RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runPhase7Tests().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
