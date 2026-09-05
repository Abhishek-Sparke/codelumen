import { UserProfile, Submission, DiscussionPost, NotificationItem } from '../types';
import { SAMPLE_USERS } from '../data/users';
import { SAMPLE_DISCUSSIONS } from '../data/discussions';
import { calculateLevel } from '../data/badges';

const STORAGE_KEYS = {
  CURRENT_USER: 'codelumen_current_user',
  ALL_USERS: 'codelumen_all_users',
  SUBMISSIONS: 'codelumen_submissions',
  DISCUSSIONS: 'codelumen_discussions',
  NOTIFICATIONS: 'codelumen_notifications',
  SETTINGS: 'codelumen_settings'
};

export interface EditorSettings {
  fontSize: number;
  tabSize: number;
  theme: 'lumen-dark' | 'obsidian' | 'monokai';
  wordWrap: boolean;
  autoSave: boolean;
  appearance: 'dark' | 'dim' | 'system';
}

const DEFAULT_SETTINGS: EditorSettings = {
  fontSize: 14,
  tabSize: 2,
  theme: 'lumen-dark',
  wordWrap: true,
  autoSave: true,
  appearance: 'dark'
};

const INITIAL_SUBMISSIONS: Submission[] = [
  {
    id: 'sub-1',
    problemId: 'p-1',
    problemTitle: 'Pair Sum Target',
    difficulty: 'Easy',
    language: 'python',
    status: 'Accepted',
    runtimeMs: 54,
    memoryMb: 14.8,
    timestamp: 'Yesterday at 18:42',
    code: `def pair_sum_target(nums: list[int], target: int) -> list[int]:\n    seen = {}\n    for i, n in enumerate(nums):\n        comp = target - n\n        if comp in seen:\n            return [seen[comp], i]\n        seen[n] = i\n    return []`,
    passedTestCases: 3,
    totalTestCases: 3
  },
  {
    id: 'sub-2',
    problemId: 'p-6',
    problemTitle: 'Valid Palindrome String',
    difficulty: 'Easy',
    language: 'javascript',
    status: 'Accepted',
    runtimeMs: 62,
    memoryMb: 15.2,
    timestamp: '2 days ago',
    code: `function isPalindrome(s) {\n  let l = 0, r = s.length - 1;\n  const isAlpha = c => /[a-z0-9]/i.test(c);\n  while (l < r) {\n    while (l < r && !isAlpha(s[l])) l++;\n    while (l < r && !isAlpha(s[r])) r--;\n    if (s[l].toLowerCase() !== s[r].toLowerCase()) return false;\n    l++; r--;\n  }\n  return true;\n}`,
    passedTestCases: 3,
    totalTestCases: 3
  },
  {
    id: 'sub-3',
    problemId: 'p-10',
    problemTitle: 'Longest Unique Substring',
    difficulty: 'Medium',
    language: 'python',
    status: 'Accepted',
    runtimeMs: 68,
    memoryMb: 16.1,
    timestamp: '3 days ago',
    code: `def length_of_longest_substring(s: str) -> int:\n    seen = {}\n    max_len = 0\n    l = 0\n    for r, c in enumerate(s):\n        if c in seen and seen[c] >= l:\n            l = seen[c] + 1\n        seen[c] = r\n        max_len = max(max_len, r - l + 1)\n    return max_len`,
    passedTestCases: 4,
    totalTestCases: 4
  }
];

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Daily Challenge Ready',
    message: 'Longest Consecutive Sequence is today’s +100 XP algorithmic focus.',
    type: 'streak',
    read: false,
    timestamp: '2 hours ago',
    linkUrl: '/problems/p-5'
  },
  {
    id: 'notif-2',
    title: 'New Follower',
    message: 'Devon Patel (@devon_p) started following your problem-solving journey.',
    type: 'follow',
    read: false,
    timestamp: '5 hours ago',
    linkUrl: '/profile/user-4'
  },
  {
    id: 'notif-3',
    title: 'Biweekly Contest Starting Soon',
    message: 'CodeLumen Biweekly Sprint #48 begins tomorrow at 14:00 UTC. Set your reminder!',
    type: 'contest',
    read: true,
    timestamp: '1 day ago',
    linkUrl: '/contests'
  },
  {
    id: 'notif-4',
    title: 'Badge Unlocked!',
    message: 'You earned the "Speed Solver" badge for resolving a Medium problem with 95%+ runtime.',
    type: 'badge',
    read: true,
    timestamp: '2 days ago',
    linkUrl: '/profile/user-current'
  }
];

export const StorageService = {
  getCurrentUser(): UserProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    return SAMPLE_USERS[0];
  },

  saveCurrentUser(user: UserProfile): void {
    try {
      const levelInfo = calculateLevel(user.xp);
      user.level = levelInfo.level;
      user.levelTitle = levelInfo.title;
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } catch (e) {
      console.error(e);
    }
  },

  isAuthenticated(): boolean {
    try {
      const auth = localStorage.getItem('codelumen_authenticated');
      return auth !== null ? auth === 'true' : true;
    } catch {
      return true;
    }
  },

  setAuthenticated(val: boolean): void {
    try {
      localStorage.setItem('codelumen_authenticated', val ? 'true' : 'false');
    } catch (e) {
      console.error(e);
    }
  },

  logout(): void {
    try {
      localStorage.setItem('codelumen_authenticated', 'false');
    } catch (e) {
      console.error(e);
    }
  },

  getAllUsers(): UserProfile[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ALL_USERS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    return SAMPLE_USERS;
  },

  saveAllUsers(users: UserProfile[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ALL_USERS, JSON.stringify(users));
    } catch (e) {
      console.error(e);
    }
  },

  getUserById(id: string): UserProfile {
    const current = this.getCurrentUser();
    if (id === current.id || id === 'user-current') return current;
    const users = this.getAllUsers();
    return users.find(u => u.id === id) || current;
  },

  toggleFollowUser(targetUserId: string): { isFollowing: boolean; current: UserProfile; target: UserProfile } {
    const current = this.getCurrentUser();
    const users = this.getAllUsers();
    const targetIdx = users.findIndex(u => u.id === targetUserId);
    const target = targetIdx >= 0 ? users[targetIdx] : SAMPLE_USERS.find(u => u.id === targetUserId)!;

    const isFollowing = current.followingIds.includes(targetUserId);

    if (isFollowing) {
      current.followingIds = current.followingIds.filter(id => id !== targetUserId);
      current.followingCount = Math.max(0, current.followingCount - 1);
      target.followersCount = Math.max(0, target.followersCount - 1);
    } else {
      current.followingIds.push(targetUserId);
      current.followingCount += 1;
      target.followersCount += 1;
    }

    this.saveCurrentUser(current);
    if (targetIdx >= 0) {
      users[targetIdx] = target;
      this.saveAllUsers(users);
    }

    return { isFollowing: !isFollowing, current, target };
  },

  recordProblemSolve(problemId: string, xpReward = 50): UserProfile {
    const user = this.getCurrentUser();
    if (!user.solvedProblemIds.includes(problemId)) {
      user.solvedProblemIds.push(problemId);
      user.xp += xpReward;
      
      // Update today's activity calendar
      const today = new Date().toISOString().split('T')[0];
      user.activityCalendar[today] = (user.activityCalendar[today] || 0) + 1;
      
      // Check badges
      if (user.solvedProblemIds.length >= 1 && !user.badges.includes('first-solve')) {
        user.badges.push('first-solve');
      }
      if (user.solvedProblemIds.length >= 10 && !user.badges.includes('solve-10')) {
        user.badges.push('solve-10');
      }
      if (user.solvedProblemIds.length >= 50 && !user.badges.includes('solve-50')) {
        user.badges.push('solve-50');
      }

      this.saveCurrentUser(user);
    }
    return user;
  },

  toggleSaveProblem(problemId: string): boolean {
    const user = this.getCurrentUser();
    const isSaved = user.savedProblemIds.includes(problemId);
    if (isSaved) {
      user.savedProblemIds = user.savedProblemIds.filter(id => id !== problemId);
    } else {
      user.savedProblemIds.push(problemId);
    }
    this.saveCurrentUser(user);
    return !isSaved;
  },

  getSubmissions(): Submission[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_SUBMISSIONS;
  },

  saveSubmission(submission: Submission): void {
    try {
      const subs = this.getSubmissions();
      subs.unshift(submission);
      localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(subs));
    } catch (e) {
      console.error(e);
    }
  },

  getDiscussions(): DiscussionPost[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DISCUSSIONS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    return SAMPLE_DISCUSSIONS;
  },

  saveDiscussions(discussions: DiscussionPost[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.DISCUSSIONS, JSON.stringify(discussions));
    } catch (e) {
      console.error(e);
    }
  },

  addDiscussion(post: Omit<DiscussionPost, 'id' | 'createdAt' | 'likes' | 'commentsCount' | 'comments'>): DiscussionPost {
    const discussions = this.getDiscussions();
    const newPost: DiscussionPost = {
      ...post,
      id: `disc-${Date.now()}`,
      createdAt: 'Just now',
      likes: 1,
      hasLiked: true,
      commentsCount: 0,
      comments: []
    };
    discussions.unshift(newPost);
    this.saveDiscussions(discussions);
    return newPost;
  },

  addComment(discussionId: string, content: string): DiscussionPost | undefined {
    const discussions = this.getDiscussions();
    const disc = discussions.find(d => d.id === discussionId);
    if (!disc) return undefined;
    const user = this.getCurrentUser();
    const comment = {
      id: `c-${Date.now()}`,
      author: {
        id: user.id,
        name: user.name,
        username: user.username,
        avatar: user.avatar
      },
      content,
      createdAt: 'Just now',
      likes: 0
    };
    disc.comments.push(comment);
    disc.commentsCount = disc.comments.length;
    this.saveDiscussions(discussions);
    return disc;
  },

  toggleLikeDiscussion(discussionId: string): DiscussionPost | undefined {
    const discussions = this.getDiscussions();
    const disc = discussions.find(d => d.id === discussionId);
    if (!disc) return undefined;
    if (disc.hasLiked) {
      disc.likes = Math.max(0, disc.likes - 1);
      disc.hasLiked = false;
    } else {
      disc.likes += 1;
      disc.hasLiked = true;
    }
    this.saveDiscussions(discussions);
    return disc;
  },

  getNotifications(): NotificationItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_NOTIFICATIONS;
  },

  markAllNotificationsRead(): NotificationItem[] {
    const notifs = this.getNotifications().map(n => ({ ...n, read: true }));
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
    } catch (e) {
      console.error(e);
    }
    return notifs;
  },

  getSettings(): EditorSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (data) return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_SETTINGS;
  },

  saveSettings(settings: EditorSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
  }
};
