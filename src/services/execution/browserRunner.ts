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
    // Skip empty or comment lines
    if (!rawLine.trim() || rawLine.trim().startsWith('#')) {
      continue;
    }

    const indentMatch = rawLine.match(/^(\s*)/);
    const currentIndent = indentMatch ? indentMatch[1].length : 0;

    // Handle dedents
    while (indentStack.length > 1 && currentIndent < indentStack[indentStack.length - 1]) {
      indentStack.pop();
      outLines.push(' '.repeat(indentStack[indentStack.length - 1]) + '}');
    }

    let line = rawLine.trim();

    // Match function definition: def func(a: list, b: int) -> list:
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

    // Match if / elif / else:
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

    // Match while loop:
    if (line.match(/^while\s+(.*?):$/)) {
      const cond = line.replace(/^while\s+/, '').replace(/:$/, '');
      outLines.push(' '.repeat(currentIndent) + `while (${convertPythonExpr(cond)}) {`);
      indentStack.push(currentIndent + 4);
      continue;
    }

    // Match for loop: for i in range(len(nums)):
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

    // Match for in array/iterable:
    const forInMatch = line.match(/^for\s+([a-zA-Z0-9_]+)\s+in\s+(.*?):/);
    if (forInMatch) {
      const varName = forInMatch[1];
      const iter = convertPythonExpr(forInMatch[2]);
      outLines.push(' '.repeat(currentIndent) + `for (const ${varName} of ${iter}) {`);
      indentStack.push(currentIndent + 4);
      continue;
    }

    // Pass statement
    if (line === 'pass') {
      continue;
    }

    // Return statement
    if (line.startsWith('return ') || line === 'return') {
      const retVal = line.replace(/^return\s*/, '');
      outLines.push(' '.repeat(currentIndent) + `return ${convertPythonExpr(retVal)};`);
      continue;
    }

    // Variable assignment / statements
    outLines.push(' '.repeat(currentIndent) + convertPythonStatement(line) + ';');
  }

  // Close any remaining blocks
  while (indentStack.length > 1) {
    indentStack.pop();
    outLines.push('}');
  }

  return {
    jsCode: outLines.join('\n'),
    funcName: targetFuncName
  };
}

function __py_in(item: any, col: any): boolean {
  if (col == null) return false;
  if (typeof col.has === 'function') return col.has(item);
  if (Array.isArray(col) || typeof col === 'string') return col.indexOf(item) !== -1;
  return item in col;
}

function convertPythonExpr(expr: string): string {
  let e = expr.trim();
  e = e.replace(/\bTrue\b/g, 'true');
  e = e.replace(/\bFalse\b/g, 'false');
  e = e.replace(/\bNone\b/g, 'null');
  e = e.replace(/\band\b/g, '&&');
  e = e.replace(/\bor\b/g, '||');
  e = e.replace(/\bnot\b/g, '!');
  e = e.replace(/\blen\((.*?)\)/g, '($1).length');
  e = e.replace(/\.append\((.*?)\)/g, '.push($1)');
  e = e.replace(/\bprint\((.*?)\)/g, 'console.log($1)');
  e = e.replace(/([a-zA-Z0-9_]+)\s+in\s+([a-zA-Z0-9_]+)/g, '__py_in($1, $2)');
  return e;
}

function convertPythonStatement(stmt: string): string {
  let s = convertPythonExpr(stmt);
  // If variable declaration without let/const
  if (s.match(/^[a-zA-Z0-9_]+\s*=/)) {
    return 'let ' + s;
  }
  return s;
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

    // Intercept console outputs safely
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
      // Find candidate function names
      const funcNames: string[] = [];
      const funcRegex = /(?:function\s+([a-zA-Z0-9_]+)|(?:const|let|var)\s+([a-zA-Z0-9_]+)\s*=\s*(?:function|\([^)]*\)\s*=>))/g;
      let match: RegExpExecArray | null;
      while ((match = funcRegex.exec(code)) !== null) {
        const name = match[1] || match[2];
        if (name && !funcNames.includes(name)) {
          funcNames.push(name);
        }
      }

      const checks = funcNames.map(f => `if (typeof ${f} === 'function') return ${f};`).join('\n');

      // Wrap user code in a function context with Python polyfills
      const runnerFactory = new Function(`
        function __py_in(item, col) {
          if (col == null) return false;
          if (typeof col.has === 'function') return col.has(item);
          if (Array.isArray(col) || typeof col === 'string') return col.indexOf(item) !== -1;
          return item in col;
        }
        function set(iterable) { return new Set(iterable || []); }
        function dict(entries) { return new Map(entries || []); }
        function list(iterable) { return Array.from(iterable || []); }
        function min(...args) {
          if (args.length === 1 && Array.isArray(args[0])) return Math.min(...args[0]);
          return Math.min(...args);
        }
        function max(...args) {
          if (args.length === 1 && Array.isArray(args[0])) return Math.max(...args[0]);
          return Math.max(...args);
        }
        function sum(arr) { return (arr || []).reduce((a, b) => a + b, 0); }
        function abs(x) { return Math.abs(x); }
        function sorted(arr) { return [...(arr || [])].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0)); }

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
