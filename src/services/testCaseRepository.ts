import { ProblemTestCaseRecord } from '../types';
import { getProblemTestCasesEntry } from '../data/problemTestCasesRegistry';

/**
 * Authoritative Test Case Repository
 * Seamlessly resolves curated public and hidden test cases for all 75 problems.
 * Enforces zero cross-problem test contamination and strict problem ID matching.
 */

/**
 * Retrieves all test cases (both public and hidden) for a given problem.
 */
export function getProblemTestCases(problemId: string): ProblemTestCaseRecord[] {
  const entry = getProblemTestCasesEntry(problemId);
  const records: ProblemTestCaseRecord[] = [];
  
  if (!entry) return records;

  let pos = 1;

  // 1. Add public test cases
  if (entry.publicCases && entry.publicCases.length > 0) {
    entry.publicCases.forEach((tc, idx) => {
      records.push({
        id: `tc-pub-${entry.id}-${idx + 1}`,
        problem_id: entry.id,
        input: tc.input,
        expected_output: tc.expected,
        is_public: true,
        position: pos++,
        created_at: new Date().toISOString()
      });
    });
  }

  // 2. Add hidden test cases
  if (entry.hiddenCases && entry.hiddenCases.length > 0) {
    entry.hiddenCases.forEach((tc, idx) => {
      records.push({
        id: `tc-hid-${entry.id}-${idx + 1}`,
        problem_id: entry.id,
        input: tc.input,
        expected_output: tc.expected,
        is_public: false,
        position: pos++,
        created_at: new Date().toISOString()
      });
    });
  }

  return records;
}

/**
 * Retrieves only the public test cases for a problem (used by the Run operation).
 */
export function getPublicTestCases(problemId: string): ProblemTestCaseRecord[] {
  return getProblemTestCases(problemId).filter(tc => tc.is_public);
}

/**
 * Retrieves all test cases for official judging (used by Submit).
 */
export function getAllTestCasesForSubmit(problemId: string): ProblemTestCaseRecord[] {
  return getProblemTestCases(problemId);
}
