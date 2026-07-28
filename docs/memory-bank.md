# Memory Bank

## 2026-07-27

- Behavior audit created GitHub issues:
  - https://github.com/jordanhom/life-visualized/issues/31
  - https://github.com/jordanhom/life-visualized/issues/32
- Implemented UI refinements:
  - Birthdate input is limited to yesterday and Calculate remains disabled for today/future dates.
  - Start Over clears all calculation/UI state and restores Weeks (Age) with synchronized tab ARIA state.
- Fixed Calendar visualization timezone behavior:
  - Replaced local-time ISO week calculations with native UTC helpers.
  - Verified known 52/53-week years and UTC Monday start dates in the Pacific-time browser runtime.
  - Preserved fractional lifespan endpoints and UTC title formatting.
- Added regression tests:
  - `tests/unit/ui.test.js`
  - `tests/unit/gridRenderer.calendar.test.js`
- Verification:
  - `npm run verify` passes.
  - Baseline: 11 test files, 69 tests passing.
  - Coverage: 96.17% statements, 81.97% branches, 100% functions, 97.74% lines.

## 2026-03-25

- Manual review identified two gaps and tracked them as GitHub issues:
  - https://github.com/jordanhom/life-visualized/issues/28
  - https://github.com/jordanhom/life-visualized/issues/29
- Implemented fixes:
  - Removed stale `aria-label` in invalid-view handling (`js/ui.js`).
  - Switched renderer day-boundary normalization to deterministic UTC (`js/gridRenderer.js`).
- Added regression tests:
  - `tests/unit/ui.test.js`
  - `tests/unit/gridRenderer.years.test.js`
- Verification:
  - `npm run verify` passes.
  - Baseline: 11 test files, 68 tests passing.
