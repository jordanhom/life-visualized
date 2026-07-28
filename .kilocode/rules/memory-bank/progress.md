# Progress Log - Life Visualized

## Latest Update (2026-07-28)
- Status: Active
- Summary: Issues #33 and #34 are fixed locally with native UTC Month/Year generation and regression coverage.

## Recent Changes
- Month rendering corrected in [`js/gridRenderer.js`](js/gridRenderer.js:1):
  - Native UTC helpers replace `dateFns.startOfMonth`, `addMonths`, comparisons, and formatting.
  - Exact fractional-lifespan block counts and unique month starts are preserved.
  - Current-month state and life stages use corrected UTC month boundaries.
- Year rendering corrected in [`js/gridRenderer.js`](js/gridRenderer.js:1):
  - Native UTC birthday anniversaries replace local-time `dateFns.addYears`.
  - Anniversary intervals determine past/present/future state.
  - February 29 clamps to February 28 in non-leap years.
- Issue #32 was merged through PR #37 and closed.
- Issues #33 and #34 remain open until this branch reaches `main`.

## New/Updated Test Files
- `tests/unit/gridRenderer.months.test.js`
- `tests/unit/gridRenderer.years.test.js`
- `tests/unit/gridRenderer.failure.test.js`

## Completed Tasks
- Reproduced the Month and Year timezone defects.
- Removed Month/Year dependence on local-time arithmetic and `date-fns-tz` formatting.
- Added timezone-invariant regressions for UTC, Los Angeles, London, Tokyo, and Auckland settings.
- Added exact fractional-lifespan count and unique-boundary checks.
- Defined and tested leap-day anniversary behavior.
- Browser-verified both issue reproductions and leap-day titles.
- Local verification succeeds via `conda run -n base npm run verify` (69/69 tests pass).

## Remaining Work / Next Steps
- Commit and merge the current changes; close issues #33 and #34 after merge.
- Continue issue #35 for worldwide local-time semantics outside Month/Year generation.
- Implement issue #31 while keeping Calendar weeks as the default.
- Decide whether to remove the unavailable `date-fns-tz` browser dependency.
- Decide whether to add coverage threshold enforcement in CI.

## Test Summary (current)
- Commands:
  - `conda run -n base npm run verify`
  - `conda run -n base npm run test:coverage`
- Current result summary: 69 tests passing locally (0 failing), 11 test files.
- Current coverage summary:
  - Statements: `95.81%`
  - Branches: `82.62%`
  - Functions: `100%`
  - Lines: `97.36%`

## Notes
- Month/Year tests deliberately make local-time `dateFns` operations unusable so regressions cannot be hidden by UTC-only mocks.
- Runtime architecture remains static and CDN-based. Only Weeks (Age) still relies on `date-fns` for boundary generation.
