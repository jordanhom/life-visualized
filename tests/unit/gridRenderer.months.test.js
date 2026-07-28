import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { setupJSDOM, teardownJSDOM } from '../setup/jsdom-helper.js';

const TEST_TIMEZONES = [
  'UTC',
  'America/Los_Angeles',
  'Europe/London',
  'Asia/Tokyo',
  'Pacific/Auckland',
];

describe('gridRenderer months view', () => {
  let dom;
  let originalTimezone;

  beforeEach(async () => {
    vi.resetModules();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-07-15T12:00:00Z'));
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

  it('renders identical UTC boundaries and states across browser timezones', async () => {
    const { renderMonthsGrid } = await import('../../js/gridRenderer.js');

    for (const timezone of TEST_TIMEZONES) {
      process.env.TZ = timezone;
      const container = document.createElement('div');

      renderMonthsGrid(new Date('2025-01-01T00:00:00Z'), 1, container);

      const blocks = Array.from(container.querySelectorAll('.month-block'));
      expect(blocks).toHaveLength(12);
      expect(container.querySelectorAll('.month-row')).toHaveLength(1);
      expect(blocks[0].title).toContain('Starts UTC: 2025-01-01');
      expect(blocks[11].title).toContain('Starts UTC: 2025-12-01');
      expect(container.querySelectorAll('.past')).toHaveLength(6);
      expect(container.querySelectorAll('.present')).toHaveLength(1);
      expect(container.querySelector('.present').title).toContain('Starts UTC: 2025-07-01');
      expect(container.querySelectorAll('.future')).toHaveLength(5);
    }
  });

  it('renders the exact fractional-lifespan month count without duplicate boundaries', async () => {
    const { renderMonthsGrid } = await import('../../js/gridRenderer.js');
    const container = document.createElement('div');

    renderMonthsGrid(new Date('2000-01-31T00:00:00Z'), 0.25, container);

    const blocks = Array.from(container.querySelectorAll('.month-block'));
    const starts = blocks.map((block) => block.title.match(/Starts UTC: ([0-9-]+)/)?.[1]);
    expect(blocks).toHaveLength(Math.ceil(0.25 * 12));
    expect(starts).toEqual(['2000-01-01', '2000-02-01', '2000-03-01']);
    expect(new Set(starts).size).toBe(starts.length);
  });

  it('assigns life stages from corrected UTC month starts', async () => {
    const { renderMonthsGrid } = await import('../../js/gridRenderer.js');
    const container = document.createElement('div');

    renderMonthsGrid(new Date('2000-01-15T00:00:00Z'), 1.1, container);

    const blocks = Array.from(container.querySelectorAll('.month-block'));
    expect(blocks).toHaveLength(14);
    expect(blocks[12].title).toContain('Starts UTC: 2001-01-01');
    expect(blocks[12].classList.contains('stage-infancy')).toBe(true);
    expect(blocks[13].title).toContain('Starts UTC: 2001-02-01');
    expect(blocks[13].classList.contains('stage-toddler')).toBe(true);
  });

  it('marks the current local month across a UTC year rollover', async () => {
    const { renderMonthsGrid } = await import('../../js/gridRenderer.js');
    vi.setSystemTime(new Date('2025-01-01T01:00:00Z'));

    for (const [timezone, expectedStart] of [
      ['America/Los_Angeles', '2024-12-01'],
      ['UTC', '2025-01-01'],
      ['Asia/Tokyo', '2025-01-01'],
    ]) {
      process.env.TZ = timezone;
      const container = document.createElement('div');
      renderMonthsGrid(new Date('2024-01-01T00:00:00Z'), 2, container);

      expect(container.querySelectorAll('.present')).toHaveLength(1);
      expect(container.querySelector('.present')?.title).toContain(`Starts UTC: ${expectedStart}`);
    }
  });
});
