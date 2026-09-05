import { 
  CodeRunRequest, 
  CodeRunResponse, 
  CodeSubmitRequest, 
  CodeSubmitResponse,
  ExecutionJobRecord,
  NormalizedJudgeVerdict,
  SupportedLanguage 
} from '../../types';
import { getPublicTestCases, getAllTestCasesForSubmit } from '../testCaseRepository';
import { JudgeEngine } from './judgeEngine';
import { RunnerTestCase } from './types';

// Rate limiter state: user_id -> array of timestamps
const rateLimitMap = new Map<string, number[]>();
const MAX_REQUESTS_PER_WINDOW = 5;
const RATE_LIMIT_WINDOW_MS = 10000; // 10 seconds
const MAX_CODE_SIZE_BYTES = 256 * 1024; // 256 KB

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

export class ExecutionService {
  /**
   * Run code against public test cases only.
   * Debugging only. Does NOT mark problem solved or update streaks.
   */
  public static async runCode(req: CodeRunRequest, userId: string = 'guest'): Promise<CodeRunResponse> {
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

    // 3. Language availability check
    if (req.language !== 'python' && req.language !== 'javascript') {
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

    // 4. Fetch public test cases
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

    // 5. Send to API endpoint
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
        const data = await res.json();
        return data;
      }
      
      const errText = await res.text();
      return {
        success: false,
        status: 'SYSTEM_ERROR',
        runtime_ms: 0,
        memory_kb: 0,
        total_test_cases: publicCases.length,
        passed_test_cases: 0,
        test_results: [],
        error_message: `Execution server error (${res.status}): ${errText.slice(0, 200)}`
      };
    } catch (fetchErr: any) {
      return {
        success: false,
        status: 'SYSTEM_ERROR',
        runtime_ms: 0,
        memory_kb: 0,
        total_test_cases: publicCases.length,
        passed_test_cases: 0,
        test_results: [],
        error_message: 'Execution service unreachable. Verify the dev server is active.'
      };
    }
  }

  /**
   * Submit code against full test suite (public + hidden).
   * Judges submission and updates user problem progress, XP, streak, and roadmaps.
   */
  public static async submitCode(req: CodeSubmitRequest): Promise<CodeSubmitResponse> {
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
        submission_id: '',
        job_id: '',
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
        submission_id: '',
        job_id: '',
        error_message: 'Source code exceeds 256 KB limit.'
      };
    }

    // 3. Language check
    if (req.language !== 'python' && req.language !== 'javascript') {
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
        error_message: `${req.language.toUpperCase()} execution environment is currently being prepared.`
      };
    }

    // 4. Send to API endpoint
    try {
      const res = await fetch('/api/code/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req)
      });

      if (res.ok) {
        const data = await res.json();
        return data;
      }

      const errText = await res.text();
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
        error_message: `Judging server error: ${errText.slice(0, 200)}`
      };
    } catch (err: any) {
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
        error_message: 'Judging service unreachable.'
      };
    }
  }
}
