# Current Context - Life Visualized

## Current Goal
Keep all visualization and UI state behavior deterministic across browser timezones while maintaining a high-signal test baseline.

## Current Task
Complete issue #35 by making age and current-period behavior correct in the user's browser timezone.

## Recent Changes

- Added immediate birthdate validation and a local-calendar `max` of yesterday.
- Start Over now restores the complete initial state, including Weeks (Age) selection and ARIA state.
- Calendar view now computes ISO week years, week starts, and 52/53-week counts directly in UTC.
- Month view now computes month starts, titles, states, and stages directly from UTC components.
- Year view now computes birthday anniversaries, titles, and states directly from UTC components.
- Leap-day anniversaries use February 28 in non-leap years.
- Added shared native date-only helpers and removed runtime `date-fns`/`date-fns-tz` dependencies.
- Age and present-period state now follow local calendar boundaries.
- Added deterministic regressions under UTC, Los Angeles, London, Tokyo, and Auckland.
- Opened:
  - Issue #31 for a future Calendar/Birthday week-alignment toggle.
  - Issue #35 for broader worldwide timezone correctness.
- Issues #32, #33, and #34 are closed; issue #35 is implemented locally.

## Next Action
Finish verification and browser checks, then commit and merge the issue #35 branch.

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
- Treat birthdates as timezone-free calendar dates.
- Use browser-local year/month/day for “today,” age rollover, and present-period state.
- Encode local today and generated boundaries as UTC dates before arithmetic.
- Use native JavaScript date helpers with no runtime CDN dependency.
- Treat the native-helper choice as provisional; issue #40 owns investigation of maintained library integration.

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
- How should future country-specific actuarial data infer a default location while allowing explicit “what if” selection?
- Should named-timezone growth use bundled `date-fns`/`date-fns-tz`, browser ESM delivery, Temporal, or a staged combination? Track the decision in issue #40.

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
