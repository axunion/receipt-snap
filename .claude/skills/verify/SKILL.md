---
name: verify
description: Run Biome lint/format auto-fix and Vitest unit tests, then report results.
disable-model-invocation: true
allowed-tools: Bash
---

Run Biome lint/format auto-fix, Vitest unit tests, and production build (includes type-check), then report results.

Steps:
1. Run `pnpm check:write` to auto-fix all lint and format issues
2. Run `pnpm test` to execute all unit tests once
3. Run `pnpm build` to type-check and build for production
4. Report a combined summary:
   - Lint/format: what was fixed, or any errors requiring manual attention
   - Tests: total passed / failed / skipped; for failures, show the test name, file path, and error message
   - Build: success or any type/build errors requiring manual attention

If any step exits with errors, show the specific errors and explain what manual changes are needed.
