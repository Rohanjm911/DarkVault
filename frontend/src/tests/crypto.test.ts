import { describe, it, expect } from 'vitest';
import { calculateSha1, timingSafeEqual } from '../lib/crypto/sha1';
import { analyzePassword, calculateCharacterStats } from '../lib/crypto/entropy';
import { normalizeLeet, hasLeetSubstitutions } from '../lib/dictionary/leetSpeak';
import { findSequentialRuns, findKeyboardWalks } from '../lib/dictionary/keyboardPatterns';
import { generatePassword } from '../lib/crypto/generator';

describe('DarkVault Cryptographic & Entropy Engines', () => {
  it('should accurately split SHA-1 hash into 5-char prefix and 35-char suffix for k-anonymity', async () => {
    // SHA-1 of "password" is 5BAA61E4C9B93F3F0682250B6CF8331B7EE68FD8
    const result = await calculateSha1('password');
    expect(result.fullHash).toBe('5BAA61E4C9B93F3F0682250B6CF8331B7EE68FD8');
    expect(result.prefix).toBe('5BAA6');
    expect(result.suffix).toBe('1E4C9B93F3F0682250B6CF8331B7EE68FD8');
    expect(result.prefix.length).toBe(5);
    expect(result.suffix.length).toBe(35);
  });

  it('should verify constant-time comparison helper', () => {
    expect(timingSafeEqual('ABCDE', 'ABCDE')).toBe(true);
    expect(timingSafeEqual('ABCDE', 'ABCDX')).toBe(false);
    expect(timingSafeEqual('ABCDE', 'ABCD')).toBe(false);
  });

  it('should detect character diversity accurately', () => {
    const stats = calculateCharacterStats('Abc123!@# ');
    expect(stats.uppercase).toBe(1);
    expect(stats.lowercase).toBe(2);
    expect(stats.numbers).toBe(3);
    expect(stats.symbols).toBe(3);
    expect(stats.spaces).toBe(1);
    expect(stats.unique).toBe(10);
  });

  it('should flag known weak passwords with critical severity', () => {
    const analysis = analyzePassword('password123');
    expect(analysis.score).toBeLessThan(40);
    expect(analysis.grade).toMatch(/Critical|Weak/);
    expect(analysis.patterns.some((p) => p.type === 'dictionary')).toBe(true);
  });

  it('should detect leetspeak disguised passwords', () => {
    expect(normalizeLeet('p@$$w0rd')).toBe('password');
    expect(hasLeetSubstitutions('p@$$w0rd')).toBe(true);
    
    const analysis = analyzePassword('p@$$w0rd');
    expect(analysis.patterns.some((p) => p.type === 'leetspeak')).toBe(true);
  });

  it('should identify keyboard spatial walks', () => {
    const walk = findKeyboardWalks('qwertyuiop');
    expect(walk.found).toBe(true);

    const analysis = analyzePassword('myqwerty99');
    expect(analysis.patterns.some((p) => p.type === 'keyboard')).toBe(true);
  });

  it('should identify sequential runs', () => {
    const seq = findSequentialRuns('abc12345');
    expect(seq.found).toBe(true);
  });

  it('should generate cryptographically random passwords with specified parameters', () => {
    const pwd = generatePassword({
      length: 24,
      includeUppercase: true,
      includeLowercase: true,
      includeNumbers: true,
      includeSymbols: true,
      excludeAmbiguous: false,
      mode: 'password',
      wordCount: 4,
      wordSeparator: '-',
      capitalizeWords: true,
      includeNumberInPassphrase: true,
    });

    expect(pwd.length).toBe(24);
    const stats = calculateCharacterStats(pwd);
    expect(stats.uppercase).toBeGreaterThan(0);
    expect(stats.lowercase).toBeGreaterThan(0);
    expect(stats.numbers).toBeGreaterThan(0);
    expect(stats.symbols).toBeGreaterThan(0);
  });

  it('should generate multi-word passphrases properly', () => {
    const passphrase = generatePassword({
      length: 20,
      includeUppercase: true,
      includeLowercase: true,
      includeNumbers: true,
      includeSymbols: true,
      excludeAmbiguous: false,
      mode: 'passphrase',
      wordCount: 4,
      wordSeparator: '-',
      capitalizeWords: true,
      includeNumberInPassphrase: false,
    });

    const parts = passphrase.split('-');
    expect(parts.length).toBe(4);
    // Check capitalization
    expect(parts[0][0]).toBe(parts[0][0].toUpperCase());
  });
});

