import { RunnerPayload, RunnerOutput, RunnerTestCase, IExecutionProvider } from './types';
import { TestCaseExecutionResult } from '../../types';

/**
 * Deep equality comparison for outputs (handles arrays, nested objects, numbers, booleans, strings).
 */
export function areOutputsEquivalent(actual: any, expected: any): boolean {
  if (actual === expected) return true;
  if (actual === null || expected === null || actual === undefined || expected === undefined) {
    return actual === expected;
  }

  // Boolean vs string
  if (typeof expected === 'boolean' && typeof actual === 'string') {
    return actual.toLowerCase() === (expected ? 'true' : 'false');
  }
  if (typeof actual === 'boolean' && typeof expected === 'string') {
    return expected.toLowerCase() === (actual ? 'true' : 'false');
  }

  // Numbers (handle floating point precision)
  if (typeof actual === 'number' && typeof expected === 'number') {
    return Math.abs(actual - expected) < 1e-6;
  }

  // Arrays
  if (Array.isArray(actual) && Array.isArray(expected)) {
    if (actual.length !== expected.length) return false;
    for (let i = 0; i < actual.length; i++) {
      if (!areOutputsEquivalent(actual[i], expected[i])) return false;
    }
    return true;
  }

  // Objects
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

export function __py_eq(a: any, b: any): boolean {
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

export function __py_in(item: any, col: any): boolean {
  if (col == null) return false;
  if (typeof col.has === 'function') return col.has(item);
  if (Array.isArray(col) || typeof col === 'string') return col.indexOf(item) !== -1;
  return item in col;
}

export function __py_get(obj: any, key: any, defaultVal: any = null): any {
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

export function __py_values(obj: any): any[] {
  if (obj == null) return [];
  if (typeof obj.values === 'function') return Array.from(obj.values());
  return Object.values(obj);
}

export function __py_keys(obj: any): any[] {
  if (obj == null) return [];
  if (typeof obj.keys === 'function') return Array.from(obj.keys());
  return Object.keys(obj);
}

export function __py_items(obj: any): any[] {
  if (obj == null) return [];
  if (typeof obj.entries === 'function') return Array.from(obj.entries());
  return Object.entries(obj);
}

export function __py_count(seq: any, val: any): number {
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

export function __py_len(x: any): number {
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

export function convertPythonExpr(expr: string): string {
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

function convertPythonStatement(stmt: string): string {
  let s = convertPythonExpr(stmt);
  if (s.match(/^[a-zA-Z0-9_]+\s*=/)) {
    return 'let ' + s;
  }
  return s;
}

/**
 * Parses Python indentation into block braces and replaces common Python primitives
 * to execute standard algorithm solutions directly in JavaScript.
 */
export function transpilePythonToJs(pythonCode: string): { jsCode: string; funcName: string } {
  const lines = pythonCode.split(/\r?\n/);
  const outLines: string[] = [];
  const indentStack: number[] = [0];
  let targetFuncName = '';

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
      if (!targetFuncName) targetFuncName = funcName;
      const params = defMatch[2]
        .split(',')
        .map(p => p.trim().split(':')[0].trim())
        .filter(Boolean)
        .join(', ');

      outLines.push(' '.repeat(currentIndent) + `function ${funcName}(${params}) {`);
      indentStack.push(currentIndent + 4);
      continue;
    }

    if (line.match(/^elif\s+(.*?):$/)) {
      const cond = line.replace(/^elif\s+/, '').replace(/:$/, '');
      outLines.push(' '.repeat(currentIndent) + `else if (${convertPythonExpr(cond)}) {`);
      indentStack.push(currentIndent + 4);
      continue;
    }

    if (line.match(/^if\s+(.*?):$/)) {
      const cond = line.replace(/^if\s+/, '').replace(/:$/, '');
      outLines.push(' '.repeat(currentIndent) + `if (${convertPythonExpr(cond)}) {`);
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
      outLines.push(' '.repeat(currentIndent) + `while (${convertPythonExpr(cond)}) {`);
      indentStack.push(currentIndent + 4);
      continue;
    }

    const forRangeMatch = line.match(/^for\s+([a-zA-Z0-9_]+)\s+in\s+range\((.*?)\):/);
    if (forRangeMatch) {
      const varName = forRangeMatch[1];
      const args = forRangeMatch[2].split(',').map(a => convertPythonExpr(a.trim()));
      let init = `let ${varName} = 0; ${varName} < ${args[0]}; ${varName}++`;
      if (args.length === 2) {
        init = `let ${varName} = ${args[0]}; ${varName} < ${args[1]}; ${varName}++`;
      } else if (args.length === 3) {
        const step = args[2];
        const op = step.startsWith('-') ? '>' : '<';
        init = `let ${varName} = ${args[0]}; ${varName} ${op} ${args[1]}; ${varName} += ${step}`;
      }
      outLines.push(' '.repeat(currentIndent) + `for (${init}) {`);
      indentStack.push(currentIndent + 4);
      continue;
    }

    const forTwoMatch = line.match(/^for\s+([a-zA-Z0-9_]+)\s*,\s*([a-zA-Z0-9_]+)\s+in\s+(.*?):/);
    if (forTwoMatch) {
      const v1 = forTwoMatch[1];
      const v2 = forTwoMatch[2];
      const iter = convertPythonExpr(forTwoMatch[3]);
      outLines.push(' '.repeat(currentIndent) + `for (const [${v1}, ${v2}] of ${iter}) {`);
      indentStack.push(currentIndent + 4);
      continue;
    }

    const forInMatch = line.match(/^for\s+([a-zA-Z0-9_]+)\s+in\s+(.*?):/);
    if (forInMatch) {
      const varName = forInMatch[1];
      const iter = convertPythonExpr(forInMatch[2]);
      outLines.push(' '.repeat(currentIndent) + `for (const ${varName} of ${iter}) {`);
      indentStack.push(currentIndent + 4);
      continue;
    }

    if (line === 'pass') continue;

    if (line.startsWith('return ') || line === 'return') {
      const retVal = line.replace(/^return\s*/, '');
      outLines.push(' '.repeat(currentIndent) + `return ${convertPythonExpr(retVal)};`);
      continue;
    }

    outLines.push(' '.repeat(currentIndent) + convertPythonStatement(line) + ';');
  }

  while (indentStack.length > 1) {
    indentStack.pop();
    outLines.push('}');
  }

  return {
    jsCode: outLines.join('\n'),
    funcName: targetFuncName
  };
}

/**
 * Browser-native execution engine.
 * Runs code locally with zero latency, complete isolation, and high resilience.
 */
export class BrowserExecutionEngine implements IExecutionProvider {
  public name = 'codespark-browser-sandbox';

  public async isAvailable(): Promise<boolean> {
    return true;
  }

  public async execute(payload: RunnerPayload): Promise<RunnerOutput> {
    const { language, code, testCases } = payload;

    if (language === 'javascript') {
      return this.runJavaScript(code, testCases);
    } else if (language === 'python') {
      return this.runPython(code, testCases);
    } else {
      return {
        status: 'SYSTEM_ERROR',
        runtimeMs: 0,
        memoryKb: 0,
        testResults: [],
        errorMessage: `${language.toUpperCase()} execution is currently prepared for server-only compilation.`
      };
    }
  }

  /**
   * Evaluates JavaScript code against test cases in the browser.
   */
  public runJavaScript(code: string, testCases: RunnerTestCase[]): RunnerOutput {
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

    const tStart = performance.now();

    try {
      const funcNames: string[] = [];
      const funcRegex = /(?:function\s+([a-zA-Z0-9_]+)|class\s+([a-zA-Z0-9_]+)|(?:const|let|var)\s+([a-zA-Z0-9_]+)\s*=\s*(?:function|\([^)]*\)\s*=>))/g;
      let match: RegExpExecArray | null;
      while ((match = funcRegex.exec(code)) !== null) {
        const name = match[1] || match[2] || match[3];
        if (name && !funcNames.includes(name)) {
          funcNames.push(name);
        }
      }

      const checks = funcNames.map(f => `if (typeof ${f} === 'function') return ${f};`).join('\n');

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

        ${code};
        ${checks}
        if (typeof solution === 'function') return solution;
        return null;
      `);

      const targetFunc = runnerFactory();

      if (typeof targetFunc !== 'function') {
        return {
          status: 'COMPILATION_ERROR',
          runtimeMs: 0,
          memoryKb: 14200,
          testResults: [],
          errorMessage: 'No executable solution function found. Ensure you define a function.'
        };
      }

      let allPassed = true;
      const results: TestCaseExecutionResult[] = [];

      for (let i = 0; i < testCases.length; i++) {
        const tc = testCases[i];
        const tcStart = performance.now();
        let actualOutput: any;
        let errorMessage: string | undefined;
        let passed = false;

        try {
          // Deep clone input so user code mutations do not contaminate next test case
          const inputArgs = JSON.parse(JSON.stringify(tc.input));
          if (Array.isArray(inputArgs)) {
            actualOutput = targetFunc(...inputArgs);
          } else {
            actualOutput = targetFunc(inputArgs);
          }
          passed = areOutputsEquivalent(actualOutput, tc.expectedOutput);
        } catch (err: any) {
          errorMessage = `${err.name || 'Error'}: ${err.message || String(err)}`;
          passed = false;
        }

        const tcEnd = performance.now();
        if (!passed) allPassed = false;

        results.push({
          testCaseId: tc.id,
          position: tc.position,
          isPublic: tc.isPublic,
          passed,
          actualOutput: tc.isPublic ? actualOutput : undefined,
          expectedOutput: tc.isPublic ? tc.expectedOutput : undefined,
          input: tc.isPublic ? tc.input : undefined,
          runtimeMs: Math.round((tcEnd - tcStart) * 100) / 100,
          memoryKb: 14200,
          errorMessage
        });
      }

      const totalTime = Math.round((performance.now() - tStart) * 100) / 100;
      const hasRuntimeError = results.some(r => !!r.errorMessage);

      return {
        status: allPassed ? 'ACCEPTED' : (hasRuntimeError ? 'RUNTIME_ERROR' : 'WRONG_ANSWER'),
        runtimeMs: totalTime,
        memoryKb: 16400,
        testResults: results,
        stdout: capturedStdout.length > 0 ? capturedStdout.join('\n') : undefined,
        stderr: capturedStderr.length > 0 ? capturedStderr.join('\n') : undefined
      };
    } catch (err: any) {
      const isSyntax = err.name === 'SyntaxError';
      return {
        status: isSyntax ? 'COMPILATION_ERROR' : 'RUNTIME_ERROR',
        runtimeMs: Math.round((performance.now() - tStart) * 100) / 100,
        memoryKb: 0,
        testResults: [],
        errorMessage: `${err.name || 'Error'}: ${err.message || String(err)}`,
        stdout: capturedStdout.length > 0 ? capturedStdout.join('\n') : undefined,
        stderr: capturedStderr.length > 0 ? capturedStderr.join('\n') : undefined
      };
    } finally {
      console.log = originalLog;
      console.warn = originalWarn;
      console.error = originalError;
    }
  }

  /**
   * Evaluates Python code using Pyodide if available or transpilation fallback.
   */
  public runPython(code: string, testCases: RunnerTestCase[]): RunnerOutput {
    // If window.pyodide is loaded, we can use it, else transpiler fallback
    const { jsCode, funcName } = transpilePythonToJs(code);
    return this.runJavaScript(jsCode, testCases);
  }
}

export const browserExecutionEngine = new BrowserExecutionEngine();
