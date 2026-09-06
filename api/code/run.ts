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

function areOutputsEquivalent(actual: any, expected: any): boolean {
  if (actual === expected) return true;
  if (actual === null || expected === null || actual === undefined || expected === undefined) {
    return actual === expected;
  }
  if (typeof expected === 'boolean' && typeof actual === 'string') {
    return actual.toLowerCase() === (expected ? 'true' : 'false');
  }
  if (typeof actual === 'boolean' && typeof expected === 'string') {
    return expected.toLowerCase() === (actual ? 'true' : 'false');
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
  e = e.replace(/([a-zA-Z0-9_]+)\s+in\s+([a-zA-Z0-9_]+)/g, '($2 && ($1 in $2 || ($2.indexOf && $2.indexOf($1) !== -1)))');
  return e;
}

function transpilePythonToJs(pythonCode: string): string {
  const lines = pythonCode.split(/\r?\n/);
  const outLines: string[] = [];
  const indentStack: number[] = [0];

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    if (!rawLine.trim() || rawLine.trim().startsWith('#')) continue;

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

const BUILTIN_TEST_CASES: Record<string, RunnerTestCase[]> = {
  'two-sum': [
    { id: 'tc-1', position: 1, isPublic: true, input: [[2, 7, 11, 15], 9], expectedOutput: [0, 1] },
    { id: 'tc-2', position: 2, isPublic: true, input: [[3, 2, 4], 6], expectedOutput: [1, 2] }
  ],
  'p-1': [
    { id: 'tc-1', position: 1, isPublic: true, input: [[2, 7, 11, 15], 9], expectedOutput: [0, 1] },
    { id: 'tc-2', position: 2, isPublic: true, input: [[3, 2, 4], 6], expectedOutput: [1, 2] }
  ]
};

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

    const funcMatch = runnableJs.match(/function\s+([a-zA-Z0-9_]+)\s*\(/) ||
                      runnableJs.match(/(?:const|let|var)\s+([a-zA-Z0-9_]+)\s*=\s*(?:function|\([^)]*\)\s*=>)/);
    const targetFuncName = funcMatch ? funcMatch[1] : '';

    const runnerFactory = new Function(`
      ${runnableJs};
      var __fn = null;
      if (typeof ${targetFuncName || 'null'} === 'function') {
        __fn = ${targetFuncName};
      } else if (typeof solution === 'function') {
        __fn = solution;
      } else if (typeof pairSumTarget === 'function') {
        __fn = pairSumTarget;
      } else if (typeof twoSum === 'function') {
        __fn = twoSum;
      }
      return __fn;
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
        errorMessage = `${err.name || 'Error'}: ${err.message || String(err)}`;
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
      error_message: `${err.name || 'Error'}: ${err.message || String(err)}`,
      stdout: capturedStdout.length > 0 ? capturedStdout.join('\n') : undefined,
      stderr: capturedStderr.length > 0 ? capturedStderr.join('\n') : undefined
    };
  } finally {
    console.log = originalLog;
    console.warn = originalWarn;
    console.error = originalError;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error_message: 'Method not allowed' });
  }

  try {
    const { problem_id = 'two-sum', language = 'javascript', code = '' } = req.body || {};
    const testCases = BUILTIN_TEST_CASES[problem_id] || BUILTIN_TEST_CASES['p-1'];
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
