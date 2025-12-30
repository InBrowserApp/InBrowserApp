---
description: Run all checks and tests before committing
allowed-tools: Bash(pnpm:*), Read
---

Help me run all checks and tests before committing:

## Steps

1. **Lint check**: Run `pnpm run lint-check`
   - If it fails, run `pnpm run lint` to auto-fix, then re-run `lint-check`

2. **Format check**: Run `pnpm run format-check`
   - If it fails, run `pnpm run format` to auto-fix, then re-run `format-check`

3. **Type check**: Run `pnpm run type-check`

4. **Unit tests**: Run `pnpm run test:unit --run --silent passed-only --changed HEAD~1`

5. **Build**: Run `pnpm run build` to verify the build works

## On Failure

If any step fails (after auto-fix attempts):
- Analyze the error output
- Suggest fixes or automatically fix the issues if possible
- Re-run the failed step to verify the fix

Report the final status of all checks.
