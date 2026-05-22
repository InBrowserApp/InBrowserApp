# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

InBrowser.App is a multilingual **Astro + React + shadcn/ui** application that hosts ~200 browser-only utilities. `main` is the live product (shipped as v2.0.0 in PR #919). The legacy Vue 3 / Vite implementation lives on the `legacy/vue` branch — fetch from it via `git show origin/legacy/vue:<path>` rather than checking the branch out, and only when you need to port an asset or copy that has not already made it across.

## Common commands

```bash
pnpm dev                  # tool-registry:generate + astro dev (apps/web)
pnpm build                # tool-registry:generate + astro build
pnpm tool-registry:generate  # regenerate packages/tool-registry/src/generated/*
pnpm test                 # vitest run (silent)
pnpm test:coverage        # with v8 coverage and threshold enforcement
pnpm typecheck            # tool-registry:generate + root tsc + per-app astro check
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
tests/                # repo-level tests (i18n consistency, sitemap serialization).
```

Tools **are** workspace packages. Each `tools/<slug>/` has its own `package.json` with `name: "@tool/<slug>"` (must equal dirname — the registry generator validates). Per-tool runtime deps live in the tool's own `package.json`; `react`, `react-dom`, and `astro` are peer-deps satisfied by `apps/web`. Shared deps come through `@workspace/tool-sdk` and `@workspace/ui`.

**All external dependency versions live in the `catalog:` block of `pnpm-workspace.yaml`** — every `package.json` references them as `"foo": "catalog:"` (including `peerDependencies`). When adding a new dep, add it to the catalog first, then reference `catalog:` from the package(s) that need it. Never inline a version in a `package.json`. This is the only way to bump a version, and it's what prevents the kind of cross-package drift that motivated the React dedupe in #355.

### Boundary contract (enforced by `.dependency-cruiser.json`, see `docs/architecture/workspace-boundaries.md`)

- `apps/web` → may import generated registry data and the three packages; must NOT reach into tool-local internals (messages, sections, components, workers).
- `packages/ui` → presentation only. No imports from `apps/web`, `tools/*`, or `tool-registry`.
- `packages/tool-sdk` → framework-agnostic. No imports from app shell, UI, registry, or tools.
- `packages/tool-registry` → may depend on `tool-sdk` and on `@tool/*` packages, **but only `src/generated/` may directly import from `@tool/*`**. The rest of the registry source stays clean.
- `tools/*` → may depend on `@workspace/ui`, `@workspace/tool-sdk`, `packages/lib/*`. Must NOT import from `apps/web` or `tool-registry`. Must NOT import third-party UI packages like `lucide-react` or `@radix-ui/*` directly — go through `@workspace/ui` (icons live at `@workspace/ui/icons`).

Default to **tool-local** code. Promote into `packages/lib/*` only when the code is used by ≥3 tools (or is correctness-sensitive), framework-free, and has a clean domain boundary.

### Tool contract

```
tools/<slug>/
  package.json         # name === "@tool/<slug>"; exports "./manifest" + "./page"
  manifest.ts          # exports `tool` from defineTool() in @workspace/tool-sdk
  index.astro          # composition root. Receives only `lang` from the shell.
  meta/en.json         # required base locale; meta/<lang>.json adds locales
```

Tools do **not** ship a `tsconfig.json`. The root `tsconfig.json` includes `tools/**` and is what `pnpm typecheck` runs against (a single `tsc --noEmit` for everything except `apps/web`, which has its own `astro check`). Tools also do **not** define their own `lint`, `format`, or `typecheck` scripts.

Optional, all tool-local: `client.tsx`, `messages/<lang>.json`, `sections/intro/<lang>.md`, `components/`, `core/`, `workers/`, `tests/`.

The registry generator (`packages/tool-registry/src/generate.ts`) discovers tools by globbing `tools/*/package.json`, validates `name === "@tool/" + dirname`, then dynamically imports each manifest via `await import("@tool/<slug>/manifest")` (no filesystem-path imports). It emits four files into `packages/tool-registry/src/generated/`:

- `registry.ts`, `search-index.ts`, `static-paths.ts` — data.
- `page-loaders.ts` — a `Record<slug, () => Promise<{ default: AstroComponentFactory }>>` of explicit `import("@tool/<slug>/page")` calls. The app shell uses this map; **there is no `import.meta.glob` of tools anywhere**.

The generator also **auto-syncs** the `@tool/*` block of `packages/tool-registry/package.json` to match the discovered tools (see `syncRegistryPackageDependencies` in `packages/tool-registry/src/generate/io.ts`). Adding a new tool flow:

1. Create the tool directory + files (see `tools/README.md`).
2. Run `pnpm tool-registry:generate`. If the generator reports that the registry's `package.json` was out of sync, it has already rewritten it — just run `pnpm install` and re-run the generator. CI fails on a non-deduped lockfile and on uncommitted diffs under `packages/tool-registry/src/generated`, so both the package.json and the generated files must be committed.

Adding/removing a locale on an existing tool: just `pnpm tool-registry:generate`. Both flows run automatically as part of `pnpm build`, `pnpm dev`, and `pnpm typecheck`.

### i18n model

- Site languages: defined as `SUPPORTED_SITE_LANGUAGES` in `apps/web/src/lib/site.ts`. Default is `en`. RTL set lives in the same file (`RTL_SITE_LANGUAGES` + `getSiteLanguageDirection`), wired into `<html dir>` in `apps/web/src/layouts/main.astro`.
- **Site copy** (app shell strings — nav, footer, home page, language picker labels, shared layout text): `apps/web/src/messages/<lang>.json`, loaded by `apps/web/src/lib/site-messages.ts` via `import.meta.glob`. Falls back to `en`.
- **Tool copy** (per-tool strings — tool title/description in `meta/<lang>.json`, plus the tool's own UI labels in `messages/<lang>.json`): lives inside each `tools/<slug>/`. `packages/tool-sdk/src/resolve-locale.ts` handles fallback chain → requested → `en` → first available.
- `tests/i18n-consistency.test.ts` walks the repo and treats every directory containing `en.json` or `en.md` as a locale family. For each family: every file must exist for every supported language, JSON files must keep the same key structure as `en.json`, and markdown files must keep the same heading outline as `en.md`.
- When translating either site copy or tool copy into all supported languages, fan out via the `i18n-translator` subagent (`.claude/agents/i18n-translator.md`) — spawn one instance per target language and run them in parallel. Do not translate multiple languages sequentially in the main conversation, and do not use a generic agent for this.
- Native language names live in **the language picker component** (`packages/ui/src/components/app/language-switcher.tsx`), not in message catalogs. Don't duplicate them.
- Routing: `/<lang>/...` for non-default languages; default (`en`) is bare. Generated by `createNonDefaultLanguageStaticPaths()` in `site.ts`. The sitemap emits an `x-default` hreflang for multilingual entries (#910).

### Testing

Vitest runs from the root with happy-dom. Coverage thresholds (enforced):

- `packages/tool-sdk/src/**`: 100% lines/branches/functions/statements
- `tools/*/core/**`: 100% across the board
- `tools/*` overall: 90% lines/statements, 85% branches/functions

Test files use `*.test.ts` / `*.test.tsx`. DOM tests use `happy-dom`. Don't mock things at module boundaries that the coverage thresholds will then refuse to count — keep `core/` pure and test it directly.

### Build pipeline notes

- `pnpm build`, `pnpm dev`, and `pnpm typecheck` all run `tool-registry:generate` first. The generator imports each tool's manifest by package name (`@tool/<slug>/manifest`) and reads `meta/<lang>.json` from disk, then writes 4 files into `packages/tool-registry/src/generated/`. Those generated files **are committed** — diffs there are expected when adding tools or locales, and CI fails if the working tree diverges from a fresh generator run.
- Astro aliases for `@workspace/*` resolve directly to package `src/` (see `apps/web/astro.config.mjs`). There is no per-package build step.
- Cache headers for static assets live in `apps/web/public/_headers`. Fingerprinted `_astro/*` is `immutable`; brand icons use `stale-while-revalidate`.

### Hosting and CI

Cloudflare Workers (static assets via the Workers Sites model). `.github/workflows/ci.yml` runs:

- **PRs (same-repo)** — `code-check` + `build-web`, then `wrangler versions upload` against the `cloudflare-workers-staging` environment. Each PR push uploads a new Worker version tagged with the ref, exposed through the deploy job's `deployment-url` output.
- **Push to `main`** — same flow as PRs; uploads a Workers Version of the latest commit.
- **GitHub release (`release: published`)** — runs `wrangler deploy` against the production environment, plus uploads the built `apps/web/dist` as a `.tar.zstd` asset on the release (#924). release-please opens the chore release PR (anchored on legacy 1.5.0; the Astro rewrite shipped as 2.0.0 in #921, #923).

There is no longer a separate `staging` env in `apps/web/wrangler.jsonc` — previews are Workers Versions, production is the default env. The `actionlint` workflow lints `.github/workflows/**` on PRs that touch them.

## Conventions

- Commits: Conventional Commits, enforced by commitlint via Husky. **PR titles must also follow Conventional Commits** — they're used as the squash-merge commit subject and are checked in CI by `.github/workflows/pr-title.yml`.
- Formatter / linter: `oxfmt` and `oxlint`. Don't introduce Prettier or ESLint. Formatting is semicolon-free, 2-space indent, 80-column. `oxlint` enforces `max-lines: 300` for normal source files (tests and `src/generated/*` exempt).
- Package manager: `pnpm@10.33.0`. Node `>=20`.
- TypeScript everywhere, strict across the workspace. Astro components use the `.astro` extension; React islands are `.tsx` and run with `client:*` directives in Astro.
- The `@/*` path alias maps to `apps/web/src/*` only — don't use it from packages or tools.
