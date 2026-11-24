import { defineTool } from "@workspace/tool-sdk"

export const tool = defineTool({
  category: "pdf",
  secondaryCategories: ["text"],
  icon: "scan-text",
  tags: ["pdf", "ocr", "scanned pdf", "searchable pdf", "text recognition"],
})
