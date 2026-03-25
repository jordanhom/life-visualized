# Active Context — Life Visualized

## Last Update
- Date: 2026-03-25
- Summary: Branch test expansion pass completed. Coverage increased substantially with focused `ui`/`gridRenderer`/`calculator` tests, then low-value duplicate tests were pruned.

## Recent Changes
- Upgraded dev deps:
  - `vitest` -> `^4.1.1`
  - `jsdom` -> `^29.0.1`
  - `c8` -> `^11.0.0`
- Added quality gate tooling and config:
  - `eslint`, `@eslint/js`, `globals`
  - `typescript`, `@types/node`
  - `eslint.config.js`, `tsconfig.json`, `types/globals.d.ts`
- Updated CI workflow to run:
  - `npm ci`
  - `npm run lint`
  - `npm run typecheck`
  - `npm run test:run`
- Updated tests for Vitest 4 mocking semantics (`vi.doMock(...)` where needed).
- Expanded branch-focused coverage tests across:
  - `tests/unit/ui.test.js`
  - `tests/unit/calculator.test.js`
  - `tests/unit/gridRenderer.calendar.test.js`
  - `tests/unit/gridRenderer.months.test.js`
  - `tests/unit/gridRenderer.years.test.js`
  - `tests/unit/gridRenderer.failure.test.js`
- Pruned low-value test overlap:
  - Removed `tests/unit/data-inspect.test.js` (debug-only).
  - Removed duplicate invalid-sex assertion in `calculator.test.js`.
- Current local test baseline: 11 files / 67 tests passing.
- Current local coverage baseline:
  - Statements `96.32%`
  - Branches `78.84%`
  - Functions `100%`
  - Lines `97.8%`

## Next Steps
- Push branch changes and open PR with updated coverage summary.
- Decide whether to enforce minimum branch coverage in CI.
- Keep focused refactor work scoped to high-complexity modules (`js/ui.js`, `js/gridRenderer.js`) while preserving current test baseline.
