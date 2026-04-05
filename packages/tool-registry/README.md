# `@workspace/tool-registry`

`packages/tool-registry` turns `tools/*/manifest.ts` files into generated platform data.

## Responsibilities

- scans `tools/*/manifest.ts`
- validates manifest shape and slug uniqueness
- requires a fixed `index.astro` entrypoint per tool
- loads and validates `meta/*.json`
- writes generated outputs into `src/generated/`

## Generated outputs

- `registry.ts`: generated tool registry keyed by slug
- `static-paths.ts`: language-aware static path entries
- `search-index.ts`: localized search records based on tool metadata

## Usage

Run the generator from the repo root:

```bash
pnpm tool-registry:generate
```

Root `build`, `typecheck`, and `dev` commands run the generator first so the generated source stays in sync with tool manifests and localized meta files.
