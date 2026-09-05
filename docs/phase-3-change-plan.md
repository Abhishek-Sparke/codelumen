# CodeSpark ⚡ — Phase 3 Change Execution Plan

**Document**: `docs/phase-3-change-plan.md`  
**Date**: September 6, 2026  
**Scope**: Systematic rollout, risk evaluation, and verification gates

---

## 1. Objectives

1. Enable authoritative, isolated code execution for Python 3 and JavaScript.
2. Provide deterministic judging with masked hidden test cases.
3. Transition execution job statuses: `queued` → `running` → `completed` / `failed`.
4. Update user progress, XP, and streak strictly upon `ACCEPTED` submissions.
5. Provide multi-level rollback capabilities through feature flags and additive schemas.

---

## 2. Step-by-Step Change Breakdown

### Step 1: Project Audit & Baseline Preservation
* Deliverable: `docs/phase-3-audit.md`, `docs/phase-3-change-plan.md`.
* Verification: 100% auth & schema preservation verified.

### Step 2: Phase 2 Data Model Validation & Migration
* Deliverable: `database/migrations/001_phase3_execution_jobs.sql`, `docs/phase-3-schema.md`.
* Risk Mitigation: Additive table only. No alteration to existing user or problem tables.

### Step 3: Execution Service Abstraction
* Deliverable: Normalized `ExecutionService` with `runCode()`, `submitCode()`, and `getExecutionStatus()`.
* Risk Mitigation: Interface decouples frontend from specific backend runner.

### Step 4: Sandbox Isolation & Security
* Deliverable: `server/isolatedRunner.ts`, `docs/execution-security.md`.
* Risk Mitigation: Subprocess isolation, 2.5s CPU timeout, 256 MB memory cap, 256 KB output ceiling, stripped environment.

### Step 5: Python Run API
* Deliverable: `POST /api/code/run` executing public test cases only.
* Risk Mitigation: Run requests do not touch `user_problem_progress` or award XP.

### Step 6: Test Result UI
* Deliverable: Upgraded results panel in `ProblemWorkspace.tsx` with tabs for test cases, console stdout/stderr, and past submissions.

### Step 7: Submission & Execution Jobs
* Deliverable: `POST /api/code/submit` generating unique `submission_id` and `job_id`, transitioning job state to terminal status.

### Step 8: Deterministic Judge Engine
* Deliverable: `src/services/execution/judgeEngine.ts` evaluating test outcomes into normalized verdicts (`ACCEPTED`, `WRONG_ANSWER`, `TIME_LIMIT_EXCEEDED`, `MEMORY_LIMIT_EXCEEDED`, `RUNTIME_ERROR`, `COMPILATION_ERROR`, `SYSTEM_ERROR`).

### Step 9: Submission History
* Deliverable: Scoped submission viewer in workspace allowing inspection of past code submissions.

### Step 10: Solved Status Updates
* Deliverable: First `ACCEPTED` verdict sets `user_problem_progress.status = 'solved'`.

### Step 11: XP Ledger
* Deliverable: Easy (+100 XP), Medium (+200 XP), Hard (+300 XP) awarded on first solve only; duplicate solves award 0 XP.

### Step 12: Activity & Streak Tracking
* Deliverable: `docs/streak-rules.md`. Maximum 1 streak increment per calendar date.

### Step 13: Dynamic Roadmap Progress
* Deliverable: Dynamic % calculation in `RoadmapView.tsx` derived from verified solves.

### Step 14: 5-Tier Next Problem Recommendation
* Deliverable: `src/services/recommendationService.ts` providing deterministic recommendations with 100% fallback reliability.

### Step 15: Multi-Language Configuration
* Deliverable: Python 3 and JavaScript enabled; C++ and Java safely gated via feature flags.

### Step 16 & 17: Editor & Draft Autosave
* Deliverable: `src/services/draftService.ts` maintaining separate drafts per user, problem, and language.

### Step 18: Spark AI Hooks
* Deliverable: `src/services/sparkAIService.ts` providing sanitized AI actions.

### Step 19 & 20: Security & Performance Audit
* Deliverable: `docs/phase-3-security-report.md`, `docs/phase-3-performance-report.md`.

### Step 21 & 22: UI Polish & End-to-End Verification
* Deliverable: Accessible UI with no horizontal overflow; 15/15 automated tests passing; `docs/phase-3-final-report.md`.

---

## 3. Rollback & Reversibility Strategy

* **Execution Provider Rollback**: Set `CODE_EXECUTION_ENABLED=false`. CodeSpark remains fully usable for reading lessons, viewing roadmaps, and browsing problems.
* **Database Rollback**: Run `database/migrations/001_phase3_execution_jobs.down.sql` dropping `codespark_execution_jobs`.
* **Deployment Rollback**: Revert git commit on `main` branch or instant roll back via Vercel dashboard.
