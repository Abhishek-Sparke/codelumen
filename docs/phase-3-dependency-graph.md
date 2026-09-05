# CodeSpark ⚡ — Phase 3 Corrected Dependency Graph

**Document**: `docs/phase-3-dependency-graph.md`  
**Date**: September 6, 2026  
**Status**: Authoritative & Approved  
**Scope**: Explicit Separation of Development Order, Integration Order, Security Order, and Release Order

---

# 1. DEFINITIONS

## DEVELOPMENT ORDER
The order in which engineering work should be implemented.
A feature may be developed before its runtime dependency is completely finished by using:
* interfaces
* mocks
* fixtures
* test doubles
* feature flags

**Development order is therefore optimized for engineering efficiency.**

---

## INTEGRATION ORDER
The order in which components are connected to the real production-like system.
**Integration must respect actual technical dependencies.**

---

## RELEASE ORDER
The order in which functionality is enabled for real users.
Release order must prioritize:
1. Safety
2. Data integrity
3. Reliability
4. User experience

**A feature can be completely developed but remain disabled in production.**

---

# 2. RESOLVED ARCHITECTURE

```text
┌─────────────────────────────┐
│       CODESPARK UI          │
│ Problem / Editor / Results  │
└──────────────┬──────────────┘
               │
               ↓
┌─────────────────────────────┐
│       APPLICATION API       │
│ Run / Submit / Progress     │
└──────────────┬──────────────┘
               │
       ┌───────┴────────┐
       ↓                ↓
┌──────────────┐ ┌───────────────┐
│ EXECUTION    │ │ APPLICATION   │
│ SERVICE      │ │ SERVICES      │
└──────┬───────┘ └───────┬───────┘
       │                  │
       ↓                  ↓
┌──────────────┐   ┌──────────────┐
│ SANDBOX      │   │ DATABASE     │
│ PROVIDERS    │   │              │
└──────────────┘   └──────────────┘
       │
       ↓
┌─────────────────────────────┐
│ Language Runtimes           │
│ Python / C++ / Java / JS    │
└─────────────────────────────┘
```

### Key Architectural Corrections:
* **The editor does NOT depend on the execution provider.**
* **Draft autosave does NOT depend on the judge.**
* **Submission history does NOT need to wait for the recommendation system.**
* **Security testing is both continuous and a final release gate.**

---

# 3. AUTHORITATIVE HARD DEPENDENCIES

Only these relationships are treated as **HARD dependencies**:

* **Authentication**: Required by Private submissions, Private drafts, User progress, XP, Streak, Saved problems.
* **Database**: Required by Submission persistence, Progress persistence, XP transactions, Streak/activity, Draft persistence.
* **Execution Service**: Required by Run, Submit, Judge.
* **Sandbox**: Required by Actual code execution.
* **Language Runtime**: Required by Execution of that language (e.g. Python runtime → Python execution; C++ runtime is NOT required to develop Python).
* **Judge**: Required by Official submission result (`ACCEPTED`, `WRONG_ANSWER`, `TIME_LIMIT_EXCEEDED`, `MEMORY_LIMIT_EXCEEDED`, `RUNTIME_ERROR`, `COMPILATION_ERROR`).
* **Accepted Result**: Required by First solve event.
* **Solve Event**: Required by First-solve XP and Roadmap solved count.
* **Solved/Activity Data**: Required by Roadmap Progress and Personalized Recommendation.

---

# 4. FEATURES THAT CAN BE DEVELOPED IN PARALLEL

The following do **NOT** need to wait for code execution and may be developed using mocks/test fixtures:
* **Editor**: Independently developed (`Editor → Code State`). Does not require execution provider.
* **Draft Autosave**: Independently developed after auth + DB (`Editor → Draft Service → Database`). Does not depend on Judge.
* **Submission History UI**: Developed using mock submission records.
* **Results UI**: Developed using mocked execution results.
* **XP UI**: Developed using fixture data.
* **Streak UI**: Developed using fixture activity dates.
* **Roadmap UI**: Developed independently; progress integration requires solved data.
* **Spark AI UI**: Developed independently using mock responses; production integration requires authenticated context.

---

# 5. CORRECTED DEVELOPMENT ORDER (D0 – D10)

* **D0 — DISCOVERY**: Audit existing application, auth, database, execution infra, editor, deployment.  
  *Outputs*: `docs/phase-3-audit.md`, `docs/phase-3-change-plan.md`. *Dependency*: None.
* **D1 — CONTRACTS & DATA**: Database schema changes, execution request/response types, submission types, judge types, progress types, XP types, draft types.  
  *Outputs*: Domain types, migrations, API contracts, interfaces. *Dependency*: D0.
* **D2 — FRONTEND FOUNDATION**: Develop in parallel: Editor, Results Panel, Submission History, Progress UI, XP UI, Streak UI, Roadmap UI, Draft UI using mocked data.  
  *Dependency*: D1.
* **D3 — EXECUTION FOUNDATION**: `ExecutionService`, provider adapter, sandbox, Python runtime, limits (CPU, memory, output), network isolation, health checks.  
  *Dependency*: D1. **Security testing starts immediately here.**
* **D4 — PYTHON RUN**: Integrate Editor → Run API → `ExecutionService` → Python Sandbox → Public Tests → Results UI.  
  *Dependency*: D2 + D3.
* **D5 — SUBMISSION & JUDGING**: Submission API, persistence, execution jobs, queue, judge, hidden tests, terminal result, history integration.  
  *Dependency*: D3.
* **D6 — USER PROGRESS**: `Accepted → Solve Event (XP, Activity/Streak, Solved Problem)`.  
  *Dependency*: D5.
* **D7 — LEARNING SYSTEM**: Roadmap progress, next-problem recommendation, topic progression, pattern progression.  
  *Dependency*: D6. Consumes real progress data.
* **D8 — ADDITIONAL LANGUAGES**: Develop each language independently (C++, Java, JavaScript). Each gets: runtime, sandbox, execution adapter, test fixtures, judge integration, security tests.  
  *Dependency*: D3. Does NOT wait for roadmap/recommendation.
* **D9 — SPARK AI**: AI service abstraction, context builder, hints, error explanation, complexity analysis.  
  *Dependency*: D1 for abstraction; D6 for production context. Does NOT block core coding.
* **D10 — HARDENING**: Security testing, load testing (50 reqs), failure testing, recovery testing, data-integrity testing, E2E testing.  
  *Dependency*: All production-target functionality implemented.

---

# 6. INTEGRATION ORDER

Components connect to the real system in this strict technical order:

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

# 7. SECURITY ORDER

Security is continuous across three distinct layers:
* **S1 — BEFORE EXECUTION**: Test sandbox configuration, network isolation, filesystem isolation, resource limits, and environment variable isolation before running untrusted code.
* **S2 — DURING DEVELOPMENT**: For every new language: `Implement → Sandbox test → Attack tests → Resource tests → Only then integrate`.
* **S3 — FINAL RELEASE AUDIT**: Comprehensive end-to-end audit testing authentication, authorization, execution, database, APIs, user data, secrets, AI context, and rate limits.

---

# 8. RELEASE ORDER (R0 – R10)

```text
R0: EXISTING APPLICATION ──────────► Baseline operational, zero new execution enabled.
        ↓
R1: FOUNDATION ────────────────────► Database migrations, execution service infra, flags, logging, health checks (invisible to users).
        ↓
R2: PYTHON RUN ────────────────────► Enable "Run Python" only on public test cases. (Gate: 100% sandbox/execution tests pass, 0 false Accepted).
        ↓
R3: PYTHON SUBMIT ─────────────────► Enable "Submit" with hidden tests and real judging. (Gate: judge reliability, persistence, 0 lost submissions).
        ↓
R4: PROGRESS ──────────────────────► Enable Solved status, XP, Streak, Roadmap progress. (Gate: 100% data-integrity tests pass).
        ↓
R5: RECOMMENDATIONS ───────────────► Enable "What's Next?" recommendation engine. (Gate: uses real user progress).
        ↓
R6: ADDITIONAL LANGUAGES ──────────► Release independently (C++ → Java → JavaScript) via individual feature flags (CPP_EXECUTION_ENABLED, etc.).
        ↓
R7: DRAFT & EDITOR ENHANCEMENTS ───► Enable advanced editor, autosave, restoration.
        ↓
R8: SPARK AI ──────────────────────► Enable Hints, error explanation, complexity analysis. (Gate: privacy & context security tests pass).
        ↓
R9: FULL HARDENING ────────────────► Security audit, performance benchmark, failure recovery, E2E tests.
        ↓
R10: GENERAL AVAILABILITY ─────────► 100% production rollout.
```

---

# 9. IMPORTANT RELEASE INDEPENDENCE RULE

A feature being incomplete must **NOT** automatically block unrelated functionality:
* **If C++ fails**: `CPP_EXECUTION_ENABLED = false`, `PYTHON_EXECUTION_ENABLED = true`.
* **If Spark AI fails**: `SPARK_AI_ENABLED = false`, coding platform remains active.
* **If Recommendations fail**: Recommendations fallback or disable; Roadmap remains active.
* **If Draft Autosave fails**: Local in-memory state preserved; Editor remains active.
* **If Execution Provider fails**: `CODE_EXECUTION_ENABLED = false`; Problem browsing, roadmap, lessons, and reading remain active.

---

# 10. DEVELOPMENT vs RELEASE MATRIX

| Feature | Development Dependency | Integration Dependency | Release Dependency |
|---|---|---|---|
| **Editor** | D1 | Problem page | Existing app |
| **Drafts** | Auth + DB | Editor + DB | Auth/data tests |
| **Results UI** | API contract | Run API | Python Run |
| **Execution Service** | Contracts | Sandbox | Security |
| **Python** | Execution Service | Sandbox | Sandbox + execution tests |
| **Submission** | Execution + DB | Judge | Judge |
| **Judge** | Execution + tests | Submission | Security + correctness |
| **History** | DB schema | Submission | Authorization |
| **Solved** | Judge | Accepted event | Data integrity |
| **XP** | Solve event | Solved | Transaction tests |
| **Streak** | Activity event | Solve/activity | Date tests |
| **Roadmap** | Solved data | Progress service | Accuracy tests |
| **Recommendations** | Roadmap/progress | Progress service | Recommendation tests |
| **C++** | Execution abstraction | C++ sandbox | C++ security tests |
| **Java** | Execution abstraction | Java sandbox | Java security tests |
| **JavaScript** | Execution abstraction | JS sandbox | JS security tests |
| **Spark AI** | AI abstraction | Auth + context | Privacy/security |
| **Security** | Can begin immediately | All systems | Final gate |
| **Performance** | Can begin with prototypes | Full pipeline | Final gate |

---

# 11. FINAL CORRECTED DEPENDENCY GRAPH

```text
                    ┌──────────────┐
                    │ PROJECT AUDIT│
                    └──────┬───────┘
                           ↓
                    ┌──────────────┐
                    │   CONTRACTS  │
                    │ + DATA MODEL │
                    └──────┬───────┘
                           │
          ┌────────────────┼─────────────────┐
          ↓                ↓                 ↓
       EDITOR          DRAFTS          EXECUTION SERVICE
          │                │                 │
          │                │                 ↓
          │                │              SANDBOX
          │                │                 │
          │                │          ┌──────┴──────┐
          │                │          ↓             ↓
          │                │       PYTHON        OTHER LANGUAGES
          │                │          │             │
          └────────────────┼──────────┘             │
                           ↓                        │
                         RUN                       │
                           ↓                        │
                    RESULTS UI                     │
                           │                        │
                           ↓                        │
                      SUBMISSION                   │
                           ↓                        │
                         JUDGE ←────────────────────┘
                           │
                           ↓
                     ACCEPTED EVENT
                           │
                ┌──────────┼──────────┐
                ↓          ↓          ↓
             SOLVED       XP       ACTIVITY
                │                     │
                └──────────┬──────────┘
                           ↓
                    ROADMAP PROGRESS
                           │
                           ↓
                    RECOMMENDATIONS

        AUTHENTICATION ───────→ all user-owned data

        SPARK AI
             ↑
      Auth + Problem + Code
             +
       Execution Context

        SECURITY
             ↕
      continuous throughout
             +
        final release gate

        PERFORMANCE
             ↕
      continuous testing
             +
        final release gate
```

---

# 12. FINAL RULES

1. **Development does not equal release**: A feature may be fully coded but remain disabled.
2. **Mocking is allowed during development**: Frontend work does not need to wait for backend completion if a stable contract exists.
3. **Production integration cannot use mocks**: All production execution, judging, progress, XP, and recommendations must use real data/services.
4. **Hard dependencies must never be bypassed**: Never connect `Run → Solved` or `Submission Created → XP`. Strictly enforce `Submission → Execute → Judge → ACCEPTED → Solve Event → XP`.
5. **Security is continuous**: Do not wait until the end to test sandbox security.
6. **Release independently wherever possible**: One failed feature must not disable unrelated features.
7. **Python is the reference implementation**: Prove the complete execution/judging architecture with Python first, then reuse the same architecture for C++, Java, JavaScript.
8. **Existing CodeSpark functionality has priority**: Never break authentication, existing user accounts, progress, problems, roadmaps, UI, or deployment.

---

### Final Lifecycle Model

```text
DISCOVER → DESIGN CONTRACTS → DEVELOP IN PARALLEL → INTEGRATE BY HARD DEPENDENCIES → TEST CONTINUOUSLY → FEATURE-FLAG → STAGED RELEASE → MEASURE → EXPAND ROLLOUT → GENERAL AVAILABILITY
```

* **Development order optimizes engineering speed.**
* **Integration order respects technical dependencies.**
* **Release order protects users and production stability.**
