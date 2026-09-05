import { spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { RunnerPayload, RunnerOutput } from '../src/services/execution/types';
import { TestCaseExecutionResult } from '../src/types/index';

/**
 * Strips server filesystem paths from error traces to protect internal infrastructure.
 */
function sanitizeErrorMessage(msg: string): string {
  if (!msg) return '';
  // Replace Windows paths like C:\Users\... with <sandbox>
  return msg.replace(/[a-zA-Z]:\\[^\n\r:'"]+/g, '<sandbox_script>')
            .replace(/\/tmp\/[^\n\r:'"]+/g, '<sandbox_script>')
            .replace(/\/[a-zA-Z0-9_\-\.\/]+sandbox[a-zA-Z0-9_\-\.]*/g, '<sandbox_script>');
}

/**
 * Deep equality comparison for outputs (handles arrays, nested objects, numbers, booleans)
 */
export function areOutputsEquivalent(actual: any, expected: any): boolean {
  if (actual === expected) return true;
  if (actual === null || expected === null) return actual === expected;
  if (typeof actual !== typeof expected) {
    // Check for string vs number or boolean
    if (typeof expected === 'boolean' && typeof actual === 'string') {
      return actual.toLowerCase() === (expected ? 'true' : 'false');
    }
    return false;
  }

  if (Array.isArray(actual) && Array.isArray(expected)) {
    if (actual.length !== expected.length) return false;
    for (let i = 0; i < actual.length; i++) {
      if (!areOutputsEquivalent(actual[i], expected[i])) return false;
    }
    return true;
  }

  if (typeof actual === 'object' && typeof expected === 'object') {
    const actKeys = Object.keys(actual).sort();
    const expKeys = Object.keys(expected).sort();
    if (actKeys.length !== expKeys.length) return false;
    for (let i = 0; i < actKeys.length; i++) {
      if (actKeys[i] !== expKeys[i]) return false;
      if (!areOutputsEquivalent(actual[actKeys[i]], expected[expKeys[i]])) return false;
    }
    return true;
  }

  return false;
}

function getPythonExecutable(): string {
  const localApp = process.env.LOCALAPPDATA || '';
  const direct314 = path.join(localApp, 'Programs', 'Python', 'Python314', 'python.exe');
  if (fs.existsSync(direct314)) return direct314;

  const direct312 = path.join(localApp, 'Programs', 'Python', 'Python312', 'python.exe');
  if (fs.existsSync(direct312)) return direct312;

  const direct311 = path.join(localApp, 'Programs', 'Python', 'Python311', 'python.exe');
  if (fs.existsSync(direct311)) return direct311;

  return 'python';
}

/**
 * Python Sandboxed Runner
 */
export async function runPythonIsolated(payload: RunnerPayload): Promise<RunnerOutput> {
  const timeoutMs = payload.timeLimitMs || 2500;
  const maxOutputBytes = 256 * 1024; // 256 KB limit
  const tempDir = os.tmpdir();
  const scriptName = `codespark_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.py`;
  const scriptPath = path.join(tempDir, scriptName);

  // Extract function name if possible
  const funcMatch = payload.code.match(/def\s+([a-zA-Z0-9_]+)\s*\(/);
  const targetFuncName = funcMatch ? funcMatch[1] : '';

  // Prepare harness python code
  const harnessCode = `
import json
import sys
import time
import tracemalloc
import builtins

# Security: Block networking and dangerous process execution
blocked_modules = {
    'socket', 'urllib', 'http', 'ftplib', 'smtplib', 
    'subprocess', 'pty', 'shutil', 'asyncio', 'multiprocessing',
    'winreg', 'ctypes'
}

orig_import = builtins.__import__
def safe_import(name, *args, **kwargs):
    base_module = name.split('.')[0]
    if base_module in blocked_modules:
        raise PermissionError(f"Importing '{name}' is prohibited in CodeSpark sandbox.")
    return orig_import(name, *args, **kwargs)
builtins.__import__ = safe_import

# Disallow arbitrary system command execution
try:
    import os
    if hasattr(os, 'system'): del os.system
    if hasattr(os, 'popen'): del os.popen
    if hasattr(os, 'spawn'): del os.spawn
    if hasattr(os, 'execv'): del os.execv
except:
    pass

# Execute user code in isolated namespace
user_namespace = {}
tracemalloc.start()
start_clock = time.perf_counter()

USER_CODE = ${JSON.stringify(payload.code)}
test_cases = json.loads('''${JSON.stringify(payload.testCases.map(tc => ({
  id: tc.id,
  input: tc.input,
  expected: tc.expectedOutput,
  is_public: tc.isPublic,
  position: tc.position
}))).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}''')

try:
    exec(USER_CODE, user_namespace)
    
    # Locate target function
    target_func = None
    target_name = ${JSON.stringify(targetFuncName)}
    if target_name and target_name in user_namespace and callable(user_namespace[target_name]):
        target_func = user_namespace[target_name]
    else:
        for k, v in user_namespace.items():
            if callable(v) and not k.startswith('__'):
                target_func = v
                break
                
    if not target_func:
        raise RuntimeError("No entry point function found in your code.")

    results = []
    all_passed = True
    
    for tc in test_cases:
        t0 = time.perf_counter()
        tc_input = tc["input"]
        if isinstance(tc_input, list):
            actual = target_func(*tc_input)
        else:
            actual = target_func(tc_input)
        t1 = time.perf_counter()
        
        # Compare output with expected
        expected = tc["expected"]
        passed = (actual == expected)
        if not passed:
            all_passed = False
            
        results.append({
            "testCaseId": tc["id"],
            "position": tc["position"],
            "isPublic": tc["is_public"],
            "passed": passed,
            "actualOutput": actual,
            "expectedOutput": expected,
            "input": tc["input"],
            "runtimeMs": round((t1 - t0) * 1000, 2)
        })

    total_time = round((time.perf_counter() - start_clock) * 1000, 2)
    _, peak_mem = tracemalloc.get_traced_memory()
    tracemalloc.stop()

    verdict = "ACCEPTED" if all_passed else "WRONG_ANSWER"
    output_obj = {
        "status": verdict,
        "runtimeMs": total_time,
        "memoryKb": round(peak_mem / 1024, 1),
        "testResults": results
    }
    print("__CODESPARK_RESULTS_START__")
    print(json.dumps(output_obj))
    print("__CODESPARK_RESULTS_END__")

except SyntaxError as se:
    total_time = round((time.perf_counter() - start_clock) * 1000, 2)
    output_obj = {
        "status": "COMPILATION_ERROR",
        "runtimeMs": total_time,
        "memoryKb": 0,
        "errorMessage": f"SyntaxError: {se.msg} (line {se.lineno})",
        "testResults": []
    }
    print("__CODESPARK_RESULTS_START__")
    print(json.dumps(output_obj))
    print("__CODESPARK_RESULTS_END__")

except Exception as e:
    total_time = round((time.perf_counter() - start_clock) * 1000, 2)
    output_obj = {
        "status": "RUNTIME_ERROR",
        "runtimeMs": total_time,
        "memoryKb": 0,
        "errorMessage": f"{type(e).__name__}: {str(e)}",
        "testResults": []
    }
    print("__CODESPARK_RESULTS_START__")
    print(json.dumps(output_obj))
    print("__CODESPARK_RESULTS_END__")
`;

  return new Promise<RunnerOutput>((resolve) => {
    try {
      fs.writeFileSync(scriptPath, harnessCode, 'utf-8');
    } catch (err: any) {
      resolve({
        status: 'SYSTEM_ERROR',
        runtimeMs: 0,
        memoryKb: 0,
        testResults: [],
        errorMessage: 'Failed to write temporary runner script'
      });
      return;
    }

    // Clean, isolated environment: strictly exclude database URLs, application secrets, API keys
    const cleanEnv: NodeJS.ProcessEnv = {
      PATH: process.env.PATH || '',
      SYSTEMROOT: process.env.SYSTEMROOT || '',
      LOCALAPPDATA: process.env.LOCALAPPDATA || '',
      USERPROFILE: process.env.USERPROFILE || '',
      APPDATA: process.env.APPDATA || '',
      TEMP: tempDir,
      TMP: tempDir,
      PYTHONIOENCODING: 'utf-8'
    };

    let stdout = '';
    let stderr = '';
    let timedOut = false;
    let outputLimitExceeded = false;

    const pythonCmd = getPythonExecutable();
    const child = spawn(pythonCmd, ['-u', scriptPath], {
      env: cleanEnv,
      stdio: ['pipe', 'pipe', 'pipe']
    });
    child.stdin.end();

    // Execution timeout guard
    const timer = setTimeout(() => {
      timedOut = true;
      try {
        child.kill('SIGKILL');
      } catch {
        // process might already have terminated
      }
    }, timeoutMs);

    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString();
      if (stdout.length > maxOutputBytes) {
        outputLimitExceeded = true;
        child.kill('SIGKILL');
      }
    });

    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
      if (stderr.length > maxOutputBytes) {
        outputLimitExceeded = true;
        child.kill('SIGKILL');
      }
    });

    child.on('close', (exitCode) => {
      clearTimeout(timer);
      try {
        fs.unlinkSync(scriptPath);
      } catch {
        // ignore cleanup error
      }

      if (timedOut) {
        resolve({
          status: 'TIME_LIMIT_EXCEEDED',
          runtimeMs: timeoutMs,
          memoryKb: 0,
          testResults: [],
          errorMessage: 'Execution timed out. Review your algorithm time complexity.'
        });
        return;
      }

      if (outputLimitExceeded) {
        resolve({
          status: 'OUTPUT_LIMIT_EXCEEDED',
          runtimeMs: 0,
          memoryKb: 0,
          testResults: [],
          errorMessage: 'Output limit exceeded (max 256 KB).'
        });
        return;
      }

      // Check for structured JSON output
      const startMarker = '__CODESPARK_RESULTS_START__';
      const endMarker = '__CODESPARK_RESULTS_END__';
      const startIndex = stdout.indexOf(startMarker);
      const endIndex = stdout.indexOf(endMarker);

      if (startIndex !== -1 && endIndex !== -1) {
        const jsonStr = stdout.substring(startIndex + startMarker.length, endIndex).trim();
        const userStdout = (stdout.substring(0, startIndex) + stdout.substring(endIndex + endMarker.length)).trim();
        try {
          const parsed = JSON.parse(jsonStr);
          resolve({
            status: parsed.status,
            runtimeMs: parsed.runtimeMs || 0,
            memoryKb: parsed.memoryKb || 0,
            testResults: parsed.testResults || [],
            errorMessage: parsed.errorMessage ? sanitizeErrorMessage(parsed.errorMessage) : undefined,
            stdout: userStdout.length > 0 ? userStdout.slice(0, 4000) : undefined,
            stderr: stderr.length > 0 ? sanitizeErrorMessage(stderr.slice(0, 4000)) : undefined
          });
          return;
        } catch {
          // JSON parsing failure fallback
        }
      }

      // If child exited abnormally
      if (exitCode !== 0) {
        const err = sanitizeErrorMessage(stderr || stdout);
        const isSyntax = err.includes('SyntaxError');
        resolve({
          status: isSyntax ? 'COMPILATION_ERROR' : 'RUNTIME_ERROR',
          runtimeMs: 0,
          memoryKb: 0,
          testResults: [],
          errorMessage: err.slice(0, 1000) || 'Program terminated with non-zero exit code.',
          stderr: err.slice(0, 4000)
        });
        return;
      }

      resolve({
        status: 'SYSTEM_ERROR',
        runtimeMs: 0,
        memoryKb: 0,
        testResults: [],
        errorMessage: 'Execution finished without standard result marker.',
        stdout: stdout.slice(0, 2000),
        stderr: stderr.slice(0, 2000)
      });
    });

    child.on('error', (err) => {
      clearTimeout(timer);
      try {
        fs.unlinkSync(scriptPath);
      } catch {
        // ignore
      }
      resolve({
        status: 'SYSTEM_ERROR',
        runtimeMs: 0,
        memoryKb: 0,
        testResults: [],
        errorMessage: `Failed to spawn Python runner: ${err.message}`
      });
    });
  });
}

/**
 * JavaScript Sandboxed Runner
 */
export async function runJavaScriptIsolated(payload: RunnerPayload): Promise<RunnerOutput> {
  const timeoutMs = payload.timeLimitMs || 2000;
  const maxOutputBytes = 256 * 1024;
  const tempDir = os.tmpdir();
  const scriptName = `codespark_js_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.js`;
  const scriptPath = path.join(tempDir, scriptName);

  // Extract function name if possible
  const funcMatch = payload.code.match(/function\s+([a-zA-Z0-9_]+)\s*\(/) ||
                    payload.code.match(/(?:const|let|var)\s+([a-zA-Z0-9_]+)\s*=/);
  const targetFuncName = funcMatch ? funcMatch[1] : '';

  const harnessCode = `
const { performance } = require('perf_hooks');

function areOutputsEquivalent(actual, expected) {
  if (actual === expected) return true;
  if (actual === null || expected === null || actual === undefined || expected === undefined) return actual === expected;
  if (typeof actual !== typeof expected) return false;
  if (Array.isArray(actual) && Array.isArray(expected)) {
    if (actual.length !== expected.length) return false;
    for (let i = 0; i < actual.length; i++) {
      if (!areOutputsEquivalent(actual[i], expected[i])) return false;
    }
    return true;
  }
  if (typeof actual === 'object' && typeof expected === 'object') {
    const actKeys = Object.keys(actual).sort();
    const expKeys = Object.keys(expected).sort();
    if (actKeys.length !== expKeys.length) return false;
    for (let i = 0; i < actKeys.length; i++) {
      if (actKeys[i] !== expKeys[i]) return false;
      if (!areOutputsEquivalent(actual[actKeys[i]], expected[expKeys[i]])) return false;
    }
    return true;
  }
  return false;
}

const testCases = ${JSON.stringify(payload.testCases.map(tc => ({
  id: tc.id,
  input: tc.input,
  expected: tc.expectedOutput,
  is_public: tc.isPublic,
  position: tc.position
})))};

const tStart = performance.now();
const memStart = process.memoryUsage().heapUsed;

try {
  // Wrap user code in a function context
  const userModule = {};
  const userFn = new Function('module', 'exports', \`
    \${${JSON.stringify(payload.code)}};
    return typeof ${targetFuncName || 'null'} === 'function' ? ${targetFuncName || 'null'} : (typeof solution === 'function' ? solution : null);
  \`);

  const targetFunc = userFn(userModule, userModule.exports);
  if (!targetFunc && typeof targetFunc !== 'function') {
    throw new Error("No callable entry point function found in code.");
  }

  const results = [];
  let allPassed = true;

  for (const tc of testCases) {
    const c0 = performance.now();
    let actual;
    if (Array.isArray(tc.input)) {
      actual = targetFunc(...tc.input);
    } else {
      actual = targetFunc(tc.input);
    }
    const c1 = performance.now();
    const passed = areOutputsEquivalent(actual, tc.expected);
    if (!passed) allPassed = false;

    results.push({
      testCaseId: tc.id,
      position: tc.position,
      isPublic: tc.is_public,
      passed: passed,
      actualOutput: actual,
      expectedOutput: tc.expected,
      input: tc.input,
      runtimeMs: Math.round((c1 - c0) * 100) / 100
    });
  }

  const tTotal = Math.round((performance.now() - tStart) * 100) / 100;
  const memUsed = Math.round(Math.max(0, process.memoryUsage().heapUsed - memStart) / 1024);

  const outputObj = {
    status: allPassed ? "ACCEPTED" : "WRONG_ANSWER",
    runtimeMs: tTotal,
    memoryKb: Math.max(memUsed, 1024),
    testResults: results
  };

  console.log("__CODESPARK_RESULTS_START__");
  console.log(JSON.stringify(outputObj));
  console.log("__CODESPARK_RESULTS_END__");
} catch (err) {
  const tTotal = Math.round((performance.now() - tStart) * 100) / 100;
  const outputObj = {
    status: err.name === 'SyntaxError' ? "COMPILATION_ERROR" : "RUNTIME_ERROR",
    runtimeMs: tTotal,
    memoryKb: 0,
    errorMessage: err.name + ': ' + err.message,
    testResults: []
  };
  console.log("__CODESPARK_RESULTS_START__");
  console.log(JSON.stringify(outputObj));
  console.log("__CODESPARK_RESULTS_END__");
}
`;

  return new Promise<RunnerOutput>((resolve) => {
    try {
      fs.writeFileSync(scriptPath, harnessCode, 'utf-8');
    } catch {
      resolve({
        status: 'SYSTEM_ERROR',
        runtimeMs: 0,
        memoryKb: 0,
        testResults: [],
        errorMessage: 'Failed to write JS script'
      });
      return;
    }

    const cleanEnv: NodeJS.ProcessEnv = {
      PATH: process.env.PATH || '',
      SYSTEMROOT: process.env.SYSTEMROOT || '',
      TEMP: tempDir,
      TMP: tempDir
    };

    let stdout = '';
    let stderr = '';
    let timedOut = false;
    let outputLimitExceeded = false;

    const child = spawn('node', [scriptPath], {
      env: cleanEnv,
      stdio: ['pipe', 'pipe', 'pipe']
    });

    const timer = setTimeout(() => {
      timedOut = true;
      try { child.kill('SIGKILL'); } catch {}
    }, timeoutMs);

    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString();
      if (stdout.length > maxOutputBytes) {
        outputLimitExceeded = true;
        child.kill('SIGKILL');
      }
    });

    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
      if (stderr.length > maxOutputBytes) {
        outputLimitExceeded = true;
        child.kill('SIGKILL');
      }
    });

    child.on('close', (exitCode) => {
      clearTimeout(timer);
      try { fs.unlinkSync(scriptPath); } catch {}

      if (timedOut) {
        resolve({
          status: 'TIME_LIMIT_EXCEEDED',
          runtimeMs: timeoutMs,
          memoryKb: 0,
          testResults: [],
          errorMessage: 'Time limit exceeded.'
        });
        return;
      }

      if (outputLimitExceeded) {
        resolve({
          status: 'OUTPUT_LIMIT_EXCEEDED',
          runtimeMs: 0,
          memoryKb: 0,
          testResults: [],
          errorMessage: 'Output limit exceeded (max 256 KB).'
        });
        return;
      }

      const startMarker = '__CODESPARK_RESULTS_START__';
      const endMarker = '__CODESPARK_RESULTS_END__';
      const sIdx = stdout.indexOf(startMarker);
      const eIdx = stdout.indexOf(endMarker);

      if (sIdx !== -1 && eIdx !== -1) {
        const jsonStr = stdout.substring(sIdx + startMarker.length, eIdx).trim();
        const userStdout = (stdout.substring(0, sIdx) + stdout.substring(eIdx + endMarker.length)).trim();
        try {
          const parsed = JSON.parse(jsonStr);
          resolve({
            status: parsed.status,
            runtimeMs: parsed.runtimeMs || 0,
            memoryKb: parsed.memoryKb || 0,
            testResults: parsed.testResults || [],
            errorMessage: parsed.errorMessage ? sanitizeErrorMessage(parsed.errorMessage) : undefined,
            stdout: userStdout.length > 0 ? userStdout.slice(0, 4000) : undefined,
            stderr: stderr.length > 0 ? sanitizeErrorMessage(stderr.slice(0, 4000)) : undefined
          });
          return;
        } catch {}
      }

      resolve({
        status: exitCode === 0 ? 'ACCEPTED' : 'RUNTIME_ERROR',
        runtimeMs: 0,
        memoryKb: 0,
        testResults: [],
        errorMessage: sanitizeErrorMessage(stderr || stdout).slice(0, 1000)
      });
    });

    child.on('error', (err) => {
      clearTimeout(timer);
      try { fs.unlinkSync(scriptPath); } catch {}
      resolve({
        status: 'SYSTEM_ERROR',
        runtimeMs: 0,
        memoryKb: 0,
        testResults: [],
        errorMessage: `Failed to spawn Node runner: ${err.message}`
      });
    });
  });
}
