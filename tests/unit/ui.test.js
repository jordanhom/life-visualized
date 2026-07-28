import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('ui module (setup & form flow)', () => {
  let originalTimezone;

  beforeEach(async () => {
    originalTimezone = process.env.TZ;
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
    vi.doMock('../../js/calculator.js', async () => {
      return {
        calculateCurrentAge: vi.fn(() => 30),
        getRemainingExpectancy: vi.fn(async () => 50)
      };
    });

    // Mock grid renderers so UI tests stay focused on orchestration.
    vi.doMock('../../js/gridRenderer.js', async () => {
      return {
        renderAgeGrid: vi.fn(() => {}),
        renderCalendarGrid: vi.fn(() => {}),
        renderMonthsGrid: vi.fn(() => {}),
        renderYearsGrid: vi.fn(() => {}),
      };
    });
  });

  afterEach(() => {
    if (originalTimezone === undefined) delete process.env.TZ;
    else process.env.TZ = originalTimezone;
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

  it('sets the latest birthdate and disables calculation for today or future dates', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-27T12:00:00Z'));

    const { setupEventListeners } = await import('../../js/ui.js');
    setupEventListeners();

    const birthdateInput = document.getElementById('birthdate');
    const sexSelect = document.getElementById('sex');
    const calculateBtn = document.getElementById('calculate-btn');

    expect(birthdateInput.max).toBe('2026-07-26');

    sexSelect.value = 'male';
    sexSelect.dispatchEvent(new global.Event('change', { bubbles: true }));

    birthdateInput.value = '2026-07-27';
    birthdateInput.dispatchEvent(new global.Event('input', { bubbles: true }));
    expect(calculateBtn.disabled).toBe(true);
    expect(calculateBtn.title).toBe('Please enter a valid birth date in the past.');

    birthdateInput.value = '2026-07-28';
    birthdateInput.dispatchEvent(new global.Event('input', { bubbles: true }));
    expect(calculateBtn.disabled).toBe(true);

    birthdateInput.value = '2026-07-26';
    birthdateInput.dispatchEvent(new global.Event('input', { bubbles: true }));
    expect(calculateBtn.disabled).toBe(false);
  });

  it.each([
    ['America/Los_Angeles', '2026-01-01T01:00:00Z', '2025-12-30', '2025-12-31'],
    ['Asia/Tokyo', '2026-01-01T01:00:00Z', '2025-12-31', '2026-01-01'],
  ])(
    'validates birthdates against the local calendar in %s',
    async (timezone, instant, expectedMaximum, localToday) => {
      process.env.TZ = timezone;
      vi.useFakeTimers();
      vi.setSystemTime(new Date(instant));

      const { setupEventListeners } = await import('../../js/ui.js');
      setupEventListeners();

      const birthdateInput = document.getElementById('birthdate');
      const sexSelect = document.getElementById('sex');
      const calculateBtn = document.getElementById('calculate-btn');
      sexSelect.value = 'male';
      sexSelect.dispatchEvent(new global.Event('change', { bubbles: true }));

      expect(birthdateInput.max).toBe(expectedMaximum);

      birthdateInput.value = localToday;
      birthdateInput.dispatchEvent(new global.Event('input', { bubbles: true }));
      expect(calculateBtn.disabled).toBe(true);

      birthdateInput.value = expectedMaximum;
      birthdateInput.dispatchEvent(new global.Event('input', { bubbles: true }));
      expect(calculateBtn.disabled).toBe(false);
    },
  );

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

  it('handleCalculation rejects future dates and skips calculations', async () => {
    const { setupEventListeners } = await import('../../js/ui.js');
    const calculator = await import('../../js/calculator.js');

    setupEventListeners();

    const form = document.getElementById('life-input-form');
    const birthdateInput = document.getElementById('birthdate');
    const sexSelect = document.getElementById('sex');
    const resultsArea = document.getElementById('results-area');
    const gridContainer = document.getElementById('life-grid-container');
    const calculateBtn = document.getElementById('calculate-btn');

    birthdateInput.value = '3000-01-01';
    birthdateInput.dispatchEvent(new global.Event('input', { bubbles: true }));
    sexSelect.value = 'male';
    sexSelect.dispatchEvent(new global.Event('change', { bubbles: true }));

    form.dispatchEvent(new global.Event('submit', { bubbles: true, cancelable: true }));

    await new Promise((r) => setTimeout(r, 0));

    expect(resultsArea.classList.contains('error-message')).toBe(true);
    expect(resultsArea.textContent).toContain('Please enter a valid birth date in the past');
    expect(gridContainer.classList.contains('hidden')).toBe(true);
    expect(calculateBtn.textContent).toBe('Calculate & Visualize');
    expect(calculator.calculateCurrentAge).not.toHaveBeenCalled();
    expect(calculator.getRemainingExpectancy).not.toHaveBeenCalled();
  });

  it('handleCalculation shows error when expectancy data is unavailable', async () => {
    const { setupEventListeners } = await import('../../js/ui.js');
    const calculator = await import('../../js/calculator.js');

    calculator.getRemainingExpectancy.mockResolvedValueOnce(null);

    setupEventListeners();

    const form = document.getElementById('life-input-form');
    const birthdateInput = document.getElementById('birthdate');
    const sexSelect = document.getElementById('sex');
    const resultsArea = document.getElementById('results-area');
    const gridContainer = document.getElementById('life-grid-container');
    const startOverContainer = document.getElementById('start-over-container');

    birthdateInput.value = '1990-01-01';
    birthdateInput.dispatchEvent(new global.Event('input', { bubbles: true }));
    sexSelect.value = 'male';
    sexSelect.dispatchEvent(new global.Event('change', { bubbles: true }));

    form.dispatchEvent(new global.Event('submit', { bubbles: true, cancelable: true }));

    await new Promise((r) => setTimeout(r, 10));

    expect(resultsArea.classList.contains('error-message')).toBe(true);
    expect(resultsArea.textContent).toContain('Could not retrieve life expectancy data');
    expect(gridContainer.classList.contains('hidden')).toBe(true);
    expect(startOverContainer.classList.contains('hidden')).toBe(true);
    expect(form.classList.contains('hidden')).toBe(false);
  });

  it('Start Over button resets the UI to initial state after success', async () => {
    const viewSwitcher = document.getElementById('view-switcher');
    const yearsButton = document.createElement('button');
    yearsButton.className = 'view-button';
    yearsButton.id = 'view-years';
    yearsButton.setAttribute('role', 'tab');
    yearsButton.dataset.view = 'years';
    viewSwitcher.appendChild(yearsButton);

    const { setupEventListeners } = await import('../../js/ui.js');

    setupEventListeners();

    const birthdateInput = document.getElementById('birthdate');
    const sexSelect = document.getElementById('sex');
    const form = document.getElementById('life-input-form');
    const resultsArea = document.getElementById('results-area');
    const gridContainer = document.getElementById('life-grid-container');
    const startOverContainer = document.getElementById('start-over-container');
    const startOverBtn = document.getElementById('start-over-btn');
    const defaultViewButton = document.getElementById('view-weeks-age');
    const gridContentArea = document.getElementById('grid-content-area');

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

    yearsButton.dispatchEvent(new global.MouseEvent('click', { bubbles: true }));
    expect(yearsButton.getAttribute('aria-selected')).toBe('true');

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
    expect(resultsArea.innerHTML).toBe('');
    expect(defaultViewButton.classList.contains('active')).toBe(true);
    expect(defaultViewButton.getAttribute('aria-selected')).toBe('true');
    expect(defaultViewButton.getAttribute('tabindex')).toBe('0');
    expect(yearsButton.classList.contains('active')).toBe(false);
    expect(yearsButton.getAttribute('aria-selected')).toBe('false');
    expect(yearsButton.getAttribute('tabindex')).toBe('-1');
    expect(gridContentArea.getAttribute('aria-labelledby')).toBe(defaultViewButton.id);
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

  it('keyboard navigation supports End/Home and ArrowUp wrap-around', async () => {
    const viewSwitcher = document.getElementById('view-switcher');
    const secondBtn = document.createElement('button');
    secondBtn.className = 'view-button';
    secondBtn.id = 'view-months';
    secondBtn.setAttribute('role', 'tab');
    secondBtn.dataset.view = 'months';
    viewSwitcher.appendChild(secondBtn);

    const thirdBtn = document.createElement('button');
    thirdBtn.className = 'view-button';
    thirdBtn.id = 'view-years';
    thirdBtn.setAttribute('role', 'tab');
    thirdBtn.dataset.view = 'years';
    viewSwitcher.appendChild(thirdBtn);

    const firstBtn = document.querySelector('#view-switcher .view-button');
    firstBtn.classList.add('active');
    firstBtn.setAttribute('role', 'tab');

    const { setupEventListeners } = await import('../../js/ui.js');
    setupEventListeners();

    firstBtn.focus();
    firstBtn.dispatchEvent(new global.KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    await new Promise((r) => setTimeout(r, 0));
    expect(thirdBtn.classList.contains('active')).toBe(true);

    thirdBtn.focus();
    thirdBtn.dispatchEvent(new global.KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
    await new Promise((r) => setTimeout(r, 0));
    expect(firstBtn.classList.contains('active')).toBe(true);

    firstBtn.focus();
    firstBtn.dispatchEvent(new global.KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
    await new Promise((r) => setTimeout(r, 0));
    expect(thirdBtn.classList.contains('active')).toBe(true);
  });

  it('keyboard navigation ignores unhandled keys', async () => {
    const viewSwitcher = document.getElementById('view-switcher');
    const secondBtn = document.createElement('button');
    secondBtn.className = 'view-button';
    secondBtn.id = 'view-months';
    secondBtn.setAttribute('role', 'tab');
    secondBtn.dataset.view = 'months';
    viewSwitcher.appendChild(secondBtn);

    const firstBtn = document.querySelector('#view-switcher .view-button');
    firstBtn.classList.add('active');
    firstBtn.setAttribute('role', 'tab');

    const { setupEventListeners } = await import('../../js/ui.js');
    setupEventListeners();

    firstBtn.focus();
    firstBtn.dispatchEvent(new global.KeyboardEvent('keydown', { key: 'a', bubbles: true }));
    await new Promise((r) => setTimeout(r, 0));

    expect(firstBtn.classList.contains('active')).toBe(true);
    expect(secondBtn.classList.contains('active')).toBe(false);
  });

  it('updates aria-labelledby and calls the correct renderer on view change', async () => {
    const viewSwitcher = document.getElementById('view-switcher');
    const secondBtn = document.createElement('button');
    secondBtn.className = 'view-button';
    secondBtn.id = 'view-months';
    secondBtn.setAttribute('role', 'tab');
    secondBtn.dataset.view = 'months';
    viewSwitcher.appendChild(secondBtn);

    const { setupEventListeners } = await import('../../js/ui.js');
    const gridRenderer = await import('../../js/gridRenderer.js');

    setupEventListeners();

    const form = document.getElementById('life-input-form');
    const birthdateInput = document.getElementById('birthdate');
    const sexSelect = document.getElementById('sex');
    const gridContentArea = document.getElementById('grid-content-area');

    birthdateInput.value = '1990-01-01';
    birthdateInput.dispatchEvent(new global.Event('input', { bubbles: true }));
    sexSelect.value = 'male';
    sexSelect.dispatchEvent(new global.Event('change', { bubbles: true }));
    form.dispatchEvent(new global.Event('submit', { bubbles: true, cancelable: true }));

    await new Promise((r) => setTimeout(r, 10));

    secondBtn.dispatchEvent(new global.MouseEvent('click', { bubbles: true }));

    expect(gridRenderer.renderMonthsGrid).toHaveBeenCalled();
    expect(gridContentArea.getAttribute('aria-labelledby')).toBe('view-months');
    expect(secondBtn.classList.contains('active')).toBe(true);
  });

  it('switches to weeks-calendar and years views and calls their renderers', async () => {
    const viewSwitcher = document.getElementById('view-switcher');
    const calendarBtn = document.createElement('button');
    calendarBtn.className = 'view-button';
    calendarBtn.id = 'view-weeks-calendar';
    calendarBtn.setAttribute('role', 'tab');
    calendarBtn.dataset.view = 'weeks-calendar';
    viewSwitcher.appendChild(calendarBtn);

    const yearsBtn = document.createElement('button');
    yearsBtn.className = 'view-button';
    yearsBtn.id = 'view-years';
    yearsBtn.setAttribute('role', 'tab');
    yearsBtn.dataset.view = 'years';
    viewSwitcher.appendChild(yearsBtn);

    const { setupEventListeners } = await import('../../js/ui.js');
    const gridRenderer = await import('../../js/gridRenderer.js');

    setupEventListeners();

    const form = document.getElementById('life-input-form');
    const birthdateInput = document.getElementById('birthdate');
    const sexSelect = document.getElementById('sex');

    birthdateInput.value = '1990-01-01';
    birthdateInput.dispatchEvent(new global.Event('input', { bubbles: true }));
    sexSelect.value = 'male';
    sexSelect.dispatchEvent(new global.Event('change', { bubbles: true }));
    form.dispatchEvent(new global.Event('submit', { bubbles: true, cancelable: true }));
    await new Promise((r) => setTimeout(r, 10));

    calendarBtn.dispatchEvent(new global.MouseEvent('click', { bubbles: true }));
    yearsBtn.dispatchEvent(new global.MouseEvent('click', { bubbles: true }));

    expect(gridRenderer.renderCalendarGrid).toHaveBeenCalled();
    expect(gridRenderer.renderYearsGrid).toHaveBeenCalled();
  });

  it('shows invalid view error for unknown view button', async () => {
    const viewSwitcher = document.getElementById('view-switcher');
    const invalidBtn = document.createElement('button');
    invalidBtn.className = 'view-button';
    invalidBtn.id = 'view-invalid';
    invalidBtn.setAttribute('role', 'tab');
    invalidBtn.dataset.view = 'invalid-view';
    viewSwitcher.appendChild(invalidBtn);

    const { setupEventListeners } = await import('../../js/ui.js');
    setupEventListeners();

    const form = document.getElementById('life-input-form');
    const birthdateInput = document.getElementById('birthdate');
    const sexSelect = document.getElementById('sex');
    const gridContentArea = document.getElementById('grid-content-area');

    birthdateInput.value = '1990-01-01';
    birthdateInput.dispatchEvent(new global.Event('input', { bubbles: true }));
    sexSelect.value = 'male';
    sexSelect.dispatchEvent(new global.Event('change', { bubbles: true }));
    form.dispatchEvent(new global.Event('submit', { bubbles: true, cancelable: true }));
    await new Promise((r) => setTimeout(r, 10));

    invalidBtn.dispatchEvent(new global.MouseEvent('click', { bubbles: true }));
    expect(gridContentArea.querySelector('.error-message')?.textContent).toContain('Invalid view selected.');
    expect(gridContentArea.hasAttribute('aria-label')).toBe(false);
  });

  it('keeps current view when clicking the already-active tab', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const firstBtn = document.querySelector('#view-switcher .view-button');
    const { setupEventListeners } = await import('../../js/ui.js');

    setupEventListeners();
    firstBtn.dispatchEvent(new global.MouseEvent('click', { bubbles: true }));

    expect(logSpy).toHaveBeenCalledWith('Initial view set to:', 'weeks-age');
    expect(logSpy).not.toHaveBeenCalledWith('View changed to:', 'weeks-age');
  });

  it('ignores keydown events when focus is not on a tab button', async () => {
    const viewSwitcher = document.getElementById('view-switcher');
    const { setupEventListeners } = await import('../../js/ui.js');

    setupEventListeners();
    viewSwitcher.focus();
    viewSwitcher.dispatchEvent(new global.KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));

    const firstBtn = document.querySelector('#view-switcher .view-button');
    expect(firstBtn.classList.contains('active')).toBe(true);
  });

  it('shows render error message when renderer throws inside ui renderCurrentView', async () => {
    const { setupEventListeners } = await import('../../js/ui.js');
    const gridRenderer = await import('../../js/gridRenderer.js');

    gridRenderer.renderAgeGrid.mockImplementationOnce(() => {
      throw new Error('forced render crash');
    });

    setupEventListeners();

    const form = document.getElementById('life-input-form');
    const birthdateInput = document.getElementById('birthdate');
    const sexSelect = document.getElementById('sex');
    const gridContentArea = document.getElementById('grid-content-area');

    birthdateInput.value = '1990-01-01';
    birthdateInput.dispatchEvent(new global.Event('input', { bubbles: true }));
    sexSelect.value = 'male';
    sexSelect.dispatchEvent(new global.Event('change', { bubbles: true }));
    form.dispatchEvent(new global.Event('submit', { bubbles: true, cancelable: true }));

    await new Promise((r) => setTimeout(r, 10));

    expect(gridContentArea.querySelector('.error-message')?.textContent).toContain('Error generating weeks-age grid.');
    expect(gridContentArea.hasAttribute('tabindex')).toBe(false);
  });

  it('falls back to grid container error when grid-content-area is missing', async () => {
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    document.getElementById('grid-content-area').remove();

    const { setupEventListeners } = await import('../../js/ui.js');
    setupEventListeners();

    const form = document.getElementById('life-input-form');
    const birthdateInput = document.getElementById('birthdate');
    const sexSelect = document.getElementById('sex');
    const gridContainer = document.getElementById('life-grid-container');

    birthdateInput.value = '1990-01-01';
    birthdateInput.dispatchEvent(new global.Event('input', { bubbles: true }));
    sexSelect.value = 'male';
    sexSelect.dispatchEvent(new global.Event('change', { bubbles: true }));
    form.dispatchEvent(new global.Event('submit', { bubbles: true, cancelable: true }));

    await new Promise((r) => setTimeout(r, 10));

    expect(errSpy).toHaveBeenCalledWith('Grid content area (#grid-content-area) not found.');
    expect(gridContainer.innerHTML).toContain('Grid layout error.');
  });

  it('setupEventListeners falls back to first view button when no active tab is preset', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    const defaultBtn = document.querySelector('#view-switcher .view-button');
    defaultBtn.classList.remove('active');

    const { setupEventListeners } = await import('../../js/ui.js');
    setupEventListeners();

    expect(warnSpy).toHaveBeenCalledWith("No default active view button found in HTML. Defaulting to 'weeks-age'.");
    expect(logSpy).toHaveBeenCalledWith('Initial view set to:', 'weeks-age');
  });

  it('setupEventListeners logs errors when view switcher and start over elements are missing', async () => {
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    document.getElementById('view-switcher').remove();
    document.getElementById('start-over-container').remove();

    const { setupEventListeners } = await import('../../js/ui.js');
    setupEventListeners();

    expect(errSpy).toHaveBeenCalledWith('View switcher container (#view-switcher) not found.');
    expect(errSpy).toHaveBeenCalledWith('Start Over button (#start-over-btn) or its container (#start-over-container) not found.');
    expect(logSpy).toHaveBeenCalledWith('Initial view set to:', 'weeks-age');
  });

  it('setupEventListeners logs errors when form and required inputs are missing', async () => {
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    document.getElementById('life-input-form').remove();

    const { setupEventListeners } = await import('../../js/ui.js');
    setupEventListeners();

    expect(errSpy).toHaveBeenCalledWith('Form element (#life-input-form) not found.');
    expect(errSpy).toHaveBeenCalledWith('Birthdate input element (#birthdate) not found.');
    expect(errSpy).toHaveBeenCalledWith('Sex input element (#sex) not found.');
  });

  it('setupEventListeners restores global document from window when document is missing', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    delete global.document;

    const { setupEventListeners } = await import('../../js/ui.js');
    setupEventListeners();

    expect(global.document).toBe(global.window.document);
    expect(logSpy).toHaveBeenCalledWith('Initial view set to:', 'weeks-age');
  });
});
