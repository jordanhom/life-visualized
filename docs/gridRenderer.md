# Grid Renderer (`js/gridRenderer.js`)

Purpose
Provides the concrete DOM rendering implementations for the four visualization views:
- Weeks by Age (Age View)
- Weeks by Calendar (Calendar View)
- Months View
- Years (Decades) View

Location
- [`js/gridRenderer.js`](js/gridRenderer.js:1)

Public API
- renderAgeGrid(birthDateUTC, totalLifespanYearsEst, gridContentAreaElement)
- renderCalendarGrid(birthDateUTC, totalLifespanYearsEst, gridContentAreaElement)
- renderMonthsGrid(birthDateUTC, totalLifespanYearsEst, gridContentAreaElement)
- renderYearsGrid(birthDateUTC, totalLifespanYearsEst, gridContentAreaElement)

Key internal concepts
- LIFE_STAGES array and getLifeStageKey(age)
- UTC-normalized date handling; relies on global `dateFns` v4.x
- DocumentFragment usage for performance
- Week-generation logic for ISO weeks with handling for 52/53 week years and edge cases near birthdays

Inputs & Outputs
- Inputs: UTC-normalized birth date (Date), estimated lifespan (number, years), and target container element.
- Output: Appends rows of block elements to the provided container. Does not clear unrelated elements outside the container.

Behavioral details & edge cases
- Weeks-by-Age:
  - Generates weeks overlapping each age-year interval.
  - Filters weeks so their start is strictly before the next birthday; trims 54→53 weeks if encountered.
  - Titles include week start date and indication of current week.
- Weeks-by-Calendar:
  - Iterates ISO years between birth and estimated end.
  - Uses getISOWeeksInYear to render either 52 or 53 weeks per row.
  - Marks blocks outside lifespan as `out-of-bounds`.
- Months:
  - Renders up to ceil(totalYears * 12) month blocks grouped in 12-per-row.
  - Uses `startOfMonth` for month boundaries.
- Years:
  - Renders year blocks grouped per-decade (10 per row).
  - Year blocks represent the whole year starting at the birthday anniversary.

State classification
- Each block gets a `stage-{key}` class via `getLifeStageKey(age)`.
- Each block gets one of: `past`, `present`, `future`, or `out-of-bounds` on calendar view.

Refactor considerations
- LIFE_STAGES and getLifeStageKey should be extracted into `js/gridUtils.js` to be shared across renderers.
- Week/month/year generation logic contains duplication that would map to:
  - getWeeksForInterval
  - getWeeksForAgeYear
  - getMonthsForLifespan
  - getYearsForLifespan
- DOM creation for blocks is similar across views; use a factory `makeBlockElement` in `js/gridUtils.js`.

Testing guidance
- Create `tests/grid-renderer-smoke.html` that imports the module and calls each renderer with deterministic inputs.
- Validate block counts and titles to ensure no regressions during refactor.

Performance notes
- Already uses DocumentFragment; maintain this.
- For very long lifespans (>100 years), verify node count and consider virtualization or canvas if DOM becomes too heavy.

Accessibility & ARIA
- Renderers should not be responsible for top-level ARIA labels; UI module manages `#grid-content-area` roles and labels.
- Each row has `aria-label` set for screen reader context (`Age 0`, `Calendar Year 2023`, `Decade starting Age 30`).

References
- UI orchestration: [`js/ui.js`](js/ui.js:1)
- API sketch: [`docs/gridUtils-api.md`](docs/gridUtils-api.md:1)