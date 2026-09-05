import { PatternGuide } from '../types';

export const PATTERNS_DATA: PatternGuide[] = [
  {
    id: 'two-pointers',
    title: 'Two Pointers',
    slug: 'two-pointers',
    tagline: 'Converging or parallel pointers to eliminate quadratic brute forces',
    summary: 'Two pointers is an approach where two indices iterate across data structure(s) simultaneously. Commonly used on sorted arrays or strings to evaluate pair conditions in O(n) time.',
    whenToUse: [
      'Input array or string is sorted (or sorting beforehand is cheap)',
      'Finding pairs or triplets that meet a sum or comparison condition',
      'Reversing sequences in-place without auxiliary memory',
      'Comparing elements from both ends moving inward'
    ],
    howToRecognize: [
      'Problem mentions sorted array and target sum',
      'Requires finding contiguous or symmetric sub-sequences in O(n)',
      'In-place array partitioning or duplicate removal'
    ],
    diagramAscii: `
[ 1 ,  2 ,  4 ,  7 , 11 , 15 ]   Target = 15
  ▲                        ▲
  │ (left)                 │ (right)
  1 + 15 = 16 > 15  --> Decrement right
  
[ 1 ,  2 ,  4 ,  7 , 11 , 15 ]
  ▲                  ▲
  1 + 11 = 12 < 15  --> Increment left
`,
    timeComplexity: 'O(n) single pass',
    spaceComplexity: 'O(1) auxiliary space',
    beginnerProblemIds: ['p-1', 'p-6', 'p-18'],
    intermediateProblemIds: ['p-7', 'p-8', 'p-19'],
    advancedProblemIds: ['p-20', 'p-35']
  },
  {
    id: 'sliding-window',
    title: 'Sliding Window',
    slug: 'sliding-window',
    tagline: 'Maintain a dynamic subarray boundary to track optimal intervals',
    summary: 'The Sliding Window pattern converts nested loops into a single linear scan by growing a right pointer to satisfy conditions and shrinking the left pointer to restore validity.',
    whenToUse: [
      'Problem asks for longest/shortest substring or subarray meeting a constraint',
      'Contiguous segment calculations (max sum of size k, distinct elements)',
      'String anagrams, permutations, or window minimums'
    ],
    howToRecognize: [
      'Keywords: "longest contiguous", "minimum window containing all", "substring"',
      'Monotonic condition: expanding window increases quantity, shrinking decreases it'
    ],
    diagramAscii: `
Window: [ left ... right ]
Growing:  [ a  b  c ] a  b  c  b  b   --> 'a' repeats!
Shrink:      [ b  c  a ] b  c  b  b   --> Valid again (len 3)
`,
    timeComplexity: 'O(n) where each element is visited at most twice',
    spaceComplexity: 'O(k) where k is character set or window size',
    beginnerProblemIds: ['p-9', 'p-10'],
    intermediateProblemIds: ['p-11', 'p-12'],
    advancedProblemIds: ['p-13', 'p-36']
  },
  {
    id: 'monotonic-stack',
    title: 'Monotonic Stack',
    slug: 'monotonic-stack',
    tagline: 'Maintain strictly increasing or decreasing order to find next greater/smaller elements',
    summary: 'A stack where elements are kept in monotonic order. Whenever an incoming element violates the order, elements are popped and resolved.',
    whenToUse: [
      'Finding the Next Greater Element or Next Smaller Element',
      'Histogram largest rectangle and trapping rainwater',
      'Evaluating span of stock prices or daily temperatures'
    ],
    howToRecognize: [
      'Phrases like "find the first element to the right that is greater than"',
      'Boundary detection for bar/elevation problems'
    ],
    diagramAscii: `
Stack (Decreasing): [ 73 , 71 ]   <-- Incoming: 75
75 > 71: Pop 71 (answer for index of 71 is distance to 75)
75 > 73: Pop 73 (answer for index of 73 is distance to 75)
Push 75: [ 75 ]
`,
    timeComplexity: 'O(n) amortized (each element pushed and popped once)',
    spaceComplexity: 'O(n) stack memory',
    beginnerProblemIds: ['p-14', 'p-15'],
    intermediateProblemIds: ['p-16', 'p-17'],
    advancedProblemIds: ['p-37']
  },
  {
    id: 'fast-slow-pointers',
    title: 'Fast & Slow Pointers (Floyd’s Cycle)',
    slug: 'fast-slow-pointers',
    tagline: 'Two pointers moving at different speeds to detect cycles and midpoints',
    summary: 'The slow pointer advances 1 step while the fast pointer advances 2 steps. If a cycle exists, they must inevitably collide.',
    whenToUse: [
      'Detecting loops in Linked Lists or sequences',
      'Finding the middle node of a linked list in one pass',
      'Finding cycle entrance point or happy number verification'
    ],
    howToRecognize: [
      'Linked list topology without random access',
      'Implicit directed graph where each node has out-degree 1'
    ],
    diagramAscii: `
1 -> 2 -> 3 -> 4 -> 5 -> 3 (loop back to 3)
Step 1: S=2, F=3
Step 2: S=3, F=5
Step 3: S=4, F=4 (Collision at node 4 -> Cycle Confirmed!)
`,
    timeComplexity: 'O(n) deterministic',
    spaceComplexity: 'O(1) auxiliary pointer memory',
    beginnerProblemIds: ['p-21'],
    intermediateProblemIds: ['p-22'],
    advancedProblemIds: ['p-23']
  },
  {
    id: 'binary-search',
    title: 'Modified Binary Search',
    slug: 'binary-search',
    tagline: 'Logarithmic search space halving on monotonic or partitioned domains',
    summary: 'Beyond basic array lookups, binary search applies to any monotonic predicate: can we achieve answer X? If yes, try tighter bounds.',
    whenToUse: [
      'Sorted arrays, rotated sorted arrays, mountain arrays',
      'Search space answer-optimization (e.g. Koko Eating Bananas, Capacity To Ship Packages)',
      'Finding boundary/first true condition'
    ],
    howToRecognize: [
      'Target time complexity is explicitly O(log n)',
      '"Minimize the maximum", "Maximize the minimum"'
    ],
    diagramAscii: `
Low = 0, High = 100
Mid = (0 + 100) / 2 = 50
Is condition(50) met?
  Yes -> High = 50 (search left half)
  No  -> Low = 51  (search right half)
`,
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)',
    beginnerProblemIds: ['p-24', 'p-25'],
    intermediateProblemIds: ['p-26', 'p-27'],
    advancedProblemIds: ['p-28']
  },
  {
    id: 'tree-dfs-bfs',
    title: 'Tree DFS & BFS Traversal',
    slug: 'tree-dfs-bfs',
    tagline: 'Exhaustive hierarchical traversal via recursion or level queue',
    summary: 'DFS dives deep down paths using the call stack (ideal for max depth, paths, validation), while BFS visits level-by-level using a FIFO queue (ideal for shortest path, level order).',
    whenToUse: [
      'Binary tree properties (symmetric, height-balanced, diameter)',
      'Level-order processing or zig-zag traversals',
      'Path sum and lowest common ancestor queries'
    ],
    howToRecognize: [
      'Binary Tree or N-ary Tree data structure given',
      'Requires aggregate properties over all root-to-leaf paths'
    ],
    diagramAscii: `
       [ 1 ]        Level 0
      /     \\
   [ 2 ]   [ 3 ]    Level 1
   /   \\       \\
 [ 4 ] [ 5 ]   [ 6 ] Level 2
BFS Queue: [1] -> [2, 3] -> [4, 5, 6]
`,
    timeComplexity: 'O(n) where n is number of nodes',
    spaceComplexity: 'O(h) for DFS (height), O(w) for BFS (max width)',
    beginnerProblemIds: ['p-29', 'p-30'],
    intermediateProblemIds: ['p-31', 'p-32'],
    advancedProblemIds: ['p-33']
  },
  {
    id: 'topological-sort',
    title: 'Topological Sort & Graph BFS',
    slug: 'topological-sort',
    tagline: 'Linear ordering of graph vertices obeying directed dependencies',
    summary: 'Using Kahn’s algorithm (in-degree tracking + queue) or DFS post-order to resolve dependency graphs, detect cycles, and schedule tasks.',
    whenToUse: [
      'Course schedules with prerequisites',
      'Package build order and task dependency pipelines',
      'Detecting directed cycles in dependency trees'
    ],
    howToRecognize: [
      'Given pairs of (A, B) where B must happen before A',
      'Valid order exists if and only if graph is a Directed Acyclic Graph (DAG)'
    ],
    diagramAscii: `
Course 0 ----> Course 1 ----> Course 3
               ▲
               │
Course 2 ------┘
In-degrees: [0: 0, 1: 2, 2: 0, 3: 1]
Enqueue 0 & 2 -> Process -> Unlock 1 -> Unlock 3
`,
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V + E)',
    beginnerProblemIds: ['p-34'],
    intermediateProblemIds: ['p-38', 'p-39'],
    advancedProblemIds: ['p-40']
  },
  {
    id: 'dynamic-programming',
    title: 'Dynamic Programming (1-D & 2-D)',
    slug: 'dynamic-programming',
    tagline: 'Decompose into overlapping subproblems with memoized state transitions',
    summary: 'Identify the state, define the recurrence relation (base case + transition), and build either top-down memoization or bottom-up tabular transitions.',
    whenToUse: [
      'Optimization (min cost, max profit, count ways)',
      'Subproblems repeat heavily (Fibonacci, Coin Change, Knapsack, Edit Distance)',
      'Choices made at step i depend on previous states'
    ],
    howToRecognize: [
      '"Find the maximum number of ways", "Minimum coins to make change"',
      'Greedy choice is provably non-optimal'
    ],
    diagramAscii: `
dp[i] = min(dp[i - coin] + 1) for each coin
Amount 0: 0 coins
Amount 1: 1 coin (using 1)
Amount 2: 2 coins (1+1)
Amount 3: 3 coins (1+1+1)
`,
    timeComplexity: 'O(number of states * transitions)',
    spaceComplexity: 'O(states) or O(1) state-reduction',
    beginnerProblemIds: ['p-41', 'p-42'],
    intermediateProblemIds: ['p-43', 'p-44'],
    advancedProblemIds: ['p-45', 'p-46']
  },
  {
    id: 'backtracking',
    title: 'Backtracking & State Exploration',
    slug: 'backtracking',
    tagline: 'Systematically traverse choice trees, undoing moves when dead ends hit',
    summary: 'A disciplined form of recursion that builds candidate solutions step by step, abandoning ("backtracking") as soon as a candidate cannot possibly lead to a valid answer.',
    whenToUse: [
      'Combinations, Permutations, Subsets, N-Queens, Sudoku solver',
      'Generating all valid parenthesis combinations',
      'Word search on a grid'
    ],
    howToRecognize: [
      '"Return all possible permutations / combinations"',
      'Constraints on N are typically small (N <= 15)'
    ],
    diagramAscii: `
Choice Tree for Subsets of [1, 2]:
         []
       /    \\
     [1]     []
    /   \\   /  \\
 [1,2] [1] [2] []
`,
    timeComplexity: 'O(2^n) or O(n!)',
    spaceComplexity: 'O(n) recursion call stack depth',
    beginnerProblemIds: ['p-47'],
    intermediateProblemIds: ['p-48'],
    advancedProblemIds: ['p-49']
  },
  {
    id: 'bitwise-manipulation',
    title: 'Bit Manipulation & Masking',
    slug: 'bitwise-manipulation',
    tagline: 'Direct bitwise operations (XOR, AND, shifts) for constant-space tricks',
    summary: 'Exploiting properties like x ^ x = 0, x ^ 0 = x, n & (n - 1) to clear lowest set bit, and bitmasks to represent subsets compactly.',
    whenToUse: [
      'Finding single unique number when others appear twice',
      'Counting number of 1 bits (Hamming weight)',
      'Subset representations without array allocations'
    ],
    howToRecognize: [
      'Array where every number appears k times except one',
      'Power of two verification or bitwise arithmetic'
    ],
    diagramAscii: `
XOR cancelation:
[ 4 , 1 , 2 , 1 , 2 ]
4 ^ (1 ^ 1) ^ (2 ^ 2)
= 4 ^ 0 ^ 0 = 4 (O(n) time, O(1) space!)
`,
    timeComplexity: 'O(1) or O(number of bits)',
    spaceComplexity: 'O(1) register operations',
    beginnerProblemIds: ['p-50'],
    intermediateProblemIds: ['p-4'],
    advancedProblemIds: ['p-5']
  }
];
