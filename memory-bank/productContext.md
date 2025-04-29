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
    *   **Visual Cohesion:** Controls and related information should feel integrated with the visualization they affect.
    *   **Accessibility:** Ensure the tool is usable by people with disabilities (WCAG considerations).

## 3. How It Should Work (User Flow) - Updated for Integrated Header & Nested Elements

1.  **Initial Load:**
    *   User visits the web application.
    *   The page displays the Title, a brief introductory sentence, the Input Form (DOB, Sex, Calculate button), and the Disclaimer.
    *   Results Area and the main Grid Container (`#life-grid-container`) are hidden. The Grid Container holds the Grid Controls Header, Grid Guide section, and the Grid Content Area, all of which are also initially hidden.
2.  **User Interaction:**
    *   User enters their birth date and selects their sex from the form.
    *   User clicks the "Calculate & Visualize" button.
3.  **Calculation Attempt & Results Display:**
    *   The application attempts to validate input and perform calculations.
    *   The Results Area becomes visible.
    *   **If Error:** A clear error message is displayed in the Results Area. The main Grid Container and its contents (Controls, Guide, Grid) remain hidden. The grid content area is cleared if it previously contained content.
    *   **If Success:**
        *   The calculated results (current age, remaining years, total estimate) are displayed clearly in the Results Area.
        *   The application generates the life grid visualization (defaulting to "Weeks by Age") and renders it into the dedicated grid content area (`#grid-content-area`).
        *   The main Grid Container (`#life-grid-container`) becomes visible.
        *   The Grid Controls Header (`#grid-controls-header`) becomes visible *inside* the grid container, displaying the segmented button view controls. The active button indicates the current view, and tooltips provide view descriptions on hover/focus.
        *   The Grid Guide section (`<details id="grid-guide-details">` with summary "How to Read This Visualization") becomes visible *inside* the grid container, positioned below the controls and above the grid content area (collapsed by default).
        *   (Order of revealed elements after Form: Results Area -> Grid Container (which reveals Controls, Guide, and Grid Content Area))
4.  **Post-Calculation Interaction:**
    *   The user can select different view types (Weeks by Age, Weeks by Calendar, Months, Years) using the segmented buttons in the Grid Controls Header.
    *   Selecting a different view instantly updates the grid visualization in the grid content area *without* requiring recalculation.
    *   The Grid Controls Header remains sticky at the top of the grid container as the user scrolls horizontally or vertically within the grid area.
    *   The user can expand/collapse the "How to Read This Visualization" section (`<details>`) to view the explanation ("Understanding the Grid") and color key ("What the Colors Mean"), presented in side-by-side columns (which stack vertically on smaller screens).
5.  **Re-Calculation:** If the user changes inputs and clicks "Calculate & Visualize" again, the flow repeats from Step 2/3 (relevant sections are hidden again before the new attempt).

## 4. Key Product Decisions (Rationale) - Updated for Refinements

*   **Multiple Views (Weeks, Months, Years):** Offers different levels of granularity for perspective.
*   **Age-Based vs. Calendar-Based Weeks:** Provides two distinct ways to conceptualize weekly progress.
*   **Fixed Grid Container Width:** Ensures a stable and predictable user experience when switching between views.
*   **Dynamic Block Sizing (Months/Years):** Makes less granular views visually fill the available space effectively.
*   **Clear Disclaimer & Explanations:** Manages user expectations and clarifies visualization nuances.
*   **UTC Date Handling:** Ensures consistent calculations free from local timezone/DST ambiguities.
*   **Progressive Reveal:** Creates a cleaner starting point focused on input.
*   **Consolidated & Collapsible Guide/Key:** Keeps secondary information accessible but visually tidy. **Explanation text refined for clarity and user-friendliness.**
*   **Integrated & Nested Controls Header:** Creates a strong visual connection between controls and visualization. Tooltips reduce clutter.
*   **Sticky Controls Header:** Ensures view controls are always accessible within the scrollable grid.
*   **Nested Guide Placement:** Places explanation close to the visualization.
*   **Dedicated Grid Content Area:** Simplifies clearing and updating the grid visualization.
*   **Grid Prominence & Width Alignment:** Creates a cohesive visual block post-calculation.
*   **No Section Headings:** Reduces visual clutter as content is self-explanatory in flow.

## 5. MVP Launch Criteria & Required UX Refinements (Post-Initial Build)

Following the initial functional build and a comprehensive UX review conducted via the Dr. Evelyn Reed persona (based on `prompt-ux-review.md`), the following UX refinements have been identified as **critical requirements** for the MVP launch to ensure baseline usability, accessibility, clarity, and appropriate emotional framing:

1.  **Feedback & Input Integrity:**
    *   Provide clear visual feedback during calculation (loading states on button and results area).
    *   Prevent premature calculation attempts by disabling the button until inputs are valid.
2.  **Core Comprehension:**
    *   Ensure the user can understand the visualization basics, specifically clarifying the potentially confusing View B (calendar alignment) within the guide using improved text **and a visual aid**. *(Refined text implemented prior to pause, visual aid still needed)*.
3.  **Fundamental Accessibility:**
    *   Implement proper keyboard navigation for primary controls (view switcher using `tablist` pattern).
    *   Verify and ensure sufficient color contrast (WCAG AA minimum) for text and essential visual elements.
    *   Guarantee visible focus indicators for all interactive elements.
4.  **Responsible Framing:**
    *   Use neutral, reflective language throughout the UI.
    *   Clearly present the disclaimer and reassurance text regarding the tool's statistical nature.

Addressing these points is necessary before the application is considered ready for initial user testing or release, ensuring it meets its core goals effectively and responsibly.
