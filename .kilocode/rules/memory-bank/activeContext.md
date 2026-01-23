# Active Context — Life Visualized

## Last Update
- Date: 2026-01-23
- Summary: WIP branch `wip-jhom-tests-20251124` merged into `main` (PR #22). Added timezone-handling improvements to `js/gridRenderer.js` and included `date-fns-tz` via CDN in `index.html` to support timezone-aware formatting.

## Recent Changes
- Added `date-fns-tz` CDN and updated renderer to use `utcToZonedTime` / `formatInTimeZone` when available; fallback to core `date-fns` when not present.
- Ran unit tests locally: 44 tests passed.
- Created issues for further cleanups and test hardening (#18, #20).

## Next Steps
- Tidy and make time-dependent tests deterministic (Issue #18).
- Replace runtime life-expectancy test override with explicit mocking or add a dataOverride parameter (Issue #20).
- Update docs and memory bank with these changes (this file).

