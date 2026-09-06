export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type SupportedLanguage = 'python' | 'javascript' | 'cpp' | 'java' | 'go' | 'rust';

export type SubmissionStatus = 
  | 'Pending'
  | 'Accepted' 
  | 'Wrong Answer' 
  | 'Time Limit Exceeded' 
  | 'Runtime Error' 
  | 'Compilation Error';

export type ExperienceLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type UserGoal = 
  | 'Learn DSA' 
  | 'Prepare for interviews' 
  | 'Competitive programming' 
  | 'Improve problem solving'
  | 'DSA Fundamentals'
  | 'Become Faster at Coding';

export type UserJourneyState = 
  | 'new_account' 
  | 'onboarding' 
  | 'starting_journey' 
  | 'first_lesson' 
  | 'first_problem' 
  | 'first_submission' 
  | 'first_solve' 
  | 'active_learner';

export type LearningStyle = 
  | 'concepts_first' 
  | 'practice_immediately' 
  | 'mixed';

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  bio: string;
  role: 'user' | 'moderator' | 'admin';
  preferredLanguage: SupportedLanguage;
  experienceLevel: ExperienceLevel;
  goal: UserGoal;
  goals?: string[]; // Multiple goals selected during onboarding
  learningStyle?: LearningStyle;
  xp: number;
  level: number;
  levelTitle: string;
  streak: number;
  longestStreak: number;
  globalRank: number;
  followersCount: number;
  followingCount: number;
  followingIds: string[];
  solvedProblemIds: string[];
  attemptedProblemIds: string[];
  savedProblemIds: string[];
  badges: string[]; // Badge IDs
  activityCalendar: Record<string, number>; // date 'YYYY-MM-DD' -> solves count
  joinedDate: string;
  // Journey Progression Fields
  journeyState?: UserJourneyState;
  onboarding_completed?: boolean;
  firstLessonCompleted?: boolean;
  firstSolveCelebrated?: boolean;
  recommendedStartingTopic?: string;
  skillAssessmentScores?: Record<string, number>;
  weeklyTarget?: number; // target problems per week (e.g. 3, 5, 7, 10)
  preferences?: UserPreferences;
  onboardingProgress?: OnboardingProgress;
  // Phase 5 Competitive Fields
  contestRating?: number;
  peakContestRating?: number;
  contestCount?: number;
  bestContestRank?: number;
  revisitProblemIds?: string[];
}

export interface UserProfileRecord {
  id: string;
  user_id: string;
  name: string;
  username: string;
  avatar_url: string;
  bio: string;
  created_at: string;
  updated_at: string;
}

export interface UserPreferencesRecord {
  user_id: string;
  experience_level?: ExperienceLevel;
  goals?: string[];
  preferred_language?: SupportedLanguage;
  learning_style?: LearningStyle;
  theme?: string;
  editor_theme?: string;
  notifications_enabled?: boolean;
}

export interface UserProgressRecord {
  user_id: string;
  xp: number;
  problems_solved: number;
  problems_attempted: number;
  current_streak: number;
  longest_streak: number;
  roadmap_progress: number;
  last_activity_at?: string;
  created_at: string;
  updated_at: string;
}

export interface OnboardingProgressRecord {
  user_id: string;
  current_step: number;
  experience_level?: ExperienceLevel;
  goals?: string[];
  preferred_language?: SupportedLanguage;
  learning_style?: LearningStyle;
  completed: boolean;
  updated_at: string;
}

export interface UserPreferences {
  theme?: 'spark-dark' | 'obsidian' | 'monokai';
  editorFontSize?: number;
  keybindings?: 'standard' | 'vim' | 'emacs';
  emailNotifications?: boolean;
  soundEffects?: boolean;
}

export interface OnboardingProgress {
  step: number;
  experienceLevel?: ExperienceLevel;
  goals?: string[];
  preferredLanguage?: SupportedLanguage;
  learningStyle?: LearningStyle;
  weeklyTarget?: number;
  completed?: boolean;
}

export interface ProblemExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface ProblemTestCase {
  input: any[];
  expected: any;
  description?: string;
}

export interface ProblemHint {
  level: 1 | 2 | 3;
  type: 'conceptual' | 'direction' | 'near-solution';
  title: string;
  content: string;
}

export interface ProblemEditorialApproach {
  name: string;
  complexity: {
    time: string;
    space: string;
  };
  explanation: string;
  code: string;
}

export interface ProblemEditorial {
  summary: string;
  patternExplanation: string;
  bruteForce: ProblemEditorialApproach;
  better?: ProblemEditorialApproach;
  optimal: ProblemEditorialApproach;
}

export interface Problem {
  id: string;
  slug: string;
  title: string;
  difficulty: Difficulty;
  acceptance: string;
  topic: string;
  pattern: string;
  companies: string[];
  description: string;
  examples: ProblemExample[];
  constraints: string[];
  starterCode: Record<SupportedLanguage, string>;
  testCases: ProblemTestCase[];
  hints: ProblemHint[];
  editorial: ProblemEditorial;
  similarProblemIds: string[];
  estimatedTime?: string;
  isPublished?: boolean;
  inputFormat?: string;
  outputFormat?: string;
  notes?: string;
  timeLimitMs?: number;
  memoryLimitMb?: number;
}

export interface Submission {
  id: string;
  problemId: string;
  problemTitle: string;
  difficulty: Difficulty;
  language: SupportedLanguage;
  status: SubmissionStatus;
  runtimeMs: number;
  memoryMb: number;
  timestamp: string;
  code: string;
  passedTestCases: number;
  totalTestCases: number;
  errorMessage?: string;
}

export interface RoadmapStage {
  id: string;
  order: number;
  title: string;
  description: string;
  topic: string;
  estimatedHours: number;
  difficultyRange: string;
  problemIds: string[];
}

export interface PatternGuide {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  summary: string;
  whenToUse: string[];
  howToRecognize: string[];
  diagramAscii: string;
  timeComplexity: string;
  spaceComplexity: string;
  beginnerProblemIds: string[];
  intermediateProblemIds: string[];
  advancedProblemIds: string[];
}

export type ForumSectionId = 'learn' | 'programming' | 'career' | 'community';
export type ForumUserRole = 'Member' | 'Contributor' | 'Moderator' | 'Admin';
export type ForumReactionType = 'like' | 'love' | 'helpful' | 'great';

export interface ForumAuthor {
  id: string;
  name: string;
  username: string;
  avatar: string;
  role?: ForumUserRole;
  joinedDate?: string;
  postCount?: number;
  levelTitle?: string;
  xp?: number;
  problemsSolved?: number;
}

export interface ForumPostItem {
  id: string;
  postNumber: number;
  author: ForumAuthor;
  content: string;
  createdAt: string;
  reactions: Record<ForumReactionType, string[]>;
  replyToPostNumber?: number;
  replyToAuthor?: string;
  isOriginalPost?: boolean;
}

export interface ForumCategory {
  id: string;
  slug: string;
  sectionId: ForumSectionId;
  name: string;
  description: string;
  iconName: string;
  threadCount: number;
  postCount: number;
  latestThread?: {
    id: string;
    title: string;
    authorName: string;
    lastActivity: string;
  };
}

export interface ForumSection {
  id: ForumSectionId;
  title: string;
  description: string;
  categories: ForumCategory[];
}

export interface DiscussionComment {
  id: string;
  postNumber?: number;
  author: ForumAuthor;
  content: string;
  createdAt: string;
  likes: number;
  hasLiked?: boolean;
  reactions?: Record<ForumReactionType, string[]>;
  replyToPostNumber?: number;
  replyToAuthor?: string;
  isAcceptedAnswer?: boolean;
  editedAt?: string;
  updatedAt?: string;
}

export interface DiscussionPost {
  id: string;
  slug?: string;
  title: string;
  categoryId?: string;
  sectionId?: ForumSectionId;
  categoryName?: string;
  problemId?: string;
  problemTitle?: string;
  author: ForumAuthor;
  content: string;
  tags: string[];
  likes: number;
  hasLiked?: boolean;
  reactions?: Record<ForumReactionType, string[]>;
  commentsCount: number;
  views?: number;
  createdAt: string;
  lastActivityAt?: string;
  isPinned?: boolean;
  isLocked?: boolean;
  isSolved?: boolean;
  acceptedPostId?: string;
  codeSnippet?: { language: string; code: string };
  watchedByUserIds?: string[];
  bookmarkedByUserIds?: string[];
  comments: DiscussionComment[];
  is_system_discussion?: boolean;
  system_type?: 'discussion_rules' | string;
}

export interface DiscussionFilterParams {
  categorySlug?: string;
  filter?: 'all' | 'latest' | 'popular' | 'unanswered' | 'solved' | 'saved' | 'my-discussions' | 'watched';
  search?: string;
  tag?: string;
  page?: number;
  limit?: number;
  userId?: string;
}

export interface PaginatedDiscussionsResult {
  threads: DiscussionPost[];
  totalCount: number;
  page: number;
  totalPages: number;
  limit: number;
}

export interface PaginatedThreadPostsResult {
  thread: DiscussionPost;
  posts: DiscussionComment[];
  totalPosts: number;
  page: number;
  totalPages: number;
  limit: number;
}

export interface CreateDiscussionRequest {
  title: string;
  content: string;
  categoryId: string;
  tags: string[];
  codeSnippet?: { language: string; code: string };
  author: ForumAuthor;
}

export interface CreateReplyRequest {
  content: string;
  author: ForumAuthor;
  replyToPostNumber?: number;
  replyToAuthor?: string;
}

export interface ModerationActionRequest {
  action: 'lock' | 'unlock' | 'pin' | 'unpin' | 'delete' | 'mark_solved' | 'unmark_solved';
  reason?: string;
}

export interface Contest {
  id: string;
  title: string;
  description: string;
  startTime: string;
  durationMinutes: number;
  status: 'upcoming' | 'active' | 'completed';
  problemIds: string[];
  participantsCount: number;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  iconName: string;
  category: 'solve' | 'streak' | 'mastery' | 'community';
  requirement: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'follow' | 'like' | 'comment' | 'streak' | 'contest' | 'badge' | 'milestone';
  read: boolean;
  timestamp: string;
  linkUrl?: string;
}

export interface AICoachMessage {
  id: string;
  sender: 'user' | 'coach';
  text: string;
  timestamp: string;
  hintLevel?: 1 | 2 | 3;
  codeSnippet?: string;
}

// =============================================================================
// PHASE 2 DATABASE SCHEMAS & RELATIONAL MODELS
// =============================================================================

export interface TopicRecord {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export interface PatternRecord {
  id: string;
  name: string;
  slug: string;
  description: string;
  when_to_use: string[];
  common_signals: string[];
  created_at: string;
}

export interface ProblemRecord {
  id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: Difficulty;
  estimated_time: string;
  acceptance_rate: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  input_format?: string;
  output_format?: string;
  notes?: string;
}

export interface ProblemTopicRecord {
  problem_id: string;
  topic_id: string;
}

export interface ProblemPatternRecord {
  problem_id: string;
  pattern_id: string;
}

export interface ProblemHintRecord {
  id: string;
  problem_id: string;
  hint_number: number;
  content: string;
}

export interface ProblemStarterCodeRecord {
  problem_id: string;
  language: SupportedLanguage;
  code: string;
}

export interface ProblemSolutionRecord {
  id: string;
  problem_id: string;
  approach_name: string;
  explanation: string;
  complexity: {
    time: string;
    space: string;
  };
  code_by_language: Record<string, string>;
  created_at: string;
}

export interface RoadmapRecord {
  id: string;
  name: string;
  slug: string;
  description: string;
  created_at: string;
}

export interface RoadmapSectionRecord {
  id: string;
  roadmap_id: string;
  name: string;
  description: string;
  position: number;
}

export interface RoadmapProblemRecord {
  roadmap_section_id: string;
  problem_id: string;
  position: number;
  is_required: boolean;
}

export interface UserProblemProgressRecord {
  id: string;
  user_id: string;
  problem_id: string;
  status: 'unattempted' | 'attempted' | 'solved';
  attempt_count: number;
  solved_at?: string;
  last_attempted_at?: string;
  best_runtime?: number;
  best_memory?: number;
  created_at: string;
  updated_at: string;
}

export interface SavedProblemRecord {
  user_id: string;
  problem_id: string;
  created_at: string;
}

export interface SubmissionRecord {
  id: string;
  user_id: string;
  problem_id: string;
  language: SupportedLanguage;
  code: string;
  status: SubmissionStatus;
  runtime: number;
  memory: number;
  created_at: string;
}

export interface SubmissionDraftRecord {
  user_id: string;
  problem_id: string;
  language: SupportedLanguage;
  code: string;
  updated_at: string;
}

export interface XpTransactionRecord {
  id: string;
  user_id: string;
  amount: number;
  reason: 'problem_solved' | 'lesson_completed' | 'daily_challenge' | 'roadmap_completed' | 'badge_earned';
  reference_type: string;
  reference_id: string;
  created_at: string;
}

export interface UserActivityRecord {
  id: string;
  user_id: string;
  activity_type: 'problem_attempted' | 'problem_solved' | 'submitted_solution' | 'lesson_completed' | 'roadmap_completed' | 'badge_earned';
  reference_id: string;
  created_at: string;
}

// =============================================================================
// PHASE 3 REAL EXECUTION & SUBMISSION SYSTEM TYPES
// =============================================================================

export type NormalizedJudgeVerdict = 
  | 'ACCEPTED'
  | 'WRONG_ANSWER'
  | 'TIME_LIMIT_EXCEEDED'
  | 'MEMORY_LIMIT_EXCEEDED'
  | 'RUNTIME_ERROR'
  | 'COMPILATION_ERROR'
  | 'SYSTEM_ERROR'
  | 'OUTPUT_LIMIT_EXCEEDED';

export interface ProblemTestCaseRecord {
  id: string;
  problem_id: string;
  input: any[] | string;
  expected_output: any;
  is_public: boolean;
  position: number;
  created_at: string;
}

export type ExecutionJobStatus = 'queued' | 'running' | 'completed' | 'failed';

export interface ExecutionJobRecord {
  id: string;
  submission_id?: string;
  status: ExecutionJobStatus;
  provider: string;
  started_at: string;
  completed_at?: string;
  error_code?: string;
  created_at: string;
}

export interface TestCaseExecutionResult {
  passed: boolean;
  testCaseId: string;
  position: number;
  isPublic: boolean;
  input?: any; // Only provided for public test cases
  expectedOutput?: any; // Only provided for public test cases
  actualOutput?: any; // Output from user program (masked for hidden if failed)
  runtimeMs: number;
  memoryKb?: number;
  errorMessage?: string;
}

export interface NormalizedExecutionResult {
  status: NormalizedJudgeVerdict;
  runtime_ms: number;
  memory_kb: number;
  total_test_cases: number;
  passed_test_cases: number;
  test_results: TestCaseExecutionResult[];
  compile_output?: string;
  error_message?: string;
  stdout?: string;
  stderr?: string;
  job_id?: string;
}

export interface CodeRunRequest {
  problem_id: string;
  language: SupportedLanguage;
  code: string;
}

export interface CodeRunResponse {
  success: boolean;
  status: NormalizedJudgeVerdict;
  runtime_ms: number;
  memory_kb: number;
  total_test_cases: number;
  passed_test_cases: number;
  test_results: TestCaseExecutionResult[];
  stdout?: string;
  stderr?: string;
  error_message?: string;
}

export interface CodeSubmitRequest {
  problem_id: string;
  language: SupportedLanguage;
  code: string;
  user_id: string;
}

export interface CodeSubmitResponse {
  success: boolean;
  status: NormalizedJudgeVerdict;
  runtime_ms: number;
  memory_kb: number;
  total_test_cases: number;
  passed_test_cases: number;
  test_results: TestCaseExecutionResult[];
  stdout?: string;
  stderr?: string;
  error_message?: string;
  submission_id: string;
  job_id: string;
  is_first_solve?: boolean;
  xp_awarded?: number;
  current_streak?: number;
  solved_problem_count?: number;
  next_recommended_problem?: {
    id: string;
    slug: string;
    title: string;
    difficulty: Difficulty;
    topic: string;
  };
}

// =============================================================================
// PHASE 5 COMPETITIVE CODING & PRACTICE TYPES
// =============================================================================

export interface StudyPlanProblem {
  problemId: string;
  title: string;
  slug: string;
  difficulty: Difficulty;
  topic: string;
  pattern: string;
  estimatedMinutes: number;
  isCompleted?: boolean;
}

export interface StudyPlanSection {
  id: string;
  title: string;
  description: string;
  position: number;
  problems: StudyPlanProblem[];
  isCompleted?: boolean;
  completionPercentage?: number;
}

export interface StudyPlan {
  id: string;
  slug: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  estimatedDuration: string;
  totalProblems: number;
  badgeIcon: string;
  sections: StudyPlanSection[];
  isEnrolled?: boolean;
  status?: 'not_started' | 'active' | 'paused' | 'completed';
  completedProblemsCount?: number;
  completionPercentage?: number;
  currentSectionTitle?: string;
  nextProblem?: StudyPlanProblem;
}

export interface UserStudyPlanProgress {
  userId: string;
  studyPlanId: string;
  status: 'active' | 'paused' | 'completed';
  enrolledAt: string;
  completedAt?: string;
  lastPracticedAt: string;
}

export interface PersonalProblemList {
  id: string;
  userId: string;
  title: string;
  description?: string;
  isPublic: boolean;
  problemIds: string[];
  createdAt: string;
  updatedAt: string;
  solvedCount?: number;
}

export interface UserProblemReview {
  id: string;
  userId: string;
  problemId: string;
  notes?: string;
  createdAt: string;
}

export interface DailyChallenge {
  id: string;
  date: string; // 'YYYY-MM-DD'
  problemId: string;
  problem?: Problem;
  bonusXp: number;
  status?: 'not_started' | 'attempted' | 'solved';
  isSolvedToday?: boolean;
}

export interface ContestProblemConfig {
  problemId: string;
  problem?: Problem;
  scorePoints: number;
  orderIndex: number;
}

export interface ContestRankingItem {
  userId: string;
  username: string;
  avatar: string;
  rank: number;
  score: number;
  solvedCount: number;
  penaltyMinutes: number;
  lastAcceptedAt?: string;
  ratingChange?: number;
  newRating?: number;
  problemStatuses: Record<string, {
    solved: boolean;
    attempts: number;
    timeMinutes?: number;
  }>;
}

export interface ContestRatingHistoryItem {
  contestId: string;
  contestTitle: string;
  date: string;
  rank: number;
  participantsCount: number;
  score: number;
  solvedCount: number;
  previousRating: number;
  ratingChange: number;
  newRating: number;
}

export interface AchievementItem {
  id: string;
  title: string;
  description: string;
  category: 'solve' | 'streak' | 'contest' | 'study_plan' | 'pattern';
  iconName: string;
  badgePoints: number;
  unlockedAt?: string;
  isUnlocked?: boolean;
  progress?: number;
  maxProgress?: number;
}

export interface InterviewSessionConfig {
  id: string;
  durationMinutes: 15 | 30 | 45 | 60;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Mixed';
  problemIds: string[];
  startedAt: string;
  endedAt?: string;
  solvedProblemIds: string[];
  selfEvaluation?: {
    communication: number; // 1-5
    optimality: number;    // 1-5
    codeQuality: number;   // 1-5
    notes?: string;
  };
  scorePercentage?: number;
}

export * from './spark.ts';
export * from './admin.ts';
