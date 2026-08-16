# Life Visualized — Architecture

**Document status:** Active

## Current System

The application is a static HTML/CSS/JavaScript SPA using native ES modules. Production has no runtime package dependencies, bundler, backend, database, account system, or persistence layer.

## Components And Data Flow

- `index.html` defines the page and loads `js/main.js`.
- `js/main.js` is intentionally limited to booting `js/ui.js` after DOM readiness; it exports no API and must not accumulate application responsibilities.
- `js/ui.js` owns validation, shared UI state, progressive reveal, view switching, reset, and accessibility coordination.
- `js/calculator.js` combines age with `js/data.js` actuarial brackets.
- `js/gridRenderer.js` renders all four grids; `js/dateUtils.js` owns shared calendar arithmetic.
- Results exist only in browser memory and are rendered into the DOM.
- `js/ui.js` keeps the selected view and last calculation in module-level memory so view changes rerender without recalculation.
- `js/gridRenderer.js` batches direct DOM creation with `DocumentFragment` and targets `#grid-content-area`, preserving the controls and guide nested in the surrounding grid container.

## Invariants And Boundaries

- Birthdate input is a timezone-free `YYYY-MM-DD` calendar value encoded at UTC midnight after validation.
- Local-calendar concepts use browser-local date components; deterministic arithmetic uses UTC methods.
- User input is not collected, transmitted, or persisted.
- CSS class names, progressive reveal, reset state, tab semantics, and the four-view contract are user-visible integration boundaries.
- Modern evergreen browsers are the supported runtime class; legacy browsers without native ES-module and modern CSS support are out of scope.

## Decisions And Tradeoffs

- Native date helpers avoid the prior CDN-global integration and mixed local/UTC model. This shifts calendar maintenance into the repository; [issue #40](https://github.com/jordanhom/life-visualized/issues/40) records revisit criteria.
- DOM rendering remains appropriate for the current lifespan scale; virtualization or canvas is not established as necessary.

## Canonical References

- [Date model](DATE_MODEL.md)
- [Visualization workflow](../04%20Core%20Workflows/VISUALIZATION_WORKFLOW.md)
- [Repository map](../08%20AI%20Context/REPO_MAP.md)
