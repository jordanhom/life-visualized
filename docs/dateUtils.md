# Date Utilities (`js/dateUtils.js`)

Purpose
Provide one date-only model for age calculation and grid rendering:
- Treat birthdates as timezone-free calendar dates.
- Derive user-facing “today” from the browser's local calendar.
- Encode calendar dates at UTC midnight before deterministic arithmetic.
- Generate month, year, and ISO-week boundaries without timezone drift.

Location
- [`js/dateUtils.js`](js/dateUtils.js:1)

Why native helpers replaced the date libraries
- `date-fns` and `date-fns-tz` are maintained, tested libraries; the libraries themselves were not identified as defective.
- The previous application integration loaded them as CDN browser globals rather than npm modules.
- The expected `date-fns-tz` global was unavailable in the audited browser runtime.
- Local-time `date-fns` operations were mixed with UTC-encoded birthdates, which caused the timezone defects tracked in issues #32-#35.
- Correcting the integration with npm module imports would introduce a bundling/build decision beyond the focused behavior fix.
- The current required operations are narrow enough to implement directly with native UTC methods and protect with representative timezone and boundary tests.
- Removing CDN scripts also removes an external runtime availability requirement.

Tradeoff
- Native helpers reduce runtime and build complexity but move calendar-maintenance responsibility into this repository.
- Maintained libraries become more valuable as requirements expand to explicit named-timezone conversion, historical timezone rules, or user-selectable “what if” locations.
- The current implementation is a pragmatic choice for the static no-build application, not a permanent rejection of date libraries.

Current contract
- `getLocalDateUTC` reads local year/month/day from an instant and returns the same calendar date encoded at UTC midnight.
- `getBrowserTimeZone` returns the browser's resolved IANA timezone, with `UTC` as a defensive fallback.
- UTC helpers perform month-end clamping, February 29 anniversary clamping, formatting, and ISO-week calculations.
- Age changes at browser-local midnight.
- Present week, month, and age-year state follows the browser-local calendar.
- Generated titles and boundaries remain deterministic UTC-encoded dates.

Revisit criteria
- GitHub issue [#40](https://github.com/jordanhom/life-visualized/issues/40) tracks investigation of maintained libraries and Temporal.
- Any migration must avoid CDN globals, preserve the issue #35 date model, and pass the existing timezone regression suite.
- If libraries are adopted, prefer npm module imports with a documented bundling strategy.

References
- Calculator: [`js/calculator.js`](js/calculator.js:1)
- Renderer: [`js/gridRenderer.js`](js/gridRenderer.js:1)
- Current change summary: [`docs/2026-07-28-changes.md`](docs/2026-07-28-changes.md:1)
