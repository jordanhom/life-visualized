/**
 * tests/unit/data.test.js
 *
 * Purpose:
 * - Verify the shape and basic integrity of the exported lifeExpectancyData object.
 * - Ensure both 'male' and 'female' keys exist.
 * - Ensure bracket keys are numeric-strings and values are parseable finite numbers.
 *
 * Rationale:
 * - Tests guard against accidental schema changes (string keys, missing base bracket)
 *   and non-numeric values which would break calculator lookup logic.
 */
import { it, expect } from 'vitest';
import { lifeExpectancyData } from '../../js/data.js';

it('has male and female keys and numeric values with numeric-string keys', () => {
  expect(lifeExpectancyData).toHaveProperty('male');
  expect(lifeExpectancyData).toHaveProperty('female');

  for (const sex of ['male', 'female']) {
    const keys = Object.keys(lifeExpectancyData[sex]);
    expect(keys.length).toBeGreaterThan(0);
    // Ensure a base bracket (0) exists
    expect(keys.some(k => Number(k) === 0)).toBe(true);

    for (const k of keys) {
      // Keys should be numeric strings (parsable to finite numbers)
      expect(Number.isFinite(Number(k))).toBe(true);

      const v = lifeExpectancyData[sex][k];
      // Values should be numeric (or numeric-like) and finite
      expect(Number.isFinite(Number(v))).toBe(true);
    }
  }
});