# Active Context — Life Visualized

## Last Update
- Date: 2026-03-24
- Summary: Security/tooling hardening completed on `main`: Dependabot remediation via dev-dependency upgrades, CI upgraded to Node 20, and quality gates (lint + typecheck + tests) added.

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
- Current local test baseline: 12 files / 47 tests passing.

## Next Steps
- Monitor default-branch Dependabot re-evaluation after push/PR merge.
- Keep CI and local dev aligned to Node 20+.
- Continue incremental modularization of large files (`js/ui.js`, `js/gridRenderer.js`, `css/style.css`) without behavior regressions.
