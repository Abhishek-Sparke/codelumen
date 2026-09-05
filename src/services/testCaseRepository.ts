import { ProblemTestCaseRecord } from '../types';
import { ALL_PROBLEMS } from '../data/problems';

/**
 * Curated hidden test cases for roadmap & library problems
 * to verify robustness against edge cases without exposing data to the client.
 */
const HIDDEN_TEST_CASES_BY_PROBLEM: Record<string, Array<{ input: any[]; expected: any }>> = {
  'p-1': [ // Pair Sum Target (Two Sum)
    { input: [[0, 4, 3, 0], 0], expected: [0, 3] },
    { input: [[-1, -2, -3, -4, -5], -8], expected: [2, 4] },
    { input: [[1000000, 500, 2000000], 1000500], expected: [0, 1] },
    { input: [[1, 5, 8, 12, 19, 25, 30], 44], expected: [4, 5] },
  ],
  'p-2': [ // Detect Duplicate Value
    { input: [[100, 200, 300, 400, 500, 100]], expected: true },
    { input: [[-5, -4, -3, -2, -1, 0, 1, 2, 3]], expected: false },
    { input: [[99]], expected: false },
    { input: [[0, 0]], expected: true },
  ],
  'p-3': [ // Valid Anagram
    { input: ['abracadabra', 'baracadarba'], expected: true },
    { input: ['listen', 'silent'], expected: true },
    { input: ['hello', 'world'], expected: false },
    { input: ['a', 'b'], expected: false },
  ],
  'p-4': [ // Group Anagrams
    { input: [['a']], expected: [['a']] },
    { input: [['']], expected: [['']] },
    { input: [['cab', 'tin', 'pew', 'duh', 'may', 'ill', 'buy', 'bar', 'max', 'doc']], expected: [['cab'], ['tin'], ['pew'], ['duh'], ['may'], ['ill'], ['buy'], ['bar'], ['max'], ['doc']] },
  ],
  'p-5': [ // Top K Frequent Elements
    { input: [[4, 1, -1, 2, -1, 2, 3], 2], expected: [-1, 2] },
    { input: [[1, 2], 2], expected: [1, 2] },
    { input: [[7, 7, 7, 7], 1], expected: [7] },
  ],
  'p-6': [ // Valid Palindrome
    { input: ['0P'], expected: false },
    { input: ['a.'], expected: true },
    { input: ['Live on time, emit no evil'], expected: true },
    { input: ['ab_a'], expected: true },
  ],
  'p-7': [ // Two Sum II (Sorted)
    { input: [[1, 2, 3, 4, 4, 9, 56, 90], 8], expected: [4, 5] },
    { input: [[-10, -5, 0, 3, 7], -2], expected: [2, 4] },
    { input: [[5, 25, 75], 100], expected: [2, 3] },
  ],
  'p-8': [ // 3Sum Zero Triplet
    { input: [[0, 0, 0, 0]], expected: [[0, 0, 0]] },
    { input: [[-2, 0, 1, 1, 2]], expected: [[-2, 0, 2], [-2, 1, 1]] },
    { input: [[1, 2, -2, -1]], expected: [] },
  ],
  'p-9': [ // Container With Most Water
    { input: [[1, 2, 1]], expected: 2 },
    { input: [[4, 3, 2, 1, 4]], expected: 16 },
    { input: [[1, 2, 4, 3]], expected: 4 },
  ],
  'p-10': [ // Best Time to Buy and Sell Stock
    { input: [[2, 4, 1]], expected: 2 },
    { input: [[3, 2, 6, 5, 0, 3]], expected: 4 },
    { input: [[1, 2]], expected: 1 },
  ],
  'p-11': [ // Longest Substring Without Repeating
    { input: ['dvdf'], expected: 3 },
    { input: ['anviaj'], expected: 5 },
    { input: ['tmmzuxt'], expected: 5 },
  ],
  'p-12': [ // Longest Repeating Character Replacement
    { input: ['ABAA', 0], expected: 2 },
    { input: ['AABABBA', 1], expected: 4 },
  ],
  'p-14': [ // Valid Parentheses
    { input: ['{[]}'], expected: true },
    { input: ['([)]'], expected: false },
    { input: [']'], expected: false },
    { input: ['((('], expected: false },
  ],
  'p-18': [ // Binary Search
    { input: [[2, 5], 5], expected: 1 },
    { input: [[2, 5], 2], expected: 0 },
    { input: [[-1, 0, 3, 5, 9, 12], 13], expected: -1 },
  ],
  'p-21': [ // Reverse Linked List
    { input: [[1, 2]], expected: [2, 1] },
    { input: [[]], expected: [] },
    { input: [[10, 20, 30, 40]], expected: [40, 30, 20, 10] },
  ],
  'p-22': [ // Merge Two Sorted Lists
    { input: [[1, 5], [2, 4, 6]], expected: [1, 2, 4, 5, 6] },
    { input: [[], [0]], expected: [0] },
  ],
  'p-25': [ // Invert Binary Tree
    { input: [[1, 2]], expected: [1, null, 2] },
    { input: [[]], expected: [] },
  ],
  'p-26': [ // Maximum Depth of Binary Tree
    { input: [[1, null, 2]], expected: 2 },
    { input: [[]], expected: 0 },
  ],
  'p-33': [ // Climbing Stairs
    { input: [4], expected: 5 },
    { input: [5], expected: 8 },
    { input: [6], expected: 13 },
  ],
};

/**
 * Generate fallback hidden test cases for any problem not explicitly detailed above.
 */
function generateFallbackHiddenCases(problemId: string, publicCases: Array<{ input: any[]; expected: any }>): Array<{ input: any[]; expected: any }> {
  if (publicCases.length === 0) return [];
  return publicCases.map((c) => ({
    input: c.input,
    expected: c.expected
  }));
}

/**
 * Retrieves all test cases (both public and hidden) for a given problem.
 */
export function getProblemTestCases(problemId: string): ProblemTestCaseRecord[] {
  const problem = ALL_PROBLEMS.find(p => p.id === problemId || p.slug === problemId);
  const records: ProblemTestCaseRecord[] = [];
  
  if (!problem) return records;

  let pos = 1;

  // 1. Add public test cases
  if (problem.testCases && problem.testCases.length > 0) {
    problem.testCases.forEach((tc, idx) => {
      records.push({
        id: `tc-pub-${problem.id}-${idx + 1}`,
        problem_id: problem.id,
        input: tc.input,
        expected_output: tc.expected,
        is_public: true,
        position: pos++,
        created_at: new Date().toISOString()
      });
    });
  }

  // 2. Add hidden test cases
  const hiddenList = HIDDEN_TEST_CASES_BY_PROBLEM[problem.id] || 
                     generateFallbackHiddenCases(problem.id, problem.testCases || []);

  hiddenList.forEach((tc, idx) => {
    records.push({
      id: `tc-hid-${problem.id}-${idx + 1}`,
      problem_id: problem.id,
      input: tc.input,
      expected_output: tc.expected,
      is_public: false,
      position: pos++,
      created_at: new Date().toISOString()
    });
  });

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
