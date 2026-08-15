# Life Visualized — Operations

**Document status:** Active

## Setup And Development

- Use Node.js 20.x or 22.x through Conda `base` unless another environment is named.
- Reproducible install: `conda run -n base npm ci`.
- Serve the repository root over HTTP, for example `python -m http.server 8000`; native ES modules are not supported through `file://`.
- There is no production build command.

## Verification

- Aggregate gate: `conda run -n base npm run verify` (lint, typecheck, non-watch tests).
- Coverage: `conda run -n base npm run test:coverage`.
- CI runs `npm ci` and `npm run verify` on Node.js 20.x and 22.x for pushes and pull requests targeting `main` or `master`.
- Rendering, interaction, accessibility, responsive, or timezone-sensitive changes also require browser acceptance against the final tested state.

## Deployment And Release

- Deployment mechanism is not established in tracked repository configuration.
- Releases must originate from a clean `main`; package version, tag, notes, and published release must agree.
- Publishing, moving, or deleting a release tag requires explicit approval.

## Troubleshooting And Recovery

- If native modules fail, confirm the repository is served over HTTP rather than opened through `file://`.
- For date regressions, reproduce across representative `TZ` values and inspect `js/dateUtils.js` before renderer-local fixes.
- Treat `node_modules/` and `coverage/` as generated artifacts; restore them with install or verification commands rather than editing them.

## Canonical References

- [`package.json`](../../../package.json)
- [CI workflow](../../../.github/workflows/ci.yml)
- [Date model](../../dateUtils.md)
