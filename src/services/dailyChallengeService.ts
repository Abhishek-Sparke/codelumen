import { ALL_PROBLEMS } from '../data/problems';
import { Problem } from '../types';

/**
 * Deterministic Daily Challenge Service
 * Same date always produces the same challenge for all users.
 * Uses a hash of the date string to select a problem index.
 */
export class DailyChallengeService {
  /**
   * Simple string hash for deterministic problem selection
   */
  private static hashDate(dateStr: string): number {
    let hash = 0;
    for (let i = 0; i < dateStr.length; i++) {
      const char = dateStr.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Get today's date as YYYY-MM-DD
   */
  static getToday(): string {
    return new Date().toISOString().split('T')[0];
  }

  /**
   * Get the daily challenge problem for a given date.
   * Deterministic: same date = same problem for all users.
   */
  static getDailyProblem(dateStr?: string): { problem: Problem; date: string } | null {
    const date = dateStr || this.getToday();
    const publishedProblems = ALL_PROBLEMS.filter(p => p.isPublished !== false);
    if (publishedProblems.length === 0) return null;

    const hash = this.hashDate(date);
    const index = hash % publishedProblems.length;
    return {
      problem: publishedProblems[index],
      date
    };
  }

  /**
   * Get daily challenges for the past N days (for streak display)
   */
  static getRecentChallenges(days: number = 7): { problem: Problem; date: string }[] {
    const challenges: { problem: Problem; date: string }[] = [];
    const today = new Date();
    
    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const challenge = this.getDailyProblem(dateStr);
      if (challenge) challenges.push(challenge);
    }
    
    return challenges;
  }
}
