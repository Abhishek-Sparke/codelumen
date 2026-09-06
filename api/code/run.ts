import type { VercelRequest, VercelResponse } from '@vercel/node';

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
    c = `__py_eq(${left}, ${right})`;
  } else if (c.includes('!=')) {
    const idx = c.indexOf('!=');
    const left = c.substring(0, idx).trim();
    const right = c.substring(idx + 2).trim();
    c = `!__py_eq(${left}, ${right})`;
  }

  return hasOuterParen ? `(${c})` : c;
}

function convertPythonExpr(expr: string): string {
  let e = expr.trim();
  e = e.replace(/\bTrue\b/g, 'true');
  e = e.replace(/\bFalse\b/g, 'false');
  e = e.replace(/\bNone\b/g, 'null');
  e = e.replace(/\band\b/g, '&&');
  e = e.replace(/\bor\b/g, '||');

  // Handle not in and in before standalone not
  e = e.replace(/([a-zA-Z0-9_().[\]'"]+)\s+not\s+in\s+([a-zA-Z0-9_().[\]'"]+)/g, '!__py_in($1, $2)');
  e = e.replace(/([a-zA-Z0-9_().[\]'"]+)\s+in\s+([a-zA-Z0-9_().[\]'"]+)/g, '__py_in($1, $2)');

  e = e.replace(/\bnot\b/g, '!');
  e = e.replace(/\blen\((.*?)\)/g, '__py_len($1)');

  // dict and object methods
  e = e.replace(/([a-zA-Z0-9_().[\]'"]+)\.get\((.*?)\)/g, '__py_get($1, $2)');
  e = e.replace(/([a-zA-Z0-9_().[\]'"]+)\.values\(\)/g, '__py_values($1)');
  e = e.replace(/([a-zA-Z0-9_().[\]'"]+)\.keys\(\)/g, '__py_keys($1)');
  e = e.replace(/([a-zA-Z0-9_().[\]'"]+)\.items\(\)/g, '__py_items($1)');
  e = e.replace(/([a-zA-Z0-9_().[\]'"]+)\.count\((.*?)\)/g, '__py_count($1, $2)');

  e = e.replace(/\.append\((.*?)\)/g, '.push($1)');
  e = e.replace(/\bprint\((.*?)\)/g, 'console.log($1)');

  // Transform comparisons (== and !=) across && and ||
  const parts = e.split(/(\s*&&\s*|\s*\|\|\s*)/);
  for (let i = 0; i < parts.length; i += 2) {
    parts[i] = transformClause(parts[i]);
  }
  e = parts.join('');

  return e;
}

function transpilePythonToJs(pythonCode: string): string {
  const lines = pythonCode.split(/\r?\n/);
  const outLines: string[] = [];
  const indentStack: number[] = [0];

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    if (!rawLine.trim() || rawLine.trim().startsWith('#')) continue;
    if (rawLine.trim().startsWith('import ') || rawLine.trim().startsWith('from ')) continue;

    const indentMatch = rawLine.match(/^(\s*)/);
    const currentIndent = indentMatch ? indentMatch[1].length : 0;

    while (indentStack.length > 1 && currentIndent < indentStack[indentStack.length - 1]) {
      indentStack.pop();
      outLines.push(' '.repeat(indentStack[indentStack.length - 1]) + '}');
    }

    let line = rawLine.trim();

    const defMatch = line.match(/^def\s+([a-zA-Z0-9_]+)\s*\((.*?)\)(?:\s*->\s*[^:]+)?:/);
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

    if (line.match(/^elif\s+(.*?):$/)) {
      const cond = line.replace(/^elif\s+/, '').replace(/:$/, '');
      outLines.push(' '.repeat(currentIndent) + 'else if (' + convertPythonExpr(cond) + ') {');
      indentStack.push(currentIndent + 4);
      continue;
    }

    if (line.match(/^if\s+(.*?):$/)) {
      const cond = line.replace(/^if\s+/, '').replace(/:$/, '');
      outLines.push(' '.repeat(currentIndent) + 'if (' + convertPythonExpr(cond) + ') {');
      indentStack.push(currentIndent + 4);
      continue;
    }

    if (line === 'else:') {
      outLines.push(' '.repeat(currentIndent) + 'else {');
      indentStack.push(currentIndent + 4);
      continue;
    }

    if (line.match(/^while\s+(.*?):$/)) {
      const cond = line.replace(/^while\s+/, '').replace(/:$/, '');
      outLines.push(' '.repeat(currentIndent) + 'while (' + convertPythonExpr(cond) + ') {');
      indentStack.push(currentIndent + 4);
      continue;
    }

    const forRangeMatch = line.match(/^for\s+([a-zA-Z0-9_]+)\s+in\s+range\((.*?)\):/);
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

    const forTwoMatch = line.match(/^for\s+([a-zA-Z0-9_]+)\s*,\s*([a-zA-Z0-9_]+)\s+in\s+(.*?):/);
    if (forTwoMatch) {
      const v1 = forTwoMatch[1];
      const v2 = forTwoMatch[2];
      const iter = convertPythonExpr(forTwoMatch[3]);
      outLines.push(' '.repeat(currentIndent) + 'for (const [' + v1 + ', ' + v2 + '] of ' + iter + ') {');
      indentStack.push(currentIndent + 4);
      continue;
    }

    const forInMatch = line.match(/^for\s+([a-zA-Z0-9_]+)\s+in\s+(.*?):/);
    if (forInMatch) {
      const varName = forInMatch[1];
      const iter = convertPythonExpr(forInMatch[2]);
      outLines.push(' '.repeat(currentIndent) + 'for (const ' + varName + ' of ' + iter + ') {');
      indentStack.push(currentIndent + 4);
      continue;
    }

    if (line === 'pass') continue;

    if (line.startsWith('return ') || line === 'return') {
      const retVal = line.replace(/^return\s*/, '');
      outLines.push(' '.repeat(currentIndent) + 'return ' + convertPythonExpr(retVal) + ';');
      continue;
    }

    let stmt = convertPythonExpr(line);
    if (stmt.match(/^[a-zA-Z0-9_]+\s*=/)) {
      stmt = 'let ' + stmt;
    }
    outLines.push(' '.repeat(currentIndent) + stmt + ';');
  }

  while (indentStack.length > 1) {
    indentStack.pop();
    outLines.push('}');
  }

  return outLines.join('\n');
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
    const funcRegex = /(?:function\s+([a-zA-Z0-9_]+)|class\s+([a-zA-Z0-9_]+)|(?:const|let|var)\s+([a-zA-Z0-9_]+)\s*=\s*(?:function|\([^)]*\)\s*=>))/g;
    let match: RegExpExecArray | null;
    while ((match = funcRegex.exec(runnableJs)) !== null) {
      const name = match[1] || match[2] || match[3];
      if (name && !funcNames.includes(name)) {
        funcNames.push(name);
      }
    }

    const checks = funcNames.map(f => 'if (typeof ' + f + ' === "function") return ' + f + ';').join('\n');

    const runnerFactory = new Function(`
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

      ${runnableJs};
      ${checks}
      if (typeof solution === 'function') return solution;
      return null;
    `);

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
        stdout: capturedStdout.join('\n'),
        stderr: capturedStderr.join('\n')
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
      stdout: capturedStdout.length > 0 ? capturedStdout.join('\n') : undefined,
      stderr: capturedStderr.length > 0 ? capturedStderr.join('\n') : undefined
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
      stdout: capturedStdout.length > 0 ? capturedStdout.join('\n') : undefined,
      stderr: capturedStderr.length > 0 ? capturedStderr.join('\n') : undefined
    };
  } finally {
    console.log = originalLog;
    console.warn = originalWarn;
    console.error = originalError;
  }
}

const PUBLIC_TEST_CASES: Record<string, RunnerTestCase[]> = {
  "p-1": [
    {
      "id": "tc-pub-p-1-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          2,
          7,
          11,
          15
        ],
        9
      ],
      "expectedOutput": [
        0,
        1
      ]
    },
    {
      "id": "tc-pub-p-1-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          3,
          2,
          4
        ],
        6
      ],
      "expectedOutput": [
        1,
        2
      ]
    },
    {
      "id": "tc-pub-p-1-3",
      "position": 3,
      "isPublic": true,
      "input": [
        [
          3,
          3
        ],
        6
      ],
      "expectedOutput": [
        0,
        1
      ]
    }
  ],
  "two-sum-indices": [
    {
      "id": "tc-pub-p-1-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          2,
          7,
          11,
          15
        ],
        9
      ],
      "expectedOutput": [
        0,
        1
      ]
    },
    {
      "id": "tc-pub-p-1-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          3,
          2,
          4
        ],
        6
      ],
      "expectedOutput": [
        1,
        2
      ]
    },
    {
      "id": "tc-pub-p-1-3",
      "position": 3,
      "isPublic": true,
      "input": [
        [
          3,
          3
        ],
        6
      ],
      "expectedOutput": [
        0,
        1
      ]
    }
  ],
  "p-2": [
    {
      "id": "tc-pub-p-2-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          1,
          2,
          3,
          1
        ]
      ],
      "expectedOutput": true
    },
    {
      "id": "tc-pub-p-2-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          1,
          2,
          3,
          4
        ]
      ],
      "expectedOutput": false
    },
    {
      "id": "tc-pub-p-2-3",
      "position": 3,
      "isPublic": true,
      "input": [
        [
          1,
          1,
          1,
          3,
          3,
          4,
          3,
          2,
          4,
          2
        ]
      ],
      "expectedOutput": true
    }
  ],
  "contains-duplicate-value": [
    {
      "id": "tc-pub-p-2-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          1,
          2,
          3,
          1
        ]
      ],
      "expectedOutput": true
    },
    {
      "id": "tc-pub-p-2-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          1,
          2,
          3,
          4
        ]
      ],
      "expectedOutput": false
    },
    {
      "id": "tc-pub-p-2-3",
      "position": 3,
      "isPublic": true,
      "input": [
        [
          1,
          1,
          1,
          3,
          3,
          4,
          3,
          2,
          4,
          2
        ]
      ],
      "expectedOutput": true
    }
  ],
  "p-3": [
    {
      "id": "tc-pub-p-3-1",
      "position": 1,
      "isPublic": true,
      "input": [
        "anagram",
        "nagaram"
      ],
      "expectedOutput": true
    },
    {
      "id": "tc-pub-p-3-2",
      "position": 2,
      "isPublic": true,
      "input": [
        "rat",
        "car"
      ],
      "expectedOutput": false
    },
    {
      "id": "tc-pub-p-3-3",
      "position": 3,
      "isPublic": true,
      "input": [
        "listen",
        "silent"
      ],
      "expectedOutput": true
    }
  ],
  "valid-anagram-frequency": [
    {
      "id": "tc-pub-p-3-1",
      "position": 1,
      "isPublic": true,
      "input": [
        "anagram",
        "nagaram"
      ],
      "expectedOutput": true
    },
    {
      "id": "tc-pub-p-3-2",
      "position": 2,
      "isPublic": true,
      "input": [
        "rat",
        "car"
      ],
      "expectedOutput": false
    },
    {
      "id": "tc-pub-p-3-3",
      "position": 3,
      "isPublic": true,
      "input": [
        "listen",
        "silent"
      ],
      "expectedOutput": true
    }
  ],
  "p-4": [
    {
      "id": "tc-pub-p-4-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          "eat",
          "tea",
          "tan",
          "ate",
          "nat",
          "bat"
        ]
      ],
      "expectedOutput": [
        [
          "eat",
          "tea",
          "ate"
        ],
        [
          "tan",
          "nat"
        ],
        [
          "bat"
        ]
      ]
    },
    {
      "id": "tc-pub-p-4-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          ""
        ]
      ],
      "expectedOutput": [
        [
          ""
        ]
      ]
    },
    {
      "id": "tc-pub-p-4-3",
      "position": 3,
      "isPublic": true,
      "input": [
        [
          "a"
        ]
      ],
      "expectedOutput": [
        [
          "a"
        ]
      ]
    }
  ],
  "group-anagrams-by-signature": [
    {
      "id": "tc-pub-p-4-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          "eat",
          "tea",
          "tan",
          "ate",
          "nat",
          "bat"
        ]
      ],
      "expectedOutput": [
        [
          "eat",
          "tea",
          "ate"
        ],
        [
          "tan",
          "nat"
        ],
        [
          "bat"
        ]
      ]
    },
    {
      "id": "tc-pub-p-4-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          ""
        ]
      ],
      "expectedOutput": [
        [
          ""
        ]
      ]
    },
    {
      "id": "tc-pub-p-4-3",
      "position": 3,
      "isPublic": true,
      "input": [
        [
          "a"
        ]
      ],
      "expectedOutput": [
        [
          "a"
        ]
      ]
    }
  ],
  "p-5": [
    {
      "id": "tc-pub-p-5-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          100,
          4,
          200,
          1,
          3,
          2
        ]
      ],
      "expectedOutput": 4
    },
    {
      "id": "tc-pub-p-5-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          0,
          3,
          7,
          2,
          5,
          8,
          4,
          6,
          0,
          1
        ]
      ],
      "expectedOutput": 9
    },
    {
      "id": "tc-pub-p-5-3",
      "position": 3,
      "isPublic": true,
      "input": [
        []
      ],
      "expectedOutput": 0
    }
  ],
  "longest-consecutive-sequence-linear": [
    {
      "id": "tc-pub-p-5-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          100,
          4,
          200,
          1,
          3,
          2
        ]
      ],
      "expectedOutput": 4
    },
    {
      "id": "tc-pub-p-5-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          0,
          3,
          7,
          2,
          5,
          8,
          4,
          6,
          0,
          1
        ]
      ],
      "expectedOutput": 9
    },
    {
      "id": "tc-pub-p-5-3",
      "position": 3,
      "isPublic": true,
      "input": [
        []
      ],
      "expectedOutput": 0
    }
  ],
  "p-6": [
    {
      "id": "tc-pub-p-6-1",
      "position": 1,
      "isPublic": true,
      "input": [
        "A man, a plan, a canal: Panama"
      ],
      "expectedOutput": true
    },
    {
      "id": "tc-pub-p-6-2",
      "position": 2,
      "isPublic": true,
      "input": [
        "race a car"
      ],
      "expectedOutput": false
    },
    {
      "id": "tc-pub-p-6-3",
      "position": 3,
      "isPublic": true,
      "input": [
        " "
      ],
      "expectedOutput": true
    }
  ],
  "valid-palindrome-alphanumeric": [
    {
      "id": "tc-pub-p-6-1",
      "position": 1,
      "isPublic": true,
      "input": [
        "A man, a plan, a canal: Panama"
      ],
      "expectedOutput": true
    },
    {
      "id": "tc-pub-p-6-2",
      "position": 2,
      "isPublic": true,
      "input": [
        "race a car"
      ],
      "expectedOutput": false
    },
    {
      "id": "tc-pub-p-6-3",
      "position": 3,
      "isPublic": true,
      "input": [
        " "
      ],
      "expectedOutput": true
    }
  ],
  "p-7": [
    {
      "id": "tc-pub-p-7-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          2,
          7,
          11,
          15
        ],
        9
      ],
      "expectedOutput": [
        1,
        2
      ]
    },
    {
      "id": "tc-pub-p-7-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          2,
          3,
          4
        ],
        6
      ],
      "expectedOutput": [
        1,
        3
      ]
    },
    {
      "id": "tc-pub-p-7-3",
      "position": 3,
      "isPublic": true,
      "input": [
        [
          -1,
          0
        ],
        -1
      ],
      "expectedOutput": [
        1,
        2
      ]
    }
  ],
  "two-sum-sorted-array": [
    {
      "id": "tc-pub-p-7-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          2,
          7,
          11,
          15
        ],
        9
      ],
      "expectedOutput": [
        1,
        2
      ]
    },
    {
      "id": "tc-pub-p-7-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          2,
          3,
          4
        ],
        6
      ],
      "expectedOutput": [
        1,
        3
      ]
    },
    {
      "id": "tc-pub-p-7-3",
      "position": 3,
      "isPublic": true,
      "input": [
        [
          -1,
          0
        ],
        -1
      ],
      "expectedOutput": [
        1,
        2
      ]
    }
  ],
  "p-8": [
    {
      "id": "tc-pub-p-8-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          -1,
          0,
          1,
          2,
          -1,
          -4
        ]
      ],
      "expectedOutput": [
        [
          -1,
          -1,
          2
        ],
        [
          -1,
          0,
          1
        ]
      ]
    },
    {
      "id": "tc-pub-p-8-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          0,
          1,
          1
        ]
      ],
      "expectedOutput": []
    },
    {
      "id": "tc-pub-p-8-3",
      "position": 3,
      "isPublic": true,
      "input": [
        [
          0,
          0,
          0
        ]
      ],
      "expectedOutput": [
        [
          0,
          0,
          0
        ]
      ]
    }
  ],
  "three-sum-triplets-zero": [
    {
      "id": "tc-pub-p-8-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          -1,
          0,
          1,
          2,
          -1,
          -4
        ]
      ],
      "expectedOutput": [
        [
          -1,
          -1,
          2
        ],
        [
          -1,
          0,
          1
        ]
      ]
    },
    {
      "id": "tc-pub-p-8-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          0,
          1,
          1
        ]
      ],
      "expectedOutput": []
    },
    {
      "id": "tc-pub-p-8-3",
      "position": 3,
      "isPublic": true,
      "input": [
        [
          0,
          0,
          0
        ]
      ],
      "expectedOutput": [
        [
          0,
          0,
          0
        ]
      ]
    }
  ],
  "p-9": [
    {
      "id": "tc-pub-p-9-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          7,
          1,
          5,
          3,
          6,
          4
        ]
      ],
      "expectedOutput": 5
    },
    {
      "id": "tc-pub-p-9-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          7,
          6,
          4,
          3,
          1
        ]
      ],
      "expectedOutput": 0
    },
    {
      "id": "tc-pub-p-9-3",
      "position": 3,
      "isPublic": true,
      "input": [
        [
          2,
          4,
          1
        ]
      ],
      "expectedOutput": 2
    }
  ],
  "best-time-to-buy-and-sell-stock": [
    {
      "id": "tc-pub-p-9-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          7,
          1,
          5,
          3,
          6,
          4
        ]
      ],
      "expectedOutput": 5
    },
    {
      "id": "tc-pub-p-9-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          7,
          6,
          4,
          3,
          1
        ]
      ],
      "expectedOutput": 0
    },
    {
      "id": "tc-pub-p-9-3",
      "position": 3,
      "isPublic": true,
      "input": [
        [
          2,
          4,
          1
        ]
      ],
      "expectedOutput": 2
    }
  ],
  "p-10": [
    {
      "id": "tc-pub-p-10-1",
      "position": 1,
      "isPublic": true,
      "input": [
        "abcabcbb"
      ],
      "expectedOutput": 3
    },
    {
      "id": "tc-pub-p-10-2",
      "position": 2,
      "isPublic": true,
      "input": [
        "bbbbb"
      ],
      "expectedOutput": 1
    },
    {
      "id": "tc-pub-p-10-3",
      "position": 3,
      "isPublic": true,
      "input": [
        "pwwkew"
      ],
      "expectedOutput": 3
    },
    {
      "id": "tc-pub-p-10-4",
      "position": 4,
      "isPublic": true,
      "input": [
        ""
      ],
      "expectedOutput": 0
    }
  ],
  "longest-substring-without-repeating": [
    {
      "id": "tc-pub-p-10-1",
      "position": 1,
      "isPublic": true,
      "input": [
        "abcabcbb"
      ],
      "expectedOutput": 3
    },
    {
      "id": "tc-pub-p-10-2",
      "position": 2,
      "isPublic": true,
      "input": [
        "bbbbb"
      ],
      "expectedOutput": 1
    },
    {
      "id": "tc-pub-p-10-3",
      "position": 3,
      "isPublic": true,
      "input": [
        "pwwkew"
      ],
      "expectedOutput": 3
    },
    {
      "id": "tc-pub-p-10-4",
      "position": 4,
      "isPublic": true,
      "input": [
        ""
      ],
      "expectedOutput": 0
    }
  ],
  "p-11": [
    {
      "id": "tc-pub-p-11-1",
      "position": 1,
      "isPublic": true,
      "input": [
        "ABAB",
        2
      ],
      "expectedOutput": 4
    },
    {
      "id": "tc-pub-p-11-2",
      "position": 2,
      "isPublic": true,
      "input": [
        "AABABBA",
        1
      ],
      "expectedOutput": 4
    },
    {
      "id": "tc-pub-p-11-3",
      "position": 3,
      "isPublic": true,
      "input": [
        "AAAA",
        2
      ],
      "expectedOutput": 4
    }
  ],
  "longest-repeating-character-replacement": [
    {
      "id": "tc-pub-p-11-1",
      "position": 1,
      "isPublic": true,
      "input": [
        "ABAB",
        2
      ],
      "expectedOutput": 4
    },
    {
      "id": "tc-pub-p-11-2",
      "position": 2,
      "isPublic": true,
      "input": [
        "AABABBA",
        1
      ],
      "expectedOutput": 4
    },
    {
      "id": "tc-pub-p-11-3",
      "position": 3,
      "isPublic": true,
      "input": [
        "AAAA",
        2
      ],
      "expectedOutput": 4
    }
  ],
  "p-12": [
    {
      "id": "tc-pub-p-12-1",
      "position": 1,
      "isPublic": true,
      "input": [
        "ab",
        "eidbaooo"
      ],
      "expectedOutput": true
    },
    {
      "id": "tc-pub-p-12-2",
      "position": 2,
      "isPublic": true,
      "input": [
        "ab",
        "eidboaoo"
      ],
      "expectedOutput": false
    },
    {
      "id": "tc-pub-p-12-3",
      "position": 3,
      "isPublic": true,
      "input": [
        "adc",
        "dcda"
      ],
      "expectedOutput": true
    }
  ],
  "permutation-in-string-sliding": [
    {
      "id": "tc-pub-p-12-1",
      "position": 1,
      "isPublic": true,
      "input": [
        "ab",
        "eidbaooo"
      ],
      "expectedOutput": true
    },
    {
      "id": "tc-pub-p-12-2",
      "position": 2,
      "isPublic": true,
      "input": [
        "ab",
        "eidboaoo"
      ],
      "expectedOutput": false
    },
    {
      "id": "tc-pub-p-12-3",
      "position": 3,
      "isPublic": true,
      "input": [
        "adc",
        "dcda"
      ],
      "expectedOutput": true
    }
  ],
  "p-13": [
    {
      "id": "tc-pub-p-13-1",
      "position": 1,
      "isPublic": true,
      "input": [
        "ADOBECODEBANC",
        "ABC"
      ],
      "expectedOutput": "BANC"
    },
    {
      "id": "tc-pub-p-13-2",
      "position": 2,
      "isPublic": true,
      "input": [
        "a",
        "a"
      ],
      "expectedOutput": "a"
    },
    {
      "id": "tc-pub-p-13-3",
      "position": 3,
      "isPublic": true,
      "input": [
        "a",
        "aa"
      ],
      "expectedOutput": ""
    }
  ],
  "minimum-window-substring-optimal": [
    {
      "id": "tc-pub-p-13-1",
      "position": 1,
      "isPublic": true,
      "input": [
        "ADOBECODEBANC",
        "ABC"
      ],
      "expectedOutput": "BANC"
    },
    {
      "id": "tc-pub-p-13-2",
      "position": 2,
      "isPublic": true,
      "input": [
        "a",
        "a"
      ],
      "expectedOutput": "a"
    },
    {
      "id": "tc-pub-p-13-3",
      "position": 3,
      "isPublic": true,
      "input": [
        "a",
        "aa"
      ],
      "expectedOutput": ""
    }
  ],
  "p-14": [
    {
      "id": "tc-pub-p-14-1",
      "position": 1,
      "isPublic": true,
      "input": [
        "()"
      ],
      "expectedOutput": true
    },
    {
      "id": "tc-pub-p-14-2",
      "position": 2,
      "isPublic": true,
      "input": [
        "()[]{}"
      ],
      "expectedOutput": true
    },
    {
      "id": "tc-pub-p-14-3",
      "position": 3,
      "isPublic": true,
      "input": [
        "(]"
      ],
      "expectedOutput": false
    },
    {
      "id": "tc-pub-p-14-4",
      "position": 4,
      "isPublic": true,
      "input": [
        "([)]"
      ],
      "expectedOutput": false
    }
  ],
  "valid-parentheses-matching": [
    {
      "id": "tc-pub-p-14-1",
      "position": 1,
      "isPublic": true,
      "input": [
        "()"
      ],
      "expectedOutput": true
    },
    {
      "id": "tc-pub-p-14-2",
      "position": 2,
      "isPublic": true,
      "input": [
        "()[]{}"
      ],
      "expectedOutput": true
    },
    {
      "id": "tc-pub-p-14-3",
      "position": 3,
      "isPublic": true,
      "input": [
        "(]"
      ],
      "expectedOutput": false
    },
    {
      "id": "tc-pub-p-14-4",
      "position": 4,
      "isPublic": true,
      "input": [
        "([)]"
      ],
      "expectedOutput": false
    }
  ],
  "p-15": [
    {
      "id": "tc-pub-p-15-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          -2,
          0,
          -3
        ]
      ],
      "expectedOutput": [
        -3,
        0,
        -2
      ]
    }
  ],
  "min-stack-constant-time": [
    {
      "id": "tc-pub-p-15-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          -2,
          0,
          -3
        ]
      ],
      "expectedOutput": [
        -3,
        0,
        -2
      ]
    }
  ],
  "p-16": [
    {
      "id": "tc-pub-p-16-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          "2",
          "1",
          "+",
          "3",
          "*"
        ]
      ],
      "expectedOutput": 9
    },
    {
      "id": "tc-pub-p-16-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          "4",
          "13",
          "5",
          "/",
          "+"
        ]
      ],
      "expectedOutput": 6
    },
    {
      "id": "tc-pub-p-16-3",
      "position": 3,
      "isPublic": true,
      "input": [
        [
          "10",
          "6",
          "9",
          "3",
          "+",
          "-11",
          "*",
          "/",
          "*",
          "17",
          "+",
          "5",
          "+"
        ]
      ],
      "expectedOutput": 22
    }
  ],
  "evaluate-reverse-polish-notation": [
    {
      "id": "tc-pub-p-16-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          "2",
          "1",
          "+",
          "3",
          "*"
        ]
      ],
      "expectedOutput": 9
    },
    {
      "id": "tc-pub-p-16-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          "4",
          "13",
          "5",
          "/",
          "+"
        ]
      ],
      "expectedOutput": 6
    },
    {
      "id": "tc-pub-p-16-3",
      "position": 3,
      "isPublic": true,
      "input": [
        [
          "10",
          "6",
          "9",
          "3",
          "+",
          "-11",
          "*",
          "/",
          "*",
          "17",
          "+",
          "5",
          "+"
        ]
      ],
      "expectedOutput": 22
    }
  ],
  "p-17": [
    {
      "id": "tc-pub-p-17-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          73,
          74,
          75,
          71,
          69,
          72,
          76,
          73
        ]
      ],
      "expectedOutput": [
        1,
        1,
        4,
        2,
        1,
        1,
        0,
        0
      ]
    },
    {
      "id": "tc-pub-p-17-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          30,
          40,
          50,
          60
        ]
      ],
      "expectedOutput": [
        1,
        1,
        1,
        0
      ]
    },
    {
      "id": "tc-pub-p-17-3",
      "position": 3,
      "isPublic": true,
      "input": [
        [
          30,
          60,
          90
        ]
      ],
      "expectedOutput": [
        1,
        1,
        0
      ]
    }
  ],
  "daily-temperatures-monotonic-stack": [
    {
      "id": "tc-pub-p-17-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          73,
          74,
          75,
          71,
          69,
          72,
          76,
          73
        ]
      ],
      "expectedOutput": [
        1,
        1,
        4,
        2,
        1,
        1,
        0,
        0
      ]
    },
    {
      "id": "tc-pub-p-17-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          30,
          40,
          50,
          60
        ]
      ],
      "expectedOutput": [
        1,
        1,
        1,
        0
      ]
    },
    {
      "id": "tc-pub-p-17-3",
      "position": 3,
      "isPublic": true,
      "input": [
        [
          30,
          60,
          90
        ]
      ],
      "expectedOutput": [
        1,
        1,
        0
      ]
    }
  ],
  "p-18": [
    {
      "id": "tc-pub-p-18-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          1,
          8,
          6,
          2,
          5,
          4,
          8,
          3,
          7
        ]
      ],
      "expectedOutput": 49
    },
    {
      "id": "tc-pub-p-18-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          1,
          1
        ]
      ],
      "expectedOutput": 1
    },
    {
      "id": "tc-pub-p-18-3",
      "position": 3,
      "isPublic": true,
      "input": [
        [
          4,
          3,
          2,
          1,
          4
        ]
      ],
      "expectedOutput": 16
    }
  ],
  "container-with-most-water-optimal": [
    {
      "id": "tc-pub-p-18-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          1,
          8,
          6,
          2,
          5,
          4,
          8,
          3,
          7
        ]
      ],
      "expectedOutput": 49
    },
    {
      "id": "tc-pub-p-18-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          1,
          1
        ]
      ],
      "expectedOutput": 1
    },
    {
      "id": "tc-pub-p-18-3",
      "position": 3,
      "isPublic": true,
      "input": [
        [
          4,
          3,
          2,
          1,
          4
        ]
      ],
      "expectedOutput": 16
    }
  ],
  "p-19": [
    {
      "id": "tc-pub-p-19-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          0,
          1,
          0,
          2,
          1,
          0,
          1,
          3,
          2,
          1,
          2,
          1
        ]
      ],
      "expectedOutput": 6
    },
    {
      "id": "tc-pub-p-19-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          4,
          2,
          0,
          3,
          2,
          5
        ]
      ],
      "expectedOutput": 9
    },
    {
      "id": "tc-pub-p-19-3",
      "position": 3,
      "isPublic": true,
      "input": [
        []
      ],
      "expectedOutput": 0
    }
  ],
  "trapping-rain-water-hard": [
    {
      "id": "tc-pub-p-19-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          0,
          1,
          0,
          2,
          1,
          0,
          1,
          3,
          2,
          1,
          2,
          1
        ]
      ],
      "expectedOutput": 6
    },
    {
      "id": "tc-pub-p-19-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          4,
          2,
          0,
          3,
          2,
          5
        ]
      ],
      "expectedOutput": 9
    },
    {
      "id": "tc-pub-p-19-3",
      "position": 3,
      "isPublic": true,
      "input": [
        []
      ],
      "expectedOutput": 0
    }
  ],
  "p-20": [
    {
      "id": "tc-pub-p-20-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          1,
          2,
          3,
          4,
          5
        ]
      ],
      "expectedOutput": [
        5,
        4,
        3,
        2,
        1
      ]
    },
    {
      "id": "tc-pub-p-20-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          1,
          2
        ]
      ],
      "expectedOutput": [
        2,
        1
      ]
    },
    {
      "id": "tc-pub-p-20-3",
      "position": 3,
      "isPublic": true,
      "input": [
        []
      ],
      "expectedOutput": []
    }
  ],
  "reverse-linked-list-iterative": [
    {
      "id": "tc-pub-p-20-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          1,
          2,
          3,
          4,
          5
        ]
      ],
      "expectedOutput": [
        5,
        4,
        3,
        2,
        1
      ]
    },
    {
      "id": "tc-pub-p-20-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          1,
          2
        ]
      ],
      "expectedOutput": [
        2,
        1
      ]
    },
    {
      "id": "tc-pub-p-20-3",
      "position": 3,
      "isPublic": true,
      "input": [
        []
      ],
      "expectedOutput": []
    }
  ],
  "p-21": [
    {
      "id": "tc-pub-p-21-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          3,
          2,
          0,
          -4
        ],
        1
      ],
      "expectedOutput": true
    },
    {
      "id": "tc-pub-p-21-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          1,
          2
        ],
        0
      ],
      "expectedOutput": true
    },
    {
      "id": "tc-pub-p-21-3",
      "position": 3,
      "isPublic": true,
      "input": [
        [
          1
        ],
        -1
      ],
      "expectedOutput": false
    }
  ],
  "linked-list-cycle-detection": [
    {
      "id": "tc-pub-p-21-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          3,
          2,
          0,
          -4
        ],
        1
      ],
      "expectedOutput": true
    },
    {
      "id": "tc-pub-p-21-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          1,
          2
        ],
        0
      ],
      "expectedOutput": true
    },
    {
      "id": "tc-pub-p-21-3",
      "position": 3,
      "isPublic": true,
      "input": [
        [
          1
        ],
        -1
      ],
      "expectedOutput": false
    }
  ],
  "p-22": [
    {
      "id": "tc-pub-p-22-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          1,
          2,
          4
        ],
        [
          1,
          3,
          4
        ]
      ],
      "expectedOutput": [
        1,
        1,
        2,
        3,
        4,
        4
      ]
    },
    {
      "id": "tc-pub-p-22-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [],
        []
      ],
      "expectedOutput": []
    },
    {
      "id": "tc-pub-p-22-3",
      "position": 3,
      "isPublic": true,
      "input": [
        [],
        [
          0
        ]
      ],
      "expectedOutput": [
        0
      ]
    }
  ],
  "merge-two-sorted-lists-sentinel": [
    {
      "id": "tc-pub-p-22-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          1,
          2,
          4
        ],
        [
          1,
          3,
          4
        ]
      ],
      "expectedOutput": [
        1,
        1,
        2,
        3,
        4,
        4
      ]
    },
    {
      "id": "tc-pub-p-22-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [],
        []
      ],
      "expectedOutput": []
    },
    {
      "id": "tc-pub-p-22-3",
      "position": 3,
      "isPublic": true,
      "input": [
        [],
        [
          0
        ]
      ],
      "expectedOutput": [
        0
      ]
    }
  ],
  "p-23": [
    {
      "id": "tc-pub-p-23-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          1,
          2,
          3,
          4,
          5
        ],
        2
      ],
      "expectedOutput": [
        1,
        2,
        3,
        5
      ]
    },
    {
      "id": "tc-pub-p-23-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          1
        ],
        1
      ],
      "expectedOutput": []
    },
    {
      "id": "tc-pub-p-23-3",
      "position": 3,
      "isPublic": true,
      "input": [
        [
          1,
          2
        ],
        1
      ],
      "expectedOutput": [
        1
      ]
    }
  ],
  "remove-nth-node-from-end": [
    {
      "id": "tc-pub-p-23-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          1,
          2,
          3,
          4,
          5
        ],
        2
      ],
      "expectedOutput": [
        1,
        2,
        3,
        5
      ]
    },
    {
      "id": "tc-pub-p-23-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          1
        ],
        1
      ],
      "expectedOutput": []
    },
    {
      "id": "tc-pub-p-23-3",
      "position": 3,
      "isPublic": true,
      "input": [
        [
          1,
          2
        ],
        1
      ],
      "expectedOutput": [
        1
      ]
    }
  ],
  "p-24": [
    {
      "id": "tc-pub-p-24-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          -1,
          0,
          3,
          5,
          9,
          12
        ],
        9
      ],
      "expectedOutput": 4
    },
    {
      "id": "tc-pub-p-24-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          -1,
          0,
          3,
          5,
          9,
          12
        ],
        2
      ],
      "expectedOutput": -1
    },
    {
      "id": "tc-pub-p-24-3",
      "position": 3,
      "isPublic": true,
      "input": [
        [
          5
        ],
        5
      ],
      "expectedOutput": 0
    }
  ],
  "binary-search-exact-target": [
    {
      "id": "tc-pub-p-24-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          -1,
          0,
          3,
          5,
          9,
          12
        ],
        9
      ],
      "expectedOutput": 4
    },
    {
      "id": "tc-pub-p-24-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          -1,
          0,
          3,
          5,
          9,
          12
        ],
        2
      ],
      "expectedOutput": -1
    },
    {
      "id": "tc-pub-p-24-3",
      "position": 3,
      "isPublic": true,
      "input": [
        [
          5
        ],
        5
      ],
      "expectedOutput": 0
    }
  ],
  "p-25": [
    {
      "id": "tc-pub-p-25-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          [
            1,
            3,
            5,
            7
          ],
          [
            10,
            11,
            16,
            20
          ],
          [
            23,
            30,
            34,
            60
          ]
        ],
        3
      ],
      "expectedOutput": true
    },
    {
      "id": "tc-pub-p-25-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          [
            1,
            3,
            5,
            7
          ],
          [
            10,
            11,
            16,
            20
          ],
          [
            23,
            30,
            34,
            60
          ]
        ],
        13
      ],
      "expectedOutput": false
    }
  ],
  "search-a-2d-matrix-optimal": [
    {
      "id": "tc-pub-p-25-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          [
            1,
            3,
            5,
            7
          ],
          [
            10,
            11,
            16,
            20
          ],
          [
            23,
            30,
            34,
            60
          ]
        ],
        3
      ],
      "expectedOutput": true
    },
    {
      "id": "tc-pub-p-25-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          [
            1,
            3,
            5,
            7
          ],
          [
            10,
            11,
            16,
            20
          ],
          [
            23,
            30,
            34,
            60
          ]
        ],
        13
      ],
      "expectedOutput": false
    }
  ],
  "p-26": [
    {
      "id": "tc-pub-p-26-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          4,
          5,
          6,
          7,
          0,
          1,
          2
        ],
        0
      ],
      "expectedOutput": 4
    },
    {
      "id": "tc-pub-p-26-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          4,
          5,
          6,
          7,
          0,
          1,
          2
        ],
        3
      ],
      "expectedOutput": -1
    },
    {
      "id": "tc-pub-p-26-3",
      "position": 3,
      "isPublic": true,
      "input": [
        [
          1
        ],
        0
      ],
      "expectedOutput": -1
    }
  ],
  "search-in-rotated-sorted-array": [
    {
      "id": "tc-pub-p-26-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          4,
          5,
          6,
          7,
          0,
          1,
          2
        ],
        0
      ],
      "expectedOutput": 4
    },
    {
      "id": "tc-pub-p-26-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          4,
          5,
          6,
          7,
          0,
          1,
          2
        ],
        3
      ],
      "expectedOutput": -1
    },
    {
      "id": "tc-pub-p-26-3",
      "position": 3,
      "isPublic": true,
      "input": [
        [
          1
        ],
        0
      ],
      "expectedOutput": -1
    }
  ],
  "p-27": [
    {
      "id": "tc-pub-p-27-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          3,
          4,
          5,
          1,
          2
        ]
      ],
      "expectedOutput": 1
    },
    {
      "id": "tc-pub-p-27-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          4,
          5,
          6,
          7,
          0,
          1,
          2
        ]
      ],
      "expectedOutput": 0
    },
    {
      "id": "tc-pub-p-27-3",
      "position": 3,
      "isPublic": true,
      "input": [
        [
          11,
          13,
          15,
          17
        ]
      ],
      "expectedOutput": 11
    }
  ],
  "find-minimum-in-rotated-sorted-array": [
    {
      "id": "tc-pub-p-27-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          3,
          4,
          5,
          1,
          2
        ]
      ],
      "expectedOutput": 1
    },
    {
      "id": "tc-pub-p-27-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          4,
          5,
          6,
          7,
          0,
          1,
          2
        ]
      ],
      "expectedOutput": 0
    },
    {
      "id": "tc-pub-p-27-3",
      "position": 3,
      "isPublic": true,
      "input": [
        [
          11,
          13,
          15,
          17
        ]
      ],
      "expectedOutput": 11
    }
  ],
  "p-28": [
    {
      "id": "tc-pub-p-28-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          3,
          6,
          7,
          11
        ],
        8
      ],
      "expectedOutput": 4
    },
    {
      "id": "tc-pub-p-28-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          30,
          11,
          23,
          4,
          20
        ],
        5
      ],
      "expectedOutput": 30
    },
    {
      "id": "tc-pub-p-28-3",
      "position": 3,
      "isPublic": true,
      "input": [
        [
          30,
          11,
          23,
          4,
          20
        ],
        6
      ],
      "expectedOutput": 23
    }
  ],
  "koko-eating-bananas-search-space": [
    {
      "id": "tc-pub-p-28-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          3,
          6,
          7,
          11
        ],
        8
      ],
      "expectedOutput": 4
    },
    {
      "id": "tc-pub-p-28-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          30,
          11,
          23,
          4,
          20
        ],
        5
      ],
      "expectedOutput": 30
    },
    {
      "id": "tc-pub-p-28-3",
      "position": 3,
      "isPublic": true,
      "input": [
        [
          30,
          11,
          23,
          4,
          20
        ],
        6
      ],
      "expectedOutput": 23
    }
  ],
  "p-29": [
    {
      "id": "tc-pub-p-29-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          3,
          9,
          20,
          null,
          null,
          15,
          7
        ]
      ],
      "expectedOutput": 3
    },
    {
      "id": "tc-pub-p-29-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          1,
          null,
          2
        ]
      ],
      "expectedOutput": 2
    },
    {
      "id": "tc-pub-p-29-3",
      "position": 3,
      "isPublic": true,
      "input": [
        []
      ],
      "expectedOutput": 0
    }
  ],
  "maximum-depth-of-binary-tree-dfs": [
    {
      "id": "tc-pub-p-29-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          3,
          9,
          20,
          null,
          null,
          15,
          7
        ]
      ],
      "expectedOutput": 3
    },
    {
      "id": "tc-pub-p-29-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          1,
          null,
          2
        ]
      ],
      "expectedOutput": 2
    },
    {
      "id": "tc-pub-p-29-3",
      "position": 3,
      "isPublic": true,
      "input": [
        []
      ],
      "expectedOutput": 0
    }
  ],
  "p-30": [
    {
      "id": "tc-pub-p-30-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          4,
          2,
          7,
          1,
          3,
          6,
          9
        ]
      ],
      "expectedOutput": [
        4,
        7,
        2,
        9,
        6,
        3,
        1
      ]
    },
    {
      "id": "tc-pub-p-30-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          2,
          1,
          3
        ]
      ],
      "expectedOutput": [
        2,
        3,
        1
      ]
    },
    {
      "id": "tc-pub-p-30-3",
      "position": 3,
      "isPublic": true,
      "input": [
        []
      ],
      "expectedOutput": []
    }
  ],
  "invert-binary-tree-mirror": [
    {
      "id": "tc-pub-p-30-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          4,
          2,
          7,
          1,
          3,
          6,
          9
        ]
      ],
      "expectedOutput": [
        4,
        7,
        2,
        9,
        6,
        3,
        1
      ]
    },
    {
      "id": "tc-pub-p-30-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          2,
          1,
          3
        ]
      ],
      "expectedOutput": [
        2,
        3,
        1
      ]
    },
    {
      "id": "tc-pub-p-30-3",
      "position": 3,
      "isPublic": true,
      "input": [
        []
      ],
      "expectedOutput": []
    }
  ],
  "p-31": [
    {
      "id": "tc-pub-p-31-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          3,
          9,
          20,
          null,
          null,
          15,
          7
        ]
      ],
      "expectedOutput": [
        [
          3
        ],
        [
          9,
          20
        ],
        [
          15,
          7
        ]
      ]
    },
    {
      "id": "tc-pub-p-31-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          1
        ]
      ],
      "expectedOutput": [
        [
          1
        ]
      ]
    },
    {
      "id": "tc-pub-p-31-3",
      "position": 3,
      "isPublic": true,
      "input": [
        []
      ],
      "expectedOutput": []
    }
  ],
  "binary-tree-level-order-traversal": [
    {
      "id": "tc-pub-p-31-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          3,
          9,
          20,
          null,
          null,
          15,
          7
        ]
      ],
      "expectedOutput": [
        [
          3
        ],
        [
          9,
          20
        ],
        [
          15,
          7
        ]
      ]
    },
    {
      "id": "tc-pub-p-31-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          1
        ]
      ],
      "expectedOutput": [
        [
          1
        ]
      ]
    },
    {
      "id": "tc-pub-p-31-3",
      "position": 3,
      "isPublic": true,
      "input": [
        []
      ],
      "expectedOutput": []
    }
  ],
  "p-32": [
    {
      "id": "tc-pub-p-32-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          2,
          1,
          3
        ]
      ],
      "expectedOutput": true
    },
    {
      "id": "tc-pub-p-32-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          5,
          1,
          4,
          null,
          null,
          3,
          6
        ]
      ],
      "expectedOutput": false
    }
  ],
  "validate-binary-search-tree": [
    {
      "id": "tc-pub-p-32-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          2,
          1,
          3
        ]
      ],
      "expectedOutput": true
    },
    {
      "id": "tc-pub-p-32-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          5,
          1,
          4,
          null,
          null,
          3,
          6
        ]
      ],
      "expectedOutput": false
    }
  ],
  "p-33": [
    {
      "id": "tc-pub-p-33-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          3,
          5,
          1,
          6,
          2,
          0,
          8,
          null,
          null,
          7,
          4
        ],
        5,
        1
      ],
      "expectedOutput": 3
    },
    {
      "id": "tc-pub-p-33-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          3,
          5,
          1,
          6,
          2,
          0,
          8,
          null,
          null,
          7,
          4
        ],
        5,
        4
      ],
      "expectedOutput": 5
    }
  ],
  "lowest-common-ancestor-binary-tree": [
    {
      "id": "tc-pub-p-55-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          3,
          5,
          1,
          6,
          2,
          0,
          8
        ],
        5,
        1
      ],
      "expectedOutput": 3
    },
    {
      "id": "tc-pub-p-55-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          3,
          5,
          1,
          6,
          2,
          0,
          8
        ],
        5,
        4
      ],
      "expectedOutput": 5
    },
    {
      "id": "tc-pub-p-55-3",
      "position": 3,
      "isPublic": true,
      "input": [
        [
          1,
          2
        ],
        1,
        2
      ],
      "expectedOutput": 1
    }
  ],
  "p-34": [
    {
      "id": "tc-pub-p-34-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          "apple",
          "apple",
          "app",
          "app"
        ]
      ],
      "expectedOutput": [
        true,
        false,
        true
      ]
    }
  ],
  "implement-trie-prefix-tree": [
    {
      "id": "tc-pub-p-71-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          "apple"
        ],
        "apple"
      ],
      "expectedOutput": true
    },
    {
      "id": "tc-pub-p-71-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          "apple"
        ],
        "app"
      ],
      "expectedOutput": false
    },
    {
      "id": "tc-pub-p-71-3",
      "position": 3,
      "isPublic": true,
      "input": [
        [
          "apple",
          "app"
        ],
        "app"
      ],
      "expectedOutput": true
    }
  ],
  "p-35": [
    {
      "id": "tc-pub-p-35-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          [
            "o",
            "a",
            "a",
            "n"
          ],
          [
            "e",
            "t",
            "a",
            "e"
          ],
          [
            "i",
            "h",
            "k",
            "r"
          ],
          [
            "i",
            "f",
            "l",
            "v"
          ]
        ],
        [
          "oath",
          "pea",
          "eat",
          "rain"
        ]
      ],
      "expectedOutput": [
        "eat",
        "oath"
      ]
    }
  ],
  "word-search-ii-trie-backtracking": [
    {
      "id": "tc-pub-p-35-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          [
            "o",
            "a",
            "a",
            "n"
          ],
          [
            "e",
            "t",
            "a",
            "e"
          ],
          [
            "i",
            "h",
            "k",
            "r"
          ],
          [
            "i",
            "f",
            "l",
            "v"
          ]
        ],
        [
          "oath",
          "pea",
          "eat",
          "rain"
        ]
      ],
      "expectedOutput": [
        "eat",
        "oath"
      ]
    }
  ],
  "p-36": [
    {
      "id": "tc-pub-p-36-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          1,
          1,
          1,
          2,
          2,
          3
        ],
        2
      ],
      "expectedOutput": [
        1,
        2
      ]
    },
    {
      "id": "tc-pub-p-36-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          1
        ],
        1
      ],
      "expectedOutput": [
        1
      ]
    }
  ],
  "top-k-frequent-elements": [
    {
      "id": "tc-pub-p-67-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          1,
          1,
          1,
          2,
          2,
          3
        ],
        2
      ],
      "expectedOutput": [
        1,
        2
      ]
    },
    {
      "id": "tc-pub-p-67-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          1
        ],
        1
      ],
      "expectedOutput": [
        1
      ]
    },
    {
      "id": "tc-pub-p-67-3",
      "position": 3,
      "isPublic": true,
      "input": [
        [
          4,
          4,
          4,
          6,
          6,
          7
        ],
        1
      ],
      "expectedOutput": [
        4
      ]
    }
  ],
  "p-37": [
    {
      "id": "tc-pub-p-37-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          3,
          2,
          1,
          5,
          6,
          4
        ],
        2
      ],
      "expectedOutput": 5
    },
    {
      "id": "tc-pub-p-37-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          3,
          2,
          3,
          1,
          2,
          4,
          5,
          5,
          6
        ],
        4
      ],
      "expectedOutput": 4
    }
  ],
  "kth-largest-element-in-array": [
    {
      "id": "tc-pub-p-37-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          3,
          2,
          1,
          5,
          6,
          4
        ],
        2
      ],
      "expectedOutput": 5
    },
    {
      "id": "tc-pub-p-37-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          3,
          2,
          3,
          1,
          2,
          4,
          5,
          5,
          6
        ],
        4
      ],
      "expectedOutput": 4
    }
  ],
  "p-38": [
    {
      "id": "tc-pub-p-38-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          [
            "1",
            "1",
            "1",
            "1",
            "0"
          ],
          [
            "1",
            "1",
            "0",
            "1",
            "0"
          ],
          [
            "1",
            "1",
            "0",
            "0",
            "0"
          ],
          [
            "0",
            "0",
            "0",
            "0",
            "0"
          ]
        ]
      ],
      "expectedOutput": 1
    },
    {
      "id": "tc-pub-p-38-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          [
            "1",
            "1",
            "0",
            "0",
            "0"
          ],
          [
            "1",
            "1",
            "0",
            "0",
            "0"
          ],
          [
            "0",
            "0",
            "1",
            "0",
            "0"
          ],
          [
            "0",
            "0",
            "0",
            "1",
            "1"
          ]
        ]
      ],
      "expectedOutput": 3
    }
  ],
  "number-of-islands-grid-bfs-dfs": [
    {
      "id": "tc-pub-p-38-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          [
            "1",
            "1",
            "1",
            "1",
            "0"
          ],
          [
            "1",
            "1",
            "0",
            "1",
            "0"
          ],
          [
            "1",
            "1",
            "0",
            "0",
            "0"
          ],
          [
            "0",
            "0",
            "0",
            "0",
            "0"
          ]
        ]
      ],
      "expectedOutput": 1
    },
    {
      "id": "tc-pub-p-38-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          [
            "1",
            "1",
            "0",
            "0",
            "0"
          ],
          [
            "1",
            "1",
            "0",
            "0",
            "0"
          ],
          [
            "0",
            "0",
            "1",
            "0",
            "0"
          ],
          [
            "0",
            "0",
            "0",
            "1",
            "1"
          ]
        ]
      ],
      "expectedOutput": 3
    }
  ],
  "p-39": [
    {
      "id": "tc-pub-p-39-1",
      "position": 1,
      "isPublic": true,
      "input": [
        2,
        [
          [
            1,
            0
          ]
        ]
      ],
      "expectedOutput": true
    },
    {
      "id": "tc-pub-p-39-2",
      "position": 2,
      "isPublic": true,
      "input": [
        2,
        [
          [
            1,
            0
          ],
          [
            0,
            1
          ]
        ]
      ],
      "expectedOutput": false
    }
  ],
  "course-schedule-cycle-detection": [
    {
      "id": "tc-pub-p-39-1",
      "position": 1,
      "isPublic": true,
      "input": [
        2,
        [
          [
            1,
            0
          ]
        ]
      ],
      "expectedOutput": true
    },
    {
      "id": "tc-pub-p-39-2",
      "position": 2,
      "isPublic": true,
      "input": [
        2,
        [
          [
            1,
            0
          ],
          [
            0,
            1
          ]
        ]
      ],
      "expectedOutput": false
    }
  ],
  "p-40": [
    {
      "id": "tc-pub-p-40-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          [
            1,
            2,
            2,
            3,
            5
          ],
          [
            3,
            2,
            3,
            4,
            4
          ],
          [
            2,
            4,
            5,
            3,
            1
          ],
          [
            6,
            7,
            1,
            4,
            5
          ],
          [
            5,
            1,
            1,
            2,
            4
          ]
        ]
      ],
      "expectedOutput": [
        [
          0,
          4
        ],
        [
          1,
          3
        ],
        [
          1,
          4
        ],
        [
          2,
          2
        ],
        [
          3,
          0
        ],
        [
          3,
          1
        ],
        [
          4,
          0
        ]
      ]
    }
  ],
  "pacific-atlantic-water-flow": [
    {
      "id": "tc-pub-p-56-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          [
            1,
            2,
            2,
            3,
            5
          ],
          [
            3,
            2,
            3,
            4,
            4
          ],
          [
            2,
            4,
            5,
            3,
            1
          ],
          [
            6,
            7,
            1,
            4,
            5
          ],
          [
            5,
            1,
            1,
            2,
            4
          ]
        ]
      ],
      "expectedOutput": [
        [
          0,
          4
        ],
        [
          1,
          3
        ],
        [
          1,
          4
        ],
        [
          2,
          2
        ],
        [
          3,
          0
        ],
        [
          3,
          1
        ],
        [
          4,
          0
        ]
      ]
    },
    {
      "id": "tc-pub-p-56-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          [
            1
          ]
        ]
      ],
      "expectedOutput": [
        [
          0,
          0
        ]
      ]
    }
  ],
  "p-41": [
    {
      "id": "tc-pub-p-41-1",
      "position": 1,
      "isPublic": true,
      "input": [
        2
      ],
      "expectedOutput": 2
    },
    {
      "id": "tc-pub-p-41-2",
      "position": 2,
      "isPublic": true,
      "input": [
        3
      ],
      "expectedOutput": 3
    },
    {
      "id": "tc-pub-p-41-3",
      "position": 3,
      "isPublic": true,
      "input": [
        5
      ],
      "expectedOutput": 8
    }
  ],
  "climbing-stairs-memoization": [
    {
      "id": "tc-pub-p-41-1",
      "position": 1,
      "isPublic": true,
      "input": [
        2
      ],
      "expectedOutput": 2
    },
    {
      "id": "tc-pub-p-41-2",
      "position": 2,
      "isPublic": true,
      "input": [
        3
      ],
      "expectedOutput": 3
    },
    {
      "id": "tc-pub-p-41-3",
      "position": 3,
      "isPublic": true,
      "input": [
        5
      ],
      "expectedOutput": 8
    }
  ],
  "p-42": [
    {
      "id": "tc-pub-p-42-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          1,
          2,
          3,
          1
        ]
      ],
      "expectedOutput": 4
    },
    {
      "id": "tc-pub-p-42-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          2,
          7,
          9,
          3,
          1
        ]
      ],
      "expectedOutput": 12
    },
    {
      "id": "tc-pub-p-42-3",
      "position": 3,
      "isPublic": true,
      "input": [
        [
          0
        ]
      ],
      "expectedOutput": 0
    }
  ],
  "house-robber-linear-dp": [
    {
      "id": "tc-pub-p-42-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          1,
          2,
          3,
          1
        ]
      ],
      "expectedOutput": 4
    },
    {
      "id": "tc-pub-p-42-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          2,
          7,
          9,
          3,
          1
        ]
      ],
      "expectedOutput": 12
    },
    {
      "id": "tc-pub-p-42-3",
      "position": 3,
      "isPublic": true,
      "input": [
        [
          0
        ]
      ],
      "expectedOutput": 0
    }
  ],
  "p-43": [
    {
      "id": "tc-pub-p-43-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          1,
          2,
          5
        ],
        11
      ],
      "expectedOutput": 3
    },
    {
      "id": "tc-pub-p-43-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          2
        ],
        3
      ],
      "expectedOutput": -1
    },
    {
      "id": "tc-pub-p-43-3",
      "position": 3,
      "isPublic": true,
      "input": [
        [
          1
        ],
        0
      ],
      "expectedOutput": 0
    }
  ],
  "coin-change-fewest-coins": [
    {
      "id": "tc-pub-p-43-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          1,
          2,
          5
        ],
        11
      ],
      "expectedOutput": 3
    },
    {
      "id": "tc-pub-p-43-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          2
        ],
        3
      ],
      "expectedOutput": -1
    },
    {
      "id": "tc-pub-p-43-3",
      "position": 3,
      "isPublic": true,
      "input": [
        [
          1
        ],
        0
      ],
      "expectedOutput": 0
    }
  ],
  "p-44": [
    {
      "id": "tc-pub-p-44-1",
      "position": 1,
      "isPublic": true,
      "input": [
        "abcde",
        "ace"
      ],
      "expectedOutput": 3
    },
    {
      "id": "tc-pub-p-44-2",
      "position": 2,
      "isPublic": true,
      "input": [
        "abc",
        "abc"
      ],
      "expectedOutput": 3
    },
    {
      "id": "tc-pub-p-44-3",
      "position": 3,
      "isPublic": true,
      "input": [
        "abc",
        "def"
      ],
      "expectedOutput": 0
    }
  ],
  "longest-common-subsequence-2d-dp": [
    {
      "id": "tc-pub-p-44-1",
      "position": 1,
      "isPublic": true,
      "input": [
        "abcde",
        "ace"
      ],
      "expectedOutput": 3
    },
    {
      "id": "tc-pub-p-44-2",
      "position": 2,
      "isPublic": true,
      "input": [
        "abc",
        "abc"
      ],
      "expectedOutput": 3
    },
    {
      "id": "tc-pub-p-44-3",
      "position": 3,
      "isPublic": true,
      "input": [
        "abc",
        "def"
      ],
      "expectedOutput": 0
    }
  ],
  "p-45": [
    {
      "id": "tc-pub-p-45-1",
      "position": 1,
      "isPublic": true,
      "input": [
        3,
        7
      ],
      "expectedOutput": 28
    },
    {
      "id": "tc-pub-p-45-2",
      "position": 2,
      "isPublic": true,
      "input": [
        3,
        2
      ],
      "expectedOutput": 3
    },
    {
      "id": "tc-pub-p-45-3",
      "position": 3,
      "isPublic": true,
      "input": [
        1,
        1
      ],
      "expectedOutput": 1
    }
  ],
  "unique-paths-grid-combinatorics": [
    {
      "id": "tc-pub-p-45-1",
      "position": 1,
      "isPublic": true,
      "input": [
        3,
        7
      ],
      "expectedOutput": 28
    },
    {
      "id": "tc-pub-p-45-2",
      "position": 2,
      "isPublic": true,
      "input": [
        3,
        2
      ],
      "expectedOutput": 3
    },
    {
      "id": "tc-pub-p-45-3",
      "position": 3,
      "isPublic": true,
      "input": [
        1,
        1
      ],
      "expectedOutput": 1
    }
  ],
  "p-46": [
    {
      "id": "tc-pub-p-46-1",
      "position": 1,
      "isPublic": true,
      "input": [
        "horse",
        "ros"
      ],
      "expectedOutput": 3
    },
    {
      "id": "tc-pub-p-46-2",
      "position": 2,
      "isPublic": true,
      "input": [
        "intention",
        "execution"
      ],
      "expectedOutput": 5
    },
    {
      "id": "tc-pub-p-46-3",
      "position": 3,
      "isPublic": true,
      "input": [
        "",
        "a"
      ],
      "expectedOutput": 1
    }
  ],
  "edit-distance-levenshtein": [
    {
      "id": "tc-pub-p-46-1",
      "position": 1,
      "isPublic": true,
      "input": [
        "horse",
        "ros"
      ],
      "expectedOutput": 3
    },
    {
      "id": "tc-pub-p-46-2",
      "position": 2,
      "isPublic": true,
      "input": [
        "intention",
        "execution"
      ],
      "expectedOutput": 5
    },
    {
      "id": "tc-pub-p-46-3",
      "position": 3,
      "isPublic": true,
      "input": [
        "",
        "a"
      ],
      "expectedOutput": 1
    }
  ],
  "p-47": [
    {
      "id": "tc-pub-p-47-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          1,
          2,
          3
        ]
      ],
      "expectedOutput": [
        [],
        [
          1
        ],
        [
          1,
          2
        ],
        [
          1,
          2,
          3
        ],
        [
          1,
          3
        ],
        [
          2
        ],
        [
          2,
          3
        ],
        [
          3
        ]
      ]
    },
    {
      "id": "tc-pub-p-47-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          0
        ]
      ],
      "expectedOutput": [
        [],
        [
          0
        ]
      ]
    }
  ],
  "subsets-power-set-backtracking": [
    {
      "id": "tc-pub-p-47-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          1,
          2,
          3
        ]
      ],
      "expectedOutput": [
        [],
        [
          1
        ],
        [
          1,
          2
        ],
        [
          1,
          2,
          3
        ],
        [
          1,
          3
        ],
        [
          2
        ],
        [
          2,
          3
        ],
        [
          3
        ]
      ]
    },
    {
      "id": "tc-pub-p-47-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          0
        ]
      ],
      "expectedOutput": [
        [],
        [
          0
        ]
      ]
    }
  ],
  "p-48": [
    {
      "id": "tc-pub-p-48-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          2,
          3,
          6,
          7
        ],
        7
      ],
      "expectedOutput": [
        [
          2,
          2,
          3
        ],
        [
          7
        ]
      ]
    },
    {
      "id": "tc-pub-p-48-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          2,
          3,
          5
        ],
        8
      ],
      "expectedOutput": [
        [
          2,
          2,
          2,
          2
        ],
        [
          2,
          3,
          3
        ],
        [
          3,
          5
        ]
      ]
    }
  ],
  "combination-sum-target": [
    {
      "id": "tc-pub-p-48-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          2,
          3,
          6,
          7
        ],
        7
      ],
      "expectedOutput": [
        [
          2,
          2,
          3
        ],
        [
          7
        ]
      ]
    },
    {
      "id": "tc-pub-p-48-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          2,
          3,
          5
        ],
        8
      ],
      "expectedOutput": [
        [
          2,
          2,
          2,
          2
        ],
        [
          2,
          3,
          3
        ],
        [
          3,
          5
        ]
      ]
    }
  ],
  "p-49": [
    {
      "id": "tc-pub-p-49-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          1,
          2,
          3
        ]
      ],
      "expectedOutput": [
        [
          1,
          2,
          3
        ],
        [
          1,
          3,
          2
        ],
        [
          2,
          1,
          3
        ],
        [
          2,
          3,
          1
        ],
        [
          3,
          1,
          2
        ],
        [
          3,
          2,
          1
        ]
      ]
    },
    {
      "id": "tc-pub-p-49-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          0,
          1
        ]
      ],
      "expectedOutput": [
        [
          0,
          1
        ],
        [
          1,
          0
        ]
      ]
    }
  ],
  "permutations-full-backtracking": [
    {
      "id": "tc-pub-p-49-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          1,
          2,
          3
        ]
      ],
      "expectedOutput": [
        [
          1,
          2,
          3
        ],
        [
          1,
          3,
          2
        ],
        [
          2,
          1,
          3
        ],
        [
          2,
          3,
          1
        ],
        [
          3,
          1,
          2
        ],
        [
          3,
          2,
          1
        ]
      ]
    },
    {
      "id": "tc-pub-p-49-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          0,
          1
        ]
      ],
      "expectedOutput": [
        [
          0,
          1
        ],
        [
          1,
          0
        ]
      ]
    }
  ],
  "p-50": [
    {
      "id": "tc-pub-p-50-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          2,
          2,
          1
        ]
      ],
      "expectedOutput": 1
    },
    {
      "id": "tc-pub-p-50-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          4,
          1,
          2,
          1,
          2
        ]
      ],
      "expectedOutput": 4
    },
    {
      "id": "tc-pub-p-50-3",
      "position": 3,
      "isPublic": true,
      "input": [
        [
          1
        ]
      ],
      "expectedOutput": 1
    }
  ],
  "single-number-xor-trick": [
    {
      "id": "tc-pub-p-50-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          2,
          2,
          1
        ]
      ],
      "expectedOutput": 1
    },
    {
      "id": "tc-pub-p-50-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          4,
          1,
          2,
          1,
          2
        ]
      ],
      "expectedOutput": 4
    },
    {
      "id": "tc-pub-p-50-3",
      "position": 3,
      "isPublic": true,
      "input": [
        [
          1
        ]
      ],
      "expectedOutput": 1
    }
  ],
  "p-51": [
    {
      "id": "tc-pub-p-51-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          [
            1,
            2,
            3
          ],
          [
            4,
            5,
            6
          ],
          [
            7,
            8,
            9
          ]
        ]
      ],
      "expectedOutput": [
        1,
        2,
        3,
        6,
        9,
        8,
        7,
        4,
        5
      ]
    },
    {
      "id": "tc-pub-p-51-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          [
            1,
            2,
            3,
            4
          ],
          [
            5,
            6,
            7,
            8
          ],
          [
            9,
            10,
            11,
            12
          ]
        ]
      ],
      "expectedOutput": [
        1,
        2,
        3,
        4,
        8,
        12,
        11,
        10,
        9,
        5,
        6,
        7
      ]
    },
    {
      "id": "tc-pub-p-51-3",
      "position": 3,
      "isPublic": true,
      "input": [
        [
          [
            1
          ]
        ]
      ],
      "expectedOutput": [
        1
      ]
    }
  ],
  "spiral-matrix": [
    {
      "id": "tc-pub-p-51-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          [
            1,
            2,
            3
          ],
          [
            4,
            5,
            6
          ],
          [
            7,
            8,
            9
          ]
        ]
      ],
      "expectedOutput": [
        1,
        2,
        3,
        6,
        9,
        8,
        7,
        4,
        5
      ]
    },
    {
      "id": "tc-pub-p-51-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          [
            1,
            2,
            3,
            4
          ],
          [
            5,
            6,
            7,
            8
          ],
          [
            9,
            10,
            11,
            12
          ]
        ]
      ],
      "expectedOutput": [
        1,
        2,
        3,
        4,
        8,
        12,
        11,
        10,
        9,
        5,
        6,
        7
      ]
    },
    {
      "id": "tc-pub-p-51-3",
      "position": 3,
      "isPublic": true,
      "input": [
        [
          [
            1
          ]
        ]
      ],
      "expectedOutput": [
        1
      ]
    }
  ],
  "p-52": [
    {
      "id": "tc-pub-p-52-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          [
            "A",
            "B",
            "C",
            "E"
          ],
          [
            "S",
            "F",
            "C",
            "S"
          ],
          [
            "A",
            "D",
            "E",
            "E"
          ]
        ],
        "ABCCED"
      ],
      "expectedOutput": true
    },
    {
      "id": "tc-pub-p-52-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          [
            "A",
            "B",
            "C",
            "E"
          ],
          [
            "S",
            "F",
            "C",
            "S"
          ],
          [
            "A",
            "D",
            "E",
            "E"
          ]
        ],
        "SEE"
      ],
      "expectedOutput": true
    },
    {
      "id": "tc-pub-p-52-3",
      "position": 3,
      "isPublic": true,
      "input": [
        [
          [
            "A",
            "B",
            "C",
            "E"
          ],
          [
            "S",
            "F",
            "C",
            "S"
          ],
          [
            "A",
            "D",
            "E",
            "E"
          ]
        ],
        "ABCB"
      ],
      "expectedOutput": false
    }
  ],
  "word-search": [
    {
      "id": "tc-pub-p-52-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          [
            "A",
            "B",
            "C",
            "E"
          ],
          [
            "S",
            "F",
            "C",
            "S"
          ],
          [
            "A",
            "D",
            "E",
            "E"
          ]
        ],
        "ABCCED"
      ],
      "expectedOutput": true
    },
    {
      "id": "tc-pub-p-52-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          [
            "A",
            "B",
            "C",
            "E"
          ],
          [
            "S",
            "F",
            "C",
            "S"
          ],
          [
            "A",
            "D",
            "E",
            "E"
          ]
        ],
        "SEE"
      ],
      "expectedOutput": true
    },
    {
      "id": "tc-pub-p-52-3",
      "position": 3,
      "isPublic": true,
      "input": [
        [
          [
            "A",
            "B",
            "C",
            "E"
          ],
          [
            "S",
            "F",
            "C",
            "S"
          ],
          [
            "A",
            "D",
            "E",
            "E"
          ]
        ],
        "ABCB"
      ],
      "expectedOutput": false
    }
  ],
  "p-53": [
    {
      "id": "tc-pub-p-53-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          2,
          3,
          2
        ]
      ],
      "expectedOutput": 3
    },
    {
      "id": "tc-pub-p-53-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          1,
          2,
          3,
          1
        ]
      ],
      "expectedOutput": 4
    },
    {
      "id": "tc-pub-p-53-3",
      "position": 3,
      "isPublic": true,
      "input": [
        [
          1,
          2,
          3
        ]
      ],
      "expectedOutput": 3
    },
    {
      "id": "tc-pub-p-53-4",
      "position": 4,
      "isPublic": true,
      "input": [
        [
          1
        ]
      ],
      "expectedOutput": 1
    }
  ],
  "house-robber-ii": [
    {
      "id": "tc-pub-p-53-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          2,
          3,
          2
        ]
      ],
      "expectedOutput": 3
    },
    {
      "id": "tc-pub-p-53-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          1,
          2,
          3,
          1
        ]
      ],
      "expectedOutput": 4
    },
    {
      "id": "tc-pub-p-53-3",
      "position": 3,
      "isPublic": true,
      "input": [
        [
          1,
          2,
          3
        ]
      ],
      "expectedOutput": 3
    },
    {
      "id": "tc-pub-p-53-4",
      "position": 4,
      "isPublic": true,
      "input": [
        [
          1
        ]
      ],
      "expectedOutput": 1
    }
  ],
  "p-54": [
    {
      "id": "tc-pub-p-54-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          3,
          1,
          4,
          null,
          2
        ],
        1
      ],
      "expectedOutput": 1
    },
    {
      "id": "tc-pub-p-54-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          5,
          3,
          6,
          2,
          4,
          null,
          null,
          1
        ],
        3
      ],
      "expectedOutput": 3
    },
    {
      "id": "tc-pub-p-54-3",
      "position": 3,
      "isPublic": true,
      "input": [
        [
          10,
          5,
          15
        ],
        2
      ],
      "expectedOutput": 10
    }
  ],
  "kth-smallest-element-in-a-bst": [
    {
      "id": "tc-pub-p-54-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          3,
          1,
          4,
          null,
          2
        ],
        1
      ],
      "expectedOutput": 1
    },
    {
      "id": "tc-pub-p-54-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          5,
          3,
          6,
          2,
          4,
          null,
          null,
          1
        ],
        3
      ],
      "expectedOutput": 3
    },
    {
      "id": "tc-pub-p-54-3",
      "position": 3,
      "isPublic": true,
      "input": [
        [
          10,
          5,
          15
        ],
        2
      ],
      "expectedOutput": 10
    }
  ],
  "p-55": [
    {
      "id": "tc-pub-p-55-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          3,
          5,
          1,
          6,
          2,
          0,
          8
        ],
        5,
        1
      ],
      "expectedOutput": 3
    },
    {
      "id": "tc-pub-p-55-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          3,
          5,
          1,
          6,
          2,
          0,
          8
        ],
        5,
        4
      ],
      "expectedOutput": 5
    },
    {
      "id": "tc-pub-p-55-3",
      "position": 3,
      "isPublic": true,
      "input": [
        [
          1,
          2
        ],
        1,
        2
      ],
      "expectedOutput": 1
    }
  ],
  "p-56": [
    {
      "id": "tc-pub-p-56-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          [
            1,
            2,
            2,
            3,
            5
          ],
          [
            3,
            2,
            3,
            4,
            4
          ],
          [
            2,
            4,
            5,
            3,
            1
          ],
          [
            6,
            7,
            1,
            4,
            5
          ],
          [
            5,
            1,
            1,
            2,
            4
          ]
        ]
      ],
      "expectedOutput": [
        [
          0,
          4
        ],
        [
          1,
          3
        ],
        [
          1,
          4
        ],
        [
          2,
          2
        ],
        [
          3,
          0
        ],
        [
          3,
          1
        ],
        [
          4,
          0
        ]
      ]
    },
    {
      "id": "tc-pub-p-56-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          [
            1
          ]
        ]
      ],
      "expectedOutput": [
        [
          0,
          0
        ]
      ]
    }
  ],
  "p-57": [
    {
      "id": "tc-pub-p-57-1",
      "position": 1,
      "isPublic": true,
      "input": [
        2,
        [
          [
            1,
            0
          ]
        ]
      ],
      "expectedOutput": [
        0,
        1
      ]
    },
    {
      "id": "tc-pub-p-57-2",
      "position": 2,
      "isPublic": true,
      "input": [
        4,
        [
          [
            1,
            0
          ],
          [
            2,
            0
          ],
          [
            3,
            1
          ],
          [
            3,
            2
          ]
        ]
      ],
      "expectedOutput": [
        0,
        1,
        2,
        3
      ]
    },
    {
      "id": "tc-pub-p-57-3",
      "position": 3,
      "isPublic": true,
      "input": [
        1,
        []
      ],
      "expectedOutput": [
        0
      ]
    }
  ],
  "course-schedule-ii": [
    {
      "id": "tc-pub-p-57-1",
      "position": 1,
      "isPublic": true,
      "input": [
        2,
        [
          [
            1,
            0
          ]
        ]
      ],
      "expectedOutput": [
        0,
        1
      ]
    },
    {
      "id": "tc-pub-p-57-2",
      "position": 2,
      "isPublic": true,
      "input": [
        4,
        [
          [
            1,
            0
          ],
          [
            2,
            0
          ],
          [
            3,
            1
          ],
          [
            3,
            2
          ]
        ]
      ],
      "expectedOutput": [
        0,
        1,
        2,
        3
      ]
    },
    {
      "id": "tc-pub-p-57-3",
      "position": 3,
      "isPublic": true,
      "input": [
        1,
        []
      ],
      "expectedOutput": [
        0
      ]
    }
  ],
  "p-58": [
    {
      "id": "tc-pub-p-58-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          [
            0,
            30
          ],
          [
            5,
            10
          ],
          [
            15,
            20
          ]
        ]
      ],
      "expectedOutput": 2
    },
    {
      "id": "tc-pub-p-58-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          [
            7,
            10
          ],
          [
            2,
            4
          ]
        ]
      ],
      "expectedOutput": 1
    },
    {
      "id": "tc-pub-p-58-3",
      "position": 3,
      "isPublic": true,
      "input": [
        [
          [
            1,
            5
          ],
          [
            5,
            10
          ]
        ]
      ],
      "expectedOutput": 1
    }
  ],
  "meeting-rooms-ii": [
    {
      "id": "tc-pub-p-58-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          [
            0,
            30
          ],
          [
            5,
            10
          ],
          [
            15,
            20
          ]
        ]
      ],
      "expectedOutput": 2
    },
    {
      "id": "tc-pub-p-58-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          [
            7,
            10
          ],
          [
            2,
            4
          ]
        ]
      ],
      "expectedOutput": 1
    },
    {
      "id": "tc-pub-p-58-3",
      "position": 3,
      "isPublic": true,
      "input": [
        [
          [
            1,
            5
          ],
          [
            5,
            10
          ]
        ]
      ],
      "expectedOutput": 1
    }
  ],
  "p-59": [
    {
      "id": "tc-pub-p-59-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          [
            1,
            2
          ],
          [
            2,
            3
          ],
          [
            3,
            4
          ],
          [
            1,
            3
          ]
        ]
      ],
      "expectedOutput": 1
    },
    {
      "id": "tc-pub-p-59-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          [
            1,
            2
          ],
          [
            1,
            2
          ],
          [
            1,
            2
          ]
        ]
      ],
      "expectedOutput": 2
    },
    {
      "id": "tc-pub-p-59-3",
      "position": 3,
      "isPublic": true,
      "input": [
        [
          [
            1,
            2
          ],
          [
            2,
            3
          ]
        ]
      ],
      "expectedOutput": 0
    }
  ],
  "non-overlapping-intervals": [
    {
      "id": "tc-pub-p-59-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          [
            1,
            2
          ],
          [
            2,
            3
          ],
          [
            3,
            4
          ],
          [
            1,
            3
          ]
        ]
      ],
      "expectedOutput": 1
    },
    {
      "id": "tc-pub-p-59-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          [
            1,
            2
          ],
          [
            1,
            2
          ],
          [
            1,
            2
          ]
        ]
      ],
      "expectedOutput": 2
    },
    {
      "id": "tc-pub-p-59-3",
      "position": 3,
      "isPublic": true,
      "input": [
        [
          [
            1,
            2
          ],
          [
            2,
            3
          ]
        ]
      ],
      "expectedOutput": 0
    }
  ],
  "p-60": [
    {
      "id": "tc-pub-p-60-1",
      "position": 1,
      "isPublic": true,
      "input": [
        "ADOBECODEBANC",
        "ABC"
      ],
      "expectedOutput": "BANC"
    },
    {
      "id": "tc-pub-p-60-2",
      "position": 2,
      "isPublic": true,
      "input": [
        "a",
        "a"
      ],
      "expectedOutput": "a"
    },
    {
      "id": "tc-pub-p-60-3",
      "position": 3,
      "isPublic": true,
      "input": [
        "a",
        "aa"
      ],
      "expectedOutput": ""
    }
  ],
  "minimum-window-substring": [
    {
      "id": "tc-pub-p-60-1",
      "position": 1,
      "isPublic": true,
      "input": [
        "ADOBECODEBANC",
        "ABC"
      ],
      "expectedOutput": "BANC"
    },
    {
      "id": "tc-pub-p-60-2",
      "position": 2,
      "isPublic": true,
      "input": [
        "a",
        "a"
      ],
      "expectedOutput": "a"
    },
    {
      "id": "tc-pub-p-60-3",
      "position": 3,
      "isPublic": true,
      "input": [
        "a",
        "aa"
      ],
      "expectedOutput": ""
    }
  ],
  "p-61": [
    {
      "id": "tc-pub-p-61-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          0,
          1,
          0,
          2,
          1,
          0,
          1,
          3,
          2,
          1,
          2,
          1
        ]
      ],
      "expectedOutput": 6
    },
    {
      "id": "tc-pub-p-61-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          4,
          2,
          0,
          3,
          2,
          5
        ]
      ],
      "expectedOutput": 9
    },
    {
      "id": "tc-pub-p-61-3",
      "position": 3,
      "isPublic": true,
      "input": [
        [
          1,
          2
        ]
      ],
      "expectedOutput": 0
    }
  ],
  "trapping-rain-water": [
    {
      "id": "tc-pub-p-61-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          0,
          1,
          0,
          2,
          1,
          0,
          1,
          3,
          2,
          1,
          2,
          1
        ]
      ],
      "expectedOutput": 6
    },
    {
      "id": "tc-pub-p-61-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          4,
          2,
          0,
          3,
          2,
          5
        ]
      ],
      "expectedOutput": 9
    },
    {
      "id": "tc-pub-p-61-3",
      "position": 3,
      "isPublic": true,
      "input": [
        [
          1,
          2
        ]
      ],
      "expectedOutput": 0
    }
  ],
  "p-62": [
    {
      "id": "tc-pub-p-62-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          1,
          3,
          -1,
          -3,
          5,
          3,
          6,
          7
        ],
        3
      ],
      "expectedOutput": [
        3,
        3,
        5,
        5,
        6,
        7
      ]
    },
    {
      "id": "tc-pub-p-62-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          1
        ],
        1
      ],
      "expectedOutput": [
        1
      ]
    },
    {
      "id": "tc-pub-p-62-3",
      "position": 3,
      "isPublic": true,
      "input": [
        [
          1,
          -1
        ],
        1
      ],
      "expectedOutput": [
        1,
        -1
      ]
    }
  ],
  "sliding-window-maximum": [
    {
      "id": "tc-pub-p-62-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          1,
          3,
          -1,
          -3,
          5,
          3,
          6,
          7
        ],
        3
      ],
      "expectedOutput": [
        3,
        3,
        5,
        5,
        6,
        7
      ]
    },
    {
      "id": "tc-pub-p-62-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          1
        ],
        1
      ],
      "expectedOutput": [
        1
      ]
    },
    {
      "id": "tc-pub-p-62-3",
      "position": 3,
      "isPublic": true,
      "input": [
        [
          1,
          -1
        ],
        1
      ],
      "expectedOutput": [
        1,
        -1
      ]
    }
  ],
  "p-63": [
    {
      "id": "tc-pub-p-63-1",
      "position": 1,
      "isPublic": true,
      "input": [
        "leetcode",
        [
          "leet",
          "code"
        ]
      ],
      "expectedOutput": true
    },
    {
      "id": "tc-pub-p-63-2",
      "position": 2,
      "isPublic": true,
      "input": [
        "applepenapple",
        [
          "apple",
          "pen"
        ]
      ],
      "expectedOutput": true
    },
    {
      "id": "tc-pub-p-63-3",
      "position": 3,
      "isPublic": true,
      "input": [
        "catsandog",
        [
          "cats",
          "dog",
          "sand",
          "and",
          "cat"
        ]
      ],
      "expectedOutput": false
    }
  ],
  "word-break": [
    {
      "id": "tc-pub-p-63-1",
      "position": 1,
      "isPublic": true,
      "input": [
        "leetcode",
        [
          "leet",
          "code"
        ]
      ],
      "expectedOutput": true
    },
    {
      "id": "tc-pub-p-63-2",
      "position": 2,
      "isPublic": true,
      "input": [
        "applepenapple",
        [
          "apple",
          "pen"
        ]
      ],
      "expectedOutput": true
    },
    {
      "id": "tc-pub-p-63-3",
      "position": 3,
      "isPublic": true,
      "input": [
        "catsandog",
        [
          "cats",
          "dog",
          "sand",
          "and",
          "cat"
        ]
      ],
      "expectedOutput": false
    }
  ],
  "p-64": [
    {
      "id": "tc-pub-p-64-1",
      "position": 1,
      "isPublic": true,
      "input": [
        5,
        [
          1,
          2,
          5
        ]
      ],
      "expectedOutput": 4
    },
    {
      "id": "tc-pub-p-64-2",
      "position": 2,
      "isPublic": true,
      "input": [
        3,
        [
          2
        ]
      ],
      "expectedOutput": 0
    },
    {
      "id": "tc-pub-p-64-3",
      "position": 3,
      "isPublic": true,
      "input": [
        10,
        [
          10
        ]
      ],
      "expectedOutput": 1
    }
  ],
  "coin-change-ii": [
    {
      "id": "tc-pub-p-64-1",
      "position": 1,
      "isPublic": true,
      "input": [
        5,
        [
          1,
          2,
          5
        ]
      ],
      "expectedOutput": 4
    },
    {
      "id": "tc-pub-p-64-2",
      "position": 2,
      "isPublic": true,
      "input": [
        3,
        [
          2
        ]
      ],
      "expectedOutput": 0
    },
    {
      "id": "tc-pub-p-64-3",
      "position": 3,
      "isPublic": true,
      "input": [
        10,
        [
          10
        ]
      ],
      "expectedOutput": 1
    }
  ],
  "p-65": [
    {
      "id": "tc-pub-p-65-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          10,
          9,
          2,
          5,
          3,
          7,
          101,
          18
        ]
      ],
      "expectedOutput": 4
    },
    {
      "id": "tc-pub-p-65-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          0,
          1,
          0,
          3,
          2,
          3
        ]
      ],
      "expectedOutput": 4
    },
    {
      "id": "tc-pub-p-65-3",
      "position": 3,
      "isPublic": true,
      "input": [
        [
          7,
          7,
          7,
          7,
          7,
          7,
          7
        ]
      ],
      "expectedOutput": 1
    }
  ],
  "longest-increasing-subsequence": [
    {
      "id": "tc-pub-p-65-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          10,
          9,
          2,
          5,
          3,
          7,
          101,
          18
        ]
      ],
      "expectedOutput": 4
    },
    {
      "id": "tc-pub-p-65-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          0,
          1,
          0,
          3,
          2,
          3
        ]
      ],
      "expectedOutput": 4
    },
    {
      "id": "tc-pub-p-65-3",
      "position": 3,
      "isPublic": true,
      "input": [
        [
          7,
          7,
          7,
          7,
          7,
          7,
          7
        ]
      ],
      "expectedOutput": 1
    }
  ],
  "p-66": [
    {
      "id": "tc-pub-p-66-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          1,
          2,
          2
        ]
      ],
      "expectedOutput": [
        [],
        [
          1
        ],
        [
          1,
          2
        ],
        [
          1,
          2,
          2
        ],
        [
          2
        ],
        [
          2,
          2
        ]
      ]
    },
    {
      "id": "tc-pub-p-66-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          0
        ]
      ],
      "expectedOutput": [
        [],
        [
          0
        ]
      ]
    }
  ],
  "subsets-ii": [
    {
      "id": "tc-pub-p-66-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          1,
          2,
          2
        ]
      ],
      "expectedOutput": [
        [],
        [
          1
        ],
        [
          1,
          2
        ],
        [
          1,
          2,
          2
        ],
        [
          2
        ],
        [
          2,
          2
        ]
      ]
    },
    {
      "id": "tc-pub-p-66-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          0
        ]
      ],
      "expectedOutput": [
        [],
        [
          0
        ]
      ]
    }
  ],
  "p-67": [
    {
      "id": "tc-pub-p-67-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          1,
          1,
          1,
          2,
          2,
          3
        ],
        2
      ],
      "expectedOutput": [
        1,
        2
      ]
    },
    {
      "id": "tc-pub-p-67-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          1
        ],
        1
      ],
      "expectedOutput": [
        1
      ]
    },
    {
      "id": "tc-pub-p-67-3",
      "position": 3,
      "isPublic": true,
      "input": [
        [
          4,
          4,
          4,
          6,
          6,
          7
        ],
        1
      ],
      "expectedOutput": [
        4
      ]
    }
  ],
  "p-68": [
    {
      "id": "tc-pub-p-68-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          73,
          74,
          75,
          71,
          69,
          72,
          76,
          73
        ]
      ],
      "expectedOutput": [
        1,
        1,
        4,
        2,
        1,
        1,
        0,
        0
      ]
    },
    {
      "id": "tc-pub-p-68-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          30,
          40,
          50,
          60
        ]
      ],
      "expectedOutput": [
        1,
        1,
        1,
        0
      ]
    },
    {
      "id": "tc-pub-p-68-3",
      "position": 3,
      "isPublic": true,
      "input": [
        [
          30,
          60,
          90
        ]
      ],
      "expectedOutput": [
        1,
        1,
        0
      ]
    }
  ],
  "daily-temperatures": [
    {
      "id": "tc-pub-p-68-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          73,
          74,
          75,
          71,
          69,
          72,
          76,
          73
        ]
      ],
      "expectedOutput": [
        1,
        1,
        4,
        2,
        1,
        1,
        0,
        0
      ]
    },
    {
      "id": "tc-pub-p-68-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          30,
          40,
          50,
          60
        ]
      ],
      "expectedOutput": [
        1,
        1,
        1,
        0
      ]
    },
    {
      "id": "tc-pub-p-68-3",
      "position": 3,
      "isPublic": true,
      "input": [
        [
          30,
          60,
          90
        ]
      ],
      "expectedOutput": [
        1,
        1,
        0
      ]
    }
  ],
  "p-69": [
    {
      "id": "tc-pub-p-69-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          [
            2,
            1,
            1
          ],
          [
            1,
            1,
            0
          ],
          [
            0,
            1,
            1
          ]
        ]
      ],
      "expectedOutput": 4
    },
    {
      "id": "tc-pub-p-69-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          [
            2,
            1,
            1
          ],
          [
            0,
            1,
            1
          ],
          [
            1,
            0,
            1
          ]
        ]
      ],
      "expectedOutput": -1
    },
    {
      "id": "tc-pub-p-69-3",
      "position": 3,
      "isPublic": true,
      "input": [
        [
          [
            0,
            2
          ]
        ]
      ],
      "expectedOutput": 0
    }
  ],
  "rotting-oranges": [
    {
      "id": "tc-pub-p-69-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          [
            2,
            1,
            1
          ],
          [
            1,
            1,
            0
          ],
          [
            0,
            1,
            1
          ]
        ]
      ],
      "expectedOutput": 4
    },
    {
      "id": "tc-pub-p-69-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          [
            2,
            1,
            1
          ],
          [
            0,
            1,
            1
          ],
          [
            1,
            0,
            1
          ]
        ]
      ],
      "expectedOutput": -1
    },
    {
      "id": "tc-pub-p-69-3",
      "position": 3,
      "isPublic": true,
      "input": [
        [
          [
            0,
            2
          ]
        ]
      ],
      "expectedOutput": 0
    }
  ],
  "p-70": [
    {
      "id": "tc-pub-p-70-1",
      "position": 1,
      "isPublic": true,
      "input": [
        5,
        [
          [
            0,
            1
          ],
          [
            1,
            2
          ],
          [
            3,
            4
          ]
        ]
      ],
      "expectedOutput": 2
    },
    {
      "id": "tc-pub-p-70-2",
      "position": 2,
      "isPublic": true,
      "input": [
        5,
        [
          [
            0,
            1
          ],
          [
            1,
            2
          ],
          [
            2,
            3
          ],
          [
            3,
            4
          ]
        ]
      ],
      "expectedOutput": 1
    },
    {
      "id": "tc-pub-p-70-3",
      "position": 3,
      "isPublic": true,
      "input": [
        4,
        []
      ],
      "expectedOutput": 4
    }
  ],
  "number-of-connected-components": [
    {
      "id": "tc-pub-p-70-1",
      "position": 1,
      "isPublic": true,
      "input": [
        5,
        [
          [
            0,
            1
          ],
          [
            1,
            2
          ],
          [
            3,
            4
          ]
        ]
      ],
      "expectedOutput": 2
    },
    {
      "id": "tc-pub-p-70-2",
      "position": 2,
      "isPublic": true,
      "input": [
        5,
        [
          [
            0,
            1
          ],
          [
            1,
            2
          ],
          [
            2,
            3
          ],
          [
            3,
            4
          ]
        ]
      ],
      "expectedOutput": 1
    },
    {
      "id": "tc-pub-p-70-3",
      "position": 3,
      "isPublic": true,
      "input": [
        4,
        []
      ],
      "expectedOutput": 4
    }
  ],
  "p-71": [
    {
      "id": "tc-pub-p-71-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          "apple"
        ],
        "apple"
      ],
      "expectedOutput": true
    },
    {
      "id": "tc-pub-p-71-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          "apple"
        ],
        "app"
      ],
      "expectedOutput": false
    },
    {
      "id": "tc-pub-p-71-3",
      "position": 3,
      "isPublic": true,
      "input": [
        [
          "apple",
          "app"
        ],
        "app"
      ],
      "expectedOutput": true
    }
  ],
  "p-72": [
    {
      "id": "tc-pub-p-72-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          [
            1,
            4,
            5
          ],
          [
            1,
            3,
            4
          ],
          [
            2,
            6
          ]
        ]
      ],
      "expectedOutput": [
        1,
        1,
        2,
        3,
        4,
        4,
        5,
        6
      ]
    },
    {
      "id": "tc-pub-p-72-2",
      "position": 2,
      "isPublic": true,
      "input": [
        []
      ],
      "expectedOutput": []
    },
    {
      "id": "tc-pub-p-72-3",
      "position": 3,
      "isPublic": true,
      "input": [
        [
          []
        ]
      ],
      "expectedOutput": []
    }
  ],
  "merge-k-sorted-lists": [
    {
      "id": "tc-pub-p-72-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          [
            1,
            4,
            5
          ],
          [
            1,
            3,
            4
          ],
          [
            2,
            6
          ]
        ]
      ],
      "expectedOutput": [
        1,
        1,
        2,
        3,
        4,
        4,
        5,
        6
      ]
    },
    {
      "id": "tc-pub-p-72-2",
      "position": 2,
      "isPublic": true,
      "input": [
        []
      ],
      "expectedOutput": []
    },
    {
      "id": "tc-pub-p-72-3",
      "position": 3,
      "isPublic": true,
      "input": [
        [
          []
        ]
      ],
      "expectedOutput": []
    }
  ],
  "p-73": [
    {
      "id": "tc-pub-p-73-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          1,
          3
        ],
        [
          2
        ]
      ],
      "expectedOutput": 2
    },
    {
      "id": "tc-pub-p-73-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          1,
          2
        ],
        [
          3,
          4
        ]
      ],
      "expectedOutput": 2.5
    },
    {
      "id": "tc-pub-p-73-3",
      "position": 3,
      "isPublic": true,
      "input": [
        [
          0,
          0
        ],
        [
          0,
          0
        ]
      ],
      "expectedOutput": 0
    }
  ],
  "median-of-two-sorted-arrays": [
    {
      "id": "tc-pub-p-73-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          1,
          3
        ],
        [
          2
        ]
      ],
      "expectedOutput": 2
    },
    {
      "id": "tc-pub-p-73-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          1,
          2
        ],
        [
          3,
          4
        ]
      ],
      "expectedOutput": 2.5
    },
    {
      "id": "tc-pub-p-73-3",
      "position": 3,
      "isPublic": true,
      "input": [
        [
          0,
          0
        ],
        [
          0,
          0
        ]
      ],
      "expectedOutput": 0
    }
  ],
  "p-74": [
    {
      "id": "tc-pub-p-74-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          "bad",
          "dad",
          "mad"
        ],
        "pad"
      ],
      "expectedOutput": false
    },
    {
      "id": "tc-pub-p-74-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          "bad",
          "dad",
          "mad"
        ],
        ".ad"
      ],
      "expectedOutput": true
    },
    {
      "id": "tc-pub-p-74-3",
      "position": 3,
      "isPublic": true,
      "input": [
        [
          "bad",
          "dad",
          "mad"
        ],
        "b.."
      ],
      "expectedOutput": true
    }
  ],
  "design-add-and-search-words-data-structure": [
    {
      "id": "tc-pub-p-74-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          "bad",
          "dad",
          "mad"
        ],
        "pad"
      ],
      "expectedOutput": false
    },
    {
      "id": "tc-pub-p-74-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          "bad",
          "dad",
          "mad"
        ],
        ".ad"
      ],
      "expectedOutput": true
    },
    {
      "id": "tc-pub-p-74-3",
      "position": 3,
      "isPublic": true,
      "input": [
        [
          "bad",
          "dad",
          "mad"
        ],
        "b.."
      ],
      "expectedOutput": true
    }
  ],
  "p-75": [
    {
      "id": "tc-pub-p-75-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          "wrt",
          "wrf",
          "er",
          "ett",
          "rftt"
        ]
      ],
      "expectedOutput": "wertf"
    },
    {
      "id": "tc-pub-p-75-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          "z",
          "x"
        ]
      ],
      "expectedOutput": "zx"
    },
    {
      "id": "tc-pub-p-75-3",
      "position": 3,
      "isPublic": true,
      "input": [
        [
          "z",
          "x",
          "z"
        ]
      ],
      "expectedOutput": ""
    }
  ],
  "alien-dictionary": [
    {
      "id": "tc-pub-p-75-1",
      "position": 1,
      "isPublic": true,
      "input": [
        [
          "wrt",
          "wrf",
          "er",
          "ett",
          "rftt"
        ]
      ],
      "expectedOutput": "wertf"
    },
    {
      "id": "tc-pub-p-75-2",
      "position": 2,
      "isPublic": true,
      "input": [
        [
          "z",
          "x"
        ]
      ],
      "expectedOutput": "zx"
    },
    {
      "id": "tc-pub-p-75-3",
      "position": 3,
      "isPublic": true,
      "input": [
        [
          "z",
          "x",
          "z"
        ]
      ],
      "expectedOutput": ""
    }
  ]
};

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
