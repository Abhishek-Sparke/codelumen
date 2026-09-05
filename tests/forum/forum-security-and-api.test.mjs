import assert from 'node:assert/strict';
import { SecuritySanitizer } from '../../src/services/securitySanitizer.ts';
import {
  handleGetCategories,
  handleGetDiscussions,
  handleGetDiscussionBySlug,
  handleCreateDiscussion,
  handleCreateReply,
  handleToggleReaction,
  handleAcceptAnswer,
  handleModerationAction,
  handleToggleWatch,
  handleToggleBookmark
} from '../../server/forumController.ts';

console.log('--- RUNNING PHASE 4 FORUM TESTS ---');

// 1. SECURITY & SANITIZATION TESTS
console.log('Test 1: HTML Entity Escaping & XSS Prevention');
const maliciousInput = '<script>alert("xss")</script><img src="x" onerror="alert(1)"><b>hello</b>';
const escaped = SecuritySanitizer.escapeHtml(maliciousInput);
assert(!escaped.includes('<script>'), 'Failed: <script> was not escaped');
assert(escaped.includes('&lt;script&gt;'), 'Failed: script open tag not escaped');
const stripped = SecuritySanitizer.stripUnsafeHtml(maliciousInput);
assert(!stripped.includes('<script>'), 'Failed: script tag not stripped');
assert(!stripped.includes('onerror'), 'Failed: onerror handler not stripped');
console.log('✓ XSS HTML entity escaping and tag stripping verified.');

console.log('Test 2: Safe URL Validation');
assert(SecuritySanitizer.isSafeUrl('https://codespark.dev'), 'Failed: valid https was rejected');
assert(SecuritySanitizer.isSafeUrl('/discussions/python'), 'Failed: relative path was rejected');
assert(!SecuritySanitizer.isSafeUrl('javascript:alert(1)'), 'Failed: javascript: URL was accepted');
assert(!SecuritySanitizer.isSafeUrl('data:text/html,<script>'), 'Failed: data: URL was accepted');
assert(!SecuritySanitizer.isSafeUrl('vbscript:msgbox(1)'), 'Failed: vbscript: URL was accepted');
console.log('✓ Safe URL validation verified.');

console.log('Test 3: Recursive Quote Nesting Limiter');
const deepQuote = '> > > > > 5-level deep quote';
const limited = SecuritySanitizer.limitQuoteNesting(deepQuote, 2);
const depth = (limited.match(/>/g) || []).length;
assert(depth <= 2, `Failed: quote depth ${depth} exceeded max limit of 2`);
console.log('✓ Quote depth limit verified.');

console.log('Test 4: Tokenized Code Syntax Highlighting');
const pythonCode = 'def solve(nums):\n    # Calculate\n    return "solved"';
const tokens = SecuritySanitizer.tokenizeCode(pythonCode, 'python');
assert(tokens.some(t => t.type === 'keyword' && t.text === 'def'), 'Failed: python def keyword missing');
assert(tokens.some(t => t.type === 'keyword' && t.text === 'return'), 'Failed: python return keyword missing');
assert(tokens.some(t => t.type === 'comment'), 'Failed: python comment token missing');
assert(tokens.some(t => t.type === 'string' && t.text === '"solved"'), 'Failed: python string token missing');
console.log('✓ Tokenized syntax highlighting verified.');

// 2. SERVER CONTROLLER & DISCUSSION API TESTS
console.log('Test 5: Get Categories with Dynamic Counts');
const catRes = await handleGetCategories();
assert(catRes.success, 'Failed: categories retrieval was not successful');
assert(catRes.categories.length === 17, `Failed: expected 17 categories, got ${catRes.categories.length}`);
assert(catRes.sections.length === 4, `Failed: expected 4 sections, got ${catRes.sections.length}`);
console.log('✓ Category hierarchy and count calculation verified.');

console.log('Test 6: Paginated Discussions Listing');
const discRes = await handleGetDiscussions({ page: 1, limit: 20 });
assert(discRes.success, 'Failed: discussions list retrieval failed');
assert(discRes.result.threads.length <= 20, 'Failed: page limit of 20 exceeded');
assert(discRes.result.totalPages >= 1, 'Failed: invalid total pages');
console.log('✓ 20 per page discussions pagination verified.');

console.log('Test 7: Create Discussion with Validation');
const shortTitleRes = await handleCreateDiscussion({
  title: 'Hey',
  content: 'Too short discussion text',
  categoryId: 'cat-dsa',
  tags: ['test'],
  author: { id: 'test-user-1', name: 'Tester', username: 'tester', avatar: '' }
}, 'test-user-1');
assert(!shortTitleRes.success, 'Failed: short title was accepted');
assert(shortTitleRes.error.includes('Title must be at least 5'), 'Failed: expected title validation error');

const validRes = await handleCreateDiscussion({
  title: 'Optimal Approach to Finding Longest Palindromic Substring',
  content: 'Here is a comprehensive 3-pointer expansion method with detailed amortized time complexity proof.',
  categoryId: 'cat-algorithms',
  tags: ['Algorithms', 'Strings'],
  author: { id: 'test-user-1', name: 'Tester', username: 'tester', avatar: '', xp: 500 }
}, 'test-user-1');
assert(validRes.success, 'Failed: valid discussion creation rejected');
assert(validRes.thread.slug.includes('optimal-approach'), 'Failed: slug not generated');
const testThreadSlug = validRes.thread.slug;
console.log('✓ Discussion validation and slug generation verified.');

console.log('Test 8: Add Reply to Open Discussion');
const replyRes = await handleCreateReply(testThreadSlug, {
  content: 'Great writeup! Have you benchmarked this against Manacher algorithm?',
  author: { id: 'test-user-2', name: 'Replier', username: 'replier', avatar: '' }
}, 'test-user-2');
assert(replyRes.success, 'Failed: valid reply rejected');
assert(replyRes.reply.postNumber === 2, `Failed: expected post #2, got #${replyRes.reply.postNumber}`);
const testReplyId = replyRes.reply.id;
console.log('✓ Sequential post numbering and reply creation verified.');

console.log('Test 9: Reactions Single-Choice Rule (Like/Love/Helpful/Great)');
const reactLike = await handleToggleReaction(testThreadSlug, testReplyId, 'like', 'user-voter-1');
assert(reactLike.success, 'Failed: like reaction rejected');
assert(reactLike.reactions.like.includes('user-voter-1'), 'Failed: user not in like bucket');

// Switching to helpful must remove like (single reaction rule)
const reactHelpful = await handleToggleReaction(testThreadSlug, testReplyId, 'helpful', 'user-voter-1');
assert(reactHelpful.success, 'Failed: helpful reaction rejected');
assert(reactHelpful.reactions.helpful.includes('user-voter-1'), 'Failed: user not in helpful bucket');
assert(!reactHelpful.reactions.like.includes('user-voter-1'), 'Failed: user was not removed from like bucket when switching');
console.log('✓ Single reaction per user toggle/switch verified.');

console.log('Test 10: Accepted Answer Authorization');
// Random user cannot accept answer
const unauthorizedAccept = await handleAcceptAnswer(testThreadSlug, testReplyId, 'random-user', 'user');
assert(!unauthorizedAccept.success, 'Failed: unauthorized user was allowed to accept answer');
assert(unauthorizedAccept.error.includes('Forbidden'), 'Failed: expected Forbidden error');

// Author can accept answer
const authorAccept = await handleAcceptAnswer(testThreadSlug, testReplyId, 'test-user-1', 'user');
assert(authorAccept.success, 'Failed: author could not accept answer');
assert(authorAccept.isSolved === true, 'Failed: thread isSolved not set to true');
assert(authorAccept.acceptedPostId === testReplyId, 'Failed: acceptedPostId not set');
console.log('✓ Accepted answer authorization and solved state verified.');

console.log('Test 11: Moderator Controls (Lock/Unlock)');
// Lock thread
const lockRes = await handleModerationAction(testThreadSlug, { action: 'lock' }, 'admin-1', 'admin');
assert(lockRes.success, 'Failed: moderator lock failed');
assert(lockRes.thread.isLocked === true, 'Failed: isLocked not true');

// Submitting reply to locked thread must be rejected server-side
const lockedReplyRes = await handleCreateReply(testThreadSlug, {
  content: 'Attempting to reply to a locked thread...',
  author: { id: 'test-user-3', name: 'User 3', username: 'user3', avatar: '' }
}, 'test-user-3');
assert(!lockedReplyRes.success, 'Failed: reply was accepted on a locked thread');
assert(lockedReplyRes.error.includes('locked'), 'Failed: expected locked thread rejection');
console.log('✓ Moderator locking and server-side reply rejection on locked thread verified.');

console.log('Test 12: Watch & Bookmark Toggles');
const watchRes = await handleToggleWatch(testThreadSlug, 'test-user-1');
assert(watchRes.success, 'Failed: watch toggle failed');
const bookmarkRes = await handleToggleBookmark(testThreadSlug, 'test-user-1');
assert(bookmarkRes.success, 'Failed: bookmark toggle failed');
assert(bookmarkRes.isBookmarked === true, 'Failed: expected thread to be bookmarked');
console.log('✓ Watch and bookmark toggles verified.');

console.log('\n===========================================');
console.log('ALL PHASE 4 FORUM TESTS PASSED (12/12) ✓');
console.log('===========================================');
