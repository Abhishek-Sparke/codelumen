import { Problem, AICoachMessage, ExperienceLevel } from '../types';

export const AICoachService = {
  getInitialGreeting(problem: Problem, level: ExperienceLevel = 'Beginner'): AICoachMessage {
    let focusNote = '';
    if (level === 'Beginner') {
      focusNote = 'I will break down concepts with simple analogies and step-by-step intuition.';
    } else if (level === 'Intermediate') {
      focusNote = 'I will highlight core pattern invariants and standard algorithmic trade-offs.';
    } else {
      focusNote = 'I will focus on asymptotic optimality, strict memory bounds, and adversarial edge cases.';
    }

    return {
      id: 'msg-init',
      sender: 'coach',
      text: `Hello! I'm your Socratic AI Coach for "${problem.title}".\n\n${focusNote}\n\nI will guide your problem-solving process with deliberate inquiry rather than simply revealing the answer. Where would you like to start?`,
      timestamp: 'Just now'
    };
  },

  getNextHint(problem: Problem, currentHintLevel: number, level: ExperienceLevel = 'Beginner'): { message: AICoachMessage; nextLevel: number } {
    const nextLevel = Math.min(3, currentHintLevel + 1) as 1 | 2 | 3;
    const hint = problem.hints.find(h => h.level === nextLevel) || {
      level: nextLevel,
      title: 'Guidance',
      content: `Consider the problem constraints and invariants. How does a ${problem.pattern} approach transform the time complexity?`
    };

    let titlePrefix = '';
    let levelAnnotation = '';

    if (nextLevel === 1) {
      titlePrefix = '💡 Hint 1 (Conceptual Intuition)';
      levelAnnotation = level === 'Beginner'
        ? '\n\n*Intuition:* Think of looking for a matching piece in a puzzle—if you write down what you need on a sticky note as you go, you only have to look at each piece once.'
        : level === 'Advanced'
        ? '\n\n*Invariant Analysis:* What invariant over the prefix subproblem allows reducing degree-of-freedom from 2 to 1?'
        : '';
    } else if (nextLevel === 2) {
      titlePrefix = '🔍 Hint 2 (Pattern Recognition)';
      levelAnnotation = level === 'Beginner'
        ? '\n\n*Next Step:* Which data structure allows checking if a number exists in instant O(1) time?'
        : level === 'Advanced'
        ? '\n\n*Memory Bounds:* Keep auxiliary allocations bounded to O(min(N, Σ)) and beware of hash collision degrade.'
        : '';
    } else {
      titlePrefix = '⚡ Hint 3 (Near-Solution Formulation)';
      levelAnnotation = level === 'Beginner'
        ? '\n\n*Code Pattern:* Loop through once, calculate complement = target - current, check seen map, then insert current.'
        : '\n\n*Implementation Check:* Handle single-pass updates so an element cannot pair with itself.';
    }

    return {
      message: {
        id: `msg-${Date.now()}`,
        sender: 'coach',
        text: `### ${titlePrefix}: ${hint.title}\n\n${hint.content}${levelAnnotation}`,
        timestamp: 'Just now',
        hintLevel: nextLevel
      },
      nextLevel
    };
  },

  explainPattern(problem: Problem, level: ExperienceLevel = 'Beginner'): AICoachMessage {
    let patternDetails = problem.editorial.patternExplanation;
    if (level === 'Beginner') {
      patternDetails += `\n\n**Beginner Takeaway:**\nThe main idea is avoiding double loops. Instead of comparing every element with every other element, we do a single walk and save notes in memory.`;
    } else if (level === 'Advanced') {
      patternDetails += `\n\n**Advanced Optimization:**\nConsider cache spatial locality, branch prediction predictability, and amortized constant-time lookups with low load factors.`;
    }

    return {
      id: `msg-${Date.now()}`,
      sender: 'coach',
      text: `### Pattern Breakdown: ${problem.pattern}\n\n${patternDetails}\n\n**Why it applies here:**\nThe input constraints (${problem.constraints[0] || 'large N'}) rule out quadratic brute forces. By maintaining an invariant with the **${problem.pattern}** pattern, you can reduce repetitive scans into a single linear pass.`,
      timestamp: 'Just now'
    };
  },

  explainFailure(problem: Problem, userCode: string, failedTestDetails?: any, level: ExperienceLevel = 'Beginner'): AICoachMessage {
    const snippetCheck = userCode.toLowerCase();
    let diagnostic = '';

    if (snippetCheck.includes('pass') || userCode.trim().length < 50) {
      diagnostic = level === 'Beginner'
        ? 'Your function is still empty or returning a default placeholder. Let us start with step 1: initialize your tracking data structure.'
        : 'Stub function detected. Implement the primary state transition and loop invariant.';
    } else if (!snippetCheck.includes('return')) {
      diagnostic = 'Notice that your function does not appear to return any value. Make sure you explicitly return the answer array or result.';
    } else if (failedTestDetails) {
      diagnostic = `Your code produced \`${JSON.stringify(failedTestDetails.actual)}\` for input \`${JSON.stringify(failedTestDetails.input)}\`, but expected \`${JSON.stringify(failedTestDetails.expected)}\`.\n\n${
        level === 'Advanced' 
          ? 'Check your loop invariants, off-by-one pointer boundaries, or duplicate key handling in edge cases.' 
          : 'Check if you returned indices instead of values, or if you checked the same number against itself.'
      }`;
    } else {
      diagnostic = 'Check your loop termination conditions and whether you are handling duplicate elements or negative values correctly according to the problem constraints.';
    }

    return {
      id: `msg-${Date.now()}`,
      sender: 'coach',
      text: `### Diagnostic Feedback\n\n${diagnostic}\n\nWhat condition might fail when this input is processed?`,
      timestamp: 'Just now'
    };
  },

  reviewComplexity(problem: Problem, userCode: string, level: ExperienceLevel = 'Beginner'): AICoachMessage {
    const loopCount = (userCode.match(/for\s*\(|while\s*\(|\.forEach|\.map/g) || []).length;
    let timeEstimate = 'O(n)';
    let spaceEstimate = 'O(1)';

    if (loopCount >= 2 && userCode.includes('for') && (userCode.match(/for/g)?.length || 0) >= 2) {
      timeEstimate = 'O(n²) [Potentially quadratic nested loop detected]';
    } else if (userCode.includes('sort')) {
      timeEstimate = 'O(n log n) [Sorting step detected]';
    } else if (userCode.includes('Map') || userCode.includes('Set') || userCode.includes('{}')) {
      timeEstimate = 'O(n)';
      spaceEstimate = 'O(n) [Auxiliary hash structure detected]';
    }

    const isTLE = timeEstimate.includes('n²');

    return {
      id: `msg-${Date.now()}`,
      sender: 'coach',
      text: `### Complexity Analysis\n\n- **Estimated Time:** \`${timeEstimate}\`\n- **Estimated Space:** \`${spaceEstimate}\`\n\n**Optimal Target:**\n- **Time:** \`${problem.editorial.optimal.complexity.time}\`\n- **Space:** \`${problem.editorial.optimal.complexity.space}\`\n\n${
        isTLE 
          ? '⚠️ Watch out: your nested loops may hit Time Limit Exceeded (TLE) on large inputs.' 
          : '✅ Your complexity is on track with the optimal algorithmic bound!'
      }${
        level === 'Advanced' 
          ? '\n\n*Advanced tip:* For maximum speed in C++/Rust, pre-reserve hash table capacity to avoid rehashing latency.' 
          : ''
      }`,
      timestamp: 'Just now'
    };
  },

  unlockSolution(problem: Problem): AICoachMessage {
    return {
      id: `msg-${Date.now()}`,
      sender: 'coach',
      text: `### Optimal Solution: ${problem.editorial.optimal.name}\n\n**Time Complexity:** ${problem.editorial.optimal.complexity.time}\n**Space Complexity:** ${problem.editorial.optimal.complexity.space}\n\n${problem.editorial.optimal.explanation}\n\n\`\`\`javascript\n${problem.editorial.optimal.code}\n\`\`\`\n\n*Review the logic line by line, then try re-implementing it in the editor from scratch to cement your understanding!*`,
      timestamp: 'Just now',
      codeSnippet: problem.editorial.optimal.code
    };
  },

  answerFreeform(problem: Problem, query: string, level: ExperienceLevel = 'Beginner'): AICoachMessage {
    const q = query.toLowerCase();
    let reply = '';

    if (q.includes('hint')) {
      return this.getNextHint(problem, 1, level).message;
    } else if (q.includes('complexity') || q.includes('big o')) {
      reply = `For ${problem.title}, optimal time complexity is **${problem.editorial.optimal.complexity.time}** and space complexity is **${problem.editorial.optimal.complexity.space}**.`;
    } else if (q.includes('edge case') || q.includes('cases')) {
      reply = `Crucial edge cases to test:\n1. Array with minimum size (e.g. length = 2)\n2. All identical or duplicate elements\n3. Negative values and zeroes\n4. Target values requiring the last two elements.`;
    } else {
      reply = `That's a thoughtful question regarding "${query}".\n\nWhen tackling ${problem.title}, anchor your thinking around the **${problem.pattern}** pattern. Ask yourself: what piece of state must we remember as we scan from left to right?`;
    }

    return {
      id: `msg-${Date.now()}`,
      sender: 'coach',
      text: reply,
      timestamp: 'Just now'
    };
  }
};
