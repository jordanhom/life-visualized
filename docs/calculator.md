# Calculator Module (`js/calculator.js`)

Purpose
Provide core calculation utilities used by the UI and renderers:
- [`calculateCurrentAge`](../js/calculator.js)
- [`getRemainingExpectancy`](../js/calculator.js)

Location
- [`js/calculator.js`](../js/calculator.js)

Public API (current)
- calculateCurrentAge(birthDate: Date, currentDateUTC?: Date): number
  - Returns completed years based on the browser's local calendar date.
  - Accepts an optional UTC-encoded current calendar date for deterministic callers and tests.
  - Throws Error when either date is invalid.
  - Uses shared UTC date-only arithmetic after local today is encoded by `dateUtils.js`.
- getRemainingExpectancy(age: number, sex: 'male'|'female', dataOverride?: object|null): Promise<number|null>
  - Asynchronously reads `lifeExpectancyData` and returns a numeric estimate.
  - Optional `dataOverride` supports deterministic tests without mutable module state.
  - Throws Error for invalid inputs (non-finite age or invalid sex).
  - Returns a finite number when a valid bracket/value is found; throws when the data value is invalid (NaN/Infinity/non-numeric).
  - Returns `null` in cases where the sex data is missing or the sex-specific dataset is empty.

Important behaviors and implementation notes
- Local-calendar age calculation:
  - A birthdate remains a timezone-free calendar date encoded at UTC midnight.
  - The current instant is converted to the browser's local year/month/day before completed years are calculated.
  - Age changes at local midnight rather than UTC midnight.
  - February 29 anniversaries use February 28 in non-leap years, matching Year-view boundaries.

- Bracket lookup and fallbacks:
  - The renderer uses numeric string keys in `lifeExpectancyData` (e.g., `'0'`, `'10'`, `'20'`, ...).
  - The module parses keys to numeric brackets, sorts them ascending, and selects the largest bracket ≤ lookup age.
  - If no defined bracket is ≤ the lookup age (all defined brackets are larger), the implementation falls back to the lowest defined bracket deterministically (this behavior was added to handle non-standard datasets).

- Type-safety (incremental):
  - `js/calculator.js` now uses file-level `// @ts-check`.
  - JSDoc typedefs define the expected shape of expectancy data and the `dataOverride` contract.
  - Input date validation uses `Number.isNaN(birthDate.getTime())` for clearer, type-safe checks.

- Test data override:
  - Tests should pass an explicit optional `dataOverride` parameter to `getRemainingExpectancy(age, sex, dataOverride)`.
  - This keeps test data local to each call and avoids hidden mutable module state.

Error policy and contracts
- Inputs:
  - Invalid inputs (e.g., non-Date birthDate, non-finite age, or sex not equal to `'male'` or `'female'`) cause the functions to throw a descriptive Error. Tests rely on this contract.
- Data errors:
  - If a bracket value cannot be coerced to a finite Number (NaN, Infinity, non-numeric string), `getRemainingExpectancy` throws a descriptive Error for visibility during development and testing.
  - If the sex key is missing from the dataset or the sex-specific dataset is empty, the function returns `null` (not an Error) to allow UI-level handling.

Testing notes (updated)
- `calculateCurrentAge` tests:
  - Leap-day birthdays (ensure correct before/after logic).
  - Boundary moments immediately before and at local midnight in representative timezones.
  - Future birth dates -> returns 0 (the function clamps to >= 0).
  - Invalid birthDate -> throws.
- `getRemainingExpectancy` tests:
  - Exact bracket matches (e.g., 50 -> '50' key).
  - Ages between brackets (floor to nearest lower bracket).
  - Very large ages (use highest bracket).
  - Sex validation: invalid sex throws (tests expect thrown Error).
  - Malformed data: invalid numeric values (NaN/Infinity/non-numeric string) cause a thrown Error in current implementation (tests assert throws).
  - Empty sex dataset -> returns `null`.
  - Deterministic overrides: pass `dataOverride` directly in test calls.

Examples
- calculateCurrentAge(new Date('1990-06-10T00:00:00Z')) // uses the browser's local today
- await getRemainingExpectancy(35, 'female') // returns numeric remaining years or null

References
- Data source: [`js/data.js`](../js/data.js)
- Date model and dependency decision: [`docs/dateUtils.md`](dateUtils.md)
- Module: [`js/calculator.js`](../js/calculator.js)
- Tests: [`tests/unit/calculator.test.js`](../tests/unit/calculator.test.js)
