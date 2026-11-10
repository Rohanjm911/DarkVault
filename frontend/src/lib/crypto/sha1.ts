/**
 * DarkVault SHA-1 & Cryptographic Utilities
 * ZERO-KNOWLEDGE: All hashing operations occur strictly within the browser memory.
 */

export interface Sha1Result {
  fullHash: string;
  prefix: string; // First 5 characters (used for k-Anonymity range query)
  suffix: string; // Remaining 35 characters (matched locally against response)
}

/**
 * Calculates SHA-1 digest using Web Crypto API.
 * Never transmits plaintext password outside browser memory.
 */
export async function calculateSha1(text: string): Promise<Sha1Result> {
  if (!text) {
    return { fullHash: '', prefix: '', suffix: '' };
  }

  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const cryptoObj = typeof window !== 'undefined' ? window.crypto : globalThis.crypto;
  const hashBuffer = await cryptoObj.subtle.digest('SHA-1', data);
  
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const fullHash = hashArray
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase();

  const prefix = fullHash.slice(0, 5);
  const suffix = fullHash.slice(5);

  return { fullHash, prefix, suffix };
}

/**
 * Constant-time string comparison to prevent side-channel timing attacks.
 */
export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}
