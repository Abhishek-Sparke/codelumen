import runHandler from '../api/code/run';
import submitHandler from '../api/code/submit';

function createReq(body: any) {
  return {
    method: 'POST',
    body,
    query: {},
    headers: {}
  };
}

function createRes() {
  const res: any = {
    statusCode: 200,
    headers: {},
    body: null,
    status(code: number) {
      res.statusCode = code;
      return res;
    },
    json(data: any) {
      res.body = data;
      return res;
    },
    setHeader(k: string, v: string) {
      res.headers[k] = v;
      return res;
    }
  };
  return res;
}

async function test() {
  console.log('Testing Two Sum (p-1)...');
  const twoSumCode = `def two_sum(nums: list[int], target: int) -> list[int]:
    seen = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in seen:
            return [seen[diff], i]
        seen[num] = i
    return []`;

  const res1 = createRes();
  await runHandler(createReq({ problem_id: 'p-1', language: 'python', code: twoSumCode }), res1);
  console.log('Two Sum Run:', res1.body.status, `${res1.body.passed_test_cases}/${res1.body.total_test_cases}`);

  console.log('Testing Detect Duplicate Value (p-2)...');
  const dupCode = `def contains_duplicate(nums: list[int]) -> bool:
    return len(nums) != len(set(nums))`;

  const res2 = createRes();
  await runHandler(createReq({ problem_id: 'p-2', language: 'python', code: dupCode }), res2);
  console.log('Detect Duplicate Run:', res2.body.status, `${res2.body.passed_test_cases}/${res2.body.total_test_cases}`);

  console.log('Testing Submit Two Sum...');
  const res3 = createRes();
  await submitHandler(createReq({ user_id: 'u-1', problem_id: 'p-1', language: 'python', code: twoSumCode }), res3);
  console.log('Two Sum Submit:', res3.body.status, `${res3.body.passed_test_cases}/${res3.body.total_test_cases}`);

  console.log('Testing Submit Detect Duplicate...');
  const res4 = createRes();
  await submitHandler(createReq({ user_id: 'u-1', problem_id: 'p-2', language: 'python', code: dupCode }), res4);
  console.log('Detect Duplicate Submit:', res4.body.status, `${res4.body.passed_test_cases}/${res4.body.total_test_cases}`);
}

test();
