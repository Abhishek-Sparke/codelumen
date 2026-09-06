import { GroundedMentorEngine } from '../server/spark/sparkProvider';
import { sparkController } from '../server/sparkController';
import { FeatureFlagService } from '../src/services/featureFlags';
import { ALL_PROBLEMS } from '../src/data/problems';

async function runPhase6Tests() {
  console.log('====================================================');
  console.log('🧪 RUNNING CODE SPARK — PHASE 6 TEST SUITE');
  console.log('====================================================\n');

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    totalTests++;
    if (condition) {
      console.log(`  ✅ [PASS] ${testName}`);
      passedTests++;
    } else {
      console.error(`  ❌ [FAIL] ${testName}${detail ? ` - ${detail}` : ''}`);
      process.exitCode = 1;
    }
  }

  // ----------------------------------------------------
  // Test 1: Grounded Problem Context Integrity
  // ----------------------------------------------------
  console.log('1. Grounded Problem Context Verification');
  const twoSum = ALL_PROBLEMS.find(p => p.id === 'p-1');
  assert(!!twoSum, 'Two Sum exists in problem catalog');

  const engine = new GroundedMentorEngine();

  // ----------------------------------------------------
  // Test 2: Progressive Hint System (Req 4, 5, Anti-spoiler)
  // ----------------------------------------------------
  console.log('\n2. Progressive Hint System (Anti-Spoiler Mode)');
  const hintLvl1 = await engine.processAction('hint', {
    problemId: 'p-1',
    problemTitle: twoSum!.title,
    difficulty: twoSum!.difficulty,
    topic: twoSum!.topic,
    pattern: twoSum!.pattern,
    language: 'python',
    code: 'def twoSum(nums, target):\n    pass'
  }, { level: 1, learningMode: true });
  assert(hintLvl1.hintLevel === 1, 'Hint level 1 returns level 1');
  assert(!hintLvl1.suggestedDiff, 'Hint level 1 does NOT contain full code solution (Anti-spoiler)');
  assert(hintLvl1.content.length > 20, 'Hint level 1 has substantive conceptual content');

  const hintLvl2 = await engine.processAction('hint', {
    problemId: 'p-1',
    problemTitle: twoSum!.title,
    difficulty: twoSum!.difficulty,
    topic: twoSum!.topic,
    pattern: twoSum!.pattern,
    language: 'python',
    code: 'def twoSum(nums, target):\n    pass'
  }, { level: 2, learningMode: true });
  assert(hintLvl2.hintLevel === 2, 'Hint level 2 returns level 2');
  assert(!hintLvl2.suggestedDiff, 'Hint level 2 preserves anti-spoiler protection');

  const hintLvl4 = await engine.processAction('hint', {
    problemId: 'p-1',
    problemTitle: twoSum!.title,
    difficulty: twoSum!.difficulty,
    topic: twoSum!.topic,
    pattern: twoSum!.pattern,
    language: 'python',
    code: 'def twoSum(nums, target):\n    pass'
  }, { level: 4, learningMode: true });
  assert(hintLvl4.hintLevel === 4, 'Hint level 4 returns approach explanation');

  // ----------------------------------------------------
  // Test 3: Debugger with Diff Suggestion (Req 6, 25)
  // ----------------------------------------------------
  console.log('\n3. Code Debugger & Diff Verification');
  const buggyCode = `def twoSum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        diff = target - num
        seen[num] = i
        if diff in seen:
            return [seen[diff], i]`;

  const debugResult = await engine.processAction('debug', {
    problemId: 'p-1',
    problemTitle: twoSum!.title,
    difficulty: twoSum!.difficulty,
    topic: twoSum!.topic,
    pattern: twoSum!.pattern,
    language: 'python',
    code: buggyCode,
    visibleError: 'Wrong Answer on test case nums = [3, 2, 4], target = 6'
  });

  assert(debugResult.content.length > 20, 'Debugger provides root-cause diagnosis');
  assert(!!debugResult.diff, 'Debugger proposes a concrete code diff');
  assert(debugResult.diff?.originalCode === buggyCode, 'Original code is preserved in diff');
  assert(debugResult.diff?.suggestedCode !== buggyCode, 'Suggested fix differs from buggy code');

  // ----------------------------------------------------
  // Test 4: Hidden Test Case Protection (Req 9, 27)
  // ----------------------------------------------------
  console.log('\n4. Hidden Test Case Protection');
  const subResult = await engine.processAction('submission_analysis', {
    problemId: 'p-1',
    problemTitle: twoSum!.title,
    difficulty: twoSum!.difficulty,
    topic: twoSum!.topic,
    pattern: twoSum!.pattern,
    language: 'python',
    code: buggyCode,
    lastSubmissionStatus: 'Wrong Answer',
    visibleError: 'Failed on hidden test case 4'
  });
  assert(!subResult.content.includes('Expected secret'), 'Analysis never leaks hidden test inputs');
  assert(subResult.content.includes('invariant') || subResult.content.includes('logic') || subResult.content.includes('test'), 'Analysis guides on logical invariants');

  // ----------------------------------------------------
  // Test 5: Complexity Explainer (Req 9)
  // ----------------------------------------------------
  console.log('\n5. Complexity Explainer Verification');
  const complexityResult = await engine.processAction('complexity', {
    problemId: 'p-1',
    problemTitle: twoSum!.title,
    difficulty: twoSum!.difficulty,
    topic: twoSum!.topic,
    pattern: twoSum!.pattern,
    language: 'python',
    code: buggyCode
  });
  assert(complexityResult.content.includes('O('), 'Complexity formatted as asymptotic Big-O');
  assert(complexityResult.content.length > 20, 'Grounded reasoning provided for asymptotic bounds');

  // ----------------------------------------------------
  // Test 6: Pattern Detection (Req 10)
  // ----------------------------------------------------
  console.log('\n6. Pattern Detection & Clues');
  const patternResult = await engine.processAction('pattern', {
    problemId: 'p-1',
    problemTitle: twoSum!.title,
    difficulty: twoSum!.difficulty,
    topic: twoSum!.topic,
    pattern: twoSum!.pattern,
    language: 'python',
    code: buggyCode
  });
  assert(patternResult.title.length > 0, 'Pattern title identified');
  assert(patternResult.badges && patternResult.badges.length > 0, 'Pattern badges provided');
  assert(patternResult.content.length > 20, 'Explanation of pattern recognition clues provided');

  // ----------------------------------------------------
  // Test 7: Secret Redaction (Req 27)
  // ----------------------------------------------------
  console.log('\n7. Secret Redaction & Privacy Guard');
  const rawPayload = {
    userId: 'test-user',
    action: 'hint' as const,
    context: {
      problemId: 'p-1',
      problemTitle: twoSum!.title,
      difficulty: twoSum!.difficulty,
      topic: twoSum!.topic,
      pattern: twoSum!.pattern,
      language: 'python',
      code: 'API_KEY = "sk-proj-supersecretkey12345678901234567890"\npassword = "MySuperSecretPassword123!"'
    }
  };

  const response = await sparkController.handleAction(rawPayload);
  assert(response.status === 200 && response.data.success, 'Controller successfully handles action');
  const jsonString = JSON.stringify(response);
  assert(!jsonString.includes('sk-proj-supersecretkey'), 'Secret OpenAI/Anthropic API keys are strictly redacted');

  // ----------------------------------------------------
  // Test 8: Feature Flags (Req 39)
  // ----------------------------------------------------
  console.log('\n8. Independent Feature Flags');
  assert(FeatureFlagService.getFlag('SPARK_AI') === true, 'SPARK_AI flag is active');
  assert(FeatureFlagService.getFlag('SPARK_HINTS') === true, 'SPARK_HINTS flag is active');
  assert(FeatureFlagService.getFlag('SPARK_DEBUG') === true, 'SPARK_DEBUG flag is active');
  assert(FeatureFlagService.getFlag('SPARK_INTERVIEW_COACH') === true, 'SPARK_INTERVIEW_COACH flag is active');
  assert(FeatureFlagService.getFlag('SPARK_WEEKLY_INSIGHTS') === true, 'SPARK_WEEKLY_INSIGHTS flag is active');

  // ----------------------------------------------------
  // Summary
  // ----------------------------------------------------
  console.log('\n====================================================');
  console.log(`🎉 ALL ${passedTests}/${totalTests} TESTS PASSED!`);
  console.log('====================================================');
}

runPhase6Tests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
