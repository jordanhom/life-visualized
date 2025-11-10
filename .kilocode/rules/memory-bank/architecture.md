# System Architecture: Life Visualized

## 1. Overview

`life-visualized` is a client-side, single-page web application. It follows a modular architecture implemented in vanilla JavaScript using ES Modules.

* **Frontend Only:** All logic (calculation, rendering, UI management) runs in the user's browser. There is no backend component.
* **Modular JS:** Code is separated into distinct modules based on responsibility:
  * `main.js`: Application entry point, initializes UI.
  * `ui.js`: Controller/View-Model - Handles user interactions, manages UI state, orchestrates calls to other modules.
  * `calculator.js`: Model/Service - Performs core age and lifespan calculations.
  * `data.js`: Model/Data Source - Provides the static actuarial data.
  * `gridRenderer.js`: View/Rendering Engine - Generates the HTML for the different grid visualizations.
* **Single HTML (`index.html`):** Contains the static structure and placeholders for dynamic content.
* **Single CSS (`style.css`):** Defines all visual styles and layout rules, including responsiveness.

## 2. Key Technical Decisions & Patterns

* **Vanilla JavaScript (ES Modules):** Chosen for simplicity and performance, avoiding framework overhead for this specific application scope. Enables clear separation of concerns via modules.
* **UTC-Based Date Handling:**
  * **Decision:** All internal date storage and calculations are performed using UTC to ensure consistency and avoid timezone/DST errors.
  * **Pattern:** Input date string is normalized to a UTC midnight Date object in `ui.js`. This normalized object is stored and passed to `gridRenderer.js`, which uses `date-fns` functions configured for UTC.
* **UI State Management (`ui.js`):**
  * **Pattern:** Simple module-level variables (`currentView`, `lastCalcData`) are used to maintain the selected view and the results of the last calculation.
  * **Rationale:** Sufficient for the current application state; avoids the complexity of a dedicated state management library. Enables efficient view switching without recalculation.
* **Rendering Strategy (`gridRenderer.js`):**
  * **Pattern:** Direct DOM manipulation using `document.createElement` and leveraging `DocumentFragment` for efficient batch appends to minimize browser reflows. Renders into a specific inner container (`#grid-content-area`) to avoid clearing other nested elements. (UPDATED)
  * **Rationale:** Performant enough for the current grid sizes; avoids introducing rendering library dependencies. The inner container approach is necessary when other UI elements are nested within the main scrollable grid container. (UPDATED)
* **CSS Layout Strategy:**
  * **Pattern:** Fixed-width main grid container (`#life-grid-container`) based on Week view requirements, combined with dynamic block sizing (`calc()` + `aspect-ratio: 1 / 1`) for Month/Year views. The Results area (`#results-area`) shares the same `max-width` as the grid for visual alignment. The Grid Controls Header (`#grid-controls-header`) and Grid Guide Details (`#grid-guide-details`) are nested *inside* `#life-grid-container` and inherit its width constraints. (UPDATED)
  * **Rationale:** Provides visual consistency across views (no layout shifts) while allowing Month/Year blocks to fill the space effectively. Responsiveness is handled via tiered media queries adjusting container `max-width` and block sizes/gaps. The nested header uses Flexbox for internal layout and becomes columnar on smaller screens, while the nested guide uses Flexbox for a 2-column layout that stacks responsively. (UPDATED)
  * The results statistics are displayed in a 2-column grid (`.results-stats-grid`) with `grid-template-columns: auto auto` and `width: fit-content`, centered within its container. Body padding and main container `max-width` have been adjusted for better large-screen layout. (NEW)
  * Responsive CSS reduces vertical padding/margins in the results area and removes body top/bottom padding on small screens to optimize vertical space. (NEW)
* **Dependency Management:**
  * **Pattern:** `date-fns` library is loaded via CDN. `gridRenderer.js` includes a check (`checkDateFns`) for its presence.
  * **Rationale:** Simple integration for a key dependency.

## 3. Component Relationships & Data Flow - Updated for Nested Structure

* **Initialization:** `main.js` calls `ui.setupEventListeners()`.
* **Calculation Flow:**
    1. User submits form (`index.html`).
    2. `ui.js` (`handleCalculation`) validates input, normalizes date to UTC.
    3. `ui.js` resets visibility of post-calculation UI elements (results, main grid container). Explicitly hides nested header/guide as they also have `.hidden` initially. (UPDATED)
    4. `ui.js` displays loading indicators (button text, results area message). (NEW)
    5. `ui.js` calls `calculator.js` (`calculateCurrentAge`, `getRemainingExpectancy`).
    6. `calculator.js` reads data from `data.js`.
    7. `calculator.js` returns results (or throws error) to `ui.js`.
    8. **On Success:**
        * `ui.js` stores results in `lastCalcData`.
        * `ui.js` hides the input form. (NEW)
        * `ui.js` updates `#results-area` via `displayResults`.
        * `ui.js` calls `renderCurrentView()` (to render the grid).
        * `ui.js` reveals Results Area and the main Grid Container (`#life-grid-container`). Explicitly reveals the nested Grid Controls Header (`#grid-controls-header`) and Grid Guide Details (`#grid-guide-details`). (UPDATED)
        * `ui.js` reveals the "Start Over" button (placed after the grid container). (NEW)
    9. **On Error:**
        * `ui.js` updates `#results-area` via `displayError`.
        * `ui.js` reveals Results Area.
        * `ui.js` calls `renderCurrentView()` (to clear grid content area). (UPDATED)
        * `ui.js` ensures the input form remains visible. (NEW)
        * Main grid container and its contents remain hidden.
* **Rendering Flow:**
    1. `ui.js` (`renderCurrentView`) determines the view type (`currentView`).
    2. `ui.js` calls the appropriate function in `gridRenderer.js` (e.g., `renderMonthsGrid`), passing `lastCalcData` and the specific `#grid-content-area` element. (UPDATED)
    3. `gridRenderer.js` function clears the *provided element's* (`#grid-content-area`) content. (UPDATED)
    4. `gridRenderer.js` performs UTC date calculations using `date-fns`.
    5. `gridRenderer.js` generates DOM elements (rows, blocks) with correct classes/attributes.
    6. `gridRenderer.js` appends elements to the *provided element* (`#grid-content-area`). (UPDATED)
    7. `gridRenderer.js` sets the `aria-label` on the *parent* (`#life-grid-container`) for overall context. (UPDATED)
* **View Switch Flow:**
    1. User clicks a button in `#view-switcher` (`index.html`).
    2. `ui.js` (`handleViewChange`) updates `currentView` state, updates button active/ARIA states.
    3. `ui.js` calls `renderCurrentView()`.
    4. Rendering flow proceeds using the *existing* `lastCalcData`, targeting `#grid-content-area`. (UPDATED)

## 4. Critical Implementation Details

* **`gridRenderer.js` - Age View Week Logic:** Uses `eachWeekOfInterval` + `filter(isBefore)` + `.pop()` (if length 54) to accurately determine the ISO weeks starting within each year of life, ensuring visual consistency (max 53 weeks/row).
* **`gridRenderer.js` - Calendar View:** Uses `getISOWeeksInYear` and correctly handles the 52/53 week variation. Applies `out-of-bounds` styling based on comparison with `firstWeekStartDateUTC` and `estimatedEndDateUTC`.
* **CSS `calc()` + `aspect-ratio`:** The core mechanism for ensuring Month/Year blocks fill the fixed container width while remaining square. Formulas must be updated in media queries if gaps change.
* **`js/ui.js` - `handleViewChange()`:** Logic handles clicks on `.view-button` elements, reads `data-view`, manages `.active` class and `aria-checked` attributes.
* **`index.html` - `#grid-content-area`:** A dedicated `div` within `#life-grid-container` that serves as the specific target for grid rendering, preventing clearing of other nested elements like the header and guide. (NEW)
* **CSS - `position: sticky`:** Applied to `#grid-controls-header` to keep it visible at the top of the scrollable `#life-grid-container`. (NEW)
* **CSS - `.view-button` Styling:** Uses `white-space: normal` to allow wrapping and `min-height` to ensure consistent vertical size for all buttons, combined with `display: inline-flex` and `align-items: center` for vertical text centering. (NEW)
* **CSS - Responsive Centering:** `align-items: center` is used on `#grid-controls-header` within the columnar media query to maintain horizontal centering of the button group. (NEW)

## 5. UI/Interaction Patterns - Updated for Refinements

* **Progressive Reveal:** Initially hide non-essential UI elements (results, main grid container) using a `.hidden` class. Reveal these elements via JavaScript (`ui.js`) upon successful calculation completion. This provides a cleaner initial view focused on the input form. The results area is always revealed on calculation attempt to show success or error messages. (UPDATED)
  * **Post-Calculation Flow:** On success, the input form is hidden. The results (including input parameters, displayed in a centered grid) are shown, followed by the grid container (with its controls and guide), and then a "Start Over" button (placed after the grid container). (NEW)
* **Integrated & Nested Controls Header:** (UPDATED) A dedicated header bar (`#grid-controls-header`) is placed directly *inside* the grid container (`#life-grid-container`). It contains the view switcher (`#view-switcher`), implemented as styled `<button>` elements (`.view-button`) acting as a segmented control (`role="radiogroup"`). The active button indicates the current view, and tooltips (`title` attribute) on each button provide view descriptions on hover/focus. This pattern tightly couples the view controls with the grid and removes the need for a separate dynamic title element. (UPDATED)
* **Sticky Controls Header:** (NEW) The nested header bar uses `position: sticky` to remain visible at the top of the `#life-grid-container` when the grid content area below it is scrolled, improving accessibility of controls for long grids.
* **Consolidated & Collapsible Guide/Key:** The grid explanation and color key are combined into a single `<details id="grid-guide-details">` element. This element is now placed *inside* the `#life-grid-container`, below the controls header and above the grid content area. It remains collapsible and uses a 2-column layout (stacking responsively) for its content. **The explanation text within has been refined for conciseness and clarity.** This places the explanation in close proximity to the visualization it describes. (UPDATED)
* **No Section Headings:** Explicit `<h2>` headings for "Results" and "Visualization" were removed as the content flow makes their purpose clear, reducing visual noise.
* **Constrained Width Alignment:** The main grid container and the results area share the same `max-width` and are centered within the main container, creating a visually cohesive block post-calculation. (UPDATED)
  * The overall page `.container` `max-width` has been reduced, and `body` padding adjusted for better large-screen aesthetics. (NEW)
* **Dynamic Button State:** The "Calculate & Visualize" button is disabled until both birth date and sex inputs are valid. (NEW)
* **Loading Indicators:** The "Calculate & Visualize" button text changes to "Calculating..." and the results area displays a loading message during processing. (NEW)
* **"Start Over" Functionality:** A dedicated button allows users to reset the application to its initial input state. (NEW)
* **Responsive Results Area:** Vertical padding and margins within the results area are reduced on smaller screens to conserve space. (NEW)

## 6. Development History and UX Refinements

The application went through a comprehensive UX review process that identified critical refinements needed for the MVP launch. Key areas addressed included:
1. Initial state and engagement improvements
2. Input simplicity and friction reduction
3. Calculation feedback and loading states
4. Progressive reveal hierarchy and interaction flow
5. Sticky header and view switching usability
6. Grid visualization clarity and accessibility
7. Layout and responsiveness across screen sizes
8. Emotional tone and sensitivity in UI language

The application went through multiple iterations of UX refinement, focusing on clarity, simplicity, and user engagement while maintaining technical robustness.
