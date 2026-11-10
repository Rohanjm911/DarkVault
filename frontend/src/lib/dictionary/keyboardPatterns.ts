/**
 * DarkVault Keyboard Walking, Sequences & Pattern Detection Engine
 */

// Common QWERTY horizontal and vertical layout rows
const KEYBOARD_ROWS = [
  '`1234567890-=',
  '~!@#$%^&*()_+',
  'qwertyuiop[]\\',
  'QWERTYUIOP{}|',
  'asdfghjkl;\'',
  'ASDFGHJKL:"',
  'zxcvbnm,./',
  'ZXCVBNM<>?',
];

// Numpad rows
const NUMPAD_ROWS = [
  '789',
  '456',
  '123',
  '0.',
];

/**
 * Checks for repeated characters: e.g. "aaa", "1111"
 */
export function findRepeatedCharacters(password: string): { found: boolean; maxRun: number; char: string } {
  let maxRun = 0;
  let currentRun = 1;
  let runChar = '';

  for (let i = 1; i < password.length; i++) {
    if (password[i].toLowerCase() === password[i - 1].toLowerCase()) {
      currentRun++;
      if (currentRun > maxRun) {
        maxRun = currentRun;
        runChar = password[i];
      }
    } else {
      currentRun = 1;
    }
  }

  return {
    found: maxRun >= 3,
    maxRun,
    char: runChar,
  };
}

/**
 * Checks for alphabetical or numerical sequential runs: e.g. "abc", "cba", "1234", "9876"
 */
export function findSequentialRuns(password: string): { found: boolean; runLength: number; sequence: string } {
  let longestRun = 0;
  let longestSeq = '';

  for (let i = 0; i < password.length - 2; i++) {
    let forwardRun = 1;
    let backwardRun = 1;

    for (let j = i + 1; j < password.length; j++) {
      const prevCode = password.charCodeAt(j - 1);
      const currCode = password.charCodeAt(j);

      if (currCode === prevCode + 1) {
        forwardRun++;
      } else {
        break;
      }
    }

    for (let j = i + 1; j < password.length; j++) {
      const prevCode = password.charCodeAt(j - 1);
      const currCode = password.charCodeAt(j);

      if (currCode === prevCode - 1) {
        backwardRun++;
      } else {
        break;
      }
    }

    const currentMax = Math.max(forwardRun, backwardRun);
    if (currentMax >= 3 && currentMax > longestRun) {
      longestRun = currentMax;
      longestSeq = password.slice(i, i + currentMax);
    }
  }

  return {
    found: longestRun >= 3,
    runLength: longestRun,
    sequence: longestSeq,
  };
}

/**
 * Checks for spatial keyboard walks on QWERTY or Numpad: e.g. "qwerty", "asdfgh", "1qaz"
 */
export function findKeyboardWalks(password: string): { found: boolean; pattern: string } {
  const lower = password.toLowerCase();
  if (lower.length < 3) return { found: false, pattern: '' };

  const allRows = [...KEYBOARD_ROWS, ...NUMPAD_ROWS];

  for (let len = Math.min(8, lower.length); len >= 3; len--) {
    for (let i = 0; i <= lower.length - len; i++) {
      const sub = lower.slice(i, i + len);
      const revSub = sub.split('').reverse().join('');

      for (const row of allRows) {
        const lowerRow = row.toLowerCase();
        if (lowerRow.includes(sub) || lowerRow.includes(revSub)) {
          return { found: true, pattern: sub };
        }
      }
    }
  }

  // Vertical column walks (e.g. "1qaz", "2wsx", "3edc", "zaq1")
  const COLUMNS = [
    '1qaz', '2wsx', '3edc', '4rfv', '5tgb', '6yhn', '7ujm', '8ik,', '9ol.', '0p;/'
  ];
  for (const col of COLUMNS) {
    const revCol = col.split('').reverse().join('');
    if (lower.includes(col) || lower.includes(revCol)) {
      return { found: true, pattern: col };
    }
  }

  return { found: false, pattern: '' };
}

/**
 * Checks for date patterns: e.g. 1970-2035 years or MMDDYYYY
 */
export function findDatePatterns(password: string): { found: boolean; pattern: string } {
  // 4-digit years 1950 - 2035
  const yearMatch = password.match(/\b(19\d\d|20[0-3]\d)\b/);
  if (yearMatch) {
    return { found: true, pattern: yearMatch[0] };
  }

  // 6 or 8 digit dates: MMDDYY, DDMMYY, YYYYMMDD
  const dateMatch = password.match(/\b(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])(19|20)?\d\d\b/);
  if (dateMatch) {
    return { found: true, pattern: dateMatch[0] };
  }

  return { found: false, pattern: '' };
}

