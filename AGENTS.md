# Agent Working Guide

## Scope And Precedence

- Treat Life Visualized as a privacy-preserving, client-side reflection tool that visualizes an estimated lifespan from a timezone-free birthdate and static actuarial data.
- Root `AGENTS.md` applies repository-wide. No nested `AGENTS.md` files currently add local rules.
- Higher-priority platform and user instructions override this guide.
- Use current code, configuration, tests, and `package.json` as evidence for implemented behavior and exact commands.
- Read the smallest relevant set of files before editing and preserve unrelated working-tree changes.
- Do not invent commands, architecture, issue state, product commitments, or deployment behavior.

## Context And Documentation

- `docs/portal/` is the canonical durable project context. Enter through `docs/portal/00 Portal/MASTER_DOC_INDEX.md` and use `docs/portal/08 AI Context/REPO_MAP.md` for maintained implementation entrypoints and ownership boundaries.
- Root `memory-bank/` is the concise cross-session handoff. Treat volatile branch, issue, verification, and next-step claims as snapshots and verify them before acting.
- Existing focused `docs/*.md` files remain canonical module references and historical change records as linked from the portal.
- Legacy Kilo Code context was removed after migration and remains available through Git history only. Do not recreate or use it as current execution guidance.
- Do not duplicate the same fact across the active memory bank and portal. Link to the canonical destination instead.
- Keep the repository map at module/seam level—primary entrypoints, runtime flows, artifact boundaries, and diagnostic routes—not a catalog of every function.

## Architecture And Product Invariants

- The application is a static, browser-only single page built with HTML, CSS, and vanilla JavaScript ES modules.
- There is no backend, account system, server persistence, runtime package dependency, bundling step, or production build command.
- `index.html` provides the page structure; `js/main.js` boots `js/ui.js`; the UI coordinates `js/calculator.js`, `js/data.js`, and `js/gridRenderer.js`; `js/dateUtils.js` owns shared calendar behavior.
- User data stays in the browser. Do not add collection, transmission, telemetry, or persistence of birthdate/sex data without an explicit product and privacy decision.
- The lifespan result is a reflective statistical estimate based on static actuarial data, not an individual prediction. Preserve the user-facing disclaimer and sensitive tone.
- The four maintained views are Weeks (Age), Weeks (Calendar), Months, and Years. Preserve their shared state, progressive reveal, reset behavior, accessibility semantics, and responsive behavior unless the task intentionally changes them.

## Date And Time Contract

- Treat a birthdate as a timezone-free calendar date, never as an instant or implicit local timestamp.
- User-facing concepts such as today, age rollover, birthdays, and the current period follow the browser's local calendar.
- Encode accepted calendar components at UTC midnight before deterministic arithmetic and use the shared helpers in `js/dateUtils.js`.
- Do not mix local and UTC models implicitly or reintroduce CDN-global date-library behavior.
- Keep generated date boundaries deterministic across browser timezones.
- Preserve the documented February 29 anniversary rule and ISO 52/53-week behavior.
- For timezone-sensitive changes, test local midnight, UTC rollover, year/month ends, leap days, DST where relevant, and representative zones including `America/Los_Angeles`, `UTC`, `Europe/London`, `Asia/Tokyo`, and `Pacific/Auckland`.
- Use `docs/dateUtils.md` for the current date model, tradeoff, and revisit criteria.

## Toolchain And Commands

- Use the project's Conda environment for Node.js and npm work. Unless the user specifies another environment, use `base` when the active shell does not already match it.
- CI verifies supported Node.js versions 20.x and 22.x. Check the active runtime before dependency, lockfile, or CI-sensitive work.
- Reproducible setup: `conda run -n base npm ci`.
- Canonical aggregate verification: `conda run -n base npm run verify`.
- Coverage: `conda run -n base npm run test:coverage`.
- Focused commands:
  - lint: `conda run -n base npm run lint`
  - typecheck: `conda run -n base npm run typecheck`
  - non-watch tests: `conda run -n base npm run test:run`
- `npm test` starts Vitest watch mode; do not use it for a one-shot verification claim.
- There is no build command. Serve the repository root over HTTP for browser checks, for example `python -m http.server`, because native ES modules should not be tested through `file://`.
- Treat `node_modules/` and `coverage/` as generated local artifacts; do not hand-edit or commit them.

## Verification And Manual Acceptance

- Select the smallest deterministic checks that cover the changed behavior, then run the aggregate verification before commit for substantive changes.
- Add tests for changed behavior and every fixed regression. Prioritize observable behavior, boundaries, failure paths, accessibility, and module integration.
- Avoid duplicate tests, implementation-detail assertions, and tests added solely to raise a coverage percentage.
- Use coverage to locate untested risk, not as the objective. Record a meaningful baseline change when it affects review or future planning.
- Browser-check changes affecting rendering, forms, focus, keyboard behavior, ARIA state, responsive layout, or timezone-sensitive output.
- Verify desktop and mobile behavior for layout changes.
- Record manual scenarios and observed results. Bind manual acceptance to the exact working-tree or commit state tested; material edits invalidate that evidence.
- Do not substitute visual inspection for reliable automated regression coverage.
- Report commands actually run, pass/fail results, and relevant checks that were skipped.

## Documentation And Durable Guidance

- Keep `README.md` focused on product overview, setup, common use, current technology, and contribution expectations.
- Put durable architecture, domain, workflow, operations, and product truth in the nearest canonical portal document and keep the master index current. Keep detailed module contracts in the focused `docs/*.md` files linked from the portal.
- Classify portal documents accurately as `active`, `planned`, `historical`, or `complete`; never present planned or historical behavior as shipped.
- Use GitHub issues and execution plans for planned acceptance criteria, work ownership, and unresolved follow-up.
- Keep source comments limited to non-obvious implementation intent; comments are not substitutes for tests or maintained documentation.
- Before commit, assess whether behavior, commands, paths, artifacts, runtime boundaries, operator workflow, or user-visible defaults changed. Update canonical documentation when they did, or record a concise no-impact rationale in the pull request.
- After substantive design, architecture, or workflow work, audit whether durable guidance changed. A no-change result is valid.
- Admit an `AGENTS.md` rule only when it is normative, applies to repeated future work, is likely to outlive the current task, and prevents a meaningful execution or review error. Prefer code, tests, configuration, or CI when they can enforce it.
- Route agent execution constraints to `AGENTS.md`, durable behavior and decisions to documentation, planned acceptance to issues, and ephemeral discussion history nowhere.

## Memory-Bank Maintenance

- When explicitly asked to audit or comprehensively update the root memory bank, review all six top-level files and reconcile them with current code, canonical docs, and verified issue state.
- Keep `activeContext.md` focused on current state, next actions, risks, and active decisions with revisit gates.
- Keep `progress.md` as a compact ledger of outcomes and validation evidence, not a transcript or complete changelog.
- Move superseded narrative to dated files under `memory-bank/history/` and link rather than duplicate canonical documentation.
- Do not update memory for pure refactors with no behavior, workflow, operator, or current-state impact.
- Never store credentials, tokens, private user information, or secrets in repository-maintained or vendor-managed memory.

## Change Discipline And Worktree Safety

- Keep work limited to the current issue or explicit user scope. Separate unrelated cleanup and future work.
- Prefer the smallest coherent change; avoid speculative abstractions, formatting churn, and unrelated dependency updates.
- Do not hand-edit generated artifacts or build/test output.
- Inspect branch and status before editing, staging, committing, switching branches, or rewriting history.
- Never discard or overwrite changes outside the task. Stop for direction when an overlapping unexpected modification cannot be safely preserved.
- Stage explicit paths for mixed working trees. Use `git add -A` only when every change is confirmed in scope.
- Avoid destructive Git commands and history rewrites unless explicitly authorized.
- Before declaring a task safe to archive, ensure valuable changes are preserved on a named branch or commit, or report what remains unpreserved.

## Issue, Branch, And Pull-Request Workflow

- Before a nontrivial behavior change, feature, or bug fix, create or confirm a GitHub issue with current behavior, expected behavior, and objective success criteria.
- Ask for clarification only when product intent cannot be determined from the issue, current behavior, code, tests, or maintained documentation.
- Keep actionable future work in GitHub issues rather than only in chat, documentation, comments, or TODOs.
- `main` is the releasable trunk. Start substantive code, behavior, dependency, CI, test, or documentation changes from an up-to-date clean `main` on a short-lived branch.
- Codex-created branches use `codex/<short-description>` unless the user or repository workflow specifies another name.
- Direct commits to `main` remain limited to explicitly approved negligible-risk typo or formatting corrections; when uncertain, use a branch and pull request.
- Keep one cohesive scope per branch and pull request.
- Link closing work with `Fixes #<issue>`; use non-closing references for partial work.
- Prepare pull-request summaries from the actual diff and verification. Include user impact, root cause for fixes, documentation impact or no-impact rationale, and manual evidence where applicable.
- Review the complete diff against the target branch, not only individual files.
- Do not claim CI, maintainer acceptance, publication, or merge state without verifying it at the relevant source.
- Merge only after required CI passes. Preserve the existing solo-project choice between rebase merge for clean commits and squash merge for exploratory/fixup history.
- After merge, synchronize local `main` and remove merged branches when safe.

## Dependency Updates

- Review the advisory, affected dependency path, vulnerable range, and first patched version before upgrading.
- Perform installs and upgrades inside the Conda environment.
- Prefer the smallest targeted safe upgrade and inspect both manifest and lockfile diffs for unrelated churn.
- Run `conda run -n base npm audit`, aggregate verification, and coverage after dependency changes.
- Document open alerts, accepted risk, breaking changes, and required follow-up.

## Releases

- Keep release preparation separate from feature and bug-fix branches.
- Release only from a clean `main` after required CI passes.
- Confirm the package version, release notes, Git tag, and published release use the same version.
- Summarize user-visible changes, fixes, dependency updates, known limitations, and verification in release notes.
- Do not publish, move, or delete a release tag without explicit user approval.

## Definition Of Done

- The implementation meets the issue success criteria and preserves the architecture/product invariants above.
- Relevant regression, boundary, failure-path, accessibility, and integration tests pass.
- Required browser scenarios are verified against the final working state.
- Aggregate verification passes; coverage is run when required by the task or workflow.
- Documentation and initialized memory reflect changed behavior and current state without duplication.
- The pull request records validation evidence, documentation impact, and the correct issue relationship.
- Required CI passes, and issue/branch/release state is accurately reported.
