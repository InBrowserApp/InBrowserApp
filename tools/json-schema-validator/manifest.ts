import {
  DEFAULT_REQUIRED_TOOL_LANGUAGES,
  createLocalizedContentFiles,
  createLocalizedMessageFiles,
  defineTool,
} from "@workspace/tool-sdk"

export const tool = defineTool({
  id: "json-schema-validator",
  slug: "json-schema-validator",
  category: "validator",
  group: "json",
  icon: "braces",
  tags: ["json", "schema", "validator", "developer", "api"],
  searchTerms: [
    "json schema validator",
    "validate json",
    "schema validation",
    "json draft-07",
  ],
  features: ["offline", "copy", "format validation"],
  messages: createLocalizedMessageFiles(DEFAULT_REQUIRED_TOOL_LANGUAGES),
  content: createLocalizedContentFiles(DEFAULT_REQUIRED_TOOL_LANGUAGES),
  page: "./index.astro",
  island: {
    path: "./client.tsx",
  },
})
