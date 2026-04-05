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
  group: "text",
  icon: "binary",
  tags: ["base64", "encoding", "decoding", "text", "unicode"],
  searchTerms: [
    "base64 encoder",
    "base64 decoder",
    "text encoding",
    "binary text converter",
  ],
  features: ["offline", "unicode-safe", "copy"],
  messages: createLocalizedMessageFiles(DEFAULT_REQUIRED_TOOL_LANGUAGES),
  content: createLocalizedContentFiles(DEFAULT_REQUIRED_TOOL_LANGUAGES),
  page: "./index.astro",
  island: {
    path: "./client.tsx",
  },
})
