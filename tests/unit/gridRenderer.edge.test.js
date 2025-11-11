import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('gridRenderer edge cases', () => {
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

    // Minimal date-fns mock implementing only functions used by renderAgeGrid for this test.
    // The mock intentionally returns 54 weeks for eachWeekOfInterval so we can verify the code
    // enforces a maximum visual row length of 53 by removing the last week.
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
      eachWeekOfInterval: ({ start, end }) => {
        // Produce an array of 54 consecutive week-start dates beginning at `start`.
        const weeks = [];
        for (let i = 0; i < 54; i++) {
          const dt = new Date(start);
          dt.setUTCDate(dt.getUTCDate() + i * 7);
          weeks.push(new Date(Date.UTC(dt.getUTCFullYear(), dt.getUTCMonth(), dt.getUTCDate())));
        }
        return weeks;
      },
      isBefore: (a, b) => a.getTime() < b.getTime(),
      isAfter: (a, b) => a.getTime() > b.getTime(),
      format: (d, fmt) => {
        const y = d.getUTCFullYear();
        const m = String(d.getUTCMonth() + 1).padStart(2, '0');
        const day = String(d.getUTCDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
      }
    };
  });

  it('renderAgeGrid enforces max 53 weeks when eachWeekOfInterval yields 54', async () => {
    // Import after setting the mock
    const { renderAgeGrid } = await import('../../js/gridRenderer.js');

    // Create a container element (jsdom)
    const container = document.createElement('div');

    // Choose a birth date and request 1 year of rendering so only age 0 row is generated
    const birthDateUTC = new Date(Date.UTC(2000, 0, 1));
    renderAgeGrid(birthDateUTC, 1, container);

    // Find the row for age 0
    const ageRow = container.querySelector('.year-row[data-age="0"]');
    expect(ageRow).toBeTruthy();

    // Expect 53 week-block children (the renderer should remove the 54th)
    const weekBlocks = ageRow.querySelectorAll('.week-block');
    expect(weekBlocks.length).toBe(53);
  });
});