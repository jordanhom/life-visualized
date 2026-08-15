# System Patterns

## Architecture Summary

- Static HTML/CSS/vanilla-JavaScript SPA using native ES modules.
- `index.html` -> `js/main.js` -> `js/ui.js`; UI coordinates calculator/data, date helpers, and grid rendering.

## Important Patterns And Invariants

- Birthdates are timezone-free dates encoded at UTC midnight after validation.
- Browser-local calendar components determine today, age rollover, and present-period state; generated boundaries use UTC arithmetic.
- Four views share one in-memory calculation state. Reset restores Weeks (Age), visibility, focus, and ARIA state.
- User birthdate/sex data is not transmitted or persisted.

## Boundaries And Tradeoffs

- No backend, runtime dependency, bundler, or production build command.
- Native date helpers keep the static delivery model simple but make timezone regression coverage a repository responsibility.
- UI owns orchestration/accessibility, calculator owns estimates, date utilities own calendar behavior, and renderer owns grid DOM.

## Canonical References

- [Architecture](../docs/portal/02%20Architecture/ARCHITECTURE.md)
- [Repository map](../docs/portal/08%20AI%20Context/REPO_MAP.md)
- [Date model](../docs/dateUtils.md)
