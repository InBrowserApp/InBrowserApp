# InBrowserApp Astro Rewrite

This branch hosts the multilingual `Astro + React + shadcn/ui` rewrite for InBrowserApp.

## Workspace shape

- `apps/web`: the only web application. Owns Astro routes, layouts, SEO, and deploy config.
- `packages/ui`: the shared design system. This is the only place that owns `shadcn/ui` source.
- `packages/tool-sdk`: the framework-agnostic contract for tools.
- `packages/tool-registry`: manifest scanning and generated registries/search indexes.
- `packages/lib/*`: pure TypeScript domain libraries promoted out of tools when reuse is justified.
- `tools/*`: self-contained tool directories. Tools are not workspace packages.

## Architectural rules

- Default to tool-local code. Shared code must earn its way into `packages/lib/*`.
- `tools/*` may depend on `packages/ui`, `packages/tool-sdk`, and `packages/lib/*`, but not on `apps/web`.
- `packages/ui` must stay presentation-focused and must not import app shell code or tool implementations.
- `packages/tool-sdk` must stay framework-agnostic.
- `packages/tool-registry` is the only package allowed to generate imports that point at tools.
- Internal packages are source-only. The app is the only deployable build artifact.

See [docs/architecture/workspace-boundaries.md](./docs/architecture/workspace-boundaries.md) for the full boundary contract.

## Working with shadcn/ui

`packages/ui` owns the shared `components.json`. Add or update shadcn components from there rather than from the app shell.
