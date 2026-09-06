import { 
  UserProfile, Submission, DiscussionPost, NotificationItem,
  UserProfileRecord, UserPreferencesRecord, UserProgressRecord, OnboardingProgressRecord,
  UserProblemProgressRecord, SavedProblemRecord, SubmissionRecord, SubmissionDraftRecord,
  XpTransactionRecord, UserActivityRecord, SupportedLanguage,
  ExecutionJobRecord, PersonalProblemList, UserStudyPlanProgress,
  DailyChallenge, ContestRatingHistoryItem, AchievementItem, InterviewSessionConfig
} from '../types';
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
  AUTH_STATE: 'codespark_authenticated',
  USER_PROBLEM_PROGRESS: 'codespark_user_problem_progress',
  SAVED_PROBLEMS: 'codespark_saved_problems',
  SUBMISSION_DRAFTS: 'codespark_submission_drafts',
  XP_TRANSACTIONS: 'codespark_xp_transactions',
  USER_ACTIVITY: 'codespark_user_activity',
  EXECUTION_JOBS: 'codespark_execution_jobs',
  // Phase 5 Keys
  REVISIT_PROBLEMS: 'codespark_revisit_problems',
  PERSONAL_LISTS: 'codespark_personal_lists',
  USER_STUDY_PLANS: 'codespark_user_study_plans',
  DAILY_CHALLENGES: 'codespark_daily_challenges',
  USER_ACHIEVEMENTS: 'codespark_user_achievements',
  CONTEST_REGISTRATIONS: 'codespark_contest_registrations',
  CONTEST_RATINGS: 'codespark_contest_ratings',
  INTERVIEW_SESSIONS: 'codespark_interview_sessions'
};


export interface EditorSettings {
  fontSize: number;
  tabSize: number;
  theme: 'spark-dark' | 'obsidian' | 'monokai';
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

const INITIAL_SUBMISSIONS: Submission[] = [];

const INITIAL_NOTIFICATIONS: NotificationItem[] = [];

export interface StoredAccount {
  id: string;
  email: string;
  username: string;
  salt: string;
  passwordHash: string;
  resetToken?: string;
  resetExpiry?: number;
  profile: UserProfileRecord;
  preferences: UserPreferencesRecord;
  progress: UserProgressRecord;
  onboarding: OnboardingProgressRecord;
  user: UserProfile;
}

// =============================================================================
// CRYPTOGRAPHIC UTILITIES (Web Crypto SHA-256)
// =============================================================================
export async function hashPassword(password: string, salt: string): Promise<string> {
  const enc = new TextEncoder();
  const keyData = enc.encode(`${salt}:${password}`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', keyData);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export function generateSalt(): string {
  const arr = new Uint8Array(16);
  crypto.getRandomValues(arr);
  return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
}

export const StorageService = {
  getCurrentUser(): UserProfile | null {
    try {
      const isAuth = localStorage.getItem(STORAGE_KEYS.AUTH_STATE);
      if (isAuth !== 'true') return null;

      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (data) {
        const user = JSON.parse(data);
        if (user && user.id) return user;
      }
    } catch (e) {
      console.error('Error fetching current user:', e);
    }
    return null;
  },

  saveCurrentUser(user: UserProfile): void {
    try {
      const levelInfo = calculateLevel(user.xp);
      user.level = levelInfo.level;
      user.levelTitle = levelInfo.title;
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      
      // Also sync back to stored accounts
      const accounts = this.getAuthAccounts();
      const idx = accounts.findIndex(a => a.id === user.id || a.user.id === user.id);
      if (idx >= 0) {
        accounts[idx].user = user;
        accounts[idx].profile.name = user.name;
        accounts[idx].profile.username = user.username;
        accounts[idx].profile.bio = user.bio;
        accounts[idx].profile.updated_at = new Date().toISOString();
        accounts[idx].progress.xp = user.xp;
        accounts[idx].progress.problems_solved = user.solvedProblemIds.length;
        accounts[idx].progress.problems_attempted = user.attemptedProblemIds.length;
        accounts[idx].progress.current_streak = user.streak;
        accounts[idx].progress.longest_streak = user.longestStreak;
        accounts[idx].progress.updated_at = new Date().toISOString();
        this.saveAuthAccounts(accounts);
      }
    } catch (e) {
      console.error('Error saving current user:', e);
    }
  },

  isAuthenticated(): boolean {
    try {
      const auth = localStorage.getItem(STORAGE_KEYS.AUTH_STATE);
      if (auth !== 'true') return false;
      return this.getCurrentUser() !== null;
    } catch {
      return false;
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
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    } catch (e) {
      console.error('Logout error:', e);
    }
  },

  getAuthAccounts(): StoredAccount[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AUTH_ACCOUNTS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Error reading auth accounts:', e);
    }
    return [];
  },

  saveAuthAccounts(accounts: StoredAccount[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.AUTH_ACCOUNTS, JSON.stringify(accounts));
    } catch (e) {
      console.error('Error writing auth accounts:', e);
    }
  },

  checkEmailAvailable(email: string): boolean {
    const cleanEmail = email.trim().toLowerCase();
    const accounts = this.getAuthAccounts();
    return !accounts.some(a => a.email.toLowerCase() === cleanEmail);
  },

  checkUsernameAvailable(username: string): boolean {
    const cleanUsername = username.trim().toLowerCase();
    const accounts = this.getAuthAccounts();
    return !accounts.some(a => a.username.toLowerCase() === cleanUsername);
  },

  async registerUser(data: {
    name: string;
    username: string;
    email: string;
    password: string;
  }): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
    const email = data.email.trim().toLowerCase();
    const username = data.username.trim().toLowerCase();
    const name = data.name.trim();

    if (!name) {
      return { success: false, error: 'Full name is required.' };
    }
    if (!username || username.length < 3) {
      return { success: false, error: 'Username must be at least 3 characters long.' };
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return { success: false, error: 'Username may only contain letters, numbers, and underscores.' };
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { success: false, error: 'Enter a valid email address.' };
    }
    if (!data.password || data.password.length < 8) {
      return { success: false, error: 'Password must be at least 8 characters.' };
    }

    if (!this.checkEmailAvailable(email)) {
      return { success: false, error: 'An account with this email already exists.' };
    }
    if (!this.checkUsernameAvailable(username)) {
      return { success: false, error: 'Username is already taken.' };
    }

    const salt = generateSalt();
    const passwordHash = await hashPassword(data.password, salt);
    const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    // Section 15: profiles
    const profileRecord: UserProfileRecord = {
      id: `prf_${Date.now()}`,
      user_id: userId,
      name,
      username,
      avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(username)}`,
      bio: 'New explorer on CodeSpark.',
      created_at: now,
      updated_at: now
    };

    // Section 16: user_preferences
    const preferencesRecord: UserPreferencesRecord = {
      user_id: userId,
      theme: 'spark-dark',
      editor_theme: 'spark-dark',
      notifications_enabled: true
    };

    // Section 17: user_progress (all zero for new users)
    const progressRecord: UserProgressRecord = {
      user_id: userId,
      xp: 0,
      problems_solved: 0,
      problems_attempted: 0,
      current_streak: 0,
      longest_streak: 0,
      roadmap_progress: 0,
      created_at: now,
      updated_at: now
    };

    // Section 18: onboarding_progress
    const onboardingRecord: OnboardingProgressRecord = {
      user_id: userId,
      current_step: 1,
      completed: false,
      updated_at: now
    };

    // Full UserProfile object
    const newUser: UserProfile = {
      id: userId,
      name,
      username,
      email,
      avatar: profileRecord.avatar_url,
      bio: profileRecord.bio,
      role: 'user',
      preferredLanguage: 'python',
      experienceLevel: 'Beginner',
      goal: 'DSA Fundamentals',
      goals: [],
      xp: 0,
      level: 1,
      levelTitle: 'Beginner',
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
      journeyState: 'new_account',
      onboarding_completed: false,
      firstLessonCompleted: false,
      firstSolveCelebrated: false,
      recommendedStartingTopic: 'Arrays & Hashing',
      weeklyTarget: 5
    };

    const newAccount: StoredAccount = {
      id: userId,
      email,
      username,
      salt,
      passwordHash,
      profile: profileRecord,
      preferences: preferencesRecord,
      progress: progressRecord,
      onboarding: onboardingRecord,
      user: newUser
    };

    const accounts = this.getAuthAccounts();
    accounts.push(newAccount);
    this.saveAuthAccounts(accounts);

    this.saveCurrentUser(newUser);
    this.setAuthenticated(true);

    return { success: true, user: newUser };
  },

  async loginUser(
    identifier: string,
    password: string
  ): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
    const cleanId = identifier.trim().toLowerCase();
    if (!cleanId || !password) {
      return { success: false, error: 'Please enter your email and password.' };
    }

    const accounts = this.getAuthAccounts();
    const account = accounts.find(
      a => a.email.toLowerCase() === cleanId || a.username.toLowerCase() === cleanId
    );

    if (!account) {
      return { 
        success: false, 
        error: 'Incorrect email or password. Please check your credentials and try again.' 
      };
    }

    const checkHash = await hashPassword(password, account.salt);
    if (checkHash !== account.passwordHash) {
      return { 
        success: false, 
        error: 'Incorrect email or password. Please check your credentials and try again.' 
      };
    }

    this.saveCurrentUser(account.user);
    this.setAuthenticated(true);
    return { success: true, user: account.user };
  },

  sendPasswordResetEmail(email: string): { success: boolean; message: string } {
    const cleanEmail = email.trim().toLowerCase();
    const accounts = this.getAuthAccounts();
    const account = accounts.find(a => a.email.toLowerCase() === cleanEmail);
    
    if (account) {
      account.resetToken = `rst_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      account.resetExpiry = Date.now() + 1000 * 60 * 60; // 1 hr
      this.saveAuthAccounts(accounts);
    }

    // Generic confirmation message to avoid revealing whether an email exists
    return {
      success: true,
      message: 'If an account exists with this email address, password reset instructions have been sent.'
    };
  },

  async resetPassword(email: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
    if (!newPassword || newPassword.length < 8) {
      return { success: false, error: 'Password must be at least 8 characters long.' };
    }
    const cleanEmail = email.trim().toLowerCase();
    const accounts = this.getAuthAccounts();
    const account = accounts.find(a => a.email.toLowerCase() === cleanEmail);
    if (!account) {
      return { success: false, error: 'Invalid or expired password reset request.' };
    }

    const newSalt = generateSalt();
    account.salt = newSalt;
    account.passwordHash = await hashPassword(newPassword, newSalt);
    delete account.resetToken;
    delete account.resetExpiry;
    this.saveAuthAccounts(accounts);
    return { success: true };
  },

  saveOnboardingProgress(userId: string, progress: Partial<OnboardingProgressRecord>): void {
    const accounts = this.getAuthAccounts();
    const account = accounts.find(a => a.id === userId || a.user.id === userId);
    if (account) {
      account.onboarding = {
        ...account.onboarding,
        ...progress,
        updated_at: new Date().toISOString()
      };
      if (account.user) {
        if (progress.experience_level) account.user.experienceLevel = progress.experience_level;
        if (progress.goals) account.user.goals = progress.goals;
        if (progress.preferred_language) account.user.preferredLanguage = progress.preferred_language;
        if (progress.learning_style) account.user.learningStyle = progress.learning_style;
        if (progress.current_step) {
          account.user.onboardingProgress = {
            step: progress.current_step,
            experienceLevel: account.onboarding.experience_level,
            goals: account.onboarding.goals,
            preferredLanguage: account.onboarding.preferred_language,
            learningStyle: account.onboarding.learning_style
          };
        }
      }
      this.saveAuthAccounts(accounts);
      this.saveCurrentUser(account.user);
    }
  },

  getOnboardingProgress(userId: string): OnboardingProgressRecord | null {
    const accounts = this.getAuthAccounts();
    const account = accounts.find(a => a.id === userId || a.user.id === userId);
    return account?.onboarding || null;
  },

  getUserProfileRecord(userId: string): UserProfileRecord | null {
    const accounts = this.getAuthAccounts();
    const account = accounts.find(a => a.id === userId || a.user.id === userId);
    return account?.profile || null;
  },

  getUserPreferencesRecord(userId: string): UserPreferencesRecord | null {
    const accounts = this.getAuthAccounts();
    const account = accounts.find(a => a.id === userId || a.user.id === userId);
    return account?.preferences || null;
  },

  updateUserPreferencesRecord(userId: string, prefs: Partial<UserPreferencesRecord>): UserPreferencesRecord | null {
    const accounts = this.getAuthAccounts();
    const account = accounts.find(a => a.id === userId || a.user.id === userId);
    if (!account) return null;
    account.preferences = {
      ...account.preferences,
      ...prefs
    };
    this.saveAuthAccounts(accounts);
    return account.preferences;
  },

  getUserProgressRecord(userId: string): UserProgressRecord | null {
    const accounts = this.getAuthAccounts();
    const account = accounts.find(a => a.id === userId || a.user.id === userId);
    return account?.progress || null;
  },

  updateUserProgressRecord(userId: string, prog: Partial<UserProgressRecord>): UserProgressRecord | null {
    const accounts = this.getAuthAccounts();
    const account = accounts.find(a => a.id === userId || a.user.id === userId);
    if (!account) return null;
    account.progress = {
      ...account.progress,
      ...prog,
      updated_at: new Date().toISOString()
    };
    this.saveAuthAccounts(accounts);
    return account.progress;
  },

  completeOnboarding(userId: string, finalData: Partial<UserProfile>): UserProfile | null {
    const accounts = this.getAuthAccounts();
    const account = accounts.find(a => a.id === userId || a.user.id === userId);
    if (!account) return null;

    account.onboarding.completed = true;
    account.onboarding.updated_at = new Date().toISOString();
    if (finalData.experienceLevel) account.onboarding.experience_level = finalData.experienceLevel;
    if (finalData.goals) account.onboarding.goals = finalData.goals;
    if (finalData.preferredLanguage) account.onboarding.preferred_language = finalData.preferredLanguage;
    if (finalData.learningStyle) account.onboarding.learning_style = finalData.learningStyle;

    account.user = {
      ...account.user,
      ...finalData,
      onboarding_completed: true,
      journeyState: 'starting_journey'
    };

    this.saveAuthAccounts(accounts);
    this.saveCurrentUser(account.user);
    return account.user;
  },

  getAllUsers(): UserProfile[] {
    const accounts = this.getAuthAccounts();
    const registeredUsers = accounts.map(a => a.user).filter(Boolean);
    const current = this.getCurrentUser();
    if (current && !registeredUsers.some(u => u.id === current.id)) {
      registeredUsers.unshift(current);
    }
    return registeredUsers;
  },

  getUserById(id: string): UserProfile | null {
    const current = this.getCurrentUser();
    if (current && (id === current.id || id === 'user-current')) return current;
    const all = this.getAllUsers();
    return all.find(u => u.id === id) || (id === current?.id ? current : null);
  },

  toggleFollowUser(targetUserId: string): { isFollowing: boolean; current: UserProfile | null } {
    const current = this.getCurrentUser();
    if (!current) return { isFollowing: false, current: null };

    const isFollowing = current.followingIds.includes(targetUserId);
    if (isFollowing) {
      current.followingIds = current.followingIds.filter(id => id !== targetUserId);
      current.followingCount = Math.max(0, current.followingCount - 1);
    } else {
      current.followingIds.push(targetUserId);
      current.followingCount += 1;
    }

    this.saveCurrentUser(current);
    return { isFollowing: !isFollowing, current };
  },

  // ===========================================================================
  // USER PROBLEM PROGRESS (SECTION 17)
  // ===========================================================================
  getAllUserProblemProgress(userId: string): Record<string, UserProblemProgressRecord> {
    try {
      const raw = localStorage.getItem(`${STORAGE_KEYS.USER_PROBLEM_PROGRESS}_${userId}`);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.error('Error fetching problem progress:', e);
    }
    return {};
  },

  getUserProblemProgress(userId: string, problemId: string): UserProblemProgressRecord | null {
    const all = this.getAllUserProblemProgress(userId);
    return all[problemId] || null;
  },

  recordProblemAttempt(userId: string, problemId: string): UserProblemProgressRecord {
    const all = this.getAllUserProblemProgress(userId);
    const now = new Date().toISOString();
    const existing = all[problemId];

    const updated: UserProblemProgressRecord = existing ? {
      ...existing,
      status: existing.status === 'solved' ? 'solved' : 'attempted',
      attempt_count: (existing.attempt_count || 0) + 1,
      last_attempted_at: now,
      updated_at: now
    } : {
      id: `upp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      user_id: userId,
      problem_id: problemId,
      status: 'attempted',
      attempt_count: 1,
      last_attempted_at: now,
      created_at: now,
      updated_at: now
    };

    all[problemId] = updated;
    try {
      localStorage.setItem(`${STORAGE_KEYS.USER_PROBLEM_PROGRESS}_${userId}`, JSON.stringify(all));
    } catch (e) {
      console.error('Error saving problem progress:', e);
    }

    // Update currentUser attempted list
    const user = this.getCurrentUser();
    if (user && user.id === userId && !user.attemptedProblemIds.includes(problemId)) {
      user.attemptedProblemIds.push(problemId);
      this.saveCurrentUser(user);
    }

    this.recordActivity(userId, 'problem_attempted', problemId);
    return updated;
  },

  saveExecutionJob(job: ExecutionJobRecord): void {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.EXECUTION_JOBS);
      const jobs: ExecutionJobRecord[] = raw ? JSON.parse(raw) : [];
      const idx = jobs.findIndex(j => j.id === job.id);
      if (idx !== -1) {
        jobs[idx] = job;
      } else {
        jobs.unshift(job);
      }
      localStorage.setItem(STORAGE_KEYS.EXECUTION_JOBS, JSON.stringify(jobs.slice(0, 100)));
    } catch (e) {
      console.error('Error saving execution job:', e);
    }
  },

  getExecutionJob(jobId: string): ExecutionJobRecord | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.EXECUTION_JOBS);
      if (raw) {
        const jobs: ExecutionJobRecord[] = JSON.parse(raw);
        return jobs.find(j => j.id === jobId) || null;
      }
    } catch (e) {
      console.error('Error reading execution job:', e);
    }
    return null;
  },

  recordProblemSolve(
    problemId: string, 
    difficultyOrXp: 'Easy' | 'Medium' | 'Hard' | number = 'Easy'
  ): (UserProfile & { isFirstSolve: boolean; xpAwarded: number }) | null {
    const user = this.getCurrentUser();
    if (!user) return null;

    const now = new Date().toISOString();
    const today = now.split('T')[0];
    const isRepeatSolve = user.solvedProblemIds.includes(problemId);
    let xpAwarded = 0;

    // Difficulty XP configuration: Easy: +100, Medium: +200, Hard: +300
    const xpByDiff = { 'Easy': 100, 'Medium': 200, 'Hard': 300 };
    const problemXpValue = typeof difficultyOrXp === 'number' 
      ? difficultyOrXp 
      : (xpByDiff[difficultyOrXp] || 100);

    if (!isRepeatSolve) {
      user.solvedProblemIds.push(problemId);
      xpAwarded = problemXpValue;
      user.xp += xpAwarded;

      const isAbsoluteFirstSolve = user.solvedProblemIds.length === 1;
      if (isAbsoluteFirstSolve) {
        if (!user.badges.includes('first-solve')) {
          user.badges.push('first-solve');
        }
        user.journeyState = 'first_solve';
        user.firstSolveCelebrated = false;
        this.recordActivity(user.id, 'badge_earned', 'first-solve');
      } else {
        user.journeyState = 'active_learner';
      }

      this.recordXpTransaction(user.id, xpAwarded, 'problem_solved', 'problem', problemId);

      // Milestone badges
      if (user.solvedProblemIds.length >= 10 && !user.badges.includes('solve-10')) {
        user.badges.push('solve-10');
        this.recordActivity(user.id, 'badge_earned', 'solve-10');
      }
      if (user.solvedProblemIds.length >= 50 && !user.badges.includes('solve-50')) {
        user.badges.push('solve-50');
        this.recordActivity(user.id, 'badge_earned', 'solve-50');
      }
    }

    // Streak update based on activity date (Section 29: multiple solves on same day = 1 active day)
    const hadActivityToday = !!(user.activityCalendar && user.activityCalendar[today]);
    if (!hadActivityToday) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      if (user.activityCalendar && user.activityCalendar[yesterday]) {
        user.streak = (user.streak || 0) + 1;
      } else {
        user.streak = 1;
      }
      user.longestStreak = Math.max(user.longestStreak || 1, user.streak);
    }
    user.activityCalendar = user.activityCalendar || {};
    user.activityCalendar[today] = (user.activityCalendar[today] || 0) + 1;

    this.saveCurrentUser(user);

    // Update user_problem_progress record
    const all = this.getAllUserProblemProgress(user.id);
    const existing = all[problemId];
    all[problemId] = {
      id: existing ? existing.id : `upp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      user_id: user.id,
      problem_id: problemId,
      status: 'solved',
      attempt_count: existing ? (existing.attempt_count || 0) + 1 : 1,
      solved_at: existing?.solved_at || now,
      last_attempted_at: now,
      created_at: existing ? existing.created_at : now,
      updated_at: now
    };

    try {
      localStorage.setItem(`${STORAGE_KEYS.USER_PROBLEM_PROGRESS}_${user.id}`, JSON.stringify(all));
    } catch (e) {
      console.error(e);
    }

    this.recordActivity(user.id, 'problem_solved', problemId);

    if (!isRepeatSolve) {
      this.addNotification({
        title: 'Problem Solved! ⚡',
        message: `Earned +${xpAwarded} XP. Current streak: ${user.streak} ${user.streak === 1 ? 'day' : 'days'}.`,
        type: 'milestone',
        linkUrl: '/roadmaps'
      }, user.id);
    }

    return Object.assign(user, { isFirstSolve: !isRepeatSolve, xpAwarded });
  },

  completeFirstLesson(): UserProfile | null {
    const user = this.getCurrentUser();
    if (!user) return null;
    user.firstLessonCompleted = true;
    if (user.solvedProblemIds.length === 0) {
      user.journeyState = 'first_problem';
    }
    this.saveCurrentUser(user);
    this.recordActivity(user.id, 'lesson_completed', 'lesson-hash-maps');
    return user;
  },

  dismissFirstSolveCelebration(): UserProfile | null {
    const user = this.getCurrentUser();
    if (!user) return null;
    user.firstSolveCelebrated = true;
    user.journeyState = 'active_learner';
    this.saveCurrentUser(user);
    return user;
  },

  // ===========================================================================
  // SAVED PROBLEMS (SECTION 18)
  // ===========================================================================
  getSavedProblemIds(userId: string): string[] {
    try {
      const raw = localStorage.getItem(`${STORAGE_KEYS.SAVED_PROBLEMS}_${userId}`);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.error('Error fetching saved problems:', e);
    }
    const user = this.getCurrentUser();
    if (user && user.id === userId) return user.savedProblemIds || [];
    return [];
  },

  saveProblem(userId: string, problemId: string): boolean {
    const ids = this.getSavedProblemIds(userId);
    if (!ids.includes(problemId)) {
      ids.push(problemId);
      try {
        localStorage.setItem(`${STORAGE_KEYS.SAVED_PROBLEMS}_${userId}`, JSON.stringify(ids));
      } catch (e) {
        console.error(e);
      }
    }
    const user = this.getCurrentUser();
    if (user && user.id === userId && !user.savedProblemIds.includes(problemId)) {
      user.savedProblemIds.push(problemId);
      this.saveCurrentUser(user);
    }
    return true;
  },

  unsaveProblem(userId: string, problemId: string): boolean {
    let ids = this.getSavedProblemIds(userId);
    ids = ids.filter(id => id !== problemId);
    try {
      localStorage.setItem(`${STORAGE_KEYS.SAVED_PROBLEMS}_${userId}`, JSON.stringify(ids));
    } catch (e) {
      console.error(e);
    }
    const user = this.getCurrentUser();
    if (user && user.id === userId) {
      user.savedProblemIds = user.savedProblemIds.filter(id => id !== problemId);
      this.saveCurrentUser(user);
    }
    return false;
  },

  isProblemSaved(userId: string, problemId: string): boolean {
    const ids = this.getSavedProblemIds(userId);
    return ids.includes(problemId);
  },

  toggleSaveProblem(problemId: string): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;
    const isSaved = this.isProblemSaved(user.id, problemId);
    if (isSaved) {
      return this.unsaveProblem(user.id, problemId);
    } else {
      return this.saveProblem(user.id, problemId);
    }
  },

  // ===========================================================================
  // SUBMISSION DRAFTS (SECTION 22)
  // ===========================================================================
  saveDraft(userId: string, problemId: string, language: SupportedLanguage, code: string): void {
    try {
      const key = `${STORAGE_KEYS.SUBMISSION_DRAFTS}_${userId}_${problemId}_${language}`;
      const record: SubmissionDraftRecord = {
        user_id: userId,
        problem_id: problemId,
        language,
        code,
        updated_at: new Date().toISOString()
      };
      localStorage.setItem(key, JSON.stringify(record));
    } catch (e) {
      console.error('Error saving draft:', e);
    }
  },

  getDraft(userId: string, problemId: string, language: SupportedLanguage): string | null {
    try {
      const key = `${STORAGE_KEYS.SUBMISSION_DRAFTS}_${userId}_${problemId}_${language}`;
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed: SubmissionDraftRecord = JSON.parse(raw);
        return parsed.code;
      }
    } catch (e) {
      console.error('Error reading draft:', e);
    }
    return null;
  },

  // ===========================================================================
  // ACTIVITY & XP TRANSACTIONS (SECTIONS 30 & 31)
  // ===========================================================================
  recordActivity(userId: string, type: UserActivityRecord['activity_type'], refId: string): void {
    try {
      const key = `${STORAGE_KEYS.USER_ACTIVITY}_${userId}`;
      const raw = localStorage.getItem(key);
      const list: UserActivityRecord[] = raw ? JSON.parse(raw) : [];
      list.unshift({
        id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        user_id: userId,
        activity_type: type,
        reference_id: refId,
        created_at: new Date().toISOString()
      });
      localStorage.setItem(key, JSON.stringify(list.slice(0, 50)));
    } catch (e) {
      console.error('Error recording activity:', e);
    }
  },

  getUserActivity(userId: string): UserActivityRecord[] {
    try {
      const key = `${STORAGE_KEYS.USER_ACTIVITY}_${userId}`;
      const raw = localStorage.getItem(key);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.error('Error reading activity:', e);
    }
    return [];
  },

  recordXpTransaction(userId: string, amount: number, reason: XpTransactionRecord['reason'], refType: string, refId: string): void {
    try {
      const key = `${STORAGE_KEYS.XP_TRANSACTIONS}_${userId}`;
      const raw = localStorage.getItem(key);
      const list: XpTransactionRecord[] = raw ? JSON.parse(raw) : [];
      list.unshift({
        id: `xp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        user_id: userId,
        amount,
        reason,
        reference_type: refType,
        reference_id: refId,
        created_at: new Date().toISOString()
      });
      localStorage.setItem(key, JSON.stringify(list.slice(0, 50)));
    } catch (e) {
      console.error('Error recording XP transaction:', e);
    }
  },

  getUserXpTransactions(userId: string): XpTransactionRecord[] {
    try {
      const key = `${STORAGE_KEYS.XP_TRANSACTIONS}_${userId}`;
      const raw = localStorage.getItem(key);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.error('Error reading XP transactions:', e);
    }
    return [];
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

  getSubmissionsForProblem(problemId: string): Submission[] {
    const subs = this.getSubmissions();
    return subs.filter(s => s.problemId === problemId);
  },

  getUserSubmissions(problemId?: string): Submission[] {
    const subs = this.getSubmissions();
    if (!problemId) return subs;
    return subs.filter(s => s.problemId === problemId);
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

  addDiscussion(post: Omit<DiscussionPost, 'id' | 'createdAt' | 'likes' | 'commentsCount' | 'comments'>): DiscussionPost | null {
    const user = this.getCurrentUser();
    if (!user) return null;

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
    const user = this.getCurrentUser();
    if (!user) return undefined;

    const discussions = this.getDiscussions();
    const disc = discussions.find(d => d.id === discussionId);
    if (!disc) return undefined;

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

  getNotifications(userId?: string): NotificationItem[] {
    try {
      // Unconditionally remove legacy global key that contained demo notifications
      try {
        localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
      } catch {}

      const user = userId ? { id: userId } : this.getCurrentUser();
      if (!user) return [];

      const userKey = `${STORAGE_KEYS.NOTIFICATIONS}_${user.id}`;
      const data = localStorage.getItem(userKey);

      if (data) {
        const parsed: NotificationItem[] = JSON.parse(data);
        // Cleanse any legacy demo notifications that might be in browser localStorage
        const filtered = parsed.filter(n => {
          const msg = (n.message || '').toLowerCase();
          const title = (n.title || '').toLowerCase();
          const id = (n.id || '').toLowerCase();
          return (
            !title.includes('daily challenge') &&
            !title.includes('biweekly contest') &&
            !title.includes('badge unlocked') &&
            !title.includes('new follower') &&
            !msg.includes('longest consecutive') &&
            !msg.includes('algorithmic focus') &&
            !msg.includes('devon') &&
            !msg.includes('18 consecutive') &&
            !msg.includes('sprint #48') &&
            !msg.includes('speed solver') &&
            id !== 'notif-1' &&
            id !== 'notif-2' &&
            id !== 'notif-3' &&
            id !== 'notif-4' &&
            !id.startsWith('logout-')
          );
        });

        // Save sanitized list back
        if (filtered.length !== parsed.length) {
          localStorage.setItem(userKey, JSON.stringify(filtered));
        }
        return filtered;
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  },

  addNotification(
    notif: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>, 
    userId?: string
  ): NotificationItem[] {
    try {
      const user = userId ? { id: userId } : this.getCurrentUser();
      const key = user ? `${STORAGE_KEYS.NOTIFICATIONS}_${user.id}` : STORAGE_KEYS.NOTIFICATIONS;
      const current = this.getNotifications(user?.id);
      const newNotif: NotificationItem = {
        ...notif,
        id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        read: false,
        timestamp: 'Just now'
      };
      const updated = [newNotif, ...current].slice(0, 25);
      localStorage.setItem(key, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error('Error adding notification:', e);
      return [];
    }
  },

  markAllNotificationsRead(userId?: string): NotificationItem[] {
    try {
      const user = userId ? { id: userId } : this.getCurrentUser();
      const key = user ? `${STORAGE_KEYS.NOTIFICATIONS}_${user.id}` : STORAGE_KEYS.NOTIFICATIONS;
      const notifs = this.getNotifications(user?.id).map(n => ({ ...n, read: true }));
      localStorage.setItem(key, JSON.stringify(notifs));
      return notifs;
    } catch (e) {
      console.error(e);
      return [];
    }
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
  },

  // ===========================================================================
  // PHASE 5: REVISIT QUEUE (SECTION 19)
  // ===========================================================================
  getRevisitProblemIds(userId: string): string[] {
    try {
      const raw = localStorage.getItem(`${STORAGE_KEYS.REVISIT_PROBLEMS}_${userId}`);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.error('Error reading revisit queue:', e);
    }
    return [];
  },

  toggleRevisitProblem(userId: string, problemId: string): boolean {
    const list = this.getRevisitProblemIds(userId);
    const exists = list.includes(problemId);
    const updated = exists ? list.filter(id => id !== problemId) : [...list, problemId];
    try {
      localStorage.setItem(`${STORAGE_KEYS.REVISIT_PROBLEMS}_${userId}`, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    const user = this.getCurrentUser();
    if (user && user.id === userId) {
      user.revisitProblemIds = updated;
      this.saveCurrentUser(user);
    }
    return !exists;
  },

  // ===========================================================================
  // PHASE 5: PERSONAL PROBLEM LISTS (SECTION 20)
  // ===========================================================================
  getPersonalLists(userId: string): PersonalProblemList[] {
    try {
      const raw = localStorage.getItem(`${STORAGE_KEYS.PERSONAL_LISTS}_${userId}`);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.error('Error fetching personal lists:', e);
    }
    // Return default starter list if empty
    const defaultList: PersonalProblemList = {
      id: `list_${userId}_fav`,
      userId,
      title: 'Interview Core Practice',
      description: 'Handpicked high-frequency technical interview questions',
      isPublic: false,
      problemIds: ['p-1', 'p-9', 'p-14', 'p-20', 'p-24', 'p-29'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    return [defaultList];
  },

  savePersonalList(list: PersonalProblemList): void {
    try {
      const lists = this.getPersonalLists(list.userId);
      const idx = lists.findIndex(l => l.id === list.id);
      if (idx !== -1) {
        lists[idx] = { ...list, updatedAt: new Date().toISOString() };
      } else {
        lists.unshift(list);
      }
      localStorage.setItem(`${STORAGE_KEYS.PERSONAL_LISTS}_${list.userId}`, JSON.stringify(lists));
    } catch (e) {
      console.error('Error saving personal list:', e);
    }
  },

  deletePersonalList(userId: string, listId: string): boolean {
    try {
      const lists = this.getPersonalLists(userId).filter(l => l.id !== listId);
      localStorage.setItem(`${STORAGE_KEYS.PERSONAL_LISTS}_${userId}`, JSON.stringify(lists));
      return true;
    } catch (e) {
      console.error('Error deleting personal list:', e);
      return false;
    }
  },

  addProblemToList(userId: string, listId: string, problemId: string): boolean {
    const lists = this.getPersonalLists(userId);
    const target = lists.find(l => l.id === listId);
    if (!target) return false;
    if (!target.problemIds.includes(problemId)) {
      target.problemIds.push(problemId);
      this.savePersonalList(target);
    }
    return true;
  },

  removeProblemFromList(userId: string, listId: string, problemId: string): boolean {
    const lists = this.getPersonalLists(userId);
    const target = lists.find(l => l.id === listId);
    if (!target) return false;
    target.problemIds = target.problemIds.filter(id => id !== problemId);
    this.savePersonalList(target);
    return true;
  },

  // ===========================================================================
  // PHASE 5: USER STUDY PLANS (SECTIONS 13, 14)
  // ===========================================================================
  getUserStudyPlans(userId: string): Record<string, UserStudyPlanProgress> {
    try {
      const raw = localStorage.getItem(`${STORAGE_KEYS.USER_STUDY_PLANS}_${userId}`);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.error('Error fetching user study plans:', e);
    }
    return {};
  },

  saveUserStudyPlanProgress(progress: UserStudyPlanProgress): void {
    try {
      const plans = this.getUserStudyPlans(progress.userId);
      plans[progress.studyPlanId] = progress;
      localStorage.setItem(`${STORAGE_KEYS.USER_STUDY_PLANS}_${progress.userId}`, JSON.stringify(plans));
    } catch (e) {
      console.error('Error saving user study plan:', e);
    }
  },

  // ===========================================================================
  // PHASE 5: DAILY CHALLENGE (SECTIONS 11, 12)
  // ===========================================================================
  getDailyChallengeRecords(userId: string): Record<string, { date: string; problemId: string; solved: boolean; xpAwarded: boolean }> {
    try {
      const raw = localStorage.getItem(`${STORAGE_KEYS.DAILY_CHALLENGES}_${userId}`);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.error('Error fetching daily challenge records:', e);
    }
    return {};
  },

  recordDailyChallengeSolve(userId: string, dateStr: string, problemId: string): { firstSolveToday: boolean; xpAwarded: number } {
    const records = this.getDailyChallengeRecords(userId);
    const existing = records[dateStr];
    if (existing && existing.solved) {
      return { firstSolveToday: false, xpAwarded: 0 };
    }

    records[dateStr] = {
      date: dateStr,
      problemId,
      solved: true,
      xpAwarded: true
    };

    try {
      localStorage.setItem(`${STORAGE_KEYS.DAILY_CHALLENGES}_${userId}`, JSON.stringify(records));
    } catch (e) {
      console.error(e);
    }

    // Award +50 bonus XP idempotently
    const user = this.getCurrentUser();
    if (user && user.id === userId) {
      user.xp += 50;
      this.saveCurrentUser(user);
      this.recordXpTransaction(userId, 50, 'daily_challenge', 'daily_challenge', dateStr);
    }

    return { firstSolveToday: true, xpAwarded: 50 };
  },

  // ===========================================================================
  // PHASE 5: USER ACHIEVEMENTS (SECTION 35)
  // ===========================================================================
  getUserAchievements(userId: string): string[] {
    try {
      const raw = localStorage.getItem(`${STORAGE_KEYS.USER_ACHIEVEMENTS}_${userId}`);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.error('Error fetching achievements:', e);
    }
    const user = this.getCurrentUser();
    return user?.badges || [];
  },

  unlockAchievement(userId: string, achievementId: string): boolean {
    const list = this.getUserAchievements(userId);
    if (list.includes(achievementId)) return false; // Idempotent: already unlocked

    list.push(achievementId);
    try {
      localStorage.setItem(`${STORAGE_KEYS.USER_ACHIEVEMENTS}_${userId}`, JSON.stringify(list));
    } catch (e) {
      console.error(e);
    }

    const user = this.getCurrentUser();
    if (user && user.id === userId) {
      if (!user.badges.includes(achievementId)) {
        user.badges.push(achievementId);
      }
      this.saveCurrentUser(user);
      this.recordActivity(userId, 'badge_earned', achievementId);
      this.addNotification({
        title: 'Achievement Unlocked! 🏆',
        message: `You earned the "${achievementId}" achievement. Keep progressing!`,
        type: 'badge'
      }, userId);
    }
    return true;
  },

  // ===========================================================================
  // PHASE 5: CONTEST REGISTRATIONS & RATINGS (SECTIONS 26-32)
  // ===========================================================================
  getContestRegistrations(userId: string): string[] {
    try {
      const raw = localStorage.getItem(`${STORAGE_KEYS.CONTEST_REGISTRATIONS}_${userId}`);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.error(e);
    }
    return [];
  },

  registerForContest(userId: string, contestId: string): boolean {
    const regs = this.getContestRegistrations(userId);
    if (!regs.includes(contestId)) {
      regs.push(contestId);
      try {
        localStorage.setItem(`${STORAGE_KEYS.CONTEST_REGISTRATIONS}_${userId}`, JSON.stringify(regs));
      } catch (e) {
        console.error(e);
      }
    }
    return true;
  },

  getContestRatingHistory(userId: string): ContestRatingHistoryItem[] {
    try {
      const raw = localStorage.getItem(`${STORAGE_KEYS.CONTEST_RATINGS}_${userId}`);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.error(e);
    }
    return [];
  },

  saveContestRatingResult(userId: string, result: ContestRatingHistoryItem): void {
    const history = this.getContestRatingHistory(userId);
    history.push(result);
    try {
      localStorage.setItem(`${STORAGE_KEYS.CONTEST_RATINGS}_${userId}`, JSON.stringify(history));
    } catch (e) {
      console.error(e);
    }

    const user = this.getCurrentUser();
    if (user && user.id === userId) {
      user.contestRating = result.newRating;
      user.peakContestRating = Math.max(user.peakContestRating || 1500, result.newRating);
      user.contestCount = (user.contestCount || 0) + 1;
      user.bestContestRank = user.bestContestRank ? Math.min(user.bestContestRank, result.rank) : result.rank;
      this.saveCurrentUser(user);
    }
  },

  // ===========================================================================
  // PHASE 5: INTERVIEW SESSIONS (SECTIONS 39, 40)
  // ===========================================================================
  getInterviewSessions(userId: string): InterviewSessionConfig[] {
    try {
      const raw = localStorage.getItem(`${STORAGE_KEYS.INTERVIEW_SESSIONS}_${userId}`);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.error(e);
    }
    return [];
  },

  saveInterviewSession(session: InterviewSessionConfig, userId: string): void {
    const sessions = this.getInterviewSessions(userId);
    const idx = sessions.findIndex(s => s.id === session.id);
    if (idx !== -1) {
      sessions[idx] = session;
    } else {
      sessions.unshift(session);
    }
    try {
      localStorage.setItem(`${STORAGE_KEYS.INTERVIEW_SESSIONS}_${userId}`, JSON.stringify(sessions.slice(0, 50)));
    } catch (e) {
      console.error(e);
    }
  }
};

