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
    *   **Impact:** The visualization should be striking and encourage contemplation.
    *   **Accuracy (within scope):** Calculations should correctly reflect age and use the specified actuarial data. Date handling (especially across timezones/DST) must be robust (achieved via UTC normalization and calculation).
    *   **Responsiveness:** The experience should be seamless across desktop, tablet, and mobile devices.
    *   **Transparency:** Explanations for visualization nuances (53-week years, calendar view) and a clear disclaimer about the nature of the estimates are essential.

## 3. How It Should Work (User Flow) - Updated for Progressive Reveal

1.  **Initial Load:**
    *   User visits the web application.
    *   The page displays the Title, a brief introductory sentence, the Input Form (DOB, Sex, Calculate button), and the Disclaimer.
    *   The Results Area, View Toggle, Explanation section, Color Key section, and Grid Container are hidden.
2.  **User Interaction:**
    *   User enters their birth date and selects their sex from the form.
    *   User clicks the "Calculate & Visualize" button.
3.  **Calculation Attempt & Results Display:**
    *   The application attempts to validate input and perform calculations.
    *   The Results Area becomes visible.
    *   **If Error:** A clear error message is displayed in the Results Area. The View Toggle, Explanation, Color Key, and Grid remain hidden. The grid area is cleared if it previously contained content.
    *   **If Success:**
        *   The calculated results (current age, remaining years, total estimate) are displayed clearly in the Results Area.
        *   The application generates the life grid visualization (defaulting to "Weeks by Age").
        *   The View Toggle controls become visible.
        *   The Explanation section (collapsible) becomes visible.
        *   The Color Key section (collapsible) becomes visible.
        *   The Grid Container becomes visible, displaying the rendered grid.
4.  **Post-Calculation Interaction:**
    *   The user can select different view types (Weeks by Calendar, Months, Years) using the now-visible radio buttons.
    *   Selecting a different view instantly updates the grid visualization *without* requiring recalculation.
    *   The user can expand/collapse the Explanation and Color Key sections for context.
5.  **Re-Calculation:** If the user changes inputs and clicks "Calculate & Visualize" again, the flow repeats from Step 2/3 (relevant sections are hidden again before the new attempt).

## 4. Key Product Decisions (Rationale)

*   **Multiple Views (Weeks, Months, Years):** Offers different levels of granularity for perspective. Weeks provide detail, months offer a balance, and years give a high-level overview.
*   **Age-Based vs. Calendar-Based Weeks:** Provides two distinct ways to conceptualize weekly progress – relative to one's own age milestones vs. alignment with the standard calendar year structure.
*   **Fixed Grid Width:** Ensures a stable and predictable user experience when switching between views, preventing jarring layout shifts.
*   **Dynamic Block Sizing (Months/Years):** Makes the less granular views (Months, Years) visually fill the available space effectively within the fixed container, enhancing their impact.
*   **Clear Disclaimer & Explanations:** Manages user expectations regarding the estimate's nature and clarifies potential points of confusion in the visualization.
*   **UTC Date Handling:** Chosen to ensure calculations are consistent and free from local timezone/DST ambiguities, critical for accurate grid rendering across users.
*   **Progressive Reveal:** (NEW) Hiding results, controls, and the grid initially creates a cleaner, less overwhelming starting point focused solely on the required input. Reveals information contextually after the primary action (calculation) is performed.
*   **Collapsible Explanation/Key:** (NEW) Keeps secondary information accessible but visually tidy, reducing clutter even after reveal.
