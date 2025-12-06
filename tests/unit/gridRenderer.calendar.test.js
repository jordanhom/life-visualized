/**
 * tests/unit/gridRenderer.calendar.test.js
 *
 * Tests for renderCalendarGrid (ISO weeks, out-of-bounds)
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('gridRenderer calendar view', () => {
  beforeEach(async () => {
    // Reset module cache so we can inject a fresh global `dateFns` mock before importing the renderer.
    vi.resetModules();

    // Create a JSDOM document/window so DOM APIs are available in Node test environment.
    const { JSDOM } = await import('jsdom');
    const dom = new JSDOM('<!doctype html><html><body></body></html>');
    // Expose minimal globals used by the renderer and tests
    global.window = dom.window;
    global.document = dom.window.document;
    global.HTMLElement = dom.window.HTMLElement;
    global.Node = dom.window.Node;

    // Minimal date-fns mock implementing only functions used by renderCalendarGrid for this test.
    global.dateFns = {
      startOfDay: (d) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())),
      startOfISOWeek: (d) => {
        const dt = new Date(d);
        const day = dt.getUTCDay(); // 0 (Sun) .. 6 (Sat)
        // ISO week starts on Monday (1). Compute diff to Monday.
        const diff = (day === 0 ? -6 : 1) - day;
        return new Date(Date.UTC(dt.getUTCFullYear(), dt.getUTCMonth(), dt.getUTCDate() + diff));
      },
      addYears: (d, n) => new Date(Date.UTC(d.getUTCFullYear() + n, d.getUTCMonth(), d.getUTCDate())),
      getISOWeekYear: (d) => {
        // Simple implementation for testing
        const date = new Date(d);
        const day = date.getUTCDay();
        const thursday = new Date(date);
        thursday.setUTCDate(date.getUTCDate() + (4 - day));
        return thursday.getUTCFullYear();
      },
      getISOWeeksInYear: (d) => {
        // Simple implementation for testing
        return 52; // Default to 52 weeks in year
      },
      setISOWeekYear: (date, isoYear) => new Date(Date.UTC(isoYear, 0, 4)),
      setISOWeek: (date, weekNum) => {
        const firstWeekMonday = new Date(Date.UTC(date.getUTCFullYear(), 0, 4));
        return new Date(firstWeekMonday.getTime() + (weekNum - 1) * 7 * 24 * 60 * 60 * 1000);
      },
      format: (d, _fmt, _opts) => {
        const y = d.getUTCFullYear();
        const m = String(d.getUTCMonth() + 1).padStart(2, '0');
        const day = String(d.getUTCDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
      },
      isBefore: (a, b) => a.getTime() < b.getTime(),
      isAfter: (a, b) => a.getTime() > b.getTime(),
    };
  });

  it('renders calendar rows and marks out-of-bounds weeks and no error when dateFns present', async () => {
    const { renderCalendarGrid } = await import('../../js/gridRenderer.js');

    const birthDateUTC = new Date(Date.UTC(2000, 0, 1)); // 2000-01-01 UTC
    const totalYears = 2; // render roughly 2 years of weeks
    const container = document.createElement('div');

    // Call renderer
    renderCalendarGrid(birthDateUTC, totalYears, container);

    // Should have year-row elements appended
    const rows = container.querySelectorAll('.year-row');
    expect(rows.length).toBeGreaterThan(0);

    // Should not show error message
    expect(container.querySelector('.error-message')).toBeNull();

    // There should be at least one out-of-bounds block (weeks before birth or after end)
    const oob = container.querySelectorAll('.out-of-bounds');
    expect(oob.length).toBeGreaterThan(0);

    // Ensure at least one week-block exists and has title with 'Year'
    const someWeek = container.querySelector('.week-block');
    expect(someWeek).not.toBeNull();
    expect(someWeek.title).toContain('Year');
  });

  it('handles 53-week ISO years by capping week rows to at most 53 blocks', async () => {
    // Recreate environment with a mock that reports 53 weeks in a year
    vi.resetModules();
    const { JSDOM } = await import('jsdom');
    const dom = new JSDOM('<!doctype html><html><body></body></html>');
    global.window = dom.window;
    global.document = dom.window.document;
    global.HTMLElement = dom.window.HTMLElement;
    global.Node = dom.window.Node;

    // date-fns mock with 53 weeks in year
    global.dateFns = {
      startOfDay: (d) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())),
      startOfISOWeek: (d) => {
        const dt = new Date(d);
        const day = dt.getUTCDay();
        const diff = (day === 0 ? -6 : 1) - day;
        return new Date(Date.UTC(dt.getUTCFullYear(), dt.getUTCMonth(), dt.getUTCDate() + diff));
      },
      addYears: (d, n) => new Date(Date.UTC(d.getUTCFullYear() + n, d.getUTCMonth(), d.getUTCDate())),
      getISOWeekYear: (d) => new Date(d).getUTCFullYear(),
      getISOWeeksInYear: (d) => 53,
      setISOWeekYear: (date, isoYear) => new Date(Date.UTC(isoYear, 0, 4)),
      setISOWeek: (date, weekNum) => {
        const firstWeekMonday = new Date(Date.UTC(date.getUTCFullYear(), 0, 4));
        return new Date(firstWeekMonday.getTime() + (weekNum - 1) * 7 * 24 * 60 * 60 * 1000);
      },
      format: (d) => {
        const y = d.getUTCFullYear();
        const m = String(d.getUTCMonth() + 1).padStart(2, '0');
        const day = String(d.getUTCDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
      },
      isBefore: (a, b) => a.getTime() < b.getTime(),
      isAfter: (a, b) => a.getTime() > b.getTime(),
    };

    const { renderCalendarGrid } = await import('../../js/gridRenderer.js');

    const birthDateUTC = new Date(Date.UTC(1970, 0, 1));
    const totalYears = 1;
    const container = document.createElement('div');

    renderCalendarGrid(birthDateUTC, totalYears, container);

    const rows = container.querySelectorAll('.year-row');
    expect(rows.length).toBeGreaterThan(0);

    // For each year row, ensure we don't render more than 53 .week-block elements
    rows.forEach((row) => {
      const weekBlocks = row.querySelectorAll('.week-block');
      // The renderer should cap to 53 even when date-fns reports 53 weeks
      expect(weekBlocks.length).toBeLessThanOrEqual(53);
    });
  });

  it('does not throw and renders rows spanning ISO year boundaries (Dec 31 births)', async () => {
    vi.resetModules();
    const { JSDOM } = await import('jsdom');
    const dom = new JSDOM('<!doctype html><html><body></body></html>');
    global.window = dom.window;
    global.document = dom.window.document;
    global.HTMLElement = dom.window.HTMLElement;
    global.Node = dom.window.Node;

    // Basic date-fns mock sufficient for boundary behavior
    global.dateFns = {
      startOfDay: (d) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())),
      startOfISOWeek: (d) => {
        const dt = new Date(d);
        const day = dt.getUTCDay();
        const diff = (day === 0 ? -6 : 1) - day;
        return new Date(Date.UTC(dt.getUTCFullYear(), dt.getUTCMonth(), dt.getUTCDate() + diff));
      },
      addYears: (d, n) => new Date(Date.UTC(d.getUTCFullYear() + n, d.getUTCMonth(), d.getUTCDate())),
      getISOWeekYear: (d) => {
        const date = new Date(d);
        const day = date.getUTCDay();
        const thursday = new Date(date);
        thursday.setUTCDate(date.getUTCDate() + (4 - day));
        return thursday.getUTCFullYear();
      },
      getISOWeeksInYear: () => 52,
      setISOWeekYear: (date, isoYear) => new Date(Date.UTC(isoYear, 0, 4)),
      setISOWeek: (date, weekNum) => {
        const firstWeekMonday = new Date(Date.UTC(date.getUTCFullYear(), 0, 4));
        return new Date(firstWeekMonday.getTime() + (weekNum - 1) * 7 * 24 * 60 * 60 * 1000);
      },
      format: (d) => {
        const y = d.getUTCFullYear();
        const m = String(d.getUTCMonth() + 1).padStart(2, '0');
        const day = String(d.getUTCDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
      },
      isBefore: (a, b) => a.getTime() < b.getTime(),
      isAfter: (a, b) => a.getTime() > b.getTime(),
    };

    const { renderCalendarGrid } = await import('../../js/gridRenderer.js');

    // Birthdate Dec 31 which can fall into ISO week of the following year
    const birthDateUTC = new Date(Date.UTC(2020, 11, 31));
    const totalYears = 2;
    const container = document.createElement('div');

    // This should not throw and should render year-row elements for the span
    renderCalendarGrid(birthDateUTC, totalYears, container);

    const rows = container.querySelectorAll('.year-row');
    expect(rows.length).toBeGreaterThanOrEqual(1);

    // Ensure week blocks exist and have titles (indicating successful render)
    const weekBlocks = container.querySelectorAll('.week-block');
    expect(weekBlocks.length).toBeGreaterThan(0);
    expect(weekBlocks[0].title).toContain('Year');
  });
});