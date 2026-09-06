import { StudyPlan } from '../types';

/**
 * CodeSpark Curated Study Plans
 * Each plan maps to real problem IDs from the existing problem library.
 * Progress is tracked per-user in localStorage.
 */
export const STUDY_PLANS_DATA: StudyPlan[] = [
  {
    id: 'sp-dsa-foundations',
    slug: 'dsa-foundations',
    title: 'CodeSpark DSA Foundations',
    description: 'Build a rock-solid algorithmic foundation. Covers arrays, hashing, two pointers, and basic searching — the building blocks for every technical interview.',
    difficulty: 'Beginner',
    estimatedDuration: '2–3 weeks',
    totalProblems: 20,
    badgeIcon: 'BookOpen',
    sections: [
      {
        id: 'sp-dsa-f-s1',
        title: 'Arrays & Hash Maps',
        description: 'Master frequency counting, complement lookups, and array manipulation.',
        position: 1,
        problems: [
          { problemId: 'p-1', title: 'Pair Sum Target', slug: 'two-sum-indices', difficulty: 'Easy', topic: 'Arrays', pattern: 'Hash Map', estimatedMinutes: 10 },
          { problemId: 'p-2', title: 'Valid Anagram Check', slug: 'valid-anagram-check', difficulty: 'Easy', topic: 'Strings', pattern: 'Frequency Map', estimatedMinutes: 10 },
          { problemId: 'p-3', title: 'Group Anagrams', slug: 'group-anagrams', difficulty: 'Medium', topic: 'Strings', pattern: 'Hash Map', estimatedMinutes: 20 },
          { problemId: 'p-4', title: 'Contains Duplicate', slug: 'contains-duplicate', difficulty: 'Easy', topic: 'Arrays', pattern: 'Hash Set', estimatedMinutes: 8 },
          { problemId: 'p-5', title: 'Top K Frequent Elements', slug: 'top-k-frequent-elements', difficulty: 'Medium', topic: 'Arrays', pattern: 'Frequency Map', estimatedMinutes: 20 },
        ]
      },
      {
        id: 'sp-dsa-f-s2',
        title: 'Two Pointers',
        description: 'Learn converging pointer techniques for sorted arrays and palindromes.',
        position: 2,
        problems: [
          { problemId: 'p-6', title: 'Valid Palindrome', slug: 'valid-palindrome', difficulty: 'Easy', topic: 'Two Pointers', pattern: 'Two Pointer', estimatedMinutes: 10 },
          { problemId: 'p-7', title: 'Three Sum', slug: 'three-sum', difficulty: 'Medium', topic: 'Two Pointers', pattern: 'Two Pointer', estimatedMinutes: 25 },
          { problemId: 'p-8', title: 'Container With Most Water', slug: 'container-with-most-water', difficulty: 'Medium', topic: 'Two Pointers', pattern: 'Two Pointer', estimatedMinutes: 20 },
          { problemId: 'p-18', title: 'Merge Sorted Arrays', slug: 'merge-sorted-arrays', difficulty: 'Easy', topic: 'Two Pointers', pattern: 'Two Pointer', estimatedMinutes: 10 },
          { problemId: 'p-19', title: 'Trapping Rain Water', slug: 'trapping-rain-water', difficulty: 'Hard', topic: 'Two Pointers', pattern: 'Two Pointer', estimatedMinutes: 35 },
        ]
      },
      {
        id: 'sp-dsa-f-s3',
        title: 'Sliding Window',
        description: 'Dynamic subarray boundaries for longest/shortest substring problems.',
        position: 3,
        problems: [
          { problemId: 'p-9', title: 'Best Time to Trade', slug: 'best-time-to-trade', difficulty: 'Easy', topic: 'Sliding Window', pattern: 'Sliding Window', estimatedMinutes: 10 },
          { problemId: 'p-10', title: 'Longest Unique Window', slug: 'longest-unique-window', difficulty: 'Medium', topic: 'Sliding Window', pattern: 'Sliding Window', estimatedMinutes: 20 },
          { problemId: 'p-11', title: 'Minimum Window Substring', slug: 'minimum-window-substring', difficulty: 'Hard', topic: 'Sliding Window', pattern: 'Sliding Window', estimatedMinutes: 35 },
          { problemId: 'p-12', title: 'Longest Repeating Replacement', slug: 'longest-repeating-replacement', difficulty: 'Medium', topic: 'Sliding Window', pattern: 'Sliding Window', estimatedMinutes: 20 },
          { problemId: 'p-13', title: 'Permutation in String', slug: 'permutation-in-string', difficulty: 'Medium', topic: 'Sliding Window', pattern: 'Sliding Window', estimatedMinutes: 20 },
        ]
      },
      {
        id: 'sp-dsa-f-s4',
        title: 'Stack & Binary Search',
        description: 'LIFO structures and logarithmic search for efficient problem solving.',
        position: 4,
        problems: [
          { problemId: 'p-14', title: 'Valid Parentheses', slug: 'valid-parentheses', difficulty: 'Easy', topic: 'Stack', pattern: 'Stack', estimatedMinutes: 10 },
          { problemId: 'p-15', title: 'Min Stack', slug: 'min-stack', difficulty: 'Medium', topic: 'Stack', pattern: 'Stack', estimatedMinutes: 15 },
          { problemId: 'p-24', title: 'Binary Search', slug: 'binary-search', difficulty: 'Easy', topic: 'Binary Search', pattern: 'Binary Search', estimatedMinutes: 10 },
          { problemId: 'p-25', title: 'Search Rotated Array', slug: 'search-rotated-array', difficulty: 'Medium', topic: 'Binary Search', pattern: 'Binary Search', estimatedMinutes: 20 },
          { problemId: 'p-26', title: 'Find Minimum in Rotated', slug: 'find-minimum-rotated', difficulty: 'Medium', topic: 'Binary Search', pattern: 'Binary Search', estimatedMinutes: 20 },
        ]
      },
    ]
  },
  {
    id: 'sp-interview-core',
    slug: 'interview-core',
    title: 'CodeSpark Interview Core',
    description: 'The essential 30 problems every engineer should solve before a technical interview. Covers the most commonly tested patterns and data structures.',
    difficulty: 'Intermediate',
    estimatedDuration: '3–4 weeks',
    totalProblems: 30,
    badgeIcon: 'Target',
    sections: [
      {
        id: 'sp-ic-s1',
        title: 'Arrays & Hashing Core',
        description: 'High-frequency array and hash map interview questions.',
        position: 1,
        problems: [
          { problemId: 'p-1', title: 'Pair Sum Target', slug: 'two-sum-indices', difficulty: 'Easy', topic: 'Arrays', pattern: 'Hash Map', estimatedMinutes: 10 },
          { problemId: 'p-3', title: 'Group Anagrams', slug: 'group-anagrams', difficulty: 'Medium', topic: 'Strings', pattern: 'Hash Map', estimatedMinutes: 20 },
          { problemId: 'p-5', title: 'Top K Frequent Elements', slug: 'top-k-frequent-elements', difficulty: 'Medium', topic: 'Arrays', pattern: 'Frequency Map', estimatedMinutes: 20 },
          { problemId: 'p-4', title: 'Contains Duplicate', slug: 'contains-duplicate', difficulty: 'Easy', topic: 'Arrays', pattern: 'Hash Set', estimatedMinutes: 8 },
          { problemId: 'p-2', title: 'Valid Anagram Check', slug: 'valid-anagram-check', difficulty: 'Easy', topic: 'Strings', pattern: 'Frequency Map', estimatedMinutes: 10 },
        ]
      },
      {
        id: 'sp-ic-s2',
        title: 'Two Pointers & Sliding Window',
        description: 'Efficiently traverse sorted arrays and sliding subarray windows.',
        position: 2,
        problems: [
          { problemId: 'p-7', title: 'Three Sum', slug: 'three-sum', difficulty: 'Medium', topic: 'Two Pointers', pattern: 'Two Pointer', estimatedMinutes: 25 },
          { problemId: 'p-8', title: 'Container With Most Water', slug: 'container-with-most-water', difficulty: 'Medium', topic: 'Two Pointers', pattern: 'Two Pointer', estimatedMinutes: 20 },
          { problemId: 'p-10', title: 'Longest Unique Window', slug: 'longest-unique-window', difficulty: 'Medium', topic: 'Sliding Window', pattern: 'Sliding Window', estimatedMinutes: 20 },
          { problemId: 'p-11', title: 'Minimum Window Substring', slug: 'minimum-window-substring', difficulty: 'Hard', topic: 'Sliding Window', pattern: 'Sliding Window', estimatedMinutes: 35 },
          { problemId: 'p-19', title: 'Trapping Rain Water', slug: 'trapping-rain-water', difficulty: 'Hard', topic: 'Two Pointers', pattern: 'Two Pointer', estimatedMinutes: 35 },
        ]
      },
      {
        id: 'sp-ic-s3',
        title: 'Stack & Linked List',
        description: 'Fundamental data structures that appear in virtually every interview.',
        position: 3,
        problems: [
          { problemId: 'p-14', title: 'Valid Parentheses', slug: 'valid-parentheses', difficulty: 'Easy', topic: 'Stack', pattern: 'Stack', estimatedMinutes: 10 },
          { problemId: 'p-16', title: 'Evaluate Reverse Polish', slug: 'eval-reverse-polish', difficulty: 'Medium', topic: 'Stack', pattern: 'Stack', estimatedMinutes: 15 },
          { problemId: 'p-20', title: 'Reverse Linked List', slug: 'reverse-linked-list', difficulty: 'Easy', topic: 'Linked List', pattern: 'Linked List', estimatedMinutes: 10 },
          { problemId: 'p-21', title: 'Merge Two Sorted Lists', slug: 'merge-two-sorted-lists', difficulty: 'Easy', topic: 'Linked List', pattern: 'Linked List', estimatedMinutes: 10 },
          { problemId: 'p-22', title: 'Linked List Cycle', slug: 'linked-list-cycle', difficulty: 'Easy', topic: 'Linked List', pattern: 'Fast/Slow Pointer', estimatedMinutes: 10 },
        ]
      },
      {
        id: 'sp-ic-s4',
        title: 'Trees & Graphs',
        description: 'Binary tree traversals, BST operations, and graph algorithms.',
        position: 4,
        problems: [
          { problemId: 'p-29', title: 'Invert Binary Tree', slug: 'invert-binary-tree', difficulty: 'Easy', topic: 'Trees', pattern: 'DFS', estimatedMinutes: 10 },
          { problemId: 'p-30', title: 'Max Depth of Binary Tree', slug: 'max-depth-binary-tree', difficulty: 'Easy', topic: 'Trees', pattern: 'DFS', estimatedMinutes: 10 },
          { problemId: 'p-31', title: 'Level Order Traversal', slug: 'level-order-traversal', difficulty: 'Medium', topic: 'Trees', pattern: 'BFS', estimatedMinutes: 20 },
          { problemId: 'p-38', title: 'Number of Islands', slug: 'number-of-islands', difficulty: 'Medium', topic: 'Graphs', pattern: 'BFS', estimatedMinutes: 20 },
          { problemId: 'p-39', title: 'Clone Graph', slug: 'clone-graph', difficulty: 'Medium', topic: 'Graphs', pattern: 'DFS', estimatedMinutes: 20 },
        ]
      },
      {
        id: 'sp-ic-s5',
        title: 'Binary Search & Greedy',
        description: 'Logarithmic search and locally optimal strategies.',
        position: 5,
        problems: [
          { problemId: 'p-24', title: 'Binary Search', slug: 'binary-search', difficulty: 'Easy', topic: 'Binary Search', pattern: 'Binary Search', estimatedMinutes: 10 },
          { problemId: 'p-25', title: 'Search Rotated Array', slug: 'search-rotated-array', difficulty: 'Medium', topic: 'Binary Search', pattern: 'Binary Search', estimatedMinutes: 20 },
          { problemId: 'p-27', title: 'Search a 2D Matrix', slug: 'search-2d-matrix', difficulty: 'Medium', topic: 'Binary Search', pattern: 'Binary Search', estimatedMinutes: 15 },
          { problemId: 'p-56', title: 'Jump Game', slug: 'jump-game', difficulty: 'Medium', topic: 'Greedy', pattern: 'Greedy', estimatedMinutes: 20 },
          { problemId: 'p-57', title: 'Gas Station', slug: 'gas-station', difficulty: 'Medium', topic: 'Greedy', pattern: 'Greedy', estimatedMinutes: 25 },
        ]
      },
      {
        id: 'sp-ic-s6',
        title: 'Dynamic Programming Essentials',
        description: 'The most common DP patterns in technical interviews.',
        position: 6,
        problems: [
          { problemId: 'p-41', title: 'Climbing Stairs', slug: 'climbing-stairs', difficulty: 'Easy', topic: 'Dynamic Programming', pattern: 'Dynamic Programming', estimatedMinutes: 10 },
          { problemId: 'p-42', title: 'Coin Change', slug: 'coin-change', difficulty: 'Medium', topic: 'Dynamic Programming', pattern: 'Dynamic Programming', estimatedMinutes: 25 },
          { problemId: 'p-43', title: 'Longest Increasing Subsequence', slug: 'longest-increasing-subsequence', difficulty: 'Medium', topic: 'Dynamic Programming', pattern: 'Dynamic Programming', estimatedMinutes: 25 },
          { problemId: 'p-44', title: 'Word Break', slug: 'word-break', difficulty: 'Medium', topic: 'Dynamic Programming', pattern: 'Dynamic Programming', estimatedMinutes: 25 },
          { problemId: 'p-45', title: 'House Robber', slug: 'house-robber', difficulty: 'Medium', topic: 'Dynamic Programming', pattern: 'Dynamic Programming', estimatedMinutes: 15 },
        ]
      }
    ]
  },
  {
    id: 'sp-graph-mastery',
    slug: 'graph-mastery',
    title: 'CodeSpark Graph Mastery',
    description: 'Deep dive into graph algorithms: BFS, DFS, topological sort, cycle detection, shortest paths, and connected components.',
    difficulty: 'Advanced',
    estimatedDuration: '2–3 weeks',
    totalProblems: 12,
    badgeIcon: 'Network',
    sections: [
      {
        id: 'sp-gm-s1',
        title: 'Graph Traversals',
        description: 'BFS and DFS on adjacency lists and matrices.',
        position: 1,
        problems: [
          { problemId: 'p-38', title: 'Number of Islands', slug: 'number-of-islands', difficulty: 'Medium', topic: 'Graphs', pattern: 'BFS', estimatedMinutes: 20 },
          { problemId: 'p-39', title: 'Clone Graph', slug: 'clone-graph', difficulty: 'Medium', topic: 'Graphs', pattern: 'DFS', estimatedMinutes: 20 },
          { problemId: 'p-40', title: 'Pacific Atlantic Water Flow', slug: 'pacific-atlantic', difficulty: 'Medium', topic: 'Graphs', pattern: 'DFS', estimatedMinutes: 25 },
          { problemId: 'p-54', title: 'Course Schedule', slug: 'course-schedule', difficulty: 'Medium', topic: 'Graphs', pattern: 'Topological Sort', estimatedMinutes: 25 },
        ]
      },
      {
        id: 'sp-gm-s2',
        title: 'Advanced Graph Patterns',
        description: 'Union-Find, connected components, and complex graph problems.',
        position: 2,
        problems: [
          { problemId: 'p-55', title: 'Course Schedule II', slug: 'course-schedule-ii', difficulty: 'Medium', topic: 'Graphs', pattern: 'Topological Sort', estimatedMinutes: 30 },
          { problemId: 'p-29', title: 'Invert Binary Tree', slug: 'invert-binary-tree', difficulty: 'Easy', topic: 'Trees', pattern: 'DFS', estimatedMinutes: 10 },
          { problemId: 'p-31', title: 'Level Order Traversal', slug: 'level-order-traversal', difficulty: 'Medium', topic: 'Trees', pattern: 'BFS', estimatedMinutes: 20 },
          { problemId: 'p-32', title: 'Validate BST', slug: 'validate-bst', difficulty: 'Medium', topic: 'Trees', pattern: 'DFS', estimatedMinutes: 20 },
          { problemId: 'p-33', title: 'Kth Smallest in BST', slug: 'kth-smallest-bst', difficulty: 'Medium', topic: 'Trees', pattern: 'DFS', estimatedMinutes: 20 },
          { problemId: 'p-36', title: 'Find Median from Stream', slug: 'median-from-stream', difficulty: 'Hard', topic: 'Heap', pattern: 'Heap', estimatedMinutes: 30 },
          { problemId: 'p-37', title: 'Kth Largest Element', slug: 'kth-largest-element', difficulty: 'Medium', topic: 'Heap', pattern: 'Heap', estimatedMinutes: 20 },
          { problemId: 'p-51', title: 'Merge K Sorted Lists', slug: 'merge-k-sorted-lists', difficulty: 'Hard', topic: 'Heap', pattern: 'Heap', estimatedMinutes: 30 },
        ]
      }
    ]
  },
  {
    id: 'sp-dp-mastery',
    slug: 'dp-mastery',
    title: 'CodeSpark Dynamic Programming',
    description: 'Conquer the most feared interview topic. Learn to identify optimal substructure, design state transitions, and implement both top-down and bottom-up DP solutions.',
    difficulty: 'Advanced',
    estimatedDuration: '3–4 weeks',
    totalProblems: 12,
    badgeIcon: 'Layers',
    sections: [
      {
        id: 'sp-dp-s1',
        title: '1D Dynamic Programming',
        description: 'Single-dimension state problems: stairs, robber, coins.',
        position: 1,
        problems: [
          { problemId: 'p-41', title: 'Climbing Stairs', slug: 'climbing-stairs', difficulty: 'Easy', topic: 'Dynamic Programming', pattern: 'Dynamic Programming', estimatedMinutes: 10 },
          { problemId: 'p-45', title: 'House Robber', slug: 'house-robber', difficulty: 'Medium', topic: 'Dynamic Programming', pattern: 'Dynamic Programming', estimatedMinutes: 15 },
          { problemId: 'p-42', title: 'Coin Change', slug: 'coin-change', difficulty: 'Medium', topic: 'Dynamic Programming', pattern: 'Dynamic Programming', estimatedMinutes: 25 },
          { problemId: 'p-44', title: 'Word Break', slug: 'word-break', difficulty: 'Medium', topic: 'Dynamic Programming', pattern: 'Dynamic Programming', estimatedMinutes: 25 },
        ]
      },
      {
        id: 'sp-dp-s2',
        title: 'Subsequence DP',
        description: 'LIS, LCS, and subsequence-based state transitions.',
        position: 2,
        problems: [
          { problemId: 'p-43', title: 'Longest Increasing Subsequence', slug: 'longest-increasing-subsequence', difficulty: 'Medium', topic: 'Dynamic Programming', pattern: 'Dynamic Programming', estimatedMinutes: 25 },
          { problemId: 'p-46', title: 'Longest Common Subsequence', slug: 'longest-common-subsequence', difficulty: 'Medium', topic: 'Dynamic Programming', pattern: 'Dynamic Programming', estimatedMinutes: 25 },
        ]
      },
      {
        id: 'sp-dp-s3',
        title: 'Advanced DP Patterns',
        description: 'Backtracking with memoization and complex state spaces.',
        position: 3,
        problems: [
          { problemId: 'p-47', title: 'Subsets', slug: 'subsets', difficulty: 'Medium', topic: 'Backtracking', pattern: 'Backtracking', estimatedMinutes: 20 },
          { problemId: 'p-48', title: 'Combination Sum', slug: 'combination-sum', difficulty: 'Medium', topic: 'Backtracking', pattern: 'Backtracking', estimatedMinutes: 25 },
          { problemId: 'p-49', title: 'Permutations', slug: 'permutations', difficulty: 'Medium', topic: 'Backtracking', pattern: 'Backtracking', estimatedMinutes: 20 },
          { problemId: 'p-53', title: 'Word Search', slug: 'word-search', difficulty: 'Medium', topic: 'Backtracking', pattern: 'Backtracking', estimatedMinutes: 25 },
          { problemId: 'p-50', title: 'Single Number', slug: 'single-number', difficulty: 'Easy', topic: 'Bit Manipulation', pattern: 'Bit Manipulation', estimatedMinutes: 8 },
          { problemId: 'p-52', title: 'Top K Frequent Words', slug: 'top-k-frequent-words', difficulty: 'Medium', topic: 'Heap', pattern: 'Heap', estimatedMinutes: 20 },
        ]
      }
    ]
  },
  {
    id: 'sp-30-day-sprint',
    slug: '30-day-sprint',
    title: 'CodeSpark 30-Day Interview Sprint',
    description: 'One problem per day for 30 days. Structured difficulty ramp from Easy → Medium → Hard. Perfect for last-minute interview preparation.',
    difficulty: 'Intermediate',
    estimatedDuration: '30 days',
    totalProblems: 30,
    badgeIcon: 'Zap',
    sections: [
      {
        id: 'sp-30d-w1',
        title: 'Week 1: Warm-Up',
        description: 'Easy problems to build momentum and confidence.',
        position: 1,
        problems: [
          { problemId: 'p-1', title: 'Pair Sum Target', slug: 'two-sum-indices', difficulty: 'Easy', topic: 'Arrays', pattern: 'Hash Map', estimatedMinutes: 10 },
          { problemId: 'p-4', title: 'Contains Duplicate', slug: 'contains-duplicate', difficulty: 'Easy', topic: 'Arrays', pattern: 'Hash Set', estimatedMinutes: 8 },
          { problemId: 'p-2', title: 'Valid Anagram Check', slug: 'valid-anagram-check', difficulty: 'Easy', topic: 'Strings', pattern: 'Frequency Map', estimatedMinutes: 10 },
          { problemId: 'p-6', title: 'Valid Palindrome', slug: 'valid-palindrome', difficulty: 'Easy', topic: 'Two Pointers', pattern: 'Two Pointer', estimatedMinutes: 10 },
          { problemId: 'p-9', title: 'Best Time to Trade', slug: 'best-time-to-trade', difficulty: 'Easy', topic: 'Sliding Window', pattern: 'Sliding Window', estimatedMinutes: 10 },
          { problemId: 'p-14', title: 'Valid Parentheses', slug: 'valid-parentheses', difficulty: 'Easy', topic: 'Stack', pattern: 'Stack', estimatedMinutes: 10 },
          { problemId: 'p-20', title: 'Reverse Linked List', slug: 'reverse-linked-list', difficulty: 'Easy', topic: 'Linked List', pattern: 'Linked List', estimatedMinutes: 10 },
        ]
      },
      {
        id: 'sp-30d-w2',
        title: 'Week 2: Core Patterns',
        description: 'Medium problems covering the most frequent interview patterns.',
        position: 2,
        problems: [
          { problemId: 'p-3', title: 'Group Anagrams', slug: 'group-anagrams', difficulty: 'Medium', topic: 'Strings', pattern: 'Hash Map', estimatedMinutes: 20 },
          { problemId: 'p-7', title: 'Three Sum', slug: 'three-sum', difficulty: 'Medium', topic: 'Two Pointers', pattern: 'Two Pointer', estimatedMinutes: 25 },
          { problemId: 'p-10', title: 'Longest Unique Window', slug: 'longest-unique-window', difficulty: 'Medium', topic: 'Sliding Window', pattern: 'Sliding Window', estimatedMinutes: 20 },
          { problemId: 'p-15', title: 'Min Stack', slug: 'min-stack', difficulty: 'Medium', topic: 'Stack', pattern: 'Stack', estimatedMinutes: 15 },
          { problemId: 'p-25', title: 'Search Rotated Array', slug: 'search-rotated-array', difficulty: 'Medium', topic: 'Binary Search', pattern: 'Binary Search', estimatedMinutes: 20 },
          { problemId: 'p-29', title: 'Invert Binary Tree', slug: 'invert-binary-tree', difficulty: 'Easy', topic: 'Trees', pattern: 'DFS', estimatedMinutes: 10 },
          { problemId: 'p-31', title: 'Level Order Traversal', slug: 'level-order-traversal', difficulty: 'Medium', topic: 'Trees', pattern: 'BFS', estimatedMinutes: 20 },
        ]
      },
      {
        id: 'sp-30d-w3',
        title: 'Week 3: Depth',
        description: 'Harder problems requiring careful analysis and optimization.',
        position: 3,
        problems: [
          { problemId: 'p-38', title: 'Number of Islands', slug: 'number-of-islands', difficulty: 'Medium', topic: 'Graphs', pattern: 'BFS', estimatedMinutes: 20 },
          { problemId: 'p-41', title: 'Climbing Stairs', slug: 'climbing-stairs', difficulty: 'Easy', topic: 'Dynamic Programming', pattern: 'Dynamic Programming', estimatedMinutes: 10 },
          { problemId: 'p-42', title: 'Coin Change', slug: 'coin-change', difficulty: 'Medium', topic: 'Dynamic Programming', pattern: 'Dynamic Programming', estimatedMinutes: 25 },
          { problemId: 'p-43', title: 'Longest Increasing Subsequence', slug: 'longest-increasing-subsequence', difficulty: 'Medium', topic: 'Dynamic Programming', pattern: 'Dynamic Programming', estimatedMinutes: 25 },
          { problemId: 'p-47', title: 'Subsets', slug: 'subsets', difficulty: 'Medium', topic: 'Backtracking', pattern: 'Backtracking', estimatedMinutes: 20 },
          { problemId: 'p-54', title: 'Course Schedule', slug: 'course-schedule', difficulty: 'Medium', topic: 'Graphs', pattern: 'Topological Sort', estimatedMinutes: 25 },
          { problemId: 'p-56', title: 'Jump Game', slug: 'jump-game', difficulty: 'Medium', topic: 'Greedy', pattern: 'Greedy', estimatedMinutes: 20 },
        ]
      },
      {
        id: 'sp-30d-w4',
        title: 'Week 4: Challenge Round',
        description: 'Hard problems and advanced patterns to sharpen your edge.',
        position: 4,
        problems: [
          { problemId: 'p-8', title: 'Container With Most Water', slug: 'container-with-most-water', difficulty: 'Medium', topic: 'Two Pointers', pattern: 'Two Pointer', estimatedMinutes: 20 },
          { problemId: 'p-11', title: 'Minimum Window Substring', slug: 'minimum-window-substring', difficulty: 'Hard', topic: 'Sliding Window', pattern: 'Sliding Window', estimatedMinutes: 35 },
          { problemId: 'p-19', title: 'Trapping Rain Water', slug: 'trapping-rain-water', difficulty: 'Hard', topic: 'Two Pointers', pattern: 'Two Pointer', estimatedMinutes: 35 },
          { problemId: 'p-44', title: 'Word Break', slug: 'word-break', difficulty: 'Medium', topic: 'Dynamic Programming', pattern: 'Dynamic Programming', estimatedMinutes: 25 },
          { problemId: 'p-45', title: 'House Robber', slug: 'house-robber', difficulty: 'Medium', topic: 'Dynamic Programming', pattern: 'Dynamic Programming', estimatedMinutes: 15 },
          { problemId: 'p-36', title: 'Find Median from Stream', slug: 'median-from-stream', difficulty: 'Hard', topic: 'Heap', pattern: 'Heap', estimatedMinutes: 30 },
          { problemId: 'p-46', title: 'Longest Common Subsequence', slug: 'longest-common-subsequence', difficulty: 'Medium', topic: 'Dynamic Programming', pattern: 'Dynamic Programming', estimatedMinutes: 25 },
          { problemId: 'p-51', title: 'Merge K Sorted Lists', slug: 'merge-k-sorted-lists', difficulty: 'Hard', topic: 'Heap', pattern: 'Heap', estimatedMinutes: 30 },
          { problemId: 'p-53', title: 'Word Search', slug: 'word-search', difficulty: 'Medium', topic: 'Backtracking', pattern: 'Backtracking', estimatedMinutes: 25 },
        ]
      }
    ]
  }
];
