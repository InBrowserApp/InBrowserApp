---
name: add-tool
description: Add a new browser utility to InBrowser.App from an idea or specification through a working, localized, registered, and verified tool. Use for "add a tool", "create a new utility", or "新增工具". For changes to an existing tool, use tool-authoring; for an assessment, use tool-ux-review.
---

# Add a tool

Deliver a usable tool integrated into the site, including its description,
icon, translations, discovery, and verification. Work from the user's idea;
derive a sensible implementation from the available context and clarify only
choices that materially affect the outcome.

All repository paths below are relative to the repository root. Read
`AGENTS.md`, `docs/product-quality.md`, and the package contract in
`tools/README.md`. Consult `docs/development-guide.md` for operational details.
These references own the rules; this skill owns the sequence of work.

## Coordinate the work, adapt the approach

The phases below are a useful default. Combine, reorder, or revisit them to fit
the tool. Keep ownership of the complete deliverable while using specialized
workflows where they add value:

| Work | Workflow |
| --- | --- |
| New tool scope, implementation, and integration | This skill |
| Explanations, worked examples, FAQ, and page SEO | `tool-content` |
| Related metadata, UI, and article translations | `.claude/agents/i18n-translator.md` |
| Interaction and layout assessment | `tool-ux-review` |
| Subsequent changes to an existing tool | `tool-authoring` |

Carry the chosen slug, user task, implemented capabilities, affected paths,
and verified examples into each workflow. This can happen in one agent;
separate workflows do not require separate agents or approval stages. Package
setup and registration stay here because they are short integration steps.
Design decisions remain contextual; package contracts and CI checks come from
the repository's actual implementation.

## 1. Establish the user task

- Establish who brings what input, what result they need, and how they will use it.
  Infer routine defaults from the request and existing tools. Ask only when an
  unresolved choice would materially change the tool's purpose or behavior.
- Search `tools/` and the registry for an existing equivalent. If the capability
  already exists, consider whether extending it or adding a distinct workflow
  better serves the request. Explain a consequential scope choice.
- Choose a descriptive, stable slug and a relevant category. Inspect one nearby
  tool with a similar interaction, not simply the shortest implementation.
- Establish real format/library/browser capabilities before promising support.
  Identify any network or permission needs that affect the user's choice.

## 2. Design the shortest useful flow

Define input → processing → usable result → revision/retry before choosing
components. Use sensible defaults and show the main task first.

- Cheap text transformations can run immediately; expensive work or permission
  access gets an explicit action. Choose a viewer, converter, validator,
  generator, or recorder pattern that fits the task.
- Offer the natural input method and an example when helpful. Put copy/download
  beside output when that is how users consume it; viewers can focus on reading.
- Keep input on failure, explain a recoverable next step, and make repeat use easy.
  Add confirmations, limits, or advanced options when they solve a concrete user
  need; a simple local operation will usually need fewer steps.
- Start with the existing design system. Place contextual help near decisions
  and choose article depth according to the reader's questions.

Usually these are brief implementation decisions; deeper design work is useful
when the tool's complexity or the user's request calls for it.

## 3. Implement the tool and its identity

- Create `tools/<slug>/` using the package shape in `tools/README.md`: package
  name `@tool/<slug>`, `./manifest` and `./page` exports, `manifest.ts`,
  `index.astro`, and English metadata. Choose client/core/worker files according
  to the tool's execution and organization needs.
- Export `tool` using `defineTool()`. Use a meaningful category, search tags, and
  an icon already present in `toolIconMap`; add a missing mapping through
  `packages/ui` when warranted. Import UI and icons through `@workspace/ui`.
- Compose the page with `ToolPageShell`, a visible localized title/description,
  and tool-local locale loading from the supplied `lang`. The description should
  explain actual input/output and useful actions, not generic marketing claims.
- Keep domain logic local and test meaningful outcomes. Use existing shared
  libraries when appropriate; weigh a shared abstraction against local clarity
  and maintenance. External dependencies use the workspace catalog.
- Cover normal input, important edge cases, and recovery. Keep necessary boundary
  validation, rendering protections, and cleanup without repeated internal guards.

## 4. Explain the tool where it helps

Ship a localized guide below the interactive tool alongside the description in
`meta/<lang>.json`. Use `tool-content` to choose its depth and structure. A
concise worked example can be enough for a simple tool. Revisit the guide when
the implementation changes a capability or the meaning of a result.

## 5. Complete localization

Use `SUPPORTED_SITE_LANGUAGES` from `apps/web/src/lib/site.ts`; do not hardcode a
language count. Complete metadata, the guide, and any UI locale families for
every supported language.

For substantial translation batches, follow `.claude/agents/i18n-translator.md`:
group related files per language and use bounded parallelism when available.
Preserve terminology, value types, and placeholder identities; allow natural
word order. Include accessible names and error/status messages. Runtime English
fallback does not count as completing the requested localization.

## 6. Register and integrate

From the repository root, follow the generation sequence in `tools/README.md`:

1. Run `pnpm tool-registry:generate` after the tool files are ready.
2. If the generator synchronizes registry dependencies and requires installation,
   run `pnpm install`, then rerun `pnpm tool-registry:generate`.
3. Review registry dependency, lockfile, and generated source changes together.
   Include the resulting changes in the deliverable. Do not hand-edit generated
   files or the registry's `@tool/*` dependency block.

Use generated routes and discovery rather than adding tool-specific app imports.
Verify that the new tool appears in discovery and its localized routes resolve.

## 7. Verify and deliver

- Run `pnpm quality:check` and focused behavior tests for the new tool. Follow
  existing coverage requirements rather than adding tests that only echo markup.
- Run `pnpm typecheck`, lint/format checks, `pnpm depcruise`, `pnpm knip`, and
  `pnpm dedupe --check` as relevant to the new package and dependencies. Run
  `pnpm build` to verify its Astro entrypoint and generated routes integrate.
- Exercise a realistic input, usable output, and a correction/retry in the
  browser. Check narrow layout, keyboard access, a long-text locale, and RTL
  where applicable. Use `tool-ux-review` for the detailed review workflow.
- Verify the localized description and guide in the rendered page. The guide
  should fill the same content width as the interactive tool.
- Fix regressions caused by the change. Report pre-existing failures or unavailable
  checks precisely, distinguishing completed verification from planned checks.

Finish with the tool's purpose/path, supported behavior, verification performed,
and material remaining limitations. For a complete-tool request, carry the work
through integration and localization so it is reviewable. Honor a narrower
request when the user explicitly wants a prototype, plan, or individual phase.
