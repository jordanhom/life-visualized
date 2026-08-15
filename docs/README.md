# Life Visualized Documentation

`docs/portal/` is the canonical documentation set for durable project
knowledge. The numbered layers provide predictable navigation while allowing
each project to use domain-appropriate names.

## Documentation Model

- `00 Portal`: entry points and the master documentation index.
- `01 Project`: mission, scope, principles, and major decisions.
- `02 Architecture`: boundaries, diagrams, lifecycle, and invariants.
- `03 Domain Model`: entities, terminology, schemas, and business rules.
- `04 Core Workflows`: primary application or processing behavior.
- `05 Operations`: testing, deployment, releases, troubleshooting, and runbooks.
- `06 Product`: user-visible behavior, UX defaults, and product strategy.
- `07 Execution`: roadmaps, planning, and issue-management conventions.
- `08 AI Context`: implementation and documentation navigation aids that do not duplicate `AGENTS.md` or the memory bank.

Projects may rename a layer while retaining its numeric prefix. Avoid creating
empty documents merely to fill the structure.

## Maintenance Rules

- Keep one canonical source for each topic.
- Cross-link instead of copying substantial content.
- Classify documents as `active`, `planned`, `historical`, or `complete`; visibly identify planned and historical material so it cannot be mistaken for shipped behavior.
- Update the relevant canonical document with behavior-changing work.
- Keep commands aligned with current code and configuration.
- Use the memory bank for current synthesis, not as a second portal.
- When moving a canonical document, update this portal's index and known inbound links.
- Keep a short pointer at an old path only when external or historical references require compatibility.
- Do not keep full duplicate documents as redirects.
- Prefer a descriptive name such as `AGENT_CONTEXT.md` for human-facing agent documentation.
- If an established human-facing note must remain named `AGENTS.md`, state prominently that it is non-authoritative and use qualified links to executable guidance.
- Keep a repository map at implementation seam level: primary entrypoints, ownership boundaries, runtime flows, artifacts, and major diagnostic routes—not every function.
- If the project uses pull requests, require an explicit documentation-impact declaration: either list updated canonical files or explain why no documentation changed.
