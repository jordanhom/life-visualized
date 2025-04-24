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
    *   **Clarity:** The visualization should be immediately understandable. The grid, colors, and states (past/present/future) should be intuitive.
    *   **Simplicity:** The input process should be straightforward (birthdate, sex).
    *   **Impact:** The visualization should be striking and encourage contemplation.
    *   **Accuracy (within scope):** Calculations should correctly reflect age and use the specified actuarial data. Date handling (especially across timezones/DST) must be robust (achieved via UTC normalization and calculation).
    *   **Responsiveness:** The experience should be seamless across desktop, tablet, and mobile devices.
    *   **Transparency:** Explanations for visualization nuances (53-week years, calendar view) and a clear disclaimer about the nature of the estimates are essential.

## 3. How It Should Work (User Flow)

1.  User visits the web application.
2.  User enters their birth date and selects their sex from the form.
3.  User clicks the "Calculate & Visualize" button.
4.  The application calculates the user's current age and estimated total lifespan based on the provided data and actuarial tables.
5.  The calculated results (current age, remaining years, total estimate) are displayed clearly below the form.
6.  The application generates and displays the life grid visualization below the results, defaulting to the "Weeks (by Age)" view.
    *   Blocks are colored according to the user's life stage at that point.
    *   Blocks representing past time are visually distinct (e.g., faded).
    *   The block representing the current week/month/year is highlighted.
    *   Blocks representing the estimated future are visually distinct (e.g., empty/neutral).
7.  The user can select different view types (Weeks by Calendar, Months, Years) using the radio buttons.
8.  Selecting a different view instantly updates the grid visualization *without* requiring recalculation, maintaining layout consistency.
9.  The user can consult the color key and explanation sections for context.
10. If invalid input is provided or data lookup fails, a clear error message is displayed in the results area, and the grid is cleared.

## 4. Key Product Decisions (Rationale)

*   **Multiple Views (Weeks, Months, Years):** Offers different levels of granularity for perspective. Weeks provide detail, months offer a balance, and years give a high-level overview.
*   **Age-Based vs. Calendar-Based Weeks:** Provides two distinct ways to conceptualize weekly progress – relative to one's own age milestones vs. alignment with the standard calendar year structure.
*   **Fixed Grid Width:** Ensures a stable and predictable user experience when switching between views, preventing jarring layout shifts.
*   **Dynamic Block Sizing (Months/Years):** Makes the less granular views (Months, Years) visually fill the available space effectively within the fixed container, enhancing their impact.
*   **Clear Disclaimer & Explanations:** Manages user expectations regarding the estimate's nature and clarifies potential points of confusion in the visualization.
*   **UTC Date Handling:** Chosen to ensure calculations are consistent and free from local timezone/DST ambiguities, critical for accurate grid rendering across users.
