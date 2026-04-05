# `@workspace/tool-registry`

`packages/tool-registry` turns `tools/*/manifest.ts` files into generated platform data.

## Responsibilities

- scans `tools/*/manifest.ts`
- validates manifest shape and uniqueness
- loads localized message catalogs for generated search data
- writes generated outputs into `src/generated/`

## Generated outputs

- `registry.ts`: typed manifest registry and lookup maps
- `static-paths.ts`: language-aware static path entries
- `search-index.ts`: localized search index data

## Usage

Run the generator from the repo root:

```bash
pnpm tool-registry:generate
```

Root `build`, `typecheck`, and `dev` commands run the generator first so the generated source stays in sync with manifests.
