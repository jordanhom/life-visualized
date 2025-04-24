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
    *   **Pattern:** Fixed-width grid container (`#life-grid-container`) based on Week view requirements, combined with dynamic block sizing (`calc()` + `aspect-ratio: 1 / 1`) for Month/Year views.
    *   **Rationale:** Provides visual consistency across views (no layout shifts) while allowing Month/Year blocks to fill the space effectively. Responsiveness is handled via tiered media queries adjusting container `max-width` and block sizes/gaps.
*   **Dependency Management:**
    *   **Pattern:** `date-fns` library is loaded via CDN. `gridRenderer.js` includes a check (`checkDateFns`) for its presence.
    *   **Rationale:** Simple integration for a key dependency.

## 3. Component Relationships & Data Flow

*   **Initialization:** `main.js` calls `ui.setupEventListeners()`.
*   **Calculation Flow:**
    1.  User submits form (`index.html`).
    2.  `ui.js` (`handleCalculation`) validates input, normalizes date to UTC.
    3.  `ui.js` calls `calculator.js` (`calculateCurrentAge`, `getRemainingExpectancy`).
    4.  `calculator.js` reads data from `data.js`.
    5.  `calculator.js` returns results to `ui.js`.
    6.  `ui.js` stores results in `lastCalcData` and updates `#results-area`.
    7.  `ui.js` calls `renderCurrentView()`.
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
