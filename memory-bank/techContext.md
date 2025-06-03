# Tech Context: Life Visualized

## 1. Core Technologies

* **HTML5:** Used for structuring the web page content (`index.html`). Utilizes semantic elements (`<form>`, `<fieldset>`, `<details>`, etc.).
* **CSS3:** Used for all styling and layout (`css/style.css`). Leverages modern features like Flexbox, CSS Variables (implicitly via color definitions, could be more explicit), `calc()`, and `aspect-ratio`. Includes media queries for responsive design.
* **JavaScript (ES6+ / ES Modules):** Used for all client-side logic, including calculations, DOM manipulation, event handling, and state management. Code is organized into modules (`.js` files).

## 2. Key Libraries & Dependencies

* **`date-fns` v4.1.0:**
  * **Usage:** Essential for all complex date calculations (getting weeks, adding units, formatting, comparing dates, handling ISO weeks/years).
  * **Integration:** Loaded via CDN (`https://cdn.jsdelivr.net/npm/date-fns@4.1.0/cdn.min.js`) in `index.html`. Accessed globally via the `dateFns` object.
  * **Constraint:** The application relies on this specific version (or compatible 4.x) being available globally. `gridRenderer.js` includes a basic check for its presence.

## 3. Development Setup & Environment

* **Environment:** Standard web browser environment supporting HTML5, CSS3, and ES6+ JavaScript.
* **Build Process:** None currently required. The application runs directly from the source files (HTML, CSS, JS modules).
* **Development Server:** A simple local HTTP server (like `live-server`, Python's `http.server`, etc.) is needed to serve the files locally due to the use of ES Modules (which have CORS restrictions when loaded via `file://`).

## 4. Technical Constraints

* **Client-Side Only:** No backend infrastructure. All data (`data.js`) and logic reside and execute within the browser.
* **CDN Dependency:** Relies on the `date-fns` CDN being available and accessible to the user. Offline usage is not possible without local hosting of the library.
* **Browser Compatibility:** Primarily targets modern evergreen browsers. Compatibility with older browsers (e.g., IE11) is not a goal and likely broken due to ES6+ features and modern CSS.

## 5. Tool Usage Patterns

* **Version Control:** Git is used for version control, hosted on GitHub (`github.com:jordanhom/life-visualized.git`). The `mvp` branch is the active development branch.
* **Editor:** Visual Studio Code appears to be the editor in use (based on `.git/config` entries, though not strictly a project constraint).
* **Code Formatting/Linting:** No specific tools (like Prettier, ESLint) are explicitly configured in the provided files, but code style appears generally consistent.
