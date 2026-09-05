# CodeSpark ⚡ — Phase 3 Change Execution Plan

**Document**: `docs/phase-3-change-plan.md`  
**Date**: September 6, 2026  
**Scope**: Development DAG, Gated Release Order, Risk Evaluation, and Verification Milestones

---

## 1. Architectural Strategy: Development Order vs. Release Order

To prevent circular dependencies and premature execution risks, implementation and release are formally separated:

* **Development Order (Build DAG)**: Dictated by bottom-up technical dependencies. Primitives, types, security sandboxing, and judge engines are built and unit-tested before API endpoints and workspace UI.
* **Release Order (Gated Tranches)**: Dictated by feature flags (`CODE_EXECUTION_ENABLED`, `PYTHON_EXECUTION_ENABLED`, `SPARK_AI_ENABLED`) and observability gates. Features are deployed dark, verified in staging, enabled in beta run mode, and then promoted to full judging and progress.

Full dependency analysis and contradiction resolutions are documented in [`docs/phase-3-dependency-graph.md`](file:///c:/Users/abhis/.gemini/antigravity-ide/scratch/codelumen/docs/phase-3-dependency-graph.md).

---

## 2. Technical Development Order (Acyclic DAG)

### Layer 0: Contracts & Foundation
* **Step 1**: Project Audit & Baseline Preservation (`docs/phase-3-audit.md`).
* **Step 2**: Additive Database Migration (`database/migrations/001_phase3_execution_jobs.sql`).
* **Step 3**: Types & Execution Service Abstraction (`IExecutionProvider`).

### Layer 1: Core Sandboxed Engines (Headless & Verifiable)
* **Step 2b**: Test Case Repository (Public vs Hidden separation).
* **Step 4**: Isolated Sandbox Runners (Python 3.14 / Node.js with CPU/memory/output bounds).
* **Step 8**: Deterministic Judge Engine (Evaluating stdout against expected fixtures, hidden test masking).

### Layer 2: Client State & Data Services
* **Step 16a**: Editor primitives (tab indentation, font size, reset).
* **Step 17**: `DraftService` (autosave, language-specific draft isolation).
* **Step 10-12**: Progress & Reward Service (atomic solve updates, XP ledger, calendar-locked streak).
* **Step 13**: Roadmap Progress Calculator (exact percentages).
* **Step 14**: `RecommendationService` (deterministic 5-tier recommendation engine).

### Layer 3: API & Orchestration Layer
* **Step 5**: `POST /api/code/run` (Public test debugging endpoint).
* **Step 7**: `POST /api/code/submit` & Execution Jobs (Queue state machine).
* **Step 18**: `SparkAIService` (Sanitized context, zero hidden test exposure).
* **Step 3b**: Circuit Breaker & Rate Limiter (3-failure threshold, 30s cooldown fallback).

### Layer 4: Workspace UI Integration
* **Step 6**: Results Panel UI (`Test Cases`, `Console`, `Submissions` tabs).
* **Step 9**: Submission History Tab & Code Viewer.
* **Step 16b**: Language Selector & Unsaved Changes Confirmation Modal.
* **Step 21**: UI Polish, Accessibility, Responsive Mobile Layout.
* **Step 10b**: "Problem Solved ⚡" Celebration Modal & Next Problem Action.

### Layer 5: Verification & Hardening
* **Step 19**: Comprehensive Security Sandbox Audit (8/8 attack vectors).
* **Step 20**: Performance & Load Benchmark (50 concurrent requests).
* **Step 22**: Complete End-to-End User Journey Tests (New user flow & Failed user flow).

---

## 3. Production Release Order (Gated Rollout Tranches)

```text
Tranche 0 (Dark Launch)
Migrations + Endpoints deployed behind flags (CODE_EXECUTION_ENABLED = false)
        │
        ▼ Gate 1: DB & API health checks pass 100%
Tranche 1 (Internal Staging)
Synthetic tests run against staging (0 sandbox escapes, 50 reqs pass)
        │
        ▼ Gate 2: Security & Load test pass rates = 100%
Tranche 2 (Public Beta Run Mode)
CODE_EXECUTION_ENABLED = true, PYTHON_EXECUTION_ENABLED = true, JS_EXECUTION_ENABLED = true
Run button active on public tests. Submit disabled. 0 risk to user progress.
        │
        ▼ Gate 3: Error rate < 1%, zero host process crashes
Tranche 3 (Full Submit & Progress - Core Launch)
Submit button active. Full judging + Solved status + XP + Streaks + Roadmap %.
Circuit breaker active with 30s cooldown fallback.
        │
        ▼ Gate 4: Zero false ACCEPTED, zero lost submissions
Tranche 4 (Spark AI Enhancement)
SPARK_AI_ENABLED = true. Sanitized context only; graceful fallback on failure.
        │
        ▼ Gate 5: Additional Language Promotion
Tranche 5 (C++ / Java Multi-Language)
Promoted independently only when compiler sandbox containers pass Gate 5.
```

---

## 4. Rollback & Reversibility Strategy

* **Instant Execution Rollback**: In `src/services/featureFlags.ts` (or console): set `CODE_EXECUTION_ENABLED=false`. CodeSpark remains fully operational for problem browsing, roadmaps, lessons, and draft autosave.
* **Language Rollback**: Set `PYTHON_EXECUTION_ENABLED=false` or `JS_EXECUTION_ENABLED=false` to disable an individual language without affecting the other.
* **Database Rollback**: Apply `001_phase3_execution_jobs.down.sql` dropping `codespark_execution_jobs` with zero impact on user progress or authentication.
* **Deployment Rollback**: Instant reversion via Git commit or Vercel dashboard.
