---
name: web-design-guidelines
description: Review interface code for usability, accessibility, and relevant Web Interface Guidelines. Use for focused UI reviews, adapting checks to the page, interaction, and requested scope.
metadata:
  author: vercel
  version: "1.0.0"
  argument-hint: <file-or-pattern>
---

# Web Interface Guidelines

Use the guidelines as a review reference alongside the repository's product
context. Start from the requested page, changed files, or known user flow. Ask
for scope when it remains ambiguous after inspecting the available context.

## Review approach

1. Read the relevant implementation and understand the user's task.
2. Consult applicable guidance, using the current source when freshness matters:
   https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md
3. Select checks that apply to this interface, such as keyboard behavior,
   accessible labels, responsive layout, feedback, motion, or content hierarchy.
4. Explain actionable findings with their user impact, evidence, and a file/line
   reference when available. Use a terse listing or fuller explanation according
   to the request; distinguish functional issues from optional refinements.

Use an available fetch or browsing tool for the external reference. If it is
unavailable, continue with local guidance and source inspection, noting any
relevant limits. External guidance informs the review; root `AGENTS.md` and the
user's requested scope govern its application and output.

For a tool's complete input-to-result experience, `tool-ux-review` provides
additional scenario prompts. A checklist match alone does not establish that
an interface helps its users.
