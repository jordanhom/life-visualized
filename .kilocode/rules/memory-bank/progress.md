# Progress Log - Life Visualized

## Latest Update (2025-12-07)
- Status: Active
- Summary: Local development updates to the calculator module and tests completed. Full unit test suite passes locally (44/44).

## Recent Changes
- Updated core calculation logic in [`js/calculator.js`](js/calculator.js:1):
  - Added strict input validation for `calculateCurrentAge` and `getRemainingExpectancy`.
  - Hardened age-bracket lookup with an efficient bracket selector and deterministic fallback behavior.
- Extended and corrected tests in [`tests/unit/calculator.test.js`](tests/unit/calculator.test.js:1):
  - Added leap-day, boundary-second, future-date, and malformed-data test cases.
  - Aligned test expectations for invalid sex input (now throws).
- Updated module documentation: [`docs/calculator.md`](docs/calculator.md:1) to reflect current behavior, error contracts, and recommended next steps.
- Minor test infra and doc updates to reflect deterministic UTC-based calculation semantics.

## New/Updated Test Files
- `tests/unit/calculator.test.js` (expanded and aligned to new behavior)
- `tests/setup/jsdom-helper.js`
- `tests/unit/ui.axis-aria.test.js`
- `tests/unit/main.test.js`

## Completed Tasks
- Implemented JSDOM helper and applied it to fragile tests.
- Replaced unsafe runtime test overrides in affected tests.
- Hardened calculator logic and added/updated unit tests.
- Updated `docs/calculator.md` to document behavior and future improvements.
- All unit tests pass locally (44/44).

## Remaining Work / Next Steps
- Commit changes on branch `mvp/tests/unit-complete` and push (recommended).
- Replace the global test override (`__setLifeExpectancyDataOverride`) with an explicit `dataOverride` parameter on `getRemainingExpectancy(...)` and deprecate the setter.
- Consider making `lifeExpectancyData` a synchronous import at module top and cache parsed/sorted age brackets per sex to improve performance.
- Decide and document a single error-return policy (throw vs return-null) for data-not-found vs invalid-data cases and harmonize code & docs.
- Add CI workflow to run Vitest on push (`.github/workflows/ci.yml`) and run tests in CI.

## Test Summary (current)
- Command: `npx vitest --run`
- Current result summary: 44 tests passing locally (0 failing).

## Notes
- Tests use `tests/setup/jsdom-helper.js` to ensure Event constructors and DOM APIs are sourced from the same JSDOM window.
- New calculator behavior intentionally uses UTC-based Date getters for deterministic results across timezones.
- Documentation (`docs/calculator.md`) includes recommended refactors and deprecation notes for the current test helper.
- Recommend committing these changes and opening a PR for review (branch: `mvp/tests/unit-complete`).