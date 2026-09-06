import './setup-storage-mock';
import { ExecutionService } from '../src/services/execution/executionService';

async function testExecutionServiceFallback() {
  console.log('Testing ExecutionService resilient fallback...');

  // Mock global.fetch to simulate /api/code/run returning 500 or failing
  (globalThis as any).fetch = async (url: string) => {
    return {
      ok: false,
      status: 500,
      json: async () => ({ success: false, error_message: 'Server failed' })
    };
  };

  const runResult = await ExecutionService.runCode({
    problem_id: 'p-1',
    language: 'javascript',
    code: `
function pairSumTarget(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const comp = target - nums[i];
    if (map.has(comp)) return [map.get(comp), i];
    map.set(nums[i], i);
  }
  return [];
}
    `
  }, 'user-1');

  console.log('Run Result Verdict:', runResult.status, 'Passed:', runResult.passed_test_cases, '/', runResult.total_test_cases);
  if (runResult.status !== 'ACCEPTED') {
    throw new Error(`Expected ACCEPTED, got ${runResult.status}`);
  }
  if (runResult.error_message) {
    throw new Error(`Unexpected error message: ${runResult.error_message}`);
  }

  const submitResult = await ExecutionService.submitCode({
    problem_id: 'p-1',
    language: 'javascript',
    code: `
function pairSumTarget(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const comp = target - nums[i];
    if (map.has(comp)) return [map.get(comp), i];
    map.set(nums[i], i);
  }
  return [];
}
    `,
    user_id: 'user-1'
  });

  console.log('Submit Result Verdict:', submitResult.status, 'Passed:', submitResult.passed_test_cases, '/', submitResult.total_test_cases);
  if (submitResult.status !== 'ACCEPTED') {
    throw new Error(`Expected ACCEPTED for submission, got ${submitResult.status}`);
  }

  console.log('All ExecutionService fallback tests passed with flying colors!');
}

testExecutionServiceFallback().catch(err => {
  console.error(err);
  process.exit(1);
});
