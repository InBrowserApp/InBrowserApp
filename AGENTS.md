# Repository guidance

InBrowser.App is a multilingual Astro + React browser utility site. Optimize for
people completing a task: understand the tool, provide input, get a result,
use it, and make another attempt without losing their work.

## Read only what the task needs

- [Development guide](docs/development-guide.md): commands, tool contract,
  workspace boundaries, generated files, CI, and release operations.
- [Product quality](docs/product-quality.md): descriptions, icons, user flows,
  accessibility, i18n, and proportionate validation. Read for tool/UI changes.
- [Tool terminology](docs/i18n-terminology.md): localized product terminology.
- [Add tool skill](.agents/skills/add-tool/SKILL.md): create a new tool from user
  intent through implementation, localization, registration, and verification.
- [Tool authoring skill](.agents/skills/tool-authoring/SKILL.md): change an
  existing tool, including copy, localization, and verification.
- [Tool content skill](.agents/skills/tool-content/SKILL.md): write useful
  explanations, examples, FAQs, and SEO copy based on the actual tool.
- [Tool UX review skill](.agents/skills/tool-ux-review/SKILL.md): review the actual
  path from input to usable result, including recovery and mobile behavior.

`AGENTS.md` is the shared entrypoint. `CLAUDE.md` imports it instead of keeping a
second set of rules. Keep detailed policies in the linked references.

## Working defaults

- Treat skill workflows and design patterns as starting points. Choose, combine,
  or skip steps according to the tool, user intent, existing implementation, and
  impact of the change. A different sensible approach needs no exception approval;
  explain consequential tradeoffs when that helps review the result.
- Follow the user's requested scope. Make routine, reversible implementation
  choices without additional approval; ask only when missing information would
  materially change the result and cannot be established from the repository.
- Reuse the existing design system and useful interaction patterns. Favor clear
  actions and sensible defaults; add options or explanations when they help a
  user decide. A simple tool need not look like a settings dashboard.
- Validate user input and external data at the boundary. Inside typed code,
  trust established contracts. Preserve input on failure and explain the next
  action. Avoid repeated guards, silent catches, speculative fallbacks, and
  arbitrary limits. See the product guide for the necessary exceptions.
- Keep code tool-local until shared use or a clear domain boundary justifies
  extraction. Tools use `@workspace/ui`, including its icon exports; the SDK
  remains framework-agnostic. Respect `.dependency-cruiser.json`.
- Use pnpm, oxlint, and oxfmt. Dependency versions belong in the workspace
  catalog. Read runtime/package-manager versions from `package.json`.
- Generated registry files are committed: regenerate after manifest/metadata
  changes. Ignore build output, caches, and `.claude/worktrees/*` unless targeted.
- Run checks appropriate to the change, report what actually ran, and separate
  verified behavior from untested assumptions. Write tests for meaningful
  behavior and regressions; do not add tests that merely repeat implementation.

## Skill selection

Use `add-tool` as the end-to-end entrypoint for new utilities, `tool-authoring`
for existing tools, `tool-content` for explanatory content and SEO, and
`tool-ux-review` for assessments. Skills provide judgment and reusable workflows;
adapt their steps and depth to the task. Distinguish design defaults from actual
repository contracts and CI requirements. Consult `shadcn` for shared
component implementation and `web-design-guidelines` for focused accessibility
or interface reviews. Apply React performance advice to measured/relevant
problems; Next.js server patterns do not automatically apply to Astro islands.
Use `frontend-design` when visual design benefits the task, taking the existing
site into account. Typography, motion, density, and component selection are
contextual choices. Load the references useful for the current work.

Imported skills and their detailed examples follow the same interpretation:
style preferences and impact ratings guide judgment. Requirements derived from
component APIs, accessibility behavior, package boundaries, or CI should be
identified with their source. Keep real contracts intact, or change them
deliberately with implementation and verification when that is in scope.
Imported skills have local adaptations; review upstream updates against these
changes. `skills-lock.json` records the upstream source snapshots, while Git
tracks the repository's adaptations.

For substantial translation work, follow `.claude/agents/i18n-translator.md`.
Preserve placeholder identities while allowing natural word order. Catalog
parity alone does not establish translation quality or layout usability.
