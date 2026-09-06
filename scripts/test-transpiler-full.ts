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

  // Python literals
  e = e.replace(/\bTrue\b/g, 'true');
  e = e.replace(/\bFalse\b/g, 'false');
  e = e.replace(/\bNone\b/g, 'null');

  // Logical operators
  e = e.replace(/\band\b/g, '&&');
  e = e.replace(/\bor\b/g, '||');

  // not in and in (BEFORE standalone not)
  e = e.replace(/([a-zA-Z0-9_().[\]'"]+)\s+not\s+in\s+([a-zA-Z0-9_().[\]'"]+)/g, '!__py_in($1, $2)');
  e = e.replace(/([a-zA-Z0-9_().[\]'"]+)\s+in\s+([a-zA-Z0-9_().[\]'"]+)/g, '__py_in($1, $2)');

  // Standalone not
  e = e.replace(/\bnot\b/g, '!');

  // len(...)
  e = e.replace(/\blen\((.*?)\)/g, '($1).length');

  // dict.get(key, default)
  e = e.replace(/([a-zA-Z0-9_().[\]'"]+)\.get\((.*?)\)/g, '__py_get($1, $2)');

  // dict.values(), keys(), items()
  e = e.replace(/([a-zA-Z0-9_().[\]'"]+)\.values\(\)/g, '__py_values($1)');
  e = e.replace(/([a-zA-Z0-9_().[\]'"]+)\.keys\(\)/g, '__py_keys($1)');
  e = e.replace(/([a-zA-Z0-9_().[\]'"]+)\.items\(\)/g, '__py_items($1)');

  // seq.count(val)
  e = e.replace(/([a-zA-Z0-9_().[\]'"]+)\.count\((.*?)\)/g, '__py_count($1, $2)');

  // list.append(...)
  e = e.replace(/\.append\((.*?)\)/g, '.push($1)');

  // print(...)
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

    // Def
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

    // Elif
    if (line.match(/^elif\s+(.*?):$/)) {
      const cond = line.replace(/^elif\s+/, '').replace(/:$/, '');
      outLines.push(' '.repeat(currentIndent) + `else if (${convertPythonExpr(cond)}) {`);
      indentStack.push(currentIndent + 4);
      continue;
    }

    // If
    if (line.match(/^if\s+(.*?):$/)) {
      const cond = line.replace(/^if\s+/, '').replace(/:$/, '');
      outLines.push(' '.repeat(currentIndent) + `if (${convertPythonExpr(cond)}) {`);
      indentStack.push(currentIndent + 4);
      continue;
    }

    // Else
    if (line === 'else:') {
      outLines.push(' '.repeat(currentIndent) + 'else {');
      indentStack.push(currentIndent + 4);
      continue;
    }

    // While
    if (line.match(/^while\s+(.*?):$/)) {
      const cond = line.replace(/^while\s+/, '').replace(/:$/, '');
      outLines.push(' '.repeat(currentIndent) + `while (${convertPythonExpr(cond)}) {`);
      indentStack.push(currentIndent + 4);
      continue;
    }

    // For range
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

    // For two vars (e.g. for k, v in count.items():)
    const forTwoMatch = line.match(/^for\s+([a-zA-Z0-9_]+)\s*,\s*([a-zA-Z0-9_]+)\s+in\s+(.*?):/);
    if (forTwoMatch) {
      const v1 = forTwoMatch[1];
      const v2 = forTwoMatch[2];
      const iter = convertPythonExpr(forTwoMatch[3]);
      outLines.push(' '.repeat(currentIndent) + `for (const [${v1}, ${v2}] of ${iter}) {`);
      indentStack.push(currentIndent + 4);
      continue;
    }

    // For in
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

const solA = `def is_anagram(s: str, t: str) -> bool:
    return sorted(s) == sorted(t)
`;

const solB = `def is_anagram(s: str, t: str) -> bool:
    if len(s) != len(t):
        return False

    count = {}

    for c in s:
        count[c] = count.get(c, 0) + 1

    for c in t:
        if c not in count:
            return False
        count[c] -= 1
        if count[c] < 0:
            return False

    return True
`;

console.log('TRANSPILED SOLUTION A:');
console.log(transpilePythonToJs(solA));

console.log('\nTRANSPILED SOLUTION B:');
console.log(transpilePythonToJs(solB));
