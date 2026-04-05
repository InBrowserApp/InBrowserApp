# Tools Directory

Each leaf tool lives under `tools/<tool-slug>/` as a self-contained directory.

Tools are intentionally **not** workspace packages. The shell depends on only three hard conventions:

- `manifest.ts`
- `index.astro`
- `meta/en.json`

Everything else stays tool-local and may vary by tool.

The current target shape is:

```text
tools/
  <tool-slug>/
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
    tests/                  # optional
```

`manifest.ts` should export a named `tool` constant created with `defineTool()` from `@workspace/tool-sdk`.

`index.astro` is the tool's composition root. The app shell passes only `lang`; the tool decides how to load messages, sections, client code, and any private helpers.

Tools may depend on `packages/ui`, `packages/tool-sdk`, and `packages/lib/*`, but they must not import from `apps/web`.
