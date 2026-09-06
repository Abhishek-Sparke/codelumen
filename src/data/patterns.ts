import { PatternGuide } from '../types';

export const PATTERNS_DATA: PatternGuide[] = [
  {
    id: 'frequency-map',
    title: 'Frequency Map',
    slug: 'frequency-map',
    tagline: 'Track element frequencies with hash tables for instant O(1) lookups',
    summary: 'Using hash tables or fixed-size array counters to record occurrences of items. Enables rapid comparison of counts, anagram verification, and frequency-based sorting.',
    whenToUse: [
      'Counting item occurrences in strings, arrays, or matrices',
      'Checking anagram validity or character permutations',
      'Finding the first non-repeating element or majority elements',
      'Validating sub-collection balance conditions'
    ],
    howToRecognize: [
      'Keywords: "frequency", "anagram", "most frequent", "at least k occurrences"',
      'Requires quick existence or count queries during array iteration'
    ],
    diagramAscii: `
Input: "abacaba"
Map: { 'a': 4, 'b': 2, 'c': 1 }
Check: map.get('a') === 4 (Instant O(1))
`,
    timeComplexity: 'O(n) pass to populate map',
    spaceComplexity: 'O(k) where k is the size of the unique alphabet/set',
    beginnerProblemIds: ['p-1', 'p-2'],
    intermediateProblemIds: ['p-3', 'p-4'],
    advancedProblemIds: ['p-5']
  },
  {
    id: 'prefix-sum',
    title: 'Prefix Sum',
    slug: 'prefix-sum',
    tagline: 'Precompute cumulative sums for instantaneous O(1) subarray queries',
    summary: 'A prefix sum array stores cumulative sums from index 0 to i. Any contiguous subarray sum from index L to R can be evaluated in O(1) time as prefix[R] - prefix[L-1].',
    whenToUse: [
      'Repeated range sum queries over a static array',
      'Counting subarrays whose sum equals target K (with a hash map)',
      'Balancing split points or 2D matrix range sums'
    ],
    howToRecognize: [
      'Problem asks about range sums or contiguous subarray sums',
      'Keywords: "sum between indices i and j", "subarray with sum k"'
    ],
    diagramAscii: `
Original: [ 3 , 1 ,  4 ,  1 ,  5 ]
Prefix:   [ 3 , 4 ,  8 ,  9 , 14 ]
Sum(1..3) = Prefix[3] - Prefix[0] = 9 - 3 = 6 (1 + 4 + 1 = 6)
`,
    timeComplexity: 'O(n) precomputation, O(1) per query',
    spaceComplexity: 'O(n) auxiliary prefix array',
    beginnerProblemIds: ['p-1', 'p-6'],
    intermediateProblemIds: ['p-7', 'p-18'],
    advancedProblemIds: ['p-58', 'p-59']
  },
  {
    id: 'two-pointers',
    title: 'Two Pointer',
    slug: 'two-pointer',
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
    id: 'fast-slow-pointers',
    title: 'Fast/Slow Pointer',
    slug: 'fast-slow-pointer',
    tagline: 'Floyd cycle detection and linked-list midpoint finding at different velocities',
    summary: 'Two pointers traverse a sequence at different speeds (typically 1 step vs 2 steps). If there is a cycle, the fast pointer will eventually lap the slow pointer.',
    whenToUse: [
      'Detecting cycles in a linked list or finite state sequence',
      'Finding the start node of a cycle without modifying links or hash tables',
      'Locating the exact middle node of a singly linked list in a single pass',
      'Happy number cycle detection'
    ],
    howToRecognize: [
      'Pointer-based structure where nodes might loop back',
      'Requirement for O(1) memory cycle check'
    ],
    diagramAscii: `
1 -> 2 -> 3 -> 4 -> 5 -> 3 (cycle)
Step 0: S=1, F=1
Step 1: S=2, F=3
Step 2: S=3, F=5
Step 3: S=4, F=4 (Collision! Cycle confirmed in O(1) space)
`,
    timeComplexity: 'O(n) where n is list length',
    spaceComplexity: 'O(1) auxiliary pointers',
    beginnerProblemIds: ['p-20', 'p-21'],
    intermediateProblemIds: ['p-22', 'p-23'],
    advancedProblemIds: ['p-37']
  },
  {
    id: 'binary-search',
    title: 'Binary Search',
    slug: 'binary-search',
    tagline: 'Divide and conquer on monotonic search spaces to achieve O(log n)',
    summary: 'Repeatedly halve the candidate space by evaluating the midpoint. Applicable not only to sorted arrays, but any monotonic predicate (Binary Search on Answer).',
    whenToUse: [
      'Searching an element in a sorted or rotated sorted array',
      'Finding the first or last occurrence of a condition',
      'Finding the minimum capacity or speed that fulfills a task (Capacity to Ship Packages)',
      'Square root or integer division without division operator'
    ],
    howToRecognize: [
      'Target time complexity specified as O(log n)',
      'Feasibility function is monotonic: if k works, all x > k work'
    ],
    diagramAscii: `
Range: [ 2 , 5 , 8 , 12 , 16 , 23 , 38 , 56 ]  Target = 23
Mid: 12 < 23 -> Discard left half [2..12]
Range: [ 16 , 23 , 38 , 56 ]
Mid: 23 === Target! Found in 2 steps.
`,
    timeComplexity: 'O(log n) comparisons',
    spaceComplexity: 'O(1) iterative, O(log n) recursive',
    beginnerProblemIds: ['p-24', 'p-25'],
    intermediateProblemIds: ['p-26', 'p-27'],
    advancedProblemIds: ['p-28']
  },
  {
    id: 'monotonic-stack',
    title: 'Monotonic Stack',
    slug: 'monotonic-stack',
    tagline: 'Maintain strictly increasing or decreasing order to find next greater/smaller elements',
    summary: 'A stack where elements are kept in monotonic order. Whenever an incoming element violates the order, elements are popped and resolved.',
    whenToUse: [
      'Finding the Next Greater Element or Next Smaller Element',
      'Daily Temperatures (days until warmer temperature)',
      'Largest rectangle in a histogram',
      'Trapping rain water'
    ],
    howToRecognize: [
      'Questions asking for nearest greater or smaller neighbor for every index',
      'Quadratic brute force scans to the right looking for a boundary'
    ],
    diagramAscii: `
Heights: [ 2 , 1 , 5 , 6 , 2 , 3 ]
Stack tracks indices of strictly increasing bars.
Incoming '2' is smaller than top '6' -> pop 6, calculate area!
`,
    timeComplexity: 'O(n) amortized (each element pushed and popped at most once)',
    spaceComplexity: 'O(n) auxiliary stack',
    beginnerProblemIds: ['p-14', 'p-15'],
    intermediateProblemIds: ['p-16', 'p-17'],
    advancedProblemIds: ['p-37']
  },
  {
    id: 'bfs',
    title: 'BFS (Breadth-First Search)',
    slug: 'bfs',
    tagline: 'Level-by-level queue exploration for shortest unweighted paths',
    summary: 'Breadth-First Search traverses tree or graph nodes layer by layer using a FIFO queue. In unweighted graphs, BFS guarantees discovery of the shortest path.',
    whenToUse: [
      'Shortest path in unweighted graph or grid maze',
      'Binary tree level order traversal',
      'Connected components expansion and multi-source propagation (Rotting Oranges)',
      'Word Ladder transformations'
    ],
    howToRecognize: [
      'Keywords: "shortest path", "fewest steps", "minimum mutations", "level by level"',
      'Unweighted edge graphs or 2D grid pathfinding'
    ],
    diagramAscii: `
Level 0:       ( Root )
              /        \\
Level 1:   ( Node A )   ( Node B )
          /     \\            \\
Level 2:( C )   ( D )        ( E )
FIFO Queue ensures all Level 1 visited before Level 2.
`,
    timeComplexity: 'O(V + E) where V is vertices, E is edges',
    spaceComplexity: 'O(V) for queue and visited set',
    beginnerProblemIds: ['p-30', 'p-38'],
    intermediateProblemIds: ['p-39', 'p-54'],
    advancedProblemIds: ['p-55']
  },
  {
    id: 'dfs',
    title: 'DFS (Depth-First Search)',
    slug: 'dfs',
    tagline: 'Recursive exploration to leaf branches and deep connected components',
    summary: 'Depth-First Search explores down a single branch as far as possible before backtracking. Essential for tree traversals, cycle detection, path counting, and component analysis.',
    whenToUse: [
      'Tree traversals (Preorder, Inorder, Postorder)',
      'Detecting cycles in directed or undirected graphs',
      'Flood fill and counting connected islands in grids',
      'Lowest Common Ancestor and Tree Diameters'
    ],
    howToRecognize: [
      'Keywords: "number of islands", "tree path sum", "connected components"',
      'Need to exhaustively examine complete paths from root to leaf'
    ],
    diagramAscii: `
Path Traversal:
Root -> Left Child -> Deepest Left Leaf -> Backtrack -> Right Child
Call stack automatically manages state restoration.
`,
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(H) where H is maximum tree/path depth',
    beginnerProblemIds: ['p-29', 'p-31'],
    intermediateProblemIds: ['p-32', 'p-33', 'p-40'],
    advancedProblemIds: ['p-34']
  },
  {
    id: 'topological-sort',
    title: 'Topological Sort',
    slug: 'topological-sort',
    tagline: 'Linear ordering of DAG vertices respecting prerequisite dependencies',
    summary: 'Produces a sequential ordering of vertices in a Directed Acyclic Graph such that for every directed edge u -> v, u appears before v (Kahn algorithm using in-degrees or DFS with post-order reversal).',
    whenToUse: [
      'Course schedule and prerequisite ordering',
      'Build systems and compilation order dependencies',
      'Detecting cycles in directed prerequisite graphs'
    ],
    howToRecognize: [
      'Tasks with prerequisite chains ("must complete A before B")',
      'Need to detect circular dependency deadlocks'
    ],
    diagramAscii: `
Course 0 ----> Course 1 ----> Course 3
                   ▲
Course 2 ----------│
In-degrees: [0:0, 1:2, 2:0, 3:1]
Order: [0, 2] -> [1] -> [3]
`,
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V + E) for adjacency list and queue',
    beginnerProblemIds: ['p-38'],
    intermediateProblemIds: ['p-39', 'p-54'],
    advancedProblemIds: ['p-55']
  },
  {
    id: 'backtracking',
    title: 'Backtracking',
    slug: 'backtracking',
    tagline: 'Systematic exploration of decision trees with pruning of invalid branches',
    summary: 'A depth-first search strategy that builds candidate solutions incrementally and abandons (backtracks) as soon as it determines a candidate cannot possibly lead to a valid solution.',
    whenToUse: [
      'Generating subsets, permutations, and combinations',
      'N-Queens problem, Sudoku solver, and crossword filling',
      'Word search on a letter grid',
      'Partitioning strings into palindromes'
    ],
    howToRecognize: [
      'Keywords: "return all possible combinations", "find all configurations"',
      'Problem constraints are deliberately small (N <= 15 or 20)'
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
    intermediateProblemIds: ['p-48', 'p-51', 'p-52'],
    advancedProblemIds: ['p-49', 'p-53']
  },
  {
    id: 'divide-and-conquer',
    title: 'Divide & Conquer',
    slug: 'divide-and-conquer',
    tagline: 'Break problems into independent sub-problems and merge the results',
    summary: 'Deconstructs a problem into two or more smaller subproblems of the same type, solves them recursively, and combines their solutions (e.g. Merge Sort, Quickselect).',
    whenToUse: [
      'Merge k sorted lists or merge sort',
      'Finding the Kth largest element via Quickselect in O(n) average time',
      'Fast exponentiation (x^n in O(log n))'
    ],
    howToRecognize: [
      'Problem divides neatly into independent halves',
      'Combining two half-solutions takes linear or sub-linear time'
    ],
    diagramAscii: `
          [ Problem (N) ]
          /             \\
  [ Left (N/2) ]     [ Right (N/2) ]
          \\             /
          [ Merged Result ]
`,
    timeComplexity: 'O(n log n) by Master Theorem',
    spaceComplexity: 'O(log n) to O(n) auxiliary memory',
    beginnerProblemIds: ['p-24'],
    intermediateProblemIds: ['p-25', 'p-36'],
    advancedProblemIds: ['p-52']
  },
  {
    id: 'greedy',
    title: 'Greedy',
    slug: 'greedy',
    tagline: 'Make the locally optimal choice at each step to reach a global optimum',
    summary: 'Constructs a solution piece by piece, always choosing the immediate best option without backtracking. Proving greedy choice property and optimal substructure is key.',
    whenToUse: [
      'Interval scheduling and non-overlapping interval maximums',
      'Jump Game minimum leaps or reachability',
      'Gas station circular tour',
      'Huffman encoding and fractional knapsack'
    ],
    howToRecognize: [
      'Keywords: "maximum number of non-overlapping", "minimum jumps", "optimal allocation"',
      'Sorted ordering allows decisions without revisiting earlier choices'
    ],
    diagramAscii: `
Intervals sorted by end time:
[1---3]  [2---5]  [4---6]  [6---8]
  ▲                 ▲        ▲
Selected          Selected Selected (Greedy non-overlapping)
`,
    timeComplexity: 'O(n log n) dominated by initial sort',
    spaceComplexity: 'O(1) auxiliary variables',
    beginnerProblemIds: ['p-3', 'p-8'],
    intermediateProblemIds: ['p-56', 'p-57'],
    advancedProblemIds: ['p-58']
  },
  {
    id: 'dynamic-programming',
    title: 'Dynamic Programming',
    slug: 'dynamic-programming',
    tagline: 'Overlapping subproblems and optimal substructure solved via memoization or tabulation',
    summary: 'Breaks complex optimization challenges into overlapping subproblems, solving each once and saving results. Transforms exponential recursive trees into polynomial time.',
    whenToUse: [
      'Problems with overlapping subproblems and optimal substructure',
      '1D DP: Climbing stairs, house robber, coin change',
      '2D DP: Longest Common Subsequence, Edit Distance, Unique Paths',
      '0/1 Knapsack variants'
    ],
    howToRecognize: [
      'Keywords: "maximum profit", "minimum cost", "number of distinct ways to achieve"',
      'Choices at step i affect state at step i+1'
    ],
    diagramAscii: `
dp[i] = min(dp[i - coin] + 1) for coin in coins
Tabulation:
[ 0 , 1 , 2 , 1 , 2 , 1 , 2 , 3 ] (Amount: 0..7)
Transitions calculated in strictly bottom-up order!
`,
    timeComplexity: 'O(N) or O(N * M) state transitions',
    spaceComplexity: 'O(N) or O(1) with rolling state optimization',
    beginnerProblemIds: ['p-41', 'p-42'],
    intermediateProblemIds: ['p-43', 'p-44', 'p-45'],
    advancedProblemIds: ['p-46']
  },
  {
    id: 'union-find',
    title: 'Union Find (Disjoint Set)',
    slug: 'union-find',
    tagline: 'Near O(1) connected component tracking with path compression and union by rank',
    summary: 'A data structure that tracks a set of elements partitioned into non-overlapping subsets. Supports finding the representative of a set and unioning two sets efficiently.',
    whenToUse: [
      'Detecting cycles in an undirected graph',
      'Counting connected components dynamically as edges are added',
      'Kruskal Minimum Spanning Tree algorithm',
      'Redundant connection identification'
    ],
    howToRecognize: [
      'Keywords: "connected components", "valid tree check", "friend circles"',
      'Graph edges added incrementally or dynamically'
    ],
    diagramAscii: `
Parent array with path compression:
[ 0 , 1 , 2 , 3 ] -> Union(0, 1) -> [ 1 , 1 , 2 , 3 ]
Union(2, 3) -> [ 1 , 1 , 3 , 3 ]
Union(1, 3) -> [ 3 , 3 , 3 , 3 ] (All in single component!)
`,
    timeComplexity: 'O(alpha(n)) nearly constant per operation (inverse Ackermann)',
    spaceComplexity: 'O(n) for parent and rank arrays',
    beginnerProblemIds: ['p-38'],
    intermediateProblemIds: ['p-40', 'p-54'],
    advancedProblemIds: ['p-55']
  }
];
