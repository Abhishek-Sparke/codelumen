/**
 * CodeSpark Feature Flag System
 * Controls gradual rollouts, language support, and incident rollback capability.
 */

export interface FeatureFlags {
  CODE_EXECUTION_ENABLED: boolean;
  PYTHON_EXECUTION_ENABLED: boolean;
  JS_EXECUTION_ENABLED: boolean;
  CPP_EXECUTION_ENABLED: boolean;
  JAVA_EXECUTION_ENABLED: boolean;
  SPARK_AI_ENABLED: boolean;
  // Phase 5 Flags
  PROBLEM_LIBRARY_V2: boolean;
  STUDY_PLANS: boolean;
  DAILY_CHALLENGE: boolean;
  RECOMMENDATIONS: boolean;
  PERSONAL_LISTS: boolean;
  CONTESTS: boolean;
  CONTEST_RATINGS: boolean;
  ACHIEVEMENTS: boolean;
  INTERVIEW_MODE: boolean;
  FOCUS_MODE: boolean;
  // Phase 6 Spark AI Flags
  SPARK_AI: boolean;
  SPARK_HINTS: boolean;
  SPARK_DEBUG: boolean;
  SPARK_CODE_REVIEW: boolean;
  SPARK_COMPLEXITY: boolean;
  SPARK_RECOMMENDATIONS: boolean;
  SPARK_INTERVIEW_COACH: boolean;
  SPARK_WEEKLY_INSIGHTS: boolean;
}

const DEFAULT_FLAGS: FeatureFlags = {
  CODE_EXECUTION_ENABLED: true,
  PYTHON_EXECUTION_ENABLED: true,
  JS_EXECUTION_ENABLED: true,
  CPP_EXECUTION_ENABLED: false, // Disabled until compiler cluster is active
  JAVA_EXECUTION_ENABLED: false, // Disabled until compiler cluster is active
  SPARK_AI_ENABLED: true,
  // Phase 5 Flags (Enabled by default)
  PROBLEM_LIBRARY_V2: true,
  STUDY_PLANS: true,
  DAILY_CHALLENGE: true,
  RECOMMENDATIONS: true,
  PERSONAL_LISTS: true,
  CONTESTS: true,
  CONTEST_RATINGS: true,
  ACHIEVEMENTS: true,
  INTERVIEW_MODE: true,
  FOCUS_MODE: true,
  // Phase 6 Flags (Enabled by default)
  SPARK_AI: true,
  SPARK_HINTS: true,
  SPARK_DEBUG: true,
  SPARK_CODE_REVIEW: true,
  SPARK_COMPLEXITY: true,
  SPARK_RECOMMENDATIONS: true,
  SPARK_INTERVIEW_COACH: true,
  SPARK_WEEKLY_INSIGHTS: true,
};

export class FeatureFlagService {
  /**
   * Retrieves current flag state, checking environment variables first,
   * then localStorage override, falling back to defaults.
   */
  public static getFlag<K extends keyof FeatureFlags>(flag: K): boolean {
    try {
      // 1. Check client-side runtime emergency override
      const overrideKey = `codespark_flag_${flag}`;
      const localOverride = localStorage.getItem(overrideKey);
      if (localOverride !== null) {
        return localOverride === 'true';
      }

      // 2. Check Vite environment variables (VITE_FLAG_NAME)
      const envVal = (import.meta as any).env?.[`VITE_${flag}`];
      if (envVal !== undefined) {
        return envVal === 'true' || envVal === '1';
      }
    } catch {
      // Fall back to default safely
    }

    return DEFAULT_FLAGS[flag];
  }

  public static getAllFlags(): FeatureFlags {
    const flags = {} as FeatureFlags;
    for (const key of Object.keys(DEFAULT_FLAGS) as (keyof FeatureFlags)[]) {
      flags[key] = this.getFlag(key);
    }
    return flags;
  }

  /**
   * Set runtime override for incident management or testing
   */
  public static setOverride<K extends keyof FeatureFlags>(flag: K, enabled: boolean): void {
    try {
      localStorage.setItem(`codespark_flag_${flag}`, enabled ? 'true' : 'false');
    } catch (e) {
      console.error('Error setting flag override:', e);
    }
  }

  /**
   * Clears runtime overrides
   */
  public static clearOverrides(): void {
    try {
      Object.keys(DEFAULT_FLAGS).forEach(flag => {
        localStorage.removeItem(`codespark_flag_${flag}`);
      });
    } catch (e) {
      console.error('Error clearing flag overrides:', e);
    }
  }
}
