# Calculator Module (`js/calculator.js`)

Purpose
Provide core calculation utilities used by UI and renderers:
- calculateCurrentAge(birthDate)
- getRemainingExpectancy(age, sex)

Location
- [`js/calculator.js`](js/calculator.js:1)

Public API
- calculateCurrentAge(birthDate: Date): number
  - Returns completed years based on current local date.
- getRemainingExpectancy(age: number, sex: 'male'|'female'): number|null
  - Looks up remaining years from `lifeExpectancyData` in [`js/data.js`](js/data.js:1).

Notes
- `calculateCurrentAge` uses local Date() to determine current age. For deterministic unit tests, consider allowing an optional `now` parameter to inject a fixed date.
- `getRemainingExpectancy` finds the appropriate age bracket by selecting the highest bracket <= age. Ensure bracket lookup remains stable if `lifeExpectancyData` structure changes.

Testing
- `calculateCurrentAge` tests:
  - Birthdays on leap day and around year boundaries.
  - Birth date equals today (age 0).
  - Future birth date should return 0 (caller validates input).
- `getRemainingExpectancy` tests:
  - Exact bracket matches (e.g., age 50 should return value at '50' key).
  - Ages between brackets (e.g., 53 should use the 50 bracket).
  - Unknown sex returns null.
  - Non-number data in `lifeExpectancyData` should be logged and return null.

Examples (console)
- calculateCurrentAge(new Date('1990-06-10'))
- getRemainingExpectancy(35, 'female')

References
- Data source: [`js/data.js`](js/data.js:1)
- UI integration: [`js/ui.js`](js/ui.js:1)