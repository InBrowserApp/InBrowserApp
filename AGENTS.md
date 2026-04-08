# AGENTS.md

This file provides guidance to coding agents working in this repository.

## What this repo is

The current working branch, `dev/astro-rewrite-base`, is the multilingual
`Astro + React + shadcn/ui` rewrite of InBrowser.App. The legacy Vue 3 / Vite
implementation still lives on `main` and remains the source of truth for older
assets, copy, and tool ports until the rewrite reaches parity.

When you need to port something from the legacy app, fetch it with
`git show origin/main:<path>` instead of checking out `main`.

## Working set

- Treat the repo root as the source of truth.
- Ignore generated or disposable directories unless the task explicitly targets
  them: `apps/web/dist`, `apps/web/.astro`, `.turbo`, `coverage`,
  `node_modules`.
- `packages/tool-registry/src/generated/*` is different: those generated files
  are committed and should be updated when manifests or locales change.
- `.claude/worktrees/*` contains side worktrees and mirrors. Do not edit them
  unless the user explicitly asks you to work inside one of them.

## Common commands

```bash
pnpm dev                     # tool-registry:generate + astro dev (apps/web)
pnpm build                   # tool-registry:generate + astro build
pnpm tool-registry:generate  # regenerate packages/tool-registry/src/generated/*
pnpm test                    # vitest run --silent
pnpm test:coverage           # vitest with v8 coverage thresholds
pnpm typecheck               # tool-registry:generate + root tsc + astro check
pnpm lint                    # oxlint
pnpm lint:fix                # oxlint --fix
pnpm format                  # oxfmt
pnpm format:check            # oxfmt --check
pnpm depcruise               # workspace boundary enforcement
pnpm knip                    # unused exports / files
pnpm dedupe --check          # lockfile dedupe check used in CI
```

Run a single test file or pattern from the repo root:

```bash
pnpm exec vitest run path/to/file.test.ts
pnpm exec vitest run -t "regex on test name"
pnpm exec vitest
```

Deploy the Astro app to staging:

```bash
pnpm --filter web deploy:staging
```

If `astro build` fails with `Cannot find module '<...>/dist/renderers.mjs'`,
clear the stale caches and rebuild:

```bash
rm -rf apps/web/dist apps/web/.astro
pnpm build
```

## Architecture

### Workspace shape

```text
apps/web               # the only deployable app: routes, layouts, SEO, deploy config
packages/ui            # shared design system and shadcn/ui ownership
packages/tool-sdk      # framework-agnostic tool contract
packages/tool-registry # manifest discovery + generated registry/search/static paths
packages/lib/<domain>  # promoted, framework-free shared domain logic
tools/<slug>           # self-contained tool packages, each named @tool/<slug>
tests/                 # repo-level tests such as i18n consistency checks
```

Tools are private workspace packages. Each `tools/<slug>/package.json` must be
named `@tool/<slug>`, and the slug must match the directory name.

### Dependency and version rules

- All external dependency versions live in the `catalog:` block of
  `pnpm-workspace.yaml`.
- Every workspace `package.json` should reference external packages as
  `"catalog:"`, including `peerDependencies`.
- Never inline external versions in package manifests.
- `react`, `react-dom`, and `astro` belong in tool `peerDependencies`, satisfied
  by `apps/web`.

### Import boundaries

The boundary rules are enforced by `.dependency-cruiser.json`.

- `apps/web` may import `@workspace/ui`, `@workspace/tool-sdk`,
  `@workspace/tool-registry`, and generated registry data. It must not import
  tool-local internals directly.
- `packages/ui` is presentation-only. It must not import from `apps/web`,
  `tools/*`, or `packages/tool-registry`.
- `packages/tool-sdk` stays framework-agnostic. It must not depend on app, UI,
  registry, shared libs, or tool implementations.
- `packages/tool-registry` may depend on `@workspace/tool-sdk`, and only
  `src/generated/` may directly import `@tool/*`.
- `packages/lib/*` is reserved for framework-free shared domain logic.
- `tools/*` may depend on `@workspace/tool-sdk`, `@workspace/ui`, and
  `packages/lib/*`, but must not import from `apps/web` or
  `packages/tool-registry`.
- Tools must not import third-party UI packages like `lucide-react`,
  `@radix-ui/*`, or `shadcn` directly. Go through `@workspace/ui`.

### App and package conventions

- `apps/web` is the only deployable artifact.
- The `@/*` path alias maps to `apps/web/src/*` only. Do not use it from
  packages or tools.
- `packages/ui` owns `components.json`, shared tokens, app/tool UI shells, and
  icon re-exports. Import icons from `@workspace/ui/icons`, not `lucide-react`.
- Internal packages are source-only; there is no package build pipeline.
- Root scripts orchestrate the workspace directly; there is no active Turborepo
  task graph to route normal builds through.

### Tool contract

Every tool follows this minimum contract:

```text
tools/<slug>/
  package.json
  manifest.ts
  index.astro
  meta/en.json
```

Common optional files stay tool-local:

- `client.tsx`
- `messages/<lang>.json`
- `sections/intro/<lang>.md`
- `components/`
- `core/`
- `workers/`
- `*.test.ts` / `*.test.tsx`

Tool rules:

- `manifest.ts` exports a named `tool` created with `defineTool()` from
  `@workspace/tool-sdk`.
- `index.astro` is the composition root. It receives `lang` from the app shell
  and should load tool-local copy with `resolveLocale(...)`.
- Tools do not ship their own `tsconfig.json`.
- Tools do not define their own `lint`, `format`, or `typecheck` scripts.

### Adding or changing tools

When adding a new tool:

1. Create `tools/<slug>/` with the required files.
2. Run `pnpm tool-registry:generate`.
3. If the generator reports that `packages/tool-registry/package.json` was out
   of sync, run `pnpm install` and rerun `pnpm tool-registry:generate`.
4. Commit both `packages/tool-registry/package.json` and
   `packages/tool-registry/src/generated/*` when they change.

Do not hand-edit the `@tool/*` dependency list in
`packages/tool-registry/package.json` unless you are also updating the
generator. The generator now syncs those entries from the discovered tools.

## i18n

- Supported site languages live in `apps/web/src/lib/site.ts`.
- Default language is `en`.
- RTL handling also lives in `apps/web/src/lib/site.ts` and is wired into
  `apps/web/src/layouts/main.astro`.
- Site copy lives in `apps/web/src/messages/<lang>.json`.
- Tool discovery metadata lives in each tool's `meta/<lang>.json`.
- Tool UI copy lives in each tool's `messages/<lang>.json`.
- Tool markdown content usually lives in `sections/<section>/<lang>.md`.
- Native language names for the language picker live in
  `packages/ui/src/components/app/language-switcher.tsx`, not in message files.

Important repo-wide rule: `tests/i18n-consistency.test.ts` walks the entire repo
and treats every directory containing `en.json` or `en.md` as a locale family.
For each such family:

- every file must exist for every supported language
- JSON files must keep the exact same key structure as `en.json`
- Markdown files must keep the same heading outline as `en.md`

When translating locale catalogs, use the dedicated i18n translation subagent
workflow described in `.claude/agents/i18n-translator.md`. The expected
default is one subagent per target language running in parallel. Do not
translate many languages sequentially in one agent when the subagent workflow
applies.

## Testing and quality gates

- Vitest runs from the repo root with `happy-dom`.
- Coverage thresholds are strict:
  - `packages/tool-sdk/src/**`: 100% lines, branches, functions, statements
  - `tools/*/core/**`: 100% lines, branches, functions, statements
  - `tools/*` overall: 90% lines/statements, 85% branches/functions
- Test files use `*.test.ts` or `*.test.tsx`.
- Keep correctness-sensitive logic in pure modules where possible and test it
  directly.

Lint and formatting:

- `oxlint` is the linter. Do not introduce ESLint.
- `oxfmt` is the formatter. Do not introduce Prettier.
- Formatting style is semicolon-free, 2-space indentation, 80-column width.
- `oxlint` enforces `max-lines` at 300 for normal source files. Tests and
  generated registry files are exempt.

## Build and generated artifacts

- `pnpm build`, `pnpm dev`, and `pnpm typecheck` all run
  `pnpm tool-registry:generate` first.
- The generator writes committed source files into
  `packages/tool-registry/src/generated/`.
- `apps/web/dist` is a build output and should not be edited manually or
  committed unless the user explicitly asks for built artifacts.
- The web app is built from source packages directly via Astro aliases; there is
  no separate package compilation step.

## Git and PR conventions

- Use Conventional Commits for commit messages.
- PR titles must also follow Conventional Commits; CI checks this.
- For rewrite work, the usual PR base branch is `dev/astro-rewrite-base`.
  Do not target `main` unless the user explicitly asks for it, because `main`
  is still the legacy Vue application.
- Cloudflare staging preview and deploy workflows live in
  `.github/workflows/staging.yml`.
- Pull requests from branches in this repo get a preview deployment alias of
  the form `pr-<number>-inbrowserapp-web-astro-staging.rwv.workers.dev`.

## Environment

- Package manager: `pnpm@10.33.0`
- Node: `>=20`
- TypeScript is strict across the workspace.
