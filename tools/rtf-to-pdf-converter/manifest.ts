import { defineTool } from "@workspace/tool-sdk"

export const tool = defineTool({
  category: "document",
  secondaryCategories: ["pdf"],
  icon: "file-text",
  tags: ["rtf", "rich-text", "pdf", "document", "converter"],
})
