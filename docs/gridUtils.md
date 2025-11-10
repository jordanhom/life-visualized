# Grid Utilities (`js/gridUtils.js`) — Planned

Purpose
Centralize pure date helpers, life-stage classification, and lightweight DOM factories used by `js/gridRenderer.js`. Designed for testability and incremental migration.

Location (planned)
- [`js/gridUtils.js`](js/gridUtils.js:1)

Public API (detailed)
- getISOWeekStart(isoYear: number, weekNum: number): Date
  - Return UTC Date for start-of-ISO-week.

- getWeeksForInterval(startUTC: Date, endUTC: Date, opts?: { weekStartsOn?: number }): Date[]
  - Return all week-start UTC Dates overlapping the interval [startUTC, endUTC).

- getWeeksForAgeYear(birthDateUTC: Date, age: number, opts?: {}): Date[]
  - Convenience wrapper: computes the interval [birthday+age, birthday+age+1y) and returns week-starts.

- getMonthsForLifespan(birthDateUTC: Date, totalYears: number): { start: Date, age: number, monthIndex: number }[]
  - Returns month-start metadata for each month up to the estimated lifespan.

- getYearsForLifespan(birthDateUTC: Date, totalYears: number): { start: Date, age: number }[]
  - Returns year-start metadata for each year up to the estimated lifespan.

- classifyBlockByDate(blockStartUTC: Date, birthDateUTC: Date, estimatedEndUTC: Date, opts?: { nowUTC?: Date })
  - Returns { stageKey: string, state: 'past'|'present'|'future'|'out-of-bounds' }.
  - Encapsulates lifecycle classification and preserves the `stage-{key}` names used by CSS.

- makeBlockElement({ type, startDateUTC, age, stageKey, state, title, extraAttrs }): HTMLElement
  - Creates a DOM element (div) with appropriate classes (`week-block`/`month-block`/`year-block`), `stage-{key}`, and state class. Sets `title` and applies `extraAttrs`. Does not append the element.

- renderRow(container: HTMLElement, blockElements: HTMLElement[], opts?: { rowLabel?: string, rowAttrs?: Record<string,string> }): void
  - Appends blocks into the container using a DocumentFragment and optionally sets `aria-label`/attributes on the row wrapper.

Types & constants to export
- LIFE_STAGES (reuse from [`js/gridRenderer.js`](js/gridRenderer.js:1)) and getLifeStageKey(age) — keep singular source of truth.
- Optionally export helper types for blocks and view kinds.

Design notes
- Pure helpers whenever possible; allow injection of `nowUTC` for deterministic tests.
- Centralize `date-fns` usage here to keep renderers thin.
- Preserve existing CSS class names and titles to avoid stylesheet churn.
- Keep DOM factories minimal and side-effect free beyond element creation.

Example usage (months view)
const months = getMonthsForLifespan(birthUTC, totalYears);
const blocks = months.map(m => {
  const { stageKey, state } = classifyBlockByDate(m.start, birthUTC, estimatedEndUTC);
  return makeBlockElement({
    type: 'month',
    startDateUTC: m.start,
    age: m.age,
    stageKey,
    state,
    title: `Age ${m.age}, Month ${m.monthIndex}`
  });
});
renderRow(containerForYear, blocks, { rowLabel: `Age ${yearNum}` });

Testing & harness
- See [`docs/gridUtils-tests.md`](docs/gridUtils-tests.md:1) for console examples and an HTML harness template.
- Tests should use fixed UTC dates and inject `nowUTC` to ensure determinism.
- Expose helpers on `window` in `tests/gridUtils.test.html` for rapid console assertions.

Migration path (incremental)
1. Add `js/gridUtils.js` exporting pure helpers and constants.
2. Refactor [`js/gridRenderer.js`](js/gridRenderer.js:1) Months view to use helpers (non-breaking).
3. Smoke test via the browser (`index.html`) and `tests/grid-renderer-smoke.html`.
4. Refactor Weeks-Age and Weeks-Calendar, then Years, verifying after each change.
5. Remove duplication from `js/gridRenderer.js` and update docs.

Performance & accessibility notes
- Use DocumentFragment in `renderRow` to avoid layout thrash.
- `makeBlockElement` sets `title` and stage/state classes; keep ARIA concerns at the UI layer (`js/ui.js`).
- Allow optional parameters to limit rendering ranges for performance profiling.

References
- Renderer implementations: [`js/gridRenderer.js`](js/gridRenderer.js:1)
- UI orchestration: [`js/ui.js`](js/ui.js:1)
- API sketch: [`docs/gridUtils-api.md`](docs/gridUtils-api.md:1)