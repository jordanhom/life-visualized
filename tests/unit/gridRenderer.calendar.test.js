import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { setupJSDOM, teardownJSDOM } from '../setup/jsdom-helper.js';

describe('gridRenderer calendar view', () => {
  let dom;
  let originalTimezone;

  beforeEach(async () => {
    vi.resetModules();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-01-06T12:00:00Z'));
    originalTimezone = process.env.TZ;
    process.env.TZ = 'UTC';
    dom = await setupJSDOM();
  });

  afterEach(() => {
    if (originalTimezone === undefined) delete process.env.TZ;
    else process.env.TZ = originalTimezone;
    teardownJSDOM(dom);
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('renders calendar rows and marks lifespan boundaries', async () => {
    const { renderCalendarGrid } = await import('../../js/gridRenderer.js');
    const container = document.createElement('div');

    renderCalendarGrid(new Date('2000-01-01T00:00:00Z'), 2, container);

    expect(container.querySelectorAll('.year-row').length).toBeGreaterThan(0);
    expect(container.querySelector('.error-message')).toBeNull();
    expect(container.querySelectorAll('.out-of-bounds').length).toBeGreaterThan(0);
    expect(container.querySelector('.week-block')?.title).toContain('Year');
  });

  it('calculates known 52 and 53 week ISO years from UTC boundaries', async () => {
    const { renderCalendarGrid } = await import('../../js/gridRenderer.js');
    const container = document.createElement('div');

    renderCalendarGrid(new Date('2014-01-01T00:00:00Z'), 14, container);

    const expectedYears = [
      { year: 2015, count: 53, firstStart: '2014-12-29' },
      { year: 2016, count: 52, firstStart: '2016-01-04' },
      { year: 2020, count: 53, firstStart: '2019-12-30' },
      { year: 2021, count: 52, firstStart: '2021-01-04' },
      { year: 2025, count: 52, firstStart: '2024-12-30' },
      { year: 2026, count: 53, firstStart: '2025-12-29' },
    ];

    for (const { year, count, firstStart } of expectedYears) {
      const blocks = [...container.querySelectorAll(`[data-year="${year}"] .week-block`)];
      expect(blocks).toHaveLength(count);
      expect(blocks[0].title).toContain(`Starts UTC: ${firstStart}`);
      expect(new Set(blocks.map((block) => block.title)).size).toBe(count);
    }
  });

  it('preserves fractional lifespan years through the final ISO year', async () => {
    const { renderCalendarGrid } = await import('../../js/gridRenderer.js');
    const container = document.createElement('div');

    renderCalendarGrid(new Date('2020-01-01T00:00:00Z'), 1.5, container);

    expect(container.querySelector('[data-year="2021"]')).not.toBeNull();
  });

  it('renders rows across a December 31 ISO year boundary', async () => {
    const { renderCalendarGrid } = await import('../../js/gridRenderer.js');
    const container = document.createElement('div');

    renderCalendarGrid(new Date('2020-12-31T00:00:00Z'), 2, container);

    expect(container.querySelectorAll('.year-row').length).toBeGreaterThanOrEqual(1);
    expect(container.querySelector('.week-block')?.title).toContain('Year');
  });

  it('marks the current local calendar week across a UTC date rollover', async () => {
    const { renderCalendarGrid } = await import('../../js/gridRenderer.js');
    vi.setSystemTime(new Date('2025-01-06T01:00:00Z'));

    const expectations = [
      ['America/Los_Angeles', 'Starts UTC: 2024-12-30'],
      ['UTC', 'Starts UTC: 2025-01-06'],
      ['Asia/Tokyo', 'Starts UTC: 2025-01-06'],
    ];

    for (const [timezone, expectedStart] of expectations) {
      process.env.TZ = timezone;
      const container = document.createElement('div');
      renderCalendarGrid(new Date('2024-01-01T00:00:00Z'), 2, container);

      expect(container.querySelectorAll('.present')).toHaveLength(1);
      expect(container.querySelector('.present')?.title).toContain(expectedStart);
      expect(container.querySelectorAll('.future').length).toBeGreaterThan(0);
    }
  });
});
