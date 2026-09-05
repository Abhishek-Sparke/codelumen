import test from 'node:test';
import assert from 'node:assert/strict';

function calculateRoadmapSectionProgress(requiredProblemIds, solvedProblemIds) {
  if (!requiredProblemIds || requiredProblemIds.length === 0) {
    return { solvedCount: 0, totalCount: 0, percentage: 0 };
  }
  const solvedSet = new Set(solvedProblemIds);
  const solvedCount = requiredProblemIds.filter(id => solvedSet.has(id)).length;
  const percentage = Math.round((solvedCount / requiredProblemIds.length) * 100);
  return {
    solvedCount,
    totalCount: requiredProblemIds.length,
    percentage
  };
}

test('STEP 13 — Roadmap Progress Calculation Tests', async (t) => {
  const section10Problems = [
    'p1', 'p2', 'p3', 'p4', 'p5',
    'p6', 'p7', 'p8', 'p9', 'p10'
  ];

  await t.test('13.1 0 / 10 solved produces exactly 0%', () => {
    const res = calculateRoadmapSectionProgress(section10Problems, []);
    assert.equal(res.percentage, 0);
    assert.equal(res.solvedCount, 0);
  });

  await t.test('13.2 1 / 10 solved produces exactly 10%', () => {
    const res = calculateRoadmapSectionProgress(section10Problems, ['p1']);
    assert.equal(res.percentage, 10);
    assert.equal(res.solvedCount, 1);
  });

  await t.test('13.3 5 / 10 solved produces exactly 50%', () => {
    const res = calculateRoadmapSectionProgress(section10Problems, ['p1', 'p3', 'p5', 'p7', 'p9']);
    assert.equal(res.percentage, 50);
    assert.equal(res.solvedCount, 5);
  });

  await t.test('13.4 10 / 10 solved produces exactly 100%', () => {
    const res = calculateRoadmapSectionProgress(section10Problems, section10Problems);
    assert.equal(res.percentage, 100);
    assert.equal(res.solvedCount, 10);
  });

  await t.test('13.5 Unrelated solved problems do not falsely increase section progress', () => {
    const res = calculateRoadmapSectionProgress(section10Problems, ['unrelated-1', 'unrelated-2', 'p1']);
    assert.equal(res.percentage, 10);
    assert.equal(res.solvedCount, 1);
  });
});
