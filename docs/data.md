# Data Module (`js/data.js`)

Purpose
Export the `lifeExpectancyData` object containing actuarial estimates used by the calculator.

Location
- [`js/data.js`](js/data.js:1)

Structure
- Top-level keys: 'male', 'female'
- Each value: object mapping age bracket lower bound (string) -> remaining years (number)
- Example:
```
{
  'male': { '0': 73.5, '10': 64.0, ... },
  'female': { '0': 79.3, '10': 69.7, ... }
}
```

Notes
- Values correspond to remaining years for someone entering that age bracket (CDC 2021).
- When updating data, keep bracket lower-bound convention and numeric values.
- Consider adding a metadata/version key when swapping datasets.

Tests
- Validate object keys for both sexes.
- Ensure each bracket key parses to a finite number and each value is a finite number.
- Example console assertion: console.assert(Number.isFinite(Number(Object.keys(lifeExpectancyData.male)[0])), 'bracket key parseable');

Migration
- If changing the data shape, update [`js/calculator.js`](js/calculator.js:1) and tests.

References
- Source: US CDC/NCHS Period Life Table, 2021
- Used by: [`js/calculator.js`](js/calculator.js:1)