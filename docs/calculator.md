# Calculator Module (`js/calculator.js`)

Purpose
Provide core calculation utilities used by the UI and renderers:
- [`calculateCurrentAge`](js/calculator.js:22)
- [`getRemainingExpectancy`](js/calculator.js:90)

Location
- [`js/calculator.js`](js/calculator.js:1)

Public API (current)
- calculateCurrentAge(birthDate: Date): number
  - Returns completed years based on the current UTC date/time.
  - Throws Error on invalid input (non-Date or invalid Date).
  - Uses UTC getters (getUTCFullYear/getUTCMonth/getUTCDate) to avoid timezone/DST inconsistencies.
- getRemainingExpectancy(age: number, sex: 'male'|'female'): Promise<number|null>
  - Asynchronously reads `lifeExpectancyData` (or uses the in-memory test override) and returns a numeric estimate.
  - Throws Error for invalid inputs (non-finite age or invalid sex).
  - Returns a finite number when a valid bracket/value is found; throws when the data value is invalid (NaN/Infinity/non-numeric).
  - Returns `null` in cases where the sex data is missing or the sex-specific dataset is empty.

Important behaviors and implementation notes
- UTC-based age calculation:
  - `calculateCurrentAge` intentionally uses UTC-based Date getters to ensure deterministic results across timezones and when tests freeze system time.
  - For testing determinism the module's tests inject a frozen system clock; callers may pass a deterministic Date in tests by mocking time.

- Bracket lookup and fallbacks:
  - The renderer uses numeric string keys in `lifeExpectancyData` (e.g., `'0'`, `'10'`, `'20'`, ...).
  - The module parses keys to numeric brackets, sorts them ascending, and selects the largest bracket ≤ lookup age.
  - If no defined bracket is ≤ the lookup age (all defined brackets are larger), the implementation falls back to the lowest defined bracket deterministically (this behavior was added to handle non-standard datasets).
  - To improve performance, consider caching parsed/sorted bracket arrays per sex (future work).

- Test override and API surface:
  - The module currently exposes a test helper [`__setLifeExpectancyDataOverride`](js/calculator.js:55) that injects a dataset for tests.
  - Recommended next step: replace the global mutable override with an explicit optional `dataOverride` parameter on `getRemainingExpectancy(age, sex, dataOverride)` and deprecate the setter. This makes tests explicit and avoids hidden mutable state.

Error policy and contracts
- Inputs:
  - Invalid inputs (e.g., non-Date birthDate, non-finite age, or sex not equal to `'male'` or `'female'`) cause the functions to throw a descriptive Error. Tests rely on this contract.
- Data errors:
  - If a bracket value cannot be coerced to a finite Number (NaN, Infinity, non-numeric string), `getRemainingExpectancy` throws a descriptive Error for visibility during development and testing.
  - If the sex key is missing from the dataset or the sex-specific dataset is empty, the function returns `null` (not an Error) to allow UI-level handling.

Testing notes (updated)
- `calculateCurrentAge` tests:
  - Leap-day birthdays (ensure correct before/after logic).
  - Boundary moments (one second before UTC birthday vs exactly at UTC midnight).
  - Future birth dates -> returns 0 (the function clamps to >= 0).
  - Invalid birthDate -> throws.
- `getRemainingExpectancy` tests:
  - Exact bracket matches (e.g., 50 -> '50' key).
  - Ages between brackets (floor to nearest lower bracket).
  - Very large ages (use highest bracket).
  - Sex validation: invalid sex throws (tests expect thrown Error).
  - Malformed data: invalid numeric values (NaN/Infinity/non-numeric string) cause a thrown Error in current implementation (tests assert throws).
  - Empty sex dataset -> returns `null`.
  - Test override: current tests use [`__setLifeExpectancyDataOverride`](js/calculator.js:55); preference is to migrate tests to pass an explicit override param (future change).

Examples
- calculateCurrentAge(new Date('1990-06-10T00:00:00Z')) // uses UTC date parts
- await getRemainingExpectancy(35, 'female') // returns numeric remaining years or null

Future improvements (non-blocking)
- Make data import synchronous and memoize parsed datasets:
  - Import `lifeExpectancyData` at module top and cache parsed/sorted bracket arrays per-sex to avoid repeated parsing & sorting on every call.
  - If synchronous import is used the API could be simplified to a synchronous `getRemainingExpectancy(...)` (trade-off: simpler API vs larger module init).
- Replace global test override with explicit `dataOverride` parameter and deprecate `__setLifeExpectancyDataOverride`.
- Add explicit caching for parsed brackets and optionally expose a small internal helper to parse/inspect bracket data for tests.
- Add comprehensive JSDoc and a `.d.ts` file to improve developer ergonomics and make the contract explicit.
- Decide and document a single consistent error policy (throw vs return-null) for data-not-found vs invalid-data cases; current implementation mixes both intentionally for test visibility.

References
- Data source: [`js/data.js`](js/data.js:1)
- Module: [`js/calculator.js`](js/calculator.js:1)
- Tests: [`tests/unit/calculator.test.js`](tests/unit/calculator.test.js:1)