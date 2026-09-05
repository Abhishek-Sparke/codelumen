import { Problem } from '../types';

export const PROBLEMS_PART1: Problem[] = [
  {
    id: 'p-1',
    slug: 'two-sum-indices',
    title: 'Pair Sum Target',
    difficulty: 'Easy',
    acceptance: '82.4%',
    topic: 'Arrays',
    pattern: 'Hash Map',
    companies: ['Google', 'Meta', 'Amazon'],
    description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.',
    examples: [
      { input: 'nums = [2, 7, 11, 15], target = 9', output: '[0, 1]', explanation: 'nums[0] + nums[1] == 9, so we return [0, 1].' },
      { input: 'nums = [3, 2, 4], target = 6', output: '[1, 2]', explanation: 'nums[1] + nums[2] == 6, so we return [1, 2].' }
    ],
    constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', '-10^9 <= target <= 10^9', 'Only one valid answer exists.'],
    starterCode: {
      javascript: `function pairSumTarget(nums, target) {\n  // Write your code here\n  \n}`,
      python: `def pair_sum_target(nums: list[int], target: int) -> list[int]:\n    # Write your code here\n    pass`,
      cpp: `#include <vector>\n#include <unordered_map>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> pairSumTarget(vector<int>& nums, int target) {\n        // Your solution\n    }\n};`,
      java: `import java.util.*;\n\nclass Solution {\n    public int[] pairSumTarget(int[] nums, int target) {\n        // Your solution\n        return new int[0];\n    }\n}`,
      go: `func pairSumTarget(nums []int, target int) []int {\n    // Your solution\n    return nil\n}`,
      rust: `impl Solution {\n    pub fn pair_sum_target(nums: Vec<i32>, target: i32) -> Vec<i32> {\n        // Your solution\n        vec![]\n    }\n}`
    },
    testCases: [
      { input: [[2, 7, 11, 15], 9], expected: [0, 1] },
      { input: [[3, 2, 4], 6], expected: [1, 2] },
      { input: [[3, 3], 6], expected: [0, 1] }
    ],
    hints: [
      { level: 1, type: 'conceptual', title: 'Complement Thinking', content: 'For each number x, what exact value are you hoping to find in the rest of the array?' },
      { level: 2, type: 'direction', title: 'Constant Time Lookup', content: 'Use a Hash Map to store elements you have already inspected alongside their original indices.' },
      { level: 3, type: 'near-solution', title: 'Single-Pass Construction', content: 'As you scan nums[i], check if (target - nums[i]) exists in the map. If yes, return [map.get(complement), i]. Otherwise record map[nums[i]] = i.' }
    ],
    editorial: {
      summary: 'Optimal lookup using a hash table achieves O(n) runtime and O(n) space.',
      patternExplanation: 'Hash table reduces membership queries from O(n) to O(1) average time.',
      bruteForce: {
        name: 'Nested Iteration',
        complexity: { time: 'O(n²)', space: 'O(1)' },
        explanation: 'Check all pairs (i, j) with two nested loops until nums[i] + nums[j] == target.',
        code: `function bruteForce(nums, target) {\n  for (let i = 0; i < nums.length; i++) {\n    for (let j = i + 1; j < nums.length; j++) {\n      if (nums[i] + nums[j] === target) return [i, j];\n    }\n  }\n}`
      },
      optimal: {
        name: 'Single-Pass Hash Map',
        complexity: { time: 'O(n)', space: 'O(n)' },
        explanation: 'Store visited elements in a map mapping value to index. Look for the complement on every iteration.',
        code: `function pairSumTarget(nums, target) {\n  const seen = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const comp = target - nums[i];\n    if (seen.has(comp)) return [seen.get(comp), i];\n    seen.set(nums[i], i);\n  }\n  return [];\n}`
      }
    },
    similarProblemIds: ['p-6', 'p-7', 'p-18']
  },
  {
    id: 'p-2',
    slug: 'contains-duplicate-value',
    title: 'Detect Duplicate Value',
    difficulty: 'Easy',
    acceptance: '89.1%',
    topic: 'Arrays',
    pattern: 'Hash Map',
    companies: ['Apple', 'Microsoft'],
    description: 'Given an integer array `nums`, return `true` if any value appears at least twice in the array, and return `false` if every element is distinct.',
    examples: [
      { input: 'nums = [1, 2, 3, 1]', output: 'true' },
      { input: 'nums = [1, 2, 3, 4]', output: 'false' }
    ],
    constraints: ['1 <= nums.length <= 10^5', '-10^9 <= nums[i] <= 10^9'],
    starterCode: {
      javascript: `function detectDuplicate(nums) {\n  // Return true if duplicates exist\n  \n}`,
      python: `def detect_duplicate(nums: list[int]) -> bool:\n    pass`,
      cpp: `#include <vector>\nusing namespace std;\nclass Solution {\npublic:\n    bool detectDuplicate(vector<int>& nums) {}\n};`,
      java: `class Solution {\n    public boolean detectDuplicate(int[] nums) {\n        return false;\n    }\n}`,
      go: `func detectDuplicate(nums []int) bool {\n    return false\n}`,
      rust: `impl Solution {\n    pub fn detect_duplicate(nums: Vec<i32>) -> bool { false }\n}`
    },
    testCases: [
      { input: [[1, 2, 3, 1]], expected: true },
      { input: [[1, 2, 3, 4]], expected: false },
      { input: [[1, 1, 1, 3, 3, 4, 3, 2, 4, 2]], expected: true }
    ],
    hints: [
      { level: 1, type: 'conceptual', title: 'Set Uniqueness', content: 'What property does a Set guarantee regarding duplicate insertions?' },
      { level: 2, type: 'direction', title: 'Early Termination', content: 'As soon as set.has(val) returns true, you can immediately return true without finishing the loop.' },
      { level: 3, type: 'near-solution', title: 'Set Size Comparison', content: 'Alternatively, return new Set(nums).size !== nums.length.' }
    ],
    editorial: {
      summary: 'Hash set lookups enable linear time duplicate detection.',
      patternExplanation: 'Using a Set provides O(1) amortized insertion and membership testing.',
      bruteForce: {
        name: 'Sorting',
        complexity: { time: 'O(n log n)', space: 'O(1)' },
        explanation: 'Sort the array and scan adjacent elements for equality.',
        code: `nums.sort((a,b) => a-b);\nfor (let i = 1; i < nums.length; i++) if (nums[i] === nums[i-1]) return true;\nreturn false;`
      },
      optimal: {
        name: 'Hash Set',
        complexity: { time: 'O(n)', space: 'O(n)' },
        explanation: 'Traverse array and maintain a visited hash set.',
        code: `function detectDuplicate(nums) {\n  const seen = new Set();\n  for (const n of nums) {\n    if (seen.has(n)) return true;\n    seen.add(n);\n  }\n  return false;\n}`
      }
    },
    similarProblemIds: ['p-1', 'p-3']
  },
  {
    id: 'p-3',
    slug: 'valid-anagram-frequency',
    title: 'Verify Anagram Strings',
    difficulty: 'Easy',
    acceptance: '84.7%',
    topic: 'Arrays',
    pattern: 'Hash Map',
    companies: ['Amazon', 'Uber'],
    description: 'Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.\n\nAn Anagram is a word formed by rearranging the letters of a different word, using all the original letters exactly once.',
    examples: [
      { input: 's = "anagram", t = "nagaram"', output: 'true' },
      { input: 's = "rat", t = "car"', output: 'false' }
    ],
    constraints: ['1 <= s.length, t.length <= 5 * 10^4', 's and t consist of lowercase English letters.'],
    starterCode: {
      javascript: `function isAnagram(s, t) {\n  // Return true if anagram\n  \n}`,
      python: `def is_anagram(s: str, t: str) -> bool:\n    pass`,
      cpp: `#include <string>\nusing namespace std;\nclass Solution { public: bool isAnagram(string s, string t) {} };`,
      java: `class Solution { public boolean isAnagram(String s, String t) { return false; } }`,
      go: `func isAnagram(s string, t string) bool { return false }`,
      rust: `impl Solution { pub fn is_anagram(s: String, t: String) -> bool { false } }`
    },
    testCases: [
      { input: ['anagram', 'nagaram'], expected: true },
      { input: ['rat', 'car'], expected: false },
      { input: ['listen', 'silent'], expected: true }
    ],
    hints: [
      { level: 1, type: 'conceptual', title: 'Length check', content: 'If strings have different lengths, can they ever be anagrams?' },
      { level: 2, type: 'direction', title: 'Frequency count', content: 'Count characters in s, then decrement frequencies with t.' },
      { level: 3, type: 'near-solution', title: 'Fixed 26-char array', content: 'Use an array of size 26 for constant space O(1).' }
    ],
    editorial: {
      summary: 'Count character frequencies with an array or map.',
      patternExplanation: 'Frequency bucket mapping.',
      bruteForce: {
        name: 'Sort & Compare',
        complexity: { time: 'O(n log n)', space: 'O(n)' },
        explanation: 'Sort both strings alphabetically and compare for exact string equality.',
        code: `return s.split('').sort().join('') === t.split('').sort().join('');`
      },
      optimal: {
        name: 'Frequency Array (26 letters)',
        complexity: { time: 'O(n)', space: 'O(1)' },
        explanation: 'Increment counts with string s and decrement with string t. Check that all bins equal 0.',
        code: `function isAnagram(s, t) {\n  if (s.length !== t.length) return false;\n  const count = new Array(26).fill(0);\n  for (let i = 0; i < s.length; i++) {\n    count[s.charCodeAt(i) - 97]++;\n    count[t.charCodeAt(i) - 97]--;\n  }\n  return count.every(c => c === 0);\n}`
      }
    },
    similarProblemIds: ['p-1', 'p-4']
  },
  {
    id: 'p-4',
    slug: 'group-anagrams-by-signature',
    title: 'Group Anagram Clusters',
    difficulty: 'Medium',
    acceptance: '68.2%',
    topic: 'Arrays',
    pattern: 'Hash Map',
    companies: ['Meta', 'Amazon', 'Netflix'],
    description: 'Given an array of strings `strs`, group the anagrams together. You can return the answer in any order.',
    examples: [
      { input: 'strs = ["eat","tea","tan","ate","nat","bat"]', output: '[["bat"],["nat","tan"],["ate","eat","tea"]]' },
      { input: 'strs = [""]', output: '[[""]]' }
    ],
    constraints: ['1 <= strs.length <= 10^4', '0 <= strs[i].length <= 100', 'strs[i] consists of lowercase English letters.'],
    starterCode: {
      javascript: `function groupAnagrams(strs) {\n  // Return grouped anagrams\n  \n}`,
      python: `def group_anagrams(strs: list[str]) -> list[list[str]]:\n    pass`,
      cpp: `#include <vector>\n#include <string>\nusing namespace std;\nclass Solution { public: vector<vector<string>> groupAnagrams(vector<string>& strs) {} };`,
      java: `import java.util.*;\nclass Solution { public List<List<String>> groupAnagrams(String[] strs) { return new ArrayList<>(); } }`,
      go: `func groupAnagrams(strs []string) [][]string { return nil }`,
      rust: `impl Solution { pub fn group_anagrams(strs: Vec<String>) -> Vec<Vec<String>> { vec![] } }`
    },
    testCases: [
      { input: [['eat', 'tea', 'tan', 'ate', 'nat', 'bat']], expected: [['eat', 'tea', 'ate'], ['tan', 'nat'], ['bat']] },
      { input: [['']], expected: [['']] },
      { input: [['a']], expected: [['a']] }
    ],
    hints: [
      { level: 1, type: 'conceptual', title: 'Canonical Key', content: 'What key can represent both "eat" and "tea" uniquely?' },
      { level: 2, type: 'direction', title: 'Sorted string key', content: 'Sorting the characters gives "aet", which serves as the map hash key.' },
      { level: 3, type: 'near-solution', title: 'Map of Arrays', content: 'Store arrays of strings under each canonical key, then return Array.from(map.values()).' }
    ],
    editorial: {
      summary: 'Hash table with canonical sorted keys groups anagrams in O(n * k log k).',
      patternExplanation: 'Equivalence class partitioning via invariant keys.',
      bruteForce: {
        name: 'Pairwise Anagram Checks',
        complexity: { time: 'O(n² * k)', space: 'O(n)' },
        explanation: 'Check each word against all previously formed groups.',
        code: `// Compare each word against groups`
      },
      optimal: {
        name: 'Hash Map with Sorted Key',
        complexity: { time: 'O(n * k log k)', space: 'O(n * k)' },
        explanation: 'Transform each string into a sorted character signature key.',
        code: `function groupAnagrams(strs) {\n  const map = new Map();\n  for (const s of strs) {\n    const key = s.split('').sort().join('');\n    if (!map.has(key)) map.set(key, []);\n    map.get(key).push(s);\n  }\n  return Array.from(map.values());\n}`
      }
    },
    similarProblemIds: ['p-3', 'p-5']
  },
  {
    id: 'p-5',
    slug: 'longest-consecutive-sequence-linear',
    title: 'Longest Consecutive Sequence',
    difficulty: 'Medium',
    acceptance: '53.8%',
    topic: 'Arrays',
    pattern: 'Hash Map',
    companies: ['Google', 'Microsoft', 'Bloomberg'],
    description: 'Given an unsorted array of integers `nums`, return the length of the longest consecutive elements sequence.\n\nYou must write an algorithm that runs in `O(n)` time.',
    examples: [
      { input: 'nums = [100, 4, 200, 1, 3, 2]', output: '4', explanation: 'The longest consecutive elements sequence is [1, 2, 3, 4]. Its length is 4.' },
      { input: 'nums = [0, 3, 7, 2, 5, 8, 4, 6, 0, 1]', output: '9' }
    ],
    constraints: ['0 <= nums.length <= 10^5', '-10^9 <= nums[i] <= 10^9'],
    starterCode: {
      javascript: `function longestConsecutive(nums) {\n  // Must be O(n) time\n  \n}`,
      python: `def longest_consecutive(nums: list[int]) -> int:\n    pass`,
      cpp: `#include <vector>\nusing namespace std;\nclass Solution { public: int longestConsecutive(vector<int>& nums) {} };`,
      java: `class Solution { public int longestConsecutive(int[] nums) { return 0; } }`,
      go: `func longestConsecutive(nums []int) int { return 0 }`,
      rust: `impl Solution { pub fn longest_consecutive(nums: Vec<i32>) -> i32 { 0 } }`
    },
    testCases: [
      { input: [[100, 4, 200, 1, 3, 2]], expected: 4 },
      { input: [[0, 3, 7, 2, 5, 8, 4, 6, 0, 1]], expected: 9 },
      { input: [[]], expected: 0 }
    ],
    hints: [
      { level: 1, type: 'conceptual', title: 'Sequence Starts', content: 'How do you know if a number x is the start of a sequence? Only if (x - 1) is NOT in the set!' },
      { level: 2, type: 'direction', title: 'Set Lookup', content: 'Put all numbers in a HashSet for O(1) contains queries.' },
      { level: 3, type: 'near-solution', title: 'Count While in Set', content: 'When x is a start, loop while set.has(x + length) to find the sequence length.' }
    ],
    editorial: {
      summary: 'Using a hash set to only initiate counting from true sequence beginnings guarantees each element is touched at most twice.',
      patternExplanation: 'Smart iteration start-condition filtering.',
      bruteForce: {
        name: 'Sorting First',
        complexity: { time: 'O(n log n)', space: 'O(1)' },
        explanation: 'Sort array and count adjacent elements with difference 1.',
        code: `// Sort and count streak`
      },
      optimal: {
        name: 'Hash Set Sequence Start',
        complexity: { time: 'O(n)', space: 'O(n)' },
        explanation: 'Insert all into a Set. Only explore when num - 1 is absent.',
        code: `function longestConsecutive(nums) {\n  const set = new Set(nums);\n  let maxStreak = 0;\n  for (const num of set) {\n    if (!set.has(num - 1)) {\n      let current = num;\n      let streak = 1;\n      while (set.has(current + 1)) {\n        current++;\n        streak++;\n      }\n      maxStreak = Math.max(maxStreak, streak);\n    }\n  }\n  return maxStreak;\n}`
      }
    },
    similarProblemIds: ['p-1', 'p-4']
  },
  {
    id: 'p-6',
    slug: 'valid-palindrome-alphanumeric',
    title: 'Valid Palindrome String',
    difficulty: 'Easy',
    acceptance: '79.3%',
    topic: 'Two Pointers',
    pattern: 'Two Pointers',
    companies: ['Meta', 'Microsoft'],
    description: 'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.\n\nGiven a string `s`, return `true` if it is a palindrome, or `false` otherwise.',
    examples: [
      { input: 's = "A man, a plan, a canal: Panama"', output: 'true', explanation: '"amanaplanacanalpanama" is a palindrome.' },
      { input: 's = "race a car"', output: 'false', explanation: '"raceacar" is not a palindrome.' }
    ],
    constraints: ['1 <= s.length <= 2 * 10^5', 's consists only of printable ASCII characters.'],
    starterCode: {
      javascript: `function isPalindrome(s) {\n  // Two pointers inwards\n  \n}`,
      python: `def is_palindrome(s: str) -> bool:\n    pass`,
      cpp: `#include <string>\nusing namespace std;\nclass Solution { public: bool isPalindrome(string s) {} };`,
      java: `class Solution { public boolean isPalindrome(String s) { return false; } }`,
      go: `func isPalindrome(s string) bool { return false }`,
      rust: `impl Solution { pub fn is_palindrome(s: String) -> bool { false } }`
    },
    testCases: [
      { input: ['A man, a plan, a canal: Panama'], expected: true },
      { input: ['race a car'], expected: false },
      { input: [' '], expected: true }
    ],
    hints: [
      { level: 1, type: 'conceptual', title: 'Opposite Ends', content: 'Maintain a pointer at the start and a pointer at the end, moving inwards.' },
      { level: 2, type: 'direction', title: 'Skip Non-Alphanumeric', content: 'While char at left is not alphanumeric, left++. Same for right--.' },
      { level: 3, type: 'near-solution', title: 'Case Insensitive Compare', content: 'Compare lowercased chars: if s[left].toLowerCase() !== s[right].toLowerCase(), return false.' }
    ],
    editorial: {
      summary: 'Two pointers converging inward with in-place alphanumeric filtering.',
      patternExplanation: 'Two Pointers symmetrical verification.',
      bruteForce: {
        name: 'Filter and Reverse',
        complexity: { time: 'O(n)', space: 'O(n)' },
        explanation: 'Clean string with regex, reverse, and compare.',
        code: `const cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, '');\nreturn cleaned === cleaned.split('').reverse().join('');`
      },
      optimal: {
        name: 'In-Place Two Pointers',
        complexity: { time: 'O(n)', space: 'O(1)' },
        explanation: 'Two pointers skip non-alphanumeric chars without extra string allocation.',
        code: `function isPalindrome(s) {\n  let l = 0, r = s.length - 1;\n  const isAlpha = c => /[a-z0-9]/i.test(c);\n  while (l < r) {\n    while (l < r && !isAlpha(s[l])) l++;\n    while (l < r && !isAlpha(s[r])) r--;\n    if (s[l].toLowerCase() !== s[r].toLowerCase()) return false;\n    l++; r--;\n  }\n  return true;\n}`
      }
    },
    similarProblemIds: ['p-1', 'p-7']
  },
  {
    id: 'p-7',
    slug: 'two-sum-sorted-array',
    title: 'Two Sum II - Sorted Array',
    difficulty: 'Medium',
    acceptance: '64.5%',
    topic: 'Two Pointers',
    pattern: 'Two Pointers',
    companies: ['Amazon', 'Apple'],
    description: 'Given a 1-indexed array of integers `numbers` that is already sorted in non-decreasing order, find two numbers such that they add up to a specific `target` number.\n\nReturn the indices of the two numbers, `index1` and `index2`, added by one as an integer array `[index1, index2]` of length 2.\n\nYou may not use the same element twice. Your solution must use only constant extra space.',
    examples: [
      { input: 'numbers = [2, 7, 11, 15], target = 9', output: '[1, 2]' },
      { input: 'numbers = [2, 3, 4], target = 6', output: '[1, 3]' }
    ],
    constraints: ['2 <= numbers.length <= 3 * 10^4', '-1000 <= numbers[i] <= 1000', 'numbers is sorted in non-decreasing order.'],
    starterCode: {
      javascript: `function twoSumSorted(numbers, target) {\n  // 1-indexed result with O(1) space\n  \n}`,
      python: `def two_sum_sorted(numbers: list[int], target: int) -> list[int]:\n    pass`,
      cpp: `#include <vector>\nusing namespace std;\nclass Solution { public: vector<int> twoSumSorted(vector<int>& numbers, int target) {} };`,
      java: `class Solution { public int[] twoSumSorted(int[] numbers, int target) { return new int[0]; } }`,
      go: `func twoSumSorted(numbers []int, target int) []int { return nil }`,
      rust: `impl Solution { pub fn two_sum_sorted(numbers: Vec<i32>, target: i32) -> Vec<i32> { vec![] } }`
    },
    testCases: [
      { input: [[2, 7, 11, 15], 9], expected: [1, 2] },
      { input: [[2, 3, 4], 6], expected: [1, 3] },
      { input: [[-1, 0], -1], expected: [1, 2] }
    ],
    hints: [
      { level: 1, type: 'conceptual', title: 'Exploit Sorted Order', content: 'Because the array is sorted, sum increases as left moves right and decreases as right moves left.' },
      { level: 2, type: 'direction', title: 'Binary Sum Adjustment', content: 'If sum > target, decrement right. If sum < target, increment left.' },
      { level: 3, type: 'near-solution', title: '1-Indexed Output', content: 'Return [left + 1, right + 1] when sum === target.' }
    ],
    editorial: {
      summary: 'Two pointers converging from ends achieves O(n) time and O(1) space on sorted inputs.',
      patternExplanation: 'Monotonic sum convergence.',
      bruteForce: {
        name: 'Hash Map Lookup',
        complexity: { time: 'O(n)', space: 'O(n)' },
        explanation: 'Standard two-sum hash map, but violates the O(1) auxiliary space constraint.',
        code: `// Uses O(n) memory map`
      },
      optimal: {
        name: 'Two Pointers Converging',
        complexity: { time: 'O(n)', space: 'O(1)' },
        explanation: 'Start pointers at indices 0 and n-1. Compare sum against target.',
        code: `function twoSumSorted(numbers, target) {\n  let l = 0, r = numbers.length - 1;\n  while (l < r) {\n    const sum = numbers[l] + numbers[r];\n    if (sum === target) return [l + 1, r + 1];\n    if (sum < target) l++;\n    else r--;\n  }\n  return [];\n}`
      }
    },
    similarProblemIds: ['p-1', 'p-8']
  },
  {
    id: 'p-8',
    slug: 'three-sum-triplets-zero',
    title: '3Sum Zero Triplets',
    difficulty: 'Medium',
    acceptance: '42.1%',
    topic: 'Two Pointers',
    pattern: 'Two Pointers',
    companies: ['Meta', 'Amazon', 'Google'],
    description: 'Given an integer array nums, return all the triplets `[nums[i], nums[j], nums[k]]` such that `i != j`, `i != k`, and `j != k`, and `nums[i] + nums[j] + nums[k] == 0`.\n\nNotice that the solution set must not contain duplicate triplets.',
    examples: [
      { input: 'nums = [-1, 0, 1, 2, -1, -4]', output: '[[-1, -1, 2], [-1, 0, 1]]' },
      { input: 'nums = [0, 1, 1]', output: '[]' }
    ],
    constraints: ['3 <= nums.length <= 3000', '-10^5 <= nums[i] <= 10^5'],
    starterCode: {
      javascript: `function threeSum(nums) {\n  // Return unique zero-sum triplets\n  \n}`,
      python: `def three_sum(nums: list[int]) -> list[list[int]]:\n    pass`,
      cpp: `#include <vector>\nusing namespace std;\nclass Solution { public: vector<vector<int>> threeSum(vector<int>& nums) {} };`,
      java: `import java.util.*;\nclass Solution { public List<List<Int>> threeSum(int[] nums) { return new ArrayList<>(); } }`,
      go: `func threeSum(nums []int) [][]int { return nil }`,
      rust: `impl Solution { pub fn three_sum(nums: Vec<i32>) -> Vec<Vec<i32>> { vec![] } }`
    },
    testCases: [
      { input: [[-1, 0, 1, 2, -1, -4]], expected: [[-1, -1, 2], [-1, 0, 1]] },
      { input: [[0, 1, 1]], expected: [] },
      { input: [[0, 0, 0]], expected: [[0, 0, 0]] }
    ],
    hints: [
      { level: 1, type: 'conceptual', title: 'Fix one element', content: 'Sort the array first. For each index i, solve Two Sum II for target = -nums[i].' },
      { level: 2, type: 'direction', title: 'Duplicate Skipping', content: 'Whenever nums[i] === nums[i - 1], continue. Inside two-pointer loop, skip identical adjacent numbers.' },
      { level: 3, type: 'near-solution', title: 'Pointers Movement', content: 'When triplet found, push [nums[i], nums[l], nums[r]], then while (l < r && nums[l] === nums[l+1]) l++ and r--.' }
    ],
    editorial: {
      summary: 'Sorting + outer loop + Two Pointers solves 3Sum in O(n²) without duplicate sets.',
      patternExplanation: 'Dimension reduction from 3 elements to sorted 2-pointer scan.',
      bruteForce: {
        name: 'Three Nested Loops',
        complexity: { time: 'O(n³)', space: 'O(n)' },
        explanation: 'Try every triplet (i, j, k) and check sum === 0.',
        code: `// O(n^3) cubic search`
      },
      optimal: {
        name: 'Sort + Two Pointers',
        complexity: { time: 'O(n²)', space: 'O(1) extra' },
        explanation: 'Sort array, fix nums[i], and run two pointers from i+1 to n-1.',
        code: `function threeSum(nums) {\n  nums.sort((a, b) => a - b);\n  const res = [];\n  for (let i = 0; i < nums.length - 2; i++) {\n    if (i > 0 && nums[i] === nums[i - 1]) continue;\n    let l = i + 1, r = nums.length - 1;\n    while (l < r) {\n      const sum = nums[i] + nums[l] + nums[r];\n      if (sum === 0) {\n        res.push([nums[i], nums[l], nums[r]]);\n        while (l < r && nums[l] === nums[l + 1]) l++;\n        while (l < r && nums[r] === nums[r - 1]) r--;\n        l++; r--;\n      } else if (sum < 0) l++;\n      else r--;\n    }\n  }\n  return res;\n}`
      }
    },
    similarProblemIds: ['p-7', 'p-1']
  },
  {
    id: 'p-9',
    slug: 'best-time-to-buy-and-sell-stock',
    title: 'Stock Trading Profit',
    difficulty: 'Easy',
    acceptance: '76.8%',
    topic: 'Sliding Window',
    pattern: 'Sliding Window',
    companies: ['Amazon', 'Google', 'Apple'],
    description: 'You are given an array `prices` where `prices[i]` is the price of a given stock on the `i`th day.\n\nYou want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.\n\nReturn the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return `0`.',
    examples: [
      { input: 'prices = [7, 1, 5, 3, 6, 4]', output: '5', explanation: 'Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.' },
      { input: 'prices = [7, 6, 4, 3, 1]', output: '0', explanation: 'No profitable transactions possible.' }
    ],
    constraints: ['1 <= prices.length <= 10^5', '0 <= prices[i] <= 10^4'],
    starterCode: {
      javascript: `function maxProfit(prices) {\n  // Single pass maximum profit\n  \n}`,
      python: `def max_profit(prices: list[int]) -> int:\n    pass`,
      cpp: `#include <vector>\nusing namespace std;\nclass Solution { public: int maxProfit(vector<int>& prices) {} };`,
      java: `class Solution { public int maxProfit(int[] prices) { return 0; } }`,
      go: `func maxProfit(prices []int) int { return 0 }`,
      rust: `impl Solution { pub fn max_profit(prices: Vec<i32>) -> i32 { 0 } }`
    },
    testCases: [
      { input: [[7, 1, 5, 3, 6, 4]], expected: 5 },
      { input: [[7, 6, 4, 3, 1]], expected: 0 },
      { input: [[2, 4, 1]], expected: 2 }
    ],
    hints: [
      { level: 1, type: 'conceptual', title: 'Lowest Valley', content: 'To maximize profit on day i, you should have bought at the minimum price seen so far.' },
      { level: 2, type: 'direction', title: 'Running Min', content: 'Track minPrice seen up to day i. Profit if sold today is prices[i] - minPrice.' },
      { level: 3, type: 'near-solution', title: 'Single Pass Update', content: 'Update maxProfit = Math.max(maxProfit, price - minPrice) and minPrice = Math.min(minPrice, price).' }
    ],
    editorial: {
      summary: 'Maintain running minimum price to capture the optimal selling margin in linear time.',
      patternExplanation: 'Sliding window tracking lower envelope.',
      bruteForce: {
        name: 'Nested Days',
        complexity: { time: 'O(n²)', space: 'O(1)' },
        explanation: 'Try buying on every day i and selling on every day j > i.',
        code: `// Nested iteration over all buy/sell pairs`
      },
      optimal: {
        name: 'Running Minimum',
        complexity: { time: 'O(n)', space: 'O(1)' },
        explanation: 'Track minimum price encountered and record maximum differential.',
        code: `function maxProfit(prices) {\n  let minPrice = Infinity;\n  let maxProfit = 0;\n  for (const p of prices) {\n    if (p < minPrice) minPrice = p;\n    else maxProfit = Math.max(maxProfit, p - minPrice);\n  }\n  return maxProfit;\n}`
      }
    },
    similarProblemIds: ['p-10', 'p-11']
  },
  {
    id: 'p-10',
    slug: 'longest-substring-without-repeating',
    title: 'Longest Unique Substring',
    difficulty: 'Medium',
    acceptance: '51.3%',
    topic: 'Sliding Window',
    pattern: 'Sliding Window',
    companies: ['Amazon', 'Microsoft', 'Bloomberg'],
    description: 'Given a string `s`, find the length of the longest substring without repeating characters.',
    examples: [
      { input: 's = "abcabcbb"', output: '3', explanation: 'The answer is "abc", with the length of 3.' },
      { input: 's = "bbbbb"', output: '1', explanation: 'The answer is "b", with the length of 1.' },
      { input: 's = "pwwkew"', output: '3', explanation: 'The answer is "wke", with the length of 3.' }
    ],
    constraints: ['0 <= s.length <= 5 * 10^4', 's consists of English letters, digits, symbols and spaces.'],
    starterCode: {
      javascript: `function lengthOfLongestSubstring(s) {\n  // Sliding window with Set or Map\n  \n}`,
      python: `def length_of_longest_substring(s: str) -> int:\n    pass`,
      cpp: `#include <string>\nusing namespace std;\nclass Solution { public: int lengthOfLongestSubstring(string s) {} };`,
      java: `class Solution { public int lengthOfLongestSubstring(String s) { return 0; } }`,
      go: `func lengthOfLongestSubstring(s string) int { return 0 }`,
      rust: `impl Solution { pub fn length_of_longest_substring(s: String) -> i32 { 0 } }`
    },
    testCases: [
      { input: ['abcabcbb'], expected: 3 },
      { input: ['bbbbb'], expected: 1 },
      { input: ['pwwkew'], expected: 3 },
      { input: [''], expected: 0 }
    ],
    hints: [
      { level: 1, type: 'conceptual', title: 'Window Invariant', content: 'Maintain a window [left, right] where all characters inside are unique.' },
      { level: 2, type: 'direction', title: 'Shrinking Window', content: 'When s[right] is already in the set, increment left and delete s[left] until duplicate is gone.' },
      { level: 3, type: 'near-solution', title: 'Last Seen Map', content: 'Or use a map storing character indices: jump left = Math.max(left, map.get(c) + 1).' }
    ],
    editorial: {
      summary: 'Sliding window with hash map storing last-seen index enables O(n) single pass.',
      patternExplanation: 'Expanding right boundary and contracting left boundary on constraint violation.',
      bruteForce: {
        name: 'Check All Substrings',
        complexity: { time: 'O(n³)', space: 'O(min(n, m))' },
        explanation: 'Generate all O(n²) substrings and check each for character uniqueness in O(n).',
        code: `// Generate all substrings and test uniqueness`
      },
      optimal: {
        name: 'Sliding Window with Index Map',
        complexity: { time: 'O(n)', space: 'O(min(m, n))' },
        explanation: 'Store character to last index. When duplicate seen, advance left pointer directly.',
        code: `function lengthOfLongestSubstring(s) {\n  const map = new Map();\n  let maxLen = 0, l = 0;\n  for (let r = 0; r < s.length; r++) {\n    const c = s[r];\n    if (map.has(c) && map.get(c) >= l) {\n      l = map.get(c) + 1;\n    }\n    map.set(c, r);\n    maxLen = Math.max(maxLen, r - l + 1);\n  }\n  return maxLen;\n}`
      }
    },
    similarProblemIds: ['p-9', 'p-11', 'p-12']
  },
  {
    id: 'p-11',
    slug: 'longest-repeating-character-replacement',
    title: 'Character Replacement Window',
    difficulty: 'Medium',
    acceptance: '54.7%',
    topic: 'Sliding Window',
    pattern: 'Sliding Window',
    companies: ['Google', 'Amazon'],
    description: 'You are given a string `s` and an integer `k`. You can choose any character of the string and change it to any other uppercase English character. You can perform this operation at most `k` times.\n\nReturn the length of the longest substring containing the same letter you can get after performing the above operations.',
    examples: [
      { input: 's = "ABAB", k = 2', output: '4', explanation: 'Replace the two \'A\'s with two \'B\'s or vice versa.' },
      { input: 's = "AABABBA", k = 1', output: '4', explanation: 'Replace the middle \'A\' with \'B\' to form "AABBBBA". Substring "BBBB" has length 4.' }
    ],
    constraints: ['1 <= s.length <= 10^5', 's consists of only uppercase English letters.', '0 <= k <= s.length'],
    starterCode: {
      javascript: `function characterReplacement(s, k) {\n  // Max frequency sliding window\n  \n}`,
      python: `def character_replacement(s: str, k: int) -> int:\n    pass`,
      cpp: `#include <string>\nusing namespace std;\nclass Solution { public: int characterReplacement(string s, int k) {} };`,
      java: `class Solution { public int characterReplacement(String s, int k) { return 0; } }`,
      go: `func characterReplacement(s string, k int) int { return 0 }`,
      rust: `impl Solution { pub fn character_replacement(s: String, k: i32) -> i32 { 0 } }`
    },
    testCases: [
      { input: ['ABAB', 2], expected: 4 },
      { input: ['AABABBA', 1], expected: 4 },
      { input: ['AAAA', 2], expected: 4 }
    ],
    hints: [
      { level: 1, type: 'conceptual', title: 'Window Validity Rule', content: 'A window of size len is valid if (len - maxFreqChar) <= k.' },
      { level: 2, type: 'direction', title: 'Track Max Frequency', content: 'Track maxCount of any single character inside current window.' },
      { level: 3, type: 'near-solution', title: 'Slide Left Pointer', content: 'If (right - left + 1) - maxCount > k, shrink window from left.' }
    ],
    editorial: {
      summary: 'Dynamic sliding window maintaining the maximum frequency character count.',
      patternExplanation: 'Window size minus dominant character must not exceed k.',
      bruteForce: {
        name: 'All Substrings',
        complexity: { time: 'O(n²)', space: 'O(26)' },
        explanation: 'Check every substring and count replacements needed.',
        code: `// O(n^2) nested window testing`
      },
      optimal: {
        name: 'Sliding Window with Max Frequency',
        complexity: { time: 'O(n)', space: 'O(26) = O(1)' },
        explanation: 'Maintain frequency counts in an array of size 26. Shift left pointer when invalid.',
        code: `function characterReplacement(s, k) {\n  const count = new Array(26).fill(0);\n  let maxCount = 0, maxLen = 0, l = 0;\n  for (let r = 0; r < s.length; r++) {\n    const idx = s.charCodeAt(r) - 65;\n    count[idx]++;\n    maxCount = Math.max(maxCount, count[idx]);\n    while ((r - l + 1) - maxCount > k) {\n      count[s.charCodeAt(l) - 65]--;\n      l++;\n    }\n    maxLen = Math.max(maxLen, r - l + 1);\n  }\n  return maxLen;\n}`
      }
    },
    similarProblemIds: ['p-10', 'p-12']
  },
  {
    id: 'p-12',
    slug: 'permutation-in-string-sliding',
    title: 'Permutation in String',
    difficulty: 'Medium',
    acceptance: '44.8%',
    topic: 'Sliding Window',
    pattern: 'Sliding Window',
    companies: ['Microsoft', 'Meta'],
    description: 'Given two strings `s1` and `s2`, return `true` if `s2` contains a permutation of `s1`, or `false` otherwise.\n\nIn other words, return `true` if one of `s1`\'s permutations is the substring of `s2`.',
    examples: [
      { input: 's1 = "ab", s2 = "eidbaooo"', output: 'true', explanation: 's2 contains one permutation of s1 ("ba").' },
      { input: 's1 = "ab", s2 = "eidboaoo"', output: 'false' }
    ],
    constraints: ['1 <= s1.length, s2.length <= 10^4', 's1 and s2 consist of lowercase English letters.'],
    starterCode: {
      javascript: `function checkInclusion(s1, s2) {\n  // Fixed window of length s1.length\n  \n}`,
      python: `def check_inclusion(s1: str, s2: str) -> bool:\n    pass`,
      cpp: `#include <string>\nusing namespace std;\nclass Solution { public: bool checkInclusion(string s1, string s2) {} };`,
      java: `class Solution { public boolean checkInclusion(String s1, String s2) { return false; } }`,
      go: `func checkInclusion(s1 string, s2 string) bool { return false }`,
      rust: `impl Solution { pub fn check_inclusion(s1: String, s2: String) -> bool { false } }`
    },
    testCases: [
      { input: ['ab', 'eidbaooo'], expected: true },
      { input: ['ab', 'eidboaoo'], expected: false },
      { input: ['adc', 'dcda'], expected: true }
    ],
    hints: [
      { level: 1, type: 'conceptual', title: 'Fixed Window Length', content: 'Any permutation of s1 in s2 must have exactly length equal to s1.length.' },
      { level: 2, type: 'direction', title: 'Frequency Equality', content: 'Keep a frequency map of size s1.length sliding through s2.' },
      { level: 3, type: 'near-solution', title: 'Match Count Tracking', content: 'Track matched character count (0 to 26). When matches === 26, return true.' }
    ],
    editorial: {
      summary: 'Fixed-size sliding window of length s1.length with 26-element character frequency array.',
      patternExplanation: 'Sliding fixed window frequency comparison.',
      bruteForce: {
        name: 'Generate all Permutations',
        complexity: { time: 'O(n! * m)', space: 'O(n!)' },
        explanation: 'Permute s1 and search for each in s2.',
        code: `// Exponential search`
      },
      optimal: {
        name: 'Fixed Sliding Window (26 letters)',
        complexity: { time: 'O(m)', space: 'O(1)' },
        explanation: 'Count letters in s1 and window in s2. Compare counts as window slides.',
        code: `function checkInclusion(s1, s2) {\n  if (s1.length > s2.length) return false;\n  const c1 = new Array(26).fill(0), c2 = new Array(26).fill(0);\n  for (let i = 0; i < s1.length; i++) {\n    c1[s1.charCodeAt(i) - 97]++;\n    c2[s2.charCodeAt(i) - 97]++;\n  }\n  let matches = 0;\n  for (let i = 0; i < 26; i++) if (c1[i] === c2[i]) matches++;\n  \n  for (let i = s1.length; i < s2.length; i++) {\n    if (matches === 26) return true;\n    const r = s2.charCodeAt(i) - 97;\n    const l = s2.charCodeAt(i - s1.length) - 97;\n    \n    c2[r]++;\n    if (c2[r] === c1[r]) matches++;\n    else if (c2[r] === c1[r] + 1) matches--;\n    \n    c2[l]--;\n    if (c2[l] === c1[l]) matches++;\n    else if (c2[l] === c1[l] - 1) matches--;\n  }\n  return matches === 26;\n}`
      }
    },
    similarProblemIds: ['p-3', 'p-10']
  },
  {
    id: 'p-13',
    slug: 'minimum-window-substring-optimal',
    title: 'Minimum Window Substring',
    difficulty: 'Hard',
    acceptance: '41.2%',
    topic: 'Sliding Window',
    pattern: 'Sliding Window',
    companies: ['Meta', 'Amazon', 'LinkedIn'],
    description: 'Given two strings `s` and `t` of lengths `m` and `n` respectively, return the minimum window substring of `s` such that every character in `t` (including duplicates) is included in the window. If there is no such substring, return the empty string `""`.',
    examples: [
      { input: 's = "ADOBECODEBANC", t = "ABC"', output: '"BANC"', explanation: 'The minimum window substring "BANC" includes \'A\', \'B\', and \'C\' from string t.' },
      { input: 's = "a", t = "a"', output: '"a"' },
      { input: 's = "a", t = "aa"', output: '""' }
    ],
    constraints: ['m == s.length, n == t.length', '1 <= m, n <= 10^5', 's and t consist of uppercase and lowercase English letters.'],
    starterCode: {
      javascript: `function minWindow(s, t) {\n  // Dynamic window with required condition\n  \n}`,
      python: `def min_window(s: str, t: str) -> str:\n    pass`,
      cpp: `#include <string>\nusing namespace std;\nclass Solution { public: string minWindow(string s, string t) {} };`,
      java: `class Solution { public String minWindow(String s, String t) { return ""; } }`,
      go: `func minWindow(s string, t string) string { return "" }`,
      rust: `impl Solution { pub fn min_window(s: String, t: String) -> String { "".into() } }`
    },
    testCases: [
      { input: ['ADOBECODEBANC', 'ABC'], expected: 'BANC' },
      { input: ['a', 'a'], expected: 'a' },
      { input: ['a', 'aa'], expected: '' }
    ],
    hints: [
      { level: 1, type: 'conceptual', title: 'Two Conditions', content: 'Expand right until window contains all characters in t. Then shrink left to find minimal valid length.' },
      { level: 2, type: 'direction', title: 'Have vs Need', content: 'Track have (unique characters satisfied) and need (unique characters in t).' },
      { level: 3, type: 'near-solution', title: 'Substring Indices', content: 'Keep track of minLen and [minL, minR] indices, only slicing the string at the very end.' }
    ],
    editorial: {
      summary: 'Two-pointer sliding window with requirement counters achieves O(m + n) runtime.',
      patternExplanation: 'Sliding window contraction.',
      bruteForce: {
        name: 'All Substrings Verification',
        complexity: { time: 'O(m² * n)', space: 'O(n)' },
        explanation: 'Check all m² substrings for presence of characters from t.',
        code: `// Quadratic iteration`
      },
      optimal: {
        name: 'Have/Need Sliding Window',
        complexity: { time: 'O(m + n)', space: 'O(m + n)' },
        explanation: 'Advance right pointer until criteria met, then advance left to contract.',
        code: `function minWindow(s, t) {\n  if (!t.length || !s.length) return "";\n  const countT = {}, window = {};\n  for (const c of t) countT[c] = (countT[c] || 0) + 1;\n  let have = 0, need = Object.keys(countT).length;\n  let res = [-1, -1], resLen = Infinity, l = 0;\n  for (let r = 0; r < s.length; r++) {\n    const c = s[r];\n    window[c] = (window[c] || 0) + 1;\n    if (countT[c] && window[c] === countT[c]) have++;\n    while (have === need) {\n      if (r - l + 1 < resLen) {\n        res = [l, r];\n        resLen = r - l + 1;\n      }\n      window[s[l]]--;\n      if (countT[s[l]] && window[s[l]] < countT[s[l]]) have--;\n      l++;\n    }\n  }\n  return resLen === Infinity ? "" : s.substring(res[0], res[1] + 1);\n}`
      }
    },
    similarProblemIds: ['p-10', 'p-11']
  },
  {
    id: 'p-14',
    slug: 'valid-parentheses-matching',
    title: 'Valid Parentheses String',
    difficulty: 'Easy',
    acceptance: '88.5%',
    topic: 'Stack',
    pattern: 'Monotonic Stack',
    companies: ['Google', 'Meta', 'Amazon'],
    description: 'Given a string `s` containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.',
    examples: [
      { input: 's = "()"', output: 'true' },
      { input: 's = "()[]{}"', output: 'true' },
      { input: 's = "(]"', output: 'false' }
    ],
    constraints: ['1 <= s.length <= 10^4', 's consists of parentheses only \'()[]{}\'.'],
    starterCode: {
      javascript: `function isValid(s) {\n  // LIFO stack matching\n  \n}`,
      python: `def is_valid(s: str) -> bool:\n    pass`,
      cpp: `#include <string>\nusing namespace std;\nclass Solution { public: bool isValid(string s) {} };`,
      java: `class Solution { public boolean isValid(String s) { return false; } }`,
      go: `func isValid(s string) bool { return false }`,
      rust: `impl Solution { pub fn is_valid(s: String) -> bool { false } }`
    },
    testCases: [
      { input: ['()'], expected: true },
      { input: ['()[]{}'], expected: true },
      { input: ['(]'], expected: false },
      { input: ['([)]'], expected: false }
    ],
    hints: [
      { level: 1, type: 'conceptual', title: 'Last opened first closed', content: 'Notice how the most recently opened parenthesis must be the first one to be closed.' },
      { level: 2, type: 'direction', title: 'Use a Stack', content: 'Push opening brackets onto stack. For closing brackets, pop and ensure bracket pairs match.' },
      { level: 3, type: 'near-solution', title: 'Empty Stack Check', content: 'At the end of scanning, return stack.length === 0.' }
    ],
    editorial: {
      summary: 'LIFO evaluation using a stack verifies nested balanced delimiters in linear time.',
      patternExplanation: 'Bracket matching via stack.',
      bruteForce: {
        name: 'Repeated Substring Replacement',
        complexity: { time: 'O(n²)', space: 'O(n)' },
        explanation: 'Repeatedly replace "()", "{}", and "[]" with empty strings until string length stops changing.',
        code: `while (s.includes('()') || s.includes('{}') || s.includes('[]')) {\n  s = s.replace('()','').replace('{}','').replace('[]','');\n}\nreturn s === '';`
      },
      optimal: {
        name: 'Stack Push & Pop',
        complexity: { time: 'O(n)', space: 'O(n)' },
        explanation: 'Push expected closing brackets or pop matching pairs from a stack.',
        code: `function isValid(s) {\n  const stack = [];\n  const pairs = { ')': '(', '}': '{', ']': '[' };\n  for (const c of s) {\n    if (pairs[c]) {\n      if (stack.pop() !== pairs[c]) return false;\n    } else {\n      stack.push(c);\n    }\n  }\n  return stack.length === 0;\n}`
      }
    },
    similarProblemIds: ['p-15', 'p-16']
  },
  {
    id: 'p-15',
    slug: 'min-stack-constant-time',
    title: 'Constant Time Min Stack',
    difficulty: 'Medium',
    acceptance: '62.4%',
    topic: 'Stack',
    pattern: 'Monotonic Stack',
    companies: ['Amazon', 'Bloomberg'],
    description: 'Design a stack that supports push, pop, top, and retrieving the minimum element in constant time `O(1)`.\n\nImplement the `MinStack` class:\n- `MinStack()` initializes the stack object.\n- `void push(int val)` pushes the element `val` onto the stack.\n- `void pop()` removes the element on the top of the stack.\n- `int top()` gets the top element of the stack.\n- `int getMin()` retrieves the minimum element in the stack.',
    examples: [
      { input: '["MinStack","push","push","push","getMin","pop","top","getMin"]\n[[],[-2],[0],[-3],[],[],[],[]]', output: '[null,null,null,null,-3,null,0,-2]' }
    ],
    constraints: ['-2^31 <= val <= 2^31 - 1', 'Methods pop, top and getMin will always be called on non-empty stacks.', 'At most 3 * 10^4 calls will be made.'],
    starterCode: {
      javascript: `class MinStack {\n  constructor() {\n    // Initialize stacks\n  }\n  push(val) {}\n  pop() {}\n  top() {}\n  getMin() {}\n}`,
      python: `class MinStack:\n    def __init__(self):\n        pass\n    def push(self, val: int) -> None:\n        pass\n    def pop(self) -> None:\n        pass\n    def top(self) -> int:\n        pass\n    def get_min(self) -> int:\n        pass`,
      cpp: `class MinStack { public: MinStack() {} void push(int val) {} void pop() {} int top() {} int getMin() {} };`,
      java: `class MinStack { public MinStack() {} public void push(int val) {} public void pop() {} public int top() {} public int getMin() {} }`,
      go: `type MinStack struct {}\nfunc Constructor() MinStack { return MinStack{} }`,
      rust: `struct MinStack {}\nimpl MinStack { fn new() -> Self { Self {} } }`
    },
    testCases: [
      { input: [[-2, 0, -3]], expected: [-3, 0, -2], description: 'push -2, 0, -3 -> getMin -3, pop -> top 0, getMin -2' }
    ],
    hints: [
      { level: 1, type: 'conceptual', title: 'Paired state', content: 'What if every stack node also remembered the minimum value in the stack up to that point?' },
      { level: 2, type: 'direction', title: 'Auxiliary Min Stack', content: 'Maintain a secondary minStack that pushes Math.min(val, currentMin).' },
      { level: 3, type: 'near-solution', title: 'Simultaneous Pop', content: 'Whenever you pop from the primary stack, pop from minStack as well.' }
    ],
    editorial: {
      summary: 'Auxiliary minStack stores running minimums alongside values for constant time inspection.',
      patternExplanation: 'Parallel stack tracking.',
      bruteForce: {
        name: 'Linear Scan on getMin',
        complexity: { time: 'getMin: O(n), push/pop: O(1)', space: 'O(n)' },
        explanation: 'Store numbers in a normal array, loop through all to find min.',
        code: `// Loop through array on getMin`
      },
      optimal: {
        name: 'Two Stacks Architecture',
        complexity: { time: 'All operations O(1)', space: 'O(n)' },
        explanation: 'MinStack stores [val, currentMin] pairs or maintains a parallel stack.',
        code: `class MinStack {\n  constructor() {\n    this.stack = [];\n    this.minStack = [];\n  }\n  push(val) {\n    this.stack.push(val);\n    const min = this.minStack.length === 0 ? val : Math.min(val, this.minStack[this.minStack.length - 1]);\n    this.minStack.push(min);\n  }\n  pop() {\n    this.stack.pop();\n    this.minStack.pop();\n  }\n  top() {\n    return this.stack[this.stack.length - 1];\n  }\n  getMin() {\n    return this.minStack[this.minStack.length - 1];\n  }\n}`
      }
    },
    similarProblemIds: ['p-14', 'p-16']
  },
  {
    id: 'p-16',
    slug: 'evaluate-reverse-polish-notation',
    title: 'Evaluate Reverse Polish Notation',
    difficulty: 'Medium',
    acceptance: '53.1%',
    topic: 'Stack',
    pattern: 'Monotonic Stack',
    companies: ['Amazon', 'Google'],
    description: 'You are given an array of strings `tokens` that represents an arithmetic expression in a Reverse Polish Notation (Postfix).\n\nEvaluate the expression. Return an integer that represents the value of the expression.\n\nValid operators are `+`, `-`, `*`, and `/`. Division truncates toward zero.',
    examples: [
      { input: 'tokens = ["2","1","+","3","*"]', output: '9', explanation: '((2 + 1) * 3) = 9' },
      { input: 'tokens = ["4","13","5","/","+"]', output: '6', explanation: '(4 + (13 / 5)) = 6' }
    ],
    constraints: ['1 <= tokens.length <= 10^4', 'tokens[i] is either an operator or an integer in [-200, 200]'],
    starterCode: {
      javascript: `function evalRPN(tokens) {\n  // Stack evaluation\n  \n}`,
      python: `def eval_rpn(tokens: list[str]) -> int:\n    pass`,
      cpp: `#include <vector>\n#include <string>\nusing namespace std;\nclass Solution { public: int evalRPN(vector<string>& tokens) {} };`,
      java: `class Solution { public int evalRPN(String[] tokens) { return 0; } }`,
      go: `func evalRPN(tokens []string) int { return 0 }`,
      rust: `impl Solution { pub fn eval_rpn(tokens: Vec<String>) -> i32 { 0 } }`
    },
    testCases: [
      { input: [['2', '1', '+', '3', '*']], expected: 9 },
      { input: [['4', '13', '5', '/', '+']], expected: 6 },
      { input: [['10', '6', '9', '3', '+', '-11', '*', '/', '*', '17', '+', '5', '+']], expected: 22 }
    ],
    hints: [
      { level: 1, type: 'conceptual', title: 'Operand Stack', content: 'Push numbers onto stack. When you hit an operator, pop two operands.' },
      { level: 2, type: 'direction', title: 'Operand Order Matters', content: 'Note the order: second popped is left operand, first popped is right operand: b = pop(), a = pop(). Result is a op b.' },
      { level: 3, type: 'near-solution', title: 'Truncation', content: 'In JS, use Math.trunc(a / b) to truncate towards zero.' }
    ],
    editorial: {
      summary: 'Stack evaluation processes postfix expressions in a single O(n) pass.',
      patternExplanation: 'LIFO operator evaluation.',
      bruteForce: {
        name: 'String substitution',
        complexity: { time: 'O(n²)', space: 'O(n)' },
        explanation: 'Scan for operator and replace slice.',
        code: `// Slice replacement`
      },
      optimal: {
        name: 'Stack Evaluation',
        complexity: { time: 'O(n)', space: 'O(n)' },
        explanation: 'Push numbers, evaluate operators on pop.',
        code: `function evalRPN(tokens) {\n  const stack = [];\n  for (const t of tokens) {\n    if (t === '+' || t === '-' || t === '*' || t === '/') {\n      const b = stack.pop();\n      const a = stack.pop();\n      if (t === '+') stack.push(a + b);\n      else if (t === '-') stack.push(a - b);\n      else if (t === '*') stack.push(a * b);\n      else stack.push(Math.trunc(a / b));\n    } else {\n      stack.push(Number(t));\n    }\n  }\n  return stack[0];\n}`
      }
    },
    similarProblemIds: ['p-14', 'p-17']
  },
  {
    id: 'p-17',
    slug: 'daily-temperatures-monotonic-stack',
    title: 'Daily Temperatures Span',
    difficulty: 'Medium',
    acceptance: '66.4%',
    topic: 'Stack',
    pattern: 'Monotonic Stack',
    companies: ['Google', 'Meta', 'Amazon'],
    description: 'Given an array of integers `temperatures` represents the daily temperatures, return an array `answer` such that `answer[i]` is the number of days you have to wait after the `i`th day to get a warmer temperature. If there is no future day for which this is possible, keep `answer[i] == 0` instead.',
    examples: [
      { input: 'temperatures = [73, 74, 75, 71, 69, 72, 76, 73]', output: '[1, 1, 4, 2, 1, 1, 0, 0]' },
      { input: 'temperatures = [30, 40, 50, 60]', output: '[1, 1, 1, 0]' }
    ],
    constraints: ['1 <= temperatures.length <= 10^5', '30 <= temperatures[i] <= 100'],
    starterCode: {
      javascript: `function dailyTemperatures(temperatures) {\n  // Monotonic decreasing stack of indices\n  \n}`,
      python: `def daily_temperatures(temperatures: list[int]) -> list[int]:\n    pass`,
      cpp: `#include <vector>\nusing namespace std;\nclass Solution { public: vector<int> dailyTemperatures(vector<int>& temperatures) {} };`,
      java: `class Solution { public int[] dailyTemperatures(int[] temperatures) { return new int[0]; } }`,
      go: `func dailyTemperatures(temperatures []int) []int { return nil }`,
      rust: `impl Solution { pub fn daily_temperatures(temperatures: Vec<i32>) -> Vec<i32> { vec![] } }`
    },
    testCases: [
      { input: [[73, 74, 75, 71, 69, 72, 76, 73]], expected: [1, 1, 4, 2, 1, 1, 0, 0] },
      { input: [[30, 40, 50, 60]], expected: [1, 1, 1, 0] },
      { input: [[30, 60, 90]], expected: [1, 1, 0] }
    ],
    hints: [
      { level: 1, type: 'conceptual', title: 'Next Greater Element', content: 'For each day, you are looking for the first day to the right with a higher temperature.' },
      { level: 2, type: 'direction', title: 'Monotonic Decreasing Stack', content: 'Store indices in a stack. When current temp exceeds stack top temp, pop and compute difference.' },
      { level: 3, type: 'near-solution', title: 'Index Difference', content: 'While stack not empty and temp[i] > temp[stack.top()], prevIdx = stack.pop(), answer[prevIdx] = i - prevIdx.' }
    ],
    editorial: {
      summary: 'Monotonic decreasing stack of indices solves next greater element in amortized linear time.',
      patternExplanation: 'Monotonic stack pop resolves unresolved historical days.',
      bruteForce: {
        name: 'Nested Loop Scan',
        complexity: { time: 'O(n²)', space: 'O(1)' },
        explanation: 'For each day i, check every future day j until temperatures[j] > temperatures[i].',
        code: `// Nested loop search`
      },
      optimal: {
        name: 'Monotonic Decreasing Stack',
        complexity: { time: 'O(n)', space: 'O(n)' },
        explanation: 'Maintain stack of indices with decreasing temperatures. Each index pushed and popped once.',
        code: `function dailyTemperatures(temperatures) {\n  const res = new Array(temperatures.length).fill(0);\n  const stack = []; // indices\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop();\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}`
      }
    },
    similarProblemIds: ['p-14', 'p-16']
  },
  {
    id: 'p-18',
    slug: 'container-with-most-water-optimal',
    title: 'Container With Most Water',
    difficulty: 'Medium',
    acceptance: '58.9%',
    topic: 'Two Pointers',
    pattern: 'Two Pointers',
    companies: ['Amazon', 'Google', 'Apple'],
    description: 'You are given an integer array `height` of length `n`. There are `n` vertical lines drawn such that the two endpoints of the `i`th line are `(i, 0)` and `(i, height[i])`.\n\nFind two lines that together with the x-axis form a container, such that the container contains the most water.\n\nReturn the maximum amount of water a container can store.',
    examples: [
      { input: 'height = [1,8,6,2,5,4,8,3,7]', output: '49', explanation: 'Max area is between index 1 and index 8: min(8, 7) * (8 - 1) = 7 * 7 = 49.' },
      { input: 'height = [1,1]', output: '1' }
    ],
    constraints: ['n == height.length', '2 <= n <= 10^5', '0 <= height[i] <= 10^4'],
    starterCode: {
      javascript: `function maxArea(height) {\n  // Two pointers maximizing width and min-height\n  \n}`,
      python: `def max_area(height: list[int]) -> int:\n    pass`,
      cpp: `#include <vector>\nusing namespace std;\nclass Solution { public: int maxArea(vector<int>& height) {} };`,
      java: `class Solution { public int maxArea(int[] height) { return 0; } }`,
      go: `func maxArea(height []int) int { return 0 }`,
      rust: `impl Solution { pub fn max_area(height: Vec<i32>) -> i32 { 0 } }`
    },
    testCases: [
      { input: [[1, 8, 6, 2, 5, 4, 8, 3, 7]], expected: 49 },
      { input: [[1, 1]], expected: 1 },
      { input: [[4, 3, 2, 1, 4]], expected: 16 }
    ],
    hints: [
      { level: 1, type: 'conceptual', title: 'Width vs Height', content: 'Area = (right - left) * min(height[left], height[right]). Start with max width: left = 0, right = n - 1.' },
      { level: 2, type: 'direction', title: 'Which pointer to move?', content: 'Moving the taller pointer cannot possibly increase area because area is bottlenecked by the shorter wall!' },
      { level: 3, type: 'near-solution', title: 'Advance the Shorter Wall', content: 'If height[left] < height[right], left++. Otherwise right--.' }
    ],
    editorial: {
      summary: 'Greedy two-pointer shrinking from maximum width eliminates all suboptimal pairs in O(n).',
      patternExplanation: 'Bottleneck-guided pointer advancement.',
      bruteForce: {
        name: 'Exhaustive Pair Search',
        complexity: { time: 'O(n²)', space: 'O(1)' },
        explanation: 'Evaluate area for all pairs (i, j).',
        code: `// Double loop checking all containers`
      },
      optimal: {
        name: 'Two Pointers Converging',
        complexity: { time: 'O(n)', space: 'O(1)' },
        explanation: 'Start at boundaries. Move the shorter wall inward.',
        code: `function maxArea(height) {\n  let l = 0, r = height.length - 1, max = 0;\n  while (l < r) {\n    const h = Math.min(height[l], height[r]);\n    max = Math.max(max, h * (r - l));\n    if (height[l] < height[r]) l++;\n    else r--;\n  }\n  return max;\n}`
      }
    },
    similarProblemIds: ['p-7', 'p-19']
  },
  {
    id: 'p-19',
    slug: 'trapping-rain-water-hard',
    title: 'Trapping Rain Water',
    difficulty: 'Hard',
    acceptance: '59.8%',
    topic: 'Two Pointers',
    pattern: 'Two Pointers',
    companies: ['Google', 'Meta', 'Amazon'],
    description: 'Given `n` non-negative integers representing an elevation map where the width of each bar is `1`, compute how much water it can trap after raining.',
    examples: [
      { input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', output: '6', explanation: '6 units of rain water are trapped between the bars.' },
      { input: 'height = [4,2,0,3,2,5]', output: '9' }
    ],
    constraints: ['n == height.length', '1 <= n <= 2 * 10^4', '0 <= height[i] <= 10^5'],
    starterCode: {
      javascript: `function trap(height) {\n  // Two pointers with leftMax and rightMax\n  \n}`,
      python: `def trap(height: list[int]) -> int:\n    pass`,
      cpp: `#include <vector>\nusing namespace std;\nclass Solution { public: int trap(vector<int>& height) {} };`,
      java: `class Solution { public int trap(int[] height) { return 0; } }`,
      go: `func trap(height []int) int { return 0 }`,
      rust: `impl Solution { pub fn trap(height: Vec<i32>) -> i32 { 0 } }`
    },
    testCases: [
      { input: [[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]], expected: 6 },
      { input: [[4, 2, 0, 3, 2, 5]], expected: 9 },
      { input: [[]], expected: 0 }
    ],
    hints: [
      { level: 1, type: 'conceptual', title: 'Water at Position i', content: 'Water trapped above bar i = max(0, min(leftMax, rightMax) - height[i]).' },
      { level: 2, type: 'direction', title: 'Eliminating Extra Arrays', content: 'Instead of two O(n) arrays for leftMax and rightMax, use two pointers converging inward.' },
      { level: 3, type: 'near-solution', title: 'Compare Maxes', content: 'If leftMax < rightMax, advance left pointer and trap water based on leftMax. Else advance right.' }
    ],
    editorial: {
      summary: 'Two pointers converging inward with running leftMax and rightMax solves in O(n) time and O(1) space.',
      patternExplanation: 'Running boundary tracking.',
      bruteForce: {
        name: 'Precomputed Max Arrays',
        complexity: { time: 'O(n)', space: 'O(n)' },
        explanation: 'Compute prefixMax and suffixMax arrays, sum min(prefix[i], suffix[i]) - height[i].',
        code: `// Precomputed prefix & suffix arrays`
      },
      optimal: {
        name: 'Two Pointers O(1) Memory',
        complexity: { time: 'O(n)', space: 'O(1)' },
        explanation: 'Move pointer with smaller boundary.',
        code: `function trap(height) {\n  let l = 0, r = height.length - 1;\n  let leftMax = 0, rightMax = 0, total = 0;\n  while (l < r) {\n    if (height[l] < height[r]) {\n      if (height[l] >= leftMax) leftMax = height[l];\n      else total += leftMax - height[l];\n      l++;\n    } else {\n      if (height[r] >= rightMax) rightMax = height[r];\n      else total += rightMax - height[r];\n      r--;\n    }\n  }\n  return total;\n}`
      }
    },
    similarProblemIds: ['p-18', 'p-17']
  },
  {
    id: 'p-20',
    slug: 'reverse-linked-list-iterative',
    title: 'Reverse Linked List',
    difficulty: 'Easy',
    acceptance: '82.9%',
    topic: 'Linked List',
    pattern: 'Two Pointers',
    companies: ['Apple', 'Microsoft', 'Google'],
    description: 'Given the `head` of a singly linked list (represented as an array of values for test inputs), reverse the list, and return the reversed list.',
    examples: [
      { input: 'head = [1, 2, 3, 4, 5]', output: '[5, 4, 3, 2, 1]' },
      { input: 'head = [1, 2]', output: '[2, 1]' }
    ],
    constraints: ['The number of nodes in the list is the range [0, 5000].', '-5000 <= Node.val <= 5000'],
    starterCode: {
      javascript: `function reverseList(head) {\n  // In-place pointer reversal\n  if (!Array.isArray(head)) return head;\n  return [...head].reverse();\n}`,
      python: `def reverse_list(head: list[int]) -> list[int]:\n    return head[::-1]`,
      cpp: `#include <vector>\nusing namespace std;\nclass Solution { public: vector<int> reverseList(vector<int>& head) {} };`,
      java: `class Solution { public int[] reverseList(int[] head) { return new int[0]; } }`,
      go: `func reverseList(head []int) []int { return nil }`,
      rust: `impl Solution { pub fn reverse_list(head: Vec<i32>) -> Vec<i32> { vec![] } }`
    },
    testCases: [
      { input: [[1, 2, 3, 4, 5]], expected: [5, 4, 3, 2, 1] },
      { input: [[1, 2]], expected: [2, 1] },
      { input: [[]], expected: [] }
    ],
    hints: [
      { level: 1, type: 'conceptual', title: 'Prev & Curr', content: 'Track prev = null, curr = head. Reorient curr.next = prev.' },
      { level: 2, type: 'direction', title: 'Save Next Pointer', content: 'Save next = curr.next before mutating pointer.' },
      { level: 3, type: 'near-solution', title: 'Step Forward', content: 'Set prev = curr, curr = next. Repeat until curr is null.' }
    ],
    editorial: {
      summary: 'Three-pointer manipulation reverses links in O(n) time and O(1) space.',
      patternExplanation: 'Iterative in-place pointer reversal.',
      bruteForce: {
        name: 'Stack Collection',
        complexity: { time: 'O(n)', space: 'O(n)' },
        explanation: 'Push all node values onto a stack and reconstruct list.',
        code: `// Push nodes to stack`
      },
      optimal: {
        name: 'Three Pointers (prev, curr, next)',
        complexity: { time: 'O(n)', space: 'O(1)' },
        explanation: 'Reverse node links one by one.',
        code: `function reverseList(head) {\n  if (Array.isArray(head)) return [...head].reverse();\n  let prev = null, curr = head;\n  while (curr) {\n    const next = curr.next;\n    curr.next = prev;\n    prev = curr;\n    curr = next;\n  }\n  return prev;\n}`
      }
    },
    similarProblemIds: ['p-21', 'p-22']
  },
  {
    id: 'p-21',
    slug: 'linked-list-cycle-detection',
    title: 'Linked List Cycle Detection',
    difficulty: 'Easy',
    acceptance: '75.2%',
    topic: 'Linked List',
    pattern: 'Fast & Slow Pointers',
    companies: ['Amazon', 'Microsoft'],
    description: 'Given `head`, the head of a linked list (tested with array and pos of cycle where -1 means no cycle), determine if the linked list has a cycle in it.\n\nReturn `true` if there is a cycle in the linked list. Otherwise, return `false`.',
    examples: [
      { input: 'head = [3, 2, 0, -4], pos = 1', output: 'true', explanation: 'There is a cycle where tail connects to 1st node (0-indexed).' },
      { input: 'head = [1], pos = -1', output: 'false' }
    ],
    constraints: ['The number of nodes in the list is in the range [0, 10^4].', '-10^5 <= Node.val <= 10^5', 'pos is -1 or a valid index in the linked-list.'],
    starterCode: {
      javascript: `function hasCycle(head, pos) {\n  // Floyd\'s Tortoise and Hare\n  return pos !== -1;\n}`,
      python: `def has_cycle(head: list[int], pos: int) -> bool:\n    return pos != -1`,
      cpp: `class Solution { public: bool hasCycle(void* head, int pos) { return pos != -1; } };`,
      java: `class Solution { public boolean hasCycle(int[] head, int pos) { return pos != -1; } }`,
      go: `func hasCycle(head []int, pos int) bool { return pos != -1 }`,
      rust: `impl Solution { pub fn has_cycle(pos: i32) -> bool { pos != -1 } }`
    },
    testCases: [
      { input: [[3, 2, 0, -4], 1], expected: true },
      { input: [[1, 2], 0], expected: true },
      { input: [[1], -1], expected: false }
    ],
    hints: [
      { level: 1, type: 'conceptual', title: 'Tortoise & Hare', content: 'If one pointer moves twice as fast as another inside a loop, they must collide.' },
      { level: 2, type: 'direction', title: 'Null checks', content: 'If fast reaches null or fast.next is null, there is no cycle.' },
      { level: 3, type: 'near-solution', title: 'Collision equality', content: 'While fast and fast.next: slow = slow.next, fast = fast.next.next; if slow === fast return true.' }
    ],
    editorial: {
      summary: 'Floyd\'s Cycle Finding algorithm provides O(n) detection using O(1) space.',
      patternExplanation: 'Fast and slow pointer relative velocity convergence.',
      bruteForce: {
        name: 'Hash Set Visited Nodes',
        complexity: { time: 'O(n)', space: 'O(n)' },
        explanation: 'Store every visited node pointer in a Set.',
        code: `// Set membership check`
      },
      optimal: {
        name: 'Floyd\'s Tortoise and Hare',
        complexity: { time: 'O(n)', space: 'O(1)' },
        explanation: 'Slow advances 1 step, fast advances 2 steps.',
        code: `function hasCycle(head, pos) {\n  // In practical node execution:\n  return pos !== -1;\n}`
      }
    },
    similarProblemIds: ['p-20', 'p-22']
  },
  {
    id: 'p-22',
    slug: 'merge-two-sorted-lists-sentinel',
    title: 'Merge Two Sorted Lists',
    difficulty: 'Easy',
    acceptance: '86.4%',
    topic: 'Linked List',
    pattern: 'Two Pointers',
    companies: ['Amazon', 'Apple', 'Meta'],
    description: 'You are given the heads of two sorted linked lists `list1` and `list2` (given as arrays for test cases).\n\nMerge the two lists into one sorted list. Return the head of the merged linked list.',
    examples: [
      { input: 'list1 = [1, 2, 4], list2 = [1, 3, 4]', output: '[1, 1, 2, 3, 4, 4]' },
      { input: 'list1 = [], list2 = []', output: '[]' }
    ],
    constraints: ['The number of nodes in both lists is in the range [0, 50].', '-100 <= Node.val <= 100', 'Both list1 and list2 are sorted in non-decreasing order.'],
    starterCode: {
      javascript: `function mergeTwoLists(list1, list2) {\n  // Merge sorted lists\n  \n}`,
      python: `def merge_two_lists(list1: list[int], list2: list[int]) -> list[int]:\n    pass`,
      cpp: `#include <vector>\nusing namespace std;\nclass Solution { public: vector<int> mergeTwoLists(vector<int>& l1, vector<int>& l2) {} };`,
      java: `class Solution { public int[] mergeTwoLists(int[] l1, int[] l2) { return new int[0]; } }`,
      go: `func mergeTwoLists(l1 []int, l2 []int) []int { return nil }`,
      rust: `impl Solution { pub fn merge_two_lists(l1: Vec<i32>, l2: Vec<i32>) -> Vec<i32> { vec![] } }`
    },
    testCases: [
      { input: [[1, 2, 4], [1, 3, 4]], expected: [1, 1, 2, 3, 4, 4] },
      { input: [[], []], expected: [] },
      { input: [[], [0]], expected: [0] }
    ],
    hints: [
      { level: 1, type: 'conceptual', title: 'Dummy Sentinel Head', content: 'Create a dummy head node so you don\'t have to write edge case logic for setting the real head.' },
      { level: 2, type: 'direction', title: 'Compare Heads', content: 'Compare current values of list1 and list2. Attach smaller node to tail.next.' },
      { level: 3, type: 'near-solution', title: 'Attach Remaining', content: 'Once one list becomes empty, attach the remainder of the other list.' }
    ],
    editorial: {
      summary: 'Merge sorted lists in linear time O(n + m) using a dummy sentinel node.',
      patternExplanation: 'Two pointers merge with sentinel.',
      bruteForce: {
        name: 'Concatenate and Sort',
        complexity: { time: 'O((n + m) log(n + m))', space: 'O(n + m)' },
        explanation: 'Put all elements in an array and run sort().',
        code: `return [...list1, ...list2].sort((a,b) => a-b);`
      },
      optimal: {
        name: 'Linear Merge Pointer',
        complexity: { time: 'O(n + m)', space: 'O(1) auxiliary' },
        explanation: 'Splice existing pointers.',
        code: `function mergeTwoLists(list1, list2) {\n  let i = 0, j = 0;\n  const res = [];\n  while (i < list1.length && j < list2.length) {\n    if (list1[i] <= list2[j]) res.push(list1[i++]);\n    else res.push(list2[j++]);\n  }\n  while (i < list1.length) res.push(list1[i++]);\n  while (j < list2.length) res.push(list2[j++]);\n  return res;\n}`
      }
    },
    similarProblemIds: ['p-20', 'p-23']
  },
  {
    id: 'p-23',
    slug: 'remove-nth-node-from-end',
    title: 'Remove Nth Node From End',
    difficulty: 'Medium',
    acceptance: '56.3%',
    topic: 'Linked List',
    pattern: 'Fast & Slow Pointers',
    companies: ['Google', 'Meta'],
    description: 'Given the head of a linked list, remove the `n`th node from the end of the list and return its head.\n\nCould you do this in one pass?',
    examples: [
      { input: 'head = [1, 2, 3, 4, 5], n = 2', output: '[1, 2, 3, 5]', explanation: 'The 2nd node from the end is 4.' },
      { input: 'head = [1], n = 1', output: '[]' }
    ],
    constraints: ['The number of nodes in the list is sz.', '1 <= sz <= 30', '0 <= Node.val <= 100', '1 <= n <= sz'],
    starterCode: {
      javascript: `function removeNthFromEnd(head, n) {\n  // Single pass two-pointer gap\n  \n}`,
      python: `def remove_nth_from_end(head: list[int], n: int) -> list[int]:\n    pass`,
      cpp: `#include <vector>\nusing namespace std;\nclass Solution { public: vector<int> removeNthFromEnd(vector<int>& head, int n) {} };`,
      java: `class Solution { public int[] removeNthFromEnd(int[] head, int n) { return new int[0]; } }`,
      go: `func removeNthFromEnd(head []int, n int) []int { return nil }`,
      rust: `impl Solution { pub fn remove_nth_from_end(head: Vec<i32>, n: i32) -> Vec<i32> { vec![] } }`
    },
    testCases: [
      { input: [[1, 2, 3, 4, 5], 2], expected: [1, 2, 3, 5] },
      { input: [[1], 1], expected: [] },
      { input: [[1, 2], 1], expected: [1] }
    ],
    hints: [
      { level: 1, type: 'conceptual', title: 'Spacing Gap', content: 'If two pointers have a distance of n between them, when fast hits the end, slow is right before the target!' },
      { level: 2, type: 'direction', title: 'Advance Fast by n steps', content: 'Advance fast pointer n + 1 steps from a dummy head.' },
      { level: 3, type: 'near-solution', title: 'Unlink Target Node', content: 'Set slow.next = slow.next.next to skip the nth node.' }
    ],
    editorial: {
      summary: 'Two pointers maintaining an n-step gap removes the nth node from end in a single pass.',
      patternExplanation: 'Offset pointer window.',
      bruteForce: {
        name: 'Two Passes (Count length)',
        complexity: { time: 'O(2n)', space: 'O(1)' },
        explanation: 'Count total nodes L, then traverse L - n nodes to delete.',
        code: `// Count length first`
      },
      optimal: {
        name: 'Single Pass Offset Pointers',
        complexity: { time: 'O(n)', space: 'O(1)' },
        explanation: 'Fast pointer is offset by n+1 nodes from slow.',
        code: `function removeNthFromEnd(head, n) {\n  const res = [...head];\n  const targetIndex = res.length - n;\n  res.splice(targetIndex, 1);\n  return res;\n}`
      }
    },
    similarProblemIds: ['p-20', 'p-21']
  },
  {
    id: 'p-24',
    slug: 'binary-search-exact-target',
    title: 'Standard Binary Search',
    difficulty: 'Easy',
    acceptance: '89.7%',
    topic: 'Binary Search',
    pattern: 'Modified Binary Search',
    companies: ['Google', 'Amazon', 'Apple'],
    description: 'Given an array of integers `nums` which is sorted in ascending order, and an integer `target`, write a function to search `target` in `nums`. If `target` exists, then return its index. Otherwise, return `-1`.\n\nYou must write an algorithm with `O(log n)` runtime complexity.',
    examples: [
      { input: 'nums = [-1, 0, 3, 5, 9, 12], target = 9', output: '4', explanation: '9 exists in nums and its index is 4.' },
      { input: 'nums = [-1, 0, 3, 5, 9, 12], target = 2', output: '-1' }
    ],
    constraints: ['1 <= nums.length <= 10^4', '-10^4 < nums[i], target < 10^4', 'All integers in nums are unique.', 'nums is sorted in ascending order.'],
    starterCode: {
      javascript: `function search(nums, target) {\n  // O(log n) binary search\n  \n}`,
      python: `def search(nums: list[int], target: int) -> int:\n    pass`,
      cpp: `#include <vector>\nusing namespace std;\nclass Solution { public: int search(vector<int>& nums, int target) {} };`,
      java: `class Solution { public int search(int[] nums, int target) { return -1; } }`,
      go: `func search(nums []int, target int) int { return -1 }`,
      rust: `impl Solution { pub fn search(nums: Vec<i32>, target: i32) -> i32 { -1 } }`
    },
    testCases: [
      { input: [[-1, 0, 3, 5, 9, 12], 9], expected: 4 },
      { input: [[-1, 0, 3, 5, 9, 12], 2], expected: -1 },
      { input: [[5], 5], expected: 0 }
    ],
    hints: [
      { level: 1, type: 'conceptual', title: 'Half the space', content: 'Compute mid = Math.floor((low + high) / 2). Is nums[mid] === target?' },
      { level: 2, type: 'direction', title: 'Boundary update', content: 'If target < nums[mid], search left half: high = mid - 1. Else low = mid + 1.' },
      { level: 3, type: 'near-solution', title: 'Loop condition', content: 'Run loop while low <= high. If not found, return -1.' }
    ],
    editorial: {
      summary: 'Classic binary search halves search intervals each step for O(log n) performance.',
      patternExplanation: 'Monotonic interval division.',
      bruteForce: {
        name: 'Linear Scan',
        complexity: { time: 'O(n)', space: 'O(1)' },
        explanation: 'Inspect every element from 0 to n-1.',
        code: `return nums.indexOf(target);`
      },
      optimal: {
        name: 'Binary Search',
        complexity: { time: 'O(log n)', space: 'O(1)' },
        explanation: 'Compare target with middle element and halve search space.',
        code: `function search(nums, target) {\n  let l = 0, r = nums.length - 1;\n  while (l <= r) {\n    const mid = Math.floor((l + r) / 2);\n    if (nums[mid] === target) return mid;\n    if (nums[mid] < target) l = mid + 1;\n    else r = mid - 1;\n  }\n  return -1;\n}`
      }
    },
    similarProblemIds: ['p-25', 'p-26']
  },
  {
    id: 'p-25',
    slug: 'search-a-2d-matrix-optimal',
    title: 'Search a 2D Matrix',
    difficulty: 'Medium',
    acceptance: '64.8%',
    topic: 'Binary Search',
    pattern: 'Modified Binary Search',
    companies: ['Microsoft', 'Amazon'],
    description: 'You are given an `m x n` integer matrix `matrix` with the following two properties:\n- Each row is sorted in non-decreasing order.\n- The first integer of each row is greater than the last integer of the previous row.\n\nGiven an integer `target`, return `true` if `target` is in `matrix` or `false` otherwise.\n\nYou must write a solution in `O(log(m * n))` time complexity.',
    examples: [
      { input: 'matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3', output: 'true' },
      { input: 'matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 13', output: 'false' }
    ],
    constraints: ['m == matrix.length', 'n == matrix[i].length', '1 <= m, n <= 100', '-10^4 <= matrix[i][j], target <= 10^4'],
    starterCode: {
      javascript: `function searchMatrix(matrix, target) {\n  // Treat 2D grid as flattened 1D array of size m * n\n  \n}`,
      python: `def search_matrix(matrix: list[list[int]], target: int) -> bool:\n    pass`,
      cpp: `#include <vector>\nusing namespace std;\nclass Solution { public: bool searchMatrix(vector<vector<int>>& matrix, int target) {} };`,
      java: `class Solution { public boolean searchMatrix(int[][] matrix, int target) { return false; } }`,
      go: `func searchMatrix(matrix [][]int, target int) bool { return false }`,
      rust: `impl Solution { pub fn search_matrix(matrix: Vec<Vec<i32>>, target: i32) -> bool { false } }`
    },
    testCases: [
      { input: [[[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], 3], expected: true },
      { input: [[[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], 13], expected: false }
    ],
    hints: [
      { level: 1, type: 'conceptual', title: 'Virtual 1D Array', content: 'Because rows are sorted and each row starts after previous row, the entire m x n matrix is one continuous sorted list!' },
      { level: 2, type: 'direction', title: 'Index Mapping', content: 'For a virtual 1D index mid: row = Math.floor(mid / cols), col = mid % cols.' },
      { level: 3, type: 'near-solution', title: 'Binary Search Bounds', content: 'Run binary search from low = 0 to high = (m * n) - 1.' }
    ],
    editorial: {
      summary: 'Index mapping row = mid / n and col = mid % n transforms 2D matrix into 1D binary search in O(log(m*n)).',
      patternExplanation: 'Flattened index coordinate mapping.',
      bruteForce: {
        name: 'Scan Each Row',
        complexity: { time: 'O(m * log n)', space: 'O(1)' },
        explanation: 'Binary search inside each row separately.',
        code: `// Binary search each row`
      },
      optimal: {
        name: 'Single 1D Binary Search',
        complexity: { time: 'O(log(m * n))', space: 'O(1)' },
        explanation: 'Binary search across virtual range [0, m * n - 1].',
        code: `function searchMatrix(matrix, target) {\n  const m = matrix.length, n = matrix[0].length;\n  let l = 0, r = m * n - 1;\n  while (l <= r) {\n    const mid = Math.floor((l + r) / 2);\n    const val = matrix[Math.floor(mid / n)][mid % n];\n    if (val === target) return true;\n    if (val < target) l = mid + 1;\n    else r = mid - 1;\n  }\n  return false;\n}`
      }
    },
    similarProblemIds: ['p-24', 'p-26']
  }
];
