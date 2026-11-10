/**
 * DarkVault Have I Been Pwned (HIBP) K-Anonymity Breach Client
 * ZERO-KNOWLEDGE PROMISE:
 * Plaintext passwords NEVER leave browser memory.
 * Only the first 5 hexadecimal characters of the locally generated SHA-1 digest are transmitted.
 */

import { calculateSha1, timingSafeEqual } from '../crypto/sha1';
import { BreachResult } from '../types';

export interface CheckBreachOptions {
  useBackendProxy?: boolean;
}

export async function checkPasswordBreach(
  password: string,
  options: CheckBreachOptions = { useBackendProxy: true }
): Promise<BreachResult> {
  if (!password) {
    return {
      checked: false,
      breached: false,
      count: 0,
      prefix: '',
      suffix: '',
      loading: false,
    };
  }

  try {
    // 1. Calculate SHA-1 digest entirely in local browser memory
    const { prefix, suffix } = await calculateSha1(password);

    // 2. Query k-anonymity 5-char prefix
    let responseText = '';
    const proxyUrl = `/api/breach/range/${prefix}`;
    const directUrl = `https://api.pwnedpasswords.com/range/${prefix}`;

    let succeeded = false;

    // Try backend proxy if enabled
    if (options.useBackendProxy) {
      try {
        const response = await fetch(proxyUrl, {
          method: 'GET',
          headers: {
            'Accept': 'text/plain',
          },
        });
        if (response.ok) {
          responseText = await response.text();
          succeeded = true;
        }
      } catch {
        // Fallback to direct call
      }
    }

    // Direct HIBP call fallback if proxy didn't respond
    if (!succeeded) {
      const response = await fetch(directUrl, {
        method: 'GET',
        headers: {
          'Add-Padding': 'true',
        },
      });
      if (!response.ok) {
        throw new Error(`HIBP query failed with status: ${response.status}`);
      }
      responseText = await response.text();
    }

    // 3. Search for matching 35-character suffix locally in browser memory
    const lines = responseText.split(/\r?\n/);
    let matchedCount = 0;
    let isBreached = false;

    for (const line of lines) {
      if (!line.trim()) continue;
      const [returnedSuffix, countStr] = line.split(':');
      if (returnedSuffix && timingSafeEqual(returnedSuffix.trim().toUpperCase(), suffix.toUpperCase())) {
        matchedCount = parseInt(countStr.trim(), 10) || 1;
        isBreached = true;
        break;
      }
    }

    return {
      checked: true,
      breached: isBreached,
      count: matchedCount,
      prefix,
      suffix,
      loading: false,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Breach service connection error';
    return {
      checked: true,
      breached: false,
      count: 0,
      prefix: '',
      suffix: '',
      loading: false,
      error: errorMsg,
    };
  }
}

