---
name: verify
description: Run Biome lint/format auto-fix and Vitest unit tests, then report results.
disable-model-invocation: true
allowed-tools: Bash
---

Run Biome lint/format auto-fix and Vitest unit tests, then report results.

Steps:
1. Run `pnpm check:write` to auto-fix all lint and format issues
2. Run `pnpm check` to verify no remaining lint/format issues
3. Run `pnpm test:run` to execute all unit tests once
4. Report a combined summary:
   - Lint/format: what was fixed, or any errors requiring manual attention
   - Tests: total passed / failed / skipped; for failures, show the test name, file path, and error message

If `pnpm check` exits with errors after auto-fix, show the specific errors and explain what manual changes are needed.
