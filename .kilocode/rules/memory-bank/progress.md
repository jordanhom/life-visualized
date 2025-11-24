# Progress Log - Life Visualized

## Latest Update (2025-11-24)
- Status: Active
- Summary: Added and refined unit tests for the calculator module and adjusted test strategy to ensure deterministic coverage and dynamic-import path validation.

## Recent Changes
- tests: Updated [`tests/unit/calculator.test.js`](tests/unit/calculator.test.js:1) to add UTC boundary, leap-day, bracket-fallback, non-standard key, and invalid-value tests. All calculator tests pass locally.
- code: Added a lightweight test-only override helper (`__setLifeExpectancyDataOverride`) in [`js/calculator.js`](js/calculator.js:48) to allow deterministic unit tests, and added a vi.mock-based test to validate the dynamic-import path.
- verification: Ran `npx vitest tests/unit/calculator.test.js --run` locally — 18 tests passed.

## Completed Tasks
- Implement core calculator logic and UTC-based age calculation. (Completed)
- Implement getRemainingExpectancy bracket lookup and fallback behavior. (Completed)
- Add unit tests for calculator edge cases and deterministic mocks. (Completed)

## Next Steps
- Implement focused tests for [`js/gridRenderer.js`](js/gridRenderer.js:1) edge cases (52/53/54-week handling).
- Implement DOM/integration tests for [`js/ui.js`](js/ui.js:1).
- Add CI job to run Vitest on push.

## Notes
- The temporary test override exists to make deterministic tests practical; consider refactoring to pure `vi.mock` usage in a single future cleanup to avoid test-only runtime helpers.
- See test file: [`tests/unit/calculator.test.js`](tests/unit/calculator.test.js:1) and source: [`js/calculator.js`](js/calculator.js:1) for implementation details.