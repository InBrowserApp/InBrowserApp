import { defineTool } from "@workspace/tool-sdk"

export const tool = defineTool({
  category: "ebook",
  secondaryCategories: ["pdf"],
  icon: "book-open",
  tags: ["pdf", "epub", "ebook", "ocr", "scan", "reflowable", "converter"],
})
