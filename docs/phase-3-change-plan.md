# CodeSpark ⚡ — Phase 3 Change Execution Plan

**Document**: `docs/phase-3-change-plan.md`  
**Date**: September 6, 2026  
**Scope**: Development Order (D0–D10), Integration Order (1–16), Security Order (S1–S3), and Release Order (R0–R10)

---

## 1. Architectural Foundation

To eliminate sequencing contradictions and protect production stability, engineering execution is structured into four distinct, non-conflated dimensions:

* **Development Order (D0–D10)**: Optimizes engineering velocity by allowing parallel development via interfaces, mocks, and fixtures.
* **Integration Order (1–16)**: Connects components in the exact order of their real technical hard dependencies.
* **Security Order (S1–S3)**: Embeds sandbox verification continuously before code runs, per-language during development, and in final release audits.
* **Release Order (R0–R10)**: Incrementally enables functionality in production using feature flags and strict acceptance gates.

Full specification is detailed in [`docs/phase-3-dependency-graph.md`](file:///c:/Users/abhis/.gemini/antigravity-ide/scratch/codelumen/docs/phase-3-dependency-graph.md).

---

## 2. Corrected Development Order (D0 – D10)

* **Phase D0 — Discovery**: Audit existing auth, database, editor, execution infra, deployment.
* **Phase D1 — Contracts & Data**: Database migrations, type definitions, API contracts, execution interfaces.
* **Phase D2 — Frontend Foundation**: Develop in parallel with mocks: Editor, Results Panel, Submissions History, Progress UI, XP UI, Streak UI, Roadmap UI, Draft UI.
* **Phase D3 — Execution Foundation**: `ExecutionService`, sandbox, Python runtime, CPU/memory/output limits, network isolation. *Security testing starts immediately.*
* **Phase D4 — Python Run**: Integrate Editor → Run API → `ExecutionService` → Python Sandbox → Public Tests → Results UI.
* **Phase D5 — Submission & Judging**: Submit API, persistence, queue, judge engine, hidden test evaluation, submission history.
* **Phase D6 — User Progress**: `Accepted → Solve Event (XP, Streak, Solved Problem)`.
* **Phase D7 — Learning System**: Dynamic roadmap progress, next-problem recommendation engine.
* **Phase D8 — Additional Languages**: Implement C++, Java, JavaScript independently with dedicated sandboxes and test fixtures.
* **Phase D9 — Spark AI**: AI service abstraction, context builder, hints, error explanation, complexity analysis.
* **Phase D10 — Hardening**: Multi-layer security testing, 50-request load benchmark, E2E journey tests.

---

## 3. Authoritative Integration Order (1 – 16)

```text
1. Database
        ↓
2. Execution Service
        ↓
3. Sandbox
        ↓
4. Python Runtime
        ↓
5. Run API
        ↓
6. Results UI
        ↓
7. Submission API
        ↓
8. Queue
        ↓
9. Judge
        ↓
10. Submission History
        ↓
11. Solve Event
        ↓
12. XP + Activity
        ↓
13. Roadmap Progress
        ↓
14. Recommendations
        ↓
15. Additional Languages
        ↓
16. Spark AI
```
*(Editor and Draft Autosave integrate independently and can occur earlier.)*

---

## 4. Continuous Security Order (S1 – S3)

* **S1 — BEFORE EXECUTION**: Validate sandbox isolation, process PID separation, environment sanitization, and output limits before running user code.
* **S2 — DURING DEVELOPMENT**: For each language: `Implement → Sandbox test → Attack tests → Resource limits → Integrate`.
* **S3 — FINAL RELEASE AUDIT**: Comprehensive penetration test across auth, authorization, sandbox boundaries, database, APIs, and rate limits.

---

## 5. Production Release Order (R0 – R10)

* **R0 — Existing Application**: Baseline operational, zero new execution enabled.
* **R1 — Foundation**: Migrations, execution service infra, feature flags, health checks.
* **R2 — Python Run**: Enable "Run Python" on public test cases only.
* **R3 — Python Submit**: Enable "Submit" with hidden tests and authoritative judging.
* **R4 — Progress**: Enable Solved status, atomic XP, date-locked streaks, roadmap %.
* **R5 — Recommendations**: Enable "What's Next?" recommendation engine.
* **R6 — Additional Languages**: Staged rollout via independent flags (`CPP_EXECUTION_ENABLED`, `JAVA_EXECUTION_ENABLED`, `JS_EXECUTION_ENABLED`).
* **R7 — Draft & Editor Enhancements**: Advanced editor, autosave, restoration.
* **R8 — Spark AI**: Enable hints, error explanation, approach analysis.
* **R9 — Full Hardening**: Final security audit, 50-request load test, E2E verification.
* **R10 — General Availability**: 100% production rollout.

---

## 6. Feature Isolation & Rollback Guarantees

* **C++ Failure**: `CPP_EXECUTION_ENABLED = false`, Python remains active.
* **Spark AI Failure**: `SPARK_AI_ENABLED = false`, coding workspace remains active.
* **Execution Provider Failure**: `CODE_EXECUTION_ENABLED = false`, problem browsing, roadmap, and draft autosave remain active.
* **Database Migration Reversion**: Apply `001_phase3_execution_jobs.down.sql` without touching user progress or authentication.
