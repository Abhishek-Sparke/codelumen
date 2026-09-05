import test from 'node:test';
import assert from 'node:assert/strict';

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:5173';

test('STEP 4 & 19 — Execution Sandbox Security & Isolation Tests', async (t) => {
  // 1. Normal program executes
  await t.test('Security 1: Normal algorithmic code executes cleanly', async () => {
    const res = await fetch(`${BASE_URL}/api/code/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        problem_id: 'p-1',
        language: 'python',
        code: `
def pair_sum_target(nums, target):
    return [0, 1]
`
      })
    });
    assert.equal(res.status, 200);
  });

  // 2. Infinite loop terminates
  await t.test('Security 2: Infinite loop is terminated by sandbox timeout', async () => {
    const res = await fetch(`${BASE_URL}/api/code/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        problem_id: 'p-1',
        language: 'python',
        code: `
def pair_sum_target(nums, target):
    while True:
        pass
    return []
`
      })
    });
    const data = await res.json();
    assert.equal(data.status, 'TIME_LIMIT_EXCEEDED');
  });

  // 3. Huge output terminated or truncated
  await t.test('Security 3: Huge output is bounded and does not crash server', async () => {
    const res = await fetch(`${BASE_URL}/api/code/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        problem_id: 'p-1',
        language: 'python',
        code: `
def pair_sum_target(nums, target):
    for _ in range(50000):
        print("FLOOD_STREAM_TEST")
    return [0, 1]
`
      })
    });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.ok(data.status === 'OUTPUT_LIMIT_EXCEEDED' || data.status === 'ACCEPTED' || data.status === 'WRONG_ANSWER');
  });

  // 4. Excessive memory terminated
  await t.test('Security 4: Excessive memory allocation is contained', async () => {
    const res = await fetch(`${BASE_URL}/api/code/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        problem_id: 'p-1',
        language: 'python',
        code: `
def pair_sum_target(nums, target):
    try:
        data = [bytearray(1024 * 1024) for _ in range(500)]
    except MemoryError:
        pass
    return [0, 1]
`
      })
    });
    assert.equal(res.status, 200);
  });

  // 5. Network request blocked
  await t.test('Security 5: Prohibited network modules are blocked at runtime', async () => {
    const res = await fetch(`${BASE_URL}/api/code/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        problem_id: 'p-1',
        language: 'python',
        code: `
def pair_sum_target(nums, target):
    import socket
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.connect(('1.1.1.1', 80))
    return []
`
      })
    });
    const data = await res.json();
    assert.equal(data.status, 'RUNTIME_ERROR');
    assert.ok(data.error_message?.includes('prohibited') || data.error_message?.includes('socket') || data.error_message?.includes('ImportError') || data.error_message?.includes('SecurityError'));
  });

  // 6. Environment variable access stripped of secrets
  await t.test('Security 6: Process environment has application secrets stripped', async () => {
    const res = await fetch(`${BASE_URL}/api/code/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        problem_id: 'p-1',
        language: 'python',
        code: `
def pair_sum_target(nums, target):
    import os
    env_keys = list(os.environ.keys())
    for k in env_keys:
        if "SUPABASE" in k or "SECRET" in k or "KEY" in k:
            print(f"EXPOSED_SECRET:{k}")
    return [0, 1]
`
      })
    });
    const data = await res.json();
    assert.equal(res.status, 200);
    assert.ok(!data.console_output?.includes('EXPOSED_SECRET:'));
  });

  // 7. Unauthorized API call rejected
  await t.test('Security 7: Unauthenticated submit requests are rejected', async () => {
    const res = await fetch(`${BASE_URL}/api/code/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: '', // missing user authentication
        problem_id: 'p-1',
        language: 'python',
        code: 'def pair_sum_target(): pass'
      })
    });
    assert.equal(res.status, 401);
  });

  // 8. Filesystem escape attempt blocked
  await t.test('Security 8: Filesystem escape / root traversal is contained', async () => {
    const res = await fetch(`${BASE_URL}/api/code/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        problem_id: 'p-1',
        language: 'python',
        code: `
def pair_sum_target(nums, target):
    try:
        with open('../../../../../../../etc/passwd', 'r') as f:
            print("ESCAPED_FS")
    except Exception:
        pass
    return [0, 1]
`
      })
    });
    const data = await res.json();
    assert.equal(res.status, 200);
    assert.ok(!data.console_output?.includes('ESCAPED_FS'));
  });
});
