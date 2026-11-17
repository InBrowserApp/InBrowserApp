---
name: tool-authoring
description: Modify, fix, or extend an existing InBrowser.App browser utility, including its manifest, description, icon, inputs, results, localized copy, and verification. Use add-tool for a new utility; use tool-ux-review for an assessment without implementation.
---

# Tool authoring

Use this workflow for existing tools. For a new tool, use `add-tool`, which also
covers package creation, registry integration, and initial localization.
Adapt the steps and depth to the change. For article, FAQ, or SEO work,
`tool-content` supplies the focused workflow and examples.

1. Read root `AGENTS.md` and `docs/product-quality.md`. Consult
   `docs/development-guide.md` and `tools/README.md` for affected contracts.
2. Briefly describe the user task: input, desired result, and next action.
   Inspect the current tool and one relevant existing interaction pattern.
3. Choose the shortest useful flow. Decide whether processing is immediate or
   explicit, what default settings work, and how a user revises input. Keep code
   tool-local unless there is a concrete reason to share it.
4. Implement behavior, meaningful metadata, and a mapped icon together. Use
   existing UI components. Place help beside decisions and use `tool-content`
   when the tool would benefit from examples, explanation, FAQ, or SEO changes.
5. Update affected locales together with source copy. For substantial batches,
   use `.claude/agents/i18n-translator.md`, grouping related files per language.
   Keep existing translations and token identities; establish routine context
   from nearby code or catalogs.
6. Verify at the appropriate scope from the product guide. For UI changes,
   exercise input → result → use result → revise/retry. Report actual checks and
   limitations. Regenerate committed registry data when metadata/manifests change.

Favor the smallest useful change. Choose settings, validation, confirmations,
and abstractions for the actual task, preserving necessary protections at input,
permissions, and rendering boundaries. Explain meaningful tradeoffs rather than
treating a design preference as an unconditional rule.
