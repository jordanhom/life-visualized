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
    *   **Clarity:** The visualization should be immediately understandable. The grid, colors, and states (past/present/future) should be intuitive. Explanations and keys should be easily accessible when needed.
    *   **Simplicity:** The initial interaction should be focused and straightforward (enter details, calculate). Complexity is revealed progressively.
    *   **Impact:** The visualization should be striking and encourage contemplation. Placing the grid prominently after results enhances impact.
    *   **Accuracy (within scope):** Calculations should correctly reflect age and use the specified actuarial data. Date handling (especially across timezones/DST) must be robust (achieved via UTC normalization and calculation).
    *   **Responsiveness:** The experience should be seamless across desktop, tablet, and mobile devices.
    *   **Transparency:** Explanations for visualization nuances (53-week years, calendar view) and a clear disclaimer about the nature of the estimates are essential.

## 3. How It Should Work (User Flow) - Updated for Final Layout

1.  **Initial Load:**
    *   User visits the web application.
    *   The page displays the Title, a brief introductory sentence, the Input Form (DOB, Sex, Calculate button), and the Disclaimer.
    *   Results Area, Grid Guide section (`<details id="grid-guide-details">`), View Toggle, and Grid Container are hidden.
2.  **User Interaction:**
    *   User enters their birth date and selects their sex from the form.
    *   User clicks the "Calculate & Visualize" button.
3.  **Calculation Attempt & Results Display:**
    *   The application attempts to validate input and perform calculations.
    *   The Results Area becomes visible.
    *   **If Error:** A clear error message is displayed in the Results Area. The Grid Guide, Grid, and View Toggle remain hidden. The grid area is cleared if it previously contained content.
    *   **If Success:**
        *   The calculated results (current age, remaining years, total estimate) are displayed clearly in the Results Area.
        *   The application generates the life grid visualization (defaulting to "Weeks by Age").
        *   The Grid Guide section (`<details id="grid-guide-details">` with summary "How to Read This Visualization") becomes visible (collapsed by default).
        *   The View Toggle controls become visible.
        *   The Grid Container becomes visible, displaying the rendered grid.
        *   (Order of revealed elements after Form: Results Area -> Grid Guide -> View Toggle -> Grid Container -> Disclaimer)
4.  **Post-Calculation Interaction:**
    *   The user can select different view types (Weeks by Calendar, Months, Years) using the now-visible radio buttons.
    *   Selecting a different view instantly updates the grid visualization *without* requiring recalculation.
    *   The user can expand/collapse the "How to Read This Visualization" section (`<details>`) to view the explanation ("Understanding the Grid") and color key ("What the Colors Mean"), presented in side-by-side columns (which stack vertically on smaller screens).
5.  **Re-Calculation:** If the user changes inputs and clicks "Calculate & Visualize" again, the flow repeats from Step 2/3 (relevant sections are hidden again before the new attempt).

## 4. Key Product Decisions (Rationale)

*   **Multiple Views (Weeks, Months, Years):** Offers different levels of granularity for perspective. Weeks provide detail, months offer a balance, and years give a high-level overview.
*   **Age-Based vs. Calendar-Based Weeks:** Provides two distinct ways to conceptualize weekly progress – relative to one's own age milestones vs. alignment with the standard calendar year structure.
*   **Fixed Grid Width:** Ensures a stable and predictable user experience when switching between views, preventing jarring layout shifts.
*   **Dynamic Block Sizing (Months/Years):** Makes the less granular views (Months, Years) visually fill the available space effectively within the fixed container, enhancing their impact.
*   **Clear Disclaimer & Explanations:** Manages user expectations regarding the estimate's nature and clarifies potential points of confusion in the visualization.
*   **UTC Date Handling:** Chosen to ensure calculations are consistent and free from local timezone/DST ambiguities, critical for accurate grid rendering across users.
*   **Progressive Reveal:** Hiding results, controls, and the grid initially creates a cleaner, less overwhelming starting point focused solely on the required input. Reveals information contextually after the primary action (calculation) is performed.
*   **Consolidated & Collapsible Guide/Key:** (FINAL) Combining the explanation and color key into a single `<details>` element keeps secondary information accessible but visually tidy, reducing initial vertical clutter post-calculation. The side-by-side internal layout (on wider screens) presents the information efficiently once expanded. The trade-off is that the expanded height is still significant, but collapsibility mitigates this. User-oriented headings ("Understanding the Grid", "What the Colors Mean") are used internally.
*   **Grid Prominence & Width Alignment:** Placing the grid immediately after results/guide/toggle and constraining the width of these sections to match the grid creates a more cohesive and focused visual structure post-calculation.
*   **No Section Headings:** Explicit "Results" and "Visualization" headings were removed as the content is self-explanatory within the flow, reducing visual clutter.
