# Current Context - Life Visualized

## Current Goal
Maintain a stable, high-signal test baseline with stronger branch coverage and minimal test noise.

## Current Task
Test-suite value review, duplicate/obsolete test cleanup, and docs/memory-bank synchronization.

## Recent Changes

- Expanded branch-focused test coverage across `ui`, `calculator`, and `gridRenderer` unit suites.
- Added deterministic tests for view-switching keyboard paths, renderer catch paths, fallback DOM branches, and calculator bracket-fallback edge cases.
- Removed low-value overlap from the suite:
  - `tests/unit/data-inspect.test.js` deleted (debug-only assertions duplicated by data integrity tests).
  - Duplicate `nonbinary` invalid-sex assertion removed from `calculator.test.js`.
- Local baseline validated:
  - `npm run verify` -> 67/67 tests passing
  - `npm run test:coverage` -> 96.32% statements, 78.84% branches, 100% functions, 97.8% lines

## Next Action
Commit branch with test cleanup + coverage updates and open PR.

## Decisions
- Adopted Node 20 as CI baseline due to `vitest@4` engine requirements.
- Added lint + typecheck gates in CI before tests.
- Typecheck gate currently uses TypeScript project validation without JS strict checking (`checkJs: false`) to keep signal actionable.
- Keep defensive-but-unreachable renderer warning branches as known residual coverage gaps rather than forcing brittle synthetic tests.

## Blockers
None.

## Relevant Files Recently Modified
- `.github/workflows/ci.yml`
- `package.json`
- `package-lock.json`
- `eslint.config.js`
- `tsconfig.json`
- `types/globals.d.ts`
- `tests/unit/ui.test.js`
- `tests/unit/ui.axis-aria.test.js`
- `tests/unit/main.test.js`
- `README.md`
- `docs/2026-03-25-changes.md`
- `.kilocode/rules/memory-bank/activeContext.md`
- `.kilocode/rules/memory-bank/progress.md`
- `.kilocode/rules/memory-bank/tests-plans-by-module.md`

## Open Questions/Decisions
- Should CI include coverage thresholds (`npm run test:coverage`) as an additional gate?
- Should the project adopt stricter type checking over time (e.g., gradual `checkJs` opt-in per file)?
- Should Dependabot auto-merge policy be enabled for low-risk devDependency patches?

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
