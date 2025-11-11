# Life Visualized - A Tool For Personal Reflection

Inspired by Tim Urban's thought-provoking "Wait But Why" articles "[Your Life in Weeks](https://waitbutwhy.com/2014/05/life-weeks.html)" and "[The Tail End](https://waitbutwhy.com/2015/12/the-tail-end.html)," this web application offers a tangible, visual perspective on your estimated lifespan. It aims to encourage reflection on time, highlight the present moment, and provide a unique sense of scale for the journey ahead.

**(Note: A screenshot or GIF of the application in action would be beneficial here.)**

## Purpose

Many people have difficulty grasping the finite nature of their time, myself included! By visualizing the past, present, and (estimated) future in a grid format based on statistical averages, it aims to be a thought-provoking tool for self-reflection.

**To be extra clear: This tool is NOT a predictive tool. It uses actuarial data from US CDC 2021 Period Life Table to estimate your lifespan.**

## Project Journey & AI Assistance

"Life Visualized" explored the capabilities and limitations of LLM AI coding assistants. As the sole developer, and new to JavaScript at the project's outset, a key goal was to leverage Google Gemini Code Assist within Visual Studio Code to accelerate learning and development.

AI assistance was used to:

* Rapidly **prototype** HTML, CSS, and JavaScript.
* **Explain** core concepts and library usage (e.g., `date-fns`).
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
    * Weeks (arranged by Age Year)
    * Weeks (arranged by Calendar Year - handles 52/53 week variations)
    * Months (arranged by Age Year)
    * Years (arranged by Decade)
  * **Axis Labels:** Dynamically populated top and left axis labels (e.g., Week Number/Month Name/Decade for the top axis, Age Year/Calendar Year for the left axis) provide clear context for each grid view.
  * **Color-Coding:** Blocks are colored to distinguish past, present, future, and general life stages.
* **User Interface:**
  * Simple and focused input form.
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
  * "Start Over" functionality to reset the application.

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
* **Known Minor Issue for MVP:**
  * Safari Tabbing: Minor inconsistencies in tabbing behavior for dynamically enabled/visible buttons in Safari. Core functionality remains accessible.

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

## Developer Setup & CI (quick)

- Minimal files to commit:
  - [`package.json`](package.json:1)
  - [`package-lock.json`](package-lock.json:1)
  - [`.github/workflows/ci.yml`](.github/workflows/ci.yml:1)

- Do NOT commit [`node_modules`](node_modules:1). Add it to `.gitignore` so installs remain reproducible and the repo stays small.

- Install dependencies (reproducible):
  - Locally: npm ci
  - (Optional) project provides an npm "install" script which calls `npm ci`: `npm run install`

- Run tests:
  - Interactive: `npm test`
  - Non-interactive / CI: `npm test -- --run` or `npm run test:run`

- CI notes:
  - CI is configured to use `npm ci` and caches npm for speed; this ensures reproducible installs and avoids committing dependency trees.
  - The workflow lives at [`.github/workflows/ci.yml`](.github/workflows/ci.yml:1).

These instructions are intentionally minimal so you only check in the manifest and CI config; contributors and CI will fetch dependencies via `npm ci`.
## Potential Future Enhancements

The following are ideas considered out of scope for the MVP but could be explored in future iterations:

* Fetching real-time or alternative actuarial datasets.
* More sophisticated life stage calculations/coloring.
* Saving/loading user data or preferences.
* Advanced UI features (tooltips on blocks, zooming, etc.).
* Internationalization (i18n).
* Implementing a build process/bundling.
* Further accessibility enhancements (e.g., advanced color contrast adjustments, visual aids for complex views).

## Contributing

This is a personal project. Contributions are not being sought at this time.
