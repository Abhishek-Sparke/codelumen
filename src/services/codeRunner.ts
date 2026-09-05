import { 
  ProblemTestCase, 
  SupportedLanguage, 
  SubmissionStatus,
  NormalizedJudgeVerdict,
  TestCaseExecutionResult
} from '../types';
import { ExecutionService } from './execution/executionService';

export interface ExecutionResult {
  status: SubmissionStatus;
  rawStatus: NormalizedJudgeVerdict;
  runtimeMs: number;
  memoryMb: number;
  passedTestCases: number;
  totalTestCases: number;
  details: {
    testCaseIndex: number;
    input?: any[];
    expected?: any;
    actual?: any;
    passed: boolean;
    isPublic: boolean;
    runtimeMs?: number;
    errorMessage?: string;
  }[];
  errorMessage?: string;
  outputLog?: string;
  stdout?: string;
  stderr?: string;
  jobId?: string;
  submissionId?: string;
  nextRecommendedProblem?: {
    id: string;
    slug: string;
    title: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    topic: string;
  };
}

/**
 * Maps the authoritative judge verdict to CodeSpark SubmissionStatus
 */
function mapVerdictToStatus(verdict: NormalizedJudgeVerdict): SubmissionStatus {
  switch (verdict) {
    case 'ACCEPTED':
      return 'Accepted';
    case 'WRONG_ANSWER':
      return 'Wrong Answer';
    case 'TIME_LIMIT_EXCEEDED':
      return 'Time Limit Exceeded';
    case 'RUNTIME_ERROR':
    case 'OUTPUT_LIMIT_EXCEEDED':
    case 'MEMORY_LIMIT_EXCEEDED':
      return 'Runtime Error';
    case 'COMPILATION_ERROR':
      return 'Compilation Error';
    default:
      return 'Runtime Error';
  }
}

/**
 * Execute code against public sample test cases (RUN button).
 * Used for debugging. Does NOT mark problem solved.
 */
export async function executeRun(
  code: string,
  language: SupportedLanguage,
  problemId: string,
  userId: string = 'guest'
): Promise<ExecutionResult> {
  const response = await ExecutionService.runCode({
    problem_id: problemId,
    language,
    code
  }, userId);

  const status = mapVerdictToStatus(response.status);
  const memoryMb = response.memory_kb ? +(response.memory_kb / 1024).toFixed(1) : 14.2;

  const details = (response.test_results || []).map((tr, idx) => ({
    testCaseIndex: tr.position || idx + 1,
    input: tr.input,
    expected: tr.expectedOutput,
    actual: tr.actualOutput,
    passed: tr.passed,
    isPublic: tr.isPublic !== false,
    runtimeMs: tr.runtimeMs,
    errorMessage: tr.errorMessage
  }));

  const logLines = [
    `[CodeSpark Execution Engine]`,
    `Language: ${language.toUpperCase()}`,
    `Verdict: ${response.status}`,
    `Passed: ${response.passed_test_cases} / ${response.total_test_cases} test cases`,
    `Runtime: ${response.runtime_ms} ms | Memory: ${memoryMb} MB`
  ];
  if (response.stdout) {
    logLines.push(`\n[Standard Output]\n${response.stdout}`);
  }
  if (response.stderr) {
    logLines.push(`\n[Standard Error]\n${response.stderr}`);
  }

  return {
    status,
    rawStatus: response.status,
    runtimeMs: response.runtime_ms,
    memoryMb,
    passedTestCases: response.passed_test_cases,
    totalTestCases: response.total_test_cases,
    details,
    stdout: response.stdout,
    stderr: response.stderr,
    errorMessage: response.error_message,
    outputLog: logLines.join('\n')
  };
}

/**
 * Execute code against full test suite including hidden test cases (SUBMIT button).
 * Official judging. Only ACCEPTED marks problem solved.
 */
export async function executeSubmit(
  code: string,
  language: SupportedLanguage,
  problemId: string,
  userId: string
): Promise<ExecutionResult> {
  const response = await ExecutionService.submitCode({
    problem_id: problemId,
    language,
    code,
    user_id: userId
  });

  const status = mapVerdictToStatus(response.status);
  const memoryMb = response.memory_kb ? +(response.memory_kb / 1024).toFixed(1) : 18.2;

  const details = (response.test_results || []).map((tr, idx) => ({
    testCaseIndex: tr.position || idx + 1,
    input: tr.isPublic ? tr.input : undefined,
    expected: tr.isPublic ? tr.expectedOutput : undefined,
    actual: tr.isPublic ? tr.actualOutput : undefined,
    passed: tr.passed,
    isPublic: tr.isPublic !== false,
    runtimeMs: tr.runtimeMs,
    errorMessage: tr.errorMessage
  }));

  const logLines = [
    `[CodeSpark Official Judge]`,
    `Submission ID: ${response.submission_id}`,
    `Language: ${language.toUpperCase()}`,
    `Official Verdict: ${response.status}`,
    `Passed: ${response.passed_test_cases} / ${response.total_test_cases} test cases`,
    `Total Runtime: ${response.runtime_ms} ms | Memory: ${memoryMb} MB`
  ];
  if (response.stdout) {
    logLines.push(`\n[Standard Output]\n${response.stdout}`);
  }
  if (response.stderr) {
    logLines.push(`\n[Standard Error]\n${response.stderr}`);
  }

  return {
    status,
    rawStatus: response.status,
    runtimeMs: response.runtime_ms,
    memoryMb,
    passedTestCases: response.passed_test_cases,
    totalTestCases: response.total_test_cases,
    details,
    stdout: response.stdout,
    stderr: response.stderr,
    errorMessage: response.error_message,
    jobId: response.job_id,
    submissionId: response.submission_id,
    nextRecommendedProblem: response.next_recommended_problem,
    outputLog: logLines.join('\n')
  };
}

/**
 * Backward-compatible helper for legacy callers
 */
export async function executeCode(
  code: string,
  language: SupportedLanguage,
  testCases: ProblemTestCase[],
  problemId: string = 'p-1'
): Promise<ExecutionResult> {
  return executeRun(code, language, problemId);
}
