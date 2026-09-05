import { Problem } from '../types';
import { ALL_PROBLEMS } from '../data/problems';
import { ROADMAP_STAGES } from '../data/roadmaps';

export class RecommendationService {
  /**
   * Deterministic 5-Tier Algorithmic Recommendation Engine:
   * Tier 1: Next unsolved problem in current roadmap stage
   * Tier 2: Next unsolved problem in matching topic
   * Tier 3: Next unsolved problem in matching pattern
   * Tier 4: Next unsolved problem matching user experience difficulty
   * Tier 5: Fallback to first unsolved problem in entire library
   */
  public static getNextProblem(
    currentProblemId: string,
    userSolvedProblemIds: string[],
    userExperience: 'Beginner' | 'Intermediate' | 'Advanced' = 'Beginner'
  ): Problem | null {
    const solvedSet = new Set(userSolvedProblemIds);
    const currentProb = ALL_PROBLEMS.find(p => p.id === currentProblemId);

    // 1. Tier 1: Next unsolved in active roadmap stage
    for (const stage of ROADMAP_STAGES) {
      if (stage.problemIds.includes(currentProblemId)) {
        const currentIndex = stage.problemIds.indexOf(currentProblemId);
        // Look ahead in stage
        for (let i = currentIndex + 1; i < stage.problemIds.length; i++) {
          const pid = stage.problemIds[i];
          if (!solvedSet.has(pid)) {
            const match = ALL_PROBLEMS.find(p => p.id === pid);
            if (match) return match;
          }
        }
        // Look behind in stage for any missed problems
        for (let i = 0; i < currentIndex; i++) {
          const pid = stage.problemIds[i];
          if (!solvedSet.has(pid)) {
            const match = ALL_PROBLEMS.find(p => p.id === pid);
            if (match) return match;
          }
        }
      }
    }

    // 2. Tier 2: Next unsolved in same topic
    if (currentProb) {
      const topicMatch = ALL_PROBLEMS.find(
        p => p.topic === currentProb.topic && p.id !== currentProblemId && !solvedSet.has(p.id)
      );
      if (topicMatch) return topicMatch;
    }

    // 3. Tier 3: Next unsolved in same pattern
    if (currentProb) {
      const patternMatch = ALL_PROBLEMS.find(
        p => p.pattern === currentProb.pattern && p.id !== currentProblemId && !solvedSet.has(p.id)
      );
      if (patternMatch) return patternMatch;
    }

    // 4. Tier 4: Match by user experience difficulty
    const targetDifficulty = userExperience === 'Advanced' ? 'Hard' : userExperience === 'Intermediate' ? 'Medium' : 'Easy';
    const diffMatch = ALL_PROBLEMS.find(
      p => p.difficulty === targetDifficulty && p.id !== currentProblemId && !solvedSet.has(p.id)
    );
    if (diffMatch) return diffMatch;

    // 5. Tier 5: Fallback to first unsolved in library
    const fallback = ALL_PROBLEMS.find(p => p.id !== currentProblemId && !solvedSet.has(p.id));
    return fallback || null;
  }
}
