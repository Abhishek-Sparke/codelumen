import { Badge } from '../types';

export const ALL_BADGES: Badge[] = [
  { id: 'first-solve', title: 'First Solve', description: 'Solved your first algorithmic challenge on CodeSpark.', iconName: 'Award', category: 'solve', requirement: '1 problem solved' },
  { id: 'solve-10', title: '10 Problems', description: 'Solved 10 DSA problems across any topic.', iconName: 'Target', category: 'solve', requirement: '10 problems solved' },
  { id: 'solve-50', title: '50 Problems', description: 'Demonstrated consistent algorithmic mastery with 50 problems.', iconName: 'Zap', category: 'solve', requirement: '50 problems solved' },
  { id: 'solve-100', title: '100 Problems', description: 'Centurion of code. 100 solutions submitted and verified.', iconName: 'ShieldAlert', category: 'solve', requirement: '100 problems solved' },
  { id: 'streak-7', title: '7-Day Streak', description: 'Code every day for a full week without breaking the chain.', iconName: 'Flame', category: 'streak', requirement: '7 consecutive days' },
  { id: 'streak-30', title: '30-Day Streak', description: 'A month of relentless deliberate practice.', iconName: 'Sparkles', category: 'streak', requirement: '30 consecutive days' },
  { id: 'streak-100', title: '100-Day Streak', description: 'Unshakable discipline. Top 0.1% practicing developers.', iconName: 'Trophy', category: 'streak', requirement: '100 consecutive days' },
  { id: 'tree-master', title: 'Tree Master', description: 'Completed all Binary Tree and BST problem tiers.', iconName: 'GitBranch', category: 'mastery', requirement: 'Solve 8 Tree problems' },
  { id: 'graph-master', title: 'Graph Master', description: 'Conquered topological sort, Dijkstra, and cycle detection.', iconName: 'Network', category: 'mastery', requirement: 'Solve 8 Graph problems' },
  { id: 'dp-master', title: 'DP Master', description: 'Understood optimal substructure and state memoization.', iconName: 'Layers', category: 'mastery', requirement: 'Solve 8 DP problems' },
  { id: 'speed-solver', title: 'Speed Solver', description: 'Solved a Medium problem in under 10 minutes with 95%+ runtime.', iconName: 'Timer', category: 'solve', requirement: 'Fast solve verification' },
];

export function calculateLevel(xp: number): { level: number; title: string; nextLevelXp: number; currentLevelXp: number } {
  // Level progression
  if (xp >= 10000) return { level: 100, title: 'Master', nextLevelXp: 10000, currentLevelXp: 10000 };
  if (xp >= 6000) return { level: 75, title: 'Expert', nextLevelXp: 10000, currentLevelXp: 6000 };
  if (xp >= 3500) return { level: 50, title: 'Algorithmist', nextLevelXp: 6000, currentLevelXp: 3500 };
  if (xp >= 1500) return { level: 25, title: 'Problem Solver', nextLevelXp: 3500, currentLevelXp: 1500 };
  if (xp >= 500) return { level: 10, title: 'Apprentice', nextLevelXp: 1500, currentLevelXp: 500 };
  return { level: Math.max(1, Math.floor(xp / 50) + 1), title: 'Beginner', nextLevelXp: 500, currentLevelXp: 0 };
}
