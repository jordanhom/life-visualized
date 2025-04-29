**Objective:** Implement UX enhancements for the 'Duration Visualizer' web application based on the recommendations from the provided UX review (by Dr. Evelyn Reed). The goal is to improve usability, accessibility, clarity, emotional resonance, and overall user experience **by refining the existing implementation on the `mvp` branch.**

**Context:**
*   You are working on the 'Duration Visualizer' web application (project: `life-visualized`, branch: `mvp`).
*   Recent commits indicate features like progressive reveal, view controls, a collapsible guide (combined explanation/key), and a sticky header *nested within the grid container* already exist. A specific `#grid-content-area` is used for rendering.
*   Apply the following changes based on the detailed UX review recommendations, **modifying and enhancing the existing code structure** where applicable. Assume standard web technologies (HTML, CSS, JavaScript).
*   Refer to existing element IDs and classes where possible. Key known elements/structures: `#life-input-form`, `#birthdate`, `#sex`, `#calculate-btn`, `#results-area`, `#life-grid-container` (aliased as `gridContainer` in JS), `#grid-controls-header`, `#view-switcher`, `#grid-guide-details`, `#grid-content-area`.

**Implementation Tasks:**

**1. Initial State & Engagement:**
    *   **Visual Intrigue:** In `index.html`, integrate a subtle, appropriate micro-illustration or symbolic SVG icon near the main application title (`<h1>`).
    *   **Expanded Intro Text:** In `index.html`, locate the current `<p class="intro-text">` and replace its content with a more descriptive 2-3 line paragraph, including the reassurance line. Use the example text: *“Visualize your estimated journey mapped out. This tool transforms abstract durations into a tangible grid, offering a unique perspective for reflection on time elapsed and remaining. <br><em>This visualization is based on statistical averages and is intended to offer perspective for reflection, not to predict the future with certainty.</em>”*
    *   **Input Guidance:** In `index.html`, add `placeholder` attributes to the existing `#birthdate` input and `#sex` select element (e.g., "YYYY-MM-DD", "Select...").

**2. Input Simplicity & Friction Reduction:**
    *   **Date Input:** In `index.html`, verify the `#birthdate` input is `type="date"`. Ensure appropriate styling in `style.css` if needed. (No masking or library needed if `type="date"` is used).
    *   **Clear Labels:** In `index.html`, ensure the `<label>` elements for `#birthdate` and `#sex` use the `for` attribute correctly. Update label text if needed (e.g., "Start Date", "Duration Basis").
    *   **Helper Text:** In `index.html`, add small, muted `<p class="helper-text">` tags below each form group (`#birthdate`, `#sex`) containing the contextual helper text (e.g., *"Enter the date that anchors the visualization."*, *"Select the statistical basis for the duration estimate."*). Add corresponding styles for `.helper-text` in `style.css`.
    *   **Button State Logic:** In `ui.js`:
        *   Ensure `#calculate-btn` is `disabled` by default in `index.html`.
        *   Implement/verify `input` event listeners on `#birthdate` and `#sex` to enable `#calculate-btn` *only* when both have valid values.
        *   In `index.html`, add a `title` attribute to the disabled `#calculate-btn` (e.g., "Please fill in both fields.").

**3. Calculation Feedback & Loading State:**
    *   **Button Feedback:** In `ui.js`, enhance the `handleCalculation` function (or button click handler):
        *   On click, immediately set `#calculate-btn.disabled = true`.
        *   Update `#calculate-btn.innerHTML` to include text (e.g., "Calculating...") and integrate a loading spinner icon (add a `<span>` with CSS class for the spinner). Add spinner CSS to `style.css`.
        *   Set `aria-busy="true"` on `#calculate-btn`.
    *   **Area Feedback:** In `ui.js` (`handleCalculation`), implement a loading indicator (e.g., add a `<div>` with class `loader` inside `#results-area`). Add CSS for `.loader` in `style.css`. Set `aria-busy="true"` on `#results-area`.
    *   **Accessibility Announcements:** In `index.html`, ensure `#results-area` has `aria-live="polite"`. In `ui.js`, ensure `aria-busy="false"` is set on `#calculate-btn` and `#results-area` when loading completes (success or error). Create and call a `resetCalculateButton` helper function.

**4. Progressive Reveal Hierarchy & Interaction:**
    *   **Smooth Transitions:** In `style.css`, modify the `.hidden` class and styles for `#results-area` and `#life-grid-container` to use `opacity`, `visibility`, `max-height`, and `transition` properties for smooth fade/slide effects instead of `display: none`.
    *   **Focus Management:** In `ui.js` (`handleCalculation`), after successful calculation and reveal, implement JavaScript to programmatically move focus to the revealed `#results-area` (e.g., its first `<p>`). Make the target element focusable (`tabindex="-1"`) and use `element.focus({ preventScroll: true })`.
    *   **Scroll Hint (Optional):** In `index.html`, add a hidden `<div id="scroll-hint">`. In `ui.js`, show this hint after successful calculation if the grid container might be below the fold, and add a scroll listener to hide it once the user scrolls. Style `.scroll-hint` in `style.css`.

**5. Sticky Header & View Switching Usability:**
    *   **Sticky Implementation:** In `style.css`, verify/refine the styles for `#grid-controls-header` using `position: sticky; top: 0;` and ensure it has an appropriate `z-index` and works correctly within its parent (`#life-grid-container`).
    *   **Visual Distinction:** In `style.css`, apply/adjust `background-color` (potentially semi-transparent), `backdrop-filter`, `border-bottom`, or `box-shadow` to `#grid-controls-header` for clear visual separation when sticky.
    *   **Control Implementation (Tablist Pattern):**
        *   In `index.html`, refactor `#view-switcher` to have `role="tablist"` and its child buttons (`.view-button`) to have `role="tab"`. Remove `role="radiogroup"` and `aria-checked`.
        *   In `ui.js` (`handleViewChange` and initialization), implement dynamic setting of `aria-selected="true/false"` on the buttons.
        *   In `style.css`, ensure `.view-button.active` styling clearly indicates the selected state.
    *   **Keyboard Navigation:** In `ui.js`, add a `keydown` event listener to `#view-switcher` (the tablist container). Implement logic for Left/Right arrow keys to move focus between tabs (updating `tabindex` so only the active/focused tab is `0`, others are `-1`). Ensure Enter/Space activate the focused tab (should work by default for buttons).
    *   **Responsiveness:** In `style.css`, use `@media` queries to adjust `#grid-controls-header`. If buttons overflow, apply `overflow-x: auto;` to the button container (`#view-switcher`) and potentially hide the scrollbar visually. Ensure header height remains reasonable.

**6. Grid Visualization & Block State Clarity:**
    *   **Accessible States:**
        *   In `index.html`, add an SVG `<defs>` section for patterns (e.g., `<pattern id="pattern-diagonal-lines">...`).
        *   In `gridRenderer.js` (within the block creation loops), modify the logic that adds `.past` class. In addition to the class, set a `fill` attribute on the block element (e.g., `blockElement.setAttribute('fill', 'url(#pattern-diagonal-lines)')`).
        *   In `style.css`, ensure the `.past` class styles work correctly with the `fill` attribute (it might override `background-color` for SVGs, adjust accordingly or apply pattern via CSS `mask` if using divs).
    *   **Tooltips:** In `gridRenderer.js`, ensure the `title` attribute is set on each block. For better accessibility, consider implementing a custom tooltip component triggered on hover/focus that uses `aria-describedby`. (If sticking with `title`, verify it works adequately with screen readers).
    *   **Grid Accessibility:** In `index.html`, add `role="grid"` to `#grid-content-area`. In `gridRenderer.js`, add `role="row"` to row elements and `role="gridcell"` to block elements. Add `aria-label` to blocks, mirroring the `title` content.

**7. Color Coding & Accessibility:**
    *   **Contrast Check:** Audit colors defined in `:root` and applied in `style.css`. Use a contrast checker tool to ensure all text/foreground/background combinations meet WCAG 2.1 AA. Adjust `--color-*` variables if needed.
    *   **Color Blindness Support:** Implement the patterns/textures from #6. In `index.html`, add a placeholder `<button id="colorblind-toggle">`. In `ui.js`, add a click listener to toggle a class (e.g., `colorblind-mode`) on the `<body>`. In `style.css`, add `.colorblind-mode` rules to adjust palettes/emphasize patterns.
    *   **Guide Legend:** In `index.html`, update the color key list within `#grid-guide-details`. Add list items for states (Past, Present, Future, Out-of-Bounds) and ensure swatches show both color *and* pattern (e.g., using a nested element with the pattern fill).

**8. View B Alignment Clarity (Guide Update):**
    *   **Update Guide Content:** In `index.html`, locate the "Understanding the Grid" text within `#grid-guide-details`. Add the explicit explanation for View B's calendar alignment.
    *   **Add Visual Aid:** Embed a small schematic diagram/image (`<img>` or inline SVG) within the guide's explanation column illustrating the View B alignment concept. Add `alt` text.
    *   **Add Wording:** Include the suggested sentence: *"View B aligns blocks to standard calendar periods..."*

**9. Guide Discoverability vs. Clutter:**
    *   **Verify Default State:** In `index.html`, ensure `#grid-guide-details` (likely a `<details>` element) is collapsed by default. Verify the `<summary>` text is "How to Read This Visualization".
    *   **Implement Discoverability Hints:**
        *   In `ui.js`, add logic using `sessionStorage` to add a temporary class (e.g., `hint-new`) to the `<summary>` element on the user's first visit per session. Add CSS for `.hint-new` (e.g., a small badge/animation) in `style.css`.
        *   In `index.html`, add a `title` attribute to the `<summary>` element (e.g., *"Click to learn how to interpret the visualization"*).
    *   **Internal Structure (Optional):** If the guide content within `#grid-guide-details` becomes long, consider refactoring it using internal tabs or nested `<details>` elements for better scannability.

**10. Guide Text Brevity vs. Clarity:**
    *   **Review & Expand Guide Text:** Review all text within `#grid-guide-details` in `index.html`. Expand explanations where needed for clarity (esp. View B, unit meanings), prioritizing understanding over extreme brevity.
    *   **Layered Information (Optional):** Implement "Learn more" inline links (`<a>` tags styled as links) within the guide text that trigger modals/popovers (requires additional JS/CSS) or expand hidden subsections (using nested `<details>` or JS).

**11. Layout: Fixed Width vs. Fluidity:**
    *   **Responsive Container:** In `style.css`, verify/adjust the main `.container` styles to use `width: 95%; max-width: 1200px; margin: 0 auto;` (adjust values as appropriate). Ensure `#life-grid-container` also respects this or has its own appropriate `max-width`.
    *   **Wide Screen Aesthetics:** In `style.css`, add subtle background styling (e.g., gradient, pattern) to the `body` or a wrapper element for better visual appeal on ultra-wide screens.
    *   **Grid Responsiveness:** Verify the CSS rules for `.grid-view-months .month-block` and `.grid-view-years .year-block` correctly use `calc()` and `aspect-ratio` to fill the container width. Ensure the responsive media queries adjust block sizes/gaps appropriately for all views.

**12. Accessibility Enhancements (General Audit):**
    *   **Keyboard Navigation Audit:** Perform a full keyboard navigation test (Tab, Shift+Tab, Enter, Space, Arrow Keys). Ensure all interactive elements (`input`, `select`, `button`, `details>summary`, links) are reachable and operable in a logical order.
    *   **Focus Indicator Audit:** Check focus styles in `style.css`. Ensure `:focus-visible` styles provide clear, high-contrast outlines for all focusable elements. Add a general `:focus-visible` rule if missing.
    *   **ARIA & Semantics Audit:** Review `index.html` and JS-generated elements. Correct/add ARIA roles (`tablist`, `tab`, `grid`, `row`, `gridcell`, `alert`), states (`aria-selected`, `aria-busy`, `aria-expanded`), and properties (`aria-live`, `aria-controls`, `aria-label`, `aria-describedby`) as needed per the review.
    *   **Zoom & Reflow Test:** Test zooming the page up to 400%. Ensure text reflows without requiring horizontal scrolling (WCAG 2.1 Reflow).

**13. Emotional Tone & Sensitivity:**
    *   **Language Review:** Audit all user-facing text in `index.html` and any dynamically generated text in `ui.js` or `gridRenderer.js` (e.g., tooltips). Replace potentially alarming phrases with neutral alternatives ("elapsed", "remaining", "current phase", "estimated duration").
    *   **Framing & Disclaimer:** Ensure the disclaimer in `index.html` is prominent and uses appropriate language. Add the reassurance text (as done in Task 1) near the intro or results.
    *   **Aesthetics Review:** Briefly assess if the current minimalist styling in `style.css` feels supportive/calm. Consider minor tweaks to `--color-*` variables or spacing if needed.

**Cross-Cutting Concerns:**
    *   **Design Consistency:** Maintain consistency with existing styles in `style.css`.
    *   **Performance:** Be mindful of performance impacts of new JS logic or complex CSS.
    *   **Testing:** Test thoroughly across browsers and devices.

Please proceed with implementing these enhancements on the `mvp` branch. Let me know if any recommendation requires further clarification based on the current codebase.
