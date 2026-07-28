# Progress Log - Life Visualized

## Latest Update (2026-07-28)
- Status: Active
- Summary: Worldwide local-calendar correctness from issue #35 is implemented locally.

## Recent Changes
- Added shared native date utilities in `js/dateUtils.js`.
- Changed current age from UTC-midnight rollover to browser-local-midnight rollover.
- Changed current week, month, and age-year classification to use the browser's local calendar.
- Kept birthdates and generated boundaries as deterministic UTC-encoded calendar dates.
- Replaced Weeks (Age) `date-fns` generation with native ISO-week arithmetic.
- Removed `date-fns`, `date-fns-tz`, and obsolete browser-global type declarations.
- Documented that removal addressed the CDN-global integration and mixed date models, not defects in the maintained libraries.
- Created issue #40 to evaluate properly imported libraries, browser ESM delivery, and Temporal.
- Stored the resolved browser IANA timezone with successful calculation state.

## New/Updated Test Files
- `tests/unit/dateUtils.test.js`
- `tests/unit/calculator.test.js`
- `tests/unit/gridRenderer.calendar.test.js`
- `tests/unit/gridRenderer.edge.test.js`
- `tests/unit/gridRenderer.failure.test.js`
- `tests/unit/gridRenderer.months.test.js`
- `tests/unit/gridRenderer.years.test.js`

## Completed Tasks
- Defined one date model for local user semantics and deterministic boundaries.
- Added representative-zone coverage for both sides of UTC.
- Added local-midnight, UTC-rollover, DST, leap-day, month/year, and ISO-week regressions.
- Replaced synthetic 54-week mocks with a real age-year boundary.
- Removed obsolete missing-CDN failure tests and retained meaningful renderer failure handling.
- Added targeted Weeks (Age), UI local-date, date-helper contract, and real-module integration tests.
- Full conda verification passes: 13 test files / 87 tests.
- Coverage passes: 97.96% statements, 87.09% branches, 100% functions, 98.15% lines.
- Browser verification passes for calculation, all four renderers, present-period markers, console errors, and Start Over reset.

## Remaining Work / Next Steps
- Commit, open a PR linked to issue #35, and merge after CI.
- Continue issue #31 and coverage-threshold decisions separately.

## Notes
- Location means browser timezone for date behavior; geolocation is not requested.
- Future country-specific actuarial data remains separate and should default from location while allowing explicit “what if” selection.
