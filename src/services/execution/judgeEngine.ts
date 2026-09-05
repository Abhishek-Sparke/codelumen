import { 
  NormalizedJudgeVerdict, 
  NormalizedExecutionResult, 
  TestCaseExecutionResult 
} from '../../types';
import { RunnerOutput, RunnerTestCase } from './types';

/**
 * The authoritative CodeSpark Judge Engine.
 * Formats runner outputs into normalized verdicts and strictly masks hidden test cases.
 */
export class JudgeEngine {
  /**
   * Evaluates runner output and scrubs hidden test case secrets.
   */
  public static evaluate(
    runnerOutput: RunnerOutput, 
    originalTestCases: RunnerTestCase[],
    jobId?: string
  ): NormalizedExecutionResult {
    const totalCases = originalTestCases.length;
    let passedCases = 0;

    // Scrub and format test case results
    const sanitizedResults: TestCaseExecutionResult[] = runnerOutput.testResults.map((tr) => {
      if (tr.passed) {
        passedCases++;
      }

      if (!tr.isPublic) {
        // HIDDEN TEST CASE: NEVER EXPOSE INPUT OR EXPECTED OUTPUT
        return {
          passed: tr.passed,
          testCaseId: tr.testCaseId,
          position: tr.position,
          isPublic: false,
          runtimeMs: tr.runtimeMs,
          memoryKb: tr.memoryKb
          // input, expectedOutput, and actualOutput are omitted
        };
      }

      // Public test case
      return {
        passed: tr.passed,
        testCaseId: tr.testCaseId,
        position: tr.position,
        isPublic: true,
        input: tr.input,
        expectedOutput: tr.expectedOutput,
        actualOutput: tr.actualOutput,
        runtimeMs: tr.runtimeMs,
        memoryKb: tr.memoryKb,
        errorMessage: tr.errorMessage
      };
    });

    // If runner aborted before test cases could run (e.g. compilation error, syntax error)
    let finalStatus: NormalizedJudgeVerdict = runnerOutput.status;
    if (sanitizedResults.length > 0 && finalStatus !== 'TIME_LIMIT_EXCEEDED' && finalStatus !== 'OUTPUT_LIMIT_EXCEEDED') {
      if (passedCases === totalCases) {
        finalStatus = 'ACCEPTED';
      } else {
        const hasRuntimeError = sanitizedResults.some(r => !!r.errorMessage);
        finalStatus = hasRuntimeError ? 'RUNTIME_ERROR' : 'WRONG_ANSWER';
      }
    }

    return {
      status: finalStatus,
      runtime_ms: runnerOutput.runtimeMs,
      memory_kb: runnerOutput.memoryKb || 18200,
      total_test_cases: totalCases,
      passed_test_cases: passedCases,
      test_results: sanitizedResults,
      compile_output: runnerOutput.compileOutput,
      error_message: runnerOutput.errorMessage,
      stdout: runnerOutput.stdout,
      stderr: runnerOutput.stderr,
      job_id: jobId
    };
  }
}
