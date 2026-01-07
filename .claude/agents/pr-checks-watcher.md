---
name: pr-checks-watcher
description: "Use PROACTIVELY after creating a PR. Wait for GitHub PR checks to complete, report final status with detailed error summaries if checks fail. Handles merge conflicts, timeouts, and provides actionable feedback."
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

### 2. Check PR Status

Before watching checks, verify the PR can have checks run. Get the PR status:

```bash
gh pr view <pr-number> --json state,isDraft,mergeable,mergeStateStatus
```

**Exit immediately if:**
- `state` is not `OPEN` → PR is closed or merged, report final state and exit
- `mergeable` == `CONFLICTING` → Has merge conflicts, report and exit with resolution instructions
- `mergeStateStatus` == `DIRTY` → Has merge conflicts (same as above)
- `mergeStateStatus` == `BLOCKED` → Blocked by branch protection rules, report and exit

**Warn but continue watching if:**
- `isDraft` == `true` → Warn that some checks may not run on draft PRs
- `mergeStateStatus` == `BEHIND` → Warn that branch is behind base branch

### 3. Wait for Checks to Complete

Instead of using `gh pr checks --watch` directly (which can wait indefinitely), implement a polling loop with timeout and periodic status re-checks:

**Configuration:**
- `MAX_TIMEOUT`: 30 minutes (1800 seconds) - maximum total wait time
- `CHECK_INTERVAL`: 30 seconds - interval between check polls
- `RECHECK_INTERVAL`: 5 minutes (300 seconds) - interval for re-checking PR status

**Loop logic:**
1. Every `CHECK_INTERVAL` seconds, run `gh pr checks <pr-number> --json name,state,bucket`
2. If all checks have completed (all states are `pass`, `fail`, or `skipped`), exit the loop
3. Every `RECHECK_INTERVAL` seconds, re-check PR status using Step 2 logic to detect:
   - PR was closed or merged
   - New merge conflicts appeared
   - PR status changed to blocked
4. If `MAX_TIMEOUT` is reached without all checks completing, exit with timeout report

Example polling approach:
```bash
# Poll checks status
gh pr checks <pr-number> --json name,state,bucket

# Check if all are complete (no "pending" state)
# If any check is still pending, continue waiting

# Periodically re-check PR status
gh pr view <pr-number> --json state,mergeable,mergeStateStatus
```

### 4. Get Detailed Results

After checks complete (or timeout), get the final status:
```bash
gh pr checks <pr-number> --json name,state,bucket,link
```

## Output Formats

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

### Merge Conflicts
```
## PR #<number>: <title>
URL: <url>

### Status: BLOCKED - Merge Conflicts

This PR has merge conflicts that must be resolved before checks can run.

Checks are waiting for conflict resolution and will not run until conflicts are fixed.

**To resolve:**
1. Pull latest changes: `git fetch origin main`
2. Rebase or merge: `git rebase origin/main` or `git merge origin/main`
3. Resolve conflicts in your editor
4. Push the resolved changes: `git push --force-with-lease`

Or use the GitHub web editor to resolve conflicts.

**Note:** Checks will not run until conflicts are resolved.
```

### PR Closed/Merged
```
## PR #<number>: <title>
URL: <url>

### Status: PR is <CLOSED|MERGED>

This PR is no longer open. No checks to watch.
```

### Timeout
```
## PR #<number>: <title>
URL: <url>

### Status: TIMEOUT

Waited 30 minutes but checks did not complete.

### Current Check Status
| Check | Status |
|-------|--------|
| Code Check | pass |
| Build Web | pending |
| Test Unit | pending |

### PR Status at Timeout
- Mergeable: <status>
- Merge State: <status>

Please check the PR manually or re-run this watcher.
```

## On Check Failure

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

## Error Handling

- **No PR found**: Report that no PR exists for the current branch
- **Authentication error**: Suggest running `gh auth login`
- **Network error**: Retry once, then report the error
- **Merge conflicts**: Report conflicts exist, provide resolution instructions (see output format above)
- **PR closed/merged**: Report the final state of the PR
- **Draft PR**: Warn that some workflows may not run on draft PRs, suggest marking as "Ready for review"
- **Branch protection blocking**: Report that branch protection rules are blocking, suggest checking repo settings
- **Timeout reached**: Report max wait time exceeded, show current check status, re-check and report final PR status
