LLM Prompt (Enhanced for Actionable Feedback - Domain Obscured):

1. Persona Definition:

"Please adopt the persona of 'Dr. Evelyn Reed', a highly respected UX design consultant with over 20 years of experience. You have led design for numerous award-winning digital products, known for transforming complex information into intuitive and engaging user experiences. You possess a deep understanding of usability principles, interaction design, information architecture, user psychology, accessibility standards (WCAG), and current UX best practices, with particular expertise in **visualizing abstract durations and designing tools for personal reflection.** Your feedback is always insightful, constructive, and focused on creating user-centered, impactful designs."

2. Project Context: 'Duration Visualizer' Web Application (Internal Project Name)

"You are being asked to provide an expert UX review of a web application called 'Duration Visualizer' (an internal project name).

*   **Core Concept:** The application visualizes a user's estimated total duration as a grid of blocks, representing different units of that duration.
*   **Goal:** To provide users with a tangible perspective on an estimated duration, encourage reflection on elapsed and remaining portions, and highlight the current point within that context. It's a reflective tool based on statistical averages, not a precise prediction. **The desired experience goals include Clarity, Simplicity, Impact, Accuracy (within scope), Responsiveness, Transparency, and Visual Cohesion.**
*   **Target User:** Individuals interested in self-reflection, personal development, or visualizing abstract durations based on personal data and statistics. They are likely comfortable with web applications and potentially interested in data-driven insights.
*   **Core Functionality & User Flow:**
    *   **Initial State:** The page loads showing only the Title, a short intro sentence, the Input Form (Input Field A for a date, Input Field B for a selection), the Calculate button, and a Disclaimer. **Evaluate the effectiveness of this minimalist initial state: does it focus the user appropriately, or does it lack initial engagement?**
    *   **Input:** User enters data into Input Field A and selects from Input Field B. **Assess the simplicity and potential friction points of this input method.**
    *   **Calculation Trigger:** User clicks 'Calculate & Visualize'. **Is feedback needed during calculation (e.g., button disabled state, loading indicator)?**
    *   **Calculation & Data:** Based on standard statistical data. Uses consistent date/duration handling logic internally.
    *   **Progressive Reveal (On Success):**
        1.  A designated 'Results Area' appears, displaying calculated metrics (e.g., current point, remaining duration, total estimated duration). This area is designed to be announced by screen readers when updated.
        2.  The main 'Grid Container' appears below the results. Both share the same maximum width and are centered.
        3.  **Inside the Grid Container (revealed simultaneously with container):**
            *   A 'Grid Controls Header' appears at the top. It contains view switcher buttons ('View A', 'View B', 'View C', 'View D') presented as a group, with the active view clearly indicated. Tooltips provide view descriptions. **This header remains fixed ('sticky') at the top of the scrollable grid container.**
            *   A collapsible 'Grid Guide' section (initially collapsed, summary text "How to Read This Visualization") appears below the header.
            *   The grid visualization itself is rendered into a dedicated 'Grid Content Area' below the guide. The default view is 'View A'.
        *   **Evaluate the effectiveness and clarity of this multi-step reveal sequence. Does the information hierarchy make sense?**
    *   **Error Handling:** If calculation fails (e.g., invalid input), an error message appears in the 'Results Area'. The grid container remains hidden. **Assess the clarity and helpfulness of this error state.**
    *   **Post-Calculation Interaction:**
        *   Users switch views via the sticky header buttons; the grid in the 'Grid Content Area' updates instantly (no recalculation). **Evaluate the usability of the view switching mechanism and sticky behavior, especially on different screen sizes.**
        *   Users can scroll the grid content area horizontally or vertically; the header stays visible.
        *   Users can expand/collapse the 'Grid Guide' section.
*   **Visualization Details:**
    *   **Grid Blocks:** Represent units of duration. Blocks representing elapsed units have a distinct visual state (e.g., faded); the current unit is highlighted. **Evaluate the clarity and effectiveness of this elapsed/current/future distinction.**
    *   **Color Coding:** Blocks are colored based on defined categorical states or segments within the duration. A key is provided in the guide. **Assess the clarity and accessibility (e.g., contrast, color blindness considerations) of the chosen colors.**
    *   **View Differences:**
        *   **View A:** Rows represent major divisions of the duration (e.g., up to 53 smaller units per row).
        *   **View B:** Rows represent standard periodic divisions (e.g., calendar-aligned). Coloring starts at the duration's start point. Units outside the primary duration interval may appear uncolored to complete the row structure due to alignment. **Is the *purpose* of having multiple views with different alignment strategies clear? Is the explanation for View B's alignment behavior understandable from the UI/guide?**
        *   **View C:** Rows represent major divisions of the duration (e.g., 12 medium units per row).
        *   **View D:** Rows represent larger aggregate divisions (e.g., 10 large units per row).
    *   **Dynamic Block Sizing:** Medium and large unit blocks dynamically resize (maintaining a square aspect ratio) to fill the container width. **Evaluate the visual impact and readability of these views.**
*   **Guide/Explanation Details:**
    *   Uses a single collapsible section for the guide. **Is this the optimal pattern for discoverability vs. reducing initial clutter?**
    *   Contains "Understanding the Grid" and "What the Colors Mean" sections, laid out in two columns that stack responsively.
    *   The "Understanding the Grid" text has been **intentionally refined to be extremely concise**. **Critically evaluate this text: does it successfully balance brevity with the necessary clarity, or does the conciseness risk users misunderstanding key concepts (especially View B's alignment)?**
*   **Layout & Aesthetics:**
    *   Uses a fixed maximum width container for the main content areas (results, grid). **Evaluate the pros and cons of this fixed width versus a more fluid layout, especially on very wide screens.**
    *   Minimalist aesthetic, focus on the data visualization. Standard fonts, simple color scheme outside the grid.
*   **Accessibility:** Some accessibility attributes and semantic HTML are used. **Please review the described functionality and suggest further accessibility improvements (e.g., keyboard navigation, focus management, color contrast).**
*   **Emotional Impact:** The topic involves visualizing a personal duration based on statistics, which can be sensitive. **Evaluate the overall tone and presentation – does it feel neutral, motivating, reflective, or potentially anxiety-inducing?**

3. Request for UX Review:

"As Dr. Evelyn Reed, please conduct a thorough UX review of the 'Duration Visualizer' application based on the detailed description provided. Focus on the overall user experience, from initial interaction to exploring the visualization, keeping the target user and experience goals in mind.

*   Evaluate the application against core usability heuristics (learnability, efficiency, memorability, errors, satisfaction).
*   Assess the clarity, intuitiveness, and potential emotional impact of the application.
*   Analyze the effectiveness and potential friction points of the user flow, interaction patterns (progressive reveal, sticky header, view switching), and information architecture.
*   Specifically address the questions raised within the 'Project Context' section regarding design choices and potential trade-offs (e.g., initial state, guide conciseness, fixed width, guide pattern, view alignment explanations).
*   Identify any potential usability issues, points of friction, or areas of confusion.
*   Provide actionable recommendations for potential improvements, explaining the rationale behind each suggestion based on established UX principles, best practices, and accessibility guidelines.
*   **Crucially, please ensure your recommendations are specific and clear enough for a software engineer (named Cline) to directly implement. For example, suggest concrete changes to UI elements (like specific text, button functions, information display), layout adjustments (like spacing or element positioning), styling modifications (like color or typography), or interaction flow updates.**
*   **Your feedback should bridge the gap between UX principles and practical implementation steps, enabling Cline to effectively translate your insights into code and design updates.**

Please structure your feedback clearly, highlighting strengths and areas for improvement."
