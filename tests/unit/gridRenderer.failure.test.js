import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { setupJSDOM, teardownJSDOM } from '../setup/jsdom-helper.js';

describe('gridRenderer runtime and failure modes', () => {
  let dom;

  beforeEach(async () => {
    vi.resetModules();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-01-01T12:00:00Z'));
    dom = await setupJSDOM();
  });

  afterEach(() => {
    teardownJSDOM(dom);
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('renders every view without external date-library globals', async () => {
    const renderers = await import('../../js/gridRenderer.js');
    const birthDateUTC = new Date('2000-01-01T00:00:00Z');

    for (const renderer of [
      renderers.renderAgeGrid,
      renderers.renderCalendarGrid,
      renderers.renderMonthsGrid,
      renderers.renderYearsGrid,
    ]) {
      const container = document.createElement('div');
      renderer(birthDateUTC, 1, container);
      expect(container.hasChildNodes()).toBe(true);
      expect(container.querySelector('.error-message')).toBeNull();
    }
  });

  it('returns safely when a grid container is not provided', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const renderers = await import('../../js/gridRenderer.js');
    const birthDateUTC = new Date('2000-01-01T00:00:00Z');

    expect(() => renderers.renderAgeGrid(birthDateUTC, 1, null)).not.toThrow();
    expect(() => renderers.renderCalendarGrid(birthDateUTC, 1, null)).not.toThrow();
    expect(() => renderers.renderMonthsGrid(birthDateUTC, 1, null)).not.toThrow();
    expect(() => renderers.renderYearsGrid(birthDateUTC, 1, null)).not.toThrow();
    expect(errorSpy).toHaveBeenCalledTimes(4);
  });

  it('shows an error message when a renderer encounters invalid date behavior', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { renderMonthsGrid } = await import('../../js/gridRenderer.js');
    const container = document.createElement('div');
    const invalidBirthDate = new Date('2000-01-01T00:00:00Z');
    invalidBirthDate.getUTCMonth = () => {
      throw new Error('forced months failure');
    };

    renderMonthsGrid(invalidBirthDate, 1, container);

    expect(container.querySelector('.error-message')?.textContent)
      .toContain('Error generating months-based grid.');
    expect(errorSpy).toHaveBeenCalled();
  });
});
