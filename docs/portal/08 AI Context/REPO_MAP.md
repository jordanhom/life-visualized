# Life Visualized — Repository Map

**Document status:** Active

## Purpose

Route maintainers to implementation seams and diagnostic evidence without duplicating function-level documentation.

## Instruction Boundaries

- `AGENTS.md`: repository-wide execution and quality rules.
- `docs/portal/`: domain-layered durable project, architecture, module-contract, workflow, operations, product, execution, and historical context.
- `memory-bank/`: concise cross-session snapshot; verify volatile claims.
- Legacy Kilo Code context: removed from the working tree after migration; available through Git history only.

## Implementation Entry Points

- Page and styles: `index.html`, `css/style.css`.
- Boot and orchestration: `js/main.js`, `js/ui.js`.
- Estimate and source data: `js/calculator.js`, `js/data.js`.
- Calendar model: `js/dateUtils.js`.
- Visualization: `js/gridRenderer.js`.
- Automated evidence: `tests/unit/`, `tests/setup/jsdom-helper.js`.
- Tooling and CI: `package.json`, `tsconfig.json`, `eslint.config.js`, `.github/workflows/ci.yml`.

## Common Task Routing

- Input, progressive reveal, tabs, reset, focus, or ARIA: start with [Visualization Workflow](../04%20Core%20Workflows/VISUALIZATION_WORKFLOW.md), then `js/ui.js`, `index.html`, and UI tests.
- Age or expectancy: start with [Lifespan Estimation](../03%20Domain%20Model/LIFESPAN_ESTIMATION.md), then `js/calculator.js`, `js/data.js`, and calculator/data tests.
- Timezone, leap day, month/year, or ISO week: start with the [Date Model](../02%20Architecture/DATE_MODEL.md), then `js/dateUtils.js`, its consumers, and timezone tests.
- Grid count, title, stage, or state: start with [Visualization Workflow](../04%20Core%20Workflows/VISUALIZATION_WORKFLOW.md), then `js/gridRenderer.js` and view-specific tests.
- Commands or CI: start with [Operations](../05%20Operations/OPERATIONS.md), then `package.json` and `.github/workflows/ci.yml`.

## Runtime Flows

- Load: `index.html` imports `js/main.js`, which initializes UI event handling.
- Calculate: form input -> `js/ui.js` validation/parsing -> `js/calculator.js` plus `js/data.js` -> in-memory calculation state -> result DOM.
- Render: UI-selected view -> `js/gridRenderer.js` -> `js/dateUtils.js` boundaries -> grid DOM and axis/ARIA coordination.
- Reset: UI clears in-memory state and DOM, restores default Weeks (Age), and returns focus.

## Artifact Boundaries

- Source: HTML, CSS, JavaScript, tests, configuration, and documentation.
- Generated local artifacts: `node_modules/` and `coverage/`; never hand-edit or commit.
- There is no tracked build output, backend artifact, or production deployment configuration.

## Maintenance Rule

- Update this map only when primary entrypoints, ownership boundaries, runtime flows, artifact boundaries, or major diagnostic routes change.

## Canonical References

- [Documentation index](../00%20Portal/MASTER_DOC_INDEX.md)
- [Architecture](../02%20Architecture/ARCHITECTURE.md)
- [Operations](../05%20Operations/OPERATIONS.md)
- [Change history](../07%20Execution/history/CHANGE_HISTORY.md)
