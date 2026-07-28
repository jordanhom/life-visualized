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
- UTC-normalized date-only handling through shared native helpers in `js/dateUtils.js`
- UTC month/year arithmetic and formatting through `addMonthsUTC`, `addYearsUTC`, `startOfMonthUTC`, and `formatUTCDate`
- Calendar helpers `startOfISOWeekUTC`, `getISOWeekYearUTC`, `getISOWeekStartUTC`, and `getISOWeeksInYearUTC`
- DocumentFragment usage for performance
- Week-generation logic for ISO weeks with handling for 52/53 week years and edge cases near birthdays

Inputs & Outputs
- Inputs: UTC-normalized birth date (Date), estimated lifespan (number, years), and target container element.
- Output: Appends rows of block elements to the provided container. Does not clear unrelated elements outside the container.

Behavioral details & edge cases
- Weeks-by-Age:
  - Generates weeks overlapping each age-year interval.
  - Filters weeks so their start is strictly before the next birthday; trims 54→53 weeks if encountered.
  - Uses native UTC ISO-week generation with no external runtime library.
  - Titles include week start date and indication of current week.
- Weeks-by-Calendar:
  - Iterates ISO years between birth and estimated end.
  - Calculates ISO week-year boundaries directly from UTC date components to render exactly 52 or 53 unique weeks per row, independent of the browser timezone.
  - Preserves fractional lifespan estimates through UTC month arithmetic and formats `Starts UTC` titles from UTC components.
  - Marks blocks outside lifespan as `out-of-bounds`.
- Months:
  - Renders exactly ceil(totalYears * 12) month blocks grouped in 12-per-row.
  - Calculates month starts, current-month state, life stages, and `Starts UTC` titles from UTC date components without local-time `date-fns` operations.
- Years:
  - Renders exactly ceil(totalYears) year blocks grouped per-decade (10 per row).
  - Year blocks represent birthday-anniversary intervals calculated in UTC.
  - Leap-day anniversaries use February 28 in non-leap years and return to February 29 in leap years.
  - Past/present/future state and `Starts UTC` titles use the corrected UTC anniversary sequence.

State classification
- Each block gets a `stage-{key}` class via `getLifeStageKey(age)`.
- Each block gets one of: `past`, `present`, `future`, or `out-of-bounds` on calendar view.
- The present week, month, or age-year is selected from the user's local calendar date, then compared against UTC-encoded boundaries.

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
- Validate known 52/53-week ISO years, unique block titles, UTC Monday starts, Month/Year boundaries, leap-day anniversaries, and fractional lifespan counts.
- Ensure current-period tests cover local midnight and UTC rollover under representative browser timezone settings.

Performance notes
- Already uses DocumentFragment; maintain this.
- For very long lifespans (>100 years), verify node count and consider virtualization or canvas if DOM becomes too heavy.

Accessibility & ARIA
- Renderers should not be responsible for top-level ARIA labels; UI module manages `#grid-content-area` roles and labels.
- Each row has `aria-label` set for screen reader context (`Age 0`, `Calendar Year 2023`, `Decade starting Age 30`).

References
- UI orchestration: [`js/ui.js`](js/ui.js:1)
- Date model and dependency decision: [`docs/dateUtils.md`](docs/dateUtils.md:1)
- API sketch: [`docs/gridUtils-api.md`](docs/gridUtils-api.md:1)
