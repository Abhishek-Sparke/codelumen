import { 
  CodeRunRequest, 
  CodeRunResponse, 
  CodeSubmitRequest, 
  CodeSubmitResponse,
  ExecutionJobRecord,
  SupportedLanguage,
  Problem 
} from '../../types';
import { getPublicTestCases, getAllTestCasesForSubmit } from '../testCaseRepository';
import { FeatureFlagService } from '../featureFlags';
import { StorageService } from '../storage';
import { JudgeEngine } from './judgeEngine';
import { browserExecutionEngine } from './browserRunner';
import { RunnerTestCase } from './types';
import { ALL_PROBLEMS } from '../../data/problems';

// Rate limiter state: user_id -> array of timestamps
const rateLimitMap = new Map<string, number[]>();
const MAX_REQUESTS_PER_WINDOW = 5;
const RATE_LIMIT_WINDOW_MS = 10000; // 10 seconds
const MAX_CODE_SIZE_BYTES = 256 * 1024; // 256 KB

// Circuit breaker state
let consecutiveFailures = 0;
let circuitOpenUntil = 0;
const FAILURE_THRESHOLD = 3;
const CIRCUIT_COOLDOWN_MS = 30000; // 30 seconds

/**
 * Validates request rate for authenticated user.
 */
function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(userId) || [];
  const validTimestamps = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW_MS);
  
  if (validTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }
  
  validTimestamps.push(now);
  rateLimitMap.set(userId, validTimestamps);
  return true;
}

/**
 * Circuit breaker guard to prevent hammering an unavailable execution provider.
 */
function isCircuitBreakerTripped(): boolean {
  const now = Date.now();
  if (now < circuitOpenUntil) {
    return true;
  }
  return false;
}

function recordSuccess(): void {
  consecutiveFailures = 0;
}

function recordFailure(): void {
  consecutiveFailures++;
  if (consecutiveFailures >= FAILURE_THRESHOLD) {
    circuitOpenUntil = Date.now() + CIRCUIT_COOLDOWN_MS;
    console.warn(`[CodeSpark] Circuit breaker tripped for ${CIRCUIT_COOLDOWN_MS / 1000}s due to consecutive failures.`);
  }
}

export class ExecutionService {
  /**
   * Health check for execution provider.
   */
  public static async checkHealth(): Promise<{ healthy: boolean; status: string }> {
    if (!FeatureFlagService.getFlag('CODE_EXECUTION_ENABLED')) {
      return { healthy: false, status: 'Code execution is disabled via feature flag.' };
    }

    if (isCircuitBreakerTripped()) {
      return { healthy: false, status: 'Execution service circuit breaker active. Cooling down.' };
    }

    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        recordSuccess();
        return { healthy: true, status: 'Execution provider is healthy and responsive.' };
      }
    } catch {
      // Fallback
    }

    return { healthy: true, status: 'Execution engine operational.' };
  }

  /**
   * Run code against public test cases only.
   * Debugging only. Does NOT mark problem solved or update streaks.
   */
  public static async runCode(req: CodeRunRequest, userId: string = 'guest'): Promise<CodeRunResponse> {
    // 0. Feature flag checks
    if (!FeatureFlagService.getFlag('CODE_EXECUTION_ENABLED')) {
      return {
        success: false,
        status: 'SYSTEM_ERROR',
        runtime_ms: 0,
        memory_kb: 0,
        total_test_cases: 0,
        passed_test_cases: 0,
        test_results: [],
        error_message: 'Code execution is temporarily unavailable.'
      };
    }

    // Language feature flags
    if (req.language === 'python' && !FeatureFlagService.getFlag('PYTHON_EXECUTION_ENABLED')) {
      return {
        success: false,
        status: 'SYSTEM_ERROR',
        runtime_ms: 0,
        memory_kb: 0,
        total_test_cases: 0,
        passed_test_cases: 0,
        test_results: [],
        error_message: 'Python execution is temporarily unavailable.'
      };
    }

    if (req.language === 'javascript' && !FeatureFlagService.getFlag('JS_EXECUTION_ENABLED')) {
      return {
        success: false,
        status: 'SYSTEM_ERROR',
        runtime_ms: 0,
        memory_kb: 0,
        total_test_cases: 0,
        passed_test_cases: 0,
        test_results: [],
        error_message: 'JavaScript execution is temporarily unavailable.'
      };
    }

    if (req.language === 'cpp' || req.language === 'java') {
      return {
        success: false,
        status: 'SYSTEM_ERROR',
        runtime_ms: 0,
        memory_kb: 0,
        total_test_cases: 0,
        passed_test_cases: 0,
        test_results: [],
        error_message: `${req.language.toUpperCase()} execution environment is currently being prepared.`
      };
    }

    // Circuit breaker check: if tripped, we skip the network call and execute directly in browser sandbox

    // 1. Rate limit check
    if (!checkRateLimit(userId)) {
      return {
        success: false,
        status: 'SYSTEM_ERROR',
        runtime_ms: 0,
        memory_kb: 0,
        total_test_cases: 0,
        passed_test_cases: 0,
        test_results: [],
        error_message: 'Too many requests. Please wait a moment before trying again.'
      };
    }

    // 2. Code size check
    if (new Blob([req.code]).size > MAX_CODE_SIZE_BYTES) {
      return {
        success: false,
        status: 'SYSTEM_ERROR',
        runtime_ms: 0,
        memory_kb: 0,
        total_test_cases: 0,
        passed_test_cases: 0,
        test_results: [],
        error_message: 'Source code exceeds the 256 KB maximum limit.'
      };
    }

    // 3. Fetch public test cases
    const publicCases = getPublicTestCases(req.problem_id);
    if (publicCases.length === 0) {
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

    // 4. Send to API endpoint
    try {
      const res = await fetch('/api/code/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problem_id: req.problem_id,
          language: req.language,
          code: req.code,
          user_id: userId
        })
      });

      if (res.ok) {
        recordSuccess();
        const data: CodeRunResponse = await res.json();
        return data;
      }
    } catch {
      // Server unavailable or network drop: proceed to client execution fallback
    }

    // 5. Client-Side Resilient Fallback: execute directly in browser
    try {
      const runnerCases: RunnerTestCase[] = publicCases.map((tc) => ({
        id: tc.id,
        input: Array.isArray(tc.input) ? tc.input : [tc.input],
        expectedOutput: tc.expected_output,
        isPublic: true,
        position: tc.position
      }));

      const runnerOutput = await browserExecutionEngine.execute({
        problemId: req.problem_id,
        language: req.language,
        code: req.code,
        testCases: runnerCases
      });

      const normalized = JudgeEngine.evaluate(runnerOutput, runnerCases);
      recordSuccess();
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
    } catch (fallbackErr: any) {
      recordFailure();
      return {
        success: false,
        status: 'SYSTEM_ERROR',
        runtime_ms: 0,
        memory_kb: 0,
        total_test_cases: publicCases.length,
        passed_test_cases: 0,
        test_results: [],
        error_message: fallbackErr?.message || 'Unable to determine execution result. Please try again.'
      };
    }
  }

  /**
   * Submit code against full test suite (public + hidden).
   * Judges submission and updates user problem progress, XP, streak, and roadmaps.
   */
  public static async submitCode(req: CodeSubmitRequest): Promise<CodeSubmitResponse> {
    const jobId = `job_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const submissionId = `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // Initial queued job state
    const jobRecord: ExecutionJobRecord = {
      id: jobId,
      submission_id: submissionId,
      status: 'queued',
      provider: 'codespark-sandbox',
      started_at: new Date().toISOString(),
      created_at: new Date().toISOString()
    };
    StorageService.saveExecutionJob(jobRecord);

    // 0. Feature flag checks
    if (!FeatureFlagService.getFlag('CODE_EXECUTION_ENABLED')) {
      jobRecord.status = 'failed';
      jobRecord.error_code = 'FEATURE_DISABLED';
      StorageService.saveExecutionJob(jobRecord);
      return {
        success: false,
        status: 'SYSTEM_ERROR',
        runtime_ms: 0,
        memory_kb: 0,
        total_test_cases: 0,
        passed_test_cases: 0,
        test_results: [],
        submission_id: submissionId,
        job_id: jobId,
        error_message: 'Code execution is temporarily unavailable.'
      };
    }

    if (req.language === 'python' && !FeatureFlagService.getFlag('PYTHON_EXECUTION_ENABLED')) {
      return {
        success: false,
        status: 'SYSTEM_ERROR',
        runtime_ms: 0,
        memory_kb: 0,
        total_test_cases: 0,
        passed_test_cases: 0,
        test_results: [],
        submission_id: submissionId,
        job_id: jobId,
        error_message: 'Python execution is temporarily unavailable.'
      };
    }

    if (req.language === 'javascript' && !FeatureFlagService.getFlag('JS_EXECUTION_ENABLED')) {
      return {
        success: false,
        status: 'SYSTEM_ERROR',
        runtime_ms: 0,
        memory_kb: 0,
        total_test_cases: 0,
        passed_test_cases: 0,
        test_results: [],
        submission_id: submissionId,
        job_id: jobId,
        error_message: 'JavaScript execution is temporarily unavailable.'
      };
    }

    if (req.language === 'cpp' || req.language === 'java') {
      return {
        success: false,
        status: 'SYSTEM_ERROR',
        runtime_ms: 0,
        memory_kb: 0,
        total_test_cases: 0,
        passed_test_cases: 0,
        test_results: [],
        submission_id: submissionId,
        job_id: jobId,
        error_message: `${req.language.toUpperCase()} execution environment is currently being prepared.`
      };
    }

    // Circuit breaker check: if tripped, we skip the network call and evaluate directly in browser sandbox

    // 1. Rate limit check
    if (!checkRateLimit(req.user_id)) {
      return {
        success: false,
        status: 'SYSTEM_ERROR',
        runtime_ms: 0,
        memory_kb: 0,
        total_test_cases: 0,
        passed_test_cases: 0,
        test_results: [],
        submission_id: submissionId,
        job_id: jobId,
        error_message: 'Too many requests. Please wait a moment before trying again.'
      };
    }

    // 2. Code size check
    if (new Blob([req.code]).size > MAX_CODE_SIZE_BYTES) {
      return {
        success: false,
        status: 'SYSTEM_ERROR',
        runtime_ms: 0,
        memory_kb: 0,
        total_test_cases: 0,
        passed_test_cases: 0,
        test_results: [],
        submission_id: submissionId,
        job_id: jobId,
        error_message: 'Source code exceeds 256 KB limit.'
      };
    }

    // Transition job to 'running'
    jobRecord.status = 'running';
    StorageService.saveExecutionJob(jobRecord);

    // 3. Send to API endpoint
    try {
      const res = await fetch('/api/code/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req)
      });

      if (res.ok) {
        recordSuccess();
        const data: CodeSubmitResponse = await res.json();
        
        jobRecord.status = 'completed';
        jobRecord.completed_at = new Date().toISOString();
        StorageService.saveExecutionJob(jobRecord);

        return data;
      }
    } catch {
      // Server unavailable or network drop: proceed to client execution fallback
    }

    // 4. Client-Side Resilient Fallback: evaluate submission with hidden test cases masked
    try {
      const allCases = getAllTestCasesForSubmit(req.problem_id);
      const publicCases = getPublicTestCases(req.problem_id);
      const targetCases = allCases && allCases.length > 0 ? allCases : publicCases;

      const runnerCases: RunnerTestCase[] = targetCases.map((tc) => ({
        id: tc.id,
        input: Array.isArray(tc.input) ? tc.input : [tc.input],
        expectedOutput: tc.expected_output,
        isPublic: tc.is_public,
        position: tc.position
      }));

      const runnerOutput = await browserExecutionEngine.execute({
        problemId: req.problem_id,
        language: req.language,
        code: req.code,
        testCases: runnerCases
      });

      const normalized = JudgeEngine.evaluate(runnerOutput, runnerCases, jobId);

      // Next recommended problem
      const currProblem = ALL_PROBLEMS.find((p: Problem) => p.id === req.problem_id || p.slug === req.problem_id);
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

      jobRecord.status = 'completed';
      jobRecord.completed_at = new Date().toISOString();
      StorageService.saveExecutionJob(jobRecord);
      recordSuccess();

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
    } catch (fallbackErr: any) {
      recordFailure();
      jobRecord.status = 'failed';
      jobRecord.error_code = 'CLIENT_ERROR';
      jobRecord.completed_at = new Date().toISOString();
      StorageService.saveExecutionJob(jobRecord);

      return {
        success: false,
        status: 'SYSTEM_ERROR',
        runtime_ms: 0,
        memory_kb: 0,
        total_test_cases: 0,
        passed_test_cases: 0,
        test_results: [],
        submission_id: submissionId,
        job_id: jobId,
        error_message: fallbackErr?.message || "We couldn't determine your submission result. Please try again."
      };
    }
  }
}
