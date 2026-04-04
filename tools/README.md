# Tools Directory

Each leaf tool lives under `tools/<tool-slug>/` as a self-contained directory.

Tools are intentionally **not** workspace packages. A tool owns its own:

- manifest
- Astro entrypoint
- React client entrypoint
- localized short strings
- localized long-form content
- private components
- private logic
- workers
- tests

The target shape is:

```text
tools/
  <tool-slug>/
    manifest.ts
    index.astro
    client.tsx
    messages/
      en.json
      zh-CN.json
    content/
      en.mdx
      zh-CN.mdx
    components/
    core/
    workers/
    tests/
```

Tools may depend on `packages/ui`, `packages/tool-sdk`, and `packages/lib/*`, but they must not import from `apps/web`.
