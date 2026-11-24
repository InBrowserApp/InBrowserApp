import { defineTool } from "@workspace/tool-sdk"

export const tool = defineTool({
  category: "document",
  secondaryCategories: ["pdf"],
  icon: "file-text",
  tags: ["html", "htm", "xhtml", "pdf", "document", "converter"],
})
