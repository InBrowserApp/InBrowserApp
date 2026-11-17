---
name: shadcn
description: Implement or adapt shadcn/ui components, forms, styling, and composition in this workspace. Use when component APIs or shared UI ownership matter; choose patterns to fit the tool and the installed implementation.
user-invocable: false
---

# shadcn/ui

Use the existing design system to build useful interfaces, adapting patterns to
the task. In this repository, `packages/ui` owns shadcn source and configuration.
Read root `AGENTS.md` and inspect `packages/ui/components.json` and the relevant
installed components before relying on generic examples.

## Distinguish a default from a contract

Examples in this skill and its references illustrate tradeoffs. A label such as
"recommended" describes a useful pattern, not a lint rule. Component context,
accepted props, accessible naming, and repository import boundaries are concrete
requirements; choices such as cards, spacing utilities, palettes, and control
presentation depend on the use case.

InBrowser.App uses Astro with React islands. Tool UI imports go through
`@workspace/ui`, and icons through `@workspace/ui/icons`, as enforced by
`.dependency-cruiser.json`. Generic examples using `@/components` or direct
library imports need adapting to this ownership model.

## Choose components and styling

- Start with installed components and their variants when they fit. Custom
  composition or a shared extension is reasonable for an unmet need.
- `Field` and `FieldGroup` simplify labels, hints, and validation. A single
  labeled input or specialized editor can use a simpler structure.
- Choose radio buttons, select, combobox, toggles, or tabs based on selection
  semantics, discoverability, label length, and available space. Option count
  alone does not determine the right control.
- `InputGroup` and its input/addon parts provide integrated borders, focus, and
  spacing. Another composition should account for those behaviors explicitly.
- Cards can have a header, body, footer, or a subset. Add descriptions and actions
  where they help; direct page layout can be more appropriate than a card.
- Semantic tokens and shared variants make themes consistent. Domain-specific
  colors, typography, or local CSS can be useful when the task needs them.
- `gap`, `size`, `truncate`, and `cn()` are convenient defaults. Choose alternatives
  when they better express the layout or improve readability.
- Existing overlays manage focus and stacking. Diagnose an actual portal or
  stacking conflict before adjusting it; verify keyboard and dismissal behavior.
- Use component icon sizing by default and customize it when the design warrants.
  React component props often take an icon component; tool manifests intentionally
  use serializable string identifiers resolved by `ToolIcon`.
- Feedback may be inline text, a status region, an alert, or a toast. Prefer the
  feedback that keeps the result and next action clear. Tool imports of new UI
  libraries require integration through the shared UI package.

## Check the actual API

Consult component source/types for the installed behavior. Fetch upstream docs
when an API is unclear, a component is being added, or an update needs comparison.
A routine local edit need not repeat online discovery. If documentation is
unavailable, use the installed source and report any unresolved uncertainty.

Useful commands, run from `packages/ui` with the repo's pnpm version:

```bash
pnpm exec shadcn info --json
pnpm exec shadcn docs button dialog select
pnpm exec shadcn add button --dry-run
pnpm exec shadcn add button --diff button.tsx
```

Check the installed CLI's help for supported flags. `pnpm dlx shadcn@<version>`
is an option when a specific newer CLI is needed. Reference commands using
`npx shadcn@latest` illustrate upstream syntax, not a required version upgrade.

## Add, update, or change presets

Use existing components or the configured registry as the natural starting
point. Search other registries when they offer a relevant capability. Make
routine choices from the task and repository; clarify a source choice if it
would materially change the requested design or dependencies.

For updates, inspect the proposed diff and preserve relevant local behavior.
CLI previews usually make registry resolution and affected files easy to see;
source inspection is also useful for troubleshooting or unsupported CLI cases.
Review added imports and use the project's aliases and UI exports.

For a preset change, compare reinstalling, merging, or applying theme/config
changes. Select the approach that satisfies the request while preserving local
work. If the requested scope leaves a meaningful loss of custom work unresolved,
show the concrete diff and ask; existing authorization need not be requested
again. Use overwrite options when their effects are understood and authorized.

## References to load as needed

- [Forms](rules/forms.md): labels, controls, input groups, validation.
- [Composition](rules/composition.md): grouping, overlays, cards, feedback.
- [Icons](rules/icons.md): positioning, sizing, component and manifest APIs.
- [Styling](rules/styling.md): tokens, variants, layout, stacking.
- [Base versus Radix](rules/base-vs-radix.md): implementation-specific API differences.
- [CLI](cli.md): command reference; verify against the installed version.
- [Customization](customization.md): theme variables and component extensions.
