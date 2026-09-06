import { browserExecutionEngine, transpilePythonToJs } from '../src/services/execution/browserRunner';
import { RunnerTestCase } from '../src/services/execution/types';

async function runTests() {
  console.log('Testing BrowserExecutionEngine...');

  const twoSumCases: RunnerTestCase[] = [
    { id: '1', input: [[2, 7, 11, 15], 9], expectedOutput: [0, 1], isPublic: true, position: 1 },
    { id: '2', input: [[3, 2, 4], 6], expectedOutput: [1, 2], isPublic: true, position: 2 },
    { id: '3', input: [[3, 3], 6], expectedOutput: [0, 1], isPublic: false, position: 3 },
  ];

  // Test 1: JavaScript correct solution
  const jsCorrect = `
function pairSumTarget(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) return [map.get(complement), i];
    map.set(nums[i], i);
  }
  return [];
}
`;
  const res1 = await browserExecutionEngine.execute({
    problemId: 'p-1',
    language: 'javascript',
    code: jsCorrect,
    testCases: twoSumCases
  });
  console.log('Test 1 (JS Correct):', res1.status, `Passed ${res1.testResults.filter(r => r.passed).length}/3`);
  if (res1.status !== 'ACCEPTED') throw new Error('Expected ACCEPTED');

  // Test 2: JavaScript Wrong Answer
  const jsWrong = `
function pairSumTarget(nums, target) {
  return [99, 99];
}
`;
  const res2 = await browserExecutionEngine.execute({
    problemId: 'p-1',
    language: 'javascript',
    code: jsWrong,
    testCases: twoSumCases
  });
  console.log('Test 2 (JS Wrong):', res2.status);
  if (res2.status !== 'WRONG_ANSWER') throw new Error('Expected WRONG_ANSWER');

  // Test 3: Python solution
  const pyCode = `
def pair_sum_target(nums: list[int], target: int) -> list[int]:
    seen = {}
    for i in range(len(nums)):
        comp = target - nums[i]
        if comp in seen:
            return [seen[comp], i]
        seen[nums[i]] = i
    return []
`;
  const res3 = await browserExecutionEngine.execute({
    problemId: 'p-1',
    language: 'python',
    code: pyCode,
    testCases: twoSumCases
  });
  console.log('Test 3 (Python Correct):', res3.status, `Passed ${res3.testResults.filter(r => r.passed).length}/3`);
  if (res3.status !== 'ACCEPTED') throw new Error('Expected ACCEPTED for Python');

  console.log('All BrowserExecutionEngine tests passed!');
}

runTests().catch(err => {
  console.error(err);
  process.exit(1);
});
