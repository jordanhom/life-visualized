/**
 * tests/unit/gridRenderer.failure.test.js
 *
 * Tests for renderer failure modes (missing dateFns, renderer errors)
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('gridRenderer failure modes', () => {
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
    // Freeze time
    vi.setSystemTime(new Date('2025-01-01T00:00:00Z'));
    // Ensure no global.dateFns is present
    if (global.dateFns) delete global.dateFns;
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    if (global.dateFns) delete global.dateFns;
    // Clean up DOM globals
    if (global.window) delete global.window;
    if (global.document) delete global.document;
    if (global.HTMLElement) delete global.HTMLElement;
    if (global.Node) delete global.Node;
  });

  it('shows an error message in the DOM when dateFns is missing for calendar renderer', async () => {
    const { renderCalendarGrid } = await import('../../js/gridRenderer.js');
    const container = document.createElement('div');
    const birthDateUTC = new Date(Date.UTC(2000, 0, 1));
    renderCalendarGrid(birthDateUTC, 1, container);
    const err = container.querySelector('.error-message');
    expect(err).not.toBeNull();
    expect(err.textContent).toContain('Error: Date library failed to load');
  });

  it('shows an error message in the DOM when dateFns is missing for age renderer', async () => {
    const { renderAgeGrid } = await import('../../js/gridRenderer.js');
    const container = document.createElement('div');
    const birthDateUTC = new Date(Date.UTC(2000, 0, 1));
    renderAgeGrid(birthDateUTC, 1, container);
    const err = container.querySelector('.error-message');
    expect(err).not.toBeNull();
    expect(err.textContent).toContain('Error: Date library failed to load');
  });

  it('shows an error message in the DOM when dateFns is missing for months renderer', async () => {
    const { renderMonthsGrid } = await import('../../js/gridRenderer.js');
    const container = document.createElement('div');
    const birthDateUTC = new Date(Date.UTC(2000, 0, 1));
    renderMonthsGrid(birthDateUTC, 1, container);
    const err = container.querySelector('.error-message');
    expect(err).not.toBeNull();
    expect(err.textContent).toContain('Error: Date library failed to load');
  });

  it('shows an error message when months renderer throws unexpectedly', async () => {
    global.dateFns = {
      startOfDay: (date) => date,
    };

    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { renderMonthsGrid } = await import('../../js/gridRenderer.js');
    const container = document.createElement('div');
    const invalidBirthDate = new Date(Date.UTC(2000, 0, 1));
    invalidBirthDate.getUTCMonth = () => {
      throw new Error('forced months failure');
    };

    renderMonthsGrid(invalidBirthDate, 1, container);

    const err = container.querySelector('.error-message');
    expect(err).not.toBeNull();
    expect(err.textContent).toContain('Error generating months-based grid.');
    expect(errSpy).toHaveBeenCalled();
  });

  it('shows an error message in the DOM when dateFns is missing for years renderer', async () => {
    const { renderYearsGrid } = await import('../../js/gridRenderer.js');
    const container = document.createElement('div');
    const birthDateUTC = new Date(Date.UTC(2000, 0, 1));
    renderYearsGrid(birthDateUTC, 1, container);
    const err = container.querySelector('.error-message');
    expect(err).not.toBeNull();
    expect(err.textContent).toContain('Error: Date library failed to load');
  });

  it('shows an error message when calendar renderer throws unexpectedly', async () => {
    global.dateFns = {
      startOfDay: () => {
        throw new Error('forced calendar failure');
      },
    };

    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { renderCalendarGrid } = await import('../../js/gridRenderer.js');
    const container = document.createElement('div');
    const birthDateUTC = new Date(Date.UTC(2000, 0, 1));

    renderCalendarGrid(birthDateUTC, 1, container);

    const err = container.querySelector('.error-message');
    expect(err).not.toBeNull();
    expect(err.textContent).toContain('Error generating calendar-based grid.');
    expect(errSpy).toHaveBeenCalled();
  });
});
