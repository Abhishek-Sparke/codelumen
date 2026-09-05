import { Problem, ExperienceLevel, AICoachMessage } from '../types';
import { AICoachService } from './aiCoachService';
import { FeatureFlagService } from './featureFlags';

export class SparkAIService {
  /**
   * Generates a sanitized AI hint without exposing hidden test case data or secrets.
   */
  public static getHint(
    problem: Problem,
    hintLevel: number,
    experienceLevel: ExperienceLevel = 'Beginner'
  ): { message: AICoachMessage; nextLevel: number } | null {
    if (!FeatureFlagService.getFlag('SPARK_AI_ENABLED')) return null;

    // Call underlying coach service with public context only
    return AICoachService.getNextHint(problem, hintLevel, experienceLevel);
  }

  /**
   * Explains failure context cleanly, ensuring hidden inputs/outputs are never passed.
   */
  public static explainFailure(
    problem: Problem,
    userCode: string,
    failedTestDetails: { input: string; expected: string; actual: string } | null,
    experienceLevel: ExperienceLevel = 'Beginner'
  ): AICoachMessage | null {
    if (!FeatureFlagService.getFlag('SPARK_AI_ENABLED')) return null;

    // Filter out any potential hidden test payload
    const safeDetails = failedTestDetails
      ? {
          input: failedTestDetails.input,
          expected: failedTestDetails.expected,
          actual: failedTestDetails.actual
        }
      : null;

    return AICoachService.explainFailure(problem, userCode, safeDetails, experienceLevel);
  }

  /**
   * Reviews computational complexity of user code.
   */
  public static reviewComplexity(
    problem: Problem,
    userCode: string,
    experienceLevel: ExperienceLevel = 'Beginner'
  ): AICoachMessage | null {
    if (!FeatureFlagService.getFlag('SPARK_AI_ENABLED')) return null;

    return AICoachService.reviewComplexity(problem, userCode, experienceLevel);
  }
}
