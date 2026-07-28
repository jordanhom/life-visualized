# Active Context — Life Visualized

## Last Update
- Date: 2026-07-28
- Summary: Issue #35 worldwide timezone correctness is implemented locally with a shared native date-only model.

## Recent Changes
- Added `js/dateUtils.js`:
  - Encodes the browser's local calendar date as UTC midnight for deterministic arithmetic.
  - Provides native UTC month, year, ISO-week, formatting, and age helpers.
  - Exposes the browser's resolved IANA timezone with a safe `UTC` fallback.
- Age changes at local midnight in the user's browser timezone.
- Current week, month, and age-year markers follow the user's local calendar.
- Birthdates remain timezone-free calendar values encoded at UTC midnight.
- Replaced all remaining `date-fns`/`date-fns-tz` runtime use and removed both CDN scripts.
- Added regression coverage for:
  - Los Angeles, UTC, London, Tokyo, and Auckland.
  - Local midnight, UTC rollover, DST, leap days, month/year rollover, and ISO 52/53-week years.
  - Renderer operation without external date-library globals.
- Added targeted coverage for Weeks (Age) local rollover, UI validation across UTC rollover, native date-helper migration contracts, and a real-module calculation/render flow.
- Current local test baseline: 13 files / 87 tests passing.
- Current local coverage baseline:
  - Statements `97.96%`
  - Branches `87.09%`
  - Functions `100%`
  - Lines `98.15%`
- Browser verification passed in the Pacific-time runtime for calculation, all four views, console errors, and Start Over reset.
- GitHub tracking:
  - Issues #33 and #34 are closed after PR #39 reached `main`.
  - Issue #35 tracks the current branch.
  - Issue #40 investigates maintained date libraries, module delivery, and Temporal as the timezone architecture grows.

## Next Steps
- Commit, open a PR linked with `Fixes #35`, and merge after CI passes.
- Evaluate the native-helper tradeoff separately under issue #40; do not mix that investigation into the issue #35 behavior fix.
- Implement issue #31 while keeping Calendar weeks as the default alignment.
- Decide whether to enforce minimum branch coverage in CI.
