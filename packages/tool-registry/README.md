# `@workspace/tool-registry`

`packages/tool-registry` turns `tools/*` workspace packages into generated platform data that the app shell consumes.

## Responsibilities

- globs `tools/*/package.json`, validates `name === "@tool/" + dirname`, and dynamically imports each manifest via `await import("@tool/<slug>/manifest")` (no filesystem-path imports of tool source)
- validates manifest shape and slug uniqueness
- loads and validates `meta/<lang>.json`
- writes generated outputs into `src/generated/`
- auto-syncs the `@tool/*` block of its own `package.json` to match the discovered tools (see `syncRegistryPackageDependencies` in `src/generate/io.ts`); manual edits to that block are overwritten on the next run

## Generated outputs

- `registry.ts` — generated tool registry keyed by slug
- `static-paths.ts` — language-aware static path entries
- `search-index.ts` — localized search records based on tool metadata
- `page-loaders.ts` — `Record<slug, () => Promise<{ default: AstroComponentFactory }>>` of explicit `import("@tool/<slug>/page")` calls. The app shell uses this map; there is no `import.meta.glob` of tools anywhere in `apps/web`.

The generator only writes a file when its contents change (`writeFileIfChanged`), so a no-op run produces no diff.

## Usage

Run the generator from the repo root:

```bash
pnpm tool-registry:generate
```

Root `build`, `typecheck`, and `dev` all run the generator first, so the generated source stays in sync with tool manifests and localized meta files on the day-to-day hot path. CI re-runs the generator and fails on any diff under `src/generated/` or in this package's `package.json` `@tool/*` block.
