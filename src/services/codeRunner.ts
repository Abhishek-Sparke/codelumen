import { ProblemTestCase, SupportedLanguage, SubmissionStatus } from '../types';

export interface ExecutionResult {
  status: SubmissionStatus;
  runtimeMs: number;
  memoryMb: number;
  passedTestCases: number;
  totalTestCases: number;
  details: {
    testCaseIndex: number;
    input: any[];
    expected: any;
    actual: any;
    passed: boolean;
  }[];
  errorMessage?: string;
  outputLog?: string;
}

export function executeCode(
  code: string,
  language: SupportedLanguage,
  testCases: ProblemTestCase[]
): Promise<ExecutionResult> {
  return new Promise((resolve) => {
    const startTime = performance.now();
    
    // Simulate slight natural execution latency (300-600ms)
    setTimeout(() => {
      try {
        if (language === 'javascript') {
          runJavaScriptInSandbox(code, testCases, startTime, resolve);
        } else {
          runMultiLanguageSimulation(code, language, testCases, startTime, resolve);
        }
      } catch (err: any) {
        resolve({
          status: 'Runtime Error',
          runtimeMs: Math.round(performance.now() - startTime),
          memoryMb: 14.8,
          passedTestCases: 0,
          totalTestCases: testCases.length,
          details: [],
          errorMessage: err?.message || 'Execution failed due to unhandled error.'
        });
      }
    }, 450);
  });
}

function runJavaScriptInSandbox(
  userCode: string,
  testCases: ProblemTestCase[],
  startTime: number,
  resolve: (res: ExecutionResult) => void
) {
  const details: ExecutionResult['details'] = [];
  let passedCount = 0;

  try {
    // Wrap code and extract function name
    const funcMatch = userCode.match(/function\s+([a-zA-Z0-9_$]+)/);
    const funcName = funcMatch ? funcMatch[1] : null;

    if (!funcName) {
      // Evaluate direct arrow expression or class
      const wrapped = new Function(`${userCode}; return typeof solution !== 'undefined' ? solution : null;`)();
      if (!wrapped) {
        throw new Error('Please declare a named function (e.g. function pairSumTarget(nums, target) { ... })');
      }
    }

    const runner = new Function(`
      ${userCode}
      return typeof ${funcName} === 'function' ? ${funcName} : null;
    `)();

    if (!runner) {
      throw new Error(`Could not locate executable function '${funcName}'.`);
    }

    for (let i = 0; i < testCases.length; i++) {
      const tc = testCases[i];
      // Clone inputs so user function mutations don't corrupt subsequent tests
      const clonedArgs = JSON.parse(JSON.stringify(tc.input));
      
      let actual: any;
      try {
        actual = runner(...clonedArgs);
      } catch (runErr: any) {
        details.push({
          testCaseIndex: i + 1,
          input: tc.input,
          expected: tc.expected,
          actual: `Runtime Error: ${runErr.message}`,
          passed: false
        });
        continue;
      }

      const passed = deepEquals(actual, tc.expected);
      if (passed) passedCount++;

      details.push({
        testCaseIndex: i + 1,
        input: tc.input,
        expected: tc.expected,
        actual: actual !== undefined ? actual : 'undefined',
        passed
      });
    }

    const elapsed = Math.round(performance.now() - startTime);
    const status: SubmissionStatus = passedCount === testCases.length ? 'Accepted' : 'Wrong Answer';

    resolve({
      status,
      runtimeMs: Math.max(38, elapsed % 80 + 35),
      memoryMb: +(14.2 + (Math.random() * 0.8)).toFixed(1),
      passedTestCases: passedCount,
      totalTestCases: testCases.length,
      details
    });
  } catch (compileErr: any) {
    resolve({
      status: 'Compilation Error',
      runtimeMs: Math.round(performance.now() - startTime),
      memoryMb: 14.1,
      passedTestCases: 0,
      totalTestCases: testCases.length,
      details: [],
      errorMessage: compileErr.message
    });
  }
}

function runMultiLanguageSimulation(
  code: string,
  language: SupportedLanguage,
  testCases: ProblemTestCase[],
  startTime: number,
  resolve: (res: ExecutionResult) => void
) {
  // Check for empty body / stub
  const trimmed = code.trim();
  const isStub = trimmed.includes('pass') || trimmed.includes('return new int[0]') || trimmed.includes('return nil') || trimmed.includes('todo');
  
  const details: ExecutionResult['details'] = [];
  const passed = !isStub && trimmed.length > 80;
  const passedCount = passed ? testCases.length : Math.max(0, testCases.length - 2);

  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i];
    const isTestPassed = passed || (i === 0 && !isStub);
    details.push({
      testCaseIndex: i + 1,
      input: tc.input,
      expected: tc.expected,
      actual: isTestPassed ? tc.expected : (isStub ? 'null / empty stub' : 'Unexpected value'),
      passed: isTestPassed
    });
  }

  const elapsed = Math.round(performance.now() - startTime);
  const status: SubmissionStatus = passed ? 'Accepted' : 'Wrong Answer';

  resolve({
    status,
    runtimeMs: Math.max(42, (elapsed % 60) + 45),
    memoryMb: +(15.0 + Math.random() * 1.5).toFixed(1),
    passedTestCases: passed ? testCases.length : (isStub ? 0 : passedCount),
    totalTestCases: testCases.length,
    details,
    errorMessage: isStub ? `Your ${language} code returned a default empty stub value.` : undefined
  });
}

function deepEquals(a: any, b: any): boolean {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (a === null || b === null) return a === b;
  
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    // Check elements
    for (let i = 0; i < a.length; i++) {
      if (!deepEquals(a[i], b[i])) return false;
    }
    return true;
  }
  
  if (typeof a === 'object' && typeof b === 'object') {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    for (const k of keysA) {
      if (!deepEquals(a[k], b[k])) return false;
    }
    return true;
  }
  
  return false;
}
