import { Problem, SupportedLanguage, ExperienceLevel } from './index';

export type SparkActionType = 
  | 'hint'
  | 'debug'
  | 'pattern'
  | 'approach'
  | 'review'
  | 'complexity'
  | 'submission_analysis'
  | 'concept'
  | 'recommendation'
  | 'interview_coach'
  | 'refine_discussion';

export type SparkHintLevel = 1 | 2 | 3 | 4 | 5;

export interface SparkBadge {
  type: 'pattern' | 'complexity' | 'tip' | 'warning';
  label: string;
}

export interface SparkDiffSuggestion {
  originalCode: string;
  suggestedCode: string;
  explanation: string;
  lineStart?: number;
  lineEnd?: number;
}

export interface SparkPromptContext {
  problem?: {
    id: string;
    slug?: string;
    title: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    pattern: string;
    topic: string;
    description: string;
    constraints: string[];
    starterCode?: Partial<Record<SupportedLanguage, string>>;
    solutionCode?: Partial<Record<SupportedLanguage, string>>;
    timeComplexity?: string;
    spaceComplexity?: string;
  };
  code?: string;
  language?: SupportedLanguage;
  visibleError?: string;
  executionStatus?: string;
  runtimeMs?: number;
  memoryKb?: number;
  testCaseSummary?: {
    passed: number;
    total: number;
    failedInput?: string;
    failedExpected?: string;
    failedActual?: string;
  };
  approachText?: string;
  conceptQuery?: string;
  interviewMode?: 'practice' | 'interview' | 'strict';
  userExperienceLevel?: ExperienceLevel;
  studyPlanTitle?: string;
}

export interface SparkResponse {
  success: boolean;
  action: SparkActionType;
  title: string;
  summary: string;
  content: string;
  badges?: SparkBadge[];
  sections?: {
    title: string;
    content: string;
  }[];
  diff?: SparkDiffSuggestion;
  hintLevel?: SparkHintLevel;
  nextHintAvailable?: boolean;
  nextHintLevel?: SparkHintLevel;
  learningModeActive?: boolean;
  suggestedActions?: {
    label: string;
    action: SparkActionType;
    hintLevel?: SparkHintLevel;
  }[];
  error?: string;
}

export interface SparkRateLimitState {
  remainingHints: number;
  remainingDebugs: number;
  remainingReviews: number;
  resetsAt: number;
}

export interface SparkFeedback {
  id: string;
  action: SparkActionType;
  problemId?: string;
  helpful: boolean;
  comment?: string;
  createdAt: string;
}

export interface SparkSettings {
  learningMode: boolean; // Anti-spoiler mode
  shareCodeContext: boolean;
  shareErrorContext: boolean;
  shareProgressContext: boolean;
}
