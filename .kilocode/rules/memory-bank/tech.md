# Tech Context: Life Visualized

## 1. Core Technologies

* **HTML5:** Used for structuring the web page content (`index.html`). Utilizes semantic elements (`<form>`, `<fieldset>`, `<details>`, etc.).
* **CSS3:** Used for all styling and layout (`css/style.css`). Leverages modern features like Flexbox, CSS Variables, `calc()`, and `aspect-ratio`. Includes media queries for responsive design.
* **JavaScript (ES6+ / ES Modules):** Used for all client-side logic, including calculations, DOM manipulation, event handling, and state management. Code is organized into modules (`.js` files).

## 2. Key Libraries & Dependencies

* **Runtime dependencies:** None.
  * Native JavaScript and `Intl.DateTimeFormat` provide date-only, ISO-week, and IANA timezone behavior.
  * `js/dateUtils.js` centralizes local-calendar conversion and deterministic UTC arithmetic.
  * This is a provisional architecture choice for the static no-build runtime. Issue #40 tracks whether maintained date libraries should return through module imports and a documented build strategy.

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
* **No Build/Runtime Dependency:** The application runs from static first-party files. A local HTTP server is still required for ES modules.
* **Browser Compatibility:** Primarily targets modern evergreen browsers. Compatibility with older browsers (e.g., IE11) is not a goal and likely broken due to ES6+ features and modern CSS.

## 5. Tool Usage Patterns

* **Version Control:** Git is used for version control, hosted on GitHub (`github.com:jordanhom/life-visualized.git`). `main` is the active integration branch.
* **Editor:** Visual Studio Code appears to be the editor in use.
* **Quality gates:**
  * Local: `npm run verify` (lint + typecheck + tests)
  * Local coverage: `npm run test:coverage`
  * CI: `.github/workflows/ci.yml` runs `npm ci`, `npm run lint`, `npm run typecheck`, `npm run test:run`

## 6. Current Test/Coverage Baseline (2026-07-28)

* Unit test files: `13`
* Passing tests: `87`
* Coverage:
  * Statements: `97.96%`
  * Branches: `87.09%`
  * Functions: `100%`
  * Lines: `98.15%`
## 7. Additional Notes from Historical Context

* The project has undergone multiple iterations of UX refinement focusing on clarity, simplicity, and accessibility.
* Accessibility improvements include ARIA roles, keyboard navigation, and focus management.
* The CSS uses modern layout techniques and responsive design to ensure usability across devices.
* The project is designed to be lightweight and uses no third-party runtime JavaScript libraries.
