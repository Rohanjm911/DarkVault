/**
 * DarkVault Leetspeak Detection & Normalization Engine
 * Decodes typical character replacements used by users trying to disguise weak words.
 * Examples: 'p@$$w0rd' -> 'password', '3ntr0py' -> 'entropy', '4dm1n' -> 'admin'
 */

const LEET_MAP: Record<string, string> = {
  '@': 'a',
  '4': 'a',
  '8': 'b',
  '(': 'c',
  '[': 'c',
  '{': 'c',
  '<': 'c',
  '3': 'e',
  '€': 'e',
  '9': 'g',
  '#': 'h',
  '1': 'i',
  '!': 'i',
  '|': 'i',
  '0': 'o',
  '5': 's',
  '$': 's',
  '7': 't',
  '+': 't',
  '2': 'z',
  '%': 'x',
};

/**
 * Normalizes a leetspeak string back into standard latin characters.
 */
export function normalizeLeet(str: string): string {
  let result = '';
  for (const char of str.toLowerCase()) {
    result += LEET_MAP[char] || char;
  }
  return result;
}

/**
 * Checks if string contains leet substitutions.
 */
export function hasLeetSubstitutions(str: string): boolean {
  for (const char of str) {
    if (LEET_MAP[char]) return true;
  }
  return false;
}

