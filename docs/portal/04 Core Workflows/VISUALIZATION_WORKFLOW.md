# Life Visualized — Visualization Workflow

**Document status:** Active

## UI Orchestration

`js/ui.js` exports `setupEventListeners()` and owns input validation, in-memory calculation state, progressive reveal, result/error presentation, view switching, axis labels, reset, focus, and ARIA coordination.

- Birthdate is limited to yesterday or earlier in the browser's local calendar.
- Accepted input is normalized to UTC-encoded calendar components before calculation and rendering.
- `currentView` and `lastCalcData` let view changes rerender without recalculation.
- A successful calculation hides the form, reveals results and visualization controls, and defaults to Weeks (Age).
- An error displays an announced message without revealing a stale grid.
- Start Over clears inputs, results, calculation data, and rendered blocks; restores Weeks (Age) and synchronized tab state; disables Calculate; and returns focus to birthdate.
- The resolved browser IANA timezone is retained with successful calculation state for diagnostics.

The stable DOM boundary is defined in `index.html`: the form and results, the surrounding grid container and controls, `#grid-content-area`, axis labels, and Start Over controls. Rendering must target `#grid-content-area` so controls and the guide are not cleared.

## Renderer Contract

`js/gridRenderer.js` exposes `renderAgeGrid`, `renderCalendarGrid`, `renderMonthsGrid`, and `renderYearsGrid`. Each receives a UTC-encoded birthdate, estimated lifespan in years, and target container. Renderers batch DOM appends with `DocumentFragment` and assign life-stage plus `past`, `present`, `future`, or Calendar-view `out-of-bounds` state.

### Weeks (Age)

- Generates Monday-aligned weeks overlapping each birthday-to-birthday interval.
- Excludes starts at or after the next birthday and trims a natural 54-week span to 53.
- Titles identify the UTC week start and current week.

### Weeks (Calendar)

- Iterates ISO week-years and renders exactly 52 or 53 unique Monday-aligned weeks per row.
- Keeps full calendar-year structure while dimming weeks before birth or after the estimated end.
- Preserves fractional lifespan endpoints through deterministic UTC month arithmetic.

### Months

- Renders exactly `ceil(totalYears * 12)` UTC month boundaries in twelve-block age rows.
- Derives stages, current month, and titles from the shared date model.

### Years

- Renders exactly `ceil(totalYears)` birthday-anniversary boundaries in decade rows.
- Uses February 28 for February 29 anniversaries in non-leap years.
- Classifies state from consecutive anniversary intervals.

## Accessibility And Verification

- The view switcher follows the ARIA tablist pattern with synchronized `aria-selected`, `tabindex`, and tabpanel `aria-labelledby`.
- Renderer rows expose contextual `aria-label` values; top-level panel labeling and focus remain UI responsibilities.
- Preserve CSS stage/state classes, progressive reveal, keyboard navigation, focus restoration, and responsive behavior.
- Tests cover validation, success/error/reset flows, tab keyboard behavior, missing-DOM and renderer failures, exact block counts, ISO boundaries, leap-day sequences, and current-period behavior across UTC rollover.
- Rendering or interaction changes also require browser acceptance against the final tested state.

## References

- [`index.html`](../../../index.html)
- [`js/ui.js`](../../../js/ui.js)
- [`js/gridRenderer.js`](../../../js/gridRenderer.js)
- [Date model](../02%20Architecture/DATE_MODEL.md)
- [Core workflow summary](CORE_WORKFLOWS.md)
