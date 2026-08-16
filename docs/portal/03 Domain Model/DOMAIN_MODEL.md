# Life Visualized — Domain Model

**Document status:** Active

## Core Concepts

- Birthdate: accepted calendar date before today, with no timezone or time-of-day meaning.
- Current age: completed years as of the browser's local calendar date.
- Remaining expectancy: static remaining-years estimate selected from age brackets for `male` or `female` data.
- Estimated lifespan: current age plus remaining expectancy, rendered as time blocks.
- View: Weeks (Age), Weeks (Calendar), Months, or Years.

## Entities And Relationships

- `lifeExpectancyData` contains sex-specific maps from numeric age-bracket strings to remaining years.
- A calculation combines birthdate, sex, current age, remaining expectancy, estimated total lifespan, and browser timezone for rendering diagnostics.
- Rendered rows contain week, month, or year blocks classified by life stage and temporal state.

## Terminology And Rules

- The calculator selects the greatest available bracket less than or equal to age, falling back deterministically to the lowest bracket when necessary.
- Temporal state is `past`, `present`, `future`, or Calendar-view `out-of-bounds`.
- ISO weeks start Monday and years contain 52 or 53 weeks. February 29 anniversaries clamp to February 28 in non-leap years.

## Schemas And Contracts

- Input contract: HTML date string plus `male` or `female`.
- Date boundary contract: UTC-midnight `Date` objects representing calendar components, not instants.
- Renderer contract: birthdate boundary, estimated lifespan, and target DOM container.

## Canonical References

- [Lifespan estimation](LIFESPAN_ESTIMATION.md)
- [Date model](../02%20Architecture/DATE_MODEL.md)
- [Visualization workflow](../04%20Core%20Workflows/VISUALIZATION_WORKFLOW.md)
