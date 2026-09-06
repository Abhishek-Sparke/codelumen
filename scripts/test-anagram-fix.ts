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
  if (typeof a === 'object' && typeof b === 'object') {
    const kA = Object.keys(a);
    const kB = Object.keys(b);
    if (kA.length !== kB.length) return false;
    for (const k of kA) {
      if (!__py_eq(a[k], b[k])) return false;
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

function __py_get(obj: any, key: any, defaultVal: any = null) {
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

function sorted(arr: any, keyFunc?: any, reverse = false) {
  const copy = [...(arr || [])];
  copy.sort((a, b) => {
    const valA = keyFunc ? keyFunc(a) : a;
    const valB = keyFunc ? keyFunc(b) : b;
    return valA < valB ? -1 : valA > valB ? 1 : 0;
  });
  if (reverse) copy.reverse();
  return copy;
}

// Test Solution A logic:
console.log('Testing Solution A:');
function is_anagram_A(s: string, t: string) {
  return __py_eq(sorted(s), sorted(t));
}
console.log('Solution A ("anagram", "nagaram") ->', is_anagram_A("anagram", "nagaram"), '(expected true)');
console.log('Solution A ("rat", "car") ->', is_anagram_A("rat", "car"), '(expected false)');
console.log('Solution A ("listen", "silent") ->', is_anagram_A("listen", "silent"), '(expected true)');

// Test Solution B logic:
console.log('\nTesting Solution B:');
function is_anagram_B(s: string, t: string) {
  if (!__py_eq(s.length, t.length)) {
    return false;
  }
  const count: any = {};
  for (const c of s) {
    count[c] = __py_get(count, c, 0) + 1;
  }
  for (const c of t) {
    if (!__py_in(c, count)) {
      return false;
    }
    count[c] -= 1;
    if (count[c] < 0) {
      return false;
    }
  }
  return true;
}
console.log('Solution B ("anagram", "nagaram") ->', is_anagram_B("anagram", "nagaram"), '(expected true)');
console.log('Solution B ("rat", "car") ->', is_anagram_B("rat", "car"), '(expected false)');
console.log('Solution B ("listen", "silent") ->', is_anagram_B("listen", "silent"), '(expected true)');
console.log('Solution B ("a", "ab") ->', is_anagram_B("a", "ab"), '(expected false)');
