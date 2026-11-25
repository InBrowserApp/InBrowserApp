import { defineTool } from "@workspace/tool-sdk"

export const tool = defineTool({
  category: "ebook",
  secondaryCategories: ["pdf"],
  icon: "archive",
  tags: ["pdf", "cbz", "zip", "comic", "manga", "scan", "converter"],
})
