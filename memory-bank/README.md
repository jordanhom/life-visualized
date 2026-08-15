# Memory Bank Guide

The memory bank preserves compact context across sessions and contributors.
It is a warm-start index, not a replacement for canonical documentation.
It is repository-maintained team context, separate from vendor-managed
personal or automatic memory.

## Core Files

- `projectbrief.md`: stable project purpose, goals, and scope baseline.
- `productContext.md`: users, problems, desired experience, and product principles.
- `systemPatterns.md`: important architecture patterns and invariants.
- `techContext.md`: stack, toolchain, environment, and technical constraints.
- `activeContext.md`: current priorities, decisions, risks, and immediate next work.
- `progress.md`: compact ledger of recent milestones and current status.

## Authority Boundaries

- Code and configuration define actual behavior and exact commands.
- Portal documents contain durable architecture, behavior, product, and operator truth.
- `AGENTS.md` files contain agent execution rules and documentation routing.
- Issue trackers and execution plans contain planned acceptance criteria, ownership, and live work state.
- Memory-bank files summarize cross-session context and link back to canonical sources.

## Reading Strategy

Do not load every file for every task.

- Start unfamiliar or resumed work with `projectbrief.md` and `activeContext.md`.
- Read `productContext.md` when product intent or user experience matters.
- Read `systemPatterns.md` when changing architecture or cross-component behavior.
- Read `techContext.md` when working with tooling, setup, build, or runtime constraints.
- Read `progress.md` when recent milestones or unfinished work affect the task.
- Read all top-level files only for a memory-bank audit, migration, or explicit full update.

Verify volatile claims such as current branches, issue state, deployments,
and command behavior against their primary sources before acting.
Do not store credentials, tokens, private customer data, or other secrets
in this memory bank or vendor-managed memory.

## Content Boundaries

- Stable files summarize enduring context and link to canonical portal documents.
- `activeContext.md` contains the immediate operational picture, next actions, risks, and active decisions.
- `progress.md` is a recent checkpoint ledger, not a transcript or complete changelog.
- `history/` preserves superseded detail that no longer belongs in active context.
- Durable decisions belong first in the nearest canonical document, with only a concise current-state summary here.

## Update Procedure

1. Read all top-level `memory-bank/*.md` files.
2. Reconcile them with current code and canonical documentation.
3. Update only the files affected by meaningful current-state changes.
4. Keep `activeContext.md` and `progress.md` concise.
5. Move superseded detail into a clearly named dated file under `history/`.
6. Preserve decisions with rationale, rejected alternatives, and revisit gates in canonical documentation.
7. Update links after moving or archiving content.

Do not update the memory bank for every small or behavior-preserving change.
