// Tests added during hardening:
// - female mid-bracket lookup: verifies bracket selection logic works for non-male datasets.
// - additional mocked-invalid-value cases (Infinity, NaN): ensure getRemainingExpectancy returns null for non-finite values.
// These comments document the intent of the new tests and why they were introduced.
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

/**
 * Import calculator dynamically inside beforeEach to avoid module cache/mocking issues.
 * getRemainingExpectancy is async (dynamic import), so tests await its result.
 */

let calculateCurrentAge;
let getRemainingExpectancy;

describe('calculator', () => {
  beforeEach(async () => {
    vi.resetModules();
    // Freeze time to 2025-11-10 UTC
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-11-10T00:00:00Z'));

    const mod = await import('../../js/calculator.js');
    calculateCurrentAge = mod.calculateCurrentAge;
    getRemainingExpectancy = mod.getRemainingExpectancy;
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  describe('calculateCurrentAge', () => {
    it('calculates age when birthday has passed this year', () => {
      const birth = new Date('2000-01-01T00:00:00Z');
      expect(calculateCurrentAge(birth)).toBe(25);
    });

    it('calculates age when birthday has not yet occurred this year', () => {
      const birth = new Date('2000-12-31T00:00:00Z');
      expect(calculateCurrentAge(birth)).toBe(24);
    });

    it('handles leap day birthdays correctly (birthday not yet reached)', () => {
      const birth = new Date('2004-02-29T00:00:00Z');
      // 2025-02-28 should be considered before birthday => age 20
      vi.setSystemTime(new Date('2025-02-28T00:00:00Z'));
      expect(calculateCurrentAge(birth)).toBe(20);
    });

    it('returns 0 for future birth dates', () => {
      const birth = new Date('2030-01-01T00:00:00Z');
      expect(calculateCurrentAge(birth)).toBe(0);
    });
  });

  describe('getRemainingExpectancy', () => {
    async function expectedFromData(age, sex) {
      const { lifeExpectancyData } = await import('../../js/data.js');
      const sexData = lifeExpectancyData[sex];
      if (!sexData) return null;
      const lookupAge = Math.max(0, age);
      const brackets = Object.keys(sexData).map(Number).filter(Number.isFinite).sort((a, b) => a - b);
      let applicable = brackets.length ? brackets[0] : null;
      for (const b of brackets) {
        if (lookupAge >= b) applicable = b;
        else break;
      }
      if (applicable === null) return null;
      const val = sexData[applicable.toString()];
      const num = Number(val);
      return Number.isFinite(num) ? num : null;
    }
  
    it('returns remaining years for age in base bracket (data-driven, male)', async () => {
      const age = 25;
      const val = await getRemainingExpectancy(age, 'male');
      const expected = await expectedFromData(age, 'male');
      expect(val).toBeCloseTo(expected, 6);
    });
  
    it('returns remaining years for exact bracket match (data-driven, male)', async () => {
      const age = 50;
      const val = await getRemainingExpectancy(age, 'male');
      const expected = await expectedFromData(age, 'male');
      expect(val).toBeCloseTo(expected, 6);
    });
  
    it('returns remaining years for mid-bracket age (data-driven, female)', async () => {
      const age = 35; // between 30 and 40 brackets
      const val = await getRemainingExpectancy(age, 'female');
      const expected = await expectedFromData(age, 'female');
      expect(val).toBeCloseTo(expected, 6);
    });
  
    it('returns highest bracket for very large ages (data-driven)', async () => {
      const age = 150;
      const val = await getRemainingExpectancy(age, 'male');
      const expected = await expectedFromData(age, 'male');
      expect(val).toBeCloseTo(expected, 6);
    });
  
    it('returns null for unknown sex', async () => {
      const val = await getRemainingExpectancy(30, 'nonbinary');
      expect(val).toBeNull();
    });
  
    it('returns null if data value is invalid (mocked - non-numeric string)', async () => {
      // Mock the data module to return invalid (non-numeric) value
      vi.resetModules();
      vi.mock('../../js/data.js', () => ({ lifeExpectancyData: { male: { "0": "invalid" } } }), { virtual: true });
      const mod = await import('../../js/calculator.js');
      const val = await mod.getRemainingExpectancy(10, 'male');
      expect(val).toBeNull();
    });

    it('returns null if data value is Infinity (mocked)', async () => {
      vi.resetModules();
      vi.mock('../../js/data.js', () => ({ lifeExpectancyData: { male: { "0": Infinity } } }), { virtual: true });
      const mod = await import('../../js/calculator.js');
      const val = await mod.getRemainingExpectancy(0, 'male');
      expect(val).toBeNull();
    });

    it('returns null if data value is NaN (mocked)', async () => {
      vi.resetModules();
      vi.mock('../../js/data.js', () => ({ lifeExpectancyData: { male: { "0": NaN } } }), { virtual: true });
      const mod = await import('../../js/calculator.js');
      const val = await mod.getRemainingExpectancy(0, 'male');
      expect(val).toBeNull();
    });
  });
});