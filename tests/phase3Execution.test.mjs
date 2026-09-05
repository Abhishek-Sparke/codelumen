import test from 'node:test';
import assert from 'node:assert/strict';

const BASE_URL = 'http://localhost:5173';

async function runCode(body) {
  const res = await fetch(`${BASE_URL}/api/code/run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  return res.json();
}

async function submitCode(body) {
  const res = await fetch(`${BASE_URL}/api/code/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  return res.json();
}

test('1. Valid Python solution returns ACCEPTED with test results', async () => {
  const result = await runCode({
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
  });

  assert.equal(result.success, true);
  assert.equal(result.status, 'ACCEPTED');
  assert.equal(result.passed_test_cases, result.total_test_cases);
  assert.ok(result.runtime_ms >= 0);
  assert.ok(result.memory_kb >= 0);
  assert.equal(result.test_results.length, 3);
  assert.equal(result.test_results.every(r => r.passed), true);
});

test('2. Wrong answer returns WRONG_ANSWER with failing case details', async () => {
  const result = await runCode({
    problem_id: 'p-1',
    language: 'python',
    code: `
def pair_sum_target(nums, target):
    return [0, 0]
`
  });

  assert.equal(result.success, true);
  assert.equal(result.status, 'WRONG_ANSWER');
  assert.equal(result.passed_test_cases, 0);
  assert.equal(result.test_results[0].passed, false);
  assert.deepEqual(result.test_results[0].actualOutput, [0, 0]);
});

test('3. Runtime error returns RUNTIME_ERROR without exposing server paths', async () => {
  const result = await runCode({
    problem_id: 'p-1',
    language: 'python',
    code: `
def pair_sum_target(nums, target):
    return 10 / 0
`
  });

  assert.equal(result.success, true);
  assert.equal(result.status, 'RUNTIME_ERROR');
  assert.match(result.error_message, /ZeroDivisionError/);
  assert.doesNotMatch(result.error_message, /Users\\abhis/i);
});

test('4. Syntax error returns COMPILATION_ERROR', async () => {
  const result = await runCode({
    problem_id: 'p-1',
    language: 'python',
    code: `
def pair_sum_target(nums, target)
    return []
`
  });

  assert.equal(result.success, true);
  assert.equal(result.status, 'COMPILATION_ERROR');
  assert.match(result.error_message, /SyntaxError/);
});

test('5. Infinite loop triggers TIME_LIMIT_EXCEEDED', async () => {
  const result = await runCode({
    problem_id: 'p-1',
    language: 'python',
    code: `
def pair_sum_target(nums, target):
    while True:
        pass
`
  });

  assert.equal(result.success, true);
  assert.equal(result.status, 'TIME_LIMIT_EXCEEDED');
  assert.match(result.error_message, /timed out/i);
});

test('6. Hidden test cases in Submit remain strictly private', async () => {
  const result = await submitCode({
    problem_id: 'p-1',
    language: 'python',
    user_id: 'usr_test_1',
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
  });

  assert.equal(result.success, true);
  assert.equal(result.status, 'ACCEPTED');
  assert.equal(result.total_test_cases, 7); // 3 public + 4 hidden
  assert.equal(result.passed_test_cases, 7);
  assert.ok(result.submission_id);
  assert.ok(result.job_id);

  // Hidden test case data must be completely omitted
  const hiddenResults = result.test_results.filter(r => !r.isPublic);
  assert.ok(hiddenResults.length >= 4);
  for (const hr of hiddenResults) {
    assert.equal(hr.isPublic, false);
    assert.equal(hr.expectedOutput, undefined);
    assert.equal(hr.input, undefined);
    assert.equal(hr.actualOutput, undefined);
    assert.ok(typeof hr.passed === 'boolean');
  }
});

test('7. Run only executes public cases, Submit executes full suite', async () => {
  const runResult = await runCode({
    problem_id: 'p-1',
    language: 'python',
    code: 'def pair_sum_target(nums, target): return [0, 1]'
  });

  const submitResult = await submitCode({
    problem_id: 'p-1',
    language: 'python',
    user_id: 'usr_test_2',
    code: 'def pair_sum_target(nums, target): return [0, 1]'
  });

  assert.equal(runResult.total_test_cases, 3);
  assert.equal(submitResult.total_test_cases, 7);
});

test('8. JavaScript solution executes successfully', async () => {
  const result = await runCode({
    problem_id: 'p-1',
    language: 'javascript',
    code: `
function pairSumTarget(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const comp = target - nums[i];
    if (seen.has(comp)) return [seen.get(comp), i];
    seen.set(nums[i], i);
  }
  return [];
}
`
  });

  assert.equal(result.success, true);
  assert.equal(result.status, 'ACCEPTED');
  assert.equal(result.passed_test_cases, 3);
});

test('9. Invalid problem ID returns error', async () => {
  const result = await runCode({
    problem_id: 'non-existent-problem',
    language: 'python',
    code: 'pass'
  });

  assert.equal(result.success, false);
  assert.match(result.error_message, /No test cases configured/i);
});
