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
}

const DEFAULT_FLAGS: FeatureFlags = {
  CODE_EXECUTION_ENABLED: true,
  PYTHON_EXECUTION_ENABLED: true,
  JS_EXECUTION_ENABLED: true,
  CPP_EXECUTION_ENABLED: false, // Disabled until compiler cluster is active
  JAVA_EXECUTION_ENABLED: false, // Disabled until compiler cluster is active
  SPARK_AI_ENABLED: true,
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
