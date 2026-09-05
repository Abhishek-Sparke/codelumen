import test from 'node:test';
import assert from 'node:assert/strict';

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:5173';

test('STEP 5 — Python Run API: Comprehensive Execution Tests', async (t) => {
  // 1. Correct solution produces successful results
  await t.test('5.1 Correct Python solution executes and passes public test cases', async () => {
    const payload = {
      problem_id: 'p-1',
      language: 'python',
      code: `
def pair_sum_target(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        comp = target - num
        if comp in seen:
            return [seen[comp], i]
        seen[num] = i
    return []
`
    };

    const res = await fetch(`${BASE_URL}/api/code/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.status, 'ACCEPTED');
    assert.equal(data.passed_test_cases, data.total_test_cases);
    assert.ok(data.runtime_ms >= 0);
  });

  // 2. Incorrect solution fails
  await t.test('5.2 Incorrect solution returns WRONG_ANSWER with failing case details', async () => {
    const payload = {
      problem_id: 'p-1',
      language: 'python',
      code: `
def pair_sum_target(nums, target):
    return [0, 0]
`
    };

    const res = await fetch(`${BASE_URL}/api/code/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.status, 'WRONG_ANSWER');
    assert.ok(data.passed_test_cases < data.total_test_cases);
  });

  // 3. Runtime error returns RUNTIME_ERROR
  await t.test('5.3 Runtime exception returns RUNTIME_ERROR without server paths', async () => {
    const payload = {
      problem_id: 'p-1',
      language: 'python',
      code: `
def pair_sum_target(nums, target):
    raise ZeroDivisionError("division by zero test")
`
    };

    const res = await fetch(`${BASE_URL}/api/code/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.status, 'RUNTIME_ERROR');
    assert.ok(data.error_message?.includes('ZeroDivisionError'));
    assert.ok(!data.error_message?.includes('C:\\Users\\'));
  });

  // 4. Infinite loop times out
  await t.test('5.4 Infinite loop triggers TIME_LIMIT_EXCEEDED within timeout', async () => {
    const payload = {
      problem_id: 'p-1',
      language: 'python',
      code: `
def pair_sum_target(nums, target):
    while True:
        pass
    return []
`
    };

    const start = Date.now();
    const res = await fetch(`${BASE_URL}/api/code/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const elapsed = Date.now() - start;

    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.status, 'TIME_LIMIT_EXCEEDED');
    assert.ok(elapsed >= 2000 && elapsed <= 5000, `Elapsed ${elapsed}ms out of range`);
  });

  // 5. Empty code returns compilation or runtime error
  await t.test('5.5 Empty code is rejected gracefully', async () => {
    const payload = {
      problem_id: 'p-1',
      language: 'python',
      code: ''
    };

    const res = await fetch(`${BASE_URL}/api/code/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    assert.ok(data.status === 'COMPILATION_ERROR' || data.status === 'SYSTEM_ERROR' || data.status === 'RUNTIME_ERROR');
  });

  // 6. Invalid syntax returns COMPILATION_ERROR
  await t.test('5.6 Syntax error returns COMPILATION_ERROR', async () => {
    const payload = {
      problem_id: 'p-1',
      language: 'python',
      code: `
def pair_sum_target(
    syntax error here!
`
    };

    const res = await fetch(`${BASE_URL}/api/code/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.status, 'COMPILATION_ERROR');
  });

  // 7. Large output is capped or terminated
  await t.test('5.7 Huge stdout output is bounded and handled safely', async () => {
    const payload = {
      problem_id: 'p-1',
      language: 'python',
      code: `
def pair_sum_target(nums, target):
    print("X" * 300000)
    return [0, 1]
`
    };

    const res = await fetch(`${BASE_URL}/api/code/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    assert.equal(res.status, 200);
    const data = await res.json();
    assert.ok(data.status === 'OUTPUT_LIMIT_EXCEEDED' || data.status === 'ACCEPTED' || data.status === 'WRONG_ANSWER');
  });
});
