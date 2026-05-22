# Tools Directory

Each leaf tool lives under `tools/<tool-slug>/` as a self-contained workspace package named `@tool/<tool-slug>`. The package name **must** match the directory name; the registry generator refuses to run otherwise.

The shell relies on these hard conventions:

- `package.json` with `"name": "@tool/<slug>"` and exports for `"./manifest"` and `"./page"`.
- `manifest.ts`
- `index.astro`
- `meta/en.json`

Everything else stays tool-local and may vary by tool.

The current target shape is:

```text
tools/
  <tool-slug>/
    package.json
    manifest.ts
    index.astro
    meta/
      en.json
      zh-CN.json
    client.tsx              # optional
    messages/               # optional
      en.json
      zh-CN.json
    sections/               # optional
      intro/
        en.md
        zh-CN.md
    components/             # optional
    core/
    workers/                # optional
```

Tools do **not** ship a `tsconfig.json`. The repo's root `tsconfig.json` includes `tools/**` and is what `pnpm typecheck` runs against — a single `tsc --noEmit` covers every package, tool, and test file in the workspace.

Tools also do **not** define their own `lint`, `format`, or `typecheck` scripts. Those are workspace-wide CLI tools (`oxlint`, `oxfmt`, `tsc`) and are owned by the root `package.json` only.

`manifest.ts` should export a named `tool` constant created with `defineTool()` from `@workspace/tool-sdk`.

`index.astro` is the tool's composition root. The app shell passes only `lang`; the tool decides how to load messages, sections, client code, and any private helpers.

Tools may depend on `@workspace/tool-sdk`, `@workspace/ui`, and `packages/lib/*`. They declare `react`, `react-dom`, and `astro` as peer dependencies, satisfied by `apps/web`. Tool-specific runtime deps (e.g. `ajv`, `pdf-lib`) go directly into the tool's `package.json`. Tools must not import from `apps/web` or `@workspace/tool-registry`.

**All external dependency versions go through the pnpm catalog** in `pnpm-workspace.yaml`. New deps get added to the catalog first, then referenced from the tool's `package.json` as `"foo": "catalog:"` — never inline a version. This includes `peerDependencies`.

## Adding a new tool

1. Create `tools/<slug>/` with the files above.
2. Use this minimal `package.json`:
   ```json
   {
     "name": "@tool/<slug>",
     "version": "0.0.0",
     "private": true,
     "type": "module",
     "exports": {
       "./manifest": "./manifest.ts",
       "./page": "./index.astro"
     },
     "dependencies": {
       "@workspace/tool-sdk": "workspace:*",
       "@workspace/ui": "workspace:*"
     },
     "peerDependencies": {
       "astro": "catalog:",
       "react": "catalog:",
       "react-dom": "catalog:"
     }
   }
   ```
3. Run `pnpm tool-registry:generate`. The generator auto-syncs the `@tool/*` block of `packages/tool-registry/package.json` to match the discovered tools (see `syncRegistryPackageDependencies` in `packages/tool-registry/src/generate/io.ts`), so do **not** hand-edit that block — it will be overwritten on the next run.
4. If the generator reports that the registry's `package.json` was out of sync, it has already rewritten it. Run `pnpm install` to materialize the workspace symlink for the new `@tool/<slug>`, then re-run `pnpm tool-registry:generate`. The second run refreshes `src/generated/{registry,static-paths,search-index,page-loaders}.ts`.
5. Commit both `packages/tool-registry/package.json` (if it changed) and any updates under `packages/tool-registry/src/generated/`.

`pnpm build`, `pnpm dev`, and `pnpm typecheck` all run `pnpm tool-registry:generate` first, so the generator is on the day-to-day hot path — if you forget to commit the generated diffs, CI fails the "Verify generated tool registry is up to date" step.
