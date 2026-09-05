# CodeSpark ⚡ — Phase 3 Project Architecture Audit

**Document**: `docs/phase-3-audit.md`  
**Date**: September 6, 2026  
**Scope**: CodeSpark Codebase Audit & Infrastructure Mapping

---

## 1. Executive Summary

This audit assesses the active architecture of **CodeSpark** to ensure Phase 3 (Real Code Execution, Judging, Progress, and Resilience) integrates without replacing existing working authentication, corrupting database records, or causing duplicate infrastructure.

---

## 2. Technology Stack & Infrastructure

| Layer | Technology | Details |
|---|---|---|
| **Frontend Framework** | React 19 (`react: ^19.0.0`, `react-dom: ^19.0.0`) | TypeScript, Vite 8 (`vite: ^8.2.2`), TailwindCSS 4 (`@tailwindcss/vite`). |
| **Runtime** | Node.js v22+ (Serverless API / Dev Server) + Python 3.14.7 (Host Runner) | Dual runtime execution architecture for frontend dev server and sandboxed execution. |
| **Authentication Provider** | Web Crypto SHA-256 + LocalStorage Session | Managed in `src/services/storage.ts` and `src/data/mockUsers.ts`. User passwords hashed with SHA-256 via `crypto.subtle`. Active session in `codespark_current_user`. **Must NOT be replaced.** |
| **Database Provider** | Supabase PostgreSQL Client (`@supabase/supabase-js`) + LocalStorage Cache/Fallback | Hybrid architecture: reads/writes to Supabase when credentials exist (`VITE_SUPABASE_URL`), with seamless LocalStorage fallback ensuring 100% offline availability. |
| **Existing Database Schema** | PostgreSQL (`schema.sql`) | Tables: `users`, `problems`, `topics`, `patterns`, `roadmaps`, `roadmap_sections`, `user_problem_progress`, `saved_problems`, `submissions`, `submission_drafts`, `problem_starter_code`, `problem_test_cases`. |
| **Existing Editor** | Standard CodeEditor with Tab Indentation | Located in `src/components/workspace/ProblemWorkspace.tsx`. Supports tab key handling, font size adjustments (12–18px), syntax formatting, and reset to starter code. |
| **Existing Submission Architecture** | `src/services/codeRunner.ts` & `src/services/execution/executionService.ts` | Dispatches execution requests to `/api/code/run` and `/api/code/submit`. Tracks execution jobs (`codespark_execution_jobs`). |
| **Existing API Architecture** | Dual-Target: Vite Dev Middleware (`server/apiController.ts`) & Vercel Serverless Functions (`api/code/run.ts`, `api/code/submit.ts`) | Unified API contract for local development and cloud production. |
| **Deployment Architecture** | Vercel Serverless + GitHub CI/CD | Live URL: `https://codelumen-delta.vercel.app`. Auto-deploys from GitHub `main` branch. |
| **Execution Provider** | Isolated Subprocess Sandbox Runner (`server/isolatedRunner.ts`) | Spawns dedicated child processes (`python.exe` / `node.exe`) with CPU timeouts (2.5s), memory bounds (256 MB), output limits (256 KB), and sanitized environment. |

---

## 3. Required Environment Variables

The following environment variables are utilized by CodeSpark:
* `VITE_SUPABASE_URL`: Supabase project URL (optional in local offline mode).
* `VITE_SUPABASE_ANON_KEY`: Supabase anonymous API key.
* `PORT`: Development server port (defaults to `5173`).

> [!IMPORTANT]
> **Environment Sanitization**: None of these variables are ever forwarded or exposed to the user code execution sandbox. The isolated runner strips all `VITE_*` and application secrets.

---

## 4. Components & Files to Modify

* `src/components/workspace/ProblemWorkspace.tsx`: Upgraded with test case results tabs, console output, submission history code viewer, and feature flag notices.
* `src/services/storage.ts`: Extended with additive execution job methods (`saveExecutionJob`, `getExecutionJobs`), date-locked streak updates, and duplicate XP prevention.
* `src/services/execution/executionService.ts`: Added rate limiting, code size checks, circuit breaker, and normalized responses.
* `vite.config.ts`: Configured with API route dev middleware to mirror Vercel serverless behavior.

---

## 5. Components to Preserve (Zero Mutation)

* `src/components/auth/*`: All authentication forms (`AuthModal.tsx`, `LoginForm.tsx`, `SignupForm.tsx`).
* `src/components/common/*`: Navbar, Footer, badges, branding.
* `src/data/*`: `problemsPart1.ts`, `problemsPart2.ts`, `problemsPart3.ts`, `topics.ts`, `patterns.ts`, `roadmaps.ts`.
* `src/types/index.ts`: Existing core interfaces preserved and extended additively.

---

## 6. Audit Acceptance Verification

* [x] 100% of authentication flow identified.
* [x] 100% of database tables used by Phase 2 identified.
* [x] 100% of existing submission-related routes identified.
* [x] 100% of execution-related infrastructure identified.
* [x] 0 authentication providers replaced.
* [x] 0 existing production data records deleted.
