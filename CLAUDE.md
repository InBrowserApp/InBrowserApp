# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

The `dev/astro-rewrite-base` branch (current) is the **multilingual Astro + React + shadcn/ui rewrite** of InBrowser.App. The previous Vue 3 / Vite implementation still lives on `main` and is the source of truth for assets, copy, and tool ports until the rewrite reaches parity.

When porting something from `main`, fetch it via `git show origin/main:<path>` rather than checking out the branch.

## Common commands

```bash
pnpm dev                  # tool-registry:generate + astro dev (apps/web)
pnpm build                # tool-registry:generate + astro build
pnpm tool-registry:generate  # regenerate packages/tool-registry/src/generated/* — required after adding a tool or a tool locale
pnpm test                 # vitest run (silent)
pnpm test:coverage        # with v8 coverage and threshold enforcement
pnpm typecheck            # tool-registry:generate + per-workspace astro check / tsc
pnpm lint                 # oxlint
pnpm lint:fix             # oxlint --fix
pnpm format               # oxfmt
pnpm format:check
pnpm depcruise            # enforces workspace boundary rules (.dependency-cruiser.json)
pnpm knip                 # unused exports / files
```

Run a single test file or pattern (vitest is at the root, not per-package):

```bash
pnpm exec vitest run path/to/file.test.ts
pnpm exec vitest run -t "matches a regex on test name"
pnpm exec vitest                          # watch mode
```

Deploy the web app to staging from `apps/web`:

```bash
pnpm --filter web deploy:staging          # wrangler deploy --env staging
```

If `astro build` fails with `Cannot find module '<...>/dist/renderers.mjs'`, the dist cache is stale — `rm -rf apps/web/dist apps/web/.astro` and rebuild. This happens easily when builds run from different cwds.

## Architecture

### Workspace shape

```
apps/web              # the only deployable. Astro routes, layouts, SEO, Cloudflare Worker config.
packages/ui           # shared design system. The only owner of shadcn/ui source and components.json.
packages/tool-sdk     # framework-agnostic tool contract: defineTool(), types, locale resolution, validation.
packages/tool-registry# manifest discovery + codegen (registry, search-index, static-paths, page-loaders). Source-only.
packages/lib/<domain> # promoted, framework-free domain libs (only when reuse is justified).
tools/<slug>/         # self-contained workspace packages, scoped @tool/<slug>.
```

Tools **are** workspace packages. Each `tools/<slug>/` has its own `package.json` with `name: "@tool/<slug>"` (must equal dirname — the registry generator validates). Per-tool runtime deps live in the tool's own `package.json`; `react`, `react-dom`, and `astro` are peer-deps satisfied by `apps/web`. Shared deps come through `@workspace/tool-sdk` and `@workspace/ui`.

### Boundary contract (enforced by `.dependency-cruiser.json`, see `docs/architecture/workspace-boundaries.md`)

- `apps/web` → may import generated registry data and the three packages; must NOT reach into tool-local internals (messages, sections, components, workers).
- `packages/ui` → presentation only. No imports from `apps/web`, `tools/*`, or `tool-registry`.
- `packages/tool-sdk` → framework-agnostic. No imports from app shell, UI, registry, or tools.
- `packages/tool-registry` → may depend on `tool-sdk` and on `@tool/*` packages, **but only `src/generated/` may directly import from `@tool/*`**. The rest of the registry source stays clean.
- `tools/*` → may depend on `@workspace/ui`, `@workspace/tool-sdk`, `packages/lib/*`. Must NOT import from `apps/web` or `tool-registry`.

Default to **tool-local** code. Promote into `packages/lib/*` only when the code is used by ≥3 tools (or is correctness-sensitive), framework-free, and has a clean domain boundary.

### Tool contract

```
tools/<slug>/
  package.json         # name === "@tool/<slug>"; exports "./manifest" + "./page"
  tsconfig.json        # extends ../../tsconfig.base.json
  manifest.ts          # exports `tool` from defineTool() in @workspace/tool-sdk
  index.astro          # composition root. Receives only `lang` from the shell.
  meta/en.json         # required base locale; meta/<lang>.json adds locales
```

Optional, all tool-local: `client.tsx`, `messages/<lang>.json`, `sections/intro/<lang>.md`, `components/`, `core/`, `workers/`, `tests/`.

The registry generator (`packages/tool-registry/src/generate.ts`) discovers tools by globbing `tools/*/package.json`, validates `name === "@tool/" + dirname`, then dynamically imports each manifest via `await import("@tool/<slug>/manifest")` (no filesystem-path imports). It emits four files into `packages/tool-registry/src/generated/`:

- `registry.ts`, `search-index.ts`, `static-paths.ts` — data.
- `page-loaders.ts` — a `Record<slug, () => Promise<{ default: AstroComponentFactory }>>` of explicit `import("@tool/<slug>/page")` calls. The app shell uses this map; **there is no `import.meta.glob` of tools anywhere**.

Adding a new tool requires:

1. Creating the tool directory + files (see `tools/README.md`).
2. Adding `"@tool/<slug>": "workspace:*"` to `packages/tool-registry/package.json` dependencies.
3. `pnpm install` (materialises the symlink at `packages/tool-registry/node_modules/@tool/<slug>`).
4. `pnpm tool-registry:generate`.

Adding/removing a locale on an existing tool: just `pnpm tool-registry:generate`. Both flows are run automatically by `pnpm build` so day-to-day you don't think about it — but if you forget to `pnpm install` after adding a new tool, the generator fails with a clear "ensure @tool/<slug> is in tool-registry deps and run pnpm install" error.

### i18n model

- Site languages: defined as `SUPPORTED_SITE_LANGUAGES` in `apps/web/src/lib/site.ts`. Default is `en`. RTL set lives in the same file (`RTL_SITE_LANGUAGES` + `getSiteLanguageDirection`), wired into `<html dir>` in `apps/web/src/layouts/main.astro`.
- Site copy: `apps/web/src/messages/<lang>.json`, loaded by `apps/web/src/lib/site-messages.ts` via `import.meta.glob`. Falls back to `en`.
- Tool copy: per-tool `meta/<lang>.json` and `messages/<lang>.json`. `packages/tool-sdk/src/resolve-locale.ts` handles fallback chain → requested → `en` → first available.
- Native language names live in **the language picker component** (`packages/ui/src/components/app/language-switcher.tsx`), not in message catalogs. Don't duplicate them.
- Routing: `/<lang>/...` for non-default languages; default (`en`) is bare. Generated by `createNonDefaultLanguageStaticPaths()` in `site.ts`.

### Testing

Vitest runs from the root with happy-dom. Coverage thresholds (enforced):

- `packages/tool-sdk/src/**`: 100% lines/branches/functions/statements
- `tools/*/core/**`: 100% across the board
- `tools/*` overall: 90% lines/statements, 85% branches/functions

Test files use `*.test.ts` / `*.test.tsx`. DOM tests use `happy-dom`. Don't mock things at module boundaries that the coverage thresholds will then refuse to count — keep `core/` pure and test it directly.

### Build pipeline notes

- `pnpm build` always runs `tool-registry:generate` first. The generator imports each tool's manifest by package name (`@tool/<slug>/manifest`) and reads `meta/<lang>.json` from disk, then writes 4 files into `packages/tool-registry/src/generated/`. Those generated files **are committed** — diffs there are expected when adding tools or locales.
- Astro aliases for `@workspace/*` resolve directly to package `src/` (see `apps/web/astro.config.mjs`). There is no per-package build step.
- Cache headers for static assets live in `apps/web/public/_headers`. Fingerprinted `_astro/*` is `immutable`; brand icons use `stale-while-revalidate`.

### Hosting

Cloudflare Workers (static assets via the Workers Sites model). PR previews deploy to `https://pr-<num>-inbrowserapp-web-astro-staging.rwv.workers.dev` and a `Deploy Preview` check posts the URL on each PR.

## Conventions

- Commits: Conventional Commits, enforced by commitlint via Husky.
- Formatter / linter: `oxfmt` and `oxlint`. Don't introduce Prettier or ESLint.
- Package manager: `pnpm@9.15.9`. Node `>=20`.
- TypeScript everywhere. Astro components use the `.astro` extension; React islands are `.tsx` and run with `client:*` directives in Astro.
