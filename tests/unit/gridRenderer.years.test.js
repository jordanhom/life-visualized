import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { setupJSDOM, teardownJSDOM } from '../setup/jsdom-helper.js';

const TEST_TIMEZONES = [
  'UTC',
  'America/Los_Angeles',
  'Europe/London',
  'Asia/Tokyo',
  'Pacific/Auckland',
];

describe('gridRenderer years view', () => {
  let dom;
  let originalTimezone;

  beforeEach(async () => {
    vi.resetModules();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-07-01T12:00:00Z'));
    dom = await setupJSDOM();
    originalTimezone = process.env.TZ;

  });

  afterEach(() => {
    if (originalTimezone === undefined) delete process.env.TZ;
    else process.env.TZ = originalTimezone;
    teardownJSDOM(dom);
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('renders identical UTC anniversaries and states across browser timezones', async () => {
    const { renderYearsGrid } = await import('../../js/gridRenderer.js');

    for (const timezone of TEST_TIMEZONES) {
      process.env.TZ = timezone;
      const container = document.createElement('div');

      renderYearsGrid(new Date('1990-06-15T00:00:00Z'), 40, container);

      const blocks = Array.from(container.querySelectorAll('.year-block'));
      expect(blocks).toHaveLength(40);
      expect(container.querySelectorAll('.decade-row')).toHaveLength(4);
      expect(blocks[0].title).toBe('Age 0 (Starts UTC: 1990-06-15)');
      expect(container.querySelectorAll('.past')).toHaveLength(35);
      expect(container.querySelectorAll('.present')).toHaveLength(1);
      expect(container.querySelector('.present').title)
        .toBe('Age 35 (Starts UTC: 2025-06-15) (Current year)');
      expect(container.querySelectorAll('.future')).toHaveLength(4);
    }
  });

  it('preserves the existing fractional-lifespan year block count', async () => {
    const { renderYearsGrid } = await import('../../js/gridRenderer.js');
    const container = document.createElement('div');

    renderYearsGrid(new Date('2000-01-01T00:00:00Z'), 2.5, container);

    const blocks = Array.from(container.querySelectorAll('.year-block'));
    expect(blocks).toHaveLength(Math.ceil(2.5));
    expect(blocks.map((block) => block.title.match(/Starts UTC: ([0-9-]+)/)?.[1]))
      .toEqual(['2000-01-01', '2001-01-01', '2002-01-01']);
  });

  it('uses February 28 for leap-day anniversaries in non-leap years', async () => {
    vi.setSystemTime(new Date('2025-02-28T12:00:00Z'));
    const { renderYearsGrid } = await import('../../js/gridRenderer.js');
    const container = document.createElement('div');

    renderYearsGrid(new Date('2000-02-29T00:00:00Z'), 30, container);

    const blocks = Array.from(container.querySelectorAll('.year-block'));
    expect(blocks.slice(0, 5).map((block) => block.title.match(/Starts UTC: ([0-9-]+)/)?.[1]))
      .toEqual(['2000-02-29', '2001-02-28', '2002-02-28', '2003-02-28', '2004-02-29']);
    expect(container.querySelector('.present').title)
      .toBe('Age 25 (Starts UTC: 2025-02-28) (Current year)');
  });

  it('marks the current local age year across a UTC year rollover', async () => {
    const { renderYearsGrid } = await import('../../js/gridRenderer.js');
    vi.setSystemTime(new Date('2025-01-01T01:00:00Z'));

    for (const [timezone, expectedAge] of [
      ['America/Los_Angeles', 24],
      ['UTC', 25],
      ['Asia/Tokyo', 25],
    ]) {
      process.env.TZ = timezone;
      const container = document.createElement('div');
      renderYearsGrid(new Date('2000-01-01T00:00:00Z'), 30, container);

      expect(container.querySelectorAll('.present')).toHaveLength(1);
      expect(container.querySelector('.present')?.title).toContain(`Age ${expectedAge}`);
    }
  });
});
