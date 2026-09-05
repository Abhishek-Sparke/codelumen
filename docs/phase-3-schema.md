# CodeSpark ⚡ — Phase 3 Relational Database Schema & Migration Guide

**Document**: `docs/phase-3-schema.md`  
**Date**: September 6, 2026  
**Scope**: Relational Entities, Foreign Keys, Indexes, and Rollback Procedures

---

## 1. Verified Phase 2 Relational Model

The following entities exist and maintain full referential integrity:

```text
┌────────────────┐       ┌────────────────────────┐
│     users      │◄──────┤  user_problem_progress │
└───────┬────────┘       └───────────┬────────────┘
        │                            │
        │ 1:N                        │ N:1
        ▼                            ▼
┌────────────────┐       ┌────────────────────────┐
│  submissions   │◄──────┤        problems        │
└───────┬────────┘       └───────────┬────────────┘
        │                            │
        │ 1:1                        │ 1:N
        ▼                            ▼
┌────────────────────────┐       ┌────────────────────────┐
│codespark_execution_jobs│       │   problem_test_cases   │
└────────────────────────┘       └────────────────────────┘
```

---

## 2. Table Specifications

### 2.1 `submissions`
* `id` (VARCHAR(64), Primary Key): Unique submission identifier.
* `user_id` (UUID / VARCHAR(64), Foreign Key → `users.id`): Author of the submission.
* `problem_id` (VARCHAR(64), Foreign Key → `problems.id`): Problem submitted for.
* `language` (VARCHAR(32)): 'python', 'javascript', 'cpp', 'java'.
* `code` (TEXT): Submitted source code.
* `status` (VARCHAR(32)): 'Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Runtime Error', 'Memory Limit Exceeded', 'Compilation Error', 'System Error'.
* `runtime_ms` (FLOAT): Milliseconds elapsed in sandbox execution.
* `memory_kb` (FLOAT): Peak memory consumed.
* `created_at` (TIMESTAMPTZ): Submission creation timestamp.

### 2.2 `codespark_execution_jobs` (Phase 3 Additive Table)
* `id` (VARCHAR(64), Primary Key): Unique execution job identifier.
* `submission_id` (VARCHAR(64), Foreign Key → `submissions.id` ON DELETE CASCADE).
* `status` (VARCHAR(32)): 'queued', 'running', 'completed', 'failed'.
* `provider` (VARCHAR(64)): 'codespark-sandbox'.
* `started_at` (TIMESTAMPTZ): Worker start time.
* `completed_at` (TIMESTAMPTZ): Worker completion time.
* `error_code` (VARCHAR(64)): Optional normalized error classification.
* `created_at` (TIMESTAMPTZ): Job enqueue timestamp.

### 2.3 `user_problem_progress`
* `user_id` (VARCHAR(64), Foreign Key → `users.id`): Scoped user.
* `problem_id` (VARCHAR(64), Foreign Key → `problems.id`): Target problem.
* `status` (VARCHAR(32)): 'unsolved', 'attempted', 'solved'.
* `solved_at` (TIMESTAMPTZ): Timestamp of first authentic solve.
* `attempts_count` (INTEGER): Number of submissions.
* `last_submission_id` (VARCHAR(64)): Pointer to latest submission.

### 2.4 `submission_drafts`
* `user_id` (VARCHAR(64), Foreign Key → `users.id`).
* `problem_id` (VARCHAR(64), Foreign Key → `problems.id`).
* `language` (VARCHAR(32)): 'python' | 'javascript'.
* `code` (TEXT): Current draft code.
* `updated_at` (TIMESTAMPTZ): Timestamp of last autosave.

---

## 3. Migration & Rollback Strategy

1. **Forward Migration**: Apply `001_phase3_execution_jobs.sql`.
   * Adds `codespark_execution_jobs` table.
   * Creates indexes on `submission_id` and `status`.
   * Does NOT alter or delete any existing table or row.
2. **Rollback Migration**: Apply `001_phase3_execution_jobs.down.sql`.
   * Safely drops `codespark_execution_jobs` table and its indexes.
   * All user profiles, problems, progress, and submissions remain 100% intact.

---

## 4. Acceptance Verification

* [x] 100% of required foreign keys resolve correctly.
* [x] 100% of user-owned tables enforce user ownership.
* [x] 0 duplicate Phase 2 tables exist.
* [x] 0 existing user records deleted.
* [x] 0 destructive migrations performed without backup/rollback.
