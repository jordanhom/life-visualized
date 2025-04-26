# System Patterns: Life Visualized

## 1. Architecture Overview

`life-visualized` is a client-side, single-page web application. It follows a modular architecture implemented in vanilla JavaScript using ES Modules.

*   **Frontend Only:** All logic (calculation, rendering, UI management) runs in the user's browser. There is no backend component.
*   **Modular JS:** Code is separated into distinct modules based on responsibility:
    *   `main.js`: Application entry point, initializes UI.
    *   `ui.js`: Controller/View-Model - Handles user interactions, manages UI state, orchestrates calls to other modules.
    *   `calculator.js`: Model/Service - Performs core age and lifespan calculations.
    *   `data.js`: Model/Data Source - Provides the static actuarial data.
    *   `gridRenderer.js`: View/Rendering Engine - Generates the HTML for the different grid visualizations.
*   **Single HTML (`index.html`):** Contains the static structure and placeholders for dynamic content.
*   **Single CSS (`style.css`):** Defines all visual styles and layout rules, including responsiveness.

## 2. Key Technical Decisions & Patterns

*   **Vanilla JavaScript (ES Modules):** Chosen for simplicity and performance, avoiding framework overhead for this specific application scope. Enables clear separation of concerns via modules.
*   **UTC-Based Date Handling:**
    *   **Decision:** All internal date storage and calculations are performed using UTC to ensure consistency and avoid timezone/DST errors.
    *   **Pattern:** Input date string is normalized to a UTC midnight Date object in `ui.js`. This normalized object is stored and passed to `gridRenderer.js`, which uses `date-fns` functions configured for UTC.
*   **UI State Management (`ui.js`):**
    *   **Pattern:** Simple module-level variables (`currentView`, `lastCalcData`) are used to maintain the selected view and the results of the last calculation.
    *   **Rationale:** Sufficient for the current application state; avoids the complexity of a dedicated state management library. Enables efficient view switching without recalculation.
*   **Rendering Strategy (`gridRenderer.js`):**
    *   **Pattern:** Direct DOM manipulation using `document.createElement` and leveraging `DocumentFragment` for efficient batch appends to minimize browser reflows.
    *   **Rationale:** Performant enough for the current grid sizes; avoids introducing rendering library dependencies.
*   **CSS Layout Strategy:**
    *   **Pattern:** Fixed-width grid container (`#life-grid-container`) based on Week view requirements, combined with dynamic block sizing (`calc()` + `aspect-ratio: 1 / 1`) for Month/Year views. Results, Grid Guide (`#grid-guide-details`), and View Toggle sections share the same `max-width` as the grid for visual alignment.
    *   **Rationale:** Provides visual consistency across views (no layout shifts) while allowing Month/Year blocks to fill the space effectively. Responsiveness is handled via tiered media queries adjusting container `max-width` and block sizes/gaps, as well as the `max-width` of the aligned sections.
*   **Dependency Management:**
    *   **Pattern:** `date-fns` library is loaded via CDN. `gridRenderer.js` includes a check (`checkDateFns`) for its presence.
    *   **Rationale:** Simple integration for a key dependency.

## 3. Component Relationships & Data Flow

*   **Initialization:** `main.js` calls `ui.setupEventListeners()`.
*   **Calculation Flow:**
    1.  User submits form (`index.html`).
    2.  `ui.js` (`handleCalculation`) validates input, normalizes date to UTC.
    3.  `ui.js` resets visibility of post-calculation UI elements (results, grid guide, toggle, grid).
    4.  `ui.js` calls `calculator.js` (`calculateCurrentAge`, `getRemainingExpectancy`).
    5.  `calculator.js` reads data from `data.js`.
    6.  `calculator.js` returns results (or throws error) to `ui.js`.
    7.  **On Success:**
        *   `ui.js` stores results in `lastCalcData`.
        *   `ui.js` updates `#results-area` via `displayResults`.
        *   `ui.js` calls `renderCurrentView()`.
        *   `ui.js` reveals Results Area, Grid Guide (`#grid-guide-details`), View Toggle, and Grid Container. (FINAL Order)
    8.  **On Error:**
        *   `ui.js` updates `#results-area` via `displayError`.
        *   `ui.js` reveals Results Area.
        *   `ui.js` calls `renderCurrentView()` (to clear grid).
        *   Other elements remain hidden.
*   **Rendering Flow:**
    1.  `ui.js` (`renderCurrentView`) determines the view type (`currentView`).
    2.  `ui.js` calls the appropriate function in `gridRenderer.js` (e.g., `renderMonthsGrid`), passing `lastCalcData`.
    3.  `gridRenderer.js` function performs UTC date calculations using `date-fns`.
    4.  `gridRenderer.js` generates DOM elements (rows, blocks) with correct classes/attributes.
    5.  `gridRenderer.js` appends elements to `#life-grid-container`.
*   **View Switch Flow:**
    1.  User changes view toggle (`index.html`).
    2.  `ui.js` (`handleViewChange`) updates `currentView` state.
    3.  `ui.js` calls `renderCurrentView()`.
    4.  Rendering flow proceeds using the *existing* `lastCalcData`.

## 4. Critical Implementation Details

*   **`gridRenderer.js` - Age View Week Logic:** Uses `eachWeekOfInterval` + `filter(isBefore)` + `.pop()` (if length 54) to accurately determine the ISO weeks starting within each year of life, ensuring visual consistency (max 53 weeks/row).
*   **`gridRenderer.js` - Calendar View:** Uses `getISOWeeksInYear` and correctly handles the 52/53 week variation. Applies `out-of-bounds` styling based on comparison with `firstWeekStartDateUTC` and `estimatedEndDateUTC`.
*   **CSS `calc()` + `aspect-ratio`:** The core mechanism for ensuring Month/Year blocks fill the fixed container width while remaining square. Formulas must be updated in media queries if gaps change.

## 5. UI/Interaction Patterns

*   **Progressive Reveal:** Initially hide non-essential UI elements (results, grid guide, toggle, grid) using a `.hidden` class (`display: none !important;`). Reveal these elements via JavaScript (`ui.js`) upon successful calculation completion. This provides a cleaner initial view focused on the input form. The results area is always revealed on calculation attempt to show success or error messages.
*   **Consolidated Collapsible Section (`<details>`):** (FINAL) The grid explanation and color key are combined into a single `<details id="grid-guide-details">` element.
    *   The `<summary>` is "How to Read This Visualization".
    *   Internally, it uses Flexbox (`.guide-content-wrapper`) to display two columns (`.explanation-column`, `.color-key-column`) side-by-side on wider screens (2:1 ratio).
    *   Internal `<h3>` headings ("Understanding the Grid", "What the Colors Mean") label the content within each column, styled with `font-size: var(--font-size-sm)`.
    *   On smaller screens (<= 768px), the internal columns stack vertically via media query.
    *   The vertical spacing for the color key list items relies on default `li` margins.
    *   This keeps secondary information accessible but visually tidy until the user chooses to expand it.
*   **No Section Headings:** Explicit `<h2>` headings for "Results" and "Visualization" were removed as the content flow makes their purpose clear, reducing visual noise.
*   **Constrained Width Alignment:** Key content sections (Results, Grid Guide, View Toggle, Grid) share the same `max-width` and are centered within the main container, creating a visually cohesive block post-calculation.
