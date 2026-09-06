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
    return {
      CODE_EXECUTION_ENABLED: this.getFlag('CODE_EXECUTION_ENABLED'),
      PYTHON_EXECUTION_ENABLED: this.getFlag('PYTHON_EXECUTION_ENABLED'),
      JS_EXECUTION_ENABLED: this.getFlag('JS_EXECUTION_ENABLED'),
      CPP_EXECUTION_ENABLED: this.getFlag('CPP_EXECUTION_ENABLED'),
      JAVA_EXECUTION_ENABLED: this.getFlag('JAVA_EXECUTION_ENABLED'),
      SPARK_AI_ENABLED: this.getFlag('SPARK_AI_ENABLED'),
      PROBLEM_LIBRARY_V2: this.getFlag('PROBLEM_LIBRARY_V2'),
      STUDY_PLANS: this.getFlag('STUDY_PLANS'),
      DAILY_CHALLENGE: this.getFlag('DAILY_CHALLENGE'),
      RECOMMENDATIONS: this.getFlag('RECOMMENDATIONS'),
      PERSONAL_LISTS: this.getFlag('PERSONAL_LISTS'),
      CONTESTS: this.getFlag('CONTESTS'),
      CONTEST_RATINGS: this.getFlag('CONTEST_RATINGS'),
      ACHIEVEMENTS: this.getFlag('ACHIEVEMENTS'),
      INTERVIEW_MODE: this.getFlag('INTERVIEW_MODE'),
      FOCUS_MODE: this.getFlag('FOCUS_MODE'),
    };
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
