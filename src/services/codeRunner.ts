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
  isPhase3Pending?: boolean;
}

/**
 * Phase 3 Execution Payload Schema for isolated sandbox workers
 */
export interface SandboxExecutionPayload {
  problemId: string;
  language: SupportedLanguage;
  sourceCode: string;
  testCases: ProblemTestCase[];
  timeLimitMs: number;
  memoryLimitMb: number;
}

export function buildSandboxSubmissionPayload(
  problemId: string,
  language: SupportedLanguage,
  sourceCode: string,
  testCases: ProblemTestCase[] = [],
  timeLimitMs: number = 2000,
  memoryLimitMb: number = 256
): SandboxExecutionPayload {
  return {
    problemId,
    language,
    sourceCode,
    testCases,
    timeLimitMs,
    memoryLimitMb
  };
}

/**
 * Executes or queues code according to Phase 2 / Phase 3 architectural boundary.
 * In Phase 2, code is saved as a verified draft and submitted in 'Pending' state
 * with explicit architectural notice: "Code execution will be available soon."
 * Randomly faking 'Accepted' or 'Wrong Answer' verdicts is strictly prohibited.
 */
export function executeCode(
  code: string,
  language: SupportedLanguage,
  testCases: ProblemTestCase[]
): Promise<ExecutionResult> {
  return new Promise((resolve) => {
    const startTime = performance.now();

    // Natural processing latency
    setTimeout(() => {
      const elapsed = Math.round(performance.now() - startTime);

      resolve({
        status: 'Pending',
        runtimeMs: elapsed,
        memoryMb: 0,
        passedTestCases: 0,
        totalTestCases: testCases.length,
        isPhase3Pending: true,
        details: testCases.map((tc, idx) => ({
          testCaseIndex: idx + 1,
          input: tc.input,
          expected: tc.expected,
          actual: 'Pending sandbox execution',
          passed: false
        })),
        outputLog: `[CodeSpark Execution Sandbox]\nLanguage: ${language.toUpperCase()}\nStatus: Submission queued in Phase 2 architecture\nNotice: Code execution will be available soon (Phase 3 sandbox runner).`,
        errorMessage: 'Code execution will be available soon.'
      });
    }, 400);
  });
}
