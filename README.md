# Life Visualized

A web application inspired by Tim Urban's "Life in Weeks" concept, designed to provide users with a tangible, visual perspective on their estimated lifespan. It aims to encourage reflection on time spent, highlight the present moment, and offer a sense of scale for the time potentially remaining.

**(Note: A screenshot or GIF of the application in action would be beneficial here.)**

## Purpose

The core problem this application addresses is the difficulty many people have in grasping the finite nature of their time. By visualizing the past, present, and estimated future in a grid format based on statistical averages (US CDC 2021 Period Life Table), it serves as a thought-provoking tool for self-reflection.

**It is not intended as a precise predictive tool.**

## Features

* **Input:** Accepts user's Date of Birth (DOB) and Sex.
* **Calculation:**
  * Calculates current age.
  * Estimates remaining and total lifespan based on provided actuarial data.
  * Displays key results clearly.
* **Visualization & Grid:**
  * Renders lifespan as a grid of blocks.
  * Multiple Views:
    * Weeks (arranged by Age Year)
    * Weeks (arranged by Calendar Year - handles 52/53 week variations)
    * Months (arranged by Age Year)
    * Years (arranged by Decade)
  * **Axis Labels:** Dynamically populated top and left axis labels (e.g., Week Number/Month Name/Decade for the top axis, Age Year/Calendar Year for the left axis) provide clear context for each grid view.
  * Color-Coding: Blocks are colored to distinguish past, present, and future.
* **User Interface:**
  * Simple and focused input form.
  * **Progressive Reveal:** Results and visualization appear only after calculation.
  * **Integrated Controls & Guide:**
    * View switcher buttons are nested within the grid container.
    * An integrated, collapsible section explains how to read the visualization and the color key.
  * **Sticky Header:** View controls remain visible when scrolling the grid.
  * **Accessibility:**
    * ARIA `tablist` for view switcher controls, ensuring proper keyboard navigation.
    * Focusable grid container with descriptive ARIA labels for screen reader compatibility.
  * Responsive design for desktop, tablet, and mobile.
  * Clear disclaimer about the nature of the estimates.

## Current Status (As of Last Update)

* **MVP Functionally Complete:** All core features defined in the project brief have been implemented.
* **Ongoing Refinements:** Following the MVP, the project has focused on significant UX, accessibility, and feature enhancements. Development is active.
* **Progress on Previously Identified UX Refinements:**
  * **Feedback & Input Handling (Completed):**
    * Dynamic 'Calculate & Visualize' button state (based on input validity).
    * Loading state during calculations.
  * **Accessibility (Significant Progress):**
    * ARIA `tablist` for the view switcher, enabling robust keyboard navigation.
    * Grid container is now focusable and includes ARIA labels for better screen reader support.
* **Newly Implemented Features/Enhancements (Post-MVP):**
  * Axis labels (top and left) for the grid visualization to improve clarity across different views.
* **Remaining Areas for Polish / Future Consideration:**
    1. **Guide Clarity:** Enhance the "How to Read This Visualization" guide, potentially with a visual aid (diagram/image) for the "Weeks (Calendar Year)" view.
    2. **Accessibility (Continued):**
        * Address any remaining color contrast issues to meet WCAG AA standards.
        * Ensure highly visible focus indicators for all interactive elements.
    3. **Tone & Framing:** Review and refine UI text for neutral and empathetic language; ensure the disclaimer's prominence and clarity.

## Technology Stack

* **Frontend:** HTML5, CSS3 (including Flexbox, CSS Variables, `calc()`, `aspect-ratio`), Vanilla JavaScript (ES6+ Modules)
* **Core Dependency:** `date-fns` v4.1.0 (loaded via CDN) for reliable date calculations (UTC-based). This library is used under the MIT License.
* **Development:** Requires a simple local HTTP server (due to ES Modules). No build process currently.

## Getting Started

1. **Clone the repository:**

    ```bash
    git clone https://github.com/jordanhom/life-visualized.git
    cd life-visualized
    ```

2. **Serve the files:** Since the project uses ES Modules, you need to serve the files via a local HTTP server. Examples:
    * Using Python 3: `python -m http.server`
    * Using Node.js (requires `npm install -g live-server`): `live-server`
    * Using VS Code Live Server extension.
3. **Open in browser:** Navigate to the local server address (e.g., `http://localhost:8000` or `http://127.0.0.1:5500`).
4. **Use the application:**
    * Enter your Date of Birth.
    * Select your Sex.
    * Click "Calculate & Visualize".
    * View the results and the generated grid.
    * Use the buttons above the grid to switch between different views (Weeks, Months, Years).
    * Expand the "How to Read This Visualization" section for details and the color key.

## Future Plans (Post-MVP / If Development Resumes)

The following are ideas considered out of scope for the initial MVP but could be explored if development resumes after the critical UX refinements are addressed:

* Fetching real-time or alternative actuarial datasets.
* More sophisticated life stage calculations/coloring.
* Saving/loading user data or preferences.
* Advanced UI features (tooltips on blocks, zooming, etc.).
* Internationalization (i18n).
* Implementing a build process/bundling.

## Contributing

As development is currently paused and this is a private project, contributions are not being sought.
