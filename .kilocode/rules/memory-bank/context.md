# Current Context - Life Visualized

## Current Goal
Keep all visualization and UI state behavior deterministic across browser timezones while maintaining a high-signal test baseline.

## Current Task
Document and prepare the audited behavior refinements for commit and review.

## Recent Changes

- Added immediate birthdate validation and a local-calendar `max` of yesterday.
- Start Over now restores the complete initial state, including Weeks (Age) selection and ARIA state.
- Calendar view now computes ISO week years, week starts, and 52/53-week counts directly in UTC.
- Added deterministic regression tests for known ISO boundaries and fractional lifespan endpoints.
- Opened:
  - Issue #31 for a future Calendar/Birthday week-alignment toggle.
  - Issue #32 for the Calendar timezone bug fixed by the current changes.
- Local baseline validated:
  - `npm run verify` -> 69/69 tests passing
  - `npm run test:coverage` -> 96.17% statements, 81.97% branches, 100% functions, 97.74% lines

## Next Action
Commit the behavior fixes and documentation updates, then merge and close issue #32.

## Decisions
- Adopted Node 20 as CI baseline due to `vitest@4` engine requirements.
- Added lint + typecheck gates in CI before tests.
- Typecheck gate currently uses TypeScript project validation without JS strict checking (`checkJs: false`) to keep signal actionable.
- Keep defensive-but-unreachable renderer warning branches as known residual coverage gaps rather than forcing brittle synthetic tests.
- Use the browser's local calendar date for user-facing birthdate validity, while normalizing accepted date-only values to UTC.
- Keep Calendar weeks as the default alignment; track Birthday-aligned weeks separately in issue #31.
- Compute Calendar ISO boundaries with native UTC helpers instead of local-time `date-fns` functions.

## Blockers
None.

## Relevant Files Recently Modified
- `js/ui.js`
- `js/gridRenderer.js`
- `tests/unit/ui.test.js`
- `tests/unit/gridRenderer.calendar.test.js`
- `README.md`
- `docs/ui.md`
- `docs/gridRenderer.md`
- `docs/2026-07-27-changes.md`
- `.kilocode/rules/memory-bank/activeContext.md`
- `.kilocode/rules/memory-bank/architecture.md`
- `.kilocode/rules/memory-bank/progress.md`
- `.kilocode/rules/memory-bank/tech.md`
- `.kilocode/rules/memory-bank/tests-plans-by-module.md`

## Open Questions/Decisions
- Should CI include coverage thresholds (`npm run test:coverage`) as an additional gate?
- Should the project adopt stricter type checking over time (e.g., gradual `checkJs` opt-in per file)?
- Should the optional `date-fns-tz` CDN integration be repaired, upgraded, or removed in favor of native UTC helpers?
- How should Month and Year views be migrated away from local-time `date-fns` arithmetic?

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
