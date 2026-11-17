# Product quality

The unit of quality is a completed user task, not a component count or a score.
For each tool, be able to explain: **who brings what input, wants what result,
and will do what with that result?** Review the shortest useful path first.

Apply the design guidance with judgment. Different tools can need different
content, layouts, interaction patterns, and review depth. Skills offer reusable
approaches; their outlines are not mandatory templates. Actual package/locale
contracts and CI requirements are identified separately from design defaults.

For a design decision, consider the user's intent, frequency of use, cost of a
mistake, available space, and existing conventions. Pick the approach that best
serves those factors. Departing from a suggested pattern is ordinary design
work, not an exception process; explain a tradeoff when it materially affects
the result. Automated checks should verify concrete contracts or regressions,
not promote a preferred layout, article length, or control choice into a gate.

## Ownership and layers

| Layer                  | Responsibility                                | Source of truth                                                                   |
| ---------------------- | --------------------------------------------- | --------------------------------------------------------------------------------- |
| Repository entrypoints | Defaults and routing to relevant instructions | `AGENTS.md`; `CLAUDE.md` imports it                                               |
| Product policy         | User outcomes and review criteria             | This document                                                                     |
| Task skills            | Steps to implement or review a change         | `.agents/skills/add-tool/`, `tool-authoring/`, `tool-content/`, `tool-ux-review/` |
| Implementation         | Shared UI, tool-local behavior, contracts     | `packages/ui`, `tools/<slug>`, `packages/tool-sdk`                                |
| Quality gates          | Deterministic checks with actionable failures | Existing validators, tests, lint, and CI                                          |

Keep each rule with its owner. Reuse validators rather than adding a second
schema in a quality script. Skills link to policy instead of copying it.
Favor a small set of reusable workflows and routine implementation decisions
over extra orchestration infrastructure or per-step approval.

## A useful tool description

Distinguish three kinds of help:

- `meta/<lang>.json`: a concise description used in discovery, SEO, and the
  visible page heading. Say what input becomes what output. Mention an important
  supported action or limitation when it changes the user's choice.
- `messages/<lang>.json`: labels and contextual help beside the relevant control.
  Explain a choice where it is made; do not repeat the heading everywhere.
- `sections/intro/<lang>.md`: optional deeper explanation, examples, or format
  details below the working area. Add this when it resolves an actual question.

For example: "Convert JSON to YAML. Paste JSON or import a file; preview, copy,
and download." Avoid generic "powerful, easy-to-use" copy. Describe capabilities
that exist. Verify local processing/network behavior before promising privacy.
Let the tool and its readers determine article depth, FAQ coverage, and section
structure. An existing description still needs semantic review. Use
`.agents/skills/tool-content/SKILL.md` for the detailed content and SEO workflow,
including examples, result interpretation, links, and localized integration.

## Review the user's sequence of actions

1. **Arrive.** The title and short description establish purpose. The primary
   input or action is visible without scrolling through introductory content.
2. **Provide input.** Support the natural input for this task: paste for text,
   file selection for documents, and drop/paste where useful and supported.
   Show expected format or a usable example. Keep sample data distinguishable
   from user data and avoid replacing entered content without intent.
3. **Get a result.** Cheap, predictable transforms can update as input changes.
   Expensive conversion, permission access, or an operation with side effects
   gets an explicit action. Long work communicates activity; use real progress
   only when measurable. Add cancellation when users can meaningfully stop work.
4. **Use the result.** Put copy/download beside the output with a useful filename
   and format. A viewer's primary result can be reading or inspecting, with no
   artificial export step. Confirm clipboard success only after it succeeds.
5. **Revise or recover.** Retain input and settings when processing fails. Explain
   what to fix near the relevant control. Let the user replace a file, revise
   text, or retry without starting over. Outdated results must not look current.

Use sensible defaults and make settings as prominent as their importance and
frequency warrant. Keep primary actions easy to find. A converter, viewer,
generator, validator, or recorder can each benefit from a different pattern;
these categories are examples, not an exhaustive set of layouts.

## Proportionate safeguards

- Empty input is a normal starting state. Incomplete text while typing is not
  automatically an urgent error; use calm feedback and validate at a useful time.
- Use disabled states when an action is unavailable or conflicting work needs
  to be prevented, with an understandable reason. Keep unrelated actions usable
  where possible; some operations may genuinely require exclusive interaction.
- Ordinary local copy, download, conversion, or retry does not need a confirmation
  dialog. Ask for confirmation when an action would cause meaningful, hard to
  recover loss; prefer an undo path where practical.
- Check file/parser input and real platform limitations. File extension or MIME
  alone does not establish content validity. Avoid arbitrary size caps or broad
  unsupported-browser screens when the needed operation is available.
- Handle errors where the UI can recover or explain them, preserving the
  distinction between a valid empty result and a failed operation. Add internal
  guards when a real runtime boundary warrants them rather than repeating checks
  already established by types or upstream validation.
- Keep necessary HTML sanitization, worker isolation, permissions, and resource
  cleanup. Minimize friction without removing protections at trust boundaries.
- Explain network use, permissions, or conversion limitations at the point where
  they affect a choice. Avoid permanent generic warning banners.

## Icons, accessibility, and layout

- Each manifest icon must exist in the UI's `toolIconMap`. The generic runtime
  fallback is resilience; it must not conceal a missing product icon in CI.
  Choose a recognizable task/category icon; uniqueness per tool is unnecessary.
- Use `@workspace/ui/icons`. Decorative icons should be hidden from assistive
  technology. Icon-only controls need a localized accessible name; a tooltip
  helps discovery but does not replace the name.
- Use real labels, keyboard-operable controls, visible focus, and restrained
  status announcements. Keep focus stable during updates. Do not convey state
  only with color. Check both themes using existing semantic tokens.
- At a narrow viewport, preserve the input → action → result order. Long text,
  filenames, translations, and toolbars must not cause page-level overflow.
  Code/table regions may scroll independently when useful.
- Start with the established visual language. Choose animation, cards, tabs,
  badges, or a new abstraction according to the actual interaction and content.

## i18n is part of the interaction

The site language list in `apps/web/src/lib/site.ts` is authoritative. All
existing locale families ship those languages. The SDK's English-only minimum
is a reusable contract, not this site's localization completion rule.

- Keep discovery metadata, UI messages, accessible labels, and optional articles
  consistent. Follow `docs/i18n-terminology.md`; preserve established translations.
- Preserve JSON types, keys, and named interpolation tokens, including repeated
  occurrences. Tokens can move to fit target grammar. Do not translate identifiers
  such as `{base}`. Do not assemble translated sentences from English fragments.
- Format human-facing dates/numbers for the selected locale where appropriate;
  machine-readable output keeps its required syntax. Be explicit about timezone
  where it changes the result. Use plural-aware phrasing for count-dependent copy.
- Let layouts fit natural translations. Check a long-text language and an RTL
  language for layout changes; keep code, paths, and numeric syntax readable in
  their appropriate direction. Do not mirror every technical symbol blindly.
- Fallback is useful at runtime but does not count as a completed translation.
  Identical source/target strings can be valid format names or technical terms;
  treat them as review signals, not automatic failures.

## Quality gates and evidence

| Check                                  | Execution                                        | Meaning                                                                                                           |
| -------------------------------------- | ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| Tool/package/meta contract             | Registry generation and SDK validation           | Required structure and nonempty metadata                                                                          |
| Icon mappings and locale contracts     | `pnpm quality:check`, explicitly in Code Check   | Every discovered manifest has a mapped icon; locale files, keys, types, named tokens, and Markdown heading parity |
| Code correctness and boundaries        | Existing lint, typecheck, depcruise, knip, tests | Regressions and architecture rules                                                                                |
| Build and links                        | Existing Build Web and HTML Link Check jobs      | Shippable pages and valid internal links                                                                          |
| Accessibility/SEO/performance signals  | Existing non-blocking Lighthouse job             | Sampled pages only; does not prove an interaction works                                                           |
| Task completion and language usability | Focused browser review                           | Evidence from actual input, output, recovery, and layout                                                          |

Run locale/icon checks explicitly on PRs: filesystem reads and discovery can
escape dependency-based `vitest --changed` selection. Keep required CI job names
stable. Do not silently reduce existing coverage thresholds.

Choose local verification by impact:

- Instructions-only change: inspect links, consistency, and formatting.
- Copy/icon/catalog change: quality checks, relevant component tests, and registry
  regeneration for metadata/manifests. Review copy for truthful usefulness.
- Tool behavior/UI change: relevant behavior tests plus a browser walk-through
  with realistic input, result use, and a recoverable failure. Include narrow
  layout, keyboard, and affected language cases when applicable.
- Shared UI, SDK, routing, or localization infrastructure: broaden verification
  to affected tool families and existing type/build/boundary checks.

Automate deterministic failures. Review wording quality, interaction friction,
and icon semantics with concrete examples, not arbitrary text-length thresholds,
regex bans on all hardcoded strings, or a subjective aggregate quality score.
Record what was checked and any unverified behavior. A browser review should
name the tool, input, expected outcome, actual outcome, and a useful fix.
