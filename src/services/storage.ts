import { UserProfile, Submission, DiscussionPost, NotificationItem } from '../types';
import { SAMPLE_USERS } from '../data/users';
import { SAMPLE_DISCUSSIONS } from '../data/discussions';
import { calculateLevel } from '../data/badges';

const STORAGE_KEYS = {
  CURRENT_USER: 'codespark_current_user',
  ALL_USERS: 'codespark_all_users',
  SUBMISSIONS: 'codespark_submissions',
  DISCUSSIONS: 'codespark_discussions',
  NOTIFICATIONS: 'codespark_notifications',
  SETTINGS: 'codespark_settings',
  AUTH_ACCOUNTS: 'codespark_auth_accounts',
  AUTH_STATE: 'codespark_authenticated'
};

export interface EditorSettings {
  fontSize: number;
  tabSize: number;
  theme: 'spark-dark' | 'obsidian' | 'monokai' | 'lumen-dark';
  wordWrap: boolean;
  autoSave: boolean;
  appearance: 'dark' | 'dim' | 'system';
}

const DEFAULT_SETTINGS: EditorSettings = {
  fontSize: 14,
  tabSize: 2,
  theme: 'spark-dark',
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
    message: 'CodeSpark Biweekly Sprint #48 begins tomorrow at 14:00 UTC. Set your reminder!',
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

export const DEFAULT_FRESH_USER: UserProfile = {
  id: 'user-current',
  name: 'Abhishek Sparke',
  username: 'abhishek_sparke',
  email: 'abhishek.sparke@gmail.com',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  bio: 'Learning algorithms and mastering patterns on CodeSpark.',
  role: 'user',
  preferredLanguage: 'python',
  experienceLevel: 'Beginner',
  goal: 'DSA Fundamentals',
  goals: ['DSA Fundamentals', 'Coding Interviews'],
  learningStyle: 'concepts_first',
  xp: 0,
  level: 1,
  levelTitle: 'Novice',
  streak: 0,
  longestStreak: 0,
  globalRank: 0,
  followersCount: 0,
  followingCount: 0,
  followingIds: [],
  solvedProblemIds: [],
  attemptedProblemIds: [],
  savedProblemIds: [],
  badges: [],
  activityCalendar: {},
  joinedDate: 'Joined today',
  journeyState: 'starting_journey',
  onboarding_completed: true,
  firstLessonCompleted: false,
  firstSolveCelebrated: false,
  recommendedStartingTopic: 'Arrays & Hashing',
  isDemoAccount: false,
  weeklyTarget: 5
};

interface StoredAccount {
  id: string;
  email: string;
  username: string;
  password?: string;
  user: UserProfile;
}

export const StorageService = {
  getCurrentUser(): UserProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || localStorage.getItem('codelumen_current_user');
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    return { ...DEFAULT_FRESH_USER };
  },

  saveCurrentUser(user: UserProfile): void {
    try {
      const levelInfo = calculateLevel(user.xp);
      user.level = levelInfo.level;
      user.levelTitle = levelInfo.title;
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      // Also update in all users if present
      const allUsers = this.getAllUsers();
      const idx = allUsers.findIndex(u => u.id === user.id);
      if (idx >= 0) {
        allUsers[idx] = user;
        this.saveAllUsers(allUsers);
      }
    } catch (e) {
      console.error(e);
    }
  },

  isAuthenticated(): boolean {
    try {
      const auth = localStorage.getItem(STORAGE_KEYS.AUTH_STATE) || localStorage.getItem('codelumen_authenticated');
      return auth !== null ? auth === 'true' : true;
    } catch {
      return true;
    }
  },

  setAuthenticated(val: boolean): void {
    try {
      localStorage.setItem(STORAGE_KEYS.AUTH_STATE, val ? 'true' : 'false');
    } catch (e) {
      console.error(e);
    }
  },

  logout(): void {
    try {
      localStorage.setItem(STORAGE_KEYS.AUTH_STATE, 'false');
    } catch (e) {
      console.error(e);
    }
  },

  getAuthAccounts(): StoredAccount[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AUTH_ACCOUNTS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    return [];
  },

  saveAuthAccounts(accounts: StoredAccount[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.AUTH_ACCOUNTS, JSON.stringify(accounts));
    } catch (e) {
      console.error(e);
    }
  },

  checkEmailAvailable(email: string): boolean {
    const cleanEmail = email.trim().toLowerCase();
    const accounts = this.getAuthAccounts();
    if (accounts.some(a => a.email.toLowerCase() === cleanEmail)) return false;
    const allUsers = this.getAllUsers();
    return !allUsers.some(u => u.email.toLowerCase() === cleanEmail);
  },

  checkUsernameAvailable(username: string): boolean {
    const cleanUsername = username.trim().toLowerCase();
    const accounts = this.getAuthAccounts();
    if (accounts.some(a => a.username.toLowerCase() === cleanUsername)) return false;
    const allUsers = this.getAllUsers();
    return !allUsers.some(u => u.username.toLowerCase() === cleanUsername);
  },

  registerUser(data: {
    name: string;
    username: string;
    email: string;
    password?: string;
    avatar?: string;
  }): { success: boolean; user?: UserProfile; error?: string } {
    const email = data.email.trim().toLowerCase();
    const username = data.username.trim().toLowerCase();

    if (!email || !username) {
      return { success: false, error: 'Email and username are required.' };
    }

    if (!this.checkEmailAvailable(email)) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    if (!this.checkUsernameAvailable(username)) {
      return { success: false, error: 'This username is already taken.' };
    }

    const newUser: UserProfile = {
      ...DEFAULT_FRESH_USER,
      id: `user-${Date.now()}`,
      name: data.name.trim() || data.username,
      username,
      email,
      avatar: data.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(username)}`,
      bio: 'New explorer on CodeSpark.',
      joinedDate: 'Joined today',
      onboarding_completed: false,
      journeyState: 'new_account',
      xp: 0,
      level: 1,
      streak: 0,
      longestStreak: 0,
      solvedProblemIds: [],
      attemptedProblemIds: [],
      badges: []
    };

    // Save account
    const accounts = this.getAuthAccounts();
    accounts.push({
      id: newUser.id,
      email,
      username,
      password: data.password,
      user: newUser
    });
    this.saveAuthAccounts(accounts);

    // Save as current user and authenticate
    this.saveCurrentUser(newUser);
    this.setAuthenticated(true);

    // Add to all users
    const allUsers = this.getAllUsers();
    allUsers.push(newUser);
    this.saveAllUsers(allUsers);

    return { success: true, user: newUser };
  },

  loginUser(identifier: string, password?: string): { success: boolean; user?: UserProfile; error?: string } {
    const cleanId = identifier.trim().toLowerCase();
    const accounts = this.getAuthAccounts();
    
    // Check saved accounts first
    const matchedAccount = accounts.find(
      a => a.email.toLowerCase() === cleanId || a.username.toLowerCase() === cleanId
    );

    if (matchedAccount) {
      if (password && matchedAccount.password && matchedAccount.password !== password) {
        return { success: false, error: 'Invalid password. Please try again.' };
      }
      this.saveCurrentUser(matchedAccount.user);
      this.setAuthenticated(true);
      return { success: true, user: matchedAccount.user };
    }

    // Check sample users (demo/fallback login)
    const allUsers = this.getAllUsers();
    const matchedUser = allUsers.find(
      u => u.email.toLowerCase() === cleanId || u.username.toLowerCase() === cleanId
    );

    if (matchedUser) {
      this.saveCurrentUser(matchedUser);
      this.setAuthenticated(true);
      return { success: true, user: matchedUser };
    }

    // If identifier looks like email, allow quick signin
    if (cleanId.includes('@')) {
      const parts = cleanId.split('@');
      const genUsername = parts[0].replace(/[^a-zA-Z0-9_]/g, '') || `sparker_${Date.now()}`;
      return this.registerUser({
        name: parts[0],
        username: genUsername,
        email: cleanId,
        password
      });
    }

    return { success: false, error: 'Account not found. Please sign up.' };
  },

  getAllUsers(): UserProfile[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ALL_USERS) || localStorage.getItem('codelumen_all_users');
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
    const isFirstSolve = user.solvedProblemIds.length === 0;

    if (!user.solvedProblemIds.includes(problemId)) {
      user.solvedProblemIds.push(problemId);

      // Section 15: Exact First Accepted Submission mechanics
      if (isFirstSolve) {
        user.xp = 100; // Guaranteed 100 XP for first solve
        user.streak = 1;
        user.longestStreak = 1;
        if (!user.badges.includes('first-solve')) {
          user.badges.push('first-solve');
        }
        user.journeyState = 'first_solve';
        user.firstSolveCelebrated = false;
      } else {
        user.xp += xpReward;
        user.streak = Math.max(1, user.streak);
        user.longestStreak = Math.max(user.streak, user.longestStreak);
        user.journeyState = 'active_learner';
      }
      
      // Update today's activity calendar
      const today = new Date().toISOString().split('T')[0];
      user.activityCalendar[today] = (user.activityCalendar[today] || 0) + 1;
      
      // Check additional milestone badges
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

  completeFirstLesson(): UserProfile {
    const user = this.getCurrentUser();
    user.firstLessonCompleted = true;
    if (user.solvedProblemIds.length === 0) {
      user.journeyState = 'first_problem';
    }
    this.saveCurrentUser(user);
    return user;
  },

  dismissFirstSolveCelebration(): UserProfile {
    const user = this.getCurrentUser();
    user.firstSolveCelebrated = true;
    user.journeyState = 'active_learner';
    this.saveCurrentUser(user);
    return user;
  },

  resetToFreshUser(): UserProfile {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    const fresh: UserProfile = {
      ...DEFAULT_FRESH_USER,
      id: 'user-' + Date.now(),
      onboarding_completed: false,
      journeyState: 'new_account',
      solvedProblemIds: [],
      attemptedProblemIds: [],
      xp: 0,
      streak: 0,
      longestStreak: 0,
      badges: []
    };
    this.saveCurrentUser(fresh);
    return fresh;
  },

  loadDemoVeteranUser(): UserProfile {
    const veteran: UserProfile = {
      ...SAMPLE_USERS[0],
      isDemoAccount: true,
      onboarding_completed: true,
      journeyState: 'active_learner',
      firstLessonCompleted: true,
      firstSolveCelebrated: true
    };
    this.saveCurrentUser(veteran);
    return veteran;
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
      const data = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS) || localStorage.getItem('codelumen_submissions');
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
      const data = localStorage.getItem(STORAGE_KEYS.DISCUSSIONS) || localStorage.getItem('codelumen_discussions');
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
      const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || localStorage.getItem('codelumen_notifications');
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
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS) || localStorage.getItem('codelumen_settings');
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
