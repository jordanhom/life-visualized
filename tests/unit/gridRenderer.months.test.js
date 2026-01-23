/**
 * tests/unit/gridRenderer.months.test.js
 *
 * Tests for renderMonthsGrid (12 months per row, month state)
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('gridRenderer months view', () => {
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

    // Minimal date-fns mock implementing only functions used by renderMonthsGrid for this test.
    global.dateFns = {
      startOfDay: (d) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())),
      startOfMonth: (d) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1)),
      addMonths: (d, n) => {
        const dt = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
        const year = dt.getUTCFullYear() + Math.floor((dt.getUTCMonth() + n) / 12);
        const month = (dt.getUTCMonth() + n) % 12;
        return new Date(Date.UTC(year, month, dt.getUTCDate()));
      },
      addYears: (d, n) => new Date(Date.UTC(d.getUTCFullYear() + n, d.getUTCMonth(), d.getUTCDate())),
      isAfter: (a, b) => a.getTime() > b.getTime(),
      isBefore: (a, b) => a.getTime() < b.getTime(),
      format: (d, _fmt, _opts) => {
        const y = d.getUTCFullYear();
        const m = String(d.getUTCMonth() + 1).padStart(2, '0');
        const day = String(d.getUTCDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
      },
    };
  });

  afterEach(() => {
    // Clean up globals that were set in beforeEach
    delete global.window;
    delete global.document;
    delete global.HTMLElement;
    delete global.Node;
    if (global.dateFns) delete global.dateFns;
    vi.restoreAllMocks();
  });

  it('renders 12 months per row and marks past/present/future months', async () => {
    const { renderMonthsGrid } = await import('../../js/gridRenderer.js');
    // Use current UTC month to ensure a 'present' month exists deterministically.
    const nowUTC = new Date();
    // Use a birth date earlier than the current month so the rendered year contains past, present, and future months
    const birthDateUTC = new Date(Date.UTC(nowUTC.getUTCFullYear(), nowUTC.getUTCMonth() - 6, 1));
    const totalYears = 1; // render 12 months
    const container = document.createElement('div');

    renderMonthsGrid(birthDateUTC, totalYears, container);

    // Should have month-row elements (one row for 12 months)
    const rows = container.querySelectorAll('.month-row');
    expect(rows.length).toBeGreaterThanOrEqual(1);

    // Each month-row should contain exactly 12 .month-block children for a single-year render
    const firstRow = rows[0];
    const monthBlocks = firstRow.querySelectorAll('.month-block');
    expect(monthBlocks.length).toBe(12);

    // Each row should never have more than 12 month blocks
    rows.forEach(row => {
      const blocks = row.querySelectorAll('.month-block');
      expect(blocks.length).toBeLessThanOrEqual(12);
    });

    // There should be at least one 'present' class (for current month)
    const present = container.querySelectorAll('.present');
    expect(present.length).toBeGreaterThan(0);

    // There should be at least one 'past' and one 'future' month-block
    const past = container.querySelectorAll('.past');
    const future = container.querySelectorAll('.future');
    expect(past.length).toBeGreaterThan(0);
    expect(future.length).toBeGreaterThan(0);

    // Ensure titles contain 'Age' and 'Month'
    const some = container.querySelector('.month-block');
    expect(some).not.toBeNull();
    expect(some.title).toContain('Age');
    expect(some.title).toContain('Month');
  });
});