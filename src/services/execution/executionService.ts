import { 
  CodeRunRequest, 
  CodeRunResponse, 
  CodeSubmitRequest, 
  CodeSubmitResponse,
  ExecutionJobRecord,
  SupportedLanguage 
} from '../../types';
import { getPublicTestCases } from '../testCaseRepository';
import { FeatureFlagService } from '../featureFlags';
import { StorageService } from '../storage';

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

    // Circuit breaker check
    if (isCircuitBreakerTripped()) {
      return {
        success: false,
        status: 'SYSTEM_ERROR',
        runtime_ms: 0,
        memory_kb: 0,
        total_test_cases: 0,
        passed_test_cases: 0,
        test_results: [],
        error_message: 'Execution capacity temporarily unavailable. Please try again shortly.'
      };
    }

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
      
      recordFailure();
      return {
        success: false,
        status: 'SYSTEM_ERROR',
        runtime_ms: 0,
        memory_kb: 0,
        total_test_cases: publicCases.length,
        passed_test_cases: 0,
        test_results: [],
        error_message: 'Unable to determine execution result. Please try again.'
      };
    } catch {
      recordFailure();
      return {
        success: false,
        status: 'SYSTEM_ERROR',
        runtime_ms: 0,
        memory_kb: 0,
        total_test_cases: publicCases.length,
        passed_test_cases: 0,
        test_results: [],
        error_message: 'Connection lost. Please check your network and retry.'
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

    // Circuit breaker check
    if (isCircuitBreakerTripped()) {
      jobRecord.status = 'failed';
      jobRecord.error_code = 'CIRCUIT_BREAKER';
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
        error_message: 'Execution capacity temporarily unavailable. Please wait a moment.'
      };
    }

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

      recordFailure();
      jobRecord.status = 'failed';
      jobRecord.error_code = 'SERVER_ERROR';
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
        error_message: "We couldn't determine your submission result. Please try again."
      };
    } catch {
      recordFailure();
      jobRecord.status = 'failed';
      jobRecord.error_code = 'NETWORK_ERROR';
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
        error_message: 'Connection lost. Please check your network connection and retry.'
      };
    }
  }
}
