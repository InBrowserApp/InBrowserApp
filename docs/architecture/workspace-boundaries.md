# Workspace Boundaries

Issue [#316](https://github.com/InBrowserApp/InBrowserApp/issues/316) established the rewrite workspace layout. The current rewrite narrows those boundaries further around a smaller tool contract.

## Top-level layout

```text
apps/
  web/

packages/
  ui/
  tool-sdk/
  tool-registry/
  lib/
    <domain>/

tools/
  <tool-slug>/
```

## Ownership

### `apps/web`

- Owns Astro routes, layouts, page metadata, static site generation, and deployment configuration.
- Consumes generated registry data from `packages/tool-registry`.
- Resolves tool pages through the fixed `tools/<slug>/index.astro` convention.
- Must not reach into tool-local copy, sections, workers, or private helpers.

### `packages/ui`

- Owns `shadcn/ui` source, design tokens, and stable shared interface patterns.
- Must remain reusable presentation code.
- Must not import from `apps/web`, `tools/*`, or `packages/tool-registry`.

### `packages/tool-sdk`

- Owns the minimal, framework-agnostic tool contract.
- Owns `defineTool()`, shared tool types, and localized meta validation.
- Must not depend on app shell, UI packages, registry code, or tool implementations.

### `packages/tool-registry`

- Owns manifest discovery, localized meta discovery, generated registries, static path generation, and search indexes.
- May depend on `packages/tool-sdk`.
- Is source-only. Generated registry files are source artifacts, not published build output.

### `packages/lib/<domain>`

- Reserved for high-value, framework-free domain libraries.
- Promotion into `packages/lib/*` requires either cross-tool reuse or correctness-sensitive logic.
- Shared libraries must not depend on the app shell, UI, registry code, or tool implementations.
- Shared libraries are source-only until a real packaging need appears.

### `tools/<tool-slug>`

- Each leaf tool is self-contained.
- Tools are directories, not workspace packages.
- The shell only relies on three hard conventions:
  - `manifest.ts`
  - `index.astro`
  - `meta/en.json`
- Everything else is tool-local, including `client.tsx`, `copy/`, `sections/`, `components/`, `core/`, and `workers/`.
- Tools may depend on `packages/ui`, `packages/tool-sdk`, and `packages/lib/*`.
- Tools must not depend on `apps/web` or `packages/tool-registry`.

## Tool-local vs shared code

Default to tool-local code. Promote logic into `packages/lib/*` only when all of the following are true:

1. The code is used by at least three tools, or it is correctness-sensitive enough to justify central ownership.
2. The code is framework-free and UI-free.
3. The code has a clear domain boundary such as `image`, `dns`, `uuid`, or `encoding`.
4. Central ownership lowers long-term maintenance cost more than duplication does.

Anything that is primarily page composition, copy loading, markdown section layout, form state, interaction flow, or one-off helper logic should stay inside the tool directory.

## Enforcement

- `tools/*` are intentionally excluded from `pnpm-workspace.yaml`, so they do not become independent workspace packages again.
- `.dependency-cruiser.json` forbids direct imports that violate the app/UI/sdk/registry/tool boundaries.
- The registry package reserves `src/generated/` for codegen output.
- Root scripts call the app directly instead of routing build orchestration through `turbo`.
