# Agent Guidelines

## Development Environment

- Use the project's conda environment for Node.js and npm commands.
- Unless a different environment is explicitly requested, run checks through `base`:

```bash
conda run -n base npm run verify
conda run -n base npm run test:coverage
```

## Memory Bank

Use `.kilocode/rules/memory-bank/` as the persistent project context.

- Before substantial work, read `brief.md`, `activeContext.md`, and the files
  relevant to the task.
- Use `architecture.md`, `context.md`, `product.md`, and `tech.md` for durable
  project decisions and constraints.
- Use `tests-plans.md` and `tests-plans-by-module.md` when changing behavior or
  test coverage.
- Update `activeContext.md` and `progress.md` when completed work changes the
  current state, next steps, test baseline, or known risks.
- Update the durable topic files only when their documented facts or decisions
  change. Keep existing headings and formatting, and avoid duplicating transient
  details across every file.
- Keep `docs/` and the memory bank consistent when a change affects both user or
  developer documentation and persistent agent context.

## Issue-First Work

- Before a nontrivial behavior change, feature, or bug fix, create or confirm a
  GitHub issue.
- Record the current behavior, expected behavior, and objective success criteria.
- Ask for clarification when product intent cannot be determined from the issue,
  documentation, memory bank, tests, or current application behavior.
- Keep future work in GitHub issues rather than leaving actionable TODOs only in
  chat, documentation, or code comments.
- Link the pull request with `Fixes #<issue>` when the merge should close the
  issue. Use a non-closing reference for partial work.

## Worktree Safety

- Inspect the branch and working tree before editing.
- Never discard or overwrite changes that are outside the current task.
- Stop and ask how to proceed if unexpected modifications appear during the work.
- Keep changes minimal and focused. Do not include opportunistic refactors,
  formatting churn, or unrelated dependency updates.
- Stage explicit paths when the working tree contains mixed scopes. Use
  `git add -A` only when the entire working tree is confirmed to belong to the
  current change.
- Avoid destructive Git commands. Never use `git reset --hard` or restore user
  changes unless explicitly requested.

## Date And Time Behavior

- Treat a birthdate as a timezone-free calendar date, not as a timestamp.
- State explicitly whether a calculation uses the user's local calendar, UTC, or
  another named timezone. Do not mix those models implicitly.
- User-facing concepts such as today, birthdays, and the current period should
  follow the user's local timezone unless the documented behavior says otherwise.
- Keep generated date boundaries deterministic across browser timezones.
- Test boundary conditions such as local midnight, year transitions, leap days,
  month ends, ISO 52/53-week years, and timezones on both sides of UTC.
- For timezone-sensitive changes, cover representative zones such as
  `America/Los_Angeles`, `UTC`, `Europe/London`, `Asia/Tokyo`, and
  `Pacific/Auckland` when the test environment supports them.

## Test Value

- Add tests for changed behavior and every fixed regression.
- Prioritize observable behavior, boundaries, failure paths, accessibility, and
  integration between modules.
- Avoid duplicate tests, implementation-detail assertions, and assertions that
  cannot fail for a meaningful product regression.
- Do not add low-value tests solely to increase a coverage percentage.
- Use coverage to find untested risk, not as the objective. Record meaningful
  baseline changes in the pull request and memory bank.
- Remove or consolidate tests when they no longer protect relevant behavior.

## Behavior Verification

- Run the most focused tests while implementing, then run the full verification
  commands before committing.
- Browser-check changes that affect rendering, forms, focus, keyboard behavior,
  ARIA state, responsive layout, or timezone-sensitive output.
- Verify both desktop and mobile behavior for layout changes.
- Record important manual scenarios and observed results in the pull request.
- Do not substitute visual inspection for automated regression coverage when the
  behavior can be tested reliably.

## Dependency Updates

- Review the Dependabot alert, advisory, affected dependency path, vulnerable
  range, and first patched version before upgrading.
- Perform npm installs and upgrades inside the conda environment.
- Prefer the smallest targeted safe upgrade. Avoid unrelated package or lockfile
  churn.
- Review `package.json` and `package-lock.json` diffs for unexpected transitive
  changes.
- Run `conda run -n base npm audit`, full verification, and coverage after the
  upgrade.
- Document any alert that remains open, accepted risk, breaking change, or
  follow-up work.

## Documentation Ownership

- Keep `README.md` focused on the user-facing overview, setup, and common usage.
- Use `docs/` for detailed behavior, implementation references, and completed
  change summaries.
- Use the memory bank for persistent project and agent context.
- Use GitHub issues for defects, features, decisions requiring follow-up, and
  unresolved work.
- Keep source comments limited to non-obvious implementation intent. Do not use
  comments as a substitute for tests or maintained documentation.
- Update each source of truth only when its responsibility is affected.

## Solo Trunk Workflow

`main` is the trunk and should remain releasable. Use short-lived branches for code,
behavior, dependency, test, CI, and substantive documentation changes.

1. Start from an up-to-date, clean `main`.

```bash
git switch main
git fetch origin
git merge --ff-only origin/main
```

2. Create a focused branch before editing. Codex-created branches use the
   `codex/` prefix.

```bash
git switch -c codex/<short-description>
```

3. Keep the branch limited to one cohesive change. Do not mix unrelated cleanup
   into the same commit or pull request.
4. Run the relevant checks in the conda environment before committing. For most
   changes, run both commands listed under Development Environment.
5. Review the staged diff, then create a clear conventional commit.

```bash
git diff --check
git diff --cached
git commit -m "fix(scope): concise behavior change"
```

6. Push the branch and open a ready pull request. Include the intent, root cause
   for fixes, user impact, validation performed, and `Fixes #<issue>` when
   applicable.
7. Complete the pull request self-review checklist. External approval is not
   required for this solo project.
8. Merge only after required CI checks pass.
9. Prefer rebase merge for a branch with clean, meaningful commits. Prefer squash
   merge when the branch contains exploratory or fixup commits.
10. After merging, return to `main`, fast-forward it, and delete the local and
   remote feature branches.

```bash
git switch main
git fetch origin
git merge --ff-only origin/main
git branch -d codex/<short-description>
git push origin --delete codex/<short-description>
```

Direct commits to `main` are reserved for negligible-risk typo or formatting
corrections. When uncertain, use a branch and pull request.

## Pull Request Self-Review

- Review the complete diff against `main`, not only individual edited files.
- Confirm the change matches the issue and does not include unrelated work.
- Check for generated files, accidental formatting changes, debug output, stale
  comments, and unnecessary lockfile churn.
- Confirm tests exercise the success criteria and protect the regression.
- Confirm user-facing behavior, accessibility, documentation, and memory-bank
  entries agree with the implementation.
- Confirm local verification and required GitHub Actions checks pass before
  merging.

## Definition Of Done

A change is complete only when all applicable items are satisfied:

- The implementation meets the issue success criteria.
- Relevant unit, regression, failure-path, and accessibility tests pass.
- Required browser scenarios have been verified.
- Conda-based verification and coverage complete successfully.
- Documentation and memory-bank records reflect the merged behavior.
- The pull request contains the validation evidence and correct issue link.
- Required CI checks pass and the pull request is merged.
- The issue is closed or updated with the remaining scope.
- Local `main` is synchronized and merged feature branches are deleted.

## Releases

- Keep release preparation separate from feature and bug-fix branches.
- Release only from a clean `main` after required CI passes.
- Confirm the package version, release notes, Git tag, and published release use
  the same version.
- Summarize user-visible changes, fixes, dependency updates, known limitations,
  and verification in the release notes.
- Do not publish or move a release tag without explicit user approval.
