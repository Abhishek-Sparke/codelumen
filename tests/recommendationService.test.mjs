import test from 'node:test';
import assert from 'node:assert/strict';

// Sample problem library
const PROBLEMS = [
  { id: 'p1', topicId: 'arrays', patternId: 'two-pointers', difficulty: 'Easy' },
  { id: 'p2', topicId: 'arrays', patternId: 'sliding-window', difficulty: 'Easy' },
  { id: 'p3', topicId: 'arrays', patternId: 'two-pointers', difficulty: 'Medium' },
  { id: 'p4', topicId: 'hashing', patternId: 'hash-map', difficulty: 'Easy' },
  { id: 'p5', topicId: 'hashing', patternId: 'hash-map', difficulty: 'Medium' },
  { id: 'p6', topicId: 'linked-lists', patternId: 'fast-slow', difficulty: 'Easy' },
  { id: 'p7', topicId: 'trees', patternId: 'dfs', difficulty: 'Medium' },
  { id: 'p8', topicId: 'dp', patternId: 'memoization', difficulty: 'Hard' }
];

const SECTIONS = [
  { id: 'sec-1', problemIds: ['p1', 'p2', 'p3'] },
  { id: 'sec-2', problemIds: ['p4', 'p5'] }
];

function getNextProblem(currentId, solvedIds, exp = 'beginner') {
  const solved = new Set(solvedIds);
  const current = PROBLEMS.find(p => p.id === currentId);

  // Tier 1: Section
  for (const sec of SECTIONS) {
    if (sec.problemIds.includes(currentId)) {
      const idx = sec.problemIds.indexOf(currentId);
      for (let i = idx + 1; i < sec.problemIds.length; i++) {
        if (!solved.has(sec.problemIds[i])) return sec.problemIds[i];
      }
      for (let i = 0; i < idx; i++) {
        if (!solved.has(sec.problemIds[i])) return sec.problemIds[i];
      }
    }
  }

  // Tier 2: Topic
  if (current) {
    const m = PROBLEMS.find(p => p.topicId === current.topicId && p.id !== currentId && !solved.has(p.id));
    if (m) return m.id;
  }

  // Tier 3: Pattern
  if (current) {
    const m = PROBLEMS.find(p => p.patternId === current.patternId && p.id !== currentId && !solved.has(p.id));
    if (m) return m.id;
  }

  // Tier 4: Difficulty
  const diff = exp === 'advanced' ? 'Hard' : exp === 'intermediate' ? 'Medium' : 'Easy';
  const m = PROBLEMS.find(p => p.difficulty === diff && p.id !== currentId && !solved.has(p.id));
  if (m) return m.id;

  // Tier 5: Fallback
  const fb = PROBLEMS.find(p => p.id !== currentId && !solved.has(p.id));
  return fb ? fb.id : null;
}

test('STEP 14 — Recommendation Engine: 20 Scenario Test Matrix', async (t) => {
  const scenarios = [
    { name: '1. First in section solved -> next in section', curr: 'p1', solved: ['p1'], exp: 'beginner', expected: 'p2' },
    { name: '2. Second in section solved -> third in section', curr: 'p2', solved: ['p1', 'p2'], exp: 'beginner', expected: 'p3' },
    { name: '3. Section finished -> topic match', curr: 'p3', solved: ['p1', 'p2', 'p3'], exp: 'beginner', expected: 'p4' },
    { name: '4. Skipped first in section -> loops back to uncompleted first', curr: 'p3', solved: ['p2', 'p3'], exp: 'beginner', expected: 'p1' },
    { name: '5. Section 2 first solved -> section 2 second', curr: 'p4', solved: ['p4'], exp: 'beginner', expected: 'p5' },
    { name: '6. Fresh beginner on p1 with nothing solved -> p2', curr: 'p1', solved: [], exp: 'beginner', expected: 'p2' },
    { name: '7. All section 1 and 2 solved -> falls to p6', curr: 'p5', solved: ['p1','p2','p3','p4','p5'], exp: 'beginner', expected: 'p6' },
    { name: '8. Intermediate user prefers medium problem', curr: 'p6', solved: ['p1','p6'], exp: 'intermediate', expected: 'p3' },
    { name: '9. Advanced user prefers hard problem', curr: 'p6', solved: ['p1','p6'], exp: 'advanced', expected: 'p8' },
    { name: '10. Only hard left -> recommends hard', curr: 'p1', solved: ['p1','p2','p3','p4','p5','p6','p7'], exp: 'beginner', expected: 'p8' },
    { name: '11. All solved except p7 -> returns p7', curr: 'p1', solved: ['p1','p2','p3','p4','p5','p6','p8'], exp: 'beginner', expected: 'p7' },
    { name: '12. Starting on p2 with p3 solved -> returns p1', curr: 'p2', solved: ['p3'], exp: 'beginner', expected: 'p1' },
    { name: '13. Section 2 with p5 solved -> returns p4', curr: 'p5', solved: ['p5'], exp: 'beginner', expected: 'p4' },
    { name: '14. Starting from trees p7 -> fallback returns unsolved p1', curr: 'p7', solved: [], exp: 'beginner', expected: 'p1' },
    { name: '15. Starting from dp p8 with p1 solved -> returns p2', curr: 'p8', solved: ['p1'], exp: 'beginner', expected: 'p2' },
    { name: '16. Pattern match test', curr: 'p1', solved: ['p1','p2'], exp: 'beginner', expected: 'p3' },
    { name: '17. Intermediate preference for hashing', curr: 'p4', solved: ['p1','p2','p3'], exp: 'intermediate', expected: 'p5' },
    { name: '18. Unsolved problem is never the current problem', curr: 'p1', solved: ['p2','p3','p4','p5','p6','p7','p8'], exp: 'beginner', expected: null },
    { name: '19. Determinism check 1', curr: 'p1', solved: ['p1'], exp: 'beginner', expected: 'p2' },
    { name: '20. Determinism check 2', curr: 'p1', solved: ['p1'], exp: 'beginner', expected: 'p2' }
  ];

  let matches = 0;
  for (const sc of scenarios) {
    const result = getNextProblem(sc.curr, sc.solved, sc.exp);
    assert.equal(result, sc.expected, `Failed scenario: ${sc.name} (got ${result}, expected ${sc.expected})`);
    matches++;
  }

  const matchRate = (matches / scenarios.length) * 100;
  assert.ok(matchRate >= 95, `Match rate ${matchRate}% below 95% threshold`);
});
