import test from 'node:test';
import assert from 'node:assert/strict';

// In-memory draft store simulating DraftService
class MockDraftService {
  constructor() {
    this.store = new Map();
  }

  saveDraft(userId, problemId, language, code) {
    if (!userId || !problemId || !language) return false;
    const key = `${userId}_${problemId}_${language}`;
    this.store.set(key, { code, updatedAt: Date.now() });
    return true;
  }

  getDraft(userId, problemId, language) {
    if (!userId || !problemId || !language) return null;
    const key = `${userId}_${problemId}_${language}`;
    const record = this.store.get(key);
    return record ? record.code : null;
  }
}

test('STEP 17 — Draft Autosave & Isolation Tests', async (t) => {
  const service = new MockDraftService();

  await t.test('17.1 Save and retrieve draft', () => {
    service.saveDraft('user-1', 'two-sum', 'python', 'print("hello")');
    assert.equal(service.getDraft('user-1', 'two-sum', 'python'), 'print("hello")');
  });

  await t.test('17.2 Language drafts are strictly isolated', () => {
    service.saveDraft('user-1', 'two-sum', 'python', '# python code');
    service.saveDraft('user-1', 'two-sum', 'javascript', '// js code');

    assert.equal(service.getDraft('user-1', 'two-sum', 'python'), '# python code');
    assert.equal(service.getDraft('user-1', 'two-sum', 'javascript'), '// js code');
  });

  await t.test('17.3 Cross-user drafts are isolated', () => {
    service.saveDraft('user-A', 'two-sum', 'python', 'code A');
    service.saveDraft('user-B', 'two-sum', 'python', 'code B');

    assert.equal(service.getDraft('user-A', 'two-sum', 'python'), 'code A');
    assert.equal(service.getDraft('user-B', 'two-sum', 'python'), 'code B');
  });

  await t.test('17.4 Unsaved problem returns null', () => {
    assert.equal(service.getDraft('user-1', 'unknown-prob', 'python'), null);
  });
});
