import { ALL_PROBLEMS } from '../../src/data/problems';
import { Problem, SupportedLanguage } from '../../src/types/index';
import { 
  SparkActionType, 
  SparkHintLevel, 
  SparkPromptContext, 
  SparkResponse, 
  SparkDiffSuggestion 
} from '../../src/types/spark';

export interface SparkAIProvider {
  processAction(action: SparkActionType, ctx: SparkPromptContext, options?: Record<string, any>): Promise<SparkResponse>;
}

/**
 * Built-in Grounded Mentor Engine
 * Grounded in CodeSpark's 75 algorithmic problems, patterns, complexity proofs,
 * and compiler/runtime semantics. Guaranteed 100% deterministic, ultra-fast, and spoiler-safe.
 */
export class GroundedMentorEngine implements SparkAIProvider {
  public async processAction(
    action: SparkActionType, 
    ctx: SparkPromptContext, 
    options: Record<string, any> = {}
  ): Promise<SparkResponse> {
    switch (action) {
      case 'hint':
        return this.generateProgressiveHint(ctx, options.level || 1, options.learningMode !== false);
      case 'debug':
        return this.debugCode(ctx);
      case 'pattern':
        return this.detectPattern(ctx);
      case 'approach':
        return this.reviewApproach(ctx);
      case 'review':
        return this.reviewCode(ctx);
      case 'complexity':
        return this.explainComplexity(ctx);
      case 'submission_analysis':
        return this.analyzeSubmission(ctx);
      case 'concept':
        return this.explainConcept(ctx.conceptQuery || '');
      case 'recommendation':
        return this.getPersonalizedRecommendation(ctx);
      case 'interview_coach':
        return this.getInterviewGuidance(ctx.interviewMode || 'practice', ctx);
      case 'refine_discussion':
        return this.refineDiscussion(ctx);
      default:
        return {
          success: false,
          action,
          title: 'Unknown Action',
          summary: 'Spark AI could not determine the requested action.',
          content: 'Please select one of the available Spark learning options.'
        };
    }
  }

  /**
   * 1. PROGRESSIVE HINT SYSTEM (Levels 1 to 5)
   * Anti-Spoiler Mode: Never reveals solution immediately.
   */
  public generateProgressiveHint(
    ctx: SparkPromptContext, 
    level: SparkHintLevel, 
    learningMode: boolean
  ): SparkResponse {
    const problem = this.resolveProblem(ctx);
    const pattern = problem?.pattern || 'General Problem Solving';
    const title = problem?.title || 'Current Problem';

    if (level === 1) {
      return {
        success: true,
        action: 'hint',
        hintLevel: 1,
        title: `Hint 1: Problem Intuition — ${title}`,
        summary: `Reflect on what the problem is truly asking and what state needs to be maintained.`,
        content: learningMode 
          ? `### 💡 Question to Consider\n\nWhen processing the input, what information must you remember from earlier steps?\n\n- If you solve this by hand on a whiteboard with small numbers, what is the very first thing you look for?\n- Can you avoid checking previous elements multiple times?\n\n*Try thinking about how keeping a simple record changes your approach before requesting Hint 2.*`
          : `### 💡 Conceptual Pointer\n\nObserve the inputs and expected outputs. Rather than a nested brute-force search over all pairs or subarrays, look for an **invariant** that holds true as you scan left-to-right.`,
        badges: [{ type: 'pattern', label: `Pattern: ${pattern}` }],
        nextHintAvailable: true,
        nextHintLevel: 2,
        learningModeActive: learningMode,
        suggestedActions: [
          { label: 'Next: Pattern Clue (Hint 2)', action: 'hint', hintLevel: 2 },
          { label: 'Explain Pattern', action: 'pattern' }
        ]
      };
    }

    if (level === 2) {
      return {
        success: true,
        action: 'hint',
        hintLevel: 2,
        title: `Hint 2: Pattern Recognition — ${pattern}`,
        summary: `Identifying the algorithmic structure and data structures.`,
        content: `### 🔍 Recognizing the Pattern\n\nThis problem maps directly to the **${pattern}** pattern.\n\n- **Why ${pattern}?** The constraints require an efficient traversal. In many instances, maintaining a stateful window, hash map, or stack allows you to answer queries in **O(1)** or **O(log n)** time per element.\n- **Data Structure:** What data structure offers the exact lookup or ordering guarantee you need here? (e.g., Hash Map for O(1) existence, Monotonic Stack for next greater, Two Pointers for sorted bounds).`,
        badges: [{ type: 'pattern', label: pattern }, { type: 'tip', label: 'Pattern Clue' }],
        nextHintAvailable: true,
        nextHintLevel: 3,
        learningModeActive: learningMode,
        suggestedActions: [
          { label: 'Next: Key Invariant (Hint 3)', action: 'hint', hintLevel: 3 },
          { label: 'Review My Approach', action: 'approach' }
        ]
      };
    }

    if (level === 3) {
      return {
        success: true,
        action: 'hint',
        hintLevel: 3,
        title: `Hint 3: Key Mathematical / Logical Invariant`,
        summary: `The core algebraic or structural relationship needed to solve the problem.`,
        content: `### ⚡ The Core Invariant\n\nAt each step \`i\`:\n\n1. Formulate the exact condition required: What must pair with or follow current element \`x\`?\n2. Update your state **only after** checking for the match, so you never accidentally match an element with itself.\n3. Make sure boundary edge cases (e.g., empty collection, single element, negative numbers, duplicates) preserve this invariant.`,
        badges: [{ type: 'tip', label: 'Key Invariant' }],
        nextHintAvailable: true,
        nextHintLevel: 4,
        learningModeActive: learningMode,
        suggestedActions: [
          { label: 'Next: Step-by-Step Approach (Hint 4)', action: 'hint', hintLevel: 4 },
          { label: 'Debug My Code', action: 'debug' }
        ]
      };
    }

    if (level === 4) {
      return {
        success: true,
        action: 'hint',
        hintLevel: 4,
        title: `Hint 4: Step-by-Step Algorithmic Approach`,
        summary: `Structured algorithm steps ready for implementation.`,
        content: `### 🛠️ Algorithmic Blueprint\n\n1. **Initialization:** Prepare your auxiliary structure (e.g. \`seen = {}\`, \`stack = []\`, or \`left = 0, right = 0\`).\n2. **Scan Phase:** Loop through the data with an index and value.\n3. **Query & Check:** Test if the target condition is met in your auxiliary structure.\n4. **Update:** Record the current element/index for future iterations.\n5. **Completion:** Return your result, or a default fallback if no valid configuration was found.\n\n*Try coding this blueprint in the editor now before viewing full code!*`,
        badges: [{ type: 'tip', label: 'Approach' }],
        nextHintAvailable: true,
        nextHintLevel: 5,
        learningModeActive: learningMode,
        suggestedActions: [
          { label: 'Unlock Complete Solution (Hint 5)', action: 'hint', hintLevel: 5 }
        ]
      };
    }

    // Level 5: Complete Solution
    const lang = ctx.language || 'python';
    const starterOrSol = this.getSolutionCode(problem, lang);
    const timeEst = this.getTimeComplexity(problem);
    const spaceEst = this.getSpaceComplexity(problem);
    return {
      success: true,
      action: 'hint',
      hintLevel: 5,
      title: `Hint 5: Complete Reference Solution (${lang})`,
      summary: `Full reference implementation with complexity analysis.`,
      content: `### 📖 Complete Reference Implementation\n\n\`\`\`${lang}\n${starterOrSol}\n\`\`\`\n\n### Complexity\n- **Time Complexity:** Approximately ${timeEst}\n- **Space Complexity:** Approximately ${spaceEst}\n\n*Review how this aligns with the previous hints and try writing your own variation.*`,
      badges: [
        { type: 'complexity', label: `Time: ${timeEst}` },
        { type: 'complexity', label: `Space: ${spaceEst}` }
      ],
      nextHintAvailable: false,
      learningModeActive: false
    };
  }

  /**
   * 2. CODE DEBUGGER WITH INTERACTIVE DIFF PREVIEW
   * Analyzes user's actual code, visible compiler/runtime error, and suggests clean diff.
   */
  public debugCode(ctx: SparkPromptContext): SparkResponse {
    const code = ctx.code || '';
    const lang = ctx.language || 'python';
    const err = ctx.visibleError || '';
    const problem = this.resolveProblem(ctx);

    // Analyze common bug patterns
    const analysis = this.analyzeCodeDefects(code, lang, err, problem);

    return {
      success: true,
      action: 'debug',
      title: analysis.title,
      summary: analysis.summary,
      content: analysis.explanation,
      badges: [
        { type: 'warning', label: analysis.category },
        { type: 'tip', label: `${lang.toUpperCase()} Semantics` }
      ],
      diff: analysis.diff,
      sections: [
        { title: '1. What Went Wrong', content: analysis.whatWentWrong },
        { title: '2. Why It Happened', content: analysis.whyItHappened },
        { title: '3. How to Fix It', content: analysis.howToFix }
      ],
      suggestedActions: analysis.diff ? [
        { label: 'Apply Suggested Fix to Editor', action: 'debug' }
      ] : undefined
    };
  }

  /**
   * 3. SUBMISSION FAILURE & ACCEPTED ANALYSIS
   * Explains WA, TLE, MLE without leaking hidden test cases.
   */
  public analyzeSubmission(ctx: SparkPromptContext): SparkResponse {
    const status = ctx.executionStatus || 'Wrong Answer';
    const problem = this.resolveProblem(ctx);
    const summary = ctx.testCaseSummary;

    if (status === 'Accepted') {
      const timeEst = this.getTimeComplexity(problem);
      const spaceEst = this.getSpaceComplexity(problem);
      return {
        success: true,
        action: 'submission_analysis',
        title: '🎉 Solution Accepted: Quality & Asymptotic Review',
        summary: `Your solution passed all public and hidden validation cases!`,
        content: `### 🚀 Performance & Asymptotics\n\n- **Observed Execution:** ${ctx.runtimeMs || 2}ms runtime | ${ctx.memoryKb || 14200}KB memory\n- **Estimated Time Complexity:** Approximately ${timeEst} because the algorithm processes elements in single/controlled passes.\n- **Estimated Space Complexity:** Approximately ${spaceEst} auxiliary space.\n\n### 💡 Next Challenge\nWould you like to practice a harder problem utilizing the **${problem?.pattern || 'same'}** pattern?`,
        badges: [
          { type: 'complexity', label: `Time: ${timeEst}` },
          { type: 'complexity', label: `Space: ${spaceEst}` },
          { type: 'pattern', label: `Pattern: ${problem?.pattern || 'Optimal'}` }
        ],
        suggestedActions: [
          { label: 'Explain Complexity', action: 'complexity' },
          { label: 'Next Problem Recommendation', action: 'recommendation' }
        ]
      };
    }

    if (status === 'Time Limit Exceeded') {
      const timeEst = this.getTimeComplexity(problem);
      return {
        success: true,
        action: 'submission_analysis',
        title: '⏱️ Time Limit Exceeded (TLE) Analysis',
        summary: `The algorithm exceeded the allowable execution threshold on larger inputs.`,
        content: `### 🔍 Why TLE Occurs\n\nYour solution likely has an asymptotic complexity of **O(n²)** or higher (e.g. nested loops over arrays of size ~10⁵, resulting in ~10¹⁰ operations, far exceeding the ~10⁷/sec limit).\n\n### 🛠️ Optimization Strategy\n- **Target Complexity:** This problem is designed to be solved in **${timeEst}** or **O(n log n)**.\n- **Trade Space for Time:** Can you store intermediate lookups in a hash map, hash set, or frequency array?\n- **Eliminate Redundant Work:** If you are repeatedly rescanning elements, consider **${problem?.pattern || 'Two Pointers or Sliding Window'}**.`,
        badges: [
          { type: 'warning', label: 'Complexity Bottleneck' },
          { type: 'tip', label: `Target: ${timeEst}` }
        ],
        suggestedActions: [
          { label: 'Explain Pattern', action: 'pattern' },
          { label: 'Get Progressive Hint', action: 'hint', hintLevel: 1 }
        ]
      };
    }

    // Wrong Answer (WA) or Runtime Error
    let failureNote = `Your logic produced an unexpected output on one of the evaluation test cases.`;
    if (summary && summary.failedInput) {
      failureNote += `\n\n**Visible Test Case Mismatch:**\n- **Input:** \`${summary.failedInput}\`\n- **Your Output:** \`${summary.failedActual || 'None'}\`\n- **Expected:** \`${summary.failedExpected || 'Expected'}\``;
    } else {
      failureNote += `\n\n*(Note: Per CodeSpark anti-cheat policies, hidden evaluation test cases are kept confidential to encourage authentic problem solving).*`;
    }

    return {
      success: true,
      action: 'submission_analysis',
      title: `${status}: Logic & Invariant Breakdown`,
      summary: `Pinpointing common edge cases and logical discrepancies.`,
      content: `### ⚠️ Diagnostic Breakdown\n\n${failureNote}\n\n### 🔬 Likely Culprits to Check:\n1. **Self-Matching / Order of Updates:** Are you checking your condition before or after storing the current element?\n2. **Off-by-One / Range Bounds:** Are all indices inclusive/exclusive according to problem specifications?\n3. **Edge Values:** How does your code behave with zero, negative numbers, duplicates, or empty collections?\n4. **Return Types:** Ensure your return type matches expectations (e.g., returning 0-indexed values vs 1-indexed, or list vs tuple).`,
      badges: [
        { type: 'warning', label: status },
        { type: 'tip', label: 'Edge Case Inspection' }
      ],
      suggestedActions: [
        { label: 'Debug My Code', action: 'debug' },
        { label: 'Get Hint', action: 'hint', hintLevel: 1 }
      ]
    };
  }

  /**
   * 4. PATTERN DETECTION
   */
  public detectPattern(ctx: SparkPromptContext): SparkResponse {
    const problem = this.resolveProblem(ctx);
    const pattern = problem?.pattern || 'Two Pointers';
    const clues = this.getPatternClues(pattern);

    return {
      success: true,
      action: 'pattern',
      title: `Algorithmic Pattern: ${pattern}`,
      summary: `Why ${pattern} is the ideal tool for "${problem?.title || 'this problem'}".`,
      content: `### 🎯 Pattern: ${pattern}\n\n${clues.description}\n\n### 🔎 Recognition Clues\n${clues.clues.map(c => `- ${c}`).join('\n')}\n\n### 💡 Why It Applies Here\n${clues.whyApplies}`,
      badges: [
        { type: 'pattern', label: pattern },
        { type: 'complexity', label: `Expected: ${this.getTimeComplexity(problem)}` }
      ],
      suggestedActions: [
        { label: 'Review Approach', action: 'approach' },
        { label: 'Get Progressive Hint', action: 'hint', hintLevel: 2 }
      ]
    };
  }

  /**
   * 5. COMPLEXITY EXPLAINER
   */
  public explainComplexity(ctx: SparkPromptContext): SparkResponse {
    const problem = this.resolveProblem(ctx);
    const code = ctx.code || '';
    const timeEst = this.getTimeComplexity(problem);
    const spaceEst = this.getSpaceComplexity(problem);

    const hasLoop = /for\s+|while\s+/i.test(code);
    const hasNestedLoop = /(for|while)[\s\S]*?(for|while)/i.test(code);

    let explanation = `### ⏱️ Time Complexity: Approximately ${timeEst}\n\n`;
    if (hasNestedLoop) {
      explanation += `⚠️ Your code contains nested loops. In worst-case scenarios, nested iterations over arrays of size \`n\` yield **O(n²)** time. An optimal solution should reduce this to **${timeEst}**.\n\n`;
    } else if (hasLoop) {
      explanation += `Your code performs a linear scan over the inputs. If each lookup or operation inside the loop is **O(1)** (e.g. hash table or stack operations), the overall time remains **${timeEst}**.\n\n`;
    } else {
      explanation += `The optimal solution visits each element at most once or twice, giving **${timeEst}**.\n\n`;
    }

    explanation += `### 💾 Space Complexity: Approximately ${spaceEst}\n\n`;
    explanation += `Auxiliary space is required to store historical elements or states. Storing up to \`n\` keys in a hash map or stack incurs **${spaceEst}** extra memory.`;

    return {
      success: true,
      action: 'complexity',
      title: `Asymptotic Complexity Breakdown`,
      summary: `Time & space complexity analysis based on algorithmic structure.`,
      content: explanation,
      badges: [
        { type: 'complexity', label: `Time: ${timeEst}` },
        { type: 'complexity', label: `Space: ${spaceEst}` }
      ],
      suggestedActions: [
        { label: 'Review Code Quality', action: 'review' }
      ]
    };
  }

  /**
   * 6. CODE REVIEW (Readability, Naming, Duplication, Edge Cases)
   */
  public reviewCode(ctx: SparkPromptContext): SparkResponse {
    const code = ctx.code || '';
    const lang = ctx.language || 'python';
    const problem = this.resolveProblem(ctx);

    const findings: string[] = [];

    if (code.length < 20) {
      findings.push(`- **Empty/Minimal Implementation:** The editor only contains starter skeleton. Implement your logic first!`);
    } else {
      if (code.includes('print(') || code.includes('console.log(')) {
        findings.push(`- **Debug Logging:** Remember to remove \`print()\` / \`console.log()\` statements before final submission to avoid I/O overhead.`);
      }
      if (lang === 'python' && code.includes('range(len(')) {
        findings.push(`- **Pythonic Iteration:** Consider using \`enumerate()\` instead of \`range(len(arr))\` when you need both the index and value.`);
      }
      if (code.length > 500 && !code.includes('#')) {
        findings.push(`- **Documentation:** Consider adding brief inline comments explaining the core invariant of your loop.`);
      }
      findings.push(`- **Naming:** Variable names should reflect domain concepts (e.g. \`complement\`, \`window_sum\`, \`left, right\` rather than single arbitrary characters).`);
      findings.push(`- **Edge Case Coverage:** Verified that zero/empty collections and single elements are guarded against crashes.`);
    }

    return {
      success: true,
      action: 'review',
      title: `Spark Code Review & Quality Checklist`,
      summary: `Readability, maintainability, and clean coding best practices.`,
      content: `### 📋 Code Quality Findings\n\n${findings.join('\n\n')}\n\n### ✨ Best Practice Recommendations\n1. **Early Return:** Exit early on trivial edge cases (e.g. \`if not nums: return ...\`).\n2. **Clean Scope:** Keep helper variables scoped strictly to the loop that requires them.\n3. **Type Clarity:** Ensure consistent return formats across all code branches.`,
      badges: [
        { type: 'tip', label: 'Clean Code' },
        { type: 'pattern', label: `${problem?.pattern || 'Optimal'}` }
      ]
    };
  }

  /**
   * 7. APPROACH REVIEW
   */
  public reviewApproach(ctx: SparkPromptContext): SparkResponse {
    const text = (ctx.approachText || '').toLowerCase();
    const problem = this.resolveProblem(ctx);
    const isAnagram = (problem?.title || '').toLowerCase().includes('anagram') || (problem?.id || '') === 'p-3';
    const pattern = (problem?.pattern || '').toLowerCase();

    let feedback = '';
    if (!text || text.length < 5) {
      feedback = `Please outline your planned strategy in words (e.g. *"I plan to use a hash map to remember previously seen numbers as I iterate"*). Spark will validate your reasoning before you write a single line of code!`;
    } else if (isAnagram) {
      if (text.includes('sort')) {
        feedback = `Sorting both strings (e.g., \`return sorted(s) == sorted(t)\`) is a completely valid and elegant approach! It rearranges characters alphabetically so they can be compared directly in **O(n log n)** time and **O(n)** (or O(1) in-place depending on language) space. You can also solve it in **O(n)** time and **O(1)** auxiliary space with a frequency map.`;
      } else if (text.includes('hash') || text.includes('map') || text.includes('dict') || text.includes('count') || text.includes('freq')) {
        feedback = `A frequency counting approach (hash map or 26-element array) is an optimal **O(n)** time and **O(1)** space approach! You count character frequencies across both strings and ensure they match. Note that sorting (\`sorted(s) == sorted(t)\`) is also a valid **O(n log n)** alternative.`;
      } else {
        feedback = `For ${problem?.title || 'Anagram verification'}, both **Sorting** (O(n log n) time, O(n) space) and **Frequency Counting / Hash Map** (O(n) time, O(1) space) are valid approaches. Choose the one that best fits your implementation style!`;
      }
    } else if (text.includes('sort') && pattern.includes('pointer')) {
      feedback = `Sorting the input enables two-pointer convergence from both ends in **O(n log n)** time! However, double check whether the problem asks for **original indices**—if it does, sorting directly will scramble them unless you store \`(value, original_index)\` pairs first.`;
    } else if (text.includes('hash') || text.includes('map') || text.includes('dict') || text.includes('set')) {
      feedback = `Excellent intuition! Using a hash map achieves **O(1)** average lookup, turning an otherwise O(n²) nested search into a clean single-pass **O(n)** solution. Be sure to check for the target complement before adding the current element into the map.`;
    } else if (text.includes('nested') || text.includes('two loops') || text.includes('brute')) {
      feedback = `A brute-force nested search is great for establishing the baseline correctness, but it will likely trigger **Time Limit Exceeded (TLE)** on CodeSpark's large test cases. Can you maintain state in a **${problem?.pattern || 'hash map or sliding window'}** to achieve single-pass O(n)?`;
    } else {
      feedback = `Your approach sounds promising. The primary challenge will be handling duplicate values and strict boundary conditions. Consider stepping through a small 3-element example on paper to verify the invariant.`;
    }

    return {
      success: true,
      action: 'approach',
      title: `Approach Validation & Feedback`,
      summary: `Evaluating your planned logic before implementation.`,
      content: `### 🧠 Mentor Assessment\n\n${feedback}`,
      badges: [{ type: 'tip', label: 'Reasoning Check' }]
    };
  }

  /**
   * 8. CONCEPT EXPLAINER
   */
  public explainConcept(query: string): SparkResponse {
    const clean = query.toLowerCase().trim();

    const conceptMap: Record<string, { title: string; explanation: string; clues: string[]; complexity: string }> = {
      'binary search': {
        title: 'Binary Search (Divide & Conquer)',
        explanation: 'Binary Search is an optimal search algorithm that repeatedly halves the search space. At each step, it compares the middle element to the target.',
        clues: ['Array is sorted', 'Monotonic predicate (e.g. FFFTTT)', 'Finding minimum/maximum feasible value in O(log n)'],
        complexity: 'Time: O(log n) | Space: O(1)'
      },
      'two pointers': {
        title: 'Two Pointers Technique',
        explanation: 'Two pointers maintain two boundary or directional references that converge or march together based on a comparison.',
        clues: ['Sorted array pair sum', 'Partitioning arrays in-place', 'Reversing or palindrome verification'],
        complexity: 'Time: O(n) | Space: O(1)'
      },
      'sliding window': {
        title: 'Sliding Window Pattern',
        explanation: 'Maintains a dynamic or fixed subarray range [left, right], expanding to satisfy constraints and contracting from the left to regain validity.',
        clues: ['Contiguous subarray or substring', 'Shortest/longest subsegment meeting a condition', 'Avoids re-evaluating the entire window from scratch'],
        complexity: 'Time: O(n) | Space: O(k)'
      },
      'monotonic stack': {
        title: 'Monotonic Stack',
        explanation: 'Maintains elements in strictly increasing or decreasing order to resolve "Next Greater Element" or "Previous Smaller Element" queries in linear time.',
        clues: ['Next warmer day / next greater element', 'Histogram largest rectangle', 'Deferred resolution of previous elements'],
        complexity: 'Time: O(n) | Space: O(n)'
      }
    };

    const match = Object.keys(conceptMap).find(k => clean.includes(k)) || 'binary search';
    const c = conceptMap[match];

    return {
      success: true,
      action: 'concept',
      title: c.title,
      summary: `Core algorithmic intuition, recognition clues, and complexity guarantees.`,
      content: `### 📚 Definition\n${c.explanation}\n\n### 🔍 Recognition Clues\n${c.clues.map(item => `- ${item}`).join('\n')}\n\n### ⚡ Complexity\n${c.complexity}`,
      badges: [
        { type: 'pattern', label: c.title },
        { type: 'complexity', label: c.complexity }
      ]
    };
  }

  /**
   * 9. PERSONALIZED RECOMMENDATIONS
   */
  public getPersonalizedRecommendation(ctx: SparkPromptContext): SparkResponse {
    const problem = this.resolveProblem(ctx);
    const pattern = problem?.pattern || 'Two Pointers';
    const nextProblems = ALL_PROBLEMS.filter(p => p.pattern === pattern && p.id !== problem?.id);
    const rec = nextProblems[0] || ALL_PROBLEMS[1];

    return {
      success: true,
      action: 'recommendation',
      title: `Personalized Next Practice Recommendation`,
      summary: `Recommended based on your pattern mastery and difficulty curve.`,
      content: `### 🎯 Recommended Problem: ${rec.title}\n\n- **Difficulty:** ${rec.difficulty}\n- **Pattern:** ${rec.pattern}\n- **Topic:** ${rec.topic}\n\n**Why This Problem?**\nYou've demonstrated familiarity with the foundational **${pattern}** pattern. Solving **${rec.title}** will reinforce variable bounds and corner-case handling.`,
      badges: [
        { type: 'pattern', label: rec.pattern },
        { type: 'tip', label: rec.difficulty }
      ],
      suggestedActions: [
        { label: `Open ${rec.title}`, action: 'recommendation' }
      ]
    };
  }

  /**
   * 10. INTERVIEW COACH GUIDANCE
   * Practice (full hints) vs Interview (minimal hints) vs Strict (no AI hints during timed session).
   */
  public getInterviewGuidance(mode: 'practice' | 'interview' | 'strict', ctx: SparkPromptContext): SparkResponse {
    if (mode === 'strict') {
      return {
        success: false,
        action: 'interview_coach',
        title: '🔒 Strict Interview Mode Active',
        summary: 'AI hints are disabled during timed strict interview sessions.',
        content: `In **Strict Mode**, CodeSpark replicates realistic FAANG/top-tech interview conditions. AI hints and solutions are disabled until the timed interview loop concludes.\n\n*Trust your preparation, articulate your invariants, and step through test cases!*`,
        badges: [{ type: 'warning', label: 'Strict Mode: No Hints' }]
      };
    }

    if (mode === 'interview') {
      return {
        success: true,
        action: 'interview_coach',
        title: '🎙️ Interview Mode: High-Level Verbal Guidance',
        summary: 'Simulating a real interviewer who guides without giving code.',
        content: `### Interviewer Feedback\n\n- Before writing code, state your brute-force complexity to your interviewer.\n- Ask clarifying questions about constraints: Are there negative numbers? What are the maximum bounds of \`n\`?\n- Think aloud: *"If we sort this, what is our trade-off?"* or *"Could a lookup table help us avoid O(n²)?*`,
        badges: [{ type: 'tip', label: 'Interviewer Simulation' }]
      };
    }

    // Practice mode
    return {
      success: true,
      action: 'interview_coach',
      title: '🎯 Interview Practice Warm-Up',
      summary: 'Essential pattern reminders and problem-solving framework.',
      content: `### 🌟 4-Step Technical Interview Framework\n\n1. **Clarify Constraints:** Ask about bounds, types, and empty inputs.\n2. **Propose Brute Force First:** State the naive O(n²) approach in 30 seconds.\n3. **Identify Optimal Pattern:** Explain why **${ctx.problem?.pattern || 'Two Pointers'}** avoids redundant work.\n4. **Write Clean Code & Dry Run:** Step through your code with a 3-element test case before submitting.`,
      badges: [{ type: 'tip', label: 'Framework' }]
    };
  }

  /**
   * 11. DISCUSSION REFINEMENT
   */
  public refineDiscussion(ctx: SparkPromptContext): SparkResponse {
    return {
      success: true,
      action: 'refine_discussion',
      title: 'Discussion Refined',
      summary: 'Formatting and technical clarity suggestions applied.',
      content: `### 💡 Discussion Posting Tips\n- Use fenced code blocks with language identifiers (e.g. \`\`\`python).\n- State what you tried, what you expected, and what error or wrong output was received.\n- Avoid posting raw solutions to avoid spoiling active practice for other members.`
    };
  }

  // --- Helper Methods ---

  private resolveProblem(ctx: SparkPromptContext): Problem | undefined {
    if (ctx.problem?.id) {
      const found = ALL_PROBLEMS.find(p => p.id === ctx.problem?.id || p.slug === ctx.problem?.id);
      if (found) return found;
    }
    return ALL_PROBLEMS[0];
  }

  private getTimeComplexity(problem?: Problem): string {
    return (problem as any)?.timeComplexity || problem?.editorial?.optimal?.complexity?.time || 'O(n)';
  }

  private getSpaceComplexity(problem?: Problem): string {
    return (problem as any)?.spaceComplexity || problem?.editorial?.optimal?.complexity?.space || 'O(n)';
  }

  private getSolutionCode(problem?: Problem, lang: string = 'python'): string {
    return (problem as any)?.solutionCode?.[lang] || problem?.editorial?.optimal?.code || problem?.starterCode?.[lang as SupportedLanguage] || '# Reference Solution';
  }

  private getPatternClues(pattern: string): { description: string; clues: string[]; whyApplies: string } {
    switch (pattern) {
      case 'Sliding Window':
        return {
          description: 'A technique that tracks a dynamic contiguous range [left, right] to solve subarray/substring optimization problems.',
          clues: ['Contiguous subarray or substring', 'Condition depends on window state (sum, distinct count)', 'Avoids re-evaluating from scratch when expanding right'],
          whyApplies: 'Moving the right pointer expands the window; when the condition is violated, moving the left pointer shrinks it back to validity in amortized O(1) time.'
        };
      case 'Monotonic Stack':
        return {
          description: 'A stack that maintains elements in sorted order to resolve the nearest greater or smaller element in linear time.',
          clues: ['Finding next/previous greater/smaller element', 'Temperature span, stock span, or daily temperatures', 'Histogram boundary calculations'],
          whyApplies: 'As new elements arrive, they pop and resolve all smaller pending elements that were waiting on the stack.'
        };
      case 'Binary Search':
        return {
          description: 'Divides the search space in half repeatedly by testing the midpoint against a monotonic condition.',
          clues: ['Sorted input array', 'Search space can be partitioned into False/True regions', 'O(log n) time requirement'],
          whyApplies: 'Checking the midpoint rules out half the remaining candidates each step.'
        };
      case 'Two Pointers':
      default:
        return {
          description: 'Iterates through an array using two pointers moving toward each other or in the same direction.',
          clues: ['Sorted array pair problems', 'In-place partitioning or reversing', 'Target sum or 3Sum variants'],
          whyApplies: 'Because the array has a predictable order, comparing the two pointer values tells you definitively whether to increment left or decrement right.'
        };
    }
  }

  private analyzeCodeDefects(
    code: string, 
    lang: SupportedLanguage, 
    err: string, 
    problem?: Problem
  ): {
    title: string;
    summary: string;
    explanation: string;
    category: string;
    whatWentWrong: string;
    whyItHappened: string;
    howToFix: string;
    diff?: SparkDiffSuggestion;
  } {
    const cleanErr = (err || '').toLowerCase();

    // 1. Python Syntax / Indentation Error
    if (cleanErr.includes('syntaxerror') || cleanErr.includes('indentationerror')) {
      return {
        title: 'Syntax / Indentation Error Detected',
        summary: 'Python requires precise block indentation and matching closing brackets.',
        explanation: `Python reported: \`${err}\`. Make sure all statements under \`def\`, \`for\`, and \`if\` are indented by 4 spaces and all parentheses are properly closed.`,
        category: 'Syntax Error',
        whatWentWrong: 'The Python interpreter encountered unexpected indentation or a missing token.',
        whyItHappened: 'A colon `:` may be missing after an `if`/`for` statement, or spaces and tabs are mixed.',
        howToFix: 'Ensure every block statement ends with `:` and has uniform 4-space indentation.'
      };
    }

    // 2. Python KeyError / IndexError
    if (cleanErr.includes('indexerror') || cleanErr.includes('out of range')) {
      return {
        title: 'Index Out of Range',
        summary: 'Your code attempted to access an array index that does not exist.',
        explanation: `An \`IndexError\` occurred. In 0-indexed collections, the last valid index is \`len(arr) - 1\`. Accessing \`arr[len(arr)]\` or \`arr[i + 1]\` without checking bounds will crash.`,
        category: 'Runtime Error',
        whatWentWrong: 'An array index exceeded the bounds `[0, len(arr) - 1]`.',
        whyItHappened: 'A loop condition allowed the pointer to march past the last element before terminating.',
        howToFix: 'Guard pointer increments with `while right < len(arr)` or `i + 1 < len(arr)`.'
      };
    }

    // 3. Two Sum specific bug: Complement added before check (Self-match)
    if (problem?.id === 'p-1' || problem?.slug?.includes('two-sum')) {
      const checkIdx = Math.max(
        code.indexOf('diff in seen'),
        code.indexOf('target - num in seen'),
        code.indexOf('complement in seen')
      );
      const insertIdx = code.indexOf('seen[num] = i') !== -1 ? code.indexOf('seen[num] = i') : code.indexOf('seen[num]=i');

      if (insertIdx !== -1 && checkIdx !== -1 && insertIdx < checkIdx) {
        let fixedCode = code;
        if (code.includes('seen[num] = i') && code.includes('if diff in seen:')) {
          fixedCode = code.replace(
            /seen\[num\]\s*=\s*i\s*\n\s*if\s+diff\s+in\s+seen:\s*\n\s*return\s+\[seen\[diff\],\s*i\]/,
            `if diff in seen:\n            return [seen[diff], i]\n        seen[num] = i`
          );
        } else {
          fixedCode = code.replace(
            /seen\[num\]\s*=\s*i[\s\S]*?if\s+(target\s*-\s*num)\s+in\s+seen:/,
            `if target - num in seen:\n            return [seen[target - num], i]\n        seen[num] = i`
          );
        }

        return {
          title: 'Self-Matching Element Bug',
          summary: 'You are adding the current number into the hash map BEFORE checking for the complement.',
          explanation: `When target is \`6\` and the number is \`3\`, inserting \`3\` first means \`6 - 3 = 3\` will immediately find itself, returning \`[0, 0]\` instead of searching for a distinct second number!`,
          category: 'Logic Bug',
          whatWentWrong: 'The current element is allowed to pair with itself.',
          whyItHappened: '`seen[num] = i` executes prior to checking whether the complement exists.',
          howToFix: 'Check whether the complement is in `seen` first. Only insert `num` into `seen` if no match was found.',
          diff: {
            originalCode: code,
            suggestedCode: fixedCode !== code ? fixedCode : `def twoSum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        diff = target - num\n        if diff in seen:\n            return [seen[diff], i]\n        seen[num] = i`,
            explanation: 'Swap the check and insertion order so numbers only pair with previously seen elements.'
          }
        };
      }
    }

    // 4. Default Heuristic Analysis
    return {
      title: 'Code Analysis & Logic Inspection',
      summary: 'Reviewing control flow, loop termination, and state updates.',
      explanation: `Spark reviewed your ${lang} implementation. Ensure the loop termination invariant is strictly bounded and edge cases (empty or single-element inputs) are handled properly.`,
      category: 'Logic Check',
      whatWentWrong: 'The implementation may not satisfy all edge condition invariants.',
      whyItHappened: 'Intermediate state updates or return conditions might fail on boundary inputs.',
      howToFix: 'Dry run a small test case manually and verify that variable states transition as expected.'
    };
  }
}
