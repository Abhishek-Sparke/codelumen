/**
 * CodeSpark Achievements Registry
 * Event-driven achievement system with idempotent unlocking.
 */
export interface AchievementDefinition {
  id: string;
  title: string;
  description: string;
  category: 'solve' | 'streak' | 'contest' | 'study' | 'pattern' | 'daily' | 'community';
  icon: string;
  badgePoints: number;
  criteriaType: 'problems_solved' | 'streak_days' | 'contests_completed' | 'study_plan_completed' | 'patterns_mastered' | 'daily_challenges' | 'first_action' | 'difficulty_solved';
  criteriaThreshold: number;
  /** Optional: additional qualifier (e.g., difficulty level) */
  criteriaQualifier?: string;
}

export const ACHIEVEMENTS_REGISTRY: AchievementDefinition[] = [
  // SOLVE milestones
  {
    id: 'first-spark',
    title: 'First Spark',
    description: 'Solve your very first problem on CodeSpark.',
    category: 'solve',
    icon: 'Sparkles',
    badgePoints: 50,
    criteriaType: 'first_action',
    criteriaThreshold: 1
  },
  {
    id: 'problem-solver-10',
    title: 'Problem Solver',
    description: 'Solve 10 problems across any difficulty.',
    category: 'solve',
    icon: 'CheckCircle',
    badgePoints: 100,
    criteriaType: 'problems_solved',
    criteriaThreshold: 10
  },
  {
    id: 'half-century',
    title: 'Half Century',
    description: 'Solve 50 problems — you are officially serious about this.',
    category: 'solve',
    icon: 'Award',
    badgePoints: 250,
    criteriaType: 'problems_solved',
    criteriaThreshold: 50
  },
  {
    id: 'centurion',
    title: 'Centurion',
    description: 'Solve 100 problems. Mastery takes dedication.',
    category: 'solve',
    icon: 'Crown',
    badgePoints: 500,
    criteriaType: 'problems_solved',
    criteriaThreshold: 100
  },
  {
    id: 'easy-master',
    title: 'Easy Master',
    description: 'Solve 10 Easy problems.',
    category: 'solve',
    icon: 'Leaf',
    badgePoints: 75,
    criteriaType: 'difficulty_solved',
    criteriaThreshold: 10,
    criteriaQualifier: 'Easy'
  },
  {
    id: 'medium-warrior',
    title: 'Medium Warrior',
    description: 'Solve 10 Medium problems.',
    category: 'solve',
    icon: 'Sword',
    badgePoints: 150,
    criteriaType: 'difficulty_solved',
    criteriaThreshold: 10,
    criteriaQualifier: 'Medium'
  },
  {
    id: 'hard-conqueror',
    title: 'Hard Conqueror',
    description: 'Solve 5 Hard problems — only the fearless reach here.',
    category: 'solve',
    icon: 'Flame',
    badgePoints: 300,
    criteriaType: 'difficulty_solved',
    criteriaThreshold: 5,
    criteriaQualifier: 'Hard'
  },

  // STREAK milestones
  {
    id: 'streak-7',
    title: 'Week Warrior',
    description: 'Maintain a 7-day solve streak.',
    category: 'streak',
    icon: 'Flame',
    badgePoints: 100,
    criteriaType: 'streak_days',
    criteriaThreshold: 7
  },
  {
    id: 'streak-30',
    title: 'Monthly Grind',
    description: 'Maintain a 30-day solve streak. Consistency is mastery.',
    category: 'streak',
    icon: 'Calendar',
    badgePoints: 300,
    criteriaType: 'streak_days',
    criteriaThreshold: 30
  },
  {
    id: 'streak-100',
    title: 'Century Streak',
    description: '100 consecutive days of coding. Legendary dedication.',
    category: 'streak',
    icon: 'Star',
    badgePoints: 1000,
    criteriaType: 'streak_days',
    criteriaThreshold: 100
  },

  // CONTEST milestones
  {
    id: 'first-contest',
    title: 'Arena Debut',
    description: 'Complete your first contest.',
    category: 'contest',
    icon: 'Swords',
    badgePoints: 100,
    criteriaType: 'contests_completed',
    criteriaThreshold: 1
  },
  {
    id: 'contest-veteran',
    title: 'Contest Veteran',
    description: 'Complete 5 contests.',
    category: 'contest',
    icon: 'Trophy',
    badgePoints: 250,
    criteriaType: 'contests_completed',
    criteriaThreshold: 5
  },

  // STUDY PLAN milestones
  {
    id: 'plan-completer',
    title: 'Plan Completer',
    description: 'Complete your first study plan from start to finish.',
    category: 'study',
    icon: 'BookOpen',
    badgePoints: 200,
    criteriaType: 'study_plan_completed',
    criteriaThreshold: 1
  },

  // DAILY CHALLENGE milestones
  {
    id: 'daily-7',
    title: 'Daily Devotee',
    description: 'Solve 7 daily challenges.',
    category: 'daily',
    icon: 'Sun',
    badgePoints: 100,
    criteriaType: 'daily_challenges',
    criteriaThreshold: 7
  },
  {
    id: 'daily-30',
    title: 'Daily Champion',
    description: 'Solve 30 daily challenges.',
    category: 'daily',
    icon: 'Sunrise',
    badgePoints: 300,
    criteriaType: 'daily_challenges',
    criteriaThreshold: 30
  },

  // PATTERN milestones
  {
    id: 'pattern-explorer',
    title: 'Pattern Explorer',
    description: 'Master your first algorithmic pattern (≥80% solved).',
    category: 'pattern',
    icon: 'Compass',
    badgePoints: 150,
    criteriaType: 'patterns_mastered',
    criteriaThreshold: 1
  },
  {
    id: 'pattern-master',
    title: 'Pattern Master',
    description: 'Master 5 different algorithmic patterns.',
    category: 'pattern',
    icon: 'Brain',
    badgePoints: 500,
    criteriaType: 'patterns_mastered',
    criteriaThreshold: 5
  }
];

export function getAchievementById(id: string): AchievementDefinition | undefined {
  return ACHIEVEMENTS_REGISTRY.find(a => a.id === id);
}

export function getAchievementsByCategory(category: AchievementDefinition['category']): AchievementDefinition[] {
  return ACHIEVEMENTS_REGISTRY.filter(a => a.category === category);
}
