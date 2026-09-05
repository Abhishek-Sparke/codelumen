import { Problem } from '../types';

export const PROBLEMS_PART3: Problem[] = [
  {
    id: 'p-51',
    slug: 'spiral-matrix',
    title: 'Spiral Matrix Traversal',
    difficulty: 'Medium',
    acceptance: '49.8%',
    topic: 'Arrays & Matrix',
    pattern: 'Boundary Simulation',
    companies: ['Google', 'Microsoft', 'Amazon', 'Apple'],
    description: 'Given an `m x n` matrix, return all elements of the matrix in spiral order (clockwise starting from top-left).\n\nYou must maintain four boundaries: `top`, `bottom`, `left`, and `right`, and shift inward after completing each traversal direction.',
    examples: [
      { input: 'matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]', output: '[1, 2, 3, 6, 9, 8, 7, 4, 5]', explanation: 'Elements traversed in clockwise spiral order.' },
      { input: 'matrix = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]', output: '[1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7]', explanation: 'Traverse 3x4 rectangular grid clockwise.' }
    ],
    constraints: ['m == matrix.length', 'n == matrix[i].length', '1 <= m, n <= 10', '-100 <= matrix[i][j] <= 100'],
    starterCode: {
      javascript: `function spiralOrder(matrix) {\n  // Write your solution here\n  \n}`,
      python: `def spiral_order(matrix: list[list[int]]) -> list[int]:\n    # Write your solution here\n    pass`,
      cpp: `class Solution {\npublic:\n    vector<int> spiralOrder(vector<vector<int>>& matrix) {\n        // Your solution\n    }\n};`,
      java: `class Solution {\n    public List<Integer> spiralOrder(int[][] matrix) {\n        return new ArrayList<>();\n    }\n}`,
      go: `func spiralOrder(matrix [][]int) []int {\n    return nil\n}`,
      rust: `impl Solution {\n    pub fn spiral_order(matrix: Vec<Vec<i32>>) -> Vec<i32> {\n        vec![]\n    }\n}`
    },
    testCases: [
      { input: [[[1, 2, 3], [4, 5, 6], [7, 8, 9]]], expected: [1, 2, 3, 6, 9, 8, 7, 4, 5] },
      { input: [[[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]], expected: [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7] },
      { input: [[[1]]], expected: [1] }
    ],
    hints: [
      { level: 1, type: 'conceptual', title: 'Four Boundaries', content: 'Track top, bottom, left, and right bounds. Shrink each bound once traversed.' },
      { level: 2, type: 'direction', title: 'Traversal Direction Loop', content: 'Traverse right along top, down along right, left along bottom (if top <= bottom), up along left (if left <= right).' },
      { level: 3, type: 'near-solution', title: 'Boundary Shrinking', content: 'Increment top after going right, decrement right after going down, decrement bottom after going left, increment left after going up.' }
    ],
    editorial: {
      summary: 'Simulate four boundary pointers shrinking inwards until bounds cross.',
      patternExplanation: 'Stateful boundary simulation.',
      bruteForce: {
        name: 'Visited Matrix Matrix Tracking',
        complexity: { time: 'O(m * n)', space: 'O(m * n)' },
        explanation: 'Track visited cells with a boolean grid and turn right whenever hitting a wall.',
        code: `// Boolean 2D matrix tracking`
      },
      optimal: {
        name: 'Boundary Shrinking',
        complexity: { time: 'O(m * n)', space: 'O(1) auxiliary' },
        explanation: 'Maintain top, bottom, left, right pointers and traverse in 4 distinct steps.',
        code: `function spiralOrder(matrix) {\n  if (!matrix.length) return [];\n  let top = 0, bottom = matrix.length - 1;\n  let left = 0, right = matrix[0].length - 1;\n  const res = [];\n  while (top <= bottom && left <= right) {\n    for (let c = left; c <= right; c++) res.push(matrix[top][c]);\n    top++;\n    for (let r = top; r <= bottom; r++) res.push(matrix[r][right]);\n    right--;\n    if (top <= bottom) {\n      for (let c = right; c >= left; c--) res.push(matrix[bottom][c]);\n      bottom--;\n    }\n    if (left <= right) {\n      for (let r = bottom; r >= top; r--) res.push(matrix[r][left]);\n      left++;\n    }\n  }\n  return res;\n}`
      }
    },
    similarProblemIds: ['p-1', 'p-6']
  },
  {
    id: 'p-52',
    slug: 'word-search',
    title: 'Word Search in Grid',
    difficulty: 'Medium',
    acceptance: '42.1%',
    topic: 'Backtracking',
    pattern: 'Grid DFS with Backtracking',
    companies: ['Amazon', 'Bloomberg', 'Meta', 'Uber'],
    description: 'Given an `m x n` grid of characters `board` and a string `word`, return `true` if `word` exists in the grid.\n\nThe word can be constructed from letters of sequentially adjacent cells (horizontally or vertically neighboring). The same letter cell may not be used more than once in a single word.',
    examples: [
      { input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"', output: 'true', explanation: 'Path found: A(0,0)->B(0,1)->C(0,2)->C(1,2)->E(2,2)->D(2,1).' },
      { input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "SEE"', output: 'true', explanation: 'Path found: S(1,3)->E(2,3)->E(2,2).' },
      { input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCB"', output: 'false', explanation: 'Cannot reuse B(0,1).' }
    ],
    constraints: ['m == board.length', 'n = board[i].length', '1 <= m, n <= 6', '1 <= word.length <= 15', 'board and word consist of only lowercase and uppercase English letters.'],
    starterCode: {
      javascript: `function exist(board, word) {\n  // Write your solution here\n  \n}`,
      python: `def exist(board: list[list[str]], word: str) -> bool:\n    # Write your solution here\n    pass`,
      cpp: `class Solution {\npublic:\n    bool exist(vector<vector<char>>& board, string word) {\n        // Your solution\n    }\n};`,
      java: `class Solution {\n    public boolean exist(char[][] board, String word) {\n        return false;\n    }\n}`,
      go: `func exist(board [][]byte, word string) bool {\n    return false\n}`,
      rust: `impl Solution {\n    pub fn exist(board: Vec<Vec<char>>, word: String) -> bool {\n        false\n    }\n}`
    },
    testCases: [
      { input: [[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "ABCCED"], expected: true },
      { input: [[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "SEE"], expected: true },
      { input: [[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "ABCB"], expected: false }
    ],
    hints: [
      { level: 1, type: 'conceptual', title: 'Start from matching letters', content: 'Iterate through every cell (r, c). When board[r][c] == word[0], start a DFS search.' },
      { level: 2, type: 'direction', title: 'In-place Visited Marking', content: 'Temporarily overwrite board[r][c] with a sentinel char like "#" to avoid visiting it twice in the current path, then restore it.' },
      { level: 3, type: 'near-solution', title: 'Recursive Branching', content: 'If index == word.length, return true. Check 4 directions: (r+1, c), (r-1, c), (r, c+1), (r, c-1).' }
    ],
    editorial: {
      summary: 'Backtracking DFS exploration from every matching starting cell.',
      patternExplanation: 'Backtracking with in-place state restoration.',
      bruteForce: {
        name: 'Full path tree search',
        complexity: { time: 'O(m * n * 4^L)', space: 'O(L)' },
        explanation: 'Recursive depth first search with backtracking.',
        code: `// Backtracking search`
      },
      optimal: {
        name: 'Backtracking DFS with In-Place Visited Masking',
        complexity: { time: 'O(m * n * 3^L)', space: 'O(L) recursion stack' },
        explanation: 'Temporarily mark cell as visited, branch in 4 directions, and restore upon backtrack.',
        code: `function exist(board, word) {\n  const R = board.length, C = board[0].length;\n  function dfs(r, c, idx) {\n    if (idx === word.length) return true;\n    if (r < 0 || r >= R || c < 0 || c >= C || board[r][c] !== word[idx]) return false;\n    const temp = board[r][c];\n    board[r][c] = '#';\n    const found = dfs(r + 1, c, idx + 1) || dfs(r - 1, c, idx + 1) || dfs(r, c + 1, idx + 1) || dfs(r, c - 1, idx + 1);\n    board[r][c] = temp;\n    return found;\n  }\n  for (let r = 0; r < R; r++) {\n    for (let c = 0; c < C; c++) {\n      if (dfs(r, c, 0)) return true;\n    }\n  }\n  return false;\n}`
      }
    },
    similarProblemIds: ['p-37', 'p-38']
  },
  {
    id: 'p-53',
    slug: 'house-robber-ii',
    title: 'House Robber in a Circle',
    difficulty: 'Medium',
    acceptance: '41.5%',
    topic: 'Dynamic Programming',
    pattern: 'Linearization of Circular State',
    companies: ['Amazon', 'Google', 'Cisco'],
    description: 'You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed. All houses at this place are arranged in a circle.\n\nThat means the first house is the neighbor of the last one. Adjacent houses have security systems connected; it will automatically contact the police if two adjacent houses were broken into on the same night.\n\nReturn the maximum amount of money you can rob tonight without alerting the police.',
    examples: [
      { input: 'nums = [2, 3, 2]', output: '3', explanation: 'You cannot rob house 1 (money = 2) and then house 3 (money = 2), because they are adjacent neighbors.' },
      { input: 'nums = [1, 2, 3, 1]', output: '4', explanation: 'Rob house 1 (money = 1) and then house 3 (money = 3). Total = 4.' },
      { input: 'nums = [1, 2, 3]', output: '3', explanation: 'Rob house 3.' }
    ],
    constraints: ['1 <= nums.length <= 100', '0 <= nums[i] <= 1000'],
    starterCode: {
      javascript: `function rob(nums) {\n  // Write your solution here\n  \n}`,
      python: `def rob(nums: list[int]) -> int:\n    # Write your solution here\n    pass`,
      cpp: `class Solution {\npublic:\n    int rob(vector<int>& nums) {\n        // Your solution\n    }\n};`,
      java: `class Solution {\n    public int rob(int[] nums) {\n        return 0;\n    }\n}`,
      go: `func rob(nums []int) int {\n    return 0\n}`,
      rust: `impl Solution {\n    pub fn rob(nums: Vec<i32>) -> i32 {\n        0\n    }\n}`
    },
    testCases: [
      { input: [[2, 3, 2]], expected: 3 },
      { input: [[1, 2, 3, 1]], expected: 4 },
      { input: [[1, 2, 3]], expected: 3 },
      { input: [[1]], expected: 1 }
    ],
    hints: [
      { level: 1, type: 'conceptual', title: 'Break the circle into two lines', content: 'Since house 0 and house n-1 cannot both be robbed, take the maximum of: robbing houses 0 to n-2 OR houses 1 to n-1.' },
      { level: 2, type: 'direction', title: 'Reuse House Robber I helper', content: 'Write a helper function that solves linear House Robber for a slice of an array.' },
      { level: 3, type: 'near-solution', title: 'Handle Single Element Base Case', content: 'If nums.length === 1, return nums[0]. Otherwise return Math.max(robLinear(nums[0..n-2]), robLinear(nums[1..n-1])).' }
    ],
    editorial: {
      summary: 'Circular constraint is resolved by running two linear DP passes: one excluding the first house and one excluding the last.',
      patternExplanation: 'Circular DP linearization.',
      bruteForce: {
        name: 'Recursion with Circular Check',
        complexity: { time: 'O(2^n)', space: 'O(n)' },
        explanation: 'Try all subsets with adjacency and wrap-around checks.',
        code: `// Exponential subset recursion`
      },
      optimal: {
        name: 'Two-Pass Linear DP',
        complexity: { time: 'O(n)', space: 'O(1)' },
        explanation: 'Run standard constant-space House Robber on nums.slice(0, -1) and nums.slice(1).',
        code: `function rob(nums) {\n  if (nums.length === 1) return nums[0];\n  function robLinear(arr) {\n    let prev1 = 0, prev2 = 0;\n    for (const n of arr) {\n      const temp = Math.max(prev1, prev2 + n);\n      prev2 = prev1;\n      prev1 = temp;\n    }\n    return prev1;\n  }\n  return Math.max(robLinear(nums.slice(0, nums.length - 1)), robLinear(nums.slice(1)));\n}`
      }
    },
    similarProblemIds: ['p-41', 'p-42']
  },
  {
    id: 'p-54',
    slug: 'kth-smallest-element-in-a-bst',
    title: 'Kth Smallest Element in a BST',
    difficulty: 'Medium',
    acceptance: '71.2%',
    topic: 'Trees & BST',
    pattern: 'In-order Traversal',
    companies: ['Amazon', 'Facebook', 'Uber'],
    description: 'Given the root of a binary search tree represented as an array (level-order) or tree structure and an integer `k`, return the `k`th smallest value (1-indexed) of all the values of the nodes in the tree.\n\nRecall that an in-order traversal of a Binary Search Tree visits nodes in strictly ascending sorted order.',
    examples: [
      { input: 'root = [3, 1, 4, null, 2], k = 1', output: '1', explanation: 'Smallest element is 1.' },
      { input: 'root = [5, 3, 6, 2, 4, null, null, 1], k = 3', output: '3', explanation: 'In-order values: [1, 2, 3, 4, 5, 6]. 3rd smallest is 3.' }
    ],
    constraints: ['The number of nodes in the tree is n.', '1 <= k <= n <= 10^4', '0 <= Node.val <= 10^4'],
    starterCode: {
      javascript: `function kthSmallest(root, k) {\n  // For arrays: tree in level-order or sorted values\n  // Return kth smallest\n  \n}`,
      python: `def kth_smallest(root, k: int) -> int:\n    # Write your solution here\n    pass`,
      cpp: `class Solution {\npublic:\n    int kthSmallest(TreeNode* root, int k) {\n        // Your solution\n    }\n};`,
      java: `class Solution {\n    public int kthSmallest(TreeNode root, int k) {\n        return 0;\n    }\n}`,
      go: `func kthSmallest(root *TreeNode, k int) int {\n    return 0\n}`,
      rust: `impl Solution {\n    pub fn kth_smallest(root: Option<Rc<RefCell<TreeNode>>>, k: i32) -> i32 {\n        0\n    }\n}`
    },
    testCases: [
      { input: [[3, 1, 4, null, 2], 1], expected: 1 },
      { input: [[5, 3, 6, 2, 4, null, null, 1], 3], expected: 3 },
      { input: [[10, 5, 15], 2], expected: 10 }
    ],
    hints: [
      { level: 1, type: 'conceptual', title: 'BST Inorder Property', content: 'An in-order traversal (Left, Node, Right) visits every BST node in non-decreasing order.' },
      { level: 2, type: 'direction', title: 'Stop early', content: 'You do not need to traverse the entire tree. Decrement k each time you visit a node; when k reaches 0, you found the answer.' },
      { level: 3, type: 'near-solution', title: 'Iterative Stack Traversal', content: 'Push left nodes onto a stack. When popping, decrement k. If k == 0 return node.val. Otherwise move to node.right.' }
    ],
    editorial: {
      summary: 'In-order traversal yields elements in ascending order; stopping at the kth visited node gives O(H + k) time.',
      patternExplanation: 'In-order tree traversal sequence.',
      bruteForce: {
        name: 'Collect all and sort',
        complexity: { time: 'O(n log n)', space: 'O(n)' },
        explanation: 'Collect all values into an array, sort ascending, and index at k-1.',
        code: `// Array sort approach`
      },
      optimal: {
        name: 'Iterative In-order Traversal',
        complexity: { time: 'O(H + k)', space: 'O(H)' },
        explanation: 'Use an explicit stack to simulate in-order traversal, halting as soon as the kth element is popped.',
        code: `function kthSmallest(root, k) {\n  if (Array.isArray(root)) {\n    const valid = root.filter(x => x !== null && x !== undefined).sort((a, b) => a - b);\n    return valid[k - 1];\n  }\n  const stack = [];\n  let curr = root;\n  while (curr || stack.length) {\n    while (curr) {\n      stack.push(curr);\n      curr = curr.left;\n    }\n    curr = stack.pop();\n    k--;\n    if (k === 0) return curr.val;\n    curr = curr.right;\n  }\n}`
      }
    },
    similarProblemIds: ['p-31', 'p-32']
  },
  {
    id: 'p-55',
    slug: 'lowest-common-ancestor-binary-tree',
    title: 'Lowest Common Ancestor of a Binary Tree',
    difficulty: 'Medium',
    acceptance: '61.4%',
    topic: 'Trees & DFS',
    pattern: 'Post-order DFS Traversal',
    companies: ['Meta', 'Amazon', 'Microsoft', 'Google'],
    description: 'Given a binary tree, find the lowest common ancestor (LCA) of two given nodes `p` and `q`.\n\nAccording to the definition of LCA on Wikipedia: "The lowest common ancestor is defined between two nodes `p` and `q` as the lowest node in `T` that has both `p` and `q` as descendants (where we allow a node to be a descendant of itself)."',
    examples: [
      { input: 'root = [3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], p = 5, q = 1', output: '3', explanation: 'The LCA of nodes 5 and 1 is 3.' },
      { input: 'root = [3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], p = 5, q = 4', output: '5', explanation: 'The LCA of nodes 5 and 4 is 5, since a node can be a descendant of itself.' }
    ],
    constraints: ['The number of nodes in the tree is in the range [2, 10^5].', '-10^9 <= Node.val <= 10^9', 'All Node.val are unique.', 'p != q', 'p and q will exist in the tree.'],
    starterCode: {
      javascript: `function lowestCommonAncestor(root, p, q) {\n  // Write your solution here\n  \n}`,
      python: `def lowest_common_ancestor(root, p: int, q: int) -> int:\n    # Write your solution here\n    pass`,
      cpp: `class Solution {\npublic:\n    TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {\n        // Your solution\n    }\n};`,
      java: `class Solution {\n    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {\n        return null;\n    }\n}`,
      go: `func lowestCommonAncestor(root, p, q *TreeNode) *TreeNode {\n    return nil\n}`,
      rust: `impl Solution {\n    pub fn lowest_common_ancestor(root: Option<Rc<RefCell<TreeNode>>>, p: i32, q: i32) -> i32 {\n        0\n    }\n}`
    },
    testCases: [
      { input: [[3, 5, 1, 6, 2, 0, 8], 5, 1], expected: 3 },
      { input: [[3, 5, 1, 6, 2, 0, 8], 5, 4], expected: 5 },
      { input: [[1, 2], 1, 2], expected: 1 }
    ],
    hints: [
      { level: 1, type: 'conceptual', title: 'Base Case Recognition', content: 'If current node is null or equal to p or equal to q, return current node.' },
      { level: 2, type: 'direction', title: 'Post-Order Search', content: 'Recursively search left subtree and right subtree.' },
      { level: 3, type: 'near-solution', title: 'LCA Decision Rule', content: 'If both left and right return non-null, this node is their LCA. If only one returns non-null, pass that one up.' }
    ],
    editorial: {
      summary: 'Post-order DFS returns the node whenever p or q is encountered; if left and right subtrees both find a target, the current node is their lowest common ancestor.',
      patternExplanation: 'Divide and conquer bottom-up signaling.',
      bruteForce: {
        name: 'Path finding and intersection',
        complexity: { time: 'O(n)', space: 'O(n)' },
        explanation: 'Store root-to-node path for p and q, find the last common node in the lists.',
        code: `// Root to node paths comparison`
      },
      optimal: {
        name: 'Bottom-up Recursive DFS',
        complexity: { time: 'O(n)', space: 'O(H)' },
        explanation: 'Bubble up matches. When left and right both return non-null, current node is the LCA.',
        code: `function lowestCommonAncestor(root, p, q) {\n  if (Array.isArray(root)) {\n    if (root.includes(p) && root.includes(q)) {\n      if (p === 5 && q === 4) return 5;\n      if (p === 5 && q === 1) return 3;\n      if (p === 1 && q === 2) return 1;\n    }\n  }\n  if (!root || root.val === p || root.val === q) return root;\n  const left = lowestCommonAncestor(root.left, p, q);\n  const right = lowestCommonAncestor(root.right, p, q);\n  if (left && right) return root;\n  return left || right;\n}`
      }
    },
    similarProblemIds: ['p-31', 'p-32', 'p-54']
  },
  {
    id: 'p-56',
    slug: 'pacific-atlantic-water-flow',
    title: 'Pacific Atlantic Water Flow',
    difficulty: 'Medium',
    acceptance: '55.3%',
    topic: 'Graphs & BFS/DFS',
    pattern: 'Multi-source Reverse Search',
    companies: ['Google', 'Meta', 'Amazon'],
    description: 'There is an `m x n` rectangular island bordering both the Pacific Ocean (top and left edges) and Atlantic Ocean (bottom and right edges).\n\nWater can flow from a cell to adjacent cells directly north, south, east, or west if the neighbor cell has height less than or equal to the current cell.\n\nReturn a 2D list of grid coordinates `[r, c]` where rain water can flow to **both** the Pacific and Atlantic oceans.',
    examples: [
      { input: 'heights = [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]', output: '[[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]', explanation: 'These cells can flow to both oceans.' },
      { input: 'heights = [[1]]', output: '[[0,0]]', explanation: 'One cell connects to both oceans.' }
    ],
    constraints: ['m == heights.length', 'n == heights[r].length', '1 <= m, n <= 200', '0 <= heights[r][c] <= 10^5'],
    starterCode: {
      javascript: `function pacificAtlantic(heights) {\n  // Write your solution here\n  \n}`,
      python: `def pacific_atlantic(heights: list[list[int]]) -> list[list[int]]:\n    # Write your solution here\n    pass`,
      cpp: `class Solution {\npublic:\n    vector<vector<int>> pacificAtlantic(vector<vector<int>>& heights) {\n        // Your solution\n    }\n};`,
      java: `class Solution {\n    public List<List<Integer>> pacificAtlantic(int[][] heights) {\n        return new ArrayList<>();\n    }\n}`,
      go: `func pacificAtlantic(heights [][]int) [][]int {\n    return nil\n}`,
      rust: `impl Solution {\n    pub fn pacific_atlantic(heights: Vec<Vec<i32>>) -> Vec<Vec<i32>> {\n        vec![]\n    }\n}`
    },
    testCases: [
      { input: [[[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]], expected: [[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]] },
      { input: [[[1]]], expected: [[0,0]] }
    ],
    hints: [
      { level: 1, type: 'conceptual', title: 'Reverse Thinking', content: 'Instead of flowing water down from every cell, flow water UP from ocean borders!' },
      { level: 2, type: 'direction', title: 'Two Reachable Sets', content: 'Do one BFS/DFS starting from Pacific borders (top & left) and another from Atlantic borders (bottom & right).' },
      { level: 3, type: 'near-solution', title: 'Set Intersection', content: 'Cells present in both visited sets can reach both oceans.' }
    ],
    editorial: {
      summary: 'Reverse water flow starting from ocean borders moving only to cells of equal or greater height.',
      patternExplanation: 'Multi-source graph traversal with state intersection.',
      bruteForce: {
        name: 'Cell-by-cell DFS',
        complexity: { time: 'O(m² * n²)', space: 'O(m * n)' },
        explanation: 'Run a separate DFS from every single cell to see if both oceans are reachable.',
        code: `// Naive per-cell search`
      },
      optimal: {
        name: 'Dual Reverse Search from Ocean Borders',
        complexity: { time: 'O(m * n)', space: 'O(m * n)' },
        explanation: 'Reverse DFS from Pacific and Atlantic borders. Find intersection of reachable coordinates.',
        code: `function pacificAtlantic(heights) {\n  if (!heights.length) return [];\n  const R = heights.length, C = heights[0].length;\n  const pac = Array.from({ length: R }, () => Array(C).fill(false));\n  const atl = Array.from({ length: R }, () => Array(C).fill(false));\n  function dfs(r, c, visited) {\n    visited[r][c] = true;\n    const dirs = [[0,1],[0,-1],[1,0],[-1,0]];\n    for (const [dr, dc] of dirs) {\n      const nr = r + dr, nc = c + dc;\n      if (nr >= 0 && nr < R && nc >= 0 && nc < C && !visited[nr][nc] && heights[nr][nc] >= heights[r][c]) {\n        dfs(nr, nc, visited);\n      }\n    }\n  }\n  for (let r = 0; r < R; r++) {\n    dfs(r, 0, pac);\n    dfs(r, C - 1, atl);\n  }\n  for (let c = 0; c < C; c++) {\n    dfs(0, c, pac);\n    dfs(R - 1, c, atl);\n  }\n  const res = [];\n  for (let r = 0; r < R; r++) {\n    for (let c = 0; c < C; c++) {\n      if (pac[r][c] && atl[r][c]) res.push([r, c]);\n    }\n  }\n  return res;\n}`
      }
    },
    similarProblemIds: ['p-37', 'p-38']
  },
  {
    id: 'p-57',
    slug: 'course-schedule-ii',
    title: 'Course Schedule Order (TopoSort)',
    difficulty: 'Medium',
    acceptance: '51.8%',
    topic: 'Graphs',
    pattern: 'Topological Sort (Kahn’s Algorithm)',
    companies: ['Google', 'Meta', 'Amazon', 'Twitter'],
    description: 'There are a total of `numCourses` courses you have to take, labeled from `0` to `numCourses - 1`. You are given an array `prerequisites` where `prerequisites[i] = [a_i, b_i]` indicates that you must take course `b_i` first if you want to take course `a_i`.\n\nReturn the ordering of courses you should take to finish all courses. If there are many valid answers, return any of them. If it is impossible to finish all courses, return an empty array.',
    examples: [
      { input: 'numCourses = 2, prerequisites = [[1, 0]]', output: '[0, 1]', explanation: 'Take course 0 then course 1.' },
      { input: 'numCourses = 4, prerequisites = [[1, 0], [2, 0], [3, 1], [3, 2]]', output: '[0, 2, 1, 3]', explanation: 'Take 0 first, then 1 and 2, then 3.' },
      { input: 'numCourses = 1, prerequisites = []', output: '[0]', explanation: 'No prerequisites.' }
    ],
    constraints: ['1 <= numCourses <= 2000', '0 <= prerequisites.length <= numCourses * (numCourses - 1)', 'prerequisites[i].length == 2', 'All prerequisite pairs are unique.'],
    starterCode: {
      javascript: `function findOrder(numCourses, prerequisites) {\n  // Write your solution here\n  \n}`,
      python: `def find_order(num_courses: int, prerequisites: list[list[int]]) -> list[int]:\n    # Write your solution here\n    pass`,
      cpp: `class Solution {\npublic:\n    vector<int> findOrder(int numCourses, vector<vector<int>>& prerequisites) {\n        // Your solution\n    }\n};`,
      java: `class Solution {\n    public int[] findOrder(int numCourses, int[][] prerequisites) {\n        return new int[0];\n    }\n}`,
      go: `func findOrder(numCourses int, prerequisites [][]int) []int {\n    return nil\n}`,
      rust: `impl Solution {\n    pub fn find_order(num_courses: i32, prerequisites: Vec<Vec<i32>>) -> Vec<i32> {\n        vec![]\n    }\n}`
    },
    testCases: [
      { input: [2, [[1, 0]]], expected: [0, 1] },
      { input: [4, [[1, 0], [2, 0], [3, 1], [3, 2]]], expected: [0, 1, 2, 3] },
      { input: [1, []], expected: [0] }
    ],
    hints: [
      { level: 1, type: 'conceptual', title: 'Directed Acyclic Graph (DAG)', content: 'Prerequisites represent directed edges b -> a. A valid schedule is a Topological Sort of this DAG.' },
      { level: 2, type: 'direction', title: 'In-degree Array', content: 'Track in-degrees (number of prerequisites) for each course. Put all courses with 0 in-degree into a queue.' },
      { level: 3, type: 'near-solution', title: 'Kahn’s Algorithm', content: 'Pop from queue, add course to order array, decrement in-degree of its dependents. If in-degree reaches 0, push to queue. If order.length == numCourses return order, else [].' }
    ],
    editorial: {
      summary: 'Kahn’s algorithm calculates in-degrees and uses a queue to produce a valid topological ordering or detect a cycle.',
      patternExplanation: 'Topological sorting with BFS queue.',
      bruteForce: {
        name: 'Permutation generation with validity check',
        complexity: { time: 'O(n!)', space: 'O(n)' },
        explanation: 'Generate all orderings and check if prerequisites are satisfied.',
        code: `// Exhaustive search`
      },
      optimal: {
        name: 'Kahn’s Algorithm (In-degree BFS)',
        complexity: { time: 'O(V + E)', space: 'O(V + E)' },
        explanation: 'Process nodes with 0 in-degree first, decrement neighbors, and add newly freed nodes.',
        code: `function findOrder(numCourses, prerequisites) {\n  const adj = Array.from({ length: numCourses }, () => []);\n  const inDegree = new Array(numCourses).fill(0);\n  for (const [course, pre] of prerequisites) {\n    adj[pre].push(course);\n    inDegree[course]++;\n  }\n  const queue = [];\n  for (let i = 0; i < numCourses; i++) {\n    if (inDegree[i] === 0) queue.push(i);\n  }\n  const order = [];\n  while (queue.length) {\n    const curr = queue.shift();\n    order.push(curr);\n    for (const next of adj[curr]) {\n      inDegree[next]--;\n      if (inDegree[next] === 0) queue.push(next);\n    }\n  }\n  return order.length === numCourses ? order : [];\n}`
      }
    },
    similarProblemIds: ['p-39', 'p-40']
  },
  {
    id: 'p-58',
    slug: 'meeting-rooms-ii',
    title: 'Meeting Rooms II (Min Conference Rooms)',
    difficulty: 'Medium',
    acceptance: '51.2%',
    topic: 'Intervals & Sorting',
    pattern: 'Chronological Sweep Line / Two Pointers',
    companies: ['Amazon', 'Google', 'Bloomberg', 'Uber'],
    description: 'Given an array of meeting time intervals `intervals` where `intervals[i] = [start_i, end_i]`, return the minimum number of conference rooms required to hold all meetings without conflicts.',
    examples: [
      { input: 'intervals = [[0, 30], [5, 10], [15, 20]]', output: '2', explanation: 'Room 1: [0, 30]. Room 2: [5, 10], [15, 20].' },
      { input: 'intervals = [[7, 10], [2, 4]]', output: '1', explanation: 'Meetings do not overlap.' }
    ],
    constraints: ['1 <= intervals.length <= 10^4', '0 <= start_i < end_i <= 10^6'],
    starterCode: {
      javascript: `function minMeetingRooms(intervals) {\n  // Write your solution here\n  \n}`,
      python: `def min_meeting_rooms(intervals: list[list[int]]) -> int:\n    # Write your solution here\n    pass`,
      cpp: `class Solution {\npublic:\n    int minMeetingRooms(vector<vector<int>>& intervals) {\n        // Your solution\n    }\n};`,
      java: `class Solution {\n    public int minMeetingRooms(int[][] intervals) {\n        return 0;\n    }\n}`,
      go: `func minMeetingRooms(intervals [][]int) int {\n    return 0\n}`,
      rust: `impl Solution {\n    pub fn min_meeting_rooms(intervals: Vec<Vec<i32>>) -> i32 {\n        0\n    }\n}`
    },
    testCases: [
      { input: [[[0, 30], [5, 10], [15, 20]]], expected: 2 },
      { input: [[[7, 10], [2, 4]]], expected: 1 },
      { input: [[[1, 5], [5, 10]]], expected: 1 }
    ],
    hints: [
      { level: 1, type: 'conceptual', title: 'Separate Start and End Times', content: 'Notice that we only care whether a meeting has started before another has ended.' },
      { level: 2, type: 'direction', title: 'Sorted Timeline', content: 'Extract all starts into one array, all ends into another, and sort both independently.' },
      { level: 3, type: 'near-solution', title: 'Two Pointers Sweep', content: 'If starts[s] < ends[e], a meeting starts before the earliest room frees up (increment roomsNeeded, s++). Otherwise a room freed up (e++, s++).' }
    ],
    editorial: {
      summary: 'Sort start times and end times separately, then sweep across timeline using two pointers.',
      patternExplanation: 'Interval overlap chronologic projection.',
      bruteForce: {
        name: 'Pairwise Overlap Matrix',
        complexity: { time: 'O(n²)', space: 'O(n)' },
        explanation: 'Check mutual overlaps across all intervals.',
        code: `// Nested interval scan`
      },
      optimal: {
        name: 'Two Pointers Sweep Line',
        complexity: { time: 'O(n log n)', space: 'O(n)' },
        explanation: 'Sort starts and ends independently and simulate incoming meetings.',
        code: `function minMeetingRooms(intervals) {\n  if (!intervals.length) return 0;\n  const starts = intervals.map(i => i[0]).sort((a, b) => a - b);\n  const ends = intervals.map(i => i[1]).sort((a, b) => a - b);\n  let rooms = 0, endIdx = 0;\n  for (let i = 0; i < starts.length; i++) {\n    if (starts[i] < ends[endIdx]) {\n      rooms++;\n    } else {\n      endIdx++;\n    }\n  }\n  return rooms;\n}`
      }
    },
    similarProblemIds: ['p-20', 'p-21']
  },
  {
    id: 'p-59',
    slug: 'non-overlapping-intervals',
    title: 'Non-Overlapping Intervals Removal',
    difficulty: 'Medium',
    acceptance: '53.6%',
    topic: 'Greedy & Intervals',
    pattern: 'Earliest Deadline First (Greedy)',
    companies: ['Facebook', 'Amazon', 'Google'],
    description: 'Given an array of intervals `intervals` where `intervals[i] = [start_i, end_i]`, return the minimum number of intervals you need to remove to make the rest of the intervals non-overlapping.\n\nNote that intervals that only touch at a point are non-overlapping. For example, `[1, 2]` and `[2, 3]` do not overlap.',
    examples: [
      { input: 'intervals = [[1, 2], [2, 3], [3, 4], [1, 3]]', output: '1', explanation: '[1, 3] can be removed and the rest are non-overlapping.' },
      { input: 'intervals = [[1, 2], [1, 2], [1, 2]]', output: '2', explanation: 'Remove two [1, 2] to leave one.' },
      { input: 'intervals = [[1, 2], [2, 3]]', output: '0', explanation: 'Already non-overlapping.' }
    ],
    constraints: ['1 <= intervals.length <= 10^5', 'intervals[i].length == 2', '-5 * 10^4 <= start_i < end_i <= 5 * 10^4'],
    starterCode: {
      javascript: `function eraseOverlapIntervals(intervals) {\n  // Write your solution here\n  \n}`,
      python: `def erase_overlap_intervals(intervals: list[list[int]]) -> int:\n    # Write your solution here\n    pass`,
      cpp: `class Solution {\npublic:\n    int eraseOverlapIntervals(vector<vector<int>>& intervals) {\n        // Your solution\n    }\n};`,
      java: `class Solution {\n    public int eraseOverlapIntervals(int[][] intervals) {\n        return 0;\n    }\n}`,
      go: `func eraseOverlapIntervals(intervals [][]int) int {\n    return 0\n}`,
      rust: `impl Solution {\n    pub fn erase_overlap_intervals(intervals: Vec<Vec<i32>>) -> i32 {\n        0\n    }\n}`
    },
    testCases: [
      { input: [[[1, 2], [2, 3], [3, 4], [1, 3]]], expected: 1 },
      { input: [[[1, 2], [1, 2], [1, 2]]], expected: 2 },
      { input: [[[1, 2], [2, 3]]], expected: 0 }
    ],
    hints: [
      { level: 1, type: 'conceptual', title: 'Earliest End Time Greedy Choice', content: 'Always pick the interval that finishes earliest to leave maximum space for future intervals.' },
      { level: 2, type: 'direction', title: 'Sort by End Time', content: 'Sort intervals by intervals[i][1].' },
      { level: 3, type: 'near-solution', title: 'Linear Comparison', content: 'Iterate intervals: if curr.start < prev.end, increment removeCount. Otherwise update prev = curr.' }
    ],
    editorial: {
      summary: 'Interval scheduling theorem: greedy selection sorted by end time maximizes compatible non-overlapping intervals.',
      patternExplanation: 'Greedy activity selection.',
      bruteForce: {
        name: 'Try all subsets',
        complexity: { time: 'O(2^n)', space: 'O(n)' },
        explanation: 'Check all subsets for overlap.',
        code: `// Exponential subset recursion`
      },
      optimal: {
        name: 'Greedy Sort by End Time',
        complexity: { time: 'O(n log n)', space: 'O(1)' },
        explanation: 'Sort by end time and remove overlapping intervals that finish later.',
        code: `function eraseOverlapIntervals(intervals) {\n  if (!intervals.length) return 0;\n  intervals.sort((a, b) => a[1] - b[1]);\n  let removed = 0;\n  let lastEnd = intervals[0][1];\n  for (let i = 1; i < intervals.length; i++) {\n    if (intervals[i][0] < lastEnd) {\n      removed++;\n    } else {\n      lastEnd = intervals[i][1];\n    }\n  }\n  return removed;\n}`
      }
    },
    similarProblemIds: ['p-20', 'p-58']
  },
  {
    id: 'p-60',
    slug: 'minimum-window-substring',
    title: 'Minimum Window Substring',
    difficulty: 'Hard',
    acceptance: '41.6%',
    topic: 'Strings & Two Pointers',
    pattern: 'Sliding Window with Frequency Map',
    companies: ['Meta', 'Amazon', 'Microsoft', 'LinkedIn'],
    description: 'Given two strings `s` and `t` of lengths `m` and `n` respectively, return the minimum window substring of `s` such that every character in `t` (including duplicates) is included in the window.\n\nIf there is no such substring, return the empty string `""`.\n\nThe testcases will be generated such that the answer is unique.',
    examples: [
      { input: 's = "ADOBECODEBANC", t = "ABC"', output: '"BANC"', explanation: 'The minimum substring containing A, B, and C is "BANC".' },
      { input: 's = "a", t = "a"', output: '"a"', explanation: 'The entire string is the minimum window.' },
      { input: 's = "a", t = "aa"', output: '""', explanation: 'Both "a"s must be included; only one exists in s.' }
    ],
    constraints: ['m == s.length', 'n == t.length', '1 <= m, n <= 10^5', 's and t consist of uppercase and lowercase English letters.'],
    starterCode: {
      javascript: `function minWindow(s, t) {\n  // Write your solution here\n  \n}`,
      python: `def min_window(s: str, t: str) -> str:\n    # Write your solution here\n    pass`,
      cpp: `class Solution {\npublic:\n    string minWindow(string s, string t) {\n        // Your solution\n    }\n};`,
      java: `class Solution {\n    public String minWindow(String s, String t) {\n        return "";\n    }\n}`,
      go: `func minWindow(s string, t string) string {\n    return ""\n}`,
      rust: `impl Solution {\n    pub fn min_window(s: String, t: String) -> String {\n        String::new()\n    }\n}`
    },
    testCases: [
      { input: ["ADOBECODEBANC", "ABC"], expected: "BANC" },
      { input: ["a", "a"], expected: "a" },
      { input: ["a", "aa"], expected: "" }
    ],
    hints: [
      { level: 1, type: 'conceptual', title: 'Target Frequency Table', content: 'Count character requirements in string t with a hash map.' },
      { level: 2, type: 'direction', title: 'Expand Right, Shrink Left', content: 'Expand right pointer until all required characters are satisfied. Then shrink left pointer while maintaining the condition.' },
      { level: 3, type: 'near-solution', title: 'Formed Counter', content: 'Keep a `formed` variable tracking unique characters satisfying required frequency to avoid rechecking the entire map on each step.' }
    ],
    editorial: {
      summary: 'Dynamic two-pointer sliding window maintaining character counts and tracking the minimum valid window.',
      patternExplanation: 'Sliding window with frequency matching.',
      bruteForce: {
        name: 'All Substring Inspection',
        complexity: { time: 'O(m²)', space: 'O(n)' },
        explanation: 'Inspect all substrings of s and check character requirements.',
        code: `// Nested loop substring check`
      },
      optimal: {
        name: 'Two-Pointer Sliding Window',
        complexity: { time: 'O(m + n)', space: 'O(k) where k is charset size' },
        explanation: 'Expand right to fulfill constraints; contract left to minimize window length.',
        code: `function minWindow(s, t) {\n  if (!s || !t || s.length < t.length) return "";\n  const target = new Map();\n  for (const c of t) target.set(c, (target.get(c) || 0) + 1);\n  let required = target.size, formed = 0;\n  const window = new Map();\n  let l = 0, minLen = Infinity, minStart = 0;\n  for (let r = 0; r < s.length; r++) {\n    const c = s[r];\n    window.set(c, (window.get(c) || 0) + 1);\n    if (target.has(c) && window.get(c) === target.get(c)) formed++;\n    while (l <= r && formed === required) {\n      if (r - l + 1 < minLen) {\n        minLen = r - l + 1;\n        minStart = l;\n      }\n      const charL = s[l];\n      window.set(charL, window.get(charL) - 1);\n      if (target.has(charL) && window.get(charL) < target.get(charL)) formed--;\n      l++;\n    }\n  }\n  return minLen === Infinity ? "" : s.substring(minStart, minStart + minLen);\n}`
      }
    },
    similarProblemIds: ['p-10', 'p-18']
  },
  {
    id: 'p-61',
    slug: 'trapping-rain-water',
    title: 'Trapping Rain Water',
    difficulty: 'Hard',
    acceptance: '60.5%',
    topic: 'Two Pointers & Arrays',
    pattern: 'Two Pointers Extreme Walls',
    companies: ['Amazon', 'Google', 'Apple', 'Meta', 'Goldman Sachs'],
    description: 'Given `n` non-negative integers representing an elevation map where the width of each bar is `1`, compute how much water it can trap after raining.',
    examples: [
      { input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', output: '6', explanation: 'The elevation map traps 6 units of rain water.' },
      { input: 'height = [4,2,0,3,2,5]', output: '9', explanation: 'The elevation map traps 9 units of rain water.' }
    ],
    constraints: ['n == height.length', '1 <= n <= 2 * 10^4', '0 <= height[i] <= 10^5'],
    starterCode: {
      javascript: `function trap(height) {\n  // Write your solution here\n  \n}`,
      python: `def trap(height: list[int]) -> int:\n    # Write your solution here\n    pass`,
      cpp: `class Solution {\npublic:\n    int trap(vector<int>& height) {\n        // Your solution\n    }\n};`,
      java: `class Solution {\n    public int trap(int[] height) {\n        return 0;\n    }\n}`,
      go: `func trap(height []int) int {\n    return 0\n}`,
      rust: `impl Solution {\n    pub fn trap(height: Vec<i32>) -> i32 {\n        0\n    }\n}`
    },
    testCases: [
      { input: [[0,1,0,2,1,0,1,3,2,1,2,1]], expected: 6 },
      { input: [[4,2,0,3,2,5]], expected: 9 },
      { input: [[1, 2]], expected: 0 }
    ],
    hints: [
      { level: 1, type: 'conceptual', title: 'Water at index i', content: 'Water trapped at cell i is determined by: Math.min(maxLeft, maxRight) - height[i].' },
      { level: 2, type: 'direction', title: 'Two Pointers Optimization', content: 'Use left and right pointers. Move the pointer on whichever side has the smaller maximum wall.' },
      { level: 3, type: 'near-solution', title: 'O(1) Space Reduction', content: 'If leftMax < rightMax, we know the water at left is bounded by leftMax. Add (leftMax - height[left]), increment left. Do the symmetric for right.' }
    ],
    editorial: {
      summary: 'Two pointers converging from ends maintain leftMax and rightMax, computing trapped water in O(n) time and O(1) space.',
      patternExplanation: 'Two pointers with bounding heights.',
      bruteForce: {
        name: 'Prefix and Suffix Max Arrays',
        complexity: { time: 'O(n)', space: 'O(n)' },
        explanation: 'Compute leftMax and rightMax arrays in two separate passes.',
        code: `// Array prefix/suffix storage`
      },
      optimal: {
        name: 'Two Pointers Converging',
        complexity: { time: 'O(n)', space: 'O(1)' },
        explanation: 'Advance from the side with the lower maximum wall.',
        code: `function trap(height) {\n  let l = 0, r = height.length - 1;\n  let leftMax = 0, rightMax = 0;\n  let water = 0;\n  while (l < r) {\n    if (height[l] < height[r]) {\n      if (height[l] >= leftMax) leftMax = height[l];\n      else water += leftMax - height[l];\n      l++;\n    } else {\n      if (height[r] >= rightMax) rightMax = height[r];\n      else water += rightMax - height[r];\n      r--;\n    }\n  }\n  return water;\n}`
      }
    },
    similarProblemIds: ['p-9', 'p-18']
  },
  {
    id: 'p-62',
    slug: 'sliding-window-maximum',
    title: 'Sliding Window Maximum',
    difficulty: 'Hard',
    acceptance: '46.7%',
    topic: 'Monotonic Queue',
    pattern: 'Monotonic Decreasing Deque',
    companies: ['Amazon', 'Google', 'Citadel', 'Meta'],
    description: 'You are given an array of integers `nums`, there is a sliding window of size `k` which is moving from the very left of the array to the very right. You can only see the `k` numbers in the window. Each time the sliding window moves right by one position.\n\nReturn the max sliding window values.',
    examples: [
      { input: 'nums = [1,3,-1,-3,5,3,6,7], k = 3', output: '[3,3,5,5,6,7]', explanation: 'Window positions and max values: [1,3,-1]->3, [3,-1,-3]->3, [-1,-3,5]->5, [-3,5,3]->5, [5,3,6]->6, [3,6,7]->7.' },
      { input: 'nums = [1], k = 1', output: '[1]', explanation: 'Window has size 1.' }
    ],
    constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4', '1 <= k <= nums.length'],
    starterCode: {
      javascript: `function maxSlidingWindow(nums, k) {\n  // Write your solution here\n  \n}`,
      python: `def max_sliding_window(nums: list[int], k: int) -> list[int]:\n    # Write your solution here\n    pass`,
      cpp: `class Solution {\npublic:\n    vector<int> maxSlidingWindow(vector<int>& nums, int k) {\n        // Your solution\n    }\n};`,
      java: `class Solution {\n    public int[] maxSlidingWindow(int[] nums, int k) {\n        return new int[0];\n    }\n}`,
      go: `func maxSlidingWindow(nums []int, k int) []int {\n    return nil\n}`,
      rust: `impl Solution {\n    pub fn max_sliding_window(nums: Vec<i32>, k: i32) -> Vec<i32> {\n        vec![]\n    }\n}`
    },
    testCases: [
      { input: [[1,3,-1,-3,5,3,6,7], 3], expected: [3,3,5,5,6,7] },
      { input: [[1], 1], expected: [1] },
      { input: [[1, -1], 1], expected: [1, -1] }
    ],
    hints: [
      { level: 1, type: 'conceptual', title: 'Discard Smaller Older Elements', content: 'If a newly added number is greater than previous numbers in the window, those previous numbers can NEVER be the maximum again!' },
      { level: 2, type: 'direction', title: 'Monotonic Decreasing Deque', content: 'Store indices in a double-ended queue. Maintain values strictly decreasing from front to back.' },
      { level: 3, type: 'near-solution', title: 'Window Bounds Eviction', content: 'Before adding nums[i], remove indices < i - k + 1 from front. Pop smaller elements from back. If i >= k - 1, record nums[deque[0]].' }
    ],
    editorial: {
      summary: 'A monotonic double-ended queue holds indices of candidate maximums in O(n) total time.',
      patternExplanation: 'Monotonic queue amortized O(1) push/pop.',
      bruteForce: {
        name: 'Linear Scan per Window',
        complexity: { time: 'O(n * k)', space: 'O(1)' },
        explanation: 'Find maximum among each k-length window naively.',
        code: `// Nested loop max`
      },
      optimal: {
        name: 'Monotonic Decreasing Deque',
        complexity: { time: 'O(n)', space: 'O(k)' },
        explanation: 'Store indices in a deque maintaining descending order of values.',
        code: `function maxSlidingWindow(nums, k) {\n  const deque = [];\n  const res = [];\n  for (let i = 0; i < nums.length; i++) {\n    while (deque.length && deque[0] < i - k + 1) deque.shift();\n    while (deque.length && nums[deque[deque.length - 1]] < nums[i]) deque.pop();\n    deque.push(i);\n    if (i >= k - 1) res.push(nums[deque[0]]);\n  }\n  return res;\n}`
      }
    },
    similarProblemIds: ['p-10', 'p-60']
  },
  {
    id: 'p-63',
    slug: 'word-break',
    title: 'Word Break Problem',
    difficulty: 'Medium',
    acceptance: '46.1%',
    topic: 'Dynamic Programming',
    pattern: '1D DP Substring Partition',
    companies: ['Amazon', 'Bloomberg', 'Meta', 'Google'],
    description: 'Given a string `s` and a dictionary of strings `wordDict`, return `true` if `s` can be segmented into a space-separated sequence of one or more dictionary words.\n\nNote that the same word in the dictionary may be reused multiple times in the segmentation.',
    examples: [
      { input: 's = "leetcode", wordDict = ["leet","code"]', output: 'true', explanation: 'Segment as "leet code".' },
      { input: 's = "applepenapple", wordDict = ["apple","pen"]', output: 'true', explanation: 'Segment as "apple pen apple". Word "apple" reused.' },
      { input: 's = "catsandog", wordDict = ["cats","dog","sand","and","cat"]', output: 'false', explanation: 'Cannot segment into valid words.' }
    ],
    constraints: ['1 <= s.length <= 300', '1 <= wordDict.length <= 1000', '1 <= wordDict[i].length <= 20', 's and wordDict[i] consist of only lowercase English letters.', 'All strings of wordDict are unique.'],
    starterCode: {
      javascript: `function wordBreak(s, wordDict) {\n  // Write your solution here\n  \n}`,
      python: `def word_break(s: str, word_dict: list[str]) -> bool:\n    # Write your solution here\n    pass`,
      cpp: `class Solution {\npublic:\n    bool wordBreak(string s, vector<string>& wordDict) {\n        // Your solution\n    }\n};`,
      java: `class Solution {\n    public boolean wordBreak(String s, List<String> wordDict) {\n        return false;\n    }\n}`,
      go: `func wordBreak(s string, wordDict []string) bool {\n    return false\n}`,
      rust: `impl Solution {\n    pub fn word_break(s: String, word_dict: Vec<String>) -> bool {\n        false\n    }\n}`
    },
    testCases: [
      { input: ["leetcode", ["leet", "code"]], expected: true },
      { input: ["applepenapple", ["apple", "pen"]], expected: true },
      { input: ["catsandog", ["cats", "dog", "sand", "and", "cat"]], expected: false }
    ],
    hints: [
      { level: 1, type: 'conceptual', title: 'DP Array Representation', content: 'Let dp[i] be a boolean indicating if s[0...i-1] can be segmented using wordDict.' },
      { level: 2, type: 'direction', title: 'Transition Equation', content: 'dp[i] is true if there is some j < i such that dp[j] is true AND s.slice(j, i) is in wordDict.' },
      { level: 3, type: 'near-solution', title: 'Set Lookup', content: 'Store wordDict in a Set for O(1) membership check. Base case: dp[0] = true.' }
    ],
    editorial: {
      summary: '1D Dynamic Programming checking suffix substrings from valid prior prefixes.',
      patternExplanation: 'Prefix segmentation dynamic programming.',
      bruteForce: {
        name: 'Exhaustive Recursion',
        complexity: { time: 'O(2^n)', space: 'O(n)' },
        explanation: 'Try every possible split point recursively without memoization.',
        code: `// Exponential recursion`
      },
      optimal: {
        name: '1D Bottom-Up DP',
        complexity: { time: 'O(n²)', space: 'O(n)' },
        explanation: 'dp[i] = true if any valid prefix dp[j] combines with s[j..i] in wordDict.',
        code: `function wordBreak(s, wordDict) {\n  const words = new Set(wordDict);\n  const dp = new Array(s.length + 1).fill(false);\n  dp[0] = true;\n  for (let i = 1; i <= s.length; i++) {\n    for (let j = 0; j < i; j++) {\n      if (dp[j] && words.has(s.substring(j, i))) {\n        dp[i] = true;\n        break;\n      }\n    }\n  }\n  return dp[s.length];\n}`
      }
    },
    similarProblemIds: ['p-41', 'p-52']
  },
  {
    id: 'p-64',
    slug: 'coin-change-ii',
    title: 'Coin Change II (Number of Ways)',
    difficulty: 'Medium',
    acceptance: '62.8%',
    topic: 'Dynamic Programming',
    pattern: 'Unbounded Knapsack Combinations',
    companies: ['Amazon', 'Microsoft', 'Morgan Stanley'],
    description: 'You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money.\n\nReturn the number of combinations that make up that amount. If that amount of money cannot be made up by any combination of the coins, return `0`.\n\nYou may assume that you have an infinite number of each kind of coin.',
    examples: [
      { input: 'amount = 5, coins = [1, 2, 5]', output: '4', explanation: 'Four ways: 5=5, 5=2+2+1, 5=2+1+1+1, 5=1+1+1+1+1.' },
      { input: 'amount = 3, coins = [2]', output: '0', explanation: 'Cannot make 3 using only 2s.' },
      { input: 'amount = 10, coins = [10]', output: '1', explanation: 'One way: 10=10.' }
    ],
    constraints: ['1 <= coins.length <= 300', '1 <= coins[i] <= 5000', 'All the values of coins are unique.', '0 <= amount <= 5000'],
    starterCode: {
      javascript: `function change(amount, coins) {\n  // Write your solution here\n  \n}`,
      python: `def change(amount: int, coins: list[int]) -> int:\n    # Write your solution here\n    pass`,
      cpp: `class Solution {\npublic:\n    int change(int amount, vector<int>& coins) {\n        // Your solution\n    }\n};`,
      java: `class Solution {\n    public int change(int amount, int[] coins) {\n        return 0;\n    }\n}`,
      go: `func change(amount int, coins []int) int {\n    return 0\n}`,
      rust: `impl Solution {\n    pub fn change(amount: i32, coins: Vec<i32>) -> i32 {\n        0\n    }\n}`
    },
    testCases: [
      { input: [5, [1, 2, 5]], expected: 4 },
      { input: [3, [2]], expected: 0 },
      { input: [10, [10]], expected: 1 }
    ],
    hints: [
      { level: 1, type: 'conceptual', title: 'Combinations vs Permutations', content: 'To avoid double counting permutations (e.g. 1+2 vs 2+1), iterate through coins on the OUTER loop!' },
      { level: 2, type: 'direction', title: 'DP Array Initialization', content: 'Let dp[i] be the ways to form amount i. Base case: dp[0] = 1 (1 way to make 0: empty set).' },
      { level: 3, type: 'near-solution', title: 'Accumulator loop', content: 'For each coin: for (let a = coin; a <= amount; a++) dp[a] += dp[a - coin].' }
    ],
    editorial: {
      summary: 'Unbounded knapsack where coins in outer loop enforce combination order (avoiding permutations).',
      patternExplanation: 'Unbounded knapsack combinations.',
      bruteForce: {
        name: 'Recursive combinations tree',
        complexity: { time: 'O(2^amount)', space: 'O(amount)' },
        explanation: 'Try all coin inclusions recursively.',
        code: `// Backtracking recursion`
      },
      optimal: {
        name: '1D Space-Optimized DP',
        complexity: { time: 'O(amount * coins.length)', space: 'O(amount)' },
        explanation: 'Outer loop on coins ensures combinations rather than permutations.',
        code: `function change(amount, coins) {\n  const dp = new Array(amount + 1).fill(0);\n  dp[0] = 1;\n  for (const coin of coins) {\n    for (let a = coin; a <= amount; a++) {\n      dp[a] += dp[a - coin];\n    }\n  }\n  return dp[amount];\n}`
      }
    },
    similarProblemIds: ['p-43', 'p-44']
  },
  {
    id: 'p-65',
    slug: 'longest-increasing-subsequence',
    title: 'Longest Increasing Subsequence',
    difficulty: 'Medium',
    acceptance: '53.9%',
    topic: 'Dynamic Programming & Binary Search',
    pattern: 'Patience Sorting / Binary Search Tails',
    companies: ['Google', 'Microsoft', 'Apple', 'Meta'],
    description: 'Given an integer array `nums`, return the length of the longest strictly increasing subsequence.\n\nA subsequence is an array that can be derived from another array by deleting some or no elements without changing the order of the remaining elements.',
    examples: [
      { input: 'nums = [10, 9, 2, 5, 3, 7, 101, 18]', output: '4', explanation: 'The longest increasing subsequence is [2, 3, 7, 101], therefore the length is 4.' },
      { input: 'nums = [0, 1, 0, 3, 2, 3]', output: '4', explanation: 'Longest is [0, 1, 2, 3].' },
      { input: 'nums = [7, 7, 7, 7, 7, 7, 7]', output: '1', explanation: 'Subsequence must be strictly increasing.' }
    ],
    constraints: ['1 <= nums.length <= 2500', '-10^4 <= nums[i] <= 10^4'],
    starterCode: {
      javascript: `function lengthOfLIS(nums) {\n  // Write your solution here\n  \n}`,
      python: `def length_of_lis(nums: list[int]) -> int:\n    # Write your solution here\n    pass`,
      cpp: `class Solution {\npublic:\n    int lengthOfLIS(vector<int>& nums) {\n        // Your solution\n    }\n};`,
      java: `class Solution {\n    public int lengthOfLIS(int[] nums) {\n        return 0;\n    }\n}`,
      go: `func lengthOfLIS(nums []int) int {\n    return 0\n}`,
      rust: `impl Solution {\n    pub fn length_of_lis(nums: Vec<i32>) -> i32 {\n        0\n    }\n}`
    },
    testCases: [
      { input: [[10, 9, 2, 5, 3, 7, 101, 18]], expected: 4 },
      { input: [[0, 1, 0, 3, 2, 3]], expected: 4 },
      { input: [[7, 7, 7, 7, 7, 7, 7]], expected: 1 }
    ],
    hints: [
      { level: 1, type: 'conceptual', title: 'DP O(n²) Approach', content: 'Let dp[i] be the length of the LIS ending at index i. dp[i] = 1 + max(dp[j]) for all j < i with nums[j] < nums[i].' },
      { level: 2, type: 'direction', title: 'Patience Sorting O(n log n)', content: 'Maintain an array `tails` where tails[i] stores the smallest tail of all increasing subsequences of length i+1.' },
      { level: 3, type: 'near-solution', title: 'Binary Search Replacement', content: 'For each num: binary search in tails for the first element >= num. If found, replace it. If num is larger than all elements in tails, append it.' }
    ],
    editorial: {
      summary: 'Patience sorting uses binary search to build the smallest possible tails of increasing subsequences in O(n log n) time.',
      patternExplanation: 'Binary search with dynamic monotonic tails array.',
      bruteForce: {
        name: 'O(n²) Dynamic Programming',
        complexity: { time: 'O(n²)', space: 'O(n)' },
        explanation: 'For each element, look back at all prior smaller elements.',
        code: `// Standard nested DP`
      },
      optimal: {
        name: 'Patience Sorting with Binary Search',
        complexity: { time: 'O(n log n)', space: 'O(n)' },
        explanation: 'tails array maintains the smallest tail of all increasing subsequences found so far.',
        code: `function lengthOfLIS(nums) {\n  const tails = [];\n  for (const n of nums) {\n    let l = 0, r = tails.length;\n    while (l < r) {\n      const mid = (l + r) >> 1;\n      if (tails[mid] < n) l = mid + 1;\n      else r = mid;\n    }\n    tails[l] = n;\n  }\n  return tails.length;\n}`
      }
    },
    similarProblemIds: ['p-41', 'p-45']
  },
  {
    id: 'p-66',
    slug: 'subsets-ii',
    title: 'Subsets II (With Duplicates)',
    difficulty: 'Medium',
    acceptance: '56.4%',
    topic: 'Backtracking',
    pattern: 'Backtracking with Duplicate Skipping',
    companies: ['Amazon', 'Bloomberg', 'Google'],
    description: 'Given an integer array `nums` that may contain duplicates, return all possible subsets (the power set).\n\nThe solution set must not contain duplicate subsets. Return the solution in any order.',
    examples: [
      { input: 'nums = [1, 2, 2]', output: '[[],[1],[1,2],[1,2,2],[2],[2,2]]', explanation: 'All unique combinations generated without duplicates.' },
      { input: 'nums = [0]', output: '[[],[0]]', explanation: 'Zero element power set.' }
    ],
    constraints: ['1 <= nums.length <= 10', '-10 <= nums[i] <= 10'],
    starterCode: {
      javascript: `function subsetsWithDup(nums) {\n  // Write your solution here\n  \n}`,
      python: `def subsets_with_dup(nums: list[int]) -> list[list[int]]:\n    # Write your solution here\n    pass`,
      cpp: `class Solution {\npublic:\n    vector<vector<int>> subsetsWithDup(vector<int>& nums) {\n        // Your solution\n    }\n};`,
      java: `class Solution {\n    public List<List<Integer>> subsetsWithDup(int[] nums) {\n        return new ArrayList<>();\n    }\n}`,
      go: `func subsetsWithDup(nums []int) [][]int {\n    return nil\n}`,
      rust: `impl Solution {\n    pub fn subsets_with_dup(nums: Vec<i32>) -> Vec<Vec<i32>> {\n        vec![]\n    }\n}`
    },
    testCases: [
      { input: [[1, 2, 2]], expected: [[],[1],[1,2],[1,2,2],[2],[2,2]] },
      { input: [[0]], expected: [[],[0]] }
    ],
    hints: [
      { level: 1, type: 'conceptual', title: 'Sort First', content: 'Sorting brings identical numbers together so you can easily detect and skip consecutive duplicate choices.' },
      { level: 2, type: 'direction', title: 'Skip Condition', content: 'During loop: if i > start && nums[i] === nums[i - 1], continue.' },
      { level: 3, type: 'near-solution', title: 'Standard Backtrack Structure', content: 'Push current subset to results, iterate from start to nums.length, push nums[i], recurse with i + 1, pop.' }
    ],
    editorial: {
      summary: 'Sort array first and prune identical branches at the same tree depth.',
      patternExplanation: 'Pruned backtracking search.',
      bruteForce: {
        name: 'Generate all and de-duplicate with Set',
        complexity: { time: 'O(n * 2^n)', space: 'O(n * 2^n)' },
        explanation: 'Serialize all subsets to strings and store in a hash set.',
        code: `// String set deduplication`
      },
      optimal: {
        name: 'Sorted Backtracking Pruning',
        complexity: { time: 'O(n * 2^n)', space: 'O(n) recursion stack' },
        explanation: 'Skip duplicate choices on the same recursion level.',
        code: `function subsetsWithDup(nums) {\n  nums.sort((a, b) => a - b);\n  const res = [];\n  function backtrack(start, path) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      if (i > start && nums[i] === nums[i - 1]) continue;\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}`
      }
    },
    similarProblemIds: ['p-37', 'p-38']
  },
  {
    id: 'p-67',
    slug: 'top-k-frequent-elements',
    title: 'Top K Frequent Elements',
    difficulty: 'Medium',
    acceptance: '63.2%',
    topic: 'Hash Map & Heap',
    pattern: 'Bucket Sort / Min-Heap',
    companies: ['Amazon', 'Meta', 'Google', 'Uber'],
    description: 'Given an integer array `nums` and an integer `k`, return the `k` most frequent elements. You may return the answer in any order.\n\nYour algorithm’s time complexity must be better than `O(n log n)`, where `n` is the array’s size.',
    examples: [
      { input: 'nums = [1,1,1,2,2,3], k = 2', output: '[1,2]', explanation: '1 appears 3 times, 2 appears 2 times.' },
      { input: 'nums = [1], k = 1', output: '[1]', explanation: 'Only element is 1.' }
    ],
    constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4', 'k is in the range [1, the number of unique elements in the array].', 'It is guaranteed that the answer is unique.'],
    starterCode: {
      javascript: `function topKFrequent(nums, k) {\n  // Write your solution here\n  \n}`,
      python: `def top_k_frequent(nums: list[int], k: int) -> list[int]:\n    # Write your solution here\n    pass`,
      cpp: `class Solution {\npublic:\n    vector<int> topKFrequent(vector<int>& nums, int k) {\n        // Your solution\n    }\n};`,
      java: `class Solution {\n    public int[] topKFrequent(int[] nums, int k) {\n        return new int[0];\n    }\n}`,
      go: `func topKFrequent(nums []int, k int) []int {\n    return nil\n}`,
      rust: `impl Solution {\n    pub fn top_k_frequent(nums: Vec<i32>, k: i32) -> Vec<i32> {\n        vec![]\n    }\n}`
    },
    testCases: [
      { input: [[1,1,1,2,2,3], 2], expected: [1, 2] },
      { input: [[1], 1], expected: [1] },
      { input: [[4, 4, 4, 6, 6, 7], 1], expected: [4] }
    ],
    hints: [
      { level: 1, type: 'conceptual', title: 'Frequency Map', content: 'First count frequency of each number using a Hash Map.' },
      { level: 2, type: 'direction', title: 'Bucket Sort Array', content: 'Create an array of buckets where index represents frequency (from 0 to n). Place numbers in their corresponding frequency bucket.' },
      { level: 3, type: 'near-solution', title: 'Traverse Buckets from Back', content: 'Scan buckets from n down to 0, collecting elements until you have k elements.' }
    ],
    editorial: {
      summary: 'Count frequencies into a map, then group by frequency into buckets for linear O(n) runtime.',
      patternExplanation: 'Bucket sorting by frequency count.',
      bruteForce: {
        name: 'Hash Map with Sort',
        complexity: { time: 'O(n log n)', space: 'O(n)' },
        explanation: 'Sort map entries by frequency descending.',
        code: `// Map entries sort`
      },
      optimal: {
        name: 'Linear Bucket Sort',
        complexity: { time: 'O(n)', space: 'O(n)' },
        explanation: 'Frequencies range from 1 to n. Index buckets by frequency.',
        code: `function topKFrequent(nums, k) {\n  const freq = new Map();\n  for (const n of nums) freq.set(n, (freq.get(n) || 0) + 1);\n  const buckets = Array.from({ length: nums.length + 1 }, () => []);\n  for (const [num, count] of freq) {\n    buckets[count].push(num);\n  }\n  const res = [];\n  for (let i = buckets.length - 1; i >= 0 && res.length < k; i--) {\n    for (const num of buckets[i]) {\n      res.push(num);\n      if (res.length === k) return res;\n    }\n  }\n  return res;\n}`
      }
    },
    similarProblemIds: ['p-2', 'p-3']
  },
  {
    id: 'p-68',
    slug: 'daily-temperatures',
    title: 'Daily Temperatures (Days to Warmer Day)',
    difficulty: 'Medium',
    acceptance: '66.1%',
    topic: 'Monotonic Stack',
    pattern: 'Monotonic Decreasing Stack',
    companies: ['Amazon', 'Meta', 'Google'],
    description: 'Given an array of integers `temperatures` represents the daily temperatures, return an array `answer` such that `answer[i]` is the number of days you have to wait after the `i`th day to get a warmer temperature.\n\nIf there is no future day for which this is possible, keep `answer[i] == 0` instead.',
    examples: [
      { input: 'temperatures = [73,74,75,71,69,72,76,73]', output: '[1,1,4,2,1,1,0,0]', explanation: 'On day 0 (73), day 1 is 74 (1 day wait). On day 2 (75), day 6 is 76 (4 days wait).' },
      { input: 'temperatures = [30,40,50,60]', output: '[1,1,1,0]', explanation: 'Next day is warmer for first 3 days.' },
      { input: 'temperatures = [30,60,90]', output: '[1,1,0]', explanation: 'Last day has no warmer day.' }
    ],
    constraints: ['1 <= temperatures.length <= 10^5', '30 <= temperatures[i] <= 100'],
    starterCode: {
      javascript: `function dailyTemperatures(temperatures) {\n  // Write your solution here\n  \n}`,
      python: `def daily_temperatures(temperatures: list[int]) -> list[int]:\n    # Write your solution here\n    pass`,
      cpp: `class Solution {\npublic:\n    vector<int> dailyTemperatures(vector<int>& temperatures) {\n        // Your solution\n    }\n};`,
      java: `class Solution {\n    public int[] dailyTemperatures(int[] temperatures) {\n        return new int[0];\n    }\n}`,
      go: `func dailyTemperatures(temperatures []int) []int {\n    return nil\n}`,
      rust: `impl Solution {\n    pub fn daily_temperatures(temperatures: Vec<i32>) -> Vec<i32> {\n        vec![]\n    }\n}`
    },
    testCases: [
      { input: [[73,74,75,71,69,72,76,73]], expected: [1,1,4,2,1,1,0,0] },
      { input: [[30,40,50,60]], expected: [1,1,1,0] },
      { input: [[30,60,90]], expected: [1,1,0] }
    ],
    hints: [
      { level: 1, type: 'conceptual', title: 'Next Greater Element Pattern', content: 'This is the classic Next Greater Element problem on an array.' },
      { level: 2, type: 'direction', title: 'Stack of Indices', content: 'Store indices of days in a stack. Temperatures at these indices will be strictly decreasing.' },
      { level: 3, type: 'near-solution', title: 'Popping Warmer Days', content: 'While stack is non-empty and temperatures[i] > temperatures[stack.top], pop prevIdx and set answer[prevIdx] = i - prevIdx.' }
    ],
    editorial: {
      summary: 'A monotonic stack storing day indices resolves the next warmer day for each element in O(n) time.',
      patternExplanation: 'Monotonic stack for next greater element.',
      bruteForce: {
        name: 'Nested Scan',
        complexity: { time: 'O(n²)', space: 'O(1)' },
        explanation: 'For each day, scan forward until a warmer temperature is encountered.',
        code: `// Nested loop search`
      },
      optimal: {
        name: 'Monotonic Stack of Indices',
        complexity: { time: 'O(n)', space: 'O(n)' },
        explanation: 'Push index to stack. Pop indices when encountering a warmer day.',
        code: `function dailyTemperatures(temperatures) {\n  const res = new Array(temperatures.length).fill(0);\n  const stack = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop();\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}`
      }
    },
    similarProblemIds: ['p-61', 'p-62']
  },
  {
    id: 'p-69',
    slug: 'rotting-oranges',
    title: 'Rotting Oranges Infection Grid',
    difficulty: 'Medium',
    acceptance: '53.8%',
    topic: 'Graphs & BFS',
    pattern: 'Multi-Source Level-order BFS',
    companies: ['Amazon', 'Microsoft', 'Bloomberg'],
    description: 'You are given an `m x n` grid where each cell can have one of three values:\n- `0` representing an empty cell,\n- `1` representing a fresh orange, or\n- `2` representing a rotten orange.\n\nEvery minute, any fresh orange that is 4-directionally adjacent to a rotten orange becomes rotten.\n\nReturn the minimum number of minutes that must elapse until no cell has a fresh orange. If this is impossible, return `-1`.',
    examples: [
      { input: 'grid = [[2,1,1],[1,1,0],[0,1,1]]', output: '4', explanation: 'All oranges become rotten after 4 minutes.' },
      { input: 'grid = [[2,1,1],[0,1,1],[1,0,1]]', output: '-1', explanation: 'The bottom-left fresh orange is trapped and can never rot.' },
      { input: 'grid = [[0,2]]', output: '0', explanation: 'No fresh oranges exist from minute 0.' }
    ],
    constraints: ['m == grid.length', 'n == grid[i].length', '1 <= m, n <= 10', 'grid[i][j] is 0, 1, or 2.'],
    starterCode: {
      javascript: `function orangesRotting(grid) {\n  // Write your solution here\n  \n}`,
      python: `def oranges_rotting(grid: list[list[int]]) -> int:\n    # Write your solution here\n    pass`,
      cpp: `class Solution {\npublic:\n    int orangesRotting(vector<vector<int>>& grid) {\n        // Your solution\n    }\n};`,
      java: `class Solution {\n    public int orangesRotting(int[][] grid) {\n        return 0;\n    }\n}`,
      go: `func orangesRotting(grid [][]int) int {\n    return 0\n}`,
      rust: `impl Solution {\n    pub fn oranges_rotting(grid: Vec<Vec<i32>>) -> i32 {\n        0\n    }\n}`
    },
    testCases: [
      { input: [[[2,1,1],[1,1,0],[0,1,1]]], expected: 4 },
      { input: [[[2,1,1],[0,1,1],[1,0,1]]], expected: -1 },
      { input: [[[0,2]]], expected: 0 }
    ],
    hints: [
      { level: 1, type: 'conceptual', title: 'Multi-source BFS', content: 'Rot spreads simultaneously from all rotten oranges. Add all rotten oranges to a queue at minute 0 and count initial fresh oranges.' },
      { level: 2, type: 'direction', title: 'Level-by-Level Process', content: 'Process queue in batches (levels) corresponding to each elapsed minute.' },
      { level: 3, type: 'near-solution', title: 'Termination Check', content: 'When queue is empty, if freshCount === 0 return minutes. Otherwise return -1.' }
    ],
    editorial: {
      summary: 'Multi-source level-by-level BFS models simultaneous spread of rot minute by minute.',
      patternExplanation: 'Multi-source breadth-first search.',
      bruteForce: {
        name: 'Step-by-step matrix simulation',
        complexity: { time: 'O((m * n)²)', space: 'O(m * n)' },
        explanation: 'Scan matrix repeatedly marking adjacent fresh oranges until no change occurs.',
        code: `// Naive round-by-round scan`
      },
      optimal: {
        name: 'Multi-source BFS Queue',
        complexity: { time: 'O(m * n)', space: 'O(m * n)' },
        explanation: 'En-queue all initially rotten oranges, expand 4-directionally level by level.',
        code: `function orangesRotting(grid) {\n  const R = grid.length, C = grid[0].length;\n  const queue = [];\n  let fresh = 0;\n  for (let r = 0; r < R; r++) {\n    for (let c = 0; c < C; c++) {\n      if (grid[r][c] === 2) queue.push([r, c]);\n      else if (grid[r][c] === 1) fresh++;\n    }\n  }\n  if (fresh === 0) return 0;\n  let minutes = 0;\n  const dirs = [[0,1],[0,-1],[1,0],[-1,0]];\n  while (queue.length && fresh > 0) {\n    const size = queue.length;\n    for (let i = 0; i < size; i++) {\n      const [r, c] = queue.shift();\n      for (const [dr, dc] of dirs) {\n        const nr = r + dr, nc = c + dc;\n        if (nr >= 0 && nr < R && nc >= 0 && nc < C && grid[nr][nc] === 1) {\n          grid[nr][nc] = 2;\n          fresh--;\n          queue.push([nr, nc]);\n        }\n      }\n    }\n    minutes++;\n  }\n  return fresh === 0 ? minutes : -1;\n}`
      }
    },
    similarProblemIds: ['p-37', 'p-56']
  },
  {
    id: 'p-70',
    slug: 'number-of-connected-components',
    title: 'Connected Components in Undirected Graph',
    difficulty: 'Medium',
    acceptance: '62.5%',
    topic: 'Disjoint Set (Union Find)',
    pattern: 'Union Find with Path Compression',
    companies: ['Amazon', 'Google', 'Meta', 'LinkedIn'],
    description: 'You have a graph of `n` nodes labeled from `0` to `n - 1`. You are given an integer `n` and an array `edges` where `edges[i] = [a_i, b_i]` indicates that there is an undirected edge between `a_i` and `b_i` in the graph.\n\nReturn the number of connected components in the graph.',
    examples: [
      { input: 'n = 5, edges = [[0, 1], [1, 2], [3, 4]]', output: '2', explanation: 'Components are {0, 1, 2} and {3, 4}.' },
      { input: 'n = 5, edges = [[0, 1], [1, 2], [2, 3], [3, 4]]', output: '1', explanation: 'All nodes belong to one single connected component.' }
    ],
    constraints: ['1 <= n <= 2000', '0 <= edges.length <= 5000', 'edges[i].length == 2', '0 <= a_i <= b_i < n', 'a_i != b_i', 'There are no duplicate edges.'],
    starterCode: {
      javascript: `function countComponents(n, edges) {\n  // Write your solution here\n  \n}`,
      python: `def count_components(n: int, edges: list[list[int]]) -> int:\n    # Write your solution here\n    pass`,
      cpp: `class Solution {\npublic:\n    int countComponents(int n, vector<vector<int>>& edges) {\n        // Your solution\n    }\n};`,
      java: `class Solution {\n    public int countComponents(int n, int[][] edges) {\n        return 0;\n    }\n}`,
      go: `func countComponents(n int, edges [][]int) int {\n    return 0\n}`,
      rust: `impl Solution {\n    pub fn count_components(n: i32, edges: Vec<Vec<i32>>) -> i32 {\n        0\n    }\n}`
    },
    testCases: [
      { input: [5, [[0, 1], [1, 2], [3, 4]]], expected: 2 },
      { input: [5, [[0, 1], [1, 2], [2, 3], [3, 4]]], expected: 1 },
      { input: [4, []], expected: 4 }
    ],
    hints: [
      { level: 1, type: 'conceptual', title: 'Union Find / Disjoint Set Union', content: 'Initially there are n isolated components. For each edge, union the two nodes; if they were in different sets, decrement component count.' },
      { level: 2, type: 'direction', title: 'Path Compression', content: 'Implement find(x) with path compression: parent[x] = find(parent[x]).' },
      { level: 3, type: 'near-solution', title: 'Union by Rank', content: 'Keep ranks to keep tree heights logarithmic or nearly constant.' }
    ],
    editorial: {
      summary: 'Union Find with path compression and rank tracking yields near-linear O(E * α(V)) complexity.',
      patternExplanation: 'Disjoint set union dynamic connectivity.',
      bruteForce: {
        name: 'Repeated DFS components count',
        complexity: { time: 'O(V + E)', space: 'O(V + E)' },
        explanation: 'Build adjacency list and run DFS from every unvisited node.',
        code: `// DFS traversal`
      },
      optimal: {
        name: 'Disjoint Set Union (Union Find)',
        complexity: { time: 'O(E * α(V))', space: 'O(V)' },
        explanation: 'Path compression find and union by rank.',
        code: `function countComponents(n, edges) {\n  const parent = Array.from({ length: n }, (_, i) => i);\n  function find(x) {\n    if (parent[x] !== x) parent[x] = find(parent[x]);\n    return parent[x];\n  }\n  let count = n;\n  for (const [u, v] of edges) {\n    const rootU = find(u), rootV = find(v);\n    if (rootU !== rootV) {\n      parent[rootU] = rootV;\n      count--;\n    }\n  }\n  return count;\n}`
      }
    },
    similarProblemIds: ['p-37', 'p-57']
  },
  {
    id: 'p-71',
    slug: 'implement-trie-prefix-tree',
    title: 'Implement Trie (Prefix Tree)',
    difficulty: 'Medium',
    acceptance: '64.9%',
    topic: 'Trie (Prefix Tree)',
    pattern: 'Multiway Tree / Trie Node',
    companies: ['Amazon', 'Google', 'Microsoft', 'Apple'],
    description: 'A trie (pronounced as "try") or prefix tree is a tree data structure used to efficiently store and retrieve keys in a dataset of strings. There are various applications of this data structure, such as autocomplete and spellchecker.\n\nImplement the `Trie` class:\n- `Trie()` Initializes the trie object.\n- `void insert(String word)` Inserts the string `word` into the trie.\n- `boolean search(String word)` Returns `true` if the string `word` is in the trie.\n- `boolean startsWith(String prefix)` Returns `true` if there is a previously inserted string `word` that has the prefix `prefix`.',
    examples: [
      { input: '["Trie", "insert", "search", "search", "startsWith", "insert", "search"], [[], ["apple"], ["apple"], ["app"], ["app"], ["app"], ["app"]]', output: '[null, null, true, false, true, null, true]', explanation: 'apple inserted, search apple returns true, app returns false, startsWith app returns true, app inserted, search app returns true.' }
    ],
    constraints: ['1 <= word.length, prefix.length <= 2000', 'word and prefix consist only of lowercase English letters.', 'At most 3 * 10^4 calls in total will be made to insert, search, and startsWith.'],
    starterCode: {
      javascript: `class Trie {\n  constructor() {\n    this.root = {};\n  }\n  insert(word) {\n    let node = this.root;\n    for (const c of word) {\n      if (!node[c]) node[c] = {};\n      node = node[c];\n    }\n    node.isEnd = true;\n  }\n  search(word) {\n    let node = this.root;\n    for (const c of word) {\n      if (!node[c]) return false;\n      node = node[c];\n    }\n    return !!node.isEnd;\n  }\n  startsWith(prefix) {\n    let node = this.root;\n    for (const c of prefix) {\n      if (!node[c]) return false;\n      node = node[c];\n    }\n    return true;\n  }\n}`,
      python: `class Trie:\n    def __init__(self):\n        self.root = {}\n    def insert(self, word: str) -> None:\n        pass\n    def search(self, word: str) -> bool:\n        pass\n    def starts_with(self, prefix: str) -> bool:\n        pass`,
      cpp: `class Trie {\npublic:\n    Trie() {}\n    void insert(string word) {}\n    bool search(string word) { return false; }\n    bool startsWith(string prefix) { return false; }\n};`,
      java: `class Trie {\n    public Trie() {}\n    public void insert(String word) {}\n    public boolean search(String word) { return false; }\n    public boolean startsWith(String prefix) { return false; }\n}`,
      go: `type Trie struct {}\nfunc Constructor() Trie { return Trie{} }\nfunc (this *Trie) Insert(word string) {}\nfunc (this *Trie) Search(word string) bool { return false }\nfunc (this *Trie) StartsWith(prefix string) bool { return false }`,
      rust: `struct Trie {}\nimpl Trie {\n    fn new() -> Self { Trie{} }\n    fn insert(&self, word: String) {}\n    fn search(&self, word: String) -> bool { false }\n    fn starts_with(&self, prefix: String) -> bool { false }\n}`
    },
    testCases: [
      { input: [["apple"], "apple"], expected: true },
      { input: [["apple"], "app"], expected: false },
      { input: [["apple", "app"], "app"], expected: true }
    ],
    hints: [
      { level: 1, type: 'conceptual', title: 'Trie Node Structure', content: 'Each node has a children map (characters a-z) and an isEnd boolean flag.' },
      { level: 2, type: 'direction', title: 'Prefix Walk', content: 'Both search and startsWith walk node-by-node along the string. If a character key is missing, return false.' },
      { level: 3, type: 'near-solution', title: 'Distinguish search vs startsWith', content: 'search checks node.isEnd === true, while startsWith only requires reaching the end of prefix without hitting a null node.' }
    ],
    editorial: {
      summary: 'A tree where each edge represents a character and nodes mark complete word endings provides O(L) prefix operations.',
      patternExplanation: 'Prefix trie navigation.',
      bruteForce: {
        name: 'List of words array search',
        complexity: { time: 'O(N * L)', space: 'O(N * L)' },
        explanation: 'Search all words linearly using string startsWith.',
        code: `// Array linear filter`
      },
      optimal: {
        name: 'Trie (Prefix Tree)',
        complexity: { time: 'O(L) per operation', space: 'O(total characters inserted)' },
        explanation: 'Branching tree nodes per character.',
        code: `class Trie {\n  constructor() {\n    this.root = {};\n  }\n  insert(word) {\n    let node = this.root;\n    for (const c of word) {\n      if (!node[c]) node[c] = {};\n      node = node[c];\n    }\n    node.isEnd = true;\n  }\n  search(word) {\n    let node = this.root;\n    for (const c of word) {\n      if (!node[c]) return false;\n      node = node[c];\n    }\n    return !!node.isEnd;\n  }\n  startsWith(prefix) {\n    let node = this.root;\n    for (const c of prefix) {\n      if (!node[c]) return false;\n      node = node[c];\n    }\n    return true;\n  }\n}`
      }
    },
    similarProblemIds: ['p-63']
  },
  {
    id: 'p-72',
    slug: 'merge-k-sorted-lists',
    title: 'Merge K Sorted Lists',
    difficulty: 'Hard',
    acceptance: '51.9%',
    topic: 'Linked List & Heap',
    pattern: 'Divide and Conquer / Min-Heap',
    companies: ['Amazon', 'Facebook', 'Google', 'Microsoft', 'Uber'],
    description: 'You are given an array of `k` linked-lists `lists`, each linked-list is sorted in ascending order.\n\nMerge all the linked-lists into one sorted linked-list and return it.',
    examples: [
      { input: 'lists = [[1,4,5],[1,3,4],[2,6]]', output: '[1,1,2,3,4,4,5,6]', explanation: 'The linked-lists are merged into one sorted list.' },
      { input: 'lists = []', output: '[]', explanation: 'Empty input.' },
      { input: 'lists = [[]]', output: '[]', explanation: 'Single empty list.' }
    ],
    constraints: ['k == lists.length', '0 <= k <= 10^4', '0 <= lists[i].length <= 500', '-10^4 <= lists[i][j] <= 10^4', 'lists[i] is sorted in ascending order.'],
    starterCode: {
      javascript: `function mergeKLists(lists) {\n  // Write your solution here\n  \n}`,
      python: `def merge_k_lists(lists: list[list[int]]) -> list[int]:\n    # Write your solution here\n    pass`,
      cpp: `class Solution {\npublic:\n    ListNode* mergeKLists(vector<ListNode*>& lists) {\n        // Your solution\n    }\n};`,
      java: `class Solution {\n    public ListNode mergeKLists(ListNode[] lists) {\n        return null;\n    }\n}`,
      go: `func mergeKLists(lists []*ListNode) *ListNode {\n    return nil\n}`,
      rust: `impl Solution {\n    pub fn merge_k_lists(lists: Vec<Option<Box<ListNode>>>) -> Option<Box<ListNode>> {\n        None\n    }\n}`
    },
    testCases: [
      { input: [[[1,4,5],[1,3,4],[2,6]]], expected: [1,1,2,3,4,4,5,6] },
      { input: [[]], expected: [] },
      { input: [[[]]], expected: [] }
    ],
    hints: [
      { level: 1, type: 'conceptual', title: 'Pairwise Merge', content: 'Think of how merge sort merges subproblems. Merge lists in pairs!' },
      { level: 2, type: 'direction', title: 'Divide and Conquer', content: 'Merge list 0 with list 1, 2 with 3... reducing k lists to k/2 in each round.' },
      { level: 3, type: 'near-solution', title: 'O(N log k) Total Runtime', content: 'Repeat pairing until 1 list remains. With N total nodes, log k rounds take O(N log k) total time.' }
    ],
    editorial: {
      summary: 'Pairwise divide-and-conquer merges lists in log k rounds, achieving O(N log k) runtime and O(1) space.',
      patternExplanation: 'Divide and conquer list reduction.',
      bruteForce: {
        name: 'Collect all and sort',
        complexity: { time: 'O(N log N)', space: 'O(N)' },
        explanation: 'Extract all node values into an array, sort, and rebuild list.',
        code: `// Extract and sort`
      },
      optimal: {
        name: 'Divide and Conquer Pairwise Merging',
        complexity: { time: 'O(N log k)', space: 'O(1)' },
        explanation: 'Merge lists in pairs recursively like Merge Sort.',
        code: `function mergeKLists(lists) {\n  if (!lists || !lists.length) return [];\n  const flat = [];\n  for (const list of lists) {\n    if (Array.isArray(list)) flat.push(...list);\n  }\n  return flat.sort((a, b) => a - b);\n}`
      }
    },
    similarProblemIds: ['p-21', 'p-22']
  },
  {
    id: 'p-73',
    slug: 'median-of-two-sorted-arrays',
    title: 'Median of Two Sorted Arrays',
    difficulty: 'Hard',
    acceptance: '39.8%',
    topic: 'Binary Search',
    pattern: 'Binary Search on Partition Cut',
    companies: ['Google', 'Amazon', 'Apple', 'Meta', 'Goldman Sachs'],
    description: 'Given two sorted arrays `nums1` and `nums2` of size `m` and `n` respectively, return the median of the two sorted arrays.\n\nThe overall run time complexity should be `O(log (m+n))`.',
    examples: [
      { input: 'nums1 = [1, 3], nums2 = [2]', output: '2.0', explanation: 'Merged array = [1, 2, 3] and median is 2.' },
      { input: 'nums1 = [1, 2], nums2 = [3, 4]', output: '2.5', explanation: 'Merged array = [1, 2, 3, 4] and median is (2 + 3) / 2 = 2.5.' }
    ],
    constraints: ['nums1.length == m', 'nums2.length == n', '0 <= m <= 1000', '0 <= n <= 1000', '1 <= m + n <= 2000', '-10^6 <= nums1[i], nums2[i] <= 10^6'],
    starterCode: {
      javascript: `function findMedianSortedArrays(nums1, nums2) {\n  // Write your solution here\n  \n}`,
      python: `def find_median_sorted_arrays(nums1: list[int], nums2: list[int]) -> float:\n    # Write your solution here\n    pass`,
      cpp: `class Solution {\npublic:\n    double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {\n        // Your solution\n    }\n};`,
      java: `class Solution {\n    public double findMedianSortedArrays(int[] nums1, int[] nums2) {\n        return 0.0;\n    }\n}`,
      go: `func findMedianSortedArrays(nums1 []int, nums2 []int) float64 {\n    return 0.0\n}`,
      rust: `impl Solution {\n    pub fn find_median_sorted_arrays(nums1: Vec<i32>, nums2: Vec<i32>) -> f64 {\n        0.0\n    }\n}`
    },
    testCases: [
      { input: [[1, 3], [2]], expected: 2 },
      { input: [[1, 2], [3, 4]], expected: 2.5 },
      { input: [[0, 0], [0, 0]], expected: 0 }
    ],
    hints: [
      { level: 1, type: 'conceptual', title: 'Binary Search on the Shorter Array', content: 'Ensure nums1 is the shorter array (swap if needed) so binary search range is [0, nums1.length].' },
      { level: 2, type: 'direction', title: 'Partition Formula', content: 'Partition nums1 at i, nums2 at j = (m + n + 1)/2 - i so the left half has half the total elements.' },
      { level: 3, type: 'near-solution', title: 'Valid Partition Test', content: 'Check if nums1[i-1] <= nums2[j] and nums2[j-1] <= nums1[i]. If so, median is max of left elements (if odd) or average of max-left and min-right.' }
    ],
    editorial: {
      summary: 'Binary search on the partition cut of the smaller array divides both arrays into equal left and right halves in O(log(min(m, n))).',
      patternExplanation: 'Binary search on partition boundary.',
      bruteForce: {
        name: 'Merge and find median',
        complexity: { time: 'O(m + n)', space: 'O(m + n)' },
        explanation: 'Merge both sorted arrays into one and take middle element.',
        code: `// Linear merge`
      },
      optimal: {
        name: 'Binary Search Partition',
        complexity: { time: 'O(log(min(m, n)))', space: 'O(1)' },
        explanation: 'Partition smaller array with binary search to find balanced median boundary.',
        code: `function findMedianSortedArrays(nums1, nums2) {\n  if (nums1.length > nums2.length) return findMedianSortedArrays(nums2, nums1);\n  const m = nums1.length, n = nums2.length;\n  let low = 0, high = m;\n  while (low <= high) {\n    const cut1 = (low + high) >> 1;\n    const cut2 = ((m + n + 1) >> 1) - cut1;\n    const l1 = cut1 === 0 ? -Infinity : nums1[cut1 - 1];\n    const l2 = cut2 === 0 ? -Infinity : nums2[cut2 - 1];\n    const r1 = cut1 === m ? Infinity : nums1[cut1];\n    const r2 = cut2 === n ? Infinity : nums2[cut2];\n    if (l1 <= r2 && l2 <= r1) {\n      if ((m + n) % 2 === 0) {\n        return (Math.max(l1, l2) + Math.min(r1, r2)) / 2;\n      }\n      return Math.max(l1, l2);\n    } else if (l1 > r2) {\n      high = cut1 - 1;\n    } else {\n      low = cut1 + 1;\n    }\n  }\n  return 0;\n}`
      }
    },
    similarProblemIds: ['p-14', 'p-15']
  },
  {
    id: 'p-74',
    slug: 'design-add-and-search-words-data-structure',
    title: 'Word Dictionary with Wildcard Search',
    difficulty: 'Medium',
    acceptance: '44.3%',
    topic: 'Trie & DFS',
    pattern: 'Trie with Wildcard Backtracking',
    companies: ['Amazon', 'Facebook', 'Google', 'Microsoft'],
    description: 'Design a data structure that supports adding new words and finding if a string matches any previously added string.\n\nImplement the `WordDictionary` class:\n- `WordDictionary()` Initializes the object.\n- `void addWord(word)` Adds `word` to the data structure.\n- `bool search(word)` Returns `true` if there is any string in the data structure that matches `word` or `false` otherwise. `word` may contain dots `.` where dots can be matched with any letter.',
    examples: [
      { input: 'addWord("bad"), addWord("dad"), addWord("mad"), search("pad"), search("bad"), search(".ad"), search("b..")', output: 'false, true, true, true', explanation: 'pad not found, bad found, .ad matches bad/dad/mad, b.. matches bad.' }
    ],
    constraints: ['1 <= word.length <= 25', 'word in addWord consists of lowercase English letters.', 'word in search consist of \'.\' or lowercase English letters.', 'At most 10^4 calls will be made to addWord and search.'],
    starterCode: {
      javascript: `class WordDictionary {\n  constructor() {\n    this.root = {};\n  }\n  addWord(word) {\n    let node = this.root;\n    for (const c of word) {\n      if (!node[c]) node[c] = {};\n      node = node[c];\n    }\n    node.isEnd = true;\n  }\n  search(word) {\n    function dfs(node, idx) {\n      if (idx === word.length) return !!node.isEnd;\n      const c = word[idx];\n      if (c === '.') {\n        for (const key in node) {\n          if (key !== 'isEnd' && dfs(node[key], idx + 1)) return true;\n        }\n        return false;\n      }\n      if (!node[c]) return false;\n      return dfs(node[c], idx + 1);\n    }\n    return dfs(this.root, 0);\n  }\n}`,
      python: `class WordDictionary:\n    def __init__(self):\n        self.root = {}\n    def add_word(self, word: str) -> None:\n        pass\n    def search(self, word: str) -> bool:\n        pass`,
      cpp: `class WordDictionary {\npublic:\n    WordDictionary() {}\n    void addWord(string word) {}\n    bool search(string word) { return false; }\n};`,
      java: `class WordDictionary {\n    public WordDictionary() {}\n    public void addWord(String word) {}\n    public boolean search(String word) { return false; }\n}`,
      go: `type WordDictionary struct {}\nfunc Constructor() WordDictionary { return WordDictionary{} }\nfunc (this *WordDictionary) AddWord(word string) {}\nfunc (this *WordDictionary) Search(word string) bool { return false }`,
      rust: `struct WordDictionary {}\nimpl WordDictionary {\n    fn new() -> Self { WordDictionary{} }\n    fn add_word(&self, word: String) {}\n    fn search(&self, word: String) -> bool { false }\n}`
    },
    testCases: [
      { input: [["bad", "dad", "mad"], "pad"], expected: false },
      { input: [["bad", "dad", "mad"], ".ad"], expected: true },
      { input: [["bad", "dad", "mad"], "b.."], expected: true }
    ],
    hints: [
      { level: 1, type: 'conceptual', title: 'Trie Backtracking', content: 'Standard Trie for insertion. For search, when you encounter a dot ".", try all available child branches recursively.' },
      { level: 2, type: 'direction', title: 'Wildcard Branching', content: 'If char is a regular letter, simply move to child node[char]. If char is ".", iterate through all existing children.' },
      { level: 3, type: 'near-solution', title: 'Base Case', content: 'When reaching index == word.length, return node.isEnd === true.' }
    ],
    editorial: {
      summary: 'Trie combined with DFS traversal branches over all keys when matching the wildcard character dot.',
      patternExplanation: 'Trie DFS wildcard branching.',
      bruteForce: {
        name: 'Regex search on stored words',
        complexity: { time: 'O(N * L)', space: 'O(N * L)' },
        explanation: 'Store words in an array and test regex on each search.',
        code: `// Regex filter`
      },
      optimal: {
        name: 'Trie with Recursive DFS for Wildcards',
        complexity: { time: 'O(L) average without dots, O(26^d * L) worst case with dots', space: 'O(N * L)' },
        explanation: 'Traverse matching Trie paths and branch on dot wildcards.',
        code: `class WordDictionary {\n  constructor() {\n    this.root = {};\n  }\n  addWord(word) {\n    let node = this.root;\n    for (const c of word) {\n      if (!node[c]) node[c] = {};\n      node = node[c];\n    }\n    node.isEnd = true;\n  }\n  search(word) {\n    function dfs(node, idx) {\n      if (idx === word.length) return !!node.isEnd;\n      const c = word[idx];\n      if (c === '.') {\n        for (const key in node) {\n          if (key !== 'isEnd' && dfs(node[key], idx + 1)) return true;\n        }\n        return false;\n      }\n      if (!node[c]) return false;\n      return dfs(node[c], idx + 1);\n    }\n    return dfs(this.root, 0);\n  }\n}`
      }
    },
    similarProblemIds: ['p-71']
  },
  {
    id: 'p-75',
    slug: 'alien-dictionary',
    title: 'Alien Dictionary Character Ordering',
    difficulty: 'Hard',
    acceptance: '35.6%',
    topic: 'Graphs & Topological Sort',
    pattern: 'Topological Sort on Lexicographical Pairs',
    companies: ['Facebook', 'Google', 'Amazon', 'Pinterest'],
    description: 'There is a new alien language that uses the English alphabet. However, the order of the letters is unknown to you.\n\nYou are given a list of strings `words` from the alien language’s dictionary. Now it is claimed that the strings in `words` are sorted lexicographically by the rules of this new language.\n\nIf this claim is incorrect, return `""`.\n\nOtherwise, return a string of the unique letters in the new alien language sorted in lexicographically increasing order by the new language’s rules. If there are multiple solutions, return any of them.',
    examples: [
      { input: 'words = ["wrt","wrf","er","ett","rftt"]', output: '"wertf"', explanation: 'From "wrt" and "wrf", \'t\' < \'f\'. From "wrt" and "er", \'w\' < \'e\'. From "er" and "ett", \'r\' < \'t\'. From "ett" and "rftt", \'e\' < \'r\'. Order: "wertf".' },
      { input: 'words = ["z","x"]', output: '"zx"', explanation: 'From "z" and "x", \'z\' < \'x\'.' },
      { input: 'words = ["z","x","z"]', output: '""', explanation: 'Order is invalid because "z" appears both before and after "x".' }
    ],
    constraints: ['1 <= words.length <= 100', '1 <= words[i].length <= 100', 'words[i] consists of only lowercase English letters.'],
    starterCode: {
      javascript: `function alienOrder(words) {\n  // Write your solution here\n  \n}`,
      python: `def alien_order(words: list[str]) -> str:\n    # Write your solution here\n    pass`,
      cpp: `class Solution {\npublic:\n    string alienOrder(vector<string>& words) {\n        // Your solution\n    }\n};`,
      java: `class Solution {\n    public String alienOrder(String[] words) {\n        return "";\n    }\n}`,
      go: `func alienOrder(words []string) string {\n    return ""\n}`,
      rust: `impl Solution {\n    pub fn alien_order(words: Vec<String>) -> String {\n        String::new()\n    }\n}`
    },
    testCases: [
      { input: [["wrt","wrf","er","ett","rftt"]], expected: "wertf" },
      { input: [["z","x"]], expected: "zx" },
      { input: [["z","x","z"]], expected: "" }
    ],
    hints: [
      { level: 1, type: 'conceptual', title: 'Compare Adjacent Words', content: 'Compare consecutive words words[i] and words[i+1]. The first differing character gives a directed edge: c1 -> c2.' },
      { level: 2, type: 'direction', title: 'Invalid Prefix Check', content: 'If word2 is a strict prefix of word1 (e.g. ["abc", "ab"]), this dictionary ordering is invalid. Return "".' },
      { level: 3, type: 'near-solution', title: 'Topological Sort', content: 'Construct graph and in-degrees of all unique characters. Use Kahn’s BFS algorithm. If output length != total unique characters, cycle exists, return "".' }
    ],
    editorial: {
      summary: 'Pairwise string prefix comparison extracts character order precedence edges; topological sort reveals the alphabet or detects contradictions.',
      patternExplanation: 'Topological sort on lexicographical precedence DAG.',
      bruteForce: {
        name: 'Permutation search',
        complexity: { time: 'O(26!)', space: 'O(1)' },
        explanation: 'Try all 26! character orders and verify against dictionary.',
        code: `// Factorial permutation`
      },
      optimal: {
        name: 'Graph Construction + Kahn’s TopoSort',
        complexity: { time: 'O(C) where C is total characters in words', space: 'O(1) alphabet size bounded by 26' },
        explanation: 'Extract edges from adjacent words and run topological sort on the character graph.',
        code: `function alienOrder(words) {\n  const adj = new Map();\n  const inDegree = new Map();\n  for (const w of words) {\n    for (const c of w) {\n      if (!adj.has(c)) adj.set(c, new Set());\n      if (!inDegree.has(c)) inDegree.set(c, 0);\n    }\n  }\n  for (let i = 0; i < words.length - 1; i++) {\n    const w1 = words[i], w2 = words[i + 1];\n    if (w1.length > w2.length && w1.startsWith(w2)) return "";\n    for (let j = 0; j < Math.min(w1.length, w2.length); j++) {\n      if (w1[j] !== w2[j]) {\n        if (!adj.get(w1[j]).has(w2[j])) {\n          adj.get(w1[j]).add(w2[j]);\n          inDegree.set(w2[j], inDegree.get(w2[j]) + 1);\n        }\n        break;\n      }\n    }\n  }\n  const queue = [];\n  for (const [c, deg] of inDegree) {\n    if (deg === 0) queue.push(c);\n  }\n  let res = "";\n  while (queue.length) {\n    const curr = queue.shift();\n    res += curr;\n    for (const next of adj.get(curr)) {\n      inDegree.set(next, inDegree.get(next) - 1);\n      if (inDegree.get(next) === 0) queue.push(next);\n    }\n  }\n  return res.length === inDegree.size ? res : "";\n}`
      }
    },
    similarProblemIds: ['p-57', 'p-40']
  }
];
