import { it, expect } from 'vitest';
import { lifeExpectancyData } from '../../js/data.js';

it('inspect lifeExpectancyData keys (debug)', () => {
  // Diagnostic: ensure male/female keys exist and have multiple brackets
  const keys = Object.keys(lifeExpectancyData);
  expect(keys).toContain('male');
  expect(keys).toContain('female');
  expect(Object.keys(lifeExpectancyData.male).length).toBeGreaterThan(5);
});
