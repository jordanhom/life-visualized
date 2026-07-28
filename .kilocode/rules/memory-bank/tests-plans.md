# Module-specific Unit Test Plans

Brief summary: This file contains separated plans for unit testing each core module of the project.

## js/calculator.js
- Objective: Validate age calculations and life-expectancy lookup logic.
- Primary functions: [`js/calculator.js`](js/calculator.js:1)
- Priority: High
- Tests:
  1. Age calculation edge cases: birthday passed, birthday not reached, leap-day handling, future birth date.
  2. getRemainingExpectancy: exact bracket matches, mid-bracket ages, very large ages, unknown sex -> null.
  3. Invalid data handling: non-numeric strings, Infinity, NaN, missing sex keys -> returns null.
- Test notes: Freeze time with vi.useFakeTimers(); mock [`js/data.js`](js/data.js:1) via vi.mock for specific values.
- Estimated effort: 3–5 test groups (~8–12 test cases)

## js/data.js
- Objective: Ensure actuarial data integrity and schema stability.
- File: [`js/data.js`](js/data.js:1)
- Priority: High
- Tests:
  1. Structure: 'male' and 'female' keys present.
  2. Bracket coverage: base bracket 0 present; expected brackets (0,10,20,...,100) exist.
  3. Keys are numeric-strings and values parse to finite numbers.
  4. Defensive: Unexpected extra keys do not break calculator when mocked.
- Test notes: Leverage existing tests in [`tests/unit/data.test.js`](tests/unit/data.test.js:1).
- Estimated effort: 2–4 tests

## js/gridRenderer.js
- Objective: Validate rendering logic and state classification across views.
- Primary file: [`js/gridRenderer.js`](js/gridRenderer.js:1)
- Priority: Medium-High
- Tests:
  1. Helper functions: `getLifeStageKey` boundary checks; `calculateAgeAtDate` date cases.
  2. renderAgeGrid: enforce max 53 weeks when `eachWeekOfInterval` returns 54 (edge test exists).
  3. renderCalendarGrid: native UTC ISO boundaries for known 52/53-week years, unique Monday starts, fractional lifespan endpoints, out-of-bounds weeks, and present/past/future classification.
  4. renderMonthsGrid: exact fractional-lifespan counts, unique native UTC month boundaries, state classification, and life-stage assignment across representative timezones.
  5. renderYearsGrid: exact fractional-lifespan counts, native UTC anniversaries, decade rows, anniversary-based state classes, and explicit leap-day behavior.
  6. Failure modes: missing `dateFns` -> renderer writes error message; missing DOM element param.
- Test notes: Use JSDOM. Month/Year tests should poison local-time `dateFns` functions so production UTC helpers are exercised directly.
- Estimated effort: 6–10 test cases

## js/ui.js
- Objective: Validate form handling, state transitions, and view switching behavior.
- Primary file: [`js/ui.js`](js/ui.js:1)
- Priority: Medium
- Tests:
  1. areInputsValid / updateButtonState: enabling/disabling logic, yesterday maximum, and today/future rejection.
  2. handleCalculation: success path (mock calculator + data), results rendering, progressive reveal.
  3. handleCalculation: error paths (invalid date input, future date, getRemainingExpectancy returns null).
  4. renderCurrentView: clears content when no data; sets aria-label/tabindex when rendered.
  5. handleViewChange: updates `currentView`, toggles `.active` and ARIA attributes, re-renders.
  6. handleStartOver: clears inputs/results/data, restores Weeks (Age) and synchronized tab ARIA state, and focuses birthdate.
- Test notes: Create DOM fixtures, mock `calculateCurrentAge` and `getRemainingExpectancy` via vi.mock or spies; use time freezing where needed.
- Estimated effort: 8–12 tests

## js/main.js
- Objective: Ensure application initialization wires up event listeners.
- Primary file: [`js/main.js`](js/main.js:1)
- Priority: Low
- Tests:
  1. initializeApp calls `setupEventListeners` (mocked import from [`js/ui.js`](js/ui.js:1)).
  2. Safe behavior when DOM elements are missing (setupEventListeners logs errors).
- Estimated effort: 1–2 tests

## Cross-module Integration Tests
- Objective: Verify end-to-end flows with DOM + mocked dependencies.
- Scenarios:
  1. Full flow: valid inputs -> mocked expectancy -> results area populated, grid rendered, start-over visible.
  2. Error flow: invalid birthdate -> error shown; grid remains hidden.
- Test notes: Use real modules but mock `dateFns` as needed; run in JSDOM environment.
- Estimated effort: 3–4 tests

## Implementation Guidance (applies to all modules)
- Use Vitest + JSDOM. Freeze system time with vi.useFakeTimers() and vi.setSystemTime().
- Use vi.resetModules() and vi.mock() to isolate module imports and control test data.
- Create/teardown DOM fixtures per test to avoid cross-test contamination.
- Start with calculator & data tests, then grid renderer helpers & edge cases, then ui/integration tests.

## Memory Bank Update
- This plan is saved to [`tests-plans.md`](.kilocode/rules/memory-bank/tests-plans.md:1).
- Recommendation: add a brief entry in [`progress.md`](.kilocode/rules/memory-bank/progress.md:1) referencing planned tests and status when implemented.

End of file.
