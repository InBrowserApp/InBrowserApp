# `@workspace/tool-sdk`

`packages/tool-sdk` owns the minimal, framework-agnostic tool contract for the Astro rewrite.

## Responsibilities

- defines the stable tool manifest shape
- defines the localized meta shape used by search, routes, and SEO
- exposes `defineTool()` for authoring manifests
- validates manifests and localized meta catalogs
- keeps UI, Astro routing, and tool-internal structure out of the contract

## Contract shape

The shell should know as little as possible about tool internals.

`manifest.ts` only declares stable, non-localized discovery metadata:

```ts
import { defineTool } from "@workspace/tool-sdk"

export const tool = defineTool({
  category: "text",
  icon: "binary",
  tags: ["base64", "encoding", "unicode"],
})
```

Localized discovery metadata lives in `meta/<lang>.json`:

```json
{
  "name": "Base64 Encoder and Decoder",
  "description": "Encode plain text to Base64 and decode Base64 back to Unicode text directly in your browser."
}
```

## What is intentionally not in the contract

The following stay tool-local and are discovered only by the tool's own `index.astro` entrypoint:

- `client.tsx`
- `copy/`
- `sections/`
- `components/`
- `workers/`
- any other internal file layout

## Required languages

The default baseline requires `en` localized meta. Additional languages may be added tool by tool.
