# InBrowser Web

A Vue 3 + TypeScript monorepo of privacy-first, in-browser tools.

## Project Structure

- `apps/web` - Main web app (UI shell, routing)
- `tools` - Individual tool implementations
- `shared` - Shared UI, icons, i18n, tool interfaces
- `utils` - Pure TypeScript utilities and algorithms
- `registry` - Tool registry

## Quick Start

```bash
pnpm install
pnpm dev
```

Build for production:

```bash
pnpm build
```

## Common Scripts

- `pnpm lint` - Run oxlint + eslint (with fixes)
- `pnpm format` - Format source files
- `pnpm type-check` - Run Vue/TS type checks
- `pnpm test:unit` - Run unit tests (Vitest)
- `pnpm test:e2e` - Run Playwright e2e tests

## Adding a Tool

1. Add core logic in `utils/<tool-name>/`.
2. Add UI in `tools/<tool-name>/`.
3. Register the tool in `registry/`.

## Contributing

1. Create a branch: `git checkout -b feat/<topic>`
2. Make changes following existing patterns.
3. Run `pnpm lint` and `pnpm test:unit`.
4. Open a pull request with a short summary.
