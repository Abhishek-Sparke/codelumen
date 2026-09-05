import test from 'node:test';
import assert from 'node:assert/strict';

// Isolated streak logic mirroring StorageService implementation
function calculateStreakUpdate(priorStreak, activityDates, newDateStr) {
  const dates = new Set(activityDates);
  const alreadyActiveToday = dates.has(newDateStr);
  
  if (alreadyActiveToday) {
    return {
      currentStreak: priorStreak,
      activityDates: Array.from(dates)
    };
  }

  dates.add(newDateStr);
  const sortedDates = Array.from(dates).sort();
  
  if (sortedDates.length === 1) {
    return {
      currentStreak: 1,
      activityDates: sortedDates
    };
  }

  const today = new Date(newDateStr);
  const yesterday = new Date(today);
  yesterday.setUTCDate(today.getUTCDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  const wasActiveYesterday = dates.has(yesterdayStr);
  const newStreak = wasActiveYesterday ? priorStreak + 1 : 1;

  return {
    currentStreak: newStreak,
    activityDates: sortedDates
  };
}

test('STEP 12 — Streak Calculation Unit Tests', async (t) => {
  await t.test('12.1 First activity sets streak to 1', () => {
    const res = calculateStreakUpdate(0, [], '2026-09-01');
    assert.equal(res.currentStreak, 1);
    assert.deepEqual(res.activityDates, ['2026-09-01']);
  });

  await t.test('12.2 Same-day multiple solves do not increment streak', () => {
    const res = calculateStreakUpdate(1, ['2026-09-01'], '2026-09-01');
    assert.equal(res.currentStreak, 1);
    assert.equal(res.activityDates.length, 1);
  });

  await t.test('12.3 Consecutive day solve increments streak', () => {
    const res = calculateStreakUpdate(1, ['2026-09-01'], '2026-09-02');
    assert.equal(res.currentStreak, 2);
    assert.deepEqual(res.activityDates, ['2026-09-01', '2026-09-02']);
  });

  await t.test('12.4 Missed day resets streak to 1', () => {
    const res = calculateStreakUpdate(5, ['2026-08-25', '2026-08-26', '2026-08-27'], '2026-09-01');
    assert.equal(res.currentStreak, 1);
    assert.ok(res.activityDates.includes('2026-08-25')); // historical activity preserved
  });
});
