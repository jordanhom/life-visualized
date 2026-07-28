# Active Context — Life Visualized

## Last Update
- Date: 2026-07-28
- Summary: Month and Year renderers now use timezone-independent UTC boundaries, titles, and state classification.

## Recent Changes
- Replaced Month view's local-time `date-fns` operations with native UTC helpers:
  - Generates exactly `ceil(totalLifespanYearsEst * 12)` month blocks.
  - Calculates month starts, current-month state, life stages, and `Starts UTC` titles from UTC components.
  - Produces identical boundaries under UTC, Los Angeles, London, Tokyo, and Auckland timezone settings.
- Replaced Year view's local-time anniversary operations and formatting:
  - Generates exactly `ceil(totalLifespanYearsEst)` UTC birthday-anniversary blocks.
  - Classifies past/present/future from consecutive anniversary boundaries.
  - Defines February 29 anniversaries as February 28 in non-leap years.
- Reworked Month/Year tests to poison local-time `dateFns` operations and exercise production UTC helpers.
- Browser-verified the issue reproductions in the Pacific-time runtime:
  - Month Age 0/Month 1 for `2000-01-01` starts `2000-01-01`.
  - Year Age 0 for `1990-06-15` starts `1990-06-15`.
  - Leap-day titles follow Feb 29 -> Feb 28 -> Feb 29 as years require.
- GitHub tracking:
  - Issue #32 is closed after PR #37 reached `main`.
  - Issues #33 and #34 are fixed locally on `codex/fix-month-year-timezones`, pending merge.
  - Issue #35 tracks broader worldwide local-time correctness.
- Current local test baseline: 11 files / 69 tests passing.
- Current local coverage baseline:
  - Statements `95.81%`
  - Branches `82.62%`
  - Functions `100%`
  - Lines `97.36%`

## Next Steps
- Commit, open a PR, and merge the Month/Year fixes; close issues #33 and #34 after they reach `main`.
- Continue worldwide timezone correctness under issue #35, especially Weeks (Age), current-period semantics, and age calculation at local midnight.
- Implement issue #31 with Calendar weeks as the default alignment.
- Decide whether to remove the unavailable `date-fns-tz` runtime dependency.
- Decide whether to enforce minimum branch coverage in CI.
