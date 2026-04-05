import type { ToolSearchIndexEntry } from "../types"

export const toolSearchIndex: readonly ToolSearchIndexEntry[] = [
  {
    id: "base64-encoder-decoder",
    slug: "base64-encoder-decoder",
    category: "encoding",
    group: "text",
    icon: "binary",
    tags: ["base64", "encoding", "decoding", "text", "unicode"],
    features: ["offline", "unicode-safe", "copy"],
    searchTerms: [
      "base64 encoder",
      "base64 decoder",
      "text encoding",
      "binary text converter",
    ],
    locales: {
      en: {
        name: "Base64 Encoder and Decoder",
        description:
          "Encode plain text to Base64 and decode Base64 back to Unicode text directly in your browser.",
      },
      "zh-CN": {
        name: "Base64 编码器 / 解码器",
        description:
          "直接在浏览器中把纯文本编码为 Base64，或把 Base64 解码回 Unicode 文本。",
      },
    },
  },
  {
    id: "image-resizer",
    slug: "image-resizer",
    category: "image",
    group: "media",
    icon: "image",
    tags: ["image", "resize", "scale", "photo", "export"],
    features: ["offline", "download", "preview"],
    searchTerms: [
      "image resizer",
      "photo resize",
      "browser image resize",
      "png jpeg webp export",
    ],
    locales: {
      en: {
        name: "Image Resizer",
        description:
          "Resize image dimensions directly in your browser and export the result as PNG, JPEG, or WebP.",
      },
      "zh-CN": {
        name: "图片尺寸缩放",
        description: "直接在浏览器中缩放图片尺寸，并导出为 PNG、JPEG 或 WebP。",
      },
    },
  },
  {
    id: "json-schema-validator",
    slug: "json-schema-validator",
    category: "validator",
    group: "json",
    icon: "braces",
    tags: ["json", "schema", "validator", "developer", "api"],
    features: ["offline", "copy", "format validation"],
    searchTerms: [
      "json schema validator",
      "validate json",
      "schema validation",
      "json draft-07",
    ],
    locales: {
      en: {
        name: "JSON Schema Validator",
        description:
          "Validate JSON data against a JSON Schema with draft-aware validation and readable error output.",
      },
      "zh-CN": {
        name: "JSON Schema 校验器",
        description:
          "根据 JSON Schema 校验 JSON 数据，支持草案识别，并输出可读的错误信息。",
      },
    },
  },
]
