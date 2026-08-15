# Life Visualized — Execution Plan

**Document status:** Active

This document defines execution policy, not a live roadmap. Current priority and issue status must be verified in GitHub before work begins.

## Current Priorities

- Not established in repository-owned canonical documentation.

## Milestones And Sequencing

- The MVP and four-view experience are shipped according to `README.md`.
- Future features and defects are managed as focused GitHub issues and short-lived branches; no additional milestone sequence is established here.

## Dependencies And Risks

- Preserve privacy, the date-only contract, accessibility, and static no-build architecture.
- Live issue, branch, CI, and release state is volatile and must be verified at its primary source.

## Work Management

- Confirm an issue before nontrivial behavior, feature, or bug work.
- Use `codex/<short-description>` branches from current `main`, one cohesive scope per pull request, objective verification evidence, and closing issue syntax only for complete work.
- Merge only after required CI passes, then synchronize local `main` and safely remove merged branches.

## Canonical References

- [Agent working guide](../../../AGENTS.md)
- [Operations](../05%20Operations/OPERATIONS.md)
- [GitHub issues](https://github.com/jordanhom/life-visualized/issues)
