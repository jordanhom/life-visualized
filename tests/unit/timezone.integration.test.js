import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { setupJSDOM, teardownJSDOM } from '../setup/jsdom-helper.js';

describe('timezone calculation integration', () => {
  let dom;
  let originalTimezone;

  beforeEach(async () => {
    originalTimezone = process.env.TZ;
    process.env.TZ = 'America/Los_Angeles';
    vi.resetModules();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-28T12:00:00Z'));
    dom = await setupJSDOM(`
      <!doctype html>
      <html>
        <body>
          <form id="life-input-form">
            <input id="birthdate">
            <select id="sex">
              <option value="">Select</option>
              <option value="female">Female</option>
            </select>
            <button id="calculate-btn" type="submit">Calculate & Visualize</button>
          </form>
          <div id="results-area" class="hidden"></div>
          <div id="life-grid-container" class="hidden">
            <div id="grid-controls-header">
              <div id="view-switcher">
                <button
                  class="view-button active"
                  id="view-weeks-age"
                  role="tab"
                  data-view="weeks-age"
                  aria-selected="true"
                  tabindex="0"
                >Weeks (Age)</button>
              </div>
            </div>
            <div id="grid-axis-label-top"></div>
            <div id="grid-content-wrapper">
              <div id="grid-axis-label-left"></div>
              <div id="grid-content-area"></div>
            </div>
          </div>
          <div id="start-over-container" class="hidden">
            <button id="start-over-btn" type="button">Start Over</button>
          </div>
        </body>
      </html>
    `);
  });

  afterEach(() => {
    if (originalTimezone === undefined) delete process.env.TZ;
    else process.env.TZ = originalTimezone;
    teardownJSDOM(dom);
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('calculates and renders through the real module graph', async () => {
    const { setupEventListeners } = await import('../../js/ui.js');
    setupEventListeners();

    const form = document.getElementById('life-input-form');
    const birthdateInput = document.getElementById('birthdate');
    const sexSelect = document.getElementById('sex');
    const resultsArea = document.getElementById('results-area');
    const gridContentArea = document.getElementById('grid-content-area');

    expect(birthdateInput.max).toBe('2026-07-27');

    birthdateInput.value = '1990-06-15';
    birthdateInput.dispatchEvent(new Event('input', { bubbles: true }));
    sexSelect.value = 'female';
    sexSelect.dispatchEvent(new Event('change', { bubbles: true }));
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    await vi.waitFor(() => {
      expect(resultsArea.textContent).toContain('36 years');
      expect(gridContentArea.querySelectorAll('.week-block').length).toBeGreaterThan(0);
    });

    expect(gridContentArea.querySelectorAll('.present')).toHaveLength(1);
    expect(gridContentArea.querySelector('.error-message')).toBeNull();
    expect(document.getElementById('life-grid-container').classList.contains('hidden')).toBe(false);
  });
});
