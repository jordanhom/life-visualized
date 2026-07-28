# Progress Log - Life Visualized

## Latest Update (2026-07-27)
- Status: Active
- Summary: Behavior audit fixes completed for immediate validation, full reset behavior, and timezone-independent Calendar weeks.

## Recent Changes
- Immediate input validation added in [`js/ui.js`](js/ui.js:1):
  - Birthdate maximum is yesterday in the browser's local calendar.
  - Calculate remains disabled for today, future, malformed, or incomplete input.
- Start Over now resets inputs, results, renderer data, selected view, ARIA state, and focus.
- Calendar rendering corrected in [`js/gridRenderer.js`](js/gridRenderer.js:1):
  - Native UTC ISO week helpers replace timezone-sensitive local `date-fns` calculations.
  - 52/53-week counts and Monday start dates are deterministic.
  - Fractional lifespan endpoints and UTC-formatted titles are preserved.
- GitHub issues created:
  - #31 Add week-alignment toggle for age-based visualization.
  - #32 Fix incorrect ISO week counts and dates in Calendar view.

## New/Updated Test Files
- `tests/unit/ui.test.js` (immediate date validation and complete reset state)
- `tests/unit/gridRenderer.calendar.test.js` (known ISO 52/53-week boundaries, unique starts, fractional endpoints)

## Completed Tasks
- Audited primary UI flows in the local browser.
- Fixed inactive-tab focus after recalculation.
- Implemented full Start Over reset behavior.
- Implemented immediate birthdate validity feedback.
- Fixed Calendar view ISO week calculations across timezones.
- Verified known ISO years in the Pacific-time browser runtime.
- Local verification succeeds via `npm run verify` (69/69 tests pass).

## Remaining Work / Next Steps
- Commit and merge current changes; close issue #32 after merge.
- Implement issue #31 while keeping Calendar weeks as the default.
- Correct remaining Month/Year timezone-sensitive date operations.
- Decide whether to repair/remove the unavailable `date-fns-tz` browser global.
- Decide whether to add coverage threshold enforcement in CI (branch threshold candidate).

## Test Summary (current)
- Commands:
  - `npm run verify`
  - `npm run test:run`
  - `npm run test:coverage`
- Current result summary: 69 tests passing locally (0 failing), 11 test files.
- Current coverage summary:
  - Statements: `96.17%`
  - Branches: `81.97%`
  - Functions: `100%`
  - Lines: `97.74%`

## Notes
- Local quality checks now have a single entrypoint (`npm run verify`) suitable for pre-PR runs.
- CI now enforces lint/typecheck/tests in sequence for stronger baseline confidence.
- Runtime app architecture remains static + CDN-based, but Calendar ISO calculations no longer rely on timezone library behavior.
