import { defineTool } from "@workspace/tool-sdk"

export const tool = defineTool({
  category: "pdf",
  secondaryCategories: ["text"],
  icon: "file-text",
  tags: ["pdf", "text", "extractor", "document", "offline"],
})
