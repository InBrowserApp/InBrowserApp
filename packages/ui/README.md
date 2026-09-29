# `@workspace/ui`

`packages/ui` is the single UI entrypoint for `apps/web` and every `@tool/*`. Anything UI-shaped is imported from here, never directly from `shadcn`, `lucide-react`, or `@radix-ui/*`.

## Responsibilities

- owns the shared `components.json`
- owns `shadcn/ui` source code
- owns the shared theme tokens and typography defaults
- exposes base primitives under `src/components/ui/`
- exposes shared compositions under `src/components/app/` and `src/components/tool/`
- re-exports the project icon set under `src/icons/`

## Tokens

- typography defaults live in `src/styles/globals.css`
- shared spacing tokens start with `--spacing-*`
- display typography uses `--tracking-display`
- shared elevated surfaces use `--shadow-elevated`

## Icons

- `lucide-react` stays behind `@workspace/ui/icons`
- app shell and tools should import icons from `@workspace/ui/icons`, not from `lucide-react`

## Rules

### Tool panel spacing

Use `ToolPanelCard` with `CardHeader`, `ToolPanelCardContent`, and optional
`ToolPanelCardFooter`. The panel has no outer padding or gap; each section
owns its spacing. Content has 16px padding by default and 12px in `size="sm"`
panels. Add `border-b` to the header when it needs a divider.

Use `padding="none"` on `ToolPanelCardContent` for edge-to-edge previews or
content that supplies its own padding. This works at both card sizes without
caller-side group selectors. Keep `className` for layout and intentional
custom spacing; ordinary content does not need `p-4` or `py-4` overrides.

Use the base `Card` composition for cards that rely on its outer padding and
gap. Avoid mixing raw `CardContent` or bare padded containers into a
`ToolPanelCard`, including sections extracted into child components.

### Ownership

- Tools must import UI from `@workspace/ui`, not directly from third-party UI packages.
- `apps/web` consumes shared UI but does not own shadcn configuration.
- Site-level layouts belong in `components/app`.
- Tool-level reusable surfaces belong in `components/tool`.
- Tool-private UI stays inside the tool directory.
