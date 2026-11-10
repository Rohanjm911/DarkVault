/**
 * DarkVault Core Security & Entropy Engine
 * Computes character pool, Shannon entropy, heuristic penalty deductions,
 * NIST SP 800-63B compliance, and security recommendations.
 */

import {
  CharacterStats,
  DetectedPattern,
  PasswordAnalysis,
  BreachResult,
} from '../types';
import { TOP_COMMON_PASSWORDS, COMMON_DICTIONARY_WORDS } from '../dictionary/commonPasswords';
import { normalizeLeet, hasLeetSubstitutions } from '../dictionary/leetSpeak';
import {
  findRepeatedCharacters,
  findSequentialRuns,
  findKeyboardWalks,
  findDatePatterns,
} from '../dictionary/keyboardPatterns';
import { estimateCrackTimes } from './crackTime';

export function calculateCharacterStats(password: string): CharacterStats {
  let uppercase = 0;
  let lowercase = 0;
  let numbers = 0;
  let symbols = 0;
  let spaces = 0;
  const uniqueChars = new Set<string>();

  for (const ch of password) {
    uniqueChars.add(ch);
    if (/[a-z]/.test(ch)) lowercase++;
    else if (/[A-Z]/.test(ch)) uppercase++;
    else if (/[0-9]/.test(ch)) numbers++;
    else if (/\s/.test(ch)) spaces++;
    else symbols++;
  }

  return {
    uppercase,
    lowercase,
    numbers,
    symbols,
    spaces,
    unique: uniqueChars.size,
  };
}

export function calculateCharacterPool(stats: CharacterStats): number {
  let pool = 0;
  if (stats.lowercase > 0) pool += 26;
  if (stats.uppercase > 0) pool += 26;
  if (stats.numbers > 0) pool += 10;
  if (stats.symbols > 0) pool += 33;
  if (stats.spaces > 0) pool += 1;
  return pool > 0 ? pool : 0;
}

export function analyzePassword(
  password: string,
  breachStatus: BreachResult = {
    checked: false,
    breached: false,
    count: 0,
    prefix: '',
    suffix: '',
    loading: false,
  }
): PasswordAnalysis {
  if (!password) {
    return {
      passwordLength: 0,
      entropyBits: 0,
      poolSize: 0,
      score: 0,
      grade: 'Critical',
      characterStats: {
        uppercase: 0,
        lowercase: 0,
        numbers: 0,
        symbols: 0,
        spaces: 0,
        unique: 0,
      },
      patterns: [],
      crackTimes: estimateCrackTimes(0),
      nistCompliant: false,
      nistFeedback: ['Enter a password to evaluate.'],
      recommendations: ['Create a credential with at least 16 characters.'],
      breachStatus,
    };
  }

  const length = password.length;
  const stats = calculateCharacterStats(password);
  const pool = calculateCharacterPool(stats);

  // Raw Shannon entropy: E = L * log2(R)
  const rawEntropy = pool > 0 ? length * (Math.log(pool) / Math.LN2) : 0;

  const patterns: DetectedPattern[] = [];
  const recommendations: string[] = [];
  const nistFeedback: string[] = [];

  let entropyPenalty = 0;

  // 1. Direct Common Password Check
  const lower = password.toLowerCase();
  if (TOP_COMMON_PASSWORDS.has(lower)) {
    patterns.push({
      id: 'pat-common-exact',
      type: 'dictionary',
      label: 'Known Common Password',
      description: 'Matches a high-frequency entry from breached wordlists (RockYou/SecLists).',
      severity: 'critical',
      matchedSubstring: password,
    });
    entropyPenalty += 35;
    recommendations.push('Do NOT use famous, easily-guessable dictionary passwords.');
  }

  // 2. Leetspeak & Substituted Dictionary Check
  const normalized = normalizeLeet(lower);
  if (TOP_COMMON_PASSWORDS.has(normalized) && normalized !== lower) {
    patterns.push({
      id: 'pat-leet-common',
      type: 'leetspeak',
      label: 'Leetspeak Disguised Password',
      description: `Disguised version of common word "${normalized}". Modern cracking tools decode this instantly.`,
      severity: 'critical',
      matchedSubstring: password,
    });
    entropyPenalty += 28;
    recommendations.push('Basic character substitutions like @ for a or 0 for o do not fool modern crackers.');
  } else if (hasLeetSubstitutions(password)) {
    // Check if substring matches dictionary word after normalization
    for (const dictWord of COMMON_DICTIONARY_WORDS) {
      if (normalized.includes(dictWord) && dictWord.length >= 4) {
        patterns.push({
          id: `pat-leet-${dictWord}`,
          type: 'leetspeak',
          label: 'Leetspeak Dictionary Word',
          description: `Contains disguised dictionary root "${dictWord}".`,
          severity: 'medium',
          matchedSubstring: dictWord,
        });
        entropyPenalty += 12;
        break;
      }
    }
  }

  // 3. Repeated Characters Check
  const repeated = findRepeatedCharacters(password);
  if (repeated.found) {
    patterns.push({
      id: 'pat-repeated',
      type: 'repeated',
      label: 'Repeated Characters',
      description: `Repeated character "${repeated.char}" observed ${repeated.maxRun} times in sequence.`,
      severity: repeated.maxRun >= 4 ? 'high' : 'medium',
    });
    entropyPenalty += repeated.maxRun * 3;
    recommendations.push('Avoid repeating identical characters consecutively.');
  }

  // 4. Sequential Sequences Check
  const seq = findSequentialRuns(password);
  if (seq.found) {
    patterns.push({
      id: 'pat-sequential',
      type: 'sequence',
      label: 'Predictable Sequence',
      description: `Detected sequential pattern "${seq.sequence}" (${seq.runLength} chars).`,
      severity: seq.runLength >= 4 ? 'high' : 'medium',
      matchedSubstring: seq.sequence,
    });
    entropyPenalty += seq.runLength * 3.5;
    recommendations.push('Avoid sequential runs like 1234, abcd, or dcba.');
  }

  // 5. Keyboard Walk Check
  const walk = findKeyboardWalks(password);
  if (walk.found) {
    patterns.push({
      id: 'pat-keyboard',
      type: 'keyboard',
      label: 'Keyboard Walk',
      description: `Spatial keyboard pattern detected: "${walk.pattern}".`,
      severity: 'high',
      matchedSubstring: walk.pattern,
    });
    entropyPenalty += 16;
    recommendations.push('Avoid geometric keyboard walks (qwerty, asdf, etc.).');
  }

  // 6. Date Pattern Check
  const dateCheck = findDatePatterns(password);
  if (dateCheck.found) {
    patterns.push({
      id: 'pat-date',
      type: 'date',
      label: 'Year or Date Pattern',
      description: `Detected probable year or calendar date: "${dateCheck.pattern}".`,
      severity: 'medium',
      matchedSubstring: dateCheck.pattern,
    });
    entropyPenalty += 10;
    recommendations.push('Do not incorporate calendar years or birthdates.');
  }

  // 7. Low Unique Character Ratio
  if (length >= 8 && stats.unique / length < 0.5) {
    entropyPenalty += 10;
  }

  // Calculate Effective Entropy
  const effectiveEntropy = Math.max(0, Math.round((rawEntropy - entropyPenalty) * 10) / 10);

  // NIST SP 800-63B Compliance Check:
  // - Minimum length >= 8 (recommends >= 15 for users)
  // - Maximum length supported >= 64
  // - Must not be in common breach dictionary
  // - Must not contain predictable sequential patterns
  let nistCompliant = true;
  if (length < 8) {
    nistCompliant = false;
    nistFeedback.push('Fails NIST minimum length requirement (at least 8 characters required).');
    recommendations.push('Increase password length to at least 15+ characters.');
  } else {
    nistFeedback.push('Meets NIST baseline length requirement (8+ characters).');
  }

  if (length >= 16) {
    nistFeedback.push('Exceeds NIST recommended enterprise threshold (16+ characters).');
  }

  if (TOP_COMMON_PASSWORDS.has(lower) || TOP_COMMON_PASSWORDS.has(normalized)) {
    nistCompliant = false;
    nistFeedback.push('Fails NIST requirement: Credential exists in public dictionary/compromised lists.');
  }

  if (breachStatus.breached && breachStatus.count > 0) {
    nistCompliant = false;
    nistFeedback.push(`Fails NIST requirement: Credential confirmed in ${breachStatus.count.toLocaleString()} known breaches.`);
    recommendations.unshift('CRITICAL: This credential has been exposed in public database leaks. Change immediately!');
  }

  // Score Calculation (0 to 100)
  // Combines length, entropy, diversity and penalties
  let score = 0;

  // Length points (up to 35)
  if (length >= 20) score += 35;
  else if (length >= 16) score += 30;
  else if (length >= 12) score += 22;
  else if (length >= 8) score += 12;
  else score += Math.max(0, length);

  // Entropy points (up to 35)
  if (effectiveEntropy >= 85) score += 35;
  else if (effectiveEntropy >= 65) score += 28;
  else if (effectiveEntropy >= 50) score += 20;
  else if (effectiveEntropy >= 35) score += 12;
  else score += Math.round(effectiveEntropy * 0.3);

  // Diversity points (up to 20)
  let types = 0;
  if (stats.lowercase > 0) types++;
  if (stats.uppercase > 0) types++;
  if (stats.numbers > 0) types++;
  if (stats.symbols > 0) types++;
  score += types * 5;

  // Uniqueness points (up to 10)
  if (length > 0) {
    const uniqueRatio = stats.unique / length;
    score += Math.round(uniqueRatio * 10);
  }

  // Apply deductions
  if (patterns.length > 0) {
    score -= patterns.length * 8;
  }
  if (breachStatus.breached) {
    score = Math.min(score, 15); // Heavily cap if breached
  }

  score = Math.max(0, Math.min(100, Math.round(score)));

  // Risk & Grade classification
  let grade: PasswordAnalysis['grade'] = 'Critical';
  if (score >= 85) grade = 'Hardened';
  else if (score >= 70) grade = 'Strong';
  else if (score >= 50) grade = 'Moderate';
  else if (score >= 30) grade = 'Weak';
  else grade = 'Critical';

  // Add character suggestions if missing
  if (stats.symbols === 0) {
    recommendations.push('Include special symbols (!@#$%^&*) to expand search space.');
  }
  if (stats.numbers === 0) {
    recommendations.push('Include numerical digits (0-9).');
  }
  if (stats.uppercase === 0) {
    recommendations.push('Include uppercase characters (A-Z).');
  }

  return {
    passwordLength: length,
    entropyBits: effectiveEntropy,
    poolSize: pool,
    score,
    grade,
    characterStats: stats,
    patterns,
    crackTimes: estimateCrackTimes(effectiveEntropy),
    nistCompliant,
    nistFeedback,
    recommendations: Array.from(new Set(recommendations)),
    breachStatus,
  };
}

