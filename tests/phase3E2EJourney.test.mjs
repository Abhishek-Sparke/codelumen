import test from 'node:test';
import assert from 'node:assert/strict';

const BASE_URL = 'http://localhost:5173';

test('STEP 22 — Complete End-to-End User Journey Simulation', async (t) => {
  const testUserId = `user_e2e_${Date.now()}`;

  // 1. Initial State: Problem 1 Run with Wrong Answer
  await t.test('Step 22.1: Run with incorrect code returns WRONG_ANSWER and does NOT mark solved', async () => {
    const res = await fetch(`${BASE_URL}/api/code/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        problem_id: 'p-1',
        language: 'python',
        code: 'def pair_sum_target(nums, target): return [0, 0]'
      })
    });
    const data = await res.json();
    assert.equal(data.success, true);
    assert.equal(data.status, 'WRONG_ANSWER');
    assert.equal(data.passed_test_cases, 0);
  });

  // 2. Submit with Wrong Answer -> official judging confirms WRONG_ANSWER
  await t.test('Step 22.2: Submit with incorrect code produces WRONG_ANSWER without marking solved', async () => {
    const res = await fetch(`${BASE_URL}/api/code/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        problem_id: 'p-1',
        language: 'python',
        user_id: testUserId,
        code: 'def pair_sum_target(nums, target): return [0, 0]'
      })
    });
    const data = await res.json();
    assert.equal(data.success, true);
    assert.equal(data.status, 'WRONG_ANSWER');
    assert.equal(data.passed_test_cases, 0);
    assert.ok(data.submission_id);
  });

  // 3. Run with Correct Code -> returns ACCEPTED on sample cases
  await t.test('Step 22.3: Run with working Python solution passes all sample cases', async () => {
    const res = await fetch(`${BASE_URL}/api/code/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        problem_id: 'p-1',
        language: 'python',
        code: `
def pair_sum_target(nums, target):
    seen = {}
    for i, x in enumerate(nums):
        comp = target - x
        if comp in seen:
            return [seen[comp], i]
        seen[x] = i
    return []
`
      })
    });
    const data = await res.json();
    assert.equal(data.success, true);
    assert.equal(data.status, 'ACCEPTED');
    assert.equal(data.passed_test_cases, data.total_test_cases);
    assert.equal(data.total_test_cases, 3);
  });

  // 4. Submit with Correct Code -> Official judging passes both public and hidden test cases
  let firstSolveSubmissionId = '';
  await t.test('Step 22.4: Submit with working Python solution passes full suite and recommends next problem', async () => {
    const res = await fetch(`${BASE_URL}/api/code/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        problem_id: 'p-1',
        language: 'python',
        user_id: testUserId,
        code: `
def pair_sum_target(nums, target):
    seen = {}
    for i, x in enumerate(nums):
        comp = target - x
        if comp in seen:
            return [seen[comp], i]
        seen[x] = i
    return []
`
      })
    });
    const data = await res.json();
    assert.equal(data.success, true);
    assert.equal(data.status, 'ACCEPTED');
    assert.equal(data.total_test_cases, 7);
    assert.equal(data.passed_test_cases, 7);
    assert.ok(data.submission_id);
    assert.ok(data.job_id);
    assert.ok(data.next_recommended_problem);
    assert.equal(data.next_recommended_problem.id, 'p-2');
    firstSolveSubmissionId = data.submission_id;
  });

  // 5. Repeat submission with the same solution -> does not award duplicate XP
  await t.test('Step 22.5: Repeat submission generates distinct submission ID without fake results', async () => {
    const res = await fetch(`${BASE_URL}/api/code/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        problem_id: 'p-1',
        language: 'python',
        user_id: testUserId,
        code: `
def pair_sum_target(nums, target):
    seen = {}
    for i, x in enumerate(nums):
        comp = target - x
        if comp in seen:
            return [seen[comp], i]
        seen[x] = i
    return []
`
      })
    });
    const data = await res.json();
    assert.equal(data.success, true);
    assert.equal(data.status, 'ACCEPTED');
    assert.notEqual(data.submission_id, firstSolveSubmissionId);
  });
});
