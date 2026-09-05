import { RoadmapStage } from '../types';

export const ROADMAP_STAGES: RoadmapStage[] = [
  {
    id: 'stage-1',
    order: 1,
    title: 'Arrays & Hashing',
    description: 'Fundamental lookup patterns, frequency counters, prefix sums, and hash sets.',
    topic: 'Arrays',
    estimatedHours: 8,
    difficultyRange: 'Easy - Medium',
    problemIds: ['p-1', 'p-2', 'p-3', 'p-4', 'p-5']
  },
  {
    id: 'stage-2',
    order: 2,
    title: 'Two Pointers',
    description: 'Converging left and right indices on sorted arrays, palindromes, and container trapping.',
    topic: 'Two Pointers',
    estimatedHours: 6,
    difficultyRange: 'Easy - Medium',
    problemIds: ['p-6', 'p-7', 'p-8', 'p-18', 'p-19']
  },
  {
    id: 'stage-3',
    order: 3,
    title: 'Sliding Window',
    description: 'Dynamic boundary tracking for contiguous substrings, distinct elements, and window max.',
    topic: 'Sliding Window',
    estimatedHours: 8,
    difficultyRange: 'Medium - Hard',
    problemIds: ['p-9', 'p-10', 'p-11', 'p-12', 'p-13']
  },
  {
    id: 'stage-4',
    order: 4,
    title: 'Stack',
    description: 'LIFO evaluation, parentheses matching, min stack, and monotonic next-greater searches.',
    topic: 'Stack',
    estimatedHours: 7,
    difficultyRange: 'Easy - Hard',
    problemIds: ['p-14', 'p-15', 'p-16', 'p-17', 'p-37']
  },
  {
    id: 'stage-5',
    order: 5,
    title: 'Binary Search',
    description: 'Logarithmic search halving on sorted collections, rotated arrays, and monotonic answer domains.',
    topic: 'Binary Search',
    estimatedHours: 7,
    difficultyRange: 'Easy - Medium',
    problemIds: ['p-24', 'p-25', 'p-26', 'p-27', 'p-28']
  },
  {
    id: 'stage-6',
    order: 6,
    title: 'Linked List',
    description: 'Pointer manipulation, reversal, sentinel heads, fast & slow pointer cycle detection.',
    topic: 'Linked List',
    estimatedHours: 6,
    difficultyRange: 'Easy - Hard',
    problemIds: ['p-20', 'p-21', 'p-22', 'p-23']
  },
  {
    id: 'stage-7',
    order: 7,
    title: 'Trees',
    description: 'Binary Tree recursion, DFS preorder/inorder/postorder, BFS level-order, and BST validation.',
    topic: 'Trees',
    estimatedHours: 10,
    difficultyRange: 'Easy - Hard',
    problemIds: ['p-29', 'p-30', 'p-31', 'p-32', 'p-33']
  },
  {
    id: 'stage-8',
    order: 8,
    title: 'Tries (Prefix Trees)',
    description: 'Efficient string search prefix structures, autocomplete engines, and word dictionaries.',
    topic: 'Tries',
    estimatedHours: 5,
    difficultyRange: 'Medium - Hard',
    problemIds: ['p-34', 'p-35']
  },
  {
    id: 'stage-9',
    order: 9,
    title: 'Heap / Priority Queue',
    description: 'Min-heaps and max-heaps for Top-K items, running medians, and task scheduling.',
    topic: 'Heap',
    estimatedHours: 6,
    difficultyRange: 'Medium - Hard',
    problemIds: ['p-36', 'p-37']
  },
  {
    id: 'stage-10',
    order: 10,
    title: 'Backtracking',
    description: 'Exhaustive combinatorial generation: subsets, permutations, combinations, and board search.',
    topic: 'Backtracking',
    estimatedHours: 8,
    difficultyRange: 'Medium - Hard',
    problemIds: ['p-47', 'p-48', 'p-49']
  },
  {
    id: 'stage-11',
    order: 11,
    title: 'Graphs',
    description: 'Adjacency lists, BFS shortest paths, DFS connected components, and cycle detection.',
    topic: 'Graphs',
    estimatedHours: 10,
    difficultyRange: 'Medium - Hard',
    problemIds: ['p-38', 'p-39', 'p-40']
  },
  {
    id: 'stage-12',
    order: 12,
    title: 'Advanced Graphs',
    description: 'Dijkstra weighted shortest path, Kruskal/Prim minimum spanning trees, and network flow.',
    topic: 'Advanced Graphs',
    estimatedHours: 8,
    difficultyRange: 'Hard',
    problemIds: ['p-39', 'p-40']
  },
  {
    id: 'stage-13',
    order: 13,
    title: '1-D Dynamic Programming',
    description: 'Memoized subproblems, bottom-up tabulations, climbing stairs, house robber, and coin change.',
    topic: 'Dynamic Programming',
    estimatedHours: 9,
    difficultyRange: 'Medium',
    problemIds: ['p-41', 'p-42', 'p-43']
  },
  {
    id: 'stage-14',
    order: 14,
    title: '2-D Dynamic Programming',
    description: 'Grid paths, longest common subsequence, edit distance, and 0/1 knapsack variants.',
    topic: 'Dynamic Programming',
    estimatedHours: 10,
    difficultyRange: 'Medium - Hard',
    problemIds: ['p-44', 'p-45', 'p-46']
  },
  {
    id: 'stage-15',
    order: 15,
    title: 'Greedy',
    description: 'Locally optimal choices that yield global optimums: jump game, gas stations, partition labels.',
    topic: 'Greedy',
    estimatedHours: 6,
    difficultyRange: 'Medium',
    problemIds: ['p-3', 'p-8']
  },
  {
    id: 'stage-16',
    order: 16,
    title: 'Intervals',
    description: 'Interval merging, meeting room scheduling, interval insertions, and boundary sweeping.',
    topic: 'Intervals',
    estimatedHours: 6,
    difficultyRange: 'Medium - Hard',
    problemIds: ['p-7', 'p-18']
  },
  {
    id: 'stage-17',
    order: 17,
    title: 'Bit Manipulation',
    description: 'Bit masks, XOR pairing, counting set bits, and constant-space binary arithmetic.',
    topic: 'Bit Manipulation',
    estimatedHours: 5,
    difficultyRange: 'Easy - Medium',
    problemIds: ['p-50', 'p-4']
  }
];
