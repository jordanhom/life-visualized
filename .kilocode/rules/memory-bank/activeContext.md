# Active Context — Life Visualized

## Last Update
- Date: 2026-07-27
- Summary: Behavior audit refinements completed for input validation, Start Over state, and timezone-independent ISO Calendar weeks.

## Recent Changes
- Added immediate birthdate validation:
  - `#birthdate.max` is set to yesterday using the browser's local calendar date.
  - Today, future dates, malformed dates, and incomplete forms keep Calculate disabled.
  - Submit-time validation remains as a defensive check.
- Expanded Start Over into a complete initial-state reset:
  - Clears inputs, results, calculation data, grid content, and error styling.
  - Restores Weeks (Age) as the active view with synchronized `aria-selected`, `tabindex`, and `aria-labelledby`.
  - Successful calculations focus the selected tab instead of always focusing the first tab.
- Replaced Calendar view's local-time `date-fns` ISO calculations with deterministic UTC helpers:
  - Correct 52/53-week counts and Monday week starts across browser timezones.
  - UTC-safe title formatting no longer depends on `date-fns-tz`.
  - Fractional lifespan endpoints are retained using month-based UTC arithmetic.
- Added regression coverage in:
  - `tests/unit/ui.test.js`
  - `tests/unit/gridRenderer.calendar.test.js`
- Created GitHub tracking:
  - Issue #31: Calendar/Birthday week-alignment toggle (backlog enhancement).
  - Issue #32: Incorrect ISO Calendar week counts/dates (fixed locally; open pending merge).
- Current local test baseline: 11 files / 69 tests passing.
- Current local coverage baseline:
  - Statements `96.17%`
  - Branches `81.97%`
  - Functions `100%`
  - Lines `97.74%`

## Next Steps
- Commit and merge the current behavior refinements; close issue #32 after the fix reaches `main`.
- Implement issue #31 with Calendar weeks as the default alignment.
- Address remaining timezone-sensitive Month/Year renderer operations and the unavailable `date-fns-tz` runtime global identified during the audit.
- Decide whether to enforce minimum branch coverage in CI.
