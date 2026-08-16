# Life Visualized — Change History

**Document status:** Historical

This record preserves dated implementation and validation evidence. It is not current execution guidance; code, configuration, active portal documents, and GitHub are authoritative for current state.

## 2026-07-28 — Worldwide Date Model

- Fixed Month and Year timezone drift from issues #33 and #34 using exact UTC month and birthday-anniversary boundaries.
- Defined February 29 anniversaries as February 28 in non-leap years.
- Added shared `js/dateUtils.js`; age and present-period state now follow browser-local calendar boundaries while generated dates remain UTC-encoded.
- Removed the unreliable `date-fns`/`date-fns-tz` CDN-global integration without attributing the integration defect to the maintained libraries.
- Added representative-zone coverage for UTC, Los Angeles, London, Tokyo, and Auckland, including local midnight, UTC rollover, DST, leap days, month/year rollover, and ISO 52/53-week years.
- Browser acceptance verified calculation, all four views, present-period state, leap-day sequences, console behavior, and Start Over.
- Final issue #35 evidence: `conda run -n base npm run verify` passed with 13 files / 87 tests; coverage was 97.96% statements, 87.09% branches, 100% functions, and 98.15% lines.
- Issue [#40](https://github.com/jordanhom/life-visualized/issues/40) records the date-library revisit gate.

## 2026-07-27 — Validation, Reset, And Calendar Weeks

- Added immediate local-calendar birthdate validation and a maximum of yesterday.
- Expanded Start Over to clear calculation/UI state, restore Weeks (Age), synchronize ARIA tab state, and return focus to birthdate.
- Replaced local-time Calendar-week calculations with deterministic native UTC ISO helpers and exact 52/53-week rows.
- Added regression coverage for invalid dates, reset behavior, known ISO week-years, unique titles, and fractional endpoints.
- Created issues #31 and #32; issue #32 later reached `main` through PR #37.
- Local evidence: 11 files / 69 tests; 96.17% statements, 81.97% branches, 100% functions, and 97.74% lines.

## 2026-03-25 — CI And Regression Quality

- Added the Node.js 20.x/22.x CI matrix and consolidated CI on `npm run verify`.
- Tightened ESLint test policy and removed low-value duplicate tests.
- Fixed stale invalid-view ARIA labeling and standardized renderer UTC day-boundary normalization, with regression tests.
- Tracked review findings in issues #28 and #29.
- Local evidence: 11 files / 68 tests; 96.32% statements, 78.84% branches, 100% functions, and 97.8% lines.

## 2026-03-24 — Tooling Security Upgrade

- Upgraded Vitest, JSDOM, c8, ESLint, and TypeScript tooling to remediate Dependabot alerts.
- Added lint, no-emit typecheck, aggregate verification, ESLint flat configuration, and TypeScript project configuration.
- Updated tests for Vitest 4 mocking semantics and reported a clean local npm audit at that point in time.
- The application still used CDN date libraries at this historical checkpoint; that architecture was superseded in July.

## 2026-01-23 — CDN Date Integration

- Added the former `date-fns-tz` CDN integration and fallback behavior, delivered through PR [#22](https://github.com/jordanhom/life-visualized/pull/22).
- Local evidence at that checkpoint was 44 passing tests.
- This runtime model was superseded by the native date-only architecture described above.

## Current References

- [Date model](../../02%20Architecture/DATE_MODEL.md)
- [Operations](../../05%20Operations/OPERATIONS.md)
- [Repository history](https://github.com/jordanhom/life-visualized/commits/main/)
