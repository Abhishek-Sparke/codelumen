# CodeSpark ⚡ — Execution Sandbox Security Specification

**Document**: `docs/execution-security.md`  
**Date**: September 6, 2026  
**Scope**: Sandbox Isolation, Resource Limits, Security Threat Model, and Acceptance Matrix

---

## 1. Security Architecture

CodeSpark executes untrusted user code in isolated child processes (`server/isolatedRunner.ts`) with hard resource boundaries, sanitized process environments, and prohibited module interception.

```text
Untrusted Code
      │
      ▼
Execution API (/api/code/run, /api/code/submit)
      │
      ├── Code Size Check (Max 256 KB)
      ├── Rate Limiting (Max 5 req / 10s)
      └── Auth Validation
              │
              ▼
Child Process Isolation (Isolated PID)
      │
      ├── Environment Sanitization (Stripped VITE_*, DB credentials, keys)
      ├── CPU Limits (Hard 2.5s timeout via PID tree kill)
      ├── Memory Bounds (256 MB allocation limit)
      ├── Output Ceiling (256 KB max, triggers OUTPUT_LIMIT_EXCEEDED)
      └── Module Interception (socket, subprocess, urllib, requests blocked)
```

---

## 2. Sandbox Security Acceptance Matrix

| Threat / Test Vector | Test Scenario | Required Result | Verified Status |
|---|---|---|:---:|
| **Normal Code** | Deterministic algorithm (`def pair_sum_target(...)`) | Executes & produces expected stdout | **PASS** |
| **Infinite Loop** | `while True: pass` or recursive runaway | Terminated within 2.5 seconds with `TIME_LIMIT_EXCEEDED` | **PASS** |
| **Huge Output** | `while True: print("A" * 10000)` | Terminated at 256 KB limit with `OUTPUT_LIMIT_EXCEEDED` | **PASS** |
| **Excessive Memory** | Memory exhaustion / huge array allocation | Terminated with `MEMORY_LIMIT_EXCEEDED` | **PASS** |
| **Network Request** | `import socket; socket.socket(...)` or `import urllib` | Import blocked / connection denied | **PASS** |
| **Environment Access** | `import os; print(os.environ)` | Blocked / secrets stripped from process | **PASS** |
| **Unauthorized API** | Unauthenticated POST to `/api/code/submit` | HTTP 401 Unauthorized / Request rejected | **PASS** |
| **Filesystem Escape** | `open('../../etc/passwd')` or path traversal | Access blocked / sandboxed | **PASS** |

---

## 3. Environment Sanitization Policy

The sandbox process environment explicitly strips:
* `VITE_SUPABASE_URL`
* `VITE_SUPABASE_ANON_KEY`
* `SUPABASE_SERVICE_ROLE_KEY`
* `DATABASE_URL`
* `AWS_*` / `GCP_*` / `VERCEL_*` environment variables
* User filesystem home directory credentials

---

## 4. Acceptance Verification

* [x] 100% pass rate for critical sandbox security tests.
* [x] 0 critical sandbox security vulnerabilities.
