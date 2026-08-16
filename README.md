# Life Visualized - A Tool For Personal Reflection

Inspired by Tim Urban's thought-provoking "Wait But Why" articles "[Your Life in Weeks](https://waitbutwhy.com/2014/05/life-weeks.html)" and "[The Tail End](https://waitbutwhy.com/2015/12/the-tail-end.html)," this web application offers a tangible, visual perspective on your estimated lifespan. It aims to encourage reflection on time, highlight the present moment, and provide a unique sense of scale for the journey ahead.

## Purpose

Many people have difficulty grasping the finite nature of their time, myself included! By visualizing the past, present, and (estimated) future in a grid format based on statistical averages, it aims to be a thought-provoking tool for self-reflection.

**To be extra clear: This tool is NOT a predictive tool. It uses actuarial data from US CDC 2021 Period Life Table to estimate your lifespan.**

## Project Journey & AI Assistance

"Life Visualized" explored the capabilities and limitations of LLM AI coding assistants. As the sole developer, and new to JavaScript at the project's outset, a key goal was to leverage Google Gemini Code Assist within Visual Studio Code to accelerate learning and development.

AI assistance was used to:

* Rapidly **prototype** HTML, CSS, and JavaScript.
* **Explain** core concepts and date-handling choices.
* **Generate** boilerplate code and **suggest** refinements.
* **Troubleshoot** and **aid** in initial documentation, including this README.
* **Simulate** a team environment by interacting with defined developer, product, and UX personas to **inform** decisions throughout the development process.

This collaborative approach enabled the creation of this MVP, serving as both a functional application and a valuable learning experience in modern AI-assisted software development.

---

## Features

* **Input:** Accepts user's Date of Birth (DOB) and Sex.
* **Calculation:**
  * Calculates current age.
  * Estimates remaining and total lifespan based on provided actuarial data.
  * Displays key results clearly.
* **Visualization & Grid:**
  * Renders lifespan as a responsive grid of blocks.
  * Multiple Views:
    * Weeks (arranged by Age Year with deterministic native date arithmetic)
    * Weeks (arranged by ISO Calendar Year with timezone-independent 52/53-week handling)
    * Months (arranged by Age Year with timezone-independent UTC boundaries)
    * Years (arranged by Decade with timezone-independent UTC anniversaries)
  * **Axis Labels:** Dynamically populated top and left axis labels (e.g., Week Number/Month Name/Decade for the top axis, Age Year/Calendar Year for the left axis) provide clear context for each grid view.
  * **Color-Coding:** Blocks are colored to distinguish past, present, future, and general life stages.
* **User Interface:**
  * Simple and focused input form.
  * Immediate birthdate validation prevents today or future dates from enabling calculation.
  * **Progressive Reveal:** Results and visualization appear only after calculation.
  * **Integrated Controls & Guide:**
    * View switcher buttons are integrated within a sticky header directly above the grid, remaining visible during scroll.
    * A collapsible "How to Read This Visualization" section, including the color key, is also located above the grid.
  * **Accessibility:**
    * ARIA `tablist` for view switcher controls, ensuring proper keyboard navigation.
    * Unified focus styles for interactive elements.
    * Focusable grid container with descriptive ARIA labels for screen reader compatibility.
  * Responsive design for desktop, tablet, and mobile.
  * Clear disclaimer about the nature of the estimates.
  * "Start Over" functionality clears calculation state and restores the default Weeks (Age) view.

## MVP Status

* **MVP Launched:** The Minimum Viable Product is complete and includes all core features and critical UX refinements.
* **Key Features Implemented for MVP:**
  * User input for birth date and sex.
  * Lifespan calculation based on US CDC 2021 data.
  * Multiple grid visualization views (Weeks by Age, Weeks by Calendar, Months, Years).
  * Dynamic axis labels for grid clarity.
  * Color-coding for past, present, future, and life stages.
  * Progressive reveal of results and visualization.
  * Integrated and collapsible "How to Read" guide and color key.
  * ARIA `tablist` for accessible view switching.
  * Responsive design.
  * "Start Over" functionality.
  * Refined introductory text, disclaimers, and overall UI/UX for clarity and sensitivity.
## Technology Stack

* **Frontend:** HTML5, CSS3 (including Flexbox, CSS Variables, `calc()`, `aspect-ratio`), Vanilla JavaScript (ES6+ Modules)
* **Runtime Dependencies:** None. Date-only and ISO-week calculations use native JavaScript helpers. User-facing age and current-period state follow the browser's local calendar while stored boundaries remain deterministic UTC-encoded dates.
* **Dev Tooling:** Vitest, JSDOM, c8, ESLint (flat config), and TypeScript (`tsc --noEmit` for project typecheck gate).
* **Development:** Requires a simple local HTTP server (due to ES Modules). No build process currently.

## Getting Started

1. **Clone the repository:**

    ```bash
    git clone https://github.com/jordanhom/life-visualized.git
    cd life-visualized
    ```

2. **Serve the files:** Since the project uses ES Modules, serve the repository root over HTTP, for example with `python -m http.server 8000` or the VS Code Live Server extension.
3. **Open in browser:** Navigate to the local server address (e.g., `http://localhost:8000` or `http://127.0.0.1:5500`).
4. **Use the application:**
    * Enter your Date of Birth.
    * Select your Sex.
    * Click "Calculate & Visualize".
    * View the results and the generated grid.
    * Use the buttons above the grid to switch between different views (Weeks, Months, Years).
    * Expand the "How to Read This Visualization" section for details and the color key.

## Developer Setup And Verification

Use the project's Conda `base` environment for Node.js and npm work. CI supports Node.js 20.x and 22.x.

```bash
conda run -n base npm ci
conda run -n base npm run verify
conda run -n base npm run test:coverage
```

Focused non-watch commands are `conda run -n base npm run lint`, `conda run -n base npm run typecheck`, and `conda run -n base npm run test:run`. `npm test` starts Vitest in watch mode. Do not commit generated `node_modules/` or `coverage/` content.

CI runs `npm ci` followed by `npm run verify` on Node.js 20.x and 22.x. See [`.github/workflows/ci.yml`](.github/workflows/ci.yml).

## Tracked Follow-Up

Future work is managed in GitHub issues rather than as an implied README roadmap. Current tracked areas include:

* [#15: Complete WCAG AA accessibility pass](https://github.com/jordanhom/life-visualized/issues/15)
* [#31: Fix duplicate Weeks (Age) boundaries and add alignment toggle](https://github.com/jordanhom/life-visualized/issues/31)
* [#40: Investigate maintained date libraries for timezone architecture](https://github.com/jordanhom/life-visualized/issues/40)
* [#43: Strengthen production integration coverage](https://github.com/jordanhom/life-visualized/issues/43)

## Contributing

This is a personal project. Contributions are not being sought at this time.
