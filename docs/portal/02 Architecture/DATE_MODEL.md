# Life Visualized — Date Model

**Document status:** Active

## Purpose

`js/dateUtils.js` defines the shared date-only model used by age calculation and all four grid views:

- Birthdates are timezone-free calendar values, never implicit timestamps.
- User-facing “today,” age rollover, birthdays, and present-period state follow the browser's local calendar.
- Accepted calendar components are encoded at UTC midnight before deterministic arithmetic.
- Generated month, year, anniversary, and ISO-week boundaries do not drift across browser timezones.

## Current Contract

- `getLocalDateUTC` reads local year/month/day from an instant and returns those calendar components encoded at UTC midnight.
- `getBrowserTimeZone` returns the browser's resolved IANA timezone, with `UTC` as a defensive fallback.
- UTC helpers perform month-end clamping, February 29 anniversary clamping, formatting, and ISO-week calculations.
- February 29 anniversaries use February 28 in non-leap years and return to February 29 in leap years.
- ISO week-years contain exactly 52 or 53 Monday-aligned weeks.
- Titles and stored boundaries use deterministic UTC components; current-state classification begins from the browser-local calendar.

## Native Helper Decision

`date-fns` and `date-fns-tz` are maintained libraries and were not identified as defective. The former integration loaded them as CDN globals, the expected `date-fns-tz` global was unavailable in the audited runtime, and local-time operations were mixed with UTC-encoded dates. Native helpers were the smallest fit for the static no-build application and removed the external runtime dependency.

This choice moves calendar-maintenance responsibility into the repository. Issue [#40](https://github.com/jordanhom/life-visualized/issues/40) tracks whether maintained libraries or Temporal should be adopted when requirements justify explicit named-timezone conversion, historical timezone rules, or another documented module-delivery strategy.

Any replacement must avoid CDN globals, preserve the current local-calendar/UTC-boundary contract, and pass the representative timezone regression suite.

## Verification Boundary

Timezone-sensitive changes must cover local midnight, UTC rollover, DST where relevant, month/year ends, leap days, ISO 52/53-week years, and representative zones including Los Angeles, UTC, London, Tokyo, and Auckland.

## References

- [`js/dateUtils.js`](../../../js/dateUtils.js)
- [Lifespan estimation](../03%20Domain%20Model/LIFESPAN_ESTIMATION.md)
- [Visualization workflow](../04%20Core%20Workflows/VISUALIZATION_WORKFLOW.md)
- [Change history](../07%20Execution/history/CHANGE_HISTORY.md)
