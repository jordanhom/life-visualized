# Main Module (`js/main.js`)

Purpose
The smallest entry point for the application. Responsible for bootstrapping UI initialization and performing any global sanity checks on load.

Location
- [`js/main.js`](js/main.js:1)

What it should do
- Import and call the public initialization function exported by the UI layer.
- Ensure the DOM is ready before calling into UI.
- Optionally log startup diagnostics (e.g., presence of `date-fns`).

Public behaviour / API
- No exported API (runs on script import).
- Side-effect: calls [`setupEventListeners()`](js/ui.js:1) from the UI module.

Side-effects & requirements
- Must be loaded after the `date-fns` CDN script in [`index.html`](index.html:1) to allow renderers to rely on `dateFns`.
- Minimal logic — keep to DOM-ready check + one line to initialize the app.

Tests / verification
- Manual smoke: open the page and verify console shows "Initial view set to:" or equivalent log from [`js/ui.js`](js/ui.js:1).
- Include a simple automated harness that imports the module inside `tests/` to confirm import runs without throwing.

Notes
- Keep this file intentionally small to avoid hidden responsibilities.
- Any additional feature flags or telemetry should be delegated to a separate module.