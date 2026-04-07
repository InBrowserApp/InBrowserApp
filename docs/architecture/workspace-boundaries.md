# Workspace Boundaries

Issue [#316](https://github.com/InBrowserApp/InBrowserApp/issues/316) established the rewrite workspace layout. The current rewrite narrows those boundaries further around a smaller tool contract. As of `refactor: promote tools/* to workspace packages`, each leaf tool is also a private workspace package scoped under `@tool/<slug>`, so per-tool runtime dependencies live in the tool's own `package.json` instead of being phantom-resolved through the root.

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
- Must not reach into tool-local messages, sections, workers, or private helpers.

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
- Tools **are** workspace packages, named `@tool/<slug>` where `<slug>` is the directory name. The generator validates `name === "@tool/" + dirname` and refuses to generate if they disagree.
- The hard conventions are:
  - `package.json` declaring `name`, `exports["./manifest"]`, and `exports["./page"]`.
  - `manifest.ts`
  - `index.astro`
  - `meta/en.json`
- Everything else is tool-local, including `client.tsx`, `messages/`, `sections/`, `components/`, `core/`, and `workers/`.
- Tools declare their own runtime dependencies. Shared deps come through `@workspace/tool-sdk` and `@workspace/ui` (both `workspace:*`). `react`, `react-dom`, and `astro` are declared as **peer dependencies**, satisfied by `apps/web`.
- Tools must not depend on `apps/web` or `packages/tool-registry`.

## Tool-local vs shared code

Default to tool-local code. Promote logic into `packages/lib/*` only when all of the following are true:

1. The code is used by at least three tools, or it is correctness-sensitive enough to justify central ownership.
2. The code is framework-free and UI-free.
3. The code has a clear domain boundary such as `image`, `dns`, `uuid`, or `encoding`.
4. Central ownership lowers long-term maintenance cost more than duplication does.

Anything that is primarily page composition, copy loading, markdown section layout, form state, interaction flow, or one-off helper logic should stay inside the tool directory.

## Enforcement

- `tools/*` are workspace packages. Each tool's `package.json` declares its own dependencies; the dep graph stays honest and adding a tool-specific runtime dep no longer pollutes the root.
- `.dependency-cruiser.json` forbids direct imports that violate the app/UI/sdk/registry/tool boundaries. The registry's `src/generated/` directory is the only place allowed to import from `@tool/*` packages.
- The registry package reserves `src/generated/` for codegen output, including the page-loader map that the app shell consumes.
- Root scripts call the app directly instead of routing build orchestration through `turbo`.
