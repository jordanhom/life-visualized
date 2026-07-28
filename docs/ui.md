# UI Module (`js/ui.js`)

Purpose
Manage UI state, validate inputs, orchestrate calculations, progressive reveal, view switching, and coordinate grid rendering.

Location
- [`js/ui.js`](js/ui.js:1)

Public API
- setupEventListeners()

Key responsibilities
- Set the birthdate maximum to yesterday in the user's local calendar and reject today/future dates immediately.
- Normalize accepted birth dates to UTC midnight before passing them to calculators/renderers.
- Maintain runtime state: `currentView` and `lastCalcData`.
- Enable/disable Calculate button and present loading/error states.
- Show/hide UI sections and fully restore initial state on Start Over.
- Wire view switcher tablist keyboard behavior and ARIA updates.

Important internal functions (testable)
- areInputsValid()
- getLocalDateUTC() (imported from `dateUtils.js`)
- formatDateInputValue(date)
- parseBirthdateUTC(value)
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
- Records the browser's resolved IANA timezone with successful calculation state for diagnostics and future location-aware features.
- Has no external runtime date-library requirement.

Testing guidance
- Unit-ish browser harness: simulate form input and submit, assert `#results-area` text and that `#grid-content-area` has children.
- ARIA/focus tests: ensure view switcher buttons update `aria-selected`, `tabindex`, and `aria-labelledby` on `#grid-content-area`.
- Validation tests: freeze time, assert `#birthdate.max` is yesterday, and ensure today/future dates leave Calculate disabled.
- Reset tests: switch away from Weeks (Age), then assert Start Over clears results/data and restores the default tab and focus state.
- Deterministic tests: allow injecting a fake "now" into helper functions where feasible for repeatable assertions.

Notes & refactor constraints
- Keep UTC normalization behavior identical when refactoring.
- Treat user-facing "today" as the browser's local calendar date before converting accepted date-only values to UTC.
- When moving logic into utils, preserve CSS class names (`stage-*`, `present`, `past`, `future`, `out-of-bounds`) and titles to avoid stylesheet/UX regressions.
- Progressive reveal and focus management are UX-sensitive—test Safari (known tabbing quirks).

Examples (console)
- document.getElementById('results-area').innerText
- document.querySelectorAll('#grid-content-area .week-block').length
- Simulate submit: document.getElementById('life-input-form').dispatchEvent(new Event('submit'))

References
- Renderer implementations: [`js/gridRenderer.js`](js/gridRenderer.js:1)
- API sketch: [`docs/gridUtils-api.md`](docs/gridUtils-api.md:1)
