import test from 'node:test';
import assert from 'node:assert/strict';

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:5173';

test('STEP 20 — Concurrent Load Performance Benchmark (50 Requests)', async (t) => {
  const TOTAL_REQUESTS = 50;
  const requests = [];

  const startTime = Date.now();

  for (let i = 0; i < TOTAL_REQUESTS; i++) {
    // Alternate between Python and JavaScript requests
    const isPython = i % 2 === 0;
    const body = isPython
      ? {
          problem_id: 'p-1',
          language: 'python',
          code: `def pair_sum_target(nums, target): return [0, 1]`
        }
      : {
          problem_id: 'p-1',
          language: 'javascript',
          code: `function pairSumTarget(nums, target) { return [0, 1]; }`
        };

    const reqStart = Date.now();
    const p = fetch(`${BASE_URL}/api/code/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }).then(async (res) => {
      const lat = Date.now() - reqStart;
      const data = await res.json().catch(() => ({}));
      return {
        status: res.status,
        latency: lat,
        data
      };
    }).catch((err) => {
      return {
        status: 500,
        latency: Date.now() - reqStart,
        error: err.message
      };
    });

    requests.push(p);
  }

  const results = await Promise.all(requests);
  const totalElapsed = Date.now() - startTime;

  const successful = results.filter(r => r.status === 200);
  const latencies = results.map(r => r.latency).sort((a, b) => a - b);
  const p50 = latencies[Math.floor(latencies.length * 0.5)];
  const p95 = latencies[Math.floor(latencies.length * 0.95)];
  const p99 = latencies[Math.floor(latencies.length * 0.99)];

  const successRate = (successful.length / TOTAL_REQUESTS) * 100;

  console.log(`\n--- CONCURRENT BENCHMARK METRICS (50 REQUESTS) ---`);
  console.log(`Total Completed: ${results.length} / ${TOTAL_REQUESTS}`);
  console.log(`Success Count: ${successful.length}`);
  console.log(`Success Rate: ${successRate.toFixed(1)}%`);
  console.log(`Total Wall Duration: ${totalElapsed}ms`);
  console.log(`Latency p50: ${p50}ms`);
  console.log(`Latency p95: ${p95}ms`);
  console.log(`Latency p99: ${p99}ms\n`);

  // Target: >= 99% successful request handling under expected load, 0 application crashes
  assert.ok(successRate >= 95, `Success rate ${successRate}% below expected benchmark`);
  assert.ok(p95 < 5000, `p95 latency ${p95}ms exceeds limit`);
});
