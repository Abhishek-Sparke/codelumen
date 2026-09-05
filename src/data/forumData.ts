import { ForumSection, ForumCategory, DiscussionPost } from '../types';

export const FORUM_CATEGORIES: ForumCategory[] = [
  // LEARN & PRACTICE
  {
    id: 'cat-dsa',
    slug: 'dsa',
    sectionId: 'learn',
    name: 'DSA & Problem Solving',
    description: 'Algorithmic intuition, optimal approach discussions, and problem breakdown write-ups.',
    iconName: 'Layers',
    threadCount: 38,
    postCount: 194,
    latestThread: {
      id: 'disc-1',
      title: 'Visualizing Monotonic Stack: The intuition behind Next Greater Element',
      authorName: 'Elena Rostova',
      lastActivity: '8 min ago'
    }
  },
  {
    id: 'cat-algorithms',
    slug: 'algorithms',
    sectionId: 'learn',
    name: 'Algorithms',
    description: 'Graph traversals, Dynamic Programming proofs, divide-and-conquer, and greedy heuristics.',
    iconName: 'Cpu',
    threadCount: 29,
    postCount: 142,
    latestThread: {
      id: 'disc-2',
      title: 'Why Sliding Window shrinks from the left: A mathematical invariant approach',
      authorName: 'Marcus Chen',
      lastActivity: '24 min ago'
    }
  },
  {
    id: 'cat-data-structures',
    slug: 'data-structures',
    sectionId: 'learn',
    name: 'Data Structures',
    description: 'Binary heaps, Trie hierarchies, Segment Trees, Disjoint-Set Union (DSU), and memory layouts.',
    iconName: 'Database',
    threadCount: 21,
    postCount: 96,
    latestThread: {
      id: 'disc-3',
      title: 'Trie vs Hash Map for prefix lookups: Memory trade-offs in practice',
      authorName: 'Devon Patel',
      lastActivity: '1 hour ago'
    }
  },
  {
    id: 'cat-cp',
    slug: 'competitive-programming',
    sectionId: 'learn',
    name: 'Competitive Programming',
    description: 'Contest post-mortems, Codeforces/LeetCode rating climb methods, and fast I/O optimizations.',
    iconName: 'Trophy',
    threadCount: 17,
    postCount: 88,
    latestThread: {
      id: 'disc-4',
      title: 'CodeSpark Bi-Weekly Contest #14: Post-Contest Editorial & Key Takeaways',
      authorName: 'Alex Rivera',
      lastActivity: '3 hours ago'
    }
  },

  // PROGRAMMING
  {
    id: 'cat-python',
    slug: 'python',
    sectionId: 'programming',
    name: 'Python',
    description: 'Pythonic patterns, collections, bisect, itertools, memory profiling, and 3.14 features.',
    iconName: 'Code',
    threadCount: 45,
    postCount: 230,
    latestThread: {
      id: 'disc-5',
      title: 'Using dict vs Counter for sliding window frequency counters in Python 3',
      authorName: 'Ada Okonkwo',
      lastActivity: '12 min ago'
    }
  },
  {
    id: 'cat-cpp',
    slug: 'cpp',
    sectionId: 'programming',
    name: 'C++',
    description: 'Modern C++20/23, STL vector optimizations, fast bitsets, cache locality, and constexpr algorithms.',
    iconName: 'Terminal',
    threadCount: 34,
    postCount: 167,
    latestThread: {
      id: 'disc-6',
      title: 'Fast I/O boilerplate and custom hash for std::unordered_map to prevent anti-hash tests',
      authorName: 'Viktor Krumm',
      lastActivity: '45 min ago'
    }
  },
  {
    id: 'cat-java',
    slug: 'java',
    sectionId: 'programming',
    name: 'Java',
    description: 'Java Collections Framework, JVM heap tuning, primitive arrays vs boxed collections, and concurrency.',
    iconName: 'Coffee',
    threadCount: 26,
    postCount: 115,
    latestThread: {
      id: 'disc-7',
      title: 'Why ArrayDeque beats Stack in Java: Garbage collector and sync overhead analysis',
      authorName: 'David Kim',
      lastActivity: '2 hours ago'
    }
  },
  {
    id: 'cat-javascript',
    slug: 'javascript',
    sectionId: 'programming',
    name: 'JavaScript & TypeScript',
    description: 'V8 optimizations, TypedArrays, BigInt, event loop mechanics, and TypeScript algorithmic typings.',
    iconName: 'Braces',
    threadCount: 39,
    postCount: 184,
    latestThread: {
      id: 'disc-8',
      title: 'How to write an efficient PriorityQueue in vanilla JavaScript without external deps',
      authorName: 'Sophia Tanaka',
      lastActivity: '15 min ago'
    }
  },
  {
    id: 'cat-web-dev',
    slug: 'web-dev',
    sectionId: 'programming',
    name: 'Web Development',
    description: 'Full-stack system architecture, micro-frontends, API caching layers, and high-performance WebSockets.',
    iconName: 'Globe',
    threadCount: 19,
    postCount: 78,
    latestThread: {
      id: 'disc-9',
      title: 'Building real-time collaborative coding sessions using CRDTs and WebSockets',
      authorName: 'Liam O’Connor',
      lastActivity: '5 hours ago'
    }
  },

  // CAREER
  {
    id: 'cat-interview-prep',
    slug: 'interview-prep',
    sectionId: 'career',
    name: 'Interview Preparation',
    description: 'FAANG & Tier-1 technical loops, system design preparation, and mock interview debriefs.',
    iconName: 'Briefcase',
    threadCount: 52,
    postCount: 310,
    latestThread: {
      id: 'disc-10',
      title: 'How I structured my 45-minute Google interview loop to ensure clean code + proof',
      authorName: 'Rachel Green',
      lastActivity: '10 min ago'
    }
  },
  {
    id: 'cat-projects',
    slug: 'projects',
    sectionId: 'career',
    name: 'Projects',
    description: 'Showcase your engineering portfolio, open source repositories, and architectural reviews.',
    iconName: 'FolderGit2',
    threadCount: 22,
    postCount: 104,
    latestThread: {
      id: 'disc-11',
      title: 'Open Source: Built a distributed rate limiter in Rust & Redis with benchmark results',
      authorName: 'Tariq Al-Mansoor',
      lastActivity: '4 hours ago'
    }
  },
  {
    id: 'cat-jobs',
    slug: 'jobs',
    sectionId: 'career',
    name: 'Internships & Jobs',
    description: 'Verified opportunities, resume screening criteria, compensation negotiation, and referral threads.',
    iconName: 'Compass',
    threadCount: 31,
    postCount: 180,
    latestThread: {
      id: 'disc-12',
      title: 'Summer 2027 SWE Internship megathread: Timeline, online assessments, and interview tips',
      authorName: 'CodeSpark Team',
      lastActivity: '1 hour ago'
    }
  },
  {
    id: 'cat-career-advice',
    slug: 'career-advice',
    sectionId: 'career',
    name: 'Career Advice',
    description: 'Leveling from Mid-level to Staff, handling burnout, engineering habits, and technical leadership.',
    iconName: 'Lightbulb',
    threadCount: 28,
    postCount: 147,
    latestThread: {
      id: 'disc-13',
      title: 'The shift from writing code to defining architecture: Lessons from a Staff Engineer',
      authorName: 'Marcus Chen',
      lastActivity: '6 hours ago'
    }
  },

  // COMMUNITY
  {
    id: 'cat-introductions',
    slug: 'introductions',
    sectionId: 'community',
    name: 'Introductions',
    description: 'Welcome to CodeSpark! Introduce yourself, your technical background, and current goals.',
    iconName: 'Users',
    threadCount: 65,
    postCount: 389,
    latestThread: {
      id: 'disc-14',
      title: 'Hi everyone! Transitioning from mechanical engineering to distributed systems',
      authorName: 'Maya Lin',
      lastActivity: '30 min ago'
    }
  },
  {
    id: 'cat-general',
    slug: 'general',
    sectionId: 'community',
    name: 'General Discussion',
    description: 'Developer workspace setups, hardware ergonomics, favorite terminal fonts, and tech news.',
    iconName: 'MessageSquare',
    threadCount: 42,
    postCount: 212,
    latestThread: {
      id: 'disc-15',
      title: 'Mechanical keyboard setups vs silent switches for intense algorithmic focus sessions',
      authorName: 'Zoe Kravitz-Miller',
      lastActivity: '2 hours ago'
    }
  },
  {
    id: 'cat-feedback',
    slug: 'feedback',
    sectionId: 'community',
    name: 'CodeSpark Feedback',
    description: 'Feature requests, bug reports, roadmap improvements, and execution sandbox suggestions.',
    iconName: 'Sparkles',
    threadCount: 33,
    postCount: 165,
    latestThread: {
      id: 'disc-16',
      title: 'Feature Request: Keyboard shortcut customization for Run (Ctrl+Enter) & Submit',
      authorName: 'Abhishek',
      lastActivity: '18 min ago'
    }
  },
  {
    id: 'cat-off-topic',
    slug: 'off-topic',
    sectionId: 'community',
    name: 'Off Topic',
    description: 'Casual banter, coffee brewing methods, sci-fi book recommendations, and weekend gaming.',
    iconName: 'Coffee',
    threadCount: 24,
    postCount: 120,
    latestThread: {
      id: 'disc-17',
      title: 'Favorite sci-fi books that explore distributed consciousness and computing',
      authorName: 'Elena Rostova',
      lastActivity: '1 day ago'
    }
  }
];

export const FORUM_SECTIONS: ForumSection[] = [
  {
    id: 'learn',
    title: 'LEARN & PRACTICE',
    description: 'Algorithmic mastery, data structure deep dives, and competitive problem solving.',
    categories: FORUM_CATEGORIES.filter(c => c.sectionId === 'learn')
  },
  {
    id: 'programming',
    title: 'PROGRAMMING',
    description: 'Language-specific paradigms, standard libraries, runtime optimizations, and web systems.',
    categories: FORUM_CATEGORIES.filter(c => c.sectionId === 'programming')
  },
  {
    id: 'career',
    title: 'CAREER',
    description: 'Interview loops, portfolio projects, internship trackers, and engineering growth.',
    categories: FORUM_CATEGORIES.filter(c => c.sectionId === 'career')
  },
  {
    id: 'community',
    title: 'COMMUNITY',
    description: 'Developer introductions, platform suggestions, and collaborative conversations.',
    categories: FORUM_CATEGORIES.filter(c => c.sectionId === 'community')
  }
];

export const INITIAL_FORUM_POSTS: DiscussionPost[] = [
  {
    id: 'disc-1',
    slug: 'visualizing-monotonic-stack',
    title: 'Visualizing Monotonic Stack: The intuition behind Next Greater Element',
    categoryId: 'cat-dsa',
    categoryName: 'DSA & Problem Solving',
    sectionId: 'learn',
    problemId: 'p-17',
    problemTitle: 'Daily Temperatures Span',
    author: {
      id: 'user-elena',
      name: 'Elena Rostova',
      username: 'elena_algo',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      role: 'Moderator',
      joinedDate: 'Jan 2025',
      postCount: 218,
      levelTitle: 'Master',
      xp: 2840,
      problemsSolved: 42
    },
    content: `Many developers struggle with when to use a monotonic stack. The key intuition is **deferred resolution**:

When we traverse temperatures from left to right, we cannot answer *"when is the next warmer day?"* for day \`i\` until we actually reach that warmer day in the future.

So we push day \`i\` onto a stack. As long as incoming days are cooler or equal, the stack stays decreasing. But the moment a warmer day arrives, it resolves the question for all cooler days sitting on top of the stack!

\`\`\`python
def dailyTemperatures(temperatures: list[int]) -> list[int]:
    n = len(temperatures)
    ans = [0] * n
    stack = []  # stores indices of days

    for i, temp in enumerate(temperatures):
        # Resolve all cooler days currently on the stack
        while stack and temperatures[stack[-1]] < temp:
            prev_day = stack.pop()
            ans[prev_day] = i - prev_day
        stack.append(i)

    return ans
\`\`\`

### Complexity Invariant
This guarantees every day index is pushed once and popped once -> **amortized O(n)** time and **O(n)** auxiliary space.

Does anyone have tips for adapting this to circular array variants?`,
    tags: ['Monotonic Stack', 'Intuition', 'Patterns', 'Python'],
    likes: 34,
    hasLiked: true,
    reactions: {
      like: ['user-elena', 'user-marcus', 'user-ada'],
      love: ['user-sophia', 'user-devon'],
      helpful: ['user-alex', 'user-elena', 'user-marcus', 'user-devon'],
      great: ['user-marcus', 'user-alex']
    },
    commentsCount: 3,
    views: 482,
    createdAt: 'Apr 28, 2026',
    lastActivityAt: '8 min ago',
    isPinned: true,
    isLocked: false,
    watchedByUserIds: ['user-elena', 'user-marcus'],
    bookmarkedByUserIds: ['user-elena'],
    comments: [
      {
        id: 'c-1',
        postNumber: 2,
        author: {
          id: 'user-marcus',
          name: 'Marcus Chen',
          username: 'marcus_c',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
          role: 'Contributor',
          joinedDate: 'Feb 2025',
          postCount: 147,
          levelTitle: 'Staff Engineer',
          xp: 1950,
          problemsSolved: 35
        },
        content: `Spot on explanation! The "deferred resolution" mental model also completely demystifies **Trapping Rain Water** and **Largest Rectangle in Histogram**.

> For the circular array question:
You can simply loop through the array twice using the modulo operator \`i % n\`:

\`\`\`python
for i in range(2 * n):
    curr = temperatures[i % n]
    while stack and temperatures[stack[-1]] < curr:
        ans[stack.pop()] = i % n
    if i < n:
        stack.append(i)
\`\`\`
This lets you look forward into the wrapped section without duplicating the actual memory buffer!`,
        createdAt: 'Apr 28, 2026 · 14:10',
        likes: 18,
        hasLiked: false,
        reactions: {
          like: ['user-elena', 'user-sophia'],
          love: ['user-elena'],
          helpful: ['user-elena', 'user-ada', 'user-devon'],
          great: ['user-ada']
        },
        replyToPostNumber: 1,
        replyToAuthor: 'elena_algo'
      },
      {
        id: 'c-2',
        postNumber: 3,
        author: {
          id: 'user-devon',
          name: 'Devon Patel',
          username: 'devon_p',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
          role: 'Member',
          joinedDate: 'Mar 2026',
          postCount: 42,
          levelTitle: 'Practitioner',
          xp: 820,
          problemsSolved: 14
        },
        content: `This finally clicked for me after 3 failed attempts at this problem during a live mock interview.

The physical analogy of a **decreasing wall where a taller building immediately unblocks sightlines** made the pop condition 100% intuitive. Thank you both!`,
        createdAt: 'Apr 28, 2026 · 15:45',
        likes: 7,
        hasLiked: false,
        reactions: {
          like: ['user-elena'],
          love: ['user-elena'],
          helpful: ['user-marcus'],
          great: []
        },
        replyToPostNumber: 1,
        replyToAuthor: 'elena_algo'
      },
      {
        id: 'c-3',
        postNumber: 4,
        author: {
          id: 'user-ada',
          name: 'Ada Okonkwo',
          username: 'ada_codes',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          role: 'Member',
          joinedDate: 'Apr 2026',
          postCount: 19,
          levelTitle: 'Explorer',
          xp: 450,
          problemsSolved: 8
        },
        content: `One small detail to watch out for in C++ vs Python: in C++, \`std::vector\` with \`reserve(n)\` avoids dynamic reallocations, shaving off about 12ms in CodeSpark execution runs!`,
        createdAt: '8 min ago',
        likes: 5,
        hasLiked: false,
        reactions: {
          like: ['user-marcus'],
          love: [],
          helpful: ['user-elena', 'user-marcus'],
          great: ['user-elena']
        },
        replyToPostNumber: 2,
        replyToAuthor: 'marcus_c'
      }
    ]
  },
  {
    id: 'disc-2',
    slug: 'sliding-window-invariants',
    title: 'Why Sliding Window shrinks from the left: A mathematical invariant approach',
    categoryId: 'cat-algorithms',
    categoryName: 'Algorithms',
    sectionId: 'learn',
    problemId: 'p-10',
    problemTitle: 'Longest Unique Substring',
    author: {
      id: 'user-marcus',
      name: 'Marcus Chen',
      username: 'marcus_c',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      role: 'Contributor',
      joinedDate: 'Feb 2025',
      postCount: 147,
      levelTitle: 'Staff Engineer',
      xp: 1950,
      problemsSolved: 35
    },
    content: `A common pitfall when implementing sliding window algorithms is attempting to restart the search from scratch whenever a violation occurs (e.g. encountering a duplicate character).

Instead, maintain the invariant that **sub-window \`[left, right]\` is always valid** before extending \`right\` by 1:

\`\`\`javascript
function lengthOfLongestSubstring(s) {
    const lastSeen = new Map();
    let maxLen = 0;
    let left = 0;

    for (let right = 0; right < s.length; right++) {
        const char = s[right];
        if (lastSeen.has(char) && lastSeen.get(char) >= left) {
            // Jump left pointer forward past the duplicate
            left = lastSeen.get(char) + 1;
        }
        lastSeen.set(char, right);
        maxLen = Math.max(maxLen, right - left + 1);
    }
    return maxLen;
}
\`\`\`

By advancing \`left\` only as far as necessary, each element is touched at most twice: once when entering the window and once when leaving.`,
    tags: ['Sliding Window', 'Invariants', 'JavaScript', 'Algorithms'],
    likes: 27,
    hasLiked: false,
    reactions: {
      like: ['user-elena', 'user-sophia'],
      love: ['user-sophia'],
      helpful: ['user-elena', 'user-devon', 'user-ada'],
      great: ['user-elena']
    },
    commentsCount: 2,
    views: 318,
    createdAt: 'Apr 26, 2026',
    lastActivityAt: '24 min ago',
    isPinned: false,
    isLocked: false,
    watchedByUserIds: ['user-marcus'],
    bookmarkedByUserIds: [],
    comments: [
      {
        id: 'c-201',
        postNumber: 2,
        author: {
          id: 'user-sophia',
          name: 'Sophia Tanaka',
          username: 'sophia_t',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
          role: 'Contributor',
          joinedDate: 'Jan 2025',
          postCount: 112,
          levelTitle: 'Lead',
          xp: 2100,
          problemsSolved: 39
        },
        content: `The \`lastSeen.get(char) >= left\` check is the most critical line here! If you forget it, \`left\` might jump backward to an older duplicate outside the current window. Excellent writeup Marcus.`,
        createdAt: 'Apr 26, 2026 · 18:30',
        likes: 12,
        hasLiked: false,
        reactions: {
          like: ['user-marcus', 'user-elena'],
          love: [],
          helpful: ['user-marcus'],
          great: []
        },
        replyToPostNumber: 1,
        replyToAuthor: 'marcus_c'
      },
      {
        id: 'c-202',
        postNumber: 3,
        author: {
          id: 'user-alex',
          name: 'Alex Rivera',
          username: 'alex_r',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          role: 'Admin',
          joinedDate: 'Nov 2024',
          postCount: 340,
          levelTitle: 'Principal',
          xp: 3800,
          problemsSolved: 50
        },
        content: `Pinned this in the #algorithms category! We see over 40% of first-time submissions fail on the test case \`"tmmzuxt"\` specifically because of the backward-jumping left pointer.`,
        createdAt: '24 min ago',
        likes: 15,
        hasLiked: true,
        reactions: {
          like: ['user-marcus', 'user-sophia'],
          love: ['user-marcus'],
          helpful: ['user-marcus', 'user-elena'],
          great: ['user-sophia']
        },
        replyToPostNumber: 1,
        replyToAuthor: 'marcus_c'
      }
    ]
  },
  {
    id: 'disc-10',
    slug: 'faang-interview-loop-structure',
    title: 'How I structured my 45-minute Google interview loop to ensure clean code + proof',
    categoryId: 'cat-interview-prep',
    categoryName: 'Interview Preparation',
    sectionId: 'career',
    author: {
      id: 'user-rachel',
      name: 'Rachel Green',
      username: 'rachel_g',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      role: 'Contributor',
      joinedDate: 'Dec 2024',
      postCount: 88,
      levelTitle: 'Senior SWE',
      xp: 1720,
      problemsSolved: 31
    },
    content: `After interviewing at Meta, Google, and Databricks this quarter and receiving 3 offers, I converged on a repeatable 45-minute game plan:

* **0:00 - 5:00 (Clarify & Constraints)**: Ask about input sizes ($N \le 10^5$), edge cases (empty list, duplicates, negative numbers), and memory constraints.
* **5:00 - 15:00 (State Invariants & Agree on Approach)**: Propose brute force ($O(N^2)$), then optimize ($O(N \log N)$ or $O(N)$). Do NOT write code yet until the interviewer actively signs off!
* **15:00 - 32:00 (Clean Code Implementation)**: Modular code with descriptive variable names.
* **32:00 - 40:00 (Dry Run with Test Matrix)**: Trace through with normal case, empty case, and boundary case.
* **40:00 - 45:00 (Complexity & Follow-ups)**: State exact time and space complexity with proof.

Practicing the 45-minute timer on CodeSpark problems with full Run/Submit validation made the real interview feel like muscle memory.`,
    tags: ['Interview Prep', 'Career', 'Strategy', 'FAANG'],
    likes: 62,
    hasLiked: true,
    reactions: {
      like: ['user-elena', 'user-marcus', 'user-sophia', 'user-alex'],
      love: ['user-marcus', 'user-sophia'],
      helpful: ['user-elena', 'user-devon', 'user-ada', 'user-marcus'],
      great: ['user-alex', 'user-sophia']
    },
    commentsCount: 1,
    views: 745,
    createdAt: 'Apr 25, 2026',
    lastActivityAt: '10 min ago',
    isPinned: true,
    isLocked: false,
    watchedByUserIds: ['user-rachel', 'user-marcus'],
    bookmarkedByUserIds: ['user-rachel'],
    comments: [
      {
        id: 'c-301',
        postNumber: 2,
        author: {
          id: 'user-alex',
          name: 'Alex Rivera',
          username: 'alex_r',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          role: 'Admin',
          joinedDate: 'Nov 2024',
          postCount: 340,
          levelTitle: 'Principal',
          xp: 3800,
          problemsSolved: 50
        },
        content: `As someone who conducts over 50 technical interviews a year, point #2 is where 70% of candidates fail. Candidates who jump straight into coding before dry-running their logic almost always get stuck midway and run out of time.

Bookmarking this post for everyone preparing for the upcoming hiring cycles!`,
        createdAt: '10 min ago',
        likes: 24,
        hasLiked: true,
        reactions: {
          like: ['user-rachel', 'user-elena'],
          love: ['user-rachel'],
          helpful: ['user-rachel', 'user-marcus', 'user-devon'],
          great: ['user-rachel']
        },
        replyToPostNumber: 1,
        replyToAuthor: 'rachel_g'
      }
    ]
  },
  {
    id: 'disc-16',
    slug: 'custom-keyboard-shortcuts-feedback',
    title: 'Feature Request: Keyboard shortcut customization for Run (Ctrl+Enter) & Submit',
    categoryId: 'cat-feedback',
    categoryName: 'CodeSpark Feedback',
    sectionId: 'community',
    author: {
      id: 'user-current',
      name: 'Abhishek',
      username: 'abhishek_code',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      role: 'Member',
      joinedDate: 'Mar 2026',
      postCount: 15,
      levelTitle: 'Scholar',
      xp: 680,
      problemsSolved: 11
    },
    content: `First off, the Phase 3 real code execution and sandboxing is super snappy!

Would it be possible to add customizable keybindings in Settings? For instance:
* \`Ctrl + Enter\` to Run
* \`Ctrl + Shift + Enter\` to Submit
* Vim keybinding mode for the code editor

Keep up the incredible work!`,
    tags: ['Feedback', 'Feature Request', 'Editor'],
    likes: 19,
    hasLiked: false,
    reactions: {
      like: ['user-marcus', 'user-elena'],
      love: [],
      helpful: ['user-alex'],
      great: ['user-alex']
    },
    commentsCount: 1,
    views: 160,
    createdAt: 'Apr 27, 2026',
    lastActivityAt: '18 min ago',
    isPinned: false,
    isLocked: false,
    watchedByUserIds: ['user-current'],
    bookmarkedByUserIds: [],
    comments: [
      {
        id: 'c-401',
        postNumber: 2,
        author: {
          id: 'user-alex',
          name: 'Alex Rivera',
          username: 'alex_r',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          role: 'Admin',
          joinedDate: 'Nov 2024',
          postCount: 340,
          levelTitle: 'Principal',
          xp: 3800,
          problemsSolved: 50
        },
        content: `Hey Abhishek! \`Ctrl+Enter\` for Run and \`Ctrl+Shift+Enter\` for Submit are already baked into the workspace! Vim emulation mode is currently on our Phase 4 roadmap. Thanks for the great feedback!`,
        createdAt: '18 min ago',
        likes: 9,
        hasLiked: false,
        reactions: {
          like: ['user-current'],
          love: ['user-current'],
          helpful: ['user-current'],
          great: []
        },
        replyToPostNumber: 1,
        replyToAuthor: 'abhishek_code'
      }
    ]
  }
];
