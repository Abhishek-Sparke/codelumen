// Test script to verify CodeSpark routing logic and route parsing
import { parseRoute, getCanonicalPath } from '../src/router/router.ts';
import { ProblemDatabase } from '../src/services/problemDatabase.ts';
import { ForumService } from '../src/services/forumService.ts';
import { StorageService } from '../src/services/storage.ts';

console.log('=== RUNNING CODESPARK ROUTING TESTS ===\n');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✅ PASS: ${message}`);
    passed++;
  } else {
    console.error(`❌ FAIL: ${message}`);
    failed++;
  }
}

// 1. Core Route Parsing
const coreRoutes = [
  ['/', 'landing'],
  ['/problems', 'problems'],
  ['/problems/saved', 'saved-problems'],
  ['/roadmap', 'roadmaps'],
  ['/patterns', 'patterns'],
  ['/study-plans', 'patterns'],
  ['/contests', 'contests'],
  ['/discussions', 'discuss'],
  ['/profile', 'profile'],
  ['/dashboard', 'dashboard'],
  ['/leaderboard', 'leaderboard'],
  ['/submissions', 'submissions'],
  ['/settings', 'settings'],
  ['/admin', 'admin']
];

for (const [path, expectedSection] of coreRoutes) {
  const route = parseRoute(path);
  assert(route.section === expectedSection, `Route "${path}" maps to section "${expectedSection}"`);
}

// 2. Dynamic Problem Routes & Lookups
const problemRoute = parseRoute('/problems/two-sum-indices');
assert(problemRoute.section === 'workspace' && problemRoute.slug === 'two-sum-indices', 'Dynamic problem route parses slug "two-sum-indices"');

const problemLookup1 = ProblemDatabase.getProblemBySlug('two-sum-indices');
assert(problemLookup1 && problemLookup1.id === 'p-1', 'ProblemDatabase resolves "two-sum-indices" to Problem 1');

const problemLookupAlias = ProblemDatabase.getProblemBySlug('two-sum');
assert(problemLookupAlias && problemLookupAlias.id === 'p-1', 'ProblemDatabase resolves alias "two-sum" to Problem 1');

const problemLookupMissing = ProblemDatabase.getProblemBySlug('does-not-exist-xyz');
assert(problemLookupMissing === undefined, 'ProblemDatabase safely returns undefined for non-existent slug');

// 3. Discussion Rules Route
const rulesRoute = parseRoute('/discussions/rules');
assert(rulesRoute.section === 'discuss' && rulesRoute.subType === 'rules' && rulesRoute.slug === 'rules', 'Discussion rules route "/discussions/rules" parsed correctly');

const rulesThread = ForumService.getThreadByIdOrSlug('rules');
assert(rulesThread && rulesThread.system_type === 'discussion_rules', 'ForumService resolves Discussion Rules thread');

// 4. Discussion Categories
const catRoute = parseRoute('/discussions/category/dsa');
assert(catRoute.section === 'discuss' && catRoute.subType === 'category' && catRoute.categorySlug === 'dsa', 'Discussion category route "/discussions/category/dsa" parsed correctly');

const catLookup = ForumService.getCategoryByIdOrSlug('dsa');
assert(catLookup && catLookup.id === 'cat-dsa', 'ForumService resolves category "dsa"');

const catLookupMissing = ForumService.getCategoryByIdOrSlug('non-existent-category');
assert(catLookupMissing === undefined, 'ForumService safely returns undefined for invalid category');

// 5. Discussion Threads
const threadRoute = parseRoute('/discussions/visualizing-monotonic-stack');
assert(threadRoute.section === 'discuss' && threadRoute.subType === 'thread' && threadRoute.slug === 'visualizing-monotonic-stack', 'Discussion thread route parsed correctly');

const threadLookup = ForumService.getThreadByIdOrSlug('visualizing-monotonic-stack');
assert(threadLookup && threadLookup.id === 'disc-1', 'ForumService resolves thread slug "visualizing-monotonic-stack"');

// 6. Profiles
const profileRoute = parseRoute('/profile/ada_codes');
assert(profileRoute.section === 'profile' && profileRoute.slug === 'ada_codes', 'Profile route "/profile/ada_codes" parsed correctly');

const profileLookup = StorageService.getUserByUsernameOrId('ada_codes');
assert(profileLookup && profileLookup.username === 'ada_codes', 'StorageService resolves user by username "ada_codes"');

const profileLookupMissing = StorageService.getUserByUsernameOrId('non-existent-user-1234');
assert(!profileLookupMissing, 'StorageService safely returns null for unknown user');

// 7. Unknown/404 Routes
const unknownRoute = parseRoute('/unknown/random/deep/path');
assert(unknownRoute.section === 'not-found' && unknownRoute.isNotFound === true, 'Unknown route is detected as 404');

// 8. Canonical URL Helpers
assert(getCanonicalPath('workspace', 'two-sum-indices') === '/problems/two-sum-indices', 'getCanonicalPath converts workspace to /problems/:slug');
assert(getCanonicalPath('discuss', 'rules') === '/discussions/rules', 'getCanonicalPath converts discuss rules to /discussions/rules');
assert(getCanonicalPath('discuss', 'category:dsa') === '/discussions/category/dsa', 'getCanonicalPath converts category to /discussions/category/dsa');
assert(getCanonicalPath('problems') === '/problems', 'getCanonicalPath converts problems to /problems');
assert(getCanonicalPath('problems', 'saved') === '/problems/saved', 'getCanonicalPath converts saved problems to /problems/saved');

console.log(`\n===================================`);
console.log(`TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
console.log(`===================================\n`);

if (failed > 0) process.exit(1);
