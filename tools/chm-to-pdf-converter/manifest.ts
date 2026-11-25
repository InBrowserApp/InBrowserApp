import { defineTool } from "@workspace/tool-sdk"

export const tool = defineTool({
  category: "document",
  secondaryCategories: ["pdf", "ebook"],
  icon: "file-text",
  tags: [
    "chm",
    "pdf",
    "compiled html help",
    "windows help",
    "manual",
    "ebook",
    "converter",
  ],
})
