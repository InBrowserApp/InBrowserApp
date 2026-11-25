import { defineTool } from "@workspace/tool-sdk"

export const tool = defineTool({
  category: "document",
  secondaryCategories: ["pdf"],
  icon: "file-text",
  tags: [
    "doc",
    "docx",
    "docm",
    "dotx",
    "dotm",
    "word",
    "microsoft word",
    "pdf",
    "document",
    "converter",
  ],
})
