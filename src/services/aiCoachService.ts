import { Problem, AICoachMessage } from '../types';

export const AICoachService = {
  getInitialGreeting(problem: Problem): AICoachMessage {
    return {
      id: 'msg-init',
      sender: 'coach',
      text: `Hello! I'm your Socratic AI Coach for "${problem.title}".\n\nI will guide your problem-solving process with deliberate inquiry rather than simply revealing the answer. Where would you like to start?`,
      timestamp: 'Just now'
    };
  },

  getNextHint(problem: Problem, currentHintLevel: number): { message: AICoachMessage; nextLevel: number } {
    const nextLevel = Math.min(3, currentHintLevel + 1) as 1 | 2 | 3;
    const hint = problem.hints.find(h => h.level === nextLevel) || {
      level: nextLevel,
      title: 'Guidance',
      content: `Consider the problem constraints and invariants. How does a ${problem.pattern} approach transform the time complexity?`
    };

    let titlePrefix = '';
    if (nextLevel === 1) titlePrefix = '💡 Hint 1 (Conceptual)';
    else if (nextLevel === 2) titlePrefix = '🔍 Hint 2 (Specific Direction)';
    else titlePrefix = '⚡ Hint 3 (Near-Solution)';

    return {
      message: {
        id: `msg-${Date.now()}`,
        sender: 'coach',
        text: `### ${titlePrefix}: ${hint.title}\n\n${hint.content}\n\n*Does this prompt an idea? Try applying this thought in your code editor.*`,
        timestamp: 'Just now',
        hintLevel: nextLevel
      },
      nextLevel
    };
  },

  explainPattern(problem: Problem): AICoachMessage {
    return {
      id: `msg-${Date.now()}`,
      sender: 'coach',
      text: `### Pattern Breakdown: ${problem.pattern}\n\n${problem.editorial.patternExplanation}\n\n**Why it applies here:**\nThe input constraints (${problem.constraints[0] || 'large N'}) rule out quadratic brute forces. By maintaining an invariant with the **${problem.pattern}** pattern, you can reduce repetitive scans into a single linear or logarithmic pass.`,
      timestamp: 'Just now'
    };
  },

  explainFailure(problem: Problem, userCode: string, failedTestDetails?: any): AICoachMessage {
    const snippetCheck = userCode.toLowerCase();
    let diagnostic = '';

    if (snippetCheck.includes('pass') || userCode.trim().length < 50) {
      diagnostic = 'It looks like your function is still empty or returning a placeholder value. Start by identifying your base cases and loop structure.';
    } else if (!snippetCheck.includes('return')) {
      diagnostic = 'Notice that your function does not appear to return any value. Make sure you explicitly return the result.';
    } else if (failedTestDetails) {
      diagnostic = `Your code produced \`${JSON.stringify(failedTestDetails.actual)}\` for input \`${JSON.stringify(failedTestDetails.input)}\`, but expected \`${JSON.stringify(failedTestDetails.expected)}\`.\n\nCheck for off-by-one indices or boundary conditions (e.g. empty inputs or duplicate keys).`;
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

  reviewComplexity(problem: Problem, userCode: string): AICoachMessage {
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

    return {
      id: `msg-${Date.now()}`,
      sender: 'coach',
      text: `### Complexity Analysis of Your Code\n\n- **Estimated Time:** \`${timeEstimate}\`\n- **Estimated Space:** \`${spaceEstimate}\`\n\n**Optimal Target:**\n- **Time:** \`${problem.editorial.optimal.complexity.time}\`\n- **Space:** \`${problem.editorial.optimal.complexity.space}\`\n\n${timeEstimate.includes('n²') ? '⚠️ Watch out: your nested loops may hit Time Limit Exceeded (TLE) on large inputs.' : '✅ Your complexity is on track with the optimal algorithmic bound!'}`,
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

  answerFreeform(problem: Problem, query: string): AICoachMessage {
    const q = query.toLowerCase();
    let reply = '';

    if (q.includes('hint')) {
      return this.getNextHint(problem, 1).message;
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
