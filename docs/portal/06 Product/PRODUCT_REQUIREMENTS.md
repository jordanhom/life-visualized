# Life Visualized — Product Requirements

**Document status:** Active

## Users And Problems

The product serves people seeking a tangible, sensitive way to reflect on the scale of a lifetime. Calendar time and statistical expectancy are abstract; the grid makes them visible without presenting the estimate as a prediction.

## Product Experience

- A focused form accepts birthdate and biological sex, then progressively reveals the estimate and visualization.
- Four synchronized views offer age-relative and calendar-relative perspectives.
- A collapsible guide, color key, axis labels, block titles, and present-state highlighting explain the grid.
- Start Over returns the experience to a clean initial state.

## Requirements And Defaults

- Reject today and future birthdates before calculation.
- Preserve the statistical-reflection disclaimer and sensitive language.
- Keep birthdate and sex data in browser memory only.
- Maintain keyboard-operable tabs, correct ARIA selection/panel relationships, focus handling, and responsive layouts.
- Default to Weeks (Age) on initial load and reset.

## Out Of Scope

- Individual prediction or medical guidance.
- Accounts, analytics, transmission, or persistence of user inputs.
- Live or personalized actuarial feeds, location inference, or automatic demographic expansion.
- A bundling/build system unless a separate architecture decision establishes one.

## Success Measures

- Users can complete a valid calculation, understand the estimate's limits, inspect all four views, and reset without stale state.
- Automated tests and browser acceptance protect calculation, timezone, accessibility, and rendering behavior.

## Canonical References

- [Project overview](../01%20Project/PROJECT_OVERVIEW.md)
- [Core workflows](../04%20Core%20Workflows/CORE_WORKFLOWS.md)
- [README](../../../README.md)
