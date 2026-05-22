# InBrowser.App

Browser-only developer and everyday utilities. Every tool runs entirely in the visitor's browser — no uploads, no servers, no tracking. Live at [inbrowser.app](https://inbrowser.app).

Built with Astro, React, and shadcn/ui. Shipped to production as v2.0.0; `main` is the live product. The legacy Vue 3 / Vite implementation is preserved on the `legacy/vue` branch.

## Workspace shape

- `apps/web` — the only deployable. Astro routes, layouts, SEO, and Cloudflare Worker config.
- `packages/ui` — shared design system. The only owner of `shadcn/ui` source and `components.json`.
- `packages/tool-sdk` — framework-agnostic tool contract: `defineTool()`, types, locale resolution, validation.
- `packages/tool-registry` — manifest discovery + codegen (registry, search index, static paths, page loaders).
- `packages/lib/<domain>` — promoted, framework-free domain libraries.
- `tools/<slug>` — self-contained workspace packages, scoped `@tool/<slug>`. Each tool is its own private workspace package with its own runtime deps.

## Architectural rules

- Default to tool-local code. Shared code must earn its way into `packages/lib/*` (≥3 callers or correctness-sensitive).
- `tools/*` may depend on `@workspace/ui`, `@workspace/tool-sdk`, and `packages/lib/*`, but not on `apps/web` or `@workspace/tool-registry`.
- `packages/ui` is presentation-only; no imports from `apps/web`, `tools/*`, or `tool-registry`.
- `packages/tool-sdk` is framework-agnostic.
- `packages/tool-registry` is the only package allowed to generate imports that point at `@tool/*`, and only from `src/generated/`.
- All external dependency versions live in the `catalog:` block of `pnpm-workspace.yaml`; package manifests reference them as `"catalog:"`.

See [docs/architecture/workspace-boundaries.md](./docs/architecture/workspace-boundaries.md) for the full boundary contract.

## Getting started

```bash
pnpm install
pnpm dev          # tool-registry:generate + astro dev (apps/web)
```

Node `>=20`, `pnpm@10.33.0`.

## Working with shadcn/ui

`packages/ui` owns the shared `components.json`. Add or update shadcn components from there rather than from the app shell.

## Contributing

- Conventional Commits, enforced by commitlint via Husky. PR titles are checked in CI and become the squash-merge subject.
- Linter and formatter are `oxlint` and `oxfmt`. Don't introduce ESLint or Prettier.
- See [CLAUDE.md](./CLAUDE.md) and [AGENTS.md](./AGENTS.md) for agent-facing guidance.
