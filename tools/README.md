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
    tsconfig.json
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

`manifest.ts` should export a named `tool` constant created with `defineTool()` from `@workspace/tool-sdk`.

`index.astro` is the tool's composition root. The app shell passes only `lang`; the tool decides how to load messages, sections, client code, and any private helpers.

Tools may depend on `@workspace/tool-sdk`, `@workspace/ui`, and `packages/lib/*`. They declare `react`, `react-dom`, and `astro` as peer dependencies, satisfied by `apps/web`. Tool-specific runtime deps (e.g. `ajv`, `pdf-lib`) go directly into the tool's `package.json`. Tools must not import from `apps/web` or `@workspace/tool-registry`.

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
       "astro": "^5.0.0",
       "react": "^19.0.0",
       "react-dom": "^19.0.0"
     }
   }
   ```
3. Use this `tsconfig.json`:
   ```json
   {
     "extends": "../../tsconfig.base.json",
     "include": ["**/*.ts", "**/*.tsx", "**/*.astro"]
   }
   ```
4. Add `"@tool/<slug>": "workspace:*"` to `packages/tool-registry/package.json` dependencies (the registry needs this dep edge so its generated `page-loaders.ts` can import the tool).
5. Run `pnpm install` to materialize the workspace symlinks.
6. Run `pnpm tool-registry:generate` to refresh the generated registry, static paths, search index, and page loaders.
