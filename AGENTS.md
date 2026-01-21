# Repository Guidelines

## Project Structure & Module Organization
This repo is a pnpm workspace. The Astro web app lives in `apps/web/`, with routes in
`apps/web/src/pages`, layouts in `apps/web/src/layouts`, global styles in
`apps/web/src/styles`, and static assets in `apps/web/public`. Shared packages are in
`packages/tools/*` (i18n, registry, shared utilities). Standalone tool packages live under
`tools/`, for example `tools/converters/roman-numeral-converter/` with its own `src/`,
`components/`, and `i18n/`.

## Build, Test, and Development Commands
- `pnpm install` installs workspace dependencies.
- `pnpm dev` starts the Astro dev server for `@inbrowserapp/web` (`localhost:4321`).
- `pnpm build` builds the web app; `pnpm preview` serves the production build locally.
- `pnpm lint` / `pnpm lint:fix` run ESLint; `pnpm format` / `pnpm format:check` run Prettier.
- `pnpm type-check` runs `astro check`.
- `pnpm test` (watch) or `pnpm test:run` (CI) runs Vitest.
- Use `pnpm -F @inbrowserapp/web <script>` for app-specific tasks like `build:check` or
  `deploy:cloudflare-workers`.

## Coding Style & Naming Conventions
- Prettier is the source of truth: 2-space indentation, single quotes, no semicolons, and
  100-character lines.
- ESLint enforces TS/React/Astro rules; fix warnings before opening a PR.
- File naming follows the routing model: pages live in `src/pages` with route segments like
  `[lang]/tools/index.astro`. Use PascalCase for components and layouts (e.g.,
  `BaseLayout.astro`, `RomanConverter.tsx`).

## Testing Guidelines
- Vitest with `happy-dom` is configured; tests live alongside code and use `*.test.ts` or
  `*.spec.ts`.
- Add tests for new utilities or converter logic and keep fixtures close to the module.

## Commit & Pull Request Guidelines
- Commit messages follow Conventional Commits (e.g., `feat:`, `fix:`, `chore:`, `test:`).
- PRs should include a concise summary, test commands run, and screenshots for UI changes.
  Link relevant issues and call out deployment/config updates (for example,
  `apps/web/wrangler.jsonc`).
