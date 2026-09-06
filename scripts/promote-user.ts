/**
 * CodeSpark Platform Control Center — Administrative Role Promotion CLI
 * 
 * Usage:
 *   npx tsx scripts/promote-user.ts <username> <role>
 * 
 * Example:
 *   npx tsx scripts/promote-user.ts sparke admin
 */

import { promoteUserInStore, usersStore, handleGetMetrics } from '../server/adminController.ts';
import { AdminRole } from '../src/types/admin.ts';

const args = process.argv.slice(2);
const username = args[0] || 'sparke';
const targetRole = (args[1] || 'admin') as AdminRole;

console.log('======================================================');
console.log('  CODESPARK CLI: SECURE USER ROLE PROMOTION SYSTEM   ');
console.log('======================================================\n');

if (!['user', 'moderator', 'admin'].includes(targetRole)) {
  console.error(`Error: Invalid role "${targetRole}". Must be one of: user, moderator, admin`);
  process.exit(1);
}

console.log(`Target Username : @${username}`);
console.log(`Requested Role  : ${targetRole.toUpperCase()}`);

const result = promoteUserInStore(username, targetRole, 'cli_admin');

if (result.success) {
  console.log(`\n✓ SUCCESS: User @${result.user.username} successfully assigned role '${result.user.role}'.`);
  console.log(`  Account ID    : ${result.user.id}`);
  console.log(`  Account Status: ${result.user.status}`);
  console.log(`  Audit Trail   : Appended immutable audit log entry.`);

  // Test admin verification immediately
  console.log('\nVerifying administrative privilege against server RBAC gate...');
  handleGetMetrics(result.user.id, result.user.username).then((testRes) => {
    if (testRes.status === 200) {
      console.log('✓ VERIFIED: Server-side RBAC allows Control Center access (HTTP 200).');
    } else {
      console.error(`✕ FAILED: Server returned HTTP ${testRes.status}`);
    }
  });
} else {
  console.error(`\n✕ FAILED: ${result.error}`);
  process.exit(1);
}
