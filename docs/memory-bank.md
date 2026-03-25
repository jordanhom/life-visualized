# Memory Bank

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
