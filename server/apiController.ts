import { runPythonIsolated, runJavaScriptIsolated } from './isolatedRunner';
import { getPublicTestCases, getAllTestCasesForSubmit } from '../src/services/testCaseRepository';
import { JudgeEngine } from '../src/services/execution/judgeEngine';
import { RunnerTestCase, RunnerPayload } from '../src/services/execution/types';
import { ALL_PROBLEMS } from '../src/data/problems';
import { ProblemTestCaseRecord, Problem } from '../src/types/index';

/**
 * Handle POST /api/code/run
 */
export async function handleCodeRun(body: {
  problem_id: string;
  language: string;
  code: string;
  user_id?: string;
}) {
  const { problem_id, language, code } = body;

  const publicCases = getPublicTestCases(problem_id);
  if (!publicCases || publicCases.length === 0) {
    return {
      success: false,
      status: 'SYSTEM_ERROR',
      runtime_ms: 0,
      memory_kb: 0,
      total_test_cases: 0,
      passed_test_cases: 0,
      test_results: [],
      error_message: 'No test cases configured for this problem.'
    };
  }

  const runnerCases: RunnerTestCase[] = publicCases.map((tc: ProblemTestCaseRecord) => ({
    id: tc.id,
    input: Array.isArray(tc.input) ? tc.input : [tc.input],
    expectedOutput: tc.expected_output,
    isPublic: true,
    position: tc.position
  }));

  const payload: RunnerPayload = {
    problemId: problem_id,
    language: language as any,
    code,
    testCases: runnerCases,
    timeLimitMs: 2500,
    memoryLimitMb: 256
  };

  const runnerOutput = language === 'python' 
    ? await runPythonIsolated(payload)
    : await runJavaScriptIsolated(payload);

  const normalized = JudgeEngine.evaluate(runnerOutput, runnerCases);

  return {
    success: true,
    status: normalized.status,
    runtime_ms: normalized.runtime_ms,
    memory_kb: normalized.memory_kb,
    total_test_cases: normalized.total_test_cases,
    passed_test_cases: normalized.passed_test_cases,
    test_results: normalized.test_results,
    stdout: normalized.stdout,
    stderr: normalized.stderr,
    error_message: normalized.error_message
  };
}

/**
 * Handle POST /api/code/submit
 */
export async function handleCodeSubmit(body: {
  problem_id: string;
  language: string;
  code: string;
  user_id: string;
}) {
  const { problem_id, language, code, user_id } = body;

  if (!user_id) {
    return {
      success: false,
      status: 'SYSTEM_ERROR',
      runtime_ms: 0,
      memory_kb: 0,
      total_test_cases: 0,
      passed_test_cases: 0,
      test_results: [],
      submission_id: '',
      job_id: '',
      error_message: 'Unauthorized: user_id is required for submissions.'
    };
  }

  const allCases = getAllTestCasesForSubmit(problem_id);
  if (!allCases || allCases.length === 0) {
    return {
      success: false,
      status: 'SYSTEM_ERROR',
      runtime_ms: 0,
      memory_kb: 0,
      total_test_cases: 0,
      passed_test_cases: 0,
      test_results: [],
      submission_id: '',
      job_id: '',
      error_message: 'Problem test suite not found.'
    };
  }

  const runnerCases: RunnerTestCase[] = allCases.map((tc: ProblemTestCaseRecord) => ({
    id: tc.id,
    input: Array.isArray(tc.input) ? tc.input : [tc.input],
    expectedOutput: tc.expected_output,
    isPublic: tc.is_public,
    position: tc.position
  }));

  const jobId = `job_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const submissionId = `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  const payload: RunnerPayload = {
    problemId: problem_id,
    language: language as any,
    code,
    testCases: runnerCases,
    timeLimitMs: 3000,
    memoryLimitMb: 256
  };

  const runnerOutput = language === 'python'
    ? await runPythonIsolated(payload)
    : await runJavaScriptIsolated(payload);

  // Authoritative judging: scrubs hidden inputs/expected outputs
  const normalized = JudgeEngine.evaluate(runnerOutput, runnerCases, jobId);

  // Calculate next recommended problem
  const currProblem = ALL_PROBLEMS.find((p: Problem) => p.id === problem_id || p.slug === problem_id);
  let nextRecommended;
  if (currProblem) {
    const nextInTopic = ALL_PROBLEMS.find((p: Problem) => p.topic === currProblem.topic && p.id !== currProblem.id);
    const candidate = nextInTopic || ALL_PROBLEMS.find((p: Problem) => p.id !== currProblem.id);
    if (candidate) {
      nextRecommended = {
        id: candidate.id,
        slug: candidate.slug,
        title: candidate.title,
        difficulty: candidate.difficulty,
        topic: candidate.topic
      };
    }
  }

  return {
    success: true,
    status: normalized.status,
    runtime_ms: normalized.runtime_ms,
    memory_kb: normalized.memory_kb,
    total_test_cases: normalized.total_test_cases,
    passed_test_cases: normalized.passed_test_cases,
    test_results: normalized.test_results,
    stdout: normalized.stdout,
    stderr: normalized.stderr,
    error_message: normalized.error_message,
    submission_id: submissionId,
    job_id: jobId,
    next_recommended_problem: nextRecommended
  };
}
