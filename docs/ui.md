# UI Module (`js/ui.js`)

Purpose
Manage UI state, validate inputs, orchestrate calculations, progressive reveal, view switching, and coordinate grid rendering.

Location
- [`js/ui.js`](js/ui.js:1)

Public API
- setupEventListeners()

Key responsibilities
- Normalize birth date to UTC midnight before passing to calculators/renderers.
- Maintain runtime state: `currentView` and `lastCalcData`.
- Enable/disable Calculate button and present loading/error states.
- Show/hide UI sections (form, results, grid container, Start Over).
- Wire view switcher tablist keyboard behavior and ARIA updates.

Important internal functions (testable)
- areInputsValid()
- updateButtonState()
- updateAxisLabels(show, topText, leftText)
- renderCurrentView()
- handleCalculation(event)
- displayResults(...)
- displayError(message)
- handleViewChange(event)
- handleStartOver()
- handleTablistKeydown(event)

DOM contracts
- Reads/writes these elements by id in [`index.html`](index.html:1):
  - `#life-input-form`, `#birthdate`, `#sex`, `#calculate-btn`
  - `#results-area`
  - `#life-grid-container`, `#grid-content-area`, `#view-switcher`, `#grid-controls-header`
  - `#grid-axis-label-top`, `#grid-axis-label-left`, `#grid-content-wrapper`
  - `#start-over-container`, `#start-over-btn`

Integration points
- Calls renderers from [`js/gridRenderer.js`](js/gridRenderer.js:1).
- Uses calculation functions from [`js/calculator.js`](js/calculator.js:1).
- Expects `date-fns` to be available globally for renderer behavior.

Testing guidance
- Unit-ish browser harness: simulate form input and submit, assert `#results-area` text and that `#grid-content-area` has children.
- ARIA/focus tests: ensure view switcher buttons update `aria-selected`, `tabindex`, and `aria-labelledby` on `#grid-content-area`.
- Deterministic tests: allow injecting a fake "now" into helper functions where feasible for repeatable assertions.

Notes & refactor constraints
- Keep UTC normalization behavior identical when refactoring.
- When moving logic into utils, preserve CSS class names (`stage-*`, `present`, `past`, `future`, `out-of-bounds`) and titles to avoid stylesheet/UX regressions.
- Progressive reveal and focus management are UX-sensitive—test Safari (known tabbing quirks).

Examples (console)
- document.getElementById('results-area').innerText
- document.querySelectorAll('#grid-content-area .week-block').length
- Simulate submit: document.getElementById('life-input-form').dispatchEvent(new Event('submit'))

References
- Renderer implementations: [`js/gridRenderer.js`](js/gridRenderer.js:1)
- API sketch: [`docs/gridUtils-api.md`](docs/gridUtils-api.md:1)