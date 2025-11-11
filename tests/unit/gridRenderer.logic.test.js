import { describe, it, expect } from 'vitest';
import { getLifeStageKey, calculateAgeAtDate } from '../../js/gridRenderer.js';

// Since gridRenderer exports DOM renderers, we only test the exported pure helpers above.
// If these helpers are not exported, we will instead re-create minimal logic in tests.
// (Currently gridRenderer.js exports render functions; if helpers are not exported, adapt tests accordingly)

describe('gridRenderer helpers', () => {
  it('calculateAgeAtDate computes correct age for standard dates', () => {
    const birth = new Date(Date.UTC(2000, 0, 15)); // 2000-01-15
    const check = new Date(Date.UTC(2025, 0, 15)); // 2025-01-15 (birthday)
    expect(calculateAgeAtDate(check, birth)).toBe(25);

    const before = new Date(Date.UTC(2025, 0, 14)); // day before birthday
    expect(calculateAgeAtDate(before, birth)).toBe(24);
  });

  it('getLifeStageKey returns expected stage keys at boundaries', () => {
    expect(getLifeStageKey(0)).toBe('infancy');
    expect(getLifeStageKey(1)).toBe('toddler');
    expect(getLifeStageKey(3)).toBe('earlychildhood');
    expect(getLifeStageKey(12)).toBe('adolescence');
    expect(getLifeStageKey(18)).toBe('youngadult');
    expect(getLifeStageKey(40)).toBe('middleadulthood');
    expect(getLifeStageKey(65)).toBe('earlysenior');
    expect(getLifeStageKey(90)).toBe('latesenior');
  });
});