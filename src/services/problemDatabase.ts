import { 
  Problem, SupportedLanguage, TopicRecord, PatternRecord, 
  RoadmapRecord, RoadmapSectionRecord,
  ProblemHintRecord
} from '../types';
import { ALL_PROBLEMS } from '../data/problems';
import { PATTERNS_DATA } from '../data/patterns';
import { StorageService } from './storage';

// =============================================================================
// RELATIONAL TOPICS REPOSITORY
// =============================================================================
export const TOPICS_DATA: TopicRecord[] = [
  { id: 'foundations', name: 'Foundations', slug: 'foundations', description: 'Core algorithmic thinking, time and space complexity, and basic data structures.' },
  { id: 'arrays', name: 'Arrays & Hashing', slug: 'arrays', description: 'Contiguous memory buffers, fast hash lookups, frequency counters, and prefix arrays.' },
  { id: 'two-pointers', name: 'Two Pointers', slug: 'two-pointers', description: 'Converging or symmetric indices for sorted scans and window bounds.' },
  { id: 'sliding-window', name: 'Sliding Window', slug: 'sliding-window', description: 'Dynamic subarray boundaries for optimal contiguous segments.' },
  { id: 'stack', name: 'Stack', slug: 'stack', description: 'LIFO evaluation, parentheses balancing, and monotonic next-greater searches.' },
  { id: 'binary-search', name: 'Binary Search', slug: 'binary-search', description: 'Logarithmic search halving on monotonic domains and sorted sequences.' },
  { id: 'linked-list', name: 'Linked List', slug: 'linked-list', description: 'Pointer traversal, reversal, sentinel heads, and cycle detection.' },
  { id: 'trees', name: 'Trees', slug: 'trees', description: 'Hierarchical node traversal, recursive DFS, level-order BFS, and BST invariants.' },
  { id: 'heap', name: 'Heap / Priority Queue', slug: 'heap', description: 'Min/max heaps for Top-K extraction, running medians, and priority scheduling.' },
  { id: 'backtracking', name: 'Backtracking', slug: 'backtracking', description: 'Exhaustive combinatorial generation, branch pruning, and state exploration.' },
  { id: 'graphs', name: 'Graphs', slug: 'graphs', description: 'Adjacency lists, shortest paths, connected components, and topological orderings.' },
  { id: 'greedy', name: 'Greedy', slug: 'greedy', description: 'Locally optimal decisions leading to global optimums without backtracking.' },
  { id: 'intervals', name: 'Intervals', slug: 'intervals', description: 'Merging overlapping spans, meeting room schedules, and range sweeps.' },
  { id: 'dynamic-programming', name: 'Dynamic Programming', slug: 'dynamic-programming', description: 'Overlapping subproblem memoization and bottom-up state transitions.' },
  { id: 'bit-manipulation', name: 'Bit Manipulation', slug: 'bit-manipulation', description: 'Bitwise masks, XOR identities, binary bit counting, and shifts.' }
];

// =============================================================================
// RELATIONAL PATTERNS REPOSITORY
// =============================================================================
export const PATTERNS_LIST: PatternRecord[] = PATTERNS_DATA.map(p => ({
  id: p.id,
  name: p.title,
  slug: p.slug,
  description: p.summary,
  when_to_use: p.whenToUse,
  common_signals: p.howToRecognize,
  created_at: '2026-01-01T00:00:00Z'
}));

// =============================================================================
// 15 STRUCTURED ROADMAP SECTIONS (SECTION 13 SPECIFICATION)
// =============================================================================
export const MAIN_ROADMAP: RoadmapRecord = {
  id: 'dsa-interview-roadmap',
  name: 'DSA Interview Roadmap',
  slug: 'dsa-interview-roadmap',
  description: 'A structured, deliberate progression covering all foundational to advanced algorithmic patterns for technical mastery.',
  created_at: '2026-01-01T00:00:00Z'
};

export const ROADMAP_SECTIONS_DATA: RoadmapSectionRecord[] = [
  { id: 'sec-01', roadmap_id: 'dsa-interview-roadmap', position: 1, name: '01 Foundations', description: 'Algorithmic time/space complexity, memory model, and basic arrays.' },
  { id: 'sec-02', roadmap_id: 'dsa-interview-roadmap', position: 2, name: '02 Arrays & Hashing', description: 'Hash sets, hash maps, frequency tables, and prefix sums.' },
  { id: 'sec-03', roadmap_id: 'dsa-interview-roadmap', position: 3, name: '03 Two Pointers', description: 'Converging left/right pointers, sorted pairs, and palindromes.' },
  { id: 'sec-04', roadmap_id: 'dsa-interview-roadmap', position: 4, name: '04 Sliding Window', description: 'Dynamic contiguous subarrays, longest substrings, and window state.' },
  { id: 'sec-05', roadmap_id: 'dsa-interview-roadmap', position: 5, name: '05 Stack', description: 'LIFO structures, parentheses validation, and monotonic stacks.' },
  { id: 'sec-06', roadmap_id: 'dsa-interview-roadmap', position: 6, name: '06 Binary Search', description: 'Logarithmic division, rotated arrays, and binary search on answers.' },
  { id: 'sec-07', roadmap_id: 'dsa-interview-roadmap', position: 7, name: '07 Linked List', description: 'Pointers, list reversal, fast & slow pointers, and cycle detection.' },
  { id: 'sec-08', roadmap_id: 'dsa-interview-roadmap', position: 8, name: '08 Trees', description: 'Binary trees, DFS traversals, BFS level-order, and BST properties.' },
  { id: 'sec-09', roadmap_id: 'dsa-interview-roadmap', position: 9, name: '09 Heap / Priority Queue', description: 'Top-K frequent items, running stream medians, and heap sort.' },
  { id: 'sec-10', roadmap_id: 'dsa-interview-roadmap', position: 10, name: '10 Backtracking', description: 'Subsets, permutations, combinations, and board searches.' },
  { id: 'sec-11', roadmap_id: 'dsa-interview-roadmap', position: 11, name: '11 Graphs', description: 'BFS/DFS on adjacency lists, connected components, and topological sort.' },
  { id: 'sec-12', roadmap_id: 'dsa-interview-roadmap', position: 12, name: '12 Greedy', description: 'Optimal local choices, interval partitioning, and jump games.' },
  { id: 'sec-13', roadmap_id: 'dsa-interview-roadmap', position: 13, name: '13 Intervals', description: 'Interval overlap detection, merging ranges, and schedule conflicts.' },
  { id: 'sec-14', roadmap_id: 'dsa-interview-roadmap', position: 14, name: '14 Dynamic Programming', description: 'Memoization, 1D/2D tabulations, knapsack variants, and LCS.' },
  { id: 'sec-15', roadmap_id: 'dsa-interview-roadmap', position: 15, name: '15 Bit Manipulation', description: 'Bit masks, XOR identities, binary Hamming weights, and arithmetic.' }
];

// Mapping problems to roadmap sections
export const ROADMAP_PROBLEMS_MAPPING: Record<string, string[]> = {
  'sec-01': ['p-1', 'p-2'],
  'sec-02': ['p-1', 'p-2', 'p-3', 'p-4', 'p-5'],
  'sec-03': ['p-6', 'p-7', 'p-8', 'p-18', 'p-19'],
  'sec-04': ['p-9', 'p-10', 'p-11', 'p-12', 'p-13'],
  'sec-05': ['p-14', 'p-15', 'p-16', 'p-17', 'p-37'],
  'sec-06': ['p-24', 'p-25', 'p-26', 'p-27', 'p-28'],
  'sec-07': ['p-20', 'p-21', 'p-22', 'p-23'],
  'sec-08': ['p-29', 'p-30', 'p-31', 'p-32', 'p-33'],
  'sec-09': ['p-36', 'p-37', 'p-51', 'p-52'],
  'sec-10': ['p-47', 'p-48', 'p-49', 'p-53'],
  'sec-11': ['p-38', 'p-39', 'p-40', 'p-54', 'p-55'],
  'sec-12': ['p-3', 'p-8', 'p-56', 'p-57'],
  'sec-13': ['p-7', 'p-18', 'p-58', 'p-59'],
  'sec-14': ['p-41', 'p-42', 'p-43', 'p-44', 'p-45', 'p-46'],
  'sec-15': ['p-50', 'p-4', 'p-60', 'p-61']
};

export const ProblemDatabase = {
  /**
   * Retrieves all topics
   */
  getTopics(): TopicRecord[] {
    return TOPICS_DATA;
  },

  /**
   * Retrieves all patterns
   */
  getPatterns(): PatternRecord[] {
    return PATTERNS_LIST;
  },

  /**
   * Retrieves a pattern by its slug
   */
  getPatternBySlug(slug: string): PatternRecord | undefined {
    return PATTERNS_LIST.find(p => p.slug === slug || p.id === slug);
  },

  /**
   * Retrieves a problem by its unique ID
   */
  getProblemById(id: string): Problem | undefined {
    const p = ALL_PROBLEMS.find(prob => prob.id === id);
    if (!p) return undefined;
    return {
      ...p,
      estimatedTime: p.estimatedTime || (p.difficulty === 'Easy' ? '10 min' : p.difficulty === 'Medium' ? '20 min' : '35 min')
    };
  },

  /**
   * Retrieves a problem by its URL slug
   */
  getProblemBySlug(slug: string): Problem | undefined {
    const p = ALL_PROBLEMS.find(prob => prob.slug === slug || prob.id === slug);
    if (!p) return undefined;
    return {
      ...p,
      estimatedTime: p.estimatedTime || (p.difficulty === 'Easy' ? '10 min' : p.difficulty === 'Medium' ? '20 min' : '35 min')
    };
  },

  /**
   * Indexed and filtered problem search query
   */
  getProblems(options: {
    search?: string;
    difficulty?: string;
    topic?: string;
    pattern?: string;
    status?: 'all' | 'unsolved' | 'solved' | 'attempted' | 'saved';
    estimatedTime?: string;
    page?: number;
    limit?: number;
    userId?: string;
  } = {}): {
    problems: (Problem & { userStatus: 'unattempted' | 'attempted' | 'solved'; isSaved: boolean })[];
    total: number;
    page: number;
    totalPages: number;
  } {
    const {
      search = '',
      difficulty = 'all',
      topic = 'all',
      pattern = 'all',
      status = 'all',
      page = 1,
      limit = 100,
      userId
    } = options;

    const userProgressMap = userId ? StorageService.getAllUserProblemProgress(userId) : {};
    const savedIds = userId ? StorageService.getSavedProblemIds(userId) : [];

    const query = search.toLowerCase().trim();

    let filtered = ALL_PROBLEMS.map(p => {
      const prog = userProgressMap[p.id];
      const userStatus: 'unattempted' | 'attempted' | 'solved' = prog?.status || 'unattempted';
      const isSaved = savedIds.includes(p.id);
      return {
        ...p,
        estimatedTime: p.estimatedTime || (p.difficulty === 'Easy' ? '10 min' : p.difficulty === 'Medium' ? '20 min' : '35 min'),
        userStatus,
        isSaved
      };
    });

    // 1. Text Search across Title, Description, Topic, Pattern
    if (query) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.topic.toLowerCase().includes(query) ||
        p.pattern.toLowerCase().includes(query)
      );
    }

    // 2. Difficulty Filter
    if (difficulty && difficulty !== 'all') {
      filtered = filtered.filter(p => p.difficulty.toLowerCase() === difficulty.toLowerCase());
    }

    // 3. Topic Filter
    if (topic && topic !== 'all') {
      filtered = filtered.filter(p => 
        p.topic.toLowerCase() === topic.toLowerCase() || 
        p.topic.toLowerCase().includes(topic.toLowerCase())
      );
    }

    // 4. Pattern Filter
    if (pattern && pattern !== 'all') {
      filtered = filtered.filter(p => 
        p.pattern.toLowerCase() === pattern.toLowerCase() ||
        p.pattern.toLowerCase().includes(pattern.toLowerCase())
      );
    }

    // 5. Status Filter
    if (status && status !== 'all') {
      if (status === 'solved') {
        filtered = filtered.filter(p => p.userStatus === 'solved');
      } else if (status === 'attempted') {
        filtered = filtered.filter(p => p.userStatus === 'attempted');
      } else if (status === 'unsolved') {
        filtered = filtered.filter(p => p.userStatus !== 'solved');
      } else if (status === 'saved') {
        filtered = filtered.filter(p => p.isSaved);
      }
    }

    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const offset = (page - 1) * limit;
    const paginated = filtered.slice(offset, offset + limit);

    return {
      problems: paginated,
      total,
      page,
      totalPages
    };
  },

  /**
   * Retrieves full roadmap with authenticated user progress
   */
  getRoadmapWithProgress(userId: string, userLevel: string = 'Beginner') {
    const userProgressMap = StorageService.getAllUserProblemProgress(userId);

    let totalProblemsCount = 0;
    let totalSolvedCount = 0;

    const sections = ROADMAP_SECTIONS_DATA.map(sec => {
      const problemIds = ROADMAP_PROBLEMS_MAPPING[sec.id] || [];
      const problemsWithStatus = problemIds.map(pid => {
        const prob = this.getProblemById(pid);
        const prog = userProgressMap[pid];
        const status = prog?.status || 'unattempted';
        return {
          id: pid,
          title: prob?.title || pid,
          slug: prob?.slug || pid,
          difficulty: prob?.difficulty || 'Easy',
          estimatedTime: prob?.estimatedTime || '15 min',
          status,
          isSolved: status === 'solved',
          isAttempted: status === 'attempted',
          is_required: true
        };
      });

      const sectionSolved = problemsWithStatus.filter(p => p.isSolved).length;
      const sectionTotal = problemsWithStatus.length;
      totalProblemsCount += sectionTotal;
      totalSolvedCount += sectionSolved;

      const progressPercent = sectionTotal > 0 ? Math.round((sectionSolved / sectionTotal) * 100) : 0;
      const isCompleted = sectionTotal > 0 && sectionSolved === sectionTotal;

      return {
        ...sec,
        problems: problemsWithStatus,
        totalProblems: sectionTotal,
        solvedProblems: sectionSolved,
        progressPercent,
        isCompleted
      };
    });

    // Determine current active section based on user progress and experience level
    let currentSectionId = sections[0].id;

    // If zero solves, set starting section by experience level without creating fake solves
    if (totalSolvedCount === 0) {
      if (userLevel === 'Advanced') {
        currentSectionId = 'sec-08'; // Trees
      } else if (userLevel === 'Intermediate') {
        currentSectionId = 'sec-02'; // Arrays & Hashing
      } else {
        currentSectionId = 'sec-01'; // Foundations
      }
    } else {
      // Find the first non-completed section
      const activeSec = sections.find(s => !s.isCompleted);
      if (activeSec) currentSectionId = activeSec.id;
      else currentSectionId = sections[sections.length - 1].id;
    }

    const overallProgress = totalProblemsCount > 0 
      ? Math.round((totalSolvedCount / totalProblemsCount) * 100) 
      : 0;

    return {
      roadmap: MAIN_ROADMAP,
      sections,
      totalProblemsCount,
      totalSolvedCount,
      overallProgress,
      currentSectionId
    };
  },

  /**
   * Retrieves progressive hints for a problem
   */
  getProblemHints(problemId: string): ProblemHintRecord[] {
    const prob = this.getProblemById(problemId);
    if (!prob || !prob.hints) return [];
    return prob.hints.map((h, idx) => ({
      id: `hint-${problemId}-${idx + 1}`,
      problem_id: problemId,
      hint_number: idx + 1,
      content: `${h.title}: ${h.content}`
    }));
  },

  /**
   * Retrieves starter code for a specific language
   */
  getStarterCode(problemId: string, language: SupportedLanguage): string {
    const prob = this.getProblemById(problemId);
    if (!prob) return '';
    if (prob.starterCode && prob.starterCode[language]) {
      return prob.starterCode[language];
    }
    return prob.starterCode?.python || '';
  },

  /**
   * Retrieves related problems prioritizing the same pattern
   */
  getRelatedProblems(problemId: string, limit: number = 3): Problem[] {
    const prob = this.getProblemById(problemId);
    if (!prob) return [];

    // 1. Prioritize problems with same pattern
    const samePattern = ALL_PROBLEMS.filter(p => 
      p.id !== problemId && p.pattern.toLowerCase() === prob.pattern.toLowerCase()
    );

    // 2. Then same topic
    const sameTopic = ALL_PROBLEMS.filter(p => 
      p.id !== problemId && 
      p.topic.toLowerCase() === prob.topic.toLowerCase() && 
      !samePattern.some(sp => sp.id === p.id)
    );

    const candidates = [...samePattern, ...sameTopic];
    return candidates.slice(0, limit);
  },

  /**
   * Computes the recommended next problem
   */
  getRecommendedNextProblem(currentProblemId: string, userId?: string): Problem | undefined {
    const current = this.getProblemById(currentProblemId);
    const userProgressMap = userId ? StorageService.getAllUserProblemProgress(userId) : {};

    // 1. Next problem in the same roadmap section that is unsolved
    for (const [secId, pids] of Object.entries(ROADMAP_PROBLEMS_MAPPING)) {
      if (pids.includes(currentProblemId)) {
        const nextInSec = pids.find(pid => pid !== currentProblemId && userProgressMap[pid]?.status !== 'solved');
        if (nextInSec) {
          const p = this.getProblemById(nextInSec);
          if (p) return p;
        }
      }
    }

    // 2. Next problem of the same pattern
    if (current) {
      const nextPattern = ALL_PROBLEMS.find(p => 
        p.id !== currentProblemId && 
        p.pattern.toLowerCase() === current.pattern.toLowerCase() &&
        userProgressMap[p.id]?.status !== 'solved'
      );
      if (nextPattern) return nextPattern;
    }

    // 3. Any unsolved problem
    const fallback = ALL_PROBLEMS.find(p => 
      p.id !== currentProblemId && userProgressMap[p.id]?.status !== 'solved'
    );
    return fallback || ALL_PROBLEMS[0];
  }
};
