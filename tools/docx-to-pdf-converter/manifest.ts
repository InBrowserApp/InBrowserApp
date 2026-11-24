import { defineTool } from "@workspace/tool-sdk"

export const tool = defineTool({
  category: "document",
  secondaryCategories: ["pdf"],
  icon: "file-text",
  tags: [
    "docx",
    "docm",
    "dotx",
    "dotm",
    "word",
    "pdf",
    "document",
    "converter",
  ],
})
