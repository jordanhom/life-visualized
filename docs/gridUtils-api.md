# Grid Utilities API Sketch

Purpose
Provide a small, focused utilities module to centralize common grid logic currently duplicated in [`js/gridRenderer.js`](js/gridRenderer.js:1). Make renderers simpler, testable, and easier to refactor incrementally.

Goals
- Extract pure date and block-generation helpers.
- Provide a small block element factory that preserves existing CSS/class conventions.
- Reuse native UTC date-only helpers from `js/dateUtils.js`.
- Maintain ARIA/title metadata and DocumentFragment-friendly rendering.

Design Principles
- Pure helpers (no DOM side-effects) where possible.
- Small, composable functions with clear inputs/outputs.
- Backwards-compatible adapter layer to allow incremental refactor.

Public API (proposed)
## Functions
- getISOWeekStart(isoYear, weekNum) -> Date
  - Return start-of-ISO-week (UTC) for given ISO year/week.

- getWeeksForInterval(startUTC, endUTC, {weekStartsOn:1}) -> Date[]
  - Return array of week-start Dates overlapping [startUTC, endUTC).
  - Option to enforce ISO (weekStartsOn).

- getWeeksForAgeYear(birthDateUTC, age, opts) -> Date[]
  - Convenience over getWeeksForInterval for age-row logic (handles birthday boundaries).

- getMonthsForLifespan(birthDateUTC, totalYears) -> {start:Date, age:number, monthIndex:number}[]
  - Returns exactly `ceil(totalYears * 12)` UTC month-start records.

- getYearsForLifespan(birthDateUTC, totalYears) -> {start:Date, age:number}[]
  - Returns exactly `ceil(totalYears)` UTC birthday-anniversary records.
  - Clamps February 29 to February 28 in non-leap years.

- classifyBlockByDate(blockStartUTC, birthDateUTC, estimatedEndUTC) -> { stageKey:string, state: 'past'|'present'|'future'|'out-of-bounds' }
  - Encapsulates life-stage determination (`getLifeStageKey`) and state (compare to now / estimated end).
  - Preserves same stage keys used by CSS (stage-infancy ...).

- makeBlockElement({ type, startDateUTC, age, stageKey, state, title, extraAttrs }) -> HTMLElement
  - Create a DOM element (div) with appropriate classes (week-block / month-block / year-block), title, and stage/state classes.
  - Does not append; caller uses renderRow to insert.

- renderRow(containerElement, blockElements[], {rowLabel?, rowAttrs?}) -> void
  - Appends blocks into container using DocumentFragment.
  - Optionally sets aria-labels on the row wrapper.

- createRendererAdapter(viewType, gridContentArea, opts) -> { render(lastCalcData) }
  - Optional adapter to bridge existing renderers in [`js/gridRenderer.js`](js/gridRenderer.js:1) to new helpers for incremental migration.

Types
- Block
  - { type: 'week'|'month'|'year', startDateUTC:Date, age:number, stageKey:string, state:string, title?:string }
- ViewType: 'weeks-age' | 'weeks-calendar' | 'months' | 'years'

Example: Months view (conceptual)
1. const months = getMonthsForLifespan(birthDateUTC, totalYears);
2. const blocks = months.map(m => {
     const { stageKey, state } = classifyBlockByDate(m.start, birthDateUTC, estimatedEndUTC);
     return makeBlockElement({ type:'month', startDateUTC: m.start, age: m.age, stageKey, state, title: `Age ${m.age}, Month ${m.monthIndex}` });
   });
3. renderRow(gridContentAreaForYear, blocks, { rowLabel: `Age ${yearNum}` });

Migration plan (incremental)
1. Add [`js/gridUtils.js`](js/gridUtils.js:1) with the pure helpers and small DOM factories plus a test harness (`tests/gridUtils.test.html`).
2. Extract the existing native UTC Month/Year generation in [`js/gridRenderer.js`](js/gridRenderer.js:1) into helpers and factories without changing behavior.
3. Smoke test visually and via console logs; fix any mismatch in class names/titles.
4. Refactor Weeks-Age and Weeks-Calendar similarly, keeping each change isolated and reviewed.
5. Remove duplicated logic and update [`js/ui.js`](js/ui.js:1) docs/architecture.

Performance & Accessibility notes
- Keep using DocumentFragment in renderRow to avoid layout thrash.
- makeBlockElement should set title attributes and preserve `role`/`aria-*` as needed.
- Keep local-calendar versus UTC-encoded boundary semantics explicit.
- Preserve existing CSS class names (stage-{key}, present/past/future/out-of-bounds) to avoid large stylesheet changes.

Next actions
- Implement [`js/gridUtils.js`](js/gridUtils.js:1) based on this sketch (I can start when you approve).
- Extract Months and Years first because their native UTC behavior is already covered, then proceed view-by-view.

References
- Current renderer: [`js/gridRenderer.js`](js/gridRenderer.js:1)
- UI orchestration: [`js/ui.js`](js/ui.js:1)
- Existing life-stage definitions live in [`js/gridRenderer.js`](js/gridRenderer.js:1) and should be reused or moved into the utils module.
