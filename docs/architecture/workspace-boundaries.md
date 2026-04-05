# Workspace Boundaries

Issue [#316](https://github.com/InBrowserApp/InBrowserApp/issues/316) establishes the rewrite workspace layout and the hard boundaries between the app shell, shared packages, and self-contained tools.

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
- Must not import tool implementation files directly.
- Should consume tools through `packages/tool-registry`.

### `packages/ui`

- Owns `shadcn/ui` source, design tokens, and stable shared interface patterns.
- Must remain reusable presentation code.
- Must not import from `apps/web`, `tools/*`, or `packages/tool-registry`.

### `packages/tool-sdk`

- Owns the framework-agnostic tool contract.
- Owns `defineTool()`, shared tool types, localized asset helpers, and manifest/message validation.
- Must not depend on app shell, UI packages, registry code, or tool implementations.

### `packages/tool-registry`

- Owns manifest discovery, generated registries, static path generation, and search indexes.
- Hand-written code may depend on `packages/tool-sdk`.
- Generated code under `src/generated/` may import tool manifests or entries.
- This package is source-only. Generated registry files are source artifacts, not published build output.

### `packages/lib/<domain>`

- Reserved for high-value, framework-free domain libraries.
- Promotion into `packages/lib/*` requires either cross-tool reuse or correctness-sensitive logic.
- Shared libraries must not depend on the app shell, UI, registry code, or tool implementations.
- Shared libraries are source-only until a real packaging need appears.

### `tools/<tool-slug>`

- Each leaf tool is self-contained.
- Tools are directories, not workspace packages.
- Tool-local code owns interaction logic, private helpers, browser APIs, workers, and localized content.
- Tools may depend on `packages/ui`, `packages/tool-sdk`, and `packages/lib/*`.
- Tools must not depend on `apps/web` or `packages/tool-registry`.

## Tool-local vs shared code

Default to tool-local code. Promote logic into `packages/lib/*` only when all of the following are true:

1. The code is used by at least three tools, or it is correctness-sensitive enough to justify central ownership.
2. The code is framework-free and UI-free.
3. The code has a clear domain boundary such as `image`, `dns`, `uuid`, or `encoding`.
4. Central ownership lowers long-term maintenance cost more than duplication does.

Anything that is primarily page composition, form state, interaction flow, or one-off helper logic should stay inside the tool directory.

## Enforcement

- `tools/*` are intentionally excluded from `pnpm-workspace.yaml`, so they do not become independent workspace packages again.
- `.dependency-cruiser.json` forbids direct imports that violate the app/UI/sdk/registry/tool boundaries.
- The registry package reserves `src/generated/` for codegen output that may point at tool entry files.
- Root scripts call the app directly instead of routing build orchestration through `turbo`.
