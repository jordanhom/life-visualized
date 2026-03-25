import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

/**
 * Tests for js/calculator.js
 *
 * Strategy:
 * - Import the calculator module inside each test to ensure any mocked
 *   './data.js' module registrations occur before the module is loaded.
 * - Use vitest fake timers to freeze system time for deterministic age calculations.
 */

beforeEach(() => {
  // Ensure a clean module registry before each test and freeze time by default.
  vi.resetModules();
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2025-11-10T00:00:00Z'));
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('calculator', () => {
  describe('calculateCurrentAge', () => {
    it('calculates age when birthday has passed this year', async () => {
      const { calculateCurrentAge } = await import('../../js/calculator.js');
      const birth = new Date('2000-01-01T00:00:00Z');
      expect(calculateCurrentAge(birth)).toBe(25);
    });

    it('calculates age when birthday has not yet occurred this year', async () => {
      const { calculateCurrentAge } = await import('../../js/calculator.js');
      const birth = new Date('2000-12-31T00:00:00Z');
      expect(calculateCurrentAge(birth)).toBe(24);
    });

    it('handles leap day birthdays correctly (birthday not yet reached)', async () => {
      const { calculateCurrentAge } = await import('../../js/calculator.js');
      const birth = new Date('2004-02-29T00:00:00Z');
      // 2025-02-28 should be considered before birthday => age 20
      vi.setSystemTime(new Date('2025-02-28T00:00:00Z'));
      expect(calculateCurrentAge(birth)).toBe(20);
    });

    it('handles leap day birthdays correctly (birthday passed on Mar 1)', async () => {
      const { calculateCurrentAge } = await import('../../js/calculator.js');
      const birth = new Date('2004-02-29T00:00:00Z');
      // 2025-03-01 should be after the birthday => age 21
      vi.setSystemTime(new Date('2025-03-01T00:00:00Z'));
      expect(calculateCurrentAge(birth)).toBe(21);
    });

    it('returns 0 for future birth dates', async () => {
      const { calculateCurrentAge } = await import('../../js/calculator.js');
      const birth = new Date('2030-01-01T00:00:00Z');
      expect(calculateCurrentAge(birth)).toBe(0);
    });

    it('increments age exactly at UTC birthday moment', async () => {
      const { calculateCurrentAge } = await import('../../js/calculator.js');
      // Birthday: 2000-11-10 UTC. If system time equals 2025-11-10T00:00:00Z, age should be 25.
      vi.setSystemTime(new Date('2025-11-10T00:00:00Z'));
      const birth = new Date('2000-11-10T00:00:00Z');
      expect(calculateCurrentAge(birth)).toBe(25);
    });

    it('does not increment age one second before UTC birthday', async () => {
      const { calculateCurrentAge } = await import('../../js/calculator.js');
      // One second before UTC midnight of birthday
      vi.setSystemTime(new Date('2025-11-09T23:59:59Z'));
      const birth = new Date('2000-11-10T00:00:00Z');
      expect(calculateCurrentAge(birth)).toBe(24);
    });

    it('throws error for invalid birth date', async () => {
      const { calculateCurrentAge } = await import('../../js/calculator.js');
      expect(() => calculateCurrentAge("invalid")).toThrowError('Invalid birthDate provided to calculateCurrentAge');
      expect(() => calculateCurrentAge(null)).toThrowError('Invalid birthDate provided to calculateCurrentAge');
      expect(() => calculateCurrentAge(undefined)).toThrowError('Invalid birthDate provided to calculateCurrentAge');
    });
  });

  describe('getRemainingExpectancy', () => {
    // Helper that mirrors calculator's expectedFromData behavior to validate results.
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
      const mod = await import('../../js/calculator.js');
      const val = await mod.getRemainingExpectancy(25, 'male');
      const expected = await expectedFromData(25, 'male');
      expect(val).toBeCloseTo(expected, 6);
    });

    it('returns remaining years for exact bracket match (data-driven, male)', async () => {
      const mod = await import('../../js/calculator.js');
      const val = await mod.getRemainingExpectancy(50, 'male');
      const expected = await expectedFromData(50, 'male');
      expect(val).toBeCloseTo(expected, 6);
    });

    it('returns remaining years for mid-bracket age (data-driven, female)', async () => {
      const mod = await import('../../js/calculator.js');
      const val = await mod.getRemainingExpectancy(35, 'female');
      const expected = await expectedFromData(35, 'female');
      expect(val).toBeCloseTo(expected, 6);
    });

    it('returns highest bracket for very large ages (data-driven)', async () => {
      const mod = await import('../../js/calculator.js');
      const val = await mod.getRemainingExpectancy(150, 'male');
      const expected = await expectedFromData(150, 'male');
      expect(val).toBeCloseTo(expected, 6);
    });

    it('throws error for invalid age', async () => {
      const mod = await import('../../js/calculator.js');
      await expect(mod.getRemainingExpectancy("invalid", "male")).rejects.toThrowError('Invalid age provided to getRemainingExpectancy');
      await expect(mod.getRemainingExpectancy(null, "male")).rejects.toThrowError('Invalid age provided to getRemainingExpectancy');
      await expect(mod.getRemainingExpectancy(undefined, "male")).rejects.toThrowError('Invalid age provided to getRemainingExpectancy');
    });

    it('throws error for invalid sex', async () => {
      const mod = await import('../../js/calculator.js');
      await expect(mod.getRemainingExpectancy(30, "nonbinary")).rejects.toThrowError('Invalid sex provided to getRemainingExpectancy. Must be "male" or "female"');
      await expect(mod.getRemainingExpectancy(30, null)).rejects.toThrowError('Invalid sex provided to getRemainingExpectancy. Must be "male" or "female"');
      await expect(mod.getRemainingExpectancy(30, undefined)).rejects.toThrowError('Invalid sex provided to getRemainingExpectancy. Must be "male" or "female"');
    });

    it('returns null if data value is invalid (overridden - non-numeric string)', async () => {
      vi.resetModules();
      const mod = await import('../../js/calculator.js');
      await expect(mod.getRemainingExpectancy(10, 'male', { male: { "0": "invalid" } })).rejects.toThrowError('Remaining years data not found or invalid for sex: male, age bracket: 0');
    });
 
    it('returns null if data value is Infinity (overridden)', async () => {
      vi.resetModules();
      const mod = await import('../../js/calculator.js');
      await expect(mod.getRemainingExpectancy(0, 'male', { male: { "0": Infinity } })).rejects.toThrowError('Remaining years data not found or invalid for sex: male, age bracket: 0');
    });
 
    it('returns null if data value is NaN (overridden)', async () => {
      vi.resetModules();
      const mod = await import('../../js/calculator.js');
      await expect(mod.getRemainingExpectancy(0, 'male', { male: { "0": NaN } })).rejects.toThrowError('Remaining years data not found or invalid for sex: male, age bracket: 0');
    });
 
    it('selects the nearest lower bracket when exact bracket is missing (overridden deterministic)', async () => {
      vi.resetModules();
      const mod = await import('../../js/calculator.js');
      // age brackets: 0 -> 80, 10 -> 70, 30 -> 50
      // age 25 should pick bracket 10 -> 70
      const val = await mod.getRemainingExpectancy(25, 'male', { male: { "0": 80, "10": 70, "30": 50 } });
      expect(val).toBe(70);
    });
 
    it('handles non-standard numeric-string keys and picks the appropriate lower bracket (overridden)', async () => {
      vi.resetModules();
      const mod = await import('../../js/calculator.js');
      // keys at 5 and 20; age 18 should pick 5
      const val = await mod.getRemainingExpectancy(18, 'male', { male: { "5": 60, "20": 40 } });
      expect(val).toBe(60);
    });
 
    it('falls back to the lowest defined bracket when no bracket <= age is found (overridden)', async () => {
      vi.resetModules();
      const mod = await import('../../js/calculator.js');
      // only key is 100; for age 0 the logic should fallback to keys[0] -> 100
      const val = await mod.getRemainingExpectancy(0, 'male', { male: { "100": 1 } });
      // Expect it to return the value for the lowest defined bracket (100 -> 1)
      expect(val).toBe(1);
    });
    
    it('handles empty data gracefully', async () => {
      vi.resetModules();
      const mod = await import('../../js/calculator.js');
      const val = await mod.getRemainingExpectancy(30, 'male', { male: {} });
      expect(val).toBeNull();
    });

    it('returns null when requested sex data is missing in override', async () => {
      vi.resetModules();
      const mod = await import('../../js/calculator.js');
      const val = await mod.getRemainingExpectancy(30, 'male', { female: { "0": 80 } });
      expect(val).toBeNull();
    });

    it('exercises fallback bracket path when numeric keys are malformed with leading zero', async () => {
      vi.resetModules();
      const mod = await import('../../js/calculator.js');
      await expect(mod.getRemainingExpectancy(0, 'male', { male: { "05": 60 } }))
        .rejects
        .toThrowError('Remaining years data not found or invalid for sex: male, age bracket: 5');
    });

    it('exercises nearest-lower fallback branch with malformed keys before final validation', async () => {
      vi.resetModules();
      const mod = await import('../../js/calculator.js');
      await expect(mod.getRemainingExpectancy(7, 'male', { male: { "05": 60, "10": 50 } }))
        .rejects
        .toThrowError('Remaining years data not found or invalid for sex: male, age bracket: 5');
    });
  });
});
