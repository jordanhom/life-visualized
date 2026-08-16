# Life Visualized — Lifespan Estimation

**Document status:** Active

## Responsibilities

`js/data.js` exports the static US CDC/NCHS 2021 period life-table estimates. `js/calculator.js` validates inputs, calculates completed age, selects the applicable remaining-expectancy bracket, and returns the estimate consumed by the UI.

## Data Contract

- Top-level keys are `male` and `female`.
- Each value is an object mapping a numeric age-bracket string to remaining years.
- Bracket keys and values must coerce to finite numbers.
- Values represent remaining years for a person entering the corresponding bracket.
- A data-shape change requires coordinated calculator and test updates.

## Calculator API

- `calculateCurrentAge(birthDate, currentDateUTC?)`
  - Returns completed years using the browser's local calendar date encoded for UTC arithmetic.
  - Accepts an optional UTC-encoded current calendar date for deterministic callers and tests.
  - Clamps future birthdates to age zero and throws for invalid dates.
  - Uses the February 29 anniversary rule from the shared date model.
- `getRemainingExpectancy(age, sex, dataOverride?)`
  - Accepts a finite age and `male` or `female`.
  - Selects the greatest defined bracket less than or equal to age.
  - Falls back to the lowest defined bracket if every bracket is greater than age.
  - Returns `null` when the requested sex data is missing or empty.
  - Throws when inputs or selected data values are invalid.
  - Supports an explicit test-only data override without mutable module state.

## Type And Test Boundaries

`js/calculator.js` uses file-level `@ts-check` and JSDoc types. Tests protect birthday boundaries, local-midnight rollover, leap days, bracket selection, large ages, malformed data, missing data, and deterministic overrides. Data tests protect the two sex keys and numeric bracket/value shape.

## References

- [`js/calculator.js`](../../../js/calculator.js)
- [`js/data.js`](../../../js/data.js)
- [`tests/unit/calculator.test.js`](../../../tests/unit/calculator.test.js)
- [`tests/unit/data.test.js`](../../../tests/unit/data.test.js)
- [Date model](../02%20Architecture/DATE_MODEL.md)
