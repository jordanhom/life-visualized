import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('ui module (setup & form flow)', () => {
  beforeEach(async () => {
    // Reset modules so mocks apply to imports performed by ui.js
    vi.resetModules();

    // Create a JSDOM document/window so DOM APIs are available in Node test environment.
    const { JSDOM } = await import('jsdom');
    const dom = new JSDOM('<!doctype html><html><body></body></html>');
    global.window = dom.window;
    global.document = dom.window.document;
    global.HTMLElement = dom.window.HTMLElement;
    global.Node = dom.window.Node;
    // Ensure Event constructors come from the jsdom window so dispatched events are instances jsdom expects
    global.Event = dom.window.Event;
    global.MouseEvent = dom.window.MouseEvent;
    global.CustomEvent = dom.window.CustomEvent;
    global.KeyboardEvent = dom.window.KeyboardEvent;

    // Minimal DOM elements expected/queried by ui.js at module-eval time.
    const form = document.createElement('form');
    form.id = 'life-input-form';
    form.innerHTML = `
      <input id="birthdate" />
      <select id="sex"><option value="">Select</option><option value="male">Male</option></select>
      <button id="calculate-btn" type="submit">Calculate & Visualize</button>
    `;
    document.body.appendChild(form);

    const resultsArea = document.createElement('div');
    resultsArea.id = 'results-area';
    document.body.appendChild(resultsArea);

    const startOverContainer = document.createElement('div');
    startOverContainer.id = 'start-over-container';
    startOverContainer.classList.add('hidden');
    const startOverBtn = document.createElement('button');
    startOverBtn.id = 'start-over-btn';
    startOverContainer.appendChild(startOverBtn);
    document.body.appendChild(startOverContainer);

    // Grid container and inner content area used by renderCurrentView
    const gridContainer = document.createElement('div');
    gridContainer.id = 'life-grid-container';
    gridContainer.classList.add('hidden');
    const gridControlsHeader = document.createElement('div');
    gridControlsHeader.id = 'grid-controls-header';
    gridContainer.appendChild(gridControlsHeader);
    const viewSwitcher = document.createElement('div');
    viewSwitcher.id = 'view-switcher';
    // Add a default view-button inside the switcher so ui.js can focus it
    const vb = document.createElement('button');
    vb.className = 'view-button active';
    vb.id = 'view-weeks-age';
    vb.setAttribute('role', 'tab');
    vb.dataset.view = 'weeks-age';
    viewSwitcher.appendChild(vb);
    gridControlsHeader.appendChild(viewSwitcher);

    const gridContentWrapper = document.createElement('div');
    gridContentWrapper.id = 'grid-content-wrapper';
    const leftLabel = document.createElement('div');
    leftLabel.id = 'grid-axis-label-left';
    const topLabel = document.createElement('div');
    topLabel.id = 'grid-axis-label-top';
    const gridContentArea = document.createElement('div');
    gridContentArea.id = 'grid-content-area';
    gridContentWrapper.appendChild(leftLabel);
    gridContentWrapper.appendChild(gridContentArea);
    gridContainer.appendChild(gridContentWrapper);
    document.body.appendChild(gridContainer);

    // Mock the calculator module imported by ui.js
    vi.mock('../../js/calculator.js', async () => {
      return {
        calculateCurrentAge: vi.fn(() => 30),
        getRemainingExpectancy: vi.fn(async () => 50)
      };
    });

    // Mock the gridRenderer functions so renderCurrentView does not depend on date-fns
    vi.mock('../../js/gridRenderer.js', async () => {
      return {
        renderAgeGrid: vi.fn(() => {}),
        renderCalendarGrid: vi.fn(() => {}),
        renderMonthsGrid: vi.fn(() => {}),
        renderYearsGrid: vi.fn(() => {}),
      };
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    // Clean up globals
    delete global.window;
    delete global.document;
    delete global.HTMLElement;
    delete global.Node;
    delete global.Event;
    delete global.MouseEvent;
    delete global.CustomEvent;
  });

  it('enables calculate button only when inputs are valid', async () => {
    // Import ui after DOM & mocks are set up
    const { setupEventListeners } = await import('../../js/ui.js');

    // Attach listeners (this will cache DOM elements inside the module)
    setupEventListeners();

    const birthdateInput = document.getElementById('birthdate');
    const sexSelect = document.getElementById('sex');
    const calculateBtn = document.getElementById('calculate-btn');

    // Initially the button should be disabled (updateButtonState called in setup)
    expect(calculateBtn.disabled).toBe(true);

    // Fill birthdate only -> still disabled
    birthdateInput.value = '2000-01-01';
    birthdateInput.dispatchEvent(new global.Event('input', { bubbles: true }));
    expect(calculateBtn.disabled).toBe(true);

    // Fill sex -> button should enable
    sexSelect.value = 'male';
    sexSelect.dispatchEvent(new global.Event('change', { bubbles: true }));
    // Allow event loop microtasks to complete
    await new Promise((r) => setTimeout(r, 0));
    expect(calculateBtn.disabled).toBe(false);

    // Clear birthdate -> disabled again
    birthdateInput.value = '';
    birthdateInput.dispatchEvent(new global.Event('input', { bubbles: true }));
    await new Promise((r) => setTimeout(r, 0));
    expect(calculateBtn.disabled).toBe(true);
  });

  it('handleCalculation success path displays results, hides form, and reveals grid', async () => {
    const { setupEventListeners } = await import('../../js/ui.js');

    setupEventListeners();

    const birthdateInput = document.getElementById('birthdate');
    const sexSelect = document.getElementById('sex');
    const calculateBtn = document.getElementById('calculate-btn');
    const form = document.getElementById('life-input-form');
    const resultsArea = document.getElementById('results-area');
    const gridContainer = document.getElementById('life-grid-container');
    const startOverContainer = document.getElementById('start-over-container');

    // Fill inputs
    birthdateInput.value = '1995-06-15';
    birthdateInput.dispatchEvent(new global.Event('input', { bubbles: true }));
    sexSelect.value = 'male';
    sexSelect.dispatchEvent(new global.Event('change', { bubbles: true }));

    // Submit the form (triggers async handler)
    form.dispatchEvent(new global.Event('submit', { bubbles: true, cancelable: true }));

    // Wait for async operations to complete (getRemainingExpectancy is async)
    await new Promise((r) => setTimeout(r, 10));

    // Results area should contain the Total Estimated Lifespan value: currentAge(30) + remaining(50) => 80
    expect(resultsArea.textContent).toContain('80 years');

    // Form should be hidden and grid container visible
    expect(form.classList.contains('hidden')).toBe(true);
    expect(gridContainer.classList.contains('hidden')).toBe(false);

    // Start over container should be visible (its hidden class removed)
    expect(startOverContainer.classList.contains('hidden')).toBe(false);
 
    // Calculate button text should have been reverted to the original label
    expect(calculateBtn.textContent).toBe('Calculate & Visualize');
  });

  it('handleCalculation error path shows error and keeps grid hidden', async () => {
    // Import ui after DOM & mocks are set up
    const { setupEventListeners } = await import('../../js/ui.js');

    setupEventListeners();

    const form = document.getElementById('life-input-form');
    const resultsArea = document.getElementById('results-area');
    const gridContainer = document.getElementById('life-grid-container');

    // Ensure inputs are empty to trigger validation error
    const birthdateInput = document.getElementById('birthdate');
    const sexSelect = document.getElementById('sex');
    birthdateInput.value = '';
    sexSelect.value = '';

    // Submit the form
    form.dispatchEvent(new global.Event('submit', { bubbles: true, cancelable: true }));

    // Allow microtasks to complete
    await new Promise((r) => setTimeout(r, 0));

    // Results area should contain validation message and have error styling
    expect(resultsArea.classList.contains('error-message')).toBe(true);
    expect(resultsArea.textContent).toContain('Please fill in both');

    // Grid should remain hidden and form should still be visible
    expect(gridContainer.classList.contains('hidden')).toBe(true);
    expect(form.classList.contains('hidden')).toBe(false);
  });

  it('Start Over button resets the UI to initial state after success', async () => {
    const { setupEventListeners } = await import('../../js/ui.js');

    setupEventListeners();

    const birthdateInput = document.getElementById('birthdate');
    const sexSelect = document.getElementById('sex');
    const form = document.getElementById('life-input-form');
    const resultsArea = document.getElementById('results-area');
    const gridContainer = document.getElementById('life-grid-container');
    const startOverContainer = document.getElementById('start-over-container');
    const startOverBtn = document.getElementById('start-over-btn');

    // Fill inputs to allow a successful calculation (calculator mock returns values in beforeEach)
    birthdateInput.value = '1990-01-01';
    birthdateInput.dispatchEvent(new global.Event('input', { bubbles: true }));
    sexSelect.value = 'male';
    sexSelect.dispatchEvent(new global.Event('change', { bubbles: true }));

    // Trigger submit
    form.dispatchEvent(new global.Event('submit', { bubbles: true, cancelable: true }));

    // Wait for async operations
    await new Promise((r) => setTimeout(r, 10));

    // Sanity: grid is visible and start over shown
    expect(gridContainer.classList.contains('hidden')).toBe(false);
    expect(startOverContainer.classList.contains('hidden')).toBe(false);

    // Click start over
    startOverBtn.dispatchEvent(new global.MouseEvent('click', { bubbles: true }));

    // Allow UI updates
    await new Promise((r) => setTimeout(r, 0));

    // After reset: form visible, results hidden, grid hidden, inputs cleared
    expect(form.classList.contains('hidden')).toBe(false);
    expect(resultsArea.classList.contains('hidden')).toBe(true);
    expect(gridContainer.classList.contains('hidden')).toBe(true);
    expect(birthdateInput.value).toBe('');
    expect(sexSelect.value).toBe('');
  });

  it('keyboard navigation on view switcher changes active view and ARIA attributes', async () => {
    // Add a second view button before importing ui.js so it is included in the cached NodeList
    const viewSwitcher = document.getElementById('view-switcher');
    const secondBtn = document.createElement('button');
    secondBtn.className = 'view-button';
    secondBtn.id = 'view-months';
    secondBtn.setAttribute('role', 'tab');
    secondBtn.dataset.view = 'months';
    secondBtn.textContent = 'Months';
    viewSwitcher.appendChild(secondBtn);

    // Ensure first button is active
    const firstBtn = document.querySelector('#view-switcher .view-button');
    firstBtn.classList.add('active');
    firstBtn.setAttribute('role', 'tab');

    // Now import ui.js so it captures both buttons
    const { setupEventListeners } = await import('../../js/ui.js');
    setupEventListeners();

    // Focus first tab and simulate ArrowRight key to move to next tab
    firstBtn.focus();
    const keyEvent = new global.KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true });
    firstBtn.dispatchEvent(keyEvent);

    // Allow event handlers to run
    await new Promise((r) => setTimeout(r, 0));

    // The second button should now be active and have aria-selected="true"
    expect(secondBtn.classList.contains('active')).toBe(true);
    expect(secondBtn.getAttribute('aria-selected')).toBe('true');
  });
});