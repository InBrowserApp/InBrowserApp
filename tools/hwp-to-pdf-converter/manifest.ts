import { defineTool } from "@workspace/tool-sdk"

export const tool = defineTool({
  category: "document",
  secondaryCategories: ["pdf"],
  icon: "file-text",
  tags: ["hwp", "hwpx", "hangul", "hancom", "pdf", "document", "converter"],
})
