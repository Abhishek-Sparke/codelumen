import runHandler from '../api/code/run';
import submitHandler from '../api/code/submit';

async function testEndpoints() {
  console.log('Testing api/code/run for p-2 (Detect Duplicate Value)...');

  const mockRunReq: any = {
    method: 'POST',
    body: {
      problem_id: 'p-2',
      language: 'python',
      code: `def containsDuplicate(nums):
    seen = set()
    for num in nums:
        if num in seen:
            return True
        seen.add(num)
    return False
`
    }
  };

  let runStatus = 0;
  let runData: any = null;
  const mockRunRes: any = {
    status: (s: number) => { runStatus = s; return mockRunRes; },
    json: (d: any) => { runData = d; return mockRunRes; }
  };

  await runHandler(mockRunReq, mockRunRes);

  console.log('Run Status Code:', runStatus);
  console.log('Run Success:', runData?.success);
  console.log('Run Verdict:', runData?.status);
  console.log('Run Passed:', runData?.passed_test_cases, '/', runData?.total_test_cases);
  console.log('Run Test Results:');
  runData?.test_results?.forEach((r: any, idx: number) => {
    console.log(`  Case ${idx + 1}: input=${JSON.stringify(r.input)} expected=${JSON.stringify(r.expectedOutput)} actual=${JSON.stringify(r.actualOutput)} passed=${r.passed}`);
  });

  // Verify that test cases are duplicate value, NOT two-sum!
  const hasTwoSumTest = JSON.stringify(runData).includes('[2,7,11,15]');
  if (hasTwoSumTest) {
    console.error('FATAL ERROR: Two Sum test cases found in Detect Duplicate Value run!');
    process.exit(1);
  } else {
    console.log('VERIFIED: No Two Sum test cases leaked into Detect Duplicate Value!');
  }

  // Also test unknown problem ID (should return 404, zero fallback)
  console.log('\nTesting unknown problem ID fallback prevention...');
  const unknownReq: any = {
    method: 'POST',
    body: { problem_id: 'non-existent-problem', language: 'javascript', code: 'function x() {}' }
  };
  let unknownStatus = 0;
  let unknownData: any = null;
  const unknownRes: any = {
    status: (s: number) => { unknownStatus = s; return unknownRes; },
    json: (d: any) => { unknownData = d; return unknownRes; }
  };
  await runHandler(unknownReq, unknownRes);
  console.log('Unknown Problem Status Code:', unknownStatus);
  console.log('Unknown Problem Message:', unknownData?.error_message);
  if (unknownStatus !== 404) {
    console.error('FATAL ERROR: Unknown problem did not return 404!');
    process.exit(1);
  }

  // Also test submitHandler for p-2
  console.log('\nTesting api/code/submit for p-2...');
  const mockSubReq: any = {
    method: 'POST',
    body: {
      problem_id: 'p-2',
      language: 'javascript',
      user_id: 'usr_test_123',
      code: `function detectDuplicate(nums) {
  const seen = new Set();
  for (const n of nums) {
    if (seen.has(n)) return true;
    seen.add(n);
  }
  return false;
}`
    }
  };
  let subStatus = 0;
  let subData: any = null;
  const mockSubRes: any = {
    status: (s: number) => { subStatus = s; return mockSubRes; },
    json: (d: any) => { subData = d; return mockSubRes; }
  };
  await submitHandler(mockSubReq, mockSubRes);
  console.log('Submit Status Code:', subStatus);
  console.log('Submit Success:', subData?.success);
  console.log('Submit Verdict:', subData?.status);
  console.log('Submit Passed:', subData?.passed_test_cases, '/', subData?.total_test_cases);
  if (subData?.status !== 'ACCEPTED') {
    console.error('FATAL ERROR: Valid solution for p-2 was not ACCEPTED on submit!');
    console.error(subData);
    process.exit(1);
  }
  console.log('ALL API ENDPOINT VERIFICATIONS PASSED!');
}

testEndpoints().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
