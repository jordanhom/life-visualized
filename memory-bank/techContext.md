# Technology Context

## Stack

- HTML5, CSS3, and vanilla JavaScript ES modules in the browser.
- Development-only npm tooling: ESLint, TypeScript typecheck, Vitest, JSDOM, and coverage tooling.

## Development Environment

- Use Conda `base` for Node/npm commands unless another environment is named.
- CI supports Node.js 20.x and 22.x.

## Technical Constraints

- Native modules require HTTP serving; do not validate through `file://`.
- There is no production build command or runtime package dependency.
- `node_modules/` and `coverage/` are generated and ignored.

## Verified Entry Points

- Setup: `conda run -n base npm ci`
- Development: serve the repository root, for example `python -m http.server 8000`
- Build: Not established; the application is served as source files.
- Test: `conda run -n base npm run verify`
- Coverage: `conda run -n base npm run test:coverage`

## Canonical References

- [Operations](../docs/portal/05%20Operations/OPERATIONS.md)
- [`package.json`](../package.json)
