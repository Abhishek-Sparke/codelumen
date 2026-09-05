/**
 * CodeSpark Security & Sanitization Service
 * Strict XSS prevention, quote depth limiting, and code syntax highlighting.
 */

export interface CodeToken {
  type: 'keyword' | 'string' | 'comment' | 'number' | 'function' | 'operator' | 'punctuation' | 'plain';
  text: string;
}

export class SecuritySanitizer {
  /**
   * HTML Entity Escaping to prevent XSS and tag injection.
   */
  public static escapeHtml(raw: string): string {
    if (!raw) return '';
    return raw
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /**
   * Strips dangerous tags (script, iframe, object) and event handlers (onerror, onload, onclick).
   */
  public static stripUnsafeHtml(raw: string): string {
    if (!raw) return '';
    return raw
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
      .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
      .replace(/\s*on\w+\s*=\s*(['"]).*?\1/gi, '')
      .replace(/\s*on\w+\s*=\s*[^>\s]+/gi, '')
      .replace(/javascript:/gi, 'blocked:');
  }

  /**
   * Validates safe URLs for Markdown links. Rejects javascript:, data:, vbscript:.
   */
  public static isSafeUrl(url: string): boolean {
    if (!url) return false;
    const trimmed = url.trim().toLowerCase();
    if (
      trimmed.startsWith('javascript:') ||
      trimmed.startsWith('data:') ||
      trimmed.startsWith('vbscript:') ||
      trimmed.startsWith('file:')
    ) {
      return false;
    }
    return (
      trimmed.startsWith('http://') ||
      trimmed.startsWith('https://') ||
      trimmed.startsWith('mailto:') ||
      trimmed.startsWith('/') ||
      trimmed.startsWith('#')
    );
  }

  /**
   * Limits recursive quote nesting depth (max depth 2).
   */
  public static limitQuoteNesting(content: string, maxDepth: number = 2): string {
    const lines = content.split('\n');
    return lines
      .map(line => {
        const quoteMatch = line.match(/^((?:>\s*)+)(.*)$/);
        if (!quoteMatch) return line;

        const quotePrefix = quoteMatch[1];
        const rest = quoteMatch[2];
        const depth = (quotePrefix.match(/>/g) || []).length;

        if (depth > maxDepth) {
          return `${'> '.repeat(maxDepth)}${rest.trim()}`;
        }
        return line;
      })
      .join('\n');
  }

  /**
   * Syntax highlighting token generator for supported programming languages.
   * Supported: Python, JavaScript, TypeScript, C++, Java, HTML, CSS, SQL, JSON, Bash.
   */
  public static tokenizeCode(code: string, language: string): CodeToken[] {
    const lang = (language || 'text').toLowerCase();
    const tokens: CodeToken[] = [];

    // Keywords dictionary per language
    const KEYWORDS: Record<string, Set<string>> = {
      python: new Set([
        'def', 'class', 'return', 'import', 'from', 'as', 'if', 'elif', 'else',
        'for', 'while', 'break', 'continue', 'pass', 'try', 'except', 'finally',
        'raise', 'with', 'yield', 'lambda', 'async', 'await', 'assert', 'in',
        'is', 'not', 'and', 'or', 'True', 'False', 'None', 'self'
      ]),
      javascript: new Set([
        'function', 'const', 'let', 'var', 'return', 'if', 'else', 'for', 'while',
        'switch', 'case', 'break', 'default', 'try', 'catch', 'finally', 'throw',
        'class', 'extends', 'new', 'import', 'export', 'from', 'as', 'async',
        'await', 'yield', 'typeof', 'instanceof', 'this', 'true', 'false', 'null', 'undefined'
      ]),
      typescript: new Set([
        'function', 'const', 'let', 'var', 'return', 'if', 'else', 'for', 'while',
        'switch', 'case', 'break', 'default', 'try', 'catch', 'finally', 'throw',
        'class', 'extends', 'new', 'import', 'export', 'from', 'as', 'async',
        'await', 'yield', 'typeof', 'instanceof', 'this', 'true', 'false', 'null',
        'undefined', 'interface', 'type', 'implements', 'enum', 'public', 'private',
        'protected', 'readonly', 'any', 'number', 'string', 'boolean', 'void'
      ]),
      cpp: new Set([
        'int', 'float', 'double', 'char', 'bool', 'void', 'long', 'short', 'unsigned',
        'class', 'struct', 'namespace', 'template', 'typename', 'public', 'private',
        'protected', 'virtual', 'override', 'const', 'constexpr', 'static', 'auto',
        'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue',
        'return', 'new', 'delete', 'nullptr', 'true', 'false', 'using', 'std', 'vector'
      ]),
      java: new Set([
        'public', 'private', 'protected', 'class', 'interface', 'extends', 'implements',
        'static', 'final', 'void', 'int', 'boolean', 'double', 'float', 'char', 'byte',
        'short', 'long', 'new', 'return', 'if', 'else', 'for', 'while', 'do', 'switch',
        'case', 'break', 'continue', 'try', 'catch', 'finally', 'throw', 'throws',
        'import', 'package', 'this', 'super', 'true', 'false', 'null'
      ]),
      sql: new Set([
        'SELECT', 'FROM', 'WHERE', 'INSERT', 'INTO', 'UPDATE', 'DELETE', 'JOIN',
        'LEFT', 'RIGHT', 'INNER', 'OUTER', 'ON', 'GROUP', 'BY', 'ORDER', 'ASC',
        'DESC', 'HAVING', 'LIMIT', 'OFFSET', 'UNION', 'ALL', 'AS', 'AND', 'OR',
        'NOT', 'IN', 'IS', 'NULL', 'PRIMARY', 'KEY', 'FOREIGN', 'REFERENCES', 'CREATE',
        'TABLE', 'INDEX', 'DROP', 'ALTER'
      ]),
      bash: new Set([
        'echo', 'cd', 'ls', 'mkdir', 'rm', 'cp', 'mv', 'cat', 'grep', 'curl', 'git',
        'npm', 'node', 'python', 'if', 'then', 'else', 'elif', 'fi', 'for', 'in',
        'do', 'done', 'while', 'export', 'source', 'case', 'esac', 'sudo'
      ])
    };

    const targetKeywords = KEYWORDS[lang] || KEYWORDS['javascript'] || new Set();

    // Line-by-line tokenization
    const lines = code.split('\n');
    lines.forEach((line, lineIdx) => {
      let i = 0;
      while (i < line.length) {
        // Comment
        if (
          (lang === 'python' || lang === 'bash') && line[i] === '#' ||
          (lang !== 'python' && lang !== 'bash') && line.slice(i, i + 2) === '//'
        ) {
          tokens.push({ type: 'comment', text: line.slice(i) });
          i = line.length;
          break;
        }

        // String
        if (line[i] === '"' || line[i] === "'" || line[i] === '`') {
          const quoteChar = line[i];
          let end = i + 1;
          while (end < line.length && (line[end] !== quoteChar || line[end - 1] === '\\')) {
            end++;
          }
          if (end < line.length) end++;
          tokens.push({ type: 'string', text: line.slice(i, end) });
          i = end;
          continue;
        }

        // Numbers
        if (/\d/.test(line[i]) && (i === 0 || !/[a-zA-Z_]/.test(line[i - 1]))) {
          let end = i;
          while (end < line.length && /[\d.]/.test(line[end])) {
            end++;
          }
          tokens.push({ type: 'number', text: line.slice(i, end) });
          i = end;
          continue;
        }

        // Word (Keywords or Functions or Plain)
        if (/[a-zA-Z_]/.test(line[i])) {
          let end = i;
          while (end < line.length && /[a-zA-Z0-9_]/.test(line[end])) {
            end++;
          }
          const word = line.slice(i, end);
          if (targetKeywords.has(word) || (lang === 'sql' && targetKeywords.has(word.toUpperCase()))) {
            tokens.push({ type: 'keyword', text: word });
          } else if (end < line.length && line[end] === '(') {
            tokens.push({ type: 'function', text: word });
          } else {
            tokens.push({ type: 'plain', text: word });
          }
          i = end;
          continue;
        }

        // Operators & Punctuation
        if (/[+\-*/%=<>!&|^~?:;.,()[\]{}]/.test(line[i])) {
          tokens.push({ type: 'operator', text: line[i] });
          i++;
          continue;
        }

        // Whitespace and other characters
        tokens.push({ type: 'plain', text: line[i] });
        i++;
      }

      if (lineIdx < lines.length - 1) {
        tokens.push({ type: 'plain', text: '\n' });
      }
    });

    return tokens;
  }
}
