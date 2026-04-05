# `@workspace/ui`

`packages/ui` is the single UI entrypoint for the Astro rewrite.

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

- Tools must import UI from `@workspace/ui`, not directly from third-party UI packages.
- `apps/web` consumes shared UI but does not own shadcn configuration.
- Site-level layouts belong in `components/app`.
- Tool-level reusable surfaces belong in `components/tool`.
- Tool-private UI stays inside the tool directory.
