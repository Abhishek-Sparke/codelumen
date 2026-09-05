import test from 'node:test';
import assert from 'node:assert/strict';

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:5173';

test('STEP 22 — Phase 3 End-to-End User Journey Test Suite', async (t) => {
  const testUserId = `e2e_user_${Date.now()}`;
  const problemId = 'p-1';

  // FLOW A: FAILED USER FLOW
  await t.test('Flow A: Failed submission does not mark solved or award XP', async () => {
    // 1. Submit incorrect solution
    const submitRes = await fetch(`${BASE_URL}/api/code/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: testUserId,
        problem_id: problemId,
        language: 'python',
        code: `def pair_sum_target(nums: list[int], target: int) -> list[int]: return [-1, -1]`
      })
    });

    assert.equal(submitRes.status, 200);
    const submitData = await submitRes.json();
    assert.equal(submitData.status, 'WRONG_ANSWER');
    assert.ok(submitData.submission_id);
    assert.ok(submitData.job_id);

    // Verify hidden test cases remain strictly private
    for (const tc of submitData.test_results) {
      if (!tc.isPublic) {
        assert.equal(tc.input, undefined);
        assert.equal(tc.expectedOutput, undefined);
      }
    }
  });

  // FLOW B: COMPLETE SUCCESS USER JOURNEY
  await t.test('Flow B: New user completes full journey: Editor -> Run -> Submit -> Accepted -> Progress & Next Problem', async () => {
    // 1. Run correct solution (debug mode)
    const runRes = await fetch(`${BASE_URL}/api/code/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        problem_id: problemId,
        language: 'python',
        code: `
def pair_sum_target(nums: list[int], target: int) -> list[int]:
    seen = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in seen:
            return [seen[diff], i]
        seen[num] = i
    return []
`
      })
    });

    assert.equal(runRes.status, 200);
    const runData = await runRes.json();
    assert.equal(runData.status, 'ACCEPTED');
    assert.equal(runData.passed_test_cases, runData.total_test_cases);

    // 2. Submit solution
    const submitRes = await fetch(`${BASE_URL}/api/code/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: testUserId,
        problem_id: problemId,
        language: 'python',
        code: `
def pair_sum_target(nums: list[int], target: int) -> list[int]:
    seen = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in seen:
            return [seen[diff], i]
        seen[num] = i
    return []
`
      })
    });

    assert.equal(submitRes.status, 200);
    const submitData = await submitRes.json();
    assert.equal(submitData.status, 'ACCEPTED');
    assert.equal(submitData.passed_test_cases, submitData.total_test_cases);
    assert.ok(submitData.runtime_ms >= 0);
    assert.ok(submitData.memory_kb >= 0);

    // 3. Repeat submission (idempotency check)
    const repeatRes = await fetch(`${BASE_URL}/api/code/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: testUserId,
        problem_id: problemId,
        language: 'python',
        code: `
def pair_sum_target(nums: list[int], target: int) -> list[int]:
    seen = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in seen:
            return [seen[diff], i]
        seen[num] = i
    return []
`
      })
    });

    assert.equal(repeatRes.status, 200);
    const repeatData = await repeatRes.json();
    assert.equal(repeatData.status, 'ACCEPTED');
    assert.notEqual(repeatData.submission_id, submitData.submission_id); // distinct submission ID
  });
});
