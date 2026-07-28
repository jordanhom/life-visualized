import { afterEach, describe, it, expect, beforeEach, vi } from 'vitest';
import { setupJSDOM, teardownJSDOM } from '../setup/jsdom-helper.js';

describe('gridRenderer edge cases', () => {
  let dom;
  let originalTimezone;

  beforeEach(async () => {
    vi.resetModules();
    originalTimezone = process.env.TZ;
    dom = await setupJSDOM();
  });

  afterEach(() => {
    if (originalTimezone === undefined) delete process.env.TZ;
    else process.env.TZ = originalTimezone;
    teardownJSDOM(dom);
    vi.useRealTimers();
  });

  it('renderAgeGrid enforces max 53 weeks for a natural 54-week span', async () => {
    const { renderAgeGrid } = await import('../../js/gridRenderer.js');
    const container = document.createElement('div');

    const birthDateUTC = new Date(Date.UTC(1903, 2, 1));
    renderAgeGrid(birthDateUTC, 1, container);

    const ageRow = container.querySelector('.year-row[data-age="0"]');
    expect(ageRow).toBeTruthy();
    const weekBlocks = ageRow.querySelectorAll('.week-block');
    expect(weekBlocks.length).toBe(53);
  });

  it('marks the current local week in the age grid across a UTC rollover', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-01-06T01:00:00Z'));
    const { renderAgeGrid } = await import('../../js/gridRenderer.js');

    for (const [timezone, expectedStart] of [
      ['America/Los_Angeles', '2024-12-30'],
      ['UTC', '2025-01-06'],
      ['Asia/Tokyo', '2025-01-06'],
    ]) {
      process.env.TZ = timezone;
      const container = document.createElement('div');
      renderAgeGrid(new Date('2023-07-01T00:00:00Z'), 3, container);

      expect(container.querySelectorAll('.present')).toHaveLength(1);
      expect(container.querySelector('.present')?.title)
        .toContain(`Starts UTC: ${expectedStart}`);
    }
  });
});
