import { DiscussionPost } from '../types';

export const SAMPLE_DISCUSSIONS: DiscussionPost[] = [
  {
    id: 'disc-1',
    title: 'Visualizing Monotonic Stack: The intuition behind Next Greater Element',
    problemId: 'p-17',
    problemTitle: 'Daily Temperatures Span',
    author: {
      id: 'user-1',
      name: 'Elena Rostova',
      username: 'elena_algo',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      levelTitle: 'Master'
    },
    content: `Many developers struggle with when to use a monotonic stack. The key intuition is **deferred resolution**:\n\nWhen we traverse temperatures from left to right, we cannot answer "when is the next warmer day?" for day \`i\` until we actually reach that warmer day in the future.\n\nSo we push day \`i\` onto a stack. As long as incoming days are cooler or equal, the stack stays decreasing. But the moment a warmer day arrives, it resolves the question for all cooler days sitting on top of the stack!\n\nThis guarantees every day index is pushed once and popped once -> **amortized O(n)** time.`,
    tags: ['Intuition', 'Stack', 'Patterns'],
    likes: 142,
    hasLiked: true,
    commentsCount: 3,
    createdAt: '2 days ago',
    comments: [
      {
        id: 'c-1',
        author: {
          id: 'user-2',
          name: 'Marcus Chen',
          username: 'marcus_c',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
        },
        content: 'Spot on explanation! The "deferred resolution" mental model also completely demystifies Trapping Rain Water and Largest Rectangle in Histogram.',
        createdAt: '1 day ago',
        likes: 28,
        hasLiked: false
      },
      {
        id: 'c-2',
        author: {
          id: 'user-4',
          name: 'Devon Patel',
          username: 'devon_p',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
        },
        content: 'This finally clicked for me after 3 failed attempts at this problem. Thank you!',
        createdAt: '18 hours ago',
        likes: 9,
        hasLiked: true
      },
      {
        id: 'c-3',
        author: {
          id: 'user-current',
          name: 'Ada Okonkwo',
          username: 'ada_codes',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
        },
        content: 'Loved the visual comparison with a physical waiting line where a tall person blocks sight.',
        createdAt: '5 hours ago',
        likes: 4,
        hasLiked: false
      }
    ]
  },
  {
    id: 'disc-2',
    title: 'Why Sliding Window shrinks from the left: A mathematical invariant approach',
    problemId: 'p-10',
    problemTitle: 'Longest Unique Substring',
    author: {
      id: 'user-2',
      name: 'Marcus Chen',
      username: 'marcus_c',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      levelTitle: 'Expert'
    },
    content: `A common pitfall when implementing sliding window algorithms is attempting to restart the search from scratch when a violation occurs (e.g. encountering a duplicate).\n\nInstead, maintain the invariant that **sub-window [left, right] is always valid** before extending right by 1.\n\nBy advancing \`left\` only as far as necessary, each element is touched at most twice: once when entering the window and once when leaving.`,
    tags: ['Sliding Window', 'Tutorial', 'Best Practice'],
    likes: 89,
    hasLiked: false,
    commentsCount: 2,
    createdAt: '4 days ago',
    comments: [
      {
        id: 'c-4',
        author: {
          id: 'user-3',
          name: 'Sophia Tanaka',
          username: 'sophia_t',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
        },
        content: 'Also, using a Hash Map of { character: last_seen_index } allows jumping the left pointer in O(1) instead of an inner while loop!',
        createdAt: '3 days ago',
        likes: 18,
        hasLiked: true
      },
      {
        id: 'c-5',
        author: {
          id: 'user-8',
          name: 'Zoe Kravitz-Miller',
          username: 'zoe_km',
          avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80'
        },
        content: 'Bookmarked for my upcoming technical interview round. Super clear!',
        createdAt: '2 days ago',
        likes: 5,
        hasLiked: false
      }
    ]
  },
  {
    id: 'disc-3',
    title: 'Google L4 Interview Experience: 3 rounds of Graphs & 1 round of Backtracking',
    author: {
      id: 'user-3',
      name: 'Sophia Tanaka',
      username: 'sophia_t',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      levelTitle: 'Expert'
    },
    content: `Just wrapped up my full loop for Google Mountain View (L4 Software Engineer). Here is a high-level debrief without breaking NDA:\n\n1. **Round 1**: Multi-source BFS on a grid with obstacle states. Similar to Pacific Atlantic Water Flow.\n2. **Round 2**: Word search variant requiring a Trie and backtracking with early boundary pruning.\n3. **Round 3**: Topological sort with cycle extraction and edge weights.\n4. **Round 4**: System design on distributed job scheduler with priority queues.\n\n**Advice**: Master the patterns rather than memorizing individual problems. When the interviewer introduced constraints mid-interview, knowing the underlying pattern made pivoting effortless!`,
    tags: ['Interview Prep', 'Google', 'Career'],
    likes: 312,
    hasLiked: true,
    commentsCount: 2,
    createdAt: '6 days ago',
    comments: [
      {
        id: 'c-6',
        author: {
          id: 'user-current',
          name: 'Ada Okonkwo',
          username: 'ada_codes',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
        },
        content: 'Congratulations Sophia! How deep did they go into testing edge cases before you started writing code?',
        createdAt: '5 days ago',
        likes: 12,
        hasLiked: false
      },
      {
        id: 'c-7',
        author: {
          id: 'user-3',
          name: 'Sophia Tanaka',
          username: 'sophia_t',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
        },
        content: '@ada_codes Very deep! I spent the first 8-10 minutes just drawing small 2x2 grids, empty inputs, disconnected components, and discussing time/space tradeoffs.',
        createdAt: '4 days ago',
        likes: 24,
        hasLiked: true
      }
    ]
  }
];
