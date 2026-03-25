# Module-specific Unit Test Plans — Separated by Module

Brief: Separate, focused test plans for each core module to keep the memory bank actionable.

## js/calculator.js
- Objective: Validate age calculation and life-expectancy lookup logic.
- Primary functions: [`js/calculator.js`](js/calculator.js:1)
- Priority: High
- Tests:
  1. Age calculation edge cases: birthday passed, birthday not reached, leap-day handling, future birth date.
  2. getRemainingExpectancy: exact bracket matches, mid-bracket ages, very large ages (fallback to highest bracket), invalid sex -> throws.
  3. Invalid data handling: non-numeric strings, Infinity, NaN -> throws; missing sex key / empty bracket map -> returns null.
- Test notes:
  - Freeze time with `vi.useFakeTimers()` and `vi.setSystemTime()` for deterministic age tests.
  - Do NOT rely on runtime mutation helpers inside production modules. Prefer explicit `dataOverride` params or module mocking:
    - Use `vi.mock('../../js/data.js', () => ({ lifeExpectancyData: { /* fixture */ }}))` in tests to supply deterministic datasets.
    - This keeps tests isolated and avoids runtime state leaks between tests.
  - Use `vi.resetModules()` when switching mocked implementations between tests.
- Estimated effort: 4–8 tests

## js/data.js
- Objective: Ensure actuarial data integrity and schema stability.
- Primary file: [`js/data.js`](js/data.js:1)
- Priority: High
- Tests:
  1. Structure: 'male' and 'female' keys present.
  2. Bracket coverage: base bracket (0) present; expected brackets (0,10,20,...,100) exist.
  3. Keys are numeric-strings and values parse to finite numbers.
  4. Defensive: extra/malformed keys do not break calculator when mocked.
- Test notes: Use direct import of [`js/data.js`](js/data.js:1) and assertions.
- Estimated effort: 2–4 tests

## js/gridRenderer.js
- Objective: Validate rendering logic and state classification across views.
- Primary file: [`js/gridRenderer.js`](js/gridRenderer.js:1)
- Priority: Medium-High
- Tests:
  1. Helpers: `getLifeStageKey` boundary checks; `calculateAgeAtDate` correctness across UTC dates.
  2. `renderAgeGrid`: enforce max 53 weeks when `eachWeekOfInterval` yields 54; confirm past/present/future classes.
  3. `renderCalendarGrid`: ISO week/year handling (52/53), out-of-bounds weeks, per-week age/stage correctness.
  4. `renderMonthsGrid`: 12 months per row; month state classification and life stage assignment.
  5. `renderYearsGrid`: decade rows (10/year); current year highlighting; state classes.
  6. Failure modes: missing `dateFns` -> DOM shows error-message; missing DOM element param -> no throw.
  7. Per-week calendar fallback: one ISO week computation failure logs error and rendering continues for remaining weeks.
- Test notes: Use JSDOM; mock global.dateFns with minimal functions required by each test to keep tests deterministic and fast.
- Estimated effort: 6–12 tests

## js/ui.js
- Objective: Validate form handling, state transitions, and view switching behavior.
- Primary file: [`js/ui.js`](js/ui.js:1)
- Priority: Medium
- Tests:
  1. `areInputsValid` / `updateButtonState`: enabling/disabling logic and button title.
  2. `handleCalculation` success path: mock `calculateCurrentAge` and `getRemainingExpectancy` to confirm results rendering, `lastCalcData` set, progressive reveal (form hidden, grid shown).
  3. `handleCalculation` error paths: invalid date input, future date, expectancy returns null -> displayError and grid stays hidden.
  4. `renderCurrentView`: clears content when no data; sets aria-label/tabindex when rendered; adds view-specific class to container.
  5. `renderCurrentView` fallback/error paths: missing `#grid-content-area` -> grid layout error fallback, renderer exception -> error message and aria cleanup.
  6. `handleViewChange`: updates `currentView`, toggles `.active` and ARIA attributes, re-renders; unknown view shows invalid-view error.
  7. Keyboard tablist navigation: Arrow/Home/End handling, wrap-around, non-tab focus guard, unhandled key no-op.
  8. `handleStartOver`: resets inputs, hides containers, clears `lastCalcData`.
- Test notes: Build DOM fixture using snippets from [`index.html`](index.html:1); stub imported calculator functions; use vi.resetModules() and vi.mock() for isolation.
- Estimated effort: 8–14 tests

## js/main.js
- Objective: Ensure application initialization wires up event listeners.
- Primary file: [`js/main.js`](js/main.js:1)
- Priority: Low
- Tests:
  1. `initializeApp` calls `setupEventListeners` (mock import from [`js/ui.js`](js/ui.js:1)).
  2. Safe behavior when DOM elements missing (setupEventListeners logs errors but does not throw).
- Test notes: Mock `./ui.js` export and import `js/main.js` after vi.resetModules().
- Estimated effort: 1–2 tests

## Cross-module Integration Tests
- Objective: Verify end-to-end flows with DOM + mocked dependencies.
- Scenarios:
  1. Full success flow: valid inputs -> mocked expectancy -> results area populated, grid rendered into [`#grid-content-area`](index.html:118), start-over visible.
  2. Error flow: invalid birthdate -> error shown; grid remains hidden; `lastCalcData` unchanged.
- Test notes: Use real modules but mock `dateFns` and `lifeExpectancyData` as needed; run in JSDOM.
- Estimated effort: 3–5 tests

## Current Status Snapshot (2026-03-25)
- Unit test files: `11`
- Tests passing: `67`
- Coverage:
  - Statements: `96.32%`
  - Branches: `78.84%`
  - Functions: `100%`
  - Lines: `97.8%`
- Known residual branch gaps are concentrated in defensive renderer branches that are difficult to reach without brittle synthetic mocks.

## Implementation & Best Practices
- Test runner: Vitest + JSDOM (configured in [`package.json`](package.json:1)).
- Use `vi.useFakeTimers()` and `vi.setSystemTime()` for deterministic date tests.
- Use `vi.resetModules()` and `vi.mock()` to isolate module imports and provide deterministic data fixtures.
- Avoid runtime mutation helpers embedded in production modules. Prefer supplying test fixtures via explicit `dataOverride`, `vi.mock('../../js/data.js')`, or mocking imported calculator functions when isolating UI code.
- For renderer tests that rely on date calculations, mock only the specific `date-fns` functions used and set `global.dateFns` to a minimal deterministic shim where needed.
- Create/teardown DOM fixtures per test to avoid state leakage.
- Recommended order: start with calculator and data tests (highest priority), then grid renderer helpers and edge cases, then ui and integration tests.

## References
- Combined plan file: [`.kilocode/rules/memory-bank/tests-plans.md`](.kilocode/rules/memory-bank/tests-plans.md:1)
- Per-module plans (this file): [`.kilocode/rules/memory-bank/tests-plans-by-module.md`](.kilocode/rules/memory-bank/tests-plans-by-module.md:1)

End of file.
