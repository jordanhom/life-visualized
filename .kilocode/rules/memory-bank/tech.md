# Tech Context: Life Visualized

## 1. Core Technologies

* **HTML5:** Used for structuring the web page content (`index.html`). Utilizes semantic elements (`<form>`, `<fieldset>`, `<details>`, etc.).
* **CSS3:** Used for all styling and layout (`css/style.css`). Leverages modern features like Flexbox, CSS Variables, `calc()`, and `aspect-ratio`. Includes media queries for responsive design.
* **JavaScript (ES6+ / ES Modules):** Used for all client-side logic, including calculations, DOM manipulation, event handling, and state management. Code is organized into modules (`.js` files).

## 2. Key Libraries & Dependencies

* **Runtime CDN dependencies:**
  * **`date-fns` v4.1.0:**
  * **Usage:** Used by Age, Month, and Year renderers for date calculations and by renderers for date comparisons.
  * **Integration:** Loaded via CDN (`https://cdn.jsdelivr.net/npm/date-fns@4.1.0/cdn.min.js`) in `index.html`. Accessed globally via the `dateFns` object.
  * **Constraint:** The application relies on this specific version (or compatible 4.x) being available globally. `gridRenderer.js` includes a basic check for its presence.
  * **`date-fns-tz` v1.3.7:**
  * **Usage:** Intended as an optional timezone-aware formatting helper. Calendar view no longer depends on it and formats UTC dates directly.
  * **Integration:** Loaded via CDN (`https://cdn.jsdelivr.net/npm/date-fns-tz@1.3.7/dist/date-fns-tz.min.js`) in `index.html`. Accessed globally via `dateFnsTz`.
  * **Known runtime state:** The current CDN script does not expose `dateFnsTz` in the audited browser runtime, so remaining renderers use their core `date-fns` fallback paths.

* **Dev/test dependencies (npm):**
  * `vitest` `^4.1.1`
  * `jsdom` `^29.0.1`
  * `c8` `^11.0.0`
  * `eslint` `^10.1.0` (+ `@eslint/js`, `globals`)
  * `typescript` `^6.0.2` (+ `@types/node`)

## 3. Development Setup & Environment

* **Environment:** Standard web browser environment supporting HTML5, CSS3, and ES6+ JavaScript.
* **Node baseline for tooling:** Node.js 20+.
* **Build Process:** None currently required. The application runs directly from the source files (HTML, CSS, JS modules).
* **Development Server:** A simple local HTTP server (like `live-server`, Python's `http.server`, etc.) is needed to serve the files locally due to the use of ES Modules (which have CORS restrictions when loaded via `file://`).

## 4. Technical Constraints

* **Client-Side Only:** No backend infrastructure. All data (`data.js`) and logic reside and execute within the browser.
* **CDN Dependency:** Relies on the `date-fns` CDN being available and accessible to the user. Offline usage is not possible without local hosting of the library.
* **Browser Compatibility:** Primarily targets modern evergreen browsers. Compatibility with older browsers (e.g., IE11) is not a goal and likely broken due to ES6+ features and modern CSS.

## 5. Tool Usage Patterns

* **Version Control:** Git is used for version control, hosted on GitHub (`github.com:jordanhom/life-visualized.git`). `main` is the active integration branch.
* **Editor:** Visual Studio Code appears to be the editor in use.
* **Quality gates:**
  * Local: `npm run verify` (lint + typecheck + tests)
  * Local coverage: `npm run test:coverage`
  * CI: `.github/workflows/ci.yml` runs `npm ci`, `npm run lint`, `npm run typecheck`, `npm run test:run`

## 6. Current Test/Coverage Baseline (2026-07-27)

* Unit test files: `11`
* Passing tests: `69`
* Coverage:
  * Statements: `96.17%`
  * Branches: `81.97%`
  * Functions: `100%`
  * Lines: `97.74%`
## 7. Additional Notes from Historical Context

* The project has undergone multiple iterations of UX refinement focusing on clarity, simplicity, and accessibility.
* Accessibility improvements include ARIA roles, keyboard navigation, and focus management.
* The CSS uses modern layout techniques and responsive design to ensure usability across devices.
* The project is designed to be lightweight and dependency-minimal, relying primarily on vanilla JavaScript and a single date library.
