# CodeSpark ⚡ — Phase 3 Dependency Graph & Order Separation

**Document**: `docs/phase-3-dependency-graph.md`  
**Date**: September 6, 2026  
**Status**: Final & Verified  
**Scope**: Dependency Graph Contradiction Resolution, Development DAG, and Staged Release Order

---

## 1. Executive Summary

A common failure mode in complex platform engineering is conflating **Development Order (Build Dependency Graph)** with **Release Order (Deployment & Feature-Flag Rollout)**.

In a naive linear sequence (e.g. Steps 1 through 22 in strict numeric sequence), multiple architectural contradictions arise:
1. Components are scheduled after features that depend on them (e.g. Editor & Drafts scheduled after Run/Submit).
2. Security audits are scheduled after untrusted code execution has already been introduced.
3. Downstream progress rewards are split into arbitrary steps despite forming a single reactive state machine.

This document resolves all dependency graph contradictions and establishes a strict separation between:
* **The Development DAG**: The acyclic technical build order dictated by software dependencies and component interfaces.
* **The Release Pipeline**: The risk-managed deployment order dictated by observability, feature flags, and phase gates.

---

## 2. Dependency Graph Contradictions & Formal Resolutions

```text
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                             CONTRADICTION RESOLUTION MATRIX                                │
├──────────────────────────┬────────────────────────────┬─────────────────────────────────────┤
│ Naive Sequence           │ Conflict / Contradiction   │ Architectural Resolution            │
├──────────────────────────┼────────────────────────────┼─────────────────────────────────────┤
│ Step 4: Sandbox          │ Code is executed in Step 5 │ Base Sandbox Hardening is a Layer 1 │
│ vs                       │ and 7 BEFORE the security  │ prerequisite. Comprehensive PenTest │
│ Step 19: Security Audit  │ audit in Step 19.          │ is a Gate 6 Pre-Release Gate.       │
├──────────────────────────┼────────────────────────────┼─────────────────────────────────────┤
│ Step 7: Submission Queue │ Step 7 submits jobs to a   │ Build the Judge Engine first in     │
│ vs                       │ judge, but the judge is    │ Layer 1; wire the submission queue  │
│ Step 8: Judge Engine     │ built in Step 8.           │ to consume it in Layer 3.           │
├──────────────────────────┼────────────────────────────┼─────────────────────────────────────┤
│ Step 5/7: Run & Submit   │ Users cannot run or submit │ Build Editor state & DraftService   │
│ vs                       │ code without a resilient   │ in Layer 2 before wiring workspace  │
│ Step 16/17: Editor/Draft │ editor & draft autosave.   │ Run/Submit actions in Layer 4.      │
├──────────────────────────┼────────────────────────────┼─────────────────────────────────────┤
│ Steps 10, 11, 12, 13, 14:│ These form a single atomic │ Group into an atomic Progress and   │
│ Solved, XP, Streak,      │ reactive cascade on        │ Reward Pipeline in Layer 2/3 with   │
│ Roadmap, Recommendation  │ ACCEPTED judge events.     │ isolated unit tests.                │
├──────────────────────────┼────────────────────────────┼─────────────────────────────────────┤
│ Step 15: Multi-Language  │ Adding languages at the    │ Build language-agnostic runner      │
│ vs                       │ end risks rewriting the    │ interface (`IExecutionProvider`)    │
│ Step 3: Abstraction      │ execution abstraction.     │ from Day 1; languages are plugins.  │
└──────────────────────────┴────────────────────────────┴─────────────────────────────────────┘
```

---

## 3. The Development Order (Directed Acyclic Graph — DAG)

The development order follows a strict bottom-up dependency flow where no component is constructed before its dependencies exist.

```text
LAYER 0: FOUNDATION & CONTRACTS
├── Step 1: Project Audit & Baseline Preservation
├── Step 2: Database Schema & Migration (001_phase3_execution_jobs.sql)
└── Step 3: Type Definitions & Execution Service Abstraction (IExecutionProvider)
       │
       ▼
LAYER 1: CORE EXECUTION ENGINES (HEADLESS & TESTABLE)
├── Step 2b: Test Case Repository (Public vs Hidden separation)
├── Step 4:  Isolated Sandbox Runners (Python 3.14 / Node.js with CPU/Memory/Output limits)
└── Step 8:  Deterministic Judge Engine (Stdout evaluation, hidden test masking)
       │
       ▼
LAYER 2: CLIENT STATE & DATA SERVICES
├── Step 16a: Code Editor Primitives (Tab indentation, font size, keybindings)
├── Step 17:  DraftService (Autosave, per-problem and per-language draft isolation)
├── Step 10-12: Progress & Reward Service (Atomic solve, XP ledger, calendar-locked streak)
├── Step 13:  Roadmap Progress Calculator (Exact % calculation)
└── Step 14:  RecommendationService (Deterministic 5-tier recommendation engine)
       │
       ▼
LAYER 3: API & ORCHESTRATION LAYER
├── Step 5:  POST /api/code/run (Public test debugging endpoint)
├── Step 7:  POST /api/code/submit & Execution Jobs (Queue state machine)
├── Step 18: SparkAIService (Sanitized context, zero hidden test exposure)
└── Step 3b: Circuit Breaker & Rate Limiting (3-failure threshold, 30s cooldown)
       │
       ▼
LAYER 4: WORKSPACE UI INTEGRATION
├── Step 6:  Results Panel UI (Test Cases, Console stdout/stderr, Status badges)
├── Step 9:  Submission History Tab & Code Viewer
├── Step 16b: Language Selector & Unsaved Changes Confirmation Modal
├── Step 21: UI Polish, Empty States, Accessible Buttons & Mobile Overflow Checks
└── Step 10b: "Problem Solved ⚡" Celebration Modal & Next Problem Action
       │
       ▼
LAYER 5: SYSTEM VERIFICATION & BENCHMARKING
├── Step 19: Comprehensive Security Sandbox Audit (8/8 attack vectors)
├── Step 20: Performance & Load Benchmark (50 concurrent requests)
└── Step 22: Complete End-to-End User Journey Tests (New user flow & Failed user flow)
```

---

## 4. The Release Order (Gated Rollout & Feature-Flag Promotion)

The release order governs how features are safely promoted to users in production. Features are deployed **dark** (hidden behind feature flags) and enabled in tranches after passing specific gates.

```text
TRANCHE 0: ZERO-RISK DARK DEPLOYMENT
├── Action: Deploy migrations, isolated runner scripts, and API routes.
├── Feature Flags:
│   ├── CODE_EXECUTION_ENABLED = false
│   ├── PYTHON_EXECUTION_ENABLED = false
│   ├── JS_EXECUTION_ENABLED = false
│   ├── SPARK_AI_ENABLED = false
│   └── CPP_EXECUTION_ENABLED = false, JAVA_EXECUTION_ENABLED = false
├── User Impact: Zero. Existing problem browsing, roadmap, and auth completely unaffected.
└── Gate 1: Database and API health checks pass 100%.

                                │
                                ▼
TRANCHE 1: SYNTHETIC TESTING & SECURITY AUDIT (INTERNAL STAGING)
├── Action: Enable execution internally for test runners and staging tokens.
├── Verification:
│   ├── Run `tests/execution/security-sandbox.test.mjs` (0 sandbox escapes).
│   ├── Run `tests/performance/concurrent-load.test.mjs` (50 reqs, >= 99% success).
│   └── Run `tests/execution/python-run.test.mjs` (8/8 pass).
└── Gate 2: Security & Performance pass rates = 100%.

                                │
                                ▼
TRANCHE 2: BETA RUN MODE (DEBUG ONLY)
├── Action: Enable `CODE_EXECUTION_ENABLED = true`, `PYTHON_EXECUTION_ENABLED = true`, `JS_EXECUTION_ENABLED = true`.
├── Scope: "▶ Run" button activated for public test cases. "Submit →" remains disabled or internal.
├── User Impact: Users can run and debug Python and JavaScript code safely against sample tests.
├── Safety: No user progress, XP, or streaks are modified during Run mode.
└── Gate 3: User run error rate < 1%, zero host process crashes.

                                │
                                ▼
TRANCHE 3: FULL SUBMISSION & PROGRESS (CORE RELEASE)
├── Action: Enable "Submit →" button, Authoritative Judging, and Progress/XP pipeline.
├── Scope: Full test suite (public + hidden) evaluated.
├── Rewards Activated:
│   ├── First solve marks problem 'solved'.
│   ├── Easy (+100 XP), Medium (+200 XP), Hard (+300 XP) credited to user.
│   ├── Streak advances max 1 day per calendar date.
│   └── Dynamic roadmap % updates.
├── Circuit Breaker: Active (trips on 3 consecutive failures; 30s cooldown fallback).
└── Gate 4: Zero false ACCEPTED results, zero lost submissions, 100% E2E test pass rate.

                                │
                                ▼
TRANCHE 4: SPARK AI ASSISTANCE
├── Action: Set `SPARK_AI_ENABLED = true`.
├── Scope: AI Coach panel, "Ask Spark AI" failure actions, and hint unlocking.
├── Safety: Sanitized public context only; zero hidden test cases or credentials leaked.
└── Gate 5: AI fallback grace checks pass 100%.

                                │
                                ▼
TRANCHE 5: ADDITIONAL LANGUAGE RUNTIMES
├── Action: Promote languages individually:
│   ├── Python 3: Live (Tranche 2)
│   ├── JavaScript: Live (Tranche 2)
│   ├── C++: Keep `CPP_EXECUTION_ENABLED = false` until native compiler sandbox passes Gate 5.
│   └── Java: Keep `JAVA_EXECUTION_ENABLED = false` until JVM sandbox passes Gate 5.
└── Rule: A language is NEVER enabled in production without its full compiler/runner passing Gate 5.
```

---

## 5. Development Order vs. Release Order Comparative Mapping

| Phase 3 Component | Development Layer (Build Order) | Release Tranche (Rollout Order) | Rationale |
|---|:---:|:---:|---|
| **Database Migrations** | Layer 0 | Tranche 0 | Must exist before any service writes execution jobs. |
| **Execution Abstraction** | Layer 0 | Tranche 0 | Normalized interface prevents UI from coupling to providers. |
| **Sandbox Isolation** | Layer 1 | Tranche 0 & 1 | Hard security boundaries must precede any untrusted code execution. |
| **Judge Engine** | Layer 1 | Tranche 0 & 1 | Deterministic judging must be unit-tested before API consumes it. |
| **DraftService** | Layer 2 | Tranche 0 & 2 | User code must be saved locally before running or submitting. |
| **Progress & XP Service**| Layer 2 | Tranche 3 | Backend rewards logic tested before enabling Submit button. |
| **Recommendation Engine**| Layer 2 | Tranche 3 | Recommendations react to solved problem events. |
| **Python Run API** | Layer 3 | Tranche 2 | Public run API exposed first for user debugging. |
| **Submit API & Jobs** | Layer 3 | Tranche 3 | Authoritative submit API exposed after run stability is proven. |
| **Circuit Breaker** | Layer 3 | Tranche 2 & 3 | Protects backend availability as soon as execution is enabled. |
| **Workspace Results UI** | Layer 4 | Tranche 2 & 3 | UI renders Run results (Tranche 2) and Submit verdicts (Tranche 3). |
| **Spark AI Hooks** | Layer 3/4 | Tranche 4 | AI assistance rolled out after core execution is validated. |
| **C++ / Java Runtimes** | Layer 1/3 | Tranche 5 | Additional languages released independently as compilers are provisioned. |

---

## 6. Verification & Invariant Checklist

* [x] **No Cyclical Dependencies**: Every dependency in the Development DAG points strictly downwards.
* [x] **No Premature Execution**: No user code is executed without sandbox isolation and environment sanitization.
* [x] **Independent Rollback**: Every release tranche can be rolled back via feature flag without impacting earlier tranches.
* [x] **Zero Regressions**: Core CodeSpark functionality (problem library, roadmap navigation, lessons) remains 100% operational in all tranches.
