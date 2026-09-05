export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type SupportedLanguage = 'python' | 'javascript' | 'cpp' | 'java' | 'go' | 'rust';

export type SubmissionStatus = 
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
