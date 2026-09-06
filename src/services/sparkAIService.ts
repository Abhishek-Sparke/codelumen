import { FeatureFlagService } from './featureFlags';
import { StorageService } from './storage';
import { 
  SparkActionType, 
  SparkHintLevel, 
  SparkPromptContext, 
  SparkResponse, 
  SparkFeedback,
  SparkSettings 
} from '../types/spark';

// Client-side cache for deterministic responses
const responseCache = new Map<string, SparkResponse>();

const DEFAULT_SETTINGS: SparkSettings = {
  learningMode: true, // Default to Anti-Spoiler mode
  shareCodeContext: true,
  shareErrorContext: true,
  shareProgressContext: true
};

const SETTINGS_STORAGE_KEY = 'codespark_spark_settings';
const FEEDBACK_STORAGE_KEY = 'codespark_spark_feedback';

export class SparkAIService {
  /**
   * Retrieves active Spark settings
   */
  public static getSettings(): SparkSettings {
    try {
      if (typeof localStorage === 'undefined') return DEFAULT_SETTINGS;
      const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    } catch {}
    return DEFAULT_SETTINGS;
  }

  /**
   * Saves updated Spark settings
   */
  public static saveSettings(updated: Partial<SparkSettings>): SparkSettings {
    const current = this.getSettings();
    const next = { ...current, ...updated };
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(next));
      }
    } catch {}
    return next;
  }

  public static isLearningMode(): boolean {
    return this.getSettings().learningMode;
  }

  public static setLearningMode(enabled: boolean): void {
    this.saveSettings({ learningMode: enabled });
  }

  /**
   * Scans user code for accidental API keys or secrets before sending.
   */
  public static detectPotentialSecrets(code: string): boolean {
    if (!code) return false;
    const suspicious = [
      /AKIA[0-9A-Z]{16}/,
      /AIza[0-9A-Za-z-_]{35}/,
      /ghp_[0-9a-zA-Z]{36}/,
      /sk-[a-zA-Z0-9]{20,}/,
      /Bearer\s+[A-Za-z0-9\-\._~\+\/]+=*/i
    ];
    return suspicious.some(pattern => pattern.test(code));
  }

  /**
   * Core dispatch method sending requests to server-side `/api/spark/action`.
   * If server API is not reached (e.g. pure static SPA on Vercel), executes safe local fallback.
   */
  public static async executeAction(
    action: SparkActionType, 
    context: SparkPromptContext, 
    options: Record<string, any> = {}
  ): Promise<SparkResponse> {
    // 1. Feature Flag check
    if (!FeatureFlagService.getFlag('SPARK_AI')) {
      return {
        success: false,
        action,
        title: 'Spark AI Disabled',
        summary: 'Spark AI features are currently toggled off.',
        content: 'Spark AI is temporarily disabled. You can continue solving problems in standard mode.'
      };
    }

    const settings = this.getSettings();
    const learningMode = options.learningMode !== undefined ? options.learningMode : settings.learningMode;

    // Filter context according to user's privacy settings
    const filteredContext: SparkPromptContext = {
      ...context,
      code: settings.shareCodeContext ? context.code : undefined,
      visibleError: settings.shareErrorContext ? context.visibleError : undefined
    };

    // Cache key for idempotent queries
    const cacheKey = `${action}:${context.problem?.id || 'none'}:${options.level || 0}:${learningMode}`;
    if ((action === 'pattern' || action === 'complexity' || action === 'concept') && responseCache.has(cacheKey)) {
      return responseCache.get(cacheKey)!;
    }

    const currentUser = StorageService.getCurrentUser();
    const userId = currentUser?.id || 'guest';

    // 2. Attempt server-side call
    try {
      const response = await fetch('/api/spark/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          userId,
          context: filteredContext,
          options: { ...options, learningMode }
        })
      });

      if (response.ok) {
        const data: SparkResponse = await response.json();
        if (data.success && (action === 'pattern' || action === 'complexity' || action === 'concept')) {
          responseCache.set(cacheKey, data);
        }
        return data;
      }
    } catch (err) {
      // Network or static deployment: continue to safe client-side mentor engine fallback
    }

    // 3. Resilient Client Fallback: Dynamic import of GroundedMentorEngine
    return this.clientFallbackEngine(action, filteredContext, { ...options, learningMode });
  }

  /**
   * Safe in-memory fallback mentor engine if network or server API is unreachable
   */
  private static clientFallbackEngine(
    action: SparkActionType, 
    ctx: SparkPromptContext, 
    options: Record<string, any>
  ): SparkResponse {
    const pattern = ctx.problem?.pattern || 'Two Pointers';
    const title = ctx.problem?.title || 'this problem';
    const level = (options.level || 1) as SparkHintLevel;
    const learningMode = options.learningMode !== false;

    if (action === 'hint') {
      if (level === 1) {
        return {
          success: true,
          action: 'hint',
          hintLevel: 1,
          title: `Hint 1: Problem Intuition — ${title}`,
          summary: 'Reflect on what the problem is truly asking.',
          content: learningMode
            ? `### 💡 Question to Consider\n\nWhen processing the input, what information must you remember from earlier elements?\n\n- Can you avoid checking previous elements multiple times by recording them?\n- What would you write on paper as you scan from left to right?`
            : `### 💡 Conceptual Pointer\n\nLook for an invariant that holds true as you traverse the collection. Avoid nested loops by remembering seen elements.`,
          badges: [{ type: 'pattern', label: `Pattern: ${pattern}` }],
          nextHintAvailable: true,
          nextHintLevel: 2,
          learningModeActive: learningMode
        };
      }
      if (level === 2) {
        return {
          success: true,
          action: 'hint',
          hintLevel: 2,
          title: `Hint 2: Pattern Recognition — ${pattern}`,
          summary: `The algorithmic pattern for this problem is ${pattern}.`,
          content: `### 🔍 Recognizing ${pattern}\n\nThis problem matches the **${pattern}** pattern. A linear traversal paired with an auxiliary lookup structure (like a hash map or stack) allows O(1) state resolution.`,
          badges: [{ type: 'pattern', label: pattern }],
          nextHintAvailable: true,
          nextHintLevel: 3,
          learningModeActive: learningMode
        };
      }
      if (level === 3) {
        return {
          success: true,
          action: 'hint',
          hintLevel: 3,
          title: 'Hint 3: Key Mathematical / Logical Invariant',
          summary: 'Core condition required at step i.',
          content: `### ⚡ Core Invariant\n\nAt each step, calculate the required complement or state transition. Always verify the match **before** updating current state to prevent self-pairing.`,
          badges: [{ type: 'tip', label: 'Key Invariant' }],
          nextHintAvailable: true,
          nextHintLevel: 4,
          learningModeActive: learningMode
        };
      }
      if (level === 4) {
        return {
          success: true,
          action: 'hint',
          hintLevel: 4,
          title: 'Hint 4: Step-by-Step Approach',
          summary: 'Algorithmic blueprint ready for implementation.',
          content: `### 🛠️ Algorithmic Blueprint\n\n1. Initialize your lookup structure.\n2. Iterate through items with index and value.\n3. Check if target condition matches in the lookup table.\n4. Save current item for future matches.\n5. Return result.`,
          badges: [{ type: 'tip', label: 'Blueprint' }],
          nextHintAvailable: true,
          nextHintLevel: 5,
          learningModeActive: learningMode
        };
      }
      return {
        success: true,
        action: 'hint',
        hintLevel: 5,
        title: 'Hint 5: Solution Formulation',
        summary: 'Reference solution and complexity guidelines.',
        content: `### 📖 Solution Approach\n\n\`\`\`python\n# Optimal single-pass pattern\nseen = {}\nfor i, num in enumerate(nums):\n    comp = target - num\n    if comp in seen:\n        return [seen[comp], i]\n    seen[num] = i\n\`\`\`\n\n- Time: Approximately O(n)\n- Space: Approximately O(n)`,
        badges: [{ type: 'complexity', label: 'Time: O(n)' }],
        nextHintAvailable: false
      };
    }

    if (action === 'pattern') {
      return {
        success: true,
        action: 'pattern',
        title: `Algorithmic Pattern: ${pattern}`,
        summary: `Why ${pattern} applies to "${title}".`,
        content: `### 🎯 Pattern: ${pattern}\n\nThis problem requires recognizing bounds and invariants. By employing ${pattern}, you eliminate redundant nested rescanning.`,
        badges: [{ type: 'pattern', label: pattern }]
      };
    }

    if (action === 'complexity') {
      return {
        success: true,
        action: 'complexity',
        title: 'Asymptotic Complexity Breakdown',
        summary: 'Estimated time and memory costs.',
        content: `### ⏱️ Time Complexity: Approximately O(n)\nSingle pass over the input elements.\n\n### 💾 Space Complexity: Approximately O(n)\nAuxiliary hash storage for historical elements.`,
        badges: [
          { type: 'complexity', label: 'Time: O(n)' },
          { type: 'complexity', label: 'Space: O(n)' }
        ]
      };
    }

    if (action === 'submission_analysis') {
      const status = ctx.executionStatus || 'Wrong Answer';
      return {
        success: true,
        action: 'submission_analysis',
        title: `${status}: Logic & Invariant Inspection`,
        summary: 'Diagnostic feedback on edge conditions.',
        content: `### ⚠️ Diagnostic Breakdown\n\nReview the order of operations in your loop. Ensure zero, negative, and duplicate inputs do not violate index bounds or produce incorrect outputs.`,
        badges: [{ type: 'warning', label: status }]
      };
    }

    return {
      success: true,
      action,
      title: 'Spark AI Mentor Guidance',
      summary: 'Contextual learning insight.',
      content: `### 💡 Mentor Tip\n\nReview the problem constraints, step through your loop invariants, and verify boundary edge cases.`
    };
  }

  /**
   * Records user feedback (thumbs up / down)
   */
  public static recordFeedback(feedback: Omit<SparkFeedback, 'id' | 'createdAt'>): void {
    try {
      if (typeof localStorage === 'undefined') return;
      const raw = localStorage.getItem(FEEDBACK_STORAGE_KEY);
      const items: SparkFeedback[] = raw ? JSON.parse(raw) : [];
      items.push({
        ...feedback,
        id: `fb-${Date.now()}`,
        createdAt: new Date().toISOString()
      });
      localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(items.slice(-50)));
    } catch {}
  }
}
