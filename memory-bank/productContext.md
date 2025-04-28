# Product Context: Life Visualized

## 1. Purpose & Problem Solved

The `life-visualized` application exists to provide users with a tangible, visual perspective on their lifespan. Inspired by concepts like Tim Urban's "Life in Weeks", it addresses the abstract nature of time and lifespan by breaking it down into discrete, countable units (weeks, months, years).

The core problem it solves is the difficulty many people have in grasping the finite nature of their time and how much might remain. By visualizing the past, present, and estimated future in a grid format, it aims to:

*   Encourage reflection on time already spent.
*   Highlight the current moment within the broader context of a life.
*   Offer a sense of scale for the time potentially remaining.
*   Motivate users to consider how they spend their time.

It is **not** intended as a precise predictive tool but rather as a thought-provoking visualization based on statistical averages.

## 2. Target User & Experience Goals

*   **Target User:** Individuals interested in self-reflection, personal development, productivity, or simply curious about visualizing time and mortality statistics.
*   **Experience Goals:**
    *   **Clarity:** The visualization should be immediately understandable. The grid, colors, and states (past/present/future) should be intuitive. Explanations and keys should be easily accessible when needed. The current view should be clearly indicated.
    *   **Simplicity:** The initial interaction should be focused and straightforward (enter details, calculate). Complexity is revealed progressively.
    *   **Impact:** The visualization should be striking and encourage contemplation. Placing the grid prominently after results enhances impact.
    *   **Accuracy (within scope):** Calculations should correctly reflect age and use the specified actuarial data. Date handling (especially across timezones/DST) must be robust (achieved via UTC normalization and calculation).
    *   **Responsiveness:** The experience should be seamless across desktop, tablet, and mobile devices.
    *   **Transparency:** Explanations for visualization nuances (53-week years, calendar view) and a clear disclaimer about the nature of the estimates are essential.
    *   **Visual Cohesion:** Controls and related information should feel integrated with the visualization they affect. (NEW)

## 3. How It Should Work (User Flow) - Updated for Integrated Header & Nested Elements

1.  **Initial Load:**
    *   User visits the web application.
    *   The page displays the Title, a brief introductory sentence, the Input Form (DOB, Sex, Calculate button), and the Disclaimer.
    *   Results Area and the main Grid Container (`#life-grid-container`) are hidden. The Grid Container holds the Grid Controls Header, Grid Guide section, and the Grid Content Area, all of which are also initially hidden. (UPDATED)
2.  **User Interaction:**
    *   User enters their birth date and selects their sex from the form.
    *   User clicks the "Calculate & Visualize" button.
3.  **Calculation Attempt & Results Display:**
    *   The application attempts to validate input and perform calculations.
    *   The Results Area becomes visible.
    *   **If Error:** A clear error message is displayed in the Results Area. The main Grid Container and its contents (Controls, Guide, Grid) remain hidden. The grid content area is cleared if it previously contained content. (UPDATED)
    *   **If Success:**
        *   The calculated results (current age, remaining years, total estimate) are displayed clearly in the Results Area.
        *   The application generates the life grid visualization (defaulting to "Weeks by Age") and renders it into the dedicated grid content area (`#grid-content-area`). (UPDATED)
        *   The main Grid Container (`#life-grid-container`) becomes visible.
        *   The Grid Controls Header (`#grid-controls-header`) becomes visible *inside* the grid container, displaying the segmented button view controls. The active button indicates the current view, and tooltips provide view descriptions on hover/focus. (UPDATED)
        *   The Grid Guide section (`<details id="grid-guide-details">` with summary "How to Read This Visualization") becomes visible *inside* the grid container, positioned below the controls and above the grid content area (collapsed by default). (UPDATED)
        *   (Order of revealed elements after Form: Results Area -> Grid Container (which reveals Controls, Guide, and Grid Content Area)) (UPDATED)
4.  **Post-Calculation Interaction:**
    *   The user can select different view types (Weeks by Age, Weeks by Calendar, Months, Years) using the segmented buttons in the Grid Controls Header. (UPDATED)
    *   Selecting a different view instantly updates the grid visualization in the grid content area *without* requiring recalculation. (UPDATED)
    *   The Grid Controls Header remains sticky at the top of the grid container as the user scrolls horizontally or vertically within the grid area. (NEW)
    *   The user can expand/collapse the "How to Read This Visualization" section (`<details>`) to view the explanation ("Understanding the Grid") and color key ("What the Colors Mean"), presented in side-by-side columns (which stack vertically on smaller screens).
5.  **Re-Calculation:** If the user changes inputs and clicks "Calculate & Visualize" again, the flow repeats from Step 2/3 (relevant sections are hidden again before the new attempt).

## 4. Key Product Decisions (Rationale) - Updated for Refinements

*   **Multiple Views (Weeks, Months, Years):** Offers different levels of granularity for perspective. Weeks provide detail, months offer a balance, and years give a high-level overview.
*   **Age-Based vs. Calendar-Based Weeks:** Provides two distinct ways to conceptualize weekly progress – relative to one's own age milestones vs. alignment with the standard calendar year structure.
*   **Fixed Grid Container Width:** Ensures a stable and predictable user experience when switching between views, preventing jarring layout shifts.
*   **Dynamic Block Sizing (Months/Years):** Makes the less granular views (Months, Years) visually fill the available space effectively within the fixed container, enhancing their impact.
*   **Clear Disclaimer & Explanations:** Manages user expectations regarding the estimate's nature and clarifies potential points of confusion in the visualization.
*   **UTC Date Handling:** Chosen to ensure calculations are consistent and free from local timezone/DST ambiguities, critical for accurate grid rendering across users.
*   **Progressive Reveal:** Hiding results and the main grid container initially creates a cleaner, less overwhelming starting point focused solely on the required input. Reveals information contextually after the primary action (calculation) is performed. (UPDATED)
*   **Consolidated & Collapsible Guide/Key:** Combining the explanation and color key into a single `<details>` element keeps secondary information accessible but visually tidy, reducing initial vertical clutter post-calculation. The side-by-side internal layout (on wider screens) presents the information efficiently once expanded. User-oriented headings ("Understanding the Grid", "What the Colors Mean") are used internally.
*   **Integrated & Nested Controls Header:** (UPDATED) Placing the view controls (segmented buttons) directly *inside* the grid container (`#life-grid-container`) creates a strong visual connection between the controls and the visualization. Removing the explicit "Viewing: ..." title and using button tooltips reduces visual clutter while still providing context on demand. (UPDATED)
*   **Sticky Controls Header:** (NEW) Making the header sticky within the scrollable grid container ensures the view controls are always accessible without needing to scroll back to the top of the grid, improving usability for long grids.
*   **Nested Guide Placement:** (NEW) Moving the guide *inside* the grid container, below the controls and above the grid content, places the explanation in close proximity to the visualization it describes, improving discoverability and logical flow.
*   **Dedicated Grid Content Area:** (NEW) Using an inner container (`#grid-content-area`) specifically for the dynamically generated grid blocks allows the main `#life-grid-container` to hold other static/semi-static elements (header, guide) without them being cleared and re-added during view switches.
*   **Grid Prominence & Width Alignment:** The main grid container and the results area share the same `max-width` and are centered, creating a visually cohesive block post-calculation.
*   **No Section Headings:** Explicit "Results" and "Visualization" headings were removed as the content is self-explanatory within the flow, reducing visual clutter.
