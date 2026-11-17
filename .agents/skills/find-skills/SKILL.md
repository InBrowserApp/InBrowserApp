---
name: find-skills
description: Find or evaluate reusable agent skills when the user requests skill discovery or a task would benefit from a capability missing from the installed skills. Consider task fit, instructions, and maintenance rather than popularity thresholds.
---

# Find skills

Start with the user's goal and the skills already available in this repository.
A new skill is useful when it adds relevant knowledge or a reusable workflow.
Ordinary implementation work can proceed directly when existing capabilities
are sufficient.

## Discover and evaluate

Search by the capability needed. The [skills directory](https://skills.sh/), a
known source repository, or a CLI search can each be a useful starting point:

```bash
pnpm dlx skills find <query>
```

Read a candidate's instructions and relevant references before recommending it.
Consider task fit, framework/version assumptions, maintainability, source
provenance, required capabilities, and overlap with existing skills. Install
counts and repository stars can provide context, but are not admission cutoffs
or proof of quality. A small, focused skill may fit better than a popular one.

Present the relevant options with their source, practical benefit, and material
tradeoffs. Report popularity or freshness data only when actually checked.
Use the amount of research needed to make the choice meaningful.

## Integrate when requested

An installation request authorizes the routine steps to install the chosen
skill in the intended scope. Prefer repository-local installation for a project
workflow; use user-level installation when that is the requested destination.
Inspect the current CLI help and affected paths before selecting flags.

```bash
pnpm dlx skills add <owner/repo@skill>
pnpm dlx skills --help
```

Preserve existing local customizations. Clarify only unresolved choices that
would materially change scope or replace user work. Read the installed skill
and adapt its use to root `AGENTS.md`, including contextual design judgment.

If no candidate fits, explain the gap and continue already-authorized work
using available capabilities. Creating a focused local skill may be worthwhile
for a recurring need; a failed search need not become a new approval step.
