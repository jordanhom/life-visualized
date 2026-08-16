# Life Visualized — Core Workflows

**Document status:** Active

## Primary Workflows

1. The UI constrains birthdate to yesterday or earlier and enables calculation only when birthdate and sex are valid.
2. Submission parses the date as UTC-encoded calendar components, calculates current age, looks up remaining expectancy, and stores calculation state in memory.
3. Results and the default Weeks (Age) grid are revealed.
4. View controls rerender the same calculation as Calendar weeks, months, or years while synchronizing tab and panel ARIA state.
5. Start Over clears calculation/UI state and restores the default view.

## Inputs And Outputs

- Inputs: birthdate and biological sex.
- Outputs: explanatory result text and a responsive block grid with axis labels, titles, life-stage colors, and past/present/future state.
- No input or result leaves the browser.

## States And Failure Behavior

- Initial: form visible, Calculate disabled, results and grid hidden.
- Calculating: button/loading state prevents duplicate interaction.
- Success: calculation state exists and controls/results/grid are available.
- Error: a user-facing message is announced; invalid inputs do not render a grid.
- Reset: initial visibility, controls, focus, ARIA state, and default view are restored.

## Cross-Layer Boundaries

- UI owns orchestration and accessibility; calculator owns estimates; date utilities own calendar semantics; renderer owns grid DOM; CSS owns presentation.
- Static actuarial data remains separate from calculation logic and can be overridden in tests.

## Canonical References

- [Visualization workflow](VISUALIZATION_WORKFLOW.md)
- [Lifespan estimation](../03%20Domain%20Model/LIFESPAN_ESTIMATION.md)
- [Date model](../02%20Architecture/DATE_MODEL.md)
