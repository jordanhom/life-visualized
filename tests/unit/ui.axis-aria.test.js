/**
 * tests/unit/ui.axis-aria.test.js
 *
 * Tests axis label updates and ARIA attributes when a successful calculation occurs.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('ui axis labels & ARIA integration', () => {
  let dom;
  let teardown;
  beforeEach(async () => {
    vi.resetModules();
    // Create a JSDOM document/window so DOM APIs are available in Node test environment.
    const { setupJSDOM, teardownJSDOM } = await import('../setup/jsdom-helper.js');
    dom = await setupJSDOM('<!doctype html><html><body></body></html>');
    // Store teardown function for afterEach to call
    teardown = teardownJSDOM;

    vi.useFakeTimers();
    // Provide minimal DOM for setupEventListeners
    const root = document.createElement('div');
    root.innerHTML = `
      <form id="life-input-form"></form>
      <input id="birthdate" />
      <select id="sex"><option value="">Select</option><option value="male">male</option></select>
      <button id="calculate-btn">Calculate & Visualize</button>
      <div id="start-over-container" class="hidden"><button id="start-over-btn">Start Over</button></div>
      <div id="results-area" class="hidden"></div>
      <details id="grid-guide-details" class="hidden"></details>
      <div id="life-grid-container" class="hidden">
        <div id="grid-controls-header"></div>
        <div id="grid-content-wrapper" class="hidden">
          <div id="grid-axis-label-top" class="hidden"></div>
          <div id="grid-axis-label-left" class="hidden"></div>
          <div id="grid-content-area"></div>
        </div>
      </div>
      <div id="view-switcher" role="tablist">
        <button id="v1" class="view-button active" role="tab" data-view="weeks-age" aria-selected="true" tabindex="0">Weeks by Age</button>
        <button id="v2" class="view-button" role="tab" data-view="months" aria-selected="false" tabindex="-1">Months</button>
      </div>
    `;
    document.body.appendChild(root);

    // Mock calculator module BEFORE importing ui so ui's imports are satisfied
    vi.mock('../../js/calculator.js', async () => {
      return {
        calculateCurrentAge: () => 25,
        getRemainingExpectancy: async () => 50
      };
    });
    
    // Mock gridRenderer to append content so ui can update axis labels
    vi.mock('../../js/gridRenderer.js', async () => {
      return {
        renderAgeGrid: (birth, years, el) => { if (el) el.appendChild(document.createElement('div')); },
        renderCalendarGrid: (b,y,el) => { if (el) el.appendChild(document.createElement('div')); },
        renderMonthsGrid: (b,y,el) => { if (el) el.appendChild(document.createElement('div')); },
        renderYearsGrid: (b,y,el) => { if (el) el.appendChild(document.createElement('div')); }
      };
    });
  });

  afterEach(() => {
    // Cleanup DOM and timers
    try {
      if (typeof teardown === 'function') {
        teardown(dom);
      } else if (dom && dom.window && typeof dom.window.close === 'function') {
        dom.window.close();
      }
    } catch (e) {
      // ignore teardown errors in cleanup
    }
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('updates axis labels and ARIA attributes after a successful calculation', async () => {
    const { setupEventListeners } = await import('../../js/ui.js');
    setupEventListeners();

    // Fill inputs and trigger submit
    const birthInput = document.getElementById('birthdate');
    const sexSelect = document.getElementById('sex');
    const form = document.getElementById('life-input-form');

    birthInput.value = '2000-01-01';
    sexSelect.value = 'male';

    // Dispatch submit event to invoke handleCalculation
    const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
    form.dispatchEvent(submitEvent);

    // Allow microtasks to run (handleCalculation awaits async functions)
    await Promise.resolve();
    await Promise.resolve();

    const top = document.getElementById('grid-axis-label-top');
    const left = document.getElementById('grid-axis-label-left');
    const gridContent = document.getElementById('grid-content-area');

    // Axis labels should be visible and contain expected text
    expect(top.classList.contains('hidden')).toBe(false);
    expect(left.classList.contains('hidden')).toBe(false);
    expect(top.textContent).toContain('Weeks'); // default view weeks-age
    expect(left.textContent).toContain('Years');

    // Grid content area should have aria-label and be focusable (tabIndex 0)
    expect(gridContent.getAttribute('aria-label')).toContain('Lifespan visualization grid');
    expect(gridContent.tabIndex).toBe(0);
  });
});