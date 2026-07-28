# Current Context - Life Visualized

## Current Goal
Keep all visualization and UI state behavior deterministic across browser timezones while maintaining a high-signal test baseline.

## Current Task
Fix issues #33 and #34 by making Month and Year rendering independent of browser timezone.

## Recent Changes

- Added immediate birthdate validation and a local-calendar `max` of yesterday.
- Start Over now restores the complete initial state, including Weeks (Age) selection and ARIA state.
- Calendar view now computes ISO week years, week starts, and 52/53-week counts directly in UTC.
- Month view now computes month starts, titles, states, and stages directly from UTC components.
- Year view now computes birthday anniversaries, titles, and states directly from UTC components.
- Leap-day anniversaries use February 28 in non-leap years.
- Added deterministic regressions that run Month/Year rendering under UTC, Los Angeles, London, Tokyo, and Auckland settings without local-time `dateFns` helpers.
- Opened:
  - Issue #31 for a future Calendar/Birthday week-alignment toggle.
  - Issue #35 for broader worldwide timezone correctness.
- Issue #32 is closed; issues #33 and #34 are fixed locally pending merge.
- Local baseline validated:
  - `conda run -n base npm run verify` -> 69/69 tests passing
  - `conda run -n base npm run test:coverage` -> 95.81% statements, 82.62% branches, 100% functions, 97.36% lines

## Next Action
Commit the Month/Year fixes and documentation updates, then merge and close issues #33 and #34.

## Decisions
- Adopted Node 20 as CI baseline due to `vitest@4` engine requirements.
- Added lint + typecheck gates in CI before tests.
- Typecheck gate currently uses TypeScript project validation without JS strict checking (`checkJs: false`) to keep signal actionable.
- Keep defensive-but-unreachable renderer warning branches as known residual coverage gaps rather than forcing brittle synthetic tests.
- Use the browser's local calendar date for user-facing birthdate validity, while normalizing accepted date-only values to UTC.
- Keep Calendar weeks as the default alignment; track Birthday-aligned weeks separately in issue #31.
- Compute Calendar ISO boundaries with native UTC helpers instead of local-time `date-fns` functions.
- Compute Month boundaries and Year birthday anniversaries with native UTC helpers.
- Treat February 28 as the non-leap-year anniversary for February 29 births.

## Blockers
None.

## Relevant Files Recently Modified
- `js/ui.js`
- `js/gridRenderer.js`
- `tests/unit/ui.test.js`
- `tests/unit/gridRenderer.calendar.test.js`
- `tests/unit/gridRenderer.months.test.js`
- `tests/unit/gridRenderer.years.test.js`
- `tests/unit/gridRenderer.failure.test.js`
- `README.md`
- `docs/ui.md`
- `docs/gridRenderer.md`
- `docs/2026-07-27-changes.md`
- `docs/2026-07-28-changes.md`
- `.kilocode/rules/memory-bank/activeContext.md`
- `.kilocode/rules/memory-bank/architecture.md`
- `.kilocode/rules/memory-bank/progress.md`
- `.kilocode/rules/memory-bank/tech.md`
- `.kilocode/rules/memory-bank/tests-plans-by-module.md`

## Open Questions/Decisions
- Should CI include coverage thresholds (`npm run test:coverage`) as an additional gate?
- Should the project adopt stricter type checking over time (e.g., gradual `checkJs` opt-in per file)?
- Should the optional `date-fns-tz` CDN integration be repaired, upgraded, or removed in favor of native UTC helpers?
- How should issue #35 reconcile local-calendar current-period behavior with deterministic UTC-generated boundaries?

## Learnings & Insights

- Content & Textual Clarity: Iterative refinement of all user-facing text (intro, helper text, disclaimers, labels, guides) for conciseness, user understanding, and appropriate tone is crucial. Precise labeling, clear input placeholders, and subtle visual cues (icons, typography, whitespace) significantly enhance usability, transparency, and engagement.
- Layout, Styling & Visual Consistency:
  - Strategic use of wrapper containers for related content allows precise control over layout and spacing.
  - Techniques like `width: fit-content` with `margin: auto` effectively center intrinsically sized elements.
  - Standardizing `max-width` across content sections and adjusting body/container padding are key for visual harmony. On smaller screens, unifying `max-width` for key blocks improves column appearance.
  - Presenting summary statistics in a grid format enhances readability.
  - Centralizing component styles in CSS (vs. inline) improves maintainability.
- Responsive Design & View-Specific Adjustments:
  - Achieving consistent alignment across different views and responsive breakpoints requires careful calculation of container `max-widths` and element dimensions.
  - `position: sticky` is effective for keeping controls visible within scrollable containers.
  - Consistent height for wrapping flex items often requires `min-height` and flex alignment properties.
- Accessibility & Keyboard Navigation:
  - Implementing ARIA patterns (e.g., `tablist`) and programmatic focus management significantly improves keyboard navigation and accessibility.
  - Applying clear focus styles, potentially to parent containers when a child is focused, enhances focus visibility.
  - For standard ARIA roles, dynamic `aria-label`s are often more effective than `aria-roledescription`.
- Development Process & Code Quality:
  - A dedicated inner container for dynamic content is essential when static elements are nested within the same parent to prevent accidental removal on `innerHTML` updates.
  - Regular review, cleanup, and thoughtful retention of historical code comments contribute to long-term maintainability.
  - Clear axis labels can significantly improve understanding of grid-based data, potentially reducing reliance on complex guide diagrams.
  - Hiding input forms post-calculation and providing a "Start Over" button streamlines UX.
<!-- Source: [`memory-bank/activeContext.md`](memory-bank/activeContext.md:25) — transferred 2025-11-10 -->
<!-- Note: Preserved provenance entries from the deprecated Cline memory bank (absolute file paths referencing /Users/jhom/src/vibecode/...). -->
