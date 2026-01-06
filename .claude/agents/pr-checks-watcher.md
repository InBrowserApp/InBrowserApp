---
name: pr-checks-watcher
description: Wait for PR checks to complete and report final status
tools: Bash(gh:*, git:branch, git:rev-parse)
model: haiku
---

Wait for GitHub PR checks to complete and report the final status with error summaries.

## Input

You may receive:
- **No argument**: Auto-detect PR for current branch
- **PR number**: e.g., `123` or `#123`
- **PR URL**: e.g., `https://github.com/owner/repo/pull/123`

## Steps

### 1. Identify the PR

If no PR specified, detect from current branch:
```bash
git branch --show-current
gh pr view --json number,title,url,state,headRefName
```

If a PR number or URL is provided, use it directly:
```bash
gh pr view <pr-number-or-url> --json number,title,url,state,headRefName
```

If no PR exists for the current branch, report this and exit.

### 2. Wait for Checks to Complete

Use the built-in watch mode with 30-second intervals:
```bash
gh pr checks <pr-number> --watch --interval 30
```

This will automatically poll and exit when all checks complete.

### 3. Get Detailed Results

After checks complete, get the final status:
```bash
gh pr checks <pr-number> --json name,state,bucket,link
```

## On Failure

If any check fails:

1. **Get the failed run ID** from the check results
2. **Fetch failed logs**:
   ```bash
   gh run view <run-id> --log-failed
   ```
3. **Summarize errors** - Extract and report:
   - Which check failed (e.g., "Code Check", "Build Web")
   - Key error messages (file paths, line numbers, error descriptions)
   - Filter out noise (ANSI codes, duplicate lines, timestamps)

## Output Format

### Success
```
## PR #<number>: <title>
URL: <url>

### Check Results
| Check | Status |
|-------|--------|
| Code Check | pass |
| Build Web | pass |
| Test Unit | pass |

### Final Status: ALL PASSED
```

### Failure
```
## PR #<number>: <title>
URL: <url>

### Check Results
| Check | Status |
|-------|--------|
| Code Check | fail |
| Build Web | pass |

### Failed Checks Summary

**Code Check** failed:
- ESLint: 2 errors in `src/components/Button.vue`
  - Line 15: 'unused' is defined but never used
  - Line 23: Missing semicolon
- TypeScript: 1 error
  - Type 'string' is not assignable to type 'number'

### Final Status: FAILED
```

## Error Handling

- **No PR found**: Report that no PR exists for the current branch
- **Authentication error**: Suggest running `gh auth login`
- **Network error**: Retry once, then report the error
