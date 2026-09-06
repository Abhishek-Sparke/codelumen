import runHandler from '../api/code/run';
import submitHandler from '../api/code/submit';

async function testAll() {
  console.log('====================================================');
  console.log(' TESTING PYTHON ANAGRAM SOLUTIONS IN API/CODE/RUN    ');
  console.log('====================================================');

  // Solution A: Sorting
  const solA = `def is_anagram(s: str, t: str) -> bool:
    return sorted(s) == sorted(t)
`;
  let resA: any = null;
  const mockResA: any = { status: () => mockResA, json: (d: any) => { resA = d; } };
  await runHandler({
    method: 'POST',
    body: { problem_id: 'p-3', language: 'python', code: solA }
  } as any, mockResA);

  console.log('\n[Solution A (Sorting)]:');
  console.log('Status:', resA?.status);
  console.log('Passed:', resA?.passed_test_cases, '/', resA?.total_test_cases);
  resA?.test_results?.forEach((r: any) => {
    console.log(`  Case ${r.position}: input=${JSON.stringify(r.input)} expected=${r.expectedOutput} actual=${r.actualOutput} passed=${r.passed}`);
  });

  if (resA?.status !== 'ACCEPTED' || resA?.passed_test_cases !== 3) {
    console.error('FAILED Solution A test!');
    process.exit(1);
  }

  // Solution B: Hash map with .get()
  const solB = `def is_anagram(s: str, t: str) -> bool:
    if len(s) != len(t):
        return False

    count = {}

    for c in s:
        count[c] = count.get(c, 0) + 1

    for c in t:
        if c not in count:
            return False
        count[c] -= 1
        if count[c] < 0:
            return False

    return True
`;
  let resB: any = null;
  const mockResB: any = { status: () => mockResB, json: (d: any) => { resB = d; } };
  await runHandler({
    method: 'POST',
    body: { problem_id: 'p-3', language: 'python', code: solB }
  } as any, mockResB);

  console.log('\n[Solution B (Hash Map .get)]:');
  console.log('Status:', resB?.status);
  console.log('Passed:', resB?.passed_test_cases, '/', resB?.total_test_cases);
  resB?.test_results?.forEach((r: any) => {
    console.log(`  Case ${r.position}: input=${JSON.stringify(r.input)} expected=${r.expectedOutput} actual=${r.actualOutput} passed=${r.passed}`);
  });

  if (resB?.status !== 'ACCEPTED' || resB?.passed_test_cases !== 3) {
    console.error('FAILED Solution B test!');
    process.exit(1);
  }

  // Solution C: Anti-cheat (Always False)
  const solC = `def is_anagram(s: str, t: str) -> bool:
    return False
`;
  let resC: any = null;
  const mockResC: any = { status: () => mockResC, json: (d: any) => { resC = d; } };
  await runHandler({
    method: 'POST',
    body: { problem_id: 'p-3', language: 'python', code: solC }
  } as any, mockResC);

  console.log('\n[Solution C (Anti-Cheat: Always False)]:');
  console.log('Status:', resC?.status, '(expected WRONG_ANSWER)');
  console.log('Passed:', resC?.passed_test_cases, '/', resC?.total_test_cases, '(expected 1/3)');
  if (resC?.status === 'ACCEPTED') {
    console.error('FAILED: Anti-cheat always false solution was accepted!');
    process.exit(1);
  }

  // Solution D: Anti-cheat (Always True)
  const solD = `def is_anagram(s: str, t: str) -> bool:
    return True
`;
  let resD: any = null;
  const mockResD: any = { status: () => mockResD, json: (d: any) => { resD = d; } };
  await runHandler({
    method: 'POST',
    body: { problem_id: 'p-3', language: 'python', code: solD }
  } as any, mockResD);

  console.log('\n[Solution D (Anti-Cheat: Always True)]:');
  console.log('Status:', resD?.status, '(expected WRONG_ANSWER)');
  console.log('Passed:', resD?.passed_test_cases, '/', resD?.total_test_cases, '(expected 2/3)');
  if (resD?.status === 'ACCEPTED') {
    console.error('FAILED: Anti-cheat always true solution was accepted!');
    process.exit(1);
  }

  // Solution E: Collections Counter
  const solE = `from collections import Counter

def is_anagram(s: str, t: str) -> bool:
    return Counter(s) == Counter(t)
`;
  let resE: any = null;
  const mockResE: any = { status: () => mockResE, json: (d: any) => { resE = d; } };
  await runHandler({
    method: 'POST',
    body: { problem_id: 'p-3', language: 'python', code: solE }
  } as any, mockResE);

  console.log('\n[Solution E (Collections Counter)]:');
  console.log('Status:', resE?.status);
  console.log('Passed:', resE?.passed_test_cases, '/', resE?.total_test_cases);

  // Test SUBMIT with Solution A
  console.log('\n[Testing SUBMIT endpoint with Solution A]:');
  let resSub: any = null;
  const mockSub: any = { status: () => mockSub, json: (d: any) => { resSub = d; } };
  await submitHandler({
    method: 'POST',
    body: { problem_id: 'p-3', user_id: 'user-sparke', language: 'python', code: solA }
  } as any, mockSub);
  console.log('Submit Status:', resSub?.status);
  console.log('Submit Passed:', resSub?.passed_test_cases, '/', resSub?.total_test_cases);
  if (resSub?.status !== 'ACCEPTED') {
    console.error('FAILED: Submit for Solution A was not ACCEPTED!');
    process.exit(1);
  }

  console.log('\n====================================================');
  console.log(' ALL ANAGRAM EXECUTION TESTS PASSED PERFECTLY!      ');
  console.log('====================================================');
}

testAll().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
