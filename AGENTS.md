# Repository Guidelines

## Project Structure & Module Organization
- `apps/web/`: Main Vue 3 + Vite application.
- `shared/`: Shared UI components, locale, and tool interfaces.
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

## Dependency Management
- Use pnpm catalogs for third-party dependencies; prefer `catalog:` specifiers in package.json.
- Install new deps via `pnpm add --save-catalog <pkg>` (use `-F <package>` for workspace packages).
- Keep `ua-parser-js` on v1 due to license constraints.

## Coding Style & Naming Conventions
- TypeScript + Vue Composition API with `<script setup lang="ts">`.
- Prettier: no semicolons, single quotes, `printWidth: 100`.
- Use path aliases: `@shared/*`, `@tools/*`, `@utils/*`, `@registry/*`.
- Tool packages follow `tools/<domain>/<tool-slug>/src` with `info.ts`, `routes.ts`, and a `*View.vue`.
- Split tool UI logic into `components/`; keep the main `*View.vue` focused on layout and composition.
- Keep components small and single-purpose; split by responsibility before a file grows too long.
- Download buttons must be real anchors: `n-button tag="a"` with `download` and `href` from `useObjectUrl`, and no `document.createElement('a')`.

## Icon Usage
- Import icons directly from `@vicons/<library>/<IconName>` (default export), e.g. `@vicons/fluent/Search16Filled`.
- Supported libraries include `@vicons/fluent`, `@vicons/carbon`, `@vicons/tabler`, `@vicons/ionicons5`, `@vicons/material`, `@vicons/fa`.
- For Simple Icons, use named exports from `vue3-simple-icons`, e.g. `import { GitIcon } from 'vue3-simple-icons'`.
- In `info.ts`, export the tool icon directly, e.g. `export { default as icon } from '@vicons/fluent/SomeIcon'`.
- Do not use `@shared/icons` (package removed).

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
- For new tool packages, coverage must be 100% for that tool package only (not the whole repo) before pushing and creating a PR.

## Worktrees & PR Checks
- For any new feature, fix, or chore, create a new worktree under `../InBrowser-worktrees/` named like `<type>_xxxxx` (example: `../InBrowser-worktrees/feat_add-tool-a`).
- When creating a PR and when pushing to the PR branch, check PR status: confirm it is mergeable, then watch checks to completion.
- If checks fail, fix the issues and rerun until green.
- After checks complete, provide the full staging deployment URL without language prefix. If tool-specific, include the full path (example: `https://xxxx/tools/tool-A`); if the change is global, provide the base staging URL.
- After merge, delete the worktree and its branch, then pull `main` to the latest.

## Commit & Pull Request Guidelines
- Conventional Commits are required (e.g., `feat(tools): add xxx tool`, `test(ui): add dom tests`).
- PRs should include a clear summary and the commands/tests run.
- Include screenshots or screen recordings for UI changes when applicable.
- `main` is protected; create a new branch before committing.
- All commit messages and PR titles must be in English.

## Architecture Notes
- Routes flow: `apps/web/src/router/routes.ts` → `registry/tools/src/routes.ts` → each tool’s `routes.ts`.
- Tools should add `features: ['offline']` when they run without network access.
