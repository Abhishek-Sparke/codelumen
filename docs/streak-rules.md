# CodeSpark ⚡ — Streak & Activity Tracking Specification

**Document**: `docs/streak-rules.md`  
**Date**: September 6, 2026  
**Scope**: Activity Tracking, Streak Increment Rules, and Date Calculations

---

## 1. Streak Calculation Rules

1. **Activity Date Granularity**:
   * Activity dates are recorded in UTC ISO format (`YYYY-MM-DD`).
   * Multiple problem solves on the same calendar date count as **exactly 1 activity day**.
2. **Consecutive Day Solves**:
   * If a user solves a problem on day $T$ and their last recorded activity was day $T-1$, `currentStreak` increments by 1.
   * If `currentStreak` exceeds `longestStreak`, `longestStreak` is updated to equal `currentStreak`.
3. **Same-Day Solves**:
   * If a user solves multiple problems on day $T$, the streak count is unchanged (no double-counting).
4. **Missed Day Resets**:
   * If a user solves a problem on day $T$ and their last activity was earlier than day $T-1$, `currentStreak` resets to 1.
5. **Historical Integrity**:
   * Activity history is monotonically additive. Recalculation never deletes historical activity dates.

---

## 2. Acceptance Matrix

| Scenario | Prior State | Activity Today | Resulting Streak |
|---|---|---|:---:|
| First Activity | Streak = 0, no dates | Solved 1 problem | Streak = 1 |
| Same-Day Activity | Streak = 1, active today | Solved 2nd problem | Streak = 1 (no double increment) |
| Consecutive Day | Streak = 1, active yesterday | Solved 1 problem | Streak = 2 |
| Missed Day | Streak = 5, active 3 days ago | Solved 1 problem | Streak = 1 (reset) |

---

## 3. Verification

Verified via unit tests in `tests/streakService.test.mjs`.
