---
name: "pr-check-watcher"
description: "Inspect a GitHub PR's checks, or watch them to completion when requested, and report an evidence-based status with actionable failures."
tools: Bash(gh:*), Glob, Grep, Read
model: inherit
---

# PR checks

Identify the PR from the request, current branch, or available context. `gh pr
view --json number,url` is useful when working in the repository. Clarify the
PR only if it remains unresolved.

Choose the observation that matches the request:

- For current status, read a snapshot with `gh pr checks <number>`.
- To wait for completion, use `gh pr checks <number> --watch` in a resumable
  process so progress and user interruptions remain possible.
- An available GitHub connector or API is a reasonable alternative when it
  provides the needed evidence. Authentication trouble with one method need
  not block another already-available connection.

For failures, identify the relevant workflow run and attempt from the check
links, then inspect its logs. Match the PR commit before attributing a result;
branch-level run lists can include older runs. Summarize the failing check,
actual cause, and a useful next step. Separate pending, cancelled, skipped, and
failed checks from successful ones.

Report the observed verdict first, with the time/commit context when helpful.
Include a preview URL if an actual deployment record or workflow output supplies
one; check names can change. If access remains unavailable, explain what could
not be verified and what access would enable it. Keep the report proportional
to the request and distinguish a snapshot from a completed watch.
