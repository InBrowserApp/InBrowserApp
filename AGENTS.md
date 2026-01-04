# Repository Guidelines

## Project Structure & Module Organization
- `apps/web/`: Main Vue 3 + Vite application.
- `shared/`: Shared UI components, icons, locale, and tool interfaces.
- `tools/`: Individual tool UIs (grouped by domain like `tools/web/`, `tools/uuid/`).
- `utils/`: Pure TypeScript utilities (no UI dependencies).
- `registry/`: Tool registry and route aggregation.
- Tests live alongside code as `*.dom.test.ts` in `apps/`, `shared/`, `tools/`, and `utils/`.

## Build, Test, and Development Commands
- `pnpm install`: Install dependencies (run first).
- `pnpm dev`: Start dev server (default at `localhost:5173`).
- `pnpm build`: Production build.
- `pnpm lint`: Run oxlint + eslint with auto-fix.
- `pnpm lint-check`: Check lint without fixing.
- `pnpm format`: Run Prettier formatting.
- `pnpm format-check`: Check format without fixing.
- `pnpm type-check`: Run `vue-tsc` type checking.
- `pnpm test:unit`: Run unit/component tests via Vitest.
- `pnpm test:e2e`: Run Playwright E2E tests (requires `pnpm exec playwright install`).
- `pnpm -F <package-name> <command>`: Run commands in a specific workspace package.

## Coding Style & Naming Conventions
- TypeScript + Vue Composition API with `<script setup lang="ts">`.
- Prettier: no semicolons, single quotes, `printWidth: 100`.
- Use path aliases: `@shared/*`, `@tools/*`, `@utils/*`, `@registry/*`.
- Tool packages follow `tools/<domain>/<tool-slug>/src` with `info.ts`, `routes.ts`, and a `*View.vue`.

## Tool Creation & Registration
- Directory structure: `tools/<domain>/<tool-slug>/src` with `info.ts`, `routes.ts`, `<ToolName>View.vue`, `components/`, and `index.ts`.
- `info.ts`: `toolID`, `path`, `tags`, `features`, and `meta` (all 25 languages required). Add `features: ['offline']` when no network is needed.
- `routes.ts`: Use `ToolRoute`; the route `path` must match `info.ts`.
- Register: `pnpm -F @registry/tools add --workspace @tools/<tool-slug>`, then update `registry/tools/src/index.ts` and `registry/tools/src/routes.ts`.

## Internationalization
- 25 languages required in `info.ts` meta.
- Vue `<i18n>` blocks require all 25 languages.
- i18n JSON must be strictly valid (double quotes, no trailing commas).

## Testing Guidelines
- Test framework: Vitest + Vue Test Utils (`*.dom.test.ts`).
- Prefer DOM-focused component tests; utilities can use standard unit tests.
- Run tests with `pnpm test:unit`.

## Commit & Pull Request Guidelines
- Conventional Commits are required (e.g., `feat(tools): add xxx tool`, `test(ui): add dom tests`).
- PRs should include a clear summary and the commands/tests run.
- Include screenshots or screen recordings for UI changes when applicable.
- `main` is protected; create a new branch before committing.
- All commit messages and PR titles must be in English.

## Architecture Notes
- Routes flow: `apps/web/src/router/routes.ts` → `registry/tools/src/routes.ts` → each tool’s `routes.ts`.
- Tools should add `features: ['offline']` when they run without network access.
