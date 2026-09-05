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

export interface DiscussionComment {
  id: string;
  author: {
    id: string;
    name: string;
    username: string;
    avatar: string;
  };
  content: string;
  createdAt: string;
  likes: number;
  hasLiked?: boolean;
}

export interface DiscussionPost {
  id: string;
  title: string;
  problemId?: string;
  problemTitle?: string;
  author: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    levelTitle: string;
  };
  content: string;
  tags: string[];
  likes: number;
  hasLiked?: boolean;
  commentsCount: number;
  createdAt: string;
  comments: DiscussionComment[];
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

