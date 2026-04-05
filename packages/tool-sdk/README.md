# `@workspace/tool-sdk`

`packages/tool-sdk` owns the framework-agnostic tool contract for the Astro rewrite.

## Responsibilities

- defines the stable tool manifest shape
- defines localized message/content asset references
- validates required metadata and required language coverage
- exposes `defineTool()` for authoring manifests
- keeps UI, Astro routing, and framework component types out of the contract

## Required languages

The current rewrite baseline requires:

- `en`
- `zh-CN`

Every tool manifest must provide message assets for those languages. Long-form content is optional, but if a tool opts into content it must cover the required languages as well.

## Example

```ts
import {
  DEFAULT_REQUIRED_TOOL_LANGUAGES,
  createLocalizedContentFiles,
  createLocalizedMessageFiles,
  defineTool,
} from "@workspace/tool-sdk"

export const tool = defineTool({
  id: "base64-encoder-decoder",
  slug: "base64-encoder-decoder",
  category: "encoding",
  group: "encoding",
  icon: "binary",
  tags: ["encoding", "text"],
  searchTerms: ["base64 encoder", "base64 decoder"],
  features: ["offline", "copy"],
  messages: createLocalizedMessageFiles(DEFAULT_REQUIRED_TOOL_LANGUAGES),
  content: createLocalizedContentFiles(DEFAULT_REQUIRED_TOOL_LANGUAGES),
  island: {
    path: "./client.tsx",
  },
})
```

## Message catalog validation

`tool-sdk` also validates the actual message catalogs once they are loaded by tooling such as the registry generator:

```ts
import { assertToolMessageCatalogs } from "@workspace/tool-sdk"

assertToolMessageCatalogs({
  en: {
    meta: {
      name: "Base64 Encoder / Decoder",
      description: "Encode and decode Base64 strings in your browser.",
    },
  },
  "zh-CN": {
    meta: {
      name: "Base64 编码 / 解码",
      description: "在浏览器中进行 Base64 编码和解码。",
    },
  },
})
```
