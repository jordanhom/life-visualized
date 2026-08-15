# Active Context

Last updated: 2026-08-15 (America/Los_Angeles)

## Current State And Focus

- Portable `docs/portal/` and root `memory-bank/` context have been initialized and locally verified against current code, configuration, tests, README, focused docs, and tracked history.
- `AGENTS.md` is the active repository-wide execution guide. `.kilocode/rules/memory-bank/` is legacy history only.
- Current product behavior is the four-view static SPA with browser-local current-date semantics and deterministic UTC-encoded boundaries.

## Next Actions

- Live product priorities are not established here; verify GitHub issues before selecting new work.
- Deliver the migration through the repository's branch and pull-request workflow when requested.

## Risks And Constraints

- Branch, issue, CI, release, and test-count claims are volatile and must be verified at their primary sources.
- Do not duplicate durable facts across the portal, focused module docs, and memory bank.
- Preserve privacy, accessibility, sensitive framing, and the date-only contract.

## Active Decisions And Revisit Gates

- Native date helpers remain the current architecture. Revisit only when requirements justify named-timezone/history support or a documented module-delivery strategy; issue #40 records the investigation.
- Detailed module docs remain canonical for module contracts; portal documents own cross-cutting durable context.

## Relevant Canonical References

- [Documentation index](../docs/portal/00%20Portal/MASTER_DOC_INDEX.md)
- [Repository map](../docs/portal/08%20AI%20Context/REPO_MAP.md)
- [Agent guide](../AGENTS.md)
