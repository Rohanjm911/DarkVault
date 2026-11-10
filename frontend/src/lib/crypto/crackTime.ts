/**
 * DarkVault Attack Vector & Crack Time Estimation Engine
 * Calculates theoretical time required to compromise a credential based on its effective entropy
 * across 4 standardized threat models.
 */

import { CrackTimeEstimates } from '../types';

/**
 * Attack rate assumptions (guesses per second):
 * - Online Throttled: 100 attempts / hour (~0.027 guesses/sec)
 * - Online Unthrottled: 100 attempts / sec
 * - Offline Fast Hash (MD5 / NTLM): 10 billion attempts / sec (10e9)
 * - Offline GPU Rig (SHA-256 cluster): 100 billion attempts / sec (100e9)
 */
const RATES = {
  onlineThrottled: 100 / 3600,
  onlineUnthrottled: 100,
  offlineFastHash: 10_000_000_000,
  offlineGpuRig: 100_000_000_000,
};

function formatDuration(seconds: number): string {
  if (seconds < 1) return 'Instant (<1 sec)';
  if (seconds < 60) return `${Math.round(seconds)} seconds`;
  
  const minutes = seconds / 60;
  if (minutes < 60) return `${Math.round(minutes)} minutes`;
  
  const hours = minutes / 60;
  if (hours < 24) return `${Math.round(hours)} hours`;
  
  const days = hours / 24;
  if (days < 30) return `${Math.round(days)} days`;
  
  const months = days / 30.44;
  if (months < 12) return `${Math.round(months)} months`;
  
  const years = days / 365.25;
  if (years < 100) return `${Math.round(years)} years`;
  if (years < 10_000) return `${Math.round(years).toLocaleString()} years`;
  if (years < 1_000_000) return `${Math.round(years / 1_000).toLocaleString()} thousand years`;
  if (years < 1_000_000_000) return `${Math.round(years / 1_000_000).toLocaleString()} million years`;
  if (years < 1_000_000_000_000) return `${Math.round(years / 1_000_000_000).toLocaleString()} billion years`;
  
  return 'Unbreakable (> 100 Trillion Years)';
}

export function estimateCrackTimes(entropyBits: number): CrackTimeEstimates {
  if (entropyBits <= 0) {
    return {
      onlineThrottled: 'Instant',
      onlineUnthrottled: 'Instant',
      offlineFastHash: 'Instant',
      offlineGpuRig: 'Instant',
    };
  }

  // Number of combinations: 2^entropyBits
  // Average search space to break: 2^(entropyBits - 1)
  const averageGuesses = Math.pow(2, Math.max(0, entropyBits - 1));

  return {
    onlineThrottled: formatDuration(averageGuesses / RATES.onlineThrottled),
    onlineUnthrottled: formatDuration(averageGuesses / RATES.onlineUnthrottled),
    offlineFastHash: formatDuration(averageGuesses / RATES.offlineFastHash),
    offlineGpuRig: formatDuration(averageGuesses / RATES.offlineGpuRig),
  };
}

