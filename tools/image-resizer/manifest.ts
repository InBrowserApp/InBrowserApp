import {
  DEFAULT_REQUIRED_TOOL_LANGUAGES,
  createLocalizedContentFiles,
  createLocalizedMessageFiles,
  defineTool,
} from "@workspace/tool-sdk"

export const tool = defineTool({
  id: "image-resizer",
  slug: "image-resizer",
  category: "image",
  group: "media",
  icon: "image",
  tags: ["image", "resize", "scale", "photo", "export"],
  searchTerms: [
    "image resizer",
    "photo resize",
    "browser image resize",
    "png jpeg webp export",
  ],
  features: ["offline", "download", "preview"],
  messages: createLocalizedMessageFiles(DEFAULT_REQUIRED_TOOL_LANGUAGES),
  content: createLocalizedContentFiles(DEFAULT_REQUIRED_TOOL_LANGUAGES),
  page: "./index.astro",
  island: {
    path: "./client.tsx",
  },
})
