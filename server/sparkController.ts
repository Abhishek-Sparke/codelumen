import { GroundedMentorEngine, SparkAIProvider } from './spark/sparkProvider';
import { SparkActionType, SparkPromptContext, SparkResponse } from '../src/types/spark';

// Secret patterns for redaction (Tokens, Bearer, AWS, Private Keys, Passwords)
const SECRET_PATTERNS = [
  /AKIA[0-9A-Z]{16}/g,                                // AWS Access Key
  /AIza[0-9A-Za-z-_]{35}/g,                           // Google API Key
  /ghp_[0-9a-zA-Z]{36}/g,                             // GitHub Personal Access Token
  /sk-[a-zA-Z0-9]{20,}/g,                             // OpenAI / Anthropic Key
  /Bearer\s+[A-Za-z0-9\-\._~\+\/]+=*/gi,              // Bearer Tokens
  /password\s*[:=]\s*['"][^'"]+['"]/gi,               // Hardcoded password
  /secret\s*[:=]\s*['"][^'"]+['"]/gi                  // Hardcoded secret
];

// In-memory rate limiting state: key -> timestamps array
const rateLimitStore = new Map<string, number[]>();
const WINDOW_MS = 60 * 60 * 1000; // 1 hour sliding window
const ACTION_LIMITS: Record<SparkActionType, number> = {
  hint: 30,
  debug: 20,
  pattern: 30,
  approach: 20,
  review: 20,
  complexity: 30,
  submission_analysis: 40,
  concept: 30,
  recommendation: 30,
  interview_coach: 25,
  refine_discussion: 20
};

/**
 * Redacts visible secrets from code or text inputs before analysis.
 */
export function redactSecrets(input: string): string {
  if (!input) return '';
  let cleaned = input;
  for (const pattern of SECRET_PATTERNS) {
    cleaned = cleaned.replace(pattern, '[REDACTED_SECRET]');
  }
  return cleaned;
}

/**
 * Rate limit check per user and action.
 */
export function checkSparkRateLimit(userId: string, action: SparkActionType): { allowed: boolean; remaining: number; resetInSec: number } {
  const now = Date.now();
  const key = `${userId}:${action}`;
  const timestamps = rateLimitStore.get(key) || [];
  
  const valid = timestamps.filter(t => now - t < WINDOW_MS);
  const limit = ACTION_LIMITS[action] || 20;

  if (valid.length >= limit) {
    const oldest = valid[0] || now;
    const resetInSec = Math.ceil((oldest + WINDOW_MS - now) / 1000);
    return { allowed: false, remaining: 0, resetInSec };
  }

  valid.push(now);
  rateLimitStore.set(key, valid);

  return { 
    allowed: true, 
    remaining: Math.max(0, limit - valid.length), 
    resetInSec: Math.ceil(WINDOW_MS / 1000) 
  };
}

// Default provider instance
const mentorEngine: SparkAIProvider = new GroundedMentorEngine();

/**
 * Main Controller for POST /api/spark/action
 */
export async function handleSparkAction(body: {
  action: SparkActionType;
  userId?: string;
  context: SparkPromptContext;
  options?: Record<string, any>;
}): Promise<{ status: number; data: SparkResponse }> {
  const { action, userId = 'anonymous', context, options = {} } = body;

  if (!action) {
    return {
      status: 400,
      data: {
        success: false,
        action: 'hint',
        title: 'Missing Action',
        summary: 'No action specified for Spark AI.',
        content: 'Please provide a valid action type.'
      }
    };
  }

  // 1. Rate Limiting Check
  const rateLimit = checkSparkRateLimit(userId, action);
  if (!rateLimit.allowed) {
    return {
      status: 429,
      data: {
        success: false,
        action,
        title: 'Rate Limit Exceeded',
        summary: `You have reached the hourly limit for Spark ${action} assistance.`,
        content: `To ensure fair access, Spark ${action} requests are capped. Please try again in **${rateLimit.resetInSec} seconds**, or continue solving independently!`,
        badges: [{ type: 'warning', label: 'Rate Limit Cooldown' }]
      }
    };
  }

  // 2. Secret Redaction on Code and Freeform Text
  const sanitizedContext: SparkPromptContext = {
    ...context,
    code: context.code ? redactSecrets(context.code) : undefined,
    visibleError: context.visibleError ? redactSecrets(context.visibleError) : undefined,
    approachText: context.approachText ? redactSecrets(context.approachText) : undefined,
    conceptQuery: context.conceptQuery ? redactSecrets(context.conceptQuery) : undefined
  };

  try {
    const result = await mentorEngine.processAction(action, sanitizedContext, options);
    return {
      status: 200,
      data: result
    };
  } catch (err: any) {
    console.error('[SparkAI Error]:', err);
    return {
      status: 500,
      data: {
        success: false,
        action,
        title: 'Spark AI Temporarily Unavailable',
        summary: 'An internal mentor engine error occurred.',
        content: 'Spark AI encountered an unexpected issue while processing your request. Your coding environment remains fully operational.'
      }
    };
  }
}

export const sparkController = {
  handleAction: handleSparkAction
};
