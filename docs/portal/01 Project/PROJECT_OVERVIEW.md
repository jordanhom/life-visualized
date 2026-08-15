# Life Visualized — Project Overview

**Document status:** Active

## Purpose

Life Visualized is a privacy-preserving reflection tool that turns a birthdate and biological sex into an estimated lifespan visualization based on static US CDC 2021 period life-table data. It communicates scale and encourages reflection; it is not an individual prediction.

## Scope And Boundaries

- Static, browser-only single-page application with no accounts, backend, telemetry, or server persistence.
- Four maintained views: Weeks (Age), Weeks (Calendar), Months, and Years.
- Birthdates are timezone-free calendar dates. Current-state semantics follow the browser's local calendar; generated boundaries use deterministic UTC-encoded dates.
- Runtime scope excludes fetching live actuarial data, storing user input, and adding a production build pipeline.

## Priorities

- Preserve a clear, sensitive reflective experience and statistical disclaimer.
- Keep user data in the browser and maintain accessible, responsive interaction.
- Prefer a small static architecture and evidence-backed changes over speculative complexity.

## Canonical References

- [Product requirements](../06%20Product/PRODUCT_REQUIREMENTS.md)
- [Architecture](../02%20Architecture/ARCHITECTURE.md)
- [README](../../../README.md)
