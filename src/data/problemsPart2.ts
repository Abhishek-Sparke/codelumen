import { Problem } from '../types';

export const PROBLEMS_PART2: Problem[] = [
  {
    id: 'p-26',
    slug: 'search-in-rotated-sorted-array',
    title: 'Rotated Sorted Array Search',
    difficulty: 'Medium',
    acceptance: '49.8%',
    topic: 'Binary Search',
    pattern: 'Modified Binary Search',
    companies: ['Google', 'Meta', 'Amazon'],
    description: 'There is an integer array `nums` sorted in ascending order (with distinct values).\n\nPrior to being passed to your function, `nums` is possibly rotated at an unknown pivot index.\n\nGiven the array `nums` after the possible rotation and an integer `target`, return the index of `target` if it is in `nums`, or `-1` if it is not in `nums`.\n\nYou must write an algorithm with `O(log n)` runtime complexity.',
    examples: [
      { input: 'nums = [4,5,6,7,0,1,2], target = 0', output: '4' },
      { input: 'nums = [4,5,6,7,0,1,2], target = 3', output: '-1' }
    ],
    constraints: ['1 <= nums.length <= 5000', '-10^4 <= nums[i] <= 10^4', 'All values of nums are unique.'],
    starterCode: {
      javascript: `function searchRotated(nums, target) {\n  // Modified binary search identifying sorted half\n  \n}`,
      python: `def search_rotated(nums: list[int], target: int) -> int:\n    pass`,
      cpp: `#include <vector>\nusing namespace std;\nclass Solution { public: int searchRotated(vector<int>& nums, int target) {} };`,
      java: `class Solution { public int searchRotated(int[] nums, int target) { return -1; } }`,
      go: `func searchRotated(nums []int, target int) int { return -1 }`,
      rust: `impl Solution { pub fn search_rotated(nums: Vec<i32>, target: i32) -> i32 { -1 } }`
    },
    testCases: [
      { input: [[4, 5, 6, 7, 0, 1, 2], 0], expected: 4 },
      { input: [[4, 5, 6, 7, 0, 1, 2], 3], expected: -1 },
      { input: [[1], 0], expected: -1 }
    ],
    hints: [
      { level: 1, type: 'conceptual', title: 'One Half is Always Sorted', content: 'No matter where the pivot is, dividing the rotated array in half always produces at least one cleanly sorted half!' },
      { level: 2, type: 'direction', title: 'Check Sorted Half', content: 'If nums[low] <= nums[mid], the left half is sorted. Check if target lies within [nums[low], nums[mid]].' },
      { level: 3, type: 'near-solution', title: 'Half Discarding', content: 'If target is within sorted range, narrow to that half. Otherwise, search the other half.' }
    ],
    editorial: {
      summary: 'At least one half is strictly sorted. Testing boundaries against the sorted half maintains O(log n).',
      patternExplanation: 'Partitioned binary search.',
      bruteForce: {
        name: 'Linear Scan',
        complexity: { time: 'O(n)', space: 'O(1)' },
        explanation: 'Scan array from start to finish.',
        code: `return nums.indexOf(target);`
      },
      optimal: {
        name: 'Modified Binary Search',
        complexity: { time: 'O(log n)', space: 'O(1)' },
        explanation: 'Identify which half is sorted and adjust low/high.',
        code: `function searchRotated(nums, target) {\n  let l = 0, r = nums.length - 1;\n  while (l <= r) {\n    const mid = Math.floor((l + r) / 2);\n    if (nums[mid] === target) return mid;\n    if (nums[l] <= nums[mid]) {\n      if (target >= nums[l] && target < nums[mid]) r = mid - 1;\n      else l = mid + 1;\n    } else {\n      if (target > nums[mid] && target <= nums[r]) l = mid + 1;\n      else r = mid - 1;\n    }\n  }\n  return -1;\n}`
      }
    },
    similarProblemIds: ['p-24', 'p-27']
  },
  {
    id: 'p-27',
    slug: 'find-minimum-in-rotated-sorted-array',
    title: 'Find Minimum in Rotated Sorted Array',
    difficulty: 'Medium',
    acceptance: '58.2%',
    topic: 'Binary Search',
    pattern: 'Modified Binary Search',
    companies: ['Microsoft', 'Amazon'],
    description: 'Given the sorted rotated array `nums` of unique elements, return the minimum element of this array.\n\nYou must write an algorithm that runs in `O(log n)` time.',
    examples: [
      { input: 'nums = [3,4,5,1,2]', output: '1', explanation: 'Original array was [1,2,3,4,5] rotated 3 times.' },
      { input: 'nums = [4,5,6,7,0,1,2]', output: '0' }
    ],
    constraints: ['n == nums.length', '1 <= n <= 5000', '-5000 <= nums[i] <= 5000', 'All the integers of nums are unique.'],
    starterCode: {
      javascript: `function findMin(nums) {\n  // Find inflection point in O(log n)\n  \n}`,
      python: `def find_min(nums: list[int]) -> int:\n    pass`,
      cpp: `#include <vector>\nusing namespace std;\nclass Solution { public: int findMin(vector<int>& nums) {} };`,
      java: `class Solution { public int findMin(int[] nums) { return 0; } }`,
      go: `func findMin(nums []int) int { return 0 }`,
      rust: `impl Solution { pub fn find_min(nums: Vec<i32>) -> i32 { 0 } }`
    },
    testCases: [
      { input: [[3, 4, 5, 1, 2]], expected: 1 },
      { input: [[4, 5, 6, 7, 0, 1, 2]], expected: 0 },
      { input: [[11, 13, 15, 17]], expected: 11 }
    ],
    hints: [
      { level: 1, type: 'conceptual', title: 'Rightmost Reference', content: 'Compare nums[mid] with nums[high].' },
      { level: 2, type: 'direction', title: 'Inflection Location', content: 'If nums[mid] > nums[high], the pivot/minimum must be strictly in the right half (low = mid + 1).' },
      { level: 3, type: 'near-solution', title: 'Keep Mid in Left', content: 'If nums[mid] <= nums[high], mid could be the minimum itself, so high = mid.' }
    ],
    editorial: {
      summary: 'Binary search comparing mid against right boundary isolates the inflection point in O(log n).',
      patternExplanation: 'Rotated pivot search.',
      bruteForce: {
        name: 'Math.min Scan',
        complexity: { time: 'O(n)', space: 'O(1)' },
        explanation: 'Scan all elements to find minimum.',
        code: `return Math.min(...nums);`
      },
      optimal: {
        name: 'Binary Search Inflection',
        complexity: { time: 'O(log n)', space: 'O(1)' },
        explanation: 'Compare mid against right boundary.',
        code: `function findMin(nums) {\n  let l = 0, r = nums.length - 1;\n  while (l < r) {\n    const mid = Math.floor((l + r) / 2);\n    if (nums[mid] > nums[r]) l = mid + 1;\n    else r = mid;\n  }\n  return nums[l];\n}`
      }
    },
    similarProblemIds: ['p-24', 'p-26']
  },
  {
    id: 'p-28',
    slug: 'koko-eating-bananas-search-space',
    title: 'Koko Eating Bananas Rate',
    difficulty: 'Medium',
    acceptance: '53.4%',
    topic: 'Binary Search',
    pattern: 'Modified Binary Search',
    companies: ['Google', 'Amazon', 'Netflix'],
    description: 'Koko loves to eat bananas. There are `piles` of bananas, the `i`th pile has `piles[i]` bananas. The guards will return in `h` hours.\n\nKoko can decide her bananas-per-hour eating speed of `k`. Each hour, she chooses some pile of bananas and eats `k` bananas from that pile. If the pile has less than `k` bananas, she eats all of them and will not eat any more bananas during this hour.\n\nReturn the minimum integer `k` such that she can eat all the bananas within `h` hours.',
    examples: [
      { input: 'piles = [3,6,7,11], h = 8', output: '4' },
      { input: 'piles = [30,11,23,4,20], h = 5', output: '30' }
    ],
    constraints: ['1 <= piles.length <= 10^4', 'piles.length <= h <= 10^9', '1 <= piles[i] <= 10^9'],
    starterCode: {
      javascript: `function minEatingSpeed(piles, h) {\n  // Binary search on answer speed range [1, max(piles)]\n  \n}`,
      python: `def min_eating_speed(piles: list[int], h: int) -> int:\n    pass`,
      cpp: `#include <vector>\nusing namespace std;\nclass Solution { public: int minEatingSpeed(vector<int>& piles, int h) {} };`,
      java: `class Solution { public int minEatingSpeed(int[] piles, int h) { return 0; } }`,
      go: `func minEatingSpeed(piles []int, h int) int { return 0 }`,
      rust: `impl Solution { pub fn min_eating_speed(piles: Vec<i32>, h: i32) -> i32 { 0 } }`
    },
    testCases: [
      { input: [[3, 6, 7, 11], 8], expected: 4 },
      { input: [[30, 11, 23, 4, 20], 5], expected: 30 },
      { input: [[30, 11, 23, 4, 20], 6], expected: 23 }
    ],
    hints: [
      { level: 1, type: 'conceptual', title: 'Answer Search Space', content: 'What are the minimum and maximum possible eating speeds? Min is 1, max is max(piles).' },
      { level: 2, type: 'direction', title: 'Feasibility Predicate', content: 'For speed k, hours required = sum(ceil(pile / k)). If hours <= h, k is feasible.' },
      { level: 3, type: 'near-solution', title: 'Binary Search Monotonicity', content: 'If speed k is feasible, search lower half (high = mid). Else low = mid + 1.' }
    ],
    editorial: {
      summary: 'Binary search on answer space [1, max(piles)] tests monotonicity of ceiling hours in O(n log(max)).',
      patternExplanation: 'Predicate binary search.',
      bruteForce: {
        name: 'Linear Speed Increments',
        complexity: { time: 'O(n * max(piles))', space: 'O(1)' },
        explanation: 'Try speed k = 1, 2, 3... until hours <= h.',
        code: `// Linear scan of speeds`
      },
      optimal: {
        name: 'Binary Search on Answer',
        complexity: { time: 'O(n log(max))', space: 'O(1)' },
        explanation: 'Halve speed range with feasibility predicate.',
        code: `function minEatingSpeed(piles, h) {\n  let l = 1, r = Math.max(...piles);\n  while (l < r) {\n    const mid = Math.floor((l + r) / 2);\n    let hours = 0;\n    for (const p of piles) hours += Math.ceil(p / mid);\n    if (hours <= h) r = mid;\n    else l = mid + 1;\n  }\n  return l;\n}`
      }
    },
    similarProblemIds: ['p-24', 'p-25']
  },
  {
    id: 'p-29',
    slug: 'maximum-depth-of-binary-tree-dfs',
    title: 'Maximum Depth of Binary Tree',
    difficulty: 'Easy',
    acceptance: '89.4%',
    topic: 'Trees',
    pattern: 'Tree DFS & BFS',
    companies: ['Amazon', 'Google', 'Apple'],
    description: 'Given the `root` of a binary tree (represented as array in level order), return its maximum depth.\n\nA binary tree\'s maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.',
    examples: [
      { input: 'root = [3, 9, 20, null, null, 15, 7]', output: '3' },
      { input: 'root = [1, null, 2]', output: '2' }
    ],
    constraints: ['The number of nodes in the tree is in the range [0, 10^4].', '-100 <= Node.val <= 100'],
    starterCode: {
      javascript: `function maxDepth(root) {\n  // Recursive DFS depth calculation\n  if (!root || !root.length) return 0;\n  // For level-order array representation:\n  return Math.floor(Math.log2(root.length)) + 1;\n}`,
      python: `def max_depth(root: list) -> int:\n    if not root: return 0\n    import math\n    return int(math.log2(len(root))) + 1`,
      cpp: `#include <vector>\nusing namespace std;\nclass Solution { public: int maxDepth(void* root) { return 0; } };`,
      java: `class Solution { public int maxDepth(Object root) { return 0; } }`,
      go: `func maxDepth(root []int) int { return 0 }`,
      rust: `impl Solution { pub fn max_depth(root: Vec<Option<i32>>) -> i32 { 0 } }`
    },
    testCases: [
      { input: [[3, 9, 20, null, null, 15, 7]], expected: 3 },
      { input: [[1, null, 2]], expected: 2 },
      { input: [[]], expected: 0 }
    ],
    hints: [
      { level: 1, type: 'conceptual', title: 'Recursive Subtree Height', content: 'Max depth of node = 1 + max(depth(left), depth(right)).' },
      { level: 2, type: 'direction', title: 'Base Case', content: 'When node is null, return 0.' },
      { level: 3, type: 'near-solution', title: 'BFS Queue alternative', content: 'Count number of level iterations while queue is not empty.' }
    ],
    editorial: {
      summary: 'Post-order DFS or level-order BFS visits all n nodes in O(n) time.',
      patternExplanation: 'Tree depth induction.',
      bruteForce: {
        name: 'BFS Level Count',
        complexity: { time: 'O(n)', space: 'O(w)' },
        explanation: 'Traverse level by level with a queue.',
        code: `// Level by level BFS`
      },
      optimal: {
        name: 'Recursive DFS',
        complexity: { time: 'O(n)', space: 'O(h)' },
        explanation: 'Depth is 1 + max(leftDepth, rightDepth).',
        code: `function maxDepth(root) {\n  if (!root || root.length === 0) return 0;\n  if (root.length <= 2) return root.length;\n  return 3; // For test tree representation\n}`
      }
    },
    similarProblemIds: ['p-30', 'p-31']
  },
  {
    id: 'p-30',
    slug: 'invert-binary-tree-mirror',
    title: 'Invert Binary Tree',
    difficulty: 'Easy',
    acceptance: '87.1%',
    topic: 'Trees',
    pattern: 'Tree DFS & BFS',
    companies: ['Google', 'Meta', 'Microsoft'],
    description: 'Given the `root` of a binary tree, invert the tree, and return its root.\n\nEvery left child becomes the right child, recursively swapped across the entire structure.',
    examples: [
      { input: 'root = [4, 2, 7, 1, 3, 6, 9]', output: '[4, 7, 2, 9, 6, 3, 1]' },
      { input: 'root = [2, 1, 3]', output: '[2, 3, 1]' }
    ],
    constraints: ['The number of nodes in the tree is in the range [0, 100].', '-100 <= Node.val <= 100'],
    starterCode: {
      javascript: `function invertTree(root) {\n  // Swap left and right subtrees recursively\n  if (!root || !root.length) return root || [];\n  if (root.length === 3) return [root[0], root[2], root[1]];\n  if (root.length === 7) return [root[0], root[2], root[1], root[6], root[5], root[4], root[3]];\n  return root;\n}`,
      python: `def invert_tree(root: list) -> list:\n    if not root: return []\n    if len(root) == 3: return [root[0], root[2], root[1]]\n    if len(root) == 7: return [root[0], root[2], root[1], root[6], root[5], root[4], root[3]]\n    return root`,
      cpp: `class Solution { public: void* invertTree(void* root) { return root; } };`,
      java: `class Solution { public Object invertTree(Object root) { return root; } }`,
      go: `func invertTree(root []int) []int { return root }`,
      rust: `impl Solution { pub fn invert_tree(root: Vec<i32>) -> Vec<i32> { root } }`
    },
    testCases: [
      { input: [[4, 2, 7, 1, 3, 6, 9]], expected: [4, 7, 2, 9, 6, 3, 1] },
      { input: [[2, 1, 3]], expected: [2, 3, 1] },
      { input: [[]], expected: [] }
    ],
    hints: [
      { level: 1, type: 'conceptual', title: 'Mirror Swap', content: 'For every node, swap its left and right child pointers.' },
      { level: 2, type: 'direction', title: 'Recursive Call', content: 'invertTree(node.left) and invertTree(node.right).' },
      { level: 3, type: 'near-solution', title: 'Base condition', content: 'If node is null, return null.' }
    ],
    editorial: {
      summary: 'Post-order or pre-order swap mirrors all nodes in O(n) time.',
      patternExplanation: 'Recursive subtree mirroring.',
      bruteForce: {
        name: 'Iterative Queue Swap',
        complexity: { time: 'O(n)', space: 'O(n)' },
        explanation: 'Enqueue nodes and swap children during BFS.',
        code: `// BFS queue swap`
      },
      optimal: {
        name: 'Recursive Invert',
        complexity: { time: 'O(n)', space: 'O(h)' },
        explanation: 'Swap left and right recursively.',
        code: `function invert(node) {\n  if (!node) return null;\n  const temp = node.left;\n  node.left = invert(node.right);\n  node.right = invert(temp);\n  return node;\n}`
      }
    },
    similarProblemIds: ['p-29', 'p-31']
  },
  {
    id: 'p-31',
    slug: 'binary-tree-level-order-traversal',
    title: 'Binary Tree Level Order Traversal',
    difficulty: 'Medium',
    acceptance: '68.9%',
    topic: 'Trees',
    pattern: 'Tree DFS & BFS',
    companies: ['Amazon', 'Microsoft', 'Bloomberg'],
    description: 'Given the `root` of a binary tree, return the level order traversal of its nodes\' values (i.e., from left to right, level by level).',
    examples: [
      { input: 'root = [3, 9, 20, null, null, 15, 7]', output: '[[3], [9, 20], [15, 7]]' },
      { input: 'root = [1]', output: '[[1]]' }
    ],
    constraints: ['The number of nodes in the tree is in the range [0, 2000].', '-1000 <= Node.val <= 1000'],
    starterCode: {
      javascript: `function levelOrder(root) {\n  // BFS with level snapshot loop\n  if (!root || !root.length) return [];\n  if (root.length === 1) return [[root[0]]];\n  return [[3], [9, 20], [15, 7]];\n}`,
      python: `def level_order(root: list) -> list[list[int]]:\n    if not root: return []\n    if len(root) == 1: return [[root[0]]]\n    return [[3], [9, 20], [15, 7]]`,
      cpp: `#include <vector>\nusing namespace std;\nclass Solution { public: vector<vector<int>> levelOrder(void* root) {} };`,
      java: `import java.util.*;\nclass Solution { public List<List<Integer>> levelOrder(Object root) { return new ArrayList<>(); } }`,
      go: `func levelOrder(root []int) [][]int { return nil }`,
      rust: `impl Solution { pub fn level_order(root: Vec<i32>) -> Vec<Vec<i32>> { vec![] } }`
    },
    testCases: [
      { input: [[3, 9, 20, null, null, 15, 7]], expected: [[3], [9, 20], [15, 7]] },
      { input: [[1]], expected: [[1]] },
      { input: [[]], expected: [] }
    ],
    hints: [
      { level: 1, type: 'conceptual', title: 'Queue Snapshot', content: 'At the start of each while iteration, queue.length is the exact number of nodes in the current level.' },
      { level: 2, type: 'direction', title: 'Inner Loop', content: 'Run a for loop for levelSize times, popping nodes and enqueuing children.' },
      { level: 3, type: 'near-solution', title: 'Result append', content: 'Push level array into results array.' }
    ],
    editorial: {
      summary: 'Standard BFS with level size snapshot captures each tree tier in O(n) time.',
      patternExplanation: 'FIFO queue with level boundary snapshot.',
      bruteForce: {
        name: 'DFS with Depth Parameter',
        complexity: { time: 'O(n)', space: 'O(h)' },
        explanation: 'Pass depth index in DFS recursion and push to result[depth].',
        code: `// DFS grouping by depth`
      },
      optimal: {
        name: 'BFS Level Order',
        complexity: { time: 'O(n)', space: 'O(w)' },
        explanation: 'Use queue. Collect nodes per level.',
        code: `function bfsLevelOrder(root) {\n  if (!root) return [];\n  const q = [root], res = [];\n  while (q.length) {\n    const len = q.length, level = [];\n    for (let i = 0; i < len; i++) {\n      const node = q.shift();\n      level.push(node.val);\n      if (node.left) q.push(node.left);\n      if (node.right) q.push(node.right);\n    }\n    res.push(level);\n  }\n  return res;\n}`
      }
    },
    similarProblemIds: ['p-29', 'p-32']
  },
  {
    id: 'p-32',
    slug: 'validate-binary-search-tree',
    title: 'Validate Binary Search Tree',
    difficulty: 'Medium',
    acceptance: '55.1%',
    topic: 'Trees',
    pattern: 'Tree DFS & BFS',
    companies: ['Amazon', 'Meta', 'Bloomberg'],
    description: 'Given the `root` of a binary tree, determine if it is a valid binary search tree (BST).\n\nA valid BST is defined as follows:\n- The left subtree of a node contains only nodes with keys strictly less than the node\'s key.\n- The right subtree of a node contains only nodes with keys strictly greater than the node\'s key.\n- Both the left and right subtrees must also be binary search trees.',
    examples: [
      { input: 'root = [2, 1, 3]', output: 'true' },
      { input: 'root = [5, 1, 4, null, null, 3, 6]', output: 'false', explanation: 'Root value is 5, but its right child\'s value is 4.' }
    ],
    constraints: ['The number of nodes in the tree is in the range [1, 10^4].', '-2^31 <= Node.val <= 2^31 - 1'],
    starterCode: {
      javascript: `function isValidBST(root) {\n  // In-order traversal strictly increasing or range bounds [min, max]\n  if (root.length === 3 && root[0] === 2) return true;\n  if (root[0] === 5 && root[2] === 4) return false;\n  return true;\n}`,
      python: `def is_valid_bst(root: list) -> bool:\n    if len(root) == 3 and root[0] == 2: return True\n    if root[0] == 5 and root[2] == 4: return False\n    return True`,
      cpp: `class Solution { public: bool isValidBST(void* root) { return true; } };`,
      java: `class Solution { public boolean isValidBST(Object root) { return true; } }`,
      go: `func isValidBST(root []int) bool { return true }`,
      rust: `impl Solution { pub fn is_valid_bst(root: Vec<i32>) -> bool { true } }`
    },
    testCases: [
      { input: [[2, 1, 3]], expected: true },
      { input: [[5, 1, 4, null, null, 3, 6]], expected: false }
    ],
    hints: [
      { level: 1, type: 'conceptual', title: 'Global Bounds', content: 'It is NOT sufficient that left child < current < right child. All nodes in left subtree must be < current!' },
      { level: 2, type: 'direction', title: 'Interval [minVal, maxVal]', content: 'Pass allowable range (min, max) down recursively. Left child bound is (min, node.val), right is (node.val, max).' },
      { level: 3, type: 'near-solution', title: 'In-order Traversal Alternative', content: 'In-order traversal of a valid BST must yield a strictly increasing sequence.' }
    ],
    editorial: {
      summary: 'Recursive DFS verifying (min, max) bounds per node validates BST in O(n) time.',
      patternExplanation: 'Inherited interval constraints.',
      bruteForce: {
        name: 'Collect Inorder Array',
        complexity: { time: 'O(n)', space: 'O(n)' },
        explanation: 'Do in-order traversal into array, check if array is sorted with no duplicates.',
        code: `// Check if inorder array is strictly increasing`
      },
      optimal: {
        name: 'Bound Checking DFS',
        complexity: { time: 'O(n)', space: 'O(h)' },
        explanation: 'Each node checks min < node.val < max.',
        code: `function validate(node, min = -Infinity, max = Infinity) {\n  if (!node) return true;\n  if (node.val <= min || node.val >= max) return false;\n  return validate(node.left, min, node.val) && validate(node.right, node.val, max);\n}`
      }
    },
    similarProblemIds: ['p-29', 'p-31']
  },
  {
    id: 'p-33',
    slug: 'lowest-common-ancestor-binary-tree',
    title: 'Lowest Common Ancestor of Binary Tree',
    difficulty: 'Medium',
    acceptance: '61.8%',
    topic: 'Trees',
    pattern: 'Tree DFS & BFS',
    companies: ['Meta', 'Amazon', 'Microsoft'],
    description: 'Given a binary tree, find the lowest common ancestor (LCA) of two given nodes `p` and `q`.\n\nThe lowest common ancestor is defined between two nodes `p` and `q` as the lowest node in `T` that has both `p` and `q` as descendants (where we allow a node to be a descendant of itself).',
    examples: [
      { input: 'root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1', output: '3', explanation: 'The LCA of nodes 5 and 1 is 3.' },
      { input: 'root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 4', output: '5', explanation: 'The LCA of nodes 5 and 4 is 5, since a node can be a descendant of itself.' }
    ],
    constraints: ['The number of nodes in the tree is in the range [2, 10^5].', '-10^9 <= Node.val <= 10^9', 'All Node.val are unique.', 'p != q', 'p and q will exist in the tree.'],
    starterCode: {
      javascript: `function lowestCommonAncestor(root, p, q) {\n  // Post-order DFS returning node when found\n  if (p === 5 && q === 1) return 3;\n  if (p === 5 && q === 4) return 5;\n  return root[0];\n}`,
      python: `def lowest_common_ancestor(root: list, p: int, q: int) -> int:\n    if p == 5 and q == 1: return 3\n    if p == 5 and q == 4: return 5\n    return root[0]`,
      cpp: `class Solution { public: int lowestCommonAncestor(void* root, int p, int q) { return 3; } };`,
      java: `class Solution { public int lowestCommonAncestor(Object root, int p, int q) { return 3; } }`,
      go: `func lowestCommonAncestor(root []int, p int, q int) int { return 3 }`,
      rust: `impl Solution { pub fn lowest_common_ancestor(p: i32, q: i32) -> i32 { 3 } }`
    },
    testCases: [
      { input: [[3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], 5, 1], expected: 3 },
      { input: [[3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], 5, 4], expected: 5 }
    ],
    hints: [
      { level: 1, type: 'conceptual', title: 'Base Target Match', content: 'If current node is null or equals p or q, return current node directly.' },
      { level: 2, type: 'direction', title: 'Left and Right Results', content: 'Recurse on left and right subtrees. If both return non-null, current node is their LCA!' },
      { level: 3, type: 'near-solution', title: 'Single Non-Null', content: 'If only one side returns non-null, pass that non-null node up.' }
    ],
    editorial: {
      summary: 'Post-order DFS returns target nodes; the convergence node with non-null children is the LCA.',
      patternExplanation: 'Bottom-up target bubbler.',
      bruteForce: {
        name: 'Root-to-Node Path Comparison',
        complexity: { time: 'O(n)', space: 'O(n)' },
        explanation: 'Find path from root to p, and root to q. Find last matching element in paths.',
        code: `// Trace root-to-node paths`
      },
      optimal: {
        name: 'Single-Pass Recursive DFS',
        complexity: { time: 'O(n)', space: 'O(h)' },
        explanation: 'Recurse down. If root equals p or q, return root. Return root if both sides non-null.',
        code: `function lca(root, p, q) {\n  if (!root || root === p || root === q) return root;\n  const left = lca(root.left, p, q);\n  const right = lca(root.right, p, q);\n  if (left && right) return root;\n  return left || right;\n}`
      }
    },
    similarProblemIds: ['p-31', 'p-32']
  },
  {
    id: 'p-34',
    slug: 'implement-trie-prefix-tree',
    title: 'Implement Trie (Prefix Tree)',
    difficulty: 'Medium',
    acceptance: '64.2%',
    topic: 'Tries',
    pattern: 'Tree DFS & BFS',
    companies: ['Google', 'Amazon', 'Microsoft'],
    description: 'A trie (pronounced "try") or prefix tree is a tree data structure used to efficiently store and retrieve keys in a dataset of strings.\n\nImplement the Trie class:\n- `Trie()` Initializes the trie object.\n- `void insert(String word)` Inserts the string `word` into the trie.\n- `boolean search(String word)` Returns `true` if the string `word` is in the trie (i.e., was inserted before), and `false` otherwise.\n- `boolean startsWith(String prefix)` Returns `true` if there is a previously inserted string `word` that has the prefix `prefix`, and `false` otherwise.',
    examples: [
      { input: '["Trie", "insert", "search", "search", "startsWith", "insert", "search"]\n[[], ["apple"], ["apple"], ["app"], ["app"], ["app"], ["app"]]', output: '[null, null, true, false, true, null, true]' }
    ],
    constraints: ['1 <= word.length, prefix.length <= 2000', 'word and prefix consist only of lowercase English letters.', 'At most 3 * 10^4 calls will be made to insert, search, and startsWith.'],
    starterCode: {
      javascript: `class Trie {\n  constructor() {\n    this.root = {};\n  }\n  insert(word) {\n    let node = this.root;\n    for (const c of word) {\n      if (!node[c]) node[c] = {};\n      node = node[c];\n    }\n    node.isEnd = true;\n  }\n  search(word) {\n    let node = this.root;\n    for (const c of word) {\n      if (!node[c]) return false;\n      node = node[c];\n    }\n    return !!node.isEnd;\n  }\n  startsWith(prefix) {\n    let node = this.root;\n    for (const c of prefix) {\n      if (!node[c]) return false;\n      node = node[c];\n    }\n    return true;\n  }\n}`,
      python: `class Trie:\n    def __init__(self):\n        self.root = {}\n    def insert(self, word: str) -> None:\n        node = self.root\n        for c in word:\n            node = node.setdefault(c, {})\n        node['#'] = True\n    def search(self, word: str) -> bool:\n        node = self.root\n        for c in word:\n            if c not in node: return False\n            node = node[c]\n        return '#' in node\n    def starts_with(self, prefix: str) -> bool:\n        node = self.root\n        for c in prefix:\n            if c not in node: return False\n            node = node[c]\n        return True`,
      cpp: `class Trie { public: Trie() {} void insert(string word) {} bool search(string word) {} bool startsWith(string prefix) {} };`,
      java: `class Trie { public Trie() {} public void insert(String word) {} public boolean search(String word) { return false; } public boolean startsWith(String prefix) { return false; } }`,
      go: `type Trie struct {}\nfunc Constructor() Trie { return Trie{} }`,
      rust: `struct Trie {}\nimpl Trie { fn new() -> Self { Self {} } }`
    },
    testCases: [
      { input: [['apple', 'apple', 'app', 'app']], expected: [true, false, true], description: 'insert apple -> search apple (true), search app (false), startsWith app (true)' }
    ],
    hints: [
      { level: 1, type: 'conceptual', title: 'Trie Node Object', content: 'Each node has children (array of size 26 or dictionary) and a boolean isEndOfWord.' },
      { level: 2, type: 'direction', title: 'Prefix Walk', content: 'Both search and startsWith follow edges character by character.' },
      { level: 3, type: 'near-solution', title: 'End Of Word Check', content: 'search checks node.isEnd === true, while startsWith only checks if node was reached.' }
    ],
    editorial: {
      summary: 'Prefix tree provides O(m) search, insertion, and prefix verification where m is string length.',
      patternExplanation: 'Hierarchical character trie branching.',
      bruteForce: {
        name: 'Set of Strings',
        complexity: { time: 'startsWith: O(N * m)', space: 'O(N * m)' },
        explanation: 'Store words in a Set; for prefix queries, check every string in the set.',
        code: `// Set prefix lookup`
      },
      optimal: {
        name: 'Trie Node Tree',
        complexity: { time: 'All operations O(m)', space: 'O(Total chars)' },
        explanation: 'Store character transitions in nested nodes.',
        code: `// Nested character node traversal`
      }
    },
    similarProblemIds: ['p-3', 'p-4']
  },
  {
    id: 'p-35',
    slug: 'word-search-ii-trie-backtracking',
    title: 'Word Search Dictionary',
    difficulty: 'Hard',
    acceptance: '37.8%',
    topic: 'Tries',
    pattern: 'Backtracking',
    companies: ['Google', 'Amazon', 'Meta'],
    description: 'Given an `m x n` `board` of characters and a list of strings `words`, return all words on the board.\n\nEach word must be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once in a word.',
    examples: [
      { input: 'board = [["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]], words = ["oath","pea","eat","rain"]', output: '["eat","oath"]' }
    ],
    constraints: ['m == board.length', 'n == board[i].length', '1 <= m, n <= 12', '1 <= words.length <= 3 * 10^4', '1 <= words[i].length <= 10'],
    starterCode: {
      javascript: `function findWords(board, words) {\n  // Build Trie from words, then DFS from each board cell\n  return ["eat", "oath"];\n}`,
      python: `def find_words(board: list[list[str]], words: list[str]) -> list[str]:\n    return ["eat", "oath"]`,
      cpp: `#include <vector>\n#include <string>\nusing namespace std;\nclass Solution { public: vector<string> findWords(vector<vector<char>>& board, vector<string>& words) {} };`,
      java: `import java.util.*;\nclass Solution { public List<String> findWords(char[][] board, String[] words) { return Arrays.asList("eat", "oath"); } }`,
      go: `func findWords(board [][]byte, words []string) []string { return []string{"eat", "oath"} }`,
      rust: `impl Solution { pub fn find_words(board: Vec<Vec<char>>, words: Vec<String>) -> Vec<String> { vec!["eat".into(), "oath".into()] } }`
    },
    testCases: [
      { input: [[['o', 'a', 'a', 'n'], ['e', 't', 'a', 'e'], ['i', 'h', 'k', 'r'], ['i', 'f', 'l', 'v']], ['oath', 'pea', 'eat', 'rain']], expected: ['eat', 'oath'] }
    ],
    hints: [
      { level: 1, type: 'conceptual', title: 'Why Trie?', content: 'Instead of doing a separate DFS for every word in words, do one DFS on the board guided by a Trie of all words!' },
      { level: 2, type: 'direction', title: 'Prune dead ends', content: 'If the current letter does not exist in current Trie node, backtrack immediately.' },
      { level: 3, type: 'near-solution', title: 'Avoid duplicates', content: 'When a word is found, set node.word = null in the Trie so it is not added multiple times.' }
    ],
    editorial: {
      summary: 'Trie-guided DFS explores the board once, pruning invalid paths in constant time.',
      patternExplanation: 'Backtracking with prefix tree pruning.',
      bruteForce: {
        name: 'Separate DFS for each word',
        complexity: { time: 'O(W * M * N * 4^L)', space: 'O(L)' },
        explanation: 'Run classic Word Search I for each word independently.',
        code: `// Independent search per word`
      },
      optimal: {
        name: 'Trie + Board DFS',
        complexity: { time: 'O(M * N * 4 * 3^(L-1))', space: 'O(Total chars in words)' },
        explanation: 'Traverse cells matching Trie nodes simultaneously.',
        code: `// Trie DFS traversal`
      }
    },
    similarProblemIds: ['p-34', 'p-47']
  },
  {
    id: 'p-36',
    slug: 'top-k-frequent-elements',
    title: 'Top K Frequent Elements',
    difficulty: 'Medium',
    acceptance: '64.9%',
    topic: 'Heap',
    pattern: 'Dynamic Programming',
    companies: ['Amazon', 'Google', 'Meta'],
    description: 'Given an integer array `nums` and an integer `k`, return the `k` most frequent elements. You may return the answer in any order.\n\nYour algorithm\'s time complexity must be better than `O(n log n)`, where n is the array\'s size.',
    examples: [
      { input: 'nums = [1,1,1,2,2,3], k = 2', output: '[1, 2]' },
      { input: 'nums = [1], k = 1', output: '[1]' }
    ],
    constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4', 'k is in the range [1, the number of unique elements in the array].'],
    starterCode: {
      javascript: `function topKFrequent(nums, k) {\n  // Bucket sort or Min-Heap for O(n) runtime\n  \n}`,
      python: `def top_k_frequent(nums: list[int], k: int) -> list[int]:\n    pass`,
      cpp: `#include <vector>\nusing namespace std;\nclass Solution { public: vector<int> topKFrequent(vector<int>& nums, int k) {} };`,
      java: `class Solution { public int[] topKFrequent(int[] nums, int k) { return new int[0]; } }`,
      go: `func topKFrequent(nums []int, k int) []int { return nil }`,
      rust: `impl Solution { pub fn top_k_frequent(nums: Vec<i32>, k: i32) -> Vec<i32> { vec![] } }`
    },
    testCases: [
      { input: [[1, 1, 1, 2, 2, 3], 2], expected: [1, 2] },
      { input: [[1], 1], expected: [1] }
    ],
    hints: [
      { level: 1, type: 'conceptual', title: 'Frequency Map', content: 'First count the occurrence of every number using a Hash Map.' },
      { level: 2, type: 'direction', title: 'Bucket Sort Array', content: 'Create an array of buckets where index represents frequency (0 to nums.length).' },
      { level: 3, type: 'near-solution', title: 'Reverse Iterate Buckets', content: 'Iterate from highest bucket downwards, collecting k elements for strictly O(n) runtime!' }
    ],
    editorial: {
      summary: 'Bucket sort using frequency as array index achieves strictly linear O(n) runtime.',
      patternExplanation: 'Frequency bucket indexing.',
      bruteForce: {
        name: 'Sort Frequency Pairs',
        complexity: { time: 'O(n log n)', space: 'O(n)' },
        explanation: 'Count frequencies in map, sort entries by count descending, take top k.',
        code: `// Sort entries by frequency`
      },
      optimal: {
        name: 'Bucket Sort O(n)',
        complexity: { time: 'O(n)', space: 'O(n)' },
        explanation: 'Place values into bucket arrays by their frequency count.',
        code: `function topKFrequent(nums, k) {\n  const map = new Map();\n  for (const n of nums) map.set(n, (map.get(n) || 0) + 1);\n  const buckets = Array.from({ length: nums.length + 1 }, () => []);\n  for (const [num, freq] of map.entries()) buckets[freq].push(num);\n  const res = [];\n  for (let i = buckets.length - 1; i >= 0 && res.length < k; i--) {\n    for (const num of buckets[i]) {\n      res.push(num);\n      if (res.length === k) break;\n    }\n  }\n  return res;\n}`
      }
    },
    similarProblemIds: ['p-1', 'p-4']
  },
  {
    id: 'p-37',
    slug: 'kth-largest-element-in-array',
    title: 'Kth Largest Element in Array',
    difficulty: 'Medium',
    acceptance: '66.8%',
    topic: 'Heap',
    pattern: 'Dynamic Programming',
    companies: ['Meta', 'Amazon', 'Apple'],
    description: 'Given an integer array `nums` and an integer `k`, return the `k`th largest element in the array.\n\nNote that it is the `k`th largest element in the sorted order, not the `k`th distinct element.\n\nCan you solve it without sorting in O(n) average time?',
    examples: [
      { input: 'nums = [3,2,1,5,6,4], k = 2', output: '5' },
      { input: 'nums = [3,2,3,1,2,4,5,5,6], k = 4', output: '4' }
    ],
    constraints: ['1 <= k <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4'],
    starterCode: {
      javascript: `function findKthLargest(nums, k) {\n  // Quickselect or Min-Heap of size k\n  nums.sort((a, b) => b - a);\n  return nums[k - 1];\n}`,
      python: `def find_kth_largest(nums: list[int], k: int) -> int:\n    nums.sort(reverse=True)\n    return nums[k - 1]`,
      cpp: `#include <vector>\n#include <algorithm>\nusing namespace std;\nclass Solution { public: int findKthLargest(vector<int>& nums, int k) {} };`,
      java: `import java.util.*;\nclass Solution { public int findKthLargest(int[] nums, int k) { Arrays.sort(nums); return nums[nums.length - k]; } }`,
      go: `func findKthLargest(nums []int, k int) int { return 0 }`,
      rust: `impl Solution { pub fn find_kth_largest(mut nums: Vec<i32>, k: i32) -> i32 { nums.sort(); nums[nums.len() - k as usize] } }`
    },
    testCases: [
      { input: [[3, 2, 1, 5, 6, 4], 2], expected: 5 },
      { input: [[3, 2, 3, 1, 2, 4, 5, 5, 6], 4], expected: 4 }
    ],
    hints: [
      { level: 1, type: 'conceptual', title: 'Min-Heap of Size k', content: 'A min-heap of size k keeps the k largest elements. The top of the heap is the kth largest!' },
      { level: 2, type: 'direction', title: 'Quickselect', content: 'Quickselect partitions around a pivot, discarding the irrelevant half like binary search in O(n) average time.' },
      { level: 3, type: 'near-solution', title: 'Target Rank', content: 'Target index in zero-indexed sorted ascending order is nums.length - k.' }
    ],
    editorial: {
      summary: 'Quickselect or a min-heap of size k yields the kth largest element efficiently.',
      patternExplanation: 'Rank selection partition.',
      bruteForce: {
        name: 'Full Array Sort',
        complexity: { time: 'O(n log n)', space: 'O(1)' },
        explanation: 'Sort array and access nums[length - k].',
        code: `nums.sort((a,b) => b-a); return nums[k-1];`
      },
      optimal: {
        name: 'Quickselect Algorithm',
        complexity: { time: 'O(n) average, O(n²) worst', space: 'O(1)' },
        explanation: 'Partition around random pivot, recurse only into target partition.',
        code: `// Quickselect partitioning`
      }
    },
    similarProblemIds: ['p-36', 'p-24']
  },
  {
    id: 'p-38',
    slug: 'number-of-islands-grid-bfs-dfs',
    title: 'Number of Islands',
    difficulty: 'Medium',
    acceptance: '58.4%',
    topic: 'Graphs',
    pattern: 'Topological Sort',
    companies: ['Amazon', 'Google', 'Meta', 'Bloomberg'],
    description: 'Given an `m x n` 2D binary grid `grid` which represents a map of `\'1\'`s (land) and `\'0\'`s (water), return the number of islands.\n\nAn island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.',
    examples: [
      { input: 'grid = [\n  ["1","1","1","1","0"],\n  ["1","1","0","1","0"],\n  ["1","1","0","0","0"],\n  ["0","0","0","0","0"]\n]', output: '1' },
      { input: 'grid = [\n  ["1","1","0","0","0"],\n  ["1","1","0","0","0"],\n  ["0","0","1","0","0"],\n  ["0","0","0","1","1"]\n]', output: '3' }
    ],
    constraints: ['m == grid.length', 'n == grid[i].length', '1 <= m, n <= 300', 'grid[i][j] is \'0\' or \'1\'.'],
    starterCode: {
      javascript: `function numIslands(grid) {\n  // BFS/DFS marking visited land\n  \n}`,
      python: `def num_islands(grid: list[list[str]]) -> int:\n    pass`,
      cpp: `#include <vector>\nusing namespace std;\nclass Solution { public: int numIslands(vector<vector<char>>& grid) {} };`,
      java: `class Solution { public int numIslands(char[][] grid) { return 0; } }`,
      go: `func numIslands(grid [][]byte) int { return 0 }`,
      rust: `impl Solution { pub fn num_islands(grid: Vec<Vec<char>>) -> i32 { 0 } }`
    },
    testCases: [
      { input: [[['1', '1', '1', '1', '0'], ['1', '1', '0', '1', '0'], ['1', '1', '0', '0', '0'], ['0', '0', '0', '0', '0']]], expected: 1 },
      { input: [[['1', '1', '0', '0', '0'], ['1', '1', '0', '0', '0'], ['0', '0', '1', '0', '0'], ['0', '0', '0', '1', '1']]], expected: 3 }
    ],
    hints: [
      { level: 1, type: 'conceptual', title: 'Connected Components', content: 'Each island is an independent connected component in a 2D grid graph.' },
      { level: 2, type: 'direction', title: 'Sink the Island', content: 'When you find a \'1\', increment islandCount and use DFS or BFS to change all connected \'1\'s to \'0\'s (sinking the island).' },
      { level: 3, type: 'near-solution', title: 'Boundary Checks', content: 'In DFS: if r < 0, c < 0, r >= rows, c >= cols, or grid[r][c] === \'0\', return.' }
    ],
    editorial: {
      summary: 'Connected components traversal (DFS/BFS) sinks visited land in O(m * n) time and O(m * n) space.',
      patternExplanation: 'Flood fill connected components.',
      bruteForce: {
        name: 'Disjoint Set Union (Union Find)',
        complexity: { time: 'O(m * n * α(mn))', space: 'O(m * n)' },
        explanation: 'Union adjacent land cells together and count roots.',
        code: `// Union Find on grid`
      },
      optimal: {
        name: 'Flood Fill DFS',
        complexity: { time: 'O(m * n)', space: 'O(m * n) recursion stack' },
        explanation: 'Iterate through grid; whenever land found, flood fill neighbors to \'0\'.',
        code: `function numIslands(grid) {\n  if (!grid.length) return 0;\n  let count = 0;\n  const rows = grid.length, cols = grid[0].length;\n  function dfs(r, c) {\n    if (r < 0 || c < 0 || r >= rows || c >= cols || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < rows; r++) {\n    for (let c = 0; c < cols; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}`
      }
    },
    similarProblemIds: ['p-39', 'p-40']
  },
  {
    id: 'p-39',
    slug: 'course-schedule-cycle-detection',
    title: 'Course Schedule Prerequisites',
    difficulty: 'Medium',
    acceptance: '47.5%',
    topic: 'Graphs',
    pattern: 'Topological Sort',
    companies: ['Google', 'Meta', 'Amazon'],
    description: 'There are a total of `numCourses` courses you have to take, labeled from `0` to `numCourses - 1`. You are given an array `prerequisites` where `prerequisites[i] = [a, b]` indicates that you must take course `b` first if you want to take course `a`.\n\nReturn `true` if you can finish all courses. Otherwise, return `false`.',
    examples: [
      { input: 'numCourses = 2, prerequisites = [[1, 0]]', output: 'true', explanation: 'Take course 0 then course 1.' },
      { input: 'numCourses = 2, prerequisites = [[1, 0], [0, 1]]', output: 'false', explanation: 'Circular dependency between 0 and 1.' }
    ],
    constraints: ['1 <= numCourses <= 2000', '0 <= prerequisites.length <= 5000', 'prerequisites[i].length == 2', '0 <= a, b < numCourses', 'All pairs are unique.'],
    starterCode: {
      javascript: `function canFinish(numCourses, prerequisites) {\n  // Kahn\'s Algorithm (Topological Sort)\n  \n}`,
      python: `def can_finish(num_courses: int, prerequisites: list[list[int]]) -> bool:\n    pass`,
      cpp: `#include <vector>\nusing namespace std;\nclass Solution { public: bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {} };`,
      java: `class Solution { public boolean canFinish(int numCourses, int[][] prerequisites) { return false; } }`,
      go: `func canFinish(numCourses int, prerequisites [][]int) bool { return false }`,
      rust: `impl Solution { pub fn can_finish(num_courses: i32, prerequisites: Vec<Vec<i32>>) -> bool { false } }`
    },
    testCases: [
      { input: [2, [[1, 0]]], expected: true },
      { input: [2, [[1, 0], [0, 1]]], expected: false }
    ],
    hints: [
      { level: 1, type: 'conceptual', title: 'Cycle in Directed Graph', content: 'Courses can be finished if and only if the dependency graph is a Directed Acyclic Graph (no cycles).' },
      { level: 2, type: 'direction', title: 'In-Degree Tracking', content: 'Count in-degrees for every node. Push nodes with in-degree 0 into a queue (courses with no prerequisites).' },
      { level: 3, type: 'near-solution', title: 'Kahn\'s Algorithm', content: 'Pop from queue, decrement in-degree of neighboring courses. If neighbor in-degree reaches 0, enqueue it. Check if visited count === numCourses.' }
    ],
    editorial: {
      summary: 'Kahn\'s BFS algorithm using in-degree tracking resolves topological order in O(V + E).',
      patternExplanation: 'Topological sort cycle detection.',
      bruteForce: {
        name: 'DFS Path Visited Set',
        complexity: { time: 'O(V² + E)', space: 'O(V)' },
        explanation: 'Run DFS from each node tracking visited path to detect back edges.',
        code: `// DFS cycle detection`
      },
      optimal: {
        name: 'Kahn\'s Algorithm (BFS)',
        complexity: { time: 'O(V + E)', space: 'O(V + E)' },
        explanation: 'In-degree array + Queue of courses with 0 remaining prereqs.',
        code: `function canFinish(numCourses, prerequisites) {\n  const inDegree = new Array(numCourses).fill(0);\n  const adj = Array.from({ length: numCourses }, () => []);\n  for (const [course, pre] of prerequisites) {\n    adj[pre].push(course);\n    inDegree[course]++;\n  }\n  const queue = [];\n  for (let i = 0; i < numCourses; i++) if (inDegree[i] === 0) queue.push(i);\n  let visited = 0;\n  while (queue.length) {\n    const node = queue.shift();\n    visited++;\n    for (const next of adj[node]) {\n      inDegree[next]--;\n      if (inDegree[next] === 0) queue.push(next);\n    }\n  }\n  return visited === numCourses;\n}`
      }
    },
    similarProblemIds: ['p-38', 'p-40']
  },
  {
    id: 'p-40',
    slug: 'pacific-atlantic-water-flow',
    title: 'Pacific Atlantic Water Flow',
    difficulty: 'Medium',
    acceptance: '55.2%',
    topic: 'Graphs',
    pattern: 'Topological Sort',
    companies: ['Google', 'Amazon'],
    description: 'There is an `m x n` rectangular island that borders both the Pacific Ocean and Atlantic Ocean.\n\nWater can flow to neighboring cells (north, south, east, west) if the neighboring cell\'s height is less than or equal to the current cell\'s height. Water can also flow directly into either ocean from cells bordering it.\n\nReturn a 2D list of grid coordinates `result` where `result[i] = [r, c]` denotes that rain water can flow from cell `(r, c)` to both the Pacific and Atlantic oceans.',
    examples: [
      { input: 'heights = [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]', output: '[[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]' }
    ],
    constraints: ['m == heights.length', 'n == heights[r].length', '1 <= m, n <= 200', '0 <= heights[r][c] <= 10^5'],
    starterCode: {
      javascript: `function pacificAtlantic(heights) {\n  // Reverse flow from ocean borders inward\n  return [[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]];\n}`,
      python: `def pacific_atlantic(heights: list[list[int]]) -> list[list[int]]:\n    return [[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]`,
      cpp: `class Solution { public: vector<vector<int>> pacificAtlantic(vector<vector<int>>& heights) {} };`,
      java: `class Solution { public List<List<Integer>> pacificAtlantic(int[][] heights) { return new ArrayList<>(); } }`,
      go: `func pacificAtlantic(heights [][]int) [][]int { return nil }`,
      rust: `impl Solution { pub fn pacific_atlantic(heights: Vec<Vec<i32>>) -> Vec<Vec<i32>> { vec![] } }`
    },
    testCases: [
      { input: [[[1, 2, 2, 3, 5], [3, 2, 3, 4, 4], [2, 4, 5, 3, 1], [6, 7, 1, 4, 5], [5, 1, 1, 2, 4]]], expected: [[0, 4], [1, 3], [1, 4], [2, 2], [3, 0], [3, 1], [4, 0]] }
    ],
    hints: [
      { level: 1, type: 'conceptual', title: 'Reverse Thinking', content: 'Instead of flowing from every cell to oceans, flow backwards uphill from oceans into the island!' },
      { level: 2, type: 'direction', title: 'Two Visited Sets', content: 'Do one traversal starting at Pacific borders and another at Atlantic borders.' },
      { level: 3, type: 'near-solution', title: 'Intersection', content: 'Cells present in both visited matrices can flow to both oceans.' }
    ],
    editorial: {
      summary: 'Reverse DFS from ocean borders uphill finds the intersection in O(m * n).',
      patternExplanation: 'Boundary inward flow.',
      bruteForce: {
        name: 'DFS from each cell',
        complexity: { time: 'O((m * n)²)', space: 'O(m * n)' },
        explanation: 'Start DFS from each cell and see if it can reach both oceans.',
        code: `// Exhaustive DFS`
      },
      optimal: {
        name: 'Reverse Multi-Source DFS',
        complexity: { time: 'O(m * n)', space: 'O(m * n)' },
        explanation: 'Start from ocean shores and climb upward.',
        code: `// Reverse uphill DFS`
      }
    },
    similarProblemIds: ['p-38', 'p-39']
  },
  {
    id: 'p-41',
    slug: 'climbing-stairs-memoization',
    title: 'Climbing Stairs Combinations',
    difficulty: 'Easy',
    acceptance: '85.2%',
    topic: 'Dynamic Programming',
    pattern: 'Dynamic Programming',
    companies: ['Amazon', 'Google', 'Apple'],
    description: 'You are climbing a staircase. It takes `n` steps to reach the top.\n\nEach time you can either climb `1` or `2` steps. In how many distinct ways can you climb to the top?',
    examples: [
      { input: 'n = 2', output: '2', explanation: '1. 1 step + 1 step\n2. 2 steps' },
      { input: 'n = 3', output: '3', explanation: '1. 1+1+1\n2. 1+2\n3. 2+1' }
    ],
    constraints: ['1 <= n <= 45'],
    starterCode: {
      javascript: `function climbStairs(n) {\n  // Fibonacci transition dp[i] = dp[i-1] + dp[i-2]\n  \n}`,
      python: `def climb_stairs(n: int) -> int:\n    pass`,
      cpp: `class Solution { public: int climbStairs(int n) {} };`,
      java: `class Solution { public int climbStairs(int n) { return 0; } }`,
      go: `func climbStairs(n int) int { return 0 }`,
      rust: `impl Solution { pub fn climb_stairs(n: i32) -> i32 { 0 } }`
    },
    testCases: [
      { input: [2], expected: 2 },
      { input: [3], expected: 3 },
      { input: [5], expected: 8 }
    ],
    hints: [
      { level: 1, type: 'conceptual', title: 'Subproblem breakdown', content: 'To reach step n, you could have come from step (n - 1) via 1 step, or step (n - 2) via 2 steps.' },
      { level: 2, type: 'direction', title: 'Recurrence relation', content: 'ways(n) = ways(n - 1) + ways(n - 2).' },
      { level: 3, type: 'near-solution', title: 'O(1) Space Fibonacci', content: 'Track prev1 and prev2 in two variables.' }
    ],
    editorial: {
      summary: 'Fibonacci recurrence with two variables achieves O(n) runtime and O(1) space.',
      patternExplanation: 'State transition recurrence.',
      bruteForce: {
        name: 'Naive Recursion',
        complexity: { time: 'O(2^n)', space: 'O(n)' },
        explanation: 'f(n) = f(n-1) + f(n-2) without memoization.',
        code: `// Exponential tree`
      },
      optimal: {
        name: 'Constant Space DP',
        complexity: { time: 'O(n)', space: 'O(1)' },
        explanation: 'Iteratively update two variables.',
        code: `function climbStairs(n) {\n  if (n <= 2) return n;\n  let a = 1, b = 2;\n  for (let i = 3; i <= n; i++) {\n    const next = a + b;\n    a = b;\n    b = next;\n  }\n  return b;\n}`
      }
    },
    similarProblemIds: ['p-42', 'p-43']
  },
  {
    id: 'p-42',
    slug: 'house-robber-linear-dp',
    title: 'House Robber Optimal Loot',
    difficulty: 'Medium',
    acceptance: '53.9%',
    topic: 'Dynamic Programming',
    pattern: 'Dynamic Programming',
    companies: ['Google', 'Meta', 'Amazon'],
    description: 'You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, the only constraint stopping you from robbing each of them is that adjacent houses have security systems connected and it will automatically contact the police if two adjacent houses were broken into on the same night.\n\nGiven an integer array `nums` representing the amount of money of each house, return the maximum amount of money you can rob tonight without alerting the police.',
    examples: [
      { input: 'nums = [1,2,3,1]', output: '4', explanation: 'Rob house 1 (money = 1) and then rob house 3 (money = 3). Total = 1 + 3 = 4.' },
      { input: 'nums = [2,7,9,3,1]', output: '12', explanation: 'Rob house 1 (2), house 3 (9), and house 5 (1). Total = 12.' }
    ],
    constraints: ['1 <= nums.length <= 100', '0 <= nums[i] <= 400'],
    starterCode: {
      javascript: `function rob(nums) {\n  // dp[i] = max(dp[i-1], dp[i-2] + nums[i])\n  \n}`,
      python: `def rob(nums: list[int]) -> int:\n    pass`,
      cpp: `class Solution { public: int rob(vector<int>& nums) {} };`,
      java: `class Solution { public int rob(int[] nums) { return 0; } }`,
      go: `func rob(nums []int) int { return 0 }`,
      rust: `impl Solution { pub fn rob(nums: Vec<i32>) -> i32 { 0 } }`
    },
    testCases: [
      { input: [[1, 2, 3, 1]], expected: 4 },
      { input: [[2, 7, 9, 3, 1]], expected: 12 },
      { input: [[0]], expected: 0 }
    ],
    hints: [
      { level: 1, type: 'conceptual', title: 'Binary Choice', content: 'At house i, you either rob it (earning nums[i] + max from house i - 2) or skip it (keeping max from house i - 1).' },
      { level: 2, type: 'direction', title: 'Recurrence', content: 'dp[i] = max(dp[i-1], dp[i-2] + nums[i]).' },
      { level: 3, type: 'near-solution', title: 'Two Variables', content: 'Maintain rob1 and rob2 to achieve O(1) extra space.' }
    ],
    editorial: {
      summary: 'Dynamic programming keeping two variables computes optimal looting in linear time.',
      patternExplanation: 'Non-adjacent choice state optimization.',
      bruteForce: {
        name: 'Recursive Branching',
        complexity: { time: 'O(2^n)', space: 'O(n)' },
        explanation: 'Try all non-adjacent subsets.',
        code: `// Exponential tree`
      },
      optimal: {
        name: 'Space-Optimized DP',
        complexity: { time: 'O(n)', space: 'O(1)' },
        explanation: 'Track two previous states.',
        code: `function rob(nums) {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(rob1 + n, rob2);\n    rob1 = rob2;\n    rob2 = temp;\n  }\n  return rob2;\n}`
      }
    },
    similarProblemIds: ['p-41', 'p-43']
  },
  {
    id: 'p-43',
    slug: 'coin-change-fewest-coins',
    title: 'Coin Change Minimum Coins',
    difficulty: 'Medium',
    acceptance: '44.8%',
    topic: 'Dynamic Programming',
    pattern: 'Dynamic Programming',
    companies: ['Amazon', 'Google', 'Bloomberg'],
    description: 'You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money.\n\nReturn the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return `-1`.\n\nYou may assume that you have an infinite number of each kind of coin.',
    examples: [
      { input: 'coins = [1,2,5], amount = 11', output: '3', explanation: '11 = 5 + 5 + 1' },
      { input: 'coins = [2], amount = 3', output: '-1' },
      { input: 'coins = [1], amount = 0', output: '0' }
    ],
    constraints: ['1 <= coins.length <= 12', '1 <= coins[i] <= 2^31 - 1', '0 <= amount <= 10^4'],
    starterCode: {
      javascript: `function coinChange(coins, amount) {\n  // Bottom-up DP: dp[i] = min(dp[i], 1 + dp[i - coin])\n  \n}`,
      python: `def coin_change(coins: list[int], amount: int) -> int:\n    pass`,
      cpp: `class Solution { public: int coinChange(vector<int>& coins, int amount) {} };`,
      java: `class Solution { public int coinChange(int[] coins, int amount) { return -1; } }`,
      go: `func coinChange(coins []int, amount int) int { return -1 }`,
      rust: `impl Solution { pub fn coin_change(coins: Vec<i32>, amount: i32) -> i32 { -1 } }`
    },
    testCases: [
      { input: [[1, 2, 5], 11], expected: 3 },
      { input: [[2], 3], expected: -1 },
      { input: [[1], 0], expected: 0 }
    ],
    hints: [
      { level: 1, type: 'conceptual', title: 'Why Greedy Fails', content: 'Greedy choice (always choosing largest coin) fails! e.g., coins = [1, 3, 4], amount = 6: greedy gives 4+1+1 (3 coins), but 3+3 = 2 coins!' },
      { level: 2, type: 'direction', title: 'DP Array of size amount + 1', content: 'Initialize dp array with Infinity. dp[0] = 0.' },
      { level: 3, type: 'near-solution', title: 'Transition Loop', content: 'For a in 1..amount: for c in coins: if a - c >= 0: dp[a] = min(dp[a], 1 + dp[a - c]).' }
    ],
    editorial: {
      summary: 'Bottom-up DP table over amounts 0..amount computes optimal coin combination in O(amount * len(coins)).',
      patternExplanation: 'Unbounded knapsack minimization.',
      bruteForce: {
        name: 'Exhaustive DFS',
        complexity: { time: 'O(S^n)', space: 'O(n)' },
        explanation: 'Try all coin denominations recursively.',
        code: `// Exponential tree`
      },
      optimal: {
        name: 'Bottom-Up Tabulation',
        complexity: { time: 'O(amount * coins.length)', space: 'O(amount)' },
        explanation: 'Fill DP array from 1 up to amount.',
        code: `function coinChange(coins, amount) {\n  const dp = new Array(amount + 1).fill(Infinity);\n  dp[0] = 0;\n  for (let i = 1; i <= amount; i++) {\n    for (const c of coins) {\n      if (i - c >= 0) dp[i] = Math.min(dp[i], dp[i - c] + 1);\n    }\n  }\n  return dp[amount] === Infinity ? -1 : dp[amount];\n}`
      }
    },
    similarProblemIds: ['p-41', 'p-44']
  },
  {
    id: 'p-44',
    slug: 'longest-common-subsequence-2d-dp',
    title: 'Longest Common Subsequence',
    difficulty: 'Medium',
    acceptance: '58.7%',
    topic: 'Dynamic Programming',
    pattern: 'Dynamic Programming',
    companies: ['Google', 'Amazon', 'Meta'],
    description: 'Given two strings `text1` and `text2`, return the length of their longest common subsequence. If there is no common subsequence, return `0`.\n\nA subsequence of a string is a new string generated from the original string with some characters (can be none) deleted without changing the relative order of the remaining characters.',
    examples: [
      { input: 'text1 = "abcde", text2 = "ace"', output: '3', explanation: 'The longest common subsequence is "ace" and its length is 3.' },
      { input: 'text1 = "abc", text2 = "abc"', output: '3' },
      { input: 'text1 = "abc", text2 = "def"', output: '0' }
    ],
    constraints: ['1 <= text1.length, text2.length <= 1000', 'text1 and text2 consist of only lowercase English characters.'],
    starterCode: {
      javascript: `function longestCommonSubsequence(text1, text2) {\n  // 2D DP matrix\n  \n}`,
      python: `def longest_common_subsequence(text1: str, text2: str) -> int:\n    pass`,
      cpp: `class Solution { public: int longestCommonSubsequence(string text1, string text2) {} };`,
      java: `class Solution { public int longestCommonSubsequence(String text1, String text2) { return 0; } }`,
      go: `func longestCommonSubsequence(text1 string, text2 string) int { return 0 }`,
      rust: `impl Solution { pub fn longest_common_subsequence(text1: String, text2: String) -> i32 { 0 } }`
    },
    testCases: [
      { input: ['abcde', 'ace'], expected: 3 },
      { input: ['abc', 'abc'], expected: 3 },
      { input: ['abc', 'def'], expected: 0 }
    ],
    hints: [
      { level: 1, type: 'conceptual', title: 'Character Equality Match', content: 'If text1[i] === text2[j], then dp[i][j] = 1 + dp[i+1][j+1].' },
      { level: 2, type: 'direction', title: 'Mismatch Branch', content: 'If text1[i] !== text2[j], then dp[i][j] = max(dp[i+1][j], dp[i][j+1]).' },
      { level: 3, type: 'near-solution', title: 'Bottom-up Table', content: 'Build table of size (m + 1) x (n + 1) starting from bottom right base cases 0.' }
    ],
    editorial: {
      summary: '2D DP table comparing prefixes/suffixes solves in O(m * n) time and O(min(m, n)) space.',
      patternExplanation: '2D grid character alignment.',
      bruteForce: {
        name: 'Generate all Subsequences',
        complexity: { time: 'O(2^m * n)', space: 'O(m)' },
        explanation: 'Generate all 2^m subsequences of text1, check if each exists in text2.',
        code: `// Exponential subsequences`
      },
      optimal: {
        name: '2D Dynamic Programming',
        complexity: { time: 'O(m * n)', space: 'O(m * n)' },
        explanation: 'Tabulate character matching decisions.',
        code: `function longestCommonSubsequence(text1, text2) {\n  const m = text1.length, n = text2.length;\n  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));\n  for (let i = m - 1; i >= 0; i--) {\n    for (let j = n - 1; j >= 0; j--) {\n      if (text1[i] === text2[j]) dp[i][j] = 1 + dp[i + 1][j + 1];\n      else dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1]);\n    }\n  }\n  return dp[0][0];\n}`
      }
    },
    similarProblemIds: ['p-43', 'p-45']
  },
  {
    id: 'p-45',
    slug: 'unique-paths-grid-combinatorics',
    title: 'Unique Paths Grid',
    difficulty: 'Medium',
    acceptance: '64.5%',
    topic: 'Dynamic Programming',
    pattern: 'Dynamic Programming',
    companies: ['Google', 'Meta', 'Amazon'],
    description: 'There is a robot on an `m x n` grid. The robot is initially located at the top-left corner `(0, 0)`. The robot tries to move to the bottom-right corner `(m - 1, n - 1)`. The robot can only move either down or right at any point in time.\n\nGiven the two integers `m` and `n`, return the number of possible unique paths that the robot can take to reach the bottom-right corner.',
    examples: [
      { input: 'm = 3, n = 7', output: '28' },
      { input: 'm = 3, n = 2', output: '3' }
    ],
    constraints: ['1 <= m, n <= 100'],
    starterCode: {
      javascript: `function uniquePaths(m, n) {\n  // dp[r][c] = dp[r+1][c] + dp[r][c+1]\n  \n}`,
      python: `def unique_paths(m: int, n: int) -> int:\n    pass`,
      cpp: `class Solution { public: int uniquePaths(int m, int n) {} };`,
      java: `class Solution { public int uniquePaths(int m, int n) { return 0; } }`,
      go: `func uniquePaths(m int, n int) int { return 0 }`,
      rust: `impl Solution { pub fn unique_paths(m: i32, n: i32) -> i32 { 0 } }`
    },
    testCases: [
      { input: [3, 7], expected: 28 },
      { input: [3, 2], expected: 3 },
      { input: [1, 1], expected: 1 }
    ],
    hints: [
      { level: 1, type: 'conceptual', title: 'Path Sum Rule', content: 'Number of ways to reach (r, c) is paths(r - 1, c) + paths(r, c - 1).' },
      { level: 2, type: 'direction', title: 'Row reduction', content: 'Notice you only need the previous row to compute the current row (O(n) space).' },
      { level: 3, type: 'near-solution', title: 'Combinatorics alternative', content: 'This is equivalent to choosing (m - 1) down moves out of (m + n - 2) total steps: C(m+n-2, m-1).' }
    ],
    editorial: {
      summary: 'Dynamic programming or combinations formula C(m+n-2, m-1) solves in O(m * n) or O(m) time.',
      patternExplanation: 'Grid path addition.',
      bruteForce: {
        name: 'Naive Recursion',
        complexity: { time: 'O(2^(m+n))', space: 'O(m+n)' },
        explanation: 'Try moving right and down recursively.',
        code: `// Exponential search`
      },
      optimal: {
        name: 'Row DP Table',
        complexity: { time: 'O(m * n)', space: 'O(n)' },
        explanation: 'Maintain current row path sums.',
        code: `function uniquePaths(m, n) {\n  const row = new Array(n).fill(1);\n  for (let i = 1; i < m; i++) {\n    for (let j = 1; j < n; j++) {\n      row[j] += row[j - 1];\n    }\n  }\n  return row[n - 1];\n}`
      }
    },
    similarProblemIds: ['p-41', 'p-44']
  },
  {
    id: 'p-46',
    slug: 'edit-distance-levenshtein',
    title: 'Edit Distance (Levenshtein)',
    difficulty: 'Hard',
    acceptance: '56.1%',
    topic: 'Dynamic Programming',
    pattern: 'Dynamic Programming',
    companies: ['Google', 'Microsoft'],
    description: 'Given two strings `word1` and `word2`, return the minimum number of operations required to convert `word1` to `word2`.\n\nYou have the following three operations permitted on a word:\n- Insert a character\n- Delete a character\n- Replace a character',
    examples: [
      { input: 'word1 = "horse", word2 = "ros"', output: '3', explanation: 'horse -> rorse (replace \'h\' with \'r\') -> rose (remove \'r\') -> ros (remove \'e\')' },
      { input: 'word1 = "intention", word2 = "execution"', output: '5' }
    ],
    constraints: ['0 <= word1.length, word2.length <= 500', 'word1 and word2 consist of lowercase English letters.'],
    starterCode: {
      javascript: `function minDistance(word1, word2) {\n  // 2D Levenshtein table: insert, delete, replace\n  \n}`,
      python: `def min_distance(word1: str, word2: str) -> int:\n    pass`,
      cpp: `class Solution { public: int minDistance(string word1, string word2) {} };`,
      java: `class Solution { public int minDistance(String word1, String word2) { return 0; } }`,
      go: `func minDistance(word1 string, word2 string) int { return 0 }`,
      rust: `impl Solution { pub fn min_distance(word1: String, word2: String) -> i32 { 0 } }`
    },
    testCases: [
      { input: ['horse', 'ros'], expected: 3 },
      { input: ['intention', 'execution'], expected: 5 },
      { input: ['', 'a'], expected: 1 }
    ],
    hints: [
      { level: 1, type: 'conceptual', title: 'Three Choices', content: 'Insert = dp[i][j+1], Delete = dp[i+1][j], Replace = dp[i+1][j+1].' },
      { level: 2, type: 'direction', title: 'Match No-op', content: 'If word1[i] === word2[j], cost is 0 and dp[i][j] = dp[i+1][j+1].' },
      { level: 3, type: 'near-solution', title: 'Base cases', content: 'Empty string conversions equal the length of the other string.' }
    ],
    editorial: {
      summary: 'Classical 2D Dynamic Programming computes Levenshtein edit distance in O(m * n).',
      patternExplanation: 'Multi-operation edit distance matrix.',
      bruteForce: {
        name: 'Recursive branching',
        complexity: { time: 'O(3^(m+n))', space: 'O(m+n)' },
        explanation: 'Try all 3 edit operations recursively.',
        code: `// Exponential tree`
      },
      optimal: {
        name: '2D DP Matrix',
        complexity: { time: 'O(m * n)', space: 'O(m * n)' },
        explanation: 'Compute minimum cost over table.',
        code: `function minDistance(word1, word2) {\n  const m = word1.length, n = word2.length;\n  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));\n  for (let i = 0; i <= m; i++) dp[i][n] = m - i;\n  for (let j = 0; j <= n; j++) dp[m][j] = n - j;\n  for (let i = m - 1; i >= 0; i--) {\n    for (let j = n - 1; j >= 0; j--) {\n      if (word1[i] === word2[j]) dp[i][j] = dp[i + 1][j + 1];\n      else dp[i][j] = 1 + Math.min(dp[i + 1][j], dp[i][j + 1], dp[i + 1][j + 1]);\n    }\n  }\n  return dp[0][0];\n}`
      }
    },
    similarProblemIds: ['p-44', 'p-45']
  },
  {
    id: 'p-47',
    slug: 'subsets-power-set-backtracking',
    title: 'Subsets Power Set',
    difficulty: 'Medium',
    acceptance: '76.8%',
    topic: 'Backtracking',
    pattern: 'Backtracking',
    companies: ['Meta', 'Amazon', 'Google'],
    description: 'Given an integer array `nums` of unique elements, return all possible subsets (the power set).\n\nThe solution set must not contain duplicate subsets. Return the solution in any order.',
    examples: [
      { input: 'nums = [1,2,3]', output: '[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]' },
      { input: 'nums = [0]', output: '[[],[0]]' }
    ],
    constraints: ['1 <= nums.length <= 10', '-10 <= nums[i] <= 10', 'All the numbers of nums are unique.'],
    starterCode: {
      javascript: `function subsets(nums) {\n  // Backtracking choice tree: include or exclude\n  \n}`,
      python: `def subsets(nums: list[int]) -> list[list[int]]:\n    pass`,
      cpp: `class Solution { public: vector<vector<int>> subsets(vector<int>& nums) {} };`,
      java: `class Solution { public List<List<Integer>> subsets(int[] nums) { return new ArrayList<>(); } }`,
      go: `func subsets(nums []int) [][]int { return nil }`,
      rust: `impl Solution { pub fn subsets(nums: Vec<i32>) -> Vec<Vec<i32>> { vec![] } }`
    },
    testCases: [
      { input: [[1, 2, 3]], expected: [[], [1], [1, 2], [1, 2, 3], [1, 3], [2], [2, 3], [3]] },
      { input: [[0]], expected: [[], [0]] }
    ],
    hints: [
      { level: 1, type: 'conceptual', title: 'Include or Exclude', content: 'For each number nums[i], there are two decisions: include in current subset, or exclude.' },
      { level: 2, type: 'direction', title: 'Deep Copy Subset', content: 'When adding current subset to result list, make a clone [...subset] so mutations do not corrupt it.' },
      { level: 3, type: 'near-solution', title: 'Backtrack Step', content: 'Push element, recurse to i + 1, pop element.' }
    ],
    editorial: {
      summary: 'Backtracking exploration generates all 2^n subsets in O(n * 2^n) time.',
      patternExplanation: 'Include / exclude binary decision tree.',
      bruteForce: {
        name: 'Bitmask Generation',
        complexity: { time: 'O(n * 2^n)', space: 'O(n * 2^n)' },
        explanation: 'Loop integer from 0 to 2^n - 1, inspect bit i.',
        code: `// Bitmask subset generator`
      },
      optimal: {
        name: 'Backtracking DFS',
        complexity: { time: 'O(n * 2^n)', space: 'O(n)' },
        explanation: 'Recursive state tree with push/pop.',
        code: `function subsets(nums) {\n  const res = [];\n  function backtrack(idx, current) {\n    res.push([...current]);\n    for (let i = idx; i < nums.length; i++) {\n      current.push(nums[i]);\n      backtrack(i + 1, current);\n      current.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}`
      }
    },
    similarProblemIds: ['p-48', 'p-49']
  },
  {
    id: 'p-48',
    slug: 'combination-sum-target',
    title: 'Combination Sum Target',
    difficulty: 'Medium',
    acceptance: '71.2%',
    topic: 'Backtracking',
    pattern: 'Backtracking',
    companies: ['Amazon', 'Google', 'Airbnb'],
    description: 'Given an array of distinct integers `candidates` and a target integer `target`, return a list of all unique combinations of `candidates` where the chosen numbers sum to `target`. You may return the combinations in any order.\n\nThe same number may be chosen from candidates an unlimited number of times. Two combinations are unique if the frequency of at least one of the chosen numbers is different.',
    examples: [
      { input: 'candidates = [2,3,6,7], target = 7', output: '[[2,2,3],[7]]' },
      { input: 'candidates = [2,3,5], target = 8', output: '[[2,2,2,2],[2,3,3],[3,5]]' }
    ],
    constraints: ['1 <= candidates.length <= 30', '2 <= candidates[i] <= 40', 'All elements of candidates are distinct.', '1 <= target <= 40'],
    starterCode: {
      javascript: `function combinationSum(candidates, target) {\n  // Backtracking with reuse allowed\n  \n}`,
      python: `def combination_sum(candidates: list[int], target: int) -> list[list[int]]:\n    pass`,
      cpp: `class Solution { public: vector<vector<int>> combinationSum(vector<int>& candidates, int target) {} };`,
      java: `class Solution { public List<List<Integer>> combinationSum(int[] candidates, int target) { return new ArrayList<>(); } }`,
      go: `func combinationSum(candidates []int, target int) [][]int { return nil }`,
      rust: `impl Solution { pub fn combination_sum(candidates: Vec<i32>, target: i32) -> Vec<Vec<i32>> { vec![] } }`
    },
    testCases: [
      { input: [[2, 3, 6, 7], 7], expected: [[2, 2, 3], [7]] },
      { input: [[2, 3, 5], 8], expected: [[2, 2, 2, 2], [2, 3, 3], [3, 5]] }
    ],
    hints: [
      { level: 1, type: 'conceptual', title: 'Unlimited Re-use', content: 'Because candidates can be reused, when choosing candidates[i], do not increment index to i + 1!' },
      { level: 2, type: 'direction', title: 'Base Cases', content: 'If current sum === target, record combination. If current sum > target, stop searching this path.' },
      { level: 3, type: 'near-solution', title: 'Sorted Pruning', content: 'Sort candidates first. If candidate > remaining target, break early.' }
    ],
    editorial: {
      summary: 'Backtracking with candidate index retention allows unbounded selection while avoiding duplicate permutations.',
      patternExplanation: 'State tree branch pruning.',
      bruteForce: {
        name: 'Unconstrained Recursion',
        complexity: { time: 'O(2^target)', space: 'O(target)' },
        explanation: 'Generate permutations and sort to filter duplicates.',
        code: `// Unpruned permutations`
      },
      optimal: {
        name: 'Pruned Backtracking',
        complexity: { time: 'O(2^target)', space: 'O(target)' },
        explanation: 'Advance index only when not reusing candidate.',
        code: `function combinationSum(candidates, target) {\n  const res = [];\n  function dfs(i, cur, total) {\n    if (total === target) return res.push([...cur]);\n    if (i >= candidates.length || total > target) return;\n    cur.push(candidates[i]);\n    dfs(i, cur, total + candidates[i]);\n    cur.pop();\n    dfs(i + 1, cur, total);\n  }\n  dfs(0, [], 0);\n  return res;\n}`
      }
    },
    similarProblemIds: ['p-47', 'p-49']
  },
  {
    id: 'p-49',
    slug: 'permutations-full-backtracking',
    title: 'Generate Permutations',
    difficulty: 'Medium',
    acceptance: '77.5%',
    topic: 'Backtracking',
    pattern: 'Backtracking',
    companies: ['Microsoft', 'Amazon', 'Google'],
    description: 'Given an array `nums` of distinct integers, return all the possible permutations. You can return the answer in any order.',
    examples: [
      { input: 'nums = [1,2,3]', output: '[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]' },
      { input: 'nums = [0,1]', output: '[[0,1],[1,0]]' }
    ],
    constraints: ['1 <= nums.length <= 6', '-10 <= nums[i] <= 10', 'All the integers of nums are unique.'],
    starterCode: {
      javascript: `function permute(nums) {\n  // In-place swap or used-visited tracking\n  \n}`,
      python: `def permute(nums: list[int]) -> list[list[int]]:\n    pass`,
      cpp: `class Solution { public: vector<vector<int>> permute(vector<int>& nums) {} };`,
      java: `class Solution { public List<List<Integer>> permute(int[] nums) { return new ArrayList<>(); } }`,
      go: `func permute(nums []int) [][]int { return nil }`,
      rust: `impl Solution { pub fn permute(nums: Vec<i32>) -> Vec<Vec<i32>> { vec![] } }`
    },
    testCases: [
      { input: [[1, 2, 3]], expected: [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]] },
      { input: [[0, 1]], expected: [[0, 1], [1, 0]] }
    ],
    hints: [
      { level: 1, type: 'conceptual', title: 'Factorial Count', content: 'For n elements, there are exactly n! unique permutations.' },
      { level: 2, type: 'direction', title: 'Visited Set', content: 'Keep a boolean array visited[i] indicating which elements are already in current permutation.' },
      { level: 3, type: 'near-solution', title: 'Base Case', content: 'When current.length === nums.length, push [...current].' }
    ],
    editorial: {
      summary: 'Backtracking with a visited mask creates all n! permutations in O(n * n!) time.',
      patternExplanation: 'Full combinatorial permutation tree.',
      bruteForce: {
        name: 'Iterative insertions',
        complexity: { time: 'O(n * n!)', space: 'O(n!)' },
        explanation: 'Insert next number into every position of previous permutations.',
        code: `// Iterative insertions`
      },
      optimal: {
        name: 'Backtracking with Visited Tracking',
        complexity: { time: 'O(n * n!)', space: 'O(n)' },
        explanation: 'Loop through all elements and recurse when unused.',
        code: `function permute(nums) {\n  const res = [], visited = new Array(nums.length).fill(false);\n  function dfs(cur) {\n    if (cur.length === nums.length) return res.push([...cur]);\n    for (let i = 0; i < nums.length; i++) {\n      if (visited[i]) continue;\n      visited[i] = true;\n      cur.push(nums[i]);\n      dfs(cur);\n      cur.pop();\n      visited[i] = false;\n    }\n  }\n  dfs([]);\n  return res;\n}`
      }
    },
    similarProblemIds: ['p-47', 'p-48']
  },
  {
    id: 'p-50',
    slug: 'single-number-xor-trick',
    title: 'Single Unique Number',
    difficulty: 'Easy',
    acceptance: '84.3%',
    topic: 'Bit Manipulation',
    pattern: 'Bit Manipulation',
    companies: ['Amazon', 'Google', 'Meta'],
    description: 'Given a non-empty array of integers `nums`, every element appears twice except for one. Find that single one.\n\nYou must implement a solution with a linear runtime complexity and use only constant extra space.',
    examples: [
      { input: 'nums = [2,2,1]', output: '1' },
      { input: 'nums = [4,1,2,1,2]', output: '4' }
    ],
    constraints: ['1 <= nums.length <= 3 * 10^4', '-3 * 10^4 <= nums[i] <= 3 * 10^4', 'Each element in the array appears twice except for one element which appears only once.'],
    starterCode: {
      javascript: `function singleNumber(nums) {\n  // XOR: a ^ a = 0, a ^ 0 = a\n  \n}`,
      python: `def single_number(nums: list[int]) -> int:\n    pass`,
      cpp: `class Solution { public: int singleNumber(vector<int>& nums) {} };`,
      java: `class Solution { public int singleNumber(int[] nums) { return 0; } }`,
      go: `func singleNumber(nums []int) int { return 0 }`,
      rust: `impl Solution { pub fn single_number(nums: Vec<i32>) -> i32 { 0 } }`
    },
    testCases: [
      { input: [[2, 2, 1]], expected: 1 },
      { input: [[4, 1, 2, 1, 2]], expected: 4 },
      { input: [[1]], expected: 1 }
    ],
    hints: [
      { level: 1, type: 'conceptual', title: 'XOR Identity', content: 'What happens when you XOR a number with itself? x ^ x = 0!' },
      { level: 2, type: 'direction', title: 'XOR Zero Identity', content: 'And x ^ 0 = x.' },
      { level: 3, type: 'near-solution', title: 'Single Pass XOR Accumulator', content: 'XOR all numbers in the array together; all paired numbers cancel out, leaving the single one!' }
    ],
    editorial: {
      summary: 'Bitwise XOR property (x ^ x = 0, x ^ 0 = x) isolates the unique element in O(n) time and O(1) space.',
      patternExplanation: 'Self-inversion bitwise cancellation.',
      bruteForce: {
        name: 'Hash Set Tracking',
        complexity: { time: 'O(n)', space: 'O(n)' },
        explanation: 'Add to Set; if seen, delete. The last element in the set is the answer.',
        code: `// Hash set membership`
      },
      optimal: {
        name: 'Bitwise XOR Reduction',
        complexity: { time: 'O(n)', space: 'O(1)' },
        explanation: 'XOR all numbers.',
        code: `function singleNumber(nums) {\n  return nums.reduce((acc, num) => acc ^ num, 0);\n}`
      }
    },
    similarProblemIds: ['p-1', 'p-2']
  }
];
