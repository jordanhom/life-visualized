/**
 * tests/unit/gridRenderer.years.test.js
 *
 * Tests for renderYearsGrid (decade rows, current year highlight)
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

function makeMockDateFns() {
  function startOfDay(d) {
    const dt = new Date(d);
    return new Date(Date.UTC(dt.getUTCFullYear(), dt.getUTCMonth(), dt.getUTCDate()));
  }
  function addYears(d, years) {
    const dt = new Date(Date.UTC(d.getUTCFullYear() + years, d.getUTCMonth(), d.getUTCDate()));
    return dt;
  }
  function startOfISOWeek(d) {
    const dt = new Date(d);
    const day = dt.getUTCDay() === 0 ? 7 : dt.getUTCDay();
    const diff = day - 1;
    return new Date(Date.UTC(dt.getUTCFullYear(), dt.getUTCMonth(), dt.getUTCDate() - diff));
  }
  function format(d, _fmt, _opts) {
    const dt = new Date(d);
    const y = dt.getUTCFullYear();
    const m = String(dt.getUTCMonth() + 1).padStart(2, '0');
    const day = String(dt.getUTCDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }
  function isAfter(a, b) { return a.getTime() > b.getTime(); }
  function isBefore(a, b) { return a.getTime() < b.getTime(); }

  return { startOfDay, addYears, startOfISOWeek, format, isAfter, isBefore, version: '4.1.0-mock' };
}

describe('gridRenderer years view', () => {
  beforeEach(async () => {
    vi.resetModules();
    // Create a JSDOM document/window so DOM APIs are available in Node test environment.
    const { JSDOM } = await import('jsdom');
    const dom = new JSDOM('<!doctype html><html><body></body></html>');
    global.window = dom.window;
    global.document = dom.window.document;
    global.HTMLElement = dom.window.HTMLElement;
    global.Node = dom.window.Node;

    vi.useFakeTimers();
    // Freeze to 2025-07-01 so current age can be deterministic
    vi.setSystemTime(new Date('2025-07-01T00:00:00Z'));
    global.dateFns = makeMockDateFns();
  });

  afterEach(() => {
    vi.useRealTimers();
    delete global.dateFns;
    vi.restoreAllMocks();
  });

  it('renders decades (10 years per row) and highlights the current year block', async () => {
    const { renderYearsGrid } = await import('../../js/gridRenderer.js');
    const birthDateUTC = new Date(Date.UTC(2000, 6, 1)); // July 1, 2000
    const totalYears = 30; // render 30 years
    const container = document.createElement('div');

    renderYearsGrid(birthDateUTC, totalYears, container);

    // Should have decade-row elements (expect ceil(totalYears / 10))
    const decades = container.querySelectorAll('.decade-row');
    expect(decades.length).toBe(Math.ceil(totalYears / 10));

    // Year blocks should exist and count should be equal to totalYears (or slightly more if renderer includes padding)
    const yearBlocks = container.querySelectorAll('.year-block');
    expect(yearBlocks.length).toBeGreaterThanOrEqual(totalYears);

    // Each decade row should contain at most 10 year-blocks
    decades.forEach((row) => {
      const blocks = row.querySelectorAll('.year-block');
      expect(blocks.length).toBeLessThanOrEqual(10);
    });

    // There should be at least one 'present' class representing the current age/year
    const present = container.querySelectorAll('.present');
    expect(present.length).toBeGreaterThanOrEqual(1);

    // The present block title should contain 'Current year' and indicate the correct year (2025)
    const presentBlock = Array.from(container.querySelectorAll('.year-block')).find(b => b.classList.contains('present'));
    expect(presentBlock).toBeDefined();
    expect(presentBlock.title).toContain('Current year');
    // Ensure the title contains the expected year string (from frozen system time 2025-07-01)
    expect(presentBlock.title).toMatch(/2025/);
  });

  it('skips rendering year blocks that start after estimated end date', async () => {
    vi.resetModules();
    global.dateFns = {
      ...makeMockDateFns(),
      // Force a short estimated end for fractional lifespan input, but larger jumps for integer year indices.
      addYears: (d, years) => {
        const dt = new Date(d);
        const yearsToAdd = Number.isInteger(years) ? years * 2 : 1;
        return new Date(Date.UTC(dt.getUTCFullYear() + yearsToAdd, dt.getUTCMonth(), dt.getUTCDate()));
      },
    };

    const { renderYearsGrid } = await import('../../js/gridRenderer.js');
    const birthDateUTC = new Date(Date.UTC(2000, 0, 1));
    const container = document.createElement('div');

    // ceil(2.5) => 3 iterations, but only first block should remain within the forced short end date.
    renderYearsGrid(birthDateUTC, 2.5, container);

    const yearBlocks = container.querySelectorAll('.year-block');
    expect(yearBlocks.length).toBe(1);
  });

  it('renders an error message when years rendering throws unexpectedly', async () => {
    vi.resetModules();
    global.dateFns = {
      ...makeMockDateFns(),
      startOfDay: () => {
        throw new Error('forced startOfDay failure');
      },
    };

    const { renderYearsGrid } = await import('../../js/gridRenderer.js');
    const container = document.createElement('div');

    renderYearsGrid(new Date(Date.UTC(2000, 0, 1)), 3, container);

    const err = container.querySelector('.error-message');
    expect(err).not.toBeNull();
    expect(err.textContent).toContain('Error generating years-based grid.');
  });
});
