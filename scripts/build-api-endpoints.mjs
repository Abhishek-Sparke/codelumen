import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { PROBLEM_TEST_CASES_REGISTRY } from '../src/data/problemTestCasesRegistry';

console.log('Loaded test cases registry with keys:', Object.keys(PROBLEM_TEST_CASES_REGISTRY).length);

// Build run test cases map (public only) and submit test cases map (public + hidden)
const runMap = {};
const submitMap = {};

for (const [key, entry] of Object.entries(PROBLEM_TEST_CASES_REGISTRY)) {
  runMap[key] = entry.publicCases.map((tc, idx) => ({
    id: `tc-pub-${entry.id}-${idx + 1}`,
    position: idx + 1,
    isPublic: true,
    input: tc.input,
    expectedOutput: tc.expected
  }));

  const allSubmit = [];
  let pos = 1;
  entry.publicCases.forEach((tc, idx) => {
    allSubmit.push({
      id: `tc-pub-${entry.id}-${idx + 1}`,
      position: pos++,
      isPublic: true,
      input: tc.input,
      expectedOutput: tc.expected
    });
  });
  entry.hiddenCases.forEach((tc, idx) => {
    allSubmit.push({
      id: `tc-hid-${entry.id}-${idx + 1}`,
      position: pos++,
      isPublic: false,
      input: tc.input,
      expectedOutput: tc.expected
    });
  });
  submitMap[key] = allSubmit;
}

const sharedHeader = `import type { VercelRequest, VercelResponse } from '@vercel/node';

interface RunnerTestCase {
  id: string;
  input: any[];
  expectedOutput: any;
  isPublic: boolean;
  position: number;
}

interface TestCaseResult {
  testCaseId: string;
  position: number;
  isPublic: boolean;
  passed: boolean;
  actualOutput?: any;
  expectedOutput?: any;
  input?: any[];
  runtimeMs: number;
  memoryKb?: number;
  errorMessage?: string;
}

function __py_eq(a: any, b: any): boolean {
  if (a === b) return true;
  if (a == null || b == null) return a === b;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!__py_eq(a[i], b[i])) return false;
    }
    return true;
  }
  if (a instanceof Set && b instanceof Set) {
    if (a.size !== b.size) return false;
    for (const item of a) {
      if (!b.has(item)) return false;
    }
    return true;
  }
  if (typeof a === 'object' && typeof b === 'object') {
    const kA = Object.keys(a).filter(k => a[k] !== undefined);
    const kB = Object.keys(b).filter(k => b[k] !== undefined);
    if (kA.length !== kB.length) return false;
    for (const k of kA) {
      if (!__py_eq(a[k], b[k])) return false;
    }
    return true;
  }
  return false;
}

function areOutputsEquivalent(actual: any, expected: any): boolean {
  if (actual === expected) return true;
  if (actual === null || expected === null || actual === undefined || expected === undefined) {
    return actual === expected;
  }
  if (typeof expected === 'boolean') {
    if (typeof actual === 'boolean') return actual === expected;
    if (typeof actual === 'string') return actual.toLowerCase() === (expected ? 'true' : 'false');
    if (typeof actual === 'number') return (actual !== 0) === expected;
  }
  if (typeof actual === 'boolean') {
    if (typeof expected === 'string') return expected.toLowerCase() === (actual ? 'true' : 'false');
    if (typeof expected === 'number') return (expected !== 0) === actual;
  }
  if (typeof actual === 'string' && (actual === 'True' || actual === 'False')) {
    const actBool = actual === 'True';
    if (typeof expected === 'boolean') return actBool === expected;
    if (typeof expected === 'string') return actBool === (expected.toLowerCase() === 'true');
  }
  if (typeof actual === 'number' && typeof expected === 'number') {
    return Math.abs(actual - expected) < 1e-6;
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

function __py_in(item: any, col: any): boolean {
  if (col == null) return false;
  if (typeof col.has === 'function') return col.has(item);
  if (Array.isArray(col) || typeof col === 'string') return col.indexOf(item) !== -1;
  return item in col;
}

function __py_get(obj: any, key: any, defaultVal: any = null): any {
  if (obj == null) return defaultVal;
  if (typeof obj.get === 'function') {
    const val = obj.get(key);
    return val !== undefined ? val : defaultVal;
  }
  if (key in obj && obj[key] !== undefined) {
    return obj[key];
  }
  return defaultVal;
}

function __py_values(obj: any): any[] {
  if (obj == null) return [];
  if (typeof obj.values === 'function') return Array.from(obj.values());
  return Object.values(obj);
}

function __py_keys(obj: any): any[] {
  if (obj == null) return [];
  if (typeof obj.keys === 'function') return Array.from(obj.keys());
  return Object.keys(obj);
}

function __py_items(obj: any): any[] {
  if (obj == null) return [];
  if (typeof obj.entries === 'function') return Array.from(obj.entries());
  return Object.entries(obj);
}

function __py_count(seq: any, val: any): number {
  if (typeof seq === 'string') {
    let cnt = 0, pos = 0;
    while ((pos = seq.indexOf(val, pos)) !== -1) {
      cnt++;
      pos += (val.length || 1);
    }
    return cnt;
  }
  if (Array.isArray(seq)) {
    return seq.filter(x => __py_eq(x, val)).length;
  }
  return 0;
}

function __py_len(x: any): number {
  if (x == null) return 0;
  if (typeof x.length === 'number') return x.length;
  if (typeof x.size === 'number') return x.size;
  if (typeof x === 'object') return Object.keys(x).length;
  return 0;
}

function transformClause(clause: string): string {
  let c = clause.trim();
  let hasOuterParen = false;
  if (c.startsWith('(') && c.endsWith(')')) {
    let depth = 0;
    let isOuter = true;
    for (let i = 0; i < c.length - 1; i++) {
      if (c[i] === '(') depth++;
      else if (c[i] === ')') depth--;
      if (depth === 0) { isOuter = false; break; }
    }
    if (isOuter) {
      hasOuterParen = true;
      c = c.substring(1, c.length - 1).trim();
    }
  }

  if (c.includes('==')) {
    const idx = c.indexOf('==');
    const left = c.substring(0, idx).trim();
    const right = c.substring(idx + 2).trim();
    c = \`__py_eq(\${left}, \${right})\`;
  } else if (c.includes('!=')) {
    const idx = c.indexOf('!=');
    const left = c.substring(0, idx).trim();
    const right = c.substring(idx + 2).trim();
    c = \`!__py_eq(\${left}, \${right})\`;
  }

  return hasOuterParen ? \`(\${c})\` : c;
}

function convertPythonExpr(expr: string): string {
  let e = expr.trim();
  e = e.replace(/\\bTrue\\b/g, 'true');
  e = e.replace(/\\bFalse\\b/g, 'false');
  e = e.replace(/\\bNone\\b/g, 'null');
  e = e.replace(/\\band\\b/g, '&&');
  e = e.replace(/\\bor\\b/g, '||');

  // Handle not in and in before standalone not
  e = e.replace(/([a-zA-Z0-9_().[\\]'"]+)\\s+not\\s+in\\s+([a-zA-Z0-9_().[\\]'"]+)/g, '!__py_in($1, $2)');
  e = e.replace(/([a-zA-Z0-9_().[\\]'"]+)\\s+in\\s+([a-zA-Z0-9_().[\\]'"]+)/g, '__py_in($1, $2)');

  e = e.replace(/\\bnot\\b/g, '!');
  e = e.replace(/\\blen\\((.*?)\\)/g, '__py_len($1)');

  // dict and object methods
  e = e.replace(/([a-zA-Z0-9_().[\\]'"]+)\\.get\\((.*?)\\)/g, '__py_get($1, $2)');
  e = e.replace(/([a-zA-Z0-9_().[\\]'"]+)\\.values\\(\\)/g, '__py_values($1)');
  e = e.replace(/([a-zA-Z0-9_().[\\]'"]+)\\.keys\\(\\)/g, '__py_keys($1)');
  e = e.replace(/([a-zA-Z0-9_().[\\]'"]+)\\.items\\(\\)/g, '__py_items($1)');
  e = e.replace(/([a-zA-Z0-9_().[\\]'"]+)\\.count\\((.*?)\\)/g, '__py_count($1, $2)');

  e = e.replace(/\\.append\\((.*?)\\)/g, '.push($1)');
  e = e.replace(/\\bprint\\((.*?)\\)/g, 'console.log($1)');

  // Transform comparisons (== and !=) across && and ||
  const parts = e.split(/(\\s*&&\\s*|\\s*\\|\\|\\s*)/);
  for (let i = 0; i < parts.length; i += 2) {
    parts[i] = transformClause(parts[i]);
  }
  e = parts.join('');

  return e;
}

function transpilePythonToJs(pythonCode: string): string {
  const lines = pythonCode.split(/\\r?\\n/);
  const outLines: string[] = [];
  const indentStack: number[] = [0];

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    if (!rawLine.trim() || rawLine.trim().startsWith('#')) continue;
    if (rawLine.trim().startsWith('import ') || rawLine.trim().startsWith('from ')) continue;

    const indentMatch = rawLine.match(/^(\\s*)/);
    const currentIndent = indentMatch ? indentMatch[1].length : 0;

    while (indentStack.length > 1 && currentIndent < indentStack[indentStack.length - 1]) {
      indentStack.pop();
      outLines.push(' '.repeat(indentStack[indentStack.length - 1]) + '}');
    }

    let line = rawLine.trim();

    const defMatch = line.match(/^def\\s+([a-zA-Z0-9_]+)\\s*\\((.*?)\\)(?:\\s*->\\s*[^:]+)?:/);
    if (defMatch) {
      const funcName = defMatch[1];
      const params = defMatch[2]
        .split(',')
        .map(p => p.trim().split(':')[0].trim())
        .filter(Boolean)
        .join(', ');
      outLines.push(' '.repeat(currentIndent) + 'function ' + funcName + '(' + params + ') {');
      indentStack.push(currentIndent + 4);
      continue;
    }

    if (line.match(/^elif\\s+(.*?):$/)) {
      const cond = line.replace(/^elif\\s+/, '').replace(/:$/, '');
      outLines.push(' '.repeat(currentIndent) + 'else if (' + convertPythonExpr(cond) + ') {');
      indentStack.push(currentIndent + 4);
      continue;
    }

    if (line.match(/^if\\s+(.*?):$/)) {
      const cond = line.replace(/^if\\s+/, '').replace(/:$/, '');
      outLines.push(' '.repeat(currentIndent) + 'if (' + convertPythonExpr(cond) + ') {');
      indentStack.push(currentIndent + 4);
      continue;
    }

    if (line === 'else:') {
      outLines.push(' '.repeat(currentIndent) + 'else {');
      indentStack.push(currentIndent + 4);
      continue;
    }

    if (line.match(/^while\\s+(.*?):$/)) {
      const cond = line.replace(/^while\\s+/, '').replace(/:$/, '');
      outLines.push(' '.repeat(currentIndent) + 'while (' + convertPythonExpr(cond) + ') {');
      indentStack.push(currentIndent + 4);
      continue;
    }

    const forRangeMatch = line.match(/^for\\s+([a-zA-Z0-9_]+)\\s+in\\s+range\\((.*?)\\):/);
    if (forRangeMatch) {
      const varName = forRangeMatch[1];
      const args = forRangeMatch[2].split(',').map(a => convertPythonExpr(a.trim()));
      let init = 'let ' + varName + ' = 0; ' + varName + ' < ' + args[0] + '; ' + varName + '++';
      if (args.length === 2) {
        init = 'let ' + varName + ' = ' + args[0] + '; ' + varName + ' < ' + args[1] + '; ' + varName + '++';
      } else if (args.length === 3) {
        const step = args[2];
        const op = step.startsWith('-') ? '>' : '<';
        init = 'let ' + varName + ' = ' + args[0] + '; ' + varName + ' ' + op + ' ' + args[1] + '; ' + varName + ' += ' + step;
      }
      outLines.push(' '.repeat(currentIndent) + 'for (' + init + ') {');
      indentStack.push(currentIndent + 4);
      continue;
    }

    const forTwoMatch = line.match(/^for\\s+([a-zA-Z0-9_]+)\\s*,\\s*([a-zA-Z0-9_]+)\\s+in\\s+(.*?):/);
    if (forTwoMatch) {
      const v1 = forTwoMatch[1];
      const v2 = forTwoMatch[2];
      const iter = convertPythonExpr(forTwoMatch[3]);
      outLines.push(' '.repeat(currentIndent) + 'for (const [' + v1 + ', ' + v2 + '] of ' + iter + ') {');
      indentStack.push(currentIndent + 4);
      continue;
    }

    const forInMatch = line.match(/^for\\s+([a-zA-Z0-9_]+)\\s+in\\s+(.*?):/);
    if (forInMatch) {
      const varName = forInMatch[1];
      const iter = convertPythonExpr(forInMatch[2]);
      outLines.push(' '.repeat(currentIndent) + 'for (const ' + varName + ' of ' + iter + ') {');
      indentStack.push(currentIndent + 4);
      continue;
    }

    if (line === 'pass') continue;

    if (line.startsWith('return ') || line === 'return') {
      const retVal = line.replace(/^return\\s*/, '');
      outLines.push(' '.repeat(currentIndent) + 'return ' + convertPythonExpr(retVal) + ';');
      continue;
    }

    let stmt = convertPythonExpr(line);
    if (stmt.match(/^[a-zA-Z0-9_]+\\s*=/)) {
      stmt = 'let ' + stmt;
    }
    outLines.push(' '.repeat(currentIndent) + stmt + ';');
  }

  while (indentStack.length > 1) {
    indentStack.pop();
    outLines.push('}');
  }

  return outLines.join('\\n');
}

function executeCodeSandbox(code: string, language: string, testCases: RunnerTestCase[]) {
  const capturedStdout: string[] = [];
  const capturedStderr: string[] = [];

  const originalLog = console.log;
  const originalWarn = console.warn;
  const originalError = console.error;

  console.log = (...args: any[]) => {
    capturedStdout.push(args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
  };
  console.warn = (...args: any[]) => {
    capturedStdout.push(args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
  };
  console.error = (...args: any[]) => {
    capturedStderr.push(args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
  };

  const tStart = Date.now();

  try {
    let runnableJs = code;
    if (language === 'python') {
      runnableJs = transpilePythonToJs(code);
    }

    // Extract all function and class definitions
    const funcNames: string[] = [];
    const funcRegex = /(?:function\\s+([a-zA-Z0-9_]+)|class\\s+([a-zA-Z0-9_]+)|(?:const|let|var)\\s+([a-zA-Z0-9_]+)\\s*=\\s*(?:function|\\([^)]*\\)\\s*=>))/g;
    let match: RegExpExecArray | null;
    while ((match = funcRegex.exec(runnableJs)) !== null) {
      const name = match[1] || match[2] || match[3];
      if (name && !funcNames.includes(name)) {
        funcNames.push(name);
      }
    }

    const checks = funcNames.map(f => 'if (typeof ' + f + ' === "function") return ' + f + ';').join('\\n');

    const runnerFactory = new Function(\`
      function __py_eq(a, b) {
        if (a === b) return true;
        if (a == null || b == null) return a === b;
        if (Array.isArray(a) && Array.isArray(b)) {
          if (a.length !== b.length) return false;
          for (let i = 0; i < a.length; i++) {
            if (!__py_eq(a[i], b[i])) return false;
          }
          return true;
        }
        if (a instanceof Set && b instanceof Set) {
          if (a.size !== b.size) return false;
          for (const item of a) {
            if (!b.has(item)) return false;
          }
          return true;
        }
        if (typeof a === 'object' && typeof b === 'object') {
          const kA = Object.keys(a).filter(k => a[k] !== undefined);
          const kB = Object.keys(b).filter(k => b[k] !== undefined);
          if (kA.length !== kB.length) return false;
          for (const k of kA) {
            if (!__py_eq(a[k], b[k])) return false;
          }
          return true;
        }
        return false;
      }
      function __py_in(item, col) {
        if (col == null) return false;
        if (typeof col.has === 'function') return col.has(item);
        if (Array.isArray(col) || typeof col === 'string') return col.indexOf(item) !== -1;
        return item in col;
      }
      function __py_get(obj, key, defaultVal = null) {
        if (obj == null) return defaultVal;
        if (typeof obj.get === 'function') {
          const val = obj.get(key);
          return val !== undefined ? val : defaultVal;
        }
        if (key in obj && obj[key] !== undefined) {
          return obj[key];
        }
        return defaultVal;
      }
      function __py_values(obj) {
        if (obj == null) return [];
        if (typeof obj.values === 'function') return Array.from(obj.values());
        return Object.values(obj);
      }
      function __py_keys(obj) {
        if (obj == null) return [];
        if (typeof obj.keys === 'function') return Array.from(obj.keys());
        return Object.keys(obj);
      }
      function __py_items(obj) {
        if (obj == null) return [];
        if (typeof obj.entries === 'function') return Array.from(obj.entries());
        return Object.entries(obj);
      }
      function __py_count(seq, val) {
        if (typeof seq === 'string') {
          let cnt = 0, pos = 0;
          while ((pos = seq.indexOf(val, pos)) !== -1) {
            cnt++;
            pos += (val.length || 1);
          }
          return cnt;
        }
        if (Array.isArray(seq)) {
          return seq.filter(x => __py_eq(x, val)).length;
        }
        return 0;
      }
      function __py_len(x) {
        if (x == null) return 0;
        if (typeof x.length === 'number') return x.length;
        if (typeof x.size === 'number') return x.size;
        if (typeof x === 'object') return Object.keys(x).length;
        return 0;
      }
      function Counter(iterable) {
        const counts = {};
        for (const item of (iterable || [])) {
          counts[item] = (counts[item] || 0) + 1;
        }
        return counts;
      }
      function defaultdict(defaultFactory) {
        return new Proxy({}, {
          get(target, prop) {
            if (prop === 'get') {
              return (key, d = null) => (target[key] !== undefined ? target[key] : (d !== null ? d : (defaultFactory ? defaultFactory() : 0)));
            }
            if (!(prop in target) && typeof prop === 'string' && prop !== 'toJSON') {
              target[prop] = defaultFactory ? defaultFactory() : 0;
            }
            return target[prop];
          }
        });
      }
      function enumerate(iterable) {
        return Array.from(iterable || []).map((item, idx) => [idx, item]);
      }
      function set(iterable) { return new Set(iterable || []); }
      function dict(entries) { return new Map(entries || []); }
      function list(iterable) { return Array.from(iterable || []); }
      function min(...args) {
        if (args.length === 1 && (Array.isArray(args[0]) || typeof args[0] === 'string')) return Math.min(...Array.from(args[0]));
        return Math.min(...args);
      }
      function max(...args) {
        if (args.length === 1 && (Array.isArray(args[0]) || typeof args[0] === 'string')) return Math.max(...Array.from(args[0]));
        return Math.max(...args);
      }
      function sum(arr) { return (arr || []).reduce((a, b) => a + b, 0); }
      function abs(x) { return Math.abs(x); }
      function sorted(arr, keyFunc, reverse = false) {
        const copy = [...(arr || [])];
        copy.sort((a, b) => {
          const valA = keyFunc ? keyFunc(a) : a;
          const valB = keyFunc ? keyFunc(b) : b;
          return valA < valB ? -1 : valA > valB ? 1 : 0;
        });
        if (reverse) copy.reverse();
        return copy;
      }

      \${runnableJs};
      \${checks}
      if (typeof solution === 'function') return solution;
      return null;
    \`);

    const targetFunc = runnerFactory();

    if (typeof targetFunc !== 'function') {
      return {
        status: 'COMPILATION_ERROR',
        runtime_ms: 0,
        memory_kb: 14200,
        total_test_cases: testCases.length,
        passed_test_cases: 0,
        test_results: [],
        error_message: 'No executable solution function found. Please check your function definition.',
        stdout: capturedStdout.join('\\n'),
        stderr: capturedStderr.join('\\n')
      };
    }

    let allPassed = true;
    let passedCount = 0;
    const results: TestCaseResult[] = [];

    for (const tc of testCases) {
      const tcStart = Date.now();
      let actualOutput: any;
      let errorMessage: string | undefined;
      let passed = false;

      try {
        const inputArgs = JSON.parse(JSON.stringify(tc.input));
        if (Array.isArray(inputArgs)) {
          actualOutput = targetFunc(...inputArgs);
        } else {
          actualOutput = targetFunc(inputArgs);
        }
        passed = areOutputsEquivalent(actualOutput, tc.expectedOutput);
        if (passed) passedCount++;
      } catch (err: any) {
        errorMessage = (err.name || 'Error') + ': ' + (err.message || String(err));
        passed = false;
      }

      const tcEnd = Date.now();
      if (!passed) allPassed = false;

      results.push({
        testCaseId: tc.id,
        position: tc.position,
        isPublic: tc.isPublic,
        passed,
        actualOutput: tc.isPublic ? actualOutput : undefined,
        expectedOutput: tc.isPublic ? tc.expectedOutput : undefined,
        input: tc.isPublic ? tc.input : undefined,
        runtimeMs: Math.max(1, tcEnd - tcStart),
        memoryKb: 14200,
        errorMessage
      });
    }

    const totalTime = Math.max(1, Date.now() - tStart);
    const hasRuntimeError = results.some(r => !!r.errorMessage);

    return {
      status: allPassed ? 'ACCEPTED' : (hasRuntimeError ? 'RUNTIME_ERROR' : 'WRONG_ANSWER'),
      runtime_ms: totalTime,
      memory_kb: 16400,
      total_test_cases: testCases.length,
      passed_test_cases: passedCount,
      test_results: results,
      stdout: capturedStdout.length > 0 ? capturedStdout.join('\\n') : undefined,
      stderr: capturedStderr.length > 0 ? capturedStderr.join('\\n') : undefined
    };
  } catch (err: any) {
    const isSyntax = err.name === 'SyntaxError';
    return {
      status: isSyntax ? 'COMPILATION_ERROR' : 'RUNTIME_ERROR',
      runtime_ms: Math.max(1, Date.now() - tStart),
      memory_kb: 0,
      total_test_cases: testCases.length,
      passed_test_cases: 0,
      test_results: [],
      error_message: (err.name || 'Error') + ': ' + (err.message || String(err)),
      stdout: capturedStdout.length > 0 ? capturedStdout.join('\\n') : undefined,
      stderr: capturedStderr.length > 0 ? capturedStderr.join('\\n') : undefined
    };
  } finally {
    console.log = originalLog;
    console.warn = originalWarn;
    console.error = originalError;
  }
}
`;

// Generate run.ts
const runContent = `${sharedHeader}
const PUBLIC_TEST_CASES: Record<string, RunnerTestCase[]> = ${JSON.stringify(runMap, null, 2)};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error_message: 'Method not allowed' });
  }

  try {
    const { problem_id = '', language = 'javascript', code = '' } = req.body || {};
    const cleanId = String(problem_id).toLowerCase().trim();
    const testCases = PUBLIC_TEST_CASES[cleanId];

    if (!testCases || testCases.length === 0) {
      return res.status(404).json({
        success: false,
        status: 'SYSTEM_ERROR',
        runtime_ms: 0,
        memory_kb: 0,
        total_test_cases: 0,
        passed_test_cases: 0,
        test_results: [],
        error_message: 'No test cases found for problem ID: ' + problem_id + '. Zero cross-problem fallbacks permitted.'
      });
    }

    const result = executeCodeSandbox(code, language, testCases);
    return res.status(200).json({
      success: true,
      ...result
    });
  } catch (err: any) {
    return res.status(200).json({
      success: false,
      status: 'SYSTEM_ERROR',
      error_message: err.message || 'Execution error'
    });
  }
}
`;

// Generate submit.ts
const submitContent = `${sharedHeader}
const ALL_TEST_CASES: Record<string, RunnerTestCase[]> = ${JSON.stringify(submitMap, null, 2)};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error_message: 'Method not allowed' });
  }

  if (!req.body?.user_id) {
    return res.status(401).json({ success: false, status: 'SYSTEM_ERROR', error_message: 'Unauthorized: user_id is required' });
  }

  try {
    const { problem_id = '', language = 'javascript', code = '' } = req.body || {};
    const cleanId = String(problem_id).toLowerCase().trim();
    const testCases = ALL_TEST_CASES[cleanId];

    if (!testCases || testCases.length === 0) {
      return res.status(404).json({
        success: false,
        status: 'SYSTEM_ERROR',
        runtime_ms: 0,
        memory_kb: 0,
        total_test_cases: 0,
        passed_test_cases: 0,
        test_results: [],
        error_message: 'No test cases found for problem ID: ' + problem_id + '. Zero cross-problem fallbacks permitted.'
      });
    }

    const result = executeCodeSandbox(code, language, testCases);
    const jobId = 'job_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const submissionId = 'sub_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);

    return res.status(200).json({
      success: true,
      submission_id: submissionId,
      job_id: jobId,
      ...result
    });
  } catch (err: any) {
    return res.status(200).json({
      success: false,
      status: 'SYSTEM_ERROR',
      error_message: err.message || 'Submission error'
    });
  }
}
`;

fs.writeFileSync('api/code/run.ts', runContent, 'utf-8');
fs.writeFileSync('api/code/submit.ts', submitContent, 'utf-8');
console.log('Successfully generated api/code/run.ts and api/code/submit.ts with enhanced Python judge semantics!');
