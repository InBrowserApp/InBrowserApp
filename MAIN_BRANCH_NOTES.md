# Main Branch Notes (Vue Monorepo)

## Snapshot Summary
`main` is a Vue 3 + Vite monorepo for in-browser tools. The web shell lives in
`apps/web/` and consumes tool metadata and routes from workspace packages. Tool UI
packages live in `tools/<domain>/<tool>/`, shared UI/i18n live in `shared/`, and pure
utilities live in `utils/`.

## Workspace Layout (main)
- `apps/web/`: Vue app, routing, views, PWA, E2E tests.
- `tools/`: Per-tool UI packages (grouped by domain), each with `src/info.ts`,
  `src/routes.ts`, a `*View.vue`, and `components/`.
- `shared/`: Shared UI (`shared/ui`), i18n (`shared/locale`), and tool interfaces
  (`shared/tools`).
- `utils/`: Pure TypeScript utility packages (no UI).
- `registry/`: Tool registry and route aggregation (`registry/tools`).
- Root config: `pnpm-workspace.yaml`, `eslint.config.ts`, `vitest.config.ts`,
  `commitlint.config.ts`, `.husky/`, `.github/workflows/`.

## Key Commands in main
- `pnpm dev` / `pnpm build`: Run Vite dev/build for `@apps/web`.
- `pnpm lint`: `oxlint` + `eslint` with fixes.
- `pnpm format`: Prettier on `**/src/**/*.{ts,vue}`.
- `pnpm type-check`: `vue-tsc --build --noEmit`.
- `pnpm test:unit`: Vitest component/unit tests (`*.dom.test.ts`).
- `pnpm test:e2e`: Playwright (`apps/web/e2e`).

## Frontend Entry + Routing
- Entry: `apps/web/src/main.ts` creates Vue app, registers router, Pinia, i18n,
  and `<head>` management.
- Routing: `apps/web/src/router/routes.ts` pulls tool routes from
  `registry/tools/src/routes.ts` and adds language-prefixed aliases based on
  `shared/locale`.
- PWA: `apps/web/vite.config.ts` uses `vite-plugin-pwa` and a custom sitemap plugin.

## Tool + i18n Conventions (from main AGENTS)
- Tool packages follow `tools/<domain>/<tool>/src` with `info.ts`, `routes.ts`,
  `index.ts`, and `*View.vue`.
- `info.ts` includes `toolID`, `path`, `tags`, `features`, and `meta` for 25 languages.
- i18n is strict: all 25 languages must exist in `info.ts` and Vue `<i18n>` blocks.
- Icons are imported from `@vicons/<library>/<IconName>` (default export).
- Download buttons are real anchors with `download` + `href` (no
  `document.createElement('a')`).

## Testing + Quality Gates
- Vitest config (`vitest.config.ts`) runs DOM tests with `happy-dom`, applies Vue
  i18n plugin, and enforces typechecking via `vue-tsc`.
- Playwright config (`apps/web/playwright.config.ts`) runs against dev/preview
  servers and uses multi-browser projects.
- Commit messages follow Conventional Commits (`commitlint.config.ts` + Husky).
- Lint-staged runs eslint + prettier and Vitest related tests on staged TS/Vue files.

## Dependencies + Workspace
- Workspace packages are referenced via scopes like `@shared/ui`, `@utils/ip`,
  `@registry/tools`.
- Dependency versions are pinned via pnpm catalogs in `pnpm-workspace.yaml`.
