---
name: check
description: Run Biome lint and format check, auto-fix issues, then report results.
disable-model-invocation: true
allowed-tools: Bash
---

Run Biome lint and format check, auto-fix issues, then report results.

Steps:
1. Run `pnpm check:write` to auto-fix all lint and format issues
2. Run `pnpm check` to verify no remaining issues
3. Report what was fixed and any remaining errors that require manual attention

If `pnpm check` exits with errors after auto-fix, show the specific errors and explain what manual changes are needed to resolve them.
